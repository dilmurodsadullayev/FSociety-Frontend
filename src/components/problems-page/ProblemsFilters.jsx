
import React, { useId } from "react";

import {
    ChevronDown,
    Loader2,
} from "lucide-react";

// =========================================================
// FSOCIETY — PROBLEMS FILTERS
//
// Filters:
// - Problem status
// - Urgent / normal problems
// - Programming language
// - Technology
//
// Features:
// - Dark / Light Mode
// - Native accessible selects
// - Responsive grid compatibility
// - Loading states
// - Controlled values
// - Existing API values preserved
//
// No Redux.
// No direct API requests.
// =========================================================

// =========================================================
// SHARED FILTER SELECT
// =========================================================

const FilterSelect = React.memo(({
    label,
    value = "",
    onChange,
    children,
    disabled = false,
    isLoading = false,
}) => {
    // =====================================================
    // ACCESSIBILITY
    // =====================================================

    const selectId = useId();

    // =====================================================
    // VALUES
    // =====================================================

    const loading = Boolean(isLoading);

    const isDisabled =
        Boolean(disabled) ||
        loading ||
        typeof onChange !== "function";

    // =====================================================
    // CHANGE
    // =====================================================

    const handleChange = (event) => {
        if (isDisabled) {
            return;
        }

        onChange(event.target.value);
    };

    // =====================================================
    // JSX
    // =====================================================

    return (
        <div className="w-full min-w-0">
            {/* ======================================
                LABEL
            ====================================== */}

            <div
                className="
                    mb-2

                    flex
                    min-h-[18px]

                    items-center
                    justify-between
                    gap-2
                "
            >
                <label
                    htmlFor={selectId}

                    className="
                        font-display
                        text-[10px]
                        font-black
                        uppercase
                        tracking-[0.10em]

                        text-slate-600

                        dark:text-gray-400
                    "
                >
                    {label}
                </label>

                {/* LOADING LABEL */}

                {loading && (
                    <span
                        role="status"

                        className="
                            inline-flex
                            items-center
                            gap-1

                            font-mono
                            text-[9px]
                            font-semibold

                            text-cyan-700

                            dark:text-cyan-400
                        "
                    >
                        <Loader2
                            size={12}
                            aria-hidden="true"

                            className="
                                animate-spin
                                motion-reduce:animate-none
                            "
                        />

                        Yuklanmoqda
                    </span>
                )}
            </div>

            {/* ======================================
                SELECT
            ====================================== */}

            <div className="relative min-w-0">
                <select
                    id={selectId}

                    value={String(value ?? "")}
                    onChange={handleChange}

                    disabled={isDisabled}
                    aria-busy={loading}

                    className="
                        block

                        h-11
                        w-full
                        min-w-0

                        appearance-none

                        cursor-pointer

                        rounded-xl

                        border
                        border-slate-200

                        bg-slate-50

                        pl-3
                        pr-10

                        font-sans
                        text-xs
                        font-bold

                        text-slate-800

                        outline-none

                        transition-colors
                        duration-150

                        hover:border-cyan-400/40

                        focus:border-cyan-500/50
                        focus:bg-white

                        focus:ring-4
                        focus:ring-cyan-500/[0.08]

                        disabled:cursor-not-allowed
                        disabled:opacity-50

                        dark:border-white/[0.09]
                        dark:bg-[#0a0f18]

                        dark:text-gray-200
                        dark:[color-scheme:dark]

                        dark:hover:border-cyan-400/25

                        dark:focus:border-cyan-400/40
                        dark:focus:bg-[#0d1320]
                        dark:focus:ring-cyan-400/[0.07]
                    "
                >
                    {children}
                </select>

                {/* DROPDOWN ARROW */}

                <ChevronDown
                    size={16}
                    strokeWidth={1.9}
                    aria-hidden="true"

                    className="
                        pointer-events-none

                        absolute
                        right-3
                        top-1/2

                        -translate-y-1/2

                        text-slate-500

                        dark:text-gray-400
                    "
                />
            </div>
        </div>
    );
});

// =========================================================
// MAIN FILTERS COMPONENT
// =========================================================

const ProblemsFilters = ({
    // =====================================================
    // SELECTED VALUES
    // =====================================================

    status = "all",
    urgent = "all",

    language = "",
    technology = "",

    // =====================================================
    // CATALOG DATA
    // =====================================================

    languages = [],
    technologies = [],

    languagesIsLoading = false,
    technologiesIsLoading = false,

    // =====================================================
    // CALLBACKS
    // =====================================================

    onStatusChange,
    onUrgentChange,

    onLanguageChange,
    onTechnologyChange,
}) => {
    // =====================================================
    // SAFE ARRAYS
    // =====================================================

    const safeLanguages = Array.isArray(languages)
        ? languages
        : [];

    const safeTechnologies = Array.isArray(technologies)
        ? technologies
        : [];

    // =====================================================
    // JSX
    //
    // "contents" is important:
    // the four selects become direct layout items
    // in ProblemsToolbar's parent grid.
    // =====================================================

    return (
        <div className="contents">
            {/* ======================================
                STATUS
            ====================================== */}

            <FilterSelect
                label="Holat"

                value={status}

                onChange={
                    onStatusChange
                }
            >
                <option value="all">
                    Barcha holatlar
                </option>

                <option value="pending">
                    Jarayonda
                </option>

                <option value="solved">
                    Yechilgan
                </option>

                <option value="rejected">
                    Rad etilgan
                </option>
            </FilterSelect>

            {/* ======================================
                URGENT
            ====================================== */}

            <FilterSelect
                label="Turi"

                value={urgent}

                onChange={
                    onUrgentChange
                }
            >
                <option value="all">
                    Barcha muammolar
                </option>

                <option value="true">
                    Faqat tezkor
                </option>

                <option value="false">
                    Oddiy muammolar
                </option>
            </FilterSelect>

            {/* ======================================
                PROGRAMMING LANGUAGE
            ====================================== */}

            <FilterSelect
                label="Dasturlash tili"

                value={language}

                isLoading={
                    languagesIsLoading
                }

                onChange={
                    onLanguageChange
                }
            >
                <option value="">
                    Barcha tillar
                </option>

                {safeLanguages.map((item) => {
                    if (
                        !item ||
                        item.id == null ||
                        String(item.id).trim() === ""
                    ) {
                        return null;
                    }

                    const id = String(item.id);

                    return (
                        <option
                            key={id}
                            value={id}
                        >
                            {item.name || `Til #${id}`}
                        </option>
                    );
                })}
            </FilterSelect>

            {/* ======================================
                TECHNOLOGY
            ====================================== */}

            <FilterSelect
                label="Texnologiya"

                value={technology}

                isLoading={
                    technologiesIsLoading
                }

                onChange={
                    onTechnologyChange
                }
            >
                <option value="">
                    Barcha texnologiyalar
                </option>

                {safeTechnologies.map((item) => {
                    if (
                        !item ||
                        item.id == null ||
                        String(item.id).trim() === ""
                    ) {
                        return null;
                    }

                    const id = String(item.id);

                    return (
                        <option
                            key={id}
                            value={id}
                        >
                            {
                                item.name ||
                                `Technology #${id}`
                            }
                        </option>
                    );
                })}
            </FilterSelect>
        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(ProblemsFilters);
