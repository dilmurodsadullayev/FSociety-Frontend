
import React, { useState } from "react";

import { Link } from "react-router-dom";

import {
    ChevronDown,
    ChevronUp,
    Clock3,
    Edit3,
    Trash2,
} from "lucide-react";

// =========================================================
// EXISTING UTILITIES
// =========================================================

import timeAgo from "../../utils/timeAgo";

import {
    getUserAvatarUrl,
    handleUserImageError,
} from "../../utils/imageUtils";

import {
    siteToast,
} from "../ui/AuthToast";

// =========================================================
// DISCUSSION HELPERS
// =========================================================

import {
    COMMENT_PREVIEW_LIMIT,
    getCommentAuthorName,
    getCommentPreview,
    isCommentAuthor,
} from "./discussionHelpers";

// =========================================================
// FSOCIETY — PROJECT COMMENT CARD
//
// Features:
// - Dark / Light Mode
// - Responsive design
// - Author profile
// - Author avatar fallback
// - Relative creation date
// - $tag highlighting
// - 320-character preview
// - Expand / collapse
// - Edit / delete actions
// - UI author permissions
//
// No direct API or Redux calls.
// =========================================================

// =========================================================
// COMMENT BODY
//
// Preserves the original $tag syntax.
// Examples:
// $react
// $django
// $frontend
// $api_developer
// =========================================================

const COMMENT_TAG_REGEX = /(\$[a-zA-Z0-9_-]+)/g;

const EXACT_COMMENT_TAG_REGEX = /^\$[a-zA-Z0-9_-]+$/;

export const CommentBody = React.memo(({
    text = "",
}) => {
    const parts = String(text ?? "").split(
        COMMENT_TAG_REGEX
    );

    const handleTagClick = (event, tag) => {
        event.stopPropagation();

        siteToast.info(
            `${tag} belgisi tanlandi.`,
            {
                title: "Project tag",
                duration: 2200,
            }
        );
    };

    return (
        <>
            {parts.map((part, index) => {
                if (
                    EXACT_COMMENT_TAG_REGEX.test(part)
                ) {
                    return (
                        <button
                            key={`tag-${index}`}

                            type="button"

                            onClick={(event) =>
                                handleTagClick(
                                    event,
                                    part
                                )
                            }

                            title={`${part} tegini tanlash`}

                            className="
                                mx-0.5

                                inline-flex
                                max-w-full
                                items-center

                                rounded-md
                                border
                                border-indigo-400/25

                                bg-indigo-500/[0.08]

                                px-1.5
                                py-0.5

                                font-bold

                                text-indigo-700

                                transition-colors
                                duration-150

                                hover:border-indigo-400/45
                                hover:bg-indigo-500/[0.14]
                                hover:text-indigo-800

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-indigo-500

                                dark:border-indigo-400/15
                                dark:bg-indigo-400/[0.08]
                                dark:text-indigo-300

                                dark:hover:border-indigo-400/25
                                dark:hover:bg-indigo-400/[0.14]
                                dark:hover:text-indigo-200
                            "
                        >
                            {part}
                        </button>
                    );
                }

                return (
                    <React.Fragment
                        key={`text-${index}`}
                    >
                        {part}
                    </React.Fragment>
                );
            })}
        </>
    );
});

// =========================================================
// COMMENT AUTHOR
//
// Uses an actual profile link only when username exists.
// =========================================================

