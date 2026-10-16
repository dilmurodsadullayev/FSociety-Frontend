
import React from "react";

import {
    AlertTriangle,
    Loader2,
    RefreshCw,
} from "lucide-react";

// =========================================================
// FSOCIETY — PROBLEMS ERROR STATE
//
// Modes:
// - Compact warning (old data available)
// - Full error (no data available)
//
// Props preserved:
// - message
// - onRetry
// - isRetrying
// - hasData
//
// Features:
// - Light / Dark Mode
// - Responsive layout
// - Safe error messages
// - Loading / retry states
// - Accessible announcements
//
// No direct API requests.
// =========================================================

// =========================================================
// SAFE ERROR MESSAGE
// =========================================================

const getSafeErrorMessage = (value) => {
    const fallback =
        "Muammolarni yuklashda xatolik yuz berdi.";

    if (typeof value === "string") {
        return value.trim() || fallback;
    }

    if (Array.isArray(value)) {
        const firstMessage = value.find(
            (item) =>
                typeof item === "string" &&
                item.trim()
        );

        return firstMessage?.trim() || fallback;
    }

    if (value && typeof value === "object") {
        const candidates = [
            value.detail,
            value.message,
            value.error,
            value.response?.data?.detail,
            value.response?.data?.message,
        ];

        const firstMessage = candidates.find(
            (item) =>
                typeof item === "string" &&
                item.trim()
        );

        return firstMessage?.trim() || fallback;
    }

    return fallback;
};

// =========================================================
// RETRY BUTTON
// =========================================================

const RetryButton = React.memo(({
    onRetry,
    isRetrying = false,
    compact = false,
}) => {
    const busy = Boolean(isRetrying);

    const disabled =
        busy ||
        typeof onRetry !== "function";

    const handleRetry = () => {
        if (disabled) {
            return;
        }

        onRetry();
    };

    return (
        <button
            type="button"
            onClick={handleRetry}
            disabled={disabled}
            aria-busy={busy}

            className={`
                inline-flex
                min-h-11
                max-w-full

                items-center
                justify-center
                gap-2

                rounded-xl
                border

                px-4
                py-2.5

                font-display
                text-xs
                font-black

                transition-colors

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-offset-2

                disabled:cursor-not-allowed
                disabled:opacity-50

                ${
                    compact
                        ? `
                            border-amber-400/40
                            bg-amber-500/[0.08]
                            text-amber-900

                            hover:border-amber-400/60
                            hover:bg-amber-500/[0.14]

                            focus-visible:ring-amber-500

                            dark:border-amber-400/25
                            dark:bg-amber-500/[0.07]
                            dark:text-amber-200

                            dark:hover:bg-amber-500/[0.12]
                        `
                        : `
                            border-red-600
                            bg-red-600
                            text-white

                            hover:border-red-700
                            hover:bg-red-700

                            focus-visible:ring-red-500

                            dark:border-red-500/40
                            dark:bg-red-600

                            dark:hover:bg-red-500
                        `
                }

                dark:focus-visible:ring-offset-[#0b0f18]
            `}
        >
            {busy ? (
                <Loader2
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"

                    className="
                        shrink-0
                        animate-spin

                        motion-reduce:animate-none
                    "
                />
            ) : (
                <RefreshCw
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                    className="shrink-0"
                />
            )}

            <span>
                {busy
                    ? compact
                        ? "Yangilanmoqda..."
                        : "Qayta yuklanmoqda..."
                    : "Qayta urinish"}
            </span>
        </button>
    );
});

// =========================================================
// MAIN COMPONENT
// =========================================================

