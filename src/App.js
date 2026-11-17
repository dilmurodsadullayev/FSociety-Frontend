
import React, {
  useContext,
  useEffect,
  useRef,
} from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

// =========================================================
// FSOCIETY — APPLICATION COMPONENTS
// =========================================================

import {
  Main,
  Navbar,
  Footer,
  Login,
  Register,
  Problems,
  Feedback,
  FCoin,
  Users,
  Profile,
  NotFound,
  ProblemDetail,
  ProblemCreate,
  ProblemSolutionUpdate,
  FCoinHistory,
  NotificationsPage,
  MyProblems,
  ProjectDetail,
  PostDetail,
  Projects,
  SocialCallback,
} from "./components";

// =========================================================
// FSOCIETY — PROFILE FRAMES
// =========================================================
//
// FrameShop:
// Public catalog.
//
// MyFrames:
// Authenticated user inventory.
//
// FrameVaultNavigation:
// Shared navigation between shop and inventory.
//
// Direct imports preserve the existing
// src/components/index.js export structure.
//
// =========================================================

import FrameShop from "./components/frame-shop/FrameShop";

import MyFrames from "./components/frame-shop/MyFrames";

import FrameVaultNavigation from "./components/frame-shop/FrameVaultNavigation";

// =========================================================
// SERVICES
// =========================================================

import AuthService from "./services/auth";

// =========================================================
// REDUX AUTH
// =========================================================

import {
  logoutUser,
  signUserStart,
  signUserSuccess,
} from "./features/auth/Auth";

// =========================================================
// NOTIFICATION WEBSOCKET
// =========================================================

import {
  connectWebSocket,
  disconnectWebSocket,
} from "./middleware/notificationMiddleware";

// =========================================================
// GLOBAL UI
// =========================================================

import AppLoader from "./components/AppLoader";

import AuthToast from "./components/ui/AuthToast";

// =========================================================
// THEME CONTEXT
// =========================================================

import {
  ThemeContext,
  ThemeProvider,
} from "./context/ThemeContext";

// =========================================================
// NEW YEAR / WINTER EXPERIENCE
// =========================================================

import {
  NewYearProvider,
  useNewYear,
} from "./features/newYear/context/NewYearContext";

import Snowfall from "./features/newYear/components/Snowfall";

// =========================================================
// GLOBAL SHARED BACKGROUND
// =========================================================

import WinterBackground from "./components/ui/winter/WinterBackground";

// =========================================================
// FSOCIETY — APPLICATION
// =========================================================
//
// Responsibilities:
//
// - Routing
// - ThemeContext integration
// - Light / Dark mode
// - Navbar theme toggle
// - Authentication bootstrap
// - Protected routes
// - Public authentication pages
// - Public Frame Shop catalog
// - Private My Frames collection
// - Shared Frame Vault navigation
// - OAuth callback
// - WebSocket notifications
// - Forced logout handling
// - Global toast
// - NewYearProvider integration
// - Global snowfall integration
// - Global winter background
//
// IMPORTANT:
//
// Theme state is managed ONLY by ThemeContext.
//
// Winter state is managed ONLY by NewYearProvider.
//
// App.js does not create another theme state.
// App.js does not write theme to localStorage.
// App.js does not directly modify HTML classes.
//
// WinterBackground is rendered ONCE globally.
//
// Snowfall is rendered globally through AppInner.
//
// Frame Shop:
//
// - Guests can browse.
// - Purchases require authentication.
// - The existing universal purchase confirmation
//   modal is used in FrameShop.
//
// My Frames:
//
// - Requires authentication.
// - Equip / Unequip operations are handled by
//   the existing MyFrames component and Redux.
//
// =========================================================


// =========================================================
// AUTHENTICATED USER NORMALIZER
// =========================================================

const getAuthenticatedUser = (response) => {
  const user =
    response?.user ??
    response;

  if (
    !user ||
    typeof user !== "object" ||
    Array.isArray(user)
  ) {
    return null;
  }

  if (
    user.id === null ||
    user.id === undefined ||
    user.id === ""
  ) {
    return null;
  }

  return user;
};


// =========================================================
// PRIVATE ROUTE
// =========================================================

