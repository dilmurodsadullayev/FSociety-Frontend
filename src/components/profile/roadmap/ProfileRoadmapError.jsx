
import React, { memo } from "react";

import {
    AlertTriangle,
    RefreshCw,
} from "lucide-react";

// =========================================================
// CONFIG
// =========================================================

const DEFAULT_FETCH_MESSAGE =
    "Roadmaplarni yuklab bo‘lmadi.";

const DEFAULT_ACTION_MESSAGE =
    "Amalni bajarishda xatolik yuz berdi.";

const ERROR_FIELD_LABELS = {
    title: "Sarlavha",
    type: "Roadmap turi",
    description: "Tavsif",
    started_at: "Boshlanish sanasi",
    finished_at: "Tugash sanasi",
    non_field_errors: "Xatolik",
};

// =========================================================
// ERROR NORMALIZER
//
// Supports:
// - String
// - Error
// - Axios / DRF response
// - Validation arrays
// - Field error objects
//
// Prevents [object Object] in the UI.
// =========================================================

const parseErrorValue = (value, depth = 0) => {
    if (depth > 5 || value == null) {
        return "";
    }

    if (typeof value === "string") {
        return value.trim();
    }

    if (
        typeof value === "number" ||
        typeof value === "boolean"
    ) {
        return String(value);
    }

    if (Array.isArray(value)) {
        return value
            .map((item) =>
                parseErrorValue(item, depth + 1)
            )
            .filter(Boolean)
            .join("; ");
    }

    if (typeof value === "object") {
        for (const key of [
            "detail",
            "message",
            "error",
            "non_field_errors",
        ]) {
            if (value[key]) {
                const message = parseErrorValue(
                    value[key],
                    depth + 1
                );

                if (message) {
                    return message;
                }
            }
        }

        return Object.entries(value)
            .filter(
                ([field]) =>
                    ![
                        "response",
                        "request",
                        "config",
                        "stack",
                    ].includes(field)
            )
            .map(([field, fieldErrors]) => {
                const message = parseErrorValue(
                    fieldErrors,
                    depth + 1
                );

                if (!message) {
                    return "";
                }

                const label =
                    ERROR_FIELD_LABELS[field] ||
                    field;

                return `${label}: ${message}`;
            })
            .filter(Boolean)
            .join("; ");
    }

    return "";
};

const getErrorMessage = (error, fallback) => {
    if (!error) {
        return fallback;
    }

    const responseData =
        error?.serverData ??
        error?.response?.data;

    if (responseData) {
        const message =
            parseErrorValue(responseData);

        if (message) {
            return message;
        }
    }

    return (
        parseErrorValue(error) ||
        fallback
    );
};

// =========================================================
// RETRY BUTTON
//
// Only renders when a retry callback exists.
// =========================================================

const RetryButton = memo(function RetryButton({
    onRetry,
    isLoading = false,
}) {
    if (typeof onRetry !== "function") {
        return null;
    }

    return (
        <button
            type="button"
            onClick={onRetry}
            disabled={isLoading}
            className="
                inline-flex
                min-h-[42px]

                items-center
                justify-center
                gap-2

                rounded-xl
                border
                border-indigo-400/30

                bg-indigo-600

                px-5
                py-2.5

                text-xs
                font-black
                text-white

                shadow-lg
                shadow-indigo-600/15

                transition-all

                hover:bg-indigo-500

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500/50

                disabled:cursor-not-allowed
                disabled:opacity-50
            "
        >
            <RefreshCw
                size={15}
                aria-hidden="true"
                className={
                    isLoading
                        ? "animate-spin motion-reduce:animate-none"
                        : ""
                }
            />

            {isLoading
                ? "Yuklanmoqda..."
                : "Qayta urinish"}
        </button>
    );
});

// =========================================================
// FULL FETCH ERROR
//
// Shown when roadmap list cannot be loaded.
//
// Original empty/error screen behavior preserved.
//
// The header and buttons are handled by the
// parent ProfileRoadmap.jsx.
// =========================================================

