
import React, { memo } from "react";
import { Link } from "react-router-dom";

import {
    ArrowRight,
    Bug,
    Coins,
    Plus,
    Terminal,
    Zap,
} from "lucide-react";

import formatCompactNumber from "../../../utils/formatCompactNumber";
import HomeHeroStat from "./HomeHeroStat";
import HomeProblemRadar from "./HomeProblemRadar";
import homeStyles from "./homeStyles";

// =========================================================
// HERO BACKGROUND TEXTURE
// =========================================================

const HERO_GRID_STYLE = {
    backgroundImage: [
        "linear-gradient(to right, rgba(99,102,241,0.055) 1px, transparent 1px)",
        "linear-gradient(to bottom, rgba(99,102,241,0.055) 1px, transparent 1px)",
    ].join(", "),
    backgroundSize: "40px 40px",
};

// =========================================================
// FSOCIETY — HOME HERO
//
// Preserved:
// - Hero title and description
// - Community status badges
// - Create problem link
// - Problems directory link
// - Trending problems count
// - User FCoin balance
// - Platform status
// - Problem radar
//
// Improved:
// - Light / Dark Mode
// - Responsive layout
// - Shared components
// - Compact numbers
// - Loading / Error / Retry
// - Accessible interactions
// =========================================================

const HomeHero = ({
    isLoggedIn = false,
    user = null,
    popularProblems = [],
    radarProblems,
    popularCount,
    isLoading = false,
    error = null,
    onRetry,
}) => {
    // =====================================================
    // SAFE DATA
    // =====================================================

    const safeProblems = Array.isArray(popularProblems)
        ? popularProblems
        : [];

    const safeRadarProblems = Array.isArray(radarProblems)
        ? radarProblems
        : safeProblems.slice(0, 3);

    // =====================================================
    // POPULAR PROBLEMS COUNT
    // =====================================================

    const safeCount = Number(popularCount);

    const displayedProblemCount =
        popularCount !== null &&
        popularCount !== undefined &&
        Number.isFinite(safeCount) &&
        safeCount >= 0
            ? safeCount
            : safeProblems.length;

    // =====================================================
    // FCOIN
    // =====================================================

    const rawCoins = Number(user?.coins ?? 0);

    const displayCoins = Number.isFinite(rawCoins)
        ? rawCoins
        : 0;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <section
            aria-labelledby="home-hero-title"
            className={`
                relative
                min-w-0
                overflow-hidden

                border-b

                px-4
                py-10

                sm:px-6

                lg:px-8
                lg:py-12

                xl:px-10

                ${homeStyles.divider}
            `}
        >
            {/* ======================================
                LOCAL GRID TEXTURE

                This is a subtle Hero decoration.
                The shared PageGridBackground will
                remain at the page level.
            ====================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-0

                    opacity-60

                    dark:opacity-25
                "
                style={HERO_GRID_STYLE}
            />

            {/* ======================================
                AMBIENT LIGHTING
            ====================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute

                    -left-20
                    -top-24

                    h-80
                    w-80

                    rounded-full

                    bg-cyan-300/15
                    blur-[110px]

                    dark:bg-cyan-500/[0.08]
                "
            />

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute

                    -right-20
                    top-0

                    h-96
                    w-96

                    rounded-full

                    bg-indigo-300/20
                    blur-[120px]

                    dark:bg-indigo-500/[0.10]
                "
            />

            {/* ======================================
                HERO LAYOUT
            ====================================== */}

            <div
                className="
                    relative
                    z-10

                    grid
                    min-w-0
                    items-center

                    gap-9

                    xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]
                    xl:gap-8
                "
            >
                {/* ==================================
                    LEFT COLUMN
                ================================== */}

                <div className="min-w-0">
                    {/* STATUS BADGES */}

                    <div className="flex flex-wrap items-center gap-2">
                        <span
                            className="
                                inline-flex
                                max-w-full
                                items-center
                                gap-2

                                rounded-full
                                border
                                border-cyan-200

                                bg-cyan-50/90

                                px-3
                                py-1.5

                                font-mono
                                text-[9px]
                                font-black
                                uppercase
                                tracking-[0.12em]

                                text-cyan-800

                                dark:border-cyan-400/20
                                dark:bg-cyan-400/[0.065]
                                dark:text-cyan-300
                            "
                        >
                            <Terminal
                                size={13}
                                strokeWidth={2}
                                aria-hidden="true"
                            />

                            <span className="break-all">
                                fsociety://build_together
                            </span>
                        </span>

                        <span
                            className="
                                inline-flex
                                items-center
                                gap-2

                                rounded-full
                                border
                                border-emerald-200

                                bg-emerald-50/90

                                px-3
                                py-1.5

                                font-mono
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-[0.12em]

                                text-emerald-700

                                dark:border-emerald-400/15
                                dark:bg-emerald-400/[0.06]
                                dark:text-emerald-300
                            "
                        >
                            <span
                                aria-hidden="true"
                                className="
                                    h-1.5
                                    w-1.5

                                    shrink-0
                                    rounded-full

                                    bg-emerald-500
                                "
                            />

                            community live
                        </span>
                    </div>

                    {/* ==================================
                        TITLE
                    ================================== */}

                    <h1
                        id="home-hero-title"
                        className="
                            mt-7
                            max-w-4xl

                            text-[clamp(2.5rem,5vw,4rem)]
                            font-black
                            leading-[1.04]
                            tracking-[-0.055em]

                            text-slate-950

                            dark:text-white
                        "
                    >
                        Muammoni{" "}

                        <span
                            className="
                                bg-gradient-to-r
                                from-cyan-600
                                via-indigo-600
                                to-fuchsia-600

                                bg-clip-text
                                text-transparent

                                dark:from-cyan-300
                                dark:via-indigo-300
                                dark:to-fuchsia-300
                            "
                        >
                            yechimga
                        </span>

                        <span className="block">
                            aylantiring.
                        </span>
                    </h1>

                    {/* ==================================
                        DESCRIPTION
                    ================================== */}

                    <p
                        className="
                            mt-6
                            max-w-2xl

                            text-sm
                            leading-7

                            text-slate-600

                            sm:text-[15px]

                            dark:text-slate-400
                        "
                    >
                        Xatoni yolg‘iz yechmang. Savolingizni
                        joylang, developerlar bilan fikr almashing,
                        foydali yechim yozing va har bir hissangiz
                        bilan F.Society ichida kuchliroq profil yarating.
                    </p>

                    {/* ==================================
                        ACTION BUTTONS
                    ================================== */}

                    <div
                        className="
                            mt-7

                            flex
                            flex-col

                            gap-3

                            sm:flex-row
                            sm:flex-wrap
                        "
                    >
                        {/* CREATE PROBLEM */}

                        <Link
                            to="/problem-create"
                            className="
                                group/create

                                inline-flex
                                min-h-12

                                items-center
                                justify-center
                                gap-2.5

                                rounded-2xl
                                border
                                border-cyan-300/20

                                bg-gradient-to-r
                                from-cyan-500
                                to-indigo-600

                                px-5
                                py-3

                                text-sm
                                font-black
                                text-white

                                shadow-[0_12px_35px_rgba(34,211,238,0.15)]

                                transition-all
                                duration-200

                                hover:-translate-y-0.5
                                hover:shadow-[0_16px_45px_rgba(99,102,241,0.22)]

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-indigo-500
                                focus-visible:ring-offset-2

                                dark:focus-visible:ring-offset-[#070b12]

                                motion-reduce:transform-none
                                motion-reduce:transition-none
                            "
                        >
                            <Plus
                                size={17}
                                strokeWidth={2.4}
                                aria-hidden="true"
                            />

                            Savol berish

                            <ArrowRight
                                size={15}
                                strokeWidth={2.2}
                                aria-hidden="true"
                                className="
                                    transition-transform
                                    duration-200

                                    group-hover/create:translate-x-0.5

                                    motion-reduce:transform-none
                                "
                            />
                        </Link>

                        {/* ALL PROBLEMS */}

                        <Link
                            to="/problems"
                            className={`
                                group/problems

                                inline-flex
                                min-h-12

                                items-center
                                justify-center
                                gap-2.5

                                rounded-2xl
                                border

                                px-5
                                py-3

                                text-sm
                                font-black

                                transition-all
                                duration-200

                                hover:-translate-y-0.5

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-indigo-500
                                focus-visible:ring-offset-2

                                dark:focus-visible:ring-offset-[#070b12]

                                motion-reduce:transform-none
                                motion-reduce:transition-none

                                ${homeStyles.secondaryButton}
                            `}
                        >
                            <Bug
                                size={17}
                                strokeWidth={2.2}
                                aria-hidden="true"
                            />

                            Muammolarni ko‘rish
                        </Link>
                    </div>

                    {/* ==================================
                        HERO STATISTICS
                    ================================== */}

                    <div
                        className="
                            mt-8

                            grid
                            min-w-0
                            grid-cols-1

                            gap-2.5

                            sm:grid-cols-3
                        "
                    >
                        {/* POPULAR PROBLEMS */}

                        <HomeHeroStat
                            Icon={Bug}
                            label="Trending"
                            value={
                                isLoading && !safeProblems.length
                                    ? "Yuklanmoqda..."
                                    : `${formatCompactNumber(
                                        displayedProblemCount
                                    )} ta muammo`
                            }
                            accentClass="
                                text-cyan-700
                                dark:text-cyan-300
                            "
                        />

                        {/* USER FCOIN */}

                        <HomeHeroStat
                            Icon={Coins}
                            label="Sizning FCoin"
                            value={
                                isLoggedIn
                                    ? `${formatCompactNumber(
                                        displayCoins
                                    )} FCoin`
                                    : "Login kerak"
                            }
                            title={
                                isLoggedIn
                                    ? `To‘liq balans: ${displayCoins.toLocaleString(
                                        "uz-UZ"
                                    )} FCoin`
                                    : undefined
                            }
                            accentClass="
                                text-amber-600
                                dark:text-amber-300
                            "
                        />

                        {/* PLATFORM */}

                        <HomeHeroStat
                            Icon={Zap}
                            label="Platforma"
                            value="Real-time"
                            accentClass="
                                text-indigo-600
                                dark:text-indigo-300
                            "
                        />
                    </div>
                </div>

                {/* ==================================
                    RIGHT COLUMN — PROBLEM RADAR
                ================================== */}

                <div className="relative min-w-0">
                    <HomeProblemRadar
                        problems={safeRadarProblems}
                        isLoading={isLoading}
                        error={error}
                        onRetry={onRetry}
                    />
                </div>
            </div>
        </section>
    );
};

export default memo(HomeHero);
