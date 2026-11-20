
// src/features/dailyGift/dailyGiftSlice.js

import {
    createSlice,
    isAnyOf,
} from "@reduxjs/toolkit";

import {
    DAILY_GIFT_REQUEST_STATUS,
} from "../../config/dailyGiftConfig";

import {
    signUserStart,
    signUserSuccess,
    signUserFailure,
    signUserFailer,
    checkAuthSuccess,
    checkAuthFailure,
    logoutUser,
} from "../auth/Auth";

import {
    fetchDailyGiftEvent,
    fetchDailyGiftStatus,
    claimDailyGift,
    fetchDailyGiftHistory,
    getDailyGiftUserId,
} from "./dailyGiftThunks";


// =========================================================
// FSOCIETY — DAILY GIFT REDUX SLICE
// =========================================================
//
// Responsibilities:
//
// - Event state
// - Daily eligibility state
// - Claim lifecycle
// - Reward reveal state
// - Uncertain claim recovery
// - Reward history
// - Global modal state
// - Authentication cleanup
// - Stale response protection
//
// =========================================================


// =========================================================
// REQUEST STATUS
// =========================================================

const {
    IDLE,
    LOADING,
    SUCCEEDED,
    FAILED,
} = DAILY_GIFT_REQUEST_STATUS;


// =========================================================
// REQUEST STATE FACTORY
// =========================================================

const createRequestState = () => ({
    data: null,

    requestStatus: IDLE,

    requestId: null,

    error: null,
});


// =========================================================
// CLAIM STATE FACTORY
// =========================================================

const createClaimState = () => ({
    ...createRequestState(),

    httpStatus: null,

    claimDate: null,

    uncertainDate: null,
});


// =========================================================
// INITIAL STATE FACTORY
// =========================================================

const createInitialState = (
    ownerId = null
) => ({
    // Current authenticated user identity.

    ownerId,

    // Public New Year Event information.

    event: createRequestState(),

    // Private eligibility, server time and reset schedule.

    status: createRequestState(),

    // Daily Gift request and awarded reward.

    claim: createClaimState(),

    // Authenticated user's reward history.

    history: createRequestState(),

    // Shared UI state.

    ui: {
        isModalOpen: false,
    },
});


const initialState = createInitialState();


// =========================================================
// REQUEST HELPERS
// =========================================================

const startRequest = (
    request,
    action
) => {
    request.requestStatus = LOADING;

    request.requestId =
        action.meta.requestId;

    request.error = null;
};


const isCurrentRequest = (
    request,
    action
) => (
    request.requestId !== null &&
    request.requestId === action.meta.requestId
);


const completeRequest = (
    request,
    data
) => {
    request.data = data;

    request.requestStatus = SUCCEEDED;

    request.requestId = null;

    request.error = null;
};


// =========================================================
// ERROR HELPERS
// =========================================================

const isCanceledAction = (action) => (
    action.meta?.aborted === true ||
    action.payload?.isCanceled === true ||
    action.error?.name === "AbortError" ||
    action.error?.name === "CanceledError"
);


const getRejectedError = (
    action,
    fallback = "So‘rovni bajarishda xatolik yuz berdi."
) => {
    if (
        action.payload &&
        typeof action.payload === "object"
    ) {
        return action.payload;
    }

    return {
        code: isCanceledAction(action)
            ? "request_canceled"
            : "daily_gift_error",

        message: isCanceledAction(action)
            ? "So‘rov bekor qilindi."
            : fallback,

        status: null,

        eligibility: null,

        retryAfter: null,

        isCanceled:
            isCanceledAction(action),

        isNetworkError: false,

        mayHaveClaimed: false,
    };
};


const failRequest = (
    request,
    action,
    fallback
) => {
    request.requestId = null;

    request.data = null;

    if (isCanceledAction(action)) {
        request.requestStatus = IDLE;

        request.error = null;

        return;
    }

    request.requestStatus = FAILED;

    request.error =
        getRejectedError(
            action,
            fallback
        );
};


// =========================================================
// AUTH PAYLOAD NORMALIZATION
// =========================================================

const getUserIdFromAuthAction = (
    action
) => {
    const user =
        action.payload?.user ??
        action.payload ??
        null;

    return getDailyGiftUserId(user);
};


// =========================================================
// DAILY GIFT SLICE
// =========================================================

