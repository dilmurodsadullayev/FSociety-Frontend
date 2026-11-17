
// src/components/profile/hero/ProfileAvatarFrame.jsx

import React, {
    memo,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    motion,
    useReducedMotion,
} from "framer-motion";

import {
    BACKEND_URL,
} from "../../../services/config";

import api from "../../../services/api";

// =========================================================
// FSOCIETY — PROFILE AVATAR FRAME
// =========================================================
//
// Location:
// src/components/profile/hero/ProfileAvatarFrame.jsx
//
// Responsibilities:
//
// - Fetch publicly equipped profile frame
// - Show frame on top of profile avatar
// - Support transparent PNG / WebP
// - Support Santa Hat frame design
// - Rarity-based glow
// - Safe CSS fallback
// - Dark / Light mode
// - Responsive overlay
// - Reduced motion support
// - Clean up pending requests
//
// Endpoint:
//
// GET /api/users/<username>/equipped-frame/
//
// Response:
//
// {
//     username: "...",
//     equipped_frame: {...} | null,
//     equipped_at: "..." | null
// }
//
// IMPORTANT:
//
// - This component never equips a frame.
// - This component never deducts FCoin.
// - No private inventory API is used.
// - The public profile API is the source of truth.
// - No frame means no additional decoration.
//
// =========================================================

// =========================================================
// RARITY DESIGN TOKENS
// =========================================================

const RARITY_STYLES = {
    common: {
        glow: "bg-slate-400/25",
        ring: "border-slate-400",
        sparkle: "bg-slate-300",
        shadow:
            "drop-shadow-[0_0_7px_rgba(148,163,184,0.3)]",
    },

    rare: {
        glow: "bg-cyan-400/30",
        ring: "border-cyan-400",
        sparkle: "bg-cyan-300",
        shadow:
            "drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]",
    },

    epic: {
        glow: "bg-violet-500/30",
        ring: "border-violet-400",
        sparkle: "bg-violet-300",
        shadow:
            "drop-shadow-[0_0_14px_rgba(139,92,246,0.45)]",
    },

    legendary: {
        glow: "bg-amber-400/35",
        ring: "border-amber-400",
        sparkle: "bg-amber-300",
        shadow:
            "drop-shadow-[0_0_17px_rgba(245,158,11,0.5)]",
    },
};

const DEFAULT_RARITY = RARITY_STYLES.common;

// =========================================================
// HELPERS
// =========================================================

const normalizeUsername = (value) => {
    return String(value ?? "").trim();
};

const normalizeFrame = (value) => {
    if (
        !value ||
        typeof value !== "object" ||
        Array.isArray(value)
    ) {
        return null;
    }

    return value;
};

// =========================================================
// IMAGE URL
// =========================================================
//
// Backend media images may be returned as:
//
// /media/profile_frames/example.png
//
// or:
//
// https://backend.example.com/media/...
//
// Only HTTP(S) addresses are accepted.
// =========================================================

const resolveFrameImage = (frame) => {
    const raw =
        frame?.image_url ??
        frame?.image ??
        frame?.frame_image;

    const image =
        typeof raw === "string"
            ? raw
            : typeof raw?.url === "string"
                ? raw.url
                : null;

    if (
        !image ||
        !image.trim()
    ) {
        return null;
    }

    const value = image.trim();

    if (
        value.startsWith("//")
    ) {
        return null;
    }

    try {
        const base =
            `${String(
                BACKEND_URL || window.location.origin
            ).replace(/\/+$/, "")}/`;

        const url = new URL(
            value,
            base
        );

        if (
            url.protocol !== "http:" &&
            url.protocol !== "https:"
        ) {
            return null;
        }

        return url.href;
    } catch {
        return null;
    }
};

// =========================================================
// SANTA FRAME DETECTION
// =========================================================
//
// The seeded PNG already contains the Santa hat.
//
// This check is only used for the fallback when
// the actual frame image cannot be loaded.
// =========================================================

const isSantaFrame = (frame) => {
    const identifier = String(
        frame?.code || ""
    ).toLowerCase();

    return (
        identifier.includes("santa-hat") ||
        identifier.includes("santa-surprise")
    );
};

// =========================================================
// CSS / SVG FALLBACK FRAME
// =========================================================
//
// The real uploaded image is always preferred.
//
// The fallback does not replace the avatar image.
// =========================================================

const FallbackFrame = memo(function FallbackFrame({
    rarity,
    santa = false,
}) {
    return (
        <div
            aria-hidden="true"
            className="
                pointer-events-none
                absolute inset-0
            "
        >
            {/* Fallback ring */}

            <span
                className={`
                    absolute inset-[16%]
                    rounded-full
                    border-[6px]
                    shadow-[0_0_18px_rgba(139,92,246,0.15)]

                    ${rarity.ring}
                `}
            />

            {/* Inner ornament */}

            <span
                className="
                    absolute inset-[12.5%]
                    rounded-full
                    border border-dashed
                    border-white/40

                    dark:border-white/20
                "
            />

            {/* Top sparkle */}

            {!santa && (
                <span
                    className={`
                        absolute left-1/2 top-[10%]
                        h-3 w-3
                        -translate-x-1/2 rotate-45
                        border border-white/75
                        shadow-lg

                        ${rarity.sparkle}
                    `}
                />
            )}

            {/* Santa hat fallback */}

            {santa && (
                <svg
                    viewBox="0 0 240 140"
                    fill="none"
                    aria-hidden="true"
                    className="
                        absolute
                        left-[16%] top-[6%]
                        h-[44%] w-[62%]
                        overflow-visible

                        drop-shadow-[0_5px_6px_rgba(15,23,42,0.3)]
                    "
                >
                    {/* Hat fabric */}

                    <path
                        d="
                            M30 104
                            C54 48 105 12 148 21
                            C181 28 195 66 211 98
                            L30 104
                        "
                        fill="#DC2626"
                        stroke="#991B1B"
                        strokeWidth="4"
                    />

                    {/* Folded end */}

                    <path
                        d="
                            M141 24
                            C116 8 94 21 82 35
                        "
                        stroke="#B91C1C"
                        strokeWidth="17"
                        strokeLinecap="round"
                    />

                    {/* Pom-pom */}

                    <circle
                        cx="80"
                        cy="35"
                        r="23"
                        fill="#FFFDF0"
                        stroke="#CBD5E1"
                        strokeWidth="4"
                    />

                    <circle
                        cx="73"
                        cy="27"
                        r="8"
                        fill="#FFFFFF"
                        fillOpacity="0.75"
                    />

                    {/* White brim */}

                    <path
                        d="
                            M25 96
                            C79 85 159 84 215 95
                            L226 121
                            C153 117 75 127 25 124
                            Z
                        "
                        fill="#FFFDF0"
                        stroke="#CBD5E1"
                        strokeWidth="4"
                    />

                    {/* Brim highlight */}

                    <path
                        d="M42 107 C95 99 158 100 204 108"
                        stroke="#FFFFFF"
                        strokeWidth="6"
                        strokeLinecap="round"
                    />
                </svg>
            )}
        </div>
    );
});

// =========================================================
// PROFILE AVATAR FRAME COMPONENT
// =========================================================

