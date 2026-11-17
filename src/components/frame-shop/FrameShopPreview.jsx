
 // src/components/frame-shop/FrameShopPreview.jsx

import React, {
  memo,
  useMemo,
  useState,
} from "react";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  UserRound,
} from "lucide-react";

import {
  getMediaUrl,
} from "../../utils/imageUtils";

// =========================================================
// FSOCIETY — FRAME SHOP PREVIEW
// =========================================================
//
// Location:
// src/components/frame-shop/FrameShopPreview.jsx
//
// Responsibilities:
//
// - Display transparent PNG / WebP frame
// - Display avatar or UserRound placeholder
// - Correctly align avatar with transparent opening
// - Premium FS Winter Royal 2027 calibration
// - Normal alignment for other frames
// - Preserve PNG artwork
// - Dark / Light mode
// - Responsive preview
// - Rarity glow
// - Reduced motion
// - Image error fallback
//
// IMPORTANT:
//
// The frame artwork NEVER rotates.
//
// Santa Hat, FS emblem, snow and gold ornaments
// remain in their original positions.
//
// The avatar is positioned BEHIND the PNG.
//
// =========================================================

// =========================================================
// FRAME RARITY THEMES
// =========================================================

const FRAME_THEMES = {
  common: {
    glow: "bg-slate-400/20",

    border:
      "border-slate-400/80",

    accent:
      "border-slate-400/30",
  },

  rare: {
    glow: "bg-cyan-400/25",

    border:
      "border-cyan-400/90",

    accent:
      "border-cyan-400/30",
  },

  epic: {
    glow: "bg-violet-500/25",

    border:
      "border-violet-400/90",

    accent:
      "border-violet-400/30",
  },

  legendary: {
    glow: "bg-amber-400/25",

    border:
      "border-amber-400/90",

    accent:
      "border-amber-400/30",
  },
};

// =========================================================
// EXACT AVATAR OPENING ALIGNMENTS
// =========================================================
//
// These coordinates are measured relative to
// the complete frame PNG.
//
// FS Winter Royal 2027:
//
// Image resolution: 1254 x 1254
//
// Transparent inner opening:
//
// Center X: 46.5%
// Center Y: 49.1%
// Opening diameter: about 57.2%
//
// We use an avatar diameter of 54% to leave
// a small safety margin inside the artwork.
//
// All other currently seeded frames use
// a centered circular opening.
//
// =========================================================

const FRAME_ALIGNMENTS = {
  "fs-winter-royal-2027": {
    x: 46.5,
    y: 49.1,
    size: 54,
  },
};

const DEFAULT_ALIGNMENT = {
  x: 50,
  y: 50,
  size: 57,
};

// =========================================================
// HELPERS
// =========================================================

const normalizeText = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

// =========================================================
// FRAME IMAGE URL
// =========================================================

const getFrameImageUrl = (frame) => {
  const source =
    frame?.image_url ??
    frame?.image ??
    frame?.frame_image ??
    null;

  const imagePath =
    typeof source === "string"
      ? source
      : typeof source?.url === "string"
        ? source.url
        : null;

  if (
    !imagePath ||
    !imagePath.trim()
  ) {
    return null;
  }

  return getMediaUrl(
    imagePath.trim(),
    null
  );
};

// =========================================================
// AVATAR IMAGE URL
// =========================================================

const getAvatarImageUrl = (value) => {
  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    return null;
  }

  return getMediaUrl(
    value.trim(),
    null
  );
};

// =========================================================
// FALLBACK FRAME
// =========================================================
//
// Used only if PNG does not exist or fails to load.
//
// Transparent center remains visible.
//
// =========================================================

const FallbackFrame = memo(
  function FallbackFrame({
    theme,
  }) {
    return (
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute inset-0 z-10
        "
      >
        {/* MAIN RING */}

        <div
          className={`
            absolute inset-[18%]
            rounded-full
            border-[7px]

            shadow-[0_0_20px_rgba(148,163,184,0.15)]

            ${theme.border}
          `}
        />

        {/* OUTER RING */}

        <div
          className={`
            absolute inset-[14%]
            rounded-full

            border border-dashed

            opacity-50

            ${theme.accent}
          `}
        />

        {/* UPPER ORNAMENT */}

        <div
          className={`
            absolute
            left-1/2 top-[13%]

            h-3 w-3
            -translate-x-1/2
            rotate-45

            border-2 border-white/80

            bg-current

            ${theme.border}
          `}
        />

        {/* LOWER ORNAMENT */}

        <div
          className={`
            absolute
            bottom-[13%] left-1/2

            h-3 w-3
            -translate-x-1/2
            rotate-45

            border-2 border-white/80

            bg-current

            ${theme.border}
          `}
        />
      </div>
    );
  }
);

// =========================================================
// FRAME SHOP PREVIEW
// =========================================================

