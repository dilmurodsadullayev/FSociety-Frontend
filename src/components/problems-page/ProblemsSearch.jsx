
import React, { useRef } from "react";

import {
    Loader2,
    Search,
    X,
} from "lucide-react";

// =========================================================
// FSOCIETY — PROBLEMS SEARCH
//
// Controlled search input.
// Search debounce remains in the parent/controller.
//
// Props preserved:
// - value
// - onChange
// - onClear
// - isLoading
// - placeholder
// =========================================================

const ProblemsSearch = ({
    value = "",
    onChange,
    onClear,
    isLoading = false,
    placeholder = "Muammo, Python, React, Django...",
}) => {
    // =====================================================
    // REF
    // =====================================================

    const inputRef = useRef(null);

    // =====================================================
    // VALUES
    // =====================================================

    const searchValue = String(value ?? "");

    const hasValue = searchValue.length > 0;

    const loading = Boolean(isLoading);

    const canClear =
        typeof onClear === "function" ||
        typeof onChange === "function";

    // =====================================================
    // CHANGE
    // =====================================================

    const handleChange = (event) => {
        if (typeof onChange === "function") {
            onChange(event.target.value);
        }
    };

    // =====================================================
    // CLEAR
    // =====================================================

    const handleClear = () => {
        if (!canClear) {
            return;
        }

        if (typeof onClear === "function") {
            onClear();
        } else {
            onChange("");
        }

        // Keep keyboard focus in the search field.
        inputRef.current?.focus();
    };

    // =====================================================
    // JSX
    // =====================================================

    return (
        <div
            role="search"
            aria-label="Muammolar bo‘yicha qidiruv"
            aria-busy={loading}

            className="
                group/search

                relative

                w-full
                min-w-0
                flex-1
            "
        >
            {/* SEARCH ICON */}

            <Search
                size={18}
                strokeWidth={1.9}
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    left-4
                    top-1/2

                    z-10

                    -translate-y-1/2

                    text-slate-400

                    transition-colors

                    group-focus-within/search:text-cyan-600

                    dark:text-gray-500
                    dark:group-focus-within/search:text-cyan-400
                "
            />

            {/* SEARCH INPUT */}

            <input
                ref={inputRef}

                type="search"

                value={searchValue}
                onChange={handleChange}

                placeholder={placeholder}

                autoComplete="off"
                spellCheck={false}

                aria-label="Muammolarni qidirish"

                className={`
                    block

                    h-12
                    w-full
                    min-w-0

                    rounded-2xl

                    border
                    border-slate-200

                    bg-slate-50

                    pl-11

                    ${
                        hasValue || loading
                            ? "pr-20"
                            : "pr-4"
                    }

                    font-sans
                    text-[13px]
                    font-medium

                    text-slate-900

                    outline-none

                    transition-colors
                    duration-200

                    placeholder:text-slate-400

                    hover:border-slate-300

                    focus:border-cyan-500/50
                    focus:bg-white

                    focus:ring-4
                    focus:ring-cyan-500/[0.08]

                    sm:text-sm

                    dark:border-white/[0.09]
                    dark:bg-white/[0.035]

                    dark:text-gray-100
                    dark:placeholder:text-gray-500

                    dark:hover:border-white/[0.15]

                    dark:focus:border-cyan-400/35
                    dark:focus:bg-[#0d1320]
                    dark:focus:ring-cyan-400/[0.07]

                    [&::-webkit-search-cancel-button]:hidden
                `}
            />

            {/* RIGHT ACTIONS */}

            {(loading || hasValue) && (
                <div
                    className="
                        absolute
                        right-2
                        top-1/2

                        z-10

                        flex
                        -translate-y-1/2

                        items-center
                        gap-1.5
                    "
                >
                    {/* LOADING */}

                    {loading && (
                        <span
                            role="status"
                            aria-label="Qidiruv natijalari yuklanmoqda"
                            className="
                                inline-flex

                                h-8
                                w-8

                                items-center
                                justify-center

                                text-cyan-600

                                dark:text-cyan-400
                            "
                        >
                            <Loader2
                                size={16}
                                aria-hidden="true"
                                className="
                                    animate-spin
                                    motion-reduce:animate-none
                                "
                            />

                            <span className="sr-only">
                                Yuklanmoqda
                            </span>
                        </span>
                    )}

                    {/* CLEAR */}

                    {hasValue && (
                        <button
                            type="button"

                            onClick={handleClear}
                            disabled={!canClear}

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
                                border-slate-200

                                bg-white

                                text-slate-500

                                transition-colors

                                hover:border-red-300
                                hover:bg-red-50
                                hover:text-red-700

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-red-500

                                disabled:cursor-not-allowed
                                disabled:opacity-40

                                dark:border-white/[0.10]
                                dark:bg-white/[0.05]
                                dark:text-gray-400

                                dark:hover:border-red-400/30
                                dark:hover:bg-red-400/[0.08]
                                dark:hover:text-red-300
                            "
                        >
                            <X
                                size={15}
                                aria-hidden="true"
                            />
                        </button>
                    )}
                </div>
            )}

            {/* FOCUS ACCENT */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    inset-x-6
                    -bottom-px

                    h-px

                    origin-center
                    scale-x-0

                    bg-gradient-to-r
                    from-transparent
                    via-cyan-500/70
                    to-transparent

                    transition-transform
                    duration-300

                    group-focus-within/search:scale-x-100

                    motion-reduce:transition-none
                "
            />
        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(ProblemsSearch);
