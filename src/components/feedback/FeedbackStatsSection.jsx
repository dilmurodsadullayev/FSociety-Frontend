
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
// - User feedback statistics
// - Seven existing stat cards
// - Responsive grid
// - Dark / Light Mode
// - Loading skeletons
//
// No Redux.
// No direct API requests.
//
// Props:
// - stats
// - isLoading
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
                mt-8

                w-full
                min-w-0
            "
        >
            {/* ======================================
                SECTION HEADER
            ====================================== */}

            <div
                className="
                    mb-5

                    flex
                    min-w-0

                    items-start
                    justify-between
                    gap-3
                "
            >
                {/* ==================================
                    SECTION TITLE
                ================================== */}

                <div className="min-w-0 flex-1">

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

                            dark:text-gray-400
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
                        h-10
                        w-10
                        shrink-0

                        place-items-center

                        rounded-xl
                        border
                        border-amber-400/25

                        bg-amber-500/[0.07]

                        text-amber-700

                        dark:border-amber-400/15
                        dark:bg-amber-400/[0.06]
                        dark:text-amber-300
                    "
                >
                    <Gift
                        size={19}
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
        </section>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(
    FeedbackStatsSection
);
