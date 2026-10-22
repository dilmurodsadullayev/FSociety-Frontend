
import React, {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowUpRight,
  CornerDownRight,
  Loader2,
  MessageSquareText,
  Send,
  Terminal,
  X,
} from "lucide-react";

import { siteToast } from "../../ui/AuthToast";

// =========================================================
// FSOCIETY — COMPACT COMMENT COMPOSER
// =========================================================
//
// Design:
// - Reddit-inspired compact input
// - Mr. Robot terminal accents
// - Expand on click
// - Light / Dark Mode
// - Mobile responsive
//
// Features:
// - Existing onSubmit(message) contract
// - Authentication protection
// - Character validation
// - Ctrl / Cmd + Enter
// - Prevent duplicate submissions
// - Preserve draft on failure
// - Clear draft only after success
// =========================================================

const MAX_LENGTH = 255;

// =========================================================
// AVATAR
// =========================================================

const CommentFormAvatar = memo(
  function CommentFormAvatar({ user }) {
    const [imageError, setImageError] = useState(false);

    const rawImage =
      user?.image?.url ??
      user?.image ??
      user?.avatar ??
      "";

    const image =
      typeof rawImage === "string"
        ? rawImage.trim()
        : "";

    useEffect(() => {
      setImageError(false);
    }, [image]);

    const username =
      user?.username ||
      user?.first_name ||
      "F";

    const initial = String(username)
      .charAt(0)
      .toUpperCase();

    return (
      <div className="relative shrink-0">
        {image && !imageError ? (
          <img
            src={image}
            alt={`${username} avatari`}
            loading="lazy"
            onError={() => setImageError(true)}
            className="
              h-9 w-9 rounded-xl
              border border-slate-200
              object-cover
              shadow-sm
              dark:border-white/[0.12]
              sm:h-10 sm:w-10
            "
          />
        ) : (
          <span
            aria-hidden="true"
            className="
              grid h-9 w-9
              place-items-center
              rounded-xl
              border border-rose-200
              bg-rose-50
              font-mono text-sm font-black
              text-rose-600

              dark:border-rose-400/20
              dark:bg-rose-500/10
              dark:text-rose-300

              sm:h-10 sm:w-10
            "
          >
            {initial}
          </span>
        )}
      </div>
    );
  }
);

// =========================================================
// MAIN COMPONENT
// =========================================================

