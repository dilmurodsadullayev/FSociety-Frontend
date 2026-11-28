
 // src/store/index.js

import {
    combineReducers,
    configureStore,
    createListenerMiddleware,
    isAnyOf,
} from "@reduxjs/toolkit";

// =========================================================
// AUTHENTICATION
// =========================================================

import AuthReducer, {
    logoutUser,
    signUserSuccess,
    signUserFailure,
    signUserFailer,
    checkAuthSuccess,
    checkAuthFailure,
} from "../features/auth/Auth";

// =========================================================
// EXISTING APPLICATION REDUCERS
// =========================================================

import CommentReducer from "../features/comments/Comment";

import ProblemReducer from "../features/problems/Problems";

import problemResponseReducer from "../features/problemResponse/problemResponse";

import UserReducer from "../features/users";

import FeedbackReducer from "../features/feedback";

import notificationReducer from "../features/notificationSlice";

import CoinReducer from "../features/coins";

import ProfileReducer from "../features/profile";

import ProjectReducer from "../features/projects";

import PostReducer from "../features/posts";

import RoadmapReducer from "../features/roadmap";

import BadgeReducer from "../features/badge";

import BotReducer from "../features/bot";

import promotionReducer from "../features/promotions";

// =========================================================
// SITE UPDATES
// =========================================================

import updatesReducer from "../features/updates/Updates";

// =========================================================
// PROFILE FRAMES
// =========================================================

import profileFramesReducer from "../features/profileFrames";

// =========================================================
// UNIVERSAL EVENTS
// =========================================================

import eventsReducer from "../features/events/eventsSlice";

// =========================================================
// EVENT GIFT — ONE TIME PER EVENT
// =========================================================

import seasonalGiftReducer, {
} from "../features/events/seasonalGiftSlice";

// =========================================================
// NOTIFICATION MIDDLEWARE
// =========================================================

import notificationMiddleware from "../middleware/notificationMiddleware";
import dailyGiftReducer, { dailyGift } from "../features/events/dailyGiftSlice";
import { seasonalGift } from "../features/events/seasonalGiftSlice";
import AuthService from "../services/auth";
import { setCoinBalance } from "../features/coins";
import { syncProfileCoins } from "../features/profile";

// =========================================================
// FSOCIETY — REDUX STORE
// =========================================================
//
// Existing state keys are preserved.
//
// Events:
//
// state.events
// state.eventsSeasonalGift
//
// state.eventsDailyGift
// Daily and seasonal gift eligibility and claims are independent.
//
// =========================================================


// =========================================================
// APPLICATION REDUCERS
// =========================================================

const appReducer = combineReducers({
    // Authentication
    auth: AuthReducer,

    // Comments
    comment: CommentReducer,

    // Problems
    problem: ProblemReducer,
    problemResponse: problemResponseReducer,

    // Users
    user: UserReducer,

    // Feedback
    feedback: FeedbackReducer,

    // Notifications
    notifications: notificationReducer,

    // Coins
    coin: CoinReducer,

    // Profile
    profile: ProfileReducer,

    // Projects
    project: ProjectReducer,

    // Posts
    post: PostReducer,

    // Roadmap
    roadmap: RoadmapReducer,

    // Badges
    badge: BadgeReducer,

    // Telegram Bot
    bot: BotReducer,

    // Site updates
    updates: updatesReducer,

    // Promotions
    promotion: promotionReducer,

    // Profile Frame Shop
    profileFrames: profileFramesReducer,

    // Public Events
    events: eventsReducer,

    // One-time Holiday Gifts
    eventsSeasonalGift: seasonalGiftReducer,
    eventsDailyGift: dailyGiftReducer,
});

// =========================================================
// AUTH HELPERS
// =========================================================

const getUserId = (user) => {
    if (
        !user ||
        typeof user !== "object" ||
        Array.isArray(user)
    ) {
        return null;
    }

    const id =
        user.id ??
        user.pk ??
        null;

    if (
        id === null ||
        id === undefined ||
        id === ""
    ) {
        return null;
    }

    return String(id);
};

const getUserFromPayload = (payload) =>
    payload?.user ??
    payload?.data?.user ??
    payload?.data ??
    payload;

// =========================================================
// AUTH ACTION GROUPS
// =========================================================

const AUTH_FAILURE_TYPES = new Set([
    logoutUser.type,
    signUserFailure.type,
    signUserFailer.type,
    checkAuthFailure.type,
]);

const AUTH_SUCCESS_TYPES = new Set([
    signUserSuccess.type,
    checkAuthSuccess.type,
]);

// =========================================================
// PRIVATE STATE INVALIDATION
// =========================================================
//
// Private cached data must not leak when:
//
// - The user logs out
// - Authentication fails
// - A different user logs in
// - An anonymous session becomes authenticated
//
// Public events remain available.
//
// Existing application reducers continue to
// handle their own authentication actions.
//
// =========================================================

