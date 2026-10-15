
import React from "react";

import {
    FolderKanban,
    SearchX,
    X,
} from "lucide-react";

// =========================================================
// FSOCIETY — PROJECTS EMPTY STATE
//
// Features:
// - Dark / Light Mode
// - Responsive design
// - Empty projects state
// - No search results state
// - Clear search button
// - Accessible status announcement
//
// Existing props preserved:
// - hasSearch
// - onClearSearch
// =========================================================

const ProjectsEmptyState = ({
    hasSearch = false,
    onClearSearch,
}) => {
    // =====================================================
    // STATE
    // =====================================================

    const isSearching = Boolean(hasSearch);

    const canClearSearch =
        isSearching &&
        typeof onClearSearch === "function";

    // =====================================================
    // CONTENT
    // =====================================================

    const title = isSearching
        ? "Hech narsa topilmadi"
        : "Projectlar hali yo‘q";

    const description = isSearching
        ? (
            "Qidiruvga mos loyiha topilmadi. " +
            "Boshqa so‘z yoki texnologiya nomi bilan " +
            "qayta urinib ko‘ring."
        )
        : (
            "Community tomonidan yaratilgan loyihalar " +
            "shu yerda paydo bo‘ladi. Yangi loyihalarni " +
            "tez orada shu sahifada ko‘rishingiz mumkin."
        );

    const StateIcon = isSearching
        ? SearchX
        : FolderKanban;

    // =====================================================
    // JSX
    // =====================================================

    return (
        <div
            role="status"
            aria-labelledby="projects-empty-title"
            aria-describedby="projects-empty-description"

            className="
                relative
                isolate
                col-span-full

                flex
                min-h-[310px]
                w-full
                min-w-0

                flex-col
                items-center
                justify-center

                overflow-hidden

                rounded-2xl
                border
                border-dashed
                border-[#cbd8e9]

                bg-white/85

                px-4
                py-14

                text-center

                shadow-[0_8px_30px_rgba(15,23,42,0.025)]

                sm:min-h-[340px]
                sm:px-8
                sm:py-16

                dark:border-white/[0.09]
                dark:bg-[#0d1117]
                dark:shadow-none
            "
        >
            {/* ======================================
                BACKGROUND GRID
            ====================================== */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    inset-0
                    z-0

                    opacity-[0.025]

                    text-slate-900

                    [background-image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)]
                    [background-size:28px_28px]

                    dark:opacity-[0.025]
                    dark:text-white
                "
            />

            {/* ======================================
                BACKGROUND GLOW
            ====================================== */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    left-1/2
                    top-1/2

                    h-56
                    w-56

                    -translate-x-1/2
                    -translate-y-1/2

                    rounded-full

                    bg-cyan-500/[0.055]

                    blur-[80px]

                    dark:bg-cyan-400/[0.045]
                "
            />

            {/* ======================================
                CONTENT
            ====================================== */}

            <div
                className="
                    relative
                    z-10

                    flex
                    w-full
                    max-w-lg
                    min-w-0

                    flex-col
                    items-center
                "
            >
                {/* ==================================
                    ICON WRAPPER
                ================================== */}

                <div
                    className="
                        relative

                        grid
                        h-[68px]
                        w-[68px]
                        shrink-0

                        place-items-center

                        rounded-[20px]
                        border
                        border-cyan-400/25

                        bg-gradient-to-br
                        from-cyan-500/[0.10]
                        to-indigo-500/[0.055]

                        text-cyan-700

                        shadow-[0_8px_24px_rgba(8,145,178,0.045)]

                        dark:border-cyan-400/15
                        dark:from-cyan-400/[0.08]
                        dark:to-indigo-400/[0.035]

                        dark:text-cyan-300
                        dark:shadow-none
                    "
                >
                    <StateIcon
                        size={29}
                        strokeWidth={1.7}
                        aria-hidden="true"
                    />
                </div>

                {/* ==================================
                    EYEBROW
                ================================== */}

                <span
                    className="
                        mt-5

                        inline-flex
                        items-center
                        gap-2

                        rounded-full
                        border
                        border-[#dae5f2]

                        bg-[#f3f7fd]

                        px-3
                        py-1.5

                        font-mono
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.12em]

                        text-slate-500

                        dark:border-white/[0.08]
                        dark:bg-white/[0.035]
                        dark:text-gray-500
                    "
                >
                    <span
                        aria-hidden="true"

                        className="
                            h-1.5
                            w-1.5

                            rounded-full

                            bg-cyan-500

                            dark:bg-cyan-400
                        "
                    />

                    {isSearching
                        ? "registry://no_results"
                        : "registry://empty"}
                </span>

                {/* ==================================
                    TITLE
                ================================== */}

                <h3
                    id="projects-empty-title"

                    className="
                        mt-4

                        break-words

                        text-[18px]
                        font-black
                        leading-snug
                        tracking-tight

                        text-slate-900

                        sm:text-[21px]

                        dark:text-gray-100
                    "
                >
                    {title}
                </h3>

                {/* ==================================
                    DESCRIPTION
                ================================== */}

                <p
                    id="projects-empty-description"

                    className="
                        mx-auto
                        mt-2.5

                        max-w-sm

                        break-words

                        text-[12px]
                        font-medium
                        leading-6

                        text-slate-600

                        sm:text-[13px]
                        sm:leading-7

                        dark:text-gray-400
                    "
                >
                    {description}
                </p>

                {/* ==================================
                    CLEAR SEARCH
                ================================== */}

                {canClearSearch && (
                    <button
                        type="button"

                        onClick={onClearSearch}

                        className="
                            group/clear

                            mt-6

                            inline-flex
                            min-h-11
                            max-w-full

                            items-center
                            justify-center

                            gap-2.5

                            rounded-xl
                            border
                            border-[#d4e0ef]

                            bg-white

                            px-4
                            py-2.5

                            text-[12px]
                            font-bold

                            text-slate-700

                            shadow-[0_3px_12px_rgba(15,23,42,0.035)]

                            transition-all
                            duration-150

                            hover:border-cyan-400/45
                            hover:bg-cyan-500/[0.055]
                            hover:text-cyan-800

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-cyan-500
                            focus-visible:ring-offset-2

                            dark:border-white/[0.10]
                            dark:bg-white/[0.035]
                            dark:text-gray-300

                            dark:hover:border-cyan-400/25
                            dark:hover:bg-cyan-400/[0.065]
                            dark:hover:text-cyan-300

                            dark:focus-visible:ring-offset-[#0d1117]
                        "
                    >
                        <X
                            size={15}
                            strokeWidth={2}
                            aria-hidden="true"

                            className="
                                shrink-0

                                transition-transform
                                duration-150

                                group-hover/clear:rotate-90

                                motion-reduce:transform-none
                            "
                        />

                        <span>
                            Qidiruvni tozalash
                        </span>
                    </button>
                )}
            </div>

            {/* ======================================
                BOTTOM ACCENT
            ====================================== */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    inset-x-0
                    bottom-0

                    h-px

                    bg-gradient-to-r
                    from-transparent
                    via-cyan-400/30
                    to-transparent

                    dark:via-cyan-400/15
                "
            />
        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(ProjectsEmptyState);
