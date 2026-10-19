
import React, { memo } from "react";

import {
    Loader2,
    Rocket,
    Save,
    Sparkles,
} from "lucide-react";

// =========================================================
// BUTTON STYLES
// =========================================================

const CANCEL_BUTTON_CLASS = `
    inline-flex
    min-h-[42px]

    items-center
    justify-center
    gap-2

    rounded-xl
    border

    border-slate-200
    bg-slate-100

    px-5
    py-2.5

    text-xs
    font-black

    text-slate-700

    transition-all
    duration-200

    hover:border-slate-300
    hover:bg-slate-200

    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-indigo-500/50

    active:scale-[0.98]

    disabled:cursor-not-allowed
    disabled:opacity-40

    dark:border-white/[0.07]
    dark:bg-white/[0.025]
    dark:text-slate-400

    dark:hover:border-white/[0.12]
    dark:hover:bg-white/[0.05]
    dark:hover:text-white

    motion-reduce:transform-none
`;

const SUBMIT_BUTTON_CLASS = `
    group

    relative
    inline-flex
    min-h-[42px]

    items-center
    justify-center
    gap-2

    overflow-hidden

    rounded-xl
    border

    border-indigo-400/30
    bg-indigo-600

    px-5
    py-2.5

    text-xs
    font-black
    text-white

    shadow-lg
    shadow-indigo-600/20

    transition-all
    duration-200

    hover:bg-indigo-500
    hover:shadow-indigo-500/30

    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-indigo-500/50

    active:scale-[0.98]

    disabled:cursor-not-allowed
    disabled:bg-indigo-300
    disabled:text-white/80
    disabled:shadow-none

    dark:disabled:bg-indigo-700/40
    dark:disabled:text-slate-400

    motion-reduce:transform-none
`;

// =========================================================
// PROJECT CREATE FOOTER
//
// Props:
//
// isEditMode:
//   false -> Create project
//   true  -> Update project
//
// isSubmitting:
//   Parent/local submitting state.
//
// stackLoading:
//   Whether languages/technologies are loading.
//
// onClose:
//   Parent handleClose callback.
//
// IMPORTANT:
//
// The submit button uses type="submit".
//
// It must remain inside:
//
// <form onSubmit={handleSubmit}>
//
// This component does NOT:
//
// - Validate project fields
// - Build FormData
// - Call ProjectService
// - Display toast messages
// - Close modal after API success
// =========================================================

const ProjectCreateFooter = ({
    isEditMode = false,
    isSubmitting = false,
    stackLoading = false,
    onClose,
}) => {
    // =====================================================
    // PERMISSIONS
    // =====================================================

    const canClose =
        !isSubmitting &&
        typeof onClose === "function";

    const submitDisabled =
        isSubmitting ||
        stackLoading;

    // =====================================================
    // LABELS
    // =====================================================

    const submitText = isEditMode
        ? "O‘zgarishlarni saqlash"
        : "Loyihani yaratish";

    const loadingText = isEditMode
        ? "Saqlanmoqda..."
        : "Yaratilmoqda...";

    const SubmitIcon = isEditMode
        ? Save
        : Rocket;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <footer
            className="
                sticky
                bottom-0
                z-20

                flex
                min-w-0
                flex-col-reverse
                gap-3

                border-t
                border-slate-200

                bg-white/95

                px-5
                py-4

                backdrop-blur-xl

                dark:border-white/[0.06]
                dark:bg-[#0b1018]/95

                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:px-7
            "
        >
            {/* =====================================
                FOOTER INFORMATION
            ====================================== */}

            <div
                className="
                    hidden

                    items-center
                    gap-2

                    text-[10px]
                    font-medium
                    leading-5

                    text-slate-500
                    dark:text-slate-400

                    md:flex
                "
            >
                <Sparkles
                    size={14}
                    aria-hidden="true"
                    className="
                        shrink-0

                        text-indigo-600
                        dark:text-indigo-400
                    "
                />

                <span>
                    Tillar, texnologiyalar va rasmlarni
                    tekshirib, keyin saqlang.
                </span>
            </div>

            {/* =====================================
                ACTION BUTTONS
            ====================================== */}

            <div
                className="
                    flex
                    min-w-0

                    flex-col-reverse
                    gap-2

                    sm:flex-row
                    sm:items-center
                "
            >
                {/* =================================
                    CANCEL BUTTON
                ================================== */}

                <button
                    type="button"
                    onClick={onClose}
                    disabled={!canClose}
                    className={CANCEL_BUTTON_CLASS}
                >
                    Bekor qilish
                </button>

                {/* =================================
                    SUBMIT BUTTON
                ================================== */}

                <button
                    type="submit"
                    disabled={submitDisabled}
                    aria-busy={isSubmitting}
                    className={SUBMIT_BUTTON_CLASS}
                >
                    {/* DECORATIVE SHINE */}

                    <span
                        aria-hidden="true"
                        className="
                            pointer-events-none

                            absolute
                            inset-y-0
                            -left-16

                            w-12
                            rotate-12

                            bg-white/[0.12]
                            blur-md

                            transition-all
                            duration-700

                            group-hover:left-[120%]
                        "
                    />

                    {/* BUTTON CONTENT */}

                    <span
                        className="
                            relative
                            z-10

                            inline-flex
                            items-center
                            justify-center
                            gap-2
                        "
                    >
                        {isSubmitting ? (
                            <>
                                {/* LOADING */}

                                <Loader2
                                    size={16}
                                    aria-hidden="true"
                                    className="
                                        animate-spin
                                        motion-reduce:animate-none
                                    "
                                />

                                <span>
                                    {loadingText}
                                </span>
                            </>
                        ) : (
                            <>
                                {/* ICON */}

                                <SubmitIcon
                                    size={16}
                                    aria-hidden="true"
                                />

                                {/* LABEL */}

                                <span>
                                    {submitText}
                                </span>
                            </>
                        )}
                    </span>
                </button>
            </div>
        </footer>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProjectCreateFooter);
