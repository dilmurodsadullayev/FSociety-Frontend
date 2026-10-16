
import React, { useId } from "react";

import {
    motion,
    useReducedMotion,
} from "framer-motion";

import { Gift } from "lucide-react";

import {
    FEEDBACK_DEFAULT_TYPE,
    FEEDBACK_TYPES,
    getFeedbackTypeConfig,
} from "../feedbackConfig";

// =========================================================
// FSOCIETY — FEEDBACK TYPE SELECTOR
//
// Parent: FeedbackCreateModal
//
// Features:
// - Dark / Light Mode
// - Mobile-first responsive grid
// - Selected feedback type
// - Potential FCoin reward
// - Accessible selection buttons
// - Reduced-motion support
//
// No Redux or API requests.
// =========================================================

// =========================================================
// TYPE CARD
// =========================================================

const FeedbackTypeCard = React.memo(({
    config,
    active = false,
    disabled = false,
    compact = false,
    onSelect,
    reduceMotion = false,
}) => {
    const {
        value,
        label,
        description,
        reward,
        Icon,
        activeClass,
        inactiveHoverClass,
        iconClass,
        rewardClass,
    } = config;

    const handleSelect = () => {
        if (
            disabled ||
            typeof onSelect !== "function"
        ) {
            return;
        }

        onSelect(value);
    };

    return (
        <motion.button
            type="button"
            onClick={handleSelect}
            disabled={disabled}
            aria-pressed={active}
            whileHover={
                disabled || reduceMotion
                    ? undefined
                    : { y: -2 }
            }
            whileTap={
                disabled || reduceMotion
                    ? undefined
                    : { scale: 0.985 }
            }
            transition={{
                duration: 0.18,
                ease: "easeOut",
            }}
            className={`
                group/type
                relative
                flex
                h-full
                w-full
                min-w-0
                items-start
                gap-3

                overflow-hidden
                rounded-2xl
                border
                text-left

                transition-colors
                duration-150

                ${
                    compact
                        ? "p-3"
                        : "p-3.5 sm:p-4"
                }

                ${
                    active
                        ? activeClass
                        : `
                            border-slate-200
                            bg-white
                            text-slate-800

                            dark:border-white/[0.09]
                            dark:bg-white/[0.025]
                            dark:text-gray-300

                            ${inactiveHoverClass}
                        `
                }

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500
                focus-visible:ring-offset-2

                disabled:cursor-not-allowed
                disabled:opacity-50

                dark:focus-visible:ring-offset-[#0b1018]
            `}
        >
            {/* TYPE ICON */}

            <div
                className={`
                    grid
                    h-10
                    w-10
                    shrink-0
                    place-items-center
                    rounded-xl
                    border
                    ${iconClass}
                `}
            >
                <Icon
                    size={19}
                    strokeWidth={1.9}
                    aria-hidden="true"
                />
            </div>

            {/* TYPE INFORMATION */}

            <div className="min-w-0 flex-1">
                <div
                    className="
                        flex
                        min-w-0
                        flex-wrap
                        items-center
                        justify-between
                        gap-2
                    "
                >
                    <span
                        className="
                            min-w-0
                            break-words
                            font-display
                            text-[13px]
                            font-bold
                            leading-5
                        "
                    >
                        {label}
                    </span>

                    <span
                        className={`
                            inline-flex
                            shrink-0
                            items-center
                            gap-1
                            rounded-full
                            border
                            px-2
                            py-1
                            font-mono
                            text-[10px]
                            font-bold
                            tabular-nums
                            ${rewardClass}
                        `}
                        title={
                            `Tasdiqlansa +${reward} FCoin`
                        }
                    >
                        <Gift
                            size={12}
                            aria-hidden="true"
                        />
                        +{reward}
                    </span>
                </div>

                {!compact && (
                    <p
                        className="
                            mt-1.5
                            break-words
                            text-[11px]
                            font-medium
                            leading-5

                            text-slate-600
                            dark:text-gray-400
                        "
                    >
                        {description}
                    </p>
                )}
            </div>
        </motion.button>
    );
});

// =========================================================
// MAIN SELECTOR
// =========================================================

const FeedbackTypeSelector = ({
    value = FEEDBACK_DEFAULT_TYPE,
    onChange,
    disabled = false,
    compact = false,
    showReward = true,
}) => {
    const headingId = useId();

    const reduceMotion =
        useReducedMotion();

    const selectedType =
        getFeedbackTypeConfig(value);

    const isDisabled =
        Boolean(disabled) ||
        typeof onChange !== "function";

    return (
        <section
            role="group"
            aria-labelledby={headingId}
            className="w-full min-w-0"
        >
            {/* HEADER */}

            <div
                className="
                    mb-3
                    flex
                    min-w-0
                    flex-wrap
                    items-center
                    justify-between
                    gap-3
                "
            >
                <h3
                    id={headingId}
                    className="
                        font-display
                        text-[11px]
                        font-bold
                        uppercase
                        tracking-[0.10em]

                        text-slate-700
                        dark:text-gray-300
                    "
                >
                    Feedback turi
                </h3>

                {showReward && (
                    <span
                        className={`
                            inline-flex
                            max-w-full
                            items-center
                            gap-1.5
                            rounded-full
                            border
                            px-3
                            py-1.5

                            font-display
                            text-[10px]
                            font-bold

                            ${selectedType.rewardClass}
                        `}
                    >
                        <Gift
                            size={13}
                            aria-hidden="true"
                            className="shrink-0"
                        />

                        <span className="break-words">
                            Tasdiqlansa +{
                                selectedType.reward
                            } FCoin
                        </span>
                    </span>
                )}
            </div>

            {/* TYPES */}

            <div
                className="
                    grid
                    w-full
                    min-w-0
                    grid-cols-1
                    gap-3

                    sm:grid-cols-2
                "
            >
                {FEEDBACK_TYPES.map((config) => (
                    <FeedbackTypeCard
                        key={config.value}
                        config={config}
                        active={
                            value === config.value
                        }
                        disabled={isDisabled}
                        compact={compact}
                        reduceMotion={reduceMotion}
                        onSelect={onChange}
                    />
                ))}
            </div>
        </section>
    );
};

export default React.memo(
    FeedbackTypeSelector
);
