
import React, {
    useEffect,
    useId,
    useRef,
} from "react";

import { createPortal } from "react-dom";

import {
    AnimatePresence,
    motion,
    useReducedMotion,
} from "framer-motion";

import {
    Loader2,
    MessageSquareText,
    Send,
    Sparkles,
    X,
} from "lucide-react";

// =========================================================
// FSOCIETY — FEEDBACK CREATE MODAL SHELL
//
// Responsibilities:
// - Modal presentation
// - Dark / Light Mode
// - Mobile / tablet / desktop layout
// - Fixed header and footer
// - Scrollable form content
// - Escape / backdrop close
// - Focus trap
// - Body scroll lock
// - Restore previous focus
// - Submit and loading buttons
//
// No API calls.
// No form state.
// =========================================================

const FOCUSABLE_SELECTOR = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "textarea:not([disabled])",
    "select:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
].join(", ");

// =========================================================
// FOCUSABLE ELEMENTS
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

const FeedbackCreateModalShell = ({
    isOpen = false,
    onClose,
    onSubmit,

    isSubmitting = false,
    error = "",

    children,
}) => {
    // =====================================================
    // ACCESSIBILITY
    // =====================================================

    const id = useId();

    const titleId = `${id}-title`;
    const descriptionId = `${id}-description`;
    const errorId = `${id}-error`;

    const reduceMotion = useReducedMotion();

    // =====================================================
    // REFS
    // =====================================================

    const dialogRef = useRef(null);
    const errorRef = useRef(null);

    const closeRef = useRef(onClose);
    const submittingRef = useRef(isSubmitting);

    closeRef.current = onClose;
    submittingRef.current = Boolean(isSubmitting);

    // =====================================================
    // DERIVED VALUES
    // =====================================================

    const open = Boolean(isOpen);
    const busy = Boolean(isSubmitting);

    const canClose =
        !busy &&
        typeof onClose === "function";

    const canSubmit =
        !busy &&
        typeof onSubmit === "function";

    // =====================================================
    // CLOSE HANDLER
    // =====================================================

    const handleClose = () => {
        if (
            submittingRef.current ||
            typeof closeRef.current !== "function"
        ) {
            return;
        }

        closeRef.current();
    };

    // =====================================================
    // SCROLL LOCK / FOCUS / KEYBOARD
    // =====================================================

    useEffect(() => {
        if (
            !open ||
            typeof document === "undefined"
        ) {
            return undefined;
        }

        const previousFocus =
            document.activeElement;

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        const dialog = dialogRef.current;

        // Avoid opening the mobile keyboard immediately.
        dialog?.focus();

        const handleKeyDown = (event) => {
            // ============================================
            // ESCAPE
            // ============================================

            if (event.key === "Escape") {
                event.preventDefault();

                if (
                    !submittingRef.current &&
                    typeof closeRef.current === "function"
                ) {
                    closeRef.current();
                }

                return;
            }

            // ============================================
            // TAB FOCUS TRAP
            // ============================================

            if (
                event.key !== "Tab" ||
                !dialog
            ) {
                return;
            }

            const focusable =
                getFocusableElements(dialog);

            if (focusable.length === 0) {
                event.preventDefault();
                dialog.focus();
                return;
            }

            const first = focusable[0];
            const last =
                focusable[focusable.length - 1];

            const active =
                document.activeElement;

            if (!dialog.contains(active)) {
                event.preventDefault();

                if (event.shiftKey) {
                    last.focus();
                } else {
                    first.focus();
                }

                return;
            }

            if (
                event.shiftKey &&
                active === first
            ) {
                event.preventDefault();
                last.focus();
                return;
            }

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
    }, [open]);

    // =====================================================
    // ERROR VISIBILITY
    // =====================================================

    useEffect(() => {
        if (
            open &&
            error &&
            errorRef.current
        ) {
            errorRef.current.scrollIntoView({
                block: "nearest",
                behavior: "auto",
            });
        }
    }, [open, error]);

    // =====================================================
    // SERVER RENDERING GUARD
    // =====================================================

    if (typeof document === "undefined") {
        return null;
    }

    // =====================================================
    // JSX
    // =====================================================

    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    key="feedback-create-overlay"

                    initial={
                        reduceMotion
                            ? false
                            : { opacity: 0 }
                    }

                    animate={{
                        opacity: 1,
                    }}

                    exit={{
                        opacity: 0,
                    }}

                    transition={{
                        duration: reduceMotion
                            ? 0
                            : 0.18,
                    }}

                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            handleClose();
                        }
                    }}

                    className="
                        fixed
                        inset-0
                        z-[1150]

                        flex
                        items-center
                        justify-center

                        overflow-hidden

                        bg-slate-950/75

                        p-3

                        font-sans

                        backdrop-blur-sm

                        sm:p-5

                        dark:bg-black/85
                    "
                >
                    {/* ==================================
                        MODAL CONTAINER
                    ================================== */}

                    <motion.div
                        ref={dialogRef}

                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={titleId}
                        aria-describedby={descriptionId}
                        aria-busy={busy}

                        tabIndex={-1}

                        initial={
                            reduceMotion
                                ? false
                                : {
                                    opacity: 0,
                                    y: 18,
                                    scale: 0.98,
                                }
                        }

                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}

                        exit={{
                            opacity: 0,
                            y: 12,
                            scale: 0.985,
                        }}

                        transition={{
                            duration: reduceMotion
                                ? 0
                                : 0.2,
                            ease: "easeOut",
                        }}

                        className="
                            relative
                            isolate

                            flex
                            w-full
                            max-w-3xl
                            min-w-0
                            min-h-0

                            max-h-[calc(100dvh-24px)]

                            flex-col

                            overflow-hidden

                            rounded-[22px]
                            border
                            border-slate-200

                            bg-white

                            shadow-[0_30px_90px_rgba(15,23,42,0.28)]

                            outline-none

                            sm:max-h-[calc(100dvh-40px)]
                            sm:rounded-[28px]

                            dark:border-white/[0.10]
                            dark:bg-[#0b1018]

                            dark:shadow-[0_35px_100px_rgba(0,0,0,0.55)]
                        "
                    >
                        {/* ==============================
                            HEADER — FIXED
                        ============================== */}

                        <div
                            className="
                                relative
                                z-20

                                flex
                                shrink-0

                                items-center
                                justify-between
                                gap-3

                                border-b
                                border-slate-200

                                bg-slate-50/90

                                px-4
                                py-3.5

                                sm:px-6
                                sm:py-5

                                dark:border-white/[0.08]
                                dark:bg-[#0d131d]
                            "
                        >
                            <div
                                className="
                                    flex
                                    min-w-0
                                    items-center
                                    gap-3
                                "
                            >
                                {/* ICON */}

                                <div
                                    className="
                                        grid
                                        h-10
                                        w-10
                                        shrink-0

                                        place-items-center

                                        rounded-xl
                                        border
                                        border-indigo-400/25

                                        bg-indigo-500/[0.09]

                                        text-indigo-700

                                        sm:h-11
                                        sm:w-11

                                        dark:border-indigo-400/20
                                        dark:bg-indigo-400/[0.08]
                                        dark:text-indigo-300
                                    "
                                >
                                    <MessageSquareText
                                        size={20}
                                        strokeWidth={1.9}
                                        aria-hidden="true"
                                    />
                                </div>

                                {/* TITLE */}

                                <div className="min-w-0">
                                    <h2
                                        id={titleId}

                                        className="
                                            break-words

                                            font-display
                                            text-base
                                            font-black

                                            text-slate-900

                                            sm:text-lg

                                            dark:text-white
                                        "
                                    >
                                        Feedback yuborish
                                    </h2>

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
                                        F.Society’ni
                                        yaxshilashga yordam
                                        bering.
                                    </p>
                                </div>
                            </div>

                            {/* CLOSE */}

                            <button
                                type="button"

                                onClick={handleClose}

                                disabled={!canClose}

                                aria-label="Modalni yopish"

                                className="
                                    grid
                                    h-10
                                    w-10
                                    shrink-0

                                    place-items-center

                                    rounded-xl
                                    border
                                    border-slate-200

                                    bg-white

                                    text-slate-500

                                    transition-colors

                                    hover:bg-red-50
                                    hover:text-red-700

                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-indigo-500

                                    disabled:cursor-not-allowed
                                    disabled:opacity-40

                                    dark:border-white/[0.09]
                                    dark:bg-white/[0.04]
                                    dark:text-gray-400

                                    dark:hover:bg-white/[0.08]
                                    dark:hover:text-white
                                "
                            >
                                <X
                                    size={18}
                                    aria-hidden="true"
                                />
                            </button>
                        </div>

                        {/* ==============================
                            FORM
                        ============================== */}

                        <form
                            noValidate

                            onSubmit={onSubmit}

                            className="
                                flex
                                min-h-0
                                min-w-0
                                flex-1

                                flex-col
                            "
                        >
                            {/* ==========================
                                SCROLLABLE CONTENT
                            ========================== */}

                            <div
                                className="
                                    min-h-0
                                    min-w-0
                                    flex-1

                                    overflow-x-hidden
                                    overflow-y-auto

                                    overscroll-contain

                                    px-4
                                    py-5

                                    sm:px-6
                                    sm:py-6
                                "
                            >
                                <div
                                    className="
                                        flex
                                        min-w-0
                                        flex-col
                                        gap-6
                                    "
                                >
                                    {/* GLOBAL ERROR */}

                                    {error && (
                                        <div
                                            ref={errorRef}
                                            id={errorId}
                                            role="alert"

                                            className="
                                                break-words
                                                [overflow-wrap:anywhere]

                                                rounded-2xl
                                                border
                                                border-red-200

                                                bg-red-50

                                                px-4
                                                py-3

                                                text-xs
                                                font-medium
                                                leading-6

                                                text-red-700

                                                dark:border-red-400/20
                                                dark:bg-red-500/[0.07]
                                                dark:text-red-300
                                            "
                                        >
                                            {error}
                                        </div>
                                    )}

                                    {/* MODAL BODY */}

                                    {children}
                                </div>
                            </div>

                            {/* ==========================
                                FOOTER — ALWAYS VISIBLE
                            ========================== */}

                            <div
                                className="
                                    relative
                                    z-20
                                    shrink-0

                                    border-t
                                    border-slate-200

                                    bg-white

                                    px-4
                                    py-3

                                    sm:px-6
                                    sm:py-4

                                    dark:border-white/[0.08]
                                    dark:bg-[#0b1018]
                                "
                            >
                                <div
                                    className="
                                        flex
                                        flex-wrap

                                        items-center
                                        justify-between
                                        gap-3
                                    "
                                >
                                    {/* TIP */}

                                    <div
                                        className="
                                            hidden
                                            min-w-0

                                            items-center
                                            gap-2

                                            text-[10px]
                                            font-medium

                                            text-slate-500

                                            lg:flex

                                            dark:text-gray-500
                                        "
                                    >
                                        <Sparkles
                                            size={14}
                                            aria-hidden="true"

                                            className="
                                                text-indigo-600

                                                dark:text-indigo-300
                                            "
                                        />

                                        Sifatli feedback
                                        hamjamiyatga yordam
                                        beradi.
                                    </div>

                                    {/* ACTIONS */}

                                    <div
                                        className="
                                            flex
                                            w-full
                                            flex-wrap
                                            gap-2.5

                                            lg:ml-auto
                                            lg:w-auto
                                        "
                                    >
                                        <button
                                            type="button"

                                            onClick={handleClose}

                                            disabled={!canClose}

                                            className="
                                                inline-flex
                                                min-h-11
                                                min-w-[125px]
                                                flex-1

                                                items-center
                                                justify-center

                                                rounded-xl
                                                border
                                                border-slate-200

                                                bg-white

                                                px-3
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

                                                lg:flex-none
                                                lg:px-5

                                                dark:border-white/[0.10]
                                                dark:bg-white/[0.04]
                                                dark:text-gray-300

                                                dark:hover:bg-white/[0.07]
                                            "
                                        >
                                            Bekor qilish
                                        </button>

                                        <button
                                            type="submit"

                                            disabled={!canSubmit}

                                            aria-busy={busy}

                                            className="
                                                inline-flex
                                                min-h-11
                                                min-w-[135px]
                                                flex-1

                                                items-center
                                                justify-center
                                                gap-2

                                                rounded-xl
                                                border
                                                border-indigo-600

                                                bg-indigo-600

                                                px-3
                                                py-2.5

                                                text-xs
                                                font-black

                                                text-white

                                                transition-colors

                                                hover:bg-indigo-700

                                                focus-visible:outline-none
                                                focus-visible:ring-2
                                                focus-visible:ring-indigo-500
                                                focus-visible:ring-offset-2

                                                disabled:cursor-not-allowed
                                                disabled:opacity-50

                                                lg:flex-none
                                                lg:px-5

                                                dark:focus-visible:ring-offset-[#0b1018]
                                            "
                                        >
                                            {busy ? (
                                                <Loader2
                                                    size={16}
                                                    aria-hidden="true"

                                                    className="
                                                        animate-spin
                                                        motion-reduce:animate-none
                                                    "
                                                />
                                            ) : (
                                                <Send
                                                    size={16}
                                                    aria-hidden="true"
                                                />
                                            )}

                                            {busy
                                                ? "Yuborilmoqda..."
                                                : "Feedback yuborish"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(
    FeedbackCreateModalShell
);
