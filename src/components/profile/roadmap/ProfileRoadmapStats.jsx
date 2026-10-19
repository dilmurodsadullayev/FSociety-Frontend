
import React, { memo, useMemo } from "react";

// =========================================================
// CONSTANTS
// =========================================================

const EMPTY_ROADMAPS = [];

// =========================================================
// STAT CONFIG
//
// Original labels:
//
// - Jami
// - Learning
// - Experience
// - Yakunlangan
//
// Light and Dark Mode supported.
// =========================================================

const STAT_ITEMS = [
    {
        key: "total",
        label: "Jami",
        valueClass: `
            text-slate-900
            dark:text-white
        `,
        cardClass: `
            border-slate-200
            bg-slate-50

            dark:border-white/[0.08]
            dark:bg-black/15
        `,
    },
    {
        key: "learning",
        label: "Learning",
        valueClass: `
            text-indigo-700
            dark:text-indigo-300
        `,
        cardClass: `
            border-indigo-200
            bg-indigo-50

            dark:border-indigo-400/[0.12]
            dark:bg-indigo-500/[0.05]
        `,
    },
    {
        key: "experience",
        label: "Experience",
        valueClass: `
            text-emerald-700
            dark:text-emerald-300
        `,
        cardClass: `
            border-emerald-200
            bg-emerald-50

            dark:border-emerald-400/[0.12]
            dark:bg-emerald-500/[0.05]
        `,
    },
    {
        key: "completed",
        label: "Yakunlangan",
        valueClass: `
            text-violet-700
            dark:text-violet-300
        `,
        cardClass: `
            border-violet-200
            bg-violet-50

            dark:border-violet-400/[0.12]
            dark:bg-violet-500/[0.05]
        `,
    },
];

// =========================================================
// STAT CARD
//
// Only responsible for rendering one statistic.
// =========================================================

const RoadmapStatCard = memo(function RoadmapStatCard({
    label,
    value,
    valueClass,
    cardClass,
}) {
    return (
        <div
            className={`
                min-w-0

                rounded-xl
                border

                px-3
                py-2.5

                transition-colors
                duration-200

                ${cardClass}
            `}
        >
            {/* STAT LABEL */}

            <p
                className="
                    truncate

                    text-[9px]
                    font-black

                    uppercase
                    tracking-wider

                    text-slate-500
                    dark:text-slate-400
                "
                title={label}
            >
                {label}
            </p>

            {/* STAT VALUE */}

            <p
                className={`
                    mt-1
                    text-sm
                    font-black
                    tabular-nums

                    ${valueClass}
                `}
            >
                {value.toLocaleString()}
            </p>
        </div>
    );
});

// =========================================================
// PROFILE ROADMAP STATS
//
// Props:
//
// roadmaps:
//   Roadmap list returned from Redux / backend.
//
// Original counting logic:
//
// total:
//   Every roadmap.
//
// learning:
//   type === "learning"
//
// experience:
//   type === "experience"
//
// completed:
//   Boolean(finished_at)
//
// This component doesn't make API requests.
// =========================================================

const ProfileRoadmapStats = ({
    roadmaps = EMPTY_ROADMAPS,
}) => {
    // =====================================================
    // SAFE ROADMAPS
    // =====================================================

    const safeRoadmaps = Array.isArray(roadmaps)
        ? roadmaps
        : EMPTY_ROADMAPS;

    // =====================================================
    // CALCULATE STATISTICS
    // =====================================================

    const stats = useMemo(() => {
        const result = {
            total: safeRoadmaps.length,
            learning: 0,
            experience: 0,
            completed: 0,
        };

        for (const roadmap of safeRoadmaps) {
            if (roadmap?.type === "learning") {
                result.learning += 1;
            }

            if (roadmap?.type === "experience") {
                result.experience += 1;
            }

            if (Boolean(roadmap?.finished_at)) {
                result.completed += 1;
            }
        }

        return result;
    }, [safeRoadmaps]);

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <section
            aria-label="Yo‘l xaritasi statistikasi"
            className="
                relative
                z-10

                mt-5

                grid
                min-w-0
                grid-cols-2
                gap-2

                sm:grid-cols-4
            "
        >
            {STAT_ITEMS.map((item) => (
                <RoadmapStatCard
                    key={item.key}
                    label={item.label}
                    value={stats[item.key]}
                    valueClass={item.valueClass}
                    cardClass={item.cardClass}
                />
            ))}
        </section>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfileRoadmapStats);
