
import React from "react";
import { Link } from "react-router-dom";

import {
    ArrowUp,
    Bell,
    Braces,
    Bug,
    Coins,
    Code2,
    ExternalLink,
    FolderKanban,
    Github,
    Heart,
    History,
    Linkedin,
    MessageSquareText,
    Send,
    ShieldCheck,
    Sparkles,
    Users,
} from "lucide-react";

import {
    APP_CREATED_YEAR,
    APP_DESCRIPTION,
    APP_FULL_NAME,
    APP_LOGO,
    APP_NAME,
    APP_VERSION,
    DEVELOPER_NAME,
    DEVELOPER_URL,
    GITHUB_URL,
    LINKEDIN_URL,
    POWERED_BY,
    RELEASE_CHANNEL,
    TELEGRAM_URL,
} from "../config/appMeta";

// =========================================================
// FSOCIETY — FOOTER
//
// Features:
// - Dark / Light Mode
// - Responsive navigation
// - Social links
// - Application metadata
// - Release channel
// - Technology stack
// - Copyright
// - Scroll to top
//
// Theme:
// Controlled by global ThemeContext.
//
// No additional theme state.
// No API requests.
// =========================================================

// =========================================================
// NAVIGATION
// =========================================================

const FOOTER_GROUPS = [
    {
        title: "Platforma",
        links: [
            {
                label: "Muammolar",
                to: "/problems",
                Icon: Bug,
            },
            {
                label: "Loyihalar",
                to: "/projects",
                Icon: FolderKanban,
            },
            {
                label: "Developerlar",
                to: "/users",
                Icon: Users,
            },
            {
                label: "Feedback",
                to: "/feedback",
                Icon: MessageSquareText,
            },
        ],
    },
    {
        title: "Ecosystem",
        links: [
            {
                label: "FCoin",
                to: "/fcoin-history",
                Icon: Coins,
            },
            {
                label: "Bildirishnomalar",
                to: "/notifications",
                Icon: Bell,
            },
            {
                label: "Changelog",
                href: "/#changelog",
                Icon: History,
            },
        ],
    },
];

// =========================================================
// RELEASE CHANNEL
// =========================================================

const RELEASE_CONFIG = {
    stable: {
        label: "Stable",
        className: `
            border-emerald-400/30
            bg-emerald-500/[0.08]
            text-emerald-800

            dark:border-emerald-400/20
            dark:bg-emerald-400/[0.06]
            dark:text-emerald-300
        `,
    },

    beta: {
        label: "Beta",
        className: `
            border-indigo-400/30
            bg-indigo-500/[0.08]
            text-indigo-700

            dark:border-indigo-400/20
            dark:bg-indigo-400/[0.06]
            dark:text-indigo-300
        `,
    },

    alpha: {
        label: "Alpha",
        className: `
            border-orange-400/30
            bg-orange-500/[0.08]
            text-orange-800

            dark:border-orange-400/20
            dark:bg-orange-400/[0.06]
            dark:text-orange-300
        `,
    },

    dev: {
        label: "Development",
        className: `
            border-fuchsia-400/30
            bg-fuchsia-500/[0.08]
            text-fuchsia-800

            dark:border-fuchsia-400/20
            dark:bg-fuchsia-400/[0.06]
            dark:text-fuchsia-300
        `,
    },

    community: {
        label: "Community",
        className: `
            border-cyan-400/30
            bg-cyan-500/[0.08]
            text-cyan-800

            dark:border-cyan-400/20
            dark:bg-cyan-400/[0.06]
            dark:text-cyan-300
        `,
    },
};

const getReleaseChannelData = (channel) => {
    const key = String(channel || "beta")
        .trim()
        .toLowerCase();

    return RELEASE_CONFIG[key] || RELEASE_CONFIG.beta;
};

// =========================================================
// TECHNOLOGY ICON
// =========================================================

const getTechnologyIcon = (key) => {
    const value = String(key || "").toLowerCase();

    if (value === "react") {
        return Sparkles;
    }

    if (value === "django") {
        return Braces;
    }

    return Code2;
};

