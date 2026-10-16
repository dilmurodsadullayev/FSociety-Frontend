
import React, { memo } from "react";

import { Link } from "react-router-dom";

import {
    ArrowRight,
    CheckCircle2,
    Clock3,
    Coins,
    Eye,
    Flame,
    MessageCircle,
    XCircle,
} from "lucide-react";

import timeAgo from "../../utils/timeAgo";

import {
    getSimilarProblemTitle,
    getSimilarProblemLanguages,
    getSimilarLanguageName,
    getSimilarProblemStatus,
    getSimilarResponseCount,
    getSimilarViewCount,
    getSimilarOfferedCoins,
    getSimilarProblemDate,
    getSimilarProblemUrl,
    isSimilarProblemUrgent,
} from "./similarProblemsHelpers";

// =========================================================
// FSOCIETY — SIMILAR PROBLEM CARD
//
// One related problem.
//
// Preserved:
// - Title
// - Detail navigation
// - Status
// - Urgent badge
// - Language badges (+N)
// - FCoin bounty
// - Response count
// - View count
// - Created date
//
// Improved:
// - Correct detail route
// - Rejected status
// - Safe field access
// - Light/Dark Mode
// - Focus and hover states
// =========================================================

// =========================================================
// STATUS BADGE
// =========================================================

const SimilarStatusBadge = memo(({
    status = "pending",
}) => {
    if (status === "solved") {
        return (
            <span
                className="
                    inline-flex
                    min-h-6
                    items-center
                    gap-1
                    rounded-full
                    border
                    border-emerald-200
                    bg-emerald-50
                    px-2
                    py-1
                    text-[10px]
                    font-black
                    text-emerald-800

                    dark:border-emerald-400/20
                    dark:bg-emerald-400/[0.08]
                    dark:text-emerald-300
                "
            >
                <CheckCircle2
                    size={12}
                    aria-hidden="true"
                />

                Yechilgan
            </span>
        );
    }

    if (status === "rejected") {
        return (
            <span
                className="
                    inline-flex
                    min-h-6
                    items-center
                    gap-1
                    rounded-full
                    border
                    border-rose-200
                    bg-rose-50
                    px-2
                    py-1
                    text-[10px]
                    font-black
                    text-rose-800

                    dark:border-rose-400/20
                    dark:bg-rose-400/[0.08]
                    dark:text-rose-300
                "
            >
                <XCircle
                    size={12}
                    aria-hidden="true"
                />

                Rad etilgan
            </span>
        );
    }

    return (
        <span
            className="
                inline-flex
                min-h-6
                items-center
                gap-1.5
                rounded-full
                border
                border-amber-200
                bg-amber-50
                px-2
                py-1
                text-[10px]
                font-black
                text-amber-800

                dark:border-amber-400/20
                dark:bg-amber-400/[0.08]
                dark:text-amber-300
            "
        >
            <span
                aria-hidden="true"
                className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-amber-500
                "
            />

            Ochiq
        </span>
    );
});

// =========================================================
// LANGUAGE BADGE
// =========================================================

const SimilarLanguageBadge = memo(({
    language,
}) => {
    const name = getSimilarLanguageName(
        language
    );

    if (!name) {
        return null;
    }

    return (
        <span
            title={name}
            className="
                inline-flex
                min-h-6
                max-w-[135px]
                items-center
                rounded-full
                border
                border-indigo-200
                bg-indigo-50
                px-2
                py-1
                text-[10px]
                font-bold
                text-indigo-800

                dark:border-indigo-400/20
                dark:bg-indigo-400/[0.07]
                dark:text-indigo-300
            "
        >
            <span className="truncate">
                {name}
            </span>
        </span>
    );
});

// =========================================================
// PROBLEM BADGES
// =========================================================

