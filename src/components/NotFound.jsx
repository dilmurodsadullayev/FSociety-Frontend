
import React, { memo } from "react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  ArrowLeft,
  ArrowUpRight,
  Code2,
  Compass,
  Home,
  SearchX,
  Terminal,
  WifiOff,
} from "lucide-react";

import PageGridBackground from "./ui/PageGridBackground";

// =========================================================
// FSOCIETY — 404 NOT FOUND
// =========================================================
//
// Features:
// - Shared PageGridBackground
// - Light / Dark Mode
// - Space Grotesk typography
// - JetBrains Mono terminal typography
// - Responsive 320px+
// - No direct DOM manipulation
// - No Font Awesome dependency
// - React Router navigation
// - Accessible status information
// - Reduced motion support
//
// This component handles unknown frontend routes.
// API 404 errors are handled separately.
// =========================================================

// =========================================================
// STYLES
// =========================================================

const PAGE_CLASS = `
  relative
  isolate
  flex
  min-h-screen
  min-h-[100dvh]
  w-full
  min-w-0
  flex-col
  overflow-hidden

  bg-[#f7faff]
  text-slate-900

  dark:bg-[#050a14]
  dark:text-white
`;

const MAIN_CARD_CLASS = `
  relative
  isolate
  w-full
  min-w-0
  max-w-full
  overflow-hidden
  rounded-[24px]

  border
  border-white/80
  bg-white/85

  shadow-[0_24px_90px_rgba(51,65,85,0.10)]
  backdrop-blur-xl

  sm:rounded-[32px]

  dark:border-white/[0.10]
  dark:bg-[#0b1018]/90
  dark:shadow-[0_35px_110px_rgba(0,0,0,0.40)]
`;

const PRIMARY_BUTTON_CLASS = `
  inline-flex
  min-h-12
  w-full
  min-w-0
  items-center
  justify-center
  gap-2.5
  rounded-xl

  border
  border-indigo-600
  bg-indigo-600

  px-5
  py-3

  text-center
  text-sm
  font-bold
  text-white

  shadow-lg
  shadow-indigo-500/20

  transition-all
  duration-200

  hover:border-indigo-700
  hover:bg-indigo-700
  hover:shadow-indigo-500/30

  active:scale-[0.98]

  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-indigo-500
  focus-visible:ring-offset-2

  sm:w-auto

  dark:border-indigo-400/25
  dark:bg-indigo-500
  dark:hover:bg-indigo-400
  dark:hover:border-indigo-400

  dark:focus-visible:ring-offset-[#0b1018]

  motion-reduce:transform-none
  motion-reduce:transition-none
`;

const SECONDARY_BUTTON_CLASS = `
  inline-flex
  min-h-12
  w-full
  min-w-0
  items-center
  justify-center
  gap-2.5
  rounded-xl

  border
  border-slate-200
  bg-white/80

  px-5
  py-3

  text-center
  text-sm
  font-bold
  text-slate-700

  transition-all
  duration-200

  hover:border-indigo-200
  hover:bg-indigo-50
  hover:text-indigo-700

  active:scale-[0.98]

  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-indigo-500
  focus-visible:ring-offset-2

  sm:w-auto

  dark:border-white/[0.10]
  dark:bg-white/[0.04]
  dark:text-slate-300

  dark:hover:border-indigo-400/25
  dark:hover:bg-indigo-400/[0.08]
  dark:hover:text-indigo-300

  dark:focus-visible:ring-offset-[#0b1018]

  motion-reduce:transform-none
  motion-reduce:transition-none
`;

// =========================================================
// BRAND
// =========================================================

