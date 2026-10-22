
import React, {
  memo,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import {
  AlertCircle,
  Check,
  Keyboard,
  Loader2,
  Pencil,
  Save,
  X,
} from "lucide-react";

// =========================================================
// FSOCIETY — POST COMMENT EDIT FORM
// REDDIT x MR. ROBOT EDITOR
// =========================================================
//
// Location:
// src/components/posts/comments/item/PostCommentEditForm.jsx
//
// Existing props:
// - value
// - onChange
// - onCancel
// - onSave
// - isProcessing
// - error
// - originalValue
// - className
//
// Features:
// - Root comment / Nested reply editing
// - Compact discussion-card design
// - Light / Dark Mode
// - Responsive 320px+
// - Controlled textarea
// - 255-character validation
// - Synchronous save lock
// - Async save loading
// - Preserve draft on API failure
// - Ctrl / Cmd + Enter
// - Escape to cancel
// - Accessible unique IDs
// - Full multi-line API errors
//
// API, Redux and siteToast are handled by:
// usePostCommentActions.js
//
// =========================================================

// =========================================================
// CONSTANTS
// =========================================================

const MAX_LENGTH = 255;
const WARNING_LENGTH = 230;

// =========================================================
// BUTTON STYLES
// =========================================================

const BUTTON_BASE = [
  "inline-flex",
  "min-h-9",
  "min-w-0",
  "items-center",
  "justify-center",
  "gap-1.5",
  "rounded-lg",
  "border",
  "px-3",
  "py-2",
  "text-[11px]",
  "font-bold",
  "transition-all",
  "duration-200",
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-rose-400",
  "disabled:cursor-not-allowed",
  "disabled:opacity-50",
  "motion-reduce:transform-none",
  "motion-reduce:transition-none",
].join(" ");

const CANCEL_BUTTON_CLASS = [
  BUTTON_BASE,
  "border-slate-200",
  "bg-white",
  "text-slate-600",
  "hover:border-slate-300",
  "hover:bg-slate-100",
  "hover:text-slate-900",
  "dark:border-white/[0.10]",
  "dark:bg-white/[0.04]",
  "dark:text-slate-300",
  "dark:hover:border-white/[0.18]",
  "dark:hover:bg-white/[0.08]",
  "dark:hover:text-white",
].join(" ");

const SAVE_BUTTON_CLASS = [
  BUTTON_BASE,
  "border-rose-600",
  "bg-rose-600",
  "text-white",
  "shadow-[0_3px_10px_rgba(225,29,72,0.12)]",
  "hover:border-rose-700",
  "hover:bg-rose-700",
  "hover:shadow-[0_5px_14px_rgba(225,29,72,0.20)]",
  "disabled:shadow-none",
  "dark:border-rose-500",
  "dark:bg-rose-600",
  "dark:hover:bg-rose-500",
].join(" ");

// =========================================================
// MAIN COMPONENT
// =========================================================

function PostCommentEditForm({
  value = "",
  onChange,
  onCancel,
  onSave,

  originalValue = "",
  isProcessing = false,
  error = "",

  className = "",
}) {
  // =====================================================
  // ACCESSIBILITY IDS
  // =====================================================

  const inputId = useId();
  const counterId = useId();
  const errorId = useId();
  const helpId = useId();

  // =====================================================
  // REFS
  // =====================================================

  const formRef = useRef(null);
  const textareaRef = useRef(null);

  const submitLockRef = useRef(false);
  const mountedRef = useRef(false);

  // =====================================================
  // LOCAL STATE
  // =====================================================

  const [
    localSaving,
    setLocalSaving,
  ] = useState(false);

  const [
    localError,
    setLocalError,
  ] = useState("");

  const [
    hidePreviousError,
    setHidePreviousError,
  ] = useState(false);

  // =====================================================
  // MOUNT / UNMOUNT
  // =====================================================

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  // =====================================================
  // INITIAL FOCUS
  // =====================================================

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.focus();

    const length = textarea.value.length;

    textarea.setSelectionRange(
      length,
      length
    );
  }, []);

  // =====================================================
  // CONTROLLED VALUES
  // =====================================================

  const message = String(
    value ?? ""
  );

  const originalMessage = String(
    originalValue ?? ""
  );

  const cleanMessage = message.trim();
  const cleanOriginal = originalMessage.trim();

  const characterCount = message.length;

  const remainingCharacters = Math.max(
    0,
    MAX_LENGTH - characterCount
  );

  const isNearLimit =
    characterCount >= WARNING_LENGTH;

  const hasChanged =
    cleanMessage !== cleanOriginal;

  const hasContent =
    cleanMessage.length > 0;

  const isWithinLimit =
    characterCount <= MAX_LENGTH;

  const busy = Boolean(
    isProcessing || localSaving
  );

  // =====================================================
  // PERMISSIONS
  // =====================================================

  const canSave =
    !busy &&
    hasChanged &&
    hasContent &&
    isWithinLimit &&
    typeof onSave === "function";

  const canCancel =
    !busy &&
    typeof onCancel === "function";

  // =====================================================
  // ERROR STATE
  // =====================================================

  const externalError = String(
    error ?? ""
  ).trim();

  const visibleError =
    localError ||
    (
      hidePreviousError
        ? ""
        : externalError
    );

  // =====================================================
  // CHANGE HANDLER
  // =====================================================

  const handleChange = useCallback(
    (event) => {
      if (
        busy ||
        typeof onChange !== "function"
      ) {
        return;
      }

      // Parent hook owns the controlled value.
      onChange(event.target.value);

      // Clear old local errors while editing.
      setLocalError("");
      setHidePreviousError(true);
    },
    [
      busy,
      onChange,
    ]
  );

  // =====================================================
  // CANCEL HANDLER
  // =====================================================

  const handleCancel = useCallback(
    () => {
      if (!canCancel) return;

      onCancel();
    },
    [
      canCancel,
      onCancel,
    ]
  );

  // =====================================================
  // SAVE HANDLER
  // =====================================================

  const handleSubmit = useCallback(
    async (event) => {
      event?.preventDefault?.();

      // -----------------------------------------------
      // PREVENT DUPLICATE SUBMISSIONS
      // -----------------------------------------------

      if (
        submitLockRef.current ||
        busy
      ) {
        return;
      }

      // -----------------------------------------------
      // EMPTY MESSAGE
      // -----------------------------------------------

      if (!hasContent) {
        setLocalError(
          "Sharh matni bo‘sh bo‘lishi mumkin emas."
        );

        return;
      }

      // -----------------------------------------------
      // MAX LENGTH
      // -----------------------------------------------

      if (!isWithinLimit) {
        setLocalError(
          `Sharh ${MAX_LENGTH} ta belgidan oshmasligi kerak.`
        );

        return;
      }

      // -----------------------------------------------
      // UNCHANGED MESSAGE
      // -----------------------------------------------

      if (!hasChanged) {
        setLocalError(
          "Saqlash uchun sharh matnini o‘zgartiring."
        );

        return;
      }

      // -----------------------------------------------
      // CALLBACK VALIDATION
      // -----------------------------------------------

      if (typeof onSave !== "function") {
        setLocalError(
          "Sharhni saqlash funksiyasi mavjud emas."
        );

        return;
      }

      // -----------------------------------------------
      // SYNCHRONOUS LOCK
      // -----------------------------------------------

      submitLockRef.current = true;

      setLocalSaving(true);
      setLocalError("");

      // New request must be able to display
      // fresh errors from the parent hook.
      setHidePreviousError(false);

      try {
        // ---------------------------------------------
        // PARENT HOOK
        // ---------------------------------------------
        //
        // usePostCommentActions.js handles:
        //
        // - Message validation
        // - API request
        // - Redux update
        // - siteToast notifications
        // - updated_at synchronization
        // - Closing the editor on success
        //
        // Do not clear the controlled value here.
        // ---------------------------------------------

        await onSave();

      } catch (requestError) {
        if (!mountedRef.current) {
          return;
        }

        const message =
          typeof requestError?.message === "string" &&
          requestError.message.trim()
            ? requestError.message.trim()
            : (
              "O‘zgarishlarni saqlab bo‘lmadi. " +
              "Matningiz saqlandi, qayta urinib ko‘ring."
            );

        setLocalError(message);
        setHidePreviousError(false);
      } finally {
        submitLockRef.current = false;

        if (mountedRef.current) {
          setLocalSaving(false);
        }
      }
    },
    [
      busy,
      hasContent,
      isWithinLimit,
      hasChanged,
      onSave,
    ]
  );

  // =====================================================
  // KEYBOARD SHORTCUTS
  // =====================================================

  const handleKeyDown = useCallback(
    (event) => {
      // -----------------------------------------------
      // ESCAPE — CANCEL
      // -----------------------------------------------

      if (
        event.key === "Escape" &&
        !busy
      ) {
        event.preventDefault();
        handleCancel();
        return;
      }

      // -----------------------------------------------
      // CTRL / CMD + ENTER — SAVE
      // -----------------------------------------------

      if (
        event.key === "Enter" &&
        (event.ctrlKey || event.metaKey) &&
        !event.nativeEvent?.isComposing
      ) {
        event.preventDefault();

        if (busy) return;

        // Submit using the native form event.
        // The synchronous lock remains active.
        formRef.current?.requestSubmit?.();
      }
    },
    [
      busy,
      handleCancel,
    ]
  );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      aria-busy={busy}
      className={`
        group/editor
        relative isolate
        w-full min-w-0 max-w-full
        overflow-hidden

        rounded-xl
        border border-slate-200
        bg-slate-50/90

        p-2.5
        font-sans

        shadow-[0_3px_12px_rgba(15,23,42,0.025)]

        transition-[border-color,box-shadow]
        duration-200

        focus-within:border-rose-300
        focus-within:shadow-[0_4px_16px_rgba(225,29,72,0.045)]

        dark:border-white/[0.10]
        dark:bg-[#0b0f16]
        dark:focus-within:border-rose-400/30

        sm:p-3

        ${className}
      `}
    >
      {/* ==========================================
          MR. ROBOT SIGNAL LINE
         ========================================== */}

      <span
        aria-hidden="true"
        className="
          pointer-events-none
          absolute bottom-3 left-0 top-3
          w-[2px] rounded-r-full

          bg-gradient-to-b
          from-rose-500
          via-rose-500/25
          to-transparent
        "
      />

      {/* ==========================================
          HEADER
         ========================================== */}

      <div
        className="
          mb-2.5
          flex min-w-0 flex-wrap
          items-center justify-between
          gap-x-3 gap-y-2
        "
      >
        <div
          className="
            inline-flex min-w-0
            items-center gap-2
          "
        >
          <span
            aria-hidden="true"
            className="
              grid h-7 w-7
              shrink-0 place-items-center

              rounded-lg

              border border-rose-200
              bg-rose-50
              text-rose-600

              dark:border-rose-400/20
              dark:bg-rose-500/10
              dark:text-rose-400
            "
          >
            <Pencil size={13} />
          </span>

          <div className="min-w-0">
            <p
              className="
                truncate font-mono
                text-[10px] font-extrabold
                uppercase tracking-[0.08em]
                text-slate-700

                dark:text-slate-200
              "
            >
              EDIT_MESSAGE
            </p>

            <p
              className="
                mt-0.5
                font-mono text-[9px]
                text-slate-400
                dark:text-slate-500
              "
            >
              FSOCIETY / COMMENT
            </p>
          </div>
        </div>

        {/* CHANGE STATUS */}
        <span
          className={`
            inline-flex min-h-6
            items-center gap-1.5

            rounded-md
            border px-2 py-1

            font-mono text-[9px]
            font-bold uppercase
            tracking-wide

            ${
              hasChanged
                ? `
                  border-amber-200
                  bg-amber-50
                  text-amber-700

                  dark:border-amber-400/20
                  dark:bg-amber-400/10
                  dark:text-amber-300
                `
                : `
                  border-emerald-200
                  bg-emerald-50
                  text-emerald-700

                  dark:border-emerald-400/20
                  dark:bg-emerald-400/10
                  dark:text-emerald-300
                `
            }
          `}
        >
          {hasChanged ? (
            <>
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-current"
              />
              UNSAVED
            </>
          ) : (
            <>
              <Check
                size={11}
                aria-hidden="true"
              />
              NO_CHANGES
            </>
          )}
        </span>
      </div>

      {/* ==========================================
          TEXTAREA
         ========================================== */}

      <label
        htmlFor={inputId}
        className="sr-only"
      >
        Sharh matnini tahrirlash
      </label>

      <textarea
        ref={textareaRef}
        id={inputId}
        name="edit-comment"
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        rows={3}
        maxLength={MAX_LENGTH}
        disabled={busy}
        aria-invalid={Boolean(
          visibleError || !isWithinLimit
        )}
        aria-describedby={
          visibleError
            ? `${helpId} ${counterId} ${errorId}`
            : `${helpId} ${counterId}`
        }
        placeholder="Sharh matnini tahrirlang..."
        className="
          block
          w-full min-w-0 max-w-full
          min-h-[88px]

          resize-y
          rounded-lg

          border border-slate-200
          bg-white

          px-3 py-2.5

          text-[13px] font-medium
          leading-[1.7]
          text-slate-900

          outline-none
          transition-colors
          duration-200

          placeholder:text-slate-400

          focus:border-rose-400
          focus:ring-2
          focus:ring-rose-400/10

          disabled:cursor-not-allowed
          disabled:opacity-60

          dark:border-white/[0.10]
          dark:bg-[#090c11]
          dark:text-slate-100
          dark:placeholder:text-slate-500

          dark:focus:border-rose-400/50
          dark:focus:ring-rose-500/10

          motion-reduce:transition-none
        "
      />

      {/* ==========================================
          API / VALIDATION ERRORS
         ========================================== */}

      {visibleError && (
        <div
          id={errorId}
          role="alert"
          className="
            mt-2.5
            flex min-w-0
            items-start gap-2

            rounded-lg
            border border-red-200
            bg-red-50

            px-3 py-2.5

            dark:border-red-400/20
            dark:bg-red-500/[0.08]
          "
        >
          <AlertCircle
            size={15}
            className="
              mt-0.5 shrink-0
              text-red-600
              dark:text-red-400
            "
            aria-hidden="true"
          />

          <p
            className="
              min-w-0
              whitespace-pre-line
              break-words

              text-[11px]
              font-medium
              leading-5
              text-red-700

              dark:text-red-200
            "
          >
            {visibleError}
          </p>
        </div>
      )}

      {/* ==========================================
          FOOTER
         ========================================== */}

      <div
        className="
          mt-2.5
          flex min-w-0
          flex-wrap items-end
          justify-between
          gap-3
        "
      >
        {/* CHARACTER COUNTER */}
        <div className="min-w-0">
          <div
            className="
              flex flex-wrap
              items-center gap-x-2 gap-y-1
            "
          >
            <span
              id={counterId}
              className={`
                font-mono
                text-[10px]
                font-bold
                tabular-nums

                ${
                  isNearLimit
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-slate-400 dark:text-slate-500"
                }
              `}
            >
              {characterCount}/{MAX_LENGTH}
            </span>

            {isNearLimit && (
              <span
                className="
                  text-[10px] font-medium
                  text-amber-700
                  dark:text-amber-300
                "
              >
                {remainingCharacters} ta belgi qoldi
              </span>
            )}
          </div>

          {/* KEYBOARD / SAVE HINT */}
          <p
            id={helpId}
            className="
              mt-1
              max-w-full
              break-words
              text-[10px]
              leading-4
              text-slate-400

              dark:text-slate-500
            "
          >
            {busy
              ? "O‘zgarishlar saqlanmoqda..."
              : !hasChanged
                ? "Matnni o‘zgartirgach saqlashingiz mumkin."
                : "Tahrirlangan matn tayyor."}
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div
          className="
            ml-auto
            flex min-w-0
            flex-wrap items-center
            justify-end
            gap-1.5
          "
        >
          {/* CANCEL */}
          <button
            type="button"
            onClick={handleCancel}
            disabled={!canCancel}
            className={CANCEL_BUTTON_CLASS}
          >
            <X
              size={13}
              className="shrink-0"
              aria-hidden="true"
            />

            Bekor qilish
          </button>

          {/* SAVE */}
          <button
            type="submit"
            disabled={!canSave}
            aria-busy={busy}
            className={SAVE_BUTTON_CLASS}
          >
            {busy ? (
              <Loader2
                size={14}
                className="
                  shrink-0
                  motion-safe:animate-spin
                "
                aria-hidden="true"
              />
            ) : (
              <Save
                size={14}
                className="shrink-0"
                aria-hidden="true"
              />
            )}

            {busy
              ? "Saqlanmoqda..."
              : "Saqlash"}
          </button>
        </div>
      </div>

      {/* ==========================================
          KEYBOARD SHORTCUT HELP
         ========================================== */}

      <div
        className="
          mt-2.5
          flex flex-wrap
          items-center justify-between
          gap-2

          border-t border-slate-200/80
          pt-2.5

          dark:border-white/[0.07]
        "
      >
        <span
          className="
            inline-flex items-center
            gap-1.5

            font-mono text-[9px]
            text-slate-400

            dark:text-slate-500
          "
        >
          <Keyboard
            size={12}
            aria-hidden="true"
          />

          Ctrl / Cmd + Enter
        </span>

        <span
          className="
            font-mono text-[9px]
            text-slate-400
            dark:text-slate-600
          "
        >
          ESC / CANCEL
        </span>
      </div>

      {/* ==========================================
          SCREEN READER STATUS
         ========================================== */}

      <span
        role="status"
        aria-live="polite"
        className="sr-only"
      >
        {busy
          ? "Sharhdagi o‘zgarishlar saqlanmoqda."
          : ""}
      </span>
    </form>
  );
}

export default memo(PostCommentEditForm);
