
import React from "react";

import {
    Gift,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

import {
    FEEDBACK_DEFAULT_TYPE,
    getFeedbackTypeConfig,
} from "../feedbackConfig";

// =========================================================
// FSOCIETY — FEEDBACK REWARD INFORMATION
//
// Features:
// - Potential FCoin reward
// - Backend reward contract
// - Admin approval explanation
// - Dark / Light Mode
// - Responsive layout
// - Accessible information
//
// No API requests.
// No Redux.
// =========================================================

const FeedbackRewardInfo = ({
    feedbackType = FEEDBACK_DEFAULT_TYPE,

    showHeading = true,

    compact = false,
}) => {
    // =====================================================
    // SELECTED FEEDBACK TYPE
    // =====================================================

    const selectedType =
        getFeedbackTypeConfig(
            feedbackType
        );

    const reward =
        selectedType.reward;

    // =====================================================
    // JSX
    // =====================================================

    return (
        <aside
            aria-label="Feedback uchun FCoin mukofoti"

            className={`
                relative

                w-full
                min-w-0

                overflow-hidden

                rounded-2xl
                border
                border-indigo-300/40

                bg-gradient-to-br
                from-indigo-50
                via-white
                to-sky-50

                ${
                    compact
                        ? "p-3.5"
                        : "p-4 sm:p-5"
                }

                dark:border-indigo-400/[0.15]

                dark:from-indigo-500/[0.065]
                dark:via-white/[0.025]
                dark:to-cyan-500/[0.035]
            `}
        >
            {/* ======================================
                BACKGROUND GLOW
            ====================================== */}

            <div
                aria-hidden="true"

                className={`
                    pointer-events-none

                    absolute
                    -right-10
                    -top-10

                    h-32
                    w-32

                    rounded-full

                    blur-3xl

                    ${selectedType.glowClass}
                `}
            />

            {/* ======================================
                CONTENT
            ====================================== */}

            <div
                className="
                    relative
                    z-10

                    flex
                    min-w-0

                    items-start
                    gap-3
                "
            >
                {/* ICON */}

                <div
                    className="
                        grid
                        h-10
                        w-10
                        shrink-0

                        place-items-center

                        rounded-xl
                        border
                        border-indigo-400/25

                        bg-indigo-500/[0.09]

                        text-indigo-700

                        dark:border-indigo-400/20
                        dark:bg-indigo-400/[0.08]
                        dark:text-indigo-300
                    "
                >
                    <ShieldCheck
                        size={20}
                        strokeWidth={1.9}
                        aria-hidden="true"
                    />
                </div>

                {/* INFORMATION */}

                <div className="min-w-0 flex-1">
                    {/* TITLE */}

                    {showHeading && (
                        <h3
                            className="
                                font-display

                                text-[12px]
                                font-bold
                                leading-5

                                text-slate-900

                                dark:text-gray-100
                            "
                        >
                            Admin tasdig‘idan
                            keyin mukofot
                        </h3>
                    )}

                    {/* DESCRIPTION */}

                    <p
                        className={`
                            break-words

                            text-[11px]
                            font-medium
                            leading-6

                            text-slate-600

                            dark:text-gray-400

                            ${
                                showHeading
                                    ? "mt-1.5"
                                    : ""
                            }
                        `}
                    >
                        Feedback yuborilgan
                        zahoti FCoin berilmaydi.
                        Admin tasdiqlasa{" "}

                        <strong
                            className="
                                font-bold

                                text-indigo-700

                                dark:text-indigo-300
                            "
                        >
                            +{reward} FCoin
                        </strong>

                        {" "}mukofoti
                        balansingizga qo‘shilishi
                        mumkin.
                    </p>
                </div>
            </div>

            {/* ======================================
                REWARD DETAILS
            ====================================== */}

            {!compact && (
                <div
                    className="
                        relative
                        z-10

                        mt-4

                        flex
                        min-w-0

                        flex-wrap
                        items-center
                        justify-between
                        gap-3

                        border-t
                        border-indigo-200/70

                        pt-3

                        dark:border-white/[0.08]
                    "
                >
                    {/* SELECTED TYPE */}

                    <div
                        className="
                            flex
                            min-w-0

                            items-center
                            gap-2
                        "
                    >
                        <Sparkles
                            size={14}
                            aria-hidden="true"

                            className="
                                shrink-0

                                text-indigo-600

                                dark:text-indigo-300
                            "
                        />

                        <span
                            className="
                                break-words

                                text-[10px]
                                font-semibold

                                text-slate-600

                                dark:text-gray-400
                            "
                        >
                            {selectedType.label}
                            {" "}uchun mukofot
                        </span>
                    </div>

                    {/* FCoin BADGE */}

                    <span
                        className={`
                            inline-flex

                            items-center
                            gap-1.5

                            rounded-full
                            border

                            px-3
                            py-1.5

                            font-mono
                            text-[11px]
                            font-bold
                            tabular-nums

                            ${selectedType.rewardClass}
                        `}
                    >
                        <Gift
                            size={14}
                            aria-hidden="true"
                        />

                        +{reward} FCoin
                    </span>
                </div>
            )}
        </aside>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(
    FeedbackRewardInfo
);
