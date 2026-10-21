
import React, { memo } from "react";
import {
  AlignLeft,
  Code2,
  Info,
  Type,
} from "lucide-react";

// =========================================================
// FSOCIETY — POST CREATE / EDIT FIELDS
// =========================================================
//
// Props:
// - formData
// - onChange
// - wordCount
// - disabled
//
// Features:
// - Create / Edit compatible
// - Controlled inputs
// - Title max: 150 characters
// - Warning after 140 characters
// - HTML source preservation
// - Light / Dark Mode
// - Responsive from 320px
// - Mobile-safe 16px input text
// - Accessible labels and counters
//
// API and form submission stay in CreatePostModal.
// =========================================================

const TITLE_MAX_LENGTH = 150;
const TITLE_WARNING_LENGTH = 140;

// =========================================================
// SHARED STYLES
// =========================================================

const LABEL_CLASS = `
  inline-flex
  min-w-0
  items-center
  gap-2
  text-[11px]
  font-black
  uppercase
  tracking-[0.10em]
  text-slate-700

  sm:text-xs

  dark:text-slate-300
`;

const FIELD_CLASS = `
  relative
  z-10
  block
  w-full
  min-w-0
  max-w-full
  rounded-xl
  border
  border-slate-300
  bg-white/95
  px-3.5
  py-3
  text-base
  font-medium
  leading-7
  text-slate-900
  outline-none
  transition-colors
  duration-200

  placeholder:text-slate-400

  focus:border-indigo-400
  focus:ring-4
  focus:ring-indigo-500/10

  disabled:cursor-not-allowed
  disabled:opacity-55

  sm:rounded-2xl
  sm:px-4

  dark:border-white/[0.12]
  dark:bg-[#080e18]/75
  dark:text-slate-100
  dark:placeholder:text-slate-500

  dark:focus:border-indigo-400/50
  dark:focus:ring-indigo-400/[0.08]

  motion-reduce:transition-none
`;

// =========================================================
// TITLE FIELD
// =========================================================

