
// src/components/daily-gift/DailyGiftModal.jsx

import React, {
    memo,
    useEffect,
    useId,
    useRef,
    useState,
} from "react";

import {
    createPortal,
} from "react-dom";

import {
    useReducedMotion,
} from "framer-motion";

import {
    AlertCircle,
    Award,
    CalendarClock,
    CheckCircle2,
    Clock3,
    Coins,
    Crown,
    Gift,
    Image as FrameIcon,
    Loader2,
    RefreshCw,
    ShieldCheck,
    Snowflake,
    Sparkles,
    Trophy,
    X,
} from "lucide-react";

import {
    DAILY_GIFT_EVENT_STATUS,
} from "../../config/dailyGiftConfig";

import GiftBox3D from "./GiftBox3D";


// =========================================================
// FSOCIETY — DAILY GIFT MODAL
// =========================================================
//
// Features:
//
// - Native HTML dialog
// - React Portal
// - CSS 3D gift box
// - Backend-driven gift opening
// - Reward reveal transition
// - Duplicate-claim protection via existing hooks
// - Explicit claim recovery
// - Dark / Light mode
// - Responsive UI
// - Reduced motion support
//
// All reward authorization remains on the backend.
//
// =========================================================


// =========================================================
// CONSTANTS
// =========================================================

const {
    ACTIVE,
    SCHEDULED,
    DISABLED,
    FINISHED,
} = DAILY_GIFT_EVENT_STATUS;


const REVEAL_DELAY_MS = 1100;


// =========================================================
// BUTTON STYLES
// =========================================================

const PRIMARY_BUTTON = `
    inline-flex w-full
    items-center justify-center gap-2

    rounded-xl

    bg-gradient-to-r
    from-cyan-600
    to-blue-600

    px-5 py-3.5

    text-sm font-semibold
    text-white

    shadow-lg
    shadow-cyan-500/20

    transition-all duration-200

    hover:brightness-110

    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-cyan-400

    disabled:cursor-not-allowed
    disabled:opacity-50
    disabled:shadow-none

    motion-safe:active:scale-[0.98]
    motion-reduce:transition-none
`;


const SECONDARY_BUTTON = `
    inline-flex w-full
    items-center justify-center gap-2

    rounded-xl border

    border-slate-200
    dark:border-white/10

    bg-slate-50
    dark:bg-white/[0.04]

    px-4 py-3

    text-sm font-medium

    text-slate-700
    dark:text-slate-300

    transition-colors

    hover:bg-slate-100
    dark:hover:bg-white/[0.08]

    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-cyan-400

    disabled:cursor-not-allowed
    disabled:opacity-50
`;


// =========================================================
// REWARD RARITY STYLES
// =========================================================

const RARITY_STYLES = Object.freeze({

    common: {
        label: "COMMON",

        text: "text-slate-600 dark:text-slate-300",

        surface: `
            border-slate-300
            bg-slate-100

            dark:border-slate-500/30
            dark:bg-slate-500/10
        `,
    },

    rare: {
        label: "RARE",

        text: "text-blue-600 dark:text-blue-400",

        surface: `
            border-blue-300
            bg-blue-50

            dark:border-blue-500/30
            dark:bg-blue-500/10
        `,
    },

    epic: {
        label: "EPIC",

        text: "text-violet-600 dark:text-violet-400",

        surface: `
            border-violet-300
            bg-violet-50

            dark:border-violet-500/30
            dark:bg-violet-500/10
        `,
    },

    legendary: {
        label: "LEGENDARY",

        text: "text-amber-600 dark:text-amber-400",

        surface: `
            border-amber-300
            bg-amber-50

            dark:border-amber-500/40
            dark:bg-amber-500/10
        `,
    },
});


// =========================================================
// DATE FORMATTER
// =========================================================

const formatDate = (
    value,
    timeZone = "Asia/Tashkent"
) => {

    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (!Number.isFinite(date.getTime())) {
        return "";
    }

    try {

        return new Intl.DateTimeFormat(
            "uz-UZ",
            {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                timeZone,
            }
        ).format(date);

    } catch {

        return "";
    }
};


