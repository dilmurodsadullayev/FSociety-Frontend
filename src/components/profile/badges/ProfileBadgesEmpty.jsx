
import React, { memo } from "react";

import {
    ShieldCheck,
    Sparkles,
} from "lucide-react";

// =========================================================
// FSOCIETY — PROFILE BADGES EMPTY STATE
//
// Features:
//
// - Empty badges information
// - ShieldCheck icon
// - Original title and description
// - "Keep grinding" badge
// - Light / Dark Mode
// - Responsive layout
// - Accessible empty state
//
// No Redux logic or API requests.
// =========================================================

// =========================================================
// CONSTANTS
// =========================================================

const DEFAULT_TITLE =
    "Hali nishonlar mavjud emas";

const DEFAULT_DESCRIPTION =
    "Faol bo‘ling, post yozing, muammolarga yechim " +
    "bering va ilk nishoningizni qo‘lga kiriting.";

// =========================================================
// COMPONENT
// =========================================================

const ProfileBadgesEmpty = ({
    title = DEFAULT_TITLE,
    description = DEFAULT_DESCRIPTION,
    className = "",
}) => {
    return (
        <div
            role="status"
            aria-live="polite"
            className={`
                relative
                z-10

                min-w-0
                overflow-hidden

                rounded-3xl

                border-2
                border-dashed

                border-slate-200
                bg-slate-50/80

                px-4
                py-10

                text-center

                dark:border-gray-700/70
                dark:bg-gray-950/30

                sm:px-5
                sm:py-12

                ${className}
            `}
        >
            {/* =============================================
                BACKGROUND GLOW
            ============================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute

                    left-1/2
                    top-0

                    h-36
                    w-36

                    -translate-x-1/2

                    rounded-full

                    bg-yellow-500/[0.07]

                    blur-3xl

                    dark:bg-yellow-500/10
                "
            />

            {/* =============================================
                CONTENT LAYER
            ============================================== */}

            <div
                className="
                    relative
                    z-10

                    mx-auto
                    flex
                    max-w-lg

                    flex-col
                    items-center
                "
            >
                {/* =========================================
                    EMPTY ICON
                ========================================== */}

                <div
                    className="
                        mx-auto
                        mb-5

                        flex
                        h-20
                        w-20

                        items-center
                        justify-center

                        rounded-full
                        border

                        border-slate-200
                        bg-white/90

                        shadow-lg
                        shadow-slate-900/5

                        dark:border-gray-700
                        dark:bg-gray-900/80
                        dark:shadow-xl
                        dark:shadow-black/30

                        sm:h-24
                        sm:w-24
                    "
                >
                    <ShieldCheck
                        size={48}
                        strokeWidth={1.5}
                        aria-hidden="true"
                        className="
                            text-slate-400
                            dark:text-gray-600

                            sm:h-[52px]
                            sm:w-[52px]
                        "
                    />
                </div>

                {/* =========================================
                    EMPTY TITLE
                ========================================== */}

                <h4
                    className="
                        break-words

                        text-lg
                        font-black
                        tracking-tight

                        text-slate-900
                        dark:text-white

                        sm:text-xl
                    "
                >
                    {title}
                </h4>

                {/* =========================================
                    EMPTY DESCRIPTION
                ========================================== */}

                <p
                    className="
                        mx-auto
                        mt-2

                        max-w-sm

                        text-sm
                        font-semibold
                        leading-6

                        text-slate-500
                        dark:text-gray-500
                    "
                >
                    {description}
                </p>

                {/* =========================================
                    KEEP GRINDING BADGE
                ========================================== */}

                <div
                    className="
                        mt-5

                        inline-flex
                        max-w-full

                        items-center
                        justify-center
                        gap-2

                        rounded-full
                        border

                        border-indigo-200
                        bg-indigo-50

                        px-4
                        py-2

                        text-[11px]
                        font-black

                        uppercase
                        tracking-wider

                        text-indigo-700

                        dark:border-indigo-400/20
                        dark:bg-indigo-500/10
                        dark:text-indigo-300

                        sm:text-xs
                    "
                >
                    <Sparkles
                        size={14}
                        aria-hidden="true"
                        className="shrink-0"
                    />

                    <span>
                        Keep grinding
                    </span>
                </div>
            </div>
        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfileBadgesEmpty);
