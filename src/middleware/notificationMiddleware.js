// src/middleware/notificationMiddleware.js

import {
    wsConnected,
    wsDisconnected,

    setNotifications,
    addNotification,

    setLoading,
    clearNotifications,

    markNotificationAsReadLocally,
    markAllNotificationsAsReadLocally,
} from "../features/notificationSlice";

import {
    WS_URL,
} from "../services/config";

// =========================================================
// ACTION TYPES
// =========================================================

const CONNECT_WS =
    "notifications/connectWebSocket";

const DISCONNECT_WS =
    "notifications/disconnectWebSocket";

const MARK_ONE =
    "notifications/markNotificationAsRead";

const MARK_ALL =
    "notifications/markAllNotificationsAsRead";

// =========================================================
// ACTION CREATORS
// =========================================================

export const connectWebSocket = () => ({
    type: CONNECT_WS,
});

export const disconnectWebSocket = (
    shouldClear = false
) => ({
    type: DISCONNECT_WS,

    payload: {
        shouldClear,
    },
});

export const markNotificationAsRead = (
    id
) => ({
    type: MARK_ONE,

    payload: {
        notification_id: id,
    },
});

export const markAllNotificationsAsRead = () => ({
    type: MARK_ALL,
});

// =========================================================
// CONSTANTS AND HELPERS
// =========================================================

const MAX_RECONNECT_ATTEMPTS = 8;

const idFrom = (value) =>
    value?.id ??
    value?.notification_id ??
    value?.pk;

// =========================================================
// WEBSOCKET URL
// =========================================================

const getWebSocketUrl = () => {
    if (WS_URL) {
        return WS_URL;
    }

    const protocol =
        window.location.protocol === "https:"
            ? "wss"
            : "ws";

    const local = [
        "localhost",
        "127.0.0.1",
    ].includes(
        window.location.hostname
    );

    const host = local
        ? "localhost:8000"
        : window.location.host;

    return (
        `${protocol}://${host}/ws/notifications/`
    );
};

// =========================================================
// SAFE JSON PARSER
// =========================================================

const safeJsonParse = (raw) => {
    try {
        return JSON.parse(raw);
    } catch (error) {
        console.warn(
            "Notification WebSocket: invalid JSON",
            error
        );

        return null;
    }
};

// =========================================================
// NORMALIZE NOTIFICATION
//
// Preserve all backend fields.
// =========================================================

const normalizeNotification = (payload) => {
    if (
        !payload ||
        typeof payload !== "object"
    ) {
        return null;
    }

    const raw =
        payload.notification_data ??
        payload.notification ??
        payload.data ??
        payload;

    if (
        !raw ||
        typeof raw !== "object" ||
        !idFrom(raw)
    ) {
        return null;
    }

    return {
        ...raw,

        id: idFrom(raw),

        sender:
            raw.sender ?? null,

        recipient:
            raw.recipient ?? null,

        content_type:
            raw.content_type ??
            raw.notification_type ??
            raw.type ??
            "info",

        object_id:
            raw.object_id ?? null,

        message:
            raw.message ??
            raw.text ??
            raw.body ??
            "",

        created_at:
            raw.created_at ??
            new Date().toISOString(),

        is_read:
            Boolean(raw.is_read),
    };
};

const normalizeNotifications = (values) => {
    return (
        Array.isArray(values)
            ? values
            : []
    )
        .map(normalizeNotification)
        .filter(Boolean);
};

// =========================================================
// NOTIFICATION MIDDLEWARE
// =========================================================

