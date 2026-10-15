
import React from "react";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";

// =========================================================
// FSOCIETY — WELCOME CARD
//
// Features:
// - Dark / Light Mode
// - Separate greeting and username
// - Long username support
// - Developer level
// - FCoin balance
// - Guest login
// =========================================================

const WelcomeCard = ({
    isLoggedIn,
    user,
}) => {
    // =====================================================
    // USER DATA
    // =====================================================

    const username =
        isLoggedIn && user?.username
            ? user.username
            : "guest";

    const userLevel = isLoggedIn
        ? (
            user?.skill_level ||
            user?.level ||
            "developer"
        )
        : "guest";

    const userCoins = isLoggedIn
        ? user?.coins ?? 0
        : 0;

    // =====================================================
    // JSX
    // =====================================================

    return (
        <section
            aria-label="Xush kelibsiz"
            className="
                relative
                min-w-0
                overflow-hidden
                rounded-3xl
                border
                border-cyan-500/20
                bg-[#f9fbff]
                p-5
                shadow-[0_12px_35px_rgba(30,41,59,0.06)]

                dark:border-cyan-400/20
                dark:bg-[#0d1117]
                dark:shadow-2xl
                dark:shadow-cyan-500/5
            "
        >
            {/* BACKGROUND ACCENT */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    -right-16
                    -top-16
                    h-40
                    w-40
                    rounded-full
                    bg-cyan-500/[0.06]
                    blur-3xl
                "
            />

            {/* CONTENT */}

            <div
                className="
                    relative
                    z-10
                    min-w-0
                    text-left
                    font-mono
                "
            >
                {/* SESSION */}

                <p
                    className="
                        text-[10px]
                        font-black
                        uppercase
                        tracking-[0.35em]
                        text-slate-500
                        dark:text-gray-600
                    "
                >
                    fsociety://session
                </p>

                {/* ==================================
                    WELCOME HEADING
                ================================== */}

                <h2
                    className="
                        mt-3
                        min-w-0
                        font-black
                        tracking-tight
                    "
                >
                    {/* GREETING */}

                    <span
                        className="
                            block
                            text-[19px]
                            leading-[1.4]
                            text-slate-800
                            sm:text-xl

                            dark:text-gray-100
                        "
                    >
                        Salom, xush kelibsiz!
                    </span>

                    {/* USERNAME — SEPARATE LINE */}

                    <span
                        className="
                            mt-2
                            block
                            min-w-0
                            break-words
                            [overflow-wrap:anywhere]

                            text-[21px]
                            leading-[1.35]
                            font-black
                            tracking-[-0.025em]

                            text-slate-950

                            dark:text-white
                        "
                    >
                        @{username}

                        {/* TERMINAL CURSOR */}

                        <span
                            aria-hidden="true"
                            className="
                                ml-1
                                inline-block
                                animate-pulse
                                align-baseline

                                text-indigo-500

                                dark:text-indigo-400

                                motion-reduce:animate-none
                            "
                        >
                            _
                        </span>
                    </span>
                </h2>

                {/* ==================================
                    USER INFORMATION
                ================================== */}

                <div
                    className="
                        mt-4
                        flex
                        flex-wrap
                        items-center

                        gap-x-3
                        gap-y-2

                        text-[10px]
                        font-black
                        uppercase
                        tracking-[0.13em]

                        text-slate-500

                        dark:text-gray-500
                    "
                >
                    {/* LEVEL */}

                    <span>
                        Level:{" "}

                        <span
                            className="
                                text-slate-800
                                dark:text-gray-200
                            "
                        >
                            {userLevel}
                        </span>
                    </span>

                    {/* SEPARATOR */}

                    <span
                        aria-hidden="true"
                        className="
                            text-slate-300
                            dark:text-gray-700
                        "
                    >
                        /
                    </span>

                    {/* FCOIN */}

                    <span>
                        FCoin:{" "}

                        <span
                            className="
                                text-slate-800
                                dark:text-gray-200
                            "
                        >
                            {userCoins}
                        </span>
                    </span>
                </div>
            </div>

            {/* ======================================
                GUEST LOGIN BUTTON
            ================================== */}

            {!isLoggedIn && (
                <Link
                    to="/login"
                    className="
                        relative
                        z-10

                        mt-5
                        inline-flex
                        w-full

                        items-center
                        justify-center
                        gap-2

                        rounded-xl
                        border
                        border-cyan-500/25
                        bg-cyan-500/[0.08]

                        px-4
                        py-3

                        text-sm
                        font-black
                        text-cyan-700

                        transition-colors
                        duration-150

                        hover:border-cyan-500/40
                        hover:bg-cyan-500/[0.14]

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-cyan-500

                        dark:border-cyan-400/20
                        dark:bg-cyan-400/10
                        dark:text-cyan-300

                        dark:hover:border-cyan-400/40
                        dark:hover:bg-cyan-400/20
                    "
                >
                    <LogIn
                        size={17}
                        strokeWidth={2.2}
                        aria-hidden="true"
                    />

                    Tizimga kirish
                </Link>
            )}
        </section>
    );
};

export default React.memo(WelcomeCard);
