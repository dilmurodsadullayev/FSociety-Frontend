
import React, {
    useEffect,
    useState,
} from "react";

import { Link } from "react-router-dom";

import {
    BadgeCheck,
    Eye,
    ShieldAlert,
    UserRound,
} from "lucide-react";

import {
    getCommentImageUrl,
    getCommentTimeAgo,
    getCommentUsername,
    handleCommentImageError,
    isAdminLikedComment,
    isRestrictedComment,
} from "./commentUtils";

// =========================================================
// STATUS CONFIG
// =========================================================

const STATUS_CONFIG = {
    visible: {
        label: "Visible",
        className: `
            border-emerald-400/25
            bg-emerald-500/[0.08]
            text-emerald-700
            dark:text-emerald-300
        `,
    },

    hidden: {
        label: "Hidden",
        className: `
            border-red-400/25
            bg-red-500/[0.08]
            text-red-700
            dark:text-red-300
        `,
    },

    flagged: {
        label: "Flagged",
        className: `
            border-amber-400/25
            bg-amber-500/[0.08]
            text-amber-800
            dark:text-amber-300
        `,
    },
};

// =========================================================
// STATUS BADGE
// =========================================================

const StatusBadge = ({ status }) => {
    if (!status) return null;

    const normalized = String(status).toLowerCase();

    const config = STATUS_CONFIG[normalized] || {
        label: String(status),
        className: `
            border-slate-300
            bg-slate-100
            text-slate-600
            dark:border-white/10
            dark:bg-white/[0.04]
            dark:text-gray-400
        `,
    };

    return (
        <span
            className={`
                inline-flex
                max-w-full
                items-center
                rounded-full
                border
                px-2.5
                py-1
                text-[9px]
                font-bold
                uppercase
                tracking-wide

                ${config.className}
            `}
        >
            <span className="truncate">
                {config.label}
            </span>
        </span>
    );
};

// =========================================================
// ADMIN LIKED BADGE
// =========================================================

const AdminLikedBadge = () => {
    return (
        <span
            className="
                inline-flex
                max-w-full
                items-center
                gap-1.5
                rounded-full
                border
                border-amber-400/30
                bg-amber-500/[0.10]
                px-2.5
                py-1
                text-[9px]
                font-bold
                uppercase
                tracking-wide
                text-amber-800

                dark:text-amber-300
            "
        >
            <BadgeCheck
                size={13}
                strokeWidth={2}
                aria-hidden="true"
                className="shrink-0"
            />

            Admin yoqtirdi
        </span>
    );
};

// =========================================================
// COMMENT ITEM
// =========================================================

