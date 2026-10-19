
import React, { memo } from "react";

import {
    AlignLeft,
    Type,
} from "lucide-react";

// =========================================================
// CONSTANTS
// =========================================================

const TITLE_MAX_LENGTH = 150;

const TITLE_WARNING_LENGTH = 140;

// =========================================================
// SHARED FORM STYLES
// =========================================================

const LABEL_CLASS = `
    flex
    items-center
    gap-2

    text-xs
    font-black
    uppercase
    tracking-[0.16em]

    text-slate-700
    dark:text-slate-400
`;

const INPUT_CLASS = `
    relative
    z-10

    w-full
    min-w-0

    rounded-2xl
    border

    border-slate-300
    bg-white

    px-4
    py-3.5

    text-sm
    font-semibold
    text-slate-900

    outline-none
    transition-all
    duration-200

    placeholder:text-slate-400

    focus:border-indigo-400
    focus:ring-4
    focus:ring-indigo-500/[0.08]

    disabled:cursor-not-allowed
    disabled:opacity-50

    dark:border-white/[0.08]
    dark:bg-black/20
    dark:text-white
    dark:placeholder:text-slate-600

    dark:focus:border-indigo-400/40
    dark:focus:bg-indigo-500/[0.025]
    dark:focus:ring-indigo-500/[0.06]
`;

// =========================================================
// TITLE FIELD
//
// Original behavior:
//
// - name="title"
// - maxLength={150}
// - Create/Edit controlled value
// - Character counter
// - Warning when reaching 140 characters
// - Disabled during submission
//
// Validation remains in CreatePostModal.
// =========================================================

const PostTitleField = memo(
    function PostTitleField({
        value = "",
        onChange,
        disabled = false,
    }) {
        // =================================================
        // SAFE VALUE
        // =================================================

        const title = String(value ?? "");

        const titleLength = title.length;

        // =================================================
        // CHARACTER LIMIT
        // =================================================

        const isNearLimit =
            titleLength >= TITLE_WARNING_LENGTH;

        // =================================================
        // RENDER
        // =================================================

        return (
            <section className="min-w-0">
                {/* =====================================
                    LABEL AND CHARACTER COUNTER
                ====================================== */}

                <div
                    className="
                        mb-2.5
                        flex
                        items-center
                        justify-between
                        gap-3
                    "
                >
                    {/* LABEL */}

                    <label
                        htmlFor="title"
                        className={LABEL_CLASS}
                    >
                        <Type
                            size={14}
                            aria-hidden="true"
                            className="
                                text-indigo-600
                                dark:text-indigo-300
                            "
                        />

                        Sarlavha
                    </label>

                    {/* CHARACTER COUNTER */}

                    <span
                        className={`
                            shrink-0

                            text-[10px]
                            font-bold
                            tabular-nums

                            ${
                                isNearLimit
                                    ? `
                                        text-amber-700
                                        dark:text-amber-300
                                    `
                                    : `
                                        text-slate-500
                                        dark:text-slate-500
                                    `
                            }
                        `}
                    >
                        {titleLength}
                        /
                        {TITLE_MAX_LENGTH}
                    </span>
                </div>

                {/* =====================================
                    TITLE INPUT WRAPPER
                ====================================== */}

                <div
                    className="
                        group
                        relative
                        min-w-0
                    "
                >
                    {/* FOCUS GLOW */}

                    <div
                        aria-hidden="true"
                        className="
                            pointer-events-none

                            absolute
                            inset-0

                            rounded-2xl

                            bg-indigo-500/0
                            blur-xl

                            transition-colors

                            group-focus-within:bg-indigo-500/[0.06]
                        "
                    />

                    {/* TITLE INPUT */}

                    <input
                        id="title"
                        name="title"
                        type="text"

                        value={title}
                        onChange={onChange}

                        maxLength={TITLE_MAX_LENGTH}

                        disabled={disabled}

                        autoComplete="off"

                        placeholder="Masalan: Django REST Framework’da JWT authentication..."

                        className={`
                            ${INPUT_CLASS}
                            sm:text-base
                        `}
                    />
                </div>

                {/* =====================================
                    LIMIT WARNING
                ====================================== */}

                {isNearLimit && (
                    <p
                        className="
                            mt-2

                            text-[10px]
                            font-medium

                            text-amber-700
                            dark:text-amber-300
                        "
                    >
                        Sarlavha uchun{" "}
                        {TITLE_MAX_LENGTH - titleLength}
                        {" "}ta belgi qoldi.
                    </p>
                )}
            </section>
        );
    }
);

// =========================================================
// CONTENT FIELD
//
// Original behavior:
//
// - name="content"
// - rows={11}
// - User-friendly placeholder
// - Resizable textarea
// - Word counter
// - Disabled during submission
//
// HTML-to-text conversion and word counting
// are calculated in the parent modal.
// This component only displays wordCount.
// =========================================================

