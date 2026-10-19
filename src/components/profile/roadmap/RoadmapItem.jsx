
import React, { memo } from "react";

import { useSelector } from "react-redux";

import { formatBirthday } from "../../../utils/formatDate";

import {
    getRoadmapColorClass,
    getRoadmapInnerColorClass,
} from "../../../utils/colorUtils";

// =========================================================
// ROADMAP CONFIG
// =========================================================

const getRoadmapStyle = (type) => {
    switch (type) {
        case "learning":
            return {
                icon: "fa-solid fa-graduation-cap",
                colorName: "indigo",
                label: "Learning",
            };

        case "experience":
            return {
                icon: "fa-solid fa-laptop-code",
                colorName: "teal",
                label: "Experience",
            };

        default:
            return {
                icon: "fa-solid fa-circle-info",
                colorName: "gray",
                label: "Roadmap",
            };
    }
};

// =========================================================
// ICON COLORS
// =========================================================

const colorClassMap = {
    indigo: "text-indigo-600 dark:text-indigo-400",
    teal: "text-teal-600 dark:text-teal-400",
    yellow: "text-yellow-600 dark:text-yellow-400",
    blue: "text-blue-600 dark:text-blue-400",
    gray: "text-slate-600 dark:text-gray-400",
};

// =========================================================
// TYPE BADGES
// =========================================================

const badgeClassMap = {
    learning: `
        border-indigo-300
        bg-indigo-50
        text-indigo-700

        dark:border-indigo-400/30
        dark:bg-indigo-500/10
        dark:text-indigo-300
    `,

    experience: `
        border-teal-300
        bg-teal-50
        text-teal-700

        dark:border-teal-400/30
        dark:bg-teal-500/10
        dark:text-teal-300
    `,

    default: `
        border-slate-300
        bg-slate-100
        text-slate-700

        dark:border-gray-500/30
        dark:bg-gray-500/10
        dark:text-gray-300
    `,
};

// =========================================================
// SELECTORS
// =========================================================

const selectAuthUsername = (state) =>
    state.auth.user?.username;

// =========================================================
// SAFE COUNTER
// =========================================================

const safeCount = (value) => {
    const number = Number(value ?? 0);

    return Number.isFinite(number)
        ? Math.max(0, number)
        : 0;
};

// =========================================================
// ROADMAP ITEM
//
// Props:
//
// event:
//   Roadmap object from the backend.
//
// index:
//   Timeline animation index.
//
// isLikeLoading:
//   Loading status of like operation.
//
// onEdit:
//   Existing edit callback.
//
// onDelete:
//   Existing delete callback.
//
// onToggleLike:
//   Existing like callback.
//
// Features:
//
// - Learning / Experience
// - Started and finished dates
// - Owner-only actions
// - Authenticated likes
// - Like loading
// - Light / Dark Mode
// =========================================================