const CommentItem = ({ comment }) => {
    const [revealed, setRevealed] = useState(false);

    // =====================================================
    // DATA
    // =====================================================

    const username = getCommentUsername(comment);

    const imageUrl = getCommentImageUrl(comment);

    const profileUrl = username !== "anonymous"
        ? `/${encodeURIComponent(username)}/profile`
        : "/users";

    const isAdminLiked = isAdminLikedComment(
        comment?.is_admin_liked
    );

    const restricted = isRestrictedComment(
        comment?.status
    );

    const showSpoiler = restricted && !revealed;

    // Reset reveal state when the comment changes.
    useEffect(() => {
        setRevealed(false);
    }, [comment?.id, comment?.status]);

    // =====================================================
    // JSX
    // =====================================================

    return (
        <article
            className={`
                group/comment
                relative
                min-w-0
                overflow-hidden
                rounded-2xl
                border
                p-4

                transition-colors
                duration-150

                sm:rounded-3xl
                sm:p-5

                ${
                    isAdminLiked
                        ? `
                            border-amber-400/35
                            bg-gradient-to-br
                            from-amber-50/90
                            via-white
                            to-[#fff9e9]

                            hover:border-amber-400/55

                            dark:border-amber-400/30
                            dark:from-[#14151b]
                            dark:via-[#10141d]
                            dark:to-[#231c10]
                        `
                        : `
                            border-[#dce5f0]
                            bg-white

                            hover:border-indigo-400/40
                            hover:bg-[#fbfcff]

                            dark:border-white/[0.07]
                            dark:bg-[#10151f]

                            dark:hover:border-indigo-400/25
                            dark:hover:bg-[#121824]
                        `
                }
            `}
        >
            {/* SUBTLE ACCENT */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    -right-16
                    -top-16
                    h-36
                    w-36
                    rounded-full
                    bg-indigo-500/[0.045]
                    opacity-0
                    transition-opacity
                    duration-150

                    group-hover/comment:opacity-100

                    dark:bg-indigo-500/[0.06]
                "
            />

            <div
                className="
                    relative
                    z-10
                    flex
                    min-w-0
                    items-start
                    gap-3

                    sm:gap-4
                "
            >
                {/* ==================================
                    AVATAR
                ================================== */}

                <Link
                    to={profileUrl}
                    aria-label={`${username} profilini ko‘rish`}
                    className="
                        shrink-0
                        rounded-full
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-indigo-500
                    "
                >
                    <span className="relative block">
                        <img
                            src={imageUrl}
                            alt={`${username} avatar`}
                            onError={handleCommentImageError}
                            loading="lazy"
                            decoding="async"
                            className={`
                                h-10
                                w-10
                                rounded-full
                                border-2
                                bg-slate-100
                                object-cover

                                sm:h-12
                                sm:w-12

                                dark:bg-[#161b22]

                                ${
                                    isAdminLiked
                                        ? "border-amber-400/70"
                                        : "border-[#dce5f0] dark:border-white/10"
                                }
                            `}
                        />

                        {isAdminLiked && (
                            <span
                                aria-label="Admin yoqtirgan izoh"
                                className="
                                    absolute
                                    -bottom-1
                                    -right-1

                                    grid
                                    h-5
                                    w-5
                                    place-items-center

                                    rounded-full
                                    border-2
                                    border-white
                                    bg-amber-400
                                    text-amber-950

                                    dark:border-[#10151f]
                                "
                            >
                                <BadgeCheck
                                    size={12}
                                    aria-hidden="true"
                                />
                            </span>
                        )}
                    </span>
                </Link>

                {/* ==================================
                    COMMENT CONTENT
                ================================== */}

                <div className="min-w-0 flex-1">

                    {/* HEADER */}

                    <div
                        className="
                            flex
                            min-w-0
                            flex-col
                            gap-2

                            sm:flex-row
                            sm:items-start
                            sm:justify-between
                        "
                    >
                        {/* USER INFORMATION */}

                        <div className="min-w-0 flex-1">
                            <Link
                                to={profileUrl}
                                className="
                                    inline-flex
                                    max-w-full
                                    items-center
                                    gap-1.5
                                    rounded-md

                                    text-[13px]
                                    font-black
                                    text-slate-900

                                    transition-colors
                                    duration-150

                                    hover:text-indigo-700

                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-indigo-500

                                    sm:text-sm

                                    dark:text-white
                                    dark:hover:text-indigo-300
                                "
                            >
                                <span
                                    className="
                                        min-w-0
                                        truncate
                                    "
                                >
                                    {username}
                                </span>

                                <UserRound
                                    size={13}
                                    strokeWidth={2}
                                    aria-hidden="true"
                                    className="
                                        shrink-0
                                        text-slate-400

                                        dark:text-gray-600
                                    "
                                />
                            </Link>

                            <p
                                className="
                                    mt-1
                                    text-[10px]
                                    font-medium
                                    text-slate-500

                                    dark:text-gray-500
                                "
                            >
                                {getCommentTimeAgo(
                                    comment?.created_at
                                )}
                            </p>
                        </div>

                        {/* BADGES */}

                        <div
                            className="
                                flex
                                min-w-0
                                flex-wrap
                                items-center
                                gap-1.5
                            "
                        >
                            <StatusBadge
                                status={comment?.status}
                            />

                            {isAdminLiked && (
                                <AdminLikedBadge />
                            )}
                        </div>
                    </div>

                    {/* ==================================
                        RESTRICTED COMMENT
                    ================================== */}

                    {showSpoiler ? (
                        <div
                            className="
                                mt-4
                                rounded-2xl
                                border
                                border-red-400/25
                                bg-red-500/[0.055]
                                p-3

                                sm:p-4

                                dark:bg-red-500/[0.075]
                            "
                        >
                            <div
                                className="
                                    flex
                                    min-w-0
                                    items-start
                                    gap-3
                                "
                            >
                                <div
                                    className="
                                        grid
                                        h-9
                                        w-9
                                        shrink-0
                                        place-items-center
                                        rounded-xl
                                        bg-red-500/10
                                        text-red-600

                                        dark:text-red-300
                                    "
                                >
                                    <ShieldAlert
                                        size={18}
                                        aria-hidden="true"
                                    />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p
                                        className="
                                            text-[12px]
                                            font-bold
                                            leading-5
                                            text-red-800

                                            dark:text-red-200
                                        "
                                    >
                                        Bu sharh nomaqbul yoki
                                        yashirilgan deb belgilangan.
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-[11px]
                                            leading-5
                                            text-red-700/80

                                            dark:text-red-300/75
                                        "
                                    >
                                        Ko‘rishni xohlasangiz,
                                        quyidagi tugmani bosing.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setRevealed(true)
                                        }
                                        className="
                                            mt-3
                                            inline-flex
                                            min-h-9
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-xl
                                            border
                                            border-red-400/25
                                            bg-red-500/10
                                            px-3
                                            py-2
                                            text-[11px]
                                            font-bold
                                            text-red-700

                                            transition-colors
                                            duration-150

                                            hover:bg-red-500/20

                                            focus-visible:outline-none
                                            focus-visible:ring-2
                                            focus-visible:ring-red-500

                                            dark:text-red-200
                                        "
                                    >
                                        <Eye
                                            size={14}
                                            aria-hidden="true"
                                        />

                                        Sharhni ko‘rsatish
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* COMMENT MESSAGE */}

                            <p
                                className="
                                    mt-3
                                    min-w-0
                                    whitespace-pre-line
                                    break-words
                                    [overflow-wrap:anywhere]

                                    text-[13px]
                                    font-medium
                                    leading-6
                                    text-slate-700

                                    sm:text-sm
                                    sm:leading-7

                                    dark:text-gray-300
                                "
                            >
                                {comment?.message ||
                                    "Izoh matni mavjud emas."}
                            </p>

                            {/* ADMIN LIKE INFO */}

                            {isAdminLiked && (
                                <div
                                    className="
                                        mt-4
                                        inline-flex
                                        max-w-full
                                        items-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-amber-400/25
                                        bg-amber-500/[0.08]
                                        px-3
                                        py-2
                                        text-[10px]
                                        font-bold
                                        leading-5
                                        text-amber-800

                                        dark:text-amber-200
                                    "
                                >
                                    <BadgeCheck
                                        size={15}
                                        aria-hidden="true"
                                        className="shrink-0"
                                    />

                                    Bu izoh admin tomonidan yoqtirilgan
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </article>
    );
};

export default React.memo(CommentItem);
