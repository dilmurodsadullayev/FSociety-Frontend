
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
    Calendar,
} from "lucide-react";

// =========================================================
// DATE FORMATTER
// =========================================================

import {
    formatPrettyDate,
} from "../../../utils/formatDate";

// =========================================================
// BADGE HELPERS
// =========================================================

import {
    getBadgeImage,
    getBadgeTone,
} from "./badgeHelpers";

// =========================================================
// FSOCIETY — PROFILE BADGE CARD
//
// Features:
//
// - Django media image URL
// - Image loading/error fallback
// - Full image visibility
// - Badge theme icons
// - Responsive card
// - Light / Dark Mode
// - Improved color contrast
// - Badge title and description
// - Achievement label
// - Award date
// - Framer Motion animation
// - Decorative progress indicator
//
// All original functionality is preserved.
// =========================================================

// =========================================================
// CONSTANTS
// =========================================================

const DEFAULT_BADGE_NAME =
    "Noma’lum nishon";

const DEFAULT_BADGE_DESCRIPTION =
    "Ushbu yutuq haqida ma’lumot mavjud emas.";

const DEFAULT_BADGE_DATE =
    "Sana noma’lum";

// =========================================================
// SAFE ANIMATION INDEX
// =========================================================

const getSafeIndex = (index) => {
    const value = Number(index);

    if (
        !Number.isFinite(value) ||
        value < 0
    ) {
        return 0;
    }

    return Math.floor(value);
};

// =========================================================
// GET BADGE INFORMATION
// =========================================================

const getBadgeInfo = (item) => {
    const badge =
        item?.badge &&
        typeof item.badge === "object" &&
        !Array.isArray(item.badge)
            ? item.badge
            : {};

    const name =
        typeof badge.name === "string" &&
        badge.name.trim()
            ? badge.name.trim()
            : DEFAULT_BADGE_NAME;

    const description =
        typeof badge.description === "string" &&
        badge.description.trim()
            ? badge.description.trim()
            : DEFAULT_BADGE_DESCRIPTION;

    return {
        badge,
        name,
        description,
    };
};

// =========================================================
// FORMAT AWARD DATE
// =========================================================

const getAwardDate = (value) => {
    if (!value) {
        return DEFAULT_BADGE_DATE;
    }

    try {
        return (
            formatPrettyDate(value) ||
            DEFAULT_BADGE_DATE
        );
    } catch {
        return DEFAULT_BADGE_DATE;
    }
};

// =========================================================
// BADGE IMAGE
//
// Renders either:
//
// 1. Real Django media image
//
// or
//
// 2. High contrast themed fallback icon
//
// The fallback stays visible in Light and Dark Mode.
// =========================================================

const ProfileBadgeImage = memo(
    function ProfileBadgeImage({
        image,
        name,
        tone,
    }) {
        // =================================================
        // RESOLVE IMAGE URL
        // =================================================

        const badgeImage =
            getBadgeImage(image);

        // =================================================
        // IMAGE ERROR STATE
        //
        // Keep the failed URL rather than a boolean.
        //
        // If the card receives a new image, it
        // can still display it normally.
        // =================================================

        const [
            failedImageUrl,
            setFailedImageUrl,
        ] = useState(null);

        // =================================================
        // IMAGE STATE
        // =================================================

        const hasImage =
            Boolean(badgeImage);

        const hasImageError =
            hasImage &&
            failedImageUrl === badgeImage;

        const showRealImage =
            hasImage &&
            !hasImageError;

        // =================================================
        // FALLBACK ICON
        // =================================================

        const ToneIcon = tone.icon;

        // =================================================
        // IMAGE ERROR HANDLER
        // =================================================

        const handleImageError = () => {
            if (badgeImage) {
                setFailedImageUrl(
                    badgeImage
                );
            }
        };

        // =================================================
        // RENDER
        // =================================================

        return (
            <div
                className={`
                    relative

                    h-20
                    w-20

                    shrink-0

                    overflow-hidden

                    rounded-2xl
                    border

                    ${tone.border}
                    ${tone.imageBg}

                    ring-[3px]
                    ${tone.ring}

                    shadow-md
                    shadow-slate-900/[0.06]

                    dark:shadow-black/20

                    sm:h-24
                    sm:w-24
                `}
            >
                {/* =========================================
                    BACKGROUND DECORATION
                ========================================== */}

                <div
                    aria-hidden="true"
                    className={`
                        pointer-events-none

                        absolute
                        -right-5
                        -top-5

                        h-16
                        w-16

                        rounded-full

                        ${tone.iconGlow}

                        blur-xl
                    `}
                />

                {/* =========================================
                    IMAGE
                ========================================== */}

                {showRealImage ? (
                    <img
                        src={badgeImage}
                        alt={name}
                        loading="lazy"
                        decoding="async"
                        onError={handleImageError}
                        className="
                            relative
                            z-10

                            h-full
                            w-full

                            object-contain

                            p-1.5

                            transition-transform
                            duration-500

                            group-hover:scale-105

                            motion-reduce:transform-none
                            motion-reduce:transition-none

                            sm:p-2
                        "
                    />
                ) : (
                    // =====================================
                    // FALLBACK ICON
                    //
                    // A missing image no longer produces
                    // a barely visible pale icon.
                    // =====================================

                    <div
                        role="img"
                        aria-label={`${name} nishoni`}
                        className="
                            relative
                            z-10

                            flex
                            h-full
                            w-full

                            items-center
                            justify-center
                        "
                    >
                        <div
                            className={`
                                flex
                                h-14
                                w-14

                                items-center
                                justify-center

                                rounded-2xl
                                border

                                ${tone.border}
                                ${tone.bg}

                                shadow-sm

                                sm:h-16
                                sm:w-16
                            `}
                        >
                            <ToneIcon
                                size={35}
                                strokeWidth={1.8}
                                aria-hidden="true"
                                className={`
                                    ${tone.text}

                                    drop-shadow-sm
                                `}
                            />
                        </div>
                    </div>
                )}

                {/* =========================================
                    CORNER ACHIEVEMENT ICON
                ========================================== */}

                <div
                    aria-hidden="true"
                    className={`
                        absolute
                        bottom-1
                        left-1

                        z-20

                        flex
                        h-6
                        w-6

                        items-center
                        justify-center

                        rounded-lg
                        border

                        ${tone.border}
                        ${tone.bg}
                        ${tone.text}

                        shadow-sm

                        backdrop-blur-md
                    `}
                >
                    <ToneIcon
                        size={13}
                        strokeWidth={2}
                    />
                </div>
            </div>
        );
    }
);

