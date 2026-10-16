
import React, {
    memo,
    useMemo,
    useState,
} from "react";

import {
    AlertTriangle,
    Check,
    Code2,
    Layers3,
    RefreshCw,
    Search,
} from "lucide-react";

import {
    hasId,
    safeTagColor,
    sameId,
    tagAccentStyle,
} from "./problemCreateHelpers";

// =========================================================
// SHARED LOADING SKELETON
// =========================================================

const TagSkeleton = memo(function TagSkeleton({
    count = 7,
}) {
    return (
        <div
            role="status"
            aria-label="Taglar yuklanmoqda"
            className="
                flex
                flex-wrap
                gap-2
                animate-pulse
                motion-reduce:animate-none
            "
        >
            <span className="sr-only">
                Taglar yuklanmoqda.
            </span>

            {Array.from(
                { length: count },
                (_, index) => (
                    <span
                        key={index}
                        aria-hidden="true"
                        className="
                            h-10
                            w-24
                            rounded-full
                            bg-slate-200

                            sm:w-28

                            dark:bg-white/[0.08]
                        "
                    />
                )
            )}
        </div>
    );
});

// =========================================================
// SELECTABLE TAG BUTTON
//
// Features:
// - Select / Unselect
// - Language or technology color
// - CODE language indicator
// - Accessible pressed state
// - Disabled state
// =========================================================

const TagButton = memo(function TagButton({
    item,
    selected = false,
    isCodeLanguage = false,
    disabled = false,
    onToggle,
}) {
    const name = String(
        item?.name ?? "Noma’lum tag"
    );

    const color = safeTagColor(
        item?.color
    );

    return (
        <button
            type="button"

            disabled={
                disabled ||
                typeof onToggle !== "function"
            }

            onClick={() => onToggle(item)}

            aria-pressed={selected}
            title={name}

            style={tagAccentStyle(
                item,
                selected
            )}

            className={`
                inline-flex
                min-h-10
                max-w-full
                items-center
                gap-2

                rounded-full
                border

                px-3.5
                py-2

                text-xs
                font-bold

                transition-colors
                duration-200

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500

                disabled:cursor-not-allowed
                disabled:opacity-50

                motion-reduce:transition-none

                ${
                    selected
                        ? `
                            border-indigo-300
                            bg-indigo-50
                            text-slate-900

                            dark:border-indigo-400/30
                            dark:bg-indigo-400/10
                            dark:text-white
                        `
                        : `
                            border-slate-200
                            bg-white
                            text-slate-600

                            hover:border-indigo-300
                            hover:text-indigo-700

                            dark:border-white/10
                            dark:bg-white/[0.04]
                            dark:text-gray-300
                            dark:hover:border-indigo-400/30
                        `
                }
            `}
        >
            {/* SELECTED ICON */}

            {selected && (
                <Check
                    size={13}
                    strokeWidth={2.5}
                    aria-hidden="true"
                />
            )}

            {/* TAG COLOR */}

            <span
                aria-hidden="true"
                className="
                    h-2
                    w-2
                    shrink-0
                    rounded-full
                "
                style={{
                    backgroundColor: color,
                }}
            />

            {/* TAG NAME */}

            <span className="min-w-0 truncate">
                {name}
            </span>

            {/* SELECTED CODE LANGUAGE */}

            {isCodeLanguage && (
                <span
                    className="
                        shrink-0
                        rounded-md

                        border
                        border-current/20

                        px-1.5
                        py-0.5

                        font-mono
                        text-[9px]
                        uppercase
                    "
                >
                    CODE
                </span>
            )}
        </button>
    );
});

// =========================================================
// REUSABLE TAG GROUP
//
// Responsibilities:
//
// - Render heading and description
// - Show selected count
// - Search available tags
// - Show skeleton while loading
// - Show API errors
// - Allow retry
// - Render selectable tag buttons
// - Show empty search result
// =========================================================

