
import React, { useMemo } from "react";
import DOMPurify from "dompurify";

import {
  FileText,
} from "lucide-react";

// =========================================================
// FSOCIETY — POST DETAIL ARTICLE
// =========================================================
//
// Features:
// - Safe HTML rendering with DOMPurify
// - Light / Dark Mode
// - Responsive 320px+
// - Rich-text editor content support
// - Headings and paragraphs
// - Lists and blockquotes
// - Code blocks
// - Images and tables
// - Long content overflow protection
// - Space Grotesk + monospace typography
// - Accessible empty state
//
// No API, Redux or business logic.
// =========================================================

// =========================================================
// ARTICLE TYPOGRAPHY
// =========================================================

const ARTICLE_CLASS = `
  relative
  w-full
  min-w-0
  max-w-none
  overflow-hidden

  rounded-[22px]
  border
  border-slate-200
  bg-white/85

  p-4

  text-sm
  font-normal
  leading-7
  text-slate-700

  shadow-[0_12px_45px_rgba(15,23,42,0.04)]

  sm:rounded-[26px]
  sm:p-6
  sm:text-[15px]
  sm:leading-8

  lg:p-7

  dark:border-white/[0.08]
  dark:bg-black/20
  dark:text-slate-300
  dark:shadow-[0_15px_45px_rgba(0,0,0,0.15)]

  [&_*]:min-w-0

  [&_p]:my-4
  [&_p]:break-words
  [&_p]:[overflow-wrap:anywhere]

  [&_h1]:mb-4
  [&_h1]:mt-8
  [&_h1]:break-words
  [&_h1]:text-2xl
  [&_h1]:font-black
  [&_h1]:leading-tight
  [&_h1]:tracking-tight
  [&_h1]:text-slate-900
  dark:[&_h1]:text-white

  [&_h2]:mb-4
  [&_h2]:mt-8
  [&_h2]:border-b
  [&_h2]:border-slate-200
  [&_h2]:pb-3
  [&_h2]:text-xl
  [&_h2]:font-black
  [&_h2]:leading-snug
  [&_h2]:text-slate-900
  dark:[&_h2]:border-white/[0.08]
  dark:[&_h2]:text-white

  [&_h3]:mb-3
  [&_h3]:mt-7
  [&_h3]:text-lg
  [&_h3]:font-bold
  [&_h3]:leading-snug
  [&_h3]:text-slate-900
  dark:[&_h3]:text-white

  [&_h4]:mb-2
  [&_h4]:mt-6
  [&_h4]:text-base
  [&_h4]:font-bold
  [&_h4]:text-slate-900
  dark:[&_h4]:text-slate-200

  [&_h5]:my-3
  [&_h5]:font-bold

  [&_h6]:my-3
  [&_h6]:font-bold

  [&_strong]:font-bold
  [&_strong]:text-slate-900
  dark:[&_strong]:text-white

  [&_em]:italic
  [&_u]:underline
  [&_s]:line-through

  [&_a]:break-all
  [&_a]:font-semibold
  [&_a]:text-indigo-700
  [&_a]:underline
  [&_a]:decoration-indigo-300
  [&_a]:underline-offset-4
  [&_a:hover]:text-indigo-900
  dark:[&_a]:text-indigo-300
  dark:[&_a]:decoration-indigo-500/50
  dark:[&_a:hover]:text-indigo-200

  [&_ul]:my-5
  [&_ul]:list-disc
  [&_ul]:pl-6

  [&_ol]:my-5
  [&_ol]:list-decimal
  [&_ol]:pl-6

  [&_li]:my-2
  [&_li]:break-words

  [&_li>ul]:my-2
  [&_li>ol]:my-2

  [&_blockquote]:my-6
  [&_blockquote]:rounded-r-xl
  [&_blockquote]:border-l-4
  [&_blockquote]:border-indigo-500
  [&_blockquote]:bg-indigo-50/75
  [&_blockquote]:px-4
  [&_blockquote]:py-3
  [&_blockquote]:italic
  [&_blockquote]:text-slate-700
  dark:[&_blockquote]:border-indigo-400
  dark:[&_blockquote]:bg-indigo-500/[0.07]
  dark:[&_blockquote]:text-slate-300

  [&_hr]:my-8
  [&_hr]:border-slate-200
  dark:[&_hr]:border-white/[0.10]

  [&_pre]:my-6
  [&_pre]:max-w-full
  [&_pre]:overflow-x-auto
  [&_pre]:rounded-2xl
  [&_pre]:border
  [&_pre]:border-slate-200
  [&_pre]:bg-slate-100
  [&_pre]:p-4
  [&_pre]:font-mono
  [&_pre]:text-xs
  [&_pre]:leading-6
  [&_pre]:text-slate-800
  [&_pre]:[tab-size:2]
  dark:[&_pre]:border-white/[0.08]
  dark:[&_pre]:bg-[#080d16]
  dark:[&_pre]:text-slate-200

  [&_code]:break-words
  [&_code]:rounded-md
  [&_code]:bg-pink-50
  [&_code]:px-1.5
  [&_code]:py-0.5
  [&_code]:font-mono
  [&_code]:text-[0.88em]
  [&_code]:text-pink-700
  dark:[&_code]:bg-pink-500/10
  dark:[&_code]:text-pink-300

  [&_pre_code]:block
  [&_pre_code]:min-w-max
  [&_pre_code]:rounded-none
  [&_pre_code]:bg-transparent
  [&_pre_code]:p-0
  [&_pre_code]:text-inherit
  dark:[&_pre_code]:bg-transparent
  dark:[&_pre_code]:text-inherit

  [&_img]:mx-auto
  [&_img]:my-6
  [&_img]:block
  [&_img]:h-auto
  [&_img]:max-w-full
  [&_img]:rounded-xl
  [&_img]:object-contain

  [&_figure]:my-6
  [&_figure]:max-w-full

  [&_figcaption]:mt-2
  [&_figcaption]:text-center
  [&_figcaption]:text-xs
  [&_figcaption]:text-slate-500
  dark:[&_figcaption]:text-slate-400

  [&_table]:my-6
  [&_table]:w-full
  [&_table]:border-collapse
  [&_table]:text-left

  [&_th]:border
  [&_th]:border-slate-200
  [&_th]:bg-slate-100
  [&_th]:p-3
  [&_th]:font-bold
  dark:[&_th]:border-white/[0.10]
  dark:[&_th]:bg-white/[0.05]

  [&_td]:border
  [&_td]:border-slate-200
  [&_td]:p-3
  dark:[&_td]:border-white/[0.10]

  [&_.ql-align-center]:text-center
  [&_.ql-align-right]:text-right
  [&_.ql-align-justify]:text-justify

  [&_.ql-size-small]:text-xs
  [&_.ql-size-large]:text-lg
  [&_.ql-size-huge]:text-2xl

  [&_.ql-indent-1]:pl-6
  [&_.ql-indent-2]:pl-12

  [&_.ql-font-monospace]:font-mono
`;

