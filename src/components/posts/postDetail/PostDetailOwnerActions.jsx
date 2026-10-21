
import React from "react";

import {
  Edit3,
  Loader2,
  Settings2,
  ShieldCheck,
  Trash2,
} from "lucide-react";

// =========================================================
// FSOCIETY — POST DETAIL OWNER ACTIONS
// =========================================================
//
// Public props:
// - onEdit
// - onDelete
// - isUpdating
// - isDeleting
// - compact
//
// Additional optional prop:
// - className
//
// Features:
// - Light / Dark Mode
// - Responsive 320px+
// - Edit / Delete actions
// - Async loading indicators
// - Duplicate interaction prevention
// - Accessible buttons
// - FSociety branding
//
// API and modal handling remain in the parent.
// =========================================================

// =========================================================
// STYLES
// =========================================================

const PANEL_CLASS = `
  relative
  isolate
  w-full
  min-w-0
  max-w-full
  overflow-hidden

  border
  border-indigo-200/80

  bg-gradient-to-br
  from-indigo-50/90
  via-white/95
  to-purple-50/80

  shadow-[0_12px_40px_rgba(79,70,229,0.07)]

  dark:border-indigo-400/[0.16]
  dark:from-indigo-500/[0.09]
  dark:via-[#101522]/95
  dark:to-purple-500/[0.06]

  dark:shadow-[0_18px_50px_rgba(0,0,0,0.20)]
`;

const EDIT_BUTTON_CLASS = `
  group
  inline-flex
  min-h-11
  w-full
  min-w-0
  items-center
  justify-center
  gap-2
  rounded-xl

  border
  border-indigo-200
  bg-indigo-100/70

  px-3
  py-2.5

  text-xs
  font-black
  text-indigo-800

  transition-colors
  duration-200

  hover:border-indigo-300
  hover:bg-indigo-200/70

  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-indigo-500
  focus-visible:ring-offset-2

  disabled:cursor-not-allowed
  disabled:opacity-50

  dark:border-indigo-400/25
  dark:bg-indigo-500/[0.10]
  dark:text-indigo-200

  dark:hover:border-indigo-400/40
  dark:hover:bg-indigo-500/[0.17]

  dark:focus-visible:ring-offset-[#101522]

  motion-reduce:transition-none
`;

const DELETE_BUTTON_CLASS = `
  group
  inline-flex
  min-h-11
  w-full
  min-w-0
  items-center
  justify-center
  gap-2
  rounded-xl

  border
  border-red-200
  bg-red-50

  px-3
  py-2.5

  text-xs
  font-black
  text-red-700

  transition-colors
  duration-200

  hover:border-red-300
  hover:bg-red-100

  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-red-500
  focus-visible:ring-offset-2

  disabled:cursor-not-allowed
  disabled:opacity-50

  dark:border-red-400/20
  dark:bg-red-500/[0.08]
  dark:text-red-300

  dark:hover:border-red-400/35
  dark:hover:bg-red-500/[0.15]

  dark:focus-visible:ring-offset-[#101522]

  motion-reduce:transition-none
`;

// =========================================================
// OWNER ACTION PANEL
// =========================================================

