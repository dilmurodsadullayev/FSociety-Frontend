
import React, {
    useEffect,
    useRef,
} from "react";

import {
    Link,
} from "react-router-dom";

import {
    AnimatePresence,
    motion,
} from "framer-motion";

import {
    Bug,
    ChevronRight,
    Coins,
    LogIn,
    LogOut,
    UserCircle,
    X,
} from "lucide-react";

import FSocietyLogo from "../assests/logo/f_society.png";
import UserImage from "../assests/userImage.jpeg";

// =========================================================
// FSOCIETY — MOBILE NAVBAR SIDEBAR
//
// Features:
// - Dark / Light Mode
// - Responsive sidebar
// - Keyboard navigation
// - Escape to close
// - Overlay click to close
// - Body scroll lock
// - Focus management
// - Active navigation links
// - User information
// - FCoin balance
// - Profile / My Problems
// - Login / Logout
//
// Theme is controlled globally by ThemeContext.
// No additional theme state is needed here.
// =========================================================

// =========================================================
// ANIMATIONS
// =========================================================

const sidebarVariants = {
    hidden: {
        x: "-100%",
    },

    visible: {
        x: 0,

        transition: {
            duration: 0.23,
            ease: [0.22, 1, 0.36, 1],
        },
    },

    exit: {
        x: "-100%",

        transition: {
            duration: 0.18,
            ease: "easeInOut",
        },
    },
};

const overlayVariants = {
    hidden: {
        opacity: 0,
    },

    visible: {
        opacity: 1,

        transition: {
            duration: 0.18,
        },
    },

    exit: {
        opacity: 0,

        transition: {
            duration: 0.15,
        },
    },
};

// =========================================================
// MOBILE NAVBAR SIDEBAR
// =========================================================

