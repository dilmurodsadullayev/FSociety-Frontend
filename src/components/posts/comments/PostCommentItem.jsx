
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  AlertCircle,
  Check,
  ChevronDown,
  ChevronUp,
  CornerDownRight,
  Heart,
  Loader2,
  MessageCircle,
  Pencil,
  Send,
  Trash2,
  X,
} from "lucide-react";

import DeleteConfirmationModal from "../../DeleteConfirmationModal";

import { siteToast } from "../../ui/AuthToast";

import CommentTime from "./item/CommentTime";

import PostCommentEditForm from "./item/PostCommentEditForm";

import usePostCommentActions from "./item/usePostCommentActions";

// =========================================================
// FSOCIETY — COMMENT ITEM
// REDDIT x MR. ROBOT
// =========================================================
//
// Features:
// - Root comments
// - Nested replies
// - Reply to reply
// - Deep nesting without excessive indentation
// - Compact Light / Dark cards
// - Mobile responsive 320px+
// - Shared relative time component
// - Like / Unlike
// - Edit / Delete
// - Soft-delete placeholders
// - Inline Like errors
// - Existing Redux / hook integration
//
// =========================================================

const MAX_MESSAGE_LENGTH = 255;

// =========================================================
// ACTION STYLES
// =========================================================

const ACTION_CLASS = [
  "inline-flex",
  "min-h-9",
  "items-center",
  "justify-center",
  "gap-1.5",
  "rounded-lg",
  "px-2",
  "py-1.5",
  "text-[11px]",
  "font-semibold",
  "text-slate-500",
  "transition-colors",
  "hover:bg-slate-100",
  "hover:text-slate-900",
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-rose-400",
  "disabled:cursor-not-allowed",
  "disabled:opacity-50",
  "dark:text-slate-400",
  "dark:hover:bg-white/[0.07]",
  "dark:hover:text-slate-100",
  "motion-reduce:transition-none",
].join(" ");

// =========================================================
// HELPERS
// =========================================================

const safeCount = (value) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? Math.max(0, Math.trunc(number))
    : 0;
};

