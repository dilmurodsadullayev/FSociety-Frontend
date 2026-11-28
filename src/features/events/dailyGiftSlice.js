import createGiftSlice, { GIFT_REQUEST_STATUS } from "./createGiftSlice";
import { getDailyGiftStatus, getDailyGiftHistory, claimDailyGift, normalizeDailyGiftError } from "../../services/events/dailyGiftApi";

export const dailyGift = createGiftSlice({
    key: "eventsDailyGift", kind: "daily",
    api: {
        status: getDailyGiftStatus,
        history: (slug, { params, signal }) => getDailyGiftHistory(slug, { page: params?.page, pageSize: params?.page_size, signal }),
        claim: claimDailyGift,
        normalizeError: normalizeDailyGiftError,
    },
});
export const DAILY_GIFT_REQUEST_STATUS = GIFT_REQUEST_STATUS;
export const fetchDailyGiftStatusForEvent = dailyGift.fetchStatus;
export const fetchDailyGiftHistoryForEvent = dailyGift.fetchHistory;
export const claimDailyGiftForEvent = dailyGift.claim;
export const {
    clearStatusError: clearDailyGiftStatusError,
    clearClaimError: clearDailyGiftClaimError,
    clearHistoryError: clearDailyGiftHistoryError,
    invalidateEvent: invalidateDailyGiftEvent,
    reset: resetDailyGiftState,
} = dailyGift.actions;
export const selectDailyGiftOwner = (state) => dailyGift.select(state).ownerId;
export const selectDailyGiftEventStatus = (state, slug) => dailyGift.select(state).statusByEvent[slug] ?? null;
export const selectDailyGiftStatusLoading = (state, slug) => dailyGift.select(state).statusRequestByEvent[slug] === "loading";
export const selectDailyGiftStatusError = (state, slug) => dailyGift.select(state).statusErrorByEvent[slug] ?? null;
export const selectDailyGiftEventClaim = (state, slug) => dailyGift.select(state).claimByEvent[slug] ?? null;
export const selectDailyGiftClaimLoading = (state, slug) => dailyGift.select(state).claimRequestByEvent[slug] === "loading";
export const selectDailyGiftClaimError = (state, slug) => dailyGift.select(state).claimErrorByEvent[slug] ?? null;
export const selectDailyGiftEventHistory = (state, slug) => dailyGift.select(state).historyByEvent[slug] ?? null;
export const selectDailyGiftHistoryLoading = (state, slug) => dailyGift.select(state).historyRequestByEvent[slug] === "loading";
export const selectDailyGiftHistoryError = (state, slug) => dailyGift.select(state).historyErrorByEvent[slug] ?? null;
export const selectDailyGiftStatusFetchedAt = (state, slug) => dailyGift.select(state).statusFetchedAtByEvent[slug] ?? null;
export const selectDailyGiftNeedsReconciliation = (state, slug) => dailyGift.select(state).needsReconciliationByEvent[slug] === true;
export const selectDailyGiftAlreadyClaimed = (state, slug) => dailyGift.claimed(dailyGift.select(state).statusByEvent[slug]);
export const selectDailyGiftCanClaim = dailyGift.canClaim;
export default dailyGift.reducer;
