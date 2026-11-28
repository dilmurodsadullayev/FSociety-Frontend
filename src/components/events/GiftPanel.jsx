import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, CalendarClock, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Gift, Loader2, LockKeyhole, RefreshCw, Sparkles } from "lucide-react";
import { formatEventDate } from "../../utils/formatEventDate";
import useEventCountdown from "../../hooks/events/useEventCountdown";
import GiftRewardResult from "./GiftRewardResult";
import GiftRevealModal from "./GiftRevealModal";

export default function GiftPanel({ event, gift, kind, className = "", embedded = false, showCountdown = true, openingAt, onClaimSuccess, onClaimError }) {
    const daily = kind === "daily";
    const name = event?.name || "FSociety tadbiri";
    const timezone = gift.status?.timezone ?? event?.timezone ?? event?.timezone_name;
    const title = daily ? "Kunlik sovg‘a" : "Bayram sovg‘asi";
    const [historyOpen, setHistoryOpen] = useState(false);
    const [reveal, setReveal] = useState(null);
    const closeReveal = useCallback(() => setReveal(null), []);
    const scope = `${gift.sessionVersion}:${gift.slug}`;
    const [historyScope, setHistoryScope] = useState(scope);
    const historyVisible = historyOpen && historyScope === scope;
    const target = daily
        ? gift.status?.next_claim_at
        : gift.status?.next_claim_at ?? (gift.alreadyClaimed ? null : gift.status?.opens_at ?? openingAt ?? event?.opens_at);
    const countdown = useEventCountdown(target, gift.status?.server_time, gift.statusFetchedAt);
    const history = gift.history?.results ?? [];
    const currentClaim = daily
        ? (gift.claimResult?.claim_date === gift.status?.claim_date ? gift.claimResult : null) ??
            history.find((item) => item.claim_date === gift.status?.claim_date)
        : gift.claimResult ?? history[0];
    const received = daily ? gift.claimedToday : gift.alreadyClaimed;
    const error = gift.claimError ?? gift.statusError;
    const openClaim = (claim) => setReveal({ scope, claim });
    const handleClaim = async () => {
        const result = await gift.claimGift();
        if (result.ok) {
            openClaim(result.claim);
            onClaimSuccess?.(result.claim, result);
        } else if (!result.skipped) onClaimError?.(result.error);
    };
    const toggleHistory = () => {
        setHistoryScope(scope);
        setHistoryOpen(!historyVisible);
        if (!historyVisible) void gift.refreshHistory({ page: 1 });
    };
    const buttonStyle = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 disabled:cursor-not-allowed disabled:opacity-50";
    const accent = daily ? "from-cyan-600 to-blue-600" : "from-violet-600 via-fuchsia-600 to-indigo-600";
    const message = gift.needsReconciliation ? "So‘rov natijasi tekshirilmoqda. Holat va tarixni yangilang."
        : received ? (daily ? "Bugungi sovg‘angiz olindi." : "Ushbu tadbir sovg‘asini olgansiz.")
            : gift.status?.message || (gift.canClaim ? "Sovg‘angiz tayyor!" : "Sovg‘a holati tekshiriladi.");
    return (
        <section aria-label={title} aria-busy={gift.claimLoading} className={`min-w-0 overflow-hidden rounded-2xl border text-slate-900 dark:text-white ${daily
            ? "border-cyan-200/80 bg-cyan-50/60 dark:border-cyan-300/15 dark:bg-cyan-400/[.04]"
            : "border-violet-200/80 bg-gradient-to-br from-violet-50 via-fuchsia-50/70 to-white dark:border-violet-300/20 dark:from-violet-500/10 dark:via-fuchsia-500/5 dark:to-[#111a30]"} ${embedded ? "p-4" : "p-5 sm:p-6"} ${className}`}>
            <header className="flex items-start gap-3">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white ${accent}`}>
                    {daily ? <CalendarClock size={23} /> : <Gift size={25} />}
                </span>
                <div className="min-w-0 flex-1">
                    <p className={`text-[10px] font-black tracking-[.18em] ${daily ? "text-cyan-700 dark:text-cyan-300" : "text-violet-700 dark:text-violet-300"}`}>{daily ? "DAILY GIFT" : "SEASONAL GIFT"}</p>
                    <h3 className="mt-0.5 text-lg font-extrabold text-slate-900 dark:text-white">{title}</h3>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{daily ? "Har kuni bitta yangi imkoniyat" : "Ushbu tadbir uchun bir martalik maxsus sovg‘a"}</p>
                </div>
                {!daily && <Sparkles size={18} className="shrink-0 text-fuchsia-500" aria-hidden="true" />}
            </header>
            <p role="status" className="mt-4 text-sm leading-6 text-slate-700 dark:text-slate-300">{message}</p>
            {gift.sessionReady && gift.accountSyncError && <p role="alert" className="mt-2 text-xs text-amber-700 dark:text-amber-300">Sovg‘a saqlandi, balansni yangilash amalga oshmadi. Holatni yangilang.</p>}
            {showCountdown && !gift.canClaim && target && !["finished", "disabled"].includes(gift.status?.event_status ?? event?.event_status) && countdown && (
                <div className="mt-3 rounded-xl border border-slate-200/70 bg-white/60 p-3 dark:border-white/10 dark:bg-white/[.04]">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{daily ? "Keyingi kunlik sovg‘agacha" : "Bayram sovg‘asi ochilishigacha"}</p>
                    <p role="timer" aria-live="off" className="mt-1 font-mono text-xl font-black tabular-nums">{countdown.text}</p>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{formatEventDate(target, timezone)}</p>
                    {countdown.expired && !gift.canClaim && <p className="mt-1 text-xs">Vaqt yetdi. Server holati tekshiriladi.</p>}
                </div>
            )}
            {error && <p role="alert" className="mt-3 flex items-start gap-2 rounded-xl bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-300"><AlertCircle size={18} className="shrink-0" />{error.message}</p>}
            <div className="mt-4">
                {!gift.isLoggedIn && !gift.authLoading ? <Link to="/login" className={`${buttonStyle} w-full bg-gradient-to-r text-white ${accent}`}><LockKeyhole size={18} /> Tizimga kirish</Link>
                    : received ? <div className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2 text-sm font-bold text-emerald-700 dark:text-emerald-300"><CheckCircle2 size={18} />{daily ? "Bugungi sovg‘a olindi" : "Bayram sovg‘asi olindi"}</div>
                        : <button type="button" onClick={handleClaim} disabled={!gift.canClaim} className={`${buttonStyle} w-full bg-gradient-to-r text-white shadow-lg ${accent}`}>
                            {gift.claimLoading || gift.statusLoading || gift.authLoading ? <Loader2 size={18} className="motion-safe:animate-spin" /> : gift.canClaim ? <Gift size={18} /> : <LockKeyhole size={18} />}
                            {gift.claimLoading ? "Sovg‘a ochilmoqda…" : gift.statusLoading || gift.authLoading ? "Tekshirilmoqda…" : gift.needsReconciliation ? "Natijani tekshirish kerak" : gift.canClaim ? (daily ? "Bugungi sovg‘ani ochish" : "Bayram sovg‘asini ochish") : "Sovg‘a hozir yopiq"}
                        </button>}
                {gift.sessionReady && <button type="button" onClick={() => { void gift.refresh(); }} disabled={gift.statusLoading || gift.claimLoading || gift.historyLoading}
                    className={`${buttonStyle} mt-1 w-full text-xs text-slate-600 hover:bg-white/50 dark:text-slate-400 dark:hover:bg-white/5`}><RefreshCw size={14} />{gift.needsReconciliation ? "Sovg‘a natijasini tekshirish" : "Holatni yangilash"}</button>}
            </div>
            {gift.sessionReady && received && currentClaim && (
                <button type="button" onClick={() => openClaim(currentClaim)} aria-label={`${title} natijasini ko‘rish`}
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-white/60 p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 dark:border-white/10 dark:bg-white/5">
                    <GiftRewardResult claim={currentClaim} compact />
                    <span className="mt-2 block text-xs font-semibold text-violet-700 dark:text-violet-300">Mukofot va tabrikni ko‘rish →</span>
                </button>
            )}
            {gift.sessionReady && (
                <div className="mt-3 border-t border-slate-200/70 pt-2 dark:border-white/10">
                    <button type="button" onClick={toggleHistory} aria-expanded={historyVisible}
                        className="flex min-h-10 w-full items-center justify-between rounded-lg px-2 text-left text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400">
                        {daily ? "Kunlik sovg‘alar tarixi" : "Olingan bayram sovg‘asi"}<ChevronDown size={16} className={historyVisible ? "rotate-180" : ""} />
                    </button>
                    {historyVisible && <div className="mt-2 space-y-2">
                        {gift.historyLoading ? <p role="status" className="text-xs">Tarix yuklanmoqda…</p> : gift.historyError ? <div role="alert" className="text-xs text-rose-700 dark:text-rose-300">{gift.historyError.message} <button type="button" onClick={() => gift.refreshHistory({ page: gift.historyPage })} className="min-h-10 underline">Qayta urinish</button></div> : history.length === 0 ? <p className="text-xs text-slate-500 dark:text-slate-400">Hali sovg‘a olinmagan.</p> : history.map((item) => (
                            <button key={item.claim_id} type="button" onClick={() => openClaim(item)} className="w-full rounded-xl border border-slate-200 bg-white/60 p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 dark:border-white/10 dark:bg-white/5">
                                <GiftRewardResult claim={item} compact />
                                <span className="mt-1 block text-[11px] text-slate-500 dark:text-slate-400">{formatEventDate(item.claimed_at, item.timezone ?? timezone)}</span>
                            </button>
                        ))}
                        {(gift.history?.next || gift.history?.previous) && <div className="flex items-center justify-between gap-2">
                            <button type="button" disabled={gift.historyLoading || !gift.history?.previous} onClick={() => gift.refreshHistory({ page: gift.historyPage - 1 })} className={`${buttonStyle} px-2 text-xs`}><ChevronLeft size={15} /> Oldingi</button>
                            <span className="text-xs">{gift.historyPage}-sahifa</span>
                            <button type="button" disabled={gift.historyLoading || !gift.history?.next} onClick={() => gift.refreshHistory({ page: gift.historyPage + 1 })} className={`${buttonStyle} px-2 text-xs`}>Keyingi <ChevronRight size={15} /></button>
                        </div>}
                    </div>}
                </div>
            )}
            {gift.sessionReady && <GiftRevealModal key={scope} open={reveal?.scope === scope} claim={reveal?.scope === scope ? reveal.claim : null} eventName={name} kind={kind} onClose={closeReveal} />}
        </section>
    );
}