function PostCommentForm({
  currentUser,
  isLoggedIn,
  isSubmitting = false,
  onSubmit,
}) {
  // =====================================================
  // LOCAL STATE
  // =====================================================

  const [expanded, setExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [localSubmitting, setLocalSubmitting] =
    useState(false);

  // =====================================================
  // REFS
  // =====================================================

  const textareaRef = useRef(null);
  const submitLockRef = useRef(false);
  const mountedRef = useRef(false);

  // =====================================================
  // DERIVED VALUES
  // =====================================================

  const cleanMessage = message.trim();
  const characterCount = message.length;

  const busy = Boolean(
    isSubmitting || localSubmitting
  );

  const canSubmit =
    Boolean(isLoggedIn) &&
    !busy &&
    cleanMessage.length > 0 &&
    characterCount <= MAX_LENGTH;

  // =====================================================
  // LIFECYCLE
  // =====================================================

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  // =====================================================
  // AUTOFOCUS ON EXPAND
  // =====================================================

  useEffect(() => {
    if (expanded && isLoggedIn) {
      textareaRef.current?.focus();
    }
  }, [expanded, isLoggedIn]);

  // =====================================================
  // AUTH WARNING
  // =====================================================

  const showAuthWarning = useCallback(() => {
    siteToast.warning(
      "Sharh yozish uchun avval tizimga kiring.",
      {
        title: "Kirish talab qilinadi",
        duration: 4000,
      }
    );
  }, []);

  // =====================================================
  // OPEN COMPOSER
  // =====================================================

  const handleExpand = useCallback(() => {
    if (!isLoggedIn) {
      showAuthWarning();
      return;
    }

    if (busy) return;

    setExpanded(true);
    setError("");
  }, [isLoggedIn, busy, showAuthWarning]);

  // =====================================================
  // COLLAPSE COMPOSER
  // =====================================================

  const handleCollapse = useCallback(() => {
    if (busy) return;

    // Draft is intentionally preserved.
    setExpanded(false);
    setError("");
  }, [busy]);

  // =====================================================
  // CHANGE MESSAGE
  // =====================================================

  const handleMessageChange = useCallback(
    (event) => {
      setMessage(event.target.value);

      if (error) {
        setError("");
      }
    },
    [error]
  );

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = useCallback(
    async (event) => {
      event?.preventDefault?.();

      if (
        busy ||
        submitLockRef.current
      ) {
        return;
      }

      // -----------------------------------------------
      // AUTHENTICATION
      // -----------------------------------------------

      if (!isLoggedIn) {
        showAuthWarning();
        return;
      }

      // -----------------------------------------------
      // MESSAGE VALIDATION
      // -----------------------------------------------

      if (!cleanMessage) {
        setError("Sharh matnini kiriting.");
        textareaRef.current?.focus();
        return;
      }

      if (characterCount > MAX_LENGTH) {
        setError(
          `Sharh ${MAX_LENGTH} ta belgidan oshmasligi kerak.`
        );
        return;
      }

      if (typeof onSubmit !== "function") {
        setError(
          "Sharh yuborish funksiyasi mavjud emas."
        );
        return;
      }

      // -----------------------------------------------
      // SYNCHRONOUS SUBMISSION LOCK
      // -----------------------------------------------

      submitLockRef.current = true;
      setLocalSubmitting(true);
      setError("");

      try {
        // Existing PostCommentsSection expects:
        //
        // onSubmit(message) -> Promise<boolean>

        const success = await onSubmit(
          cleanMessage
        );

        if (!mountedRef.current) {
          return;
        }

        // ---------------------------------------------
        // SUCCESS
        // ---------------------------------------------

        if (success === true) {
          setMessage("");
          setError("");
          setExpanded(false);
          return;
        }

        // ---------------------------------------------
        // FAILURE
        // ---------------------------------------------

        // Keep the draft.
        // The parent displays detailed API errors
        // using siteToast and Redux.

        setError(
          "Sharh yuborilmadi. Batafsil xabarni bildirishnomadan ko‘ring."
        );
      } catch (requestError) {
        if (!mountedRef.current) {
          return;
        }

        setError(
          requestError?.message ||
          "Sharh yuborishda xato yuz berdi."
        );
      } finally {
        submitLockRef.current = false;

        if (mountedRef.current) {
          setLocalSubmitting(false);
        }
      }
    },
    [
      busy,
      isLoggedIn,
      cleanMessage,
      characterCount,
      onSubmit,
      showAuthWarning,
    ]
  );

  // =====================================================
  // KEYBOARD SHORTCUTS
  // =====================================================

  const handleKeyDown = useCallback(
    (event) => {
      if (
        event.key === "Escape" &&
        !busy
      ) {
        event.preventDefault();
        handleCollapse();
        return;
      }

      if (
        event.key === "Enter" &&
        (event.ctrlKey || event.metaKey) &&
        !event.nativeEvent?.isComposing
      ) {
        event.preventDefault();

        if (canSubmit) {
          handleSubmit(event);
        }
      }
    },
    [
      busy,
      canSubmit,
      handleCollapse,
      handleSubmit,
    ]
  );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      className="
        group/composer
        relative mb-5
        min-w-0 max-w-full
        overflow-hidden
        rounded-2xl
        border border-slate-200
        bg-white

        shadow-[0_8px_30px_rgba(15,23,42,0.035)]

        transition-[border-color,box-shadow]
        duration-200

        hover:border-slate-300

        dark:border-white/[0.09]
        dark:bg-[#101319]
        dark:shadow-[0_10px_35px_rgba(0,0,0,0.15)]
        dark:hover:border-white/[0.17]

        motion-reduce:transition-none
      "
    >
      {/* MR. ROBOT SIGNAL */}
      <span
        aria-hidden="true"
        className="
          pointer-events-none
          absolute bottom-3 left-0 top-3
          w-[2px] rounded-r-full
          bg-gradient-to-b
          from-rose-500
          via-rose-500/30
          to-transparent
        "
      />

      {/* TOP LABEL */}
      <div
        className="
          flex min-w-0
          items-center justify-between
          gap-2
          border-b border-slate-100
          px-3 py-2

          dark:border-white/[0.055]

          sm:px-4
        "
      >
        <span
          className="
            inline-flex min-w-0
            items-center gap-1.5
            font-mono text-[10px]
            font-bold uppercase
            tracking-[0.10em]
            text-slate-500

            dark:text-slate-400
          "
        >
          <Terminal
            size={12}
            className="shrink-0 text-rose-500"
            aria-hidden="true"
          />

          <span className="truncate">
            NEW_MESSAGE
          </span>
        </span>

        <span
          className="
            font-mono text-[9px]
            font-semibold
            text-slate-400
            dark:text-slate-500
          "
        >
          FS / DISCUSSION
        </span>
      </div>

      {/* MAIN FORM AREA */}
      <div
        className="
          flex min-w-0
          items-start gap-3
          px-3 py-3

          sm:px-4 sm:py-3.5
        "
      >
        <CommentFormAvatar user={currentUser} />

        <div className="min-w-0 flex-1">
          {/* ==========================================
              COLLAPSED VIEW
             ========================================== */}

          {!expanded && (
            <button
              type="button"
              onClick={handleExpand}
              disabled={busy}
              aria-expanded={false}
              className="
                flex min-h-11
                w-full min-w-0
                items-center
                justify-between
                gap-3
                rounded-xl
                border border-slate-200
                bg-slate-50/80
                px-3 py-2.5
                text-left

                transition-all duration-200

                hover:border-rose-300
                hover:bg-rose-50/30

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-rose-400

                disabled:cursor-not-allowed
                disabled:opacity-60

                dark:border-white/[0.09]
                dark:bg-white/[0.035]
                dark:hover:border-rose-400/30
                dark:hover:bg-rose-400/[0.045]

                motion-reduce:transition-none
              "
            >
              <span
                className="
                  flex min-w-0
                  items-center gap-2
                  text-[12px] font-medium
                  text-slate-400

                  dark:text-slate-500

                  sm:text-[13px]
                "
              >
                <MessageSquareText
                  size={16}
                  className="shrink-0 text-slate-400"
                  aria-hidden="true"
                />

                <span className="truncate">
                  {message.trim()
                    ? message
                    : "O‘z fikringizni qoldiring..."}
                </span>
              </span>

              <ArrowUpRight
                size={16}
                className="
                  shrink-0
                  text-slate-400
                  transition-colors
                  group-hover/composer:text-rose-500
                "
                aria-hidden="true"
              />
            </button>
          )}

          {/* ==========================================
              EXPANDED VIEW
             ========================================== */}

          {expanded && (
            <form
              onSubmit={handleSubmit}
              className="min-w-0"
            >
              {/* EDITOR HEADING */}
              <div className="mb-2 flex min-w-0 items-center justify-between gap-2">
                <div className="min-w-0">
                  <p
                    className="
                      text-[12px] font-extrabold
                      text-slate-900
                      dark:text-slate-100
                    "
                  >
                    Muhokamaga qo‘shiling
                  </p>

                  <p
                    className="
                      mt-0.5 text-[10px]
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Savol, fikr yoki yechim yozing.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCollapse}
                  disabled={busy}
                  aria-label="Sharh oynasini yopish"
                  title="Yopish (Esc)"
                  className="
                    grid h-8 w-8
                    shrink-0
                    place-items-center
                    rounded-lg
                    text-slate-400

                    transition-colors

                    hover:bg-slate-100
                    hover:text-slate-700

                    dark:hover:bg-white/[0.07]
                    dark:hover:text-slate-200

                    disabled:opacity-50
                  "
                >
                  <X size={15} />
                </button>
              </div>

              {/* TEXTAREA */}
              <label
                htmlFor="fsociety-root-comment"
                className="sr-only"
              >
                Yangi sharh matni
              </label>

              <textarea
                ref={textareaRef}
                id="fsociety-root-comment"
                value={message}
                onChange={handleMessageChange}
                onKeyDown={handleKeyDown}
                rows={3}
                maxLength={MAX_LENGTH}
                disabled={busy || !isLoggedIn}
                placeholder="Fikringizni yoki savolingizni yozing..."
                aria-invalid={Boolean(error)}
                aria-describedby={
                  error
                    ? "fsociety-comment-error"
                    : "fsociety-comment-help"
                }
                className="
                  block w-full
                  min-w-0 max-w-full
                  min-h-[96px]
                  resize-y

                  rounded-xl
                  border border-slate-200
                  bg-slate-50/60

                  px-3 py-3

                  text-[13px] leading-6
                  text-slate-900

                  outline-none

                  placeholder:text-slate-400

                  transition-[border-color,box-shadow]

                  focus:border-rose-400
                  focus:bg-white
                  focus:ring-2
                  focus:ring-rose-400/10

                  disabled:cursor-not-allowed
                  disabled:opacity-65

                  dark:border-white/[0.10]
                  dark:bg-[#0b0e14]
                  dark:text-slate-100
                  dark:placeholder:text-slate-500
                  dark:focus:border-rose-400/50
                  dark:focus:bg-[#0b0e14]

                  motion-reduce:transition-none
                "
              />

              {/* ERROR */}
              {error && (
                <div
                  id="fsociety-comment-error"
                  role="alert"
                  className="
                    mt-2
                    whitespace-pre-line
                    break-words

                    rounded-lg
                    border border-red-200
                    bg-red-50

                    px-3 py-2

                    text-[11px] leading-5
                    text-red-700

                    dark:border-red-400/20
                    dark:bg-red-500/[0.08]
                    dark:text-red-300
                  "
                >
                  {error}
                </div>
              )}

              {/* FOOTER */}
              <div
                className="
                  mt-2.5
                  flex min-w-0
                  flex-wrap items-center
                  justify-between
                  gap-2
                "
              >
                <div
                  className="
                    flex min-w-0
                    flex-wrap items-center
                    gap-x-3 gap-y-1
                  "
                >
                  <span
                    className={`
                      font-mono
                      text-[10px]
                      font-semibold

                      ${
                        characterCount >= 240
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-slate-400 dark:text-slate-500"
                      }
                    `}
                  >
                    {characterCount}/{MAX_LENGTH}
                  </span>

                  <span
                    id="fsociety-comment-help"
                    className="
                      hidden items-center
                      gap-1
                      font-mono text-[10px]
                      text-slate-400

                      dark:text-slate-500

                      min-[440px]:inline-flex
                    "
                  >
                    <CornerDownRight
                      size={12}
                      aria-hidden="true"
                    />

                    Ctrl + Enter
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  aria-busy={busy}
                  className="
                    inline-flex min-h-9
                    items-center
                    justify-center
                    gap-2

                    rounded-lg
                    bg-rose-600
                    px-4 py-2

                    text-[11px] font-extrabold
                    text-white

                    shadow-[0_4px_12px_rgba(225,29,72,0.15)]

                    transition-all duration-200

                    hover:bg-rose-700
                    hover:shadow-[0_5px_16px_rgba(225,29,72,0.25)]

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-rose-400
                    focus-visible:ring-offset-2

                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    disabled:shadow-none

                    dark:bg-rose-600
                    dark:hover:bg-rose-500

                    motion-reduce:transition-none
                  "
                >
                  {busy ? (
                    <Loader2
                      size={14}
                      className="animate-spin motion-reduce:animate-none"
                      aria-hidden="true"
                    />
                  ) : (
                    <Send
                      size={14}
                      aria-hidden="true"
                    />
                  )}

                  {busy
                    ? "Yuborilmoqda..."
                    : "Yuborish"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* SMALL SIGNATURE */}
      <div
        className="
          flex min-w-0
          flex-wrap items-center
          justify-between
          gap-x-2 gap-y-1

          border-t border-slate-100
          bg-slate-50/50
          px-3 py-2

          dark:border-white/[0.055]
          dark:bg-white/[0.015]

          sm:px-4
        "
      >
        <span
          className="
            font-mono text-[9px]
            font-medium
            text-slate-400

            dark:text-slate-500
          "
        >
          FSOCIETY://WRITE_ACCESS
        </span>

        <span
          className="
            font-mono text-[9px]
            text-slate-400

            dark:text-slate-500
          "
        >
          BE RESPECTFUL · SHARE IDEAS
        </span>
      </div>
    </div>
  );
}

export default memo(PostCommentForm);
