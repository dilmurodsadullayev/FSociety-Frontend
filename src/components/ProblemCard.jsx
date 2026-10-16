
import React, { memo } from "react";
import { Link } from "react-router-dom";

import {
    Bug,
} from "lucide-react";

import { limitText } from "../utils/limitText";

// =========================================================
// PROBLEM CARD COMPONENTS
// =========================================================

import ProblemCardHeader from "./problem-card/ProblemCardHeader";

import ProblemCardPriority from "./problem-card/ProblemCardPriority";

import ProblemCardStack from "./problem-card/ProblemCardStack";

import ProblemCardFooter from "./problem-card/ProblemCardFooter";

// =========================================================
// CONFIG & HELPERS
// =========================================================

import {
    PROBLEM_CARD_LIMITS,
    PROBLEM_CARD_STYLES,
    getProblemCardStatusConfig,
} from "./problem-card/problemCardConfig";

import {
    normalizeProblemCardData,
} from "./problem-card/problemCardHelpers";

// =========================================================
// FSOCIETY — PROBLEM CARD
//
// Responsibilities:
// - Normalize incoming problem data
// - Build the card layout
// - Connect modular components
// - Handle navigation
// - Apply status-aware decoration
//
// Supported interfaces:
//
// <ProblemCard problem={problem} />
//
// <ProblemCard
//     id={1}
//     name="Example"
//     username="developer"
// />
//
// No Redux.
// No direct API requests.
// =========================================================

// =========================================================
// PROBLEM TICKET LABEL
// =========================================================

const ProblemTicketLabel = memo(({
    id = null,
}) => {
    const hasId =
        id !== null &&
        id !== undefined &&
        String(id).trim() !== "";

    return (
        <div
            className="
                mb-3

                flex
                w-full
                min-w-0

                flex-wrap
                items-center
                justify-between
                gap-2
            "
        >
            {/* TICKET TYPE */}

            <span
                className="
                    inline-flex
                    min-h-7

                    items-center
                    justify-center
                    gap-1.5

                    rounded-full
                    border
                    border-cyan-300/60

                    bg-cyan-50

                    px-2.5
                    py-1

                    font-mono
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.06em]

                    text-cyan-800

                    dark:border-cyan-400/20
                    dark:bg-cyan-400/[0.08]
                    dark:text-cyan-300
                "
            >
                <Bug
                    size={13}
                    strokeWidth={1.9}
                    aria-hidden="true"

                    className="shrink-0"
                />

                Problem ticket
            </span>

            {/* TICKET ID */}

            {hasId && (
                <span
                    title={`Muammo ID: ${id}`}

                    className="
                        max-w-[125px]
                        min-w-0

                        truncate

                        font-mono
                        text-[11px]
                        font-bold
                        tabular-nums

                        text-slate-400

                        sm:max-w-[160px]

                        dark:text-gray-500
                    "
                >
                    #{id}
                </span>
            )}
        </div>
    );
});

// =========================================================
// PROBLEM TITLE
// =========================================================

const ProblemCardTitle = memo(({
    title = "Nomsiz muammo",
    hasValidId = false,
}) => {
    const safeTitle =
        typeof title === "string" && title.trim()
            ? title.trim()
            : "Nomsiz muammo";

    return (
        <h3
            title={safeTitle}

            className={`
                mb-4

                min-h-[3rem]
                min-w-0

                break-words
                [overflow-wrap:anywhere]

                font-display
                text-[18px]
                font-black
                leading-[1.45]
                tracking-tight

                text-slate-900

                transition-colors
                duration-200

                sm:text-xl

                dark:text-white

                ${
                    hasValidId
                        ? `
                            group-hover:text-cyan-800

                            dark:group-hover:text-cyan-300
                        `
                        : ""
                }
            `}
        >
            {limitText(
                safeTitle,
                PROBLEM_CARD_LIMITS.titleLength
            )}
        </h3>
    );
});

// =========================================================
// MAIN COMPONENT
// =========================================================

