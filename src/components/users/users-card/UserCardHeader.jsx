
 // src/components/users/users-card/UserCardHeader.jsx

import React, { memo, useMemo } from "react";

import { Link } from "react-router-dom";

import {
  Code2,
  UserRound,
} from "lucide-react";

import PublicFramedAvatar from "../../ui/PublicFramedAvatar";

import {
  getUserAvatarUrl,
  getUserDisplayName,
  getUserProfileUrl,
  getUserSkillLevel,
  isUserOnline,
} from "./userCardHelpers";

// =========================================================
// FSOCIETY — USERS DIRECTORY / USER CARD HEADER
// CYBER COMMUNITY 2.0
// =========================================================
//
// Features:
//
// - Public equipped avatar frames
// - Real user profile photo
// - Shared public frame cache
// - FS Winter Royal 2027 alignment
// - Golden Root and other frames
// - Online indicator
// - Developer skill level
// - Member badge
// - Profile navigation
// - Dark / Light mode
// - Mobile responsive layout
// - Accessible profile links
//
// IMPORTANT:
//
// PublicFramedAvatar handles:
//
// - Frame API request
// - Request deduplication
// - Frame image loading
// - Image fallback
// - Frame alignment
// - Equipment refresh event
//
// No frame purchases or equipment mutations
// happen inside this component.
//
// =========================================================

// =========================================================
// AVATAR SOURCE
// =========================================================
//
// Support different existing user serializer fields.
//
// Do not return a default image here.
// PublicFramedAvatar already provides its own fallback.
//
// =========================================================

const getPhotoSource = (user) => {
  const source =
    user?.image?.url ??
    user?.image ??
    user?.avatar?.url ??
    user?.avatar ??
    user?.image_url ??
    user?.profile_image?.url ??
    user?.profile_image ??
    user?.profile_photo?.url ??
    user?.profile_photo ??
    user?.photo?.url ??
    user?.photo ??
    null;

  if (
    typeof source !== "string" ||
    !source.trim()
  ) {
    return null;
  }

  return getUserAvatarUrl(source);
};

// =========================================================
// FULL NAME
// =========================================================

const getFullName = (user) => {
  const direct =
    typeof user?.full_name === "string"
      ? user.full_name.trim()
      : "";

  if (direct) {
    return direct;
  }

  return [
    user?.first_name,
    user?.last_name,
  ]
    .filter(
      (part) =>
        typeof part === "string" &&
        part.trim()
    )
    .map((part) => part.trim())
    .join(" ");
};

// =========================================================
// USER CARD HEADER
// =========================================================

