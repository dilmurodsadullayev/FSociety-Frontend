
import React from "react";

import {
    CalendarDays,
    GitBranch,
} from "lucide-react";

import {
    motion,
    useReducedMotion,
} from "framer-motion";

import {
    UpdateTypeIcon,
    UpdateTypeBadge,
} from "./UpdateTypeVisuals";

import UpdateLikeButton from "./UpdateLikeButton";

import {
    formatUpdateDate,
} from "./updateCardConfig";

// =========================================================
// FSOCIETY — FEATURED UPDATE CARD
//
// Features:
// - Premium Dark / Light Mode
// - High contrast text
// - Responsive 320px+
// - Compact release layout
// - Update type / version / featured
// - Published date
// - Like / Unlike
// - Reduced motion support
//
// Existing props contract preserved.
// =========================================================

const FeaturedUpdateCard = ({
    update,
    likeLoading = false,
    onLike,
}) => {
    const reduceMotion = useReducedMotion();

    if (!update) {
        return null;
    }

    // =====================================================
    // UPDATE DATA
    // =====================================================

    const title =
        update.title ||
        "Saytdagi yangi o‘zgarish";

    const description =
        update.description ||
        "Bu yangilik haqida batafsil ma’lumot mavjud emas.";

    const releaseLabel = update.is_featured
        ? "Featured release"
        : "Latest release";

    // =====================================================
    // JSX
    // =====================================================

    return (
        <motion.article
            initial={
                reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 8,
                    }
            }

            animate={{
                opacity: 1,
                y: 0,
            }}

            transition={{
                duration: reduceMotion ? 0 : 0.2,
                ease: "easeOut",
            }}

            className="
                group/release
                relative
                min-w-0
                overflow-hidden

                rounded-2xl
                border
                border-[#dce5f1]

                bg-gradient-to-br
                from-white
                via-[#fbfcff]
                to-[#f4f7fd]

                shadow-[0_10px_30px_rgba(15,23,42,0.055)]

                transition-colors
                duration-200

                hover:border-indigo-400/35

                sm:rounded-3xl

                dark:border-white/[0.08]
                dark:from-[#101620]
                dark:via-[#0d131d]
                dark:to-[#111827]

                dark:shadow-[0_14px_36px_rgba(0,0,0,0.15)]

                dark:hover:border-indigo-400/25
            "
        >
            {/* ======================================
                TOP ACCENT LINE
            ====================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-x-0
                    top-0
                    h-[2px]

                    bg-gradient-to-r
                    from-cyan-500
                    via-indigo-500
                    to-fuchsia-500

                    dark:from-cyan-400
                    dark:via-indigo-400
                    dark:to-fuchsia-400
                "
            />

            {/* ======================================
                SUBTLE DECORATIVE BACKGROUND
            ====================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    -right-12
                    -top-12

                    h-36
                    w-36

                    rounded-full
                    bg-indigo-500/[0.035]

                    dark:bg-indigo-400/[0.025]
                "
            />

            {/* ======================================
                CARD CONTENT
            ====================================== */}

            <div
                className="
                    relative
                    z-10

                    min-w-0

                    p-4
                    sm:p-5
                    lg:p-6
                "
            >
                {/* ==================================
                    RELEASE MAIN CONTENT
                ================================== */}

                <div
                    className="
                        flex
                        min-w-0
                        items-start

                        gap-3
                        sm:gap-4
                    "
                >
                    {/* TYPE ICON */}

                    <UpdateTypeIcon
                        update={update}
                        large
                    />

                    {/* INFORMATION */}

                    <div className="min-w-0 flex-1">

                        {/* ==========================
                            RELEASE METADATA
                        ========================== */}

                        <div
                            className="
                                flex
                                min-w-0
                                flex-wrap
                                items-center

                                gap-x-2
                                gap-y-2
                            "
                        >
                            {/* RELEASE LABEL */}

                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-1.5

                                    font-mono
                                    text-[9px]
                                    font-bold
                                    uppercase
                                    tracking-[0.11em]

                                    text-slate-600

                                    dark:text-gray-400
                                "
                            >
                                <GitBranch
                                    size={12}
                                    strokeWidth={2}
                                    aria-hidden="true"
                                    className="
                                        shrink-0
                                        text-indigo-600
                                        dark:text-indigo-400
                                    "
                                />

                                {releaseLabel}
                            </span>

                            {/* VERSION */}

                            {update.version && (
                                <span
                                    className="
                                        inline-flex
                                        max-w-full
                                        items-center

                                        rounded-md
                                        border
                                        border-[#dce4ef]

                                        bg-[#f1f5fb]

                                        px-2
                                        py-1

                                        font-mono
                                        text-[9px]
                                        font-bold

                                        text-slate-600

                                        break-all

                                        dark:border-white/[0.07]
                                        dark:bg-white/[0.035]
                                        dark:text-gray-400
                                    "
                                >
                                    v{String(update.version).replace(/^v/i, "")}
                                </span>
                            )}

                            {/* UPDATE CATEGORY */}

                            <UpdateTypeBadge
                                update={update}
                            />

                            {/* FEATURED */}

                            {update.is_featured && (
                                <span
                                    className="
                                        inline-flex
                                        items-center

                                        rounded-full
                                        border
                                        border-amber-400/25

                                        bg-amber-500/[0.08]

                                        px-2.5
                                        py-1

                                        font-mono
                                        text-[9px]
                                        font-bold
                                        uppercase

                                        text-amber-800

                                        dark:border-amber-400/20
                                        dark:text-amber-300
                                    "
                                >
                                    Featured
                                </span>
                            )}
                        </div>

                        {/* ==========================
                            RELEASE TITLE
                        ========================== */}

                        <h3
                            className="
                                mt-3

                                min-w-0
                                break-words
                                [overflow-wrap:anywhere]

                                text-[17px]
                                font-black
                                leading-[1.35]
                                tracking-[-0.025em]

                                !text-slate-900

                                sm:text-xl

                                dark:!text-white
                            "
                        >
                            {title}
                        </h3>

                        {/* ==========================
                            DESCRIPTION
                        ========================== */}

                        <p
                            className="
                                mt-2

                                max-w-3xl

                                whitespace-pre-line
                                break-words
                                [overflow-wrap:anywhere]

                                text-[12px]
                                font-medium
                                leading-6

                                text-slate-600

                                sm:text-sm

                                dark:text-gray-400
                            "
                        >
                            {description}
                        </p>
                    </div>
                </div>

                {/* ==================================
                    CARD FOOTER
                ================================== */}

                <div
                    className="
                        mt-5

                        flex
                        min-w-0
                        flex-wrap
                        items-center
                        justify-between

                        gap-3

                        border-t
                        border-[#e3e9f2]

                        pt-3

                        dark:border-white/[0.07]
                    "
                >
                    {/* PUBLISHED DATE */}

                    <div
                        className="
                            inline-flex
                            min-w-0
                            items-center
                            gap-2

                            text-[11px]
                            font-medium

                            text-slate-500

                            dark:text-gray-500
                        "
                    >
                        <CalendarDays
                            size={14}
                            strokeWidth={1.9}
                            aria-hidden="true"
                            className="
                                shrink-0

                                text-indigo-600

                                dark:text-indigo-400
                            "
                        />

                        <time
                            dateTime={
                                update.published_at || undefined
                            }
                            className="
                                min-w-0
                                break-words
                            "
                        >
                            {formatUpdateDate(
                                update.published_at
                            )}
                        </time>
                    </div>

                    {/* LIKE */}

                    <div className="ml-auto shrink-0">
                        <UpdateLikeButton
                            update={update}
                            loading={likeLoading}
                            onLike={onLike}
                        />
                    </div>
                </div>
            </div>
        </motion.article>
    );
};

export default React.memo(FeaturedUpdateCard);
