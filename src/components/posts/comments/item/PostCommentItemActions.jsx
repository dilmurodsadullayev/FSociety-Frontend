
import React, { memo } from "react";

import {
  Heart,
  PencilLine,
  Trash2,
  Loader2,
} from "lucide-react";

// =========================================================
// FSOCIETY — POST COMMENT ITEM ACTIONS
// =========================================================
//
// Path:
// comments/item/PostCommentItemActions.jsx
//
// Responsibilities:
// - Comment Like / Unlike
// - Like count
// - Edit button
// - Delete button
// - Loading indicators
//
// IMPORTANT:
// API, Redux and siteToast are managed
// by usePostCommentActions.js.
//
// Design:
// - FSociety Discussion Card
// - Light / Dark Mode
// - Responsive 320px+
// - Neon accent colors
// - Accessible buttons
// =========================================================

// =========================================================
// STYLES
// =========================================================

const BUTTON_BASE = `
  group/button
  relative
  inline-flex
  min-h-11
  min-w-0
  items-center
  justify-center
  gap-2

  rounded-xl
  border

  px-3.5
  py-2.5

  text-xs
  font-bold

  transition-all
  duration-200

  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-indigo-500
  focus-visible:ring-offset-2

  active:scale-[0.98]

  disabled:cursor-not-allowed
  disabled:opacity-50
  disabled:active:scale-100

  dark:focus-visible:ring-offset-[#0b1018]

  motion-reduce:transform-none
  motion-reduce:transition-none
`;

const LIKE_DEFAULT_CLASS = `
  border-slate-200
  bg-white/85
  text-slate-600

  hover:border-pink-200
  hover:bg-pink-50
  hover:text-pink-700

  dark:border-white/[0.09]
  dark:bg-white/[0.035]
  dark:text-slate-300

  dark:hover:border-pink-400/25
  dark:hover:bg-pink-500/[0.08]
  dark:hover:text-pink-300
`;

const LIKE_ACTIVE_CLASS = `
  border-pink-200

  bg-gradient-to-r
  from-pink-50
  to-rose-50

  text-pink-700

  shadow-[0_5px_20px_rgba(236,72,153,0.08)]

  hover:border-pink-300

  dark:border-pink-400/25
  dark:from-pink-500/[0.12]
  dark:to-rose-500/[0.055]
  dark:text-pink-300

  dark:shadow-[0_5px_22px_rgba(236,72,153,0.05)]
`;

const EDIT_CLASS = `
  border-slate-200
  bg-white/85
  text-slate-600

  hover:border-indigo-200
  hover:bg-indigo-50
  hover:text-indigo-700

  dark:border-white/[0.09]
  dark:bg-white/[0.035]
  dark:text-slate-300

  dark:hover:border-indigo-400/25
  dark:hover:bg-indigo-500/[0.08]
  dark:hover:text-indigo-300
`;

const DELETE_CLASS = `
  border-red-200
  bg-red-50/70
  text-red-700

  hover:border-red-300
  hover:bg-red-100

  dark:border-red-400/20
  dark:bg-red-500/[0.06]
  dark:text-red-300

  dark:hover:border-red-400/30
  dark:hover:bg-red-500/[0.13]
`;

// =========================================================
// HELPERS
// =========================================================

const formatCount = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0";
  }

  return Math.max(
    0,
    Math.trunc(number)
  ).toLocaleString("uz-UZ");
};

// =========================================================
// LIKE BUTTON
// =========================================================

const CommentLikeButton = memo(
  function CommentLikeButton({
    isLiked,
    likesCount,
    isLiking,
    disabled,
    onLike,
  }) {
    const liked = Boolean(isLiked);
    const loading = Boolean(isLiking);

    const count = formatCount(likesCount);

    const canLike =
      !disabled &&
      !loading &&
      typeof onLike === "function";

    return (
      <button
        type="button"
        onClick={onLike}
        disabled={!canLike}
        aria-pressed={liked}
        aria-busy={loading}
        aria-label={
          liked
            ? `Sharhdan likeni olib tashlash. ${count} ta like`
            : `Sharhga like bosish. ${count} ta like`
        }
        className={`
          ${BUTTON_BASE}
          min-w-[85px]

          ${
            liked
              ? LIKE_ACTIVE_CLASS
              : LIKE_DEFAULT_CLASS
          }
        `}
      >
        {/* ICON */}

        {loading ? (
          <Loader2
            size={17}
            aria-hidden="true"
            className="
              shrink-0
              motion-safe:animate-spin
            "
          />
        ) : (
          <Heart
            size={17}
            strokeWidth={2}
            aria-hidden="true"
            className={`
              shrink-0

              ${
                liked
                  ? "fill-current"
                  : `
                    transition-transform
                    group-hover/button:scale-110
                  `
              }

              motion-reduce:transform-none
            `}
          />
        )}

        {/* COUNT */}

        <span
          className="
            font-mono
            text-xs
            font-black
            tabular-nums
          "
        >
          {count}
        </span>

        {/* LABEL */}

        <span
          className="
            hidden
            text-[11px]
            font-bold

            min-[380px]:inline
          "
        >
          {loading
            ? "Kut..."
            : liked
              ? "Yoqdi"
              : "Like"}
        </span>
      </button>
    );
  }
);

