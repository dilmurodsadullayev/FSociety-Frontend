
import React from "react";

import {
    Link,
} from "react-router-dom";

import {
    getUserAvatarUrl,
    handleUserImageError,
} from "../../../utils/imageUtils";

// =========================================================
// HELPERS
// =========================================================

const getFullName = (user) => {
    const fullName =
        user?.full_name ||
        `${user?.first_name || ""} ${user?.last_name || ""}`.trim();

    return (
        fullName ||
        user?.username ||
        "FSociety user"
    );
};

// =========================================================
// BIRTHDAY BADGE COLORS
// =========================================================

const getBirthdayBadgeClass = (daysLeft) => {
    if (daysLeft === 0) {
        return `
            border-pink-400/30
            bg-pink-500/10
            text-pink-700

            dark:text-pink-300
        `;
    }

    if (daysLeft === 1) {
        return `
            border-yellow-400/30
            bg-yellow-500/10
            text-yellow-800

            dark:text-yellow-300
        `;
    }

    if (daysLeft > 1) {
        return `
            border-cyan-400/30
            bg-cyan-500/10
            text-cyan-700

            dark:text-cyan-300
        `;
    }

    return `
        border-slate-300
        bg-slate-100
        text-slate-600

        dark:border-gray-400/20
        dark:bg-white/[0.035]
        dark:text-gray-400
    `;
};

// =========================================================
// FSOCIETY — BIRTHDAY USER ITEM
// =========================================================

const BirthdayUserItem = ({
    user,
}) => {
    if (!user) {
        return null;
    }

    // =====================================================
    // USER DATA
    // =====================================================

    const username = user.username;

    const fullName = getFullName(user);

    const imageSrc = getUserAvatarUrl(user);

    const profileUrl = username
        ? `/${username}/profile`
        : "/users";

    const birthdayLabel =
        user.birthday_label || "Bu oy";

    const userLevel =
        user.skill_level || "Developer";

    const userCoins =
        user.coins ?? 0;

    // =====================================================
    // JSX
    // =====================================================

    return (
        <Link
            to={profileUrl}

            className="
                group/birthday

                block

                rounded-2xl

                border
                border-[#dce5f0]

                bg-[#f8faff]

                p-3

                transition-colors
                duration-150

                hover:border-cyan-400/40
                hover:bg-cyan-500/[0.06]

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-cyan-500

                dark:border-white/10
                dark:bg-white/[0.035]

                dark:hover:border-cyan-400/30
                dark:hover:bg-cyan-400/10
            "
        >

            <div
                className="
                    flex
                    items-center
                    gap-3
                "
            >

                {/* ======================================
                    USER AVATAR
                ====================================== */}

                <img
                    src={imageSrc}

                    alt={
                        username
                            ? `${username} avatar`
                            : "User avatar"
                    }

                    onError={
                        handleUserImageError
                    }

                    loading="lazy"
                    decoding="async"

                    className="
                        h-12
                        w-12

                        shrink-0

                        rounded-2xl

                        border
                        border-cyan-400/20

                        bg-[#e8eef7]

                        object-cover

                        transition-colors
                        duration-150

                        group-hover/birthday:border-cyan-400/50

                        dark:bg-[#161b22]
                    "
                />

                {/* ======================================
                    USER INFORMATION
                ====================================== */}

                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >

                    {/* NAME + BIRTHDAY BADGE */}

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            gap-2
                        "
                    >

                        <h4
                            className="
                                min-w-0
                                truncate

                                text-sm
                                font-black

                                text-slate-900

                                transition-colors
                                duration-150

                                group-hover/birthday:text-cyan-700

                                dark:text-white
                                dark:group-hover/birthday:text-cyan-300
                            "
                        >
                            {fullName}
                        </h4>

                        <span
                            className={`
                                shrink-0

                                rounded-full
                                border

                                px-2
                                py-1

                                text-[10px]
                                font-black

                                ${getBirthdayBadgeClass(
                                    user.days_left
                                )}
                            `}
                        >
                            {birthdayLabel}
                        </span>

                    </div>

                    {/* USERNAME */}

                    <p
                        className="
                            mt-0.5
                            truncate

                            text-xs
                            font-bold

                            text-slate-500

                            dark:text-gray-500
                        "
                    >
                        @{username || "user"}
                    </p>

                    {/* ==================================
                        META
                    ================================== */}

                    <div
                        className="
                            mt-2

                            flex
                            flex-wrap
                            items-center
                            gap-2
                        "
                    >

                        {/* LEVEL */}

                        <span
                            className="
                                rounded-full

                                bg-cyan-500/10

                                px-2
                                py-0.5

                                text-[10px]
                                font-bold

                                text-cyan-700

                                dark:text-cyan-300
                            "
                        >
                            {userLevel}
                        </span>

                        {/* BIRTHDAY DAY */}

                        {user.birthday_day && (

                            <span
                                className="
                                    rounded-full

                                    bg-pink-500/10

                                    px-2
                                    py-0.5

                                    text-[10px]
                                    font-bold

                                    text-pink-700

                                    dark:text-pink-300
                                "
                            >
                                {user.birthday_day}-kun
                            </span>

                        )}

                        {/* FCOIN */}

                        <span
                            className="
                                rounded-full

                                bg-yellow-500/10

                                px-2
                                py-0.5

                                text-[10px]
                                font-bold

                                text-amber-800

                                dark:text-yellow-300
                            "
                        >
                            {userCoins} FCoin
                        </span>

                    </div>

                </div>

            </div>

        </Link>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(BirthdayUserItem);
