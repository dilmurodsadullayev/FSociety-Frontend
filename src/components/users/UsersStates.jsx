import React, { memo } from "react";

import {
    AlertTriangle,
    RefreshCw,
    SearchX,
} from "lucide-react";

export const UsersErrorState = memo(function UsersErrorState({
    error,
    onRetry,
}) {
    return (
        <div
            role="alert"
            className="
                mx-auto w-full max-w-xl rounded-[26px]
                border border-rose-200 bg-rose-50/80
                px-5 py-10 text-center sm:px-8
                dark:border-rose-400/20
                dark:bg-rose-400/[0.055]
            "
        >
            <div
                className="
                    mx-auto grid h-16 w-16 place-items-center
                    rounded-2xl border border-rose-200
                    bg-rose-100 text-rose-700
                    dark:border-rose-400/20
                    dark:bg-rose-400/10
                    dark:text-rose-300
                "
            >
                <AlertTriangle size={27} aria-hidden="true" />
            </div>

            <h2 className="mt-5 text-xl font-black text-slate-900 dark:text-white">
                Foydalanuvchilar yuklanmadi
            </h2>

            <p
                className="
                    mt-3 whitespace-pre-wrap break-words
                    text-sm leading-7 text-slate-600
                    dark:text-slate-300
                "
            >
                {typeof error === "string"
                    ? error
                    : "Server bilan bog‘lanishda xatolik yuz berdi."}
            </p>

            <button
                type="button"
                onClick={onRetry}
                className="
                    mt-6 inline-flex min-h-11 items-center
                    justify-center gap-2 rounded-xl
                    bg-rose-600 px-5 py-3 text-sm
                    font-black text-white hover:bg-rose-700
                    focus-visible:outline-none
                    focus-visible:ring-2 focus-visible:ring-rose-500
                "
            >
                <RefreshCw size={16} aria-hidden="true" />
                Qayta urinish
            </button>
        </div>
    );
});

export const UsersEmptyState = memo(function UsersEmptyState({
    hasSearch = false,
    onClear,
}) {
    return (
        <div
            className="
                mx-auto w-full max-w-xl rounded-[26px]
                border border-dashed border-slate-300
                bg-white/80 px-5 py-10 text-center
                sm:px-8 dark:border-white/[0.12]
                dark:bg-white/[0.025]
            "
        >
            <div
                className="
                    mx-auto grid h-16 w-16 place-items-center
                    rounded-2xl border border-indigo-200
                    bg-indigo-50 text-indigo-700
                    dark:border-indigo-400/20
                    dark:bg-indigo-400/[0.08]
                    dark:text-indigo-300
                "
            >
                <SearchX size={28} aria-hidden="true" />
            </div>

            <h2 className="mt-5 text-xl font-black text-slate-900 dark:text-white">
                Foydalanuvchi topilmadi
            </h2>

            <p
                className="
                    mt-3 text-sm leading-7 text-slate-600
                    dark:text-slate-400
                "
            >
                {hasSearch
                    ? "Qidiruvga mos foydalanuvchi topilmadi. Boshqa so‘z bilan urinib ko‘ring."
                    : "Hozircha ko‘rsatish uchun foydalanuvchi yo‘q."}
            </p>

            {hasSearch && (
                <button
                    type="button"
                    onClick={onClear}
                    className="
                        mt-6 rounded-xl bg-indigo-600
                        px-5 py-3 text-xs font-black
                        text-white hover:bg-indigo-700
                    "
                >
                    Qidiruvni tozalash
                </button>
            )}
        </div>
    );
});