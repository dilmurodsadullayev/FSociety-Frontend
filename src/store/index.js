
 // src/store/index.js

import {
    combineReducers,
    configureStore,
    createListenerMiddleware,
} from "@reduxjs/toolkit";

// =========================================================
// AUTH
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
// EXISTING REDUCERS
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

import updatesReducer from "../features/updates/Updates";
import profileFramesReducer from "../features/profileFrames";

// =========================================================
// LEGACY DAILY GIFT
// =========================================================
//
// Keep state.dailyGift unchanged until the
// controlled Daily Gift migration is complete.
// =========================================================

import DailyGiftReducer from "../features/dailyGift/dailyGiftSlice";

// =========================================================
// NEW UNIVERSAL EVENTS
// =========================================================

import eventsReducer from "../features/events/eventsSlice";

import eventsDailyGiftReducer from "../features/events/dailyGiftSlice";

import eventsSeasonalGiftReducer, {
    claimSeasonalGiftForEvent,
    fetchSeasonalGiftStatusForEvent,
} from "../features/events/seasonalGiftSlice";

// =========================================================
// EXISTING MIDDLEWARE
// =========================================================

import notificationMiddleware from "../middleware/notificationMiddleware";

// =========================================================
// APPLICATION REDUCERS
// =========================================================
//
// Existing Redux keys must remain unchanged.
//
// Legacy:
//   state.dailyGift
//
// New:
//   state.events
//   state.eventsDailyGift
//   state.eventsSeasonalGift
//
// =========================================================

const appReducer = combineReducers({
    // Authentication
    auth: AuthReducer,

    // Community
    comment: CommentReducer,
    problem: ProblemReducer,
    problemResponse: problemResponseReducer,

    // Users
    user: UserReducer,
    profile: ProfileReducer,

    // Feedback
    feedback: FeedbackReducer,

    // Notifications
    notifications: notificationReducer,

    // FCoin
    coin: CoinReducer,

    // Projects / Posts
    project: ProjectReducer,
    post: PostReducer,
    roadmap: RoadmapReducer,

    // Badges / Bot
    badge: BadgeReducer,
    bot: BotReducer,

    // Site updates
    updates: updatesReducer,

    // Promotions
    promotion: promotionReducer,

    // Frame Shop
    profileFrames: profileFramesReducer,

    // Existing Daily Gift
    dailyGift: DailyGiftReducer,

    // New Events architecture
    events: eventsReducer,

    // Daily Gift — new architecture
    eventsDailyGift: eventsDailyGiftReducer,

    // Seasonal Gift
    eventsSeasonalGift: eventsSeasonalGiftReducer,
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

    const id = user.id ?? user.pk ?? null;

    return id === null || id === ""
        ? null
        : String(id);
};

const getActionUser = (payload) => {
    return (
        payload?.user ??
        payload?.data?.user ??
        payload?.data ??
        payload
    );
};

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

const isAuthFailure = (action) =>
    AUTH_FAILURE_TYPES.has(action.type);

const isAuthSuccess = (action) =>
    AUTH_SUCCESS_TYPES.has(action.type);

// =========================================================
// PRIVATE STATE INVALIDATION
// =========================================================
//
// Preserve existing Frame Shop behavior.
//
// In addition, protect new private gift caches
// when authentication changes.
//
// Public event information does not contain
// user reward ownership and is retained.
// =========================================================

const shouldResetPrivateState = (
    state,
    action
) => {
    if (!state) {
        return false;
    }

    if (isAuthFailure(action)) {
        return true;
    }

    if (!isAuthSuccess(action)) {
        return false;
    }

    const previousUserId = getUserId(
        state.auth?.user
    );

    const nextUserId = getUserId(
        getActionUser(action.payload)
    );

    if (
        previousUserId === null ||
        nextUserId === null
    ) {
        return true;
    }

    return previousUserId !== nextUserId;
};

// =========================================================
// ROOT REDUCER
// =========================================================

const rootReducer = (
    state,
    action
) => {
    if (!state) {
        return appReducer(state, action);
    }

    const resetPrivate =
        shouldResetPrivateState(state, action);

    if (!resetPrivate) {
        return appReducer(state, action);
    }

    // Only the private caches are invalidated.
    // Existing Redux reducers receive the action
    // and keep their original behavior.
    return appReducer(
        {
            ...state,

            profileFrames: undefined,

            eventsDailyGift: undefined,

            eventsSeasonalGift: undefined,
        },
        action
    );
};

// =========================================================
// SEASONAL GIFT RECONCILIATION
// =========================================================
//
// A claim POST may succeed in Django while the
// browser receives a network error or timeout.
//
// We must never automatically repeat that POST.
//
// Listener middleware runs AFTER reducers have
// processed the fulfilled/rejected action.
//
// This prevents the earlier timing issue where
// a status GET could finish before the Redux
// claim state was updated.
//
// =========================================================

const seasonalGiftListener =
    createListenerMiddleware();

// =========================================================
// SUCCESSFUL CLAIM
// =========================================================
//
// Refresh authoritative status using GET only.
// =========================================================

seasonalGiftListener.startListening({
    matcher: claimSeasonalGiftForEvent.fulfilled.match,

    effect: (action, listenerApi) => {
        const {
            slug,
            ownerId,
        } = action.payload ?? {};

        if (!slug || !ownerId) {
            return;
        }

        const state = listenerApi.getState();

        if (
            !state.auth?.isLoggedIn ||
            state.eventsSeasonalGift?.ownerId !==
                ownerId
        ) {
            return;
        }

        listenerApi.dispatch(
            fetchSeasonalGiftStatusForEvent(slug)
        );
    },
});

// =========================================================
// UNCERTAIN CLAIM
// =========================================================
//
// GET status after an uncertain POST result.
//
// Never issue another claim POST automatically.
// =========================================================

seasonalGiftListener.startListening({
    matcher: claimSeasonalGiftForEvent.rejected.match,

    effect: (action, listenerApi) => {
        const slug =
            typeof action.meta?.arg === "string"
                ? action.meta.arg.trim()
                : action.meta?.arg?.slug?.trim?.();

        if (!slug) {
            return;
        }

        const state = listenerApi.getState();

        const isUncertain =
            state.eventsSeasonalGift
                ?.needsReconciliationByEvent?.[slug] ===
            true;

        if (
            !isUncertain ||
            !state.auth?.isLoggedIn ||
            !state.eventsSeasonalGift?.ownerId
        ) {
            return;
        }

        listenerApi.dispatch(
            fetchSeasonalGiftStatusForEvent(slug)
        );
    },
});

// =========================================================
// STORE
// =========================================================

export const store = configureStore({
    reducer: rootReducer,

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            notificationMiddleware,
            seasonalGiftListener.middleware
        ),

    devTools:
        process.env.NODE_ENV !== "production",
});

// =========================================================
// EXPORTS
// =========================================================

export {
    rootReducer,
};

export default store;
