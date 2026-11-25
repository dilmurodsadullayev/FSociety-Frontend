
 // src/components/events/EventsPage.jsx

import React, {
    memo,
    useCallback,
    useId,
    useMemo,
    useState,
} from "react";

import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    Gift,
    Inbox,
    RefreshCw,
    Search,
    Sparkles,
    X,
} from "lucide-react";

import {
    useEvents,
} from "../../hooks/events/useEvents";

import {
    fetchPublicEvents,
} from "../../features/events/eventsSlice";

import EventCard, {
    getEventDisplayStatus,
} from "./EventCard";

// =========================================================
// FSOCIETY — EVENTS CENTER PAGE
// =========================================================
//
// Features:
// - Public event catalog
// - Status filters
// - Local search
// - Loading skeletons
// - Error recovery
// - Server pagination
// - Responsive layout
// - Dark / Light support
//
// IMPORTANT:
// - No client-side gift claiming
// - No invented events
// - No hardcoded holiday calendar
// - No dependence on Winter Mode
//
// Search and filters operate on the currently
// loaded backend page.
//
// =========================================================


// =========================================================
// FILTER CONFIGURATION
// =========================================================

const EVENT_FILTERS = Object.freeze([
    {
        id: "all",
        label: "Barchasi",
    },
    {
        id: "active",
        label: "Faol",
    },
    {
        id: "scheduled",
        label: "Tez kunda",
    },
    {
        id: "finished",
        label: "Yakunlangan",
    },
    {
        id: "disabled",
        label: "Faol emas",
    },
]);

const PAGE_PARAM_NAMES = new Set([
    "page",
    "page_size",
    "limit",
    "offset",
    "cursor",
]);


// =========================================================
// HELPERS
// =========================================================

const normalizeSearch = (value) =>
    String(value ?? "")
        .trim()
        .toLocaleLowerCase("uz-UZ");

const getEventSearchText = (event) => {
    return [
        event?.name,
        event?.title,
        event?.description,
        event?.slug,
    ]
        .filter(
            (value) =>
                typeof value === "string"
        )
        .join(" ")
        .toLocaleLowerCase("uz-UZ");
};

// Parse pagination query parameters only.
//
// We deliberately do not request the absolute
// URL returned by the backend.

const getPaginationParams = (link) => {
    if (
        typeof link !== "string" ||
        !link.trim()
    ) {
        return null;
    }

    try {
        const parsed = new URL(
            link,
            "https://fsociety.invalid"
        );

        const params = {};

        parsed.searchParams.forEach(
            (value, key) => {
                if (
                    PAGE_PARAM_NAMES.has(key)
                ) {
                    params[key] = value;
                }
            }
        );

        return Object.keys(params).length
            ? params
            : null;
    } catch {
        return null;
    }
};


// =========================================================
// EVENT CARD SKELETON
// =========================================================

const EventCardSkeleton = memo(
    function EventCardSkeleton() {
        return (
            <div
                aria-hidden="true"
                className="
                    overflow-hidden rounded-2xl
                    border border-slate-200/70
                    bg-white/80
                    dark:border-white/10
                    dark:bg-slate-950/75
                "
            >
                <div
                    className="
                        h-32 bg-slate-200
                        dark:bg-slate-800
                        motion-safe:animate-pulse
                    "
                />

                <div className="space-y-4 p-5">
                    <div
                        className="
                            h-6 w-24 rounded-full
                            bg-slate-200
                            dark:bg-slate-800
                            motion-safe:animate-pulse
                        "
                    />

                    <div
                        className="
                            h-7 w-3/4 rounded-lg
                            bg-slate-200
                            dark:bg-slate-800
                            motion-safe:animate-pulse
                        "
                    />

                    <div className="space-y-2">
                        <div
                            className="
                                h-3 w-full rounded
                                bg-slate-200
                                dark:bg-slate-800
                                motion-safe:animate-pulse
                            "
                        />

                        <div
                            className="
                                h-3 w-4/5 rounded
                                bg-slate-200
                                dark:bg-slate-800
                                motion-safe:animate-pulse
                            "
                        />
                    </div>

                    <div
                        className="
                            h-20 rounded-xl
                            bg-slate-100
                            dark:bg-slate-900
                            motion-safe:animate-pulse
                        "
                    />

                    <div
                        className="
                            h-11 rounded-xl
                            bg-slate-200
                            dark:bg-slate-800
                            motion-safe:animate-pulse
                        "
                    />
                </div>
            </div>
        );
    }
);


// =========================================================
// EMPTY STATE
// =========================================================

