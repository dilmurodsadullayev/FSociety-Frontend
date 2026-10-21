
import React, {
  memo,
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
  Save,
  X,
} from "lucide-react";

// =========================================================
// FSOCIETY — POST COMMENT EDIT FORM
// =========================================================
//
// Location:
// comments/item/PostCommentEditForm.jsx
//
// Existing props:
// - value
// - onChange
// - onCancel
// - onSave
// - isProcessing
// - error
// - originalValue
//
// Features:
// - Light / Dark Mode
// - Responsive 320px+
// - Controlled textarea
// - 255-character limit
// - Synchronous save lock
// - Async save loading
// - Preserve draft on API failure
// - Ctrl / Cmd + Enter
// - Accessible validation
// - FSociety developer-style editor
//
// No API, Redux or toast logic.
// =========================================================

// =========================================================
// CONSTANTS
// =========================================================

const MAX_LENGTH = 255;

// =========================================================
// STYLES
// =========================================================

const BUTTON_BASE = `
  inline-flex
  min-h-11
  min-w-0
  items-center
  justify-center
  gap-2

  rounded-xl
  border
  px-4
  py-2.5

  text-xs
  font-black

  transition-all
  duration-200

  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-indigo-500
  focus-visible:ring-offset-2

  active:scale-[0.98]

  disabled:cursor-not-allowed
  disabled:opacity-50
  disabled:active:scale-100

  motion-reduce:transform-none
  motion-reduce:transition-none
`;

const CANCEL_BUTTON_CLASS = `
  ${BUTTON_BASE}

  border-slate-200
  bg-white/90
  text-slate-700

  hover:border-slate-300
  hover:bg-slate-100

  dark:border-white/[0.10]
  dark:bg-white/[0.04]
  dark:text-slate-300

  dark:hover:border-white/[0.18]
  dark:hover:bg-white/[0.08]
`;

const SAVE_BUTTON_CLASS = `
  ${BUTTON_BASE}

  border-indigo-600
  bg-indigo-600
  text-white

  shadow-[0_8px_24px_rgba(79,70,229,0.16)]

  hover:border-indigo-700
  hover:bg-indigo-700

  dark:border-indigo-400/25
  dark:bg-indigo-500
  dark:hover:bg-indigo-400
`;

// =========================================================
// MAIN COMPONENT
// =========================================================

