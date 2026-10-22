
import React, {
  memo,
  useMemo,
} from "react";

import MyProblemCardHeader from "./card/MyProblemCardHeader";

import MyProblemCardContent from "./card/MyProblemCardContent";

import MyProblemCardDeadline from "./card/MyProblemCardDeadline";

import MyProblemCardStats from "./card/MyProblemCardStats";

import {
  getProblemStatusMeta,
  normalizeProblemText,
} from "./card/myProblemCardHelpers";

// =========================================================
// FSOCIETY — MY PROBLEM CARD
// =========================================================
//
// Header:
// - User
// - Created at (Uzbek date)
// - Status
// - Urgent badge
//
// Content:
// - Title
// - Description
// - Languages
// - Technologies
//
// Deadline (urgent problems only):
// - Live countdown
// - Deadline date and time
//
// Stats:
// - Views
// - Responses
// - Stars
// - FCoin
//
// =========================================================

const EMPTY_ARRAY = [];

// =========================================================
// HELPERS
// =========================================================

const isObject = (value) =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value);

const hasValidId = (value) =>
  value !== null &&
  value !== undefined &&
  value !== "";

const toBoolean = (value) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  if (typeof value === "string") {
    return ["true", "1", "yes"].includes(
      value.trim().toLowerCase()
    );
  }

  return false;
};

// =========================================================
// ARRAY HELPERS
// =========================================================

const getFirstAvailableArray = (...values) => {
  let fallback = EMPTY_ARRAY;

  for (const value of values) {
    if (!Array.isArray(value)) {
      continue;
    }

    if (value.length > 0) {
      return value;
    }

    fallback = value;
  }

  return fallback;
};

// =========================================================
// TAG HELPERS
// =========================================================

const getTagName = (item) => {
  if (typeof item === "string") {
    return item.trim();
  }

  if (!isObject(item)) {
    return "";
  }

  const value =
    item.name ??
    item.title ??
    item.label ??
    item.language?.name ??
    item.technology?.name ??
    item.language_name ??
    item.technology_name ??
    "";

  return typeof value === "string"
    ? value.trim()
    : "";
};

const getTagColor = (item) => {
  if (!isObject(item)) {
    return null;
  }

  const color =
    item.color ??
    item.language?.color ??
    item.technology?.color ??
    null;

  return typeof color === "string" &&
    /^#[0-9a-fA-F]{6}$/.test(color)
    ? color
    : null;
};

const mergeProblemTags = (
  languages,
  technologies
) => {
  const combined = [
    ...(Array.isArray(languages)
      ? languages
      : []),

    ...(Array.isArray(technologies)
      ? technologies
      : []),
  ];

  const seen = new Set();

  return combined.reduce(
    (result, item) => {
      const name = getTagName(item);

      if (!name) {
        return result;
      }

      const key = name.toLowerCase();

      if (seen.has(key)) {
        return result;
      }

      seen.add(key);

      result.push({
        id: key,
        name,
        color: getTagColor(item),
      });

      return result;
    },
    []
  );
};

// =========================================================
// COMPONENT
// =========================================================

