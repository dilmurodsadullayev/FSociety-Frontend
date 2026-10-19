
import React, { memo } from "react";

import {
    Link,
} from "react-router-dom";

import {
    ArrowRight,
    Eye,
    GitFork,
    MessageCircle,
    Star,
} from "lucide-react";

// =========================================================
// SAFE COUNT
//
// Prevents NaN and negative display values.
// =========================================================

const safeCount = (value) => {
    const number = Number(value ?? 0);

    return Number.isFinite(number)
        ? Math.max(0, number)
        : 0;
};

// =========================================================
// FOOTER STAT
//
// Reusable icon + counter.
//
// Props:
// - icon
// - title
// - value
// - className
// =========================================================

const FooterStat = memo(function FooterStat({
    icon: Icon,
    title,
    value,
    className = "",
}) {
    const count = safeCount(value);

    return (
        <span
            title={title}
            aria-label={`${title}: ${count}`}
            className={`
                inline-flex
                items-center
                gap-1.5

                ${className}
            `}
        >
            <Icon
                size={16}
                aria-hidden="true"
            />

            {count.toLocaleString()}
        </span>
    );
});

// =========================================================
// PROFILE PROJECT CARD FOOTER
//
// Original counters:
//
// - stars_count
// - collaborations_count
// - comments_count
// - views_count
//
// Original detail route:
//
// /project/:id/detail
//
// No Redux/API dependencies.
// =========================================================

const ProfileProjectCardFooter = ({
    project,
}) => {
    // =====================================================
    // PROJECT DETAIL
    // =====================================================

    const projectId = project?.id;

    const hasDetail =
        projectId !== undefined &&
        projectId !== null &&
        projectId !== "";

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <footer
            className="
                mt-5

                flex
                min-w-0
                flex-wrap

                items-center
                justify-between

                gap-4

                border-t
                border-slate-200

                pt-4

                dark:border-white/10
            "
        >
            {/* =====================================
                PROJECT STATISTICS
            ====================================== */}

            <div
                className="
                    flex
                    min-w-0
                    flex-wrap

                    items-center
                    gap-3

                    text-sm
                    font-bold
                "
            >
                {/* STARS */}

                <FooterStat
                    icon={Star}
                    title="Yulduzlar"
                    value={project?.stars_count}
                    className="
                        text-amber-700
                        dark:text-yellow-300
                    "
                />

                {/* COLLABORATIONS */}

                <FooterStat
                    icon={GitFork}
                    title="Collaborations"
                    value={
                        project?.collaborations_count
                    }
                    className="
                        text-purple-700
                        dark:text-purple-300
                    "
                />

                {/* COMMENTS */}

                <FooterStat
                    icon={MessageCircle}
                    title="Izohlar"
                    value={project?.comments_count}
                    className="
                        text-emerald-700
                        dark:text-emerald-300
                    "
                />

                {/* VIEWS */}

                <FooterStat
                    icon={Eye}
                    title="Ko‘rishlar"
                    value={project?.views_count}
                    className="
                        text-cyan-700
                        dark:text-cyan-300
                    "
                />
            </div>

            {/* =====================================
                PROJECT DETAIL LINK

                Prevents /project/undefined/detail
                if an incomplete object is received.
            ====================================== */}

            {hasDetail && (
                <Link
                    to={`/project/${projectId}/detail`}
                    className="
                        inline-flex
                        min-h-9

                        items-center
                        gap-2

                        rounded-2xl
                        border

                        border-indigo-300
                        bg-indigo-50

                        px-4
                        py-2

                        text-xs
                        font-black
                        text-indigo-700

                        transition-colors

                        hover:bg-indigo-100

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-indigo-500/50

                        dark:border-indigo-400/20
                        dark:bg-indigo-500/10
                        dark:text-indigo-300

                        dark:hover:bg-indigo-500/20
                    "
                >
                    Batafsil

                    <ArrowRight
                        size={14}
                        aria-hidden="true"
                        className="
                            transition-transform

                            group-hover:translate-x-1

                            motion-reduce:transform-none
                        "
                    />
                </Link>
            )}
        </footer>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfileProjectCardFooter);
