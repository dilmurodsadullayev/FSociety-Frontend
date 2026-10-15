
import React from "react";

import {
    AlertTriangle,
    ArrowRight,
    RefreshCw,
} from "lucide-react";

// =========================================================
// FSOCIETY — PROJECTS ERROR STATE
//
// Features:
// - Dark / Light Mode
// - Responsive layout
// - Safe error message rendering
// - Retry functionality
// - Accessible error announcement
// - Long-message handling
//
// Existing props preserved:
// - error
// - onRetry
// =========================================================

// =========================================================
// ERROR MESSAGE NORMALIZER
//
// Supports:
// - String
// - Error instance
// - API error objects
// - Axios response errors
// - Validation error arrays
//
// Never renders a raw object into JSX.
// =========================================================

const DEFAULT_ERROR_MESSAGE =
    "Loyihalarni yuklashda xatolik yuz berdi. " +
    "Internet aloqasini tekshirib, qayta urinib ko‘ring.";

const getSafeErrorMessage = (error) => {
    if (!error) {
        return "";
    }

    // =====================================================
    // STRING
    // =====================================================

    if (typeof error === "string") {
        return (
            error.trim() ||
            DEFAULT_ERROR_MESSAGE
        );
    }

    // =====================================================
    // ARRAY
    // =====================================================

    if (Array.isArray(error)) {
        const messages = error
            .map((item) => {
                if (typeof item === "string") {
                    return item.trim();
                }

                if (
                    item &&
                    typeof item.message === "string"
                ) {
                    return item.message.trim();
                }

                return "";
            })
            .filter(Boolean);

        return (
            messages.join(", ") ||
            DEFAULT_ERROR_MESSAGE
        );
    }

    // =====================================================
    // OBJECT / ERROR INSTANCE
    // =====================================================

    if (typeof error === "object") {
        const responseData =
            error.response?.data;

        const candidates = [
            error.message,
            error.detail,
            error.error,
            responseData?.detail,
            responseData?.message,
            responseData?.error,
            responseData?.non_field_errors,
        ];

        for (const candidate of candidates) {
            if (
                typeof candidate === "string" &&
                candidate.trim()
            ) {
                return candidate.trim();
            }

            if (Array.isArray(candidate)) {
                const messages = candidate
                    .filter(
                        (item) =>
                            typeof item === "string"
                    )
                    .map((item) => item.trim())
                    .filter(Boolean);

                if (messages.length > 0) {
                    return messages.join(", ");
                }
            }
        }
    }

    // =====================================================
    // FALLBACK
    // =====================================================

    return DEFAULT_ERROR_MESSAGE;
};

// =========================================================
// PROJECTS ERROR STATE
// =========================================================

