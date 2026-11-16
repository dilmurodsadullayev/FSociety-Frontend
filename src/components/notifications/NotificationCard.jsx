
// src/components/notifications/NotificationCard.jsx

import React, { memo } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Clock3, Coins, UserRound } from "lucide-react";

import { timeUntilDeadline } from "../../utils/timeUntilDeadline";

import {
    formatNotificationDateTime,
    getNotificationCoins,
    getNotificationDeadline,
    getNotificationMeta,
    getNotificationText,
    getNotificationType,
    getNotificationUrl,
    getSenderUsername,
} from "../../utils/notificationUtils";

import {
    getUserAvatarUrl,
    handleUserImageError,
} from "../../utils/imageUtils";

// =========================================================
// NOTIFICATION TYPE COLORS — LIGHT / DARK MODE
// =========================================================

const TYPE_TONES = Object.freeze({
    problem:
        "!border-red-200 !bg-red-50 !text-red-700 " +
        "dark:!border-red-400/30 dark:!bg-red-500/15 " +
        "dark:!text-red-300",

    solution:
        "!border-emerald-200 !bg-emerald-50 !text-emerald-700 " +
        "dark:!border-emerald-400/30 dark:!bg-emerald-500/15 " +
        "dark:!text-emerald-300",

    coin:
        "!border-amber-200 !bg-amber-50 !text-amber-800 " +
        "dark:!border-amber-400/30 dark:!bg-amber-500/15 " +
        "dark:!text-amber-300",

    post:
        "!border-violet-200 !bg-violet-50 !text-violet-700 " +
        "dark:!border-violet-400/30 dark:!bg-violet-500/15 " +
        "dark:!text-violet-300",

    task:
        "!border-blue-200 !bg-blue-50 !text-blue-700 " +
        "dark:!border-blue-400/30 dark:!bg-blue-500/15 " +
        "dark:!text-blue-300",

    star:
        "!border-yellow-200 !bg-yellow-50 !text-yellow-800 " +
        "dark:!border-yellow-400/30 dark:!bg-yellow-500/15 " +
        "dark:!text-yellow-300",

    badge:
        "!border-orange-200 !bg-orange-50 !text-orange-700 " +
        "dark:!border-orange-400/30 dark:!bg-orange-500/15 " +
        "dark:!text-orange-300",

    info:
        "!border-indigo-200 !bg-indigo-50 !text-indigo-700 " +
        "dark:!border-indigo-400/30 dark:!bg-indigo-500/15 " +
        "dark:!text-indigo-300",
});

// =========================================================
// CARD ANIMATIONS
// =========================================================

const CARD_VARIANTS = {
    hidden: {
        opacity: 0,
        y: 12,
        scale: 0.99,
    },

    visible: {
        opacity: 1,
        y: 0,
        scale: 1,

        transition: {
            duration: 0.25,
            ease: "easeOut",
        },
    },

    exit: {
        opacity: 0,
        y: -8,
        scale: 0.985,

        transition: {
            duration: 0.18,
        },
    },
};

// =========================================================
// FULL COIN NUMBER FORMATTER
//
// 1000 → 1 000
// 1250000 → 1 250 000
//
// Never abbreviate transaction values.
// =========================================================

const formatFullCoinAmount = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return String(value ?? "");
    }

    return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 20,
    })
        .format(number)
        .replace(/,/g, " ");
};

// =========================================================
// NOTIFICATION CARD
// =========================================================