const PostTitleField = memo(
  function PostTitleField({
    value = "",
    onChange,
    disabled = false,
  }) {
    const title = String(value ?? "");

    const titleLength = title.length;

    const remaining = Math.max(
      0,
      TITLE_MAX_LENGTH - titleLength
    );

    const nearLimit =
      titleLength >= TITLE_WARNING_LENGTH;

    return (
      <section
        aria-label="Post sarlavhasi"
        className="w-full min-w-0"
      >
        {/* LABEL AND CHARACTER COUNTER */}

        <div
          className="
            mb-2.5
            flex
            min-w-0
            flex-wrap
            items-center
            justify-between
            gap-x-3
            gap-y-2
          "
        >
          <label
            htmlFor="title"
            className={LABEL_CLASS}
          >
            <Type
              size={15}
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
              font-mono
              text-[11px]
              font-bold
              tabular-nums

              ${
                nearLimit
                  ? "text-amber-700 dark:text-amber-300"
                  : "text-slate-500 dark:text-slate-400"
              }
            `}
          >
            {titleLength} / {TITLE_MAX_LENGTH}
          </span>
        </div>

        {/* INPUT */}

        <div
          className="
            group
            relative
            w-full
            min-w-0
          "
        >
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              rounded-2xl
              bg-indigo-400/0
              blur-xl
              transition-colors

              group-focus-within:bg-indigo-500/[0.07]

              motion-reduce:transition-none
            "
          />

          <input
            id="title"
            name="title"
            type="text"
            value={title}
            onChange={onChange}
            disabled={disabled}
            maxLength={TITLE_MAX_LENGTH}
            autoComplete="off"
            aria-describedby="post-title-counter"
            placeholder="Masalan: Django REST Framework'da JWT authentication..."
            className={FIELD_CLASS}
          />
        </div>

        {/* CHARACTER WARNING */}

        {nearLimit && (
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
            {remaining > 0
              ? `Sarlavha uchun ${remaining} ta belgi qoldi.`
              : "Sarlavha maksimal 150 ta belgiga yetdi."}
          </p>
        )}
      </section>
    );
  }
);

// =========================================================
// CONTENT FIELD
// =========================================================

const PostContentField = memo(
  function PostContentField({
    value = "",
    onChange,
    disabled = false,
    wordCount = 0,
  }) {
    const content = String(value ?? "");

    const count = Number(wordCount);

    const safeWordCount =
      Number.isFinite(count)
        ? Math.max(0, Math.trunc(count))
        : 0;

    // Existing backend posts may contain
    // HTML generated by a rich-text editor.
    // Preserve that source during editing.
    const containsHtml =
      /<\/?[a-z][^>]*>/i.test(content);

    return (
      <section
        aria-label="Post mazmuni"
        className="w-full min-w-0"
      >
        {/* LABEL AND WORD COUNT */}

        <div
          className="
            mb-2.5
            flex
            min-w-0
            flex-wrap
            items-center
            justify-between
            gap-x-3
            gap-y-2
          "
        >
          <label
            htmlFor="content"
            className={LABEL_CLASS}
          >
            <AlignLeft
              size={15}
              className="
                shrink-0
                text-purple-600

                dark:text-purple-300
              "
              aria-hidden="true"
            />

            <span>Post mazmuni</span>
          </label>

          <span
            id="post-content-word-count"
            className="
              shrink-0
              font-mono
              text-[11px]
              font-bold
              tabular-nums
              text-slate-500

              dark:text-slate-400
            "
          >
            {safeWordCount.toLocaleString("uz-UZ")} so‘z
          </span>
        </div>

        {/* TEXTAREA */}

        <div
          className="
            group
            relative
            w-full
            min-w-0
          "
        >
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              rounded-2xl
              bg-purple-400/0
              blur-xl
              transition-colors

              group-focus-within:bg-purple-500/[0.06]

              motion-reduce:transition-none
            "
          />

          <textarea
            id="content"
            name="content"
            value={content}
            onChange={onChange}
            disabled={disabled}
            rows={11}
            spellCheck
            aria-describedby={
              containsHtml
                ? "post-content-word-count post-content-html-help"
                : "post-content-word-count"
            }
            placeholder={`O‘z fikringizni yozing...

Masalan:
• Muammo nima edi?
• Qanday yechim topdingiz?
• Code snippet yoki tavsiyalar
• Boshqalarga qanday foyda beradi?`}
            className={`
              ${FIELD_CLASS}

              min-h-[200px]
              resize-y
              leading-7
              [overflow-wrap:anywhere]

              focus:border-purple-400
              focus:ring-purple-500/10

              sm:min-h-[260px]
              sm:py-4

              dark:focus:border-purple-400/50
              dark:focus:ring-purple-400/[0.08]
            `}
          />
        </div>

        {/* HTML SOURCE NOTICE */}

        {containsHtml && (
          <div
            id="post-content-html-help"
            className="
              mt-3
              flex
              min-w-0
              items-start
              gap-2.5
              rounded-xl
              border
              border-indigo-200
              bg-indigo-50/75
              p-3

              dark:border-indigo-400/20
              dark:bg-indigo-500/[0.07]
            "
          >
            <Code2
              size={16}
              className="
                mt-0.5
                shrink-0
                text-indigo-600

                dark:text-indigo-300
              "
              aria-hidden="true"
            />

            <p
              className="
                min-w-0
                break-words
                text-[11px]
                font-medium
                leading-5
                text-indigo-800

                dark:text-indigo-200
              "
            >
              Ushbu postda HTML formatidagi
              kontent mavjud. Teglar saqlanadi.
              Matnni tahrirlashda HTML
              tuzilishini ham hisobga oling.
            </p>
          </div>
        )}

        {/* HELP TEXT */}

        <div
          className="
            mt-3
            flex
            min-w-0
            items-start
            gap-2
            text-[11px]
            font-medium
            leading-5
            text-slate-500

            dark:text-slate-400
          "
        >
          <Info
            size={14}
            className="mt-0.5 shrink-0"
            aria-hidden="true"
          />

          <p className="min-w-0 break-words">
            Kontentdagi o‘zgarishlar
            “Saqlash” tugmasi bosilgandan
            keyingina serverga yuboriladi.
          </p>
        </div>
      </section>
    );
  }
);

// =========================================================
// MAIN FIELDS
// =========================================================

const PostCreateFields = ({
  formData,
  onChange,
  wordCount = 0,
  disabled = false,
}) => {
  const title =
    typeof formData?.title === "string"
      ? formData.title
      : "";

  const content =
    typeof formData?.content === "string"
      ? formData.content
      : "";

  return (
    <div
      className="
        w-full
        min-w-0
        space-y-5
        font-sans

        sm:space-y-7
      "
    >
      <PostTitleField
        value={title}
        onChange={onChange}
        disabled={disabled}
      />

      <PostContentField
        value={content}
        onChange={onChange}
        disabled={disabled}
        wordCount={wordCount}
      />
    </div>
  );
};

export default memo(PostCreateFields);
