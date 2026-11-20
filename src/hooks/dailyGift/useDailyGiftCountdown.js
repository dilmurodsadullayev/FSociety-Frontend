
// src/hooks/dailyGift/useDailyGiftCountdown.js

import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
    useStore,
} from "react-redux";

import {
    DAILY_GIFT_EVENT_STATUS,
} from "../../config/dailyGiftConfig";

import {
    fetchDailyGiftStatus,
} from "../../features/dailyGift/dailyGiftThunks";

import {
    selectDailyGiftOwnerId,
    selectDailyGiftHasValidSession,
    selectDailyGiftStatus,
    selectDailyGiftCountdownSource,
    selectDailyGiftIsClaimLoading,
    selectDailyGiftIsStatusLoading,
} from "../../features/dailyGift/dailyGiftSelectors";


// =========================================================
// FSOCIETY — DAILY GIFT COUNTDOWN
// =========================================================
//
// Features:
//
// - Server-based clock
// - Monotonic elapsed time
// - Event start countdown
// - Daily gift reset countdown
// - Event end countdown
// - Automatic eligibility refresh
// - Session isolation
// - Duplicate refresh protection
// - Interval cleanup
//
// Mount only once inside DailyGiftController.
//
// =========================================================


// =========================================================
// CONSTANTS
// =========================================================

const TICK_INTERVAL_MS = 1000;

const {
    ACTIVE,
    SCHEDULED,
} = DAILY_GIFT_EVENT_STATUS;


export const DAILY_GIFT_COUNTDOWN_MODE = Object.freeze({
    NONE: "none",

    EVENT_START: "event_start",

    DAILY_RESET: "daily_reset",

    NEXT_GIFT: "next_gift",

    EVENT_END: "event_end",
});


// =========================================================
// EMPTY COUNTDOWN
// =========================================================

const EMPTY_COUNTDOWN = Object.freeze({
    totalSeconds: 0,

    days: 0,

    hours: 0,

    minutes: 0,

    seconds: 0,
});


// =========================================================
// DATETIME PARSER
// =========================================================

const parseDateTime = (value) => {

    if (
        typeof value !== "string"
        ||
        !value.trim()
    ) {
        return null;
    }

    const timestamp = Date.parse(value);

    return Number.isFinite(timestamp)
        ? timestamp
        : null;
};


// =========================================================
// MONOTONIC CLOCK
//
// Unlike Date.now(), performance.now() is not
// directly affected by changes to the system clock.
// =========================================================

const getMonotonicTime = () => {

    if (
        typeof performance !== "undefined"
        &&
        typeof performance.now === "function"
    ) {
        return performance.now();
    }

    return Date.now();
};


// =========================================================
// TIME CONVERSION
// =========================================================

export const splitCountdownSeconds = (value) => {

    const totalSeconds = Number.isFinite(value)

        ? Math.max(0, Math.ceil(value))

        : 0;

    return {
        totalSeconds,

        days: Math.floor(
            totalSeconds / 86400
        ),

        hours: Math.floor(
            (totalSeconds % 86400) / 3600
        ),

        minutes: Math.floor(
            (totalSeconds % 3600) / 60
        ),

        seconds: totalSeconds % 60,
    };
};


// =========================================================
// COUNTDOWN FORMATTING
// =========================================================

const padTime = (value) =>
    String(value).padStart(2, "0");


export const formatDailyGiftCountdown = (
    countdown
) => {

    const {
        days,
        hours,
        minutes,
        seconds,
    } = countdown;

    const clock = [
        padTime(hours),
        padTime(minutes),
        padTime(seconds),
    ].join(":");

    return days > 0

        ? `${days} kun ${clock}`

        : clock;
};


// =========================================================
// RESOLVE COUNTDOWN TARGET
//
// Scheduled:
//     Event start.
//
// Active:
//     Earliest relevant daily reset,
//     next gift time or event end.
//
// Disabled / finished:
//     No countdown.
//
// =========================================================

