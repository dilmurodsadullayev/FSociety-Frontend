
import React, { memo } from "react";
import { Link } from "react-router-dom";

import {
    AlertTriangle,
    ArrowRight,
    Bug,
    Plus,
    RefreshCw,
    Zap,
} from "lucide-react";

import PopularProbelmCard from "../../PopularProblemCard";
import homeStyles from "./homeStyles";

// =========================================================
// CONFIG
// =========================================================

const SKELETON_COUNT = 3;

// =========================================================
// TRENDING PROBLEM SKELETON
// =========================================================

const TrendingProblemSkeleton = memo(
    function TrendingProblemSkeleton() {
        return (
            <div
                aria-hidden="true"
                className="
                    animate-pulse
                    rounded-3xl

                    border
                    border-slate-200

                    bg-white/90
                    p-5

                    motion-reduce:animate-none

                    dark:border-white/[0.07]
                    dark:bg-white/[0.025]
                "
            >
                <div className="flex items-center justify-between gap-3">
                    <div className="
                        h-5 w-24 rounded-full
                        bg-slate-200 dark:bg-white/[0.07]
                    " />

                    <div className="
                        h-7 w-7 rounded-lg
                        bg-slate-200 dark:bg-white/[0.06]
                    " />
                </div>

                <div className="
                    mt-5 h-5 w-4/5 rounded-lg
                    bg-slate-200 dark:bg-white/[0.07]
                " />

                <div className="
                    mt-3 h-3 w-full rounded-full
                    bg-slate-100 dark:bg-white/[0.05]
                " />

                <div className="
                    mt-2 h-3 w-3/4 rounded-full
                    bg-slate-100 dark:bg-white/[0.05]
                " />

                <div className="
                    mt-8 h-9 rounded-xl
                    bg-slate-100 dark:bg-white/[0.04]
                " />
            </div>
        );
    }
);

// =========================================================
// ERROR + RETRY
// =========================================================

const TrendingProblemError = memo(
    function TrendingProblemError({
        error,
        onRetry,
    }) {
        if (!error) return null;

        const message =
            typeof error === "string"
                ? error
                : typeof error?.message === "string"
                    ? error.message
                    : "Qaynoq muammolarni yuklab bo‘lmadi.";

        return (
            <div
                role="alert"
                className="
                    col-span-full

                    flex
                    flex-col
                    gap-3

                    rounded-2xl
                    border
                    border-rose-200

                    bg-rose-50
                    p-4

                    sm:flex-row
                    sm:items-center
                    sm:justify-between

                    dark:border-rose-400/20
                    dark:bg-rose-400/[0.07]
                "
            >
                <p
                    className="
                        flex
                        min-w-0
                        items-start
                        gap-2

                        break-words

                        text-xs
                        leading-6

                        text-rose-800

                        dark:text-rose-200
                    "
                >
                    <AlertTriangle
                        size={17}
                        aria-hidden="true"
                        className="mt-0.5 shrink-0"
                    />

                    {message}
                </p>

                {typeof onRetry === "function" && (
                    <button
                        type="button"
                        onClick={onRetry}
                        className="
                            inline-flex
                            min-h-10

                            shrink-0
                            items-center
                            justify-center
                            gap-2

                            self-start

                            rounded-xl
                            border
                            border-rose-300

                            bg-white
                            px-4

                            text-xs
                            font-bold
                            text-rose-800

                            hover:bg-rose-100

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-rose-500

                            sm:self-auto

                            dark:border-rose-400/25
                            dark:bg-rose-400/[0.08]
                            dark:text-rose-200
                        "
                    >
                        <RefreshCw
                            size={15}
                            aria-hidden="true"
                        />

                        Qayta urinish
                    </button>
                )}
            </div>
        );
    }
);

// =========================================================
// EMPTY STATE
// =========================================================

const TrendingProblemsEmpty = memo(
    function TrendingProblemsEmpty() {
        return (
            <div
                className="
                    col-span-full

                    rounded-3xl
                    border
                    border-dashed
                    border-slate-300

                    bg-white/80

                    px-6
                    py-12

                    text-center

                    dark:border-white/[0.10]
                    dark:bg-white/[0.025]
                "
            >
                <Bug
                    size={26}
                    strokeWidth={1.8}
                    aria-hidden="true"
                    className="
                        mx-auto
                        text-slate-400
                        dark:text-slate-500
                    "
                />

                <h3
                    className="
                        mt-4
                        text-sm
                        font-black

                        text-slate-800

                        dark:text-slate-200
                    "
                >
                    Hozircha qaynoq muammo yo‘q
                </h3>

                <p
                    className="
                        mt-2
                        text-xs

                        text-slate-600

                        dark:text-slate-400
                    "
                >
                    Birinchi muammoni siz joylashingiz mumkin.
                </p>

                <Link
                    to="/problem-create"
                    className="
                        mt-5

                        inline-flex
                        min-h-10

                        items-center
                        gap-2

                        rounded-xl
                        border
                        border-cyan-200

                        bg-cyan-50

                        px-4
                        py-2.5

                        text-xs
                        font-bold

                        text-cyan-800

                        hover:border-cyan-300

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-indigo-500

                        dark:border-cyan-400/20
                        dark:bg-cyan-400/[0.07]
                        dark:text-cyan-300
                    "
                >
                    <Plus
                        size={14}
                        aria-hidden="true"
                    />

                    Muammo joylash
                </Link>
            </div>
        );
    }
);

