
import React, {
  memo,
  useCallback,
  useEffect,
  useRef,
} from "react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  Bug,
  ChevronRight,
  Coins,
  LogIn,
  LogOut,
  ShieldCheck,
  UserCircle,
  X,
} from "lucide-react";

import FSocietyLogo from "../assests/logo/f_society.png";
import UserImage from "../assests/userImage.jpeg";

import {
  formatCompactNumber,
  formatFullNumber,
} from "../utils/formatCompactNumber";

// =========================================================
// FSOCIETY — MOBILE NAVBAR SIDEBAR
// =========================================================
//
// Location:
// src/components/MobileNavbarSidebar.jsx
//
// Features:
// - Responsive mobile navigation
// - Light / Dark mode
// - Backdrop click to close
// - Escape to close
// - Keyboard focus trapping
// - Focus restoration
// - Body scroll lock
// - Automatic desktop resize close
// - Reduced motion support
// - User profile
// - My Problems
// - Compact FCoin balance
// - Login / Logout
// - Active route indicator
//
// Existing parent props preserved.
// =========================================================

// =========================================================
// ANIMATION VARIANTS
// =========================================================

const sidebarVariants = {
  hidden: {
    x: "-100%",
  },

  visible: {
    x: 0,
    transition: {
      duration: 0.24,
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

const backdropVariants = {
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

const reducedSidebarVariants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,
    transition: { duration: 0 },
  },

  exit: {
    opacity: 0,
    transition: { duration: 0 },
  },
};

// =========================================================
// SHARED STYLES
// =========================================================

const NAV_ITEM_CLASS = `
  group
  flex min-h-12 w-full min-w-0
  items-center gap-3

  rounded-xl
  border

  px-3 py-2

  text-left
  text-[12px]
  font-bold

  transition-[background-color,border-color,color]
  duration-200

  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-indigo-500

  motion-reduce:transition-none
`;

const INACTIVE_ITEM_CLASS = `
  border-transparent
  text-slate-600

  hover:border-slate-200
  hover:bg-white/80
  hover:text-indigo-700

  dark:text-slate-300
  dark:hover:border-white/[0.09]
  dark:hover:bg-white/[0.055]
  dark:hover:text-indigo-300
`;

const ACTIVE_ITEM_CLASS = `
  border-indigo-400/30
  bg-indigo-500/[0.10]
  text-indigo-700

  dark:border-indigo-400/25
  dark:bg-indigo-500/[0.14]
  dark:text-indigo-300
`;

const SECTION_LABEL_CLASS = `
  mb-2 px-2

  font-mono
  text-[10px]
  font-bold uppercase
  tracking-[0.18em]

  text-slate-500
  dark:text-slate-400
`;

// =========================================================
// AVATAR FALLBACK
// =========================================================

const handleAvatarError = (event) => {
  const image = event.currentTarget;

  image.onerror = null;
  image.src = UserImage;
};

// =========================================================
// MAIN COMPONENT
// =========================================================

function MobileNavbarSidebar({
  isOpen = false,
  setIsOpen,

  navLinks = [],
  isActive,

  isLoggedIn = false,
  user = null,
  avatarUrl = "",

  handleLogout,
}) {
  const location = useLocation();

  const reduceMotion = useReducedMotion();

  // =====================================================
  // REFS
  // =====================================================

  const sidebarRef = useRef(null);
  const closeButtonRef = useRef(null);

  // =====================================================
  // USER DATA
  // =====================================================

  const username =
    user?.username || "user";

  const userLevel =
    user?.skill_level ||
    user?.level ||
    "developer";

  const coins =
    user?.coins ?? 0;

  const compactCoins =
    formatCompactNumber(coins);

  const fullCoins =
    formatFullNumber(coins);

  const profilePath =
    `/${encodeURIComponent(username)}/profile`;

  const isProfileActive =
    location.pathname === profilePath;

  // =====================================================
  // CLOSE
  // =====================================================

  const closeSidebar = useCallback(() => {
    if (typeof setIsOpen === "function") {
      setIsOpen(false);
    }
  }, [setIsOpen]);

  // =====================================================
  // LOGOUT
  // =====================================================

  const onLogout = useCallback(() => {
    closeSidebar();

    if (typeof handleLogout === "function") {
      handleLogout();
    }
  }, [closeSidebar, handleLogout]);

  // =====================================================
  // BODY SCROLL LOCK + ACCESSIBILITY
  // =====================================================

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const sidebar = sidebarRef.current;

    const previousOverflow =
      document.body.style.overflow;

    const previousFocus =
      document.activeElement;

    document.body.style.overflow = "hidden";

    // Focus close button when opening.
    const frame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus({
        preventScroll: true,
      });
    });

    // ===================================================
    // KEYBOARD
    // ===================================================

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeSidebar();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const panel = sidebarRef.current;

      if (!panel) {
        return;
      }

      const focusable = Array.from(
        panel.querySelectorAll(
          'a[href], button:not([disabled]), ' +
          'input:not([disabled]), ' +
          'select:not([disabled]), ' +
          'textarea:not([disabled]), ' +
          '[tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => {
        return (
          element.getClientRects().length > 0 &&
          element.getAttribute("aria-hidden") !== "true"
        );
      });

      if (!focusable.length) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (
          active === first ||
          !panel.contains(active)
        ) {
          event.preventDefault();
          last.focus();
        }
      } else if (
        active === last ||
        !panel.contains(active)
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    // ===================================================
    // CLOSE WHEN ENTERING DESKTOP MODE
    // ===================================================

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        closeSidebar();
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

    handleResize();

    // ===================================================
    // CLEANUP
    // ===================================================

    return () => {
      window.cancelAnimationFrame(frame);

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

      // Return focus to the hamburger button
      // or whichever control opened the panel.
      if (
        previousFocus &&
        previousFocus.isConnected &&
        typeof previousFocus.focus === "function"
      ) {
        previousFocus.focus({
          preventScroll: true,
        });
      }
    };
  }, [isOpen, closeSidebar]);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ======================================
              BACKDROP
             ====================================== */}

          <motion.button
            type="button"

            aria-label="Mobil menyuni yopish"
            tabIndex={-1}

            onClick={closeSidebar}

            initial="hidden"
            animate="visible"
            exit="exit"

            variants={
              reduceMotion
                ? reducedSidebarVariants
                : backdropVariants
            }

            className="
              fixed inset-0 z-[80]

              cursor-default

              bg-slate-950/55

              dark:bg-black/75

              lg:hidden
            "
          />

          {/* ======================================
              SIDEBAR PANEL
             ====================================== */}

          <motion.aside
            ref={sidebarRef}

            id="fsociety-mobile-navigation"

            role="dialog"
            aria-modal="true"
            aria-labelledby="fsociety-mobile-menu-title"

            tabIndex={-1}

            initial="hidden"
            animate="visible"
            exit="exit"

            variants={
              reduceMotion
                ? reducedSidebarVariants
                : sidebarVariants
            }

            className="
              fixed left-0 top-0 z-[90]

              flex h-screen
              h-[100dvh]

              w-[88vw]
              max-w-[360px]

              flex-col
              overflow-hidden

              border-r
              border-[#d5deeb]

              bg-[#f5f8ff]

              shadow-[20px_0_65px_rgba(30,41,59,0.15)]

              outline-none

              dark:border-cyan-400/10
              dark:bg-[#080d18]

              dark:shadow-[25px_0_80px_rgba(0,0,0,0.65)]

              lg:hidden
            "
          >
            {/* ====================================
                HEADER
               ==================================== */}

            <div
              className="
                relative shrink-0

                overflow-hidden

                border-b
                border-slate-200/80

                bg-white/65

                px-4 pb-4 pt-5

                dark:border-white/[0.07]
                dark:bg-white/[0.025]
              "
            >
              {/* BACKGROUND GLOW */}

              <span
                aria-hidden="true"
                className="
                  pointer-events-none

                  absolute -right-12 -top-12

                  h-36 w-36 rounded-full

                  bg-cyan-400/[0.10]
                  blur-2xl

                  dark:bg-cyan-400/[0.12]
                "
              />

              {/* BRAND ROW */}

              <div
                className="
                  relative z-10

                  flex min-w-0
                  items-center justify-between

                  gap-2
                "
              >
                <Link
                  to="/"
                  onClick={closeSidebar}
                  aria-label="FSociety bosh sahifasi"

                  className="
                    group/brand

                    flex min-w-0 flex-1
                    items-center gap-2.5

                    rounded-xl

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-indigo-500
                  "
                >
                  {/* LOGO — NO ROTATION */}

                  <span
                    className="
                      grid h-11 w-11
                      shrink-0 place-items-center

                      rounded-xl

                      border
                      border-indigo-200/80

                      bg-white/90

                      dark:border-indigo-400/20
                      dark:bg-[#111b2c]
                    "
                  >
                    <img
                      src={FSocietyLogo}
                      alt=""
                      width={38}
                      height={38}
                      draggable={false}

                      className="
                        h-9 w-9
                        object-contain
                      "
                    />
                  </span>

                  {/* BRAND TEXT */}

                  <span
                    className="
                      flex min-w-0
                      flex-col
                    "
                  >
                    <span
                      id="fsociety-mobile-menu-title"
                      className="
                        truncate
                        text-[21px]
                        font-black
                        tracking-[-0.055em]

                        text-slate-950
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
                    </span>

                    <span
                      className="
                        font-mono
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.14em]

                        text-cyan-700
                        dark:text-cyan-400
                      "
                    >
                      Fix Society
                    </span>
                  </span>
                </Link>

                {/* CLOSE BUTTON */}

                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeSidebar}
                  aria-label="Menyuni yopish"

                  className="
                    grid h-10 w-10
                    shrink-0 place-items-center

                    rounded-xl

                    border border-slate-200
                    bg-white/80

                    text-slate-600

                    transition-colors

                    hover:bg-slate-100

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-indigo-500

                    dark:border-white/[0.09]
                    dark:bg-white/[0.05]
                    dark:text-slate-300
                    dark:hover:bg-white/[0.09]
                  "
                >
                  <X
                    size={19}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </button>
              </div>

              {/* USER CARD */}

              {isLoggedIn && (
                <div
                  className="
                    relative z-10

                    mt-4 flex min-w-0
                    items-center gap-3

                    rounded-xl

                    border border-slate-200/80
                    bg-white/80

                    p-3

                    dark:border-white/[0.08]
                    dark:bg-white/[0.035]
                  "
                >
                  {/* AVATAR */}

                  <div
                    className="
                      h-11 w-11 shrink-0

                      overflow-hidden
                      rounded-xl

                      border border-slate-200

                      bg-slate-100

                      dark:border-white/10
                      dark:bg-[#11161e]
                    "
                  >
                    <img
                      src={avatarUrl || UserImage}
                      alt={`${username} avatar`}
                      onError={handleAvatarError}

                      className="
                        h-full w-full
                        object-cover
                      "
                    />
                  </div>

                  {/* USER DATA */}

                  <div className="min-w-0 flex-1">
                    <p
                      className="
                        truncate
                        text-[14px]
                        font-bold

                        text-slate-900
                        dark:text-white
                      "
                    >
                      @{username}
                    </p>

                    <div
                      className="
                        mt-1 flex min-w-0
                        items-center gap-2

                        text-[10px]
                        font-semibold
                      "
                    >
                      <span
                        className="
                          truncate
                          uppercase

                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        {userLevel}
                      </span>

                      <span
                        className="
                          shrink-0
                          text-slate-300
                          dark:text-slate-600
                        "
                        aria-hidden="true"
                      >
                        /
                      </span>

                      <span
                        title={`${fullCoins} FCoin`}
                        aria-label={`${fullCoins} FCoin`}
                        className="
                          inline-flex shrink-0
                          items-center gap-1

                          text-amber-700
                          dark:text-amber-300
                        "
                      >
                        <Coins
                          size={13}
                          aria-hidden="true"
                        />

                        {compactCoins}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ====================================
                SCROLLABLE CONTENT
               ==================================== */}

            <div
              className="
                min-h-0 flex-1

                overflow-x-hidden
                overflow-y-auto

                overscroll-contain

                px-3 py-4
              "
            >
              {/* NAVIGATION */}

              <nav aria-label="Mobil navigatsiya">
                <p className={SECTION_LABEL_CLASS}>
                  Navigation
                </p>

                <div className="space-y-1">
                  {navLinks.map((link) => {
                    const {
                      path,
                      text,
                      Icon,
                    } = link;

                    const active =
                      typeof isActive === "function"
                        ? isActive(path)
                        : false;

                    return (
                      <Link
                        key={path}
                        to={path}
                        onClick={closeSidebar}

                        aria-current={
                          active ? "page" : undefined
                        }

                        className={`
                          ${NAV_ITEM_CLASS}

                          ${
                            active
                              ? ACTIVE_ITEM_CLASS
                              : INACTIVE_ITEM_CLASS
                          }
                        `}
                      >
                        <span
                          className={`
                            grid h-9 w-9
                            shrink-0 place-items-center

                            rounded-lg

                            border

                            ${
                              active
                                ? `
                                  border-indigo-400/20
                                  bg-indigo-500/10
                                `
                                : `
                                  border-slate-200
                                  bg-white/80

                                  dark:border-white/[0.08]
                                  dark:bg-white/[0.035]
                                `
                            }
                          `}
                        >
                          {Icon && (
                            <Icon
                              size={17}
                              aria-hidden="true"
                            />
                          )}
                        </span>

                        <span
                          className="
                            min-w-0 flex-1
                            truncate uppercase
                            tracking-[0.05em]
                          "
                        >
                          {text}
                        </span>

                        <ChevronRight
                          size={15}
                          aria-hidden="true"
                          className="
                            shrink-0
                            text-slate-400
                            dark:text-slate-500
                          "
                        />
                      </Link>
                    );
                  })}
                </div>
              </nav>

              {/* ==================================
                  ACCOUNT LINKS
                 ================================== */}

              {isLoggedIn && (
                <section
                  aria-label="Hisob menyusi"
                  className="mt-6"
                >
                  <p className={SECTION_LABEL_CLASS}>
                    Account
                  </p>

                  <div className="space-y-1">
                    {/* PROFILE */}

                    <Link
                      to={profilePath}
                      onClick={closeSidebar}

                      aria-current={
                        isProfileActive
                          ? "page"
                          : undefined
                      }

                      className={`
                        ${NAV_ITEM_CLASS}

                        ${
                          isProfileActive
                            ? ACTIVE_ITEM_CLASS
                            : INACTIVE_ITEM_CLASS
                        }
                      `}
                    >
                      <span
                        className="
                          grid h-9 w-9
                          shrink-0 place-items-center

                          rounded-lg

                          border border-slate-200
                          bg-white/80

                          dark:border-white/[0.08]
                          dark:bg-white/[0.035]
                        "
                      >
                        <UserCircle
                          size={18}
                          aria-hidden="true"
                        />
                      </span>

                      <span className="min-w-0 flex-1">
                        Profilim
                      </span>

                      <ChevronRight
                        size={15}
                        aria-hidden="true"
                        className="shrink-0"
                      />
                    </Link>

                    {/* MY PROBLEMS */}

                    <Link
                      to="/my-problems"
                      onClick={closeSidebar}

                      aria-current={
                        location.pathname ===
                        "/my-problems"
                          ? "page"
                          : undefined
                      }

                      className={`
                        ${NAV_ITEM_CLASS}

                        ${
                          location.pathname ===
                          "/my-problems"
                            ? ACTIVE_ITEM_CLASS
                            : INACTIVE_ITEM_CLASS
                        }
                      `}
                    >
                      <span
                        className="
                          grid h-9 w-9
                          shrink-0 place-items-center

                          rounded-lg

                          border border-slate-200
                          bg-white/80

                          dark:border-white/[0.08]
                          dark:bg-white/[0.035]
                        "
                      >
                        <Bug
                          size={18}
                          aria-hidden="true"
                        />
                      </span>

                      <span className="min-w-0 flex-1">
                        Mening muammolarim
                      </span>

                      <ChevronRight
                        size={15}
                        aria-hidden="true"
                        className="shrink-0"
                      />
                    </Link>

                    {/* FCOIN HISTORY */}

                    <Link
                      to="/fcoin-history"
                      onClick={closeSidebar}

                      aria-current={
                        location.pathname ===
                        "/fcoin-history"
                          ? "page"
                          : undefined
                      }

                      className={`
                        ${NAV_ITEM_CLASS}

                        ${
                          location.pathname ===
                          "/fcoin-history"
                            ? ACTIVE_ITEM_CLASS
                            : INACTIVE_ITEM_CLASS
                        }
                      `}
                    >
                      <span
                        className="
                          grid h-9 w-9
                          shrink-0 place-items-center

                          rounded-lg

                          border border-amber-300/40
                          bg-amber-50

                          text-amber-700

                          dark:border-amber-400/15
                          dark:bg-amber-400/[0.06]
                          dark:text-amber-300
                        "
                      >
                        <Coins
                          size={18}
                          aria-hidden="true"
                        />
                      </span>

                      <span className="min-w-0 flex-1">
                        FCoin tarixi
                      </span>

                      <ChevronRight
                        size={15}
                        aria-hidden="true"
                        className="shrink-0"
                      />
                    </Link>
                  </div>
                </section>
              )}

              {/* STATUS */}

              <div
                className="
                  mt-6 flex items-center
                  gap-2

                  rounded-xl

                  border border-slate-200/80
                  bg-white/55

                  px-3 py-2.5

                  dark:border-white/[0.07]
                  dark:bg-white/[0.025]
                "
              >
                <ShieldCheck
                  size={14}
                  aria-hidden="true"
                  className="
                    shrink-0
                    text-emerald-600
                    dark:text-emerald-400
                  "
                />

                <span
                  className="
                    font-mono
                    text-[10px]
                    font-semibold

                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  FSOCIETY://COMMUNITY
                </span>
              </div>
            </div>

            {/* ====================================
                FOOTER ACTION
               ==================================== */}

            <div
              className="
                shrink-0

                border-t
                border-slate-200/80

                bg-white/60

                px-4 py-3

                dark:border-white/[0.07]
                dark:bg-black/[0.12]
              "
            >
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={onLogout}

                  className="
                    flex min-h-11 w-full
                    items-center justify-center
                    gap-2

                    rounded-xl

                    border border-red-400/25
                    bg-red-500/[0.07]

                    px-4 py-3

                    text-[12px]
                    font-bold

                    text-red-700

                    transition-colors

                    hover:border-red-400/40
                    hover:bg-red-500/[0.12]

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-red-500

                    dark:border-red-400/15
                    dark:text-red-300
                    dark:hover:bg-red-400/[0.10]
                  "
                >
                  <LogOut
                    size={17}
                    aria-hidden="true"
                  />

                  Tizimdan chiqish
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={closeSidebar}

                  className="
                    flex min-h-11 w-full

                    items-center justify-center
                    gap-2

                    rounded-xl

                    bg-gradient-to-r
                    from-indigo-600
                    to-violet-600

                    px-4 py-3

                    text-[12px]
                    font-bold
                    text-white

                    transition-colors

                    hover:from-indigo-500
                    hover:to-violet-500

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-indigo-500
                  "
                >
                  <LogIn
                    size={17}
                    aria-hidden="true"
                  />

                  Tizimga kirish
                </Link>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default memo(MobileNavbarSidebar);
