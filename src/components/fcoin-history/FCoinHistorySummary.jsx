// src/components/fcoin-history/FCoinHistorySummary.jsx

import React, { memo } from "react";

import {
    motion,
    useReducedMotion,
} from "framer-motion";

import {
    Database,
    Layers3,
    ListFilter,
    Rows3,
} from "lucide-react";

import {
    formatFullCoinNumber,
} from "./coinHistoryHelpers";

// =========================================================
// SHARED VALUES / FULL NUMBER FORMATTING
// =========================================================

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 15, 25, 50];

const safeInteger = (value, fallback = 0, minimum = 0) => {
    const number = Number(value);

    return Number.isFinite(number)
        ? Math.max(minimum, Math.trunc(number))
        : fallback;
};

const formatNumber = (value) => formatFullCoinNumber(value);

// =========================================================
// SUMMARY CARD
// =========================================================

const SummaryCard = memo(function SummaryCard({
    icon: Icon,
    label,
    value,
    description,
    reduceMotion = false,
}) {
    return (
        <motion.div
            whileHover={
                reduceMotion
                    ? undefined
                    : { y: -3 }
            }
            transition={
                reduceMotion
                    ? { duration: 0 }
                    : { duration: 0.2 }
            }
            className="
                group relative min-w-0 overflow-hidden
                rounded-2xl border border-slate-200/90
                bg-white/80 p-4 shadow-sm
                transition-colors duration-200
                hover:border-indigo-300 hover:bg-white
                dark:border-white/[0.06]
                dark:bg-white/[0.025]
                dark:shadow-none
                dark:hover:border-indigo-400/[0.16]
                dark:hover:bg-white/[0.04]
            "
        >
            <div
                aria-hidden="true"
                className="
                    pointer-events-none absolute
                    -right-8 -top-8 h-20 w-20
                    rounded-full bg-indigo-500/[0.08]
                    opacity-0 blur-2xl
                    transition-opacity
                    group-hover:opacity-100
                "
            />

            <div
                className="
                    relative z-10 flex min-w-0
                    items-start gap-3
                "
            >
                <div
                    className="
                        flex h-10 w-10 shrink-0
                        items-center justify-center
                        rounded-xl border
                        border-indigo-200 bg-indigo-50
                        text-indigo-700
                        dark:border-indigo-400/[0.14]
                        dark:bg-indigo-500/[0.07]
                        dark:text-indigo-300
                    "
                >
                    <Icon
                        size={17}
                        aria-hidden="true"
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <p
                        className="
                            font-mono text-[10px]
                            font-black uppercase
                            tracking-[0.13em]
                            text-slate-600
                            dark:text-gray-400
                        "
                    >
                        {label}
                    </p>

                    <p
                        className="
                            mt-1 break-words font-mono
                            text-lg font-black leading-tight
                            tabular-nums text-slate-900
                            dark:text-white sm:text-xl
                        "
                        title={String(value)}
                    >
                        {value}
                    </p>

                    {description && (
                        <p
                            className="
                                mt-1 break-words text-[11px]
                                font-medium leading-5
                                text-slate-600
                                dark:text-gray-400
                            "
                        >
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
});

// =========================================================
// HISTORY SUMMARY
// =========================================================

const FCoinHistorySummary = ({
    count = 0,
    currentPage = 1,
    totalPages = 0,
    pageSize = 15,
    range = {
        from: 0,
        to: 0,
        count: 0,
    },
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    isLoading = false,
    onPageSizeChange,
}) => {
    const reduceMotion = useReducedMotion();

    // =====================================================
    // SAFE PAGINATION VALUES
    // =====================================================

    const safeCount = safeInteger(count, 0, 0);

    const safeCurrentPage = safeInteger(
        currentPage,
        1,
        1
    );

    const safeTotalPages = safeInteger(
        totalPages,
        0,
        0
    );

    const safePageSize = safeInteger(
        pageSize,
        15,
        1
    );

    const safeRange =
        range &&
        typeof range === "object" &&
        !Array.isArray(range)
            ? range
            : {
                from: 0,
                to: 0,
                count: safeCount,
            };

    const rangeFrom = safeInteger(
        safeRange.from,
        0,
        0
    );

    const rangeTo = safeInteger(
        safeRange.to,
        0,
        0
    );

    const hasVisibleRange =
        safeCount > 0 &&
        rangeFrom > 0 &&
        rangeTo >= rangeFrom;

    // =====================================================
    // PAGE SIZE OPTIONS
    // =====================================================

    const validOptions = Array.from(
        new Set(
            (
                Array.isArray(pageSizeOptions)
                    ? pageSizeOptions
                    : DEFAULT_PAGE_SIZE_OPTIONS
            )
                .map((option) => safeInteger(option, 0, 0))
                .filter((option) => option > 0)
        )
    );

    const options =
        validOptions.length > 0
            ? validOptions
            : DEFAULT_PAGE_SIZE_OPTIONS;

    const displayedOptions = options.includes(safePageSize)
        ? options
        : [...options, safePageSize].sort((a, b) => a - b);

    // =====================================================
    // PAGE SIZE HANDLER
    // =====================================================

    const handlePageSize = (event) => {
        if (typeof onPageSizeChange === "function") {
            // useCoinHistory already accepts a string
            // value from the select.
            onPageSizeChange(event.target.value);
        }
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <section
            aria-labelledby="fcoin-ledger-overview-heading"
            aria-busy={Boolean(isLoading)}
            className="
                relative mt-5 min-w-0 overflow-hidden
                rounded-[26px] border
                border-slate-200/90
                bg-white/80 p-4
                shadow-[0_20px_70px_rgba(15,23,42,0.07)]
                backdrop-blur-xl

                dark:border-white/[0.06]
                dark:bg-[#0d1117]/80
                dark:shadow-[0_20px_70px_rgba(0,0,0,0.25)]

                sm:p-5
            "
        >
            {/* =========================================
                HEADER AND PAGE SIZE
            ========================================== */}

            <div
                className="
                    mb-4 flex flex-col gap-3
                    sm:flex-row sm:items-center
                    sm:justify-between
                "
            >
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <ListFilter
                            size={16}
                            className="
                                shrink-0 text-indigo-600
                                dark:text-indigo-300
                            "
                            aria-hidden="true"
                        />

                        <h2
                            id="fcoin-ledger-overview-heading"
                            className="
                                text-sm font-black
                                text-slate-900
                                dark:text-white
                            "
                        >
                            Ledger overview
                        </h2>
                    </div>

                    <p
                        className="
                            mt-1 text-[11px] font-medium
                            text-slate-600
                            dark:text-gray-400
                        "
                    >
                        Tranzaksiyalar va pagination holati
                    </p>
                </div>

                <label
                    className="
                        flex w-fit max-w-full
                        items-center gap-2 text-xs
                        font-semibold text-slate-600
                        dark:text-gray-400
                    "
                >
                    <Rows3
                        size={15}
                        className="shrink-0"
                        aria-hidden="true"
                    />

                    <span>Sahifada</span>

                    <select
                        value={safePageSize}
                        onChange={handlePageSize}
                        disabled={
                            Boolean(isLoading) ||
                            typeof onPageSizeChange !== "function"
                        }
                        aria-label="Sahifadagi tranzaksiyalar soni"
                        className="
                            min-w-[68px] rounded-xl
                            border border-slate-300
                            bg-white px-3 py-2
                            text-xs font-black
                            text-slate-900 outline-none
                            transition-colors

                            hover:border-indigo-300
                            focus-visible:border-indigo-500
                            focus-visible:ring-2
                            focus-visible:ring-indigo-500/25

                            disabled:cursor-not-allowed
                            disabled:opacity-50

                            dark:border-white/[0.08]
                            dark:bg-[#111820]
                            dark:text-gray-200
                            dark:hover:border-indigo-400/30
                            dark:focus-visible:border-indigo-400/40
                        "
                    >
                        {displayedOptions.map((option) => (
                            <option
                                key={option}
                                value={option}
                            >
                                {option}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {/* =========================================
                SUMMARY CARDS
            ========================================== */}

            <div
                className="
                    grid min-w-0 grid-cols-1 gap-3
                    sm:grid-cols-2 xl:grid-cols-3
                "
            >
                <SummaryCard
                    icon={Database}
                    label="Total records"
                    value={formatNumber(safeCount)}
                    description="Barcha FCoin tranzaksiyalar"
                    reduceMotion={reduceMotion}
                />

                <SummaryCard
                    icon={Layers3}
                    label="Current page"
                    value={
                        safeTotalPages > 0
                            ? (
                                `${formatNumber(safeCurrentPage)} / ` +
                                `${formatNumber(safeTotalPages)}`
                            )
                            : "0 / 0"
                    }
                    description="Joriy pagination holati"
                    reduceMotion={reduceMotion}
                />

                <SummaryCard
                    icon={Rows3}
                    label="Visible records"
                    value={
                        hasVisibleRange
                            ? (
                                `${formatNumber(rangeFrom)}–` +
                                `${formatNumber(rangeTo)}`
                            )
                            : "0"
                    }
                    description={
                        safeCount > 0
                            ? `${formatNumber(safeCount)} ta yozuv ichidan`
                            : "Hozircha yozuv yo‘q"
                    }
                    reduceMotion={reduceMotion}
                />
            </div>

            {/* =========================================
                LOADING PROGRESS
            ========================================== */}

            <div
                aria-hidden="true"
                className="
                    mt-4 h-0.5 overflow-hidden
                    rounded-full bg-slate-200/80
                    dark:bg-white/[0.04]
                "
            >
                {Boolean(isLoading) && (
                    reduceMotion ? (
                        <div
                            className="
                                h-full w-full
                                bg-indigo-400/70
                            "
                        />
                    ) : (
                        <motion.div
                            initial={{
                                x: "-100%",
                            }}
                            animate={{
                                x: "300%",
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 1.4,
                                ease: "linear",
                            }}
                            className="
                                h-full w-1/3 rounded-full
                                bg-gradient-to-r
                                from-transparent
                                via-indigo-500
                                to-transparent
                                dark:via-indigo-400
                            "
                        />
                    )
                )}
            </div>
        </section>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(FCoinHistorySummary);