
// src/components/daily-gift/DailyGiftButton.jsx

import React, {
    memo,
    useCallback,
} from "react";

import {
    Gift,
    Clock3,
    CalendarClock,
    Loader2,
    AlertCircle,
} from "lucide-react";

import {
    useSelector,
} from "react-redux";


// =========================================================
// DAILY GIFT HOOK
// =========================================================

import useDailyGiftModal from "../../hooks/dailyGift/useDailyGiftModal";


// =========================================================
// DAILY GIFT SELECTORS
// =========================================================

import {
    selectDailyGiftEntryPointView,
} from "../../features/dailyGift/dailyGiftSelectors";


// =========================================================
// DAILY GIFT CONFIGURATION
// =========================================================

import {
    DAILY_GIFT_EVENT_STATUS,
} from "../../config/dailyGiftConfig";


// =========================================================
// FSOCIETY — DAILY GIFT NAVBAR BUTTON
// =========================================================
//
// Features:
//
// - Global Redux state
// - Global Daily Gift modal
// - Animated gift availability indicator
// - Scheduled event state
// - Already claimed state
// - Claim loading state
// - Uncertain claim recovery state
// - Dark / Light mode
// - Responsive dimensions
// - Keyboard accessibility
// - Reduced motion support
//
// Important:
//
// This component does not submit claim requests.
//
// It only opens the shared Daily Gift modal.
//
// =========================================================


// =========================================================
// BUTTON PRESENTATION
// =========================================================

const getButtonPresentation = ({
    eventStatus,
    canClaim,
    claimedToday,
    isLoading,
    isClaimLoading,
    hasUncertainClaim,
}) => {

    // =====================================================
    // CLAIM IN PROGRESS
    // =====================================================

    if (isClaimLoading) {

        return {
            Icon: Loader2,

            label:
                "Sovg‘a ochilmoqda",

            isSpinning:
                true,

            isHighlighted:
                false,

            colorClass: `
                text-cyan-700
                dark:text-cyan-300
            `,
        };
    }


    // =====================================================
    // UNCERTAIN CLAIM
    // =====================================================

    if (hasUncertainClaim) {

        return {
            Icon: AlertCircle,

            label:
                "Sovg‘a natijasini tekshirish",

            isSpinning:
                false,

            isHighlighted:
                false,

            colorClass: `
                text-amber-600
                dark:text-amber-300
            `,
        };
    }


    // =====================================================
    // LOADING
    // =====================================================

    if (isLoading) {

        return {
            Icon: Loader2,

            label:
                "Sovg‘a holati yuklanmoqda",

            isSpinning:
                true,

            isHighlighted:
                false,

            colorClass: `
                text-slate-500
                dark:text-slate-400
            `,
        };
    }


    // =====================================================
    // SCHEDULED EVENT
    // =====================================================

    if (
        eventStatus ===
        DAILY_GIFT_EVENT_STATUS.SCHEDULED
    ) {

        return {
            Icon: CalendarClock,

            label:
                "Yangi yil tadbiri tez orada boshlanadi",

            isSpinning:
                false,

            isHighlighted:
                false,

            colorClass: `
                text-violet-600
                dark:text-violet-300
            `,
        };
    }


    // =====================================================
    // AVAILABLE GIFT
    // =====================================================

    if (canClaim) {

        return {
            Icon: Gift,

            label:
                "Kunlik sovg‘angiz tayyor!",

            isSpinning:
                false,

            isHighlighted:
                true,

            colorClass: `
                text-cyan-700
                dark:text-cyan-200
            `,
        };
    }


    // =====================================================
    // ALREADY CLAIMED
    // =====================================================

    if (claimedToday) {

        return {
            Icon: Clock3,

            label:
                "Bugungi sovg‘a olingan",

            isSpinning:
                false,

            isHighlighted:
                false,

            colorClass: `
                text-slate-500
                dark:text-slate-400
            `,
        };
    }


    // =====================================================
    // DEFAULT
    // =====================================================

    return {

        Icon: Gift,

        label:
            "Kunlik sovg‘alar",

        isSpinning:
            false,

        isHighlighted:
            false,

        colorClass: `
            text-cyan-700
            dark:text-cyan-300
        `,
    };
};


// =========================================================
// MAIN COMPONENT
// =========================================================

