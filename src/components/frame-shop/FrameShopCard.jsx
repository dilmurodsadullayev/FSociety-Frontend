
 // src/components/frame-shop/FrameShopCard.jsx

import React, {
  memo,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Coins,
  Crown,
  Gem,
  Gift,
  Info,
  Loader2,
  LockKeyhole,
  Shield,
  ShoppingBag,
  Sparkles,
  WandSparkles,
  Zap,
} from "lucide-react";

import FrameShopPreview from "./FrameShopPreview";

// =========================================================
// FSOCIETY — FRAME SHOP CARD / CYBER VAULT 2.0
// =========================================================
//
// Compact premium card for the Frame Shop catalog.
//
// Keeps the parent's existing contract:
//   frame, index, isAuthenticated, isBusy, onPurchase
//
// Responsibilities:
// - Show rarity and limited edition status
// - Show equipped / owned / available status
// - Display the corrected PNG frame preview
// - Show price in FCoin
// - Toggle detailed frame information
// - Route owned frames to My Frames
// - Request purchase through the parent callback
// - Support inactive / event-only frames
// - Respect reduced-motion preferences
// - Responsive Dark / Light design
//
// The frame is NEVER purchased inside this component.
// The confirmation modal and balance checks stay in FrameShop.jsx.
//
// =========================================================

// =========================================================
// RARITY DESIGN SYSTEM
// =========================================================

const RARITY = {
  common: {
    label: "COMMON",
    Icon: Shield,
    badge:
      "border-slate-300/80 bg-slate-100 text-slate-600 " +
      "dark:border-slate-400/25 dark:bg-slate-400/10 dark:text-slate-200",
    rail: "from-slate-300 via-slate-500 to-slate-300",
    glow: "bg-slate-400/15",
    button:
      "from-slate-600 to-slate-800 hover:from-slate-500 hover:to-slate-700",
    accent: "text-slate-600 dark:text-slate-300",
  },
  rare: {
    label: "RARE",
    Icon: Gem,
    badge:
      "border-cyan-300/80 bg-cyan-50 text-cyan-700 " +
      "dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-200",
    rail: "from-cyan-300 via-sky-500 to-cyan-300",
    glow: "bg-cyan-400/15",
    button:
      "from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500",
    accent: "text-cyan-600 dark:text-cyan-300",
  },
  epic: {
    label: "EPIC",
    Icon: Zap,
    badge:
      "border-violet-300/80 bg-violet-50 text-violet-700 " +
      "dark:border-violet-400/25 dark:bg-violet-400/10 dark:text-violet-200",
    rail: "from-violet-400 via-fuchsia-500 to-violet-400",
    glow: "bg-violet-500/15",
    button:
      "from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500",
    accent: "text-violet-600 dark:text-violet-300",
  },
  legendary: {
    label: "LEGENDARY",
    Icon: Crown,
    badge:
      "border-amber-300/80 bg-amber-50 text-amber-800 " +
      "dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200",
    rail: "from-amber-300 via-orange-500 to-amber-300",
    glow: "bg-amber-400/15",
    button:
      "from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500",
    accent: "text-amber-700 dark:text-amber-300",
  },
};

const formatAmount = (value) =>
  new Intl.NumberFormat("uz-UZ", {
    maximumFractionDigits: 0,
  }).format(value);

const parsePrice = (value) => {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const price = Number(value);

  return Number.isFinite(price) && price >= 0
    ? price
    : null;
};

const compactText = (value) =>
  typeof value === "string" ? value.trim() : "";

// =========================================================
// CATALOG ITEM
// =========================================================

