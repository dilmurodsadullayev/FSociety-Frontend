
import {
    Crown,
    Gem,
    Medal,
    Trophy,
} from "lucide-react";

// =========================================================
// FSOCIETY — BADGE HELPERS
//
// Responsibilities:
//
// - Resolve badge image URLs
// - Use Django backend media URL
// - Badge color themes
// - Light / Dark Mode colors
// - Badge icon selection
// - Stable theme rotation
//
// Original four themes are preserved.
// =========================================================

// =========================================================
// BACKEND CONFIGURATION
//
// The project already exports BACKEND_URL from:
// src/services/config.js
//
// Example:
//
// Frontend:
// http://localhost:3000
//
// Backend:
// http://localhost:8000
//
// Badge media:
// http://localhost:8000/media/badges/example.png
// =========================================================

import {
    BACKEND_URL,
} from "../../../services/config";

// =========================================================
// BADGE TONES
//
// 0 — Gold
// 1 — Indigo
// 2 — Purple
// 3 — Emerald
//
// IMPORTANT:
//
// Every tone has separate Light/Dark colors.
//
// text:
//   Main color for achievement labels and icons.
//
// border:
//   Border color for badges and images.
//
// bg:
//   Background color for accent labels.
//
// imageBg:
//   Background gradient when the actual image
//   is missing or cannot be loaded.
//
// glow:
//   Hover background decoration.
//
// ring:
//   Badge image outline.
//
// progress:
//   Decorative progress indicator.
// =========================================================

const BADGE_TONES = [
    // =====================================================
    // GOLD / CROWN
    // =====================================================

    {
        icon: Crown,

        border:
            "border-amber-300/90 " +
            "dark:border-yellow-400/30",

        hoverBorder:
            "hover:border-amber-400/70 " +
            "dark:hover:border-yellow-400/50",

        bg:
            "bg-amber-100 " +
            "dark:bg-yellow-500/15",

        text:
            "text-amber-800 " +
            "dark:text-yellow-300",

        glow:
            "bg-amber-400/15 " +
            "dark:bg-yellow-500/20",

        ring:
            "ring-amber-200/90 " +
            "dark:ring-yellow-400/20",

        progress:
            "bg-amber-500 " +
            "dark:bg-yellow-400",

        imageBg:
            "bg-gradient-to-br " +
            "from-amber-50 " +
            "via-yellow-100 " +
            "to-amber-200/80 " +
            "dark:from-[#2b2210] " +
            "dark:via-[#352914] " +
            "dark:to-[#1b1920]",

        iconGlow:
            "bg-amber-400/20 " +
            "dark:bg-yellow-400/15",
    },

    // =====================================================
    // INDIGO / TROPHY
    // =====================================================

    {
        icon: Trophy,

        border:
            "border-indigo-300/90 " +
            "dark:border-indigo-400/30",

        hoverBorder:
            "hover:border-indigo-400/70 " +
            "dark:hover:border-indigo-400/50",

        bg:
            "bg-indigo-100 " +
            "dark:bg-indigo-500/15",

        text:
            "text-indigo-700 " +
            "dark:text-indigo-300",

        glow:
            "bg-indigo-400/15 " +
            "dark:bg-indigo-500/20",

        ring:
            "ring-indigo-200/90 " +
            "dark:ring-indigo-400/20",

        progress:
            "bg-indigo-500 " +
            "dark:bg-indigo-400",

        imageBg:
            "bg-gradient-to-br " +
            "from-indigo-50 " +
            "via-indigo-100 " +
            "to-violet-200/80 " +
            "dark:from-[#171b35] " +
            "dark:via-[#222448] " +
            "dark:to-[#161927]",

        iconGlow:
            "bg-indigo-400/20 " +
            "dark:bg-indigo-400/15",
    },

    // =====================================================
    // PURPLE / GEM
    // =====================================================

    {
        icon: Gem,

        border:
            "border-purple-300/90 " +
            "dark:border-purple-400/30",

        hoverBorder:
            "hover:border-purple-400/70 " +
            "dark:hover:border-purple-400/50",

        bg:
            "bg-purple-100 " +
            "dark:bg-purple-500/15",

        text:
            "text-purple-700 " +
            "dark:text-purple-300",

        glow:
            "bg-purple-400/15 " +
            "dark:bg-purple-500/20",

        ring:
            "ring-purple-200/90 " +
            "dark:ring-purple-400/20",

        progress:
            "bg-purple-500 " +
            "dark:bg-purple-400",

        imageBg:
            "bg-gradient-to-br " +
            "from-purple-50 " +
            "via-fuchsia-100 " +
            "to-purple-200/80 " +
            "dark:from-[#27152f] " +
            "dark:via-[#301b3c] " +
            "dark:to-[#191525]",

        iconGlow:
            "bg-purple-400/20 " +
            "dark:bg-purple-400/15",
    },

    // =====================================================
    // EMERALD / MEDAL
    // =====================================================

    {
        icon: Medal,

        border:
            "border-emerald-300/90 " +
            "dark:border-emerald-400/30",

        hoverBorder:
            "hover:border-emerald-400/70 " +
            "dark:hover:border-emerald-400/50",

        bg:
            "bg-emerald-100 " +
            "dark:bg-emerald-500/15",

        text:
            "text-emerald-800 " +
            "dark:text-emerald-300",

        glow:
            "bg-emerald-400/15 " +
            "dark:bg-emerald-500/20",

        ring:
            "ring-emerald-200/90 " +
            "dark:ring-emerald-400/20",

        progress:
            "bg-emerald-500 " +
            "dark:bg-emerald-400",

        imageBg:
            "bg-gradient-to-br " +
            "from-emerald-50 " +
            "via-green-100 " +
            "to-teal-200/80 " +
            "dark:from-[#102a24] " +
            "dark:via-[#15372f] " +
            "dark:to-[#14201e]",

        iconGlow:
            "bg-emerald-400/20 " +
            "dark:bg-emerald-400/15",
    },
];

// =========================================================
// NORMALIZE MEDIA PATH
//
// Handles:
//
// /media/badges/example.png
// media/badges/example.png
// badges/example.png
// /badges/example.png
//
// Django ImageField normally returns /media/...,
// but other representations are supported.
// =========================================================

const normalizeMediaPath = (path) => {
    const value = String(path ?? "").trim();

    if (!value) {
        return null;
    }

    // Already includes /media/

    if (value.startsWith("/media/")) {
        return value;
    }

    if (value.startsWith("media/")) {
        return `/${value}`;
    }

    // ImageField.name-style path

    if (value.startsWith("badges/")) {
        return `/media/${value}`;
    }

    if (value.startsWith("/badges/")) {
        return `/media${value}`;
    }

    // Other server-root paths are preserved.

    if (value.startsWith("/")) {
        return value;
    }

    // Relative filename without directory.
    // Badge uploads belong to media/badges/.

    return `/media/badges/${value}`;
};

// =========================================================
// GET BADGE IMAGE
//
// Fixes the original issue:
//
// OLD:
// window.location.origin + image
//
// Example:
// http://localhost:3000/media/badges/test.png
//
// NEW:
// BACKEND_URL + media path
//
// Example:
// http://localhost:8000/media/badges/test.png
//
// Supports:
// - Absolute HTTP URL
// - Absolute HTTPS URL
// - Relative Django media URL
// - ImageField.name paths
//
// Returns null for missing or invalid URLs.
// =========================================================

export const getBadgeImage = (image) => {
    // =====================================================
    // VALIDATE INPUT
    // =====================================================

    if (
        !image ||
        typeof image !== "string"
    ) {
        return null;
    }

    const imageValue = image.trim();

    if (!imageValue) {
        return null;
    }

    // =====================================================
    // ALREADY ABSOLUTE HTTP(S) URL
    //
    // DRF ImageField may produce a complete URL
    // through request.build_absolute_uri().
    // =====================================================

    if (/^https?:\/\//i.test(imageValue)) {
        try {
            const url = new URL(imageValue);

            return url.href;
        } catch {
            return null;
        }
    }

    // =====================================================
    // REJECT UNSUPPORTED URL SCHEMES
    //
    // Examples:
    // javascript:
    // data:
    // blob:
    // =====================================================

    if (/^[a-z][a-z\d+.-]*:/i.test(imageValue)) {
        return null;
    }

    // =====================================================
    // REJECT PROTOCOL-RELATIVE EXTERNAL URLS
    // =====================================================

    if (imageValue.startsWith("//")) {
        return null;
    }

    // =====================================================
    // NORMALIZE DJANGO MEDIA PATH
    // =====================================================

    const mediaPath =
        normalizeMediaPath(imageValue);

    if (!mediaPath) {
        return null;
    }

    // =====================================================
    // RESOLVE BACKEND ORIGIN
    //
    // BACKEND_URL comes from existing project config.
    //
    // It supports localhost and production hosting.
    // =====================================================

    try {
        const backendOrigin =
            new URL(BACKEND_URL).origin;

        return new URL(
            mediaPath,
            backendOrigin
        ).href;
    } catch {
        // ================================================
        // FALLBACK
        //
        // Used only when BACKEND_URL is unavailable
        // or malformed.
        // ================================================

        if (
            typeof window === "undefined"
        ) {
            return null;
        }

        try {
            return new URL(
                mediaPath,
                window.location.origin
            ).href;
        } catch {
            return null;
        }
    }
};

// =========================================================
// GET BADGE TONE
//
// Theme order:
//
// 0 -> Gold
// 1 -> Indigo
// 2 -> Purple
// 3 -> Emerald
// 4 -> Gold
//
// Original theme rotation is preserved.
// =========================================================

export const getBadgeTone = (index = 0) => {
    const parsedIndex = Number(index);

    const safeIndex =
        Number.isFinite(parsedIndex)
            ? Math.max(
                  0,
                  Math.floor(parsedIndex)
              )
            : 0;

    return BADGE_TONES[
        safeIndex % BADGE_TONES.length
    ];
};
