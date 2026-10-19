// src/components/profile/sidebar/ProfileSidebarDetails.jsx

import React, { memo } from "react";

import {
    Cake,
    ExternalLink,
    Github,
    Link as LinkIcon,
    Mail,
    MapPin,
    Send,
    UserRound,
} from "lucide-react";

import { formatBirthday } from "../../../utils/formatDate";

import {
    cleanUrlText,
    formatGithubUrl,
    formatUrl,
    normalizeGithubText,
} from "../profileHelpers";

// =========================================================
// SAFE EXTERNAL LINKS
//
// Only HTTP / HTTPS URLs are allowed.
//
// For GitHub, the destination must be:
// - github.com
// - www.github.com
//
// URLs with embedded credentials are rejected.
// =========================================================

const safeExternalUrl = (candidate, githubOnly = false) => {
    if (typeof candidate !== "string" || !candidate.trim()) {
        return null;
    }

    try {
        const parsed = new URL(candidate.trim());

        if (!["http:", "https:"].includes(parsed.protocol)) {
            return null;
        }

        if (parsed.username || parsed.password) {
            return null;
        }

        if (
            githubOnly &&
            !["github.com", "www.github.com"].includes(
                parsed.hostname.toLowerCase()
            )
        ) {
            return null;
        }

        return parsed.href;
    } catch {
        return null;
    }
};

// =========================================================
// EMPTY VALUE
// =========================================================

const EmptyValue = memo(function EmptyValue({
    children = "Hali mavjud emas",
}) {
    return (
        <span className="text-slate-400 dark:text-slate-500">
            {children}
        </span>
    );
});

// =========================================================
// REUSABLE DETAIL ROW
//
// Each row contains:
// - Icon
// - Label
// - Value / custom content
//
// Supports Light / Dark Mode and responsive layouts.
// =========================================================

const DetailRow = memo(function DetailRow({
    Icon,
    label,
    iconClass = "text-indigo-600 dark:text-indigo-300",
    children,
}) {
    return (
        <li
            className="
                flex min-w-0 items-start gap-3
                rounded-xl border border-transparent
                p-2.5 transition-colors

                hover:border-slate-200
                hover:bg-slate-50

                dark:hover:border-white/[0.07]
                dark:hover:bg-white/[0.025]
            "
        >
            {/* ICON */}

            <span
                aria-hidden="true"
                className={`
                    mt-0.5 flex h-8 w-8 shrink-0
                    items-center justify-center
                    rounded-xl bg-slate-100

                    dark:bg-white/[0.05]

                    ${iconClass}
                `}
            >
                <Icon size={17} />
            </span>

            {/* LABEL + VALUE */}

            <div className="min-w-0 flex-1">
                <p
                    className="
                        font-mono text-[10px] font-bold
                        uppercase tracking-[0.08em]

                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    {label}
                </p>

                <div
                    className="
                        mt-1 min-w-0 break-words
                        text-sm font-semibold leading-6

                        text-slate-800
                        dark:text-slate-200
                    "
                >
                    {children}
                </div>
            </div>
        </li>
    );
});

// =========================================================
// EXTERNAL FIELD
//
// Link is rendered only after validation.
// Invalid links display an empty-value placeholder.
// =========================================================

const ExternalField = memo(function ExternalField({
    href,
    text,
    label,
}) {
    if (!href) {
        return <EmptyValue />;
    }

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={text}
            aria-label={`${label}: ${text} (yangi oynada)`}
            className="
                inline-flex max-w-full min-w-0
                items-center gap-1.5 rounded

                text-indigo-700 hover:underline

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500

                dark:text-indigo-300
                dark:hover:text-indigo-200
            "
        >
            <span className="min-w-0 truncate">
                {text}
            </span>

            <ExternalLink
                size={13}
                className="shrink-0"
                aria-hidden="true"
            />
        </a>
    );
});

// =========================================================
// PROFILE SIDEBAR DETAILS
//
// All 7 original fields are preserved:
//
// 1. Full Name
// 2. Birthday
// 3. Location
// 4. Email
// 5. Website
// 6. GitHub
// 7. Telegram Bot
//
// Business data is received from the parent.
// No extra API or Redux calls are introduced.
// =========================================================

