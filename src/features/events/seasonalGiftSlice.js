
 // src/features/events/seasonalGiftSlice.js

import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import {
    getSeasonalGiftStatus,
    claimSeasonalGift as requestSeasonalGiftClaim,
    getSeasonalGiftHistory,
    normalizeSeasonalGiftError,
} from "../../services/events/seasonalGiftApi";

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
// FSOCIETY — SEASONAL GIFT REDUX
// =========================================================
//
// One gift per user and event.
//
// Architecture:
// - Server-authoritative eligibility
// - Per-event state
// - Per-user isolation
// - Duplicate claim prevention
// - Stale response protection
// - Uncertain claim reconciliation
// - No automatic POST retry
//
// IMPORTANT:
//
// The Redux listener in src/store/index.js
// refreshes the status AFTER a claim action
// has finished updating Redux state.
//
// =========================================================

// =========================================================
// REQUEST STATUS
// =========================================================

export const SEASONAL_GIFT_REQUEST_STATUS =
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
} = SEASONAL_GIFT_REQUEST_STATUS;

// =========================================================
// INITIAL STATE
// =========================================================

const createInitialState = (
    ownerId = null
) => ({
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

const isValidSlug = (slug) =>
    /^[a-zA-Z0-9_-]+$/.test(slug);

const getOwnerId = (payload) => {
    const user =
        payload?.user ??
        payload?.data?.user ??
        payload?.data ??
        payload;

    const id =
        user?.id ??
        user?.pk;

    if (
        id === null ||
        id === undefined ||
        id === ""
    ) {
        return null;
    }

    return String(id);
};

const getSlice = (state) =>
    state?.eventsSeasonalGift ??
    EMPTY_STATE;

const canAccessPrivateGift = (state) =>
    Boolean(
        state?.auth?.isLoggedIn &&
        getSlice(state).ownerId
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
        message:
            "So‘rovni bajarishda xatolik yuz berdi.",
        canceled: false,
    };

const isCurrentOwner = (
    state,
    ownerId
) =>
    Boolean(
        state.ownerId &&
        state.ownerId === ownerId
    );

// =========================================================
// BACKEND STATUS HELPERS
// =========================================================
//
// Support direct and envelope-based responses.
//
// Do not infer eligibility from local time.
// Only explicit backend flags are accepted.
// =========================================================

const getStatusCandidates = (payload) => [
    payload,
    payload?.data,
    payload?.gift,
    payload?.data?.gift,
    payload?.eligibility,
    payload?.data?.eligibility,
];

const hasAlreadyClaimed = (payload) =>
    getStatusCandidates(payload).some(
        (candidate) =>
            candidate?.already_claimed === true
    );

const backendAllowsClaim = (payload) =>
    getStatusCandidates(payload).some(
        (candidate) =>
            candidate?.can_claim === true
    );

const hasAuthoritativeClaimDecision = (
    payload
) =>
    getStatusCandidates(payload).some(
        (candidate) =>
            typeof candidate?.already_claimed ===
                "boolean" ||
            typeof candidate?.can_claim ===
                "boolean"
    );

// =========================================================
// AUTH ACTION TYPES
// =========================================================

const AUTH_SUCCESS_TYPES = new Set([
    signUserSuccess.type,
    checkAuthSuccess.type,
]);

const AUTH_FAILURE_TYPES = new Set([
    logoutUser.type,
    signUserFailure.type,
    signUserFailer.type,
    checkAuthFailure.type,
]);

// =========================================================
// FETCH STATUS
// =========================================================

export const fetchSeasonalGiftStatusForEvent =
    createAsyncThunk(
        "eventsSeasonalGift/fetchStatus",

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
                    getSlice(getState()).ownerId;

                const status =
                    await getSeasonalGiftStatus(
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
                    normalizeSeasonalGiftError(error)
                );
            }
        },

        {
            condition: (arg, { getState }) => {
                const state = getState();
                const slug = getSlug(arg);

                if (
                    !isValidSlug(slug) ||
                    !canAccessPrivateGift(state)
                ) {
                    return false;
                }

                return (
                    getSlice(state)
                        .statusRequestByEvent[slug] !==
                    LOADING
                );
            },
        }
    );

// =========================================================
// FETCH HISTORY
// =========================================================

