
/**
 * FSociety — Home Page Shared Styles
 *
 * Light Mode: default
 * Dark Mode: html.dark
 *
 * Keep Tailwind utility classes as literal strings.
 */

export const homeStyles = Object.freeze({
    page: `
        relative
        isolate
        min-h-screen
        w-full
        min-w-0
        overflow-x-hidden
        bg-[#edf4ff]
        text-slate-900
        dark:bg-[#060b15]
        dark:text-white
    `,

    mainCard: `
        relative
        min-w-0
        overflow-hidden
        rounded-[26px]
        border
        border-[#d9e2ef]
        bg-white/95
        shadow-[0_18px_70px_rgba(30,41,59,0.08)]
        backdrop-blur-sm
        sm:rounded-[30px]
        dark:border-white/[0.08]
        dark:bg-[#070b12]/95
        dark:shadow-[0_28px_100px_rgba(0,0,0,0.22)]
    `,

    divider: `
        border-[#e1e7f1]
        dark:border-white/[0.08]
    `,

    title: `
        text-slate-900
        dark:text-white
    `,

    subtitle: `
        text-slate-600
        dark:text-slate-400
    `,

    eyebrow: `
        text-slate-500
        dark:text-slate-400
    `,

    surface: `
        border-[#dce4ef]
        bg-[#f8faff]
        dark:border-white/[0.08]
        dark:bg-white/[0.035]
    `,

    secondaryButton: `
        border-[#d8e1ef]
        bg-white/85
        text-slate-700
        hover:border-indigo-400/40
        hover:bg-indigo-50
        hover:text-indigo-700
        dark:border-white/[0.10]
        dark:bg-white/[0.04]
        dark:text-slate-200
        dark:hover:border-indigo-400/30
        dark:hover:bg-indigo-400/[0.08]
        dark:hover:text-white
    `,

    sectionPadding: `
        px-4
        py-14
        sm:px-6
        lg:px-8
        lg:py-20
        xl:px-10
    `,

    badge: `
        inline-flex
        max-w-full
        items-center
        gap-2
        rounded-full
        border
        px-3
        py-1.5
        font-mono
        text-[10px]
        font-black
        uppercase
        tracking-[0.12em]
    `,
});

export default homeStyles;
