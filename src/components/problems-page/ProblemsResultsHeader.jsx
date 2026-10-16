
import React, { useId } from "react";

import { Loader2 } from "lucide-react";

// =========================================================
// FSOCIETY — PROBLEMS RESULTS HEADER
//
// Features:
// - Light / Dark Mode
// - Responsive layout
// - Safe result range
// - Loading state
// - Accessible result announcements
//
// Existing props preserved.
// =========================================================

// =========================================================
// HELPERS
// =========================================================

const safeNumber = (value) => {
    const number = Number(value);

    if (
        !Number.isFinite(number) ||
        number < 0
    ) {
        return 0;
    }

    return Math.floor(number);
};

const formatNumber = (value) => {
    return value.toLocaleString("uz-UZ");
};

// =========================================================
// MAIN COMPONENT
// =========================================================

const ProblemsResultsHeader = ({
    count = 0,
    start = 0,
    end = 0,
    isLoading = false,
    isResolved = false,
}) => {
    // =====================================================
    // ACCESSIBILITY
    // =====================================================

    const titleId = useId();

    // =====================================================
    // SAFE VALUES
    // =====================================================

    const safeCount = safeNumber(count);
    const safeStart = safeNumber(start);
    const safeEnd = safeNumber(end);

    const loading = Boolean(isLoading);
    const resolved = Boolean(isResolved);

    // =====================================================
    // RESULT RANGE VALIDATION
    // =====================================================

    const hasValidRange =
        resolved &&
        safeCount > 0 &&
        safeStart >= 1 &&
        safeStart <= safeEnd &&
        safeEnd <= safeCount;

    // =====================================================
    // JSX
    // =====================================================

    return (
        <section
            aria-labelledby={titleId}
            aria-busy={loading}

            className="
                mb-5
                flex
                w-full
                min-w-0

                flex-col
                gap-3

                sm:mb-6
                sm:flex-row
                sm:items-end
                sm:justify-between
                sm:gap-5
            "
        >
            {/* ======================================
                SECTION TITLE
            ====================================== */}

            <div className="min-w-0">
                <p
                    className="
                        font-mono
                        text-[10px]
                        font-black
                        uppercase
                        tracking-[0.15em]

                        text-cyan-700

                        dark:text-cyan-400/80
                    "
                >
                    problem.registry
                </p>

                <h2
                    id={titleId}

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
                    Muammolar
                </h2>
            </div>

            {/* ======================================
                RESULT INFORMATION
            ====================================== */}

            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"

                className="
                    flex
                    min-h-9
                    min-w-0

                    flex-wrap
                    items-center
                    gap-3

                    text-xs
                    font-semibold
                    tabular-nums

                    text-slate-600

                    dark:text-gray-400
                "
            >
                {/* VALID RESULT RANGE */}

                {hasValidRange && (
                    <span
                        className="
                            inline-flex
                            items-center
                            gap-1.5

                            rounded-xl
                            border
                            border-slate-200

                            bg-white

                            px-3
                            py-2

                            dark:border-white/[0.09]
                            dark:bg-white/[0.035]
                        "
                    >
                        <strong
                            className="
                                font-black

                                text-slate-900

                                dark:text-white
                            "
                        >
                            {formatNumber(safeStart)}
                            {" — "}
                            {formatNumber(safeEnd)}
                        </strong>

                        <span
                            className="
                                text-slate-400

                                dark:text-gray-500
                            "
                        >
                            /
                        </span>

                        <span>
                            {formatNumber(safeCount)}
                        </span>
                    </span>
                )}

                {/* COUNT WITHOUT VALID RANGE */}

                {resolved &&
                    safeCount > 0 &&
                    !hasValidRange && (
                        <span
                            className="
                                inline-flex
                                rounded-xl
                                border
                                border-slate-200

                                bg-white

                                px-3
                                py-2

                                dark:border-white/[0.09]
                                dark:bg-white/[0.035]
                            "
                        >
                            Jami{" "}
                            <strong
                                className="
                                    ml-1
                                    font-black

                                    text-slate-900

                                    dark:text-white
                                "
                            >
                                {formatNumber(safeCount)}
                            </strong>
                            <span className="ml-1">
                                ta muammo
                            </span>
                        </span>
                    )}

                {/* EMPTY RESULTS */}

                {resolved &&
                    safeCount === 0 &&
                    !loading && (
                        <span
                            className="
                                inline-flex

                                items-center
                                gap-2

                                rounded-xl
                                border
                                border-slate-200

                                bg-white

                                px-3
                                py-2

                                font-mono
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.08em]

                                text-slate-500

                                dark:border-white/[0.09]
                                dark:bg-white/[0.035]
                                dark:text-gray-400
                            "
                        >
                            0 ta muammo
                        </span>
                    )}

                {/* LOADING */}

                {loading && (
                    <span
                        className="
                            inline-flex
                            items-center
                            gap-2

                            text-[11px]
                            font-semibold

                            text-cyan-700

                            dark:text-cyan-300
                        "
                    >
                        <Loader2
                            size={15}
                            aria-hidden="true"

                            className="
                                shrink-0

                                animate-spin
                                motion-reduce:animate-none
                            "
                        />

                        {resolved
                            ? "Yangilanmoqda..."
                            : "Yuklanmoqda..."}
                    </span>
                )}
            </div>
        </section>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(
    ProblemsResultsHeader
);
