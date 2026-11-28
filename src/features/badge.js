
// src/features/badge.js

import {
    createAsyncThunk,
    createSlice,
    isAnyOf,
} from "@reduxjs/toolkit";

import BadgeService from "../services/badge";
import { claimDailyGiftForEvent } from "./events/dailyGiftSlice";

// =========================================================
// UNIVERSAL EVENT GIFT
// =========================================================

import {
    claimSeasonalGiftForEvent,
} from "./events/seasonalGiftSlice";

// =========================================================
// AUTHENTICATION
// =========================================================

import {
    logoutUser,
    checkAuthFailure,
    checkAuthSuccess,
    signUserStart,
    signUserSuccess,
    signUserFailure,
    signUserFailer,
} from "./auth/Auth";

// =========================================================
// FSOCIETY — BADGES & ACHIEVEMENTS
// =========================================================
//
// Features:
//
// - Profile achievements
// - Server pagination
// - Local pagination fallback
// - Search and filtering
// - Recent achievements
// - Request deduplication
// - Stale response protection
// - Auth owner isolation
// - Event Gift reward synchronization
//
// IMPORTANT:
//
// Daily and Seasonal claims invalidate the authoritative collection.
//
// Seasonal Gift claims may grant:
// - FCoin
// - Badge
// - Profile Frame
// - Other backend-supported rewards
//
// Badge ownership is always determined
// by the Django backend.
//
// =========================================================


// =========================================================
// CONSTANTS
// =========================================================

// Must match the backend source filter.
// Verify this value when integrating
// the achievements filter endpoint.

const EVENT_BADGE_SOURCE = "seasonal_gift";


// =========================================================
// AUTH HELPERS
// =========================================================

const getUserFromPayload = (payload) =>
    payload?.user ??
    payload?.data?.user ??
    payload?.data ??
    payload;

const normalizeOwnerId = (value) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    return String(value);
};

const getOwnerIdFromPayload = (payload) => {
    const user = getUserFromPayload(payload);

    return normalizeOwnerId(
        user?.id ?? user?.pk
    );
};


// =========================================================
// ACHIEVEMENT REQUEST KEY
// =========================================================

export const achievementRequestKey = ({
    username,
    page = 1,
    search = "",
    filter = "",
}) =>
    JSON.stringify([
        username,
        page,
        search,
        filter,
    ]);


// =========================================================
// ACHIEVEMENT LIST VALIDATION
// =========================================================

const isAchievementList = (value) =>
    Array.isArray(value) &&
    value.every(
        (item) =>
            item &&
            typeof item.badge?.name ===
                "string" &&
            (
                item.id != null ||
                item.badge_id != null ||
                typeof item.badge.code ===
                    "string"
            )
    );


// =========================================================
// NORMALIZE ACHIEVEMENT RESPONSE
// =========================================================
//
// Supported formats:
//
// 1. Server-paginated achievements
// 2. Complete legacy badge collection
//
// Only a full collection may be searched
// and paginated locally.
//
// =========================================================

export function normalizeAchievementResponse(
    data,
    {
        page = 1,
        search = "",
        filter = "",
    } = {},
    includeRecent = true
) {
    // =====================================================
    // SERVER PAGINATION
    // =====================================================

    if (
        isAchievementList(data?.results)
    ) {
        if (
            !Number.isSafeInteger(
                data.count
            ) ||
            data.count < 0 ||
            (
                data.total_badges != null &&
                (
                    !Number.isSafeInteger(
                        data.total_badges
                    ) ||
                    data.total_badges < 0
                )
            ) ||
            (
                includeRecent &&
                !isAchievementList(
                    data.recent_badges
                )
            ) ||
            (
                data.recent_badges !==
                    undefined &&
                !isAchievementList(
                    data.recent_badges
                )
            )
        ) {
            throw new Error(
                "Invalid paginated achievements response"
            );
        }

        return {
            ...data,

            total_badges:
                data.total_badges ??
                data.count,

            supportsFilters: true,
        };
    }

    // =====================================================
    // LEGACY FULL COLLECTION
    // =====================================================

    if (
        !isAchievementList(
            data?.badges
        ) ||
        (
            data.total_badges !==
                undefined &&
            data.total_badges !==
                data.badges.length
        ) ||
        filter
    ) {
        throw new Error(
            "Invalid achievements response"
        );
    }

    // =====================================================
    // SORT ACHIEVEMENTS
    // =====================================================

    const all = [
        ...data.badges,
    ].sort(
        (left, right) => {
            const dateDifference =
                (
                    Date.parse(
                        right.awarded_at
                    ) || 0
                ) -
                (
                    Date.parse(
                        left.awarded_at
                    ) || 0
                );

            if (dateDifference) {
                return dateDifference;
            }

            if (
                Number.isSafeInteger(
                    left.id
                ) &&
                Number.isSafeInteger(
                    right.id
                )
            ) {
                return right.id - left.id;
            }

            return String(
                right.badge.code ??
                right.badge_id ??
                right.id
            ).localeCompare(
                String(
                    left.badge.code ??
                    left.badge_id ??
                    left.id
                )
            );
        }
    );

    // =====================================================
    // LOCAL SEARCH
    // =====================================================

    const term = search
        .trim()
        .toLocaleLowerCase();

    const filtered = term
        ? all.filter(
            (item) =>
                [
                    item.badge.name,
                    item.badge.description,
                    item.badge.code,
                ].some(
                    (value) =>
                        typeof value ===
                            "string" &&
                        value
                            .toLocaleLowerCase()
                            .includes(term)
                )
        )
        : all;

    // =====================================================
    // LOCAL PAGINATION
    // =====================================================

    return {
        results: filtered.slice(
            (page - 1) * 12,
            page * 12
        ),

        count: filtered.length,

        total_badges: all.length,

        supportsFilters: false,

        ...(
            includeRecent
                ? {
                    recent_badges:
                        all.slice(0, 3),
                }
                : {}
        ),
    };
}


