
import React, { memo } from "react";

import {
    AlertCircle,
    ArrowLeft,
    RefreshCw,
} from "lucide-react";

// =========================================================
// SHARED SKELETON
// =========================================================

const Block = ({ className = "" }) => (
    <div
        className={`
            rounded-lg
            bg-slate-200/90
            dark:bg-white/[0.07]
            ${className}
        `}
    />
);

// =========================================================
// LOADING
// =========================================================

export const ProblemSolutionUpdateLoading = memo(() => (
    <main
        aria-busy="true"
        className="
            min-h-screen
            bg-slate-50
            px-3
            py-8

            dark:bg-[#070b14]

            sm:px-6
        "
    >
        <span role="status" className="sr-only">
            Yechim ma’lumotlari yuklanmoqda.
        </span>

        <div
            aria-hidden="true"
            className="
                mx-auto
                w-full
                max-w-5xl
                space-y-5
                animate-pulse
                motion-reduce:animate-none
            "
        >
            <Block className="h-9 w-40 rounded-xl" />

            <div
                className="
                    overflow-hidden
                    rounded-[24px]
                    border
                    border-slate-200
                    bg-white

                    dark:border-white/[0.09]
                    dark:bg-[#0e1421]
                "
            >
                <div
                    className="
                        flex
                        items-center
                        gap-4
                        border-b
                        border-slate-200
                        p-5

                        dark:border-white/[0.08]

                        sm:p-7
                    "
                >
                    <Block className="h-12 w-12 shrink-0 rounded-2xl" />

                    <div className="flex-1 space-y-3">
                        <Block className="h-5 w-44 max-w-full" />
                        <Block className="h-3 w-64 max-w-full" />
                        <Block className="h-3 w-32 max-w-full" />
                    </div>
                </div>

                <div className="space-y-7 p-5 sm:p-7">
                    <div className="space-y-3">
                        <Block className="h-3 w-32" />
                        <Block className="h-12 w-full rounded-xl" />
                    </div>

                    <div className="space-y-3">
                        <Block className="h-3 w-48" />
                        <Block className="h-36 w-full rounded-xl" />
                    </div>

                    <div className="space-y-3">
                        <Block className="h-3 w-40" />

                        <div
                            className="
                                space-y-4
                                rounded-2xl
                                border
                                border-slate-200
                                bg-slate-50
                                p-5

                                dark:border-white/[0.07]
                                dark:bg-[#080e19]
                            "
                        >
                            {[54, 83, 66, 42, 74].map((width) => (
                                <Block
                                    key={width}
                                    className="h-3 rounded-full"
                                    style={undefined}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-between gap-3">
                        <Block className="h-11 w-36 rounded-xl" />
                        <Block className="h-11 w-48 rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    </main>
));

// =========================================================
// ERROR
// =========================================================

export const ProblemSolutionUpdateError = memo(({
    message,
    onRetry,
    onBack,
}) => (
    <main
        className="
            flex
            min-h-screen
            items-center
            justify-center
            bg-slate-50
            px-4
            py-10

            dark:bg-[#070b14]
        "
    >
        <div
            role="alert"
            className="
                w-full
                max-w-xl
                rounded-[24px]
                border
                border-rose-200
                bg-white
                p-6
                text-center

                dark:border-rose-400/20
                dark:bg-[#0e1421]

                sm:p-9
            "
        >
            <div
                className="
                    mx-auto
                    grid
                    h-16
                    w-16
                    place-items-center
                    rounded-2xl
                    border
                    border-rose-200
                    bg-rose-50
                    text-rose-700

                    dark:border-rose-400/20
                    dark:bg-rose-400/[0.08]
                    dark:text-rose-300
                "
            >
                <AlertCircle
                    size={28}
                    aria-hidden="true"
                />
            </div>

            <h2
                className="
                    mt-5
                    text-2xl
                    font-black
                    text-slate-900

                    dark:text-white
                "
            >
                Yechim yuklanmadi
            </h2>

            <p
                className="
                    mt-3
                    break-words
                    text-sm
                    leading-6
                    text-slate-600

                    dark:text-gray-400
                "
            >
                {message}
            </p>

            <div
                className="
                    mt-6
                    flex
                    flex-col
                    justify-center
                    gap-3

                    sm:flex-row
                "
            >
                <button
                    type="button"
                    onClick={onBack}
                    className="
                        inline-flex
                        min-h-11
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        px-5
                        text-xs
                        font-bold
                        text-slate-700

                        dark:border-white/[0.10]
                        dark:bg-white/[0.04]
                        dark:text-gray-300
                    "
                >
                    <ArrowLeft size={16} aria-hidden="true" />
                    Ortga
                </button>

                <button
                    type="button"
                    onClick={onRetry}
                    className="
                        inline-flex
                        min-h-11
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-cyan-600
                        px-5
                        text-xs
                        font-bold
                        text-white

                        hover:bg-cyan-700
                    "
                >
                    <RefreshCw size={16} aria-hidden="true" />
                    Qayta urinish
                </button>
            </div>
        </div>
    </main>
));
