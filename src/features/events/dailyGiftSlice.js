
 // src/features/events/dailyGiftSlice.js

import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import {
    getDailyGiftStatus,
    claimDailyGift as requestDailyGiftClaim,
    getDailyGiftHistory,
    normalizeDailyGiftError,
} from "../../services/events/dailyGiftApi";

import {
    normalizeEventSlug,
} from "../../services/events/eventsApi";

import {
    logoutUser,
    signUserSuccess,
} from "../auth/Auth";

// =========================================================
// FSOCIETY — DAILY GIFT REDUX SLICE
// =========================================================
//
// New event-based Daily Gift state.
//
// Responsibilities:
// - Authenticated owner isolation
// - Per-event gift status
// - Per-event claim operation
// - Per-event history
// - Duplicate request prevention
// - Stale response protection
// - Logout cleanup
//
// This is NOT the Seasonal Gift slice.
//
// Existing legacy Daily Gift files remain untouched
// until the controlled migration stage.
//
// =========================================================


// =========================================================
// REQUEST STATUS
// =========================================================

export const DAILY_GIFT_REQUEST_STATUS =
    Object.freeze({
        IDLE: "idle",
        LOADING: "loading",
        SUCCEEDED: "succeeded",
        FAILED: "failed",
    });

const {
    IDLE,
    LOADING,
    SUCCEEDED,
    FAILED,
} = DAILY_GIFT_REQUEST_STATUS;


// =========================================================
// INITIAL STATE
// =========================================================

const createInitialState = (
    ownerId = null
) => ({
    ownerId,

    statusByEvent: {},
    statusRequestByEvent: {},
    statusErrorByEvent: {},

    claimByEvent: {},
    claimRequestByEvent: {},
    claimErrorByEvent: {},

    historyByEvent: {},
    historyRequestByEvent: {},
    historyErrorByEvent: {},

    pendingStatusIds: {},
    pendingClaimIds: {},
    pendingHistoryIds: {},
});


// =========================================================
// HELPERS
// =========================================================

const getSlug = (arg) => {
    const value =
        typeof arg === "string"
            ? arg
            : arg?.slug;

    return typeof value === "string"
        ? value.trim()
        : "";
};

const getOwnerId = (payload) => {
    const user =
        payload?.user ??
        payload?.data?.user ??
        payload?.data ??
        payload;

    const id = user?.id ?? user?.pk;

    if (
        id === null ||
        id === undefined ||
        id === ""
    ) {
        return null;
    }

    return String(id);
};

const canLoadPrivateGift = (state) => {
    return Boolean(
        state?.auth?.isLoggedIn &&
        state?.eventsDailyGift?.ownerId
    );
};

const isCanceled = (action) => {
    return Boolean(
        action.meta?.aborted ||
        action.payload?.canceled ||
        action.error?.name === "AbortError"
    );
};

const getActionError = (action) =>
    action.payload ?? {
        status: null,
        code: "REQUEST_FAILED",
        message: "So‘rovni bajarib bo‘lmadi.",
        canceled: false,
    };

const isCurrentOwner = (
    state,
    action
) => {
    return Boolean(
        state.ownerId &&
        state.ownerId ===
            action.payload?.ownerId
    );
};


// =========================================================
// THUNK — FETCH STATUS
// =========================================================

export const fetchDailyGiftStatusForEvent =
    createAsyncThunk(
        "eventsDailyGift/fetchStatus",

        async (
            arg,
            {
                getState,
                signal,
                rejectWithValue,
            }
        ) => {
            try {
                const slug = normalizeEventSlug(
                    getSlug(arg)
                );

                const ownerId =
                    getState()
                        .eventsDailyGift
                        .ownerId;

                const status =
                    await getDailyGiftStatus(
                        slug,
                        { signal }
                    );

                return {
                    slug,
                    ownerId,
                    status,
                };
            } catch (error) {
                return rejectWithValue(
                    normalizeDailyGiftError(error)
                );
            }
        },

        {
            condition: (
                arg,
                { getState }
            ) => {
                const state = getState();
                const slug = getSlug(arg);

                if (
                    !slug ||
                    !canLoadPrivateGift(state)
                ) {
                    return false;
                }

                return (
                    state.eventsDailyGift
                        .statusRequestByEvent[slug] !==
                    LOADING
                );
            },
        }
    );


