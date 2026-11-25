
 // src/hooks/events/useEvents.js

import {
    useCallback,
    useEffect,
    useMemo,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    EVENT_REQUEST_STATUS,
    fetchPublicEvents,
    fetchEventDetail,
    clearEventsError,
    clearEventDetailError,
} from "../../features/events/eventsSlice";

// =========================================================
// FSOCIETY — UNIVERSAL EVENTS HOOKS
// =========================================================
//
// Location:
// src/hooks/events/useEvents.js
//
// Exports:
//
// 1. useEvents()
//    - Fetch public events
//    - Read Redux events state
//    - Manual refresh
//    - Loading / error handling
//
// 2. useEventDetail()
//    - Fetch a single event
//    - Cache by event slug
//    - Manual refresh
//    - 404 detection
//
// IMPORTANT:
//
// This module does not manage gift claims.
// It does not depend on Winter Mode.
// It does not make direct Axios requests.
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

const EMPTY_EVENTS = [];

const EVENT_SLUG_PATTERN =
    /^[a-zA-Z0-9_-]+$/;


// =========================================================
// HELPERS
// =========================================================

const normalizeSlug = (value) => {
    if (typeof value !== "string") {
        return "";
    }

    const slug = value.trim();

    return EVENT_SLUG_PATTERN.test(slug)
        ? slug
        : "";
};


// =========================================================
// USE EVENTS
// =========================================================
//
// Example:
//
// const {
//     events,
//     loading,
//     error,
//     refresh,
// } = useEvents();
//
// =========================================================

export function useEvents({
    enabled = true,
    autoFetch = true,
} = {}) {
    const dispatch = useDispatch();

    // =====================================================
    // REDUX STATE
    // =====================================================

    const events = useSelector(
        (state) =>
            state.events?.items ??
            EMPTY_EVENTS
    );

    const count = useSelector(
        (state) =>
            state.events?.count ?? 0
    );

    const next = useSelector(
        (state) =>
            state.events?.next ?? null
    );

    const previous = useSelector(
        (state) =>
            state.events?.previous ?? null
    );

    const requestStatus = useSelector(
        (state) =>
            state.events?.listStatus ??
            IDLE
    );

    const error = useSelector(
        (state) =>
            state.events?.listError ??
            null
    );

    const fetchedAt = useSelector(
        (state) =>
            state.events?.listFetchedAt ??
            null
    );

    // =====================================================
    // DERIVED STATE
    // =====================================================

    const loading =
        requestStatus === LOADING;

    const isLoaded =
        requestStatus === SUCCEEDED;

    const isError =
        requestStatus === FAILED;

    const isEmpty =
        isLoaded &&
        events.length === 0;

    const hasEvents =
        events.length > 0;

    // =====================================================
    // INITIAL FETCH
    // =====================================================
    //
    // Fetch once when Redux status is idle.
    //
    // Do not automatically retry a failed GET
    // forever. Manual refresh handles retries.
    //
    // =====================================================

    useEffect(() => {
        if (
            !enabled ||
            !autoFetch ||
            requestStatus !== IDLE
        ) {
            return;
        }

        dispatch(
            fetchPublicEvents()
        );

    }, [
        dispatch,
        enabled,
        autoFetch,
        requestStatus,
    ]);

    // =====================================================
    // MANUAL REFRESH
    // =====================================================

    const refresh = useCallback(
        (options = {}) => {
            return dispatch(
                fetchPublicEvents(options)
            );
        },
        [dispatch]
    );

    // =====================================================
    // CLEAR ERROR
    // =====================================================

    const dismissError = useCallback(
        () => {
            dispatch(
                clearEventsError()
            );
        },
        [dispatch]
    );

    // =====================================================
    // EVENT INDEX
    // =====================================================
    //
    // Build an efficient lookup for UI components.
    //
    // =====================================================

    const eventsBySlug = useMemo(
        () => {
            const result = {};

            for (const event of events) {
                const slug = normalizeSlug(
                    event?.slug
                );

                if (slug) {
                    result[slug] = event;
                }
            }

            return result;
        },
        [events]
    );

    // =====================================================
    // RETURN
    // =====================================================

    return {
        events,
        eventsBySlug,

        count,
        next,
        previous,

        requestStatus,
        fetchedAt,

        loading,
        isLoaded,
        isError,
        isEmpty,
        hasEvents,

        error,

        refresh,
        dismissError,
    };
}


// =========================================================
// USE EVENT DETAIL
// =========================================================
//
// Example:
//
// const {
//     event,
//     loading,
//     notFound,
//     refresh,
// } = useEventDetail("new-year-2027");
//
// =========================================================

export function useEventDetail(
    eventSlug,
    {
        enabled = true,
        autoFetch = true,
    } = {}
) {
    const dispatch = useDispatch();

    // =====================================================
    // NORMALIZED SLUG
    // =====================================================

    const slug = useMemo(
        () => normalizeSlug(eventSlug),
        [eventSlug]
    );

    const isValidSlug =
        slug.length > 0;

    // =====================================================
    // REDUX STATE
    // =====================================================

    const detail = useSelector(
        (state) =>
            slug
                ? state.events
                    ?.detailsBySlug?.[slug] ??
                  null
                : null
    );

    const requestStatus = useSelector(
        (state) =>
            slug
                ? state.events
                    ?.detailStatusBySlug?.[slug] ??
                  IDLE
                : IDLE
    );

    const error = useSelector(
        (state) =>
            slug
                ? state.events
                    ?.detailErrorBySlug?.[slug] ??
                  null
                : null
    );

    // =====================================================
    // DERIVED STATE
    // =====================================================

    const loading =
        requestStatus === LOADING;

    const isLoaded =
        requestStatus === SUCCEEDED;

    const isError =
        requestStatus === FAILED;

    const notFound =
        error?.status === 404;

    // =====================================================
    // INITIAL FETCH
    // =====================================================

    useEffect(() => {
        if (
            !enabled ||
            !autoFetch ||
            !isValidSlug ||
            requestStatus !== IDLE
        ) {
            return;
        }

        dispatch(
            fetchEventDetail(slug)
        );

    }, [
        dispatch,
        enabled,
        autoFetch,
        isValidSlug,
        requestStatus,
        slug,
    ]);

    // =====================================================
    // MANUAL REFRESH
    // =====================================================

    const refresh = useCallback(
        () => {
            if (!isValidSlug) {
                return Promise.resolve(null);
            }

            return dispatch(
                fetchEventDetail(slug)
            );
        },
        [
            dispatch,
            isValidSlug,
            slug,
        ]
    );

    // =====================================================
    // CLEAR ERROR
    // =====================================================

    const dismissError = useCallback(
        () => {
            if (!isValidSlug) {
                return;
            }

            dispatch(
                clearEventDetailError(slug)
            );
        },
        [
            dispatch,
            isValidSlug,
            slug,
        ]
    );

    // =====================================================
    // RETURN
    // =====================================================

    return {
        slug,
        event: detail,

        isValidSlug,

        requestStatus,

        loading,
        isLoaded,
        isError,
        notFound,

        error,

        refresh,
        dismissError,
    };
}


// =========================================================
// DEFAULT EXPORT
// =========================================================

export default useEvents;