const NotFoundBrand = memo(
  function NotFoundBrand() {
    return (
      <Link
        to="/"
        aria-label="FSociety bosh sahifasi"
        className="
          group
          inline-flex
          min-w-0
          items-center
          gap-3
          rounded-xl

          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-indigo-500
          focus-visible:ring-offset-4
        "
      >
        {/* LOGOMARK */}

        <span
          aria-hidden="true"
          className="
            grid
            h-11
            w-11
            shrink-0
            place-items-center
            rounded-xl

            border
            border-indigo-200
            bg-white/80

            shadow-sm

            dark:border-indigo-400/20
            dark:bg-[#111a2d]
            dark:shadow-none
          "
        >
          <Code2
            size={22}
            strokeWidth={2.2}
            className="
              text-indigo-600
              transition-transform
              duration-200

              group-hover:scale-110

              dark:text-indigo-300

              motion-reduce:transform-none
            "
          />
        </span>

        {/* BRAND NAME */}

        <span className="min-w-0">
          <span
            className="
              block
              text-lg
              font-black
              leading-tight
              tracking-tight
              text-slate-900

              dark:text-white
            "
          >
            F
            <span className="text-indigo-600 dark:text-indigo-400">
              Society
            </span>
          </span>

          <span
            className="
              block
              font-mono
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.12em]
              text-slate-500

              dark:text-slate-400
            "
          >
            Fix Society
          </span>
        </span>
      </Link>
    );
  }
);

// =========================================================
// STATUS BADGE
// =========================================================

const NotFoundStatus = memo(
  function NotFoundStatus() {
    return (
      <div
        className="
          inline-flex
          max-w-full
          items-center
          gap-2
          rounded-full

          border
          border-rose-200
          bg-rose-50

          px-3
          py-2

          font-mono
          text-[10px]
          font-bold
          uppercase
          tracking-[0.08em]
          text-rose-700

          dark:border-rose-400/20
          dark:bg-rose-400/[0.07]
          dark:text-rose-300
        "
      >
        <span
          aria-hidden="true"
          className="
            h-1.5
            w-1.5
            shrink-0
            rounded-full
            bg-rose-500

            dark:bg-rose-400
          "
        />

        <span className="min-w-0 break-all">
          Error 404 / Route not found
        </span>
      </div>
    );
  }
);

// =========================================================
// TERMINAL DIAGNOSTICS
// =========================================================