const UserCardHeader = ({ user }) => {
  // =====================================================
  // USER DATA
  // =====================================================

  const username = getUserDisplayName(user);
  const profileUrl = getUserProfileUrl(user);
  const skillLevel = getUserSkillLevel(user);

  const online = isUserOnline(user);

  const realUsername =
    typeof user?.username === "string"
      ? user.username.trim()
      : "";

  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  const avatarUrl = useMemo(
    () => getPhotoSource(user),
    [
      user?.image,
      user?.avatar,
      user?.image_url,
      user?.profile_image,
      user?.profile_photo,
      user?.photo,
    ]
  );

  // =====================================================
  // DISPLAY NAME
  // =====================================================

  const fullName = useMemo(
    () => getFullName(user),
    [
      user?.full_name,
      user?.first_name,
      user?.last_name,
    ]
  );

  // =====================================================
  // FRAMED AVATAR
  // =====================================================
  //
  // The PNG is larger than the avatar's layout box.
  // Outer padding gives the decorative artwork space.
  //
  // The frame itself is not rotated or repositioned here.
  //
  // PublicFramedAvatar owns the actual alignment values.
  //
  // =====================================================

  const avatar = (
    <span
      className="
        relative inline-flex
        shrink-0 items-center
        justify-center p-2.5
      "
    >
      {/* DECORATIVE AMBIENT GLOW */}

      <span
        aria-hidden="true"
        className="
          pointer-events-none
          absolute inset-1
          rounded-[22px]

          bg-indigo-400/10
          blur-xl

          dark:bg-cyan-400/10
        "
      />

      {/* REAL AVATAR + EQUIPPED FRAME */}

      <PublicFramedAvatar
        username={realUsername}
        avatarUrl={avatarUrl}
        displayName={fullName || username}
        className="
          h-14 w-14
          sm:h-16 sm:w-16
        "
        plainClassName="rounded-2xl"
        showFrame={Boolean(realUsername)}
        loading="lazy"
      />

      {/* ONLINE INDICATOR */}

      {online && (
        <span
          role="status"
          aria-label="Foydalanuvchi online"
          title="Online"
          className="
            absolute bottom-1.5 right-1.5
            z-20

            h-3.5 w-3.5
            rounded-full

            border-[3px] border-white
            bg-emerald-500

            shadow-[0_0_12px_rgba(16,185,129,0.35)]

            dark:border-[#0e1421]
          "
        />
      )}
    </span>
  );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      className="
        flex min-w-0
        items-center
        gap-2.5
        sm:gap-3
      "
    >
      {/* ========================================
          AVATAR / PROFILE NAVIGATION
      ======================================== */}

      {profileUrl ? (
        <Link
          to={profileUrl}
          title={`${username} profiliga o‘tish`}
          aria-label={`${username} profiliga o‘tish`}
          className="
            relative shrink-0
            rounded-2xl

            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-cyan-500
            focus-visible:ring-offset-2

            dark:focus-visible:ring-offset-[#0e1421]
          "
        >
          {avatar}
        </Link>
      ) : (
        avatar
      )}

      {/* ========================================
          USER IDENTITY
      ======================================== */}

      <div className="min-w-0 flex-1">
        {/* DEVELOPER LABEL */}

        <div
          className="
            mb-1 flex min-w-0
            items-center gap-1.5
          "
        >
          <Code2
            size={12}
            aria-hidden="true"
            className="
              shrink-0
              text-indigo-500
              dark:text-cyan-400
            "
          />

          <span
            className="
              truncate
              font-mono text-[9px]
              font-bold uppercase
              tracking-[0.12em]
              text-slate-400

              dark:text-slate-500
            "
          >
            FS / DEVELOPER
          </span>
        </div>

        {/* USERNAME */}

        {profileUrl ? (
          <Link
            to={profileUrl}
            title={`@${username}`}
            className="
              block min-w-0 truncate

              text-[15px]
              font-black
              tracking-tight
              text-slate-900

              transition-colors

              hover:text-indigo-600

              focus-visible:rounded-sm
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-cyan-500

              dark:text-white
              dark:hover:text-cyan-300

              sm:text-base
            "
          >
            @{username}
          </Link>
        ) : (
          <h3
            className="
              truncate text-[15px]
              font-black
              text-slate-900
              dark:text-white
              sm:text-base
            "
          >
            @{username}
          </h3>
        )}

        {/* FULL NAME */}

        {fullName &&
          fullName.toLowerCase() !==
            username.toLowerCase() && (
            <p
              title={fullName}
              className="
                mt-0.5 truncate
                text-[11px] font-medium
                text-slate-500
                dark:text-slate-400
              "
            >
              {fullName}
            </p>
          )}

        {/* ======================================
            SKILL LEVEL + MEMBER BADGE
        ====================================== */}

        <div
          className="
            mt-2 flex min-w-0
            flex-wrap items-center
            gap-1.5
          "
        >
          {/* SKILL LEVEL */}

          <span
            title={skillLevel}
            className="
              inline-flex max-w-full
              items-center rounded-lg

              border border-indigo-200/90
              bg-indigo-50
              px-2 py-1

              text-[10px]
              font-extrabold
              text-indigo-700

              dark:border-indigo-400/25
              dark:bg-indigo-400/[0.08]
              dark:text-indigo-300
            "
          >
            <span
              className="
                max-w-[115px]
                truncate uppercase
              "
            >
              {skillLevel}
            </span>
          </span>

          {/* MEMBER BADGE */}

          <span
            className="
              inline-flex items-center
              gap-1 rounded-lg

              border border-slate-200
              bg-slate-50
              px-2 py-1

              text-[10px]
              font-bold
              text-slate-500

              dark:border-white/10
              dark:bg-white/[0.04]
              dark:text-slate-400
            "
          >
            <UserRound
              size={11}
              aria-hidden="true"
            />

            Member
          </span>
        </div>
      </div>
    </div>
  );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(UserCardHeader);