const MobileNavbarSidebar = ({
    isOpen,
    setIsOpen,

    navLinks = [],
    isActive,

    isLoggedIn,
    user,
    avatarUrl,

    handleLogout,
}) => {
    // =====================================================
    // REFS
    // =====================================================

    const sidebarRef = useRef(null);
    const closeButtonRef = useRef(null);

    // =====================================================
    // CLOSE SIDEBAR
    // =====================================================

    const closeSidebar = () => {
        setIsOpen(false);
    };

    // =====================================================
    // LOGOUT
    // =====================================================

    const onLogout = () => {
        closeSidebar();
        handleLogout?.();
    };

    // =====================================================
    // BODY SCROLL LOCK + KEYBOARD
    // =====================================================

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const previousOverflow =
            document.body.style.overflow;

        const previousFocus =
            document.activeElement;

        const focusWasOutside =
            !sidebarRef.current?.contains(
                previousFocus
            );

        document.body.style.overflow = "hidden";

        // Move focus inside the sidebar.
        closeButtonRef.current?.focus();

        // ================================================
        // KEYBOARD HANDLER
        // ================================================

        const handleKeyDown = (event) => {
            // Escape closes the sidebar.
            if (event.key === "Escape") {
                event.preventDefault();
                setIsOpen(false);
                return;
            }

            // Keep keyboard focus inside the sidebar.
            if (event.key !== "Tab") {
                return;
            }

            const sidebar = sidebarRef.current;

            if (!sidebar) {
                return;
            }

            const focusableElements = Array.from(
                sidebar.querySelectorAll(
                    'a[href], button:not([disabled]), ' +
                    'input:not([disabled]), ' +
                    'select:not([disabled]), ' +
                    'textarea:not([disabled]), ' +
                    '[tabindex]:not([tabindex="-1"])'
                )
            ).filter(
                (element) =>
                    element.getClientRects().length > 0
            );

            if (focusableElements.length === 0) {
                event.preventDefault();
                sidebar.focus();
                return;
            }

            const firstElement =
                focusableElements[0];

            const lastElement =
                focusableElements[
                    focusableElements.length - 1
                ];

            const activeElement =
                document.activeElement;

            if (event.shiftKey) {
                if (
                    activeElement === firstElement ||
                    !sidebar.contains(activeElement)
                ) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else if (
                activeElement === lastElement ||
                !sidebar.contains(activeElement)
            ) {
                event.preventDefault();
                firstElement.focus();
            }
        };

        // ================================================
        // DESKTOP RESIZE
        // ================================================

        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsOpen(false);
            }
        };

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        window.addEventListener(
            "resize",
            handleResize
        );

        // ================================================
        // CLEANUP
        // ================================================

        return () => {
            document.body.style.overflow =
                previousOverflow;

            document.removeEventListener(
                "keydown",
                handleKeyDown
            );

            window.removeEventListener(
                "resize",
                handleResize
            );

            // Restore focus to the menu trigger.
            if (
                focusWasOutside &&
                previousFocus &&
                previousFocus.isConnected &&
                typeof previousFocus.focus === "function"
            ) {
                previousFocus.focus();
            }
        };
    }, [
        isOpen,
        setIsOpen,
    ]);

    // =====================================================
    // AVATAR ERROR
    // =====================================================

    const handleAvatarError = (event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = UserImage;
    };

    // =====================================================
    // USER DATA
    // =====================================================

    const username =
        user?.username || "user";

    const userLevel =
        user?.skill_level ||
        user?.level ||
        "developer";

    const userCoins =
        user?.coins ?? 0;

    // =====================================================
    // JSX
    // =====================================================

    return (
        <AnimatePresence>
            {isOpen && (
                <React.Fragment>

                    {/* ==================================
                        OVERLAY
                    ================================== */}

                    <motion.button
                        type="button"
                        aria-label="Mobil menyuni yopish"

                        onClick={closeSidebar}

                        tabIndex={-1}

                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"

                        className="
                            fixed
                            inset-0
                            z-[80]

                            cursor-default

                            bg-slate-950/50

                            lg:hidden

                            dark:bg-black/75
                        "
                    />

                    {/* ==================================
                        SIDEBAR
                    ================================== */}

                    <motion.aside
                        ref={sidebarRef}

                        id="fsociety-mobile-navigation"

                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="fsociety-mobile-menu-title"

                        tabIndex={-1}

                        variants={sidebarVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"

                        className="
                            fixed
                            left-0
                            top-0
                            z-[90]

                            flex
                            h-[100dvh]
                            w-[86%]
                            max-w-[360px]
                            flex-col

                            overflow-hidden

                            border-r
                            border-[#d5deeb]

                            bg-[#f5f8ff]

                            shadow-[20px_0_65px_rgba(30,41,59,0.15)]

                            outline-none

                            lg:hidden

                            dark:border-cyan-400/10
                            dark:bg-[#080d18]

                            dark:shadow-[25px_0_80px_rgba(0,0,0,0.65)]
                        "
                    >

                        {/* ==============================
                            HEADER
                        ============================== */}

                        <div
                            className="
                                relative
                                shrink-0
                                overflow-hidden

                                border-b
                                border-[#e0e7f1]

                                bg-white/50

                                p-4

                                dark:border-white/[0.07]
                                dark:bg-transparent
                            "
                        >

                            {/* BACKGROUND ACCENT */}

                            <span
                                aria-hidden="true"
                                className="
                                    pointer-events-none

                                    absolute
                                    -right-12
                                    -top-12

                                    h-36
                                    w-36

                                    rounded-full

                                    bg-gradient-to-bl
                                    from-cyan-500/10
                                    to-transparent

                                    dark:from-cyan-500/15
                                "
                            />

                            <span
                                aria-hidden="true"
                                className="
                                    pointer-events-none

                                    absolute
                                    -bottom-12
                                    -left-12

                                    h-36
                                    w-36

                                    rounded-full

                                    bg-gradient-to-tr
                                    from-indigo-500/10
                                    to-transparent

                                    dark:from-indigo-500/15
                                "
                            />

                            {/* TOP ROW */}

                            <div
                                className="
                                    relative
                                    z-10

                                    flex
                                    items-center
                                    justify-between
                                    gap-3
                                "
                            >

                                {/* BRAND */}

                                <Link
                                    to="/"
                                    onClick={closeSidebar}

                                    className="
                                        group/brand

                                        flex
                                        min-w-0
                                        flex-1

                                        items-center
                                        gap-3

                                        rounded-xl

                                        focus-visible:outline-none
                                        focus-visible:ring-2
                                        focus-visible:ring-indigo-500
                                    "
                                >
                                    <img
                                        src={FSocietyLogo}
                                        alt="F.Society"

                                        draggable={false}

                                        className="
                                            h-11
                                            w-11
                                            shrink-0

                                            object-contain

                                            transition-transform
                                            duration-500

                                            group-hover/brand:rotate-[360deg]

                                            motion-reduce:transition-none
                                        "
                                    />

                                    <div
                                        className="
                                            min-w-0
                                            flex-1
                                        "
                                    >
                                        <h2
                                            id="fsociety-mobile-menu-title"

                                            className="
                                                truncate

                                                text-[23px]
                                                font-bold
                                                tracking-[-0.05em]

                                                text-slate-900

                                                dark:text-white
                                            "
                                        >
                                            F
                                            <span
                                                className="
                                                    text-indigo-600
                                                    dark:text-indigo-400
                                                "
                                            >
                                                Society
                                            </span>
                                        </h2>

                                        <p
                                            className="
                                                truncate

                                                font-mono
                                                text-[9px]
                                                font-bold
                                                uppercase
                                                tracking-[0.25em]

                                                text-cyan-700/70

                                                dark:text-cyan-300/60
                                            "
                                        >
                                            Fix Society
                                        </p>
                                    </div>
                                </Link>

                                {/* CLOSE BUTTON */}

                                <button
                                    ref={closeButtonRef}

                                    type="button"
                                    onClick={closeSidebar}
                                    aria-label="Menyuni yopish"

                                    className="
                                        grid
                                        h-10
                                        w-10
                                        shrink-0

                                        place-items-center

                                        rounded-xl
                                        border

                                        border-[#d6deea]

                                        bg-white/80
                                        text-slate-500

                                        transition-colors
                                        duration-150

                                        hover:border-red-400/30
                                        hover:bg-red-500/[0.08]
                                        hover:text-red-600

                                        focus-visible:outline-none
                                        focus-visible:ring-2
                                        focus-visible:ring-indigo-500

                                        dark:border-white/[0.08]
                                        dark:bg-white/[0.035]
                                        dark:text-gray-500

                                        dark:hover:border-red-400/30
                                        dark:hover:bg-red-500/[0.08]
                                        dark:hover:text-red-300
                                    "
                                >
                                    <X
                                        size={19}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />
                                </button>
                            </div>

                            {/* ==========================
                                CURRENT USER
                            ========================== */}

                            {isLoggedIn && (
                                <div
                                    className="
                                        relative
                                        z-10

                                        mt-5

                                        overflow-hidden

                                        rounded-2xl
                                        border

                                        border-cyan-500/20

                                        bg-cyan-500/[0.055]

                                        p-3

                                        dark:border-cyan-400/15
                                        dark:bg-cyan-400/[0.045]
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                        "
                                    >

                                        {/* AVATAR */}

                                        <div
                                            className="
                                                relative

                                                h-12
                                                w-12
                                                shrink-0

                                                overflow-hidden

                                                rounded-xl
                                                border

                                                border-[#d7e1ee]

                                                bg-[#e7edf6]

                                                dark:border-white/10
                                                dark:bg-[#11161e]
                                            "
                                        >
                                            <img
                                                src={
                                                    avatarUrl ||
                                                    UserImage
                                                }

                                                alt={`${username} avatar`}

                                                onError={
                                                    handleAvatarError
                                                }

                                                className="
                                                    h-full
                                                    w-full
                                                    object-cover
                                                "
                                            />
                                        </div>

                                        {/* USER DETAILS */}

                                        <div
                                            className="
                                                min-w-0
                                                flex-1
                                            "
                                        >
                                            <p
                                                className="
                                                    text-[9px]
                                                    font-bold
                                                    uppercase
                                                    tracking-[0.22em]

                                                    text-slate-500

                                                    dark:text-gray-600
                                                "
                                            >
                                                Current user
                                            </p>

                                            <h3
                                                className="
                                                    mt-1
                                                    truncate

                                                    text-[15px]
                                                    font-bold

                                                    text-slate-900

                                                    dark:text-white
                                                "
                                            >
                                                @{username}
                                            </h3>

                                            <div
                                                className="
                                                    mt-1.5

                                                    flex
                                                    items-center
                                                    gap-2

                                                    text-[10px]
                                                    font-semibold

                                                    text-slate-500

                                                    dark:text-gray-500
                                                "
                                            >
                                                {/* LEVEL */}

                                                <span
                                                    className="
                                                        truncate
                                                        uppercase
                                                    "
                                                >
                                                    {userLevel}
                                                </span>

                                                <span
                                                    aria-hidden="true"

                                                    className="
                                                        text-slate-300

                                                        dark:text-gray-700
                                                    "
                                                >
                                                    /
                                                </span>

                                                {/* COINS */}

                                                <span
                                                    className="
                                                        flex
                                                        shrink-0

                                                        items-center
                                                        gap-1

                                                        text-amber-700

                                                        dark:text-amber-300
                                                    "
                                                >
                                                    <Coins
                                                        size={12}
                                                        aria-hidden="true"
                                                    />

                                                    {userCoins}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ==============================
                            SCROLL AREA
                        ============================== */}

                        <div
                            className="
                                min-h-0
                                flex-1
                                overflow-y-auto
                                overscroll-contain
                            "
                        >

                            {/* ==========================
                                NAVIGATION
                            ========================== */}

                            <nav
                                aria-label="Mobil navigatsiya"

                                className="
                                    space-y-1.5
                                    p-4
                                "
                            >
                                <p
                                    className="
                                        mb-3
                                        px-2

                                        font-mono
                                        text-[9px]
                                        font-bold
                                        uppercase
                                        tracking-[0.25em]

                                        text-slate-500

                                        dark:text-gray-700
                                    "
                                >
                                    Navigation
                                </p>

                                {navLinks.map((link) => {
                                    const Icon = link.Icon;

                                    const active =
                                        typeof isActive === "function"
                                            ? isActive(link.path)
                                            : false;

                                    return (
                                        <Link
                                            key={link.path}
                                            to={link.path}

                                            onClick={
                                                closeSidebar
                                            }

                                            aria-current={
                                                active
                                                    ? "page"
                                                    : undefined
                                            }

                                            className={`
                                                group

                                                flex
                                                items-center
                                                gap-3

                                                rounded-2xl
                                                border

                                                px-3
                                                py-3

                                                transition-colors
                                                duration-150

                                                focus-visible:outline-none
                                                focus-visible:ring-2
                                                focus-visible:ring-indigo-500

                                                ${
                                                    active
                                                        ? `
                                                            border-indigo-400/30

                                                            bg-indigo-500/[0.09]

                                                            text-indigo-700

                                                            dark:border-indigo-400/25
                                                            dark:bg-indigo-500/10
                                                            dark:text-indigo-200
                                                        `
                                                        : `
                                                            border-transparent

                                                            text-slate-600

                                                            hover:border-[#dce4f0]
                                                            hover:bg-white/80
                                                            hover:text-indigo-700

                                                            dark:text-gray-500

                                                            dark:hover:border-white/[0.06]
                                                            dark:hover:bg-white/[0.035]
                                                            dark:hover:text-gray-200
                                                        `
                                                }
                                            `}
                                        >

                                            {/* ICON */}

                                            <span
                                                className={`
                                                    grid
                                                    h-10
                                                    w-10
                                                    shrink-0

                                                    place-items-center

                                                    rounded-xl
                                                    border

                                                    transition-colors
                                                    duration-150

                                                    ${
                                                        active
                                                            ? `
                                                                border-indigo-400/20
                                                                bg-indigo-500/10
                                                                text-indigo-700

                                                                dark:border-indigo-400/15
                                                                dark:text-indigo-300
                                                            `
                                                            : `
                                                                border-[#e0e7f0]
                                                                bg-white/75
                                                                text-slate-500

                                                                group-hover:text-cyan-700

                                                                dark:border-white/[0.05]
                                                                dark:bg-white/[0.025]
                                                                dark:text-gray-600

                                                                dark:group-hover:text-cyan-300
                                                            `
                                                    }
                                                `}
                                            >
                                                {Icon && (
                                                    <Icon
                                                        size={17}
                                                        strokeWidth={2}
                                                        aria-hidden="true"
                                                    />
                                                )}
                                            </span>

                                            {/* LABEL */}

                                            <span
                                                className="
                                                    min-w-0
                                                    flex-1

                                                    text-[12px]
                                                    font-bold

                                                    uppercase
                                                    tracking-[0.08em]
                                                "
                                            >
                                                {link.text}
                                            </span>

                                            {/* CHEVRON */}

                                            <ChevronRight
                                                size={15}
                                                aria-hidden="true"

                                                className="
                                                    shrink-0

                                                    text-slate-400

                                                    transition-transform
                                                    duration-150

                                                    group-hover:translate-x-0.5

                                                    dark:text-gray-700
                                                    dark:group-hover:text-gray-500
                                                "
                                            />
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* ==========================
                                ACCOUNT
                            ========================== */}

                            {isLoggedIn && (
                                <div
                                    className="
                                        px-4
                                        pb-4
                                    "
                                >
                                    <p
                                        className="
                                            mb-3
                                            px-2

                                            font-mono
                                            text-[9px]
                                            font-bold

                                            uppercase
                                            tracking-[0.25em]

                                            text-slate-500

                                            dark:text-gray-700
                                        "
                                    >
                                        Account
                                    </p>

                                    <div className="space-y-1.5">

                                        {/* PROFILE */}

                                        <Link
                                            to={`/${username}/profile`}
                                            onClick={closeSidebar}

                                            className="
                                                group

                                                flex
                                                items-center
                                                gap-3

                                                rounded-2xl
                                                border
                                                border-transparent

                                                px-3
                                                py-3

                                                text-slate-600

                                                transition-colors
                                                duration-150

                                                hover:border-indigo-400/20
                                                hover:bg-indigo-500/[0.06]
                                                hover:text-indigo-700

                                                focus-visible:outline-none
                                                focus-visible:ring-2
                                                focus-visible:ring-indigo-500

                                                dark:text-gray-500

                                                dark:hover:border-indigo-400/10
                                                dark:hover:bg-indigo-500/[0.06]
                                                dark:hover:text-indigo-300
                                            "
                                        >
                                            <span
                                                className="
                                                    grid
                                                    h-10
                                                    w-10

                                                    shrink-0
                                                    place-items-center

                                                    rounded-xl

                                                    bg-indigo-500/[0.08]

                                                    text-indigo-600

                                                    dark:text-indigo-400
                                                "
                                            >
                                                <UserCircle
                                                    size={18}
                                                    aria-hidden="true"
                                                />
                                            </span>

                                            <span
                                                className="
                                                    flex-1

                                                    text-[13px]
                                                    font-semibold
                                                "
                                            >
                                                Profilim
                                            </span>

                                            <ChevronRight
                                                size={15}
                                                aria-hidden="true"

                                                className="
                                                    ml-auto

                                                    text-slate-400

                                                    dark:text-gray-700
                                                "
                                            />
                                        </Link>

                                        {/* MY PROBLEMS */}

                                        <Link
                                            to="/my-problems"
                                            onClick={closeSidebar}

                                            className="
                                                group

                                                flex
                                                items-center
                                                gap-3

                                                rounded-2xl
                                                border
                                                border-transparent

                                                px-3
                                                py-3

                                                text-slate-600

                                                transition-colors
                                                duration-150

                                                hover:border-cyan-400/20
                                                hover:bg-cyan-500/[0.06]
                                                hover:text-cyan-700

                                                focus-visible:outline-none
                                                focus-visible:ring-2
                                                focus-visible:ring-cyan-500

                                                dark:text-gray-500

                                                dark:hover:border-cyan-400/10
                                                dark:hover:bg-cyan-500/[0.05]
                                                dark:hover:text-cyan-300
                                            "
                                        >
                                            <span
                                                className="
                                                    grid
                                                    h-10
                                                    w-10

                                                    shrink-0
                                                    place-items-center

                                                    rounded-xl

                                                    bg-cyan-500/[0.08]

                                                    text-cyan-700

                                                    dark:text-cyan-400
                                                "
                                            >
                                                <Bug
                                                    size={18}
                                                    aria-hidden="true"
                                                />
                                            </span>

                                            <span
                                                className="
                                                    flex-1

                                                    text-[13px]
                                                    font-semibold
                                                "
                                            >
                                                Muammolarim
                                            </span>

                                            <ChevronRight
                                                size={15}
                                                aria-hidden="true"

                                                className="
                                                    ml-auto

                                                    text-slate-400

                                                    dark:text-gray-700
                                                "
                                            />
                                        </Link>

                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ==============================
                            BOTTOM ACTION
                        ============================== */}

                        <div
                            className="
                                shrink-0

                                border-t
                                border-[#e0e7f1]

                                bg-white/50

                                p-4

                                dark:border-white/[0.06]
                                dark:bg-black/10
                            "
                        >

                            {isLoggedIn ? (

                                /* LOGOUT */

                                <button
                                    type="button"
                                    onClick={onLogout}

                                    className="
                                        flex
                                        w-full

                                        items-center
                                        justify-center
                                        gap-2.5

                                        rounded-xl
                                        border

                                        border-red-400/25

                                        bg-red-500/[0.07]

                                        px-4
                                        py-3.5

                                        text-[12px]
                                        font-bold

                                        uppercase
                                        tracking-[0.1em]

                                        text-red-700

                                        transition-colors
                                        duration-150

                                        hover:border-red-400/40
                                        hover:bg-red-500/[0.12]

                                        focus-visible:outline-none
                                        focus-visible:ring-2
                                        focus-visible:ring-red-500

                                        dark:border-red-400/15
                                        dark:text-red-300

                                        dark:hover:border-red-400/25
                                    "
                                >
                                    <LogOut
                                        size={17}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />

                                    Chiqish
                                </button>

                            ) : (

                                /* LOGIN */

                                <Link
                                    to="/login"
                                    onClick={closeSidebar}

                                    className="
                                        flex
                                        w-full

                                        items-center
                                        justify-center
                                        gap-2.5

                                        rounded-xl

                                        bg-gradient-to-r
                                        from-indigo-600
                                        to-violet-600

                                        px-4
                                        py-3.5

                                        text-[12px]
                                        font-bold

                                        uppercase
                                        tracking-[0.1em]

                                        text-white

                                        transition-colors
                                        duration-150

                                        hover:from-indigo-500
                                        hover:to-violet-500

                                        focus-visible:outline-none
                                        focus-visible:ring-2
                                        focus-visible:ring-indigo-500
                                    "
                                >
                                    <LogIn
                                        size={17}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />

                                    Kirish
                                </Link>

                            )}
                        </div>

                    </motion.aside>
                </React.Fragment>
            )}
        </AnimatePresence>
    );
};

export default React.memo(MobileNavbarSidebar);
