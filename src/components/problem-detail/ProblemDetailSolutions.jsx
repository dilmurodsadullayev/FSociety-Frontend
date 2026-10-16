
import React, { memo } from "react";

import {
    CheckCircle2,
    MessageCircleCode,
    Pencil,
    ShieldCheck,
} from "lucide-react";

// =========================================================
// FSOCIETY — SOLUTIONS COMPONENTS
// =========================================================

import ProblemSolutions
    from "../problem-solutions/ProblemSolutions";

import ProblemSolutionForm
    from "../problem-solution-form/ProblemSolutionForm";

// =========================================================
// FSOCIETY — PROBLEM DETAIL SOLUTIONS
//
// Responsibilities:
//
// 1. Display all problem solutions
// 2. Refresh solutions after submission
// 3. Support owner accepting a solution
// 4. Render new solution form
// 5. Render solved problem state
// 6. Preserve scrolling references
// 7. Support light and dark themes
//
// Existing public props:
//
// - problemId
// - responseCount
// - responsesRefreshKey
// - problemLanguages
// - isOwner
// - isSolved
// - responsesSectionRef
// - responseFormRef
// - onWork
// - onSolutionCreated
// - onAcceptSolution
//
// IMPORTANT:
//
// The actual solutions API and Star actions
// are handled by ProblemSolutions.
//
// The submit API and form validation are
// handled by ProblemSolutionForm.
//
// No API logic is duplicated here.
// =========================================================

// =========================================================
// SHARED STYLES
// =========================================================

const CARD_CLASS = `
    relative
    w-full
    min-w-0

    overflow-hidden

    rounded-[22px]

    border
    border-slate-200

    bg-white/95

    shadow-[0_12px_40px_rgba(15,23,42,0.045)]

    backdrop-blur-sm

    sm:rounded-[28px]

    dark:border-white/[0.09]
    dark:bg-[#0e1421]/95

    dark:shadow-[0_18px_50px_rgba(0,0,0,0.18)]
`;

const SYSTEM_LABEL_CLASS = `
    font-mono
    text-[10px]
    font-black
    uppercase
    tracking-[0.12em]

    text-cyan-700

    dark:text-cyan-400/80
`;

// =========================================================
// HELPERS
// =========================================================

const getSafeCount = (value) => {
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
        number < 0
    ) {
        return 0;
    }

    return Math.floor(number);
};

const hasValidProblemId = (value) => {
    return (
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ""
    );
};

// =========================================================
// MISSING PROBLEM ID
//
// Shared fallback for:
//
// - Solutions list
// - New solution form
// =========================================================

const MissingProblemId = memo(({
    message = "Muammo identifikatori topilmadi.",
}) => {
    return (
        <div
            role="status"

            className="
                flex
                min-h-[160px]
                w-full
                min-w-0

                items-center
                justify-center

                rounded-2xl

                border
                border-dashed
                border-slate-300

                bg-slate-50

                px-4
                py-8

                text-center
                text-sm
                font-medium
                leading-6

                text-slate-600

                dark:border-white/[0.12]
                dark:bg-white/[0.025]
                dark:text-gray-400
            "
        >
            <p className="max-w-md">
                {message}
            </p>
        </div>
    );
});

// =========================================================
// SOLUTIONS HEADER
//
// Contains:
//
// - Section label
// - Solutions title
// - Response count
// - Solved indicator
// - Description
// - Write solution button
// =========================================================

