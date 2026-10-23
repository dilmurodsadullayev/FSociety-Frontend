
import React, { memo } from "react";

import { Link } from "react-router-dom";

import {
  ArrowUpRight,
  ShieldCheck,
  Terminal,
} from "lucide-react";

import FSocietyLogo from "../../../assests/logo/f_society.png";

// =========================================================
// FSOCIETY — LOGIN HEADER
// =========================================================
//
// Location:
// src/components/auth/login/LoginHeader.jsx
//
// Features:
// - Existing FSociety brand logo
// - Compact login heading
// - Light / Dark mode
// - Tailwind only
// - Responsive layout
// - Accessible navigation
// - No API / Redux dependency
//
// Visual consistency:
// RegisterHeader + AuthPageLayout
// =========================================================

function LoginHeader({
  title = "Xush kelibsiz",

  description =
    "Jamiyatga qaytganingiz bilan! " +
    "Hisobingizga kiring va davom eting.",

  logoSrc = FSocietyLogo,

  className = "",
}) {
  return (
    <header
      className={`
        relative w-full
        min-w-0 text-center

        ${className}
      `}
    >
      {/* ======================================
          BRAND
         ====================================== */}

      <div
        className="
          flex items-center
          justify-center
        "
      >
        <Link
          to="/"
          aria-label="FSociety bosh sahifasiga qaytish"
          className="
            group/brand

            inline-flex max-w-full
            items-center gap-2.5

            rounded-xl px-2 py-1

            transition-opacity
            duration-200

            hover:opacity-85

            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-indigo-400

            motion-reduce:transition-none
          "
        >
          {/* LOGO */}
          <span
            className="
              relative

              flex h-11 w-11
              shrink-0

              items-center
              justify-center

              rounded-xl

              border border-indigo-200/80
              bg-indigo-50/90

              shadow-[0_5px_18px_rgba(79,70,229,0.09)]

              dark:border-indigo-400/20
              dark:bg-indigo-400/[0.08]

              dark:shadow-[0_5px_20px_rgba(0,0,0,0.16)]
            "
          >
            <img
              src={logoSrc}
              alt=""
              width="36"
              height="36"
              decoding="async"
              className="
                h-9 w-9
                object-contain

                transition-transform
                duration-300

                group-hover/brand:scale-105

                motion-reduce:transform-none
                motion-reduce:transition-none
              "
            />

            {/* BRAND ACCENT */}
            <span
              aria-hidden="true"
              className="
                absolute -right-1 -top-1

                flex h-4 w-4

                items-center
                justify-center

                rounded-full

                border-2 border-white
                bg-indigo-500

                text-white

                dark:border-[#0b1220]
              "
            >
              <Terminal size={9} />
            </span>
          </span>

          {/* BRAND NAME */}
          <span
            className="
              min-w-0

              font-sans
              text-[21px] font-black
              tracking-[-0.06em]

              text-slate-950

              dark:text-white

              sm:text-[23px]
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

          {/* HOVER INDICATOR */}
          <ArrowUpRight
            size={14}
            aria-hidden="true"
            className="
              shrink-0

              text-slate-400
              opacity-0

              transition-opacity
              duration-200

              group-hover/brand:opacity-100
              group-focus-visible/brand:opacity-100

              dark:text-slate-500

              motion-reduce:transition-none
            "
          />
        </Link>
      </div>

      {/* ======================================
          LOGIN STATUS BADGE
         ====================================== */}

      <div
        className="
          mt-4 flex items-center
          justify-center
        "
      >
        <span
          className="
            inline-flex max-w-full
            items-center gap-1.5

            rounded-full

            border border-indigo-200
            bg-indigo-50/80

            px-3 py-1.5

            font-mono text-[9px]
            font-bold uppercase
            tracking-[0.10em]

            text-indigo-700

            dark:border-indigo-400/20
            dark:bg-indigo-400/[0.08]
            dark:text-indigo-300
          "
        >
          <ShieldCheck
            size={12}
            className="shrink-0"
            aria-hidden="true"
          />

          FSOCIETY / AUTH_LOGIN
        </span>
      </div>

      {/* ======================================
          PAGE TITLE
         ====================================== */}

      <h1
        className="
          mt-3 min-w-0

          break-words

          font-sans
          text-[clamp(1.45rem,5vw,1.9rem)]

          font-black
          leading-[1.2]
          tracking-[-0.035em]

          text-slate-950

          dark:text-white
        "
      >
        {title}
      </h1>

      {/* ======================================
          DESCRIPTION
         ====================================== */}

      <p
        className="
          mx-auto mt-2

          max-w-sm min-w-0

          text-[12px]
          leading-5

          text-slate-600

          dark:text-slate-400

          sm:text-[13px]
          sm:leading-6
        "
      >
        {description}
      </p>
    </header>
  );
}

export default memo(LoginHeader);
