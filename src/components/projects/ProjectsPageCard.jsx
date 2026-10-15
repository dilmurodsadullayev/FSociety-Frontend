
import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import { Link } from "react-router-dom";

import {
    ArrowUpRight,
    Code2,
    Eye,
    FolderKanban,
    GitFork,
    Layers3,
    Star,
    Zap,
} from "lucide-react";

import {
    getUserAvatarUrl,
    handleUserImageError,
} from "../../utils/imageUtils";

import {formatPrettyDate} from '../../utils/formatDate'
import {
    formatCompactNumber,
    getProjectImageUrl,
    isProjectPromoted,
    safeNumber,
    truncateText,
} from "./projectHelpers";

// =========================================================
// FSOCIETY — PROJECTS PAGE CARD
//
// Features:
// - Dark / Light Mode
// - Responsive project preview
// - Image fallback
// - Promoted projects
// - Project statistics
// - Author profile
// - Creation date
// - Project title and main features
// - Project description
// - Colored technology stack
// - Collaboration count
// - Project detail navigation
//
// Backend contracts preserved.
// =========================================================

// =========================================================
// CONFIG
// =========================================================

const DEFAULT_STACK_COLOR = "#64748B";

const MAX_VISIBLE_STACK = 5;

// =========================================================
// COLOR VALIDATION
// =========================================================

const isValidHexColor = (value) => {
    return (
        typeof value === "string" &&
        /^#[0-9a-fA-F]{6}$/.test(value)
    );
};

// =========================================================
// SAFE STACK COLOR
// =========================================================

const getSafeColor = (value) => {
    return isValidHexColor(value)
        ? value
        : DEFAULT_STACK_COLOR;
};

// =========================================================
// HEX ALPHA
//
// Example:
// #3776AB + 25 -> #3776AB25
// =========================================================

const withAlpha = (color, alpha) => {
    return `${getSafeColor(color)}${alpha}`;
};

// =========================================================
// NORMALIZE STACK ITEM
//
// Supports:
// - String
// - Language object
// - Technology object
//
// Preserves:
// - id
// - name
// - type
// - color
// - iconKey
// =========================================================

const normalizeStackItem = (item, type) => {
    if (!item) {
        return null;
    }

    // ================================================
    // STRING
    // ================================================

    if (typeof item === "string") {
        const name = item.trim();

        if (!name) {
            return null;
        }

        return {
            id: `${type}-${name}`,
            name,
            type,
            color: DEFAULT_STACK_COLOR,
            iconKey: "",
        };
    }

    // ================================================
    // OBJECT
    // ================================================

    if (
        typeof item !== "object" ||
        Array.isArray(item)
    ) {
        return null;
    }

    const name = String(
        item.name || item.title || ""
    ).trim();

    if (!name) {
        return null;
    }

    return {
        id: item.id ?? `${type}-${name}`,
        name,
        type,
        color: getSafeColor(item.color),
        iconKey: String(
            item.icon_key || ""
        ).trim(),
    };
};

// =========================================================
// GET COLORED PROJECT STACK
//
// Priority:
// 1. Primary language
// 2. Primary technology
// 3. Additional languages
// 4. Additional technologies
//
// Duplicate names are removed.
// Original database colors are preserved.
// =========================================================

const getColoredProjectStack = (project) => {
    const result = [];

    const addedNames = new Set();

    const addItem = (value, type) => {
        if (Array.isArray(value)) {
            value.forEach((entry) => {
                addItem(entry, type);
            });

            return;
        }

        const normalized = normalizeStackItem(
            value,
            type
        );

        if (!normalized) {
            return;
        }

        const key = normalized.name
            .toLocaleLowerCase()
            .trim();

        if (addedNames.has(key)) {
            return;
        }

        addedNames.add(key);

        result.push(normalized);
    };

    // ================================================
    // PRIMARY LANGUAGE
    // ================================================

    addItem(
        project?.language_data,
        "language"
    );

    // ================================================
    // PRIMARY TECHNOLOGY
    // ================================================

    addItem(
        project?.technology_data,
        "technology"
    );

    // ================================================
    // ADDITIONAL LANGUAGES
    // ================================================

    addItem(
        project?.languages_data,
        "language"
    );

    // ================================================
    // ADDITIONAL TECHNOLOGIES
    // ================================================

    addItem(
        project?.technologies_data,
        "technology"
    );

    return result;
};

