
import React, {
  memo,
  useEffect,
  useMemo,
  useState,
} from "react";

import { API_URL } from "../../services/config";

import {
  DefaultUserImage,
  getMediaUrl,
} from "../../utils/imageUtils";

// =========================================================
// FSOCIETY — PUBLIC FRAMED AVATAR
// =========================================================
//
// Location:
// src/components/ui/PublicFramedAvatar.jsx
//
// Used in:
// - Post author
// - Post comments
// - Nested replies
//
// Features:
// - Public equipped frame API
// - Shared cache by username
// - In-flight request deduplication
// - Refresh after Equip / Unequip
// - Transparent PNG overlay
// - Special Winter Royal alignment
// - Original avatar fallback
// - Dark / Light mode
// - Responsive
//
// Frame PNG never rotates.
//
// =========================================================

// =========================================================
// CACHE CONFIG
// =========================================================

const FRAME_CACHE_TTL_MS = 5 * 60 * 1000;
const NO_FRAME_CACHE_TTL_MS = 60 * 1000;
const ERROR_CACHE_TTL_MS = 15 * 1000;
const FRAME_REQUEST_TIMEOUT_MS = 10 * 1000;
const MAX_CACHED_USERS = 200;

const frameCache = new Map();
const pendingRequests = new Map();

let cacheRevision = 0;

// =========================================================
// AVATAR ALIGNMENTS
// =========================================================

const DEFAULT_ALIGNMENT = Object.freeze({
  x: 50,
  y: 50,
  avatarSize: 82,
  imageScale: 150,
});

const FRAME_ALIGNMENTS = Object.freeze({
  "fs-winter-royal-2027": {
    x: 46.5,
    y: 47.2,
    avatarSize: 81,
    imageScale: 150,
  },
});

// =========================================================
// RARITY GLOW
// =========================================================

const FRAME_GLOW = {
  common:
    "drop-shadow-[0_0_3px_rgba(148,163,184,0.35)]",

  rare:
    "drop-shadow-[0_0_5px_rgba(34,211,238,0.45)]",

  epic:
    "drop-shadow-[0_0_6px_rgba(167,139,250,0.50)]",

  legendary:
    "drop-shadow-[0_0_7px_rgba(251,191,36,0.55)]",
};

// =========================================================
// HELPERS
// =========================================================

const normalizeUsername = (value) =>
  typeof value === "string"
    ? value.trim()
    : "";

const cacheKey = (username) =>
  username.toLowerCase();

const validObject = (value) =>
  value &&
  typeof value === "object" &&
  !Array.isArray(value);

// =========================================================
// IMAGE URL
// =========================================================

const imageSource = (value) => {
  const candidate =
    typeof value === "string"
      ? value
      : typeof value?.url === "string"
        ? value.url
        : null;

  if (candidate?.trim() === DefaultUserImage) {
    return DefaultUserImage;
  }

  return candidate?.trim()
    ? getMediaUrl(candidate.trim(), null)
    : null;
};

const extractFrameImage = (frame) =>
  imageSource(
    frame?.image_url ??
    frame?.image ??
    frame?.frame_image
  );

// =========================================================
// CACHE STORAGE
// =========================================================

const putInCache = (key, frame, ttl) => {
  frameCache.delete(key);

  frameCache.set(key, {
    frame,
    expiresAt: Date.now() + ttl,
  });

  if (frameCache.size > MAX_CACHED_USERS) {
    const firstKey =
      frameCache.keys().next().value;

    frameCache.delete(firstKey);
  }
};

// =========================================================
// FETCH PUBLIC EQUIPPED FRAME
// =========================================================
//
// One request per username at a time.
//
// Several comments from the same user share
// the same pending request and cached result.
//
// The endpoint is public; authentication
// cookies are not needed.
//
// =========================================================

const loadPublicEquippedFrame = (username) => {
  const key = cacheKey(username);
  const now = Date.now();

  const cached = frameCache.get(key);

  if (
    cached &&
    cached.expiresAt > now
  ) {
    return Promise.resolve(cached.frame);
  }

  const existing =
    pendingRequests.get(key);

  if (existing) {
    return existing;
  }

  const revisionAtStart = cacheRevision;

  const base = String(
    API_URL || "/api"
  ).replace(/\/+$/, "");

  const endpoint =
    `${base}/users/` +
    `${encodeURIComponent(username)}/` +
    "equipped-frame/";

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    FRAME_REQUEST_TIMEOUT_MS
  );

  const promise = fetch(endpoint, {
    method: "GET",
    credentials: "omit",
    cache: "no-store",
    signal: controller.signal,

    headers: {
      Accept: "application/json",
    },
  })
    .then(async (response) => {
      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(
          "FRAME_REQUEST_FAILED"
        );
      }

      const payload =
        await response.json();

      return validObject(
        payload?.equipped_frame
      )
        ? payload.equipped_frame
        : null;
    })

    .then((frame) => {
      if (
        cacheRevision === revisionAtStart
      ) {
        putInCache(
          key,
          frame,
          frame
            ? FRAME_CACHE_TTL_MS
            : NO_FRAME_CACHE_TTL_MS
        );
      }

      return frame;
    })

    .catch(() => {
      if (
        cacheRevision === revisionAtStart
      ) {
        putInCache(
          key,
          null,
          ERROR_CACHE_TTL_MS
        );
      }

      return null;
    })

    .finally(() => {
      clearTimeout(timeoutId);

      if (
        pendingRequests.get(key) === promise
      ) {
        pendingRequests.delete(key);
      }
    });

  pendingRequests.set(
    key,
    promise
  );

  return promise;
};

// =========================================================
// CACHE INVALIDATION
// =========================================================
//
// MyFrames.jsx emits this event after
// successful Equip / Unequip:
//
// window.dispatchEvent(
//   new Event("fsociety:frame-updated")
// );
//
// =========================================================

const invalidatePublicFrameCache = () => {
  cacheRevision += 1;

  frameCache.clear();
  pendingRequests.clear();
};

// One listener per module, not per comment.

if (typeof window !== "undefined") {
  window.addEventListener(
    "fsociety:frame-updated",
    invalidatePublicFrameCache
  );
}

// =========================================================
// COMPONENT
// =========================================================