const SolutionsHeader = memo(({
    responseCount = 0,

    isSolved = false,
    canWrite = false,

    onWork,
}) => {
    // =====================================================
    // SAFE RESPONSE COUNT
    // =====================================================

    const count = getSafeCount(
        responseCount
    );

    const formattedCount = count.toLocaleString(
        "uz-UZ"
    );

    // =====================================================
    // ACTION STATE
    // =====================================================

    const isWriteDisabled =
        isSolved ||
        !canWrite ||
        typeof onWork !== "function";

    // =====================================================
    // JSX
    // =====================================================

    return (
        <div
            className="
                relative
                w-full
                min-w-0

                border-b
                border-slate-200

                bg-slate-50/65

                px-4
                py-5

                sm:px-6
                sm:py-6

                dark:border-white/[0.08]
                dark:bg-white/[0.025]
            "
        >
            <div
                className="
                    flex
                    w-full
                    min-w-0

                    flex-col
                    gap-4

                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    sm:gap-5
                "
            >
                {/* ==================================
                    TITLE GROUP
                ================================== */}

                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >
                    {/* SYSTEM LABEL */}

                    <p
                        className={SYSTEM_LABEL_CLASS}
                    >
                        fsociety://solutions
                    </p>

                    {/* TITLE / COUNT / STATUS */}

                    <div
                        className="
                            mt-1

                            flex
                            min-w-0

                            flex-wrap
                            items-center
                            gap-3
                        "
                    >
                        {/* TITLE */}

                        <h2
                            id="problem-solutions-title"

                            className="
                                font-display
                                text-xl
                                font-black
                                tracking-tight

                                text-slate-900

                                sm:text-2xl

                                dark:text-white
                            "
                        >
                            Yechimlar
                        </h2>

                        {/* RESPONSE COUNT */}

                        <span
                            aria-label={
                                `${formattedCount} ta yechim`
                            }

                            title={
                                `${formattedCount} ta yechim`
                            }

                            className="
                                inline-flex
                                min-h-8
                                min-w-8

                                shrink-0

                                items-center
                                justify-center

                                rounded-full

                                border
                                border-cyan-300/60

                                bg-cyan-50

                                px-2.5
                                py-1.5

                                font-mono
                                text-xs
                                font-black
                                tabular-nums

                                text-cyan-800

                                dark:border-cyan-400/25
                                dark:bg-cyan-400/[0.08]
                                dark:text-cyan-300
                            "
                        >
                            {formattedCount}
                        </span>

                        {/* SOLVED INDICATOR */}

                        {isSolved && (
                            <span
                                className="
                                    inline-flex
                                    min-h-8

                                    items-center
                                    gap-1.5

                                    rounded-full

                                    border
                                    border-emerald-300

                                    bg-emerald-50

                                    px-2.5
                                    py-1.5

                                    text-[10px]
                                    font-bold

                                    text-emerald-800

                                    dark:border-emerald-400/25
                                    dark:bg-emerald-400/[0.08]
                                    dark:text-emerald-300
                                "
                            >
                                <CheckCircle2
                                    size={13}
                                    strokeWidth={2}

                                    aria-hidden="true"

                                    className="shrink-0"
                                />

                                Yechilgan
                            </span>
                        )}
                    </div>

                    {/* DESCRIPTION */}

                    <p
                        className="
                            mt-2

                            max-w-xl

                            text-[13px]
                            font-medium
                            leading-6

                            text-slate-600

                            dark:text-gray-400
                        "
                    >
                        Community tomonidan yozilgan
                        barcha yechimlar.
                    </p>
                </div>

                {/* ==================================
                    WRITE SOLUTION ACTION

                    The parent hook handles:
                    - Scrolling
                    - Authentication checks
                    - Form focus
                ================================== */}

                {!isSolved && (
                    <button
                        type="button"

                        onClick={onWork}

                        disabled={isWriteDisabled}

                        aria-label="Yangi yechim yozish"

                        className="
                            inline-flex
                            min-h-11
                            w-full
                            shrink-0

                            items-center
                            justify-center
                            gap-2

                            self-start

                            rounded-xl

                            border
                            border-cyan-300/70

                            bg-cyan-50

                            px-4
                            py-2.5

                            font-display
                            text-xs
                            font-black

                            text-cyan-800

                            transition-colors
                            duration-200

                            hover:border-cyan-400
                            hover:bg-cyan-100

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-cyan-500

                            disabled:cursor-not-allowed
                            disabled:opacity-40

                            sm:w-auto
                            sm:self-auto

                            dark:border-cyan-400/25
                            dark:bg-cyan-400/[0.08]
                            dark:text-cyan-300

                            dark:hover:bg-cyan-400/[0.14]

                            motion-reduce:transition-none
                        "
                    >
                        <Pencil
                            size={16}
                            strokeWidth={1.9}

                            aria-hidden="true"

                            className="shrink-0"
                        />

                        Yechim yozish
                    </button>
                )}
            </div>
        </div>
    );
});

