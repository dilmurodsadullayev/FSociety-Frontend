
import React from "react";

import { Link } from "react-router-dom";

import {
    ArrowUpRight,
    Eye,
    MessageCircle,
    Star,
} from "lucide-react";

import { formatNumber } from "./problemCardUtils";

const StatItem = ({
    Icon,
    value,
    label,
    iconClassName = "",
}) => (
    <span
        title={`${label}: ${value ?? 0}`}
        aria-label={`${label}: ${value ?? 0}`}
        className="
            inline-flex
            shrink-0
            items-center
            gap-1
            text-[10px]
            font-bold
            text-slate-600
            dark:text-gray-400
        "
    >
        <Icon
            size={13}
            strokeWidth={2}
            aria-hidden="true"
            className={iconClassName}
        />

        {formatNumber(value)}
    </span>
);

const ProblemCardFooter = ({
    views = 0,
    response = 0,
    star = 0,
    detailUrl,
}) => {
    return (
        <footer
            className="
                flex
                min-w-0
                items-center
                justify-between
                gap-2
                border-t
                border-[#e5eaf3]
                px-4
                py-2.5
                dark:border-white/[0.06]
            "
        >
            {/* STATS */}

            <div
                className="
                    flex
                    min-w-0
                    items-center
                    gap-3
                "
            >
                <StatItem
                    Icon={Eye}
                    value={views}
                    label="Ko‘rishlar"
                    iconClassName="
                        text-cyan-700
                        dark:text-cyan-300
                    "
                />

                <StatItem
                    Icon={MessageCircle}
                    value={response}
                    label="Javoblar"
                    iconClassName="
                        text-indigo-700
                        dark:text-indigo-300
                    "
                />

                <StatItem
                    Icon={Star}
                    value={star}
                    label="Yulduzlar"
                    iconClassName="
                        text-amber-600
                        dark:text-yellow-300
                    "
                />
            </div>

            {/* DETAIL LINK */}

            <Link
                to={detailUrl}
                aria-label="Muammoni ko‘rish"
                className="
                    group/open
                    inline-flex
                    h-8
                    shrink-0
                    items-center
                    justify-center
                    gap-1
                    rounded-lg
                    border
                    border-cyan-400/25
                    bg-cyan-500/[0.07]
                    px-2.5
                    text-[10px]
                    font-bold
                    text-cyan-700
                    transition-colors
                    duration-150
                    hover:border-cyan-400/40
                    hover:bg-cyan-500/[0.12]
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-cyan-500
                    dark:border-cyan-400/15
                    dark:bg-cyan-400/[0.045]
                    dark:text-cyan-300
                    dark:hover:border-cyan-400/25
                    dark:hover:bg-cyan-400/[0.09]
                "
            >
                Ko‘rish

                <ArrowUpRight
                    size={13}
                    strokeWidth={2}
                    aria-hidden="true"
                    className="
                        transition-transform
                        duration-150
                        group-hover/open:-translate-y-0.5
                        group-hover/open:translate-x-0.5
                        motion-reduce:transform-none
                    "
                />
            </Link>
        </footer>
    );
};

export default React.memo(ProblemCardFooter);