// =========================================================
// FETCH PROFILE ACHIEVEMENTS
// =========================================================

export const fetchProfileAchievements =
    createAsyncThunk(
        "badge/fetchProfileAchievements",

        async (
            {
                username,
                page = 1,
                search = "",
                filter = "",
            },
            {
                signal,
                getState,
                rejectWithValue,
            }
        ) => {
            // =============================================
            // BACKEND FILTERS
            // =============================================

            const filters =
                filter === "secret"
                    ? {
                        is_secret: "true",
                    }
                    : filter === "event"
                      ? {
                          source:
                              EVENT_BADGE_SOURCE,
                      }
                      : filter === "achievement"
                        ? {
                            reward_type:
                                "achievement",
                        }
                        : filter
                          ? {
                              rarity: filter,
                          }
                          : {};

            try {
                const state =
                    getState().badge;

                const includeRecent =
                    state.collection
                        .recentRevision !==
                    state.revision;

                const data =
                    await BadgeService.getUserBadges(
                        username,
                        {
                            signal,
                            page,
                            page_size: 12,
                            search,

                            include_recent:
                                includeRecent
                                    ? 1
                                    : undefined,

                            ...filters,
                        }
                    );

                return normalizeAchievementResponse(
                    data,
                    {
                        page,
                        search,
                        filter,
                    },
                    includeRecent
                );
            } catch (error) {
                if (signal.aborted) {
                    throw error;
                }

                return rejectWithValue(
                    "Yutuqlarni yuklab bo‘lmadi. " +
                    "Qayta urinib ko‘ring."
                );
            }
        },

        {
            condition: (
                args,
                { getState }
            ) => {
                const collection =
                    getState().badge.collection;

                return !(
                    collection.status ===
                        "loading" &&
                    collection.key ===
                        achievementRequestKey(
                            args
                        )
                );
            },
        }
    );


// =========================================================
// EMPTY COLLECTION
// =========================================================

const emptyCollection = () => ({
    username: null,

    key: null,

    requestId: null,

    status: "idle",

    error: null,

    results: [],

    recent: [],

    recentRevision: -1,

    total: 0,

    count: 0,

    supportsFilters: true,
});


// =========================================================
// INITIAL STATE
// =========================================================

const initialState = {
    isLoading: false,

    userBadges: [],

    totalBadges: 0,

    error: null,

    collection:
        emptyCollection(),

    revision: 0,

    authOwnerId: null,
};


// =========================================================
// BADGE SLICE
// =========================================================