function MyProblemCard({
  problem = null,

  id = null,

  username = "",
  firstName = "",
  lastName = "",
  image = null,

  name = "",
  description = "",

  status = false,
  isSolved,

  views = 0,
  star = 0,
  responseCount = 0,

  languages = EMPTY_ARRAY,
  technologies = EMPTY_ARRAY,

  createdAt = null,

  deadline = null,
  isUrgent = false,

  offeredCoins = 0,

  detailUrl = null,
  profileUrl = null,

  className = "",
}) {
  // =====================================================
  // BACKEND OBJECT
  // =====================================================

  const data = isObject(problem)
    ? problem
    : null;

  const user = isObject(data?.user)
    ? data.user
    : null;

  // =====================================================
  // ID
  // =====================================================

  const problemId =
    data?.id ?? id;

  // =====================================================
  // AUTHOR
  // =====================================================

  const authorUsername =
    normalizeProblemText(
      user?.username ?? username
    );

  const authorFirstName =
    user?.first_name ?? firstName;

  const authorLastName =
    user?.last_name ?? lastName;

  const authorImage =
    user?.image ?? image;

  // =====================================================
  // PROBLEM CONTENT
  // =====================================================

  const problemTitle =
    normalizeProblemText(
      data?.problem ??
      data?.title ??
      name,
      "Nomsiz muammo"
    );

  const problemDescription =
    normalizeProblemText(
      data?.description ??
      description
    );

  // =====================================================
  // STATUS
  // =====================================================

  const resolvedStatus =
    data?.status ??
    data?.is_solved ??
    status;

  const resolvedIsSolved =
    data?.is_solved ??
    isSolved ??
    (
      typeof resolvedStatus === "boolean"
        ? resolvedStatus
        : false
    );

  const statusMeta = useMemo(
    () =>
      getProblemStatusMeta({
        status: resolvedStatus,
        isSolved: toBoolean(
          resolvedIsSolved
        ),
      }),
    [
      resolvedStatus,
      resolvedIsSolved,
    ]
  );

  const solved =
    statusMeta.key === "solved";

  // =====================================================
  // URGENT
  // =====================================================

  const urgent = toBoolean(
    data?.is_urgent ??
    isUrgent
  );

  // =====================================================
  // DATES
  // =====================================================

  const resolvedCreatedAt =
    data?.created_at ??
    createdAt;

  const resolvedDeadline =
    data?.deadline ??
    deadline;

  const hasDeadline =
    resolvedDeadline !== null &&
    resolvedDeadline !== undefined &&
    resolvedDeadline !== "";

  // =====================================================
  // LANGUAGES
  // =====================================================

  const resolvedLanguages = useMemo(
    () =>
      getFirstAvailableArray(
        data?.languages_data,
        data?.language_data,
        data?.languages,
        data?.language,
        languages
      ),
    [data, languages]
  );

  // =====================================================
  // TECHNOLOGIES
  // =====================================================

  const resolvedTechnologies = useMemo(
    () =>
      getFirstAvailableArray(
        data?.technologies_data,
        data?.technology_data,
        data?.technologies,
        data?.technology,
        technologies
      ),
    [data, technologies]
  );

  // =====================================================
  // TAGS
  // =====================================================

  const tags = useMemo(
    () =>
      mergeProblemTags(
        resolvedLanguages,
        resolvedTechnologies
      ),
    [
      resolvedLanguages,
      resolvedTechnologies,
    ]
  );

  // =====================================================
  // STATS
  // =====================================================

  const resolvedViews =
    data?.total_views ??
    data?.views_count ??
    data?.views ??
    views;

  const resolvedResponses =
    data?.response_count ??
    data?.total_responses ??
    data?.responses_count ??
    responseCount;

  const resolvedStars =
    data?.star ??
    data?.total_stars ??
    data?.stars_count ??
    star;

  const resolvedCoins =
    data?.offered_coins ??
    offeredCoins;

  // =====================================================
  // ROUTES
  // =====================================================

  const resolvedDetailUrl =
    detailUrl ||
    (
      hasValidId(problemId)
        ? `/problem/${encodeURIComponent(
            String(problemId)
          )}/detail`
        : null
    );

  const resolvedProfileUrl =
    profileUrl ||
    (
      authorUsername
        ? `/${encodeURIComponent(
            authorUsername
          )}/profile`
        : null
    );

  // =====================================================
  // ACCENT
  // =====================================================

  const accentClass = solved
    ? "from-emerald-400 via-teal-400 to-cyan-400"
    : urgent
      ? "from-orange-400 via-amber-400 to-rose-400"
      : statusMeta.key === "rejected"
        ? "from-rose-400 via-red-400 to-orange-400"
        : "from-blue-500 via-indigo-500 to-cyan-400";

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <article
      aria-label={`Muammo: ${problemTitle}`}
      data-problem-id={
        hasValidId(problemId)
          ? String(problemId)
          : undefined
      }
      className={`
        group/card relative isolate

        flex h-full
        min-h-[280px]
        min-w-0 max-w-full

        flex-col overflow-hidden

        rounded-[20px]
        border border-slate-200/90

        bg-white/95
        font-sans text-slate-900

        shadow-[0_8px_25px_rgba(15,23,42,0.045)]

        transition-[transform,box-shadow,border-color]
        duration-300

        hover:-translate-y-1
        hover:border-indigo-300/90
        hover:shadow-[0_16px_34px_rgba(59,130,246,0.12)]

        focus-within:border-indigo-400

        dark:border-white/[0.10]
        dark:bg-[#091528]/95
        dark:text-white

        dark:shadow-[0_12px_30px_rgba(0,0,0,0.20)]

        dark:hover:border-cyan-400/35
        dark:hover:shadow-[0_16px_36px_rgba(6,182,212,0.12)]

        sm:rounded-[22px]

        motion-reduce:transform-none
        motion-reduce:transition-none

        ${className}
      `}
    >
      {/* TOP ACCENT */}

      <div
        aria-hidden="true"
        className={`
          h-[2px] w-full shrink-0
          bg-gradient-to-r
          ${accentClass}
        `}
      />

      {/* SUBTLE GLOW */}

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
            absolute -right-16 -top-20
            h-44 w-44 rounded-full
            bg-indigo-500/[0.035]
            blur-[70px]

            dark:bg-cyan-400/[0.055]
          "
        />
      </div>

      {/* CARD BODY */}

      <div
        className="
          relative z-10
          flex min-h-[278px]
          min-w-0 flex-1
          flex-col
        "
      >
        {/* HEADER */}

        <MyProblemCardHeader
          user={user}
          username={authorUsername}
          firstName={authorFirstName}
          lastName={authorLastName}
          image={authorImage}
          createdAt={resolvedCreatedAt}

          status={resolvedStatus}
          isSolved={solved}
          statusKey={statusMeta.key}
          statusLabel={statusMeta.label}

          isUrgent={urgent}
          profileUrl={resolvedProfileUrl}
        />

        {/* CONTENT */}

        <MyProblemCardContent
          name={problemTitle}
          description={problemDescription}
          detailUrl={resolvedDetailUrl}
          tags={tags}
          maxVisibleTags={3}
        />

        {/* LIVE DEADLINE
            Only urgent problems with a deadline.
        */}

        {urgent && hasDeadline && (
          <MyProblemCardDeadline
            deadline={resolvedDeadline}
            isSolved={solved}
          />
        )}

        {/* STATISTICS */}

        <MyProblemCardStats
          views={resolvedViews}
          responseCount={resolvedResponses}
          star={resolvedStars}
          offeredCoins={resolvedCoins}
        />
      </div>
    </article>
  );
}

export default memo(MyProblemCard);
