
import React, { memo } from "react";

import {
    FolderSearch2,
    Loader2,
    Sparkles,
} from "lucide-react";

// =========================================================
// FSOCIETY — SIMILAR PROBLEMS HEADER
// =========================================================

const SimilarProblemsHeader = ({
    count = 0,
    isLoading = false,
}) => {
    return (
        <header
            className="
                relative
                z-10
                border-b
                border-slate-200
                bg-slate-50/70
                px-4
                py-5

                sm:px-5

                dark:border-white/[0.08]
                dark:bg-white/[0.025]
            "
        >
            <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-3
                "
            >
                {/* TEXT */}

                <div className="min-w-0 flex-1">
                    <div
                        className="
                            mb-2
                            inline-flex
                            items-center
                            gap-2
                            font-mono
                            text-[10px]
                            font-black
                            uppercase
                            tracking-[0.12em]
                            text-indigo-700

                            dark:text-indigo-300
                        "
                    >
                        <Sparkles
                            size={12}
                            aria-hidden="true"
                        />

                        Related problems
                    </div>

                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            gap-2.5
                        "
                    >
                        <h3
                            id="similar-problems-heading"
                            className="
                                font-display
                                text-lg
                                font-black
                                tracking-tight
                                text-slate-900

                                sm:text-xl

                                dark:text-white
                            "
                        >
                            Shu kabi muammolar
                        </h3>

                        {count > 0 && (
                            <span
                                aria-label={`${count} ta o‘xshash muammo`}
                                className="
                                    inline-flex
                                    h-7
                                    min-w-7
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-indigo-200
                                    bg-indigo-50
                                    px-2
                                    font-mono
                                    text-[11px]
                                    font-black
                                    tabular-nums
                                    text-indigo-800

                                    dark:border-indigo-400/25
                                    dark:bg-indigo-400/[0.09]
                                    dark:text-indigo-300
                                "
                            >
                                {count}
                            </span>
                        )}
                    </div>

                    <p
                        className="
                            mt-2
                            max-w-sm
                            text-[11px]
                            font-medium
                            leading-5
                            text-slate-600

                            dark:text-gray-400
                        "
                    >
                        Siz ko‘rayotgan muammoga yaqin
                        mavzular va avvalgi yechimlar.
                    </p>
                </div>

                {/* ICON */}

                <div
                    aria-hidden="true"
                    className="
                        grid
                        h-11
                        w-11
                        shrink-0
                        place-items-center
                        rounded-xl
                        border
                        border-indigo-200
                        bg-indigo-50
                        text-indigo-700

                        dark:border-indigo-400/20
                        dark:bg-indigo-400/[0.08]
                        dark:text-indigo-300
                    "
                >
                    {isLoading ? (
                        <Loader2
                            size={19}
                            className="
                                animate-spin
                                motion-reduce:animate-none
                            "
                        />
                    ) : (
                        <FolderSearch2 size={19} />
                    )}
                </div>
            </div>
        </header>
    );
};

export default memo(SimilarProblemsHeader);
