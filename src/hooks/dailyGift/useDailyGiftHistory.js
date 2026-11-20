
// src/hooks/dailyGift/useDailyGiftHistory.js

import {
    useCallback,
    useEffect,
    useRef,
} from "react";

import {
    useDispatch,
    useSelector,
    useStore,
} from "react-redux";


// =========================================================
// DAILY GIFT CONFIGURATION
// =========================================================

import {
    DAILY_GIFT_REQUEST_STATUS,
    DAILY_GIFT_HISTORY_PAGINATION,
} from "../../config/dailyGiftConfig";


// =========================================================
// REDUX THUNKS
// =========================================================

import {
    fetchDailyGiftHistory,
} from "../../features/dailyGift/dailyGiftThunks";


// =========================================================
// REDUX SELECTORS
// =========================================================

import {
    selectDailyGiftOwnerId,
    selectDailyGiftHasValidSession,

    selectDailyGiftHistory,
    selectDailyGiftHistoryView,
    selectDailyGiftHistoryRequestStatus,
    selectDailyGiftHistoryTotalPages,

    selectDailyGiftIsHistoryLoading,
    selectDailyGiftIsHistoryLoaded,
} from "../../features/dailyGift/dailyGiftSelectors";


// =========================================================
// FSOCIETY — DAILY GIFT HISTORY HOOK
// =========================================================
//
// Features:
//
// - Lazy history loading
// - Server-side pagination
// - Manual refresh
// - Failed request retry
// - Duplicate request protection
// - Authentication isolation
// - Automatic loading after history invalidation
//
// This hook never submits a gift claim.
//
// History should only be loaded when the
// corresponding modal section is visible.
//
// =========================================================


// =========================================================
// CONSTANTS
// =========================================================

const {
    IDLE,
    FAILED,
} = DAILY_GIFT_REQUEST_STATUS;

const {
    DEFAULT_PAGE,

    DEFAULT_PAGE_SIZE,
} = DAILY_GIFT_HISTORY_PAGINATION;


// =========================================================
// PAGE NUMBER VALIDATION
// =========================================================

const isValidPage = (value) => (
    Number.isSafeInteger(value)
    &&
    value >= 1
);


// =========================================================
// PAGINATION LINK PARSER
//
// DRF pagination returns:
//
// next:
//     /api/events/.../history/?page=2
//
// previous:
//     /api/events/.../history/?page=1
//
// A page parameter may be omitted for page 1.
//
// IMPORTANT:
//
// Pagination links are parsed only to obtain
// page numbers.
//
// Never send authenticated requests directly
// to an arbitrary URL returned in a response.
//
// =========================================================

const getPageFromLink = (link) => {

    if (
        typeof link !== "string"
        ||
        !link.trim()
    ) {
        return null;
    }

    try {

        const url = new URL(
            link,
            "https://pagination.invalid"
        );

        const rawPage =
            url.searchParams.get("page");

        if (rawPage === null) {

            return DEFAULT_PAGE;
        }

        const page = Number(rawPage);

        return isValidPage(page)

            ? page

            : null;

    } catch {

        return null;
    }
};


// =========================================================
// CURRENT PAGE RESOLUTION
//
// Resolve the displayed page from the actual
// backend pagination response.
//
// =========================================================

const resolveCurrentPage = (
    history
) => {

    if (!history) {
        return null;
    }


    const nextPage = getPageFromLink(
        history.next
    );

    if (
        nextPage !== null
        &&
        nextPage > 1
    ) {

        return nextPage - 1;
    }


    const previousPage = getPageFromLink(
        history.previous
    );

    if (previousPage !== null) {

        return previousPage + 1;
    }


    return DEFAULT_PAGE;
};


// =========================================================
// MAIN HISTORY HOOK
// =========================================================

