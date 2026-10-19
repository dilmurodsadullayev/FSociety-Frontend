
// src/components/profile/ProfileError.jsx

import React, { memo } from "react";

import {
    Link,
} from "react-router-dom";

import {
    AlertCircle,
    ArrowLeft,
    Loader2,
    RefreshCcw,
    ShieldAlert,
    WifiOff,
} from "lucide-react";

// =========================================================
// FSOCIETY — PROFILE ERROR
//
// Responsibilities:
//
// - Network error
// - Server error
// - General API error
// - Retry functionality
// - Loading indicator during retry
// - Error message rendering
//
// NOT RESPONSIBLE FOR:
//
// - HTTP 404 user not found
//
// User not found is handled separately by:
//
// ProfileNotFound.jsx
//
// Features:
//
// - Light / Dark Mode
// - Responsive design
// - Accessible error feedback
// - Reduced motion support
// - Retry action
// - Users page navigation
//
// Existing props:
//
// error
// onRetry
// isRetrying
//
// Compatible with Profile.jsx and useProfilePage.js.
// =========================================================

// =========================================================
// CONSTANTS
// =========================================================

const DEFAULT_ERROR_MESSAGE =
    "Profil ma’lumotlarini yuklab bo‘lmadi. " +
    "Internet aloqasini tekshirib, qayta urinib ko‘ring.";

// =========================================================
// GET ERROR MESSAGE
//
// Supports:
//
// - String
// - JavaScript Error
// - Axios response
// - Django REST Framework
// - Validation errors
//
// Returns a safe, displayable string.
// =========================================================

const getErrorMessage = (
    error,
    fallback = DEFAULT_ERROR_MESSAGE
) => {
    // =====================================================
    // STRING ERROR
    // =====================================================

    if (
        typeof error === "string" &&
        error.trim()
    ) {
        return error.trim();
    }

    // =====================================================
    // SERVER DATA
    // =====================================================

    const data =
        error?.serverData ??
        error?.response?.data;

    // =====================================================
    // SERVER STRING
    // =====================================================

    if (
        typeof data === "string" &&
        data.trim()
    ) {
        return data.trim();
    }

    // =====================================================
    // DRF COMMON FIELDS
    // =====================================================

    for (const field of [
        "detail",
        "message",
        "error",
    ]) {
        if (
            typeof data?.[field] === "string" &&
            data[field].trim()
        ) {
            return data[field].trim();
        }
    }

    // =====================================================
    // DRF VALIDATION
    // =====================================================

    if (
        data &&
        typeof data === "object" &&
        !Array.isArray(data)
    ) {
        const firstValue =
            Object.values(data)[0];

        if (
            Array.isArray(firstValue) &&
            firstValue.length > 0
        ) {
            const firstMessage =
                firstValue.find(
                    (value) =>
                        typeof value === "string" &&
                        value.trim()
                );

            if (firstMessage) {
                return firstMessage.trim();
            }
        }

        if (
            typeof firstValue === "string" &&
            firstValue.trim()
        ) {
            return firstValue.trim();
        }
    }

    // =====================================================
    // GENERIC ERROR
    // =====================================================

    if (
        typeof error?.message === "string" &&
        error.message.trim()
    ) {
        return error.message.trim();
    }

    return fallback;
};

// =========================================================
// GET ERROR STATUS
//
// Optional HTTP status for diagnostic display.
// =========================================================

const getErrorStatus = (error) => {
    const rawStatus =
        error?.response?.status ??
        error?.status ??
        error?.statusCode;

    if (
        rawStatus === null ||
        rawStatus === undefined ||
        rawStatus === ""
    ) {
        return null;
    }

    const status =
        Number(rawStatus);

    if (
        !Number.isInteger(status) ||
        status < 100 ||
        status > 599
    ) {
        return null;
    }

    return status;
};

// =========================================================
// PROFILE ERROR
//
// Props:
//
// error:
//   Error string or object.
//
// onRetry:
//   Callback supplied by useProfilePage.
//
// isRetrying:
//   Indicates that retry is in progress.
//
// username:
//   Optional for backward compatibility.
//
// Important:
// This component does not send API requests directly.
// =========================================================

