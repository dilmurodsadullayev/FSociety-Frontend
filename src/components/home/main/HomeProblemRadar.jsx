
import React, { memo } from "react";

import { Link } from "react-router-dom";

import {
    AlertTriangle,
    ArrowRight,
    Bug,
    Code2,
    Eye,
    MessageCircle,
    RefreshCw,
    Star,
} from "lucide-react";

import formatCompactNumber
    from "../../../utils/formatCompactNumber";

import homeStyles from "./homeStyles";

// =========================================================
// HELPERS
// =========================================================

const getProblemTitle = (problem) =>
    problem?.problem ||
    problem?.title ||
    "Nomsiz muammo";

const getProblemDescription = (problem) =>
    problem?.description ||
    "Muammo tafsilotlarini ko‘rish uchun oching.";

// =========================================================
// PROBLEM RADAR ITEM
// =========================================================

const RadarProblemItem = memo(
    function RadarProblemItem({
        problem,
        index = 0,
    }) {
        const problemId = problem?.id;

        const title =
            getProblemTitle(problem);

        const description =
            getProblemDescription(problem);

        const content = (
            <div
                className="
                    group/radar
                    relative

                    min-w-0
                    overflow-hidden

                    rounded-2xl

                    border
                    border-[#dfe6f1]

                    bg-[#f8faff]

                    p-3.5

                    transition-colors
                    duration-150

                    hover:border-cyan-400/40
                    hover:bg-cyan-50/70

                    dark:border-white/[0.08]
                    dark:bg-white/[0.025]

                    dark:hover:border-cyan-400/25
                    dark:hover:bg-cyan-400/[0.05]
                "
            >
                {/* LEFT ACCENT */}

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute
                        bottom-0
                        left-0
                        top-0

                        w-[2px]

                        bg-gradient-to-b
                        from-cyan-500/70
                        via-indigo-500/30
                        to-transparent

                        opacity-0
                        transition-opacity
                        duration-150

                        group-hover/radar:opacity-100
                    "
                />

                <div className="flex min-w-0 items-start gap-3">
                    {/* POSITION */}

                    <span
                        className="
                            mt-0.5

                            grid
                            h-8
                            w-8

                            shrink-0

                            place-items-center

                            rounded-xl

                            border
                            border-cyan-400/20

                            bg-cyan-500/[0.07]

                            font-mono
                            text-[10px]
                            font-black

                            text-cyan-700

                            dark:bg-cyan-400/[0.06]
                            dark:text-cyan-300
                        "
                    >
                        {String(index + 1).padStart(
                            2,
                            "0"
                        )}
                    </span>

                    {/* BODY */}

                    <div className="min-w-0 flex-1">
                        <h4
                            title={title}
                            className="
                                truncate

                                text-[13px]
                                font-bold

                                text-slate-800

                                transition-colors
                                duration-150

                                group-hover/radar:text-indigo-700

                                dark:text-slate-100
                                dark:group-hover/radar:text-white
                            "
                        >
                            {title}
                        </h4>

                        <p
                            title={description}
                            className="
                                mt-1

                                truncate

                                text-[11px]
                                leading-5

                                text-slate-500

                                dark:text-slate-400
                            "
                        >
                            {description}
                        </p>

                        {/* STATS */}

                        <div
                            className="
                                mt-2.5

                                flex
                                flex-wrap

                                items-center

                                gap-x-3
                                gap-y-1

                                text-[10px]
                                font-semibold

                                text-slate-600

                                dark:text-slate-400
                            "
                        >
                            {/* STARS */}

                            <span className="inline-flex items-center gap-1">
                                <Star
                                    size={12}
                                    strokeWidth={2}
                                    aria-hidden="true"
                                    className="
                                        text-amber-600
                                        dark:text-amber-400
                                    "
                                />

                                {formatCompactNumber(
                                    problem?.total_stars
                                )}
                            </span>

                            {/* RESPONSES */}

                            <span className="inline-flex items-center gap-1">
                                <MessageCircle
                                    size={12}
                                    strokeWidth={2}
                                    aria-hidden="true"
                                    className="
                                        text-indigo-600
                                        dark:text-indigo-400
                                    "
                                />

                                {formatCompactNumber(
                                    problem?.total_responses
                                )}
                            </span>

                            {/* VIEWS */}

                            <span className="inline-flex items-center gap-1">
                                <Eye
                                    size={12}
                                    strokeWidth={2}
                                    aria-hidden="true"
                                    className="
                                        text-cyan-700
                                        dark:text-cyan-400
                                    "
                                />

                                {formatCompactNumber(
                                    problem?.total_views
                                )}
                            </span>
                        </div>
                    </div>

                    {/* ARROW */}

                    <ArrowRight
                        size={15}
                        strokeWidth={2}
                        aria-hidden="true"
                        className="
                            mt-1
                            shrink-0

                            text-slate-400

                            transition-transform
                            duration-150

                            group-hover/radar:translate-x-0.5

                            dark:text-slate-500
                        "
                    />
                </div>
            </div>
        );

        if (
            problemId === null ||
            problemId === undefined
        ) {
            return content;
        }

        return (
            <Link
                to={`/problem/${problemId}/detail`}
                aria-label={`${title} muammosini ko‘rish`}
                className="
                    block
                    rounded-2xl

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-indigo-500
                "
            >
                {content}
            </Link>
        );
    }
);

// =========================================================
// RADAR SKELETON
// =========================================================

const RadarSkeleton = memo(
    function RadarSkeleton() {
        return (
            <div
                role="status"
                aria-label="Trenddagi muammolar yuklanmoqda"
                className="
                    space-y-2.5

                    animate-pulse
                    motion-reduce:animate-none
                "
            >
                <span className="sr-only">
                    Trenddagi muammolar yuklanmoqda.
                </span>

                {[0, 1, 2].map((index) => (
                    <div
                        key={index}
                        aria-hidden="true"
                        className="
                            rounded-2xl

                            border
                            border-[#e1e7f0]

                            bg-[#f8faff]

                            p-3.5

                            dark:border-white/[0.07]
                            dark:bg-white/[0.025]
                        "
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="
                                    h-8
                                    w-8

                                    shrink-0

                                    rounded-xl

                                    bg-slate-200

                                    dark:bg-white/[0.08]
                                "
                            />

                            <div className="min-w-0 flex-1">
                                <div
                                    className="
                                        h-3.5
                                        w-3/4

                                        rounded-full

                                        bg-slate-200

                                        dark:bg-white/[0.08]
                                    "
                                />

                                <div
                                    className="
                                        mt-2
                                        h-2.5
                                        w-1/2

                                        rounded-full

                                        bg-slate-100

                                        dark:bg-white/[0.05]
                                    "
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
);

// =========================================================
// RADAR ERROR
// =========================================================

const RadarError = memo(
    function RadarError({
        message,
        onRetry,
        hasData = false,
    }) {
        const errorMessage =
            typeof message === "string"
                ? message
                : "Muammolarni yuklashda xatolik yuz berdi.";

        return (
            <div
                role="alert"
                className={`
                    rounded-2xl

                    border
                    border-rose-200

                    bg-rose-50/90

                    px-4
                    py-4

                    dark:border-rose-400/20
                    dark:bg-rose-400/[0.07]

                    ${hasData ? "mb-3" : ""}
                `}
            >
                <div className="flex items-start gap-2.5">
                    <AlertTriangle
                        size={16}
                        aria-hidden="true"
                        className="
                            mt-0.5
                            shrink-0

                            text-rose-700
                            dark:text-rose-300
                        "
                    />

                    <p
                        className="
                            min-w-0
                            flex-1

                            break-words

                            text-xs
                            leading-6

                            text-rose-800
                            dark:text-rose-200
                        "
                    >
                        {errorMessage}
                    </p>
                </div>

                {typeof onRetry === "function" && (
                    <button
                        type="button"
                        onClick={onRetry}
                        className="
                            mt-3

                            inline-flex
                            min-h-9

                            items-center
                            gap-2

                            rounded-xl

                            border
                            border-rose-300

                            bg-white

                            px-3

                            text-xs
                            font-bold

                            text-rose-800

                            hover:bg-rose-100

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-rose-500

                            dark:border-rose-400/25
                            dark:bg-rose-400/[0.08]
                            dark:text-rose-300
                        "
                    >
                        <RefreshCw
                            size={14}
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
// MAIN RADAR
// =========================================================

const HomeProblemRadar = ({
    problems = [],
    isLoading = false,
    error = null,
    onRetry,
}) => {
    const safeProblems = Array.isArray(problems)
        ? problems.slice(0, 3)
        : [];

    const hasProblems =
        safeProblems.length > 0;

    const hasError =
        Boolean(error);

    return (
        <section
            aria-label="Trenddagi muammolar"
            aria-busy={isLoading}
            className="relative min-w-0"
        >
            {/* BACKGROUND GLOW */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none

                    absolute
                    -inset-10

                    hidden
                    rounded-full

                    bg-cyan-500/[0.035]
                    blur-3xl

                    sm:block
                "
            />

            {/* RADAR PANEL */}

            <div
                className="
                    relative
                    min-w-0

                    overflow-hidden

                    rounded-[26px]

                    border
                    border-[#dce5f1]

                    bg-white/95

                    p-3

                    shadow-[0_15px_45px_rgba(30,41,59,0.08)]

                    backdrop-blur-sm

                    dark:border-white/[0.09]
                    dark:bg-[#0b1018]/95

                    dark:shadow-[0_30px_90px_rgba(0,0,0,0.30)]
                "
            >
                {/* HEADER */}

                <div
                    className={`
                        flex
                        items-center
                        justify-between
                        gap-3

                        border-b

                        px-2
                        pb-3

                        ${homeStyles.divider}
                    `}
                >
                    <div className="flex min-w-0 items-center gap-3">
                        <div
                            className="
                                grid
                                h-9
                                w-9

                                shrink-0

                                place-items-center

                                rounded-xl

                                border
                                border-cyan-400/20

                                bg-cyan-400/[0.06]

                                text-cyan-700

                                dark:text-cyan-300
                            "
                        >
                            <Code2
                                size={17}
                                strokeWidth={2}
                                aria-hidden="true"
                            />
                        </div>

                        <div className="min-w-0">
                            <p
                                className={`
                                    font-mono
                                    text-[9px]
                                    font-black

                                    uppercase
                                    tracking-[0.12em]

                                    ${homeStyles.eyebrow}
                                `}
                            >
                                Problem radar
                            </p>

                            <h3
                                className="
                                    mt-0.5
                                    truncate

                                    text-sm
                                    font-black

                                    text-slate-800

                                    dark:text-slate-100
                                "
                            >
                                Hozir trendda
                            </h3>
                        </div>
                    </div>

                    <span
                        className="
                            inline-flex
                            shrink-0

                            items-center
                            gap-1.5

                            rounded-full

                            border
                            border-emerald-400/20

                            bg-emerald-400/[0.06]

                            px-2.5
                            py-1

                            font-mono
                            text-[9px]
                            font-bold

                            uppercase

                            text-emerald-700

                            dark:text-emerald-300
                        "
                    >
                        <span
                            aria-hidden="true"
                            className="
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-emerald-500
                            "
                        />

                        Top 3
                    </span>
                </div>

                {/* BODY */}

                <div className="mt-3">
                    {isLoading ? (
                        <RadarSkeleton />
                    ) : (
                        <>
                            {hasError && (
                                <RadarError
                                    message={error}
                                    onRetry={onRetry}
                                    hasData={hasProblems}
                                />
                            )}

                            {hasProblems ? (
                                <div className="space-y-2.5">
                                    {safeProblems.map(
                                        (problem, index) => (
                                            <RadarProblemItem
                                                key={
                                                    problem?.id ??
                                                    `radar-${index}`
                                                }
                                                problem={problem}
                                                index={index}
                                            />
                                        )
                                    )}
                                </div>
                            ) : !hasError ? (
                                <div
                                    className="
                                        rounded-2xl

                                        border
                                        border-dashed
                                        border-[#dce4ef]

                                        bg-[#f8faff]

                                        px-5
                                        py-9

                                        text-center

                                        dark:border-white/[0.09]
                                        dark:bg-white/[0.025]
                                    "
                                >
                                    <Bug
                                        size={22}
                                        strokeWidth={1.8}
                                        aria-hidden="true"
                                        className="
                                            mx-auto
                                            text-slate-400
                                            dark:text-slate-500
                                        "
                                    />

                                    <p
                                        className="
                                            mt-3

                                            text-xs
                                            font-bold

                                            text-slate-600
                                            dark:text-slate-400
                                        "
                                    >
                                        Hozircha trenddagi muammo yo‘q
                                    </p>
                                </div>
                            ) : null}
                        </>
                    )}
                </div>

                {/* FOOTER */}

                <div
                    className={`
                        mt-3

                        flex
                        items-center
                        justify-between

                        gap-3

                        border-t

                        px-2
                        pt-3

                        ${homeStyles.divider}
                    `}
                >
                    <span
                        className="
                            hidden

                            font-mono
                            text-[9px]

                            uppercase
                            tracking-[0.08em]

                            text-slate-500

                            sm:block

                            dark:text-slate-400
                        "
                    >
                        signal://community_activity
                    </span>

                    <Link
                        to="/problems"
                        className="
                            group/radar-link

                            ml-auto

                            inline-flex
                            min-h-8

                            items-center
                            gap-1.5

                            text-xs
                            font-bold

                            text-cyan-700

                            hover:text-indigo-700

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-indigo-500

                            dark:text-cyan-300
                            dark:hover:text-cyan-200
                        "
                    >
                        Barchasi

                        <ArrowRight
                            size={14}
                            strokeWidth={2}
                            aria-hidden="true"
                            className="
                                transition-transform

                                group-hover/radar-link:translate-x-0.5
                            "
                        />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default memo(HomeProblemRadar);
