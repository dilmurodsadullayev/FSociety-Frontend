// src/components/profile/hero/ProfileHeroCover.jsx

import React, {
    memo,
    useState,
} from "react";

import {
    Image as ImageIcon,
} from "lucide-react";

// =========================================================
// PROFILE HERO COVER
//
// Responsibilities:
//
// - Display cover image
// - Cover image fallback
// - Gradient background
// - Ambient glow effects
// - Cover edit action
// - Owner permissions
// - Responsive design
// - Light / Dark Mode
// =========================================================

const ProfileHeroCover = ({
    coverImage,
    isOwner = false,
    onEditCover,
}) => {
    // =====================================================
    // IMAGE ERROR STATE
    //
    // Remember the URL that failed.
    //
    // If a different profile or cover image is loaded,
    // the new URL is tried automatically.
    // =====================================================

    const [
        failedSource,
        setFailedSource,
    ] = useState(null);

    // =====================================================
    // SAFE IMAGE SOURCE
    // =====================================================

    const source =
        typeof coverImage === "string"
            ? coverImage.trim()
            : "";

    const showImage =
        Boolean(source) &&
        failedSource !== source;

    // =====================================================
    // EDIT PERMISSION
    // =====================================================

    const canEdit =
        isOwner &&
        typeof onEditCover === "function";

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div
            className="
                relative
                h-44
                overflow-hidden

                bg-gradient-to-r

                from-indigo-200
                via-slate-200
                to-violet-200

                dark:from-indigo-950
                dark:via-slate-900
                dark:to-violet-950

                sm:h-52
                md:h-72
            "
        >
            {/* ==========================================
                COVER IMAGE

                If the image cannot load, the gradient
                background remains visible.
            ========================================== */}

            {showImage && (
                <img
                    key={source}
                    src={source}
                    alt=""
                    decoding="async"
                    onError={() => {
                        setFailedSource(source);
                    }}
                    className="
                        absolute
                        inset-0

                        h-full
                        w-full

                        object-cover
                    "
                />
            )}

            {/* ==========================================
                COVER OVERLAY

                Keeps the bottom area darker for
                better visual separation between
                the cover and the profile identity.
            ========================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none

                    absolute
                    inset-0

                    bg-gradient-to-b

                    from-black/5
                    via-black/20
                    to-black/75
                "
            />

            {/* ==========================================
                AMBIENT GLOW

                Decorative futuristic lighting.
                Does not block user interactions.
            ========================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none

                    absolute
                    inset-0

                    bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.18),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(236,72,153,0.12),transparent_35%)]
                "
            />

            {/* ==========================================
                COVER EDIT BUTTON

                Only visible to the profile owner.
            ========================================== */}

            {isOwner && (
                <button
                    type="button"
                    onClick={onEditCover}
                    disabled={!canEdit}
                    aria-label="Fon rasmini tahrirlash"
                    className="
                        absolute
                        right-3
                        top-3
                        z-10

                        inline-flex
                        min-h-10

                        items-center
                        justify-center
                        gap-2

                        rounded-xl

                        border
                        border-white/20

                        bg-black/55

                        px-3

                        text-xs
                        font-bold
                        text-white

                        backdrop-blur-xl

                        transition-colors

                        hover:bg-black/75

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-white/80

                        disabled:cursor-not-allowed
                        disabled:opacity-50

                        sm:right-4
                        sm:top-4
                    "
                >
                    <ImageIcon
                        size={16}
                        aria-hidden="true"
                    />

                    <span>
                        Fon rasmi
                    </span>
                </button>
            )}
        </div>
    );
};

export default memo(ProfileHeroCover);