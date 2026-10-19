
import React, { memo } from "react";

import {
    Code2,
    Rocket,
} from "lucide-react";

// =========================================================
// CONFIG
// =========================================================

const DEFAULT_PROJECT_IMAGE =
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1600&auto=format&fit=crop";

// =========================================================
// BACKEND URL
//
// Uses React environment configuration.
//
// Supports:
// - Development server
// - Production backend
// - Relative media URLs
// =========================================================

const getBackendUrl = () => {
    const configuredUrl =
        process.env.REACT_APP_BACKEND_URL;

    const fallbackOrigin =
        typeof window !== "undefined"
            ? window.location.origin
            : "";

    return String(
        configuredUrl || fallbackOrigin
    ).replace(/\/+$/, "");
};

// =========================================================
// PROJECT IMAGE
//
// Supported:
// - project.images[0].image
// - project.image
// - Absolute HTTP / HTTPS URLs
// - Blob / data URLs
// - Relative backend media URLs
//
// Original backend field compatibility is preserved.
// =========================================================

const getProjectImage = (project) => {
    const image =
        project?.images?.[0]?.image ||
        project?.image;

    if (
        typeof image !== "string" ||
        !image.trim()
    ) {
        return DEFAULT_PROJECT_IMAGE;
    }

    const value = image.trim();

    // Absolute image URLs

    if (
        /^https?:\/\//i.test(value) ||
        value.startsWith("blob:") ||
        value.startsWith("data:image/")
    ) {
        return value;
    }

    // Protocol-relative URLs

    if (value.startsWith("//")) {
        return `${
            typeof window !== "undefined"
                ? window.location.protocol
                : "https:"
        }${value}`;
    }

    // Relative media path

    const normalizedPath = value.startsWith("/")
        ? value
        : `/${value}`;

    return `${getBackendUrl()}${normalizedPath}`;
};

// =========================================================
// IMAGE ERROR HANDLER
//
// Prevents an infinite fallback loop if the
// fallback image also fails to load.
// =========================================================

const handleImageError = (event) => {
    const image = event.currentTarget;

    if (
        image.src === DEFAULT_PROJECT_IMAGE
    ) {
        return;
    }

    image.onerror = null;

    image.src = DEFAULT_PROJECT_IMAGE;
};

// =========================================================
// PROFILE PROJECT CARD IMAGE
//
// Props:
//
// project:
//   Django project object.
//
// title:
//   Accessible image description.
//
// Features:
// - Cover image
// - Project badge
// - Code icon
// - Hover zoom
// - Light / Dark Mode
// - Responsive full-width image
// =========================================================

const ProfileProjectCardImage = ({
    project,
    title = "Loyiha",
}) => {
    const imageUrl = getProjectImage(project);

    return (
        <div
            className="
                relative
                h-52
                min-w-0
                overflow-hidden

                bg-slate-100
                dark:bg-slate-950
            "
        >
            {/* =====================================
                PROJECT COVER IMAGE
            ====================================== */}

            <img
                src={imageUrl}
                alt={title}
                loading="lazy"
                decoding="async"
                onError={handleImageError}
                className="
                    h-full
                    w-full

                    object-cover

                    transition-transform
                    duration-700

                    group-hover:scale-110

                    motion-reduce:transform-none
                    motion-reduce:transition-none
                "
            />

            {/* =====================================
                IMAGE GRADIENT

                Gradient stays dark because badges
                are displayed directly over images.
            ====================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-0

                    bg-gradient-to-t

                    from-black/75
                    via-black/15
                    to-transparent
                "
            />

            {/* =====================================
                PROJECT BADGE
            ====================================== */}

            <div
                className="
                    absolute
                    left-4
                    top-4

                    inline-flex
                    items-center
                    gap-2

                    rounded-full
                    border

                    border-white/20
                    bg-black/50

                    px-3
                    py-1.5

                    text-[11px]
                    font-black

                    uppercase
                    tracking-wider
                    text-white

                    shadow-lg
                    shadow-black/10

                    backdrop-blur-md
                "
            >
                <Rocket
                    size={14}
                    aria-hidden="true"
                />

                <span>Project</span>
            </div>

            {/* =====================================
                CODE ICON
            ====================================== */}

            <div
                aria-hidden="true"
                className="
                    absolute
                    bottom-4
                    right-4

                    flex
                    h-11
                    w-11

                    items-center
                    justify-center

                    rounded-2xl
                    border

                    border-indigo-300/30
                    bg-indigo-500/25

                    text-indigo-100

                    shadow-lg
                    shadow-black/10

                    backdrop-blur-md

                    transition-colors

                    group-hover:border-indigo-300/50
                    group-hover:bg-indigo-500/35
                "
            >
                <Code2 size={21} />
            </div>
        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfileProjectCardImage);
