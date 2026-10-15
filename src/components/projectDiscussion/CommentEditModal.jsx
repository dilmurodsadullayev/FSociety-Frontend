
import React, {
    useEffect,
    useId,
    useRef,
} from "react";

import {
    createPortal,
} from "react-dom";

import {
    AlertTriangle,
    Check,
    Edit3,
    Loader2,
    X,
} from "lucide-react";

// =========================================================
// IMAGE UTILITIES
// =========================================================

import {
    getUserAvatarUrl,
    handleUserImageError,
} from "../../utils/imageUtils";

// =========================================================
// DISCUSSION HELPERS
// =========================================================

import {
    getCommentAuthorName,
    getDiscussionErrorMessage,
} from "./discussionHelpers";

// =========================================================
// FSOCIETY — COMMENT EDIT MODAL
//
// Features:
// - Dark / Light Mode
// - Responsive modal
// - React Portal
// - Comment author information
// - Controlled textarea
// - Character counter
// - Save / Cancel
// - Validation errors
// - Loading state
// - Escape key
// - Backdrop close
// - Focus trap
// - Restore previous focus
// - Body scroll lock
//
// No direct Redux or API calls.
// =========================================================

// =========================================================
// FOCUSABLE ELEMENTS
// =========================================================

const FOCUSABLE_SELECTOR = [
    "button:not([disabled])",
    "input:not([disabled])",
    "textarea:not([disabled])",
    "select:not([disabled])",
    "a[href]",
    '[tabindex]:not([tabindex="-1"])',
].join(", ");

// =========================================================
// GET VISIBLE FOCUSABLE ELEMENTS
// =========================================================

const getFocusableElements = (container) => {
    if (!container) {
        return [];
    }

    return Array.from(
        container.querySelectorAll(
            FOCUSABLE_SELECTOR
        )
    ).filter((element) => {
        return element.getClientRects().length > 0;
    });
};

// =========================================================
// MAIN COMPONENT
// =========================================================

