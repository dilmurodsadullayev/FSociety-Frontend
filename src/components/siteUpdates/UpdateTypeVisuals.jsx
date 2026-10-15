
import React from "react";

import {
    getUpdateTypeConfig,
} from "./updateCardConfig";

// =========================================================
// FSOCIETY — UPDATE TYPE VISUALS
//
// Shared UI:
// - Type icon
// - Type badge
//
// Supports Dark / Light Mode.
// =========================================================

// =========================================================
// UPDATE TYPE ICON
// =========================================================

export const UpdateTypeIcon = React.memo(({
    update,
    large = false,
}) => {
    const config = getUpdateTypeConfig(update);

    const Icon = config.Icon;

    return (
        <span
            aria-hidden="true"
            className={`
                relative
                grid
                shrink-0
                place-items-center
                overflow-hidden

                border

                transition-colors
                duration-150

                ${
                    large
                        ? `
                            h-11
                            w-11
                            rounded-2xl
                            sm:h-12
                            sm:w-12
                        `
                        : `
                            h-9
                            w-9
                            rounded-xl
                            sm:h-10
                            sm:w-10
                        `
                }

                ${config.iconClass}
            `}
        >
            <Icon
                size={large ? 21 : 16}
                strokeWidth={2}
                aria-hidden="true"
                className="relative z-10"
            />
        </span>
    );
});

// =========================================================
// UPDATE TYPE BADGE
// =========================================================

export const UpdateTypeBadge = React.memo(({
    update,
}) => {
    const config = getUpdateTypeConfig(update);

    const label =
        update?.update_type_label ||
        config.label;

    return (
        <span
            className={`
                inline-flex
                max-w-full
                items-center
                gap-1.5

                rounded-full
                border

                px-2.5
                py-1

                font-mono
                text-[9px]
                font-bold
                uppercase
                tracking-[0.08em]

                ${config.badgeClass}
            `}
        >
            {/* TYPE INDICATOR */}

            <span
                aria-hidden="true"
                className={`
                    h-1.5
                    w-1.5
                    shrink-0

                    rounded-full

                    ${config.dotClass}
                `}
            />

            {/* TYPE LABEL */}

            <span
                className="
                    min-w-0
                    break-words
                    [overflow-wrap:anywhere]
                "
            >
                {label}
            </span>
        </span>
    );
});
