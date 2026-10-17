
import React, { memo } from "react";

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
// Used inside:
// ProjectDetail.jsx
//
// Background:
// PageGridBackground is rendered by the parent page.
//
// Preserved features:
// - API error handling
// - Project not found state
// - Project ID display
// - Retry functionality
// - Retry loading indicator
// - Back to projects navigation
// - Light / Dark Mode
// - Responsive design
// - Accessible error announcement
//
// Improvements:
// - Removed duplicate page grid
// - Removed opaque full-page background
// - Shared futuristic background stays visible
// - Better long-text handling
// - Improved buttons and focus states
// =========================================================

// =========================================================
// CONSTANTS
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
        projectId === null ||
        projectId === undefined ||
        String(projectId).trim() === ""
            ? "Noma’lum"
            : String(projectId);

    // =====================================================
    // ERROR INFORMATION
    // =====================================================

    const hasError = Boolean(error);

    const errorMessage = hasError
        ? getErrorMessage(error, DEFAULT_ERROR)
        : "";

    const title = hasError
        ? "Loyihani yuklab bo‘lmadi"
        : "Loyiha topilmadi";

    const description = hasError
        ? "Loyiha ma’lumotlarini olishda muammo yuz berdi."
        : "Bu loyiha mavjud emas yoki hozirda ko‘rib bo‘lmaydi.";

    // =====================================================
    // RETRY STATE
    // =====================================================

    const loading = Boolean(isLoading);

    const canRetry =
        typeof onRetry === "function";

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
                min-h-[100dvh]

                w-full
                min-w-0

                items-center
                justify-center

                overflow-x-hidden

                bg-transparent

                px-3
                pb-16
                pt-28

                text-slate-900

                sm:px-6
                sm:pb-20

                dark:text-white
            "
        >
            {/* ======================================
                IMPORTANT: SHARED BACKGROUND

                Do not render another PageGridBackground.

                ProjectDetail.jsx already provides:
                - Grid
                - Network lines
                - 3D cubes
                - Glowing nodes
                - FS watermark

                This component remains transparent,
                allowing the shared background through.
            ====================================== */}

            {/* ======================================
                SUBTLE ERROR GLOW

                Decorative only.
                Does not cover the shared page grid.
            ====================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none

                    absolute
                    left-1/2
                    top-1/2

                    h-64
                    w-64

                    -translate-x-1/2
                    -translate-y-1/2

                    rounded-full

                    bg-rose-400/[0.08]

                    blur-[90px]

                    sm:h-96
                    sm:w-96

                    dark:bg-rose-500/[0.055]
                "
            />

            {/* ======================================
                ERROR CARD
            ====================================== */}

            <section
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
                    border-rose-200/90

                    bg-white/95

                    px-4
                    py-9

                    text-center

                    shadow-[0_24px_70px_rgba(15,23,42,0.10)]

                    backdrop-blur-xl

                    sm:rounded-[28px]
                    sm:px-8
                    sm:py-10

                    dark:border-rose-400/20
                    dark:bg-[#0b1018]/90

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

                        h-[2px]

                        bg-gradient-to-r

                        from-transparent
                        via-rose-500/70
                        to-transparent

                        dark:via-rose-400/40
                    "
                />

                {/* ==================================
                    CARD DECORATIVE GLOW
                ================================== */}

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none

                        absolute
                        -right-20
                        -top-20

                        h-48
                        w-48

                        rounded-full

                        bg-rose-400/[0.055]

                        blur-[65px]

                        dark:bg-rose-400/[0.045]
                    "
                />

                {/* ==================================
                    ICON
                ================================== */}

                <div
                    className="
                        relative

                        mx-auto

                        grid
                        h-[68px]
                        w-[68px]

                        place-items-center

                        rounded-2xl

                        border
                        border-rose-200

                        bg-rose-50

                        text-rose-700

                        shadow-sm

                        dark:border-rose-400/20
                        dark:bg-rose-400/[0.09]
                        dark:text-rose-300
                    "
                >
                    <AlertTriangle
                        size={29}
                        strokeWidth={1.8}
                        aria-hidden="true"
                    />
                </div>

                {/* ==================================
                    SYSTEM ERROR LABEL
                ================================== */}

                <div
                    className="
                        relative

                        mt-5

                        inline-flex
                        max-w-full

                        items-center
                        gap-2

                        rounded-full

                        border
                        border-rose-200

                        bg-rose-50

                        px-3
                        py-1.5

                        font-mono
                        text-[10px]
                        font-bold

                        uppercase
                        tracking-[0.11em]

                        text-rose-700

                        dark:border-rose-400/20
                        dark:bg-rose-400/[0.07]
                        dark:text-rose-300
                    "
                >
                    <span
                        aria-hidden="true"
                        className="
                            h-1.5
                            w-1.5

                            shrink-0

                            rounded-full

                            bg-rose-500

                            dark:bg-rose-400
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
                        relative

                        mt-5

                        break-words

                        text-[22px]
                        font-black

                        leading-tight
                        tracking-tight

                        text-slate-900

                        sm:text-[27px]

                        dark:text-white

                        [overflow-wrap:anywhere]
                    "
                >
                    {title}
                </h1>

                {/* ==================================
                    PROJECT ID
                ================================== */}

                <p
                    className="
                        relative

                        mt-3

                        font-mono
                        text-xs
                        font-medium

                        text-slate-500

                        dark:text-slate-400
                    "
                >
                    Loyiha ID:{" "}

                    <strong
                        className="
                            break-all

                            font-black

                            text-slate-700

                            dark:text-slate-200
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
                        relative

                        mx-auto
                        mt-4

                        max-w-md

                        text-[13px]
                        font-medium

                        leading-7

                        text-slate-600

                        dark:text-slate-300
                    "
                >
                    {description}
                </p>

                {/* ==================================
                    API ERROR DETAILS

                    Preserves the existing
                    projectDetailHelpers logic.
                ================================== */}

                {hasError && (
                    <div
                        className="
                            relative

                            mt-5

                            rounded-2xl

                            border
                            border-rose-200

                            bg-rose-50/80

                            p-4

                            text-left

                            dark:border-rose-400/[0.15]
                            dark:bg-rose-400/[0.065]
                        "
                    >
                        <p
                            className="
                                whitespace-pre-wrap

                                break-words

                                text-xs
                                font-medium

                                leading-6

                                text-rose-800

                                dark:text-rose-200

                                [overflow-wrap:anywhere]
                            "
                        >
                            {errorMessage || DEFAULT_ERROR}
                        </p>
                    </div>
                )}

                {/* ==================================
                    ACTION BUTTONS
                ================================== */}

                <div
                    className="
                        relative

                        mt-7

                        flex
                        flex-col

                        items-stretch
                        justify-center

                        gap-3

                        sm:flex-row
                        sm:flex-wrap
                    "
                >
                    {/* ==========================
                        RETRY BUTTON
                    ========================== */}

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
                                border-rose-600

                                bg-rose-600

                                px-5
                                py-3

                                text-xs
                                font-black

                                text-white

                                transition-colors
                                duration-150

                                hover:border-rose-700
                                hover:bg-rose-700

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-rose-500
                                focus-visible:ring-offset-2

                                disabled:cursor-not-allowed
                                disabled:opacity-60

                                dark:border-rose-500
                                dark:bg-rose-600

                                dark:hover:border-rose-400
                                dark:hover:bg-rose-500

                                dark:focus-visible:ring-offset-[#0b1018]

                                motion-reduce:transition-none
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

                    {/* ==========================
                        BACK TO PROJECTS
                    ========================== */}

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
                            border-slate-200

                            bg-slate-50

                            px-5
                            py-3

                            text-xs
                            font-black

                            text-slate-700

                            transition-colors
                            duration-150

                            hover:border-indigo-300
                            hover:bg-indigo-50
                            hover:text-indigo-700

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-indigo-500
                            focus-visible:ring-offset-2

                            dark:border-white/[0.10]
                            dark:bg-white/[0.04]
                            dark:text-slate-300

                            dark:hover:border-indigo-400/25
                            dark:hover:bg-indigo-400/[0.08]
                            dark:hover:text-indigo-300

                            dark:focus-visible:ring-offset-[#0b1018]

                            motion-reduce:transition-none
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
            </section>
        </main>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProjectDetailErrorState);
