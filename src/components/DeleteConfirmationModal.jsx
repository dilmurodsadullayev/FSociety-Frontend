
import React, {
    useCallback,
    useEffect,
    useId,
    useRef,
    useState,
} from "react";

import { createPortal } from "react-dom";

import {
    AlertTriangle,
    Loader2,
    ShieldAlert,
    Trash2,
    X,
} from "lucide-react";

// =========================================================
// FSOCIETY — RESPONSIVE DELETE CONFIRMATION MODAL
//
// Features:
// - Mobile / Tablet / Desktop
// - Short landscape screens
// - Dark / Light Mode
// - Scrollable content
// - Always-visible action buttons
// - Accessible alertdialog
// - Focus trap / Escape
// - Body scroll lock
// - Duplicate confirmation protection
//
// Existing props preserved.
// =========================================================

const FOCUSABLE_SELECTOR = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
].join(", ");

// =========================================================
// FOCUSABLE ELEMENTS
// =========================================================

const getFocusableElements = (dialog) => {
    if (!dialog) {
        return [];
    }

    return Array.from(
        dialog.querySelectorAll(FOCUSABLE_SELECTOR)
    ).filter(
        (element) =>
            element.getClientRects().length > 0 &&
            element.getAttribute("aria-hidden") !== "true"
    );
};

// =========================================================
// MAIN COMPONENT
// =========================================================

