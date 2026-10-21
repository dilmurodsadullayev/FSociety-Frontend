
import React, { memo } from "react";

import {
  Loader2,
  Save,
  Send,
  X,
} from "lucide-react";

// =========================================================
// FSOCIETY — POST CREATE / EDIT FOOTER
// =========================================================
//
// Existing public props:
// - isEditMode
// - isSubmitting
// - onClose
//
// Features:
// - Create / Edit labels
// - Light / Dark Mode
// - Responsive 320px+
// - Mobile safe-area support
// - Minimum 44px touch targets
// - Loading protection
// - Accessible submit button
// - Site typography
//
// IMPORTANT:
// Submit stays inside the parent form.
// This component performs no API requests.
// =========================================================

// =========================================================
// SHARED BUTTON STYLE
// =========================================================

const BUTTON_BASE = `
  relative
  inline-flex
  min-h-11
  w-full
  min-w-0
  items-center
  justify-center
  gap-2
  overflow-hidden
  rounded-xl
  border
  px-4
  py-3

  text-center
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
  disabled:opacity-55
  disabled:active:scale-100

  sm:w-auto
  sm:rounded-2xl
  sm:px-5
  sm:text-sm

  dark:focus-visible:ring-offset-[#0b1018]

  motion-reduce:transform-none
  motion-reduce:transition-none
`;

const CANCEL_BUTTON_CLASS = `
  ${BUTTON_BASE}

  border-slate-200
  bg-white
  text-slate-700

  hover:border-slate-300
  hover:bg-slate-100

  dark:border-white/[0.10]
  dark:bg-white/[0.04]
  dark:text-slate-200

  dark:hover:border-white/[0.18]
  dark:hover:bg-white/[0.08]
`;

const SUBMIT_BUTTON_CLASS = `
  ${BUTTON_BASE}

  group
  border-indigo-600/30

  bg-gradient-to-r
  from-indigo-600
  via-violet-600
  to-purple-600

  text-white
  shadow-[0_8px_25px_rgba(79,70,229,0.20)]

  hover:shadow-[0_10px_30px_rgba(79,70,229,0.30)]

  sm:min-w-[190px]

  dark:border-indigo-400/25
  dark:shadow-[0_10px_28px_rgba(99,102,241,0.12)]
`;

// =========================================================
// MAIN FOOTER
// =========================================================

const PostCreateFooter = ({
  isEditMode = false,
  isSubmitting = false,
  onClose,
}) => {
  // =======================================================
  // STATE
  // =======================================================

  const busy = Boolean(isSubmitting);

  const canClose =
    !busy &&
    typeof onClose === "function";

  // =======================================================
  // MODE LABELS
  // =======================================================

  const submitText = isEditMode
    ? "O‘zgarishlarni saqlash"
    : "Postni chop etish";

  const loadingText = isEditMode
    ? "Saqlanmoqda..."
    : "Chop etilmoqda...";

  const SubmitIcon = isEditMode
    ? Save
    : Send;

  // =======================================================
  // HANDLERS
  // =======================================================

  const handleClose = () => {
    if (!canClose) {
      return;
    }

    onClose();
  };

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <footer
      aria-label={
        isEditMode
          ? "Postni tahrirlash amallari"
          : "Post yaratish amallari"
      }
      className="
        relative
        z-20
        w-full
        min-w-0
        shrink-0
        border-t
        border-slate-200
        bg-slate-50/95

        px-3
        pt-3
        pb-[max(12px,env(safe-area-inset-bottom))]

        font-sans
        backdrop-blur-xl

        min-[380px]:px-4

        sm:px-7
        sm:py-4

        dark:border-white/[0.08]
        dark:bg-[#0b1018]/95
      "
    >
      {/* =====================================
          FOOTER LAYOUT
      ===================================== */}

      <div
        className="
          flex
          w-full
          min-w-0
          flex-col
          gap-3

          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:gap-4
        "
      >
        {/* =================================
            KEYBOARD / LOADING HINT
        ================================= */}

        <p
          role="status"
          aria-live="polite"
          className="
            hidden
            min-w-0
            text-[11px]
            font-medium
            leading-5
            text-slate-500

            sm:block

            dark:text-slate-400
          "
        >
          {busy
            ? "Iltimos, jarayon tugashini kuting."
            : "ESC tugmasi orqali ham yopishingiz mumkin."}
        </p>

        {/* =================================
            ACTION BUTTONS
        ================================= */}

        <div
          className="
            grid
            w-full
            min-w-0
            grid-cols-1
            gap-2.5

            min-[380px]:grid-cols-2

            sm:flex
            sm:w-auto
            sm:items-center
            sm:gap-3
          "
        >
          {/* =============================
              CANCEL
          ============================= */}

          <button
            type="button"
            onClick={handleClose}
            disabled={!canClose}
            aria-label={
              isEditMode
                ? "Tahrirlash oynasini yopish"
                : "Post yaratishni bekor qilish"
            }
            className={CANCEL_BUTTON_CLASS}
          >
            <X
              size={17}
              className="shrink-0"
              aria-hidden="true"
            />

            <span className="min-w-0 break-words">
              Bekor qilish
            </span>
          </button>

          {/* =============================
              SUBMIT
          ============================= */}

          <button
            type="submit"
            disabled={busy}
            aria-busy={busy}
            aria-label={
              busy
                ? loadingText
                : submitText
            }
            className={SUBMIT_BUTTON_CLASS}
          >
            {/* DECORATIVE SHINE */}

            <span
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-y-0
                -left-20
                w-16
                rotate-12
                bg-white/15
                blur-md
                transition-all
                duration-700

                group-hover:left-[120%]

                group-focus-visible:left-[120%]

                motion-reduce:transition-none
              "
            />

            {/* BUTTON CONTENT */}

            <span
              className="
                relative
                z-10
                inline-flex
                min-w-0
                items-center
                justify-center
                gap-2
              "
            >
              {busy ? (
                <Loader2
                  size={18}
                  className="
                    shrink-0
                    motion-safe:animate-spin
                  "
                  aria-hidden="true"
                />
              ) : (
                <SubmitIcon
                  size={18}
                  className="shrink-0"
                  aria-hidden="true"
                />
              )}

              <span
                className="
                  min-w-0
                  break-words
                  text-center
                "
              >
                {busy
                  ? loadingText
                  : submitText}
              </span>
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default memo(PostCreateFooter);
