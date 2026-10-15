
import React from "react";

import { Link } from "react-router-dom";

import {
    Check,
    Crown,
    ShieldCheck,
    Trash2,
    X,
} from "lucide-react";

// =========================================================
// HELPERS
// =========================================================

import {
    getAuthorName,
    getImageUrl,
    getOwnerProfilePath,
} from "../projectDetail/projectDetailHelpers";

import {
    getCollaborationRoleLabel,
} from "./collaborationConfig";

// =========================================================
// FSOCIETY — COLLABORATION CARDS
//
// Components:
// - MemberAvatar
// - CollaborationMemberCard
// - CollaborationRequestCard
// - CollaborationCollaboratorRow
//
// Features:
// - Dark / Light Mode
// - Responsive layout
// - Backend avatar fallback
// - Project owner indicator
// - User profile navigation
// - Accept / reject actions
// - Safe text rendering
//
// No Redux hooks.
// No direct API requests.
// =========================================================

// =========================================================
// MEMBER AVATAR
// =========================================================

export const MemberAvatar = React.memo(({
    user,
    size = "normal",
}) => {
    const name = getAuthorName(user);

    const imageUrl = getImageUrl(
        user?.image
    );

    // =====================================================
    // IMAGE FALLBACK
    // =====================================================

    const handleImageError = (event) => {
        const image = event.currentTarget;

        // Prevent repeated error events.
        image.onerror = null;

        const fallbackUrl = getImageUrl(null);

        if (fallbackUrl) {
            image.src = fallbackUrl;
        }
    };

    // =====================================================
    // SIZE
    // =====================================================

    const sizeClass =
        size === "small"
            ? "h-10 w-10"
            : size === "large"
                ? "h-14 w-14"
                : "h-12 w-12";

    // =====================================================
    // JSX
    // =====================================================

    return (
        <img
            src={imageUrl}

            alt={`${name} avatar`}

            loading="lazy"
            decoding="async"

            onError={handleImageError}

            className={`
                shrink-0

                rounded-xl
                border
                border-[#dce5f0]

                bg-slate-100
                object-cover

                dark:border-white/[0.10]
                dark:bg-[#141c2a]

                ${sizeClass}
            `}
        />
    );
});

// =========================================================
// COLLABORATION MEMBER CARD
//
// Used in the main team grid.
//
// Supports:
// - Project owner
// - Active collaborator
// =========================================================

export const CollaborationMemberCard = React.memo(({
    user,
    role,
    isProjectOwner = false,
}) => {
    // =====================================================
    // USER DATA
    // =====================================================

    const member = user || {};

    const name = getAuthorName(
        member
    );

    const username =
        typeof member.username === "string"
            ? member.username.trim()
            : "";

    const profileUrl = username
        ? getOwnerProfilePath(member)
        : null;

    // =====================================================
    // CARD CLASS
    // =====================================================

    const cardClass = `
        group/member

        flex
        w-full
        min-w-0

        items-center
        gap-3

        rounded-xl
        border
        border-[#dce5f0]

        bg-white

        p-3

        text-left

        transition-colors
        duration-150

        sm:gap-3.5

        dark:border-white/[0.08]
        dark:bg-white/[0.035]

        ${
            profileUrl
                ? `
                    hover:border-indigo-400/40
                    hover:bg-indigo-500/[0.04]

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-indigo-500

                    dark:hover:border-indigo-400/25
                `
                : ""
        }
    `;

    // =====================================================
    // CARD CONTENT
    // =====================================================

    const content = (
        <>
            {/* AVATAR */}

            <MemberAvatar user={member} />

            {/* USER DATA */}

            <div className="min-w-0 flex-1">

                {/* NAME */}

                <p
                    className="
                        truncate

                        text-[12px]
                        font-black

                        text-slate-900

                        dark:text-gray-100
                    "
                >
                    {name}
                </p>

                {/* ROLE */}

                <div
                    className="
                        mt-1

                        flex
                        min-w-0

                        items-center
                        gap-1.5

                        text-[10px]
                        font-semibold

                        text-slate-500

                        dark:text-gray-400
                    "
                >
                    {isProjectOwner ? (
                        <Crown
                            size={12}
                            fill="currentColor"
                            aria-hidden="true"

                            className="
                                shrink-0

                                text-amber-500

                                dark:text-amber-300
                            "
                        />
                    ) : (
                        <ShieldCheck
                            size={12}
                            aria-hidden="true"

                            className="
                                shrink-0

                                text-indigo-600

                                dark:text-indigo-300
                            "
                        />
                    )}

                    <span className="min-w-0 truncate">
                        {isProjectOwner
                            ? "Project Owner"
                            : getCollaborationRoleLabel(role)}
                    </span>
                </div>
            </div>
        </>
    );

    // =====================================================
    // MEMBER WITHOUT PROFILE
    // =====================================================

    if (!profileUrl) {
        return (
            <div className={cardClass}>
                {content}
            </div>
        );
    }

    // =====================================================
    // MEMBER PROFILE LINK
    // =====================================================

    return (
        <Link
            to={profileUrl}

            title={`${name} profilini ko‘rish`}

            className={cardClass}
        >
            {content}
        </Link>
    );
});

