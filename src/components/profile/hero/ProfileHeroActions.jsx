// src/components/profile/hero/ProfileHeroActions.jsx

import React, { memo } from "react";

import {
    Bot,
    CheckCircle2,
    Image as ImageIcon,
    Loader2,
    Pencil,
} from "lucide-react";

// =========================================================
// SHARED BUTTON STYLES
// =========================================================

const BUTTON_BASE = `
    inline-flex min-h-10 min-w-0
    items-center justify-center gap-2

    rounded-xl border
    px-3 py-2.5

    text-xs font-bold
    shadow-sm

    transition-colors

    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-indigo-500/60

    disabled:cursor-not-allowed
    disabled:opacity-50

    sm:px-4
    sm:text-sm
`;

const BUTTON_TONES = {
    neutral: `
        border-slate-200
        bg-white/90
        text-slate-700

        hover:bg-slate-100

        dark:border-white/15
        dark:bg-white/[0.07]
        dark:text-slate-100

        dark:hover:bg-white/[0.12]
    `,

    pink: `
        border-pink-500/30
        bg-pink-600
        text-white

        hover:bg-pink-500

        dark:border-pink-500/40
    `,

    linked: `
        border-emerald-300
        bg-emerald-50
        text-emerald-800

        hover:bg-emerald-100

        dark:border-emerald-400/25
        dark:bg-emerald-500/10
        dark:text-emerald-300

        dark:hover:bg-emerald-500/15
    `,
};

// =========================================================
// REUSABLE ACTION BUTTON
// =========================================================

const ActionButton = memo(function ActionButton({
    children,
    onClick,
    disabled = false,
    tone = "neutral",
    label,
    className = "",
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={
                disabled ||
                typeof onClick !== "function"
            }
            aria-label={label}
            className={`
                ${BUTTON_BASE}

                ${
                    BUTTON_TONES[tone] ||
                    BUTTON_TONES.neutral
                }

                ${className}
            `}
        >
            {children}
        </button>
    );
});

// =========================================================
// PROFILE HERO ACTIONS
//
// Responsibilities:
//
// - Telegram bot connection
// - Telegram connected state
// - Telegram loading state
// - Cover image editing
// - Profile editing
// - Owner permissions
// - Desktop / Mobile layout
// - Light / Dark Mode
//
// Original callbacks preserved:
//
// onConnectTelegram
// onEditCover
// onEditProfile
// =========================================================

const ProfileHeroActions = ({
    isOwner = false,

    botLoading = false,
    isTelegramLinked = false,

    onConnectTelegram,
    onEditCover,
    onEditProfile,

    variant = "desktop",
}) => {
    // =====================================================
    // OWNER PERMISSION
    // =====================================================

    if (!isOwner) {
        return null;
    }

    // =====================================================
    // RESPONSIVE VARIANT
    // =====================================================

    const isMobile = variant === "mobile";

    // =====================================================
    // TELEGRAM STATUS
    // =====================================================

    const telegramTone = isTelegramLinked
        ? "linked"
        : "neutral";

    const BotIcon = botLoading
        ? Loader2
        : isTelegramLinked
            ? CheckCircle2
            : Bot;

    const telegramLabel = isTelegramLinked
        ? "Telegram bot ulangan"
        : "Telegram botni ulash";

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div
            role="group"
            aria-label="Profilni boshqarish"
            className={
                isMobile
                    ? `
                        mt-4 grid min-w-0
                        grid-cols-3 gap-2
                        xl:hidden
                    `
                    : `
                        hidden shrink-0
                        flex-wrap items-center
                        justify-end gap-2

                        xl:mt-4
                        xl:flex
                    `
            }
        >
            {/* =====================================
                TELEGRAM BOT BUTTON
            ====================================== */}

            <ActionButton
                tone={telegramTone}
                onClick={onConnectTelegram}
                disabled={botLoading}
                label={telegramLabel}
                className={
                    isMobile
                        ? "w-full px-1.5 sm:px-3"
                        : ""
                }
            >
                <BotIcon
                    size={isMobile ? 16 : 17}
                    aria-hidden="true"
                    className={`
                        shrink-0

                        ${
                            botLoading
                                ? "animate-spin motion-reduce:animate-none"
                                : ""
                        }
                    `}
                />

                <span
                    className={
                        isMobile
                            ? "min-w-0 truncate"
                            : "whitespace-nowrap"
                    }
                >
                    {botLoading
                        ? (
                            isMobile
                                ? "Kutilmoqda"
                                : "Tekshirilmoqda"
                        )
                        : isTelegramLinked
                            ? (
                                isMobile
                                    ? "Ulangan"
                                    : "Bot ulangan"
                            )
                            : "Botni ulash"}
                </span>
            </ActionButton>

            {/* =====================================
                COVER IMAGE EDIT BUTTON
            ====================================== */}

            <ActionButton
                onClick={onEditCover}
                label="Fon rasmini tahrirlash"
                className={
                    isMobile
                        ? "w-full px-1.5 sm:px-3"
                        : ""
                }
            >
                <ImageIcon
                    size={isMobile ? 16 : 17}
                    className="shrink-0"
                    aria-hidden="true"
                />

                <span
                    className={
                        isMobile
                            ? "min-w-0 truncate"
                            : "whitespace-nowrap"
                    }
                >
                    Fon rasmi
                </span>
            </ActionButton>

            {/* =====================================
                PROFILE EDIT BUTTON
            ====================================== */}

            <ActionButton
                tone="pink"
                onClick={onEditProfile}
                label="Profilni tahrirlash"
                className={
                    isMobile
                        ? "w-full px-1.5 sm:px-3"
                        : ""
                }
            >
                <Pencil
                    size={isMobile ? 16 : 17}
                    className="shrink-0"
                    aria-hidden="true"
                />

                <span
                    className={
                        isMobile
                            ? "min-w-0 truncate"
                            : "whitespace-nowrap"
                    }
                >
                    Tahrirlash
                </span>
            </ActionButton>
        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfileHeroActions);