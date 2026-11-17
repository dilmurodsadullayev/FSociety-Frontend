
 // src/components/navbar/NavbarFramedAvatar.jsx

import React, {
  memo,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  API_URL,
} from "../../services/config";

import {
  getMediaUrl,
  handleUserImageError,
} from "../../utils/imageUtils";

// =========================================================
// FSOCIETY — NAVBAR FRAMED AVATAR
// =========================================================
//
// One reusable avatar for:
//
// - Navbar user button
// - Navbar user dropdown
//
// The public equipped-frame endpoint is read-only.
//
// No FCoin, inventory, or mutation API is used here.
//
// If the endpoint fails or returns no equipped frame,
// render the original simple circular avatar.
//
// The PNG never rotates: Santa hats stay upright.
//
// =========================================================

// =========================================================
// FRAME ALIGNMENTS
// =========================================================
//
// Premium FS Winter Royal uses an off-center
// transparent opening.
//
// Use the same coordinates as My Frames.
//
// =========================================================

const ALIGNMENTS = {
  "fs-winter-royal-2027": {
    imageScale: 1.65,
    avatarScale: 0.88,
    x: 46.5,
    y: 47.2,
  },
};

const DEFAULT_ALIGNMENT = {
  imageScale: 1.52,
  avatarScale: 0.82,
  x: 50,
  y: 50,
};

// =========================================================
// RARITY SHADOWS
// =========================================================

const GLOW = {
  common:
    "drop-shadow-[0_0_3px_rgba(148,163,184,0.35)]",

  rare:
    "drop-shadow-[0_0_5px_rgba(34,211,238,0.50)]",

  epic:
    "drop-shadow-[0_0_6px_rgba(167,139,250,0.55)]",

  legendary:
    "drop-shadow-[0_0_7px_rgba(251,191,36,0.58)]",
};

// =========================================================
// HELPERS
// =========================================================

const normalizeUsername = (value) =>
  typeof value === "string"
    ? value.trim()
    : "";

const resolveFrameImage = (frame) => {
  const raw =
    frame?.image_url ??
    frame?.image ??
    frame?.frame_image;

  const path =
    typeof raw === "string"
      ? raw
      : typeof raw?.url === "string"
        ? raw.url
        : null;

  return path?.trim()
    ? getMediaUrl(path.trim(), null)
    : null;
};

// =========================================================
// COMPONENT
// =========================================================

