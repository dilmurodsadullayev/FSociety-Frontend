
import React from "react";

import {
    AlertTriangle,
    Cake,
    RefreshCw,
} from "lucide-react";

// =========================================================
// FSOCIETY — BIRTHDAY STATES
//
// Loading
// Error + Retry
// Empty
//
// Dark / Light Mode supported.
// =========================================================

// =========================================================
// LOADING STATE
// =========================================================

export const BirthdayLoadingState = () => {
    return (
        <div
            role="status"

            aria-label="Tug‘ilgan kunlar yuklanmoqda"

            className="
                space-y-3
            "
        >

            {[0, 1, 2].map((index) => (

                <div
                    key={index}

                    className="
                        animate-pulse

                        rounded-2xl

                        border
                        border-[#dce5f0]

                        bg-[#f8faff]

                        p-3

                        motion-reduce:animate-none

                        dark:border-white/10
                        dark:bg-white/[0.035]
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        {/* AVATAR */}

                        <div
                            className="
                                h-12
                                w-12

                                shrink-0

                                rounded-2xl

                                bg-slate-200

                                dark:bg-gray-700/60
                            "
                        />

                        {/* CONTENT */}

                        <div
                            className="
                                min-w-0
                                flex-1
                            "
                        >

                            <div
                                className="
                                    mb-2

                                    h-4
                                    w-28

                                    max-w-full

                                    rounded

                                    bg-slate-200

                                    dark:bg-gray-700/60
                                "
                            />

                            <div
                                className="
                                    h-3
                                    w-20

                                    rounded

                                    bg-slate-200

                                    dark:bg-gray-700/60
                                "
                            />

                            <div
                                className="
                                    mt-3

                                    flex
                                    gap-2
                                "
                            >

                                <div
                                    className="
                                        h-5
                                        w-20

                                        rounded-full

                                        bg-slate-200

                                        dark:bg-gray-700/60
                                    "
                                />

                                <div
                                    className="
                                        h-5
                                        w-14

                                        rounded-full

                                        bg-slate-200

                                        dark:bg-gray-700/60
                                    "
                                />

                            </div>

                        </div>

                    </div>

                </div>

            ))}

        </div>
    );
};

// =========================================================
// ERROR STATE
// =========================================================

export const BirthdayErrorState = ({
    error,
    onRetry,
}) => {
    return (
        <div
            role="alert"

            className="
                rounded-2xl

                border
                border-red-400/20

                bg-red-500/[0.07]

                p-4

                text-center

                dark:bg-red-500/10
            "
        >

            {/* ICON */}

            <div
                className="
                    mx-auto
                    mb-3

                    grid
                    h-12
                    w-12

                    place-items-center

                    rounded-2xl

                    border
                    border-red-400/20

                    bg-red-500/10

                    text-red-600

                    dark:text-red-300
                "
            >
                <AlertTriangle
                    size={20}
                    strokeWidth={2}
                    aria-hidden="true"
                />
            </div>

            {/* TITLE */}

            <p
                className="
                    text-sm
                    font-black

                    text-red-700

                    dark:text-red-300
                "
            >
                Ma’lumot yuklanmadi
            </p>

            {/* ERROR MESSAGE */}

            <p
                className="
                    mt-1

                    break-words

                    text-xs
                    leading-5

                    text-red-700/80

                    dark:text-red-200/80
                "
            >
                {typeof error === "string"
                    ? error
                    : "Tug‘ilgan kunlarni yuklashda xatolik yuz berdi."}
            </p>

            {/* RETRY */}

            <button
                type="button"

                onClick={onRetry}

                className="
                    mt-4

                    inline-flex
                    items-center
                    justify-center
                    gap-2

                    rounded-xl

                    border
                    border-red-400/20

                    bg-red-500/10

                    px-4
                    py-2

                    text-xs
                    font-black

                    text-red-700

                    transition-colors
                    duration-150

                    hover:border-red-400/30
                    hover:bg-red-500/20

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-red-500

                    dark:text-red-300
                "
            >

                <RefreshCw
                    size={15}
                    strokeWidth={2.2}
                    aria-hidden="true"
                />

                Qayta urinish

            </button>

        </div>
    );
};

// =========================================================
// EMPTY STATE
// =========================================================

export const BirthdayEmptyState = () => {
    return (
        <div
            className="
                rounded-2xl

                border
                border-dashed
                border-[#dce5f0]

                bg-[#f8faff]

                p-5

                text-center

                dark:border-white/10
                dark:bg-white/[0.025]
            "
        >

            {/* ICON */}

            <div
                className="
                    mx-auto
                    mb-3

                    grid
                    h-12
                    w-12

                    place-items-center

                    rounded-2xl

                    border
                    border-pink-400/20

                    bg-pink-500/10

                    text-pink-600

                    dark:text-pink-300
                "
            >
                <Cake
                    size={20}
                    strokeWidth={2}
                    aria-hidden="true"
                />
            </div>

            {/* TITLE */}

            <p
                className="
                    text-sm
                    font-black

                    text-slate-900

                    dark:text-white
                "
            >
                Bu oy tug‘ilgan kun yo‘q
            </p>

            {/* DESCRIPTION */}

            <p
                className="
                    mt-1

                    text-xs
                    leading-5

                    text-slate-500

                    dark:text-gray-500
                "
            >
                Userlar profilida tug‘ilgan sana
                kiritilganda shu yerda ko‘rinadi.
            </p>

        </div>
    );
};
