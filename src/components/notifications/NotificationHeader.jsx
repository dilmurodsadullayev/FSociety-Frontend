// src/components/notifications/NotificationHeader.jsx

import React, { memo } from "react";

import {
    motion,
    useReducedMotion,
} from "framer-motion";

// =========================================================
// NOTIFICATION HEADER
//
// - Notification Center badge
// - Gradient heading
// - Description
// - Responsive typography
// - Light / Dark Mode
// - Reduced Motion
// =========================================================

const NotificationHeader = () => {
    const reduceMotion = useReducedMotion();

    return (
        <motion.header
            initial={
                reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: -18,
                    }
            }
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: reduceMotion ? 0 : 0.45,
                ease: "easeOut",
            }}
            className="
                relative mb-8 min-w-0 text-center
            "
        >
            {/* =====================================
                NOTIFICATION CENTER BADGE
            ====================================== */}

            <div
                className="
                    mb-5 inline-flex max-w-full
                    items-center gap-2 rounded-full

                    border border-indigo-200
                    bg-indigo-50/90

                    px-4 py-2

                    font-mono text-[10px]
                    font-bold uppercase
                    tracking-[0.18em]

                    text-indigo-700
                    shadow-sm backdrop-blur-sm

                    dark:border-indigo-400/20
                    dark:bg-indigo-500/[0.07]
                    dark:text-indigo-300
                "
            >
                <span
                    aria-hidden="true"
                    className="
                        h-2 w-2 shrink-0
                        rounded-full bg-indigo-500

                        shadow-[0_0_12px_rgba(129,140,248,0.55)]

                        dark:bg-indigo-400
                    "
                />

                <span>
                    Notification Center
                </span>
            </div>

            {/* =====================================
                PAGE TITLE
            ====================================== */}

            <h1
                className="
                    break-words text-3xl
                    font-black tracking-[-0.045em]

                    text-slate-900 dark:text-white

                    sm:text-5xl
                    lg:text-6xl
                "
            >
                Bildirishnomalar{" "}

                <span
                    className="
                        bg-gradient-to-r

                        from-indigo-600
                        via-purple-600
                        to-cyan-600

                        bg-clip-text
                        text-transparent

                        dark:from-indigo-300
                        dark:via-purple-400
                        dark:to-cyan-300
                    "
                >
                    Markazi
                </span>
            </h1>

            {/* =====================================
                DESCRIPTION
            ====================================== */}

            <p
                className="
                    mx-auto mt-4 max-w-2xl
                    break-words

                    text-sm font-medium leading-7

                    text-slate-600
                    dark:text-slate-400

                    sm:text-base
                "
            >
                FCoin mukofotlari, problem, post,
                badge va boshqa muhim xabarlar
                shu yerda jamlanadi.
            </p>
        </motion.header>
    );
};

export default memo(NotificationHeader);