// =========================================================
// FOOTER LINK
// =========================================================

const FooterLink = ({ item }) => {
    const Icon = item.Icon;

    const className = `
        group/link
        inline-flex
        w-fit
        max-w-full
        items-center
        gap-2.5

        rounded-md

        py-1

        text-[13px]
        font-medium

        text-slate-600

        transition-colors
        duration-150

        hover:text-indigo-700

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-indigo-500

        dark:text-gray-400
        dark:hover:text-cyan-300
    `;

    const content = (
        <>
            <Icon
                size={15}
                strokeWidth={1.9}
                aria-hidden="true"
                className="
                    shrink-0

                    text-slate-400

                    transition-colors
                    duration-150

                    group-hover/link:text-indigo-600

                    dark:text-gray-600
                    dark:group-hover/link:text-cyan-300
                "
            />

            <span>{item.label}</span>
        </>
    );

    if (item.href) {
        return (
            <a
                href={item.href}
                className={className}
            >
                {content}
            </a>
        );
    }

    return (
        <Link
            to={item.to}
            className={className}
        >
            {content}
        </Link>
    );
};

// =========================================================
// FOOTER NAVIGATION GROUP
// =========================================================

const FooterNavigationGroup = ({ group }) => {
    return (
        <div className="min-w-0">

            <h3
                className="
                    font-mono
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.16em]

                    text-slate-800

                    dark:text-gray-300
                "
            >
                {group.title}
            </h3>

            <div
                className="
                    mt-4
                    flex
                    flex-col
                    items-start
                    gap-2.5
                "
            >
                {group.links.map((item) => (
                    <FooterLink
                        key={item.label}
                        item={item}
                    />
                ))}
            </div>
        </div>
    );
};

// =========================================================
// SOCIAL LINK
// =========================================================

const SocialLink = ({
    href,
    label,
    Icon,
    variant = "default",
}) => {
    if (!href) {
        return null;
    }

    const variants = {
        default: `
            text-slate-600
            hover:text-slate-900

            dark:text-gray-400
            dark:hover:text-white
        `,

        cyan: `
            text-cyan-700
            hover:text-cyan-800

            dark:text-cyan-400
            dark:hover:text-cyan-200
        `,

        blue: `
            text-blue-700
            hover:text-blue-800

            dark:text-blue-400
            dark:hover:text-blue-200
        `,
    };

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"

            aria-label={label}
            title={label}

            className={`
                group/social

                grid
                h-11
                w-11
                shrink-0

                place-items-center

                rounded-xl
                border

                border-[#dce4ef]
                bg-white/80

                shadow-[0_3px_10px_rgba(15,23,42,0.03)]

                transition-all
                duration-150

                hover:-translate-y-0.5
                hover:border-indigo-400/40
                hover:bg-indigo-500/[0.06]

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500

                dark:border-white/[0.08]
                dark:bg-white/[0.035]
                dark:shadow-none

                dark:hover:border-indigo-400/25
                dark:hover:bg-white/[0.06]

                motion-reduce:transform-none

                ${variants[variant] || variants.default}
            `}
        >
            <Icon
                size={18}
                strokeWidth={1.9}
                aria-hidden="true"
            />
        </a>
    );
};

// =========================================================
// FOOTER SOCIALS
// =========================================================

