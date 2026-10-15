
import React from "react";

import { Link } from "react-router-dom";

import {
    Code2,
    ExternalLink,
    Github,
    Layers3,
    UserRound,
} from "lucide-react";

import ProjectPromotion from "../promotions/ProjectPromotion";

import UserImage from "../../assests/userImage.jpeg";

import {
    getAuthorName,
    getImageUrl,
    getOwnerProfilePath,
    getStackColor,
    normalizeStackList,
    safeNumber,
    withAlpha,
} from "./projectDetailHelpers";

// =========================================================
// FSOCIETY — PROJECT DETAIL SIDEBAR
//
// Features:
// - Dark / Light Mode
// - Responsive layout
// - Owner promotion panel
// - Author profile
// - Author avatar fallback
// - Languages and technologies
// - Backend-defined technology colors
// - Technology categories
// - GitHub / Live Demo links
//
// Existing API components are reused.
// =========================================================

// =========================================================
// SIDEBAR PANEL
// =========================================================

const PANEL_CLASS = `
    min-w-0

    rounded-2xl
    border
    border-[#dce5f0]

    bg-white/90

    p-4

    shadow-[0_5px_22px_rgba(15,23,42,0.035)]

    sm:rounded-3xl
    sm:p-5

    dark:border-white/[0.08]
    dark:bg-white/[0.025]
    dark:shadow-none
`;

// =========================================================
// SIDEBAR HEADING
// =========================================================

