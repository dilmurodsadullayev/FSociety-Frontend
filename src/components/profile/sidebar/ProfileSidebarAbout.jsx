// src/components/profile/sidebar/ProfileSidebarAbout.jsx

import React, { memo } from "react";

import {
    Terminal,
} from "lucide-react";

// =========================================================
// PROFILE SIDEBAR — ABOUT ME
//
// Responsibilities:
//
// - About Me heading
// - User biography
// - Empty biography state
// - Multiline text preservation
// - Long text overflow protection
// - Light / Dark Mode
// - Responsive design
//
// This component stays inside the existing
// personal details card.
// =========================================================

const ProfileSidebarAbout = ({
    about,
}) => {
    // =====================================================
    // SAFE DESCRIPTION
    // =====================================================

    const description =
        typeof about === "string"
            ? about.trim()
            : "";

    const hasDescription =
        description.length > 0;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div
            className="
                relative mt-5 min-w-0
                overflow-hidden rounded-2xl

                border border-slate-200
                bg-slate-50/80 p-4

                dark:border-white/[0.07]
                dark:bg-black/20

                sm:p-5
            "
        >
            {/* =====================================
                DECORATIVE AMBIENT GLOW
            ====================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute -left-10 -top-10

                    h-32 w-32 rounded-full

                    bg-indigo-500/[0.08]
                    blur-3xl
                "
            />

            {/* =====================================
                ABOUT ME HEADER
            ====================================== */}

            <h3
                className="
                    relative mb-3 flex min-w-0
                    items-center gap-2.5

                    text-lg font-black

                    text-slate-900
                    dark:text-white
                "
            >
                <Terminal
                    size={19}
                    aria-hidden="true"
                    className="
                        shrink-0 text-indigo-600
                        dark:text-indigo-300
                    "
                />

                Men haqimda
            </h3>

            {/* =====================================
                ABOUT ME TEXT
            ====================================== */}

            <p
                className={`
                    relative min-w-0

                    whitespace-pre-wrap
                    break-words
                    [overflow-wrap:anywhere]

                    text-sm font-medium
                    leading-7

                    ${
                        hasDescription
                            ? `
                                text-slate-700
                                dark:text-slate-300
                            `
                            : `
                                text-slate-400
                                dark:text-slate-500
                            `
                    }
                `}
            >
                {hasDescription
                    ? description
                    : "Foydalanuvchi hali o‘zi haqida yozmagan."}
            </p>
        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfileSidebarAbout);