
// src/components/frame-shop/FrameInventoryCard.jsx

import React, {
  memo,
  useMemo,
  useState,
} from "react";

import { useSelector } from "react-redux";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  Award,
  CalendarDays,
  Check,
  Coins,
  Crown,
  Gem,
  Gift,
  Loader2,
  Shield,
  Sparkles,
  UserRound,
  WandSparkles,
  Zap,
} from "lucide-react";

import {
  getMediaUrl,
  getUserAvatarUrl,
  handleUserImageError,
} from "../../utils/imageUtils";

// =========================================================
// FSOCIETY — FRAME INVENTORY CARD
// =========================================================
//
// Location:
// src/components/frame-shop/FrameInventoryCard.jsx
//
// Features:
//
// - Premium cyberpunk inventory card
// - Dark / Light mode
// - Responsive
// - Real logged-in user's avatar
// - PNG / WebP frame overlay
// - Correct premium PNG alignment
// - CSS fallback frame
// - Rarity-specific design
// - Equipped / Owned states
// - Acquisition source
// - Purchase price
// - Formatted acquisition date
// - Limited / Animated labels
// - Equip / Unequip
// - Loading states
// - Reduced motion support
//
// FIX:
//
// FS Winter Royal 2027 has an off-center
// transparent avatar opening.
//
// Its avatar must be aligned with that opening.
//
// Other frames preserve their normal alignment.
//
// IMPORTANT:
//
// - The frame image never rotates.
// - Santa Hat stays at the top.
// - FS emblem stays at the bottom.
// - Only ambient glow / decorative orbit animate.
// - Equip / Unequip logic stays in MyFrames.jsx.
//
// =========================================================

// =========================================================
// RARITY THEMES
// =========================================================

const RARITY = {
  common: {
    label: "COMMON",
    Icon: Shield,

    gradient:
      "from-slate-400 via-slate-200 to-slate-500",

    text:
      "text-slate-600 dark:text-slate-300",

    badge:
      "border-slate-300 bg-slate-100 text-slate-700 " +
      "dark:border-slate-400/25 dark:bg-slate-400/10 " +
      "dark:text-slate-300",

    glow: "bg-slate-400/20",

    button:
      "from-slate-600 to-slate-800",

    accent:
      "border-slate-400/40",
  },

  rare: {
    label: "RARE",
    Icon: Gem,

    gradient:
      "from-cyan-300 via-sky-500 to-blue-600",

    text:
      "text-cyan-700 dark:text-cyan-300",

    badge:
      "border-cyan-300 bg-cyan-50 text-cyan-800 " +
      "dark:border-cyan-400/30 dark:bg-cyan-400/10 " +
      "dark:text-cyan-300",

    glow: "bg-cyan-400/25",

    button:
      "from-cyan-500 to-blue-600",

    accent:
      "border-cyan-400/40",
  },

  epic: {
    label: "EPIC",
    Icon: Zap,

    gradient:
      "from-indigo-400 via-violet-500 to-fuchsia-500",

    text:
      "text-violet-700 dark:text-violet-300",

    badge:
      "border-violet-300 bg-violet-50 text-violet-800 " +
      "dark:border-violet-400/30 dark:bg-violet-400/10 " +
      "dark:text-violet-300",

    glow: "bg-violet-400/25",

    button:
      "from-violet-600 to-fuchsia-600",

    accent:
      "border-violet-400/40",
  },

  legendary: {
    label: "LEGENDARY",
    Icon: Crown,

    gradient:
      "from-yellow-300 via-amber-500 to-orange-500",

    text:
      "text-amber-700 dark:text-amber-300",

    badge:
      "border-amber-300 bg-amber-50 text-amber-800 " +
      "dark:border-amber-400/30 dark:bg-amber-400/10 " +
      "dark:text-amber-300",

    glow: "bg-amber-400/25",

    button:
      "from-amber-500 to-orange-600",

    accent:
      "border-amber-400/50",
  },
};

// =========================================================
// ACQUISITION SOURCES
// =========================================================

const SOURCE = {
  shop: {
    label: "Xarid qilingan",
    Icon: Coins,
  },

  purchase: {
    label: "Xarid qilingan",
    Icon: Coins,
  },

  shop_purchase: {
    label: "Xarid qilingan",
    Icon: Coins,
  },

  admin: {
    label: "Admin mukofoti",
    Icon: Shield,
  },

  admin_grant: {
    label: "Admin mukofoti",
    Icon: Shield,
  },

  event: {
    label: "Tadbir mukofoti",
    Icon: Sparkles,
  },

  event_reward: {
    label: "Tadbir mukofoti",
    Icon: Sparkles,
  },

  gift: {
    label: "Sovg‘a",
    Icon: Gift,
  },

  achievement: {
    label: "Yutuq mukofoti",
    Icon: Award,
  },
};

