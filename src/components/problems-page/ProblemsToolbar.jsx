
import React, {
    useId,
    useState,
} from "react";

import { Link } from "react-router-dom";

import {
    Plus,
    RotateCcw,
    SlidersHorizontal,
} from "lucide-react";

// =========================================================
// EXISTING CHILD COMPONENTS
// =========================================================

import ProblemsSearch from "./ProblemsSearch";
import ProblemsFilters from "./ProblemsFilters";
import ProblemsSort from "./ProblemsSort";

// =========================================================
// FSOCIETY — PROBLEMS TOOLBAR
//
// Features:
// - Search
// - Status / urgent / language / technology filters
// - Sorting
// - Reset filters
// - Create problem link
// - Expandable filter panel
// - Dark / Light Mode
// - Responsive layout
// - Accessible filter toggle
//
// Props and callbacks preserved.
// No direct API requests.
// =========================================================

// =========================================================
// INITIAL FILTER VISIBILITY
//
// Desktop: open
// Mobile / tablet: collapsed
//
// This is UI-only state.
// Filter values remain controlled by the parent.
// =========================================================

const getInitialFiltersVisibility = () => {
    if (
        typeof window === "undefined" ||
        typeof window.matchMedia !== "function"
    ) {
        return true;
    }

    return window
        .matchMedia("(min-width: 1024px)")
        .matches;
};

// =========================================================
// MAIN COMPONENT
// =========================================================

