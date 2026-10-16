
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
    AnimatePresence,
    motion,
    useReducedMotion,
} from "framer-motion";

import {
    AlertTriangle,
    ArrowRight,
    ChevronDown,
    History,
    Loader2,
    Newspaper,
    RefreshCw,
    ShieldCheck,
} from "lucide-react";

// =========================================================
// SERVICES
// =========================================================

import UpdateService from "../services/updates";

// =========================================================
// REDUX ACTIONS
// =========================================================

import {
    getUpdatesFailure,
    getUpdatesStart,
    getUpdatesSuccess,
    toggleUpdateLikeFailure,
    toggleUpdateLikeStart,
    toggleUpdateLikeSuccess,
} from "../features/updates/Updates";

// =========================================================
// COMPONENTS
// =========================================================

import SiteUpdateCard from "./siteUpdates/SiteUpdateCard";

// =========================================================
// CONSTANTS
// =========================================================

const UPDATES_LIMIT = 5;

const EMPTY_ARRAY = [];

const ACCORDION_TRANSITION = {
    duration: 0.25,
    ease: [0.16, 1, 0.3, 1],
};

// =========================================================
// SHARED DESIGN
// =========================================================

const PANEL_CLASS = `
    relative
    min-w-0
    overflow-hidden
    rounded-[22px]
    border
    border-slate-200
    bg-white/95
    shadow-[0_12px_40px_rgba(15,23,42,0.045)]

    sm:rounded-[26px]

    dark:border-white/[0.09]
    dark:bg-[#0d131e]/95
    dark:shadow-[0_20px_60px_rgba(0,0,0,0.20)]
`;

const TEXT_MUTED_CLASS = `
    text-slate-600
    dark:text-slate-400
`;

// =========================================================
// HELPERS
// =========================================================

const hasValidId = (value) =>
    value !== null &&
    value !== undefined &&
    String(value).trim() !== "";

const sameId = (first, second) =>
    hasValidId(first) &&
    hasValidId(second) &&
    String(first) === String(second);

const getErrorMessage = (
    error,
    fallback = "Xatolik yuz berdi."
) => {
    const data =
        error?.serverData ??
        error?.response?.data;

    const values = [
        typeof data === "string" ? data : null,
        data?.detail,
        data?.error,
        data?.message,
        data?.non_field_errors,
        error?.error,
        error?.message,
    ];

    for (const value of values) {
        if (
            typeof value === "string" &&
            value.trim()
        ) {
            if (/<html|<!doctype/i.test(value)) {
                return fallback;
            }

            return value.trim();
        }

        if (Array.isArray(value) && value.length) {
            const first = value.find(
                (item) =>
                    typeof item === "string" &&
                    item.trim()
            );

            if (first) {
                return first.trim();
            }
        }
    }

    return fallback;
};

const getSafeCount = (value, minimum = 0) => {
    const count = Number(value);

    return Number.isFinite(count)
        ? Math.max(minimum, Math.floor(count))
        : minimum;
};

// =========================================================
// SKELETON BLOCK
// =========================================================

const SkeletonBlock = ({
    className = "",
}) => (
    <div
        aria-hidden="true"
        className={`
            rounded-lg
            bg-slate-200/90

            dark:bg-white/[0.08]

            ${className}
        `}
    />
);

// =========================================================
// LOADING SKELETON
// =========================================================

