
import React, { memo } from "react";

import {
    Clock3,
    Loader2,
    Rocket,
    Save,
    X,
} from "lucide-react";

// =========================================================
// FOOTER BUTTON STYLES
// =========================================================

const CANCEL_BUTTON_CLASS = `
    inline-flex
    min-h-[43px]

    items-center
    justify-center
    gap-2

    rounded-xl
    border

    border-slate-300
    bg-slate-100

    px-5
    py-2.5

    text-xs
    font-black

    text-slate-700

    transition-all
    duration-200

    hover:border-slate-400
    hover:bg-slate-200

    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-indigo-500/50

    active:scale-[0.97]

    disabled:cursor-not-allowed
    disabled:opacity-40

    dark:border-white/[0.07]
    dark:bg-white/[0.025]
    dark:text-slate-300

    dark:hover:border-white/[0.12]
    dark:hover:bg-white/[0.05]
    dark:hover:text-white

    motion-reduce:transform-none
`;

const SUBMIT_BUTTON_CLASS = `
    group
    relative

    inline-flex
    min-h-[43px]
    min-w-[190px]

    items-center
    justify-center
    gap-2

    overflow-hidden

    rounded-xl
    border

    border-indigo-400/30

    bg-gradient-to-r
    from-indigo-600
    to-violet-600

    px-5
    py-2.5

    text-xs
    font-black
    text-white

    shadow-lg
    shadow-indigo-600/20

    transition-all
    duration-200

    hover:-translate-y-0.5
    hover:shadow-indigo-500/30

    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-indigo-500/50

    active:translate-y-0
    active:scale-[0.98]

    disabled:cursor-not-allowed
    disabled:opacity-50

    disabled:hover:translate-y-0

    motion-reduce:transform-none
`;

// =========================================================
// ROADMAP CREATE FOOTER
//
// Props:
//
// isEditMode:
//   false -> Roadmap yaratish
//   true  -> O‘zgarishlarni saqlash
//
// isLoading:
//   Parent modal busy state.
//
// onClose:
//   Parent modal handleClose.
//
// IMPORTANT:
//
// Submit button has type="submit".
// It must be rendered inside the parent <form>.
//
// It does NOT call onSubmit directly.
//
// This preserves native form validation and the
// original RoadmapCreateModal handleSubmit flow.
// =========================================================

const RoadmapCreateFooter = ({
    isEditMode = false,
    isLoading = false,
    onClose,
}) => {
    // =====================================================
    // SUBMIT LABEL
    // =====================================================

    const submitText = isEditMode
        ? "O‘zgarishlarni saqlash"
        : "Roadmap yaratish";

    const loadingText = isEditMode
        ? "Saqlanmoqda..."
        : "Yaratilmoqda...";

    // =====================================================
    // SUBMIT ICON
    // =====================================================

    const SubmitIcon = isEditMode
        ? Save
        : Rocket;

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
        <footer
            className="
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
                dark:bg-black/[0.10]

                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:px-7
            "
        >
            {/* =====================================
                ESC INFORMATION
            ====================================== */}

            <div
                className="
                    hidden

                    items-center
                    gap-2

                    text-[10px]
                    font-medium

                    text-slate-500
                    dark:text-slate-400

                    sm:flex
                "
            >
                <Clock3
                    size={13}
                    aria-hidden="true"
                />

                <span>
                    ESC tugmasi orqali modalni
                    yopishingiz mumkin.
                </span>
            </div>

            {/* =====================================
                ACTION BUTTONS
            ====================================== */}

            <div
                className="
                    flex
                    flex-col
                    gap-2

                    sm:flex-row
                "
            >
                {/* =================================
                    CANCEL
                ================================== */}

                <button
                    type="button"
                    onClick={onClose}
                    disabled={!canClose}
                    className={CANCEL_BUTTON_CLASS}
                >
                    <X
                        size={15}
                        aria-hidden="true"
                    />

                    Bekor qilish
                </button>

                {/* =================================
                    SUBMIT
                ================================== */}

                <button
                    type="submit"
                    disabled={isLoading}
                    aria-busy={isLoading}
                    className={SUBMIT_BUTTON_CLASS}
                >
                    {/* SHINE ANIMATION */}

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
                            gap-2
                        "
                    >
                        {isLoading ? (
                            <>
                                <Loader2
                                    size={16}
                                    aria-hidden="true"
                                    className="
                                        animate-spin
                                        motion-reduce:animate-none
                                    "
                                />

                                {loadingText}
                            </>
                        ) : (
                            <>
                                <SubmitIcon
                                    size={16}
                                    aria-hidden="true"
                                />

                                {submitText}
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

export default memo(RoadmapCreateFooter);
