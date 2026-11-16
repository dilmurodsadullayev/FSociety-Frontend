
import React, { useState } from "react";

import {
    motion,
    useReducedMotion,
} from "framer-motion";

import {
    Clock3,
    Coins,
    ExternalLink,
    Image as ImageIcon,
    ImageOff,
    Loader2,
    MessageSquareText,
    Pencil,
    ShieldCheck,
    Trash2,
} from "lucide-react";

// =========================================================
// EXISTING UTILITIES
// =========================================================

import formatPrettyDate from "../../utils/formatPrettyDate";
import timeAgo from "../../utils/timeAgo";

// =========================================================
// FEEDBACK CONFIG
// =========================================================

import {
    getFeedbackTypeConfig,
} from "./feedbackConfig";

// =========================================================
// FEEDBACK HELPERS
// =========================================================

import {
    canModifyFeedback,
    getFeedbackRewardAmount,
    getFeedbackScreenshot,
    getFeedbackStatusConfig,
    getFeedbackUsername,
    isFeedbackRewarded,
} from "./feedbackHelpers";

// =========================================================
// FSOCIETY — FEEDBACK CARD
//
// Features:
//
// - Dark / Light Mode
// - Responsive layout
// - Feedback type badge
// - Feedback status badge
// - Actual FCoin reward
// - Relative and full date
// - Screenshot preview
// - Broken screenshot fallback
// - Admin response
// - Author username
// - Edit / Delete actions
// - Loading indicators
// - Backend permission awareness
// - Reduced motion support
// - Winter glass card design
// - Improved readability and contrast
//
// Existing props preserved.
// No direct API calls.
//
// Background is managed globally by App.jsx.
//
// =========================================================


// =========================================================
// TYPE BADGE
// =========================================================

const TypeBadge = React.memo(({ type }) => {
    const config = getFeedbackTypeConfig(type);
    const Icon = config.Icon;

    return (
        <span
            className={`
                inline-flex
                min-h-6
                max-w-full

                items-center
                gap-1.5

                rounded-full
                border

                px-2.5
                py-1

                font-display
                text-[10px]
                font-bold
                leading-4
                uppercase
                tracking-[0.06em]

                ${config.activeClass}
            `}
        >
            <Icon
                size={12}
                strokeWidth={2}
                aria-hidden="true"
                className="shrink-0"
            />

            <span className="break-words">
                {config.label}
            </span>
        </span>
    );
});


// =========================================================
// STATUS BADGE
// =========================================================

const StatusBadge = React.memo(({ status }) => {
    const config = getFeedbackStatusConfig(status);
    const Icon = config.Icon;

    return (
        <span
            className={`
                inline-flex
                min-h-6
                max-w-full

                items-center
                gap-1.5

                rounded-full
                border

                px-2.5
                py-1

                font-display
                text-[10px]
                font-bold
                leading-4
                uppercase
                tracking-[0.06em]

                ${config.className}
            `}
            title={config.description}
        >
            <Icon
                size={12}
                strokeWidth={2}
                aria-hidden="true"
                className="shrink-0"
            />

            <span className="break-words">
                {config.label}
            </span>
        </span>
    );
});


// =========================================================
// REWARD BADGE
//
// Only display an actual reward returned by the API.
// =========================================================

const RewardBadge = React.memo(({ amount }) => {
    return (
        <span
            className="
                inline-flex
                min-h-6
                max-w-full

                items-center
                gap-1.5

                rounded-full
                border
                border-amber-400/40

                bg-amber-500/[0.12]

                px-2.5
                py-1

                font-display
                text-[10px]
                font-bold
                leading-4
                tabular-nums

                text-amber-800

                dark:border-amber-400/25
                dark:bg-amber-400/[0.12]
                dark:text-amber-300
            "
            title="Berilgan FCoin mukofoti"
        >
            <Coins
                size={12}
                strokeWidth={2}
                aria-hidden="true"
                className="shrink-0"
            />

            <span>
                +{amount} FCoin
            </span>
        </span>
    );
});