const ProblemCard = ({
    // New contract
    problem = null,

    // ================================================
    // LEGACY PROPS
    //
    // Preserved for other existing usages.
    // ================================================

    id,

    username,
    firstName,
    lastName,
    image,

    name,

    views,

    languages,
    technologies,

    createdAt,

    star,
    responseCount,

    isSolved,
    status,

    isUrgent,
    deadline,
    offeredCoins,
}) => {
    // =====================================================
    // NORMALIZE BACKEND / LEGACY DATA
    // =====================================================

    const data = normalizeProblemCardData(
        problem,
        {
            id,

            username,
            firstName,
            lastName,
            image,

            name,

            views,

            languages,
            technologies,

            createdAt,

            star,
            responseCount,

            isSolved,
            status,

            isUrgent,
            deadline,
            offeredCoins,
        }
    );

    // =====================================================
    // STATUS CONFIGURATION
    // =====================================================

    const statusConfig =
        getProblemCardStatusConfig(
            data.status,
            data.solved
        );

    // =====================================================
    // NAVIGATION
    //
    // Keep the original detail URL contract.
    //
    // Valid ID:
    // /problem/:id/detail
    //
    // Missing ID:
    // Render a non-interactive div.
    // =====================================================

    const hasValidId =
        Boolean(data.hasValidId);

    const CardRoot = hasValidId
        ? Link
        : "div";

    const cardRootProps = hasValidId
        ? {
            to: data.detailPath,

            "aria-label":
                `${data.title} muammosi tafsilotlarini ko‘rish`,
        }
        : {};

    // =====================================================
    // CARD CLASSES
    // =====================================================

    const cardClassName = `
        ${PROBLEM_CARD_STYLES.outer}

        min-h-[380px]

        ${
            hasValidId
                ? "cursor-pointer"
                : `
                    cursor-default
                    opacity-90

                    hover:translate-y-0
                `
        }
    `;

    // =====================================================
    // JSX
    // =====================================================

    return (
        <article
            className="
                h-full
                w-full
                min-w-0

                animate-fade-in-up
                motion-reduce:animate-none
            "
        >
            {/* ======================================
                CARD ROOT
            ====================================== */}

            <CardRoot
                {...cardRootProps}

                className={cardClassName}
            >
                {/* ==================================
                    BACKGROUND ACCENTS
                ================================== */}

                <div
                    aria-hidden="true"

                    className="
                        pointer-events-none

                        absolute
                        -left-24
                        -top-24

                        h-52
                        w-52

                        rounded-full

                        bg-cyan-500/[0.035]

                        blur-3xl

                        transition-colors
                        duration-300

                        group-hover:bg-cyan-500/[0.07]

                        dark:bg-cyan-400/[0.045]
                        dark:group-hover:bg-cyan-400/[0.09]
                    "
                />

                <div
                    aria-hidden="true"

                    className="
                        pointer-events-none

                        absolute
                        -bottom-24
                        -right-24

                        h-52
                        w-52

                        rounded-full

                        bg-indigo-500/[0.035]

                        blur-3xl

                        transition-colors
                        duration-300

                        group-hover:bg-indigo-500/[0.07]

                        dark:bg-indigo-400/[0.045]
                        dark:group-hover:bg-indigo-400/[0.08]
                    "
                />

                {/* ==================================
                    STATUS ACCENT LINE
                ================================== */}

                <div
                    aria-hidden="true"

                    className={`
                        pointer-events-none

                        absolute
                        inset-x-0
                        top-0

                        h-[2px]

                        bg-gradient-to-r

                        ${statusConfig.line}
                    `}
                />

                {/* ==================================
                    CARD CONTENT
                ================================== */}

                <div
                    className={`
                        ${PROBLEM_CARD_STYLES.body}

                        z-10
                    `}
                >
                    {/* ==========================
                        AUTHOR + STATUS
                    ========================== */}

                    <ProblemCardHeader
                        author={data.author}

                        status={data.status}
                        isSolved={data.solved}

                        statusConfig={statusConfig}
                    />

                    {/* ==========================
                        TICKET LABEL / ID
                    ========================== */}

                    <ProblemTicketLabel
                        id={data.id}
                    />

                    {/* ==========================
                        TITLE
                    ========================== */}

                    <ProblemCardTitle
                        title={data.title}

                        hasValidId={hasValidId}
                    />

                    {/* ==========================
                        URGENT / FCOIN / DEADLINE
                    ========================== */}

                    <ProblemCardPriority
                        priority={data.priority}
                    />

                    {/* ==========================
                        LANGUAGES / TECHNOLOGIES
                    ========================== */}

                    <ProblemCardStack
                        languages={data.languages}

                        technologies={
                            data.technologies
                        }
                    />

                    {/* ==========================
                        FOOTER SPACING
                    ========================== */}

                    <div
                        aria-hidden="true"
                        className="
                            min-h-3
                            flex-1
                        "
                    />

                    {/* ==========================
                        STATS / CTA
                    ========================== */}

                    <ProblemCardFooter
                        stats={data.stats}

                        ctaText={data.ctaText}

                        hasValidId={hasValidId}

                        status={data.status}
                        isSolved={data.solved}

                        statusConfig={statusConfig}
                    />
                </div>
            </CardRoot>
        </article>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProblemCard);
