
// src/components/events/SeasonalGiftCard.jsx

import React, {
    memo,
    useCallback,
    useRef,
    useState,
} from "react";

import { Link } from "react-router-dom";

import {
    AlertCircle,
    CheckCircle2,
    Clock3,
    Gift,
    Loader2,
    LockKeyhole,
    RefreshCw,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

import useSeasonalGift from "../../hooks/events/useSeasonalGift";

import EventCountdown from "./EventCountdown";

import SeasonalGiftRevealModal from "./SeasonalGiftRevealModal";

// =========================================================
// FSOCIETY — UNIVERSAL EVENT GIFT CARD
// =========================================================
//
// Supported:
//
// - New Year
// - Navro'z
// - Ramadan
// - Other holiday events
//
// One reward per user per event.
//
// Countdown reaching zero does not claim
// the gift. Only a user click can claim.
//
// All eligibility and reward information
// comes from the backend.
//
// =========================================================


// =========================================================
// HELPERS
// =========================================================

const isRecord = (value) =>
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value);

const firstNonEmpty = (...values) =>
    values.find(
        (value) =>
            typeof value === "string" &&
            value.trim().length > 0
    ) ?? null;

const getStatusData = (status) => {
    if (!isRecord(status)) {
        return {};
    }

    return isRecord(status.data)
        ? status.data
        : status;
};

const getOpeningTime = (
    event,
    openingAt,
    status
) => {
    const data = getStatusData(status);

    return firstNonEmpty(
        openingAt,
        data.gift_opens_at,
        data.opens_at,
        data.open_at,
        event?.gift_opens_at,
        event?.starts_at,
        event?.start_at
    );
};

const isValidDateTime = (value) =>
    typeof value === "string" &&
    Number.isFinite(Date.parse(value));

const getErrorMessage = (error) => {
    if (
        typeof error?.message === "string" &&
        error.message.trim()
    ) {
        return error.message;
    }

    return "So‘rovni bajarib bo‘lmadi. Qayta urinib ko‘ring.";
};


// =========================================================
// COMPONENT
// =========================================================

