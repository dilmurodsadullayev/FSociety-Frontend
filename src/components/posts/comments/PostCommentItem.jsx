
import React, { memo, useMemo } from "react";

import {
  Braces,
  Hash,
  Terminal,
} from "lucide-react";

import DeleteConfirmationModal from "../../DeleteConfirmationModal";

import PostCommentHeader from "./item/PostCommentHeader";
import PostCommentContent from "./item/PostCommentContent";
import PostCommentItemActions from "./item/PostCommentItemActions";
import PostCommentEditForm from "./item/PostCommentEditForm";

import usePostCommentActions from "./item/usePostCommentActions";

// =========================================================
// FSOCIETY — UNDERGROUND DISCUSSION CARD
// =========================================================
//
// Design:
// - Mr. Robot inspired
// - Terminal-style top bar
// - Monochrome surfaces
// - Restrained signal-red accents
// - Subtle technical background
// - Light / Dark Mode
// - Responsive from 320px
//
// All API / Redux / siteToast logic remains
// inside usePostCommentActions.
//
// =========================================================

// =========================================================
// DESIGN TOKENS
// =========================================================

const CARD_CLASS = `
  group/comment
  relative
  isolate

  w-full
  min-w-0
  max-w-full

  overflow-hidden

  rounded-[20px]
  border
  border-slate-200

  bg-[#fcfcfd]
  text-slate-900

  shadow-[0_12px_35px_rgba(15,23,42,0.045)]

  transition-[border-color,box-shadow]
  duration-300

  hover:border-rose-300/70
  hover:shadow-[0_18px_50px_rgba(15,23,42,0.085)]

  sm:rounded-[24px]

  dark:border-white/[0.09]
  dark:bg-[#090c12]
  dark:text-white

  dark:shadow-[0_16px_50px_rgba(0,0,0,0.20)]

  dark:hover:border-rose-400/25
  dark:hover:shadow-[0_18px_55px_rgba(0,0,0,0.33)]

  motion-reduce:transition-none
`;

// =========================================================
// HELPERS
// =========================================================

const getCommentReference = (commentId) => {
  if (
    commentId === null ||
    commentId === undefined
  ) {
    return "UNKNOWN";
  }

  const value = String(commentId).trim();

  if (!value) {
    return "UNKNOWN";
  }

  return value
    .slice(-8)
    .toUpperCase();
};

const getDeleteItemTitle = (value) => {
  const text = String(value ?? "").trim();

  if (!text) {
    return "Ushbu sharh";
  }

  const truncated =
    text.length > 45
      ? `${text.slice(0, 45)}...`
      : text;

  return `Sharh (${truncated})`;
};

// =========================================================
// TERMINAL BAR
// =========================================================

