
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
// - OAuth callback
// - WebSocket notifications
// - Forced logout handling
// - Global toast
//
// IMPORTANT:
//
// Theme state is managed ONLY by ThemeContext.
//
// App.js does not create another theme state.
// App.js does not write theme to localStorage.
// App.js does not directly modify HTML classes.
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
// - Login
// - Register
//
// Login/Register contain their own AuthPageLayout.
//
// ThemeContext applies the HTML "dark" class,
// so no local theme state is required.
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

        flex min-h-screen
        min-h-[100dvh]

        w-full min-w-0
        flex-col

        bg-[#f7faff]
        text-slate-900

        dark:bg-[#050a14]
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
// =========================================================

const AppLayout = () => {
  // =====================================================
  // THEME CONTEXT
  // =====================================================

  const {
    isDark,
    toggleTheme,
  } = useContext(ThemeContext);

  const isDarkMode = isDark;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <PrivateRoute>
      <div
        className="
          flex min-h-screen
          min-h-[100dvh]

          w-full min-w-0
          flex-col

          bg-gray-100
          text-gray-800

          dark:bg-[#0d1117]
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
            MAIN CONTENT
           ===================================== */}

        <div
          className="
            min-w-0
            flex-grow

            bg-gray-100
            text-gray-800

            dark:bg-[#0d1117]
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
    </PrivateRoute>
  );
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
      dispatch(logoutUser());

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
          getAuthenticatedUser(
            response
          );

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
              flex min-h-screen
              min-h-[100dvh]

              w-full min-w-0

              items-center
              justify-center

              bg-slate-50
              text-slate-900

              dark:bg-[#0d1117]
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
              flex min-h-screen
              min-h-[100dvh]

              w-full min-w-0

              items-center
              justify-center

              bg-slate-50
              text-slate-900

              dark:bg-[#0d1117]
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

const AppInner = () => {
  return (
    <Router>
      {/* =====================================
          UNIVERSAL TOAST
         ===================================== */}

      <AuthToast />

      {/* =====================================
          APPLICATION
         ===================================== */}

      <AppContent />
    </Router>
  );
};

// =========================================================
// ROOT APP
// =========================================================
//
// ThemeProvider can be installed in index.js:
//
// <ThemeProvider>
//   <App />
// </ThemeProvider>
//
// Or App can be rendered directly:
//
// <App />
//
// If ThemeProvider already exists above App,
// reuse it.
//
// Otherwise, create one provider.
//
// This prevents duplicate theme state.
//
// =========================================================

function App() {
  const existingThemeContext =
    useContext(ThemeContext);

  // =====================================================
  // EXISTING THEME PROVIDER
  // =====================================================

  if (existingThemeContext) {
    return <AppInner />;
  }

  // =====================================================
  // PROVIDE THEME IF NOT INSTALLED
  // =====================================================

  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}

// =========================================================
// EXPORT
// =========================================================

export default App;
