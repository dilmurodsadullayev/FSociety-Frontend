
import React from "react";

import { Link } from "react-router-dom";

import {
    AlertTriangle,
    ArrowLeft,
    Loader2,
    RefreshCw,
} from "lucide-react";

import {
    getErrorMessage,
} from "./projectDetailHelpers";

// =========================================================
// FSOCIETY — PROJECT DETAIL ERROR STATE
//
// Features:
// - Dark / Light Mode
// - Responsive error screen
// - Safe error messages
// - Project ID display
// - Retry functionality
// - Loading state
// - Back to Projects link
// - Accessible error announcement
// =========================================================

// =========================================================
// DEFAULT ERROR
// =========================================================

const DEFAULT_ERROR =
    "Loyihani yuklashda xatolik yuz berdi. " +
    "Internet aloqasini tekshirib, qayta urinib ko‘ring.";

// =========================================================
// MAIN COMPONENT
// =========================================================

const ProjectDetailErrorState = ({
    projectId,

    error,

    onRetry,

    isLoading = false,
}) => {
    // =====================================================
    // SAFE PROJECT ID
    // =====================================================

    const displayId =
        projectId == null ||
        String(projectId).trim() === ""
            ? "Noma’lum"
            : String(projectId);

    // =====================================================
    // ERROR MESSAGE
    // =====================================================

    const hasError = Boolean(error);

    const errorMessage = hasError
        ? getErrorMessage(
            error,
            DEFAULT_ERROR
        )
        : "";

    // =====================================================
    // TITLE
    // =====================================================

    const title = hasError
        ? "Loyihani yuklab bo‘lmadi"
        : "Loyiha topilmadi";

    // =====================================================
    // RETRY
    // =====================================================

    const loading = Boolean(isLoading);

    const canRetry =
        typeof onRetry === "function";

    // =====================================================
    // JSX
    // =====================================================

    return (
        <main
            className="
                relative
                isolate

                flex
                min-h-screen
                min-w-0

                items-center
                justify-center

                overflow-hidden

                bg-[#edf2fa]

                px-4
                pb-16
                pt-28

                sm:px-6

                dark:bg-[#05070a]
            "
        >
            {/* ======================================
                BACKGROUND GRID
            ====================================== */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    inset-0

                    opacity-[0.025]

                    text-slate-900

                    [background-image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)]
                    [background-size:42px_42px]

                    dark:opacity-[0.02]
                    dark:text-white
                "
            />

            {/* ======================================
                BACKGROUND GLOW
            ====================================== */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    left-1/2
                    top-1/2

                    h-80
                    w-80

                    -translate-x-1/2
                    -translate-y-1/2

                    rounded-full

                    bg-red-500/[0.06]

                    blur-[100px]

                    dark:bg-red-500/[0.045]
                "
            />

            {/* ======================================
                ERROR CARD
            ====================================== */}

            <div
                role="alert"

                aria-labelledby="project-detail-error-title"

                className="
                    relative
                    z-10

                    w-full
                    min-w-0
                    max-w-xl

                    overflow-hidden

                    rounded-[24px]
                    border
                    border-red-200/80

                    bg-white

                    px-5
                    py-9

                    text-center

                    shadow-[0_24px_70px_rgba(15,23,42,0.08)]

                    sm:rounded-[28px]
                    sm:px-8
                    sm:py-10

                    dark:border-red-400/20
                    dark:bg-[#0b1018]

                    dark:shadow-[0_35px_100px_rgba(0,0,0,0.35)]
                "
            >
                {/* ==================================
                    TOP ACCENT
                ================================== */}

                <div
                    aria-hidden="true"

                    className="
                        absolute
                        inset-x-0
                        top-0

                        h-px

                        bg-gradient-to-r
                        from-transparent
                        via-red-400/60
                        to-transparent

                        dark:via-red-400/35
                    "
                />

                {/* ==================================
                    ICON
                ================================== */}

                <div
                    className="
                        mx-auto

                        grid
                        h-[68px]
                        w-[68px]

                        place-items-center

                        rounded-2xl
                        border
                        border-red-300/60

                        bg-red-500/[0.07]

                        text-red-700

                        dark:border-red-400/20
                        dark:bg-red-500/[0.07]
                        dark:text-red-300
                    "
                >
                    <AlertTriangle
                        size={29}
                        strokeWidth={1.8}
                        aria-hidden="true"
                    />
                </div>

                {/* ==================================
                    ERROR LABEL
                ================================== */}

                <div
                    className="
                        mt-5

                        inline-flex
                        items-center
                        gap-2

                        rounded-full
                        border
                        border-red-300/60

                        bg-red-500/[0.06]

                        px-3
                        py-1.5

                        font-mono
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.11em]

                        text-red-700

                        dark:border-red-400/15
                        dark:bg-red-400/[0.06]
                        dark:text-red-300
                    "
                >
                    <span
                        aria-hidden="true"

                        className="
                            h-1.5
                            w-1.5

                            rounded-full

                            bg-red-500

                            dark:bg-red-400
                        "
                    />

                    project://error
                </div>

                {/* ==================================
                    TITLE
                ================================== */}

                <h1
                    id="project-detail-error-title"

                    className="
                        mt-4

                        break-words

                        text-[22px]
                        font-black
                        leading-tight
                        tracking-tight

                        text-slate-900

                        sm:text-[27px]

                        dark:text-white
                    "
                >
                    {title}
                </h1>

                {/* ==================================
                    PROJECT ID
                ================================== */}

                <p
                    className="
                        mt-3

                        font-mono
                        text-[12px]
                        font-medium

                        text-slate-500

                        dark:text-gray-500
                    "
                >
                    Loyiha ID:{" "}

                    <strong
                        className="
                            break-all

                            font-black

                            text-slate-700

                            dark:text-gray-300
                        "
                    >
                        {displayId}
                    </strong>
                </p>

                {/* ==================================
                    ERROR DESCRIPTION
                ================================== */}

                <p
                    className="
                        mx-auto
                        mt-4
                        max-w-md

                        text-[13px]
                        font-medium
                        leading-7

                        text-slate-600

                        dark:text-gray-400
                    "
                >
                    {hasError
                        ? "Loyiha ma’lumotlarini olishda muammo yuz berdi."
                        : "Bu loyiha mavjud emas yoki hozirda ko‘rib bo‘lmaydi."}
                </p>

                {/* ==================================
                    API ERROR DETAILS
                ================================== */}

                {hasError && (
                    <div
                        className="
                            mt-5

                            rounded-2xl
                            border
                            border-red-200/80

                            bg-red-50

                            p-4

                            dark:border-red-400/[0.15]
                            dark:bg-red-500/[0.055]
                        "
                    >
                        <p
                            className="
                                whitespace-pre-wrap
                                break-words
                                [overflow-wrap:anywhere]

                                text-[12px]
                                font-medium
                                leading-6

                                text-red-800

                                dark:text-red-200/85
                            "
                        >
                            {errorMessage}
                        </p>
                    </div>
                )}

                {/* ==================================
                    ACTION BUTTONS
                ================================== */}

                <div
                    className="
                        mt-6

                        flex
                        flex-col

                        items-stretch
                        justify-center
                        gap-3

                        sm:flex-row
                    "
                >
                    {/* RETRY */}

                    {canRetry && (
                        <button
                            type="button"

                            onClick={onRetry}

                            disabled={loading}

                            aria-busy={loading}

                            className="
                                group/retry

                                inline-flex
                                min-h-11

                                items-center
                                justify-center
                                gap-2

                                rounded-xl
                                border
                                border-red-600

                                bg-red-600

                                px-5
                                py-3

                                text-[12px]
                                font-bold

                                text-white

                                transition-colors
                                duration-150

                                hover:border-red-700
                                hover:bg-red-700

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-red-500
                                focus-visible:ring-offset-2

                                disabled:cursor-not-allowed
                                disabled:opacity-60

                                dark:border-red-500
                                dark:bg-red-600

                                dark:hover:border-red-400
                                dark:hover:bg-red-500

                                dark:focus-visible:ring-offset-[#0b1018]
                            "
                        >
                            {loading ? (
                                <Loader2
                                    size={16}
                                    strokeWidth={2}
                                    aria-hidden="true"

                                    className="
                                        animate-spin

                                        motion-reduce:animate-none
                                    "
                                />
                            ) : (
                                <RefreshCw
                                    size={16}
                                    strokeWidth={2}
                                    aria-hidden="true"
                                />
                            )}

                            {loading
                                ? "Yuklanmoqda..."
                                : "Qayta urinish"}
                        </button>
                    )}

                    {/* BACK TO PROJECTS */}

                    <Link
                        to="/projects"

                        className="
                            inline-flex
                            min-h-11

                            items-center
                            justify-center
                            gap-2

                            rounded-xl
                            border
                            border-[#dce5f0]

                            bg-[#f8faff]

                            px-5
                            py-3

                            text-[12px]
                            font-bold

                            text-slate-700

                            transition-colors
                            duration-150

                            hover:border-indigo-400/40
                            hover:bg-indigo-500/[0.06]
                            hover:text-indigo-700

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-indigo-500

                            dark:border-white/[0.10]
                            dark:bg-white/[0.04]
                            dark:text-gray-300

                            dark:hover:border-indigo-400/25
                            dark:hover:bg-indigo-400/[0.07]
                            dark:hover:text-indigo-300
                        "
                    >
                        <ArrowLeft
                            size={16}
                            strokeWidth={2}
                            aria-hidden="true"
                        />

                        Loyihalarga qaytish
                    </Link>
                </div>
            </div>
        </main>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(
    ProjectDetailErrorState
);
