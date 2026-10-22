
import React, { memo } from "react";

// =========================================================
// FSOCIETY — COMPACT COMMENT THREAD SKELETON
// =========================================================
//
// Matches the Reddit x Mr. Robot comment layout.
//
// Features:
// - Compact comment cards
// - Avatar + author skeleton
// - Message placeholder
// - Action placeholders
// - Nested reply placeholders
// - Light / Dark Mode
// - Reduced motion support
//
// Usage:
//   <PostCommentsSkeleton count={3} />
//
// =========================================================

// =========================================================
// UTILITY
// =========================================================

const SHIMMER_CLASS = [
  "animate-pulse",
  "rounded-md",
  "bg-slate-200/80",
  "dark:bg-white/[0.09]",
  "motion-reduce:animate-none",
].join(" ");

const SkeletonBar = memo(function SkeletonBar({
  className = "",
}) {
  return (
    <span
      aria-hidden="true"
      className={`${SHIMMER_CLASS} block ${className}`}
    />
  );
});

// =========================================================
// AVATAR
// =========================================================

const SkeletonAvatar = memo(
  function SkeletonAvatar({ small = false }) {
    return (
      <SkeletonBar
        className={
          small
            ? "h-8 w-8 shrink-0 rounded-xl sm:h-9 sm:w-9"
            : "h-9 w-9 shrink-0 rounded-xl sm:h-10 sm:w-10"
        }
      />
    );
  }
);

// =========================================================
// SINGLE COMMENT SKELETON
// =========================================================

const CommentSkeletonRow = memo(
  function CommentSkeletonRow({
    index,
    nested = false,
  }) {
    const messageWidths = [
      "w-[78%]",
      "w-[92%]",
      "w-[64%]",
    ];

    const lineWidth =
      messageWidths[index % messageWidths.length];

    return (
      <div
        aria-hidden="true"
        className={`
          relative min-w-0

          ${
            nested
              ? "py-2.5"
              : "rounded-xl border border-slate-200/80 bg-white/80 px-3 py-3 dark:border-white/[0.08] dark:bg-[#11151c] sm:px-4 sm:py-3.5"
          }
        `}
      >
        <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
          {/* AVATAR */}
          <SkeletonAvatar small={nested} />

          {/* BODY */}
          <div className="min-w-0 flex-1">
            {/* HEADER */}
            <div
              className="
                flex min-w-0
                flex-wrap items-center
                gap-2
              "
            >
              <SkeletonBar className="h-3 w-20 max-w-[40%]" />

              <SkeletonBar className="h-2.5 w-14" />

              <SkeletonBar className="h-2.5 w-16" />
            </div>

            {/* MESSAGE */}
            <div className="mt-3 space-y-2">
              <SkeletonBar
                className={`h-3 ${lineWidth} max-w-full`}
              />

              {index % 2 === 0 && (
                <SkeletonBar className="h-3 w-[48%] max-w-full" />
              )}
            </div>

            {/* ACTIONS */}
            <div
              className="
                mt-3 flex min-w-0
                flex-wrap items-center
                gap-3
              "
            >
              <SkeletonBar className="h-3 w-12" />

              <SkeletonBar className="h-3 w-20" />

              <SkeletonBar className="h-3 w-14" />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

// =========================================================
// ROOT COMMENT + OPTIONAL NESTED REPLY
// =========================================================

const SkeletonThread = memo(
  function SkeletonThread({ index }) {
    const showNestedReply = index === 0;

    return (
      <div className="min-w-0">
        <CommentSkeletonRow index={index} />

        {showNestedReply && (
          <div
            aria-hidden="true"
            className="
              ml-5 mt-1
              min-w-0
              border-l-2
              border-slate-200
              pl-3

              dark:border-white/[0.10]

              sm:ml-7 sm:pl-4
            "
          >
            <CommentSkeletonRow
              nested
              index={index + 1}
            />
          </div>
        )}
      </div>
    );
  }
);

// =========================================================
// MAIN SKELETON
// =========================================================

function PostCommentsSkeleton({
  count = 3,
  className = "",
}) {
  const parsedCount = Number(count);

  const safeCount = Number.isFinite(parsedCount)
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
        w-full min-w-0 max-w-full
        space-y-3
        ${className}
      `}
    >
      {Array.from(
        { length: safeCount },
        (_, index) => (
          <SkeletonThread
            key={`comment-skeleton-${index}`}
            index={index}
          />
        )
      )}

      <span className="sr-only">
        Sharhlar yuklanmoqda, iltimos kuting.
      </span>
    </div>
  );
}

export default memo(PostCommentsSkeleton);
