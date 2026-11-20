
// src/features/dailyGift/dailyGiftThunks.js

import { createAsyncThunk } from "@reduxjs/toolkit";

import DailyGiftService, {
    isDailyGiftRequestCanceled,
} from "../../services/dailyGift";

import {
    DAILY_GIFT_EVENT_SLUG,
    DAILY_GIFT_REQUEST_STATUS,
    DAILY_GIFT_HISTORY_PAGINATION,
} from "../../config/dailyGiftConfig";


// =========================================================
// FSOCIETY — DAILY GIFT ASYNC THUNKS
// =========================================================
//
// Responsibilities:
//
// - Public event information
// - Authenticated gift status
// - Secure claim request
// - Daily reward history
// - Duplicate request protection
// - Authentication consistency
// - Safe error serialization
// - Uncertain claim recovery
//
// =========================================================

const { LOADING } = DAILY_GIFT_REQUEST_STATUS;

const {
    DEFAULT_PAGE,
    DEFAULT_PAGE_SIZE,
} = DAILY_GIFT_HISTORY_PAGINATION;


// =========================================================
// AUTHENTICATION HELPERS
// =========================================================

export const getDailyGiftUserId = (user) => {
    const id = user?.id ?? user?.pk;

    if (id === undefined || id === null || id === "") {
        return null;
    }

    return String(id);
};


const getAuthenticatedUserId = (state) => {
    if (!state.auth?.isLoggedIn) {
        return null;
    }

    return getDailyGiftUserId(
        state.auth.user
    );
};


const getGiftState = (state) =>
    state.dailyGift;


// =========================================================
// PRIVATE REQUEST PROTECTION
// =========================================================

const hasValidSession = (state) => {
    const userId = getAuthenticatedUserId(state);

    const giftState = getGiftState(state);

    return (
        userId !== null &&
        Boolean(giftState) &&
        giftState.ownerId === userId
    );
};


const isSameSession = (
    state,
    originalUserId
) => (
    originalUserId !== null &&
    getAuthenticatedUserId(state) === originalUserId &&
    getGiftState(state)?.ownerId === originalUserId
);


// =========================================================
// SENSITIVE RESPONSE NORMALIZATION
//
// CSRF tokens are needed only when the request is sent.
// Do not include them in Redux state or action payloads.
// =========================================================

export const removeDailyGiftCsrfToken = (data) => {
    if (
        !data ||
        typeof data !== "object" ||
        Array.isArray(data)
    ) {
        return data;
    }

    const result = { ...data };

    delete result.csrf_token;

    return result;
};


// =========================================================
// SERIALIZABLE ERROR
// =========================================================

const createGiftError = (
    code,
    message,
    options = {}
) => ({
    code,

    message,

    status: options.status ?? null,

    eligibility: options.eligibility ?? null,

    retryAfter: options.retryAfter ?? null,

    isCanceled: Boolean(options.isCanceled),

    isNetworkError: Boolean(options.isNetworkError),

    mayHaveClaimed: Boolean(options.mayHaveClaimed),
});


// =========================================================
// ERROR NORMALIZATION
//
// Do not put AxiosError, request objects or raw headers
// inside the Redux store.
// =========================================================

const normalizeDailyGiftError = (
    error,
    {
        fallback = "So‘rovni bajarishda xatolik yuz berdi.",
        claimSubmitted = false,
    } = {}
) => {
    const canceled =
        isDailyGiftRequestCanceled(error);

    const response =
        error?.response;

    const status =
        response?.status ?? null;

    const body =
        response?.data;

    const responseCode =
        typeof body?.code === "string"
            ? body.code
            : null;

    const responseMessage =
        typeof body?.message === "string"
            ? body.message
            : typeof body?.detail === "string"
                ? body.detail
                : null;

    const retryAfterHeader =
        response?.headers?.["retry-after"];

    const retryAfterNumber =
        Number(retryAfterHeader);

    const retryAfter =
        retryAfterHeader != null &&
        Number.isFinite(retryAfterNumber) &&
        retryAfterNumber >= 0
            ? retryAfterNumber
            : null;

    const isNetworkError =
        !response &&
        !canceled &&
        error?.isAxiosError === true;

    // A failed client response does not always mean
    // that the server failed to award the gift.

    const mayHaveClaimed =
        claimSubmitted &&
        (
            canceled ||
            !response ||
            status === 408 ||
            status >= 500
        );

    if (canceled) {
        return createGiftError(
            "request_canceled",
            "So‘rov bekor qilindi.",
            {
                isCanceled: true,
                mayHaveClaimed,
            }
        );
    }

    const statusMessages = {
        400: "So‘rov ma’lumotlari noto‘g‘ri.",
        401: "Tizimga qayta kirish talab qilinishi mumkin.",
        403: "So‘rovni bajarishga ruxsat berilmadi.",
        404: "Yangi yil tadbiri topilmadi.",
        409: "Hozir sovg‘ani ochish mumkin emas.",
        429: "Juda ko‘p so‘rov yuborildi. Birozdan keyin urinib ko‘ring.",
        503: "Sovg‘alar xizmati vaqtincha ishlamayapti.",
    };

    return createGiftError(
        responseCode ??
            (
                isNetworkError
                    ? "network_error"
                    : status
                        ? `http_${status}`
                        : "daily_gift_error"
            ),

        responseMessage ||
            statusMessages[status] ||
            (
                isNetworkError
                    ? "Internet bilan bog‘liq muammo yuz berdi."
                    : fallback
            ),

        {
            status,

            eligibility:
                removeDailyGiftCsrfToken(
                    body?.eligibility ?? null
                ),

            retryAfter,

            isNetworkError,

            mayHaveClaimed,
        }
    );
};


