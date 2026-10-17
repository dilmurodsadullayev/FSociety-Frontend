
import React, { memo } from "react";

import {
    CheckCircle2,
    Clock3,
    Coins,
    Gift,
    Handshake,
    ShieldCheck,
    Zap,
} from "lucide-react";

import FCoinIcon from "../../../assests/coin/fcoin.png";

import homeStyles from "./homeStyles";

// =========================================================
// REWARD CONFIGURATION
// =========================================================

const REWARD_STEPS = [
    {
        number: "01",
        Icon: Handshake,
        title: "Yordam bering",
        description:
            "Savollarga javob yozing, yechim ulashing va " +
            "boshqa developerga muammoni yopishga yordam bering.",
        accentClass: `
            border-cyan-200 bg-cyan-50 text-cyan-700
            dark:border-cyan-400/20
            dark:bg-cyan-400/[0.08]
            dark:text-cyan-300
        `,
    },
    {
        number: "02",
        Icon: Coins,
        title: "FCoin yig‘ing",
        description:
            "Foydali javoblar, faoliyat va platformadagi " +
            "hissangiz orqali FCoin hamda reyting oling.",
        accentClass: `
            border-amber-200 bg-amber-50 text-amber-700
            dark:border-amber-400/20
            dark:bg-amber-400/[0.08]
            dark:text-amber-300
        `,
        showFCoinIcon: true,
    },
    {
        number: "03",
        Icon: Gift,
        title: "Profilni kuchaytiring",
        description:
            "Badge, reyting, portfolio va jamiyatdagi " +
            "faollik orqali developer profilingizni ajratib ko‘rsating.",
        accentClass: `
            border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700
            dark:border-fuchsia-400/20
            dark:bg-fuchsia-400/[0.08]
            dark:text-fuchsia-300
        `,
    },
];

const TRUST_ITEMS = [
    {
        id: "contribution",
        Icon: CheckCircle2,
        label: "Real contribution",
        description: "Foydali ish qadrlanadi",
        iconClass: "text-emerald-600 dark:text-emerald-300",
    },
    {
        id: "reputation",
        Icon: ShieldCheck,
        label: "Reputation",
        description: "Profil kuchayib boradi",
        iconClass: "text-indigo-600 dark:text-indigo-300",
    },
    {
        id: "realtime",
        Icon: Clock3,
        label: "Real-time",
        description: "Yangilanishlar darhol",
        iconClass: "text-cyan-700 dark:text-cyan-300",
    },
];

// =========================================================
// REWARD STEP
//
// Extracted from the original Main.jsx.
// =========================================================

const RewardStep = memo(function RewardStep({
    number,
    Icon,
    title,
    description,
    accentClass = "",
    showFCoinIcon = false,
}) {
    return (
        <article
            className="
                group/step relative flex h-full min-w-0
                flex-col overflow-hidden rounded-3xl
                border border-slate-200 bg-white/85
                p-5 shadow-sm backdrop-blur-sm

                transition-all duration-300
                hover:-translate-y-1
                hover:border-indigo-300
                hover:shadow-[0_18px_42px_rgba(79,70,229,0.10)]

                dark:border-white/[0.08]
                dark:bg-white/[0.035]
                dark:shadow-none
                dark:hover:border-indigo-400/25
                dark:hover:bg-white/[0.055]

                motion-reduce:transform-none
                motion-reduce:transition-none
            "
        >
            {/* DECORATIVE GLOW */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none absolute -right-12
                    -top-12 h-32 w-32 rounded-full
                    bg-indigo-300/15 blur-3xl
                    transition-transform duration-300

                    group-hover/step:scale-125

                    dark:bg-indigo-400/[0.08]
                    motion-reduce:transform-none
                "
            />

            {/* ICON + STEP NUMBER */}

            <div className="relative flex items-start justify-between gap-4">
                <div
                    className={`
                        grid h-12 w-12 shrink-0
                        place-items-center rounded-2xl border
                        ${accentClass}
                    `}
                >
                    {showFCoinIcon ? (
                        <img
                            src={FCoinIcon}
                            alt="FCoin"
                            width="29"
                            height="29"
                            loading="lazy"
                            decoding="async"
                            className="
                                h-7 w-7 object-contain
                                drop-shadow-[0_0_10px_rgba(234,179,8,0.25)]
                            "
                        />
                    ) : Icon ? (
                        <Icon
                            size={21}
                            strokeWidth={1.9}
                            aria-hidden="true"
                        />
                    ) : null}
                </div>

                <span
                    className="
                        font-mono text-[11px] font-black
                        tracking-[0.16em]
                        text-slate-400 dark:text-slate-500
                    "
                >
                    {number}
                </span>
            </div>

            {/* TEXT */}

            <h3
                className="
                    relative mt-5 text-lg font-black
                    tracking-tight text-slate-900
                    dark:text-white
                "
            >
                {title}
            </h3>

            <p
                className="
                    relative mt-2 flex-1 text-sm
                    leading-7 text-slate-600
                    dark:text-slate-400
                "
            >
                {description}
            </p>
        </article>
    );
});

// =========================================================
// TRUST ITEM
// =========================================================

const TrustItem = memo(function TrustItem({
    Icon,
    label,
    description,
    iconClass = "",
}) {
    return (
        <div
            className="
                flex min-w-0 items-center gap-3
                rounded-2xl px-3 py-3
            "
        >
            <div
                className="
                    grid h-9 w-9 shrink-0
                    place-items-center rounded-xl
                    border border-slate-200
                    bg-white/80

                    dark:border-white/[0.08]
                    dark:bg-white/[0.04]
                "
            >
                <Icon
                    size={17}
                    strokeWidth={2}
                    aria-hidden="true"
                    className={iconClass}
                />
            </div>

            <div className="min-w-0">
                <p
                    className="
                        font-mono text-[10px] font-black
                        uppercase tracking-[0.10em]
                        text-slate-500 dark:text-slate-400
                    "
                >
                    {label}
                </p>

                <p
                    className="
                        mt-1 text-xs font-semibold
                        text-slate-800 dark:text-slate-200
                    "
                >
                    {description}
                </p>
            </div>
        </div>
    );
});

// =========================================================
// HOME REWARDS SECTION
// =========================================================

const HomeRewards = () => {
    return (
        <section
            id="about"
            aria-labelledby="home-rewards-title"
            className={`
                relative min-w-0 overflow-hidden
                border-b bg-white/45
                px-4 py-16

                sm:px-6
                lg:px-8 lg:py-20
                xl:px-10

                dark:bg-[#090f1b]/65
                ${homeStyles.divider}
            `}
        >
            {/* AMBIENT GLOW */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none absolute left-1/2
                    top-0 h-72 w-[520px] max-w-full
                    -translate-x-1/2 -translate-y-1/2
                    rounded-full bg-indigo-300/20
                    blur-[110px]

                    dark:bg-indigo-500/[0.065]
                "
            />

            <div className="relative">
                {/* HEADER */}

                <header className="mx-auto max-w-3xl text-center">
                    <span
                        className="
                            inline-flex max-w-full
                            items-center gap-2 rounded-full
                            border border-cyan-200
                            bg-cyan-50/90 px-3 py-1.5
                            font-mono text-[10px] font-black
                            uppercase tracking-[0.12em]
                            text-cyan-800

                            dark:border-cyan-400/20
                            dark:bg-cyan-400/[0.07]
                            dark:text-cyan-300
                        "
                    >
                        <Zap
                            size={13}
                            strokeWidth={2}
                            aria-hidden="true"
                        />

                        fsociety://reward_loop
                    </span>

                    <h2
                        id="home-rewards-title"
                        className="
                            mt-5 text-3xl font-black
                            tracking-[-0.035em]
                            text-slate-900 sm:text-4xl
                            dark:text-white
                        "
                    >
                        Bilim ulashing.{" "}

                        <span
                            className="
                                bg-gradient-to-r
                                from-cyan-600 via-indigo-600
                                to-amber-600 bg-clip-text
                                text-transparent

                                dark:from-cyan-300
                                dark:via-indigo-300
                                dark:to-amber-300
                            "
                        >
                            Qiymat yarating.
                        </span>
                    </h2>

                    <p
                        className="
                            mx-auto mt-4 max-w-2xl
                            text-sm leading-7
                            text-slate-600 dark:text-slate-400
                        "
                    >
                        F.Society’da foydali harakat shunchaki
                        “activity” emas — u reputation, FCoin
                        va profil kuchiga aylanadi.
                    </p>
                </header>

                {/* REWARD STEPS */}

                <div
                    className="
                        mt-10 grid min-w-0
                        grid-cols-1 gap-4
                        md:grid-cols-3
                    "
                >
                    {REWARD_STEPS.map((step) => (
                        <RewardStep
                            key={step.number}
                            {...step}
                        />
                    ))}
                </div>

                {/* TRUST STRIP */}

                <div
                    className="
                        mt-5 grid min-w-0 grid-cols-1
                        gap-2 rounded-3xl
                        border border-slate-200
                        bg-white/75 p-3
                        shadow-sm backdrop-blur-sm

                        sm:grid-cols-3

                        dark:border-white/[0.08]
                        dark:bg-white/[0.025]
                    "
                >
                    {TRUST_ITEMS.map((item) => (
                        <TrustItem
                            key={item.id}
                            Icon={item.Icon}
                            label={item.label}
                            description={item.description}
                            iconClass={item.iconClass}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default memo(HomeRewards);
