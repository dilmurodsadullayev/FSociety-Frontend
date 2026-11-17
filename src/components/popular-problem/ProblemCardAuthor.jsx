
import React from "react";

import { Coins } from "lucide-react";

import { getUserAvatarUrl } from "../../utils/imageUtils";

import PublicFramedAvatar from "../ui/PublicFramedAvatar";

import {
    formatNumber,
    getFullName,
    getLevelConfig,
    getUserCoins,
} from "./problemCardUtils";

// =========================================================
// FSOCIETY — POPULAR PROBLEM CARD AUTHOR
// =========================================================
//
// - Public equipped avatar frame
// - Real user avatar
// - Full name and username
// - Skill level badge
// - FCoin balance
// - Responsive layout
// - Dark / Light mode
//
// Frame fetching, caching and image alignment
// are handled by PublicFramedAvatar.
//
// =========================================================

const ProblemCardAuthor = ({ user }) => {
    const username = user?.username || "unknown";

    const fullName = getFullName(user);

    const avatarUrl = getUserAvatarUrl(user);

    const levelConfig = getLevelConfig(user);

    const coins = getUserCoins(user);

    return (
        <div
            className="
                flex
                min-w-0
                items-center
                justify-between
                gap-2.5
                border-t
                border-[#e5eaf3]
                bg-[#fafcff]
                px-4
                py-2.5
                dark:border-white/[0.06]
                dark:bg-white/[0.015]
            "
        >
            {/* AUTHOR */}

            <div
                className="
                    flex
                    min-w-0
                    flex-1
                    items-center
                    gap-2.5
                "
            >
                {/* ======================================
                    FRAMED USER AVATAR
                ====================================== */}

                <span
                    className="
                        relative
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                    "
                >
                    <PublicFramedAvatar
                        username={user?.username || ""}
                        avatarUrl={avatarUrl}
                        displayName={fullName || username}
                        className="h-9 w-9"
                        plainClassName="rounded-xl"
                        showFrame={Boolean(user?.username)}
                        loading="lazy"
                    />
                </span>

                {/* ======================================
                    USER INFORMATION
                ====================================== */}

                <div className="min-w-0 flex-1">
                    <p
                        className="
                            truncate
                            text-[11px]
                            font-bold
                            leading-4
                            text-slate-800
                            dark:text-gray-200
                        "
                    >
                        {fullName}
                    </p>

                    <div
                        className="
                            mt-1
                            flex
                            min-w-0
                            items-center
                            gap-1.5
                        "
                    >
                        <span
                            className="
                                min-w-0
                                max-w-[95px]
                                truncate
                                font-mono
                                text-[9px]
                                font-semibold
                                text-indigo-700
                                dark:text-indigo-300
                            "
                        >
                            @{username}
                        </span>

                        <span
                            className={`
                                shrink-0
                                rounded-full
                                border
                                px-1.5
                                py-0.5
                                text-[8px]
                                font-bold
                                leading-none
                                ${levelConfig.className}
                            `}
                        >
                            {levelConfig.label}
                        </span>
                    </div>
                </div>
            </div>

            {/* ======================================
                FCOIN
            ====================================== */}

            <div
                title={`${coins} FCoin`}
                className="
                    inline-flex
                    shrink-0
                    items-center
                    gap-1
                    rounded-lg
                    border
                    border-amber-400/20
                    bg-amber-500/[0.06]
                    px-2
                    py-1.5
                    text-amber-800
                    dark:border-yellow-400/10
                    dark:bg-yellow-400/[0.035]
                    dark:text-yellow-200
                "
            >
                <Coins
                    size={12}
                    strokeWidth={2}
                    aria-hidden="true"
                />

                <span
                    className="
                        font-mono
                        text-[10px]
                        font-bold
                    "
                >
                    {formatNumber(coins)}
                </span>
            </div>
        </div>
    );
};

export default React.memo(ProblemCardAuthor);