const FooterSocials = () => {
    return (
        <div className="min-w-0">

            <h3
                className="
                    font-mono
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.16em]

                    text-slate-800

                    dark:text-gray-300
                "
            >
                Connect
            </h3>

            <p
                className="
                    mt-3
                    max-w-[220px]
                    text-xs
                    leading-5

                    text-slate-500

                    dark:text-gray-500
                "
            >
                Biz bilan bog‘laning va hamjamiyatga
                qo‘shiling.
            </p>

            <div
                className="
                    mt-4
                    flex
                    flex-wrap
                    items-center
                    gap-2
                "
            >
                <SocialLink
                    href={GITHUB_URL}
                    label="GitHub"
                    Icon={Github}
                />

                <SocialLink
                    href={TELEGRAM_URL}
                    label="Telegram"
                    Icon={Send}
                    variant="cyan"
                />

                <SocialLink
                    href={LINKEDIN_URL}
                    label="LinkedIn"
                    Icon={Linkedin}
                    variant="blue"
                />
            </div>

            {GITHUB_URL && (
                <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"

                    className="
                        group/source

                        mt-4
                        inline-flex
                        items-center
                        gap-1.5

                        rounded-md

                        text-[11px]
                        font-semibold

                        text-slate-500

                        transition-colors
                        duration-150

                        hover:text-indigo-700

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-indigo-500

                        dark:text-gray-500
                        dark:hover:text-cyan-300
                    "
                >
                    Source code

                    <ExternalLink
                        size={12}
                        aria-hidden="true"
                        className="
                            transition-transform
                            duration-150

                            group-hover/source:-translate-y-0.5
                            group-hover/source:translate-x-0.5

                            motion-reduce:transform-none
                        "
                    />
                </a>
            )}
        </div>
    );
};

// =========================================================
// FOOTER BRAND
// =========================================================

const FooterBrand = ({ release }) => {
    return (
        <div className="min-w-0 max-w-xl">

            {/* ======================================
                LOGO + BRAND
            ====================================== */}

            <Link
                to="/"

                className="
                    group/brand

                    inline-flex
                    max-w-full
                    items-center
                    gap-3

                    rounded-xl

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-indigo-500
                "
            >
                {/* LOGO */}

                <span
                    className="
                        relative

                        grid
                        h-[62px]
                        w-[62px]
                        shrink-0

                        place-items-center

                        overflow-hidden
                        rounded-2xl

                        border
                        border-indigo-400/20

                        bg-white/80

                        transition-colors
                        duration-200

                        group-hover/brand:border-indigo-400/45

                        dark:border-cyan-400/10
                        dark:bg-white/[0.025]

                        dark:group-hover/brand:border-cyan-400/30
                    "
                >
                    <img
                        src={APP_LOGO}
                        alt={`${APP_FULL_NAME} logo`}
                        draggable={false}

                        className="
                            h-full
                            w-full

                            object-contain

                            scale-110

                            transition-transform
                            duration-300

                            group-hover/brand:scale-[1.18]

                            motion-reduce:transform-none
                        "
                    />
                </span>

                {/* BRAND TEXT */}

                <span className="min-w-0">

                    <span
                        className="
                            block

                            text-[25px]
                            font-black
                            tracking-[-0.05em]

                            text-slate-900

                            dark:text-white
                        "
                    >
                        F
                        <span
                            className="
                                text-indigo-600
                                dark:text-indigo-400
                            "
                        >
                            Society
                        </span>
                    </span>

                    <span
                        className="
                            mt-0.5
                            block

                            font-mono
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.12em]

                            text-slate-500

                            dark:text-gray-600
                        "
                    >
                        Fix Society // Developer Network
                    </span>
                </span>
            </Link>

            {/* ======================================
                DESCRIPTION
            ====================================== */}

            <p
                className="
                    mt-5
                    max-w-lg

                    text-[13px]
                    leading-7

                    text-slate-600

                    dark:text-gray-400
                "
            >
                {APP_DESCRIPTION}
            </p>

            {/* ======================================
                CREATED BY
            ====================================== */}

            <div
                className="
                    mt-4

                    flex
                    flex-wrap
                    items-center

                    gap-x-2
                    gap-y-1

                    text-[11px]
                    font-medium

                    text-slate-500

                    dark:text-gray-500
                "
            >
                <span>
                    Created in{" "}
                    <strong
                        className="
                            text-slate-800
                            dark:text-gray-300
                        "
                    >
                        {APP_CREATED_YEAR}
                    </strong>
                </span>

                <span
                    aria-hidden="true"
                    className="
                        text-slate-300
                        dark:text-gray-700
                    "
                >
                    /
                </span>

                <span>
                    Developed by{" "}

                    {DEVELOPER_URL ? (
                        <a
                            href={DEVELOPER_URL}
                            target="_blank"
                            rel="noopener noreferrer"

                            className="
                                rounded-md
                                font-bold

                                text-indigo-700

                                transition-colors
                                duration-150

                                hover:text-cyan-700

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-indigo-500

                                dark:text-indigo-300
                                dark:hover:text-cyan-300
                            "
                        >
                            {DEVELOPER_NAME}
                        </a>
                    ) : (
                        <strong
                            className="
                                text-indigo-700
                                dark:text-indigo-300
                            "
                        >
                            {DEVELOPER_NAME}
                        </strong>
                    )}
                </span>
            </div>

            {/* ======================================
                STATUS + VERSION
            ====================================== */}

            <div
                className="
                    mt-6

                    flex
                    flex-wrap
                    items-center
                    gap-2
                "
            >
                {/* SYSTEM BADGE */}

                <span
                    className="
                        inline-flex
                        items-center
                        gap-2

                        rounded-xl
                        border
                        border-emerald-400/25

                        bg-emerald-500/[0.06]

                        px-3
                        py-2

                        dark:border-emerald-400/15
                        dark:bg-emerald-400/[0.04]
                    "
                >
                    <span
                        aria-hidden="true"
                        className="
                            h-2
                            w-2

                            rounded-full

                            bg-emerald-500

                            dark:bg-emerald-400
                        "
                    />

                    <span
                        className="
                            font-mono
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.09em]

                            text-emerald-800

                            dark:text-emerald-300
                        "
                    >
                        System online
                    </span>
                </span>

                {/* VERSION */}

                <a
                    href="/#changelog"

                    className="
                        group/version

                        inline-flex
                        max-w-full
                        flex-wrap

                        items-center
                        gap-2

                        rounded-xl
                        border

                        border-indigo-400/25

                        bg-indigo-500/[0.06]

                        px-3
                        py-2

                        transition-colors
                        duration-150

                        hover:border-indigo-400/45
                        hover:bg-indigo-500/[0.10]

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-indigo-500

                        dark:border-indigo-400/15
                        dark:bg-indigo-400/[0.04]

                        dark:hover:border-indigo-400/30
                    "
                >
                    <History
                        size={14}
                        strokeWidth={2}
                        aria-hidden="true"

                        className="
                            text-indigo-600

                            dark:text-indigo-300
                        "
                    />

                    <span
                        className="
                            font-mono
                            text-[10px]
                            font-bold

                            text-slate-500

                            dark:text-gray-500
                        "
                    >
                        Version
                    </span>

                    <span
                        className="
                            font-mono
                            text-[10px]
                            font-black

                            text-indigo-700

                            dark:text-indigo-300
                        "
                    >
                        {APP_VERSION}
                    </span>

                    <span
                        className={`
                            rounded-md
                            border

                            px-2
                            py-0.5

                            font-mono
                            text-[8px]
                            font-bold
                            uppercase
                            tracking-wider

                            ${release.className}
                        `}
                    >
                        {release.label}
                    </span>
                </a>
            </div>
        </div>
    );
};

// =========================================================
// POWERED BY SECTION
// =========================================================

const FooterTechnologies = () => {
    const technologies = Array.isArray(POWERED_BY)
        ? POWERED_BY
        : [];

    return (
        <div
            className="
                flex
                flex-col
                gap-4

                border-t
                border-[#e0e7f1]

                py-5

                md:flex-row
                md:items-center
                md:justify-between

                dark:border-white/[0.065]
            "
        >
            <div
                className="
                    flex
                    min-w-0
                    flex-wrap
                    items-center
                    gap-2
                "
            >
                <span
                    className="
                        mr-1

                        font-mono
                        text-[10px]
                        font-black
                        uppercase
                        tracking-[0.12em]

                        text-slate-500

                        dark:text-gray-600
                    "
                >
                    Powered by
                </span>

                {technologies.map((technology) => {
                    const Icon = getTechnologyIcon(
                        technology.key
                    );

                    if (!technology.url) {
                        return null;
                    }

                    return (
                        <a
                            key={technology.key}

                            href={technology.url}
                            target="_blank"
                            rel="noopener noreferrer"

                            className="
                                group/tech

                                inline-flex
                                max-w-full
                                items-center
                                gap-2

                                rounded-lg
                                border
                                border-[#dce4ef]

                                bg-white/80

                                px-2.5
                                py-1.5

                                text-[10px]
                                font-semibold

                                text-slate-600

                                transition-colors
                                duration-150

                                hover:border-cyan-400/40
                                hover:bg-cyan-500/[0.05]
                                hover:text-cyan-800

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-indigo-500

                                dark:border-white/[0.07]
                                dark:bg-white/[0.025]
                                dark:text-gray-400

                                dark:hover:border-cyan-400/20
                                dark:hover:bg-cyan-400/[0.045]
                                dark:hover:text-cyan-300
                            "
                        >
                            <Icon
                                size={14}
                                strokeWidth={2}
                                aria-hidden="true"

                                className="
                                    shrink-0
                                    text-cyan-700

                                    dark:text-cyan-300
                                "
                            />

                            <span className="truncate">
                                {technology.name}
                            </span>
                        </a>
                    );
                })}
            </div>

            <p
                className="
                    shrink-0

                    text-[10px]
                    font-medium

                    text-slate-500

                    dark:text-gray-600
                "
            >
                Building since{" "}

                <strong
                    className="
                        text-slate-700

                        dark:text-gray-400
                    "
                >
                    {APP_CREATED_YEAR}
                </strong>
            </p>
        </div>
    );
};

// =========================================================
// MAIN FOOTER
// =========================================================

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const release = getReleaseChannelData(
        RELEASE_CHANNEL
    );

    // =====================================================
    // SCROLL TO TOP
    // =====================================================

    const scrollToTop = () => {
        const reduceMotion =
            typeof window.matchMedia === "function" &&
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

        window.scrollTo({
            top: 0,
            behavior: reduceMotion ? "auto" : "smooth",
        });
    };

    // =====================================================
    // JSX
    // =====================================================

    return (
        <footer
            className="
                relative
                isolate
                min-w-0
                overflow-hidden

                border-t
                border-[#dce5f0]

                bg-[#f6f8fd]

                text-slate-900

                dark:border-white/[0.06]
                dark:bg-[#05080d]
                dark:text-white
            "
        >
            {/* ======================================
                BACKGROUND ACCENTS
            ====================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    -left-24
                    -top-24

                    hidden
                    h-72
                    w-72

                    rounded-full
                    bg-cyan-500/[0.07]

                    blur-[100px]

                    sm:block

                    dark:bg-lime-500/[0.045]
                "
            />

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    -bottom-24
                    -right-24

                    hidden
                    h-72
                    w-72

                    rounded-full
                    bg-indigo-500/[0.07]

                    blur-[100px]

                    sm:block

                    dark:bg-indigo-500/[0.055]
                "
            />

            {/* ======================================
                TOP ACCENT
            ====================================== */}

            <div
                aria-hidden="true"
                className="
                    absolute
                    inset-x-0
                    top-0

                    h-px

                    bg-gradient-to-r
                    from-transparent
                    via-indigo-400/35
                    to-transparent

                    dark:via-cyan-400/20
                "
            />

            {/* ======================================
                CONTENT CONTAINER
            ====================================== */}

            <div
                className="
                    relative
                    z-10

                    mx-auto

                    w-full
                    max-w-[1540px]

                    px-4

                    sm:px-6
                    xl:px-8
                "
            >
                {/* ==================================
                    MAIN FOOTER GRID
                ================================== */}

                <div
                    className="
                        grid
                        min-w-0

                        grid-cols-1
                        gap-10

                        py-12

                        sm:py-14

                        lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]
                        lg:gap-12
                    "
                >
                    {/* BRAND */}

                    <FooterBrand release={release} />

                    {/* ==================================
                        NAVIGATION + CONNECT
                    ================================== */}

                    <nav
                        aria-label="Footer navigatsiyasi"

                        className="
                            grid
                            min-w-0

                            grid-cols-2
                            gap-x-5
                            gap-y-9

                            sm:grid-cols-3

                            lg:grid-cols-2

                            xl:grid-cols-3
                            xl:gap-x-7
                        "
                    >
                        {FOOTER_GROUPS.map((group) => (
                            <FooterNavigationGroup
                                key={group.title}
                                group={group}
                            />
                        ))}

                        <div
                            className="
                                col-span-2

                                sm:col-span-1

                                lg:col-span-2

                                xl:col-span-1
                            "
                        >
                            <FooterSocials />
                        </div>
                    </nav>
                </div>

                {/* ==================================
                    TECHNOLOGIES
                ================================== */}

                <FooterTechnologies />

                {/* ==================================
                    COPYRIGHT / BOTTOM BAR
                ================================== */}

                <div
                    className="
                        flex
                        min-w-0
                        flex-col

                        gap-4

                        border-t
                        border-[#e0e7f1]

                        py-5

                        sm:flex-row
                        sm:items-center
                        sm:justify-between

                        dark:border-white/[0.065]
                    "
                >
                    {/* COPYRIGHT */}

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

                            dark:text-gray-500
                        "
                    >
                        <span>
                            © {APP_CREATED_YEAR}
                            {String(APP_CREATED_YEAR) ===
                            String(currentYear)
                                ? ""
                                : `–${currentYear}`}{" "}
                            {APP_NAME}.
                        </span>

                        <span
                            aria-hidden="true"
                            className="
                                hidden
                                text-slate-300

                                sm:inline

                                dark:text-gray-700
                            "
                        >
                            /
                        </span>

                        <span>
                            Barcha huquqlar himoyalangan.
                        </span>

                        <span
                            aria-hidden="true"
                            className="
                                hidden
                                text-slate-300

                                sm:inline

                                dark:text-gray-700
                            "
                        >
                            /
                        </span>

                        <span
                            className="
                                inline-flex
                                items-center
                                gap-1.5
                            "
                        >
                            Built with

                            <Heart
                                size={12}
                                strokeWidth={2}
                                aria-hidden="true"

                                className="
                                    fill-pink-400/40
                                    text-pink-500

                                    dark:fill-pink-400/50
                                    dark:text-pink-400
                                "
                            />

                            by

                            <strong
                                className="
                                    text-indigo-700

                                    dark:text-indigo-300
                                "
                            >
                                {DEVELOPER_NAME}
                            </strong>
                        </span>
                    </div>

                    {/* ==================================
                        RIGHT ACTIONS
                    ================================== */}

                    <div
                        className="
                            flex
                            shrink-0
                            items-center

                            justify-between
                            gap-3

                            sm:justify-end
                        "
                    >
                        <span
                            className="
                                hidden

                                items-center
                                gap-1.5

                                font-mono
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-wider

                                text-slate-400

                                md:inline-flex

                                dark:text-gray-600
                            "
                        >
                            <ShieldCheck
                                size={13}
                                strokeWidth={2}
                                aria-hidden="true"
                            />

                            community driven
                        </span>

                        {/* SCROLL TO TOP */}

                        <button
                            type="button"
                            onClick={scrollToTop}

                            aria-label="Sahifa tepasiga qaytish"
                            title="Tepaga qaytish"

                            className="
                                group/top

                                grid
                                h-10
                                w-10
                                shrink-0

                                cursor-pointer

                                place-items-center

                                rounded-xl
                                border
                                border-[#dce4ef]

                                bg-white/80

                                text-slate-600

                                transition-colors
                                duration-150

                                hover:border-cyan-400/40
                                hover:bg-cyan-500/[0.06]
                                hover:text-cyan-700

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-indigo-500

                                dark:border-white/[0.08]
                                dark:bg-white/[0.035]
                                dark:text-gray-400

                                dark:hover:border-cyan-400/25
                                dark:hover:bg-cyan-400/[0.05]
                                dark:hover:text-cyan-300
                            "
                        >
                            <ArrowUp
                                size={17}
                                strokeWidth={2.2}
                                aria-hidden="true"

                                className="
                                    transition-transform
                                    duration-150

                                    group-hover/top:-translate-y-0.5

                                    motion-reduce:transform-none
                                "
                            />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default React.memo(Footer);
