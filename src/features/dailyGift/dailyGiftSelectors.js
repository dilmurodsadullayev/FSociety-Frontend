
// src/features/dailyGift/dailyGiftSelectors.js

import {
    createSelector,
} from "@reduxjs/toolkit";

import {
    DAILY_GIFT_EVENT_SLUG,
    DAILY_GIFT_EVENT_STATUS,
    DAILY_GIFT_REQUEST_STATUS,
    DAILY_GIFT_ELIGIBILITY_REASON,
    DAILY_GIFT_HISTORY_PAGINATION,
} from "../../config/dailyGiftConfig";

import {
    getDailyGiftUserId,
} from "./dailyGiftThunks";


// =========================================================
// FSOCIETY — DAILY GIFT SELECTORS
// =========================================================
//
// Responsibilities:
//
// - Public event selectors
// - Authenticated gift state
// - Session isolation
// - Gift availability
// - Claim lifecycle
// - Uncertain claim recovery
// - Global modal visibility
// - Countdown source data
// - Reward history
// - Memoized UI view models
//
// IMPORTANT:
//
// Selectors must remain pure.
//
// No API requests, dispatch, browser storage,
// timers or reward selection inside selectors.
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
} = DAILY_GIFT_REQUEST_STATUS;

const {
    DISABLED,
    SCHEDULED,
    ACTIVE,
    FINISHED,
} = DAILY_GIFT_EVENT_STATUS;

const {
    DEFAULT_PAGE_SIZE,
} = DAILY_GIFT_HISTORY_PAGINATION;


// =========================================================
// STABLE FALLBACK VALUES
// =========================================================

const EMPTY_HISTORY_RESULTS =
    Object.freeze([]);

const EMPTY_REQUEST_STATE = Object.freeze({
    data: null,

    requestStatus: IDLE,

    requestId: null,

    error: null,
});

const EMPTY_CLAIM_STATE = Object.freeze({
    ...EMPTY_REQUEST_STATE,

    httpStatus: null,

    claimDate: null,

    uncertainDate: null,
});

const EMPTY_UI_STATE = Object.freeze({
    isModalOpen: false,
});


// =========================================================
// ROOT SELECTORS
// =========================================================

export const selectDailyGiftState = (
    state
) => (
    state.dailyGift ?? null
);


export const selectDailyGiftOwnerId = (
    state
) => (
    state.dailyGift?.ownerId ?? null
);


export const selectDailyGiftEventSlug = () =>
    DAILY_GIFT_EVENT_SLUG;


// =========================================================
// AUTHENTICATION SELECTORS
// =========================================================

export const selectDailyGiftAuthenticatedUserId = (
    state
) => {
    if (!state.auth?.isLoggedIn) {
        return null;
    }

    return getDailyGiftUserId(
        state.auth.user
    );
};


export const selectDailyGiftHasValidSession =
    createSelector(
        [
            selectDailyGiftAuthenticatedUserId,
            selectDailyGiftOwnerId,
        ],

        (
            authenticatedUserId,
            ownerId
        ) => (
            authenticatedUserId !== null &&
            authenticatedUserId === ownerId
        )
    );


// =========================================================
// PUBLIC EVENT SELECTORS
// =========================================================

export const selectDailyGiftEventState = (
    state
) => (
    state.dailyGift?.event ??
    EMPTY_REQUEST_STATE
);


export const selectDailyGiftEvent = createSelector(
    [selectDailyGiftEventState],

    (event) => event.data
);


export const selectDailyGiftEventRequestStatus =
    createSelector(
        [selectDailyGiftEventState],

        (event) => event.requestStatus
    );


export const selectDailyGiftEventError =
    createSelector(
        [selectDailyGiftEventState],

        (event) => event.error
    );


export const selectDailyGiftIsEventLoading =
    createSelector(
        [selectDailyGiftEventRequestStatus],

        (status) => status === LOADING
    );


export const selectDailyGiftIsEventLoaded =
    createSelector(
        [selectDailyGiftEventRequestStatus],

        (status) => status === SUCCEEDED
    );


// =========================================================
// PRIVATE STATUS SELECTORS
//
// Do not expose another user's private state
// during authentication transitions.
// =========================================================

