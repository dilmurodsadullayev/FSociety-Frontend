
import React, {
  memo,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  CalendarDays,
  Flame,
} from "lucide-react";

import {
  getUserAvatarUrl,
} from "../../../utils/imageUtils";

import formatProblemCreatedAt from "../../../utils/formatProblemCreatedAt";

import {
  getProblemDisplayName,
  getProblemInitials,
  getProblemStatusMeta,
  parseProblemDate,
} from "./myProblemCardHelpers";

// =========================================================
// FSOCIETY — MY PROBLEM CARD HEADER
// =========================================================
//
// Always show created_at:
//   23 oktabr 2026
//
// Urgent deadline countdown is displayed
// separately in MyProblemCardDeadline.
//
// =========================================================

// =========================================================
// STATUS STYLES
// =========================================================

const STATUS_STYLES = {
  solved: [
    "border-emerald-200",
    "bg-emerald-50",
    "text-emerald-700",
    "dark:border-emerald-400/25",
    "dark:bg-emerald-400/10",
    "dark:text-emerald-300",
  ].join(" "),

  pending: [
    "border-blue-200",
    "bg-blue-50",
    "text-blue-700",
    "dark:border-blue-400/25",
    "dark:bg-blue-400/10",
    "dark:text-blue-300",
  ].join(" "),

  open: [
    "border-slate-200",
    "bg-slate-100",
    "text-slate-700",
    "dark:border-slate-400/20",
    "dark:bg-slate-400/10",
    "dark:text-slate-200",
  ].join(" "),

  rejected: [
    "border-rose-200",
    "bg-rose-50",
    "text-rose-700",
    "dark:border-rose-400/25",
    "dark:bg-rose-400/10",
    "dark:text-rose-300",
  ].join(" "),
};

const STATUS_LABELS = {
  solved: "Hal qilingan",
  pending: "Jarayonda",
  open: "Yangi",
  rejected: "Rad etilgan",
};

// =========================================================
// BOOLEAN HELPER
// =========================================================

const toBoolean = (value) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  if (typeof value === "string") {
    return ["true", "1", "yes"].includes(
      value.trim().toLowerCase()
    );
  }

  return false;
};

// =========================================================
// AUTHOR AVATAR
// =========================================================