// =========================================================
// SESSION CHANGED ERROR
// =========================================================

const createSessionChangedError = () =>
    createGiftError(
        "session_changed",
        "Foydalanuvchi sessiyasi o‘zgardi."
    );


// =========================================================
// FETCH PUBLIC EVENT
// =========================================================

export const fetchDailyGiftEvent = createAsyncThunk(
    "dailyGift/fetchEvent",

    async (_, thunkAPI) => {
        const {
            signal,
            rejectWithValue,
        } = thunkAPI;

        try {
            return await DailyGiftService.getEvent({
                eventSlug: DAILY_GIFT_EVENT_SLUG,
                signal,
            });

        } catch (error) {
            return rejectWithValue(
                normalizeDailyGiftError(error, {
                    fallback:
                        "Tadbir ma’lumotlarini yuklab bo‘lmadi.",
                })
            );
        }
    },

    {
        condition: (_, { getState }) => {
            const state =
                getGiftState(getState());

            return (
                Boolean(state) &&
                state.event.requestStatus !== LOADING
            );
        },
    }
);


// =========================================================
// FETCH AUTHENTICATED GIFT STATUS
// =========================================================

export const fetchDailyGiftStatus = createAsyncThunk(
    "dailyGift/fetchStatus",

    async (_, thunkAPI) => {
        const {
            signal,
            getState,
            rejectWithValue,
        } = thunkAPI;

        const ownerId =
            getAuthenticatedUserId(getState());

        try {
            const data =
                await DailyGiftService.getStatus({
                    eventSlug: DAILY_GIFT_EVENT_SLUG,
                    signal,
                });

            if (
                !isSameSession(
                    getState(),
                    ownerId
                )
            ) {
                return rejectWithValue(
                    createSessionChangedError()
                );
            }

            return removeDailyGiftCsrfToken(data);

        } catch (error) {
            return rejectWithValue(
                normalizeDailyGiftError(error, {
                    fallback:
                        "Kunlik sovg‘a holatini yuklab bo‘lmadi.",
                })
            );
        }
    },

    {
        condition: (_, { getState }) => {
            const state = getState();

            if (!hasValidSession(state)) {
                return false;
            }

            const gift = getGiftState(state);

            return (
                gift.status.requestStatus !== LOADING &&
                gift.claim.requestStatus !== LOADING
            );
        },
    }
);


// =========================================================
// CLAIM DAILY GIFT
//
// Usage:
//
// dispatch(claimDailyGift({
//     expectedClaimDate: status.claim_date,
// }));
//
// Explicit recovery:
//
// dispatch(claimDailyGift({
//     expectedClaimDate: status.claim_date,
//     recover: true,
// }));
//
// Recovery is limited to the same server calendar day.
// =========================================================