const EventEmptyState = memo(
    function EventEmptyState({
        filtered = false,
        onReset,
    }) {
        return (
            <div
                className="
                    mx-auto flex max-w-lg
                    flex-col items-center
                    rounded-2xl border
                    border-slate-200/80
                    bg-white/75 p-8
                    text-center shadow-sm
                    backdrop-blur-xl

                    dark:border-white/10
                    dark:bg-slate-950/70
                "
            >
                <div
                    className="
                        mb-4 flex h-16 w-16
                        items-center justify-center
                        rounded-2xl
                        bg-sky-100 text-sky-600

                        dark:bg-sky-500/10
                        dark:text-sky-400
                    "
                >
                    <Inbox size={30} />
                </div>

                <h2
                    className="
                        text-xl font-bold
                        text-slate-900
                        dark:text-white
                    "
                >
                    {filtered
                        ? "Tadbir topilmadi"
                        : "Hozircha tadbirlar yo‘q"}
                </h2>

                <p
                    className="
                        mt-2 text-sm leading-relaxed
                        text-slate-600
                        dark:text-slate-400
                    "
                >
                    {filtered
                        ? "Tanlangan filtr yoki qidiruv " +
                          "bo‘yicha tadbir topilmadi."
                        : "Yangi tadbirlar yaratilganda " +
                          "ular shu yerda paydo bo‘ladi."}
                </p>

                {filtered && (
                    <button
                        type="button"
                        onClick={onReset}
                        className="
                            mt-5 inline-flex min-h-11
                            items-center gap-2
                            rounded-xl
                            bg-slate-900 px-5
                            text-sm font-semibold
                            text-white transition-colors
                            hover:bg-slate-800

                            dark:bg-white
                            dark:text-slate-950
                            dark:hover:bg-slate-200
                        "
                    >
                        <X size={16} />
                        Filtrlarni tozalash
                    </button>
                )}
            </div>
        );
    }
);


// =========================================================
// EVENTS PAGE
// =========================================================

