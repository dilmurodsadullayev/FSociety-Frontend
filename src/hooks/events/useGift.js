import { useCallback, useEffect } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { giftOwner } from "../../features/events/createGiftSlice";

export default function useGift(gift, eventSlug, {
    enabled = true, autoFetch = true, autoFetchHistory = false, refreshOnFocus = true,
} = {}) {
    const dispatch = useDispatch();
    const store = useStore();
    const slug = /^[a-zA-Z0-9_-]+$/.test(eventSlug ?? "") ? eventSlug : "";
    const auth = useSelector((s) => s.auth);
    const cache = useSelector(gift.select);
    const owned = cache.ownerId !== null && cache.ownerId === giftOwner(auth?.user) && auth?.isLoggedIn;
    const sessionReady = Boolean(enabled && slug && owned && !auth?.isLoading);
    const status = owned ? cache.statusByEvent[slug] ?? null : null;
    const claimResult = owned ? cache.claimByEvent[slug] ?? null : null;
    const history = owned ? cache.historyByEvent[slug] ?? null : null;
    const statusRequest = cache.statusRequestByEvent[slug] ?? "idle";
    const historyRequest = cache.historyRequestByEvent[slug] ?? "idle";
    const claimLoading = owned && cache.claimRequestByEvent[slug] === "loading";
    const statusLoading = owned && statusRequest === "loading";
    const needsReconciliation = owned && cache.needsReconciliationByEvent[slug] === true;
    const canClaim = useSelector((s) => sessionReady && gift.canClaim(s, slug));
    const refreshStatus = useCallback(() => sessionReady
        ? dispatch(gift.fetchStatus(slug)) : Promise.resolve(null), [dispatch, gift, sessionReady, slug]);
    const refreshHistory = useCallback((options = {}) => {
        const params = { page: options.page ?? 1, page_size: options.page_size ?? options.pageSize ?? 5 };
        return sessionReady ? dispatch(gift.fetchHistory({ slug, params })) : Promise.resolve(null);
    }, [dispatch, gift, sessionReady, slug]);
    const refresh = useCallback(() => Promise.all([refreshStatus(), refreshHistory()]), [refreshStatus, refreshHistory]);
    useEffect(() => {
        if (autoFetch && sessionReady && statusRequest === "idle") void refreshStatus();
    }, [autoFetch, sessionReady, statusRequest, refreshStatus]);
    useEffect(() => {
        if (autoFetchHistory && sessionReady && historyRequest === "idle") void refreshHistory();
    }, [autoFetchHistory, sessionReady, historyRequest, refreshHistory]);
    useEffect(() => {
        if (!sessionReady || !refreshOnFocus) return undefined;
        const onFocus = () => {
            if (document.visibilityState !== "hidden") void refresh();
        };
        window.addEventListener("focus", onFocus);
        document.addEventListener("visibilitychange", onFocus);
        return () => {
            window.removeEventListener("focus", onFocus);
            document.removeEventListener("visibilitychange", onFocus);
        };
    }, [sessionReady, refreshOnFocus, refresh]);
    // Only the server's time and next boundary schedule a GET. Never unlock locally.
    useEffect(() => {
        if (!sessionReady || !status) return undefined;
        const server = Date.parse(status.server_time);
        const target = Date.parse(status.next_claim_at ?? status.event_ends_at ?? status.ends_at);
        const received = cache.statusFetchedAtByEvent[slug];
        if (!Number.isFinite(server) || !Number.isFinite(target) || !received || target <= server) return undefined;
        const delay = Math.max(0, target - server - (Date.now() - received)) + 250;
        // Long waits are capped; reschedule only after the next authoritative read.
        const timer = window.setTimeout(() => { void refresh(); }, Math.min(delay, 2147483647));
        return () => window.clearTimeout(timer);
    }, [sessionReady, status, cache.statusFetchedAtByEvent, slug, refresh]);
    const claimGift = useCallback(async () => {
        if (!sessionReady) return { ok: false, skipped: true };
        const session = gift.select(store.getState()).sessionVersion;
        const action = await dispatch(gift.claim(slug));
        if (session !== gift.select(store.getState()).sessionVersion || !gift.sessionReady(store.getState())) {
            return { ok: false, skipped: true, reason: "SESSION_CHANGED" };
        }
        if (gift.claim.fulfilled.match(action)) return { ok: true, claim: action.payload.claim };
        return { ok: false, skipped: Boolean(action.meta?.condition), error: action.payload ?? action.error };
    }, [dispatch, gift, sessionReady, slug, store]);
    const dismissClaimError = useCallback(() => dispatch(gift.actions.clearClaimError(slug)), [dispatch, gift, slug]);
    return {
        slug, isValidSlug: Boolean(slug), isLoggedIn: Boolean(auth?.isLoggedIn), authLoading: Boolean(auth?.isLoading),
        sessionReady, ownerId: owned ? cache.ownerId : null, sessionVersion: cache.sessionVersion,
        status, statusRequest, statusLoading, statusError: owned ? cache.statusErrorByEvent[slug] : null,
        statusFetchedAt: owned ? cache.statusFetchedAtByEvent[slug] : null,
        claimResult, claimLoading, isOpening: claimLoading, claimError: owned ? cache.claimErrorByEvent[slug] : null,
        canClaim, canOpenGift: canClaim,
        alreadyClaimed: Boolean(owned && (gift.claimed(status) || (gift.name === "eventsSeasonalGift" && claimResult))),
        claimedToday: status?.claimed_today === true,
        needsReconciliation, isRecovering: needsReconciliation, accountSyncError: owned && cache.accountSyncError,
        history, historyLoading: owned && historyRequest === "loading", historyError: owned ? cache.historyErrorByEvent[slug] : null,
        historyPage: cache.historyPageByEvent[slug] ?? 1,
        isStatusLoaded: status !== null, isHistoryLoaded: history !== null,
        refreshStatus, refreshHistory, refresh, claimGift, dismissClaimError,
    };
}
