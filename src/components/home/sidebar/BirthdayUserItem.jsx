
import React, { memo } from "react";

import { Link } from "react-router-dom";

import {
  CakeSlice,
  CalendarDays,
  Coins,
  Code2,
  Sparkles,
} from "lucide-react";

import {
  getUserAvatarUrl,
} from "../../../utils/imageUtils";

import PublicFramedAvatar from "../../ui/PublicFramedAvatar";

// =========================================================
// FSOCIETY — BIRTHDAY SPOTLIGHT
// =========================================================
//
// Premium compact birthday card for Home Sidebar.
//
// Features:
//
// - Cyber / Winter visual design
// - Public equipped avatar frames
// - Compact birthday status
// - Full name and username
// - Skill level and FCoin
// - Birthday day
// - Profile navigation
// - Dark / Light mode
// - Responsive narrow sidebar layout
// - Accessible focus states
//
// IMPORTANT:
//
// Avatar frame positioning is controlled by
// PublicFramedAvatar, not this component.
//
// No backend, Redux or API changes.
//
// =========================================================

// =========================================================
// HELPERS
// =========================================================

const getFullName = (user) => {
  const fullName =
    user?.full_name ||
    `${user?.first_name || ""} ${user?.last_name || ""}`.trim();

  return (
    fullName ||
    user?.username ||
    "FSociety user"
  );
};

// =========================================================
// BIRTHDAY STATUS THEME
// =========================================================

const getBirthdayStyle = (daysLeft) => {
  const days = Number(daysLeft);

  if (
    daysLeft !== null &&
    daysLeft !== undefined &&
    days === 0
  ) {
    return {
      badge: `
        border-pink-400/30
        bg-pink-500/10
        text-pink-700

        dark:border-pink-400/30
        dark:bg-pink-400/10
        dark:text-pink-200
      `,

      glow: `
        bg-pink-400/15
        dark:bg-pink-400/10
      `,
    };
  }

  if (days === 1) {
    return {
      badge: `
        border-amber-400/30
        bg-amber-400/10
        text-amber-700

        dark:border-amber-400/30
        dark:bg-amber-400/10
        dark:text-amber-200
      `,

      glow: `
        bg-amber-400/10
        dark:bg-amber-400/10
      `,
    };
  }

  return {
    badge: `
      border-cyan-400/30
      bg-cyan-400/10
      text-cyan-700

      dark:border-cyan-400/25
      dark:bg-cyan-400/10
      dark:text-cyan-200
    `,

    glow: `
      bg-cyan-400/10
      dark:bg-cyan-400/10
    `,
  };
};

// =========================================================
// NUMBER FORMAT
// =========================================================

const formatCoins = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0";
  }

  return new Intl.NumberFormat("uz-UZ", {
    maximumFractionDigits: 0,
  }).format(number);
};

// =========================================================
// MAIN COMPONENT
// =========================================================

