
// src/hooks/dailyGift/useDailyGiftModal.js

import {
    useCallback,
} from "react";

import {
    useDispatch,
    useSelector,
    useStore,
} from "react-redux";


// =========================================================
// DAILY GIFT REDUX ACTIONS
// =========================================================

import {
    openDailyGiftModal,
    closeDailyGiftModal,

    clearDailyGiftClaimResult,
    clearDailyGiftClaimError,
} from "../../features/dailyGift/dailyGiftSlice";


// =========================================================
// DAILY GIFT ASYNC THUNKS
// =========================================================

import {
    fetchDailyGiftStatus,
} from "../../features/dailyGift/dailyGiftThunks";


// =========================================================
// DAILY GIFT SELECTORS
// =========================================================

import {
    selectDailyGiftHasValidSession,

    selectDailyGiftIsVisible,
    selectDailyGiftIsModalOpen,

    selectDailyGiftIsClaimLoading,

    selectDailyGiftClaimDate,
    selectDailyGiftModalView,
} from "../../features/dailyGift/dailyGiftSelectors";


// =========================================================
// FSOCIETY — GLOBAL DAILY GIFT MODAL HOOK
// =========================================================
//
// Responsibilities:
//
// - Open global Daily Gift modal
// - Close global Daily Gift modal
// - Toggle modal visibility
// - Refresh eligibility when opening
// - Preserve successful reward responses
// - Clear reward presentation on user request
// - Clear claim errors
//
// IMPORTANT:
//
// The modal visibility is controlled by Redux.
//
// Do not create independent local modal states
// inside Navbar or HomeSidebar.
//
// Closing the modal must not cancel a financial
// transaction or delete its reward response.
//
// =========================================================


// =========================================================
// MAIN MODAL HOOK
// =========================================================

