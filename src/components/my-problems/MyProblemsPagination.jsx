
import React, { memo, useMemo } from "react";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  MoreHorizontal,
} from "lucide-react";

// =========================================================
// FSOCIETY — MY PROBLEMS PAGINATION
// =========================================================
//
// Existing props:
// - currentPage
// - totalPages
// - items
// - onPageChange(page)
// - isLoading
//
// Features:
// - Light / Dark Mode
// - Responsive 320px+
// - First / Previous / Next / Last
// - Dynamic page numbers
// - Ellipsis support
// - Loading state
// - Duplicate navigation prevention
// - Accessibility
// - FSociety developer style
//
// =========================================================

// =========================================================
// HELPERS
// =========================================================

const getSafeInteger = (value, fallback = 0) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return fallback;
  }

  return Math.max(0, Math.trunc(number));
};

const normalizePage = (value, totalPages) => {
  const number = getSafeInteger(value, 1);

  return Math.max(
    1,
    Math.min(number, totalPages)
  );
};

const getFallbackItems = (
  currentPage,
  totalPages
) => {
  if (totalPages <= 7) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1
    );
  }

  const visiblePages = new Set([
    1,
    totalPages,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ]);

  if (currentPage <= 3) {
    [2, 3, 4].forEach((page) => {
      visiblePages.add(page);
    });
  }

  if (currentPage >= totalPages - 2) {
    [
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
    ].forEach((page) => {
      visiblePages.add(page);
    });
  }

  const pages = [...visiblePages]
    .filter(
      (page) =>
        page >= 1 &&
        page <= totalPages
    )
    .sort((a, b) => a - b);

  const result = [];

  pages.forEach((page, index) => {
    const previous = pages[index - 1];

    if (
      index > 0 &&
      page - previous > 1
    ) {
      if (page - previous === 2) {
        result.push(previous + 1);
      } else {
        result.push(
          `ellipsis-${index}`
        );
      }
    }

    result.push(page);
  });

  return result;
};

// =========================================================
// STYLES
// =========================================================

const BUTTON_BASE = [
  "inline-flex",
  "h-10",
  "min-w-10",
  "shrink-0",
  "items-center",
  "justify-center",
  "rounded-xl",
  "border",
  "font-mono",
  "text-xs",
  "font-bold",
  "tabular-nums",
  "transition-colors",
  "duration-200",
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-indigo-400",
  "disabled:cursor-not-allowed",
  "disabled:opacity-40",
  "motion-reduce:transition-none",
].join(" ");

const NORMAL_BUTTON = [
  BUTTON_BASE,
  "border-slate-200",
  "bg-white/90",
  "text-slate-600",
  "hover:border-indigo-300",
  "hover:bg-indigo-50",
  "hover:text-indigo-700",
  "dark:border-white/[0.10]",
  "dark:bg-white/[0.04]",
  "dark:text-slate-300",
  "dark:hover:border-indigo-400/30",
  "dark:hover:bg-indigo-400/10",
  "dark:hover:text-indigo-200",
].join(" ");

const ACTIVE_BUTTON = [
  BUTTON_BASE,
  "border-indigo-600",
  "bg-indigo-600",
  "text-white",
  "shadow-[0_4px_14px_rgba(79,70,229,0.20)]",
  "dark:border-indigo-400",
  "dark:bg-indigo-500",
  "dark:text-white",
].join(" ");

// =========================================================
// COMPONENT
// =========================================================

