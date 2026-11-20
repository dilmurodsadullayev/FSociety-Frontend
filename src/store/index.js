
// src/store/index.js

import {
    combineReducers,
    configureStore,
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


// =========================================================
// SITE UPDATES
// =========================================================

import updatesReducer from "../features/updates/Updates";


// =========================================================
// PROFILE FRAMES SHOP
// =========================================================

import profileFramesReducer from "../features/profileFrames";


// =========================================================
// DAILY NEW YEAR GIFT 2027
// =========================================================

import DailyGiftReducer from "../features/dailyGift/dailyGiftSlice";


// =========================================================
// MIDDLEWARE
// =========================================================

import notificationMiddleware from "../middleware/notificationMiddleware";


// =========================================================
// FSOCIETY — APPLICATION REDUCERS
// =========================================================
//
// Important:
//
// Keep all existing Redux keys unchanged.
//
// Components depend on:
//
// state.auth
// state.user
// state.coin
// state.profile
// state.notifications
// state.profileFrames
// etc.
//
// Daily New Year Gift:
//
// state.dailyGift
//
// =========================================================

const appReducer = combineReducers({

    // =====================================================
    // AUTH
    // =====================================================

    auth: AuthReducer,


    // =====================================================
    // COMMENTS
    // =====================================================

    comment: CommentReducer,


    // =====================================================
    // PROBLEMS
    // =====================================================

    problem: ProblemReducer,

    problemResponse: problemResponseReducer,


    // =====================================================
    // USERS
    // =====================================================

    user: UserReducer,


    // =====================================================
    // FEEDBACK
    // =====================================================

    feedback: FeedbackReducer,


    // =====================================================
    // NOTIFICATIONS
    // =====================================================

    notifications: notificationReducer,


    // =====================================================
    // COINS
    // =====================================================

    coin: CoinReducer,


    // =====================================================
    // PROFILE
    // =====================================================

    profile: ProfileReducer,


    // =====================================================
    // PROJECTS
    // =====================================================

    project: ProjectReducer,


    // =====================================================
    // POSTS
    // =====================================================

    post: PostReducer,


    // =====================================================
    // ROADMAP
    // =====================================================

    roadmap: RoadmapReducer,


    // =====================================================
    // BADGES
    // =====================================================

    badge: BadgeReducer,


    // =====================================================
    // TELEGRAM BOT
    // =====================================================

    bot: BotReducer,


    // =====================================================
    // SITE UPDATES
    // =====================================================

    updates: updatesReducer,


    // =====================================================
    // PROMOTIONS
    // =====================================================

    promotion: promotionReducer,


    // =====================================================
    // PROFILE FRAMES SHOP
    // =====================================================
    //
    // Handles:
    //
    // - Shop catalog
    // - Frame details
    // - My frame inventory
    // - Purchases
    // - Equip / unequip
    // - Shop statistics
    //
    // =====================================================

    profileFrames: profileFramesReducer,


    // =====================================================
    // DAILY NEW YEAR GIFT 2027
    // =====================================================
    //
    // Handles:
    //
    // - Event information
    // - Daily gift eligibility
    // - Gift claim lifecycle
    // - Reward result
    // - Uncertain claim recovery
    // - Reward history
    // - Global modal state
    // - Authentication cleanup
    // - Stale response protection
    //
    // Authentication cleanup is handled internally
    // by DailyGiftReducer through extraReducers.
    //
    // =====================================================

    dailyGift: DailyGiftReducer,

});


// =========================================================
// AUTH SESSION HELPERS
// =========================================================

const getUserId = (user) => {

    if (
        user === null
        ||
        typeof user !== "object"
        ||
        Array.isArray(user)
    ) {

        return null;
    }


    const id =
        user.id ?? user.pk ?? null;


    return id === undefined || id === ""

        ? null

        : id;
};


// =========================================================
// FRAME STATE INVALIDATION
// =========================================================
//
// Prevent private frame data from being retained when:
//
// 1. User logs out
// 2. Authentication check fails
// 3. Login fails and clears authentication
// 4. A different account logs in
//
// Do not reset the other existing Redux slices.
//
// Daily Gift authentication cleanup is managed
// separately inside dailyGiftSlice.js.
//
// =========================================================

const shouldResetFrameState = (
    state,
    action
) => {

    if (!state?.profileFrames) {

        return false;
    }


    // =====================================================
    // LOGOUT / AUTH FAILURE
    // =====================================================

    if (
        logoutUser.match(action)
        ||
        checkAuthFailure.match(action)
        ||
        signUserFailure.match(action)
        ||
        signUserFailer.match(action)
    ) {

        return true;
    }


    // =====================================================
    // ACCOUNT LOGIN / RESTORE
    // =====================================================

    if (
        signUserSuccess.match(action)
        ||
        checkAuthSuccess.match(action)
    ) {

        const previousUserId = getUserId(
            state.auth?.user
        );


        const nextUser = (
            action.payload?.user
            ??
            action.payload
        );


        const nextUserId = getUserId(
            nextUser
        );


        // A new session should never inherit
        // an anonymous or unknown account's cache.

        if (
            previousUserId === null
            ||
            nextUserId === null
        ) {

            return true;
        }


        // Clear cached private frame data
        // when switching between accounts.

        return String(previousUserId) !==
            String(nextUserId);
    }


    return false;
};


// =========================================================
// ROOT REDUCER
// =========================================================
//
// Reset only profileFrames when authentication changes.
//
// No extra dispatch() is required.
//
// Redux processes the reset synchronously with
// the original authentication action.
//
// Existing reducers keep their original behavior.
//
// DailyGiftReducer receives the same authentication
// action and handles its own session cleanup.
//
// This avoids duplicate state reset logic and
// preserves the Daily Gift ownerId initialization.
//
// =========================================================

const rootReducer = (
    state,
    action
) => {

    if (
        state
        &&
        shouldResetFrameState(
            state,
            action
        )
    ) {

        return appReducer(
            {
                ...state,

                // Passing undefined causes the
                // profileFrames slice to initialize
                // itself with a clean initial state.

                profileFrames: undefined,
            },

            action
        );
    }


    return appReducer(
        state,
        action
    );
};


// =========================================================
// FSOCIETY — REDUX STORE
// =========================================================

export const store = configureStore({

    // =====================================================
    // ROOT REDUCER
    // =====================================================

    reducer: rootReducer,


    // =====================================================
    // MIDDLEWARE
    // =====================================================
    //
    // Keep the default Redux Toolkit middleware:
    //
    // - Redux Thunk
    // - Serializable state validation
    // - Immutable state validation
    //
    // Existing WebSocket notification middleware
    // remains unchanged.
    //
    // Daily Gift async operations use the default
    // Redux Toolkit thunk middleware.
    //
    // =====================================================

    middleware: (
        getDefaultMiddleware
    ) =>
        getDefaultMiddleware()
            .concat(
                notificationMiddleware
            ),


    // =====================================================
    // REDUX DEVTOOLS
    // =====================================================

    devTools:
        process.env.NODE_ENV !== "production",

});


// =========================================================
// OPTIONAL ROOT REDUCER EXPORT
// =========================================================
//
// Useful for isolated Redux tests.
//
// Does not change existing store imports.
//
// Can also be used to test:
//
// - Daily Gift initial state
// - Authentication cleanup
// - Account switching
// - Profile Frames state invalidation
// - Stale async response protection
//
// =========================================================

export {
    rootReducer,
};


export default store;
