
import React, { memo } from "react";

import {
  Edit3,
  Heart,
  Loader2,
  Trash2,
} from "lucide-react";

// =========================================================
// FSOCIETY — POST COMMENT ACTIONS
// =========================================================
//
// Props preserved:
// - isLiked
// - likesCount
// - isLiking
// - isCommentOwner
// - isEditing
// - isProcessing
// - onLike
// - onEdit
// - onDelete
//
// Features:
// - Like / Unlike
// - Edit
// - Delete
// - Loading states
// - Light / Dark Mode
// - Responsive 320px+
// - Accessible controls
//
// API and toast handling belong to
// PostCommentItem.
// =========================================================

const BUTTON_BASE = `
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

  transition-colors
  duration-200

  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-indigo-500
  focus-visible:ring-offset-2

  disabled:cursor-not-allowed
  disabled:opacity-50

  motion-reduce:transition-none
`;

const PostCommentActions = ({
  isLiked = false,
  likesCount = 0,
  isLiking = false,

  isCommentOwner = false,
  isEditing = false,
  isProcessing = false,

  onLike,
  onEdit,
  onDelete,
}) => {
  const liked = Boolean(isLiked);
  const liking = Boolean(isLiking);
  const processing = Boolean(isProcessing);

  const count = Number(likesCount);

  const displayCount = Number.isFinite(count)
    ? Math.max(0, Math.trunc(count))
        .toLocaleString("uz-UZ")
    : "0";

  const canLike =
    !liking &&
    !processing &&
    !isEditing &&
    typeof onLike === "function";

  const canManage =
    !liking &&
    !processing &&
    !isEditing;

  return (
    <div
      aria-label="Sharh amallari"
      className="
        mt-4
        flex
        w-full
        min-w-0
        flex-wrap
        items-center
        gap-2

        sm:gap-2.5
      "
    >
      {/* =====================================
          LIKE / UNLIKE
      ===================================== */}

      <button
        type="button"
        onClick={onLike}
        disabled={!canLike}
        aria-pressed={liked}
        aria-busy={liking}
        aria-label={
          liked
            ? `Sharhdan likeni olib tashlash. ${displayCount} ta like`
            : `Sharhga like bosish. ${displayCount} ta like`
        }
        className={`
          ${BUTTON_BASE}

          ${
            liked
              ? `
                border-pink-200
                bg-pink-50
                text-pink-700

                hover:border-pink-300
                hover:bg-pink-100

                dark:border-pink-400/30
                dark:bg-pink-500/10
                dark:text-pink-300

                dark:hover:bg-pink-500/[0.16]
              `
              : `
                border-slate-200
                bg-white/85
                text-slate-600

                hover:border-pink-200
                hover:bg-pink-50
                hover:text-pink-700

                dark:border-white/[0.09]
                dark:bg-white/[0.035]
                dark:text-slate-400

                dark:hover:border-pink-400/25
                dark:hover:bg-pink-500/[0.07]
                dark:hover:text-pink-300
              `
          }
        `}
      >
        {liking ? (
          <Loader2
            size={16}
            className="
              shrink-0
              motion-safe:animate-spin
            "
            aria-hidden="true"
          />
        ) : (
          <Heart
            size={16}
            className={
              liked
                ? "shrink-0 fill-current"
                : "shrink-0"
            }
            aria-hidden="true"
          />
        )}

        <span className="tabular-nums">
          {displayCount}
        </span>

        <span className="sr-only">
          {liking
            ? "Like yangilanmoqda"
            : liked
              ? "Like bosilgan"
              : "Like bosilmagan"}
        </span>
      </button>

      {/* =====================================
          OWNER ACTIONS
      ===================================== */}

      {isCommentOwner && !isEditing && (
        <>
          {/* EDIT */}

          <button
            type="button"
            onClick={onEdit}
            disabled={
              !canManage ||
              typeof onEdit !== "function"
            }
            aria-label="Sharhni tahrirlash"
            className={`
              ${BUTTON_BASE}

              border-slate-200
              bg-white/85
              text-slate-600

              hover:border-indigo-200
              hover:bg-indigo-50
              hover:text-indigo-700

              dark:border-white/[0.09]
              dark:bg-white/[0.035]
              dark:text-slate-400

              dark:hover:border-indigo-400/25
              dark:hover:bg-indigo-500/[0.08]
              dark:hover:text-indigo-300
            `}
          >
            <Edit3
              size={15}
              className="shrink-0"
              aria-hidden="true"
            />

            Tahrirlash
          </button>

          {/* DELETE */}

          <button
            type="button"
            onClick={onDelete}
            disabled={
              !canManage ||
              typeof onDelete !== "function"
            }
            aria-label="Sharhni o‘chirish"
            className={`
              ${BUTTON_BASE}

              border-red-200
              bg-red-50
              text-red-700

              hover:border-red-300
              hover:bg-red-100

              dark:border-red-400/20
              dark:bg-red-500/[0.07]
              dark:text-red-300

              dark:hover:border-red-400/30
              dark:hover:bg-red-500/[0.13]
            `}
          >
            <Trash2
              size={15}
              className="shrink-0"
              aria-hidden="true"
            />

            O‘chirish
          </button>
        </>
      )}
    </div>
  );
};

export default memo(PostCommentActions);