// =========================================================
// FSOCIETY — HOME TRENDING PROBLEMS
//
// Preserves PopularProbelmCard contract:
//
// - id
// - user
// - problem
// - description
// - star
// - response
// - views
// - language
// - technology
// - status
// - createdAt
//
// Features:
// - Loading skeleton
// - Error / Retry
// - Empty state
// - Light / Dark Mode
// - Responsive grid
// =========================================================

const HomeTrendingProblems = ({
    problems = [],
    isLoading = false,
    error = null,
    onRetry,
}) => {
    const safeProblems = Array.isArray(problems)
        ? problems
        : [];

    const hasProblems = safeProblems.length > 0;

    return (
        <section
            id="problems"
            aria-labelledby="home-trending-title"
            aria-busy={isLoading}
            className={`
                relative
                min-w-0
                overflow-hidden

                border-b

                bg-white/40

                px-4
                py-14

                sm:px-6

                lg:px-8
                lg:py-20

                xl:px-10

                dark:bg-[#0a0f16]/55

                ${homeStyles.divider}
            `}
        >
            {/* BACKGROUND GLOW */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute

                    -right-20
                    top-0

                    h-72
                    w-72

                    rounded-full

                    bg-indigo-300/15
                    blur-[100px]

                    dark:bg-indigo-500/[0.05]
                "
            />

            {/* ======================================
                SECTION HEADER
            ====================================== */}

            <div
                className="
                    relative

                    flex
                    flex-col
                    gap-5

                    sm:flex-row
                    sm:items-end
                    sm:justify-between
                "
            >
                <div className="min-w-0">
                    <span
                        className="
                            inline-flex
                            max-w-full

                            items-center
                            gap-2

                            rounded-full
                            border
                            border-orange-200

                            bg-orange-50

                            px-3
                            py-1.5

                            font-mono
                            text-[9px]
                            font-black
                            uppercase
                            tracking-[0.12em]

                            text-orange-700

                            dark:border-orange-400/15
                            dark:bg-orange-400/[0.055]
                            dark:text-orange-300
                        "
                    >
                        <Zap
                            size={13}
                            strokeWidth={2}
                            aria-hidden="true"
                        />

                        community://trending
                    </span>

                    <h2
                        id="home-trending-title"
                        className="
                            mt-4

                            text-3xl
                            font-black
                            tracking-[-0.035em]

                            text-slate-900

                            sm:text-4xl

                            dark:text-white
                        "
                    >
                        Qaynoq{" "}

                        <span
                            className="
                                bg-gradient-to-r
                                from-cyan-600
                                to-indigo-600

                                bg-clip-text
                                text-transparent

                                dark:from-cyan-300
                                dark:to-indigo-300
                            "
                        >
                            Muammolar
                        </span>
                    </h2>

                    <p
                        className="
                            mt-3
                            max-w-xl

                            text-sm
                            leading-6

                            text-slate-600

                            dark:text-slate-400
                        "
                    >
                        Jamiyat eng ko‘p ko‘rayotgan,
                        muhokama qilayotgan va yechim
                        izlayotgan muammolar.
                    </p>
                </div>

                <Link
                    to="/problems"
                    className={`
                        group/all

                        inline-flex
                        min-h-10
                        w-fit

                        shrink-0

                        items-center
                        gap-2

                        rounded-xl
                        border

                        px-4
                        py-2.5

                        text-xs
                        font-bold

                        transition-colors

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-indigo-500

                        ${homeStyles.secondaryButton}
                    `}
                >
                    Barcha muammolar

                    <ArrowRight
                        size={14}
                        strokeWidth={2}
                        aria-hidden="true"
                        className="
                            transition-transform
                            group-hover/all:translate-x-0.5
                            motion-reduce:transform-none
                        "
                    />
                </Link>
            </div>

            {/* ======================================
                PROBLEMS GRID
            ====================================== */}

            <div
                className="
                    relative
                    mt-9

                    grid
                    min-w-0

                    gap-5

                    md:grid-cols-2
                    xl:grid-cols-3
                "
            >
                {/* LOADING */}

                {isLoading ? (
                    <>
                        <span
                            className="sr-only"
                            role="status"
                        >
                            Qaynoq muammolar yuklanmoqda
                        </span>

                        {Array.from({
                            length: SKELETON_COUNT,
                        }).map((_, index) => (
                            <TrendingProblemSkeleton
                                key={`trending-skeleton-${index}`}
                            />
                        ))}
                    </>
                ) : (
                    <>
                        {/* ERROR */}

                        {error && (
                            <TrendingProblemError
                                error={error}
                                onRetry={onRetry}
                            />
                        )}

                        {/* EXISTING PROBLEM CARDS */}

                        {hasProblems ? (
                            safeProblems.map((problem, index) => (
                                <PopularProbelmCard
                                    key={
                                        problem?.id ??
                                        `popular-${index}`
                                    }
                                    id={problem?.id}
                                    user={problem?.user}
                                    problem={problem?.problem}
                                    description={problem?.description}
                                    star={problem?.total_stars}
                                    response={problem?.total_responses}
                                    views={problem?.total_views}
                                    language={
                                        problem?.language ||
                                        problem?.languages ||
                                        []
                                    }
                                    technology={
                                        problem?.technology ||
                                        problem?.technologies ||
                                        []
                                    }
                                    status={problem?.status}
                                    createdAt={problem?.created_at}
                                />
                            ))
                        ) : !error ? (
                            /* EMPTY STATE */

                            <TrendingProblemsEmpty />
                        ) : null}
                    </>
                )}
            </div>
        </section>
    );
};

export default memo(HomeTrendingProblems);