export const selectDailyGiftStatusState = (
    state
) => {
    if (!selectDailyGiftHasValidSession(state)) {
        return EMPTY_REQUEST_STATE;
    }

    return (
        state.dailyGift?.status ??
        EMPTY_REQUEST_STATE
    );
};


export const selectDailyGiftStatus =
    createSelector(
        [selectDailyGiftStatusState],

        (status) => status.data
    );


export const selectDailyGiftStatusRequestStatus =
    createSelector(
        [selectDailyGiftStatusState],

        (status) => status.requestStatus
    );


export const selectDailyGiftStatusError =
    createSelector(
        [selectDailyGiftStatusState],

        (status) => status.error
    );


export const selectDailyGiftIsStatusLoading =
    createSelector(
        [selectDailyGiftStatusRequestStatus],

        (status) => status === LOADING
    );


export const selectDailyGiftIsStatusLoaded =
    createSelector(
        [selectDailyGiftStatusRequestStatus],

        (status) => status === SUCCEEDED
    );


// =========================================================
// EVENT LIFECYCLE
//
// Authenticated eligibility is preferred when available.
//
// Public event information is used as fallback.
// =========================================================

export const selectDailyGiftCurrentEventStatus =
    createSelector(
        [
            selectDailyGiftStatus,
            selectDailyGiftEvent,
        ],

        (
            eligibility,
            event
        ) => (
            eligibility?.event_status ??
            event?.status ??
            null
        )
    );


export const selectDailyGiftIsEventActive =
    createSelector(
        [selectDailyGiftCurrentEventStatus],

        (status) => status === ACTIVE
    );


export const selectDailyGiftIsEventScheduled =
    createSelector(
        [selectDailyGiftCurrentEventStatus],

        (status) => status === SCHEDULED
    );


export const selectDailyGiftIsEventDisabled =
    createSelector(
        [selectDailyGiftCurrentEventStatus],

        (status) => status === DISABLED
    );


export const selectDailyGiftIsEventFinished =
    createSelector(
        [selectDailyGiftCurrentEventStatus],

        (status) => status === FINISHED
    );


// =========================================================
// ELIGIBILITY SELECTORS
// =========================================================

export const selectDailyGiftClaimDate =
    createSelector(
        [selectDailyGiftStatus],

        (status) => (
            status?.claim_date ?? null
        )
    );


export const selectDailyGiftEligibilityReason =
    createSelector(
        [selectDailyGiftStatus],

        (status) => (
            status?.reason ?? null
        )
    );


export const selectDailyGiftEligibilityMessage =
    createSelector(
        [selectDailyGiftStatus],

        (status) => (
            status?.message ?? null
        )
    );


export const selectDailyGiftIsClaimedToday =
    createSelector(
        [selectDailyGiftStatus],

        (status) => (
            status?.claimed_today === true
        )
    );


export const selectDailyGiftServerCanClaim =
    createSelector(
        [selectDailyGiftStatus],

        (status) => (
            status?.can_claim === true
        )
    );


// =========================================================
// CLAIM STATE SELECTORS
// =========================================================

export const selectDailyGiftClaimState = (
    state
) => {
    if (!selectDailyGiftHasValidSession(state)) {
        return EMPTY_CLAIM_STATE;
    }

    return (
        state.dailyGift?.claim ??
        EMPTY_CLAIM_STATE
    );
};


export const selectDailyGiftClaimResult =
    createSelector(
        [selectDailyGiftClaimState],

        (claim) => claim.data
    );


export const selectDailyGiftClaimRequestStatus =
    createSelector(
        [selectDailyGiftClaimState],

        (claim) => claim.requestStatus
    );


export const selectDailyGiftClaimError =
    createSelector(
        [selectDailyGiftClaimState],

        (claim) => claim.error
    );


export const selectDailyGiftClaimHttpStatus =
    createSelector(
        [selectDailyGiftClaimState],

        (claim) => claim.httpStatus
    );


export const selectDailyGiftIsClaimLoading =
    createSelector(
        [selectDailyGiftClaimRequestStatus],

        (status) => status === LOADING
    );


export const selectDailyGiftIsClaimSucceeded =
    createSelector(
        [selectDailyGiftClaimRequestStatus],

        (status) => status === SUCCEEDED
    );


