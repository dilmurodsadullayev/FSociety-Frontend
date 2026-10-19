
// src/components/profile/projects/ProfileProjectsStats.jsx

import React, {
    memo,
    useMemo,
} from "react";

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
// IMPORTANT:
//
// This fallback calculates values only from the
// projects supplied to this component.
//
// Paginated profiles should provide backend stats.
// =========================================================

const calculateLegacyStats = (projects) => {
    const list = Array.isArray(projects)
        ? projects
        : EMPTY_PROJECTS;

    return {
        total: list.length,

        stars: list.reduce(
            (sum, project) =>
                sum + safeNumber(project?.stars_count),
            0
        ),

        views: list.reduce(
            (sum, project) =>
                sum + safeNumber(project?.views_count),
            0
        ),

        comments: list.reduce(
            (sum, project) =>
                sum + safeNumber(project?.comments_count),
            0
        ),
    };
};

// =========================================================
// STAT CONFIGURATION
//
// Existing:
// - Keys
// - Labels
// - Descriptions
// - Icons
// - Colors
//
// All preserved.
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
            "dark:border-indigo-400/20 " +
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
            "dark:border-amber-400/20 " +
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
            "dark:border-cyan-400/20 " +
            "dark:bg-cyan-500/[0.09]",

        accentClass:
            "bg-cyan-500 dark:bg-cyan-400",
    },
    {
        key: "comments",

        label: "Izohlar",

        description: "Loyihalarga yozilgan izohlar",

        icon: MessageCircle,

        iconClass:
            "text-emerald-600 dark:text-emerald-300",

        iconBackground:
            "border-emerald-200 bg-emerald-50 " +
            "dark:border-emerald-400/20 " +
            "dark:bg-emerald-500/[0.09]",

        accentClass:
            "bg-emerald-500 dark:bg-emerald-400",
    },
];

// =========================================================
// PROFILE PROJECT STAT CARD
//
// Compact layout inspired by Profile Posts.
//
// Layout:
//
// [ ICON ]  [ 7                  ]
//           [ JAMI LOYIHALAR     ]
//           [ Portfolio loyihalari ]
//
// Responsive:
// - Compact mobile cards
// - Comfortable desktop spacing
// - Long descriptions wrap safely
//
// No API or state logic.
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

                    flex

                    min-h-[98px]
                    min-w-0

                    items-center

                    overflow-hidden

                    rounded-2xl
                    border

                    border-slate-200

                    bg-white/90

                    p-3

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

                    sm:min-h-[100px]
                    sm:p-4

                    motion-reduce:transform-none
                    motion-reduce:transition-none
                "
            >
                {/* =========================================
                    DECORATIVE TOP ACCENT
                ========================================== */}

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

                {/* =========================================
                    SUBTLE BACKGROUND GLOW
                ========================================== */}

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

                {/* =========================================
                    HORIZONTAL CONTENT
                ========================================== */}

                <div
                    className="
                        relative
                        z-10

                        flex
                        w-full
                        min-w-0

                        items-center
                        gap-2.5

                        sm:gap-3.5
                    "
                >
                    {/* =====================================
                        ICON
                    ====================================== */}

                    <div
                        aria-hidden="true"
                        className={`
                            grid

                            h-10
                            w-10

                            shrink-0

                            place-items-center

                            rounded-xl
                            border

                            ${iconBackground}

                            sm:h-11
                            sm:w-11
                        `}
                    >
                        <Icon
                            size={19}
                            strokeWidth={2}
                            className={iconClass}
                        />
                    </div>

                    {/* =====================================
                        STATISTIC INFORMATION
                    ====================================== */}

                    <div
                        className="
                            flex
                            min-w-0
                            flex-1

                            flex-col
                            justify-center
                        "
                    >
                        {/* =============================
                            VALUE
                        ============================== */}

                        <strong
                            className="
                                block

                                min-w-0

                                break-words

                                text-[22px]
                                font-black

                                leading-none
                                tracking-tight
                                tabular-nums

                                text-slate-900
                                dark:text-white

                                sm:text-2xl
                            "
                        >
                            {formatNumber(value)}
                        </strong>

                        {/* =============================
                            LABEL
                        ============================== */}

                        <p
                            className="
                                mt-1.5

                                min-w-0

                                break-words

                                text-[9px]
                                font-black

                                uppercase
                                tracking-[0.04em]

                                leading-[1.35]

                                text-slate-600
                                dark:text-slate-300

                                sm:text-[10px]
                            "
                        >
                            {label}
                        </p>

                        {/* =============================
                            DESCRIPTION
                        ============================== */}

                        <p
                            className="
                                mt-0.5

                                min-w-0

                                break-words

                                text-[9px]
                                font-medium

                                leading-[1.4]

                                text-slate-400
                                dark:text-slate-500

                                sm:text-[10px]
                            "
                        >
                            {description}
                        </p>
                    </div>
                </div>
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
//   Legacy fallback for older consumers.
//
// totalCount:
//   Optional fallback for project total.
//
// className:
//   Additional grid styles from parent.
//
// IMPORTANT:
//
// Backend stats always take priority.
//
// A value of zero is valid.
//
// Do not calculate all-profile statistics from
// a single paginated page when backend stats exist.
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

        // =================================================
        // LEGACY FALLBACK
        // =================================================

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

        // =================================================
        // SERVER STATISTICS
        //
        // Backend values are authoritative.
        // Zero remains a valid value.
        // =================================================

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
    //
    // Mobile:
    // - 2 columns
    //
    // Large screens:
    // - 4 columns
    //
    // Cards match ProfilePosts statistics styling.
    // =====================================================

    return (
        <section
            aria-label="Profil loyihalari statistikasi"
            className={`
                grid

                w-full
                min-w-0

                grid-cols-2
                gap-2.5

                sm:gap-3

                xl:grid-cols-4

                ${className}
            `}
        >
            {STAT_ITEMS.map((item) => (
                <ProfileProjectStatCard
                    key={item.key}

                    icon={item.icon}

                    label={item.label}

                    description={
                        item.description
                    }

                    value={
                        resolvedStats[item.key]
                    }

                    iconClass={
                        item.iconClass
                    }

                    iconBackground={
                        item.iconBackground
                    }

                    accentClass={
                        item.accentClass
                    }
                />
            ))}
        </section>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfileProjectsStats);