// =========================================================
// STACK BADGE
//
// Important:
// - Backend color controls the dot and tint.
// - Text remains readable in both themes.
// =========================================================

const StackBadge = React.memo(({ item }) => {
    const color = getSafeColor(
        item?.color
    );

    const title = item?.type === "language"
        ? `Dasturlash tili: ${item.name}`
        : `Texnologiya: ${item.name}`;

    return (
        <span
            title={title}

            style={{
                borderColor: withAlpha(color, "55"),
                backgroundColor: withAlpha(color, "13"),
            }}

            className="
                group/stack

                inline-flex
                min-w-0
                max-w-[128px]
                items-center
                gap-1.5

                rounded-lg
                border

                px-2
                py-1.5

                font-mono
                text-[9px]
                font-bold

                text-slate-700

                transition-transform
                duration-150

                hover:-translate-y-px

                dark:text-gray-200

                motion-reduce:transform-none
            "
        >
            {/* COLOR DOT */}

            <span
                aria-hidden="true"

                style={{
                    backgroundColor: color,
                    boxShadow: `0 0 7px ${withAlpha(
                        color,
                        "65"
                    )}`,
                }}

                className="
                    h-1.5
                    w-1.5
                    shrink-0

                    rounded-full

                    ring-1
                    ring-black/[0.08]

                    dark:ring-white/[0.08]
                "
            />

            {/* TECHNOLOGY NAME */}

            <span className="min-w-0 truncate">
                {item.name}
            </span>
        </span>
    );
});

// =========================================================
// PROJECT IMAGE
//
// Shows:
// - Original screenshot
// - Blurred background
// - Preview label
// - Fallback if image missing or broken
// =========================================================