const UpdatesSkeleton = memo(function UpdatesSkeleton() {
    return (
        <div
            role="status"
            aria-label="Yangiliklar yuklanmoqda"
            className="
                animate-pulse
                space-y-4

                motion-reduce:animate-none
            "
        >
            <span className="sr-only">
                Saytdagi yangiliklar yuklanmoqda.
            </span>

            {/* FEATURED UPDATE */}

            <div
                className={`
                    ${PANEL_CLASS}

                    p-4
                    sm:p-6
                `}
            >
                <div className="flex items-start gap-4">
                    <SkeletonBlock
                        className="
                            h-12
                            w-12
                            shrink-0
                            rounded-2xl
                        "
                    />

                    <div className="min-w-0 flex-1">
                        <SkeletonBlock
                            className="
                                h-3
                                w-28
                                max-w-full
                                rounded-full
                            "
                        />

                        <SkeletonBlock
                            className="
                                mt-3
                                h-5
                                w-2/3
                                rounded-lg
                            "
                        />
                    </div>

                    <SkeletonBlock
                        className="
                            hidden
                            h-8
                            w-20
                            rounded-full
                            sm:block
                        "
                    />
                </div>

                <div className="mt-6 space-y-3">
                    <SkeletonBlock
                        className="h-3 w-[95%] rounded-full"
                    />

                    <SkeletonBlock
                        className="h-3 w-[82%] rounded-full"
                    />

                    <SkeletonBlock
                        className="h-3 w-[69%] rounded-full"
                    />
                </div>

                <div
                    className="
                        mt-6
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-3

                        border-t
                        border-slate-200

                        pt-5

                        dark:border-white/[0.08]
                    "
                >
                    <SkeletonBlock
                        className="h-9 w-28 rounded-xl"
                    />

                    <SkeletonBlock
                        className="h-9 w-24 rounded-xl"
                    />
                </div>
            </div>

            {/* MORE UPDATES */}

            <div
                className={`
                    ${PANEL_CLASS}

                    p-5
                `}
            >
                <div className="flex items-center gap-3">
                    <SkeletonBlock
                        className="
                            h-10
                            w-10
                            shrink-0
                            rounded-xl
                        "
                    />

                    <div className="flex-1 space-y-2">
                        <SkeletonBlock
                            className="
                                h-3.5
                                w-40
                                max-w-full
                                rounded-full
                            "
                        />

                        <SkeletonBlock
                            className="
                                h-2.5
                                w-24
                                max-w-full
                                rounded-full
                            "
                        />
                    </div>

                    <SkeletonBlock
                        className="h-9 w-9 rounded-xl"
                    />
                </div>
            </div>
        </div>
    );
});

// =========================================================
// ERROR STATE
// =========================================================

const UpdatesError = memo(function UpdatesError({
    message,
    onRetry,
    isLoading = false,
}) {
    return (
        <div
            role="alert"
            className="
                rounded-[24px]
                border
                border-rose-200

                bg-rose-50/80

                px-5
                py-9
                text-center

                sm:px-8
                sm:py-11

                dark:border-rose-400/20
                dark:bg-rose-400/[0.055]
            "
        >
            <div
                className="
                    mx-auto

                    grid
                    h-14
                    w-14

                    place-items-center

                    rounded-2xl

                    border
                    border-rose-200

                    bg-rose-100

                    text-rose-700

                    dark:border-rose-400/20
                    dark:bg-rose-400/[0.10]
                    dark:text-rose-300
                "
            >
                <AlertTriangle
                    size={25}
                    strokeWidth={1.8}
                    aria-hidden="true"
                />
            </div>

            <h3
                className="
                    mt-5
                    text-lg
                    font-black
                    tracking-tight

                    text-slate-900

                    dark:text-white
                "
            >
                Yangiliklarni yuklab bo‘lmadi
            </h3>

            <p
                className="
                    mx-auto
                    mt-3
                    max-w-lg

                    break-words

                    text-sm
                    leading-6

                    text-slate-600

                    dark:text-slate-300
                "
            >
                {message ||
                    "Server bilan bog‘lanishda xatolik yuz berdi."}
            </p>

            <button
                type="button"
                onClick={onRetry}

                disabled={
                    isLoading ||
                    typeof onRetry !== "function"
                }

                className="
                    mt-6

                    inline-flex
                    min-h-11

                    items-center
                    justify-center
                    gap-2

                    rounded-xl

                    border
                    border-rose-300

                    bg-white

                    px-5
                    py-2.5

                    text-xs
                    font-black

                    text-rose-800

                    transition-colors

                    hover:bg-rose-100

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-rose-500

                    disabled:cursor-not-allowed
                    disabled:opacity-50

                    dark:border-rose-400/25
                    dark:bg-rose-400/[0.09]
                    dark:text-rose-300

                    dark:hover:bg-rose-400/[0.14]
                "
            >
                <RefreshCw
                    size={15}
                    aria-hidden="true"

                    className={
                        isLoading
                            ? "animate-spin motion-reduce:animate-none"
                            : ""
                    }
                />

                Qayta urinish
            </button>
        </div>
    );
});

// =========================================================
// EMPTY STATE
// =========================================================

