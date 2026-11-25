
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
// FSOCIETY — EVENTS REDUX SLICE
// =========================================================
//
// Manages PUBLIC event information only.
//
// Private Daily Gift and Seasonal Gift state
// will be implemented in separate slices.
//
// =========================================================


// =========================================================
// CONSTANTS
// =========================================================

export const EVENT_REQUEST_STATUS = Object.freeze({
    IDLE: "idle",
    LOADING: "loading",
    SUCCEEDED: "succeeded",
    FAILED: "failed",
});


// =========================================================
// INITIAL STATE
// =========================================================

const createInitialState = () => ({
    items: [],

    count: 0,
    next: null,
    previous: null,

    listStatus: EVENT_REQUEST_STATUS.IDLE,
    listError: null,
    listRequestId: null,
    listFetchedAt: null,

    detailsBySlug: {},
    detailStatusBySlug: {},
    detailErrorBySlug: {},
    detailRequestIdBySlug: {},
});


// =========================================================
// HELPERS
// =========================================================

const getEventSlug = (arg) => {
    return typeof arg === "string"
        ? arg
        : arg?.slug;
};

const isCanceledError = (action) => {
    return (
        action.meta?.aborted === true ||
        action.payload?.canceled === true ||
        action.error?.name === "AbortError"
    );
};


// =========================================================
// THUNK — FETCH PUBLIC EVENTS
// =========================================================

export const fetchPublicEvents = createAsyncThunk(
    "events/fetchPublicEvents",

    async (
        options = {},
        {
            signal,
            rejectWithValue,
        }
    ) => {
        try {
            const response = await getPublicEvents({
                params: options?.params,
                signal,
            });

            const normalized =
                normalizeEventsResponse(response);

            return {
                ...normalized,
                fetchedAt: Date.now(),
            };
        } catch (error) {
            return rejectWithValue(
                normalizeEventsApiError(error)
            );
        }
    },

    {
        condition: (
            _options,
            { getState }
        ) => {
            const eventsState =
                getState()?.events;

            return (
                eventsState?.listStatus !==
                EVENT_REQUEST_STATUS.LOADING
            );
        },
    }
);


// =========================================================
// THUNK — FETCH SINGLE EVENT
// =========================================================

