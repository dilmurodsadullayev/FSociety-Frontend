
import React, { memo } from "react";

import { Link } from "react-router-dom";

import {
  Bot,
  CheckCircle2,
  Gem,
  Loader2,
  Pencil,
  ShoppingBag,
} from "lucide-react";

// =========================================================
// FSOCIETY — PROFILE HERO ACTIONS
// =========================================================
//
// Location:
// src/components/profile/hero/ProfileHeroActions.jsx
//
// Features:
// - Telegram bot connection
// - Telegram linked state
// - Profile editing
// - My Frames navigation
// - Frame Shop navigation
// - Profile owner permission
// - Desktop single-row layout
// - Mobile responsive 2x2 layout
// - Dark / Light mode
// - Accessible buttons
//
// IMPORTANT:
//
// Cover image edit button has been removed from
// this action group.
//
// Cover editing remains available through
// the separate button on the profile cover.
//
// Original callback contracts are preserved.
//
// =========================================================

// =========================================================
// SHARED BUTTON BASE
// =========================================================

const BUTTON_BASE = [
  "inline-flex",
  "min-h-10",
  "min-w-0",
  "shrink-0",
  "items-center",
  "justify-center",
  "gap-1.5",
  "whitespace-nowrap",
  "rounded-xl",
  "border",
  "px-2.5",
  "py-2",
  "text-[11px]",
  "font-bold",
  "shadow-sm",
  "transition-[background-color,border-color,color,box-shadow]",
  "duration-200",
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-indigo-500/60",
  "focus-visible:ring-offset-2",
  "disabled:cursor-not-allowed",
  "disabled:opacity-50",
  "motion-reduce:transition-none",
].join(" ");

// =========================================================
// BUTTON COLORS
// =========================================================

const BUTTON_TONES = {
  neutral: `
    border-slate-200
    bg-white/90
    text-slate-700

    hover:border-slate-300
    hover:bg-slate-100

    dark:border-white/15
    dark:bg-white/[0.07]
    dark:text-slate-100

    dark:hover:border-white/20
    dark:hover:bg-white/[0.12]
  `,

  linked: `
    border-emerald-300
    bg-emerald-50
    text-emerald-800

    hover:border-emerald-400
    hover:bg-emerald-100

    dark:border-emerald-400/25
    dark:bg-emerald-500/10
    dark:text-emerald-300

    dark:hover:bg-emerald-500/15
  `,

  pink: `
    border-pink-500/30
    bg-pink-600
    text-white

    hover:border-pink-500
    hover:bg-pink-500

    dark:border-pink-500/40
    dark:bg-pink-600

    dark:hover:bg-pink-500
  `,

  vault: `
    border-violet-300
    bg-violet-50
    text-violet-800

    hover:border-violet-400
    hover:bg-violet-100

    dark:border-violet-400/30
    dark:bg-violet-500/10
    dark:text-violet-200

    dark:hover:border-violet-400/50
    dark:hover:bg-violet-500/20
  `,

  shop: `
    border-cyan-500/30
    bg-cyan-600
    text-white

    hover:border-cyan-400
    hover:bg-cyan-500

    dark:border-cyan-400/35
    dark:bg-cyan-500/20
    dark:text-cyan-100

    dark:hover:border-cyan-400/50
    dark:hover:bg-cyan-500/30
  `,
};

// =========================================================
// BUTTON COMPONENT
// =========================================================

const ActionButton = memo(function ActionButton({
  children,
  onClick,
  disabled = false,
  tone = "neutral",
  label,
  className = "",
}) {
  const isDisabled =
    disabled ||
    typeof onClick !== "function";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      aria-label={label}
      className={`
        ${BUTTON_BASE}
        ${BUTTON_TONES[tone] || BUTTON_TONES.neutral}
        ${className}
      `}
    >
      {children}
    </button>
  );
});

// =========================================================
// NAVIGATION LINK COMPONENT
// =========================================================
//
// Uses React Router to avoid page reloads.
//
// =========================================================

const ActionLink = memo(function ActionLink({
  children,
  to,
  tone = "neutral",
  label,
  className = "",
}) {
  return (
    <Link
      to={to}
      aria-label={label}
      className={`
        ${BUTTON_BASE}
        ${BUTTON_TONES[tone] || BUTTON_TONES.neutral}
        ${className}
      `}
    >
      {children}
    </Link>
  );
});

// =========================================================
// MAIN PROFILE HERO ACTIONS
// =========================================================

