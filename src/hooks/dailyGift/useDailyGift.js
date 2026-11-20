
// src/hooks/dailyGift/useDailyGift.js

import {
    useCallback,
    useEffect,
} from "react";

import {
    useDispatch,
    useSelector,
    useStore,
} from "react-redux";


// =========================================================
// DAILY GIFT ASYNC THUNKS
// =========================================================

import {
    fetchDailyGiftEvent,
    fetchDailyGiftStatus,
    claimDailyGift,
} from "../../features/dailyGift/dailyGiftThunks";


// =========================================================
// DAILY GIFT SELECTORS
// =========================================================

import {
    selectDailyGiftOwnerId,
    selectDailyGiftHasValidSession,

    selectDailyGiftEvent,
    selectDailyGiftEventError,

    selectDailyGiftStatus,
    selectDailyGiftStatusError,
    selectDailyGiftIsStatusLoaded,

    selectDailyGiftClaimDate,
    selectDailyGiftClaimResult,
    selectDailyGiftClaimError,

    selectDailyGiftCanClaim,
    selectDailyGiftCanRecoverClaim,

    selectDailyGiftReward,

    selectDailyGiftEntryPointView,

    selectDailyGiftRequiresAuthentication,
} from "../../features/dailyGift/dailyGiftSelectors";


// =========================================================
// FSOCIETY — DAILY GIFT CONTROLLER HOOK
// =========================================================
//
// Responsibilities:
//
// - Public event information
// - Authenticated gift eligibility
// - Initial data loading
// - Manual status refresh
// - Secure gift claim
// - Uncertain claim recovery
// - Authentication consistency
// - Server-authoritative reward state
//
// Architecture:
//
// UI Components
//      |
// useDailyGift
//      |
// Redux Async Thunks
//      |
// DailyGiftService
//      |
// Django REST API
//
// IMPORTANT:
//
// Enable autoLoad only inside the global
// DailyGiftController.
//
// Navbar, sidebar and modal must not create
// independent automatic request loops.
//
// =========================================================


// =========================================================
// MAIN CUSTOM HOOK
// =========================================================