const AuthorAvatar = memo(function AuthorAvatar({
  user,
  image,
  displayName,
}) {
  const [imageFailed, setImageFailed] =
    useState(false);

  const avatarUrl = useMemo(() => {
    if (!image) {
      return null;
    }

    return getUserAvatarUrl({
      ...(user &&
      typeof user === "object" &&
      !Array.isArray(user)
        ? user
        : {}),
      image,
    });
  }, [user, image]);

  useEffect(() => {
    setImageFailed(false);
  }, [avatarUrl]);

  const initials =
    getProblemInitials(displayName);

  return (
    <span
      className="
        relative flex h-10 w-10 shrink-0
        items-center justify-center
        overflow-hidden rounded-full

        border border-blue-200
        bg-gradient-to-br
        from-blue-100 to-indigo-100

        text-[12px] font-extrabold
        text-blue-700

        ring-2 ring-white

        dark:border-blue-400/25
        dark:from-blue-500/20
        dark:to-indigo-500/20
        dark:text-blue-200
        dark:ring-[#091528]
      "
    >
      {avatarUrl && !imageFailed ? (
        <img
          src={avatarUrl}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setImageFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="select-none font-mono"
        >
          {initials}
        </span>
      )}
    </span>
  );
});

// =========================================================
// MAIN COMPONENT
// =========================================================

function MyProblemCardHeader({
  username = "",
  firstName = "",
  lastName = "",
  image = null,
  user = null,

  createdAt = null,

  statusLabel = "",
  statusKey = null,

  status = false,
  isSolved = false,
  isUrgent = false,

  profileUrl = null,
  className = "",
}) {
  // =====================================================
  // USER
  // =====================================================

  const resolvedUsername =
    user?.username ?? username;

  const resolvedFirstName =
    user?.first_name ?? firstName;

  const resolvedLastName =
    user?.last_name ?? lastName;

  const resolvedImage =
    user?.image ?? image;

  const displayName = getProblemDisplayName({
    firstName: resolvedFirstName,
    lastName: resolvedLastName,
    username: resolvedUsername,
  });

  // =====================================================
  // CREATED AT
  // =====================================================

  const createdDate = useMemo(
    () => parseProblemDate(createdAt),
    [createdAt]
  );

  const createdDateLabel = useMemo(
    () => formatProblemCreatedAt(createdAt),
    [createdAt]
  );

  // =====================================================
  // STATUS
  // =====================================================

  const calculatedStatus =
    getProblemStatusMeta({
      status,
      isSolved,
    });

  const resolvedStatusKey =
    statusKey &&
    Object.prototype.hasOwnProperty.call(
      STATUS_STYLES,
      statusKey
    )
      ? statusKey
      : calculatedStatus.key;

  const visibleStatusLabel =
    STATUS_LABELS[resolvedStatusKey] ||
    statusLabel ||
    calculatedStatus.label;

  const statusClass =
    STATUS_STYLES[resolvedStatusKey] ||
    STATUS_STYLES.open;

  const urgent = toBoolean(isUrgent);

  // =====================================================
  // AUTHOR CONTENT
  // =====================================================

  const authorContent = (
    <>
      <AuthorAvatar
        user={user}
        image={resolvedImage}
        displayName={displayName}
      />

      <span
        className="
          flex min-w-0 flex-col
          justify-center gap-0.5
        "
      >
        <span
          title={displayName}
          className="
            block min-w-0 truncate

            text-[13px] font-extrabold
            leading-[18px]
            text-slate-900

            dark:text-slate-100
          "
        >
          {displayName}
        </span>

        {createdDate && createdDateLabel && (
          <time
            dateTime={createdDate.toISOString()}
            title={`Yaratilgan: ${createdDateLabel}`}
            className="
              inline-flex min-w-0 max-w-full
              items-center gap-1

              font-mono text-[10px]
              leading-4

              text-slate-500
              dark:text-slate-400
            "
          >
            <CalendarDays
              size={11}
              className="
                shrink-0 text-slate-400
                dark:text-slate-500
              "
              aria-hidden="true"
            />

            <span className="truncate">
              {createdDateLabel}
            </span>
          </time>
        )}
      </span>
    </>
  );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <header
      className={`
        relative flex min-h-[64px]
        min-w-0 items-start
        justify-between gap-2.5

        px-4 py-3.5

        ${className}
      `}
    >
      {/* AUTHOR */}

      <div className="min-w-0 flex-1">
        {profileUrl ? (
          <Link
            to={profileUrl}
            aria-label={`${displayName} profiliga o‘tish`}
            className="
              inline-flex max-w-full min-w-0
              items-center gap-2.5
              rounded-lg

              transition-opacity
              hover:opacity-80

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-indigo-400
            "
          >
            {authorContent}
          </Link>
        ) : (
          <div
            className="
              flex min-w-0
              items-center gap-2.5
            "
          >
            {authorContent}
          </div>
        )}
      </div>

      {/* STATUS + URGENT */}

      <div
        className="
          flex shrink-0 flex-col
          items-end gap-1
        "
      >
        <span
          title={
            statusLabel ||
            calculatedStatus.description
          }
          aria-label={`Muammo holati: ${visibleStatusLabel}`}
          className={`
            inline-flex min-h-[25px]
            max-w-[125px]
            items-center justify-center

            rounded-full border
            px-2.5 py-1

            text-[10px] font-bold
            leading-4

            ${statusClass}
          `}
        >
          <span className="truncate">
            {visibleStatusLabel}
          </span>
        </span>

        {urgent && (
          <span
            title="Shoshilinch muammo"
            className="
              inline-flex items-center
              gap-1 rounded-full

              border border-orange-200
              bg-orange-50

              px-2 py-0.5
              text-[9px] font-bold
              text-orange-700

              dark:border-orange-400/25
              dark:bg-orange-400/10
              dark:text-orange-300
            "
          >
            <Flame
              size={10}
              className="shrink-0"
              aria-hidden="true"
            />

            Tezkor
          </span>
        )}
      </div>
    </header>
  );
}

export default memo(MyProblemCardHeader);
