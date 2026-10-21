
import {
  BriefcaseBusiness,
  CircleHelp,
  Cpu,
  Dumbbell,
  Gamepad2,
  Layers3,
} from "lucide-react";

// =========================================================
// FSOCIETY — POST DETAIL HELPERS
// =========================================================
//
// Shared pure helpers for Post Detail.
//
// - Safe number handling
// - Plain-text extraction
// - Article reading statistics
// - Post category presentation
// - Author name
// - API error messages
// - HTTP error status
//
// No React hooks, Redux or API calls.
// =========================================================

// =========================================================
// SAFE NUMBER
// =========================================================

export const safeNumber = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return 0;
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.max(0, number);
};

// =========================================================
// TEXT NORMALIZATION
// =========================================================

export const cleanPostText = (
  value,
  fallback = ""
) => {
  if (typeof value !== "string") {
    return fallback;
  }

  const text = value.trim();

  return text || fallback;
};

// =========================================================
// HTML ENTITY DECODING
// =========================================================

const NAMED_ENTITIES = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
  "&#039;": "'",
  "&#39;": "'",
};

const decodeHtmlEntities = (value) => {
  return String(value)
    .replace(
      /&(?:nbsp|amp|lt|gt|quot|apos|#039|#39);/gi,
      (match) =>
        NAMED_ENTITIES[
          match.toLowerCase()
        ] ?? match
    )
    .replace(
      /&#(\d+);|&#x([0-9a-f]+);/gi,
      (match, decimal, hex) => {
        const code = decimal
          ? parseInt(decimal, 10)
          : parseInt(hex, 16);

        if (
          !Number.isInteger(code) ||
          code < 0 ||
          code > 0x10ffff ||
          (code >= 0xd800 && code <= 0xdfff)
        ) {
          return " ";
        }

        return String.fromCodePoint(code);
      }
    );
};

// =========================================================
// STRIP HTML
// =========================================================

// IMPORTANT:
// This function is for plain-text statistics,
// previews and reading time calculation.
//
// It is NOT an HTML sanitizer.
// Do not use it to make dangerouslySetInnerHTML
// safe. Rich article HTML needs separate
// sanitization before being rendered.

export const stripHtml = (html = "") => {
  if (
    html === null ||
    html === undefined
  ) {
    return "";
  }

  const text = String(html)
    .replace(
      /<(script|style|noscript)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,
      " "
    )
    .replace(
      /<!--[\s\S]*?-->/g,
      " "
    )
    .replace(
      /<\/(?:p|div|li|h[1-6]|blockquote|pre|tr)>/gi,
      " "
    )
    .replace(
      /<br\s*\/?>/gi,
      " "
    )
    .replace(
      /<[^>]+>/g,
      " "
    );

  return decodeHtmlEntities(text)
    .replace(/\s+/g, " ")
    .trim();
};

// =========================================================
// ARTICLE STATISTICS
// =========================================================

export const getArticleMeta = (
  content,
  wordsPerMinute = 200
) => {
  const plainText = stripHtml(content);

  const words = plainText
    ? plainText
        .split(/\s+/)
        .filter(Boolean)
        .length
    : 0;

  const speed =
    Number.isFinite(Number(wordsPerMinute)) &&
    Number(wordsPerMinute) > 0
      ? Number(wordsPerMinute)
      : 200;

  return {
    words,
    readingTime: Math.max(
      1,
      Math.ceil(words / speed)
    ),
  };
};

// =========================================================
// POST TYPES
// =========================================================

// Keep backend post_type values unchanged.
//
// The legacy Font Awesome icon name is
// preserved under "icon" for compatibility.
//
// New components should use "Icon",
// which points to a Lucide React component.

const POST_TYPES = {
  TEX: {
    name: "Texnologiya",
    icon: "fa-solid fa-microchip",
    Icon: Cpu,

    className: `
      border-indigo-200
      bg-indigo-50
      text-indigo-700

      dark:border-indigo-400/25
      dark:bg-indigo-500/10
      dark:text-indigo-300
    `,
  },

  SPO: {
    name: "Sport",
    icon: "fa-solid fa-dumbbell",
    Icon: Dumbbell,

    className: `
      border-emerald-200
      bg-emerald-50
      text-emerald-700

      dark:border-emerald-400/25
      dark:bg-emerald-500/10
      dark:text-emerald-300
    `,
  },

  BIZ: {
    name: "Biznes",
    icon: "fa-solid fa-briefcase",
    Icon: BriefcaseBusiness,

    className: `
      border-amber-200
      bg-amber-50
      text-amber-800

      dark:border-amber-400/25
      dark:bg-amber-500/10
      dark:text-amber-300
    `,
  },

  ENT: {
    name: "O‘yin-kulgi",
    icon: "fa-solid fa-gamepad",
    Icon: Gamepad2,

    className: `
      border-pink-200
      bg-pink-50
      text-pink-700

      dark:border-pink-400/25
      dark:bg-pink-500/10
      dark:text-pink-300
    `,
  },

  OTH: {
    name: "Boshqa",
    icon: "fa-solid fa-layer-group",
    Icon: Layers3,

    className: `
      border-slate-200
      bg-slate-100
      text-slate-700

      dark:border-slate-400/20
      dark:bg-slate-500/10
      dark:text-slate-300
    `,
  },
};

const UNKNOWN_POST_TYPE = {
  name: "Noma’lum",
  icon: "fa-solid fa-circle-question",
  Icon: CircleHelp,

  className: `
    border-slate-200
    bg-slate-100
    text-slate-600

    dark:border-slate-500/20
    dark:bg-slate-500/10
    dark:text-slate-400
  `,
};

// =========================================================
// GET POST TYPE DISPLAY
// =========================================================

export const getPostTypeDisplay = (
  typeKey
) => {
  if (
    typeKey === null ||
    typeKey === undefined
  ) {
    return UNKNOWN_POST_TYPE;
  }

  const key = String(typeKey)
    .trim()
    .toUpperCase();

  return (
    POST_TYPES[key] ??
    UNKNOWN_POST_TYPE
  );
};

// =========================================================
// AUTHOR NAME
// =========================================================

export const getAuthorName = (
  author
) => {
  if (
    !author ||
    typeof author !== "object"
  ) {
    return "Anonim foydalanuvchi";
  }

  const firstName = cleanPostText(
    author.first_name
  );

  const lastName = cleanPostText(
    author.last_name
  );

  const fullName = [
    firstName,
    lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    fullName ||
    cleanPostText(author.username) ||
    "Anonim foydalanuvchi"
  );
};

// =========================================================
// HTTP ERROR STATUS
// =========================================================

export const getPostHttpStatus = (
  error
) => {
  const values = [
    error?.response?.status,
    error?.status,
    error?.statusCode,
    error?.status_code,
    error?.serverData?.status,
  ];

  for (const value of values) {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      continue;
    }

    const status = Number(value);

    if (
      Number.isInteger(status) &&
      status >= 400 &&
      status <= 599
    ) {
      return status;
    }
  }

  return null;
};

