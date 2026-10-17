// src/components/fcoin-history/FCoinHistoryItem.jsx

import React, { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";

import {
    ArrowDownRight,
    ArrowLeftRight,
    ArrowUpRight,
    Bug,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Coins,
    Crown,
    Gift,
    Lightbulb,
    MessageCircle,
    MessageSquareText,
    Rocket,
    RotateCcw,
    Route,
    ShieldCheck,
    Sparkles,
    Star,
    TerminalSquare,
    WalletCards,
} from "lucide-react";

import FCoinIcon from "../../assests/coin/fcoin.png";
import formatPrettyDate from "../../utils/formatPrettyDate";
import timeAgo from "../../utils/timeAgo";

import {
    formatCoinDate,
    formatFullCoinNumber,
    getCoinAmountBadgeClass,
    getCoinDescription,
    getCoinDirection,
    getCoinDisplayAmount,
    getCoinSource,
    getCoinStatusLabel,
    getCoinTargetTitle,
    getCoinTitle,
    getCoinVisual,
} from "./coinHistoryHelpers";

// =========================================================
// SOURCE ICONS — 23 transaction sources
// =========================================================

const SOURCE_ICONS = Object.freeze({
    problem_upload: TerminalSquare,
    problem_response: MessageSquareText,
    problem_response_star: Star,
    best_solution: Crown,
    problem_bounty: Coins,
    problem_bounty_reserve: Coins,
    problem_bounty_refund: RotateCcw,
    problem_bounty_payout: Gift,

    project_upload: Rocket,
    project_star_giver: Star,
    project_star_owner: Star,

    post_upload: MessageSquareText,
    post_comment: MessageCircle,
    comment_admin_like: ShieldCheck,

    roadmap_like: Route,

    feedback_approved: CheckCircle2,
    feedback_bug: Bug,
    feedback_suggestion: Lightbulb,
    feedback_praise: Sparkles,
    feedback_other: MessageSquareText,

    daily_login: CalendarDays,
    promotion_purchase: Rocket,
    admin_coin_grant: Gift,
});

// =========================================================
// LIGHT / DARK SOURCE TONES
// =========================================================

const LIGHT_TONE_TEXT = Object.freeze({
    indigo: "!text-indigo-700 dark:!text-indigo-300",
    cyan: "!text-cyan-700 dark:!text-cyan-300",
    yellow: "!text-yellow-700 dark:!text-yellow-300",
    emerald: "!text-emerald-700 dark:!text-emerald-300",
    orange: "!text-orange-700 dark:!text-orange-300",
    blue: "!text-blue-700 dark:!text-blue-300",
    purple: "!text-purple-700 dark:!text-purple-300",
    sky: "!text-sky-700 dark:!text-sky-300",
    pink: "!text-pink-700 dark:!text-pink-300",
    violet: "!text-violet-700 dark:!text-violet-300",
    red: "!text-red-700 dark:!text-red-300",
    amber: "!text-amber-700 dark:!text-amber-300",
    rose: "!text-rose-700 dark:!text-rose-300",
});

// =========================================================
// TRANSACTION DIRECTION STYLES
// =========================================================

const DIRECTION_STYLES = Object.freeze({
    earned: {
        accent:
            "bg-emerald-500/70 dark:bg-emerald-400/60",

        icon:
            "border-emerald-500/20 bg-emerald-50 " +
            "text-emerald-700 dark:border-emerald-400/15 " +
            "dark:bg-emerald-500/[0.06] dark:text-emerald-300",

        amount:
            "!bg-emerald-50 !text-emerald-700 " +
            "dark:!bg-emerald-500/[0.08] dark:!text-emerald-300",

        label: "Earned",
        Icon: ArrowUpRight,
    },

    spent: {
        accent:
            "bg-rose-500/70 dark:bg-rose-400/60",

        icon:
            "border-rose-500/20 bg-rose-50 text-rose-700 " +
            "dark:border-rose-400/15 dark:bg-rose-500/[0.06] " +
            "dark:text-rose-300",

        amount:
            "!bg-rose-50 !text-rose-700 " +
            "dark:!bg-rose-500/[0.08] dark:!text-rose-300",

        label: "Spent",
        Icon: ArrowDownRight,
    },

    neutral: {
        accent:
            "bg-slate-400/70 dark:bg-slate-500/60",

        icon:
            "border-slate-300 bg-slate-100 text-slate-600 " +
            "dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300",

        amount:
            "!border-slate-300 !bg-slate-100 !text-slate-700 " +
            "dark:!border-slate-600 dark:!bg-slate-800 " +
            "dark:!text-slate-300",

        label: "Neutral",
        Icon: ArrowLeftRight,
    },
});

// =========================================================
// ANIMATION CONFIGURATION
// =========================================================

const ENTER_INITIAL = {
    opacity: 0,
    y: 16,
};

const ENTER_ANIMATE = {
    opacity: 1,
    y: 0,
};

const HOVER_RAISE = {
    y: -2,
};

// =========================================================
// COMPONENT
// =========================================================

const FCoinHistoryItem = ({
    item,
    index = 0,
}) => {
    const reduceMotion = useReducedMotion();

    // Transaction data
    const source = getCoinSource(item);
    const visual = getCoinVisual(item);
    const title = getCoinTitle(item);
    const description = getCoinDescription(item);
    const statusLabel = getCoinStatusLabel(item);
    const targetTitle = getCoinTargetTitle(item);

    // Explicit backend neutral direction takes precedence.
    const backendDirection = String(
        item?.direction ?? ""
    ).toLowerCase();

    const direction =
        backendDirection === "neutral"
            ? "neutral"
            : getCoinDirection(item);

    const directionStyle =
        DIRECTION_STYLES[direction] ||
        DIRECTION_STYLES.neutral;

    const DirectionIcon = directionStyle.Icon;
    const SourceIcon = SOURCE_ICONS[source] || WalletCards;

    // Preserve the backend's full coin display.
    const displayAmount =
        direction === "neutral"
            ? formatFullCoinNumber(
                item?.display_amount ??
                item?.amount ??
                0
            )
            : getCoinDisplayAmount(item);

    const toneText =
        LIGHT_TONE_TEXT[visual.tone] ||
        LIGHT_TONE_TEXT.indigo;

    // Both relative and full transaction dates.
    const rawDate = item?.created_at;

    const validDate =
        Boolean(rawDate) &&
        !Number.isNaN(
            new Date(rawDate).getTime()
        );

    const fullDate = validDate
        ? (
            formatPrettyDate(rawDate) ||
            formatCoinDate(rawDate)
        )
        : "";

    const relativeDate =
        validDate
            ? timeAgo(rawDate)
            : "";

    const isoDate =
        validDate
            ? new Date(rawDate).toISOString()
            : undefined;

    const delay = Math.min(
        Math.max(0, Number(index) || 0) * 0.035,
        0.25
    );

    return (
        <motion.article
            initial={
                reduceMotion
                    ? false
                    : ENTER_INITIAL
            }
            animate={ENTER_ANIMATE}
            transition={
                reduceMotion
                    ? { duration: 0 }
                    : { duration: 0.32, delay }
            }
            whileHover={
                reduceMotion
                    ? undefined
                    : HOVER_RAISE
            }
            aria-label={
                `${title}. ${displayAmount} FCoin. ` +
                `${directionStyle.label}.`
            }
            className="
                group relative min-w-0 overflow-hidden
                rounded-[24px] border border-slate-200/90
                bg-white/90 p-4
                shadow-[0_12px_35px_rgba(15,23,42,0.06)]
                transition-colors duration-200
                hover:border-indigo-200 hover:bg-white
                dark:border-white/[0.065] dark:bg-[#0d1117]
                dark:shadow-[0_15px_50px_rgba(0,0,0,0.24)]
                dark:hover:border-white/[0.12]
                dark:hover:bg-[#10161d]
                sm:p-5
            "
        >
            {/* Source glow */}
            <div
                aria-hidden="true"
                className={`
                    pointer-events-none absolute inset-0
                    bg-gradient-to-r ${visual.glow}
                    via-transparent to-transparent
                    opacity-30 transition-opacity duration-300
                    group-hover:opacity-60
                    dark:opacity-60 dark:group-hover:opacity-100
                `}
            />

            {/* Direction accent */}
            <div
                aria-hidden="true"
                className={`
                    absolute bottom-4 left-0 top-4
                    w-[2px] rounded-full
                    ${directionStyle.accent}
                `}
            />

            <div
                className="
                    relative z-10 flex min-w-0 flex-col gap-4
                    sm:flex-row sm:items-center
                    sm:justify-between
                "
            >
                {/* LEFT: source and transaction details */}
                <div
                    className="
                        flex min-w-0 flex-1 items-start
                        gap-3.5 sm:items-center
                    "
                >
                    <div
                        className={`
                            relative flex h-12 w-12 shrink-0
                            items-center justify-center
                            rounded-2xl border
                            ${visual.iconBox}
                            ${toneText}
                            sm:h-14 sm:w-14
                        `}
                        aria-hidden="true"
                    >
                        <SourceIcon
                            size={21}
                            strokeWidth={2}
                        />

                        <span
                            className="
                                absolute -bottom-1 -right-1
                                flex h-5 w-5 items-center
                                justify-center rounded-full
                                border border-white bg-slate-100
                                shadow-lg dark:border-[#0d1117]
                                dark:bg-[#161b22]
                            "
                        >
                            <img
                                src={FCoinIcon}
                                alt=""
                                className="
                                    h-3.5 w-3.5 object-contain
                                "
                            />
                        </span>
                    </div>

                    <div className="min-w-0 flex-1">
                        {/* Source and status badges */}
                        <div
                            className="
                                mb-2 flex flex-wrap items-center
                                gap-1.5
                            "
                        >
                            <span
                                className={`
                                    inline-flex max-w-full
                                    items-center rounded-full border
                                    px-2.5 py-1 font-mono text-[9px]
                                    font-black uppercase
                                    tracking-[0.13em]
                                    ${visual.badge}
                                    ${toneText}
                                `}
                            >
                                {visual.label}
                            </span>

                            {statusLabel &&
                                statusLabel !== visual.label && (
                                    <span
                                        className="
                                            inline-flex max-w-full
                                            items-center rounded-full
                                            border border-slate-200
                                            bg-slate-100/80 px-2.5 py-1
                                            font-mono text-[9px]
                                            font-bold uppercase
                                            tracking-[0.12em]
                                            text-slate-600
                                            dark:border-white/[0.06]
                                            dark:bg-white/[0.025]
                                            dark:text-gray-400
                                        "
                                    >
                                        {statusLabel}
                                    </span>
                                )}
                        </div>

                        {/* Transaction title */}
                        <h3
                            className="
                                min-w-0 break-words text-sm
                                font-black leading-6
                                text-slate-900 dark:text-white
                                sm:text-[15px]
                            "
                            title={title}
                        >
                            {title}
                        </h3>

                        {/* Description */}
                        {description && (
                            <p
                                className="
                                    mt-1 line-clamp-2 max-w-2xl
                                    break-words text-xs font-medium
                                    leading-5 text-slate-600
                                    dark:text-gray-400
                                    sm:text-[13px]
                                "
                                title={description}
                            >
                                {description}
                            </p>
                        )}

                        {/* Target and dates */}
                        <div
                            className="
                                mt-2.5 flex min-w-0 flex-wrap
                                items-center gap-x-3 gap-y-1.5
                                text-[10px] font-semibold
                                text-slate-500 dark:text-gray-500
                            "
                        >
                            {targetTitle && (
                                <span
                                    className="
                                        inline-flex min-w-0
                                        max-w-full items-center gap-1.5
                                    "
                                >
                                    <TerminalSquare
                                        size={12}
                                        className="
                                            shrink-0 text-slate-400
                                            dark:text-gray-600
                                        "
                                        aria-hidden="true"
                                    />
                                    <span
                                        className="
                                            max-w-[220px] truncate
                                        "
                                        title={targetTitle}
                                    >
                                        {targetTitle}
                                    </span>
                                </span>
                            )}

                            {relativeDate && (
                                <time
                                    dateTime={isoDate}
                                    title={fullDate}
                                    className="
                                        inline-flex items-center
                                        gap-1.5 text-slate-600
                                        dark:text-gray-400
                                    "
                                >
                                    <Clock3
                                        size={12}
                                        className="
                                            shrink-0 text-indigo-500
                                            dark:text-indigo-400/70
                                        "
                                        aria-hidden="true"
                                    />
                                    {relativeDate}
                                </time>
                            )}

                            {fullDate && (
                                <time
                                    dateTime={isoDate}
                                    className="
                                        hidden items-center gap-1.5
                                        text-slate-500
                                        dark:text-gray-500
                                        lg:inline-flex
                                    "
                                >
                                    <CalendarDays
                                        size={12}
                                        aria-hidden="true"
                                    />
                                    {fullDate}
                                </time>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT: direction and signed amount */}
                <div
                    className="
                        flex min-w-0 items-center
                        justify-between gap-3
                        border-t border-slate-200/80 pt-4
                        dark:border-white/[0.05]
                        sm:max-w-[48%] sm:shrink-0
                        sm:justify-end sm:border-l
                        sm:border-t-0 sm:pl-5 sm:pt-0
                    "
                >
                    <div
                        className={`
                            flex h-9 w-9 shrink-0
                            items-center justify-center
                            rounded-xl border
                            ${directionStyle.icon}
                        `}
                        aria-hidden="true"
                    >
                        <DirectionIcon
                            size={16}
                            strokeWidth={2.3}
                        />
                    </div>

                    <div className="min-w-0 text-right">
                        <div
                            className={`
                                inline-flex max-w-full min-w-0
                                items-center justify-end gap-2
                                rounded-xl border px-3 py-2
                                ${getCoinAmountBadgeClass(item)}
                                ${directionStyle.amount}
                            `}
                        >
                            <span
                                className="
                                    min-w-0 break-all font-mono
                                    text-base font-black leading-snug
                                    tracking-tight tabular-nums
                                    sm:text-lg
                                "
                            >
                                {displayAmount}
                            </span>

                            <img
                                src={FCoinIcon}
                                alt=""
                                aria-hidden="true"
                                className="
                                    h-5 w-5 shrink-0 object-contain
                                    drop-shadow-[0_0_6px_rgba(250,204,21,0.25)]
                                "
                            />
                        </div>

                        <p
                            className="
                                mt-1.5 font-mono text-[9px]
                                font-black uppercase
                                tracking-[0.15em]
                                text-slate-500 dark:text-gray-500
                            "
                        >
                            {directionStyle.label}
                        </p>
                    </div>
                </div>
            </div>
        </motion.article>
    );
};

export default memo(FCoinHistoryItem);