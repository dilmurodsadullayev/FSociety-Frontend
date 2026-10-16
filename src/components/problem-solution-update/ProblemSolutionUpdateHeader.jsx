
import React, { memo } from "react";

import {
    ArrowLeft,
    Code2,
    FileCode2,
    Pencil,
    ShieldAlert,
    Sparkles,
} from "lucide-react";

const ProblemSolutionUpdateHeader = ({
    solutionId,
    languageName,
    onBack,
    disabled = false,
}) => (
    <>
        <div
            className="
                mb-5
                flex
                flex-wrap
                items-center
                justify-between
                gap-3
            "
        >
            <button
                type="button"
                onClick={onBack}
                disabled={disabled}
                className="
                    inline-flex
                    min-h-10
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    text-xs
                    font-bold
                    text-slate-600

                    hover:text-cyan-700
                    disabled:cursor-not-allowed
                    disabled:opacity-50

                    dark:border-white/[0.09]
                    dark:bg-white/[0.04]
                    dark:text-gray-300
                "
            >
                <ArrowLeft size={16} aria-hidden="true" />
                Muammoga qaytish
            </button>

            <span
                className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-cyan-200
                    bg-cyan-50
                    px-3
                    py-1.5
                    font-mono
                    text-[10px]
                    font-black
                    uppercase
                    tracking-wider
                    text-cyan-800

                    dark:border-cyan-400/20
                    dark:bg-cyan-400/[0.08]
                    dark:text-cyan-300
                "
            >
                <ShieldAlert size={13} aria-hidden="true" />
                Edit solution
            </span>
        </div>

        <header
            className="
                relative
                overflow-hidden
                border-b
                border-slate-200
                bg-slate-50/70
                px-5
                py-6

                sm:px-7

                dark:border-white/[0.08]
                dark:bg-white/[0.025]
            "
        >
            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    -right-16
                    -top-20
                    h-52
                    w-52
                    rounded-full
                    bg-cyan-500/[0.055]
                    blur-3xl
                "
            />

            <div
                className="
                    relative
                    flex
                    min-w-0
                    flex-col
                    justify-between
                    gap-5

                    sm:flex-row
                    sm:items-start
                "
            >
                <div className="flex min-w-0 items-start gap-4">
                    <div
                        className="
                            grid
                            h-12
                            w-12
                            shrink-0
                            place-items-center
                            rounded-2xl
                            border
                            border-cyan-200
                            bg-cyan-50
                            text-cyan-700

                            dark:border-cyan-400/20
                            dark:bg-cyan-400/[0.09]
                            dark:text-cyan-300
                        "
                    >
                        <Pencil
                            size={21}
                            aria-hidden="true"
                        />
                    </div>

                    <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap gap-2">
                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-1.5
                                    rounded-full
                                    border
                                    border-slate-200
                                    bg-white
                                    px-2.5
                                    py-1
                                    font-mono
                                    text-[10px]
                                    font-bold
                                    text-slate-600

                                    dark:border-white/[0.09]
                                    dark:bg-white/[0.05]
                                    dark:text-gray-400
                                "
                            >
                                <FileCode2 size={12} aria-hidden="true" />
                                #{solutionId}
                            </span>

                            <span
                                className="
                                    inline-flex
                                    min-w-0
                                    items-center
                                    gap-1.5
                                    rounded-full
                                    border
                                    border-indigo-200
                                    bg-indigo-50
                                    px-2.5
                                    py-1
                                    text-[10px]
                                    font-bold
                                    text-indigo-800

                                    dark:border-indigo-400/20
                                    dark:bg-indigo-400/[0.09]
                                    dark:text-indigo-300
                                "
                            >
                                <Code2
                                    size={12}
                                    aria-hidden="true"
                                    className="shrink-0"
                                />

                                <span className="truncate">
                                    {languageName}
                                </span>
                            </span>
                        </div>

                        <h1
                            className="
                                break-words
                                text-2xl
                                font-black
                                tracking-tight
                                text-slate-900

                                sm:text-3xl

                                dark:text-white
                            "
                        >
                            Yechimni tahrirlash
                        </h1>

                        <p
                            className="
                                mt-2
                                max-w-2xl
                                text-sm
                                font-medium
                                leading-6
                                text-slate-600

                                dark:text-gray-400
                            "
                        >
                            Yechim matni, tushuntirish va koddagi
                            o‘zgarishlarni tekshirib, keyin saqlang.
                        </p>
                    </div>
                </div>

                <span
                    className="
                        hidden
                        shrink-0
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-emerald-200
                        bg-emerald-50
                        px-3
                        py-2
                        text-[10px]
                        font-bold
                        text-emerald-800

                        md:inline-flex

                        dark:border-emerald-400/20
                        dark:bg-emerald-400/[0.08]
                        dark:text-emerald-300
                    "
                >
                    <Sparkles size={14} aria-hidden="true" />
                    Existing solution
                </span>
            </div>
        </header>
    </>
);

export default memo(ProblemSolutionUpdateHeader);
