// src/components/fcoin-history/FCoinHistoryList.jsx

import React, { memo } from "react";

import {
    AnimatePresence,
    motion,
    useReducedMotion,
} from "framer-motion";

import {
    History,
    Loader2,
} from "lucide-react";

import FCoinHistoryItem from "./FCoinHistoryItem";

import {
    getCoinItemKey,
} from "./coinHistoryHelpers";

// =========================================================
// ANIMATION CONFIGURATION
// =========================================================

const REFRESH_INITIAL = {
    opacity: 0,
    x: 8,
};

const REFRESH_VISIBLE = {
    opacity: 1,
    x: 0,
};

const REFRESH_EXIT = {
    opacity: 0,
    x: 8,
};

// =========================================================
// COMPONENT
// =========================================================

const FCoinHistoryList = ({
    coins = [],
    isRefreshing = false,
}) => {
    const reduceMotion = useReducedMotion();

    const transactions = Array.isArray(coins)
        ? coins
        : [];

    // Standalone fallback:
    // The parent FCoinHistoryState.jsx remains responsible
    // for the primary loading, error and empty states.

    if (transactions.length === 0) {
        return (
            <section
                id="fcoin-history-list"
                aria-label="FCoin tranzaksiyalar tarixi"
                className="
                    scroll-mt-28 rounded-[26px]
                    border border-dashed border-slate-300
                    bg-white/80 px-6 py-16 text-center
                    shadow-sm
                    dark:border-white/[0.07]
                    dark:bg-white/[0.015]
                    dark:shadow-none
                "
            >
                <div
                    className="
                        mx-auto flex h-14 w-14
                        items-center justify-center
                        rounded-2xl border border-slate-200
                        bg-slate-100 text-slate-500
                        dark:border-white/[0.07]
                        dark:bg-white/[0.025]
                        dark:text-gray-500
                    "
                >
                    <History
                        size={23}
                        aria-hidden="true"
                    />
                </div>

                <h2
                    className="
                        mt-4 text-sm font-black
                        text-slate-800 dark:text-gray-300
                    "
                >
                    FCoin tranzaksiyalar topilmadi
                </h2>

                <p
                    className="
                        mx-auto mt-2 max-w-sm
                        text-xs font-medium leading-5
                        text-slate-600 dark:text-gray-500
                    "
                >
                    Yangi mukofot yoki FCoin xarajati
                    paydo bo‘lganda shu yerda ko‘rinadi.
                </p>
            </section>
        );
    }

    return (
        <section
            id="fcoin-history-list"
            aria-labelledby="fcoin-history-list-title"
            className="
                relative min-w-0 scroll-mt-28
            "
        >
            {/* HEADER */}
            <div
                className="
                    mb-4 flex flex-wrap items-center
                    justify-between gap-3
                "
            >
                <div
                    className="
                        flex min-w-0 items-center gap-2
                    "
                >
                    <div
                        className="
                            flex h-8 w-8 shrink-0
                            items-center justify-center
                            rounded-xl border border-slate-200
                            bg-white/75 text-slate-600
                            dark:border-white/[0.06]
                            dark:bg-white/[0.025]
                            dark:text-gray-400
                        "
                    >
                        <History
                            size={14}
                            aria-hidden="true"
                        />
                    </div>

                    <div className="min-w-0">
                        <h2
                            id="fcoin-history-list-title"
                            className="
                                text-sm font-black
                                text-slate-900 dark:text-white
                            "
                        >
                            Tranzaksiyalar
                        </h2>

                        <p
                            className="
                                mt-0.5 text-[10px]
                                font-medium text-slate-600
                                dark:text-gray-500
                            "
                        >
                            Eng yangi yozuvlar birinchi
                        </p>
                    </div>
                </div>

                {/* REFRESH STATUS */}
                <AnimatePresence initial={false}>
                    {isRefreshing && (
                        <motion.div
                            key="refresh-status"
                            initial={
                                reduceMotion
                                    ? false
                                    : REFRESH_INITIAL
                            }
                            animate={REFRESH_VISIBLE}
                            exit={
                                reduceMotion
                                    ? undefined
                                    : REFRESH_EXIT
                            }
                            transition={
                                reduceMotion
                                    ? { duration: 0 }
                                    : { duration: 0.2 }
                            }
                            role="status"
                            aria-live="polite"
                            className="
                                inline-flex shrink-0
                                items-center gap-1.5
                                rounded-full border
                                border-indigo-200
                                bg-indigo-50 px-2.5 py-1.5
                                font-mono text-[9px]
                                font-black uppercase
                                tracking-[0.12em]
                                text-indigo-700
                                dark:border-indigo-400/15
                                dark:bg-indigo-500/[0.06]
                                dark:text-indigo-300
                            "
                        >
                            <Loader2
                                size={12}
                                className={
                                    reduceMotion
                                        ? ""
                                        : "animate-spin"
                                }
                                aria-hidden="true"
                            />
                            Updating
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* REFRESH PROGRESS */}
            <div
                aria-hidden="true"
                className="
                    mb-3 h-px overflow-hidden
                    rounded-full bg-slate-200/90
                    dark:bg-white/[0.025]
                "
            >
                {isRefreshing && (
                    reduceMotion ? (
                        <div
                            className="
                                h-full w-full bg-indigo-400/60
                            "
                        />
                    ) : (
                        <motion.div
                            initial={{
                                x: "-100%",
                            }}
                            animate={{
                                x: "350%",
                            }}
                            transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            className="
                                h-full w-1/4
                                bg-gradient-to-r
                                from-transparent
                                via-indigo-500/80
                                to-transparent
                                dark:via-indigo-400/80
                            "
                        />
                    )
                )}
            </div>

            {/* TRANSACTION ITEMS */}
            <div
                className="
                    grid min-w-0 grid-cols-1 gap-3
                "
                role="list"
                aria-label="FCoin tranzaksiyalari"
            >
                <AnimatePresence
                    initial={false}
                    mode={
                        reduceMotion
                            ? "sync"
                            : "popLayout"
                    }
                >
                    {transactions.map(
                        (item, index) => (
                            <motion.div
                                key={
                                    getCoinItemKey(
                                        item,
                                        index
                                    )
                                }
                                layout={!reduceMotion}
                                role="listitem"
                                className="min-w-0"
                            >
                                <FCoinHistoryItem
                                    item={item}
                                    index={index}
                                />
                            </motion.div>
                        )
                    )}
                </AnimatePresence>
            </div>

            {/* BOTTOM DECORATION */}
            <div
                aria-hidden="true"
                className="
                    mx-auto mt-6 h-px w-2/3
                    bg-gradient-to-r
                    from-transparent
                    via-slate-300/70
                    to-transparent
                    dark:via-white/[0.06]
                "
            />
        </section>
    );
};

export default memo(FCoinHistoryList);