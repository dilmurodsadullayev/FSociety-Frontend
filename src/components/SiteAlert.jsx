
import React, {
    memo,
    useEffect,
    useRef,
} from "react";

import {
    AlertCircle,
    AlertTriangle,
    CheckCircle2,
    Info,
    X,
} from "lucide-react";

// =========================================================
// FSOCIETY — SITE ALERT
//
// Supported alert types:
// - success
// - error
// - warning
// - info
//
// Public props:
// - alert
// - onClose
//
// Supported alert fields:
// - id
// - type
// - title
// - message
// - code
// - duration
//
// Features:
// - Light / Dark Mode
// - Responsive notification layout
// - Automatic dismissal
// - Manual close button
// - Animated progress indicator
// - Accessible notifications
// - Reduced-motion support
// - Safe timeout cleanup
// =========================================================

// =========================================================
// CONSTANTS
// =========================================================

const DEFAULT_DURATION = 3500;

// =========================================================
// ALERT STYLES
// =========================================================

const ALERT_STYLES = {
    success: {
        Icon: CheckCircle2,

        border: `
            border-emerald-200
            dark:border-emerald-400/30
        `,

        background: `
            bg-white/95
            dark:bg-[#0c1918]/95
        `,

        iconBackground: `
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

        line: "bg-emerald-500",

        glow: `
            bg-emerald-400/10
            dark:bg-emerald-400/10
        `,

        code: "SUCCESS",
    },

    error: {
        Icon: AlertCircle,

        border: `
            border-rose-200
            dark:border-rose-400/30
        `,

        background: `
            bg-white/95
            dark:bg-[#1b1118]/95
        `,

        iconBackground: `
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

        line: "bg-rose-500",

        glow: `
            bg-rose-400/10
            dark:bg-rose-400/10
        `,

        code: "ERROR",
    },

    warning: {
        Icon: AlertTriangle,

        border: `
            border-amber-200
            dark:border-amber-400/30
        `,

        background: `
            bg-white/95
            dark:bg-[#1b1810]/95
        `,

        iconBackground: `
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

        line: "bg-amber-500",

        glow: `
            bg-amber-400/10
            dark:bg-amber-400/10
        `,

        code: "WARNING",
    },

    info: {
        Icon: Info,

        border: `
            border-cyan-200
            dark:border-cyan-400/30
        `,

        background: `
            bg-white/95
            dark:bg-[#0b1720]/95
        `,

        iconBackground: `
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

        line: "bg-cyan-500",

        glow: `
            bg-cyan-400/10
            dark:bg-cyan-400/10
        `,

        code: "INFO",
    },
};

// =========================================================
// HELPERS
// =========================================================

const getAlertDuration = (value) => {
    // duration={0} means the alert stays open
    // until the user closes it.

    if (value === 0) {
        return 0;
    }

    const duration = Number(value);

    if (
        value !== null &&
        value !== undefined &&
        value !== "" &&
        Number.isFinite(duration) &&
        duration > 0
    ) {
        return duration;
    }

    return DEFAULT_DURATION;
};

const getAlertType = (value) => {
    const type = String(
        value ?? "info"
    ).trim().toLowerCase();

    return Object.prototype.hasOwnProperty.call(
        ALERT_STYLES,
        type
    )
        ? type
        : "info";
};

const getAlertText = (value, fallback = "") => {
    if (value === null || value === undefined) {
        return fallback;
    }

    if (typeof value === "string") {
        return value;
    }

    if (
        typeof value === "number" ||
        typeof value === "boolean"
    ) {
        return String(value);
    }

    if (Array.isArray(value)) {
        return value
            .map((item) => getAlertText(item))
            .filter(Boolean)
            .join(", ");
    }

    if (typeof value === "object") {
        const detail =
            value.detail ??
            value.message ??
            value.error;

        if (detail !== undefined) {
            return getAlertText(detail, fallback);
        }
    }

    return fallback;
};

// =========================================================
// MAIN COMPONENT
// =========================================================

const SiteAlert = ({
    alert,
    onClose,
}) => {
    // =====================================================
    // CLOSE CALLBACK REFERENCE
    //
    // Updating onClose should not restart
    // the dismissal timeout.
    // =====================================================

    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    // =====================================================
    // ALERT CONFIGURATION
    // =====================================================

    const type = getAlertType(
        alert?.type
    );

    const style = ALERT_STYLES[type];

    const Icon = style.Icon;

    const duration = getAlertDuration(
        alert?.duration
    );

    const title = getAlertText(
        alert?.title,
        "FSociety Alert"
    );

    const message = getAlertText(
        alert?.message
    );

    const code = getAlertText(
        alert?.code,
        style.code
    );

    const isImportant =
        type === "error" ||
        type === "warning";

    const hasCloseHandler =
        typeof onClose === "function";

    const showProgress =
        duration > 0 &&
        hasCloseHandler;

    // =====================================================
    // ALERT IDENTITY
    //
    // New alerts should restart their
    // entry / progress animations.
    // =====================================================

    const alertKey = [
        alert?.id ?? "",
        type,
        title,
        message,
        code,
        duration,
    ].join("|");

    // =====================================================
    // AUTOMATIC DISMISSAL
    //
    // - Cleanup old timeout
    // - Create a new timeout for a new alert
    // - Avoid stale onClose callbacks
    // - duration={0}: persistent alert
    // =====================================================

    useEffect(() => {
        if (
            !alert ||
            duration === 0
        ) {
            return undefined;
        }

        const timer = window.setTimeout(() => {
            if (
                typeof onCloseRef.current === "function"
            ) {
                onCloseRef.current();
            }
        }, duration);

        return () => {
            window.clearTimeout(timer);
        };
    }, [
        alert,
        duration,
    ]);

    // =====================================================
    // NOTHING TO RENDER
    // =====================================================

    if (!alert) {
        return null;
    }

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <>
            {/* ======================================
                ALERT ANIMATIONS
            ====================================== */}

            <style>
                {`
                    @keyframes fsociety-alert-in {
                        from {
                            opacity: 0;
                            transform:
                                translateY(-14px)
                                scale(0.97);
                        }

                        to {
                            opacity: 1;
                            transform:
                                translateY(0)
                                scale(1);
                        }
                    }

                    @keyframes fsociety-alert-progress {
                        from {
                            transform: scaleX(1);
                        }

                        to {
                            transform: scaleX(0);
                        }
                    }

                    .fsociety-alert-enter {
                        animation:
                            fsociety-alert-in
                            260ms
                            cubic-bezier(0.16, 1, 0.3, 1)
                            both;
                    }

                    .fsociety-alert-progress {
                        transform-origin: left center;
                    }

                    @media (prefers-reduced-motion: reduce) {
                        .fsociety-alert-enter {
                            animation: none !important;
                        }

                        .fsociety-alert-progress {
                            animation: none !important;
                            transform: scaleX(1);
                        }

                        .fsociety-alert-cursor {
                            animation: none !important;
                        }
                    }
                `}
            </style>

            {/* ======================================
                RESPONSIVE FIXED CONTAINER

                Mobile:
                - Full available width
                - Safe horizontal spacing

                Desktop:
                - Top-right notification
                - Maximum 420px width
            ====================================== */}

            <div
                className="
                    pointer-events-none

                    fixed
                    inset-x-3
                    top-20

                    z-[9999]

                    sm:inset-x-auto
                    sm:right-6
                    sm:top-24
                    sm:w-[420px]
                    sm:max-w-[calc(100vw-3rem)]
                "
            >
                {/* ==================================
                    ALERT PANEL
                ================================== */}

                <div
                    key={alertKey}

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
                        fsociety-alert-enter

                        pointer-events-auto

                        relative

                        w-full
                        min-w-0

                        overflow-hidden

                        rounded-2xl

                        border

                        ${style.border}
                        ${style.background}

                        shadow-[0_20px_55px_rgba(15,23,42,0.16)]

                        backdrop-blur-xl

                        sm:rounded-[22px]

                        dark:shadow-[0_24px_65px_rgba(0,0,0,0.42)]
                    `}
                >
                    {/* ==================================
                        DECORATIVE GLOW
                    ================================== */}

                    <div
                        aria-hidden="true"

                        className={`
                            pointer-events-none

                            absolute
                            -right-10
                            -top-12

                            h-36
                            w-36

                            rounded-full

                            blur-3xl

                            ${style.glow}
                        `}
                    />

                    {/* ==================================
                        LEFT ACCENT
                    ================================== */}

                    <div
                        aria-hidden="true"

                        className={`
                            absolute
                            inset-y-0
                            left-0

                            w-[3px]

                            ${style.line}
                        `}
                    />

                    {/* ==================================
                        ALERT CONTENT
                    ================================== */}

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
                        {/* ==========================
                            ICON
                        ========================== */}

                        <div
                            aria-hidden="true"

                            className={`
                                flex

                                h-10
                                w-10

                                shrink-0

                                items-center
                                justify-center

                                rounded-xl

                                border

                                ${style.iconBackground}
                                ${style.iconColor}

                                sm:h-12
                                sm:w-12
                                sm:rounded-2xl
                            `}
                        >
                            <Icon
                                size={21}
                                strokeWidth={2}

                                className="
                                    sm:h-6
                                    sm:w-6
                                "
                            />
                        </div>

                        {/* ==========================
                            MESSAGE CONTENT
                        ========================== */}

                        <div
                            className="
                                min-w-0
                                flex-1

                                pt-0.5
                            "
                        >
                            {/* SYSTEM INFORMATION */}

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
                                {/* CODE */}

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

                                        ${style.codeColor}
                                    `}
                                >
                                    fsociety::{code}
                                </span>

                                {/* SEPARATOR */}

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

                                {/* TIME LABEL */}

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

                            <h3
                                className="
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
                                {title}

                                <span
                                    aria-hidden="true"

                                    className="
                                        fsociety-alert-cursor

                                        ml-1

                                        animate-pulse

                                        text-slate-400

                                        dark:text-slate-500

                                        motion-reduce:animate-none
                                    "
                                >
                                    _
                                </span>
                            </h3>

                            {/* MESSAGE */}

                            {message && (
                                <p
                                    className="
                                        mt-2

                                        whitespace-pre-wrap

                                        break-words

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
                                    {message}
                                </p>
                            )}
                        </div>

                        {/* ==========================
                            CLOSE BUTTON
                        ========================== */}

                        {hasCloseHandler && (
                            <button
                                type="button"

                                onClick={onClose}

                                aria-label="Xabarni yopish"

                                title="Xabarni yopish"

                                className="
                                    flex

                                    h-10
                                    w-10

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

                                    dark:active:bg-white/[0.12]

                                    motion-reduce:transition-none
                                "
                            >
                                <X
                                    size={18}
                                    strokeWidth={2.2}

                                    aria-hidden="true"
                                />
                            </button>
                        )}
                    </div>

                    {/* ==================================
                        PROGRESS BACKGROUND
                    ================================== */}

                    {showProgress && (
                        <div
                            aria-hidden="true"

                            className="
                                h-1
                                w-full

                                overflow-hidden

                                bg-slate-200/80

                                dark:bg-white/[0.10]
                            "
                        >
                            {/* ======================
                                ANIMATED PROGRESS BAR
                            ====================== */}

                            <div
                                className={`
                                    fsociety-alert-progress

                                    h-full
                                    w-full

                                    ${style.line}
                                `}

                                style={{
                                    animation:
                                        `fsociety-alert-progress ` +
                                        `${duration}ms linear forwards`,
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(SiteAlert);
