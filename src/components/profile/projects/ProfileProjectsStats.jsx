
import React, { memo, useMemo } from "react";

import {
    Eye,
    FolderKanban,
    MessageCircle,
    Star,
} from "lucide-react";

// =========================================================
// CONSTANTS
// =========================================================

const EMPTY_PROJECTS = [];

const DEFAULT_STATS = {
    total: 0,
    stars: 0,
    views: 0,
    comments: 0,
};

// =========================================================
// NUMBER HELPERS
// =========================================================

const safeNumber = (value, fallback = 0) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return fallback;
    }

    const parsed = Number(value);

    if (
        !Number.isFinite(parsed) ||
        parsed < 0
    ) {
        return fallback;
    }

    return parsed;
};

const formatNumber = (value) => {
    return new Intl.NumberFormat("uz-UZ").format(
        safeNumber(value)
    );
};

// =========================================================
// LEGACY STATISTICS
//
// Compatibility with older ProfileProjects.
//
// Important:
// This fallback uses only the provided projects.
// For paginated profiles, backend stats must be used.
// =========================================================

const calculateLegacyStats = (projects) => {
    const list = Array.isArray(projects)
        ? projects
        : EMPTY_PROJECTS;

    return {
        total: list.length,

        stars: list.reduce(
            (sum, project) =>
                sum +
                safeNumber(project?.stars_count),
            0
        ),

        views: list.reduce(
            (sum, project) =>
                sum +
                safeNumber(project?.views_count),
            0
        ),

        comments: list.reduce(
            (sum, project) =>
                sum +
                safeNumber(project?.comments_count),
            0
        ),
    };
};

// =========================================================
// STAT CONFIGURATION
// =========================================================

const STAT_ITEMS = [
    {
        key: "total",
        label: "Jami loyihalar",
        description: "Portfolio loyihalari",
        icon: FolderKanban,

        iconClass:
            "text-indigo-600 dark:text-indigo-300",

        iconBackground:
            "border-indigo-200 bg-indigo-50 " +
            "dark:border-indigo-400/15 " +
            "dark:bg-indigo-500/[0.09]",

        accentClass:
            "bg-indigo-500 dark:bg-indigo-400",
    },
    {
        key: "stars",
        label: "Starlar",
        description: "Olingan yulduzlar",
        icon: Star,

        iconClass:
            "text-amber-600 dark:text-amber-300",

        iconBackground:
            "border-amber-200 bg-amber-50 " +
            "dark:border-amber-400/15 " +
            "dark:bg-amber-500/[0.09]",

        accentClass:
            "bg-amber-500 dark:bg-amber-400",
    },
    {
        key: "views",
        label: "Ko‘rishlar",
        description: "Loyiha ko‘rishlari",
        icon: Eye,

        iconClass:
            "text-cyan-600 dark:text-cyan-300",

        iconBackground:
            "border-cyan-200 bg-cyan-50 " +
            "dark:border-cyan-400/15 " +
            "dark:bg-cyan-500/[0.09]",

        accentClass:
            "bg-cyan-500 dark:bg-cyan-400",
    },
    {
        key: "comments",
        label: "Izohlar",
        description: "Loyalarga yozilgan izohlar",
        icon: MessageCircle,

        iconClass:
            "text-emerald-600 dark:text-emerald-300",

        iconBackground:
            "border-emerald-200 bg-emerald-50 " +
            "dark:border-emerald-400/15 " +
            "dark:bg-emerald-500/[0.09]",

        accentClass:
            "bg-emerald-500 dark:bg-emerald-400",
    },
];

// =========================================================
// PROFILE PROJECT STAT CARD
// =========================================================