const ProfileError = ({
    error,
    onRetry,
    isRetrying = false,
}) => {
    // =====================================================
    // ERROR DETAILS
    // =====================================================

    const errorMessage =
        getErrorMessage(error);

    const errorStatus =
        getErrorStatus(error);

    // =====================================================
    // RETRY STATE
    // =====================================================

    const loading =
        Boolean(isRetrying);

    const canRetry =
        typeof onRetry === "function";

    // =====================================================
    // NETWORK ERROR DETECTION
    //
    // No HTTP response may mean a network problem.
    //
    // This is only a presentation hint and does not
    // override the actual error message.
    // =====================================================

    const isNetworkError =
        Boolean(
            error &&
            typeof error === "object" &&
            error?.isAxiosError &&
            !error?.response
        );

    const ErrorIcon =
        isNetworkError
            ? WifiOff
            : AlertCircle;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <main
            className="
                relative
                isolate

                flex
                min-h-screen
                w-full
                min-w-0

                items-center
                justify-center

                overflow-hidden

                bg-[#f4f7fc]
                text-slate-900

                px-4
                py-14

                font-sans

                transition-colors
                duration-300

                dark:bg-[#0d1117]
                dark:text-[#e6edf3]

                sm:px-6
                sm:py-16
            "
        >
            {/* =============================================
                BACKGROUND GLOW
            ============================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none

                    absolute
                    -right-28
                    -top-28

                    h-80
                    w-80

                    rounded-full

                    bg-red-500/[0.05]

                    blur-3xl

                    dark:bg-red-500/[0.09]
                "
            />

            <div
                aria-hidden="true"
                className="
                    pointer-events-none

                    absolute
                    -bottom-28
                    -left-28

                    h-80
                    w-80

                    rounded-full

                    bg-indigo-500/[0.05]

                    blur-3xl

                    dark:bg-indigo-500/[0.07]
                "
            />

            {/* =============================================
                ERROR CARD
            ============================================== */}

            <section
                role="alert"
                aria-labelledby="profile-error-title"
                aria-describedby="profile-error-description"
                className="
                    relative
                    z-10

                    mx-auto
                    w-full
                    max-w-xl

                    overflow-hidden

                    rounded-3xl
                    border

                    border-red-200
                    bg-white/95

                    px-5
                    py-9

                    text-center

                    shadow-xl
                    shadow-slate-900/[0.06]

                    backdrop-blur-xl

                    transition-colors
                    duration-300

                    dark:border-red-400/15
                    dark:bg-[#11151d]/95

                    dark:shadow-2xl
                    dark:shadow-black/25

                    sm:px-9
                    sm:py-11
                "
            >
                {/* =========================================
                    TOP ACCENT
                ========================================== */}

                <div
                    aria-hidden="true"
                    className="
                        absolute
                        inset-x-0
                        top-0

                        h-[2px]

                        bg-gradient-to-r

                        from-transparent
                        via-red-500/70
                        to-transparent
                    "
                />

                {/* =========================================
                    STATUS LABEL
                ========================================== */}

                <div
                    className="
                        inline-flex

                        items-center
                        justify-center
                        gap-2

                        rounded-full
                        border

                        border-red-200
                        bg-red-50

                        px-3
                        py-1.5

                        dark:border-red-400/20
                        dark:bg-red-500/[0.08]
                    "
                >
                    <span
                        aria-hidden="true"
                        className="
                            h-2
                            w-2

                            rounded-full

                            bg-red-500
                        "
                    />

                    <span
                        className="
                            font-mono

                            text-[10px]
                            font-bold

                            uppercase
                            tracking-[0.12em]

                            text-red-700

                            dark:text-red-300
                        "
                    >
                        Profile request failed
                    </span>
                </div>

                {/* =========================================
                    ERROR ICON
                ========================================== */}

                <div
                    className="
                        relative

                        mx-auto
                        mt-7

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

                        shadow-lg
                        shadow-red-500/[0.08]

                        dark:border-red-400/20
                        dark:bg-red-500/[0.09]
                        dark:text-red-300

                        sm:h-24
                        sm:w-24
                    "
                >
                    <ErrorIcon
                        size={38}
                        strokeWidth={1.7}
                        aria-hidden="true"
                    />

                    {/* CORNER ICON */}

                    <div
                        aria-hidden="true"
                        className="
                            absolute
                            -bottom-2
                            -right-2

                            flex
                            h-8
                            w-8

                            items-center
                            justify-center

                            rounded-xl
                            border

                            border-red-200
                            bg-white

                            text-red-600

                            shadow-sm

                            dark:border-red-400/20
                            dark:bg-[#20171c]
                            dark:text-red-300
                        "
                    >
                        <ShieldAlert size={16} />
                    </div>
                </div>

                {/* =========================================
                    TITLE
                ========================================== */}

                <h1
                    id="profile-error-title"
                    className="
                        mt-7

                        font-display

                        text-2xl
                        font-black

                        tracking-tight

                        text-slate-900

                        dark:text-white

                        sm:text-3xl
                    "
                >
                    Profil yuklanmadi
                </h1>

                {/* =========================================
                    DESCRIPTION
                ========================================== */}

                <p
                    id="profile-error-description"
                    className="
                        mx-auto
                        mt-3

                        max-w-md

                        break-words

                        text-sm
                        font-medium
                        leading-7

                        text-slate-600

                        dark:text-red-200/80
                    "
                >
                    {errorMessage}
                </p>

                {/* =========================================
                    OPTIONAL HTTP STATUS
                ========================================== */}

                {errorStatus && (
                    <div
                        className="
                            mx-auto
                            mt-5

                            inline-flex

                            items-center
                            gap-2

                            rounded-lg
                            border

                            border-slate-200
                            bg-slate-50

                            px-3
                            py-1.5

                            font-mono

                            text-[11px]
                            font-semibold

                            text-slate-500

                            dark:border-white/[0.08]
                            dark:bg-white/[0.04]
                            dark:text-slate-400
                        "
                    >
                        HTTP {errorStatus}
                    </div>
                )}

                {/* =========================================
                    RETRY BUTTON
                ========================================== */}

                {canRetry && (
                    <button
                        type="button"
                        onClick={onRetry}
                        disabled={loading}
                        aria-busy={loading}
                        className="
                            group

                            mt-7

                            inline-flex
                            min-h-12

                            items-center
                            justify-center
                            gap-2.5

                            rounded-xl
                            border

                            border-red-500/30
                            bg-red-600

                            px-6
                            py-3

                            text-xs
                            font-bold

                            text-white

                            shadow-lg
                            shadow-red-500/15

                            transition-all
                            duration-200

                            hover:-translate-y-0.5
                            hover:bg-red-500

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-red-500/50
                            focus-visible:ring-offset-2

                            active:translate-y-0

                            disabled:cursor-not-allowed
                            disabled:opacity-50

                            disabled:hover:translate-y-0

                            motion-reduce:transform-none
                            motion-reduce:transition-none

                            dark:focus-visible:ring-offset-[#11151d]
                        "
                    >
                        {/* =================================
                            BUTTON ICON
                        ================================== */}

                        {loading ? (
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
                                className="
                                    transition-transform
                                    duration-300

                                    group-hover:rotate-45

                                    motion-reduce:transform-none
                                "
                            />
                        )}

                        {/* =================================
                            BUTTON TEXT
                        ================================== */}

                        <span>
                            {loading
                                ? "Yuklanmoqda..."
                                : "Qayta urinish"}
                        </span>
                    </button>
                )}

                {/* =========================================
                    BACK NAVIGATION
                ========================================== */}

                <div className="mt-6">
                    <Link
                        to="/users"
                        className="
                            group

                            inline-flex

                            items-center
                            gap-2

                            text-xs
                            font-bold

                            text-indigo-600

                            transition-colors
                            duration-200

                            hover:text-indigo-700

                            focus-visible:outline-none
                            focus-visible:underline

                            dark:text-indigo-300
                            dark:hover:text-indigo-200
                        "
                    >
                        <ArrowLeft
                            size={15}
                            aria-hidden="true"
                            className="
                                transition-transform
                                duration-200

                                group-hover:-translate-x-0.5

                                motion-reduce:transform-none
                            "
                        />

                        Foydalanuvchilarga qaytish
                    </Link>
                </div>

                {/* =========================================
                    BOTTOM HINT
                ========================================== */}

                <p
                    className="
                        mx-auto
                        mt-6

                        max-w-sm

                        text-[11px]
                        font-medium
                        leading-5

                        text-slate-400

                        dark:text-slate-500
                    "
                >
                    Muammo davom etsa, internet
                    aloqasini tekshiring va birozdan
                    keyin qayta urinib ko‘ring.
                </p>
            </section>
        </main>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfileError);
