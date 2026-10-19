
import React, { memo } from "react";

import {
    AlertTriangle,
    Loader2,
    RefreshCcw,
} from "lucide-react";

// =========================================================
// FSOCIETY — PROFILE PROJECTS ERROR
//
// Variants:
//
// "fetch":
//   Failed to load profile projects.
//
// "create":
//   Failed to create a project.
//
// Props:
//
// variant
// error
// message
// onRetry
// isLoading
//
// This component does not:
// - Fetch projects itself
// - Dispatch Redux actions
// - Manage retry state
// - Close CreateProjectModal
// =========================================================

// =========================================================
// DEFAULT ERRORS
// =========================================================

const DEFAULT_FETCH_ERROR =
    "Loyihalarni yuklashda xatolik yuz berdi. " +
    "Internet aloqasini tekshirib, qayta urinib ko‘ring.";

const DEFAULT_CREATE_ERROR =
    "Loyihani yaratishda xatolik yuz berdi. " +
    "Ma’lumotlarni tekshirib, qayta urinib ko‘ring.";

// =========================================================
// NORMALIZE ERROR
//
// Supports:
// - String
// - Error instance
// - Axios response
// - DRF field validation
// =========================================================

const getSafeErrorMessage = (
    error,
    fallback
) => {
    if (
        typeof error === "string" &&
        error.trim()
    ) {
        return error.trim();
    }

    const data =
        error?.serverData ??
        error?.response?.data ??
        error;

    if (
        typeof data?.detail === "string" &&
        data.detail.trim()
    ) {
        return data.detail.trim();
    }

    if (
        typeof data?.message === "string" &&
        data.message.trim()
    ) {
        return data.message.trim();
    }

    if (
        data &&
        typeof data === "object" &&
        !Array.isArray(data)
    ) {
        const fieldMessages = Object.entries(data)
            .filter(
                ([field]) =>
                    ![
                        "stack",
                        "config",
                        "request",
                        "response",
                    ].includes(field)
            )
            .map(([field, value]) => {
                if (
                    Array.isArray(value)
                ) {
                    const text = value
                        .filter(
                            (item) =>
                                typeof item === "string"
                        )
                        .join("; ");

                    return text
                        ? `${field}: ${text}`
                        : "";
                }

                if (
                    typeof value === "string" &&
                    value.trim()
                ) {
                    return `${field}: ${value.trim()}`;
                }

                return "";
            })
            .filter(Boolean);

        if (fieldMessages.length > 0) {
            return fieldMessages.join("; ");
        }
    }

    if (
        typeof error?.message === "string" &&
        error.message.trim()
    ) {
        return error.message.trim();
    }

    return fallback;
};

// =========================================================
// CREATE ERROR
//
// Compact non-blocking panel.
//
// Profile projects and pagination remain visible.
// =========================================================