const NotFoundTerminal = memo(
  function NotFoundTerminal({
    pathname,
  }) {
    const safePath =
      typeof pathname === "string" &&
      pathname.trim()
        ? pathname
        : "/";

    const displayedPath =
      safePath.length > 90
        ? `${safePath.slice(0, 87)}...`
        : safePath;

    return (
      <div
        className="
          relative
          w-full
          min-w-0
          overflow-hidden
          rounded-2xl

          border
          border-slate-200
          bg-white/90

          shadow-[0_18px_55px_rgba(30,41,59,0.07)]

          dark:border-white/[0.10]
          dark:bg-[#080d16]/95
          dark:shadow-[0_24px_70px_rgba(0,0,0,0.22)]
        "
      >
        {/* TERMINAL HEADER */}

        <div
          className="
            flex
            min-w-0
            items-center
            justify-between
            gap-2

            border-b
            border-slate-200
            bg-slate-50/80

            px-4
            py-3

            dark:border-white/[0.08]
            dark:bg-white/[0.025]
          "
        >
          <div
            className="
              flex
              min-w-0
              items-center
              gap-2
            "
          >
            <Terminal
              size={15}
              className="
                shrink-0
                text-indigo-600

                dark:text-indigo-300
              "
              aria-hidden="true"
            />

            <span
              className="
                min-w-0
                truncate
                font-mono
                text-[10px]
                font-bold
                text-slate-600

                dark:text-slate-300
              "
            >
              fsociety://diagnostics
            </span>
          </div>

          <div
            aria-hidden="true"
            className="flex shrink-0 gap-1.5"
          >
            <span className="h-2 w-2 rounded-full bg-rose-400/80" />
            <span className="h-2 w-2 rounded-full bg-amber-400/80" />
            <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
          </div>
        </div>

        {/* TERMINAL CONTENT */}

        <div
          className="
            min-w-0
            space-y-3
            p-4

            font-mono
            text-[11px]
            leading-6

            sm:p-5
            sm:text-xs
          "
        >
          <p
            className="
              flex
              items-start
              gap-2
              text-slate-500

              dark:text-slate-400
            "
          >
            <span
              aria-hidden="true"
              className="
                shrink-0
                font-bold
                text-emerald-600

                dark:text-emerald-400
              "
            >
              $
            </span>

            <span className="min-w-0 break-all">
              locate --route "{displayedPath}"
            </span>
          </p>

          <p
            className="
              flex
              items-center
              gap-2
              text-rose-600

              dark:text-rose-300
            "
          >
            <SearchX
              size={14}
              className="shrink-0"
              aria-hidden="true"
            />

            <span>
              No matching route found
            </span>
          </p>

          <div
            className="
              flex
              flex-wrap
              items-center
              justify-between
              gap-2

              border-t
              border-slate-200
              pt-3

              dark:border-white/[0.08]
            "
          >
            <span
              className="
                text-slate-500
                dark:text-slate-400
              "
            >
              Status
            </span>

            <span
              className="
                rounded-md
                bg-rose-50
                px-2
                py-0.5
                font-bold
                text-rose-700

                dark:bg-rose-400/[0.09]
                dark:text-rose-300
              "
            >
              PAGE_NOT_FOUND
            </span>
          </div>
        </div>
      </div>
    );
  }
);

// =========================================================
// 404 VISUAL
// =========================================================

const NotFoundVisual = memo(
  function NotFoundVisual({
    pathname,
  }) {
    return (
      <div
        className="
          relative
          flex
          min-h-[330px]
          min-w-0
          flex-col
          items-center
          justify-center
          overflow-hidden

          border-t
          border-slate-200/80

          bg-gradient-to-br
          from-indigo-50/80
          via-blue-50/60
          to-fuchsia-50/70

          px-5
          py-9

          sm:min-h-[390px]
          sm:px-8

          lg:min-h-[490px]
          lg:border-l
          lg:border-t-0

          dark:border-white/[0.07]
          dark:from-indigo-500/[0.08]
          dark:via-[#0c1627]/90
          dark:to-purple-500/[0.07]
        "
      >
        {/* ===================================
            RADIAL LIGHTS
        =================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[35%]
            h-64
            w-64
            -translate-x-1/2
            -translate-y-1/2
            rounded-full

            bg-indigo-400/15
            blur-[75px]

            dark:bg-indigo-500/15
          "
        />

        {/* ===================================
            ORBIT RINGS
        =================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[34%]
            h-64
            w-64
            -translate-x-1/2
            -translate-y-1/2

            rounded-full
            border
            border-indigo-300/35

            sm:h-72
            sm:w-72

            dark:border-indigo-400/20
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[34%]
            h-44
            w-44
            -translate-x-1/2
            -translate-y-1/2

            rounded-full
            border
            border-dashed
            border-blue-400/35

            sm:h-52
            sm:w-52

            dark:border-cyan-400/20
          "
        />

        {/* ===================================
            FLOATING ICON
        =================================== */}

        <div
          aria-hidden="true"
          className="
            absolute
            right-[14%]
            top-[12%]

            grid
            h-11
            w-11
            place-items-center
            rounded-2xl

            border
            border-indigo-200/80
            bg-white/70

            text-indigo-600

            shadow-lg
            shadow-indigo-500/5

            dark:border-indigo-400/20
            dark:bg-indigo-400/[0.09]
            dark:text-indigo-300
          "
        >
          <WifiOff size={19} />
        </div>

        {/* ===================================
            404 NUMBER
        =================================== */}

        <div
          aria-hidden="true"
          className="
            relative
            z-10
            select-none
            py-5
            text-center

            font-black
            leading-none
            tracking-[-0.09em]

            text-[clamp(6.5rem,23vw,10.5rem)]
          "
        >
          {/* SOFT GLOW */}

          <span
            className="
              absolute
              inset-0
              text-indigo-400/15
              blur-2xl

              dark:text-indigo-400/25
            "
          >
            404
          </span>

          {/* MAIN NUMBER */}

          <span
            className="
              relative
              bg-gradient-to-br
              from-indigo-700
              via-blue-600
              to-fuchsia-600

              bg-clip-text
              text-transparent

              dark:from-cyan-300
              dark:via-indigo-300
              dark:to-fuchsia-400
            "
          >
            404
          </span>
        </div>

        {/* ===================================
            NETWORK STATUS
        =================================== */}

        <div
          aria-hidden="true"
          className="
            relative
            z-10
            mb-7
            inline-flex
            items-center
            gap-2

            rounded-full
            border
            border-indigo-200/80
            bg-white/70

            px-3
            py-1.5

            font-mono
            text-[10px]
            font-bold
            uppercase
            tracking-[0.12em]
            text-indigo-700

            dark:border-indigo-400/15
            dark:bg-white/[0.035]
            dark:text-indigo-300
          "
        >
          <span
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-amber-500
            "
          />

          Signal lost
        </div>

        {/* ===================================
            TERMINAL
        =================================== */}

        <div
          className="
            relative
            z-20
            w-full
            max-w-sm
            min-w-0
          "
        >
          <NotFoundTerminal
            pathname={pathname}
          />
        </div>
      </div>
    );
  }
);

// =========================================================
// MAIN NOT FOUND PAGE
// =========================================================

const NotFound = () => {
  const location = useLocation();

  const pathname = location.pathname;

  return (
    <main
      className={PAGE_CLASS}
      style={{
        fontFamily:
          "var(--font-sans, 'Space Grotesk', sans-serif)",
      }}
    >
      {/* =================================================
          SHARED FSOCIETY BACKGROUND
      ================================================= */}

      <PageGridBackground
        showMonogram
        showCubes
      />

      {/* =================================================
          CONTRAST OVERLAY
      ================================================= */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          z-0

          bg-gradient-to-b
          from-white/0
          via-white/5
          to-white/20

          dark:from-transparent
          dark:via-transparent
          dark:to-[#050a14]/20
        "
      />

      {/* =================================================
          PAGE CONTAINER
      ================================================= */}

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          w-full
          max-w-7xl
          min-w-0
          flex-1
          flex-col

          px-4
          py-5

          sm:px-6
          sm:py-7

          lg:px-8
        "
      >
        {/* ===============================================
            PAGE HEADER
        =============================================== */}

        <header
          className="
            flex
            w-full
            min-w-0
            flex-wrap
            items-center
            justify-between
            gap-3
          "
        >
          <NotFoundBrand />

          <div
            className="
              inline-flex
              items-center
              gap-2

              rounded-full
              border
              border-slate-200
              bg-white/75

              px-3
              py-2

              font-mono
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              text-slate-500

              backdrop-blur-md

              dark:border-white/[0.09]
              dark:bg-[#0b1018]/75
              dark:text-slate-400
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-indigo-500
              "
              aria-hidden="true"
            />

            System response
          </div>
        </header>

        {/* ===============================================
            CENTER CONTENT
        =============================================== */}

        <section
          aria-labelledby="not-found-title"
          className="
            flex
            w-full
            min-w-0
            flex-1
            items-center
            justify-center

            py-9

            sm:py-12

            lg:py-16
          "
        >
          <div className={MAIN_CARD_CLASS}>
            {/* TOP BORDER ACCENT */}

            <div
              aria-hidden="true"
              className="
                absolute
                inset-x-0
                top-0
                z-20
                h-[2px]

                bg-gradient-to-r
                from-transparent
                via-indigo-500/70
                to-transparent

                dark:via-cyan-400/45
              "
            />

            {/* GRID */}

            <div
              className="
                grid
                w-full
                min-w-0
                grid-cols-1

                lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]
              "
            >
              {/* =========================================
                  LEFT — CONTENT
              ========================================= */}

              <div
                className="
                  relative
                  z-10
                  flex
                  min-w-0
                  flex-col
                  justify-center

                  p-5

                  sm:p-9

                  lg:p-12
                "
              >
                {/* ERROR BADGE */}

                <NotFoundStatus />

                {/* HEADING */}

                <h1
                  id="not-found-title"
                  className="
                    mt-6
                    max-w-xl

                    break-words
                    text-[clamp(1.9rem,5vw,3.5rem)]
                    font-black
                    leading-[1.12]
                    tracking-tight

                    text-slate-900

                    dark:text-white
                  "
                >
                  Bu yerda{" "}
                  <span
                    className="
                      bg-gradient-to-r
                      from-indigo-600
                      to-purple-600

                      bg-clip-text
                      text-transparent

                      dark:from-indigo-300
                      dark:to-purple-300
                    "
                  >
                    sahifa yo‘q.
                  </span>
                </h1>

                {/* DESCRIPTION */}

                <p
                  className="
                    mt-5
                    max-w-lg

                    break-words
                    text-sm
                    font-medium
                    leading-7

                    text-slate-600

                    sm:text-[15px]

                    dark:text-slate-300
                  "
                >
                  Aftidan, siz FSociety
                  tarmog‘ining noma’lum sektoriga
                  kirib qoldingiz.
                </p>

                <p
                  className="
                    mt-3
                    max-w-lg

                    break-words
                    text-sm
                    leading-7

                    text-slate-500

                    dark:text-slate-400
                  "
                >
                  Kiritilgan manzil noto‘g‘ri
                  bo‘lishi yoki sahifa
                  ko‘chirilgan yoxud o‘chirilgan
                  bo‘lishi mumkin. Xavotir olmang,
                  platformaning boshqa qismlarini
                  ko‘rishingiz mumkin.
                </p>

                {/* =====================================
                    ACTIONS
                ===================================== */}

                <div
                  className="
                    mt-8
                    flex
                    w-full
                    min-w-0
                    flex-col
                    gap-3

                    sm:flex-row
                    sm:flex-wrap
                  "
                >
                  {/* HOME */}

                  <Link
                    to="/"
                    className={PRIMARY_BUTTON_CLASS}
                  >
                    <Home
                      size={17}
                      className="shrink-0"
                      aria-hidden="true"
                    />

                    <span>
                      Bosh sahifaga qaytish
                    </span>

                    <ArrowUpRight
                      size={16}
                      className="shrink-0 opacity-80"
                      aria-hidden="true"
                    />
                  </Link>

                  {/* PROJECTS */}

                  <Link
                    to="/projects"
                    className={SECONDARY_BUTTON_CLASS}
                  >
                    <Compass
                      size={17}
                      className="shrink-0"
                      aria-hidden="true"
                    />

                    <span>
                      Loyihalarni ko‘rish
                    </span>
                  </Link>
                </div>

                {/* =====================================
                    INFO / TIP
                ===================================== */}

                <div
                  className="
                    mt-9
                    flex
                    min-w-0
                    items-start
                    gap-3

                    border-t
                    border-slate-200/80
                    pt-5

                    dark:border-white/[0.08]
                  "
                >
                  <div
                    className="
                      grid
                      h-9
                      w-9
                      shrink-0
                      place-items-center

                      rounded-xl
                      border
                      border-indigo-200

                      bg-indigo-50
                      text-indigo-600

                      dark:border-indigo-400/15
                      dark:bg-indigo-400/[0.07]
                      dark:text-indigo-300
                    "
                  >
                    <SearchX
                      size={16}
                      aria-hidden="true"
                    />
                  </div>

                  <div className="min-w-0">
                    <p
                      className="
                        text-xs
                        font-bold
                        text-slate-800

                        dark:text-slate-200
                      "
                    >
                      Havolani tekshiring
                    </p>

                    <p
                      className="
                        mt-1
                        break-words
                        text-xs
                        leading-5
                        text-slate-500

                        dark:text-slate-400
                      "
                    >
                      Agar ushbu manzilni
                      boshqa joydan olgan
                      bo‘lsangiz, havolani
                      qayta tekshirib ko‘ring.
                    </p>
                  </div>
                </div>
              </div>

              {/* =========================================
                  RIGHT — VISUAL
              ========================================= */}

              <NotFoundVisual
                pathname={pathname}
              />
            </div>
          </div>
        </section>

        {/* ===============================================
            FOOTER
        =============================================== */}

        <footer
          className="
            flex
            w-full
            min-w-0
            flex-col
            items-center
            justify-between
            gap-3

            border-t
            border-slate-200/60
            pt-4

            text-center

            sm:flex-row
            sm:text-left

            dark:border-white/[0.07]
          "
        >
          <span
            className="
              font-mono
              text-[10px]
              font-medium
              tracking-wide
              text-slate-500

              dark:text-slate-400
            "
          >
            FSOCIETY://BUILD · SHARE · SOLVE
          </span>

          <Link
            to="/"
            className="
              inline-flex
              min-h-10
              items-center
              gap-2
              rounded-lg
              px-2

              text-xs
              font-bold
              text-indigo-700

              transition-colors

              hover:text-indigo-900

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-indigo-500

              dark:text-indigo-300
              dark:hover:text-indigo-200
            "
          >
            <ArrowLeft
              size={15}
              aria-hidden="true"
            />

            FSociety'ga qaytish
          </Link>
        </footer>
      </div>
    </main>
  );
};

export default memo(NotFound);
