
 // src/App.js

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
// Authenticated user's frame inventory.
//
// FrameVaultNavigation:
// Shared navigation between Frame Shop
// and My Frames.
//
// =========================================================

import FrameShop from "./components/frame-shop/FrameShop";

import MyFrames from "./components/frame-shop/MyFrames";

import FrameVaultNavigation from "./components/frame-shop/FrameVaultNavigation";

// =========================================================
// AUTH SERVICE
// =========================================================

import AuthService from "./services/auth";

// =========================================================
// REDUX AUTHENTICATION
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
// - Application routing
// - Authentication bootstrap
// - Protected routes
// - Public authentication pages
// - OAuth callback
// - Frame Shop navigation
// - WebSocket notifications
// - Forced logout handling
// - Global toast
// - ThemeContext integration
// - NewYearProvider integration
// - WinterBackground
// - Snowfall
//
// EVENTS MIGRATION:
//
// The deleted DailyGiftController is no longer
// imported or rendered.
//
// Daily Gift and Seasonal Gift Redux logic now
// belongs to src/features/events/.
//
// The new EventsController will be mounted after
// its backend integration has been verified.
//
// IMPORTANT:
//
// Theme state belongs to ThemeContext.
//
// Winter state belongs to NewYearProvider.
//
// Authentication state belongs to Redux.
//
// App.js does not implement its own JWT logic.
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
    // AUTHENTICATION LOADING
    // =====================================================

    if (isLoading) {
        return <AppLoader />;
    }

    // =====================================================
    // UNAUTHENTICATED USER
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
    // AUTHENTICATED USER
    // =====================================================

    return children;
};


// =========================================================
// PUBLIC AUTHENTICATION PAGE
// =========================================================
//
// Login and Register already contain their
// own authentication layouts.
//
// The global WinterBackground remains behind
// the page.
//
// ThemeContext manages dark / light classes.
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
                relative z-10
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
// APPLICATION LAYOUT
// =========================================================
//
// Preserves:
//
// Navbar
// Theme toggle
// FrameVaultNavigation
// Outlet
// Footer
//
// requireAuth:
// - true: authenticated application pages
// - false: publicly accessible layout
//
// showFrameNavigation:
// - true: show frame vault navigation
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
    // SHARED APPLICATION LAYOUT
    // =====================================================

    const layout = (
        <div
            className="
                relative z-10
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
            {/* =========================================
                NAVBAR
            ========================================= */}

            <Navbar
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
            />

            {/* =========================================
                FRAME VAULT NAVIGATION
            ========================================= */}

            {showFrameNavigation && (
                <FrameVaultNavigation />
            )}

            {/* =========================================
                MAIN CONTENT
            ========================================= */}

            <div
                className="
                    min-w-0 flex-grow
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

            {/* =========================================
                FOOTER
            ========================================= */}

            <Footer />
        </div>
    );

    // =====================================================
    // PROTECTED APPLICATION LAYOUT
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

    return layout;
};


// =========================================================
// APPLICATION CONTENT
// =========================================================