export const selectDailyGiftIsClaimFailed =
    createSelector(
        [selectDailyGiftClaimRequestStatus],

        (status) => status === FAILED
    );


// =========================================================
// UNCERTAIN CLAIM RECOVERY
// =========================================================

export const selectDailyGiftUncertainDate =
    createSelector(
        [selectDailyGiftClaimState],

        (claim) => claim.uncertainDate
    );


export const selectDailyGiftHasUncertainClaim =
    createSelector(
        [selectDailyGiftUncertainDate],

        (uncertainDate) => (
            typeof uncertainDate === "string" &&
            Boolean(uncertainDate)
        )
    );


export const selectDailyGiftHasUncertainClaimToday =
    createSelector(
        [
            selectDailyGiftUncertainDate,
            selectDailyGiftClaimDate,
        ],

        (
            uncertainDate,
            claimDate
        ) => (
            uncertainDate !== null &&
            claimDate !== null &&
            uncertainDate === claimDate
        )
    );


export const selectDailyGiftCanRecoverClaim =
    createSelector(
        [
            selectDailyGiftHasValidSession,
            selectDailyGiftIsStatusLoaded,
            selectDailyGiftIsClaimLoading,
            selectDailyGiftHasUncertainClaimToday,
            selectDailyGiftServerCanClaim,
            selectDailyGiftIsClaimedToday,
        ],

        (
            hasValidSession,
            isStatusLoaded,
            isClaimLoading,
            hasUncertainClaim,
            canClaim,
            claimedToday
        ) => (
            hasValidSession &&
            isStatusLoaded &&
            !isClaimLoading &&
            hasUncertainClaim &&
            (
                canClaim ||
                claimedToday
            )
        )
    );


// =========================================================
// FINAL CLAIM AVAILABILITY
//
// Backend eligibility remains authoritative.
//
// UI cannot submit a normal claim while:
//
// - Authentication is invalid
// - Status is loading or unavailable
// - Another claim is pending
// - An uncertain claim requires recovery
//
// =========================================================

export const selectDailyGiftCanClaim =
    createSelector(
        [
            selectDailyGiftHasValidSession,
            selectDailyGiftIsStatusLoaded,
            selectDailyGiftServerCanClaim,
            selectDailyGiftIsClaimLoading,
            selectDailyGiftHasUncertainClaimToday,
            selectDailyGiftClaimDate,
        ],

        (
            hasValidSession,
            isStatusLoaded,
            serverCanClaim,
            isClaimLoading,
            hasUncertainClaim,
            claimDate
        ) => (
            hasValidSession &&
            isStatusLoaded &&
            serverCanClaim &&
            !isClaimLoading &&
            !hasUncertainClaim &&
            typeof claimDate === "string"
        )
    );


// =========================================================
// REWARD SELECTORS
//
// Do not calculate or mutate the awarded reward.
//
// Backend is the source of truth.
// =========================================================

export const selectDailyGiftReward =
    createSelector(
        [selectDailyGiftClaimResult],

        (claim) => (
            claim?.reward ?? null
        )
    );


export const selectDailyGiftRewardType =
    createSelector(
        [selectDailyGiftReward],

        (reward) => (
            reward?.type ?? null
        )
    );


export const selectDailyGiftAwardedRewardType =
    createSelector(
        [selectDailyGiftReward],

        (reward) => (
            reward?.awarded_reward_type ??
            null
        )
    );


export const selectDailyGiftRewardRarity =
    createSelector(
        [selectDailyGiftReward],

        (reward) => (
            reward?.rarity ?? null
        )
    );


export const selectDailyGiftAwardedCoins =
    createSelector(
        [selectDailyGiftReward],

        (reward) => (
            reward?.awarded_coins ?? 0
        )
    );


export const selectDailyGiftRewardItem =
    createSelector(
        [selectDailyGiftReward],

        (reward) => (
            reward?.item ?? null
        )
    );


export const selectDailyGiftIsCompensation =
    createSelector(
        [selectDailyGiftReward],

        (reward) => (
            reward?.is_compensation === true
        )
    );


export const selectDailyGiftIsNewClaim =
    createSelector(
        [selectDailyGiftClaimResult],

        (claim) => (
            claim?.created === true
        )
    );


