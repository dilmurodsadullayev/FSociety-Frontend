
import React, { memo } from "react";

import {
    ArrowUpRight,
    Banknote,
    Gift,
    ShoppingCart,
} from "lucide-react";

import FCoinImage from "../../assests/coin/fcoin.png";

import {
    earnWays,
    spendWays,
    toneClasses,
} from "./fcoinData";

import FCoinMotion from "./FCoinMotion";

// =========================================================
// SHARED STYLES
// =========================================================

const PANEL_CLASS = `
    relative min-w-0 overflow-hidden
    rounded-[28px] border
    border-slate-200
    bg-white/90
    shadow-[0_20px_60px_rgba(15,23,42,0.07)]
    backdrop-blur-md

    dark:border-white/[0.09]
    dark:bg-[#0d1422]/90
    dark:shadow-[0_25px_70px_rgba(0,0,0,0.23)]
`;

const COIN_BADGE_CLASS = `
    inline-flex shrink-0 items-center gap-1.5
    rounded-xl border border-amber-200
    bg-amber-50 px-2.5 py-1.5
    text-xs font-black text-amber-800

    dark:border-yellow-400/20
    dark:bg-yellow-500/10
    dark:text-yellow-300
`;

// =========================================================
// REWARD ROW
// =========================================================

const RewardRow = memo(function RewardRow({
    item,
    index = 0,
}) {
    const Icon = item.icon;

    return (
        <FCoinMotion
            delay={index * 0.05}
            hover
            className="
                group flex min-w-0
                flex-wrap items-center gap-3
                rounded-2xl border border-slate-200
                bg-slate-50/80 p-4

                transition-colors duration-200
                hover:border-emerald-300
                hover:bg-emerald-50/80

                sm:flex-nowrap sm:gap-4

                dark:border-white/[0.07]
                dark:bg-white/[0.035]
                dark:hover:border-emerald-400/25
                dark:hover:bg-emerald-500/[0.06]
            "
        >
            <div
                className={`
                    flex h-12 w-12 shrink-0
                    items-center justify-center
                    rounded-2xl border
                    ${toneClasses[item.tone] || toneClasses.blue}
                `}
            >
                <Icon
                    size={22}
                    aria-hidden="true"
                />
            </div>

            <div className="min-w-0 flex-1">
                <h3
                    className="
                        text-sm font-black
                        text-slate-900
                        sm:text-base
                        dark:text-white
                    "
                >
                    {item.title}
                </h3>

                <p
                    className="
                        mt-1 text-xs font-medium leading-5
                        text-slate-600
                        sm:text-sm
                        dark:text-slate-400
                    "
                >
                    {item.desc}
                </p>
            </div>

            <span className={COIN_BADGE_CLASS}>
                <img
                    src={FCoinImage}
                    alt=""
                    aria-hidden="true"
                    className="h-4 w-4 object-contain"
                />
                +{item.bonus}
            </span>
        </FCoinMotion>
    );
});

// =========================================================
// SPEND CARD
// =========================================================

const SpendCard = memo(function SpendCard({
    item,
    index = 0,
}) {
    const Icon = item.icon;

    return (
        <FCoinMotion
            delay={index * 0.06}
            hover
            className="
                group min-w-0 rounded-2xl
                border border-slate-200
                bg-slate-50/80 p-4

                transition-colors
                hover:border-indigo-300
                hover:bg-indigo-50/80

                dark:border-white/[0.07]
                dark:bg-white/[0.035]
                dark:hover:border-indigo-400/30
                dark:hover:bg-indigo-500/10
            "
        >
            <div className="mb-4 flex items-start justify-between gap-3">
                <div
                    className="
                        flex h-11 w-11 shrink-0
                        items-center justify-center
                        rounded-2xl border
                        border-indigo-200
                        bg-indigo-50
                        text-indigo-700

                        dark:border-indigo-400/20
                        dark:bg-indigo-500/10
                        dark:text-indigo-300
                    "
                >
                    <Icon
                        size={21}
                        aria-hidden="true"
                    />
                </div>

                <span className={COIN_BADGE_CLASS}>
                    <img
                        src={FCoinImage}
                        alt=""
                        aria-hidden="true"
                        className="h-4 w-4 object-contain"
                    />
                    {item.price}
                </span>
            </div>

            <h3
                className="
                    text-base font-black
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
        </FCoinMotion>
    );
});

// =========================================================
// EARN PANEL
// =========================================================

const EarnPanel = memo(function EarnPanel() {
    return (
        <FCoinMotion
            className={PANEL_CLASS}
        >
            <div className="relative p-5 sm:p-8">
                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none absolute
                        -right-20 -top-20
                        h-56 w-56 rounded-full
                        bg-emerald-400/10 blur-3xl
                    "
                />

                <header
                    className="
                        relative z-10 mb-8
                        flex items-center
                        justify-between gap-4
                    "
                >
                    <div className="min-w-0">
                        <div
                            className="
                                mb-3 inline-flex
                                items-center gap-2
                                rounded-full border
                                border-emerald-200
                                bg-emerald-50 px-3 py-1

                                text-xs font-black uppercase
                                tracking-widest text-emerald-700

                                dark:border-emerald-400/20
                                dark:bg-emerald-500/10
                                dark:text-emerald-300
                            "
                        >
                            <ArrowUpRight
                                size={15}
                                aria-hidden="true"
                            />
                            Earn FCoin
                        </div>

                        <h2
                            className="
                                text-2xl font-black
                                text-slate-900
                                sm:text-3xl
                                dark:text-white
                            "
                        >
                            FCoin ishlash yo‘llari
                        </h2>

                        <p
                            className="
                                mt-2 text-sm font-medium
                                leading-6 text-slate-600
                                dark:text-slate-400
                            "
                        >
                            Platformaga foyda keltiring va har bir
                            foydali hissangiz uchun reward oling.
                        </p>
                    </div>

                    <div
                        className="
                            hidden h-16 w-16 shrink-0
                            items-center justify-center
                            rounded-3xl border
                            border-emerald-200
                            bg-emerald-50 text-emerald-700

                            sm:flex
                            dark:border-emerald-400/20
                            dark:bg-emerald-500/10
                            dark:text-emerald-300
                        "
                    >
                        <Banknote
                            size={30}
                            aria-hidden="true"
                        />
                    </div>
                </header>

                <div className="relative z-10 space-y-3">
                    {earnWays.map((item, index) => (
                        <RewardRow
                            key={item.title}
                            item={item}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </FCoinMotion>
    );
});

// =========================================================
// SPEND PANEL
// =========================================================

const SpendPanel = memo(function SpendPanel() {
    return (
        <FCoinMotion
            delay={0.08}
            className={PANEL_CLASS}
        >
            <div className="relative p-5 sm:p-8">
                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none absolute
                        -left-20 -top-20
                        h-56 w-56 rounded-full
                        bg-indigo-500/10 blur-3xl
                    "
                />

                <header
                    className="
                        relative z-10 mb-8
                        flex items-center
                        justify-between gap-4
                    "
                >
                    <div className="min-w-0">
                        <div
                            className="
                                mb-3 inline-flex items-center
                                gap-2 rounded-full
                                border border-indigo-200
                                bg-indigo-50 px-3 py-1

                                text-xs font-black uppercase
                                tracking-widest text-indigo-700

                                dark:border-indigo-400/20
                                dark:bg-indigo-500/10
                                dark:text-indigo-300
                            "
                        >
                            <ShoppingCart
                                size={15}
                                aria-hidden="true"
                            />
                            Spend FCoin
                        </div>

                        <h2
                            className="
                                text-2xl font-black
                                text-slate-900
                                sm:text-3xl
                                dark:text-white
                            "
                        >
                            FCoin sarflash
                        </h2>

                        <p
                            className="
                                mt-2 text-sm font-medium
                                leading-6 text-slate-600
                                dark:text-slate-400
                            "
                        >
                            Profil, loyiha va platformadagi
                            imkoniyatlaringizni kuchaytiring.
                        </p>
                    </div>

                    <div
                        className="
                            hidden h-16 w-16 shrink-0
                            items-center justify-center
                            rounded-3xl border
                            border-indigo-200
                            bg-indigo-50 text-indigo-700

                            sm:flex
                            dark:border-indigo-400/20
                            dark:bg-indigo-500/10
                            dark:text-indigo-300
                        "
                    >
                        <Gift
                            size={30}
                            aria-hidden="true"
                        />
                    </div>
                </header>

                <div
                    className="
                        relative z-10 grid
                        gap-3 sm:grid-cols-2
                    "
                >
                    {spendWays.map((item, index) => (
                        <SpendCard
                            key={item.title}
                            item={item}
                            index={index}
                        />
                    ))}
                </div>

                <div
                    className="
                        relative z-10 mt-6
                        rounded-2xl border
                        border-indigo-200
                        bg-indigo-50/80 p-5

                        dark:border-indigo-400/20
                        dark:bg-indigo-500/10
                    "
                >
                    <p
                        className="
                            text-sm font-semibold leading-7
                            text-indigo-800
                            dark:text-indigo-200
                        "
                    >
                        Kelajakda FCoin orqali avatar frame,
                        premium badge, loyiha boost va FSociety
                        brend sovg‘alarini olish imkoniyati qo‘shiladi.
                    </p>
                </div>
            </div>
        </FCoinMotion>
    );
});

// =========================================================
// SECTION
// =========================================================

const FCoinRewardPanels = () => (
    <section
        aria-label="FCoin ishlash va sarflash"
        className="
            mt-16 grid min-w-0
            gap-8 lg:grid-cols-2
        "
    >
        <EarnPanel />
        <SpendPanel />
    </section>
);

export default memo(FCoinRewardPanels);