const ProfileSidebarDetails = ({
    currentUser,
    birthdayStatus,
}) => {
    const user = currentUser || {};

    // =====================================================
    // SAFE LINKS
    // =====================================================

    const websiteHref = safeExternalUrl(
        formatUrl(user.website)
    );

    const githubHref = safeExternalUrl(
        formatGithubUrl(user.github),
        true
    );

    // =====================================================
    // TELEGRAM STATUS
    // =====================================================

    const telegramLinked = Boolean(user.telegramLinked);

    const telegramUsername = String(
        user.telegramUsername || ""
    )
        .trim()
        .replace(/^@+/, "");

    // =====================================================
    // BIRTHDAY
    // =====================================================

    const birthday = user.birthday
        ? formatBirthday(user.birthday)
        : "";

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <>
            {/* =====================================
                DETAILS HEADER
            ====================================== */}

            <header
                className="
                    mb-5 flex min-w-0
                    items-center gap-3
                "
            >
                <span
                    aria-hidden="true"
                    className="
                        flex h-11 w-11 shrink-0
                        items-center justify-center
                        rounded-2xl border

                        border-indigo-200
                        bg-indigo-50
                        text-indigo-700

                        dark:border-indigo-400/20
                        dark:bg-indigo-500/10
                        dark:text-indigo-300
                    "
                >
                    <UserRound size={22} />
                </span>

                <div className="min-w-0">
                    <h2
                        className="
                            text-xl font-black
                            text-slate-900
                            dark:text-white
                        "
                    >
                        Ma’lumotlar
                    </h2>

                    <p
                        className="
                            text-xs font-semibold
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        Shaxsiy va professional profil
                    </p>
                </div>
            </header>

            {/* =====================================
                ORIGINAL INFORMATION ROWS
            ====================================== */}

            <ul className="space-y-1">
                {/* FULL NAME */}

                <DetailRow
                    Icon={UserRound}
                    label="To‘liq ism"
                >
                    {user.fullName || <EmptyValue />}
                </DetailRow>

                {/* BIRTHDAY */}

                <DetailRow
                    Icon={Cake}
                    label="Tug‘ilgan sana"
                    iconClass="
                        text-pink-600
                        dark:text-pink-300
                    "
                >
                    <div
                        className="
                            flex min-w-0 flex-wrap
                            items-center gap-2
                        "
                    >
                        {birthday ? (
                            <span>{birthday}</span>
                        ) : (
                            <EmptyValue />
                        )}

                        {birthday && birthdayStatus && (
                            <span
                                className="
                                    rounded-full border
                                    border-pink-200

                                    bg-pink-50
                                    px-2 py-0.5

                                    text-[10px] font-black
                                    uppercase text-pink-700

                                    dark:border-pink-400/25
                                    dark:bg-pink-500/10
                                    dark:text-pink-300
                                "
                            >
                                {birthdayStatus}
                            </span>
                        )}
                    </div>
                </DetailRow>

                {/* LOCATION */}

                <DetailRow
                    Icon={MapPin}
                    label="Manzil"
                    iconClass="
                        text-emerald-600
                        dark:text-emerald-300
                    "
                >
                    {user.location || <EmptyValue />}
                </DetailRow>

                {/* EMAIL */}

                <DetailRow
                    Icon={Mail}
                    label="Email"
                    iconClass="
                        text-sky-600
                        dark:text-sky-300
                    "
                >
                    {user.email ? (
                        <span className="break-all">
                            {user.email}
                        </span>
                    ) : (
                        <EmptyValue />
                    )}
                </DetailRow>

                {/* WEBSITE */}

                <DetailRow
                    Icon={LinkIcon}
                    label="Veb-sayt"
                >
                    <ExternalField
                        href={websiteHref}
                        label="Veb-sayt"
                        text={
                            user.website
                                ? cleanUrlText(user.website)
                                : ""
                        }
                    />
                </DetailRow>

                {/* GITHUB */}

                <DetailRow
                    Icon={Github}
                    label="GitHub"
                    iconClass="
                        text-purple-600
                        dark:text-purple-300
                    "
                >
                    <ExternalField
                        href={githubHref}
                        label="GitHub"
                        text={
                            user.github
                                ? normalizeGithubText(
                                      user.github
                                  )
                                : ""
                        }
                    />
                </DetailRow>

                {/* TELEGRAM BOT */}

                <DetailRow
                    Icon={Send}
                    label="Telegram Bot"
                    iconClass={
                        telegramLinked
                            ? "text-emerald-600 dark:text-emerald-300"
                            : "text-slate-400 dark:text-slate-500"
                    }
                >
                    {telegramLinked ? (
                        <span
                            className="
                                inline-flex max-w-full
                                min-w-0 items-center gap-2

                                text-emerald-700
                                dark:text-emerald-300
                            "
                        >
                            {/* CONNECTION STATUS DOT

                                Static indicator.
                                It does not imply that
                                the user is online.
                            */}

                            <span
                                aria-hidden="true"
                                className="
                                    h-2 w-2 shrink-0
                                    rounded-full
                                    bg-emerald-500
                                "
                            />

                            <span className="min-w-0 break-all">
                                {telegramUsername
                                    ? `@${telegramUsername}`
                                    : "Telegram ulangan"}
                            </span>
                        </span>
                    ) : (
                        <EmptyValue>
                            Bot ulanmagan
                        </EmptyValue>
                    )}
                </DetailRow>
            </ul>
        </>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfileSidebarDetails);