
import React, { memo } from "react";

import toast, {
    Toaster,
} from "react-hot-toast";

import {
    AlertCircle,
    CheckCircle2,
    CircleAlert,
    Info,
    LoaderCircle,
    X,
} from "lucide-react";

// =========================================================
// FSOCIETY — GLOBAL AUTH / SITE TOAST
//
// Public API:
//
// siteToast.success(message, options)
// siteToast.error(message, options)
// siteToast.warning(message, options)
// siteToast.info(message, options)
// siteToast.loading(message, options)
// siteToast.update(id, type, message, options)
// siteToast.dismiss(id)
// siteToast.dismissAll()
//
// Backward compatibility:
//
// authToast.success(...)
// authToast.error(...)
// etc.
//
// Features:
//
// - Light / Dark Mode
// - Responsive layout
// - Lucide icons
// - Loading spinner
// - Progress animation
// - Auto dismissal
// - Manual dismissal
// - Loading -> Success / Error
// - Reduced motion
// - Accessible notifications
// =========================================================

// =========================================================
// DEFAULT DURATIONS
// =========================================================

const DEFAULT_DURATION = Object.freeze({
    success: 3600,
    error: 5000,
    warning: 4400,
    info: 4000,
    loading: Infinity,
});

// =========================================================
// TOAST THEME CONFIGURATION
// =========================================================

const TOAST_CONFIG = {
    success: {
        title: "Muvaffaqiyat",
        code: "SUCCESS",

        Icon: CheckCircle2,

        border: `
            border-emerald-200
            dark:border-emerald-400/25
        `,

        background: `
            bg-white/95
            dark:bg-[#0b1a17]/95
        `,

        iconBox: `
            border-emerald-200
            bg-emerald-50

            dark:border-emerald-400/20
            dark:bg-emerald-400/10
        `,

        iconColor: `
            text-emerald-700
            dark:text-emerald-300
        `,

        codeColor: `
            text-emerald-700
            dark:text-emerald-300
        `,

        accent: "bg-emerald-500",

        glow: `
            bg-emerald-400/10
            dark:bg-emerald-400/10
        `,
    },

    error: {
        title: "Xatolik",
        code: "ERROR",

        Icon: AlertCircle,

        border: `
            border-rose-200
            dark:border-rose-400/25
        `,

        background: `
            bg-white/95
            dark:bg-[#1c1119]/95
        `,

        iconBox: `
            border-rose-200
            bg-rose-50

            dark:border-rose-400/20
            dark:bg-rose-400/10
        `,

        iconColor: `
            text-rose-700
            dark:text-rose-300
        `,

        codeColor: `
            text-rose-700
            dark:text-rose-300
        `,

        accent: "bg-rose-500",

        glow: `
            bg-rose-400/10
            dark:bg-rose-400/10
        `,
    },

    warning: {
        title: "Diqqat",
        code: "WARNING",

        Icon: CircleAlert,

        border: `
            border-amber-200
            dark:border-amber-400/25
        `,

        background: `
            bg-white/95
            dark:bg-[#1c180f]/95
        `,

        iconBox: `
            border-amber-200
            bg-amber-50

            dark:border-amber-400/20
            dark:bg-amber-400/10
        `,

        iconColor: `
            text-amber-700
            dark:text-amber-300
        `,

        codeColor: `
            text-amber-700
            dark:text-amber-300
        `,

        accent: "bg-amber-500",

        glow: `
            bg-amber-400/10
            dark:bg-amber-400/10
        `,
    },

    info: {
        title: "Ma’lumot",
        code: "INFO",

        Icon: Info,

        border: `
            border-cyan-200
            dark:border-cyan-400/25
        `,

        background: `
            bg-white/95
            dark:bg-[#0b1720]/95
        `,

        iconBox: `
            border-cyan-200
            bg-cyan-50

            dark:border-cyan-400/20
            dark:bg-cyan-400/10
        `,

        iconColor: `
            text-cyan-700
            dark:text-cyan-300
        `,

        codeColor: `
            text-cyan-700
            dark:text-cyan-300
        `,

        accent: "bg-cyan-500",

        glow: `
            bg-cyan-400/10
            dark:bg-cyan-400/10
        `,
    },

    loading: {
        title: "Jarayon",
        code: "PROCESS",

        Icon: LoaderCircle,

        border: `
            border-indigo-200
            dark:border-indigo-400/25
        `,

        background: `
            bg-white/95
            dark:bg-[#111526]/95
        `,

        iconBox: `
            border-indigo-200
            bg-indigo-50

            dark:border-indigo-400/20
            dark:bg-indigo-400/10
        `,

        iconColor: `
            text-indigo-700
            dark:text-indigo-300
        `,

        codeColor: `
            text-indigo-700
            dark:text-indigo-300
        `,

        accent: "bg-indigo-500",

        glow: `
            bg-indigo-400/10
            dark:bg-indigo-400/10
        `,
    },
};

// =========================================================
// HELPERS
// =========================================================

const normalizeToastType = (type) => {
    const value = String(
        type ?? "info"
    ).trim().toLowerCase();

    return Object.prototype.hasOwnProperty.call(
        TOAST_CONFIG,
        value
    )
        ? value
        : "info";
};

// =========================================================
// MESSAGE NORMALIZATION
//
// Preserve support for:
// - string
// - number
// - boolean
// - arrays
// - objects
//
// Prevent invalid React children.
// =========================================================

const normalizeMessage = (message) => {
    if (
        message === null ||
        message === undefined
    ) {
        return "";
    }

    if (typeof message === "string") {
        return message;
    }

    if (
        typeof message === "number" ||
        typeof message === "boolean"
    ) {
        return String(message);
    }

    if (Array.isArray(message)) {
        return message
            .map(normalizeMessage)
            .filter(Boolean)
            .join(", ");
    }

    if (typeof message === "object") {
        const detail =
            message.detail ??
            message.message ??
            message.error;

        if (
            detail !== undefined &&
            detail !== message
        ) {
            return normalizeMessage(detail);
        }

        try {
            return JSON.stringify(message);
        } catch {
            return "Xabarni ko‘rsatib bo‘lmadi.";
        }
    }

    return String(message);
};

// =========================================================
// SAFE OPTIONS
// =========================================================

const normalizeOptions = (options) => {
    if (
        !options ||
        typeof options !== "object" ||
        Array.isArray(options)
    ) {
        return {};
    }

    return options;
};

// =========================================================
// SAFE DURATION
//
// duration = Infinity:
// persistent notification.
//
// duration = 0:
// also treated as persistent.
//
// Other invalid values:
// use default duration.
// =========================================================

const normalizeDuration = (
    value,
    defaultDuration
) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return defaultDuration;
    }

    if (value === Infinity || value === 0) {
        return Infinity;
    }

    const number = Number(value);

    if (
        Number.isFinite(number) &&
        number > 0
    ) {
        return number;
    }

    return defaultDuration;
};

// =========================================================
// TOAST CONTENT
//
// This component only renders one notification.
//
// react-hot-toast manages:
// - Toast lifecycle
// - Toast ID
// - Auto dismissal
// - Visibility
// - Multiple notifications
// =========================================================

const SiteToastContent = memo(({
    t,
    type = "info",
    title,
    message,
    code,
    duration,
}) => {
    // =====================================================
    // CONFIG
    // =====================================================

    const normalizedType =
        normalizeToastType(type);

    const config =
        TOAST_CONFIG[normalizedType];

    const Icon = config.Icon;

    const isLoading =
        normalizedType === "loading";

    const isImportant =
        normalizedType === "error" ||
        normalizedType === "warning";

    const hasProgress =
        !isLoading &&
        Number.isFinite(duration) &&
        duration > 0;

    // =====================================================
    // TEXT
    // =====================================================

    const displayTitle =
        normalizeMessage(title) ||
        config.title;

    const displayMessage =
        normalizeMessage(message);

    const displayCode =
        normalizeMessage(code) ||
        config.code;

    // =====================================================
    // VISIBILITY
    // =====================================================

    const visible =
        Boolean(t.visible);

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div
            role={
                isImportant
                    ? "alert"
                    : "status"
            }

            aria-live={
                isImportant
                    ? "assertive"
                    : "polite"
            }

            aria-atomic="true"

            className={`
                pointer-events-auto

                relative

                w-[calc(100vw-24px)]
                max-w-[420px]
                min-w-0

                overflow-hidden

                rounded-2xl

                border

                ${config.border}
                ${config.background}

                shadow-[0_20px_55px_rgba(15,23,42,0.16)]

                backdrop-blur-xl

                transition-all
                duration-200
                ease-out

                sm:w-[420px]
                sm:rounded-[22px]

                dark:shadow-[0_24px_65px_rgba(0,0,0,0.42)]

                motion-reduce:transition-none

                ${
                    visible
                        ? `
                            translate-y-0
                            scale-100
                            opacity-100
                        `
                        : `
                            pointer-events-none
                            -translate-y-2
                            scale-[0.97]
                            opacity-0
                        `
                }
            `}
        >
            {/* ======================================
                AMBIENT GLOW
            ====================================== */}

            <div
                aria-hidden="true"

                className={`
                    pointer-events-none

                    absolute
                    -right-12
                    -top-12

                    h-36
                    w-36

                    rounded-full

                    blur-3xl

                    ${config.glow}
                `}
            />

            {/* ======================================
                LEFT ACCENT LINE
            ====================================== */}

            <div
                aria-hidden="true"

                className={`
                    absolute
                    inset-y-0
                    left-0

                    w-[3px]

                    ${config.accent}
                `}
            />

            {/* ======================================
                BODY
            ====================================== */}

            <div
                className="
                    relative

                    flex
                    min-w-0

                    items-start

                    gap-3

                    p-3.5
                    pl-4

                    sm:gap-4
                    sm:p-4
                    sm:pl-5
                "
            >
                {/* ==================================
                    ICON
                ================================== */}

                <div
                    aria-hidden="true"

                    className={`
                        relative

                        flex
                        h-10
                        w-10

                        shrink-0

                        items-center
                        justify-center

                        rounded-xl

                        border

                        ${config.iconBox}
                        ${config.iconColor}

                        sm:h-12
                        sm:w-12
                        sm:rounded-2xl
                    `}
                >
                    <Icon
                        size={21}
                        strokeWidth={2.15}

                        className={`
                            sm:h-[23px]
                            sm:w-[23px]

                            ${
                                isLoading
                                    ? `
                                        animate-spin
                                        motion-reduce:animate-none
                                    `
                                    : ""
                            }
                        `}
                    />

                    {/* DECORATIVE STATUS DOT */}

                    {!isLoading && (
                        <span
                            className={`
                                absolute

                                -bottom-1
                                -right-1

                                h-2.5
                                w-2.5

                                rounded-full

                                border-2

                                border-white

                                ${config.accent}

                                dark:border-[#101621]
                            `}
                        />
                    )}
                </div>

                {/* ==================================
                    CONTENT
                ================================== */}

                <div
                    className="
                        min-w-0
                        flex-1

                        pt-0.5
                    "
                >
                    {/* SYSTEM LABEL */}

                    <div
                        className="
                            mb-1.5

                            flex
                            min-w-0

                            flex-wrap

                            items-center

                            gap-x-2
                            gap-y-1
                        "
                    >
                        <span
                            className={`
                                min-w-0

                                break-all

                                font-mono
                                text-[10px]
                                font-black

                                uppercase
                                tracking-[0.08em]

                                sm:text-[11px]

                                ${config.codeColor}
                            `}
                        >
                            fsociety::{displayCode}
                        </span>

                        <span
                            aria-hidden="true"

                            className="
                                h-1
                                w-1

                                shrink-0

                                rounded-full

                                bg-slate-400

                                dark:bg-slate-600
                            "
                        />

                        <span
                            className="
                                shrink-0

                                font-mono
                                text-[10px]

                                text-slate-500

                                dark:text-slate-400
                            "
                        >
                            now
                        </span>
                    </div>

                    {/* TITLE */}

                    <div
                        className="
                            flex
                            min-w-0

                            items-start

                            justify-between
                            gap-2
                        "
                    >
                        <strong
                            className="
                                min-w-0

                                break-words

                                text-sm
                                font-black
                                leading-5

                                text-slate-900

                                sm:text-base

                                dark:text-white

                                [overflow-wrap:anywhere]
                            "
                        >
                            {displayTitle}

                            <span
                                aria-hidden="true"

                                className="
                                    ml-1

                                    animate-pulse

                                    text-slate-400

                                    dark:text-slate-500

                                    motion-reduce:animate-none
                                "
                            >
                                _
                            </span>
                        </strong>
                    </div>

                    {/* MESSAGE */}

                    {displayMessage && (
                        <p
                            className="
                                mt-2

                                max-h-44

                                overflow-y-auto
                                overscroll-contain

                                whitespace-pre-wrap

                                break-words

                                pr-1

                                text-xs
                                font-medium
                                leading-5

                                text-slate-600

                                sm:text-[13px]
                                sm:leading-6

                                dark:text-slate-300

                                [overflow-wrap:anywhere]
                            "
                        >
                            {displayMessage}
                        </p>
                    )}
                </div>

                {/* ==================================
                    CLOSE BUTTON
                ================================== */}

                <button
                    type="button"

                    onClick={() => {
                        toast.dismiss(t.id);
                    }}

                    aria-label="Xabarni yopish"

                    title="Xabarni yopish"

                    className="
                        flex

                        h-9
                        w-9

                        shrink-0

                        items-center
                        justify-center

                        rounded-xl

                        border
                        border-transparent

                        text-slate-500

                        transition-colors

                        hover:border-slate-200
                        hover:bg-slate-100
                        hover:text-slate-900

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-indigo-500

                        active:bg-slate-200

                        dark:text-slate-400

                        dark:hover:border-white/10
                        dark:hover:bg-white/[0.08]
                        dark:hover:text-white

                        motion-reduce:transition-none
                    "
                >
                    <X
                        size={17}
                        strokeWidth={2.2}
                        aria-hidden="true"
                    />
                </button>
            </div>

            {/* ======================================
                PROGRESS BAR
            ====================================== */}

            {hasProgress && (
                <div
                    aria-hidden="true"

                    className="
                        h-1
                        w-full

                        overflow-hidden

                        bg-slate-200/80

                        dark:bg-white/10
                    "
                >
                    <div
                        className={`
                            fsociety-toast-progress

                            h-full
                            w-full

                            ${config.accent}
                        `}

                        style={{
                            animationDuration:
                                `${duration}ms`,
                        }}
                    />
                </div>
            )}
        </div>
    );
});

// =========================================================
// SHOW TOAST
//
// One shared entry point for all toast types.
//
// Supports updating an existing toast by ID.
// =========================================================

const showToast = (
    type,
    message,
    options = {}
) => {
    // =====================================================
    // OPTIONS
    // =====================================================

    const safeOptions =
        normalizeOptions(options);

    const normalizedType =
        normalizeToastType(type);

    // =====================================================
    // DURATION
    // =====================================================

    const duration =
        normalizeDuration(
            safeOptions.duration,
            DEFAULT_DURATION[normalizedType]
        );

    // =====================================================
    // CONTENT
    // =====================================================

    const title =
        safeOptions.title;

    const code =
        safeOptions.code;

    // =====================================================
    // CREATE OR UPDATE TOAST
    //
    // Passing an existing ID replaces that toast
    // rather than creating another notification.
    // =====================================================

    return toast.custom(
        (t) => (
            <SiteToastContent
                key={[
                    t.id,
                    normalizedType,
                    duration,
                    normalizeMessage(message),
                ].join(":")}

                t={t}

                type={normalizedType}

                title={title}

                message={message}

                code={code}

                duration={duration}
            />
        ),

        {
            id: safeOptions.id,
            duration,
        }
    );
};

// =========================================================
// GLOBAL SITE TOAST API
//
// Important:
// Keep these public method names unchanged.
//
// Other components already use this object.
// =========================================================

export const siteToast = {
    // =====================================================
    // SUCCESS
    // =====================================================

    success(
        message,
        options = {}
    ) {
        return showToast(
            "success",
            message,
            options
        );
    },

    // =====================================================
    // ERROR
    // =====================================================

    error(
        message,
        options = {}
    ) {
        return showToast(
            "error",
            message,
            options
        );
    },

    // =====================================================
    // WARNING
    // =====================================================

    warning(
        message,
        options = {}
    ) {
        return showToast(
            "warning",
            message,
            options
        );
    },

    // =====================================================
    // INFO
    // =====================================================

    info(
        message,
        options = {}
    ) {
        return showToast(
            "info",
            message,
            options
        );
    },

    // =====================================================
    // LOADING
    //
    // Default: persistent until updated
    // or dismissed.
    // =====================================================

    loading(
        message = "Jarayon bajarilmoqda...",
        options = {}
    ) {
        const safeOptions =
            normalizeOptions(options);

        return showToast(
            "loading",
            message,
            {
                ...safeOptions,

                duration:
                    safeOptions.duration ??
                    Infinity,
            }
        );
    },

    // =====================================================
    // UPDATE EXISTING TOAST
    //
    // Example:
    //
    // const id = siteToast.loading("Yuklanmoqda...");
    //
    // siteToast.update(
    //     id,
    //     "success",
    //     "Tayyor!"
    // );
    //
    // Also supports:
    //
    // siteToast.success("Tayyor!", { id });
    // =====================================================

    update(
        id,
        type,
        message,
        options = {}
    ) {
        const safeOptions =
            normalizeOptions(options);

        if (
            id === null ||
            id === undefined ||
            id === ""
        ) {
            return showToast(
                type,
                message,
                safeOptions
            );
        }

        return showToast(
            type,
            message,
            {
                ...safeOptions,
                id,
            }
        );
    },

    // =====================================================
    // DISMISS ONE
    // =====================================================

    dismiss(id) {
        if (
            id === null ||
            id === undefined ||
            id === ""
        ) {
            return;
        }

        toast.dismiss(id);
    },

    // =====================================================
    // DISMISS ALL
    // =====================================================

    dismissAll() {
        toast.dismiss();
    },
};

// =========================================================
// BACKWARD COMPATIBILITY
//
// Existing code:
//
// import { authToast } from "./ui/AuthToast";
//
// remains valid.
// =========================================================

export const authToast = siteToast;

// =========================================================
// GLOBAL TOASTER
//
// Render only once inside App.js.
//
// React Hot Toast manages stacking and timers.
//
// This component supplies:
// - Global position
// - Responsive container
// - Toast progress animation
// - Default background styles
// =========================================================

const AuthToast = () => {
    return (
        <>
            {/* ======================================
                GLOBAL ANIMATIONS
            ====================================== */}

            <style>
                {`
                    @keyframes fsociety-toast-progress {
                        from {
                            transform: scaleX(1);
                        }

                        to {
                            transform: scaleX(0);
                        }
                    }

                    .fsociety-toast-progress {
                        transform-origin: left center;

                        animation-name:
                            fsociety-toast-progress;

                        animation-timing-function:
                            linear;

                        animation-fill-mode:
                            forwards;
                    }

                    @media (prefers-reduced-motion: reduce) {
                        .fsociety-toast-progress {
                            animation: none !important;

                            transform: scaleX(1);
                        }
                    }
                `}
            </style>

            {/* ======================================
                REACT HOT TOAST CONTAINER
            ====================================== */}

            <Toaster
                position="top-right"

                reverseOrder={false}

                gutter={12}

                containerStyle={{
                    top:
                        "calc(env(safe-area-inset-top, 0px) + 82px)",

                    right: 12,
                    left: 12,

                    zIndex: 2147483647,

                    pointerEvents: "none",
                }}

                toastOptions={{
                    style: {
                        background: "transparent",

                        boxShadow: "none",

                        border: "none",

                        padding: 0,
                        margin: 0,

                        maxWidth: "none",
                    },
                }}
            />
        </>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(AuthToast);