function MyProblemsPagination({
  currentPage = 1,
  totalPages = 0,
  items = [],
  onPageChange,
  isLoading = false,
  className = "",
}) {
  // =====================================================
  // SAFE VALUES
  // =====================================================

  const safeTotalPages = getSafeInteger(
    totalPages
  );

  const safeCurrentPage =
    safeTotalPages > 0
      ? normalizePage(
          currentPage,
          safeTotalPages
        )
      : 1;

  const canNavigate =
    typeof onPageChange === "function" &&
    !isLoading;

  const hasPrevious =
    safeCurrentPage > 1;

  const hasNext =
    safeCurrentPage < safeTotalPages;

  // =====================================================
  // PAGE ITEMS
  // =====================================================

  const pageItems = useMemo(() => {
    if (!Array.isArray(items) || items.length === 0) {
      return getFallbackItems(
        safeCurrentPage,
        safeTotalPages
      );
    }

    return items;
  }, [
    items,
    safeCurrentPage,
    safeTotalPages,
  ]);

  // =====================================================
  // NAVIGATION
  // =====================================================

  const handleNavigate = (targetPage) => {
    if (
      !canNavigate ||
      safeTotalPages <= 1
    ) {
      return;
    }

    const nextPage = normalizePage(
      targetPage,
      safeTotalPages
    );

    if (
      nextPage === safeCurrentPage
    ) {
      return;
    }

    onPageChange(nextPage);
  };

  // =====================================================
  // HIDE SINGLE PAGE
  // =====================================================

  if (safeTotalPages <= 1) {
    return null;
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <nav
      aria-label="Muammolar sahifalari"
      aria-busy={isLoading}
      className={`
        relative mt-8
        w-full min-w-0 max-w-full
        overflow-hidden

        rounded-2xl
        border border-slate-200/90
        bg-white/90

        px-3 py-3

        shadow-[0_8px_25px_rgba(15,23,42,0.035)]
        backdrop-blur-xl

        dark:border-white/[0.09]
        dark:bg-[#0c121e]/90

        sm:px-4 sm:py-4

        ${className}
      `}
    >
      {/* TOP ACCENT */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute inset-x-0 top-0
          h-px
          bg-gradient-to-r
          from-indigo-500
          via-cyan-400/50
          to-transparent
        "
      />

      {/* HEADER */}
      <div
        className="
          mb-3 flex min-w-0
          flex-wrap items-center
          justify-between gap-2
        "
      >
        <div className="min-w-0">
          <p
            className="
              font-mono text-[9px]
              font-bold uppercase
              tracking-[0.12em]
              text-slate-400
              dark:text-slate-500
            "
          >
            FSOCIETY / NAVIGATION
          </p>

          <p
            className="
              mt-1 text-[12px]
              font-semibold
              text-slate-700
              dark:text-slate-200
            "
          >
            Sahifa {safeCurrentPage} / {safeTotalPages}
          </p>
        </div>

        {isLoading && (
          <span
            role="status"
            className="
              inline-flex items-center
              gap-1.5 text-[11px]
              text-indigo-600
              dark:text-indigo-300
            "
          >
            <Loader2
              size={13}
              className="motion-safe:animate-spin"
              aria-hidden="true"
            />

            Yuklanmoqda...
          </span>
        )}
      </div>

      {/* CONTROLS */}
      <div
        className="
          flex min-w-0
          items-center
          justify-between gap-1.5

          sm:justify-center
          sm:gap-2
        "
      >
        {/* FIRST */}
        <button
          type="button"
          onClick={() => handleNavigate(1)}
          disabled={
            !canNavigate ||
            !hasPrevious
          }
          title="Birinchi sahifa"
          aria-label="Birinchi sahifaga o'tish"
          className={`${NORMAL_BUTTON} hidden sm:inline-flex`}
        >
          <ChevronsLeft
            size={17}
            aria-hidden="true"
          />
        </button>

        {/* PREVIOUS */}
        <button
          type="button"
          onClick={() =>
            handleNavigate(
              safeCurrentPage - 1
            )
          }
          disabled={
            !canNavigate ||
            !hasPrevious
          }
          title="Oldingi sahifa"
          aria-label="Oldingi sahifa"
          className={NORMAL_BUTTON}
        >
          <ChevronLeft
            size={17}
            aria-hidden="true"
          />
        </button>

        {/* PAGE NUMBERS */}
        <div
          className="
            flex min-w-0 items-center
            justify-center gap-1
            sm:gap-1.5
          "
        >
          {pageItems.map((item, index) => {
            const numericPage = Number(item);

            const isPageNumber =
              item !== null &&
              item !== undefined &&
              item !== "" &&
              Number.isInteger(numericPage) &&
              numericPage >= 1 &&
              numericPage <= safeTotalPages;

            if (!isPageNumber) {
              return (
                <span
                  key={`dots-${index}`}
                  aria-hidden="true"
                  className="
                    hidden h-10 w-7
                    items-center
                    justify-center
                    text-slate-400
                    dark:text-slate-500
                    sm:inline-flex
                  "
                >
                  <MoreHorizontal
                    size={17}
                  />
                </span>
              );
            }

            const page = numericPage;

            const isActive =
              page === safeCurrentPage;

            return (
              <button
                key={`page-${page}-${index}`}
                type="button"
                onClick={() =>
                  handleNavigate(page)
                }
                disabled={
                  !canNavigate ||
                  isActive
                }
                aria-label={`${page}-sahifa`}
                aria-current={
                  isActive
                    ? "page"
                    : undefined
                }
                className={`
                  ${
                    isActive
                      ? ACTIVE_BUTTON
                      : NORMAL_BUTTON
                  }

                  ${
                    isActive
                      ? "inline-flex"
                      : "hidden sm:inline-flex"
                  }
                `}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* NEXT */}
        <button
          type="button"
          onClick={() =>
            handleNavigate(
              safeCurrentPage + 1
            )
          }
          disabled={
            !canNavigate ||
            !hasNext
          }
          title="Keyingi sahifa"
          aria-label="Keyingi sahifa"
          className={NORMAL_BUTTON}
        >
          <ChevronRight
            size={17}
            aria-hidden="true"
          />
        </button>

        {/* LAST */}
        <button
          type="button"
          onClick={() =>
            handleNavigate(safeTotalPages)
          }
          disabled={
            !canNavigate ||
            !hasNext
          }
          title="Oxirgi sahifa"
          aria-label="Oxirgi sahifaga o'tish"
          className={`${NORMAL_BUTTON} hidden sm:inline-flex`}
        >
          <ChevronsRight
            size={17}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* MOBILE PAGE INDICATOR */}
      <p
        className="
          mt-3 text-center
          font-mono text-[10px]
          text-slate-400
          dark:text-slate-500
          sm:hidden
        "
      >
        PAGE {safeCurrentPage} OF {safeTotalPages}
      </p>
    </nav>
  );
}

export default memo(MyProblemsPagination);