const SidebarHeading = React.memo(({
    icon: Icon,
    title,
    subtitle,
    tone = "indigo",
}) => {
    const tones = {
        indigo: `
            border-indigo-400/25
            bg-indigo-500/[0.08]
            text-indigo-700

            dark:border-indigo-400/15
            dark:bg-indigo-400/[0.07]
            dark:text-indigo-300
        `,

        purple: `
            border-purple-400/25
            bg-purple-500/[0.08]
            text-purple-700

            dark:border-purple-400/15
            dark:bg-purple-400/[0.07]
            dark:text-purple-300
        `,
    };

    return (
        <div
            className="
                mb-5
                flex
                min-w-0
                items-center
                gap-3
            "
        >
            <span
                aria-hidden="true"
                className={`
                    grid
                    h-10
                    w-10
                    shrink-0
                    place-items-center

                    rounded-xl
                    border

                    ${tones[tone] || tones.indigo}
                `}
            >
                <Icon
                    size={18}
                    strokeWidth={1.9}
                />
            </span>

            <div className="min-w-0">
                <h3
                    className="
                        text-[14px]
                        font-black

                        text-slate-900

                        dark:text-white
                    "
                >
                    {title}
                </h3>

                {subtitle && (
                    <p
                        className="
                            mt-1

                            font-mono
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.10em]

                            text-slate-500

                            dark:text-gray-500
                        "
                    >
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
});

// =========================================================
// AUTHOR AVATAR ERROR
// =========================================================

const handleAvatarError = (event) => {
    const image = event.currentTarget;

    // Prevent repeated fallback errors.
    image.onerror = null;

    if (!image.src.endsWith("/userImage.jpeg")) {
        image.src = UserImage;
    }
};

// =========================================================
// AUTHOR CARD
// =========================================================

const ProjectAuthorCard = React.memo(({
    author,
}) => {
    const owner = author || {};

    const username = String(
        owner.username || ""
    ).trim();

    const authorName = getAuthorName(
        owner
    );

    const authorImage = getImageUrl(
        owner.image
    );

    const skillLevel =
        owner.skill_level ||
        "Aniqlanmagan";

    const profilePath = getOwnerProfilePath(
        owner
    );

    // =====================================================
    // PROFILE CONTENT
    // =====================================================

    const profileContent = (
        <>
            {/* AVATAR */}

            <img
                src={authorImage}
                alt={`${authorName} avatar`}

                loading="lazy"
                decoding="async"

                onError={handleAvatarError}

                className="
                    h-14
                    w-14
                    shrink-0

                    rounded-2xl
                    border
                    border-[#dce5f0]

                    bg-slate-100
                    object-cover

                    dark:border-white/[0.10]
                    dark:bg-[#121a27]
                "
            />

            {/* USER INFORMATION */}

            <div className="min-w-0 flex-1">
                <p
                    className="
                        truncate

                        text-[14px]
                        font-black

                        text-slate-900

                        transition-colors
                        duration-150

                        group-hover/author:text-indigo-700

                        dark:text-gray-100

                        dark:group-hover/author:text-indigo-300
                    "
                >
                    {authorName}
                </p>

                <p
                    className="
                        mt-1
                        truncate

                        text-[11px]
                        font-semibold

                        text-slate-500

                        dark:text-gray-500
                    "
                >
                    @{username}
                </p>

                <p
                    className="
                        mt-2

                        truncate

                        font-mono
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.08em]

                        text-indigo-700

                        dark:text-indigo-300
                    "
                >
                    {skillLevel}
                </p>
            </div>

            <ExternalLink
                size={15}
                strokeWidth={2}
                aria-hidden="true"

                className="
                    shrink-0

                    text-slate-400

                    transition-colors
                    duration-150

                    group-hover/author:text-indigo-600

                    dark:text-gray-600
                    dark:group-hover/author:text-indigo-300
                "
            />
        </>
    );

    // =====================================================
    // JSX
    // =====================================================

    return (
        <section className={PANEL_CLASS}>
            <SidebarHeading
                icon={UserRound}
                title="Muallif"
                subtitle="Project owner"
                tone="indigo"
            />

            {username ? (
                <Link
                    to={profilePath}

                    className="
                        group/author

                        flex
                        min-w-0
                        items-center
                        gap-3

                        rounded-2xl
                        border
                        border-[#dce5f0]

                        bg-[#f8faff]

                        p-3

                        transition-colors
                        duration-150

                        hover:border-indigo-400/40
                        hover:bg-indigo-500/[0.055]

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-indigo-500

                        sm:gap-4
                        sm:p-4

                        dark:border-white/[0.08]
                        dark:bg-black/[0.14]

                        dark:hover:border-indigo-400/25
                        dark:hover:bg-indigo-400/[0.05]
                    "
                >
                    {profileContent}
                </Link>
            ) : (
                <div
                    className="
                        rounded-2xl
                        border
                        border-dashed
                        border-[#dce5f0]

                        bg-slate-50

                        p-4

                        text-[12px]
                        font-medium
                        leading-6

                        text-slate-500

                        dark:border-white/[0.08]
                        dark:bg-black/[0.12]
                        dark:text-gray-500
                    "
                >
                    Muallif ma’lumoti topilmadi.
                </div>
            )}
        </section>
    );
});

// =========================================================
// TECH BADGE
//
// Database color is preserved in:
// - Dot
// - Border
// - Background
//
// Neutral label colors improve readability in both themes.
// =========================================================

const TechBadge = React.memo(({
    item,
    showCategory = false,
}) => {
    if (!item) {
        return null;
    }

    const name = String(
        item.name || ""
    ).trim();

    if (!name) {
        return null;
    }

    const color = getStackColor(
        item
    );

    const categoryValue =
        item.category_display ||
        item.category;

    const category =
        typeof categoryValue === "string"
            ? categoryValue.trim()
            : "";

    return (
        <span
            title={name}

            style={{
                borderColor: withAlpha(color, "55"),
                backgroundColor: withAlpha(color, "14"),
                boxShadow: `inset 0 0 0 1px ${withAlpha(
                    color,
                    "08"
                )}`,
            }}

            className="
                inline-flex
                max-w-full
                min-w-0

                items-center
                gap-2

                rounded-full
                border

                px-3
                py-2

                font-mono
                text-[10px]
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
                    boxShadow: `0 0 8px ${withAlpha(
                        color,
                        "70"
                    )}`,
                }}

                className="
                    h-2
                    w-2
                    shrink-0

                    rounded-full
                "
            />

            {/* TECHNOLOGY NAME */}

            <span
                className="
                    min-w-0
                    truncate
                "
            >
                {name}
            </span>

            {/* CATEGORY */}

            {showCategory && category && (
                <span
                    className="
                        hidden

                        max-w-[120px]
                        truncate

                        rounded-full
                        border
                        border-slate-300/70

                        bg-white/50

                        px-2
                        py-0.5

                        font-mono
                        text-[9px]
                        font-medium

                        text-slate-600

                        sm:inline-block

                        dark:border-white/[0.10]
                        dark:bg-black/[0.15]
                        dark:text-gray-400
                    "
                >
                    {category}
                </span>
            )}
        </span>
    );
});

// =========================================================
// STACK GROUP
// =========================================================

const ProjectStackGroup = React.memo(({
    title,
    items,
    showCategory = false,
    type,
}) => {
    if (!Array.isArray(items) || items.length === 0) {
        return null;
    }

    return (
        <div className="min-w-0">

            {/* GROUP HEADER */}

            <div
                className="
                    mb-3

                    flex
                    min-w-0

                    items-center
                    justify-between
                    gap-3
                "
            >
                <h4
                    className="
                        font-mono
                        text-[10px]
                        font-black
                        uppercase
                        tracking-[0.11em]

                        text-slate-600

                        dark:text-gray-500
                    "
                >
                    {title}
                </h4>

                <span
                    className="
                        inline-flex
                        min-w-7
                        shrink-0

                        items-center
                        justify-center

                        rounded-full
                        border
                        border-[#dce5f0]

                        bg-slate-50

                        px-2
                        py-1

                        font-mono
                        text-[10px]
                        font-black

                        text-slate-600

                        dark:border-white/[0.08]
                        dark:bg-white/[0.03]
                        dark:text-gray-500
                    "
                >
                    {items.length}
                </span>
            </div>

            {/* STACK ITEMS */}

            <div
                className="
                    flex
                    min-w-0
                    flex-wrap
                    gap-2
                "
            >
                {items.map((item, index) => (
                    <TechBadge
                        key={`${type}-${item.id ?? item.name}-${index}`}

                        item={item}

                        showCategory={showCategory}
                    />
                ))}
            </div>
        </div>
    );
});

// =========================================================
// PROJECT STACK CARD
// =========================================================

const ProjectStackCard = React.memo(({
    languages,
    technologies,
}) => {
    const safeLanguages = Array.isArray(languages)
        ? languages
        : [];

    const safeTechnologies = Array.isArray(technologies)
        ? technologies
        : [];

    const hasStack =
        safeLanguages.length > 0 ||
        safeTechnologies.length > 0;

    const total =
        safeLanguages.length +
        safeTechnologies.length;

    return (
        <section className={PANEL_CLASS}>

            <SidebarHeading
                icon={Code2}
                title="Project stack"
                subtitle="Tillar va texnologiyalar"
                tone="purple"
            />

            {hasStack ? (
                <div className="space-y-5">

                    {/* LANGUAGES */}

                    <ProjectStackGroup
                        title="Dasturlash tillari"

                        items={safeLanguages}

                        type="language"
                    />

                    {/* TECHNOLOGIES */}

                    <ProjectStackGroup
                        title="Texnologiyalar"

                        items={safeTechnologies}

                        showCategory

                        type="technology"
                    />

                    {/* TOTAL */}

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            gap-3

                            border-t
                            border-[#e7ebf2]

                            pt-3

                            dark:border-white/[0.07]
                        "
                    >
                        <span
                            className="
                                inline-flex
                                items-center
                                gap-2

                                font-mono
                                text-[10px]
                                font-bold
                                uppercase

                                text-slate-500

                                dark:text-gray-500
                            "
                        >
                            <Layers3
                                size={14}
                                aria-hidden="true"
                            />

                            Total stack
                        </span>

                        <strong
                            className="
                                font-mono
                                text-[11px]

                                text-indigo-700

                                dark:text-indigo-300
                            "
                        >
                            {total}
                        </strong>
                    </div>
                </div>
            ) : (
                <p
                    className="
                        text-[12px]
                        font-medium
                        leading-6

                        text-slate-500

                        dark:text-gray-500
                    "
                >
                    Project stack hali kiritilmagan.
                </p>
            )}
        </section>
    );
});

// =========================================================
// SAFE EXTERNAL URL
//
// Allows HTTP / HTTPS links only.
// Adds HTTPS to common domain-style links.
//
// Prevents javascript: / data: links from being rendered.
// =========================================================

const normalizeExternalUrl = (value) => {
    if (typeof value !== "string") {
        return null;
    }

    let url = value.trim();

    if (!url || /\s/.test(url)) {
        return null;
    }

    if (!/^https?:\/\//i.test(url)) {
        if (
            !/^(?:[a-z0-9-]+\.)+[a-z]{2,}(?::\d+)?(?:[/?#].*)?$/i.test(
                url
            )
        ) {
            return null;
        }

        url = `https://${url}`;
    }

    try {
        const parsed = new URL(url);

        if (
            parsed.protocol !== "http:" &&
            parsed.protocol !== "https:"
        ) {
            return null;
        }

        return parsed.href;
    } catch {
        return null;
    }
};

// =========================================================
// EXTERNAL LINK
// =========================================================

const ProjectExternalLink = React.memo(({
    href,
    label,
    Icon,
    primary = false,
}) => {
    if (!href) {
        return null;
    }

    return (
        <a
            href={href}

            target="_blank"
            rel="noopener noreferrer"

            aria-label={`${label} — yangi oynada ochish`}

            className={`
                group/external

                flex
                min-h-12
                w-full
                min-w-0

                items-center
                justify-between
                gap-3

                rounded-2xl
                border

                px-4
                py-3

                text-[13px]
                font-bold

                transition-colors
                duration-150

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500

                ${
                    primary
                        ? `
                            border-indigo-400/30
                            bg-indigo-500/[0.09]

                            text-indigo-700

                            hover:border-indigo-400/50
                            hover:bg-indigo-500/[0.14]

                            dark:border-indigo-400/20
                            dark:bg-indigo-400/[0.09]
                            dark:text-indigo-200

                            dark:hover:border-indigo-400/35
                            dark:hover:bg-indigo-400/[0.14]
                        `
                        : `
                            border-[#dce5f0]
                            bg-white/85

                            text-slate-700

                            hover:border-slate-300
                            hover:bg-slate-50
                            hover:text-slate-900

                            dark:border-white/[0.08]
                            dark:bg-white/[0.035]
                            dark:text-gray-300

                            dark:hover:border-white/[0.14]
                            dark:hover:bg-white/[0.06]
                            dark:hover:text-white
                        `
                }
            `}
        >
            <span
                className="
                    flex
                    min-w-0
                    items-center
                    gap-2.5
                "
            >
                <Icon
                    size={18}
                    strokeWidth={2}
                    aria-hidden="true"
                    className="shrink-0"
                />

                <span className="truncate">
                    {label}
                </span>
            </span>

            <ExternalLink
                size={15}
                aria-hidden="true"

                className="
                    shrink-0
                    opacity-60

                    transition-transform
                    duration-150

                    group-hover/external:translate-x-0.5
                    group-hover/external:-translate-y-0.5

                    motion-reduce:transform-none
                "
            />
        </a>
    );
});

// =========================================================
// PROJECT LINKS
// =========================================================

const ProjectLinks = React.memo(({
    githubUrl,
    websiteUrl,
}) => {
    const github = normalizeExternalUrl(
        githubUrl
    );

    const website = normalizeExternalUrl(
        websiteUrl
    );

    if (!github && !website) {
        return null;
    }

    return (
        <section
            aria-label="Loyiha havolalari"

            className="
                min-w-0
                space-y-2.5
            "
        >
            {github && (
                <ProjectExternalLink
                    href={github}

                    label="GitHub"

                    Icon={Github}
                />
            )}

            {website && (
                <ProjectExternalLink
                    href={website}

                    label="Live Demo"

                    Icon={ExternalLink}

                    primary
                />
            )}
        </section>
    );
});

// =========================================================
// MAIN SIDEBAR
// =========================================================

const ProjectDetailSidebar = ({
    projectData,

    projectTitle,

    author,

    projectLanguages,
    projectTechnologies,

    isOwner = false,

    userCoins = 0,

    onPromotionChange,
}) => {
    // =====================================================
    // SAFE PROJECT DATA
    // =====================================================

    const project = projectData || {};

    const projectAuthor =
        author ||
        project.user ||
        {};

    const title =
        projectTitle ||
        project.name ||
        project.title ||
        "Noma’lum loyiha";

    // =====================================================
    // PROJECT STACK
    //
    // Uses normalized props if supplied by the parent.
    // Otherwise derives the stack from backend data.
    // =====================================================

    const languages = Array.isArray(
        projectLanguages
    )
        ? projectLanguages
        : normalizeStackList(
            project.languages_data,
            project.language_data,
            "language"
        );

    const technologies = Array.isArray(
        projectTechnologies
    )
        ? projectTechnologies
        : normalizeStackList(
            project.technologies_data,
            project.technology_data,
            "technology"
        );

    // =====================================================
    // LINKS
    // =====================================================

    const githubUrl =
        project.github_url;

    const websiteUrl =
        project.website_url;

    // =====================================================
    // JSX
    // =====================================================

    return (
        <aside
            aria-label="Loyiha haqida qo‘shimcha ma’lumotlar"

            className="
                min-w-0

                border-t
                border-[#e0e7f1]

                bg-[#f5f8fd]/70

                p-4

                sm:p-6

                xl:border-t-0
                xl:p-7

                dark:border-white/[0.07]
                dark:bg-black/[0.10]
            "
        >
            <div
                className="
                    min-w-0
                    space-y-5

                    xl:sticky
                    xl:top-24
                "
            >
                {/* ==================================
                    OWNER PROMOTION PANEL
                ================================== */}

                {isOwner && project.id != null && (
                    <div className="min-w-0">
                        <ProjectPromotion
                            projectId={project.id}

                            projectName={title}

                            userCoins={safeNumber(
                                userCoins
                            )}

                            onPromotionChange={
                                onPromotionChange
                            }
                        />
                    </div>
                )}

                {/* ==================================
                    AUTHOR
                ================================== */}

                <ProjectAuthorCard
                    author={projectAuthor}
                />

                {/* ==================================
                    TECHNOLOGY STACK
                ================================== */}

                <ProjectStackCard
                    languages={languages}

                    technologies={technologies}
                />

                {/* ==================================
                    GITHUB / LIVE DEMO
                ================================== */}

                <ProjectLinks
                    githubUrl={githubUrl}

                    websiteUrl={websiteUrl}
                />
            </div>
        </aside>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(
    ProjectDetailSidebar
);
