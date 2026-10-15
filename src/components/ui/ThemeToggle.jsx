
import React from "react";

import {
    Moon,
    Sun,
} from "lucide-react";

import useTheme from "../../hooks/useTheme";

// =========================================================
// FSOCIETY — PERFORMANCE OPTIMIZED THEME TOGGLE
// =========================================================

const ThemeToggle = ({
    className = "",
}) => {

    // =====================================================
    // THEME
    // =====================================================

    const {
        isDark,
        toggleTheme,
    } = useTheme();

    // =====================================================
    // ACCESSIBILITY
    // =====================================================

    const label = isDark
        ? "Light Mode'ga o'tish"
        : "Dark Mode'ga o'tish";

    // =====================================================
    // JSX
    // =====================================================

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={label}
            title={label}
            aria-pressed={!isDark}

            className={`
                group
                relative

                inline-flex
                h-10
                w-10

                shrink-0
                items-center
                justify-center

                overflow-hidden

                rounded-xl
                border

                transition-colors
                duration-150

                hover:border-indigo-400/40
                active:scale-95

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500

                ${className}
            `}

            style={{
                backgroundColor:
                    "var(--fs-surface)",

                borderColor:
                    "var(--fs-border)",

                color:
                    "var(--fs-text)",
            }}
        >

            {/* SUBTLE HOVER */}

            <span
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-0

                    bg-indigo-500/0

                    transition-colors
                    duration-150

                    group-hover:bg-indigo-500/[0.06]
                "
            />

            {/* THEME ICON */}

            <span
                className="
                    relative
                    z-10

                    flex
                    items-center
                    justify-center

                    transition-transform
                    duration-150

                    group-hover:rotate-12

                    motion-reduce:transition-none
                "
            >
                {isDark ? (

                    <Sun
                        size={19}
                        strokeWidth={1.8}
                        className="text-amber-400"
                    />

                ) : (

                    <Moon
                        size={19}
                        strokeWidth={1.8}
                        className="text-indigo-600"
                    />

                )}
            </span>

        </button>
    );
};

export default React.memo(ThemeToggle);
