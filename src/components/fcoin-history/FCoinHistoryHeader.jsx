
import React, { memo, useCallback } from "react";

import {
    motion,
    useReducedMotion,
} from "framer-motion";

import {
    ArrowLeftRight,
    RefreshCw,
    ShieldCheck,
    WalletCards,
} from "lucide-react";

import FCoinIcon from "../../assests/coin/fcoin.png";

import {
    formatFullCoinNumber,
} from "./coinHistoryHelpers";

// =========================================================
// FSOCIETY — FCOIN HISTORY HEADER
//
// Original features preserved:
// - Username and page title
// - Transaction count badge
// - Structured ledger badge
// - Current balance
// - FCoin logo
// - Refresh callback
// - Refresh loading animation
// - Framer Motion entrance animations
// - Coin hover animation
// - Ambient glowing decoration
// - Internal technical grid
//
// Improvements:
// - Full FCoin number formatting
// - No K / M / B abbreviation
// - Large-number responsive layout
// - Light / Dark Mode
// - Reduced-motion support
// - Stable animation configurations
// - React.memo and useCallback
//
// PageGridBackground is supplied by FCoinHistory.jsx.
// =========================================================

// =========================================================
// ANIMATION CONFIGURATION
// =========================================================

const LEFT_INITIAL = {
    opacity: 0,
    y: 16,
};

const LEFT_VISIBLE = {
    opacity: 1,
    y: 0,
};

const LEFT_TRANSITION = {
    duration: 0.4,
    ease: "easeOut",
};

const BALANCE_INITIAL = {
    opacity: 0,
    scale: 0.96,
    y: 12,
};

const BALANCE_VISIBLE = {
    opacity: 1,
    scale: 1,
    y: 0,
};

const BALANCE_TRANSITION = {
    duration: 0.4,
    delay: 0.08,
    ease: "easeOut",
};

const COIN_HOVER = {
    rotate: 8,
    scale: 1.08,
};

const COIN_HOVER_TRANSITION = {
    type: "spring",
    stiffness: 250,
    damping: 16,
};

const GRID_STYLE = {
    backgroundImage: [
        "linear-gradient(to right, rgba(99,102,241,0.065) 1px, transparent 1px)",
        "linear-gradient(to bottom, rgba(99,102,241,0.065) 1px, transparent 1px)",
    ].join(", "),
    backgroundSize: "42px 42px",
};

// =========================================================
// MAIN COMPONENT
// =========================================================

