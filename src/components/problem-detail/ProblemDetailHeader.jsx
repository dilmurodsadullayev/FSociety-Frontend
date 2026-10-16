
import React from "react";
import { Link } from "react-router-dom";

import {
    ArrowLeft,
    CheckCircle2,
    Clock3,
    Code2,
    Coins,
    Eye,
    Loader2,
    MessageCircle,
    Pencil,
    Star,
    Trash2,
    XCircle,
    Zap,
} from "lucide-react";

import UserImage from "../../assests/userImage.jpeg";
import timeAgo from "../../utils/timeAgo";

import {
    getProblemDetailPriorityViewModel,
    hasProblemDetailStar,
    isProblemDetailRejected,
    isProblemDetailSolved,
    normalizeProblemDetailNumber,
    normalizeProblemDetailText,
} from "./problemDetailHelpers";

// =========================================================
// FSOCIETY — PROBLEM DETAIL HEADER
//
// Sections:
// - Breadcrumb
// - Owner actions
// - Status badges
// - Problem title
// - Programming languages
// - Author information
// - Views / solutions
//
// Light / Dark Mode
// Mobile-first
// Existing props and exports preserved
// =========================================================

// =========================================================
// CONFIG
// =========================================================

const BACKEND_URL = (
    process.env.REACT_APP_BACKEND_URL ||
    "http://127.0.0.1:8000"
).replace(/\/+$/, "");

const DEFAULT_STACK_COLOR = "#64748B";

// =========================================================
// IMAGE URL
// =========================================================

const getImageUrl = (value) => {
    if (typeof value !== "string") {
        return UserImage;
    }

    const image = value.trim();

    if (!image) {
        return UserImage;
    }

    if (/^https?:\/\//i.test(image)) {
        return image;
    }

    if (/^blob:/i.test(image)) {
        return image;
    }

    if (
        /^data:image\/(?:png|jpe?g|gif|webp|avif);base64,/i
            .test(image)
    ) {
        return image;
    }

    // Avoid unsupported URL schemes.
    if (
        /^[a-z][a-z0-9+.-]*:/i.test(image) ||
        image.startsWith("//")
    ) {
        return UserImage;
    }

    const path = image.startsWith("/")
        ? image
        : `/${image}`;

    return `${BACKEND_URL}${path}`;
};

// =========================================================
// SAFE STACK COLOR
// =========================================================

const normalizeStackColor = (value) => {
    if (typeof value !== "string") {
        return DEFAULT_STACK_COLOR;
    }

    const color = value.trim();

    if (/^#[0-9a-f]{6}$/i.test(color)) {
        return color;
    }

    if (/^#[0-9a-f]{3}$/i.test(color)) {
        const [r, g, b] = color
            .slice(1)
            .split("");

        return `#${r}${r}${g}${g}${b}${b}`;
    }

    return DEFAULT_STACK_COLOR;
};

const withAlpha = (color, alpha = "FF") => {
    const safeColor = normalizeStackColor(color);

    const safeAlpha =
        /^[0-9a-f]{2}$/i.test(alpha)
            ? alpha
            : "FF";

    return `${safeColor}${safeAlpha}`;
};

// =========================================================
// CREATED DATE
// =========================================================