const getDisplayName = (user) => {
  if (!user) {
    return "Foydalanuvchi";
  }

  const fullName =
    String(user.full_name || "").trim() ||
    [
      user.first_name,
      user.last_name,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

  return (
    fullName ||
    user.username ||
    "Foydalanuvchi"
  );
};

const getChildren = (comment) => {
  if (!Array.isArray(comment?.replies)) {
    return [];
  }

  return comment.replies.filter(
    (item) =>
      item &&
      typeof item === "object" &&
      item.id !== null &&
      item.id !== undefined
  );
};

const getDeleteTitle = (message) => {
  const text = String(message ?? "").trim();

  if (!text) return "Sharh";

  return text.length > 45
    ? `Sharh (${text.slice(0, 45)}...)`
    : `Sharh (${text})`;
};

const getAvatarImage = (user) => {
  const image =
    user?.image?.url ??
    user?.image ??
    user?.avatar ??
    "";

  return typeof image === "string"
    ? image.trim()
    : "";
};

// =========================================================
// AVATAR
// =========================================================

const CommentAvatar = memo(
  function CommentAvatar({
    user,
    displayName,
    deleted,
    root,
  }) {
    const [imageError, setImageError] =
      useState(false);

    const imageUrl = getAvatarImage(user);

    useEffect(() => {
      setImageError(false);
    }, [imageUrl]);

    const initial = String(
      user?.username ||
      displayName ||
      "?"
    )
      .charAt(0)
      .toUpperCase();

    const avatarSize = root
      ? "h-9 w-9 sm:h-10 sm:w-10"
      : "h-8 w-8 sm:h-9 sm:w-9";

    const content =
      imageUrl &&
      !imageError &&
      !deleted ? (
        <img
          src={imageUrl}
          alt={`${displayName} avatari`}
          loading="lazy"
          onError={() =>
            setImageError(true)
          }
          className={`
            ${avatarSize}
            rounded-xl border
            border-slate-200
            object-cover
            dark:border-white/[0.12]
          `}
        />
      ) : (
        <span
          aria-hidden="true"
          className={`
            ${avatarSize}
            grid place-items-center
            rounded-xl border
            font-mono text-xs font-extrabold

            ${
              deleted
                ? "border-slate-200 bg-slate-100 text-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-slate-500"
                : "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-300"
            }
          `}
        >
          {deleted ? "—" : initial}
        </span>
      );

    return (
      <div className="relative shrink-0">
        {!deleted && user?.username ? (
          <Link
            to={`/${encodeURIComponent(user.username)}/profile/`}
            aria-label={`${displayName} profiliga o'tish`}
            className="
              block rounded-xl
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-rose-400
            "
          >
            {content}
          </Link>
        ) : (
          content
        )}

        {!deleted && (
          <span
            aria-hidden="true"
            className="
              pointer-events-none
              absolute -bottom-0.5 -right-0.5
              h-2.5 w-2.5
              rounded-full
              border-2 border-white
              bg-rose-500
              dark:border-[#101319]
            "
          />
        )}
      </div>
    );
  }
);

// =========================================================
// REPLY COMPOSER
// =========================================================

const ReplyComposer = memo(
  function ReplyComposer({
    commentId,
    username,
    value,
    error,
    submitting,
    onChange,
    onCancel,
    onSubmit,
  }) {
    const inputRef = useRef(null);
    const formRef = useRef(null);

    useEffect(() => {
      inputRef.current?.focus();
    }, []);

    const handleKeyDown = (event) => {
      if (
        event.key === "Escape" &&
        !submitting
      ) {
        event.preventDefault();
        onCancel();
        return;
      }

      if (
        event.key === "Enter" &&
        (event.ctrlKey || event.metaKey) &&
        !event.nativeEvent?.isComposing
      ) {
        event.preventDefault();

        if (
          !submitting &&
          value.trim()
        ) {
          formRef.current?.requestSubmit();
        }
      }
    };

    return (
      <form
        ref={formRef}
        onSubmit={onSubmit}
        aria-busy={submitting}
        className="
          mt-3 min-w-0
          rounded-xl
          border border-slate-200
          bg-slate-50/80
          p-2.5

          dark:border-white/[0.10]
          dark:bg-[#0c1017]

          sm:p-3
        "
      >
        {/* REPLY TARGET */}
        <div className="mb-2 flex min-w-0 items-center gap-2">
          <CornerDownRight
            size={13}
            className="shrink-0 text-rose-500"
            aria-hidden="true"
          />

          <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
            REPLY_TO:
          </span>

          <span className="min-w-0 truncate font-mono text-[10px] font-bold text-rose-600 dark:text-rose-400">
            @{username || "comment"}
          </span>
        </div>

        {/* TEXTAREA */}
        <label
          htmlFor={`reply-message-${commentId}`}
          className="sr-only"
        >
          Javob matni
        </label>

        <textarea
          ref={inputRef}
          id={`reply-message-${commentId}`}
          rows={2}
          maxLength={MAX_MESSAGE_LENGTH}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          onKeyDown={handleKeyDown}
          disabled={submitting}
          placeholder="Javobingizni yozing..."
          aria-invalid={Boolean(error)}
          className="
            block w-full min-w-0
            min-h-[76px]
            resize-y rounded-lg

            border border-slate-200
            bg-white

            px-3 py-2.5

            text-[13px]
            leading-6
            text-slate-900

            outline-none
            placeholder:text-slate-400

            transition-colors

            focus:border-rose-400
            focus:ring-2
            focus:ring-rose-400/10

            disabled:opacity-60

            dark:border-white/[0.10]
            dark:bg-[#090c11]
            dark:text-slate-100
            dark:placeholder:text-slate-500
          "
        />

        {/* ERROR */}
        {error && (
          <div
            role="alert"
            className="
              mt-2 flex min-w-0
              items-start gap-2
              rounded-lg
              border border-red-200
              bg-red-50

              px-3 py-2
              text-[11px]
              leading-5
              text-red-700

              dark:border-red-400/20
              dark:bg-red-500/10
              dark:text-red-300
            "
          >
            <AlertCircle
              size={13}
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            />

            <span className="min-w-0 whitespace-pre-line break-words">
              {error}
            </span>
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-2 flex min-w-0 flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
            {value.length}/{MAX_MESSAGE_LENGTH}

            <span className="hidden sm:inline">
              {" "}· Ctrl + Enter
            </span>
          </span>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className={ACTION_CLASS}
            >
              <X size={13} />
              Bekor qilish
            </button>

            <button
              type="submit"
              disabled={
                submitting ||
                !value.trim() ||
                value.length > MAX_MESSAGE_LENGTH
              }
              className="
                inline-flex min-h-9
                items-center justify-center
                gap-1.5

                rounded-lg
                bg-rose-600
                px-3

                text-[11px] font-bold
                text-white

                transition-colors

                hover:bg-rose-700
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-rose-400

                disabled:cursor-not-allowed
                disabled:opacity-50

                dark:hover:bg-rose-500
              "
            >
              {submitting ? (
                <Loader2
                  size={13}
                  className="motion-safe:animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Send
                  size={13}
                  aria-hidden="true"
                />
              )}

              {submitting
                ? "Yuborilmoqda..."
                : "Javob yuborish"}
            </button>
          </div>
        </div>
      </form>
    );
  }
);

// =========================================================
// MAIN COMPONENT
// =========================================================

function PostCommentItem({
  comment,
  postAuthorUsername,
  currentUser,
  isLoggedIn,
  depth = 0,
  onReply,
  isReplySubmitting = false,
}) {
  // =====================================================
  // EXISTING ACTION HOOK
  // =====================================================

  const actions = usePostCommentActions({
    comment,
    currentUser,
    isLoggedIn,
  });

  // =====================================================
  // LOCAL UI
  // =====================================================

  const [
    showReplies,
    setShowReplies,
  ] = useState(true);

  const [
    showReplyEditor,
    setShowReplyEditor,
  ] = useState(false);

  const [
    replyMessage,
    setReplyMessage,
  ] = useState("");

  const [
    replyError,
    setReplyError,
  ] = useState("");

  const replyLockRef = useRef(false);

  // =====================================================
  // COMMENT DATA
  // =====================================================

  const commentId = comment?.id;

  const root = depth === 0;

  const isDeleted = Boolean(
    comment?.is_deleted
  );

  const user = isDeleted
    ? null
    : comment?.user;

  const username =
    user?.username || "";

  const displayName = isDeleted
    ? "O‘chirilgan sharh"
    : getDisplayName(user);

  const message = String(
    comment?.message ?? ""
  );

  // =====================================================
  // OWNERSHIP / AUTHOR
  // =====================================================

  const isPostAuthor =
    !isDeleted &&
    Boolean(username) &&
    Boolean(postAuthorUsername) &&
    username.toLowerCase() ===
      String(postAuthorUsername).toLowerCase();

  const isCommentOwner =
    !isDeleted &&
    Boolean(actions.isCommentOwner);

  // =====================================================
  // CHILDREN
  // =====================================================

  const children = getChildren(comment);

  const hasReplies =
    children.length > 0;

  const repliesCount = Math.max(
    children.length,
    safeCount(comment?.replies_count)
  );

  // =====================================================
  // ACTION DATA
  // =====================================================

  const isProcessing = Boolean(
    actions.isProcessing
  );

  const isLiked = Boolean(
    actions.isLiked
  );

  const likesCount = safeCount(
    actions.likesCount ??
    comment?.likes_count
  );

  const deleteItemTitle = useMemo(
    () => getDeleteTitle(message),
    [message]
  );

  // =====================================================
  // SOFT-DELETE CLEANUP
  // =====================================================

  useEffect(() => {
    if (!isDeleted) return;

    setShowReplyEditor(false);
    setReplyError("");
  }, [isDeleted]);

  // =====================================================
  // OPEN / CLOSE REPLY EDITOR
  // =====================================================

  const handleReplyToggle = useCallback(
    () => {
      if (
        isDeleted ||
        isProcessing
      ) {
        return;
      }

      if (!isLoggedIn) {
        siteToast.warning(
          "Javob yozish uchun tizimga kiring.",
          {
            title: "Kirish talab qilinadi",
            duration: 4000,
          }
        );

        return;
      }

      setReplyError("");

      setShowReplyEditor(
        (previous) => !previous
      );
    },
    [
      isDeleted,
      isProcessing,
      isLoggedIn,
    ]
  );

  const handleCancelReply = useCallback(
    () => {
      if (isReplySubmitting) {
        return;
      }

      setShowReplyEditor(false);
      setReplyError("");
    },
    [isReplySubmitting]
  );

  // =====================================================
  // SUBMIT REPLY
  // =====================================================

  const handleSubmitReply = useCallback(
    async (event) => {
      event?.preventDefault?.();

      if (
        isDeleted ||
        isReplySubmitting ||
        replyLockRef.current ||
        typeof onReply !== "function"
      ) {
        return;
      }

      const cleanMessage =
        replyMessage.trim();

      if (!cleanMessage) {
        setReplyError(
          "Javob matnini kiriting."
        );
        return;
      }

      if (
        cleanMessage.length >
        MAX_MESSAGE_LENGTH
      ) {
        setReplyError(
          `Javob ${MAX_MESSAGE_LENGTH} ta belgidan oshmasligi kerak.`
        );
        return;
      }

      // Prevent duplicate requests.
      replyLockRef.current = true;

      setReplyError("");

      try {
        const success = await onReply(
          cleanMessage,
          commentId
        );

        if (success !== true) {
          // PostCommentsSection displays API
          // validation errors via siteToast.
          // Preserve the draft text.
          return;
        }

        setReplyMessage("");
        setShowReplyEditor(false);

        // Show the newly created reply.
        setShowReplies(true);
      } catch (error) {
        setReplyError(
          error?.message ||
          "Javob yuborishda xato yuz berdi."
        );
      } finally {
        replyLockRef.current = false;
      }
    },
    [
      isDeleted,
      isReplySubmitting,
      onReply,
      replyMessage,
      commentId,
    ]
  );

  // =====================================================
  // EXISTING EDIT FORM
  // =====================================================

  const editForm =
    actions.isEditing ? (
      <PostCommentEditForm
        value={actions.editMessage}
        onChange={
          actions.handleEditMessageChange
        }
        onCancel={
          actions.handleCancelEdit
        }
        onSave={
          actions.handleSaveEdit
        }
        isProcessing={
          actions.isUpdating
        }
        error={
          actions.editError
        }
        originalValue={message}
      />
    ) : null;

  // =====================================================
  // INVALID COMMENT
  // =====================================================

  if (
    commentId === null ||
    commentId === undefined
  ) {
    return null;
  }

  // =====================================================
  // ROOT / NESTED CARD
  // =====================================================

  const cardClass = root
    ? [
        "group relative",
        "mx-2 my-2",
        "min-w-0 max-w-full",
        "rounded-xl border",
        "border-slate-200/90",
        "bg-white",
        "px-2.5 py-3",
        "shadow-[0_3px_14px_rgba(15,23,42,0.025)]",
        "transition-[border-color,box-shadow]",
        "duration-200",
        "hover:border-rose-200",
        "hover:shadow-[0_5px_20px_rgba(15,23,42,0.05)]",
        "dark:border-white/[0.09]",
        "dark:bg-[#11151c]",
        "dark:hover:border-rose-400/25",
        "sm:mx-3",
        "sm:px-4 sm:py-3.5",
      ].join(" ")
    : [
        "group relative",
        "min-w-0 max-w-full",
        "rounded-lg",
        "px-1 py-2.5",
        "transition-colors",
        "hover:bg-slate-50",
        "dark:hover:bg-white/[0.025]",
        "sm:px-2",
      ].join(" ");

  // =====================================================
  // RESPONSIVE THREAD INDENTATION
  // =====================================================
  //
  // Stop adding indentation after depth 3.
  //
  // Deep replies remain logically nested,
  // but no longer become narrower on mobile.
  // =====================================================

  const connectorClass =
    depth >= 3
      ? "ml-0 border-l-0 pl-0"
      : depth === 2
        ? "ml-1 border-l-2 pl-1.5 sm:ml-2 sm:pl-2"
        : depth === 1
          ? "ml-1.5 border-l-2 pl-2 sm:ml-3 sm:pl-3"
          : "ml-2 border-l-2 pl-2.5 sm:ml-4 sm:pl-3";

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>
      <article
        id={`post-comment-${commentId}`}
        aria-label={
          isDeleted
            ? "O‘chirilgan sharh"
            : `${displayName} sharhi`
        }
        className={cardClass}
      >
        {/* ROOT SIGNAL */}
        {root && (
          <span
            aria-hidden="true"
            className="
              pointer-events-none
              absolute bottom-3 left-0 top-3
              w-[2px] rounded-r-full

              bg-gradient-to-b
              from-rose-500
              via-rose-500/20
              to-transparent
            "
          />
        )}

        {/* COMMENT MAIN ROW */}
        <div className="flex min-w-0 items-start gap-2 sm:gap-3">
          {/* AVATAR */}
          <CommentAvatar
            user={user}
            displayName={displayName}
            deleted={isDeleted}
            root={root}
          />

          {/* CONTENT */}
          <div className="min-w-0 flex-1">
            {/* AUTHOR HEADER */}
            <div
              className="
                flex min-w-0
                flex-wrap items-center
                gap-x-2 gap-y-1
              "
            >
              {!isDeleted && username ? (
                <Link
                  to={`/${encodeURIComponent(username)}/profile/`}
                  className="
                    max-w-full
                    truncate
                    text-[12px]
                    font-extrabold
                    text-slate-900

                    transition-colors

                    hover:text-rose-600
                    focus-visible:outline-none
                    focus-visible:underline

                    dark:text-slate-100
                    dark:hover:text-rose-400

                    sm:text-[13px]
                  "
                >
                  {displayName}
                </Link>
              ) : (
                <span
                  className="
                    text-[12px]
                    font-semibold
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  {displayName}
                </span>
              )}

              {/* USERNAME */}
              {!isDeleted && username && (
                <span
                  className="
                    max-w-[130px]
                    truncate
                    font-mono
                    text-[10px]
                    text-slate-400
                    dark:text-slate-500
                  "
                >
                  @{username}
                </span>
              )}

              {/* POST AUTHOR BADGE */}
              {isPostAuthor && (
                <span
                  className="
                    inline-flex
                    items-center gap-1
                    rounded-md
                    border border-indigo-200
                    bg-indigo-50
                    px-1.5 py-0.5

                    text-[9px]
                    font-extrabold
                    text-indigo-700

                    dark:border-indigo-400/20
                    dark:bg-indigo-400/10
                    dark:text-indigo-300
                  "
                >
                  <Check
                    size={10}
                    aria-hidden="true"
                  />

                  MUALLIF
                </span>
              )}

              {/* REPLY DEPTH */}
              {!root && (
                <span
                  title={`Reply darajasi: ${depth}`}
                  className="
                    inline-flex
                    items-center gap-1
                    rounded-md
                    bg-slate-100
                    px-1.5 py-0.5

                    font-mono
                    text-[9px]
                    font-semibold
                    text-slate-500

                    dark:bg-white/[0.05]
                    dark:text-slate-400
                  "
                >
                  <CornerDownRight
                    size={10}
                    aria-hidden="true"
                  />

                  {depth >= 4
                    ? `REPLY L${depth}`
                    : "REPLY"}
                </span>
              )}
            </div>

            {/* TIME */}
            <div className="mt-1">
              <CommentTime
                createdAt={
                  comment?.created_at
                }
                updatedAt={
                  comment?.updated_at
                }
                compact={depth >= 3}
              />
            </div>

            {/* MESSAGE / EDITOR */}
            {actions.isEditing && !isDeleted ? (
              <div className="mt-2.5 min-w-0">
                {editForm}
              </div>
            ) : isDeleted ? (
              <div
                className="
                  mt-2
                  rounded-lg
                  border border-dashed
                  border-slate-200
                  bg-slate-50

                  px-2.5 py-2

                  text-[12px]
                  italic
                  text-slate-400

                  dark:border-white/[0.09]
                  dark:bg-white/[0.025]
                  dark:text-slate-500
                "
              >
                [deleted] · Sharh o‘chirilgan
              </div>
            ) : (
              <p
                className="
                  mt-2
                  min-w-0 max-w-full
                  whitespace-pre-wrap
                  break-words
                  [overflow-wrap:anywhere]

                  text-[13px]
                  leading-[1.7]
                  text-slate-700

                  dark:text-slate-300
                "
              >
                {message}
              </p>
            )}

            {/* ACTION BUTTONS */}
            {!isDeleted &&
              !actions.isEditing && (
                <div
                  className="
                    mt-2
                    flex min-w-0
                    flex-wrap
                    items-center
                    gap-0.5
                  "
                >
                  {/* LIKE */}
                  <button
                    type="button"
                    onClick={
                      actions.handleLikeToggle
                    }
                    disabled={
                      actions.isLiking ||
                      isProcessing
                    }
                    aria-pressed={isLiked}
                    aria-label={
                      isLiked
                        ? "Like'ni olib tashlash"
                        : "Sharhni yoqtirish"
                    }
                    className={`
                      ${ACTION_CLASS}

                      ${
                        isLiked
                          ? "!bg-rose-50 !text-rose-600 dark:!bg-rose-500/10 dark:!text-rose-400"
                          : ""
                      }
                    `}
                  >
                    {actions.isLiking ? (
                      <Loader2
                        size={14}
                        className="motion-safe:animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <Heart
                        size={14}
                        fill={
                          isLiked
                            ? "currentColor"
                            : "none"
                        }
                        aria-hidden="true"
                      />
                    )}

                    <span>{likesCount}</span>

                    <span className="hidden sm:inline">
                      Like
                    </span>
                  </button>

                  {/* REPLY */}
                  {onReply && (
                    <button
                      type="button"
                      onClick={
                        handleReplyToggle
                      }
                      disabled={
                        isReplySubmitting ||
                        isProcessing
                      }
                      aria-expanded={
                        showReplyEditor
                      }
                      className={
                        ACTION_CLASS
                      }
                    >
                      <CornerDownRight
                        size={14}
                        aria-hidden="true"
                      />

                      Javob
                    </button>
                  )}

                  {/* EDIT */}
                  {isCommentOwner && (
                    <button
                      type="button"
                      onClick={
                        actions.handleStartEdit
                      }
                      disabled={isProcessing}
                      title="Sharhni tahrirlash"
                      aria-label="Sharhni tahrirlash"
                      className={
                        ACTION_CLASS
                      }
                    >
                      <Pencil
                        size={13}
                        aria-hidden="true"
                      />

                      <span className="hidden min-[400px]:inline">
                        Tahrirlash
                      </span>
                    </button>
                  )}

                  {/* DELETE */}
                  {isCommentOwner && (
                    <button
                      type="button"
                      onClick={
                        actions.handleOpenDelete
                      }
                      disabled={isProcessing}
                      title="Sharhni o'chirish"
                      aria-label="Sharhni o'chirish"
                      className={`
                        ${ACTION_CLASS}
                        hover:!bg-red-50
                        hover:!text-red-600
                        dark:hover:!bg-red-500/10
                        dark:hover:!text-red-400
                      `}
                    >
                      <Trash2
                        size={13}
                        aria-hidden="true"
                      />

                      <span className="hidden min-[400px]:inline">
                        O‘chirish
                      </span>
                    </button>
                  )}

                  {/* COMMENT ID */}
                  <span
                    title={`Comment ID: ${commentId}`}
                    className="
                      ml-auto
                      select-none
                      font-mono
                      text-[9px]
                      text-slate-300
                      dark:text-slate-600
                    "
                  >
                    #{commentId}
                  </span>
                </div>
              )}

            {/* INLINE LIKE ERROR */}
            {actions.likeError &&
              !isDeleted && (
                <p
                  role="alert"
                  className="
                    mt-2
                    whitespace-pre-line
                    break-words
                    text-[11px]
                    leading-5
                    text-red-600
                    dark:text-red-400
                  "
                >
                  {actions.likeError}
                </p>
              )}

            {/* REPLY COMPOSER */}
            {showReplyEditor &&
              !isDeleted &&
              onReply && (
                <ReplyComposer
                  commentId={commentId}
                  username={username}
                  value={replyMessage}
                  error={replyError}
                  submitting={
                    isReplySubmitting
                  }
                  onChange={(value) => {
                    setReplyMessage(value);
                    setReplyError("");
                  }}
                  onCancel={
                    handleCancelReply
                  }
                  onSubmit={
                    handleSubmitReply
                  }
                />
              )}

            {/* SHOW / HIDE REPLIES */}
            {hasReplies && (
              <button
                type="button"
                onClick={() =>
                  setShowReplies(
                    (previous) => !previous
                  )
                }
                aria-expanded={
                  showReplies
                }
                aria-controls={`comment-replies-${commentId}`}
                className="
                  mt-2
                  inline-flex
                  min-h-8
                  items-center
                  gap-1.5

                  rounded-lg
                  px-2 py-1

                  text-[11px]
                  font-bold
                  text-indigo-600

                  transition-colors

                  hover:bg-indigo-50
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-indigo-400

                  dark:text-indigo-300
                  dark:hover:bg-indigo-400/10
                "
              >
                {showReplies ? (
                  <ChevronUp
                    size={14}
                    aria-hidden="true"
                  />
                ) : (
                  <ChevronDown
                    size={14}
                    aria-hidden="true"
                  />
                )}

                <MessageCircle
                  size={13}
                  aria-hidden="true"
                />

                {showReplies
                  ? "Javoblarni yashirish"
                  : `${repliesCount} ta javobni ko‘rish`}
              </button>
            )}
          </div>
        </div>

        {/* NESTED REPLIES */}
        {hasReplies && showReplies && (
          <div
            id={`comment-replies-${commentId}`}
            className={`
              relative
              mt-1
              min-w-0
              max-w-full

              border-slate-200

              transition-colors

              hover:border-rose-300

              dark:border-white/[0.12]
              dark:hover:border-rose-400/40

              ${connectorClass}
            `}
          >
            <div
              className="
                min-w-0 max-w-full
                divide-y
                divide-slate-100/80
                dark:divide-white/[0.045]
              "
            >
              {children.map((reply) => (
                <PostCommentItem
                  key={reply.id}
                  comment={reply}
                  postAuthorUsername={
                    postAuthorUsername
                  }
                  currentUser={currentUser}
                  isLoggedIn={isLoggedIn}
                  depth={depth + 1}
                  onReply={onReply}
                  isReplySubmitting={
                    isReplySubmitting
                  }
                />
              ))}
            </div>
          </div>
        )}
      </article>

      {/* DELETE CONFIRMATION */}
      {isCommentOwner && (
        <DeleteConfirmationModal
          isOpen={
            actions.isDeleteModalOpen
          }
          onClose={
            actions.handleCloseDelete
          }
          onConfirm={
            actions.handleConfirmDelete
          }
          itemTitle={
            deleteItemTitle
          }
          isProcessing={
            actions.isDeleting
          }
        />
      )}
    </>
  );
}

export default memo(PostCommentItem);
