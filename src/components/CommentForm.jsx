
import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    AlertTriangle,
    CheckCircle2,
    Loader2,
    MessageCircle,
    Send,
    UserRound,
} from "lucide-react";

import UserImage from "../assests/userImage.jpeg";

import { BACKEND_URL } from "../services/config";

import {
    postCommentFailure,
    postCommentStart,
    postCommentSuccess,
} from "../features/comments/Comment";

import CommentService from "../services/comments";

// =========================================================
// CONSTANTS
// =========================================================

const MAX_MESSAGE_LENGTH = 150;
const SUCCESS_DURATION = 1800;

// =========================================================
// AVATAR URL
// =========================================================

const getImageUrl = (value) => {
    if (!value) return UserImage;

    const image =
        typeof value === "object"
            ? value.image || value.url || value.file
            : value;

    if (typeof image !== "string") {
        return UserImage;
    }

    const source = image.trim();

    if (!source) return UserImage;

    if (/^https?:\/\//i.test(source)) {
        return source;
    }

    if (source.startsWith("//")) {
        return `https:${source}`;
    }

    if (
        source.startsWith("blob:") ||
        /^data:image\//i.test(source)
    ) {
        return source;
    }

    if (/^[a-z][a-z\d+.-]*:/i.test(source)) {
        return UserImage;
    }

    const base = String(BACKEND_URL || "")
        .replace(/\/+$/, "");

    const path = source.startsWith("/")
        ? source
        : `/${source}`;

    return base
        ? `${base}${path}`
        : path;
};

const handleImageError = (event) => {
    const image = event.currentTarget;

    image.onerror = null;
    image.src = UserImage;
};

// =========================================================
// API ERROR MESSAGE
// =========================================================

const getErrorMessage = (error) => {
    const fallback =
        "Fikr yuborishda xatolik yuz berdi.";

    let data = error?.response?.data;

    if (typeof data === "string") {
        try {
            data = JSON.parse(data);
        } catch {
            return data.trim() || fallback;
        }
    }

    const values = [
        data?.message,
        data?.detail,
        data?.error,
        data?.non_field_errors,
        data?.errors,
        error?.message,
    ];

    const extractText = (value) => {
        if (typeof value === "string") {
            return value.trim();
        }

        if (Array.isArray(value)) {
            return value
                .map(extractText)
                .filter(Boolean)
                .join(" ");
        }

        if (value && typeof value === "object") {
            return Object.values(value)
                .map(extractText)
                .filter(Boolean)
                .join(" ");
        }

        return "";
    };

    for (const value of values) {
        const text = extractText(value);

        if (text) {
            // Preserve backend validation messages
            // even when error.message contains JSON.
            if (value === error?.message) {
                try {
                    const parsed = JSON.parse(text);
                    const parsedText = extractText(parsed);

                    if (parsedText) {
                        return parsedText;
                    }
                } catch {
                    // Normal error string.
                }
            }

            return text;
        }
    }

    if (
        error?.response?.status === 401 ||
        error?.response?.status === 403
    ) {
        return "Sessiya muddati tugagan. Qayta tizimga kiring.";
    }

    return fallback;
};

// =========================================================
// COMMENT FORM
// =========================================================