const ProfileAvatarFrame = memo(function ProfileAvatarFrame({
    username,
    className = "",
}) {
    const reducedMotion = useReducedMotion();

    // =====================================================
    // USERNAME
    // =====================================================

    const normalizedUsername =
        normalizeUsername(username);

    // =====================================================
    // FETCH RESULT
    // =====================================================
    //
    // Store the username with the response.
    //
    // This prevents another user's frame from
    // appearing briefly during profile navigation.
    // =====================================================

    const [
        frameRecord,
        setFrameRecord,
    ] = useState({
        username: null,
        frame: null,
    });

    // =====================================================
    // IMAGE FAILURE
    // =====================================================

    const [
        failedImageUrl,
        setFailedImageUrl,
    ] = useState(null);

    // =====================================================
    // REFRESH COUNTER
    // =====================================================

    const [
        refreshVersion,
        setRefreshVersion,
    ] = useState(0);

    // =====================================================
    // REFRESH ON FOCUS
    // =====================================================
    //
    // If the user equips a frame in another tab,
    // the public appearance can refresh when
    // returning to this browser window.
    // =====================================================

    useEffect(() => {
        const refresh = () => {
            setRefreshVersion(
                (version) => version + 1
            );
        };

        window.addEventListener(
            "focus",
            refresh
        );

        // Optional event for future equipment UI.
        window.addEventListener(
            "fsociety:frame-updated",
            refresh
        );

        return () => {
            window.removeEventListener(
                "focus",
                refresh
            );

            window.removeEventListener(
                "fsociety:frame-updated",
                refresh
            );
        };
    }, []);

    // =====================================================
    // FETCH PUBLIC FRAME
    // =====================================================

    useEffect(() => {
        if (!normalizedUsername) {
            return undefined;
        }

        let active = true;

        const controller =
            new AbortController();

        const fetchEquippedFrame = async () => {
            try {
                const response = await api.get(
                    `/users/${encodeURIComponent(
                        normalizedUsername
                    )}/equipped-frame/`,
                    {
                        signal: controller.signal,

                        // This endpoint is public.
                        withCredentials: false,
                    }
                );

                if (!active) {
                    return;
                }

                const equippedFrame =
                    normalizeFrame(
                        response?.data?.equipped_frame
                    );

                setFrameRecord({
                    username: normalizedUsername,
                    frame: equippedFrame,
                });
            } catch (error) {
                if (
                    !active ||
                    controller.signal.aborted
                ) {
                    return;
                }

                // Frame appearance should not break
                // the rest of the profile page.
                //
                // 404 / 500 / network issues are
                // treated as unavailable decoration.

                setFrameRecord({
                    username: normalizedUsername,
                    frame: null,
                });
            }
        };

        fetchEquippedFrame();

        return () => {
            active = false;

            controller.abort();
        };
    }, [
        normalizedUsername,
        refreshVersion,
    ]);

    // =====================================================
    // VISIBLE FRAME
    // =====================================================

    const frame =
        frameRecord.username === normalizedUsername
            ? frameRecord.frame
            : null;

    // =====================================================
    // FRAME IMAGE
    // =====================================================

    const imageUrl = useMemo(
        () => resolveFrameImage(frame),
        [frame]
    );

    const imageAvailable = Boolean(
        imageUrl &&
        failedImageUrl !== imageUrl
    );

    // =====================================================
    // FRAME THEME
    // =====================================================

    const rarityKey = String(
        frame?.rarity || "common"
    ).toLowerCase();

    const rarity =
        RARITY_STYLES[rarityKey] ||
        DEFAULT_RARITY;

    const santa = isSantaFrame(frame);

    // =====================================================
    // NO FRAME
    // =====================================================

    if (!frame) {
        return null;
    }

    // =====================================================
    // FRAME LABEL
    // =====================================================

    const frameName =
        frame?.name ||
        "FSociety Profile Frame";

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div
            title={`${frameName} · ${rarityKey.toUpperCase()}`}
            aria-hidden="true"
            className={`
                pointer-events-none
                absolute inset-0
                z-30

                ${className}
            `}
        >
            {/* =========================================
                ANIMATED RARITY GLOW
            ========================================= */}
            {/*
                Only the glow animates.

                The actual frame PNG never rotates,
                so Santa hats and other decorations
                stay in their correct positions.
            */}

            <motion.span
                className={`
                    absolute
                    -inset-4

                    rounded-full
                    blur-2xl

                    ${rarity.glow}
                `}
                initial={false}
                animate={
                    reducedMotion
                        ? {
                            opacity: 0.35,
                            scale: 1,
                        }
                        : {
                            opacity: [
                                0.25,
                                0.58,
                                0.25,
                            ],

                            scale: [
                                0.98,
                                1.08,
                                0.98,
                            ],
                        }
                }
                transition={
                    reducedMotion
                        ? { duration: 0 }
                        : {
                            duration:
                                rarityKey === "legendary"
                                    ? 3.8
                                    : 5.2,

                            repeat: Infinity,
                            ease: "easeInOut",
                        }
                }
            />

            {/* =========================================
                REAL FRAME / FALLBACK
            ========================================= */}
            {/*
                The 600x600 seed image contains
                the entire frame composition.

                Display at 150% of avatar width.

                This positioning aligns the ring
                with the original 96px / 128px avatar.
            */}

            <div
                className="
                    absolute left-1/2 top-1/2

                    h-[150%] w-[150%]

                    -translate-x-1/2
                    -translate-y-1/2
                "
            >
                {imageAvailable ? (
                    <img
                        src={imageUrl}
                        alt=""
                        onError={() => {
                            setFailedImageUrl(
                                imageUrl
                            );
                        }}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className={`
                            absolute inset-0
                            h-full w-full
                            select-none
                            object-contain

                            ${rarity.shadow}
                        `}
                    />
                ) : (
                    <FallbackFrame
                        rarity={rarity}
                        santa={santa}
                    />
                )}
            </div>

            {/* =========================================
                LEGENDARY LIGHT DETAILS
            ========================================= */}

            {rarityKey === "legendary" && (
                <>
                    <motion.span
                        className="
                            absolute
                            -right-2 top-1/3

                            h-1.5 w-1.5
                            rounded-full
                            bg-amber-200

                            shadow-[0_0_13px_rgba(251,191,36,0.9)]
                        "
                        animate={
                            reducedMotion
                                ? undefined
                                : {
                                    opacity: [
                                        0.25,
                                        1,
                                        0.25,
                                    ],
                                    scale: [
                                        0.7,
                                        1.3,
                                        0.7,
                                    ],
                                }
                        }
                        transition={{
                            duration: 2.6,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />

                    <motion.span
                        className="
                            absolute
                            -left-2 bottom-1/3

                            h-1.5 w-1.5
                            rounded-full
                            bg-amber-200

                            shadow-[0_0_13px_rgba(251,191,36,0.9)]
                        "
                        animate={
                            reducedMotion
                                ? undefined
                                : {
                                    opacity: [
                                        1,
                                        0.25,
                                        1,
                                    ],
                                    scale: [
                                        1.2,
                                        0.7,
                                        1.2,
                                    ],
                                }
                        }
                        transition={{
                            duration: 3.1,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </>
            )}
        </div>
    );
});

// =========================================================
// EXPORT
// =========================================================

export default ProfileAvatarFrame;
