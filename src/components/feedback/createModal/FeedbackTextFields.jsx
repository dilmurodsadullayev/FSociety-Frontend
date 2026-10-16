
import React, { useId } from "react";

import {
    AlignLeft,
    Type,
} from "lucide-react";

import {
    FEEDBACK_MESSAGE_MIN_LENGTH,
    FEEDBACK_TITLE_MAX_LENGTH,
    FEEDBACK_TITLE_MIN_LENGTH,
} from "../feedbackConfig";

// =========================================================
// FSOCIETY — FEEDBACK TEXT FIELDS
//
// Reusable in:
// - FeedbackCreateModal
// - FeedbackEditModal
//
// Features:
// - Controlled inputs
// - Dark / Light Mode
// - Mobile-first responsive design
// - Title character counter
// - Message minimum-length indicator
// - Accessible labels
// - Optional field errors
// - Disabled state
//
// No API requests.
// No Redux.
// =========================================================

// =========================================================
// SHARED STYLES
// =========================================================

const INPUT_CLASS = `
    block
    w-full
    min-w-0

    rounded-2xl
    border
    border-slate-300

    bg-white

    px-4
    py-3.5

    font-sans
    text-sm
    font-medium
    leading-6

    text-slate-900

    outline-none
    transition-colors
    duration-150

    placeholder:text-slate-400

    hover:border-slate-400

    focus:border-indigo-400
    focus:ring-4
    focus:ring-indigo-500/[0.08]

    disabled:cursor-not-allowed
    disabled:opacity-50

    dark:border-white/[0.10]
    dark:bg-white/[0.035]
    dark:text-white

    dark:placeholder:text-gray-500

    dark:hover:border-white/[0.18]

    dark:focus:border-indigo-400/40
    dark:focus:ring-indigo-400/[0.08]
`;

const ERROR_INPUT_CLASS = `
    border-red-400

    focus:border-red-500
    focus:ring-red-500/[0.08]

    dark:border-red-400/50
    dark:focus:border-red-400
`;

// =========================================================
// FIELD HEADING
// =========================================================

const FieldHeading = React.memo(({
    htmlFor,
    label,
    Icon,
    meta,
}) => {
    return (
        <div
            className="
                mb-2.5

                flex
                min-w-0

                flex-wrap
                items-center
                justify-between
                gap-2
            "
        >
            <label
                htmlFor={htmlFor}
                className="
                    inline-flex
                    min-w-0
                    items-center
                    gap-2

                    font-display
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[0.08em]

                    text-slate-700

                    dark:text-gray-300
                "
            >
                {Icon && (
                    <Icon
                        size={15}
                        strokeWidth={1.9}
                        aria-hidden="true"

                        className="
                            shrink-0

                            text-indigo-600

                            dark:text-indigo-400
                        "
                    />
                )}

                <span className="break-words">
                    {label}
                </span>
            </label>

            {meta}
        </div>
    );
});

// =========================================================
// INLINE ERROR
// =========================================================

const FieldError = React.memo(({
    message,
    id,
}) => {
    if (!message) {
        return null;
    }

    return (
        <p
            id={id}
            role="alert"

            className="
                mt-2

                break-words
                [overflow-wrap:anywhere]

                text-[11px]
                font-semibold
                leading-5

                text-red-700

                dark:text-red-300
            "
        >
            {message}
        </p>
    );
});

// =========================================================
// MAIN COMPONENT
// =========================================================

