
// src/components/projects/create/ProjectCreateStackTag.jsx

import React, { memo } from "react";

import {
    Check,
} from "lucide-react";

// =========================================================
// CONSTANTS
// =========================================================

const DEFAULT_STACK_COLOR = "#64748B";

const HEX_COLOR_REGEX = /^#[0-9a-fA-F]{6}$/;

const HEX_ALPHA_REGEX = /^[0-9a-fA-F]{2}$/;

// =========================================================
// GET PROJECT STACK COLOR
//
// Backend catalog item example:
//
// {
//     id: 1,
//     name: "Python",
//     color: "#3776AB"
// }
//
// Features:
// - Validates hex colors
// - Prevents invalid CSS color values
// - Uses a safe fallback
//
// Export preserved for ProjectCreateStackPreview.
// =========================================================

export const getProjectStackColor = (item) => {
    const color = item?.color;

    if (
        typeof color === "string" &&
        HEX_COLOR_REGEX.test(color)
    ) {
        return color;
    }

    return DEFAULT_STACK_COLOR;
};

// =========================================================
// HEX COLOR WITH ALPHA
//
// Example:
//
// withProjectStackAlpha("#3776AB", "20")
//
// Result:
//
// "#3776AB20"
//
// Export preserved.
// =========================================================

export const withProjectStackAlpha = (
    color,
    alpha = "20"
) => {
    // =====================================================
    // SAFE COLOR
    // =====================================================

    const safeColor =
        typeof color === "string" &&
        HEX_COLOR_REGEX.test(color)
            ? color
            : DEFAULT_STACK_COLOR;

    // =====================================================
    // SAFE ALPHA
    // =====================================================

    const safeAlpha =
        typeof alpha === "string" &&
        HEX_ALPHA_REGEX.test(alpha)
            ? alpha
            : "20";

    return `${safeColor}${safeAlpha}`;
};

// =========================================================
// PROJECT CREATE STACK TAG
//
// Props:
//
// item:
// {
//     id,
//     name,
//     color,
//     category,
//     category_display
// }
//
// active:
//   Whether this stack item is selected.
//
// onClick:
//   Parent language / technology toggle.
//
// disabled:
//   Prevents changes during loading or submission.
//
// showCategory:
//   Displays technology category when available.
//
// Features:
//
// - Responsive tag layout
// - Backend-defined colors
// - Active / inactive states
// - Accessible selection state
// - Disabled protection
// - Long-name wrapping
// - Light / Dark Mode
//
// Selection and compatibility logic remain in
// ProjectFormModal.
//
// No internal state.
// No Redux.
// No API calls.
// =========================================================