const SimilarProblemBadges = memo(({
    status,
    isUrgent,
    languages,
}) => {
    const visibleLanguages = languages.slice(0, 2);

    const remainingLanguages = Math.max(
        0,
        languages.length - 2
    );

    return (
        <div
            className="
                mt-3
                flex
                min-w-0
                flex-wrap
                items-center
                gap-1.5
            "
        >
            <SimilarStatusBadge status={status} />

            {isUrgent && (
                <span
                    className="
                        inline-flex
                        min-h-6
                        items-center
                        gap-1
                        rounded-full
                        border
                        border-orange-200
                        bg-orange-50
                        px-2
                        py-1
                        text-[10px]
                        font-black
                        text-orange-800

                        dark:border-orange-400/20
                        dark:bg-orange-400/[0.08]
                        dark:text-orange-300
                    "
                >
                    <Flame
                        size={12}
                        aria-hidden="true"
                    />

                    Tezkor
                </span>
            )}

            {visibleLanguages.map((language, index) => (
                <SimilarLanguageBadge
                    key={
                        language?.id ??
                        `${getSimilarLanguageName(language)}-${index}`
                    }
                    language={language}
                />
            ))}

            {remainingLanguages > 0 && (
                <span
                    title={`Yana ${remainingLanguages} ta til`}
                    className="
                        inline-flex
                        min-h-6
                        items-center
                        rounded-full
                        border
                        border-slate-200
                        bg-slate-50
                        px-2
                        py-1
                        font-mono
                        text-[10px]
                        font-bold
                        text-slate-600

                        dark:border-white/[0.09]
                        dark:bg-white/[0.04]
                        dark:text-gray-400
                    "
                >
                    +{remainingLanguages}
                </span>
            )}
        </div>
    );
});

// =========================================================
// METADATA
// =========================================================

const SimilarProblemMetadata = memo(({
    offeredCoins,
    responseCount,
    viewCount,
    createdAt,
}) => {
    let timeLabel = "";

    if (createdAt) {
        try {
            timeLabel = timeAgo(createdAt) || "";
        } catch {
            timeLabel = "";
        }
    }

    const hasMetadata =
        offeredCoins > 0 ||
        responseCount > 0 ||
        viewCount > 0 ||
        Boolean(timeLabel);

    if (!hasMetadata) {
        return null;
    }

    return (
        <div
            className="
                mt-3.5
                flex
                flex-wrap
                items-center
                gap-x-3
                gap-y-2
                text-[10px]
                font-bold
                text-slate-500

                dark:text-gray-400
            "
        >
            {/* FCOIN */}

            {offeredCoins > 0 && (
                <span
                    title="Taklif qilingan mukofot"
                    className="
                        inline-flex
                        items-center
                        gap-1
                        text-amber-700

                        dark:text-amber-300
                    "
                >
                    <Coins
                        size={13}
                        aria-hidden="true"
                    />

                    {offeredCoins.toLocaleString("uz-UZ")} FCoin
                </span>
            )}

            {/* RESPONSES */}

            {responseCount > 0 && (
                <span
                    title="Yechimlar soni"
                    className="
                        inline-flex
                        items-center
                        gap-1
                    "
                >
                    <MessageCircle
                        size={13}
                        aria-hidden="true"
                    />

                    {responseCount.toLocaleString("uz-UZ")}
                </span>
            )}

            {/* VIEWS */}

            {viewCount > 0 && (
                <span
                    title="Ko‘rishlar soni"
                    className="
                        inline-flex
                        items-center
                        gap-1
                    "
                >
                    <Eye
                        size={13}
                        aria-hidden="true"
                    />

                    {viewCount.toLocaleString("uz-UZ")}
                </span>
            )}

            {/* TIME */}

            {timeLabel && (
                <span
                    title={createdAt}
                    className="
                        inline-flex
                        items-center
                        gap-1
                    "
                >
                    <Clock3
                        size={13}
                        aria-hidden="true"
                    />

                    {timeLabel}
                </span>
            )}
        </div>
    );
});

// =========================================================
// MAIN CARD
// =========================================================

