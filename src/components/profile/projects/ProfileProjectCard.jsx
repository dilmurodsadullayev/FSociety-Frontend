
import React, { memo } from "react";

// =========================================================
// CARD COMPONENTS
// =========================================================

import ProfileProjectCardImage from "./card/ProfileProjectCardImage";

import ProfileProjectCardStack from "./card/ProfileProjectCardStack";

import ProfileProjectCardFooter from "./card/ProfileProjectCardFooter";

// =========================================================
// PROJECT TITLE
//
// Preserves the existing backend field fallbacks.
//
// Supports:
// - title
// - name
// =========================================================

const getProjectTitle = (project) => {
    return (
        project?.title ||
        project?.name ||
        "Noma’lum loyiha"
    );
};

// =========================================================
// PROJECT DESCRIPTION
//
// Preserves the existing backend field fallbacks.
//
// Supports:
// - description
// - short_description
// =========================================================

const getProjectDescription = (project) => {
    return (
        project?.description ||
        project?.short_description ||
        "Bu loyiha uchun tavsif hali kiritilmagan."
    );
};

// =========================================================
// TRUNCATE DESCRIPTION
//
// Keeps the original 155-character preview.
//
// Prevents long descriptions from breaking the layout.
// =========================================================

const truncateText = (
    value,
    maxLength = 155
) => {
    const text = String(value ?? "").trim();

    if (!text) {
        return "Bu loyiha uchun tavsif hali kiritilmagan.";
    }

    if (text.length <= maxLength) {
        return text;
    }

    return `${text.slice(0, maxLength).trim()}...`;
};

// =========================================================
// SAFE ANIMATION INDEX
//
// Ensures that animationDelay receives a valid value.
//
// Profile pagination:
// - Page 1: index 0, 1, 2, 3
// - Page 2: index 0, 1, 2, 3
//
// Animation restarts on each page because the parent
// passes the index within the current page.
// =========================================================

const getAnimationDelay = (index) => {
    const numericIndex = Number(index);

    if (
        !Number.isFinite(numericIndex) ||
        numericIndex < 0
    ) {
        return "0ms";
    }

    const safeIndex = Math.floor(numericIndex);

    return `${safeIndex * 80}ms`;
};

// =========================================================
// PROFILE PROJECT CARD
//
// Props:
//
// project:
//   Project object from the backend.
//
// index:
//   Card index for animation delay.
//
// Structure:
//
// 1. Image
// 2. Title
// 3. Description
// 4. Technology stack
// 5. Statistics and detail link
//
// Features:
//
// - Responsive layout
// - Light / Dark Mode
// - Project cover image
// - Image fallback
// - Project title and description
// - Technologies and languages
// - Stack colors
// - Duplicate stack filtering
// - Maximum 4 visible stack badges
// - +N counter
// - Stars
// - Collaborations
// - Comments
// - Views
// - Project detail link
// - Hover effects
// - Animation delay
//
// Pagination is managed by ProfileProjects.jsx.
// =========================================================

const ProfileProjectCard = ({
    project,
    index = 0,
}) => {
    // =====================================================
    // INVALID PROJECT
    // =====================================================

    if (
        !project ||
        typeof project !== "object" ||
        Array.isArray(project)
    ) {
        return null;
    }

    // =====================================================
    // PROJECT DATA
    // =====================================================

    const title = getProjectTitle(project);

    const description = truncateText(
        getProjectDescription(project)
    );

    // =====================================================
    // ANIMATION DELAY
    //
    // Original behavior: 80ms per card.
    // =====================================================

    const delay = getAnimationDelay(index);

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <article
            aria-label={title}
            style={{
                animationDelay: delay,
            }}
            className="
                group
                relative
                min-w-0
                overflow-hidden

                rounded-3xl
                border

                border-slate-200
                bg-white/95

                shadow-[0_12px_35px_rgba(15,23,42,0.06)]

                transition-all
                duration-300

                hover:-translate-y-1
                hover:border-indigo-400/40
                hover:shadow-[0_18px_44px_rgba(99,102,241,0.12)]

                dark:border-white/[0.10]
                dark:bg-[#0d1117]
                dark:shadow-[0_15px_35px_rgba(0,0,0,0.22)]

                dark:hover:bg-[#111827]

                motion-reduce:transform-none
                motion-reduce:transition-none
            "
        >
            {/* =============================================
                1. PROJECT IMAGE

                - Cover image
                - Project badge
                - Code icon
                - Image fallback
                - Hover zoom

                All existing image functionality stays
                inside ProfileProjectCardImage.
            ============================================== */}

            <ProfileProjectCardImage
                project={project}
                title={title}
            />

            {/* =============================================
                2. PROJECT CONTENT
            ============================================== */}

            <div
                className="
                    relative
                    min-w-0
                    p-5
                "
            >
                {/* =========================================
                    DECORATIVE GLOW
                ========================================== */}

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute

                        -right-16
                        -top-16

                        h-36
                        w-36

                        rounded-full
                        bg-indigo-500/10

                        opacity-0
                        blur-3xl

                        transition-opacity
                        duration-300

                        group-hover:opacity-100
                    "
                />

                {/* =========================================
                    CONTENT LAYER
                ========================================== */}

                <div
                    className="
                        relative
                        z-10
                        min-w-0
                    "
                >
                    {/* =====================================
                        PROJECT TITLE
                    ====================================== */}

                    <h4
                        className="
                            line-clamp-2
                            break-words

                            text-xl
                            font-black
                            leading-tight

                            text-slate-900

                            transition-colors

                            group-hover:text-indigo-700

                            dark:text-white
                            dark:group-hover:text-indigo-300
                        "
                    >
                        {title}
                    </h4>

                    {/* =====================================
                        PROJECT DESCRIPTION
                    ====================================== */}

                    <p
                        className="
                            mt-3
                            line-clamp-3
                            break-words

                            text-sm
                            font-medium
                            leading-7

                            text-slate-600
                            dark:text-slate-400
                        "
                    >
                        {description}
                    </p>

                    {/* =====================================
                        3. PROJECT TECHNOLOGY STACK

                        Supports:
                        - languages_data
                        - technologies_data
                        - language_data
                        - technology_data
                        - Backend colors
                        - Duplicate removal
                        - Maximum 4 visible
                        - +N counter

                        All stack logic stays inside
                        ProfileProjectCardStack.
                    ====================================== */}

                    <ProfileProjectCardStack
                        project={project}
                    />

                    {/* =====================================
                        4. PROJECT FOOTER

                        - Stars
                        - Collaborations
                        - Comments
                        - Views
                        - Detail link

                        All footer functionality stays
                        inside ProfileProjectCardFooter.
                    ====================================== */}

                    <ProfileProjectCardFooter
                        project={project}
                    />
                </div>
            </div>
        </article>
    );
};

// =========================================================
// EXPORT
//
// React.memo prevents unnecessary re-renders when
// project and index props remain unchanged.
// =========================================================

export default memo(ProfileProjectCard);