function PublicFramedAvatar({
  username,
  avatarUrl,
  displayName,

  className = "h-10 w-10",
  plainClassName = "rounded-xl",

  showFrame = true,
  loading = "lazy",
}) {
  // =====================================================
  // USERNAME
  // =====================================================

  const safeUsername =
    normalizeUsername(username);

  // =====================================================
  // FRAME STATE
  // =====================================================

  const [
    frameResult,
    setFrameResult,
  ] = useState({
    username: "",
    frame: null,
  });

  const [
    refreshKey,
    setRefreshKey,
  ] = useState(0);

  // =====================================================
  // IMAGE STATES
  // =====================================================

  const [
    failedFrameUrl,
    setFailedFrameUrl,
  ] = useState(null);

  const [
    loadedFrameUrl,
    setLoadedFrameUrl,
  ] = useState(null);

  const [
    failedAvatarUrl,
    setFailedAvatarUrl,
  ] = useState(null);

  // =====================================================
  // FETCH EQUIPPED FRAME
  // =====================================================

  useEffect(() => {
    if (
      !safeUsername ||
      !showFrame
    ) {
      return undefined;
    }

    let alive = true;
    const revisionAtStart = cacheRevision;

    loadPublicEquippedFrame(
      safeUsername
    ).then((frame) => {
      if (
        alive &&
        revisionAtStart === cacheRevision
      ) {
        setFrameResult({
          username: safeUsername,
          frame,
        });
      }
    });

    return () => {
      alive = false;
    };
  }, [
    safeUsername,
    showFrame,
    refreshKey,
  ]);

  // =====================================================
  // REFRESH ON FRAME UPDATE
  // =====================================================

  useEffect(() => {
    if (!showFrame) {
      return undefined;
    }

    const handleUpdate = () => {
      setRefreshKey(
        (value) => value + 1
      );
    };

    window.addEventListener(
      "fsociety:frame-updated",
      handleUpdate
    );

    return () => {
      window.removeEventListener(
        "fsociety:frame-updated",
        handleUpdate
      );
    };
  }, [showFrame]);

  // =====================================================
  // CURRENT FRAME
  // =====================================================
  //
  // Do not display another user's frame
  // when navigating between profiles.
  //
  // =====================================================

  const frame =
    showFrame &&
    frameResult.username === safeUsername
      ? frameResult.frame
      : null;

  // =====================================================
  // IMAGE URLS
  // =====================================================

  const frameUrl = useMemo(
    () => extractFrameImage(frame),
    [frame]
  );

  const resolvedAvatarUrl = useMemo(
    () =>
      imageSource(avatarUrl) ||
      DefaultUserImage,
    [avatarUrl]
  );

  useEffect(() => {
    setFailedFrameUrl(null);
  }, [safeUsername, frameUrl, refreshKey]);

  useEffect(() => {
    setFailedAvatarUrl(null);
  }, [safeUsername, resolvedAvatarUrl, refreshKey]);

  // =====================================================
  // FRAME READY
  // =====================================================
  //
  // The avatar only changes position after
  // the PNG finishes loading successfully.
  //
  // =====================================================

  const frameReady = Boolean(
    frameUrl &&
    loadedFrameUrl === frameUrl &&
    failedFrameUrl !== frameUrl
  );

  // =====================================================
  // ALIGNMENT
  // =====================================================

  const frameCode = String(
    frame?.code || ""
  ).toLowerCase();

  const alignment =
    FRAME_ALIGNMENTS[frameCode] ||
    DEFAULT_ALIGNMENT;

  const rarity = String(
    frame?.rarity || "common"
  ).toLowerCase();

  // =====================================================
  // AVATAR POSITION
  // =====================================================
  //
  // The PNG is scaled to 150%.
  //
  // The avatar center follows the
  // transparent opening of that PNG.
  //
  // =====================================================

  const avatarLeft = frameReady
    ? 50 +
      ((alignment.x - 50) *
        alignment.imageScale) /
        100
    : 50;

  const avatarTop = frameReady
    ? 50 +
      ((alignment.y - 50) *
        alignment.imageScale) /
        100
    : 50;

  // =====================================================
  // ACCESSIBILITY
  // =====================================================

  const accessibleName =
    displayName ||
    safeUsername ||
    "Foydalanuvchi";

  const fallbackInitial =
    accessibleName.charAt(0).toUpperCase();

  const displayedAvatarUrl =
    failedAvatarUrl === resolvedAvatarUrl
      ? DefaultUserImage
      : resolvedAvatarUrl;

  const showAvatarImage =
    failedAvatarUrl !== DefaultUserImage;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <span
      role="img"
      aria-label={
        frameReady
          ? `${accessibleName} avatari — ${
              frame?.name || "ramka"
            }`
          : `${accessibleName} avatari`
      }
      className={`
        relative inline-flex
        shrink-0 items-center
        justify-center overflow-visible

        ${className}
      `}
    >
      {/* ==========================================
          USER AVATAR
      ========================================== */}

      <span
        aria-hidden="true"
        className={`
          absolute
          overflow-hidden
          border border-slate-200
          bg-slate-100
          shadow-sm

          dark:border-white/10
          dark:bg-slate-800

          ${
            frameReady
              ? "rounded-full"
              : plainClassName
          }
        `}
        style={{
          left: `${avatarLeft}%`,
          top: `${avatarTop}%`,

          width: frameReady
            ? `${alignment.avatarSize}%`
            : "100%",

          height: frameReady
            ? `${alignment.avatarSize}%`
            : "100%",

          transform:
            "translate(-50%, -50%)",
        }}
      >
        {showAvatarImage ? (
          <img
            src={displayedAvatarUrl}
            alt=""
            loading={loading}
            decoding="async"
            draggable={false}
            onError={() =>
              setFailedAvatarUrl(
                displayedAvatarUrl
              )
            }
            className="
              block h-full w-full
              object-cover
            "
          />
        ) : (
          <span
            className="
              grid h-full w-full
              place-items-center

              font-mono text-sm
              font-bold

              text-slate-500
              dark:text-slate-300
            "
          >
            {fallbackInitial}
          </span>
        )}
      </span>

      {/* ==========================================
          PNG FRAME OVERLAY
      ========================================== */}
      {/*
        The PNG stays above the avatar.

        Santa hats, ice and FS emblems
        remain upright.

        No PNG rotation.
      */}

      {frameUrl &&
        failedFrameUrl !== frameUrl && (
          <img
            src={frameUrl}
            alt=""
            aria-hidden="true"
            loading={loading}
            decoding="async"
            draggable={false}
            onLoad={() =>
              setLoadedFrameUrl(frameUrl)
            }
            onError={() => {
              setLoadedFrameUrl(null);
              setFailedFrameUrl(frameUrl);
            }}
            className={`
              pointer-events-none
              absolute left-1/2
              top-1/2 z-10
              max-w-none select-none
              object-contain

              ${
                FRAME_GLOW[rarity] ||
                FRAME_GLOW.common
              }

              ${
                frameReady
                  ? "opacity-100"
                  : "opacity-0"
              }
            `}
            style={{
              width:
                `${alignment.imageScale}%`,

              height:
                `${alignment.imageScale}%`,

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

export default memo(PublicFramedAvatar);
