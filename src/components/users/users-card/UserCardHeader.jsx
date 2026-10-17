import React, {
    memo,
    useEffect,
    useState,
} from "react";

import { UserRound } from "lucide-react";

import {
    getDefaultUserAvatar,
    getUserAvatarUrl,
    getUserDisplayName,
    getUserSkillLevel,
    isUserOnline,
} from "./userCardHelpers";

const UserCardHeader = ({ user }) => {
    const username = getUserDisplayName(user);
    const skillLevel = getUserSkillLevel(user);
    const online = isUserOnline(user);

    const avatarUrl = getUserAvatarUrl(user?.image);

    const [avatar, setAvatar] = useState(avatarUrl);

    useEffect(() => {
        setAvatar(avatarUrl);
    }, [avatarUrl]);

    return (
        <div className="flex min-w-0 items-center gap-3.5">
            <div className="relative shrink-0">
                <div
                    aria-hidden="true"
                    className="
                        absolute -inset-1 rounded-[20px]
                        bg-indigo-400/10 blur-lg
                        dark:bg-cyan-400/10
                    "
                />

                <img
                    src={avatar}
                    alt={`${username} profili`}
                    loading="lazy"
                    decoding="async"
                    onError={() =>
                        setAvatar(getDefaultUserAvatar())
                    }
                    className="
                        relative h-16 w-16 rounded-2xl
                        border border-slate-200 bg-slate-100
                        object-cover
                        dark:border-white/[0.12]
                        dark:bg-[#0a1020]
                    "
                />

                {online && (
                    <span
                        title="Online"
                        aria-label="Foydalanuvchi online"
                        className="
                            absolute -bottom-1 -right-1
                            h-4 w-4 rounded-full
                            border-[3px] border-white
                            bg-emerald-500
                            dark:border-[#0e1421]
                        "
                    />
                )}
            </div>

            <div className="min-w-0 flex-1">
                <h3
                    title={`@${username}`}
                    className="
                        truncate text-base font-black
                        text-slate-900 sm:text-lg
                        dark:text-white
                    "
                >
                    @{username}
                </h3>

                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span
                        className="
                            max-w-full truncate rounded-full
                            border border-indigo-200 bg-indigo-50
                            px-2.5 py-1 text-[10px] font-black
                            uppercase text-indigo-700
                            dark:border-indigo-400/20
                            dark:bg-indigo-400/[0.08]
                            dark:text-indigo-300
                        "
                    >
                        {skillLevel}
                    </span>

                    <span
                        className="
                            inline-flex items-center gap-1
                            rounded-full border border-slate-200
                            bg-slate-50 px-2.5 py-1
                            text-[10px] font-bold text-slate-500
                            dark:border-white/10 dark:bg-white/[0.04]
                            dark:text-slate-400
                        "
                    >
                        <UserRound size={12} aria-hidden="true" />
                        Member
                    </span>
                </div>
            </div>
        </div>
    );
};

export default memo(UserCardHeader);