const DEFAULT_SOURCE = {
  label: "Mukofot",
  Icon: Gift,
};

// =========================================================
// FRAME AVATAR ALIGNMENTS — NEW
// =========================================================
//
// Coordinates are percentages of the whole PNG.
//
// Default:
// - Center X: 50%
// - Center Y: 50%
// - Diameter: 52%
//
// FS Winter Royal:
// - Center X: 46.5%
// - Center Y: 47.2%
// - Diameter: 54%
//
// The premium PNG's transparent opening is not
// geometrically centered in its image canvas.
//
// This fixes the visible dark gap between the
// user's avatar and the golden frame.
//
// IMPORTANT:
//
// Apply custom alignment ONLY when the real
// frame PNG is available.
//
// If the image fails, the CSS fallback remains
// centered normally.
//
// =========================================================

const DEFAULT_AVATAR_ALIGNMENT = {
  x: 50,
  y: 50,
  size: 52,
};

const FRAME_AVATAR_ALIGNMENTS = {
  "fs-winter-royal-2027": {
    x: 46.5,
    y: 47.2,
    size: 54,
  },
};

// =========================================================
// NUMBER FORMAT
// =========================================================

const formatNumber = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0";
  }

  return new Intl.NumberFormat("uz-UZ", {
    maximumFractionDigits: 0,
  }).format(number);
};

// =========================================================
// OWNERSHIP NORMALIZATION
// =========================================================

export const getOwnedFrame = (ownership) => {
  if (
    !ownership ||
    typeof ownership !== "object"
  ) {
    return {};
  }

  for (const value of [
    ownership.frame,
    ownership.frame_detail,
    ownership.frame_info,
  ]) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      return value;
    }
  }

  return ownership;
};

// =========================================================
// FRAME ID
// =========================================================
//
// ownership.id is not necessarily frame.id.
//
// Equip API must receive the frame's ID.
//
// =========================================================

export const getOwnedFrameId = (ownership) => {
  if (
    !ownership ||
    typeof ownership !== "object"
  ) {
    return null;
  }

  const nested = [
    ownership.frame,
    ownership.frame_detail,
    ownership.frame_info,
  ].find(
    (value) =>
      value &&
      typeof value === "object" &&
      !Array.isArray(value)
  );

  const candidate =
    nested?.id ??
    nested?.pk ??
    ownership.frame_id ??
    (
      typeof ownership.frame === "number" ||
      typeof ownership.frame === "string"
        ? ownership.frame
        : null
    ) ??
    (
      !("source" in ownership) &&
      !("acquired_at" in ownership)
        ? ownership.id
        : null
    );

  const id = Number(candidate);

  return (
    Number.isSafeInteger(id) &&
    id > 0
  )
    ? id
    : null;
};

// =========================================================
// DATE FORMAT
// =========================================================

const formatDate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

// =========================================================
// FRAME IMAGE URL
// =========================================================

const getFrameImage = (frame) => {
  const value =
    frame?.image_url ??
    frame?.image ??
    frame?.frame_image;

  const path =
    typeof value === "string"
      ? value
      : typeof value?.url === "string"
        ? value.url
        : null;

  if (
    !path ||
    !path.trim()
  ) {
    return null;
  }

  return getMediaUrl(
    path.trim(),
    null
  );
};

// =========================================================
// FRAME ART
// =========================================================
//
// Layer order:
//
// 1. Ambient glow
// 2. Decorative orbit
// 3. Real avatar / placeholder
// 4. Frame PNG
//
// IMPORTANT:
//
// Avatar alignment is calculated per frame.
//
// The PNG itself is never moved or rotated.
//
// =========================================================

