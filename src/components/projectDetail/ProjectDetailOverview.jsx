
import React from "react";

import {
    ShieldCheck,
    Sparkles,
} from "lucide-react";

// =========================================================
// EXISTING COMPONENT
// =========================================================

import ProjectCollaboration from "../ProjectCollaboration";

// =========================================================
// FSOCIETY — PROJECT DETAIL OVERVIEW
//
// Features:
// - Dark / Light Mode
// - Responsive layout
// - Project introduction
// - Project description
// - Main features
// - Numbered feature cards
// - Existing collaboration section
// - Prevent unnecessary vertical stretching
//
// IMPORTANT:
// API / Redux logic remains in the controller.
// Existing collaboration props are preserved.
// =========================================================

// =========================================================
// CONFIG
// =========================================================

const DEFAULT_DESCRIPTION =
    "Ushbu loyiha uchun hali to‘liq tavsif kiritilmagan.";

const DEFAULT_ABOUT_DESCRIPTION =
    "Loyiha haqida to‘liqroq ma’lumotlar tez orada kiritiladi.";

const EMPTY_REQUESTS = [];

// =========================================================
// SECTION HEADING
// =========================================================

const SectionHeading = React.memo(({
    icon: Icon,
    title,
    iconTone = "indigo",
    id,
    small = false,
}) => {
    // =====================================================
    // COLORS
    // =====================================================

    const tones = {
        indigo: `
            border-indigo-400/25
            bg-indigo-500/[0.08]
            text-indigo-700

            dark:border-indigo-400/15
            dark:bg-indigo-400/[0.07]
            dark:text-indigo-300
        `,

        emerald: `
            border-emerald-400/25
            bg-emerald-500/[0.08]
            text-emerald-700

            dark:border-emerald-400/15
            dark:bg-emerald-400/[0.07]
            dark:text-emerald-300
        `,
    };

    const tone = tones[iconTone] || tones.indigo;

    // =====================================================
    // JSX
    // =====================================================

    return (
        <div
            className="
                flex
                w-full
                min-w-0

                items-center
                gap-3
            "
        >
            {/* ======================================
                ICON
            ====================================== */}

            <span
                aria-hidden="true"

                className={`
                    grid
                    shrink-0
                    place-items-center

                    rounded-xl
                    border

                    ${
                        small
                            ? "h-9 w-9"
                            : "h-10 w-10"
                    }

                    ${tone}
                `}
            >
                <Icon
                    size={small ? 18 : 21}
                    strokeWidth={1.9}
                />
            </span>

            {/* ======================================
                HEADING
            ====================================== */}

            <h2
                id={id}

                className={`
                    min-w-0
                    break-words
                    [overflow-wrap:anywhere]

                    font-black
                    tracking-tight

                    text-slate-900

                    dark:text-gray-100

                    ${
                        small
                            ? `
                                text-[17px]
                                sm:text-xl
                            `
                            : `
                                text-[21px]
                                sm:text-2xl
                            `
                    }
                `}
            >
                {title}
            </h2>
        </div>
    );
});

// =========================================================
// FEATURE CARD
// =========================================================