const CommentForm = ({ onSuccess }) => {
    const dispatch = useDispatch();

    // =====================================================
    // AUTH
    // =====================================================

    const {
        isLoggedIn,
        user,
    } = useSelector(
        (state) => state.auth || {}
    );

    // =====================================================
    // STATE
    // =====================================================

    const [message, setMessage] = useState("");

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [localError, setLocalError] =
        useState(null);

    const [success, setSuccess] =
        useState(false);

    // =====================================================
    // REFS
    // =====================================================

    const successTimerRef = useRef(null);

    const submittingRef = useRef(false);

    // =====================================================
    // CLEANUP
    // =====================================================

    useEffect(() => {
        return () => {
            if (successTimerRef.current) {
                clearTimeout(successTimerRef.current);
            }
        };
    }, []);

    // =====================================================
    // USER DATA
    // =====================================================

    const username =
        user?.username || "Foydalanuvchi";

    const userImage = useMemo(
        () => getImageUrl(user?.image),
        [user?.image]
    );

    // =====================================================
    // VALIDATION
    // =====================================================

    const remainingChars =
        MAX_MESSAGE_LENGTH - message.length;

    const isInvalid =
        !message.trim() ||
        message.length > MAX_MESSAGE_LENGTH;

    const isNearLimit =
        remainingChars <= 20;

    // =====================================================
    // RESET SUCCESS TIMER
    // =====================================================

    const clearSuccessTimer = () => {
        if (successTimerRef.current) {
            clearTimeout(successTimerRef.current);
            successTimerRef.current = null;
        }
    };

    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleChange = (event) => {
        const value = event.target.value;

        if (value.length > MAX_MESSAGE_LENGTH) {
            return;
        }

        setMessage(value);
        setLocalError(null);
        setSuccess(false);

        clearSuccessTimer();
    };

    // =====================================================
    // SUBMIT COMMENT
    // =====================================================

    const formSubmit = async (event) => {
        event.preventDefault();

        // Prevent duplicate submissions.
        if (submittingRef.current) {
            return;
        }

        const cleanMessage = message.trim();

        // ================================================
        // VALIDATE EMPTY MESSAGE
        // ================================================

        if (!cleanMessage) {
            setLocalError(
                "Fikr matni bo‘sh bo‘lmasligi kerak."
            );
            return;
        }

        // ================================================
        // VALIDATE LENGTH
        // ================================================

        if (cleanMessage.length > MAX_MESSAGE_LENGTH) {
            setLocalError(
                `Fikr ${MAX_MESSAGE_LENGTH} ta belgidan oshmasligi kerak.`
            );
            return;
        }

        // ================================================
        // VALIDATE AUTH
        // ================================================

        if (!isLoggedIn) {
            setLocalError(
                "Fikr qoldirish uchun avval tizimga kiring."
            );
            return;
        }

        // ================================================
        // START REQUEST
        // ================================================

        submittingRef.current = true;

        setIsSubmitting(true);
        setLocalError(null);
        setSuccess(false);

        clearSuccessTimer();

        dispatch(postCommentStart());

        try {
            // ============================================
            // POST COMMENT
            // ============================================

            const response =
                await CommentService.postComment(
                    cleanMessage
                );

            // ============================================
            // REDUX SUCCESS
            // ============================================

            dispatch(
                postCommentSuccess(response)
            );

            // ============================================
            // RESET FORM
            // ============================================

            setMessage("");
            setSuccess(true);

            // ============================================
            // AUTO-HIDE SUCCESS
            // ============================================

            successTimerRef.current = setTimeout(
                () => {
                    setSuccess(false);
                    successTimerRef.current = null;
                },
                SUCCESS_DURATION
            );

            // ============================================
            // REFRESH COMMENTS
            //
            // A refresh error should not turn a
            // successfully posted comment into
            // a submission failure.
            // ============================================

            if (typeof onSuccess === "function") {
                try {
                    await onSuccess(response);
                } catch (refreshError) {
                    console.error(
                        "Commentlar ro‘yxatini yangilashda xato:",
                        refreshError
                    );
                }
            }

        } catch (error) {
            // ============================================
            // POST FAILURE
            // ============================================

            console.error(
                "Comment yuborishda xato:",
                error
            );

            const errorMessage =
                getErrorMessage(error);

            dispatch(
                postCommentFailure(errorMessage)
            );

            setLocalError(errorMessage);
            setSuccess(false);

        } finally {
            submittingRef.current = false;
            setIsSubmitting(false);
        }
    };

    // =====================================================
    // JSX
    // =====================================================

    return (
        <div
            className="
                relative
                min-w-0
                overflow-hidden

                rounded-2xl
                border
                border-[#dce5f0]

                bg-[#f8faff]

                p-3

                sm:p-4

                dark:border-white/[0.07]
                dark:bg-[#0b1119]
            "
        >
            {/* ==========================================
                SUBTLE BACKGROUND ACCENTS
            ========================================== */}

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

                    blur-3xl

                    dark:bg-indigo-500/[0.08]
                "
            />

            {/* ==========================================
                CONTENT
            ========================================== */}

            <div className="relative z-10 min-w-0">

                {/* ======================================
                    USER INFORMATION
                ====================================== */}

                <div
                    className="
                        mb-4
                        flex
                        min-w-0
                        items-center
                        gap-3
                    "
                >
                    {/* AVATAR */}

                    <div className="relative shrink-0">
                        <img
                            src={userImage}
                            alt={`${username} avatar`}
                            onError={handleImageError}

                            className="
                                h-10
                                w-10

                                rounded-full
                                border-2
                                border-[#dce5f0]

                                bg-white
                                object-cover

                                sm:h-11
                                sm:w-11

                                dark:border-white/[0.10]
                                dark:bg-[#161b22]
                            "
                        />

                        <span
                            aria-hidden="true"
                            className="
                                absolute
                                bottom-0
                                right-0

                                h-3
                                w-3

                                rounded-full
                                border-2
                                border-[#f8faff]

                                bg-emerald-500

                                dark:border-[#0b1119]
                                dark:bg-emerald-400
                            "
                        />
                    </div>

                    {/* USER DETAILS */}

                    <div className="min-w-0 flex-1">
                        <div
                            className="
                                flex
                                min-w-0
                                flex-wrap
                                items-center
                                gap-2
                            "
                        >
                            <UserRound
                                size={14}
                                strokeWidth={2}
                                aria-hidden="true"
                                className="
                                    shrink-0
                                    text-indigo-600

                                    dark:text-indigo-300
                                "
                            />

                            <h4
                                className="
                                    min-w-0
                                    max-w-full
                                    truncate

                                    text-[13px]
                                    font-black

                                    text-slate-900

                                    sm:text-sm

                                    dark:text-white
                                "
                            >
                                {username}
                            </h4>

                            <span
                                className="
                                    inline-flex
                                    shrink-0
                                    items-center
                                    gap-1

                                    rounded-full
                                    border
                                    border-emerald-400/25

                                    bg-emerald-500/[0.07]

                                    px-2
                                    py-0.5

                                    text-[9px]
                                    font-bold
                                    uppercase

                                    text-emerald-700

                                    dark:text-emerald-300
                                "
                            >
                                Tizimda
                            </span>
                        </div>

                        <p
                            className="
                                mt-1
                                text-[11px]
                                font-medium
                                text-slate-500

                                dark:text-gray-500
                            "
                        >
                            FSociety haqida fikringizni yozing
                        </p>
                    </div>

                    {/* DECORATIVE ICON */}

                    <div
                        aria-hidden="true"
                        className="
                            hidden
                            h-9
                            w-9

                            shrink-0
                            place-items-center

                            rounded-xl
                            border
                            border-[#dce5f0]

                            bg-white/70
                            text-indigo-600

                            sm:grid

                            dark:border-white/[0.07]
                            dark:bg-white/[0.03]
                            dark:text-indigo-300
                        "
                    >
                        <MessageCircle
                            size={17}
                            strokeWidth={2}
                        />
                    </div>
                </div>

                {/* ======================================
                    FORM
                ====================================== */}

                <form
                    onSubmit={formSubmit}
                    className="min-w-0 space-y-3"
                >
                    {/* TEXTAREA */}

                    <div className="relative min-w-0">

                        <label
                            htmlFor="fsociety-comment-message"
                            className="sr-only"
                        >
                            Fikringiz
                        </label>

                        <textarea
                            id="fsociety-comment-message"
                            name="message"

                            value={message}
                            onChange={handleChange}

                            rows={4}
                            maxLength={MAX_MESSAGE_LENGTH}

                            disabled={isSubmitting}

                            aria-invalid={Boolean(localError)}
                            aria-describedby={
                                localError
                                    ? "fsociety-comment-error fsociety-comment-counter"
                                    : "fsociety-comment-counter"
                            }

                            placeholder="O‘z fikringizni shu yerga yozing..."

                            className="
                                block
                                min-h-[115px]
                                w-full
                                min-w-0

                                resize-y

                                rounded-xl
                                border
                                border-[#d8e2ef]

                                bg-white

                                px-4
                                pb-10
                                pt-3

                                text-[13px]
                                font-medium
                                leading-6

                                text-slate-800

                                outline-none

                                transition-colors
                                duration-150

                                placeholder:text-slate-400

                                hover:border-indigo-400/30

                                focus:border-indigo-500
                                focus:ring-2
                                focus:ring-indigo-500/15

                                disabled:cursor-not-allowed
                                disabled:opacity-60

                                sm:text-sm

                                dark:border-white/[0.09]
                                dark:bg-[#111722]
                                dark:text-gray-200

                                dark:placeholder:text-gray-600

                                dark:hover:border-indigo-400/25
                                dark:focus:border-indigo-400/50
                                dark:focus:ring-indigo-400/10
                            "
                        />

                        {/* CHARACTER COUNTER */}

                        <span
                            id="fsociety-comment-counter"
                            aria-live="off"
                            className={`
                                pointer-events-none

                                absolute
                                bottom-3
                                right-3

                                rounded-lg
                                border

                                px-2
                                py-1

                                font-mono
                                text-[10px]
                                font-bold

                                ${
                                    isNearLimit
                                        ? `
                                            border-amber-400/25
                                            bg-amber-500/[0.08]
                                            text-amber-800

                                            dark:text-amber-300
                                        `
                                        : `
                                            border-[#dce5f0]
                                            bg-[#f8faff]
                                            text-slate-500

                                            dark:border-white/[0.07]
                                            dark:bg-[#0b1119]
                                            dark:text-gray-500
                                        `
                                }
                            `}
                        >
                            {remainingChars}/{MAX_MESSAGE_LENGTH}
                        </span>
                    </div>

                    {/* ==================================
                        ERROR MESSAGE
                    ================================== */}

                    {localError && (
                        <div
                            id="fsociety-comment-error"
                            role="alert"
                            className="
                                flex
                                min-w-0
                                items-start
                                gap-2.5

                                rounded-xl
                                border
                                border-red-400/25

                                bg-red-500/[0.06]

                                p-3

                                text-[12px]
                                font-semibold
                                leading-5

                                text-red-700

                                dark:text-red-300
                            "
                        >
                            <AlertTriangle
                                size={16}
                                strokeWidth={2}
                                aria-hidden="true"
                                className="mt-0.5 shrink-0"
                            />

                            <p className="min-w-0 break-words">
                                {localError}
                            </p>
                        </div>
                    )}

                    {/* ==================================
                        SUCCESS MESSAGE
                    ================================== */}

                    {success && (
                        <div
                            role="status"
                            className="
                                flex
                                items-center
                                gap-2

                                rounded-xl
                                border
                                border-emerald-400/25

                                bg-emerald-500/[0.07]

                                p-3

                                text-[12px]
                                font-bold

                                text-emerald-700

                                dark:text-emerald-300
                            "
                        >
                            <CheckCircle2
                                size={17}
                                strokeWidth={2}
                                aria-hidden="true"
                                className="shrink-0"
                            />

                            Fikringiz muvaffaqiyatli yuborildi!
                        </div>
                    )}

                    {/* ==================================
                        FORM FOOTER
                    ================================== */}

                    <div
                        className="
                            flex
                            min-w-0
                            flex-col
                            gap-3

                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >
                        {/* GUIDELINE */}

                        <p
                            className="
                                min-w-0
                                text-[11px]
                                font-medium
                                leading-5

                                text-slate-500

                                dark:text-gray-500
                            "
                        >
                            Hurmat bilan yozing. Nomaqbul
                            fikrlar yashirilishi mumkin.
                        </p>

                        {/* SUBMIT BUTTON */}

                        <button
                            type="submit"

                            disabled={
                                isSubmitting ||
                                isInvalid ||
                                !isLoggedIn
                            }

                            className="
                                inline-flex
                                min-h-11
                                w-full

                                shrink-0

                                items-center
                                justify-center
                                gap-2

                                rounded-xl
                                border
                                border-indigo-500/40

                                bg-indigo-600

                                px-5
                                py-2.5

                                text-[13px]
                                font-black

                                text-white

                                shadow-[0_8px_22px_rgba(79,70,229,0.15)]

                                transition-colors
                                duration-150

                                hover:bg-indigo-500

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-indigo-500
                                focus-visible:ring-offset-2

                                disabled:cursor-not-allowed
                                disabled:opacity-50
                                disabled:shadow-none

                                sm:w-auto

                                dark:shadow-[0_8px_22px_rgba(99,102,241,0.12)]
                                dark:focus-visible:ring-offset-[#0b1119]
                            "
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2
                                        size={17}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                        className="
                                            animate-spin
                                            motion-reduce:animate-none
                                        "
                                    />

                                    Yuborilmoqda...
                                </>
                            ) : (
                                <>
                                    <Send
                                        size={16}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />

                                    Fikr qoldirish
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default CommentForm;