// =========================================================
// ACHIEVEMENT LABEL
//
// Uses colors from badgeHelpers.js.
// =========================================================

const ProfileBadgeAchievement = memo(
    function ProfileBadgeAchievement({
        tone,
    }) {
        return (
            <span
                className={`
                    inline-flex
                    min-h-6
                    w-fit

                    items-center
                    justify-center

                    rounded-full
                    border

                    px-2.5
                    py-1

                    text-[10px]
                    font-black

                    uppercase
                    tracking-wide

                    ${tone.border}
                    ${tone.bg}
                    ${tone.text}
                `}
            >
                Achievement
            </span>
        );
    }
);

// =========================================================
// AWARD DATE
// =========================================================

const ProfileBadgeDate = memo(
    function ProfileBadgeDate({
        awardedAt,
    }) {
        const formattedDate =
            getAwardDate(awardedAt);

        return (
            <span
                className="
                    inline-flex
                    min-h-6
                    w-fit
                    max-w-full

                    items-center
                    gap-1.5

                    rounded-xl
                    border

                    border-slate-300/80
                    bg-slate-100

                    px-2.5
                    py-1

                    text-[11px]
                    font-bold

                    leading-4

                    text-slate-700

                    dark:border-gray-700/70
                    dark:bg-gray-900/80
                    dark:text-gray-300
                "
            >
                <Calendar
                    size={13}
                    aria-hidden="true"
                    className="
                        shrink-0

                        text-indigo-600
                        dark:text-indigo-300
                    "
                />

                <span
                    className="
                        min-w-0

                        break-words
                        normal-case
                    "
                >
                    {formattedDate}
                </span>
            </span>
        );
    }
);

// =========================================================
// PROFILE BADGE CARD
//
// Props:
//
// item:
//   Backend UserBadge object.
//
// index:
//   Badge position.
//
// Original data structure:
//
// {
//     badge: {
//         name: "...",
//         image: "...",
//         description: "...",
//         code: "..."
//     },
//     awarded_at: "..."
// }
//
// Parent:
// ProfileBadges.jsx
// =========================================================

