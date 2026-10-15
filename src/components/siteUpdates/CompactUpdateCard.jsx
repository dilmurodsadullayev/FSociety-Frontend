
import React, {
    useId,
} from "react";

import {
    AnimatePresence,
    motion,
    useReducedMotion,
} from "framer-motion";

import {
    CalendarDays,
    ChevronDown,
} from "lucide-react";

// =========================================================
// COMPONENTS
// =========================================================

import {
    UpdateTypeIcon,
    UpdateTypeBadge,
} from "./UpdateTypeVisuals";

import UpdateLikeButton from "./UpdateLikeButton";

// =========================================================
// UTILS
// =========================================================

import {
    formatUpdateDate,
    getUpdateTypeConfig,
} from "./updateCardConfig";

// =========================================================
// FSOCIETY — COMPACT UPDATE CARD
//
// Features:
//
// - Dark / Light Mode
// - Responsive mobile layout
// - Accessible accordion
// - Like / Unlike
// - Loading state
// - Update type / version / date
// - Reduced-motion support
//
// Existing props contract preserved.
// =========================================================

const CompactUpdateCard = ({
    update,
    opened = false,
    onToggle,
    likeLoading = false,
    onLike,
}) => {
    // =====================================================
    // HOOKS
    // =====================================================

    const contentId = useId();

    const reducedMotion = useReducedMotion();

    // =====================================================
    // CONFIG
    // =====================================================

    const config = getUpdateTypeConfig(update);

    // =====================================================
    // CONTENT
    // =====================================================

    const title =
        update?.title ||
        "Sayt yangiligi";

    const description =
        update?.description ||
        "Bu yangilik haqida batafsil ma’lumot mavjud emas.";

    // =====================================================
    // DATE
    // =====================================================

    const publishedDate = formatUpdateDate(
        update?.published_at
    );

    // =====================================================
    // JSX
    // =====================================================

    return (
        <article
            className="
                group/item

                relative
                min-w-0
                overflow-hidden

                border-b
                border-[#e5eaf3]

                last:border-b-0

                dark:border-white/[0.05]
            "
        >
            {/* ======================================
                COMPACT HEADER
            ====================================== */}

            <div
                className="
                    flex
                    min-w-0
                    items-center

                    gap-2

                    px-3
                    py-3

                    transition-colors
                    duration-150

                    hover:bg-indigo-500/[0.035]

                    sm:gap-3
                    sm:px-5

                    dark:hover:bg-white/[0.025]
                "
            >
                {/* ==================================
                    ACCORDION TRIGGER
                ================================== */}

                <button
                    type="button"

                    onClick={onToggle}

                    aria-expanded={Boolean(opened)}

                    aria-controls={contentId}

                    aria-label={
                        opened
                            ? `${title} — yopish`
                            : `${title} — ochish`
                    }

                    className="
                        flex
                        min-w-0
                        flex-1
                        items-center

                        gap-2.5

                        rounded-xl

                        text-left

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-indigo-500

                        sm:gap-3
                    "
                >
                    {/* TYPE ICON */}

                    <UpdateTypeIcon
                        update={update}
                    />

                    {/* ==================================
                        UPDATE INFORMATION
                    ================================== */}

                    <div
                        className="
                            min-w-0
                            flex-1
                        "
                    >
                        {/* VERSION + TYPE */}

                        <div
                            className="
                                flex
                                min-w-0
                                flex-wrap
                                items-center

                                gap-x-2
                                gap-y-1
                            "
                        >
                            {update?.version && (
                                <span
                                    className="
                                        max-w-full

                                        break-all

                                        font-mono
                                        text-[9px]
                                        font-bold
                                        uppercase
                                        tracking-wide

                                        text-slate-500

                                        dark:text-gray-600
                                    "
                                >
                                    {update.version}
                                </span>
                            )}

                            <span
                                className={`
                                    font-mono
                                    text-[9px]
                                    font-black
                                    uppercase
                                    tracking-wide

                                    ${config.shortLabelClass}
                                `}
                            >
                                {config.shortLabel}
                            </span>
                        </div>

                        {/* ==================================
                            UPDATE TITLE
                        ================================== */}

                        <h4
                            className={`
                                mt-1

                                min-w-0

                                line-clamp-2

                                break-words
                                [overflow-wrap:anywhere]

                                text-[12px]
                                font-bold
                                leading-5

                                text-slate-800

                                transition-colors
                                duration-150

                                sm:text-sm

                                dark:text-gray-300

                                ${config.titleHoverClass}
                            `}
                        >
                            {title}
                        </h4>
                    </div>

                    {/* ==================================
                        PUBLISHED DATE — DESKTOP
                    ================================== */}

                    <span
                        className="
                            hidden
                            shrink-0

                            text-[10px]
                            font-medium

                            text-slate-500

                            lg:block

                            dark:text-gray-600
                        "
                    >
                        {publishedDate}
                    </span>

                    {/* ==================================
                        CHEVRON
                    ================================== */}

                    <ChevronDown
                        size={16}
                        strokeWidth={2}

                        aria-hidden="true"

                        className={`
                            shrink-0

                            text-slate-500

                            transition-transform
                            duration-200

                            dark:text-gray-500

                            ${
                                opened
                                    ? `
                                        rotate-180

                                        text-indigo-600

                                        dark:text-indigo-300
                                    `
                                    : ""
                            }

                            motion-reduce:transition-none
                        `}
                    />
                </button>

                {/* ==================================
                    LIKE BUTTON
                ================================== */}

                <UpdateLikeButton
                    update={update}
                    loading={likeLoading}
                    onLike={onLike}
                />
            </div>

            {/* ======================================
                ACCORDION CONTENT
            ====================================== */}

            <AnimatePresence initial={false}>
                {opened && (
                    <motion.div
                        id={contentId}

                        initial={{
                            height: 0,
                            opacity: 0,
                        }}

                        animate={{
                            height: "auto",
                            opacity: 1,
                        }}

                        exit={{
                            height: 0,
                            opacity: 0,
                        }}

                        transition={{
                            duration: reducedMotion
                                ? 0
                                : 0.22,

                            ease: "easeOut",
                        }}

                        className="
                            overflow-hidden
                        "
                    >
                        {/* ==================================
                            EXPANDED CONTENT
                        ================================== */}

                        <div
                            className="
                                mx-3
                                mb-4

                                min-w-0

                                border-l-2
                                border-indigo-400/25

                                pl-4

                                sm:ml-[68px]
                                sm:mr-5

                                dark:border-indigo-400/15
                            "
                        >
                            {/* ==================================
                                DESCRIPTION
                            ================================== */}

                            <p
                                className="
                                    max-w-3xl

                                    break-words
                                    whitespace-pre-line
                                    [overflow-wrap:anywhere]

                                    text-[12px]
                                    leading-6

                                    text-slate-600

                                    sm:text-sm

                                    dark:text-gray-400
                                "
                            >
                                {description}
                            </p>

                            {/* ==================================
                                META INFORMATION
                            ================================== */}

                            <div
                                className="
                                    mt-4

                                    flex
                                    min-w-0
                                    flex-wrap
                                    items-center

                                    gap-x-3
                                    gap-y-2
                                "
                            >
                                {/* TYPE BADGE */}

                                <UpdateTypeBadge
                                    update={update}
                                />

                                {/* PUBLISHED DATE */}

                                <span
                                    className="
                                        inline-flex
                                        min-w-0
                                        items-center

                                        gap-1.5

                                        text-[10px]
                                        font-medium

                                        text-slate-500

                                        dark:text-gray-600
                                    "
                                >
                                    <CalendarDays
                                        size={13}
                                        strokeWidth={1.8}

                                        aria-hidden="true"

                                        className="shrink-0"
                                    />

                                    <time
                                        dateTime={
                                            update?.published_at ||
                                            undefined
                                        }
                                    >
                                        {publishedDate}
                                    </time>
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </article>
    );
};

export default React.memo(CompactUpdateCard);
