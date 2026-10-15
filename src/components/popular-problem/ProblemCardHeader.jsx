
import React from "react";

import {
    Bug,
    CheckCircle2,
    CircleDot,
    XCircle,
} from "lucide-react";
import timeAgo from "../../utils/timeAgo";


const ProblemCardHeader = ({
    id,
    status,
    solved = false,
    date,
}) => {
    const rejected =
        !solved &&
        String(status || "").toLowerCase() === "rejected";

    const StatusIcon = solved
        ? CheckCircle2
        : rejected
            ? XCircle
            : CircleDot;

    const statusLabel = solved
        ? "Solved"
        : rejected
            ? "Rejected"
            : "Open";

    const statusClasses = solved
        ? `
            border-emerald-400/25
            bg-emerald-500/[0.07]
            text-emerald-700
            dark:border-emerald-400/15
            dark:bg-emerald-400/[0.05]
            dark:text-emerald-300
        `
        : rejected
            ? `
                border-red-400/25
                bg-red-500/[0.07]
                text-red-700
                dark:border-red-400/15
                dark:bg-red-400/[0.05]
                dark:text-red-300
            `
            : `
                border-orange-400/25
                bg-orange-500/[0.07]
                text-orange-700
                dark:border-orange-400/15
                dark:bg-orange-400/[0.05]
                dark:text-orange-300
            `;

    const hasId =
        id !== null &&
        id !== undefined &&
        id !== "";

    return (
        <header
            className="
                flex
                min-w-0
                items-start
                justify-between
                gap-2
                px-4
                pt-4
            "
        >
            <div
                className="
                    flex
                    min-w-0
                    flex-wrap
                    items-center
                    gap-1.5
                "
            >
                <span
                    className="
                        inline-flex
                        items-center
                        gap-1
                        rounded-full
                        border
                        border-cyan-400/20
                        bg-cyan-500/[0.06]
                        px-2
                        py-1
                        font-mono
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-wide
                        text-cyan-700
                        dark:border-cyan-400/15
                        dark:bg-cyan-400/[0.05]
                        dark:text-cyan-300
                    "
                >
                    <Bug
                        size={11}
                        strokeWidth={2}
                        aria-hidden="true"
                    />

                    Problem
                </span>

                <span
                    className={`
                        inline-flex
                        items-center
                        gap-1
                        rounded-full
                        border
                        px-2
                        py-1
                        font-mono
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-wide
                        ${statusClasses}
                    `}
                >
                    <StatusIcon
                        size={11}
                        strokeWidth={2}
                        aria-hidden="true"
                    />

                    {statusLabel}
                </span>
            </div>

            <div
                className="
                    flex
                    shrink-0
                    flex-col
                    items-end
                    gap-1
                    text-right
                "
            >
                {hasId && (
                    <span
                        className="
                            font-mono
                            text-[9px]
                            font-bold
                            tracking-wider
                            text-slate-400
                            dark:text-gray-600
                        "
                    >
                        PRB_{String(id).padStart(3, "0")}
                    </span>
                )}

                <span
                    className="
                        whitespace-nowrap
                        text-[9px]
                        font-medium
                        text-slate-500
                        dark:text-gray-600
                    "
                >
                    {timeAgo(date)}
                </span>
            </div>
        </header>
    );
};

export default React.memo(ProblemCardHeader);
