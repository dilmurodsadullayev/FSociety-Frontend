
// src/hooks/events/useSeasonalGift.js

import {
    useCallback,
    useEffect,
} from "react";

import {
    useDispatch,
    useSelector,
    useStore,
} from "react-redux";

import {
    SEASONAL_GIFT_REQUEST_STATUS,

    fetchSeasonalGiftStatusForEvent,
    fetchSeasonalGiftHistoryForEvent,
    claimSeasonalGiftForEvent,

    clearSeasonalGiftStatusError,
    clearSeasonalGiftClaimError,

    selectSeasonalGiftOwner,
    selectSeasonalGiftEventStatus,
    selectSeasonalGiftStatusLoading,
    selectSeasonalGiftStatusError,
    selectSeasonalGiftStatusFetchedAt,

    selectSeasonalGiftEventClaim,
    selectSeasonalGiftClaimLoading,
    selectSeasonalGiftClaimError,

    selectSeasonalGiftEventHistory,
    selectSeasonalGiftHistoryLoading,
    selectSeasonalGiftHistoryError,

    selectSeasonalGiftAlreadyClaimed,
    selectSeasonalGiftCanClaim,
    selectSeasonalGiftNeedsReconciliation,
} from "../../features/events/seasonalGiftSlice";


// =========================================================
// FSOCIETY — SEASONAL GIFT HOOK
// =========================================================
//
// Location:
// src/hooks/events/useSeasonalGift.js
//
// Responsibilities:
//
// - Load authenticated gift status
// - Read backend eligibility
// - Claim one-time seasonal gifts
// - Prevent duplicate claim attempts
// - Fetch gift history
// - Handle uncertain claim outcomes
// - Protect against account switching
// - Provide convenient UI state
//
// IMPORTANT:
//
// The backend chooses all rewards.
//
// This hook never:
// - Selects random rewards
// - Modifies FCoin balances directly
// - Automatically submits claim POST
// - Retries an uncertain claim POST
//
// =========================================================


// =========================================================
// CONSTANTS
// =========================================================

const {
    IDLE,
    LOADING,
    SUCCEEDED,
    FAILED,
} = SEASONAL_GIFT_REQUEST_STATUS;

const SLUG_PATTERN =
    /^[a-zA-Z0-9_-]+$/;


// =========================================================
// HELPERS
// =========================================================

const normalizeSlug = (value) => {
    if (typeof value !== "string") {
        return "";
    }

    const slug = value.trim();

    return SLUG_PATTERN.test(slug)
        ? slug
        : "";
};

