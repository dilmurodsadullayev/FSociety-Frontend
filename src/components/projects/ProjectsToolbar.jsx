
import React from "react";

import {
    FolderKanban,
    Loader2,
    Search,
} from "lucide-react";

// =========================================================
// FSOCIETY — PROJECTS TOOLBAR
//
// Features:
// - Dark / Light Mode
// - Responsive layout
// - Project result count
// - Pagination result range
// - Active search indicator
// - Loading indicator
//
// Data and handlers remain in Projects.jsx.
// =========================================================

const ProjectsToolbar = ({
    sectionRef,
    isLoading = false,
    count = 0,
    rangeStart = 0,
    rangeEnd = 0,
    search = "",
}) => {
    // =====================================================
    // SAFE VALUES
    // =====================================================

    const totalCount = Math.max(
        0,
        Number(count) || 0
    );

    const start = Math.max(
        0,
        Number(rangeStart) || 0
    );

    const end = Math.max(
        0,
        Number(rangeEnd) || 0
    );

    const searchQuery = String(search || "").trim();

    const hasSearch = Boolean(searchQuery);

    // =====================================================
    // RESULT LABEL
    // =====================================================

    const resultLabel = totalCount > 0
        ? `${start}–${end} / ${totalCount}`
        : "0 project";

    // =====================================================
    // JSX
    // =====================================================

    return (
        <div
            ref={sectionRef}
            aria-busy={Boolean(isLoading)}
            className="
                relative
                min-w-0

                scroll-mt-24

                mt-6

                flex
                flex-col
                gap-3

                sm:mt-7
                sm:flex-row
                sm:items-center
                sm:justify-between
            "
        >
            {/* ======================================
                LEFT — PROJECT REGISTRY
            ====================================== */}

            <div className="min-w-0">

                {/* TITLE */}

                <div
                    className="
                        flex
                        min-w-0
                        items-center
                        gap-2.5
                    "
                >
                    {/* ICON */}

                    <div
                        className="
                            grid
                            h-8
                            w-8
                            shrink-0
                            place-items-center

                            rounded-lg
                            border
                            border-cyan-400/25

                            bg-cyan-500/[0.08]

                            text-cyan-700

                            dark:border-cyan-400/15
                            dark:bg-cyan-400/[0.055]
                            dark:text-cyan-300
                        "
                    >
                        <FolderKanban
                            size={16}
                            strokeWidth={1.9}
                            aria-hidden="true"
                        />
                    </div>

                    {/* LABEL */}

                    <h2
                        className="
                            min-w-0

                            text-[15px]
                            font-black
                            tracking-tight

                            text-slate-900

                            sm:text-base

                            dark:text-gray-100
                        "
                    >
                        Project Registry
                    </h2>

                    {/* LOADING */}

                    {isLoading && (
                        <span
                            role="status"
                            aria-label="Loyihalar yuklanmoqda"
                            className="
                                inline-flex
                                shrink-0
                                items-center
                                gap-1.5

                                text-cyan-700

                                dark:text-cyan-300
                            "
                        >
                            <Loader2
                                size={15}
                                strokeWidth={2}
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
                </div>

                {/* RESULT RANGE */}

                <div
                    className="
                        mt-1.5
                        flex
                        flex-wrap
                        items-center
                        gap-2

                        pl-[42px]
                    "
                >
                    <span
                        className="
                            font-mono
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.09em]

                            text-slate-500

                            dark:text-gray-500
                        "
                    >
                        {resultLabel}
                    </span>

                    {totalCount > 0 && (
                        <span
                            aria-hidden="true"
                            className="
                                h-1
                                w-1

                                rounded-full

                                bg-slate-300

                                dark:bg-gray-700
                            "
                        />
                    )}

                    {totalCount > 0 && (
                        <span
                            className="
                                font-mono
                                text-[10px]
                                font-medium

                                text-slate-500

                                dark:text-gray-600
                            "
                        >
                            loyihalar
                        </span>
                    )}
                </div>
            </div>

            {/* ======================================
                RIGHT — ACTIVE SEARCH
            ====================================== */}

            {hasSearch && (
                <div
                    className="
                        flex
                        min-w-0
                        w-fit
                        max-w-full

                        items-center
                        gap-2

                        self-start

                        rounded-xl
                        border
                        border-[#dce5f0]

                        bg-white/85

                        px-3
                        py-2.5

                        shadow-[0_3px_12px_rgba(15,23,42,0.025)]

                        sm:self-auto

                        dark:border-white/[0.08]
                        dark:bg-white/[0.035]
                        dark:shadow-none
                    "
                    title={`Qidiruv: ${searchQuery}`}
                >
                    {/* SEARCH ICON */}

                    <Search
                        size={14}
                        strokeWidth={2}
                        aria-hidden="true"
                        className="
                            shrink-0
                            text-indigo-600

                            dark:text-cyan-300
                        "
                    />

                    {/* PREFIX */}

                    <span
                        className="
                            shrink-0

                            font-mono
                            text-[10px]
                            font-bold

                            text-slate-500

                            dark:text-gray-500
                        "
                    >
                        search://
                    </span>

                    {/* SEARCH TERM */}

                    <span
                        className="
                            block
                            min-w-0
                            max-w-[170px]

                            truncate

                            font-mono
                            text-[11px]
                            font-bold

                            text-indigo-700

                            sm:max-w-[240px]

                            dark:text-cyan-300
                        "
                    >
                        {searchQuery}
                    </span>
                </div>
            )}
        </div>
    );
};

export default React.memo(ProjectsToolbar);