const dailyGiftSlice = createSlice({
    name: "dailyGift",

    initialState,

    reducers: {
        // =================================================
        // OPEN GLOBAL MODAL
        // =================================================

        openDailyGiftModal: (state) => {
            state.ui.isModalOpen = true;
        },


        // =================================================
        // CLOSE GLOBAL MODAL
        //
        // Closing the modal must never delete
        // the claim response or awarded reward.
        // =================================================

        closeDailyGiftModal: (state) => {
            state.ui.isModalOpen = false;
        },


        // =================================================
        // CLEAR CLAIM PRESENTATION
        //
        // Keeps uncertain claim information.
        // Does not change current eligibility.
        // =================================================

        clearDailyGiftClaimResult: (state) => {
            if (
                state.claim.requestStatus === LOADING
            ) {
                return;
            }

            const uncertainDate =
                state.claim.uncertainDate;

            state.claim = {
                ...createClaimState(),

                uncertainDate,
            };
        },


        // =================================================
        // CLEAR CLAIM ERROR
        // =================================================

        clearDailyGiftClaimError: (state) => {
            if (
                state.claim.requestStatus === LOADING
            ) {
                return;
            }

            state.claim.error = null;

            if (
                state.claim.requestStatus === FAILED
            ) {
                state.claim.requestStatus = IDLE;
            }
        },


        // =================================================
        // CLEAR HISTORY
        //
        // Useful when reopening history or after
        // reward synchronization.
        //
        // Old pending responses are ignored because
        // their requestId will no longer match.
        // =================================================

        invalidateDailyGiftHistory: (state) => {
            state.history =
                createRequestState();
        },
    },


    // =====================================================
    // EXTRA REDUCERS
    // =====================================================

    extraReducers: (builder) => {
        builder

            // =============================================
            // PUBLIC EVENT — PENDING
            // =============================================

            .addCase(
                fetchDailyGiftEvent.pending,

                (state, action) => {
                    startRequest(
                        state.event,
                        action
                    );
                }
            )


            // =============================================
            // PUBLIC EVENT — FULFILLED
            // =============================================

            .addCase(
                fetchDailyGiftEvent.fulfilled,

                (state, action) => {
                    if (
                        !isCurrentRequest(
                            state.event,
                            action
                        )
                    ) {
                        return;
                    }

                    completeRequest(
                        state.event,
                        action.payload
                    );
                }
            )


            // =============================================
            // PUBLIC EVENT — REJECTED
            // =============================================

            .addCase(
                fetchDailyGiftEvent.rejected,

                (state, action) => {
                    if (
                        !isCurrentRequest(
                            state.event,
                            action
                        )
                    ) {
                        return;
                    }

                    failRequest(
                        state.event,
                        action,
                        "Tadbirni yuklab bo‘lmadi."
                    );
                }
            )


            // =============================================
            // GIFT STATUS — PENDING
            // =============================================

            .addCase(
                fetchDailyGiftStatus.pending,

                (state, action) => {
                    startRequest(
                        state.status,
                        action
                    );
                }
            )


            // =============================================
            // GIFT STATUS — FULFILLED
            // =============================================

            .addCase(
                fetchDailyGiftStatus.fulfilled,

                (state, action) => {
                    if (
                        !isCurrentRequest(
                            state.status,
                            action
                        )
                    ) {
                        return;
                    }

                    completeRequest(
                        state.status,
                        action.payload
                    );

                    // An uncertain claim must never
                    // be replayed on a different day.

                    const claimDate =
                        action.payload?.claim_date;

                    if (
                        typeof claimDate === "string" &&
                        state.claim.uncertainDate &&
                        state.claim.uncertainDate !==
                            claimDate
                    ) {
                        state.claim.uncertainDate = null;
                    }
                }
            )


            // =============================================
            // GIFT STATUS — REJECTED
            // =============================================

            .addCase(
                fetchDailyGiftStatus.rejected,

                (state, action) => {
                    if (
                        !isCurrentRequest(
                            state.status,
                            action
                        )
                    ) {
                        return;
                    }

                    failRequest(
                        state.status,
                        action,
                        "Sovg‘a holatini yuklab bo‘lmadi."
                    );
                }
            )


            // =============================================
            // DAILY GIFT CLAIM — PENDING
            // =============================================

            .addCase(
                claimDailyGift.pending,

                (state, action) => {
                    startRequest(
                        state.claim,
                        action
                    );

                    state.claim.claimDate =
                        action.meta.arg
                            ?.expectedClaimDate ??
                        null;

                    state.claim.data = null;

                    state.claim.httpStatus = null;

                    // Keep uncertainDate during an
                    // explicit recovery attempt.
                }
            )


            // =============================================
            // DAILY GIFT CLAIM — FULFILLED
            // =============================================

            .addCase(
                claimDailyGift.fulfilled,

                (state, action) => {
                    if (
                        !isCurrentRequest(
                            state.claim,
                            action
                        )
                    ) {
                        return;
                    }

                    const {
                        httpStatus,
                        data,
                    } = action.payload;

                    // -------------------------------------
                    // Store the original backend reward.
                    // -------------------------------------

                    completeRequest(
                        state.claim,
                        data
                    );

                    state.claim.httpStatus =
                        httpStatus;

                    state.claim.claimDate =
                        data?.claim_date ??
                        state.claim.claimDate;

                    state.claim.uncertainDate =
                        null;


                    // -------------------------------------
                    // Update eligibility from the
                    // authoritative claim response.
                    // -------------------------------------

                    const updatedStatus =
                        data?.status;

                    if (
                        updatedStatus &&
                        typeof updatedStatus === "object" &&
                        typeof updatedStatus.can_claim ===
                            "boolean" &&
                        typeof updatedStatus.claim_date ===
                            "string"
                    ) {
                        state.status =
                            createRequestState();

                        completeRequest(
                            state.status,
                            updatedStatus
                        );

                    } else {
                        // If the claim response does
                        // not contain a full status,
                        // the controller will refetch it.

                        state.status =
                            createRequestState();
                    }


                    // -------------------------------------
                    // Reward history is now stale.
                    // -------------------------------------

                    state.history =
                        createRequestState();


                    // IMPORTANT:
                    //
                    // Do not increment the user's
                    // FCoin balance here.
                    //
                    // HTTP 200 may represent an
                    // existing claim rather than a
                    // newly awarded reward.
                    //
                    // Existing user services will
                    // synchronize the real balance.
                }
            )


            // =============================================
            // DAILY GIFT CLAIM — REJECTED
            // =============================================

            .addCase(
                claimDailyGift.rejected,

                (state, action) => {
                    if (
                        !isCurrentRequest(
                            state.claim,
                            action
                        )
                    ) {
                        return;
                    }

                    const error =
                        getRejectedError(
                            action,
                            "Sovg‘ani ochib bo‘lmadi."
                        );

                    state.claim.requestId =
                        null;

                    state.claim.requestStatus =
                        FAILED;

                    state.claim.error =
                        error;

                    state.claim.httpStatus =
                        error.status;


                    // -------------------------------------
                    // Uncertain claim detection
                    //
                    // RTK can emit an aborted rejected
                    // action before the payload creator
                    // returns its normalized error.
                    //
                    // Therefore treat aborted claims
                    // conservatively as uncertain.
                    // -------------------------------------

                    if (
                        error.mayHaveClaimed ||
                        isCanceledAction(action)
                    ) {
                        state.claim.uncertainDate =
                            state.claim.claimDate;
                    }


                    // -------------------------------------
                    // Restore fresh server eligibility
                    // if provided by the backend.
                    // -------------------------------------

                    const eligibility =
                        error.eligibility;

                    if (
                        eligibility &&
                        typeof eligibility.can_claim ===
                            "boolean" &&
                        typeof eligibility.claim_date ===
                            "string"
                    ) {
                        state.status =
                            createRequestState();

                        completeRequest(
                            state.status,
                            eligibility
                        );

                        if (
                            state.claim.uncertainDate &&
                            state.claim.uncertainDate !==
                                eligibility.claim_date
                        ) {
                            state.claim.uncertainDate =
                                null;
                        }

                    } else {
                        // Do not rely on old eligibility
                        // after a failed or uncertain claim.

                        state.status =
                            createRequestState();
                    }
                }
            )


            // =============================================
            // GIFT HISTORY — PENDING
            // =============================================

            .addCase(
                fetchDailyGiftHistory.pending,

                (state, action) => {
                    startRequest(
                        state.history,
                        action
                    );
                }
            )


            // =============================================
            // GIFT HISTORY — FULFILLED
            // =============================================

            .addCase(
                fetchDailyGiftHistory.fulfilled,

                (state, action) => {
                    if (
                        !isCurrentRequest(
                            state.history,
                            action
                        )
                    ) {
                        return;
                    }

                    completeRequest(
                        state.history,
                        action.payload
                    );
                }
            )


            // =============================================
            // GIFT HISTORY — REJECTED
            // =============================================

            .addCase(
                fetchDailyGiftHistory.rejected,

                (state, action) => {
                    if (
                        !isCurrentRequest(
                            state.history,
                            action
                        )
                    ) {
                        return;
                    }

                    failRequest(
                        state.history,
                        action,
                        "Mukofotlar tarixini yuklab bo‘lmadi."
                    );
                }
            )


            // =============================================
            // AUTH — LOGIN START
            //
            // Old private data must not be preserved
            // during a new login attempt.
            // =============================================

            .addCase(
                signUserStart,

                () => createInitialState()
            )


            // =============================================
            // AUTH — NEW SESSION
            // =============================================

            .addCase(
                signUserSuccess,

                (_, action) => (
                    createInitialState(
                        getUserIdFromAuthAction(action)
                    )
                )
            )


            // =============================================
            // AUTH — SESSION CHECK SUCCESS
            //
            // Preserve current gift state if the
            // authenticated user has not changed.
            // =============================================

            .addCase(
                checkAuthSuccess,

                (state, action) => {
                    const nextOwnerId =
                        getUserIdFromAuthAction(
                            action
                        );

                    if (
                        state.ownerId !== nextOwnerId
                    ) {
                        return createInitialState(
                            nextOwnerId
                        );
                    }
                }
            )


            // =============================================
            // AUTH — LOGOUT / SESSION FAILURE
            //
            // Clear all private gift data.
            //
            // Pending responses from the previous
            // session are ignored because request IDs
            // are reset.
            // =============================================

            .addMatcher(
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
// EXPORTED ACTIONS
// =========================================================

export const {
    openDailyGiftModal,

    closeDailyGiftModal,

    clearDailyGiftClaimResult,

    clearDailyGiftClaimError,

    invalidateDailyGiftHistory,
} = dailyGiftSlice.actions;


// =========================================================
// DEFAULT REDUCER EXPORT
// =========================================================

export default dailyGiftSlice.reducer;