const shouldResetPrivateState = (
    state,
    action
) => {
    if (!state) {
        return false;
    }

    if (
        AUTH_FAILURE_TYPES.has(action.type)
    ) {
        return true;
    }

    if (
        !AUTH_SUCCESS_TYPES.has(action.type)
    ) {
        return false;
    }

    const previousOwnerId = getUserId(
        state.auth?.user
    );

    const nextOwnerId = getUserId(
        getUserFromPayload(action.payload)
    );

    return (
        previousOwnerId === null ||
        nextOwnerId === null ||
        previousOwnerId !== nextOwnerId
    );
};

// =========================================================
// ROOT REDUCER
// =========================================================
//
// Only sensitive cached slices are reset here.
//
// Public Events are not removed on logout.
//
// Passing undefined initializes the private
// reducers with fresh initial state.
//
// The Seasonal Gift reducer also receives
// the original auth action and can initialize
// its ownerId.
//
// =========================================================

export const rootReducer = (
    state,
    action
) => {
    if (
        !state ||
        !shouldResetPrivateState(
            state,
            action
        )
    ) {
        return appReducer(
            state,
            action
        );
    }

    return appReducer(
        {
            ...state,

            // Private frame inventory
            profileFrames: undefined,

            // Gift reducers handle auth transitions with their session generation intact.
            coin: undefined,
            profile: undefined,
        },
        action
    );
};

// =========================================================
// EVENT GIFT LISTENER MIDDLEWARE
// =========================================================
//
// The backend selects the reward.
//
// After a successful claim:
// GET the authoritative gift status.
//
// After an uncertain claim:
// GET the authoritative gift status.
//
// NEVER retry the claim POST automatically.
//
// =========================================================

export const eventsListenerMiddleware = createListenerMiddleware();
let accountReadVersion = 0;

[dailyGift, seasonalGift].forEach((gift) => {
    eventsListenerMiddleware.startListening({
        matcher: isAnyOf(gift.claim.fulfilled, gift.claim.rejected),
        effect: (action, listenerApi) => {
            if (action.meta.condition) return;
            const slug = typeof action.meta.arg === "string" ? action.meta.arg : action.meta.arg?.slug;
            const before = gift.select(listenerApi.getOriginalState());
            // Ignore late POST responses from a previous login, including A → B → A.
            if (!slug || before.pendingClaimIds[slug] !== action.meta.requestId || !gift.sessionReady(listenerApi.getState())) return;
            listenerApi.dispatch(gift.fetchStatus(slug));
            listenerApi.dispatch(gift.fetchHistory({ slug, params: { page: 1, page_size: 5 } }));
        },
    });
    eventsListenerMiddleware.startListening({
        matcher: isAnyOf(gift.claim.fulfilled, gift.fetchStatus.fulfilled),
        effect: async (action, listenerApi) => {
            const { slug, ownerId, sessionVersion } = action.payload;
            const before = gift.select(listenerApi.getOriginalState());
            const wasClaim = gift.claim.fulfilled.match(action);
            const pendingIds = wasClaim ? before.pendingClaimIds : before.pendingStatusIds;
            if (pendingIds[slug] !== action.meta.requestId ||
                (!wasClaim && !gift.claimed(action.payload.status))) return;
            const current = () => {
                const state = listenerApi.getState();
                const cache = gift.select(state);
                return gift.sessionReady(state) && cache.ownerId === ownerId && cache.sessionVersion === sessionVersion;
            };
            if (!current()) return;
            const version = ++accountReadVersion;
            try {
                // Confirmed claims and later status reads refresh the authoritative balance.
                const response = await AuthService.getUser();
                if (!current() || version !== accountReadVersion) return;
                const user = response?.user ?? response;
                if (getUserId(user) !== ownerId) throw new Error("ACCOUNT_CHANGED");
                listenerApi.dispatch(checkAuthSuccess(user));
                if (Number.isSafeInteger(user.coins) && user.coins >= 0) {
                    listenerApi.dispatch(setCoinBalance(user.coins));
                    listenerApi.dispatch(syncProfileCoins({ username: user.username, coins: user.coins }));
                }
                listenerApi.dispatch(gift.actions.setAccountSyncError({ sessionVersion, failed: false }));
            } catch {
                if (current() && version === accountReadVersion) {
                    listenerApi.dispatch(gift.actions.setAccountSyncError({ sessionVersion, failed: true }));
                }
            }
        },
    });
});

// =========================================================
// CONFIGURE REDUX STORE
// =========================================================

export const store = configureStore({
    reducer: rootReducer,

    middleware: (
        getDefaultMiddleware
    ) =>
        getDefaultMiddleware().concat(
            notificationMiddleware,
            eventsListenerMiddleware.middleware
        ),

    devTools:
        process.env.NODE_ENV !== "production",
});

// =========================================================
// EXPORT
// =========================================================

export default store;