const TagGroup = memo(function TagGroup({
    title,
    description,

    required = false,

    options = [],
    selectedItems = [],

    loading = false,
    error = "",

    disabled = false,

    onToggle,
    onRetry,

    codeLanguageId = "",

    Icon,
}) {
    // =====================================================
    // SEARCH STATE
    // =====================================================

    const [
        search,
        setSearch,
    ] = useState("");

    // =====================================================
    // SAFE DATA
    // =====================================================

    const safeOptions = Array.isArray(options)
        ? options
        : [];

    const safeSelectedItems = Array.isArray(
        selectedItems
    )
        ? selectedItems
        : [];

    // =====================================================
    // FILTERED OPTIONS
    // =====================================================

    const visibleOptions = useMemo(() => {
        const query = search
            .trim()
            .toLocaleLowerCase();

        const items = Array.isArray(options)
            ? options
            : [];

        return items.filter((item) => {
            if (
                !item ||
                !hasId(item.id)
            ) {
                return false;
            }

            if (!query) {
                return true;
            }

            return String(item.name ?? "")
                .toLocaleLowerCase()
                .includes(query);
        });
    }, [
        options,
        search,
    ]);

    // =====================================================
    // SEARCH VISIBILITY
    // =====================================================

    const showSearch =
        !loading &&
        !error &&
        safeOptions.length > 8;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <section className="min-w-0">
            {/* ==========================================
                GROUP HEADER
            ========================================== */}

            <div
                className="
                    mb-4
                    flex
                    flex-wrap
                    items-start
                    justify-between
                    gap-3
                "
            >
                {/* TITLE AND DESCRIPTION */}

                <div className="min-w-0 flex-1">
                    <h3
                        className="
                            flex
                            flex-wrap
                            items-center
                            gap-2

                            text-xs
                            font-black
                            uppercase
                            tracking-wide

                            text-slate-800

                            dark:text-gray-200
                        "
                    >
                        {Icon && (
                            <Icon
                                size={16}
                                aria-hidden="true"
                                className="
                                    text-indigo-600
                                    dark:text-indigo-400
                                "
                            />
                        )}

                        {title}

                        {required && (
                            <span
                                className="
                                    text-rose-600
                                    dark:text-rose-400
                                "
                            >
                                *
                            </span>
                        )}
                    </h3>

                    <p
                        className="
                            mt-1
                            text-xs
                            leading-5
                            text-slate-500

                            dark:text-gray-400
                        "
                    >
                        {description}
                    </p>
                </div>

                {/* SELECTED COUNT */}

                {safeSelectedItems.length > 0 && (
                    <span
                        className="
                            shrink-0
                            rounded-full

                            border
                            border-indigo-200

                            bg-indigo-50

                            px-3
                            py-1

                            text-[10px]
                            font-black
                            text-indigo-800

                            dark:border-indigo-400/20
                            dark:bg-indigo-400/[0.08]
                            dark:text-indigo-300
                        "
                    >
                        {safeSelectedItems.length} ta tanlangan
                    </span>
                )}
            </div>

            {/* ==========================================
                SEARCH INPUT
            ========================================== */}

            {showSearch && (
                <div className="relative mb-4">
                    <Search
                        size={15}
                        aria-hidden="true"
                        className="
                            pointer-events-none

                            absolute
                            left-3
                            top-1/2

                            -translate-y-1/2

                            text-slate-400

                            dark:text-gray-500
                        "
                    />

                    <input
                        type="search"

                        value={search}

                        disabled={disabled}

                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }

                        aria-label={`${title} qidiruvi`}

                        placeholder="Tag nomi bo‘yicha qidirish..."

                        className="
                            min-h-10
                            w-full

                            rounded-xl

                            border
                            border-slate-200

                            bg-white

                            py-2.5
                            pl-9
                            pr-3

                            text-xs
                            text-slate-900

                            outline-none

                            placeholder:text-slate-400

                            focus:border-indigo-400
                            focus:ring-2
                            focus:ring-indigo-500/15

                            disabled:opacity-50

                            dark:border-white/10
                            dark:bg-[#090f1b]
                            dark:text-white
                            dark:placeholder:text-gray-500
                        "
                    />
                </div>
            )}

            {/* ==========================================
                LOADING
            ========================================== */}

            {loading ? (
                <TagSkeleton
                    count={required ? 6 : 8}
                />
            ) : error ? (
                /* ======================================
                    ERROR + RETRY
                ====================================== */

                <div
                    role="alert"
                    className="
                        rounded-2xl

                        border
                        border-rose-200

                        bg-rose-50
                        p-4

                        dark:border-rose-400/20
                        dark:bg-rose-400/[0.06]
                    "
                >
                    <div className="flex items-start gap-2">
                        <AlertTriangle
                            size={16}
                            aria-hidden="true"
                            className="
                                mt-0.5
                                shrink-0

                                text-rose-700

                                dark:text-rose-300
                            "
                        />

                        <p
                            className="
                                min-w-0
                                break-words

                                text-xs
                                leading-6

                                text-rose-800

                                dark:text-rose-200
                            "
                        >
                            {error}
                        </p>
                    </div>

                    <button
                        type="button"

                        disabled={
                            disabled ||
                            typeof onRetry !== "function"
                        }

                        onClick={onRetry}

                        className="
                            mt-3

                            inline-flex
                            min-h-9

                            items-center
                            gap-2

                            rounded-xl

                            border
                            border-rose-300

                            bg-white

                            px-3

                            text-xs
                            font-bold

                            text-rose-800

                            hover:bg-rose-100

                            disabled:cursor-not-allowed
                            disabled:opacity-50

                            dark:border-rose-400/25
                            dark:bg-rose-400/[0.09]
                            dark:text-rose-300
                        "
                    >
                        <RefreshCw
                            size={14}
                            aria-hidden="true"
                        />

                        Qayta urinish
                    </button>
                </div>
            ) : visibleOptions.length > 0 ? (
                /* ======================================
                    TAG LIST
                ====================================== */

                <div
                    role="group"
                    aria-label={title}

                    className="
                        flex
                        flex-wrap
                        gap-2.5
                    "
                >
                    {visibleOptions.map((item) => {
                        // =================================
                        // SELECTED STATE
                        // =================================

                        const selected =
                            safeSelectedItems.some(
                                (selectedItem) =>
                                    sameId(
                                        selectedItem?.id,
                                        item.id
                                    )
                            );

                        // =================================
                        // TAG BUTTON
                        // =================================

                        return (
                            <TagButton
                                key={String(item.id)}

                                item={item}

                                selected={selected}

                                isCodeLanguage={
                                    sameId(
                                        item.id,
                                        codeLanguageId
                                    )
                                }

                                disabled={disabled}

                                onToggle={onToggle}
                            />
                        );
                    })}
                </div>
            ) : (
                /* ======================================
                    EMPTY STATE
                ====================================== */

                <p
                    className="
                        rounded-xl

                        border
                        border-dashed
                        border-slate-300

                        bg-slate-50/70

                        px-4
                        py-5

                        text-xs
                        text-slate-500

                        dark:border-white/10
                        dark:bg-white/[0.025]
                        dark:text-gray-400
                    "
                >
                    {search.trim()
                        ? "Qidiruvga mos tag topilmadi."
                        : "Taglar hozircha mavjud emas."}
                </p>
            )}
        </section>
    );
});

