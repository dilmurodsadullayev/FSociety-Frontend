
import React, { memo } from "react";

import {
    ShieldCheck,
    Star,
} from "lucide-react";

import {
    roadmap,
    rules,
} from "./fcoinData";

import FCoinMotion from "./FCoinMotion";

// =========================================================
// PLATFORM RULE
// =========================================================

const RuleCard = memo(function RuleCard({
    rule,
}) {
    const Icon = rule.icon;

    return (
        <article
            className="
                rounded-3xl
                border border-slate-200
                bg-slate-50/80 p-5

                transition-colors
                hover:border-indigo-300
                hover:bg-indigo-50/50

                dark:border-white/[0.08]
                dark:bg-[#090f1b]/60
                dark:hover:border-indigo-400/30
                dark:hover:bg-white/[0.045]
            "
        >
            <div
                className="
                    mb-4 flex h-11 w-11
                    items-center justify-center
                    rounded-2xl border
                    border-indigo-200
                    bg-indigo-50 text-indigo-700

                    dark:border-indigo-400/20
                    dark:bg-indigo-500/10
                    dark:text-indigo-300
                "
            >
                <Icon
                    size={22}
                    aria-hidden="true"
                />
            </div>

            <h3
                className="
                    text-lg font-black
                    text-slate-900
                    dark:text-white
                "
            >
                {rule.title}
            </h3>

            <p
                className="
                    mt-2 text-sm font-medium leading-6
                    text-slate-600
                    dark:text-slate-400
                "
            >
                {rule.desc}
            </p>
        </article>
    );
});

// =========================================================
// RULES PANEL
// =========================================================

const RulesPanel = memo(function RulesPanel() {
    return (
        <FCoinMotion
            className="
                min-w-0 rounded-[28px]
                border border-slate-200
                bg-white/90 p-5

                shadow-[0_20px_60px_rgba(15,23,42,0.06)]
                backdrop-blur-md

                sm:p-8

                dark:border-white/[0.09]
                dark:bg-[#0d1422]/90
                dark:shadow-[0_25px_70px_rgba(0,0,0,0.20)]
            "
        >
            <header className="mb-8 flex items-center gap-4">
                <div
                    className="
                        flex h-14 w-14 shrink-0
                        items-center justify-center
                        rounded-3xl border
                        border-indigo-200
                        bg-indigo-50 text-indigo-700

                        dark:border-indigo-400/20
                        dark:bg-indigo-500/10
                        dark:text-indigo-300
                    "
                >
                    <ShieldCheck
                        size={28}
                        aria-hidden="true"
                    />
                </div>

                <div className="min-w-0">
                    <h2
                        className="
                            text-2xl font-black
                            text-slate-900
                            sm:text-3xl
                            dark:text-white
                        "
                    >
                        Tizim qoidalari
                    </h2>

                    <p
                        className="
                            mt-1 text-sm font-medium
                            text-slate-600
                            dark:text-slate-400
                        "
                    >
                        FCoin adolatli va shaffof ishlashi uchun.
                    </p>
                </div>
            </header>

            <div className="grid gap-4 md:grid-cols-2">
                {rules.map((rule) => (
                    <RuleCard
                        key={rule.title}
                        rule={rule}
                    />
                ))}
            </div>
        </FCoinMotion>
    );
});

// =========================================================
// ROADMAP PANEL
// =========================================================

const RoadmapPanel = memo(function RoadmapPanel() {
    return (
        <FCoinMotion
            delay={0.08}
            className="
                min-w-0 rounded-[28px]
                border border-amber-200
                bg-white/90 p-5

                shadow-[0_20px_60px_rgba(15,23,42,0.06)]
                backdrop-blur-md

                sm:p-8

                dark:border-yellow-400/15
                dark:bg-[#0d1422]/90
                dark:shadow-[0_25px_70px_rgba(0,0,0,0.20)]
            "
        >
            <header className="mb-6 flex items-center gap-4">
                <div
                    className="
                        flex h-14 w-14 shrink-0
                        items-center justify-center
                        rounded-3xl border
                        border-amber-200
                        bg-amber-50 text-amber-700

                        dark:border-yellow-400/20
                        dark:bg-yellow-500/10
                        dark:text-yellow-300
                    "
                >
                    <Star
                        size={27}
                        aria-hidden="true"
                    />
                </div>

                <div className="min-w-0">
                    <h2
                        className="
                            text-2xl font-black
                            text-slate-900
                            dark:text-white
                        "
                    >
                        Keyingi bosqich
                    </h2>

                    <p
                        className="
                            mt-1 text-sm font-medium
                            text-slate-600
                            dark:text-slate-400
                        "
                    >
                        FCoin uchun roadmap
                    </p>
                </div>
            </header>

            <div className="space-y-4">
                {roadmap.map((item, index) => (
                    <div
                        key={item}
                        className="
                            flex items-start gap-3
                            rounded-2xl border
                            border-slate-200
                            bg-slate-50/80 p-4

                            dark:border-white/[0.08]
                            dark:bg-white/[0.035]
                        "
                    >
                        <div
                            className="
                                flex h-8 w-8 shrink-0
                                items-center justify-center
                                rounded-xl border
                                border-amber-200
                                bg-amber-50

                                text-xs font-black
                                text-amber-800

                                dark:border-yellow-400/20
                                dark:bg-yellow-500/10
                                dark:text-yellow-300
                            "
                        >
                            {index + 1}
                        </div>

                        <p
                            className="
                                text-sm font-bold leading-6
                                text-slate-700
                                dark:text-slate-300
                            "
                        >
                            {item}
                        </p>
                    </div>
                ))}
            </div>
        </FCoinMotion>
    );
});

// =========================================================
// RULES AND ROADMAP
// =========================================================

const FCoinRulesRoadmap = () => (
    <section
        aria-label="FCoin qoidalari va roadmap"
        className="
            mt-10 grid min-w-0 gap-8
            lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]
        "
    >
        <RulesPanel />
        <RoadmapPanel />
    </section>
);

export default memo(FCoinRulesRoadmap);