function NavbarFramedAvatar({
  username,
  avatarUrl,
  size = "navbar",
  className = "",
}) {
  const safeUsername =
    normalizeUsername(username);

  // =====================================================
  // PUBLIC FRAME DATA
  // =====================================================
  //
  // Store username with its frame.
  //
  // When switching accounts, another user's
  // frame will not flash on the screen.
  //
  // =====================================================

  const [
    frameState,
    setFrameState,
  ] = useState({
    username: "",
    frame: null,
  });

  // =====================================================
  // REFRESH CONTROL
  // =====================================================

  const [
    refreshKey,
    setRefreshKey,
  ] = useState(0);

  // =====================================================
  // IMAGE STATES
  // =====================================================

  const [
    loadedImageUrl,
    setLoadedImageUrl,
  ] = useState(null);

  const [
    failedImageUrl,
    setFailedImageUrl,
  ] = useState(null);

  // =====================================================
  // FETCH PUBLIC EQUIPPED FRAME
  // =====================================================
  //
  // GET /api/users/:username/equipped-frame/
  //
  // Credential-free request:
  //
  // The endpoint is public.
  //
  // We deliberately do not use the authenticated
  // Axios client here, to avoid triggering JWT
  // refresh/logout on a decorative API failure.
  //
  // =====================================================

  useEffect(() => {
    if (!safeUsername) {
      return undefined;
    }

    const controller =
      new AbortController();

    let mounted = true;

    const loadFrame = async () => {
      try {
        const base = String(
          API_URL || "/api"
        ).replace(/\/+$/, "");

        const endpoint =
          `${base}/users/` +
          `${encodeURIComponent(safeUsername)}/` +
          "equipped-frame/";

        const response = await fetch(
          endpoint,
          {
            method: "GET",
            credentials: "omit",
            cache: "no-store",

            headers: {
              Accept: "application/json",
            },

            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            "Public avatar frame unavailable"
          );
        }

        const data =
          await response.json();

        const candidate =
          data?.equipped_frame;

        if (mounted) {
          setFrameState({
            username: safeUsername,

            frame:
              candidate &&
              typeof candidate === "object" &&
              !Array.isArray(candidate)
                ? candidate
                : null,
          });
        }
      } catch (error) {
        if (
          mounted &&
          !controller.signal.aborted
        ) {
          // Decorative API failure must not
          // break Navbar or its user menu.

          setFrameState({
            username: safeUsername,
            frame: null,
          });
        }
      }
    };

    loadFrame();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [
    safeUsername,
    refreshKey,
  ]);

  // =====================================================
  // REFRESH AFTER EQUIP / UNEQUIP
  // =====================================================

  useEffect(() => {
    const refresh = () => {
      setRefreshKey(
        (value) => value + 1
      );
    };

    window.addEventListener(
      "fsociety:frame-updated",
      refresh
    );

    window.addEventListener(
      "focus",
      refresh
    );

    return () => {
      window.removeEventListener(
        "fsociety:frame-updated",
        refresh
      );

      window.removeEventListener(
        "focus",
        refresh
      );
    };
  }, []);

  // =====================================================
  // CURRENT USER'S FRAME
  // =====================================================

  const frame =
    frameState.username === safeUsername
      ? frameState.frame
      : null;

  // =====================================================
  // FRAME IMAGE
  // =====================================================

  const frameUrl = useMemo(
    () => resolveFrameImage(frame),
    [frame]
  );

  // =====================================================
  // FRAME IMAGE READY
  // =====================================================
  //
  // Wait until PNG loads successfully before
  // shrinking/repositioning the avatar.
  //
  // =====================================================

  const isFrameReady = Boolean(
    frameUrl &&
    loadedImageUrl === frameUrl &&
    failedImageUrl !== frameUrl
  );

  // =====================================================
  // ALIGNMENT
  // =====================================================

  const alignment =
    ALIGNMENTS[
      String(frame?.code ?? "").toLowerCase()
    ] || DEFAULT_ALIGNMENT;

  const avatarSize = isFrameReady
    ? alignment.avatarScale * 100
    : 100;

  const avatarLeft = isFrameReady
    ? 50 +
      (alignment.x - 50) *
        alignment.imageScale
    : 50;

  const avatarTop = isFrameReady
    ? 50 +
      (alignment.y - 50) *
        alignment.imageScale
    : 50;

  // =====================================================
  // RARITY
  // =====================================================

  const rarity = String(
    frame?.rarity || "common"
  ).toLowerCase();

  const glowClass =
    GLOW[rarity] || GLOW.common;

  // =====================================================
  // SIZE
  // =====================================================

  const sizeClass =
    size === "menu"
      ? "h-11 w-11"
      : "h-9 w-9 sm:h-10 sm:w-10";

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <span
      role="img"
      aria-label={
        isFrameReady
          ? `${safeUsername} avatari — ${
              frame?.name || "profil ramkasi"
            }`
          : `${
              safeUsername || "Foydalanuvchi"
            } avatari`
      }
      className={`
        relative inline-flex
        shrink-0
        items-center justify-center
        overflow-visible

        ${sizeClass}
        ${className}
      `}
    >
      {/* ==========================================
          REAL USER AVATAR
      ========================================== */}

      <span
        aria-hidden="true"
        className="
          absolute
          overflow-hidden
          rounded-full

          border border-[#d5deec]
          bg-[#e8edf6]

          ring-1 ring-inset
          ring-slate-900/[0.04]

          dark:border-white/10
          dark:bg-[#161b22]
          dark:ring-white/[0.04]
        "
        style={{
          left: `${avatarLeft}%`,
          top: `${avatarTop}%`,

          width: `${avatarSize}%`,
          height: `${avatarSize}%`,

          transform:
            "translate(-50%, -50%)",
        }}
      >
        <img
          src={avatarUrl}
          alt=""
          loading="eager"
          decoding="async"
          draggable={false}
          onError={handleUserImageError}
          className="
            block h-full w-full
            object-cover
          "
        />
      </span>

      {/* ==========================================
          FRAME PNG / WEBP OVERLAY
      ========================================== */}
      {/*
        Render ABOVE the avatar.

        Santa Hat, FS emblem and decorations
        must never rotate or move independently.
      */}

      {frameUrl &&
        failedImageUrl !== frameUrl && (
          <img
            src={frameUrl}
            alt=""
            aria-hidden="true"
            loading="eager"
            decoding="async"
            draggable={false}
            onLoad={() => {
              setLoadedImageUrl(frameUrl);
            }}
            onError={() => {
              setFailedImageUrl(frameUrl);
            }}
            className={`
              pointer-events-none
              absolute left-1/2 top-1/2
              z-10 max-w-none

              select-none
              object-contain

              ${glowClass}

              ${
                isFrameReady
                  ? "opacity-100"
                  : "opacity-0"
              }
            `}
            style={{
              width:
                `${alignment.imageScale * 100}%`,

              height:
                `${alignment.imageScale * 100}%`,

              transform:
                "translate(-50%, -50%)",
            }}
          />
        )}
    </span>
  );
}

// =========================================================
// EXPORT
// =========================================================

export default memo(NavbarFramedAvatar);
