
import React, {
    memo,
    useEffect,
    useId,
    useRef,
    useState,
} from "react";

import { createPortal } from "react-dom";

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


// =========================================================
// FSOCIETY — DAILY GIFT MODAL
// =========================================================

const {
    ACTIVE,
    SCHEDULED,
    DISABLED,
    FINISHED,
} = DAILY_GIFT_EVENT_STATUS;


// =========================================================
// SHARED STYLES
// =========================================================

const PRIMARY_BUTTON = `
    inline-flex w-full
    items-center justify-center gap-2

    rounded-xl px-5 py-3.5

    bg-gradient-to-r
    from-cyan-600 to-blue-600

    text-sm font-semibold text-white

    shadow-lg shadow-cyan-500/20

    transition-all duration-200

    hover:brightness-110

    motion-safe:active:scale-[0.98]

    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-cyan-400

    disabled:cursor-not-allowed
    disabled:opacity-50
    disabled:shadow-none

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
// REWARD RARITY CONFIG
// =========================================================

const RARITY_STYLES = {

    common: {
        label: "COMMON",

        text: `
            text-slate-600
            dark:text-slate-300
        `,

        surface: `
            border-slate-300
            bg-slate-100
            dark:border-slate-500/30
            dark:bg-slate-500/10
        `,
    },

    rare: {
        label: "RARE",

        text: `
            text-blue-600
            dark:text-blue-400
        `,

        surface: `
            border-blue-300
            bg-blue-50
            dark:border-blue-500/30
            dark:bg-blue-500/10
        `,
    },

    epic: {
        label: "EPIC",

        text: `
            text-purple-600
            dark:text-purple-400
        `,

        surface: `
            border-purple-300
            bg-purple-50
            dark:border-purple-500/30
            dark:bg-purple-500/10
        `,
    },

    legendary: {
        label: "LEGENDARY",

        text: `
            text-amber-600
            dark:text-amber-400
        `,

        surface: `
            border-amber-300
            bg-amber-50
            dark:border-amber-500/40
            dark:bg-amber-500/10
        `,
    },
};


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
// ERROR MESSAGE NORMALIZER
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

    if (reward.rarity === "legendary") {
        return Crown;
    }

    const type =
        reward.awarded_reward_type
        ??
        reward.type;

    switch (type) {

        case "coin":
            return Coins;

        case "badge":
            return Award;

        case "frame":
            return FrameIcon;

        case "achievement":
            return Trophy;

        default:
            return Gift;
    }
};


// =========================================================
// GIFT ILLUSTRATION
// =========================================================

const GiftIllustration = memo(
    function GiftIllustration({
        isOpening = false,
        isScheduled = false,
    }) {

        return (

            <div
                aria-hidden="true"
                className="
                    relative flex
                    h-48 sm:h-56
                    items-center justify-center
                    overflow-hidden
                "
            >

                {/* Radial glow */}

                <div
                    className="
                        pointer-events-none
                        absolute

                        h-44 w-44

                        rounded-full

                        bg-cyan-400/20
                        dark:bg-cyan-500/20

                        blur-3xl
                    "
                />


                {/* Decorative particles */}

                <Sparkles
                    className="
                        absolute left-[18%] top-[18%]

                        h-5 w-5

                        text-cyan-500/60
                        dark:text-cyan-300/70

                        motion-safe:animate-pulse
                    "
                />

                <Sparkles
                    className="
                        absolute right-[19%] bottom-[21%]

                        h-6 w-6

                        text-blue-500/60
                        dark:text-blue-300/70

                        motion-safe:animate-pulse
                    "
                />

                <Snowflake
                    className="
                        absolute right-[22%] top-[15%]

                        h-4 w-4

                        text-cyan-500/40
                        dark:text-cyan-300/50
                    "
                />


                {/* Outer ring */}

                <div
                    className="
                        relative flex
                        h-40 w-40

                        items-center justify-center

                        rounded-full
                        border border-dashed

                        border-cyan-500/30
                        dark:border-cyan-400/30

                        sm:h-44 sm:w-44
                    "
                >

                    {/* Inner gift container */}

                    <div
                        className={`
                            relative flex

                            h-28 w-28
                            sm:h-32 sm:w-32

                            items-center justify-center

                            rounded-[2rem]
                            border border-cyan-400/40

                            bg-gradient-to-br

                            from-cyan-100
                            via-sky-50
                            to-blue-100

                            dark:from-cyan-950
                            dark:via-slate-900
                            dark:to-blue-950

                            shadow-xl
                            shadow-cyan-500/20

                            ${
                                isOpening
                                    ? "motion-safe:animate-pulse"
                                    : ""
                            }
                        `}
                    >

                        {isOpening ? (

                            <Loader2
                                className="
                                    h-14 w-14

                                    text-cyan-600
                                    dark:text-cyan-300

                                    motion-safe:animate-spin
                                "
                            />

                        ) : isScheduled ? (

                            <CalendarClock
                                strokeWidth={1.4}
                                className="
                                    h-14 w-14

                                    text-violet-600
                                    dark:text-violet-300
                                "
                            />

                        ) : (

                            <Gift
                                strokeWidth={1.4}
                                className="
                                    h-16 w-16
                                    sm:h-20 sm:w-20

                                    text-cyan-600
                                    dark:text-cyan-300

                                    drop-shadow-lg
                                "
                            />

                        )}

                    </div>

                </div>

            </div>
        );
    }
);


// =========================================================
// REWARD RESULT
// =========================================================

const RewardResult = memo(
    function RewardResult({
        reward,
        isHistorical = false,
        onContinue,
    }) {

        const rarity =
            RARITY_STYLES[reward.rarity]
            ??
            RARITY_STYLES.common;

        const RewardIcon = getRewardIcon(
            reward
        );

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

        return (

            <div className="space-y-5">

                <div
                    className="
                        text-center
                    "
                >

                    <p
                        className="
                            mb-2

                            text-xs font-semibold
                            uppercase tracking-[0.2em]

                            text-emerald-600
                            dark:text-emerald-400
                        "
                    >
                        {isHistorical
                            ? "Olingan mukofot"
                            : "Sovg‘a olindi"}
                    </p>

                    <h3
                        className="
                            text-2xl font-bold
                            text-slate-900
                            dark:text-white
                        "
                    >
                        {isHistorical
                            ? "Mukofotingiz"
                            : "Tabriklaymiz!"}
                    </h3>

                </div>


                {/* Reward rarity card */}

                <div
                    className={`
                        flex flex-col
                        items-center gap-4

                        rounded-2xl border
                        p-6 text-center

                        ${rarity.surface}
                    `}
                >

                    <div
                        className={`
                            flex h-24 w-24
                            items-center justify-center

                            rounded-full

                            bg-white/60
                            dark:bg-slate-950/40

                            ${rarity.text}
                        `}
                    >

                        <RewardIcon
                            size={48}
                            strokeWidth={1.5}
                        />

                    </div>

                    <span
                        className={`
                            text-xs font-bold
                            tracking-[0.2em]

                            ${rarity.text}
                        `}
                    >
                        {rarity.label}
                    </span>

                    <h4
                        className={`
                            break-words
                            text-2xl font-bold

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
                                text-sm
                                text-slate-600
                                dark:text-slate-400
                            "
                        >
                            {rewardName}
                        </p>

                    )}

                    {reward.is_compensation && (

                        <p
                            className="
                                rounded-lg

                                bg-amber-500/10
                                px-3 py-2

                                text-xs
                                text-amber-700
                                dark:text-amber-300
                            "
                        >
                            Bu mukofot sizda avvaldan
                            mavjud bo‘lgani uchun
                            FCoin kompensatsiyasi berildi.
                        </p>

                    )}

                </div>


                <div
                    className="
                        flex items-center
                        justify-center gap-2

                        text-xs

                        text-emerald-600
                        dark:text-emerald-400
                    "
                >

                    <CheckCircle2 size={15} />

                    Mukofot serverda qayd etilgan

                </div>

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
// MAIN MODAL
// =========================================================