const PostDetailOwnerActions = ({
  onEdit,
  onDelete,

  isUpdating = false,
  isDeleting = false,

  compact = false,

  className = "",
}) => {
  // =======================================================
  // STATE
  // =======================================================

  const updating = Boolean(isUpdating);
  const deleting = Boolean(isDeleting);

  const busy = updating || deleting;

  const canEdit =
    !busy &&
    typeof onEdit === "function";

  const canDelete =
    !busy &&
    typeof onDelete === "function";

  // =======================================================
  // HANDLERS
  // =======================================================

  const handleEdit = () => {
    if (!canEdit) {
      return;
    }

    onEdit();
  };

  const handleDelete = () => {
    if (!canDelete) {
      return;
    }

    // Only opens the confirmation modal.
    // Actual deletion must be confirmed
    // by the user in the parent component.

    onDelete();
  };

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <section
      aria-label="Postni boshqarish"
      aria-busy={busy}
      className={`
        ${PANEL_CLASS}

        ${
          compact
            ? "rounded-2xl p-4"
            : "rounded-3xl p-5"
        }

        ${className}
      `}
    >
      {/* =====================================
          DECORATIVE GLOW
      ===================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-16
          -top-16
          h-40
          w-40
          rounded-full
          bg-indigo-400/10
          blur-[55px]

          dark:bg-indigo-500/15
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-16
          -left-16
          h-36
          w-36
          rounded-full
          bg-purple-400/10
          blur-[55px]

          dark:bg-purple-500/10
        "
      />

      {/* =====================================
          CONTENT
      ===================================== */}

      <div
        className="
          relative
          z-10
          w-full
          min-w-0
        "
      >
        {/* =================================
            HEADER
        ================================= */}

        <div
          className="
            flex
            min-w-0
            items-start
            justify-between
            gap-3
          "
        >
          {/* HEADER LEFT */}

          <div
            className="
              flex
              min-w-0
              flex-1
              items-start
              gap-3
            "
          >
            {/* ICON */}

            <div
              className="
                grid
                h-10
                w-10
                shrink-0
                place-items-center
                rounded-xl

                border
                border-indigo-200
                bg-indigo-100/70
                text-indigo-700

                dark:border-indigo-400/20
                dark:bg-indigo-500/10
                dark:text-indigo-300
              "
            >
              <Settings2
                size={19}
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </div>

            {/* TEXT */}

            <div
              className="
                min-w-0
                flex-1
              "
            >
              <h3
                className="
                  break-words
                  text-sm
                  font-black
                  leading-5
                  tracking-tight
                  text-slate-900

                  dark:text-white
                "
              >
                Maqolani boshqarish
              </h3>

              <p
                className="
                  mt-1
                  break-words
                  text-[11px]
                  font-medium
                  leading-5
                  text-slate-600

                  dark:text-slate-400
                "
              >
                Bu post sizga tegishli.
              </p>
            </div>
          </div>

          {/* OWNER BADGE */}

          {!compact && (
            <div
              className="
                hidden
                shrink-0
                items-center
                gap-1.5
                rounded-full
                border
                border-emerald-200
                bg-emerald-50
                px-2.5
                py-1.5

                font-mono
                text-[9px]
                font-black
                uppercase
                tracking-wide
                text-emerald-700

                sm:inline-flex

                dark:border-emerald-400/20
                dark:bg-emerald-400/[0.07]
                dark:text-emerald-300
              "
            >
              <ShieldCheck
                size={12}
                aria-hidden="true"
              />

              Owner
            </div>
          )}
        </div>

        {/* =================================
            ACTION BUTTONS
        ================================= */}

        <div
          className="
            mt-4
            grid
            w-full
            min-w-0
            grid-cols-2
            gap-2

            sm:gap-3
          "
        >
          {/* =============================
              EDIT BUTTON
          ============================= */}

          <button
            type="button"
            onClick={handleEdit}
            disabled={!canEdit}
            aria-label={
              updating
                ? "Post saqlanmoqda"
                : "Postni tahrirlash"
            }
            aria-busy={updating}
            className={EDIT_BUTTON_CLASS}
          >
            {updating ? (
              <Loader2
                size={16}
                className="
                  shrink-0
                  motion-safe:animate-spin
                "
                aria-hidden="true"
              />
            ) : (
              <Edit3
                size={16}
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
              {updating
                ? "Saqlanmoqda"
                : "Tahrirlash"}
            </span>
          </button>

          {/* =============================
              DELETE BUTTON
          ============================= */}

          <button
            type="button"
            onClick={handleDelete}
            disabled={!canDelete}
            aria-label={
              deleting
                ? "Post o‘chirilmoqda"
                : "Postni o‘chirish"
            }
            aria-busy={deleting}
            className={DELETE_BUTTON_CLASS}
          >
            {deleting ? (
              <Loader2
                size={16}
                className="
                  shrink-0
                  motion-safe:animate-spin
                "
                aria-hidden="true"
              />
            ) : (
              <Trash2
                size={16}
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
              {deleting
                ? "O‘chirilmoqda"
                : "O‘chirish"}
            </span>
          </button>
        </div>

        {/* =================================
            STATUS MESSAGE
        ================================= */}

        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {updating
            ? "Postdagi o‘zgarishlar saqlanmoqda."
            : deleting
              ? "Post o‘chirilmoqda."
              : ""}
        </div>

        {/* =================================
            FOOTER
        ================================= */}

        {!compact && (
          <p
            className="
              mt-4
              break-words
              border-t
              border-indigo-200/60
              pt-3

              text-[10px]
              font-medium
              leading-5
              text-slate-500

              dark:border-indigo-400/10
              dark:text-slate-400
            "
          >
            O‘chirish amali tasdiqlash oynasi
            orqali bajariladi.
          </p>
        )}
      </div>
    </section>
  );
};

export default React.memo(
  PostDetailOwnerActions
);
