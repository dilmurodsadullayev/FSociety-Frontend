
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
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Gift,
    Loader2,
    RefreshCw,
    Search,
    Sparkles,
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
} from "./EventCard";

// =========================================================
// FSOCIETY — EVENTS PAGE
// =========================================================
//
// Location:
// src/components/events/EventsPage.jsx
//
// Features:
//
// - Public holiday events
// - Responsive cards
// - Live countdown inside EventCard
// - Seasonal Gift integration
// - Initial events loading
// - Error and retry states
// - Server pagination
// - Current-page search
// - Current-page status filtering
// - Light / Dark mode
// - Accessible controls
//
// IMPORTANT:
//
// Each event has ONE gift per user.
//
// No Daily Gift endpoints are used.
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

const STATUS_FILTERS = [
    {
        value: "all",
        label: "Barcha holatlar",
    },
    {
        value: "scheduled",
        label: "Kutilayotgan",
    },
    {
        value: "active",
        label: "Faol",
    },
    {
        value: "finished",
        label: "Yakunlangan",
    },
    {
        value: "disabled",
        label: "O‘chirilgan",
    },
];

const normalizeSearch = (value) =>
    String(value ?? "")
        .trim()
        .toLocaleLowerCase();


// =========================================================
// FILTER EVENTS
// =========================================================
//
// Filtering is performed only on the
// currently loaded backend page.
//
// The server count and pagination are
// not modified by local filters.
//
// =========================================================

