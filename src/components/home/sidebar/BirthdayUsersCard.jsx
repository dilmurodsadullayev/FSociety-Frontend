
import React from "react";

import {
    Cake,
} from "lucide-react";

// =========================================================
// COMPONENTS
// =========================================================

import BirthdayUserItem from "./BirthdayUserItem";

import {
    BirthdayLoadingState,
    BirthdayErrorState,
    BirthdayEmptyState,
} from "./BirthdayStates";

// =========================================================
// FSOCIETY — BIRTHDAY USERS CARD
//
// Responsibilities:
// - Card header
// - Monthly birthday count
// - Loading / Error / Empty states
// - Birthday user list
//
// Data fetching remains in HomeSidebar.
// =========================================================

const BirthdayUsersCard = ({
    users = [],
    count = 0,
    loading = false,
    error = null,
    onRetry,
}) => {

    // =====================================================
    // SAFE DATA
    // =====================================================

    const safeUsers = Array.isArray(users)
        ? users
        : [];

    const totalUsers =
        count ||
        safeUsers.length ||
        0;

    // =====================================================
    // JSX
    // =====================================================

    return (
        <section
            aria-label="Tug‘ilgan kuni yaqin foydalanuvchilar"

            className="
                overflow-hidden

                rounded-3xl

                border
                border-[#dce5f0]

                bg-[#f9fbff]

                shadow-[0_12px_35px_rgba(30,41,59,0.06)]

                dark:border-white/10
                dark:bg-[#0d1117]

                dark:shadow-2xl
                dark:shadow-black/20
            "
        >

            {/* ==========================================
                HEADER
            ========================================== */}

            <div
                className="
                    border-b

                    border-[#e1e8f2]

                    p-5

                    dark:border-white/10
                "
            >

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-4
                    "
                >

                    {/* HEADER TEXT */}

                    <div className="min-w-0">

                        <p
                            className="
                                text-[11px]
                                font-black

                                uppercase
                                tracking-[0.25em]

                                text-slate-500

                                dark:text-gray-500
                            "
                        >
                            Community
                        </p>

                        <h3
                            className="
                                mt-1

                                text-lg
                                font-black

                                text-slate-900

                                dark:text-white
                            "
                        >
                            Tug‘ilgan kuni yaqinlar
                        </h3>

                    </div>

                    {/* CAKE ICON */}

                    <div
                        className="
                            grid
                            h-11
                            w-11

                            shrink-0

                            place-items-center

                            rounded-2xl

                            border
                            border-pink-400/30

                            bg-pink-400/10

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

                </div>

                {/* ======================================
                    MONTHLY COUNT
                ====================================== */}

                <div
                    className="
                        mt-3

                        flex
                        items-center
                        justify-between
                        gap-3

                        text-xs
                        font-bold

                        text-slate-500

                        dark:text-gray-500
                    "
                >

                    <span>
                        Bu oy ichidagi userlar
                    </span>

                    <span
                        className="
                            shrink-0

                            rounded-full

                            border
                            border-[#dce5f0]

                            bg-[#f0f5fc]

                            px-2
                            py-1

                            text-[10px]
                            font-black

                            text-cyan-700

                            dark:border-white/10
                            dark:bg-white/[0.035]
                            dark:text-cyan-300
                        "
                    >
                        {totalUsers} ta
                    </span>

                </div>

            </div>

            {/* ==========================================
                BODY
            ========================================== */}

            <div className="p-5">

                {loading ? (

                    <BirthdayLoadingState />

                ) : error ? (

                    <BirthdayErrorState
                        error={error}
                        onRetry={onRetry}
                    />

                ) : safeUsers.length > 0 ? (

                    <div className="space-y-3">

                        {safeUsers.map((user, index) => (

                            <BirthdayUserItem
                                key={
                                    user?.id ??
                                    user?.username ??
                                    index
                                }

                                user={user}
                            />

                        ))}

                    </div>

                ) : (

                    <BirthdayEmptyState />

                )}

            </div>

        </section>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(BirthdayUsersCard);
