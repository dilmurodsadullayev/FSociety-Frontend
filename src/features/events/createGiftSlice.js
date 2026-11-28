import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
    checkAuthFailure, checkAuthSuccess, logoutUser,
    signUserFailer, signUserFailure, signUserSuccess,
} from "../auth/Auth";

export const GIFT_REQUEST_STATUS = Object.freeze({
    IDLE: "idle", LOADING: "loading", SUCCEEDED: "succeeded", FAILED: "failed",
});
export const giftOwner = (user) => {
    const id = (user?.user ?? user)?.id ?? (user?.user ?? user)?.pk;
    return id == null ? null : String(id);
};
const slugOf = (arg) => typeof arg === "string" ? arg : arg?.slug;
const initial = (ownerId = null, sessionVersion = 0) => ({
    ownerId, sessionVersion, accountSyncError: false,
    statusByEvent: {}, claimByEvent: {}, historyByEvent: {},
    statusRequestByEvent: {}, claimRequestByEvent: {}, historyRequestByEvent: {},
    statusErrorByEvent: {}, claimErrorByEvent: {}, historyErrorByEvent: {},
    pendingStatusIds: {}, pendingClaimIds: {}, pendingHistoryIds: {},
    statusFetchedAtByEvent: {}, needsReconciliationByEvent: {},
    reconciliationChecksByEvent: {}, historyPageByEvent: {},
});