const FrameArt = memo(function FrameArt({
  frame,
  rarity,
  avatarUrl,
}) {
  const reducedMotion = useReducedMotion();

  // =====================================================
  // FRAME IMAGE
  // =====================================================

  const imageUrl = useMemo(
    () => getFrameImage(frame),
    [
      frame?.image_url,
      frame?.image,
      frame?.frame_image,
    ]
  );

  // =====================================================
  // IMAGE ERROR STATE
  // =====================================================

  const [
    failedFrameUrl,
    setFailedFrameUrl,
  ] = useState(null);

  const hasFrameImage = Boolean(
    imageUrl &&
    imageUrl !== failedFrameUrl
  );

  // =====================================================
  // FRAME CODE
  // =====================================================

  const frameCode = String(
    frame?.code || ""
  )
    .trim()
    .toLowerCase();

  // =====================================================
  // AVATAR ALIGNMENT — FIX
  // =====================================================
  //
  // FS Winter Royal:
  //   x: 46.5%
  //   y: 47.2%
  //   size: 54%
  //
  // Others:
  //   x: 50%
  //   y: 50%
  //   size: 52%
  //
  // When PNG cannot be displayed, use the
  // default center for the CSS fallback.
  //
  // =====================================================

  const avatarAlignment = (
    hasFrameImage
      ? FRAME_AVATAR_ALIGNMENTS[frameCode]
      : null
  ) || DEFAULT_AVATAR_ALIGNMENT;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      role="img"
      aria-label={`${
        frame?.name || "Profil"
      } ramkasining avatar ko‘rinishi`}
      className="
        relative mx-auto
        flex h-[236px] w-[236px]
        shrink-0 items-center justify-center
        sm:h-[250px] sm:w-[250px]
      "
    >
      {/* ==========================================
          AMBIENT GLOW
      ========================================== */}

      <motion.span
        aria-hidden="true"
        className={`
          pointer-events-none
          absolute inset-[18%]
          rounded-full blur-[40px]
          ${rarity.glow}
        `}
        animate={
          reducedMotion
            ? undefined
            : {
                opacity: [
                  0.35,
                  0.65,
                  0.35,
                ],
              }
        }
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* ==========================================
          DECORATIVE ORBIT
      ========================================== */}
      {/*
        Only the orbit rotates.

        Santa Hat and frame image remain
        completely stationary.
      */}

      <motion.div
        aria-hidden="true"
        className={`
          absolute inset-1
          rounded-full
          border border-dashed
          opacity-35
          ${rarity.accent}
        `}
        animate={
          reducedMotion
            ? undefined
            : {
                rotate: 360,
              }
        }
        transition={{
          duration: 38,
          ease: "linear",
          repeat: Infinity,
        }}
      />

      {/* ==========================================
          REAL USER AVATAR — CORRECTED
      ========================================== */}
      {/*
        OLD:

        className="absolute inset-[24%]"

        This forced every avatar into exactly
        the same geometrical position.

        NEW:

        left / top / width / height are based
        on the transparent opening of the PNG.

        The avatar remains behind the artwork.
      */}

      <div
        aria-hidden="true"
        className="
          absolute z-[1]
          overflow-hidden rounded-full

          border border-white/20

          bg-gradient-to-br
          from-slate-200 to-slate-400

          shadow-[inset_0_0_18px_rgba(15,23,42,0.18)]

          dark:border-white/10
          dark:from-slate-700
          dark:to-slate-950
        "
        style={{
          left: `${avatarAlignment.x}%`,
          top: `${avatarAlignment.y}%`,

          width: `${avatarAlignment.size}%`,
          height: `${avatarAlignment.size}%`,

          transform: "translate(-50%, -50%)",
        }}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            draggable={false}
            loading="lazy"
            decoding="async"
            onError={handleUserImageError}
            className="
              h-full w-full
              object-cover
            "
          />
        ) : (
          <div
            className="
              flex h-full w-full
              items-center justify-center
            "
          >
            <UserRound
              className="
                h-14 w-14
                text-slate-500
                dark:text-slate-400
              "
              strokeWidth={1.4}
              aria-hidden="true"
            />
          </div>
        )}
      </div>

      {/* ==========================================
          ACTUAL FRAME PNG
      ========================================== */}
      {/*
        Premium frames contain their own:

        - Gold ornaments
        - Santa Hat
        - FS logo
        - Ice crystals
        - Snow decorations

        Do not move, rotate or crop this PNG.

        The frame must always render ABOVE
        the avatar image.
      */}

      {hasFrameImage ? (
        <img
          src={imageUrl}
          alt=""
          draggable={false}
          loading="lazy"
          decoding="async"
          onError={() => {
            setFailedFrameUrl(imageUrl);
          }}
          className="
            pointer-events-none
            absolute inset-0 z-10

            h-full w-full
            select-none
            object-contain

            drop-shadow-[0_6px_18px_rgba(15,23,42,0.16)]
          "
        />
      ) : (
        /* ==========================================
            CSS FRAME FALLBACK
        ========================================== */

        <div
          aria-hidden="true"
          className={`
            pointer-events-none
            absolute inset-[15%] z-10

            rounded-full
            bg-gradient-to-br

            p-[5px]

            shadow-[0_0_25px_rgba(139,92,246,0.2)]

            ${rarity.gradient}
          `}
        >
          <div
            className="
              h-full w-full rounded-full

              border-[6px] border-white/75

              dark:border-slate-950/80
            "
          />

          <span
            className="
              absolute -top-1 left-1/2

              h-3 w-3
              -translate-x-1/2 rotate-45

              border border-white/80
              bg-white/90
            "
          />

          <span
            className="
              absolute -bottom-1 left-1/2

              h-3 w-3
              -translate-x-1/2 rotate-45

              border border-white/80
              bg-white/90
            "
          />
        </div>
      )}
    </div>
  );
});

