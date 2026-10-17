
import React, { memo } from "react";

import {
    MessageSquareText,
    ShieldCheck,
} from "lucide-react";

import FCoinImage from "../../assests/coin/fcoin.png";

import {
    feedbackRewards,
    toneClasses,
} from "./fcoinData";

import FCoinMotion from "./FCoinMotion";

// =========================================================
// FEEDBACK REWARD CARD
// =========================================================

const FeedbackRewardCard = memo(
    function FeedbackRewardCard({
        item,
        index = 0,
    }) {
        const Icon = item.icon;

        return (
            <FCoinMotion
                delay={index * 0.06}
                hover
                className="
                    group relative min-w-0
                    overflow-hidden rounded-3xl

                    border border-slate-200
                    bg-white/80 p-5

                    transition-colors
                    hover:border-cyan-300
                    hover:bg-cyan-50/70

                    dark:border-white/[0.08]
                    dark:bg-[#111927]/85
                    dark:hover:border-cyan-400/20
                    dark:hover:bg-cyan-500/[0.035]
                "
            >
                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none absolute
                        -right-10 -top-10
                        h-32 w-32 rounded-full
                        bg-cyan-500/[0.06]
                        blur-3xl
                    "
                />

                <div className="relative z-10">
                    <div
                        className="
                            flex flex-wrap items-start
                            justify-between gap-3
                        "
                    >
                        <div
                            className={`
                                grid h-12 w-12 shrink-0
                                place-items-center rounded-2xl
                                border
                                ${toneClasses[item.tone] || toneClasses.blue}
                            `}
                        >
                            <Icon
                                size={22}
                                aria-hidden="true"
                            />
                        </div>

                        <span
                            className="
                                inline-flex items-center gap-1.5
                                rounded-xl border
                                border-amber-200 bg-amber-50
                                px-3 py-1.5 text-sm
                                font-black text-amber-800

                                dark:border-yellow-400/20
                                dark:bg-yellow-500/10
                                dark:text-yellow-300
                            "
                        >
                            <img
                                src={FCoinImage}
                                alt=""
                                aria-hidden="true"
                                className="h-4 w-4 object-contain"
                            />
                            +{item.bonus}
                        </span>
                    </div>

                    <h3
                        className="
                            mt-5 text-lg font-black
                            text-slate-900
                            dark:text-white
                        "
                    >
                        {item.title}
                    </h3>

                    <p
                        className="
                            mt-2 text-sm font-medium leading-6
                            text-slate-600
                            dark:text-slate-400
                        "
                    >
                        {item.desc}
                    </p>

                    <span
                        className="
                            mt-4 inline-flex max-w-full
                            items-center gap-1.5
                            rounded-full border
                            border-cyan-200 bg-cyan-50/80
                            px-3 py-1

                            text-[10px] font-black uppercase
                            tracking-wider text-cyan-800

                            dark:border-cyan-400/15
                            dark:bg-cyan-500/[0.06]
                            dark:text-cyan-300
                        "
                    >
                        <ShieldCheck
                            size={12}
                            className="shrink-0"
                            aria-hidden="true"
                        />
                        {item.badge}
                    </span>
                </div>
            </FCoinMotion>
        );
    }
);

// =========================================================
// FEEDBACK REWARDS SECTION
// =========================================================

const FCoinFeedbackRewards = () => {
    return (
        <section
            aria-labelledby="fcoin-feedback-title"
            className="mt-10 min-w-0"
        >
            <FCoinMotion
                className="
                    relative min-w-0
                    overflow-hidden
                    rounded-[28px] border
                    border-cyan-200
                    bg-white/85 p-5

                    shadow-[0_20px_60px_rgba(15,23,42,0.06)]
                    backdrop-blur-md

                    sm:p-8

                    dark:border-cyan-400/15
                    dark:bg-[#0d1422]/85
                    dark:shadow-[0_25px_70px_rgba(0,0,0,0.20)]
                "
            >
                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none absolute
                        -right-32 -top-32
                        h-80 w-80 rounded-full
                        bg-cyan-500/[0.08]
                        blur-[100px]
                    "
                />

                <div className="relative z-10">
                    <header
                        className="
                            mb-8 flex flex-col gap-4
                            sm:flex-row
                            sm:items-end
                            sm:justify-between
                        "
                    >
                        <div className="min-w-0">
                            <span
                                className="
                                    inline-flex items-center gap-2
                                    rounded-full border
                                    border-cyan-200 bg-cyan-50
                                    px-3 py-1.5

                                    text-xs font-black uppercase
                                    tracking-widest text-cyan-800

                                    dark:border-cyan-400/20
                                    dark:bg-cyan-500/10
                                    dark:text-cyan-300
                                "
                            >
                                <MessageSquareText
                                    size={14}
                                    aria-hidden="true"
                                />
                                Feedback Rewards
                            </span>

                            <h2
                                id="fcoin-feedback-title"
                                className="
                                    mt-4 text-2xl font-black
                                    text-slate-900
                                    sm:text-3xl
                                    dark:text-white
                                "
                            >
                                Feedback yuborib FCoin ishlang
                            </h2>

                            <p
                                className="
                                    mt-2 max-w-3xl
                                    text-sm font-medium leading-7
                                    text-slate-600
                                    dark:text-slate-400
                                "
                            >
                                Feedback reward oddiy activitydan
                                farq qiladi. Avval admin tekshiradi.
                                Faqat tasdiqlangan, haqiqatan foydali
                                feedback uchun FCoin beriladi.
                            </p>
                        </div>

                        <span
                            className="
                                inline-flex w-fit shrink-0
                                items-center gap-2
                                rounded-2xl border
                                border-amber-200
                                bg-amber-50 px-4 py-3

                                text-xs font-bold text-amber-800

                                dark:border-yellow-400/20
                                dark:bg-yellow-500/[0.08]
                                dark:text-yellow-200
                            "
                        >
                            <ShieldCheck
                                size={17}
                                aria-hidden="true"
                            />
                            Admin approval required
                        </span>
                    </header>

                    <div
                        className="
                            grid min-w-0 gap-4
                            sm:grid-cols-2
                            xl:grid-cols-4
                        "
                    >
                        {feedbackRewards.map((item, index) => (
                            <FeedbackRewardCard
                                key={item.title}
                                item={item}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </FCoinMotion>
        </section>
    );
};

export default memo(FCoinFeedbackRewards);
