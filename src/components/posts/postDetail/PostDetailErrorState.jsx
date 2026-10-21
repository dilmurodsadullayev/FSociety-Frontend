
import React from "react";

import {
  Link,
} from "react-router-dom";

import {
  AlertTriangle,
  ArrowLeft,
  FileQuestion,
  LockKeyhole,
  RefreshCw,
  ServerCrash,
  WifiOff,
} from "lucide-react";

import PageGridBackground from "../../ui/PageGridBackground";

// =========================================================
// FSOCIETY — POST DETAIL ERROR STATE
// =========================================================
//
// - 404 Not Found
// - 401 Unauthorized
// - 403 Forbidden
// - 5xx Server Error
// - Network Error
// - Generic Error
//
// Light / Dark Mode
// Responsive 320px+
// Human-friendly Uzbek messages
//
// No raw backend exceptions shown to users.
// =========================================================

// =========================================================
// ERROR HELPERS
// =========================================================

const getHttpStatus = (error) => {
  const values = [
    error?.response?.status,
    error?.status,
    error?.statusCode,
    error?.status_code,
  ];

  for (const value of values) {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      continue;
    }

    const number = Number(value);

    if (
      Number.isInteger(number) &&
      number >= 400 &&
      number <= 599
    ) {
      return number;
    }
  }

  return null;
};

const getErrorText = (error) => {
  if (typeof error === "string") {
    return error.toLowerCase().trim();
  }

  const value =
    error?.response?.data?.detail ??
    error?.serverData?.detail ??
    error?.message ??
    "";

  return typeof value === "string"
    ? value.toLowerCase().trim()
    : "";
};

const getErrorKind = (error) => {
  const status = getHttpStatus(error);

  if (status === 404) {
    return "notFound";
  }

  if (status === 403) {
    return "forbidden";
  }

  if (status === 401) {
    return "unauthorized";
  }

  if (status >= 500) {
    return "server";
  }

  const message = getErrorText(error);

  // Django REST Framework commonly returns:
  // "No Post matches the given query."
  // "Not found."

  if (
    /no\s+post\s+matches\s+the\s+given\s+query/i.test(
      message
    ) ||
    /post\s+(not\s+found|does\s+not\s+exist)/i.test(
      message
    ) ||
    /^not\s+found\.?$/i.test(message)
  ) {
    return "notFound";
  }

  if (
    /network error/i.test(message) ||
    /failed to fetch/i.test(message) ||
    /err_network/i.test(message) ||
    /network request failed/i.test(message)
  ) {
    return "network";
  }

  if (
    /authentication credentials/i.test(message) ||
    /not authenticated/i.test(message)
  ) {
    return "unauthorized";
  }

  if (
    /permission denied/i.test(message) ||
    /you do not have permission/i.test(message)
  ) {
    return "forbidden";
  }

  return error ? "generic" : "notFound";
};

// =========================================================
// ERROR DEFINITIONS
// =========================================================

const ERROR_CONFIG = {
  notFound: {
    code: "404",
    label: "POST://NOT_FOUND",
    title: "Post topilmadi",

    description:
      "Siz izlayotgan post mavjud emas " +
      "yoki hozirda ochiq emas. Havola " +
      "noto‘g‘ri bo‘lishi, post o‘chirilgan " +
      "yoki yashirilgan bo‘lishi mumkin.",

    hint:
      "Havolani tekshiring yoki boshqa " +
      "postlarni ko‘rib chiqing.",

    Icon: FileQuestion,
    allowRetry: false,
    tone: "amber",
  },

  unauthorized: {
    code: "401",
    label: "POST://AUTH_REQUIRED",
    title: "Tizimga kirish talab qilinadi",

    description:
      "Ushbu postni ko‘rish uchun " +
      "akkauntingizga kirishingiz kerak " +
      "bo‘lishi mumkin.",

    hint:
      "Akkauntingiz holatini tekshiring.",

    Icon: LockKeyhole,
    allowRetry: true,
    tone: "amber",
  },

  forbidden: {
    code: "403",
    label: "POST://ACCESS_DENIED",
    title: "Kirishga ruxsat yo‘q",

    description:
      "Ushbu postni ko‘rish uchun " +
      "yetarli ruxsatingiz mavjud emas.",

    hint:
      "Boshqa postlarni ko‘rishingiz mumkin.",

    Icon: LockKeyhole,
    allowRetry: false,
    tone: "amber",
  },

  server: {
    code: "5XX",
    label: "POST://SERVER_ERROR",
    title: "Serverda vaqtinchalik muammo",

    description:
      "Post ma’lumotlarini hozir yuklab " +
      "bo‘lmadi. Muammo server tomonida " +
      "bo‘lishi mumkin.",

    hint:
      "Birozdan keyin qayta urinib ko‘ring.",

    Icon: ServerCrash,
    allowRetry: true,
    tone: "red",
  },

  network: {
    code: "NETWORK",
    label: "POST://CONNECTION_ERROR",
    title: "Internet aloqasini tekshiring",

    description:
      "Server bilan bog‘lanib bo‘lmadi. " +
      "Internet aloqangizni tekshiring.",

    hint:
      "Aloqa tiklangach, qayta urinib ko‘ring.",

    Icon: WifiOff,
    allowRetry: true,
    tone: "red",
  },

  generic: {
    code: "ERROR",
    label: "POST://ERROR",
    title: "Postni yuklab bo‘lmadi",

    description:
      "Post ma’lumotlarini olishda " +
      "kutilmagan muammo yuz berdi.",

    hint:
      "Qayta urinib ko‘ring. Muammo " +
      "davom etsa, keyinroq tashrif buyuring.",

    Icon: AlertTriangle,
    allowRetry: true,
    tone: "red",
  },
};

