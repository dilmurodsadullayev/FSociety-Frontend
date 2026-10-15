
import React, {
    useCallback,
    useMemo,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    Link,
} from "react-router-dom";

import {
    AnimatePresence,
    motion,
} from "framer-motion";

import {
    ArrowRight,
    Bell,
    CheckCheck,
    Wifi,
    WifiOff,
} from "lucide-react";

// =========================================================
// NOTIFICATION ACTIONS
// =========================================================

import {
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from "../middleware/notificationMiddleware";

// =========================================================
// COMPONENTS
// =========================================================

import NotificationItem from "./notifications/dropdown/NotificationItem";

import {
    EmptyState,
    NotificationSkeleton,
} from "./notifications/dropdown/NotificationStates";

// =========================================================
// DROPDOWN ANIMATION
//
// No expensive blur filter.
// =========================================================

const dropdownVariants = {
    hidden: {
        opacity: 0,
        y: -6,
        scale: 0.99,
    },

    visible: {
        opacity: 1,
        y: 0,
        scale: 1,

        transition: {
            duration: 0.15,
            ease: "easeOut",
        },
    },

    exit: {
        opacity: 0,
        y: -6,
        scale: 0.99,

        transition: {
            duration: 0.12,
            ease: "easeIn",
        },
    },
};

// =========================================================
// NOTIFICATION DROPDOWN
// =========================================================

const NotificationDropdown = ({
    openNotifications,
    setOpenNotifications,
    notificationsRef,
}) => {
    // =====================================================
    // REDUX
    // =====================================================

    const dispatch = useDispatch();

    const notificationState = useSelector(
        (state) => state.notifications
    );

    const {
        notifications = [],
        totalUnreadCount = 0,
        wsConnected = false,
        wsError = null,
        loading = false,
    } = notificationState || {};

    // =====================================================
    // PREPARE NOTIFICATIONS
    //
    // Sorting only when notifications change.
    // =====================================================

    const {
        safeNotifications,
        dropdownItems,
        unreadNotifications,
    } = useMemo(() => {
        const safe = Array.isArray(notifications)
            ? notifications
            : [];

        const sorted = [...safe].sort(
            (a, b) => {
                return (
                    new Date(b?.created_at || 0) -
                    new Date(a?.created_at || 0)
                );
            }
        );

        const unread = sorted.filter(
            (item) => !item.is_read
        );

        const items = unread.length > 0
            ? unread.slice(0, 8)
            : sorted.slice(0, 8);

        return {
            safeNotifications: safe,
            unreadNotifications: unread,
            dropdownItems: items,
        };
    }, [notifications]);

    // =====================================================
    // UNREAD COUNT
    // =====================================================

    const unreadCount =
        typeof totalUnreadCount === "number" &&
        Number.isFinite(totalUnreadCount)
            ? totalUnreadCount
            : unreadNotifications.length;

    // =====================================================
    // MARK ONE AS READ
    // =====================================================

    const handleMarkOneAsRead = useCallback(
        (notificationId) => {
            dispatch(
                markNotificationAsRead(notificationId)
            );
        },
        [dispatch]
    );

    // =====================================================
    // MARK ALL AS READ
    // =====================================================

    const handleMarkAllAsRead = useCallback(
        () => {
            dispatch(
                markAllNotificationsAsRead()
            );
        },
        [dispatch]
    );

    // =====================================================
    // CLOSE DROPDOWN
    // =====================================================

    const closeDropdown = useCallback(
        () => {
            setOpenNotifications(false);
        },
        [setOpenNotifications]
    );

    // =====================================================
    // TOGGLE DROPDOWN
    // =====================================================

    const toggleDropdown = useCallback(
        () => {
            setOpenNotifications(
                (previous) => !previous
            );
        },
        [setOpenNotifications]
    );

    // =====================================================
    // JSX
    // =====================================================

    return (
        <div
            ref={notificationsRef}
            className="relative shrink-0"
        >
            {/* ==========================================
                BELL BUTTON
            ========================================== */}

            <button
                type="button"
                onClick={toggleDropdown}
                aria-label="Bildirishnomalar"
                aria-expanded={Boolean(openNotifications)}
                aria-controls="fsociety-notification-dropdown"

                className={`
                    group
                    relative

                    grid
                    h-10
                    w-10

                    place-items-center

                    rounded-xl
                    border

                    outline-none

                    transition-colors
                    duration-150

                    focus-visible:ring-2
                    focus-visible:ring-indigo-500

                    ${
                        openNotifications
                            ? `
                                border-indigo-400/35
                                bg-indigo-500/10
                                text-indigo-700

                                dark:border-indigo-400/25
                                dark:text-indigo-300
                            `
                            : `
                                border-[#cdd7e8]
                                bg-[#f6f8ff]/90
                                text-slate-600

                                hover:border-indigo-400/40
                                hover:bg-indigo-500/[0.07]
                                hover:text-indigo-700

                                dark:border-white/[0.07]
                                dark:bg-white/[0.035]
                                dark:text-gray-400

                                dark:hover:border-indigo-400/25
                                dark:hover:bg-indigo-500/[0.06]
                                dark:hover:text-indigo-300
                            `
                    }
                `}
            >
                <Bell
                    size={18}
                    strokeWidth={2}
                    aria-hidden="true"
                />

                {/* UNREAD COUNT */}

                {unreadCount > 0 && (
                    <span
                        className="
                            absolute
                            -right-2
                            -top-2
                            z-20

                            flex
                            min-h-5
                            min-w-5

                            items-center
                            justify-center

                            rounded-full
                            border-2

                            border-[#eaf0f9]
                            bg-red-500

                            px-1

                            font-mono
                            text-[8px]
                            font-bold
                            leading-none
                            text-white

                            dark:border-[#080c12]
                        "
                    >
                        {unreadCount > 99
                            ? "99+"
                            : unreadCount}
                    </span>
                )}

                {/* WEBSOCKET CONNECTED */}

                {wsConnected && (
                    <span
                        aria-label="Real-time ulangan"
                        className="
                            absolute
                            bottom-[3px]
                            right-[3px]

                            h-2
                            w-2

                            rounded-full
                            border

                            border-[#eaf0f9]
                            bg-emerald-500

                            dark:border-[#080c12]
                            dark:bg-emerald-400
                        "
                    />
                )}
            </button>

            {/* ==========================================
                DROPDOWN
            ========================================== */}

            <AnimatePresence>
                {openNotifications && (
                    <motion.div
                        id="fsociety-notification-dropdown"

                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"

                        aria-label="Bildirishnomalar paneli"

                        className="
                            fixed
                            inset-x-3
                            top-[80px]

                            z-[70]

                            origin-top-right

                            overflow-hidden

                            rounded-2xl
                            border

                            border-[#d5deeb]

                            bg-[#f9fbff]/[0.99]

                            shadow-[0_22px_65px_rgba(30,41,59,0.16)]

                            sm:absolute
                            sm:inset-x-auto
                            sm:right-0
                            sm:top-full
                            sm:mt-3
                            sm:w-[430px]
                            sm:max-w-[calc(100vw-2rem)]

                            dark:border-white/[0.07]
                            dark:bg-[#0d121a]/[0.98]

                            dark:shadow-[0_30px_90px_rgba(0,0,0,0.60)]
                        "
                    >
                        {/* ==================================
                            HEADER
                        ================================== */}

                        <div
                            className="
                                relative

                                overflow-hidden

                                border-b
                                border-[#e2e8f2]

                                bg-[#f0f4fb]

                                px-4
                                py-4

                                dark:border-white/[0.06]
                                dark:bg-white/[0.02]
                            "
                        >
                            {/* SUBTLE ACCENT */}

                            <span
                                aria-hidden="true"
                                className="
                                    pointer-events-none
                                    absolute
                                    -right-14
                                    -top-14

                                    h-32
                                    w-32

                                    rounded-full

                                    bg-indigo-500/[0.08]
                                "
                            />

                            <div
                                className="
                                    relative

                                    flex
                                    items-start
                                    justify-between

                                    gap-3
                                "
                            >
                                {/* HEADER TEXT */}

                                <div className="min-w-0">

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                        "
                                    >
                                        <Bell
                                            size={17}
                                            className="
                                                text-indigo-600
                                                dark:text-indigo-400
                                            "
                                        />

                                        <h3
                                            className="
                                                text-[15px]
                                                font-bold

                                                text-slate-900

                                                dark:text-white
                                            "
                                        >
                                            Bildirishnomalar
                                        </h3>

                                        {unreadCount > 0 && (
                                            <span
                                                className="
                                                    rounded-full
                                                    border

                                                    border-indigo-400/20
                                                    bg-indigo-500/[0.07]

                                                    px-2
                                                    py-0.5

                                                    font-mono
                                                    text-[9px]
                                                    font-bold

                                                    text-indigo-700

                                                    dark:text-indigo-300
                                                "
                                            >
                                                {unreadCount}
                                            </span>
                                        )}
                                    </div>

                                    {/* CONNECTION STATUS */}

                                    <div
                                        className="
                                            mt-2

                                            flex
                                            items-center
                                            gap-1.5
                                        "
                                    >
                                        {wsConnected ? (
                                            <Wifi
                                                size={12}
                                                className="text-emerald-600 dark:text-emerald-400"
                                            />
                                        ) : (
                                            <WifiOff
                                                size={12}
                                                className="text-slate-400 dark:text-gray-600"
                                            />
                                        )}

                                        <p
                                            className={`
                                                font-mono
                                                text-[9px]
                                                font-semibold
                                                uppercase
                                                tracking-[0.08em]

                                                ${
                                                    wsConnected
                                                        ? "text-emerald-700 dark:text-emerald-400/70"
                                                        : "text-slate-500 dark:text-gray-600"
                                                }
                                            `}
                                        >
                                            {wsConnected
                                                ? "Real-time online"
                                                : wsError
                                                    ? "Ulanishda xatolik"
                                                    : "Connecting..."}
                                        </p>
                                    </div>

                                    {/* WS ERROR */}

                                    {wsError && (
                                        <p
                                            className="
                                                mt-1.5
                                                max-w-[240px]
                                                truncate

                                                text-[10px]
                                                font-medium

                                                text-red-600

                                                dark:text-red-300
                                            "
                                            title={String(wsError)}
                                        >
                                            {String(wsError)}
                                        </p>
                                    )}
                                </div>

                                {/* MARK ALL READ */}

                                {unreadCount > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleMarkAllAsRead}

                                        className="
                                            flex
                                            shrink-0
                                            items-center
                                            gap-1.5

                                            rounded-xl
                                            border

                                            border-indigo-400/20
                                            bg-indigo-500/[0.07]

                                            px-2.5
                                            py-2

                                            text-[10px]
                                            font-bold

                                            text-indigo-700

                                            transition-colors
                                            duration-150

                                            hover:bg-indigo-500/[0.12]

                                            focus-visible:outline-none
                                            focus-visible:ring-2
                                            focus-visible:ring-indigo-500

                                            dark:border-indigo-400/15
                                            dark:bg-indigo-500/[0.06]
                                            dark:text-indigo-300

                                            dark:hover:bg-indigo-500/10
                                        "
                                    >
                                        <CheckCheck
                                            size={14}
                                            strokeWidth={2}
                                        />

                                        <span className="hidden sm:inline">
                                            O‘qildi
                                        </span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* ==================================
                            NOTIFICATION LIST
                        ================================== */}

                        <div
                            className="
                                max-h-[45vh]
                                overflow-y-auto

                                sm:max-h-[410px]
                            "
                        >
                            {loading ? (
                                <NotificationSkeleton />
                            ) : safeNotifications.length === 0 ? (
                                <EmptyState />
                            ) : dropdownItems.length > 0 ? (
                                dropdownItems.map(
                                    (notification) => (
                                        <NotificationItem
                                            key={notification.id}
                                            notification={notification}
                                            onMarkRead={
                                                handleMarkOneAsRead
                                            }
                                            onClose={
                                                closeDropdown
                                            }
                                        />
                                    )
                                )
                            ) : (
                                <EmptyState type="read" />
                            )}
                        </div>

                        {/* ==================================
                            FOOTER
                        ================================== */}

                        {safeNotifications.length > 0 && (
                            <div
                                className="
                                    border-t
                                    border-[#e2e8f2]

                                    bg-[#f0f4fa]/70

                                    p-3

                                    dark:border-white/[0.06]
                                    dark:bg-black/10
                                "
                            >
                                <Link
                                    to="/notifications"
                                    onClick={closeDropdown}

                                    className="
                                        group

                                        flex
                                        items-center
                                        justify-center
                                        gap-2

                                        rounded-xl
                                        border

                                        border-[#d5deeb]

                                        bg-white/80

                                        px-4
                                        py-3

                                        text-[11px]
                                        font-bold

                                        text-slate-600

                                        transition-colors
                                        duration-150

                                        hover:border-indigo-400/30
                                        hover:bg-indigo-500/[0.06]
                                        hover:text-indigo-700

                                        focus-visible:outline-none
                                        focus-visible:ring-2
                                        focus-visible:ring-indigo-500

                                        dark:border-white/[0.06]
                                        dark:bg-white/[0.025]
                                        dark:text-gray-400

                                        dark:hover:border-indigo-400/20
                                        dark:hover:bg-indigo-500/[0.06]
                                        dark:hover:text-indigo-300
                                    "
                                >
                                    Barcha bildirishnomalar

                                    <ArrowRight
                                        size={14}
                                        aria-hidden="true"

                                        className="
                                            transition-transform
                                            duration-150

                                            group-hover:translate-x-1

                                            motion-reduce:transition-none
                                        "
                                    />
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationDropdown;
