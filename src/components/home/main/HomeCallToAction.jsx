
import React, { memo } from "react";

import { Link } from "react-router-dom";

import {
    ArrowRight,
    Plus,
    Sparkles,
    UserRound,
} from "lucide-react";

import homeStyles from "./homeStyles";

// =========================================================
// FSOCIETY — HOME CALL TO ACTION
//
// Preserved routes:
//
// Guest:
// /register
//
// Logged-in:
// /problem-create
//
// Community:
// /users
//
// No additional authentication request is needed.
// isLoggedIn comes from Main.jsx.
// =========================================================

const HomeCallToAction = ({
    isLoggedIn = false,
}) => {
    const primaryRoute = isLoggedIn
        ? "/problem-create"
        : "/register";

    const primaryText = isLoggedIn
        ? "Muammo joylash"
        : "Hisob ochish";

    const PrimaryIcon = isLoggedIn
        ? Plus
        : UserRound;

    return (
        <section
            aria-labelledby="home-cta-title"
            className={`
                relative min-w-0 overflow-hidden
                border-b bg-white/30

                px-4 py-14
                sm:px-6
                lg:px-8
                xl:px-10

                dark:bg-[#090d17]/60

                ${homeStyles.divider}
            `}
        >
            {/* BACKGROUND GLOW */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none absolute
                    -bottom-24 right-0 h-80 w-80
                    rounded-full bg-fuchsia-300/20
                    blur-[110px]
                    dark:bg-fuchsia-500/[0.07]
                "
            />

            {/* MAIN CTA PANEL */}

            <div
                className="
                    relative min-w-0 overflow-hidden
                    rounded-[26px]
                    border border-indigo-200/80
                    bg-gradient-to-br
                    from-indigo-50/95
                    via-white/85
                    to-cyan-50/90

                    p-5 shadow-[0_18px_55px_rgba(79,70,229,0.08)]
                    backdrop-blur-md

                    sm:rounded-[28px] sm:p-8
                    lg:p-10

                    dark:border-indigo-400/20
                    dark:from-indigo-400/[0.10]
                    dark:via-[#111827]/95
                    dark:to-cyan-400/[0.07]

                    dark:shadow-[0_25px_70px_rgba(0,0,0,0.18)]
                "
            >
                {/* SUBTLE GRID */}

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none absolute inset-0
                        opacity-[0.30]

                        [background-image:linear-gradient(rgba(99,102,241,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.08)_1px,transparent_1px)]
                        [background-size:28px_28px]

                        dark:opacity-[0.16]
                    "
                />

                {/* CORNER GLOW */}

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none absolute
                        -right-20 -top-20 h-64 w-64
                        rounded-full bg-indigo-300/20
                        blur-[90px]
                        dark:bg-indigo-500/10
                    "
                />

                <div
                    className="
                        relative grid min-w-0 gap-8
                        lg:grid-cols-[minmax(0,1fr)_auto]
                        lg:items-center
                    "
                >
                    {/* CONTENT */}

                    <div className="min-w-0">
                        <span
                            className="
                                inline-flex max-w-full
                                items-center gap-2 rounded-full

                                border border-indigo-200
                                bg-indigo-50/85

                                px-3 py-1.5
                                font-mono text-[10px] font-black
                                uppercase tracking-[0.12em]
                                text-indigo-700

                                dark:border-indigo-400/20
                                dark:bg-indigo-400/[0.09]
                                dark:text-indigo-300
                            "
                        >
                            <Sparkles
                                size={13}
                                strokeWidth={2}
                                aria-hidden="true"
                            />

                            next://your_contribution
                        </span>

                        <h2
                            id="home-cta-title"
                            className="
                                mt-5 max-w-3xl text-3xl
                                font-black tracking-[-0.04em]
                                leading-tight text-slate-900

                                sm:text-4xl
                                dark:text-white
                            "
                        >
                            Keyingi kuchli yechim{" "}

                            <span
                                className="
                                    bg-gradient-to-r
                                    from-indigo-600
                                    to-cyan-600
                                    bg-clip-text text-transparent

                                    dark:from-indigo-300
                                    dark:to-cyan-300
                                "
                            >
                                sizniki bo‘lishi mumkin.
                            </span>
                        </h2>

                        <p
                            className="
                                mt-4 max-w-2xl text-sm
                                leading-7 text-slate-600

                                dark:text-slate-400
                            "
                        >
                            Savol bering, yechim yozing,
                            portfolio yarating va F.Society
                            jamiyatida o‘z developer
                            izingizni qoldiring.
                        </p>
                    </div>

                    {/* ACTIONS */}

                    <div
                        className="
                            flex min-w-0 flex-col gap-3
                            sm:flex-row
                            lg:min-w-[200px] lg:flex-col
                        "
                    >
                        {/* REGISTER / CREATE PROBLEM */}

                        <Link
                            to={primaryRoute}
                            className="
                                group/primary inline-flex
                                min-h-12 items-center justify-center
                                gap-2.5 rounded-2xl

                                bg-gradient-to-r
                                from-indigo-600 to-cyan-600

                                px-5 py-3
                                text-sm font-black text-white

                                shadow-lg shadow-indigo-500/15
                                transition-all duration-200

                                hover:-translate-y-0.5
                                hover:from-indigo-500
                                hover:to-cyan-500
                                hover:shadow-indigo-500/25

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-indigo-500
                                focus-visible:ring-offset-2

                                dark:focus-visible:ring-offset-[#111827]

                                motion-reduce:transform-none
                                motion-reduce:transition-none
                            "
                        >
                            <PrimaryIcon
                                size={17}
                                strokeWidth={2.2}
                                aria-hidden="true"
                            />

                            {primaryText}

                            <ArrowRight
                                size={15}
                                strokeWidth={2}
                                aria-hidden="true"
                                className="
                                    transition-transform duration-200
                                    group-hover/primary:translate-x-1
                                    motion-reduce:transform-none
                                "
                            />
                        </Link>

                        {/* COMMUNITY */}

                        <Link
                            to="/users"
                            className={`
                                group/community inline-flex
                                min-h-12 items-center justify-center
                                gap-2.5 rounded-2xl border

                                px-5 py-3 text-sm font-bold

                                transition-all duration-200
                                hover:-translate-y-0.5

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-indigo-500

                                motion-reduce:transform-none
                                motion-reduce:transition-none

                                ${homeStyles.secondaryButton}
                            `}
                        >
                            <UserRound
                                size={17}
                                strokeWidth={2}
                                aria-hidden="true"
                            />

                            Community
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default memo(HomeCallToAction);