const UpdatesEmpty = memo(function UpdatesEmpty() {
    return (
        <div
            className="
                rounded-[24px]

                border
                border-dashed
                border-slate-300

                bg-white/80

                px-5
                py-10

                text-center

                sm:px-8
                sm:py-12

                dark:border-white/[0.12]
                dark:bg-white/[0.025]
            "
        >
            <div
                className="
                    mx-auto

                    grid
                    h-16
                    w-16

                    place-items-center

                    rounded-2xl

                    border
                    border-indigo-200

                    bg-indigo-50

                    text-indigo-700

                    dark:border-indigo-400/20
                    dark:bg-indigo-400/[0.09]
                    dark:text-indigo-300
                "
            >
                <Newspaper
                    size={27}
                    strokeWidth={1.8}
                    aria-hidden="true"
                />
            </div>

            <h3
                className="
                    mt-5
                    text-lg
                    font-black

                    text-slate-900

                    dark:text-white
                "
            >
                Hozircha yangilik yo‘q
            </h3>

            <p
                className="
                    mx-auto
                    mt-3
                    max-w-md

                    text-sm
                    leading-6

                    text-slate-600

                    dark:text-slate-400
                "
            >
                Admin paneldan changelog qo‘shilganda
                u shu yerda avtomatik ko‘rinadi.
            </p>
        </div>
    );
});

// =========================================================
// BACKGROUND REFRESH ERROR
// =========================================================

const UpdatesRefreshError = memo(
    function UpdatesRefreshError({
        message,
        onRetry,
        isLoading = false,
    }) {
        return (
            <div
                role="alert"
                className="
                    mb-5

                    flex
                    flex-col
                    gap-3

                    rounded-2xl

                    border
                    border-amber-200

                    bg-amber-50

                    p-4

                    sm:flex-row
                    sm:items-center
                    sm:justify-between

                    dark:border-amber-400/20
                    dark:bg-amber-400/[0.065]
                "
            >
                <div className="flex min-w-0 items-start gap-3">
                    <AlertTriangle
                        size={17}
                        aria-hidden="true"

                        className="
                            mt-0.5
                            shrink-0

                            text-amber-700

                            dark:text-amber-300
                        "
                    />

                    <p
                        className="
                            min-w-0

                            text-xs
                            leading-6

                            text-amber-900

                            dark:text-amber-100
                        "
                    >
                        {message}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onRetry}
                    disabled={isLoading}

                    className="
                        inline-flex
                        min-h-9

                        shrink-0

                        items-center
                        justify-center
                        gap-2

                        self-start

                        rounded-xl

                        border
                        border-amber-300

                        bg-white

                        px-3
                        py-2

                        text-[11px]
                        font-black

                        text-amber-900

                        disabled:cursor-not-allowed
                        disabled:opacity-50

                        sm:self-auto

                        dark:border-amber-400/25
                        dark:bg-amber-400/[0.09]
                        dark:text-amber-300
                    "
                >
                    <RefreshCw
                        size={14}
                        aria-hidden="true"

                        className={
                            isLoading
                                ? "animate-spin motion-reduce:animate-none"
                                : ""
                        }
                    />

                    Yangilash
                </button>
            </div>
        );
    }
);

// =========================================================
// SITE UPDATES MAIN COMPONENT
// =========================================================