const ProjectsPageCardImage = React.memo(({
    project,
}) => {
    // =====================================================
    // IMAGE DATA
    // =====================================================

    const firstImage = project?.images?.[0];

    const imageValue =
        typeof firstImage === "string"
            ? firstImage
            : (
                firstImage?.image ||
                firstImage?.url ||
                project?.image ||
                null
            );

    const imageUrl = getProjectImageUrl(
        imageValue
    );

    // =====================================================
    // IMAGE ERROR
    // =====================================================

    const [
        imageFailed,
        setImageFailed,
    ] = useState(false);

    // Reset fallback when a different image arrives.
    useEffect(() => {
        setImageFailed(false);
    }, [imageUrl]);

    // =====================================================
    // FALLBACK PREVIEW
    // =====================================================

    if (!imageUrl || imageFailed) {
        return (
            <div
                className="
                    relative

                    flex
                    h-[170px]
                    w-full
                    shrink-0

                    items-center
                    justify-center

                    overflow-hidden

                    border-b
                    border-[#e2e8f0]

                    bg-gradient-to-br
                    from-[#edf5fd]
                    via-[#f6f9fe]
                    to-[#e8effa]

                    md:h-[180px]

                    dark:border-white/[0.06]
                    dark:from-[#080d14]
                    dark:via-[#0b111b]
                    dark:to-[#101a2a]
                "
            >
                {/* DECORATIVE GRID */}

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute
                        inset-0

                        opacity-[0.035]

                        text-slate-800

                        [background-image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)]
                        [background-size:22px_22px]

                        dark:opacity-[0.045]
                        dark:text-cyan-300
                    "
                />

                {/* SOFT GLOW */}

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute

                        left-1/2
                        top-1/2

                        h-32
                        w-32

                        -translate-x-1/2
                        -translate-y-1/2

                        rounded-full

                        bg-cyan-500/[0.10]
                        blur-3xl

                        dark:bg-cyan-400/[0.07]
                    "
                />

                {/* FALLBACK ICON */}

                <div
                    className="
                        relative
                        z-10

                        grid
                        h-16
                        w-16

                        place-items-center

                        rounded-2xl
                        border
                        border-cyan-400/25

                        bg-white/75

                        text-cyan-700

                        shadow-[0_8px_25px_rgba(30,41,59,0.05)]

                        dark:border-cyan-400/15
                        dark:bg-cyan-500/[0.06]
                        dark:text-cyan-300/70
                        dark:shadow-none
                    "
                >
                    <FolderKanban
                        size={27}
                        strokeWidth={1.6}
                        aria-hidden="true"
                    />
                </div>

                {/* FALLBACK LABEL */}

                <span
                    className="
                        absolute
                        bottom-3
                        left-3
                        z-20

                        font-mono
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.12em]

                        text-slate-500

                        dark:text-gray-600
                    "
                >
                    preview://unavailable
                </span>
            </div>
        );
    }

    // =====================================================
    // IMAGE PREVIEW
    // =====================================================

    return (
        <div
            className="
                relative

                h-[170px]
                w-full
                shrink-0

                overflow-hidden

                border-b
                border-[#e2e8f0]

                bg-[#e8eef7]

                md:h-[180px]

                dark:border-white/[0.06]
                dark:bg-[#070a0f]
            "
        >
            {/* BLURRED BACKGROUND */}

            <img
                src={imageUrl}
                alt=""
                aria-hidden="true"

                loading="lazy"
                decoding="async"

                className="
                    pointer-events-none
                    absolute
                    inset-0

                    h-full
                    w-full

                    scale-110
                    object-cover

                    opacity-20
                    blur-2xl

                    dark:opacity-[0.18]
                "
            />

            {/* BACKGROUND OVERLAY */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-0

                    bg-white/20

                    dark:bg-[#080b10]/45
                "
            />

            {/* MAIN SCREENSHOT */}

            <img
                src={imageUrl}

                alt={
                    project?.name
                        ? `${project.name} loyiha rasmi`
                        : "Loyiha rasmi"
                }

                loading="lazy"
                decoding="async"

                onError={() => {
                    setImageFailed(true);
                }}

                className="
                    relative
                    z-10

                    h-full
                    w-full

                    object-contain

                    p-2

                    transition-transform
                    duration-300

                    group-hover/project-card:scale-[1.015]

                    md:p-3

                    motion-reduce:transform-none
                "
            />

            {/* TOP GRADIENT */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-x-0
                    top-0
                    z-20

                    h-10

                    bg-gradient-to-b
                    from-black/10
                    to-transparent

                    dark:from-black/30
                "
            />

            {/* BOTTOM GRADIENT */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-x-0
                    bottom-0
                    z-20

                    h-12

                    bg-gradient-to-t
                    from-black/15
                    to-transparent

                    dark:from-black/35
                "
            />

            {/* PREVIEW LABEL */}

            <span
                className="
                    pointer-events-none
                    absolute
                    bottom-2.5
                    left-3
                    z-30

                    rounded-md
                    border

                    border-white/30
                    bg-white/80

                    px-2
                    py-1

                    font-mono
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.1em]

                    text-slate-700

                    backdrop-blur-md

                    dark:border-white/10
                    dark:bg-black/55
                    dark:text-white/70
                "
            >
                project.preview
            </span>
        </div>
    );
});

// =========================================================
// PROJECTS PAGE CARD
// =========================================================

const ProjectsPageCard = ({
    project,
    index = 0,
}) => {
    // =====================================================
    // STACK
    // =====================================================

    const fullStack = useMemo(() => {
        return getColoredProjectStack(
            project
        );
    }, [project]);

    const visibleStack = fullStack.slice(
        0,
        MAX_VISIBLE_STACK
    );

    const hiddenStackCount = Math.max(
        0,
        fullStack.length - MAX_VISIBLE_STACK
    );

    // =====================================================
    // NO PROJECT
    // =====================================================

    if (!project) {
        return null;
    }

    // =====================================================
    // PROMOTION
    // =====================================================

    const promoted = isProjectPromoted(
        project
    );

    // =====================================================
    // USER
    // =====================================================

    const username =
        project?.user?.username ||
        "developer";

    const profileUrl =
        `/${encodeURIComponent(username)}/profile`;

    // =====================================================
    // PROJECT URL
    // =====================================================

    const projectUrl =
        project.id != null
            ? `/project/${project.id}/detail`
            : "/projects";

    // =====================================================
    // NUMBER
    // =====================================================

    const projectNumber = String(
        index + 1
    ).padStart(2, "0");

    // =====================================================
    // STATS
    // =====================================================

    const stars = formatCompactNumber(
        project?.stars_count
    );

    const views = formatCompactNumber(
        project?.views_count
    );

    const collaborations = Math.max(
        0,
        safeNumber(
            project?.collaborations_count
        )
    );

    // =====================================================
    // PROJECT TITLE
    // =====================================================

    const projectName =
        project?.name ||
        "Nomsiz loyiha";

    // =====================================================
    // MAIN FEATURES
    // =====================================================

    const mainFeatures =
        typeof project?.main_features === "string"
            ? project.main_features.trim()
            : Array.isArray(project?.main_features)
                ? project.main_features
                    .map((item) => String(item))
                    .join(", ")
                : "";

    // =====================================================
    // DESCRIPTION
    // =====================================================

    const description =
        truncateText(
            project?.description
        ) ||
        "Loyiha haqida tavsif mavjud emas.";

    // =====================================================
    // PUBLIC STATUS
    // =====================================================

    const isPublic =
        project?.is_public !== false;

    // =====================================================
    // JSX
    // =====================================================

    return (
        <article
            className={`
                group/project-card

                relative

                flex
                h-full
                min-w-0
                flex-col

                overflow-hidden

                rounded-2xl
                border

                shadow-[0_8px_30px_rgba(15,23,42,0.045)]

                transition-all
                duration-200

                hover:-translate-y-0.5
                hover:shadow-[0_14px_35px_rgba(15,23,42,0.075)]

                dark:shadow-[0_8px_28px_rgba(0,0,0,0.14)]
                dark:hover:shadow-[0_14px_35px_rgba(0,0,0,0.22)]

                motion-reduce:transform-none

                ${
                    promoted
                        ? `
                            border-cyan-400/40

                            bg-gradient-to-br
                            from-white
                            via-[#f8fcff]
                            to-[#edfafe]

                            hover:border-cyan-500/55

                            dark:border-cyan-400/25
                            dark:from-[#111b29]
                            dark:via-[#101720]
                            dark:to-[#0c161f]

                            dark:hover:border-cyan-400/40
                        `
                        : `
                            border-[#dce5f0]
                            bg-white

                            hover:border-indigo-400/35

                            dark:border-white/[0.07]
                            dark:bg-[#0d1117]

                            dark:hover:border-cyan-400/25
                        `
                }
            `}
        >
            {/* ======================================
                PROMOTED GLOW
            ====================================== */}

            {promoted && (
                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none

                        absolute
                        -right-16
                        -top-16

                        h-40
                        w-40

                        rounded-full

                        bg-cyan-400/[0.08]
                        blur-3xl

                        dark:bg-cyan-400/[0.055]
                    "
                />
            )}

            {/* ======================================
                TOP BAR
            ====================================== */}

            <div
                className="
                    relative
                    z-10

                    flex
                    h-10
                    min-w-0
                    shrink-0

                    items-center
                    justify-between
                    gap-2

                    border-b
                    border-[#e4eaf3]

                    bg-slate-50/60

                    px-3

                    sm:px-4

                    dark:border-white/[0.055]
                    dark:bg-black/[0.10]
                "
            >
                {/* PROJECT NUMBER + PROMOTION */}

                <div
                    className="
                        flex
                        min-w-0
                        items-center
                        gap-2
                    "
                >
                    <span
                        className="
                            shrink-0

                            font-mono
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.12em]

                            text-slate-500

                            dark:text-gray-500
                        "
                    >
                        project://{projectNumber}
                    </span>

                    {promoted && (
                        <span
                            className="
                                inline-flex
                                shrink-0
                                items-center
                                gap-1

                                rounded-full
                                border
                                border-cyan-400/30

                                bg-cyan-500/[0.08]

                                px-2
                                py-1

                                font-mono
                                text-[8px]
                                font-black
                                uppercase
                                tracking-[0.08em]

                                text-cyan-800

                                dark:border-cyan-400/20
                                dark:bg-cyan-400/[0.07]
                                dark:text-cyan-300
                            "
                        >
                            <Zap
                                size={10}
                                fill="currentColor"
                                aria-hidden="true"
                            />

                            promoted
                        </span>
                    )}
                </div>

                {/* STARS + VIEWS */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        gap-2.5

                        font-mono
                        text-[10px]
                        font-bold

                        text-slate-600

                        sm:gap-3

                        dark:text-gray-400
                    "
                >
                    {/* STARS */}

                    <span
                        title="Yulduzlar soni"
                        className="
                            inline-flex
                            items-center
                            gap-1
                        "
                    >
                        <Star
                            size={12}
                            fill="currentColor"
                            aria-hidden="true"
                            className="
                                text-amber-500
                                dark:text-yellow-300
                            "
                        />

                        {stars}
                    </span>

                    {/* VIEWS */}

                    <span
                        title="Ko‘rishlar soni"
                        className="
                            inline-flex
                            items-center
                            gap-1
                        "
                    >
                        <Eye
                            size={12}
                            aria-hidden="true"
                            className="
                                text-cyan-700
                                dark:text-cyan-300
                            "
                        />

                        {views}
                    </span>
                </div>
            </div>

            {/* ======================================
                IMAGE
            ====================================== */}

            <ProjectsPageCardImage
                project={project}
            />

            {/* ======================================
                CARD CONTENT
            ====================================== */}

            <div
                className="
                    relative
                    z-10

                    flex
                    min-h-[220px]
                    min-w-0
                    flex-1
                    flex-col

                    p-4
                "
            >
                {/* ==================================
                    AUTHOR + DATE
                ================================== */}

                <div
                    className="
                        flex
                        min-w-0
                        flex-wrap
                        items-center
                        justify-between
                        gap-x-3
                        gap-y-2
                    "
                >
                    {/* AUTHOR */}

                    <Link
                        to={profileUrl}

                        className="
                            inline-flex
                            min-w-0
                            max-w-full
                            items-center
                            gap-2

                            rounded-md

                            text-[11px]
                            font-bold

                            text-slate-600

                            transition-colors
                            duration-150

                            hover:text-indigo-700

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-indigo-500

                            dark:text-gray-400
                            dark:hover:text-cyan-300
                        "
                    >
                        <img
                            src={getUserAvatarUrl(
                                project?.user
                            )}

                            alt={`${username} avatar`}

                            onError={handleUserImageError}

                            loading="lazy"
                            decoding="async"

                            className="
                                h-6
                                w-6
                                shrink-0

                                rounded-full
                                border
                                border-[#dce5f0]

                                bg-slate-100
                                object-cover

                                dark:border-white/10
                                dark:bg-[#18212d]
                            "
                        />

                        <span
                            className="
                                min-w-0
                                max-w-[150px]
                                truncate
                            "
                        >
                            @{username}
                        </span>
                    </Link>

                    {/* DATE */}

                    <time
                        dateTime={
                            project?.created_at ||
                            undefined
                        }

                        className="
                            shrink-0

                            font-mono
                            text-[10px]
                            font-medium

                            text-slate-500

                            dark:text-gray-500
                        "
                    >
                        {formatPrettyDate(
                            project?.created_at
                        )}
                    </time>
                </div>

                {/* ==================================
                    PROJECT TITLE
                ================================== */}

                <Link
                    to={projectUrl}

                    title={projectName}

                    className="
                        mt-3
                        block
                        min-w-0

                        rounded-md

                        text-[17px]
                        font-black
                        leading-[1.3]
                        tracking-tight

                        text-slate-900

                        transition-colors
                        duration-150

                        hover:text-indigo-700

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-indigo-500

                        sm:text-[19px]

                        dark:text-gray-100

                        dark:hover:text-cyan-300
                        dark:group-hover/project-card:text-cyan-200
                    "
                >
                    <span
                        className="
                            block

                            line-clamp-2
                            break-words
                            [overflow-wrap:anywhere]
                        "
                    >
                        {projectName}
                    </span>
                </Link>

                {/* ==================================
                    MAIN FEATURES
                ================================== */}

                {mainFeatures && (
                    <div
                        className="
                            mt-2
                            flex
                            min-w-0
                            items-center
                            gap-2
                        "
                    >
                        <Code2
                            size={13}
                            strokeWidth={2}
                            aria-hidden="true"

                            className="
                                shrink-0

                                text-violet-600

                                dark:text-violet-300/80
                            "
                        />

                        <p
                            title={mainFeatures}

                            className="
                                min-w-0
                                truncate

                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.06em]

                                text-violet-700

                                dark:text-violet-300/75
                            "
                        >
                            {mainFeatures}
                        </p>
                    </div>
                )}

                {/* ==================================
                    DESCRIPTION
                ================================== */}

                <p
                    className="
                        mt-2

                        min-w-0

                        line-clamp-2
                        break-words
                        [overflow-wrap:anywhere]

                        text-[12px]
                        font-medium
                        leading-[1.65]

                        text-slate-600

                        sm:text-[13px]

                        dark:text-gray-400
                    "
                >
                    {description}
                </p>

                {/* ==================================
                    BOTTOM CONTENT
                ================================== */}

                <div className="mt-auto pt-4">

                    {/* ==================================
                        COLORED TECH STACK
                    ================================== */}

                    <div
                        className="
                            flex
                            min-w-0
                            items-end
                            justify-between
                            gap-3
                        "
                    >
                        {/* STACK LIST */}

                        <div
                            className="
                                flex
                                min-w-0
                                flex-1
                                flex-wrap
                                gap-1.5
                            "
                        >
                            {visibleStack.length > 0 ? (
                                <>
                                    {visibleStack.map(
                                        (item) => (
                                            <StackBadge
                                                key={`${item.type}-${item.id}`}
                                                item={item}
                                            />
                                        )
                                    )}

                                    {/* MORE STACK */}

                                    {hiddenStackCount > 0 && (
                                        <span
                                            title={`${hiddenStackCount} ta qo‘shimcha stack`}

                                            className="
                                                inline-flex
                                                items-center

                                                rounded-lg
                                                border
                                                border-[#dce5f0]

                                                bg-slate-100/80

                                                px-2
                                                py-1.5

                                                font-mono
                                                text-[9px]
                                                font-bold

                                                text-slate-600

                                                dark:border-white/[0.07]
                                                dark:bg-white/[0.035]
                                                dark:text-gray-400
                                            "
                                        >
                                            +{hiddenStackCount}
                                        </span>
                                    )}
                                </>
                            ) : (
                                <span
                                    className="
                                        font-mono
                                        text-[10px]
                                        font-medium

                                        text-slate-400

                                        dark:text-gray-600
                                    "
                                >
                                    stack://unknown
                                </span>
                            )}
                        </div>

                        {/* DETAIL BUTTON */}

                        <Link
                            to={projectUrl}

                            aria-label={`${projectName} batafsil`}

                            title="Loyihani ko‘rish"

                            className="
                                grid
                                h-9
                                w-9
                                shrink-0

                                place-items-center

                                rounded-xl
                                border
                                border-[#dce5f0]

                                bg-[#f8faff]

                                text-slate-600

                                transition-colors
                                duration-150

                                hover:border-indigo-400/40
                                hover:bg-indigo-500/[0.08]
                                hover:text-indigo-700

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-indigo-500

                                dark:border-white/[0.08]
                                dark:bg-white/[0.035]
                                dark:text-gray-400

                                dark:hover:border-cyan-400/25
                                dark:hover:bg-cyan-400/[0.07]
                                dark:hover:text-cyan-300
                            "
                        >
                            <ArrowUpRight
                                size={17}
                                strokeWidth={2}
                                aria-hidden="true"
                            />
                        </Link>
                    </div>

                    {/* ==================================
                        CARD FOOTER
                    ================================== */}

                    <div
                        className="
                            mt-3

                            flex
                            min-w-0
                            flex-wrap

                            items-center
                            justify-between
                            gap-2

                            border-t
                            border-[#e7ebf2]

                            pt-3

                            dark:border-white/[0.055]
                        "
                    >
                        {/* COLLABORATIONS / STACK COUNT */}

                        <div
                            className="
                                flex
                                flex-wrap
                                items-center
                                gap-x-4
                                gap-y-2

                                font-mono
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.04em]

                                text-slate-500

                                dark:text-gray-500
                            "
                        >
                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-1.5
                                "
                            >
                                <GitFork
                                    size={12}
                                    aria-hidden="true"
                                />

                                {collaborations} collab
                            </span>

                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-1.5
                                "
                            >
                                <Layers3
                                    size={12}
                                    aria-hidden="true"
                                />

                                {fullStack.length} stack
                            </span>
                        </div>

                        {/* PUBLIC STATUS */}

                        <span
                            className={`
                                inline-flex
                                items-center
                                gap-1.5

                                font-mono
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-[0.08em]

                                ${
                                    isPublic
                                        ? `
                                            text-emerald-700
                                            dark:text-emerald-400/75
                                        `
                                        : `
                                            text-amber-700
                                            dark:text-amber-300/75
                                        `
                                }
                            `}
                        >
                            <span
                                aria-hidden="true"
                                className={`
                                    h-1.5
                                    w-1.5

                                    rounded-full

                                    ${
                                        isPublic
                                            ? "bg-emerald-500 dark:bg-emerald-400"
                                            : "bg-amber-500 dark:bg-amber-400"
                                    }
                                `}
                            />

                            {isPublic ? "public" : "private"}
                        </span>
                    </div>
                </div>
            </div>
        </article>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(ProjectsPageCard);
