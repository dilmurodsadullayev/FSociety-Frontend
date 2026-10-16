
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
    Pencil,
    Save,
    ShieldAlert,
    X,
} from "lucide-react";

// =========================================================
// FSOCIETY — FEEDBACK EDIT MODAL SHELL
//
// - Dark / Light Mode
// - Responsive 320px+
// - Scrollable form content
// - Fixed header and footer
// - Focus trap
// - Escape / backdrop close
// - Body scroll lock
// - Prevent close while saving
// - Save permission / changes check
// =========================================================

const FOCUSABLE_SELECTOR = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "textarea:not([disabled])",
    "select:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
].join(", ");

const getFocusableElements = (container) => {
    if (!container) return [];

    return Array.from(
        container.querySelectorAll(FOCUSABLE_SELECTOR)
    ).filter(
        (element) =>
            element.getClientRects().length > 0
    );
};

// =========================================================
// MAIN COMPONENT
// =========================================================

const FeedbackEditModalShell = ({
    isOpen = false,
    isSubmitting = false,
    hasChanges = false,
    canSave = true,

    error = "",

    onClose,
    onSubmit,
    children,
}) => {
    const id = useId();

    const titleId = `${id}-title`;
    const descriptionId = `${id}-description`;
    const errorId = `${id}-error`;

    const dialogRef = useRef(null);
    const errorRef = useRef(null);

    const closeRef = useRef(onClose);
    const busyRef = useRef(isSubmitting);

    closeRef.current = onClose;
    busyRef.current = Boolean(isSubmitting);

    const reduceMotion = useReducedMotion();

    const open = Boolean(isOpen);
    const busy = Boolean(isSubmitting);

    const closeEnabled =
        !busy &&
        typeof onClose === "function";

    const submitEnabled =
        !busy &&
        Boolean(canSave) &&
        typeof onSubmit === "function";

    // =====================================================
    // CLOSE
    // =====================================================

    const handleClose = () => {
        if (
            busyRef.current ||
            typeof closeRef.current !== "function"
        ) {
            return;
        }

        closeRef.current();
    };

    // =====================================================
    // BODY LOCK / FOCUS / KEYBOARD
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

        const dialog = dialogRef.current;

        document.body.style.overflow = "hidden";

        dialog?.focus();

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                if (!busyRef.current) {
                    event.preventDefault();
                    event.stopPropagation();

                    closeRef.current?.();
                }

                return;
            }

            if (
                event.key !== "Tab" ||
                !dialog
            ) {
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

            if (!dialog.contains(active)) {
                event.preventDefault();

                (
                    event.shiftKey
                        ? last
                        : first
                ).focus();

                return;
            }

            if (
                event.shiftKey &&
                active === first
            ) {
                event.preventDefault();
                last.focus();
            } else if (
                !event.shiftKey &&
                active === last
            ) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener(
            "keydown",
            handleKeyDown,
            true
        );

        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown,
                true
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
    // ERROR SCROLL
    // =====================================================

    useEffect(() => {
        if (
            open &&
            error &&
            errorRef.current
        ) {
            errorRef.current.scrollIntoView({
                behavior: "auto",
                block: "nearest",
            });
        }
    }, [open, error]);

    // =====================================================
    // SSR GUARD
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
                    key="feedback-edit-overlay"

                    initial={
                        reduceMotion
                            ? false
                            : { opacity: 0 }
                    }

                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}

                    transition={{
                        duration: reduceMotion ? 0 : 0.18,
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
                        fixed inset-0 z-[1160]
                        flex items-center justify-center
                        overflow-hidden

                        bg-slate-950/75
                        p-2 sm:p-5

                        font-sans backdrop-blur-sm
                        dark:bg-black/85
                    "
                >
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
                            duration: reduceMotion ? 0 : 0.2,
                            ease: "easeOut",
                        }}

                        className="
                            relative isolate
                            flex w-full max-w-3xl
                            min-w-0 min-h-0 flex-col

                            max-h-[calc(100dvh-16px)]
                            sm:max-h-[calc(100dvh-40px)]

                            overflow-hidden
                            rounded-[20px] sm:rounded-[28px]

                            border border-slate-200 bg-white
                            shadow-[0_30px_90px_rgba(15,23,42,0.28)]

                            outline-none

                            dark:border-white/[0.10]
                            dark:bg-[#0b1018]
                            dark:shadow-[0_35px_100px_rgba(0,0,0,0.55)]
                        "
                    >
                        {/* ==============================
                            HEADER
                        ============================== */}

                        <div
                            className="
                                relative z-20
                                flex shrink-0
                                items-center justify-between gap-3

                                border-b border-slate-200
                                bg-slate-50/95

                                px-4 py-3 sm:px-6 sm:py-5

                                dark:border-white/[0.08]
                                dark:bg-[#0d131d]
                            "
                        >
                            <div
                                className="
                                    flex min-w-0
                                    items-center gap-3
                                "
                            >
                                <div
                                    className="
                                        grid h-10 w-10 shrink-0
                                        place-items-center rounded-xl

                                        border border-cyan-400/25
                                        bg-cyan-500/[0.08]
                                        text-cyan-700

                                        dark:border-cyan-400/20
                                        dark:bg-cyan-400/[0.07]
                                        dark:text-cyan-300
                                    "
                                >
                                    <Pencil
                                        size={19}
                                        aria-hidden="true"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <h2
                                        id={titleId}
                                        className="
                                            break-words
                                            font-display text-base
                                            font-black text-slate-900

                                            sm:text-lg
                                            dark:text-white
                                        "
                                    >
                                        Feedbackni tahrirlash
                                    </h2>

                                    <p
                                        id={descriptionId}
                                        className="
                                            mt-1 text-[11px]
                                            font-medium leading-5

                                            text-slate-500
                                            dark:text-gray-400
                                        "
                                    >
                                        Tekshiruvdagi feedbackga
                                        o‘zgartirish kiriting.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={!closeEnabled}
                                aria-label="Modalni yopish"

                                className="
                                    grid h-10 w-10 shrink-0
                                    place-items-center rounded-xl

                                    border border-slate-200
                                    bg-white text-slate-500

                                    transition-colors
                                    hover:bg-red-50 hover:text-red-700

                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-cyan-500

                                    disabled:cursor-not-allowed
                                    disabled:opacity-40

                                    dark:border-white/[0.10]
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
                                flex min-h-0 min-w-0
                                flex-1 flex-col
                            "
                        >
                            {/* CONTENT */}

                            <div
                                className="
                                    min-h-0 min-w-0 flex-1
                                    overflow-x-hidden overflow-y-auto
                                    overscroll-contain

                                    px-4 py-5
                                    sm:px-6 sm:py-6
                                "
                            >
                                <div
                                    className="
                                        flex min-w-0
                                        flex-col gap-6
                                    "
                                >
                                    {/* PERMISSION WARNING */}

                                    <div
                                        className="
                                            flex min-w-0
                                            items-start gap-3

                                            rounded-2xl
                                            border border-amber-300/60
                                            bg-amber-50/80 p-3.5

                                            dark:border-amber-400/20
                                            dark:bg-amber-500/[0.055]
                                        "
                                    >
                                        <ShieldAlert
                                            size={18}
                                            aria-hidden="true"

                                            className="
                                                mt-0.5 shrink-0
                                                text-amber-700
                                                dark:text-amber-300
                                            "
                                        />

                                        <p
                                            className="
                                                min-w-0 text-[11px]
                                                font-medium leading-6

                                                text-amber-900
                                                dark:text-amber-200/85
                                            "
                                        >
                                            Feedback tasdiqlangandan
                                            yoki tahrirlash ruxsati
                                            olib tashlangandan so‘ng
                                            uni o‘zgartirib bo‘lmaydi.
                                        </p>
                                    </div>

                                    {/* API ERROR */}

                                    {error && (
                                        <div
                                            ref={errorRef}
                                            id={errorId}
                                            role="alert"

                                            className="
                                                break-words
                                                [overflow-wrap:anywhere]

                                                rounded-2xl
                                                border border-red-200
                                                bg-red-50

                                                px-4 py-3
                                                text-xs font-medium
                                                leading-6 text-red-700

                                                dark:border-red-400/20
                                                dark:bg-red-500/[0.07]
                                                dark:text-red-300
                                            "
                                        >
                                            {error}
                                        </div>
                                    )}

                                    {children}
                                </div>
                            </div>

                            {/* ==============================
                                FOOTER
                            ============================== */}

                            <div
                                className="
                                    relative z-20 shrink-0

                                    border-t border-slate-200
                                    bg-white

                                    px-4 py-3
                                    sm:px-6 sm:py-4

                                    dark:border-white/[0.08]
                                    dark:bg-[#0b1018]
                                "
                            >
                                <div
                                    className="
                                        flex min-w-0 flex-wrap
                                        items-center justify-between
                                        gap-3
                                    "
                                >
                                    <span
                                        className="
                                            hidden text-[11px]
                                            font-medium text-slate-500

                                            lg:block
                                            dark:text-gray-400
                                        "
                                    >
                                        {hasChanges
                                            ? "Saqlanmagan o‘zgarishlar mavjud"
                                            : "Hozircha o‘zgarish yo‘q"}
                                    </span>

                                    <div
                                        className="
                                            flex w-full flex-wrap
                                            gap-2.5

                                            lg:ml-auto lg:w-auto
                                        "
                                    >
                                        {/* CANCEL */}

                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            disabled={!closeEnabled}

                                            className="
                                                inline-flex min-h-11
                                                min-w-[125px] flex-1

                                                items-center justify-center
                                                rounded-xl

                                                border border-slate-200
                                                bg-white

                                                px-3 py-2.5
                                                text-xs font-bold
                                                text-slate-700

                                                transition-colors
                                                hover:bg-slate-50

                                                focus-visible:outline-none
                                                focus-visible:ring-2
                                                focus-visible:ring-cyan-500

                                                disabled:cursor-not-allowed
                                                disabled:opacity-50

                                                lg:flex-none lg:px-5

                                                dark:border-white/[0.10]
                                                dark:bg-white/[0.04]
                                                dark:text-gray-300
                                                dark:hover:bg-white/[0.08]
                                            "
                                        >
                                            Bekor qilish
                                        </button>

                                        {/* SAVE */}

                                        <button
                                            type="submit"
                                            disabled={!submitEnabled}
                                            aria-busy={busy}

                                            className="
                                                inline-flex min-h-11
                                                min-w-[125px] flex-1

                                                items-center justify-center
                                                gap-2 rounded-xl

                                                border border-cyan-600
                                                bg-cyan-600

                                                px-3 py-2.5
                                                text-xs font-black
                                                text-white

                                                transition-colors
                                                hover:bg-cyan-700

                                                focus-visible:outline-none
                                                focus-visible:ring-2
                                                focus-visible:ring-cyan-500
                                                focus-visible:ring-offset-2

                                                disabled:cursor-not-allowed
                                                disabled:opacity-50

                                                lg:flex-none lg:px-5

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
                                                <Save
                                                    size={16}
                                                    aria-hidden="true"
                                                />
                                            )}

                                            {busy
                                                ? "Saqlanmoqda..."
                                                : "O‘zgarishlarni saqlash"}
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

export default React.memo(
    FeedbackEditModalShell
);
