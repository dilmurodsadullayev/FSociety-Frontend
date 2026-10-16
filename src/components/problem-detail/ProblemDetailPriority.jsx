
import React from "react";

import {
    Clock3,
    Coins,
    Hammer,
    Sparkles,
    Zap,
} from "lucide-react";

import CountdownTimer from "../../utils/countdowntimer";

import {
    getProblemDetailPriorityViewModel,
} from "./problemDetailHelpers";

// =========================================================
// FSOCIETY — PROBLEM DETAIL PRIORITY
//
// Responsibilities:
// - Urgent problem information
// - FCoin bounty
// - Deadline countdown
// - Work on problem action
// - Normal problem fallback
//
// Features:
// - Light / Dark Mode
// - Responsive layout
// - Safe values
// - Preserved CountdownTimer integration
// - Preserved onWork callback
// - No duplicated Header badges by default
// - Accessible action states
//
// No direct API requests.
// No Redux actions.
// =========================================================

// =========================================================
// SAFE COIN VALUE
// =========================================================

const getSafeCoins = (value) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return 0;
    }

    const number = Number(value);

    if (
        !Number.isFinite(number) ||
        number <= 0
    ) {
        return 0;
    }

    return number;
};

// =========================================================
// VALID DEADLINE
// =========================================================

const hasValidDeadline = (value) => {
    if (!value) {
        return false;
    }

    const date = new Date(value);

    return !Number.isNaN(
        date.getTime()
    );
};

// =========================================================
// URGENT BADGE
//
// Kept as a reusable component.
//
// The Header already displays urgency.
// This badge is optional in the Priority panel.
// =========================================================

const UrgentBadge = React.memo(() => {
    return (
        <span
            title="Tezkor muammo"

            className="
                inline-flex
                min-h-9
                max-w-full

                items-center
                justify-center
                gap-2

                rounded-xl

                border
                border-rose-300

                bg-rose-50

                px-3
                py-2

                font-display
                text-[11px]
                font-black

                text-rose-800

                dark:border-rose-400/25
                dark:bg-rose-400/[0.09]
                dark:text-rose-300
            "
        >
            <Zap
                size={15}
                strokeWidth={2}
                aria-hidden="true"

                className="
                    shrink-0
                    fill-rose-500/15
                "
            />

            Favqulodda muammo
        </span>
    );
});

// =========================================================
// FCOIN REWARD BADGE
// =========================================================

const FCoinRewardBadge = React.memo(({
    coins = 0,
}) => {
    const amount = getSafeCoins(coins);

    if (amount <= 0) {
        return null;
    }

    const formattedAmount =
        amount.toLocaleString("uz-UZ");

    return (
        <span
            title={`Mukofot: ${formattedAmount} FCoin`}

            className="
                inline-flex
                min-h-9
                max-w-full

                items-center
                justify-center
                gap-2

                rounded-xl

                border
                border-amber-300

                bg-amber-50

                px-3
                py-2

                font-display
                text-[11px]
                font-black

                text-amber-800

                dark:border-amber-400/25
                dark:bg-amber-400/[0.09]
                dark:text-amber-300
            "
        >
            <Coins
                size={15}
                strokeWidth={1.9}
                aria-hidden="true"

                className="shrink-0"
            />

            <span>
                Mukofot:{" "}
                <strong className="tabular-nums">
                    {formattedAmount}
                </strong>
                {" "}FCoin
            </span>
        </span>
    );
});

// =========================================================
// OPTIONAL PRIORITY BADGES
//
// showPriorityBadges defaults to false,
// because Header displays urgency and FCoin.
//
// All badge functionality remains available.
// =========================================================

const PriorityBadges = React.memo(({
    isUrgent = false,
    offeredCoins = 0,
}) => {
    const hasUrgent =
        Boolean(isUrgent);

    const hasCoins =
        getSafeCoins(offeredCoins) > 0;

    if (!hasUrgent && !hasCoins) {
        return null;
    }

    return (
        <div
            aria-label="Muammo ustuvorligi va mukofoti"

            className="
                flex
                min-w-0

                flex-wrap
                items-center
                gap-2
            "
        >
            {hasUrgent && (
                <UrgentBadge />
            )}

            {hasCoins && (
                <FCoinRewardBadge
                    coins={offeredCoins}
                />
            )}
        </div>
    );
});

