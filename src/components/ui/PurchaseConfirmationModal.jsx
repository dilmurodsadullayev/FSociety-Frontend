
import React, {
  useEffect,
  useId,
  useRef,
} from "react";

import { createPortal } from "react-dom";

import {
  AlertTriangle,
  Coins,
  Loader2,
  ShieldCheck,
  ShoppingCart,
  X,
} from "lucide-react";

// =========================================================
// FSOCIETY — PURCHASE CONFIRMATION MODAL
// =========================================================
//
// Universal FCoin purchase modal.
//
// Features:
// - Light / Dark Mode
// - Responsive layout
// - Portal rendering
// - Body scroll lock
// - Keyboard focus trap
// - Escape and backdrop closing
// - Focus restoration
// - Balance validation
// - Purchase processing state
// - Optional processing skeleton
//
// Existing props are preserved.
//
// The parent must handle:
// - API request
// - Duplicate purchase protection
// - FCoin balance synchronization
// - Purchase success / failure
// =========================================================

// =========================================================
// HELPERS
// =========================================================

const safeNumber = (value, fallback = 0) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return fallback;
  }

  return Math.max(0, number);
};

const isValidAmount = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return false;
  }

  const number = Number(value);

  return Number.isFinite(number) && number >= 0;
};

const formatCoins = (value) => {
  return new Intl.NumberFormat("uz-UZ", {
    maximumFractionDigits: 10,
  }).format(safeNumber(value));
};

// =========================================================
// TRANSACTION CARD CONFIG
// =========================================================

const TRANSACTION_STYLES = {
  default: {
    container: `
      border-slate-200
      bg-slate-50

      dark:border-white/[0.07]
      dark:bg-white/[0.025]
    `,

    label: `
      text-slate-500
      dark:text-slate-400
    `,

    value: `
      text-slate-900
      dark:text-white
    `,
  },

  price: {
    container: `
      border-amber-200
      bg-amber-50

      dark:border-yellow-400/15
      dark:bg-yellow-400/[0.055]
    `,

    label: `
      text-amber-700
      dark:text-yellow-300/80
    `,

    value: `
      text-amber-800
      dark:text-yellow-300
    `,
  },

  success: {
    container: `
      border-emerald-200
      bg-emerald-50

      dark:border-emerald-400/15
      dark:bg-emerald-400/[0.055]
    `,

    label: `
      text-emerald-700
      dark:text-emerald-300/80
    `,

    value: `
      text-emerald-800
      dark:text-emerald-300
    `,
  },

  danger: {
    container: `
      border-red-200
      bg-red-50

      dark:border-red-400/15
      dark:bg-red-400/[0.055]
    `,

    label: `
      text-red-700
      dark:text-red-300/80
    `,

    value: `
      text-red-800
      dark:text-red-300
    `,
  },
};

// =========================================================
// TRANSACTION INFO CARD
// =========================================================

const TransactionInfoCard = React.memo(
  function TransactionInfoCard({
    label,
    value,
    variant = "default",
    showCoin = false,
    className = "",
  }) {
    const styles =
      TRANSACTION_STYLES[variant] ??
      TRANSACTION_STYLES.default;

    return (
      <div
        className={`
          min-w-0
          rounded-xl
          border
          p-3
          text-center

          ${styles.container}
          ${className}
        `}
      >
        <p
          className={`
            break-words
            text-[10px]
            font-black
            uppercase
            tracking-[0.06em]
            leading-4

            ${styles.label}
          `}
        >
          {label}
        </p>

        <div
          className={`
            mt-1.5
            flex
            min-w-0
            flex-wrap
            items-center
            justify-center
            gap-1
            text-sm
            font-black
            leading-5
            tabular-nums

            ${styles.value}
          `}
        >
          {showCoin && (
            <Coins
              size={14}
              className="shrink-0"
              aria-hidden="true"
            />
          )}

          <span
            className="
              min-w-0
              break-all
              [overflow-wrap:anywhere]
            "
          >
            {value}
          </span>
        </div>
      </div>
    );
  }
);

// =========================================================
// FOCUSABLE SELECTOR
// =========================================================

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

// =========================================================
// PURCHASE CONFIRMATION MODAL
// =========================================================