// =========================================================
// COLLABORATION REQUEST CARD
//
// Owner actions:
// - Accept request
// - Reject request
//
// No direct API requests in this component.
// =========================================================

export const CollaborationRequestCard = React.memo(({
    request,
    isBusy = false,
    onAccept,
    onReject,
}) => {
    // =====================================================
    // REQUEST DATA
    // =====================================================

    const requestId = request?.id;

    const author = request?.user || {};

    const authorName = getAuthorName(
        author
    );

    const roleLabel = getCollaborationRoleLabel(
        request?.role
    );

    const message =
        typeof request?.message === "string"
            ? request.message.trim()
            : "";

    // =====================================================
    // ACTION AVAILABILITY
    // =====================================================

    const canAccept =
        !isBusy &&
        requestId != null &&
        typeof onAccept === "function";

    const canReject =
        !isBusy &&
        requestId != null &&
        typeof onReject === "function";

    // =====================================================
    // JSX
    // =====================================================

    return (
        <article
            className="
                min-w-0

                rounded-xl
                border
                border-[#dce5f0]

                bg-[#f8faff]

                p-3

                sm:p-4

                dark:border-white/[0.08]
                dark:bg-white/[0.025]
            "
        >
            {/* ======================================
                REQUEST USER
            ====================================== */}

            <div
                className="
                    flex
                    min-w-0

                    items-start
                    gap-3
                "
            >
                {/* AVATAR */}

                <MemberAvatar
                    user={author}
                    size="small"
                />

                {/* USER DATA */}

                <div className="min-w-0 flex-1">

                    {/* NAME */}

                    <p
                        className="
                            truncate

                            text-[12px]
                            font-black

                            text-slate-900

                            dark:text-gray-100
                        "
                    >
                        {authorName}
                    </p>

                    {/* ROLE */}

                    <p
                        className="
                            mt-1

                            text-[11px]
                            font-semibold

                            text-indigo-700

                            dark:text-indigo-300
                        "
                    >
                        {roleLabel}
                    </p>

                    {/* MESSAGE */}

                    {message && (
                        <p
                            className="
                                mt-2

                                whitespace-pre-wrap
                                break-words
                                [overflow-wrap:anywhere]

                                text-[11px]
                                font-medium
                                leading-5

                                text-slate-600

                                dark:text-gray-400
                            "
                        >
                            {message}
                        </p>
                    )}
                </div>
            </div>

            {/* ======================================
                REQUEST ACTIONS
            ====================================== */}

            <div
                className="
                    mt-3

                    flex
                    flex-wrap

                    items-center
                    justify-end
                    gap-2
                "
            >
                {/* REJECT */}

                <button
                    type="button"

                    onClick={() => {
                        if (canReject) {
                            onReject(requestId);
                        }
                    }}

                    disabled={!canReject}

                    aria-label={`${authorName} so‘rovini rad etish`}

                    className="
                        inline-flex
                        min-h-9

                        items-center
                        justify-center
                        gap-1.5

                        rounded-lg
                        border
                        border-red-200

                        bg-red-50

                        px-3
                        py-2

                        text-[11px]
                        font-bold

                        text-red-700

                        transition-colors

                        hover:bg-red-100

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-red-500

                        disabled:cursor-not-allowed
                        disabled:opacity-50

                        dark:border-red-400/20
                        dark:bg-red-500/[0.08]
                        dark:text-red-300

                        dark:hover:bg-red-500/[0.12]
                    "
                >
                    <X
                        size={14}
                        aria-hidden="true"
                    />

                    Rad etish
                </button>

                {/* ACCEPT */}

                <button
                    type="button"

                    onClick={() => {
                        if (canAccept) {
                            onAccept(requestId);
                        }
                    }}

                    disabled={!canAccept}

                    aria-label={`${authorName} so‘rovini qabul qilish`}

                    className="
                        inline-flex
                        min-h-9

                        items-center
                        justify-center
                        gap-1.5

                        rounded-lg

                        bg-emerald-600

                        px-3
                        py-2

                        text-[11px]
                        font-bold

                        text-white

                        transition-colors

                        hover:bg-emerald-700

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-emerald-500

                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    <Check
                        size={14}
                        aria-hidden="true"
                    />

                    Qabul qilish
                </button>
            </div>
        </article>
    );
});

// =========================================================
// COLLABORATOR MANAGEMENT ROW
//
// Used in ManageCollaboratorsModal.
//
// Important:
// The original removeCollaborator handler did not
// call any backend endpoint.
//
// Therefore the remove button stays disabled until
// a real delete thunk/API is implemented.
//
// Never show a fake success notification.
// =========================================================

export const CollaborationCollaboratorRow = React.memo(({
    collaborator,
    onRemove,
    isBusy = false,
}) => {
    // =====================================================
    // COLLABORATOR DATA
    // =====================================================

    const user = collaborator?.user || {};

    const name = getAuthorName(user);

    const role = getCollaborationRoleLabel(
        collaborator?.role
    );

    const collaboratorId =
        collaborator?.id;

    // =====================================================
    // REMOVE AVAILABILITY
    // =====================================================

    const canRemove =
        typeof onRemove === "function" &&
        collaboratorId != null &&
        !isBusy;

    // =====================================================
    // JSX
    // =====================================================

    return (
        <div
            className="
                flex
                w-full
                min-w-0

                flex-col
                gap-3

                rounded-xl
                border
                border-[#dce5f0]

                bg-[#f8faff]

                p-3

                sm:flex-row
                sm:items-center
                sm:justify-between

                dark:border-white/[0.08]
                dark:bg-white/[0.025]
            "
        >
            {/* ======================================
                COLLABORATOR INFO
            ====================================== */}

            <div
                className="
                    flex
                    min-w-0

                    items-center
                    gap-3
                "
            >
                {/* AVATAR */}

                <MemberAvatar
                    user={user}
                    size="small"
                />

                {/* USER INFORMATION */}

                <div className="min-w-0">

                    <p
                        className="
                            truncate

                            text-[12px]
                            font-black

                            text-slate-900

                            dark:text-white
                        "
                    >
                        {name}
                    </p>

                    <p
                        className="
                            mt-1

                            truncate

                            text-[11px]
                            font-medium

                            text-slate-500

                            dark:text-gray-400
                        "
                    >
                        {role}
                    </p>
                </div>
            </div>

            {/* ======================================
                REMOVE BUTTON
            ====================================== */}

            <button
                type="button"

                onClick={() => {
                    if (canRemove) {
                        onRemove(collaboratorId);
                    }
                }}

                disabled={!canRemove}

                title={
                    canRemove
                        ? "Hamkorni loyihadan olib tashlash"
                        : "Hamkorni o‘chirish API hali ulanmagan"
                }

                aria-label={`${name}ni loyihadan olib tashlash`}

                className="
                    inline-flex
                    min-h-9

                    items-center
                    justify-center
                    gap-2

                    rounded-lg
                    border
                    border-red-200

                    px-3
                    py-2

                    text-[11px]
                    font-bold

                    text-red-700

                    transition-colors

                    hover:bg-red-50

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-red-500

                    disabled:cursor-not-allowed
                    disabled:opacity-50

                    dark:border-red-400/20
                    dark:text-red-300

                    dark:hover:bg-red-500/[0.08]
                "
            >
                <Trash2
                    size={14}
                    aria-hidden="true"
                />

                O‘chirish
            </button>
        </div>
    );
});
