import React, { memo } from "react";

const Block = ({ className = "" }) => (
    <div
        aria-hidden="true"
        className={`
            rounded-xl bg-slate-200
            dark:bg-white/[0.08]
            ${className}
        `}
    />
);

const UserCardSkeleton = () => (
    <article
        role="status"
        aria-label="Foydalanuvchi kartasi yuklanmoqda"
        className="
            flex h-full min-h-[365px] flex-col
            rounded-[24px] border border-slate-200
            bg-white p-5 shadow-sm
            animate-pulse motion-reduce:animate-none
            dark:border-white/[0.09] dark:bg-[#0e1421]
        "
    >
        <span className="sr-only">
            Foydalanuvchi yuklanmoqda.
        </span>

        <div className="mb-5 flex items-center justify-between">
            <Block className="h-3 w-28 rounded-full" />
            <Block className="h-7 w-11 rounded-full" />
        </div>

        <div className="flex items-center gap-3">
            <Block className="h-16 w-16 shrink-0 rounded-2xl" />

            <div className="min-w-0 flex-1 space-y-3">
                <Block className="h-4 w-3/4 rounded-full" />
                <Block className="h-6 w-24 rounded-full" />
            </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
            <Block className="h-24 rounded-2xl" />
            <Block className="h-24 rounded-2xl" />
        </div>

        <div className="mt-6 flex-1 space-y-3">
            <Block className="h-3 w-20 rounded-full" />

            <div className="flex flex-wrap gap-2">
                <Block className="h-7 w-20 rounded-full" />
                <Block className="h-7 w-24 rounded-full" />
                <Block className="h-7 w-16 rounded-full" />
            </div>
        </div>

        <div className="mt-6 border-t border-slate-200 pt-4 dark:border-white/10">
            <Block className="h-11 w-full rounded-xl" />
        </div>
    </article>
);

export default memo(UserCardSkeleton);