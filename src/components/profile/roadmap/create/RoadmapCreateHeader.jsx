
import React, { memo } from "react";

import {
    Map,
    Pencil,
    X,
} from "lucide-react";

// =========================================================
// CONFIG
// =========================================================

const MODAL_CONTENT = {
    create: {
        title: "Yangi roadmap yaratish",

        description:
            "O‘rganish yoki professional tajribangizni timeline ko‘rinishida saqlang.",
    },

    edit: {
        title: "Roadmapni tahrirlash",

        description:
            "Roadmap bosqichingiz haqidagi ma’lumotlarni yangilang.",
    },
};

// =========================================================
// ROADMAP CREATE HEADER
//
// Props:
//
// isEditMode:
//   Create / Edit mode.
//
// isLoading:
//   Disables close action during submission.
//
// onClose:
//   Parent modal's handleClose function.
//
// Responsibilities:
//
// - Modal title
// - Modal description
// - F.Society Roadmap branding
// - Mode-specific icon
// - Close button
//
// No Redux / API dependencies.
// =========================================================

const RoadmapCreateHeader = ({
    isEditMode = false,
    isLoading = false,
    onClose,
}) => {
    // =====================================================
    // MODE CONTENT
    // =====================================================

    const content = isEditMode
        ? MODAL_CONTENT.edit
        : MODAL_CONTENT.create;

    const Icon = isEditMode
        ? Pencil
        : Map;

    // =====================================================
    // CLOSE PERMISSION
    // =====================================================

    const canClose =
        !isLoading &&
        typeof onClose === "function";

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <header
            className="
                relative
                z-10

                flex
                min-w-0
                items-start
                justify-between
                gap-4

                border-b
                border-slate-200

                px-5
                py-5

                dark:border-white/[0.06]

                sm:px-7
                sm:py-6
            "
        >
            {/* =====================================
                HEADING CONTENT
            ====================================== */}

            <div
                className="
                    flex
                    min-w-0
                    items-start
                    gap-4
                "
            >
                {/* =================================
                    MODE ICON
                ================================== */}

                <div
                    aria-hidden="true"
                    className="
                        flex
                        h-12
                        w-12
                        shrink-0

                        items-center
                        justify-center

                        rounded-2xl
                        border

                        border-indigo-200
                        bg-indigo-50

                        text-indigo-700

                        shadow-lg
                        shadow-indigo-500/[0.08]

                        dark:border-indigo-400/20
                        dark:bg-indigo-500/[0.08]
                        dark:text-indigo-300
                    "
                >
                    <Icon size={21} />
                </div>

                {/* =================================
                    TEXT CONTENT
                ================================== */}

                <div className="min-w-0">
                    {/* BRAND LABEL */}

                    <div
                        className="
                            mb-1.5

                            inline-flex
                            items-center
                            gap-2

                            text-[9px]
                            font-black

                            uppercase
                            tracking-[0.18em]

                            text-indigo-700
                            dark:text-indigo-400
                        "
                    >
                        <span
                            aria-hidden="true"
                            className="
                                h-1.5
                                w-1.5

                                rounded-full

                                bg-indigo-500

                                shadow-[0_0_8px_rgba(129,140,248,0.8)]
                            "
                        />

                        F.Society Roadmap
                    </div>

                    {/* MODAL TITLE */}

                    <h2
                        id="roadmap-modal-title"
                        className="
                            break-words

                            text-xl
                            font-black
                            tracking-tight

                            text-slate-900
                            dark:text-white

                            sm:text-2xl
                        "
                    >
                        {content.title}
                    </h2>

                    {/* MODAL DESCRIPTION */}

                    <p
                        id="roadmap-modal-description"
                        className="
                            mt-1

                            max-w-xl

                            text-xs
                            font-medium
                            leading-5

                            text-slate-600
                            dark:text-slate-400

                            sm:text-sm
                        "
                    >
                        {content.description}
                    </p>
                </div>
            </div>

            {/* =====================================
                CLOSE BUTTON
            ====================================== */}

            <button
                type="button"
                onClick={onClose}
                disabled={!canClose}
                aria-label="Modalni yopish"
                title="Yopish"
                className="
                    flex
                    h-10
                    w-10
                    shrink-0

                    items-center
                    justify-center

                    rounded-xl
                    border

                    border-slate-200
                    bg-slate-50

                    text-slate-500

                    transition-all
                    duration-200

                    hover:border-red-300
                    hover:bg-red-50
                    hover:text-red-700

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-red-500/50

                    active:scale-[0.94]

                    disabled:cursor-not-allowed
                    disabled:opacity-40

                    dark:border-white/[0.06]
                    dark:bg-white/[0.025]
                    dark:text-slate-400

                    dark:hover:border-red-400/20
                    dark:hover:bg-red-500/[0.07]
                    dark:hover:text-red-300

                    motion-reduce:transform-none
                "
            >
                <X
                    size={18}
                    aria-hidden="true"
                />
            </button>
        </header>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(RoadmapCreateHeader);