export const useDailyGiftHistory = (
    {
        enabled = true,
    } = {}
) => {

    const dispatch = useDispatch();

    const store = useStore();


    // =====================================================
    // SESSION STATE
    // =====================================================

    const ownerId = useSelector(
        selectDailyGiftOwnerId
    );

    const hasValidSession = useSelector(
        selectDailyGiftHasValidSession
    );


    // =====================================================
    // HISTORY STATE
    // =====================================================

    const history = useSelector(
        selectDailyGiftHistory
    );

    const historyView = useSelector(
        selectDailyGiftHistoryView
    );

    const requestStatus = useSelector(
        selectDailyGiftHistoryRequestStatus
    );

    const totalPages = useSelector(
        (state) =>
            selectDailyGiftHistoryTotalPages(
                state,
                DEFAULT_PAGE_SIZE
            )
    );


    // =====================================================
    // LAST REQUESTED PAGE
    //
    // Preserve the page number for manual retry
    // if the request fails.
    //
    // This reference does not create another
    // history cache or store reward data.
    // =====================================================

    const lastRequestRef = useRef({
        ownerId: null,

        page: DEFAULT_PAGE,
    });


    // =====================================================
    // FETCH PAGE
    // =====================================================

    const loadPage = useCallback(
        (
            requestedPage = DEFAULT_PAGE
        ) => {

            if (
                !enabled
                ||
                !isValidPage(requestedPage)
            ) {

                return null;
            }


            const currentState =
                store.getState();


            // =============================================
            // SESSION VALIDATION
            // =============================================

            if (
                !selectDailyGiftHasValidSession(
                    currentState
                )
                ||
                selectDailyGiftOwnerId(
                    currentState
                ) !== ownerId
            ) {

                return null;
            }


            // =============================================
            // DUPLICATE REQUEST PROTECTION
            // =============================================

            if (
                selectDailyGiftIsHistoryLoading(
                    currentState
                )
            ) {

                return null;
            }


            // =============================================
            // TRACK REQUESTED PAGE
            // =============================================

            lastRequestRef.current = {
                ownerId,

                page: requestedPage,
            };


            // =============================================
            // BACKEND PAGINATION REQUEST
            // =============================================

            return dispatch(
                fetchDailyGiftHistory({
                    page: requestedPage,

                    pageSize: DEFAULT_PAGE_SIZE,
                })
            );
        },

        [
            enabled,

            ownerId,

            dispatch,

            store,
        ]
    );


    // =====================================================
    // INITIAL HISTORY LOAD
    //
    // IDLE also occurs when the Redux slice
    // invalidates history after a successful claim.
    //
    // Do not auto-retry FAILED requests.
    //
    // =====================================================

    useEffect(() => {

        if (
            !enabled
            ||
            !hasValidSession
            ||
            ownerId === null
        ) {

            return;
        }


        if (requestStatus !== IDLE) {

            return;
        }


        void loadPage(
            DEFAULT_PAGE
        );

    }, [
        enabled,

        hasValidSession,

        ownerId,

        requestStatus,

        loadPage,
    ]);


    // =====================================================
    // GO TO SPECIFIC PAGE
    // =====================================================

    const goToPage = useCallback(
        (requestedPage) => {

            if (!isValidPage(requestedPage)) {

                return null;
            }


            const currentState =
                store.getState();


            if (
                !selectDailyGiftHasValidSession(
                    currentState
                )
                ||
                !selectDailyGiftIsHistoryLoaded(
                    currentState
                )
            ) {

                return null;
            }


            const pages =
                selectDailyGiftHistoryTotalPages(
                    currentState,
                    DEFAULT_PAGE_SIZE
                );


            const maximumPage =
                Math.max(
                    DEFAULT_PAGE,
                    pages
                );


            if (requestedPage > maximumPage) {

                return null;
            }


            const currentPage =
                resolveCurrentPage(
                    selectDailyGiftHistory(
                        currentState
                    )
                );


            if (
                requestedPage === currentPage
            ) {

                return null;
            }


            return loadPage(
                requestedPage
            );
        },

        [
            store,

            loadPage,
        ]
    );


    // =====================================================
    // NEXT PAGE
    // =====================================================

    const nextPage = useCallback(
        () => {

            const currentHistory =
                selectDailyGiftHistory(
                    store.getState()
                );

            const page = getPageFromLink(
                currentHistory?.next
            );

            if (page === null) {

                return null;
            }

            return goToPage(page);
        },

        [
            store,

            goToPage,
        ]
    );


    // =====================================================
    // PREVIOUS PAGE
    // =====================================================

    const previousPage = useCallback(
        () => {

            const currentHistory =
                selectDailyGiftHistory(
                    store.getState()
                );

            const page = getPageFromLink(
                currentHistory?.previous
            );

            if (page === null) {

                return null;
            }

            return goToPage(page);
        },

        [
            store,

            goToPage,
        ]
    );


    // =====================================================
    // REFRESH HISTORY
    //
    // Refresh the currently displayed page.
    // =====================================================

    const refreshHistory = useCallback(
        () => {

            const currentState =
                store.getState();

            const currentHistory =
                selectDailyGiftHistory(
                    currentState
                );

            const page =
                resolveCurrentPage(
                    currentHistory
                )
                ??
                DEFAULT_PAGE;


            return loadPage(page);
        },

        [
            store,

            loadPage,
        ]
    );


    // =====================================================
    // RETRY FAILED REQUEST
    //
    // Retry the page requested by the current
    // authenticated user.
    // =====================================================

    const retryHistory = useCallback(
        () => {

            const currentState =
                store.getState();

            const currentOwnerId =
                selectDailyGiftOwnerId(
                    currentState
                );

            const currentRequestStatus =
                selectDailyGiftHistoryRequestStatus(
                    currentState
                );


            if (
                currentRequestStatus !== FAILED
            ) {

                return null;
            }


            const lastRequest =
                lastRequestRef.current;

            const requestedPage = (

                currentOwnerId
                    === lastRequest.ownerId

                    ? lastRequest.page

                    : DEFAULT_PAGE
            );


            return loadPage(
                requestedPage
            );
        },

        [
            store,

            loadPage,
        ]
    );


    // =====================================================
    // RELOAD FIRST PAGE
    //
    // Useful after pagination conflicts or when
    // the user wants the newest rewards.
    // =====================================================

    const reloadFirstPage = useCallback(
        () => loadPage(DEFAULT_PAGE),

        [loadPage]
    );


    // =====================================================
    // PRESENTATION VALUES
    // =====================================================

    const currentPage = (

        resolveCurrentPage(history)

        ??

        (
            lastRequestRef.current.ownerId === ownerId

                ? lastRequestRef.current.page

                : DEFAULT_PAGE
        )
    );


    const isError = (
        requestStatus === FAILED
    );


    const isInitialLoading = (
        enabled
        &&
        historyView.isLoading
        &&
        !history
    );


    const isRefreshing = (
        historyView.isLoading
        &&
        Boolean(history)
    );


    // =====================================================
    // PUBLIC HOOK API
    // =====================================================

    return {

        // Shared Redux history view.

        ...historyView,


        // Authentication.

        hasValidSession,


        // Pagination.

        currentPage,

        totalPages,

        pageSize:
            DEFAULT_PAGE_SIZE,


        // Additional request states.

        requestStatus,

        isError,

        isInitialLoading,

        isRefreshing,


        // Controller actions.

        loadPage,

        goToPage,

        nextPage,

        previousPage,

        refreshHistory,

        retryHistory,

        reloadFirstPage,
    };
};


// =========================================================
// EXPORT
// =========================================================

export default useDailyGiftHistory;
