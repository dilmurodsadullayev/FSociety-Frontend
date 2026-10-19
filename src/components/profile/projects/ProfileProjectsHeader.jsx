
import React, { memo, useId } from "react";

import {
    Loader2,
    Plus,
    Search,
    Sparkles,
    X,
} from "lucide-react";

// =========================================================
// FSOCIETY — PROFILE PROJECTS HEADER
//
// Props:
//
// search:
//   Controlled search text.
//
// onSearchChange:
//   Called with a string, not an event.
//
// isOwner:
//   Whether the visitor owns this profile.
//
// onCreateProject:
//   Opens CreateProjectModal.
//
// isLoading:
//   Optional search loading indicator.
//
// isSubmitting:
//   Optional project creation loading state.
//
// This component does not:
// - Fetch projects
// - Filter a local project array
// - Store separate search state
// - Manage pagination
// =========================================================

const ProfileProjectsHeader = ({
    search = "",
    onSearchChange,
    isOwner = false,
    onCreateProject,
    isLoading = false,
    isSubmitting = false,
}) => {
    // =====================================================
    // ACCESSIBLE INPUT ID
    // =====================================================

    const searchId = useId();

    // =====================================================
    // SAFE VALUES
    // =====================================================

    const searchValue =
        typeof search === "string"
            ? search
            : String(search ?? "");

    const hasSearch =
        searchValue.length > 0;

    const canCreate =
        Boolean(isOwner) &&
        typeof onCreateProject === "function";

    // =====================================================
    // SEARCH HANDLERS
    // =====================================================

    const handleSearchChange = (event) => {
        onSearchChange?.(event.target.value);
    };

    const handleClearSearch = () => {
        onSearchChange?.("");
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <section
            aria-label="Profil loyihalarini boshqarish"
            className="
                relative
                isolate
                min-w-0
                overflow-hidden

                rounded-3xl
                border

                border-slate-200
                bg-white/95

                p-4
                shadow-sm

                sm:p-5
                lg:p-6

                dark:border-white/[0.08]
                dark:bg-[#0d131d]/95
                dark:shadow-xl
                dark:shadow-black/20
            "
        >
            {/* =============================================
                BACKGROUND DECORATIONS
            ============================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none

                    absolute
                    -right-24
                    -top-24

                    h-52
                    w-52

                    rounded-full
                    bg-indigo-500/[0.07]
                    blur-3xl

                    dark:bg-indigo-500/[0.10]
                "
            />

            <div
                aria-hidden="true"
                className="
                    pointer-events-none

                    absolute
                    -bottom-24
                    -left-24

                    h-52
                    w-52

                    rounded-full
                    bg-purple-500/[0.05]
                    blur-3xl

                    dark:bg-purple-500/[0.08]
                "
            />

            {/* =============================================
                MAIN CONTENT
            ============================================== */}

            <div
                className="
                    relative
                    z-10

                    flex
                    min-w-0

                    flex-col
                    gap-5

                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                "
            >
                {/* =========================================
                    TITLE AND DESCRIPTION
                ========================================== */}

                <div className="min-w-0 flex-1">
                    {/* PROFILE BADGE */}

                    <div
                        className="
                            mb-3
                            inline-flex
                            max-w-full

                            items-center
                            gap-2

                            rounded-full
                            border

                            border-indigo-200
                            bg-indigo-50

                            px-3
                            py-1.5

                            text-[10px]
                            font-black

                            uppercase
                            tracking-[0.14em]

                            text-indigo-700

                            dark:border-indigo-400/20
                            dark:bg-indigo-500/[0.09]
                            dark:text-indigo-300

                            sm:text-[11px]
                        "
                    >
                        <Sparkles
                            size={14}
                            aria-hidden="true"
                            className="shrink-0"
                        />

                        <span className="truncate">
                            Profile Projects
                        </span>
                    </div>

                    {/* HEADING */}

                    <h3
                        className="
                            text-xl
                            font-black
                            tracking-tight

                            text-slate-900

                            dark:text-white

                            sm:text-2xl
                        "
                    >
                        Loyihalar
                    </h3>

                    {/* DESCRIPTION */}

                    <p
                        className="
                            mt-1.5
                            max-w-xl

                            text-xs
                            font-medium
                            leading-5

                            text-slate-500

                            dark:text-slate-400

                            sm:text-sm
                            sm:leading-6
                        "
                    >
                        Portfolio, real ishlar va community
                        uchun yaratilgan loyihalar.
                    </p>
                </div>

                {/* =========================================
                    ACTIONS
                ========================================== */}

                <div
                    className="
                        flex
                        w-full
                        min-w-0

                        flex-col
                        gap-3

                        sm:flex-row
                        sm:items-center

                        lg:w-auto
                        lg:shrink-0
                    "
                >
                    {/* =====================================
                        SEARCH
                    ====================================== */}

                    <div
                        className="
                            relative
                            min-w-0
                            flex-1

                            sm:min-w-[220px]
                            lg:w-64
                            lg:flex-none
                        "
                    >
                        {/* SEARCH ICON */}

                        <Search
                            size={17}
                            aria-hidden="true"
                            className="
                                pointer-events-none

                                absolute
                                left-4
                                top-1/2

                                -translate-y-1/2

                                text-slate-400
                                dark:text-slate-500
                            "
                        />

                        {/* SEARCH INPUT */}

                        <label
                            htmlFor={searchId}
                            className="sr-only"
                        >
                            Profil loyihalarini qidirish
                        </label>

                        <input
                            id={searchId}
                            type="search"
                            name="profile-project-search"
                            value={searchValue}
                            onChange={handleSearchChange}
                            placeholder="Loyiha qidirish..."
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck={false}
                            enterKeyHint="search"
                            aria-label="Loyihalarni qidirish"
                            aria-controls="profile-projects-list"
                            className="
                                h-12
                                w-full
                                min-w-0

                                rounded-2xl
                                border

                                border-slate-200
                                bg-slate-50/90

                                py-3
                                pl-11
                                pr-11

                                text-sm
                                font-semibold

                                text-slate-900

                                outline-none

                                transition-all
                                duration-200

                                placeholder:text-slate-400

                                hover:border-slate-300

                                focus:border-indigo-500
                                focus:bg-white
                                focus:ring-2
                                focus:ring-indigo-500/15

                                dark:border-white/[0.09]
                                dark:bg-black/25
                                dark:text-white

                                dark:placeholder:text-slate-500

                                dark:hover:border-white/[0.16]

                                dark:focus:border-indigo-400/50
                                dark:focus:bg-black/35
                                dark:focus:ring-indigo-500/15

                                [&::-webkit-search-cancel-button]:hidden
                            "
                        />

                        {/* =================================
                            SEARCH ACTION
                        ================================== */}

                        {hasSearch ? (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                title="Qidiruvni tozalash"
                                aria-label="Qidiruvni tozalash"
                                className="
                                    absolute
                                    right-2
                                    top-1/2

                                    inline-flex
                                    h-8
                                    w-8

                                    -translate-y-1/2

                                    items-center
                                    justify-center

                                    rounded-lg

                                    text-slate-400

                                    transition-colors
                                    duration-200

                                    hover:bg-slate-200
                                    hover:text-slate-800

                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-indigo-500/50

                                    dark:text-slate-500
                                    dark:hover:bg-white/[0.08]
                                    dark:hover:text-white
                                "
                            >
                                <X
                                    size={15}
                                    aria-hidden="true"
                                />
                            </button>
                        ) : isLoading ? (
                            <span
                                aria-hidden="true"
                                className="
                                    absolute
                                    right-4
                                    top-1/2

                                    -translate-y-1/2
                                "
                            >
                                <Loader2
                                    size={16}
                                    className="
                                        animate-spin
                                        text-indigo-500

                                        motion-reduce:animate-none
                                    "
                                />
                            </span>
                        ) : null}
                    </div>

                    {/* =====================================
                        CREATE PROJECT BUTTON
                    ====================================== */}

                    {canCreate && (
                        <button
                            type="button"
                            onClick={onCreateProject}
                            disabled={isSubmitting}
                            className="
                                group
                                relative

                                inline-flex
                                h-12
                                w-full

                                shrink-0

                                items-center
                                justify-center
                                gap-2

                                overflow-hidden

                                rounded-2xl
                                border

                                border-indigo-500/30
                                bg-indigo-600

                                px-5

                                text-sm
                                font-black

                                text-white

                                shadow-lg
                                shadow-indigo-600/20

                                transition-all
                                duration-200

                                hover:bg-indigo-500
                                hover:shadow-indigo-500/25

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-indigo-500/50
                                focus-visible:ring-offset-2

                                active:scale-[0.98]

                                disabled:cursor-not-allowed
                                disabled:opacity-50

                                sm:w-auto

                                motion-reduce:transform-none
                            "
                        >
                            {/* BUTTON SHINE */}

                            <span
                                aria-hidden="true"
                                className="
                                    pointer-events-none

                                    absolute
                                    -left-16
                                    inset-y-0

                                    w-12
                                    rotate-12

                                    bg-white/[0.12]
                                    blur-md

                                    transition-all
                                    duration-700

                                    group-hover:left-[120%]
                                "
                            />

                            {/* BUTTON CONTENT */}

                            <span
                                className="
                                    relative
                                    z-10

                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                "
                            >
                                {isSubmitting ? (
                                    <Loader2
                                        size={18}
                                        aria-hidden="true"
                                        className="
                                            animate-spin
                                            motion-reduce:animate-none
                                        "
                                    />
                                ) : (
                                    <Plus
                                        size={18}
                                        aria-hidden="true"
                                    />
                                )}

                                <span>
                                    Yangi loyiha
                                </span>
                            </span>
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfileProjectsHeader);