export const useDailyGiftModal = () => {

    const dispatch = useDispatch();

    const store = useStore();


    // =====================================================
    // SHARED MODAL VIEW MODEL
    // =====================================================

    const modalView = useSelector(
        selectDailyGiftModalView
    );


    // =====================================================
    // MODAL VISIBILITY
    // =====================================================

    const isVisible = useSelector(
        selectDailyGiftIsVisible
    );


    // =====================================================
    // AUTHENTICATION
    // =====================================================

    const hasValidSession = useSelector(
        selectDailyGiftHasValidSession
    );


    // =====================================================
    // CURRENT EVENT CALENDAR DATE
    // =====================================================

    const claimDate = useSelector(
        selectDailyGiftClaimDate
    );


    // =====================================================
    // OPEN GLOBAL MODAL
    //
    // Navbar and HomeSidebar use the same action.
    //
    // Opening the modal does not create a claim.
    // =====================================================

    const openModal = useCallback(
        () => {

            const currentState =
                store.getState();


            // =============================================
            // AUTHENTICATION PROTECTION
            // =============================================

            if (
                !selectDailyGiftHasValidSession(
                    currentState
                )
            ) {

                return false;
            }


            // =============================================
            // EVENT VISIBILITY PROTECTION
            //
            // The normal entry points are visible
            // only for active or scheduled events.
            // =============================================

            if (
                !selectDailyGiftIsVisible(
                    currentState
                )
            ) {

                return false;
            }


            // =============================================
            // DUPLICATE OPEN PROTECTION
            // =============================================

            if (
                selectDailyGiftIsModalOpen(
                    currentState
                )
            ) {

                return true;
            }


            // =============================================
            // OPEN SHARED REDUX MODAL
            // =============================================

            dispatch(
                openDailyGiftModal()
            );


            // =============================================
            // REFRESH ELIGIBILITY
            //
            // Do not interfere with an existing
            // gift claim that is still pending.
            //
            // The async thunk condition prevents
            // duplicate status requests.
            // =============================================

            if (
                !selectDailyGiftIsClaimLoading(
                    currentState
                )
            ) {

                void dispatch(
                    fetchDailyGiftStatus()
                );
            }


            return true;
        },

        [
            dispatch,

            store,
        ]
    );


    // =====================================================
    // CLOSE GLOBAL MODAL
    //
    // Closing the modal:
    //
    // - Does not cancel the claim
    // - Does not delete the reward
    // - Does not reset eligibility
    // - Does not reset reward history
    //
    // If the server response arrives after closing,
    // Redux still preserves the awarded reward.
    // =====================================================

    const closeModal = useCallback(
        () => {

            dispatch(
                closeDailyGiftModal()
            );
        },

        [dispatch]
    );


    // =====================================================
    // TOGGLE GLOBAL MODAL
    //
    // Read current Redux state instead of using
    // a potentially stale React closure.
    // =====================================================

    const toggleModal = useCallback(
        () => {

            const currentState =
                store.getState();


            if (
                selectDailyGiftIsModalOpen(
                    currentState
                )
            ) {

                closeModal();

                return false;
            }


            return openModal();
        },

        [
            store,

            closeModal,

            openModal,
        ]
    );


    // =====================================================
    // DISMISS REWARD PRESENTATION
    //
    // Called when the user explicitly dismisses
    // the revealed reward.
    //
    // Does not delete any backend record.
    // Does not modify coins, badges or frames.
    //
    // The Redux slice preserves uncertainDate
    // if an unresolved claim exists.
    // =====================================================

    const dismissReward = useCallback(
        () => {

            const currentState =
                store.getState();


            if (
                !selectDailyGiftHasValidSession(
                    currentState
                )
                ||
                selectDailyGiftIsClaimLoading(
                    currentState
                )
            ) {

                return false;
            }


            dispatch(
                clearDailyGiftClaimResult()
            );


            return true;
        },

        [
            dispatch,

            store,
        ]
    );


    // =====================================================
    // CLEAR CLAIM ERROR
    //
    // Clear only the presentation error.
    //
    // This operation never sends a claim
    // request and does not remove uncertainty.
    // =====================================================

    const clearError = useCallback(
        () => {

            const currentState =
                store.getState();


            if (
                !selectDailyGiftHasValidSession(
                    currentState
                )
                ||
                selectDailyGiftIsClaimLoading(
                    currentState
                )
            ) {

                return false;
            }


            dispatch(
                clearDailyGiftClaimError()
            );


            return true;
        },

        [
            dispatch,

            store,
        ]
    );


    // =====================================================
    // CLOSE AND DISMISS REWARD
    //
    // Used by the final "Done" button after
    // reward presentation.
    //
    // Normal modal closing must use closeModal()
    // so that a recently awarded reward is not
    // accidentally discarded.
    // =====================================================

    const finishRewardPresentation = useCallback(
        () => {

            const dismissed =
                dismissReward();


            if (!dismissed) {

                return false;
            }


            closeModal();


            return true;
        },

        [
            dismissReward,

            closeModal,
        ]
    );


    // =====================================================
    // REWARD PRESENTATION STATE
    // =====================================================

    const hasReward = Boolean(
        modalView.claimResult
        &&
        modalView.reward
    );


    const rewardClaimDate =
        modalView.claimResult?.claim_date
        ??
        null;


    // =====================================================
    // HISTORICAL REWARD DETECTION
    //
    // A reward may remain in Redux after a new
    // calendar day starts.
    //
    // Do not automatically delete it. The UI
    // can distinguish today's reward from a
    // previously opened reward.
    // =====================================================

    const isRewardFromToday = (
        hasReward
        &&
        typeof rewardClaimDate === "string"
        &&
        typeof claimDate === "string"
        &&
        rewardClaimDate === claimDate
    );


    const isHistoricalReward = (
        hasReward
        &&
        typeof rewardClaimDate === "string"
        &&
        typeof claimDate === "string"
        &&
        rewardClaimDate !== claimDate
    );


    // =====================================================
    // PUBLIC HOOK API
    // =====================================================

    return {

        // ================================================
        // SHARED MODAL STATE
        // ================================================

        ...modalView,


        // ================================================
        // AUTHENTICATION AND VISIBILITY
        // ================================================

        isVisible,

        hasValidSession,


        // ================================================
        // REWARD PRESENTATION
        // ================================================

        hasReward,

        rewardClaimDate,

        isRewardFromToday,

        isHistoricalReward,


        // ================================================
        // MODAL ACTIONS
        // ================================================

        openModal,

        closeModal,

        toggleModal,


        // ================================================
        // REWARD ACTIONS
        // ================================================

        dismissReward,

        finishRewardPresentation,


        // ================================================
        // ERROR ACTIONS
        // ================================================

        clearError,
    };
};


// =========================================================
// DEFAULT EXPORT
// =========================================================

export default useDailyGiftModal;