// =========================================================
// ERROR MESSAGE
// =========================================================

const getStringMessage = (value) => {
  if (typeof value === "string") {
    return value.trim();
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const message =
        getStringMessage(item);

      if (message) {
        return message;
      }
    }
  }

  return "";
};

export const getErrorMessage = (
  error,
  fallback = "Xatolik yuz berdi."
) => {
  const data =
    error?.serverData ??
    error?.response?.data;

  const candidates = [
    typeof data === "string"
      ? data
      : null,

    data?.detail,
    data?.message,
    data?.error,
  ];

  for (const candidate of candidates) {
    const message =
      getStringMessage(candidate);

    if (message) {
      return message;
    }
  }

  if (
    data &&
    typeof data === "object" &&
    !Array.isArray(data)
  ) {
    for (const value of Object.values(data)) {
      const message =
        getStringMessage(value);

      if (message) {
        return message;
      }
    }
  }

  if (typeof error?.message === "string") {
    const rawMessage =
      error.message.trim();

    if (rawMessage) {
      try {
        const parsed =
          JSON.parse(rawMessage);

        const parsedMessage =
          getStringMessage(
            parsed?.detail ??
            parsed?.message ??
            parsed?.error
          );

        if (parsedMessage) {
          return parsedMessage;
        }
      } catch {
        // Not JSON. Use the original message.
      }

      return rawMessage;
    }
  }

  return fallback;
};
