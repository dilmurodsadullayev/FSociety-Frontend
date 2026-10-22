
import React, {
  memo,
  useCallback,
  useId,
  useRef,
} from "react";

import {
  Command,
  Loader2,
  Search,
  X,
} from "lucide-react";

// =========================================================
// FSOCIETY — MY PROBLEMS SEARCH
// =========================================================
//
// Props:
// - value
// - onChange(event)
// - onClear()
// - isLoading
//
// Features:
// - Controlled search
// - Existing debounce compatibility
// - Light / Dark mode
// - Responsive 320px+
// - Loading indication
// - Escape to clear
// - Accessible label and help text
// - Focus states
// - No duplicate API requests
//
// =========================================================

function MyProblemsSearch({
  value = "",
  onChange,
  onClear,
  isLoading = false,
}) {
  const inputId = useId();
  const helpId = useId();

  const inputRef = useRef(null);

  const searchValue = String(value ?? "");
  const hasValue = searchValue.length > 0;

  // =====================================================
  // SEARCH CHANGE
  // =====================================================

  const handleChange = useCallback(
    (event) => {
      if (typeof onChange !== "function") {
        return;
      }

      // The parent expects the original event.
      onChange(event);
    },
    [onChange]
  );

  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  const handleClear = useCallback(() => {
    if (
      !hasValue ||
      typeof onClear !== "function"
    ) {
      return;
    }

    onClear();

    // Return focus to the search input.
    inputRef.current?.focus();
  }, [
    hasValue,
    onClear,
  ]);

  // =====================================================
  // KEYBOARD
  // =====================================================

  const handleKeyDown = useCallback(
    (event) => {
      if (
        event.key === "Escape" &&
        hasValue
      ) {
        event.preventDefault();
        handleClear();
      }
    },
    [
      hasValue,
      handleClear,
    ]
  );

  // =====================================================
  // FORM SUBMIT
  // =====================================================

  const handleSubmit = useCallback(
    (event) => {
      // Searching is already handled by
      // the debounced parent effect.
      event.preventDefault();
    },
    []
  );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section
      aria-label="Mening muammolarimdan qidirish"
      className="
        relative mb-6
        w-full min-w-0
        overflow-hidden

        rounded-2xl
        border border-slate-200/90
        bg-white/90

        p-3

        shadow-[0_8px_24px_rgba(15,23,42,0.035)]
        backdrop-blur-xl

        dark:border-white/[0.09]
        dark:bg-[#0b111c]/90

        sm:p-4
      "
    >
      {/* ==========================================
          HEADING
         ========================================== */}

      <div
        className="
          mb-3 flex min-w-0
          flex-wrap items-center
          justify-between gap-2
        "
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="
                h-1.5 w-1.5
                shrink-0 rounded-full
                bg-indigo-500
              "
            />

            <h2
              className="
                text-[13px]
                font-bold
                text-slate-900

                dark:text-slate-100
              "
            >
              Muammolar orasidan qidirish
            </h2>
          </div>

          <p
            id={helpId}
            className="
              mt-1 pl-3.5
              text-[11px] leading-5
              text-slate-500

              dark:text-slate-400
            "
          >
            Sarlavha yoki kalit so‘z orqali izlang.
          </p>
        </div>

        <span
          className="
            hidden items-center gap-1.5
            rounded-lg
            border border-slate-200
            bg-slate-50

            px-2.5 py-1.5
            font-mono text-[10px]
            font-semibold
            text-slate-400

            dark:border-white/[0.08]
            dark:bg-white/[0.035]
            dark:text-slate-500

            sm:inline-flex
          "
        >
          <Command
            size={12}
            aria-hidden="true"
          />

          SEARCH
        </span>
      </div>

      {/* ==========================================
          SEARCH FORM
         ========================================== */}

      <form
        role="search"
        onSubmit={handleSubmit}
        className="relative min-w-0"
      >
        <label
          htmlFor={inputId}
          className="sr-only"
        >
          Mening muammolarimdan qidirish
        </label>

        {/* SEARCH ICON */}
        <Search
          size={18}
          className="
            pointer-events-none
            absolute left-3.5 top-1/2
            z-10 -translate-y-1/2

            text-slate-400

            dark:text-slate-500
          "
          aria-hidden="true"
        />

        {/* INPUT */}
        <input
          ref={inputRef}
          id={inputId}
          name="my-problems-search"
          type="search"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          spellCheck={false}
          value={searchValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          aria-describedby={helpId}
          placeholder="Masalan: Django, API, React..."
          className="
            block h-12
            w-full min-w-0 max-w-full

            rounded-xl
            border border-slate-200
            bg-slate-50/70

            py-3 pl-11 pr-12

            text-base font-medium
            text-slate-900

            outline-none
            transition-all duration-200

            placeholder:text-slate-400

            focus:border-indigo-400
            focus:bg-white
            focus:ring-4
            focus:ring-indigo-500/[0.08]

            dark:border-white/[0.10]
            dark:bg-[#090e17]
            dark:text-white
            dark:placeholder:text-slate-500

            dark:focus:border-indigo-400/40
            dark:focus:bg-[#0b111c]
            dark:focus:ring-indigo-400/[0.08]

            [&::-webkit-search-cancel-button]:hidden

            motion-reduce:transition-none
          "
        />

        {/* ======================================
            RIGHT CONTROL
           ====================================== */}

        {isLoading ? (
          <span
            role="status"
            aria-label="Qidiruv natijalari yuklanmoqda"
            className="
              pointer-events-none
              absolute right-3 top-1/2
              flex h-7 w-7
              -translate-y-1/2
              items-center justify-center

              text-indigo-600
              dark:text-indigo-400
            "
          >
            <Loader2
              size={17}
              className="
                motion-safe:animate-spin
              "
              aria-hidden="true"
            />
          </span>
        ) : hasValue ? (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Qidiruvni tozalash"
            title="Qidiruvni tozalash (Esc)"
            className="
              absolute right-1.5 top-1/2
              flex h-9 w-9
              -translate-y-1/2
              items-center justify-center

              rounded-lg
              text-slate-400

              transition-colors

              hover:bg-slate-200
              hover:text-slate-800

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-indigo-400

              dark:text-slate-500
              dark:hover:bg-white/[0.08]
              dark:hover:text-white
            "
          >
            <X
              size={17}
              aria-hidden="true"
            />
          </button>
        ) : null}
      </form>

      {/* ==========================================
          FOOTER STATUS
         ========================================== */}

      <div
        className="
          mt-2.5 flex min-w-0
          flex-wrap items-center
          justify-between
          gap-2 px-0.5
        "
      >
        <p
          role="status"
          aria-live="polite"
          className="
            min-w-0
            text-[10px]
            text-slate-500
            dark:text-slate-400
          "
        >
          {isLoading
            ? "Natijalar yangilanmoqda..."
            : hasValue
              ? "Qidiruv so‘rovi kiritilgan"
              : "Qidirishni boshlash uchun matn kiriting"}
        </p>

        {hasValue && (
          <button
            type="button"
            onClick={handleClear}
            className="
              text-[10px] font-semibold
              text-indigo-600
              underline-offset-4

              hover:underline

              focus-visible:outline-none
              focus-visible:underline

              dark:text-indigo-400
            "
          >
            Tozalash
          </button>
        )}
      </div>
    </section>
  );
}

export default memo(MyProblemsSearch);
