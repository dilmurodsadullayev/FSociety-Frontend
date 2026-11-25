// src/services/events/seasonalGiftApi.js

import * as apiModule from "../api";

import {
    normalizeEventSlug,
    normalizeEventsApiError,
} from "./eventsApi";

// =========================================================
// FSOCIETY — SEASONAL GIFT API SERVICE
// =========================================================
//
// One-time gift per user and event.
//
// Responsibilities:
// - Seasonal Gift status
// - Seasonal Gift claim
// - Seasonal Gift history
// - Existing Axios client reuse
// - Request cancellation for GET requests
// - Error normalization
//
// IMPORTANT:
// - No client-side reward selection
// - No manual FCoin balance modification
// - No automatic POST retry
// - No separate JWT / CSRF interceptor
//
// =========================================================


// =========================================================
// API CLIENT
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
            typeof candidate.get === "function" &&
            typeof candidate.post === "function"
    );

    if (!client) {
        throw new Error(
            "FSociety Axios client topilmadi. " +
            "src/services/api.js eksportlarini tekshiring."
        );
    }

    return client;
};


// =========================================================
// API BASE PATH
// =========================================================
//
// baseURL ending in /api:
//   events/{slug}/seasonal-gift/
//
// baseURL without /api:
//   api/events/{slug}/seasonal-gift/
//
// These paths must be checked against the final
// Django events/urls.py before integration.
// =========================================================

const getEventsBasePath = () => {
    const client = getApiClient();

    const baseURL = String(
        client.defaults?.baseURL ?? ""
    )
        .split(/[?#]/)[0]
        .replace(/\/+$/, "");

    const hasApiPrefix =
        /(?:^|\/)api(?:\/v\d+)?$/i.test(baseURL);

    return hasApiPrefix
        ? "events/"
        : "api/events/";
};


// =========================================================
// ENDPOINTS
// =========================================================

export const getSeasonalGiftEndpoints = (
    slug
) => {
    const validSlug = normalizeEventSlug(slug);

    const base = [
        getEventsBasePath().replace(/\/$/, ""),
        encodeURIComponent(validSlug),
        "seasonal-gift",
    ].join("/");

    return {
        status: `${base}/status/`,
        claim: `${base}/claim/`,
        history: `${base}/history/`,
    };
};


// =========================================================
// RESPONSE HANDLING
// =========================================================
//
// Handles:
// - Normal Axios response
// - Existing interceptor returning response.data
//
// Does not invent backend response fields.
// =========================================================

const unwrapResponse = (response) => {
    const isAxiosResponse =
        response !== null &&
        typeof response === "object" &&
        !Array.isArray(response) &&
        "data" in response &&
        (
            "config" in response ||
            "headers" in response ||
            typeof response.status === "number"
        );

    return isAxiosResponse
        ? response.data
        : response;
};

const assertObjectResponse = (
    payload,
    operation
) => {
    if (
        !payload ||
        typeof payload !== "object" ||
        Array.isArray(payload)
    ) {
        throw new TypeError(
            `Seasonal Gift ${operation}: ` +
            "backend javobi noto‘g‘ri."
        );
    }

    return payload;
};


// =========================================================
// GET SEASONAL GIFT STATUS
// =========================================================
//
// GET:
// /api/events/{slug}/seasonal-gift/status/
//
// Backend determines:
// - can_claim
// - already_claimed
// - claim_id
// - opens_at
// - countdown_seconds
// - event_status
//
// =========================================================

export const getSeasonalGiftStatus = async (
    slug,
    { signal } = {}
) => {
    const client = getApiClient();

    const endpoint =
        getSeasonalGiftEndpoints(slug).status;

    const response = await client.get(
        endpoint,
        {
            ...(signal ? { signal } : {}),
        }
    );

    return assertObjectResponse(
        unwrapResponse(response),
        "status"
    );
};


// =========================================================
// CLAIM SEASONAL GIFT
// =========================================================
//
// POST:
// /api/events/{slug}/seasonal-gift/claim/
//
// A claim must only be initiated by a user action.
//
// NEVER send:
// - user_id
// - reward_id
// - amount
// - coins
// - rarity
//
// NEVER automatically retry this POST.
//
// If the connection fails, the backend may have
// already created a claim. Reconcile via GET.
// =========================================================

export const claimSeasonalGift = async (
    slug
) => {
    const client = getApiClient();

    const endpoint =
        getSeasonalGiftEndpoints(slug).claim;

    const response = await client.post(
        endpoint,
        {}
    );

    return assertObjectResponse(
        unwrapResponse(response),
        "claim"
    );
};


// =========================================================
// GET SEASONAL GIFT HISTORY
// =========================================================
//
// GET:
// /api/events/{slug}/seasonal-gift/history/
//
// Accepts backend-supported pagination params.
//
// The backend may return:
// - An array
// - A paginated object
//
// Do not silently discard unknown response fields.
// =========================================================

export const getSeasonalGiftHistory = async (
    slug,
    {
        params,
        signal,
    } = {}
) => {
    const client = getApiClient();

    const endpoint =
        getSeasonalGiftEndpoints(slug).history;

    const response = await client.get(
        endpoint,
        {
            ...(params ? { params } : {}),
            ...(signal ? { signal } : {}),
        }
    );

    const payload = unwrapResponse(response);

    if (
        payload === null ||
        typeof payload !== "object"
    ) {
        throw new TypeError(
            "Seasonal Gift history javobi noto‘g‘ri."
        );
    }

    return payload;
};


// =========================================================
// NORMALIZE ERRORS
// =========================================================
//
// Reuse shared Events API error normalization.
//
// Never expose backend traceback details in UI.
// =========================================================

export const normalizeSeasonalGiftError = (
    error
) => {
    return normalizeEventsApiError(error);
};


// =========================================================
// DEFAULT EXPORT
// =========================================================

const seasonalGiftApi = {
    getSeasonalGiftStatus,
    claimSeasonalGift,
    getSeasonalGiftHistory,
};

export default seasonalGiftApi;