const ProfileBadgeCard = ({
    item,
    index = 0,
}) => {
    // =====================================================
    // REDUCED MOTION
    // =====================================================

    const reduceMotion =
        useReducedMotion();

    // =====================================================
    // BADGE INDEX
    // =====================================================

    const safeIndex =
        getSafeIndex(index);

    // =====================================================
    // BADGE INFORMATION
    // =====================================================

    const {
        badge,
        name,
        description,
    } = useMemo(
        () => getBadgeInfo(item),
        [item]
    );

    // =====================================================
    // BADGE COLOR TONE
    // =====================================================

    const tone = useMemo(
        () => getBadgeTone(safeIndex),
        [safeIndex]
    );

    // =====================================================
    // ANIMATION
    //
    // Original:
    //
    // initial y = 16
    // delay = index * 0.07
    // duration = 0.35
    // hover y = -2
    // =====================================================

    const animationDelay =
        safeIndex * 0.07;

    // =====================================================
    // DECORATIVE PROGRESS
    //
    // Original formula preserved.
    // =====================================================

    const progressWidth = Math.min(
        100,
        45 + safeIndex * 12
    );

    // =====================================================
    // INVALID BADGE
    //
    // Hooks are always called before this guard.
    // =====================================================

    if (
        !item ||
        typeof item !== "object" ||
        Array.isArray(item)
    ) {
        return null;
    }

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <motion.article
            initial={
                reduceMotion
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
            transition={{
                delay: reduceMotion
                    ? 0
                    : animationDelay,

                duration: reduceMotion
                    ? 0
                    : 0.35,
            }}
            whileHover={
                reduceMotion
                    ? undefined
                    : {
                        y: -2,
                    }
            }
            aria-label={name}
            className={`
                group
                relative
                min-w-0

                overflow-hidden

                rounded-3xl
                border

                border-slate-300/90
                bg-white

                shadow-[0_8px_28px_rgba(15,23,42,0.07)]

                transition-all
                duration-300

                hover:border-slate-400/70
                hover:bg-white

                hover:shadow-[0_14px_32px_rgba(15,23,42,0.11)]

                dark:border-gray-700/70
                dark:bg-gray-950/40

                dark:shadow-xl
                dark:shadow-black/20

                ${tone.hoverBorder}

                dark:hover:bg-gray-900/80

                motion-reduce:transform-none
                motion-reduce:transition-none
            `}
        >
            {/* =============================================
                BACKGROUND GLOW
            ============================================== */}

            <div
                aria-hidden="true"
                className={`
                    pointer-events-none

                    absolute
                    -right-16
                    -top-16

                    h-36
                    w-36

                    rounded-full

                    ${tone.glow}

                    opacity-0
                    blur-3xl

                    transition-opacity
                    duration-300

                    group-hover:opacity-100
                `}
            />

            {/* =============================================
                CARD CONTENT
            ============================================== */}

            <div
                className="
                    relative
                    z-10

                    p-4

                    sm:p-5
                "
            >
                {/* =========================================
                    IMAGE + DETAILS
                ========================================== */}

                <div
                    className="
                        flex
                        min-w-0

                        items-start
                        gap-3

                        sm:gap-4
                    "
                >
                    {/* =====================================
                        BADGE IMAGE
                    ====================================== */}

                    <ProfileBadgeImage
                        image={badge?.image}
                        name={name}
                        tone={tone}
                    />

                    {/* =====================================
                        BADGE CONTENT
                    ====================================== */}

                    <div
                        className="
                            min-w-0
                            flex-1
                        "
                    >
                        {/* =================================
                            TITLE
                        ================================== */}

                        <h4
                            className="
                                break-words

                                text-base
                                font-black

                                leading-snug

                                text-slate-900

                                transition-colors
                                duration-200

                                group-hover:text-indigo-700

                                dark:text-white
                                dark:group-hover:text-indigo-300

                                sm:text-lg
                            "
                        >
                            {name}
                        </h4>

                        {/* =================================
                            LABELS
                        ================================== */}

                        <div
                            className="
                                mt-2

                                flex
                                min-w-0

                                flex-wrap
                                items-center

                                gap-2
                            "
                        >
                            <ProfileBadgeAchievement
                                tone={tone}
                            />

                            <ProfileBadgeDate
                                awardedAt={
                                    item?.awarded_at
                                }
                            />
                        </div>

                        {/* =================================
                            DESCRIPTION
                        ================================== */}

                        <p
                            className="
                                mt-3

                                break-words

                                text-[13px]
                                font-semibold

                                leading-6

                                text-slate-700

                                dark:text-slate-300

                                sm:text-sm
                            "
                        >
                            {description}
                        </p>
                    </div>
                </div>

                {/* =========================================
                    DECORATIVE PROGRESS INDICATOR
                ========================================== */}

                <div
                    aria-hidden="true"
                    className="
                        mt-4

                        h-1.5
                        w-full

                        overflow-hidden

                        rounded-full

                        bg-slate-200

                        dark:bg-gray-800
                    "
                >
                    <div
                        className={`
                            h-full

                            rounded-full

                            ${tone.progress}

                            opacity-90

                            transition-all
                            duration-500

                            motion-reduce:transition-none
                        `}
                        style={{
                            width: `${progressWidth}%`,
                        }}
                    />
                </div>
            </div>

            {/* =============================================
                RIGHT ACCENT
            ============================================== */}

            <div
                aria-hidden="true"
                className={`
                    absolute

                    inset-y-0
                    right-0

                    w-1

                    ${tone.bg}

                    opacity-0

                    transition-opacity
                    duration-300

                    group-hover:opacity-100
                `}
            />
        </motion.article>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfileBadgeCard);
