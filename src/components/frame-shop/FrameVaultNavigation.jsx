
// src/components/frame-shop/FrameVaultNavigation.jsx

import React, {
  memo,
} from "react";

import {
  NavLink,
} from "react-router-dom";

import {
  useSelector,
} from "react-redux";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  ArrowUpRight,
  Gem,
  LockKeyhole,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

// =========================================================
// FSOCIETY — FRAME VAULT NAVIGATION
// =========================================================
//
// Location:
// src/components/frame-shop/FrameVaultNavigation.jsx
//
// Features:
//
// - Shared navigation for Frame Shop and My Frames
// - Active route highlighting
// - Cyberpunk neon design
// - Dark / Light mode
// - Mobile responsive layout
// - Authentication-aware inventory link
// - Owned frames counter
// - Reduced motion support
// - Accessible navigation
//
// Routes:
//
// /frames/shop
// /frames/my
//
// Security:
//
// This component is navigation only.
//
// Access to /frames/my is protected by PrivateRoute.
// Backend permissions protect the inventory API.
//
// =========================================================

// =========================================================
// NAVIGATION ITEMS
// =========================================================

const NAVIGATION_ITEMS = [
  {
    id: "shop",
    to: "/frames/shop",
    label: "Frame Shop",
    mobileLabel: "Shop",
    description: "Yangi ramkalar",
    Icon: ShoppingBag,
    private: false,
  },
  {
    id: "inventory",
    to: "/frames/my",
    label: "My Frames",
    mobileLabel: "My Frames",
    description: "Mening kolleksiyam",
    Icon: Gem,
    private: true,
  },
];

// =========================================================
// FRAME VAULT NAVIGATION
// =========================================================

