
import React, {
  memo,
  useMemo,
} from "react";

import { Link } from "react-router-dom";

import {
  ArrowUpRight,
} from "lucide-react";

// =========================================================
// FSOCIETY — MY PROBLEM CARD CONTENT
// =========================================================
//
// New Design — Larger Compact Card
//
// Features:
// - Improved typography
// - Two-line title
// - Three-line description
// - Technology badges
// - Backend tag color
// - Overflow counter
// - Light / Dark mode
// - Mobile responsive
//
// =========================================================

// =========================================================
// CONSTANTS
// =========================================================

const EMPTY_ARRAY = [];

const DEFAULT_VISIBLE_TAGS = 3;

// =========================================================
// HELPERS
// =========================================================

const normalizeText = (
  value,
  fallback = ""
) => {
  if (typeof value !== "string") {
    return fallback;
  }

  return value.trim() || fallback;
};

const getTagName = (tag) => {
  if (typeof tag === "string") {
    return tag.trim();
  }

  if (!tag || typeof tag !== "object") {
    return "";
  }

  return normalizeText(
    tag.name ??
    tag.title ??
    tag.label ??
    tag.language?.name ??
    tag.technology?.name
  );
};

const getTagColor = (tag) => {
  const color =
    tag?.color ??
    tag?.language?.color ??
    tag?.technology?.color;

  if (
    typeof color === "string" &&
    /^#[0-9a-fA-F]{6}$/.test(color)
  ) {
    return color;
  }

  return null;
};

const normalizeTags = (tags) => {
  if (!Array.isArray(tags)) {
    return EMPTY_ARRAY;
  }

  const seen = new Set();

  return tags.reduce((result, tag) => {
    const name = getTagName(tag);

    if (!name) {
      return result;
    }

    const key = name.toLowerCase();

    if (seen.has(key)) {
      return result;
    }

    seen.add(key);

    result.push({
      id: tag?.id ?? key,
      name,
      color: getTagColor(tag),
    });

    return result;
  }, []);
};

// =========================================================
// TAG BADGE
// =========================================================

const TagBadge = memo(function TagBadge({
  name,
  color,
}) {
  return (
    <span
      title={name}
      className="
        inline-flex
        min-h-[26px]
        min-w-0 max-w-full

        items-center gap-1.5

        rounded-lg
        border border-blue-200/80

        bg-blue-50
        px-2.5 py-1

        text-[10px]
        font-semibold

        text-blue-700

        dark:border-cyan-400/20
        dark:bg-cyan-400/[0.07]
        dark:text-cyan-200
      "
    >
      {color && (
        <span
          aria-hidden="true"
          className="
            h-2 w-2
            shrink-0 rounded-full
          "
          style={{
            backgroundColor: color,
          }}
        />
      )}

      <span
        className="
          max-w-[120px]
          truncate
        "
      >
        {name}
      </span>
    </span>
  );
});

// =========================================================
// MAIN COMPONENT
// =========================================================

function MyProblemCardContent({
  name = "",
  description = "",
  detailUrl = null,

  tags = EMPTY_ARRAY,

  maxVisibleTags =
    DEFAULT_VISIBLE_TAGS,

  className = "",
}) {
  // =====================================================
  // TITLE
  // =====================================================

  const title =
    normalizeText(
      name,
      "Nomsiz muammo"
    );

  // =====================================================
  // DESCRIPTION
  // =====================================================

  const problemDescription =
    normalizeText(
      description,
      "Muammo tavsifi kiritilmagan."
    );

  // =====================================================
  // TAGS
  // =====================================================

  const normalizedTags = useMemo(
    () => normalizeTags(tags),
    [tags]
  );

  const visibleLimit = Math.max(
    1,
    Math.min(
      6,
      Number(maxVisibleTags) || 3
    )
  );

  const visibleTags =
    normalizedTags.slice(
      0,
      visibleLimit
    );

  const hiddenCount =
    Math.max(
      0,
      normalizedTags.length -
        visibleTags.length
    );

  // =====================================================
  // TITLE STYLE
  // =====================================================

  const titleClass = [
    "block",
    "min-w-0",
    "break-words",
    "[overflow-wrap:anywhere]",
    "text-[15px]",
    "font-extrabold",
    "leading-[22px]",
    "tracking-[-0.02em]",
    "text-slate-900",
    "dark:text-white",
    "sm:text-[16px]",
  ].join(" ");

  // =====================================================
  // TITLE CONTENT
  // =====================================================

  const titleNode = detailUrl ? (
    <Link
      to={detailUrl}
      title={title}
      className="
        group/title
        block rounded-md

        transition-colors

        hover:text-indigo-600

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-indigo-400

        dark:hover:text-cyan-300
      "
    >
      <span>{title}</span>

      <ArrowUpRight
        size={13}
        className="
          ml-1 inline-block
          align-baseline

          text-indigo-500
          opacity-0

          transition-opacity

          group-hover/title:opacity-100
          group-focus-visible/title:opacity-100

          dark:text-cyan-300
        "
        aria-hidden="true"
      />
    </Link>
  ) : (
    title
  );

  // =====================================================
  // JSX
  // =====================================================

  return (
    <div
      className={`
        flex min-w-0 flex-1
        flex-col

        px-4 pb-3 pt-1

        ${className}
      `}
    >
      {/* ======================================
          TITLE
         ====================================== */}

      <h3
        className={`
          ${titleClass}
          line-clamp-2
        `}
      >
        {titleNode}
      </h3>

      {/* ======================================
          DESCRIPTION
         ====================================== */}

      <p
        className="
          mt-2.5

          line-clamp-3
          min-w-0

          break-words
          [overflow-wrap:anywhere]

          text-[12px]
          leading-[19px]

          text-slate-600

          dark:text-slate-400

          sm:text-[12.5px]
        "
      >
        {problemDescription}
      </p>

      {/* ======================================
          TAGS
         ====================================== */}

      {visibleTags.length > 0 && (
        <div
          className="
            mt-auto
            min-w-0
            pt-3
          "
        >
          <div
            className="
              flex min-w-0
              flex-wrap items-center
              gap-1.5
            "
          >
            {visibleTags.map((tag) => (
              <TagBadge
                key={tag.id}
                name={tag.name}
                color={tag.color}
              />
            ))}

            {hiddenCount > 0 && (
              <span
                title={`${hiddenCount} ta qo‘shimcha texnologiya`}
                className="
                  inline-flex
                  min-h-[26px]
                  items-center

                  rounded-lg

                  border border-slate-200
                  bg-slate-100

                  px-2 py-1

                  font-mono
                  text-[10px]
                  font-semibold

                  text-slate-600

                  dark:border-white/[0.10]
                  dark:bg-white/[0.06]
                  dark:text-slate-300
                "
              >
                +{hiddenCount}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(MyProblemCardContent);
