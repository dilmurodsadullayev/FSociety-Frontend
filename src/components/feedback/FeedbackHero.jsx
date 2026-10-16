
import React from "react";

import {
    Loader2,
    Plus,
    RefreshCcw,
    Sparkles,
} from "lucide-react";

// =========================================================
// FSOCIETY — FEEDBACK HERO
//
// Features:
// - Dark / Light Mode
// - Mobile-first responsive design
// - Feedback create button
// - Refresh button
// - Refresh loading state
// - Accessible buttons
// - Reduced-motion friendly animations
//
// No Redux.
// No direct API calls.
//
// Props:
// - isRefreshing
// - onRefresh
// - onCreate
// =========================================================

const FeedbackHero = ({
    isRefreshing = false,
    onRefresh,
    onCreate,
}) => {
    // =====================================================
    // STATE
    // =====================================================

    const refreshing = Boolean(isRefreshing);

    const canRefresh =
        !refreshing &&
        typeof onRefresh === "function";

    const canCreate =
        typeof onCreate === "function";

    // =====================================================
    // HANDLERS
    // =====================================================

    const handleRefresh = () => {
        if (!canRefresh) {
            return;
        }

        onRefresh();
    };

    const handleCreate = () => {
        if (!canCreate) {
            return;
        }

        onCreate();
    };

    // =====================================================
    // JSX
    // =====================================================

    return (
        <section
            aria-labelledby="feedback-page-title"

            className="
                relative
                isolate

                w-full
                min-w-0

                overflow-hidden

                rounded-[22px]
                border
                border-slate-200

                bg-white

                px-4
                py-7

                shadow-[0_8px_35px_rgba(15,23,42,0.035)]

                sm:rounded-[28px]
                sm:px-7
                sm:py-9

                lg:rounded-[32px]
                lg:px-9
                lg:py-10

                dark:border-white/[0.07]
                dark:bg-white/[0.025]
                dark:shadow-none
            "
        >
            {/* ======================================
                BACKGROUND DECORATION
            ====================================== */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    -right-20
                    -top-20

                    h-60
                    w-60

                    rounded-full

                    bg-indigo-500/[0.06]

                    blur-[90px]

                    dark:bg-indigo-500/[0.08]
                "
            />

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    -bottom-24
                    left-1/4

                    h-48
                    w-48

                    rounded-full

                    bg-cyan-500/[0.04]

                    blur-[85px]

                    dark:bg-cyan-400/[0.035]
                "
            />

            {/* TOP ACCENT */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    inset-x-0
                    top-0

                    h-px

                    bg-gradient-to-r
                    from-transparent
                    via-indigo-500/30
                    to-transparent

                    dark:via-indigo-400/20
                "
            />

            {/* ======================================
                HERO CONTENT
            ====================================== */}

            <div
                className="
                    relative
                    z-10

                    flex
                    min-w-0

                    flex-col
                    gap-7

                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                    lg:gap-8
                "
            >
                {/* ==================================
                    HERO TEXT
                ================================== */}

                <div
                    className="
                        w-full
                        min-w-0
                        max-w-3xl
                    "
                >
                    {/* SECTION BADGE */}

                    <div
                        className="
                            inline-flex
                            max-w-full

                            items-center
                            gap-2

                            rounded-full
                            border
                            border-indigo-400/25

                            bg-indigo-500/[0.07]

                            px-3
                            py-1.5

                            font-display
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.12em]

                            text-indigo-700

                            dark:border-indigo-400/[0.17]
                            dark:bg-indigo-400/[0.06]
                            dark:text-indigo-300
                        "
                    >
                        <Sparkles
                            size={13}
                            strokeWidth={1.9}

                            aria-hidden="true"

                            className="shrink-0"
                        />

                        <span>
                            Community Feedback
                        </span>
                    </div>

                    {/* ==================================
                        PAGE TITLE
                    ================================== */}

                    <h1
                        id="feedback-page-title"

                        className="
                            mt-5

                            break-words
                            [overflow-wrap:anywhere]

                            font-display

                            text-[27px]
                            font-black
                            leading-[1.18]
                            tracking-[-0.035em]

                            text-slate-900

                            sm:text-4xl
                            sm:leading-tight

                            lg:text-[44px]

                            dark:text-white
                        "
                    >
                        F.Society’ni{" "}

                        <span
                            className="
                                bg-gradient-to-r
                                from-indigo-700
                                via-sky-600
                                to-indigo-700

                                bg-clip-text
                                text-transparent

                                dark:from-indigo-400
                                dark:via-cyan-300
                                dark:to-indigo-400
                            "
                        >
                            birga yaxshilaymiz.
                        </span>
                    </h1>

                    {/* ==================================
                        DESCRIPTION
                    ================================== */}

                    <p
                        className="
                            mt-4

                            max-w-2xl

                            text-[12px]
                            font-medium
                            leading-6

                            text-slate-600

                            sm:text-sm
                            sm:leading-7

                            dark:text-gray-400
                        "
                    >
                        Bug topdingizmi, yangi feature
                        g‘oyangiz bormi yoki platforma
                        haqida fikringizni aytmoqchimisiz?

                        {" "}

                        Feedback yuboring. Admin uni
                        ko‘rib chiqadi, ishlashga oladi
                        va foydali feedbacklar uchun
                        FCoin mukofoti berilishi mumkin.
                    </p>
                </div>

                {/* ==================================
                    ACTION BUTTONS
                ================================== */}

                <div
                    className="
                        flex
                        w-full
                        min-w-0
                        shrink-0

                        flex-col
                        gap-3

                        sm:w-auto
                        sm:flex-row
                        sm:flex-wrap

                        lg:justify-end
                    "
                >
                    {/* ==============================
                        REFRESH BUTTON
                    ============================== */}

                    <button
                        type="button"

                        onClick={handleRefresh}

                        disabled={!canRefresh}

                        aria-label={
                            refreshing
                                ? "Feedbacklar yangilanmoqda"
                                : "Feedbacklarni yangilash"
                        }

                        aria-busy={refreshing}

                        className="
                            group/refresh

                            inline-flex
                            min-h-11
                            w-full
                            min-w-0

                            items-center
                            justify-center
                            gap-2

                            rounded-xl
                            border
                            border-slate-200

                            bg-white

                            px-4
                            py-3

                            font-display
                            text-[12px]
                            font-bold

                            text-slate-700

                            transition-colors
                            duration-150

                            hover:border-indigo-400/40
                            hover:bg-indigo-500/[0.05]
                            hover:text-indigo-700

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-indigo-500
                            focus-visible:ring-offset-2

                            disabled:cursor-not-allowed
                            disabled:opacity-50

                            sm:w-auto

                            dark:border-white/[0.10]
                            dark:bg-white/[0.035]
                            dark:text-gray-300

                            dark:hover:border-indigo-400/25
                            dark:hover:bg-indigo-400/[0.07]
                            dark:hover:text-indigo-300

                            dark:focus-visible:ring-offset-[#0b1018]
                        "
                    >
                        {refreshing ? (
                            <Loader2
                                size={16}
                                aria-hidden="true"

                                className="
                                    shrink-0
                                    animate-spin

                                    motion-reduce:animate-none
                                "
                            />
                        ) : (
                            <RefreshCcw
                                size={16}
                                strokeWidth={2}
                                aria-hidden="true"

                                className="
                                    shrink-0

                                    transition-transform
                                    duration-300

                                    group-hover/refresh:rotate-45

                                    motion-reduce:transform-none
                                "
                            />
                        )}

                        <span>
                            {refreshing
                                ? "Yangilanmoqda..."
                                : "Yangilash"}
                        </span>
                    </button>

                    {/* ==============================
                        CREATE FEEDBACK BUTTON
                    ============================== */}

                    <button
                        type="button"

                        onClick={handleCreate}

                        disabled={!canCreate}

                        aria-haspopup="dialog"

                        className="
                            group/create

                            inline-flex
                            min-h-11
                            w-full
                            min-w-0

                            items-center
                            justify-center
                            gap-2

                            rounded-xl
                            border
                            border-indigo-500

                            bg-indigo-600

                            px-5
                            py-3

                            font-display
                            text-[12px]
                            font-bold

                            text-white

                            shadow-[0_6px_20px_rgba(79,70,229,0.18)]

                            transition-colors
                            duration-150

                            hover:border-indigo-700
                            hover:bg-indigo-700

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-indigo-500
                            focus-visible:ring-offset-2

                            disabled:cursor-not-allowed
                            disabled:opacity-50

                            sm:w-auto

                            dark:focus-visible:ring-offset-[#0b1018]
                        "
                    >
                        <Plus
                            size={18}
                            strokeWidth={2.2}

                            aria-hidden="true"

                            className="
                                shrink-0

                                transition-transform
                                duration-200

                                group-hover/create:rotate-90

                                motion-reduce:transform-none
                            "
                        />

                        <span>
                            Feedback yuborish
                        </span>
                    </button>
                </div>
            </div>
        </section>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(
    FeedbackHero
);
