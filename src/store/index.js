
 // src/store/index.js

import {
    combineReducers,
    configureStore,
    createListenerMiddleware,
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
    claimSeasonalGiftForEvent,
    fetchSeasonalGiftStatusForEvent,
} from "../features/events/seasonalGiftSlice";

// =========================================================
// NOTIFICATION MIDDLEWARE
// =========================================================

import notificationMiddleware from "../middleware/notificationMiddleware";

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
// REMOVED:
//
// state.dailyGift
// state.eventsDailyGift
//
// A user may receive ONE randomly selected
// reward for each eligible holiday event.
//
// No daily gift system is registered.
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

            // Private event gift data
            eventsSeasonalGift: undefined,
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

const eventsListenerMiddleware =
    createListenerMiddleware();

// =========================================================
// VERIFY CURRENT AUTH SESSION
// =========================================================

const hasCurrentGiftOwner = (
    state,
    expectedOwnerId
) => {
    if (!expectedOwnerId) {
        return false;
    }

    const authOwnerId = getUserId(
        state.auth?.user
    );

    return Boolean(
        state.auth?.isLoggedIn &&
        authOwnerId === expectedOwnerId &&
        state.eventsSeasonalGift?.ownerId ===
            expectedOwnerId
    );
};

// =========================================================
// CLAIM SUCCESS LISTENER
// =========================================================
//
// When a gift is successfully opened:
//
// 1. The POST has completed.
// 2. The Redux claim result is stored.
// 3. A GET refreshes eligibility.
//
// This does not create another reward.
//
// =========================================================

eventsListenerMiddleware.startListening({
    matcher:
        claimSeasonalGiftForEvent.fulfilled.match,

    effect: (action, listenerApi) => {
        const {
            slug,
            ownerId,
        } = action.payload ?? {};

        if (!slug || !ownerId) {
            return;
        }

        const state =
            listenerApi.getState();

        if (
            !hasCurrentGiftOwner(
                state,
                ownerId
            )
        ) {
            return;
        }

        listenerApi.dispatch(
            fetchSeasonalGiftStatusForEvent(
                slug
            )
        );
    },
});

// =========================================================
// UNCERTAIN CLAIM LISTENER
// =========================================================
//
// Examples:
//
// - Network timeout
// - Disconnected connection
// - HTTP 503
// - HTTP 409 requiring reconciliation
//
// The server may already have committed
// the reward.
//
// Only GET is safe for automatic recovery.
//
// =========================================================

eventsListenerMiddleware.startListening({
    matcher:
        claimSeasonalGiftForEvent.rejected.match,

    effect: (action, listenerApi) => {
        // A rejected condition means that
        // no POST was executed.

        if (
            action.meta?.condition === true
        ) {
            return;
        }

        const rawArg = action.meta?.arg;

        const slug =
            typeof rawArg === "string"
                ? rawArg.trim()
                : typeof rawArg?.slug === "string"
                  ? rawArg.slug.trim()
                  : "";

        if (!slug) {
            return;
        }

        const state =
            listenerApi.getState();

        const giftState =
            state.eventsSeasonalGift;

        // Reconcile only when the claim
        // reducer explicitly marked this
        // event as uncertain.

        if (
            giftState
                ?.needsReconciliationByEvent
                ?.[slug] !== true
        ) {
            return;
        }

        if (
            !hasCurrentGiftOwner(
                state,
                giftState?.ownerId
            )
        ) {
            return;
        }

        // Important:
        // This is a GET, never another POST.

        listenerApi.dispatch(
            fetchSeasonalGiftStatusForEvent(
                slug
            )
        );
    },
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