function AppContent() {
    const dispatch = useDispatch();

    // =====================================================
    // AUTHENTICATION STATE
    // =====================================================

    const isLoggedIn = useSelector(
        (state) =>
            Boolean(state.auth?.isLoggedIn)
    );

    // =====================================================
    // AUTH REQUEST GENERATION
    // =====================================================
    //
    // Prevents an old authentication request
    // from restoring a logged-out session.
    //
    // =====================================================

    const authGenerationRef = useRef(0);

    // =====================================================
    // FORCED LOGOUT LISTENER
    // =====================================================
    //
    // src/services/api.js dispatches the
    // "auth:logout" browser event when the
    // session can no longer be refreshed.
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

            // Disconnect notifications.
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
    // Verifies the existing JWT cookie session.
    //
    // AuthService.getUser() uses the existing
    // Axios configuration.
    //
    // Does not create a separate token refresh
    // mechanism.
    //
    // =====================================================

    useEffect(() => {
        let isMounted = true;

        const currentGeneration =
            ++authGenerationRef.current;

        // ================================================
        // REQUEST VALIDITY
        // ================================================

        const isCurrentRequest = () =>
            isMounted &&
            currentGeneration ===
                authGenerationRef.current;

        // ================================================
        // INITIAL USER CHECK
        // ================================================

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

                // ========================================
                // VALID SESSION
                // ========================================

                if (authenticatedUser) {
                    dispatch(
                        signUserSuccess(
                            authenticatedUser
                        )
                    );

                    return;
                }

                // ========================================
                // NO AUTHENTICATED USER
                // ========================================

                dispatch(
                    logoutUser()
                );

            } catch (error) {
                if (!isCurrentRequest()) {
                    return;
                }

                // Initial auth failure is not
                // a failed login form submission.
                //
                // A guest may normally receive 401.
                // Avoid an unnecessary global toast.

                dispatch(
                    logoutUser()
                );
            }
        };

        checkUserStatus();

        // ================================================
        // CLEANUP
        // ================================================

        return () => {
            isMounted = false;

            ++authGenerationRef.current;
        };
    }, [dispatch]);

    // =====================================================
    // WEBSOCKET NOTIFICATIONS
    // =====================================================
    //
    // Authenticated -> connect
    // Unauthenticated -> disconnect
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
    // APPLICATION ROUTES
    // =====================================================

    return (
        <Routes>
            {/* =========================================
                PUBLIC AUTHENTICATION
            ========================================= */}

            <Route
                path="/login"
                element={
                    <PublicAuthPage>
                        <Login />
                    </PublicAuthPage>
                }
            />

            <Route
                path="/register"
                element={
                    <PublicAuthPage>
                        <Register />
                    </PublicAuthPage>
                }
            />

            {/* =========================================
                OAUTH CALLBACK
            ========================================= */}

            <Route
                path="/callback/:provider"
                element={
                    <div
                        className="
                            relative z-10
                            flex min-h-screen
                            min-h-[100dvh]
                            w-full min-w-0
                            items-center justify-center
                            bg-transparent
                            text-slate-900
                            dark:text-gray-100
                            transition-colors
                            duration-200
                        "
                    >
                        <SocialCallback />
                    </div>
                }
            />

            {/* =========================================
                PROFILE FRAMES — FRAME VAULT
            ========================================= */}

            <Route
                path="/frames"
                element={
                    <AppLayout
                        requireAuth={false}
                        showFrameNavigation
                    />
                }
            >
                {/* PUBLIC FRAME SHOP */}

                <Route
                    path="shop"
                    element={
                        <FrameShop />
                    }
                />

                {/* PRIVATE FRAME INVENTORY */}

                <Route
                    path="my"
                    element={
                        <PrivateRoute>
                            <MyFrames />
                        </PrivateRoute>
                    }
                />
            </Route>

            {/* =========================================
                PROTECTED APPLICATION
            ========================================= */}

            <Route
                path="/"
                element={
                    <AppLayout />
                }
            >
                {/* =====================================
                    HOME
                ===================================== */}

                <Route
                    index
                    element={
                        <Main />
                    }
                />

                {/* =====================================
                    PROBLEMS
                ===================================== */}

                <Route
                    path="problems"
                    element={
                        <Problems />
                    }
                />

                <Route
                    path="my-problems"
                    element={
                        <MyProblems />
                    }
                />

                <Route
                    path="problem-create"
                    element={
                        <ProblemCreate />
                    }
                />

                <Route
                    path="problem/:id/edit"
                    element={
                        <ProblemCreate />
                    }
                />

                <Route
                    path="problem/:id/solution/:solutionId/edit"
                    element={
                        <ProblemSolutionUpdate />
                    }
                />

                <Route
                    path="problem/:id/detail"
                    element={
                        <ProblemDetail />
                    }
                />

                {/* =====================================
                    FEEDBACK
                ===================================== */}

                <Route
                    path="feedback"
                    element={
                        <Feedback />
                    }
                />

                {/* =====================================
                    FCOIN
                ===================================== */}

                <Route
                    path="fcoin"
                    element={
                        <FCoin />
                    }
                />

                <Route
                    path="fcoin-history"
                    element={
                        <FCoinHistory />
                    }
                />

                {/* =====================================
                    USERS / PROFILE
                ===================================== */}

                <Route
                    path="users"
                    element={
                        <Users />
                    }
                />

                <Route
                    path=":username/profile"
                    element={
                        <Profile />
                    }
                />

                {/* =====================================
                    PROJECTS
                ===================================== */}

                <Route
                    path="projects"
                    element={
                        <Projects />
                    }
                />

                <Route
                    path="project/:projectId/detail"
                    element={
                        <ProjectDetail />
                    }
                />

                {/* =====================================
                    NOTIFICATIONS
                ===================================== */}

                <Route
                    path="notifications"
                    element={
                        <NotificationsPage />
                    }
                />

                {/* =====================================
                    POSTS
                ===================================== */}

                <Route
                    path=":username/post/:slug/"
                    element={
                        <PostDetail />
                    }
                />
            </Route>

            {/* =========================================
                NOT FOUND
            ========================================= */}

            <Route
                path="*"
                element={
                    <div
                        className="
                            relative z-10
                            flex min-h-screen
                            min-h-[100dvh]
                            w-full min-w-0
                            items-center justify-center
                            bg-transparent
                            text-slate-900
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
// GLOBAL APPLICATION ROOT
// =========================================================
//
// NewYearProvider wraps AppInner.
//
// useNewYear() is available here.
//
// Global WinterBackground is rendered once.
//
// Snowfall is rendered outside the routes.
//
// Old DailyGiftController was removed.
//
// EventsController will be integrated after
// its backend contract and initialization
// behavior are verified.
//
// =========================================================

const AppInner = () => {
    // =====================================================
    // WINTER BACKGROUND SETTINGS
    // =====================================================

    const { settings } = useNewYear();

    // Explicit false disables winter background.
    // Other values preserve the existing default.

    const isWinterBackgroundEnabled =
        settings?.winterBackgroundEnabled ??
        true;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Router>
            {/* =========================================
                GLOBAL APPLICATION ROOT
            ========================================= */}

            <div
                className="
                    relative isolate
                    min-h-screen
                    min-h-[100dvh]
                    w-full min-w-0
                    overflow-x-clip
                "
            >
                {/* =====================================
                    GLOBAL SHARED BACKGROUND
                ===================================== */}

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        fixed inset-0 z-0
                        overflow-hidden
                    "
                >
                    <WinterBackground
                        enabled={
                            isWinterBackgroundEnabled
                        }
                        showMonogram
                        showCubes
                    />
                </div>

                {/* =====================================
                    GLOBAL APPLICATION CONTENT
                ===================================== */}

                <div
                    className="
                        relative z-10
                        min-h-screen
                        min-h-[100dvh]
                    "
                >
                    {/* GLOBAL TOAST */}

                    <AuthToast />

                    {/* APPLICATION ROUTES */}

                    <AppContent />

                    {/*
                        OLD DAILY GIFT CONTROLLER
                        HAS BEEN REMOVED.

                        The deleted component is not
                        imported or rendered.

                        New EventsController integration
                        will be completed separately.

                        Seasonal Gift and Daily Gift
                        will use the new events modules.
                    */}

                    {/* GLOBAL WINTER SNOWFALL */}

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
//       └── ThemeProvider
//           └── App
//               └── NewYearProvider
//                   └── AppInner
//                       └── Router
//                           ├── WinterBackground
//                           ├── AuthToast
//                           ├── AppContent
//                           └── Snowfall
//
// Avoid duplicate theme providers.
//
// =========================================================

function App() {
    const existingThemeContext =
        useContext(ThemeContext);

    // =====================================================
    // THEME PROVIDER ALREADY INSTALLED
    // =====================================================

    if (existingThemeContext) {
        return (
            <NewYearProvider>
                <AppInner />
            </NewYearProvider>
        );
    }

    // =====================================================
    // FALLBACK THEME PROVIDER
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