// =========================================================
// FEEDBACK SCREENSHOT
//
// Handles broken links without showing a broken-image icon.
// =========================================================

const FeedbackScreenshot = React.memo(({
    screenshot,
    title,
}) => {
    const [
        failedScreenshot,
        setFailedScreenshot,
    ] = useState("");

    if (!screenshot) {
        return null;
    }

    const isBroken =
        failedScreenshot === screenshot;

    if (isBroken) {
        return (
            <div
                role="status"

                className="
                    mt-5

                    flex
                    min-w-0

                    items-center
                    gap-3

                    rounded-2xl
                    border
                    border-dashed
                    border-slate-300

                    bg-slate-50/95

                    p-4

                    dark:border-white/[0.12]
                    dark:bg-[#10243a]/95
                "
            >
                <div
                    className="
                        grid
                        h-10
                        w-10
                        shrink-0

                        place-items-center

                        rounded-xl

                        bg-slate-200/90

                        text-slate-500

                        dark:bg-white/[0.08]
                        dark:text-gray-300
                    "
                >
                    <ImageOff
                        size={19}
                        aria-hidden="true"
                    />
                </div>

                <div className="min-w-0">
                    <p
                        className="
                            text-xs
                            font-bold

                            text-slate-800

                            dark:text-gray-100
                        "
                    >
                        Skrinshotni ko‘rsatib bo‘lmadi
                    </p>

                    <p
                        className="
                            mt-1

                            text-[11px]
                            font-medium
                            leading-5

                            text-slate-600

                            dark:text-slate-300
                        "
                    >
                        Rasm o‘chirilgan yoki unga
                        kirish imkoni bo‘lmasligi mumkin.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <a
            href={screenshot}
            target="_blank"
            rel="noopener noreferrer"

            aria-label={`${title} skrinshotini yangi oynada ochish`}

            className="
                group/image

                mt-5

                block
                w-full
                min-w-0

                overflow-hidden

                rounded-2xl
                border
                border-slate-200

                bg-slate-100/95

                transition-colors

                hover:border-indigo-400/50

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500

                dark:border-white/[0.12]
                dark:bg-[#081525]

                dark:hover:border-cyan-400/35
            "
        >
            {/* IMAGE PREVIEW */}

            <div
                className="
                    flex
                    min-h-[110px]
                    max-h-[320px]

                    w-full
                    min-w-0

                    items-center
                    justify-center

                    overflow-hidden

                    bg-slate-100

                    sm:max-h-[380px]

                    dark:bg-[#081525]
                "
            >
                <img
                    src={screenshot}

                    alt={`${title} skrinshoti`}

                    loading="lazy"
                    decoding="async"

                    onError={() => {
                        setFailedScreenshot(screenshot);
                    }}

                    className="
                        block
                        max-h-[320px]
                        max-w-full

                        object-contain

                        transition-transform
                        duration-300

                        group-hover/image:scale-[1.01]

                        sm:max-h-[380px]

                        motion-reduce:transform-none
                    "
                />
            </div>

            {/* IMAGE FOOTER */}

            <div
                className="
                    flex
                    min-w-0

                    items-center
                    justify-between
                    gap-3

                    border-t
                    border-slate-200

                    bg-white/95

                    px-3
                    py-3

                    sm:px-4

                    dark:border-white/[0.10]
                    dark:bg-[#10243a]/95
                "
            >
                <div
                    className="
                        flex
                        min-w-0

                        items-center
                        gap-2
                    "
                >
                    <ImageIcon
                        size={14}
                        aria-hidden="true"

                        className="
                            shrink-0

                            text-indigo-600

                            dark:text-cyan-400
                        "
                    />

                    <span
                        className="
                            min-w-0

                            break-words

                            font-display
                            text-[10px]
                            font-bold

                            text-slate-700

                            transition-colors

                            group-hover/image:text-indigo-700

                            dark:text-slate-300
                            dark:group-hover/image:text-cyan-300
                        "
                    >
                        Skrinshotni to‘liq ko‘rish
                    </span>
                </div>

                <ExternalLink
                    size={14}
                    aria-hidden="true"

                    className="
                        shrink-0

                        text-slate-500

                        dark:text-slate-400
                    "
                />
            </div>
        </a>
    );
});


// =========================================================
// ADMIN RESPONSE
// =========================================================

const FeedbackAdminResponse = React.memo(({
    comment,
}) => {
    if (!comment) {
        return null;
    }

    return (
        <div
            className="
                relative
                isolate

                mt-5

                min-w-0
                overflow-hidden

                rounded-2xl
                border
                border-indigo-200/90

                bg-indigo-50/95

                p-4

                shadow-sm

                dark:border-indigo-400/[0.23]
                dark:bg-[#142441]/95

                dark:shadow-none
            "
        >
            {/* BACKGROUND DECORATION */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    -right-8
                    -top-8

                    h-20
                    w-20

                    rounded-full

                    bg-indigo-500/[0.10]

                    blur-2xl

                    dark:bg-indigo-400/[0.12]
                "
            />

            <div className="relative z-10">
                {/* LABEL */}

                <div
                    className="
                        flex
                        items-center
                        gap-2

                        font-display
                        text-[10px]
                        font-black
                        uppercase
                        tracking-[0.10em]

                        text-indigo-800

                        dark:text-cyan-300
                    "
                >
                    <ShieldCheck
                        size={15}
                        strokeWidth={2}
                        aria-hidden="true"
                    />

                    Admin javobi
                </div>

                {/* MESSAGE */}

                <p
                    className="
                        mt-2

                        min-w-0

                        whitespace-pre-wrap
                        break-words
                        [overflow-wrap:anywhere]

                        text-[12px]
                        font-medium
                        leading-6

                        text-slate-800

                        sm:text-[13px]

                        dark:text-slate-200
                    "
                >
                    {comment}
                </p>
            </div>
        </div>
    );
});


// =========================================================
// MAIN FEEDBACK CARD
// =========================================================

const FeedbackCard = ({
    feedback,

    showStatus = true,

    onEdit,
    onDelete,

    isUpdating = false,
    isDeleting = false,

    actionsDisabled = false,
}) => {

    // =====================================================
    // ACCESSIBILITY
    // =====================================================

    const shouldReduceMotion =
        useReducedMotion();


    // =====================================================
    // DATA GUARD
    // =====================================================

    if (
        !feedback ||
        typeof feedback !== "object"
    ) {
        return null;
    }


    // =====================================================
    // DATA
    // =====================================================

    const screenshot =
        getFeedbackScreenshot(feedback);

    const username =
        getFeedbackUsername(feedback);

    const rewarded =
        isFeedbackRewarded(feedback);

    const rewardAmount =
        getFeedbackRewardAmount(feedback);

    const editable =
        canModifyFeedback(feedback);


    // =====================================================
    // BUSY STATE
    // =====================================================

    const busy = Boolean(
        isUpdating ||
        isDeleting ||
        actionsDisabled
    );

    const canEdit =
        editable &&
        typeof onEdit === "function";

    const canDelete =
        editable &&
        typeof onDelete === "function";

    const hasActions =
        canEdit || canDelete;


    // =====================================================
    // TEXT
    // =====================================================

    const title =
        String(
            feedback.title ?? "Feedback"
        ).trim() || "Feedback";

    const message =
        typeof feedback.message === "string"
            ? feedback.message
            : "";

    const adminComment =
        typeof feedback.admin_comment === "string"
            ? feedback.admin_comment
            : "";


    // =====================================================
    // DATE
    // =====================================================

    const createdAt =
        feedback.created_at || null;

    const relativeDate =
        createdAt
            ? timeAgo(createdAt)
            : "";

    const fullDate =
        createdAt
            ? formatPrettyDate(createdAt)
            : "";


    // =====================================================
    // AUTHOR
    // =====================================================

    const showUsername =
        Boolean(username) &&
        username !== "unknown";


    // =====================================================
    // ANIMATION
    // =====================================================

    const hoverAnimation =
        shouldReduceMotion || busy
            ? undefined
            : { y: -2 };


    // =====================================================
    // HANDLERS
    // =====================================================

    const handleEdit = () => {
        if (
            !canEdit ||
            busy
        ) {
            return;
        }

        onEdit(feedback);
    };

    const handleDelete = () => {
        if (
            !canDelete ||
            busy
        ) {
            return;
        }

        // Confirmation is handled by Feedback.jsx.
        onDelete(feedback);
    };


    // =====================================================
    // JSX
    // =====================================================

    return (
        <motion.article
            layout={!shouldReduceMotion}

            initial={
                shouldReduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 10,
                    }
            }

            animate={{
                opacity: 1,
                y: 0,
            }}

            exit={
                shouldReduceMotion
                    ? undefined
                    : {
                        opacity: 0,
                        y: -8,
                        scale: 0.98,
                    }
            }

            whileHover={hoverAnimation}

            transition={{
                duration: 0.2,
            }}

            aria-busy={
                isUpdating || isDeleting
            }

            className="
                group/feedback

                relative
                isolate

                flex
                h-full
                w-full
                min-w-0

                flex-col

                overflow-hidden

                rounded-[22px]

                border
                border-slate-200/90

                bg-white/[0.97]

                font-sans

                shadow-[0_14px_42px_rgba(15,23,42,0.075)]

                backdrop-blur-xl

                transition-colors
                duration-200

                hover:border-indigo-400/45

                sm:rounded-[24px]

                dark:border-white/[0.12]
                dark:bg-[#0b1b2e]/[0.97]

                dark:shadow-[0_18px_55px_rgba(0,0,0,0.24)]

                dark:hover:border-cyan-400/[0.30]
                dark:hover:bg-[#10243a]/[0.98]
            "
        >

            {/* ======================================
                DECORATIVE GLOW
            ====================================== */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    -right-20
                    -top-20

                    h-44
                    w-44

                    rounded-full

                    bg-indigo-500/[0.05]

                    opacity-0
                    blur-[70px]

                    transition-opacity
                    duration-300

                    group-hover/feedback:opacity-100

                    dark:bg-indigo-400/[0.10]
                "
            />

            {/* ======================================
                TOP ACCENT
            ====================================== */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    inset-x-5
                    top-0
                    z-10

                    h-px

                    bg-gradient-to-r
                    from-transparent
                    via-indigo-500/35
                    to-transparent

                    dark:via-cyan-400/35
                "
            />


            {/* ======================================
                PROCESSING BAR
            ====================================== */}

            {(isUpdating || isDeleting) && (
                <div
                    aria-hidden="true"

                    className="
                        absolute
                        inset-x-0
                        top-0
                        z-20

                        h-[3px]

                        overflow-hidden

                        bg-indigo-100

                        dark:bg-indigo-400/[0.12]
                    "
                >
                    {!shouldReduceMotion ? (
                        <motion.div
                            initial={{
                                x: "-100%",
                            }}

                            animate={{
                                x: "350%",
                            }}

                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                            }}

                            className="
                                h-full
                                w-1/3

                                bg-gradient-to-r
                                from-transparent
                                via-indigo-500
                                to-transparent

                                dark:via-cyan-400
                            "
                        />
                    ) : (
                        <div
                            className="
                                h-full
                                w-full

                                bg-indigo-500/60

                                dark:bg-cyan-400/60
                            "
                        />
                    )}
                </div>
            )}


            {/* ======================================
                CONTENT
            ====================================== */}

            <div
                className="
                    relative
                    z-10

                    flex
                    min-w-0
                    flex-1

                    flex-col

                    p-4

                    sm:p-5
                    lg:p-6
                "
            >

                {/* ==================================
                    HEADER
                ================================== */}

                <div
                    className="
                        flex
                        min-w-0

                        flex-col
                        gap-3

                        sm:flex-row
                        sm:items-start
                        sm:justify-between
                    "
                >

                    {/* ==============================
                        BADGES AND TITLE
                    ============================== */}

                    <div
                        className="
                            min-w-0
                            flex-1
                        "
                    >

                        {/* BADGES */}

                        <div
                            className="
                                flex
                                min-w-0

                                flex-wrap
                                items-center
                                gap-2
                            "
                        >
                            <TypeBadge
                                type={feedback.feedback_type}
                            />

                            {showStatus && (
                                <StatusBadge
                                    status={feedback.status}
                                />
                            )}

                            {rewarded &&
                                rewardAmount > 0 && (
                                    <RewardBadge
                                        amount={rewardAmount}
                                    />
                                )}
                        </div>


                        {/* TITLE */}

                        <h3
                            className="
                                mt-3

                                min-w-0

                                whitespace-normal
                                break-words
                                [overflow-wrap:anywhere]

                                font-display
                                text-base
                                font-black
                                leading-6
                                tracking-tight

                                text-slate-900

                                sm:text-lg
                                sm:leading-7

                                dark:text-white
                            "
                        >
                            {title}
                        </h3>

                    </div>


                    {/* ==============================
                        DATE
                    ============================== */}

                    {createdAt && (
                        <div
                            className="
                                min-w-0

                                shrink-0

                                text-left

                                sm:text-right
                            "
                        >
                            <time
                                dateTime={String(createdAt)}
                                title={fullDate || undefined}

                                className="
                                    inline-flex

                                    items-center
                                    gap-1.5

                                    text-[11px]
                                    font-medium

                                    text-slate-600

                                    dark:text-slate-300
                                "
                            >
                                <Clock3
                                    size={13}
                                    strokeWidth={1.9}
                                    aria-hidden="true"

                                    className="
                                        shrink-0

                                        text-indigo-600

                                        dark:text-cyan-400
                                    "
                                />

                                {relativeDate}
                            </time>

                            {fullDate && (
                                <p
                                    className="
                                        mt-1

                                        text-[10px]
                                        font-medium

                                        text-slate-500

                                        dark:text-slate-400
                                    "
                                >
                                    {fullDate}
                                </p>
                            )}
                        </div>
                    )}

                </div>


                {/* ==================================
                    FEEDBACK MESSAGE
                ================================== */}

                {message && (
                    <p
                        className="
                            mt-4

                            min-w-0

                            whitespace-pre-wrap
                            break-words
                            [overflow-wrap:anywhere]

                            text-[13px]
                            font-medium
                            leading-6

                            text-slate-700

                            sm:text-sm
                            sm:leading-7

                            dark:text-slate-200
                        "
                    >
                        {message}
                    </p>
                )}


                {/* ==================================
                    SCREENSHOT
                ================================== */}

                <FeedbackScreenshot
                    screenshot={screenshot}
                    title={title}
                />


                {/* ==================================
                    ADMIN COMMENT
                ================================== */}

                <FeedbackAdminResponse
                    comment={adminComment}
                />


                {/* ==================================
                    FOOTER
                ================================== */}

                <div
                    className="
                        mt-auto

                        flex
                        min-w-0

                        flex-col
                        gap-3

                        border-t
                        border-slate-200

                        pt-4

                        sm:flex-row
                        sm:items-center
                        sm:justify-between

                        dark:border-white/[0.11]

                        [&:first-child]:border-0
                    "
                    style={{
                        marginTop: "auto",
                    }}
                >

                    {/* ==========================
                        AUTHOR
                    ========================== */}

                    <div
                        className="
                            flex
                            min-w-0

                            items-center
                            gap-2

                            text-[11px]
                            font-medium

                            text-slate-600

                            dark:text-slate-300
                        "
                    >
                        <MessageSquareText
                            size={14}
                            strokeWidth={1.9}
                            aria-hidden="true"

                            className="
                                shrink-0

                                text-indigo-600

                                dark:text-cyan-400
                            "
                        />

                        <span
                            className="
                                min-w-0

                                truncate
                            "
                        >
                            {showUsername
                                ? `@${username}`
                                : "Foydalanuvchi"}
                        </span>
                    </div>


                    {/* ==========================
                        EDIT / DELETE ACTIONS
                    ========================== */}

                    {hasActions && (
                        <div
                            role="group"
                            aria-label="Feedback amallari"

                            className="
                                flex
                                min-w-0

                                flex-wrap
                                items-center
                                gap-2

                                sm:justify-end
                            "
                        >

                            {/* EDIT */}

                            {canEdit && (
                                <button
                                    type="button"

                                    onClick={handleEdit}

                                    disabled={busy}

                                    aria-label={`${title} feedbackini tahrirlash`}

                                    className="
                                        inline-flex
                                        min-h-10

                                        flex-1
                                        items-center
                                        justify-center
                                        gap-2

                                        rounded-xl

                                        border
                                        border-cyan-400/40

                                        bg-cyan-500/[0.09]

                                        px-3
                                        py-2.5

                                        font-display
                                        text-[11px]
                                        font-bold

                                        text-cyan-900

                                        shadow-sm

                                        transition-colors

                                        hover:border-cyan-400/60
                                        hover:bg-cyan-500/[0.15]

                                        focus-visible:outline-none
                                        focus-visible:ring-2
                                        focus-visible:ring-cyan-500

                                        disabled:cursor-not-allowed
                                        disabled:opacity-40

                                        sm:flex-none

                                        dark:border-cyan-400/25
                                        dark:bg-cyan-400/[0.09]
                                        dark:text-cyan-300

                                        dark:shadow-none

                                        dark:hover:border-cyan-400/40
                                        dark:hover:bg-cyan-400/[0.14]
                                    "
                                >
                                    {isUpdating ? (
                                        <Loader2
                                            size={14}
                                            aria-hidden="true"

                                            className="
                                                animate-spin
                                                motion-reduce:animate-none
                                            "
                                        />
                                    ) : (
                                        <Pencil
                                            size={14}
                                            aria-hidden="true"
                                        />
                                    )}

                                    Tahrirlash
                                </button>
                            )}


                            {/* DELETE */}

                            {canDelete && (
                                <button
                                    type="button"

                                    onClick={handleDelete}

                                    disabled={busy}

                                    aria-label={`${title} feedbackini o‘chirish`}

                                    className="
                                        inline-flex
                                        min-h-10

                                        flex-1
                                        items-center
                                        justify-center
                                        gap-2

                                        rounded-xl

                                        border
                                        border-red-400/40

                                        bg-red-500/[0.08]

                                        px-3
                                        py-2.5

                                        font-display
                                        text-[11px]
                                        font-bold

                                        text-red-800

                                        shadow-sm

                                        transition-colors

                                        hover:border-red-400/60
                                        hover:bg-red-500/[0.13]

                                        focus-visible:outline-none
                                        focus-visible:ring-2
                                        focus-visible:ring-red-500

                                        disabled:cursor-not-allowed
                                        disabled:opacity-40

                                        sm:flex-none

                                        dark:border-red-400/25
                                        dark:bg-red-400/[0.08]
                                        dark:text-red-300

                                        dark:shadow-none

                                        dark:hover:border-red-400/40
                                        dark:hover:bg-red-400/[0.13]
                                    "
                                >
                                    {isDeleting ? (
                                        <Loader2
                                            size={14}
                                            aria-hidden="true"

                                            className="
                                                animate-spin
                                                motion-reduce:animate-none
                                            "
                                        />
                                    ) : (
                                        <Trash2
                                            size={14}
                                            aria-hidden="true"
                                        />
                                    )}

                                    O‘chirish
                                </button>
                            )}

                        </div>
                    )}

                </div>

            </div>

        </motion.article>
    );
};


// =========================================================
// EXPORT
// =========================================================

export default React.memo(FeedbackCard);