const FeedbackTextFields = ({
    title = "",
    message = "",

    feedbackType = "suggestion",

    onTitleChange,
    onMessageChange,

    disabled = false,

    titleError = "",
    messageError = "",
}) => {
    // =====================================================
    // ACCESSIBLE IDS
    // =====================================================

    const generatedId = useId();

    const titleId =
        `${generatedId}-feedback-title`;

    const messageId =
        `${generatedId}-feedback-message`;

    const titleHintId =
        `${generatedId}-title-hint`;

    const messageHintId =
        `${generatedId}-message-hint`;

    const titleErrorId =
        `${generatedId}-title-error`;

    const messageErrorId =
        `${generatedId}-message-error`;

    // =====================================================
    // SAFE VALUES
    // =====================================================

    const safeTitle =
        typeof title === "string"
            ? title
            : "";

    const safeMessage =
        typeof message === "string"
            ? message
            : "";

    const isDisabled = Boolean(disabled);

    // =====================================================
    // VALIDATION INDICATORS
    //
    // Actual submit validation belongs to the
    // useFeedbackCreate controller.
    // =====================================================

    const titleLength =
        safeTitle.length;

    const cleanTitleLength =
        safeTitle.trim().length;

    const cleanMessageLength =
        safeMessage.trim().length;

    const titleTooShort =
        cleanTitleLength > 0 &&
        cleanTitleLength <
            FEEDBACK_TITLE_MIN_LENGTH;

    const titleNearLimit =
        titleLength >=
        FEEDBACK_TITLE_MAX_LENGTH - 10;

    const messageTooShort =
        cleanMessageLength > 0 &&
        cleanMessageLength <
            FEEDBACK_MESSAGE_MIN_LENGTH;

    const messageValid =
        cleanMessageLength >=
        FEEDBACK_MESSAGE_MIN_LENGTH;

    // =====================================================
    // INPUT HANDLERS
    //
    // Props receive a string, not a DOM event.
    // =====================================================

    const handleTitleChange = (event) => {
        if (
            isDisabled ||
            typeof onTitleChange !== "function"
        ) {
            return;
        }

        onTitleChange(event.target.value);
    };

    const handleMessageChange = (event) => {
        if (
            isDisabled ||
            typeof onMessageChange !== "function"
        ) {
            return;
        }

        onMessageChange(event.target.value);
    };

    // =====================================================
    // MESSAGE PLACEHOLDER
    // =====================================================

    const messagePlaceholder =
        feedbackType === "bug"
            ? (
                "Xatoni qanday takrorlash mumkinligini, " +
                "qanday natija kutganingizni va " +
                "aslida nima sodir bo‘lganini yozing..."
            )
            : "Fikringizni batafsil yozing...";

    // =====================================================
    // JSX
    // =====================================================

    return (
        <div
            className="
                flex
                w-full
                min-w-0

                flex-col
                gap-6
            "
        >
            {/* ======================================
                TITLE FIELD
            ====================================== */}

            <div className="w-full min-w-0">
                <FieldHeading
                    htmlFor={titleId}
                    label="Sarlavha"
                    Icon={Type}

                    meta={
                        <span
                            id={titleHintId}

                            className={`
                                font-mono
                                text-[10px]
                                font-semibold
                                tabular-nums

                                ${
                                    titleNearLimit
                                        ? (
                                            "text-amber-700 " +
                                            "dark:text-amber-300"
                                        )
                                        : (
                                            "text-slate-500 " +
                                            "dark:text-gray-500"
                                        )
                                }
                            `}
                        >
                            {titleLength}/{
                                FEEDBACK_TITLE_MAX_LENGTH
                            }
                        </span>
                    }
                />

                <input
                    id={titleId}
                    name="feedback-title"

                    type="text"

                    value={safeTitle}
                    onChange={handleTitleChange}

                    disabled={isDisabled}

                    minLength={
                        FEEDBACK_TITLE_MIN_LENGTH
                    }

                    maxLength={
                        FEEDBACK_TITLE_MAX_LENGTH
                    }

                    required

                    autoComplete="off"

                    placeholder={
                        "Masalan: Login sahifasida " +
                        "Google tugmasi ishlamayapti"
                    }

                    aria-invalid={
                        Boolean(titleError)
                    }

                    aria-describedby={
                        titleError
                            ? (
                                `${titleHintId} ` +
                                titleErrorId
                            )
                            : titleHintId
                    }

                    className={`
                        ${INPUT_CLASS}

                        ${
                            titleError
                                ? ERROR_INPUT_CLASS
                                : ""
                        }
                    `}
                />

                {/* MINIMUM LENGTH HINT */}

                {titleTooShort && !titleError && (
                    <p
                        className="
                            mt-2

                            text-[11px]
                            font-medium
                            leading-5

                            text-amber-700

                            dark:text-amber-300
                        "
                    >
                        Sarlavha kamida {
                            FEEDBACK_TITLE_MIN_LENGTH
                        } ta belgidan iborat
                        bo‘lishi kerak.
                    </p>
                )}

                <FieldError
                    id={titleErrorId}
                    message={titleError}
                />
            </div>

            {/* ======================================
                MESSAGE FIELD
            ====================================== */}

            <div className="w-full min-w-0">
                <FieldHeading
                    htmlFor={messageId}
                    label="Batafsil ma’lumot"
                    Icon={AlignLeft}

                    meta={
                        <span
                            className={`
                                font-mono
                                text-[10px]
                                font-semibold
                                tabular-nums

                                ${
                                    messageValid
                                        ? (
                                            "text-emerald-700 " +
                                            "dark:text-emerald-300"
                                        )
                                        : (
                                            "text-slate-500 " +
                                            "dark:text-gray-500"
                                        )
                                }
                            `}
                        >
                            {safeMessage.length} belgi
                        </span>
                    }
                />

                <textarea
                    id={messageId}
                    name="feedback-message"

                    value={safeMessage}
                    onChange={handleMessageChange}

                    disabled={isDisabled}

                    minLength={
                        FEEDBACK_MESSAGE_MIN_LENGTH
                    }

                    required

                    rows={6}

                    placeholder={
                        messagePlaceholder
                    }

                    aria-invalid={
                        Boolean(messageError)
                    }

                    aria-describedby={
                        messageError
                            ? (
                                `${messageHintId} ` +
                                messageErrorId
                            )
                            : messageHintId
                    }

                    className={`
                        ${INPUT_CLASS}

                        min-h-[150px]
                        resize-y

                        ${
                            messageError
                                ? ERROR_INPUT_CLASS
                                : ""
                        }
                    `}
                />

                {/* CHARACTER INFORMATION */}

                <div
                    className="
                        mt-2

                        flex
                        min-w-0

                        flex-wrap
                        items-center
                        justify-between
                        gap-2
                    "
                >
                    <p
                        id={messageHintId}

                        className="
                            text-[11px]
                            font-medium
                            leading-5

                            text-slate-500

                            dark:text-gray-400
                        "
                    >
                        Kamida {
                            FEEDBACK_MESSAGE_MIN_LENGTH
                        } ta belgi talab qilinadi.
                    </p>

                    {messageValid && (
                        <span
                            className="
                                text-[10px]
                                font-bold

                                text-emerald-700

                                dark:text-emerald-300
                            "
                        >
                            Yetarli uzunlik
                        </span>
                    )}
                </div>

                {/* INLINE LENGTH WARNING */}

                {messageTooShort &&
                    !messageError && (
                        <p
                            className="
                                mt-2

                                text-[11px]
                                font-medium
                                leading-5

                                text-amber-700

                                dark:text-amber-300
                            "
                        >
                            Yana {
                                FEEDBACK_MESSAGE_MIN_LENGTH -
                                cleanMessageLength
                            } ta belgi kiriting.
                        </p>
                    )}

                <FieldError
                    id={messageErrorId}
                    message={messageError}
                />
            </div>
        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(
    FeedbackTextFields
);
