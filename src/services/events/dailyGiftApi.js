
// src/services/events/dailyGiftApi.js

import api from "../api";

import {
    getEventsBasePath,
    normalizeEventSlug,
    normalizeEventsApiError,
    unwrapEventsResponse,
    assertEventsObject,
} from "./eventsApi";

// =========================================================
// FSOCIETY — DAILY GIFT API SERVICE
// =========================================================
//
// Responsibilities:
// - Daily Gift status
// - Daily Gift claim
// - Daily Gift history
// - Backend response validation
// - Pagination support
// - Request cancellation for GET
// - Shared API error normalization
//
// IMPORTANT:
//
// Daily Gift:
// One gift per user, event and local day.
//
// Seasonal Gift:
// One gift per user and event.
//
// These two systems are independent.
//
// This service NEVER:
// - Selects a reward
// - Generates random FCoin amounts
// - Modifies user balance
// - Retries a claim POST automatically
// - Creates a new Axios instance
//
// =========================================================


// =========================================================
// API CLIENT
// =========================================================
//
// Import the existing default Axios instance.
//
// All JWT, cookie, CSRF and token refresh logic
// stays inside src/services/api.js.
//
// =========================================================

const getApiClient = () => {
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
// DAILY GIFT ENDPOINTS
// =========================================================
//
// Example:
//
// /api/events/new-year-2027/daily-gift/status/
//
// /api/events/new-year-2027/daily-gift/claim/
//
// /api/events/new-year-2027/daily-gift/history/
//
// The base path is shared with eventsApi.js.
//
// =========================================================

export const getDailyGiftEndpoints = (slug) => {
    const validSlug = normalizeEventSlug(slug);

    const basePath =
        getEventsBasePath() +
        encodeURIComponent(validSlug) +
        "/daily-gift/";

    return {
        status: `${basePath}status/`,
        claim: `${basePath}claim/`,
        history: `${basePath}history/`,
    };
};


// =========================================================
// RESPONSE HELPERS
// =========================================================

const normalizeDailyGiftObject = (
    response,
    operation
) => {
    const payload = unwrapEventsResponse(
        response
    );

    return assertEventsObject(
        payload,
        `Daily Gift ${operation}`
    );
};


// =========================================================
// GET DAILY GIFT STATUS
// =========================================================
//
// GET:
//
// /api/events/{slug}/daily-gift/status/
//
// The backend is responsible for:
//
// - Eligibility
// - Already claimed status
// - Current claim date
// - Next claim date
// - Event availability
// - Server time
// - Reward visibility
//
// This function preserves the backend payload.
//
// =========================================================

export const getDailyGiftStatus = async (
    slug,
    {
        signal,
    } = {}
) => {
    const client = getApiClient();

    const endpoints =
        getDailyGiftEndpoints(slug);

    const response = await client.get(
        endpoints.status,
        {
            ...(signal ? { signal } : {}),
        }
    );

    return normalizeDailyGiftObject(
        response,
        "status"
    );
};


// =========================================================
// POST DAILY GIFT CLAIM
// =========================================================
//
// POST:
//
// /api/events/{slug}/daily-gift/claim/
//
// The request body is intentionally empty.
//
// User identity comes from authentication.
//
// Reward selection and granting belong
// exclusively to the Django backend.
//
// IMPORTANT:
//
// Do not automatically retry this request.
//
// If a timeout occurs after the server has
// committed the reward, use GET status/history
// to reconcile the result.
//
// =========================================================

export const claimDailyGift = async (
    slug
) => {
    const client = getApiClient();

    const endpoints =
        getDailyGiftEndpoints(slug);

    const response = await client.post(
        endpoints.claim,
        {}
    );

    return normalizeDailyGiftObject(
        response,
        "claim"
    );
};


// =========================================================
// GET DAILY GIFT HISTORY
// =========================================================
//
// GET:
//
// /api/events/{slug}/daily-gift/history/
//
// Supports backend-approved pagination
// and filtering query parameters.
//
// Examples:
//
// getDailyGiftHistory("new-year-2027");
//
// getDailyGiftHistory("new-year-2027", {
//     params: { page: 2 },
// });
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

    const endpoints =
        getDailyGiftEndpoints(slug);

    const response = await client.get(
        endpoints.history,
        {
            ...(params ? { params } : {}),
            ...(signal ? { signal } : {}),
        }
    );

    const payload = unwrapEventsResponse(
        response
    );

    // History may be:
    //
    // - An array
    // - A DRF paginated object
    // - Another backend-defined object
    //
    // Preserve the original payload.

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
// ERROR NORMALIZATION
// =========================================================
//
// Reuse common Events API errors.
//
// The returned error is Redux-serializable.
//
// =========================================================

export const normalizeDailyGiftError = (
    error
) => {
    return normalizeEventsApiError(
        error
    );
};


// =========================================================
// OPTIONAL RESPONSE NORMALIZERS
// =========================================================
//
// These functions are reusable by hooks,
// Redux thunks and UI components.
//
// They do not fabricate missing reward data.
//
// =========================================================

export const normalizeDailyGiftStatus = (
    payload
) => {
    return assertEventsObject(
        payload,
        "Daily Gift status"
    );
};

export const normalizeDailyGiftClaim = (
    payload
) => {
    return assertEventsObject(
        payload,
        "Daily Gift claim"
    );
};


// =========================================================
// DEFAULT SERVICE EXPORT
// =========================================================

const dailyGiftApi = {
    getDailyGiftStatus,
    claimDailyGift,
    getDailyGiftHistory,
};

export default dailyGiftApi;
