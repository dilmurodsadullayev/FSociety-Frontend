export const achievementSurface = "min-w-0 rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-[0_12px_35px_rgba(15,23,42,0.05)] dark:border-white/[0.09] dark:bg-[#0b111b] dark:text-slate-100";
export const achievementButton = "inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:border-cyan-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 motion-reduce:transition-none dark:border-white/15 dark:text-slate-200";
export const achievementActionButton = "group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-cyan-300 bg-gradient-to-r from-cyan-50 to-sky-50 px-3 py-3 text-sm font-bold text-cyan-900 shadow-sm transition duration-200 hover:border-cyan-400 hover:shadow-[0_4px_20px_rgba(6,182,212,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 motion-reduce:transition-none dark:border-cyan-400/25 dark:from-cyan-500/10 dark:to-sky-500/10 dark:text-cyan-200 dark:hover:border-cyan-400/50 dark:focus-visible:ring-offset-[#0b111b]";

// Tracks follow the available profile content width, including its sidebar.
export const achievementGrid = "grid min-w-0 auto-rows-fr grid-cols-[repeat(auto-fill,minmax(min(100%,15rem),1fr))] gap-4";
export const achievementCardBody = "flex min-w-0 flex-1 flex-col p-4 sm:p-5";
export const recentAchievementRow = "group flex min-h-[92px] min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3 transition-colors duration-200 hover:border-cyan-300 hover:bg-cyan-50/50 motion-reduce:transition-none dark:border-white/[0.07] dark:bg-[#101925] dark:hover:border-cyan-400/25 dark:hover:bg-[#12202d]";

export const showcaseSizes = {
    card: {
        frame: "h-[152px] sm:h-44 lg:h-48 xl:h-52",
        image: "h-[120px] w-full max-w-[180px] sm:h-36 sm:max-w-[216px] lg:h-40 lg:max-w-[240px] xl:h-44 xl:max-w-[264px]",
    },
    modal: {
        frame: "h-[236px] sm:h-[268px]",
        image: "h-[180px] w-full max-w-[270px] sm:h-[216px] sm:max-w-[324px]",
    },
    recent: {
        frame: "h-14 w-14 shrink-0 sm:h-16 sm:w-16",
        image: "h-full w-full",
    },
};

const neutral = {
    border: "border-slate-200 dark:border-white/10",
    color: "text-slate-600 dark:text-slate-300",
    chip: "bg-slate-100 dark:bg-white/5",
    spotlight: "bg-slate-300/50 dark:bg-slate-400/15",
    hover: "hover:border-slate-300 hover:shadow-[0_14px_36px_rgba(15,23,42,0.1)] dark:hover:border-slate-500/60 dark:hover:shadow-[0_14px_36px_rgba(0,0,0,0.3)]",
    highlight: "via-slate-300/80 dark:via-slate-500/60",
};

export const rarityStyles = {
    common: neutral,
    rare: {
        border: "border-cyan-200 dark:border-cyan-500/30",
        color: "text-cyan-800 dark:text-cyan-300",
        chip: "bg-cyan-50 dark:bg-cyan-500/10",
        spotlight: "bg-cyan-300/40 dark:bg-cyan-400/20",
        hover: "hover:border-cyan-400 hover:shadow-[0_14px_36px_rgba(6,182,212,0.15)] dark:hover:border-cyan-400/60",
        highlight: "via-cyan-400/80 dark:via-cyan-300/70",
    },
    epic: {
        border: "border-violet-200 dark:border-violet-500/35",
        color: "text-violet-800 dark:text-violet-300",
        chip: "bg-violet-50 dark:bg-violet-500/10",
        spotlight: "bg-gradient-to-br from-violet-300/50 to-fuchsia-300/20 dark:from-violet-400/25 dark:to-fuchsia-400/10",
        hover: "hover:border-violet-400 hover:shadow-[0_14px_36px_rgba(139,92,246,0.18)] dark:hover:border-violet-400/65",
        highlight: "via-violet-400/80 dark:via-fuchsia-300/70",
    },
    legendary: {
        border: "border-amber-200 dark:border-amber-400/35",
        color: "text-amber-900 dark:text-amber-300",
        chip: "bg-amber-50 dark:bg-amber-500/10",
        spotlight: "bg-gradient-to-br from-amber-300/50 to-yellow-200/30 dark:from-amber-400/25 dark:to-yellow-300/10",
        hover: "hover:border-amber-400 hover:shadow-[0_14px_40px_rgba(245,158,11,0.2)] dark:hover:border-amber-300/70",
        highlight: "via-amber-400 dark:via-amber-200/80",
    },
};

export const getAchievementStyle = rarity => rarityStyles[rarity] || neutral;

// Presentation corrections for the existing, inspected PNGs. Their meaningful
// alpha bounds occupy much less than the canvas; unknown assets stay untouched.
// Values leave room for the 5% hover scale and preserve the visible badge/text.
export const badgeImagePresentation = {
    "FirstProblem_HcicgPR.png": { scale: 1.4, offsetY: "6%", recentScale: 1.8, recentOffsetY: "4%" },
    "FiveProblem.png": { scale: 1.25, offsetY: "4%", recentScale: 1.7, recentOffsetY: "3%" },
    "FirstSolution.png": { scale: 1.35, offsetY: "7%", recentScale: 1.35, recentOffsetY: "7%" },
};
