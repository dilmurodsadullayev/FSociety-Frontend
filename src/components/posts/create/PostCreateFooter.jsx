
// src/components/posts/create/PostCreateFooter.jsx

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

    transition-all
    duration-200

    hover:border-slate-300
    hover:bg-slate-200

    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-indigo-500/50
    focus-visible:ring-offset-2

    active:scale-[0.98]

    disabled:cursor-not-allowed
    disabled:opacity-40

    dark:border-white/[0.08]
    dark:bg-white/[0.04]
    dark:text-slate-300

    dark:hover:border-white/[0.14]
    dark:hover:bg-white/[0.08]
    dark:hover:text-white

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

    bg-gradient-to-r
    from-indigo-600
    via-violet-600
    to-purple-600

    px-3
    py-2.5

    text-xs
    font-black
    text-white

    shadow-lg
    shadow-indigo-600/20

    transition-all
    duration-300

    hover:shadow-indigo-500/30

    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-indigo-500/50
    focus-visible:ring-offset-2

    active:scale-[0.98]

    disabled:cursor-not-allowed
    disabled:opacity-60

    sm:w-auto
    sm:min-w-[190px]
    sm:rounded-2xl
    sm:px-6
    sm:py-3
    sm:text-sm

    sm:hover:-translate-y-0.5
    sm:disabled:hover:translate-y-0

    dark:focus-visible:ring-offset-[#0b1018]

    motion-reduce:transform-none
    motion-reduce:transition-none
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
//   Parent CreatePostModal handleClose.
//
// RESPONSIVE:
// - Small mobile: stacked buttons
// - Wide mobile: two equal columns
// - Desktop: compact horizontal actions
//
// IMPORTANT:
// - Submit button remains type="submit".
// - Parent form handles onSubmit.
// - This component performs no API requests.
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
                z-20

                w-full
                min-w-0
                shrink-0

                border-t
                border-slate-200

                bg-slate-50/95

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
                    KEYBOARD HINT

                    Hidden on mobile because vertical
                    screen space is limited.
                ========================================== */}

                <p
                    className="
                        hidden
                        shrink-0

                        text-[10px]
                        font-medium

                        text-slate-500

                        dark:text-slate-400

                        sm:block
                    "
                >
                    {isSubmitting
                        ? "Iltimos, jarayon tugashini kuting."
                        : "ESC orqali ham yopishingiz mumkin."}
                </p>

                {/* =========================================
                    ACTION BUTTONS

                    Under 380px:
                    - 1 column

                    380px and above:
                    - 2 equal columns

                    Desktop:
                    - Compact horizontal actions
                ========================================== */}

                <div
                    className="
                        grid
                        w-full
                        min-w-0

                        grid-cols-1
                        gap-2

                        min-[380px]:grid-cols-2

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
                        aria-label="Post yaratish yoki tahrirlashni bekor qilish"
                        className={CANCEL_BUTTON_CLASS}
                    >
                        <X
                            size={17}
                            aria-hidden="true"
                            className="shrink-0"
                        />

                        <span>
                            Bekor qilish
                        </span>
                    </button>

                    {/* =====================================
                        SUBMIT BUTTON

                        Must remain inside parent form.
                    ====================================== */}

                    <button
                        type="submit"
                        disabled={isSubmitting}
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
                                -left-20

                                w-16
                                rotate-12

                                bg-white/15
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
                            {isSubmitting ? (
                                <>
                                    <Loader2
                                        size={18}
                                        aria-hidden="true"
                                        className="
                                            shrink-0

                                            animate-spin
                                            motion-reduce:animate-none
                                        "
                                    />

                                    <span className="text-center">
                                        {loadingText}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <SubmitIcon
                                        size={18}
                                        aria-hidden="true"
                                        className="shrink-0"
                                    />

                                    <span className="text-center">
                                        {submitText}
                                    </span>
                                </>
                            )}
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

export default memo(PostCreateFooter);