export const selectDailyGiftIsReplayedClaim =
    createSelector(
        [selectDailyGiftClaimResult],

        (claim) => (
            claim?.already_claimed === true
        )
    );


// =========================================================
// GLOBAL MODAL SELECTORS
// =========================================================

export const selectDailyGiftUIState = (
    state
) => {
    if (!selectDailyGiftHasValidSession(state)) {
        return EMPTY_UI_STATE;
    }

    return (
        state.dailyGift?.ui ??
        EMPTY_UI_STATE
    );
};


export const selectDailyGiftIsModalOpen =
    createSelector(
        [selectDailyGiftUIState],

        (ui) => (
            ui.isModalOpen === true
        )
    );


// =========================================================
// NAVBAR / SIDEBAR VISIBILITY
//
// Scheduled event:
//     Show countdown.
//
// Active event:
//     Show daily gift.
//
// Disabled / finished event:
//     Hide normal entry points.
// =========================================================

export const selectDailyGiftIsVisible =
    createSelector(
        [
            selectDailyGiftHasValidSession,
            selectDailyGiftCurrentEventStatus,
        ],

        (
            hasValidSession,
            eventStatus
        ) => (
            hasValidSession &&
            (
                eventStatus === ACTIVE ||
                eventStatus === SCHEDULED
            )
        )
    );


export const selectDailyGiftAvailableCount =
    createSelector(
        [selectDailyGiftCanClaim],

        (canClaim) => (
            canClaim ? 1 : 0
        )
    );


// =========================================================
// COUNTDOWN SOURCE SELECTORS
//
// These are server-provided values.
//
// Actual countdown logic will be implemented
// inside useDailyGiftCountdown.
//
// Never call Date.now() inside a memoized selector.
// =========================================================

export const selectDailyGiftServerTime =
    createSelector(
        [selectDailyGiftStatus],

        (status) => (
            status?.server_time ?? null
        )
    );


export const selectDailyGiftTimezone =
    createSelector(
        [
            selectDailyGiftStatus,
            selectDailyGiftEvent,
        ],

        (
            status,
            event
        ) => (
            status?.timezone ??
            event?.timezone ??
            null
        )
    );


export const selectDailyGiftDailyResetAt =
    createSelector(
        [selectDailyGiftStatus],

        (status) => (
            status?.daily_reset_at ?? null
        )
    );


export const selectDailyGiftNextClaimAt =
    createSelector(
        [selectDailyGiftStatus],

        (status) => (
            status?.next_claim_at ?? null
        )
    );


export const selectDailyGiftEventStartsAt =
    createSelector(
        [
            selectDailyGiftStatus,
            selectDailyGiftEvent,
        ],

        (
            status,
            event
        ) => (
            status?.event_starts_at ??
            event?.starts_at ??
            null
        )
    );


export const selectDailyGiftEventEndsAt =
    createSelector(
        [
            selectDailyGiftStatus,
            selectDailyGiftEvent,
        ],

        (
            status,
            event
        ) => (
            status?.event_ends_at ??
            event?.ends_at ??
            null
        )
    );


// =========================================================
// SERVER COUNTDOWN SECONDS
// =========================================================

const normalizeSeconds = (value) => {
    if (
        typeof value !== "number" ||
        !Number.isFinite(value)
    ) {
        return null;
    }

    return Math.max(
        0,
        Math.ceil(value)
    );
};


export const selectDailyGiftSecondsUntilReset =
    createSelector(
        [selectDailyGiftStatus],

        (status) => (
            normalizeSeconds(
                status?.seconds_until_reset
            )
        )
    );


export const selectDailyGiftSecondsUntilNextClaim =
    createSelector(
        [selectDailyGiftStatus],

        (status) => (
            normalizeSeconds(
                status?.seconds_until_next_claim
            )
        )
    );


export const selectDailyGiftSecondsUntilEventEnd =
    createSelector(
        [selectDailyGiftStatus],

        (status) => (
            normalizeSeconds(
                status?.seconds_until_event_end
            )
        )
    );


// =========================================================
// MEMOIZED COUNTDOWN SOURCE
// =========================================================

