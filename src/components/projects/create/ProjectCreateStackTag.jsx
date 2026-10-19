
import React, { memo } from "react";

import {
    Check,
} from "lucide-react";

// =========================================================
// CONSTANTS
// =========================================================

const DEFAULT_STACK_COLOR = "#64748B";

const HEX_COLOR_REGEX = /^#[0-9a-fA-F]{6}$/;

// =========================================================
// GET STACK COLOR
//
// Backend catalog item may contain:
//
// {
//     id: 1,
//     name: "Python",
//     color: "#3776AB"
// }
//
// Invalid colors use the fallback.
//
// Exported for later StackPreview component.
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
// "#3776AB", "20"
// -> "#3776AB20"
//
// Exported to avoid duplicating color helpers.
// =========================================================

export const withProjectStackAlpha = (
    color,
    alpha = "20"
) => {
    const safeColor =
        typeof color === "string" &&
        HEX_COLOR_REGEX.test(color)
            ? color
            : DEFAULT_STACK_COLOR;

    const safeAlpha =
        typeof alpha === "string" &&
        /^[0-9a-fA-F]{2}$/.test(alpha)
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
//   Indicates whether the stack is selected.
//
// onClick:
//   Parent toggle callback.
//
// disabled:
//   Prevents changing selection while submitting.
//
// showCategory:
//   Displays technology category if available.
//
// IMPORTANT:
//
// This component does not modify selected IDs.
// That logic remains in CreateProjectModal.
// =========================================================

const ProjectCreateStackTag = ({
    item,
    active = false,
    onClick,
    disabled = false,
    showCategory = false,
}) => {
    // =====================================================
    // SAFE DATA
    // =====================================================

    const name = String(
        item?.name || "Noma’lum"
    );

    const category =
        item?.category_display ||
        item?.category ||
        "";

    // =====================================================
    // ITEM COLOR
    // =====================================================

    const color = getProjectStackColor(item);

    // =====================================================
    // ACTIVE STYLES
    //
    // Background and border follow backend colors.
    //
    // Text keeps sufficient theme contrast.
    // =====================================================

    const activeStyle = active
        ? {
              borderColor: withProjectStackAlpha(
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
    // RENDER
    // =====================================================

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={!canSelect}
            aria-pressed={active}
            title={name}
            style={activeStyle}
            className={`
                group
                relative

                inline-flex
                min-h-[36px]
                max-w-full

                items-center
                justify-center
                gap-2

                rounded-full
                border

                px-3
                py-2

                text-[10px]
                font-black

                transition-all
                duration-200

                hover:-translate-y-px

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500/50

                active:translate-y-0
                active:scale-[0.98]

                disabled:cursor-not-allowed
                disabled:opacity-40

                motion-reduce:transform-none

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

                            hover:border-slate-300
                            hover:bg-slate-50
                            hover:text-slate-900

                            dark:border-white/[0.08]
                            dark:bg-white/[0.025]
                            dark:text-slate-400

                            dark:hover:border-white/[0.15]
                            dark:hover:bg-white/[0.05]
                            dark:hover:text-slate-200
                        `
                }
            `}
        >
            {/* =====================================
                SELECTED ICON / COLOR DOT
            ====================================== */}

            {active ? (
                <span
                    aria-hidden="true"
                    className="
                        inline-flex
                        h-4
                        w-4
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

            {/* =====================================
                STACK NAME
            ====================================== */}

            <span className="truncate">
                {name}
            </span>

            {/* =====================================
                TECHNOLOGY CATEGORY

                Original showCategory behavior.
            ====================================== */}

            {showCategory && category && (
                <span
                    className="
                        hidden
                        max-w-[100px]
                        truncate

                        rounded-full
                        border

                        border-slate-200
                        bg-white/50

                        px-1.5
                        py-0.5

                        font-mono
                        text-[8px]
                        font-semibold

                        text-slate-500

                        dark:border-white/[0.08]
                        dark:bg-black/10
                        dark:text-slate-400

                        sm:inline
                    "
                >
                    {category}
                </span>
            )}
        </button>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProjectCreateStackTag);