const SimilarProblemCard = ({
    problem,
    index = 0,
    isLast = false,
}) => {
    if (
        !problem ||
        problem.id === null ||
        problem.id === undefined
    ) {
        return null;
    }

    // =====================================================
    // DATA
    // =====================================================

    const title = getSimilarProblemTitle(
        problem
    );

    const languages =
        getSimilarProblemLanguages(problem);

    const status =
        getSimilarProblemStatus(problem);

    const isUrgent =
        isSimilarProblemUrgent(problem);

    const responseCount =
        getSimilarResponseCount(problem);

    const viewCount =
        getSimilarViewCount(problem);

    const offeredCoins =
        getSimilarOfferedCoins(problem);

    const createdAt =
        getSimilarProblemDate(problem);

    const detailUrl =
        getSimilarProblemUrl(problem.id);

    // =====================================================
    // JSX
    // =====================================================

    return (
        <article
            className="
                group
                relative
                min-w-0
            "
        >
            <Link
                to={detailUrl}
                aria-label={`${title} muammosini ochish`}
                className="
                    relative
                    flex
                    min-w-0
                    items-start
                    gap-3

                    rounded-xl
                    px-2
                    py-5

                    transition-colors
                    duration-200

                    hover:bg-slate-50

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-indigo-500

                    dark:hover:bg-white/[0.035]

                    motion-reduce:transition-none
                "
            >
                {/* ==================================
                    NUMBER
                ================================== */}

                <div
                    aria-hidden="true"
                    className="
                        mt-0.5
                        grid
                        h-9
                        w-9
                        shrink-0
                        place-items-center
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        font-mono
                        text-[11px]
                        font-black
                        text-slate-500

                        transition-colors

                        group-hover:border-indigo-300
                        group-hover:bg-indigo-50
                        group-hover:text-indigo-700

                        dark:border-white/[0.09]
                        dark:bg-white/[0.035]
                        dark:text-gray-400

                        dark:group-hover:border-indigo-400/25
                        dark:group-hover:bg-indigo-400/[0.09]
                        dark:group-hover:text-indigo-300
                    "
                >
                    {String(index + 1).padStart(
                        2,
                        "0"
                    )}
                </div>

                {/* ==================================
                    CONTENT
                ================================== */}

                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >
                    {/* TITLE */}

                    <div
                        className="
                            flex
                            min-w-0
                            items-start
                            justify-between
                            gap-2
                        "
                    >
                        <h4
                            className="
                                min-w-0
                                flex-1

                                line-clamp-2

                                text-[13px]
                                font-black
                                leading-6

                                text-slate-800

                                transition-colors

                                group-hover:text-indigo-700

                                dark:text-gray-200
                                dark:group-hover:text-white
                            "
                        >
                            {title}
                        </h4>

                        <ArrowRight
                            size={15}
                            aria-hidden="true"
                            className="
                                mt-1
                                shrink-0

                                -translate-x-1

                                text-slate-400

                                opacity-0

                                transition-all
                                duration-200

                                group-hover:translate-x-0
                                group-hover:text-indigo-600
                                group-hover:opacity-100

                                group-focus-within:translate-x-0
                                group-focus-within:opacity-100

                                dark:text-gray-500
                                dark:group-hover:text-indigo-300

                                motion-reduce:transform-none
                                motion-reduce:transition-none
                            "
                        />
                    </div>

                    {/* BADGES */}

                    <SimilarProblemBadges
                        status={status}
                        isUrgent={isUrgent}
                        languages={languages}
                    />

                    {/* METADATA */}

                    <SimilarProblemMetadata
                        offeredCoins={offeredCoins}
                        responseCount={responseCount}
                        viewCount={viewCount}
                        createdAt={createdAt}
                    />
                </div>
            </Link>

            {/* ======================================
                DIVIDER
            ====================================== */}

            {!isLast && (
                <div
                    aria-hidden="true"
                    className="
                        ml-11
                        h-px
                        bg-gradient-to-r
                        from-slate-200
                        via-slate-200/70
                        to-transparent

                        dark:from-white/[0.09]
                        dark:via-white/[0.04]
                    "
                />
            )}
        </article>
    );
};

export default memo(SimilarProblemCard);