// Each kind owns its requests and claims; all mounts share the same Redux cache.
export default function createGiftSlice({ key, kind, api }) {
    const empty = initial();
    const select = (state) => state[key] ?? empty;
    const claimed = (status) => status?.[kind === "daily" ? "claimed_today" : "already_claimed"] === true;
    const sessionReady = (state) => state.auth?.isLoggedIn && !state.auth?.isLoading &&
        select(state).ownerId !== null && select(state).ownerId === giftOwner(state.auth?.user);
    const canClaim = (state, slug) => {
        const s = select(state);
        return Boolean(sessionReady(state) && s.statusByEvent[slug]?.can_claim === true &&
            !claimed(s.statusByEvent[slug]) && !s.needsReconciliationByEvent[slug] &&
            !["loading", "failed"].includes(s.statusRequestByEvent[slug]) && s.claimRequestByEvent[slug] !== "loading" &&
            (kind === "daily" || !s.claimByEvent[slug]));
    };
    const allowed = (state, slug, operation) => sessionReady(state) && /^[a-zA-Z0-9_-]+$/.test(slug ?? "") &&
        select(state)[`${operation}RequestByEvent`][slug] !== "loading" &&
        select(state).claimRequestByEvent[slug] !== "loading";
    const request = (operation, run) => createAsyncThunk(`${key}/${operation === "status" ? "fetchStatus" : operation === "history" ? "fetchHistory" : "claim"}`,
        async (arg, { getState, signal, rejectWithValue }) => {
            const slug = slugOf(arg);
            const { ownerId, sessionVersion } = select(getState());
            try {
                const data = await run(slug, arg, signal);
                return { slug, ownerId, sessionVersion, [operation]: data, fetchedAt: Date.now(), page: arg?.params?.page ?? 1 };
            } catch (error) {
                const normalized = api.normalizeError(error);
                return rejectWithValue({ ...normalized,
                    needsReconciliation: operation === "claim" &&
                        (normalized.status == null || normalized.status >= 500 || [408, 409].includes(normalized.status)),
                });
            }
        }, {
            condition: (arg, { getState }) => operation === "claim"
                ? allowed(getState(), slugOf(arg), operation) && canClaim(getState(), slugOf(arg))
                : allowed(getState(), slugOf(arg), operation),
        });
    const fetchStatus = request("status", (slug, arg, signal) => api.status(slug, { signal }));
    const fetchHistory = request("history", (slug, arg, signal) => api.history(slug, { params: arg?.params, signal }));
    const claim = request("claim", (slug) => api.claim(slug));
    const slice = createSlice({
        name: key, initialState: initial(),
        reducers: {
            setAccountSyncError(s, a) {
                if (a.payload.sessionVersion === s.sessionVersion) s.accountSyncError = a.payload.failed;
            },
            clearStatusError(s, a) { s.statusErrorByEvent[slugOf(a.payload)] = null; },
            clearClaimError(s, a) { s.claimErrorByEvent[slugOf(a.payload)] = null; },
            clearHistoryError(s, a) { s.historyErrorByEvent[slugOf(a.payload)] = null; },
            invalidateEvent(s, a) {
                const slug = slugOf(a.payload);
                for (const op of ["status", "history"]) {
                    delete s[`${op}ByEvent`][slug];
                    delete s[`pending${op === "status" ? "Status" : "History"}Ids`][slug];
                    s[`${op}RequestByEvent`][slug] = "idle";
                }
            },
            reset(s) { return initial(null, s.sessionVersion + 1); },
        },
        extraReducers: (builder) => {
            for (const [op, thunk, idKey] of [["status", fetchStatus, "pendingStatusIds"], ["history", fetchHistory, "pendingHistoryIds"], ["claim", claim, "pendingClaimIds"]]) {
                builder.addCase(thunk.pending, (s, a) => {
                    const slug = slugOf(a.meta.arg);
                    s[`${op}RequestByEvent`][slug] = "loading";
                    s[`${op}ErrorByEvent`][slug] = null;
                    s[idKey][slug] = a.meta.requestId;
                    if (op === "claim") {
                        // GETs started before this POST cannot overwrite its result.
                        for (const [o, ids] of [["status", "pendingStatusIds"], ["history", "pendingHistoryIds"]]) {
                            delete s[ids][slug];
                            s[`${o}RequestByEvent`][slug] = "idle";
                        }
                    }
                });
                builder.addCase(thunk.fulfilled, (s, a) => {
                    const { slug, ownerId, sessionVersion } = a.payload;
                    if (s.ownerId !== ownerId || s.sessionVersion !== sessionVersion || s[idKey][slug] !== a.meta.requestId) return;
                    delete s[idKey][slug];
                    s[`${op}RequestByEvent`][slug] = "succeeded";
                    s[`${op}ByEvent`][slug] = a.payload[op];
                    if (op === "status") s.statusFetchedAtByEvent[slug] = a.payload.fetchedAt;
                    if (op === "history") s.historyPageByEvent[slug] = a.payload.page;
                    if (op === "claim") {
                        const status = a.payload.claim.status;
                        if (status) {
                            s.statusByEvent[slug] = status;
                            s.statusFetchedAtByEvent[slug] = a.payload.fetchedAt;
                        }
                        delete s.historyByEvent[slug];
                        s.historyRequestByEvent[slug] = "idle";
                        s.needsReconciliationByEvent[slug] = false;
                    } else if (s.needsReconciliationByEvent[slug]) {
                        const checks = s.reconciliationChecksByEvent[slug] ?? {};
                        checks[op] = true;
                        s.reconciliationChecksByEvent[slug] = checks;
                        // Require both reads; a timeout never triggers another POST.
                        if (checks.status && checks.history) {
                            s.needsReconciliationByEvent[slug] = false;
                            s.claimErrorByEvent[slug] = null;
                        }
                    }
                });
                builder.addCase(thunk.rejected, (s, a) => {
                    const slug = slugOf(a.meta.arg);
                    if (s[idKey][slug] !== a.meta.requestId) return;
                    delete s[idKey][slug];
                    s[`${op}RequestByEvent`][slug] = "failed";
                    s[`${op}ErrorByEvent`][slug] = a.payload ?? { message: "So‘rovni bajarib bo‘lmadi." };
                    if (op === "claim") {
                        s.needsReconciliationByEvent[slug] = Boolean(a.payload?.needsReconciliation || a.meta.aborted);
                        s.reconciliationChecksByEvent[slug] = {};
                        // Disable stale eligibility even after a definitive API error.
                        delete s.statusByEvent[slug];
                    }
                });
            }
            builder.addMatcher(isAnyOf(signUserSuccess, checkAuthSuccess), (s, a) => {
                const owner = giftOwner(a.payload);
                if (s.ownerId !== owner) return initial(owner, s.sessionVersion + 1);
            });
            builder.addMatcher(isAnyOf(logoutUser, checkAuthFailure, signUserFailure, signUserFailer),
                (s) => initial(null, s.sessionVersion + 1));
        },
    });
    return { ...slice, select, fetchStatus, fetchHistory, claim, canClaim, claimed, sessionReady };
}
