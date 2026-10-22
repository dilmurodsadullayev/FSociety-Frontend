
import React, { memo, useMemo } from "react";

import { Link } from "react-router-dom";

import {
  ArrowRight,
  Code2,
  FileQuestion,
  FolderSearch,
  Lightbulb,
  Plus,
  RotateCcw,
  SearchX,
  Terminal,
} from "lucide-react";

// =========================================================
// FSOCIETY — MY PROBLEMS EMPTY STATE
// =========================================================
//
// Location:
// src/components/my-problems/MyProblemsEmptyState.jsx
//
// Props:
// - searchTerm
// - onClearSearch
//
// Features:
// - No problems state
// - No search results state
// - Light / Dark Mode
// - Responsive 320px+
// - Existing route compatibility
// - Accessible actions
// - Site typography
// - Mr. Robot / Terminal styling
//
// API and Redux remain in MyProblems.jsx.
//
// =========================================================

const CREATE_PROBLEM_URL = "/problem-create";

const ALL_PROBLEMS_URL = "/problems";

// =========================================================
// MAIN COMPONENT
// =========================================================

function MyProblemsEmptyState({
  searchTerm = "",
  onClearSearch,
  className = "",
}) {
  // =====================================================
  // SEARCH INFORMATION
  // =====================================================

  const normalizedSearch = String(
    searchTerm ?? ""
  ).trim();

  const hasSearch = Boolean(normalizedSearch);

  // =====================================================
  // DISPLAY CONTENT
  // =====================================================

  const content = useMemo(() => {
    if (hasSearch) {
      return {
        eyebrow: "SEARCH_RESULT / EMPTY",
        title: "Hech qanday muammo topilmadi",
        description:
          "Qidiruvga mos muammo topilmadi. Boshqa kalit so‘z kiriting yoki qidiruvni tozalang.",
        terminal: "NO_MATCHING_RECORDS",
      };
    }

    return {
      eyebrow: "MY_PROBLEMS / EMPTY",
      title: "Hali muammo qo‘shmagansiz",
      description:
        "Dasturlash davomida duch kelgan muammolaringizni hamjamiyat bilan bo‘lishing. Birinchi muammoingizni yaratishdan boshlang.",
      terminal: "AWAITING_FIRST_PROBLEM",
    };
  }, [hasSearch]);

  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  const handleClearSearch = () => {
    if (
      typeof onClearSearch === "function"
    ) {
      onClearSearch();
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      className={`
        col-span-full
        w-full min-w-0 max-w-full

        ${className}
      `}
    >
      <section
        aria-label={
          hasSearch
            ? "Qidiruv natijalari topilmadi"
            : "Mening muammolarim bo‘sh"
        }
        className="
          relative isolate
          w-full min-w-0
          overflow-hidden

          rounded-[22px]

          border border-slate-200
          bg-white/90

          px-4 py-9

          text-center

          shadow-[0_10px_32px_rgba(15,23,42,0.035)]
          backdrop-blur-xl

          dark:border-white/[0.09]
          dark:bg-[#0c121e]/90
          dark:shadow-[0_16px_40px_rgba(0,0,0,0.14)]

          sm:rounded-[26px]
          sm:px-8
          sm:py-12

          lg:py-14
        "
      >
        {/* ==========================================
            BACKGROUND DECORATION
           ========================================== */}

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
              absolute -right-28 -top-28

              h-72 w-72
              rounded-full

              bg-indigo-500/[0.06]
              blur-[80px]

              dark:bg-indigo-500/[0.10]
            "
          />

          <div
            className="
              absolute -bottom-32 -left-24

              h-72 w-72
              rounded-full

              bg-cyan-500/[0.06]
              blur-[85px]

              dark:bg-cyan-500/[0.08]
            "
          />

          <div
            className="
              absolute inset-0

              opacity-[0.13]
              dark:opacity-[0.07]
            "
            style={{
              backgroundImage:
                "linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)",
              backgroundSize: "42px 42px",
            }}
          />

          <div
            className="
              absolute left-0 top-0
              h-[2px] w-full

              bg-gradient-to-r
              from-indigo-500
              via-cyan-400/60
              to-transparent
            "
          />
        </div>

        {/* ==========================================
            CONTENT
           ========================================== */}

        <div
          className="
            relative z-10
            mx-auto
            flex max-w-xl
            flex-col items-center
          "
        >
          {/* ========================================
              TERMINAL STATUS
             ======================================== */}

          <div
            className="
              inline-flex max-w-full
              items-center gap-2

              rounded-lg

              border border-slate-200
              bg-slate-50/90

              px-3 py-1.5

              dark:border-white/[0.09]
              dark:bg-white/[0.04]
            "
          >
            <Terminal
              size={13}
              className="
                shrink-0
                text-indigo-600
                dark:text-indigo-400
              "
              aria-hidden="true"
            />

            <span
              className="
                truncate
                font-mono
                text-[10px] font-bold
                uppercase tracking-[0.10em]

                text-slate-500
                dark:text-slate-400
              "
            >
              {content.eyebrow}
            </span>
          </div>

          {/* ========================================
              ILLUSTRATION
             ======================================== */}

          <div
            aria-hidden="true"
            className="
              relative mt-7
              flex h-[104px] w-[104px]
              items-center justify-center

              sm:h-[120px] sm:w-[120px]
            "
          >
            {/* OUTER RING */}
            <div
              className="
                absolute inset-0
                rounded-[30px]

                border border-indigo-200/80
                bg-indigo-50/70

                rotate-6

                dark:border-indigo-400/15
                dark:bg-indigo-500/[0.07]
              "
            />

            {/* SECONDARY RING */}
            <div
              className="
                absolute inset-2

                rounded-[25px]
                border border-cyan-200/80

                -rotate-6

                dark:border-cyan-400/15
              "
            />

            {/* CENTRAL ICON */}
            <div
              className="
                relative z-10
                grid h-[72px] w-[72px]
                place-items-center

                rounded-[22px]

                border border-white
                bg-white

                shadow-[0_10px_30px_rgba(79,70,229,0.08)]

                dark:border-white/[0.10]
                dark:bg-[#10182a]

                sm:h-[82px] sm:w-[82px]
              "
            >
              {hasSearch ? (
                <SearchX
                  size={35}
                  strokeWidth={1.5}
                  className="
                    text-indigo-600
                    dark:text-indigo-300
                  "
                />
              ) : (
                <FileQuestion
                  size={35}
                  strokeWidth={1.5}
                  className="
                    text-indigo-600
                    dark:text-indigo-300
                  "
                />
              )}
            </div>

            {/* DECORATIVE DOT */}
            <span
              className="
                absolute -right-1 top-3
                h-3 w-3 rounded-full

                border-[3px] border-white
                bg-cyan-400

                dark:border-[#0c121e]
              "
            />
          </div>

          {/* ========================================
              TITLE
             ======================================== */}

          <h2
            className="
              mt-7

              max-w-full
              break-words

              font-sans
              text-[clamp(1.25rem,4vw,1.7rem)]
              font-black

              leading-tight
              tracking-[-0.025em]

              text-slate-950
              dark:text-white
            "
          >
            {content.title}
          </h2>

          {/* ========================================
              DESCRIPTION
             ======================================== */}

          <p
            className="
              mt-3
              max-w-md

              text-[13px]
              leading-6

              text-slate-600
              dark:text-slate-400

              sm:text-sm
              sm:leading-7
            "
          >
            {content.description}
          </p>

          {/* ========================================
              SEARCH VALUE
             ======================================== */}

          {hasSearch && (
            <div
              className="
                mt-5
                flex min-w-0 max-w-full
                items-center gap-2

                rounded-xl
                border border-slate-200

                bg-slate-50
                px-3 py-2

                dark:border-white/[0.09]
                dark:bg-white/[0.04]
              "
            >
              <FolderSearch
                size={15}
                className="
                  shrink-0
                  text-indigo-600
                  dark:text-indigo-400
                "
                aria-hidden="true"
              />

              <span
                className="
                  min-w-0 max-w-full
                  break-all

                  font-mono text-[12px]
                  font-semibold

                  text-slate-700
                  dark:text-slate-200
                "
              >
                “{normalizedSearch}”
              </span>
            </div>
          )}

          {/* ========================================
              ACTION BUTTONS
             ======================================== */}

          <div
            className="
              mt-7
              flex w-full
              max-w-md
              flex-col
              items-stretch justify-center

              gap-2.5

              sm:flex-row
              sm:items-center
            "
          >
            {hasSearch ? (
              <>
                {/* CLEAR SEARCH */}
                <button
                  type="button"
                  onClick={handleClearSearch}
                  disabled={
                    typeof onClearSearch !==
                    "function"
                  }
                  className="
                    inline-flex
                    min-h-11 min-w-0
                    items-center justify-center
                    gap-2

                    rounded-xl

                    bg-indigo-600
                    px-5 py-3

                    text-[12px]
                    font-bold text-white

                    shadow-[0_8px_20px_rgba(79,70,229,0.16)]

                    transition-colors
                    hover:bg-indigo-700

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-indigo-400
                    focus-visible:ring-offset-2

                    disabled:cursor-not-allowed
                    disabled:opacity-50

                    dark:bg-indigo-500
                    dark:hover:bg-indigo-400
                  "
                >
                  <RotateCcw
                    size={15}
                    aria-hidden="true"
                  />

                  Qidiruvni tozalash
                </button>

                {/* BROWSE ALL PROBLEMS */}
                <Link
                  to={ALL_PROBLEMS_URL}
                  className="
                    inline-flex
                    min-h-11 min-w-0
                    items-center justify-center
                    gap-2

                    rounded-xl
                    border border-slate-200

                    bg-white
                    px-5 py-3

                    text-[12px]
                    font-bold text-slate-700

                    transition-colors

                    hover:border-indigo-300
                    hover:bg-indigo-50
                    hover:text-indigo-700

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-indigo-400

                    dark:border-white/[0.10]
                    dark:bg-white/[0.04]
                    dark:text-slate-200

                    dark:hover:border-indigo-400/30
                    dark:hover:bg-indigo-400/10
                  "
                >
                  <Code2
                    size={15}
                    aria-hidden="true"
                  />

                  Barcha muammolar
                </Link>
              </>
            ) : (
              <>
                {/* CREATE FIRST PROBLEM */}
                <Link
                  to={CREATE_PROBLEM_URL}
                  className="
                    inline-flex
                    min-h-11 min-w-0
                    items-center justify-center
                    gap-2

                    rounded-xl

                    bg-indigo-600
                    px-5 py-3

                    text-[12px] font-bold
                    text-white

                    shadow-[0_8px_20px_rgba(79,70,229,0.16)]

                    transition-colors

                    hover:bg-indigo-700

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-indigo-400
                    focus-visible:ring-offset-2

                    dark:bg-indigo-500
                    dark:hover:bg-indigo-400
                  "
                >
                  <Plus
                    size={16}
                    aria-hidden="true"
                  />

                  Birinchi muammoni yaratish
                </Link>

                {/* BROWSE PROBLEMS */}
                <Link
                  to={ALL_PROBLEMS_URL}
                  className="
                    inline-flex
                    min-h-11 min-w-0
                    items-center justify-center
                    gap-2

                    rounded-xl
                    border border-slate-200
                    bg-white

                    px-5 py-3

                    text-[12px]
                    font-bold text-slate-700

                    transition-colors

                    hover:border-indigo-300
                    hover:bg-indigo-50
                    hover:text-indigo-700

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-indigo-400

                    dark:border-white/[0.10]
                    dark:bg-white/[0.04]
                    dark:text-slate-200

                    dark:hover:border-indigo-400/30
                    dark:hover:bg-indigo-400/10
                  "
                >
                  <ArrowRight
                    size={15}
                    aria-hidden="true"
                  />

                  Muammolarni ko‘rish
                </Link>
              </>
            )}
          </div>

          {/* ========================================
              FOOTER
             ======================================== */}

          <div
            className="
              mt-8
              flex min-w-0
              items-center gap-2

              font-mono text-[10px]
              font-semibold
              tracking-[0.06em]

              text-slate-400
              dark:text-slate-500
            "
          >
            {hasSearch ? (
              <>
                <SearchX
                  size={12}
                  aria-hidden="true"
                />

                {content.terminal}
              </>
            ) : (
              <>
                <Lightbulb
                  size={12}
                  aria-hidden="true"
                />

                {content.terminal}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default memo(MyProblemsEmptyState);
