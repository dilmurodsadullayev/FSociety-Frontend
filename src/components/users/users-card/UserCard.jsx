import React, { memo } from "react";

import { Link } from "react-router-dom";

import {
    ArrowUpRight,
    UserRound,
} from "lucide-react";

import {
    getUserDisplayName,
    getUserProfileUrl,
} from "./userCardHelpers";

import UserCardSkeleton from "./UserCardSkeleton";
import UserCardHeader from "./UserCardHeader";
import UserCardStats from "./UserCardStats";
import UserCardSkills from "./UserCardSkills";

const CARD_CLASS = `
    group relative flex h-full min-w-0 flex-col
    overflow-hidden rounded-[24px]
    border border-slate-200 bg-white
    p-4 sm:p-5
    shadow-[0_12px_36px_rgba(15,23,42,0.045)]
    transition-all duration-300
    hover:-translate-y-1 hover:border-indigo-300
    hover:shadow-[0_20px_45px_rgba(79,70,229,0.12)]
    dark:border-white/[0.09]
    dark:bg-[#0e1421]
    dark:shadow-[0_16px_45px_rgba(0,0,0,0.18)]
    dark:hover:border-indigo-400/30
    motion-reduce:transform-none
    motion-reduce:transition-none
`;

const UserCard = ({
    user,
    isLoading = false,
    index = 0,
}) => {
    if (isLoading) {
        return <UserCardSkeleton />;
    }

    if (!user || typeof user !== "object") {
        return null;
    }

    const username = getUserDisplayName(user);
    const profileUrl = getUserProfileUrl(user);

    const position = Number.isFinite(Number(index))
        ? Math.max(0, Math.floor(Number(index))) + 1
        : 1;

    return (
        <article className={CARD_CLASS}>
            <div
                aria-hidden="true"
                className="
                    pointer-events-none absolute -right-20
                    -top-20 h-44 w-44 rounded-full
                    bg-indigo-500/[0.055] blur-[60px]
                    dark:bg-cyan-400/[0.045]
                "
            />

            <div className="relative flex h-full flex-col">
                {/* TOP LABEL */}
                <div className="mb-5 flex items-center justify-between gap-3">
                    <span
                        className="
                            font-mono text-[10px] font-black
                            uppercase tracking-wider
                            text-slate-500 dark:text-slate-400
                        "
                    >
                        fsociety::user
                    </span>

                    <span
                        className="
                            rounded-full border border-indigo-200
                            bg-indigo-50 px-3 py-1
                            font-mono text-[10px] font-black
                            text-indigo-700
                            dark:border-indigo-400/20
                            dark:bg-indigo-400/[0.08]
                            dark:text-indigo-300
                        "
                    >
                        #{String(position).padStart(2, "0")}
                    </span>
                </div>

                <UserCardHeader user={user} />

                <UserCardStats user={user} />

                <UserCardSkills user={user} />

                {/* PROFILE ACTION */}
                <div className="mt-5 border-t border-slate-200 pt-4 dark:border-white/[0.09]">
                    {profileUrl ? (
                        <Link
                            to={profileUrl}
                            aria-label={`${username} profilini ko‘rish`}
                            className="
                                flex min-h-11 w-full items-center
                                justify-center gap-2 rounded-xl
                                bg-gradient-to-r from-cyan-600
                                to-indigo-600 px-4 py-3
                                text-xs font-black text-white
                                shadow-md shadow-indigo-500/15
                                transition-all hover:from-cyan-500
                                hover:to-indigo-500
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-indigo-500
                                focus-visible:ring-offset-2
                                dark:focus-visible:ring-offset-[#0e1421]
                            "
                        >
                            Profilni ko‘rish

                            <ArrowUpRight
                                size={17}
                                aria-hidden="true"
                            />
                        </Link>
                    ) : (
                        <div
                            className="
                                flex min-h-11 items-center
                                justify-center gap-2 rounded-xl
                                bg-slate-100 px-4 py-3
                                text-xs font-bold text-slate-500
                                dark:bg-white/[0.055]
                                dark:text-slate-400
                            "
                        >
                            <UserRound size={15} aria-hidden="true" />
                            Profil mavjud emas
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
};

export default memo(UserCard);