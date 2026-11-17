
 // src/components/frame-shop/FrameShopCard.jsx

import React, { memo, useEffect, useId, useMemo, useState } from "react";

import { motion, useReducedMotion } from "framer-motion";

import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Coins,
  Crown,
  Gem,
  LockKeyhole,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  UserRound,
  Zap,
} from "lucide-react";

import { BACKEND_URL } from "../../services/config";
import FrameShopPreview from "./FrameShopPreview";

// =========================================================
// FSOCIETY — FRAME SHOP CARD
// =========================================================
//
// Features:
// - Premium cyberpunk card
// - Dark / light mode
// - Responsive
// - Frame image overlay
// - CSS fallback frame
// - Rarity-specific visual effects
// - Reduced motion support
// - Purchase / owned states
// - Expandable information
// =========================================================

const RARITY = {
  common: {
    label: "COMMON",
    Icon: ShieldCheck,
    text: "text-slate-600 dark:text-slate-300",
    badge: "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-500/30 dark:bg-slate-500/10 dark:text-slate-300",
    gradient: "from-slate-400 via-slate-200 to-slate-500",
    glow: "bg-slate-400/20",
    ring: "border-slate-400/60",
    tint: "from-slate-400/15 via-transparent to-slate-400/5",
    button: "from-slate-600 to-slate-800",
  },
  rare: {
    label: "RARE",
    Icon: Gem,
    text: "text-sky-700 dark:text-sky-300",
    badge: "border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-400/30 dark:bg-sky-400/10 dark:text-sky-300",
    gradient: "from-cyan-400 via-blue-500 to-cyan-300",
    glow: "bg-cyan-400/25",
    ring: "border-cyan-400/70",
    tint: "from-cyan-400/15 via-transparent to-blue-500/10",
    button: "from-cyan-600 to-blue-600",
  },
  epic: {
    label: "EPIC",
    Icon: Zap,
    text: "text-violet-700 dark:text-violet-300",
    badge: "border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-400/30 dark:bg-violet-400/10 dark:text-violet-300",
    gradient: "from-violet-400 via-fuchsia-500 to-indigo-500",
    glow: "bg-violet-500/25",
    ring: "border-violet-400/70",
    tint: "from-violet-500/15 via-transparent to-fuchsia-500/10",
    button: "from-violet-600 to-fuchsia-600",
  },
  legendary: {
    label: "LEGENDARY",
    Icon: Crown,
    text: "text-amber-700 dark:text-amber-300",
    badge: "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-400/40 dark:bg-amber-400/10 dark:text-amber-300",
    gradient: "from-amber-300 via-orange-400 to-yellow-200",
    glow: "bg-amber-400/30",
    ring: "border-amber-400/80",
    tint: "from-amber-400/20 via-transparent to-orange-500/10",
    button: "from-amber-500 to-orange-600",
  },
};

const numberFormat = new Intl.NumberFormat("uz-UZ", {
  maximumFractionDigits: 0,
});

const getImageUrl = (value) => {
  const image =
    typeof value === "string"
      ? value
      : typeof value?.url === "string"
        ? value.url
        : "";

  if (!image || !image.trim()) return null;

  const trimmed = image.trim();

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (/^[a-z][a-z\d+.-]*:/i.test(trimmed) || trimmed.startsWith("//")) {
    return null;
  }

  const origin = String(BACKEND_URL || "")
    .replace(/\/+$/, "");

  return trimmed.startsWith("/")
    ? `${origin}${trimmed}`
    : `${origin}/${trimmed}`;
};

const safePrice = (value) => {
  const price = Number(value);
  return Number.isFinite(price) && price >= 0 ? price : 0;
};

// =========================================================
// FRAME PREVIEW
// =========================================================

