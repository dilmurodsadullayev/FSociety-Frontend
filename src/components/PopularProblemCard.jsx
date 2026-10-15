
import React, { useMemo } from "react";

import ProblemCardHeader from "./popular-problem/ProblemCardHeader";
import ProblemCardAuthor from "./popular-problem/ProblemCardAuthor";
import ProblemCardBody from "./popular-problem/ProblemCardBody";
import ProblemCardFooter from "./popular-problem/ProblemCardFooter";

import {
    getProblemTags,
    isProblemSolved,
} from "./popular-problem/problemCardUtils";

// =========================================================
// FSOCIETY — COMPACT POPULAR PROBLEM CARD
//
// Design:
// - Wider, shorter cards
// - Responsive layout
// - Dark / Light Mode
// - No forced minimum height
//
// Existing props and routes remain compatible.
// =========================================================

const PopularProblemCard = ({
    id,
    problem,
    description,

    star = 0,
    response = 0,
    views = 0,

    user,

    language,
    technology,

    status,
    isSolved = false,

    createdAt,
    created_at,
}) => {
    // =====================================================
    // PREPARE DATA
    // =====================================================

    const solved = isProblemSolved(
        status,
        isSolved
    );

    const problemDate =
        createdAt ||
        created_at ||
        null;

    const tags = useMemo(
        () => getProblemTags(language, technology),
        [language, technology]
    );

    const hasId =
        id !== null &&
        id !== undefined &&
        id !== "";

    const detailUrl = hasId
        ? `/problem/${id}/detail`
        : "/problems";

    // =====================================================
    // JSX
    // =====================================================

    return (
        <article
            className="
                group/card
                relative
                flex
                h-full
                min-w-0
                flex-col
                overflow-hidden
                rounded-[22px]
                border
                border-[#dce4ef]
                bg-white
                shadow-[0_10px_35px_rgba(30,41,59,0.05)]
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:border-cyan-400/35
                hover:shadow-[0_16px_40px_rgba(30,41,59,0.10)]
                dark:border-white/[0.065]
                dark:bg-[#0a0f19]
                dark:shadow-none
                dark:hover:border-cyan-400/20
                dark:hover:bg-[#0b111c]
                dark:hover:shadow-[0_16px_45px_rgba(0,0,0,0.20)]
                motion-reduce:transform-none
            "
        >
            {/* TOP ACCENT */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-x-0
                    top-0
                    h-px
                    bg-gradient-to-r
                    from-cyan-500/60
                    via-indigo-500/25
                    to-transparent
                    dark:from-cyan-400/60
                    dark:via-indigo-400/25
                "
            />

            {/* BACKGROUND ACCENT */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    -right-12
                    -top-12
                    h-28
                    w-28
                    rounded-full
                    bg-gradient-to-bl
                    from-indigo-500/[0.04]
                    to-transparent
                    dark:from-indigo-500/[0.05]
                "
            />

            {/* PROBLEM STATUS */}

            <ProblemCardHeader
                id={id}
                status={status}
                solved={solved}
                date={problemDate}
            />

            {/* PROBLEM CONTENT */}

            <ProblemCardBody
                problem={problem}
                description={description}
                tags={tags}
                detailUrl={detailUrl}
            />

            {/* BOTTOM AREA */}

            <div className="mt-auto min-w-0">

                {/* AUTHOR */}

                <ProblemCardAuthor
                    user={user}
                />

                {/* STATISTICS */}

                <ProblemCardFooter
                    views={views}
                    response={response}
                    star={star}
                    detailUrl={detailUrl}
                />

            </div>
        </article>
    );
};

export default React.memo(PopularProblemCard);