const ProjectFeatureCard = React.memo(({
    feature,
    index = 0,
}) => {
    // =====================================================
    // NUMBER
    // =====================================================

    const featureNumber = String(
        index + 1
    ).padStart(2, "0");

    // =====================================================
    // JSX
    // =====================================================

    return (
        <div
            className="
                group/feature

                flex
                h-full
                w-full
                min-w-0

                items-start
                gap-3

                rounded-2xl
                border
                border-[#dce5f0]

                bg-white/80

                p-4

                shadow-[0_4px_16px_rgba(15,23,42,0.025)]

                transition-colors
                duration-150

                hover:border-indigo-400/35
                hover:bg-indigo-500/[0.035]

                dark:border-white/[0.08]
                dark:bg-white/[0.025]
                dark:shadow-none

                dark:hover:border-indigo-400/20
                dark:hover:bg-indigo-400/[0.04]
            "
        >
            {/* ======================================
                FEATURE NUMBER
            ====================================== */}

            <span
                aria-hidden="true"

                className="
                    grid
                    h-8
                    w-8
                    shrink-0

                    place-items-center

                    rounded-lg
                    border
                    border-indigo-400/25

                    bg-indigo-500/[0.08]

                    font-mono
                    text-[10px]
                    font-black

                    text-indigo-700

                    dark:border-indigo-400/20
                    dark:bg-indigo-400/[0.07]
                    dark:text-indigo-300
                "
            >
                {featureNumber}
            </span>

            {/* ======================================
                FEATURE TEXT
            ====================================== */}

            <p
                className="
                    min-w-0
                    flex-1

                    break-words
                    [overflow-wrap:anywhere]

                    pt-1

                    text-[12px]
                    font-semibold
                    leading-6

                    text-slate-700

                    sm:text-[13px]

                    dark:text-gray-300
                "
            >
                {feature}
            </p>
        </div>
    );
});

// =========================================================
// PROJECT INTRODUCTION
// =========================================================

const ProjectIntroduction = React.memo(({
    description,
}) => {
    return (
        <div
            className="
                relative

                w-full
                min-w-0

                overflow-hidden

                rounded-2xl
                border
                border-indigo-400/25

                bg-gradient-to-br
                from-indigo-500/[0.075]
                via-white
                to-cyan-500/[0.045]

                px-4
                py-4

                sm:px-5
                sm:py-5

                dark:border-indigo-400/[0.16]
                dark:from-indigo-500/[0.075]
                dark:via-indigo-400/[0.025]
                dark:to-cyan-400/[0.035]
            "
        >
            {/* ======================================
                LEFT ACCENT
            ====================================== */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    bottom-0
                    left-0
                    top-0

                    w-[3px]

                    bg-gradient-to-b
                    from-indigo-500/70
                    via-cyan-500/35
                    to-transparent

                    dark:from-indigo-400/65
                    dark:via-cyan-400/25
                "
            />

            {/* ======================================
                INTRO LABEL
            ====================================== */}

            <span
                className="
                    inline-flex
                    items-center
                    gap-2

                    font-mono
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.12em]

                    text-indigo-700

                    dark:text-indigo-300
                "
            >
                <Sparkles
                    size={13}
                    strokeWidth={2}
                    aria-hidden="true"
                />

                Project overview
            </span>

            {/* ======================================
                DESCRIPTION
            ====================================== */}

            <p
                className="
                    mt-2.5

                    whitespace-pre-wrap
                    break-words
                    [overflow-wrap:anywhere]

                    text-[13px]
                    font-medium
                    leading-7

                    text-slate-700

                    sm:text-sm
                    sm:leading-8

                    dark:text-indigo-100/85
                "
            >
                {description}
            </p>
        </div>
    );
});

// =========================================================
// PROJECT ABOUT
// =========================================================

const ProjectAbout = React.memo(({
    description,
}) => {
    return (
        <section
            aria-labelledby="project-detail-about-title"

            className="
                w-full
                min-w-0
            "
        >
            {/* ======================================
                SECTION HEADING
            ====================================== */}

            <SectionHeading
                id="project-detail-about-title"

                icon={Sparkles}

                title="Loyiha haqida"

                iconTone="indigo"
            />

            {/* ======================================
                DESCRIPTION
            ====================================== */}

            <p
                className="
                    mt-4

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
        </section>
    );
});

// =========================================================
// PROJECT FEATURES
// =========================================================

const ProjectFeatures = React.memo(({
    features = [],
}) => {
    // =====================================================
    // SAFE FEATURES
    // =====================================================

    const safeFeatures = Array.isArray(features)
        ? features.filter(Boolean)
        : [];

    if (safeFeatures.length === 0) {
        return null;
    }

    // =====================================================
    // JSX
    // =====================================================

    return (
        <section
            aria-labelledby="project-detail-features-title"

            className="
                w-full
                min-w-0
            "
        >
            {/* ======================================
                SECTION HEADING
            ====================================== */}

            <SectionHeading
                id="project-detail-features-title"

                icon={ShieldCheck}

                title="Asosiy imkoniyatlar"

                iconTone="emerald"

                small
            />

            {/* ======================================
                FEATURE COUNT
            ====================================== */}

            <p
                className="
                    mt-2

                    font-mono
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.08em]

                    text-slate-500

                    dark:text-gray-500
                "
            >
                {safeFeatures.length} ta imkoniyat
            </p>

            {/* ======================================
                FEATURE GRID
            ====================================== */}

            <div
                className="
                    mt-4

                    grid
                    w-full
                    min-w-0
                    grid-cols-1

                    content-start
                    items-start

                    gap-3

                    md:grid-cols-2
                "
            >
                {safeFeatures.map(
                    (feature, index) => (
                        <ProjectFeatureCard
                            key={`${feature}-${index}`}

                            feature={feature}

                            index={index}
                        />
                    )
                )}
            </div>
        </section>
    );
});

