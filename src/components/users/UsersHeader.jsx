import React, { memo } from "react";

import {
    Code2,
    Sparkles,
    UsersRound,
} from "lucide-react";

const UsersHeader = ({
    totalUsersCount = 0,
    isLoading = false,
}) => (
    <header className="mx-auto mb-9 max-w-3xl text-center sm:mb-11">
        <div
            className="
                mb-5 inline-flex max-w-full items-center gap-2
                rounded-full border border-indigo-200 bg-indigo-50
                px-4 py-2 text-xs font-black text-indigo-700
                dark:border-indigo-400/20 dark:bg-indigo-400/[0.08]
                dark:text-indigo-300
            "
        >
            <UsersRound size={15} aria-hidden="true" />

            <span>
                {isLoading
                    ? "Hamjamiyat yuklanmoqda"
                    : `${totalUsersCount.toLocaleString("uz-UZ")} ta a’zo`}
            </span>
        </div>

        <h1
            className="
                text-3xl font-black tracking-tight text-slate-900
                sm:text-5xl lg:text-6xl dark:text-white
            "
        >
            Bizning{" "}
            <span
                className="
                    bg-gradient-to-r from-cyan-600 via-indigo-600
                    to-fuchsia-600 bg-clip-text text-transparent
                    dark:from-cyan-300 dark:via-indigo-300
                    dark:to-fuchsia-300
                "
            >
                Hamjamiyat
            </span>
        </h1>

        <p
            className="
                mx-auto mt-5 max-w-2xl text-sm leading-7
                text-slate-600 sm:text-base dark:text-slate-400
            "
        >
            Bilim ulashuvchi, muammolarga yechim topuvchi va
            bir-birini qo‘llab-quvvatlovchi dasturchilar bilan tanishing.
        </p>

        <div
            aria-hidden="true"
            className="
                mt-5 flex items-center justify-center gap-2
                text-indigo-600 dark:text-indigo-400
            "
        >
            <Code2 size={14} />
            <span className="h-px w-10 bg-indigo-300 dark:bg-indigo-400/30" />
            <Sparkles size={15} />
            <span className="h-px w-10 bg-indigo-300 dark:bg-indigo-400/30" />
            <Code2 size={14} />
        </div>
    </header>
);

export default memo(UsersHeader);