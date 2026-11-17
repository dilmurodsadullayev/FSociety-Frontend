
 // src/components/frame-shop/FrameShopPurchaseConfirmation.jsx

import React, { memo, useMemo } from "react";
import { Loader2 } from "lucide-react";

import PurchaseConfirmationModal from "../ui/PurchaseConfirmationModal";

// =========================================================
// FSOCIETY — FRAME SHOP PURCHASE CONFIRMATION
// =========================================================
//
// Thin adapter for the EXISTING universal FCoin modal.
//
// Responsibilities:
// - Selected frame details
// - Current FCoin balance
// - Purchase price
// - Purchase warning
// - Confirmation callbacks
// - Processing content
//
// No API requests.
// No Redux dispatch.
// No duplicated modal UI.
//
// Parent controls:
// - Purchase locking
// - HTTP request
// - FCoin synchronization
// - Success / failure
//
// =========================================================

const formatCoins = (number) =>
  new Intl.NumberFormat("uz-UZ", {
    maximumFractionDigits: 0,
  }).format(number);

// =========================================================
// MAIN COMPONENT
// =========================================================

function FrameShopPurchaseConfirmation({
  frame = null,
  balance = null,
  isOpen = false,
  isProcessing = false,
  onClose,
  onConfirm,
}) {
  // =====================================================
  // VALIDATE PRICE
  // =====================================================

  const price = Number(frame?.price);
  const currentBalance = Number(balance);

  const validPrice =
    frame != null &&
    Number.isSafeInteger(price) &&
    price > 0;

  const validBalance =
    balance !== null &&
    balance !== undefined &&
    Number.isSafeInteger(currentBalance) &&
    currentBalance >= 0;

  // =====================================================
  // CAN CONFIRM
  // =====================================================

  const canRequest =
    Boolean(isOpen && frame) &&
    validPrice &&
    validBalance &&
    !frame?.is_owned &&
    !isProcessing &&
    typeof onConfirm === "function";

  // =====================================================
  // FRAME DETAILS
  // =====================================================

  const rarityName = String(
    frame?.rarity || "common"
  ).toUpperCase();

  const name =
    typeof frame?.name === "string" &&
    frame.name.trim()
      ? frame.name.trim()
      : "Profil ramkasi";

  // =====================================================
  // PURCHASE WARNING
  // =====================================================

  const warningText = useMemo(() => {
    if (!validPrice) return null;

    return (
      `Rostdan ham “${name}” ramkasini xarid qilasizmi? ` +
      `Tasdiqlasangiz, hisobingizdan ${formatCoins(price)} FCoin yechiladi ` +
      "va ramka kolleksiyangizga qo‘shiladi."
    );
  }, [name, price, validPrice]);

  // =====================================================
  // PROCESSING CONTENT
  // =====================================================

  const processingContent = (
    <div
      role="status"
      aria-live="polite"
      className="
        flex items-start gap-3 rounded-2xl
        border border-cyan-400/20
        bg-cyan-500/[0.07] p-3.5
        text-cyan-900 dark:text-cyan-100
      "
    >
      <span
        className="
          flex h-10 w-10 shrink-0 items-center
          justify-center rounded-xl bg-cyan-400/15
        "
      >
        <Loader2
          size={20}
          className="animate-spin motion-reduce:animate-none"
          aria-hidden="true"
        />
      </span>

      <div className="min-w-0">
        <p className="text-sm font-extrabold">
          Ramka xarid qilinmoqda
        </p>

        <p className="mt-1 text-xs leading-5 text-cyan-800/80 dark:text-cyan-100/70">
          FCoin va ramka egaligi serverda tekshirilmoqda.
          Javob kelmaguncha oynani yopib bo‘lmaydi.
        </p>
      </div>
    </div>
  );

  // =====================================================
  // CONFIRM
  // =====================================================

  const handleConfirm = () => {
    if (
      !canRequest ||
      currentBalance < price
    ) {
      return;
    }

    onConfirm();
  };

  // =====================================================
  // CLOSE
  // =====================================================

  const handleClose = () => {
    if (
      !isProcessing &&
      typeof onClose === "function"
    ) {
      onClose();
    }
  };

  // =====================================================
  // UNIVERSAL PURCHASE CONFIRMATION MODAL
  // =====================================================

  return (
    <PurchaseConfirmationModal
      isOpen={Boolean(isOpen && frame)}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title="Ramka xaridini tasdiqlaysizmi?"
      description={
        `FSOCIETY FRAME VAULT · ${rarityName} · ` +
        "Ramka bir marta xarid qilinadi " +
        "va kolleksiyangizda qoladi."
      }
      itemName={name}
      price={validPrice ? price : null}
      balance={validBalance ? currentBalance : null}
      duration={null}
      confirmText={
        validPrice
          ? `${formatCoins(price)} FCoin sarflash`
          : "Xaridni tasdiqlash"
      }
      cancelText="Bekor qilish"
      warningText={warningText}
      isProcessing={Boolean(isProcessing)}
      processingContent={processingContent}
    />
  );
}

export default memo(FrameShopPurchaseConfirmation);
