
 // src/features/events/dailyGiftSlice.js

import {
    createAsyncThunk,
    createSlice,
    isAnyOf,
} from "@reduxjs/toolkit";

import {
    getDailyGiftStatus,
    getDailyGiftHistory,
    claimDailyGift as requestDailyGiftClaim,
    normalizeDailyGiftError,
} from "../../services/events/dailyGiftApi";

import {
    normalizeEventSlug,
} from "../../services/events/eventsApi";

import {
    logoutUser,
    signUserSuccess,
    signUserFailure,
    signUserFailer,
    checkAuthSuccess,
    checkAuthFailure,
} from "../auth/Auth";

// =========================================================
// FSOCIETY — DAILY GIFT REDUX
// =========================================================
//
// Location:
// src/features/events/dailyGiftSlice.js
//
// Daily Gift:
// One claim per user / event / local day.
//
// Features:
// - Per-event state
// - User ownership isolation
// - Auth synchronization
// - Request deduplication
// - Stale response protection
// - Safe claim handling
// - Unknown claim result protection
// - History invalidation
// - Logout cleanup
//
// IMPORTANT:
// The backend controls eligibility and rewards.
// No FCoin balance is modified in this slice.
//
// =========================================================


// =========================================================
// CONSTANTS
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

const SLUG_PATTERN = /^[a-zA-Z0-9_-]+$/;

const UNCERTAIN_HTTP_STATUSES = new Set([
    408,
    409,
    500,
    502,
    503,
    504,
]);


// =========================================================
// INITIAL STATE
// =========================================================

const createInitialState = (ownerId = null) => ({
    ownerId,

    statusByEvent: {},
    claimByEvent: {},
    historyByEvent: {},

    statusRequestByEvent: {},
    claimRequestByEvent: {},
    historyRequestByEvent: {},

    statusErrorByEvent: {},
    claimErrorByEvent: {},
    historyErrorByEvent: {},

    pendingStatusIds: {},
    pendingClaimIds: {},
    pendingHistoryIds: {},

    statusFetchedAtByEvent: {},

    needsReconciliationByEvent: {},
});

const EMPTY_STATE = createInitialState();


// =========================================================
// COMMON HELPERS
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

const isValidSlug = (slug) =>
    typeof slug === "string" &&
    SLUG_PATTERN.test(slug);

const getOwnerId = (payload) => {
    const user =
        payload?.user ??
        payload?.data?.user ??
        payload?.data ??
        payload;

    const id = user?.id ?? user?.pk;

    return id === null ||
        id === undefined ||
        id === ""
        ? null
        : String(id);
};

const selectSlice = (state) =>
    state?.eventsDailyGift ?? EMPTY_STATE;

const isSessionReady = (state) => {
    const ownerId = selectSlice(state).ownerId;

    return Boolean(
        state?.auth?.isLoggedIn &&
        ownerId &&
        getOwnerId(state.auth?.user) === ownerId
    );
};

const isCurrentOwner = (state, ownerId) =>
    Boolean(
        state.ownerId &&
        state.ownerId === ownerId
    );

const isCanceled = (action) =>
    Boolean(
        action.meta?.aborted ||
        action.payload?.canceled ||
        action.error?.name === "AbortError"
    );

const getActionError = (action) =>
    action.payload ?? {
        status: null,
        code: "REQUEST_FAILED",
        message: "So‘rov bajarilmadi.",
        canceled: false,
    };


// =========================================================
// BACKEND ELIGIBILITY HELPERS
// =========================================================
//
// The real claim decision belongs to Django.
//
// Support direct and nested response objects.
//
// =========================================================

const getStatusCandidates = (payload) => [
    payload,
    payload?.data,
    payload?.gift,
    payload?.eligibility,
    payload?.data?.gift,
    payload?.data?.eligibility,
];

const serverCanClaim = (payload) =>
    getStatusCandidates(payload).some(
        (item) => item?.can_claim === true
    );

const serverClaimedToday = (payload) =>
    getStatusCandidates(payload).some(
        (item) =>
            item?.already_claimed === true ||
            item?.claimed_today === true
    );