export const fetchSeasonalGiftHistoryForEvent =
    createAsyncThunk(
        "eventsSeasonalGift/fetchHistory",

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
                    getSlice(getState()).ownerId;

                const history =
                    await getSeasonalGiftHistory(
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
                    normalizeSeasonalGiftError(error)
                );
            }
        },

        {
            condition: (arg, { getState }) => {
                const state = getState();
                const slug = getSlug(arg);

                if (
                    !isValidSlug(slug) ||
                    !canAccessPrivateGift(state)
                ) {
                    return false;
                }

                return (
                    getSlice(state)
                        .historyRequestByEvent[slug] !==
                    LOADING
                );
            },
        }
    );

// =========================================================
// CLAIM SEASONAL GIFT
// =========================================================
//
// The backend is the only authority.
//
// A verified can_claim=true is required.
//
// This thunk performs exactly one claim POST.
//
// Status refresh is managed by the Redux listener
// after the claim action is fully reduced.
// =========================================================

export const claimSeasonalGiftForEvent =
    createAsyncThunk(
        "eventsSeasonalGift/claim",

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
                    getSlice(getState()).ownerId;

                const claim =
                    await requestSeasonalGiftClaim(
                        slug
                    );

                return {
                    slug,
                    ownerId,
                    claim,
                    claimedAt: Date.now(),
                };
            } catch (error) {
                const normalizedError =
                    normalizeSeasonalGiftError(error);

                const status =
                    normalizedError.status;

                // The server might have committed
                // the transaction before the error
                // reached the browser.
                const uncertain =
                    status === null ||
                    [
                        409,
                        500,
                        502,
                        503,
                        504,
                    ].includes(status);

                return rejectWithValue({
                    ...normalizedError,
                    needsReconciliation: uncertain,
                });
            }
        },

        {
            condition: (arg, { getState }) => {
                const state = getState();
                const slug = getSlug(arg);

                if (
                    !isValidSlug(slug) ||
                    !canAccessPrivateGift(state)
                ) {
                    return false;
                }

                const slice = getSlice(state);

                if (
                    slice.claimRequestByEvent[slug] ===
                        LOADING ||
                    slice.needsReconciliationByEvent[
                        slug
                    ] === true
                ) {
                    return false;
                }

                if (
                    slice.claimByEvent[slug] ||
                    hasAlreadyClaimed(
                        slice.statusByEvent[slug]
                    )
                ) {
                    return false;
                }

                // Claim is only available after
                // an authoritative status request.
                return backendAllowsClaim(
                    slice.statusByEvent[slug]
                );
            },
        }
    );

// =========================================================
// REDUX SLICE
// =========================================================