// =========================================================
// SELECTED STACK SUMMARY
//
// Shows selected:
// - Programming languages
// - Technologies
//
// Preserves:
// - Color
// - Name
// - Unique React keys
// =========================================================

const SelectedStackSummary = memo(
    function SelectedStackSummary({
        languages = [],
        technologies = [],
    }) {
        // =================================================
        // COMBINED SELECTED ITEMS
        // =================================================

        const allItems = [
            ...languages.map((item) => ({
                ...item,
                type: "language",
            })),

            ...technologies.map((item) => ({
                ...item,
                type: "technology",
            })),
        ];

        // =================================================
        // HIDE WHEN EMPTY
        // =================================================

        if (allItems.length === 0) {
            return null;
        }

        // =================================================
        // JSX
        // =================================================

        return (
            <section
                className="
                    min-w-0

                    rounded-2xl

                    border
                    border-slate-200

                    bg-slate-50/80
                    p-4

                    dark:border-white/[0.08]
                    dark:bg-white/[0.025]
                "
            >
                {/* SUMMARY TITLE */}

                <h3
                    className="
                        mb-3

                        font-mono
                        text-[10px]
                        font-black
                        uppercase
                        tracking-wider

                        text-slate-500

                        dark:text-gray-400
                    "
                >
                    selected.stack
                </h3>

                {/* SELECTED TAGS */}

                <div className="flex flex-wrap gap-2">
                    {allItems.map((item) => {
                        const color =
                            safeTagColor(item.color);

                        return (
                            <span
                                key={`${item.type}-${item.id}`}

                                title={
                                    `${item.type}: ${item.name}`
                                }

                                style={{
                                    borderColor: `${color}55`,
                                    backgroundColor: `${color}15`,
                                }}

                                className="
                                    inline-flex
                                    max-w-full

                                    items-center
                                    gap-1.5

                                    rounded-lg

                                    border

                                    px-2.5
                                    py-1

                                    text-[11px]
                                    font-bold

                                    text-slate-800

                                    dark:text-gray-200
                                "
                            >
                                {/* COLOR DOT */}

                                <span
                                    aria-hidden="true"

                                    className="
                                        h-1.5
                                        w-1.5

                                        shrink-0
                                        rounded-full
                                    "

                                    style={{
                                        backgroundColor: color,
                                    }}
                                />

                                {/* NAME */}

                                <span className="min-w-0 break-words">
                                    {item.name}
                                </span>
                            </span>
                        );
                    })}
                </div>
            </section>
        );
    }
);

