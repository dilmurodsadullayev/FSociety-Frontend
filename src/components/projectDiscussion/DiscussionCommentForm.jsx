
import React from "react";

import {
    AlertTriangle,
    Loader2,
    Send,
    Sparkles,
} from "lucide-react";

// =========================================================
// EXISTING UTILITIES
// =========================================================

import {
    getUserAvatarUrl,
    handleUserImageError,
} from "../../utils/imageUtils";

// =========================================================
// DISCUSSION HELPERS
// =========================================================

import {
    getDiscussionErrorMessage,
} from "./discussionHelpers";

// =========================================================
// FSOCIETY — DISCUSSION COMMENT FORM
//
// Features:
// - Dark / Light Mode
// - Responsive layout
// - Current user avatar
// - Comment textarea
// - $tag helper text
// - Character counter
// - Login requirement
// - Validation error
// - Loading state
// - Accessible form
//
// No direct Redux or API calls.
//
// Props:
// - user
// - isLoggedIn
// - newCommentText
// - onChange
// - onSubmit
// - isSubmitting
// - submitError
// =========================================================

// =========================================================
// COMPONENT
// =========================================================

const DiscussionCommentForm = ({
    user = null,

    isLoggedIn = false,

    newCommentText = "",

    onChange,
    onSubmit,

    isSubmitting = false,

    submitError = "",
}) => {
    // =====================================================
    // SAFE VALUES
    // =====================================================

    const text =
        typeof newCommentText === "string"
            ? newCommentText
            : "";

    const loggedIn = Boolean(
        isLoggedIn
    );

    const submitting = Boolean(
        isSubmitting
    );

    const canWrite =
        loggedIn &&
        !submitting &&
        typeof onChange === "function";

    const canSubmit =
        loggedIn &&
        !submitting &&
        text.trim().length > 0 &&
        typeof onSubmit === "function";

    // =====================================================
    // USER AVATAR
    // =====================================================

    const avatar = getUserAvatarUrl(
        user
    );

    const username =
        user?.username ||
        "Foydalanuvchi";

    // =====================================================
    // ERROR
    // =====================================================

    const errorMessage = submitError
        ? getDiscussionErrorMessage(
            submitError,
            "Sharhni yuborishda xatolik yuz berdi."
        )
        : "";

    // =====================================================
    // INPUT HANDLER
    // =====================================================

    const handleTextChange = (event) => {
        if (typeof onChange !== "function") {
            return;
        }

        onChange(
            event.target.value
        );
    };

    // =====================================================
    // SUBMIT HANDLER
    // =====================================================

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!canSubmit) {
            return;
        }

        onSubmit();
    };

    // =====================================================
    // JSX
    // =====================================================

    return (
        <form
            onSubmit={handleSubmit}

            aria-label="Yangi loyiha sharhini yozish"

            aria-busy={submitting}

            className="
                relative

                w-full
                min-w-0

                overflow-hidden

                rounded-[22px]
                border
                border-[#dce5f0]

                bg-white/85

                p-4

                shadow-[0_5px_20px_rgba(15,23,42,0.035)]

                sm:rounded-[24px]
                sm:p-5

                dark:border-white/[0.08]
                dark:bg-white/[0.025]
                dark:shadow-none
            "
        >
            {/* ======================================
                BACKGROUND GLOW
            ====================================== */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    -left-20
                    -top-20

                    h-44
                    w-44

                    rounded-full

                    bg-indigo-500/[0.055]

                    blur-[70px]

                    dark:bg-indigo-500/[0.07]
                "
            />

            {/* ======================================
                FORM CONTENT
            ====================================== */}

            <div
                className="
                    relative
                    z-10

                    flex
                    min-w-0

                    items-start
                    gap-3

                    sm:gap-4
                "
            >
                {/* ==================================
                    CURRENT USER AVATAR
                ================================== */}

                <img
                    src={avatar}

                    alt={`${username} avatar`}

                    loading="lazy"
                    decoding="async"

                    onError={handleUserImageError}

                    className="
                        h-10
                        w-10
                        shrink-0

                        rounded-xl
                        border
                        border-[#dce5f0]

                        bg-slate-100
                        object-cover

                        sm:h-12
                        sm:w-12

                        dark:border-white/[0.09]
                        dark:bg-[#141c2a]
                    "
                />

                {/* ==================================
                    INPUT CONTENT
                ================================== */}

                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >
                    {/* ==============================
                        TEXTAREA
                    ============================== */}

                    <div className="relative">

                        <label
                            htmlFor="project-discussion-new-comment"

                            className="sr-only"
                        >
                            Loyiha haqida sharh yozish
                        </label>

                        <textarea
                            id="project-discussion-new-comment"

                            name="project-comment-body"

                            rows={4}

                            value={text}

                            onChange={handleTextChange}

                            disabled={!canWrite}

                            placeholder={
                                loggedIn
                                    ? "Loyiha haqida fikringizni yozing..."
                                    : "Sharh qoldirish uchun tizimga kiring..."
                            }

                            aria-invalid={Boolean(
                                errorMessage
                            )}

                            aria-describedby={
                                errorMessage
                                    ? "project-discussion-form-error project-discussion-form-hint"
                                    : "project-discussion-form-hint"
                            }

                            className="
                                block

                                min-h-[120px]
                                w-full
                                min-w-0

                                resize-none

                                rounded-2xl
                                border
                                border-[#d7e1ee]

                                bg-[#f8faff]

                                px-4
                                pb-10
                                pt-3.5

                                text-[13px]
                                font-medium
                                leading-6

                                text-slate-900

                                outline-none

                                transition-colors
                                duration-150

                                placeholder:text-slate-400

                                focus:border-indigo-400
                                focus:bg-white
                                focus:ring-4
                                focus:ring-indigo-500/[0.07]

                                disabled:cursor-not-allowed
                                disabled:opacity-60

                                sm:text-sm

                                dark:border-white/[0.09]
                                dark:bg-black/[0.20]
                                dark:text-gray-100

                                dark:placeholder:text-gray-600

                                dark:focus:border-indigo-400/35
                                dark:focus:bg-black/[0.28]
                                dark:focus:ring-indigo-400/[0.06]
                            "
                        />

                        {/* ==========================
                            CHARACTER COUNTER
                        ========================== */}

                        {loggedIn && (
                            <span
                                aria-label={
                                    `${text.length} belgi`
                                }

                                className="
                                    pointer-events-none

                                    absolute
                                    bottom-3
                                    right-3

                                    rounded-lg

                                    border
                                    border-[#e2e8f0]

                                    bg-white/90

                                    px-2
                                    py-1

                                    font-mono
                                    text-[10px]
                                    font-bold
                                    tabular-nums

                                    text-slate-500

                                    dark:border-white/[0.08]
                                    dark:bg-[#111827]/90
                                    dark:text-gray-500
                                "
                            >
                                {text.length} belgi
                            </span>
                        )}
                    </div>

                    {/* ==============================
                        VALIDATION ERROR
                    ============================== */}

                    {errorMessage && (
                        <div
                            id="project-discussion-form-error"

                            role="alert"

                            className="
                                mt-3

                                flex
                                min-w-0
                                items-start
                                gap-2.5

                                rounded-xl
                                border
                                border-red-200

                                bg-red-50

                                p-3

                                text-[12px]
                                font-semibold
                                leading-5

                                text-red-700

                                dark:border-red-400/20
                                dark:bg-red-500/[0.07]
                                dark:text-red-300
                            "
                        >
                            <AlertTriangle
                                size={16}

                                strokeWidth={2}

                                aria-hidden="true"

                                className="
                                    mt-0.5
                                    shrink-0
                                "
                            />

                            <span
                                className="
                                    min-w-0
                                    flex-1

                                    whitespace-pre-wrap
                                    break-words
                                    [overflow-wrap:anywhere]
                                "
                            >
                                {errorMessage}
                            </span>
                        </div>
                    )}

                    {/* ==============================
                        FORM FOOTER
                    ============================== */}

                    <div
                        className="
                            mt-3

                            flex
                            min-w-0

                            flex-col
                            gap-3

                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >
                        {/* ==========================
                            TAG HELPER
                        ========================== */}

                        <p
                            id="project-discussion-form-hint"

                            className="
                                flex
                                min-w-0
                                items-start
                                gap-2

                                text-[10px]
                                font-medium
                                leading-5

                                text-slate-500

                                dark:text-gray-500
                            "
                        >
                            <Sparkles
                                size={14}

                                strokeWidth={1.9}

                                aria-hidden="true"

                                className="
                                    mt-0.5
                                    shrink-0

                                    text-indigo-600

                                    dark:text-indigo-400
                                "
                            />

                            <span>
                                <code
                                    className="
                                        font-mono
                                        font-bold

                                        text-indigo-700

                                        dark:text-indigo-300
                                    "
                                >
                                    $tag
                                </code>

                                {" "}orqali mavzuni ajratib
                                ko‘rsatishingiz mumkin.
                            </span>
                        </p>

                        {/* ==========================
                            SUBMIT BUTTON
                        ========================== */}

                        <button
                            type="submit"

                            disabled={!canSubmit}

                            aria-busy={submitting}

                            className="
                                inline-flex

                                min-h-10
                                shrink-0

                                items-center
                                justify-center
                                gap-2

                                rounded-xl
                                border
                                border-indigo-500

                                bg-indigo-600

                                px-4
                                py-2.5

                                text-[12px]
                                font-black

                                text-white

                                shadow-[0_6px_16px_rgba(79,70,229,0.15)]

                                transition-colors
                                duration-150

                                hover:border-indigo-700
                                hover:bg-indigo-700

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-indigo-500
                                focus-visible:ring-offset-2

                                disabled:cursor-not-allowed
                                disabled:border-slate-300
                                disabled:bg-slate-100
                                disabled:text-slate-400
                                disabled:shadow-none

                                sm:self-auto

                                dark:disabled:border-white/[0.07]
                                dark:disabled:bg-white/[0.04]
                                dark:disabled:text-gray-600
                                dark:focus-visible:ring-offset-[#0b1018]
                            "
                        >
                            {/* ICON */}

                            {submitting ? (
                                <Loader2
                                    size={16}

                                    aria-hidden="true"

                                    className="
                                        shrink-0
                                        animate-spin

                                        motion-reduce:animate-none
                                    "
                                />
                            ) : (
                                <Send
                                    size={16}
                                    strokeWidth={2}

                                    aria-hidden="true"

                                    className="shrink-0"
                                />
                            )}

                            {/* LABEL */}

                            <span>
                                {!loggedIn
                                    ? "Kirish kerak"
                                    : submitting
                                        ? "Yuborilmoqda..."
                                        : "Sharh yuborish"}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(
    DiscussionCommentForm
);