export const selectDailyGiftCountdownSource =
    createSelector(
        [
            selectDailyGiftCurrentEventStatus,
            selectDailyGiftServerTime,
            selectDailyGiftTimezone,
            selectDailyGiftDailyResetAt,
            selectDailyGiftNextClaimAt,
            selectDailyGiftEventStartsAt,
            selectDailyGiftEventEndsAt,
            selectDailyGiftSecondsUntilReset,
            selectDailyGiftSecondsUntilNextClaim,
            selectDailyGiftSecondsUntilEventEnd,
        ],

        (
            eventStatus,
            serverTime,
            timezone,
            dailyResetAt,
            nextClaimAt,
            eventStartsAt,
            eventEndsAt,
            secondsUntilReset,
            secondsUntilNextClaim,
            secondsUntilEventEnd
        ) => ({
            eventStatus,

            serverTime,

            timezone,

            dailyResetAt,

            nextClaimAt,

            eventStartsAt,

            eventEndsAt,

            secondsUntilReset,

            secondsUntilNextClaim,

            secondsUntilEventEnd,
        })
    );


// =========================================================
// HISTORY STATE SELECTORS
// =========================================================

export const selectDailyGiftHistoryState = (
    state
) => {
    if (!selectDailyGiftHasValidSession(state)) {
        return EMPTY_REQUEST_STATE;
    }

    return (
        state.dailyGift?.history ??
        EMPTY_REQUEST_STATE
    );
};


export const selectDailyGiftHistory =
    createSelector(
        [selectDailyGiftHistoryState],

        (history) => history.data
    );


export const selectDailyGiftHistoryRequestStatus =
    createSelector(
        [selectDailyGiftHistoryState],

        (history) => history.requestStatus
    );


export const selectDailyGiftHistoryError =
    createSelector(
        [selectDailyGiftHistoryState],

        (history) => history.error
    );


export const selectDailyGiftIsHistoryLoading =
    createSelector(
        [selectDailyGiftHistoryRequestStatus],

        (status) => status === LOADING
    );


export const selectDailyGiftIsHistoryLoaded =
    createSelector(
        [selectDailyGiftHistoryRequestStatus],

        (status) => status === SUCCEEDED
    );


// =========================================================
// HISTORY RESULTS
// =========================================================

export const selectDailyGiftHistoryResults =
    createSelector(
        [selectDailyGiftHistory],

        (history) => (
            Array.isArray(history?.results)
                ? history.results
                : EMPTY_HISTORY_RESULTS
        )
    );


export const selectDailyGiftHistoryCount =
    createSelector(
        [selectDailyGiftHistory],

        (history) => (
            Number.isSafeInteger(history?.count) &&
            history.count >= 0
                ? history.count
                : 0
        )
    );


export const selectDailyGiftHistoryHasNext =
    createSelector(
        [selectDailyGiftHistory],

        (history) => Boolean(
            history?.next
        )
    );


export const selectDailyGiftHistoryHasPrevious =
    createSelector(
        [selectDailyGiftHistory],

        (history) => Boolean(
            history?.previous
        )
    );


export const selectDailyGiftIsHistoryEmpty =
    createSelector(
        [
            selectDailyGiftIsHistoryLoaded,
            selectDailyGiftHistoryCount,
        ],

        (
            isLoaded,
            count
        ) => (
            isLoaded &&
            count === 0
        )
    );


// =========================================================
// HISTORY PAGINATION HELPER
//
// Page size is supplied by the history controller.
// =========================================================

export const selectDailyGiftHistoryTotalPages =
    createSelector(
        [
            selectDailyGiftHistoryCount,

            (
                _state,
                pageSize = DEFAULT_PAGE_SIZE
            ) => (
                Number.isSafeInteger(pageSize) &&
                pageSize > 0

                    ? pageSize

                    : DEFAULT_PAGE_SIZE
            ),
        ],

        (
            count,
            pageSize
        ) => Math.ceil(
            count / pageSize
        )
    );


// =========================================================
// COMBINED ERROR SELECTORS
// =========================================================

export const selectDailyGiftError =
    createSelector(
        [
            selectDailyGiftClaimError,
            selectDailyGiftStatusError,
            selectDailyGiftEventError,
        ],

        (
            claimError,
            statusError,
            eventError
        ) => (
            claimError ??
            statusError ??
            eventError ??
            null
        )
    );