const notificationMiddleware = (store) => {
    let websocket = null;

    let reconnectTimer = null;

    let reconnectAttempts = 0;

    let manuallyClosed = false;

    // =====================================================
    // AUTH STATUS
    // =====================================================

    const isLoggedIn = () => {
        return Boolean(
            store.getState().auth?.isLoggedIn
        );
    };

    // =====================================================
    // SOCKET STATUS
    // =====================================================

    const isOpen = (socket) => {
        return (
            socket?.readyState === WebSocket.OPEN
        );
    };

    const isConnecting = (socket) => {
        return (
            socket?.readyState ===
            WebSocket.CONNECTING
        );
    };

    // =====================================================
    // CANCEL RECONNECT
    // =====================================================

    const cancelReconnect = () => {
        if (reconnectTimer !== null) {
            clearTimeout(reconnectTimer);

            reconnectTimer = null;
        }
    };

    // =====================================================
    // CLOSE CURRENT SOCKET
    //
    // Prevent stale socket callbacks.
    // =====================================================

    const closeCurrentSocket = (
        shouldClear = false
    ) => {
        manuallyClosed = true;

        cancelReconnect();

        const oldSocket = websocket;

        // Invalidate callbacks BEFORE closing.
        websocket = null;

        reconnectAttempts = 0;

        if (
            oldSocket &&
            [
                WebSocket.OPEN,
                WebSocket.CONNECTING,
            ].includes(oldSocket.readyState)
        ) {
            try {
                oldSocket.close(
                    1000,
                    "Client manually disconnected."
                );
            } catch (_) {
                // Browser might have closed it.
            }
        }

        if (shouldClear) {
            store.dispatch(
                clearNotifications()
            );
        }

        store.dispatch(
            wsDisconnected(null)
        );
    };

    // =====================================================
    // SEND WEBSOCKET MESSAGE
    // =====================================================

    const send = (message) => {
        if (!isOpen(websocket)) {
            return false;
        }

        try {
            websocket.send(
                JSON.stringify(message)
            );

            return true;
        } catch (error) {
            console.warn(
                "Notification WebSocket send failed",
                error
            );

            return false;
        }
    };

    // =====================================================
    // REQUEST NOTIFICATION LIST
    //
    // Used for synchronization after failed actions.
    //
    // Django already sends initial_notifications
    // when the socket connects.
    // =====================================================

    const requestList = () => {
        return send({
            command:
                "fetch_unread_notifications",

            action:
                "fetch_unread_notifications",
        });
    };

    // =====================================================
    // SCHEDULE RECONNECT
    // =====================================================

    const scheduleReconnect = () => {
        cancelReconnect();

        if (
            manuallyClosed ||
            !isLoggedIn()
        ) {
            return;
        }

        if (
            reconnectAttempts >=
            MAX_RECONNECT_ATTEMPTS
        ) {
            return;
        }

        reconnectAttempts += 1;

        const delay = Math.min(
            reconnectAttempts * 3000,
            15000
        );

        reconnectTimer = setTimeout(
            () => {
                reconnectTimer = null;

                connectInternal();
            },
            delay
        );
    };

    // =====================================================
    // HANDLE INCOMING MESSAGE
    // =====================================================

    const handleMessage = (message) => {
        const kind = message?.type;

        const command = message?.command;

        const action = message?.action;

        // =================================================
        // INITIAL NOTIFICATIONS
        // =================================================

        if (
            kind === "initial_notifications" ||
            kind === "unread_notifications" ||
            command === "unread_notifications"
        ) {
            store.dispatch(
                setNotifications(
                    normalizeNotifications(
                        message.notifications
                    )
                )
            );

            return;
        }

        // =================================================
        // READ STATUS UPDATE
        //
        // Django broadcasts these events to all
        // connected sessions of the same user.
        // =================================================

        if (kind === "read_status_update") {
            if (
                message.mark_all &&
                message.is_read
            ) {
                store.dispatch(
                    markAllNotificationsAsReadLocally()
                );
            } else if (
                message.is_read &&
                message.notification_id != null
            ) {
                store.dispatch(
                    markNotificationAsReadLocally(
                        message.notification_id
                    )
                );
            }

            return;
        }

        // =================================================
        // MARK ONE — SERVER RESPONSE
        // =================================================

        if (
            kind === "notification_marked_as_read" ||
            kind === "mark_as_read_success" ||
            command === "mark_as_read_success" ||
            action === "mark_as_read_response" ||
            (
                command === "mark_as_read" &&
                message.status === "success"
            )
        ) {
            if (message.success === false) {
                // Restore server truth when
                // optimistic marking failed.
                requestList();
            } else {
                const id =
                    message.notification_id ??
                    message.id ??
                    message.notification?.id ??
                    message.data?.id;

                if (id != null) {
                    store.dispatch(
                        markNotificationAsReadLocally(
                            id
                        )
                    );
                }
            }

            return;
        }

        // =================================================
        // MARK ALL — SERVER RESPONSE
        // =================================================

        if (
            kind ===
                "all_notifications_marked_as_read" ||
            kind === "mark_all_as_read_success" ||
            command === "mark_all_as_read_success" ||
            action === "mark_all_as_read_response" ||
            (
                command === "mark_all_as_read" &&
                message.status === "success"
            )
        ) {
            if (message.success === false) {
                requestList();
            } else {
                store.dispatch(
                    markAllNotificationsAsReadLocally()
                );
            }

            return;
        }

        // =================================================
        // NEW REAL-TIME NOTIFICATION
        // =================================================

        if (
            kind === "new_notification" ||
            message.notification_data ||
            message.notification
        ) {
            const normalized =
                normalizeNotification(message);

            if (normalized) {
                store.dispatch(
                    addNotification(normalized)
                );
            }

            return;
        }

        // =================================================
        // LEGACY FLAT NOTIFICATION
        // =================================================

        if (
            message.content_type &&
            idFrom(message)
        ) {
            const normalized =
                normalizeNotification(message);

            if (normalized) {
                store.dispatch(
                    addNotification(normalized)
                );
            }
        }
    };

    // =====================================================
    // CONNECT INTERNAL
    // =====================================================

    function connectInternal() {
        if (!isLoggedIn()) {
            return;
        }

        if (
            isOpen(websocket) ||
            isConnecting(websocket)
        ) {
            return;
        }

        manuallyClosed = false;

        cancelReconnect();

        store.dispatch(
            setLoading(true)
        );

        let socket;

        try {
            socket = new WebSocket(
                getWebSocketUrl()
            );
        } catch (error) {
            store.dispatch(
                wsDisconnected(
                    "WebSocket ulanishini yaratib bo‘lmadi."
                )
            );

            scheduleReconnect();

            return;
        }

        websocket = socket;

        // Events belonging to older sockets must
        // never update the current connection.

        const isCurrent = () => {
            return websocket === socket;
        };

        let socketHadError = false;

        // =================================================
        // ON OPEN
        // =================================================

        socket.onopen = () => {
            if (!isCurrent()) {
                return;
            }

            reconnectAttempts = 0;

            cancelReconnect();

            store.dispatch(
                wsConnected()
            );

            // Backend sends initial_notifications
            // automatically on connect.
            //
            // Don't request the same list twice.
        };

        // =================================================
        // ON MESSAGE
        // =================================================

        socket.onmessage = (event) => {
            if (!isCurrent()) {
                return;
            }

            const message = safeJsonParse(
                event.data
            );

            if (
                message &&
                typeof message === "object"
            ) {
                handleMessage(message);
            }
        };

        // =================================================
        // ON ERROR
        // =================================================

        socket.onerror = () => {
            if (!isCurrent()) {
                return;
            }

            socketHadError = true;

            store.dispatch(
                wsDisconnected(
                    "WebSocket ulanishida xatolik yuz berdi."
                )
            );

            try {
                socket.close();
            } catch (_) {
                // Socket may already be closing.
            }
        };

        // =================================================
        // ON CLOSE
        // =================================================

        socket.onclose = (event) => {
            if (!isCurrent()) {
                // Old socket closed after a new
                // connection was already created.
                return;
            }

            websocket = null;

            store.dispatch(
                wsDisconnected(
                    event.reason ||
                    `Disconnected: ${event.code}`
                )
            );

            const normalClose = [
                1000,
                1001,
                4000,
                4003,
            ].includes(event.code);

            if (
                !manuallyClosed &&
                (
                    socketHadError ||
                    !normalClose
                )
            ) {
                scheduleReconnect();
            }
        };
    }

    // =====================================================
    // REDUX MIDDLEWARE HANDLER
    // =====================================================

    return (next) => (action) => {
        switch (action.type) {
            // =============================================
            // CONNECT WEBSOCKET
            // =============================================

            case CONNECT_WS: {
                connectInternal();

                break;
            }

            // =============================================
            // DISCONNECT WEBSOCKET
            // =============================================

            case DISCONNECT_WS: {
                closeCurrentSocket(
                    Boolean(
                        action.payload?.shouldClear
                    )
                );

                break;
            }

            // =============================================
            // AUTH LOGOUT
            //
            // Clear the previous account's
            // notifications immediately.
            // =============================================

            case "auth/logoutUser": {
                closeCurrentSocket(true);

                break;
            }

            // =============================================
            // MARK ONE AS READ
            // =============================================

            case MARK_ONE: {
                const id =
                    action.payload?.notification_id;

                if (id == null) {
                    break;
                }

                const sent = send({
                    command: "mark_as_read",

                    action: "mark_as_read",

                    notification_id: id,
                });

                if (sent) {
                    // Preserve optimistic UI behavior.
                    store.dispatch(
                        markNotificationAsReadLocally(
                            id
                        )
                    );
                }

                break;
            }

            // =============================================
            // MARK ALL AS READ
            // =============================================

            case MARK_ALL: {
                const sent = send({
                    command: "mark_all_as_read",

                    action: "mark_all_as_read",
                });

                if (sent) {
                    store.dispatch(
                        markAllNotificationsAsReadLocally()
                    );
                }

                break;
            }

            // =============================================
            // OTHER ACTIONS
            // =============================================

            default:
                break;
        }

        return next(action);
    };
};

// =========================================================
// EXPORT
// =========================================================

export default notificationMiddleware;