const FramePreview = memo(function FramePreview({
  frame,
  config,
  reduceMotion,
}) {
  const [imageFailed, setImageFailed] = useState(false);

  const imageUrl = useMemo(
    () => getImageUrl(frame?.image_url || frame?.image),
    [frame?.image_url, frame?.image]
  );

  useEffect(() => {
    setImageFailed(false);
  }, [imageUrl]);

  const showImage = Boolean(imageUrl && !imageFailed);

  return (
    <div
      aria-label={`${frame?.name || "Ramka"} ko‘rinishi`}
      role="img"
      className="relative mx-auto flex h-[190px] w-[190px] items-center justify-center sm:h-[210px] sm:w-[210px]"
    >
      {/* Ambient light */}
      <div
        aria-hidden="true"
        className={`absolute inset-[12%] rounded-full blur-[36px] ${config.glow}`}
      />

      {/* Orbit lines */}
      <div
        aria-hidden="true"
        className={`absolute inset-2 rounded-full border border-dashed ${config.ring} opacity-40`}
      />
      <div
        aria-hidden="true"
        className="absolute inset-5 rotate-45 rounded-full border border-white/20 dark:border-white/10"
      />

      {/* Rotating orbit markers */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-1 rounded-full"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{
          duration: 28,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.75)]" />
        <span className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-violet-400" />
      </motion.div>

      {/* Avatar placeholder */}
      <div className="absolute inset-[23%] flex items-center justify-center overflow-hidden rounded-full border border-white/25 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 shadow-inner dark:from-slate-700 dark:via-slate-900 dark:to-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent dark:from-cyan-400/10" />
        <UserRound
          className="relative h-14 w-14 text-slate-500/60 dark:text-slate-300/65"
          strokeWidth={1.3}
        />
      </div>

      {/* Real uploaded frame image */}
      {showImage ? (
        <img
          src={imageUrl}
          alt=""
          onError={() => setImageFailed(true)}
          className="pointer-events-none absolute inset-0 h-full w-full object-contain drop-shadow-[0_0_16px_rgba(139,92,246,0.28)]"
          loading="lazy"
          decoding="async"
        />
      ) : (
        /* Premium fallback when no image exists */
        <div
          aria-hidden="true"
          className={`absolute inset-[15%] rounded-full bg-gradient-to-br ${config.gradient} p-[4px] shadow-[0_0_28px_rgba(139,92,246,0.18)]`}
        >
          <div className="h-full w-full rounded-full border-[5px] border-white/70 bg-transparent shadow-[inset_0_0_16px_rgba(15,23,42,0.3)] dark:border-slate-950/80" />
          <span className="absolute -top-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border border-white/80 bg-white/80 shadow-lg" />
          <span className="absolute -bottom-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border border-white/80 bg-white/80 shadow-lg" />
        </div>
      )}

      <div
        aria-hidden="true"
        className={`absolute bottom-0 right-1 flex h-10 w-10 items-center justify-center rounded-xl border border-white/40 bg-gradient-to-br ${config.gradient} text-white shadow-lg`}
      >
        <config.Icon size={18} strokeWidth={2} />
      </div>
    </div>
  );
});

// =========================================================
// CARD
// =========================================================

