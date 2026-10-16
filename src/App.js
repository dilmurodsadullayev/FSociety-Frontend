
import React, { useEffect } from "react";

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
// AUTH REDUX ACTIONS
// =========================================================

import {
    logoutUser,
    signUserSuccess,
    signUserStart,
    signUserFailure,
} from "./features/auth/Auth";

// =========================================================
// NOTIFICATION WEBSOCKET
// =========================================================

import {
    connectWebSocket,
    disconnectWebSocket,
} from "./middleware/notificationMiddleware";

// =========================================================
// GLOBAL UI COMPONENTS
// =========================================================

// Shared loader used throughout the application.
import AppLoader from "./components/AppLoader";

// Global toast notification system.
import AuthToast from "./components/ui/AuthToast";

// =========================================================
// FSOCIETY — APP
//
// Global responsibilities:
//
// - Application routing
// - Authentication initialization
// - Protected routes
// - Public authentication routes
// - Notification WebSocket lifecycle
// - Forced logout event
// - Shared application layout
// - Global toast notifications
//
// AppLoader is imported from:
// src/components/AppLoader.jsx
//
// Theme management remains in:
// src/context/ThemeContext.jsx
//
// No duplicate loader markup.
// No independent theme state.
// =========================================================

// =========================================================
// PRIVATE ROUTE
//
// Protects authenticated pages.
//
// While Redux is checking authentication,
// display the shared AppLoader.
//
// Unauthorized users are redirected to /login.
// =========================================================

