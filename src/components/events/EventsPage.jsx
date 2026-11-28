
 // src/components/events/EventsPage.jsx

import React, {
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    AlertCircle,
    Archive,
    CalendarDays,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Gift,
    Loader2,
    RefreshCw,
    Search,
    Sparkles,
    Ticket,
    X,
} from "lucide-react";

import {
    EVENT_REQUEST_STATUS,
    fetchPublicEvents,
    selectPublicEvents,
    selectEventsCount,
    selectEventsError,
    selectEventsListStatus,
    selectEventsNextPage,
    selectEventsPreviousPage,
} from "../../features/events/eventsSlice";

import EventCard, {
    getEventStatus,
    getEventBanner,
} from "./EventCard";

// =========================================================
// FSOCIETY — EVENT PASSPORT / POSTER WALL
// =========================================================
//
// Features:
//
// - Cinematic featured event
// - Compact event gallery
// - Foldable disabled / finished archive
// - Django Admin event banners
// - Backend-controlled Daily / Seasonal / Both
// - Current-page search and status filters
// - Redux data and server pagination
// - Dark / Light mode
// - Responsive layout
//
// No gift claim is performed directly here.
// EventCard handles gift component visibility.
// Django remains the source of truth.
//
// =========================================================


// =========================================================
// CONSTANTS
// =========================================================

const {
    IDLE,
    LOADING,
    SUCCEEDED,
    FAILED,
} = EVENT_REQUEST_STATUS;

const FILTERS = [
    {
        key: "all",
        label: "Barchasi",
    },
    {
        key: "active",
        label: "Faol",
    },
    {
        key: "scheduled",
        label: "Kutilmoqda",
    },
    {
        key: "finished",
        label: "Yakunlangan",
    },
    {
        key: "disabled",
        label: "O‘chirilgan",
    },
];


// =========================================================
// EVENT HELPERS
// =========================================================

const isAvailable = (event) =>
    ["active", "scheduled"].includes(
        getEventStatus(event)
    );

const isTest = (event) =>
    /(^|[-_])test([-_]|$)/i.test(
        event?.slug ?? ""
    );


// =========================================================
// SPOTLIGHT SELECTION
// =========================================================
//
// Priority:
//
// 1. Explicit featured event
// 2. Non-test event with uploaded Admin banner
// 3. New Year 2027 fallback
// 4. Active non-test event
// 5. Scheduled non-test event
// 6. Any available event
//
// Disabled / finished events are never spotlighted.
//
// =========================================================

const chooseSpotlight = (events) => {
    const available = events.filter(
        isAvailable
    );

    if (!available.length) {
        return null;
    }

    return (
        available.find(
            (event) =>
                event.is_featured === true ||
                event.featured === true
        ) ??

        available.find(
            (event) =>
                !isTest(event) &&
                Boolean(
                    getEventBanner(event)
                )
        ) ??

        available.find(
            (event) =>
                event.slug === "new-year-2027"
        ) ??

        available.find(
            (event) =>
                !isTest(event) &&
                getEventStatus(event) === "active"
        ) ??

        available.find(
            (event) =>
                !isTest(event) &&
                getEventStatus(event) === "scheduled"
        ) ??

        available[0]
    );
};


// =========================================================
// FILTER EVENTS
// =========================================================
//
// Filtering is performed on the currently
// loaded backend pagination page.
//
// Search terms:
// - Name
// - Title
// - Description
// - Slug
//
// =========================================================

const filterEvents = (
    events,
    query,
    filter
) => {
    const needle = query
        .trim()
        .toLocaleLowerCase();

    return events.filter((event) => {
        if (
            !event ||
            typeof event !== "object"
        ) {
            return false;
        }

        if (
            filter !== "all" &&
            getEventStatus(event) !== filter
        ) {
            return false;
        }

        if (!needle) {
            return true;
        }

        const searchableText = [
            event.name,
            event.title,
            event.description,
            event.short_description,
            event.slug,
        ]
            .filter(
                (value) =>
                    typeof value === "string"
            )
            .join(" ")
            .toLocaleLowerCase();

        return searchableText.includes(
            needle
        );
    });
};


