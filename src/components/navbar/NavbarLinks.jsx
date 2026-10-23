
import React, { memo } from "react";
import { Link } from "react-router-dom";

import { NAV_LINKS } from "./navConfig";

// =========================================================
// FSOCIETY — DESKTOP NAVBAR LINKS
// =========================================================
//
//  < 1024px : MobileNavbarSidebar
//  1024–1279 : Compact icon navigation
//  >= 1280px : Icons + labels
//
// Preserves:
// - All NAV_LINKS
// - Active route styling
// - Light / Dark mode
// - Keyboard accessibility
// - Existing isActive prop
//
// =========================================================

function NavbarLinks({
  isActive,
  className = "",
}) {
  return (
    <nav
      aria-label="Asosiy navigatsiya"
      className={`
        hidden lg:flex

        min-w-0 shrink-0
        items-center justify-center

        gap-0.5 xl:gap-1

        rounded-2xl
        border border-[#ccd7e9]/90
        bg-[#f6f8ff]/80

        p-1

        shadow-[0_4px_16px_rgba(30,41,59,0.04)]

        dark:border-white/[0.08]
        dark:bg-white/[0.025]
        dark:shadow-none

        ${className}
      `}
    >
      {NAV_LINKS.map((link) => {
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
            title={text}
            aria-label={text}
            aria-current={
              active ? "page" : undefined
            }
            className={`
              group/nav
              relative

              inline-flex
              h-10 shrink-0

              items-center
              justify-center

              gap-0 xl:gap-2

              whitespace-nowrap
              rounded-xl

              px-2.5
              xl:px-3
              2xl:px-4

              text-[11px]
              font-bold
              uppercase
              tracking-[0.07em]

              outline-none

              transition-[background-color,color,box-shadow]
              duration-200

              focus-visible:ring-2
              focus-visible:ring-indigo-500

              dark:focus-visible:ring-indigo-400

              motion-reduce:transition-none

              ${
                active
                  ? `
                    bg-indigo-500/[0.11]
                    text-indigo-700

                    shadow-[inset_0_0_0_1px_rgba(79,70,229,0.16)]

                    dark:bg-indigo-500/15
                    dark:text-indigo-300

                    dark:shadow-[inset_0_0_0_1px_rgba(99,102,241,0.18)]
                  `
                  : `
                    text-slate-600

                    hover:bg-white
                    hover:text-indigo-700

                    dark:text-slate-400

                    dark:hover:bg-white/[0.07]
                    dark:hover:text-indigo-300
                  `
              }
            `}
          >
            {/* ICON */}

            {Icon && (
              <Icon
                size={17}
                strokeWidth={2}
                aria-hidden="true"
                className="
                  shrink-0

                  transition-transform
                  duration-200

                  group-hover/nav:scale-105

                  motion-reduce:transform-none
                "
              />
            )}

            {/* LABEL
                Hide labels on compact desktops.
                Keep aria-label on the Link.
            */}

            <span
              className="
                hidden xl:inline

                font-semibold
                leading-none
              "
            >
              {text}
            </span>

            {/* ACTIVE INDICATOR */}

            {active && (
              <span
                aria-hidden="true"
                className="
                  absolute
                  bottom-[3px]
                  left-1/2

                  h-[2px] w-4
                  -translate-x-1/2

                  rounded-full
                  bg-indigo-500

                  dark:bg-indigo-400
                "
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export default memo(NavbarLinks);