export const BadgeSlice = createSlice({
    name: "badge",

    initialState,

    reducers: {
        // ================================================
        // CANCEL ACHIEVEMENT REQUEST
        // ================================================

        cancelAchievementRequest: (
            state,
            action
        ) => {
            if (
                state.collection.requestId ===
                action.payload
            ) {
                state.collection.requestId =
                    null;

                state.collection.status =
                    "idle";
            }
        },

        // ================================================
        // GET BADGES START
        // ================================================

        getBadgesStart: (state) => {
            state.isLoading = true;

            state.error = null;
        },

        // ================================================
        // GET BADGES SUCCESS
        // ================================================

        getBadgesSuccess: (
            state,
            action
        ) => {
            state.isLoading = false;

            state.userBadges =
                action.payload.badges || [];

            state.totalBadges =
                action.payload.total_badges || 0;
        },

        // ================================================
        // GET BADGES FAILURE
        // ================================================

        getBadgesFailure: (
            state,
            action
        ) => {
            state.isLoading = false;

            state.error = action.payload;

            state.userBadges = [];
        },
    },

    extraReducers: (builder) => {
        // ================================================
        // ACHIEVEMENTS — PENDING
        // ================================================

        builder.addCase(
            fetchProfileAchievements.pending,
            (state, action) => {
                const username =
                    action.meta.arg.username;

                if (
                    state.collection.username !==
                    username
                ) {
                    state.collection =
                        emptyCollection();
                }

                Object.assign(
                    state.collection,
                    {
                        username,

                        key:
                            achievementRequestKey(
                                action.meta.arg
                            ),

                        requestId:
                            action.meta.requestId,

                        status: "loading",

                        error: null,
                    }
                );
            }
        );

        // ================================================
        // ACHIEVEMENTS — FULFILLED
        // ================================================

        builder.addCase(
            fetchProfileAchievements.fulfilled,
            (state, action) => {
                if (
                    state.collection.requestId !==
                    action.meta.requestId
                ) {
                    return;
                }

                Object.assign(
                    state.collection,
                    {
                        requestId: null,

                        status: "success",

                        error: null,

                        results:
                            action.payload.results,

                        total:
                            action.payload.total_badges,

                        count:
                            action.payload.count,

                        supportsFilters:
                            action.payload
                                .supportsFilters !==
                            false,
                    }
                );

                if (
                    Array.isArray(
                        action.payload
                            .recent_badges
                    )
                ) {
                    state.collection.recent =
                        action.payload
                            .recent_badges;

                    state.collection.recentRevision =
                        state.revision;
                }
            }
        );

        // ================================================
        // ACHIEVEMENTS — REJECTED
        // ================================================

        builder.addCase(
            fetchProfileAchievements.rejected,
            (state, action) => {
                if (
                    state.collection.requestId !==
                    action.meta.requestId
                ) {
                    return;
                }

                state.collection.requestId =
                    null;

                state.collection.status =
                    action.meta.aborted
                        ? "idle"
                        : "failed";

                state.collection.error =
                    action.payload;
            }
        );

        // ================================================
        // EVENT GIFT CLAIM SUCCESS
        // ================================================
        //
        // A Seasonal Gift may grant a Badge.
        //
        // Never append a badge locally from
        // an unverified reward preview.
        //
        // Invalidate the collection and let
        // the backend provide the new list.
        //
        // Ignore claims from an old account.
        //
        // ================================================

        builder.addCase(
            claimSeasonalGiftForEvent.fulfilled,
            (state, action) => {
                const claimOwnerId =
                    normalizeOwnerId(
                        action.payload?.ownerId
                    );

                if (
                    !claimOwnerId ||
                    claimOwnerId !==
                        state.authOwnerId
                ) {
                    return;
                }

                state.revision += 1;

                state.collection.requestId =
                    null;

                state.collection.status =
                    "idle";

                state.collection.key =
                    null;

                state.collection.recentRevision =
                    -1;
            }
        );

        // ================================================
        // AUTH CHECK SUCCESS
        // ================================================

        builder.addCase(
            checkAuthSuccess,
            (state, action) => {
                const ownerId =
                    getOwnerIdFromPayload(
                        action.payload
                    );

                if (
                    state.authOwnerId !==
                    ownerId
                ) {
                    state.collection =
                        emptyCollection();

                    state.revision += 1;

                    state.authOwnerId =
                        ownerId;
                }
            }
        );

        // ================================================
        // AUTH RESET / OWNER CHANGE
        // ================================================

        builder.addMatcher(claimDailyGiftForEvent.fulfilled.match, (state, action) => {
            if (normalizeOwnerId(action.payload?.ownerId) !== state.authOwnerId) return;
            state.revision += 1;
            state.collection.requestId = null;
            state.collection.status = "idle";
            state.collection.key = null;
            state.collection.recentRevision = -1;
        });

        builder.addMatcher(
            isAnyOf(
                logoutUser,
                checkAuthFailure,
                signUserStart,
                signUserSuccess,
                signUserFailure,
                signUserFailer
            ),

            (state, action) => ({
                ...initialState,

                collection:
                    emptyCollection(),

                revision:
                    state.revision + 1,

                authOwnerId:
                    signUserSuccess.match(
                        action
                    )
                        ? getOwnerIdFromPayload(
                            action.payload
                        )
                        : null,
            })
        );
    },
});


// =========================================================
// ACTIONS
// =========================================================

export const {
    getBadgesStart,
    getBadgesSuccess,
    getBadgesFailure,
    cancelAchievementRequest,
} = BadgeSlice.actions;


// =========================================================
// REDUCER
// =========================================================

export default BadgeSlice.reducer;
