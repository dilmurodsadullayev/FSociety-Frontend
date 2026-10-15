
import React from "react";

import {
    Loader2,
    MessageSquareText,
    Sparkles,
} from "lucide-react";

// =========================================================
// FSOCIETY — DISCUSSION SIDEBAR
//
// Features:
// - Dark / Light Mode
// - Discussion statistics
// - Community feedback
// - FSociety writing tip
// - Responsive layout
//
// No Redux.
// No API requests.
// =========================================================

const DiscussionSidebar = ({
    commentsCount = 0,
    isLoading = false,
}) => {
    // =====================================================
    // SAFE VALUES
    // =====================================================

    const number = Number(commentsCount);

    const count = Number.isFinite(number)
        ? Math.max(0, Math.floor(number))
        : 0;

    const loading = Boolean(isLoading);

    // =====================================================
    // JSX
    // =====================================================

    return (
        <aside
            aria-label="Muhokama haqida ma’lumot"

            className="
                hidden
                min-w-0

                xl:block
            "
        >
            <div
                className="
                    sticky
                    top-24

                    space-y-4
                "
            >
                {/* ======================================
                    DISCUSSION STATISTICS
                ====================================== */}

                <section
                    className="
                        min-w-0

                        rounded-[22px]
                        border
                        border-[#dce5f0]

                        bg-white/85

                        p-5

                        shadow-[0_5px_20px_rgba(15,23,42,0.035)]

                        dark:border-white/[0.08]
                        dark:bg-white/[0.025]
                        dark:shadow-none
                    "
                >
                    {/* HEADER */}

                    <div
                        className="
                            flex
                            min-w-0

                            items-center
                            gap-3
                        "
                    >
                        <div
                            className="
                                grid
                                h-10
                                w-10
                                shrink-0

                                place-items-center

                                rounded-xl
                                border
                                border-indigo-400/25

                                bg-indigo-500/[0.08]

                                text-indigo-700

                                dark:border-indigo-400/20
                                dark:bg-indigo-400/[0.07]
                                dark:text-indigo-300
                            "
                        >
                            <MessageSquareText
                                size={18}
                                strokeWidth={1.9}
                                aria-hidden="true"
                            />
                        </div>

                        <div className="min-w-0">

                            <h3
                                className="
                                    text-[14px]
                                    font-black

                                    text-slate-900

                                    dark:text-white
                                "
                            >
                                Discussion
                            </h3>

                            <p
                                className="
                                    mt-1

                                    font-mono
                                    text-[10px]
                                    font-medium

                                    text-slate-500

                                    dark:text-gray-500
                                "
                            >
                                Community feedback
                            </p>
                        </div>
                    </div>

                    {/* DIVIDER */}

                    <div
                        className="
                            mt-5
                            border-t
                            border-[#e7ebf2]
                            pt-5

                            dark:border-white/[0.07]
                        "
                    >
                        {/* COUNT */}

                        <div
                            aria-live="polite"

                            className="
                                flex
                                min-h-10
                                items-center
                            "
                        >
                            {loading ? (
                                <Loader2
                                    size={23}
                                    aria-label="Yuklanmoqda"

                                    className="
                                        animate-spin
                                        text-indigo-600

                                        dark:text-indigo-300

                                        motion-reduce:animate-none
                                    "
                                />
                            ) : (
                                <strong
                                    className="
                                        font-mono
                                        text-[32px]
                                        font-black
                                        leading-none
                                        tabular-nums

                                        text-slate-900

                                        dark:text-white
                                    "
                                >
                                    {count.toLocaleString("uz-UZ")}
                                </strong>
                            )}
                        </div>

                        <p
                            className="
                                mt-2

                                font-mono
                                text-[10px]
                                font-black
                                uppercase
                                tracking-[0.12em]

                                text-slate-500

                                dark:text-gray-500
                            "
                        >
                            Jami sharh
                        </p>
                    </div>
                </section>

                {/* ======================================
                    COMMUNITY TIP
                ====================================== */}

                <section
                    className="
                        min-w-0

                        rounded-[22px]
                        border
                        border-indigo-400/25

                        bg-gradient-to-br
                        from-indigo-500/[0.07]
                        via-white
                        to-cyan-500/[0.035]

                        p-5

                        dark:border-indigo-400/[0.14]
                        dark:from-indigo-500/[0.06]
                        dark:via-indigo-400/[0.025]
                        dark:to-cyan-400/[0.025]
                    "
                >
                    {/* LABEL */}

                    <div
                        className="
                            flex
                            items-center
                            gap-2

                            text-indigo-700

                            dark:text-indigo-300
                        "
                    >
                        <Sparkles
                            size={16}
                            strokeWidth={1.9}
                            aria-hidden="true"
                        />

                        <span
                            className="
                                font-mono
                                text-[10px]
                                font-black
                                uppercase
                                tracking-[0.12em]
                            "
                        >
                            F.Society tip
                        </span>
                    </div>

                    {/* TEXT */}

                    <p
                        className="
                            mt-3

                            text-[12px]
                            font-medium
                            leading-6

                            text-slate-600

                            dark:text-gray-400
                        "
                    >
                        Fikr yozayotganda loyiha
                        muallifiga aniq savol yoki
                        konstruktiv taklif qoldirishga
                        harakat qiling.
                    </p>
                </section>
            </div>
        </aside>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(DiscussionSidebar);