export const useDailyGift = (
    {
        autoLoad = false,
    } = {}
) => {

    const dispatch = useDispatch();

    const store = useStore();


    // =====================================================
    // AUTHENTICATION STATE
    // =====================================================

    const ownerId = useSelector(
        selectDailyGiftOwnerId
    );

    const hasValidSession = useSelector(
        selectDailyGiftHasValidSession
    );

    const requiresAuthentication = useSelector(
        selectDailyGiftRequiresAuthentication
    );


    // =====================================================
    // PUBLIC EVENT STATE
    // =====================================================

    const event = useSelector(
        selectDailyGiftEvent
    );

    const eventError = useSelector(
        selectDailyGiftEventError
    );


    // =====================================================
    // AUTHENTICATED ELIGIBILITY STATE
    // =====================================================

    const status = useSelector(
        selectDailyGiftStatus
    );

    const statusError = useSelector(
        selectDailyGiftStatusError
    );

    const claimDate = useSelector(
        selectDailyGiftClaimDate
    );


    // =====================================================
    // CLAIM STATE
    // =====================================================

    const claimResult = useSelector(
        selectDailyGiftClaimResult
    );

    const claimError = useSelector(
        selectDailyGiftClaimError
    );

    const reward = useSelector(
        selectDailyGiftReward
    );

    const canRecover = useSelector(
        selectDailyGiftCanRecoverClaim
    );


    // =====================================================
    // SHARED ENTRY POINT VIEW MODEL
    // =====================================================

    const entryPointView = useSelector(
        selectDailyGiftEntryPointView
    );


    // =====================================================
    // REFRESH PUBLIC EVENT
    //
    // Public event information can be requested
    // without an authenticated user.
    //
    // Duplicate pending requests are prevented
    // by the async thunk condition.
    // =====================================================

    const refreshEvent = useCallback(
        () => {

            return dispatch(
                fetchDailyGiftEvent()
            );
        },

        [dispatch]
    );


    // =====================================================
    // REFRESH AUTHENTICATED STATUS
    //
    // Read the latest Redux state instead of
    // trusting a potentially stale React closure.
    //
    // The thunk also protects against:
    //
    // - Duplicate status requests
    // - Invalid sessions
    // - Concurrent claim requests
    // =====================================================

    const refreshStatus = useCallback(
        () => {

            const currentState =
                store.getState();

            if (
                !selectDailyGiftHasValidSession(
                    currentState
                )
            ) {

                return null;
            }


            return dispatch(
                fetchDailyGiftStatus()
            );
        },

        [
            dispatch,
            store,
        ]
    );


    // =====================================================
    // REFRESH COMPLETE DAILY GIFT DATA
    //
    // Public event and authenticated status can
    // be loaded independently.
    //
    // This operation never creates a gift claim.
    // =====================================================

    const refresh = useCallback(
        async () => {

            const eventRequest =
                refreshEvent();

            const statusRequest =
                refreshStatus();


            const [
                eventAction,
                statusAction,
            ] = await Promise.all([
                eventRequest,
                statusRequest,
            ]);


            return {
                eventAction,

                statusAction,
            };
        },

        [
            refreshEvent,
            refreshStatus,
        ]
    );


    // =====================================================
    // INITIAL DATA LOADING
    //
    // Only the global DailyGiftController should
    // enable autoLoad.
    //
    // React StrictMode may execute effects more
    // than once in development.
    //
    // Pending request protection is handled
    // by the Redux async thunk conditions.
    //
    // No automatic claim requests.
    // No automatic polling.
    // No automatic retry loop.
    // =====================================================

    useEffect(() => {

        if (!autoLoad) {

            return;
        }


        if (
            !hasValidSession
            ||
            ownerId === null
        ) {

            return;
        }


        void refresh();

    }, [
        autoLoad,

        hasValidSession,

        ownerId,

        refresh,
    ]);


    // =====================================================
    // SHARED CLAIM EXECUTION
    //
    // Normal claim:
    //
    // executeClaim({
    //     expectedClaimDate,
    //     recover: false,
    // });
    //
    // Explicit recovery:
    //
    // executeClaim({
    //     expectedClaimDate,
    //     recover: true,
    // });
    //
    // The backend remains authoritative.
    // =====================================================

    const executeClaim = useCallback(
        async (
            {
                expectedClaimDate,

                recover = false,
            } = {}
        ) => {

            // =============================================
            // STEP 01 — READ CURRENT REDUX STATE
            // =============================================

            const currentState =
                store.getState();


            if (
                !selectDailyGiftHasValidSession(
                    currentState
                )
            ) {

                return null;
            }


            const originalOwnerId =
                selectDailyGiftOwnerId(
                    currentState
                );


            const currentClaimDate =
                selectDailyGiftClaimDate(
                    currentState
                );


            // =============================================
            // STEP 02 — VERIFY EXPECTED CALENDAR DAY
            //
            // Do not accidentally claim a gift for
            // a new calendar day using an old UI.
            // =============================================

            if (
                typeof expectedClaimDate !== "string"
                ||
                currentClaimDate !== expectedClaimDate
            ) {

                return null;
            }


            // =============================================
            // STEP 03 — VERIFY CLAIM AVAILABILITY
            // =============================================

            const isAllowed =
                recover === true

                    ? selectDailyGiftCanRecoverClaim(
                        currentState
                    )

                    : selectDailyGiftCanClaim(
                        currentState
                    );


            if (!isAllowed) {

                return null;
            }


            // =============================================
            // STEP 04 — EXECUTE CLAIM THUNK
            //
            // The thunk performs:
            //
            // - Fresh eligibility request
            // - CSRF token retrieval
            // - Session validation
            // - Calendar day validation
            // - Exactly one client POST attempt
            //
            // No reward selection on the frontend.
            // =============================================

            const action = await dispatch(
                claimDailyGift({
                    expectedClaimDate,

                    recover: recover === true,
                })
            );


            // =============================================
            // STEP 05 — VERIFY SESSION AFTER REQUEST
            // =============================================

            const latestState =
                store.getState();


            const latestOwnerId =
                selectDailyGiftOwnerId(
                    latestState
                );


            if (
                !selectDailyGiftHasValidSession(
                    latestState
                )
                ||
                latestOwnerId !== originalOwnerId
            ) {

                return null;
            }


            // =============================================
            // STEP 06 — SUCCESSFUL CLAIM
            //
            // Preserve the response already stored
            // by the Daily Gift Redux slice.
            //
            // Refresh status only if a complete
            // eligibility object was not returned.
            // =============================================

            if (
                claimDailyGift.fulfilled.match(
                    action
                )
            ) {

                const statusIsLoaded =
                    selectDailyGiftIsStatusLoaded(
                        latestState
                    );


                if (!statusIsLoaded) {

                    await refreshStatus();
                }


                return action;
            }


            // =============================================
            // STEP 07 — REJECTED CLAIM
            // =============================================

            if (
                claimDailyGift.rejected.match(
                    action
                )
            ) {

                // A condition rejection means the
                // request was intentionally skipped.

                if (action.meta?.condition) {

                    return action;
                }


                const error =
                    action.payload;


                // Some backend errors already contain
                // fresh eligibility information.

                const hasFreshEligibility =
                    Boolean(
                        error?.eligibility
                        &&
                        typeof error.eligibility.can_claim
                            === "boolean"
                        &&
                        typeof error.eligibility.claim_date
                            === "string"
                    );


                const shouldRefreshStatus = (
                    !hasFreshEligibility
                    ||
                    error?.mayHaveClaimed === true
                    ||
                    action.meta?.aborted === true
                );


                // A network error does not prove that
                // the backend failed to award a gift.
                //
                // Refresh eligibility without sending
                // another POST request automatically.

                if (shouldRefreshStatus) {

                    await refreshStatus();
                }
            }


            return action;
        },

        [
            dispatch,

            store,

            refreshStatus,
        ]
    );


    // =====================================================
    // CLAIM DAILY GIFT
    //
    // Uses the calendar date rendered by the UI.
    // executeClaim validates it against the
    // latest Redux state before dispatching.
    // =====================================================

    const claimGift = useCallback(
        () => {

            return executeClaim({

                expectedClaimDate:
                    claimDate,

                recover: false,
            });
        },

        [
            claimDate,

            executeClaim,
        ]
    );


    // =====================================================
    // RECOVER UNCERTAIN CLAIM
    //
    // Recovery requires an explicit user action.
    //
    // Possible scenario:
    //
    // 1. User opens the gift.
    // 2. Server awards the reward.
    // 3. Internet connection is interrupted.
    // 4. Client does not receive the response.
    // 5. Status is refreshed.
    // 6. User presses the recovery button.
    //
    // Backend idempotency returns the original
    // reward without awarding it a second time.
    //
    // Recovery is never started automatically.
    // =====================================================

    const recoverClaim = useCallback(
        () => {

            return executeClaim({

                expectedClaimDate:
                    claimDate,

                recover: true,
            });
        },

        [
            claimDate,

            executeClaim,
        ]
    );


    // =====================================================
    // COMBINED ERROR
    // =====================================================

    const error = (
        claimError
        ??
        statusError
        ??
        eventError
        ??
        null
    );


    // =====================================================
    // PUBLIC HOOK API
    // =====================================================

    return {

        // ================================================
        // SHARED PRESENTATION STATE
        // ================================================

        ...entryPointView,


        // ================================================
        // AUTHENTICATION
        // ================================================

        ownerId,

        hasValidSession,

        requiresAuthentication,


        // ================================================
        // EVENT DATA
        // ================================================

        event,

        eventError,


        // ================================================
        // ELIGIBILITY DATA
        // ================================================

        status,

        statusError,

        claimDate,


        // ================================================
        // CLAIM AND REWARD DATA
        // ================================================

        claimResult,

        claimError,

        reward,

        canRecover,


        // ================================================
        // COMBINED ERROR
        // ================================================

        error,


        // ================================================
        // CONTROLLER ACTIONS
        // ================================================

        refresh,

        refreshEvent,

        refreshStatus,

        claimGift,

        recoverClaim,
    };
};


// =========================================================
// DEFAULT EXPORT
// =========================================================

export default useDailyGift;