const CommentTerminalBar = memo(
  function CommentTerminalBar({
    reference,
  }) {
    return (
      <div
        className="
          relative
          z-10

          flex
          min-h-10
          w-full
          min-w-0

          items-center
          justify-between
          gap-2

          border-b
          border-white/[0.07]

          bg-[#11151c]

          px-3
          py-2

          font-mono

          sm:px-5

          dark:bg-[#05070b]
        "
      >
        {/* LEFT */}

        <div
          className="
            flex
            min-w-0
            items-center
            gap-3
          "
        >
          {/* WINDOW DOTS */}

          <div
            aria-hidden="true"
            className="
              flex
              shrink-0
              items-center
              gap-1.5
            "
          >
            <span
              className="
                h-2
                w-2
                rounded-full
                bg-rose-500
              "
            />

            <span
              className="
                h-2
                w-2
                rounded-full
                bg-white/20
              "
            />

            <span
              className="
                h-2
                w-2
                rounded-full
                bg-white/20
              "
            />
          </div>

          {/* DIVIDER */}

          <span
            aria-hidden="true"
            className="
              h-4
              w-px
              shrink-0
              bg-white/[0.12]
            "
          />

          {/* TERMINAL NAME */}

          <span
            className="
              inline-flex
              min-w-0
              items-center
              gap-1.5

              text-[10px]
              font-black
              uppercase
              tracking-[0.08em]

              text-white/90

              sm:text-[11px]
            "
          >
            <Terminal
              size={13}
              className="
                shrink-0
                text-rose-400
              "
              aria-hidden="true"
            />

            <span className="truncate">
              FSOCIETY
            </span>

            <span
              className="
                hidden
                text-white/40

                min-[390px]:inline
              "
            >
              / DISCUSSION
            </span>
          </span>
        </div>

        {/* RIGHT — COMMENT REFERENCE */}

        <span
          title={`Sharh identifikatori: ${reference}`}
          className="
            inline-flex
            min-w-0
            max-w-[110px]
            items-center
            gap-1

            truncate
            rounded-md

            border
            border-white/[0.08]

            bg-white/[0.04]

            px-2
            py-1

            text-[9px]
            font-bold
            tracking-wide

            text-white/55

            sm:max-w-[145px]
          "
        >
          <Hash
            size={10}
            className="
              shrink-0
              text-rose-400/80
            "
            aria-hidden="true"
          />

          <span className="truncate">
            {reference}
          </span>
        </span>
      </div>
    );
  }
);

// =========================================================
// DECORATIVE DETAILS
// =========================================================

const CommentCardEffects = memo(
  function CommentCardEffects() {
    return (
      <>
        {/* SIGNAL RED TOP RULE */}

        <span
          aria-hidden="true"
          className="
            pointer-events-none

            absolute
            inset-x-0
            top-10
            z-10

            h-px

            bg-gradient-to-r
            from-rose-600/75
            via-rose-500/20
            to-transparent
          "
        />

        {/* GRID — LIGHT */}

        <span
          aria-hidden="true"
          className="
            pointer-events-none

            absolute
            inset-0
            z-0

            opacity-[0.025]

            dark:hidden
          "
          style={{
            backgroundImage:
              "linear-gradient(to right, #111827 1px, transparent 1px), linear-gradient(to bottom, #111827 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* GRID — DARK */}

        <span
          aria-hidden="true"
          className="
            pointer-events-none

            absolute
            inset-0
            z-0

            hidden
            opacity-[0.08]

            dark:block
          "
          style={{
            backgroundImage:
              "linear-gradient(to right, #64748b 1px, transparent 1px), linear-gradient(to bottom, #64748b 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* RIGHT CORNER GLOW */}

        <span
          aria-hidden="true"
          className="
            pointer-events-none

            absolute
            -right-20
            top-12
            z-0

            h-48
            w-48

            rounded-full

            bg-rose-500/[0.035]
            blur-[65px]

            dark:bg-rose-500/[0.075]
          "
        />

        {/* VERTICAL RED SIGNAL */}

        <span
          aria-hidden="true"
          className="
            pointer-events-none

            absolute
            bottom-8
            left-0
            top-20

            z-0

            w-[3px]

            rounded-r-full

            bg-gradient-to-b
            from-rose-600/70
            via-rose-500/15
            to-transparent
          "
        />

        {/* TOP-RIGHT CORNER DETAIL */}

        <span
          aria-hidden="true"
          className="
            pointer-events-none

            absolute
            right-4
            top-12

            h-4
            w-4

            border-r
            border-t
            border-rose-500/25

            dark:border-rose-400/20
          "
        />

        {/* BOTTOM-RIGHT CORNER DETAIL */}

        <span
          aria-hidden="true"
          className="
            pointer-events-none

            absolute
            bottom-3
            right-4

            h-4
            w-4

            border-b
            border-r
            border-slate-300/70

            dark:border-white/[0.10]
          "
        />
      </>
    );
  }
);

// =========================================================
// DISCUSSION FOOTER
// =========================================================

const CommentSignature = memo(
  function CommentSignature() {
    return (
      <div
        aria-hidden="true"
        className="
          mt-4

          flex
          min-w-0
          flex-wrap

          items-center
          justify-between
          gap-x-3
          gap-y-1.5

          border-t
          border-slate-200/60

          pt-3

          font-mono
          text-[9px]
          font-bold
          uppercase
          tracking-[0.09em]

          text-slate-400

          dark:border-white/[0.055]
          dark:text-slate-500
        "
      >
        <span
          className="
            inline-flex
            items-center
            gap-2
          "
        >
          <span
            className="
              h-1.5
              w-1.5

              rounded-full

              bg-rose-500/80
            "
          />

          FS / COMMUNITY
        </span>

        <span
          className="
            inline-flex
            items-center
            gap-1.5
          "
        >
          <Braces
            size={12}
            aria-hidden="true"
          />

          IDEAS · CODE · SOLUTIONS
        </span>
      </div>
    );
  }
);

// =========================================================
// MAIN COMPONENT
// =========================================================

const PostCommentItem = ({
  comment,
  postAuthorUsername,
  currentUser,
  isLoggedIn,
}) => {
  // =======================================================
  // ACTIONS
  // =======================================================

  const actions = usePostCommentActions({
    comment,
    currentUser,
    isLoggedIn,
  });

  // =======================================================
  // DATA
  // =======================================================

  const commentId = comment?.id;

  const commentMessage =
    comment?.message ?? "";

  const authorUsername =
    comment?.user?.username || "";

  const reference = useMemo(
    () => getCommentReference(commentId),
    [commentId]
  );

  const deleteItemTitle = useMemo(
    () => getDeleteItemTitle(commentMessage),
    [commentMessage]
  );

  // =======================================================
  // EDIT FORM
  // =======================================================

  const editForm = actions.isEditing ? (
    <PostCommentEditForm
      value={actions.editMessage}
      onChange={actions.handleEditMessageChange}
      onCancel={actions.handleCancelEdit}
      onSave={actions.handleSaveEdit}
      isProcessing={actions.isUpdating}
      error={actions.editError}
      originalValue={commentMessage}
    />
  ) : null;

  // =======================================================
  // INVALID COMMENT
  // =======================================================

  if (
    commentId === null ||
    commentId === undefined
  ) {
    return null;
  }

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <>
      <article
        aria-label={
          authorUsername
            ? `${authorUsername} sharhi`
            : "Foydalanuvchi sharhi"
        }
        className={CARD_CLASS}
      >
        {/* TERMINAL HEADER */}

        <CommentTerminalBar
          reference={reference}
        />

        {/* VISUAL EFFECTS */}

        <CommentCardEffects />

        {/* CARD CONTENT */}

        <div
          className="
            relative
            z-10

            w-full
            min-w-0

            px-3.5
            pb-3.5
            pt-5

            sm:px-6
            sm:pb-5
            sm:pt-6
          "
        >
          {/* AUTHOR */}

          <PostCommentHeader
            comment={comment}
            postAuthorUsername={
              postAuthorUsername
            }
          />

          {/* CONTENT AND ACTIONS */}

          <div
            className="
              w-full
              min-w-0

              sm:pl-[72px]
            "
          >
            <PostCommentContent
              message={commentMessage}
              isEditing={actions.isEditing}
              editForm={editForm}
            />

            <PostCommentItemActions
              isLiked={actions.isLiked}
              likesCount={actions.likesCount}
              isLiking={actions.isLiking}
              isCommentOwner={actions.isCommentOwner}
              isEditing={actions.isEditing}
              isProcessing={actions.isProcessing}
              processingAction={
                actions.processingAction
              }
              onLike={actions.handleLikeToggle}
              onEdit={actions.handleStartEdit}
              onDelete={actions.handleOpenDelete}
            />
          </div>

          {/* SMALL SIGNATURE */}

          <CommentSignature />
        </div>
      </article>

      {/* DELETE CONFIRMATION */}

      {actions.isCommentOwner && (
        <DeleteConfirmationModal
          isOpen={actions.isDeleteModalOpen}
          onClose={actions.handleCloseDelete}
          onConfirm={actions.handleConfirmDelete}
          itemTitle={deleteItemTitle}
          isProcessing={actions.isDeleting}
        />
      )}
    </>
  );
};

export default memo(PostCommentItem);
