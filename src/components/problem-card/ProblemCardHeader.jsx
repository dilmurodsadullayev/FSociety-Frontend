
import React from "react";

import {
    Clock3,
} from "lucide-react";

import UserImage from "../../assests/userImage.jpeg";

import {
    getProblemCardStatusConfig,
} from "./problemCardConfig";

import {
    cleanText,
} from "./problemCardHelpers";

// =========================================================
// FSOCIETY — PROBLEM CARD HEADER
//
// Responsibilities:
// - Author avatar
// - Full name
// - Username
// - Creation time
// - Problem status
//
// Features:
// - Light / Dark Mode
// - Responsive layout
// - Accessible status labels
// - Image fallback
// - Backend and normalized data support
//
// No API requests.
// No Redux.
// =========================================================

// =========================================================
// AUTHOR AVATAR
// =========================================================

const AuthorAvatar = React.memo(({
    src,
    name,
    statusConfig,
}) => {
    // =====================================================
    // SAFE VALUES
    // =====================================================

    const imageSrc = src || UserImage;

    const avatarName = cleanText(
        name,
        "Foydalanuvchi"
    );

    // =====================================================
    // IMAGE FALLBACK
    // =====================================================

    const handleImageError = (event) => {
        const image = event.currentTarget;

        image.onerror = null;
        image.src = UserImage;
    };

    // =====================================================
    // JSX
    // =====================================================

    return (
        <div
            className="
                relative
                h-11
                w-11
                shrink-0

                sm:h-12
                sm:w-12
            "
        >
            {/* AVATAR */}

            <img
                src={imageSrc}
                alt={`${avatarName} avatar`}
                onError={handleImageError}

                loading="lazy"
                decoding="async"

                className={`
                    h-full
                    w-full

                    rounded-2xl

                    border-2
                    object-cover

                    bg-slate-100

                    shadow-sm

                    dark:bg-slate-800

                    ${statusConfig.avatarBorder}
                `}
            />

            {/* STATUS DOT */}

            <span
                aria-hidden="true"

                className={`
                    absolute
                    -bottom-0.5
                    -right-0.5

                    h-3.5
                    w-3.5

                    rounded-full

                    border-[3px]
                    border-white

                    dark:border-[#0B1020]

                    ${statusConfig.dot}
                `}
            />
        </div>
    );
});

// =========================================================
// AUTHOR INFORMATION
// =========================================================

const AuthorInformation = React.memo(({
    author,
}) => {
    // =====================================================
    // SAFE VALUES
    // =====================================================

    const username = cleanText(
        author?.username,
        "unknown"
    );

    const fullName = cleanText(
        author?.fullName,
        username === "unknown"
            ? "Anonymous"
            : username
    );

    const createdLabel = cleanText(
        author?.createdLabel,
        "Sana noma'lum"
    );

    const createdAt = author?.createdAt;

    // =====================================================
    // VALID DATE
    // =====================================================

    const parsedDate = createdAt
        ? new Date(createdAt)
        : null;

    const validDate =
        parsedDate &&
        !Number.isNaN(parsedDate.getTime());

    const dateTime = validDate
        ? parsedDate.toISOString()
        : undefined;

    // =====================================================
    // AVOID DUPLICATE NAME
    // =====================================================

    const showUsername =
        username !== "unknown" &&
        fullName.toLowerCase() !==
            username.toLowerCase();

    // =====================================================
    // JSX
    // =====================================================

    return (
        <div
            className="
                flex
                min-w-0
                flex-1

                flex-col
                justify-center
                gap-1
            "
        >
            {/* FULL NAME */}

            <h4
                title={fullName}

                className="
                    truncate

                    font-display
                    text-[13px]
                    font-black
                    leading-5

                    text-slate-900

                    sm:text-sm

                    dark:text-white
                "
            >
                {fullName}
            </h4>

            {/* USERNAME + DATE */}

            <div
                className="
                    flex
                    min-w-0

                    flex-wrap
                    items-center
                    gap-x-2
                    gap-y-1

                    text-[10px]
                    font-medium

                    text-slate-500

                    dark:text-gray-400
                "
            >
                {/* USERNAME */}

                {showUsername && (
                    <>
                        <span
                            title={`@${username}`}

                            className="
                                max-w-[115px]
                                truncate
                                font-mono

                                sm:max-w-[150px]
                            "
                        >
                            @{username}
                        </span>

                        <span
                            aria-hidden="true"

                            className="
                                text-slate-300

                                dark:text-gray-600
                            "
                        >
                            •
                        </span>
                    </>
                )}

                {/* CREATED DATE */}

                <time
                    dateTime={dateTime}

                    title={
                        validDate
                            ? parsedDate.toLocaleString(
                                "uz-UZ"
                            )
                            : createdLabel
                    }

                    className="
                        inline-flex
                        min-w-0

                        items-center
                        gap-1
                    "
                >
                    <Clock3
                        size={12}
                        strokeWidth={1.8}
                        aria-hidden="true"

                        className="
                            shrink-0
                            text-slate-400

                            dark:text-gray-500
                        "
                    />

                    <span className="truncate">
                        {createdLabel}
                    </span>
                </time>
            </div>
        </div>
    );
});

// =========================================================
// PROBLEM STATUS BADGE
// =========================================================

const ProblemStatusBadge = React.memo(({
    config,
}) => {
    const Icon = config.Icon;

    return (
        <span
            title={config.label}

            className={`
                inline-flex

                min-h-8
                shrink-0

                items-center
                justify-center
                gap-1.5

                rounded-xl
                border

                px-2.5
                py-1.5

                font-display
                text-[9px]
                font-black

                uppercase
                tracking-[0.04em]

                sm:px-3
                sm:text-[10px]

                ${config.pill}
            `}
        >
            <Icon
                size={13}
                strokeWidth={2}
                aria-hidden="true"

                className="shrink-0"
            />

            <span>
                {config.label}
            </span>
        </span>
    );
});

// =========================================================
// MAIN HEADER
// =========================================================

const ProblemCardHeader = ({
    author = null,

    status = "pending",
    isSolved = false,

    statusConfig = null,
}) => {
    // =====================================================
    // STATUS CONFIG
    // =====================================================

    const config =
        statusConfig ||
        getProblemCardStatusConfig(
            status,
            isSolved
        );

    // =====================================================
    // AUTHOR DATA
    // =====================================================

    const authorData = author || {};

    const authorName = cleanText(
        authorData.fullName,
        "Anonymous"
    );

    // =====================================================
    // JSX
    // =====================================================

    return (
        <header
            className="
                mb-5

                flex
                w-full
                min-w-0

                flex-wrap
                items-start
                justify-between
                gap-3
            "
        >
            {/* ======================================
                AUTHOR
            ====================================== */}

            <div
                className="
                    flex
                    min-w-0
                    flex-1

                    items-center
                    gap-3
                "
            >
                <AuthorAvatar
                    src={authorData.avatar}
                    name={authorName}

                    statusConfig={config}
                />

                <AuthorInformation
                    author={authorData}
                />
            </div>

            {/* ======================================
                STATUS
            ====================================== */}

            <ProblemStatusBadge
                config={config}
            />
        </header>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(ProblemCardHeader);