// =========================================================
// SANITIZE ARTICLE HTML
// =========================================================

const sanitizeArticleHtml = (value) => {
  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    return "";
  }

  // This component renders in the browser.
  // Do not expose unsanitized HTML during SSR.

  if (typeof window === "undefined") {
    return "";
  }

  // DOMPurify removes unsafe tags and
  // attributes such as event handlers.
  //
  // Inline styles are forbidden so user
  // content cannot override the site theme.
  //
  // Rich text semantics and code classes
  // remain available.

  const sanitized = DOMPurify.sanitize(value, {
    USE_PROFILES: {
      html: true,
    },

    FORBID_TAGS: [
      "script",
      "style",
      "iframe",
      "object",
      "embed",
      "form",
      "input",
      "button",
      "textarea",
      "select",
      "meta",
      "link",
      "base",
      "template",
    ],

    FORBID_ATTR: [
      "style",
      "srcdoc",
    ],

    ADD_ATTR: [
      "target",
      "rel",
    ],

    ALLOW_DATA_ATTR: false,
  });

  // =====================================
  // POST-PROCESS SANITIZED DOM
  // =====================================

  // DOMPurify runs first.
  // The template is only used to set safe
  // link behavior and image attributes.

  const template =
    document.createElement("template");

  template.innerHTML = sanitized;

  // =====================================
  // LINKS
  // =====================================

  template.content
    .querySelectorAll("a")
    .forEach((link) => {
      if (
        link.getAttribute("target") === "_blank"
      ) {
        link.setAttribute(
          "rel",
          "noopener noreferrer"
        );
      } else {
        link.removeAttribute("target");
      }
    });

  // =====================================
  // IMAGES
  // =====================================

  template.content
    .querySelectorAll("img")
    .forEach((image) => {
      if (!image.hasAttribute("loading")) {
        image.setAttribute(
          "loading",
          "lazy"
        );
      }

      image.setAttribute(
        "decoding",
        "async"
      );

      if (!image.hasAttribute("alt")) {
        image.setAttribute("alt", "");
      }
    });

  // =====================================
  // TABLE WRAPPERS
  // =====================================

  // Only the table itself gets an overflow
  // wrapper. This keeps wide editor tables
  // scrollable without widening the page.

  template.content
    .querySelectorAll("table")
    .forEach((table) => {
      const wrapper =
        document.createElement("div");

      wrapper.className =
        "post-article-table-scroll";

      table.parentNode?.insertBefore(
        wrapper,
        table
      );

      wrapper.appendChild(table);
    });

  return template.innerHTML;
};

