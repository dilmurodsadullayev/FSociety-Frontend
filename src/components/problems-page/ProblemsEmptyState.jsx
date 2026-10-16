
import React from "react";
import { Link } from "react-router-dom";

import {
    Plus,
    RotateCcw,
    Search,
    TerminalSquare,
} from "lucide-react";

// =========================================================
// FSOCIETY — PROBLEMS EMPTY STATE
//
// Two states:
// 1. No matching search/filter results
// 2. No problems in the registry
//
// Props preserved:
// - hasActiveFilters
// - onResetFilters
// - createHref
//
// No Redux or API requests.
// =========================================================

// =========================================================
// COMMON STATE CONTAINER
// =========================================================

const EmptyStateLayout = ({
    Icon,
    variant = "indigo",
    systemLabel,
    title,
    description,
    children,
}) => {
    const isFiltered = variant === "cyan";

    return (
        <div
            role="status"
            className="
                relative
                col-span-full

                w-full
                min-w-0

                overflow-hidden

                rounded-[22px]
                border
                border-dashed
                border-slate-300

                bg-white/85

                px-4
                py-10

                text-center

                shadow-[0_12px_35px_rgba(15,23,42,0.035)]

                sm:rounded-[28px]
                sm:px-6
                sm:py-14

                dark:border-white/[0.10]
                dark:bg-[#090e18]/80
                dark:shadow-black/10
            "
        >
            {/* BACKGROUND GLOW */}

            <div
                aria-hidden="true"
                className={`
                    pointer-events-none

                    absolute
                    left-1/2
                    top-0

                    h-48
                    w-80

                    max-w-full

                    -translate-x-1/2
                    -translate-y-1/2

                    rounded-full

                    blur-[80px]

                    ${
                        isFiltered
                            ? "bg-cyan-500/[0.07]"
                            : "bg-indigo-500/[0.08]"
                    }
                `}
            />

            <div
                className="
                    relative
                    z-10

                    mx-auto
                    flex
                    max-w-xl
                    min-w-0

                    flex-col
                    items-center
                "
            >
                {/* ICON */}

                <div
                    className={`
                        grid
                        h-14
                        w-14
                        shrink-0

                        place-items-center

                        rounded-[18px]
                        border

                        sm:h-16
                        sm:w-16
                        sm:rounded-[20px]

                        ${
                            isFiltered
                                ? `
                                    border-cyan-400/35
                                    bg-cyan-500/[0.07]
                                    text-cyan-700

                                    dark:border-cyan-400/20
                                    dark:bg-cyan-500/[0.055]
                                    dark:text-cyan-300
                                `
                                : `
                                    border-indigo-400/35
                                    bg-indigo-500/[0.07]
                                    text-indigo-700

                                    dark:border-indigo-400/20
                                    dark:bg-indigo-500/[0.06]
                                    dark:text-indigo-300
                                `
                        }
                    `}
                >
                    <Icon
                        size={26}
                        strokeWidth={1.8}
                        aria-hidden="true"
                    />
                </div>

                {/* SYSTEM LABEL */}

                <div
                    className={`
                        mt-5

                        inline-flex
                        max-w-full

                        items-center
                        gap-2

                        rounded-full
                        border

                        px-3
                        py-1.5

                        font-mono
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.12em]

                        ${
                            isFiltered
                                ? `
                                    border-cyan-400/25
                                    bg-cyan-500/[0.05]
                                    text-cyan-800

                                    dark:border-cyan-400/15
                                    dark:text-cyan-300
                                `
                                : `
                                    border-indigo-400/25
                                    bg-indigo-500/[0.05]
                                    text-indigo-800

                                    dark:border-indigo-400/15
                                    dark:text-indigo-300
                                `
                        }
                    `}
                >
                    <span
                        aria-hidden="true"
                        className={`
                            h-1.5
                            w-1.5
                            shrink-0
                            rounded-full

                            ${
                                isFiltered
                                    ? "bg-cyan-500"
                                    : "bg-indigo-500"
                            }
                        `}
                    />

                    <span className="break-all">
                        {systemLabel}
                    </span>
                </div>

                {/* TITLE */}

                <h3
                    className="
                        mt-4

                        break-words

                        font-display
                        text-xl
                        font-black
                        tracking-tight

                        text-slate-900

                        sm:text-2xl

                        dark:text-white
                    "
                >
                    {title}
                </h3>

                {/* DESCRIPTION */}

                <p
                    className="
                        mt-3
                        max-w-lg

                        whitespace-normal
                        break-words

                        text-[13px]
                        font-medium
                        leading-6

                        text-slate-600

                        sm:text-sm
                        sm:leading-7

                        dark:text-gray-400
                    "
                >
                    {description}
                </p>

                {/* ACTION */}

                {children && (
                    <div
                        className="
                            mt-6

                            flex
                            w-full
                            min-w-0

                            flex-wrap
                            items-center
                            justify-center
                            gap-3
                        "
                    >
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
};

// =========================================================
// MAIN COMPONENT
// =========================================================

const ProblemsEmptyState = ({
    hasActiveFilters = false,
    onResetFilters,
    createHref = "/problem-create",
}) => {
    // =====================================================
    // FILTERED EMPTY RESULTS
    // =====================================================

    if (hasActiveFilters) {
        return (
            <EmptyStateLayout
                Icon={Search}
                variant="cyan"
                systemLabel="query.empty"
                title="Mos muammo topilmadi"
                description={
                    "Qidiruv yoki tanlangan filtrlar " +
                    "bo‘yicha hech qanday muammo topilmadi. " +
                    "Boshqa parametrlarni sinab ko‘ring."
                }
            >
                {typeof onResetFilters === "function" && (
                    <button
                        type="button"
                        onClick={onResetFilters}
                        className="
                            inline-flex
                            min-h-11
                            max-w-full

                            items-center
                            justify-center
                            gap-2

                            rounded-xl
                            border
                            border-cyan-400/35

                            bg-cyan-500/[0.08]

                            px-5
                            py-2.5

                            font-display
                            text-xs
                            font-bold

                            text-cyan-800

                            transition-colors

                            hover:border-cyan-400/55
                            hover:bg-cyan-500/[0.13]

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-cyan-500
                            focus-visible:ring-offset-2

                            dark:border-cyan-400/25
                            dark:bg-cyan-400/[0.07]
                            dark:text-cyan-300

                            dark:hover:bg-cyan-400/[0.12]
                            dark:focus-visible:ring-offset-[#090e18]
                        "
                    >
                        <RotateCcw
                            size={15}
                            strokeWidth={2}
                            aria-hidden="true"
                            className="shrink-0"
                        />

                        Filtrlarni tozalash
                    </button>
                )}
            </EmptyStateLayout>
        );
    }

    // =====================================================
    // EMPTY PROBLEMS REGISTRY
    // =====================================================

    return (
        <EmptyStateLayout
            Icon={TerminalSquare}
            variant="indigo"
            systemLabel="registry.empty"
            title="Hozircha muammolar mavjud emas"
            description={
                "Community hali birorta muammo joylamagan. " +
                "Birinchi muammoni siz ulashing va " +
                "F.Society bilim bazasini boshlang."
            }
        >
            <Link
                to={createHref}
                className="
                    inline-flex
                    min-h-11
                    max-w-full

                    items-center
                    justify-center
                    gap-2

                    rounded-xl
                    border
                    border-indigo-500/30

                    bg-gradient-to-r
                    from-indigo-600
                    to-purple-600

                    px-5
                    py-2.5

                    font-display
                    text-xs
                    font-black

                    text-white

                    shadow-md
                    shadow-indigo-500/15

                    transition-colors

                    hover:from-indigo-500
                    hover:to-purple-500

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-indigo-500
                    focus-visible:ring-offset-2

                    dark:border-indigo-400/25
                    dark:shadow-indigo-950/20
                    dark:focus-visible:ring-offset-[#090e18]
                "
            >
                <Plus
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                    className="shrink-0"
                />

                <span className="break-words">
                    Birinchi muammoni yarating
                </span>
            </Link>
        </EmptyStateLayout>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(ProblemsEmptyState);
