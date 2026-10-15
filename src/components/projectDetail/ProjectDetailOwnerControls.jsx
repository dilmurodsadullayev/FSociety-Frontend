
import React from "react";

import {
    Loader2,
    Pencil,
    Settings2,
    Trash2,
} from "lucide-react";

// =========================================================
// FSOCIETY — PROJECT DETAIL OWNER CONTROLS
//
// Features:
// - Dark / Light Mode
// - Responsive design
// - Edit project action
// - Delete project action
// - Update loading state
// - Delete loading state
// - Prevent conflicting actions
// - Keyboard accessibility
//
// Props:
// - onEdit
// - onDelete
// - isUpdating
// - isDeleting
//
// API logic remains in the parent controller.
// =========================================================

const ProjectDetailOwnerControls = ({
    onEdit,
    onDelete,
    isUpdating = false,
    isDeleting = false,
}) => {
    // =====================================================
    // STATE
    // =====================================================

    const busy = Boolean(
        isUpdating || isDeleting
    );

    const canEdit =
        typeof onEdit === "function";

    const canDelete =
        typeof onDelete === "function";

    // =====================================================
    // JSX
    // =====================================================

    return (
        <div
            role="group"
            aria-label="Loyiha egasi boshqaruvi"

            className="
                inline-flex
                w-full
                max-w-full

                flex-wrap
                items-center
                gap-1.5

                rounded-2xl
                border
                border-[#dce5f0]

                bg-white/90

                p-1.5

                shadow-[0_6px_24px_rgba(15,23,42,0.045)]

                sm:w-auto

                dark:border-white/[0.08]
                dark:bg-[#0a0e15]/90

                dark:shadow-[0_8px_24px_rgba(0,0,0,0.12)]
            "
        >
            {/* ======================================
                OWNER LABEL
            ====================================== */}

            <div
                className="
                    hidden
                    shrink-0

                    items-center
                    gap-2

                    px-2

                    font-mono
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.1em]

                    text-slate-500

                    lg:inline-flex

                    dark:text-gray-500
                "
            >
                <Settings2
                    size={14}
                    strokeWidth={2}
                    aria-hidden="true"

                    className="
                        text-indigo-600

                        dark:text-indigo-300
                    "
                />

                <span>
                    Owner tools
                </span>
            </div>

            {/* ======================================
                DIVIDER
            ====================================== */}

            <span
                aria-hidden="true"

                className="
                    hidden
                    h-6
                    w-px

                    bg-[#e2e8f0]

                    lg:block

                    dark:bg-white/[0.08]
                "
            />

            {/* ======================================
                EDIT BUTTON
            ====================================== */}

            <button
                type="button"

                onClick={onEdit}

                disabled={
                    busy ||
                    !canEdit
                }

                aria-label={
                    isUpdating
                        ? "Loyiha saqlanmoqda"
                        : "Loyihani tahrirlash"
                }

                aria-busy={Boolean(isUpdating)}

                className="
                    group/edit

                    inline-flex
                    min-h-10
                    min-w-0
                    flex-1

                    items-center
                    justify-center
                    gap-2

                    rounded-xl
                    border
                    border-transparent

                    px-3
                    py-2

                    text-[12px]
                    font-bold

                    text-indigo-700

                    transition-colors
                    duration-150

                    hover:border-indigo-400/25
                    hover:bg-indigo-500/[0.08]
                    hover:text-indigo-800

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-indigo-500

                    disabled:cursor-not-allowed
                    disabled:opacity-50

                    sm:flex-none
                    sm:px-3.5

                    dark:text-indigo-300

                    dark:hover:border-indigo-400/20
                    dark:hover:bg-indigo-400/[0.07]
                    dark:hover:text-indigo-200
                "
            >
                {/* ICON */}

                {isUpdating ? (
                    <Loader2
                        size={16}
                        strokeWidth={2}

                        aria-hidden="true"

                        className="
                            shrink-0
                            animate-spin

                            motion-reduce:animate-none
                        "
                    />
                ) : (
                    <Pencil
                        size={16}
                        strokeWidth={2}

                        aria-hidden="true"

                        className="
                            shrink-0

                            transition-transform
                            duration-150

                            group-hover/edit:-rotate-6

                            motion-reduce:transform-none
                        "
                    />
                )}

                {/* LABEL */}

                <span>
                    {isUpdating
                        ? "Saqlanmoqda"
                        : "Tahrirlash"}
                </span>
            </button>

            {/* ======================================
                DELETE BUTTON
            ====================================== */}

            <button
                type="button"

                onClick={onDelete}

                disabled={
                    busy ||
                    !canDelete
                }

                aria-label={
                    isDeleting
                        ? "Loyiha o‘chirilmoqda"
                        : "Loyihani o‘chirish"
                }

                aria-busy={Boolean(isDeleting)}

                className="
                    group/delete

                    inline-flex
                    min-h-10
                    min-w-0
                    flex-1

                    items-center
                    justify-center
                    gap-2

                    rounded-xl
                    border
                    border-transparent

                    px-3
                    py-2

                    text-[12px]
                    font-bold

                    text-red-700

                    transition-colors
                    duration-150

                    hover:border-red-400/25
                    hover:bg-red-500/[0.07]
                    hover:text-red-800

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-red-500

                    disabled:cursor-not-allowed
                    disabled:opacity-50

                    sm:flex-none
                    sm:px-3.5

                    dark:text-red-400

                    dark:hover:border-red-400/20
                    dark:hover:bg-red-500/[0.08]
                    dark:hover:text-red-300
                "
            >
                {/* ICON */}

                {isDeleting ? (
                    <Loader2
                        size={16}
                        strokeWidth={2}

                        aria-hidden="true"

                        className="
                            shrink-0
                            animate-spin

                            motion-reduce:animate-none
                        "
                    />
                ) : (
                    <Trash2
                        size={16}
                        strokeWidth={2}

                        aria-hidden="true"

                        className="
                            shrink-0

                            transition-transform
                            duration-150

                            group-hover/delete:rotate-6

                            motion-reduce:transform-none
                        "
                    />
                )}

                {/* LABEL */}

                <span>
                    {isDeleting
                        ? "O‘chirilmoqda"
                        : "O‘chirish"}
                </span>
            </button>
        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(
    ProjectDetailOwnerControls
);