const RoadmapFetchError = memo(
    function RoadmapFetchError({
        error,
        onRetry,
        isLoading,
    }) {
        const message = getErrorMessage(
            error,
            DEFAULT_FETCH_MESSAGE
        );

        return (
            <section
                role="alert"
                aria-label="Roadmap yuklash xatoligi"
                className="
                    relative
                    min-w-0
                    overflow-hidden

                    rounded-[28px]
                    border
                    border-red-200

                    bg-white/95

                    p-6
                    text-center

                    shadow-[0_12px_35px_rgba(15,23,42,0.06)]

                    dark:border-red-400/15
                    dark:bg-[#0b1018]/90

                    dark:shadow-2xl
                    dark:shadow-black/20

                    sm:p-8
                "
            >
                {/* BACKGROUND GLOWS */}

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute
                        -right-20
                        -top-20

                        h-56
                        w-56

                        rounded-full
                        bg-red-500/[0.07]
                        blur-[80px]
                    "
                />

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute
                        -bottom-20
                        -left-20

                        h-56
                        w-56

                        rounded-full
                        bg-indigo-500/[0.06]
                        blur-[80px]
                    "
                />

                {/* CONTENT */}

                <div
                    className="
                        relative
                        z-10

                        mx-auto
                        flex
                        max-w-2xl
                        flex-col
                        items-center

                        py-8
                        text-center

                        sm:py-12
                    "
                >
                    {/* ERROR ICON */}

                    <div
                        className="
                            flex
                            h-20
                            w-20

                            items-center
                            justify-center

                            rounded-[24px]
                            border
                            border-red-200

                            bg-red-50
                            text-red-600

                            dark:border-red-400/20
                            dark:bg-red-500/[0.08]
                            dark:text-red-300
                        "
                    >
                        <AlertTriangle
                            size={32}
                            aria-hidden="true"
                        />
                    </div>

                    {/* TITLE */}

                    <p
                        className="
                            mt-5
                            text-[10px]
                            font-black

                            uppercase
                            tracking-[0.18em]

                            text-red-600
                            dark:text-red-400
                        "
                    >
                        F.Society Roadmap
                    </p>

                    <h3
                        className="
                            mt-2
                            text-xl
                            font-black
                            tracking-tight

                            text-slate-900
                            dark:text-white

                            sm:text-2xl
                        "
                    >
                        Roadmaplarni yuklab bo‘lmadi
                    </h3>

                    {/* MESSAGE */}

                    <p
                        className="
                            mt-3
                            max-w-xl

                            break-words
                            text-sm
                            font-medium
                            leading-7

                            text-red-700
                            dark:text-red-200
                        "
                    >
                        {message}
                    </p>

                    {/* RETRY */}

                    <div className="mt-6">
                        <RetryButton
                            onRetry={onRetry}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </section>
        );
    }
);

// =========================================================
// ACTION ERROR
//
// Used for:
// - Delete error
// - Like/unlike error
//
// Existing roadmap content remains visible.
// =========================================================

const RoadmapActionError = memo(
    function RoadmapActionError({ error }) {
        const message = getErrorMessage(
            error,
            DEFAULT_ACTION_MESSAGE
        );

        return (
            <div
                role="alert"
                className="
                    flex
                    min-w-0

                    items-start
                    gap-3

                    rounded-2xl
                    border
                    border-red-200

                    bg-red-50

                    p-4

                    dark:border-red-400/20
                    dark:bg-red-500/[0.06]
                "
            >
                {/* ERROR ICON */}

                <AlertTriangle
                    size={18}
                    aria-hidden="true"
                    className="
                        mt-0.5
                        shrink-0

                        text-red-600
                        dark:text-red-300
                    "
                />

                {/* ERROR TEXT */}

                <div className="min-w-0">
                    <p
                        className="
                            text-[10px]
                            font-black

                            uppercase
                            tracking-wider

                            text-red-700
                            dark:text-red-300
                        "
                    >
                        Xatolik
                    </p>

                    <p
                        className="
                            mt-1
                            break-words

                            text-xs
                            font-medium
                            leading-6

                            text-red-700
                            dark:text-red-200
                        "
                    >
                        {message}
                    </p>
                </div>
            </div>
        );
    }
);

// =========================================================
// PROFILE ROADMAP ERROR
//
// Props:
//
// variant:
//   "fetch"  -> Full roadmap fetch error
//   "action" -> Delete / like error
//
// error:
//   Error message or API error object.
//
// onRetry:
//   Fetch retry callback.
//
// isLoading:
//   Disables retry while loading.
//
// No Redux or API dependency.
// =========================================================

const ProfileRoadmapError = ({
    variant = "fetch",
    error,
    onRetry,
    isLoading = false,
}) => {
    if (!error) {
        return null;
    }

    if (variant === "action") {
        return (
            <RoadmapActionError
                error={error}
            />
        );
    }

    return (
        <RoadmapFetchError
            error={error}
            onRetry={onRetry}
            isLoading={isLoading}
        />
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfileRoadmapError);
