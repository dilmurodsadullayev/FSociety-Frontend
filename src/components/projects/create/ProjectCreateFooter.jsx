
// src/components/projects/create/ProjectCreateFooter.jsx

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

    min-h-11
    min-w-0
    w-full

    items-center
    justify-center
    gap-2

    rounded-xl
    border

    border-slate-200
    bg-slate-100

    px-3
    py-2.5

    text-xs
    font-black

    text-slate-700

    transition-colors
    duration-200

    enabled:hover:border-slate-300
    enabled:hover:bg-slate-200

    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-indigo-500/50
    focus-visible:ring-offset-2

    enabled:active:scale-[0.98]

    disabled:cursor-not-allowed
    disabled:opacity-40

    dark:border-white/[0.08]
    dark:bg-white/[0.04]
    dark:text-slate-300

    dark:enabled:hover:border-white/[0.14]
    dark:enabled:hover:bg-white/[0.08]
    dark:enabled:hover:text-white

    dark:focus-visible:ring-offset-[#0b1018]

    sm:w-auto
    sm:rounded-2xl
    sm:px-5
    sm:py-3
    sm:text-sm

    motion-reduce:transform-none
    motion-reduce:transition-none
`;

const SUBMIT_BUTTON_CLASS = `
    group
    relative

    inline-flex

    min-h-11
    min-w-0
    w-full

    items-center
    justify-center
    gap-2

    overflow-hidden

    rounded-xl
    border

    border-indigo-400/30
    bg-indigo-600

    px-3
    py-2.5

    text-xs
    font-black
    text-white

    shadow-lg
    shadow-indigo-600/20

    transition-colors
    duration-200

    enabled:hover:bg-indigo-500
    enabled:hover:shadow-indigo-500/30

    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-indigo-500/50
    focus-visible:ring-offset-2

    enabled:active:scale-[0.98]

    disabled:cursor-not-allowed
    disabled:bg-indigo-300
    disabled:text-white/80
    disabled:shadow-none

    dark:disabled:bg-indigo-700/40
    dark:disabled:text-slate-400

    dark:focus-visible:ring-offset-[#0b1018]

    sm:w-auto
    sm:min-w-[190px]
    sm:rounded-2xl
    sm:px-6
    sm:py-3
    sm:text-sm

    motion-reduce:transform-none
    motion-reduce:transition-none
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
// - Submit button uses type="submit".
// - This component stays inside the parent form.
// - Parent handles validation and API requests.
// - Parent closes modal after successful submission.
//
// RESPONSIVE:
//
// Small mobile:
// - Vertical buttons
//
// Wide mobile:
// - Two equal-width buttons
//
// Tablet / Desktop:
// - Horizontal action buttons
//
// This footer remains outside the parent form's
// scrollable content area.
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
    // BUTTON LABELS
    // =====================================================

    const submitText = isEditMode
        ? "O‘zgarishlarni saqlash"
        : "Loyihani yaratish";

    const loadingText = isEditMode
        ? "Saqlanmoqda..."
        : "Yaratilmoqda...";

    const displayText = isSubmitting
        ? loadingText
        : stackLoading
            ? "Stack yuklanmoqda..."
            : submitText;

    const SubmitIcon = isEditMode
        ? Save
        : Rocket;

    const showSpinner =
        isSubmitting ||
        stackLoading;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <footer
            className="
                relative
                z-20

                w-full
                min-w-0
                shrink-0

                border-t
                border-slate-200

                bg-white/95

                px-3
                pt-3

                pb-[max(12px,env(safe-area-inset-bottom))]

                backdrop-blur-xl

                dark:border-white/[0.08]
                dark:bg-[#0b1018]/95

                min-[380px]:px-4

                sm:px-7
                sm:py-4
            "
        >
            {/* =============================================
                FOOTER LAYOUT
            ============================================== */}

            <div
                className="
                    flex
                    w-full
                    min-w-0

                    flex-col
                    gap-2.5

                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    sm:gap-4
                "
            >
                {/* =========================================
                    FOOTER INFORMATION

                    Hidden on smaller screens to leave
                    enough space for action buttons.
                ========================================== */}

                <div
                    className="
                        hidden
                        min-w-0

                        items-center
                        gap-2

                        text-[10px]
                        font-medium
                        leading-5

                        text-slate-500
                        dark:text-slate-400

                        lg:flex
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

                    <span className="min-w-0">
                        Tillar, texnologiyalar va rasmlarni
                        tekshirib, keyin saqlang.
                    </span>
                </div>

                {/* =========================================
                    ACTION BUTTONS

                    Below 380px:
                    - One column

                    From 380px:
                    - Two equal columns

                    From sm:
                    - Compact horizontal buttons
                ========================================== */}

                <div
                    className="
                        grid
                        w-full
                        min-w-0

                        grid-cols-1
                        gap-2

                        min-[380px]:grid-cols-2

                        sm:ml-auto
                        sm:flex
                        sm:w-auto
                        sm:items-center
                        sm:gap-2.5
                    "
                >
                    {/* =====================================
                        CANCEL BUTTON
                    ====================================== */}

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={!canClose}
                        aria-label="Loyihani yaratish yoki tahrirlashni bekor qilish"
                        className={CANCEL_BUTTON_CLASS}
                    >
                        Bekor qilish
                    </button>

                    {/* =====================================
                        SUBMIT BUTTON

                        Must remain inside parent form.
                    ====================================== */}

                    <button
                        type="submit"
                        disabled={submitDisabled}
                        aria-busy={isSubmitting}
                        className={SUBMIT_BUTTON_CLASS}
                    >
                        {/* =================================
                            DECORATIVE SHINE
                        ================================== */}

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
                                group-focus-visible:left-[120%]

                                motion-reduce:transition-none
                            "
                        />

                        {/* =================================
                            BUTTON CONTENT
                        ================================== */}

                        <span
                            className="
                                relative
                                z-10

                                inline-flex
                                min-w-0

                                items-center
                                justify-center
                                gap-2
                            "
                        >
                            {showSpinner ? (
                                <>
                                    {/* LOADING ICON */}

                                    <Loader2
                                        size={17}
                                        aria-hidden="true"
                                        className="
                                            shrink-0

                                            animate-spin
                                            motion-reduce:animate-none
                                        "
                                    />
                                </>
                            ) : (
                                <>
                                    {/* CREATE / EDIT ICON */}

                                    <SubmitIcon
                                        size={17}
                                        aria-hidden="true"
                                        className="shrink-0"
                                    />
                                </>
                            )}

                            {/* BUTTON TEXT */}

                            <span
                                aria-live="polite"
                                className="
                                    min-w-0
                                    text-center
                                    break-words
                                "
                            >
                                {displayText}
                            </span>
                        </span>
                    </button>
                </div>
            </div>
        </footer>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProjectCreateFooter);
