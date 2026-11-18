
import React from "react";

import {
    Link,
} from "react-router-dom";

import {
    Clock3,
    Coins,
    UserRound,
} from "lucide-react";

import PublicFramedAvatar from "../../ui/PublicFramedAvatar";

import {
    timeUntilDeadline,
} from "../../../utils/timeUntilDeadline";

import {
    formatDateTime,
    getNotificationMeta,
    getNotificationText,
    getNotificationUrl,
    getSenderUsername,
} from "./notificationUtils";

// =========================================================
// NOTIFICATION ITEM
// =========================================================

const NotificationItem = ({
    notification,
    onMarkRead,
    onClose,
}) => {
    const isUnread = !notification?.is_read;

    const meta = getNotificationMeta(notification);
    const Icon = meta.Icon;

    const sender = notification?.sender || {};

    const username = getSenderUsername(sender);

    const frameUsername = typeof sender === "string"
        ? sender.trim()
        : typeof sender.username === "string"
            ? sender.username.trim()
            : "";

    const avatarUrl = sender.image || sender.avatar || sender.image_url;

    const notificationUrl = getNotificationUrl(
        notification
    );

    const message = getNotificationText(
        notification
    );

    const coins =
        notification?.metadata?.reward_amount ??
        notification?.coins ??
        notification?.amount ??
        notification?.offered_coins ??
        notification?.problem?.offered_coins;

    const deadline =
        notification?.deadline ||
        notification?.problem?.deadline;

    // =====================================================
    // CLICK
    // =====================================================

    const handleClick = () => {
        if (
            notification?.id &&
            isUnread
        ) {
            onMarkRead(notification.id);
        }

        onClose?.();
    };

    // =====================================================
    // JSX
    // =====================================================

    return (
        <Link
            to={notificationUrl}
            onClick={handleClick}
            className={`
                group
                relative
                block
                overflow-hidden

                border-b
                border-[#e5eaf3]
                last:border-b-0

                transition-colors
                duration-150

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-inset
                focus-visible:ring-indigo-500

                dark:border-white/[0.05]

                ${
                    isUnread
                        ? `
                            bg-indigo-500/[0.055]
                            hover:bg-indigo-500/[0.09]

                            dark:bg-indigo-500/[0.055]
                            dark:hover:bg-indigo-500/[0.09]
                        `
                        : `
                            bg-transparent
                            hover:bg-slate-100/80

                            dark:hover:bg-white/[0.025]
                        `
                }
            `}
        >
            {/* TYPE GLOW */}

            <span
                aria-hidden="true"
                className={`
                    pointer-events-none
                    absolute
                    inset-0

                    bg-gradient-to-r
                    ${meta.glow}
                    via-transparent
                    to-transparent

                    opacity-0
                    transition-opacity
                    duration-150

                    group-hover:opacity-100
                `}
            />

            <div
                className="
                    relative
                    z-10

                    flex
                    gap-3

                    px-4
                    py-4
                "
            >
                {/* ======================================
                    AVATAR + TYPE ICON
                ====================================== */}

                <div className="relative inline-flex h-[66px] w-[66px] shrink-0 items-center justify-center">
                    <PublicFramedAvatar
                        username={frameUsername}
                        avatarUrl={avatarUrl}
                        displayName={username}
                        className="h-11 w-11"
                        plainClassName="rounded-xl"
                        showFrame={Boolean(frameUsername)}
                        loading="lazy"
                    />

                    <span
                        className={`
                            absolute z-20
                            -bottom-1
                            -right-1

                            grid
                            h-7
                            w-7

                            place-items-center

                            rounded-lg
                            border

                            ${meta.iconBox}
                        `}
                    >
                        <Icon
                            size={13}
                            strokeWidth={2.2}
                            aria-hidden="true"
                        />
                    </span>
                </div>

                {/* ======================================
                    CONTENT
                ====================================== */}

                <div className="min-w-0 flex-1">

                    <div
                        className="
                            flex
                            items-start
                            justify-between
                            gap-3
                        "
                    >
                        <div className="min-w-0">

                            {/* TAGS */}

                            <div
                                className="
                                    mb-1.5
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-1.5
                                "
                            >
                                <span
                                    className={`
                                        rounded-full
                                        border

                                        px-2
                                        py-0.5

                                        font-mono
                                        text-[9px]
                                        font-bold
                                        uppercase
                                        tracking-[0.08em]

                                        ${meta.pill}
                                    `}
                                >
                                    {meta.label}
                                </span>

                                {isUnread && (
                                    <span
                                        className="
                                            rounded-full
                                            border
                                            border-indigo-400/20

                                            bg-indigo-500/[0.08]

                                            px-2
                                            py-0.5

                                            font-mono
                                            text-[9px]
                                            font-bold
                                            uppercase
                                            tracking-[0.08em]

                                            text-indigo-700

                                            dark:text-indigo-300
                                        "
                                    >
                                        Yangi
                                    </span>
                                )}
                            </div>

                            {/* MESSAGE */}

                            <p
                                className="
                                    line-clamp-2

                                    text-[13px]
                                    font-semibold
                                    leading-5

                                    text-slate-700

                                    transition-colors
                                    duration-150

                                    group-hover:text-slate-950

                                    dark:text-gray-300
                                    dark:group-hover:text-white
                                "
                            >
                                {message}
                            </p>
                        </div>

                        {/* UNREAD DOT */}

                        {isUnread && (
                            <span
                                aria-label="O‘qilmagan"
                                className="
                                    mt-1.5
                                    h-2
                                    w-2
                                    shrink-0

                                    rounded-full

                                    bg-indigo-500

                                    dark:bg-indigo-400
                                "
                            />
                        )}
                    </div>

                    {/* ==================================
                        META INFORMATION
                    ================================== */}

                    <div
                        className="
                            mt-2

                            flex
                            flex-wrap
                            items-center

                            gap-x-3
                            gap-y-1

                            text-[10px]
                            font-semibold

                            text-slate-500

                            dark:text-gray-500
                        "
                    >
                        {/* USER */}

                        <span
                            className="
                                inline-flex
                                items-center
                                gap-1
                            "
                        >
                            <UserRound
                                size={12}
                                strokeWidth={2}
                                aria-hidden="true"
                            />

                            @{username}
                        </span>

                        {/* FCOIN */}

                        {coins !== undefined &&
                            coins !== null &&
                            Number(coins) > 0 && (
                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        gap-1

                                        text-amber-700

                                        dark:text-amber-300
                                    "
                                >
                                    <Coins
                                        size={12}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />

                                    {coins} FCoin
                                </span>
                            )}

                        {/* DEADLINE */}

                        {deadline && (
                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-1

                                    text-red-600

                                    dark:text-red-300
                                "
                            >
                                <Clock3
                                    size={12}
                                    strokeWidth={2}
                                    aria-hidden="true"
                                />

                                {timeUntilDeadline(deadline)}
                            </span>
                        )}
                    </div>

                    {/* DATE */}

                    <div
                        className="
                            mt-2
                            text-right

                            font-mono
                            text-[9px]
                            font-medium

                            text-slate-500

                            dark:text-gray-600
                        "
                    >
                        {formatDateTime(
                            notification?.created_at
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default React.memo(NotificationItem);
