
import React from "react";

import {
    Bug,
    CheckCircle2,
    Clock3,
    Coins,
    Gift,
    MessageSquareText,
    Wrench,
    XCircle,
} from "lucide-react";

// =========================================================
// COMPONENTS
// =========================================================

import FeedbackStatCard from "./FeedbackStatCard";

// =========================================================
// FSOCIETY — FEEDBACK STATS SECTION
//
// Responsibilities:
//
// - User feedback statistics
// - Seven existing stat cards
// - Responsive grid
// - Dark / Light Mode
// - Loading skeletons
// - Glass surface
// - Improved text contrast
//
// No Redux.
// No direct API requests.
//
// Props:
//
// - stats
// - isLoading
//
// Background is managed globally by App.jsx.
//
// =========================================================


// =========================================================
// STAT DEFINITIONS
//
// Values use the existing backend fields.
//
// Keep these keys unchanged.
// =========================================================

const STAT_DEFINITIONS = [
    {
        key: "total",
        title: "Jami",
        Icon: MessageSquareText,
        description: "Yuborgan feedbacklaringiz",
    },
    {
        key: "pending",
        title: "Kutilmoqda",
        Icon: Clock3,
        description: "Admin ko‘rib chiqishini kutmoqda",
    },
    {
        key: "in_progress",
        title: "Ishlanmoqda",
        Icon: Wrench,
        description: "Admin ishlashga olgan",
    },
    {
        key: "approved",
        title: "Tasdiqlangan",
        Icon: CheckCircle2,
        description: "Tasdiqlangan feedbacklar",
    },
    {
        key: "rejected",
        title: "Rad etilgan",
        Icon: XCircle,
        description: "Rad etilgan feedbacklar",
    },
    {
        key: "earned_fcoin",
        title: "Earned FCoin",
        Icon: Coins,
        description: "Feedback orqali topilgan",
    },
    {
        key: "approved_bugs",
        title: "Approved Bugs",
        Icon: Bug,
        description: "Tasdiqlangan bug reportlar",
    },
];


// =========================================================
// MAIN COMPONENT
// =========================================================

const FeedbackStatsSection = ({
    stats = null,
    isLoading = false,
}) => {

    // =====================================================
    // VALUES
    // =====================================================

    const loading = Boolean(isLoading);

    const safeStats =
        stats && typeof stats === "object"
            ? stats
            : {};


    // =====================================================
    // JSX
    // =====================================================

    return (
        <section
            aria-labelledby="feedback-stats-title"

            aria-busy={loading}

            className="
                relative
                isolate

                mt-8

                w-full
                min-w-0

                overflow-hidden

                rounded-[24px]

                border
                border-slate-200/90

                bg-white/[0.90]

                p-4

                shadow-[0_18px_55px_rgba(15,23,42,0.075)]

                backdrop-blur-xl

                sm:rounded-[28px]
                sm:p-6

                lg:p-7

                dark:border-white/[0.11]
                dark:bg-[#071426]/[0.90]

                dark:shadow-[0_24px_70px_rgba(0,0,0,0.24)]
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
                    -right-24
                    -top-28

                    h-64
                    w-64

                    rounded-full

                    bg-indigo-500/[0.08]

                    blur-[95px]

                    dark:bg-indigo-500/[0.12]
                "
            />

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    -bottom-28
                    left-[22%]

                    h-56
                    w-56

                    rounded-full

                    bg-cyan-500/[0.07]

                    blur-[95px]

                    dark:bg-cyan-400/[0.09]
                "
            />

            {/* ======================================
                TOP ACCENT
            ====================================== */}

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
                    via-indigo-500/40
                    to-transparent

                    dark:via-cyan-400/35
                "
            />

            {/* ======================================
                FOREGROUND CONTENT
            ====================================== */}

            <div
                className="
                    relative
                    z-10

                    min-w-0
                "
            >

                {/* ==================================
                    SECTION HEADER
                ================================== */}

                <div
                    className="
                        mb-6

                        flex
                        min-w-0

                        items-start
                        justify-between
                        gap-3

                        sm:mb-7
                    "
                >

                    {/* ==================================
                        SECTION TITLE
                    ================================== */}

                    <div className="min-w-0 flex-1">

                        <div
                            className="
                                mb-2

                                inline-flex
                                items-center
                                gap-2

                                rounded-full

                                border
                                border-indigo-400/25

                                bg-indigo-500/[0.07]

                                px-2.5
                                py-1

                                text-[9px]
                                font-bold
                                uppercase
                                tracking-[0.14em]

                                text-indigo-700

                                dark:border-cyan-400/20
                                dark:bg-cyan-400/[0.07]
                                dark:text-cyan-300
                            "
                        >
                            <span
                                className="
                                    h-1.5
                                    w-1.5
                                    rounded-full
                                    bg-indigo-500

                                    dark:bg-cyan-400
                                "
                            />

                            FEEDBACK ANALYTICS
                        </div>


                        <h2
                            id="feedback-stats-title"

                            className="
                                break-words

                                font-display
                                text-lg
                                font-black
                                tracking-tight

                                text-slate-900

                                sm:text-xl

                                dark:text-white
                            "
                        >
                            Mening statistikam
                        </h2>


                        <p
                            className="
                                mt-1

                                max-w-2xl

                                text-[12px]
                                font-medium
                                leading-6

                                text-slate-600

                                dark:text-slate-300
                            "
                        >
                            Feedback faoliyatingiz,
                            moderatsiya jarayoni va
                            FCoin natijalari.
                        </p>

                    </div>


                    {/* ==================================
                        GIFT ICON
                    ================================== */}

                    <div
                        className="
                            grid
                            h-11
                            w-11
                            shrink-0

                            place-items-center

                            rounded-2xl

                            border
                            border-amber-400/35

                            bg-amber-500/[0.10]

                            text-amber-700

                            shadow-sm

                            sm:h-12
                            sm:w-12

                            dark:border-amber-400/25
                            dark:bg-amber-400/[0.09]
                            dark:text-amber-300
                        "
                    >
                        <Gift
                            size={21}
                            strokeWidth={1.9}
                            aria-hidden="true"
                        />
                    </div>

                </div>


                {/* ======================================
                    RESPONSIVE STATISTICS GRID

                    Mobile:
                        1 column

                    Small tablet:
                        2 columns

                    Tablet / laptop:
                        3 columns

                    Desktop:
                        4 columns

                    Avoids squeezing seven cards
                    into a single row.
                ====================================== */}

                <div
                    className="
                        grid

                        w-full
                        min-w-0

                        grid-cols-1

                        gap-3

                        sm:grid-cols-2

                        md:grid-cols-3

                        xl:grid-cols-4

                        lg:gap-4
                    "
                >
                    {STAT_DEFINITIONS.map((definition) => {
                        const value =
                            safeStats[definition.key] ?? 0;

                        return (
                            <FeedbackStatCard
                                key={definition.key}

                                title={definition.title}

                                value={value}

                                Icon={definition.Icon}

                                description={
                                    definition.description
                                }

                                isLoading={loading}
                            />
                        );
                    })}
                </div>

            </div>

        </section>
    );
};


// =========================================================
// EXPORT
// =========================================================

export default React.memo(
    FeedbackStatsSection
);