const DeleteConfirmationModal = ({
    isOpen = false,

    onClose,
    onConfirm,

    itemTitle = "ushbu elementni",

    isProcessing = false,
}) => {
    // =====================================================
    // IDS
    // =====================================================

    const id = useId();

    const titleId = `${id}-delete-title`;

    const descriptionId =
        `${id}-delete-description`;

    const warningId =
        `${id}-delete-warning`;

    // =====================================================
    // REFS
    // =====================================================

    const dialogRef = useRef(null);

    const cancelRef = useRef(null);

    const closeCallbackRef = useRef(onClose);

    const confirmCallbackRef = useRef(onConfirm);

    const confirmingRef = useRef(false);

    const busyRef = useRef(false);

    const mountedRef = useRef(false);

    // =====================================================
    // STATE
    // =====================================================

    const [
        localProcessing,
        setLocalProcessing,
    ] = useState(false);

    // =====================================================
    // DERIVED STATE
    // =====================================================

    const busy = Boolean(
        isProcessing || localProcessing
    );

    const canClose =
        !busy &&
        typeof onClose === "function";

    const canConfirm =
        !busy &&
        typeof onConfirm === "function";

    const safeTitle =
        String(
            itemTitle ?? "ushbu elementni"
        ).trim() || "ushbu elementni";

    // =====================================================
    // CALLBACK REFS
    // =====================================================

    closeCallbackRef.current = onClose;

    confirmCallbackRef.current = onConfirm;

    busyRef.current =
        busy || confirmingRef.current;

    // =====================================================
    // MOUNT STATE
    // =====================================================

    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;
        };
    }, []);

    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const handleClose = useCallback(() => {
        if (
            busyRef.current ||
            typeof closeCallbackRef.current !==
                "function"
        ) {
            return;
        }

        closeCallbackRef.current();
    }, []);

    // =====================================================
    // CONFIRM DELETE
    // =====================================================

    const handleConfirm = useCallback(async () => {
        if (
            busyRef.current ||
            confirmingRef.current ||
            typeof confirmCallbackRef.current !==
                "function"
        ) {
            return;
        }

        // Lock immediately, before parent state updates.
        confirmingRef.current = true;
        busyRef.current = true;

        setLocalProcessing(true);

        try {
            await confirmCallbackRef.current();
        } catch (error) {
            // API errors are handled by the caller.
            console.error(
                "Delete confirmation error:",
                error
            );
        } finally {
            confirmingRef.current = false;

            if (mountedRef.current) {
                setLocalProcessing(false);
            }
        }
    }, []);

    // =====================================================
    // SCROLL LOCK / KEYBOARD / FOCUS
    // =====================================================

    useEffect(() => {
        if (
            !isOpen ||
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

        // Focus the safe action first.
        if (
            cancelRef.current &&
            !cancelRef.current.disabled
        ) {
            cancelRef.current.focus();
        } else {
            dialog?.focus();
        }

        // ================================================
        // KEYBOARD HANDLER
        // ================================================

        const handleKeyDown = (event) => {
            // ESCAPE

            if (event.key === "Escape") {
                if (!busyRef.current) {
                    event.preventDefault();
                    handleClose();
                }

                return;
            }

            // TAB FOCUS TRAP

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

            } else if (
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
                typeof previousFocus.focus ===
                    "function" &&
                document.contains(previousFocus)
            ) {
                previousFocus.focus();
            }
        };
    }, [
        isOpen,
        handleClose,
    ]);

    // =====================================================
    // CLOSED
    // =====================================================

    if (
        !isOpen ||
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
                z-[1200]

                flex
                items-center
                justify-center

                overflow-hidden

                bg-slate-950/70

                px-3
                py-3

                backdrop-blur-sm

                sm:px-5
                sm:py-5

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
                RESPONSIVE MODAL
            ====================================== */}

            <div
                ref={dialogRef}

                role="alertdialog"

                aria-modal="true"

                aria-labelledby={titleId}

                aria-describedby={
                    `${descriptionId} ${warningId}`
                }

                aria-busy={busy}

                tabIndex={-1}

                className="
                    relative
                    isolate

                    flex
                    w-full
                    max-w-md
                    min-h-0
                    min-w-0

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

                    dark:border-white/10
                    dark:bg-[#0b1018]

                    dark:shadow-[0_35px_110px_rgba(0,0,0,0.65)]
                "
            >
                {/* ==================================
                    HEADER — ALWAYS VISIBLE
                ================================== */}

                <div
                    className="
                        relative
                        z-10

                        flex
                        shrink-0

                        items-center
                        justify-between
                        gap-3

                        border-b
                        border-slate-200

                        bg-slate-50/80

                        px-4
                        py-3

                        sm:px-6
                        sm:py-4

                        dark:border-white/[0.08]
                        dark:bg-black/10
                    "
                >
                    <span
                        className="
                            inline-flex
                            min-w-0

                            items-center
                            gap-2

                            text-[10px]
                            font-black
                            uppercase
                            tracking-[0.09em]

                            text-red-700

                            sm:text-xs

                            dark:text-red-300
                        "
                    >
                        <ShieldAlert
                            size={16}
                            aria-hidden="true"
                            className="shrink-0"
                        />

                        O‘chirishni tasdiqlash
                    </span>

                    {/* CLOSE */}

                    <button
                        type="button"

                        onClick={handleClose}

                        disabled={!canClose}

                        aria-label="Modalni yopish"

                        className="
                            grid
                            h-9
                            w-9
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
                            focus-visible:ring-red-500

                            disabled:cursor-not-allowed
                            disabled:opacity-40

                            dark:border-white/10
                            dark:bg-white/[0.04]
                            dark:text-gray-400

                            dark:hover:bg-white/[0.08]
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
                    SCROLLABLE CONTENT

                    On short mobile screens, only
                    this section scrolls.
                ================================== */}

                <div
                    className="
                        relative
                        z-10

                        min-h-0
                        flex-1

                        overflow-x-hidden
                        overflow-y-auto

                        overscroll-contain

                        px-4
                        py-4

                        sm:px-7
                        sm:py-6
                    "
                >
                    {/* BACKGROUND GLOW */}

                    <div
                        aria-hidden="true"

                        className="
                            pointer-events-none

                            absolute
                            -right-16
                            -top-16

                            h-40
                            w-40

                            rounded-full

                            bg-red-500/[0.06]

                            blur-[70px]

                            dark:bg-red-500/[0.09]
                        "
                    />

                    {/* ==============================
                        DELETE ICON
                    ============================== */}

                    <div
                        className="
                            relative
                            mx-auto

                            grid
                            h-14
                            w-14

                            place-items-center

                            rounded-2xl
                            border
                            border-red-200

                            bg-red-50

                            text-red-600

                            sm:h-16
                            sm:w-16

                            dark:border-red-400/20
                            dark:bg-red-500/[0.09]
                            dark:text-red-300
                        "
                    >
                        {busy ? (
                            <Loader2
                                size={25}
                                aria-hidden="true"

                                className="
                                    animate-spin
                                    motion-reduce:animate-none
                                "
                            />
                        ) : (
                            <Trash2
                                size={25}
                                aria-hidden="true"
                            />
                        )}
                    </div>

                    {/* ==============================
                        TITLE
                    ============================== */}

                    <h2
                        id={titleId}

                        className="
                            mt-4

                            break-words

                            text-center
                            text-lg
                            font-black
                            leading-snug
                            tracking-tight

                            text-slate-900

                            sm:mt-5
                            sm:text-2xl

                            dark:text-white
                        "
                    >
                        {busy
                            ? "O‘chirilmoqda..."
                            : "O‘chirishni tasdiqlaysizmi?"}
                    </h2>

                    {/* ==============================
                        DESCRIPTION
                    ============================== */}

                    <p
                        id={descriptionId}

                        className="
                            mx-auto
                            mt-2

                            max-w-sm

                            break-words
                            [overflow-wrap:anywhere]

                            text-center
                            text-xs
                            font-medium
                            leading-6

                            text-slate-600

                            sm:mt-3
                            sm:text-sm

                            dark:text-gray-400
                        "
                    >
                        Haqiqatan ham{" "}

                        <strong
                            className="
                                font-black
                                text-slate-900

                                dark:text-gray-100
                            "
                        >
                            “{safeTitle}”
                        </strong>

                        {" "}ni o‘chirmoqchimisiz?
                    </p>

                    {/* ==============================
                        WARNING BOX
                    ============================== */}

                    <div
                        id={warningId}

                        className="
                            mt-4

                            flex
                            min-w-0

                            items-start
                            gap-2.5

                            rounded-2xl
                            border
                            border-red-200

                            bg-red-50/80

                            p-3

                            sm:mt-5
                            sm:gap-3
                            sm:p-4

                            dark:border-red-400/20
                            dark:bg-red-500/[0.055]
                        "
                    >
                        {/* ICON */}

                        <div
                            className="
                                grid
                                h-8
                                w-8
                                shrink-0

                                place-items-center

                                rounded-lg
                                border
                                border-red-200

                                bg-red-100/70

                                text-red-700

                                dark:border-red-400/20
                                dark:bg-red-500/[0.09]
                                dark:text-red-300
                            "
                        >
                            <AlertTriangle
                                size={16}
                                aria-hidden="true"
                            />
                        </div>

                        {/* TEXT */}

                        <div className="min-w-0 flex-1">
                            <p
                                className="
                                    text-[10px]
                                    font-black
                                    uppercase
                                    tracking-wider

                                    text-red-700

                                    dark:text-red-300
                                "
                            >
                                Diqqat
                            </p>

                            <p
                                className="
                                    mt-1

                                    break-words

                                    text-[11px]
                                    font-medium
                                    leading-5

                                    text-red-800

                                    dark:text-red-200/80
                                "
                            >
                                Bu amalni keyinchalik
                                bekor qilib bo‘lmaydi.
                                O‘chirilgan ma’lumotni
                                qayta tiklash imkoni
                                bo‘lmasligi mumkin.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ==================================
                    ACTION FOOTER — ALWAYS VISIBLE

                    Very narrow screens:
                    Buttons automatically stack.

                    Wider screens:
                    Buttons sit side by side.
                ================================== */}

                <div
                    className="
                        relative
                        z-10
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

                            gap-2.5
                        "
                    >
                        {/* CANCEL */}

                        <button
                            ref={cancelRef}

                            type="button"

                            onClick={handleClose}

                            disabled={!canClose}

                            className="
                                inline-flex

                                min-h-11
                                min-w-[130px]
                                flex-1

                                items-center
                                justify-center
                                gap-1.5

                                rounded-xl
                                border
                                border-slate-200

                                bg-white

                                px-3
                                py-2.5

                                text-xs
                                font-black

                                text-slate-700

                                transition-colors

                                hover:bg-slate-50

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-indigo-500

                                disabled:cursor-not-allowed
                                disabled:opacity-40

                                dark:border-white/10
                                dark:bg-white/[0.04]
                                dark:text-gray-300

                                dark:hover:bg-white/[0.08]
                            "
                        >
                            <X
                                size={15}
                                aria-hidden="true"
                                className="shrink-0"
                            />

                            Bekor qilish
                        </button>

                        {/* CONFIRM DELETE */}

                        <button
                            type="button"

                            onClick={handleConfirm}

                            disabled={!canConfirm}

                            aria-busy={busy}

                            className="
                                inline-flex

                                min-h-11
                                min-w-[130px]
                                flex-1

                                items-center
                                justify-center
                                gap-1.5

                                rounded-xl
                                border
                                border-red-600

                                bg-red-600

                                px-3
                                py-2.5

                                text-xs
                                font-black

                                text-white

                                transition-colors

                                hover:bg-red-700

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-red-500
                                focus-visible:ring-offset-2

                                disabled:cursor-not-allowed
                                disabled:opacity-50

                                dark:focus-visible:ring-offset-[#0b1018]
                            "
                        >
                            {busy ? (
                                <Loader2
                                    size={15}
                                    aria-hidden="true"

                                    className="
                                        animate-spin
                                        motion-reduce:animate-none
                                    "
                                />
                            ) : (
                                <Trash2
                                    size={15}
                                    aria-hidden="true"
                                />
                            )}

                            {busy
                                ? "O‘chirilmoqda..."
                                : "Ha, o‘chirish"}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(
    DeleteConfirmationModal
);