// =========================================================
// THUNK — FETCH HISTORY
// =========================================================

export const fetchDailyGiftHistoryForEvent =
    createAsyncThunk(
        "eventsDailyGift/fetchHistory",

        async (
            arg,
            {
                getState,
                signal,
                rejectWithValue,
            }
        ) => {
            try {
                const slug = normalizeEventSlug(
                    getSlug(arg)
                );

                const ownerId =
                    getState()
                        .eventsDailyGift
                        .ownerId;

                const history =
                    await getDailyGiftHistory(
                        slug,
                        {
                            params: arg?.params,
                            signal,
                        }
                    );

                return {
                    slug,
                    ownerId,
                    history,
                };
            } catch (error) {
                return rejectWithValue(
                    normalizeDailyGiftError(error)
                );
            }
        },

        {
            condition: (
                arg,
                { getState }
            ) => {
                const state = getState();
                const slug = getSlug(arg);

                if (
                    !slug ||
                    !canLoadPrivateGift(state)
                ) {
                    return false;
                }

                return (
                    state.eventsDailyGift
                        .historyRequestByEvent[slug] !==
                    LOADING
                );
            },
        }
    );


// =========================================================
// THUNK — CLAIM DAILY GIFT
// =========================================================
//
// IMPORTANT:
//
// Must be called by an explicit user action.
// No automatic claim on mount.
// No automatic POST retry.
//
// After a successful claim, refetch status
// without affecting the claim result.
//
// =========================================================

export const claimDailyGiftForEvent =
    createAsyncThunk(
        "eventsDailyGift/claim",

        async (
            arg,
            {
                dispatch,
                getState,
                signal,
                rejectWithValue,
            }
        ) => {
            try {
                const slug = normalizeEventSlug(
                    getSlug(arg)
                );

                const ownerId =
                    getState()
                        .eventsDailyGift
                        .ownerId;

                const claim =
                    await requestDailyGiftClaim(
                        slug,
                        { signal }
                    );

                // Only a GET is performed here.
                // Never repeat the claim POST.
                dispatch(
                    fetchDailyGiftStatusForEvent(
                        slug
                    )
                );

                return {
                    slug,
                    ownerId,
                    claim,
                };
            } catch (error) {
                return rejectWithValue(
                    normalizeDailyGiftError(error)
                );
            }
        },

        {
            condition: (
                arg,
                { getState }
            ) => {
                const state = getState();
                const slug = getSlug(arg);

                if (
                    !slug ||
                    !canLoadPrivateGift(state)
                ) {
                    return false;
                }

                return (
                    state.eventsDailyGift
                        .claimRequestByEvent[slug] !==
                    LOADING
                );
            },
        }
    );


// =========================================================
// REDUX SLICE
// =========================================================

