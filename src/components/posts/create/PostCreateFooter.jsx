
import React, { memo } from "react";

import {
    Loader2,
    Save,
    Send,
    X,
} from "lucide-react";

// =========================================================
// BUTTON STYLES
// =========================================================

const CANCEL_BUTTON_CLASS = `
    inline-flex
    min-h-[46px]

    items-center
    justify-center
    gap-2

    rounded-2xl
    border

    border-slate-200
    bg-slate-100

    px-5
    py-3

    text-sm
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

    dark:border-white/[0.08]
    dark:bg-white/[0.03]
    dark:text-slate-300

    dark:hover:border-white/[0.14]
    dark:hover:bg-white/[0.06]
    dark:hover:text-white

    motion-reduce:transform-none
`;

const SUBMIT_BUTTON_CLASS = `
    group
    relative

    inline-flex
    min-h-[46px]
    min-w-[210px]

    items-center
    justify-center
    gap-2

    overflow-hidden

    rounded-2xl
    border

    border-indigo-400/30

    bg-gradient-to-r
    from-indigo-600
    via-violet-600
    to-purple-600

    px-6
    py-3

    text-sm
    font-black
    text-white

    shadow-xl
    shadow-indigo-600/20

    transition-all
    duration-300

    hover:-translate-y-0.5
    hover:shadow-indigo-500/30

    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-indigo-500/50

    active:translate-y-0
    active:scale-[0.98]

    disabled:cursor-not-allowed
    disabled:opacity-60
    disabled:hover:translate-y-0

    motion-reduce:transform-none
`;

// =========================================================
// POST CREATE FOOTER
//
// Props:
//
// isEditMode:
//   false = Create
//   true  = Edit
//
// isSubmitting:
//   Prevents duplicate submit and closing.
//
// onClose:
//   Parent CreatePostModal's handleClose.
//
// IMPORTANT:
//
// Submit button uses type="submit".
//
// The parent <form> handles onSubmit.
//
// This component does not:
// - Make API requests
// - Display success/error toasts
// - Validate form data
// - Manage Create/Edit state
// =========================================================

const PostCreateFooter = ({
    isEditMode = false,
    isSubmitting = false,
    onClose,
}) => {
    // =====================================================
    // BUTTON LABELS
    // =====================================================

    const submitText = isEditMode
        ? "O‘zgarishlarni saqlash"
        : "Postni chop etish";

    const loadingText = isEditMode
        ? "Saqlanmoqda..."
        : "Chop etilmoqda...";

    // =====================================================
    // ICON
    // =====================================================

    const SubmitIcon = isEditMode
        ? Save
        : Send;

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
        <footer
            className="
                relative
                z-10

                flex
                min-w-0

                flex-col-reverse
                gap-3

                border-t
                border-slate-200

                bg-slate-50/80

                px-5
                py-4

                dark:border-white/[0.06]
                dark:bg-black/15

                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:px-7
            "
        >
            {/* =====================================
                ESC INFORMATION
            ====================================== */}

            <p
                className="
                    hidden
                    text-[10px]
                    font-medium

                    text-slate-500
                    dark:text-slate-400

                    sm:block
                "
            >
                ESC orqali ham yopishingiz mumkin.
            </p>

            {/* =====================================
                FOOTER ACTIONS
            ====================================== */}

            <div
                className="
                    flex
                    min-w-0

                    flex-col
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
                    aria-label="Post yaratishni bekor qilish"
                    className={CANCEL_BUTTON_CLASS}
                >
                    <X
                        size={17}
                        aria-hidden="true"
                    />

                    <span>
                        Bekor qilish
                    </span>
                </button>

                {/* =================================
                    SUBMIT BUTTON

                    Must remain inside the form.
                ================================== */}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                    className={SUBMIT_BUTTON_CLASS}
                >
                    {/* =============================
                        DECORATIVE SHINE
                    ============================== */}

                    <span
                        aria-hidden="true"
                        className="
                            pointer-events-none

                            absolute
                            inset-y-0
                            -left-20

                            w-16
                            rotate-12

                            bg-white/15
                            blur-md

                            transition-all
                            duration-700

                            group-hover:left-[120%]
                            group-focus-visible:left-[120%]
                        "
                    />

                    {/* =============================
                        BUTTON CONTENT
                    ============================== */}

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
                                {/* LOADING ICON */}

                                <Loader2
                                    size={18}
                                    aria-hidden="true"
                                    className="
                                        animate-spin
                                        motion-reduce:animate-none
                                    "
                                />

                                {/* LOADING TEXT */}

                                <span>
                                    {loadingText}
                                </span>
                            </>
                        ) : (
                            <>
                                {/* SUBMIT ICON */}

                                <SubmitIcon
                                    size={18}
                                    aria-hidden="true"
                                />

                                {/* SUBMIT TEXT */}

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

export default memo(PostCreateFooter);
