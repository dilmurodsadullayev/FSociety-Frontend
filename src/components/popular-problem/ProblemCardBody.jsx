
import React from "react";

import { Link } from "react-router-dom";
import { Code2 } from "lucide-react";

import { limitText } from "../../utils/limitText";

const ProblemCardBody = ({
    problem,
    description,
    tags = [],
    detailUrl,
}) => {
    const title = limitText(
        problem || "Nomsiz muammo",
        85
    );

    const descriptionText = limitText(
        description ||
            "Muammo haqida qo‘shimcha tavsif mavjud emas.",
        125
    );

    const visibleTags = tags.slice(0, 2);
    const extraCount = Math.max(
        0,
        tags.length - visibleTags.length
    );

    return (
        <div
            className="
                min-w-0
                px-4
                pb-4
                pt-3
            "
        >
            {/* TITLE */}

            <Link
                to={detailUrl}
                className="
                    group/title
                    block
                    rounded-md
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-cyan-500
                "
            >
                <h3
                    className="
                        line-clamp-2
                        text-[16px]
                        font-black
                        leading-[1.4]
                        tracking-[-0.025em]
                        text-slate-900
                        transition-colors
                        duration-150
                        group-hover/title:text-cyan-700
                        dark:text-gray-100
                        dark:group-hover/title:text-cyan-200
                    "
                >
                    {title}
                </h3>
            </Link>

            {/* DESCRIPTION */}

            <p
                className="
                    mt-1.5
                    line-clamp-2
                    text-[11px]
                    leading-[1.65]
                    text-slate-600
                    dark:text-gray-500
                "
            >
                {descriptionText}
            </p>

            {/* TAGS */}

            <div
                className="
                    mt-3
                    flex
                    min-w-0
                    items-center
                    gap-1.5
                "
            >
                {visibleTags.length > 0 ? (
                    <>
                        {visibleTags.map((tag, index) => (
                            <span
                                key={`${tag}-${index}`}
                                title={tag}
                                className="
                                    inline-flex
                                    min-w-0
                                    max-w-[42%]
                                    items-center
                                    gap-1
                                    rounded-lg
                                    border
                                    border-[#dce5f1]
                                    bg-[#f4f7fc]
                                    px-2
                                    py-1
                                    font-mono
                                    text-[9px]
                                    font-semibold
                                    text-slate-600
                                    dark:border-white/[0.07]
                                    dark:bg-white/[0.035]
                                    dark:text-gray-400
                                "
                            >
                                <Code2
                                    size={11}
                                    className="
                                        shrink-0
                                        text-cyan-700
                                        dark:text-cyan-300
                                    "
                                    aria-hidden="true"
                                />

                                <span className="truncate">
                                    {tag}
                                </span>
                            </span>
                        ))}

                        {extraCount > 0 && (
                            <span
                                title={tags.slice(2).join(", ")}
                                className="
                                    shrink-0
                                    rounded-lg
                                    border
                                    border-indigo-400/20
                                    bg-indigo-500/[0.06]
                                    px-2
                                    py-1
                                    font-mono
                                    text-[9px]
                                    font-bold
                                    text-indigo-700
                                    dark:text-indigo-300
                                "
                            >
                                +{extraCount}
                            </span>
                        )}
                    </>
                ) : (
                    <>
                        <span
                            className="
                                rounded-lg
                                border
                                border-cyan-400/20
                                bg-cyan-500/[0.06]
                                px-2
                                py-1
                                font-mono
                                text-[9px]
                                font-semibold
                                text-cyan-700
                                dark:text-cyan-300
                            "
                        >
                            #problem
                        </span>

                        <span
                            className="
                                rounded-lg
                                border
                                border-indigo-400/20
                                bg-indigo-500/[0.06]
                                px-2
                                py-1
                                font-mono
                                text-[9px]
                                font-semibold
                                text-indigo-700
                                dark:text-indigo-300
                            "
                        >
                            #solution
                        </span>
                    </>
                )}
            </div>
        </div>
    );
};

export default React.memo(ProblemCardBody);
