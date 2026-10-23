
import React, { memo } from "react";

import {
  LockKeyhole,
  ShieldCheck,
  Terminal,
} from "lucide-react";

// =========================================================
// FSOCIETY — SHARED PAGE BACKGROUND
// =========================================================

import PageGridBackground from "../../ui/PageGridBackground";

// =========================================================
// FSOCIETY — AUTH PAGE LAYOUT
// =========================================================
//
// Location:
// src/components/auth/shared/AuthPageLayout.jsx
//
// Used by:
// - Register
// - Login
// - Future password reset pages
//
// Features:
// - Shared PageGridBackground
// - Light / Dark mode
// - Responsive 320px+
// - Tailwind CSS only
// - Separate Register / Login widths
// - Mobile safe spacing
// - Long-form scrolling
// - No horizontal overflow
// - Accessible page structure
// - No Redux dependency
// - No extra theme state
//
// =========================================================

// =========================================================
// CONFIGURATION
// =========================================================

const MODE_CONFIG = {
  register: {
    label: "REGISTER",
    width: "max-w-[560px]",
    title: "Ro‘yxatdan o‘tish",
  },

  login: {
    label: "LOGIN",
    width: "max-w-[460px]",
    title: "Tizimga kirish",
  },
};

// =========================================================
// MAIN COMPONENT
// =========================================================

