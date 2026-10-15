
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useLocation,
    useNavigate,
} from "react-router-dom";

// =========================================================
// NAVBAR COMPONENTS
// =========================================================

import NavbarBrand from "./navbar/NavbarBrand";
import NavbarLinks from "./navbar/NavbarLinks";
import NavbarActions from "./navbar/NavbarActions";

import MobileNavbarSidebar from "./MobileNavbarSidebar";

import {
    NAV_LINKS,
} from "./navbar/navConfig";

// =========================================================
// AUTH
// =========================================================

import {
    logoutUser,
} from "../features/auth/Auth";

import AuthService from "../services/auth";

// =========================================================
// UTILS
// =========================================================

import {
    getUserAvatarUrl,
} from "../utils/imageUtils";

// =========================================================
// NAVBAR
// =========================================================

const Navbar = () => {

    // =====================================================
    // HOOKS
    // =====================================================

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const location = useLocation();

    // =====================================================
    // AUTH STATE
    // =====================================================

    const {
        isLoggedIn,
        user,
    } = useSelector(
        (state) => state.auth
    );

    // =====================================================
    // LOCAL STATE
    // =====================================================

    const [
        openUserMenu,
        setOpenUserMenu,
    ] = useState(false);

    const [
        openNotifications,
        setOpenNotifications,
    ] = useState(false);

    const [
        isMobileMenuOpen,
        setIsMobileMenuOpen,
    ] = useState(false);

    // =====================================================
    // REFS
    // =====================================================

    const userMenuRef = useRef(null);

    const notificationsRef = useRef(null);

    // =====================================================
    // AVATAR
    // =====================================================

    const avatarUrl = useMemo(
        () => getUserAvatarUrl(user),
        [user]
    );

    // =====================================================
    // ACTIVE ROUTE
    // =====================================================

    const isActive = useCallback(
        (path) => {

            if (path === "/") {
                return location.pathname === "/";
            }

            return (
                location.pathname === path ||
                location.pathname.startsWith(
                    `${path}/`
                )
            );
        },
        [location.pathname]
    );

    // =====================================================
    // CLOSE MENUS ON ROUTE CHANGE
    // =====================================================

    useEffect(() => {

        setOpenUserMenu(false);

        setOpenNotifications(false);

        setIsMobileMenuOpen(false);

    }, [location.pathname]);

    // =====================================================
    // CLICK OUTSIDE
    // =====================================================

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(
                    event.target
                )
            ) {
                setOpenUserMenu(false);
            }

            if (
                notificationsRef.current &&
                !notificationsRef.current.contains(
                    event.target
                )
            ) {
                setOpenNotifications(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };

    }, []);

    // =====================================================
    // CLOSE ON ESCAPE
    // =====================================================

    useEffect(() => {

        const handleEscape = (event) => {

            if (event.key !== "Escape") {
                return;
            }

            setOpenUserMenu(false);

            setOpenNotifications(false);

            setIsMobileMenuOpen(false);
        };

        window.addEventListener(
            "keydown",
            handleEscape
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleEscape
            );
        };

    }, []);

    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = useCallback(
        async () => {

            setOpenUserMenu(false);

            setOpenNotifications(false);

            setIsMobileMenuOpen(false);

            try {

                await AuthService.userLogout();

            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

            } finally {

                dispatch(
                    logoutUser()
                );

                navigate(
                    "/login",
                    {
                        replace: true,
                    }
                );
            }
        },
        [
            dispatch,
            navigate,
        ]
    );

    // =====================================================
    // MOBILE MENU
    // =====================================================

    const toggleMobileMenu = useCallback(
        () => {

            setOpenUserMenu(false);

            setOpenNotifications(false);

            setIsMobileMenuOpen(
                (previous) => !previous
            );

        },
        []
    );

    // =====================================================
    // JSX
    // =====================================================

    return (
        <>

            {/* ==========================================
                NAVBAR HEADER

                DARK:
                Original FSociety design.

                LIGHT:
                Soft premium slate-blue surface.
            ========================================== */}

            <header
                className="
                    sticky
                    left-0
                    right-0
                    top-0
                    z-50

                    border-b
                    border-[#cdd7e8]

                    bg-[#eaf0f9]/95

                    text-slate-800

                    shadow-[0_8px_28px_rgba(30,41,59,0.07)]

                    backdrop-blur-xl

                    transition-colors
                    duration-300

                    dark:border-white/[0.06]

                    dark:bg-[#080c12]/95

                    dark:text-gray-100

                    dark:shadow-none
                "
            >

                {/* ======================================
                    SUBTLE LIGHT MODE ACCENT
                ====================================== */}

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute
                        inset-x-0
                        bottom-0

                        h-px

                        bg-gradient-to-r
                        from-transparent
                        via-indigo-500/20
                        to-transparent

                        dark:hidden
                    "
                />

                {/* ======================================
                    NAVBAR CONTAINER
                ====================================== */}

                <div
                    className="
                        relative
                        mx-auto
                        w-full
                        max-w-[1440px]
                        px-4
                        sm:px-6
                    "
                >

                    <div
                        className="
                            flex
                            min-h-[72px]

                            items-center
                            justify-between

                            gap-4
                        "
                    >

                        {/* ==============================
                            BRAND
                        ============================== */}

                        <NavbarBrand />

                        {/* ==============================
                            DESKTOP NAVIGATION
                        ============================== */}

                        <NavbarLinks
                            isActive={isActive}
                        />

                        {/* ==============================
                            RIGHT ACTIONS
                        ============================== */}

                        <NavbarActions
                            isLoggedIn={isLoggedIn}
                            user={user}
                            avatarUrl={avatarUrl}

                            openUserMenu={openUserMenu}
                            setOpenUserMenu={
                                setOpenUserMenu
                            }
                            userMenuRef={userMenuRef}

                            openNotifications={
                                openNotifications
                            }
                            setOpenNotifications={
                                setOpenNotifications
                            }
                            notificationsRef={
                                notificationsRef
                            }

                            isMobileMenuOpen={
                                isMobileMenuOpen
                            }
                            toggleMobileMenu={
                                toggleMobileMenu
                            }

                            handleLogout={
                                handleLogout
                            }
                        />

                    </div>

                </div>

            </header>

            {/* ==========================================
                MOBILE SIDEBAR
            ========================================== */}

            <MobileNavbarSidebar
                isOpen={isMobileMenuOpen}
                setIsOpen={setIsMobileMenuOpen}

                navLinks={NAV_LINKS}

                isActive={isActive}

                isLoggedIn={isLoggedIn}

                user={user}

                avatarUrl={avatarUrl}

                handleLogout={handleLogout}
            />

        </>
    );
};

export default Navbar;
