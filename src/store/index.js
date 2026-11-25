
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

import updatesReducer from "../features/updates/Updates";
import profileFramesReducer from "../features/profileFrames";

// =========================================================
// UNIVERSAL EVENTS
// =========================================================

import eventsReducer from "../features/events/eventsSlice";

import dailyGiftReducer from "../features/events/dailyGiftSlice";

import seasonalGiftReducer, {
    claimSeasonalGiftForEvent,
    fetchSeasonalGiftStatusForEvent,
} from "../features/events/seasonalGiftSlice";

// =========================================================
// EXISTING MIDDLEWARE
// =========================================================

import notificationMiddleware from "../middleware/notificationMiddleware";

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

    const id = user.id ?? user.pk;

    return id === null ||
        id === undefined ||
        id === ""
        ? null
        : String(id);
};

const getUserFromPayload = (payload) =>
    payload?.user ??
    payload?.data?.user ??
    payload?.data ??
    payload;

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

const shouldResetPrivateState = (
    state,
    action
) => {
    if (!state) {
        return false;
    }

    if (
        AUTH_FAILURE_TYPES.has(
            action.type
        )
    ) {
        return true;
    }

    if (
        !AUTH_SUCCESS_TYPES.has(
            action.type
        )
    ) {
        return false;
    }

    const previousId = getUserId(
        state.auth?.user
    );

    const nextId = getUserId(
        getUserFromPayload(
            action.payload
        )
    );

    return (
        previousId === null ||
        nextId === null ||
        previousId !== nextId
    );
};

// =========================================================
// APPLICATION REDUCERS
// =========================================================
//
// Existing Redux keys are preserved.
//
// New Events keys:
//
// state.events
// state.eventsDailyGift
// state.eventsSeasonalGift
//
// The removed state.dailyGift is no longer
// registered.
//
// =========================================================

const appReducer = combineReducers({
    // Auth
    auth: AuthReducer,

    // Community
    comment: CommentReducer,
    problem: ProblemReducer,
    problemResponse: problemResponseReducer,

    // User / Profile
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

    // Roadmap
    roadmap: RoadmapReducer,

    // Achievements
    badge: BadgeReducer,

    // Telegram
    bot: BotReducer,

    // Updates
    updates: updatesReducer,

    // Promotions
    promotion: promotionReducer,

    // Profile frames
    profileFrames: profileFramesReducer,

    // Universal Events
    events: eventsReducer,

    // Daily Gift
    eventsDailyGift: dailyGiftReducer,

    // Seasonal Gift
    eventsSeasonalGift: seasonalGiftReducer,
});

// =========================================================
// ROOT REDUCER
// =========================================================
//
// Private state must not survive account changes.
//
// We preserve public events while clearing:
// - Profile frames inventory
// - Daily Gift private state
// - Seasonal Gift private state
//
// =========================================================

export const rootReducer = (
    state,
    action
) => {
    if (!state) {
        return appReducer(
            state,
            action
        );
    }

    if (
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

            profileFrames: undefined,

            eventsDailyGift: undefined,

            eventsSeasonalGift: undefined,
        },
        action
    );
};

// =========================================================
// SEASONAL GIFT LISTENER
// =========================================================
//
// Important:
//
// Claim POST can succeed on the server even
// when the browser receives a network error.
//
// We NEVER retry that POST automatically.
//
// We only fetch the status with GET.
//
// =========================================================

const eventsListenerMiddleware =
    createListenerMiddleware();

// =========================================================
// SUCCESSFUL CLAIM
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
            !state.auth?.isLoggedIn ||
            state.eventsSeasonalGift?.ownerId !==
                ownerId
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
// UNCERTAIN CLAIM RESULT
// =========================================================

eventsListenerMiddleware.startListening({
    matcher:
        claimSeasonalGiftForEvent.rejected.match,

    effect: (action, listenerApi) => {
        const arg = action.meta?.arg;

        const slug =
            typeof arg === "string"
                ? arg.trim()
                : typeof arg?.slug === "string"
                  ? arg.slug.trim()
                  : "";

        if (!slug) {
            return;
        }

        const state =
            listenerApi.getState();

        const needsReconciliation =
            state.eventsSeasonalGift
                ?.needsReconciliationByEvent
                ?.[slug] === true;

        if (
            !needsReconciliation ||
            !state.auth?.isLoggedIn ||
            !state.eventsSeasonalGift?.ownerId
        ) {
            return;
        }

        // GET only.
        // No second claim POST.
        listenerApi.dispatch(
            fetchSeasonalGiftStatusForEvent(
                slug
            )
        );
    },
});

// =========================================================
// STORE
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
        process.env.NODE_ENV !==
        "production",
});

// =========================================================
// EXPORT
// =========================================================

export default store;
