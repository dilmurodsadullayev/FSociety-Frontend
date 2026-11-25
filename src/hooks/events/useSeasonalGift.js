
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
    clearSeasonalGiftHistoryError,

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
// FSOCIETY — UNIVERSAL HOLIDAY GIFT HOOK
// =========================================================
//
// Location:
// src/hooks/events/useSeasonalGift.js
//
// Used for:
// - New Year
// - Navro'z
// - Ramadan
// - Future holiday events
//
// Business rule:
//
// ONE GIFT PER USER PER EVENT.
//
// Flow:
//
// 1. Load gift eligibility.
// 2. Show countdown until opening.
// 3. Backend confirms can_claim.
// 4. User clicks the gift button.
// 5. Django randomly selects a reward.
// 6. Claim is recorded by Django.
// 7. Frontend displays the result.
// 8. Further claims are blocked.
//
// No daily gifts are supported here.
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

const normalizeUserId = (value) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    return String(value);
};

const getUserId = (user) =>
    normalizeUserId(
        user?.id ?? user?.pk
    );

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

    const slug =
        normalizeSlug(eventSlug);

    const isValidSlug =
        slug.length > 0;

    // =====================================================
    // AUTH STATE
    // =====================================================

    const isLoggedIn = useSelector(
        (state) =>
            Boolean(
                state.auth?.isLoggedIn
            )
    );

    const authLoading = useSelector(
        (state) =>
            Boolean(
                state.auth?.isLoading
            )
    );

    const userId = useSelector(
        (state) =>
            getUserId(
                state.auth?.user
            )
    );

    // =====================================================
    // GIFT OWNER
    // =====================================================

    const ownerId = useSelector(
        selectSeasonalGiftOwner
    );

    // Private data may only be used when
    // the Redux gift owner matches the
    // currently authenticated user.

    const sessionReady = Boolean(
        enabled &&
        !authLoading &&
        isLoggedIn &&
        userId &&
        ownerId &&
        ownerId === userId
    );

    // =====================================================
    // STATUS
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
                ?.statusRequestByEvent
                ?.[slug] ?? IDLE
    );

    // =====================================================
    // CLAIM
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
                ?.claimRequestByEvent
                ?.[slug] ?? IDLE
    );

    // =====================================================
    // HISTORY
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
                ?.historyRequestByEvent
                ?.[slug] ?? IDLE
    );

    // =====================================================
    // ELIGIBILITY
    // =====================================================

    const backendCanClaim = useSelector(
        (state) =>
            selectSeasonalGiftCanClaim(
                state,
                slug
            )
    );

    const alreadyClaimed = useSelector(
        (state) =>
            selectSeasonalGiftAlreadyClaimed(
                state,
                slug
            )
    );

    const needsReconciliation = useSelector(
        (state) =>
            selectSeasonalGiftNeedsReconciliation(
                state,
                slug
            )
    );

    // =====================================================
    // DERIVED STATES
    // =====================================================

    const isStatusLoaded =
        statusRequest === SUCCEEDED;

    const isStatusFailed =
        statusRequest === FAILED;

    const isHistoryLoaded =
        historyRequest === SUCCEEDED;

    const isOpening =
        claimRequest === LOADING;

    const isClaimSucceeded =
        claimRequest === SUCCEEDED;

    const isClaimFailed =
        claimRequest === FAILED;

    const isRecovering =
        needsReconciliation;

    const canClaim = Boolean(
        sessionReady &&
        isValidSlug &&
        backendCanClaim &&
        !alreadyClaimed &&
        !statusLoading &&
        !claimLoading &&
        !needsReconciliation
    );

    const canOpenGift = canClaim;

    // =====================================================
    // REFRESH GIFT STATUS
    // =====================================================
    //
    // Use after countdown expiration or
    // when the user manually refreshes.
    //
    // Only GET is executed.
    //
    // =====================================================

    const refreshStatus = useCallback(
        () => {
            if (
                !sessionReady ||
                !isValidSlug
            ) {
                return Promise.resolve(
                    null
                );
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
    // INITIAL STATUS FETCH
    // =====================================================
    //
    // Only fetch when:
    //
    // - User is authenticated
    // - Owner is synchronized
    // - Event slug is valid
    // - No status has been loaded
    // - Request status is idle
    //
    // A failed request does not cause
    // an infinite automatic retry.
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
    // REFRESH HISTORY
    // =====================================================

    const refreshHistory = useCallback(
        (params) => {
            if (
                !sessionReady ||
                !isValidSlug
            ) {
                return Promise.resolve(
                    null
                );
            }

            return dispatch(
                fetchSeasonalGiftHistoryForEvent(
                    params
                        ? {
                            slug,
                            params,
                        }
                        : slug
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
    // OPTIONAL INITIAL HISTORY FETCH
    // =====================================================
    //
    // History is not loaded automatically
    // unless explicitly requested.
    //
    // This avoids unnecessary API calls
    // while browsing event cards.
    //
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
    // CURRENT SESSION VERIFICATION
    // =====================================================
    //
    // A user might log out while a POST is
    // still running.
    //
    // Do not show an old user's reward
    // after authentication changes.
    //
    // =====================================================

    const isSessionCurrent = useCallback(
        (expectedOwnerId) => {
            const state =
                store.getState();

            const currentUserId = getUserId(
                state.auth?.user
            );

            return Boolean(
                state.auth?.isLoggedIn &&
                expectedOwnerId &&
                currentUserId ===
                    expectedOwnerId &&
                state.eventsSeasonalGift
                    ?.ownerId ===
                    expectedOwnerId
            );
        },
        [store]
    );

    // =====================================================
    // CLAIM EVENT GIFT
    // =====================================================
    //
    // This function must only be called
    // from an explicit user action.
    //
    // The frontend NEVER automatically
    // opens a gift when countdown reaches 0.
    //
    // Backend controls:
    // - Opening date
    // - Eligibility
    // - Reward selection
    // - One-time uniqueness
    //
    // =====================================================

    const claimGift = useCallback(
        async () => {
            // ============================================
            // AUTH / EVENT VALIDATION
            // ============================================

            if (
                !sessionReady ||
                !isValidSlug
            ) {
                return createSkippedResult(
                    "AUTH_OR_EVENT_NOT_READY"
                );
            }

            // ============================================
            // UNCERTAIN CLAIM
            // ============================================

            if (needsReconciliation) {
                return createSkippedResult(
                    "CLAIM_RECONCILIATION_REQUIRED"
                );
            }

            // ============================================
            // ALREADY CLAIMED
            // ============================================

            if (alreadyClaimed) {
                return createSkippedResult(
                    "ALREADY_CLAIMED"
                );
            }

            // ============================================
            // NOT YET ELIGIBLE
            // ============================================

            if (!canClaim) {
                return createSkippedResult(
                    "NOT_ELIGIBLE"
                );
            }

            // ============================================
            // CAPTURE SESSION OWNER
            // ============================================

            const expectedOwnerId =
                ownerId;

            // ============================================
            // CLAIM POST
            // ============================================
            //
            // Redux thunk condition prevents
            // another simultaneous POST.
            //
            // ============================================

            const action = await dispatch(
                claimSeasonalGiftForEvent(
                    slug
                )
            );

            // ============================================
            // SESSION CHANGED
            // ============================================

            if (
                !isSessionCurrent(
                    expectedOwnerId
                )
            ) {
                return createSkippedResult(
                    "SESSION_CHANGED"
                );
            }

            // ============================================
            // CLAIM SUCCESS
            // ============================================

            if (
                claimSeasonalGiftForEvent
                    .fulfilled.match(action)
            ) {
                // The store listener refreshes
                // status with GET automatically.
                //
                // History is optional and can
                // be loaded when the modal
                // requires it.

                return {
                    ok: true,

                    skipped: false,

                    slug,

                    claim:
                        action.payload?.claim ??
                        null,

                    claimedAt:
                        action.payload?.claimedAt ??
                        null,
                };
            }

            // ============================================
            // POST WAS NOT EXECUTED
            // ============================================

            if (
                action.meta?.condition === true
            ) {
                return createSkippedResult(
                    "REQUEST_BLOCKED"
                );
            }

            // ============================================
            // CLAIM FAILED OR UNCERTAIN
            // ============================================

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

            sessionReady,
            isValidSlug,

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
            isValidSlug,
            slug,
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
            isValidSlug,
            slug,
        ]
    );

    const dismissHistoryError = useCallback(
        () => {
            if (!isValidSlug) {
                return;
            }

            dispatch(
                clearSeasonalGiftHistoryError(
                    slug
                )
            );
        },
        [
            dispatch,
            isValidSlug,
            slug,
        ]
    );

    // =====================================================
    // RETURN
    // =====================================================

    return {
        // Event
        slug,
        isValidSlug,

        // Authentication
        isLoggedIn,
        authLoading,
        sessionReady,
        ownerId,

        // Gift status
        status,
        statusRequest,
        statusLoading,
        statusError,
        statusFetchedAt,

        isStatusLoaded,
        isStatusFailed,

        // Gift eligibility
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

        // Network reconciliation
        needsReconciliation,
        isRecovering,

        // History
        history,
        historyRequest,
        historyLoading,
        historyError,
        isHistoryLoaded,

        // Operations
        refreshStatus,
        refreshHistory,
        claimGift,

        // Error actions
        dismissStatusError,
        dismissClaimError,
        dismissHistoryError,
    };
}
