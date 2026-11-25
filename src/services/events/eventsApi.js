
 // src/services/events/eventsApi.js

import * as apiModule from "../api";

// =========================================================
// FSOCIETY — EVENTS API SERVICE
// =========================================================
//
// Responsibilities:
// - Public event list
// - Public event detail
// - Axios client reuse
// - Request cancellation
// - API error normalization
//
// Does NOT manage:
// - Redux state
// - Authentication state
// - UI notifications
// - Gift claims
//
// =========================================================


// =========================================================
// HTTP CLIENT
// =========================================================

const getApiClient = () => {
    const candidates = [
        apiModule.default,
        apiModule.api,
        apiModule.apiClient,
        apiModule.axiosInstance,
        apiModule.instance,
    ];

    const client = candidates.find(
        (candidate) =>
            candidate &&
            typeof candidate.get === "function"
    );

    if (!client) {
        throw new Error(
            "FSociety API client topilmadi. " +
            "src/services/api.js eksportlarini tekshiring."
        );
    }

    return client;
};


// =========================================================
// API URL
// =========================================================
//
// Supported examples:
//
// baseURL: https://backend.example.com/api
// request: events/
//
// baseURL: https://backend.example.com
// request: api/events/
//
// Final path in both cases:
// /api/events/
//
// Actual backend contract must be verified.
// =========================================================

const getEventsBasePath = () => {
    const client = getApiClient();

    const baseURL = String(
        client.defaults?.baseURL ?? ""
    )
        .split(/[?#]/)[0]
        .replace(/\/+$/, "");

    const baseEndsWithApi =
        /(?:^|\/)api(?:\/v\d+)?$/i.test(baseURL);

    return baseEndsWithApi
        ? "events/"
        : "api/events/";
};


// =========================================================
// SLUG VALIDATION
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
        !/^[a-zA-Z0-9_-]+$/.test(normalized)
    ) {
        throw new TypeError(
            "Event slug formati noto‘g‘ri."
        );
    }

    return normalized;
};


// =========================================================
// AXIOS RESPONSE HANDLER
// =========================================================
//
// Supports standard Axios responses and clients
// whose interceptor already returns response.data.
// =========================================================

const unwrapResponse = (response) => {
    const isAxiosResponse =
        response !== null &&
        typeof response === "object" &&
        "data" in response &&
        (
            "status" in response ||
            "config" in response
        );

    return isAxiosResponse
        ? response.data
        : response;
};


// =========================================================
// PUBLIC EVENTS
// =========================================================

export const getPublicEvents = async ({
    params,
    signal,
} = {}) => {
    const client = getApiClient();

    const response = await client.get(
        getEventsBasePath(),
        {
            ...(params ? { params } : {}),
            ...(signal ? { signal } : {}),
        }
    );

    return unwrapResponse(response);
};


// =========================================================
// PUBLIC EVENT DETAIL
// =========================================================

export const getPublicEventDetail = async (
    slug,
    { signal } = {}
) => {
    const normalizedSlug =
        normalizeEventSlug(slug);

    const client = getApiClient();

    const response = await client.get(
        `${getEventsBasePath()}${encodeURIComponent(
            normalizedSlug
        )}/`,
        {
            ...(signal ? { signal } : {}),
        }
    );

    return unwrapResponse(response);
};


// =========================================================
// LIST RESPONSE NORMALIZER
// =========================================================
//
// Supported shapes:
//
// [...]
// { results: [...] }
// { events: [...] }
// { data: [...] }
// { data: { results: [...] } }
//
// Unexpected response shapes throw an error
// instead of silently displaying an empty list.
// =========================================================

export const normalizeEventsResponse = (payload) => {
    if (Array.isArray(payload)) {
        return {
            items: payload,
            count: payload.length,
            next: null,
            previous: null,
        };
    }

    if (
        !payload ||
        typeof payload !== "object"
    ) {
        throw new TypeError(
            "Events API noto‘g‘ri javob qaytardi."
        );
    }

    const source =
        payload.data &&
        typeof payload.data === "object" &&
        !Array.isArray(payload.data)
            ? payload.data
            : payload;

    const items =
        Array.isArray(source.results)
            ? source.results
            : Array.isArray(source.events)
              ? source.events
              : Array.isArray(source.data)
                ? source.data
                : null;

    if (!items) {
        throw new TypeError(
            "Events ro‘yxati javobda topilmadi."
        );
    }

    return {
        items,
        count:
            typeof source.count === "number"
                ? source.count
                : items.length,
        next: source.next ?? null,
        previous: source.previous ?? null,
    };
};


// =========================================================
// DETAIL RESPONSE NORMALIZER
// =========================================================

export const normalizeEventDetailResponse = (
    payload
) => {
    if (
        !payload ||
        typeof payload !== "object" ||
        Array.isArray(payload)
    ) {
        throw new TypeError(
            "Event detail javobi noto‘g‘ri."
        );
    }

    const event =
        payload.event ??
        payload.data ??
        payload;

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
// Avoid exposing backend tracebacks and private
// exception details in the UI.
// =========================================================

const STATUS_MESSAGES = {
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
};

export const normalizeEventsApiError = (error) => {
    const status = Number(
        error?.response?.status
    ) || null;

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

    const data = error?.response?.data;

    const safeCode =
        typeof data?.code === "string" &&
        /^[A-Za-z0-9_-]{1,80}$/.test(data.code)
            ? data.code
            : null;

    const defaultMessage =
        STATUS_MESSAGES[status] ??
        (
            status
                ? "So‘rov bajarilmadi."
                : "Internet aloqasini tekshiring."
        );

    const publicMessage =
        typeof data?.message === "string"
            ? data.message
            : typeof data?.detail === "string"
              ? data.detail
              : null;

    const canUsePublicMessage =
        status !== null &&
        status >= 400 &&
        status < 500 &&
        publicMessage &&
        publicMessage.length <= 200;

    return {
        status,
        code: safeCode ?? (
            status
                ? `HTTP_${status}`
                : "NETWORK_ERROR"
        ),
        message: canUsePublicMessage
            ? publicMessage
            : defaultMessage,
        canceled: false,
    };
};


// =========================================================
// SERVICE EXPORT
// =========================================================

const eventsApi = {
    getPublicEvents,
    getPublicEventDetail,
};

export default eventsApi;
