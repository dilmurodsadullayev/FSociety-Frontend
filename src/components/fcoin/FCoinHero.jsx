
import React, { memo } from "react";

import {
    motion,
    useReducedMotion,
} from "framer-motion";

import {
    Bug,
    Sparkles,
    TrendingUp,
    Wallet,
} from "lucide-react";

import FCoinImage from "../../assests/coin/fcoin.png";

import {
    FCOIN_REWARDS,
    biggestFixedReward,
} from "./fcoinData";

// =========================================================
// ANIMATION CONSTANTS
// =========================================================

const COIN_FLOAT = {
    y: [0, -8, 0],
    rotateY: [0, 8, 0],
};

const COIN_FLOAT_TRANSITION = {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
};

const GLOW_ANIMATION = {
    scale: [1, 1.25, 1],
    opacity: [0.45, 0.8, 0.45],
};

const GLOW_TRANSITION = {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
};

const HERO_INITIAL = {
    scale: 0.8,
    opacity: 0,
    rotateY: -45,
};

const HERO_VISIBLE = {
    scale: 1,
    opacity: 1,
    rotateY: 0,
};

// =========================================================
// NUMBER HELPER
//
// Full value is intentional on the FCoin page.
// =========================================================

const formatBalance = (value) => {
    const number = Number(value);

    return Number.isFinite(number)
        ? number.toLocaleString("uz-UZ")
        : "0";
};

// =========================================================
// WALLET STAT CARD
// =========================================================

const HeroStatCard = memo(function HeroStatCard({
    Icon,
    label,
    value,
    suffix = "FCoin",
    tone = "yellow",
}) {
    const color =
        tone === "emerald"
            ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300"
            : tone === "cyan"
                ? "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-300"
                : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300";

    return (
        <article
            className="
                min-w-0
                rounded-3xl
                border border-slate-200

                bg-white/90
                p-5
                text-left

                shadow-[0_14px_45px_rgba(15,23,42,0.06)]
                backdrop-blur-md

                dark:border-white/10
                dark:bg-[#101725]/90
                dark:shadow-[0_18px_55px_rgba(0,0,0,0.2)]
            "
        >
            <div className="flex min-w-0 items-center gap-3.5">
                <div
                    className={`
                        grid h-12 w-12 shrink-0
                        place-items-center rounded-2xl border
                        ${color}
                    `}
                >
                    <Icon
                        size={23}
                        aria-hidden="true"
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <p
                        className="
                            text-[11px] font-black uppercase
                            tracking-wider text-slate-500
                            dark:text-slate-400
                        "
                    >
                        {label}
                    </p>

                    <p
                        className="
                            mt-1 break-words
                            text-[clamp(1.2rem,2vw,1.8rem)]
                            font-black tabular-nums
                            text-slate-900 dark:text-white
                        "
                    >
                        {value}{" "}
                        <span
                            className="
                                text-xs font-bold
                                text-amber-700
                                sm:text-sm
                                dark:text-amber-300
                            "
                        >
                            {suffix}
                        </span>
                    </p>
                </div>
            </div>
        </article>
    );
});

// =========================================================
// MAIN HERO
// =========================================================

const FCoinHero = ({ currentCoins = 0 }) => {
    const reducedMotion = Boolean(
        useReducedMotion()
    );

    return (
        <section
            aria-labelledby="fcoin-hero-title"
            className="
                relative
                mx-auto
                max-w-6xl
                pt-6
                text-center
            "
        >
            {/* ======================================
                ANIMATED MAIN COIN
            ====================================== */}

            <motion.div
                initial={
                    reducedMotion
                        ? false
                        : HERO_INITIAL
                }

                animate={HERO_VISIBLE}

                transition={{
                    type: reducedMotion ? "tween" : "spring",
                    duration: reducedMotion ? 0 : undefined,
                    stiffness: 110,
                    damping: 14,
                    delay: reducedMotion ? 0 : 0.1,
                }}

                className="
                    relative mx-auto flex
                    h-44 w-44
                    items-center justify-center
                    sm:h-56 sm:w-56
                "
            >
                {/* GOLDEN PULSE */}

                <motion.div
                    aria-hidden="true"
                    animate={
                        reducedMotion
                            ? undefined
                            : GLOW_ANIMATION
                    }
                    transition={GLOW_TRANSITION}
                    className="
                        pointer-events-none
                        absolute inset-0
                        rounded-full
                        bg-amber-400/30
                        blur-[55px]
                        dark:bg-yellow-400/20
                    "
                />

                {/* INNER RING */}

                <div
                    aria-hidden="true"
                    className="
                        absolute h-[78%] w-[78%]
                        rounded-full
                        border border-amber-400/30
                        dark:border-yellow-300/20
                    "
                />

                {/* OUTER RING */}

                <div
                    aria-hidden="true"
                    className="
                        absolute h-[98%] w-[98%]
                        rounded-full
                        border border-indigo-400/20
                        dark:border-indigo-300/10
                    "
                />

                {/* LARGE ANIMATED FCoin */}

                <motion.img
                    src={FCoinImage}
                    alt="FCoin tangasi"
                    draggable={false}
                    decoding="async"
                    animate={
                        reducedMotion
                            ? undefined
                            : COIN_FLOAT
                    }
                    transition={COIN_FLOAT_TRANSITION}
                    className="
                        relative z-10
                        h-32 w-32
                        select-none object-contain
                        drop-shadow-[0_0_35px_rgba(250,204,21,0.38)]
                        sm:h-44 sm:w-44
                        dark:drop-shadow-[0_0_42px_rgba(250,204,21,0.45)]
                    "
                />
            </motion.div>

            {/* ======================================
                TITLE AND DESCRIPTION
            ====================================== */}

            <div className="relative mt-7">
                <div
                    className="
                        mx-auto mb-5 inline-flex
                        items-center gap-2
                        rounded-full
                        border border-amber-300/40
                        bg-amber-50/90
                        px-4 py-2

                        text-xs font-black uppercase
                        tracking-[0.14em]
                        text-amber-800

                        shadow-lg shadow-amber-500/5

                        sm:text-sm
                        dark:border-yellow-400/20
                        dark:bg-yellow-500/10
                        dark:text-yellow-300
                    "
                >
                    <Sparkles
                        size={16}
                        aria-hidden="true"
                    />
                    FixCoin Economy
                </div>

                <h1
                    id="fcoin-hero-title"
                    className="
                        text-4xl
                        font-black tracking-tight
                        text-slate-950
                        sm:text-6xl
                        lg:text-7xl
                        dark:text-white
                    "
                >
                    FCoin{" "}
                    <span
                        className="
                            bg-gradient-to-r
                            from-amber-600 via-yellow-500
                            to-orange-500
                            bg-clip-text
                            italic text-transparent

                            dark:from-yellow-200
                            dark:via-amber-400
                            dark:to-yellow-500
                        "
                    >
                        iqtisodiyoti
                    </span>
                </h1>

                <p
                    className="
                        mx-auto mt-6 max-w-3xl
                        text-sm font-medium leading-7
                        text-slate-600
                        sm:text-lg sm:leading-8
                        dark:text-slate-400
                    "
                >
                    FCoin — FSociety ichidagi motivatsion aktiv.
                    Muammo yeching, post yozing, loyiha yuklang,
                    foydali feedback yuboring va communityga
                    qo‘shgan hissangizni raqamli qiymatga
                    aylantiring.
                </p>
            </div>

            {/* ======================================
                WALLET SUMMARY
            ====================================== */}

            <div
                className="
                    mx-auto mt-10
                    grid max-w-5xl gap-4
                    md:grid-cols-3
                "
            >
                <HeroStatCard
                    Icon={Wallet}
                    label="Sizning hamyoningiz"
                    value={formatBalance(currentCoins)}
                    tone="yellow"
                />

                <HeroStatCard
                    Icon={TrendingUp}
                    label="Eng katta fixed bonus"
                    value={`+${formatBalance(biggestFixedReward)}`}
                    tone="emerald"
                />

                <HeroStatCard
                    Icon={Bug}
                    label="Bug reward"
                    value={`+${formatBalance(FCOIN_REWARDS.FEEDBACK.BUG)}`}
                    tone="cyan"
                />
            </div>
        </section>
    );
};

export default memo(FCoinHero);