// =========================================================
// EMPTY ARTICLE
// =========================================================

const EmptyArticle = () => (
  <div
    role="status"
    className="
      flex
      min-h-40
      min-w-0
      flex-col
      items-center
      justify-center
      gap-3
      rounded-2xl
      border
      border-dashed
      border-slate-200
      bg-slate-50/60
      p-5
      text-center

      dark:border-white/[0.10]
      dark:bg-white/[0.025]
    "
  >
    <FileText
      size={27}
      className="
        text-slate-400
        dark:text-slate-500
      "
      aria-hidden="true"
    />

    <p
      className="
        text-sm
        font-semibold
        text-slate-600

        dark:text-slate-300
      "
    >
      Ushbu postda hozircha matn mavjud emas.
    </p>
  </div>
);

// =========================================================
// MAIN ARTICLE
// =========================================================

const PostDetailArticle = ({
  content = "",
  className = "",
  ariaLabel = "Post mazmuni",
}) => {
  // =======================================================
  // MEMOIZED SAFE HTML
  // =======================================================

  const safeHtml = useMemo(
    () => sanitizeArticleHtml(content),
    [content]
  );

  const hasContent = Boolean(
    safeHtml
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/gi, " ")
      .trim()
  ) || /<(img|table|hr|video)\b/i.test(safeHtml);

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <article
      aria-label={ariaLabel}
      className={`
        ${ARTICLE_CLASS}
        ${className}
      `}
      style={{
        fontFamily:
          "var(--font-sans, 'Space Grotesk', sans-serif)",
      }}
    >
      {hasContent ? (
        <div
          className="
            post-article-content
            w-full
            min-w-0
            max-w-full

            [&_.post-article-table-scroll]:my-6
            [&_.post-article-table-scroll]:w-full
            [&_.post-article-table-scroll]:max-w-full
            [&_.post-article-table-scroll]:overflow-x-auto
            [&_.post-article-table-scroll]:rounded-xl
            [&_.post-article-table-scroll]:border
            [&_.post-article-table-scroll]:border-slate-200

            dark:[&_.post-article-table-scroll]:border-white/[0.08]
          "
          dangerouslySetInnerHTML={{
            __html: safeHtml,
          }}
        />
      ) : (
        <EmptyArticle />
      )}
    </article>
  );
};

export default React.memo(
  PostDetailArticle
);