const PurchaseConfirmationModal = ({
  isOpen = false,

  onClose,
  onConfirm,

  title = "Xaridni tasdiqlash",

  description =
    "Ushbu amal hisobingizdan FCoin yechadi.",

  itemName = "Xarid",

  price = 0,
  balance = 0,

  duration = null,

  confirmText = "Tasdiqlash",
  cancelText = "Bekor qilish",

  warningText = null,

  isProcessing = false,

  // Optional custom purchase loading content.
  // Used by ProjectPromotionConfirmation.
  processingContent = null,
}) => {
  // =======================================================
  // REFS
  // =======================================================

  const dialogRef = useRef(null);

  const latestPropsRef = useRef({
    onClose,
    isProcessing,
  });

  latestPropsRef.current = {
    onClose,
    isProcessing,
  };

  // =======================================================
  // ACCESSIBILITY IDS
  // =======================================================

  const generatedId = useId();

  const titleId = `${generatedId}-title`;

  const descriptionId =
    `${generatedId}-description`;

  // =======================================================
  // AMOUNT VALIDATION
  // =======================================================

  const hasValidPrice = isValidAmount(price);

  const hasValidBalance = isValidAmount(balance);

  const safePrice = safeNumber(price);

  const safeBalance = safeNumber(balance);

  const hasEnoughBalance =
    hasValidPrice &&
    hasValidBalance &&
    safeBalance >= safePrice;

  const missingBalance =
    hasValidPrice && hasValidBalance
      ? Math.max(
          0,
          safePrice - safeBalance
        )
      : 0;

  const balanceAfter = hasEnoughBalance
    ? Math.max(
        0,
        safeBalance - safePrice
      )
    : null;

  // =======================================================
  // BUTTON STATE
  // =======================================================

  const canConfirm =
    hasEnoughBalance &&
    !isProcessing &&
    typeof onConfirm === "function";

  // =======================================================
  // BODY SCROLL + KEYBOARD + FOCUS
  // =======================================================

  useEffect(() => {
    if (
      !isOpen ||
      typeof document === "undefined"
    ) {
      return undefined;
    }

    const dialog = dialogRef.current;

    if (!dialog) {
      return undefined;
    }

    // =====================================
    // SAVE PREVIOUS STATE
    // =====================================

    const previousOverflow =
      document.body.style.overflow;

    const previousFocus =
      document.activeElement;

    // =====================================
    // LOCK BODY SCROLL
    // =====================================

    document.body.style.overflow = "hidden";

    // =====================================
    // INITIAL FOCUS
    // =====================================

    dialog.focus();

    // =====================================
    // GET FOCUSABLE ELEMENTS
    // =====================================

    const getFocusableElements = () => {
      return Array.from(
        dialog.querySelectorAll(
          FOCUSABLE_SELECTOR
        )
      ).filter((element) => {
        if (
          element.getAttribute("aria-hidden") ===
          "true"
        ) {
          return false;
        }

        if (
          element.closest("[inert]")
        ) {
          return false;
        }

        return (
          element.getClientRects().length > 0
        );
      });
    };

    // =====================================
    // KEYBOARD HANDLER
    // =====================================

    const handleKeyDown = (event) => {
      // -------------------------------------
      // ESCAPE
      // -------------------------------------

      if (event.key === "Escape") {
        event.preventDefault();

        event.stopPropagation();

        const {
          onClose: latestOnClose,
          isProcessing: processing,
        } = latestPropsRef.current;

        if (
          !processing &&
          typeof latestOnClose === "function"
        ) {
          latestOnClose();
        }

        return;
      }

      // -------------------------------------
      // TAB FOCUS TRAP
      // -------------------------------------

      if (event.key !== "Tab") {
        return;
      }

      const focusable =
        getFocusableElements();

      if (focusable.length === 0) {
        event.preventDefault();

        dialog.focus();

        return;
      }

      const first = focusable[0];

      const last =
        focusable[focusable.length - 1];

      const current =
        document.activeElement;

      // Focus somehow escaped the modal.

      if (!dialog.contains(current)) {
        event.preventDefault();

        if (event.shiftKey) {
          last.focus();
        } else {
          first.focus();
        }

        return;
      }

      // SHIFT + TAB

      if (
        event.shiftKey &&
        (
          current === first ||
          current === dialog
        )
      ) {
        event.preventDefault();

        last.focus();

        return;
      }

      // TAB

      if (
        !event.shiftKey &&
        (
          current === last ||
          current === dialog
        )
      ) {
        event.preventDefault();

        first.focus();
      }
    };

    // =====================================
    // PREVENT FOCUS ESCAPING
    // =====================================

    const handleFocusIn = (event) => {
      if (
        dialog.contains(event.target)
      ) {
        return;
      }

      dialog.focus();
    };

    // =====================================
    // LISTENERS
    // =====================================

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    document.addEventListener(
      "focusin",
      handleFocusIn
    );

    // =====================================
    // CLEANUP
    // =====================================

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.removeEventListener(
        "focusin",
        handleFocusIn
      );

      document.body.style.overflow =
        previousOverflow;

      // Restore focus to the element that
      // opened the modal.

      if (
        previousFocus &&
        typeof previousFocus.focus ===
          "function" &&
        previousFocus.isConnected
      ) {
        previousFocus.focus();
      }
    };
  }, [isOpen]);

  // =======================================================
  // PROCESSING FOCUS
  // =======================================================

  useEffect(() => {
    if (
      isOpen &&
      isProcessing
    ) {
      // Footer buttons become disabled.
      // Keep focus in the dialog.

      dialogRef.current?.focus();
    }
  }, [
    isOpen,
    isProcessing,
  ]);

  // =======================================================
  // CLOSE HANDLER
  // =======================================================

  const handleClose = () => {
    if (
      isProcessing ||
      typeof onClose !== "function"
    ) {
      return;
    }

    onClose();
  };

  // =======================================================
  // BACKDROP HANDLER
  // =======================================================

  const handleBackdropMouseDown = (
    event
  ) => {
    if (
      event.target !== event.currentTarget
    ) {
      return;
    }

    handleClose();
  };

  // =======================================================
  // CONFIRM HANDLER
  // =======================================================

  const handleConfirm = () => {
    if (!canConfirm) {
      return;
    }

    // The purchase hook performs its own
    // synchronous duplicate-request check.

    onConfirm();
  };

  // =======================================================
  // CLOSED / SSR SAFETY
  // =======================================================

  if (
    !isOpen ||
    typeof document === "undefined"
  ) {
    return null;
  }

  // =======================================================
  // RENDER
  // =======================================================

  const modalContent = (
    <div
      role="presentation"
      onMouseDown={handleBackdropMouseDown}
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        overflow-y-auto
        overscroll-contain
        bg-slate-950/70
        p-2
        backdrop-blur-md

        sm:p-4

        dark:bg-black/80
      "
    >
      {/* ===================================================
          MODAL PANEL
      =================================================== */}

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        aria-busy={Boolean(isProcessing)}
        tabIndex={-1}
        className="
          relative
          my-auto
          flex
          w-full
          max-w-md
          min-w-0
          max-h-[calc(100vh-1rem)]
          max-h-[calc(100dvh-1rem)]
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-[0_25px_90px_rgba(15,23,42,0.2)]
          outline-none

          sm:max-h-[calc(100vh-2rem)]
          sm:max-h-[calc(100dvh-2rem)]
          sm:rounded-[28px]

          dark:border-white/[0.09]
          dark:bg-[#0b1018]
          dark:shadow-[0_35px_120px_rgba(0,0,0,0.65)]
        "
      >
        {/* =====================================
            DECORATIVE BACKGROUND
        ===================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-24
            -top-24
            h-52
            w-52
            rounded-full
            bg-indigo-500/[0.07]
            blur-[90px]

            dark:bg-indigo-500/15
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -bottom-24
            -left-24
            h-52
            w-52
            rounded-full
            bg-purple-500/[0.06]
            blur-[90px]

            dark:bg-purple-500/10
          "
        />

        {/* =================================================
            HEADER
        ================================================= */}

        <header
          className="
            relative
            z-10
            flex
            shrink-0
            items-start
            justify-between
            gap-3
            border-b
            border-slate-200
            px-4
            py-4

            sm:px-5
            sm:py-5

            dark:border-white/[0.07]
          "
        >
          <div
            className="
              flex
              min-w-0
              flex-1
              items-start
              gap-3
            "
          >
            {/* HEADER ICON */}

            <div
              className="
                grid
                h-11
                w-11
                shrink-0
                place-items-center
                rounded-2xl
                border
                border-amber-200
                bg-amber-50
                text-amber-700

                dark:border-yellow-400/20
                dark:bg-yellow-500/[0.08]
                dark:text-yellow-300
              "
            >
              <ShoppingCart
                size={20}
                aria-hidden="true"
              />
            </div>

            {/* HEADER TEXT */}

            <div className="min-w-0 flex-1">
              <p
                className="
                  break-words
                  font-mono
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.12em]
                  text-amber-700

                  dark:text-yellow-400
                "
              >
                FCoin transaction
              </p>

              <h2
                id={titleId}
                className="
                  mt-1
                  break-words
                  [overflow-wrap:anywhere]
                  text-lg
                  font-black
                  leading-6
                  text-slate-900

                  sm:text-xl

                  dark:text-white
                "
              >
                {title}
              </h2>
            </div>
          </div>

          {/* CLOSE BUTTON */}

          <button
            type="button"
            onClick={handleClose}
            disabled={isProcessing}
            aria-label="Modalni yopish"
            title={
              isProcessing
                ? "Amal bajarilmoqda"
                : "Yopish"
            }
            className="
              grid
              h-11
              w-11
              shrink-0
              place-items-center
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              text-slate-600
              transition-colors

              hover:bg-slate-100
              hover:text-slate-900

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-purple-500

              disabled:cursor-not-allowed
              disabled:opacity-40

              dark:border-white/[0.08]
              dark:bg-white/[0.035]
              dark:text-slate-400

              dark:hover:bg-white/[0.07]
              dark:hover:text-white
            "
          >
            <X
              size={18}
              aria-hidden="true"
            />
          </button>
        </header>

        {/* =================================================
            SCROLLABLE BODY
        ================================================= */}

        <div
          className="
            relative
            z-10
            min-h-0
            flex-1
            overflow-y-auto
            overscroll-contain
            px-4
            py-4

            sm:px-5
            sm:py-5
          "
        >
          {/* =====================================
              DESCRIPTION
          ===================================== */}

          <p
            id={descriptionId}
            className="
              break-words
              text-xs
              font-medium
              leading-6
              text-slate-600

              sm:text-sm

              dark:text-slate-400
            "
          >
            {description}
          </p>

          {/* =====================================
              SELECTED ITEM
          ===================================== */}

          <div
            className="
              mt-4
              min-w-0
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              p-4

              dark:border-white/[0.07]
              dark:bg-black/20
            "
          >
            <p
              className="
                text-[10px]
                font-black
                uppercase
                tracking-wider
                text-slate-500

                dark:text-slate-400
              "
            >
              Tanlangan xizmat
            </p>

            <p
              className="
                mt-1
                min-w-0
                break-words
                [overflow-wrap:anywhere]
                text-sm
                font-black
                leading-5
                text-slate-900

                dark:text-white
              "
            >
              {itemName}
            </p>

            {/* DURATION */}

            {duration && (
              <span
                className="
                  mt-3
                  inline-flex
                  max-w-full
                  items-center
                  rounded-lg
                  border
                  border-indigo-200
                  bg-indigo-50
                  px-2.5
                  py-1.5
                  text-[10px]
                  font-black
                  text-indigo-700

                  dark:border-indigo-400/15
                  dark:bg-indigo-500/[0.06]
                  dark:text-indigo-300
                "
              >
                <span
                  className="
                    min-w-0
                    break-words
                  "
                >
                  Muddat: {duration}
                </span>
              </span>
            )}
          </div>

          {/* =====================================
              TRANSACTION SUMMARY
          ===================================== */}

          <div
            className="
              mt-4
              grid
              min-w-0
              grid-cols-2
              gap-2

              sm:grid-cols-3
            "
          >
            {/* CURRENT BALANCE */}

            <TransactionInfoCard
              label="Balans"
              value={formatCoins(safeBalance)}
              showCoin
            />

            {/* PURCHASE PRICE */}

            <TransactionInfoCard
              label="Narxi"
              value={`-${formatCoins(safePrice)}`}
              variant="price"
              showCoin
            />

            {/* BALANCE AFTER PURCHASE */}

            <TransactionInfoCard
              label="Qoladi (taxmin)"
              value={
                hasEnoughBalance
                  ? formatCoins(balanceAfter)
                  : "—"
              }
              variant={
                hasEnoughBalance
                  ? "success"
                  : "danger"
              }
              className="
                col-span-2
                sm:col-span-1
              "
            />
          </div>

          {/* =====================================
              PURCHASE PROCESSING CONTENT
          ===================================== */}

          {isProcessing ? (
            processingContent != null ? (
              <div className="mt-4 min-w-0">
                {processingContent}
              </div>
            ) : (
              <div
                role="status"
                aria-live="polite"
                className="
                  mt-4
                  flex
                  min-w-0
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-indigo-200
                  bg-indigo-50
                  p-3

                  dark:border-indigo-400/15
                  dark:bg-indigo-500/[0.05]
                "
              >
                <Loader2
                  size={17}
                  className="
                    shrink-0
                    text-indigo-600
                    motion-safe:animate-spin

                    dark:text-indigo-300
                  "
                  aria-hidden="true"
                />

                <p
                  className="
                    min-w-0
                    break-words
                    text-xs
                    font-semibold
                    leading-5
                    text-indigo-800

                    dark:text-indigo-200
                  "
                >
                  Server javobi kutilmoqda.
                  Xarid amalga oshirilmoqda...
                </p>
              </div>
            )
          ) : (
            /* ===================================
                PURCHASE WARNING
            =================================== */

            <div
              role={
                hasEnoughBalance
                  ? "note"
                  : "alert"
              }
              className={`
                mt-4
                flex
                min-w-0
                items-start
                gap-3
                rounded-2xl
                border
                p-3.5
                text-xs
                font-semibold
                leading-5

                ${
                  hasEnoughBalance
                    ? `
                      border-amber-200
                      bg-amber-50
                      text-amber-800

                      dark:border-yellow-400/15
                      dark:bg-yellow-500/[0.05]
                      dark:text-yellow-100/85
                    `
                    : `
                      border-red-200
                      bg-red-50
                      text-red-800

                      dark:border-red-400/20
                      dark:bg-red-500/[0.07]
                      dark:text-red-200
                    `
                }
              `}
            >
              {/* WARNING ICON */}

              {hasEnoughBalance ? (
                <ShieldCheck
                  size={17}
                  className="
                    mt-0.5
                    shrink-0
                    text-amber-700

                    dark:text-yellow-300
                  "
                  aria-hidden="true"
                />
              ) : (
                <AlertTriangle
                  size={17}
                  className="
                    mt-0.5
                    shrink-0
                    text-red-600

                    dark:text-red-300
                  "
                  aria-hidden="true"
                />
              )}

              {/* WARNING TEXT */}

              <p
                className="
                  min-w-0
                  whitespace-pre-wrap
                  break-words
                  [overflow-wrap:anywhere]
                "
              >
                {hasEnoughBalance
                  ? (
                      warningText ??
                      `${formatCoins(safePrice)} FCoin hisobingizdan yechiladi. Ushbu xaridni tasdiqlaysizmi?`
                    )
                  : (
                      !hasValidPrice ||
                      !hasValidBalance
                        ? "Xarid narxi yoki balans ma'lumoti noto'g'ri. Iltimos, ma'lumotlarni yangilang."
                        : `Balansingiz yetarli emas. Ushbu xarid uchun yana ${formatCoins(missingBalance)} FCoin kerak.`
                    )}
              </p>
            </div>
          )}
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <footer
          className="
            relative
            z-10
            flex
            shrink-0
            flex-col-reverse
            gap-2
            border-t
            border-slate-200
            bg-white
            px-4
            py-3

            sm:flex-row
            sm:justify-end
            sm:px-5
            sm:py-4

            dark:border-white/[0.07]
            dark:bg-[#0b1018]
          "
        >
          {/* =====================================
              CANCEL BUTTON
          ===================================== */}

          <button
            type="button"
            onClick={handleClose}
            disabled={isProcessing}
            className="
              inline-flex
              min-h-11
              w-full
              min-w-0
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              px-5
              py-2
              text-xs
              font-black
              text-slate-700
              transition-colors

              sm:w-auto

              hover:bg-slate-100

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-purple-500

              disabled:cursor-not-allowed
              disabled:opacity-40

              dark:border-white/[0.08]
              dark:bg-white/[0.035]
              dark:text-slate-300

              dark:hover:bg-white/[0.07]
            "
          >
            {cancelText}
          </button>

          {/* =====================================
              CONFIRM BUTTON
          ===================================== */}

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canConfirm}
            aria-busy={Boolean(isProcessing)}
            className="
              inline-flex
              min-h-11
              w-full
              min-w-0
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-amber-400
              bg-amber-400
              px-5
              py-2
              text-xs
              font-black
              text-slate-950
              shadow-lg
              shadow-amber-500/10
              transition-colors

              sm:w-auto

              hover:bg-amber-300

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-amber-500

              disabled:cursor-not-allowed
              disabled:border-slate-200
              disabled:bg-slate-100
              disabled:text-slate-400
              disabled:shadow-none

              dark:disabled:border-white/[0.06]
              dark:disabled:bg-white/[0.05]
              dark:disabled:text-slate-500
            "
          >
            {isProcessing ? (
              <>
                <Loader2
                  size={16}
                  className="
                    shrink-0
                    motion-safe:animate-spin
                  "
                  aria-hidden="true"
                />

                <span>
                  Amal bajarilmoqda...
                </span>
              </>
            ) : (
              <>
                <Coins
                  size={16}
                  className="shrink-0"
                  aria-hidden="true"
                />

                <span
                  className="
                    min-w-0
                    break-words
                    text-center
                  "
                >
                  {confirmText}
                </span>
              </>
            )}
          </button>
        </footer>
      </div>
    </div>
  );

  // =======================================================
  // PORTAL
  // =======================================================

  return createPortal(
    modalContent,
    document.body
  );
};

export default React.memo(
  PurchaseConfirmationModal
);
