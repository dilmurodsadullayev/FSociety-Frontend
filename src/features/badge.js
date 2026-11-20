import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import BadgeService from "../services/badge";
import { claimDailyGift } from "./dailyGift/dailyGiftThunks";
import { logoutUser, checkAuthFailure, checkAuthSuccess, signUserStart, signUserSuccess, signUserFailure, signUserFailer } from "./auth/Auth";

export const achievementRequestKey = ({ username, page = 1, search = "", filter = "" }) =>
    JSON.stringify([username, page, search, filter]);

const isAchievementList = value => Array.isArray(value) && value.every(item =>
    item && typeof item.badge?.name === "string" &&
    (item.id != null || item.badge_id != null || typeof item.badge.code === "string")
);

export function normalizeAchievementResponse(data, { page = 1, search = "", filter = "" } = {}, includeRecent = true) {
    if (isAchievementList(data?.results)) {
        if (!Number.isSafeInteger(data.count) || data.count < 0 ||
            (data.total_badges != null && (!Number.isSafeInteger(data.total_badges) || data.total_badges < 0)) ||
            (includeRecent && !isAchievementList(data.recent_badges)) ||
            (data.recent_badges !== undefined && !isAchievementList(data.recent_badges))) {
            throw new Error("Invalid paginated achievements response");
        }
        return { ...data, total_badges: data.total_badges ?? data.count, supportsFilters: true };
    }
    // The original endpoint returns the entire owned collection as `badges`.
    // Only that complete response may be searched/sliced locally; a server page
    // must never be mistaken for the owner's full collection or latest awards.
    if (!isAchievementList(data?.badges) ||
        (data.total_badges !== undefined && data.total_badges !== data.badges.length) || filter) {
        throw new Error("Invalid achievements response");
    }
    const all = [...data.badges].sort((left, right) => {
        const dateDifference = (Date.parse(right.awarded_at) || 0) - (Date.parse(left.awarded_at) || 0);
        if (dateDifference) return dateDifference;
        if (Number.isSafeInteger(left.id) && Number.isSafeInteger(right.id)) return right.id - left.id;
        return String(right.badge.code ?? right.badge_id ?? right.id)
            .localeCompare(String(left.badge.code ?? left.badge_id ?? left.id));
    });
    const term = search.trim().toLocaleLowerCase();
    const filtered = term ? all.filter(item => [item.badge.name, item.badge.description, item.badge.code]
        .some(value => typeof value === "string" && value.toLocaleLowerCase().includes(term))) : all;
    return {
        results: filtered.slice((page - 1) * 12, page * 12),
        count: filtered.length, total_badges: all.length, supportsFilters: false,
        ...(includeRecent ? { recent_badges: all.slice(0, 3) } : {}),
    };
}

export const fetchProfileAchievements = createAsyncThunk(
    "badge/fetchProfileAchievements",
    async ({ username, page = 1, search = "", filter = "" }, { signal, getState, rejectWithValue }) => {
        const filters = filter === "secret" ? { is_secret: "true" }
            : filter === "event" ? { source: "daily_gift" }
            : filter === "achievement" ? { reward_type: "achievement" }
            : filter ? { rarity: filter } : {};
        try {
            const state = getState().badge;
            const includeRecent = state.collection.recentRevision !== state.revision;
            const data = await BadgeService.getUserBadges(username, {
                signal, page, page_size: 12, search, include_recent: includeRecent ? 1 : undefined, ...filters,
            });
            return normalizeAchievementResponse(data, { page, search, filter }, includeRecent);
        } catch (error) {
            if (signal.aborted) throw error;
            return rejectWithValue("Yutuqlarni yuklab bo‘lmadi. Qayta urinib ko‘ring.");
        }
    },
    {
        condition: (args, { getState }) => {
            const collection = getState().badge.collection;
            return !(collection.status === "loading" && collection.key === achievementRequestKey(args));
        },
    }
);

const emptyCollection = () => ({
    username: null, key: null, requestId: null, status: "idle", error: null,
    results: [], recent: [], recentRevision: -1, total: 0, count: 0, supportsFilters: true,
});

const initialState = {
    isLoading: false,
    userBadges: [],
    totalBadges: 0,
    error: null,
    collection: emptyCollection(),
    revision: 0,
    authOwnerId: null,
};

export const BadgeSlice = createSlice({
    name: 'badge',
    initialState,
    reducers: {
        cancelAchievementRequest: (state, action) => {
            if (state.collection.requestId === action.payload) {
                state.collection.requestId = null;
                state.collection.status = "idle";
            }
        },
        getBadgesStart: state => {
            state.isLoading = true;
            state.error = null;
        },
        getBadgesSuccess: (state, action) => {
            state.isLoading = false;
            state.userBadges = action.payload.badges || [];
            state.totalBadges = action.payload.total_badges || 0;
        },
        getBadgesFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.userBadges = [];
        }
    },
    extraReducers: builder => builder
        .addCase(fetchProfileAchievements.pending, (state, action) => {
            const username = action.meta.arg.username;
            if (state.collection.username !== username) state.collection = emptyCollection();
            Object.assign(state.collection, {
                username, key: achievementRequestKey(action.meta.arg),
                requestId: action.meta.requestId, status: "loading", error: null,
            });
        })
        .addCase(fetchProfileAchievements.fulfilled, (state, action) => {
            if (state.collection.requestId !== action.meta.requestId) return;
            Object.assign(state.collection, {
                requestId: null, status: "success", error: null,
                results: action.payload.results,
                total: action.payload.total_badges, count: action.payload.count,
                supportsFilters: action.payload.supportsFilters !== false,
            });
            if (Array.isArray(action.payload.recent_badges)) {
                state.collection.recent = action.payload.recent_badges;
                state.collection.recentRevision = state.revision;
            }
        })
        .addCase(fetchProfileAchievements.rejected, (state, action) => {
            if (state.collection.requestId !== action.meta.requestId) return;
            state.collection.requestId = null;
            state.collection.status = action.meta.aborted ? "idle" : "failed";
            state.collection.error = action.payload;
        })
        .addCase(claimDailyGift.fulfilled, state => {
            // Includes recovered claims. Only a fresh GET can establish ownership;
            // coin and duplicate compensation responses never append local items.
            state.revision += 1;
            state.collection.requestId = null;
            state.collection.status = "idle";
        })
        .addCase(checkAuthSuccess, (state, action) => {
            const user = action.payload?.user ?? action.payload;
            const ownerId = user?.id ?? user?.pk ?? null;
            if (state.authOwnerId !== ownerId) {
                state.collection = emptyCollection();
                state.revision += 1;
                state.authOwnerId = ownerId;
            }
        })
        .addMatcher(isAnyOf(logoutUser, checkAuthFailure, signUserStart, signUserSuccess, signUserFailure, signUserFailer), (state, action) => ({
            ...initialState, collection: emptyCollection(), revision: state.revision + 1,
            authOwnerId: signUserSuccess.match(action) ? (action.payload?.user ?? action.payload)?.id ?? null : null,
        })),
});

export const { getBadgesStart, getBadgesSuccess, getBadgesFailure, cancelAchievementRequest } = BadgeSlice.actions;
export default BadgeSlice.reducer;