const CreateErrorPanel = memo(
    function CreateErrorPanel({
        message,
    }) {
        return (
            <div
                role="alert"
                aria-live="assertive"
                className="
                    flex
                    min-w-0

                    items-start
                    gap-3

                    rounded-2xl
                    border

                    border-red-200
                    bg-red-50

                    px-4
                    py-3.5

                    text-red-700

                    dark:border-red-400/20
                    dark:bg-red-500/[0.07]
                    dark:text-red-300
                "
            >
                <div
                    className="
                        flex
                        h-9
                        w-9
                        shrink-0

                        items-center
                        justify-center

                        rounded-xl

                        bg-red-100
                        dark:bg-red-500/[0.12]
                    "
                >
                    <AlertTriangle
                        size={17}
                        aria-hidden="true"
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <p
                        className="
                            text-xs
                            font-black

                            text-red-800
                            dark:text-red-200
                        "
                    >
                        Loyiha yaratishda xato
                    </p>

                    <p
                        className="
                            mt-1

                            break-words

                            text-xs
                            font-medium
                            leading-6

                            text-red-700/90
                            dark:text-red-300/90
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
// FETCH ERROR
//
// Full empty/error panel with optional retry button.
// =========================================================

const FetchErrorPanel = memo(
    function FetchErrorPanel({
        message,
        onRetry,
        isLoading,
    }) {
        const canRetry =
            typeof onRetry === "function";

        return (
            <section
                role="alert"
                aria-live="assertive"
                className="
                    relative
                    isolate

                    min-w-0
                    overflow-hidden

                    rounded-3xl
                    border

                    border-red-200
                    bg-red-50/70

                    px-5
                    py-10

                    text-center

                    shadow-sm

                    dark:border-red-400/20
                    dark:bg-[#170f16]/90
                    dark:shadow-none

                    sm:px-8
                    sm:py-12
                "
            >
                {/* =====================================
                    BACKGROUND GLOW
                ====================================== */}

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none

                        absolute
                        -right-24
                        -top-24

                        h-52
                        w-52

                        rounded-full

                        bg-red-500/[0.06]
                        blur-3xl

                        dark:bg-red-500/[0.10]
                    "
                />

                {/* =====================================
                    ERROR CONTENT
                ====================================== */}

                <div
                    className="
                        relative
                        z-10

                        mx-auto

                        flex
                        max-w-xl

                        flex-col
                        items-center
                    "
                >
                    {/* ICON */}

                    <div
                        className="
                            mb-5

                            flex
                            h-20
                            w-20

                            items-center
                            justify-center

                            rounded-[24px]
                            border

                            border-red-200
                            bg-red-100

                            text-red-600

                            dark:border-red-400/20
                            dark:bg-red-500/[0.10]
                            dark:text-red-300

                            sm:h-24
                            sm:w-24
                        "
                    >
                        <AlertTriangle
                            size={38}
                            strokeWidth={1.7}
                            aria-hidden="true"
                        />
                    </div>

                    {/* TITLE */}

                    <h3
                        className="
                            text-xl
                            font-black
                            tracking-tight

                            text-slate-900
                            dark:text-white

                            sm:text-2xl
                        "
                    >
                        Loyihalar yuklanmadi
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

                            text-red-700/85
                            dark:text-red-200/80
                        "
                    >
                        {message}
                    </p>

                    {/* RETRY */}

                    {canRetry && (
                        <button
                            type="button"
                            onClick={onRetry}
                            disabled={isLoading}
                            className="
                                mt-6

                                inline-flex
                                min-h-11

                                items-center
                                justify-center
                                gap-2

                                rounded-xl
                                border

                                border-red-500/30
                                bg-red-600

                                px-5
                                py-3

                                text-xs
                                font-black
                                text-white

                                shadow-lg
                                shadow-red-600/15

                                transition-all
                                duration-200

                                hover:bg-red-500

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-red-500/50

                                active:scale-[0.98]

                                disabled:cursor-not-allowed
                                disabled:opacity-50

                                motion-reduce:transform-none
                            "
                        >
                            {isLoading ? (
                                <Loader2
                                    size={17}
                                    aria-hidden="true"
                                    className="
                                        animate-spin
                                        motion-reduce:animate-none
                                    "
                                />
                            ) : (
                                <RefreshCcw
                                    size={17}
                                    aria-hidden="true"
                                />
                            )}

                            <span>
                                {isLoading
                                    ? "Yuklanmoqda..."
                                    : "Qayta urinish"}
                            </span>
                        </button>
                    )}
                </div>
            </section>
        );
    }
);

// =========================================================
// MAIN COMPONENT
// =========================================================

const ProfileProjectsError = ({
    variant = "fetch",
    error = null,
    message = "",
    onRetry,
    isLoading = false,
    className = "",
}) => {
    // =====================================================
    // TYPE
    // =====================================================

    const isCreateError =
        variant === "create";

    // =====================================================
    // RESOLVE MESSAGE
    // =====================================================

    const errorMessage = getSafeErrorMessage(
        message || error,
        isCreateError
            ? DEFAULT_CREATE_ERROR
            : DEFAULT_FETCH_ERROR
    );

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className={className}>
            {isCreateError ? (
                <CreateErrorPanel
                    message={errorMessage}
                />
            ) : (
                <FetchErrorPanel
                    message={errorMessage}
                    onRetry={onRetry}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfileProjectsError);