// =========================================================
// DEADLINE CARD
//
// Uses the existing CountdownTimer.
//
// Original props preserved:
// - targetDate
// - variant="cards"
// - tone="emerald"
// - size="sm"
// - showLabel={false}
// - showIcon={false}
// - expiredText
// =========================================================

const DeadlineCard = React.memo(({
    deadline,
}) => {
    if (!hasValidDeadline(deadline)) {
        return null;
    }

    const parsedDate = new Date(deadline);

    return (
        <div
            className="
                relative

                w-full
                min-w-0

                overflow-hidden

                rounded-2xl

                border
                border-indigo-200

                bg-white/85

                p-3.5

                shadow-sm

                sm:w-fit
                sm:max-w-full
                sm:p-4

                dark:border-indigo-400/20
                dark:bg-indigo-400/[0.055]

                dark:shadow-indigo-950/10
            "
        >
            {/* BACKGROUND ACCENT */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    -right-10
                    -top-10

                    h-28
                    w-28

                    rounded-full

                    bg-indigo-500/[0.07]

                    blur-3xl

                    dark:bg-indigo-400/[0.08]
                "
            />

            {/* MAIN CONTENT */}

            <div
                className="
                    relative
                    z-10

                    min-w-0
                "
            >
                {/* ==================================
                    HEADER
                ================================== */}

                <div
                    className="
                        mb-3

                        flex
                        min-w-0

                        flex-wrap
                        items-center
                        justify-between
                        gap-2
                    "
                >
                    <div
                        className="
                            inline-flex
                            items-center
                            gap-2
                        "
                    >
                        <span
                            aria-hidden="true"

                            className="
                                grid
                                h-7
                                w-7

                                shrink-0

                                place-items-center

                                rounded-lg

                                border
                                border-indigo-200

                                bg-indigo-50

                                text-indigo-700

                                dark:border-indigo-400/20
                                dark:bg-indigo-400/[0.09]
                                dark:text-indigo-300
                            "
                        >
                            <Clock3
                                size={14}
                                strokeWidth={1.9}
                            />
                        </span>

                        <span
                            className="
                                font-mono
                                text-[10px]
                                font-black
                                uppercase
                                tracking-[0.10em]

                                text-indigo-800

                                dark:text-indigo-300
                            "
                        >
                            Muammo muddati
                        </span>
                    </div>
                </div>

                {/* ==================================
                    COUNTDOWN

                    Existing utility handles timing
                    and expiration display.
                ================================== */}

                <div
                    className="
                        min-w-0
                        max-w-full
                    "
                >
                    <CountdownTimer
                        targetDate={deadline}

                        variant="cards"
                        tone="emerald"
                        size="sm"

                        showLabel={false}
                        showIcon={false}

                        expiredText="Muammo muddati tugagan"
                    />
                </div>

                {/* ==================================
                    FOOTER INFORMATION
                ================================== */}

                <div
                    className="
                        mt-3

                        flex
                        min-w-0

                        items-start
                        gap-1.5

                        text-[10px]
                        font-medium
                        leading-5

                        text-slate-500

                        dark:text-gray-400
                    "
                >
                    <Clock3
                        size={12}
                        strokeWidth={1.8}
                        aria-hidden="true"

                        className="
                            mt-0.5
                            shrink-0
                        "
                    />

                    <span>
                        Muammo muddati tugashigacha
                        qolgan vaqt
                    </span>
                </div>

                {/* ACCESSIBLE DEADLINE DATE */}

                <time
                    dateTime={
                        parsedDate.toISOString()
                    }

                    className="sr-only"
                >
                    {parsedDate.toLocaleString(
                        "uz-UZ"
                    )}
                </time>
            </div>
        </div>
    );
});

// =========================================================
// NORMAL PROBLEM INFORMATION
//
// Important:
// This remains visible for unsolved problems
// without a deadline.
//
// A normal problem must not lose its
// "Men ishlayman!" action.
// =========================================================

const NormalProblemInfo = React.memo(({
    hasPriorityInformation = false,
}) => {
    return (
        <div
            className="
                flex
                min-w-0

                items-start
                gap-3
            "
        >
            {/* ICON */}

            <span
                aria-hidden="true"

                className="
                    grid
                    h-11
                    w-11

                    shrink-0

                    place-items-center

                    rounded-2xl

                    border
                    border-cyan-200

                    bg-cyan-50

                    text-cyan-700

                    dark:border-cyan-400/20
                    dark:bg-cyan-400/[0.08]
                    dark:text-cyan-300
                "
            >
                <Sparkles
                    size={19}
                    strokeWidth={1.9}
                />
            </span>

            {/* TEXT */}

            <div
                className="
                    min-w-0
                    flex-1
                "
            >
                <h3
                    className="
                        font-display
                        text-sm
                        font-black
                        leading-6

                        text-slate-900

                        dark:text-white
                    "
                >
                    Muammo ustida ishlash
                </h3>

                <p
                    className="
                        mt-1
                        max-w-lg

                        break-words

                        text-xs
                        font-medium
                        leading-6

                        text-slate-600

                        dark:text-gray-400
                    "
                >
                    {hasPriorityInformation
                        ? (
                            "Muammoning ustuvorligi va " +
                            "mukofoti yuqorida ko‘rsatilgan. " +
                            "O‘z yechimingizni hamjamiyat " +
                            "bilan ulashing."
                        )
                        : (
                            "Muammoni tahlil qiling va " +
                            "o‘z yechimingizni " +
                            "hamjamiyat bilan ulashing."
                        )}
                </p>
            </div>
        </div>
    );
});

// =========================================================
// WORK ACTION
//
// Click uses the original onWork callback.
//
// Scrolling, authorization and other checks
// remain in the parent hook.
// =========================================================

const WorkAction = React.memo(({
    onWork,
}) => {
    const canWork =
        typeof onWork === "function";

    return (
        <button
            type="button"

            onClick={onWork}

            disabled={!canWork}

            aria-label="Muammo ustida ishlashni boshlash"

            className="
                inline-flex
                min-h-12

                w-full
                shrink-0

                items-center
                justify-center
                gap-2.5

                rounded-xl
                border
                border-cyan-500/20

                bg-gradient-to-r
                from-cyan-600
                to-indigo-600

                px-5
                py-3

                font-display
                text-[13px]
                font-black

                text-white

                shadow-lg
                shadow-cyan-500/15

                transition-all
                duration-200

                hover:from-cyan-500
                hover:to-indigo-500

                hover:shadow-cyan-500/25

                active:scale-[0.98]

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-cyan-500
                focus-visible:ring-offset-2

                disabled:cursor-not-allowed
                disabled:opacity-50

                sm:w-auto
                sm:min-w-[180px]

                dark:border-cyan-400/20
                dark:shadow-cyan-950/30

                dark:focus-visible:ring-offset-[#0e1421]

                motion-reduce:transform-none
                motion-reduce:transition-none
            "
        >
            <Hammer
                size={17}
                strokeWidth={2}
                aria-hidden="true"

                className="shrink-0"
            />

            Men ishlayman!
        </button>
    );
});

// =========================================================
// MAIN COMPONENT
// =========================================================

const ProblemDetailPriority = ({
    // =====================================================
    // DATA
    // =====================================================

    problemDetail,

    // =====================================================
    // STATUS
    // =====================================================

    isSolved = false,

    // =====================================================
    // ACTION
    // =====================================================

    onWork,

    // =====================================================
    // OPTIONAL PRESENTATION
    //
    // Default false because ProblemDetailHeader
    // already displays urgent and FCoin badges.
    //
    // Set true if the header stops displaying
    // these badges in a future refactor.
    // =====================================================

    showPriorityBadges = false,
}) => {
    // =====================================================
    // CANONICAL PRIORITY VIEW MODEL
    //
    // Do not normalize backend fields independently.
    // =====================================================

    const {
        isUrgent,
        offeredCoins,
        deadline,
        hasPriorityInformation,
    } = getProblemDetailPriorityViewModel(
        problemDetail
    );

    // =====================================================
    // SAFE VALUES
    // =====================================================

    const urgent = Boolean(isUrgent);

    const coins = getSafeCoins(
        offeredCoins
    );

    const validDeadline =
        hasValidDeadline(deadline);

    const showBadges =
        Boolean(showPriorityBadges) &&
        (urgent || coins > 0);

    // =====================================================
    // WORK ACTION
    // =====================================================

    const showWorkAction =
        !isSolved;

    const canWork =
        showWorkAction &&
        typeof onWork === "function";

    // =====================================================
    // PRIORITY VISIBILITY
    //
    // Unsolved:
    // Always show the section.
    // Even ordinary problems need the action.
    //
    // Solved:
    // Show only if there is something meaningful
    // for this component to display.
    //
    // Urgent/FCoin without a deadline are already
    // visible in ProblemDetailHeader.
    // =====================================================

    const hasVisiblePriorityContent =
        showBadges ||
        validDeadline;

    if (
        isSolved &&
        !hasVisiblePriorityContent
    ) {
        return null;
    }

    // =====================================================
    // NORMAL INFORMATION VISIBILITY
    // =====================================================

    const showNormalInfo =
        !isSolved &&
        !hasVisiblePriorityContent;

    // =====================================================
    // PANEL VARIANT
    // =====================================================

    const variantClass = urgent
        ? `
            border-rose-200
            bg-gradient-to-br
            from-rose-50/85
            via-white
            to-orange-50/50

            dark:border-rose-400/[0.17]
            dark:from-rose-500/[0.065]
            dark:via-[#101725]
            dark:to-orange-500/[0.035]
        `
        : hasPriorityInformation
            ? `
                border-indigo-200
                bg-gradient-to-br
                from-indigo-50/60
                via-white
                to-cyan-50/40

                dark:border-indigo-400/[0.16]
                dark:from-indigo-500/[0.06]
                dark:via-[#101725]
                dark:to-cyan-500/[0.035]
            `
            : `
                border-cyan-200
                bg-gradient-to-br
                from-cyan-50/70
                via-white
                to-indigo-50/45

                dark:border-cyan-400/[0.14]
                dark:from-cyan-500/[0.05]
                dark:via-[#101725]
                dark:to-indigo-500/[0.035]
            `;

    // =====================================================
    // JSX
    // =====================================================

    return (
        <section
            aria-label="Muammo ustuvorligi va yechim harakatlari"

            className={`
                relative

                mb-7

                flex
                w-full
                min-w-0

                flex-col
                items-stretch
                justify-between
                gap-5

                overflow-hidden

                rounded-[22px]
                border

                p-4

                shadow-sm

                sm:rounded-3xl
                sm:p-5

                lg:flex-row
                lg:items-center
                lg:gap-6

                dark:shadow-black/10

                ${variantClass}
            `}
        >
            {/* ======================================
                DECORATIVE GLOW
            ====================================== */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    -right-20
                    -top-20

                    h-48
                    w-48

                    rounded-full

                    bg-cyan-400/[0.055]

                    blur-3xl

                    dark:bg-cyan-400/[0.04]
                "
            />

            {/* ======================================
                MAIN INFORMATION
            ====================================== */}

            <div
                className="
                    relative
                    z-10

                    flex
                    min-w-0
                    flex-1

                    flex-col
                    items-start
                    gap-3
                "
            >
                {/* OPTIONAL BADGES */}

                {showBadges && (
                    <PriorityBadges
                        isUrgent={urgent}

                        offeredCoins={coins}
                    />
                )}

                {/* DEADLINE */}

                {validDeadline && (
                    <DeadlineCard
                        deadline={deadline}
                    />
                )}

                {/* NORMAL / SUMMARY INFORMATION */}

                {showNormalInfo && (
                    <NormalProblemInfo
                        hasPriorityInformation={
                            hasPriorityInformation
                        }
                    />
                )}
            </div>

            {/* ======================================
                WORK ACTION
            ====================================== */}

            {showWorkAction && (
                <div
                    className="
                        relative
                        z-10

                        flex
                        w-full
                        min-w-0

                        justify-end

                        lg:w-auto
                        lg:shrink-0
                    "
                >
                    <WorkAction
                        onWork={
                            canWork
                                ? onWork
                                : undefined
                        }
                    />
                </div>
            )}
        </section>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(
    ProblemDetailPriority
);
