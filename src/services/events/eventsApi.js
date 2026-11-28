
// src/services/events/eventsApi.js

import api from "../api";

// =========================================================
// FSOCIETY — EVENTS API
// =========================================================
//
// Django public API:
//
// GET /api/events/
// GET /api/events/{slug}/
//
// Backend:
//
// opens_at
// event_status
// timezone
//
// Existing frontend compatibility:
//
// gift_opens_at / starts_at
// status
// timezone_name
//
// Preserve original backend fields.
//
// Never invent dates, claim permissions,
// rewards or user ownership.
//
// =========================================================


// =========================================================
// CONSTANTS
// =========================================================

const EVENT_SLUG_PATTERN =
    /^[a-zA-Z0-9_-]+$/;

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
// HELPERS
// =========================================================

const isRecord = (value) =>
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value);

const firstNonEmptyString = (...values) =>
    values.find(
        (value) =>
            typeof value === "string" &&
            value.trim().length > 0
    ) ?? null;


// =========================================================
// AXIOS CLIENT
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
// baseURL ending with /api:
//   events/
//
// baseURL without /api:
//   api/events/
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

    return API_PREFIX_PATTERN.test(baseURL)
        ? "events/"
        : "api/events/";
};


// =========================================================
// EVENT SLUG VALIDATION
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

export const getEventDetailPath = (slug) =>
    getEventsBasePath() +
    encodeURIComponent(
        normalizeEventSlug(slug)
    ) +
    "/";


// =========================================================
// AXIOS RESPONSE UNWRAPPING
// =========================================================
//
// Keep ordinary business objects with a
// "data" property intact.
//
// =========================================================

export const unwrapEventsResponse = (response) => {
    if (!isRecord(response)) {
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
// RESPONSE VALIDATION
// =========================================================

export const assertEventsObject = (
    payload,
    operation = "request"
) => {
    if (!isRecord(payload)) {
        throw new TypeError(
            `Events ${operation}: ` +
            "backend noto‘g‘ri javob qaytardi."
        );
    }

    return payload;
};


// =========================================================
// NORMALIZE PUBLIC EVENT
// =========================================================
//
// Actual Django serializer:
//
// opens_at:
//   EventCampaign.seasonal_opens_at
//
// event_status:
//   Backend-calculated status
//
// timezone:
//   EventCampaign.timezone_name
//
// Existing UI components expect alternate
// field names.
//
// Add compatibility aliases without
// changing the original data.
//
// This function never calculates eligibility.
//
// =========================================================

export const normalizePublicEvent = (event) => {
    const source = assertEventsObject(
        event,
        "event"
    );

    // ================================================
    // OPENING TIME
    // ================================================

    const openingAt = firstNonEmptyString(
        source.opens_at,
        source.gift_opens_at,
        source.starts_at,
        source.start_at
    );

    // ================================================
    // EVENT STATUS
    // ================================================

    const eventStatus = firstNonEmptyString(
        source.event_status,
        source.status
    );

    // ================================================
    // TIMEZONE
    // ================================================

    const eventTimezone = firstNonEmptyString(
        source.timezone,
        source.timezone_name
    );

    // ================================================
    // PRESERVE AND NORMALIZE
    // ================================================

    return {
        ...source,

        // ============================================
        // ORIGINAL BACKEND ALIASES
        // ============================================

        ...(
            openingAt && !source.opens_at
                ? {
                    opens_at: openingAt,
                }
                : {}
        ),

        ...(
            eventStatus && !source.event_status
                ? {
                    event_status: eventStatus,
                }
                : {}
        ),

        ...(
            eventTimezone && !source.timezone
                ? {
                    timezone: eventTimezone,
                }
                : {}
        ),

        // ============================================
        // EXISTING FRONTEND COMPATIBILITY
        // ============================================

        ...(
            openingAt
                ? {
                    gift_opens_at: openingAt,
                    starts_at: source.starts_at || openingAt,
                }
                : {}
        ),

        ...(
            eventStatus
                ? {
                    status: eventStatus,
                }
                : {}
        ),

        ...(
            eventTimezone
                ? {
                    timezone_name: eventTimezone,
                }
                : {}
        ),
    };
};


// =========================================================
// GET PUBLIC EVENTS
// =========================================================
//
// GET /api/events/
//
// Axios authentication and cookie handling
// remain in src/services/api.js.
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
        signal ? { signal } : {}
    );

    return unwrapEventsResponse(response);
};


