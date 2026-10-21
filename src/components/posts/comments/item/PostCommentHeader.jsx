
import React, { memo } from "react";

import { Link } from "react-router-dom";

import {
  Clock3,
  Code2,
  Crown,
  PencilLine,
  UserRound,
} from "lucide-react";

import timeAgo from "../../../../utils/timeAgo";

import {
  getCommentAvatarUrl,
  getCommentUserName,
  handleCommentAvatarError,
} from "../commentUtils";

// =========================================================
// FSOCIETY — POST COMMENT HEADER
// =========================================================
//
// Location:
// comments/item/PostCommentHeader.jsx
//
// Features:
// - Author avatar
// - Profile navigation
// - Username / display name
// - Post author badge
// - Created date
// - Edited indicator
// - Light / Dark Mode
// - Responsive from 320px
// - Futuristic FSociety design
//
// No API or Redux dependencies.
// =========================================================

// =========================================================
// HELPERS
// =========================================================

const normalizeUsername = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const getValidDate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? null
    : date;
};

const wasCommentEdited = (
  createdAt,
  updatedAt
) => {
  const created = getValidDate(createdAt);
  const updated = getValidDate(updatedAt);

  if (!created || !updated) {
    return false;
  }

  // Ignore tiny timestamp differences
  // produced during initial creation.

  return (
    updated.getTime() -
    created.getTime()
  ) > 2000;
};

// =========================================================
// COMMENT AVATAR
// =========================================================

const CommentAvatar = memo(
  function CommentAvatar({
    author,
    displayName,
    profileUrl,
  }) {
    const avatarUrl =
      getCommentAvatarUrl(author);

    const avatarContent = (
      <span
        className="
          relative
          block
          h-11
          w-11
          shrink-0
          rounded-[15px]

          bg-gradient-to-br
          from-indigo-500
          via-violet-500
          to-cyan-400

          p-[2px]

          shadow-[0_8px_24px_rgba(99,102,241,0.13)]

          transition-transform
          duration-200

          group-hover/avatar:scale-[1.04]

          sm:h-14
          sm:w-14
          sm:rounded-[19px]

          dark:shadow-[0_8px_28px_rgba(99,102,241,0.12)]

          motion-reduce:transform-none
          motion-reduce:transition-none
        "
      >
        {/* IMAGE CONTAINER */}

        <span
          className="
            block
            h-full
            w-full
            overflow-hidden
            rounded-[13px]
            bg-white

            sm:rounded-[17px]

            dark:bg-[#111827]
          "
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${displayName} profil rasmi`}
              loading="lazy"
              decoding="async"
              onError={handleCommentAvatarError}
              className="
                block
                h-full
                w-full
                object-cover
              "
            />
          ) : (
            <span
              className="
                grid
                h-full
                w-full
                place-items-center
                text-indigo-600

                dark:text-indigo-300
              "
            >
              <UserRound
                size={22}
                aria-hidden="true"
              />
            </span>
          )}
        </span>

        {/* CODE SYMBOL */}

        <span
          aria-hidden="true"
          className="
            absolute
            -bottom-1
            -right-1

            grid
            h-5
            w-5
            place-items-center

            rounded-[7px]
            border-2
            border-white

            bg-indigo-600
            text-white

            dark:border-[#0b1018]
            dark:bg-indigo-500
          "
        >
          <Code2 size={11} />
        </span>
      </span>
    );

    if (!profileUrl) {
      return (
        <span className="shrink-0">
          {avatarContent}
        </span>
      );
    }

    return (
      <Link
        to={profileUrl}
        aria-label={`${displayName} profilini ochish`}
        className="
          group/avatar
          inline-flex
          shrink-0
          rounded-2xl

          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-indigo-500
          focus-visible:ring-offset-4
        "
      >
        {avatarContent}
      </Link>
    );
  }
);

// =========================================================
// AUTHOR BADGE
// =========================================================

const PostAuthorBadge = memo(
  function PostAuthorBadge() {
    return (
      <span
        title="Ushbu post muallifi"
        className="
          inline-flex
          min-h-7
          items-center
          gap-1.5

          rounded-full
          border
          border-indigo-200

          bg-indigo-50
          px-2.5
          py-1

          text-[10px]
          font-black
          text-indigo-700

          dark:border-indigo-400/25
          dark:bg-indigo-500/10
          dark:text-indigo-300
        "
      >
        <Crown
          size={12}
          className="shrink-0"
          aria-hidden="true"
        />

        Muallif
      </span>
    );
  }
);

// =========================================================
// MAIN COMPONENT
// =========================================================

const PostCommentHeader = ({
  comment = null,
  postAuthorUsername = "",
  className = "",
}) => {
  // =======================================================
  // AUTHOR
  // =======================================================

  const author = comment?.user ?? {};

  const displayName =
    getCommentUserName(author) ||
    "Anonim foydalanuvchi";

  const username =
    typeof author?.username === "string"
      ? author.username.trim()
      : "";

  const profileUrl = username
    ? `/${encodeURIComponent(username)}/profile/`
    : null;

  // =======================================================
  // POST AUTHOR
  // =======================================================

  const isPostAuthor = Boolean(
    username &&
    postAuthorUsername &&
    normalizeUsername(username) ===
      normalizeUsername(postAuthorUsername)
  );

  // =======================================================
  // DATE
  // =======================================================

  const createdDate = getValidDate(
    comment?.created_at
  );

  const dateLabel = createdDate
    ? timeAgo(comment.created_at)
    : "Sana noma’lum";

  const isEdited = wasCommentEdited(
    comment?.created_at,
    comment?.updated_at
  );

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <header
      className={`
        relative
        flex
        w-full
        min-w-0
        items-start
        gap-3

        font-sans

        sm:gap-4

        ${className}
      `}
    >
      {/* =====================================
          AVATAR
      ===================================== */}

      <CommentAvatar
        author={author}
        displayName={displayName}
        profileUrl={profileUrl}
      />

      {/* =====================================
          AUTHOR INFO
      ===================================== */}

      <div
        className="
          min-w-0
          flex-1
          pt-0.5
        "
      >
        {/* NAME AND BADGE */}

        <div
          className="
            flex
            min-w-0
            flex-wrap
            items-center
            gap-x-2
            gap-y-1.5
          "
        >
          {profileUrl ? (
            <Link
              to={profileUrl}
              className="
                min-w-0
                max-w-full
                break-words
                [overflow-wrap:anywhere]

                text-sm
                font-black
                leading-6
                tracking-tight
                text-slate-900

                transition-colors

                hover:text-indigo-700

                sm:text-[15px]

                dark:text-white
                dark:hover:text-indigo-300

                focus-visible:outline-none
                focus-visible:underline
              "
            >
              {displayName}
            </Link>
          ) : (
            <span
              className="
                min-w-0
                break-words
                text-sm
                font-black
                text-slate-900

                dark:text-white
              "
            >
              {displayName}
            </span>
          )}

          {isPostAuthor && (
            <PostAuthorBadge />
          )}
        </div>

        {/* USERNAME / DATE */}

        <div
          className="
            mt-1.5
            flex
            min-w-0
            flex-wrap
            items-center

            gap-x-2.5
            gap-y-1.5

            text-[11px]
            font-medium
            text-slate-500

            dark:text-slate-400
          "
        >
          {/* USERNAME */}

          <span
            className="
              max-w-full
              break-all

              font-mono
              text-[10px]
              tracking-tight
            "
          >
            @{username || "unknown"}
          </span>

          {/* DIVIDER */}

          <span
            aria-hidden="true"
            className="
              hidden
              h-1
              w-1
              shrink-0
              rounded-full
              bg-slate-300

              sm:block

              dark:bg-slate-600
            "
          />

          {/* TIME */}

          <time
            dateTime={
              createdDate
                ? createdDate.toISOString()
                : undefined
            }
            className="
              inline-flex
              items-center
              gap-1.5
            "
          >
            <Clock3
              size={12}
              className="shrink-0"
              aria-hidden="true"
            />

            {dateLabel}
          </time>

          {/* EDITED */}

          {isEdited && (
            <span
              title="Sharh tahrirlangan"
              className="
                inline-flex
                items-center
                gap-1

                text-indigo-600

                dark:text-indigo-300
              "
            >
              <PencilLine
                size={12}
                aria-hidden="true"
              />

              Tahrirlangan
            </span>
          )}
        </div>
      </div>

      {/* =====================================
          DESIGN DETAIL
      ===================================== */}

      <div
        aria-hidden="true"
        className="
          hidden
          shrink-0
          items-center
          gap-2

          rounded-lg
          border
          border-slate-200
          bg-white/70

          px-2.5
          py-1.5

          font-mono
          text-[9px]
          font-bold
          uppercase
          tracking-wider
          text-slate-400

          lg:inline-flex

          dark:border-white/[0.08]
          dark:bg-white/[0.025]
          dark:text-slate-500
        "
      >
        <span
          className="
            h-1.5
            w-1.5
            rounded-full
            bg-indigo-500
          "
        />

        FS / DISCUSSION
      </div>
    </header>
  );
};

export default memo(PostCommentHeader);
