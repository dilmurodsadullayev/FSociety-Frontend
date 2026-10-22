
import React, { memo } from "react";

import { Link } from "react-router-dom";

import {
  ArrowRight,
  Code2,
  Plus,
  Puzzle,
} from "lucide-react";

// =========================================================
// FSOCIETY — MY PROBLEMS HEADER
// =========================================================
//
// Compact header
// Light / Dark mode
// Responsive 320px+
// Navbar bilan bir xil Puzzle icon
// Existing navigation preserved
//
// =========================================================

const CREATE_PROBLEM_URL = "/problem-create";

const ALL_PROBLEMS_URL = "/problems";

// =========================================================
// HELPERS
// =========================================================

const getSafeCount = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.max(
    0,
    Math.trunc(number)
  );
};

// =========================================================
// COMPONENT
// =========================================================

function MyProblemsHeader({
  totalCount = 0,
}) {
  const count = getSafeCount(
    totalCount
  );

  return (
    <header
      className="
        relative mb-5
        w-full min-w-0
        overflow-hidden

        rounded-2xl
        border border-slate-200/90
        bg-white/90

        shadow-[0_8px_25px_rgba(15,23,42,0.035)]
        backdrop-blur-xl

        dark:border-white/[0.09]
        dark:bg-[#0c121e]/90
        dark:shadow-[0_10px_30px_rgba(0,0,0,0.14)]

        sm:mb-6
      "
    >
      {/* TOP ACCENT */}
      <div
        aria-hidden="true"
        className="
          absolute inset-x-0 top-0
          h-[2px]

          bg-gradient-to-r
          from-indigo-500
          via-cyan-400
          to-transparent
        "
      />

      {/* BACKGROUND GLOW */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -right-16 -top-24

          h-56 w-56
          rounded-full

          bg-indigo-500/[0.05]
          blur-[65px]

          dark:bg-indigo-400/[0.07]
        "
      />

      {/* CONTENT */}
      <div
        className="
          relative z-10
          flex min-w-0 flex-col
          gap-4

          p-4

          sm:p-5

          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        {/* ======================================
            LEFT — ICON AND TITLE
           ====================================== */}

        <div
          className="
            flex min-w-0 flex-1
            items-center gap-3
          "
        >
          {/* PUZZLE ICON */}
          <div
            className="
              flex h-12 w-12
              shrink-0
              items-center justify-center

              rounded-xl

              border border-indigo-200/80
              bg-indigo-50

              text-indigo-600

              shadow-[0_4px_12px_rgba(79,70,229,0.06)]

              dark:border-indigo-400/20
              dark:bg-indigo-400/[0.09]
              dark:text-indigo-300
            "
          >
            <Puzzle
              size={23}
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </div>

          {/* TITLE */}
          <div className="min-w-0 flex-1">
            <p
              className="
                mb-1 truncate
                font-mono
                text-[9px] font-bold
                uppercase tracking-[0.12em]

                text-indigo-600

                dark:text-indigo-400
              "
            >
              FSOCIETY://MY_PROBLEMS
            </p>

            <h1
              className="
                break-words
                text-[19px]
                font-black

                leading-tight
                tracking-[-0.035em]

                text-slate-950
                dark:text-white

                sm:text-[22px]
              "
            >
              Mening muammolarim
            </h1>

            <p
              className="
                mt-1
                text-[11px]
                leading-5

                text-slate-500

                dark:text-slate-400

                sm:text-xs
              "
            >
              Siz yaratgan muammolar ro‘yxati
            </p>
          </div>
        </div>

        {/* ======================================
            RIGHT — COUNT AND ACTIONS
           ====================================== */}

        <div
          className="
            flex min-w-0
            flex-wrap items-center
            gap-2

            sm:flex-nowrap

            lg:shrink-0
          "
        >
          {/* TOTAL COUNT */}
          <div
            className="
              inline-flex min-h-10
              items-center gap-2

              rounded-xl
              border border-slate-200

              bg-slate-50/80
              px-3 py-2

              dark:border-white/[0.09]
              dark:bg-white/[0.04]
            "
          >
            <Puzzle
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
                font-mono text-[15px]
                font-extrabold
                tabular-nums

                text-slate-900

                dark:text-white
              "
            >
              {count.toLocaleString("uz-UZ")}
            </span>

            <span
              className="
                text-[10px]
                font-semibold

                text-slate-500

                dark:text-slate-400
              "
            >
              Jami
            </span>
          </div>

          {/* ALL PROBLEMS */}
          <Link
            to={ALL_PROBLEMS_URL}
            className="
              inline-flex min-h-10
              flex-1 items-center
              justify-center gap-2

              rounded-xl
              border border-slate-200

              bg-white/80
              px-3 py-2

              text-[11px] font-bold
              text-slate-700

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
              dark:hover:text-indigo-200

              sm:flex-none
            "
          >
            <Code2
              size={15}
              className="shrink-0"
              aria-hidden="true"
            />

            Barchasi
          </Link>

          {/* CREATE PROBLEM */}
          <Link
            to={CREATE_PROBLEM_URL}
            className="
              group inline-flex
              min-h-10

              flex-1 items-center
              justify-center gap-2

              rounded-xl

              bg-indigo-600
              px-4 py-2

              text-[11px] font-bold
              text-white

              shadow-[0_6px_18px_rgba(79,70,229,0.16)]

              transition-colors

              hover:bg-indigo-700

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-indigo-400
              focus-visible:ring-offset-2

              active:scale-[0.98]

              dark:bg-indigo-500
              dark:hover:bg-indigo-400

              sm:flex-none
            "
          >
            <Plus
              size={16}
              className="shrink-0"
              aria-hidden="true"
            />

            <span>Yangi muammo</span>

            <ArrowRight
              size={14}
              className="
                hidden shrink-0
                transition-transform
                group-hover:translate-x-0.5

                xl:block
              "
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default memo(MyProblemsHeader);