const PrivateRoute = ({ children }) => {
  const {
    isLoggedIn,
    isLoading,
  } = useSelector(
    (state) => state.auth
  );

  // =====================================================
  // INITIAL AUTH LOADING
  // =====================================================

  if (isLoading) {
    return <AppLoader />;
  }

  // =====================================================
  // NOT AUTHENTICATED
  // =====================================================

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // =====================================================
  // AUTHENTICATED
  // =====================================================

  return children;
};


// =========================================================
// PUBLIC AUTH PAGE
// =========================================================
//
// Used by:
//
// - Login
// - Register
//
// Login/Register contain their own AuthPageLayout.
//
// ThemeContext applies the HTML "dark" class,
// so no local theme state is required.
//
// Background is transparent because the global
// WinterBackground is rendered behind the application.
//
// =========================================================

const PublicAuthPage = ({ children }) => {
  const {
    isLoggedIn,
    isLoading,
  } = useSelector(
    (state) => state.auth
  );

  // =====================================================
  // AUTH LOADING
  // =====================================================

  if (isLoading) {
    return <AppLoader />;
  }

  // =====================================================
  // ALREADY AUTHENTICATED
  // =====================================================

  if (isLoggedIn) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  // =====================================================
  // PUBLIC PAGE
  // =====================================================

  return (
    <div
      className="
        relative
        z-10

        flex min-h-screen
        min-h-[100dvh]

        w-full min-w-0
        flex-col

        bg-transparent
        text-slate-900

        dark:bg-transparent
        dark:text-slate-100

        transition-colors
        duration-200

        motion-reduce:transition-none
      "
    >
      {children}
    </div>
  );
};


// =========================================================
// APP LAYOUT
// =========================================================
//
// Navbar theme props come from ThemeContext.
//
// This preserves the existing Navbar contract:
//
// <Navbar
//   isDarkMode={isDarkMode}
//   toggleTheme={toggleTheme}
// />
//
// Background is inherited from the global
// WinterBackground component.
//
// requireAuth:
//
// true:
// Existing application pages remain protected.
//
// false:
// Public Frame Shop layout.
//
// showFrameNavigation:
//
// false:
// Standard application layout.
//
// true:
// Show Frame Vault navigation above page content.
//
// All existing pages retain their original layout.
//
// =========================================================

const AppLayout = ({
  requireAuth = true,
  showFrameNavigation = false,
}) => {

  // =====================================================
  // THEME CONTEXT
  // =====================================================

  const {
    isDark,
    toggleTheme,
  } = useContext(ThemeContext);

  const isDarkMode = isDark;

  // =====================================================
  // SHARED LAYOUT
  // =====================================================
  //
  // The Navbar / Footer / Outlet structure
  // remains identical to the existing code.
  //
  // Frame Vault navigation is only rendered
  // when the dedicated frames layout requests it.
  //
  // =====================================================

  const layout = (
    <div
      className="
        relative
        z-10

        flex min-h-screen
        min-h-[100dvh]

        w-full min-w-0
        flex-col

        bg-transparent
        text-gray-800

        dark:bg-transparent
        dark:text-gray-200

        transition-colors
        duration-300

        motion-reduce:transition-none
      "
    >

      {/* =====================================
          NAVBAR
      ===================================== */}

      <Navbar
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />


      {/* =====================================
          FRAME VAULT NAVIGATION
      ===================================== */}
      {/*
        Visible only inside /frames routes.

        Provides:
        - Frame Shop
        - My Frames
        - Active route indicator
        - Responsive cyberpunk navigation

        My Frames remains protected independently
        by its nested PrivateRoute.
      */}

      {showFrameNavigation && (
        <FrameVaultNavigation />
      )}


      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <div
        className="
          min-w-0
          flex-grow

          bg-transparent
          text-gray-800

          dark:bg-transparent
          dark:text-gray-200

          transition-colors
          duration-300

          motion-reduce:transition-none
        "
      >
        <Outlet />
      </div>


      {/* =====================================
          FOOTER
      ===================================== */}

      <Footer />

    </div>
  );

  // =====================================================
  // PROTECTED APPLICATION LAYOUT
  // =====================================================
  //
  // Existing routes continue to use PrivateRoute.
  //
  // =====================================================

  if (requireAuth) {
    return (
      <PrivateRoute>
        {layout}
      </PrivateRoute>
    );
  }

  // =====================================================
  // PUBLIC APPLICATION LAYOUT
  // =====================================================
  //
  // Used by:
  //
  // /frames/shop
  // /frames/my
  //
  // Individual private child routes can still
  // wrap their element in PrivateRoute.
  //
  // =====================================================

  return layout;
};


// =========================================================
// APP CONTENT
// =========================================================

function AppContent() {
  const dispatch = useDispatch();

  // =====================================================
  // AUTH STATE
  // =====================================================

  const isLoggedIn = useSelector(
    (state) =>
      Boolean(state.auth?.isLoggedIn)
  );

  // =====================================================
  // AUTH REQUEST GENERATION
  //
  // Prevent an outdated auth response
  // from restoring a logged-out user.
  // =====================================================

  const authGenerationRef = useRef(0);

  // =====================================================
  // FORCE LOGOUT LISTENER
  // =====================================================
  //
  // services/api.js emits "auth:logout"
  // when refresh authentication fails.
  //
  // Register the listener before starting
  // the initial user session request.
  //
  // =====================================================

  useEffect(() => {
    const handleForceLogout = () => {

      // Invalidate pending auth checks.
      ++authGenerationRef.current;

      // Clear Redux authentication.
      dispatch(
        logoutUser()
      );

      // Disconnect notification socket.
      dispatch(
        disconnectWebSocket()
      );
    };

    window.addEventListener(
      "auth:logout",
      handleForceLogout
    );

    return () => {
      window.removeEventListener(
        "auth:logout",
        handleForceLogout
      );
    };
  }, [dispatch]);


  // =====================================================
  // INITIAL AUTHENTICATION CHECK
  // =====================================================
  //
  // Verify existing JWT cookie session.
  //
  // Existing endpoint:
  // GET /users/user/
  //
  // The Axios instance handles cookies
  // and token refresh.
  //
  // =====================================================

  useEffect(() => {
    let isMounted = true;

    const currentGeneration =
      ++authGenerationRef.current;

    // ===================================================
    // REQUEST VALIDITY
    // ===================================================

    const isCurrentRequest = () =>
      isMounted &&
      currentGeneration ===
        authGenerationRef.current;

    // ===================================================
    // CHECK USER STATUS
    // ===================================================

    const checkUserStatus = async () => {
      dispatch(
        signUserStart()
      );

      try {
        const response =
          await AuthService.getUser();

        if (!isCurrentRequest()) {
          return;
        }

        const authenticatedUser =
          getAuthenticatedUser(response);

        // ===============================================
        // VALID SESSION
        // ===============================================

        if (authenticatedUser) {
          dispatch(
            signUserSuccess(
              authenticatedUser
            )
          );

          return;
        }

        // ===============================================
        // NO AUTHENTICATED USER
        // ===============================================

        dispatch(
          logoutUser()
        );

      } catch (error) {
        if (!isCurrentRequest()) {
          return;
        }

        // ===============================================
        // AUTH CHECK FAILED
        // ===============================================
        //
        // A 401 response can mean the visitor
        // is simply not authenticated.
        //
        // Do not show a global error toast.
        //
        // Do not use signUserFailure here,
        // because this is initial auth checking,
        // not a failed Login form submission.
        //
        // ===============================================

        dispatch(
          logoutUser()
        );
      }
    };

    checkUserStatus();

    // ===================================================
    // CLEANUP
    // ===================================================

    return () => {
      isMounted = false;

      ++authGenerationRef.current;
    };
  }, [dispatch]);


  // =====================================================
  // WEBSOCKET NOTIFICATIONS
  // =====================================================
  //
  // Signed in:
  // - Connect notification WebSocket
  //
  // Signed out:
  // - Disconnect notification WebSocket
  //
  // =====================================================

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(
        connectWebSocket()
      );
    } else {
      dispatch(
        disconnectWebSocket()
      );
    }

    return () => {
      dispatch(
        disconnectWebSocket()
      );
    };
  }, [
    dispatch,
    isLoggedIn,
  ]);


  // =====================================================
  // ROUTES
  // =====================================================

  return (
    <Routes>

      {/* ==========================================
          PUBLIC AUTHENTICATION
      ========================================== */}

      {/* LOGIN */}

      <Route
        path="/login"
        element={
          <PublicAuthPage>
            <Login />
          </PublicAuthPage>
        }
      />


      {/* REGISTER */}

      <Route
        path="/register"
        element={
          <PublicAuthPage>
            <Register />
          </PublicAuthPage>
        }
      />


      {/* ==========================================
          OAUTH CALLBACK
      ========================================== */}

      <Route
        path="/callback/:provider"
        element={
          <div
            className="
              relative
              z-10

              flex min-h-screen
              min-h-[100dvh]

              w-full min-w-0

              items-center
              justify-center

              bg-transparent
              text-slate-900

              dark:bg-transparent
              dark:text-gray-100

              transition-colors
              duration-200
            "
          >
            <SocialCallback />
          </div>
        }
      />


      {/* ==========================================
          PROFILE FRAMES — FRAME VAULT
      ========================================== */}
      {/*
        FSOCIETY FRAME VAULT

        Shared layout:
        Navbar + FrameVaultNavigation + Outlet + Footer

        Public:
        /frames/shop

        Private:
        /frames/my

        Authentication:

        - Shop can be browsed by guests.
        - Purchases require JWT authentication.
        - My Frames requires authentication.
        - Inventory API permissions are enforced
          independently by the Django backend.

        Existing PurchaseConfirmationModal is used
        by FrameShop during purchases.

        WinterBackground and Snowfall are inherited
        from AppInner for both pages.
      */}

      <Route
        path="/frames"
        element={
          <AppLayout
            requireAuth={false}
            showFrameNavigation
          />
        }
      >

        {/* ======================================
            FRAME SHOP — PUBLIC
        ====================================== */}

        <Route
          path="shop"
          element={
            <FrameShop />
          }
        />


        {/* ======================================
            MY FRAMES — PRIVATE
        ====================================== */}

        <Route
          path="my"
          element={
            <PrivateRoute>
              <MyFrames />
            </PrivateRoute>
          }
        />

      </Route>


      {/* ==========================================
          PROTECTED APPLICATION
      ========================================== */}

      <Route
        path="/"
        element={
          <AppLayout />
        }
      >

        {/* ======================================
            HOME
        ====================================== */}

        <Route
          index
          element={<Main />}
        />


        {/* ======================================
            PROBLEMS
        ====================================== */}

        <Route
          path="problems"
          element={<Problems />}
        />

        <Route
          path="my-problems"
          element={<MyProblems />}
        />

        <Route
          path="problem-create"
          element={<ProblemCreate />}
        />

        <Route
          path="problem/:id/edit"
          element={<ProblemCreate />}
        />

        <Route
          path="problem/:id/solution/:solutionId/edit"
          element={
            <ProblemSolutionUpdate />
          }
        />

        <Route
          path="problem/:id/detail"
          element={<ProblemDetail />}
        />


        {/* ======================================
            FEEDBACK
        ====================================== */}

        <Route
          path="feedback"
          element={<Feedback />}
        />


        {/* ======================================
            FCOIN
        ====================================== */}

        <Route
          path="fcoin"
          element={<FCoin />}
        />

        <Route
          path="fcoin-history"
          element={<FCoinHistory />}
        />


        {/* ======================================
            USERS / PROFILE
        ====================================== */}

        <Route
          path="users"
          element={<Users />}
        />

        <Route
          path=":username/profile"
          element={<Profile />}
        />


        {/* ======================================
            PROJECTS
        ====================================== */}

        <Route
          path="projects"
          element={<Projects />}
        />

        <Route
          path="project/:projectId/detail"
          element={<ProjectDetail />}
        />


        {/* ======================================
            NOTIFICATIONS
        ====================================== */}

        <Route
          path="notifications"
          element={<NotificationsPage />}
        />


        {/* ======================================
            POSTS
        ====================================== */}

        <Route
          path=":username/post/:slug/"
          element={<PostDetail />}
        />

      </Route>


      {/* ==========================================
          NOT FOUND
      ========================================== */}

      <Route
        path="*"
        element={
          <div
            className="
              relative
              z-10

              flex min-h-screen
              min-h-[100dvh]

              w-full min-w-0

              items-center
              justify-center

              bg-transparent
              text-slate-900

              dark:bg-transparent
              dark:text-gray-100

              transition-colors
              duration-200
            "
          >
            <NotFound />
          </div>
        }
      />

    </Routes>
  );
}