const ProfileHeroActions = ({
  isOwner = false,

  botLoading = false,
  isTelegramLinked = false,

  onConnectTelegram,
  onEditCover,
  onEditProfile,

  variant = "desktop",
}) => {
  // =====================================================
  // PERMISSIONS
  // =====================================================
  //
  // Only profile owner can access these controls.
  //
  // =====================================================

  if (!isOwner) {
    return null;
  }

  // =====================================================
  // MOBILE / DESKTOP
  // =====================================================

  const isMobile = variant === "mobile";

  // =====================================================
  // TELEGRAM DATA
  // =====================================================

  const telegramTone = isTelegramLinked
    ? "linked"
    : "neutral";

  const BotIcon = botLoading
    ? Loader2
    : isTelegramLinked
      ? CheckCircle2
      : Bot;

  const telegramLabel = botLoading
    ? "Telegram tekshirilmoqda"
    : isTelegramLinked
      ? "Telegram bot ulangan"
      : "Telegram botni ulash";

  // =====================================================
  // SHARED RESPONSIVE STYLE
  // =====================================================

  const actionClass = isMobile
    ? `
      w-full
      min-w-0
      !shrink
      px-2
      sm:px-3
    `
    : `
      shrink-0
    `;

  const labelClass = isMobile
    ? "min-w-0 truncate"
    : "whitespace-nowrap";

  const iconSize = isMobile ? 16 : 15;

  // =====================================================
  // RESPONSIVE CONTAINER
  // =====================================================
  //
  // MOBILE:
  //
  // [ Telegram    ] [ Frame Shop  ]
  // [ Tahrirlash  ] [ Ramkalarim  ]
  //
  // DESKTOP:
  //
  // Telegram | Frame Shop | Tahrirlash | Ramkalarim
  //
  // All four actions remain on one desktop row.
  //
  // =====================================================

  const containerClass = isMobile
    ? `
      mt-4
      grid
      w-full
      min-w-0
      grid-cols-2
      gap-2

      md:grid-cols-4

      xl:hidden
    `
    : `
      hidden
      min-w-0
      shrink-0

      xl:mt-4
      xl:flex
      xl:flex-nowrap
      xl:items-center
      xl:justify-end
      xl:gap-2
    `;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      role="group"
      aria-label="Profilni boshqarish"
      className={containerClass}
    >
      {/* ==========================================
          1. TELEGRAM BOT
      ========================================== */}

      <ActionButton
        tone={telegramTone}
        onClick={onConnectTelegram}
        disabled={botLoading}
        label={telegramLabel}
        className={actionClass}
      >
        <BotIcon
          size={iconSize}
          strokeWidth={2}
          aria-hidden="true"
          className={`
            shrink-0

            ${
              botLoading
                ? "animate-spin motion-reduce:animate-none"
                : ""
            }
          `}
        />

        <span className={labelClass}>
          {botLoading
            ? "Kutilmoqda"
            : isTelegramLinked
              ? "Bot ulangan"
              : "Botni ulash"}
        </span>
      </ActionButton>

      {/* ==========================================
          2. FRAME SHOP
      ========================================== */}
      {/*
        REPLACES THE OLD "FON RASMI" BUTTON.

        The Frame Shop is now on the same
        row as all the other actions.

        Original route:
        /frames/shop

        No reload.
      */}

      <ActionLink
        to="/frames/shop"
        tone="shop"
        label="Frame Shop — yangi ramkalarni ko‘rish"
        className={actionClass}
      >
        <ShoppingBag
          size={iconSize}
          strokeWidth={2}
          className="shrink-0"
          aria-hidden="true"
        />

        <span className={labelClass}>
          Frame Shop
        </span>
      </ActionLink>

      {/* ==========================================
          3. EDIT PROFILE
      ========================================== */}
      {/*
        Existing profile edit callback preserved.

        This button opens the same profile
        editing modal as before.
      */}

      <ActionButton
        tone="pink"
        onClick={onEditProfile}
        label="Profilni tahrirlash"
        className={actionClass}
      >
        <Pencil
          size={iconSize}
          strokeWidth={2}
          className="shrink-0"
          aria-hidden="true"
        />

        <span className={labelClass}>
          Tahrirlash
        </span>
      </ActionButton>

      {/* ==========================================
          4. MY FRAMES
      ========================================== */}
      {/*
        Private profile frame inventory.

        Original route:
        /frames/my

        User can:
        - View owned frames
        - Equip a frame
        - Unequip a frame
      */}

      <ActionLink
        to="/frames/my"
        tone="vault"
        label="Mening profil ramkalarim"
        className={actionClass}
      >
        <Gem
          size={iconSize}
          strokeWidth={2}
          className="shrink-0"
          aria-hidden="true"
        />

        <span className={labelClass}>
          Ramkalarim
        </span>
      </ActionLink>
    </div>
  );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfileHeroActions);