function AuthPageLayout({
  children,

  // "register" or "login"
  mode = "register",

  // Optional accessibility label
  ariaLabel,

  // Background settings
  showMonogram = true,
  showCubes = true,

  // Footer
  showFooter = true,
  footer = null,

  // Custom Tailwind classes
  className = "",
  cardClassName = "",
  contentClassName = "",
}) {
  // =====================================================
  // MODE
  // =====================================================

  const config =
    MODE_CONFIG[mode] ||
    MODE_CONFIG.register;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main
      aria-label={
        ariaLabel || config.title
      }
      className={`
        relative isolate

        flex min-h-screen
        min-h-[100dvh]

        w-full min-w-0
        max-w-full

        flex-col

        bg-[#f7faff]
        font-sans
        text-slate-900

        dark:bg-[#050a14]
        dark:text-slate-100

        ${className}
      `}
    >
      {/* ==========================================
          FSOCIETY BACKGROUND
         ========================================== */}

      <PageGridBackground
        showMonogram={showMonogram}
        showCubes={showCubes}
      />

      {/* ==========================================
          DECORATIVE LIGHTING
         ========================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none

          absolute inset-0
          z-[1]

          overflow-hidden
        "
      >
        {/* LEFT GLOW */}
        <div
          className="
            absolute
            -left-32 top-[12%]

            h-72 w-72
            rounded-full

            bg-indigo-400/[0.07]
            blur-[90px]

            dark:bg-indigo-500/[0.09]
          "
        />

        {/* RIGHT GLOW */}
        <div
          className="
            absolute
            -right-36 bottom-[12%]

            h-80 w-80
            rounded-full

            bg-cyan-400/[0.06]
            blur-[95px]

            dark:bg-cyan-500/[0.08]
          "
        />

        {/* CENTER ACCENT */}
        <div
          className="
            absolute
            left-1/2 top-1/2

            h-[400px] w-[400px]
            max-w-full

            -translate-x-1/2
            -translate-y-1/2

            rounded-full

            bg-violet-400/[0.035]
            blur-[100px]

            dark:bg-violet-500/[0.045]

            sm:h-[550px]
            sm:w-[550px]
          "
        />
      </div>

      {/* ==========================================
          PAGE CONTENT
         ========================================== */}

      <div
        className="
          relative z-10

          flex w-full min-w-0
          flex-1 flex-col

          items-center
          justify-center

          px-3
          py-6

          sm:px-5
          sm:py-10

          lg:px-8
          lg:py-12
        "
      >
        {/* ======================================
            AUTH CARD CONTAINER
           ====================================== */}

        <div
          className={`
            relative isolate

            w-full min-w-0

            ${config.width}
          `}
        >
          {/* ====================================
              CARD OUTER GLOW
             ==================================== */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none

              absolute -inset-1

              rounded-[28px]

              bg-gradient-to-br
              from-indigo-500/[0.09]
              via-transparent
              to-cyan-400/[0.08]

              blur-xl

              dark:from-indigo-500/[0.12]
              dark:to-cyan-400/[0.10]
            "
          />

          {/* ====================================
              MAIN CARD
             ==================================== */}

          <div
            className={`
              relative

              w-full min-w-0
              max-w-full

              overflow-hidden

              rounded-[22px]

              border
              border-slate-200/90

              bg-white/95

              shadow-[0_16px_55px_rgba(15,23,42,0.09)]

              backdrop-blur-xl

              dark:border-white/[0.10]
              dark:bg-[#0b1220]/95

              dark:shadow-[0_20px_65px_rgba(0,0,0,0.30)]

              sm:rounded-[26px]

              ${cardClassName}
            `}
          >
            {/* ================================
                TOP ACCENT
               ================================ */}

            <div
              aria-hidden="true"
              className="
                absolute inset-x-0 top-0

                h-[2px]

                bg-gradient-to-r
                from-indigo-500
                via-cyan-400
                to-violet-500
              "
            />

            {/* ================================
                CARD TOP DECORATION
               ================================ */}

            <div
              aria-hidden="true"
              className="
                pointer-events-none

                absolute -right-20 -top-24

                h-56 w-56
                rounded-full

                bg-indigo-500/[0.04]

                blur-[65px]

                dark:bg-indigo-400/[0.06]
              "
            />

            {/* ================================
                CARD BODY
               ================================ */}

            <div
              className={`
                relative z-10

                w-full min-w-0

                px-4 pb-5 pt-5

                sm:px-7
                sm:pb-7
                sm:pt-7

                ${contentClassName}
              `}
            >
              {children}
            </div>

            {/* ================================
                CARD BOTTOM STRIP
               ================================ */}

            <div
              aria-hidden="true"
              className="
                flex min-w-0
                items-center
                justify-between

                border-t
                border-slate-100

                bg-slate-50/70

                px-4 py-2.5

                dark:border-white/[0.06]
                dark:bg-white/[0.025]

                sm:px-7
              "
            >
              <span
                className="
                  inline-flex
                  items-center gap-1.5

                  font-mono

                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.10em]

                  text-slate-400

                  dark:text-slate-500
                "
              >
                <Terminal
                  size={12}
                  aria-hidden="true"
                />

                FSOCIETY://AUTH
              </span>

              <span
                className="
                  inline-flex items-center
                  gap-1.5

                  font-mono
                  text-[9px]
                  font-semibold

                  text-indigo-600

                  dark:text-indigo-400
                "
              >
                <ShieldCheck
                  size={12}
                  aria-hidden="true"
                />

                {config.label}
              </span>
            </div>
          </div>

          {/* ====================================
              CARD BOTTOM ACCENT
             ==================================== */}

          <div
            aria-hidden="true"
            className="
              mx-auto mt-2

              h-px w-[65%]

              bg-gradient-to-r
              from-transparent
              via-indigo-400/30
              to-transparent

              dark:via-indigo-400/20
            "
          />
        </div>

        {/* ======================================
            PAGE FOOTER
           ====================================== */}

        {showFooter && (
          <footer
            className="
              mt-6

              w-full min-w-0
              max-w-[560px]

              px-2

              text-center
            "
          >
            {footer || (
              <div
                className="
                  flex flex-wrap
                  items-center
                  justify-center

                  gap-x-2 gap-y-1.5

                  font-mono
                  text-[10px]

                  text-slate-500

                  dark:text-slate-400
                "
              >
                <LockKeyhole
                  size={12}
                  className="
                    shrink-0
                    text-indigo-500

                    dark:text-indigo-400
                  "
                  aria-hidden="true"
                />

                <span>
                  FSOCIETY
                </span>

                <span
                  aria-hidden="true"
                  className="
                    text-slate-300
                    dark:text-slate-600
                  "
                >
                  /
                </span>

                <span>
                  Connect. Code. Collaborate.
                </span>
              </div>
            )}
          </footer>
        )}
      </div>
    </main>
  );
}

export default memo(AuthPageLayout);