export default function EventsPage() {
    const dispatchSearchId = useId();

    const {
        events,
        count,
        next,
        previous,

        loading,
        isLoaded,
        error,

        refresh,
    } = useEvents();

    // =====================================================
    // LOCAL UI STATE
    // =====================================================

    const [activeFilter, setActiveFilter] =
        useState("all");

    const [search, setSearch] =
        useState("");

    const [pageNumber, setPageNumber] =
        useState(1);

    const [paginationError, setPaginationError] =
        useState(null);

    // =====================================================
    // STATUS COUNTS
    // =====================================================

    const statusCounts = useMemo(() => {
        const counts = {
            all: 0,
            active: 0,
            scheduled: 0,
            finished: 0,
            disabled: 0,
        };

        for (const event of events) {
            counts.all += 1;

            const status =
                getEventDisplayStatus(event);

            if (
                Object.prototype.hasOwnProperty.call(
                    counts,
                    status
                )
            ) {
                counts[status] += 1;
            }
        }

        return counts;
    }, [events]);

    // =====================================================
    // FILTERED EVENTS
    // =====================================================

    const filteredEvents = useMemo(() => {
        const query = normalizeSearch(search);

        return events.filter((event) => {
            const status =
                getEventDisplayStatus(event);

            if (
                activeFilter !== "all" &&
                status !== activeFilter
            ) {
                return false;
            }

            if (!query) {
                return true;
            }

            return getEventSearchText(
                event
            ).includes(query);
        });
    }, [
        events,
        activeFilter,
        search,
    ]);

    // =====================================================
    // RESET FILTERS
    // =====================================================

    const resetFilters = useCallback(() => {
        setActiveFilter("all");
        setSearch("");
    }, []);

    // =====================================================
    // REFRESH EVENTS
    // =====================================================

    const handleRefresh = useCallback(() => {
        setPaginationError(null);

        return refresh();
    }, [refresh]);

    // =====================================================
    // PAGINATION
    // =====================================================

    const handleChangePage = useCallback(
        async (paginationLink, direction) => {
            if (
                loading ||
                !paginationLink
            ) {
                return;
            }

            const params =
                getPaginationParams(
                    paginationLink
                );

            if (!params) {
                setPaginationError(
                    "Backend sahifalash havolasi " +
                    "tushunarsiz. Ma'lumotlarni " +
                    "yangilab ko‘ring."
                );
                return;
            }

            setPaginationError(null);

            const action = await refresh({
                params,
            });

            if (
                fetchPublicEvents.fulfilled.match(
                    action
                )
            ) {
                setPageNumber((current) =>
                    Math.max(
                        1,
                        current + direction
                    )
                );

                // Filters are local to the
                // currently loaded backend page.
                resetFilters();
            }
        },
        [
            loading,
            refresh,
            resetFilters,
        ]
    );

    // =====================================================
    // COUNTDOWN EXPIRED
    // =====================================================
    //
    // Recheck events using GET.
    // Never automatically claim rewards.
    //
    // =====================================================

    const handleCountdownExpire =
        useCallback(() => {
            refresh();
        }, [refresh]);

    // =====================================================
    // DERIVED UI STATE
    // =====================================================

    const hasEvents =
        events.length > 0;

    const hasFilters =
        activeFilter !== "all" ||
        normalizeSearch(search).length > 0;

    const showSkeleton =
        loading && !hasEvents;

    const showError =
        Boolean(error) && !hasEvents;

    const showEmpty =
        isLoaded &&
        !hasEvents &&
        !loading;

    const showFilteredEmpty =
        !loading &&
        hasEvents &&
        filteredEvents.length === 0;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <main
            className="
                relative isolate min-h-screen
                w-full min-w-0
                px-3 py-8
                sm:px-5 sm:py-10
                lg:px-8
            "
        >
            <div
                className="
                    mx-auto flex w-full
                    max-w-7xl flex-col gap-7
                "
            >
                {/* =====================================
                    PAGE HEADER
                ===================================== */}

                <header
                    className="
                        relative overflow-hidden
                        rounded-3xl border
                        border-slate-200/80
                        bg-white/80 p-5
                        shadow-xl shadow-slate-900/5
                        backdrop-blur-xl

                        dark:border-white/10
                        dark:bg-slate-950/80
                        dark:shadow-black/20

                        sm:p-8
                    "
                >
                    <div
                        aria-hidden="true"
                        className="
                            pointer-events-none
                            absolute -right-16 -top-20
                            h-60 w-60 rounded-full
                            bg-cyan-400/10 blur-3xl
                            dark:bg-cyan-400/10
                        "
                    />

                    <div
                        className="
                            relative z-10
                            flex flex-col gap-5
                            md:flex-row
                            md:items-center
                            md:justify-between
                        "
                    >
                        <div className="max-w-2xl">
                            <div
                                className="
                                    mb-3 inline-flex
                                    items-center gap-2
                                    text-xs font-bold
                                    uppercase tracking-[0.2em]
                                    text-sky-700
                                    dark:text-sky-400
                                "
                            >
                                <Sparkles
                                    size={16}
                                    aria-hidden="true"
                                />

                                FSOCIETY EVENTS
                            </div>

                            <h1
                                className="
                                    text-3xl font-black
                                    tracking-tight
                                    text-slate-900
                                    dark:text-white
                                    sm:text-4xl
                                "
                            >
                                Tadbirlar markazi
                            </h1>

                            <p
                                className="
                                    mt-3 max-w-xl
                                    text-sm leading-relaxed
                                    text-slate-600
                                    dark:text-slate-400
                                    sm:text-base
                                "
                            >
                                FSociety bayramlari,
                                maxsus tadbirlar va
                                sovg‘alar bir joyda.
                                Yaqinlashayotgan
                                tadbirlarni kuzating.
                            </p>

                            <div
                                className="
                                    mt-5 inline-flex
                                    items-center gap-2
                                    rounded-full border
                                    border-slate-200
                                    bg-slate-50 px-3 py-2
                                    text-xs font-semibold
                                    text-slate-600

                                    dark:border-white/10
                                    dark:bg-white/5
                                    dark:text-slate-300
                                "
                            >
                                <CalendarDays
                                    size={15}
                                    aria-hidden="true"
                                />

                                {loading && !hasEvents
                                    ? "Tadbirlar yuklanmoqda"
                                    : `Jami ${count} ta tadbir`}
                            </div>
                        </div>

                        <div
                            className="
                                hidden h-28 w-28 shrink-0
                                items-center justify-center
                                rounded-3xl border
                                border-sky-200/50
                                bg-gradient-to-br
                                from-sky-100 to-teal-100
                                text-sky-700

                                dark:border-sky-500/20
                                dark:from-sky-500/10
                                dark:to-emerald-500/10
                                dark:text-sky-300

                                md:flex
                            "
                            aria-hidden="true"
                        >
                            <Gift
                                size={54}
                                strokeWidth={1.4}
                            />
                        </div>
                    </div>
                </header>

                {/* =====================================
                    SEARCH AND REFRESH
                ===================================== */}

                <section
                    aria-label="Tadbirlarni qidirish"
                    className="
                        flex flex-col gap-3
                        sm:flex-row
                    "
                >
                    <div
                        className="
                            relative min-w-0 flex-1
                        "
                    >
                        <label
                            htmlFor={dispatchSearchId}
                            className="sr-only"
                        >
                            Tadbir nomini qidirish
                        </label>

                        <Search
                            size={19}
                            aria-hidden="true"
                            className="
                                pointer-events-none
                                absolute left-4 top-1/2
                                -translate-y-1/2
                                text-slate-400
                            "
                        />

                        <input
                            id={dispatchSearchId}
                            type="search"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Tadbirlarni qidirish..."
                            className="
                                min-h-12 w-full
                                rounded-xl border
                                border-slate-200
                                bg-white/85
                                pl-11 pr-4
                                text-sm text-slate-900
                                outline-none
                                backdrop-blur-md

                                placeholder:text-slate-400
                                focus:border-sky-400
                                focus:ring-2
                                focus:ring-sky-400/20

                                dark:border-white/10
                                dark:bg-slate-950/80
                                dark:text-white
                                dark:focus:border-sky-500
                            "
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={loading}
                        className="
                            inline-flex min-h-12
                            items-center justify-center
                            gap-2 rounded-xl
                            border border-slate-200
                            bg-white/85 px-5
                            text-sm font-semibold
                            text-slate-700
                            transition-colors
                            hover:bg-slate-100
                            disabled:cursor-not-allowed
                            disabled:opacity-60

                            dark:border-white/10
                            dark:bg-slate-950/80
                            dark:text-slate-200
                            dark:hover:bg-slate-900
                        "
                    >
                        <RefreshCw
                            size={17}
                            aria-hidden="true"
                            className={
                                loading
                                    ? "motion-safe:animate-spin"
                                    : ""
                            }
                        />

                        Yangilash
                    </button>
                </section>

                {/* =====================================
                    STATUS FILTERS
                ===================================== */}

                <section
                    aria-label="Tadbirlar holati"
                    className="
                        flex flex-wrap gap-2
                    "
                >
                    {EVENT_FILTERS.map(
                        (filter) => {
                            const active =
                                activeFilter ===
                                filter.id;

                            return (
                                <button
                                    key={filter.id}
                                    type="button"
                                    aria-pressed={active}
                                    onClick={() =>
                                        setActiveFilter(
                                            filter.id
                                        )
                                    }
                                    className={[
                                        "inline-flex min-h-10",
                                        "items-center gap-2",
                                        "rounded-full border",
                                        "px-4 py-2",
                                        "text-xs font-semibold",
                                        "transition-colors",
                                        "focus-visible:outline",
                                        "focus-visible:outline-2",
                                        "focus-visible:outline-offset-2",
                                        "focus-visible:outline-sky-500",

                                        active
                                            ? [
                                                "border-slate-900",
                                                "bg-slate-900",
                                                "text-white",
                                                "dark:border-white",
                                                "dark:bg-white",
                                                "dark:text-slate-950",
                                            ].join(" ")
                                            : [
                                                "border-slate-200",
                                                "bg-white/80",
                                                "text-slate-600",
                                                "hover:bg-slate-100",
                                                "dark:border-white/10",
                                                "dark:bg-slate-950/75",
                                                "dark:text-slate-300",
                                                "dark:hover:bg-slate-900",
                                            ].join(" "),
                                    ].join(" ")}
                                >
                                    {filter.label}

                                    <span
                                        className={[
                                            "rounded-full px-1.5",
                                            "py-0.5 text-[10px]",
                                            active
                                                ? "bg-white/20 dark:bg-slate-900/10"
                                                : "bg-slate-100 dark:bg-white/10",
                                        ].join(" ")}
                                    >
                                        {statusCounts[
                                            filter.id
                                        ] ?? 0}
                                    </span>
                                </button>
                            );
                        }
                    )}
                </section>

                {/* =====================================
                    ERRORS
                ===================================== */}

                {error && (
                    <div
                        role="alert"
                        className="
                            flex flex-col gap-3
                            rounded-xl border
                            border-rose-200
                            bg-rose-50 p-4
                            text-sm text-rose-800

                            dark:border-rose-500/20
                            dark:bg-rose-500/10
                            dark:text-rose-200

                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >
                        <div
                            className="
                                flex items-start gap-2
                            "
                        >
                            <AlertCircle
                                size={19}
                                className="shrink-0"
                                aria-hidden="true"
                            />

                            <span>
                                {error.message ??
                                    "Tadbirlarni yuklab bo‘lmadi."}
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={handleRefresh}
                            disabled={loading}
                            className="
                                min-h-10 rounded-lg
                                border border-rose-300
                                px-4 font-semibold
                                hover:bg-rose-100
                                disabled:opacity-60

                                dark:border-rose-500/30
                                dark:hover:bg-rose-500/10
                            "
                        >
                            Qayta urinish
                        </button>
                    </div>
                )}

                {paginationError && (
                    <p
                        role="alert"
                        className="
                            rounded-xl border
                            border-amber-200
                            bg-amber-50 p-3
                            text-sm text-amber-800

                            dark:border-amber-500/20
                            dark:bg-amber-500/10
                            dark:text-amber-200
                        "
                    >
                        {paginationError}
                    </p>
                )}

                {/* =====================================
                    EVENT GRID
                ===================================== */}

                {showSkeleton ? (
                    <div
                        aria-label="Tadbirlar yuklanmoqda"
                        className="
                            grid grid-cols-1 gap-5
                            md:grid-cols-2
                            xl:grid-cols-3
                        "
                    >
                        {Array.from(
                            { length: 6 },
                            (_, index) => (
                                <EventCardSkeleton
                                    key={index}
                                />
                            )
                        )}
                    </div>
                ) : showError ? null : showEmpty ? (
                    <EventEmptyState />
                ) : showFilteredEmpty ? (
                    <EventEmptyState
                        filtered
                        onReset={resetFilters}
                    />
                ) : (
                    <section
                        aria-label="Tadbirlar ro‘yxati"
                        className="
                            grid grid-cols-1
                            gap-5 md:grid-cols-2
                            xl:grid-cols-3
                        "
                    >
                        {filteredEvents.map(
                            (event, index) => (
                                <EventCard
                                    key={
                                        event.id ??
                                        event.slug ??
                                        index
                                    }
                                    event={event}
                                    onCountdownExpire={
                                        handleCountdownExpire
                                    }
                                />
                            )
                        )}
                    </section>
                )}

                {/* =====================================
                    PAGINATION
                ===================================== */}

                {(next || previous) && (
                    <nav
                        aria-label="Tadbirlar sahifalari"
                        className="
                            flex flex-wrap items-center
                            justify-between gap-3
                            rounded-2xl border
                            border-slate-200/80
                            bg-white/75 p-4

                            dark:border-white/10
                            dark:bg-slate-950/70
                        "
                    >
                        <button
                            type="button"
                            disabled={
                                loading ||
                                !previous
                            }
                            onClick={() =>
                                handleChangePage(
                                    previous,
                                    -1
                                )
                            }
                            className="
                                inline-flex min-h-11
                                items-center gap-2
                                rounded-xl
                                border border-slate-200
                                px-4 text-sm
                                font-semibold
                                text-slate-700
                                hover:bg-slate-100
                                disabled:cursor-not-allowed
                                disabled:opacity-40

                                dark:border-white/10
                                dark:text-slate-200
                                dark:hover:bg-slate-900
                            "
                        >
                            <ArrowLeft
                                size={17}
                                aria-hidden="true"
                            />

                            Oldingi
                        </button>

                        <span
                            className="
                                text-sm font-semibold
                                text-slate-600
                                dark:text-slate-300
                            "
                        >
                            Sahifa {pageNumber}
                        </span>

                        <button
                            type="button"
                            disabled={
                                loading ||
                                !next
                            }
                            onClick={() =>
                                handleChangePage(
                                    next,
                                    1
                                )
                            }
                            className="
                                inline-flex min-h-11
                                items-center gap-2
                                rounded-xl
                                border border-slate-200
                                px-4 text-sm
                                font-semibold
                                text-slate-700
                                hover:bg-slate-100
                                disabled:cursor-not-allowed
                                disabled:opacity-40

                                dark:border-white/10
                                dark:text-slate-200
                                dark:hover:bg-slate-900
                            "
                        >
                            Keyingi

                            <ArrowRight
                                size={17}
                                aria-hidden="true"
                            />
                        </button>
                    </nav>
                )}

                {/* =====================================
                    FOOTNOTE
                ===================================== */}

                <p
                    className="
                        text-center text-xs
                        leading-relaxed
                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    Tadbirlar ma'lumotlari
                    FSociety backendidan olinadi.
                    Qidiruv va filtrlar
                    yuklangan sahifaga qo‘llanadi.
                </p>
            </div>
        </main>
    );
}
