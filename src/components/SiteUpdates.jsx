
import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    AnimatePresence,
    motion,
} from "framer-motion";

import {
    AlertTriangle,
    ChevronDown,
    History,
    Newspaper,
    RefreshCw,
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

// =========================================================
// ANIMATION
// =========================================================

const accordionTransition = {
    duration: 0.25,
    ease: [0.16, 1, 0.3, 1],
};

// =========================================================
// ERROR MESSAGE HELPER
// =========================================================

const getErrorMessage = (error, fallback) => {
    const data = error?.response?.data;

    const candidates = [
        typeof data === "string" ? data : null,
        data?.detail,
        data?.error,
        data?.message,
        error?.message,
    ];

    const message = candidates.find(
        (value) =>
            typeof value === "string" &&
            value.trim().length > 0
    );

    return message || fallback;
};

// =========================================================
// LOADING SKELETON
// =========================================================

const UpdatesSkeleton = () => {
    return (
        <div
            role="status"
            aria-label="Yangiliklar yuklanmoqda"
            className="
                animate-pulse
                rounded-3xl
                border
                border-[#dce5f0]
                bg-white/80
                p-5

                sm:p-6

                dark:border-white/[0.06]
                dark:bg-white/[0.02]

                motion-reduce:animate-none
            "
        >
            <div className="flex items-center gap-4">
                <div
                    className="
                        h-12
                        w-12
                        shrink-0
                        rounded-2xl
                        bg-slate-200

                        dark:bg-white/[0.06]
                    "
                />

                <div className="min-w-0 flex-1">
                    <div
                        className="
                            h-3
                            w-28
                            max-w-full
                            rounded-full
                            bg-slate-200

                            dark:bg-white/[0.06]
                        "
                    />

                    <div
                        className="
                            mt-3
                            h-5
                            w-2/3
                            rounded-lg
                            bg-slate-200

                            dark:bg-white/[0.06]
                        "
                    />
                </div>
            </div>

            <div
                className="
                    mt-5
                    h-12
                    rounded-xl
                    bg-slate-100

                    dark:bg-white/[0.035]
                "
            />
        </div>
    );
};

// =========================================================
// SITE UPDATES
//
// Responsibilities:
// - Load latest updates
// - Handle update likes
// - Manage dropdown
// - Manage compact card accordion
// - Render loading / error / empty states
//
// Existing SiteUpdateCard contract is preserved.
// =========================================================

const SiteUpdates = () => {
    const dispatch = useDispatch();

    // =====================================================
    // LOCAL STATE
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

    const likingIds = Array.isArray(
        likingUpdateIds
    )
        ? likingUpdateIds
        : EMPTY_ARRAY;

    const featuredUpdate =
        safeUpdates[0] || null;

    const dropdownUpdates = useMemo(
        () => safeUpdates.slice(1),
        [safeUpdates]
    );

    const totalCount =
        Number.isFinite(Number(count))
            ? Math.max(0, Number(count))
            : 0;

    const displayError =
        typeof error === "string"
            ? error
            : error?.message ||
              "Yangiliklarni yuklab bo‘lmadi.";

    const displayLikeError =
        typeof likeError === "string"
            ? likeError
            : likeError?.message ||
              (likeError
                  ? "Like yuborishda xatolik yuz berdi."
                  : null);

    // =====================================================
    // FETCH UPDATES
    // =====================================================

    const fetchUpdates = useCallback(
        async () => {
            dispatch(getUpdatesStart());

            try {
                const response =
                    await UpdateService.getUpdates(
                        UPDATES_LIMIT
                    );

                dispatch(
                    getUpdatesSuccess(response)
                );
            } catch (fetchError) {
                const message = getErrorMessage(
                    fetchError,
                    "Saytdagi yangiliklarni yuklab bo‘lmadi."
                );

                dispatch(
                    getUpdatesFailure(message)
                );
            }
        },
        [dispatch]
    );

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        fetchUpdates();
    }, [fetchUpdates]);

    // =====================================================
    // LIKE UPDATE
    // =====================================================

    const handleLike = useCallback(
        async (updateId) => {
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

            if (
                likingIds.includes(updateId)
            ) {
                return;
            }

            dispatch(
                toggleUpdateLikeStart(updateId)
            );

            try {
                const response =
                    await UpdateService.toggleLike(
                        updateId
                    );

                dispatch(
                    toggleUpdateLikeSuccess(
                        response
                    )
                );
            } catch (requestError) {
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
            }
        },
        [
            dispatch,
            isLoggedIn,
            likingIds,
        ]
    );

    // =====================================================
    // ACCORDION
    // =====================================================

    const toggleUpdate = useCallback(
        (updateId) => {
            setOpenedUpdateId(
                (current) =>
                    current === updateId
                        ? null
                        : updateId
            );
        },
        []
    );

    // =====================================================
    // DROPDOWN
    // =====================================================

    const toggleDropdown = useCallback(
        () => {
            setDropdownOpen(
                (current) => !current
            );

            // Reset nested accordion when
            // the dropdown state changes.
            setOpenedUpdateId(null);
        },
        []
    );

    // =====================================================
    // JSX
    // =====================================================

    return (
        <section
            id="changelog"
            aria-labelledby="fsociety-updates-title"
            className="
                relative
                overflow-hidden

                border-y
                border-[#dce5f0]

                bg-[#f6f8fd]

                px-4
                py-14

                sm:px-6
                sm:py-16

                lg:px-8
                lg:py-20

                xl:px-10

                dark:border-white/[0.05]
                dark:bg-[#090d14]
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

                    opacity-[0.035]
                    text-slate-900

                    [background-image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)]
                    [background-size:34px_34px]

                    dark:opacity-[0.018]
                    dark:text-white
                "
            />

            {/* ======================================
                BACKGROUND ACCENT
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

                    dark:bg-indigo-500/[0.07]
                "
            />

            {/* ======================================
                CONTENT CONTAINER
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

                <div
                    className="
                        flex
                        flex-col
                        gap-5

                        lg:flex-row
                        lg:items-end
                        lg:justify-between
                    "
                >
                    {/* HEADER TEXT */}

                    <div className="min-w-0 max-w-2xl">
                        {/* EYEBROW */}

                        <div
                            className="
                                inline-flex
                                max-w-full
                                items-center
                                gap-2

                                rounded-full
                                border

                                border-indigo-400/25
                                bg-indigo-500/[0.07]

                                px-3
                                py-1.5

                                font-mono
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-[0.16em]

                                text-indigo-700

                                dark:border-indigo-400/20
                                dark:bg-indigo-400/[0.06]
                                dark:text-indigo-300
                            "
                        >
                            <History
                                size={13}
                                strokeWidth={2}
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
                            className="
                                mt-3
                                max-w-xl

                                text-sm
                                leading-6

                                text-slate-600

                                dark:text-gray-500
                            "
                        >
                            Yangi imkoniyatlar, tuzatilgan
                            xatolar, xavfsizlik yangilanishlari
                            va platformadagi muhim o‘zgarishlar.
                        </p>
                    </div>

                    {/* ==================================
                        CHANGELOG STATUS
                    ================================== */}

                    <div
                        className="
                            flex
                            w-fit
                            shrink-0
                            items-center
                            gap-3

                            rounded-2xl
                            border

                            border-emerald-400/25
                            bg-emerald-500/[0.06]

                            px-4
                            py-3

                            dark:border-emerald-400/10
                            dark:bg-emerald-400/[0.03]
                        "
                    >
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

                                    dark:bg-emerald-400

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

                                    dark:bg-emerald-400
                                "
                            />
                        </span>

                        <div>
                            <p
                                className="
                                    font-mono
                                    text-[9px]
                                    font-bold
                                    uppercase
                                    tracking-[0.15em]

                                    text-emerald-700

                                    dark:text-emerald-300
                                "
                            >
                                System updates
                            </p>

                            <p
                                className="
                                    mt-0.5
                                    text-[11px]

                                    text-slate-500

                                    dark:text-gray-600
                                "
                            >
                                Changelog live
                            </p>
                        </div>
                    </div>
                </div>

                {/* ==================================
                    LIKE ERROR
                ================================== */}

                <AnimatePresence initial={false}>
                    {displayLikeError && (
                        <motion.div
                            role="alert"

                            initial={{
                                opacity: 0,
                                y: -6,
                            }}

                            animate={{
                                opacity: 1,
                                y: 0,
                            }}

                            exit={{
                                opacity: 0,
                                y: -6,
                            }}

                            transition={{
                                duration: 0.16,
                            }}

                            className="
                                mt-5
                                flex
                                items-start
                                gap-2.5

                                rounded-xl
                                border

                                border-red-400/25
                                bg-red-500/[0.06]

                                px-4
                                py-3

                                text-xs
                                font-semibold
                                leading-5

                                text-red-700

                                dark:border-red-400/15
                                dark:bg-red-500/[0.055]
                                dark:text-red-300
                            "
                        >
                            <AlertTriangle
                                size={15}
                                strokeWidth={2}
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

                    {/* ==============================
                        LOADING
                    ============================== */}

                    {isLoading ? (
                        <UpdatesSkeleton />

                    ) : error ? (

                        /* ==========================
                            ERROR STATE
                        ========================== */

                        <div
                            role="alert"
                            className="
                                rounded-3xl
                                border

                                border-red-400/25
                                bg-red-500/[0.04]

                                p-6
                                text-center

                                sm:p-8

                                dark:border-red-400/15
                                dark:bg-red-500/[0.045]
                            "
                        >
                            <AlertTriangle
                                size={25}
                                strokeWidth={1.8}
                                aria-hidden="true"
                                className="
                                    mx-auto
                                    text-red-600

                                    dark:text-red-300
                                "
                            />

                            <h3
                                className="
                                    mt-4

                                    text-base
                                    font-bold

                                    text-slate-900

                                    dark:text-white
                                "
                            >
                                Yangiliklar yuklanmadi
                            </h3>

                            <p
                                className="
                                    mx-auto
                                    mt-2
                                    max-w-lg

                                    break-words

                                    text-sm
                                    leading-6

                                    text-slate-600

                                    dark:text-gray-500
                                "
                            >
                                {displayError}
                            </p>

                            <button
                                type="button"
                                onClick={fetchUpdates}

                                className="
                                    mt-5
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2

                                    rounded-xl
                                    border

                                    border-red-400/25
                                    bg-red-500/[0.07]

                                    px-4
                                    py-2.5

                                    text-xs
                                    font-bold

                                    text-red-700

                                    transition-colors
                                    duration-150

                                    hover:border-red-400/40
                                    hover:bg-red-500/[0.12]

                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-red-500

                                    dark:border-red-400/20
                                    dark:text-red-300
                                "
                            >
                                <RefreshCw
                                    size={14}
                                    aria-hidden="true"
                                />

                                Qayta urinish
                            </button>
                        </div>

                    ) : featuredUpdate ? (

                        /* ==========================
                            UPDATES LIST
                        ========================== */

                        <>
                            {/* FEATURED UPDATE */}

                            <SiteUpdateCard
                                variant="featured"
                                update={featuredUpdate}
                                likeLoading={
                                    likingIds.includes(
                                        featuredUpdate.id
                                    )
                                }
                                onLike={handleLike}
                            />

                            {/* ======================
                                MORE UPDATES
                            ====================== */}

                            {dropdownUpdates.length > 0 && (
                                <div
                                    className="
                                        mt-4
                                        overflow-hidden

                                        rounded-2xl
                                        border

                                        border-[#dce5f0]
                                        bg-white/85

                                        shadow-[0_10px_30px_rgba(30,41,59,0.04)]

                                        dark:border-white/[0.06]
                                        dark:bg-[#0c1118]
                                        dark:shadow-none
                                    "
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
                                            group/dropdown

                                            flex
                                            w-full
                                            items-center
                                            justify-between
                                            gap-4

                                            px-4
                                            py-4

                                            text-left

                                            transition-colors
                                            duration-150

                                            hover:bg-indigo-500/[0.045]

                                            focus-visible:outline-none
                                            focus-visible:ring-2
                                            focus-visible:ring-inset
                                            focus-visible:ring-indigo-500

                                            sm:px-5

                                            dark:hover:bg-white/[0.025]
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
                                            <Newspaper
                                                size={18}
                                                strokeWidth={2}
                                                aria-hidden="true"

                                                className="
                                                    shrink-0
                                                    text-indigo-600

                                                    dark:text-indigo-300
                                                "
                                            />

                                            <div className="min-w-0">
                                                <p
                                                    className="
                                                        text-[13px]
                                                        font-bold

                                                        text-slate-800

                                                        dark:text-gray-300
                                                    "
                                                >
                                                    Oxirgi yangiliklar
                                                </p>

                                                <p
                                                    className="
                                                        mt-0.5

                                                        text-[10px]
                                                        font-medium
                                                        uppercase
                                                        tracking-[0.1em]

                                                        text-slate-500

                                                        dark:text-gray-600
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
                                                gap-2
                                            "
                                        >
                                            <span
                                                className="
                                                    hidden

                                                    text-[11px]
                                                    font-medium

                                                    text-slate-500

                                                    sm:block

                                                    dark:text-gray-500
                                                "
                                            >
                                                {dropdownOpen
                                                    ? "Yopish"
                                                    : "Ko‘rsatish"}
                                            </span>

                                            <span
                                                className="
                                                    grid
                                                    h-8
                                                    w-8
                                                    place-items-center

                                                    rounded-lg
                                                    border

                                                    border-[#dce5f0]
                                                    bg-[#f5f8fd]

                                                    dark:border-white/[0.06]
                                                    dark:bg-white/[0.025]
                                                "
                                            >
                                                <ChevronDown
                                                    size={16}
                                                    strokeWidth={2}

                                                    aria-hidden="true"

                                                    className={`
                                                        text-slate-500

                                                        transition-transform
                                                        duration-200

                                                        dark:text-gray-500

                                                        ${
                                                            dropdownOpen
                                                                ? "rotate-180 text-indigo-600 dark:text-indigo-300"
                                                                : ""
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

                                                initial={{
                                                    height: 0,
                                                    opacity: 0,
                                                }}

                                                animate={{
                                                    height: "auto",
                                                    opacity: 1,
                                                }}

                                                exit={{
                                                    height: 0,
                                                    opacity: 0,
                                                }}

                                                transition={
                                                    accordionTransition
                                                }

                                                className="
                                                    overflow-hidden
                                                "
                                            >
                                                <div
                                                    className="
                                                        border-t

                                                        border-[#e5eaf3]

                                                        dark:border-white/[0.05]
                                                    "
                                                >
                                                    {dropdownUpdates.map(
                                                        (update) => (
                                                            <SiteUpdateCard
                                                                key={update.id}

                                                                variant="compact"

                                                                update={update}

                                                                opened={
                                                                    openedUpdateId ===
                                                                    update.id
                                                                }

                                                                onToggle={() =>
                                                                    toggleUpdate(
                                                                        update.id
                                                                    )
                                                                }

                                                                likeLoading={
                                                                    likingIds.includes(
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

                            {/* ======================
                                TOTAL INFO
                            ====================== */}

                            {totalCount > safeUpdates.length && (
                                <div
                                    className="
                                        mt-4

                                        flex
                                        flex-wrap
                                        items-center
                                        justify-center
                                        gap-1.5

                                        text-center

                                        text-[11px]
                                        font-medium

                                        text-slate-500

                                        dark:text-gray-600
                                    "
                                >
                                    <History
                                        size={13}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />

                                    <span>
                                        Homepage'da oxirgi{" "}
                                        {safeUpdates.length} ta yangilik
                                        ko‘rsatildi.
                                    </span>

                                    <span>
                                        Jami {totalCount} ta mavjud.
                                    </span>
                                </div>
                            )}
                        </>

                    ) : (

                        /* ==========================
                            EMPTY STATE
                        ========================== */

                        <div
                            className="
                                rounded-3xl
                                border
                                border-dashed

                                border-[#dce5f0]
                                bg-white/75

                                p-7
                                text-center

                                sm:p-9

                                dark:border-white/[0.08]
                                dark:bg-white/[0.02]
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

                                    border-indigo-400/20
                                    bg-indigo-500/[0.06]

                                    text-indigo-600

                                    dark:text-indigo-300
                                "
                            >
                                <Newspaper
                                    size={24}
                                    strokeWidth={1.8}
                                    aria-hidden="true"
                                />
                            </div>

                            <h3
                                className="
                                    mt-4

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
                                    mt-2
                                    max-w-md

                                    text-sm
                                    leading-6

                                    text-slate-600

                                    dark:text-gray-500
                                "
                            >
                                Admin paneldan changelog
                                qo‘shilganda shu yerda
                                avtomatik ko‘rinadi.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default SiteUpdates;
