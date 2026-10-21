
import React, { memo } from "react";

import {
  ChevronRight,
  FileCode2,
  PenLine,
} from "lucide-react";

// =========================================================
// FSOCIETY — POST COMMENT CONTENT
// =========================================================
//
// Design:
// - Underground terminal message
// - Monochrome typography
// - Restrained red accents
// - Subtle code-editor details
// - Light / Dark Mode
// - Responsive 320px+
//
// Data:
// - Plain text only
// - Preserves newlines
// - Handles long words and URLs
//
// No API / Redux / toast logic.
// =========================================================

// =========================================================
// MESSAGE PANEL
// =========================================================

const MESSAGE_PANEL_CLASS = `
  group/message
  relative
  isolate

  w-full
  min-w-0
  max-w-full

  overflow-hidden

  rounded-[14px]
  border
  border-slate-200

  bg-white/90

  px-3
  pb-4
  pt-3.5

  shadow-[0_4px_20px_rgba(15,23,42,0.025)]

  transition-colors
  duration-200

  sm:rounded-[17px]
  sm:px-5
  sm:pb-5
  sm:pt-4

  dark:border-white/[0.075]
  dark:bg-[#111720]/85

  dark:shadow-none

  motion-reduce:transition-none
`;

// =========================================================
// COMMENT MESSAGE
// =========================================================

const CommentMessage = memo(
  function CommentMessage({
    message = "",
  }) {
    const text = String(message ?? "");

    const hasMessage = Boolean(text.trim());

    return (
      <div
        className={MESSAGE_PANEL_CLASS}
      >
        {/* LEFT RED ACCENT */}

        <span
          aria-hidden="true"
          className="
            pointer-events-none

            absolute
            bottom-3
            left-0
            top-3

            w-[2px]

            rounded-r-full
            bg-rose-600/70

            dark:bg-rose-500/65
          "
        />

        {/* DECORATIVE GRID */}

        <span
          aria-hidden="true"
          className="
            pointer-events-none

            absolute
            right-0
            top-0

            h-24
            w-28

            opacity-[0.045]

            dark:opacity-[0.065]
          "
          style={{
            backgroundImage:
              "linear-gradient(to right, #9f1239 1px, transparent 1px), linear-gradient(to bottom, #9f1239 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />

        {/* TOP LABEL */}

        <div
          className="
            relative
            z-10

            mb-4

            flex
            min-w-0
            flex-wrap

            items-center
            justify-between
            gap-2
          "
        >
          <div
            className="
              inline-flex
              min-w-0
              items-center
              gap-2

              font-mono
              text-[10px]
              font-bold
              uppercase
              tracking-[0.08em]

              text-slate-500

              dark:text-slate-400
            "
          >
            <ChevronRight
              size={14}
              strokeWidth={2.5}
              className="
                shrink-0
                text-rose-600

                dark:text-rose-400
              "
              aria-hidden="true"
            />

            <span>
              message.output
            </span>
          </div>

          {/* DECORATIVE CODE MARK */}

          <span
            aria-hidden="true"
            className="
              inline-flex
              items-center
              gap-1

              font-mono
              text-[10px]
              font-medium

              text-slate-400

              dark:text-slate-600
            "
          >
            <FileCode2
              size={12}
            />

            TXT
          </span>
        </div>

        {/* ACTUAL MESSAGE */}

        <div
          className="
            relative
            z-10

            flex
            min-w-0
            items-start
            gap-3
          "
        >
          {/* RED PROMPT */}

          <span
            aria-hidden="true"
            className="
              shrink-0

              select-none

              pt-0.5

              font-mono
              text-sm
              font-black

              text-rose-600

              dark:text-rose-400
            "
          >
            &gt;
          </span>

          <p
            className={`
              min-w-0
              flex-1

              whitespace-pre-wrap
              break-words
              [overflow-wrap:anywhere]

              text-[13px]
              font-medium
              leading-[1.9]

              sm:text-[14px]
              sm:leading-7

              ${
                hasMessage
                  ? `
                    text-slate-800
                    dark:text-slate-200
                  `
                  : `
                    italic
                    text-slate-400
                    dark:text-slate-500
                  `
              }
            `}
          >
            {hasMessage
              ? text
              : "Sharh matni mavjud emas."}
          </p>
        </div>

        {/* BOTTOM DECORATION */}

        <div
          aria-hidden="true"
          className="
            relative
            z-10

            mt-4

            flex
            items-center
            gap-2
          "
        >
          <span
            className="
              h-px
              w-6
              bg-rose-500/45
            "
          />

          <span
            className="
              h-px
              flex-1
              bg-slate-200/80

              dark:bg-white/[0.06]
            "
          />

          <span
            className="
              font-mono
              text-[9px]
              font-medium
              uppercase
              tracking-widest

              text-slate-400

              dark:text-slate-600
            "
          >
            EOF
          </span>
        </div>
      </div>
    );
  }
);

// =========================================================
// EDIT WRAPPER
// =========================================================

const CommentEditContent = memo(
  function CommentEditContent({
    children,
  }) {
    return (
      <div
        className="
          relative
          w-full
          min-w-0

          rounded-[16px]
          border
          border-rose-200

          bg-rose-50/35

          p-2.5

          sm:p-3.5

          dark:border-rose-500/[0.15]
          dark:bg-rose-500/[0.035]
        "
      >
        {/* EDIT LABEL */}

        <div
          className="
            mb-3

            inline-flex
            items-center
            gap-2

            font-mono
            text-[10px]
            font-black
            uppercase
            tracking-[0.10em]

            text-rose-700

            dark:text-rose-300
          "
        >
          <PenLine
            size={13}
            aria-hidden="true"
          />

          EDIT / MESSAGE
        </div>

        {/* EXISTING EDIT FORM */}

        <div
          className="
            w-full
            min-w-0
          "
        >
          {children}
        </div>
      </div>
    );
  }
);

// =========================================================
// MAIN COMPONENT
// =========================================================

const PostCommentContent = ({
  message = "",
  isEditing = false,
  editForm = null,
  className = "",
}) => {
  return (
    <div
      className={`
        mt-4
        w-full
        min-w-0
        max-w-full

        ${className}
      `}
    >
      {isEditing ? (
        <CommentEditContent>
          {editForm}
        </CommentEditContent>
      ) : (
        <CommentMessage
          message={message}
        />
      )}
    </div>
  );
};

export default memo(PostCommentContent);
