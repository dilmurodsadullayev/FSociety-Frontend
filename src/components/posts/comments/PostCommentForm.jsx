
import React, {
  memo,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AlertCircle,
  CheckCircle2,
  Keyboard,
  Loader2,
  LockKeyhole,
  MessageSquareText,
  Send,
} from "lucide-react";

import {
  getCommentAvatarUrl,
  handleCommentAvatarError,
} from "./commentUtils";

// =========================================================
// FSOCIETY — POST COMMENT FORM
// =========================================================
//
// Props:
//
// - currentUser
// - isLoggedIn
// - isSubmitting
// - onSubmit
//
// Features:
//
// - Create comment
// - Light / Dark Mode
// - Responsive from 320px
// - Site typography
// - Avatar
// - 255-character limit
// - Validation
// - Submit loading
// - Synchronous submit lock
// - Draft preservation on errors
// - Ctrl / Cmd + Enter
// - Accessible form controls
//
// IMPORTANT:
//
// Universal siteToast is handled by
// PostCommentsSection.
//
// Do not duplicate toast messages here.
//
// =========================================================

// =========================================================
// CONSTANTS
// =========================================================

const MAX_COMMENT_LENGTH = 255;

const CARD_CLASS = `
  relative
  w-full
  min-w-0
  max-w-full
  overflow-hidden

  rounded-[22px]
  border
  border-slate-200
  bg-white/85

  p-3

  shadow-[0_12px_40px_rgba(15,23,42,0.04)]

  sm:rounded-3xl
  sm:p-5

  dark:border-white/[0.08]
  dark:bg-[#0d1320]/80
  dark:shadow-[0_15px_45px_rgba(0,0,0,0.16)]
`;

const TEXTAREA_CLASS = `
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

  sm:min-h-[135px]
  sm:rounded-2xl
  sm:px-4

  dark:border-white/[0.10]
  dark:bg-[#080d16]/85
  dark:text-slate-100

  dark:placeholder:text-slate-500

  dark:focus:border-indigo-400/50
  dark:focus:bg-[#0a1120]
  dark:focus:ring-indigo-500/[0.08]

  motion-reduce:transition-none
`;

const SUBMIT_BUTTON_CLASS = `
  inline-flex
  min-h-11
  w-full
  min-w-0
  items-center
  justify-center
  gap-2

  rounded-xl
  border
  border-indigo-500/30

  bg-indigo-600

  px-5
  py-3

  text-sm
  font-black
  text-white

  shadow-[0_8px_25px_rgba(79,70,229,0.18)]

  transition-all
  duration-200

  hover:bg-indigo-700

  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-indigo-500
  focus-visible:ring-offset-2

  active:scale-[0.98]

  disabled:cursor-not-allowed
  disabled:opacity-50
  disabled:active:scale-100

  sm:w-auto
  sm:min-w-[135px]

  dark:border-indigo-400/25
  dark:bg-indigo-500
  dark:hover:bg-indigo-400

  dark:focus-visible:ring-offset-[#0d1320]

  motion-reduce:transform-none
  motion-reduce:transition-none
`;

// =========================================================
// MAIN FORM
// =========================================================