// =========================================================
// TONE STYLES
// =========================================================

const TONE_STYLES = {
  amber: {
    border: `
      border-amber-200
      dark:border-amber-400/20
    `,

    icon: `
      border-amber-200
      bg-amber-50
      text-amber-700

      dark:border-amber-400/20
      dark:bg-amber-400/[0.08]
      dark:text-amber-300
    `,

    badge: `
      border-amber-200
      bg-amber-50
      text-amber-700

      dark:border-amber-400/20
      dark:bg-amber-400/[0.07]
      dark:text-amber-300
    `,

    glow: `
      bg-amber-400/10
      dark:bg-amber-500/[0.07]
    `,
  },

  red: {
    border: `
      border-red-200
      dark:border-red-400/20
    `,

    icon: `
      border-red-200
      bg-red-50
      text-red-700

      dark:border-red-400/20
      dark:bg-red-400/[0.08]
      dark:text-red-300
    `,

    badge: `
      border-red-200
      bg-red-50
      text-red-700

      dark:border-red-400/20
      dark:bg-red-400/[0.07]
      dark:text-red-300
    `,

    glow: `
      bg-red-400/10
      dark:bg-red-500/[0.07]
    `,
  },
};

// =========================================================
// MAIN COMPONENT
// =========================================================

const PostDetailErrorState = ({
  error = null,
  username = "",
  slug = "",

  onRetry,
  isRetrying = false,

  withBackground = true,
}) => {
  const kind = getErrorKind(error);

  const config =
    ERROR_CONFIG[kind] ??
    ERROR_CONFIG.generic;

  const styles =
    TONE_STYLES[config.tone] ??
    TONE_STYLES.red;

  const Icon = config.Icon;

  const canRetry =
    config.allowRetry &&
    typeof onRetry === "function";

  const retrying = Boolean(isRetrying);

  const handleRetry = () => {
    if (!canRetry || retrying) {
      return;
    }

    onRetry();
  };

  const postPath = [
    username ? `@${username}` : null,
    slug || null,
  ].filter(Boolean).join(" / ");

  return (
    <div
      className="
        relative
        isolate
        flex
        min-h-screen
        min-h-[100dvh]
        w-full
        min-w-0
        items-center
        justify-center
        overflow-hidden
        bg-[#f7faff]
        px-3
        pb-16
        pt-28
        font-sans

        sm:px-6

        dark:bg-[#050a14]
      "
    >
      {withBackground && (
        <PageGridBackground
          showMonogram
          showCubes
        />
      )}

      {/* BACKGROUND GLOW */}

      <div
        aria-hidden="true"
        className={`
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-64
          w-64
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          blur-[85px]

          sm:h-96
          sm:w-96

          ${styles.glow}
        `}
      />

      {/* ERROR CARD */}

      <main
        role="alert"
        aria-labelledby="post-error-title"
        aria-describedby="post-error-description"
        className={`
          relative
          z-10
          w-full
          min-w-0
          max-w-xl
          overflow-hidden
          rounded-[24px]
          border
          bg-white/95
          p-5
          text-center
          text-slate-900
          shadow-[0_25px_80px_rgba(15,23,42,0.10)]
          backdrop-blur-xl

          sm:rounded-[30px]
          sm:p-9

          dark:bg-[#0b1018]/95
          dark:text-white
          dark:shadow-[0_35px_100px_rgba(0,0,0,0.4)]

          ${styles.border}
        `}
      >
        {/* TOP ACCENT */}

        <div
          aria-hidden="true"
          className="
            absolute
            inset-x-0
            top-0
            h-[2px]
            bg-gradient-to-r
            from-transparent
            via-indigo-500/65
            to-transparent

            dark:via-indigo-400/50
          "
        />

        {/* ICON */}

        <div
          className={`
            mx-auto
            grid
            h-[72px]
            w-[72px]
            place-items-center
            rounded-2xl
            border

            ${styles.icon}
          `}
        >
          <Icon
            size={30}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </div>

        {/* BADGE */}

        <div
          className={`
            mt-5
            inline-flex
            max-w-full
            items-center
            gap-2
            rounded-full
            border
            px-3
            py-1.5
            font-mono
            text-[10px]
            font-bold
            uppercase
            tracking-[0.1em]

            ${styles.badge}
          `}
        >
          <span
            aria-hidden="true"
            className="
              h-1.5
              w-1.5
              shrink-0
              rounded-full
              bg-current
            "
          />

          <span className="break-all">
            {config.label}
          </span>
        </div>

        {/* TITLE */}

        <h1
          id="post-error-title"
          className="
            mt-5
            break-words
            text-[clamp(1.5rem,5vw,2rem)]
            font-black
            leading-tight
            tracking-tight
            text-slate-900

            dark:text-white
          "
        >
          {config.title}
        </h1>

        {/* POST PATH */}

        {postPath && (
          <p
            className="
              mt-3
              break-all
              font-mono
              text-[11px]
              font-medium
              text-slate-500

              dark:text-slate-400
            "
          >
            {postPath}
          </p>
        )}

        {/* DESCRIPTION */}

        <p
          id="post-error-description"
          className="
            mx-auto
            mt-5
            max-w-md
            break-words
            text-sm
            font-medium
            leading-7
            text-slate-600

            dark:text-slate-300
          "
        >
          {config.description}
        </p>

        {/* GUIDANCE */}

        <div
          className="
            mt-6
            rounded-2xl
            border
            border-slate-200
            bg-slate-50/85
            p-4
            text-left

            dark:border-white/[0.08]
            dark:bg-white/[0.035]
          "
        >
          <div
            className="
              flex
              items-start
              gap-3
            "
          >
            <FileQuestion
              size={18}
              className="
                mt-0.5
                shrink-0
                text-indigo-600

                dark:text-indigo-300
              "
              aria-hidden="true"
            />

            <p
              className="
                min-w-0
                break-words
                text-xs
                font-medium
                leading-6
                text-slate-600

                dark:text-slate-300
              "
            >
              {config.hint}
            </p>
          </div>
        </div>

        {/* ACTIONS */}

        <div
          className="
            mt-7
            flex
            flex-col
            gap-3

            sm:flex-row
            sm:justify-center
          "
        >
          <Link
            to="/"
            className="
              inline-flex
              min-h-11
              min-w-0
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-indigo-600
              bg-indigo-600
              px-5
              py-3
              text-xs
              font-black
              text-white
              transition-colors

              hover:bg-indigo-700

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-indigo-500
              focus-visible:ring-offset-2

              dark:border-indigo-400/25
              dark:bg-indigo-500/25
              dark:text-indigo-100
              dark:hover:bg-indigo-500/35
            "
          >
            <ArrowLeft
              size={16}
              aria-hidden="true"
            />

            Bosh sahifaga qaytish
          </Link>

          {canRetry && (
            <button
              type="button"
              onClick={handleRetry}
              disabled={retrying}
              aria-busy={retrying}
              className="
                inline-flex
                min-h-11
                min-w-0
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                px-5
                py-3
                text-xs
                font-black
                text-slate-700
                transition-colors

                hover:border-indigo-200
                hover:bg-indigo-50

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500
                focus-visible:ring-offset-2

                disabled:cursor-not-allowed
                disabled:opacity-50

                dark:border-white/[0.10]
                dark:bg-white/[0.04]
                dark:text-slate-300
                dark:hover:bg-white/[0.08]
              "
            >
              <RefreshCw
                size={16}
                className={
                  retrying
                    ? "motion-safe:animate-spin"
                    : ""
                }
                aria-hidden="true"
              />

              {retrying
                ? "Yuklanmoqda..."
                : "Qayta urinish"}
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default React.memo(PostDetailErrorState);
