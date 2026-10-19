
import React, { memo } from "react";

import {
    FolderKanban,
    Plus,
    Search,
    Sparkles,
    X,
} from "lucide-react";

// =========================================================
// FSOCIETY — PROFILE PROJECTS EMPTY STATE
//
// Variants:
//
// "projects":
//   User has no projects.
//
// "search":
//   No projects match the search query.
//
// Props:
//
// variant
// isOwner
// message
// search
// searchQuery
// onCreate
// onCreateProject
// onClearSearch
//
// No API calls or local state.
// =========================================================

const DEFAULT_PROJECTS_MESSAGE =
    "Foydalanuvchida hali hech qanday loyiha mavjud emas.";

const DEFAULT_OWNER_MESSAGE =
    "Sizda hali hech qanday loyiha mavjud emas. " +
    "Birinchi loyihangizni yarating!";

const DEFAULT_SEARCH_MESSAGE =
    "Boshqa kalit so‘z bilan urinib ko‘ring.";

// =========================================================
// COMPONENT
// =========================================================

const ProfileProjectsEmpty = ({
    variant = "projects",
    isOwner = false,
    message = "",
    search = "",
    searchQuery = "",
    onCreate,
    onCreateProject,
    onClearSearch,
    className = "",
}) => {
    // =====================================================
    // VARIANT
    // =====================================================

    const isSearchEmpty =
        variant === "search";

    // =====================================================
    // SEARCH QUERY
    // =====================================================

    const query = String(
        searchQuery || search || ""
    ).trim();

    // =====================================================
    // ACTIONS
    // =====================================================

    const createHandler =
        typeof onCreateProject === "function"
            ? onCreateProject
            : onCreate;

    const canCreate =
        Boolean(isOwner) &&
        typeof createHandler === "function";

    const canClearSearch =
        typeof onClearSearch === "function";

    // =====================================================
    // CONTENT
    // =====================================================

    const title = isSearchEmpty
        ? "Qidiruv bo‘yicha loyiha topilmadi"
        : "Loyihalar mavjud emas";

    const description = message || (
        isSearchEmpty
            ? DEFAULT_SEARCH_MESSAGE
            : isOwner
                ? DEFAULT_OWNER_MESSAGE
                : DEFAULT_PROJECTS_MESSAGE
    );

    const Icon = isSearchEmpty
        ? Search
        : FolderKanban;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <section
            role="status"
            aria-live="polite"
            className={`
                relative
                isolate

                flex
                min-w-0
                flex-col

                items-center
                justify-center

                overflow-hidden

                rounded-3xl
                border
                border-dashed

                border-slate-300
                bg-white/80

                px-5
                py-12

                text-center

                shadow-sm

                dark:border-white/[0.12]
                dark:bg-[#0d131d]/80
                dark:shadow-none

                sm:px-8
                sm:py-14

                ${className}
            `}
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

                    bg-purple-500/[0.06]
                    blur-3xl

                    dark:bg-purple-500/[0.08]
                "
            />

            {/* =============================================
                CONTENT
            ============================================== */}

            <div
                className="
                    relative
                    z-10

                    flex
                    w-full
                    max-w-xl

                    flex-col
                    items-center
                "
            >
                {/* =========================================
                    ICON
                ========================================== */}

                <div
                    className="
                        relative

                        mb-5

                        flex
                        h-20
                        w-20

                        items-center
                        justify-center

                        rounded-[24px]
                        border

                        border-indigo-200
                        bg-indigo-50

                        text-indigo-600

                        shadow-lg
                        shadow-indigo-500/[0.05]

                        dark:border-indigo-400/15
                        dark:bg-indigo-500/[0.08]
                        dark:text-indigo-300

                        sm:h-24
                        sm:w-24
                    "
                >
                    <Icon
                        size={38}
                        strokeWidth={1.6}
                        aria-hidden="true"
                    />

                    {!isSearchEmpty && (
                        <span
                            aria-hidden="true"
                            className="
                                absolute
                                -right-2
                                -top-2

                                flex
                                h-8
                                w-8

                                items-center
                                justify-center

                                rounded-xl
                                border

                                border-purple-200
                                bg-purple-50

                                text-purple-600

                                dark:border-purple-400/20
                                dark:bg-[#171027]
                                dark:text-purple-300
                            "
                        >
                            <Sparkles size={15} />
                        </span>
                    )}
                </div>

                {/* =========================================
                    TITLE
                ========================================== */}

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
                    {title}
                </h3>

                {/* =========================================
                    SEARCH QUERY
                ========================================== */}

                {isSearchEmpty && query && (
                    <div
                        className="
                            mt-4

                            inline-flex
                            max-w-full

                            items-center
                            gap-2

                            rounded-xl
                            border

                            border-slate-200
                            bg-slate-50

                            px-3
                            py-2

                            dark:border-white/[0.08]
                            dark:bg-black/20
                        "
                    >
                        <Search
                            size={14}
                            aria-hidden="true"
                            className="
                                shrink-0

                                text-indigo-600
                                dark:text-indigo-400
                            "
                        />

                        <span
                            className="
                                min-w-0
                                truncate

                                text-xs
                                font-bold

                                text-slate-700
                                dark:text-slate-300
                            "
                            title={query}
                        >
                            {query}
                        </span>
                    </div>
                )}

                {/* =========================================
                    DESCRIPTION
                ========================================== */}

                <p
                    className="
                        mt-3
                        max-w-lg

                        text-sm
                        font-medium
                        leading-7

                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    {description}
                </p>

                {/* =========================================
                    SEARCH ACTION
                ========================================== */}

                {isSearchEmpty && canClearSearch && (
                    <button
                        type="button"
                        onClick={onClearSearch}
                        className="
                            mt-6

                            inline-flex
                            min-h-11

                            items-center
                            justify-center
                            gap-2

                            rounded-xl
                            border

                            border-indigo-200
                            bg-indigo-50

                            px-5
                            py-3

                            text-xs
                            font-black

                            text-indigo-700

                            transition-all
                            duration-200

                            hover:border-indigo-300
                            hover:bg-indigo-100

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-indigo-500/50

                            active:scale-[0.98]

                            dark:border-indigo-400/20
                            dark:bg-indigo-500/[0.09]
                            dark:text-indigo-300

                            dark:hover:border-indigo-400/30
                            dark:hover:bg-indigo-500/[0.15]

                            motion-reduce:transform-none
                        "
                    >
                        <X
                            size={16}
                            aria-hidden="true"
                        />

                        Qidiruvni tozalash
                    </button>
                )}

                {/* =========================================
                    CREATE ACTION
                ========================================== */}

                {!isSearchEmpty && canCreate && (
                    <button
                        type="button"
                        onClick={createHandler}
                        className="
                            group
                            relative

                            mt-6

                            inline-flex
                            min-h-11

                            items-center
                            justify-center
                            gap-2

                            overflow-hidden

                            rounded-xl
                            border

                            border-indigo-500/30
                            bg-indigo-600

                            px-5
                            py-3

                            text-xs
                            font-black

                            text-white

                            shadow-lg
                            shadow-indigo-600/20

                            transition-all
                            duration-200

                            hover:bg-indigo-500
                            hover:shadow-indigo-500/30

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-indigo-500/50

                            active:scale-[0.98]

                            motion-reduce:transform-none
                        "
                    >
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

                        <Plus
                            size={17}
                            aria-hidden="true"
                            className="relative z-10"
                        />

                        <span className="relative z-10">
                            Yangi loyiha yaratish
                        </span>
                    </button>
                )}
            </div>
        </section>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfileProjectsEmpty);