const PostCommentEditForm = ({
  value = "",
  onChange,
  onCancel,
  onSave,

  originalValue = "",
  isProcessing = false,
  error = "",

  className = "",
}) => {
  // =======================================================
  // ACCESSIBILITY IDS
  // =======================================================

  const inputId = useId();
  const counterId = useId();
  const errorId = useId();
  const helpId = useId();

  // =======================================================
  // REFS
  // =======================================================

  const formRef = useRef(null);
  const submitLockRef = useRef(false);
  const mountedRef = useRef(false);

  // =======================================================
  // LOCAL STATE
  // =======================================================

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

  // =======================================================
  // MOUNT / UNMOUNT
  // =======================================================

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  // =======================================================
  // VALUES
  // =======================================================

  const message = String(value ?? "");

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
    characterCount >= 230;

  const hasChanged =
    cleanMessage !== cleanOriginal;

  const hasContent =
    cleanMessage.length > 0;

  const isWithinLimit =
    characterCount <= MAX_LENGTH;

  const busy =
    Boolean(isProcessing || localSaving);

  const canSave =
    !busy &&
    hasChanged &&
    hasContent &&
    isWithinLimit &&
    typeof onSave === "function";

  const canCancel =
    !busy &&
    typeof onCancel === "function";

  const visibleError =
    localError ||
    (
      !hidePreviousError
        ? String(error ?? "")
        : ""
    );

  // =======================================================
  // CHANGE HANDLER
  // =======================================================

  const handleChange = (event) => {
    if (
      busy ||
      typeof onChange !== "function"
    ) {
      return;
    }

    // Parent owns the text state.
    // This component never overwrites
    // the controlled value.

    onChange(event.target.value);

    setLocalError("");
    setHidePreviousError(true);
  };

  // =======================================================
  // CANCEL
  // =======================================================

  const handleCancel = () => {
    if (!canCancel) {
      return;
    }

    onCancel();
  };

  // =======================================================
  // SAVE
  // =======================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    // =====================================
    // SYNCHRONOUS LOCK
    // =====================================

    if (
      submitLockRef.current ||
      busy
    ) {
      return;
    }

    // =====================================
    // EMPTY CONTENT
    // =====================================

    if (!hasContent) {
      setLocalError(
        "Sharh matni bo‘sh bo‘lishi mumkin emas."
      );

      return;
    }

    // =====================================
    // LENGTH VALIDATION
    // =====================================

    if (!isWithinLimit) {
      setLocalError(
        "Sharh 255 ta belgidan oshmasligi kerak."
      );

      return;
    }

    // =====================================
    // UNCHANGED CONTENT
    // =====================================

    if (!hasChanged) {
      setLocalError(
        "Saqlash uchun sharh matnini o‘zgartiring."
      );

      return;
    }

    // =====================================
    // CALLBACK CHECK
    // =====================================

    if (typeof onSave !== "function") {
      setLocalError(
        "Sharhni saqlash funksiyasi mavjud emas."
      );

      return;
    }

    // =====================================
    // LOCK
    // =====================================

    submitLockRef.current = true;

    setLocalSaving(true);
    setLocalError("");
    setHidePreviousError(false);

    try {
      // The parent hook handles:
      // - API
      // - Redux
      // - siteToast
      // - Closing edit mode

      await onSave();

      // Do not clear the textarea here.
      // Parent controls edit state and
      // updates the actual comment.
    } catch {
      if (mountedRef.current) {
        setLocalError(
          "O‘zgarishlarni saqlab bo‘lmadi. " +
          "Matningiz saqlangan, qayta urinib ko‘ring."
        );
      }
    } finally {
      submitLockRef.current = false;

      if (mountedRef.current) {
        setLocalSaving(false);
      }
    }
  };

  // =======================================================
  // KEYBOARD SHORTCUT
  // =======================================================

  const handleKeyDown = (event) => {
    if (
      event.key !== "Enter" ||
      (!event.ctrlKey && !event.metaKey)
    ) {
      return;
    }

    if (
      event.nativeEvent?.isComposing ||
      busy
    ) {
      return;
    }

    event.preventDefault();

    // Use the same validation and
    // submit lock as the save button.

    formRef.current?.requestSubmit?.();
  };

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      aria-busy={busy}
      className={`
        relative
        isolate

        w-full
        min-w-0
        max-w-full
        overflow-hidden

        rounded-[18px]
        border
        border-indigo-200/80

        bg-white/85

        p-3

        font-sans

        sm:rounded-[22px]
        sm:p-4

        dark:border-indigo-400/[0.15]
        dark:bg-[#0c1320]/85

        ${className}
      `}
    >
      {/* =====================================
          DECORATIVE TOP LINE
      ===================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-px

          bg-gradient-to-r
          from-transparent
          via-indigo-500/60
          to-transparent

          dark:via-indigo-400/45
        "
      />

      {/* =====================================
          EDITOR HEADER
      ===================================== */}

      <div
        className="
          mb-3
          flex
          min-w-0
          flex-wrap
          items-center
          justify-between
          gap-2
        "
      >
        <div
          className="
            inline-flex
            items-center
            gap-2

            font-mono
            text-[10px]
            font-bold
            uppercase
            tracking-[0.10em]
            text-indigo-700

            dark:text-indigo-300
          "
        >
          <span
            aria-hidden="true"
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-emerald-500
            "
          />

          Comment / Edit
        </div>

        <span
          className="
            hidden
            items-center
            gap-1.5

            font-mono
            text-[10px]
            text-slate-500

            sm:inline-flex

            dark:text-slate-400
          "
        >
          <Keyboard
            size={13}
            aria-hidden="true"
          />

          Ctrl + Enter
        </span>
      </div>

      {/* =====================================
          TEXTAREA
      ===================================== */}

      <label
        htmlFor={inputId}
        className="sr-only"
      >
        Sharhning tahrirlangan matni
      </label>

      <textarea
        id={inputId}
        name="edit-comment"
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        rows={4}
        maxLength={MAX_LENGTH}
        disabled={busy}
        autoFocus
        aria-invalid={Boolean(visibleError)}
        aria-describedby={
          visibleError
            ? `${helpId} ${counterId} ${errorId}`
            : `${helpId} ${counterId}`
        }
        placeholder="Sharhni tahrirlang..."
        className="
          block
          min-h-[120px]
          w-full
          min-w-0
          max-w-full
          resize-y

          rounded-xl
          border
          border-slate-200
          bg-slate-50/90

          px-3.5
          py-3.5

          text-base
          font-medium
          leading-7
          text-slate-900

          outline-none
          transition-colors
          duration-200

          placeholder:text-slate-400

          focus:border-indigo-400
          focus:bg-white
          focus:ring-4
          focus:ring-indigo-500/10

          disabled:cursor-not-allowed
          disabled:opacity-60

          sm:min-h-[145px]
          sm:rounded-2xl
          sm:px-4

          dark:border-white/[0.10]
          dark:bg-[#080d16]
          dark:text-slate-100
          dark:placeholder:text-slate-500

          dark:focus:border-indigo-400/50
          dark:focus:bg-[#0b1422]
          dark:focus:ring-indigo-500/[0.08]

          motion-reduce:transition-none
        "
      />

      {/* =====================================
          INLINE ERROR
      ===================================== */}

      {visibleError && (
        <div
          id={errorId}
          role="alert"
          className="
            mt-3
            flex
            min-w-0
            items-start
            gap-2.5

            rounded-xl
            border
            border-red-200
            bg-red-50

            p-3

            dark:border-red-400/20
            dark:bg-red-500/[0.08]
          "
        >
          <AlertCircle
            size={17}
            className="
              mt-0.5
              shrink-0
              text-red-600

              dark:text-red-300
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
              text-red-700

              dark:text-red-200
            "
          >
            {visibleError}
          </p>
        </div>
      )}

      {/* =====================================
          FOOTER
      ===================================== */}

      <div
        className="
          mt-4
          flex
          w-full
          min-w-0
          flex-col
          gap-3

          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        {/* COUNTER AND HINT */}

        <div className="min-w-0">
          <div
            className="
              flex
              flex-wrap
              items-center
              gap-2
            "
          >
            <span
              id={counterId}
              className={`
                font-mono
                text-[11px]
                font-bold
                tabular-nums

                ${
                  isNearLimit
                    ? `
                      text-amber-700
                      dark:text-amber-300
                    `
                    : `
                      text-slate-500
                      dark:text-slate-400
                    `
                }
              `}
            >
              {characterCount}/{MAX_LENGTH}
            </span>

            {isNearLimit && (
              <span
                className="
                  text-[11px]
                  font-medium
                  text-amber-700

                  dark:text-amber-300
                "
              >
                {remainingCharacters} ta belgi qoldi
              </span>
            )}
          </div>

          <p
            id={helpId}
            className="
              mt-1.5
              break-words
              text-[11px]
              font-medium
              leading-5
              text-slate-500

              dark:text-slate-400
            "
          >
            {busy
              ? "O‘zgarishlar saqlanmoqda..."
              : !hasChanged
                ? "Matnni o‘zgartirgach saqlashingiz mumkin."
                : "Tahrirlangan matn tayyor."}
          </p>
        </div>

        {/* =================================
            BUTTONS
        ================================= */}

        <div
          className="
            grid
            w-full
            min-w-0
            grid-cols-2
            gap-2

            sm:flex
            sm:w-auto
            sm:items-center
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
              size={15}
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
                size={16}
                className="
                  shrink-0
                  motion-safe:animate-spin
                "
                aria-hidden="true"
              />
            ) : hasChanged ? (
              <Save
                size={16}
                className="shrink-0"
                aria-hidden="true"
              />
            ) : (
              <Check
                size={16}
                className="shrink-0"
                aria-hidden="true"
              />
            )}

            <span>
              {busy
                ? "Saqlanmoqda..."
                : "Saqlash"}
            </span>
          </button>
        </div>
      </div>

      {/* =====================================
          SCREEN READER STATUS
      ===================================== */}

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
};

export default memo(PostCommentEditForm);