const seasonalGiftSlice = createSlice({
    name: "eventsSeasonalGift",

    initialState: createInitialState(),

    reducers: {
        // ================================================
        // CLEAR STATUS ERROR
        // ================================================

        clearSeasonalGiftStatusError(
            state,
            action
        ) {
            const slug = getSlug(action.payload);

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

        clearSeasonalGiftClaimError(
            state,
            action
        ) {
            const slug = getSlug(action.payload);

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

            // An uncertain POST must remain
            // blocked until a successful GET.
        },

        // ================================================
        // INVALIDATE EVENT CACHE
        // ================================================

        invalidateSeasonalGiftEvent(
            state,
            action
        ) {
            const slug = getSlug(action.payload);

            if (!slug) {
                return;
            }

            delete state.statusByEvent[slug];
            delete state.historyByEvent[slug];

            delete state.statusFetchedAtByEvent[slug];

            delete state.pendingStatusIds[slug];
            delete state.pendingHistoryIds[slug];

            state.statusRequestByEvent[slug] =
                IDLE;

            state.historyRequestByEvent[slug] =
                IDLE;

            delete state.statusErrorByEvent[slug];
            delete state.historyErrorByEvent[slug];

            // Claim and uncertain-result state
            // are intentionally preserved.
        },

        // ================================================
        // RESET PRIVATE STATE
        // ================================================

        resetSeasonalGiftState() {
            return createInitialState();
        },
    },

    extraReducers: (builder) => {
        // ================================================
        // STATUS — PENDING
        // ================================================

        builder.addCase(
            fetchSeasonalGiftStatusForEvent.pending,
            (state, action) => {
                const slug = getSlug(
                    action.meta.arg
                );

                if (!slug) {
                    return;
                }

                state.statusRequestByEvent[slug] =
                    LOADING;

                state.statusErrorByEvent[slug] =
                    null;

                state.pendingStatusIds[slug] =
                    action.meta.requestId;
            }
        );

        // ================================================
        // STATUS — FULFILLED
        // ================================================

        builder.addCase(
            fetchSeasonalGiftStatusForEvent.fulfilled,
            (state, action) => {
                const {
                    slug,
                    ownerId,
                    status,
                    fetchedAt,
                } = action.payload;

                if (
                    !isCurrentOwner(
                        state,
                        ownerId
                    ) ||
                    state.pendingStatusIds[slug] !==
                        action.meta.requestId
                ) {
                    return;
                }

                state.statusByEvent[slug] =
                    status;

                state.statusFetchedAtByEvent[slug] =
                    fetchedAt;

                state.statusRequestByEvent[slug] =
                    SUCCEEDED;

                state.statusErrorByEvent[slug] =
                    null;

                // Clear uncertain state only when
                // the backend explicitly confirms
                // a claim/eligibility decision.
                if (
                    hasAuthoritativeClaimDecision(
                        status
                    )
                ) {
                    state.needsReconciliationByEvent[
                        slug
                    ] = false;
                }

                delete state.pendingStatusIds[slug];
            }
        );

        // ================================================
        // STATUS — REJECTED
        // ================================================

        builder.addCase(
            fetchSeasonalGiftStatusForEvent.rejected,
            (state, action) => {
                const slug = getSlug(
                    action.meta.arg
                );

                if (
                    !slug ||
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

                // Failed GET cannot prove whether
                // a previous POST committed.
            }
        );

        // ================================================
        // HISTORY — PENDING
        // ================================================

        builder.addCase(
            fetchSeasonalGiftHistoryForEvent.pending,
            (state, action) => {
                const slug = getSlug(
                    action.meta.arg
                );

                if (!slug) {
                    return;
                }

                state.historyRequestByEvent[slug] =
                    LOADING;

                state.historyErrorByEvent[slug] =
                    null;

                state.pendingHistoryIds[slug] =
                    action.meta.requestId;
            }
        );

        // ================================================
        // HISTORY — FULFILLED
        // ================================================

        builder.addCase(
            fetchSeasonalGiftHistoryForEvent.fulfilled,
            (state, action) => {
                const {
                    slug,
                    ownerId,
                    history,
                } = action.payload;

                if (
                    !isCurrentOwner(
                        state,
                        ownerId
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
            fetchSeasonalGiftHistoryForEvent.rejected,
            (state, action) => {
                const slug = getSlug(
                    action.meta.arg
                );

                if (
                    !slug ||
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
            claimSeasonalGiftForEvent.pending,
            (state, action) => {
                const slug = getSlug(
                    action.meta.arg
                );

                if (!slug) {
                    return;
                }

                state.claimRequestByEvent[slug] =
                    LOADING;

                state.claimErrorByEvent[slug] =
                    null;

                state.pendingClaimIds[slug] =
                    action.meta.requestId;

                // Invalidate previously started
                // GET status requests.
                delete state.pendingStatusIds[slug];

                state.statusRequestByEvent[slug] =
                    IDLE;
            }
        );

        // ================================================
        // CLAIM — FULFILLED
        // ================================================

        builder.addCase(
            claimSeasonalGiftForEvent.fulfilled,
            (state, action) => {
                const {
                    slug,
                    ownerId,
                    claim,
                } = action.payload;

                if (
                    !isCurrentOwner(
                        state,
                        ownerId
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

                state.needsReconciliationByEvent[slug] =
                    false;

                // Claimed rewards change history.
                delete state.historyByEvent[slug];

                delete state.pendingHistoryIds[slug];

                state.historyRequestByEvent[slug] =
                    IDLE;

                delete state.pendingClaimIds[slug];
            }
        );

        // ================================================
        // CLAIM — REJECTED
        // ================================================

        builder.addCase(
            claimSeasonalGiftForEvent.rejected,
            (state, action) => {
                const slug = getSlug(
                    action.meta.arg
                );

                if (
                    !slug ||
                    state.pendingClaimIds[slug] !==
                        action.meta.requestId
                ) {
                    return;
                }

                delete state.pendingClaimIds[slug];

                const error = getActionError(action);

                const uncertain =
                    error.needsReconciliation ===
                        true ||
                    isCanceled(action);

                state.claimRequestByEvent[slug] =
                    FAILED;

                state.claimErrorByEvent[slug] =
                    error;

                state.needsReconciliationByEvent[slug] =
                    uncertain;

                // The listener middleware now
                // performs a GET status request
                // after this reducer has finished.
            }
        );

        // ================================================
        // AUTH SUCCESS / ACCOUNT SWITCH
        // ================================================

        builder.addMatcher(
            (action) =>
                AUTH_SUCCESS_TYPES.has(action.type),

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
        // LOGOUT / AUTH FAILURE
        // ================================================

        builder.addMatcher(
            (action) =>
                AUTH_FAILURE_TYPES.has(action.type),

            () => createInitialState()
        );
    },
});

// =========================================================
// ACTIONS
// =========================================================

export const {
    clearSeasonalGiftStatusError,
    clearSeasonalGiftClaimError,
    invalidateSeasonalGiftEvent,
    resetSeasonalGiftState,
} = seasonalGiftSlice.actions;

// =========================================================
// SELECTORS — OWNER
// =========================================================

export const selectSeasonalGiftOwner = (
    state
) =>
    getSlice(state).ownerId;

// =========================================================
// SELECTORS — STATUS
// =========================================================

export const selectSeasonalGiftEventStatus = (
    state,
    slug
) =>
    getSlice(state).statusByEvent[slug] ??
    null;

export const selectSeasonalGiftStatusLoading = (
    state,
    slug
) =>
    getSlice(state)
        .statusRequestByEvent[slug] === LOADING;

export const selectSeasonalGiftStatusError = (
    state,
    slug
) =>
    getSlice(state)
        .statusErrorByEvent[slug] ?? null;

export const selectSeasonalGiftStatusFetchedAt = (
    state,
    slug
) =>
    getSlice(state)
        .statusFetchedAtByEvent[slug] ??
    null;

// =========================================================
// SELECTORS — CLAIM
// =========================================================

export const selectSeasonalGiftEventClaim = (
    state,
    slug
) =>
    getSlice(state).claimByEvent[slug] ??
    null;

export const selectSeasonalGiftClaimLoading = (
    state,
    slug
) =>
    getSlice(state)
        .claimRequestByEvent[slug] === LOADING;

export const selectSeasonalGiftClaimError = (
    state,
    slug
) =>
    getSlice(state)
        .claimErrorByEvent[slug] ?? null;

export const selectSeasonalGiftNeedsReconciliation = (
    state,
    slug
) =>
    getSlice(state)
        .needsReconciliationByEvent[slug] === true;

// =========================================================
// SELECTORS — HISTORY
// =========================================================

export const selectSeasonalGiftEventHistory = (
    state,
    slug
) =>
    getSlice(state).historyByEvent[slug] ??
    null;

export const selectSeasonalGiftHistoryLoading = (
    state,
    slug
) =>
    getSlice(state)
        .historyRequestByEvent[slug] === LOADING;

export const selectSeasonalGiftHistoryError = (
    state,
    slug
) =>
    getSlice(state)
        .historyErrorByEvent[slug] ?? null;

// =========================================================
// SELECTORS — DERIVED
// =========================================================

export const selectSeasonalGiftAlreadyClaimed = (
    state,
    slug
) => {
    const slice = getSlice(state);

    if (
        hasAlreadyClaimed(
            slice.statusByEvent[slug]
        )
    ) {
        return true;
    }

    return Boolean(
        slice.claimByEvent[slug] &&
        slice.claimRequestByEvent[slug] ===
            SUCCEEDED
    );
};

export const selectSeasonalGiftCanClaim = (
    state,
    slug
) => {
    const slice = getSlice(state);

    if (
        !state?.auth?.isLoggedIn ||
        !slice.ownerId ||
        slice.needsReconciliationByEvent[slug] ||
        slice.claimRequestByEvent[slug] ===
            LOADING ||
        slice.claimByEvent[slug] ||
        hasAlreadyClaimed(
            slice.statusByEvent[slug]
        )
    ) {
        return false;
    }

    return backendAllowsClaim(
        slice.statusByEvent[slug]
    );
};

// =========================================================
// DEFAULT REDUCER
// =========================================================

export default seasonalGiftSlice.reducer;
