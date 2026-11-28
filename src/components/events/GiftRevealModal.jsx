import React, { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Sparkles, X } from "lucide-react";
import GiftGreeting from "./GiftGreeting";
import GiftRewardResult from "./GiftRewardResult";

export default function GiftRevealModal({ open, claim, eventName, kind = "seasonal", onClose }) {
    const titleId = useId();
    const dialog = useRef(null);
    const closeButton = useRef(null);
    const reducedMotion = useReducedMotion();
    const daily = kind === "daily";
    useEffect(() => {
        if (!open) return undefined;
        const previousFocus = document.activeElement;
        const overflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeButton.current?.focus();
        const onKeyDown = (event) => {
            if (event.key === "Escape") { event.preventDefault(); onClose(); }
            if (event.key !== "Tab") return;
            const controls = Array.from(dialog.current?.querySelectorAll('button:not([disabled]), a[href]') ?? []);
            const first = controls[0];
            const last = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
            else if (!dialog.current?.contains(document.activeElement)) { event.preventDefault(); first?.focus(); }
        };
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = overflow;
            if (previousFocus?.isConnected) previousFocus.focus?.();
        };
    }, [open, onClose]);
    if (typeof document === "undefined") return null;
    return createPortal(
        <AnimatePresence>
            {open && claim && (
                <motion.div key="gift-reveal" initial={{ opacity: reducedMotion ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: reducedMotion ? 0 : 0.2 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto bg-[#050915]/80 px-3 py-5 backdrop-blur-md"
                    onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
                    <motion.div ref={dialog} role="dialog" aria-modal="true" aria-labelledby={titleId}
                        initial={reducedMotion ? false : { y: 24, scale: 0.9 }} animate={{ y: 0, scale: 1 }}
                        transition={{ duration: reducedMotion ? 0 : 0.35 }}
                        className="relative my-auto max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-[28px] border border-violet-200 bg-white p-6 text-center text-slate-900 shadow-2xl dark:border-white/15 dark:bg-[#101a2c] dark:text-white">
                        <button ref={closeButton} type="button" onClick={onClose} aria-label="Mukofot oynasini yopish"
                            className="absolute right-3 top-3 rounded-xl p-2 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:hover:bg-white/10"><X size={20} /></button>
                        <Sparkles className={`mx-auto mt-2 ${daily ? "text-cyan-500" : "text-fuchsia-500"}`} />
                        <p className={`mt-3 text-xs font-black uppercase tracking-widest ${daily ? "text-cyan-700 dark:text-cyan-300" : "text-fuchsia-700 dark:text-fuchsia-300"}`}>
                            FSOCIETY {daily ? "DAILY GIFT" : "SEASONAL GIFT"}
                        </p>
                        <h2 id={titleId} className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{daily ? "Bugungi sovg‘angiz" : "Bayram sovg‘angiz"}</h2>
                        <p className="mb-5 mt-2 break-words text-sm text-slate-500 dark:text-slate-400">{eventName}</p>
                        <motion.div initial={reducedMotion ? false : { opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : 0.15 }}>
                            <GiftRewardResult claim={claim} />
                            <GiftGreeting greeting={claim.greeting} kind={kind} />
                        </motion.div>
                        <p className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400"><ShieldCheck size={15} /> Mukofot hisobingizga yozildi</p>
                        <button type="button" onClick={onClose} className={`mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${daily ? "bg-gradient-to-r from-cyan-600 to-blue-600" : "bg-gradient-to-r from-violet-600 to-fuchsia-600"}`}>
                            <CheckCircle2 size={18} /> Ajoyib, rahmat!
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>, document.body,
    );
}
