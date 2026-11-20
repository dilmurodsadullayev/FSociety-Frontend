import React, { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, X } from "lucide-react";
import formatBirthday from "../../../utils/formatBirthday";
import { AchievementMetadata } from "./AchievementCard";
import AchievementShowcase from "./AchievementShowcase";
import { achievementButton } from "./achievementStyles";

export default function AchievementDetailsModal({ item, onClose }) {
    const dialogRef = useRef(null);
    const previousFocusRef = useRef(document.activeElement);
    const titleId = useId();
    const awardedDate = formatBirthday(item.awarded_at);
    useEffect(() => {
        const dialog = dialogRef.current;
        const previousFocus = previousFocusRef.current;
        dialog.showModal();
        return () => {
            dialog.close();
            if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
        };
    }, []);
    return createPortal(
        <>
            <style>{"body:has(dialog[data-profile-achievement][open]) { overflow: hidden !important; }"}</style>
            <dialog
                ref={dialogRef}
                data-profile-achievement=""
                aria-labelledby={titleId}
                onCancel={event => { event.preventDefault(); onClose(); }}
                onClick={event => { if (event.target === event.currentTarget) onClose(); }}
                className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/75 dark:border-white/15 dark:bg-[#0b111b] dark:text-white"
            >
                <div className="relative min-w-0">
                    <div className="group relative">
                        <AchievementShowcase badge={item.badge} rarity={item.rarity} variant="modal" />
                        <button autoFocus type="button" onClick={onClose} aria-label="Yopish" className={`absolute right-3 top-3 z-20 bg-white/95 px-3 dark:bg-slate-900 ${achievementButton}`}><X size={20} aria-hidden="true" /></button>
                    </div>
                    <div className="min-w-0 p-5 sm:p-7">
                        <AchievementMetadata item={item} />
                        <h3 id={titleId} className="mt-3 break-words text-2xl font-black leading-tight [overflow-wrap:anywhere]">{item.badge.name}</h3>
                        <p className="mt-3 whitespace-pre-wrap break-words text-base leading-relaxed text-slate-600 [overflow-wrap:anywhere] dark:text-slate-300">{item.badge.description}</p>
                        <dl className="mt-6 space-y-4 border-t border-slate-100 pt-5 text-sm dark:border-white/[0.08]">
                            <div>
                                <dt className="mb-1 flex items-center gap-2 text-slate-500 dark:text-slate-400"><CalendarDays size={15} aria-hidden="true" />Olingan sana</dt>
                                <dd className="font-semibold"><time dateTime={awardedDate ? item.awarded_at : undefined}>{awardedDate || "Sana ko‘rsatilmagan"}</time></dd>
                            </div>
                            {item.event_name && <div><dt className="mb-1 text-slate-500 dark:text-slate-400">Tadbir</dt><dd className="break-words font-semibold [overflow-wrap:anywhere]">{item.event_name}</dd></div>}
                            {item.source === "daily_gift" && <div><dt className="mb-1 text-slate-500 dark:text-slate-400">Manba</dt><dd className="font-semibold">Daily Gift</dd></div>}
                        </dl>
                    </div>
                </div>
            </dialog>
        </>, document.body);
}
