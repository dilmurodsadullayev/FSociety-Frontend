
import React, { memo } from "react";

import { Link } from "react-router-dom";

import {
    Clock,
    Eye,
    Heart,
    MessageCircle,
} from "lucide-react";

import {
    getPostTypeIcon,
} from "../../../utils/colorUtils";

import timeAgo from "../../../utils/timeAgo";

// =========================================================
// POST TYPE NAMES
// =========================================================

const POST_TYPE_NAMES = {
    TEX: "Texnologiya",
    SPO: "Sport",
    BIZ: "Biznes",
    ENT: "O‘yin-kulgi",
    OTH: "Boshqa",
};

// =========================================================
// POST TYPE COLORS
//
// Light / Dark Mode supported.
// =========================================================

const POST_TYPE_STYLES = {
    TEX: `
        border-indigo-300
        bg-indigo-50
        text-indigo-700

        dark:border-indigo-400/30
        dark:bg-indigo-500/10
        dark:text-indigo-300
    `,

    SPO: `
        border-emerald-300
        bg-emerald-50
        text-emerald-700

        dark:border-emerald-400/30
        dark:bg-emerald-500/10
        dark:text-emerald-300
    `,

    BIZ: `
        border-amber-300
        bg-amber-50
        text-amber-700

        dark:border-yellow-400/30
        dark:bg-yellow-500/10
        dark:text-yellow-300
    `,

    ENT: `
        border-pink-300
        bg-pink-50
        text-pink-700

        dark:border-pink-400/30
        dark:bg-pink-500/10
        dark:text-pink-300
    `,

    OTH: `
        border-slate-300
        bg-slate-50
        text-slate-700

        dark:border-white/15
        dark:bg-white/[0.05]
        dark:text-slate-300
    `,
};

const DEFAULT_TYPE_STYLE = `
    border-slate-300
    bg-slate-50
    text-slate-600

    dark:border-white/15
    dark:bg-white/[0.05]
    dark:text-slate-400
`;

// =========================================================
// POST TYPE HELPERS
// =========================================================

const getPostTypeDisplayName = (type) => {
    return POST_TYPE_NAMES[type] || "Noma’lum tur";
};

const getPostTypeStyle = (type) => {
    return (
        POST_TYPE_STYLES[type] ||
        DEFAULT_TYPE_STYLE
    );
};

// =========================================================
// SAFE NUMBER
// =========================================================

const safeNumber = (value) => {
    const number = Number(value);

    return Number.isFinite(number)
        ? Math.max(0, number)
        : 0;
};

// =========================================================
// STRIP HTML
//
// Produces a plain-text preview of rich post content.
//
// Content is rendered as React text, not as raw HTML.
// =========================================================

const stripHtml = (html = "") => {
    return String(html ?? "")
        .replace(
            /<style[^>]*>.*?<\/style>/gis,
            ""
        )
        .replace(
            /<script[^>]*>.*?<\/script>/gis,
            ""
        )
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, '"')
        .replace(/&#039;/gi, "'")
        .replace(/\s+/g, " ")
        .trim();
};

// =========================================================
// TRUNCATE POST DESCRIPTION
// =========================================================

const truncateText = (
    text,
    length = 190
) => {
    if (!text) {
        return "Post mazmuni hali mavjud emas.";
    }

    if (text.length <= length) {
        return text;
    }

    return `${text.slice(0, length).trim()}...`;
};

// =========================================================
// POST COUNTER
//
// Used for:
// - Likes
// - Views
// - Comments
// =========================================================

const PostCounter = memo(function PostCounter({
    icon: Icon,
    value,
    label,
    className = "",
}) {
    return (
        <span
            title={label}
            aria-label={`${label}: ${safeNumber(value)}`}
            className={`
                inline-flex
                items-center
                gap-1.5

                ${className}
            `}
        >
            <Icon
                size={16}
                aria-hidden="true"
            />

            {safeNumber(value).toLocaleString()}
        </span>
    );
});

// =========================================================
// PROFILE POST CARD
//
// Props:
//
// post:
//   Post data from Redux/API.
//
// username:
//   Profile username for the post-detail route.
//
// index:
//   Card index used for animation delay.
//
// Existing route:
// /:username/post/:slug/
//
// Features:
//
// - Type badge
// - Creation date
// - Title
// - Plain-text preview
// - Like count
// - View count
// - Comment count
// - Detail link
// - Responsive layout
// - Light / Dark Mode
// =========================================================