function SeasonalGiftCard({
    event,
    eventSlug,
    openingAt,
    className = "",
    onClaimSuccess,
    onClaimError,
}) {
    // =====================================================
    // EVENT DATA
    // =====================================================

    const slug =
        eventSlug ??
        event?.slug ??
        "";

    const eventName =
        firstNonEmpty(
            event?.title,
            event?.name
        ) ?? "Bayram sovg‘asi";

    const eventDescription =
        firstNonEmpty(
            event?.short_description,
            event?.description
        );

    // =====================================================
    // SEASONAL GIFT HOOK
    // =====================================================

    const {
        isLoggedIn,
        sessionReady,

        status,
        statusLoading,
        statusError,
        statusFetchedAt,

        canOpenGift,
        alreadyClaimed,

        isOpening,
        claimError,
        needsReconciliation,

        refreshStatus,
        claimGift,
        dismissClaimError,
    } = useSeasonalGift(
        slug,
        {
            enabled: Boolean(slug),
            autoFetch: true,
        }
    );

    // =====================================================
    // LOCAL PRESENTATION STATE
    // =====================================================

    const [revealedClaim, setRevealedClaim] =
        useState(null);

    const [isRevealOpen, setIsRevealOpen] =
        useState(false);

    const [localError, setLocalError] =
        useState("");

    const claimGuardRef = useRef(false);

    const countdownCheckedRef = useRef("");

    // =====================================================
    // COUNTDOWN
    // =====================================================

    const countdownTarget = getOpeningTime(
        event,
        openingAt,
        status
    );

    const hasCountdown =
        isValidDateTime(countdownTarget);

    const statusData =
        getStatusData(status);

    const serverTime = firstNonEmpty(
        statusData.server_time,
        statusData.server_now
    );

    // =====================================================
    // REFRESH AFTER COUNTDOWN
    // =====================================================
    //
    // The countdown is only a visual timer.
    //
    // When it ends, refresh eligibility.
    // Do not automatically claim any gift.
    //
    // Use a per-event/per-date key to prevent
    // repeated refresh calls.
    //
    // =====================================================

    const handleCountdownExpire =
        useCallback(() => {
            if (
                !sessionReady ||
                alreadyClaimed ||
                isOpening ||
                statusLoading ||
                !hasCountdown
            ) {
                return;
            }

            const refreshKey =
                `${slug}:${countdownTarget}`;

            if (
                countdownCheckedRef.current ===
                refreshKey
            ) {
                return;
            }

            countdownCheckedRef.current =
                refreshKey;

            void refreshStatus();
        }, [
            sessionReady,
            alreadyClaimed,
            isOpening,
            statusLoading,
            hasCountdown,
            slug,
            countdownTarget,
            refreshStatus,
        ]);

    // =====================================================
    // MANUAL STATUS REFRESH
    // =====================================================

    const handleRefresh = useCallback(() => {
        if (
            !sessionReady ||
            statusLoading ||
            isOpening
        ) {
            return;
        }

        setLocalError("");

        dismissClaimError();

        void refreshStatus();
    }, [
        sessionReady,
        statusLoading,
        isOpening,
        dismissClaimError,
        refreshStatus,
    ]);

    // =====================================================
    // CLAIM EVENT GIFT
    // =====================================================
    //
    // Only this explicit click sends the
    // claim POST.
    //
    // The backend selects the reward.
    //
    // =====================================================

    const handleOpenGift = useCallback(
        async () => {
            if (
                claimGuardRef.current ||
                !canOpenGift ||
                isOpening
            ) {
                return;
            }

            claimGuardRef.current = true;

            setLocalError("");

            dismissClaimError();

            try {
                const result =
                    await claimGift();

                if (result?.ok) {
                    setRevealedClaim(
                        result.claim
                    );

                    setIsRevealOpen(true);

                    if (
                        typeof onClaimSuccess ===
                        "function"
                    ) {
                        onClaimSuccess(
                            result.claim,
                            result
                        );
                    }

                    return;
                }

                if (
                    result?.skipped
                ) {
                    // A rejected condition does not
                    // mean another POST should run.
                    return;
                }

                const message =
                    getErrorMessage(
                        result?.error
                    );

                setLocalError(message);

                if (
                    typeof onClaimError ===
                    "function"
                ) {
                    onClaimError(
                        result?.error ??
                        null
                    );
                }
            } catch (error) {
                const message =
                    getErrorMessage(error);

                setLocalError(message);

                if (
                    typeof onClaimError ===
                    "function"
                ) {
                    onClaimError(error);
                }
            } finally {
                claimGuardRef.current = false;
            }
        },
        [
            canOpenGift,
            isOpening,
            claimGift,
            dismissClaimError,
            onClaimSuccess,
            onClaimError,
        ]
    );

    const handleCloseReveal = useCallback(
        () => setIsRevealOpen(false),
        []
    );

    // =====================================================
    // GIFT STATE LABEL
    // =====================================================

    let stateLabel = "Sovg‘a holati tekshirilmoqda";

    if (!isLoggedIn) {
        stateLabel = "Sovg‘a olish uchun tizimga kiring";
    } else if (alreadyClaimed) {
        stateLabel = "Bu bayram sovg‘asi olingan";
    } else if (needsReconciliation) {
        stateLabel = "Sovg‘a natijasi tekshirilmoqda";
    } else if (canOpenGift) {
        stateLabel = "Sovg‘angiz ochishga tayyor";
    } else if (statusLoading) {
        stateLabel = "Sovg‘a holati yuklanmoqda";
    } else {
        stateLabel = "Sovg‘a hali ochilmagan";
    }

    const visibleError =
        localError ||
        (
            !needsReconciliation
                ? (
                    claimError?.message ??
                    statusError?.message ??
                    ""
                )
                : ""
        );

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <>
            <section
                aria-label={`${eventName} sovg‘asi`}
                className={`
                    relative isolate
                    overflow-hidden
                    rounded-3xl
                    border
                    border-violet-200/80
                    bg-white/90
                    p-4
                    shadow-[0_18px_55px_-28px_rgba(91,33,182,0.35)]
                    backdrop-blur-xl
                    sm:p-6

                    dark:border-violet-400/15
                    dark:bg-[#0c1120]/90
                    dark:shadow-[0_18px_65px_-30px_rgba(0,0,0,0.85)]

                    ${className}
                `}
            >
                {/* =====================================
                    DECORATIVE LIGHTS
                ===================================== */}

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute -right-16 -top-20
                        h-56 w-56
                        rounded-full
                        bg-violet-400/15
                        blur-3xl
                        dark:bg-violet-500/15
                    "
                />

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute -bottom-20 -left-16
                        h-48 w-48
                        rounded-full
                        bg-cyan-400/15
                        blur-3xl
                        dark:bg-cyan-500/10
                    "
                />

                <div className="relative z-10">
                    {/* =================================
                        HEADER
                    ================================= */}

                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex min-w-0 flex-1 items-start gap-3">
                            <div
                                className="
                                    flex h-12 w-12
                                    shrink-0
                                    items-center justify-center
                                    rounded-2xl
                                    bg-gradient-to-br
                                    from-violet-500
                                    to-fuchsia-600
                                    text-white
                                    shadow-lg
                                    shadow-violet-500/20
                                "
                            >
                                <Gift
                                    size={24}
                                    strokeWidth={1.9}
                                    aria-hidden="true"
                                />
                            </div>

                            <div className="min-w-0 flex-1">
                                <div
                                    className="
                                        mb-1
                                        inline-flex
                                        items-center gap-1.5
                                        text-[11px]
                                        font-bold
                                        uppercase
                                        tracking-[0.16em]
                                        text-violet-600
                                        dark:text-violet-300
                                    "
                                >
                                    <Sparkles size={13} />
                                    FSOCIETY EVENT GIFT
                                </div>

                                <h2
                                    className="
                                        break-words
                                        text-lg font-black
                                        leading-tight
                                        text-slate-900
                                        sm:text-xl
                                        dark:text-white
                                    "
                                >
                                    {eventName}
                                </h2>

                                {eventDescription && (
                                    <p
                                        className="
                                            mt-2
                                            line-clamp-3
                                            text-sm leading-6
                                            text-slate-600
                                            dark:text-slate-400
                                        "
                                    >
                                        {eventDescription}
                                    </p>
                                )}
                            </div>
                        </div>

                        {alreadyClaimed && (
                            <span
                                className="
                                    inline-flex
                                    items-center gap-1.5
                                    rounded-full
                                    border
                                    border-emerald-500/20
                                    bg-emerald-500/10
                                    px-3 py-1.5
                                    text-xs font-bold
                                    text-emerald-700
                                    dark:text-emerald-300
                                "
                            >
                                <CheckCircle2
                                    size={14}
                                    aria-hidden="true"
                                />
                                Olingan
                            </span>
                        )}
                    </div>

                    {/* =================================
                        COUNTDOWN / STATUS PANEL
                    ================================= */}

                    <div
                        className="
                            mt-5
                            rounded-2xl
                            border
                            border-slate-200/80
                            bg-slate-50/70
                            p-4
                            dark:border-white/10
                            dark:bg-white/[0.035]
                        "
                    >
                        <div
                            className="
                                flex flex-wrap
                                items-center justify-between
                                gap-2
                            "
                        >
                            <span
                                className="
                                    inline-flex
                                    items-center gap-2
                                    text-xs font-semibold
                                    text-slate-600
                                    dark:text-slate-300
                                "
                            >
                                <Clock3
                                    size={15}
                                    className="text-violet-500"
                                />
                                Bayram sovg‘asi
                            </span>

                            <span
                                className="
                                    text-xs
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                Har event uchun bir marta
                            </span>
                        </div>

                        {alreadyClaimed ? (
                            <div
                                className="
                                    mt-4 flex items-center
                                    gap-3 rounded-xl
                                    border border-emerald-500/20
                                    bg-emerald-500/10
                                    p-3 text-sm
                                    text-emerald-800
                                    dark:text-emerald-200
                                "
                            >
                                <CheckCircle2
                                    size={20}
                                    className="shrink-0"
                                />
                                Ushbu bayram sovg‘asini
                                allaqachon olgansiz.
                            </div>
                        ) : hasCountdown ? (
                            <div className="mt-4">
                                <EventCountdown
                                    targetTime={countdownTarget}
                                    serverTime={serverTime}
                                    receivedAtMs={statusFetchedAt}
                                    onExpire={handleCountdownExpire}
                                />
                            </div>
                        ) : (
                            <p
                                className="
                                    mt-4 text-sm leading-6
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                Sovg‘aning ochilish sanasi
                                hali ko‘rsatilmagan.
                            </p>
                        )}
                    </div>

                    {/* =================================
                        SERVER GIFT STATE
                    ================================= */}

                    <div
                        aria-live="polite"
                        className="
                            mt-4
                            flex items-center gap-2
                            text-sm
                            text-slate-600
                            dark:text-slate-300
                        "
                    >
                        {alreadyClaimed ? (
                            <CheckCircle2
                                size={17}
                                className="shrink-0 text-emerald-500"
                            />
                        ) : canOpenGift ? (
                            <Sparkles
                                size={17}
                                className="shrink-0 text-violet-500"
                            />
                        ) : (
                            <LockKeyhole
                                size={17}
                                className="shrink-0 text-slate-400"
                            />
                        )}

                        <span>{stateLabel}</span>
                    </div>

                    {/* =================================
                        ERRORS
                    ================================= */}

                    {visibleError && (
                        <div
                            role="alert"
                            className="
                                mt-4
                                flex items-start gap-2
                                rounded-xl
                                border border-rose-500/20
                                bg-rose-500/10
                                p-3
                                text-sm
                                text-rose-700
                                dark:text-rose-300
                            "
                        >
                            <AlertCircle
                                size={17}
                                className="mt-0.5 shrink-0"
                            />

                            <span>{visibleError}</span>
                        </div>
                    )}

                    {/* =================================
                        ACTIONS
                    ================================= */}

                    <div className="mt-5">
                        {!isLoggedIn ? (
                            <Link
                                to="/login"
                                className="
                                    inline-flex
                                    min-h-11 w-full
                                    items-center justify-center
                                    gap-2 rounded-xl
                                    bg-violet-600
                                    px-4 py-3
                                    text-sm font-bold
                                    text-white
                                    transition-colors
                                    hover:bg-violet-500
                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-violet-400
                                    focus-visible:ring-offset-2
                                    dark:focus-visible:ring-offset-[#0c1120]
                                "
                            >
                                <LockKeyhole size={17} />
                                Sovg‘a uchun tizimga kirish
                            </Link>
                        ) : alreadyClaimed ? (
                            <div
                                className="
                                    flex min-h-11
                                    items-center justify-center
                                    gap-2 rounded-xl
                                    border border-emerald-500/20
                                    bg-emerald-500/10
                                    px-4 py-3
                                    text-sm font-bold
                                    text-emerald-700
                                    dark:text-emerald-300
                                "
                            >
                                <CheckCircle2 size={18} />
                                Sovg‘a olingan
                            </div>
                        ) : needsReconciliation ? (
                            <button
                                type="button"
                                onClick={handleRefresh}
                                disabled={
                                    statusLoading ||
                                    !sessionReady
                                }
                                className="
                                    inline-flex
                                    min-h-11 w-full
                                    items-center justify-center
                                    gap-2 rounded-xl
                                    border border-amber-500/25
                                    bg-amber-500/10
                                    px-4 py-3
                                    text-sm font-bold
                                    text-amber-700
                                    transition-colors
                                    hover:bg-amber-500/15
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                    dark:text-amber-300
                                "
                            >
                                {statusLoading ? (
                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <RefreshCw size={18} />
                                )}

                                Sovg‘a natijasini tekshirish
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleOpenGift}
                                disabled={
                                    !canOpenGift ||
                                    isOpening
                                }
                                className="
                                    group/gift
                                    inline-flex
                                    min-h-12 w-full
                                    items-center justify-center
                                    gap-2 rounded-xl
                                    bg-gradient-to-r
                                    from-violet-600
                                    via-purple-600
                                    to-fuchsia-600
                                    px-5 py-3
                                    text-sm font-black
                                    text-white
                                    shadow-lg
                                    shadow-violet-500/20
                                    transition-[filter,transform,opacity]
                                    duration-200
                                    hover:brightness-110
                                    active:scale-[0.99]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                    disabled:shadow-none
                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-violet-400
                                    focus-visible:ring-offset-2
                                    dark:focus-visible:ring-offset-[#0c1120]
                                    motion-reduce:transform-none
                                    motion-reduce:transition-none
                                "
                            >
                                {isOpening ? (
                                    <>
                                        <Loader2
                                            size={19}
                                            className="animate-spin"
                                        />
                                        Sovg‘a ochilmoqda...
                                    </>
                                ) : (
                                    <>
                                        <Gift
                                            size={19}
                                            className="
                                                transition-transform
                                                duration-200
                                                group-hover/gift:rotate-12
                                                motion-reduce:transform-none
                                            "
                                        />

                                        Sovg‘ani ochish
                                    </>
                                )}
                            </button>
                        )}

                        {isLoggedIn &&
                            !alreadyClaimed &&
                            !needsReconciliation &&
                            !canOpenGift && (
                                <button
                                    type="button"
                                    onClick={handleRefresh}
                                    disabled={
                                        statusLoading ||
                                        isOpening ||
                                        !sessionReady
                                    }
                                    className="
                                        mt-3
                                        inline-flex w-full
                                        items-center justify-center
                                        gap-2 rounded-xl
                                        px-3 py-2
                                        text-xs font-semibold
                                        text-slate-500
                                        transition-colors
                                        hover:bg-slate-100
                                        hover:text-slate-800
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                        dark:text-slate-400
                                        dark:hover:bg-white/5
                                        dark:hover:text-white
                                    "
                                >
                                    <RefreshCw
                                        size={14}
                                        className={
                                            statusLoading
                                                ? "animate-spin"
                                                : ""
                                        }
                                    />

                                    Holatni yangilash
                                </button>
                            )}
                    </div>

                    {/* =================================
                        SECURITY NOTE
                    ================================= */}

                    <p
                        className="
                            mt-4 flex items-start
                            justify-center gap-1.5
                            text-center text-[11px]
                            leading-5
                            text-slate-400
                            dark:text-slate-500
                        "
                    >
                        <ShieldCheck
                            size={14}
                            className="mt-0.5 shrink-0"
                        />

                        Mukofot tasodifiy tanlanadi
                        va server tomonidan tasdiqlanadi.
                    </p>
                </div>
            </section>

            {/* =========================================
                REVEAL MODAL
            ========================================= */}

            <SeasonalGiftRevealModal
                open={isRevealOpen}
                eventName={eventName}
                claim={revealedClaim}
                onClose={handleCloseReveal}
            />
        </>
    );
}


// =========================================================
// EXPORT
// =========================================================

export default memo(SeasonalGiftCard);
