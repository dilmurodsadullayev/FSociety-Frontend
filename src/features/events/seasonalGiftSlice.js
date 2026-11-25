
// src/features/events/seasonalGiftSlice.js

import {
    createAsyncThunk,
    createSlice,
    isAnyOf,
} from "@reduxjs/toolkit";

import {
    getSeasonalGiftStatus,
    getSeasonalGiftHistory,
    claimSeasonalGift as requestSeasonalGiftClaim,
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
// Location:
// src/features/events/seasonalGiftSlice.js
//
// Business rule:
// ONE GIFT PER USER PER EVENT.
//
// Features:
// - Server-authoritative eligibility
// - Per-event claim state
// - User ownership isolation
// - Duplicate POST protection
// - Stale response protection
// - Unknown claim reconciliation
// - History invalidation
// - Logout cleanup
//
// The backend grants all rewards.
//
// No automatic retry of claim POST requests.
//
// =========================================================


// =========================================================
// CONSTANTS
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

const getSlice = (state) =>
    state?.eventsSeasonalGift ?? EMPTY_STATE;

const isSessionReady = (state) => {
    const ownerId = getSlice(state).ownerId;

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
        message: "So‘rovni bajarib bo‘lmadi.",
        canceled: false,
    };


// =========================================================
// BACKEND STATUS HELPERS
// =========================================================
//
// Backend response may be direct or nested.
//
// Only explicit backend flags are considered.
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

const hasAlreadyClaimed = (payload) =>
    getStatusCandidates(payload).some(
        (item) =>
            item?.already_claimed === true
    );

const backendAllowsClaim = (payload) =>
    getStatusCandidates(payload).some(
        (item) =>
            item?.can_claim === true
    );

const hasAuthoritativeDecision = (payload) =>
    getStatusCandidates(payload).some(
        (item) =>
            typeof item?.already_claimed ===
                "boolean" ||
            typeof item?.can_claim ===
                "boolean"
    );

const isUncertainClaimError = (error) =>
    error.status == null ||
    UNCERTAIN_HTTP_STATUSES.has(error.status);


// =========================================================
// FETCH SEASONAL GIFT STATUS
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
                    normalizeSeasonalGiftError(
                        error
                    )
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

                const slice = getSlice(state);

                // Do not fetch eligibility while
                // a claim POST is in flight.
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
// FETCH SEASONAL GIFT HISTORY
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
                    normalizeSeasonalGiftError(
                        error
                    )
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
// The backend selects the reward.
//
// Only one POST is sent by this thunk.
//
// The store listener performs a separate
// GET after the thunk resolves or rejects
// with an uncertain result.
//
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
                const normalized =
                    normalizeSeasonalGiftError(
                        error
                    );

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

                const slice = getSlice(state);

                // No duplicate POST while loading.
                if (
                    slice.claimRequestByEvent[slug] ===
                        LOADING ||
                    slice.statusRequestByEvent[slug] ===
                        LOADING ||
                    slice.needsReconciliationByEvent[
                        slug
                    ] === true
                ) {
                    return false;
                }

                // Seasonal gifts are one-time.
                if (
                    slice.claimByEvent[slug] ||
                    hasAlreadyClaimed(
                        slice.statusByEvent[slug]
                    )
                ) {
                    return false;
                }

                // An explicit backend eligibility
                // decision is required.
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
        // ---------------------------------------------
        // CLEAR STATUS ERROR
        // ---------------------------------------------

        clearSeasonalGiftStatusError(
            state,
            action
        ) {
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

        clearSeasonalGiftClaimError(
            state,
            action
        ) {
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

            // Reconciliation remains unchanged.
        },

        // ---------------------------------------------
        // CLEAR HISTORY ERROR
        // ---------------------------------------------

        clearSeasonalGiftHistoryError(
            state,
            action
        ) {
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
        // INVALIDATE EVENT CACHE
        // ---------------------------------------------

        invalidateSeasonalGiftEvent(
            state,
            action
        ) {
            const slug = getSlug(action.payload);

            if (!isValidSlug(slug)) return;

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

            // Preserve the existing one-time claim.
            // Preserve unresolved POST protection.
        },

        // ---------------------------------------------
        // RESET PRIVATE STATE
        // ---------------------------------------------

        resetSeasonalGiftState() {
            return createInitialState();
        },
    },

    extraReducers: (builder) => {
        // =============================================
        // STATUS REQUEST
        // =============================================

        builder
            .addCase(
                fetchSeasonalGiftStatusForEvent.pending,
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
                fetchSeasonalGiftStatusForEvent.fulfilled,
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

                    state.statusByEvent[slug] =
                        status;

                    state.statusFetchedAtByEvent[slug] =
                        fetchedAt;

                    state.statusRequestByEvent[slug] =
                        SUCCEEDED;

                    state.statusErrorByEvent[slug] =
                        null;

                    // Only a confirmed server
                    // decision resolves an uncertain
                    // previous POST.
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
                fetchSeasonalGiftStatusForEvent.rejected,
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
                fetchSeasonalGiftHistoryForEvent.pending,
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
                fetchSeasonalGiftHistoryForEvent.fulfilled,
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

                    state.historyByEvent[slug] =
                        history;

                    state.historyRequestByEvent[slug] =
                        SUCCEEDED;

                    state.historyErrorByEvent[slug] =
                        null;

                    delete state.pendingHistoryIds[slug];
                }
            )
            .addCase(
                fetchSeasonalGiftHistoryForEvent.rejected,
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
                claimSeasonalGiftForEvent.pending,
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

                    // Ignore old status GETs that
                    // started before the claim.
                    delete state.pendingStatusIds[slug];

                    state.statusRequestByEvent[slug] =
                        IDLE;
                }
            )
            .addCase(
                claimSeasonalGiftForEvent.fulfilled,
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

                    state.claimByEvent[slug] =
                        claim;

                    state.claimRequestByEvent[slug] =
                        SUCCEEDED;

                    state.claimErrorByEvent[slug] =
                        null;

                    state.needsReconciliationByEvent[
                        slug
                    ] = false;

                    // A successful claim changes
                    // both eligibility and history.
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

                    // The store listener will now
                    // fetch the new status with GET.
                }
            )
            .addCase(
                claimSeasonalGiftForEvent.rejected,
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

                    const error =
                        getActionError(action);

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

                    // After this action is reduced,
                    // the store listener can safely
                    // reconcile with a GET request.
                }
            );

        // =============================================
        // AUTH SUCCESS / ACCOUNT SWITCH
        // =============================================

        builder.addMatcher(
            isAnyOf(
                signUserSuccess,
                checkAuthSuccess
            ),
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
    clearSeasonalGiftStatusError,
    clearSeasonalGiftClaimError,
    clearSeasonalGiftHistoryError,
    invalidateSeasonalGiftEvent,
    resetSeasonalGiftState,
} = seasonalGiftSlice.actions;


