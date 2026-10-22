
import React, { memo, useMemo } from "react";

import {
  AlertTriangle,
  ArrowRight,
  Loader2,
  RefreshCw,
  ShieldAlert,
  Terminal,
  WifiOff,
} from "lucide-react";

// =========================================================
// FSOCIETY — MY PROBLEMS ERROR STATE
// =========================================================
//
// Location:
// src/components/my-problems/MyProblemsErrorState.jsx
//
// Props:
// - error
// - onRetry
// - isLoading
//
// Features:
// - Django / DRF error compatibility
// - Retry support
// - Loading / disabled states
// - Light / Dark mode
// - Responsive 320px+
// - Accessible error text
// - No duplicated siteToast
//
// =========================================================

const FALLBACK_ERROR =
  "Muammolarni yuklashda xatolik yuz berdi. Qayta urinib ko‘ring.";

// =========================================================
// ERROR MESSAGE PARSER
// =========================================================

const getReadableError = (error, depth = 0) => {
  if (error == null || depth > 5) {
    return "";
  }

  // =====================================================
  // STRING
  // =====================================================

  if (typeof error === "string") {
    const value = error.trim();

    if (!value) {
      return "";
    }

    if (
      (value.startsWith("{") && value.endsWith("}")) ||
      (value.startsWith("[") && value.endsWith("]"))
    ) {
      try {
        return getReadableError(
          JSON.parse(value),
          depth + 1
        );
      } catch {
        return value;
      }
    }

    return value;
  }

  // =====================================================
  // ARRAY
  // =====================================================

  if (Array.isArray(error)) {
    return error
      .map((item) =>
        getReadableError(
          item,
          depth + 1
        )
      )
      .filter(Boolean)
      .join("; ");
  }

  // =====================================================
  // OBJECT
  // =====================================================

  if (typeof error === "object") {
    const responseData =
      error.serverData ??
      error.response?.data;

    if (responseData) {
      const message = getReadableError(
        responseData,
        depth + 1
      );

      if (message) {
        return message;
      }
    }

    for (const key of [
      "detail",
      "message",
      "error",
      "non_field_errors",
    ]) {
      if (!error[key]) {
        continue;
      }

      const message = getReadableError(
        error[key],
        depth + 1
      );

      if (message) {
        return message;
      }
    }

    // Parse simple DRF field errors,
    // without exposing internal request data.

    return Object.entries(error)
      .filter(
        ([key]) =>
          ![
            "stack",
            "config",
            "request",
            "response",
            "serverData",
            "name",
            "status",
          ].includes(key)
      )
      .map(([field, value]) => {
        const message = getReadableError(
          value,
          depth + 1
        );

        return message
          ? `${field}: ${message}`
          : "";
      })
      .filter(Boolean)
      .join("; ");
  }

  return "";
};

// =========================================================
// MAIN COMPONENT
// =========================================================