const ProblemsErrorState = ({
    message =
        "Muammolarni yuklashda xatolik yuz berdi.",

    onRetry,
    isRetrying = false,
    hasData = false,
}) => {
    // =====================================================
    // SAFE VALUES
    // =====================================================

    const errorText =
        getSafeErrorMessage(message);

    const compact =
        Boolean(hasData);

    const loading =
        Boolean(isRetrying);

    // =====================================================
    // COMPACT ERROR
    //
    // Displayed when previously loaded cards
    // can remain visible.
    // =====================================================

    if (compact) {
        return (
            <div
                role="alert"
                aria-busy={loading}

                className="
                    mb-6

                    w-full
                    min-w-0

                    overflow-hidden

                    rounded-2xl
                    border
                    border-amber-300

                    bg-amber-50/85

                    shadow-[0_8px_25px_rgba(120,53,15,0.035)]

                    dark:border-amber-400/[0.18]
                    dark:bg-amber-500/[0.055]
                    dark:shadow-black/10
                "
            >
                <div
                    className="
                        flex
                        min-w-0

                        flex-col
                        gap-4

                        p-4

                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        sm:gap-5
                    "
                >
                    {/* MESSAGE */}

                    <div
                        className="
                            flex
                            min-w-0

                            items-start
                            gap-3
                        "
                    >
                        {/* ICON */}

                        <div
                            className="
                                grid
                                h-10
                                w-10
                                shrink-0

                                place-items-center

                                rounded-xl
                                border
                                border-amber-400/30

                                bg-amber-500/[0.10]

                                text-amber-800

                                dark:border-amber-400/20
                                dark:bg-amber-400/[0.08]
                                dark:text-amber-300
                            "
                        >
                            <AlertTriangle
                                size={18}
                                strokeWidth={1.9}
                                aria-hidden="true"
                            />
                        </div>

                        {/* TEXT */}

                        <div className="min-w-0 flex-1">
                            <h3
                                className="
                                    break-words

                                    font-display
                                    text-sm
                                    font-black

                                    text-amber-950

                                    dark:text-amber-200
                                "
                            >
                                Ma’lumotlarni yangilab bo‘lmadi
                            </h3>

                            <p
                                className="
                                    mt-1

                                    whitespace-pre-wrap
                                    break-words
                                    [overflow-wrap:anywhere]

                                    text-xs
                                    font-medium
                                    leading-6

                                    text-amber-900

                                    dark:text-amber-100/85
                                "
                            >
                                {errorText}
                            </p>

                            <p
                                className="
                                    mt-1

                                    text-[11px]
                                    font-medium
                                    leading-5

                                    text-amber-800/80

                                    dark:text-gray-400
                                "
                            >
                                Oldingi yuklangan natijalar
                                vaqtincha ko‘rsatilmoqda.
                            </p>
                        </div>
                    </div>

                    {/* RETRY */}

                    <div
                        className="
                            flex
                            w-full
                            shrink-0
                            justify-start

                            sm:w-auto
                        "
                    >
                        <RetryButton
                            onRetry={onRetry}
                            isRetrying={loading}
                            compact
                        />
                    </div>
                </div>
            </div>
        );
    }

    // =====================================================
    // FULL ERROR
    //
    // Displayed when no usable results exist.
    // =====================================================

    return (
        <div
            role="alert"
            aria-busy={loading}

            className="
                relative

                mb-8

                w-full
                min-w-0

                overflow-hidden

                rounded-[22px]
                border
                border-red-200

                bg-white

                shadow-[0_12px_40px_rgba(127,29,29,0.045)]

                sm:rounded-[28px]

                dark:border-red-400/[0.18]
                dark:bg-[#0b0f18]
                dark:shadow-black/20
            "
        >
            {/* BACKGROUND GLOW */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    left-1/2
                    top-0

                    h-48
                    w-72

                    max-w-full

                    -translate-x-1/2
                    -translate-y-1/2

                    rounded-full

                    bg-red-500/[0.07]

                    blur-[80px]

                    dark:bg-red-500/[0.09]
                "
            />

            {/* CONTENT */}

            <div
                className="
                    relative
                    z-10

                    flex
                    min-w-0

                    flex-col
                    items-center

                    px-4
                    py-9

                    text-center

                    sm:px-8
                    sm:py-11
                "
            >
                {/* ICON */}

                <div
                    className="
                        grid
                        h-16
                        w-16
                        shrink-0

                        place-items-center

                        rounded-[20px]
                        border
                        border-red-400/30

                        bg-red-500/[0.07]

                        text-red-700

                        dark:border-red-400/20
                        dark:bg-red-500/[0.08]
                        dark:text-red-300
                    "
                >
                    <AlertTriangle
                        size={27}
                        strokeWidth={1.8}
                        aria-hidden="true"
                    />
                </div>

                {/* SYSTEM LABEL */}

                <div
                    className="
                        mt-5

                        inline-flex
                        max-w-full

                        items-center
                        gap-2

                        rounded-full
                        border
                        border-red-400/25

                        bg-red-500/[0.05]

                        px-3
                        py-1.5

                        font-mono
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.12em]

                        text-red-700

                        dark:border-red-400/15
                        dark:text-red-300
                    "
                >
                    <span
                        aria-hidden="true"

                        className="
                            h-1.5
                            w-1.5

                            shrink-0

                            rounded-full

                            bg-red-500

                            dark:bg-red-400
                        "
                    />

                    request.failed
                </div>

                {/* TITLE */}

                <h3
                    className="
                        mt-4

                        break-words

                        font-display
                        text-xl
                        font-black
                        tracking-tight

                        text-slate-900

                        sm:text-2xl

                        dark:text-white
                    "
                >
                    Muammolarni yuklab bo‘lmadi
                </h3>

                {/* ERROR MESSAGE */}

                <p
                    className="
                        mt-3
                        max-w-lg

                        whitespace-pre-wrap
                        break-words
                        [overflow-wrap:anywhere]

                        text-[13px]
                        font-medium
                        leading-6

                        text-red-800

                        sm:text-sm
                        sm:leading-7

                        dark:text-red-200/85
                    "
                >
                    {errorText}
                </p>

                {/* HELP */}

                <p
                    className="
                        mt-2
                        max-w-md

                        text-xs
                        font-medium
                        leading-5

                        text-slate-600

                        dark:text-gray-400
                    "
                >
                    Internet aloqasini yoki server
                    holatini tekshirib, qayta urinib
                    ko‘ring.
                </p>

                {/* RETRY */}

                <div
                    className="
                        mt-6

                        flex
                        w-full
                        min-w-0

                        justify-center
                    "
                >
                    <RetryButton
                        onRetry={onRetry}
                        isRetrying={loading}
                    />
                </div>
            </div>
        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(ProblemsErrorState);