// =========================================================
// SOLUTIONS LIST
//
// IMPORTANT:
//
// ProblemSolutions receives the refreshKey prop
// directly.
//
// Do not use responsesRefreshKey in the React key,
// otherwise the entire component remounts and
// loses its existing local state.
//
// It may remount when the problem ID changes,
// which is intentional.
// =========================================================

const SolutionsList = memo(({
    problemId,

    responsesRefreshKey = 0,

    isOwner = false,
    isSolved = false,

    onAcceptSolution,
}) => {
    // =====================================================
    // VALIDATE PROBLEM ID
    // =====================================================

    const validProblemId =
        hasValidProblemId(problemId);

    // =====================================================
    // JSX
    // =====================================================

    return (
        <div
            className="
                w-full
                min-w-0

                max-h-[780px]

                overflow-y-auto
                overscroll-contain

                px-3
                py-5

                sm:px-5

                lg:max-h-[850px]
                lg:px-6

                [scrollbar-width:thin]
                [scrollbar-color:rgba(100,116,139,0.35)_transparent]
            "
        >
            {validProblemId ? (
                <ProblemSolutions
                    key={
                        `problem-solutions-${problemId}`
                    }

                    id={problemId}

                    isOwner={isOwner}
                    isSolved={isSolved}

                    refreshKey={
                        responsesRefreshKey
                    }

                    onAcceptSolution={
                        onAcceptSolution
                    }
                />
            ) : (
                <MissingProblemId
                    message={
                        "Muammo identifikatori " +
                        "topilmadi."
                    }
                />
            )}
        </div>
    );
});

// =========================================================
// SOLUTIONS LIST SECTION
//
// Preserves responsesSectionRef.
//
// Used by:
//
// - onWork navigation
// - Solution created scroll
// - Problem detail solution controller
// =========================================================