// =========================================================
// POSTER SKELETON
// =========================================================

const PosterSkeleton = memo(
    function PosterSkeleton({
        featured = false,
    }) {
        return (
            <div
                aria-hidden="true"
                className="
                    overflow-hidden
                    rounded-[24px]
                    border border-slate-200/70
                    bg-white/80
                    dark:border-white/10
                    dark:bg-[#11192d]
                "
            >
                <div
                    className={`
                        motion-safe:animate-pulse
                        bg-slate-200/90
                        dark:bg-white/10
                        ${
                            featured
                                ? "aspect-[16/9] max-h-[460px]"
                                : "aspect-[16/9]"
                        }
                    `}
                />

                <div className="space-y-3 p-5">
                    <div
                        className="
                            h-5 w-2/3
                            motion-safe:animate-pulse
                            rounded
                            bg-slate-200
                            dark:bg-white/10
                        "
                    />

                    <div
                        className="
                            h-3 w-4/5
                            motion-safe:animate-pulse
                            rounded
                            bg-slate-100
                            dark:bg-white/[0.06]
                        "
                    />
                </div>
            </div>
        );
    }
);


// =========================================================
// MAIN EVENTS PAGE
// =========================================================

function EventsPage() {
    const dispatch = useDispatch();

    // =====================================================
    // REDUX DATA
    // =====================================================

    const events = useSelector(
        selectPublicEvents
    );

    const totalCount = useSelector(
        selectEventsCount
    );

    const listStatus = useSelector(
        selectEventsListStatus
    );

    const listError = useSelector(
        selectEventsError
    );

    const nextPage = useSelector(
        selectEventsNextPage
    );

    const previousPage = useSelector(
        selectEventsPreviousPage
    );

    // =====================================================
    // LOCAL STATE
    // =====================================================

    const [filter, setFilter] =
        useState("all");

    const [query, setQuery] =
        useState("");

    const [showArchive, setShowArchive] =
        useState(false);

    const [page, setPage] =
        useState(1);

    const [pendingPage, setPendingPage] =
        useState(null);

    const pageLock = useRef(false);

    // =====================================================
    // NORMALIZE EVENTS
    // =====================================================

    const items = useMemo(
        () =>
            Array.isArray(events)
                ? events
                : [],
        [events]
    );

    // =====================================================
    // REQUEST STATUS
    // =====================================================

    const isLoading =
        listStatus === LOADING;

    const isLoaded =
        listStatus === SUCCEEDED;

    const isFailed =
        listStatus === FAILED;

    const hasFilters = Boolean(
        filter !== "all" ||
        query.trim()
    );

    // =====================================================
    // INITIAL FETCH
    // =====================================================
    //
    // EventsController may have loaded data already.
    //
    // Only dispatch when Redux state is IDLE.
    // The thunk also prevents duplicate requests.
    //
    // =====================================================

    useEffect(() => {
        if (listStatus !== IDLE) {
            return;
        }

        void dispatch(
            fetchPublicEvents()
        );
    }, [
        dispatch,
        listStatus,
    ]);

    // =====================================================
    // FILTERED DATA
    // =====================================================

    const matching = useMemo(
        () =>
            filterEvents(
                items,
                query,
                filter
            ),
        [
            items,
            query,
            filter,
        ]
    );

    // =====================================================
    // FEATURED EVENT
    // =====================================================

    const spotlight = useMemo(
        () => chooseSpotlight(matching),
        [matching]
    );

    // =====================================================
    // ARCHIVE
    // =====================================================
    //
    // Disabled and finished events are collapsed
    // only when there is an available spotlight
    // and no active search/filter.
    //
    // =====================================================

    const archive = useMemo(
        () => {
            if (
                hasFilters ||
                !spotlight
            ) {
                return [];
            }

            return matching.filter(
                (event) =>
                    !isAvailable(event)
            );
        },
        [
            matching,
            hasFilters,
            spotlight,
        ]
    );

    // =====================================================
    // MAIN GALLERY
    // =====================================================

    const gallery = useMemo(
        () =>
            matching.filter(
                (event) =>
                    event !== spotlight &&
                    (
                        hasFilters ||
                        !spotlight ||
                        isAvailable(event)
                    )
            ),
        [
            matching,
            spotlight,
            hasFilters,
        ]
    );

    // =====================================================
    // STATS
    // =====================================================

    const activeCount = useMemo(
        () =>
            items.filter(
                (event) =>
                    getEventStatus(event) === "active"
            ).length,
        [items]
    );

    const errorMessage =
        typeof listError === "string"
            ? listError
            : listError?.message ??
              "Tadbirlar ro‘yxatini yuklab bo‘lmadi.";

    // =====================================================
    // CLEAR FILTERS
    // =====================================================

    const clearFilters = useCallback(
        () => {
            setFilter("all");
            setQuery("");
        },
        []
    );

    // =====================================================
    // REFRESH EVENTS
    // =====================================================

    const refresh = useCallback(
        () => {
            if (
                isLoading ||
                pageLock.current
            ) {
                return;
            }

            void dispatch(
                fetchPublicEvents({
                    params: {
                        page,
                    },
                })
            );
        },
        [
            dispatch,
            isLoading,
            page,
        ]
    );

    // =====================================================
    // SERVER PAGINATION
    // =====================================================

    const changePage = useCallback(
        async (targetPage) => {
            if (
                isLoading ||
                pageLock.current ||
                !Number.isSafeInteger(targetPage) ||
                targetPage < 1 ||
                targetPage === page
            ) {
                return;
            }

            if (
                targetPage < page &&
                !previousPage
            ) {
                return;
            }

            if (
                targetPage > page &&
                !nextPage
            ) {
                return;
            }

            pageLock.current = true;

            setPendingPage(
                targetPage
            );

            try {
                const action = await dispatch(
                    fetchPublicEvents({
                        params: {
                            page: targetPage,
                        },
                    })
                );

                if (
                    fetchPublicEvents.fulfilled.match(
                        action
                    )
                ) {
                    setPage(targetPage);

                    setShowArchive(false);
                }
            } finally {
                pageLock.current = false;

                setPendingPage(null);
            }
        },
        [
            dispatch,
            isLoading,
            page,
            previousPage,
            nextPage,
        ]
    );

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <main
            className="
                relative isolate min-h-screen
                overflow-hidden
                px-3 pb-12 pt-5
                sm:px-6 sm:pt-7
                lg:px-8
            "
        >
            {/* =========================================
                SUBTLE BACKGROUND
            ========================================= */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute inset-0 -z-10
                    opacity-[0.025]
                    dark:opacity-[0.055]
                    [background-image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)]
                    [background-size:48px_48px]
                "
            />

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute -right-32 top-0 -z-10
                    h-[350px] w-[350px]
                    rounded-full
                    bg-fuchsia-500/10
                    blur-[90px]
                "
            />

            <div className="mx-auto max-w-7xl">
                {/* =====================================
                    HEADER
                ===================================== */}

                <header
                    className="
                        flex flex-col gap-4
                        border-b border-slate-200/80
                        pb-4
                        dark:border-white/10
                        md:flex-row
                        md:items-end
                        md:justify-between
                    "
                >
                    <div className="min-w-0">
                        {/* BRAND */}

                        <p
                            className="
                                flex items-center gap-2
                                text-[10px] font-black
                                tracking-[.22em]
                                text-fuchsia-600
                                dark:text-fuchsia-300
                            "
                        >
                            <Ticket
                                size={16}
                                aria-hidden="true"
                            />

                            FSOCIETY / EVENT PASSPORT
                        </p>

                        {/* HEADING */}

                        <h1
                            className="
                                mt-1.5
                                text-[30px] font-black
                                leading-[1.1]
                                tracking-[-.04em]
                                text-slate-950
                                sm:text-[38px]
                                dark:text-white
                            "
                        >
                            Bayramlarni{" "}

                            <span
                                className="
                                    bg-gradient-to-r
                                    from-fuchsia-600
                                    via-violet-600
                                    to-cyan-500
                                    bg-clip-text
                                    text-transparent
                                "
                            >
                                his qil.
                            </span>
                        </h1>

                        {/* DESCRIPTION */}

                        <p
                            className="
                                mt-1.5 max-w-xl
                                text-[13px] leading-6
                                text-slate-600
                                dark:text-slate-400
                            "
                        >
                            Har tadbir — alohida hikoya.
                            Kunlik sovg‘alar va bayram
                            uchun maxsus mukofotlar.
                        </p>
                    </div>

                    {/* =================================
                        STATS
                    ================================= */}

                    <div
                        className="
                            flex shrink-0 flex-wrap
                            gap-2 text-xs font-bold
                        "
                    >
                        {/* TOTAL EVENTS */}

                        <span
                            className="
                                inline-flex items-center
                                gap-1.5 rounded-xl
                                border border-slate-200
                                bg-white/85 px-3 py-2
                                text-slate-700
                                dark:border-white/10
                                dark:bg-white/5
                                dark:text-slate-200
                            "
                        >
                            <CalendarDays
                                size={15}
                                className="text-violet-500"
                                aria-hidden="true"
                            />

                            {Number(totalCount) || 0} tadbir
                        </span>

                        {/* ACTIVE EVENTS */}

                        <span
                            className="
                                inline-flex items-center
                                gap-1.5 rounded-xl
                                border border-emerald-500/20
                                bg-emerald-500/10
                                px-3 py-2
                                text-emerald-700
                                dark:text-emerald-300
                            "
                        >
                            <span
                                className="
                                    h-2 w-2 rounded-full
                                    bg-emerald-500
                                "
                            />

                            {activeCount} faol (joriy sahifa)
                        </span>
                    </div>
                </header>

                {/* =====================================
                    EVENT CATALOG
                ===================================== */}

                <section
                    aria-label="Tadbirlar katalogi"
                    className="mt-4"
                >
                    {/* ===============================
                        FILTER BAR
                    =============================== */}

                    <div
                        className="
                            flex flex-col gap-2
                            rounded-2xl
                            border border-slate-200/70
                            bg-white/80 p-2
                            shadow-sm backdrop-blur-xl
                            dark:border-white/10
                            dark:bg-[#11192d]/80
                            lg:flex-row
                            lg:items-center
                            lg:justify-between
                        "
                    >
                        {/* STATUS FILTERS */}

                        <div
                            role="group"
                            aria-label="Tadbir holati"
                            className="
                                flex min-w-0 gap-1
                                overflow-x-auto
                            "
                        >
                            {FILTERS.map(
                                ({ key, label }) => (
                                    <button
                                        key={key}
                                        type="button"
                                        aria-pressed={
                                            filter === key
                                        }
                                        onClick={() =>
                                            setFilter(key)
                                        }
                                        className={`
                                            shrink-0 rounded-xl
                                            px-3.5 py-2.5
                                            text-xs font-extrabold
                                            transition-colors
                                            focus-visible:outline-none
                                            focus-visible:ring-2
                                            focus-visible:ring-violet-400
                                            ${
                                                filter === key
                                                    ? "bg-[#201b49] text-white shadow-sm dark:bg-fuchsia-600"
                                                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.07]"
                                            }
                                        `}
                                    >
                                        {label}
                                    </button>
                                )
                            )}
                        </div>

                        {/* ===========================
                            SEARCH + REFRESH
                        =========================== */}

                        <div
                            className="
                                flex min-w-0 gap-2
                                lg:w-[300px]
                            "
                        >
                            {/* SEARCH */}

                            <div
                                className="
                                    relative min-w-0 flex-1
                                "
                            >
                                <Search
                                    size={16}
                                    aria-hidden="true"
                                    className="
                                        pointer-events-none
                                        absolute left-3 top-1/2
                                        -translate-y-1/2
                                        text-slate-400
                                    "
                                />

                                <input
                                    type="search"
                                    aria-label="Tadbir qidirish"
                                    value={query}
                                    onChange={(event) =>
                                        setQuery(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Tadbir qidirish..."
                                    className="
                                        h-10 w-full rounded-xl
                                        border border-slate-200
                                        bg-slate-50/90
                                        pl-9 pr-3
                                        text-sm text-slate-900
                                        outline-none
                                        placeholder:text-slate-400
                                        focus:border-violet-400
                                        focus:ring-2
                                        focus:ring-violet-400/20
                                        dark:border-white/10
                                        dark:bg-white/[0.05]
                                        dark:text-white
                                    "
                                />
                            </div>

                            {/* REFRESH */}

                            <button
                                type="button"
                                onClick={refresh}
                                disabled={isLoading}
                                aria-label="Tadbirlarni yangilash"
                                title="Yangilash"
                                className="
                                    flex h-10 w-10 shrink-0
                                    items-center justify-center
                                    rounded-xl
                                    border border-slate-200
                                    bg-slate-50
                                    text-slate-600
                                    hover:text-violet-600
                                    disabled:opacity-50
                                    dark:border-white/10
                                    dark:bg-white/5
                                    dark:text-slate-200
                                "
                            >
                                {isLoading ? (
                                    <Loader2
                                        size={17}
                                        className="motion-safe:animate-spin"
                                    />
                                ) : (
                                    <RefreshCw size={17} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* =================================
                        ACTIVE FILTER INFORMATION
                    ================================= */}

                    {hasFilters && (
                        <div
                            className="
                                mt-2 flex flex-wrap
                                items-center justify-between
                                gap-2 px-1
                                text-xs text-slate-500
                                dark:text-slate-400
                            "
                        >
                            <span>
                                Qidiruv va filtr joriy
                                yuklangan sahifaga qo‘llanadi.
                            </span>

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="
                                    inline-flex items-center
                                    gap-1 font-bold
                                    text-fuchsia-600
                                    hover:underline
                                    dark:text-fuchsia-300
                                "
                            >
                                <X size={14} />

                                Tozalash
                            </button>
                        </div>
                    )}

                    {/* =================================
                        API ERROR
                    ================================= */}

                    {isFailed && (
                        <div
                            role="alert"
                            className="
                                mt-3 flex flex-wrap
                                items-center gap-2
                                rounded-xl
                                border border-rose-500/20
                                bg-rose-500/10 p-3
                                text-sm text-rose-700
                                dark:text-rose-300
                            "
                        >
                            <AlertCircle
                                size={18}
                                className="shrink-0"
                            />

                            <span className="min-w-0 flex-1">
                                {errorMessage}
                            </span>

                            <button
                                type="button"
                                onClick={refresh}
                                className="
                                    rounded-lg
                                    border border-rose-500/30
                                    px-3 py-2
                                    text-xs font-bold
                                "
                            >
                                Qayta urinish
                            </button>
                        </div>
                    )}

                    {/* =================================
                        EVENT RESULTS
                    ================================= */}

                    <div
                        aria-busy={isLoading}
                        className={`
                            mt-4
                            ${
                                isLoading && items.length
                                    ? "opacity-70"
                                    : ""
                            }
                        `}
                    >
                        {/* ===========================
                            LOADING SKELETON
                        =========================== */}

                        {isLoading &&
                        items.length === 0 ? (
                            <div
                                role="status"
                                aria-label="Tadbirlar yuklanmoqda"
                                className="space-y-4"
                            >
                                <PosterSkeleton featured />

                                <div
                                    className="
                                        grid gap-4
                                        md:grid-cols-2
                                    "
                                >
                                    <PosterSkeleton />

                                    <PosterSkeleton />
                                </div>
                            </div>
                        ) : spotlight ||
                          gallery.length > 0 ? (
                            <div className="space-y-6">
                                {/* =====================
                                    FEATURED POSTER
                                ===================== */}

                                {spotlight && (
                                    <section
                                        aria-label="Asosiy bayram"
                                    >
                                        <EventCard
                                            key={`featured-${spotlight.slug ?? spotlight.id}`}
                                            event={spotlight}
                                            featured
                                        />
                                    </section>
                                )}

                                {/* =====================
                                    OTHER EVENTS
                                ===================== */}

                                {gallery.length > 0 && (
                                    <section
                                        aria-label="Boshqa bayramlar"
                                    >
                                        {/* HEADING */}

                                        <div
                                            className="
                                                mb-3 flex flex-wrap
                                                items-center
                                                justify-between
                                                gap-3
                                            "
                                        >
                                            <h2
                                                className="
                                                    inline-flex
                                                    items-center gap-2
                                                    text-lg font-black
                                                    text-slate-950
                                                    dark:text-white
                                                "
                                            >
                                                <Sparkles
                                                    size={18}
                                                    className="text-fuchsia-500"
                                                />

                                                {spotlight
                                                    ? "Yana kashf eting"
                                                    : "Bayramlar"}
                                            </h2>

                                            <span
                                                className="
                                                    text-xs font-semibold
                                                    text-slate-500
                                                    dark:text-slate-400
                                                "
                                            >
                                                {gallery.length} ta
                                            </span>
                                        </div>

                                        {/* EVENTS GRID */}

                                        <div
                                            className="
                                                grid gap-4
                                                md:grid-cols-2
                                                xl:gap-5
                                            "
                                        >
                                            {gallery.map(
                                                (event, index) => (
                                                    <EventCard
                                                        key={
                                                            event.slug ??
                                                            event.id ??
                                                            index
                                                        }
                                                        event={event}
                                                    />
                                                )
                                            )}
                                        </div>
                                    </section>
                                )}
                            </div>
                        ) : !isLoading &&
                          (isLoaded || isFailed) ? (
                            /* =====================
                                EMPTY STATE
                            ===================== */

                            <div
                                className="
                                    flex min-h-48
                                    flex-col items-center
                                    justify-center
                                    rounded-2xl
                                    border border-dashed
                                    border-slate-300
                                    bg-white/60 p-6
                                    text-center
                                    dark:border-white/15
                                    dark:bg-white/[0.025]
                                "
                            >
                                <Gift
                                    size={28}
                                    className="text-violet-500"
                                />

                                <h2
                                    className="
                                        mt-3 text-lg font-black
                                        text-slate-900
                                        dark:text-white
                                    "
                                >
                                    {hasFilters
                                        ? "Mos tadbir topilmadi"
                                        : "Hozircha tadbir yo‘q"}
                                </h2>

                                <p
                                    className="
                                        mt-1 text-sm
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    {hasFilters
                                        ? "Qidiruvni o‘zgartiring yoki filtrni tozalang."
                                        : "Bayramlar shu yerda paydo bo‘ladi."}
                                </p>

                                {hasFilters && (
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="
                                            mt-3 rounded-xl
                                            bg-violet-600
                                            px-4 py-2.5
                                            text-xs font-bold
                                            text-white
                                        "
                                    >
                                        Barchasini ko‘rish
                                    </button>
                                )}
                            </div>
                        ) : null}
                    </div>
                </section>

                {/* =====================================
                    COLLAPSIBLE ARCHIVE
                ===================================== */}

                {archive.length > 0 && (
                    <section
                        className="
                            mt-6 rounded-2xl
                            border border-slate-200/80
                            bg-white/60
                            dark:border-white/10
                            dark:bg-white/[0.025]
                        "
                    >
                        {/* ARCHIVE BUTTON */}

                        <button
                            type="button"
                            onClick={() =>
                                setShowArchive(
                                    (value) => !value
                                )
                            }
                            aria-expanded={showArchive}
                            aria-controls="fsociety-events-archive"
                            className="
                                flex w-full items-center
                                justify-between gap-3
                                px-4 py-3.5
                                text-left
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-inset
                                focus-visible:ring-violet-400
                                sm:px-5
                            "
                        >
                            <span
                                className="
                                    inline-flex items-center
                                    gap-2 text-sm font-extrabold
                                    text-slate-700
                                    dark:text-slate-200
                                "
                            >
                                <Archive
                                    size={17}
                                    className="text-violet-500"
                                />

                                Arxiv / o‘chirilgan tadbirlar

                                <span
                                    className="
                                        rounded-full
                                        bg-slate-200/75
                                        px-2 py-0.5
                                        text-xs
                                        dark:bg-white/10
                                    "
                                >
                                    {archive.length}
                                </span>
                            </span>

                            <ChevronDown
                                size={18}
                                className={`
                                    shrink-0 text-slate-500
                                    transition-transform
                                    ${
                                        showArchive
                                            ? "rotate-180"
                                            : ""
                                    }
                                `}
                            />
                        </button>

                        {/* ARCHIVED EVENTS */}

                        {showArchive && (
                            <div
                                id="fsociety-events-archive"
                                className="
                                    grid gap-3
                                    border-t
                                    border-slate-200/80
                                    p-3 sm:p-4
                                    dark:border-white/10
                                    lg:grid-cols-2
                                "
                            >
                                {archive.map(
                                    (event, index) => (
                                        <EventCard
                                            key={`archive-${event.slug ?? event.id ?? index}`}
                                            event={event}
                                            compact
                                        />
                                    )
                                )}
                            </div>
                        )}
                    </section>
                )}

                {/* =====================================
                    SERVER PAGINATION
                ===================================== */}

                {(
                    Boolean(previousPage) ||
                    Boolean(nextPage) ||
                    page > 1
                ) && (
                    <nav
                        aria-label="Tadbirlar sahifalari"
                        className="
                            mt-6 flex flex-wrap
                            items-center justify-center
                            gap-3
                        "
                    >
                        {/* PREVIOUS PAGE */}

                        <button
                            type="button"
                            disabled={
                                !previousPage ||
                                isLoading ||
                                pendingPage !== null
                            }
                            onClick={() =>
                                changePage(page - 1)
                            }
                            className="
                                inline-flex min-h-10
                                items-center gap-1.5
                                rounded-xl
                                border border-slate-200
                                bg-white px-4
                                text-sm font-bold
                                text-slate-700
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                                dark:border-white/10
                                dark:bg-white/5
                                dark:text-slate-200
                            "
                        >
                            <ChevronLeft size={16} />

                            Oldingi
                        </button>

                        {/* PAGE NUMBER */}

                        <span
                            className="
                                inline-flex min-h-10
                                items-center gap-2
                                rounded-xl
                                bg-violet-500/10
                                px-4 text-sm
                                font-black
                                text-violet-700
                                dark:text-violet-300
                            "
                        >
                            {pendingPage !== null && (
                                <Loader2
                                    size={15}
                                    className="motion-safe:animate-spin"
                                />
                            )}

                            {pendingPage ?? page}-sahifa
                        </span>

                        {/* NEXT PAGE */}

                        <button
                            type="button"
                            disabled={
                                !nextPage ||
                                isLoading ||
                                pendingPage !== null
                            }
                            onClick={() =>
                                changePage(page + 1)
                            }
                            className="
                                inline-flex min-h-10
                                items-center gap-1.5
                                rounded-xl
                                border border-slate-200
                                bg-white px-4
                                text-sm font-bold
                                text-slate-700
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                                dark:border-white/10
                                dark:bg-white/5
                                dark:text-slate-200
                            "
                        >
                            Keyingi

                            <ChevronRight size={16} />
                        </button>
                    </nav>
                )}
            </div>
        </main>
    );
}

export default memo(EventsPage);
