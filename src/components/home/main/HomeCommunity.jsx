
import React, { memo } from "react";

import {
    MessageCircle,
    MessagesSquare,
} from "lucide-react";

import CommentSection from "../../CommentSection";

import homeStyles from "./homeStyles";

// =========================================================
// FSOCIETY — HOME COMMUNITY
//
// Contains the existing CommentSection component.
//
// Preserved:
// - Comments display
// - Existing API / Redux behavior
// - Existing interactions
// - CommentSection's internal loading states
//
// Improved:
// - Light / Dark Mode
// - Responsive section header
// - Consistent FSociety design
// - Shared background compatibility
// =========================================================

const HomeCommunity = () => {
    return (
        <section
            id="community-voice"
            aria-labelledby="home-community-title"
            className="
                relative min-w-0

                bg-white/35
                px-4 py-14

                sm:px-6
                lg:px-8
                xl:px-10

                dark:bg-[#090f19]/60
            "
        >
            {/* DECORATIVE LIGHT */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none absolute
                    -left-24 top-0 h-64 w-64
                    rounded-full bg-cyan-300/15
                    blur-[100px]

                    dark:bg-cyan-400/[0.055]
                "
            />

            <div className="relative min-w-0">
                {/* ======================================
                    HEADER
                ====================================== */}

                <header
                    className="
                        mb-7 flex min-w-0 flex-col
                        gap-4

                        sm:flex-row
                        sm:items-end
                        sm:justify-between
                    "
                >
                    {/* TITLE */}

                    <div className="min-w-0">
                        <p
                            className={`
                                flex items-center gap-2
                                font-mono text-[10px]
                                font-black uppercase
                                tracking-[0.14em]

                                ${homeStyles.eyebrow}
                            `}
                        >
                            <MessagesSquare
                                size={14}
                                aria-hidden="true"
                                className="
                                    text-indigo-600
                                    dark:text-indigo-400
                                "
                            />

                            community://voice
                        </p>

                        <h2
                            id="home-community-title"
                            className="
                                mt-3 text-2xl font-black
                                tracking-[-0.03em]
                                text-slate-900

                                sm:text-3xl
                                dark:text-white
                            "
                        >
                            Jamiyat nima deyapti?
                        </h2>

                        <p
                            className="
                                mt-3 max-w-xl text-sm
                                leading-7 text-slate-600
                                dark:text-slate-400
                            "
                        >
                            FSociety hamjamiyati fikrlari,
                            takliflari va o‘zaro suhbatlari.
                        </p>
                    </div>

                    {/* FEEDBACK LOOP BADGE */}

                    <span
                        className="
                            inline-flex w-fit shrink-0
                            items-center gap-2 self-start
                            rounded-full border border-indigo-200
                            bg-indigo-50/85 px-3 py-1.5

                            text-[10px] font-black
                            uppercase tracking-[0.10em]
                            text-indigo-700

                            sm:self-auto

                            dark:border-indigo-400/20
                            dark:bg-indigo-400/[0.07]
                            dark:text-indigo-300
                        "
                    >
                        <MessageCircle
                            size={13}
                            strokeWidth={2}
                            aria-hidden="true"
                        />

                        feedback loop
                    </span>
                </header>

                {/* ======================================
                    EXISTING COMMENTS MODULE

                    No props or internal logic changed.
                ====================================== */}

                <div className="relative min-w-0">
                    <CommentSection />
                </div>
            </div>
        </section>
    );
};

export default memo(HomeCommunity);
