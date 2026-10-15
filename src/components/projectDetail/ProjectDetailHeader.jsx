
import React from "react";

import {
    Eye,
    Loader2,
    MessageCircle,
    Rocket,
    Star,
} from "lucide-react";

// =========================================================
// EXISTING COMPONENTS
// =========================================================

import ProjectGallery from "../projects/ProjectGallery";

import PromotionBadge from "../promotions/PromotionBadge";

// =========================================================
// NEW COMPONENTS
// =========================================================

import ProjectDetailOwnerControls from "./ProjectDetailOwnerControls";

// =========================================================
// HELPERS
// =========================================================

import {
    safeNumber,
} from "./projectDetailHelpers";

// =========================================================
// FSOCIETY — PROJECT DETAIL HEADER
//
// Features:
// - Dark / Light Mode
// - Responsive layout
// - Project title / description
// - Promotion badge
// - Owner edit / delete controls
// - Star / Unstar button
// - Star / View / Comment counters
// - Existing project gallery
//
// IMPORTANT:
// All API and Redux logic stays in the controller.
// This component only renders data and callbacks.
// =========================================================

// =========================================================
// STAT PILL
// =========================================================

const STAT_TONES = {
    default: {
        icon: `
            text-slate-600
            dark:text-gray-300
        `,
    },

    yellow: {
        icon: `
            text-amber-600
            dark:text-yellow-300
        `,
    },

    cyan: {
        icon: `
            text-cyan-700
            dark:text-cyan-300
        `,
    },

    indigo: {
        icon: `
            text-indigo-700
            dark:text-indigo-300
        `,
    },
};

