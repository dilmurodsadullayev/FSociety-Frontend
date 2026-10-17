// src/components/notifications/useNotificationsPage.js

import {
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
    connectWebSocket,
    disconnectWebSocket,
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from "../../middleware/notificationMiddleware";

import {
    filterNotifications,
    getNotificationCounts,
} from "../../utils/notificationUtils";

// =========================================================
// CONSTANTS
// =========================================================

const EMPTY_NOTIFICATIONS = Object.freeze([]);

const PAGE_SIZE_OPTIONS = Object.freeze([
    5,
    10,
    20,
    50,
]);

const VALID_FILTERS = Object.freeze([
    "all",
    "unread",
    "read",
]);

const INITIAL_LOAD_TIMEOUT_MS = 12000;

// =========================================================
// REDUX SELECTORS
// =========================================================

const selectNotificationState = (state) =>
    state.notifications;

const selectCurrentUser = (state) =>
    state.auth?.user ?? null;

const selectIsLoggedIn = (state) =>
    Boolean(state.auth?.isLoggedIn);

// =========================================================
// NOTIFICATIONS PAGE CONTROLLER
// =========================================================

const useNotificationsPage = () => {
    const dispatch = useDispatch();

    const notificationState = useSelector(
        selectNotificationState
    );

    const currentUser = useSelector(
        selectCurrentUser
    );

    const isLoggedIn = useSelector(
        selectIsLoggedIn
    );

    // =====================================================
    // REDUX DATA
    // =====================================================

    const notifications =
        notificationState?.notifications;

    const totalUnreadCount =
        notificationState?.totalUnreadCount ?? 0;

    const wsConnected = Boolean(
        notificationState?.wsConnected
    );

    const wsError =
        notificationState?.wsError ?? null;

    const loading = Boolean(
        notificationState?.loading
    );

    const hasLoaded = Boolean(
        notificationState?.hasLoaded
    );

    // =====================================================
    // LOCAL STATE
    // =====================================================

    const [filter, setFilter] = useState("all");

    const [currentPage, setCurrentPage] = useState(1);

    const [perPage, setPerPage] = useState(10);

    const [
        initialWaitExpired,
        setInitialWaitExpired,
    ] = useState(false);

    // =====================================================
    // SAFE NOTIFICATIONS
    // =====================================================

    const safeNotifications = Array.isArray(
        notifications
    )
        ? notifications
        : EMPTY_NOTIFICATIONS;

    // =====================================================
    // COUNTS
    // =====================================================

    const {
        total: totalCount,
        unread: unreadCount,
        read: readCount,
    } = useMemo(
        () =>
            getNotificationCounts(
                safeNotifications,
                totalUnreadCount
            ),
        [
            safeNotifications,
            totalUnreadCount,
        ]
    );

    // =====================================================
    // FILTER
    // =====================================================

    const filteredNotifications = useMemo(
        () =>
            filterNotifications(
                safeNotifications,
                filter
            ),
        [
            safeNotifications,
            filter,
        ]
    );

    // =====================================================
    // PAGINATION
    // =====================================================

    const totalFiltered =
        filteredNotifications.length;

    const totalPages = Math.max(
        1,
        Math.ceil(
            totalFiltered / perPage
        )
    );

    const safeCurrentPage = Math.min(
        Math.max(1, currentPage),
        totalPages
    );

    const startIndex =
        (safeCurrentPage - 1) * perPage;

    const endIndex =
        startIndex + perPage;

    const paginatedNotifications = useMemo(
        () =>
            filteredNotifications.slice(
                startIndex,
                endIndex
            ),
        [
            filteredNotifications,
            startIndex,
            endIndex,
        ]
    );

    const startItem =
        totalFiltered === 0
            ? 0
            : startIndex + 1;

    const endItem = Math.min(
        endIndex,
        totalFiltered
    );

    // =====================================================
    // INITIAL LOADING
    //
    // WebSocket connected != notifications loaded.
    //
    // Skeleton should remain until the initial
    // list has actually arrived.
    // =====================================================

    const waitingForInitial =
        isLoggedIn &&
        !hasLoaded &&
        safeNotifications.length === 0 &&
        !wsError;

    // =====================================================
    // INITIAL LOADING TIMEOUT
    // =====================================================

    useEffect(() => {
        if (!waitingForInitial) {
            setInitialWaitExpired(false);
            return undefined;
        }

        const timeoutId = setTimeout(() => {
            setInitialWaitExpired(true);
        }, INITIAL_LOAD_TIMEOUT_MS);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [waitingForInitial]);

    // =====================================================
    // LOADING STATES
    // =====================================================

    const isInitialLoading =
        waitingForInitial &&
        !initialWaitExpired;

    const isInitialError =
        isLoggedIn &&
        !hasLoaded &&
        safeNotifications.length === 0 &&
        (
            Boolean(wsError) ||
            initialWaitExpired
        );

    const initialErrorMessage = wsError
        ? (
            typeof wsError === "string"
                ? wsError
                : wsError?.message ||
                  "Ulanishda xatolik yuz berdi."
        )
        : "Serverdan bildirishnomalar ro‘yxati vaqtida kelmadi.";

    const isSoftLoading =
        loading &&
        safeNotifications.length > 0;

    // =====================================================
    // PAGE SAFETY
    // =====================================================

    useEffect(() => {
        if (
            currentPage !== safeCurrentPage
        ) {
            setCurrentPage(
                safeCurrentPage
            );
        }
    }, [
        currentPage,
        safeCurrentPage,
    ]);

    // =====================================================
    // MARK ONE AS READ
    // =====================================================

    const markNotificationAsReadAction =
        useCallback(
            (id) => {
                if (
                    id !== null &&
                    id !== undefined
                ) {
                    dispatch(
                        markNotificationAsRead(id)
                    );
                }
            },
            [dispatch]
        );

    // =====================================================
    // MARK ALL AS READ
    // =====================================================

    const markAllAsReadAction = useCallback(
        () => {
            if (unreadCount > 0) {
                dispatch(
                    markAllNotificationsAsRead()
                );
            }
        },
        [
            dispatch,
            unreadCount,
        ]
    );

    // =====================================================
    // PAGE CHANGE
    // =====================================================

    const handlePageChange = useCallback(
        (page) => {
            const requested = Number(page);

            if (!Number.isInteger(requested)) {
                return;
            }

            const nextPage = Math.min(
                Math.max(1, requested),
                totalPages
            );

            setCurrentPage(nextPage);

            if (
                nextPage !== safeCurrentPage &&
                typeof window !== "undefined"
            ) {
                window.scrollTo({
                    top: 0,

                    behavior:
                        window.matchMedia?.(
                            "(prefers-reduced-motion: reduce)"
                        )?.matches
                            ? "auto"
                            : "smooth",
                });
            }
        },
        [
            safeCurrentPage,
            totalPages,
        ]
    );

    // =====================================================
    // PAGE SIZE CHANGE
    // =====================================================

    const handlePerPageChange = useCallback(
        (value) => {
            const number = Number(value);

            if (
                !PAGE_SIZE_OPTIONS.includes(
                    number
                )
            ) {
                return;
            }

            setPerPage(number);
            setCurrentPage(1);
        },
        []
    );

    // =====================================================
    // FILTER CHANGE
    // =====================================================

    const handleFilterChange = useCallback(
        (value) => {
            if (
                !VALID_FILTERS.includes(value)
            ) {
                return;
            }

            setFilter(value);
            setCurrentPage(1);
        },
        []
    );

    // =====================================================
    // FILTER COUNT
    // =====================================================

    const getFilterCount = useCallback(
        (key) => {
            if (key === "unread") {
                return unreadCount;
            }

            if (key === "read") {
                return readCount;
            }

            return totalCount;
        },
        [
            unreadCount,
            readCount,
            totalCount,
        ]
    );

    // =====================================================
    // RETRY INITIAL LOAD
    //
    // Reconnects the notification WebSocket.
    // Existing notification data is not cleared.
    // =====================================================

    const retryInitialLoad = useCallback(
        () => {
            setInitialWaitExpired(false);

            dispatch(
                disconnectWebSocket(false)
            );

            dispatch(
                connectWebSocket()
            );
        },
        [dispatch]
    );

    // =====================================================
    // RETURN
    // =====================================================

    return {
        // User
        currentUser,

        // WebSocket
        wsConnected,
        wsError,

        // Request
        loading,
        hasLoaded,

        // Filter
        filter,

        // Pagination
        currentPage: safeCurrentPage,
        perPage,

        // Counts
        totalCount,
        unreadCount,
        readCount,

        // Pagination data
        totalFiltered,
        totalPages,
        startItem,
        endItem,
        paginatedNotifications,

        // Loading states
        isInitialLoading,
        isInitialError,
        initialErrorMessage,
        isSoftLoading,

        // Retry
        retryInitialLoad,

        // Redux actions
        markNotificationAsReadAction,
        markAllAsReadAction,

        // Page actions
        handlePageChange,
        handlePerPageChange,
        handleFilterChange,
        getFilterCount,
    };
};

export default useNotificationsPage;