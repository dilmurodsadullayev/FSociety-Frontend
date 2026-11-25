
// src/services/events/eventsApi.js

import api from "../api";

// =========================================================
// FSOCIETY — EVENTS API SERVICE
// =========================================================
//
// Responsibilities:
// - Public events list
// - Public event detail
// - Shared URL resolution
// - Response normalization
// - Error normalization
// - AbortController support
//
// Uses the existing Axios default export.
//
// Authentication, JWT refresh, cookies and
// CSRF are managed by src/services/api.js.
//
// =========================================================


// =========================================================
// CONSTANTS
// =========================================================

const EVENT_SLUG_PATTERN = /^[a-zA-Z0-9_-]+$/;

const API_PREFIX_PATTERN =
    /(?:^|\/)api(?:\/v\d+)?$/i;

const ERROR_MESSAGES = Object.freeze({
    400: "So‘rov ma'lumotlari noto‘g‘ri.",
    401: "Tizimga qayta kirish talab qilinadi.",
    403: "Bu amal uchun ruxsat yo‘q.",
    404: "Tadbir topilmadi.",
    405: "Bu HTTP usuliga ruxsat berilmagan.",
    409: "So‘rovda ziddiyat yuz berdi.",
    429: "Juda ko‘p so‘rov yuborildi.",
    500: "Serverda xatolik yuz berdi.",
    502: "Server vaqtincha ishlamayapti.",
    503: "Xizmat vaqtincha mavjud emas.",
    504: "Server javob berishga ulgurmagan.",
});


// =========================================================
// AXIOS CLIENT VALIDATION
// =========================================================

export const getEventsApiClient = () => {
    if (
        !api ||
        typeof api.get !== "function" ||
        typeof api.post !== "function"
    ) {
        throw new Error(
            "FSociety Axios client noto‘g‘ri sozlangan."
        );
    }

    return api;
};


// =========================================================
// API BASE PATH
// =========================================================
//
// Example 1:
//
// Axios baseURL:
// https://backend.example.com/api
//
// Request path:
// events/
//
// Final URL:
// https://backend.example.com/api/events/
//
// Example 2:
//
// Axios baseURL:
// https://backend.example.com
//
// Request path:
// api/events/
//
// Final URL:
// https://backend.example.com/api/events/
//
// =========================================================