// =========================================================
// AUTHENTICATION REQUIRED STATE
// =========================================================

export const selectDailyGiftRequiresAuthentication =
    createSelector(
        [
            selectDailyGiftHasValidSession,
            selectDailyGiftEligibilityReason,
            selectDailyGiftStatusError,
            selectDailyGiftClaimError,
        ],

        (
            hasValidSession,
            reason,
            statusError,
            claimError
        ) => (
            !hasValidSession ||

            reason ===
                DAILY_GIFT_ELIGIBILITY_REASON
                    .AUTHENTICATION_REQUIRED ||

            statusError?.status === 401 ||

            claimError?.status === 401
        )
    );


// =========================================================
// NAVBAR / SIDEBAR VIEW MODEL
//
// Shared presentation state.
//
// Navbar and HomeSidebar consume the same selectors
// without creating independent request states.
//
// =========================================================

export const selectDailyGiftEntryPointView =
    createSelector(
        [
            selectDailyGiftIsVisible,
            selectDailyGiftCurrentEventStatus,
            selectDailyGiftCanClaim,
            selectDailyGiftAvailableCount,
            selectDailyGiftIsClaimedToday,
            selectDailyGiftIsEventLoading,
            selectDailyGiftIsStatusLoading,
            selectDailyGiftIsClaimLoading,
            selectDailyGiftHasUncertainClaim,
            selectDailyGiftNextClaimAt,
            selectDailyGiftEventStartsAt,
        ],

        (
            isVisible,
            eventStatus,
            canClaim,
            availableCount,
            claimedToday,
            isEventLoading,
            isStatusLoading,
            isClaimLoading,
            hasUncertainClaim,
            nextClaimAt,
            eventStartsAt
        ) => ({
            isVisible,

            eventStatus,

            canClaim,

            availableCount,

            claimedToday,

            isLoading:
                isEventLoading ||
                isStatusLoading,

            isClaimLoading,

            hasUncertainClaim,

            nextClaimAt,

            eventStartsAt,
        })
    );


// =========================================================
// MODAL VIEW MODEL
// =========================================================

export const selectDailyGiftModalView =
    createSelector(
        [
            selectDailyGiftIsModalOpen,
            selectDailyGiftCurrentEventStatus,
            selectDailyGiftStatus,
            selectDailyGiftCanClaim,
            selectDailyGiftCanRecoverClaim,
            selectDailyGiftIsClaimedToday,
            selectDailyGiftIsStatusLoading,
            selectDailyGiftIsClaimLoading,
            selectDailyGiftClaimResult,
            selectDailyGiftReward,
            selectDailyGiftClaimError,
            selectDailyGiftStatusError,
            selectDailyGiftHasUncertainClaim,
        ],

        (
            isOpen,
            eventStatus,
            status,
            canClaim,
            canRecover,
            claimedToday,
            isStatusLoading,
            isClaimLoading,
            claimResult,
            reward,
            claimError,
            statusError,
            hasUncertainClaim
        ) => ({
            isOpen,

            eventStatus,

            status,

            canClaim,

            canRecover,

            claimedToday,

            isStatusLoading,

            isClaimLoading,

            claimResult,

            reward,

            hasUncertainClaim,

            error:
                claimError ??
                statusError ??
                null,
        })
    );


// =========================================================
// HISTORY VIEW MODEL
// =========================================================

export const selectDailyGiftHistoryView =
    createSelector(
        [
            selectDailyGiftHistoryResults,
            selectDailyGiftHistoryCount,
            selectDailyGiftHistoryHasNext,
            selectDailyGiftHistoryHasPrevious,
            selectDailyGiftIsHistoryLoading,
            selectDailyGiftIsHistoryLoaded,
            selectDailyGiftIsHistoryEmpty,
            selectDailyGiftHistoryError,
        ],

        (
            results,
            count,
            hasNext,
            hasPrevious,
            isLoading,
            isLoaded,
            isEmpty,
            error
        ) => ({
            results,

            count,

            hasNext,

            hasPrevious,

            isLoading,

            isLoaded,

            isEmpty,

            error,
        })
    );
