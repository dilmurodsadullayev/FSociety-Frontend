
// src/features/events/eventsSlice.js

import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import {
    getPublicEvents,
    getPublicEventDetail,
    normalizeEventsResponse,
    normalizeEventDetailResponse,
    normalizeEventsApiError,
    normalizeEventSlug,
} from "../../services/events/eventsApi";

// =========================================================
// FSOCIETY — UNIVERSAL EVENTS REDUX SLICE
// =========================================================
//
// Location:
// src/features/events/eventsSlice.js
//
// Responsibilities:
//
// - Fetch public events
// - Fetch individual event details
// - Store event list pagination
// - Handle request loading states
// - Handle API errors
// - Prevent duplicate requests
// - Ignore stale API responses
// - Support manual refresh
// - Cache event details by slug
//
// IMPORTANT:
//
// This slice does not manage:
//
// - Daily Gift claims
// - Seasonal Gift claims
// - FCoin balances
// - Reward ownership
// - Authentication
//
// Those responsibilities belong to other
// existing Redux slices.
//
// =========================================================


// =========================================================
// REQUEST STATUS
// =========================================================

export const EVENT_REQUEST_STATUS =
    Object.freeze({
        IDLE: "idle",
        LOADING: "loading",
        SUCCEEDED: "succeeded",
        FAILED: "failed",
    });

const {
    IDLE,
    LOADING,
    SUCCEEDED,
    FAILED,
} = EVENT_REQUEST_STATUS;


// =========================================================
// CONSTANTS
// =========================================================

const EVENT_SLUG_PATTERN =
    /^[a-zA-Z0-9_-]+$/;

const EMPTY_EVENTS = Object.freeze([]);

const EMPTY_STATE = Object.freeze({
    items: EMPTY_EVENTS,
    count: 0,
    next: null,
    previous: null,
    listStatus: IDLE,
    listError: null,
    listRequestId: null,
    listFetchedAt: null,
    detailsBySlug: {},
    detailStatusBySlug: {},
    detailErrorBySlug: {},
    detailRequestIdBySlug: {},
    detailFetchedAtBySlug: {},
});


// =========================================================
// INITIAL STATE
// =========================================================

const createInitialState = () => ({
    // ================================================
    // PUBLIC EVENTS LIST
    // ================================================

    items: [],

    count: 0,

    next: null,

    previous: null,

    // ================================================
    // LIST REQUEST STATE
    // ================================================

    listStatus: IDLE,

    listError: null,

    listRequestId: null,

    listFetchedAt: null,

    // ================================================
    // EVENT DETAILS
    // ================================================

    detailsBySlug: {},

    detailStatusBySlug: {},

    detailErrorBySlug: {},

    detailRequestIdBySlug: {},

    detailFetchedAtBySlug: {},
});


// =========================================================
// SLUG HELPERS
// =========================================================

const getSlugFromArg = (arg) => {
    const raw =
        typeof arg === "string"
            ? arg
            : arg?.slug;

    return typeof raw === "string"
        ? raw.trim()
        : "";
};

const isValidSlug = (slug) =>
    typeof slug === "string" &&
    EVENT_SLUG_PATTERN.test(slug);


// =========================================================
// REQUEST HELPERS
// =========================================================

const isCanceledRequest = (action) =>
    Boolean(
        action.meta?.aborted === true ||
        action.payload?.canceled === true ||
        action.error?.name === "AbortError"
    );

const getRequestError = (action) =>
    action.payload ?? {
        status: null,

        code: "REQUEST_FAILED",

        message:
            "So‘rovni bajarishda xatolik yuz berdi.",

        canceled: false,
    };


// =========================================================
// FETCH PUBLIC EVENTS
// =========================================================
//
// Redux thunk:
//
// dispatch(fetchPublicEvents());
//
// dispatch(
//     fetchPublicEvents({
//         params: { page: 2 }
//     })
// );
//
// An existing loading request prevents another
// list request from being started concurrently.
//
// The API response is normalized before
// reaching the Redux reducer.
//
// =========================================================

export const fetchPublicEvents =
    createAsyncThunk(
        "events/fetchPublicEvents",

        async (
            options = {},
            {
                signal,
                rejectWithValue,
            }
        ) => {
            try {
                const response =
                    await getPublicEvents({
                        params: options?.params,
                        signal,
                    });

                const normalized =
                    normalizeEventsResponse(
                        response
                    );

                return {
                    ...normalized,

                    fetchedAt: Date.now(),
                };
            } catch (error) {
                return rejectWithValue(
                    normalizeEventsApiError(
                        error
                    )
                );
            }
        },

        {
            condition: (
                _options,
                { getState }
            ) => {
                const state = getState();

                const status =
                    state?.events
                        ?.listStatus ?? IDLE;

                // Only one list request at once.
                // This also protects pagination
                // against overlapping requests.

                return status !== LOADING;
            },
        }
    );


