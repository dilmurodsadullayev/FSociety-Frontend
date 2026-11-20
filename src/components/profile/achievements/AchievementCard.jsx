import React, { memo } from "react";
import { ArrowUpRight, CalendarDays, EyeOff } from "lucide-react";
import formatBirthday from "../../../utils/formatBirthday";
import AchievementShowcase from "./AchievementShowcase";
import { achievementCardBody, getAchievementStyle } from "./achievementStyles";

export function AchievementMetadata({ item }) {
    const tone = getAchievementStyle(item.rarity);
    if (!item.rarity && item.reward_type !== "achievement" && !item.is_secret) return null;
    return (
        <div className="flex min-w-0 flex-wrap items-center gap-2 text-xs">
            {item.rarity && <span className={`rounded-lg border px-2 py-1 font-mono font-semibold uppercase tracking-wide ${tone.border} ${tone.chip} ${tone.color}`}>{item.rarity}</span>}
            {item.reward_type === "achievement" && <span className="font-medium text-slate-600 dark:text-slate-300">Maxsus achievement</span>}
            {item.is_secret && <span className="inline-flex items-center gap-1 font-medium text-violet-700 dark:text-violet-300"><EyeOff size={14} aria-hidden="true" />Maxfiy yutuq</span>}
        </div>
    );
}

function AchievementCard({ item, onSelect }) {
    const tone = getAchievementStyle(item.rarity);
    const awardedDate = formatBirthday(item.awarded_at);
    return (
        <button
            type="button"
            onClick={() => onSelect(item)}
            aria-label={`${item.badge.name} — batafsil`}
            className={`group relative flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border bg-white text-left shadow-sm transition duration-300 motion-safe:hover:-translate-y-1 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 dark:bg-[#0b111b] dark:focus-visible:ring-offset-slate-950 ${tone.border} ${tone.hover}`}
        >
            <AchievementShowcase badge={item.badge} rarity={item.rarity} />
            <div className={achievementCardBody}>
                <h4 title={item.badge.name} className="line-clamp-2 min-h-6 break-words text-base font-bold leading-6 text-slate-900 [overflow-wrap:anywhere] dark:text-white">
                    {item.badge.name}
                </h4>
                <p className="mt-2 line-clamp-2 min-h-10 break-words text-sm leading-5 text-slate-600 [overflow-wrap:anywhere] dark:text-slate-400">
                    {item.badge.description}
                </p>
                {(item.rarity || item.reward_type === "achievement" || item.is_secret) && <div className="mt-4"><AchievementMetadata item={item} /></div>}
                {item.event_name && <p className="mt-3 line-clamp-1 break-words text-xs font-medium text-cyan-800 dark:text-cyan-300" title={item.event_name}>{item.event_name}</p>}
                <div className="mt-auto pt-4">
                    <div className="flex min-w-0 items-center justify-between gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-white/[0.07] dark:text-slate-400">
                        <span className="flex min-w-0 items-center gap-2">
                            <CalendarDays size={14} className="shrink-0" aria-hidden="true" />
                            <time dateTime={awardedDate ? item.awarded_at : undefined}>{awardedDate || "Sana ko‘rsatilmagan"}</time>
                        </span>
                        <ArrowUpRight size={17} aria-hidden="true" className="shrink-0 text-slate-400 transition-colors duration-200 group-hover:text-cyan-700 dark:group-hover:text-cyan-300" />
                    </div>
                </div>
            </div>
        </button>
    );
}

export default memo(AchievementCard);