// =========================================================
// SELECTORS — OWNER
// =========================================================

export const selectSeasonalGiftOwner = (state) =>
    getSlice(state).ownerId;


// =========================================================
// SELECTORS — STATUS
// =========================================================

export const selectSeasonalGiftEventStatus = (
    state,
    slug
) =>
    getSlice(state).statusByEvent[slug] ?? null;

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
        .statusFetchedAtByEvent[slug] ?? null;


// =========================================================
// SELECTORS — CLAIM
// =========================================================

export const selectSeasonalGiftEventClaim = (
    state,
    slug
) =>
    getSlice(state).claimByEvent[slug] ?? null;

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
    getSlice(state).historyByEvent[slug] ?? null;

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

    return (
        hasAlreadyClaimed(
            slice.statusByEvent[slug]
        ) ||
        Boolean(
            slice.claimByEvent[slug] &&
            slice.claimRequestByEvent[slug] ===
                SUCCEEDED
        )
    );
};

export const selectSeasonalGiftCanClaim = (
    state,
    slug
) => {
    if (!isSessionReady(state)) {
        return false;
    }

    const slice = getSlice(state);

    if (
        slice.claimRequestByEvent[slug] === LOADING ||
        slice.statusRequestByEvent[slug] === LOADING ||
        slice.needsReconciliationByEvent[slug] ===
            true ||
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
// DEFAULT EXPORT
// =========================================================

export default seasonalGiftSlice.reducer;