const CommentAuthor = React.memo(({
    author,
    avatar,
    authorName,
}) => {
    const username =
        typeof author?.username === "string"
            ? author.username.trim()
            : "";

    const profilePath = username
        ? `/${encodeURIComponent(username)}/profile/`
        : null;

    const avatarElement = (
        <img
            src={avatar}

            alt={`${authorName} avatar`}

            loading="lazy"
            decoding="async"

            onError={handleUserImageError}

            className="
                h-11
                w-11
                shrink-0

                rounded-xl
                border
                border-[#dce5f0]

                bg-slate-100

                object-cover

                sm:h-12
                sm:w-12

                dark:border-white/[0.09]
                dark:bg-[#141c2a]
            "
        />
    );

    if (!profilePath) {
        return (
            <div
                className="
                    flex
                    shrink-0
                    items-center
                "
            >
                {avatarElement}
            </div>
        );
    }

    return (
        <Link
            to={profilePath}

            title={`${authorName} profilini ko‘rish`}

            className="
                inline-flex
                shrink-0

                rounded-xl

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500
            "
        >
            {avatarElement}
        </Link>
    );
});

// =========================================================
// MAIN PROJECT COMMENT CARD
// =========================================================

const ProjectCommentCard = ({
    comment,

    currentUser,

    isLoggedIn = false,

    onEdit,
    onDelete,
}) => {
    // =====================================================
    // EXPANSION STATE
    // =====================================================

    const [expanded, setExpanded] =
        useState(false);

    // =====================================================
    // COMMENT DATA
    // =====================================================

    const body = String(
        comment?.body ?? ""
    );

    const author = comment?.user || {};

    const authorName = getCommentAuthorName(
        author
    );

    const avatar = getUserAvatarUrl(
        author
    );

    // =====================================================
    // USER PROFILE
    // =====================================================

    const username =
        typeof author.username === "string"
            ? author.username.trim()
            : "";

    const profilePath = username
        ? `/${encodeURIComponent(username)}/profile/`
        : null;

    // =====================================================
    // DATE
    // =====================================================

    const createdAt =
        comment?.created_at || null;

    const displayDate = createdAt
        ? timeAgo(createdAt)
        : "Sana ko‘rsatilmagan";

    // =====================================================
    // OWNERSHIP
    //
    // UI only. Backend must enforce permissions.
    // =====================================================

    const isAuthor = isCommentAuthor(
        currentUser,
        author,
        isLoggedIn
    );

    const canEdit =
        isAuthor &&
        typeof onEdit === "function";

    const canDelete =
        isAuthor &&
        typeof onDelete === "function";

    const hasActions =
        canEdit || canDelete;

    // =====================================================
    // PREVIEW
    // =====================================================

    const isLong =
        body.length > COMMENT_PREVIEW_LIMIT;

    const displayedBody = getCommentPreview(
        body,
        expanded,
        COMMENT_PREVIEW_LIMIT
    );

    // =====================================================
    // HANDLERS
    // =====================================================

    const handleEdit = () => {
        if (!canEdit) {
            return;
        }

        onEdit(comment);
    };

    const handleDelete = () => {
        if (!canDelete) {
            return;
        }

        onDelete(comment);
    };

    const toggleExpanded = () => {
        setExpanded((current) => !current);
    };

    // =====================================================
    // AUTHOR NAME ELEMENT
    // =====================================================

    const authorNameElement = (
        <span
            className="
                block
                max-w-full
                truncate

                text-[13px]
                font-black

                text-slate-900

                transition-colors
                duration-150

                sm:text-sm

                dark:text-white
            "
        >
            {authorName}
        </span>
    );

    // =====================================================
    // JSX
    // =====================================================

    return (
        <article
            className="
                group/comment

                relative

                w-full
                min-w-0

                overflow-hidden

                rounded-[20px]
                border
                border-[#dce5f0]

                bg-white/85

                shadow-[0_4px_18px_rgba(15,23,42,0.03)]

                transition-colors
                duration-200

                hover:border-indigo-400/30
                hover:bg-white

                sm:rounded-[22px]

                dark:border-white/[0.07]
                dark:bg-white/[0.025]
                dark:shadow-none

                dark:hover:border-white/[0.11]
                dark:hover:bg-white/[0.035]
            "
        >
            {/* ======================================
                HOVER GLOW
            ====================================== */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    -left-24
                    -top-24

                    h-48
                    w-48

                    rounded-full

                    bg-indigo-500/[0.045]

                    opacity-0
                    blur-[75px]

                    transition-opacity
                    duration-300

                    group-hover/comment:opacity-100

                    dark:bg-indigo-500/[0.055]
                "
            />

            {/* ======================================
                CARD CONTENT
            ====================================== */}

            <div
                className="
                    relative
                    z-10

                    min-w-0

                    p-4

                    sm:p-5
                "
            >
                <div
                    className="
                        flex
                        min-w-0

                        items-start
                        gap-3

                        sm:gap-4
                    "
                >
                    {/* ==================================
                        AUTHOR AVATAR
                    ================================== */}

                    <CommentAuthor
                        author={author}

                        avatar={avatar}

                        authorName={authorName}
                    />

                    {/* ==================================
                        COMMENT CONTENT
                    ================================== */}

                    <div className="min-w-0 flex-1">

                        {/* ==============================
                            HEADER
                        ============================== */}

                        <div
                            className="
                                flex
                                min-w-0

                                flex-col
                                gap-3

                                sm:flex-row
                                sm:items-start
                                sm:justify-between
                            "
                        >
                            {/* ==========================
                                AUTHOR INFORMATION
                            ========================== */}

                            <div className="min-w-0">

                                {/* AUTHOR NAME */}

                                <div
                                    className="
                                        flex
                                        min-w-0
                                        flex-wrap

                                        items-center

                                        gap-x-2
                                        gap-y-1
                                    "
                                >
                                    {profilePath ? (
                                        <Link
                                            to={profilePath}

                                            className="
                                                max-w-full
                                                min-w-0

                                                rounded-sm

                                                hover:text-indigo-700

                                                focus-visible:outline-none
                                                focus-visible:ring-2
                                                focus-visible:ring-indigo-500

                                                dark:hover:text-indigo-300
                                            "
                                        >
                                            {authorNameElement}
                                        </Link>
                                    ) : (
                                        authorNameElement
                                    )}

                                    {username && (
                                        <>
                                            {/* SEPARATOR */}

                                            <span
                                                aria-hidden="true"

                                                className="
                                                    hidden

                                                    h-1
                                                    w-1

                                                    shrink-0

                                                    rounded-full

                                                    bg-slate-300

                                                    sm:block

                                                    dark:bg-gray-700
                                                "
                                            />

                                            {/* USERNAME */}

                                            <span
                                                className="
                                                    max-w-full
                                                    truncate

                                                    text-[10px]
                                                    font-semibold

                                                    text-slate-500

                                                    dark:text-gray-500
                                                "
                                            >
                                                @{username}
                                            </span>
                                        </>
                                    )}
                                </div>

                                {/* DATE */}

                                <div
                                    className="
                                        mt-1.5

                                        flex
                                        items-center
                                        gap-1.5

                                        text-[10px]
                                        font-semibold

                                        text-slate-500

                                        dark:text-gray-500
                                    "
                                >
                                    <Clock3
                                        size={12}
                                        strokeWidth={1.9}

                                        aria-hidden="true"
                                    />

                                    <time
                                        dateTime={
                                            createdAt ||
                                            undefined
                                        }
                                    >
                                        {displayDate}
                                    </time>
                                </div>
                            </div>

                            {/* ==========================
                                AUTHOR ACTIONS
                            ========================== */}

                            {hasActions && (
                                <div
                                    role="group"
                                    aria-label="Sharh amallari"

                                    className="
                                        flex
                                        shrink-0

                                        items-center
                                        gap-1

                                        self-start

                                        rounded-xl
                                        border
                                        border-[#dce5f0]

                                        bg-slate-50

                                        p-1

                                        dark:border-white/[0.07]
                                        dark:bg-black/[0.16]
                                    "
                                >
                                    {/* EDIT */}

                                    {canEdit && (
                                        <button
                                            type="button"

                                            onClick={handleEdit}

                                            title="Sharhni tahrirlash"

                                            aria-label="Sharhni tahrirlash"

                                            className="
                                                grid
                                                h-8
                                                w-8

                                                place-items-center

                                                rounded-lg

                                                text-slate-500

                                                transition-colors

                                                hover:bg-indigo-500/[0.10]
                                                hover:text-indigo-700

                                                focus-visible:outline-none
                                                focus-visible:ring-2
                                                focus-visible:ring-indigo-500

                                                dark:text-gray-500
                                                dark:hover:text-indigo-300
                                            "
                                        >
                                            <Edit3
                                                size={14}
                                                aria-hidden="true"
                                            />
                                        </button>
                                    )}

                                    {/* DELETE */}

                                    {canDelete && (
                                        <button
                                            type="button"

                                            onClick={handleDelete}

                                            title="Sharhni o‘chirish"

                                            aria-label="Sharhni o‘chirish"

                                            className="
                                                grid
                                                h-8
                                                w-8

                                                place-items-center

                                                rounded-lg

                                                text-slate-500

                                                transition-colors

                                                hover:bg-red-500/[0.10]
                                                hover:text-red-700

                                                focus-visible:outline-none
                                                focus-visible:ring-2
                                                focus-visible:ring-red-500

                                                dark:text-gray-500
                                                dark:hover:text-red-300
                                            "
                                        >
                                            <Trash2
                                                size={14}
                                                aria-hidden="true"
                                            />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* ==============================
                            COMMENT BODY
                        ============================== */}

                        <div
                            className="
                                mt-4

                                max-w-5xl

                                whitespace-pre-wrap
                                break-words
                                [overflow-wrap:anywhere]

                                text-[13px]
                                font-medium
                                leading-7

                                text-slate-700

                                sm:text-sm

                                dark:text-gray-300
                            "
                        >
                            <CommentBody
                                text={displayedBody}
                            />
                        </div>

                        {/* ==============================
                            EXPAND / COLLAPSE
                        ============================== */}

                        {isLong && (
                            <button
                                type="button"

                                onClick={toggleExpanded}

                                aria-expanded={expanded}

                                className="
                                    mt-3

                                    inline-flex
                                    items-center
                                    gap-1.5

                                    rounded-lg

                                    px-1
                                    py-1

                                    text-[10px]
                                    font-black
                                    uppercase
                                    tracking-wider

                                    text-indigo-700

                                    transition-colors

                                    hover:text-indigo-900

                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-indigo-500

                                    dark:text-indigo-400
                                    dark:hover:text-indigo-300
                                "
                            >
                                {expanded ? (
                                    <>
                                        <ChevronUp
                                            size={13}
                                            aria-hidden="true"
                                        />

                                        Qisqartirish
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown
                                            size={13}
                                            aria-hidden="true"
                                        />

                                        To‘liq o‘qish
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(
    ProjectCommentCard
);
