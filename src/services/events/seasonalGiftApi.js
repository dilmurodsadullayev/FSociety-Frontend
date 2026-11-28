
 // src/services/events/seasonalGiftApi.js

import api from "../api";

import {
    getEventsBasePath,
    normalizeEventSlug,
    normalizeEventsApiError,
    unwrapEventsResponse,
    assertEventsObject,
} from "./eventsApi";

// =========================================================
// FSOCIETY — SEASONAL GIFT API SERVICE
// =========================================================
//
// Location:
// src/services/events/seasonalGiftApi.js
//
// Responsibilities:
//
// - Get Seasonal Gift status
// - Claim a one-time Seasonal Gift
// - Get Seasonal Gift history
// - Validate event slugs
// - Reuse the existing Axios client
// - Normalize backend responses
// - Handle request errors safely
//
// ARCHITECTURE:
//
// Seasonal Gift:
// - One gift per user per event
// - Reward selected by Django
// - Claim history stored in backend
// - No automatic claim POST retries
//
// Daily Gift is independent.
//
// SECURITY:
//
// - No manual JWT handling
// - No new Axios interceptors
// - No local FCoin balance modification
// - No client-selected rewards
//
// =========================================================


// =========================================================
// AXIOS CLIENT
// =========================================================
//
// src/services/api.js exports the existing
// Axios instance as its DEFAULT export.
//
// Therefore:
//
// import api from "../api";
//
// is the correct import.
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
// SEASONAL GIFT ENDPOINTS
// =========================================================
//
// Backend routes:
//
// GET
// /api/events/{slug}/seasonal-gift/status/
//
// POST
// /api/events/{slug}/seasonal-gift/claim/
//
// GET
// /api/events/{slug}/seasonal-gift/history/
//
// The shared events base path automatically
// adapts to the Axios baseURL.
//
// =========================================================

export const getSeasonalGiftEndpoints = (
    slug
) => {
    const validSlug = normalizeEventSlug(slug);

    const basePath =
        getEventsBasePath() +
        encodeURIComponent(validSlug) +
        "/seasonal-gift/";

    return {
        status: `${basePath}status/`,
        claim: `${basePath}claim/`,
        history: `${basePath}history/`,
    };
};


// =========================================================
// RESPONSE VALIDATION
// =========================================================
//
// Axios may return:
//
// {
//     data: {...},
//     status: 200,
//     config: {...}
// }
//
// The shared unwrapEventsResponse supports
// standard Axios responses.
//
// Backend business fields are preserved.
//
// =========================================================

// =========================================================
// GET SEASONAL GIFT STATUS
// =========================================================
//
// This endpoint is the source of truth for:
//
// - Event availability
// - Gift opening time
// - Eligibility
// - Already claimed state
// - Existing claim
// - Countdown information
//
// The frontend must not calculate eligibility
// using localStorage or browser dates.
//
// =========================================================

export const getSeasonalGiftStatus = async (
    slug,
    {
        signal,
    } = {}
) => {
    const client = getApiClient();

    const endpoints =
        getSeasonalGiftEndpoints(slug);

    const response = await client.get(
        endpoints.status,
        {
            ...(signal ? { signal } : {}),
        }
    );

    return normalizeSeasonalGiftStatus(unwrapEventsResponse(response));
};


// =========================================================
// POST SEASONAL GIFT CLAIM
// =========================================================
//
// IMPORTANT:
//
// A Seasonal Gift may be claimed only once
// per event and authenticated user.
//
// The backend must enforce uniqueness.
//
// Never include the following in request body:
//
// - user_id
// - coins
// - amount
// - reward_id
// - rarity
// - badge_id
// - frame_id
//
// The backend chooses the reward.
//
// =========================================================

export const claimSeasonalGift = async (
    slug
) => {
    const client = getApiClient();

    const endpoints =
        getSeasonalGiftEndpoints(slug);

    // IMPORTANT:
    //
    // Do not automatically retry POST.
    //
    // An interrupted network request might
    // already have committed successfully
    // on the Django server.
    //
    // A following GET status/history can
    // reconcile an uncertain result.

    const response = await client.post(
        endpoints.claim,
        {}
    );

    return normalizeSeasonalGiftClaim(unwrapEventsResponse(response));
};


// =========================================================
// GET SEASONAL GIFT HISTORY
// =========================================================
//
// Supports:
// - Existing claimed gift
// - Event-specific history
// - Backend pagination parameters
//
// The response may be a list or an object.
//
// Its data shape is preserved for the
// Redux slice and presentation components.
//
// =========================================================

export const getSeasonalGiftHistory = async (
    slug,
    {
        params,
        signal,
    } = {}
) => {
    const client = getApiClient();

    const endpoints =
        getSeasonalGiftEndpoints(slug);

    const response = await client.get(
        endpoints.history,
        {
            ...(params ? { params } : {}),
            ...(signal ? { signal } : {}),
        }
    );

    const payload =
        unwrapEventsResponse(response);

    if (Array.isArray(payload)) return { count: payload.length, next: null, previous: null, results: payload };
    const history = assertEventsObject(payload, "Seasonal Gift history");
    if (!Array.isArray(history.results)) throw new TypeError("Seasonal Gift history: results topilmadi.");
    return history;
};

// =========================================================
// STATUS RESPONSE NORMALIZER
// =========================================================
//
// This function validates the response type
// without inventing backend fields.
//
// =========================================================

export const normalizeSeasonalGiftStatus = (
    payload
) => {
    const status = assertEventsObject(payload, "Seasonal Gift status");
    if (typeof status.can_claim !== "boolean" || typeof status.already_claimed !== "boolean" || typeof status.reason !== "string") {
        throw new TypeError("Seasonal Gift status: javob to‘liq emas.");
    }
    return status;
};


// =========================================================
// CLAIM RESPONSE NORMALIZER
// =========================================================
//
// Preserve actual reward information:
//
// - Reward type
// - Reward name
// - FCoin amount
// - Badge / Frame information
// - Compensation
// - Claim identifiers
//
// Only fields provided by Django exist.
//
// =========================================================

export const normalizeSeasonalGiftClaim = (
    payload
) => {
    const claim = assertEventsObject(payload, "Seasonal Gift claim");
    if (typeof claim.created !== "boolean" || typeof claim.already_claimed !== "boolean" ||
        !claim.reward || typeof claim.reward !== "object" || Array.isArray(claim.reward) || claim.claim_id == null) {
        throw new TypeError("Seasonal Gift claim: mukofot javobi to‘liq emas.");
    }
    if (claim.status !== undefined) normalizeSeasonalGiftStatus(claim.status);
    return claim;
};


// =========================================================
// ERROR NORMALIZATION
// =========================================================
//
// Reuse the common Events error handler.
//
// Supported errors include:
//
// 400 - Bad Request
// 401 - Unauthorized
// 403 - Forbidden
// 404 - Not Found
// 409 - Conflict
// 429 - Too Many Requests
// 503 - Service Unavailable
//
// The Redux slice is responsible for
// handling the claim state.
//
// =========================================================

export const normalizeSeasonalGiftError = (
    error
) => {
    return normalizeEventsApiError(error);
};


// =========================================================
// DEFAULT SERVICE EXPORT
// =========================================================

const seasonalGiftApi = {
    getSeasonalGiftStatus,
    claimSeasonalGift,
    getSeasonalGiftHistory,
};

export default seasonalGiftApi;