const dailyGiftSlice = createSlice({
    name: "eventsDailyGift",

    initialState: createInitialState(),

    reducers: {
        // ================================================
        // CLEAR STATUS ERROR
        // ================================================

        clearDailyGiftStatusError(
            state,
            action
        ) {
            const slug = getSlug(
                action.payload
            );

            if (!slug) {
                return;
            }

            delete state.statusErrorByEvent[slug];

            if (
                state.statusRequestByEvent[slug] ===
                FAILED
            ) {
                state.statusRequestByEvent[slug] =
                    IDLE;
            }
        },

        // ================================================
        // CLEAR CLAIM ERROR
        // ================================================

        clearDailyGiftClaimError(
            state,
            action
        ) {
            const slug = getSlug(
                action.payload
            );

            if (!slug) {
                return;
            }

            delete state.claimErrorByEvent[slug];

            if (
                state.claimRequestByEvent[slug] ===
                FAILED
            ) {
                state.claimRequestByEvent[slug] =
                    IDLE;
            }
        },

        // ================================================
        // INVALIDATE ONE EVENT
        // ================================================

        invalidateDailyGiftEvent(
            state,
            action
        ) {
            const slug = getSlug(
                action.payload
            );

            if (!slug) {
                return;
            }

            delete state.statusByEvent[slug];
            delete state.historyByEvent[slug];

            if (
                state.statusRequestByEvent[slug] !==
                LOADING
            ) {
                state.statusRequestByEvent[slug] =
                    IDLE;
            }

            if (
                state.historyRequestByEvent[slug] !==
                LOADING
            ) {
                state.historyRequestByEvent[slug] =
                    IDLE;
            }
        },

        // ================================================
        // RESET PRIVATE GIFT STATE
        // ================================================

        resetDailyGiftState() {
            return createInitialState();
        },
    },

    extraReducers: (builder) => {
        // ================================================
        // AUTH LOGIN
        // ================================================

        builder.addCase(
            signUserSuccess,
            (state, action) => {
                const nextOwnerId =
                    getOwnerId(action.payload);

                if (
                    nextOwnerId !== state.ownerId
                ) {
                    return createInitialState(
                        nextOwnerId
                    );
                }
            }
        );

        // ================================================
        // AUTH LOGOUT
        // ================================================

        builder.addCase(
            logoutUser,
            () => createInitialState()
        );

        // ================================================
        // STATUS — PENDING
        // ================================================

        builder.addCase(
            fetchDailyGiftStatusForEvent.pending,
            (state, action) => {
                const slug = getSlug(
                    action.meta.arg
                );

                state.statusRequestByEvent[slug] =
                    LOADING;

                state.statusErrorByEvent[slug] =
                    null;

                state.pendingStatusIds[slug] =
                    action.meta.requestId;
            }
        );

        // ================================================
        // STATUS — SUCCESS
        // ================================================

        builder.addCase(
            fetchDailyGiftStatusForEvent.fulfilled,
            (state, action) => {
                const {
                    slug,
                    status,
                } = action.payload;

                if (
                    !isCurrentOwner(
                        state,
                        action
                    ) ||
                    state.pendingStatusIds[slug] !==
                        action.meta.requestId
                ) {
                    return;
                }

                state.statusByEvent[slug] = status;

                state.statusRequestByEvent[slug] =
                    SUCCEEDED;

                state.statusErrorByEvent[slug] =
                    null;

                delete state.pendingStatusIds[slug];
            }
        );

        // ================================================
        // STATUS — REJECTED
        // ================================================

        builder.addCase(
            fetchDailyGiftStatusForEvent.rejected,
            (state, action) => {
                const slug = getSlug(
                    action.meta.arg
                );

                if (
                    state.pendingStatusIds[slug] !==
                    action.meta.requestId
                ) {
                    return;
                }

                delete state.pendingStatusIds[slug];

                state.statusRequestByEvent[slug] =
                    isCanceled(action)
                        ? IDLE
                        : FAILED;

                state.statusErrorByEvent[slug] =
                    isCanceled(action)
                        ? null
                        : getActionError(action);
            }
        );

        // ================================================
        // HISTORY — PENDING
        // ================================================

        builder.addCase(
            fetchDailyGiftHistoryForEvent.pending,
            (state, action) => {
                const slug = getSlug(
                    action.meta.arg
                );

                state.historyRequestByEvent[slug] =
                    LOADING;

                state.historyErrorByEvent[slug] =
                    null;

                state.pendingHistoryIds[slug] =
                    action.meta.requestId;
            }
        );

        // ================================================
        // HISTORY — SUCCESS
        // ================================================

        builder.addCase(
            fetchDailyGiftHistoryForEvent.fulfilled,
            (state, action) => {
                const {
                    slug,
                    history,
                } = action.payload;

                if (
                    !isCurrentOwner(
                        state,
                        action
                    ) ||
                    state.pendingHistoryIds[slug] !==
                        action.meta.requestId
                ) {
                    return;
                }

                state.historyByEvent[slug] =
                    history;

                state.historyRequestByEvent[slug] =
                    SUCCEEDED;

                state.historyErrorByEvent[slug] =
                    null;

                delete state.pendingHistoryIds[slug];
            }
        );

        // ================================================
        // HISTORY — REJECTED
        // ================================================

        builder.addCase(
            fetchDailyGiftHistoryForEvent.rejected,
            (state, action) => {
                const slug = getSlug(
                    action.meta.arg
                );

                if (
                    state.pendingHistoryIds[slug] !==
                    action.meta.requestId
                ) {
                    return;
                }

                delete state.pendingHistoryIds[slug];

                state.historyRequestByEvent[slug] =
                    isCanceled(action)
                        ? IDLE
                        : FAILED;

                state.historyErrorByEvent[slug] =
                    isCanceled(action)
                        ? null
                        : getActionError(action);
            }
        );

        // ================================================
        // CLAIM — PENDING
        // ================================================

        builder.addCase(
            claimDailyGiftForEvent.pending,
            (state, action) => {
                const slug = getSlug(
                    action.meta.arg
                );

                state.claimRequestByEvent[slug] =
                    LOADING;

                state.claimErrorByEvent[slug] =
                    null;

                state.pendingClaimIds[slug] =
                    action.meta.requestId;
            }
        );

        // ================================================
        // CLAIM — SUCCESS
        // ================================================

        builder.addCase(
            claimDailyGiftForEvent.fulfilled,
            (state, action) => {
                const {
                    slug,
                    claim,
                } = action.payload;

                if (
                    !isCurrentOwner(
                        state,
                        action
                    ) ||
                    state.pendingClaimIds[slug] !==
                        action.meta.requestId
                ) {
                    return;
                }

                state.claimByEvent[slug] = claim;

                state.claimRequestByEvent[slug] =
                    SUCCEEDED;

                state.claimErrorByEvent[slug] =
                    null;

                // The server now owns the new truth.
                // Existing history must be refetched.
                delete state.historyByEvent[slug];

                state.historyRequestByEvent[slug] =
                    IDLE;

                delete state.pendingClaimIds[slug];
            }
        );

        // ================================================
        // CLAIM — REJECTED
        // ================================================

        builder.addCase(
            claimDailyGiftForEvent.rejected,
            (state, action) => {
                const slug = getSlug(
                    action.meta.arg
                );

                if (
                    state.pendingClaimIds[slug] !==
                    action.meta.requestId
                ) {
                    return;
                }

                delete state.pendingClaimIds[slug];

                state.claimRequestByEvent[slug] =
                    isCanceled(action)
                        ? IDLE
                        : FAILED;

                state.claimErrorByEvent[slug] =
                    isCanceled(action)
                        ? null
                        : getActionError(action);
            }
        );
    },
});


