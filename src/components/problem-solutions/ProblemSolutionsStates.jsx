
import React, { memo } from "react";

import {
    AlertTriangle,
    Loader2,
    RefreshCw,
    Rocket,
    Sparkles,
} from "lucide-react";

// =========================================================
// SHARED SKELETON BLOCK
// =========================================================

const SkeletonBlock = ({
    className = "",
}) => (
    <div
        aria-hidden="true"
        className={`
            rounded-lg
            bg-slate-200/90
            dark:bg-white/[0.07]
            ${className}
        `}
    />
);

// =========================================================
// ONE SOLUTION SKELETON
// =========================================================

export const ProblemSolutionSkeleton = memo(() => (
    <div
        aria-hidden="true"
        className="
            rounded-[22px]
            border
            border-slate-200
            bg-white
            p-4

            sm:rounded-[26px]
            sm:p-5

            dark:border-white/[0.09]
            dark:bg-white/[0.025]
        "
    >
        <div className="mb-5 flex items-center justify-between gap-3">
            <SkeletonBlock className="h-6 w-24 rounded-full" />
            <SkeletonBlock className="h-6 w-20 rounded-full" />
        </div>

        <div className="flex items-center gap-3">
            <SkeletonBlock className="h-12 w-12 shrink-0 rounded-2xl" />

            <div className="flex-1 space-y-2">
                <SkeletonBlock className="h-3.5 w-32 max-w-full rounded-full" />
                <SkeletonBlock className="h-2.5 w-24 max-w-full rounded-full" />
            </div>
        </div>

        <div className="mt-6 space-y-3">
            <SkeletonBlock className="h-3 w-[94%] rounded-full" />
            <SkeletonBlock className="h-3 w-[82%] rounded-full" />
            <SkeletonBlock className="h-3 w-[61%] rounded-full" />
        </div>

        <div
            className="
                mt-5
                space-y-3
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                p-4

                dark:border-white/[0.06]
                dark:bg-[#080e19]
            "
        >
            <SkeletonBlock className="h-3 w-1/3 rounded-full" />
            <SkeletonBlock className="h-3 w-4/5 rounded-full" />
            <SkeletonBlock className="h-3 w-2/3 rounded-full" />
        </div>

        <div
            className="
                mt-5
                flex
                items-center
                justify-between
                gap-3
                border-t
                border-slate-200
                pt-4

                dark:border-white/[0.08]
            "
        >
            <SkeletonBlock className="h-10 w-32 rounded-xl" />
            <SkeletonBlock className="h-3 w-20 rounded-full" />
        </div>
    </div>
));

// =========================================================
// LOADING LIST
// =========================================================

export const ProblemSolutionsLoading = memo(({
    count = 3,
}) => (
    <div
        role="status"
        aria-label="Yechimlar yuklanmoqda"
        className="
            space-y-4
            animate-pulse
            motion-reduce:animate-none
        "
    >
        <span className="sr-only">
            Yechimlar yuklanmoqda...
        </span>

        {Array.from({ length: count }).map((_, index) => (
            <ProblemSolutionSkeleton key={index} />
        ))}
    </div>
));

// =========================================================
// ERROR
// =========================================================

export const ProblemSolutionsError = memo(({
    message,
    onRetry,
    isRetrying = false,
}) => (
    <div
        role="alert"
        className="
            rounded-[22px]
            border
            border-rose-200
            bg-rose-50/70
            px-5
            py-9
            text-center

            dark:border-rose-400/20
            dark:bg-rose-400/[0.05]
        "
    >
        <div
            className="
                mx-auto
                grid
                h-14
                w-14
                place-items-center
                rounded-2xl
                border
                border-rose-200
                bg-rose-100
                text-rose-700

                dark:border-rose-400/20
                dark:bg-rose-400/10
                dark:text-rose-300
            "
        >
            <AlertTriangle size={24} aria-hidden="true" />
        </div>

        <h3
            className="
                mt-4
                text-lg
                font-black
                text-slate-900
                dark:text-white
            "
        >
            Yechimlarni yuklab bo‘lmadi
        </h3>

        <p
            className="
                mx-auto
                mt-2
                max-w-md
                text-sm
                leading-6
                text-slate-600

                dark:text-gray-400
            "
        >
            {message || "Noma’lum xatolik."}
        </p>

        <button
            type="button"
            onClick={onRetry}
            disabled={isRetrying || typeof onRetry !== "function"}
            className="
                mt-5
                inline-flex
                min-h-10
                items-center
                gap-2
                rounded-xl
                border
                border-rose-300
                bg-white
                px-4
                py-2
                text-xs
                font-bold
                text-rose-800

                hover:bg-rose-100
                disabled:cursor-not-allowed
                disabled:opacity-50

                dark:border-rose-400/25
                dark:bg-rose-400/[0.09]
                dark:text-rose-300
            "
        >
            <RefreshCw
                size={14}
                className={
                    isRetrying
                        ? "animate-spin motion-reduce:animate-none"
                        : ""
                }
                aria-hidden="true"
            />
            Qayta urinish
        </button>
    </div>
));

// =========================================================
// EMPTY
// =========================================================

export const ProblemSolutionsEmpty = memo(() => (
    <div
        className="
            rounded-[22px]
            border
            border-dashed
            border-cyan-200
            bg-cyan-50/40
            px-5
            py-12
            text-center

            dark:border-cyan-400/20
            dark:bg-cyan-400/[0.035]
        "
    >
        <div
            className="
                mx-auto
                grid
                h-16
                w-16
                place-items-center
                rounded-[20px]
                border
                border-cyan-200
                bg-cyan-100/70
                text-cyan-700

                dark:border-cyan-400/20
                dark:bg-cyan-400/[0.08]
                dark:text-cyan-300
            "
        >
            <Rocket size={26} aria-hidden="true" />
        </div>

        <h3
            className="
                mt-5
                text-xl
                font-black
                text-slate-900
                dark:text-white
            "
        >
            Hali yechim yo‘q
        </h3>

        <p
            className="
                mx-auto
                mt-2
                max-w-md
                text-sm
                leading-6
                text-slate-600
                dark:text-gray-400
            "
        >
            Birinchi bo‘lib o‘z yechimingizni yozing.
            Tushunarli va sifatli javob community uchun
            ko‘proq foyda beradi.
        </p>

        <span
            className="
                mt-5
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-slate-200
                bg-white
                px-3
                py-1.5
                font-mono
                text-[10px]
                font-bold
                uppercase
                text-slate-500

                dark:border-white/[0.09]
                dark:bg-white/[0.04]
                dark:text-gray-400
            "
        >
            <Sparkles size={13} aria-hidden="true" />
            First solution
        </span>
    </div>
));

// =========================================================
// NON-BLOCKING REFRESH WARNING
// =========================================================

export const ProblemSolutionsRefreshWarning = memo(({
    onRetry,
    isRetrying = false,
}) => (
    <div
        role="alert"
        className="
            flex
            flex-col
            gap-3
            rounded-2xl
            border
            border-amber-200
            bg-amber-50
            p-4

            sm:flex-row
            sm:items-center
            sm:justify-between

            dark:border-amber-400/20
            dark:bg-amber-400/[0.055]
        "
    >
        <div className="flex min-w-0 items-start gap-3">
            <AlertTriangle
                size={17}
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-300"
            />

            <p
                className="
                    text-xs
                    font-medium
                    leading-5
                    text-amber-900
                    dark:text-amber-100/85
                "
            >
                Server bilan sinxronlashda muammo bo‘ldi.
                Hozirgi ro‘yxat saqlab qolindi.
            </p>
        </div>

        <button
            type="button"
            onClick={onRetry}
            disabled={isRetrying}
            className="
                inline-flex
                min-h-9
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-amber-300
                bg-white
                px-3
                py-2
                text-[11px]
                font-bold
                text-amber-900

                disabled:cursor-not-allowed
                disabled:opacity-50

                dark:border-amber-400/25
                dark:bg-amber-400/[0.09]
                dark:text-amber-300
            "
        >
            {isRetrying ? (
                <Loader2
                    size={13}
                    aria-hidden="true"
                    className="animate-spin motion-reduce:animate-none"
                />
            ) : (
                <RefreshCw size={13} aria-hidden="true" />
            )}

            Yangilash
        </button>
    </div>
));
