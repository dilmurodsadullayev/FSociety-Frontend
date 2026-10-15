
import React from "react";

import { Link } from "react-router-dom";

import {
    Lock,
    MessageCircle,
} from "lucide-react";

import CommentForm from "../CommentForm";

// =========================================================
// FSOCIETY — COMMENT COMPOSER
//
// Authenticated:
// - Existing CommentForm
//
// Guest:
// - Login / Register
//
// Responsive + Dark / Light Mode
// =========================================================

const CommentComposer = ({
    isLoggedIn,
    onSuccess,
}) => {
    return (
        <div
            className="
                mx-auto
                mb-9
                w-full
                max-w-3xl
            "
        >
            {isLoggedIn ? (
                <div
                    className="
                        min-w-0
                        overflow-hidden
                        rounded-3xl
                        border
                        border-[#dce5f0]
                        bg-white
                        p-4

                        shadow-[0_12px_40px_rgba(30,41,59,0.06)]

                        sm:p-5

                        dark:border-white/[0.08]
                        dark:bg-[#10151f]
                        dark:shadow-none
                    "
                >
                    {/* HEADER */}

                    <div
                        className="
                            mb-5
                            flex
                            min-w-0
                            items-center
                            gap-3
                        "
                    >
                        <div
                            className="
                                grid
                                h-11
                                w-11
                                shrink-0
                                place-items-center
                                rounded-2xl
                                border
                                border-indigo-400/20
                                bg-indigo-500/[0.08]
                                text-indigo-600

                                dark:text-indigo-300
                            "
                        >
                            <MessageCircle
                                size={21}
                                strokeWidth={1.9}
                                aria-hidden="true"
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h3
                                className="
                                    text-base
                                    font-black
                                    text-slate-900

                                    sm:text-lg

                                    dark:text-white
                                "
                            >
                                Fikr qoldirish
                            </h3>

                            <p
                                className="
                                    mt-0.5
                                    text-[11px]
                                    font-medium
                                    leading-5
                                    text-slate-500

                                    dark:text-gray-500
                                "
                            >
                                Tajribangizni qisqa va aniq yozing
                            </p>
                        </div>
                    </div>

                    {/* EXISTING FORM */}

                    <div className="min-w-0">
                        <CommentForm
                            onSuccess={onSuccess}
                        />
                    </div>
                </div>
            ) : (
                <div
                    className="
                        min-w-0
                        rounded-3xl
                        border
                        border-[#dce5f0]
                        bg-white
                        px-5
                        py-8
                        text-center

                        shadow-[0_12px_40px_rgba(30,41,59,0.06)]

                        sm:px-8

                        dark:border-white/[0.08]
                        dark:bg-[#10151f]
                        dark:shadow-none
                    "
                >
                    {/* ICON */}

                    <div
                        className="
                            mx-auto
                            grid
                            h-14
                            w-14
                            place-items-center
                            rounded-2xl
                            border
                            border-indigo-400/20
                            bg-indigo-500/[0.08]
                            text-indigo-600

                            dark:text-indigo-300
                        "
                    >
                        <Lock
                            size={25}
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />
                    </div>

                    {/* TITLE */}

                    <h3
                        className="
                            mt-4
                            text-lg
                            font-black
                            leading-snug
                            text-slate-900

                            sm:text-xl

                            dark:text-white
                        "
                    >
                        Fikr qoldirish uchun tizimga kiring
                    </h3>

                    {/* DESCRIPTION */}

                    <p
                        className="
                            mx-auto
                            mt-3
                            max-w-xl
                            text-[13px]
                            leading-6
                            text-slate-600

                            sm:text-sm

                            dark:text-gray-400
                        "
                    >
                        Izoh yozish, fikr bildirish va hamjamiyat
                        bilan muloqot qilish uchun akkauntingizga
                        kiring yoki ro‘yxatdan o‘ting.
                    </p>

                    {/* ACTIONS */}

                    <div
                        className="
                            mt-6
                            flex
                            flex-col
                            justify-center
                            gap-3

                            sm:flex-row
                        "
                    >
                        <Link
                            to="/login"
                            className="
                                inline-flex
                                min-h-11
                                items-center
                                justify-center
                                rounded-xl
                                bg-indigo-600
                                px-5
                                py-2.5
                                text-sm
                                font-bold
                                text-white

                                transition-colors
                                duration-150

                                hover:bg-indigo-500

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-indigo-500
                                focus-visible:ring-offset-2

                                dark:focus-visible:ring-offset-[#10151f]
                            "
                        >
                            Kirish
                        </Link>

                        <Link
                            to="/register"
                            className="
                                inline-flex
                                min-h-11
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-emerald-600
                                bg-emerald-600
                                px-5
                                py-2.5
                                text-sm
                                font-bold
                                text-white

                                transition-colors
                                duration-150

                                hover:bg-emerald-500

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-emerald-500
                                focus-visible:ring-offset-2

                                dark:focus-visible:ring-offset-[#10151f]
                            "
                        >
                            Ro‘yxatdan o‘tish
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(CommentComposer);
