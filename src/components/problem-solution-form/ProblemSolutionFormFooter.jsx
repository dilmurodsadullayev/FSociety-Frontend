
import React, { memo } from "react";

import {
    Lightbulb,
    Loader2,
    Send,
} from "lucide-react";

const ProblemSolutionFormFooter = ({
    isSubmitting = false,
    isLanguagesLoading = false,
}) => {
    const disabled =
        isSubmitting ||
        isLanguagesLoading;

    return (
        <footer
            className="
                mt-6
                flex
                flex-col
                gap-4
                border-t
                border-slate-200
                pt-5

                sm:flex-row
                sm:items-center
                sm:justify-between

                dark:border-white/[0.09]
            "
        >
            {/* INFORMATION */}

            <div
                className="
                    flex
                    max-w-xl
                    items-start
                    gap-2
                "
            >
                <Lightbulb
                    size={15}
                    aria-hidden="true"
                    className="
                        mt-0.5
                        shrink-0
                        text-amber-600

                        dark:text-amber-400
                    "
                />

                <p
                    className="
                        text-[11px]
                        font-medium
                        leading-6
                        text-slate-500

                        dark:text-gray-400
                    "
                >
                    Qisqa yechim, batafsil tushuntirish
                    va til tanlash majburiy. Kod namunasi
                    ixtiyoriy.
                </p>
            </div>

            {/* SUBMIT */}

            <button
                type="submit"
                disabled={disabled}
                aria-busy={isSubmitting}
                className="
                    group
                    relative
                    inline-flex
                    min-h-12
                    w-full
                    min-w-0
                    shrink-0

                    items-center
                    justify-center
                    gap-2

                    overflow-hidden
                    rounded-xl

                    border
                    border-cyan-500/20

                    bg-gradient-to-r
                    from-cyan-600
                    via-blue-600
                    to-indigo-600

                    px-5
                    py-3

                    text-xs
                    font-black
                    text-white

                    shadow-lg
                    shadow-cyan-500/15

                    transition-all
                    duration-200

                    hover:-translate-y-0.5
                    hover:shadow-cyan-500/25

                    active:translate-y-0

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-cyan-500

                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    disabled:hover:translate-y-0

                    sm:w-auto
                    sm:min-w-[205px]

                    motion-reduce:transform-none
                    motion-reduce:transition-none
                "
            >
                {!disabled && (
                    <span
                        aria-hidden="true"
                        className="
                            pointer-events-none
                            absolute
                            inset-y-0
                            -left-16
                            w-12
                            rotate-12
                            bg-white/[0.10]
                            blur-md

                            transition-all
                            duration-700

                            group-hover:left-[120%]

                            motion-reduce:hidden
                        "
                    />
                )}

                <span
                    className="
                        relative
                        z-10
                        inline-flex
                        items-center
                        gap-2
                    "
                >
                    {isSubmitting ? (
                        <>
                            <Loader2
                                size={16}
                                aria-hidden="true"
                                className="
                                    animate-spin
                                    motion-reduce:animate-none
                                "
                            />

                            Yuborilmoqda...
                        </>
                    ) : isLanguagesLoading ? (
                        <>
                            <Loader2
                                size={16}
                                aria-hidden="true"
                                className="
                                    animate-spin
                                    motion-reduce:animate-none
                                "
                            />

                            Tillar yuklanmoqda...
                        </>
                    ) : (
                        <>
                            <Send
                                size={16}
                                aria-hidden="true"
                            />

                            Yechimni yuborish
                        </>
                    )}
                </span>
            </button>
        </footer>
    );
};

export default memo(ProblemSolutionFormFooter);
