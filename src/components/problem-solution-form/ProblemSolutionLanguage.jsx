
import React, { memo } from "react";

import {
    AlertTriangle,
    Check,
    CheckCircle2,
    FileCode2,
    Languages,
    RefreshCw,
    Search,
} from "lucide-react";

import {
    getSolutionPrismLanguage,
} from "./problemSolutionFormHelpers";

// =========================================================
// LANGUAGE LOADING
// =========================================================

const LanguageLoading = memo(() => (
    <div
        role="status"
        aria-label="Dasturlash tillari yuklanmoqda"
        className="
            mt-5
            flex
            flex-wrap
            gap-2
            animate-pulse
            motion-reduce:animate-none
        "
    >
        <span className="sr-only">
            Dasturlash tillari yuklanmoqda.
        </span>

        {Array.from({ length: 7 }).map((_, index) => (
            <div
                key={index}
                aria-hidden="true"
                className="
                    h-9
                    w-24
                    rounded-full
                    bg-slate-200

                    dark:bg-white/[0.07]
                "
            />
        ))}
    </div>
));

// =========================================================
// LANGUAGE ERROR
// =========================================================

const LanguageError = memo(({
    message,
    onRetry,
    disabled,
}) => (
    <div
        role="alert"
        className="
            mt-5
            rounded-2xl
            border
            border-rose-200
            bg-rose-50
            p-4

            dark:border-rose-400/20
            dark:bg-rose-400/[0.05]
        "
    >
        <div className="flex items-start gap-3">
            <AlertTriangle
                size={17}
                aria-hidden="true"
                className="
                    mt-0.5
                    shrink-0
                    text-rose-700

                    dark:text-rose-300
                "
            />

            <div className="min-w-0">
                <p
                    className="
                        text-xs
                        font-black
                        text-rose-800

                        dark:text-rose-200
                    "
                >
                    Tillar yuklanmadi
                </p>

                <p
                    className="
                        mt-1
                        break-words
                        text-xs
                        leading-5
                        text-rose-700

                        dark:text-rose-200/80
                    "
                >
                    {message}
                </p>
            </div>
        </div>

        <button
            type="button"
            onClick={onRetry}
            disabled={disabled}
            className="
                mt-4
                inline-flex
                min-h-9
                items-center
                gap-2
                rounded-xl
                border
                border-rose-300
                bg-white
                px-3
                text-[11px]
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
            <RefreshCw size={14} aria-hidden="true" />

            Qayta urinish
        </button>
    </div>
));

// =========================================================
// LANGUAGE SELECTOR
// =========================================================

