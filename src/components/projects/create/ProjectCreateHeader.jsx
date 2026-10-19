
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
//
// isEditMode:
//   false -> Yangi loyiha
//   true  -> Loyihani tahrirlash
//
// isSubmitting:
//   Prevent closing while saving.
//
// onClose:
//   Parent modal close callback.
//
// No Redux or API logic.
// =========================================================

const ProjectCreateHeader = ({
    isEditMode = false,
    isSubmitting = false,
    onClose,
}) => {
    // =====================================================
    // CONTENT
    // =====================================================

    const title = isEditMode
        ? "Loyihani tahrirlash"
        : "Yangi loyiha";

    const description = isEditMode
        ? "Loyiha ma’lumotlari, stack va rasmlarini yangilang."
        : "Yangi loyihangizni F.Society hamjamiyatiga taqdim eting.";

    const label = isEditMode
        ? "Edit Project"
        : "New Project";

    const Icon = isEditMode
        ? Pencil
        : Rocket;

    // =====================================================
    // PERMISSIONS
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
                min-w-0
                shrink-0

                items-start
                justify-between
                gap-4

                border-b
                border-slate-200

                bg-white/95

                px-5
                py-5

                backdrop-blur-xl

                dark:border-white/[0.06]
                dark:bg-[#0b1018]/95

                sm:px-7
            "
        >
            {/* =====================================
                HEADER CONTENT
            ====================================== */}

            <div
                className="
                    flex
                    min-w-0

                    items-center
                    gap-4
                "
            >
                {/* =================================
                    MODE ICON
                ================================== */}

                <div
                    aria-hidden="true"
                    className="
                        grid
                        h-12
                        w-12
                        shrink-0

                        place-items-center

                        rounded-2xl
                        border

                        border-indigo-200
                        bg-indigo-50

                        text-indigo-700

                        dark:border-indigo-400/20
                        dark:bg-indigo-500/[0.08]
                        dark:text-indigo-300
                    "
                >
                    <Icon size={21} />
                </div>

                {/* =================================
                    TEXT
                ================================== */}

                <div className="min-w-0">
                    {/* MODE LABEL */}

                    <span
                        className="
                            mb-1
                            inline-block

                            text-[9px]
                            font-black

                            uppercase
                            tracking-[0.18em]

                            text-indigo-700
                            dark:text-indigo-400
                        "
                    >
                        {label}
                    </span>

                    {/* MODAL TITLE */}

                    <h2
                        id="project-create-modal-title"
                        className="
                            truncate

                            text-xl
                            font-black

                            text-slate-900
                            dark:text-white

                            sm:text-2xl
                        "
                    >
                        {title}
                    </h2>

                    {/* DESCRIPTION */}

                    <p
                        id="project-create-modal-description"
                        className="
                            mt-1

                            hidden

                            text-xs
                            font-medium
                            leading-5

                            text-slate-600
                            dark:text-slate-400

                            sm:block
                        "
                    >
                        {description}
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
                aria-label="Loyiha modalini yopish"
                title="Yopish"
                className="
                    grid
                    h-10
                    w-10
                    shrink-0

                    place-items-center

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

                    active:scale-[0.96]

                    disabled:cursor-not-allowed
                    disabled:opacity-40

                    dark:border-white/[0.06]
                    dark:bg-white/[0.025]
                    dark:text-slate-400

                    dark:hover:border-red-400/25
                    dark:hover:bg-red-500/[0.08]
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

export default memo(ProjectCreateHeader);