// =========================================================
// ERROR MESSAGE
// =========================================================

const getErrorMessage = (error) => {

    if (typeof error === "string") {
        return error;
    }

    if (
        typeof error?.message === "string"
        &&
        error.message.trim()
    ) {
        return error.message;
    }

    return "So‘rovni bajarishda xatolik yuz berdi.";
};


// =========================================================
// REWARD ICON
// =========================================================

const getRewardIcon = (reward) => {

    const awardedType =
        reward.awarded_reward_type
        ??
        reward.type;

    switch (awardedType) {

        case "coin":
            return Coins;

        case "badge":
            return Award;

        case "frame":
            return FrameIcon;

        case "achievement":
            return Trophy;

        default:
            return reward.rarity === "legendary"
                ? Crown
                : Gift;
    }
};


// =========================================================
// REWARD RESULT PANEL
// =========================================================

const RewardResult = memo(
    function RewardResult({
        reward,
        isHistorical,
        onContinue,
    }) {

        const [imageFailed, setImageFailed] =
            useState(false);

        const rarity =
            RARITY_STYLES[reward.rarity]
            ??
            RARITY_STYLES.common;

        const RewardIcon =
            getRewardIcon(reward);

        const awardedCoins = Number(
            reward.awarded_coins ?? 0
        );

        const hasCoins =
            Number.isFinite(awardedCoins)
            &&
            awardedCoins > 0;

        const rewardName =
            reward.item?.name
            ??
            reward.name
            ??
            "Maxsus mukofot";

        const imageUrl =
            typeof reward.item?.image_url === "string"
                ? reward.item.image_url
                : "";

        const showImage =
            Boolean(imageUrl)
            &&
            !imageFailed;


        return (

            <div
                className="space-y-5"
                aria-live="polite"
            >

                {/* =====================================
                    RESULT HEADER
                ===================================== */}

                <div className="text-center">

                    <div
                        className="
                            mx-auto mb-3

                            flex h-12 w-12

                            items-center justify-center

                            rounded-2xl

                            bg-emerald-500/10
                            text-emerald-600

                            dark:text-emerald-400
                        "
                    >

                        <Sparkles size={25}/>

                    </div>

                    <p
                        className="
                            text-xs font-semibold
                            uppercase tracking-[0.18em]

                            text-emerald-600
                            dark:text-emerald-400
                        "
                    >
                        {isHistorical
                            ? "Olingan mukofot"
                            : "Sovg‘a muvaffaqiyatli ochildi"}
                    </p>

                    <h3
                        className="
                            mt-2

                            text-2xl font-bold

                            text-slate-900
                            dark:text-white

                            sm:text-3xl
                        "
                    >
                        Tabriklaymiz!
                    </h3>

                </div>


                {/* =====================================
                    REWARD CARD
                ===================================== */}

                <div
                    className={`
                        relative isolate

                        overflow-hidden

                        rounded-2xl border

                        p-5 text-center

                        sm:p-6

                        ${rarity.surface}
                    `}
                >

                    {/* Background glow */}

                    <div
                        aria-hidden="true"
                        className="
                            pointer-events-none

                            absolute -top-20
                            left-1/2 -z-10

                            h-48 w-48

                            -translate-x-1/2

                            rounded-full

                            bg-white/40
                            dark:bg-white/5

                            blur-3xl
                        "
                    />


                    {/* Reward artwork */}

                    <div
                        className="
                            mx-auto mb-5

                            flex h-28 w-28

                            items-center justify-center

                            rounded-3xl border

                            border-white/50

                            bg-white/50
                            dark:border-white/10
                            dark:bg-slate-950/30

                            sm:h-32 sm:w-32
                        "
                    >

                        {showImage ? (

                            <img
                                src={imageUrl}
                                alt={rewardName}

                                onError={() =>
                                    setImageFailed(true)
                                }

                                className="
                                    h-full w-full
                                    object-contain

                                    p-3
                                "
                            />

                        ) : (

                            <RewardIcon
                                size={58}
                                strokeWidth={1.4}

                                className={rarity.text}
                            />

                        )}

                    </div>


                    {/* Rarity */}

                    <p
                        className={`
                            text-xs font-bold

                            tracking-[0.2em]

                            ${rarity.text}
                        `}
                    >
                        {rarity.label}
                    </p>


                    {/* Reward name / FCoin */}

                    <h4
                        className={`
                            mt-3 break-words

                            text-xl font-bold

                            sm:text-2xl

                            ${rarity.text}
                        `}
                    >
                        {hasCoins

                            ? `+${awardedCoins.toLocaleString()} FCoin`

                            : rewardName}
                    </h4>


                    {hasCoins && (

                        <p
                            className="
                                mt-2 text-sm

                                text-slate-600
                                dark:text-slate-400
                            "
                        >
                            {rewardName}
                        </p>

                    )}


                    {/* Compensation */}

                    {reward.is_compensation && (

                        <p
                            className="
                                mt-4

                                rounded-xl border

                                border-amber-300/40

                                bg-amber-400/10

                                px-3 py-2

                                text-xs leading-relaxed

                                text-amber-700
                                dark:text-amber-300
                            "
                        >
                            Bu kolleksiya mukofoti sizda
                            avvaldan mavjud bo‘lgani uchun
                            FCoin kompensatsiyasi berildi.
                        </p>

                    )}

                </div>


                {/* =====================================
                    SERVER CONFIRMATION
                ===================================== */}

                <div
                    className="
                        flex items-center
                        justify-center gap-2

                        text-xs

                        text-emerald-600
                        dark:text-emerald-400
                    "
                >

                    <CheckCircle2 size={16}/>

                    Mukofot serverda qayd etilgan

                </div>


                {/* =====================================
                    CONTINUE BUTTON
                ===================================== */}

                <button
                    type="button"
                    onClick={onContinue}
                    className={PRIMARY_BUTTON}
                >

                    Davom etish

                </button>

            </div>
        );
    }
);


