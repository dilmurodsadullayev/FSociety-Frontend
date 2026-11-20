import React, { memo } from "react";
import { ArrowRight, Trophy } from "lucide-react";
import formatBirthday from "../../../utils/formatBirthday";
import { AchievementImage } from "../achievements/AchievementShowcase";
import { AchievementEmpty, AchievementError, AchievementSkeleton } from "../achievements/AchievementStates";
import { achievementActionButton, achievementSurface, getAchievementStyle, recentAchievementRow, showcaseSizes } from "../achievements/achievementStyles";

const RecentAchievementItem = memo(function RecentAchievementItem({ item }) {
    const awardedDate = formatBirthday(item.awarded_at);
    const tone = getAchievementStyle(item.rarity);
    return (
        <li className={recentAchievementRow}>
            <div className={showcaseSizes.recent.frame}>
                <AchievementImage badge={item.badge} rarity={item.rarity} variant="recent" className={showcaseSizes.recent.image} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="line-clamp-2 break-words text-sm font-bold leading-5 text-slate-900 [overflow-wrap:anywhere] dark:text-slate-100" title={item.badge.name}>{item.badge.name}</p>
                <time dateTime={awardedDate ? item.awarded_at : undefined} className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">{awardedDate || "Sana ko‘rsatilmagan"}</time>
                {item.rarity && <span className={`mt-1 inline-block rounded-md border px-1.5 py-0.5 font-mono text-xs font-semibold uppercase ${tone.border} ${tone.chip} ${tone.color}`}>{item.rarity}</span>}
            </div>
        </li>
    );
});

function ProfileRecentAchievements({ achievements: model, isOwner, onViewAll }) {
    return (
        <section className={`${achievementSurface} overflow-hidden p-4 sm:p-5`} aria-label="So‘nggi yutuqlar">
            <div className="mb-5 flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50 text-cyan-800 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-300"><Trophy size={20} aria-hidden="true" /></span>
                <div className="min-w-0">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">So‘nggi yutuqlar</h3>
                    <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">Oxirgi qo‘lga kiritilgan mukofotlar</p>
                </div>
            </div>
            {model.recentError && <AchievementError onRetry={model.retry} />}
            {model.recentLoading ? <AchievementSkeleton compact /> : model.recent.length ? (
                <ol className="space-y-3">
                    {model.recent.map(item => <RecentAchievementItem key={item.id ?? item.badge_id ?? item.badge.code} item={item} />)}
                </ol>
            ) : !model.recentError && <AchievementEmpty compact isOwner={isOwner} />}
            <button type="button" onClick={onViewAll} className={`mt-5 ${achievementActionButton}`}>
                <span>Barcha yutuqlarni ko‘rish</span>
                <ArrowRight size={18} aria-hidden="true" className="shrink-0 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-reduce:transition-none" />
            </button>
        </section>
    );
}

export default memo(ProfileRecentAchievements);