export const fetchEventDetail = createAsyncThunk(
    "events/fetchEventDetail",

    async (
        arg,
        {
            signal,
            rejectWithValue,
        }
    ) => {
        try {
            const slug = normalizeEventSlug(
                getEventSlug(arg)
            );

            const response =
                await getPublicEventDetail(
                    slug,
                    { signal }
                );

            const event =
                normalizeEventDetailResponse(response);

            return {
                slug,
                event,
                fetchedAt: Date.now(),
            };
        } catch (error) {
            return rejectWithValue(
                normalizeEventsApiError(error)
            );
        }
    },

    {
        condition: (
            arg,
            { getState }
        ) => {
            const slug = getEventSlug(arg);

            if (
                typeof slug !== "string" ||
                !slug.trim()
            ) {
                return false;
            }

            const status =
                getState()?.events
                    ?.detailStatusBySlug?.[slug];

            return (
                status !==
                EVENT_REQUEST_STATUS.LOADING
            );
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
        // CLEAR LIST ERROR
        // ================================================

        clearEventsError(state) {
            state.listError = null;

            if (
                state.listStatus ===
                EVENT_REQUEST_STATUS.FAILED
            ) {
                state.listStatus =
                    EVENT_REQUEST_STATUS.IDLE;
            }
        },

        // ================================================
        // CLEAR DETAIL ERROR
        // ================================================

        clearEventDetailError(state, action) {
            const slug = action.payload;

            if (!slug) {
                return;
            }

            delete state.detailErrorBySlug[slug];

            if (
                state.detailStatusBySlug[slug] ===
                EVENT_REQUEST_STATUS.FAILED
            ) {
                state.detailStatusBySlug[slug] =
                    EVENT_REQUEST_STATUS.IDLE;
            }
        },

        // ================================================
        // RESET ALL PUBLIC EVENTS STATE
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
                state.listStatus =
                    EVENT_REQUEST_STATUS.LOADING;

                state.listError = null;

                state.listRequestId =
                    action.meta.requestId;
            }
        );

        // ================================================
        // EVENTS LIST — SUCCESS
        // ================================================

        builder.addCase(
            fetchPublicEvents.fulfilled,
            (state, action) => {
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

                state.items = items;
                state.count = count;
                state.next = next;
                state.previous = previous;

                state.listFetchedAt = fetchedAt;

                state.listStatus =
                    EVENT_REQUEST_STATUS.SUCCEEDED;

                state.listError = null;
                state.listRequestId = null;
            }
        );

        // ================================================
        // EVENTS LIST — FAILURE
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

                if (isCanceledError(action)) {
                    state.listStatus =
                        EVENT_REQUEST_STATUS.IDLE;

                    return;
                }

                state.listStatus =
                    EVENT_REQUEST_STATUS.FAILED;

                state.listError =
                    action.payload ?? {
                        status: null,
                        code: "REQUEST_FAILED",
                        message:
                            "Tadbirlarni yuklashda xatolik.",
                    };
            }
        );

        // ================================================
        // EVENT DETAIL — PENDING
        // ================================================

        builder.addCase(
            fetchEventDetail.pending,
            (state, action) => {
                const slug = getEventSlug(
                    action.meta.arg
                );

                if (!slug) {
                    return;
                }

                state.detailStatusBySlug[slug] =
                    EVENT_REQUEST_STATUS.LOADING;

                state.detailErrorBySlug[slug] = null;

                state.detailRequestIdBySlug[slug] =
                    action.meta.requestId;
            }
        );

        // ================================================
        // EVENT DETAIL — SUCCESS
        // ================================================

        builder.addCase(
            fetchEventDetail.fulfilled,
            (state, action) => {
                const {
                    slug,
                    event,
                } = action.payload;

                if (
                    state.detailRequestIdBySlug[slug] !==
                    action.meta.requestId
                ) {
                    return;
                }

                state.detailsBySlug[slug] = event;

                state.detailStatusBySlug[slug] =
                    EVENT_REQUEST_STATUS.SUCCEEDED;

                state.detailErrorBySlug[slug] = null;

                delete state.detailRequestIdBySlug[slug];
            }
        );

        // ================================================
        // EVENT DETAIL — FAILURE
        // ================================================

        builder.addCase(
            fetchEventDetail.rejected,
            (state, action) => {
                const slug = getEventSlug(
                    action.meta.arg
                );

                if (
                    !slug ||
                    state.detailRequestIdBySlug[slug] !==
                        action.meta.requestId
                ) {
                    return;
                }

                delete state.detailRequestIdBySlug[slug];

                if (isCanceledError(action)) {
                    state.detailStatusBySlug[slug] =
                        EVENT_REQUEST_STATUS.IDLE;

                    return;
                }

                state.detailStatusBySlug[slug] =
                    EVENT_REQUEST_STATUS.FAILED;

                state.detailErrorBySlug[slug] =
                    action.payload ?? {
                        status: null,
                        code: "REQUEST_FAILED",
                        message:
                            "Tadbir ma'lumotlari yuklanmadi.",
                    };
            }
        );
    },
});


// =========================================================
// ACTIONS
// =========================================================

export const {
    clearEventsError,
    clearEventDetailError,
    resetEvents,
} = eventsSlice.actions;


// =========================================================
// SELECTORS
// =========================================================

export const selectEventsState = (state) =>
    state.events;

export const selectPublicEvents = (state) =>
    state.events?.items ?? [];

export const selectEventsLoading = (state) =>
    state.events?.listStatus ===
    EVENT_REQUEST_STATUS.LOADING;

export const selectEventsError = (state) =>
    state.events?.listError ?? null;

export const selectEventsCount = (state) =>
    state.events?.count ?? 0;

export const selectEventBySlug = (
    state,
    slug
) =>
    state.events?.detailsBySlug?.[slug] ??
    null;

export const selectEventDetailStatus = (
    state,
    slug
) =>
    state.events?.detailStatusBySlug?.[slug] ??
    EVENT_REQUEST_STATUS.IDLE;

export const selectEventDetailError = (
    state,
    slug
) =>
    state.events?.detailErrorBySlug?.[slug] ??
    null;


// =========================================================
// REDUCER
// =========================================================

export default eventsSlice.reducer;