const ProjectCreateStackTag = ({
    item,
    active = false,
    onClick,
    disabled = false,
    showCategory = false,
}) => {
    // =====================================================
    // SAFE ITEM DATA
    // =====================================================

    const rawName = String(
        item?.name ?? ""
    ).trim();

    const name =
        rawName || "Noma’lum";

    // =====================================================
    // CATEGORY
    //
    // The backend may provide:
    //
    // category_display
    // category
    //
    // Preserve the original priority.
    // =====================================================

    const rawCategory =
        item?.category_display ||
        item?.category ||
        "";

    const category =
        typeof rawCategory === "string" ||
        typeof rawCategory === "number"
            ? String(rawCategory).trim()
            : "";

    // =====================================================
    // BACKEND COLOR
    // =====================================================

    const color =
        getProjectStackColor(item);

    // =====================================================
    // ACTIVE STYLE
    //
    // Keep backend-based background and borders.
    //
    // Text uses theme-aware Tailwind colors to
    // remain readable in Light and Dark Mode.
    // =====================================================

    const activeStyle = active
        ? {
              borderColor:
                  withProjectStackAlpha(
                      color,
                      "66"
                  ),

              backgroundColor:
                  withProjectStackAlpha(
                      color,
                      "18"
                  ),

              boxShadow: `0 0 16px ${withProjectStackAlpha(
                  color,
                  "12"
              )}`,
          }
        : undefined;

    // =====================================================
    // CLICK PERMISSION
    // =====================================================

    const canSelect =
        !disabled &&
        typeof onClick === "function";

    // =====================================================
    // ACCESSIBILITY
    //
    // The category is hidden visually on small
    // screens, but remains in the accessible label.
    // =====================================================

    const accessibleLabel =
        showCategory && category
            ? `${name}, ${category}`
            : name;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <button
            type="button"

            onClick={onClick}

            disabled={!canSelect}

            aria-pressed={Boolean(active)}
            aria-label={accessibleLabel}

            title={
                showCategory && category
                    ? `${name} — ${category}`
                    : name
            }

            style={activeStyle}

            className={`
                group
                relative

                inline-flex

                min-h-11
                min-w-0
                max-w-full

                flex-[0_1_auto]

                items-center
                justify-start

                gap-2

                rounded-full
                border

                px-3
                py-2

                text-left
                text-[11px]
                font-black
                leading-5

                transition-all
                duration-200

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500/50
                focus-visible:ring-offset-2

                enabled:hover:-translate-y-px

                enabled:active:translate-y-0
                enabled:active:scale-[0.98]

                disabled:cursor-not-allowed
                disabled:opacity-40

                dark:focus-visible:ring-offset-[#0b1018]

                motion-reduce:transform-none
                motion-reduce:transition-none

                sm:px-3.5
                sm:text-xs

                ${
                    active
                        ? `
                            border-slate-300
                            text-slate-900

                            dark:border-white/20
                            dark:text-white
                        `
                        : `
                            border-slate-200
                            bg-white
                            text-slate-600

                            enabled:hover:border-slate-300
                            enabled:hover:bg-slate-50
                            enabled:hover:text-slate-900

                            dark:border-white/[0.08]
                            dark:bg-white/[0.025]
                            dark:text-slate-400

                            dark:enabled:hover:border-white/[0.15]
                            dark:enabled:hover:bg-white/[0.05]
                            dark:enabled:hover:text-slate-200
                        `
                }
            `}
        >
            {/* =============================================
                SELECTED ICON / COLOR DOT

                Selected:
                - Check icon
                - Backend color

                Unselected:
                - Small colored dot
            ============================================== */}

            {active ? (
                <span
                    aria-hidden="true"
                    className="
                        inline-flex

                        h-5
                        w-5

                        shrink-0

                        items-center
                        justify-center

                        rounded-full
                    "
                    style={{
                        backgroundColor:
                            withProjectStackAlpha(
                                color,
                                "28"
                            ),
                    }}
                >
                    <Check
                        size={12}
                        strokeWidth={3}
                        style={{
                            color,
                        }}
                    />
                </span>
            ) : (
                <span
                    aria-hidden="true"
                    className="
                        h-2
                        w-2

                        shrink-0

                        rounded-full
                    "
                    style={{
                        backgroundColor: color,
                    }}
                />
            )}

            {/* =============================================
                STACK NAME

                IMPORTANT:

                - No fixed width
                - No truncate
                - Breaks long text when necessary
                - Prevents horizontal overflow
            ============================================== */}

            <span
                className="
                    min-w-0
                    flex-1

                    whitespace-normal

                    break-words
                    [overflow-wrap:anywhere]

                    text-left
                "
            >
                {name}
            </span>

            {/* =============================================
                TECHNOLOGY CATEGORY

                Original behavior preserved:
                - Only displayed with showCategory
                - Hidden on narrow mobile screens
                - Visible from sm breakpoint

                Long categories are truncated instead
                of widening the tag beyond its parent.
            ============================================== */}

            {showCategory && category && (
                <span
                    className="
                        hidden

                        min-w-0
                        max-w-[96px]

                        shrink

                        items-center
                        justify-center

                        overflow-hidden

                        rounded-full
                        border

                        border-slate-200
                        bg-white/50

                        px-2
                        py-0.5

                        font-mono
                        text-[9px]
                        font-semibold
                        leading-4

                        text-slate-500

                        dark:border-white/[0.08]
                        dark:bg-black/10
                        dark:text-slate-400

                        sm:inline-flex
                    "
                    title={category}
                >
                    <span className="block min-w-0 truncate">
                        {category}
                    </span>
                </span>
            )}
        </button>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProjectCreateStackTag);