function DailyGiftModal({
    gift,
    modal,
}) {

    const dialogRef = useRef(null);

    const titleId = useId();

    const descriptionId = useId();

    const [actionError, setActionError] =
        useState("");


    // =====================================================
    // EVENT & ELIGIBILITY STATE
    // =====================================================

    const status = gift.status;

    const eventStatus =
        gift.eventStatus;

    const reward =
        modal.reward
        ??
        gift.reward;

    const isScheduled =
        eventStatus === SCHEDULED;

    const isActive =
        eventStatus === ACTIVE;

    const isDisabled =
        eventStatus === DISABLED;

    const isFinished =
        eventStatus === FINISHED;

    const isClaimLoading =
        Boolean(gift.isClaimLoading);

    const isStatusLoading =
        Boolean(modal.isStatusLoading);

    const claimedToday =
        Boolean(modal.claimedToday);

    const hasReward =
        Boolean(modal.hasReward && reward);

    const canRecover =
        Boolean(modal.canRecover);

    const hasUncertainClaim =
        Boolean(modal.hasUncertainClaim);

    const canClaim = (

        isActive
        &&
        gift.canClaim
        &&
        !isClaimLoading
        &&
        !isStatusLoading
        &&
        !hasUncertainClaim
    );

    const isBusy =
        isClaimLoading || isStatusLoading;


    // =====================================================
    // NATIVE MODAL LIFECYCLE
    //
    // Native dialog provides:
    //
    // - Modal focus management
    // - Background interaction blocking
    // - Escape key handling
    // - Browser top-layer rendering
    //
    // Portal prevents navbar overflow issues.
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
    // BODY SCROLL LOCK
    // =====================================================

    useEffect(() => {

        const originalOverflow =
            document.body.style.overflow;

        document.body.style.overflow =
            "hidden";

        return () => {

            document.body.style.overflow =
                originalOverflow;
        };

    }, []);


    // =====================================================
    // CLOSE HANDLERS
    //
    // Closing the modal never cancels an
    // in-progress claim request.
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
            event.target
            !==
            event.currentTarget
        ) {
            return;
        }

        const bounds =
            event.currentTarget.getBoundingClientRect();

        const isOutside = (

            event.clientX < bounds.left
            ||
            event.clientX > bounds.right
            ||
            event.clientY < bounds.top
            ||
            event.clientY > bounds.bottom
        );

        if (isOutside) {
            handleClose();
        }
    };


    // =====================================================
    // ASYNC ACTION HELPER
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
    // CLAIM
    //
    // The browser does not select or grant rewards.
    //
    // DailyGiftService and the backend remain
    // authoritative.
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
    // MANUAL CLAIM RECOVERY
    //
    // Only allowed when the existing Redux hook
    // explicitly permits recovering a claim.
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


    const handleContinue = () => {

        modal.dismissReward();

        setActionError("");
    };


    // =====================================================
    // PRESENTATION HELPERS
    // =====================================================

    const timeZone =
        status?.timezone
        ??
        gift.event?.timezone
        ??
        "Asia/Tashkent";

    const eventStartsAt =
        gift.eventStartsAt
        ??
        gift.event?.starts_at;

    const eventName =
        gift.event?.name
        ??
        "FSociety Daily Gift";

    const startDate = formatDate(
        eventStartsAt,
        timeZone
    );

    const nextClaimDate = formatDate(
        gift.nextClaimAt,
        timeZone
    );

    const error =
        gift.claimError
        ??
        gift.statusError
        ??
        gift.eventError;

    const errorMessage = (
        actionError
        ||
        (
            error
                ? getErrorMessage(error)
                : ""
        )
    );


    // =====================================================
    // STATUS CONTENT
    // =====================================================

    let statusTitle =
        "Sovg‘a holati tekshirilmoqda";

    let statusDescription =
        "Kunlik sovg‘angiz haqida ma’lumot olinmoqda.";

    let StatusIcon = Clock3;

    let statusClass = `
        text-slate-500
        dark:text-slate-400
    `;


    if (isClaimLoading) {

        statusTitle =
            "Sovg‘angiz ochilmoqda...";

        statusDescription =
            "Server mukofotingizni aniqlamoqda.";

    } else if (hasUncertainClaim) {

        statusTitle =
            "Sovg‘a holatini tasdiqlash kerak";

        statusDescription =
            "Oldingi so‘rov natijasi noma’lum. "
            + "Mukofotni qayta olishdan oldin "
            + "serverdagi holatni tekshiring.";

        StatusIcon = AlertCircle;

        statusClass = `
            text-amber-600
            dark:text-amber-400
        `;

    } else if (isScheduled) {

        statusTitle =
            "Tadbir hali boshlanmagan";

        statusDescription = startDate

            ? `${startDate} da boshlanadi.`

            : "Tadbir boshlanishini kuting.";

        StatusIcon = CalendarClock;

        statusClass = `
            text-violet-600
            dark:text-violet-400
        `;

    } else if (isDisabled) {

        statusTitle =
            "Tadbir vaqtincha o‘chirilgan";

        statusDescription =
            "Hozir sovg‘a olish imkoni mavjud emas.";

    } else if (isFinished) {

        statusTitle =
            "Tadbir yakunlandi";

        statusDescription =
            "Ishtirokingiz uchun tashakkur!";

    } else if (claimedToday) {

        statusTitle =
            "Bugungi sovg‘angiz olindi";

        statusDescription = nextClaimDate

            ? `Keyingi sovg‘a: ${nextClaimDate}`

            : "Keyingi kun yana tashrif buyuring.";

        StatusIcon = CheckCircle2;

        statusClass = `
            text-emerald-600
            dark:text-emerald-400
        `;

    } else if (canClaim) {

        statusTitle =
            "Bugungi sovg‘angiz tayyor!";

        statusDescription =
            "Sovg‘ani oching va tasodifiy "
            + "mukofotni qo‘lga kiriting.";

        StatusIcon = CheckCircle2;

        statusClass = `
            text-emerald-600
            dark:text-emerald-400
        `;

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
    // PORTAL RENDER
    // =====================================================

    if (typeof document === "undefined") {
        return null;
    }


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

                p-0

                shadow-2xl

                backdrop:bg-slate-950/70
                backdrop:backdrop-blur-sm

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
                    BACKGROUND GLOW
                ===================================== */}

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute

                        -top-32 left-1/2
                        -z-10

                        h-72 w-72
                        -translate-x-1/2

                        rounded-full

                        bg-cyan-400/10
                        dark:bg-cyan-500/15

                        blur-3xl
                    "
                />


                {/* =====================================
                    HEADER
                ===================================== */}

                <header
                    className="
                        mb-5 flex
                        items-center
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
                            size={17}
                            className="
                                shrink-0

                                text-cyan-600
                                dark:text-cyan-300
                            "
                        />

                        <span
                            className="
                                truncate

                                font-mono
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

                        <X size={19} />

                    </button>

                </header>


                {/* =====================================
                    MODAL TITLE
                ===================================== */}

                <div className="text-center">

                    <h2
                        id={titleId}
                        className="
                            text-2xl
                            font-bold
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
                    REWARD OR GIFT PRESENTATION
                ===================================== */}

                <main
                    aria-busy={isBusy}
                    className="mt-6"
                >

                    {hasReward ? (

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

                            <GiftIllustration

                                isOpening={
                                    isClaimLoading
                                }

                                isScheduled={
                                    isScheduled
                                }
                            />


                            {/* Event status */}

                            <div
                                role="status"
                                aria-live="polite"
                                className="
                                    mb-6 space-y-2
                                    text-center
                                "
                            >

                                <div
                                    className={`
                                        flex items-center
                                        justify-center gap-2

                                        text-sm font-semibold

                                        ${statusClass}
                                    `}
                                >

                                    <StatusIcon
                                        size={17}
                                        className="shrink-0"
                                    />

                                    <span>
                                        {statusTitle}
                                    </span>

                                </div>

                                <p
                                    className="
                                        mx-auto max-w-sm

                                        text-xs leading-relaxed

                                        text-slate-500
                                        dark:text-slate-400

                                        sm:text-sm
                                    "
                                >
                                    {statusDescription}
                                </p>

                            </div>


                            {/* Error message */}

                            {errorMessage && (

                                <div
                                    role="alert"
                                    className="
                                        mb-4 flex
                                        items-start gap-2

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


                            {/* =================================
                                ACTIONS
                            ================================= */}

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

                                                <RefreshCw size={17} />

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
                                            Holatni tekshirish
                                        </button>

                                    </>

                                ) : (

                                    <>

                                        <button

                                            type="button"

                                            disabled={!canClaim}

                                            onClick={
                                                handleClaim
                                            }

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

                                                <CheckCircle2 size={19} />

                                            ) : isScheduled ? (

                                                <CalendarClock size={19} />

                                            ) : (

                                                <Gift size={19} />

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

                                                <RefreshCw size={15} />

                                                Holatni yangilash

                                            </button>

                                        )}

                                    </>

                                )}

                            </div>

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
                            size={15}
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
