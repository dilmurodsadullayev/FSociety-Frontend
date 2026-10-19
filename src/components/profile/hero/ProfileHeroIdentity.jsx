// src/components/profile/hero/ProfileHeroIdentity.jsx

import React, { memo, useState } from "react";

import {
    Briefcase,
    MapPin,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

import UserImage from "../../../assests/userImage.jpeg";

import {
    getSkillBadgeClass,
} from "../profileHelpers";

// =========================================================
// GET USER INITIALS
// =========================================================

const getInitials = (name) => {
    const parts = String(name || "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (!parts.length) {
        return "FS";
    }

    return parts
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");
};

// =========================================================
// PROFILE AVATAR
//
// Fallback:
// 1. User uploaded image
// 2. Default image
// 3. User initials
//
// Position:
// - Mobile: -56px
// - Desktop: -64px
// =========================================================

const ProfileAvatar = memo(function ProfileAvatar({
    image,
    fullName,
}) {
    const [primaryFailed, setPrimaryFailed] =
        useState(false);

    const [fallbackFailed, setFallbackFailed] =
        useState(false);

    // =====================================================
    // IMAGE SOURCE
    // =====================================================

    const primarySource =
        typeof image === "string" && image.trim()
            ? image.trim()
            : UserImage;

    const imageSource = primaryFailed
        ? UserImage
        : primarySource;

    const showImage = !fallbackFailed;

    // =====================================================
    // IMAGE ERROR
    // =====================================================

    const handleImageError = () => {
        if (imageSource === UserImage) {
            setFallbackFailed(true);
        } else {
            setPrimaryFailed(true);
        }
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div
            className="
                relative z-20
                -mt-14 shrink-0
                sm:-mt-16
            "
        >
            {/* AVATAR GLOW */}

            <span
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute inset-1

                    rounded-full
                    bg-indigo-400/25
                    blur-xl
                "
            />

            {/* AVATAR IMAGE */}

            {showImage ? (
                <img
                    src={imageSource}
                    alt={`${
                        fullName || "Foydalanuvchi"
                    } profil rasmi`}
                    onError={handleImageError}
                    decoding="async"
                    className="
                        relative
                        h-24 w-24

                        rounded-full
                        border-4 border-white

                        bg-slate-100
                        object-cover
                        shadow-xl

                        dark:border-[#0d1117]
                        dark:bg-slate-800

                        sm:h-32 sm:w-32
                    "
                />
            ) : (
                <div
                    role="img"
                    aria-label={`${
                        fullName || "Foydalanuvchi"
                    } profil rasmi`}
                    className="
                        relative flex
                        h-24 w-24

                        items-center
                        justify-center

                        rounded-full
                        border-4 border-white

                        bg-gradient-to-br
                        from-indigo-500
                        to-violet-600

                        text-2xl font-black
                        text-white
                        shadow-xl

                        dark:border-[#0d1117]

                        sm:h-32 sm:w-32
                        sm:text-3xl
                    "
                >
                    {getInitials(fullName)}
                </div>
            )}

            {/* FSOCIETY MEMBERSHIP BADGE */}

            <span
                title="FSociety a’zosi"
                aria-label="FSociety a’zosi"
                className="
                    absolute
                    bottom-1 right-0

                    flex h-7 w-7
                    items-center
                    justify-center

                    rounded-full
                    border-2 border-white

                    bg-indigo-600
                    text-white

                    dark:border-[#0d1117]
                    dark:bg-indigo-500
                "
            >
                <ShieldCheck
                    size={15}
                    aria-hidden="true"
                />
            </span>
        </div>
    );
});

// =========================================================
// PROFILE HERO IDENTITY
//
// - Avatar
// - Full Name
// - Username
// - Skill Level
// - Position
// - Company
// - Location
//
// Layout:
// Avatar and text are raised by approximately 8px
// compared with the previous version.
// =========================================================

const ProfileHeroIdentity = ({
    currentUser,
}) => {
    const user = currentUser || {};

    const displayName =
        user.fullName ||
        user.username ||
        "Foydalanuvchi";

    return (
        <div
            className="
                flex min-w-0 flex-1
                items-start gap-3
                sm:gap-5
            "
        >
            {/* =====================================
                AVATAR
            ====================================== */}

            <ProfileAvatar
                key={`${
                    user.username || "guest"
                }:${
                    user.profileImage || "default"
                }`}
                image={user.profileImage}
                fullName={displayName}
            />

            {/* =====================================
                USER INFORMATION

                Previous:
                pt-3 sm:pt-4

                Now:
                pt-1 sm:pt-2
            ====================================== */}

            <div
                className="
                    relative z-10
                    min-w-0 flex-1

                    pt-1
                    sm:pt-2
                "
            >
                {/* NAME + SKILL LEVEL */}

                <div
                    className="
                        flex min-w-0
                        flex-wrap items-center
                        gap-2
                    "
                >
                    <h1
                        className="
                            max-w-full
                            break-words

                            text-xl
                            font-black
                            tracking-tight

                            text-slate-900
                            dark:text-white

                            sm:text-3xl
                            md:text-4xl
                        "
                    >
                        {displayName}
                    </h1>

                    {/* SKILL LEVEL */}

                    {user.skillLevel && (
                        <span
                            className={`
                                inline-flex
                                max-w-full

                                items-center
                                gap-1.5

                                rounded-full
                                border

                                px-2.5 py-1

                                font-mono
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.06em]

                                ${getSkillBadgeClass(
                                    user.rawSkillLevel
                                )}

                                !text-slate-800
                                dark:!text-slate-100
                            `}
                        >
                            <Sparkles
                                size={13}
                                className="shrink-0"
                                aria-hidden="true"
                            />

                            <span
                                className="
                                    min-w-0 truncate
                                "
                            >
                                {user.skillLevel}
                            </span>
                        </span>
                    )}
                </div>

                {/* USERNAME */}

                {user.username && (
                    <p
                        title={`@${user.username}`}
                        className="
                            mt-1 truncate

                            font-mono
                            text-xs

                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        @{user.username}
                    </p>
                )}

                {/* =====================================
                    PROFESSIONAL INFORMATION
                ====================================== */}

                <div
                    className="
                        mt-2 flex min-w-0
                        flex-wrap items-center

                        gap-x-3 gap-y-1.5

                        text-xs font-medium

                        text-slate-600
                        dark:text-slate-400

                        sm:mt-3 sm:text-sm
                    "
                >
                    {/* POSITION */}

                    <span
                        className="
                            inline-flex min-w-0
                            max-w-full
                            items-start gap-1.5
                        "
                    >
                        <Briefcase
                            size={14}
                            className="
                                mt-0.5 shrink-0

                                text-indigo-500
                                dark:text-indigo-300
                            "
                            aria-hidden="true"
                        />

                        <span
                            className="
                                min-w-0 break-words
                            "
                        >
                            {user.position ||
                                "Lavozim kiritilmagan"}
                        </span>
                    </span>

                    {/* COMPANY */}

                    <span
                        className="
                            inline-flex min-w-0
                            max-w-full
                            items-start gap-1.5
                        "
                    >
                        <ShieldCheck
                            size={14}
                            className="
                                mt-0.5 shrink-0

                                text-emerald-600
                                dark:text-emerald-300
                            "
                            aria-hidden="true"
                        />

                        <span
                            className="
                                min-w-0 break-words
                            "
                        >
                            {user.company ||
                                "Kompaniya kiritilmagan"}
                        </span>
                    </span>

                    {/* LOCATION */}

                    <span
                        className="
                            inline-flex min-w-0
                            max-w-full
                            items-start gap-1.5
                        "
                    >
                        <MapPin
                            size={14}
                            className="
                                mt-0.5 shrink-0

                                text-pink-600
                                dark:text-pink-300
                            "
                            aria-hidden="true"
                        />

                        <span
                            className="
                                min-w-0 break-words
                            "
                        >
                            {user.location ||
                                "Manzil kiritilmagan"}
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default memo(ProfileHeroIdentity);