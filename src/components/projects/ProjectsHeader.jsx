
import React from "react";

import {
    Search,
    Sparkles,
    Terminal,
    X,
} from "lucide-react";

// =========================================================
// FSOCIETY — PROJECTS HEADER
//
// Features:
// - Dark / Light Mode
// - Responsive 320px+
// - Terminal-style header
// - Search input
// - Ctrl / Cmd + K shortcut hint
// - Clear search
// - Accessible label and controls
//
// Search state remains in Projects.jsx.
// =========================================================

const ProjectsHeader = ({
    searchInputRef,
    searchTerm = "",
    onSearchChange,
    onClearSearch,
}) => {
    const hasSearch = Boolean(searchTerm);

    return (
        <section
            aria-labelledby="projects-page-title"
            className="
                relative
                isolate
                min-w-0
                overflow-hidden

                rounded-[22px]
                border
                border-[#dce5f0]

                bg-white

                shadow-[0_12px_40px_rgba(30,41,59,0.055)]

                sm:rounded-[26px]

                dark:border-white/[0.07]
                dark:bg-[#0d1117]
                dark:shadow-none
            "
        >
            {/* ======================================
                TOP ACCENT
            ====================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-x-0
                    top-0
                    z-10

                    h-px

                    bg-gradient-to-r
                    from-cyan-500/60
                    via-indigo-500/35
                    to-transparent

                    dark:from-cyan-400/50
                    dark:via-indigo-400/20
                "
            />

            {/* ======================================
                TERMINAL BAR
            ====================================== */}

            <div
                className="
                    relative
                    z-10

                    flex
                    min-h-11
                    min-w-0

                    items-center
                    justify-between
                    gap-2

                    border-b
                    border-[#e3e9f2]

                    bg-[#f5f8fd]/90

                    px-4
                    py-2

                    sm:px-5

                    dark:border-white/[0.055]
                    dark:bg-[#0b0f15]
                "
            >
                {/* TERMINAL NAME */}

                <div
                    className="
                        flex
                        min-w-0
                        items-center
                        gap-2
                    "
                >
                    <Terminal
                        size={13}
                        strokeWidth={2}
                        aria-hidden="true"
                        className="
                            shrink-0
                            text-cyan-700
                            dark:text-cyan-300/70
                        "
                    />

                    <span
                        className="
                            min-w-0
                            truncate

                            font-mono
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.13em]

                            text-slate-500

                            sm:tracking-[0.18em]

                            dark:text-gray-500
                        "
                    >
                        fsociety://project_hub
                    </span>
                </div>

                {/* REGISTRY STATUS */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        gap-1.5

                        font-mono
                        text-[8px]
                        font-bold
                        uppercase
                        tracking-[0.08em]

                        text-emerald-700

                        sm:gap-2
                        sm:tracking-[0.12em]

                        dark:text-emerald-400/70
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

                            dark:bg-emerald-400
                            dark:shadow-[0_0_8px_rgba(52,211,153,0.45)]
                        "
                    />

                    <span className="hidden min-[360px]:inline">
                        live registry
                    </span>

                    <span className="min-[360px]:hidden">
                        live
                    </span>
                </div>
            </div>

            {/* ======================================
                HEADER BODY
            ====================================== */}

            <div
                className="
                    relative
                    min-w-0
                    overflow-hidden
                "
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

                        [background-image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)]
                        [background-size:34px_34px]

                        dark:opacity-[0.018]
                        dark:text-white
                    "
                />

                {/* BACKGROUND ACCENTS */}

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute
                        -left-20
                        -top-24

                        hidden
                        h-64
                        w-64

                        rounded-full

                        bg-cyan-500/[0.07]
                        blur-[85px]

                        sm:block

                        dark:bg-cyan-500/[0.05]
                    "
                />

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute
                        -right-20
                        -bottom-28

                        hidden
                        h-72
                        w-72

                        rounded-full

                        bg-indigo-500/[0.08]
                        blur-[90px]

                        sm:block

                        dark:bg-indigo-500/[0.07]
                    "
                />

                {/* ==================================
                    CONTENT GRID
                ================================== */}

                <div
                    className="
                        relative
                        z-10

                        grid
                        min-w-0
                        items-end

                        gap-6

                        p-4

                        sm:gap-7
                        sm:p-6

                        lg:grid-cols-[minmax(0,1fr)_minmax(300px,400px)]
                        lg:gap-8
                        lg:p-7

                        xl:grid-cols-[minmax(0,1fr)_430px]
                        xl:p-8
                    "
                >
                    {/* ==============================
                        TITLE / DESCRIPTION
                    ============================== */}

                    <div className="min-w-0">

                        {/* EYEBROW */}

                        <div
                            className="
                                mb-3

                                inline-flex
                                max-w-full
                                items-center
                                gap-2

                                rounded-full
                                border
                                border-cyan-400/25

                                bg-cyan-500/[0.07]

                                px-3
                                py-1.5

                                font-mono
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-[0.12em]

                                text-cyan-700

                                dark:border-cyan-400/15
                                dark:bg-cyan-400/[0.05]
                                dark:text-cyan-300
                            "
                        >
                            <Sparkles
                                size={12}
                                strokeWidth={2}
                                aria-hidden="true"
                                className="shrink-0"
                            />

                            <span className="truncate">
                                community builds
                            </span>
                        </div>

                        {/* TITLE */}

                        <h1
                            id="projects-page-title"
                            className="
                                max-w-2xl

                                text-[29px]
                                font-black
                                leading-[1.16]
                                tracking-[-0.045em]

                                text-slate-900

                                sm:text-[36px]
                                sm:leading-[1.12]

                                lg:text-[40px]

                                xl:text-[46px]

                                dark:text-gray-100
                            "
                        >
                            Koddan{" "}

                            <span
                                className="
                                    bg-gradient-to-r
                                    from-cyan-600
                                    via-indigo-600
                                    to-violet-600

                                    bg-clip-text
                                    text-transparent

                                    dark:from-cyan-300
                                    dark:via-indigo-300
                                    dark:to-cyan-300
                                "
                            >
                                real loyiha
                            </span>

                            {" "}yarating.
                        </h1>

                        {/* DESCRIPTION */}

                        <p
                            className="
                                mt-3
                                max-w-xl

                                text-[12px]
                                font-medium
                                leading-6

                                text-slate-600

                                sm:text-[13px]
                                sm:leading-7

                                dark:text-gray-400
                            "
                        >
                            Community yaratgan projectlarni
                            ko‘ring, stacklarni o‘rganing va
                            boshqa developerlar bilan hamkorlik
                            qiling.
                        </p>
                    </div>

                    {/* ==============================
                        SEARCH
                    ============================== */}

                    <div
                        role="search"
                        aria-label="Loyihalar bo‘yicha qidiruv"
                        className="
                            min-w-0
                            w-full
                        "
                    >
                        {/* SEARCH LABEL */}

                        <label
                            htmlFor="fsociety-project-search"
                            className="
                                mb-2
                                block

                                font-mono
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.13em]

                                text-slate-600

                                dark:text-gray-500
                            "
                        >
                            project.search
                        </label>

                        {/* SEARCH FIELD */}

                        <div
                            className="
                                group/search

                                flex
                                h-12
                                w-full
                                min-w-0

                                items-center
                                gap-2.5

                                rounded-xl
                                border
                                border-[#d8e2ef]

                                bg-[#f8faff]

                                px-3.5

                                transition-colors
                                duration-150

                                hover:border-indigo-400/40

                                focus-within:border-indigo-500/60
                                focus-within:bg-white
                                focus-within:ring-2
                                focus-within:ring-indigo-500/10

                                sm:h-[52px]
                                sm:gap-3
                                sm:px-4

                                dark:border-white/[0.09]
                                dark:bg-[#090c11]

                                dark:hover:border-cyan-400/25

                                dark:focus-within:border-cyan-400/40
                                dark:focus-within:bg-[#0b1018]
                                dark:focus-within:ring-cyan-400/[0.07]
                            "
                        >
                            {/* SEARCH ICON */}

                            <Search
                                size={17}
                                strokeWidth={2}
                                aria-hidden="true"
                                className="
                                    shrink-0

                                    text-slate-400

                                    transition-colors
                                    duration-150

                                    group-focus-within/search:text-indigo-600

                                    dark:text-gray-600

                                    dark:group-focus-within/search:text-cyan-300
                                "
                            />

                            {/* SEARCH INPUT */}

                            <input
                                ref={searchInputRef}

                                id="fsociety-project-search"
                                name="project-search"
                                type="text"

                                value={searchTerm}

                                onChange={onSearchChange}

                                autoComplete="off"
                                spellCheck={false}

                                aria-keyshortcuts="Control+K Meta+K"

                                placeholder="Project, stack yoki developer..."

                                className="
                                    block
                                    h-full
                                    min-w-0
                                    w-full
                                    flex-1

                                    border-0
                                    bg-transparent

                                    p-0

                                    text-[12px]
                                    font-medium

                                    text-slate-800

                                    outline-none
                                    ring-0

                                    placeholder:text-slate-400

                                    focus:outline-none
                                    focus:ring-0

                                    sm:text-[13px]

                                    dark:text-gray-200

                                    dark:placeholder:text-gray-600
                                "
                            />

                            {/* ==========================
                                CLEAR BUTTON
                            ========================== */}

                            {hasSearch ? (
                                <button
                                    type="button"

                                    onClick={onClearSearch}

                                    aria-label="Qidiruvni tozalash"
                                    title="Qidiruvni tozalash"

                                    className="
                                        grid
                                        h-8
                                        w-8
                                        shrink-0

                                        place-items-center

                                        rounded-lg
                                        border
                                        border-transparent

                                        text-slate-500

                                        transition-colors
                                        duration-150

                                        hover:border-red-400/20
                                        hover:bg-red-500/[0.07]
                                        hover:text-red-600

                                        focus-visible:outline-none
                                        focus-visible:ring-2
                                        focus-visible:ring-indigo-500

                                        dark:text-gray-500
                                        dark:hover:border-red-400/20
                                        dark:hover:bg-red-500/[0.07]
                                        dark:hover:text-red-300
                                    "
                                >
                                    <X
                                        size={15}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />
                                </button>
                            ) : (
                                /* SHORTCUT HINT */

                                <span
                                    aria-hidden="true"

                                    className="
                                        hidden
                                        shrink-0

                                        items-center
                                        gap-1

                                        rounded-md
                                        border
                                        border-[#dce5f0]

                                        bg-white/90

                                        px-2
                                        py-1

                                        font-mono
                                        text-[9px]
                                        font-bold

                                        text-slate-500

                                        sm:inline-flex

                                        dark:border-white/[0.07]
                                        dark:bg-white/[0.035]
                                        dark:text-gray-600
                                    "
                                >
                                    Ctrl K
                                </span>
                            )}
                        </div>

                        {/* SEARCH DESCRIPTION */}

                        <p
                            className="
                                mt-2.5

                                text-[10px]
                                font-medium
                                leading-5

                                text-slate-500

                                dark:text-gray-600
                            "
                        >
                            Loyihalar, texnologiyalar va
                            developerlar bo‘yicha qidiring.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default React.memo(ProjectsHeader);