const SiteUpdates = () => {
    const dispatch = useDispatch();

    const prefersReducedMotion = useReducedMotion();

    // =====================================================
    // LOCAL UI STATE
    // =====================================================

    const [
        dropdownOpen,
        setDropdownOpen,
    ] = useState(false);

    const [
        openedUpdateId,
        setOpenedUpdateId,
    ] = useState(null);

    // =====================================================
    // REQUEST REFS
    // =====================================================

    const mountedRef = useRef(false);

    const requestVersionRef = useRef(0);

    const likePendingRef = useRef(new Set());

    // =====================================================
    // AUTH
    // =====================================================

    const isLoggedIn = useSelector(
        (state) =>
            Boolean(state.auth?.isLoggedIn)
    );

    // =====================================================
    // UPDATES REDUX
    // =====================================================

    const updatesState = useSelector(
        (state) => state.updates || {}
    );

    const {
        updates,
        count = 0,
        isLoading = false,
        error = null,
        likingUpdateIds,
        likeError = null,
    } = updatesState;

    // =====================================================
    // SAFE DATA
    // =====================================================

    const safeUpdates = Array.isArray(updates)
        ? updates
        : EMPTY_ARRAY;

    const likingIds = Array.isArray(likingUpdateIds)
        ? likingUpdateIds
        : EMPTY_ARRAY;

    // =====================================================
    // FEATURED + DROPDOWN
    // =====================================================

    const featuredUpdate =
        safeUpdates[0] || null;

    const dropdownUpdates = useMemo(
        () => safeUpdates.slice(1),
        [safeUpdates]
    );

    // =====================================================
    // TOTAL COUNT
    // =====================================================

    const totalCount = getSafeCount(
        count,
        safeUpdates.length
    );

    // =====================================================
    // DISPLAY ERRORS
    // =====================================================

    const displayError =
        typeof error === "string"
            ? error
            : getErrorMessage(
                error,
                "Yangiliklarni yuklab bo‘lmadi."
            );

    const displayLikeError = likeError
        ? typeof likeError === "string"
            ? likeError
            : getErrorMessage(
                likeError,
                "Like yuborishda xatolik yuz berdi."
            )
        : null;

    // =====================================================
    // CHECK LIKE LOADING
    // =====================================================

    const isLikingUpdate = useCallback(
        (updateId) =>
            likingIds.some((id) =>
                sameId(id, updateId)
            ),
        [likingIds]
    );

    // =====================================================
    // FETCH UPDATES
    //
    // Original Redux contract preserved.
    //
    // New:
    // - Ignore outdated requests
    // - Ignore results after unmount
    // =====================================================

    const fetchUpdates = useCallback(async () => {
        const requestVersion =
            ++requestVersionRef.current;

        dispatch(getUpdatesStart());

        try {
            const response =
                await UpdateService.getUpdates(
                    UPDATES_LIMIT
                );

            if (
                !mountedRef.current ||
                requestVersion !== requestVersionRef.current
            ) {
                return;
            }

            dispatch(
                getUpdatesSuccess(response)
            );
        } catch (fetchError) {
            if (
                !mountedRef.current ||
                requestVersion !== requestVersionRef.current
            ) {
                return;
            }

            const message = getErrorMessage(
                fetchError,
                "Saytdagi yangiliklarni yuklab bo‘lmadi."
            );

            dispatch(
                getUpdatesFailure(message)
            );
        }
    }, [dispatch]);

    // =====================================================
    // INITIAL LOAD / CLEANUP
    // =====================================================

    useEffect(() => {
        mountedRef.current = true;

        fetchUpdates();

        return () => {
            mountedRef.current = false;

            requestVersionRef.current += 1;

            likePendingRef.current.clear();
        };
    }, [fetchUpdates]);

    // =====================================================
    // LIKE / UNLIKE UPDATE
    //
    // Preserves:
    // - Authentication check
    // - Redux Start / Success / Failure
    // - Original API method
    //
    // New:
    // - Immediate request lock
    // - Handles mixed string/number IDs
    // =====================================================

    const handleLike = useCallback(
        async (updateId) => {
            if (!hasValidId(updateId)) {
                return;
            }

            if (!isLoggedIn) {
                dispatch(
                    toggleUpdateLikeFailure({
                        id: updateId,

                        error:
                            "Like bosish uchun tizimga kirishingiz kerak.",
                    })
                );

                return;
            }

            const key = String(updateId);

            if (
                likePendingRef.current.has(key) ||
                isLikingUpdate(updateId)
            ) {
                return;
            }

            likePendingRef.current.add(key);

            dispatch(
                toggleUpdateLikeStart(updateId)
            );

            try {
                const response =
                    await UpdateService.toggleLike(
                        updateId
                    );

                if (!mountedRef.current) {
                    return;
                }

                dispatch(
                    toggleUpdateLikeSuccess(response)
                );
            } catch (requestError) {
                if (!mountedRef.current) {
                    return;
                }

                const message = getErrorMessage(
                    requestError,
                    "Like yuborishda xatolik yuz berdi."
                );

                dispatch(
                    toggleUpdateLikeFailure({
                        id: updateId,
                        error: message,
                    })
                );
            } finally {
                likePendingRef.current.delete(key);
            }
        },
        [
            dispatch,
            isLoggedIn,
            isLikingUpdate,
        ]
    );

    // =====================================================
    // COMPACT UPDATE ACCORDION
    // =====================================================

    const toggleUpdate = useCallback(
        (updateId) => {
            if (!hasValidId(updateId)) {
                return;
            }

            setOpenedUpdateId((current) =>
                sameId(current, updateId)
                    ? null
                    : updateId
            );
        },
        []
    );

    // =====================================================
    // MORE UPDATES DROPDOWN
    // =====================================================

    const toggleDropdown = useCallback(() => {
        setDropdownOpen((current) => !current);

        // Close nested accordion when dropdown changes.
        setOpenedUpdateId(null);
    }, []);

    // =====================================================
    // DERIVED UI STATE
    // =====================================================

    const hasUpdates = Boolean(featuredUpdate);

    const showInitialLoading =
        isLoading && !hasUpdates;

    const showInitialError =
        !isLoading &&
        Boolean(error) &&
        !hasUpdates;

    const showEmpty =
        !isLoading &&
        !error &&
        !hasUpdates;

    const showRefreshError =
        Boolean(error) &&
        hasUpdates &&
        !isLoading;

    // =====================================================
    // ANIMATION CONFIGURATION
    // =====================================================

    const dropdownTransition = prefersReducedMotion
        ? { duration: 0 }
        : ACCORDION_TRANSITION;

    const alertTransition = prefersReducedMotion
        ? { duration: 0 }
        : { duration: 0.16 };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <section
            id="changelog"

            aria-labelledby="fsociety-updates-title"

            className="
                relative
                isolate

                w-full
                min-w-0

                overflow-hidden

                border-y
                border-slate-200

                bg-gradient-to-b
                from-[#f6f8fd]
                via-white
                to-[#f5f7fc]

                px-4
                py-14

                sm:px-6
                sm:py-16

                lg:px-8
                lg:py-20

                xl:px-10

                dark:border-white/[0.07]
                dark:from-[#090d14]
                dark:via-[#0b111b]
                dark:to-[#080c13]
            "
        >
            {/* ======================================
                GRID BACKGROUND
            ====================================== */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    inset-0

                    text-slate-900

                    opacity-[0.035]

                    [background-image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)]
                    [background-size:34px_34px]

                    dark:text-white
                    dark:opacity-[0.025]
                "
            />

            {/* ======================================
                DECORATIVE GLOWS
            ====================================== */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    left-1/2
                    top-0

                    hidden

                    h-[300px]
                    w-[600px]
                    max-w-full

                    -translate-x-1/2
                    -translate-y-1/2

                    rounded-full

                    bg-indigo-500/[0.06]

                    blur-[110px]

                    sm:block

                    dark:bg-indigo-400/[0.07]
                "
            />

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    -right-32
                    bottom-0

                    h-64
                    w-64

                    rounded-full

                    bg-cyan-400/[0.045]

                    blur-[100px]

                    dark:bg-cyan-400/[0.055]
                "
            />

            {/* ======================================
                MAIN CONTENT
            ====================================== */}

            <div
                className="
                    relative
                    z-10

                    mx-auto

                    w-full
                    min-w-0
                    max-w-6xl
                "
            >
                {/* ==================================
                    HEADER
                ================================== */}

                <header
                    className="
                        flex
                        flex-col
                        gap-5

                        lg:flex-row
                        lg:items-end
                        lg:justify-between
                    "
                >
                    {/* LEFT */}

                    <div className="min-w-0 max-w-2xl">
                        {/* SYSTEM BADGE */}

                        <div
                            className="
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

                                font-mono
                                text-[10px]
                                font-black
                                uppercase
                                tracking-[0.12em]

                                text-indigo-700

                                dark:border-indigo-400/25
                                dark:bg-indigo-400/[0.09]
                                dark:text-indigo-300
                            "
                        >
                            <History
                                size={13}
                                aria-hidden="true"

                                className="shrink-0"
                            />

                            <span className="truncate">
                                fsociety://changelog
                            </span>
                        </div>

                        {/* TITLE */}

                        <h2
                            id="fsociety-updates-title"

                            className="
                                mt-4

                                text-3xl
                                font-black
                                tracking-[-0.035em]
                                leading-tight

                                text-slate-900

                                sm:text-4xl

                                dark:text-white
                            "
                        >
                            Saytda{" "}

                            <span
                                className="
                                    bg-gradient-to-r

                                    from-cyan-600
                                    via-indigo-600
                                    to-fuchsia-600

                                    bg-clip-text
                                    text-transparent

                                    dark:from-cyan-300
                                    dark:via-indigo-300
                                    dark:to-fuchsia-300
                                "
                            >
                                nimalar o‘zgardi?
                            </span>
                        </h2>

                        {/* DESCRIPTION */}

                        <p
                            className={`
                                mt-3

                                max-w-xl

                                text-sm
                                leading-7

                                ${TEXT_MUTED_CLASS}
                            `}
                        >
                            Yangi imkoniyatlar, tuzatilgan
                            xatolar, xavfsizlik yangilanishlari
                            va platformadagi muhim o‘zgarishlar.
                        </p>
                    </div>

                    {/* RIGHT — SYSTEM STATUS */}

                    <div
                        className="
                            inline-flex
                            w-fit

                            shrink-0

                            items-center
                            gap-3

                            rounded-2xl

                            border
                            border-emerald-200

                            bg-emerald-50

                            px-4
                            py-3

                            dark:border-emerald-400/20
                            dark:bg-emerald-400/[0.075]
                        "
                    >
                        {/* STATUS DOT */}

                        <span
                            aria-hidden="true"

                            className="
                                relative

                                flex
                                h-2
                                w-2

                                shrink-0
                            "
                        >
                            <span
                                className="
                                    absolute

                                    inline-flex
                                    h-full
                                    w-full

                                    animate-ping

                                    rounded-full

                                    bg-emerald-500

                                    opacity-40

                                    motion-reduce:animate-none
                                "
                            />

                            <span
                                className="
                                    relative

                                    inline-flex
                                    h-2
                                    w-2

                                    rounded-full

                                    bg-emerald-500
                                "
                            />
                        </span>

                        {/* STATUS TEXT */}

                        <div>
                            <p
                                className="
                                    inline-flex
                                    items-center
                                    gap-1.5

                                    font-mono
                                    text-[10px]
                                    font-black
                                    uppercase
                                    tracking-[0.12em]

                                    text-emerald-800

                                    dark:text-emerald-300
                                "
                            >
                                <ShieldCheck
                                    size={12}
                                    aria-hidden="true"
                                />

                                System updates
                            </p>

                            <p
                                className="
                                    mt-0.5

                                    text-[11px]
                                    font-medium

                                    text-slate-600

                                    dark:text-slate-400
                                "
                            >
                                Changelog live
                            </p>
                        </div>
                    </div>
                </header>

                {/* ==================================
                    LIKE ERROR
                ================================== */}

                <AnimatePresence initial={false}>
                    {displayLikeError && (
                        <motion.div
                            key="updates-like-error"

                            role="alert"

                            initial={
                                prefersReducedMotion
                                    ? false
                                    : {
                                        opacity: 0,
                                        y: -6,
                                    }
                            }

                            animate={{
                                opacity: 1,
                                y: 0,
                            }}

                            exit={
                                prefersReducedMotion
                                    ? {
                                        opacity: 0,
                                    }
                                    : {
                                        opacity: 0,
                                        y: -6,
                                    }
                            }

                            transition={alertTransition}

                            className="
                                mt-6

                                flex
                                min-w-0

                                items-start
                                gap-3

                                rounded-2xl

                                border
                                border-rose-200

                                bg-rose-50

                                px-4
                                py-3.5

                                text-xs
                                font-semibold
                                leading-6

                                text-rose-800

                                dark:border-rose-400/20
                                dark:bg-rose-400/[0.07]
                                dark:text-rose-200
                            "
                        >
                            <AlertTriangle
                                size={17}
                                aria-hidden="true"

                                className="
                                    mt-0.5
                                    shrink-0
                                "
                            />

                            <span className="min-w-0 break-words">
                                {displayLikeError}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ==================================
                    UPDATES CONTENT
                ================================== */}

                <div className="mt-9">
                    {/* INITIAL LOADING */}

                    {showInitialLoading && (
                        <UpdatesSkeleton />
                    )}

                    {/* INITIAL ERROR */}

                    {showInitialError && (
                        <UpdatesError
                            message={displayError}

                            onRetry={fetchUpdates}

                            isLoading={isLoading}
                        />
                    )}

                    {/* EMPTY */}

                    {showEmpty && (
                        <UpdatesEmpty />
                    )}

                    {/* ==================================
                        UPDATES LIST
                    ================================== */}

                    {hasUpdates && (
                        <div className="min-w-0">
                            {/* BACKGROUND REFRESH */}

                            {isLoading && (
                                <div
                                    role="status"

                                    className="
                                        mb-4

                                        flex
                                        items-center
                                        justify-end
                                        gap-2

                                        font-mono
                                        text-[10px]
                                        font-bold
                                        uppercase
                                        tracking-wide

                                        text-slate-500

                                        dark:text-slate-400
                                    "
                                >
                                    <Loader2
                                        size={14}
                                        aria-hidden="true"

                                        className="
                                            animate-spin

                                            text-indigo-600

                                            dark:text-indigo-400

                                            motion-reduce:animate-none
                                        "
                                    />

                                    Yangilanmoqda
                                </div>
                            )}

                            {/* NON-BLOCKING REFRESH ERROR */}

                            {showRefreshError && (
                                <UpdatesRefreshError
                                    message={displayError}

                                    onRetry={fetchUpdates}

                                    isLoading={isLoading}
                                />
                            )}

                            {/* ==========================
                                FEATURED UPDATE

                                Existing props preserved:
                                - variant
                                - update
                                - likeLoading
                                - onLike
                            ========================== */}

                            <SiteUpdateCard
                                variant="featured"

                                update={featuredUpdate}

                                likeLoading={isLikingUpdate(
                                    featuredUpdate.id
                                )}

                                onLike={handleLike}
                            />

                            {/* ==========================
                                MORE UPDATES
                            ========================== */}

                            {dropdownUpdates.length > 0 && (
                                <div
                                    className={`
                                        ${PANEL_CLASS}

                                        mt-4
                                    `}
                                >
                                    {/* DROPDOWN BUTTON */}

                                    <button
                                        type="button"

                                        onClick={toggleDropdown}

                                        aria-expanded={
                                            dropdownOpen
                                        }

                                        aria-controls="fsociety-updates-dropdown"

                                        className="
                                            group

                                            flex
                                            w-full
                                            min-w-0

                                            items-center
                                            justify-between
                                            gap-4

                                            px-4
                                            py-4

                                            text-left

                                            transition-colors
                                            duration-200

                                            hover:bg-indigo-50/80

                                            focus-visible:outline-none
                                            focus-visible:ring-2
                                            focus-visible:ring-inset
                                            focus-visible:ring-indigo-500

                                            sm:px-5

                                            dark:hover:bg-white/[0.045]

                                            motion-reduce:transition-none
                                        "
                                    >
                                        {/* LEFT */}

                                        <div
                                            className="
                                                flex
                                                min-w-0

                                                items-center
                                                gap-3
                                            "
                                        >
                                            <span
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
                                                <Newspaper
                                                    size={18}
                                                    aria-hidden="true"
                                                />
                                            </span>

                                            <div className="min-w-0">
                                                <p
                                                    className="
                                                        text-[13px]
                                                        font-black

                                                        text-slate-800

                                                        dark:text-slate-100
                                                    "
                                                >
                                                    Oxirgi yangiliklar
                                                </p>

                                                <p
                                                    className="
                                                        mt-1

                                                        font-mono
                                                        text-[10px]
                                                        font-medium
                                                        uppercase
                                                        tracking-wider

                                                        text-slate-500

                                                        dark:text-slate-400
                                                    "
                                                >
                                                    Jami {totalCount} ta update
                                                </p>
                                            </div>
                                        </div>

                                        {/* RIGHT */}

                                        <div
                                            className="
                                                flex
                                                shrink-0

                                                items-center
                                                gap-3
                                            "
                                        >
                                            <span
                                                className="
                                                    hidden

                                                    text-xs
                                                    font-bold

                                                    text-slate-600

                                                    sm:inline

                                                    dark:text-slate-300
                                                "
                                            >
                                                {dropdownOpen
                                                    ? "Yopish"
                                                    : "Ko‘rsatish"}
                                            </span>

                                            <span
                                                className="
                                                    grid
                                                    h-9
                                                    w-9

                                                    place-items-center

                                                    rounded-xl

                                                    border
                                                    border-slate-200

                                                    bg-slate-50

                                                    dark:border-white/[0.10]
                                                    dark:bg-white/[0.045]
                                                "
                                            >
                                                <ChevronDown
                                                    size={17}
                                                    aria-hidden="true"

                                                    className={`
                                                        transition-transform
                                                        duration-200

                                                        ${
                                                            dropdownOpen
                                                                ? "rotate-180 text-indigo-600 dark:text-indigo-300"
                                                                : "text-slate-500 dark:text-slate-400"
                                                        }

                                                        motion-reduce:transition-none
                                                    `}
                                                />
                                            </span>
                                        </div>
                                    </button>

                                    {/* ======================
                                        DROPDOWN BODY
                                    ====================== */}

                                    <AnimatePresence initial={false}>
                                        {dropdownOpen && (
                                            <motion.div
                                                id="fsociety-updates-dropdown"

                                                initial={
                                                    prefersReducedMotion
                                                        ? false
                                                        : {
                                                            height: 0,
                                                            opacity: 0,
                                                        }
                                                }

                                                animate={{
                                                    height: "auto",
                                                    opacity: 1,
                                                }}

                                                exit={{
                                                    height: 0,
                                                    opacity: 0,
                                                }}

                                                transition={
                                                    dropdownTransition
                                                }

                                                className="
                                                    overflow-hidden
                                                "
                                            >
                                                <div
                                                    className="
                                                        border-t
                                                        border-slate-200

                                                        dark:border-white/[0.08]
                                                    "
                                                >
                                                    {dropdownUpdates.map(
                                                        (update) => (
                                                            <SiteUpdateCard
                                                                key={update.id}

                                                                variant="compact"

                                                                update={update}

                                                                opened={
                                                                    sameId(
                                                                        openedUpdateId,
                                                                        update.id
                                                                    )
                                                                }

                                                                onToggle={() =>
                                                                    toggleUpdate(
                                                                        update.id
                                                                    )
                                                                }

                                                                likeLoading={
                                                                    isLikingUpdate(
                                                                        update.id
                                                                    )
                                                                }

                                                                onLike={
                                                                    handleLike
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* ==========================
                                TOTAL INFORMATION
                            ========================== */}

                            {totalCount > safeUpdates.length && (
                                <div
                                    className="
                                        mt-5

                                        flex
                                        flex-wrap

                                        items-center
                                        justify-center
                                        gap-x-2
                                        gap-y-1

                                        text-center

                                        text-[11px]
                                        font-medium
                                        leading-6

                                        text-slate-600

                                        dark:text-slate-400
                                    "
                                >
                                    <History
                                        size={14}
                                        aria-hidden="true"

                                        className="
                                            shrink-0
                                            text-indigo-600

                                            dark:text-indigo-400
                                        "
                                    />

                                    <span>
                                        Homepage'da oxirgi{" "}
                                        <strong
                                            className="
                                                font-black
                                                text-slate-800

                                                dark:text-slate-200
                                            "
                                        >
                                            {safeUpdates.length}
                                        </strong>{" "}
                                        ta yangilik ko‘rsatildi.
                                    </span>

                                    <span>
                                        Jami{" "}
                                        <strong
                                            className="
                                                font-black
                                                text-indigo-700

                                                dark:text-indigo-300
                                            "
                                        >
                                            {totalCount}
                                        </strong>{" "}
                                        ta mavjud.
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ==================================
                    FOOTER DECORATION
                ================================== */}

                <div
                    aria-hidden="true"

                    className="
                        mt-10

                        flex
                        items-center
                        justify-center
                        gap-3

                        opacity-50

                        dark:opacity-35
                    "
                >
                    <span
                        className="
                            h-px
                            w-12

                            bg-gradient-to-r
                            from-transparent
                            to-indigo-400
                        "
                    />

                    <ArrowRight
                        size={13}

                        className="
                            text-indigo-500

                            dark:text-indigo-400
                        "
                    />

                    <span
                        className="
                            h-px
                            w-12

                            bg-gradient-to-l
                            from-transparent
                            to-indigo-400
                        "
                    />
                </div>
            </div>
        </section>
    );
};

export default memo(SiteUpdates);