const ProfilePostCard = ({
    post,
    username,
    index = 0,
}) => {
    // =====================================================
    // POST DATA
    // =====================================================

    const type = post?.post_type;

    const typeLabel =
        getPostTypeDisplayName(type);

    const typeStyle =
        getPostTypeStyle(type);

    const title =
        post?.title || "Noma’lum post";

    const preview = truncateText(
        stripHtml(post?.content)
    );

    const likesCount = safeNumber(
        post?.likes_count
    );

    const viewsCount = safeNumber(
        post?.views_count
    );

    const commentsCount = safeNumber(
        post?.comments_count
    );

    // =====================================================
    // ROUTE
    //
    // Preserve the original profile post route.
    // =====================================================

    const postUrl =
        `/${username}/post/${post?.slug}/`;

    // =====================================================
    // ANIMATION
    // =====================================================

    const animationDelay =
        `${Math.max(0, index) * 80}ms`;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Link
            to={postUrl}
            style={{
                animationDelay,
            }}
            className="
                group
                relative
                block
                min-w-0
                overflow-hidden

                rounded-3xl
                border

                border-slate-200
                bg-white/95

                p-5
                shadow-sm

                transition-all
                duration-300

                hover:-translate-y-1
                hover:border-indigo-400/40
                hover:shadow-indigo-500/10

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500/50

                dark:border-white/[0.09]
                dark:bg-[#0d1117]
                dark:hover:bg-[#111827]

                motion-reduce:transform-none
            "
        >
            {/* =====================================
                DECORATIVE GLOW
            ====================================== */}

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

            {/* =====================================
                CARD CONTENT
            ====================================== */}

            <div
                className="
                    relative
                    z-10
                    min-w-0
                "
            >
                {/* =================================
                    POST TYPE AND DATE
                ================================== */}

                <div
                    className="
                        mb-4
                        flex
                        flex-wrap

                        items-center
                        gap-2
                    "
                >
                    {/* POST TYPE */}

                    <span
                        className={`
                            inline-flex
                            items-center
                            gap-2

                            rounded-full
                            border

                            px-3
                            py-1

                            text-[11px]
                            font-black

                            uppercase
                            tracking-wider

                            ${typeStyle}
                        `}
                    >
                        <i
                            aria-hidden="true"
                            className={
                                getPostTypeIcon(type)
                            }
                        />

                        {typeLabel}
                    </span>

                    {/* CREATED DATE */}

                    <span
                        className="
                            inline-flex
                            items-center
                            gap-1.5

                            text-xs
                            font-bold

                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        <Clock
                            size={14}
                            aria-hidden="true"
                        />

                        {timeAgo(post?.created_at)}
                    </span>
                </div>

                {/* =================================
                    POST TITLE
                ================================== */}

                <h4
                    className="
                        break-words

                        text-xl
                        font-black
                        leading-tight

                        text-slate-900

                        transition-colors

                        group-hover:text-indigo-700

                        dark:text-white
                        dark:group-hover:text-indigo-300

                        sm:text-2xl
                    "
                >
                    {title}
                </h4>

                {/* =================================
                    POST CONTENT PREVIEW
                ================================== */}

                <p
                    className="
                        mt-3

                        line-clamp-3
                        break-words

                        border-l-2
                        border-slate-200

                        pl-4

                        text-sm
                        font-medium
                        leading-7

                        text-slate-600

                        transition-colors

                        group-hover:border-indigo-400/60

                        dark:border-white/15
                        dark:text-slate-400
                    "
                >
                    {preview}
                </p>

                {/* =================================
                    FOOTER
                ================================== */}

                <div
                    className="
                        mt-5

                        flex
                        flex-wrap

                        items-center
                        justify-between

                        gap-4

                        border-t
                        border-slate-200

                        pt-4

                        dark:border-white/10
                    "
                >
                    {/* =============================
                        COUNTERS
                    ============================== */}

                    <div
                        className="
                            flex
                            flex-wrap

                            items-center
                            gap-3

                            text-sm
                            font-bold

                            text-slate-600
                            dark:text-slate-400
                        "
                    >
                        {/* LIKES */}

                        <PostCounter
                            icon={Heart}
                            value={likesCount}
                            label="Layklar"
                            className="
                                text-pink-700
                                dark:text-pink-300
                            "
                        />

                        {/* VIEWS */}

                        <PostCounter
                            icon={Eye}
                            value={viewsCount}
                            label="Ko‘rishlar"
                            className="
                                text-cyan-700
                                dark:text-cyan-300
                            "
                        />

                        {/* COMMENTS */}

                        <PostCounter
                            icon={MessageCircle}
                            value={commentsCount}
                            label="Sharhlar"
                            className="
                                text-emerald-700
                                dark:text-emerald-300
                            "
                        />
                    </div>

                    {/* =============================
                        READ MORE
                    ============================== */}

                    <span
                        className="
                            inline-flex
                            items-center
                            gap-2

                            rounded-2xl
                            border

                            border-indigo-300
                            bg-indigo-50

                            px-4
                            py-2

                            text-xs
                            font-black

                            text-indigo-700

                            transition-colors

                            group-hover:bg-indigo-100

                            dark:border-indigo-400/20
                            dark:bg-indigo-500/10
                            dark:text-indigo-300

                            dark:group-hover:bg-indigo-500/20
                        "
                    >
                        Batafsil o‘qish

                        <i
                            aria-hidden="true"
                            className="
                                fa-solid
                                fa-arrow-right

                                transition-transform

                                group-hover:translate-x-1
                            "
                        />
                    </span>
                </div>
            </div>
        </Link>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfilePostCard);
