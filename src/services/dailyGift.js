
// src/services/dailyGift.js

import axios from "./api";

import {
    DAILY_GIFT_EVENT_SLUG,
    DAILY_GIFT_ENDPOINTS,
    DAILY_GIFT_HISTORY_PAGINATION,
} from "../config/dailyGiftConfig";


// =========================================================
// FSOCIETY — DAILY GIFT API SERVICE
// =========================================================
//
// Responsibilities:
//
// - Public event information
// - Authenticated gift eligibility
// - Secure daily gift claim
// - Reward history pagination
// - Request cancellation
// - CSRF protection
//
// Existing Axios client provides:
//
// - API base URL
// - HttpOnly JWT cookie authentication
// - Credentials
// - Access token refresh
// - Concurrent refresh handling
//
// This service does not manage Redux state,
// UI notifications or reward selection.
//
// =========================================================


// =========================================================
// HISTORY PAGINATION DEFAULTS
// =========================================================

const {
    DEFAULT_PAGE,
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
} = DAILY_GIFT_HISTORY_PAGINATION;


// =========================================================
// POSITIVE INTEGER NORMALIZATION
// =========================================================

const normalizePositiveInteger = (
    value,
    fallback
) => {

    if (
        typeof value !== "number"
        &&
        typeof value !== "string"
    ) {
        return fallback;
    }


    if (
        typeof value === "string"
        &&
        !value.trim()
    ) {
        return fallback;
    }


    const parsedValue = Number(value);


    if (
        !Number.isSafeInteger(parsedValue)
        ||
        parsedValue < 1
    ) {
        return fallback;
    }


    return parsedValue;
};


// =========================================================
// HISTORY PAGE SIZE
// =========================================================

const normalizeHistoryPageSize = (
    pageSize
) => {

    const normalizedPageSize =
        normalizePositiveInteger(
            pageSize,
            DEFAULT_PAGE_SIZE
        );


    return Math.min(
        normalizedPageSize,
        MAX_PAGE_SIZE
    );
};


// =========================================================
// CSRF TOKEN VALIDATION
//
// Token is received from the authenticated
// Daily Gift status endpoint.
//
// It must not be persisted in browser storage.
// =========================================================

const normalizeCsrfToken = (
    csrfToken
) => {

    if (typeof csrfToken !== "string") {

        throw new TypeError(
            "Daily Gift CSRF token talab qilinadi."
        );
    }


    const normalizedToken =
        csrfToken.trim();


    if (!normalizedToken) {

        throw new TypeError(
            "Daily Gift CSRF token mavjud emas."
        );
    }


    // Prevent invalid header values.
    // Django CSRF tokens contain ASCII letters
    // and digits.

    if (
        !/^[a-zA-Z0-9]+$/.test(
            normalizedToken
        )
    ) {

        throw new TypeError(
            "Daily Gift CSRF token formati noto'g'ri."
        );
    }


    return normalizedToken;
};


// =========================================================
// REQUEST CANCELLATION
//
// Can be reused by Redux thunks and hooks.
//
// Cancellation does not mean that the backend
// has rolled back an already submitted claim.
// =========================================================

export const isDailyGiftRequestCanceled = (
    error
) => {

    return (
        error?.code === "ERR_CANCELED"
        ||
        error?.name === "CanceledError"
        ||
        error?.name === "AbortError"
    );
};


// =========================================================
// DAILY GIFT SERVICE
// =========================================================

const DailyGiftService = {

    // =====================================================
    // GET PUBLIC EVENT
    //
    // GET:
    //
    // /api/events/new-year-2027/
    //
    // Public event information does not require
    // an authenticated session.
    //
    // Do not trigger a token refresh from this
    // public endpoint.
    // =====================================================

    async getEvent(
        {
            eventSlug = DAILY_GIFT_EVENT_SLUG,

            signal = undefined,
        } = {}
    ) {

        const endpoint =
            DAILY_GIFT_ENDPOINTS.event(
                eventSlug
            );


        const {
            data,
        } = await axios.get(
            endpoint,
            {
                signal,

                withCredentials: true,

                skipAuthRefresh: true,
            }
        );


        return data;
    },


    // =====================================================
    // GET DAILY GIFT STATUS
    //
    // GET:
    //
    // /api/events/new-year-2027/daily-gift/status/
    //
    // Response includes backend eligibility,
    // server time, event schedule, countdown
    // information and CSRF token.
    //
    // The complete backend response is preserved.
    // =====================================================

    async getStatus(
        {
            eventSlug = DAILY_GIFT_EVENT_SLUG,

            signal = undefined,
        } = {}
    ) {

        const endpoint =
            DAILY_GIFT_ENDPOINTS.status(
                eventSlug
            );


        const {
            data,
        } = await axios.get(
            endpoint,
            {
                signal,

                withCredentials: true,
            }
        );


        return data;
    },


    // =====================================================
    // CLAIM DAILY GIFT
    //
    // POST:
    //
    // /api/events/new-year-2027/daily-gift/claim/
    //
    // Request body:
    //
    // {}
    //
    // Security:
    //
    // - No client reward selection
    // - No client coin amount
    // - Explicit CSRF header
    // - No automatic auth-refresh replay
    // - No automatic generic retry
    //
    // HTTP 201:
    //     A new claim was created.
    //
    // HTTP 200:
    //     An existing claim was returned.
    //
    // The backend is authoritative.
    // =====================================================

    async claimGift(
        {
            eventSlug = DAILY_GIFT_EVENT_SLUG,

            csrfToken,

            signal = undefined,
        } = {}
    ) {

        const endpoint =
            DAILY_GIFT_ENDPOINTS.claim(
                eventSlug
            );


        const token =
            normalizeCsrfToken(
                csrfToken
            );


        const response = await axios.post(
            endpoint,

            // The backend accepts only
            // an empty JSON object.

            {},

            {
                signal,

                withCredentials: true,

                // Prevent Axios from replacing the
                // explicit masked CSRF token with
                // a browser cookie value.

                withXSRFToken: false,

                // Claim requests must not be
                // automatically replayed after
                // an access token refresh.
                //
                // The Redux layer will handle
                // eligibility revalidation.

                skipAuthRefresh: true,

                headers: {

                    "Content-Type":
                        "application/json",

                    "X-CSRFToken":
                        token,
                },
            }
        );


        // Preserve both HTTP status and the
        // complete original backend response.

        return {
            status: response.status,

            data: response.data,
        };
    },


    // =====================================================
    // GET DAILY GIFT HISTORY
    //
    // GET:
    //
    // /api/events/new-year-2027/daily-gift/history/
    //
    // Pagination:
    //
    // ?page=1&page_size=10
    //
    // Backend response is preserved, including
    // results and pagination metadata.
    // =====================================================

    async getHistory(
        {
            eventSlug = DAILY_GIFT_EVENT_SLUG,

            page = DEFAULT_PAGE,

            pageSize = DEFAULT_PAGE_SIZE,

            signal = undefined,
        } = {}
    ) {

        const endpoint =
            DAILY_GIFT_ENDPOINTS.history(
                eventSlug
            );


        const normalizedPage =
            normalizePositiveInteger(
                page,
                DEFAULT_PAGE
            );


        const normalizedPageSize =
            normalizeHistoryPageSize(
                pageSize
            );


        const {
            data,
        } = await axios.get(
            endpoint,
            {
                params: {

                    page:
                        normalizedPage,

                    page_size:
                        normalizedPageSize,
                },

                signal,

                withCredentials: true,
            }
        );


        return data;
    },
};


// =========================================================
// DEFAULT EXPORT
// =========================================================

export default DailyGiftService;