const getUserId = (user) => {
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

const createSkippedResult = (reason) => ({
    ok: false,
    skipped: true,
    reason,
});


// =========================================================
// HOOK
// =========================================================

export default function useSeasonalGift(
    eventSlug,
    {
        enabled = true,
        autoFetch = true,
        autoFetchHistory = false,
    } = {}
) {
    const dispatch = useDispatch();

    const store = useStore();

    // =====================================================
    // EVENT SLUG
    // =====================================================

    const slug = normalizeSlug(eventSlug);

    const isValidSlug = Boolean(slug);

    // =====================================================
    // AUTHENTICATION
    // =====================================================

    const isLoggedIn = useSelector(
        (state) =>
            Boolean(state.auth?.isLoggedIn)
    );

    const authLoading = useSelector(
        (state) =>
            Boolean(state.auth?.isLoading)
    );

    const userId = useSelector(
        (state) =>
            getUserId(state.auth?.user)
    );

    const ownerId = useSelector(
        selectSeasonalGiftOwner
    );

    const sessionReady = Boolean(
        enabled &&
        !authLoading &&
        isLoggedIn &&
        userId &&
        ownerId === userId
    );

    // =====================================================
    // GIFT STATUS
    // =====================================================

    const status = useSelector(
        (state) =>
            selectSeasonalGiftEventStatus(
                state,
                slug
            )
    );

    const statusLoading = useSelector(
        (state) =>
            selectSeasonalGiftStatusLoading(
                state,
                slug
            )
    );

    const statusError = useSelector(
        (state) =>
            selectSeasonalGiftStatusError(
                state,
                slug
            )
    );

    const statusFetchedAt = useSelector(
        (state) =>
            selectSeasonalGiftStatusFetchedAt(
                state,
                slug
            )
    );

    const statusRequest = useSelector(
        (state) =>
            state.eventsSeasonalGift
                ?.statusRequestByEvent?.[slug] ??
            IDLE
    );

    // =====================================================
    // GIFT CLAIM
    // =====================================================

    const claimResult = useSelector(
        (state) =>
            selectSeasonalGiftEventClaim(
                state,
                slug
            )
    );

    const claimLoading = useSelector(
        (state) =>
            selectSeasonalGiftClaimLoading(
                state,
                slug
            )
    );

    const claimError = useSelector(
        (state) =>
            selectSeasonalGiftClaimError(
                state,
                slug
            )
    );

    const claimRequest = useSelector(
        (state) =>
            state.eventsSeasonalGift
                ?.claimRequestByEvent?.[slug] ??
            IDLE
    );

    const needsReconciliation = useSelector(
        (state) =>
            selectSeasonalGiftNeedsReconciliation(
                state,
                slug
            )
    );

    // =====================================================
    // GIFT HISTORY
    // =====================================================

    const history = useSelector(
        (state) =>
            selectSeasonalGiftEventHistory(
                state,
                slug
            )
    );

    const historyLoading = useSelector(
        (state) =>
            selectSeasonalGiftHistoryLoading(
                state,
                slug
            )
    );

    const historyError = useSelector(
        (state) =>
            selectSeasonalGiftHistoryError(
                state,
                slug
            )
    );

    const historyRequest = useSelector(
        (state) =>
            state.eventsSeasonalGift
                ?.historyRequestByEvent?.[slug] ??
            IDLE
    );

    // =====================================================
    // SERVER-AUTHORITATIVE ELIGIBILITY
    // =====================================================

    const alreadyClaimed = useSelector(
        (state) =>
            selectSeasonalGiftAlreadyClaimed(
                state,
                slug
            )
    );

    const backendCanClaim = useSelector(
        (state) =>
            selectSeasonalGiftCanClaim(
                state,
                slug
            )
    );

    const canClaim = Boolean(
        sessionReady &&
        isValidSlug &&
        !statusLoading &&
        !claimLoading &&
        !needsReconciliation &&
        !alreadyClaimed &&
        backendCanClaim
    );

    // =====================================================
    // FETCH STATUS
    // =====================================================

    const refreshStatus = useCallback(
        () => {
            if (
                !sessionReady ||
                !isValidSlug
            ) {
                return Promise.resolve(null);
            }

            return dispatch(
                fetchSeasonalGiftStatusForEvent(
                    slug
                )
            );
        },
        [
            dispatch,
            sessionReady,
            isValidSlug,
            slug,
        ]
    );

    // =====================================================
    // INITIAL STATUS LOAD
    // =====================================================
    //
    // Initial fetch occurs only when:
    //
    // - Auth session is ready
    // - A valid event slug exists
    // - No status has been loaded
    // - No status request is running
    //
    // Failed requests are not automatically
    // retried in an infinite loop.
    //
    // =====================================================

    useEffect(() => {
        if (
            !autoFetch ||
            !sessionReady ||
            !isValidSlug ||
            statusRequest !== IDLE ||
            status !== null
        ) {
            return;
        }

        dispatch(
            fetchSeasonalGiftStatusForEvent(
                slug
            )
        );
    }, [
        dispatch,
        autoFetch,
        sessionReady,
        isValidSlug,
        slug,
        statusRequest,
        status,
    ]);

    // =====================================================
    // FETCH HISTORY
    // =====================================================

    const refreshHistory = useCallback(
        (params) => {
            if (
                !sessionReady ||
                !isValidSlug
            ) {
                return Promise.resolve(null);
            }

            return dispatch(
                fetchSeasonalGiftHistoryForEvent({
                    slug,
                    ...(params ? { params } : {}),
                })
            );
        },
        [
            dispatch,
            sessionReady,
            isValidSlug,
            slug,
        ]
    );

    // =====================================================
    // OPTIONAL INITIAL HISTORY LOAD
    // =====================================================

    useEffect(() => {
        if (
            !autoFetchHistory ||
            !sessionReady ||
            !isValidSlug ||
            historyRequest !== IDLE ||
            history !== null
        ) {
            return;
        }

        dispatch(
            fetchSeasonalGiftHistoryForEvent(
                slug
            )
        );
    }, [
        dispatch,
        autoFetchHistory,
        sessionReady,
        isValidSlug,
        slug,
        historyRequest,
        history,
    ]);

    // =====================================================
    // CHECK CURRENT SESSION
    // =====================================================
    //
    // Protect reward UI from showing an old
    // user's claim after account switching.
    //
    // =====================================================

    const isSessionCurrent = useCallback(
        (expectedOwnerId) => {
            const state = store.getState();

            const currentUserId = getUserId(
                state.auth?.user
            );

            return Boolean(
                state.auth?.isLoggedIn &&
                expectedOwnerId &&
                currentUserId === expectedOwnerId &&
                state.eventsSeasonalGift?.ownerId ===
                    expectedOwnerId
            );
        },
        [store]
    );

    // =====================================================
    // CLAIM SEASONAL GIFT
    // =====================================================
    //
    // Must be called only by explicit UI action:
    //
    // <button onClick={handleClaim}>
    //     Sovg‘ani ochish
    // </button>
    //
    // The Redux thunk performs one POST.
    //
    // The Redux store listener performs a
    // follow-up GET after claim completion.
    //
    // =====================================================

    const claimGift = useCallback(
        async () => {
            // =============================================
            // VALIDATION
            // =============================================

            if (
                !isValidSlug ||
                !sessionReady
            ) {
                return createSkippedResult(
                    "AUTH_OR_EVENT_NOT_READY"
                );
            }

            if (needsReconciliation) {
                return createSkippedResult(
                    "CLAIM_RECONCILIATION_REQUIRED"
                );
            }

            if (alreadyClaimed) {
                return createSkippedResult(
                    "ALREADY_CLAIMED"
                );
            }

            if (!canClaim) {
                return createSkippedResult(
                    "NOT_ELIGIBLE"
                );
            }

            // =============================================
            // CAPTURE CURRENT OWNER
            // =============================================

            const expectedOwnerId = ownerId;

            // =============================================
            // DISPATCH CLAIM
            // =============================================

            const action = await dispatch(
                claimSeasonalGiftForEvent(
                    slug
                )
            );

            // =============================================
            // SESSION CHANGED DURING REQUEST
            // =============================================

            if (
                !isSessionCurrent(
                    expectedOwnerId
                )
            ) {
                return createSkippedResult(
                    "SESSION_CHANGED"
                );
            }

            // =============================================
            // SUCCESS
            // =============================================

            if (
                claimSeasonalGiftForEvent
                    .fulfilled.match(action)
            ) {
                // Refresh history with GET only.
                //
                // Status refresh is already handled
                // by the store listener.

                dispatch(
                    fetchSeasonalGiftHistoryForEvent(
                        slug
                    )
                );

                return {
                    ok: true,
                    skipped: false,

                    claim:
                        action.payload?.claim ??
                        null,

                    slug,
                };
            }

            // =============================================
            // CONDITION REJECTED
            // =============================================
            //
            // The Redux thunk may reject because
            // another claim request is pending.
            //
            // This does not create a new POST.
            //
            // =============================================

            if (
                action.meta?.condition === true
            ) {
                return createSkippedResult(
                    "REQUEST_BLOCKED"
                );
            }

            // =============================================
            // CLAIM FAILED / UNKNOWN RESULT
            // =============================================

            return {
                ok: false,
                skipped: false,

                error:
                    action.payload ??
                    action.error ??
                    null,

                needsReconciliation:
                    action.payload
                        ?.needsReconciliation ===
                    true,
            };
        },
        [
            dispatch,
            slug,
            ownerId,

            isValidSlug,
            sessionReady,

            canClaim,
            alreadyClaimed,
            needsReconciliation,

            isSessionCurrent,
        ]
    );

    // =====================================================
    // DISMISS ERRORS
    // =====================================================

    const dismissStatusError = useCallback(
        () => {
            if (!isValidSlug) {
                return;
            }

            dispatch(
                clearSeasonalGiftStatusError(
                    slug
                )
            );
        },
        [
            dispatch,
            slug,
            isValidSlug,
        ]
    );

    const dismissClaimError = useCallback(
        () => {
            if (!isValidSlug) {
                return;
            }

            dispatch(
                clearSeasonalGiftClaimError(
                    slug
                )
            );
        },
        [
            dispatch,
            slug,
            isValidSlug,
        ]
    );

    // =====================================================
    // DERIVED UI STATE
    // =====================================================

    const isStatusLoaded =
        statusRequest === SUCCEEDED;

    const isClaimSucceeded =
        claimRequest === SUCCEEDED;

    const isClaimFailed =
        claimRequest === FAILED;

    const isOpening =
        claimRequest === LOADING;

    const isHistoryLoaded =
        historyRequest === SUCCEEDED;

    const isRecovering =
        needsReconciliation ||
        (
            needsReconciliation &&
            statusLoading
        );

    const canOpenGift =
        canClaim &&
        !isOpening &&
        !isRecovering;

    // =====================================================
    // RETURN
    // =====================================================

    return {
        // Event
        slug,
        isValidSlug,

        // Authentication
        ownerId,
        isLoggedIn,
        authLoading,
        sessionReady,

        // Status
        status,
        statusRequest,
        statusLoading,
        statusError,
        statusFetchedAt,

        isStatusLoaded,

        // Eligibility
        canClaim,
        canOpenGift,
        alreadyClaimed,

        // Claim
        claimResult,
        claimRequest,
        claimLoading,
        claimError,

        isOpening,
        isClaimSucceeded,
        isClaimFailed,

        // Recovery
        needsReconciliation,
        isRecovering,

        // History
        history,
        historyRequest,
        historyLoading,
        historyError,
        isHistoryLoaded,

        // Actions
        refreshStatus,
        refreshHistory,
        claimGift,

        dismissStatusError,
        dismissClaimError,
    };
}