const SolutionsListSection = memo(({
    problemId,

    responseCount = 0,
    responsesRefreshKey = 0,

    isOwner = false,
    isSolved = false,

    responsesSectionRef,

    onWork,
    onAcceptSolution,
}) => {
    // =====================================================
    // ID AND ACTION STATE
    // =====================================================

    const validProblemId =
        hasValidProblemId(problemId);

    const canWrite =
        validProblemId &&
        !isSolved &&
        typeof onWork === "function";

    // =====================================================
    // JSX
    // =====================================================

    return (
        <section
            ref={responsesSectionRef}

            aria-labelledby="problem-solutions-title"

            className={`
                ${CARD_CLASS}

                scroll-mt-28
            `}
        >
            {/* ======================================
                TOP ACCENT
            ====================================== */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    inset-x-0
                    top-0

                    h-[2px]

                    bg-gradient-to-r
                    from-cyan-500/70
                    via-indigo-500/60
                    to-transparent

                    dark:from-cyan-400/65
                    dark:via-indigo-400/50
                "
            />

            {/* ======================================
                SOLUTIONS HEADER
            ====================================== */}

            <SolutionsHeader
                responseCount={responseCount}

                isSolved={isSolved}

                canWrite={canWrite}

                onWork={onWork}
            />

            {/* ======================================
                SOLUTIONS LIST

                Loading, empty and error states
                are handled by ProblemSolutions.
            ====================================== */}

            <SolutionsList
                problemId={problemId}

                responsesRefreshKey={
                    responsesRefreshKey
                }

                isOwner={isOwner}
                isSolved={isSolved}

                onAcceptSolution={
                    onAcceptSolution
                }
            />
        </section>
    );
});

// =========================================================
// NEW SOLUTION FORM SECTION
//
// Responsibilities:
//
// - Preserve responseFormRef
// - Show form title and description
// - Render ProblemSolutionForm
// - Preserve the original API callback contract
// =========================================================

const NewSolutionFormSection = memo(({
    problemId,

    problemLanguages = [],

    responseFormRef,

    onSolutionCreated,
}) => {
    // =====================================================
    // VALIDATE ID
    // =====================================================

    const validProblemId =
        hasValidProblemId(problemId);

    // =====================================================
    // SAFE LANGUAGE DATA
    // =====================================================

    const safeLanguages =
        Array.isArray(problemLanguages)
            ? problemLanguages
            : [];

    // =====================================================
    // JSX
    // =====================================================

    return (
        <section
            ref={responseFormRef}

            aria-labelledby="new-solution-title"

            className={`
                ${CARD_CLASS}

                scroll-mt-28

                border-cyan-200

                dark:border-cyan-400/20
            `}
        >
            {/* ======================================
                TOP ACCENT
            ====================================== */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    inset-x-0
                    top-0

                    h-[2px]

                    bg-gradient-to-r
                    from-cyan-500
                    via-indigo-500/70
                    to-transparent
                "
            />

            {/* ======================================
                SECTION BODY
            ====================================== */}

            <div
                className="
                    relative

                    w-full
                    min-w-0

                    p-4

                    sm:p-6
                    lg:p-7
                "
            >
                {/* ==================================
                    SECTION HEADER
                ================================== */}

                <div className="mb-6">
                    {/* ICON */}

                    <div
                        aria-hidden="true"

                        className="
                            mb-3

                            flex
                            h-10
                            w-10

                            items-center
                            justify-center

                            rounded-xl

                            border
                            border-cyan-200

                            bg-cyan-50

                            text-cyan-700

                            dark:border-cyan-400/20
                            dark:bg-cyan-400/[0.08]
                            dark:text-cyan-300
                        "
                    >
                        <MessageCircleCode
                            size={19}
                            strokeWidth={1.9}
                        />
                    </div>

                    {/* SYSTEM LABEL */}

                    <p className={SYSTEM_LABEL_CLASS}>
                        fsociety://new-solution
                    </p>

                    {/* TITLE */}

                    <h2
                        id="new-solution-title"

                        className="
                            mt-1

                            font-display
                            text-xl
                            font-black
                            tracking-tight

                            text-slate-900

                            sm:text-2xl

                            dark:text-white
                        "
                    >
                        O‘z yechimingizni yozing
                    </h2>

                    {/* DESCRIPTION */}

                    <p
                        className="
                            mt-2

                            max-w-2xl

                            text-[13px]
                            font-medium
                            leading-6

                            text-slate-600

                            dark:text-gray-400
                        "
                    >
                        Kodingizni, tushuntirishingizni
                        va xatoni qanday tuzatganingizni
                        aniq yozing.
                    </p>
                </div>

                {/* ==================================
                    NEW SOLUTION FORM

                    Public props:
                    - id
                    - problemLanguages
                    - onSuccess

                    The POST request and validation
                    remain inside ProblemSolutionForm.
                ================================== */}

                {validProblemId ? (
                    <ProblemSolutionForm
                        key={
                            `solution-form-${problemId}`
                        }

                        id={problemId}

                        problemLanguages={
                            safeLanguages
                        }

                        onSuccess={
                            onSolutionCreated
                        }
                    />
                ) : (
                    <MissingProblemId
                        message={
                            "Yechim yuborish uchun " +
                            "muammo ID mavjud emas."
                        }
                    />
                )}
            </div>
        </section>
    );
});

// =========================================================
// SOLVED PROBLEM INFORMATION
//
// Preserve the solved state UI.
//
// Existing solutions remain visible.
//
// The new solution form must not be rendered
// for an already solved problem.
// =========================================================

const SolvedProblemInformation = memo(() => {
    return (
        <section
            aria-label="Muammo yechilgan"

            className="
                relative

                w-full
                min-w-0

                overflow-hidden

                rounded-[22px]

                border
                border-emerald-200

                bg-gradient-to-br
                from-emerald-50
                to-white

                px-4
                py-8

                text-center

                sm:rounded-[28px]
                sm:px-6
                sm:py-10

                dark:border-emerald-400/20
                dark:from-emerald-400/[0.08]
                dark:to-[#0e1421]
            "
        >
            {/* ======================================
                DECORATIVE ACCENT
            ====================================== */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    -right-16
                    -top-16

                    h-48
                    w-48

                    rounded-full

                    bg-emerald-400/[0.08]

                    blur-3xl

                    dark:bg-emerald-400/[0.05]
                "
            />

            {/* ======================================
                CONTENT
            ====================================== */}

            <div className="relative">
                {/* ICON */}

                <div
                    aria-hidden="true"

                    className="
                        mx-auto
                        mb-4

                        flex
                        h-14
                        w-14

                        items-center
                        justify-center

                        rounded-2xl

                        border
                        border-emerald-300

                        bg-emerald-100

                        text-emerald-700

                        dark:border-emerald-400/20
                        dark:bg-emerald-400/[0.10]
                        dark:text-emerald-300
                    "
                >
                    <ShieldCheck
                        size={26}
                        strokeWidth={1.8}
                    />
                </div>

                {/* TITLE */}

                <h3
                    className="
                        font-display
                        text-xl
                        font-black

                        text-slate-900

                        dark:text-white
                    "
                >
                    Bu muammo yechilgan
                </h3>

                {/* DESCRIPTION */}

                <p
                    className="
                        mx-auto
                        mt-3

                        max-w-lg

                        text-[13px]
                        font-medium
                        leading-6

                        text-slate-600

                        sm:text-sm

                        dark:text-gray-400
                    "
                >
                    Yangi yechim yozish yopilgan.
                    Mavjud yechimlarni yuqoridagi
                    blokda ko‘rishingiz mumkin.
                </p>
            </div>
        </section>
    );
});

// =========================================================
// MAIN COMPONENT
//
// Existing ProblemDetailLayout contract preserved.
// =========================================================

const ProblemDetailSolutions = ({
    // =====================================================
    // PROBLEM
    // =====================================================

    problemId,

    // =====================================================
    // RESPONSES
    // =====================================================

    responseCount = 0,
    responsesRefreshKey = 0,

    // =====================================================
    // LANGUAGES
    // =====================================================

    problemLanguages = [],

    // =====================================================
    // PERMISSIONS / STATUS
    // =====================================================

    isOwner = false,
    isSolved = false,

    // =====================================================
    // SCROLL REFERENCES
    // =====================================================

    responsesSectionRef,
    responseFormRef,

    // =====================================================
    // ACTIONS
    // =====================================================

    onWork,

    onSolutionCreated,

    onAcceptSolution,
}) => {
    // =====================================================
    // SAFE LANGUAGE DATA
    // =====================================================

    const safeLanguages =
        Array.isArray(problemLanguages)
            ? problemLanguages.filter(Boolean)
            : [];

    // =====================================================
    // JSX
    // =====================================================

    return (
        <div
            className="
                flex
                w-full
                min-w-0

                flex-col

                gap-6

                sm:gap-8
            "
        >
            {/* ======================================
                EXISTING SOLUTIONS

                Always visible for both:
                - Pending problems
                - Solved problems
            ====================================== */}

            <SolutionsListSection
                problemId={problemId}

                responseCount={responseCount}

                responsesRefreshKey={
                    responsesRefreshKey
                }

                isOwner={isOwner}
                isSolved={isSolved}

                responsesSectionRef={
                    responsesSectionRef
                }

                onWork={onWork}

                onAcceptSolution={
                    onAcceptSolution
                }
            />

            {/* ======================================
                NEW SOLUTION FORM

                Only for unsolved problems.
            ====================================== */}

            {!isSolved ? (
                <NewSolutionFormSection
                    problemId={problemId}

                    problemLanguages={
                        safeLanguages
                    }

                    responseFormRef={
                        responseFormRef
                    }

                    onSolutionCreated={
                        onSolutionCreated
                    }
                />
            ) : (
                /* ==================================
                    SOLVED STATE

                    Hide the solution form, but keep
                    the solutions list accessible.
                ================================== */

                <SolvedProblemInformation />
            )}
        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProblemDetailSolutions);