function FrameShopCard({
  frame,
  index = 0,
  isAuthenticated = false,
  isBusy = false,
  onPurchase,
}) {
  const reducedMotion = useReducedMotion();
  const infoId = useId();
  const [detailsOpen, setDetailsOpen] = useState(false);

  const frameId = frame?.id;
  const frameCode = compactText(frame?.code);
  const name = compactText(frame?.name) || "Nomsiz ramka";
  const description = compactText(frame?.description);

  const rarityKey = String(frame?.rarity || "common")
    .trim()
    .toLowerCase();

  const theme = RARITY[rarityKey] || RARITY.common;
  const RarityIcon = theme.Icon;

  const owned = Boolean(
    frame?.is_owned ?? frame?.owned ?? frame?.is_purchased
  );

  const equipped = Boolean(
    frame?.is_equipped ?? frame?.equipped
  );

  // An equipped frame is necessarily owned, even if a public
  // serializer omits the is_owned flag.
  const isOwned = owned || equipped;
  const isActive = frame?.is_active !== false;
  const isLimited = Boolean(frame?.is_limited_edition ?? frame?.is_limited);
  const isAnimated = Boolean(frame?.is_animated);
  const price = parsePrice(frame?.price);
  const hasValidFrameId = Number.isSafeInteger(Number(frameId)) && Number(frameId) > 0;

  const isEventOnly = price === 0;
  const canRequestPurchase = Boolean(
    !isOwned &&
      isActive &&
      price !== null &&
      Number.isSafeInteger(price) &&
      price > 0 &&
      hasValidFrameId &&
      typeof onPurchase === "function" &&
      !isBusy
  );

  // Reset the info panel if React reuses the card for another frame.
  useEffect(() => {
    setDetailsOpen(false);
  }, [frameId]);

  // Escape closes the optional information panel.
  useEffect(() => {
    if (!detailsOpen) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setDetailsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [detailsOpen]);

  const statusText = useMemo(() => {
    if (equipped) return "ACTIVE FRAME";
    if (isOwned) return "OWNED";
    if (!isActive) return "UNAVAILABLE";
    if (isEventOnly) return "EVENT EXCLUSIVE";
    return "UNLOCK YOUR STYLE";
  }, [equipped, isOwned, isActive, isEventOnly]);

  const handlePurchase = useCallback(() => {
    if (!canRequestPurchase) return;
    onPurchase(frame);
  }, [canRequestPurchase, frame, onPurchase]);

  if (!frame || typeof frame !== "object") {
    return null;
  }

  return (
    <motion.article
      initial={reducedMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={reducedMotion ? undefined : { y: -3 }}
      transition={{
        duration: 0.3,
        delay: Math.min(Math.max(0, index), 7) * 0.035,
        ease: "easeOut",
      }}
      className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[22px] border border-slate-200/90 bg-white/95 shadow-[0_12px_34px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-[border-color,box-shadow] duration-200 hover:border-slate-300 hover:shadow-[0_18px_46px_rgba(15,23,42,0.13)] dark:border-white/10 dark:bg-[#0d1526]/95 dark:shadow-[0_18px_48px_rgba(0,0,0,0.24)] dark:hover:border-white/20 dark:hover:shadow-[0_23px_54px_rgba(0,0,0,0.35)]"
    >
      {/* Rarity accent: intentionally very thin. */}
      <div
        aria-hidden="true"
        className={`h-[2px] shrink-0 bg-gradient-to-r ${theme.rail}`}
      />

      {/* Ambient color behind the frame; no busy additional decoration. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 top-10 h-40 w-48 -translate-x-1/2 rounded-full blur-[60px] ${theme.glow}`}
      />

      <div className="relative flex h-full min-w-0 flex-col px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
        {/* Compact header */}
        <div className="flex min-h-6 items-center justify-between gap-2">
          <span
            className={`inline-flex min-w-0 items-center gap-1 rounded-full border px-2 py-1 font-mono text-[9px] font-bold tracking-[0.08em] ${theme.badge}`}
          >
            <RarityIcon size={11} aria-hidden="true" className="shrink-0" />
            {theme.label}
          </span>

          <div className="flex min-w-0 items-center gap-1.5">
            {isLimited && (
              <span className="rounded-full border border-rose-300/50 bg-rose-50/90 px-2 py-1 font-mono text-[9px] font-bold text-rose-600 dark:border-rose-400/25 dark:bg-rose-500/10 dark:text-rose-300">
                LIMITED
              </span>
            )}

            {isOwned && (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/60 bg-emerald-50 px-2 py-1 font-mono text-[9px] font-bold text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-500/10 dark:text-emerald-300">
                <Check size={10} aria-hidden="true" />
                {equipped ? "EQUIPPED" : "OWNED"}
              </span>
            )}
          </div>
        </div>

        {/* Frame artwork: reuses the corrected overlay alignment. */}
        <div className="relative mx-auto flex h-[188px] w-full items-center justify-center sm:h-[197px]">
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.80] sm:scale-[0.83]">
            <FrameShopPreview frame={frame} />
          </div>

          {/* Small rarity mark, not overlaid on the face. */}
          {isAnimated && (
            <span className="absolute bottom-1 right-2 inline-flex items-center gap-1 rounded-lg border border-violet-300/60 bg-violet-50/90 px-2 py-1 text-[9px] font-bold text-violet-700 dark:border-violet-400/30 dark:bg-violet-500/10 dark:text-violet-200">
              <Sparkles size={11} aria-hidden="true" />
              ANIMATED
            </span>
          )}
        </div>

        {/* Name and status */}
        <div className="min-w-0 text-center">
          <p className="font-mono text-[9px] font-semibold tracking-[0.20em] text-slate-400 dark:text-slate-500">
            FS / COLLECTIBLE
          </p>
          <h3
            title={name}
            className="mt-1 line-clamp-2 min-h-[24px] break-words font-['Space_Grotesk'] text-[16px] font-extrabold leading-6 tracking-tight text-slate-900 dark:text-slate-100"
          >
            {name}
          </h3>
          <p className={`mt-0.5 font-mono text-[9px] font-bold tracking-[0.12em] ${theme.accent}`}>
            {statusText}
          </p>
        </div>

        {/* Detailed information: collapsed by default, never removes data. */}
        <AnimatePresence initial={false}>
          {detailsOpen && (
            <motion.div
              id={infoId}
              key="frame-details"
              initial={reducedMotion ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-3 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 text-[11px] leading-5 text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {description || "Ushbu ramka FSociety profilini bezash uchun mo‘ljallangan."}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {frameCode && (
                    <span className="max-w-full break-all rounded-md bg-white px-2 py-1 font-mono text-[9px] text-slate-500 dark:bg-white/5 dark:text-slate-400">
                      {frameCode}
                    </span>
                  )}
                  {isLimited && (
                    <span className="rounded-md bg-rose-500/10 px-2 py-1 text-[9px] font-bold text-rose-600 dark:text-rose-300">
                      Limited edition
                    </span>
                  )}
                  {isAnimated && (
                    <span className="rounded-md bg-violet-500/10 px-2 py-1 text-[9px] font-bold text-violet-700 dark:text-violet-300">
                      Animated
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer remains aligned at bottom for cards of equal height. */}
        <div className="mt-auto pt-3">
          <div className="flex items-end justify-between gap-3 border-t border-slate-200/70 pt-3 dark:border-white/[0.08]">
            <div className="min-w-0">
              <p className="font-mono text-[9px] font-semibold tracking-[0.10em] text-slate-400 dark:text-slate-500">
                NARXI
              </p>
              <div className="mt-0.5 flex min-w-0 items-center gap-1.5">
                {price !== null && price > 0 ? (
                  <>
                    <Coins size={16} className="shrink-0 text-amber-500" aria-hidden="true" />
                    <span className="font-['Space_Grotesk'] text-lg font-black tabular-nums text-slate-900 dark:text-white">
                      {formatAmount(price)}
                    </span>
                    <span className="self-end pb-[2px] text-[10px] font-bold text-amber-600 dark:text-amber-300">
                      FCoin
                    </span>
                  </>
                ) : (
                  <>
                    <Gift size={16} className="text-violet-500" aria-hidden="true" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {isEventOnly ? "Mukofot" : "—"}
                    </span>
                  </>
                )}
              </div>
            </div>

            <button
              type="button"
              aria-expanded={detailsOpen}
              aria-controls={detailsOpen ? infoId : undefined}
              onClick={() => setDetailsOpen((prev) => !prev)}
              className="inline-flex min-h-9 shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 px-2.5 text-[11px] font-bold text-slate-600 transition-colors hover:border-cyan-300 hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300 dark:hover:border-cyan-400/40 dark:hover:text-cyan-200"
            >
              <Info size={13} aria-hidden="true" />
              Info
              <ChevronDown
                size={12}
                aria-hidden="true"
                className={`transition-transform ${detailsOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {/* Preserve the parent onPurchase callback and modal flow. */}
          {equipped ? (
            <div className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-3 py-2.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <Check size={15} aria-hidden="true" />
              O‘rnatilgan
            </div>
          ) : isOwned ? (
            <Link
              to="/frames/my"
              className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-violet-300/60 bg-violet-50 px-3 py-2.5 text-xs font-bold text-violet-700 transition-colors hover:bg-violet-100 dark:border-violet-400/25 dark:bg-violet-500/10 dark:text-violet-200 dark:hover:bg-violet-500/20"
            >
              <WandSparkles size={15} aria-hidden="true" />
              Avatarimga o‘rnatish
              <ArrowUpRight size={13} aria-hidden="true" />
            </Link>
          ) : (
            <button
              type="button"
              disabled={!canRequestPurchase}
              onClick={handlePurchase}
              aria-label={
                !isActive
                  ? `${name} hozircha mavjud emas`
                  : isEventOnly
                    ? `${name} tadbir orqali olinadi`
                    : isAuthenticated
                      ? `${name} ramkasini sotib olish`
                      : `${name} ramkasini sotib olish uchun kirish`
              }
              className={`mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r px-3 py-2.5 text-xs font-extrabold text-white shadow-[0_6px_20px_rgba(15,23,42,0.14)] transition-[filter,box-shadow] hover:shadow-[0_8px_24px_rgba(15,23,42,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none dark:focus-visible:ring-offset-[#0d1526] ${theme.button}`}
            >
              {isBusy ? (
                <Loader2 size={15} aria-hidden="true" className="animate-spin motion-reduce:animate-none" />
              ) : !isActive ? (
                <LockKeyhole size={15} aria-hidden="true" />
              ) : isEventOnly ? (
                <Gift size={15} aria-hidden="true" />
              ) : !isAuthenticated ? (
                <LockKeyhole size={15} aria-hidden="true" />
              ) : (
                <ShoppingBag size={15} aria-hidden="true" />
              )}

              <span>
                {isBusy
                  ? "Tekshirilmoqda..."
                  : !isActive
                    ? "Hozir mavjud emas"
                    : isEventOnly
                      ? "Tadbir mukofoti"
                      : !isAuthenticated
                        ? "Kirish va sotib olish"
                        : "Sotib olish"}
              </span>

              {!isBusy && isActive && !isEventOnly && (
                <ArrowUpRight size={14} aria-hidden="true" />
              )}
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default memo(FrameShopCard);