function DailyGiftButton({

    className = "",

    onOpen,

}) {

    // =====================================================
    // REDUX VIEW MODEL
    // =====================================================

    const {
        isVisible,

        eventStatus,

        canClaim,

        availableCount,

        claimedToday,

        isLoading,

        isClaimLoading,

        hasUncertainClaim,

    } = useSelector(
        selectDailyGiftEntryPointView
    );


    // =====================================================
    // GLOBAL MODAL
    // =====================================================

    const {
        isOpen,

        openModal,

    } = useDailyGiftModal();


    // =====================================================
    // BUTTON CLICK
    //
    // Open the shared modal.
    //
    // Parent callback is used to close existing
    // Navbar popovers and sidebars.
    // =====================================================

    const handleClick = useCallback(
        () => {

            const opened = openModal();


            if (
                opened
                &&
                typeof onOpen === "function"
            ) {

                onOpen();
            }
        },

        [
            openModal,

            onOpen,
        ]
    );


    // =====================================================
    // EVENT VISIBILITY
    //
    // Hide when:
    //
    // - Authentication is invalid
    // - Event does not exist
    // - Event is disabled
    // - Event is finished
    //
    // Hooks must always execute before this return.
    // =====================================================

    if (!isVisible) {

        return null;
    }


    // =====================================================
    // BUTTON VISUAL STATE
    // =====================================================

    const {
        Icon,

        label,

        isSpinning,

        isHighlighted,

        colorClass,

    } = getButtonPresentation({

        eventStatus,

        canClaim,

        claimedToday,

        isLoading,

        isClaimLoading,

        hasUncertainClaim,
    });


    const showAvailabilityIndicator = (
        isHighlighted
        &&
        availableCount > 0
    );


    // =====================================================
    // BUTTON SURFACE
    // =====================================================

    const surfaceClass = isHighlighted

        ? `
            border-cyan-500/40
            bg-cyan-500/[0.12]

            shadow-[0_0_14px_rgba(6,182,212,0.14)]

            hover:border-cyan-500/60
            hover:bg-cyan-500/[0.18]

            dark:border-cyan-400/30
            dark:bg-cyan-400/[0.10]

            dark:shadow-[0_0_18px_rgba(34,211,238,0.13)]

            dark:hover:border-cyan-400/50
            dark:hover:bg-cyan-400/[0.16]
        `

        : `
            border-slate-200
            bg-slate-100/70

            hover:border-cyan-500/30
            hover:bg-cyan-500/[0.08]

            dark:border-white/[0.08]
            dark:bg-white/[0.035]

            dark:hover:border-cyan-400/25
            dark:hover:bg-cyan-400/[0.07]
        `;


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <button

            type="button"

            onClick={handleClick}

            title={label}

            aria-label={label}

            aria-haspopup="dialog"

            aria-expanded={Boolean(isOpen)}

            aria-busy={
                isLoading || isClaimLoading
            }

            className={`
                group/daily-gift

                relative

                inline-flex

                h-8 w-8

                min-[390px]:h-9
                min-[390px]:w-9

                sm:h-10
                sm:w-10

                shrink-0

                items-center
                justify-center

                isolate

                rounded-xl

                border

                transition-[background-color,border-color,box-shadow,transform]

                duration-200

                active:scale-95

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-cyan-500
                focus-visible:ring-offset-2

                dark:focus-visible:ring-offset-[#080c12]

                motion-reduce:transform-none
                motion-reduce:transition-none

                ${surfaceClass}

                ${colorClass}

                ${className}
            `}
        >

            {/* ==========================================
                AVAILABLE GIFT GLOW
            ========================================== */}

            {isHighlighted && (

                <span

                    aria-hidden="true"

                    className="
                        pointer-events-none

                        absolute
                        -inset-px

                        rounded-xl

                        border
                        border-cyan-400/40

                        opacity-60

                        motion-safe:animate-pulse

                        dark:border-cyan-300/30
                    "
                />
            )}


            {/* ==========================================
                INNER HOVER SURFACE
            ========================================== */}

            <span

                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute inset-0

                    rounded-xl

                    bg-cyan-400/[0.05]

                    opacity-0

                    transition-opacity

                    duration-200

                    group-hover/daily-gift:opacity-100

                    motion-reduce:transition-none
                "
            />


            {/* ==========================================
                GIFT ICON
            ========================================== */}

            <Icon

                size={19}

                strokeWidth={1.9}

                aria-hidden="true"

                className={`
                    relative z-10

                    h-[17px]
                    w-[17px]

                    sm:h-[19px]
                    sm:w-[19px]

                    shrink-0

                    transition-transform

                    duration-200

                    motion-safe:group-hover/daily-gift:scale-110

                    motion-reduce:transition-none

                    ${
                        isSpinning

                            ? "motion-safe:animate-spin"

                            : ""
                    }
                `}
            />


            {/* ==========================================
                AVAILABLE GIFT INDICATOR
            ========================================== */}

            {showAvailabilityIndicator && (

                <span

                    aria-hidden="true"

                    className="
                        pointer-events-none

                        absolute

                        -right-1
                        -top-1

                        z-20

                        flex

                        h-[16px]
                        min-w-[16px]

                        items-center
                        justify-center

                        rounded-full

                        border
                        border-white

                        bg-cyan-600

                        px-0.5

                        text-[9px]
                        font-bold
                        leading-none

                        tabular-nums

                        text-white

                        shadow-sm

                        dark:border-[#080c12]
                        dark:bg-cyan-400
                        dark:text-slate-950
                    "
                >

                    {availableCount}

                </span>
            )}

        </button>
    );
}


// =========================================================
// EXPORT
// =========================================================

export default memo(DailyGiftButton);
