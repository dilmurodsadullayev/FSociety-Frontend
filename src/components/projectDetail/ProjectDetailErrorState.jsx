
import React, { memo, useId } from "react";
import { Link } from "react-router-dom";

import {
  AlertTriangle,
  ArrowLeft,
  FileQuestion,
  Loader2,
  LockKeyhole,
  RefreshCw,
  SearchX,
  ServerCrash,
  WifiOff,
} from "lucide-react";

import {
  getErrorMessage,
} from "./projectDetailHelpers";

// =========================================================
// FSOCIETY — PROJECT DETAIL ERROR STATE
// =========================================================
//
// Supported states:
// - 404: Project not found
// - 403: Permission denied
// - 401: Authentication required
// - 5xx: Server error
// - Network error
// - Invalid project ID
// - Generic API error
//
// Features:
// - Human-friendly Uzbek messages
// - No raw backend exception in UI
// - Light / Dark Mode
// - Responsive 320px+
// - Retry for recoverable errors
// - Back to Projects navigation
// - Existing page background preserved
// - Accessible status and buttons
//
// Existing public props are preserved.
// =========================================================

// =========================================================
// ERROR CLASSIFICATION
// =========================================================

const getHttpStatus = (error) => {
  const candidates = [
    error?.response?.status,
    error?.status,
    error?.statusCode,
    error?.status_code,
    error?.serverData?.status,
    error?.response?.data?.status,
  ];

  for (const candidate of candidates) {
    if (
      candidate === null ||
      candidate === undefined ||
      candidate === ""
    ) {
      continue;
    }

    const status = Number(candidate);

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

const getErrorKind = (error, projectId) => {
  if (
    projectId === null ||
    projectId === undefined ||
    String(projectId).trim() === ""
  ) {
    return "invalid";
  }

  if (!error) {
    return "notFound";
  }

  const status = getHttpStatus(error);

  // Prefer the actual HTTP status when
  // it is available.

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

  const rawMessage = getErrorMessage(
    error,
    ""
  );

  const message = String(
    rawMessage || ""
  ).trim().toLowerCase();

  // =====================================
  // INVALID ID
  // =====================================

  if (
    /loyiha id.*(ko.rsatilmagan|noto.g.ri)/i.test(
      message
    )
  ) {
    return "invalid";
  }

  // =====================================
  // DRF / DJANGO NOT FOUND
  //
  // The current controller converts
  // API errors into message strings.
  //
  // Handle the existing DRF message:
  // "No Project matches the given query."
  // =====================================

  if (
    /no\s+project\s+matches\s+the\s+given\s+query/i.test(
      message
    ) ||
    /\bproject\s+(not found|does not exist)\b/i.test(
      message
    ) ||
    /^not found\.?$/i.test(message) ||
    /^404(?:\s|:|-|$)/i.test(message) ||
    /^loyiha topilmadi[.!]?$/i.test(message)
  ) {
    return "notFound";
  }

  // =====================================
  // NETWORK
  // =====================================

  if (
    /network error/i.test(message) ||
    /failed to fetch/i.test(message) ||
    /network request failed/i.test(message) ||
    /internet aloqasi/i.test(message) ||
    /err_network/i.test(message) ||
    /econnrefused/i.test(message)
  ) {
    return "network";
  }

  // =====================================
  // AUTH / PERMISSION FALLBACK
  // =====================================

  if (
    /authentication credentials were not provided/i.test(
      message
    ) ||
    /not authenticated/i.test(message)
  ) {
    return "unauthorized";
  }

  if (
    /^permission denied/i.test(message) ||
    /you do not have permission/i.test(
      message
    )
  ) {
    return "forbidden";
  }

  return "generic";
};

// =========================================================
// USER-FRIENDLY ERROR DEFINITIONS
// =========================================================

const ERROR_CONFIG = {
  notFound: {
    code: "404",
    label: "PROJECT://NOT_FOUND",

    title: "Loyiha topilmadi",

    description:
      "Siz izlayotgan loyiha topilmadi. " +
      "Havola noto‘g‘ri bo‘lishi, loyiha " +
      "o‘chirilgan yoki sizga ko‘rinmaydigan " +
      "bo‘lishi mumkin.",

    hint:
      "Havoladagi loyiha ID sini tekshiring " +
      "yoki mavjud loyihalarni ko‘rib chiqing.",

    Icon: SearchX,
    allowRetry: false,
    tone: "amber",
  },

  invalid: {
    code: "400",
    label: "PROJECT://INVALID_ID",

    title: "Loyiha manzili noto‘g‘ri",

    description:
      "Loyihani ochish uchun to‘g‘ri " +
      "manzil yoki loyiha ID si kerak.",

    hint:
      "Loyihalar sahifasidan kerakli " +
      "loyihani qayta tanlang.",

    Icon: FileQuestion,
    allowRetry: false,
    tone: "amber",
  },

  forbidden: {
    code: "403",
    label: "PROJECT://ACCESS_DENIED",

    title: "Kirishga ruxsat yo‘q",

    description:
      "Sizda ushbu loyihani ko‘rish " +
      "uchun yetarli ruxsat mavjud emas.",

    hint:
      "Loyiha egasiga murojaat qilishingiz " +
      "yoki boshqa loyihalarni ko‘rishingiz mumkin.",

    Icon: LockKeyhole,
    allowRetry: false,
    tone: "amber",
  },

  unauthorized: {
    code: "401",
    label: "PROJECT://AUTH_REQUIRED",

    title: "Tizimga kirish talab qilinadi",

    description:
      "Ushbu loyiha ma’lumotlarini " +
      "ko‘rish uchun akkauntingizga " +
      "qayta kirishingiz kerak bo‘lishi mumkin.",

    hint:
      "Akkauntingiz holatini tekshiring " +
      "va qayta urinib ko‘ring.",

    Icon: LockKeyhole,
    allowRetry: true,
    tone: "amber",
  },

  network: {
    code: "NETWORK",
    label: "PROJECT://CONNECTION_ERROR",

    title: "Aloqa bilan muammo yuz berdi",

    description:
      "Server bilan bog‘lanib bo‘lmadi. " +
      "Internet aloqangizni tekshiring.",

    hint:
      "Internet ishlayotganiga ishonch hosil " +
      "qiling va qayta urinib ko‘ring.",

    Icon: WifiOff,
    allowRetry: true,
    tone: "red",
  },

  server: {
    code: "5XX",
    label: "PROJECT://SERVER_ERROR",

    title: "Serverda vaqtinchalik muammo",

    description:
      "Loyiha ma’lumotlarini hozir " +
      "yuklab bo‘lmadi. Muammo server " +
      "tomonida bo‘lishi mumkin.",

    hint:
      "Birozdan keyin qayta urinib ko‘ring.",

    Icon: ServerCrash,
    allowRetry: true,
    tone: "red",
  },

  generic: {
    code: "ERROR",
    label: "PROJECT://ERROR",

    title: "Loyihani yuklab bo‘lmadi",

    description:
      "Loyiha ma’lumotlarini olishda " +
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
    panel: `
      border-amber-200/90
      dark:border-amber-400/20
    `,

    accent: `
      via-amber-500/70
      dark:via-amber-400/50
    `,

    glow: `
      bg-amber-400/[0.08]
      dark:bg-amber-500/[0.055]
    `,

    iconBox: `
      border-amber-200
      bg-amber-50
      text-amber-700

      dark:border-amber-400/20
      dark:bg-amber-400/[0.09]
      dark:text-amber-300
    `,

    label: `
      border-amber-200
      bg-amber-50
      text-amber-700

      dark:border-amber-400/20
      dark:bg-amber-400/[0.07]
      dark:text-amber-300
    `,
  },

  red: {
    panel: `
      border-rose-200/90
      dark:border-rose-400/20
    `,

    accent: `
      via-rose-500/70
      dark:via-rose-400/50
    `,

    glow: `
      bg-rose-400/[0.08]
      dark:bg-rose-500/[0.055]
    `,

    iconBox: `
      border-rose-200
      bg-rose-50
      text-rose-700

      dark:border-rose-400/20
      dark:bg-rose-400/[0.09]
      dark:text-rose-300
    `,

    label: `
      border-rose-200
      bg-rose-50
      text-rose-700

      dark:border-rose-400/20
      dark:bg-rose-400/[0.07]
      dark:text-rose-300
    `,
  },
};

// =========================================================
// MAIN COMPONENT
// =========================================================

const ProjectDetailErrorState = ({
  projectId,
  error,
  onRetry,
  isLoading = false,
}) => {
  const generatedId = useId();

  const titleId = `${generatedId}-title`;
  const descriptionId =
    `${generatedId}-description`;

  // =======================================================
  // ERROR TYPE
  // =======================================================

  const errorKind = getErrorKind(
    error,
    projectId
  );

  const config =
    ERROR_CONFIG[errorKind] ??
    ERROR_CONFIG.generic;

  const styles =
    TONE_STYLES[config.tone] ??
    TONE_STYLES.red;

  const Icon = config.Icon;

  // =======================================================
  // PROJECT ID
  // =======================================================

  const displayId =
    projectId === null ||
    projectId === undefined ||
    String(projectId).trim() === ""
      ? null
      : String(projectId);

  // =======================================================
  // ACTIONS
  // =======================================================

  const loading = Boolean(isLoading);

  const canRetry =
    config.allowRetry &&
    typeof onRetry === "function";

  const handleRetry = () => {
    if (!canRetry || loading) {
      return;
    }

    // Call the controller without passing
    // React's click event as its options.

    onRetry();
  };

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <main
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
        overflow-x-hidden
        bg-transparent
        px-3
        pb-16
        pt-28
        text-slate-900

        sm:px-6
        sm:pb-20

        dark:text-white
      "
    >
      {/* =====================================
          BACKGROUND GLOW
          PageGridBackground is rendered
          by ProjectDetail.jsx.
      ===================================== */}

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
          blur-[90px]

          sm:h-96
          sm:w-96

          ${styles.glow}
        `}
      />

      {/* =====================================
          ERROR CARD
      ===================================== */}

      <section
        role="alert"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
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
          px-4
          py-8
          text-center
          shadow-[0_24px_70px_rgba(15,23,42,0.10)]
          backdrop-blur-xl

          sm:rounded-[28px]
          sm:px-8
          sm:py-10

          dark:bg-[#0b1018]/95
          dark:shadow-[0_35px_100px_rgba(0,0,0,0.35)]

          ${styles.panel}
        `}
      >
        {/* =================================
            TOP ACCENT
        ================================= */}

        <div
          aria-hidden="true"
          className={`
            absolute
            inset-x-0
            top-0
            h-[2px]
            bg-gradient-to-r
            from-transparent
            to-transparent

            ${styles.accent}
          `}
        />

        {/* =================================
            ICON
        ================================= */}

        <div
          className={`
            relative
            mx-auto
            grid
            h-[68px]
            w-[68px]
            place-items-center
            rounded-2xl
            border
            shadow-sm

            dark:shadow-none

            ${styles.iconBox}
          `}
        >
          <Icon
            size={29}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </div>

        {/* =================================
            ERROR LABEL
        ================================= */}

        <div
          className={`
            relative
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
            tracking-[0.08em]

            ${styles.label}
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

        {/* =================================
            TITLE
        ================================= */}

        <h1
          id={titleId}
          className="
            relative
            mt-5
            break-words
            text-[22px]
            font-black
            leading-tight
            tracking-tight
            text-slate-900
            [overflow-wrap:anywhere]

            sm:text-[27px]

            dark:text-white
          "
        >
          {config.title}
        </h1>

        {/* =================================
            PROJECT ID
        ================================= */}

        {displayId && (
          <p
            className="
              relative
              mt-3
              break-words
              font-mono
              text-xs
              font-medium
              text-slate-500

              dark:text-slate-400
            "
          >
            Loyiha ID:{" "}
            <strong
              className="
                break-all
                font-black
                text-slate-700

                dark:text-slate-200
              "
            >
              {displayId}
            </strong>
          </p>
        )}

        {/* =================================
            DESCRIPTION
        ================================= */}

        <p
          id={descriptionId}
          className="
            relative
            mx-auto
            mt-4
            max-w-md
            break-words
            text-[13px]
            font-medium
            leading-7
            text-slate-600

            dark:text-slate-300
          "
        >
          {config.description}
        </p>

        {/* =================================
            USER GUIDANCE
        ================================= */}

        <div
          className="
            relative
            mt-5
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
          <p
            className="
              flex
              items-start
              gap-2
              text-xs
              font-medium
              leading-6
              text-slate-600

              dark:text-slate-300
            "
          >
            <FileQuestion
              size={17}
              className="
                mt-1
                shrink-0
                text-indigo-600

                dark:text-indigo-300
              "
              aria-hidden="true"
            />

            <span className="min-w-0 break-words">
              {config.hint}
            </span>
          </p>
        </div>

        {/* =================================
            ACTION BUTTONS
        ================================= */}

        <div
          className="
            relative
            mt-7
            flex
            flex-col
            items-stretch
            justify-center
            gap-3

            sm:flex-row
            sm:flex-wrap
          "
        >
          {/* ===============================
              BACK TO PROJECTS
          =============================== */}

          <Link
            to="/projects"
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
              text-center
              text-xs
              font-black
              text-white
              shadow-sm
              transition-colors
              duration-150

              hover:border-indigo-700
              hover:bg-indigo-700

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-indigo-500
              focus-visible:ring-offset-2

              dark:border-indigo-400/25
              dark:bg-indigo-500/20
              dark:text-indigo-100

              dark:hover:bg-indigo-500/30
              dark:focus-visible:ring-offset-[#0b1018]

              motion-reduce:transition-none
            "
          >
            <ArrowLeft
              size={16}
              strokeWidth={2}
              className="shrink-0"
              aria-hidden="true"
            />

            <span>Loyihalarga qaytish</span>
          </Link>

          {/* ===============================
              RETRY FOR RECOVERABLE ERRORS
          =============================== */}

          {canRetry && (
            <button
              type="button"
              onClick={handleRetry}
              disabled={loading}
              aria-busy={loading}
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
                duration-150

                hover:border-indigo-300
                hover:bg-indigo-50
                hover:text-indigo-700

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500
                focus-visible:ring-offset-2

                disabled:cursor-not-allowed
                disabled:opacity-60

                dark:border-white/[0.10]
                dark:bg-white/[0.04]
                dark:text-slate-300

                dark:hover:border-indigo-400/25
                dark:hover:bg-indigo-400/[0.08]
                dark:hover:text-indigo-300

                dark:focus-visible:ring-offset-[#0b1018]

                motion-reduce:transition-none
              "
            >
              {loading ? (
                <Loader2
                  size={16}
                  className="
                    shrink-0
                    motion-safe:animate-spin
                  "
                  aria-hidden="true"
                />
              ) : (
                <RefreshCw
                  size={16}
                  className="shrink-0"
                  aria-hidden="true"
                />
              )}

              <span>
                {loading
                  ? "Yuklanmoqda..."
                  : "Qayta urinish"}
              </span>
            </button>
          )}
        </div>
      </section>
    </main>
  );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProjectDetailErrorState);