// =========================================================
// MAIN PROBLEM CREATE STACK
//
// Props from ProblemCreate.jsx:
//
// - languageOptions
// - technologyOptions
// - selectedLanguages
// - selectedTechnologies
// - codeLanguageId
// - languagesLoading
// - technologiesLoading
// - languagesError
// - technologiesError
// - disabled
// - onToggleLanguage
// - onToggleTechnology
// - onRetryLanguages
// - onRetryTechnologies
// =========================================================

const ProblemCreateStack = ({
    languageOptions = [],
    technologyOptions = [],

    selectedLanguages = [],
    selectedTechnologies = [],

    codeLanguageId = "",

    languagesLoading = false,
    technologiesLoading = false,

    languagesError = "",
    technologiesError = "",

    disabled = false,

    onToggleLanguage,
    onToggleTechnology,

    onRetryLanguages,
    onRetryTechnologies,
}) => {
    // =====================================================
    // MAIN RENDER
    // =====================================================

    return (
        <div className="min-w-0 space-y-7">
            {/* ==========================================
                LANGUAGE TAGS
            ========================================== */}

            <TagGroup
                title="Dasturlash tili taglari"

                description={
                    "Muammo qaysi tillarga tegishli bo‘lsa, " +
                    "bir yoki bir nechtasini belgilang."
                }

                required

                Icon={Code2}

                options={languageOptions}

                selectedItems={
                    selectedLanguages
                }

                loading={languagesLoading}

                error={languagesError}

                codeLanguageId={
                    codeLanguageId
                }

                disabled={disabled}

                onToggle={
                    onToggleLanguage
                }

                onRetry={
                    onRetryLanguages
                }
            />

            {/* ==========================================
                TECHNOLOGY TAGS
            ========================================== */}

            <TagGroup
                title="Texnologiya taglari"

                description={
                    "Django, React, PostgreSQL, Redis, " +
                    "Docker kabi texnologiyalarni belgilang."
                }

                Icon={Layers3}

                options={technologyOptions}

                selectedItems={
                    selectedTechnologies
                }

                loading={technologiesLoading}

                error={technologiesError}

                disabled={disabled}

                onToggle={
                    onToggleTechnology
                }

                onRetry={
                    onRetryTechnologies
                }
            />

            {/* ==========================================
                SELECTED STACK SUMMARY
            ========================================== */}

            <SelectedStackSummary
                languages={
                    selectedLanguages
                }

                technologies={
                    selectedTechnologies
                }
            />
        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProblemCreateStack);
