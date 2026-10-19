
// src/components/projects/create/ProjectCreateHeader.jsx

import React, { memo } from "react";

import {
    Pencil,
    Rocket,
    X,
} from "lucide-react";

// =========================================================
// PROJECT CREATE HEADER
//
// Props:
// - isEditMode
// - isSubmitting
// - onClose
//
// Features:
// - Create / Edit mode
// - Responsive layout
// - Accessible title and description
// - Protected close button
// - Light / Dark Mode
//
// No Redux or API logic.
// =========================================================

const ProjectCreateHeader = ({
    isEditMode = false,
    isSubmitting = false,
    onClose,
}) => {
    // =====================================================
    // MODE CONTENT
    // =====================================================

    const title = isEditMode
        ? "Loyihani tahrirlash"
        : "Yangi loyiha";

    const description = isEditMode
        ? "Loyiha ma’lumotlari, stack va rasmlarini yangilang."
        : "Yangi loyihangizni FSociety hamjamiyatiga taqdim eting.";

    const label = isEditMode
        ? "Edit Project"
        : "New Project";

    const Icon = isEditMode
        ? Pencil
        : Rocket;

    // =====================================================
    // CLOSE PERMISSION
    // =====================================================

    const canClose =
        !isSubmitting &&
        typeof onClose === "function";

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <header
            className="
                relative
                z-20

                flex
                w-full
                min-w-0

                shrink-0

                items-start
                justify-between

                gap-2.5

                border-b
                border-slate-200

                bg-white/95

                px-3
                py-3.5

                backdrop-blur-xl

                dark:border-white/[0.08]
                dark:bg-[#0b1018]/95

                min-[380px]:gap-3
                min-[380px]:px-4
                min-[380px]:py-4

                sm:gap-4
                sm:px-7
                sm:py-5
            "
        >
            {/* =============================================
                HEADER CONTENT
            ============================================== */}

            <div
                className="
                    flex
                    min-w-0
                    flex-1

                    items-start
                    gap-2.5

                    sm:items-center
                    sm:gap-4
                "
            >
                {/* =========================================
                    CREATE / EDIT ICON
                ========================================== */}

                <div
                    aria-hidden="true"
                    className="
                        grid

                        h-10
                        w-10

                        shrink-0

                        place-items-center

                        rounded-xl
                        border

                        border-indigo-200
                        bg-indigo-50

                        text-indigo-700

                        shadow-md
                        shadow-indigo-500/10

                        dark:border-indigo-400/20
                        dark:bg-indigo-500/[0.08]
                        dark:text-indigo-300

                        min-[380px]:h-11
                        min-[380px]:w-11

                        sm:h-12
                        sm:w-12
                        sm:rounded-2xl
                    "
                >
                    <Icon
                        size={20}
                        strokeWidth={1.8}
                        className="
                            sm:h-[21px]
                            sm:w-[21px]
                        "
                    />
                </div>

                {/* =========================================
                    TEXT CONTENT
                ========================================== */}

                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >
                    {/* =====================================
                        MODE LABEL
                    ====================================== */}

                    <span
                        className="
                            mb-1

                            inline-block
                            max-w-full

                            truncate

                            text-[9px]
                            font-black

                            uppercase
                            tracking-[0.12em]

                            text-indigo-700
                            dark:text-indigo-400

                            sm:tracking-[0.18em]
                        "
                    >
                        {label}
                    </span>

                    {/* =====================================
                        MODAL TITLE

                        Do not use truncate here.

                        The entire title must remain
                        readable on narrow screens.
                    ====================================== */}

                    <h2
                        id="project-create-modal-title"
                        className="
                            min-w-0

                            break-words

                            text-base
                            font-black

                            leading-tight
                            tracking-tight

                            text-slate-900
                            dark:text-white

                            min-[380px]:text-lg

                            sm:text-2xl
                        "
                    >
                        {title}
                    </h2>

                    {/* =====================================
                        DESCRIPTION

                        Visible on mobile too, using
                        smaller text and natural wrapping.
                    ====================================== */}

                    <p
                        id="project-create-modal-description"
                        className="
                            mt-1

                            max-w-xl
                            min-w-0

                            break-words

                            text-[11px]
                            font-medium
                            leading-[1.5]

                            text-slate-600
                            dark:text-slate-400

                            sm:mt-1.5
                            sm:text-xs
                            sm:leading-5
                        "
                    >
                        {description}
                    </p>
                </div>
            </div>

            {/* =============================================
                CLOSE BUTTON

                - 44px touch target
                - Never closes while submitting
                - Always visible in the header
            ============================================== */}

            <button
                type="button"
                onClick={onClose}
                disabled={!canClose}
                aria-label="Loyiha modalini yopish"
                title="Yopish"
                className="
                    grid

                    h-11
                    w-11

                    shrink-0

                    place-items-center

                    rounded-xl
                    border

                    border-slate-200
                    bg-slate-50

                    text-slate-500

                    transition-colors
                    duration-200

                    enabled:hover:border-red-300
                    enabled:hover:bg-red-50
                    enabled:hover:text-red-700

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-red-500/50
                    focus-visible:ring-offset-2

                    enabled:active:scale-[0.96]

                    disabled:cursor-not-allowed
                    disabled:opacity-40

                    dark:border-white/[0.08]
                    dark:bg-white/[0.04]
                    dark:text-slate-400

                    dark:enabled:hover:border-red-400/25
                    dark:enabled:hover:bg-red-500/[0.08]
                    dark:enabled:hover:text-red-300

                    dark:focus-visible:ring-offset-[#0b1018]

                    motion-reduce:transform-none
                    motion-reduce:transition-none
                "
            >
                <X
                    size={19}
                    aria-hidden="true"
                />
            </button>
        </header>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProjectCreateHeader);
