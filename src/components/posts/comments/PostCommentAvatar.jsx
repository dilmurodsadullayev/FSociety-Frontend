
 // src/components/posts/comments/PostCommentAvatar.jsx

import React, {
  memo,
  useMemo,
} from "react";

import {
  Link,
} from "react-router-dom";

import PublicFramedAvatar from "../../ui/PublicFramedAvatar";

// =========================================================
// FSOCIETY — POST COMMENT / REPLY AVATAR
// =========================================================
//
// Location:
//
// src/components/posts/comments/PostCommentAvatar.jsx
//
// Responsibilities:
//
// - Root comment avatar
// - Nested reply avatar
// - Equipped public profile frame
// - Author profile navigation
// - Initials fallback
// - Deleted comment anonymity
// - Responsive sizing
// - Dark / Light compatibility
//
// IMPORTANT:
//
// - Uses PublicFramedAvatar shared API cache.
// - Does not fetch private inventory.
// - Does not modify FCoin or equipment.
// - Deleted comments never reveal the user.
// - Existing comment status indicator is preserved.
// - Frame PNG never rotates.
//
// =========================================================

// =========================================================
// AVATAR IMAGE NORMALIZER
// =========================================================
//
// Supports several existing user serializer shapes:
//
// user.image.url
// user.image
// user.avatar.url
// user.avatar
// user.image_url
//
// Relative media paths are resolved inside
// PublicFramedAvatar.
//
// =========================================================

const getAvatarImage = (user) => {
  const value =
    user?.image?.url ??
    user?.image ??
    user?.avatar?.url ??
    user?.avatar ??
    user?.image_url ??
    null;

  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    return null;
  }

  return value.trim();
};

// =========================================================
// INITIALS AVATAR GENERATOR
// =========================================================
//
// If a user has no uploaded profile photo,
// preserve the old initials-based appearance.
//
// A tiny SVG is provided as an image source,
// allowing the real equipped PNG frame to
// appear over it as well.
//
// SVG text is escaped before it is encoded.
//
// =========================================================

const createInitialsAvatar = (initial) => {
  const safeInitial = String(
    initial || "?"
  )
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

  const svg = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
    >
      <rect
        width="100"
        height="100"
        rx="18"
        fill="#fff1f2"
      />

      <text
        x="50"
        y="52"
        text-anchor="middle"
        dominant-baseline="middle"
        font-family="sans-serif"
        font-size="48"
        font-weight="800"
        fill="#e11d48"
      >
        ${safeInitial}
      </text>
    </svg>
  `;

  return (
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(svg)
  );
};

// =========================================================
// POST COMMENT AVATAR COMPONENT
// =========================================================

const PostCommentAvatar = memo(
  function PostCommentAvatar({
    user,
    displayName,
    deleted = false,
    root = false,
  }) {
    // ===================================================
    // USERNAME
    // ===================================================

    const username =
      typeof user?.username === "string"
        ? user.username.trim()
        : "";

    // ===================================================
    // AVATAR SIZE
    // ===================================================
    //
    // Original dimensions preserved:
    //
    // Root:
    //   Mobile  36px
    //   Desktop 40px
    //
    // Reply:
    //   Mobile  32px
    //   Desktop 36px
    //
    // ===================================================

    const avatarSize = root
      ? "h-9 w-9 sm:h-10 sm:w-10"
      : "h-8 w-8 sm:h-9 sm:w-9";

    // ===================================================
    // INITIAL
    // ===================================================

    const initial = String(
      username ||
      displayName ||
      "?"
    )
      .charAt(0)
      .toUpperCase();

    // ===================================================
    // INITIALS IMAGE
    // ===================================================

    const initialsUrl = useMemo(
      () => createInitialsAvatar(initial),
      [initial]
    );

    // ===================================================
    // DELETED COMMENT
    // ===================================================
    //
    // Deleted comment must not:
    //
    // - Fetch the user's frame
    // - Display the original avatar
    // - Display the username
    // - Link to the user's profile
    //
    // Existing placeholder preserved.
    //
    // ===================================================

    if (deleted) {
      return (
        <div
          className="
            relative
            shrink-0
          "
        >
          <span
            role="img"
            aria-label="O‘chirilgan sharh avatari"
            className={`
              ${avatarSize}

              grid
              place-items-center

              rounded-xl
              border

              border-slate-200
              bg-slate-100

              font-mono
              text-xs
              font-extrabold

              text-slate-400

              dark:border-white/10
              dark:bg-white/5
              dark:text-slate-500
            `}
          >
            —
          </span>
        </div>
      );
    }

    // ===================================================
    // PUBLIC FRAMED AVATAR
    // ===================================================
    //
    // Uses:
    //
    // GET /api/users/:username/equipped-frame/
    //
    // PublicFramedAvatar handles:
    //
    // - Shared request deduplication
    // - Cache
    // - PNG loading
    // - Avatar frame alignment
    // - FS Winter Royal correction
    // - Equipment refresh events
    // - Image failure handling
    //
    // ===================================================

    const avatar = (
      <PublicFramedAvatar
        username={username}
        displayName={displayName}
        avatarUrl={
          getAvatarImage(user) ||
          initialsUrl
        }
        className={avatarSize}
        plainClassName="rounded-xl"
        showFrame={Boolean(username)}
        loading="lazy"
      />
    );

    // ===================================================
    // RENDER
    // ===================================================

    return (
      <div
        className="
          relative
          shrink-0
        "
      >
        {/* ========================================
            AVATAR / PROFILE LINK
        ======================================== */}

        {username ? (
          <Link
            to={`/${encodeURIComponent(
              username
            )}/profile/`}
            aria-label={
              `${displayName} profiliga o'tish`
            }
            className="
              block
              rounded-xl

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-rose-400
            "
          >
            {avatar}
          </Link>
        ) : (
          avatar
        )}

        {/* ========================================
            COMMENT STATUS INDICATOR
        ======================================== */}
        {/*
          The original pink status dot stays
          above the frame PNG.

          z-20 prevents the decorative overlay
          from hiding it.
        */}

        <span
          aria-hidden="true"
          className="
            pointer-events-none

            absolute
            -bottom-0.5
            -right-0.5
            z-20

            h-2.5
            w-2.5

            rounded-full

            border-2
            border-white

            bg-rose-500

            dark:border-[#101319]
          "
        />
      </div>
    );
  }
);

// =========================================================
// EXPORT
// =========================================================

export default PostCommentAvatar;
