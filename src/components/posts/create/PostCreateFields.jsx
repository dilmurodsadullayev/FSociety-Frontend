
// src/components/posts/create/PostCreateFields.jsx

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
    min-w-0
    items-center
    gap-2

    text-[11px]
    font-black
    uppercase
    tracking-[0.12em]

    text-slate-700
    dark:text-slate-300

    sm:text-xs
    sm:tracking-[0.16em]
`;

const INPUT_CLASS = `
    relative
    z-10

    block
    w-full
    min-w-0
    max-w-full

    rounded-xl
    border
    border-slate-300
    bg-white

    px-3.5
    py-3

    text-base
    font-medium
    text-slate-900

    outline-none

    transition-colors
    duration-200

    placeholder:text-slate-400

    focus:border-indigo-400
    focus:ring-4
    focus:ring-indigo-500/[0.08]

    disabled:cursor-not-allowed
    disabled:opacity-50

    dark:border-white/[0.10]
    dark:bg-black/20
    dark:text-white
    dark:placeholder:text-slate-500

    dark:focus:border-indigo-400/40
    dark:focus:bg-indigo-500/[0.025]
    dark:focus:ring-indigo-500/[0.06]

    sm:rounded-2xl
    sm:px-4
    sm:py-3.5

    motion-reduce:transition-none
`;

// =========================================================
// POST TITLE FIELD
//
// Features:
// - Controlled value
// - 150-character limit
// - Warning from 140 characters
// - Accessible label and counter
// - Disabled state
// - Mobile-friendly input font size
// - Light / Dark Mode
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

        const remainingCharacters =
            Math.max(
                0,
                TITLE_MAX_LENGTH - titleLength
            );

        const isNearLimit =
            titleLength >= TITLE_WARNING_LENGTH;

        // =================================================
        // RENDER
        // =================================================

        return (
            <section className="w-full min-w-0">
                {/* =========================================
                    LABEL AND CHARACTER COUNTER
                ========================================== */}

                <div
                    className="
                        mb-2.5

                        flex
                        min-w-0

                        items-center
                        justify-between

                        gap-2
                    "
                >
                    <label
                        htmlFor="title"
                        className={LABEL_CLASS}
                    >
                        <Type
                            size={14}
                            aria-hidden="true"
                            className="
                                shrink-0
                                text-indigo-600
                                dark:text-indigo-300
                            "
                        />

                        <span>Sarlavha</span>
                    </label>

                    <span
                        id="post-title-counter"
                        className={`
                            shrink-0

                            text-[11px]
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
                                        dark:text-slate-400
                                    `
                            }
                        `}
                    >
                        {titleLength}
                        {" / "}
                        {TITLE_MAX_LENGTH}
                    </span>
                </div>

                {/* =========================================
                    TITLE INPUT
                ========================================== */}

                <div
                    className="
                        group
                        relative

                        w-full
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

                            motion-reduce:transition-none
                        "
                    />

                    <input
                        id="title"
                        name="title"
                        type="text"

                        value={title}
                        onChange={onChange}

                        maxLength={TITLE_MAX_LENGTH}

                        disabled={disabled}
                        aria-describedby="post-title-counter"

                        autoComplete="off"

                        placeholder="Masalan: Django REST Framework’da JWT authentication..."

                        className={INPUT_CLASS}
                    />
                </div>

                {/* =========================================
                    CHARACTER LIMIT WARNING
                ========================================== */}

                {isNearLimit && (
                    <p
                        role="status"
                        className="
                            mt-2

                            break-words

                            text-[11px]
                            font-medium
                            leading-5

                            text-amber-700
                            dark:text-amber-300
                        "
                    >
                        Sarlavha uchun{" "}
                        {remainingCharacters}
                        {" "}ta belgi qoldi.
                    </p>
                )}
            </section>
        );
    }
);

// =========================================================
// POST CONTENT FIELD
//
// Features:
// - Controlled textarea
// - Original 11 rows
// - Resizable height
// - Word counter
// - Existing placeholder
// - Disabled state
// - Responsive mobile dimensions
// - Light / Dark Mode
//
// Content parsing and word counting are performed
// by CreatePostModal.
// =========================================================