const BirthdayUserItem = ({ user }) => {
  if (!user) {
    return null;
  }

  // =====================================================
  // USER DATA
  // =====================================================

  const username =
    typeof user.username === "string"
      ? user.username.trim()
      : "";

  const fullName = getFullName(user);

  const avatarUrl = getUserAvatarUrl(user);

  const birthdayLabel =
    user.birthday_label || "Bu oy";

  const birthdayDay =
    user.birthday_day;

  const userLevel =
    user.skill_level || "Developer";

  const userCoins =
    user.coins ?? 0;

  const theme = getBirthdayStyle(
    user.days_left
  );

  const profileUrl = username
    ? `/${encodeURIComponent(username)}/profile`
    : "/users";

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Link
      to={profileUrl}
      aria-label={`${fullName} profilini ko‘rish`}
      className="
        group/birthday
        relative
        block
        min-w-0

        rounded-[18px]
        border border-slate-200/90

        bg-gradient-to-br
        from-white
        via-[#f7faff]
        to-[#eef8ff]

        p-3
        text-slate-900

        shadow-[0_5px_18px_rgba(15,23,42,0.04)]

        transition-[border-color,box-shadow,transform]
        duration-200

        hover:-translate-y-0.5
        hover:border-cyan-400/50
        hover:shadow-[0_12px_26px_rgba(14,165,233,0.11)]

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-cyan-500

        motion-reduce:transform-none
        motion-reduce:transition-none

        dark:border-white/[0.10]
        dark:bg-none
        dark:bg-[#111820]
        dark:text-white
        dark:shadow-none

        dark:hover:border-cyan-400/30
        dark:hover:shadow-[0_10px_26px_rgba(0,0,0,0.18)]
      "
    >
      {/* ==========================================
          AMBIENT BACKGROUND
      ========================================== */}

      <span
        aria-hidden="true"
        className={`
          pointer-events-none
          absolute -right-5 -top-5

          h-24 w-24
          rounded-full
          blur-3xl

          ${theme.glow}
        `}
      />

      {/* BOTTOM NEON LINE */}

      <span
        aria-hidden="true"
        className="
          pointer-events-none
          absolute bottom-0 left-3 right-3
          h-px

          bg-gradient-to-r
          from-transparent
          via-cyan-400/40
          to-transparent
        "
      />

      <div className="relative z-10 min-w-0">

        {/* ======================================
            BIRTHDAY TOP STRIP
        ====================================== */}

        <div
          className="
            mb-2.5
            flex min-w-0
            items-center justify-between
            gap-1.5
          "
        >
          {/* SECTION SIGNAL */}

          <span
            className="
              flex min-w-0
              items-center gap-1.5

              font-mono text-[9px]
              font-extrabold uppercase
              tracking-[0.10em]

              text-slate-500
              dark:text-slate-400
            "
          >
            <Sparkles
              size={12}
              aria-hidden="true"
              className="
                shrink-0
                text-pink-500
                dark:text-pink-300
              "
            />

            <span className="truncate">
              BIRTHDAY SIGNAL
            </span>
          </span>

          {/* BIRTHDAY STATUS */}

          <span
            title={birthdayLabel}
            className={`
              inline-flex
              max-w-[92px]
              shrink-0

              items-center gap-1

              rounded-full border
              px-2 py-1

              text-[10px]
              font-extrabold
              leading-none

              ${theme.badge}
            `}
          >
            <CakeSlice
              size={11}
              aria-hidden="true"
              className="shrink-0"
            />

            <span className="truncate">
              {birthdayLabel}
            </span>
          </span>
        </div>

        {/* ======================================
            USER IDENTITY
        ====================================== */}

        <div
          className="
            flex min-w-0
            items-center gap-2
          "
        >
          {/* ====================================
              FRAMED AVATAR
          ==================================== */}

          <span
            className="
              relative
              flex h-16 w-16
              shrink-0
              items-center justify-center
            "
          >
            {/* SOFT HALO */}

            <span
              aria-hidden="true"
              className="
                pointer-events-none
                absolute inset-2

                rounded-full
                bg-cyan-400/10
                blur-lg

                dark:bg-cyan-400/15
              "
            />

            {/* EQUIPPED FRAME */}

            <PublicFramedAvatar
              username={username}
              avatarUrl={avatarUrl}
              displayName={fullName}
              className="h-10 w-10"
              plainClassName="rounded-xl"
              showFrame={Boolean(username)}
              loading="lazy"
            />
          </span>

          {/* ====================================
              NAME / USERNAME / DATE
          ==================================== */}

          <div className="min-w-0 flex-1">

            {/* FULL NAME */}

            <h4
              title={fullName}
              className="
                truncate
                text-[13px]
                font-black
                leading-5
                tracking-[-0.02em]

                text-slate-900
                transition-colors

                group-hover/birthday:text-cyan-700

                dark:text-white
                dark:group-hover/birthday:text-cyan-300
              "
            >
              {fullName}
            </h4>

            {/* USERNAME */}

            <p
              title={`@${username || "user"}`}
              className="
                mt-0.5
                truncate

                font-mono
                text-[10px]
                font-medium

                text-slate-500
                dark:text-slate-400
              "
            >
              @{username || "user"}
            </p>

            {/* BIRTHDAY DATE */}

            {birthdayDay !== null &&
              birthdayDay !== undefined &&
              birthdayDay !== "" && (
                <span
                  className="
                    mt-1.5
                    inline-flex
                    max-w-full
                    items-center gap-1

                    text-[10px]
                    font-bold

                    text-pink-700
                    dark:text-pink-300
                  "
                >
                  <CalendarDays
                    size={11}
                    aria-hidden="true"
                    className="shrink-0"
                  />

                  <span className="truncate">
                    {birthdayDay}-kun
                  </span>
                </span>
              )}
          </div>
        </div>

        {/* ======================================
            COMPACT FOOTER
        ====================================== */}

        <div
          className="
            mt-2.5
            grid min-w-0
            grid-cols-2 gap-1.5

            border-t
            border-slate-200/75
            pt-2.5

            dark:border-white/[0.08]
          "
        >
          {/* SKILL LEVEL */}

          <div
            title={`Daraja: ${userLevel}`}
            className="
              flex min-w-0
              items-center gap-1.5

              rounded-lg
              border border-cyan-400/15
              bg-cyan-400/[0.07]

              px-2 py-1.5

              dark:border-cyan-400/10
              dark:bg-cyan-400/[0.06]
            "
          >
            <Code2
              size={13}
              aria-hidden="true"
              className="
                shrink-0
                text-cyan-600
                dark:text-cyan-300
              "
            />

            <span
              className="
                min-w-0 truncate
                text-[10px] font-extrabold

                text-cyan-800
                dark:text-cyan-200
              "
            >
              {userLevel}
            </span>
          </div>

          {/* FCOIN */}

          <div
            title={`${formatCoins(userCoins)} FCoin`}
            className="
              flex min-w-0
              items-center justify-center
              gap-1.5

              rounded-lg
              border border-amber-400/15
              bg-amber-400/[0.08]

              px-2 py-1.5

              dark:border-amber-400/10
              dark:bg-amber-400/[0.06]
            "
          >
            <Coins
              size={13}
              aria-hidden="true"
              className="
                shrink-0
                text-amber-600
                dark:text-amber-300
              "
            />

            <span
              className="
                min-w-0 truncate
                text-[10px] font-extrabold
                tabular-nums

                text-amber-800
                dark:text-amber-200
              "
            >
              {formatCoins(userCoins)} FCoin
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(BirthdayUserItem);
