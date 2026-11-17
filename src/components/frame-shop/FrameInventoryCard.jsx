
 // src/components/frame-shop/FrameInventoryCard.jsx

import React, {
  memo,
  useMemo,
  useState,
} from "react";

import {
  useSelector,
} from "react-redux";

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
// CYBER VAULT 2.0
// =========================================================
//
// Features:
//
// - Compact responsive card
// - Premium rarity styles
// - Dark / Light mode
// - Real logged-in user avatar
// - Transparent frame PNG overlay
// - FS Winter Royal custom alignment
// - Acquisition source
// - Acquisition date
// - FCoin price paid
// - Limited and Animated labels
// - Equipped / Owned statuses
// - Equip / Unequip actions
// - Loading and disabled states
// - Reduced motion support
//
// IMPORTANT:
//
// PNG never rotates or moves.
//
// Avatar coordinates stay aligned with
// the frame's transparent opening.
//
// Equip / Unequip logic stays in MyFrames.jsx.
//
// =========================================================

// =========================================================
// RARITY DESIGN SYSTEM
// =========================================================

const RARITY = {
  common: {
    label: "COMMON",
    Icon: Shield,

    badge: `
      border-slate-300
      bg-slate-100
      text-slate-700

      dark:border-slate-400/25
      dark:bg-slate-400/10
      dark:text-slate-300
    `,

    rail:
      "from-slate-300 via-slate-500 to-slate-300",

    glow: "bg-slate-400/20",

    orbit: "border-slate-400/35",

    button: "from-slate-600 to-slate-800",

    labelColor:
      "text-slate-600 dark:text-slate-300",
  },

  rare: {
    label: "RARE",
    Icon: Gem,

    badge: `
      border-cyan-300
      bg-cyan-50
      text-cyan-700

      dark:border-cyan-400/25
      dark:bg-cyan-400/10
      dark:text-cyan-300
    `,

    rail:
      "from-cyan-300 via-sky-500 to-cyan-300",

    glow: "bg-cyan-400/20",

    orbit: "border-cyan-400/35",

    button: "from-cyan-500 to-blue-600",

    labelColor:
      "text-cyan-700 dark:text-cyan-300",
  },

  epic: {
    label: "EPIC",
    Icon: Zap,

    badge: `
      border-violet-300
      bg-violet-50
      text-violet-700

      dark:border-violet-400/25
      dark:bg-violet-400/10
      dark:text-violet-300
    `,

    rail:
      "from-violet-400 via-fuchsia-500 to-violet-400",

    glow: "bg-violet-500/20",

    orbit: "border-violet-400/35",

    button:
      "from-violet-600 to-fuchsia-600",

    labelColor:
      "text-violet-700 dark:text-violet-300",
  },

  legendary: {
    label: "LEGENDARY",
    Icon: Crown,

    badge: `
      border-amber-300
      bg-amber-50
      text-amber-800

      dark:border-amber-400/30
      dark:bg-amber-400/10
      dark:text-amber-300
    `,

    rail:
      "from-amber-300 via-orange-500 to-amber-300",

    glow: "bg-amber-400/20",

    orbit: "border-amber-400/35",

    button: "from-amber-500 to-orange-600",

    labelColor:
      "text-amber-700 dark:text-amber-300",
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
    label: "Admin sovg‘asi",
    Icon: Shield,
  },

  admin_grant: {
    label: "Admin sovg‘asi",
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
// AVATAR ALIGNMENT
// =========================================================
//
// Do not change these coordinates.
//
// DEFAULT:
// x = 50%
// y = 50%
// size = 52%
//
// FS WINTER ROYAL 2027:
// x = 46.5%
// y = 47.2%
// size = 54%
//
// Coordinates are relative to the FULL PNG.
//
// =========================================================

const DEFAULT_AVATAR_ALIGNMENT =
  Object.freeze({
    x: 50,
    y: 50,
    size: 52,
  });

const FRAME_AVATAR_ALIGNMENTS =
  Object.freeze({
    "fs-winter-royal-2027": {
      x: 46.5,
      y: 47.2,
      size: 54,
    },
  });

// =========================================================
// HELPERS
// =========================================================

const formatNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? new Intl.NumberFormat("uz-UZ", {
        maximumFractionDigits: 0,
      }).format(number)
    : "0";
};

// =========================================================
// DATE FORMAT
// =========================================================

const formatDate = (value) => {
  if (!value) return null;

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

  return `${day}.${month}.${date.getFullYear()}`;
};

// =========================================================
// FRAME IMAGE URL
// =========================================================

const getFrameImage = (frame) => {
  const source =
    frame?.image_url ??
    frame?.image ??
    frame?.frame_image;

  const path =
    typeof source === "string"
      ? source
      : source?.url;

  return typeof path === "string" &&
    path.trim()
    ? getMediaUrl(path.trim(), null)
    : null;
};

// =========================================================
// OWNERSHIP NORMALIZATION
// =========================================================
//
// Used by MyFrames.jsx.
//
// Preserve named exports.
//
// =========================================================

export const getOwnedFrame = (ownership) => {
  if (
    !ownership ||
    typeof ownership !== "object"
  ) {
    return {};
  }

  for (const candidate of [
    ownership.frame,
    ownership.frame_detail,
    ownership.frame_info,
  ]) {
    if (
      candidate &&
      typeof candidate === "object" &&
      !Array.isArray(candidate)
    ) {
      return candidate;
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
// Equip API expects frame.id.
//
// =========================================================

export const getOwnedFrameId = (ownership) => {
  if (
    !ownership ||
    typeof ownership !== "object"
  ) {
    return null;
  }

  const frameObject = [
    ownership.frame,
    ownership.frame_detail,
    ownership.frame_info,
  ].find(
    (candidate) =>
      candidate &&
      typeof candidate === "object" &&
      !Array.isArray(candidate)
  );

  const candidate =
    frameObject?.id ??
    frameObject?.pk ??
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

  return Number.isSafeInteger(id) &&
    id > 0
    ? id
    : null;
};

// =========================================================
// FRAME ART
// =========================================================
//
// Layer order:
//
// 1. Ambient glow
// 2. Decorative orbit
// 3. Real user avatar
// 4. Frame PNG
//
// The actual PNG never rotates.
//
// =========================================================

const FrameArt = memo(
  function FrameArt({
    frame,
    theme,
    avatarUrl,
  }) {
    const reducedMotion =
      useReducedMotion();

    // ===================================================
    // FRAME IMAGE
    // ===================================================

    const imageUrl = useMemo(
      () => getFrameImage(frame),
      [
        frame?.image_url,
        frame?.image,
        frame?.frame_image,
      ]
    );

    const [
      failedFrameUrl,
      setFailedFrameUrl,
    ] = useState(null);

    const hasFrameImage = Boolean(
      imageUrl &&
      imageUrl !== failedFrameUrl
    );

    const frameCode = String(
      frame?.code || ""
    )
      .trim()
      .toLowerCase();

    // ===================================================
    // PRESERVE PREMIUM ALIGNMENT
    // ===================================================

    const alignment =
      (
        hasFrameImage
          ? FRAME_AVATAR_ALIGNMENTS[frameCode]
          : null
      ) || DEFAULT_AVATAR_ALIGNMENT;

    // ===================================================
    // RENDER
    // ===================================================

    return (
      <div
        role="img"
        aria-label={`${
          frame?.name || "Profil"
        } ramkasi bilan avatar`}
        className="
          relative mx-auto
          h-[185px] w-[185px]
          shrink-0
          sm:h-[200px] sm:w-[200px]
        "
      >
        {/* ========================================
            AMBIENT GLOW
        ======================================== */}

        <span
          aria-hidden="true"
          className={`
            pointer-events-none
            absolute inset-[23%]
            rounded-full blur-[30px]
            ${theme.glow}
          `}
        />

        {/* ========================================
            DECORATIVE ORBIT
        ======================================== */}

        <motion.span
          aria-hidden="true"
          className={`
            pointer-events-none
            absolute inset-[2%]
            rounded-full
            border border-dashed
            ${theme.orbit}
          `}
          animate={
            reducedMotion
              ? undefined
              : { rotate: 360 }
          }
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* ========================================
            USER AVATAR
        ======================================== */}
        {/*
          Only the avatar follows custom alignment.

          The transparent PNG remains centered.

          FS Winter Royal:
          x: 46.5%
          y: 47.2%
          size: 54%
        */}

        <span
          aria-hidden="true"
          className="
            absolute z-[1]
            flex items-center justify-center
            overflow-hidden rounded-full
            bg-slate-200 dark:bg-[#13203a]
          "
          style={{
            left: `${alignment.x}%`,
            top: `${alignment.y}%`,

            width: `${alignment.size}%`,
            height: `${alignment.size}%`,

            transform:
              "translate(-50%, -50%)",
          }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              loading="lazy"
              decoding="async"
              draggable={false}
              onError={handleUserImageError}
              className="
                block h-full w-full
                object-cover
              "
            />
          ) : (
            <UserRound
              aria-hidden="true"
              strokeWidth={1.5}
              className="
                h-[42%] w-[42%]
                text-slate-500
                dark:text-slate-400
              "
            />
          )}
        </span>

        {/* ========================================
            FRAME PNG
        ======================================== */}

        {hasFrameImage ? (
          <img
            src={imageUrl}
            alt=""
            draggable={false}
            loading="lazy"
            decoding="async"
            onError={() =>
              setFailedFrameUrl(imageUrl)
            }
            className="
              pointer-events-none
              absolute inset-0 z-10
              h-full w-full
              select-none object-contain
              drop-shadow-[0_5px_15px_rgba(15,23,42,0.18)]
            "
          />
        ) : (
          <span
            aria-hidden="true"
            className={`
              pointer-events-none
              absolute inset-[15%] z-10
              rounded-full border-[7px]
              shadow-[0_0_22px_rgba(251,191,36,0.15)]

              ${theme.orbit}
            `}
          />
        )}
      </div>
    );
  }
);

// =========================================================
// COMPACT METADATA ITEM
// =========================================================

const MetaItem = memo(
  function MetaItem({
    label,
    value,
    Icon,
    valueClass = "",
  }) {
    return (
      <div
        className="
          flex min-w-0
          flex-col gap-1 px-1
        "
      >
        <span
          className="
            inline-flex min-w-0
            items-center gap-1
            font-mono text-[9px]
            font-semibold uppercase
            tracking-[0.04em]
            text-slate-500
            dark:text-slate-400
          "
        >
          <Icon
            size={11}
            className="shrink-0"
            aria-hidden="true"
          />

          <span className="truncate">
            {label}
          </span>
        </span>

        <span
          title={String(value)}
          className={`
            truncate
            text-[10px] font-bold
            tabular-nums
            text-slate-800
            dark:text-slate-200
            ${valueClass}
          `}
        >
          {value}
        </span>
      </div>
    );
  }
);

// =========================================================
// MAIN INVENTORY CARD
// =========================================================

function FrameInventoryCard({
  ownership,
  index = 0,

  isBusy = false,
  busyFrameId = null,

  onEquip,
  onUnequip,
}) {
  const reducedMotion =
    useReducedMotion();

  // =====================================================
  // CURRENT AUTH USER
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
  // EMPTY OWNERSHIP
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

  const frameName =
    frame?.name ||
    ownership?.frame_name ||
    "Profil ramkasi";

  // =====================================================
  // RARITY
  // =====================================================

  const rarityKey = String(
    frame?.rarity || "common"
  )
    .trim()
    .toLowerCase();

  const theme =
    RARITY[rarityKey] ||
    RARITY.common;

  const RarityIcon = theme.Icon;

  // =====================================================
  // ACQUISITION SOURCE
  // =====================================================

  const sourceKey = String(
    ownership?.source || ""
  ).toLowerCase();

  const source =
    SOURCE[sourceKey] ||
    DEFAULT_SOURCE;

  // =====================================================
  // FRAME STATUS
  // =====================================================

  const isEquipped = Boolean(
    ownership?.is_equipped ??
    frame?.is_equipped
  );

  const isActive =
    (
      frame?.is_active ??
      ownership?.is_active
    ) !== false;

  const isLimited = Boolean(
    frame?.is_limited_edition ??
    frame?.is_limited
  );

  const isAnimated = Boolean(
    frame?.is_animated
  );

  // =====================================================
  // BUSY STATE
  // =====================================================

  const isThisBusy = Boolean(
    isBusy &&
    frameId !== null &&
    busyFrameId !== null &&
    Number(frameId) === Number(busyFrameId)
  );

  // =====================================================
  // DATE / PRICE
  // =====================================================

  const acquiredDate = formatDate(
    ownership?.acquired_at
  );

  const rawPrice =
    ownership?.price_paid;

  const paid =
    rawPrice == null ||
    rawPrice === ""
      ? 0
      : Number(rawPrice);

  const pricePaid =
    Number.isFinite(paid) &&
    paid > 0
      ? paid
      : 0;

  // =====================================================
  // ACTION AVAILABILITY
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
              y: 12,
            }
      }
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={
        reducedMotion
          ? undefined
          : { y: -3 }
      }
      transition={{
        duration: 0.3,
        delay:
          Math.min(
            Math.max(index, 0),
            8
          ) * 0.035,
      }}
      aria-busy={isThisBusy}
      className={`
        group relative
        flex h-full min-w-0
        flex-col overflow-hidden
        rounded-[22px] border

        bg-white/95
        shadow-[0_12px_34px_rgba(15,23,42,0.08)]
        backdrop-blur-xl

        transition-[border-color,box-shadow]

        dark:bg-[#0d1526]/95
        dark:shadow-[0_20px_50px_rgba(0,0,0,0.27)]

        ${
          isEquipped
            ? `
              border-emerald-400/55
              dark:border-emerald-400/35
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
      {/* ========================================
          RARITY TOP ACCENT
      ======================================== */}

      <div
        aria-hidden="true"
        className={`
          h-[2px] shrink-0
          bg-gradient-to-r
          ${theme.rail}
        `}
      />

      {/* ========================================
          BACKGROUND GLOW
      ======================================== */}

      <div
        aria-hidden="true"
        className={`
          pointer-events-none
          absolute -right-16 top-2
          h-44 w-44
          rounded-full blur-[70px]
          ${theme.glow}
        `}
      />

      {/* ========================================
          CARD CONTENT
      ======================================== */}

      <div
        className="
          relative flex h-full min-w-0
          flex-col
          px-3.5 pb-3.5 pt-3
          sm:px-4 sm:pb-4
        "
      >
        {/* ======================================
            HEADER
        ====================================== */}

        <div
          className="
            flex min-h-6 items-start
            justify-between gap-2
          "
        >
          {/* RARITY */}

          <span
            className={`
              inline-flex items-center gap-1
              rounded-full border
              px-2 py-1
              font-mono text-[9px]
              font-extrabold tracking-[0.06em]
              ${theme.badge}
            `}
          >
            <RarityIcon
              size={11}
              aria-hidden="true"
            />

            {theme.label}
          </span>

          {/* STATUS + LIMITED */}

          <div
            className="
              flex flex-wrap
              justify-end gap-1
            "
          >
            {isLimited && (
              <span
                className="
                  rounded-full border
                  border-rose-300/40
                  bg-rose-500/10
                  px-1.5 py-1
                  font-mono text-[9px]
                  font-bold text-rose-600
                  dark:text-rose-300
                "
              >
                LIMITED
              </span>
            )}

            {isEquipped ? (
              <span
                className="
                  inline-flex items-center
                  gap-1 rounded-full
                  border border-emerald-400/30
                  bg-emerald-500/10
                  px-2 py-1
                  font-mono text-[9px]
                  font-bold text-emerald-700
                  dark:text-emerald-300
                "
              >
                <Check
                  size={10}
                  aria-hidden="true"
                />

                EQUIPPED
              </span>
            ) : (
              <span
                className="
                  rounded-full border
                  border-slate-200
                  bg-slate-100
                  px-2 py-1
                  font-mono text-[9px]
                  font-bold text-slate-500
                  dark:border-white/10
                  dark:bg-white/5
                  dark:text-slate-400
                "
              >
                OWNED
              </span>
            )}
          </div>
        </div>

        {/* ======================================
            FRAME PREVIEW
        ====================================== */}

        <div
          className="
            relative flex
            h-[196px] shrink-0
            items-center justify-center
            sm:h-[211px]
          "
        >
          <FrameArt
            frame={frame}
            theme={theme}
            avatarUrl={avatarUrl}
          />
        </div>

        {/* ======================================
            FRAME NAME / STATUS
        ====================================== */}

        <div className="min-w-0 text-center">
          <p
            className="
              font-mono text-[9px]
              font-semibold
              tracking-[0.17em]
              text-slate-400
              dark:text-slate-500
            "
          >
            FSOCIETY / INVENTORY
          </p>

          <h3
            title={frameName}
            className="
              mt-1 line-clamp-2
              min-h-[23px]
              break-words
              font-['Space_Grotesk']
              text-base font-extrabold
              leading-6 tracking-tight
              text-slate-900
              dark:text-white
            "
          >
            {frameName}
          </h3>

          <div
            className="
              mt-0.5 flex flex-wrap
              items-center justify-center
              gap-1.5
            "
          >
            <span
              className={`
                font-mono text-[9px]
                font-extrabold uppercase
                tracking-[0.10em]

                ${
                  isEquipped
                    ? `
                      text-emerald-700
                      dark:text-emerald-300
                    `
                    : theme.labelColor
                }
              `}
            >
              {isEquipped
                ? "ACTIVE PROFILE FRAME"
                : "READY TO EQUIP"}
            </span>

            {isAnimated && (
              <span
                className="
                  inline-flex items-center
                  gap-1 rounded-full
                  bg-violet-500/10
                  px-1.5 py-0.5
                  font-mono text-[8px]
                  font-bold text-violet-700
                  dark:text-violet-300
                "
              >
                <Sparkles
                  size={9}
                  aria-hidden="true"
                />

                ANIMATED
              </span>
            )}
          </div>
        </div>

        {/* ======================================
            COMPACT METADATA
        ====================================== */}

        <div
          className="
            mt-3 grid grid-cols-3 gap-1
            rounded-xl border
            border-slate-200/80
            bg-slate-50/90
            px-2 py-2.5
            dark:border-white/10
            dark:bg-white/[0.045]
          "
        >
          <MetaItem
            label="Manba"
            value={source.label}
            Icon={source.Icon}
          />

          <MetaItem
            label="Olingan"
            value={acquiredDate || "—"}
            Icon={CalendarDays}
          />

          <MetaItem
            label="FCoin"
            value={
              pricePaid > 0
                ? formatNumber(pricePaid)
                : "Bepul"
            }
            Icon={Coins}
            valueClass="
              !text-amber-700
              dark:!text-amber-300
            "
          />
        </div>

        {/* ======================================
            INACTIVE WARNING
        ====================================== */}

        {!isActive && !isEquipped && (
          <p
            className="
              mt-2 rounded-lg
              border border-rose-300/40
              bg-rose-500/10
              px-2 py-1.5
              text-center text-[10px]
              font-semibold text-rose-700
              dark:text-rose-300
            "
          >
            Bu ramka hozir faol emas.
          </p>
        )}

        {/* ======================================
            EQUIP / UNEQUIP
        ====================================== */}

        <div className="mt-auto pt-3">
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
            aria-label={
              isEquipped
                ? `${frameName} ramkasini yechish`
                : `${frameName} ramkasini o‘rnatish`
            }
            className={`
              inline-flex min-h-10 w-full
              items-center justify-center
              gap-2 rounded-xl border
              px-3 py-2.5
              text-xs font-extrabold

              transition-[filter,background-color,border-color]

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-cyan-500
              focus-visible:ring-offset-2

              disabled:cursor-not-allowed
              disabled:opacity-50

              dark:focus-visible:ring-offset-[#0d1526]

              ${
                isEquipped
                  ? `
                    border-emerald-400/25
                    bg-emerald-500/10
                    text-emerald-700
                    hover:bg-emerald-500/15
                    dark:text-emerald-300
                  `
                  : `
                    border-transparent
                    bg-gradient-to-r
                    ${theme.button}

                    text-white
                    shadow-[0_6px_18px_rgba(15,23,42,0.12)]
                    hover:brightness-110
                  `
              }
            `}
          >
            {isThisBusy ? (
              <>
                <Loader2
                  size={15}
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
                  size={15}
                  aria-hidden="true"
                />

                Ramkani yechish
              </>
            ) : (
              <>
                <WandSparkles
                  size={15}
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
}

// =========================================================
// EXPORT
// =========================================================

export default memo(FrameInventoryCard);