const PostContentField = memo(
    function PostContentField({
        value = "",
        onChange,
        disabled = false,
        wordCount = 0,
    }) {
        // =================================================
        // SAFE CONTENT
        // =================================================

        const content = String(value ?? "");

        // =================================================
        // SAFE WORD COUNT
        // =================================================

        const numericWordCount =
            Number(wordCount);

        const normalizedWordCount =
            Number.isFinite(numericWordCount)
                ? Math.max(
                    0,
                    Math.floor(numericWordCount)
                )
                : 0;

        // =================================================
        // RENDER
        // =================================================

        return (
            <section className="w-full min-w-0">
                {/* =========================================
                    LABEL AND WORD COUNT
                ========================================== */}

                <div
                    className="
                        mb-2.5

                        flex
                        min-w-0

                        items-center
                        justify-between

                        gap-2
                    "
                >
                    <label
                        htmlFor="content"
                        className={LABEL_CLASS}
                    >
                        <AlignLeft
                            size={14}
                            aria-hidden="true"
                            className="
                                shrink-0
                                text-purple-600
                                dark:text-purple-300
                            "
                        />

                        <span>
                            Post mazmuni
                        </span>
                    </label>

                    <span
                        id="post-content-word-count"
                        className="
                            shrink-0

                            text-[11px]
                            font-bold
                            tabular-nums

                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        {normalizedWordCount.toLocaleString()}
                        {" "}so‘z
                    </span>
                </div>

                {/* =========================================
                    CONTENT TEXTAREA
                ========================================== */}

                <div
                    className="
                        group
                        relative

                        w-full
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

                            motion-reduce:transition-none
                        "
                    />

                    <textarea
                        id="content"
                        name="content"

                        value={content}
                        onChange={onChange}

                        rows={11}

                        disabled={disabled}

                        aria-describedby="post-content-word-count"

                        spellCheck={true}

                        placeholder={`O‘z fikringizni yozing...

Masalan:
• Muammo nima edi?
• Qanday yechim topdingiz?
• Code snippet yoki tavsiyalar
• Boshqalarga qanday foyda beradi?`}

                        className="
                            relative
                            z-10

                            block

                            min-h-[200px]
                            max-w-full
                            min-w-0
                            w-full

                            resize-y

                            rounded-xl
                            border

                            border-slate-300
                            bg-white

                            px-3.5
                            py-3

                            text-base
                            font-medium
                            leading-7

                            text-slate-800

                            outline-none

                            transition-colors
                            duration-200

                            placeholder:text-slate-400

                            focus:border-purple-400
                            focus:ring-4
                            focus:ring-purple-500/[0.08]

                            disabled:cursor-not-allowed
                            disabled:opacity-50

                            dark:border-white/[0.10]
                            dark:bg-black/20
                            dark:text-slate-200
                            dark:placeholder:text-slate-500

                            dark:focus:border-purple-400/40
                            dark:focus:bg-purple-500/[0.02]
                            dark:focus:ring-purple-500/[0.05]

                            sm:min-h-[260px]
                            sm:rounded-2xl
                            sm:px-4
                            sm:py-4

                            motion-reduce:transition-none
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
//   CreatePostModal.handleChange
//
// wordCount:
//   Calculated by CreatePostModal
//
// disabled:
//   Parent modal busy state
//
// No API calls or independent form state.
// =========================================================

const PostCreateFields = ({
    formData,
    onChange,
    wordCount = 0,
    disabled = false,
}) => {
    // =====================================================
    // SAFE VALUES
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
                w-full
                min-w-0

                space-y-5

                sm:space-y-7
            "
        >
            {/* =============================================
                TITLE FIELD
            ============================================== */}

            <PostTitleField
                value={title}
                onChange={onChange}
                disabled={disabled}
            />

            {/* =============================================
                CONTENT FIELD
            ============================================== */}

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