const NotificationCard = ({
    notification,
    currentUser,
    onMarkRead,
}) => {
    const reduceMotion = useReducedMotion();

    // =====================================================
    // NOTIFICATION DATA
    // =====================================================

    const isUnread = !notification?.is_read;

    const sender = notification?.sender || {};

    const senderUsername = getSenderUsername(sender);

    const senderImage = getUserAvatarUrl(sender);

    const meta = getNotificationMeta(notification);

    const Icon = meta.Icon;

    const type = getNotificationType(notification);

    const tone = TYPE_TONES[type] || TYPE_TONES.info;

    const message = getNotificationText(notification);

    const url = getNotificationUrl(
        notification,
        currentUser?.username
    );

    const coins = getNotificationCoins(notification);

    const deadline = getNotificationDeadline(notification);

    const hasCoins =
        coins !== null &&
        coins !== undefined &&
        Number(coins) > 0;

    const hasDeadline = Boolean(deadline);

    const notificationId = notification?.id;

    const hasValidId =
        notificationId !== null &&
        notificationId !== undefined;

    const canMarkRead =
        hasValidId &&
        isUnread &&
        typeof onMarkRead === "function";

    // =====================================================
    // MARK NOTIFICATION AS READ
    // =====================================================

    const handleMarkRead = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (canMarkRead) {
            onMarkRead(notificationId);
        }
    };

    // =====================================================
    // OPEN NOTIFICATION
    // =====================================================

    const handleOpen = () => {
        if (canMarkRead) {
            onMarkRead(notificationId);
        }
    };

    // =====================================================
    // CARD SURFACE
    //
    // Stronger opacity prevents the winter background
    // from reducing notification readability.
    // =====================================================

    const cardSurface = isUnread
        ? `
            border-indigo-300/90
            bg-indigo-50/[0.97]

            shadow-[0_14px_40px_rgba(30,41,100,0.13)]

            ring-1 ring-indigo-200/50

            dark:border-indigo-400/35
            dark:bg-[#101a32]/[0.96]

            dark:shadow-[0_18px_55px_rgba(0,0,0,0.38)]
            dark:ring-indigo-400/10
        `
        : `
            border-slate-200
            bg-white/[0.96]

            shadow-[0_12px_35px_rgba(15,23,42,0.09)]

            dark:border-slate-600/50
            dark:bg-[#0b1220]/[0.95]

            dark:shadow-[0_16px_45px_rgba(0,0,0,0.34)]
        `;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <motion.article
            layout={!reduceMotion}
            variants={
                reduceMotion
                    ? undefined
                    : CARD_VARIANTS
            }
            initial={
                reduceMotion
                    ? false
                    : "hidden"
            }
            animate={
                reduceMotion
                    ? undefined
                    : "visible"
            }
            exit={
                reduceMotion
                    ? undefined
                    : "exit"
            }
            aria-label={
                isUnread
                    ? "O‘qilmagan bildirishnoma"
                    : "O‘qilgan bildirishnoma"
            }
            className={`
                group relative isolate min-w-0
                overflow-hidden rounded-3xl border

                backdrop-blur-2xl
                transition-all duration-200

                ${cardSurface}

                hover:-translate-y-[1px]

                hover:border-indigo-400/70
                hover:shadow-[0_18px_45px_rgba(30,41,100,0.15)]

                dark:hover:border-indigo-400/40
                dark:hover:bg-[#111c30]/[0.98]
            `}
        >
            {/* =========================================
                CARD INNER BACKGROUND
            ========================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none absolute inset-0
                    z-0
                "
            >
                <div
                    className={`
                        absolute inset-0

                        ${
                            isUnread
                                ? `
                                    bg-gradient-to-br
                                    from-white/35
                                    via-transparent
                                    to-indigo-100/25

                                    dark:from-indigo-300/[0.045]
                                    dark:via-transparent
                                    dark:to-indigo-500/[0.035]
                                `
                                : `
                                    bg-gradient-to-br
                                    from-white/30
                                    via-transparent
                                    to-slate-100/30

                                    dark:from-white/[0.025]
                                    dark:via-transparent
                                    dark:to-slate-800/[0.08]
                                `
                        }
                    `}
                />
            </div>

            {/* =========================================
                UNREAD INDICATOR
            ========================================== */}

            {isUnread && (
                <span
                    aria-hidden="true"
                    className="
                        absolute bottom-5 left-0 top-5
                        z-20 w-[4px] rounded-r-full

                        bg-indigo-600
                        shadow-[0_0_16px_rgba(79,70,229,0.45)]

                        dark:bg-indigo-400
                        dark:shadow-[0_0_18px_rgba(129,140,248,0.55)]
                    "
                />
            )}

            {/* =========================================
                CATEGORY GLOW
            ========================================== */}

            <div
                aria-hidden="true"
                className={`
                    pointer-events-none absolute inset-0
                    z-0

                    bg-gradient-to-r
                    ${meta.glow}
                    via-transparent to-transparent

                    opacity-[0.04]
                    transition-opacity duration-300

                    group-hover:opacity-[0.10]

                    dark:opacity-[0.035]
                    dark:group-hover:opacity-[0.12]
                `}
            />

            {/* =========================================
                CARD CONTENT
            ========================================== */}

            <div
                className="
                    relative z-10 flex min-w-0
                    flex-col gap-4 p-4

                    sm:flex-row sm:items-start sm:p-5
                "
            >
                {/* =====================================
                    SENDER AVATAR
                ====================================== */}

                <div
                    className="
                        relative w-fit shrink-0
                    "
                >
                    <img
                        src={senderImage}
                        alt={`${senderUsername} avatar`}
                        onError={handleUserImageError}
                        loading="lazy"
                        className="
                            h-14 w-14 rounded-2xl border-2

                            border-white
                            bg-slate-100

                            object-cover

                            shadow-[0_5px_15px_rgba(15,23,42,0.16)]

                            dark:border-slate-600
                            dark:bg-[#161b22]
                            dark:shadow-black/30
                        "
                    />

                    {/* NOTIFICATION TYPE ICON */}

                    <div
                        aria-hidden="true"
                        className={`
                            absolute -bottom-1.5 -right-1.5

                            grid h-8 w-8 place-items-center

                            rounded-xl border-2
                            border-white shadow-md

                            backdrop-blur-xl

                            dark:border-[#0b1220]
                            dark:shadow-lg

                            ${meta.iconBox}
                            ${tone}
                        `}
                    >
                        <Icon
                            size={14}
                            strokeWidth={2.4}
                        />
                    </div>
                </div>

                {/* =====================================
                    MAIN CONTENT
                ====================================== */}

                <div className="min-w-0 flex-1">
                    <Link
                        to={url}
                        onClick={handleOpen}
                        className="
                            block min-w-0 rounded-lg
                            outline-none

                            focus-visible:ring-2
                            focus-visible:ring-indigo-500
                            focus-visible:ring-offset-2

                            dark:focus-visible:ring-offset-[#0b1220]
                        "
                    >
                        {/* =============================
                            TOP ROW
                        ============================== */}

                        <div
                            className="
                                flex min-w-0 items-start
                                justify-between gap-3
                            "
                        >
                            <div className="min-w-0 flex-1">
                                {/* TYPE / STATUS BADGES */}

                                <div
                                    className="
                                        mb-2 flex flex-wrap
                                        items-center gap-2
                                    "
                                >
                                    <span
                                        className={`
                                            inline-flex max-w-full
                                            items-center rounded-full

                                            border px-2.5 py-1

                                            font-mono text-[9px]
                                            font-extrabold uppercase
                                            tracking-[0.08em]

                                            shadow-sm

                                            ${meta.pill}
                                            ${tone}
                                        `}
                                    >
                                        {meta.label}
                                    </span>

                                    {isUnread && (
                                        <span
                                            className="
                                                rounded-full border
                                                border-indigo-300

                                                bg-indigo-100
                                                px-2.5 py-1

                                                font-mono text-[9px]
                                                font-extrabold uppercase
                                                tracking-[0.08em]

                                                text-indigo-800

                                                shadow-sm

                                                dark:border-indigo-400/35
                                                dark:bg-indigo-500/20
                                                dark:text-indigo-200
                                            "
                                        >
                                            Yangi
                                        </span>
                                    )}
                                </div>

                                {/* MESSAGE */}

                                <p
                                    className="
                                        break-words text-[14px]
                                        font-bold leading-6

                                        text-slate-900
                                        transition-colors

                                        group-hover:text-indigo-950

                                        dark:text-slate-100
                                        dark:group-hover:text-white

                                        sm:text-[15px]
                                    "
                                >
                                    {message}
                                </p>
                            </div>

                            {/* UNREAD DOT */}

                            {isUnread && (
                                <span
                                    aria-hidden="true"
                                    className="
                                        mt-2 h-2.5 w-2.5 shrink-0

                                        rounded-full bg-indigo-600

                                        shadow-[0_0_12px_rgba(79,70,229,0.45)]

                                        dark:bg-indigo-400
                                        dark:shadow-[0_0_14px_rgba(129,140,248,0.6)]
                                    "
                                />
                            )}
                        </div>

                        {/* =============================
                            METADATA
                        ============================== */}

                        <div
                            className="
                                mt-3 flex min-w-0 flex-wrap
                                items-center gap-x-4 gap-y-2

                                text-[11px] font-bold

                                text-slate-600
                                dark:text-slate-300
                            "
                        >
                            {/* SENDER USERNAME */}

                            <span
                                className="
                                    inline-flex min-w-0
                                    max-w-full items-center gap-1.5
                                "
                            >
                                <UserRound
                                    size={13}
                                    strokeWidth={2.2}
                                    className="shrink-0"
                                    aria-hidden="true"
                                />

                                <span
                                    className="
                                        min-w-0 truncate
                                    "
                                    title={`@${senderUsername}`}
                                >
                                    @{senderUsername}
                                </span>
                            </span>

                            {/* FCOIN AMOUNT */}

                            {hasCoins && (
                                <span
                                    className="
                                        inline-flex min-w-0
                                        items-center gap-1.5

                                        font-mono font-extrabold
                                        text-amber-700

                                        dark:text-amber-300
                                    "
                                >
                                    <Coins
                                        size={13}
                                        strokeWidth={2.2}
                                        className="shrink-0"
                                        aria-hidden="true"
                                    />

                                    <span
                                        className="
                                            break-all tabular-nums
                                        "
                                    >
                                        {formatFullCoinAmount(coins)} FCoin
                                    </span>
                                </span>
                            )}

                            {/* DEADLINE */}

                            {hasDeadline && (
                                <span
                                    className="
                                        inline-flex min-w-0
                                        items-center gap-1.5

                                        font-bold
                                        text-red-700

                                        dark:text-red-300
                                    "
                                >
                                    <Clock3
                                        size={13}
                                        strokeWidth={2.2}
                                        className="shrink-0"
                                        aria-hidden="true"
                                    />

                                    <span>
                                        {timeUntilDeadline(deadline)}
                                    </span>
                                </span>
                            )}
                        </div>

                        {/* =============================
                            NOTIFICATION DATE
                        ============================== */}

                        <time
                            dateTime={
                                notification?.created_at ||
                                undefined
                            }
                            className="
                                mt-3 block font-mono text-[10px]
                                font-semibold

                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            {formatNotificationDateTime(
                                notification?.created_at
                            )}
                        </time>
                    </Link>
                </div>

                {/* =====================================
                    MARK AS READ BUTTON

                    This stays outside Link to avoid
                    nested interactive controls.
                ====================================== */}

                {isUnread && (
                    <button
                        type="button"
                        onClick={handleMarkRead}
                        disabled={!canMarkRead}
                        title="O‘qildi deb belgilash"
                        aria-label="
                            Bildirishnomani o‘qildi deb belgilash
                        "
                        className="
                            inline-flex min-h-9 shrink-0
                            items-center justify-center gap-1.5
                            self-start rounded-xl border

                            border-emerald-300
                            bg-emerald-50
                            px-3 py-2

                            text-[11px] font-extrabold
                            text-emerald-800

                            shadow-sm

                            transition-all duration-200

                            hover:-translate-y-0.5
                            hover:border-emerald-400
                            hover:bg-emerald-100
                            hover:shadow-md

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-emerald-500/50

                            disabled:cursor-not-allowed
                            disabled:opacity-50

                            dark:border-emerald-400/30
                            dark:bg-emerald-500/15
                            dark:text-emerald-200

                            dark:hover:border-emerald-400/50
                            dark:hover:bg-emerald-500/25
                            dark:hover:text-emerald-100
                        "
                    >
                        <Check
                            size={14}
                            strokeWidth={2.5}
                            aria-hidden="true"
                        />

                        <span>O‘qildi</span>
                    </button>
                )}
            </div>
        </motion.article>
    );
};

export default memo(NotificationCard);