// =========================================================
// FETCH EVENT DETAIL
// =========================================================
//
// Example:
//
// dispatch(
//     fetchEventDetail("new-year-2027")
// );
//
// Or:
//
// dispatch(
//     fetchEventDetail({
//         slug: "new-year-2027"
//     })
// );
//
// Each event has an independent request state.
//
// Request for event A must not block loading
// event B.
//
// =========================================================

export const fetchEventDetail =
    createAsyncThunk(
        "events/fetchEventDetail",

        async (
            arg,
            {
                signal,
                rejectWithValue,
            }
        ) => {
            try {
                const slug =
                    normalizeEventSlug(
                        getSlugFromArg(arg)
                    );

                const response =
                    await getPublicEventDetail(
                        slug,
                        { signal }
                    );

                const event =
                    normalizeEventDetailResponse(
                        response
                    );

                return {
                    slug,

                    event,

                    fetchedAt: Date.now(),
                };
            } catch (error) {
                return rejectWithValue(
                    normalizeEventsApiError(
                        error
                    )
                );
            }
        },

        {
            condition: (
                arg,
                { getState }
            ) => {
                const slug =
                    getSlugFromArg(arg);

                if (!isValidSlug(slug)) {
                    return false;
                }

                const state = getState();

                const requestStatus =
                    state?.events
                        ?.detailStatusBySlug
                        ?.[slug] ?? IDLE;

                // Duplicate detail requests for
                // the same event are suppressed.

                return requestStatus !== LOADING;
            },
        }
    );


// =========================================================
// REDUX SLICE
// =========================================================

const eventsSlice = createSlice({
    name: "events",

    initialState: createInitialState(),

    reducers: {
        // ================================================
        // CLEAR EVENTS LIST ERROR
        // ================================================

        clearEventsError(state) {
            state.listError = null;

            if (state.listStatus === FAILED) {
                state.listStatus =
                    state.listFetchedAt !== null
                        ? SUCCEEDED
                        : IDLE;
            }
        },

        // ================================================
        // CLEAR EVENT DETAIL ERROR
        // ================================================

        clearEventDetailError(
            state,
            action
        ) {
            const slug =
                getSlugFromArg(
                    action.payload
                );

            if (!isValidSlug(slug)) {
                return;
            }

            delete state.detailErrorBySlug[slug];

            if (
                state.detailStatusBySlug[slug] ===
                FAILED
            ) {
                state.detailStatusBySlug[slug] =
                    state.detailsBySlug[slug]
                        ? SUCCEEDED
                        : IDLE;
            }
        },

        // ================================================
        // INVALIDATE EVENTS LIST
        // ================================================
        //
        // Mark the list as needing a refresh.
        //
        // Previously loaded events remain
        // visible until the new GET completes.
        //
        // Existing in-flight responses are
        // invalidated using request identity.
        //
        // ================================================

        invalidateEventsList(state) {
            state.listStatus = IDLE;

            state.listError = null;

            state.listFetchedAt = null;

            state.listRequestId = null;
        },

        // ================================================
        // INVALIDATE ONE EVENT DETAIL
        // ================================================

        invalidateEventDetail(
            state,
            action
        ) {
            const slug =
                getSlugFromArg(
                    action.payload
                );

            if (!isValidSlug(slug)) {
                return;
            }

            delete state.detailsBySlug[slug];

            delete state.detailErrorBySlug[slug];

            delete state.detailFetchedAtBySlug[slug];

            delete state.detailRequestIdBySlug[slug];

            state.detailStatusBySlug[slug] =
                IDLE;
        },

        // ================================================
        // RESET PUBLIC EVENTS STATE
        // ================================================

        resetEvents() {
            return createInitialState();
        },
    },

    extraReducers: (builder) => {
        // ================================================
        // EVENTS LIST — PENDING
        // ================================================

        builder.addCase(
            fetchPublicEvents.pending,
            (state, action) => {
                state.listStatus = LOADING;

                state.listError = null;

                state.listRequestId =
                    action.meta.requestId;
            }
        );

        // ================================================
        // EVENTS LIST — FULFILLED
        // ================================================

        builder.addCase(
            fetchPublicEvents.fulfilled,
            (state, action) => {
                // Ignore an obsolete response.

                if (
                    state.listRequestId !==
                    action.meta.requestId
                ) {
                    return;
                }

                const {
                    items,
                    count,
                    next,
                    previous,
                    fetchedAt,
                } = action.payload;

                // Replace the currently displayed
                // backend page atomically.

                state.items = items;

                state.count = count;

                state.next = next;

                state.previous = previous;

                state.listFetchedAt =
                    fetchedAt;

                state.listStatus =
                    SUCCEEDED;

                state.listError = null;

                state.listRequestId = null;
            }
        );

        // ================================================
        // EVENTS LIST — REJECTED
        // ================================================

        builder.addCase(
            fetchPublicEvents.rejected,
            (state, action) => {
                if (
                    state.listRequestId !==
                    action.meta.requestId
                ) {
                    return;
                }

                state.listRequestId = null;

                // Canceled requests should not
                // erase previously loaded events.

                if (isCanceledRequest(action)) {
                    state.listStatus =
                        state.listFetchedAt !== null
                            ? SUCCEEDED
                            : IDLE;

                    state.listError = null;

                    return;
                }

                state.listStatus = FAILED;

                state.listError =
                    getRequestError(action);

                // Keep existing list data so UI
                // can show previously loaded events
                // alongside a refresh error.
            }
        );

        // ================================================
        // EVENT DETAIL — PENDING
        // ================================================

        builder.addCase(
            fetchEventDetail.pending,
            (state, action) => {
                const slug =
                    getSlugFromArg(
                        action.meta.arg
                    );

                if (!isValidSlug(slug)) {
                    return;
                }

                state.detailStatusBySlug[slug] =
                    LOADING;

                state.detailErrorBySlug[slug] =
                    null;

                state.detailRequestIdBySlug[slug] =
                    action.meta.requestId;
            }
        );

        // ================================================
        // EVENT DETAIL — FULFILLED
        // ================================================

        builder.addCase(
            fetchEventDetail.fulfilled,
            (state, action) => {
                const {
                    slug,
                    event,
                    fetchedAt,
                } = action.payload;

                // A newer request may already
                // have replaced this one.

                if (
                    state.detailRequestIdBySlug[slug] !==
                    action.meta.requestId
                ) {
                    return;
                }

                state.detailsBySlug[slug] =
                    event;

                state.detailStatusBySlug[slug] =
                    SUCCEEDED;

                state.detailErrorBySlug[slug] =
                    null;

                state.detailFetchedAtBySlug[slug] =
                    fetchedAt;

                delete state.detailRequestIdBySlug[
                    slug
                ];
            }
        );

        // ================================================
        // EVENT DETAIL — REJECTED
        // ================================================

        builder.addCase(
            fetchEventDetail.rejected,
            (state, action) => {
                const slug =
                    getSlugFromArg(
                        action.meta.arg
                    );

                if (
                    !isValidSlug(slug) ||
                    state.detailRequestIdBySlug[slug] !==
                        action.meta.requestId
                ) {
                    return;
                }

                delete state.detailRequestIdBySlug[
                    slug
                ];

                if (isCanceledRequest(action)) {
                    state.detailStatusBySlug[slug] =
                        state.detailsBySlug[slug]
                            ? SUCCEEDED
                            : IDLE;

                    state.detailErrorBySlug[slug] =
                        null;

                    return;
                }

                state.detailStatusBySlug[slug] =
                    FAILED;

                state.detailErrorBySlug[slug] =
                    getRequestError(action);

                // Preserve previously loaded
                // detail data if a refresh fails.
            }
        );
    },
});