// =========================================================
// MAIN DAILY GIFT MODAL
// =========================================================

function DailyGiftModal({
    gift,
    modal,
}) {

    const dialogRef = useRef(null);

    const titleId = useId();

    const descriptionId = useId();

    const shouldReduceMotion =
        useReducedMotion();

    const [actionError, setActionError] =
        useState("");


    // =====================================================
    // CURRENT EVENT DATA
    // =====================================================

    const status = gift.status;

    const eventStatus =
        gift.eventStatus
        ??
        modal.eventStatus;

    const reward =
        modal.reward
        ??
        gift.reward;

    const hasReward = Boolean(
        modal.hasReward
        &&
        reward
    );


    // =====================================================
    // REWARD PRESENTATION STATE
    //
    // When a reward already exists when the
    // modal mounts, display it immediately.
    //
    // New successful claims trigger the 3D
    // opening animation first.
    // =====================================================

    const [rewardReady, setRewardReady] =
        useState(() => hasReward);


    // =====================================================
    // REQUEST STATES
    // =====================================================

    const isClaimLoading =
        Boolean(gift.isClaimLoading);

    const isStatusLoading =
        Boolean(modal.isStatusLoading);

    const isBusy =
        isClaimLoading
        ||
        isStatusLoading;


    // =====================================================
    // EVENT STATES
    // =====================================================

    const isActive =
        eventStatus === ACTIVE;

    const isScheduled =
        eventStatus === SCHEDULED;

    const isDisabled =
        eventStatus === DISABLED;

    const isFinished =
        eventStatus === FINISHED;

    const claimedToday =
        Boolean(modal.claimedToday);

    const hasUncertainClaim =
        Boolean(modal.hasUncertainClaim);

    const canRecover =
        Boolean(modal.canRecover);


    const canClaim = (
        isActive
        &&
        Boolean(gift.canClaim)
        &&
        !isBusy
        &&
        !hasUncertainClaim
        &&
        !hasReward
    );


    // =====================================================
    // NEW REWARD REVEAL DELAY
    //
    // Only a confirmed backend reward triggers
    // the opening presentation.
    //
    // Never show a success state based only
    // on a button click.
    // =====================================================

    useEffect(() => {

        if (!hasReward || rewardReady) {
            return undefined;
        }

        const timeoutId = window.setTimeout(

            () => {
                setRewardReady(true);
            },

            shouldReduceMotion
                ? 0
                : REVEAL_DELAY_MS
        );

        return () => {
            window.clearTimeout(timeoutId);
        };

    }, [
        hasReward,
        rewardReady,
        shouldReduceMotion,
    ]);


    // =====================================================
    // DISPLAY PHASE
    // =====================================================

    const isRevealing = (
        hasReward
        &&
        !rewardReady
    );

    const boxPhase = isRevealing

        ? "revealed"

        : isClaimLoading

            ? "opening"

            : "idle";


    // =====================================================
    // NATIVE MODAL LIFECYCLE
    // =====================================================

    useEffect(() => {

        const dialog = dialogRef.current;

        if (!dialog) {
            return undefined;
        }

        const previousFocus =
            document.activeElement;

        if (!dialog.open) {
            dialog.showModal();
        }

        return () => {

            if (dialog.open) {
                dialog.close();
            }

            if (
                previousFocus instanceof HTMLElement
                &&
                previousFocus.isConnected
            ) {
                previousFocus.focus({
                    preventScroll: true,
                });
            }
        };

    }, []);


    // =====================================================
    // SCROLL LOCK
    // =====================================================

    useEffect(() => {

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow =
            "hidden";

        return () => {

            document.body.style.overflow =
                previousOverflow;
        };

    }, []);


    // =====================================================
    // MODAL CLOSE
    // =====================================================

    const handleClose = () => {

        modal.closeModal();
    };


    const handleCancel = (event) => {

        event.preventDefault();

        handleClose();
    };


    const handleBackdropClick = (event) => {

        if (
            event.target !==
            event.currentTarget
        ) {
            return;
        }

        const bounds =
            event.currentTarget.getBoundingClientRect();

        const outside = (
            event.clientX < bounds.left
            ||
            event.clientX > bounds.right
            ||
            event.clientY < bounds.top
            ||
            event.clientY > bounds.bottom
        );

        if (outside) {
            handleClose();
        }
    };


    // =====================================================
    // ASYNC ACTION WRAPPER
    // =====================================================

    const runAction = async (action) => {

        setActionError("");

        try {

            await action();

        } catch (error) {

            setActionError(
                getErrorMessage(error)
            );
        }
    };


    // =====================================================
    // CLAIM GIFT
    // =====================================================

    const handleClaim = () => {

        if (!canClaim) {
            return;
        }

        modal.clearError();

        void runAction(
            gift.claimGift
        );
    };


    // =====================================================
    // CLAIM RECOVERY
    // =====================================================

    const handleRecover = () => {

        if (
            !canRecover
            ||
            isBusy
        ) {
            return;
        }

        void runAction(
            gift.recoverClaim
        );
    };


    // =====================================================
    // STATUS REFRESH
    // =====================================================

    const handleRefresh = () => {

        if (isBusy) {
            return;
        }

        modal.clearError();

        void runAction(
            gift.refresh
        );
    };


    // =====================================================
    // REWARD CONTINUE
    // =====================================================

    const handleContinue = () => {

        modal.dismissReward();

        setRewardReady(false);

        setActionError("");
    };


    // =====================================================
    // DATE PRESENTATION
    // =====================================================

    const timeZone =
        status?.timezone
        ??
        gift.event?.timezone
        ??
        "Asia/Tashkent";

    const eventName =
        gift.event?.name
        ??
        "FSociety Daily Gift";

    const eventStartsAt =
        gift.eventStartsAt
        ??
        gift.event?.starts_at;

    const nextClaimAt =
        gift.nextClaimAt;

    const startDate = formatDate(
        eventStartsAt,
        timeZone
    );

    const nextClaimDate = formatDate(
        nextClaimAt,
        timeZone
    );


    // =====================================================
    // ERROR
    // =====================================================

    const error =
        gift.claimError
        ??
        gift.statusError
        ??
        gift.eventError;

    const errorMessage =
        actionError
        ||
        (
            error
                ? getErrorMessage(error)
                : ""
        );


    // =====================================================
    // STATUS PRESENTATION
    // =====================================================

    let statusTitle =
        "Sovg‘a holati tekshirilmoqda";

    let statusDescription =
        "Serverdan ma’lumot olinmoqda.";

    let StatusIcon = Clock3;

    let statusColor = `
        text-slate-500
        dark:text-slate-400
    `;


    if (isRevealing) {

        statusTitle =
            "Sirli sovg‘a ochilmoqda!";

        statusDescription =
            "Mukofotingiz tayyor, hozir ko‘rsatiladi.";

        StatusIcon = Sparkles;

        statusColor =
            "text-cyan-600 dark:text-cyan-300";

    } else if (isClaimLoading) {

        statusTitle =
            "Sovg‘angiz tayyorlanmoqda...";

        statusDescription =
            "Server mukofotingizni aniqlamoqda.";

        StatusIcon = Loader2;

        statusColor =
            "text-cyan-600 dark:text-cyan-300";

    } else if (hasUncertainClaim) {

        statusTitle =
            "Sovg‘a holatini tasdiqlash kerak";

        statusDescription =
            "Oldingi so‘rov natijasi noma’lum. "
            + "Davom etishdan oldin holatni tekshiring.";

        StatusIcon = AlertCircle;

        statusColor =
            "text-amber-600 dark:text-amber-400";

    } else if (isScheduled) {

        statusTitle =
            "Tadbir hali boshlanmagan";

        statusDescription = startDate

            ? `Boshlanishi: ${startDate}`

            : "Tadbir boshlanishini kuting.";

        StatusIcon = CalendarClock;

        statusColor =
            "text-violet-600 dark:text-violet-400";

    } else if (isDisabled) {

        statusTitle =
            "Tadbir o‘chirilgan";

        statusDescription =
            "Hozir sovg‘a olish mumkin emas.";

    } else if (isFinished) {

        statusTitle =
            "Tadbir yakunlangan";

        statusDescription =
            "Ishtirokingiz uchun rahmat!";

    } else if (claimedToday) {

        statusTitle =
            "Bugungi sovg‘angiz olindi";

        statusDescription = nextClaimDate

            ? `Keyingi sovg‘a: ${nextClaimDate}`

            : "Keyingi kun yana tashrif buyuring.";

        StatusIcon = CheckCircle2;

        statusColor =
            "text-emerald-600 dark:text-emerald-400";

    } else if (canClaim) {

        statusTitle =
            "Bugungi sovg‘angiz tayyor!";

        statusDescription =
            "Qutini oching va tasodifiy "
            + "mukofotni qo‘lga kiriting.";

        StatusIcon = CheckCircle2;

        statusColor =
            "text-emerald-600 dark:text-emerald-400";

    } else if (
        !isStatusLoading
        &&
        status?.message
    ) {

        statusTitle =
            "Hozircha sovg‘a mavjud emas";

        statusDescription =
            status.message;
    }


    // =====================================================
    // CLIENT ONLY
    // =====================================================

    if (typeof document === "undefined") {
        return null;
    }


    // =====================================================
    // MODAL PORTAL
    // =====================================================

    return createPortal(

        <dialog
            ref={dialogRef}

            aria-labelledby={titleId}

            aria-describedby={descriptionId}

            onCancel={handleCancel}

            onClick={handleBackdropClick}

            className="
                fixed inset-0
                m-auto

                w-[calc(100%_-_2rem)]
                max-w-lg

                max-h-[90vh]
                max-h-[90dvh]

                overflow-y-auto
                overscroll-contain

                rounded-2xl
                border border-slate-200

                bg-white
                text-slate-900

                p-0 shadow-2xl

                backdrop:bg-slate-950/75
                backdrop:backdrop-blur-md

                dark:border-cyan-500/20
                dark:bg-[#0B1220]
                dark:text-slate-100

                sm:rounded-3xl

                focus:outline-none
            "
        >

            <div
                className="
                    relative isolate

                    overflow-hidden

                    p-5 sm:p-7
                "
            >

                {/* =====================================
                    BACKGROUND DECORATION
                ===================================== */}

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none

                        absolute -top-36
                        left-1/2 -z-10

                        h-80 w-80

                        -translate-x-1/2

                        rounded-full

                        bg-cyan-400/10
                        dark:bg-cyan-500/15

                        blur-3xl
                    "
                />


                {/* =====================================
                    MODAL HEADER
                ===================================== */}

                <header
                    className="
                        flex items-center
                        justify-between gap-3
                    "
                >

                    <div
                        className="
                            flex min-w-0
                            items-center gap-2
                        "
                    >

                        <Snowflake
                            size={18}
                            className="
                                shrink-0

                                text-cyan-600
                                dark:text-cyan-300
                            "
                        />

                        <span
                            className="
                                truncate font-mono

                                text-[10px]
                                font-semibold

                                tracking-[0.12em]

                                text-cyan-700
                                dark:text-cyan-300

                                sm:text-xs
                            "
                        >
                            FSOCIETY // DAILY GIFT
                        </span>

                    </div>


                    {/* Close */}

                    <button
                        type="button"

                        onClick={handleClose}

                        aria-label="Modalni yopish"

                        className="
                            flex h-9 w-9
                            shrink-0

                            items-center justify-center

                            rounded-xl

                            text-slate-500
                            dark:text-slate-400

                            hover:bg-slate-100
                            dark:hover:bg-white/10

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-cyan-400
                        "
                    >

                        <X size={19}/>

                    </button>

                </header>


                {/* =====================================
                    MAIN TITLE
                ===================================== */}

                <div
                    className="
                        mt-5 text-center
                    "
                >

                    <h2
                        id={titleId}

                        className="
                            text-2xl font-bold
                            tracking-tight

                            text-slate-900
                            dark:text-white

                            sm:text-3xl
                        "
                    >
                        Daily Mystery Gift
                    </h2>

                    <p
                        id={descriptionId}

                        className="
                            mt-2 break-words

                            text-xs
                            text-slate-500
                            dark:text-slate-400

                            sm:text-sm
                        "
                    >
                        {eventName}
                    </p>

                </div>


                {/* =====================================
                    MAIN CONTENT
                ===================================== */}

                <main
                    aria-busy={isBusy || isRevealing}
                    className="mt-4"
                >

                    {hasReward && rewardReady ? (

                        <RewardResult
                            reward={reward}

                            isHistorical={
                                modal.isHistoricalReward
                            }

                            onContinue={
                                handleContinue
                            }
                        />

                    ) : (

                        <>

                            {/* =========================
                                3D GIFT BOX
                            ========================= */}

                            <GiftBox3D
                                phase={boxPhase}

                                rarity={
                                    reward?.rarity
                                    ??
                                    "common"
                                }

                                isScheduled={
                                    isScheduled
                                }
                            />


                            {/* =========================
                                STATUS
                            ========================= */}

                            <div
                                role="status"
                                aria-live="polite"

                                className="
                                    mb-5

                                    space-y-2
                                    text-center
                                "
                            >

                                <div
                                    className={`
                                        flex items-center
                                        justify-center gap-2

                                        text-sm font-semibold

                                        ${statusColor}
                                    `}
                                >

                                    <StatusIcon
                                        size={18}
                                        className={
                                            isClaimLoading

                                                ? "motion-safe:animate-spin"

                                                : "shrink-0"
                                        }
                                    />

                                    <span>
                                        {statusTitle}
                                    </span>

                                </div>

                                <p
                                    className="
                                        mx-auto max-w-sm

                                        text-xs
                                        leading-relaxed

                                        text-slate-500
                                        dark:text-slate-400

                                        sm:text-sm
                                    "
                                >
                                    {statusDescription}
                                </p>

                            </div>


                            {/* =========================
                                ERROR
                            ========================= */}

                            {!isRevealing && errorMessage && (

                                <div
                                    role="alert"

                                    className="
                                        mb-4

                                        flex items-start gap-2

                                        rounded-xl border

                                        border-red-200
                                        bg-red-50

                                        p-3

                                        text-xs
                                        text-red-600

                                        dark:border-red-500/20
                                        dark:bg-red-500/10
                                        dark:text-red-300
                                    "
                                >

                                    <AlertCircle
                                        size={17}
                                        className="shrink-0"
                                    />

                                    <span className="break-words">
                                        {errorMessage}
                                    </span>

                                </div>

                            )}


                            {/* =========================
                                ACTION BUTTONS
                            ========================= */}

                            {!isRevealing && (

                                <div className="space-y-3">

                                    {hasUncertainClaim ? (

                                        <>

                                            {canRecover && (

                                                <button
                                                    type="button"

                                                    onClick={
                                                        handleRecover
                                                    }

                                                    disabled={isBusy}

                                                    className={
                                                        PRIMARY_BUTTON
                                                    }
                                                >

                                                    <RefreshCw size={18}/>

                                                    Natijani tiklash

                                                </button>

                                            )}


                                            <button
                                                type="button"

                                                onClick={
                                                    handleRefresh
                                                }

                                                disabled={isBusy}

                                                className={
                                                    SECONDARY_BUTTON
                                                }
                                            >

                                                <RefreshCw size={17}/>

                                                Holatni tekshirish

                                            </button>

                                        </>

                                    ) : (

                                        <>

                                            <button
                                                type="button"

                                                onClick={
                                                    handleClaim
                                                }

                                                disabled={!canClaim}

                                                className={
                                                    PRIMARY_BUTTON
                                                }
                                            >

                                                {isBusy ? (

                                                    <Loader2
                                                        size={19}

                                                        className="
                                                            motion-safe:animate-spin
                                                        "
                                                    />

                                                ) : claimedToday ? (

                                                    <CheckCircle2 size={19}/>

                                                ) : isScheduled ? (

                                                    <CalendarClock size={19}/>

                                                ) : (

                                                    <Gift size={19}/>

                                                )}


                                                {isClaimLoading

                                                    ? "Sovg‘a ochilmoqda..."

                                                    : isStatusLoading

                                                        ? "Tekshirilmoqda..."

                                                        : claimedToday

                                                            ? "Bugun olindi"

                                                            : isScheduled

                                                                ? "Tadbir kutilmoqda"

                                                                : isFinished

                                                                    ? "Tadbir yakunlangan"

                                                                    : isDisabled

                                                                        ? "Tadbir o‘chirilgan"

                                                                        : "Sovg‘ani ochish"
                                                }

                                            </button>


                                            {!canClaim && (

                                                <button
                                                    type="button"

                                                    disabled={isBusy}

                                                    onClick={
                                                        handleRefresh
                                                    }

                                                    className={
                                                        SECONDARY_BUTTON
                                                    }
                                                >

                                                    <RefreshCw size={16}/>

                                                    Holatni yangilash

                                                </button>

                                            )}

                                        </>

                                    )}

                                </div>

                            )}

                        </>

                    )}

                </main>


                {/* =====================================
                    FOOTER
                ===================================== */}

                <footer
                    className="
                        mt-6

                        border-t
                        border-slate-200
                        dark:border-white/[0.07]

                        pt-4
                    "
                >

                    <div
                        className="
                            flex items-center
                            justify-center gap-2

                            text-center text-xs

                            text-slate-500
                            dark:text-slate-400
                        "
                    >

                        <ShieldCheck
                            size={16}
                            className="
                                shrink-0
                                text-emerald-500
                            "
                        />

                        Har kuni bitta bepul sovg‘a

                    </div>

                </footer>

            </div>

        </dialog>,

        document.body
    );
}


// =========================================================
// EXPORT
// =========================================================

export default memo(DailyGiftModal);