const hasAuthoritativeDecision = (payload) =>
    getStatusCandidates(payload).some(
        (item) =>
            typeof item?.can_claim === "boolean" ||
            typeof item?.already_claimed === "boolean" ||
            typeof item?.claimed_today === "boolean"
    );

const isUncertainClaimError = (error) =>
    error.status == null ||
    UNCERTAIN_HTTP_STATUSES.has(error.status);


// =========================================================
// FETCH DAILY GIFT STATUS
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
                    selectSlice(getState()).ownerId;

                const status =
                    await getDailyGiftStatus(
                        slug,
                        { signal }
                    );

                return {
                    slug,
                    ownerId,
                    status,
                    fetchedAt: Date.now(),
                };
            } catch (error) {
                return rejectWithValue(
                    normalizeDailyGiftError(error)
                );
            }
        },

        {
            condition: (arg, { getState }) => {
                const state = getState();
                const slug = getSlug(arg);

                if (
                    !isValidSlug(slug) ||
                    !isSessionReady(state)
                ) {
                    return false;
                }

                const slice = selectSlice(state);

                return (
                    slice.statusRequestByEvent[slug] !==
                        LOADING &&
                    slice.claimRequestByEvent[slug] !==
                        LOADING
                );
            },
        }
    );


// =========================================================
// FETCH DAILY GIFT HISTORY
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
                    selectSlice(getState()).ownerId;

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
            condition: (arg, { getState }) => {
                const state = getState();
                const slug = getSlug(arg);

                if (
                    !isValidSlug(slug) ||
                    !isSessionReady(state)
                ) {
                    return false;
                }

                return (
                    selectSlice(state)
                        .historyRequestByEvent[slug] !==
                    LOADING
                );
            },
        }
    );


// =========================================================
// CLAIM DAILY GIFT
// =========================================================
//
// Only one POST per click.
//
// A previously received gift does NOT block
// claiming on another eligible local day.
//
// The backend must explicitly report
// can_claim=true for the current day.
//
// =========================================================

