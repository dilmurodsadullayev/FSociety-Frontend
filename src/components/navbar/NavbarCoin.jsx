
import React, { memo, useMemo } from "react";

import { Link } from "react-router-dom";

import FCoinIcon from "../../assests/coin/fcoin.png";

import {
  formatCompactNumber,
  formatFullNumber,
} from "../../utils/formatCompactNumber";

// =========================================================
// FSOCIETY — NAVBAR FCOIN
// =========================================================
//
// Location:
// src/components/navbar/NavbarCoin.jsx
//
// Features:
// - Compact FCoin values
// - Full balance tooltip
// - Existing FCoin icon
// - FCoin history navigation
// - Responsive design
// - Light / Dark mode
// - Accessible balance label
//
// IMPORTANT:
// Uses existing formatCompactNumber utility.
// Backend values are never modified.
// =========================================================

function NavbarCoin({
  coins = 0,
  className = "",
}) {
  // =====================================================
  // BALANCE FORMATTING
  // =====================================================

  const {
    compactBalance,
    fullBalance,
  } = useMemo(
    () => ({
      compactBalance:
        formatCompactNumber(coins),

      fullBalance:
        formatFullNumber(coins),
    }),
    [coins]
  );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Link
      to="/fcoin-history"

      aria-label={
        `FCoin tarixi. Balans: ${fullBalance} FCoin`
      }

      title={`${fullBalance} FCoin`}

      className={`
        group/fcoin
        relative

        inline-flex
        h-9
        min-w-0
        shrink-0

        items-center
        justify-center

        gap-1.5

        overflow-hidden
        whitespace-nowrap

        rounded-full

        border
        border-amber-400/30

        bg-gradient-to-r
        from-amber-50
        to-orange-50/90

        py-1
        pl-1
        pr-2.5

        shadow-[0_3px_12px_rgba(180,83,9,0.06)]

        transition-[border-color,background-color,box-shadow]
        duration-200

        hover:border-amber-400/60
        hover:shadow-[0_5px_18px_rgba(180,83,9,0.10)]

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-amber-500
        focus-visible:ring-offset-2

        dark:border-amber-400/20
        dark:from-amber-400/[0.06]
        dark:to-orange-400/[0.03]

        dark:shadow-none
        dark:hover:border-amber-400/40
        dark:focus-visible:ring-offset-[#080c12]

        sm:h-10

        ${className}
      `}
    >
      {/* HOVER LIGHT */}

      <span
        aria-hidden="true"
        className="
          pointer-events-none

          absolute inset-0

          bg-amber-400/[0.05]

          opacity-0

          transition-opacity
          duration-200

          group-hover/fcoin:opacity-100
        "
      />

      {/* COIN ICON */}

      <span
        className="
          relative z-10

          grid
          h-7 w-7
          shrink-0

          place-items-center

          rounded-full

          border border-amber-400/30
          bg-amber-400/[0.12]

          transition-transform
          duration-200

          group-hover/fcoin:scale-105
          group-hover/fcoin:rotate-[8deg]

          dark:border-amber-400/20
          dark:bg-amber-400/[0.07]

          sm:h-8 sm:w-8

          motion-reduce:transform-none
          motion-reduce:transition-none
        "
      >
        <img
          src={FCoinIcon}
          alt=""
          draggable={false}
          width={26}
          height={26}
          className="
            h-5 w-5
            select-none
            object-contain

            sm:h-6 sm:w-6
          "
        />
      </span>

      {/* COMPACT BALANCE */}

      <span
        className="
          relative z-10

          min-w-0

          font-mono
          text-[12px]
          font-extrabold

          leading-none
          tracking-tight
          tabular-nums

          text-amber-800

          transition-colors
          duration-200

          group-hover/fcoin:text-amber-700

          dark:text-amber-300
          dark:group-hover/fcoin:text-amber-200

          sm:text-[13px]
        "
      >
        {compactBalance}
      </span>

      {/* SR-ONLY FULL BALANCE */}

      <span className="sr-only">
        To‘liq balans: {fullBalance} FCoin
      </span>
    </Link>
  );
}

export default memo(NavbarCoin);