const ProblemSolutionLanguage = ({
    languageOptions = [],
    filteredLanguages = [],
    selectedLanguage = null,
    languageSearch = "",
    isLanguagesLoading = false,
    languageError = "",
    isSubmitting = false,
    onSearchChange,
    onSelect,
    onRetry,
}) => (
    <section
        aria-label="Yechim dasturlash tilini tanlash"
        className="
            rounded-[22px]
            border
            border-slate-200
            bg-slate-50/70
            p-4

            sm:p-5

            dark:border-white/[0.09]
            dark:bg-white/[0.025]
        "
    >
        {/* HEADER */}

        <div
            className="
                flex
                flex-col
                justify-between
                gap-4

                sm:flex-row
                sm:items-start
            "
        >
            <div className="flex min-w-0 items-start gap-3">
                <div
                    className="
                        grid
                        h-10
                        w-10
                        shrink-0
                        place-items-center
                        rounded-xl
                        border
                        border-indigo-200
                        bg-indigo-50
                        text-indigo-700

                        dark:border-indigo-400/20
                        dark:bg-indigo-400/[0.09]
                        dark:text-indigo-300
                    "
                >
                    <Languages size={18} aria-hidden="true" />
                </div>

                <div className="min-w-0">
                    <h3
                        className="
                            text-sm
                            font-black
                            text-slate-900

                            dark:text-white
                        "
                    >
                        Kod tili{" "}
                        <span className="text-rose-600 dark:text-rose-400">
                            *
                        </span>
                    </h3>

                    <p
                        className="
                            mt-1
                            text-[11px]
                            leading-5
                            text-slate-500

                            dark:text-gray-400
                        "
                    >
                        Tilni tanlang — syntax highlighting
                        avtomatik moslashadi.
                    </p>
                </div>
            </div>

            {/* SELECTED LANGUAGE */}

            {selectedLanguage && (
                <div
                    className="
                        inline-flex
                        min-w-0
                        items-center
                        gap-2
                        self-start
                        rounded-xl
                        border
                        border-emerald-200
                        bg-emerald-50
                        px-3
                        py-2

                        dark:border-emerald-400/20
                        dark:bg-emerald-400/[0.08]
                    "
                >
                    <CheckCircle2
                        size={15}
                        aria-hidden="true"
                        className="
                            shrink-0
                            text-emerald-700

                            dark:text-emerald-300
                        "
                    />

                    <div className="min-w-0">
                        <p
                            className="
                                font-mono
                                text-[9px]
                                uppercase
                                text-slate-500

                                dark:text-gray-400
                            "
                        >
                            Tanlangan
                        </p>

                        <p
                            className="
                                truncate
                                text-xs
                                font-black
                                text-emerald-800

                                dark:text-emerald-300
                            "
                        >
                            {selectedLanguage.name}
                        </p>
                    </div>
                </div>
            )}
        </div>

        {/* SEARCH */}

        {!isLanguagesLoading &&
            !languageError &&
            languageOptions.length > 8 && (
                <div className="relative mt-5">
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
                        value={languageSearch}
                        onChange={(event) =>
                            onSearchChange(event.target.value)
                        }
                        disabled={isSubmitting}
                        aria-label="Dasturlash tilini qidirish"
                        placeholder="Til yoki texnologiyani qidiring..."
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

                            dark:border-white/[0.10]
                            dark:bg-[#090f1b]
                            dark:text-white
                            dark:placeholder:text-gray-600
                        "
                    />
                </div>
            )}

        {/* LOADING */}

        {isLanguagesLoading && <LanguageLoading />}

        {/* ERROR */}

        {!isLanguagesLoading && languageError && (
            <LanguageError
                message={languageError}
                onRetry={onRetry}
                disabled={isSubmitting}
            />
        )}

        {/* LANGUAGE OPTIONS */}

        {!isLanguagesLoading &&
            !languageError &&
            filteredLanguages.length > 0 && (
                <div
                    role="group"
                    aria-label="Mavjud dasturlash tillari"
                    className="
                        mt-5
                        flex
                        max-h-[190px]
                        flex-wrap
                        gap-2
                        overflow-y-auto
                        overscroll-contain
                        pr-1
                    "
                >
                    {filteredLanguages.map((language, index) => {
                        const active =
                            selectedLanguage?.id != null &&
                            String(selectedLanguage.id) ===
                                String(language?.id);

                        const syntax =
                            getSolutionPrismLanguage(
                                language?.name
                            );

                        return (
                            <button
                                key={
                                    language?.id ??
                                    `language-${index}`
                                }
                                type="button"
                                disabled={isSubmitting}
                                aria-pressed={active}
                                title={`Syntax: ${syntax}`}
                                onClick={() => onSelect(language)}
                                className={`
                                    inline-flex
                                    min-h-9
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    px-3.5
                                    py-2
                                    text-[11px]
                                    font-bold
                                    transition-colors

                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-indigo-500

                                    disabled:cursor-not-allowed
                                    disabled:opacity-50

                                    ${
                                        active
                                            ? `
                                                border-indigo-300
                                                bg-indigo-100
                                                text-indigo-800

                                                dark:border-indigo-400/30
                                                dark:bg-indigo-400/[0.12]
                                                dark:text-indigo-200
                                            `
                                            : `
                                                border-slate-200
                                                bg-white
                                                text-slate-600

                                                hover:border-indigo-300
                                                hover:text-indigo-700

                                                dark:border-white/[0.10]
                                                dark:bg-white/[0.04]
                                                dark:text-gray-300
                                                dark:hover:border-indigo-400/30
                                            `
                                    }
                                `}
                            >
                                {active ? (
                                    <Check
                                        size={13}
                                        aria-hidden="true"
                                    />
                                ) : (
                                    <FileCode2
                                        size={13}
                                        aria-hidden="true"
                                    />
                                )}

                                {language?.name || "Noma’lum til"}
                            </button>
                        );
                    })}
                </div>
            )}

        {/* NO RESULTS */}

        {!isLanguagesLoading &&
            !languageError &&
            filteredLanguages.length === 0 && (
                <div
                    className="
                        mt-5
                        rounded-xl
                        border
                        border-dashed
                        border-slate-300
                        p-5
                        text-center

                        dark:border-white/[0.12]
                    "
                >
                    <p
                        className="
                            text-xs
                            text-slate-500

                            dark:text-gray-400
                        "
                    >
                        {languageSearch.trim()
                            ? "Ushbu nom bilan til topilmadi."
                            : "Dasturlash tillari mavjud emas."}
                    </p>
                </div>
            )}
    </section>
);

export default memo(ProblemSolutionLanguage);