export const claimDailyGiftForEvent =
    createAsyncThunk(
        "eventsDailyGift/claim",

        async (
            arg,
            {
                getState,
                rejectWithValue,
            }
        ) => {
            try {
                const slug = normalizeEventSlug(
                    getSlug(arg)
                );

                const ownerId =
                    selectSlice(getState()).ownerId;

                const claim =
                    await requestDailyGiftClaim(
                        slug
                    );

                return {
                    slug,
                    ownerId,
                    claim,
                    claimedAt: Date.now(),
                };
            } catch (error) {
                const normalized =
                    normalizeDailyGiftError(error);

                return rejectWithValue({
                    ...normalized,
                    needsReconciliation:
                        isUncertainClaimError(
                            normalized
                        ),
                });
            }
        },

        {
            condition: (arg, { getState }) => {
                const state = getState();
                const slug = getSlug(arg);

                if (
                    !isValidSlug(slug) ||
                    !isSessionReady(state)
                ) {
                    return false;
                }

                const slice = selectSlice(state);

                if (
                    slice.claimRequestByEvent[slug] ===
                        LOADING ||
                    slice.needsReconciliationByEvent[
                        slug
                    ] === true ||
                    slice.statusRequestByEvent[slug] ===
                        LOADING
                ) {
                    return false;
                }

                // Do not block based on an old
                // claimByEvent value: the next local
                // day may already be eligible.
                return serverCanClaim(
                    slice.statusByEvent[slug]
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
        // ---------------------------------------------
        // CLEAR STATUS ERROR
        // ---------------------------------------------

        clearDailyGiftStatusError(state, action) {
            const slug = getSlug(action.payload);

            if (!isValidSlug(slug)) return;

            delete state.statusErrorByEvent[slug];

            if (
                state.statusRequestByEvent[slug] ===
                FAILED
            ) {
                state.statusRequestByEvent[slug] =
                    IDLE;
            }
        },

        // ---------------------------------------------
        // CLEAR CLAIM ERROR
        // ---------------------------------------------

        clearDailyGiftClaimError(state, action) {
            const slug = getSlug(action.payload);

            if (!isValidSlug(slug)) return;

            delete state.claimErrorByEvent[slug];

            if (
                state.claimRequestByEvent[slug] ===
                FAILED
            ) {
                state.claimRequestByEvent[slug] =
                    IDLE;
            }

            // Never clear reconciliation here.
        },

        // ---------------------------------------------
        // CLEAR HISTORY ERROR
        // ---------------------------------------------

        clearDailyGiftHistoryError(state, action) {
            const slug = getSlug(action.payload);

            if (!isValidSlug(slug)) return;

            delete state.historyErrorByEvent[slug];

            if (
                state.historyRequestByEvent[slug] ===
                FAILED
            ) {
                state.historyRequestByEvent[slug] =
                    IDLE;
            }
        },

        // ---------------------------------------------
        // INVALIDATE STATUS AND HISTORY
        // ---------------------------------------------

        invalidateDailyGiftEvent(state, action) {
            const slug = getSlug(action.payload);

            if (!isValidSlug(slug)) return;

            delete state.statusByEvent[slug];
            delete state.historyByEvent[slug];
            delete state.statusFetchedAtByEvent[slug];

            delete state.pendingStatusIds[slug];
            delete state.pendingHistoryIds[slug];

            state.statusRequestByEvent[slug] = IDLE;
            state.historyRequestByEvent[slug] = IDLE;

            delete state.statusErrorByEvent[slug];
            delete state.historyErrorByEvent[slug];

            // Preserve claim result and unresolved
            // request state.
        },

        // ---------------------------------------------
        // RESET PRIVATE STATE
        // ---------------------------------------------

        resetDailyGiftState() {
            return createInitialState();
        },
    },

    extraReducers: (builder) => {
        // =============================================
        // STATUS REQUEST
        // =============================================

        builder
            .addCase(
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
            )
            .addCase(
                fetchDailyGiftStatusForEvent.fulfilled,
                (state, action) => {
                    const {
                        slug,
                        ownerId,
                        status,
                        fetchedAt,
                    } = action.payload;

                    if (
                        !isCurrentOwner(state, ownerId) ||
                        state.pendingStatusIds[slug] !==
                            action.meta.requestId
                    ) {
                        return;
                    }

                    state.statusByEvent[slug] = status;

                    state.statusFetchedAtByEvent[slug] =
                        fetchedAt;

                    state.statusRequestByEvent[slug] =
                        SUCCEEDED;

                    state.statusErrorByEvent[slug] =
                        null;

                    if (
                        hasAuthoritativeDecision(status)
                    ) {
                        state.needsReconciliationByEvent[
                            slug
                        ] = false;
                    }

                    delete state.pendingStatusIds[slug];
                }
            )
            .addCase(
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

        // =============================================
        // HISTORY REQUEST
        // =============================================

        builder
            .addCase(
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
            )
            .addCase(
                fetchDailyGiftHistoryForEvent.fulfilled,
                (state, action) => {
                    const {
                        slug,
                        ownerId,
                        history,
                    } = action.payload;

                    if (
                        !isCurrentOwner(state, ownerId) ||
                        state.pendingHistoryIds[slug] !==
                            action.meta.requestId
                    ) {
                        return;
                    }

                    state.historyByEvent[slug] = history;

                    state.historyRequestByEvent[slug] =
                        SUCCEEDED;

                    state.historyErrorByEvent[slug] =
                        null;

                    delete state.pendingHistoryIds[slug];
                }
            )
            .addCase(
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

        // =============================================
        // CLAIM REQUEST
        // =============================================

        builder
            .addCase(
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

                    // Ignore status GETs that began
                    // before this POST.
                    delete state.pendingStatusIds[slug];

                    state.statusRequestByEvent[slug] =
                        IDLE;
                }
            )
            .addCase(
                claimDailyGiftForEvent.fulfilled,
                (state, action) => {
                    const {
                        slug,
                        ownerId,
                        claim,
                    } = action.payload;

                    if (
                        !isCurrentOwner(state, ownerId) ||
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

                    state.needsReconciliationByEvent[
                        slug
                    ] = false;

                    // The previous eligibility and
                    // history are now stale.
                    delete state.statusByEvent[slug];
                    delete state.historyByEvent[slug];

                    delete state.statusFetchedAtByEvent[
                        slug
                    ];

                    delete state.pendingHistoryIds[slug];

                    state.statusRequestByEvent[slug] =
                        IDLE;

                    state.historyRequestByEvent[slug] =
                        IDLE;

                    delete state.pendingClaimIds[slug];
                }
            )
            .addCase(
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

                    const error = getActionError(
                        action
                    );

                    state.claimRequestByEvent[slug] =
                        FAILED;

                    state.claimErrorByEvent[slug] =
                        error;

                    state.needsReconciliationByEvent[
                        slug
                    ] =
                        error.needsReconciliation ===
                            true ||
                        isCanceled(action);
                }
            );

        // =============================================
        // AUTH SUCCESS / USER CHANGE
        // =============================================

        builder.addMatcher(
            isAnyOf(
                signUserSuccess,
                checkAuthSuccess
            ),
            (state, action) => {
                const nextOwnerId = getOwnerId(
                    action.payload
                );

                if (
                    nextOwnerId !== state.ownerId
                ) {
                    return createInitialState(
                        nextOwnerId
                    );
                }
            }
        );

        // =============================================
        // LOGOUT / AUTH FAILURE
        // =============================================

        builder.addMatcher(
            isAnyOf(
                logoutUser,
                checkAuthFailure,
                signUserFailure,
                signUserFailer
            ),
            () => createInitialState()
        );
    },
});


// =========================================================
// ACTIONS
// =========================================================

export const {
    clearDailyGiftStatusError,
    clearDailyGiftClaimError,
    clearDailyGiftHistoryError,
    invalidateDailyGiftEvent,
    resetDailyGiftState,
} = dailyGiftSlice.actions;


// =========================================================
// SELECTORS — OWNER
// =========================================================

export const selectDailyGiftOwner = (state) =>
    selectSlice(state).ownerId;


// =========================================================
// SELECTORS — STATUS
// =========================================================

export const selectDailyGiftEventStatus = (
    state,
    slug
) =>
    selectSlice(state).statusByEvent[slug] ?? null;

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

export const selectDailyGiftStatusFetchedAt = (
    state,
    slug
) =>
    selectSlice(state)
        .statusFetchedAtByEvent[slug] ?? null;


// =========================================================
// SELECTORS — CLAIM
// =========================================================

export const selectDailyGiftEventClaim = (
    state,
    slug
) =>
    selectSlice(state).claimByEvent[slug] ?? null;

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

export const selectDailyGiftNeedsReconciliation = (
    state,
    slug
) =>
    selectSlice(state)
        .needsReconciliationByEvent[slug] === true;


// =========================================================
// SELECTORS — HISTORY
// =========================================================

export const selectDailyGiftEventHistory = (
    state,
    slug
) =>
    selectSlice(state).historyByEvent[slug] ?? null;

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
// SELECTORS — DERIVED STATE
// =========================================================

export const selectDailyGiftAlreadyClaimed = (
    state,
    slug
) => {
    const slice = selectSlice(state);

    const status = slice.statusByEvent[slug];

    // A newly eligible local day overrides
    // any claim result from yesterday.
    if (serverCanClaim(status)) {
        return false;
    }

    if (serverClaimedToday(status)) {
        return true;
    }

    return Boolean(
        !status &&
        slice.claimByEvent[slug] &&
        slice.claimRequestByEvent[slug] ===
            SUCCEEDED
    );
};

export const selectDailyGiftCanClaim = (
    state,
    slug
) => {
    if (!isSessionReady(state)) {
        return false;
    }

    const slice = selectSlice(state);

    if (
        slice.claimRequestByEvent[slug] === LOADING ||
        slice.statusRequestByEvent[slug] === LOADING ||
        slice.needsReconciliationByEvent[slug] ===
            true
    ) {
        return false;
    }

    return serverCanClaim(
        slice.statusByEvent[slug]
    );
};


// =========================================================
// DEFAULT EXPORT
// =========================================================

export default dailyGiftSlice.reducer;