const ProjectsErrorState = ({
    error,
    onRetry,
}) => {
    // =====================================================
    // HIDE WHEN NO ERROR
    // =====================================================

    if (!error) {
        return null;
    }

    // =====================================================
    // NORMALIZE ERROR
    // =====================================================

    const errorMessage =
        getSafeErrorMessage(error);

    const canRetry =
        typeof onRetry === "function";

    // =====================================================
    // JSX
    // =====================================================

    return (
        <div
            role="alert"
            aria-labelledby="projects-error-title"
            aria-describedby="projects-error-description"

            className="
                relative
                isolate
                mt-5

                flex
                w-full
                min-w-0

                flex-col

                gap-4

                overflow-hidden

                rounded-2xl
                border
                border-red-300/70

                bg-gradient-to-br
                from-red-50
                via-white
                to-rose-50/70

                p-4

                shadow-[0_6px_24px_rgba(185,28,28,0.035)]

                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:gap-5
                sm:p-5

                dark:border-red-400/[0.16]

                dark:from-[#211219]
                dark:via-[#191117]
                dark:to-[#151017]

                dark:shadow-none
            "
        >
            {/* ======================================
                LEFT ACCENT
            ====================================== */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    bottom-0
                    left-0
                    top-0

                    w-[3px]

                    bg-gradient-to-b
                    from-red-500/70
                    via-rose-500/40
                    to-transparent

                    dark:from-red-400/55
                    dark:via-rose-400/25
                "
            />

            {/* ======================================
                ERROR INFORMATION
            ====================================== */}

            <div
                className="
                    relative
                    z-10

                    flex
                    min-w-0
                    flex-1

                    items-start
                    gap-3
                "
            >
                {/* ==================================
                    ERROR ICON
                ================================== */}

                <div
                    className="
                        grid
                        h-11
                        w-11
                        shrink-0

                        place-items-center

                        rounded-xl
                        border
                        border-red-300/60

                        bg-red-500/[0.08]

                        text-red-700

                        dark:border-red-400/[0.18]
                        dark:bg-red-400/[0.08]
                        dark:text-red-300
                    "
                >
                    <AlertTriangle
                        size={20}
                        strokeWidth={1.9}
                        aria-hidden="true"
                    />
                </div>

                {/* ==================================
                    ERROR TEXT
                ================================== */}

                <div className="min-w-0 flex-1">

                    {/* ERROR LABEL */}

                    <div
                        className="
                            flex
                            min-w-0
                            flex-wrap
                            items-center
                            gap-2
                        "
                    >
                        <h3
                            id="projects-error-title"

                            className="
                                text-[13px]
                                font-black
                                leading-5

                                text-red-900

                                sm:text-[14px]

                                dark:text-red-200
                            "
                        >
                            Projectlarni yuklab bo‘lmadi
                        </h3>

                        <span
                            className="
                                inline-flex
                                shrink-0

                                items-center

                                rounded-md
                                border
                                border-red-300/60

                                bg-red-500/[0.06]

                                px-2
                                py-0.5

                                font-mono
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-[0.08em]

                                text-red-700

                                dark:border-red-400/[0.16]
                                dark:bg-red-400/[0.055]
                                dark:text-red-300
                            "
                        >
                            request failed
                        </span>
                    </div>

                    {/* ERROR DESCRIPTION */}

                    <p
                        id="projects-error-description"

                        className="
                            mt-2
                            max-w-3xl

                            whitespace-pre-wrap
                            break-words
                            [overflow-wrap:anywhere]

                            text-[12px]
                            font-medium
                            leading-6

                            text-red-800/85

                            sm:text-[13px]

                            dark:text-red-200/75
                        "
                    >
                        {errorMessage}
                    </p>

                    {/* HELPFUL HINT */}

                    <p
                        className="
                            mt-2

                            text-[10px]
                            font-medium
                            leading-5

                            text-slate-600

                            dark:text-gray-500
                        "
                    >
                        Muammo vaqtinchalik bo‘lishi mumkin.
                        Qayta urinib ko‘ring.
                    </p>
                </div>
            </div>

            {/* ======================================
                RETRY BUTTON
            ====================================== */}

            {canRetry && (
                <button
                    type="button"

                    onClick={onRetry}

                    className="
                        group/retry

                        relative
                        z-10

                        inline-flex
                        min-h-11
                        w-full
                        shrink-0

                        items-center
                        justify-center
                        gap-2.5

                        self-stretch

                        rounded-xl
                        border
                        border-red-300/70

                        bg-white/80

                        px-4
                        py-2.5

                        text-[12px]
                        font-bold

                        text-red-800

                        shadow-[0_3px_12px_rgba(185,28,28,0.035)]

                        transition-colors
                        duration-150

                        hover:border-red-400/70
                        hover:bg-red-100/80
                        hover:text-red-900

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-red-500
                        focus-visible:ring-offset-2

                        sm:w-auto
                        sm:self-center

                        dark:border-red-400/[0.18]
                        dark:bg-red-400/[0.075]
                        dark:text-red-200
                        dark:shadow-none

                        dark:hover:border-red-400/35
                        dark:hover:bg-red-400/[0.12]

                        dark:focus-visible:ring-offset-[#191117]
                    "
                >
                    <RefreshCw
                        size={15}
                        strokeWidth={2}
                        aria-hidden="true"

                        className="
                            shrink-0

                            transition-transform
                            duration-300

                            group-hover/retry:rotate-45

                            motion-reduce:transform-none
                        "
                    />

                    <span>
                        Qayta urinish
                    </span>

                    <ArrowRight
                        size={14}
                        strokeWidth={2}
                        aria-hidden="true"

                        className="
                            shrink-0

                            transition-transform
                            duration-150

                            group-hover/retry:translate-x-0.5

                            motion-reduce:transform-none
                        "
                    />
                </button>
            )}
        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(ProjectsErrorState);
