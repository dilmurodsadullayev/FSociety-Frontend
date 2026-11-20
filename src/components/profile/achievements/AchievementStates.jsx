import React from "react";
import { Award, AlertCircle } from "lucide-react";
import { achievementButton, achievementCardBody, achievementGrid, achievementSurface, recentAchievementRow, showcaseSizes } from "./achievementStyles";

export function AchievementSkeleton({ compact = false }) {
    return (
        <div role="status" aria-label="Yutuqlar yuklanmoqda" className={compact ? "space-y-3" : achievementGrid}>
            {Array.from({ length: compact ? 3 : 6 }, (_, index) => compact ? (
                <div key={index} aria-hidden="true" className={`${recentAchievementRow} motion-safe:animate-pulse`}>
                    <div className={`${showcaseSizes.recent.frame} rounded-xl bg-slate-200 dark:bg-slate-800`} />
                    <div className="min-w-0 flex-1 space-y-3">
                        <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                        <div className="h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
                    </div>
                </div>
            ) : (
                <div key={index} aria-hidden="true" className={`${achievementSurface} flex h-full flex-col overflow-hidden motion-safe:animate-pulse`}>
                    <div className={`${showcaseSizes.card.frame} flex items-center justify-center bg-slate-50 px-4 dark:bg-[#080e17]`}>
                        <div className={`${showcaseSizes.card.image} rounded-2xl bg-slate-200 dark:bg-slate-800`} />
                    </div>
                    <div className={achievementCardBody}>
                        <div className="flex h-6 items-center"><div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" /></div>
                        <div className="mt-2 flex h-10 flex-col justify-center gap-2"><div className="h-3 w-full rounded bg-slate-100 dark:bg-slate-800" /><div className="h-3 w-4/5 rounded bg-slate-100 dark:bg-slate-800" /></div>
                        <div className="mt-auto pt-4"><div className="border-t border-slate-100 pt-4 dark:border-white/[0.07]"><div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-800" /></div></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function AchievementError({ onRetry }) {
    return <div role="alert" className={`${achievementSurface} p-5 text-sm`}><AlertCircle className="mb-3 text-rose-500" size={22} /><p>Yutuqlarni yuklab bo‘lmadi. Qayta urinib ko‘ring.</p><button type="button" onClick={onRetry} className={`mt-4 ${achievementButton}`}>Qayta urinish</button></div>;
}

export function AchievementEmpty({ isOwner, searching, compact }) {
    return <div className={`${compact ? "" : `${achievementSurface} p-8`} text-center`}>
        <Award size={compact ? 28 : 40} className="mx-auto mb-3 text-slate-400" />
        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{searching ? "Qidiruvga mos yutuqlar topilmadi" : "Hozircha yutuqlar mavjud emas"}</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{searching ? "Qidiruv yoki filter shartlarini o‘zgartiring." : isOwner ? "Faol ishtirok eting va maxsus yutuqlarni qo‘lga kiriting." : "Bu foydalanuvchi hali yutuqlarga ega emas."}</p>
    </div>;
}