// =========================================================
// MAIN PROJECT DETAIL OVERVIEW
// =========================================================

const ProjectDetailOverview = ({
    projectData,
    featuresList = [],
    author,
    isOwner = false,
    isCollaborator = false,
    projectId,
}) => {
    // =====================================================
    // PROJECT DATA
    // =====================================================

    const project = projectData || {};

    // =====================================================
    // DESCRIPTION
    // =====================================================

    const rawDescription =
        typeof project.description === "string"
            ? project.description.trim()
            : "";

    const description =
        rawDescription ||
        DEFAULT_DESCRIPTION;

    const aboutDescription =
        rawDescription ||
        DEFAULT_ABOUT_DESCRIPTION;

    // =====================================================
    // FEATURES
    // =====================================================

    const features = Array.isArray(featuresList)
        ? featuresList.filter(Boolean)
        : [];

    // =====================================================
    // COLLABORATORS
    // =====================================================

    const currentCollaborators =
        Array.isArray(project.collaborations)
            ? project.collaborations
            : [];

    // =====================================================
    // PROJECT OWNER
    // =====================================================

    const projectOwner =
        author ||
        project.user ||
        {};

    // =====================================================
    // JSX
    // =====================================================

    return (
        <section
            aria-label="Loyiha haqida va hamkorlik"

            className="
                relative

                flex
                w-full
                min-w-0

                flex-col
                items-stretch
                justify-start

                self-start

                border-[#e0e7f1]

                xl:border-r

                dark:border-white/[0.07]
            "
        >
            {/* ======================================
                PROJECT INFORMATION

                Important:
                - No h-full
                - No flex-1
                - No justify-between
                - No mt-auto

                Content keeps its natural height.
            ====================================== */}

            <article
                className="
                    relative

                    w-full
                    min-w-0

                    shrink-0

                    p-4

                    sm:p-6

                    lg:p-8

                    xl:p-10
                "
            >
                {/* ==================================
                    CONTENT STACK
                ================================== */}

                <div
                    className="
                        flex
                        w-full
                        min-w-0

                        flex-col
                        items-stretch
                        justify-start

                        gap-8

                        sm:gap-9
                    "
                >
                    {/* ==============================
                        PROJECT INTRODUCTION
                    ============================== */}

                    <ProjectIntroduction
                        description={description}
                    />

                    {/* ==============================
                        ABOUT PROJECT
                    ============================== */}

                    <ProjectAbout
                        description={aboutDescription}
                    />

                    {/* ==============================
                        PROJECT FEATURES
                    ============================== */}

                    <ProjectFeatures
                        features={features}
                    />
                </div>
            </article>

            {/* ======================================
                PROJECT COLLABORATION

                Important:
                - Directly follows the article
                - Has its own natural height
                - Does not stretch to sidebar height

                Keep the existing component and
                its original props contract.
            ====================================== */}

            <div
                className="
                    relative

                    w-full
                    min-w-0

                    flex-none
                    self-start

                    border-t
                    border-[#e0e7f1]

                    dark:border-white/[0.07]
                "
            >
                <ProjectCollaboration
                    currentCollaborators={
                        currentCollaborators
                    }

                    pendingRequests={
                        EMPTY_REQUESTS
                    }

                    projectOwner={
                        projectOwner
                    }

                    isOwner={
                        isOwner
                    }

                    isCollaborator={
                        isCollaborator
                    }

                    hasSentRequest={
                        false
                    }

                    projectId={
                        projectId
                    }
                />
            </div>
        </section>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(
    ProjectDetailOverview
);
