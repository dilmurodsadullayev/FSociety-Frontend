
 // src/services/events/dailyGiftApi.js

import * as apiModule from "../api";

import {
    normalizeEventSlug,
    normalizeEventsApiError,
} from "./eventsApi";

// =========================================================
// FSOCIETY — DAILY GIFT API SERVICE
// =========================================================
//
// Responsibilities:
// - Get authenticated Daily Gift status
// - Claim Daily Gift
// - Fetch Daily Gift history
// - Reuse existing Axios client
// - Support AbortController
// - Preserve backend response data
//
// IMPORTANT:
//
// Daily Gift = one claim per event / local day.
//
// Seasonal Gift is a separate system.
//
// This service never selects rewards or amounts.
// The Django backend is the source of truth.
//
// =========================================================


// =========================================================
// EXISTING AXIOS CLIENT
// =========================================================
//
// Reuses the same client as eventsApi.js.
//
// No new Axios instance.
// No duplicate token refresh interceptor.
// No manual JWT handling.
//
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
// ENDPOINT RESOLVER
// =========================================================
//
// Handles:
//
// baseURL = https://domain.com/api/
// -> events/{slug}/daily-gift/
//
// baseURL = https://domain.com/
// -> api/events/{slug}/daily-gift/
//
// =========================================================

const getEventsBasePath = () => {
    const client = getApiClient();

    const baseURL = String(
        client.defaults?.baseURL ?? ""
    )
        .split(/[?#]/)[0]
        .replace(/\/+$/, "");

    const alreadyHasApiPrefix =
        /(?:^|\/)api(?:\/v\d+)?$/i.test(
            baseURL
        );

    return alreadyHasApiPrefix
        ? "events/"
        : "api/events/";
};


// =========================================================
// DAILY GIFT ENDPOINTS
// =========================================================

export const getDailyGiftEndpoints = (slug) => {
    const validSlug = normalizeEventSlug(slug);

    const base = [
        getEventsBasePath().replace(/\/$/, ""),
        encodeURIComponent(validSlug),
        "daily-gift",
    ].join("/");

    return {
        status: `${base}/status/`,
        claim: `${base}/claim/`,
        history: `${base}/history/`,
    };
};


// =========================================================
// RESPONSE NORMALIZATION
// =========================================================
//
// Supports standard Axios responses and an
// Axios interceptor returning response.data.
//
// Does not transform reward fields.
// Does not fabricate backend values.
//
// =========================================================

const unwrapResponse = (response) => {
    if (
        response &&
        typeof response === "object" &&
        !Array.isArray(response) &&
        "data" in response &&
        (
            "config" in response ||
            "headers" in response ||
            typeof response.status === "number"
        )
    ) {
        return response.data;
    }

    return response;
};

const ensureObjectResponse = (
    payload,
    operation
) => {
    if (
        !payload ||
        typeof payload !== "object" ||
        Array.isArray(payload)
    ) {
        throw new TypeError(
            `Daily Gift ${operation}: ` +
            "backend noto‘g‘ri javob qaytardi."
        );
    }

    return payload;
};


// =========================================================
// GET DAILY GIFT STATUS
// =========================================================
//
// GET:
// /api/events/{slug}/daily-gift/status/
//
// The server determines:
// - Can claim
// - Already claimed
// - Claim date
// - Next claim time
// - Countdown
// - Event availability
//
// =========================================================

export const getDailyGiftStatus = async (
    slug,
    {
        signal,
    } = {}
) => {
    const client = getApiClient();

    const endpoint =
        getDailyGiftEndpoints(slug).status;

    const response = await client.get(
        endpoint,
        {
            ...(signal ? { signal } : {}),
        }
    );

    return ensureObjectResponse(
        unwrapResponse(response),
        "status"
    );
};


// =========================================================
// POST DAILY GIFT CLAIM
// =========================================================
//
// POST:
// /api/events/{slug}/daily-gift/claim/
//
// Never send:
// - user_id
// - reward_id
// - coins
// - amount
// - rarity
//
// The backend chooses and grants rewards.
//
// Request MUST come from explicit user action.
// Never automatically retry an uncertain POST.
//
// =========================================================

export const claimDailyGift = async (
    slug,
    {
        signal,
    } = {}
) => {
    const client = getApiClient();

    const endpoint =
        getDailyGiftEndpoints(slug).claim;

    const response = await client.post(
        endpoint,
        {},
        {
            ...(signal ? { signal } : {}),
        }
    );

    return ensureObjectResponse(
        unwrapResponse(response),
        "claim"
    );
};


// =========================================================
// GET DAILY GIFT HISTORY
// =========================================================
//
// GET:
// /api/events/{slug}/daily-gift/history/
//
// Supports pagination/filter parameters
// accepted by the backend.
//
// This function preserves the actual payload
// because the history response may be either
// a paginated object or an array.
//
// =========================================================

export const getDailyGiftHistory = async (
    slug,
    {
        params,
        signal,
    } = {}
) => {
    const client = getApiClient();

    const endpoint =
        getDailyGiftEndpoints(slug).history;

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
            "Daily Gift history javobi noto‘g‘ri."
        );
    }

    return payload;
};


// =========================================================
// ERROR HANDLER
// =========================================================
//
// Reuse common Events error handling.
//
// No backend traceback is deliberately exposed.
//
// =========================================================

export const normalizeDailyGiftError = (
    error
) => {
    return normalizeEventsApiError(error);
};


// =========================================================
// SERVICE EXPORT
// =========================================================

const dailyGiftApi = {
    getDailyGiftStatus,
    claimDailyGift,
    getDailyGiftHistory,
};

export default dailyGiftApi;