// =========================================================
// ACTIONS
// =========================================================

export const {
    clearDailyGiftStatusError,
    clearDailyGiftClaimError,
    invalidateDailyGiftEvent,
    resetDailyGiftState,
} = dailyGiftSlice.actions;


// =========================================================
// SELECTORS
// =========================================================

const selectSlice = (state) =>
    state.eventsDailyGift ?? createInitialState();

export const selectDailyGiftOwner = (state) =>
    selectSlice(state).ownerId;

export const selectDailyGiftEventStatus = (
    state,
    slug
) =>
    selectSlice(state).statusByEvent[slug] ??
    null;

export const selectDailyGiftEventStatusLoading = (
    state,
    slug
) =>
    selectSlice(state)
        .statusRequestByEvent[slug] === LOADING;

export const selectDailyGiftEventStatusError = (
    state,
    slug
) =>
    selectSlice(state)
        .statusErrorByEvent[slug] ?? null;

export const selectDailyGiftEventClaim = (
    state,
    slug
) =>
    selectSlice(state).claimByEvent[slug] ??
    null;

export const selectDailyGiftEventClaimLoading = (
    state,
    slug
) =>
    selectSlice(state)
        .claimRequestByEvent[slug] === LOADING;

export const selectDailyGiftEventClaimError = (
    state,
    slug
) =>
    selectSlice(state)
        .claimErrorByEvent[slug] ?? null;

export const selectDailyGiftEventHistory = (
    state,
    slug
) =>
    selectSlice(state).historyByEvent[slug] ??
    null;

export const selectDailyGiftEventHistoryLoading = (
    state,
    slug
) =>
    selectSlice(state)
        .historyRequestByEvent[slug] === LOADING;

export const selectDailyGiftEventHistoryError = (
    state,
    slug
) =>
    selectSlice(state)
        .historyErrorByEvent[slug] ?? null;


// =========================================================
// REDUCER
// =========================================================

export default dailyGiftSlice.reducer;