const PrivateRoute = ({ children }) => {
    const {
        isLoggedIn,
        isLoading,
    } = useSelector((state) => state.auth);

    // =====================================================
    // AUTHENTICATION LOADING
    // =====================================================

    if (isLoading) {
        return <AppLoader />;
    }

    // =====================================================
    // AUTHENTICATED / UNAUTHENTICATED
    // =====================================================

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
// PUBLIC AUTH PAGE
//
// Used by:
// - Login
// - Register
//
// While authentication is loading,
// display the same shared AppLoader.
//
// Authenticated users are redirected home.
// =========================================================

const PublicAuthPage = ({ children }) => {
    const {
        isLoggedIn,
        isLoading,
    } = useSelector((state) => state.auth);

    // =====================================================
    // AUTHENTICATION LOADING
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
    // PUBLIC AUTH LAYOUT
    //
    // Light and dark themes are supported.
    // =====================================================

    return (
        <div
            className="
                flex
                min-h-screen
                min-h-[100dvh]
                w-full
                min-w-0

                items-center
                justify-center

                bg-slate-50
                text-slate-900

                transition-colors
                duration-200

                dark:bg-[#0d1117]
                dark:text-gray-100

                motion-reduce:transition-none
            "
        >
            {children}
        </div>
    );
};

// =========================================================
// APP LAYOUT
//
// All protected application pages use:
//
// - Navbar
// - Main content
// - Footer
//
// Protected route behavior is preserved.
// =========================================================

const AppLayout = () => {
    return (
        <PrivateRoute>
            <div
                className="
                    flex
                    min-h-screen
                    min-h-[100dvh]
                    w-full
                    min-w-0
                    flex-col
                "
            >
                {/* ======================================
                    NAVBAR
                ====================================== */}

                <Navbar />

                {/* ======================================
                    MAIN CONTENT
                ====================================== */}

                <div
                    className="
                        min-w-0
                        flex-grow

                        bg-gray-100
                        text-gray-800

                        transition-colors
                        duration-150

                        dark:bg-[#0d1117]
                        dark:text-gray-200

                        motion-reduce:transition-none
                    "
                >
                    <Outlet />
                </div>

                {/* ======================================
                    FOOTER
                ====================================== */}

                <Footer />
            </div>
        </PrivateRoute>
    );
};

// =========================================================
// APP CONTENT
//
// Handles:
//
// 1. Initial authentication check
// 2. Force logout events
// 3. WebSocket notifications
// 4. Application routes
// =========================================================

const AppContent = () => {
    const dispatch = useDispatch();

    // =====================================================
    // AUTH STATE
    // =====================================================

    const isLoggedIn = useSelector(
        (state) => Boolean(state.auth?.isLoggedIn)
    );

    // =====================================================
    // THEME
    //
    // Theme is managed by ThemeContext.
    //
    // Do not create a second theme state here.
    // =====================================================

    // =====================================================
    // INITIAL AUTHENTICATION CHECK
    //
    // Verify current user from backend.
    //
    // Preserve:
    // - signUserStart
    // - signUserSuccess
    // - signUserFailure
    // - logoutUser
    //
    // Ignore results after unmount.
    // =====================================================

    useEffect(() => {
        let isMounted = true;

        const checkUserStatus = async () => {
            dispatch(signUserStart());

            try {
                const response =
                    await AuthService.getUser();

                if (!isMounted) {
                    return;
                }

                if (response && response.id) {
                    dispatch(
                        signUserSuccess(response)
                    );

                    return;
                }

                dispatch(
                    signUserFailure(
                        "Foydalanuvchi ma'lumotlari topilmadi."
                    )
                );

                dispatch(logoutUser());
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                dispatch(
                    signUserFailure(
                        error?.message ||
                        "Autentifikatsiya tekshiruvida xatolik yuz berdi."
                    )
                );

                dispatch(logoutUser());
            }
        };

        checkUserStatus();

        return () => {
            isMounted = false;
        };
    }, [dispatch]);

    // =====================================================
    // FORCE LOGOUT EVENT
    //
    // Event name:
    // auth:logout
    //
    // Preserve:
    // - Redux logout
    // - WebSocket disconnect
    // - Event listener cleanup
    // =====================================================

    useEffect(() => {
        const handleForceLogout = () => {
            dispatch(logoutUser());

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
    // WEBSOCKET NOTIFICATIONS
    //
    // Authenticated:
    // Connect WebSocket.
    //
    // Unauthenticated:
    // Disconnect WebSocket.
    //
    // Cleanup:
    // Disconnect on effect cleanup.
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
    //
    // All existing routes preserved.
    // =====================================================

    return (
        <Routes>
            {/* ==========================================
                PUBLIC AUTH ROUTES
            ========================================== */}

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

            {/* ==========================================
                SOCIAL AUTH CALLBACK
            ========================================== */}

            <Route
                path="/callback/:provider"
                element={
                    <div
                        className="
                            flex
                            min-h-screen
                            min-h-[100dvh]
                            w-full
                            min-w-0

                            items-center
                            justify-center

                            bg-slate-50
                            text-slate-900

                            dark:bg-[#0d1117]
                            dark:text-gray-100
                        "
                    >
                        <SocialCallback />
                    </div>
                }
            />

            {/* ==========================================
                PRIVATE APPLICATION ROUTES
            ========================================== */}

            <Route
                path="/"
                element={<AppLayout />}
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

                {/* CREATE PROBLEM */}

                <Route
                    path="problem-create"
                    element={<ProblemCreate />}
                />

                {/* EDIT PROBLEM */}

                <Route
                    path="problem/:id/edit"
                    element={<ProblemCreate />}
                />

                {/* EDIT SOLUTION */}

                <Route
                    path="problem/:id/solution/:solutionId/edit"
                    element={<ProblemSolutionUpdate />}
                />

                {/* PROBLEM DETAIL */}

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
                    USERS AND PROFILE
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

                Public 404 fallback.
                Light/Dark Mode supported.
            ========================================== */}

            <Route
                path="*"
                element={
                    <div
                        className="
                            flex
                            min-h-screen
                            min-h-[100dvh]
                            w-full
                            min-w-0

                            items-center
                            justify-center

                            bg-slate-50
                            text-slate-900

                            dark:bg-[#0d1117]
                            dark:text-gray-100
                        "
                    >
                        <NotFound />
                    </div>
                }
            />
        </Routes>
    );
};

// =========================================================
// ROOT APP
//
// Router is mounted once.
//
// AuthToast remains mounted globally.
//
// AppLoader is rendered by authentication
// wrappers when Redux auth is loading.
//
// Existing application routes are preserved.
// =========================================================

const App = () => {
    return (
        <Router>
            {/* ======================================
                GLOBAL TOAST SYSTEM
            ====================================== */}

            <AuthToast />

            {/* ======================================
                APPLICATION
            ====================================== */}

            <AppContent />
        </Router>
    );
};

export default App;