const PostContentField = memo(
    function PostContentField({
        value = "",
        onChange,
        disabled = false,
        wordCount = 0,
    }) {
        // =================================================
        // SAFE VALUE
        // =================================================

        const content = String(value ?? "");

        // =================================================
        // SAFE WORD COUNT
        // =================================================

        const normalizedWordCount =
            Number.isFinite(Number(wordCount))
                ? Math.max(
                    0,
                    Math.floor(Number(wordCount))
                )
                : 0;

        // =================================================
        // RENDER
        // =================================================

        return (
            <section className="min-w-0">
                {/* =====================================
                    LABEL AND WORD COUNT
                ====================================== */}

                <div
                    className="
                        mb-2.5

                        flex
                        items-center
                        justify-between
                        gap-3
                    "
                >
                    {/* LABEL */}

                    <label
                        htmlFor="content"
                        className={LABEL_CLASS}
                    >
                        <AlignLeft
                            size={14}
                            aria-hidden="true"
                            className="
                                text-purple-600
                                dark:text-purple-300
                            "
                        />

                        Post mazmuni
                    </label>

                    {/* WORD COUNT */}

                    <span
                        className="
                            shrink-0

                            text-[10px]
                            font-bold
                            tabular-nums

                            text-slate-500
                            dark:text-slate-500
                        "
                    >
                        {normalizedWordCount.toLocaleString()}
                        {" "}so‘z
                    </span>
                </div>

                {/* =====================================
                    CONTENT INPUT WRAPPER
                ====================================== */}

                <div
                    className="
                        group
                        relative
                        min-w-0
                    "
                >
                    {/* FOCUS GLOW */}

                    <div
                        aria-hidden="true"
                        className="
                            pointer-events-none

                            absolute
                            inset-0

                            rounded-2xl

                            bg-purple-500/0
                            blur-xl

                            transition-colors

                            group-focus-within:bg-purple-500/[0.05]
                        "
                    />

                    {/* CONTENT TEXTAREA */}

                    <textarea
                        id="content"
                        name="content"

                        value={content}
                        onChange={onChange}

                        rows={11}

                        disabled={disabled}

                        placeholder={`O‘z fikringizni yozing...

Masalan:
• Muammo nima edi?
• Qanday yechim topdingiz?
• Code snippet yoki tavsiyalar
• Boshqalarga qanday foyda beradi?`}

                        className="
                            relative
                            z-10

                            min-h-[260px]
                            w-full
                            min-w-0

                            resize-y

                            rounded-2xl
                            border

                            border-slate-300
                            bg-white

                            px-4
                            py-4

                            text-sm
                            font-medium
                            leading-7

                            text-slate-800

                            outline-none
                            transition-all
                            duration-200

                            placeholder:text-slate-400

                            focus:border-purple-400
                            focus:ring-4
                            focus:ring-purple-500/[0.08]

                            disabled:cursor-not-allowed
                            disabled:opacity-50

                            dark:border-white/[0.08]
                            dark:bg-black/20
                            dark:text-slate-200
                            dark:placeholder:text-slate-600

                            dark:focus:border-purple-400/40
                            dark:focus:bg-purple-500/[0.02]
                            dark:focus:ring-purple-500/[0.05]
                        "
                    />
                </div>
            </section>
        );
    }
);

// =========================================================
// POST CREATE FIELDS
//
// Props:
//
// formData:
// {
//     post_type: "TEX",
//     title: "",
//     content: ""
// }
//
// onChange:
//   Existing CreatePostModal handleChange.
//
// wordCount:
//   Existing wordCount calculated from stripped HTML.
//
// disabled:
//   Existing isSubmitting / busy state.
//
// This component does NOT:
// - Own form state
// - Make API requests
// - Validate or submit the form
// - Display server errors
// =========================================================

const PostCreateFields = ({
    formData,
    onChange,
    wordCount = 0,
    disabled = false,
}) => {
    // =====================================================
    // SAFE FORM DATA
    // =====================================================

    const title =
        typeof formData?.title === "string"
            ? formData.title
            : "";

    const content =
        typeof formData?.content === "string"
            ? formData.content
            : "";

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div
            className="
                min-w-0
                space-y-7
            "
        >
            {/* =====================================
                TITLE FIELD
            ====================================== */}

            <PostTitleField
                value={title}
                onChange={onChange}
                disabled={disabled}
            />

            {/* =====================================
                CONTENT FIELD
            ====================================== */}

            <PostContentField
                value={content}
                onChange={onChange}
                wordCount={wordCount}
                disabled={disabled}
            />
        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(PostCreateFields);
