import createGiftSlice, { GIFT_REQUEST_STATUS } from "./createGiftSlice";
import { getSeasonalGiftStatus, getSeasonalGiftHistory, claimSeasonalGift, normalizeSeasonalGiftError } from "../../services/events/seasonalGiftApi";

export const seasonalGift = createGiftSlice({
    key: "eventsSeasonalGift", kind: "seasonal",
    api: {
        status: getSeasonalGiftStatus,
        history: getSeasonalGiftHistory,
        claim: claimSeasonalGift,
        normalizeError: normalizeSeasonalGiftError,
    },
});
export const SEASONAL_GIFT_REQUEST_STATUS = GIFT_REQUEST_STATUS;
export const fetchSeasonalGiftStatusForEvent = seasonalGift.fetchStatus;
export const fetchSeasonalGiftHistoryForEvent = seasonalGift.fetchHistory;
export const claimSeasonalGiftForEvent = seasonalGift.claim;
export const {
    clearStatusError: clearSeasonalGiftStatusError,
    clearClaimError: clearSeasonalGiftClaimError,
    clearHistoryError: clearSeasonalGiftHistoryError,
    invalidateEvent: invalidateSeasonalGiftEvent,
    reset: resetSeasonalGiftState,
} = seasonalGift.actions;
export const selectSeasonalGiftOwner = (state) => seasonalGift.select(state).ownerId;
export const selectSeasonalGiftEventStatus = (state, slug) => seasonalGift.select(state).statusByEvent[slug] ?? null;
export const selectSeasonalGiftStatusLoading = (state, slug) => seasonalGift.select(state).statusRequestByEvent[slug] === "loading";
export const selectSeasonalGiftStatusError = (state, slug) => seasonalGift.select(state).statusErrorByEvent[slug] ?? null;
export const selectSeasonalGiftEventClaim = (state, slug) => seasonalGift.select(state).claimByEvent[slug] ?? null;
export const selectSeasonalGiftClaimLoading = (state, slug) => seasonalGift.select(state).claimRequestByEvent[slug] === "loading";
export const selectSeasonalGiftClaimError = (state, slug) => seasonalGift.select(state).claimErrorByEvent[slug] ?? null;
export const selectSeasonalGiftEventHistory = (state, slug) => seasonalGift.select(state).historyByEvent[slug] ?? null;
export const selectSeasonalGiftHistoryLoading = (state, slug) => seasonalGift.select(state).historyRequestByEvent[slug] === "loading";
export const selectSeasonalGiftHistoryError = (state, slug) => seasonalGift.select(state).historyErrorByEvent[slug] ?? null;
export const selectSeasonalGiftStatusFetchedAt = (state, slug) => seasonalGift.select(state).statusFetchedAtByEvent[slug] ?? null;
export const selectSeasonalGiftNeedsReconciliation = (state, slug) => seasonalGift.select(state).needsReconciliationByEvent[slug] === true;
export const selectSeasonalGiftAlreadyClaimed = (state, slug) => seasonalGift.claimed(seasonalGift.select(state).statusByEvent[slug]) || Boolean(seasonalGift.select(state).claimByEvent[slug]);
export const selectSeasonalGiftCanClaim = seasonalGift.canClaim;
export default seasonalGift.reducer;
