import React, { useState } from "react";
import { ChevronDown, Search, Trophy } from "lucide-react";
import AchievementCard from "./AchievementCard";
import AchievementDetailsModal from "./AchievementDetailsModal";
import { AchievementEmpty, AchievementError, AchievementSkeleton } from "./AchievementStates";
import { achievementGrid, achievementSurface } from "./achievementStyles";
import ProfilePostsPagination from "../posts/ProfilePostsPagination";

const filters = [["", "Barchasi"], ["achievement", "Maxsus achievementlar"], ["event", "Tadbir mukofotlari"], ["secret", "Maxfiy yutuqlar"], ["common", "Common"], ["rare", "Rare"], ["epic", "Epic"], ["legendary", "Legendary"]];
const inputStyle = "min-h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm text-slate-900 transition-colors duration-200 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 motion-reduce:transition-none dark:border-white/10 dark:bg-[#101925] dark:text-white";

export default function ProfileAchievements({ achievements: model, isOwner }) {
    const [selected, setSelected] = useState(null);
    const totalPages = Math.max(1, Math.ceil(model.count / 12));
    return (
        <div className="min-w-0 space-y-5">
            <header className={`${achievementSurface} relative overflow-hidden p-4 sm:p-6`}>
                <span aria-hidden="true" className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
                <div className="relative flex min-w-0 flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1 basis-56">
                        <span className="mb-3 inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-cyan-800 dark:text-cyan-300"><Trophy size={15} aria-hidden="true" />PROFILE ACHIEVEMENTS</span>
                        <h3 className="text-2xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">Yutuqlar kolleksiyasi</h3>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-400">Erishilgan marralar va qo‘lga kiritilgan maxsus mukofotlar</p>
                    </div>
                    <div className="flex min-h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/[0.08] dark:bg-[#101925]">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Jami yutuqlar</span>
                        <strong className="font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-cyan-200">{model.total ?? "—"}</strong>
                    </div>
                </div>
                <div className="mt-5 grid min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] gap-3 border-t border-slate-100 pt-5 dark:border-white/[0.07]">
                    <label className="relative min-w-0">
                        <span className="sr-only">Yutuqlarni qidirish</span>
                        <Search size={18} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input type="search" value={model.search} onChange={event => model.onSearchChange(event.target.value)} placeholder="Nom, tavsif yoki kod orqali..." className={`${inputStyle} pl-10 pr-3`} />
                    </label>
                    {model.supportsFilters !== false && (
                        <label className="relative min-w-0">
                            <span className="sr-only">Yutuqlar filtri</span>
                            <select value={model.filter} onChange={event => model.onFilterChange(event.target.value)} className={`${inputStyle} appearance-none pl-3 pr-10`}>
                                {filters.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                            </select>
                            <ChevronDown size={17} aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        </label>
                    )}
                </div>
            </header>
            {model.error ? <AchievementError onRetry={model.retry} /> : model.loading ? <AchievementSkeleton /> : model.results.length ? (
                <>
                    <p role="status" className="px-1 text-sm text-slate-500 dark:text-slate-400">{model.count} ta yutuq{model.search || model.filter ? " topildi" : ""}</p>
                    <div className={achievementGrid}>
                        {model.results.map(item => <AchievementCard key={item.id ?? item.badge_id ?? item.badge.code} item={item} onSelect={setSelected} />)}
                    </div>
                    <ProfilePostsPagination currentPage={model.page} totalPages={totalPages} hasPreviousPage={model.page > 1} hasNextPage={model.page < totalPages} onPageChange={model.onPageChange} ariaLabel="Yutuqlar sahifalari" />
                </>
            ) : <AchievementEmpty isOwner={isOwner} searching={Boolean(model.search || model.filter)} />}
            {selected && <AchievementDetailsModal item={selected} onClose={() => setSelected(null)} />}
        </div>
    );
}
