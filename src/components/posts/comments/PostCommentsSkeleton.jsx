
import React, { memo } from "react";

// =========================================================
// FSOCIETY — POST COMMENTS SKELETON
// =========================================================
//
// - Light / Dark Mode
// - Responsive 320px+
// - Comment card placeholders
// - Reduced motion support
// - Accessible loading announcement
// - No extra background or API logic
// =========================================================

const SKELETON_CLASS = `
  bg-slate-200/85
  dark:bg-slate-700/45
  motion-safe:animate-pulse
  motion-reduce:animate-none
`;

const SkeletonBlock = ({
  className = "",
}) => (
  <div
    aria-hidden="true"
    className={`
      ${SKELETON_CLASS}
      ${className}
    `}
  />
);

// =========================================================
// SINGLE COMMENT PLACEHOLDER
// =========================================================

const CommentSkeletonCard = memo(
  function CommentSkeletonCard({ index = 0 }) {
    return (
      <div
        aria-hidden="true"
        className="
          w-full
          min-w-0
          rounded-[22px]
          border
          border-slate-200
          bg-white/85
          p-4
          shadow-sm

          sm:rounded-3xl
          sm:p-5

          dark:border-white/[0.08]
          dark:bg-white/[0.025]
          dark:shadow-none
        "
      >
        {/* AUTHOR */}

        <div
          className="
            flex
            min-w-0
            items-center
            gap-3
          "
        >
          <SkeletonBlock
            className="
              h-11
              w-11
              shrink-0
              rounded-full

              sm:h-12
              sm:w-12
            "
          />

          <div
            className="
              min-w-0
              flex-1
              space-y-2
            "
          >
            <SkeletonBlock
              className="
                h-4
                w-32
                max-w-full
                rounded-md
              "
            />

            <SkeletonBlock
              className="
                h-3
                w-20
                max-w-full
                rounded-md
              "
            />
          </div>

          <SkeletonBlock
            className="
              h-8
              w-8
              shrink-0
              rounded-lg
            "
          />
        </div>

        {/* MESSAGE */}

        <div
          className="
            mt-5
            min-w-0
            space-y-3
          "
        >
          <SkeletonBlock
            className="
              h-3.5
              w-full
              rounded-md
            "
          />

          <SkeletonBlock
            className={`
              h-3.5
              rounded-md

              ${
                index % 2 === 0
                  ? "w-4/5"
                  : "w-11/12"
              }
            `}
          />

          {index === 0 && (
            <SkeletonBlock
              className="
                h-3.5
                w-2/5
                rounded-md
              "
            />
          )}
        </div>

        {/* ACTIONS */}

        <div
          className="
            mt-5
            flex
            items-center
            gap-3
            border-t
            border-slate-100
            pt-4

            dark:border-white/[0.06]
          "
        >
          <SkeletonBlock
            className="
              h-8
              w-20
              rounded-lg
            "
          />

          <SkeletonBlock
            className="
              h-8
              w-16
              rounded-lg
            "
          />
        </div>
      </div>
    );
  }
);

// =========================================================
// MAIN SKELETON
// =========================================================

const PostCommentsSkeleton = ({
  count = 3,
  className = "",
}) => {
  const parsedCount = Number(count);

  const itemCount = Number.isFinite(
    parsedCount
  )
    ? Math.min(
        6,
        Math.max(1, Math.trunc(parsedCount))
      )
    : 3;

  return (
    <div
      role="status"
      aria-label="Sharhlar yuklanmoqda"
      aria-busy="true"
      className={`
        w-full
        min-w-0
        space-y-4

        ${className}
      `}
    >
      <span className="sr-only">
        Sharhlar yuklanmoqda.
        Iltimos, kuting.
      </span>

      {Array.from(
        { length: itemCount },
        (_, index) => (
          <CommentSkeletonCard
            key={index}
            index={index}
          />
        )
      )}
    </div>
  );
};

export default memo(PostCommentsSkeleton);