export const getEventsBasePath = () => {
    const client = getEventsApiClient();

    const baseURL = String(
        client.defaults?.baseURL ?? ""
    )
        .trim()
        .split(/[?#]/)[0]
        .replace(/\/+$/, "");

    const hasApiPrefix =
        API_PREFIX_PATTERN.test(baseURL);

    return hasApiPrefix
        ? "events/"
        : "api/events/";
};


// =========================================================
// EVENT SLUG VALIDATION
// =========================================================
//
// Prevent:
// - Empty slugs
// - Invalid URL path segments
// - Path traversal
// - Unexpected characters
//
// =========================================================

export const normalizeEventSlug = (slug) => {
    if (typeof slug !== "string") {
        throw new TypeError(
            "Event slug matn bo‘lishi kerak."
        );
    }

    const normalized = slug.trim();

    if (
        !normalized ||
        !EVENT_SLUG_PATTERN.test(normalized)
    ) {
        throw new TypeError(
            "Event slug formati noto‘g‘ri."
        );
    }

    return normalized;
};


// =========================================================
// EVENT DETAIL PATH
// =========================================================

export const getEventDetailPath = (slug) => {
    const validSlug = normalizeEventSlug(slug);

    return (
        getEventsBasePath() +
        encodeURIComponent(validSlug) +
        "/"
    );
};


// =========================================================
// AXIOS RESPONSE UNWRAPPING
// =========================================================
//
// Standard Axios:
//
// {
//     data: {...},
//     status: 200,
//     headers: {...},
//     config: {...}
// }
//
// Some custom response interceptors already
// return the response.data payload.
//
// Avoid unwrapping ordinary business objects
// that happen to have a "data" field.
//
// =========================================================

export const unwrapEventsResponse = (response) => {
    if (
        response === null ||
        typeof response !== "object" ||
        Array.isArray(response)
    ) {
        return response;
    }

    const isAxiosResponse =
        Object.prototype.hasOwnProperty.call(
            response,
            "data"
        ) &&
        (
            typeof response.status === "number" ||
            Boolean(response.config)
        );

    return isAxiosResponse
        ? response.data
        : response;
};


// =========================================================
// RESPONSE ASSERTION
// =========================================================

export const assertEventsObject = (
    payload,
    operation = "request"
) => {
    if (
        payload === null ||
        typeof payload !== "object" ||
        Array.isArray(payload)
    ) {
        throw new TypeError(
            `Events ${operation}: ` +
            "backend noto‘g‘ri javob qaytardi."
        );
    }

    return payload;
};


// =========================================================
// GET PUBLIC EVENTS
// =========================================================
//
// GET /api/events/
//
// Accepts backend-supported query parameters.
//
// The service returns the original payload.
// Redux can normalize it separately.
//
// =========================================================

export const getPublicEvents = async (
    {
        params,
        signal,
    } = {}
) => {
    const client = getEventsApiClient();

    const response = await client.get(
        getEventsBasePath(),
        {
            ...(params ? { params } : {}),
            ...(signal ? { signal } : {}),
        }
    );

    return unwrapEventsResponse(response);
};


// =========================================================
// GET PUBLIC EVENT DETAIL
// =========================================================
//
// GET /api/events/{slug}/
//
// =========================================================

export const getPublicEventDetail = async (
    slug,
    {
        signal,
    } = {}
) => {
    const client = getEventsApiClient();

    const response = await client.get(
        getEventDetailPath(slug),
        {
            ...(signal ? { signal } : {}),
        }
    );

    return unwrapEventsResponse(response);
};


// =========================================================
// NORMALIZE EVENTS LIST
// =========================================================
//
// Supported response formats:
//
// 1. [...]
//
// 2. {
//      count: 10,
//      next: null,
//      previous: null,
//      results: [...]
//    }
//
// 3. {
//      events: [...]
//    }
//
// 4. {
//      data: [...]
//    }
//
// 5. {
//      data: {
//          results: [...]
//      }
//    }
//
// Unexpected formats are rejected instead
// of silently being interpreted as [].
//
// =========================================================

export const normalizeEventsResponse = (
    payload
) => {
    if (Array.isArray(payload)) {
        return {
            items: payload,
            count: payload.length,
            next: null,
            previous: null,
        };
    }

    const root = assertEventsObject(
        payload,
        "list"
    );

    const source =
        root.data &&
        typeof root.data === "object" &&
        !Array.isArray(root.data)
            ? root.data
            : root;

    const items = Array.isArray(source.results)
        ? source.results
        : Array.isArray(source.events)
          ? source.events
          : Array.isArray(source.data)
            ? source.data
            : null;

    if (!items) {
        throw new TypeError(
            "Events API ro‘yxati javobda topilmadi."
        );
    }

    const parsedCount = Number(source.count);

    const count =
        source.count != null &&
        Number.isSafeInteger(parsedCount) &&
        parsedCount >= 0
            ? parsedCount
            : items.length;

    return {
        items,
        count,
        next: source.next ?? null,
        previous: source.previous ?? null,
    };
};


// =========================================================
// NORMALIZE EVENT DETAIL
// =========================================================
//
// Supported:
//
// { id, slug, name, ... }
//
// { event: {...} }
//
// { data: {...} }
//
// { data: { event: {...} } }
//
// =========================================================

export const normalizeEventDetailResponse = (
    payload
) => {
    const root = assertEventsObject(
        payload,
        "detail"
    );

    const nested =
        root.data &&
        typeof root.data === "object" &&
        !Array.isArray(root.data)
            ? root.data
            : root;

    const event = nested.event ?? nested;

    if (
        !event ||
        typeof event !== "object" ||
        Array.isArray(event) ||
        (
            event.id == null &&
            !event.slug
        )
    ) {
        throw new TypeError(
            "Event ma'lumotlari topilmadi."
        );
    }

    return event;
};


// =========================================================
// ERROR NORMALIZATION
// =========================================================
//
// Do not expose internal Django tracebacks,
// database errors or arbitrary exception text.
//
// Return serializable error information that
// Redux Toolkit can safely store.
//
// =========================================================

export const normalizeEventsApiError = (error) => {
    const isCanceled =
        error?.code === "ERR_CANCELED" ||
        error?.name === "CanceledError" ||
        error?.name === "AbortError";

    if (isCanceled) {
        return {
            status: null,
            code: "REQUEST_CANCELED",
            message: "So‘rov bekor qilindi.",
            canceled: true,
        };
    }

    const rawStatus =
        error?.response?.status;

    const status =
        Number.isInteger(rawStatus) &&
        rawStatus >= 100 &&
        rawStatus <= 599
            ? rawStatus
            : null;

    const responseData =
        error?.response?.data;

    const backendCode =
        typeof responseData?.code === "string" &&
        /^[A-Za-z0-9_-]{1,80}$/.test(
            responseData.code
        )
            ? responseData.code
            : null;

    const message =
        status === null
            ? "Internet aloqasini tekshiring."
            : ERROR_MESSAGES[status] ??
              "So‘rovni bajarib bo‘lmadi.";

    return {
        status,

        code:
            backendCode ??
            (
                status
                    ? `HTTP_${status}`
                    : "NETWORK_ERROR"
            ),

        message,

        canceled: false,
    };
};


// =========================================================
// DEFAULT SERVICE
// =========================================================

const eventsApi = {
    getPublicEvents,
    getPublicEventDetail,
};

export default eventsApi;