// =========================================================
// ACTION EXPORTS
// =========================================================

export const {
    clearEventsError,
    clearEventDetailError,
    invalidateEventsList,
    invalidateEventDetail,
    resetEvents,
} = eventsSlice.actions;


// =========================================================
// SELECTORS — ROOT
// =========================================================

export const selectEventsState = (state) =>
    state?.events ?? EMPTY_STATE;


// =========================================================
// SELECTORS — LIST
// =========================================================

export const selectPublicEvents = (state) =>
    selectEventsState(state).items ??
    EMPTY_EVENTS;

export const selectEventsLoading = (state) =>
    selectEventsState(state).listStatus ===
    LOADING;

export const selectEventsError = (state) =>
    selectEventsState(state).listError ??
    null;

export const selectEventsCount = (state) =>
    selectEventsState(state).count ??
    0;

export const selectEventsListStatus = (
    state
) =>
    selectEventsState(state).listStatus ??
    IDLE;

export const selectEventsFetchedAt = (
    state
) =>
    selectEventsState(state).listFetchedAt ??
    null;


// =========================================================
// SELECTORS — PAGINATION
// =========================================================

export const selectEventsNextPage = (
    state
) =>
    selectEventsState(state).next ??
    null;

export const selectEventsPreviousPage = (
    state
) =>
    selectEventsState(state).previous ??
    null;


// =========================================================
// SELECTORS — EVENT DETAIL
// =========================================================

export const selectEventBySlug = (
    state,
    slug
) =>
    selectEventsState(state)
        .detailsBySlug?.[slug] ??
    null;

export const selectEventDetailStatus = (
    state,
    slug
) =>
    selectEventsState(state)
        .detailStatusBySlug?.[slug] ??
    IDLE;

export const selectEventDetailError = (
    state,
    slug
) =>
    selectEventsState(state)
        .detailErrorBySlug?.[slug] ??
    null;

export const selectEventDetailFetchedAt = (
    state,
    slug
) =>
    selectEventsState(state)
        .detailFetchedAtBySlug?.[slug] ??
    null;


// =========================================================
// DEFAULT REDUCER
// =========================================================

export default eventsSlice.reducer;
