// src/features/notificationSlice.js

import { createSlice } from "@reduxjs/toolkit";

// =========================================================
// INITIAL STATE
// =========================================================

const initialState = {
    notifications: [],
    wsConnected: false,
    totalUnreadCount: 0,
    wsError: null,
    loading: false,
    hasLoaded: false,
};

// =========================================================
// HELPERS
// =========================================================

const normalizeId = (value) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    const id = Number(value);

    return Number.isSafeInteger(id) && id > 0
        ? id
        : null;
};

const normalizeNotification = (value) => {
    if (
        !value ||
        typeof value !== "object" ||
        Array.isArray(value)
    ) {
        return null;
    }

    const id = normalizeId(
        value.id ??
        value.notification_id ??
        value.pk
    );

    if (id === null) {
        return null;
    }

    // Preserve ALL additional backend fields.
    //
    // Including:
    // - metadata
    // - offered_coins
    // - deadline
    // - problem_id
    // - problem_title
    //
    // These fields must not disappear.

    return {
        ...value,

        id,

        sender: value.sender ?? null,

        recipient: value.recipient ?? null,

        content_type:
            value.content_type ??
            value.notification_type ??
            value.type ??
            "info",

        object_id:
            value.object_id ?? null,

        message:
            value.message ??
            value.text ??
            value.body ??
            "",

        created_at:
            value.created_at ??
            new Date().toISOString(),

        is_read: Boolean(value.is_read),
    };
};

const countUnread = (items) => {
    return items.reduce(
        (total, item) =>
            total + (item.is_read ? 0 : 1),
        0
    );
};

const byNewest = (left, right) => {
    const a = Date.parse(left.created_at) || 0;
    const b = Date.parse(right.created_at) || 0;

    return b - a || right.id - left.id;
};

// =========================================================
// NOTIFICATION SLICE
// =========================================================

const notificationSlice = createSlice({
    name: "notifications",

    initialState,

    reducers: {
        // =================================================
        // WEBSOCKET CONNECTED
        // =================================================

        wsConnected: (state) => {
            state.wsConnected = true;
            state.wsError = null;

            // Socket OPEN does not mean that
            // the initial notification list arrived.
        },

        // =================================================
        // WEBSOCKET DISCONNECTED
        // =================================================

        wsDisconnected: (state, action) => {
            state.wsConnected = false;

            state.wsError =
                action.payload || null;

            state.loading = false;

            // Keep existing notifications.
            // Temporary connection failures must
            // not erase the user's history.
        },

        // =================================================
        // SET INITIAL NOTIFICATIONS
        // =================================================

        setNotifications: (state, action) => {
            const raw = Array.isArray(action.payload)
                ? action.payload
                : [];

            const unique = new Map();

            raw.forEach((item) => {
                const normalized =
                    normalizeNotification(item);

                if (normalized) {
                    unique.set(
                        normalized.id,
                        normalized
                    );
                }
            });

            state.notifications = [
                ...unique.values(),
            ].sort(byNewest);

            state.totalUnreadCount =
                countUnread(state.notifications);

            state.loading = false;

            // A valid empty response also counts
            // as a completed initial load.
            state.hasLoaded = true;

            state.wsError = null;
        },

        // =================================================
        // ADD REAL-TIME NOTIFICATION
        // =================================================

        addNotification: (state, action) => {
            const incoming =
                normalizeNotification(
                    action.payload
                );

            if (!incoming) {
                return;
            }

            const index =
                state.notifications.findIndex(
                    (item) =>
                        item.id === incoming.id
                );

            if (index >= 0) {
                // Preserve existing properties
                // while updating changed fields.

                state.notifications[index] = {
                    ...state.notifications[index],
                    ...incoming,
                };
            } else {
                state.notifications.unshift(
                    incoming
                );
            }

            state.notifications.sort(byNewest);

            state.totalUnreadCount =
                countUnread(state.notifications);

            // A real-time event isn't proof that
            // the complete initial list arrived.
        },

        // =================================================
        // MARK ONE AS READ LOCALLY
        // =================================================

        markNotificationAsReadLocally: (
            state,
            action
        ) => {
            const id = normalizeId(
                action.payload
            );

            if (id === null) {
                return;
            }

            const item =
                state.notifications.find(
                    (entry) =>
                        entry.id === id
                );

            if (item) {
                item.is_read = true;
            }

            state.totalUnreadCount =
                countUnread(state.notifications);
        },

        // =================================================
        // MARK ALL AS READ LOCALLY
        // =================================================

        markAllNotificationsAsReadLocally: (
            state
        ) => {
            state.notifications.forEach(
                (item) => {
                    item.is_read = true;
                }
            );

            state.totalUnreadCount = 0;
        },

        // =================================================
        // SET UNREAD COUNT
        // =================================================

        setTotalUnreadCount: (
            state,
            action
        ) => {
            const count = Number(
                action.payload
            );

            state.totalUnreadCount =
                Number.isFinite(count)
                    ? Math.max(
                        0,
                        Math.trunc(count)
                    )
                    : 0;
        },

        // =================================================
        // CLEAR NOTIFICATIONS
        //
        // Used on logout and account changes.
        // =================================================

        clearNotifications: (state) => {
            state.notifications = [];

            state.wsConnected = false;

            state.totalUnreadCount = 0;

            state.wsError = null;

            state.loading = false;

            state.hasLoaded = false;
        },

        // =================================================
        // SET LOADING
        // =================================================

        setLoading: (
            state,
            action
        ) => {
            state.loading = Boolean(
                action.payload
            );
        },
    },
});

// =========================================================
// ACTION EXPORTS
//
// All existing names preserved.
// =========================================================

export const {
    wsConnected,
    wsDisconnected,

    setNotifications,
    addNotification,

    markNotificationAsReadLocally,
    markAllNotificationsAsReadLocally,

    setTotalUnreadCount,

    clearNotifications,
    setLoading,
} = notificationSlice.actions;

// =========================================================
// REDUCER EXPORT
// =========================================================

export default notificationSlice.reducer;