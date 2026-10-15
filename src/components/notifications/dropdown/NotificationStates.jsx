
import React from "react";

import {
    BellOff,
    CheckCircle2,
} from "lucide-react";

// =========================================================
// EMPTY STATE
// =========================================================

export const EmptyState = ({
    type,
}) => {
    const isReadState = type === "read";

    const Icon = isReadState
        ? CheckCircle2
        : BellOff;

    return (
        <div className="px-5 py-12 text-center">

            {/* ICON */}

            <div
                className={`
                    mx-auto
                    mb-4

                    grid
                    h-16
                    w-16

                    place-items-center

                    rounded-2xl
                    border

                    ${
                        isReadState
                            ? `
                                border-emerald-400/20
                                bg-emerald-500/[0.07]
                                text-emerald-600

                                dark:text-emerald-400
                            `
                            : `
                                border-[#dae3ef]
                                bg-[#edf2fa]
                                text-slate-400

                                dark:border-white/[0.06]
                                dark:bg-white/[0.025]
                                dark:text-gray-600
                            `
                    }
                `}
            >
                <Icon
                    size={28}
                    strokeWidth={1.8}
                />
            </div>

            {/* TITLE */}

            <h4
                className="
                    text-[14px]
                    font-bold

                    text-slate-900

                    dark:text-white
                "
            >
                {isReadState
                    ? "Barcha bildirishnomalar o‘qilgan"
                    : "Hali bildirishnomalar mavjud emas"}
            </h4>

            {/* DESCRIPTION */}

            <p
                className="
                    mx-auto
                    mt-2
                    max-w-xs

                    text-[11px]
                    font-medium
                    leading-5

                    text-slate-500

                    dark:text-gray-500
                "
            >
                {isReadState
                    ? "Yangi xabarlar kelganda bu yerda yana ko‘rinadi."
                    : "Problem, post, FCoin yoki badge bo‘yicha xabarlar shu yerda chiqadi."}
            </p>
        </div>
    );
};

// =========================================================
// NOTIFICATION SKELETON
// =========================================================

export const NotificationSkeleton = () => {
    return (
        <div
            role="status"
            aria-label="Bildirishnomalar yuklanmoqda"
            className="space-y-2 p-3"
        >
            {[1, 2, 3].map((item) => (
                <div
                    key={item}
                    className="
                        flex
                        gap-3

                        rounded-2xl
                        border

                        border-[#e2e8f2]
                        bg-[#f7f9fd]

                        p-3

                        animate-pulse
                        motion-reduce:animate-none

                        dark:border-white/[0.05]
                        dark:bg-white/[0.02]
                    "
                >
                    <div
                        className="
                            h-11
                            w-11
                            shrink-0

                            rounded-xl

                            bg-slate-200

                            dark:bg-white/[0.05]
                        "
                    />

                    <div
                        className="
                            flex-1
                            space-y-2
                            pt-1
                        "
                    >
                        <div
                            className="
                                h-2.5
                                w-20
                                rounded-full

                                bg-slate-200

                                dark:bg-white/[0.05]
                            "
                        />

                        <div
                            className="
                                h-3.5
                                w-full
                                rounded-full

                                bg-slate-200

                                dark:bg-white/[0.06]
                            "
                        />

                        <div
                            className="
                                h-2.5
                                w-2/3
                                rounded-full

                                bg-slate-200

                                dark:bg-white/[0.04]
                            "
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};