const getCreatedDate = (value) => {
    if (!value) {
        return null;
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? null
        : date;
};

const getCreatedLabel = (value) => {
    if (!getCreatedDate(value)) {
        return "";
    }

    try {
        return normalizeProblemDetailText(
            timeAgo(value)
        );
    } catch {
        return "";
    }
};

// =========================================================
// STACK TAG
//
// Named export preserved because other components
// may import ProblemDetailStackTag.
// =========================================================

export const ProblemDetailStackTag = React.memo(({
    item,
    type = "language",
}) => {
    if (!item) {
        return null;
    }

    const source =
        typeof item === "string"
            ? { name: item }
            : item;

    if (
        !source ||
        typeof source !== "object" ||
        Array.isArray(source)
    ) {
        return null;
    }

    const name = normalizeProblemDetailText(
        source.name
    );

    if (!name) {
        return null;
    }

    const color = normalizeStackColor(
        source.color
    );

    const category = normalizeProblemDetailText(
        source.category_display ??
        source.category
    );

    return (
        <span
            title={name}
            style={{
                borderColor: withAlpha(color, "50"),
            }}
            className="
                inline-flex
                min-h-8
                max-w-full
                min-w-0

                items-center
                gap-2

                rounded-full
                border

                bg-slate-50

                px-3
                py-1.5

                text-[11px]
                font-bold
                leading-5

                text-slate-700

                transition-colors

                hover:bg-white

                dark:bg-white/[0.04]
                dark:text-gray-200
                dark:hover:bg-white/[0.07]
            "
        >
            {/* COLOR INDICATOR */}

            <span
                aria-hidden="true"
                style={{
                    backgroundColor: color,
                }}
                className="
                    h-2.5
                    w-2.5
                    shrink-0

                    rounded-full
                "
            />

            {/* NAME */}

            <span
                className="
                    min-w-0
                    truncate
                "
            >
                {name}
            </span>

            {/* TECHNOLOGY CATEGORY */}

            {type === "technology" &&
                category && (
                    <span
                        className="
                            hidden

                            rounded-full
                            border
                            border-slate-200

                            bg-slate-100

                            px-1.5
                            py-0.5

                            font-mono
                            text-[9px]
                            font-semibold

                            text-slate-500

                            sm:inline-flex

                            dark:border-white/[0.09]
                            dark:bg-white/[0.05]
                            dark:text-gray-400
                        "
                    >
                        {category}
                    </span>
                )}
        </span>
    );
});

// =========================================================
// STATUS CONFIG
// =========================================================

const STATUS_CONFIG = {
    pending: {
        label: "Yechilmagan",
        Icon: Clock3,
        className: `
            border-amber-300
            bg-amber-50
            text-amber-800

            dark:border-amber-400/25
            dark:bg-amber-400/[0.09]
            dark:text-amber-300
        `,
    },

    solved: {
        label: "Yechilgan",
        Icon: CheckCircle2,
        className: `
            border-emerald-300
            bg-emerald-50
            text-emerald-800

            dark:border-emerald-400/25
            dark:bg-emerald-400/[0.09]
            dark:text-emerald-300
        `,
    },

    rejected: {
        label: "Rad etilgan",
        Icon: XCircle,
        className: `
            border-rose-300
            bg-rose-50
            text-rose-800

            dark:border-rose-400/25
            dark:bg-rose-400/[0.09]
            dark:text-rose-300
        `,
    },
};

// =========================================================
// STATUS BADGE
// =========================================================

const StatusBadge = React.memo(({
    config,
}) => {
    const Icon = config.Icon;

    return (
        <span
            className={`
                inline-flex
                min-h-8
                max-w-full

                items-center
                gap-1.5

                rounded-full
                border

                px-3
                py-1.5

                text-[10px]
                font-black
                uppercase
                tracking-[0.06em]

                ${config.className}
            `}
        >
            <Icon
                size={14}
                strokeWidth={2}
                aria-hidden="true"
                className="shrink-0"
            />

            {config.label}
        </span>
    );
});

// =========================================================
// OWNER ACTIONS
// =========================================================

const OwnerActions = React.memo(({
    onEdit,
    onDelete,
    isDeleting = false,
}) => {
    return (
        <div
            role="group"
            aria-label="Muammoni boshqarish"
            className="
                inline-flex
                max-w-full

                flex-wrap
                items-center
                gap-1.5

                rounded-xl
                border
                border-slate-200

                bg-white

                p-1.5

                shadow-sm

                dark:border-white/[0.10]
                dark:bg-white/[0.04]
                dark:shadow-black/10
            "
        >
            {/* EDIT */}

            <button
                type="button"
                onClick={onEdit}
                disabled={
                    isDeleting ||
                    typeof onEdit !== "function"
                }
                aria-label="Muammoni tahrirlash"
                className="
                    inline-flex
                    min-h-10

                    items-center
                    justify-center
                    gap-2

                    rounded-lg

                    px-3
                    py-2

                    text-xs
                    font-bold

                    text-indigo-700

                    transition-colors

                    hover:bg-indigo-50

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-indigo-500

                    disabled:cursor-not-allowed
                    disabled:opacity-40

                    dark:text-indigo-300
                    dark:hover:bg-indigo-400/[0.10]
                "
            >
                <Pencil
                    size={15}
                    strokeWidth={1.9}
                    aria-hidden="true"
                />

                Tahrirlash
            </button>

            {/* DELETE */}

            <button
                type="button"
                onClick={onDelete}
                disabled={
                    isDeleting ||
                    typeof onDelete !== "function"
                }
                aria-label="Muammoni o‘chirish"
                aria-busy={isDeleting}
                className="
                    inline-flex
                    min-h-10

                    items-center
                    justify-center
                    gap-2

                    rounded-lg

                    px-3
                    py-2

                    text-xs
                    font-bold

                    text-rose-700

                    transition-colors

                    hover:bg-rose-50

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-rose-500

                    disabled:cursor-not-allowed
                    disabled:opacity-40

                    dark:text-rose-300
                    dark:hover:bg-rose-400/[0.10]
                "
            >
                {isDeleting ? (
                    <Loader2
                        size={15}
                        aria-hidden="true"
                        className="
                            animate-spin
                            motion-reduce:animate-none
                        "
                    />
                ) : (
                    <Trash2
                        size={15}
                        strokeWidth={1.9}
                        aria-hidden="true"
                    />
                )}

                {isDeleting
                    ? "O‘chirilmoqda..."
                    : "O‘chirish"}
            </button>
        </div>
    );
});

// =========================================================
// AUTHOR AVATAR
// =========================================================

const AuthorAvatar = React.memo(({
    src,
    name,
}) => {
    const handleError = (event) => {
        const image = event.currentTarget;

        image.onerror = null;
        image.src = UserImage;
    };

    return (
        <img
            src={src || UserImage}
            alt={`${name} avatar`}
            onError={handleError}
            loading="lazy"
            decoding="async"
            className="
                h-12
                w-12
                shrink-0

                rounded-2xl
                border-2
                border-white

                bg-slate-100

                object-cover

                shadow-sm

                sm:h-14
                sm:w-14

                dark:border-white/[0.15]
                dark:bg-slate-800
            "
        />
    );
});

// =========================================================
// MAIN HEADER
// =========================================================

const ProblemDetailHeader = ({
    problemDetail,

    problemLanguages = [],
    responseCount = 0,

    isOwner = false,
    isDeleting = false,

    onEdit,
    onDelete,
}) => {
    // =====================================================
    // STATUS
    // =====================================================

    const rejected = isProblemDetailRejected(
        problemDetail
    );

    const solved = isProblemDetailSolved(
        problemDetail
    );

    const statusConfig = rejected
        ? STATUS_CONFIG.rejected
        : solved
            ? STATUS_CONFIG.solved
            : STATUS_CONFIG.pending;

    // =====================================================
    // STAR / PRIORITY
    // =====================================================

    const starredByUser = hasProblemDetailStar(
        problemDetail
    );

    const {
        isUrgent,
        offeredCoins,
    } = getProblemDetailPriorityViewModel(
        problemDetail
    );

    // =====================================================
    // TITLE / ID
    // =====================================================

    const problemTitle =
        normalizeProblemDetailText(
            problemDetail?.problem,
            "Nomsiz muammo"
        );

    const problemId =
        problemDetail?.id ?? "unknown";

    // =====================================================
    // STATISTICS
    // =====================================================

    const views = Math.floor(
        normalizeProblemDetailNumber(
            problemDetail?.total_views
        )
    );

    const solutions = Math.floor(
        normalizeProblemDetailNumber(
            responseCount
        )
    );

    const formatNumber = (number) =>
        number.toLocaleString("uz-UZ");

    // =====================================================
    // AUTHOR
    // =====================================================

    const user = problemDetail?.user || {};

    const username =
        normalizeProblemDetailText(
            user.username
        );

    const firstName =
        normalizeProblemDetailText(
            user.first_name
        );

    const lastName =
        normalizeProblemDetailText(
            user.last_name
        );

    const fullName =
        `${firstName} ${lastName}`.trim();

    const displayName =
        fullName ||
        username ||
        "Noma’lum foydalanuvchi";

    const avatar = getImageUrl(
        user.image
    );

    // =====================================================
    // DATE
    // =====================================================

    const createdAt =
        problemDetail?.created_at;

    const createdDate =
        getCreatedDate(createdAt);

    const createdLabel =
        getCreatedLabel(createdAt);

    // =====================================================
    // LANGUAGES
    // =====================================================

    const languages = Array.isArray(
        problemLanguages
    )
        ? problemLanguages
        : [];

    // =====================================================
    // JSX
    // =====================================================

    return (
        <header
            className="
                w-full
                min-w-0
            "
        >
            {/* ======================================
                TOP BAR
            ====================================== */}

            <div
                className="
                    mb-6

                    flex
                    min-w-0

                    flex-col
                    gap-4

                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
                {/* BREADCRUMB */}

                <div
                    className="
                        flex
                        min-w-0

                        flex-wrap
                        items-center
                        gap-2
                    "
                >
                    <Link
                        to="/problems"
                        aria-label="Muammolar ro‘yxatiga qaytish"
                        className="
                            inline-flex
                            min-h-9

                            items-center
                            gap-1.5

                            rounded-lg

                            px-2
                            py-1.5

                            text-[11px]
                            font-bold

                            text-slate-600

                            transition-colors

                            hover:bg-slate-100
                            hover:text-cyan-700

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-cyan-500

                            dark:text-gray-400
                            dark:hover:bg-white/[0.06]
                            dark:hover:text-cyan-300
                        "
                    >
                        <ArrowLeft
                            size={15}
                            aria-hidden="true"
                        />

                        Muammolar
                    </Link>

                    <span
                        aria-hidden="true"
                        className="
                            text-slate-300
                            dark:text-gray-600
                        "
                    >
                        /
                    </span>

                    <span
                        title={`Muammo ID: ${problemId}`}
                        className="
                            min-w-0
                            max-w-[180px]

                            truncate

                            font-mono
                            text-[10px]
                            font-bold

                            text-cyan-700

                            sm:max-w-[260px]

                            dark:text-cyan-400
                        "
                    >
                        fsociety://problem/{problemId}
                    </span>
                </div>

                {/* OWNER ACTIONS */}

                {isOwner && (
                    <OwnerActions
                        onEdit={onEdit}
                        onDelete={onDelete}
                        isDeleting={isDeleting}
                    />
                )}
            </div>

            {/* ======================================
                PROBLEM TITLE
            ====================================== */}

            <div
                className="
                    mb-5
                    min-w-0
                "
            >
                <h1
                    title={problemTitle}
                    className="
                        break-words
                        [overflow-wrap:anywhere]

                        font-display
                        text-[27px]
                        font-black
                        leading-[1.25]
                        tracking-tight

                        text-slate-950

                        sm:text-3xl

                        lg:text-4xl

                        2xl:text-[42px]

                        dark:text-white
                    "
                >
                    {problemTitle}
                </h1>
            </div>

            {/* ======================================
                STATUS / META BADGES
            ====================================== */}

            <div
                aria-label="Muammo holati"
                className="
                    mb-5

                    flex
                    min-w-0

                    flex-wrap
                    items-center
                    gap-2
                "
            >
                {/* STATUS */}

                <StatusBadge
                    config={statusConfig}
                />

                {/* STARRED */}

                {starredByUser && (
                    <span
                        className="
                            inline-flex
                            min-h-8

                            items-center
                            gap-1.5

                            rounded-full
                            border
                            border-amber-300

                            bg-amber-50

                            px-3
                            py-1.5

                            text-[10px]
                            font-black

                            text-amber-800

                            dark:border-amber-400/25
                            dark:bg-amber-400/[0.09]
                            dark:text-amber-300
                        "
                    >
                        <Star
                            size={13}
                            aria-hidden="true"
                            className="
                                fill-current
                            "
                        />

                        Star berilgan
                    </span>
                )}

                {/* URGENT */}

                {isUrgent && (
                    <span
                        className="
                            inline-flex
                            min-h-8

                            items-center
                            gap-1.5

                            rounded-full
                            border
                            border-orange-300

                            bg-orange-50

                            px-3
                            py-1.5

                            text-[10px]
                            font-black

                            text-orange-800

                            dark:border-orange-400/25
                            dark:bg-orange-400/[0.09]
                            dark:text-orange-300
                        "
                    >
                        <Zap
                            size={13}
                            aria-hidden="true"
                        />

                        Tezkor
                    </span>
                )}

                {/* FCOIN */}

                {offeredCoins > 0 && (
                    <span
                        className="
                            inline-flex
                            min-h-8

                            items-center
                            gap-1.5

                            rounded-full
                            border
                            border-yellow-300

                            bg-yellow-50

                            px-3
                            py-1.5

                            text-[10px]
                            font-black

                            text-yellow-800

                            dark:border-yellow-400/25
                            dark:bg-yellow-400/[0.09]
                            dark:text-yellow-300
                        "
                    >
                        <Coins
                            size={13}
                            aria-hidden="true"
                        />

                        {formatNumber(offeredCoins)} FCoin
                    </span>
                )}
            </div>

            {/* ======================================
                PROGRAMMING LANGUAGES
            ====================================== */}

            <div
                className="
                    mb-6

                    flex
                    min-w-0

                    flex-wrap
                    items-center
                    gap-2
                "
            >
                <span
                    className="
                        inline-flex
                        min-h-8

                        items-center
                        gap-1.5

                        rounded-full
                        border
                        border-slate-200

                        bg-slate-100

                        px-3
                        py-1.5

                        font-mono
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.08em]

                        text-slate-600

                        dark:border-white/[0.10]
                        dark:bg-white/[0.04]
                        dark:text-gray-400
                    "
                >
                    <Code2
                        size={13}
                        aria-hidden="true"
                    />

                    Til
                </span>

                {languages.length > 0 ? (
                    languages.map((language, index) => (
                        <ProblemDetailStackTag
                            key={
                                `language-${
                                    language?.id ??
                                    language?.name ??
                                    index
                                }-${index}`
                            }
                            item={language}
                            type="language"
                        />
                    ))
                ) : (
                    <span
                        className="
                            text-xs
                            font-medium

                            text-slate-500

                            dark:text-gray-500
                        "
                    >
                        Til belgilanmagan
                    </span>
                )}
            </div>

            {/* ======================================
                AUTHOR / STATS CARD
            ====================================== */}

            <div
                className="
                    flex
                    w-full
                    min-w-0

                    flex-col
                    gap-4

                    rounded-2xl

                    border
                    border-slate-200

                    bg-slate-50/90

                    p-4

                    sm:flex-row
                    sm:items-center
                    sm:justify-between

                    dark:border-white/[0.09]
                    dark:bg-white/[0.035]
                "
            >
                {/* AUTHOR */}

                <div
                    className="
                        flex
                        min-w-0

                        items-center
                        gap-3
                    "
                >
                    <AuthorAvatar
                        src={avatar}
                        name={displayName}
                    />

                    <div
                        className="
                            min-w-0
                            flex-1
                        "
                    >
                        {/* DISPLAY NAME */}

                        {username ? (
                            <Link
                                to={`/${encodeURIComponent(
                                    username
                                )}/profile/`}
                                title={`@${username}`}
                                className="
                                    block
                                    max-w-full

                                    truncate

                                    font-display
                                    text-sm
                                    font-black

                                    text-slate-900

                                    transition-colors

                                    hover:text-cyan-700

                                    focus-visible:outline-none
                                    focus-visible:underline

                                    dark:text-white
                                    dark:hover:text-cyan-300
                                "
                            >
                                @{username}
                            </Link>
                        ) : (
                            <p
                                className="
                                    truncate

                                    font-display
                                    text-sm
                                    font-black

                                    text-slate-900

                                    dark:text-white
                                "
                            >
                                {displayName}
                            </p>
                        )}

                        {/* FULL NAME */}

                        {fullName && username && (
                            <p
                                className="
                                    mt-0.5
                                    truncate

                                    text-[11px]
                                    font-medium

                                    text-slate-500

                                    dark:text-gray-400
                                "
                            >
                                {fullName}
                            </p>
                        )}

                        {/* CREATION DATE */}

                        {createdLabel && (
                            <time
                                dateTime={
                                    createdDate?.toISOString()
                                }
                                title={
                                    createdDate?.toLocaleString(
                                        "uz-UZ"
                                    )
                                }
                                className="
                                    mt-1

                                    inline-flex
                                    items-center
                                    gap-1.5

                                    text-[11px]
                                    font-medium

                                    text-slate-500

                                    dark:text-gray-400
                                "
                            >
                                <Clock3
                                    size={12}
                                    aria-hidden="true"
                                />

                                {createdLabel} so‘ralgan
                            </time>
                        )}
                    </div>
                </div>

                {/* STATISTICS */}

                <div
                    role="group"
                    aria-label="Muammo statistikasi"
                    className="
                        flex
                        min-w-0

                        flex-wrap
                        items-center
                        gap-2

                        sm:justify-end
                    "
                >
                    {/* VIEWS */}

                    <span
                        title="Ko‘rishlar"
                        className="
                            inline-flex
                            min-h-9

                            items-center
                            gap-2

                            rounded-xl

                            border
                            border-slate-200

                            bg-white

                            px-3
                            py-2

                            text-xs
                            font-bold
                            tabular-nums

                            text-slate-600

                            dark:border-white/[0.09]
                            dark:bg-white/[0.04]
                            dark:text-gray-300
                        "
                    >
                        <Eye
                            size={15}
                            aria-hidden="true"
                            className="
                                text-cyan-600
                                dark:text-cyan-400
                            "
                        />

                        {formatNumber(views)}

                        <span className="sr-only">
                            {" "}marta ko‘rilgan
                        </span>
                    </span>

                    {/* SOLUTIONS */}

                    <span
                        title="Yechimlar"
                        className="
                            inline-flex
                            min-h-9

                            items-center
                            gap-2

                            rounded-xl

                            border
                            border-slate-200

                            bg-white

                            px-3
                            py-2

                            text-xs
                            font-bold
                            tabular-nums

                            text-slate-600

                            dark:border-white/[0.09]
                            dark:bg-white/[0.04]
                            dark:text-gray-300
                        "
                    >
                        <MessageCircle
                            size={15}
                            aria-hidden="true"
                            className="
                                text-indigo-600
                                dark:text-indigo-400
                            "
                        />

                        {formatNumber(solutions)}

                        <span className="sr-only">
                            {" "}ta yechim
                        </span>
                    </span>
                </div>
            </div>
        </header>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(ProblemDetailHeader);
