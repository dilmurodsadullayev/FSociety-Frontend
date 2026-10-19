
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
// - Responsive
// - Light / Dark Mode
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
                relative z-10 flex min-w-0
                items-start justify-between gap-4

                border-b border-slate-200
                px-5 py-5

                dark:border-white/[0.06]

                sm:px-7 sm:py-6
            "
        >
            {/* =====================================
                HEADER CONTENT
            ====================================== */}

            <div className="flex min-w-0 items-start gap-4">
                {/* ICON */}

                <div
                    aria-hidden="true"
                    className="
                        flex h-12 w-12 shrink-0
                        items-center justify-center

                        rounded-2xl border
                        border-indigo-200
                        bg-indigo-50
                        text-indigo-700

                        shadow-lg shadow-indigo-500/10

                        dark:border-indigo-400/25
                        dark:bg-indigo-500/10
                        dark:text-indigo-300
                    "
                >
                    <Icon size={22} />
                </div>

                {/* TITLE AND DESCRIPTION */}

                <div className="min-w-0">
                    {/* BRAND LABEL */}

                    <div
                        className="
                            mb-1.5 inline-flex items-center gap-2
                            rounded-full border

                            border-indigo-200
                            bg-indigo-50

                            px-2.5 py-1

                            text-[9px] font-black
                            uppercase tracking-[0.18em]
                            text-indigo-700

                            dark:border-indigo-400/20
                            dark:bg-indigo-500/[0.08]
                            dark:text-indigo-300
                        "
                    >
                        <span
                            aria-hidden="true"
                            className="
                                h-1.5 w-1.5 rounded-full
                                bg-indigo-500

                                shadow-[0_0_8px_rgba(129,140,248,0.8)]
                            "
                        />

                        F.Society Posts
                    </div>

                    {/* MODAL TITLE */}

                    <h2
                        id="post-create-modal-title"
                        className="
                            break-words text-xl font-black
                            tracking-tight text-slate-900

                            dark:text-white
                            sm:text-2xl
                        "
                    >
                        {modalTitle}
                    </h2>

                    {/* MODAL DESCRIPTION */}

                    <p
                        id="post-create-modal-description"
                        className="
                            mt-1 max-w-xl

                            text-xs font-medium leading-5
                            text-slate-600

                            dark:text-slate-400
                            sm:text-sm
                        "
                    >
                        {modalDescription}
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
                aria-label="Post modalini yopish"
                title="Yopish"
                className="
                    flex h-10 w-10 shrink-0
                    items-center justify-center

                    rounded-xl border
                    border-slate-200
                    bg-slate-50
                    text-slate-500

                    transition-all duration-200

                    hover:border-red-300
                    hover:bg-red-50
                    hover:text-red-700

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-red-500/50

                    disabled:cursor-not-allowed
                    disabled:opacity-40

                    dark:border-white/[0.07]
                    dark:bg-white/[0.03]
                    dark:text-slate-400

                    dark:hover:border-red-400/30
                    dark:hover:bg-red-500/10
                    dark:hover:text-red-300

                    motion-reduce:transform-none
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

export default memo(PostCreateHeader);
