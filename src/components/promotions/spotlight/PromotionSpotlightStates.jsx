
import React from "react";

import { RefreshCw } from "lucide-react";

// =========================================================
// LOADING SKELETON
// =========================================================

export const PromotionSpotlightSkeleton = () => {
    return (
        <section
            role="status"
            aria-label="Promotion loyihalar yuklanmoqda"
            className="
                overflow-hidden
                rounded-2xl
                border
                border-[#dce5f0]
                bg-[#f9fbff]
                shadow-[0_8px_25px_rgba(30,41,59,0.05)]
                dark:border-white/10
                dark:bg-[#0d1117]
                dark:shadow-xl
                dark:shadow-black/10
            "
        >
            <div
                className="
                    flex
                    h-8
                    items-center
                    justify-between
                    border-b
                    border-[#e2e8f2]
                    px-3.5
                    dark:border-white/[0.06]
                "
            >
                <div className="h-2 w-20 rounded-full bg-slate-200 dark:bg-white/[0.06]" />
                <div className="h-2 w-8 rounded-full bg-slate-200 dark:bg-white/[0.04]" />
            </div>

            <div className="px-3.5 py-3">
                <div className="flex items-center gap-3">
                    <div
                        className="
                            h-11
                            w-11
                            shrink-0
                            rounded-xl
                            bg-slate-200
                            dark:bg-white/[0.055]
                        "
                    />

                    <div className="min-w-0 flex-1">
                        <div className="h-3 w-2/3 rounded-full bg-slate-200 dark:bg-white/[0.07]" />
                        <div className="mt-2 h-2 w-20 rounded-full bg-slate-100 dark:bg-white/[0.04]" />

                        <div className="mt-2 flex gap-2">
                            <div className="h-2 w-14 rounded-full bg-slate-100 dark:bg-white/[0.04]" />
                            <div className="h-2 w-12 rounded-full bg-slate-100 dark:bg-white/[0.04]" />
                        </div>
                    </div>
                </div>

                <div
                    className="
                        mt-2.5
                        flex
                        items-center
                        justify-between
                        border-t
                        border-[#e2e8f2]
                        pt-2.5
                        dark:border-white/[0.055]
                    "
                >
                    <div className="flex gap-4">
                        <div className="h-3 w-16 rounded-full bg-slate-200 dark:bg-white/[0.05]" />
                        <div className="h-3 w-16 rounded-full bg-slate-200 dark:bg-white/[0.05]" />
                    </div>

                    <div className="h-2 w-5 rounded-full bg-slate-100 dark:bg-white/[0.035]" />
                </div>
            </div>
        </section>
    );
};

// =========================================================
// ERROR STATE
// =========================================================

export const PromotionSpotlightError = ({
    error,
    onRetry,
}) => {
    return (
        <div
            role="alert"
            className="
                flex
                items-center
                justify-between
                gap-3
                rounded-2xl
                border
                border-red-400/25
                bg-[#fff8f8]
                px-4
                py-3
                dark:border-red-400/20
                dark:bg-[#0d1117]
            "
        >
            <div className="min-w-0">
                <p className="text-[11px] font-black text-red-700 dark:text-red-300">
                    Promotion yuklanmadi
                </p>

                <p
                    className="
                        mt-1
                        break-words
                        text-[10px]
                        leading-4
                        text-slate-500
                        dark:text-gray-500
                    "
                >
                    {typeof error === "string"
                        ? error
                        : "Ma’lumotlarni yuklashda xatolik."}
                </p>
            </div>

            <button
                type="button"
                onClick={onRetry}
                aria-label="Promotionlarni qayta yuklash"
                title="Qayta urinish"
                className="
                    grid
                    h-9
                    w-9
                    shrink-0
                    place-items-center
                    rounded-xl
                    border
                    border-red-400/20
                    bg-red-500/10
                    text-red-700
                    transition-colors
                    hover:bg-red-500/20
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-red-500
                    dark:text-red-300
                "
            >
                <RefreshCw
                    size={15}
                    aria-hidden="true"
                />
            </button>
        </div>
    );
};