// =========================================================
// INVENTORY CARD
// =========================================================

const FrameInventoryCard = memo(function FrameInventoryCard({
  ownership,
  index = 0,
  isBusy = false,
  busyFrameId = null,
  onEquip,
  onUnequip,
}) {
  const reducedMotion = useReducedMotion();

  // =====================================================
  // AUTH USER — REAL AVATAR
  // =====================================================

  const currentUser = useSelector(
    (state) =>
      state.auth?.user ?? null
  );

  const avatarUrl = useMemo(
    () =>
      currentUser
        ? getUserAvatarUrl(currentUser)
        : null,
    [currentUser]
  );

  // =====================================================
  // SAFE EMPTY ITEM
  // =====================================================

  if (!ownership) {
    return null;
  }

  // =====================================================
  // FRAME DATA
  // =====================================================

  const frame = getOwnedFrame(
    ownership
  );

  const frameId = getOwnedFrameId(
    ownership
  );

  // =====================================================
  // RARITY
  // =====================================================

  const rarityKey = String(
    frame?.rarity || "common"
  ).toLowerCase();

  const rarity =
    RARITY[rarityKey] ||
    RARITY.common;

  const RarityIcon = rarity.Icon;

  // =====================================================
  // SOURCE
  // =====================================================

  const sourceKey = String(
    ownership?.source || ""
  ).toLowerCase();

  const source =
    SOURCE[sourceKey] ||
    DEFAULT_SOURCE;

  const SourceIcon = source.Icon;

  // =====================================================
  // FRAME STATUS
  // =====================================================

  const isEquipped = Boolean(
    ownership?.is_equipped ??
    frame?.is_equipped
  );

  const isActive = Boolean(
    frame?.is_active ??
    ownership?.is_active ??
    true
  );

  const isLimited = Boolean(
    frame?.is_limited_edition
  );

  const isAnimated = Boolean(
    frame?.is_animated
  );

  // =====================================================
  // MUTATION STATUS
  // =====================================================

  const isThisBusy = Boolean(
    isBusy &&
    frameId !== null &&
    busyFrameId !== null &&
    Number(frameId) === Number(busyFrameId)
  );

  // =====================================================
  // DATE AND PRICE
  // =====================================================

  const acquiredDate = formatDate(
    ownership?.acquired_at
  );

  const paid = Number(
    ownership?.price_paid
  );

  const pricePaid =
    Number.isFinite(paid) &&
    paid > 0
      ? paid
      : 0;

  const frameName =
    frame?.name ||
    ownership?.frame_name ||
    "Profil ramkasi";

  // =====================================================
  // BUTTON AVAILABILITY
  // =====================================================

  const actionDisabled = Boolean(
    isBusy ||
    !frameId ||
    (!isEquipped && !isActive)
  );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <motion.article
      initial={
        reducedMotion
          ? false
          : {
              opacity: 0,
              y: 16,
            }
      }
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={
        reducedMotion
          ? undefined
          : {
              y: -4,
            }
      }
      transition={{
        duration: 0.35,
        delay:
          Math.min(index, 8) * 0.04,
      }}
      aria-busy={isThisBusy}
      className={`
        group relative
        flex h-full min-w-0
        flex-col overflow-hidden

        rounded-[26px]
        border

        bg-white/95
        shadow-[0_18px_52px_rgba(15,23,42,0.09)]

        backdrop-blur-xl

        transition-[border-color,box-shadow]
        duration-300

        dark:bg-[#0d1424]/95
        dark:shadow-[0_24px_60px_rgba(0,0,0,0.32)]

        ${
          isEquipped
            ? `
              border-emerald-400/55
              dark:border-emerald-400/40
            `
            : `
              border-slate-200/90
              hover:border-cyan-300/70

              dark:border-white/10
              dark:hover:border-cyan-400/30
            `
        }
      `}
    >
      {/* ==========================================
          RARITY TOP ACCENT
      ========================================== */}

      <div
        className={`
          h-[3px] w-full
          bg-gradient-to-r
          ${rarity.gradient}
        `}
      />

      {/* ==========================================
          RARITY BACKGROUND GLOW
      ========================================== */}

      <div
        aria-hidden="true"
        className={`
          pointer-events-none
          absolute -right-16 top-0

          h-56 w-56
          rounded-full blur-[75px]
          opacity-60

          ${rarity.glow}
        `}
      />

      {/* ==========================================
          CARD CONTENT
      ========================================== */}

      <div
        className="
          relative flex h-full
          flex-col p-4 sm:p-5
        "
      >
        {/* ========================================
            HEADER
        ======================================== */}

        <div
          className="
            flex min-h-8
            items-start justify-between
            gap-2
          "
        >
          {/* RARITY BADGE */}

          <span
            className={`
              inline-flex items-center
              gap-1.5 rounded-full border

              px-2.5 py-1.5

              text-[10px]
              font-extrabold
              tracking-[0.1em]

              ${rarity.badge}
            `}
          >
            <RarityIcon
              size={13}
              aria-hidden="true"
            />

            {rarity.label}
          </span>

          {/* EQUIPPED / OWNED */}

          {isEquipped ? (
            <span
              className="
                inline-flex items-center
                gap-1.5 rounded-full

                border border-emerald-400/30
                bg-emerald-500/10

                px-2.5 py-1.5

                text-[10px]
                font-extrabold uppercase
                tracking-wide

                text-emerald-700
                dark:text-emerald-300
              "
            >
              <Check
                size={13}
                aria-hidden="true"
              />

              Equipped
            </span>
          ) : (
            <span
              className="
                rounded-full
                border border-slate-200

                bg-slate-100
                px-2.5 py-1.5

                font-mono text-[10px]
                font-semibold

                text-slate-500

                dark:border-white/10
                dark:bg-white/5
                dark:text-slate-400
              "
            >
              OWNED
            </span>
          )}
        </div>

        {/* ========================================
            FRAME PREVIEW
        ======================================== */}
        {/*
          All avatar positioning is controlled
          inside FrameArt.

          No changes are needed in MyFrames.jsx.
        */}

        <div
          className="
            relative flex
            min-h-[260px]

            items-center justify-center
            py-2

            sm:min-h-[275px]
          "
        >
          <FrameArt
            frame={frame}
            rarity={rarity}
            avatarUrl={avatarUrl}
          />
        </div>

        {/* ========================================
            FRAME IDENTITY
        ======================================== */}

        <div className="min-w-0 text-center">
          <p
            className="
              font-mono text-[10px]
              font-semibold uppercase
              tracking-[0.18em]

              text-slate-500
              dark:text-slate-400
            "
          >
            FSOCIETY / INVENTORY
          </p>

          <h3
            title={frameName}
            className="
              mt-1.5 break-words

              font-sans
              text-lg font-extrabold
              leading-snug tracking-tight

              text-slate-900
              dark:text-white

              sm:text-xl
            "
          >
            {frameName}
          </h3>

          <p
            className={`
              mt-1.5 text-[11px]
              font-extrabold uppercase
              tracking-[0.12em]

              ${rarity.text}
            `}
          >
            {isEquipped
              ? "ACTIVE PROFILE FRAME"
              : "READY TO EQUIP"}
          </p>
        </div>

        {/* ========================================
            LIMITED / ANIMATED
        ======================================== */}

        {(isLimited || isAnimated) && (
          <div
            className="
              mt-3 flex flex-wrap
              justify-center gap-2
            "
          >
            {isLimited && (
              <span
                className="
                  rounded-lg

                  border border-rose-400/25
                  bg-rose-400/10

                  px-2.5 py-1
                  text-[11px] font-bold

                  text-rose-600
                  dark:text-rose-300
                "
              >
                LIMITED
              </span>
            )}

            {isAnimated && (
              <span
                className="
                  inline-flex items-center
                  gap-1 rounded-lg

                  border border-violet-400/25
                  bg-violet-400/10

                  px-2.5 py-1
                  text-[11px] font-bold

                  text-violet-600
                  dark:text-violet-300
                "
              >
                <Sparkles
                  size={12}
                  aria-hidden="true"
                />

                ANIMATED
              </span>
            )}
          </div>
        )}

        {/* ========================================
            FRAME METADATA
        ======================================== */}

        <div
          className="
            mt-4 space-y-2.5
            rounded-2xl

            border border-slate-200/80
            bg-slate-50/90

            px-3.5 py-3

            dark:border-white/10
            dark:bg-white/[0.045]
          "
        >
          {/* SOURCE */}

          <div
            className="
              flex items-center
              justify-between gap-2
            "
          >
            <span
              className="
                inline-flex items-center
                gap-2 text-xs font-medium

                text-slate-500
                dark:text-slate-400
              "
            >
              <SourceIcon
                size={14}
                className="shrink-0"
                aria-hidden="true"
              />

              Manba
            </span>

            <span
              className="
                text-right text-xs
                font-semibold

                text-slate-800
                dark:text-slate-200
              "
            >
              {source.label}
            </span>
          </div>

          {/* ACQUIRED DATE */}

          {acquiredDate && (
            <div
              className="
                flex items-center
                justify-between gap-2
              "
            >
              <span
                className="
                  inline-flex items-center
                  gap-2 text-xs font-medium

                  text-slate-500
                  dark:text-slate-400
                "
              >
                <CalendarDays
                  size={14}
                  className="shrink-0"
                  aria-hidden="true"
                />

                Olingan
              </span>

              <time
                dateTime={String(
                  ownership.acquired_at
                )}
                className="
                  text-xs font-semibold
                  tabular-nums

                  text-slate-700
                  dark:text-slate-300
                "
              >
                {acquiredDate}
              </time>
            </div>
          )}

          {/* FCOIN */}

          <div
            className="
              flex items-center
              justify-between gap-2
            "
          >
            <span
              className="
                inline-flex items-center
                gap-2 text-xs font-medium

                text-slate-500
                dark:text-slate-400
              "
            >
              <Coins
                size={14}
                className="shrink-0"
                aria-hidden="true"
              />

              Sarflangan
            </span>

            <span
              className="
                text-xs font-bold
                tabular-nums

                text-amber-700
                dark:text-amber-300
              "
            >
              {pricePaid > 0
                ? `${formatNumber(pricePaid)} FCoin`
                : "Bepul"}
            </span>
          </div>
        </div>

        {/* ========================================
            INACTIVE FRAME WARNING
        ======================================== */}

        {!isActive && (
          <p
            className="
              mt-3 rounded-lg

              border border-rose-300/50
              bg-rose-50

              p-2.5 text-center text-xs

              text-rose-700

              dark:border-rose-400/20
              dark:bg-rose-500/10
              dark:text-rose-300
            "
          >
            Bu ramka vaqtincha faol emas.
          </p>
        )}

        {/* ========================================
            EQUIP / UNEQUIP BUTTON
        ======================================== */}

        <div className="mt-auto pt-4">
          <button
            type="button"
            disabled={actionDisabled}
            onClick={() => {
              if (isEquipped) {
                onUnequip?.(ownership);
              } else {
                onEquip?.(ownership);
              }
            }}
            className={`
              inline-flex min-h-11 w-full
              items-center justify-center
              gap-2 rounded-xl

              px-4 py-3
              text-sm font-extrabold

              transition-all duration-200

              focus-visible:outline
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-cyan-500

              disabled:cursor-not-allowed
              disabled:opacity-50

              ${
                isEquipped
                  ? `
                    border border-emerald-400/30
                    bg-emerald-500/10

                    text-emerald-700
                    hover:bg-emerald-500/15

                    dark:text-emerald-300
                  `
                  : `
                    bg-gradient-to-r
                    ${rarity.button}

                    text-white
                    shadow-lg

                    hover:brightness-110
                  `
              }
            `}
          >
            {isThisBusy ? (
              <>
                <Loader2
                  size={17}
                  className="
                    animate-spin
                    motion-reduce:animate-none
                  "
                  aria-hidden="true"
                />

                Saqlanmoqda...
              </>
            ) : isEquipped ? (
              <>
                <Check
                  size={17}
                  aria-hidden="true"
                />

                Ramkani yechish
              </>
            ) : (
              <>
                <WandSparkles
                  size={17}
                  aria-hidden="true"
                />

                Avatarimga o‘rnatish
              </>
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
});

// =========================================================
// EXPORT
// =========================================================

export default FrameInventoryCard;