const ProblemsToolbar = ({
    // =====================================================
    // SEARCH
    // =====================================================

    searchValue = "",
    onSearchChange,
    onSearchClear,
    isSearching = false,

    // =====================================================
    // FILTER VALUES
    // =====================================================

    status = "all",
    urgent = "all",

    language = "",
    technology = "",

    ordering = "newest",

    // =====================================================
    // CATALOG DATA
    // =====================================================

    languages = [],
    technologies = [],

    languagesIsLoading = false,
    technologiesIsLoading = false,

    // =====================================================
    // FILTER HANDLERS
    // =====================================================

    onStatusChange,
    onUrgentChange,

    onLanguageChange,
    onTechnologyChange,

    onOrderingChange,

    // =====================================================
    // RESET
    // =====================================================

    hasActiveFilters = false,
    onResetFilters,

    // =====================================================
    // CREATE
    // =====================================================

    createHref = "/problem-create",
}) => {
    // =====================================================
    // ACCESSIBILITY
    // =====================================================

    const filterPanelId = useId();

    // =====================================================
    // LOCAL UI STATE
    // =====================================================

    const [
        showFilters,
        setShowFilters,
    ] = useState(
        getInitialFiltersVisibility
    );

    // =====================================================
    // DERIVED VALUES
    // =====================================================

    const activeFilters =
        Boolean(hasActiveFilters);

    const canReset =
        activeFilters &&
        typeof onResetFilters === "function";

    // =====================================================
    // FILTER TOGGLE
    // =====================================================

    const handleToggleFilters = () => {
        setShowFilters((previous) => !previous);
    };

    // =====================================================
    // RESET FILTERS
    // =====================================================

    const handleResetFilters = () => {
        if (!canReset) {
            return;
        }

        onResetFilters();
    };

    // =====================================================
    // JSX
    // =====================================================

    return (
        <section
            aria-label="Muammolarni qidirish va saralash"

            className="
                relative

                mx-auto
                my-7

                w-full
                max-w-6xl
                min-w-0

                sm:my-9
                lg:my-10
            "
        >
            {/* ==========================================
                BACKGROUND GLOW
            ========================================== */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    -inset-3

                    rounded-[2rem]

                    bg-gradient-to-r
                    from-indigo-500/[0.05]
                    via-purple-500/[0.025]
                    to-cyan-500/[0.05]

                    blur-2xl

                    sm:-inset-4

                    dark:from-indigo-500/[0.10]
                    dark:via-purple-500/[0.04]
                    dark:to-cyan-500/[0.10]
                "
            />

            {/* ==========================================
                MAIN PANEL
            ========================================== */}

            <div
                className="
                    relative

                    w-full
                    min-w-0

                    overflow-hidden

                    rounded-[22px]

                    border
                    border-slate-200

                    bg-white/95

                    p-3

                    shadow-[0_12px_40px_rgba(15,23,42,0.055)]

                    backdrop-blur-xl

                    sm:rounded-3xl
                    sm:p-4

                    dark:border-white/[0.08]
                    dark:bg-[#090e18]/95

                    dark:shadow-[0_20px_60px_rgba(0,0,0,0.25)]
                "
            >
                {/* ======================================
                    TOP ROW
                ====================================== */}

                <div
                    className="
                        flex
                        w-full
                        min-w-0

                        flex-col
                        gap-3

                        lg:flex-row
                        lg:items-center
                    "
                >
                    {/* ==================================
                        SEARCH
                    ================================== */}

                    <div
                        className="
                            w-full
                            min-w-0
                            flex-1
                        "
                    >
                        <ProblemsSearch
                            value={searchValue}

                            onChange={
                                onSearchChange
                            }

                            onClear={
                                onSearchClear
                            }

                            isLoading={
                                isSearching
                            }
                        />
                    </div>

                    {/* ==================================
                        ACTION BUTTONS
                    ================================== */}

                    <div
                        className="
                            flex
                            w-full
                            min-w-0

                            items-stretch
                            gap-2

                            sm:gap-3

                            lg:w-auto
                            lg:shrink-0
                        "
                    >
                        {/* ==============================
                            FILTER TOGGLE
                        ============================== */}

                        <button
                            type="button"

                            onClick={
                                handleToggleFilters
                            }

                            aria-expanded={
                                showFilters
                            }

                            aria-controls={
                                filterPanelId
                            }

                            className={`
                                relative

                                inline-flex
                                h-11
                                min-w-0
                                flex-1

                                items-center
                                justify-center
                                gap-2

                                rounded-xl
                                border

                                px-3

                                font-display
                                text-xs
                                font-bold

                                transition-colors
                                duration-150

                                active:scale-[0.98]

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-indigo-500

                                sm:h-12
                                sm:rounded-2xl
                                sm:px-4

                                lg:flex-none

                                motion-reduce:transform-none

                                ${
                                    showFilters
                                        ? `
                                            border-indigo-400/40

                                            bg-indigo-500/[0.09]

                                            text-indigo-700

                                            dark:border-indigo-400/25

                                            dark:bg-indigo-500/[0.08]

                                            dark:text-indigo-200
                                        `
                                        : `
                                            border-slate-200

                                            bg-slate-50

                                            text-slate-700

                                            hover:border-indigo-400/40
                                            hover:bg-indigo-500/[0.05]
                                            hover:text-indigo-700

                                            dark:border-white/[0.09]
                                            dark:bg-white/[0.035]
                                            dark:text-gray-300

                                            dark:hover:border-indigo-400/25
                                            dark:hover:bg-indigo-500/[0.07]
                                            dark:hover:text-indigo-200
                                        `
                                }
                            `}
                        >
                            <SlidersHorizontal
                                size={16}
                                strokeWidth={1.9}
                                aria-hidden="true"

                                className="shrink-0"
                            />

                            <span>
                                Filtrlar
                            </span>

                            {/* ACTIVE FILTER INDICATOR */}

                            {activeFilters && (
                                <span
                                    aria-hidden="true"

                                    className="
                                        h-2
                                        w-2
                                        shrink-0

                                        rounded-full

                                        bg-cyan-500

                                        shadow-[0_0_8px_rgba(6,182,212,0.35)]

                                        dark:bg-cyan-400
                                        dark:shadow-[0_0_8px_rgba(34,211,238,0.65)]
                                    "
                                />
                            )}
                        </button>

                        {/* ==============================
                            CREATE PROBLEM
                        ============================== */}

                        <Link
                            to={createHref}

                            className="
                                relative

                                inline-flex
                                h-11
                                min-w-0
                                flex-1

                                items-center
                                justify-center
                                gap-2

                                overflow-hidden

                                rounded-xl
                                border
                                border-indigo-500/30

                                bg-gradient-to-r
                                from-indigo-600
                                to-purple-600

                                px-3

                                font-display
                                text-xs
                                font-black

                                text-white

                                shadow-md
                                shadow-indigo-500/15

                                transition-all
                                duration-200

                                hover:from-indigo-500
                                hover:to-purple-500

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-indigo-500
                                focus-visible:ring-offset-2

                                active:scale-[0.98]

                                sm:h-12
                                sm:rounded-2xl
                                sm:px-5

                                lg:flex-none

                                dark:border-indigo-400/30
                                dark:shadow-indigo-950/30

                                dark:focus-visible:ring-offset-[#090e18]

                                motion-reduce:transform-none
                            "
                        >
                            <Plus
                                size={17}
                                strokeWidth={2}
                                aria-hidden="true"

                                className="shrink-0"
                            />

                            <span
                                className="
                                    min-w-0
                                    text-center
                                    leading-5
                                "
                            >
                                Yangi Muammo
                            </span>
                        </Link>
                    </div>
                </div>

                {/* ======================================
                    FILTER PANEL

                    Kept in DOM even when hidden:
                    aria-controls always points to an
                    existing element.
                ====================================== */}

                <div
                    id={filterPanelId}

                    role="region"
                    aria-label="Muammo filtrlari"

                    hidden={!showFilters}

                    className="
                        mt-4

                        min-w-0

                        border-t
                        border-slate-200

                        pt-4

                        dark:border-white/[0.08]
                    "
                >
                    {/* ==================================
                        FILTER GRID

                        Existing ProblemsFilters and
                        ProblemsSort contracts preserved.
                    ================================== */}

                    <div
                        className="
                            grid
                            w-full
                            min-w-0

                            grid-cols-1
                            gap-3

                            sm:grid-cols-2

                            lg:grid-cols-5
                        "
                    >
                        <ProblemsFilters
                            status={status}
                            urgent={urgent}

                            language={language}
                            technology={technology}

                            languages={languages}
                            technologies={technologies}

                            languagesIsLoading={
                                languagesIsLoading
                            }

                            technologiesIsLoading={
                                technologiesIsLoading
                            }

                            onStatusChange={
                                onStatusChange
                            }

                            onUrgentChange={
                                onUrgentChange
                            }

                            onLanguageChange={
                                onLanguageChange
                            }

                            onTechnologyChange={
                                onTechnologyChange
                            }
                        />

                        <ProblemsSort
                            value={ordering}
                            onChange={
                                onOrderingChange
                            }
                        />
                    </div>

                    {/* ==================================
                        FILTER FOOTER
                    ================================== */}

                    <div
                        className="
                            mt-4

                            flex
                            min-w-0

                            flex-col
                            gap-3

                            border-t
                            border-slate-100

                            pt-3

                            sm:flex-row
                            sm:items-center
                            sm:justify-between

                            dark:border-white/[0.05]
                        "
                    >
                        {/* DESCRIPTION */}

                        <p
                            className="
                                max-w-2xl

                                text-[11px]
                                font-medium
                                leading-5

                                text-slate-500

                                dark:text-gray-400
                            "
                        >
                            Muammo nomi, foydalanuvchi,
                            dasturlash tili va texnologiya
                            bo‘yicha qidirish mumkin.
                        </p>

                        {/* RESET FILTERS */}

                        {activeFilters && (
                            <button
                                type="button"

                                onClick={
                                    handleResetFilters
                                }

                                disabled={
                                    !canReset
                                }

                                className="
                                    inline-flex
                                    min-h-10
                                    shrink-0

                                    items-center
                                    justify-center
                                    gap-2

                                    self-start

                                    rounded-xl

                                    border
                                    border-slate-200

                                    bg-slate-50

                                    px-3
                                    py-2

                                    text-[11px]
                                    font-bold

                                    text-slate-600

                                    transition-colors

                                    hover:border-red-400/40
                                    hover:bg-red-500/[0.05]
                                    hover:text-red-700

                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-red-500

                                    disabled:cursor-not-allowed
                                    disabled:opacity-50

                                    sm:self-auto

                                    dark:border-white/[0.09]
                                    dark:bg-white/[0.035]
                                    dark:text-gray-400

                                    dark:hover:border-red-400/25
                                    dark:hover:bg-red-500/[0.07]
                                    dark:hover:text-red-300
                                "
                            >
                                <RotateCcw
                                    size={14}
                                    strokeWidth={1.9}
                                    aria-hidden="true"
                                />

                                Filtrlarni tozalash
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(ProblemsToolbar);
