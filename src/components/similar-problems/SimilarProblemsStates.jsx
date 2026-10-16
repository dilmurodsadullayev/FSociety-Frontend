
import React, { memo } from "react";

import {
    AlertTriangle,
    ArrowRight,
    RefreshCw,
    Search,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
    MAX_SIMILAR_PROBLEMS,
} from "./similarProblemsHelpers";

// =========================================================
// BASE SKELETON
// =========================================================

const Block = ({
    className = "",
}) => (
    <div
        aria-hidden="true"
        className={`
            rounded-lg
            bg-slate-200/90
            dark:bg-slate-700/40
            ${className}
        `}
    />
);

// =========================================================
// SINGLE SKELETON CARD
// =========================================================

export const SimilarProblemSkeletonItem = memo(() => (
    <div
        aria-hidden="true"
        className="
            border-b
            border-slate-200
            py-5
            last:border-b-0

            dark:border-white/[0.07]
        "
    >
        <div className="flex items-start gap-3">
            {/* NUMBER */}

            <Block
                className="
                    h-9
                    w-9
                    shrink-0
                    rounded-xl
                "
            />

            {/* BODY */}

            <div className="min-w-0 flex-1">
                <Block className="h-3.5 w-[94%]" />

                <Block className="mt-2.5 h-3.5 w-[71%]" />

                <div className="mt-3 flex flex-wrap gap-2">
                    <Block className="h-6 w-16 rounded-full" />
                    <Block className="h-6 w-20 rounded-full" />
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                    <Block className="h-3 w-12" />
                    <Block className="h-3 w-12" />
                    <Block className="h-3 w-16" />
                </div>
            </div>
        </div>
    </div>
));

// =========================================================
// LOADING
// =========================================================

export const SimilarProblemsLoading = memo(() => (
    <div
        role="status"
        aria-label="O‘xshash muammolar yuklanmoqda"
        className="
            animate-pulse
            motion-reduce:animate-none
        "
    >
        <span className="sr-only">
            O‘xshash muammolar yuklanmoqda.
        </span>

        {Array.from({
            length: MAX_SIMILAR_PROBLEMS,
        }).map((_, index) => (
            <SimilarProblemSkeletonItem
                key={index}
            />
        ))}
    </div>
));

// =========================================================
// ERROR
// =========================================================

export const SimilarProblemsError = memo(({
    message,
    onRetry,
    isLoading = false,
}) => (
    <div
        role="alert"
        className="py-7"
    >
        <div
            className="
                rounded-2xl
                border
                border-rose-200
                bg-rose-50
                p-4

                dark:border-rose-400/20
                dark:bg-rose-400/[0.06]
            "
        >
            <div className="flex items-start gap-3">
                <span
                    aria-hidden="true"
                    className="
                        grid
                        h-10
                        w-10
                        shrink-0
                        place-items-center
                        rounded-xl
                        border
                        border-rose-200
                        bg-rose-100
                        text-rose-700

                        dark:border-rose-400/20
                        dark:bg-rose-400/10
                        dark:text-rose-300
                    "
                >
                    <AlertTriangle size={18} />
                </span>

                <div className="min-w-0">
                    <h4
                        className="
                            text-xs
                            font-black
                            text-rose-900

                            dark:text-rose-200
                        "
                    >
                        O‘xshash muammolar yuklanmadi
                    </h4>

                    <p
                        className="
                            mt-1.5
                            break-words
                            text-[11px]
                            font-medium
                            leading-5
                            text-rose-800

                            dark:text-rose-200/80
                        "
                    >
                        {message ||
                            "Server bilan bog‘lanib bo‘lmadi."}
                    </p>
                </div>
            </div>

            <button
                type="button"
                onClick={onRetry}
                disabled={
                    isLoading ||
                    typeof onRetry !== "function"
                }
                className="
                    mt-4
                    inline-flex
                    min-h-10
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-rose-300
                    bg-white
                    px-3.5
                    py-2
                    text-[11px]
                    font-black
                    text-rose-800
                    transition-colors

                    hover:bg-rose-100

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-rose-500

                    disabled:cursor-not-allowed
                    disabled:opacity-50

                    dark:border-rose-400/25
                    dark:bg-rose-400/[0.09]
                    dark:text-rose-300
                "
            >
                <RefreshCw
                    size={14}
                    aria-hidden="true"
                    className={
                        isLoading
                            ? "animate-spin motion-reduce:animate-none"
                            : ""
                    }
                />

                Qayta urinish
            </button>
        </div>
    </div>
));

// =========================================================
// NON-BLOCKING REFRESH ERROR
// =========================================================

export const SimilarProblemsRefreshError = memo(({
    message,
    onRetry,
}) => (
    <div
        role="alert"
        className="
            mt-4
            rounded-xl
            border
            border-amber-200
            bg-amber-50
            p-3

            dark:border-amber-400/20
            dark:bg-amber-400/[0.07]
        "
    >
        <p
            className="
                break-words
                text-[11px]
                leading-5
                text-amber-900

                dark:text-amber-200
            "
        >
            {message ||
                "Ro‘yxatni yangilashda xatolik."}
        </p>

        <button
            type="button"
            onClick={onRetry}
            className="
                mt-2
                inline-flex
                items-center
                gap-1.5
                text-[11px]
                font-black
                text-amber-800
                underline
                underline-offset-2

                dark:text-amber-300
            "
        >
            <RefreshCw
                size={13}
                aria-hidden="true"
            />

            Qayta urinish
        </button>
    </div>
));

// =========================================================
// EMPTY STATE
// =========================================================

export const SimilarProblemsEmpty = memo(() => (
    <div
        className="
            py-10
            text-center
        "
    >
        <div
            aria-hidden="true"
            className="
                mx-auto
                grid
                h-16
                w-16
                place-items-center
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                text-slate-400

                dark:border-white/[0.09]
                dark:bg-white/[0.035]
                dark:text-gray-500
            "
        >
            <Search size={25} />
        </div>

        <h4
            className="
                mt-4
                text-sm
                font-black
                text-slate-900

                dark:text-white
            "
        >
            O‘xshash muammo topilmadi
        </h4>

        <p
            className="
                mx-auto
                mt-2
                max-w-[290px]
                text-[11px]
                font-medium
                leading-6
                text-slate-600

                dark:text-gray-400
            "
        >
            Bu muammo platformadagi kam uchraydigan
            yoki yangi mavzulardan biri bo‘lishi mumkin.
        </p>

        <Link
            to="/problems"
            className="
                mt-5
                inline-flex
                min-h-10
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-indigo-200
                bg-indigo-50
                px-4
                py-2
                text-[11px]
                font-black
                text-indigo-800
                transition-colors

                hover:bg-indigo-100

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500

                dark:border-indigo-400/20
                dark:bg-indigo-400/[0.08]
                dark:text-indigo-300
            "
        >
            Barcha muammolar

            <ArrowRight
                size={14}
                aria-hidden="true"
            />
        </Link>
    </div>
));
