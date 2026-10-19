
// src/components/profile/projects/ProfileProjectsHeader.jsx

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
// - search
// - onSearchChange(value)
// - isOwner
// - onCreateProject()
// - isLoading
// - isSubmitting
//
// Changes:
// - Compact header layout
// - Smaller badge and paddings
// - Balanced search and create button
// - Responsive mobile actions
// - Light / Dark Mode
//
// No Redux, API or pagination logic.
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
    // ACCESSIBLE SEARCH ID
    // =====================================================

    const searchId = useId();

    // =====================================================
    // SAFE VALUES
    // =====================================================

    const searchValue =
        typeof search === "string"
            ? search
            : String(search ?? "");

    const hasSearch = searchValue.length > 0;

    const canCreate =
        Boolean(isOwner) &&
        typeof onCreateProject === "function";

    const canSearch =
        typeof onSearchChange === "function";

    // =====================================================
    // HANDLERS
    // =====================================================

    const handleSearchChange = (event) => {
        if (!canSearch) return;

        onSearchChange(event.target.value);
    };

    const handleClearSearch = () => {
        if (!canSearch) return;

        onSearchChange("");
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

                w-full
                min-w-0

                overflow-hidden

                rounded-2xl
                border
                border-slate-200

                bg-white/95

                px-4
                py-4

                shadow-sm

                dark:border-white/[0.08]
                dark:bg-[#0d131d]/95
                dark:shadow-black/20

                sm:rounded-3xl
                sm:px-5
                sm:py-4

                lg:px-5
                lg:py-5
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
                    -right-16
                    -top-20

                    h-44
                    w-44

                    rounded-full

                    bg-indigo-500/[0.06]
                    blur-3xl

                    dark:bg-indigo-500/[0.10]
                "
            />

            <div
                aria-hidden="true"
                className="
                    pointer-events-none

                    absolute
                    -bottom-20
                    -left-20

                    h-36
                    w-36

                    rounded-full

                    bg-purple-500/[0.04]
                    blur-3xl

                    dark:bg-purple-500/[0.07]
                "
            />

            {/* =============================================
                HEADER CONTENT
            ============================================== */}

            <div
                className="
                    relative
                    z-10

                    flex
                    w-full
                    min-w-0

                    flex-col

                    gap-4

                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                    lg:gap-5
                "
            >
                {/* =========================================
                    TITLE BLOCK
                ========================================== */}

                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >
                    {/* PROFILE BADGE */}

                    <div
                        className="
                            mb-2

                            inline-flex
                            max-w-full

                            items-center
                            gap-1.5

                            rounded-full
                            border

                            border-indigo-200
                            bg-indigo-50

                            px-2.5
                            py-1

                            text-[9px]
                            font-black

                            uppercase
                            tracking-[0.12em]

                            text-indigo-700

                            dark:border-indigo-400/20
                            dark:bg-indigo-500/[0.09]
                            dark:text-indigo-300

                            sm:text-[10px]
                        "
                    >
                        <Sparkles
                            size={13}
                            aria-hidden="true"
                            className="shrink-0"
                        />

                        <span className="truncate">
                            Profile Projects
                        </span>
                    </div>

                    {/* TITLE */}

                    <h3
                        className="
                            text-xl
                            font-black
                            leading-tight
                            tracking-tight

                            text-slate-900
                            dark:text-white

                            sm:text-[22px]
                        "
                    >
                        Loyihalar
                    </h3>

                    {/* DESCRIPTION */}

                    <p
                        className="
                            mt-1

                            max-w-xl

                            text-xs
                            font-medium
                            leading-5

                            text-slate-500
                            dark:text-slate-400

                            sm:text-[13px]
                        "
                    >
                        Portfolio, real ishlar va community
                        uchun yaratilgan loyihalar.
                    </p>
                </div>

                {/* =========================================
                    SEARCH AND CREATE ACTIONS
                ========================================== */}

                <div
                    className="
                        flex
                        w-full
                        min-w-0

                        flex-col
                        gap-2.5

                        sm:flex-row
                        sm:items-center
                        sm:gap-3

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

                            w-full
                            min-w-0

                            sm:flex-1

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
                                left-3.5
                                top-1/2

                                -translate-y-1/2

                                text-slate-400
                                dark:text-slate-500
                            "
                        />

                        {/* SCREEN READER LABEL */}

                        <label
                            htmlFor={searchId}
                            className="sr-only"
                        >
                            Profil loyihalarini qidirish
                        </label>

                        {/* CONTROLLED INPUT */}

                        <input
                            id={searchId}
                            type="search"
                            name="profile-project-search"

                            value={searchValue}
                            onChange={handleSearchChange}

                            disabled={!canSearch}

                            placeholder="Loyiha qidirish..."

                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck={false}

                            enterKeyHint="search"

                            aria-label="Loyihalarni qidirish"
                            aria-controls="profile-projects-list"
                            aria-busy={isLoading}

                            className="
                                block

                                h-11
                                w-full
                                min-w-0

                                rounded-xl
                                border

                                border-slate-200
                                bg-slate-50/90

                                py-2.5
                                pl-10
                                pr-10

                                text-base
                                font-semibold

                                text-slate-900

                                outline-none

                                transition-colors
                                duration-200

                                placeholder:text-slate-400

                                enabled:hover:border-slate-300

                                focus:border-indigo-500
                                focus:bg-white
                                focus:ring-2
                                focus:ring-indigo-500/15

                                disabled:cursor-not-allowed
                                disabled:opacity-50

                                dark:border-white/[0.09]
                                dark:bg-black/25
                                dark:text-white
                                dark:placeholder:text-slate-500

                                dark:enabled:hover:border-white/[0.16]

                                dark:focus:border-indigo-400/50
                                dark:focus:bg-black/35
                                dark:focus:ring-indigo-500/15

                                sm:text-sm

                                [&::-webkit-search-cancel-button]:hidden

                                motion-reduce:transition-none
                            "
                        />

                        {/* =================================
                            CLEAR / LOADING ACTION
                        ================================== */}

                        {hasSearch && canSearch ? (
                            <button
                                type="button"

                                onClick={handleClearSearch}

                                title="Qidiruvni tozalash"
                                aria-label="Qidiruvni tozalash"

                                className="
                                    absolute
                                    right-1.5
                                    top-1/2

                                    grid
                                    h-8
                                    w-8

                                    -translate-y-1/2

                                    place-items-center

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

                                    motion-reduce:transition-none
                                "
                            >
                                <X
                                    size={15}
                                    aria-hidden="true"
                                />
                            </button>
                        ) : isLoading ? (
                            <span
                                role="status"
                                aria-label="Loyihalar qidirilmoqda"
                                className="
                                    absolute
                                    right-3.5
                                    top-1/2

                                    -translate-y-1/2
                                "
                            >
                                <Loader2
                                    size={16}
                                    aria-hidden="true"
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

                            aria-busy={isSubmitting}

                            className="
                                group
                                relative

                                inline-flex

                                h-11
                                w-full

                                shrink-0

                                items-center
                                justify-center
                                gap-2

                                overflow-hidden

                                rounded-xl
                                border

                                border-indigo-500/30
                                bg-indigo-600

                                px-4

                                text-sm
                                font-black

                                text-white

                                shadow-lg
                                shadow-indigo-600/20

                                transition-all
                                duration-200

                                enabled:hover:bg-indigo-500
                                enabled:hover:shadow-indigo-500/25

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-indigo-500/50
                                focus-visible:ring-offset-2

                                enabled:active:scale-[0.98]

                                disabled:cursor-not-allowed
                                disabled:opacity-50

                                dark:focus-visible:ring-offset-[#0d131d]

                                sm:w-auto
                                sm:min-w-[145px]

                                motion-reduce:transform-none
                                motion-reduce:transition-none
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

                                    motion-reduce:transition-none
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
                                        size={17}
                                        aria-hidden="true"
                                        className="
                                            animate-spin
                                            motion-reduce:animate-none
                                        "
                                    />
                                ) : (
                                    <Plus
                                        size={17}
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