// =========================================================
// ROOT APPLICATION CONTENT
// =========================================================
//
// NewYearProvider already wraps AppInner.
//
// Therefore useNewYear() is available here.
//
// Global background:
//
// - Rendered only once.
// - Persists during route navigation.
// - Reads winterBackgroundEnabled.
// - Uses the existing ThemeContext dark class.
// - Shows the original PageGridBackground when disabled.
//
// Frame Shop and My Frames both inherit
// the same global background.
//
// =========================================================

const AppInner = () => {

  // =====================================================
  // WINTER BACKGROUND SETTINGS
  // =====================================================

  const { settings } = useNewYear();

  // IMPORTANT:
  //
  // If the setting has not been initialized yet,
  // winter background remains enabled.
  //
  // Explicit false still disables winter background
  // and restores PageGridBackground.
  //
  const isWinterBackgroundEnabled =
    settings?.winterBackgroundEnabled ?? true;


  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Router>

      {/* =====================================
          GLOBAL APPLICATION ROOT
      ===================================== */}

      <div
        className="
          relative
          isolate

          min-h-screen
          min-h-[100dvh]

          w-full
          min-w-0

          overflow-x-clip
        "
      >

        {/* =====================================
            GLOBAL SHARED BACKGROUND

            Rendered ONCE for the entire app.

            Winter ON:
            - Dark: winter-dark.webp
            - Light: winter-light.webp

            Winter OFF:
            - Original PageGridBackground

            The fixed wrapper keeps the background
            behind every route and page.
        ===================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            fixed
            inset-0
            z-0
            overflow-hidden
          "
        >
          <WinterBackground
            enabled={isWinterBackgroundEnabled}
            showMonogram
            showCubes
          />
        </div>


        {/* =====================================
            GLOBAL APPLICATION CONTENT
        ===================================== */}

        <div
          className="
            relative
            z-10
            min-h-screen
            min-h-[100dvh]
          "
        >

          {/* =====================================
              UNIVERSAL TOAST
          ===================================== */}

          <AuthToast />


          {/* =====================================
              APPLICATION ROUTES
          ===================================== */}

          <AppContent />


          {/* =====================================
              GLOBAL WINTER SNOWFALL
          ===================================== */}
          {/*
            Rendered outside individual routes.

            Therefore snowfall can appear on:

            - Home
            - Problems
            - Projects
            - Profiles
            - Login
            - Register
            - OAuth callback
            - Frame Shop
            - My Frames
            - Not found

            Actual animation depends on
            NewYearContext settings.
          */}

          <Snowfall />

        </div>

      </div>

    </Router>
  );
};


// =========================================================
// ROOT APP
// =========================================================
//
// Provider hierarchy:
//
// index.js
//   └── Redux Provider
//         └── ThemeProvider
//               └── App
//                     └── NewYearProvider
//                           └── AppInner
//                                 └── Router
//                                       ├── WinterBackground
//                                       ├── AuthToast
//                                       ├── AppContent
//                                       └── Snowfall
//
// ThemeProvider is already installed in index.js.
//
// If it exists above App, reuse it.
// Otherwise, provide it here.
//
// This avoids duplicate theme state.
//
// =========================================================

function App() {

  const existingThemeContext =
    useContext(ThemeContext);

  // =====================================================
  // EXISTING THEME PROVIDER
  // =====================================================

  if (existingThemeContext) {
    return (
      <NewYearProvider>
        <AppInner />
      </NewYearProvider>
    );
  }

  // =====================================================
  // PROVIDE THEME IF NOT INSTALLED
  // =====================================================

  return (
    <ThemeProvider>
      <NewYearProvider>
        <AppInner />
      </NewYearProvider>
    </ThemeProvider>
  );
}


// =========================================================
// EXPORT
// =========================================================

export default App;
