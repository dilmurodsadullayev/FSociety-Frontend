
/**
 * FSOCIETY — MY PROBLEM CARD HELPERS
 *
 * Location:
 * src/components/my-problems/card/myProblemCardHelpers.js
 *
 * Shared utilities:
 * - Status
 * - Deadline
 * - Urgency
 * - Counts
 * - Date formatting
 * - Author display name
 * - Programming languages
 *
 * No React, Redux or API dependencies.
 */

// =========================================================
// GENERAL HELPERS
// =========================================================

export const normalizeProblemCount = (
  value,
  fallback = 0
) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? Math.max(0, Math.trunc(number))
    : fallback;
};

export const formatProblemCount = (value) =>
  normalizeProblemCount(value).toLocaleString("uz-UZ");

export const normalizeProblemText = (
  value,
  fallback = ""
) => {
  if (typeof value !== "string") {
    return fallback;
  }

  return value.trim() || fallback;
};

// =========================================================
// USER DISPLAY NAME
// =========================================================

export const getProblemDisplayName = ({
  firstName,
  lastName,
  username,
} = {}) => {
  const fullName = [
    normalizeProblemText(firstName),
    normalizeProblemText(lastName),
  ]
    .filter(Boolean)
    .join(" ");

  return (
    fullName ||
    normalizeProblemText(username) ||
    "Foydalanuvchi"
  );
};

export const getProblemInitials = (
  displayName
) => {
  const parts = String(displayName ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 1)
      .toUpperCase();
  }

  return (
    parts[0].slice(0, 1) +
    parts[parts.length - 1].slice(0, 1)
  ).toUpperCase();
};

// =========================================================
// DATE PARSER
// =========================================================

export const parseProblemDate = (
  value,
  { endOfDay = false } = {}
) => {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? null
      : new Date(value.getTime());
  }

  if (typeof value !== "string") {
    return null;
  }

  const text = value.trim();

  if (!text) {
    return null;
  }

  // Date-only deadline is valid until the
  // end of that calendar day in the browser's
  // local timezone.
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/;

  const match = text.match(dateOnly);

  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    const date = endOfDay
      ? new Date(year, month - 1, day, 23, 59, 59, 999)
      : new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;
  }

  const parsed = new Date(text);

  return Number.isNaN(parsed.getTime())
    ? null
    : parsed;
};

// =========================================================
// DATE FORMAT
// =========================================================

export const formatProblemDate = (
  value,
  {
    includeTime = false,
    fallback = "Sana noma’lum",
  } = {}
) => {
  const date = parseProblemDate(value);

  if (!date) {
    return fallback;
  }

  try {
    return new Intl.DateTimeFormat("uz-UZ", {
      day: "numeric",
      month: "short",
      year: "numeric",
      ...(includeTime
        ? {
            hour: "2-digit",
            minute: "2-digit",
          }
        : {}),
    }).format(date);
  } catch {
    return date.toLocaleDateString();
  }
};

// =========================================================
// PROBLEM STATUS
// =========================================================

export const getProblemStatusMeta = ({
  status,
  isSolved,
} = {}) => {
  const statusText =
    typeof status === "string"
      ? status.trim().toLowerCase()
      : "";

  const solved =
    isSolved === true ||
    status === true ||
    [
      "solved",
      "resolved",
      "completed",
    ].includes(statusText);

  if (solved) {
    return {
      key: "solved",
      label: "Yechilgan",
      description: "Muammo yechimi topilgan",
    };
  }

  if (
    ["rejected", "declined"].includes(
      statusText
    )
  ) {
    return {
      key: "rejected",
      label: "Rad etilgan",
      description: "Muammo rad etilgan",
    };
  }

  if (
    ["pending", "review"].includes(
      statusText
    )
  ) {
    return {
      key: "pending",
      label: "Ko‘rib chiqilmoqda",
      description: "Muammo ko‘rib chiqilmoqda",
    };
  }

  return {
    key: "open",
    label: "Yechilmagan",
    description: "Muammo uchun yechim kutilmoqda",
  };
};

// =========================================================
// URGENT STATUS
// =========================================================

export const getProblemPriorityMeta = (
  isUrgent
) => {
  if (isUrgent === true) {
    return {
      key: "urgent",
      label: "Shoshilinch",
    };
  }

  return {
    key: "normal",
    label: "Oddiy",
  };
};

// =========================================================
// DEADLINE INFORMATION
// =========================================================

export const getProblemDeadlineMeta = (
  deadline,
  {
    isSolved = false,
    now = new Date(),
  } = {}
) => {
  const parsed = parseProblemDate(deadline, {
    endOfDay: true,
  });

  if (!parsed) {
    return null;
  }

  const currentDate =
    now instanceof Date &&
    !Number.isNaN(now.getTime())
      ? now
      : new Date();

  const dayNumber = (date) =>
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ) / 86400000;

  const daysLeft =
    dayNumber(parsed) -
    dayNumber(currentDate);

  const expired =
    !isSolved &&
    parsed.getTime() <
      currentDate.getTime();

  let label = formatProblemDate(deadline);

  if (isSolved) {
    label = `Muddat: ${label}`;
  } else if (expired) {
    label = "Muddati o‘tgan";
  } else if (daysLeft === 0) {
    label = "Bugun";
  } else if (daysLeft === 1) {
    label = "Ertaga";
  }

  return {
    label,
    exactDate: formatProblemDate(deadline, {
      includeTime:
        typeof deadline === "string" &&
        deadline.includes(":"),
    }),
    isExpired: expired,
    isToday: !expired && daysLeft === 0,
    daysLeft,
  };
};

// =========================================================
// LANGUAGE NORMALIZATION
// =========================================================

export const getProblemLanguageTags = (
  languages
) => {
  if (!Array.isArray(languages)) {
    return [];
  }

  const unique = new Set();

  return languages.reduce((result, item) => {
    let label = "";

    if (typeof item === "string") {
      label = item.trim();
    } else if (
      item &&
      typeof item === "object"
    ) {
      const raw =
        item.name ??
        item.title ??
        item.language?.name ??
        item.language_name ??
        "";

      if (typeof raw === "string") {
        label = raw.trim();
      }
    }

    if (!label) {
      return result;
    }

    const normalized = label.toLowerCase();

    if (unique.has(normalized)) {
      return result;
    }

    unique.add(normalized);
    result.push(label);

    return result;
  }, []);
};