const FrameShopPreview = memo(
  function FrameShopPreview({
    frame,
    avatarUrl = null,
    className = "",
  }) {
    const reducedMotion =
      useReducedMotion();

    // =====================================================
    // IMAGE FAILURE STATE
    // =====================================================

    const [
      failedFrameUrl,
      setFailedFrameUrl,
    ] = useState(null);

    const [
      failedAvatarUrl,
      setFailedAvatarUrl,
    ] = useState(null);

    // =====================================================
    // FRAME IDENTITY
    // =====================================================

    const code = normalizeText(
      frame?.code
    );

    const rarityKey = normalizeText(
      frame?.rarity || "common"
    );

    const theme =
      FRAME_THEMES[rarityKey] ||
      FRAME_THEMES.common;

    // =====================================================
    // AVATAR ALIGNMENT
    // =====================================================

    const alignment =
      FRAME_ALIGNMENTS[code] ||
      DEFAULT_ALIGNMENT;

    // =====================================================
    // RESOLVE FRAME IMAGE
    // =====================================================

    const frameImageUrl = useMemo(
      () => getFrameImageUrl(frame),
      [
        frame?.image,
        frame?.image_url,
        frame?.frame_image,
      ]
    );

    // =====================================================
    // RESOLVE AVATAR IMAGE
    // =====================================================

    const avatarImageUrl = useMemo(
      () => getAvatarImageUrl(avatarUrl),
      [avatarUrl]
    );

    // =====================================================
    // VALID IMAGE STATES
    // =====================================================

    const hasFrameImage = Boolean(
      frameImageUrl &&
      failedFrameUrl !== frameImageUrl
    );

    const hasAvatarImage = Boolean(
      avatarImageUrl &&
      failedAvatarUrl !== avatarImageUrl
    );

    // =====================================================
    // RENDER
    // =====================================================

    return (
      <div
        role="img"
        aria-label={`${
          frame?.name || "FSociety"
        } profil ramkasi`}
        className={`
          relative mx-auto

          flex h-[218px] w-[218px]
          shrink-0

          items-center justify-center

          sm:h-[230px]
          sm:w-[230px]

          ${className}
        `}
      >
        {/* ==========================================
            RARITY AMBIENT GLOW
        ========================================== */}

        <motion.div
          aria-hidden="true"
          initial={false}
          animate={
            reducedMotion
              ? { opacity: 0.4 }
              : {
                  opacity: [
                    0.3,
                    0.6,
                    0.3,
                  ],
                }
          }
          transition={
            reducedMotion
              ? { duration: 0 }
              : {
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
          className={`
            pointer-events-none

            absolute inset-[19%]

            rounded-full
            blur-[36px]

            ${theme.glow}
          `}
        />

        {/* ==========================================
            SUBTLE DECORATIVE ORBIT
        ========================================== */}
        {/*
          The orbit sits behind the image.

          Only this decorative orbit rotates.

          The actual frame PNG stays stationary.
        */}

        <motion.div
          aria-hidden="true"
          animate={
            reducedMotion
              ? undefined
              : {
                  rotate: 360,
                }
          }
          transition={{
            duration: 45,
            repeat: Infinity,
            ease: "linear",
          }}
          className={`
            pointer-events-none

            absolute inset-[3%]

            rounded-full
            border border-dashed

            opacity-20

            ${theme.accent}
          `}
        />

        {/* ==========================================
            AVATAR OPENING
        ========================================== */}
        {/*
          IMPORTANT:

          This is the ONLY element whose
          alignment changes for Winter Royal.

          Winter Royal:
            x = 46.5%
            y = 49.1%
            diameter = 54%

          Other frames:
            x = 50%
            y = 50%
            diameter = 57%

          No extra visible border is added.

          This avoids duplicate rings around
          premium artwork.
        */}

        <div
          aria-hidden="true"
          className="
            absolute z-[1]

            flex
            items-center justify-center

            overflow-hidden
            rounded-full

            bg-gradient-to-br

            from-slate-200
            via-slate-300
            to-slate-400

            dark:from-[#263957]
            dark:via-[#17243e]
            dark:to-[#0a1224]
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
          {/* ======================================
              REAL AVATAR
          ====================================== */}

          {hasAvatarImage ? (
            <img
              src={avatarImageUrl}
              alt=""
              draggable={false}
              loading="lazy"
              decoding="async"
              onError={() => {
                setFailedAvatarUrl(
                  avatarImageUrl
                );
              }}
              className="
                h-full w-full

                rounded-full
                object-cover
              "
            />
          ) : (
            /* ======================================
                USER ICON
            ====================================== */

            <UserRound
              aria-hidden="true"
              strokeWidth={1.5}
              className="
                h-[43%] w-[43%]

                text-slate-500

                dark:text-slate-400
              "
            />
          )}
        </div>

        {/* ==========================================
            REAL FRAME IMAGE
        ========================================== */}
        {/*
          The complete artwork is positioned
          normally at the center.

          It NEVER receives:
          - translate-x
          - translate-y
          - rotate

          Therefore:
          - Santa Hat remains on top
          - FS logo remains at the bottom
          - Icicles stay below
          - Gold ornaments stay aligned
        */}

        {hasFrameImage ? (
          <img
            src={frameImageUrl}
            alt=""
            draggable={false}
            loading="lazy"
            decoding="async"
            onError={() => {
              setFailedFrameUrl(
                frameImageUrl
              );
            }}
            className="
              pointer-events-none

              absolute inset-0
              z-10

              h-full w-full

              select-none
              object-contain

              drop-shadow-[0_6px_16px_rgba(0,0,0,0.18)]
            "
          />
        ) : (
          <FallbackFrame
            theme={theme}
          />
        )}

        {/* ==========================================
            LEGENDARY SPARKLE
        ========================================== */}

        {rarityKey === "legendary" && (
          <motion.span
            aria-hidden="true"
            initial={false}
            animate={
              reducedMotion
                ? {
                    opacity: 0.65,
                  }
                : {
                    opacity: [
                      0.2,
                      1,
                      0.2,
                    ],

                    scale: [
                      0.8,
                      1.25,
                      0.8,
                    ],
                  }
            }
            transition={
              reducedMotion
                ? {
                    duration: 0,
                  }
                : {
                    duration: 3.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
            className="
              pointer-events-none

              absolute
              right-[9%]
              top-[28%]

              z-20

              h-1.5 w-1.5

              rounded-full
              bg-amber-200

              shadow-[0_0_13px_rgba(251,191,36,0.85)]
            "
          />
        )}
      </div>
    );
  }
);

// =========================================================
// EXPORT
// =========================================================

export default FrameShopPreview;