function MyProblemsErrorState({
  error = null,
  onRetry,
  isLoading = false,
  className = "",
}) {
  // =====================================================
  // MESSAGE
  // =====================================================

  const errorMessage = useMemo(() => {
    if (!error) {
      return "";
    }

    return (
      getReadableError(error) ||
      FALLBACK_ERROR
    );
  }, [error]);

  // =====================================================
  // RETRY
  // =====================================================

  const canRetry =
    typeof onRetry === "function" &&
    !isLoading;

  const handleRetry = () => {
    if (!canRetry) {
      return;
    }

    onRetry();
  };

  // =====================================================
  // INVALID / EMPTY ERROR
  // =====================================================

  if (!error) {
    return null;
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section
      role="alert"
      aria-label="Muammolarni yuklashda xato"
      className={`
        relative isolate
        mb-6 w-full min-w-0
        max-w-full
        overflow-hidden

        rounded-2xl

        border border-red-200
        bg-white/95

        shadow-[0_8px_28px_rgba(185,28,28,0.035)]
        backdrop-blur-xl

        dark:border-red-400/20
        dark:bg-[#120f18]/95

        ${className}
      `}
    >
      {/* ==========================================
          BACKGROUND DETAILS
         ========================================== */}

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
            absolute -right-16 -top-24

            h-52 w-52
            rounded-full

            bg-red-500/[0.06]
            blur-[65px]

            dark:bg-red-500/[0.09]
          "
        />

        <div
          className="
            absolute left-0 top-0
            h-[2px] w-full

            bg-gradient-to-r
            from-red-500
            via-orange-400/50
            to-transparent
          "
        />
      </div>

      {/* ==========================================
          MAIN CONTENT
         ========================================== */}

      <div
        className="
          relative z-10

          flex min-w-0
          flex-col gap-4

          p-4

          sm:flex-row
          sm:items-start
          sm:gap-4
          sm:p-5
        "
      >
        {/* ========================================
            ERROR ICON
           ======================================== */}

        <div
          aria-hidden="true"
          className="
            flex h-11 w-11
            shrink-0

            items-center justify-center

            rounded-xl

            border border-red-200
            bg-red-50

            text-red-600

            dark:border-red-400/20
            dark:bg-red-500/10
            dark:text-red-400
          "
        >
          <ShieldAlert
            size={21}
            strokeWidth={1.8}
          />
        </div>

        {/* ========================================
            TEXT
           ======================================== */}

        <div
          className="
            w-full min-w-0
            flex-1
          "
        >
          {/* HEADER */}
          <div
            className="
              flex min-w-0
              flex-wrap items-center
              gap-2
            "
          >
            <h2
              className="
                text-[14px]
                font-extrabold

                tracking-tight

                text-slate-900
                dark:text-white

                sm:text-[15px]
              "
            >
              Muammolarni yuklab bo‘lmadi
            </h2>

            <span
              className="
                inline-flex
                items-center gap-1

                rounded-md
                border border-red-200
                bg-red-50

                px-2 py-1

                font-mono
                text-[9px] font-bold

                text-red-700

                dark:border-red-400/20
                dark:bg-red-500/10
                dark:text-red-300
              "
            >
              <AlertTriangle
                size={11}
                aria-hidden="true"
              />

              REQUEST_FAILED
            </span>
          </div>

          {/* DESCRIPTION */}
          <p
            className="
              mt-2 max-w-2xl

              text-[12px]
              leading-6

              text-slate-600

              dark:text-slate-400

              sm:text-[13px]
            "
          >
            Serverdan ma’lumotlarni olishda
            muammo yuz berdi. Internet
            ulanishini tekshirib, qayta
            urinib ko‘ring.
          </p>

          {/* ======================================
              ERROR MESSAGE
             ====================================== */}

          <div
            className="
              mt-3
              flex min-w-0
              items-start gap-2.5

              rounded-xl

              border border-red-200/80
              bg-red-50/80

              px-3 py-3

              dark:border-red-400/[0.14]
              dark:bg-red-500/[0.06]
            "
          >
            <Terminal
              size={15}
              className="
                mt-0.5
                shrink-0

                text-red-600
                dark:text-red-400
              "
              aria-hidden="true"
            />

            <div className="min-w-0 flex-1">
              <p
                className="
                  font-mono
                  text-[9px]
                  font-bold uppercase
                  tracking-[0.1em]

                  text-red-600

                  dark:text-red-400
                "
              >
                ERROR_MESSAGE
              </p>

              <p
                className="
                  mt-1

                  whitespace-pre-line
                  break-words
                  [overflow-wrap:anywhere]

                  text-[12px]
                  font-medium
                  leading-5

                  text-red-800
                  dark:text-red-200
                "
              >
                {errorMessage}
              </p>
            </div>
          </div>

          {/* ======================================
              FOOTER ACTIONS
             ====================================== */}

          <div
            className="
              mt-4
              flex min-w-0
              flex-wrap items-center
              justify-between
              gap-3
            "
          >
            {/* RETRY */}
            <button
              type="button"
              onClick={handleRetry}
              disabled={!canRetry}
              aria-busy={isLoading}
              className="
                inline-flex min-h-11
                min-w-0

                items-center justify-center
                gap-2

                rounded-xl

                bg-red-600
                px-4 py-2.5

                text-[12px]
                font-bold text-white

                transition-colors

                hover:bg-red-700

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-red-400
                focus-visible:ring-offset-2

                disabled:cursor-not-allowed
                disabled:opacity-55

                dark:bg-red-600
                dark:hover:bg-red-500
              "
            >
              {isLoading ? (
                <Loader2
                  size={15}
                  className="
                    shrink-0
                    motion-safe:animate-spin
                  "
                  aria-hidden="true"
                />
              ) : (
                <RefreshCw
                  size={15}
                  className="shrink-0"
                  aria-hidden="true"
                />
              )}

              {isLoading
                ? "Yuklanmoqda..."
                : "Qayta urinish"}

              {!isLoading && (
                <ArrowRight
                  size={13}
                  className="shrink-0"
                  aria-hidden="true"
                />
              )}
            </button>

            {/* SECONDARY HINT */}
            <div
              className="
                inline-flex min-w-0
                items-center gap-1.5

                text-[10px]
                font-medium

                text-slate-400

                dark:text-slate-500
              "
            >
              <WifiOff
                size={13}
                className="shrink-0"
                aria-hidden="true"
              />

              Ulanish holatini tekshiring
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          BOTTOM STATUS
         ========================================== */}

      <div
        aria-hidden="true"
        className="
          relative z-10

          border-t border-red-100
          bg-red-50/50

          px-4 py-2

          font-mono
          text-[9px]

          text-red-700/70

          dark:border-red-400/[0.08]
          dark:bg-red-500/[0.025]
          dark:text-red-300/60

          sm:px-5
        "
      >
        FSOCIETY / PROBLEMS / ERROR
      </div>
    </section>
  );
}

export default memo(MyProblemsErrorState);
