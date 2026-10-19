
// src/components/posts/create/PostCreateHeader.jsx

import React, { memo } from "react";

import {
    PenLine,
    Sparkles,
    X,
} from "lucide-react";

// =========================================================
// POST CREATE HEADER
//
// Features:
// - Create / Edit mode
// - Modal title
// - Description
// - Close button
// - Loading protection
// - Responsive mobile / tablet / desktop
// - Light / Dark Mode
// - Keyboard accessibility
//
// Form and API logic remain in CreatePostModal.
// =========================================================

const PostCreateHeader = ({
    isEditMode = false,
    isSubmitting = false,
    onClose,
}) => {
    // =====================================================
    // MODE CONTENT
    // =====================================================

    const modalTitle = isEditMode
        ? "Postni tahrirlash"
        : "Yangi post yaratish";

    const modalDescription = isEditMode
        ? "Postingizni yangilang va o‘zgarishlarni saqlang."
        : "Bilimingiz, tajribangiz yoki g‘oyangizni F.Society community bilan ulashing.";

    const Icon = isEditMode
        ? PenLine
        : Sparkles;

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
                sm:py-6
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

                    sm:gap-4
                "
            >
                {/* =========================================
                    MODE ICON
                ========================================== */}

                <div
                    aria-hidden="true"
                    className="
                        flex
                        h-10
                        w-10

                        shrink-0

                        items-center
                        justify-center

                        rounded-xl
                        border

                        border-indigo-200
                        bg-indigo-50
                        text-indigo-700

                        shadow-md
                        shadow-indigo-500/10

                        dark:border-indigo-400/25
                        dark:bg-indigo-500/10
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
                            sm:h-[22px]
                            sm:w-[22px]
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
                        BRAND LABEL
                    ====================================== */}

                    <div
                        className="
                            mb-1.5

                            inline-flex
                            max-w-full

                            items-center
                            gap-1.5

                            rounded-full
                            border

                            border-indigo-200
                            bg-indigo-50

                            px-2
                            py-1

                            text-[8px]
                            font-black

                            uppercase
                            tracking-[0.10em]

                            text-indigo-700

                            dark:border-indigo-400/20
                            dark:bg-indigo-500/[0.08]
                            dark:text-indigo-300

                            sm:gap-2
                            sm:px-2.5
                            sm:text-[9px]
                            sm:tracking-[0.18em]
                        "
                    >
                        <span
                            aria-hidden="true"
                            className="
                                h-1.5
                                w-1.5

                                shrink-0
                                rounded-full

                                bg-indigo-500

                                shadow-[0_0_8px_rgba(129,140,248,0.8)]
                            "
                        />

                        <span className="truncate">
                            FSociety Posts
                        </span>
                    </div>

                    {/* =====================================
                        MODAL TITLE
                    ====================================== */}

                    <h2
                        id="post-create-modal-title"
                        className="
                            min-w-0

                            break-words

                            text-base
                            font-black

                            leading-snug
                            tracking-tight

                            text-slate-900

                            dark:text-white

                            min-[380px]:text-lg

                            sm:text-2xl
                        "
                    >
                        {modalTitle}
                    </h2>

                    {/* =====================================
                        DESCRIPTION

                        Never use fixed widths here.
                        Text can wrap on small screens.
                    ====================================== */}

                    <p
                        id="post-create-modal-description"
                        className="
                            mt-1

                            max-w-xl

                            break-words

                            text-[11px]
                            font-medium
                            leading-[1.55]

                            text-slate-600

                            dark:text-slate-400

                            sm:mt-1.5
                            sm:text-sm
                            sm:leading-5
                        "
                    >
                        {modalDescription}
                    </p>
                </div>
            </div>

            {/* =============================================
                CLOSE BUTTON

                - Minimum 44px touch target
                - Prevent close while submitting
                - Always stays visible
            ============================================== */}

            <button
                type="button"
                onClick={onClose}
                disabled={!canClose}
                aria-label="Post modalini yopish"
                title="Yopish"
                className="
                    flex
                    h-11
                    w-11

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
                    focus-visible:ring-offset-2

                    disabled:cursor-not-allowed
                    disabled:opacity-40

                    dark:border-white/[0.08]
                    dark:bg-white/[0.04]
                    dark:text-slate-400

                    dark:hover:border-red-400/30
                    dark:hover:bg-red-500/10
                    dark:hover:text-red-300

                    dark:focus-visible:ring-offset-[#0b1018]

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

export default memo(PostCreateHeader);
