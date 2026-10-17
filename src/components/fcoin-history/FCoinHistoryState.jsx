// src/components/fcoin-history/FCoinHistoryState.jsx

import React, { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";

import {
    AlertTriangle,
    History,
    Loader2,
    RefreshCw,
    WalletCards,
} from "lucide-react";

// =========================================================
// SHARED HELPERS
// =========================================================

const SKELETON_ROWS = [0, 1, 2, 3, 4];

const getErrorMessage = (error, fallback) => {
    if (typeof error === "string" && error.trim()) {
        return error.trim();
    }

    if (error instanceof Error && error.message) {
        return error.message;
    }

    if (error && typeof error === "object") {
        if (
            typeof error.detail === "string" &&
            error.detail.trim()
        ) {
            return error.detail.trim();
        }

        if (
            typeof error.message === "string" &&
            error.message.trim()
        ) {
            return error.message.trim();
        }
    }

    return fallback;
};

const appearTransition = (reduceMotion, delay = 0) =>
    reduceMotion
        ? { duration: 0 }
        : { duration: 0.25, delay };

// =========================================================
// REUSABLE SKELETON BLOCK
//
// Projects / Problems sahifasidagi pulse uslubi.
// Light/Dark Mode va Reduced Motion mavjud.
// =========================================================

const SkeletonBlock = memo(function SkeletonBlock({
    className = "",
}) {
    return (
        <div
            aria-hidden="true"
            className={`
                rounded-lg
                bg-slate-200/90
                animate-pulse
                motion-reduce:animate-none
                dark:bg-white/[0.07]
                ${className}
            `}
        />
    );
});

// =========================================================
// SUMMARY SKELETON
//
// Real statistik kartalarning joyini saqlaydi.
// =========================================================

const SummarySkeleton = memo(function SummarySkeleton() {
    return (
        <div
            aria-hidden="true"
            className="
                mb-6 min-w-0 overflow-hidden
                rounded-[26px] border
                border-slate-200/90
                bg-white/80 p-4 shadow-sm
                dark:border-white/[0.06]
                dark:bg-[#0d1117]/80
                dark:shadow-none
                sm:p-5
            "
        >
            <div
                className="
                    mb-4 flex flex-wrap
                    items-center justify-between gap-3
                "
            >
                <div className="flex items-center gap-2">
                    <SkeletonBlock
                        className="!h-7 !w-7 !rounded-lg"
                    />

                    <div className="space-y-2">
                        <SkeletonBlock
                            className="!h-3 !w-32"
                        />

                        <SkeletonBlock
                            className="!h-2 !w-44 max-w-full"
                        />
                    </div>
                </div>

                <SkeletonBlock
                    className="!h-9 !w-28 !rounded-xl"
                />
            </div>

            <div
                className="
                    grid min-w-0 grid-cols-1 gap-3
                    sm:grid-cols-2 xl:grid-cols-3
                "
            >
                {[0, 1, 2].map((index) => (
                    <div
                        key={index}
                        className="
                            flex min-w-0 items-center gap-3
                            rounded-2xl border
                            border-slate-200/80
                            bg-slate-50/80 p-4
                            dark:border-white/[0.05]
                            dark:bg-white/[0.025]
                        "
                    >
                        <SkeletonBlock
                            className="
                                !h-10 !w-10 shrink-0
                                !rounded-xl
                            "
                        />

                        <div
                            className="
                                min-w-0 flex-1 space-y-2.5
                            "
                        >
                            <SkeletonBlock
                                className="
                                    !h-2.5 !w-24 max-w-full
                                "
                            />

                            <SkeletonBlock
                                className="
                                    !h-5 !w-20 max-w-full
                                "
                            />

                            <SkeletonBlock
                                className="
                                    !h-2 !w-28 max-w-full
                                "
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

// =========================================================
// TRANSACTION SKELETON
//
// FCoinHistoryItem strukturasiga mos:
//
// - Source icon
// - FCoin badge
// - Status
// - Transaction title
// - Description
// - Date / target
// - Direction icon
// - Amount badge
// =========================================================

const SkeletonItem = memo(function SkeletonItem({
    index = 0,
}) {
    return (
        <div
            aria-hidden="true"
            className="
                relative min-w-0 overflow-hidden
                rounded-[24px] border
                border-slate-200/90
                bg-white p-4
                shadow-[0_8px_30px_rgba(15,23,42,0.045)]
                dark:border-white/[0.065]
                dark:bg-[#0d1117]
                dark:shadow-[0_8px_28px_rgba(0,0,0,0.14)]
                sm:p-5
            "
        >
            {/* DIRECTION ACCENT */}

            <div
                className="
                    absolute bottom-4 left-0 top-4
                    w-[2px] rounded-full
                    bg-indigo-300/70
                    dark:bg-indigo-400/30
                "
            />

            <div
                className="
                    relative flex min-w-0
                    flex-col gap-4
                    sm:flex-row sm:items-center
                    sm:justify-between
                "
            >
                {/* LEFT SECTION */}

                <div
                    className="
                        flex min-w-0 flex-1
                        items-start gap-3.5
                        sm:items-center
                    "
                >
                    {/* SOURCE ICON */}

                    <div className="relative shrink-0">
                        <SkeletonBlock
                            className="
                                !h-12 !w-12
                                !rounded-2xl
                                sm:!h-14 sm:!w-14
                            "
                        />

                        {/* SMALL FCOIN BADGE */}

                        <SkeletonBlock
                            className="
                                absolute -bottom-1 -right-1
                                !h-5 !w-5 !rounded-full
                                !bg-amber-200/80
                                dark:!bg-amber-400/15
                            "
                        />
                    </div>

                    {/* TRANSACTION INFORMATION */}

                    <div className="min-w-0 flex-1">
                        {/* SOURCE + STATUS */}

                        <div
                            className="
                                flex flex-wrap
                                items-center gap-1.5
                            "
                        >
                            <SkeletonBlock
                                className="
                                    !h-5 !w-20
                                    !rounded-full
                                    !bg-indigo-100
                                    dark:!bg-indigo-400/[0.09]
                                "
                            />

                            <SkeletonBlock
                                className="
                                    !h-5 !w-14 !rounded-full
                                "
                            />
                        </div>

                        {/* TITLE */}

                        <SkeletonBlock
                            className={`
                                mt-3 !h-4 max-w-full
                                ${
                                    index % 2 === 0
                                        ? "!w-[67%]"
                                        : "!w-[83%]"
                                }
                            `}
                        />

                        {/* DESCRIPTION */}

                        <SkeletonBlock
                            className="
                                mt-2.5 !h-3 !w-[92%]
                                max-w-full
                                !bg-slate-100
                                dark:!bg-white/[0.045]
                            "
                        />

                        <SkeletonBlock
                            className="
                                mt-2 !h-3 !w-[60%]
                                max-w-full
                                !bg-slate-100
                                dark:!bg-white/[0.045]
                            "
                        />

                        {/* DATE + TARGET */}

                        <div
                            className="
                                mt-3 flex flex-wrap
                                items-center gap-3
                            "
                        >
                            <SkeletonBlock
                                className="!h-2.5 !w-24"
                            />

                            <SkeletonBlock
                                className="!h-2.5 !w-16"
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT SECTION */}

                <div
                    className="
                        flex min-w-0 items-center
                        justify-between gap-3
                        border-t border-slate-200/80
                        pt-4
                        dark:border-white/[0.05]
                        sm:shrink-0 sm:justify-end
                        sm:border-l sm:border-t-0
                        sm:pl-5 sm:pt-0
                    "
                >
                    {/* DIRECTION ICON */}

                    <SkeletonBlock
                        className="
                            !h-9 !w-9 shrink-0 !rounded-xl
                        "
                    />

                    {/* AMOUNT + LABEL */}

                    <div
                        className="
                            flex flex-col items-end gap-2
                        "
                    >
                        <SkeletonBlock
                            className="
                                !h-10 !w-28
                                !rounded-xl
                                !bg-amber-100/80
                                dark:!bg-amber-400/[0.08]
                            "
                        />

                        <SkeletonBlock
                            className="!h-2 !w-12"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});

// =========================================================
// INITIAL LOADING
//
// Skeleton faqat birinchi yuklashda ko'rinadi.
// Eski ma'lumotlar refresh paytida saqlanadi.
// =========================================================

const LoadingState = () => {
    const reduceMotion = useReducedMotion();

    return (
        <section
            role="status"
            aria-label="FCoin tarixi yuklanmoqda"
            aria-live="polite"
            className="min-w-0"
        >
            <span className="sr-only">
                FCoin tranzaksiyalar tarixi yuklanmoqda,
                iltimos kuting.
            </span>

            {/* STATISTICS PLACEHOLDERS */}

            <SummarySkeleton />

            {/* TRANSACTIONS HEADER */}

            <div
                className="
                    mb-4 flex flex-wrap
                    items-center justify-between gap-3
                "
            >
                <div
                    className="
                        flex items-center gap-2.5
                    "
                >
                    <div
                        className="
                            flex h-9 w-9 items-center
                            justify-center rounded-xl
                            border border-indigo-200
                            bg-indigo-50 text-indigo-700
                            dark:border-indigo-400/15
                            dark:bg-indigo-500/[0.06]
                            dark:text-indigo-300
                        "
                    >
                        <WalletCards
                            size={17}
                            aria-hidden="true"
                        />
                    </div>

                    <div>
                        <p
                            className="
                                text-sm font-black
                                text-slate-900
                                dark:text-white
                            "
                        >
                            Tranzaksiyalar
                        </p>

                        <p
                            className="
                                mt-0.5 font-mono
                                text-[10px] font-semibold
                                text-slate-500
                                dark:text-gray-400
                            "
                        >
                            Ledger yuklanmoqda...
                        </p>
                    </div>
                </div>

                {/* SYNC INDICATOR */}

                <div
                    aria-hidden="true"
                    className="
                        inline-flex items-center gap-2
                        rounded-full border
                        border-indigo-200
                        bg-indigo-50 px-3 py-1.5
                        font-mono text-[10px]
                        font-black text-indigo-700
                        dark:border-indigo-400/15
                        dark:bg-indigo-500/[0.06]
                        dark:text-indigo-300
                    "
                >
                    <Loader2
                        size={13}
                        className={
                            reduceMotion
                                ? ""
                                : "animate-spin"
                        }
                    />

                    SYNCING
                </div>
            </div>

            {/* FIVE TRANSACTION PLACEHOLDERS */}

            <div
                aria-hidden="true"
                className="space-y-3"
            >
                {SKELETON_ROWS.map((index) => (
                    <SkeletonItem
                        key={index}
                        index={index}
                    />
                ))}
            </div>
        </section>
    );
};

// =========================================================
// FULL ERROR STATE
// =========================================================

const ErrorState = ({
    error,
    onRetry,
    isLoading = false,
}) => {
    const reduceMotion = useReducedMotion();

    const message = getErrorMessage(
        error,
        "Server bilan bog‘lanishda xatolik yuz berdi."
    );

    return (
        <motion.section
            role="alert"
            aria-labelledby="fcoin-history-error-title"
            initial={
                reduceMotion
                    ? false
                    : { opacity: 0, y: 14 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={appearTransition(reduceMotion)}
            className="
                relative min-w-0 overflow-hidden
                rounded-[28px] border border-red-200
                bg-red-50/85 px-4 py-12 text-center
                dark:border-red-400/[0.12]
                dark:bg-red-500/[0.035]
                sm:px-6
            "
        >
            <div
                aria-hidden="true"
                className="
                    pointer-events-none absolute
                    left-1/2 top-0 h-32 w-64
                    -translate-x-1/2 rounded-full
                    bg-red-500/[0.08] blur-[70px]
                "
            />

            <div className="relative z-10">
                <div
                    className="
                        mx-auto flex h-14 w-14
                        items-center justify-center
                        rounded-2xl border
                        border-red-200 bg-red-100
                        text-red-700
                        dark:border-red-400/[0.14]
                        dark:bg-red-500/[0.07]
                        dark:text-red-300
                    "
                >
                    <AlertTriangle
                        size={24}
                        aria-hidden="true"
                    />
                </div>

                <h3
                    id="fcoin-history-error-title"
                    className="
                        mt-5 text-lg font-black
                        text-slate-900 dark:text-white
                    "
                >
                    FCoin tarixi yuklanmadi
                </h3>

                <p
                    className="
                        mx-auto mt-2 max-w-lg break-words
                        text-sm font-medium leading-6
                        text-slate-700 dark:text-gray-400
                    "
                >
                    {message}
                </p>

                {typeof onRetry === "function" && (
                    <button
                        type="button"
                        onClick={onRetry}
                        disabled={Boolean(isLoading)}
                        className="
                            mt-6 inline-flex min-h-10
                            items-center justify-center gap-2
                            rounded-xl border border-red-200
                            bg-red-100/90 px-4 py-2.5
                            text-xs font-black text-red-800
                            transition-colors
                            hover:border-red-300
                            hover:bg-red-200/80
                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-red-500/60
                            focus-visible:ring-offset-2
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            dark:border-red-400/20
                            dark:bg-red-500/[0.08]
                            dark:text-red-200
                            dark:hover:border-red-400/30
                            dark:hover:bg-red-500/[0.13]
                            dark:focus-visible:ring-offset-[#0d1117]
                        "
                    >
                        <RefreshCw
                            size={15}
                            aria-hidden="true"
                            className={
                                isLoading && !reduceMotion
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        {isLoading
                            ? "Yuklanmoqda..."
                            : "Qayta urinish"}
                    </button>
                )}
            </div>
        </motion.section>
    );
};

// =========================================================
// REFRESH ERROR STATE
//
// Oldingi tranzaksiyalar o'chirilmaydi.
// Faqat ogohlantirish ko'rsatiladi.
// =========================================================

const RefreshErrorState = ({
    error,
    onRetry,
    isLoading = false,
}) => {
    const reduceMotion = useReducedMotion();

    const message = getErrorMessage(
        error,
        "Tranzaksiyalarni yangilab bo‘lmadi."
    );

    return (
        <motion.div
            role="alert"
            initial={
                reduceMotion
                    ? false
                    : { opacity: 0, y: -6 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={appearTransition(reduceMotion)}
            className="
                mb-4 flex min-w-0 flex-col gap-3
                rounded-2xl border border-amber-200
                bg-amber-50/90 p-4
                dark:border-amber-400/[0.12]
                dark:bg-amber-500/[0.04]
                sm:flex-row sm:items-center
                sm:justify-between
            "
        >
            <div
                className="
                    flex min-w-0 items-start gap-3
                "
            >
                <div
                    className="
                        flex h-9 w-9 shrink-0
                        items-center justify-center
                        rounded-xl border
                        border-amber-200
                        bg-amber-100 text-amber-700
                        dark:border-amber-400/15
                        dark:bg-amber-500/[0.07]
                        dark:text-amber-300
                    "
                >
                    <AlertTriangle
                        size={16}
                        aria-hidden="true"
                    />
                </div>

                <div className="min-w-0">
                    <p
                        className="
                            text-xs font-black
                            text-amber-900
                            dark:text-amber-200
                        "
                    >
                        Yangilashda xatolik
                    </p>

                    <p
                        className="
                            mt-1 line-clamp-2
                            break-words text-[11px]
                            font-medium leading-5
                            text-slate-700
                            dark:text-gray-400
                        "
                        title={message}
                    >
                        {message}
                    </p>
                </div>
            </div>

            {typeof onRetry === "function" && (
                <button
                    type="button"
                    onClick={onRetry}
                    disabled={Boolean(isLoading)}
                    className="
                        inline-flex min-h-9 shrink-0
                        items-center justify-center
                        gap-1.5 self-start
                        rounded-xl border
                        border-amber-200
                        bg-amber-100/90
                        px-3 py-2
                        text-[10px] font-black
                        text-amber-900
                        transition-colors
                        hover:bg-amber-200/80
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-amber-500/60
                        focus-visible:ring-offset-2
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                        dark:border-amber-400/15
                        dark:bg-amber-500/[0.06]
                        dark:text-amber-200
                        dark:hover:bg-amber-500/[0.10]
                        dark:focus-visible:ring-offset-[#0d1117]
                        sm:self-auto
                    "
                >
                    <RefreshCw
                        size={13}
                        aria-hidden="true"
                        className={
                            isLoading && !reduceMotion
                                ? "animate-spin"
                                : ""
                        }
                    />

                    {isLoading
                        ? "Yuklanmoqda..."
                        : "Yangilash"}
                </button>
            )}
        </motion.div>
    );
};

// =========================================================
// EMPTY STATE
// =========================================================

const EmptyState = () => {
    const reduceMotion = useReducedMotion();

    return (
        <motion.section
            aria-labelledby="fcoin-history-empty-title"
            initial={
                reduceMotion
                    ? false
                    : { opacity: 0, y: 14 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={appearTransition(reduceMotion)}
            className="
                relative min-w-0 overflow-hidden
                rounded-[28px] border border-dashed
                border-slate-300 bg-white/75
                px-4 py-16 text-center
                dark:border-white/[0.08]
                dark:bg-white/[0.015]
                sm:px-6
            "
        >
            <div
                aria-hidden="true"
                className="
                    pointer-events-none absolute
                    left-1/2 top-0 h-40 w-72
                    -translate-x-1/2 rounded-full
                    bg-indigo-500/[0.05]
                    blur-[80px]
                "
            />

            <div className="relative z-10">
                <div
                    className="
                        mx-auto flex h-16 w-16
                        items-center justify-center
                        rounded-[22px] border
                        border-slate-200
                        bg-slate-100 text-slate-500
                        dark:border-white/[0.07]
                        dark:bg-white/[0.025]
                        dark:text-gray-500
                    "
                >
                    <History
                        size={26}
                        aria-hidden="true"
                    />
                </div>

                <h3
                    id="fcoin-history-empty-title"
                    className="
                        mt-5 text-lg font-black
                        text-slate-900
                        dark:text-white
                    "
                >
                    Hali tranzaksiyalar yo‘q
                </h3>

                <p
                    className="
                        mx-auto mt-2 max-w-md
                        text-sm font-medium leading-6
                        text-slate-600
                        dark:text-gray-400
                    "
                >
                    Problem, project, feedback, daily login
                    yoki boshqa faoliyatlardan FCoin
                    olganingizda history shu yerda ko‘rinadi.
                </p>

                <div
                    className="
                        mx-auto mt-6 inline-flex
                        items-center gap-2
                        rounded-full border
                        border-amber-200
                        bg-amber-50 px-3 py-1.5
                        text-[10px] font-black
                        uppercase tracking-[0.14em]
                        text-amber-800
                        dark:border-yellow-400/[0.12]
                        dark:bg-yellow-400/[0.05]
                        dark:text-yellow-300
                    "
                >
                    <WalletCards
                        size={13}
                        aria-hidden="true"
                    />

                    FCoin ledger
                </div>
            </div>
        </motion.section>
    );
};

// =========================================================
// MAIN STATE
//
// Original props va shartlar saqlangan.
// =========================================================

const FCoinHistoryState = ({
    isInitialLoading = false,
    isLoading = false,
    error = null,
    hasLoaded = false,
    hasTransactions = false,
    onRetry,
}) => {
    // INITIAL LOADING

    if (isInitialLoading) {
        return <LoadingState />;
    }

    // REFRESH ERROR
    // Oldingi transactions ko'rinib turadi.

    if (error && hasTransactions) {
        return (
            <RefreshErrorState
                error={error}
                onRetry={onRetry}
                isLoading={isLoading}
            />
        );
    }

    // FULL ERROR

    if (error) {
        return (
            <ErrorState
                error={error}
                onRetry={onRetry}
                isLoading={isLoading}
            />
        );
    }

    // EMPTY STATE

    if (hasLoaded && !hasTransactions) {
        return <EmptyState />;
    }

    return null;
};

// =========================================================
// EXPORT
// =========================================================

export default memo(FCoinHistoryState);