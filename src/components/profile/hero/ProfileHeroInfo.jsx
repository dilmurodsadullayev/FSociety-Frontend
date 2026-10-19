// src/components/profile/hero/ProfileHeroInfo.jsx

import React, { memo } from "react";

import {
    Briefcase,
    Building2,
    CalendarDays,
    ExternalLink,
    Github,
    Globe,
} from "lucide-react";

import {
    cleanUrlText,
    formatGithubUrl,
    formatUrl,
    normalizeGithubText,
} from "../profileHelpers";

// =========================================================
// EXTERNAL LINK VALIDATION
// =========================================================

const safeExternalUrl = (
    value,
    githubOnly = false
) => {
    if (
        typeof value !== "string" ||
        !value.trim()
    ) {
        return null;
    }

    try {
        const parsed = new URL(value.trim());

        // Only HTTP / HTTPS URLs are allowed.
        if (
            !["http:", "https:"].includes(
                parsed.protocol
            )
        ) {
            return null;
        }

        // Do not render URLs containing credentials.
        if (parsed.username || parsed.password) {
            return null;
        }

        // GitHub links must belong to GitHub.
        if (
            githubOnly &&
            ![
                "github.com",
                "www.github.com",
            ].includes(
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
// SINGLE INFORMATION CARD
//
// - Icon
// - Label
// - Value
// - Optional external link
// - Empty value fallback
// - Light / Dark Mode
// - Responsive text handling
// =========================================================

const InfoPill = memo(function InfoPill({
    Icon,
    label,
    value,
    href,
}) {
    // =====================================================
    // VALUE CHECK
    // =====================================================

    const hasValue =
        value !== null &&
        value !== undefined &&
        String(value).trim() !== "";

    const displayValue = hasValue
        ? String(value).trim()
        : "Hali mavjud emas";

    // =====================================================
    // CARD CONTENT
    // =====================================================

    const content = (
        <div
            className="
                group flex min-h-[78px] min-w-0
                items-center gap-3 rounded-2xl

                border border-slate-200
                bg-slate-50/80 p-3.5

                transition-colors

                hover:border-indigo-300
                hover:bg-indigo-50/60

                dark:border-white/[0.07]
                dark:bg-white/[0.025]

                dark:hover:border-indigo-400/25
                dark:hover:bg-white/[0.045]
            "
        >
            {/* =====================================
                ICON
            ====================================== */}

            <span
                aria-hidden="true"
                className="
                    flex h-10 w-10 shrink-0
                    items-center justify-center

                    rounded-xl border
                    border-indigo-200

                    bg-indigo-50
                    text-indigo-700

                    dark:border-indigo-400/15
                    dark:bg-indigo-500/10
                    dark:text-indigo-300
                "
            >
                <Icon size={19} />
            </span>

            {/* =====================================
                LABEL + VALUE
            ====================================== */}

            <div className="min-w-0 flex-1">
                {/* LABEL */}

                <p
                    className="
                        font-mono text-[10px]
                        font-semibold uppercase
                        tracking-[0.08em]

                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    {label}
                </p>

                {/* VALUE */}

                <div
                    className="
                        mt-1 flex min-w-0
                        items-center gap-1

                        text-sm font-semibold
                        text-slate-800

                        dark:text-slate-100
                    "
                >
                    <span
                        title={
                            hasValue
                                ? displayValue
                                : undefined
                        }
                        className={`
                            min-w-0 flex-1 truncate

                            ${
                                !hasValue
                                    ? "text-slate-400 dark:text-slate-500"
                                    : ""
                            }
                        `}
                    >
                        {displayValue}
                    </span>

                    {/* EXTERNAL LINK ICON */}

                    {href && (
                        <ExternalLink
                            size={13}
                            aria-hidden="true"
                            className="
                                shrink-0 text-slate-400

                                group-hover:text-indigo-600
                                dark:group-hover:text-indigo-300
                            "
                        />
                    )}
                </div>
            </div>
        </div>
    );

    // =====================================================
    // ORDINARY CARD
    // =====================================================

    if (!href || !hasValue) {
        return content;
    }

    // =====================================================
    // EXTERNAL LINK CARD
    // =====================================================

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={
                `${label}: ${displayValue} (yangi oynada)`
            }
            className="
                block min-w-0 rounded-2xl

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500
            "
        >
            {content}
        </a>
    );
});

// =========================================================
// PROFILE HERO INFORMATION
//
// Five original cards:
//
// 1. Position
// 2. Company
// 3. Membership date
// 4. Website
// 5. GitHub
//
// Existing profile view model is preserved.
// =========================================================

const ProfileHeroInfo = ({
    currentUser,
}) => {
    const user = currentUser || {};

    // =====================================================
    // SAFE EXTERNAL LINKS
    // =====================================================

    const websiteHref = safeExternalUrl(
        formatUrl(user.website)
    );

    const githubHref = safeExternalUrl(
        formatGithubUrl(user.github),
        true
    );

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div
            aria-label="Profil haqida qisqacha ma’lumot"
            className="
                mt-5 grid min-w-0
                grid-cols-1 gap-3

                sm:mt-6
                sm:grid-cols-2

                xl:grid-cols-5
            "
        >
            {/* =====================================
                POSITION
            ====================================== */}

            <InfoPill
                Icon={Briefcase}
                label="Lavozim"
                value={user.position}
            />

            {/* =====================================
                COMPANY
            ====================================== */}

            <InfoPill
                Icon={Building2}
                label="Kompaniya"
                value={user.company}
            />

            {/* =====================================
                MEMBERSHIP DATE
            ====================================== */}

            <InfoPill
                Icon={CalendarDays}
                label="A’zolik sanasi"
                value={user.memberSince}
            />

            {/* =====================================
                WEBSITE
            ====================================== */}

            <InfoPill
                Icon={Globe}
                label="Veb-sayt"
                value={
                    user.website
                        ? cleanUrlText(user.website)
                        : null
                }
                href={websiteHref}
            />

            {/* =====================================
                GITHUB
            ====================================== */}

            <InfoPill
                Icon={Github}
                label="GitHub"
                value={
                    user.github
                        ? normalizeGithubText(
                            user.github
                        )
                        : null
                }
                href={githubHref}
            />
        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfileHeroInfo);