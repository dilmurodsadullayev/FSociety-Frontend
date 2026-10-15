
import React, {
    useCallback,
    useEffect,
    useMemo,
} from "react";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    ArrowRight,
    Bug,
    CheckCircle2,
    Clock3,
    Code2,
    Coins,
    Eye,
    Gift,
    Handshake,
    MessageCircle,
    Plus,
    ShieldCheck,
    Sparkles,
    Star,
    Terminal,
    UserRound,
    Zap,
} from "lucide-react";

import CommentSection from "./CommentSection";
import PopularProblemCard from "./PopularProblemCard";
import HomeSidebar from "./HomeSidebar";
import SiteUpdates from "./SiteUpdates";

import ProblemService from "../services/problems";

import {
    getPopularProblemStart,
    getPopularProblemSuccess,
} from "../features/problems/Problems";

import FCoinIcon from "../assests/coin/fcoin.png";

// =========================================================
// FSOCIETY HOME — THEME STYLES
//
// Light Mode = default
// Dark Mode  = html.dark
//
// Keep all Tailwind classes literal for class scanning.
// =========================================================

const styles = {
    page: `
        min-h-screen
        bg-[#edf2fa]
        text-slate-900
        dark:bg-[#050816]
        dark:text-white
    `,

    mainCard: `
        min-w-0
        overflow-hidden
        rounded-[30px]
        border
        border-[#d9e2ef]
        bg-white
        shadow-[0_18px_70px_rgba(30,41,59,0.08)]
        dark:border-white/[0.055]
        dark:bg-[#070b12]
        dark:shadow-[0_28px_100px_rgba(0,0,0,0.22)]
    `,

    divider: `
        border-[#e1e7f1]
        dark:border-white/[0.055]
    `,

    title: `
        text-slate-900
        dark:text-white
    `,

    subtitle: `
        text-slate-600
        dark:text-gray-500
    `,

    eyebrow: `
        text-slate-500
        dark:text-gray-600
    `,

    surface: `
        border-[#dce4ef]
        bg-[#f8faff]
        dark:border-white/[0.06]
        dark:bg-white/[0.025]
    `,

    secondaryButton: `
        border-[#d8e1ef]
        bg-white/80
        text-slate-700
        hover:border-indigo-400/30
        hover:bg-indigo-50
        hover:text-indigo-700
        dark:border-white/[0.075]
        dark:bg-white/[0.028]
        dark:text-gray-300
        dark:hover:border-indigo-400/20
        dark:hover:bg-indigo-400/[0.055]
        dark:hover:text-white
    `,
};

// =========================================================
// HELPERS
// =========================================================

const formatCompactNumber = (value) => {
    const number = Number(value || 0);

    if (!Number.isFinite(number)) {
        return "0";
    }

    if (number >= 1_000_000) {
        return `${(number / 1_000_000).toFixed(
            number >= 10_000_000 ? 0 : 1
        )}M`;
    }

    if (number >= 1_000) {
        return `${(number / 1_000).toFixed(
            number >= 10_000 ? 0 : 1
        )}K`;
    }

    return String(number);
};

const getProblemTitle = (problem) => {
    return (
        problem?.problem ||
        problem?.title ||
        "Nomsiz muammo"
    );
};

const getProblemDescription = (problem) => {
    return (
        problem?.description ||
        "Muammo tafsilotlarini ko‘rish uchun oching."
    );
};

// =========================================================
// HERO MINI STAT
// =========================================================

const HeroStat = ({
    Icon,
    label,
    value,
    accentClass,
}) => {
    return (
        <div
            className={`
                flex
                min-w-0
                items-center
                gap-3
                rounded-2xl
                border
                px-3.5
                py-3
                ${styles.surface}
            `}
        >
            <div
                className={`
                    grid
                    h-9
                    w-9
                    shrink-0
                    place-items-center
                    rounded-xl
                    border
                    border-[#e2e8f2]
                    bg-white
                    dark:border-white/[0.06]
                    dark:bg-white/[0.025]
                    ${accentClass}
                `}
            >
                <Icon
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                />
            </div>

            <div className="min-w-0">
                <p
                    className={`
                        truncate
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.14em]
                        ${styles.eyebrow}
                    `}
                >
                    {label}
                </p>

                <p
                    className="
                        mt-0.5
                        truncate
                        text-sm
                        font-black
                        text-slate-800
                        dark:text-gray-200
                    "
                >
                    {value}
                </p>
            </div>
        </div>
    );
};

// =========================================================
// PROBLEM RADAR ITEM
// =========================================================

const ProblemRadarItem = ({
    problem,
    index,
}) => {
    const problemId = problem?.id;

    const content = (
        <div
            className="
                group/radar
                relative
                overflow-hidden
                rounded-2xl
                border
                border-[#dfe6f1]
                bg-[#f8faff]
                p-3.5
                transition-colors
                duration-150
                hover:border-cyan-400/40
                hover:bg-cyan-50/70
                dark:border-white/[0.055]
                dark:bg-white/[0.018]
                dark:hover:border-cyan-400/20
                dark:hover:bg-cyan-400/[0.035]
            "
        >
            <span
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    left-0
                    top-0
                    h-full
                    w-px
                    bg-gradient-to-b
                    from-cyan-500/60
                    via-indigo-500/20
                    to-transparent
                    opacity-0
                    transition-opacity
                    duration-150
                    group-hover/radar:opacity-100
                "
            />

            <div className="flex items-start gap-3">
                <div
                    className="
                        mt-0.5
                        grid
                        h-8
                        w-8
                        shrink-0
                        place-items-center
                        rounded-xl
                        border
                        border-cyan-400/20
                        bg-cyan-500/[0.07]
                        font-mono
                        text-[10px]
                        font-black
                        text-cyan-700
                        dark:border-cyan-400/10
                        dark:bg-cyan-400/[0.05]
                        dark:text-cyan-300
                    "
                >
                    {String(index + 1).padStart(2, "0")}
                </div>

                <div className="min-w-0 flex-1">
                    <h4
                        className="
                            line-clamp-1
                            text-[13px]
                            font-bold
                            text-slate-800
                            transition-colors
                            duration-150
                            group-hover/radar:text-indigo-700
                            dark:text-gray-200
                            dark:group-hover/radar:text-white
                        "
                    >
                        {getProblemTitle(problem)}
                    </h4>

                    <p
                        className="
                            mt-1
                            line-clamp-1
                            text-[10px]
                            leading-5
                            text-slate-500
                            dark:text-gray-600
                        "
                    >
                        {getProblemDescription(problem)}
                    </p>

                    <div
                        className="
                            mt-2.5
                            flex
                            flex-wrap
                            items-center
                            gap-x-3
                            gap-y-1
                            text-[9px]
                            font-semibold
                            text-slate-500
                            dark:text-gray-600
                        "
                    >
                        <span className="inline-flex items-center gap-1">
                            <Star
                                size={11}
                                strokeWidth={2}
                                className="
                                    text-amber-600
                                    dark:text-yellow-300
                                "
                            />
                            {formatCompactNumber(
                                problem?.total_stars
                            )}
                        </span>

                        <span className="inline-flex items-center gap-1">
                            <MessageCircle
                                size={11}
                                strokeWidth={2}
                                className="
                                    text-indigo-600
                                    dark:text-indigo-300
                                "
                            />
                            {formatCompactNumber(
                                problem?.total_responses
                            )}
                        </span>

                        <span className="inline-flex items-center gap-1">
                            <Eye
                                size={11}
                                strokeWidth={2}
                                className="
                                    text-cyan-700
                                    dark:text-cyan-300
                                "
                            />
                            {formatCompactNumber(
                                problem?.total_views
                            )}
                        </span>
                    </div>
                </div>

                <ArrowRight
                    size={15}
                    strokeWidth={2}
                    aria-hidden="true"
                    className="
                        mt-1
                        shrink-0
                        text-slate-400
                        transition-transform
                        duration-150
                        group-hover/radar:translate-x-0.5
                        dark:text-gray-700
                    "
                />
            </div>
        </div>
    );

    if (!problemId) {
        return content;
    }

    return (
        <Link
            to={`/problem/${problemId}/detail`}
            className="
                block
                rounded-2xl
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500
            "
        >
            {content}
        </Link>
    );
};

// =========================================================
// PROBLEM RADAR SKELETON
// =========================================================

const ProblemRadarSkeleton = () => {
    return (
        <div
            role="status"
            aria-label="Trenddagi muammolar yuklanmoqda"
            className="space-y-2.5"
        >
            {[0, 1, 2].map((index) => (
                <div
                    key={index}
                    className="
                        animate-pulse
                        rounded-2xl
                        border
                        border-[#e1e7f0]
                        bg-[#f8faff]
                        p-3.5
                        motion-reduce:animate-none
                        dark:border-white/[0.05]
                        dark:bg-white/[0.018]
                    "
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="
                                h-8
                                w-8
                                rounded-xl
                                bg-slate-200
                                dark:bg-white/[0.05]
                            "
                        />

                        <div className="flex-1">
                            <div
                                className="
                                    h-3.5
                                    w-3/4
                                    rounded-full
                                    bg-slate-200
                                    dark:bg-white/[0.055]
                                "
                            />

                            <div
                                className="
                                    mt-2
                                    h-2.5
                                    w-1/2
                                    rounded-full
                                    bg-slate-100
                                    dark:bg-white/[0.035]
                                "
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// =========================================================
// REWARD STEP
// =========================================================

const RewardStep = ({
    number,
    Icon,
    title,
    description,
    accentClass,
    children,
}) => {
    return (
        <div
            className="
                group/step
                relative
                overflow-hidden
                rounded-3xl
                border
                border-[#dee6f2]
                bg-white/80
                p-5
                transition-colors
                duration-150
                hover:border-indigo-300/60
                hover:bg-white
                dark:border-white/[0.06]
                dark:bg-white/[0.022]
                dark:hover:border-white/[0.11]
                dark:hover:bg-white/[0.035]
            "
        >
            <div
                className="
                    relative
                    flex
                    items-start
                    justify-between
                    gap-4
                "
            >
                <div
                    className={`
                        grid
                        h-11
                        w-11
                        place-items-center
                        rounded-2xl
                        border
                        border-[#e0e7f1]
                        bg-[#f4f7fd]
                        dark:border-white/[0.07]
                        dark:bg-white/[0.03]
                        ${accentClass}
                    `}
                >
                    {children || (
                        <Icon
                            size={20}
                            strokeWidth={1.9}
                            aria-hidden="true"
                        />
                    )}
                </div>

                <span
                    className="
                        font-mono
                        text-[9px]
                        font-black
                        tracking-[0.18em]
                        text-slate-400
                        dark:text-gray-700
                    "
                >
                    {number}
                </span>
            </div>

            <h3
                className="
                    relative
                    mt-5
                    text-lg
                    font-black
                    text-slate-900
                    dark:text-white
                "
            >
                {title}
            </h3>

            <p
                className="
                    relative
                    mt-2
                    text-sm
                    leading-6
                    text-slate-600
                    dark:text-gray-500
                "
            >
                {description}
            </p>
        </div>
    );
};

// =========================================================
// MAIN
// =========================================================

const Main = () => {
    const dispatch = useDispatch();

    // =====================================================
    // REDUX
    // =====================================================

    const {
        isLoggedIn,
        user,
    } = useSelector((state) => state.auth);

    const {
        popularProblems,
        isLoading,
    } = useSelector((state) => state.problem);

    // =====================================================
    // SAFE DATA
    // =====================================================

    const safePopularProblems = useMemo(
        () =>
            Array.isArray(popularProblems)
                ? popularProblems
                : [],
        [popularProblems]
    );

    const radarProblems = useMemo(
        () => safePopularProblems.slice(0, 3),
        [safePopularProblems]
    );

    // =====================================================
    // FETCH POPULAR PROBLEMS
    // =====================================================

    const getPopularProblems = useCallback(
        async () => {
            dispatch(getPopularProblemStart());

            try {
                const response =
                    await ProblemService.getPopularProblemsList();

                dispatch(
                    getPopularProblemSuccess(response)
                );
            } catch (error) {
                console.error(
                    "Popular problems olishda xato:",
                    error
                );
            }
        },
        [dispatch]
    );

    useEffect(() => {
        getPopularProblems();
    }, [getPopularProblems]);

    // =====================================================
    // JSX
    // =====================================================

    return (
        <main className={styles.page}>
            <div
                className="
                    mx-auto
                    grid
                    w-full
                    max-w-[1540px]
                    gap-5
                    px-4
                    py-5
                    sm:px-6
                    lg:grid-cols-[300px_minmax(0,1fr)]
                    xl:grid-cols-[310px_minmax(0,1fr)]
                    xl:px-8
                "
            >
                {/* ======================================
                    LEFT SIDEBAR
                ====================================== */}

                <HomeSidebar
                    isLoggedIn={isLoggedIn}
                    user={user}
                />

                {/* ======================================
                    MAIN CONTENT
                ====================================== */}

                <div className={styles.mainCard}>

                    {/* ==================================
                        HERO
                    ================================== */}

                    <section
                        className={`
                            relative
                            overflow-hidden
                            border-b
                            px-4
                            py-10
                            sm:px-6
                            lg:px-8
                            lg:py-12
                            xl:px-10
                            ${styles.divider}
                        `}
                    >
                        {/* BACKGROUND GRID */}

                        <div
                            aria-hidden="true"
                            className="
                                pointer-events-none
                                absolute
                                inset-0
                                opacity-[0.025]
                                text-slate-900
                                dark:opacity-[0.018]
                                dark:text-white
                                [background-image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)]
                                [background-size:38px_38px]
                            "
                        />

                        {/* GLOWS */}

                        <div
                            aria-hidden="true"
                            className="
                                pointer-events-none
                                absolute
                                -left-20
                                -top-24
                                hidden
                                h-80
                                w-80
                                rounded-full
                                bg-cyan-500/[0.08]
                                blur-[110px]
                                sm:block
                            "
                        />

                        <div
                            aria-hidden="true"
                            className="
                                pointer-events-none
                                absolute
                                right-0
                                top-0
                                hidden
                                h-96
                                w-96
                                rounded-full
                                bg-indigo-500/[0.10]
                                blur-[120px]
                                sm:block
                            "
                        />

                        <div
                            className="
                                relative
                                z-10
                                grid
                                items-center
                                gap-10
                                xl:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]
                            "
                        >
                            {/* ==========================
                                HERO LEFT
                            ========================== */}

                            <div className="min-w-0">

                                {/* STATUS */}

                                <div
                                    className="
                                        flex
                                        flex-wrap
                                        items-center
                                        gap-2
                                    "
                                >
                                    <span
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-full
                                            border
                                            border-cyan-400/25
                                            bg-cyan-400/[0.065]
                                            px-3
                                            py-1.5
                                            font-mono
                                            text-[9px]
                                            font-black
                                            uppercase
                                            tracking-[0.16em]
                                            text-cyan-700
                                            dark:border-cyan-400/20
                                            dark:text-cyan-300
                                        "
                                    >
                                        <Terminal
                                            size={13}
                                            strokeWidth={2}
                                            aria-hidden="true"
                                        />

                                        fsociety://build_together
                                    </span>

                                    <span
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-full
                                            border
                                            border-emerald-400/20
                                            bg-emerald-400/[0.05]
                                            px-3
                                            py-1.5
                                            font-mono
                                            text-[9px]
                                            font-bold
                                            uppercase
                                            tracking-[0.12em]
                                            text-emerald-700
                                            dark:border-emerald-400/10
                                            dark:bg-emerald-400/[0.03]
                                            dark:text-emerald-300
                                        "
                                    >
                                        <span
                                            className="
                                                relative
                                                flex
                                                h-1.5
                                                w-1.5
                                            "
                                        >
                                            <span
                                                className="
                                                    absolute
                                                    inline-flex
                                                    h-full
                                                    w-full
                                                    animate-ping
                                                    rounded-full
                                                    bg-emerald-400
                                                    opacity-50
                                                    motion-reduce:animate-none
                                                "
                                            />

                                            <span
                                                className="
                                                    relative
                                                    inline-flex
                                                    h-1.5
                                                    w-1.5
                                                    rounded-full
                                                    bg-emerald-500
                                                    dark:bg-emerald-400
                                                "
                                            />
                                        </span>

                                        community live
                                    </span>
                                </div>

                                {/* TITLE */}

                                <h1
                                    className={`
                                        mt-7
                                        max-w-4xl
                                        text-[42px]
                                        font-black
                                        leading-[0.98]
                                        tracking-[-0.055em]
                                        sm:text-5xl
                                        lg:text-[58px]
                                        xl:text-[64px]
                                        ${styles.title}
                                    `}
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

                                    <br />

                                    aylantiring.
                                </h1>

                                {/* DESCRIPTION */}

                                <p
                                    className={`
                                        mt-6
                                        max-w-2xl
                                        text-sm
                                        leading-7
                                        sm:text-[15px]
                                        ${styles.subtitle}
                                    `}
                                >
                                    Xatoni yolg‘iz yechmang.
                                    Savolingizni joylang,
                                    developerlar bilan fikr
                                    almashing, foydali yechim
                                    yozing va har bir hissangiz
                                    bilan F.Society ichida
                                    kuchliroq profil yarating.
                                </p>

                                {/* ACTIONS */}

                                <div
                                    className="
                                        mt-7
                                        flex
                                        flex-col
                                        gap-3
                                        sm:flex-row
                                    "
                                >
                                    <Link
                                        to="/problem-create"
                                        className="
                                            group/create
                                            inline-flex
                                            min-h-[48px]
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
                                            text-sm
                                            font-black
                                            text-white
                                            shadow-[0_12px_35px_rgba(34,211,238,0.12)]
                                            transition-transform
                                            duration-150
                                            hover:-translate-y-0.5
                                            focus-visible:outline-none
                                            focus-visible:ring-2
                                            focus-visible:ring-indigo-500
                                            dark:shadow-[0_12px_35px_rgba(34,211,238,0.15)]
                                            motion-reduce:transform-none
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
                                                duration-150
                                                group-hover/create:translate-x-0.5
                                            "
                                        />
                                    </Link>

                                    <Link
                                        to="/problems"
                                        className={`
                                            group/problems
                                            inline-flex
                                            min-h-[48px]
                                            items-center
                                            justify-center
                                            gap-2.5
                                            rounded-2xl
                                            border
                                            px-5
                                            text-sm
                                            font-black
                                            transition-colors
                                            duration-150
                                            focus-visible:outline-none
                                            focus-visible:ring-2
                                            focus-visible:ring-indigo-500
                                            ${styles.secondaryButton}
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

                                {/* HERO STATS */}

                                <div
                                    className="
                                        mt-8
                                        grid
                                        gap-2.5
                                        sm:grid-cols-3
                                    "
                                >
                                    <HeroStat
                                        Icon={Bug}
                                        label="Trending"
                                        value={`${safePopularProblems.length} ta muammo`}
                                        accentClass="text-cyan-700 dark:text-cyan-300"
                                    />

                                    <HeroStat
                                        Icon={Coins}
                                        label="Sizning FCoin"
                                        value={
                                            isLoggedIn
                                                ? `${user?.coins ?? 0} FCoin`
                                                : "Login kerak"
                                        }
                                        accentClass="text-amber-700 dark:text-yellow-300"
                                    />

                                    <HeroStat
                                        Icon={Zap}
                                        label="Platforma"
                                        value="Real-time"
                                        accentClass="text-indigo-700 dark:text-indigo-300"
                                    />
                                </div>
                            </div>

                            {/* ==========================
                                PROBLEM RADAR
                            ========================== */}

                            <div className="relative">

                                <div
                                    aria-hidden="true"
                                    className="
                                        pointer-events-none
                                        absolute
                                        -inset-10
                                        hidden
                                        rounded-full
                                        bg-cyan-500/[0.035]
                                        blur-3xl
                                        sm:block
                                    "
                                />

                                <div
                                    className="
                                        relative
                                        overflow-hidden
                                        rounded-[26px]
                                        border
                                        border-[#dce5f1]
                                        bg-white/95
                                        p-3
                                        shadow-[0_15px_45px_rgba(30,41,59,0.08)]
                                        dark:border-white/[0.07]
                                        dark:bg-[#0b1018]/95
                                        dark:shadow-[0_30px_90px_rgba(0,0,0,0.30)]
                                    "
                                >
                                    {/* RADAR HEADER */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            gap-4
                                            border-b
                                            border-[#e4eaf3]
                                            px-2
                                            pb-3
                                            dark:border-white/[0.055]
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-3
                                            "
                                        >
                                            <div
                                                className="
                                                    grid
                                                    h-9
                                                    w-9
                                                    place-items-center
                                                    rounded-xl
                                                    border
                                                    border-cyan-400/20
                                                    bg-cyan-400/[0.06]
                                                    text-cyan-700
                                                    dark:border-cyan-400/15
                                                    dark:text-cyan-300
                                                "
                                            >
                                                <Code2
                                                    size={17}
                                                    strokeWidth={2}
                                                    aria-hidden="true"
                                                />
                                            </div>

                                            <div>
                                                <p
                                                    className={`
                                                        font-mono
                                                        text-[8px]
                                                        font-black
                                                        uppercase
                                                        tracking-[0.16em]
                                                        ${styles.eyebrow}
                                                    `}
                                                >
                                                    Live problem radar
                                                </p>

                                                <h3
                                                    className="
                                                        mt-0.5
                                                        text-sm
                                                        font-black
                                                        text-slate-800
                                                        dark:text-gray-200
                                                    "
                                                >
                                                    Hozir trendda
                                                </h3>
                                            </div>
                                        </div>

                                        <span
                                            className="
                                                inline-flex
                                                items-center
                                                gap-1.5
                                                rounded-full
                                                border
                                                border-emerald-400/20
                                                bg-emerald-400/[0.05]
                                                px-2.5
                                                py-1
                                                font-mono
                                                text-[8px]
                                                font-bold
                                                uppercase
                                                tracking-[0.12em]
                                                text-emerald-700
                                                dark:border-emerald-400/10
                                                dark:bg-emerald-400/[0.03]
                                                dark:text-emerald-300
                                            "
                                        >
                                            <span
                                                className="
                                                    h-1.5
                                                    w-1.5
                                                    rounded-full
                                                    bg-emerald-500
                                                    dark:bg-emerald-400
                                                "
                                            />

                                            live
                                        </span>
                                    </div>

                                    {/* RADAR BODY */}

                                    <div className="mt-3">
                                        {isLoading ? (
                                            <ProblemRadarSkeleton />
                                        ) : radarProblems.length > 0 ? (
                                            <div className="space-y-2.5">
                                                {radarProblems.map(
                                                    (problem, index) => (
                                                        <ProblemRadarItem
                                                            key={problem?.id ?? index}
                                                            problem={problem}
                                                            index={index}
                                                        />
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            <div
                                                className="
                                                    rounded-2xl
                                                    border
                                                    border-dashed
                                                    border-[#dce4ef]
                                                    bg-[#f8faff]
                                                    px-5
                                                    py-9
                                                    text-center
                                                    dark:border-white/[0.07]
                                                    dark:bg-white/[0.018]
                                                "
                                            >
                                                <Bug
                                                    size={22}
                                                    strokeWidth={1.8}
                                                    className="
                                                        mx-auto
                                                        text-slate-400
                                                        dark:text-gray-700
                                                    "
                                                />

                                                <p
                                                    className="
                                                        mt-3
                                                        text-xs
                                                        font-bold
                                                        text-slate-600
                                                        dark:text-gray-500
                                                    "
                                                >
                                                    Hozircha trenddagi
                                                    muammo yo‘q
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* RADAR FOOTER */}

                                    <div
                                        className="
                                            mt-3
                                            flex
                                            items-center
                                            justify-between
                                            gap-3
                                            border-t
                                            border-[#e4eaf3]
                                            px-2
                                            pt-3
                                            dark:border-white/[0.05]
                                        "
                                    >
                                        <p
                                            className="
                                                font-mono
                                                text-[8px]
                                                uppercase
                                                tracking-[0.14em]
                                                text-slate-400
                                                dark:text-gray-700
                                            "
                                        >
                                            signal://community_activity
                                        </p>

                                        <Link
                                            to="/problems"
                                            className="
                                                group/radar-link
                                                inline-flex
                                                items-center
                                                gap-1.5
                                                text-[10px]
                                                font-bold
                                                text-cyan-700
                                                dark:text-cyan-300
                                            "
                                        >
                                            Barchasi

                                            <ArrowRight
                                                size={12}
                                                strokeWidth={2}
                                                aria-hidden="true"
                                                className="
                                                    transition-transform
                                                    duration-150
                                                    group-hover/radar-link:translate-x-0.5
                                                "
                                            />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ==================================
                        TRENDING PROBLEMS
                    ================================== */}

                    <section
                        id="problems"
                        className={`
                            relative
                            border-b
                            bg-[#f6f8fd]
                            px-4
                            py-16
                            sm:px-6
                            lg:px-8
                            lg:py-20
                            xl:px-10
                            dark:bg-[#0a0f16]
                            ${styles.divider}
                        `}
                    >
                        <div
                            aria-hidden="true"
                            className="
                                pointer-events-none
                                absolute
                                right-0
                                top-0
                                hidden
                                h-72
                                w-72
                                rounded-full
                                bg-indigo-500/[0.04]
                                blur-[100px]
                                sm:block
                            "
                        />

                        {/* SECTION HEADER */}

                        <div
                            className="
                                relative
                                flex
                                flex-col
                                gap-5
                                sm:flex-row
                                sm:items-end
                                sm:justify-between
                            "
                        >
                            <div>
                                <div
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        border
                                        border-orange-400/20
                                        bg-orange-400/[0.05]
                                        px-3
                                        py-1.5
                                        font-mono
                                        text-[9px]
                                        font-black
                                        uppercase
                                        tracking-[0.16em]
                                        text-orange-700
                                        dark:border-orange-400/15
                                        dark:text-orange-300
                                    "
                                >
                                    <Zap
                                        size={13}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />

                                    community://trending
                                </div>

                                <h2
                                    className={`
                                        mt-4
                                        text-3xl
                                        font-black
                                        tracking-[-0.035em]
                                        sm:text-4xl
                                        ${styles.title}
                                    `}
                                >
                                    Qaynoq{" "}

                                    <span
                                        className="
                                            text-cyan-700
                                            dark:text-cyan-300
                                        "
                                    >
                                        Muammolar
                                    </span>
                                </h2>

                                <p
                                    className={`
                                        mt-3
                                        max-w-xl
                                        text-sm
                                        leading-6
                                        ${styles.subtitle}
                                    `}
                                >
                                    Jamiyat eng ko‘p ko‘rayotgan,
                                    muhokama qilayotgan va yechim
                                    izlayotgan muammolar.
                                </p>
                            </div>

                            <Link
                                to="/problems"
                                className={`
                                    group/all
                                    inline-flex
                                    w-fit
                                    items-center
                                    gap-2
                                    rounded-xl
                                    border
                                    px-4
                                    py-2.5
                                    text-[11px]
                                    font-bold
                                    transition-colors
                                    duration-150
                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-indigo-500
                                    ${styles.secondaryButton}
                                `}
                            >
                                Barcha muammolar

                                <ArrowRight
                                    size={13}
                                    strokeWidth={2}
                                    aria-hidden="true"
                                    className="
                                        transition-transform
                                        duration-150
                                        group-hover/all:translate-x-0.5
                                    "
                                />
                            </Link>
                        </div>

                        {/* PROBLEMS */}

                        <div
                            className="
                                relative
                                mt-7
                                grid
                                grid-cols-[repeat(auto-fit,minmax(min(100%,285px),1fr))]
                                gap-4
                                items-stretch
                            "
                        >
                            {isLoading ? (

                                [0, 1, 2].map((index) => (
                                    <div
                                        key={index}
                                        className="
                                            animate-pulse
                                            rounded-3xl
                                            border
                                            border-[#dee6f1]
                                            bg-white
                                            p-5
                                            motion-reduce:animate-none
                                            dark:border-white/[0.055]
                                            dark:bg-white/[0.02]
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                gap-3
                                            "
                                        >
                                            <div
                                                className="
                                                    h-5
                                                    w-24
                                                    rounded-full
                                                    bg-slate-200
                                                    dark:bg-white/[0.055]
                                                "
                                            />

                                            <div
                                                className="
                                                    h-7
                                                    w-7
                                                    rounded-lg
                                                    bg-slate-100
                                                    dark:bg-white/[0.04]
                                                "
                                            />
                                        </div>

                                        <div
                                            className="
                                                mt-5
                                                h-5
                                                w-4/5
                                                rounded-lg
                                                bg-slate-200
                                                dark:bg-white/[0.055]
                                            "
                                        />

                                        <div
                                            className="
                                                mt-3
                                                h-3
                                                w-full
                                                rounded-full
                                                bg-slate-100
                                                dark:bg-white/[0.035]
                                            "
                                        />

                                        <div
                                            className="
                                                mt-2
                                                h-3
                                                w-3/4
                                                rounded-full
                                                bg-slate-100
                                                dark:bg-white/[0.035]
                                            "
                                        />

                                        <div
                                            className="
                                                mt-8
                                                h-9
                                                rounded-xl
                                                bg-slate-100
                                                dark:bg-white/[0.03]
                                            "
                                        />
                                    </div>
                                ))

                            ) : safePopularProblems.length > 0 ? (

                                safePopularProblems.map((problem) => (
                                    <PopularProblemCard
                                        key={problem.id}
                                        id={problem.id}
                                        user={problem.user}
                                        problem={problem.problem}
                                        description={problem.description}
                                        star={problem.total_stars}
                                        response={problem.total_responses}
                                        views={problem.total_views}
                                        language={
                                            problem.language ||
                                            problem.languages ||
                                            []
                                        }
                                        technology={
                                            problem.technology ||
                                            problem.technologies ||
                                            []
                                        }
                                        status={problem.status}
                                        createdAt={problem.created_at}
                                    />
                                ))

                            ) : (

                                <div
                                    className="
                                        col-span-full
                                        rounded-3xl
                                        border
                                        border-dashed
                                        border-[#dce4ef]
                                        bg-white
                                        px-6
                                        py-12
                                        text-center
                                        dark:border-white/[0.07]
                                        dark:bg-white/[0.018]
                                    "
                                >
                                    <Bug
                                        size={26}
                                        strokeWidth={1.8}
                                        className="
                                            mx-auto
                                            text-slate-400
                                            dark:text-gray-700
                                        "
                                    />

                                    <h3
                                        className="
                                            mt-4
                                            text-sm
                                            font-black
                                            text-slate-800
                                            dark:text-gray-300
                                        "
                                    >
                                        Hozircha qaynoq muammo yo‘q
                                    </h3>

                                    <p
                                        className="
                                            mt-2
                                            text-xs
                                            text-slate-500
                                            dark:text-gray-600
                                        "
                                    >
                                        Birinchi muammoni siz
                                        joylashingiz mumkin.
                                    </p>

                                    <Link
                                        to="/problem-create"
                                        className="
                                            mt-5
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-xl
                                            border
                                            border-cyan-400/25
                                            bg-cyan-400/[0.07]
                                            px-4
                                            py-2.5
                                            text-xs
                                            font-bold
                                            text-cyan-700
                                            dark:border-cyan-400/15
                                            dark:bg-cyan-400/[0.05]
                                            dark:text-cyan-300
                                        "
                                    >
                                        <Plus
                                            size={14}
                                            aria-hidden="true"
                                        />

                                        Muammo joylash
                                    </Link>
                                </div>

                            )}
                        </div>
                    </section>

                    {/* ==================================
                        SITE UPDATES
                    ================================== */}

                    <SiteUpdates />

                    {/* ==================================
                        REWARD SYSTEM
                    ================================== */}

                    <section
                        id="about"
                        className={`
                            relative
                            overflow-hidden
                            border-b
                            bg-white
                            px-4
                            py-16
                            sm:px-6
                            lg:px-8
                            lg:py-20
                            xl:px-10
                            dark:bg-[#070b12]
                            ${styles.divider}
                        `}
                    >
                        <div
                            aria-hidden="true"
                            className="
                                pointer-events-none
                                absolute
                                left-1/2
                                top-0
                                hidden
                                h-72
                                w-[520px]
                                -translate-x-1/2
                                -translate-y-1/2
                                rounded-full
                                bg-indigo-500/[0.06]
                                blur-[110px]
                                sm:block
                            "
                        />

                        <div className="relative">

                            {/* HEADER */}

                            <div
                                className="
                                    mx-auto
                                    max-w-3xl
                                    text-center
                                "
                            >
                                <div
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        border
                                        border-cyan-400/20
                                        bg-cyan-400/[0.05]
                                        px-3
                                        py-1.5
                                        font-mono
                                        text-[9px]
                                        font-black
                                        uppercase
                                        tracking-[0.16em]
                                        text-cyan-700
                                        dark:border-cyan-400/15
                                        dark:text-cyan-300
                                    "
                                >
                                    <Zap
                                        size={13}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />

                                    fsociety://reward_loop
                                </div>

                                <h2
                                    className={`
                                        mt-4
                                        text-3xl
                                        font-black
                                        tracking-[-0.035em]
                                        sm:text-4xl
                                        ${styles.title}
                                    `}
                                >
                                    Bilim ulashing.{" "}

                                    <span
                                        className="
                                            bg-gradient-to-r
                                            from-cyan-600
                                            via-indigo-600
                                            to-amber-600
                                            bg-clip-text
                                            text-transparent
                                            dark:from-cyan-300
                                            dark:via-indigo-300
                                            dark:to-yellow-300
                                        "
                                    >
                                        Qiymat yarating.
                                    </span>
                                </h2>

                                <p
                                    className={`
                                        mx-auto
                                        mt-3
                                        max-w-2xl
                                        text-sm
                                        leading-6
                                        ${styles.subtitle}
                                    `}
                                >
                                    F.Society’da foydali harakat
                                    shunchaki “activity” emas —
                                    u reputation, FCoin va profil
                                    kuchiga aylanadi.
                                </p>
                            </div>

                            {/* REWARD STEPS */}

                            <div
                                className="
                                    mt-9
                                    grid
                                    gap-4
                                    md:grid-cols-3
                                "
                            >
                                <RewardStep
                                    number="01"
                                    Icon={Handshake}
                                    title="Yordam bering"
                                    description="Savollarga javob yozing, yechim ulashing va boshqa developerga muammoni yopishga yordam bering."
                                    accentClass="text-cyan-700 dark:text-cyan-300"
                                />

                                <RewardStep
                                    number="02"
                                    Icon={Coins}
                                    title="FCoin yig‘ing"
                                    description="Foydali javoblar, faoliyat va platformadagi hissangiz orqali FCoin hamda reyting oling."
                                    accentClass="text-amber-700 dark:text-yellow-300"
                                >
                                    <img
                                        src={FCoinIcon}
                                        alt="FCoin"
                                        className="
                                            h-7
                                            w-7
                                            object-contain
                                            drop-shadow-[0_0_12px_rgba(234,179,8,0.25)]
                                            dark:drop-shadow-[0_0_12px_rgba(234,179,8,0.5)]
                                        "
                                    />
                                </RewardStep>

                                <RewardStep
                                    number="03"
                                    Icon={Gift}
                                    title="Profilni kuchaytiring"
                                    description="Badge, reyting, portfolio va jamiyatdagi faollik orqali developer profilingizni ajratib ko‘rsating."
                                    accentClass="text-fuchsia-700 dark:text-fuchsia-300"
                                />
                            </div>

                            {/* TRUST STRIP */}

                            <div
                                className="
                                    mt-5
                                    grid
                                    gap-2.5
                                    rounded-3xl
                                    border
                                    border-[#dee6f1]
                                    bg-[#f8faff]
                                    p-3
                                    sm:grid-cols-3
                                    dark:border-white/[0.055]
                                    dark:bg-white/[0.018]
                                "
                            >
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                        rounded-2xl
                                        px-3
                                        py-2.5
                                    "
                                >
                                    <CheckCircle2
                                        size={17}
                                        strokeWidth={2}
                                        className="
                                            text-emerald-700
                                            dark:text-emerald-300
                                        "
                                    />

                                    <div>
                                        <p
                                            className="
                                                text-[10px]
                                                font-black
                                                uppercase
                                                tracking-[0.12em]
                                                text-slate-500
                                                dark:text-gray-500
                                            "
                                        >
                                            Real contribution
                                        </p>

                                        <p
                                            className="
                                                mt-0.5
                                                text-xs
                                                font-semibold
                                                text-slate-700
                                                dark:text-gray-300
                                            "
                                        >
                                            Foydali ish qadrlanadi
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                        rounded-2xl
                                        px-3
                                        py-2.5
                                    "
                                >
                                    <ShieldCheck
                                        size={17}
                                        strokeWidth={2}
                                        className="
                                            text-indigo-700
                                            dark:text-indigo-300
                                        "
                                    />

                                    <div>
                                        <p
                                            className="
                                                text-[10px]
                                                font-black
                                                uppercase
                                                tracking-[0.12em]
                                                text-slate-500
                                                dark:text-gray-500
                                            "
                                        >
                                            Reputation
                                        </p>

                                        <p
                                            className="
                                                mt-0.5
                                                text-xs
                                                font-semibold
                                                text-slate-700
                                                dark:text-gray-300
                                            "
                                        >
                                            Profil kuchayib boradi
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                        rounded-2xl
                                        px-3
                                        py-2.5
                                    "
                                >
                                    <Clock3
                                        size={17}
                                        strokeWidth={2}
                                        className="
                                            text-cyan-700
                                            dark:text-cyan-300
                                        "
                                    />

                                    <div>
                                        <p
                                            className="
                                                text-[10px]
                                                font-black
                                                uppercase
                                                tracking-[0.12em]
                                                text-slate-500
                                                dark:text-gray-500
                                            "
                                        >
                                            Real-time
                                        </p>

                                        <p
                                            className="
                                                mt-0.5
                                                text-xs
                                                font-semibold
                                                text-slate-700
                                                dark:text-gray-300
                                            "
                                        >
                                            Yangilanishlar darhol
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ==================================
                        CTA
                    ================================== */}

                    <section
                        className={`
                            relative
                            overflow-hidden
                            border-b
                            bg-[#f4f6fc]
                            px-4
                            py-14
                            sm:px-6
                            lg:px-8
                            xl:px-10
                            dark:bg-[#090d14]
                            ${styles.divider}
                        `}
                    >
                        <div
                            aria-hidden="true"
                            className="
                                pointer-events-none
                                absolute
                                -bottom-24
                                right-0
                                hidden
                                h-80
                                w-80
                                rounded-full
                                bg-fuchsia-500/[0.055]
                                blur-[110px]
                                sm:block
                            "
                        />

                        <div
                            className="
                                relative
                                overflow-hidden
                                rounded-[28px]
                                border
                                border-indigo-400/25
                                bg-gradient-to-br
                                from-indigo-500/[0.10]
                                via-white/70
                                to-cyan-500/[0.06]
                                p-6
                                sm:p-8
                                lg:p-10
                                dark:border-indigo-400/15
                                dark:from-indigo-500/[0.09]
                                dark:via-white/[0.025]
                                dark:to-cyan-500/[0.05]
                            "
                        >
                            {/* GRID */}

                            <div
                                aria-hidden="true"
                                className="
                                    pointer-events-none
                                    absolute
                                    inset-0
                                    opacity-[0.025]
                                    text-slate-900
                                    dark:text-white
                                    [background-image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)]
                                    [background-size:28px_28px]
                                "
                            />

                            <div
                                className="
                                    relative
                                    grid
                                    gap-8
                                    lg:grid-cols-[minmax(0,1fr)_auto]
                                    lg:items-center
                                "
                            >
                                <div>
                                    <div
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-full
                                            border
                                            border-indigo-400/25
                                            bg-indigo-400/[0.06]
                                            px-3
                                            py-1.5
                                            font-mono
                                            text-[9px]
                                            font-black
                                            uppercase
                                            tracking-[0.15em]
                                            text-indigo-700
                                            dark:border-indigo-400/20
                                            dark:text-indigo-300
                                        "
                                    >
                                        <Sparkles
                                            size={13}
                                            strokeWidth={2}
                                            aria-hidden="true"
                                        />

                                        next://your_contribution
                                    </div>

                                    <h2
                                        className={`
                                            mt-4
                                            max-w-3xl
                                            text-3xl
                                            font-black
                                            tracking-[-0.04em]
                                            sm:text-4xl
                                            ${styles.title}
                                        `}
                                    >
                                        Keyingi kuchli yechim{" "}

                                        <span
                                            className="
                                                text-indigo-700
                                                dark:text-indigo-300
                                            "
                                        >
                                            sizniki bo‘lishi mumkin.
                                        </span>
                                    </h2>

                                    <p
                                        className={`
                                            mt-3
                                            max-w-2xl
                                            text-sm
                                            leading-6
                                            ${styles.subtitle}
                                        `}
                                    >
                                        Savol bering, yechim yozing,
                                        portfolio yarating va
                                        F.Society jamiyatida o‘z
                                        developer izingizni qoldiring.
                                    </p>
                                </div>

                                {/* CTA BUTTONS */}

                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-3
                                        sm:flex-row
                                        lg:flex-col
                                    "
                                >
                                    {!isLoggedIn ? (
                                        <Link
                                            to="/register"
                                            className="
                                                group/register
                                                inline-flex
                                                min-h-[48px]
                                                items-center
                                                justify-center
                                                gap-2.5
                                                rounded-2xl
                                                bg-indigo-600
                                                px-5
                                                text-sm
                                                font-black
                                                text-white
                                                transition-colors
                                                duration-150
                                                hover:bg-indigo-500
                                                focus-visible:outline-none
                                                focus-visible:ring-2
                                                focus-visible:ring-indigo-500
                                                dark:bg-white
                                                dark:text-[#111827]
                                                dark:hover:bg-gray-100
                                            "
                                        >
                                            <UserRound
                                                size={17}
                                                strokeWidth={2.2}
                                                aria-hidden="true"
                                            />

                                            Hisob ochish

                                            <ArrowRight
                                                size={14}
                                                aria-hidden="true"
                                                className="
                                                    transition-transform
                                                    duration-150
                                                    group-hover/register:translate-x-0.5
                                                "
                                            />
                                        </Link>
                                    ) : (
                                        <Link
                                            to="/problem-create"
                                            className="
                                                group/create2
                                                inline-flex
                                                min-h-[48px]
                                                items-center
                                                justify-center
                                                gap-2.5
                                                rounded-2xl
                                                bg-indigo-600
                                                px-5
                                                text-sm
                                                font-black
                                                text-white
                                                transition-colors
                                                duration-150
                                                hover:bg-indigo-500
                                                focus-visible:outline-none
                                                focus-visible:ring-2
                                                focus-visible:ring-indigo-500
                                                dark:bg-white
                                                dark:text-[#111827]
                                                dark:hover:bg-gray-100
                                            "
                                        >
                                            <Plus
                                                size={17}
                                                strokeWidth={2.2}
                                                aria-hidden="true"
                                            />

                                            Muammo joylash

                                            <ArrowRight
                                                size={14}
                                                aria-hidden="true"
                                                className="
                                                    transition-transform
                                                    duration-150
                                                    group-hover/create2:translate-x-0.5
                                                "
                                            />
                                        </Link>
                                    )}

                                    <Link
                                        to="/users"
                                        className={`
                                            inline-flex
                                            min-h-[48px]
                                            items-center
                                            justify-center
                                            gap-2.5
                                            rounded-2xl
                                            border
                                            px-5
                                            text-sm
                                            font-bold
                                            transition-colors
                                            duration-150
                                            focus-visible:outline-none
                                            focus-visible:ring-2
                                            focus-visible:ring-indigo-500
                                            ${styles.secondaryButton}
                                        `}
                                    >
                                        <UserRound
                                            size={17}
                                            strokeWidth={2}
                                            aria-hidden="true"
                                        />

                                        Community
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ==================================
                        COMMENTS
                    ================================== */}

                    <section
                        className="
                            bg-white
                            px-4
                            py-14
                            sm:px-6
                            lg:px-8
                            xl:px-10
                            dark:bg-[#070b12]
                        "
                    >
                        <div
                            className="
                                mb-7
                                flex
                                flex-col
                                gap-3
                                sm:flex-row
                                sm:items-end
                                sm:justify-between
                            "
                        >
                            <div>
                                <p
                                    className={`
                                        font-mono
                                        text-[9px]
                                        font-black
                                        uppercase
                                        tracking-[0.16em]
                                        ${styles.eyebrow}
                                    `}
                                >
                                    community://voice
                                </p>

                                <h2
                                    className={`
                                        mt-2
                                        text-2xl
                                        font-black
                                        tracking-[-0.03em]
                                        sm:text-3xl
                                        ${styles.title}
                                    `}
                                >
                                    Jamiyat nima deyapti?
                                </h2>
                            </div>

                            <div
                                className="
                                    inline-flex
                                    w-fit
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    border-[#dee6f1]
                                    bg-[#f8faff]
                                    px-3
                                    py-1.5
                                    text-[9px]
                                    font-bold
                                    uppercase
                                    tracking-[0.12em]
                                    text-slate-500
                                    dark:border-white/[0.06]
                                    dark:bg-white/[0.02]
                                    dark:text-gray-600
                                "
                            >
                                <MessageCircle
                                    size={12}
                                    aria-hidden="true"
                                />

                                feedback loop
                            </div>
                        </div>

                        <CommentSection />
                    </section>

                </div>
            </div>
        </main>
    );
};

export default Main;