const PostCommentForm = ({
  currentUser = null,
  isLoggedIn = false,
  isSubmitting = false,
  onSubmit,
}) => {
  // =======================================================
  // IDS
  // =======================================================

  const inputId = useId();
  const helpId = useId();
  const errorId = useId();
  const counterId = useId();

  // =======================================================
  // STATE
  // =======================================================

  const [message, setMessage] = useState("");

  const [localError, setLocalError] =
    useState("");

  const [
    isLocalSubmitting,
    setIsLocalSubmitting,
  ] = useState(false);

  // =======================================================
  // REFS
  // =======================================================

  const submitLockRef = useRef(false);

  const formRef = useRef(null);

  // =======================================================
  // AVATAR
  // =======================================================

  const avatarUrl = useMemo(
    () => getCommentAvatarUrl(currentUser),
    [currentUser]
  );

  // =======================================================
  // VALUES
  // =======================================================

  const cleanMessage = message.trim();

  const characterCount = message.length;

  const remainingCharacters = Math.max(
    0,
    MAX_COMMENT_LENGTH - characterCount
  );

  const isNearLimit =
    characterCount >= 230;

  const isBusy = Boolean(
    isSubmitting || isLocalSubmitting
  );

  const canSubmit = Boolean(
    isLoggedIn &&
    !isBusy &&
    cleanMessage &&
    characterCount <= MAX_COMMENT_LENGTH &&
    typeof onSubmit === "function"
  );

  // =======================================================
  // INPUT CHANGE
  // =======================================================

  const handleChange = (event) => {
    if (isBusy) {
      return;
    }

    setMessage(event.target.value);

    if (localError) {
      setLocalError("");
    }
  };

  // =======================================================
  // SUBMIT
  // =======================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    // =====================================
    // SYNCHRONOUS LOCK
    // =====================================

    if (
      submitLockRef.current ||
      isBusy
    ) {
      return;
    }

    // =====================================
    // AUTH CHECK
    // =====================================

    if (!isLoggedIn) {
      setLocalError(
        "Sharh qoldirish uchun tizimga kiring."
      );

      return;
    }

    // =====================================
    // EMPTY MESSAGE
    // =====================================

    if (!cleanMessage) {
      setLocalError(
        "Sharh matnini kiriting."
      );

      return;
    }

    // =====================================
    // LENGTH
    // =====================================

    if (
      characterCount > MAX_COMMENT_LENGTH
    ) {
      setLocalError(
        "Sharh 255 ta belgidan oshmasligi kerak."
      );

      return;
    }

    // =====================================
    // SUBMIT CALLBACK
    // =====================================

    if (typeof onSubmit !== "function") {
      setLocalError(
        "Sharhni yuborish funksiyasi mavjud emas."
      );

      return;
    }

    // =====================================
    // SNAPSHOT
    // =====================================

    const submittedMessage = message;

    submitLockRef.current = true;

    setIsLocalSubmitting(true);

    setLocalError("");

    try {
      // ===================================
      // PARENT ACTION
      // ===================================

      const result = await onSubmit(
        cleanMessage
      );

      // ===================================
      // SUCCESS
      // ===================================

      if (result === true) {
        // Clear only the submitted draft.
        // This protects the user's input
        // against accidental loss.

        setMessage((previous) =>
          previous === submittedMessage
            ? ""
            : previous
        );

        return;
      }

      // ===================================
      // FAILURE
      // ===================================

      // Parent already shows siteToast.error.
      // Keep the draft so the user can retry.

      if (result === false) {
        return;
      }

      // Undefined results are not treated
      // as confirmed successful submissions.
    } catch {
      // The parent normally catches service
      // errors and returns false.
      //
      // This fallback prevents an uncaught
      // rejected callback from clearing
      // the user's draft.

      setLocalError(
        "Sharhni yuborib bo‘lmadi. " +
        "Matningiz saqlandi, qayta urinib ko‘ring."
      );
    } finally {
      submitLockRef.current = false;

      setIsLocalSubmitting(false);
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

    if (event.nativeEvent?.isComposing) {
      return;
    }

    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    formRef.current?.requestSubmit?.();
  };

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      aria-busy={isBusy}
      className={`
        mb-8
        font-sans
        ${CARD_CLASS}
      `}
    >
      {/* =====================================
          HEADER
      ===================================== */}

      <div
        className="
          mb-4
          flex
          min-w-0
          items-center
          gap-2.5
        "
      >
        <div
          className="
            grid
            h-9
            w-9
            shrink-0
            place-items-center
            rounded-xl

            border
            border-indigo-200
            bg-indigo-50
            text-indigo-600

            dark:border-indigo-400/20
            dark:bg-indigo-500/10
            dark:text-indigo-300
          "
        >
          <MessageSquareText
            size={17}
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0">
          <h3
            className="
              text-sm
              font-black
              tracking-tight
              text-slate-900

              dark:text-white
            "
          >
            Fikringizni bildiring
          </h3>

          <p
            className="
              mt-0.5
              text-[11px]
              font-medium
              text-slate-500

              dark:text-slate-400
            "
          >
            FSociety hamjamiyati
          </p>
        </div>
      </div>

      {/* =====================================
          FORM BODY
      ===================================== */}

      <div
        className="
          flex
          min-w-0
          items-start
          gap-2.5

          sm:gap-4
        "
      >
        {/* AVATAR */}

        <img
          src={avatarUrl}
          alt={
            currentUser?.username
              ? `${currentUser.username} profil rasmi`
              : "Foydalanuvchi rasmi"
          }
          onError={handleCommentAvatarError}
          className="
            h-9
            w-9
            shrink-0
            rounded-full

            border
            border-slate-200
            bg-slate-100
            object-cover

            sm:h-12
            sm:w-12

            dark:border-white/[0.10]
            dark:bg-[#111827]
          "
        />

        {/* FIELD CONTENT */}

        <div
          className="
            min-w-0
            flex-1
          "
        >
          <label
            htmlFor={inputId}
            className="sr-only"
          >
            Yangi sharh matni
          </label>

          {/* TEXTAREA */}

          <textarea
            id={inputId}
            name="comment"
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            rows={3}
            maxLength={MAX_COMMENT_LENGTH}
            disabled={
              !isLoggedIn || isBusy
            }
            required
            aria-invalid={Boolean(localError)}
            aria-describedby={
              localError
                ? `${helpId} ${counterId} ${errorId}`
                : `${helpId} ${counterId}`
            }
            placeholder={
              isLoggedIn
                ? "O‘z fikringizni qoldiring..."
                : "Sharh yozish uchun avval tizimga kiring..."
            }
            className={TEXTAREA_CLASS}
          />

          {/* =================================
              INLINE ERROR
          ================================= */}

          {localError && (
            <div
              id={errorId}
              role="alert"
              className="
                mt-3
                flex
                min-w-0
                items-start
                gap-2

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
                size={16}
                className="
                  mt-0.5
                  shrink-0
                  text-red-600

                  dark:text-red-300
                "
                aria-hidden="true"
              />

              <span
                className="
                  min-w-0
                  break-words
                  text-xs
                  font-medium
                  leading-5
                  text-red-700

                  dark:text-red-200
                "
              >
                {localError}
              </span>
            </div>
          )}

          {/* =================================
              FOOTER
          ================================= */}

          <div
            className="
              mt-4
              flex
              min-w-0
              flex-col
              gap-4

              sm:flex-row
              sm:items-end
              sm:justify-between
            "
          >
            {/* HELP AND COUNTER */}

            <div className="min-w-0">
              <p
                id={helpId}
                className="
                  break-words
                  text-[11px]
                  font-medium
                  leading-5
                  text-slate-500

                  dark:text-slate-400
                "
              >
                Hurmat bilan yozing. Spam
                va nomaqbul sharhlar
                o‘chirilishi mumkin.
              </p>

              <div
                className="
                  mt-2
                  flex
                  min-w-0
                  flex-wrap
                  items-center
                  gap-x-3
                  gap-y-1.5
                "
              >
                {/* COUNTER */}

                <span
                  id={counterId}
                  className={`
                    font-mono
                    text-[11px]
                    font-bold
                    tabular-nums

                    ${
                      isNearLimit
                        ? "text-amber-700 dark:text-amber-300"
                        : "text-slate-500 dark:text-slate-400"
                    }
                  `}
                >
                  {characterCount}/{MAX_COMMENT_LENGTH}
                </span>

                {/* REMAINING */}

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

                {/* SHORTCUT */}

                <span
                  className="
                    hidden
                    items-center
                    gap-1.5

                    text-[10px]
                    text-slate-400

                    md:inline-flex

                    dark:text-slate-500
                  "
                >
                  <Keyboard
                    size={13}
                    aria-hidden="true"
                  />

                  Ctrl + Enter
                </span>
              </div>
            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={!canSubmit}
              aria-busy={isBusy}
              className={SUBMIT_BUTTON_CLASS}
            >
              {isBusy ? (
                <Loader2
                  size={18}
                  className="
                    shrink-0
                    motion-safe:animate-spin
                  "
                  aria-hidden="true"
                />
              ) : !isLoggedIn ? (
                <LockKeyhole
                  size={17}
                  className="shrink-0"
                  aria-hidden="true"
                />
              ) : (
                <Send
                  size={17}
                  className="shrink-0"
                  aria-hidden="true"
                />
              )}

              <span>
                {isBusy
                  ? "Yuborilmoqda..."
                  : isLoggedIn
                    ? "Yuborish"
                    : "Kirish talab qilinadi"}
              </span>
            </button>
          </div>

          {/* =================================
              SCREEN READER STATUS
          ================================= */}

          <span
            role="status"
            aria-live="polite"
            className="sr-only"
          >
            {isBusy
              ? "Sharh serverga yuborilmoqda."
              : ""}
          </span>
        </div>
      </div>
    </form>
  );
};

export default memo(PostCommentForm);