// =========================================================
// OWNER ACTIONS
// =========================================================

const CommentOwnerButtons = memo(
  function CommentOwnerButtons({
    disabled,
    isDeleting,
    onEdit,
    onDelete,
  }) {
    const canEdit =
      !disabled &&
      typeof onEdit === "function";

    const canDelete =
      !disabled &&
      typeof onDelete === "function";

    return (
      <div
        className="
          flex
          min-w-0
          flex-wrap
          items-center
          gap-2

          sm:ml-auto
          sm:justify-end
        "
      >
        {/* EDIT */}

        <button
          type="button"
          onClick={onEdit}
          disabled={!canEdit}
          aria-label="Sharhni tahrirlash"
          className={`
            ${BUTTON_BASE}
            ${EDIT_CLASS}
          `}
        >
          <PencilLine
            size={15}
            aria-hidden="true"
            className="
              shrink-0
              transition-transform

              group-hover/button:-rotate-12

              motion-reduce:transform-none
            "
          />

          <span>Tahrirlash</span>
        </button>

        {/* DELETE */}

        <button
          type="button"
          onClick={onDelete}
          disabled={!canDelete}
          aria-busy={isDeleting}
          aria-label={
            isDeleting
              ? "Sharh o‘chirilmoqda"
              : "Sharhni o‘chirish"
          }
          className={`
            ${BUTTON_BASE}
            ${DELETE_CLASS}
          `}
        >
          {isDeleting ? (
            <Loader2
              size={15}
              aria-hidden="true"
              className="
                shrink-0
                motion-safe:animate-spin
              "
            />
          ) : (
            <Trash2
              size={15}
              aria-hidden="true"
              className="shrink-0"
            />
          )}

          <span>
            {isDeleting
              ? "O‘chirilmoqda..."
              : "O‘chirish"}
          </span>
        </button>
      </div>
    );
  }
);

// =========================================================
// MAIN COMPONENT
// =========================================================

const PostCommentItemActions = ({
  isLiked = false,
  likesCount = 0,
  isLiking = false,

  isCommentOwner = false,

  isEditing = false,
  isProcessing = false,

  processingAction = null,

  onLike,
  onEdit,
  onDelete,

  className = "",
}) => {
  const liking = Boolean(isLiking);
  const editing = Boolean(isEditing);
  const processing = Boolean(isProcessing);

  const disabled =
    liking ||
    editing ||
    processing;

  const deleting =
    processingAction === "delete";

  return (
    <footer
      aria-label="Sharh amallari"
      className={`
        relative
        w-full
        min-w-0
        max-w-full

        border-t
        border-slate-200/80

        pt-3.5
        font-sans

        dark:border-white/[0.08]

        ${className}
      `}
    >
      {/* ACTION TOOLBAR */}

      <div
        className="
          flex
          w-full
          min-w-0
          flex-wrap
          items-center
          gap-2
        "
      >
        {/* LIKE */}

        <CommentLikeButton
          isLiked={isLiked}
          likesCount={likesCount}
          isLiking={liking}
          disabled={disabled}
          onLike={onLike}
        />

        {/* OWNER ACTIONS */}

        {isCommentOwner && !editing && (
          <CommentOwnerButtons
            disabled={disabled}
            isDeleting={deleting}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </div>

      {/* ACCESSIBILITY */}

      <span
        role="status"
        aria-live="polite"
        className="sr-only"
      >
        {liking
          ? "Sharhning like holati yangilanmoqda."
          : processingAction === "edit"
            ? "Sharh saqlanmoqda."
            : deleting
              ? "Sharh o‘chirilmoqda."
              : ""}
      </span>
    </footer>
  );
};

export default memo(PostCommentItemActions);