const StatPill = React.memo(({
    icon: Icon,
    label,
    value,
    tone = "default",
}) => {
    const colors =
        STAT_TONES[tone] ||
        STAT_TONES.default;

    return (
        <div
            title={`${value} ${label}`}

            className="
                inline-flex
                min-h-11
                max-w-full
                items-center
                gap-2

                rounded-xl
                border
                border-[#dce5f0]

                bg-white/80

                px-3
                py-2.5

                text-[11px]
                font-bold

                shadow-[0_4px_14px_rgba(15,23,42,0.025)]

                sm:px-3.5
                sm:text-xs

                dark:border-white/[0.08]
                dark:bg-white/[0.035]
                dark:shadow-none
            "
        >
            {/* ICON */}

            <Icon
                size={16}
                strokeWidth={2}

                aria-hidden="true"

                className={`
                    shrink-0

                    ${colors.icon}
                `}
            />

            {/* VALUE */}

            <span
                className="
                    font-black
                    tabular-nums

                    text-slate-900

                    dark:text-gray-100
                "
            >
                {value}
            </span>

            {/* LABEL */}

            <span
                className="
                    text-slate-500

                    dark:text-gray-500
                "
            >
                {label}
            </span>
        </div>
    );
});

// =========================================================
// PROJECT STAR BUTTON
// =========================================================

const ProjectStarButton = React.memo(({
    isStarred = false,
    isLoading = false,
    isDeleting = false,
    onToggle,
}) => {
    // =====================================================
    // STATE
    // =====================================================

    const starred = Boolean(isStarred);

    const loading = Boolean(isLoading);

    const disabled =
        loading ||
        Boolean(isDeleting) ||
        typeof onToggle !== "function";

    // =====================================================
    // JSX
    // =====================================================

    return (
        <button
            type="button"

            onClick={onToggle}

            disabled={disabled}

            aria-label={
                starred
                    ? "Loyihadan starni olib tashlash"
                    : "Loyihaga star berish"
            }

            aria-pressed={starred}

            aria-busy={loading}

            title={
                starred
                    ? "Starni olib tashlash"
                    : "Loyihaga star berish"
            }

            className={`
                group/star

                relative

                inline-flex
                min-h-11
                max-w-full

                items-center
                justify-center

                gap-2

                rounded-xl
                border

                px-3.5
                py-2.5

                text-[12px]
                font-black

                transition-colors
                duration-150

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-amber-500

                disabled:cursor-not-allowed
                disabled:opacity-60

                ${
                    starred
                        ? `
                            border-amber-400/45
                            bg-amber-500/[0.12]

                            text-amber-800

                            hover:bg-amber-500/[0.17]

                            dark:border-yellow-400/30
                            dark:bg-yellow-500/[0.10]
                            dark:text-yellow-200

                            dark:hover:bg-yellow-500/[0.15]
                        `
                        : `
                            border-[#dce5f0]
                            bg-white/80

                            text-slate-600

                            hover:border-amber-400/45
                            hover:bg-amber-500/[0.08]
                            hover:text-amber-700

                            dark:border-white/[0.08]
                            dark:bg-white/[0.035]
                            dark:text-gray-400

                            dark:hover:border-yellow-400/25
                            dark:hover:bg-yellow-500/[0.06]
                            dark:hover:text-yellow-300
                        `
                }
            `}
        >
            {/* ======================================
                ICON / LOADING
            ====================================== */}

            {loading ? (
                <Loader2
                    size={17}
                    strokeWidth={2}
                    aria-hidden="true"

                    className="
                        shrink-0
                        animate-spin

                        motion-reduce:animate-none
                    "
                />
            ) : (
                <Star
                    size={17}
                    strokeWidth={2}

                    aria-hidden="true"

                    fill={
                        starred
                            ? "currentColor"
                            : "none"
                    }

                    className="
                        shrink-0

                        transition-transform
                        duration-150

                        group-hover/star:scale-110

                        motion-reduce:transform-none
                    "
                />
            )}

            {/* ======================================
                LABEL
            ====================================== */}

            <span>
                {loading
                    ? "Saqlanmoqda..."
                    : starred
                        ? "Starred"
                        : "Star berish"}
            </span>

            {/* ======================================
                STARRED INDICATOR
            ====================================== */}

            {starred && !loading && (
                <span
                    aria-hidden="true"

                    className="
                        absolute
                        -right-1
                        -top-1

                        h-2.5
                        w-2.5

                        rounded-full

                        bg-amber-400

                        ring-2
                        ring-white

                        dark:bg-yellow-300
                        dark:ring-[#0b1018]
                    "
                />
            )}
        </button>
    );
});

// =========================================================
// MAIN COMPONENT
// =========================================================

const ProjectDetailHeader = ({
    // Project data
    projectData,
    projectTitle,
    projectImages = [],

    // Promotion
    isPromoted = false,
    promotionExpiresAt = null,

    // Owner
    isOwner = false,
    isUpdating = false,
    isDeleting = false,

    // Star
    isStarred = false,
    isStarLoading = false,

    // Actions
    onStarToggle,
    onEdit,
    onDelete,
}) => {
    // =====================================================
    // PROJECT INFORMATION
    // =====================================================

    const title =
        projectTitle ||
        projectData?.name ||
        projectData?.title ||
        "Noma’lum loyiha";

    const description =
        projectData?.description ||
        "Ushbu loyiha uchun hali to‘liq tavsif kiritilmagan.";

    // =====================================================
    // PROJECT IMAGES
    // =====================================================

    const images = Array.isArray(projectImages)
        ? projectImages
        : [];

    // =====================================================
    // STATISTICS
    // =====================================================

    const starsCount = safeNumber(
        projectData?.stars_count
    );

    const viewsCount = safeNumber(
        projectData?.views_count
    );

    const commentsCount = safeNumber(
        projectData?.comments_count
    );

    const formatCount = (value) => {
        return value.toLocaleString("uz-UZ");
    };

    // =====================================================
    // JSX
    // =====================================================

    return (
        <header
            className="
                relative
                min-w-0

                border-b
                border-[#e0e7f1]

                p-4

                sm:p-6

                lg:p-8

                xl:p-10

                dark:border-white/[0.07]
            "
        >
            {/* ======================================
                HEADER CONTENT
            ====================================== */}

            <div
                className="
                    flex
                    min-w-0
                    flex-col

                    gap-6

                    xl:flex-row
                    xl:items-start
                    xl:justify-between
                "
            >
                {/* ==================================
                    LEFT — TITLE AREA
                ================================== */}

                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >
                    {/* PROJECT SHOWCASE BADGE */}

                    <div
                        className="
                            mb-4

                            inline-flex
                            max-w-full
                            items-center
                            gap-2

                            rounded-full
                            border
                            border-indigo-400/30

                            bg-indigo-500/[0.07]

                            px-3
                            py-1.5

                            font-mono
                            text-[10px]
                            font-black
                            uppercase
                            tracking-[0.12em]

                            text-indigo-700

                            sm:px-3.5

                            dark:border-indigo-400/25
                            dark:bg-indigo-500/[0.08]
                            dark:text-indigo-300
                        "
                    >
                        <Rocket
                            size={14}
                            strokeWidth={2}
                            aria-hidden="true"
                            className="shrink-0"
                        />

                        <span className="truncate">
                            Project showcase
                        </span>
                    </div>

                    {/* ==================================
                        PROMOTION BADGE
                    ================================== */}

                    {isPromoted && (
                        <div
                            className="
                                mb-4

                                flex
                                min-w-0
                                flex-wrap
                                items-center
                                gap-2
                            "
                        >
                            <PromotionBadge
                                isPromoted={isPromoted}

                                expiresAt={
                                    promotionExpiresAt
                                }

                                showTimer
                            />
                        </div>
                    )}

                    {/* ==================================
                        TITLE
                    ================================== */}

                    <h1
                        className="
                            max-w-5xl

                            break-words
                            [overflow-wrap:anywhere]

                            text-[28px]
                            font-black
                            leading-[1.12]
                            tracking-[-0.045em]

                            text-slate-900

                            sm:text-[38px]

                            lg:text-[44px]

                            xl:text-[54px]

                            dark:text-white
                        "
                    >
                        {title}
                    </h1>

                    {/* ==================================
                        DESCRIPTION
                    ================================== */}

                    <p
                        className="
                            mt-4
                            max-w-4xl

                            whitespace-pre-wrap
                            break-words
                            [overflow-wrap:anywhere]

                            text-[13px]
                            font-medium
                            leading-7

                            text-slate-600

                            sm:text-sm
                            sm:leading-8

                            dark:text-gray-400
                        "
                    >
                        {description}
                    </p>
                </div>

                {/* ==================================
                    RIGHT — OWNER CONTROLS
                ================================== */}

                {isOwner && (
                    <div
                        className="
                            min-w-0
                            shrink-0
                        "
                    >
                        <ProjectDetailOwnerControls
                            onEdit={onEdit}

                            onDelete={onDelete}

                            isUpdating={isUpdating}

                            isDeleting={isDeleting}
                        />
                    </div>
                )}
            </div>

            {/* ======================================
                PROJECT STATISTICS
            ====================================== */}

            <div
                role="group"
                aria-label="Loyiha statistikasi"

                className="
                    mt-7

                    flex
                    min-w-0
                    flex-wrap
                    items-center

                    gap-2.5
                "
            >
                {/* STAR BUTTON */}

                <ProjectStarButton
                    isStarred={isStarred}

                    isLoading={isStarLoading}

                    isDeleting={isDeleting}

                    onToggle={onStarToggle}
                />

                {/* STARS */}

                <StatPill
                    icon={Star}

                    value={formatCount(starsCount)}

                    label="star"

                    tone="yellow"
                />

                {/* VIEWS */}

                <StatPill
                    icon={Eye}

                    value={formatCount(viewsCount)}

                    label="ko‘rish"

                    tone="cyan"
                />

                {/* COMMENTS */}

                <StatPill
                    icon={MessageCircle}

                    value={formatCount(commentsCount)}

                    label="sharh"

                    tone="indigo"
                />
            </div>

            {/* ======================================
                PROJECT GALLERY
            ====================================== */}

            <ProjectGallery
                images={images}
                projectTitle={title}
            />
        </header>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(ProjectDetailHeader);