const FCoinHistoryHeader = ({
    username = "FSociety",
    balance = 0,
    count = 0,
    isRefreshing = false,
    onRefresh,
}) => {
    // =====================================================
    // REDUCED MOTION
    // =====================================================

    const reduceMotion = Boolean(
        useReducedMotion()
    );

    // =====================================================
    // SAFE USERNAME
    // =====================================================

    const safeUsername =
        String(username ?? "").trim() ||
        "FSociety";

    // =====================================================
    // COMPLETE VALUES
    //
    // formatFullCoinNumber:
    // 1250000 -> 1 250 000
    //
    // The formatter does not shorten values.
    // =====================================================

    const displayBalance =
        formatFullCoinNumber(balance);

    const displayCount =
        formatFullCoinNumber(count);

    // =====================================================
    // REFRESH STATE
    // =====================================================

    const canRefresh =
        typeof onRefresh === "function";

    const refreshDisabled =
        Boolean(isRefreshing) ||
        !canRefresh;

    // =====================================================
    // REFRESH HANDLER
    //
    // Existing onRefresh callback preserved.
    // =====================================================

    const handleRefresh = useCallback(() => {
        if (
            isRefreshing ||
            typeof onRefresh !== "function"
        ) {
            return;
        }

        onRefresh();
    }, [
        isRefreshing,
        onRefresh,
    ]);

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <section
            aria-label="FCoin hamyon va tarix sarlavhasi"
            className="
                relative
                isolate
                min-w-0
                overflow-hidden

                rounded-[24px]
                border
                border-slate-200/90

                bg-white/90

                shadow-[0_20px_70px_rgba(15,23,42,0.08)]
                backdrop-blur-xl

                sm:rounded-[30px]

                dark:border-white/[0.07]
                dark:bg-[#0d1117]/95
                dark:shadow-[0_30px_100px_rgba(0,0,0,0.35)]
            "
        >
            {/* ======================================
                BACKGROUND GLOWS
            ====================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    -left-24
                    -top-24

                    h-72
                    w-72
                    rounded-full

                    bg-amber-300/[0.15]
                    blur-[100px]

                    dark:bg-yellow-400/[0.07]
                "
            />

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    -right-20
                    top-0

                    h-80
                    w-80
                    rounded-full

                    bg-indigo-300/[0.16]
                    blur-[110px]

                    dark:bg-indigo-500/[0.08]
                "
            />

            {/* ======================================
                BOTTOM ACCENT
            ====================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-x-0
                    bottom-0
                    h-px

                    bg-gradient-to-r
                    from-transparent
                    via-amber-500/35
                    to-transparent

                    dark:via-yellow-400/30
                "
            />

            {/* ======================================
                INTERNAL GRID DECORATION
            ====================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-0

                    opacity-45
                    dark:opacity-20
                "
                style={GRID_STYLE}
            />

            {/* ======================================
                MAIN CONTENT
            ====================================== */}

            <div
                className="
                    relative
                    z-10

                    p-5
                    sm:p-7
                    lg:p-9
                "
            >
                <div
                    className="
                        flex
                        min-w-0
                        flex-col
                        gap-7

                        xl:flex-row
                        xl:items-center
                        xl:justify-between
                    "
                >
                    {/* ==============================
                        LEFT — INTRODUCTION
                    ============================== */}

                    <motion.div
                        initial={
                            reduceMotion
                                ? false
                                : LEFT_INITIAL
                        }
                        animate={LEFT_VISIBLE}
                        transition={
                            reduceMotion
                                ? { duration: 0 }
                                : LEFT_TRANSITION
                        }
                        className="
                            min-w-0
                            flex-1
                        "
                    >
                        {/* ==========================
                            EYEBROW
                        ========================== */}

                        <div
                            className="
                                mb-4

                                inline-flex
                                max-w-full
                                items-center
                                gap-2

                                rounded-full
                                border
                                border-amber-200

                                bg-amber-50/90

                                px-3
                                py-1.5

                                font-mono
                                text-[10px]
                                font-black
                                uppercase
                                tracking-[0.16em]

                                text-amber-800

                                dark:border-yellow-400/20
                                dark:bg-yellow-400/[0.07]
                                dark:text-yellow-300
                            "
                        >
                            <ArrowLeftRight
                                size={14}
                                aria-hidden="true"
                            />

                            FCoin Ledger
                        </div>

                        {/* ==========================
                            TITLE
                        ========================== */}

                        <h1
                            className="
                                max-w-4xl

                                break-words
                                text-3xl
                                font-black
                                tracking-tight
                                leading-tight

                                text-slate-950

                                sm:text-4xl
                                lg:text-5xl

                                dark:text-white

                                [overflow-wrap:anywhere]
                            "
                        >
                            <span
                                className="
                                    text-amber-600
                                    dark:text-yellow-300
                                "
                            >
                                {safeUsername}
                            </span>

                            {" "}

                            FCoin tarixi
                        </h1>

                        {/* ==========================
                            DESCRIPTION
                        ========================== */}

                        <p
                            className="
                                mt-4
                                max-w-2xl

                                text-sm
                                font-medium
                                leading-7

                                text-slate-600

                                sm:text-[15px]

                                dark:text-gray-400
                            "
                        >
                            Platformadagi FCoin kirim va
                            chiqimlaringiz, mukofotlar,
                            promotion xarajatlari va boshqa
                            tranzaksiyalar shu yerda
                            saqlanadi.
                        </p>

                        {/* ==========================
                            INFORMATION BADGES
                        ========================== */}

                        <div
                            className="
                                mt-5
                                flex
                                flex-wrap
                                gap-2
                            "
                        >
                            {/* STRUCTURED LEDGER */}

                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-1.5

                                    rounded-full
                                    border
                                    border-emerald-200

                                    bg-emerald-50

                                    px-3
                                    py-1.5

                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.11em]

                                    text-emerald-700

                                    dark:border-emerald-400/15
                                    dark:bg-emerald-500/[0.06]
                                    dark:text-emerald-300
                                "
                            >
                                <ShieldCheck
                                    size={13}
                                    aria-hidden="true"
                                />

                                Structured ledger
                            </span>

                            {/* TRANSACTION COUNT */}

                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-1.5

                                    rounded-full
                                    border
                                    border-indigo-200

                                    bg-indigo-50

                                    px-3
                                    py-1.5

                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.11em]

                                    text-indigo-700

                                    dark:border-indigo-400/15
                                    dark:bg-indigo-500/[0.06]
                                    dark:text-indigo-300
                                "
                            >
                                <WalletCards
                                    size={13}
                                    aria-hidden="true"
                                />

                                <span className="tabular-nums">
                                    {displayCount}
                                </span>

                                tranzaksiya
                            </span>
                        </div>
                    </motion.div>

                    {/* ==============================
                        RIGHT — BALANCE CARD
                    ============================== */}

                    <motion.div
                        initial={
                            reduceMotion
                                ? false
                                : BALANCE_INITIAL
                        }
                        animate={BALANCE_VISIBLE}
                        transition={
                            reduceMotion
                                ? { duration: 0 }
                                : BALANCE_TRANSITION
                        }
                        className="
                            w-full
                            min-w-0

                            xl:w-auto
                            xl:min-w-[340px]
                            xl:max-w-[46%]
                        "
                    >
                        <div
                            className="
                                relative
                                min-w-0
                                overflow-hidden

                                rounded-[22px]
                                border
                                border-amber-200

                                bg-gradient-to-br
                                from-amber-50/95
                                via-white/90
                                to-indigo-50/80

                                p-5

                                shadow-[0_18px_60px_rgba(180,83,9,0.07)]

                                sm:rounded-[26px]
                                sm:p-6

                                dark:border-yellow-400/[0.16]
                                dark:from-yellow-400/[0.08]
                                dark:via-white/[0.025]
                                dark:to-indigo-500/[0.06]

                                dark:shadow-[0_20px_60px_rgba(0,0,0,0.30)]
                            "
                        >
                            {/* BACKGROUND COIN GLOW */}

                            <div
                                aria-hidden="true"
                                className="
                                    pointer-events-none
                                    absolute
                                    -right-10
                                    -top-10

                                    h-32
                                    w-32
                                    rounded-full

                                    bg-yellow-400/[0.10]
                                    blur-3xl
                                "
                            />

                            <div className="relative z-10">
                                {/* ======================
                                    TOP ROW
                                ====================== */}

                                <div
                                    className="
                                        flex
                                        items-start
                                        justify-between
                                        gap-3
                                    "
                                >
                                    <div className="min-w-0">
                                        <p
                                            className="
                                                font-mono
                                                text-[10px]
                                                font-black
                                                uppercase
                                                tracking-[0.15em]

                                                text-slate-500

                                                dark:text-gray-500
                                            "
                                        >
                                            Current balance
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                font-semibold

                                                text-slate-600

                                                dark:text-gray-400
                                            "
                                        >
                                            Joriy FCoin balans
                                        </p>
                                    </div>

                                    {/* ==================
                                        REFRESH BUTTON
                                    ================== */}

                                    <button
                                        type="button"
                                        onClick={handleRefresh}
                                        disabled={refreshDisabled}
                                        aria-label={
                                            isRefreshing
                                                ? "FCoin tarixi yangilanmoqda"
                                                : "FCoin tarixini yangilash"
                                        }
                                        aria-busy={isRefreshing}
                                        title="Yangilash"
                                        className="
                                            inline-flex
                                            h-10
                                            w-10
                                            shrink-0

                                            items-center
                                            justify-center

                                            rounded-xl
                                            border
                                            border-slate-200

                                            bg-white/80
                                            text-slate-500

                                            transition-all
                                            duration-200

                                            hover:border-amber-300
                                            hover:bg-amber-50
                                            hover:text-amber-700

                                            focus-visible:outline-none
                                            focus-visible:ring-2
                                            focus-visible:ring-amber-500

                                            disabled:cursor-not-allowed
                                            disabled:opacity-50

                                            dark:border-white/[0.07]
                                            dark:bg-black/20
                                            dark:text-gray-400

                                            dark:hover:border-yellow-400/20
                                            dark:hover:bg-yellow-400/[0.07]
                                            dark:hover:text-yellow-300

                                            motion-reduce:transition-none
                                        "
                                    >
                                        <RefreshCw
                                            size={17}
                                            aria-hidden="true"
                                            className={
                                                isRefreshing &&
                                                !reduceMotion
                                                    ? "animate-spin"
                                                    : ""
                                            }
                                        />
                                    </button>
                                </div>

                                {/* ======================
                                    FULL BALANCE
                                ====================== */}

                                <div
                                    className="
                                        mt-5

                                        flex
                                        min-w-0
                                        items-start
                                        gap-3

                                        sm:items-end
                                    "
                                >
                                    {/* COIN LOGO */}

                                    <motion.img
                                        src={FCoinIcon}
                                        alt="FCoin"
                                        draggable={false}
                                        loading="eager"
                                        decoding="async"
                                        whileHover={
                                            reduceMotion
                                                ? undefined
                                                : COIN_HOVER
                                        }
                                        transition={
                                            COIN_HOVER_TRANSITION
                                        }
                                        className="
                                            h-12
                                            w-12
                                            shrink-0

                                            object-contain

                                            drop-shadow-[0_0_18px_rgba(250,204,21,0.35)]

                                            sm:h-16
                                            sm:w-16
                                        "
                                    />

                                    {/* BALANCE TEXT */}

                                    <div className="min-w-0 flex-1">
                                        <div
                                            className="
                                                flex
                                                min-w-0
                                                flex-wrap

                                                items-baseline
                                                gap-x-2
                                                gap-y-1
                                            "
                                        >
                                            <span
                                                aria-label={`${displayBalance} FCoin`}
                                                title={`${displayBalance} FCoin`}
                                                className="
                                                    min-w-0
                                                    max-w-full

                                                    break-all

                                                    text-[clamp(1.5rem,3vw,3rem)]
                                                    font-black

                                                    leading-tight
                                                    tracking-[-0.045em]

                                                    tabular-nums

                                                    text-slate-950

                                                    dark:text-white

                                                    [overflow-wrap:anywhere]
                                                "
                                            >
                                                {displayBalance}
                                            </span>

                                            <span
                                                className="
                                                    font-mono
                                                    text-xs
                                                    font-black

                                                    uppercase
                                                    tracking-[0.12em]

                                                    text-amber-700

                                                    dark:text-yellow-300
                                                "
                                            >
                                                FCoin
                                            </span>
                                        </div>

                                        <p
                                            className="
                                                mt-2

                                                text-[11px]
                                                font-medium

                                                text-slate-500

                                                dark:text-gray-500
                                            "
                                        >
                                            Backend ledger bilan
                                            sinxron balans
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(FCoinHistoryHeader);
