
import React, { useId } from "react";

import {
    ArrowDownAZ,
    ChevronDown,
} from "lucide-react";

import {
    PROBLEM_ORDERING_OPTIONS,
} from "./problemPageHelpers";

// =========================================================
// FSOCIETY — PROBLEMS SORT
//
// Controlled sort selector.
//
// Props preserved:
// - value
// - onChange
// - disabled
//
// Ordering values come from problemPageHelpers.
// =========================================================

const ProblemsSort = ({
    value = "newest",
    onChange,
    disabled = false,
}) => {
    // =====================================================
    // ACCESSIBILITY
    // =====================================================

    const selectId = useId();

    // =====================================================
    // OPTIONS
    // =====================================================

    const options = Array.isArray(
        PROBLEM_ORDERING_OPTIONS
    )
        ? PROBLEM_ORDERING_OPTIONS.filter(
            (item) =>
                item &&
                item.value != null &&
                String(item.value) !== ""
        )
        : [];

    // =====================================================
    // SAFE VALUE
    // =====================================================

    const normalizedValue = String(
        value ?? ""
    );

    const valueExists = options.some(
        (item) =>
            String(item.value) === normalizedValue
    );

    const safeValue = valueExists
        ? normalizedValue
        : String(
            options[0]?.value ?? "newest"
        );

    const isDisabled =
        Boolean(disabled) ||
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
            {/* LABEL */}

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
                    Saralash
                </label>

                <ArrowDownAZ
                    size={14}
                    strokeWidth={1.9}
                    aria-hidden="true"

                    className="
                        shrink-0

                        text-indigo-600

                        dark:text-indigo-400
                    "
                />
            </div>

            {/* SELECT */}

            <div className="relative min-w-0">
                <select
                    id={selectId}

                    value={safeValue}
                    onChange={handleChange}

                    disabled={isDisabled}

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

                        hover:border-indigo-400/40

                        focus:border-indigo-500/50
                        focus:bg-white

                        focus:ring-4
                        focus:ring-indigo-500/[0.08]

                        disabled:cursor-not-allowed
                        disabled:opacity-50

                        dark:border-white/[0.09]
                        dark:bg-[#0a0f18]

                        dark:text-gray-200
                        dark:[color-scheme:dark]

                        dark:hover:border-indigo-400/25

                        dark:focus:border-indigo-400/40
                        dark:focus:bg-[#0d1320]
                        dark:focus:ring-indigo-400/[0.07]
                    "
                >
                    {options.length === 0 ? (
                        <option value="newest">
                            Eng yangilari
                        </option>
                    ) : (
                        options.map((item) => (
                            <option
                                key={String(item.value)}
                                value={String(item.value)}
                            >
                                {item.label || item.value}
                            </option>
                        ))
                    )}
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
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(ProblemsSort);
