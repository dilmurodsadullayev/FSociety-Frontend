
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
// PROFILE FRAMES
// =========================================================

import FrameShop from "./components/frame-shop/FrameShop";

import MyFrames from "./components/frame-shop/MyFrames";

import FrameVaultNavigation from "./components/frame-shop/FrameVaultNavigation";

// =========================================================
// UNIVERSAL EVENTS — NEW
// =========================================================
//
// Events are public.
//
// Claiming a Seasonal Gift requires a valid
// authenticated session and backend approval.
//
// No Daily Gift logic is registered here.
//
// =========================================================

import EventsController from "./components/events/EventsController";

import EventsPage from "./components/events/EventsPage";

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
// FSOCIETY — APPLICATION ARCHITECTURE
// =========================================================
//
// App
// └── ThemeProvider (when required)
//     └── NewYearProvider
//         └── AppInner
//             └── BrowserRouter
//                 ├── WinterBackground
//                 ├── AuthToast
//                 ├── EventsController
//                 ├── AppContent
//                 │   ├── Public authentication
//                 │   ├── Public Frame Shop
//                 │   ├── Public Events
//                 │   └── Protected application
//                 └── Snowfall
//
// IMPORTANT:
//
// Authentication: Redux + AuthService
// Theme: ThemeContext
// Winter: NewYearContext
// Events: Redux Events slice
// Gifts: Seasonal Gift slice
//
// Daily Gift has been removed.
//
// =========================================================


// =========================================================
// AUTHENTICATED USER NORMALIZER
// =========================================================
//
// Preserve the existing AuthService contract.
//
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

    // Authentication bootstrap is running.

    if (isLoading) {
        return <AppLoader />;
    }

    // Not authenticated.

    if (!isLoggedIn) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return children;
};


// =========================================================
// PUBLIC AUTHENTICATION PAGE
// =========================================================
//
// Login and Register have their own layouts.
//
// Authenticated users are redirected home.
//
// =========================================================

const PublicAuthPage = ({ children }) => {
    const {
        isLoggedIn,
        isLoading,
    } = useSelector(
        (state) => state.auth
    );

    if (isLoading) {
        return <AppLoader />;
    }

    if (isLoggedIn) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

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
                transition-colors
                duration-200
                dark:bg-transparent
                dark:text-slate-100
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
// Shared layout:
//
// Navbar
// FrameVaultNavigation (optional)
// Main content / Outlet
// Footer
//
// requireAuth=false supports:
//
// /frames/shop
// /events
//
// Existing private routes remain protected.
//
// =========================================================

const AppLayout = ({
    requireAuth = true,
    showFrameNavigation = false,
}) => {
    const {
        isDark,
        toggleTheme,
    } = useContext(ThemeContext);

    const isDarkMode = isDark;

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
                transition-colors
                duration-300
                dark:bg-transparent
                dark:text-gray-200
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
                    transition-colors
                    duration-300
                    dark:bg-transparent
                    dark:text-gray-200
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

    // Private application layout.

    if (requireAuth) {
        return (
            <PrivateRoute>
                {layout}
            </PrivateRoute>
        );
    }

    // Public application layout.

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
    // Prevent stale authentication responses
    // from restoring a logged-out session.
    //
    // =====================================================

    const authGenerationRef = useRef(0);

    // =====================================================
    // FORCED LOGOUT LISTENER
    // =====================================================
    //
    // The existing Axios client dispatches
    // "auth:logout" when session refresh fails.
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
    // Uses existing cookie-based JWT session.
    //
    // No new Axios instance.
    // No new refresh-token mechanism.
    //
    // =====================================================

    useEffect(() => {
        let isMounted = true;

        const currentGeneration =
            ++authGenerationRef.current;

        const isCurrentRequest = () =>
            isMounted &&
            currentGeneration ===
                authGenerationRef.current;

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

                // Valid session.

                if (authenticatedUser) {
                    dispatch(
                        signUserSuccess(
                            authenticatedUser
                        )
                    );

                    return;
                }

                // Missing or invalid session.

                dispatch(
                    logoutUser()
                );
            } catch (error) {
                if (!isCurrentRequest()) {
                    return;
                }

                // Unauthenticated guests can
                // legitimately receive HTTP 401.
                //
                // Do not show a login-form error.

                dispatch(
                    logoutUser()
                );
            }
        };

        void checkUserStatus();

        return () => {
            isMounted = false;

            ++authGenerationRef.current;
        };
    }, [dispatch]);

    // =====================================================
    // WEBSOCKET NOTIFICATIONS
    // =====================================================
    //
    // Authenticated -> Connect
    // Guest         -> Disconnect
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
                            transition-colors
                            duration-200
                            dark:text-gray-100
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
                {/* Public Frame Shop */}

                <Route
                    path="shop"
                    element={
                        <FrameShop />
                    }
                />

                {/* Private Frame Inventory */}

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
                FSOCIETY EVENTS — PUBLIC
            ========================================= */}
            {/*
                Everyone can view event details,
                holiday dates and countdowns.

                Claiming a gift remains protected
                by the Seasonal Gift Redux thunk
                and Django authentication.

                This route is independent of
                NewYearProvider winter settings.
            */}

            <Route
                path="/events"
                element={
                    <AppLayout
                        requireAuth={false}
                    />
                }
            >
                <Route
                    index
                    element={
                        <EventsPage />
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
                            transition-colors
                            duration-200
                            dark:text-gray-100
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

const AppInner = () => {
    // =====================================================
    // WINTER BACKGROUND SETTINGS
    // =====================================================

    const { settings } = useNewYear();

    const isWinterBackgroundEnabled =
        settings?.winterBackgroundEnabled ??
        true;

    // =====================================================
    // ROOT RENDER
    // =====================================================

    return (
        <Router>
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
                    GLOBAL WINTER BACKGROUND
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
                    GLOBAL CONTENT
                ===================================== */}

                <div
                    className="
                        relative z-10
                        min-h-screen
                        min-h-[100dvh]
                    "
                >
                    {/* GLOBAL AUTH TOAST */}

                    <AuthToast />

                    {/* =================================
                        GLOBAL EVENTS CONTROLLER
                    ================================= */}
                    {/*
                        Public event data is loaded
                        once at application startup.

                        The controller does not claim
                        gifts or create daily rewards.

                        Navbar can later use this
                        public Redux state.
                    */}

                    <EventsController />

                    {/* =================================
                        APPLICATION ROUTES
                    ================================= */}

                    <AppContent />

                    {/* =================================
                        GLOBAL WINTER SNOWFALL
                    ================================= */}

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
// Preserve the existing ThemeProvider fallback.
//
// =========================================================

function App() {
    const existingThemeContext =
        useContext(ThemeContext);

    // ThemeProvider already exists in index.js.

    if (existingThemeContext) {
        return (
            <NewYearProvider>
                <AppInner />
            </NewYearProvider>
        );
    }

    // Standalone application fallback.

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