// =========================================================
// NORMALIZE EVENTS LIST
// =========================================================
//
// Supported formats:
//
// 1. [...]
//
// 2. DRF pagination:
// {
//     count,
//     next,
//     previous,
//     results
// }
//
// 3. { events: [...] }
//
// 4. { data: [...] }
//
// 5. { data: { results: [...] } }
//
// Invalid payloads are rejected.
//
// =========================================================

export const normalizeEventsResponse = (payload) => {
    if (Array.isArray(payload)) {
        return {
            items: payload.map(
                normalizePublicEvent
            ),

            count: payload.length,

            next: null,

            previous: null,
        };
    }

    const root = assertEventsObject(
        payload,
        "list"
    );

    const source = isRecord(root.data)
        ? root.data
        : root;

    const items = Array.isArray(
        source.results
    )
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

    // ================================================
    // COUNT
    // ================================================

    const countValue = Number(
        source.count
    );

    const count =
        source.count != null &&
        Number.isSafeInteger(countValue) &&
        countValue >= 0
            ? countValue
            : items.length;

    // ================================================
    // RESULT
    // ================================================

    return {
        items: items.map(
            normalizePublicEvent
        ),

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

export const normalizeEventDetailResponse = (payload) => {
    const root = assertEventsObject(
        payload,
        "detail"
    );

    const nested = isRecord(
        root.data
    )
        ? root.data
        : root;

    const event =
        nested.event ??
        nested;

    if (
        !isRecord(event) ||
        (
            event.id == null &&
            !event.slug
        )
    ) {
        throw new TypeError(
            "Event ma'lumotlari topilmadi."
        );
    }

    return normalizePublicEvent(
        event
    );
};


// =========================================================
// ERROR NORMALIZATION
// =========================================================
//
// Do not expose internal Django
// database errors or tracebacks.
//
// Errors must remain serializable
// for Redux Toolkit.
//
// =========================================================

export const normalizeEventsApiError = (error) => {
    const canceled =
        error?.code === "ERR_CANCELED" ||
        error?.name === "CanceledError" ||
        error?.name === "AbortError";

    // ================================================
    // CANCELED REQUEST
    // ================================================

    if (canceled) {
        return {
            status: null,
            code: "REQUEST_CANCELED",
            message: "So‘rov bekor qilindi.",
            canceled: true,
        };
    }

    // ================================================
    // HTTP STATUS
    // ================================================

    const rawStatus =
        error?.response?.status;

    const status =
        Number.isInteger(rawStatus) &&
        rawStatus >= 100 &&
        rawStatus <= 599
            ? rawStatus
            : null;

    // ================================================
    // SAFE BACKEND ERROR CODE
    // ================================================

    const backendCode =
        error?.response?.data?.code;

    const safeCode =
        typeof backendCode === "string" &&
        /^[A-Za-z0-9_-]{1,80}$/.test(
            backendCode
        )
            ? backendCode
            : null;

    // ================================================
    // RESULT
    // ================================================

    return {
        status,

        code:
            safeCode ??
            (
                status
                    ? `HTTP_${status}`
                    : "NETWORK_ERROR"
            ),

        message:
            status === null
                ? "Internet aloqasini tekshiring."
                : ERROR_MESSAGES[status] ??
                  "So‘rovni bajarib bo‘lmadi.",

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