const ProfileProjectStatCard = memo(
    function ProfileProjectStatCard({
        icon: Icon,
        label,
        description,
        value,
        iconClass,
        iconBackground,
        accentClass,
    }) {
        return (
            <article
                className="
                    group
                    relative
                    min-w-0
                    overflow-hidden

                    rounded-2xl
                    border
                    border-slate-200

                    bg-white/90
                    p-4

                    shadow-sm

                    transition-all
                    duration-200

                    hover:-translate-y-0.5
                    hover:border-slate-300
                    hover:shadow-md

                    dark:border-white/[0.07]
                    dark:bg-[#0d131d]/90
                    dark:shadow-none

                    dark:hover:border-white/[0.12]
                    dark:hover:bg-[#111925]

                    motion-reduce:transform-none

                    sm:p-5
                "
            >
                {/* =====================================
                    TOP ACCENT
                ====================================== */}

                <div
                    aria-hidden="true"
                    className={`
                        absolute
                        inset-x-0
                        top-0

                        h-[2px]
                        opacity-70

                        ${accentClass}
                    `}
                />

                {/* =====================================
                    CARD HEADER
                ====================================== */}

                <div
                    className="
                        flex
                        min-w-0

                        items-start
                        justify-between
                        gap-3
                    "
                >
                    <div className="min-w-0">
                        <p
                            className="
                                text-[11px]
                                font-bold
                                leading-5

                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            {label}
                        </p>

                        <p
                            className="
                                mt-1

                                text-[10px]
                                font-medium
                                leading-4

                                text-slate-400
                                dark:text-slate-500
                            "
                        >
                            {description}
                        </p>
                    </div>

                    <div
                        aria-hidden="true"
                        className={`
                            flex
                            h-10
                            w-10
                            shrink-0

                            items-center
                            justify-center

                            rounded-xl
                            border

                            ${iconBackground}
                        `}
                    >
                        <Icon
                            size={19}
                            strokeWidth={2}
                            className={iconClass}
                        />
                    </div>
                </div>

                {/* =====================================
                    STATISTIC VALUE
                ====================================== */}

                <div className="mt-3">
                    <strong
                        className="
                            block

                            text-2xl
                            font-black
                            leading-tight
                            tracking-tight
                            tabular-nums

                            text-slate-900
                            dark:text-white

                            sm:text-[28px]
                        "
                    >
                        {formatNumber(value)}
                    </strong>
                </div>

                {/* =====================================
                    DECORATIVE BACKGROUND
                ====================================== */}

                <div
                    aria-hidden="true"
                    className={`
                        pointer-events-none

                        absolute
                        -bottom-14
                        -right-12

                        h-28
                        w-28

                        rounded-full

                        opacity-[0.04]
                        blur-2xl

                        ${accentClass}
                    `}
                />
            </article>
        );
    }
);

// =========================================================
// PROFILE PROJECTS STATS
//
// Props:
//
// stats:
//   Authoritative backend statistics.
//
// projects:
//   Legacy fallback for non-paginated consumers.
//
// totalCount:
//   Optional fallback for total projects.
//
// Important:
//
// Always prefer backend stats when supplied.
// Never calculate paginated profile statistics
// from the current four visible projects.
// =========================================================

const ProfileProjectsStats = ({
    stats,
    projects = EMPTY_PROJECTS,
    totalCount,
    className = "",
}) => {
    // =====================================================
    // RESOLVE STATS
    // =====================================================

    const resolvedStats = useMemo(() => {
        const legacy =
            calculateLegacyStats(projects);

        const hasServerStats =
            stats &&
            typeof stats === "object" &&
            !Array.isArray(stats);

        if (!hasServerStats) {
            return {
                ...legacy,

                total:
                    totalCount != null
                        ? safeNumber(
                              totalCount,
                              legacy.total
                          )
                        : legacy.total,
            };
        }

        // Server values are authoritative.
        // Zero is a valid statistic.

        return {
            total: safeNumber(
                stats.total,
                totalCount != null
                    ? safeNumber(totalCount)
                    : DEFAULT_STATS.total
            ),

            stars: safeNumber(
                stats.stars,
                DEFAULT_STATS.stars
            ),

            views: safeNumber(
                stats.views,
                DEFAULT_STATS.views
            ),

            comments: safeNumber(
                stats.comments,
                DEFAULT_STATS.comments
            ),
        };
    }, [
        stats,
        projects,
        totalCount,
    ]);

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <section
            aria-label="Profil loyihalari statistikasi"
            className={`
                grid
                min-w-0

                grid-cols-2
                gap-3

                xl:grid-cols-4

                ${className}
            `}
        >
            {STAT_ITEMS.map((item) => (
                <ProfileProjectStatCard
                    key={item.key}
                    icon={item.icon}
                    label={item.label}
                    description={item.description}
                    value={
                        resolvedStats[item.key]
                    }
                    iconClass={item.iconClass}
                    iconBackground={
                        item.iconBackground
                    }
                    accentClass={item.accentClass}
                />
            ))}
        </section>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfileProjectsStats);
