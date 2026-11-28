
 // src/services/events/dailyGiftApi.js

import {
    assertEventsObject,
    getEventsApiClient,
    getEventsBasePath,
    normalizeEventSlug,
    normalizeEventsApiError,
    unwrapEventsResponse,
} from "./eventsApi";

// =========================================================
// FSOCIETY — DAILY GIFT API
// =========================================================
//
// GET  /api/events/{slug}/daily-gift/status/
// POST /api/events/{slug}/daily-gift/claim/
// GET  /api/events/{slug}/daily-gift/history/
//
// One claim per user, per event, per EVENT-LOCAL DAY.
// Server is the only authority for claim eligibility,
// time, reward selection, and FCoin granting.
//
// The shared axios instance handles JWT cookies, CSRF,
// authentication refresh and credentials.
// No manual POST retry, no localStorage claim flags.
// =========================================================

const DAILY_GIFT_REASONS = Object.freeze({
    available: "Bugungi sovg‘angiz tayyor!",
    already_claimed: "Bugungi sovg‘angiz allaqachon olingan.",
    gift_mode_not_supported: "Ushbu tadbirda kunlik sovg‘a mavjud emas.",
    event_not_started: "Tadbir hali boshlanmagan.",
    event_finished: "Tadbir yakunlangan.",
    event_disabled: "Tadbir hozir faol emas.",
    authentication_required: "Sovg‘ani olish uchun tizimga kiring.",
    user_inactive: "Bu hisob orqali sovg‘a olish mumkin emas.",
    reward_unavailable: "Hozircha faol mukofot mavjud emas.",
});

const isRecord = (value) =>
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value);

// =========================================================
// URLS
// =========================================================

export const getDailyGiftEndpoints = (eventSlug) => {
    const slug = normalizeEventSlug(eventSlug);

    const base = `${getEventsBasePath()}${encodeURIComponent(slug)}/daily-gift/`;

    return {
        status: `${base}status/`,
        claim: `${base}claim/`,
        history: `${base}history/`,
    };
};

// =========================================================
// RESPONSE VALIDATION
// =========================================================

export const normalizeDailyGiftStatus = (response) => {
    const payload = assertEventsObject(
        unwrapEventsResponse(response),
        "Daily Gift status"
    );

    if (
        typeof payload.can_claim !== "boolean" ||
        typeof payload.claimed_today !== "boolean" ||
        typeof payload.reason !== "string"
    ) {
        throw new TypeError(
            "Daily Gift status: server javobi to‘liq emas."
        );
    }

    return payload;
};

export const normalizeDailyGiftClaim = (response) => {
    const payload = assertEventsObject(
        unwrapEventsResponse(response),
        "Daily Gift claim"
    );

    if (
        typeof payload.created !== "boolean" ||
        typeof payload.already_claimed !== "boolean" ||
        !isRecord(payload.reward) ||
        payload.claim_id == null
    ) {
        throw new TypeError(
            "Daily Gift claim: mukofot javobi to‘liq emas."
        );
    }

    if (payload.status !== undefined) normalizeDailyGiftStatus(payload.status);
    // Preserve the backend's exact claim and reward data.
    return payload;
};

export const normalizeDailyGiftHistory = (response) => {
    const payload = unwrapEventsResponse(response);

    if (Array.isArray(payload)) {
        return {
            count: payload.length,
            next: null,
            previous: null,
            results: payload,
        };
    }

    const root = assertEventsObject(
        payload,
        "Daily Gift history"
    );

    if (!Array.isArray(root.results)) {
        throw new TypeError(
            "Daily Gift history: results ro‘yxati topilmadi."
        );
    }

    return root;
};

// =========================================================
// GET STATUS — source of truth
// =========================================================
// Do not infer eligibility from browser time.
// Check `can_claim`, `claimed_today`, `next_claim_at`,
// `server_time` and `reason` returned by Django.
// =========================================================

export const getDailyGiftStatus = async (
    eventSlug,
    { signal } = {}
) => {
    const client = getEventsApiClient();
    const { status } = getDailyGiftEndpoints(eventSlug);

    const response = await client.get(status, {
        ...(signal ? { signal } : {}),
    });

    return normalizeDailyGiftStatus(response);
};

// =========================================================
// POST CLAIM — explicitly user initiated
// =========================================================
// Payload must be {}. Never send reward_id, coins,
// amount, user_id, or claim_date. The backend chooses.
//
// No automatic application-level retry: if the network
// fails after POST, GET status/history to reconcile.
// =========================================================

export const claimDailyGift = async (eventSlug) => {
    const client = getEventsApiClient();
    const { claim } = getDailyGiftEndpoints(eventSlug);

    const response = await client.post(claim, {});

    return normalizeDailyGiftClaim(response);
};

// =========================================================
// GET HISTORY — current authenticated user only
// =========================================================
// Django always selects request.user; the frontend does
// not send a user ID. Backend supports page/page_size.
// =========================================================

export const getDailyGiftHistory = async (
    eventSlug,
    { page, pageSize, signal } = {}
) => {
    const client = getEventsApiClient();
    const { history } = getDailyGiftEndpoints(eventSlug);

    const params = {};

    if (page !== undefined) {
        if (!Number.isSafeInteger(page) || page < 1) {
            throw new TypeError("page musbat butun son bo‘lishi kerak.");
        }
        params.page = page;
    }

    if (pageSize !== undefined) {
        if (!Number.isSafeInteger(pageSize) || pageSize < 1) {
            throw new TypeError("pageSize musbat butun son bo‘lishi kerak.");
        }
        params.page_size = pageSize;
    }

    const response = await client.get(history, {
        ...(Object.keys(params).length ? { params } : {}),
        ...(signal ? { signal } : {}),
    });

    return normalizeDailyGiftHistory(response);
};

// =========================================================
// SAFE ERROR MESSAGES
// =========================================================
// Prefer a small allowlist of known backend reason codes.
// Never display arbitrary server tracebacks in the UI.
// =========================================================

export const normalizeDailyGiftError = (error) => {
    const base = normalizeEventsApiError(error);

    if (base.canceled) {
        return base;
    }

    const responseData = error?.response?.data;
    const backendCode = isRecord(responseData)
        ? responseData.code
        : null;

    const reason = isRecord(responseData?.eligibility)
        ? responseData.eligibility.reason
        : null;

    const knownReason =
        (typeof backendCode === "string" &&
            Object.prototype.hasOwnProperty.call(
                DAILY_GIFT_REASONS,
                backendCode
            ) && backendCode) ||
        (typeof reason === "string" &&
            Object.prototype.hasOwnProperty.call(
                DAILY_GIFT_REASONS,
                reason
            ) && reason) ||
        null;

    return {
        ...base,
        message: knownReason
            ? DAILY_GIFT_REASONS[knownReason]
            : base.message,
    };
};

const dailyGiftApi = {
    getDailyGiftStatus,
    claimDailyGift,
    getDailyGiftHistory,
};

export default dailyGiftApi;
