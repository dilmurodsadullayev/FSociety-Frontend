
import React from "react";

import {
    Loader2,
    MessageCircle,
    ShieldAlert,
} from "lucide-react";

// =========================================================
// LOADING SKELETON
// =========================================================

export const CommentsSkeleton = () => {
    return (
        <div
            role="status"
            aria-label="Fikrlar yuklanmoqda"
            className="space-y-3"
        >
            {[1, 2, 3].map((item) => (
                <div
                    key={item}
                    className="
                        rounded-2xl
                        border
                        border-[#dce5f0]
                        bg-white/85
                        p-4
                        shadow-[0_8px_25px_rgba(30,41,59,0.04)]

                        sm:p-5

                        dark:border-white/[0.07]
                        dark:bg-[#10151f]
                        dark:shadow-none
                    "
                >
                    <div className="flex items-start gap-3">
                        <div
                            className="
                                h-11
                                w-11
                                shrink-0
                                animate-pulse
                                rounded-full
                                bg-slate-200

                                dark:bg-white/[0.07]

                                motion-reduce:animate-none
                            "
                        />

                        <div className="min-w-0 flex-1 space-y-3">
                            <div
                                className="
                                    h-3.5
                                    w-32
                                    max-w-full
                                    animate-pulse
                                    rounded-full
                                    bg-slate-200

                                    dark:bg-white/[0.07]

                                    motion-reduce:animate-none
                                "
                            />

                            <div
                                className="
                                    h-3
                                    w-full
                                    animate-pulse
                                    rounded-full
                                    bg-slate-100

                                    dark:bg-white/[0.05]

                                    motion-reduce:animate-none
                                "
                            />

                            <div
                                className="
                                    h-3
                                    w-3/4
                                    animate-pulse
                                    rounded-full
                                    bg-slate-100

                                    dark:bg-white/[0.05]

                                    motion-reduce:animate-none
                                "
                            />
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

export const CommentsErrorState = ({
    message,
    onRetry,
}) => {
    return (
        <div
            role="alert"
            className="
                rounded-3xl
                border
                border-red-400/25
                bg-red-500/[0.05]
                p-6
                text-center

                sm:p-8

                dark:border-red-400/20
                dark:bg-red-500/[0.07]
            "
        >
            <div
                className="
                    mx-auto
                    grid
                    h-14
                    w-14
                    place-items-center
                    rounded-2xl
                    border
                    border-red-400/25
                    bg-red-500/10
                    text-red-600

                    dark:text-red-300
                "
            >
                <ShieldAlert
                    size={26}
                    strokeWidth={1.8}
                    aria-hidden="true"
                />
            </div>

            <h4
                className="
                    mt-4
                    text-lg
                    font-black
                    text-slate-900

                    dark:text-white
                "
            >
                Fikrlar yuklanmadi
            </h4>

            <p
                className="
                    mx-auto
                    mt-2
                    max-w-lg
                    break-words
                    text-sm
                    leading-6
                    text-slate-600

                    dark:text-gray-400
                "
            >
                {message}
            </p>

            <button
                type="button"
                onClick={onRetry}
                className="
                    mt-5
                    inline-flex
                    min-h-11
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-red-600
                    px-5
                    py-2.5
                    text-sm
                    font-bold
                    text-white
                    transition-colors
                    duration-150

                    hover:bg-red-500

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-red-500
                    focus-visible:ring-offset-2

                    dark:focus-visible:ring-offset-[#10151f]
                "
            >
                <Loader2
                    size={16}
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

export const EmptyComments = () => {
    return (
        <div
            className="
                rounded-3xl
                border
                border-dashed
                border-[#dce5f0]
                bg-white/80
                px-5
                py-10
                text-center

                sm:px-8
                sm:py-12

                dark:border-white/[0.08]
                dark:bg-white/[0.025]
            "
        >
            <div
                className="
                    mx-auto
                    grid
                    h-16
                    w-16
                    place-items-center
                    rounded-2xl
                    border
                    border-indigo-400/20
                    bg-indigo-500/[0.07]
                    text-indigo-600

                    dark:text-indigo-300
                "
            >
                <MessageCircle
                    size={30}
                    strokeWidth={1.8}
                    aria-hidden="true"
                />
            </div>

            <h4
                className="
                    mt-5
                    text-lg
                    font-black
                    text-slate-900

                    dark:text-white
                "
            >
                Hali fikrlar mavjud emas
            </h4>

            <p
                className="
                    mx-auto
                    mt-2
                    max-w-lg
                    text-sm
                    leading-6
                    text-slate-600

                    dark:text-gray-500
                "
            >
                Birinchi bo‘lib fikr qoldiring va FSociety
                hamjamiyatini jonlantiring.
            </p>
        </div>
    );
};
