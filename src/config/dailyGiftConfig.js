
// src/config/dailyGiftConfig.js

// =========================================================
// FSOCIETY — DAILY GIFT CONFIGURATION
// =========================================================
//
// Responsibilities:
//
// - Event identity
// - Backend event statuses
// - Gift eligibility reasons
// - Reward types
// - Reward rarities
// - API endpoint builders
// - History pagination
// - Async request states
//
// IMPORTANT:
//
// Reward selection, reward amounts, event schedule
// and daily eligibility are controlled by the backend.
//
// =========================================================


// =========================================================
// EVENT CONFIGURATION
// =========================================================

export const DAILY_GIFT_EVENT_SLUG =
    "new-year-2027";


// =========================================================
// EVENT STATUS
//
// Backend: events/choices.py
// =========================================================

export const DAILY_GIFT_EVENT_STATUS = Object.freeze({
    DISABLED: "disabled",

    SCHEDULED: "scheduled",

    ACTIVE: "active",

    FINISHED: "finished",
});


// =========================================================
// ELIGIBILITY REASONS
// =========================================================

export const DAILY_GIFT_ELIGIBILITY_REASON = Object.freeze({
    AVAILABLE: "available",

    AUTHENTICATION_REQUIRED:
        "authentication_required",

    USER_INACTIVE:
        "user_inactive",

    EVENT_DISABLED:
        "event_disabled",

    EVENT_NOT_STARTED:
        "event_not_started",

    EVENT_FINISHED:
        "event_finished",

    ALREADY_CLAIMED:
        "already_claimed",
});


// =========================================================
// REWARD TYPES
// =========================================================

export const DAILY_GIFT_REWARD_TYPE = Object.freeze({
    COIN: "coin",

    BADGE: "badge",

    FRAME: "frame",

    ACHIEVEMENT: "achievement",
});


// =========================================================
// REWARD RARITY
// =========================================================

export const DAILY_GIFT_REWARD_RARITY = Object.freeze({
    COMMON: "common",

    RARE: "rare",

    EPIC: "epic",

    LEGENDARY: "legendary",
});


// =========================================================
// HTTP STATUS
// =========================================================

export const DAILY_GIFT_HTTP_STATUS = Object.freeze({
    OK: 200,

    CREATED: 201,

    BAD_REQUEST: 400,

    UNAUTHORIZED: 401,

    FORBIDDEN: 403,

    NOT_FOUND: 404,

    CONFLICT: 409,

    TOO_MANY_REQUESTS: 429,

    SERVICE_UNAVAILABLE: 503,
});


// =========================================================
// ASYNC REQUEST STATUS
//
// Used by the Redux state layer.
// =========================================================

export const DAILY_GIFT_REQUEST_STATUS = Object.freeze({
    IDLE: "idle",

    LOADING: "loading",

    SUCCEEDED: "succeeded",

    FAILED: "failed",
});


// =========================================================
// HISTORY PAGINATION
//
// Backend default page size: 10
// Backend maximum page size: 50
// =========================================================

export const DAILY_GIFT_HISTORY_PAGINATION = Object.freeze({
    DEFAULT_PAGE: 1,

    DEFAULT_PAGE_SIZE: 10,

    MAX_PAGE_SIZE: 50,
});


// =========================================================
// EVENT SLUG VALIDATION
// =========================================================

export const normalizeDailyGiftEventSlug = (
    eventSlug = DAILY_GIFT_EVENT_SLUG
) => {
    if (typeof eventSlug !== "string") {

        throw new TypeError(
            "Daily Gift event slug must be a string."
        );
    }


    const normalizedSlug = eventSlug.trim();


    if (!normalizedSlug) {

        throw new TypeError(
            "Daily Gift event slug cannot be empty."
        );
    }


    // Django's standard ASCII slug format.

    if (!/^[a-zA-Z0-9_-]+$/.test(normalizedSlug)) {

        throw new TypeError(
            "Daily Gift event slug has an invalid format."
        );
    }


    return normalizedSlug;
};


// =========================================================
// API BASE PATH BUILDER
//
// Existing Axios baseURL already includes /api.
//
// Correct:
//
// /events/new-year-2027/
//
// Incorrect:
//
// /api/events/new-year-2027/
// =========================================================

const buildEventPath = (
    eventSlug = DAILY_GIFT_EVENT_SLUG
) => {

    const slug = normalizeDailyGiftEventSlug(
        eventSlug
    );


    return `/events/${slug}/`;
};


// =========================================================
// API ENDPOINT BUILDERS
// =========================================================

export const DAILY_GIFT_ENDPOINTS = Object.freeze({

    // =====================================================
    // PUBLIC EVENT DETAIL
    //
    // GET /api/events/<event_slug>/
    // =====================================================

    event: (
        eventSlug = DAILY_GIFT_EVENT_SLUG
    ) => {

        return buildEventPath(
            eventSlug
        );
    },


    // =====================================================
    // AUTHENTICATED GIFT STATUS
    //
    // GET /api/events/<event_slug>/daily-gift/status/
    // =====================================================

    status: (
        eventSlug = DAILY_GIFT_EVENT_SLUG
    ) => {

        return (
            `${buildEventPath(eventSlug)}`
            + "daily-gift/status/"
        );
    },


    // =====================================================
    // CLAIM DAILY GIFT
    //
    // POST /api/events/<event_slug>/daily-gift/claim/
    // =====================================================

    claim: (
        eventSlug = DAILY_GIFT_EVENT_SLUG
    ) => {

        return (
            `${buildEventPath(eventSlug)}`
            + "daily-gift/claim/"
        );
    },


    // =====================================================
    // AUTHENTICATED GIFT HISTORY
    //
    // GET /api/events/<event_slug>/daily-gift/history/
    // =====================================================

    history: (
        eventSlug = DAILY_GIFT_EVENT_SLUG
    ) => {

        return (
            `${buildEventPath(eventSlug)}`
            + "daily-gift/history/"
        );
    },
});
