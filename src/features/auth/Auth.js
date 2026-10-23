
import {
  createSlice,
} from "@reduxjs/toolkit";

// =========================================================
// FSOCIETY — AUTH REDUX SLICE
// =========================================================
//
// Location: src/features/auth/Auth.js
//
// Existing actions preserved:
// - signUserStart
// - signUserSuccess
// - signUserFailure
// - signUserFailer (legacy)
// - checkAuthStart
// - checkAuthSuccess
// - checkAuthFailure
// - logoutUser
// - clearAuthError
//
// New register-specific actions:
// - registerRequestStart
// - registerRequestSuccess
// - registerRequestFailure
// - clearRegisterError
//
// =========================================================

// =========================================================
// INITIAL STATE
// =========================================================

const initialState = {
  // Authentication bootstrap / login loading.
  //
  // Keep true to preserve existing App.jsx
  // initialization behavior.
  isLoading: true,

  isLoggedIn: false,

  error: null,

  user: null,

  // Register request must not trigger
  // PublicAuthPage's global AppLoader.
  isRegisterLoading: false,

  registerError: null,
};

// =========================================================
// HELPERS
// =========================================================

const getErrorMessage = (
  payload,
  fallback
) => {
  if (
    typeof payload === "string" &&
    payload.trim()
  ) {
    return payload.trim();
  }

  if (
    typeof payload?.message === "string" &&
    payload.message.trim()
  ) {
    return payload.message.trim();
  }

  return fallback;
};

const getUserFromPayload = (
  payload
) => {
  const candidate =
    payload?.user ??
    payload ??
    null;

  if (
    candidate !== null &&
    typeof candidate === "object" &&
    !Array.isArray(candidate)
  ) {
    return candidate;
  }

  return null;
};

// =========================================================
// SHARED LEGACY FAILURE REDUCER
// =========================================================
//
// Used by BOTH action names to avoid
// changing behavior of existing Login code.
//
// Do not use this action for client-side
// Register form validation.
// =========================================================

const signUserFailureReducer = (
  state,
  action
) => {
  state.isLoading = false;
  state.isLoggedIn = false;

  state.user = null;

  state.error = getErrorMessage(
    action.payload,
    "Autentifikatsiya xatosi."
  );
};

// =========================================================
// AUTH SLICE
// =========================================================

export const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    // ===================================================
    // LOGIN START
    // ===================================================

    signUserStart: (state) => {
      state.isLoading = true;

      state.error = null;
    },

    // ===================================================
    // LOGIN / AUTH SUCCESS
    // ===================================================

    signUserSuccess: (
      state,
      action
    ) => {
      const user =
        getUserFromPayload(
          action.payload
        );

      state.isLoading = false;

      state.isLoggedIn =
        Boolean(user);

      state.user = user;

      state.error = null;

      state.isRegisterLoading = false;
      state.registerError = null;
    },

    // ===================================================
    // LOGIN FAILURE
    // ===================================================

    signUserFailure:
      signUserFailureReducer,

    // ===================================================
    // LEGACY TYPO ACTION
    //
    // Required for old components.
    // ===================================================

    signUserFailer:
      signUserFailureReducer,

    // ===================================================
    // CHECK AUTH START
    // ===================================================

    checkAuthStart: (state) => {
      state.isLoading = true;

      state.error = null;
    },

    // ===================================================
    // CHECK AUTH SUCCESS
    // ===================================================

    checkAuthSuccess: (
      state,
      action
    ) => {
      const user =
        getUserFromPayload(
          action.payload
        );

      state.isLoading = false;

      state.isLoggedIn =
        Boolean(user);

      state.user = user;

      state.error = null;
    },

    // ===================================================
    // CHECK AUTH FAILURE
    // ===================================================

    checkAuthFailure: (state) => {
      state.isLoading = false;

      state.isLoggedIn = false;

      state.user = null;

      // Auth check can fail for visitors
      // who simply are not signed in.
      // Do not show a global login error.
      state.error = null;
    },

    // ===================================================
    // REGISTER REQUEST START
    // ===================================================
    //
    // Does not modify auth.isLoading.
    // The Register page must stay mounted.
    // ===================================================

    registerRequestStart: (state) => {
      state.isRegisterLoading = true;

      state.registerError = null;
    },

    // ===================================================
    // REGISTER REQUEST SUCCESS
    // ===================================================
    //
    // Does not automatically authenticate.
    //
    // If backend registration creates a valid
    // authenticated session, the controller
    // dispatches signUserSuccess(user).
    //
    // Otherwise it navigates to Login.
    // ===================================================

    registerRequestSuccess: (state) => {
      state.isRegisterLoading = false;

      state.registerError = null;
    },

    // ===================================================
    // REGISTER REQUEST FAILURE
    // ===================================================
    //
    // Preserves:
    // - isLoggedIn
    // - user
    // - isLoading
    //
    // A registration validation error should
    // never log out an authenticated user.
    // ===================================================

    registerRequestFailure: (
      state,
      action
    ) => {
      state.isRegisterLoading = false;

      state.registerError =
        getErrorMessage(
          action.payload,
          "Ro‘yxatdan o‘tishda xatolik yuz berdi."
        );
    },

    // ===================================================
    // CLEAR REGISTER ERROR
    // ===================================================

    clearRegisterError: (state) => {
      state.registerError = null;
    },

    // ===================================================
    // LOGOUT
    // ===================================================

    logoutUser: (state) => {
      state.user = null;

      state.isLoggedIn = false;

      state.isLoading = false;

      state.error = null;

      state.isRegisterLoading = false;

      state.registerError = null;
    },

    // ===================================================
    // CLEAR AUTH ERROR
    // ===================================================

    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

// =========================================================
// EXPORT ACTIONS
// =========================================================

export const {
  signUserStart,
  signUserSuccess,
  signUserFailure,

  // Preserve legacy typo.
  signUserFailer,

  checkAuthStart,
  checkAuthSuccess,
  checkAuthFailure,

  registerRequestStart,
  registerRequestSuccess,
  registerRequestFailure,
  clearRegisterError,

  logoutUser,
  clearAuthError,
} = authSlice.actions;

// =========================================================
// SELECTORS
// =========================================================

export const selectAuthState = (state) =>
  state.auth;

export const selectIsLoggedIn = (state) =>
  state.auth?.isLoggedIn ?? false;

export const selectAuthUser = (state) =>
  state.auth?.user ?? null;

export const selectAuthLoading = (state) =>
  state.auth?.isLoading ?? false;

export const selectRegisterLoading = (state) =>
  state.auth?.isRegisterLoading ?? false;

export const selectRegisterError = (state) =>
  state.auth?.registerError ?? null;

// =========================================================
// DEFAULT EXPORT
// =========================================================

export default authSlice.reducer;