const filterEvents = (
    events,
    search,
    statusFilter
) => {
    const term = normalizeSearch(search);

    return events.filter((event) => {
        if (
            !event ||
            typeof event !== "object"
        ) {
            return false;
        }

        const eventStatus =
            getEventStatus(event);

        if (
            statusFilter !== "all" &&
            eventStatus !== statusFilter
        ) {
            return false;
        }

        if (!term) {
            return true;
        }

        const searchable = [
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

        return searchable.includes(term);
    });
};


// =========================================================
// SKELETON CARD
// =========================================================

const EventSkeleton = memo(
    function EventSkeleton() {
        return (
            <div
                aria-hidden="true"
                className="
                    animate-pulse
                    rounded-3xl
                    border border-slate-200
                    bg-white/80
                    p-5
                    dark:border-white/10
                    dark:bg-[#0d1322]/80
                "
            >
                <div className="flex justify-between gap-4">
                    <div
                        className="
                            h-12 w-12
                            rounded-2xl
                            bg-slate-200
                            dark:bg-white/10
                        "
                    />

                    <div
                        className="
                            h-7 w-24
                            rounded-full
                            bg-slate-200
                            dark:bg-white/10
                        "
                    />
                </div>

                <div
                    className="
                        mt-6 h-6 w-3/4
                        rounded-lg
                        bg-slate-200
                        dark:bg-white/10
                    "
                />

                <div
                    className="
                        mt-4 h-4 w-full
                        rounded-lg
                        bg-slate-200
                        dark:bg-white/10
                    "
                />

                <div
                    className="
                        mt-2 h-4 w-2/3
                        rounded-lg
                        bg-slate-200
                        dark:bg-white/10
                    "
                />

                <div
                    className="
                        mt-5 h-24
                        rounded-2xl
                        bg-slate-100
                        dark:bg-white/[0.06]
                    "
                />

                <div
                    className="
                        mt-5 h-11
                        rounded-xl
                        bg-slate-200
                        dark:bg-white/10
                    "
                />
            </div>
        );
    }
);


// =========================================================
// EVENTS PAGE
// =========================================================

function EventsPage() {
    const dispatch = useDispatch();

    // =====================================================
    // REDUX STATE
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

    const nextPageUrl = useSelector(
        selectEventsNextPage
    );

    const previousPageUrl = useSelector(
        selectEventsPreviousPage
    );

    // =====================================================
    // LOCAL VIEW STATE
    // =====================================================

    const [search, setSearch] =
        useState("");

    const [
        statusFilter,
        setStatusFilter,
    ] = useState("all");

    const [currentPage, setCurrentPage] =
        useState(1);

    const [
        requestedPage,
        setRequestedPage,
    ] = useState(null);

    const pageRequestRef =
        useRef(false);

    const initialRequestRef =
        useRef(false);

    // =====================================================
    // INITIAL FETCH
    // =====================================================
    //
    // EventsController may already have
    // requested the public events catalog.
    //
    // Only fetch if Redux state is idle.
    //
    // No automatic infinite retry on failure.
    //
    // =====================================================

    useEffect(() => {
        if (
            listStatus !== IDLE ||
            initialRequestRef.current
        ) {
            return;
        }

        initialRequestRef.current = true;

        dispatch(
            fetchPublicEvents()
        );
    }, [
        dispatch,
        listStatus,
    ]);

    // =====================================================
    // FILTERED EVENTS
    // =====================================================

    const visibleEvents = useMemo(
        () =>
            filterEvents(
                Array.isArray(events)
                    ? events
                    : [],
                search,
                statusFilter
            ),
        [
            events,
            search,
            statusFilter,
        ]
    );

    const isLoading =
        listStatus === LOADING;

    const isFailed =
        listStatus === FAILED;

    const isLoaded =
        listStatus === SUCCEEDED;

    const hasExistingEvents =
        Array.isArray(events) &&
        events.length > 0;

    const isInitialLoading =
        isLoading &&
        !hasExistingEvents;

    const hasNextPage =
        Boolean(nextPageUrl);

    const hasPreviousPage =
        Boolean(previousPageUrl);

    const canChangePage =
        !isLoading &&
        !pageRequestRef.current;

    // =====================================================
    // REFRESH CURRENT PAGE
    // =====================================================

    const handleRefresh = useCallback(
        () => {
            if (
                pageRequestRef.current ||
                listStatus === LOADING
            ) {
                return;
            }

            dispatch(
                fetchPublicEvents({
                    params: {
                        page: currentPage,
                    },
                })
            );
        },
        [
            dispatch,
            listStatus,
            currentPage,
        ]
    );

    // =====================================================
    // SERVER PAGINATION
    // =====================================================
    //
    // Do not assume the backend page size.
    //
    // Use DRF's next/previous links only
    // to determine navigation availability.
    //
    // The API is called with page=N.
    //
    // Update currentPage only after a
    // successful response.
    //
    // =====================================================

    const handleChangePage = useCallback(
        async (nextPage) => {
            if (
                pageRequestRef.current ||
                listStatus === LOADING ||
                !Number.isSafeInteger(
                    nextPage
                ) ||
                nextPage < 1 ||
                nextPage === currentPage
            ) {
                return;
            }

            pageRequestRef.current = true;

            setRequestedPage(nextPage);

            try {
                const result = await dispatch(
                    fetchPublicEvents({
                        params: {
                            page: nextPage,
                        },
                    })
                );

                if (
                    fetchPublicEvents
                        .fulfilled.match(result)
                ) {
                    setCurrentPage(nextPage);
                }
            } finally {
                pageRequestRef.current = false;

                setRequestedPage(null);
            }
        },
        [
            dispatch,
            listStatus,
            currentPage,
        ]
    );

    // =====================================================
    // CLEAR LOCAL FILTERS
    // =====================================================

    const clearFilters = useCallback(
        () => {
            setSearch("");

            setStatusFilter("all");
        },
        []
    );

    // =====================================================
    // ERROR MESSAGE
    // =====================================================

    const errorMessage =
        typeof listError === "string"
            ? listError
            : listError?.message ??
              "Tadbirlarni yuklab bo‘lmadi.";

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <main
            className="
                relative isolate
                min-h-screen
                px-4 pb-16 pt-8
                text-slate-900
                sm:px-6
                lg:px-8
                dark:text-white
            "
        >
            <div
                className="
                    relative z-10
                    mx-auto
                    w-full max-w-7xl
                "
            >
                {/* =====================================
                    PAGE HEADER
                ===================================== */}

                <header
                    className="
                        relative
                        overflow-hidden
                        rounded-3xl
                        border border-violet-200/80
                        bg-white/85
                        p-5
                        shadow-sm
                        sm:p-8
                        dark:border-violet-400/15
                        dark:bg-[#0d1322]/85
                    "
                >
                    <div
                        aria-hidden="true"
                        className="
                            pointer-events-none
                            absolute -right-16 -top-24
                            h-64 w-64
                            rounded-full
                            bg-violet-500/15
                            blur-3xl
                        "
                    />

                    <div
                        aria-hidden="true"
                        className="
                            pointer-events-none
                            absolute -bottom-24 -left-16
                            h-52 w-52
                            rounded-full
                            bg-cyan-400/10
                            blur-3xl
                        "
                    />

                    <div className="relative z-10">
                        <div
                            className="
                                inline-flex items-center
                                gap-2 rounded-full
                                border border-violet-500/20
                                bg-violet-500/10
                                px-3 py-1.5
                                text-xs font-bold
                                text-violet-700
                                dark:text-violet-300
                            "
                        >
                            <Sparkles
                                size={15}
                                aria-hidden="true"
                            />

                            FSOCIETY EVENTS
                        </div>

                        <div
                            className="
                                mt-5 flex flex-wrap
                                items-start justify-between
                                gap-4
                            "
                        >
                            <div className="min-w-0 flex-1">
                                <h1
                                    className="
                                        text-2xl font-black
                                        tracking-tight
                                        sm:text-3xl
                                        lg:text-4xl
                                    "
                                >
                                    Bayramlar va tadbirlar
                                </h1>

                                <p
                                    className="
                                        mt-3 max-w-2xl
                                        text-sm leading-7
                                        text-slate-600
                                        sm:text-base
                                        dark:text-slate-400
                                    "
                                >
                                    Maxsus tadbirlarni kuzating,
                                    countdown tugashini kuting
                                    va bayram sovg‘angizni oching.
                                    Har bir tadbir uchun
                                    bitta sovg‘a!
                                </p>
                            </div>

                            <div
                                className="
                                    flex h-14 w-14
                                    shrink-0 items-center
                                    justify-center
                                    rounded-2xl
                                    bg-gradient-to-br
                                    from-violet-600
                                    to-fuchsia-600
                                    text-white
                                    shadow-lg
                                    shadow-violet-500/20
                                "
                            >
                                <Gift
                                    size={27}
                                    strokeWidth={1.7}
                                    aria-hidden="true"
                                />
                            </div>
                        </div>

                        <div
                            className="
                                mt-5 flex flex-wrap
                                items-center gap-2
                            "
                        >
                            <span
                                className="
                                    inline-flex items-center
                                    gap-1.5 rounded-full
                                    border border-slate-200
                                    bg-slate-50
                                    px-3 py-1.5
                                    text-xs font-semibold
                                    text-slate-600
                                    dark:border-white/10
                                    dark:bg-white/5
                                    dark:text-slate-300
                                "
                            >
                                <CalendarDays
                                    size={14}
                                    aria-hidden="true"
                                />

                                {totalCount} ta tadbir
                            </span>

                            <span
                                className="
                                    rounded-full
                                    border border-emerald-500/20
                                    bg-emerald-500/10
                                    px-3 py-1.5
                                    text-xs font-semibold
                                    text-emerald-700
                                    dark:text-emerald-300
                                "
                            >
                                Har event uchun 1 ta sovg‘a
                            </span>
                        </div>
                    </div>
                </header>

                {/* =====================================
                    FILTERS
                ===================================== */}

                <section
                    aria-label="Tadbirlarni qidirish va saralash"
                    className="
                        mt-6
                        rounded-2xl
                        border border-slate-200/80
                        bg-white/85
                        p-4
                        shadow-sm
                        sm:p-5
                        dark:border-white/10
                        dark:bg-[#0d1322]/85
                    "
                >
                    <div
                        className="
                            grid grid-cols-1
                            gap-3
                            md:grid-cols-[minmax(0,1fr)_220px_auto]
                        "
                    >
                        {/* SEARCH */}

                        <div className="relative">
                            <Search
                                size={18}
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
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Bayram yoki tadbir nomi..."
                                className="
                                    h-11 w-full
                                    rounded-xl
                                    border border-slate-200
                                    bg-slate-50/80
                                    pl-10 pr-4
                                    text-sm
                                    text-slate-900
                                    outline-none
                                    transition-colors
                                    placeholder:text-slate-400
                                    focus:border-violet-400
                                    focus:ring-2
                                    focus:ring-violet-500/10
                                    dark:border-white/10
                                    dark:bg-white/[0.04]
                                    dark:text-white
                                "
                            />
                        </div>

                        {/* STATUS FILTER */}

                        <select
                            aria-label="Tadbir holati"
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(
                                    event.target.value
                                )
                            }
                            className="
                                h-11 w-full
                                rounded-xl
                                border border-slate-200
                                bg-slate-50/80
                                px-3
                                text-sm
                                text-slate-900
                                outline-none
                                focus:border-violet-400
                                focus:ring-2
                                focus:ring-violet-500/10
                                dark:border-white/10
                                dark:bg-[#171d2c]
                                dark:text-white
                            "
                        >
                            {STATUS_FILTERS.map(
                                (filter) => (
                                    <option
                                        key={filter.value}
                                        value={filter.value}
                                    >
                                        {filter.label}
                                    </option>
                                )
                            )}
                        </select>

                        {/* REFRESH */}

                        <button
                            type="button"
                            onClick={handleRefresh}
                            disabled={isLoading}
                            className="
                                inline-flex min-h-11
                                items-center justify-center
                                gap-2 rounded-xl
                                border border-slate-200
                                bg-slate-50
                                px-4 py-2
                                text-sm font-bold
                                text-slate-700
                                transition-colors
                                hover:bg-slate-100
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                                dark:border-white/10
                                dark:bg-white/5
                                dark:text-slate-200
                                dark:hover:bg-white/10
                            "
                        >
                            {isLoading ? (
                                <Loader2
                                    size={17}
                                    className="animate-spin"
                                />
                            ) : (
                                <RefreshCw size={17} />
                            )}

                            Yangilash
                        </button>
                    </div>

                    <p
                        className="
                            mt-3 text-xs
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        Qidiruv va filter hozir
                        faqat yuklangan sahifadagi
                        tadbirlar uchun ishlaydi.
                    </p>
                </section>

                {/* =====================================
                    ERROR / RETRY
                ===================================== */}

                {isFailed && (
                    <div
                        role="alert"
                        className="
                            mt-5 flex flex-wrap
                            items-center gap-3
                            rounded-2xl
                            border border-rose-500/20
                            bg-rose-500/10
                            p-4
                            text-sm
                            text-rose-700
                            dark:text-rose-300
                        "
                    >
                        <AlertCircle
                            size={20}
                            className="shrink-0"
                        />

                        <span className="min-w-0 flex-1">
                            {errorMessage}
                        </span>

                        <button
                            type="button"
                            onClick={handleRefresh}
                            className="
                                rounded-lg
                                border border-rose-500/30
                                px-3 py-2
                                text-xs font-bold
                                transition-colors
                                hover:bg-rose-500/10
                            "
                        >
                            Qayta urinish
                        </button>
                    </div>
                )}

                {/* =====================================
                    EVENTS RESULTS
                ===================================== */}

                <section
                    aria-label="Bayram tadbirlari"
                    aria-busy={isLoading}
                    className="mt-6"
                >
                    {/* RESULTS HEADER */}

                    <div
                        className="
                            mb-4 flex flex-wrap
                            items-center justify-between
                            gap-3
                        "
                    >
                        <h2
                            className="
                                text-lg font-black
                                text-slate-900
                                dark:text-white
                            "
                        >
                            Tadbirlar ro‘yxati
                        </h2>

                        <span
                            className="
                                text-xs font-semibold
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            {isLoading
                                ? "Yuklanmoqda..."
                                : `Ushbu sahifada ${visibleEvents.length} ta`}
                        </span>
                    </div>

                    {/* FIRST LOAD SKELETONS */}

                    {isInitialLoading ? (
                        <div
                            role="status"
                            aria-label="Tadbirlar yuklanmoqda"
                            className="
                                grid grid-cols-1
                                gap-5
                                lg:grid-cols-2
                                xl:grid-cols-3
                            "
                        >
                            {Array.from(
                                { length: 6 },
                                (_, index) => (
                                    <EventSkeleton
                                        key={index}
                                    />
                                )
                            )}
                        </div>
                    ) : visibleEvents.length > 0 ? (
                        <div
                            className="
                                grid grid-cols-1
                                items-stretch
                                gap-5
                                lg:grid-cols-2
                                xl:grid-cols-3
                            "
                        >
                            {visibleEvents.map(
                                (event, index) => (
                                    <EventCard
                                        key={
                                            event.slug ??
                                            event.id ??
                                            index
                                        }
                                        event={event}
                                        showGift
                                    />
                                )
                            )}
                        </div>
                    ) : !isLoading ? (
                        <div
                            className="
                                flex min-h-64
                                flex-col items-center
                                justify-center
                                rounded-3xl
                                border border-dashed
                                border-slate-300
                                bg-white/65
                                px-5 py-10
                                text-center
                                dark:border-white/15
                                dark:bg-white/[0.025]
                            "
                        >
                            <Gift
                                size={35}
                                className="
                                    text-violet-500
                                "
                                aria-hidden="true"
                            />

                            <h3
                                className="
                                    mt-4 text-lg
                                    font-black
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                {hasExistingEvents
                                    ? "Mos tadbir topilmadi"
                                    : "Hozircha tadbirlar yo‘q"}
                            </h3>

                            <p
                                className="
                                    mt-2 max-w-md
                                    text-sm leading-6
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                {hasExistingEvents
                                    ? "Ushbu sahifadagi tadbirlar qidiruv yoki filterga mos kelmadi."
                                    : "Yangi bayram tadbirlari paydo bo‘lganda shu yerda ko‘rinadi."}
                            </p>

                            {hasExistingEvents && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="
                                        mt-4 inline-flex
                                        items-center gap-2
                                        rounded-xl
                                        border border-violet-500/20
                                        bg-violet-500/10
                                        px-4 py-2
                                        text-sm font-bold
                                        text-violet-700
                                        dark:text-violet-300
                                    "
                                >
                                    <X size={15} />
                                    Filterlarni tozalash
                                </button>
                            )}
                        </div>
                    ) : null}
                </section>

                {/* =====================================
                    SERVER PAGINATION
                ===================================== */}

                {(hasPreviousPage ||
                    hasNextPage ||
                    currentPage > 1) && (
                    <nav
                        aria-label="Tadbirlar sahifalari"
                        className="
                            mt-8 flex flex-wrap
                            items-center justify-center
                            gap-3
                        "
                    >
                        <button
                            type="button"
                            disabled={
                                !hasPreviousPage ||
                                !canChangePage
                            }
                            onClick={() =>
                                handleChangePage(
                                    currentPage - 1
                                )
                            }
                            className="
                                inline-flex min-h-10
                                items-center gap-1.5
                                rounded-xl
                                border border-slate-200
                                bg-white
                                px-4 py-2
                                text-sm font-bold
                                text-slate-700
                                transition-colors
                                hover:bg-slate-50
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                                dark:border-white/10
                                dark:bg-white/5
                                dark:text-slate-200
                                dark:hover:bg-white/10
                            "
                        >
                            <ChevronLeft size={17} />
                            Oldingi
                        </button>

                        <span
                            className="
                                inline-flex min-h-10
                                min-w-24
                                items-center justify-center
                                gap-2 rounded-xl
                                border border-violet-500/20
                                bg-violet-500/10
                                px-3 py-2
                                text-sm font-bold
                                text-violet-700
                                dark:text-violet-300
                            "
                        >
                            {requestedPage !== null
                                ? (
                                    <>
                                        <Loader2
                                            size={15}
                                            className="animate-spin"
                                        />
                                        {requestedPage}
                                    </>
                                )
                                : `${currentPage}-sahifa`}
                        </span>

                        <button
                            type="button"
                            disabled={
                                !hasNextPage ||
                                !canChangePage
                            }
                            onClick={() =>
                                handleChangePage(
                                    currentPage + 1
                                )
                            }
                            className="
                                inline-flex min-h-10
                                items-center gap-1.5
                                rounded-xl
                                border border-slate-200
                                bg-white
                                px-4 py-2
                                text-sm font-bold
                                text-slate-700
                                transition-colors
                                hover:bg-slate-50
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                                dark:border-white/10
                                dark:bg-white/5
                                dark:text-slate-200
                                dark:hover:bg-white/10
                            "
                        >
                            Keyingi
                            <ChevronRight size={17} />
                        </button>
                    </nav>
                )}

                {/* =====================================
                    FOOTER NOTE
                ===================================== */}

                <p
                    className="
                        mt-9 text-center
                        text-xs leading-6
                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    Sovg‘a ochilish sanasi va mukofot
                    olish huquqi FSociety serveri
                    orqali tekshiriladi.
                    Mukofotlar foydalanuvchi uchun
                    tasodifiy tanlanadi.
                </p>
            </div>
        </main>
    );
}


// =========================================================
// EXPORT
// =========================================================

export default memo(EventsPage);