export const claimDailyGift = createAsyncThunk(
    "dailyGift/claim",

    async (argument, thunkAPI) => {
        const {
            signal,
            getState,
            requestId,
            rejectWithValue,
        } = thunkAPI;

        const {
            expectedClaimDate,
            recover = false,
        } = argument;

        const ownerId =
            getAuthenticatedUserId(getState());

        let claimSubmitted = false;

        try {
            // =============================================
            // STEP 01 — REFRESH ELIGIBILITY AND CSRF
            // =============================================

            const freshStatus =
                await DailyGiftService.getStatus({
                    eventSlug: DAILY_GIFT_EVENT_SLUG,
                    signal,
                });

            const currentState = getState();

            const currentGift =
                getGiftState(currentState);

            // =============================================
            // STEP 02 — SESSION AND REQUEST VALIDATION
            // =============================================

            if (
                !isSameSession(
                    currentState,
                    ownerId
                ) ||
                currentGift?.claim.requestId !== requestId
            ) {
                return rejectWithValue(
                    createSessionChangedError()
                );
            }

            if (signal.aborted) {
                return rejectWithValue(
                    createGiftError(
                        "request_canceled",
                        "So‘rov bekor qilindi.",
                        {
                            isCanceled: true,
                        }
                    )
                );
            }

            // =============================================
            // STEP 03 — CALENDAR DAY VALIDATION
            // =============================================

            if (
                typeof freshStatus?.claim_date !== "string" ||
                freshStatus.claim_date !== expectedClaimDate
            ) {
                return rejectWithValue(
                    createGiftError(
                        "claim_date_changed",

                        "Yangi kun boshlandi. Sovg‘a holatini yangilang.",

                        {
                            eligibility:
                                removeDailyGiftCsrfToken(
                                    freshStatus
                                ),
                        }
                    )
                );
            }

            // =============================================
            // STEP 04 — SAFE RETRY / RECOVERY
            // =============================================

            const recoveryAllowed =
                recover === true &&
                currentGift.claim.uncertainDate ===
                    expectedClaimDate;

            const canRecoverExistingClaim =
                recoveryAllowed &&
                freshStatus.claimed_today === true;

            if (
                freshStatus.can_claim !== true &&
                !canRecoverExistingClaim
            ) {
                return rejectWithValue(
                    createGiftError(
                        freshStatus.reason ||
                            "gift_unavailable",

                        freshStatus.message ||
                            "Hozir sovg‘ani ochish mumkin emas.",

                        {
                            status: 409,

                            eligibility:
                                removeDailyGiftCsrfToken(
                                    freshStatus
                                ),
                        }
                    )
                );
            }

            // =============================================
            // STEP 05 — CSRF VALIDATION
            // =============================================

            if (
                typeof freshStatus.csrf_token !== "string" ||
                !freshStatus.csrf_token.trim()
            ) {
                return rejectWithValue(
                    createGiftError(
                        "csrf_token_missing",
                        "Xavfsizlik tokenini olib bo‘lmadi."
                    )
                );
            }

            // =============================================
            // STEP 06 — SUBMIT EXACTLY ONE CLAIM REQUEST
            // =============================================

            claimSubmitted = true;

            const response =
                await DailyGiftService.claimGift({
                    eventSlug: DAILY_GIFT_EVENT_SLUG,

                    csrfToken:
                        freshStatus.csrf_token,

                    signal,
                });

            // =============================================
            // STEP 07 — IGNORE OLD SESSION RESPONSES
            // =============================================

            if (
                !isSameSession(
                    getState(),
                    ownerId
                )
            ) {
                return rejectWithValue(
                    createSessionChangedError()
                );
            }

            // =============================================
            // STEP 08 — PRESERVE BACKEND REWARD
            // =============================================

            const data =
                removeDailyGiftCsrfToken(
                    response.data
                );

            if (data?.status) {
                data.status =
                    removeDailyGiftCsrfToken(
                        data.status
                    );
            }

            return {
                httpStatus: response.status,
                data,
            };

        } catch (error) {
            return rejectWithValue(
                normalizeDailyGiftError(error, {
                    fallback:
                        "Sovg‘ani ochishda xatolik yuz berdi.",

                    claimSubmitted,
                })
            );
        }
    },

    {
        condition: (argument, { getState }) => {
            const state = getState();

            if (!hasValidSession(state)) {
                return false;
            }

            const gift = getGiftState(state);

            if (
                gift.claim.requestStatus === LOADING ||
                gift.status.requestStatus === LOADING
            ) {
                return false;
            }

            const expectedClaimDate =
                argument?.expectedClaimDate;

            const status =
                gift.status.data;

            if (
                typeof expectedClaimDate !== "string" ||
                !status ||
                status.claim_date !== expectedClaimDate
            ) {
                return false;
            }

            const hasUncertainClaim =
                gift.claim.uncertainDate ===
                    expectedClaimDate;

            // An uncertain claim must be recovered
            // explicitly, not through a normal auto retry.

            if (argument?.recover === true) {
                return (
                    hasUncertainClaim &&
                    (
                        status.can_claim === true ||
                        status.claimed_today === true
                    )
                );
            }

            return (
                !hasUncertainClaim &&
                status.can_claim === true
            );
        },
    }
);


// =========================================================
// FETCH DAILY GIFT HISTORY
// =========================================================

export const fetchDailyGiftHistory = createAsyncThunk(
    "dailyGift/fetchHistory",

    async (argument, thunkAPI) => {
        const {
            signal,
            getState,
            rejectWithValue,
        } = thunkAPI;

        const {
            page = DEFAULT_PAGE,
            pageSize = DEFAULT_PAGE_SIZE,
        } = argument ?? {};

        const ownerId =
            getAuthenticatedUserId(getState());

        try {
            const result =
                await DailyGiftService.getHistory({
                    eventSlug: DAILY_GIFT_EVENT_SLUG,
                    page,
                    pageSize,
                    signal,
                });

            if (
                !isSameSession(
                    getState(),
                    ownerId
                )
            ) {
                return rejectWithValue(
                    createSessionChangedError()
                );
            }

            return result;

        } catch (error) {
            return rejectWithValue(
                normalizeDailyGiftError(error, {
                    fallback:
                        "Sovg‘alar tarixini yuklab bo‘lmadi.",
                })
            );
        }
    },

    {
        condition: (_, { getState }) => {
            const state = getState();

            if (!hasValidSession(state)) {
                return false;
            }

            return (
                getGiftState(state)
                    .history.requestStatus !== LOADING
            );
        },
    }
);