const CommentEditModal = ({
    isOpen = false,

    comment = null,

    value = "",
    onChange,

    onClose,
    onSave,

    isUpdating = false,
    error = "",
}) => {
    // =====================================================
    // IDS
    // =====================================================

    const generatedId = useId();

    const titleId = `${generatedId}-edit-title`;
    const descriptionId = `${generatedId}-edit-description`;
    const textareaId = `${generatedId}-edit-textarea`;
    const errorId = `${generatedId}-edit-error`;

    // =====================================================
    // REFS
    // =====================================================

    const dialogRef = useRef(null);
    const textareaRef = useRef(null);

    const onCloseRef = useRef(onClose);
    const busyRef = useRef(isUpdating);

    onCloseRef.current = onClose;
    busyRef.current = Boolean(isUpdating);

    // =====================================================
    // SAFE VALUES
    // =====================================================

    const hasComment = Boolean(comment);

    const open = Boolean(
        isOpen && hasComment
    );

    const updating = Boolean(
        isUpdating
    );

    const text =
        typeof value === "string"
            ? value
            : "";

    const cleanText = text.trim();

    // =====================================================
    // AUTHOR
    // =====================================================

    const author = comment?.user || {};

    const authorName = getCommentAuthorName(
        author
    );

    const avatar = getUserAvatarUrl(
        author
    );

    // =====================================================
    // ERROR
    // =====================================================

    const errorMessage = error
        ? getDiscussionErrorMessage(
            error,
            "Sharhni yangilab bo‘lmadi."
        )
        : "";

    // =====================================================
    // ACTION AVAILABILITY
    // =====================================================

    const canSave =
        !updating &&
        cleanText.length > 0 &&
        typeof onSave === "function";

    // =====================================================
    // CLOSE HANDLER
    // =====================================================

    const handleClose = () => {
        if (
            busyRef.current ||
            typeof onCloseRef.current !== "function"
        ) {
            return;
        }

        onCloseRef.current();
    };

    // =====================================================
    // FOCUS / SCROLL / KEYBOARD EFFECTS
    // =====================================================

    useEffect(() => {
        if (
            !open ||
            typeof document === "undefined"
        ) {
            return undefined;
        }

        // ================================================
        // PREVIOUS FOCUS / OVERFLOW
        // ================================================

        const previousFocus =
            document.activeElement;

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        // ================================================
        // MODAL ELEMENT
        // ================================================

        const dialog = dialogRef.current;

        if (!dialog) {
            return () => {
                document.body.style.overflow =
                    previousOverflow;
            };
        }

        // ================================================
        // INITIAL FOCUS
        // ================================================

        if (textareaRef.current) {
            textareaRef.current.focus();
        } else {
            dialog.focus();
        }

        // ================================================
        // KEYBOARD HANDLER
        // ================================================

        const handleKeyDown = (event) => {
            // ESCAPE

            if (event.key === "Escape") {
                if (
                    !busyRef.current &&
                    typeof onCloseRef.current === "function"
                ) {
                    event.preventDefault();

                    onCloseRef.current();
                }

                return;
            }

            // TAB TRAP

            if (event.key !== "Tab") {
                return;
            }

            const elements =
                getFocusableElements(dialog);

            if (elements.length === 0) {
                event.preventDefault();
                dialog.focus();
                return;
            }

            const first = elements[0];

            const last =
                elements[elements.length - 1];

            const active =
                document.activeElement;

            // Focus moved outside dialog.
            if (!dialog.contains(active)) {
                event.preventDefault();

                if (event.shiftKey) {
                    last.focus();
                } else {
                    first.focus();
                }

                return;
            }

            // Shift + Tab on first element.
            if (
                event.shiftKey &&
                active === first
            ) {
                event.preventDefault();
                last.focus();
                return;
            }

            // Tab on last element.
            if (
                !event.shiftKey &&
                active === last
            ) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        // ================================================
        // CLEANUP
        // ================================================

        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );

            document.body.style.overflow =
                previousOverflow;

            if (
                previousFocus &&
                typeof previousFocus.focus === "function" &&
                document.contains(previousFocus)
            ) {
                previousFocus.focus();
            }
        };
    }, [
        open,
    ]);

    // =====================================================
    // TEXT CHANGE
    // =====================================================

    const handleTextChange = (event) => {
        if (
            updating ||
            typeof onChange !== "function"
        ) {
            return;
        }

        onChange(event.target.value);
    };

    // =====================================================
    // SAVE
    // =====================================================

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!canSave) {
            return;
        }

        onSave();
    };

    // =====================================================
    // HIDE MODAL
    // =====================================================

    if (
        !open ||
        typeof document === "undefined"
    ) {
        return null;
    }

    // =====================================================
    // JSX
    // =====================================================

    return createPortal(
        <div
            className="
                fixed
                inset-0
                z-[1000]

                flex
                items-center
                justify-center

                overflow-y-auto

                bg-slate-950/75

                p-3

                backdrop-blur-sm

                sm:p-5

                dark:bg-black/80
            "

            onMouseDown={(event) => {
                if (
                    event.target === event.currentTarget
                ) {
                    handleClose();
                }
            }}
        >
            {/* ======================================
                MODAL DIALOG
            ====================================== */}

            <div
                ref={dialogRef}

                role="dialog"

                aria-modal="true"

                aria-labelledby={titleId}

                aria-describedby={descriptionId}

                aria-busy={updating}

                tabIndex={-1}

                className="
                    relative
                    isolate

                    flex
                    max-h-[calc(100dvh-24px)]
                    w-full
                    max-w-2xl
                    min-w-0

                    flex-col

                    overflow-hidden

                    rounded-[22px]
                    border
                    border-[#dce5f0]

                    bg-white

                    shadow-[0_30px_90px_rgba(15,23,42,0.25)]

                    outline-none

                    sm:rounded-[28px]
                    sm:max-h-[calc(100dvh-40px)]

                    dark:border-white/[0.10]
                    dark:bg-[#0c1119]

                    dark:shadow-[0_35px_100px_rgba(0,0,0,0.55)]
                "
            >
                {/* ==================================
                    MODAL HEADER
                ================================== */}

                <div
                    className="
                        flex
                        shrink-0

                        items-start
                        justify-between
                        gap-4

                        border-b
                        border-[#e7ebf2]

                        bg-[#f8faff]/70

                        px-4
                        py-4

                        sm:px-6
                        sm:py-5

                        dark:border-white/[0.08]
                        dark:bg-black/[0.12]
                    "
                >
                    <div
                        className="
                            flex
                            min-w-0

                            items-start
                            gap-3
                        "
                    >
                        {/* ICON */}

                        <div
                            className="
                                grid
                                h-11
                                w-11
                                shrink-0

                                place-items-center

                                rounded-xl
                                border
                                border-indigo-400/25

                                bg-indigo-500/[0.08]

                                text-indigo-700

                                dark:border-indigo-400/20
                                dark:text-indigo-300
                            "
                        >
                            <Edit3
                                size={19}
                                strokeWidth={1.9}
                                aria-hidden="true"
                            />
                        </div>

                        {/* TITLE */}

                        <div className="min-w-0">
                            <h3
                                id={titleId}

                                className="
                                    text-lg
                                    font-black

                                    text-slate-900

                                    sm:text-xl

                                    dark:text-white
                                "
                            >
                                Sharhni tahrirlash
                            </h3>

                            <p
                                id={descriptionId}

                                className="
                                    mt-1

                                    text-[11px]
                                    font-medium
                                    leading-5

                                    text-slate-500

                                    dark:text-gray-400
                                "
                            >
                                Fikringizni yangilang va
                                o‘zgarishlarni saqlang.
                            </p>
                        </div>
                    </div>

                    {/* CLOSE */}

                    <button
                        type="button"

                        onClick={handleClose}

                        disabled={
                            updating ||
                            typeof onClose !== "function"
                        }

                        aria-label="Tahrirlash oynasini yopish"

                        className="
                            grid
                            h-9
                            w-9
                            shrink-0

                            place-items-center

                            rounded-xl
                            border
                            border-[#dce5f0]

                            bg-white

                            text-slate-500

                            transition-colors

                            hover:bg-slate-100
                            hover:text-slate-900

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-indigo-500

                            disabled:cursor-not-allowed
                            disabled:opacity-40

                            dark:border-white/[0.09]
                            dark:bg-white/[0.04]
                            dark:text-gray-400

                            dark:hover:bg-white/[0.07]
                            dark:hover:text-white
                        "
                    >
                        <X
                            size={17}
                            aria-hidden="true"
                        />
                    </button>
                </div>

                {/* ==================================
                    EDIT FORM
                ================================== */}

                <form
                    onSubmit={handleSubmit}

                    className="
                        flex
                        min-h-0
                        min-w-0
                        flex-1

                        flex-col
                    "
                >
                    {/* ==============================
                        SCROLLABLE CONTENT
                    ============================== */}

                    <div
                        className="
                            min-h-0
                            min-w-0

                            flex-1

                            overflow-y-auto
                            overscroll-contain

                            p-4

                            sm:p-6
                        "
                    >
                        {/* ==========================
                            AUTHOR
                        ========================== */}

                        <div
                            className="
                                mb-5

                                flex
                                min-w-0

                                items-center
                                gap-3

                                rounded-xl
                                border
                                border-[#dce5f0]

                                bg-[#f8faff]

                                p-3

                                dark:border-white/[0.08]
                                dark:bg-white/[0.025]
                            "
                        >
                            <img
                                src={avatar}

                                alt={`${authorName} avatar`}

                                loading="lazy"

                                onError={handleUserImageError}

                                className="
                                    h-10
                                    w-10
                                    shrink-0

                                    rounded-xl
                                    border
                                    border-[#dce5f0]

                                    object-cover

                                    dark:border-white/[0.09]
                                "
                            />

                            <div className="min-w-0">
                                <p
                                    className="
                                        truncate

                                        text-xs
                                        font-black

                                        text-slate-900

                                        dark:text-white
                                    "
                                >
                                    {authorName}
                                </p>

                                <p
                                    className="
                                        mt-1
                                        truncate

                                        text-[10px]
                                        font-semibold

                                        text-slate-500

                                        dark:text-gray-500
                                    "
                                >
                                    @{author?.username || "unknown"}
                                </p>
                            </div>
                        </div>

                        {/* ==========================
                            TEXTAREA
                        ========================== */}

                        <div className="relative">

                            <label
                                htmlFor={textareaId}

                                className="sr-only"
                            >
                                Sharh matnini tahrirlash
                            </label>

                            <textarea
                                ref={textareaRef}

                                id={textareaId}

                                name="edit-comment"

                                rows={7}

                                value={text}

                                onChange={handleTextChange}

                                disabled={updating}

                                required

                                placeholder="Sharh matnini kiriting..."

                                aria-invalid={Boolean(
                                    errorMessage
                                )}

                                aria-describedby={
                                    errorMessage
                                        ? errorId
                                        : undefined
                                }

                                className="
                                    block
                                    min-h-[180px]
                                    w-full
                                    min-w-0

                                    resize-y

                                    rounded-2xl
                                    border
                                    border-[#d7e1ee]

                                    bg-[#f8faff]

                                    px-4
                                    pb-10
                                    pt-4

                                    text-sm
                                    font-medium
                                    leading-7

                                    text-slate-900

                                    outline-none
                                    transition-colors

                                    placeholder:text-slate-400

                                    focus:border-indigo-400
                                    focus:bg-white
                                    focus:ring-4
                                    focus:ring-indigo-500/[0.07]

                                    disabled:cursor-not-allowed
                                    disabled:opacity-60

                                    dark:border-white/[0.09]
                                    dark:bg-black/[0.25]
                                    dark:text-white

                                    dark:placeholder:text-gray-600

                                    dark:focus:border-indigo-400/35
                                    dark:focus:bg-black/[0.35]
                                    dark:focus:ring-indigo-400/[0.06]
                                "
                            />

                            {/* CHARACTER COUNT */}

                            <span
                                aria-label={`${text.length} belgi`}

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
                        </div>

                        {/* ==========================
                            ERROR
                        ========================== */}

                        {errorMessage && (
                            <div
                                id={errorId}

                                role="alert"

                                className="
                                    mt-4

                                    flex
                                    min-w-0
                                    items-start
                                    gap-2.5

                                    rounded-xl
                                    border
                                    border-red-200

                                    bg-red-50

                                    p-3.5

                                    text-xs
                                    font-semibold
                                    leading-6

                                    text-red-700

                                    dark:border-red-400/20
                                    dark:bg-red-500/[0.07]
                                    dark:text-red-300
                                "
                            >
                                <AlertTriangle
                                    size={17}
                                    aria-hidden="true"

                                    className="
                                        mt-0.5
                                        shrink-0
                                    "
                                />

                                <span
                                    className="
                                        min-w-0

                                        whitespace-pre-wrap
                                        break-words
                                        [overflow-wrap:anywhere]
                                    "
                                >
                                    {errorMessage}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* ==============================
                        FOOTER
                    ============================== */}

                    <div
                        className="
                            flex
                            shrink-0

                            flex-col-reverse
                            gap-2.5

                            border-t
                            border-[#e7ebf2]

                            bg-[#f8faff]/70

                            px-4
                            py-4

                            sm:flex-row
                            sm:items-center
                            sm:justify-end
                            sm:px-6

                            dark:border-white/[0.08]
                            dark:bg-black/[0.10]
                        "
                    >
                        {/* CANCEL */}

                        <button
                            type="button"

                            onClick={handleClose}

                            disabled={updating}

                            className="
                                inline-flex
                                min-h-11
                                items-center
                                justify-center

                                rounded-xl
                                border
                                border-[#dce5f0]

                                bg-white

                                px-4
                                py-2.5

                                text-xs
                                font-bold

                                text-slate-700

                                transition-colors

                                hover:bg-slate-50

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-indigo-500

                                disabled:cursor-not-allowed
                                disabled:opacity-50

                                dark:border-white/[0.10]
                                dark:bg-white/[0.04]
                                dark:text-gray-300

                                dark:hover:bg-white/[0.07]
                            "
                        >
                            Bekor qilish
                        </button>

                        {/* SAVE */}

                        <button
                            type="submit"

                            disabled={!canSave}

                            aria-busy={updating}

                            className="
                                inline-flex
                                min-h-11

                                items-center
                                justify-center
                                gap-2

                                rounded-xl
                                border
                                border-indigo-500

                                bg-indigo-600

                                px-5
                                py-2.5

                                text-xs
                                font-black

                                text-white

                                transition-colors

                                hover:bg-indigo-700

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-indigo-500

                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {updating ? (
                                <Loader2
                                    size={16}
                                    aria-hidden="true"

                                    className="
                                        animate-spin
                                        motion-reduce:animate-none
                                    "
                                />
                            ) : (
                                <Check
                                    size={16}
                                    aria-hidden="true"
                                />
                            )}

                            {updating
                                ? "Saqlanmoqda..."
                                : "O‘zgarishlarni saqlash"}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(
    CommentEditModal
);