const resolveCountdownTarget = (
    source,
    status
) => {

    if (source.eventStatus === SCHEDULED) {

        return {
            mode:
                DAILY_GIFT_COUNTDOWN_MODE.EVENT_START,

            targetAt: source.eventStartsAt,
        };
    }

    if (source.eventStatus !== ACTIVE) {

        return {
            mode:
                DAILY_GIFT_COUNTDOWN_MODE.NONE,

            targetAt: null,
        };
    }


    // =====================================================
    // ACTIVE EVENT TARGETS
    // =====================================================

    const candidates = [

        {
            mode:
                DAILY_GIFT_COUNTDOWN_MODE.EVENT_END,

            targetAt: source.eventEndsAt,
        },

        {
            mode: status?.claimed_today

                ? DAILY_GIFT_COUNTDOWN_MODE.NEXT_GIFT

                : DAILY_GIFT_COUNTDOWN_MODE.DAILY_RESET,

            targetAt: source.dailyResetAt,
        },

        {
            mode:
                DAILY_GIFT_COUNTDOWN_MODE.NEXT_GIFT,

            targetAt: source.nextClaimAt,
        },

    ].map((candidate) => ({
        ...candidate,

        timestamp:
            parseDateTime(candidate.targetAt),

    })).filter(
        (candidate) => candidate.timestamp !== null
    );


    if (!candidates.length) {

        return {
            mode:
                DAILY_GIFT_COUNTDOWN_MODE.NONE,

            targetAt: null,
        };
    }


    // Choose the earliest boundary.
    // Do not show a next-gift timer beyond event end.

    candidates.sort(
        (first, second) =>
            first.timestamp - second.timestamp
    );

    return candidates[0];
};


// =========================================================
// COUNTDOWN LABELS
// =========================================================

const COUNTDOWN_LABELS = Object.freeze({

    [DAILY_GIFT_COUNTDOWN_MODE.NONE]:
        "",

    [DAILY_GIFT_COUNTDOWN_MODE.EVENT_START]:
        "Tadbir boshlanishigacha",

    [DAILY_GIFT_COUNTDOWN_MODE.DAILY_RESET]:
        "Navbatdagi kunlik resetgacha",

    [DAILY_GIFT_COUNTDOWN_MODE.NEXT_GIFT]:
        "Keyingi sovg‘agacha",

    [DAILY_GIFT_COUNTDOWN_MODE.EVENT_END]:
        "Tadbir tugashigacha",
});


// =========================================================
// MAIN COUNTDOWN HOOK
// =========================================================

export const useDailyGiftCountdown = (
    {
        enabled = true,
        refreshOnExpire = true,
    } = {}
) => {

    const dispatch = useDispatch();

    const store = useStore();


    const ownerId = useSelector(
        selectDailyGiftOwnerId
    );

    const hasValidSession = useSelector(
        selectDailyGiftHasValidSession
    );

    const status = useSelector(
        selectDailyGiftStatus
    );

    const source = useSelector(
        selectDailyGiftCountdownSource
    );


    // =====================================================
    // CLOCK ANCHOR
    //
    // A new backend status establishes a new
    // server-time reference.
    // =====================================================

    const clockAnchorRef = useRef(null);

    const refreshedBoundaryRef = useRef(null);

    const [snapshot, setSnapshot] =
        useState(null);


    // =====================================================
    // COUNTDOWN TARGET
    // =====================================================

    const {
        mode,
        targetAt,
    } = resolveCountdownTarget(
        source,
        status
    );

    const targetTimestamp =
        parseDateTime(targetAt);

    const serverTimestamp =
        parseDateTime(source.serverTime);


    // Do not derive a server-based countdown
    // without an actual server timestamp.

    const canRun = (
        enabled
        &&
        hasValidSession
        &&
        ownerId !== null
        &&
        serverTimestamp !== null
        &&
        targetTimestamp !== null
        &&
        mode !== DAILY_GIFT_COUNTDOWN_MODE.NONE
    );


    const boundaryKey = canRun

        ? `${ownerId}:${targetTimestamp}`

        : null;


    // =====================================================
    // COUNTDOWN EFFECT
    // =====================================================

    useEffect(() => {

        if (!canRun) {

            clockAnchorRef.current = null;

            setSnapshot(null);

            return;
        }


        // =================================================
        // SYNCHRONIZE SERVER CLOCK
        // =================================================

        const previousAnchor =
            clockAnchorRef.current;

        if (
            !previousAnchor
            ||
            previousAnchor.ownerId !== ownerId
            ||
            previousAnchor.status !== status
        ) {

            clockAnchorRef.current = {
                ownerId,

                status,

                serverTimestamp,

                monotonicTimestamp:
                    getMonotonicTime(),
            };
        }


        const anchor = clockAnchorRef.current;


        // =================================================
        // REFRESH ELIGIBILITY ON BOUNDARY
        // =================================================

        const refreshEligibility = () => {

            if (!refreshOnExpire) {
                return;
            }

            if (
                refreshedBoundaryRef.current
                === boundaryKey
            ) {
                return;
            }

            const currentState =
                store.getState();

            if (
                !selectDailyGiftHasValidSession(
                    currentState
                )
                ||
                selectDailyGiftOwnerId(
                    currentState
                ) !== ownerId
            ) {
                return;
            }


            // Wait for pending requests instead
            // of interfering with them.

            if (
                selectDailyGiftIsClaimLoading(
                    currentState
                )
                ||
                selectDailyGiftIsStatusLoading(
                    currentState
                )
            ) {
                return;
            }


            // Refresh only once per time boundary.

            refreshedBoundaryRef.current =
                boundaryKey;

            void dispatch(
                fetchDailyGiftStatus()
            );
        };


        // =================================================
        // COUNTDOWN TICK
        // =================================================

        const tick = () => {

            const elapsedMilliseconds =
                Math.max(
                    0,
                    getMonotonicTime()
                    - anchor.monotonicTimestamp
                );

            const estimatedServerTime =
                anchor.serverTimestamp
                + elapsedMilliseconds;

            const remainingSeconds =
                Math.max(
                    0,
                    Math.ceil(
                        (
                            targetTimestamp
                            - estimatedServerTime
                        ) / 1000
                    )
                );


            // Avoid unnecessary renders if the
            // displayed second has not changed.

            setSnapshot((previous) => {

                if (
                    previous?.boundaryKey === boundaryKey
                    &&
                    previous?.status === status
                    &&
                    previous?.totalSeconds
                        === remainingSeconds
                ) {
                    return previous;
                }

                return {
                    boundaryKey,

                    status,

                    totalSeconds:
                        remainingSeconds,
                };
            });


            if (remainingSeconds === 0) {

                refreshEligibility();
            }
        };


        // Run immediately.

        tick();


        const intervalId = window.setInterval(
            tick,
            TICK_INTERVAL_MS
        );


        // Update immediately when returning
        // to the browser tab.

        const handleVisibilityChange = () => {

            if (
                document.visibilityState === "visible"
            ) {
                tick();
            }
        };

        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );


        // =================================================
        // CLEANUP
        // =================================================

        return () => {

            window.clearInterval(intervalId);

            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };

    }, [
        canRun,

        boundaryKey,

        ownerId,

        status,

        serverTimestamp,

        targetTimestamp,

        refreshOnExpire,

        dispatch,

        store,
    ]);


    // =====================================================
    // PRESENTATION STATE
    // =====================================================

    const isReady = (
        canRun
        &&
        snapshot?.boundaryKey === boundaryKey
        &&
        snapshot?.status === status
    );


    const countdown = isReady

        ? splitCountdownSeconds(
            snapshot.totalSeconds
        )

        : EMPTY_COUNTDOWN;


    const isExpired = (
        isReady
        &&
        countdown.totalSeconds === 0
    );


    // =====================================================
    // PUBLIC HOOK API
    // =====================================================

    return {
        ...countdown,

        mode,

        targetAt,

        timezone: source.timezone,

        label:
            COUNTDOWN_LABELS[mode],

        isReady,

        isExpired,

        isRunning: (
            isReady
            &&
            !isExpired
        ),

        formatted: isReady

            ? formatDailyGiftCountdown(
                countdown
            )

            : "--:--:--",

        display: {
            days: padTime(countdown.days),

            hours: padTime(countdown.hours),

            minutes: padTime(countdown.minutes),

            seconds: padTime(countdown.seconds),
        },
    };
};


// =========================================================
// EXPORT
// =========================================================

export default useDailyGiftCountdown;