function FrameVaultNavigation() {
  const reducedMotion = useReducedMotion();

  // =====================================================
  // AUTH STATE
  // =====================================================

  const isAuthenticated = useSelector(
    (state) => Boolean(
      state.auth?.isLoggedIn
    )
  );

  // =====================================================
  // INVENTORY STATE
  // =====================================================

  const inventory = useSelector(
    (state) => state.profileFrames?.inventory
  );

  const inventoryLoaded = Boolean(
    inventory?.loaded
  );

  const inventoryCount = Number(
    inventory?.count
  );

  const hasValidCount =
    inventoryLoaded &&
    Number.isFinite(inventoryCount) &&
    inventoryCount >= 0;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      className="
        relative z-20
        w-full min-w-0
        px-3 pt-4
        sm:px-5 sm:pt-5
        lg:px-8
      "
    >
      <div
        className="
          relative mx-auto
          w-full max-w-7xl
          overflow-hidden
          rounded-[20px]
          border border-slate-200/80
          bg-white/85
          shadow-[0_12px_40px_rgba(15,23,42,0.06)]
          backdrop-blur-2xl

          dark:border-cyan-400/10
          dark:bg-[#0b1222]/85
          dark:shadow-[0_18px_50px_rgba(0,0,0,0.2)]

          sm:rounded-[24px]
        "
      >
        {/* =================================================
            AMBIENT LIGHT
        ================================================= */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute inset-0
            overflow-hidden
          "
        >
          <div
            className="
              absolute -left-12 -top-20
              h-48 w-48
              rounded-full
              bg-cyan-400/10
              blur-[65px]
            "
          />

          <div
            className="
              absolute -right-12 -bottom-20
              h-48 w-48
              rounded-full
              bg-violet-500/10
              blur-[65px]
            "
          />

          <div
            className="
              absolute inset-0
              opacity-[0.035]
              dark:opacity-[0.07]
            "
            style={{
              backgroundImage:
                "linear-gradient(90deg, currentColor 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        {/* =================================================
            TOP ACCENT
        ================================================= */}

        <div
          aria-hidden="true"
          className="
            relative h-[2px] w-full
            bg-gradient-to-r
            from-cyan-400
            via-violet-500
            to-fuchsia-500
          "
        />

        {/* =================================================
            CONTENT
        ================================================= */}

        <div
          className="
            relative flex min-w-0
            flex-col gap-3
            p-3
            sm:p-4
            lg:flex-row
            lg:items-center
            lg:justify-between
            lg:gap-5
          "
        >
          {/* ===============================================
              BRAND
          =============================================== */}

          <div
            className="
              flex min-w-0
              items-center gap-3
              px-1
              lg:px-2
            "
          >
            <div
              className="
                relative flex h-11 w-11
                shrink-0
                items-center justify-center
                rounded-2xl
                border border-cyan-400/30
                bg-gradient-to-br
                from-cyan-500/15
                via-blue-500/10
                to-violet-500/15
                text-cyan-700
                dark:text-cyan-300
              "
            >
              <Gem
                size={22}
                strokeWidth={1.8}
                aria-hidden="true"
              />

              <span
                aria-hidden="true"
                className="
                  absolute -right-1 -top-1
                  flex h-4 w-4
                  items-center justify-center
                  rounded-md
                  border border-violet-400/30
                  bg-violet-500
                  text-white
                "
              >
                <Sparkles size={10} />
              </span>
            </div>

            <div className="min-w-0">
              <p
                className="
                  font-['Space_Grotesk']
                  text-sm font-black
                  tracking-[0.035em]
                  text-slate-900
                  dark:text-white
                  sm:text-base
                "
              >
                FRAME{" "}
                <span
                  className="
                    bg-gradient-to-r
                    from-cyan-600
                    to-violet-600
                    bg-clip-text
                    text-transparent
                    dark:from-cyan-300
                    dark:to-violet-400
                  "
                >
                  VAULT
                </span>
              </p>

              <p
                className="
                  mt-0.5
                  font-mono text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.17em]
                  text-slate-500
                  dark:text-slate-400
                "
              >
                FSOCIETY / COLLECTIBLES
              </p>
            </div>
          </div>

          {/* ===============================================
              NAVIGATION
          =============================================== */}

          <nav
            aria-label="Frame Vault sahifalari"
            className="
              grid min-w-0
              grid-cols-2 gap-2
              lg:w-auto
              lg:min-w-[370px]
            "
          >
            {NAVIGATION_ITEMS.map(
              ({
                id,
                to,
                label,
                mobileLabel,
                description,
                Icon,
                private: isPrivate,
              }) => (
                <NavLink
                  key={id}
                  to={to}
                  end
                  className={({ isActive }) => `
                    group relative
                    flex min-w-0
                    items-center
                    justify-center gap-2.5
                    overflow-hidden
                    rounded-xl border
                    px-3 py-3
                    text-left
                    transition-all duration-200

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-cyan-500
                    focus-visible:ring-offset-2
                    dark:focus-visible:ring-offset-[#0b1222]

                    ${
                      isActive
                        ? `
                          border-cyan-400/50
                          bg-gradient-to-r
                          from-cyan-500/15
                          via-blue-500/10
                          to-violet-500/15
                          text-cyan-800
                          shadow-[0_0_22px_rgba(34,211,238,0.09)]

                          dark:border-cyan-400/35
                          dark:text-cyan-200
                        `
                        : `
                          border-slate-200/80
                          bg-slate-50/70
                          text-slate-600

                          hover:border-cyan-300/60
                          hover:bg-cyan-50/70

                          dark:border-white/10
                          dark:bg-white/[0.035]
                          dark:text-slate-300

                          dark:hover:border-cyan-400/25
                          dark:hover:bg-cyan-400/[0.07]
                        `
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {/* ACTIVE INDICATOR */}

                      {isActive && (
                        <motion.span
                          layoutId="fs-frame-vault-active"
                          transition={
                            reducedMotion
                              ? { duration: 0 }
                              : {
                                  type: "spring",
                                  stiffness: 360,
                                  damping: 32,
                                }
                          }
                          aria-hidden="true"
                          className="
                            absolute inset-x-4
                            bottom-0 h-[2px]
                            rounded-full
                            bg-gradient-to-r
                            from-cyan-400
                            via-blue-400
                            to-violet-400
                          "
                        />
                      )}

                      {/* ICON */}

                      <span
                        className={`
                          relative flex h-8 w-8
                          shrink-0
                          items-center justify-center
                          rounded-lg

                          ${
                            isActive
                              ? `
                                bg-cyan-400/15
                                text-cyan-700
                                dark:text-cyan-300
                              `
                              : `
                                bg-slate-200/70
                                text-slate-500

                                dark:bg-white/[0.07]
                                dark:text-slate-400
                              `
                          }
                        `}
                      >
                        <Icon
                          size={17}
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                      </span>

                      {/* LABEL */}

                      <span className="min-w-0">
                        <span
                          className="
                            block truncate
                            text-xs font-extrabold
                            sm:text-sm
                          "
                        >
                          <span className="sm:hidden">
                            {mobileLabel}
                          </span>

                          <span className="hidden sm:inline">
                            {label}
                          </span>
                        </span>

                        <span
                          className="
                            mt-0.5 hidden
                            truncate
                            font-mono
                            text-[10px]
                            text-slate-500
                            dark:text-slate-400
                            sm:block
                          "
                        >
                          {description}
                        </span>
                      </span>

                      {/* STATUS */}

                      {isPrivate &&
                        !isAuthenticated && (
                          <LockKeyhole
                            size={13}
                            aria-label="Login talab qilinadi"
                            className="
                              shrink-0
                              text-slate-400
                            "
                          />
                        )}

                      {isPrivate &&
                        isAuthenticated &&
                        hasValidCount && (
                          <span
                            className="
                              inline-flex min-w-6
                              shrink-0
                              items-center justify-center
                              rounded-md
                              bg-violet-500/15
                              px-1.5 py-0.5
                              font-mono
                              text-[10px]
                              font-bold
                              tabular-nums
                              text-violet-700
                              dark:text-violet-300
                            "
                          >
                            {inventoryCount}
                          </span>
                        )}

                      {!isPrivate && (
                        <ArrowUpRight
                          size={13}
                          aria-hidden="true"
                          className={`
                            hidden shrink-0
                            transition-transform
                            group-hover:-translate-y-0.5
                            group-hover:translate-x-0.5
                            sm:block
                            ${
                              isActive
                                ? "text-cyan-500"
                                : "text-slate-400"
                            }
                          `}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              )
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}

export default memo(FrameVaultNavigation);