const FrameShopCard = memo(function FrameShopCard({
  frame,
  index = 0,
  onPurchase,
  isAuthenticated = false,
  isBusy = false,
}) {
  const reduceMotion = useReducedMotion();
  const detailsId = useId();

  const [expanded, setExpanded] = useState(false);

  const rarity = String(frame?.rarity || "common").toLowerCase();
  const config = RARITY[rarity] || RARITY.common;

  const price = safePrice(frame?.price);
  const isOwned = Boolean(frame?.is_owned);
  const isEquipped = Boolean(frame?.is_equipped);
  const isLimited = Boolean(frame?.is_limited_edition);
  const isAnimated = Boolean(frame?.is_animated);

  const description =
    typeof frame?.description === "string"
      ? frame.description.trim()
      : "";

  if (!frame) return null;

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: Math.min(index, 8) * 0.045 }}
      whileHover={reduceMotion ? undefined : { y: -5 }}
      className="group relative flex min-w-0 flex-col overflow-hidden rounded-[26px] border border-slate-200/80 bg-white/85 shadow-[0_14px_38px_rgba(15,23,42,0.045)] backdrop-blur-xl transition-[border-color,box-shadow] duration-300 hover:border-cyan-400/40 hover:shadow-[0_24px_65px_rgba(59,130,246,0.13)] dark:border-white/[0.09] dark:bg-[#0d1424]/90 dark:shadow-[0_20px_55px_rgba(0,0,0,0.2)] dark:hover:border-cyan-400/30 dark:hover:shadow-[0_24px_70px_rgba(8,145,178,0.13)]"
    >
      {/* Accent strip */}
      <div className={`h-[3px] w-full bg-gradient-to-r ${config.gradient}`} />

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${config.tint} opacity-75`}
      />

      <div className="relative flex h-full flex-col p-4 sm:p-5">
        {/* Card header */}
        <div className="flex min-h-[30px] items-start justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-extrabold tracking-[0.13em] ${config.badge}`}
          >
            <config.Icon size={12} />
            {config.label}
          </span>

          <div className="flex items-center gap-1.5">
            {isLimited && (
              <span className="rounded-full border border-rose-400/25 bg-rose-400/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-rose-600 dark:text-rose-300">
                Limited
              </span>
            )}
            {isAnimated && (
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full border border-violet-400/20 bg-violet-400/10 text-violet-500 dark:text-violet-300"
                title="Animatsiyali ramka"
              >
                <Sparkles size={13} />
              </span>
            )}
          </div>
        </div>

        {/* Showcase */}
        <div className="relative flex min-h-[226px] items-center justify-center py-2">
          <div
            aria-hidden="true"
            className="absolute inset-x-6 top-5 h-32 rounded-full bg-gradient-to-r from-cyan-400/5 via-violet-400/10 to-amber-400/5 blur-3xl"
          />

          <FrameShopPreview frame={frame} />
        </div>

        {/* Title */}
        <div className="mt-1 min-w-0 text-center">
          <p className="mb-1 font-mono text-[10px] font-medium tracking-[0.2em] text-slate-400 dark:text-slate-500">
            FS / COLLECTIBLE
          </p>

          <h3 className="truncate font-['Space_Grotesk'] text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            {frame.name || "Nomsiz ramka"}
          </h3>

          <p className={`mt-1 text-[11px] font-bold uppercase tracking-[0.16em] ${config.text}`}>
            {isEquipped
              ? "EQUIPPED"
              : isOwned
                ? "COLLECTED"
                : "UNLOCK YOUR STYLE"}
          </p>
        </div>

        {/* Divider */}
        <div className="my-4 h-px bg-gradient-to-r from-transparent via-slate-300/80 to-transparent dark:via-white/15" />

        {/* Price */}
        <div className="mb-4 flex items-center justify-between gap-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Narxi
            </p>
            <div className="mt-0.5 flex items-center gap-1.5">
              <Coins size={19} className="text-amber-500" />
              <span className="text-xl font-black tabular-nums tracking-tight text-slate-900 dark:text-white">
                {numberFormat.format(price)}
              </span>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-300">
                FCoin
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            aria-controls={detailsId}
            className="inline-flex h-9 items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
          >
            Info
            <ChevronDown
              size={14}
              className={`transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Expandable description */}
        {expanded && (
          <div
            id={detailsId}
            className="mb-4 rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-xs leading-5 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
          >
            {description || "Bu kolleksion ramka profilingiz uchun maxsus bezak."}
          </div>
        )}

        {/* Action */}
        <button
          type="button"
          disabled={isBusy || isOwned}
          onClick={() => onPurchase?.(frame)}
          className={`mt-auto inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl px-3 text-sm font-extrabold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 ${
            isOwned
              ? "cursor-default border border-emerald-400/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : `bg-gradient-to-r ${config.button} text-white shadow-lg hover:brightness-110 disabled:cursor-wait disabled:opacity-60`
          }`}
        >
          {isOwned ? (
            <>
              <Check size={17} />
              {isEquipped ? "O‘rnatilgan" : "Kolleksiyada"}
            </>
          ) : (
            <>
              {isAuthenticated ? <ShoppingBag size={17} /> : <LockKeyhole size={17} />}
              {isBusy ? "Jarayonda..." : isAuthenticated ? "Sotib olish" : "Kirish va sotib olish"}
              {!isBusy && <ArrowUpRight size={16} />}
            </>
          )}
        </button>
      </div>
    </motion.article>
  );
});

export default FrameShopCard;