const RoadmapItem = ({
    event,
    index = 0,
    isLikeLoading = false,
    onEdit,
    onDelete,
    onToggleLike,
}) => {
    // =====================================================
    // CURRENT USER
    // =====================================================

    const currentUsername = useSelector(
        selectAuthUsername
    );

    // =====================================================
    // PERMISSIONS
    // =====================================================

    const isAuthenticated = Boolean(
        currentUsername
    );

    const isOwner = Boolean(
        currentUsername &&
        event?.profile?.username &&
        currentUsername.toLowerCase() ===
            event.profile.username.toLowerCase()
    );

    // =====================================================
    // ROADMAP TYPE
    // =====================================================

    const {
        icon: eventIcon,
        colorName,
        label,
    } = getRoadmapStyle(event?.type);

    const iconColorClass =
        colorClassMap[colorName] ||
        colorClassMap.gray;

    const badgeClass =
        badgeClassMap[event?.type] ||
        badgeClassMap.default;

    // =====================================================
    // ROADMAP DATES
    //
    // Preserves the original display behavior.
    // =====================================================

    const finishedText =
        event?.finished_at_display &&
        event.finished_at_display !==
            "Hali tugallanmagan"
            ? formatBirthday(event?.finished_at)
            : event?.finished_at_display ||
              "Hali tugallanmagan";

    const startedText = event?.started_at
        ? formatBirthday(event.started_at)
        : "Belgilanmagan";

    const dateDisplay =
        `${startedText} - ${finishedText}`;

    // =====================================================
    // LIKES
    // =====================================================

    const likeCount = safeCount(
        event?.like_count
    );

    const isLiked = Boolean(
        event?.is_liked
    );

    // =====================================================
    // LIKE HANDLER
    // =====================================================

    const handleLikeClick = () => {
        if (!isAuthenticated) {
            window.alert(
                "Roadmapni yoqtirish uchun avval tizimga kiring."
            );

            return;
        }

        if (
            isLikeLoading ||
            typeof onToggleLike !== "function"
        ) {
            return;
        }

        onToggleLike(event);
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div
            className="
                group
                relative

                mb-8
                pl-12

                last:mb-0
            "
            style={{
                animationDelay:
                    `${Math.max(0, index + 1) * 100}ms`,
            }}
        >
            {/* =====================================
                TIMELINE NODE
            ====================================== */}

            <div
                className={`
                    absolute
                    left-0
                    top-1.5

                    flex
                    h-8
                    w-8

                    items-center
                    justify-center

                    rounded-full

                    ring-4
                    ring-white

                    transition-all
                    duration-300

                    group-hover:ring-indigo-500/30

                    dark:ring-[#0b1018]
                    dark:group-hover:ring-indigo-500/40

                    ${getRoadmapColorClass(
                        colorName
                    )}
                `}
            >
                <div
                    className={`
                        h-4
                        w-4

                        rounded-full
                        border-2

                        border-white
                        dark:border-gray-900

                        ${getRoadmapInnerColorClass(
                            colorName
                        )}
                    `}
                />
            </div>

            {/* =====================================
                ROADMAP CARD
            ====================================== */}

            <article
                className="
                    relative
                    min-w-0
                    overflow-hidden

                    rounded-3xl
                    border

                    border-slate-200
                    bg-white/95

                    p-5

                    shadow-[0_12px_35px_rgba(15,23,42,0.06)]

                    transition-all
                    duration-300

                    hover:border-indigo-400/40
                    hover:bg-indigo-50/30

                    dark:border-gray-700/70
                    dark:bg-gray-950/35

                    dark:shadow-xl
                    dark:shadow-black/20

                    dark:hover:bg-gray-900/70
                "
            >
                {/* BACKGROUND GLOW */}

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none

                        absolute
                        -right-20
                        -top-20

                        h-44
                        w-44

                        rounded-full
                        bg-indigo-500/10

                        opacity-0
                        blur-3xl

                        transition-opacity
                        duration-300

                        group-hover:opacity-100
                    "
                />

                <div className="relative z-10">
                    {/* =================================
                        MAIN HEADER
                    ================================== */}

                    <div
                        className="
                            flex
                            flex-col
                            gap-4

                            sm:flex-row
                            sm:items-start
                            sm:justify-between
                        "
                    >
                        <div
                            className="
                                flex
                                min-w-0
                                flex-1

                                items-start
                                gap-4
                            "
                        >
                            {/* TYPE ICON */}

                            <div
                                className={`
                                    flex
                                    h-12
                                    w-12
                                    shrink-0

                                    items-center
                                    justify-center

                                    rounded-2xl
                                    border

                                    border-slate-200
                                    bg-slate-100

                                    dark:border-gray-700
                                    dark:bg-gray-900/80

                                    ${iconColorClass}
                                `}
                            >
                                <i
                                    aria-hidden="true"
                                    className={`
                                        ${eventIcon}
                                        text-2xl
                                    `}
                                />
                            </div>

                            {/* HEADING */}

                            <div
                                className="
                                    min-w-0
                                    flex-1
                                "
                            >
                                {/* TYPE + DATE */}

                                <div
                                    className="
                                        flex
                                        flex-wrap

                                        items-center
                                        gap-2
                                    "
                                >
                                    <span
                                        className={`
                                            inline-flex
                                            items-center

                                            rounded-full
                                            border

                                            px-3
                                            py-1

                                            text-[10px]
                                            font-black

                                            uppercase
                                            tracking-wider

                                            ${badgeClass}
                                        `}
                                    >
                                        {event?.type_display || label}
                                    </span>

                                    <span
                                        className="
                                            text-xs
                                            font-bold

                                            text-slate-500
                                            dark:text-gray-500
                                        "
                                    >
                                        {dateDisplay}
                                    </span>
                                </div>

                                {/* ROADMAP TITLE */}

                                <h4
                                    className="
                                        mt-3

                                        break-words
                                        text-xl

                                        font-black
                                        leading-tight

                                        text-slate-900

                                        transition-colors

                                        group-hover:text-indigo-700

                                        dark:text-white
                                        dark:group-hover:text-indigo-300
                                    "
                                >
                                    {event?.title || "Noma’lum roadmap"}
                                </h4>
                            </div>
                        </div>

                        {/* =================================
                            OWNER ACTIONS
                        ================================== */}

                        {isOwner && (
                            <div
                                className="
                                    flex
                                    shrink-0
                                    gap-2

                                    sm:opacity-0
                                    sm:transition-opacity
                                    sm:duration-300

                                    sm:group-hover:opacity-100
                                    sm:group-focus-within:opacity-100
                                "
                            >
                                {/* EDIT */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        onEdit?.(event)
                                    }
                                    disabled={
                                        typeof onEdit !== "function"
                                    }
                                    aria-label="Roadmapni tahrirlash"
                                    title="Tahrirlash"
                                    className="
                                        flex
                                        h-10
                                        w-10

                                        items-center
                                        justify-center

                                        rounded-2xl
                                        border

                                        border-yellow-300
                                        bg-yellow-50

                                        text-yellow-700

                                        transition

                                        hover:bg-yellow-100

                                        focus-visible:outline-none
                                        focus-visible:ring-2
                                        focus-visible:ring-yellow-500/50

                                        disabled:cursor-not-allowed
                                        disabled:opacity-40

                                        dark:border-yellow-400/20
                                        dark:bg-yellow-500/10
                                        dark:text-yellow-300

                                        dark:hover:bg-yellow-500/20
                                    "
                                >
                                    <i
                                        aria-hidden="true"
                                        className="fa-solid fa-pen-to-square"
                                    />
                                </button>

                                {/* DELETE */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        onDelete?.(event)
                                    }
                                    disabled={
                                        typeof onDelete !== "function"
                                    }
                                    aria-label="Roadmapni o‘chirish"
                                    title="O‘chirish"
                                    className="
                                        flex
                                        h-10
                                        w-10

                                        items-center
                                        justify-center

                                        rounded-2xl
                                        border

                                        border-red-300
                                        bg-red-50

                                        text-red-700

                                        transition

                                        hover:bg-red-100

                                        focus-visible:outline-none
                                        focus-visible:ring-2
                                        focus-visible:ring-red-500/50

                                        disabled:cursor-not-allowed
                                        disabled:opacity-40

                                        dark:border-red-400/20
                                        dark:bg-red-500/10
                                        dark:text-red-300

                                        dark:hover:bg-red-500/20
                                    "
                                >
                                    <i
                                        aria-hidden="true"
                                        className="fa-solid fa-trash-can"
                                    />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* =================================
                        DESCRIPTION
                    ================================== */}

                    {event?.description && (
                        <p
                            className="
                                mt-4

                                break-words

                                text-sm
                                font-medium
                                leading-7

                                text-slate-600
                                dark:text-gray-300
                            "
                        >
                            {event.description}
                        </p>
                    )}

                    {/* =================================
                        FOOTER
                    ================================== */}

                    <div
                        className="
                            mt-5

                            flex
                            flex-col
                            gap-3

                            border-t
                            border-slate-200

                            pt-4

                            dark:border-gray-700/70

                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >
                        {/* LIKE DESCRIPTION */}

                        <div
                            className="
                                text-xs
                                font-semibold

                                text-slate-500
                                dark:text-gray-500
                            "
                        >
                            {isLiked
                                ? "Siz bu roadmapni yoqtirgansiz"
                                : "Roadmap foydali bo‘lsa like bosing"}
                        </div>

                        {/* LIKE BUTTON */}

                        <button
                            type="button"
                            onClick={handleLikeClick}
                            disabled={
                                !isAuthenticated ||
                                isLikeLoading ||
                                typeof onToggleLike !==
                                    "function"
                            }
                            aria-label={
                                isLiked
                                    ? "Roadmapdan laykni olish"
                                    : "Roadmapni yoqtirish"
                            }
                            title={
                                isAuthenticated
                                    ? isLiked
                                        ? "Likedan olish"
                                        : "Yoqtirish"
                                    : "Yoqtirish uchun tizimga kiring"
                            }
                            className={`
                                group/like
                                relative

                                inline-flex

                                items-center
                                justify-center
                                gap-2

                                rounded-2xl
                                border

                                px-4
                                py-2.5

                                text-sm
                                font-black

                                transition-all

                                active:scale-95

                                disabled:cursor-not-allowed
                                disabled:opacity-60

                                ${
                                    isLiked
                                        ? `
                                            border-pink-300
                                            bg-pink-50
                                            text-pink-700

                                            shadow-lg
                                            shadow-pink-500/10

                                            dark:border-pink-400/40
                                            dark:bg-pink-500/15
                                            dark:text-pink-200
                                        `
                                        : `
                                            border-slate-300
                                            bg-slate-50
                                            text-slate-600

                                            hover:border-pink-400/30
                                            hover:bg-pink-50
                                            hover:text-pink-700

                                            dark:border-gray-700
                                            dark:bg-gray-900/70
                                            dark:text-gray-400

                                            dark:hover:border-pink-400/30
                                            dark:hover:bg-pink-500/10
                                            dark:hover:text-pink-200
                                        `
                                }
                            `}
                        >
                            {/* LIKED INDICATOR */}

                            {isLiked && (
                                <span
                                    aria-hidden="true"
                                    className="
                                        absolute
                                        -right-1
                                        -top-1

                                        h-3
                                        w-3

                                        rounded-full
                                        bg-pink-400

                                        shadow-[0_0_14px_rgba(244,114,182,0.6)]
                                    "
                                />
                            )}

                            {/* LOADING / HEART */}

                            {isLikeLoading ? (
                                <i
                                    aria-hidden="true"
                                    className="fa-solid fa-spinner fa-spin"
                                />
                            ) : (
                                <i
                                    aria-hidden="true"
                                    className={`
                                        fa-heart
                                        text-base

                                        ${
                                            isLiked
                                                ? "fa-solid text-pink-500 dark:text-pink-400"
                                                : "fa-regular text-slate-500 group-hover/like:text-pink-500 dark:text-gray-500 dark:group-hover/like:text-pink-300"
                                        }
                                    `}
                                />
                            )}

                            {/* COUNT */}

                            <span>
                                {likeCount.toLocaleString()}
                            </span>

                            {/* LABEL */}

                            <span className="hidden sm:inline">
                                {isLiked ? "Liked" : "Like"}
                            </span>
                        </button>
                    </div>
                </div>
            </article>
        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(RoadmapItem);
