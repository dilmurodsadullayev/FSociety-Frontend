
import React, {
    memo,
    useEffect,
    useId,
    useRef,
} from "react";

import { createPortal } from "react-dom";

import {
    AlertTriangle,
    Check,
    CheckCircle2,
    Loader2,
    ShieldCheck,
    X,
} from "lucide-react";

// =========================================================
// FSOCIETY — ACCEPT SOLUTION MODAL
//
// Responsibilities:
// - Confirm accepted solution
// - Show processing state
// - Prevent closing while processing
// - Handle Escape / backdrop
// - Lock body scrolling
// - Trap keyboard focus
// - Restore previous focus
//
// Existing props preserved:
// - isOpen
// - onClose
// - onConfirm
// - isProcessing
//
// No direct API requests.
// =========================================================

// =========================================================
// CONSTANTS
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
// MAIN MODAL
// =========================================================

const AcceptSolutionModal = ({
    isOpen = false,
    onClose,
    onConfirm,
    isProcessing = false,
}) => {
    // =====================================================
    // ACCESSIBILITY IDS
    // =====================================================

    const titleId = useId();
    const descriptionId = useId();

    // =====================================================
    // REFS
    // =====================================================

    const dialogRef = useRef(null);
    const closeButtonRef = useRef(null);

    const onCloseRef = useRef(onClose);
    const processingRef = useRef(isProcessing);

    const confirmLockRef = useRef(false);
    const unlockTimerRef = useRef(null);

    // =====================================================
    // LATEST VALUES
    //
    // Avoid reopening the focus effect whenever a
    // callback identity or processing status changes.
    // =====================================================

    onCloseRef.current = onClose;
    processingRef.current = isProcessing;

    // =====================================================
    // RESET CONFIRM LOCK
    // =====================================================

    useEffect(() => {
        if (!isOpen || !isProcessing) {
            confirmLockRef.current = false;
        }
    }, [isOpen, isProcessing]);

    // =====================================================
    // MODAL LIFECYCLE
    //
    // - Save previous focus
    // - Lock body scroll
    // - Move focus inside dialog
    // - Handle Escape
    // - Trap Tab / Shift+Tab
    // - Restore focus when closed
    // =====================================================

    useEffect(() => {
        if (
            !isOpen ||
            typeof document === "undefined"
        ) {
            return undefined;
        }

        const previousActiveElement =
            document.activeElement;

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        // ================================================
        // INITIAL FOCUS
        // ================================================

        const focusFrame = window.requestAnimationFrame(
            () => {
                if (
                    closeButtonRef.current &&
                    !closeButtonRef.current.disabled
                ) {
                    closeButtonRef.current.focus();
                } else {
                    dialogRef.current?.focus();
                }
            }
        );

        // ================================================
        // KEYBOARD HANDLER
        // ================================================

        const handleKeyDown = (event) => {
            // ============================================
            // ESCAPE
            // ============================================

            if (event.key === "Escape") {
                if (processingRef.current) {
                    event.preventDefault();
                    return;
                }

                if (
                    typeof onCloseRef.current ===
                    "function"
                ) {
                    event.preventDefault();
                    onCloseRef.current();
                }

                return;
            }

            // ============================================
            // TAB FOCUS TRAP
            // ============================================

            if (event.key !== "Tab") {
                return;
            }

            const dialog = dialogRef.current;

            if (!dialog) {
                return;
            }

            const focusableElements =
                Array.from(
                    dialog.querySelectorAll(
                        FOCUSABLE_SELECTOR
                    )
                ).filter((element) => {
                    return (
                        !element.disabled &&
                        element.getClientRects()
                            .length > 0
                    );
                });

            // No enabled buttons, such as during
            // a processing state.
            if (focusableElements.length === 0) {
                event.preventDefault();
                dialog.focus();
                return;
            }

            const first =
                focusableElements[0];

            const last =
                focusableElements[
                    focusableElements.length - 1
                ];

            const active =
                document.activeElement;

            // Focus currently outside dialog.
            if (!dialog.contains(active)) {
                event.preventDefault();

                if (event.shiftKey) {
                    last.focus();
                } else {
                    first.focus();
                }

                return;
            }

            // Shift + Tab from first.
            if (
                event.shiftKey &&
                (
                    active === first ||
                    active === dialog
                )
            ) {
                event.preventDefault();
                last.focus();
                return;
            }

            // Tab from last.
            if (
                !event.shiftKey &&
                (
                    active === last ||
                    active === dialog
                )
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
            window.cancelAnimationFrame(
                focusFrame
            );

            document.removeEventListener(
                "keydown",
                handleKeyDown
            );

            document.body.style.overflow =
                previousOverflow;

            if (unlockTimerRef.current !== null) {
                window.clearTimeout(
                    unlockTimerRef.current
                );

                unlockTimerRef.current = null;
            }

            confirmLockRef.current = false;

            // Restore focus to the control
            // that opened the modal.
            if (
                previousActiveElement &&
                typeof previousActiveElement.focus ===
                    "function" &&
                previousActiveElement.isConnected
            ) {
                previousActiveElement.focus();
            }
        };
    }, [isOpen]);

    // =====================================================
    // SAFE CLOSE
    // =====================================================

    const handleClose = () => {
        if (
            isProcessing ||
            typeof onClose !== "function"
        ) {
            return;
        }

        onClose();
    };

    // =====================================================
    // BACKDROP CLOSE
    //
    // Only close when the backdrop itself
    // receives the mouse down event.
    // =====================================================

    const handleBackdropMouseDown = (event) => {
        if (
            event.target !== event.currentTarget ||
            isProcessing
        ) {
            return;
        }

        handleClose();
    };

    // =====================================================
    // CONFIRM
    //
    // Immediate lock guards against rapid repeated
    // clicks before React updates isProcessing.
    // =====================================================

    const handleConfirm = () => {
        if (
            isProcessing ||
            confirmLockRef.current ||
            typeof onConfirm !== "function"
        ) {
            return;
        }

        confirmLockRef.current = true;

        try {
            onConfirm();
        } catch (error) {
            confirmLockRef.current = false;
            throw error;
        }

        // This short lock complements the parent
        // isProcessing state. The parent remains
        // responsible for the actual API lifecycle.
        if (unlockTimerRef.current !== null) {
            window.clearTimeout(
                unlockTimerRef.current
            );
        }

        unlockTimerRef.current =
            window.setTimeout(() => {
                confirmLockRef.current = false;
                unlockTimerRef.current = null;
            }, 600);
    };

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
    // DIALOG UI
    // =====================================================

    const modal = (
        <div
            onMouseDown={handleBackdropMouseDown}
            className="
                fixed
                inset-0
                z-[120]

                flex
                items-center
                justify-center

                overflow-y-auto

                bg-slate-950/65

                p-3

                backdrop-blur-sm

                sm:p-5

                dark:bg-black/80
                dark:backdrop-blur-md
            "
        >
            {/* ======================================
                BACKGROUND GLOW
            ====================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none

                    fixed
                    left-1/2
                    top-1/2

                    h-[360px]
                    w-[360px]
                    max-w-full

                    -translate-x-1/2
                    -translate-y-1/2

                    rounded-full

                    bg-emerald-500/[0.10]

                    blur-[110px]
                "
            />

            {/* ======================================
                DIALOG
            ====================================== */}

            <div
                ref={dialogRef}

                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                aria-busy={isProcessing}

                tabIndex={-1}

                onMouseDown={(event) => {
                    event.stopPropagation();
                }}

                className="
                    relative

                    my-auto

                    w-full
                    max-w-md

                    min-w-0
                    max-h-[calc(100dvh-1.5rem)]

                    overflow-y-auto
                    overscroll-contain

                    rounded-[24px]
                    border
                    border-slate-200

                    bg-white

                    shadow-[0_30px_100px_rgba(15,23,42,0.25)]

                    outline-none

                    sm:rounded-[28px]

                    dark:border-white/[0.10]
                    dark:bg-[#0b1018]

                    dark:shadow-[0_35px_110px_rgba(0,0,0,0.65)]
                "
            >
                {/* ==================================
                    TOP ACCENT
                ================================== */}

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none

                        absolute
                        inset-x-0
                        top-0

                        h-[2px]

                        bg-gradient-to-r
                        from-emerald-500
                        via-cyan-500/70
                        to-transparent
                    "
                />

                {/* ==================================
                    DIALOG GLOW
                ================================== */}

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none

                        absolute
                        -right-24
                        -top-24

                        h-56
                        w-56

                        rounded-full

                        bg-emerald-500/[0.07]

                        blur-[90px]

                        dark:bg-emerald-500/[0.10]
                    "
                />

                {/* ==================================
                    CLOSE BUTTON
                ================================== */}

                <button
                    ref={closeButtonRef}

                    type="button"
                    onClick={handleClose}

                    disabled={
                        isProcessing ||
                        typeof onClose !== "function"
                    }

                    aria-label="Modalni yopish"

                    className="
                        absolute
                        right-3
                        top-3
                        z-20

                        grid
                        h-10
                        w-10

                        place-items-center

                        rounded-xl
                        border
                        border-slate-200

                        bg-white/85

                        text-slate-500

                        transition-colors

                        hover:bg-slate-100
                        hover:text-slate-900

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-emerald-500

                        disabled:cursor-not-allowed
                        disabled:opacity-40

                        sm:right-4
                        sm:top-4

                        dark:border-white/[0.09]
                        dark:bg-white/[0.045]
                        dark:text-gray-400

                        dark:hover:bg-white/[0.08]
                        dark:hover:text-white
                    "
                >
                    <X
                        size={17}
                        strokeWidth={1.9}
                        aria-hidden="true"
                    />
                </button>

                {/* ==================================
                    CONTENT
                ================================== */}

                <div
                    className="
                        relative
                        z-10

                        px-4
                        pb-5
                        pt-10

                        sm:px-7
                        sm:pb-7
                        sm:pt-9
                    "
                >
                    {/* ==============================
                        ICON
                    ============================== */}

                    <div
                        className="
                            relative

                            mx-auto

                            grid
                            h-16
                            w-16

                            place-items-center

                            rounded-[20px]
                            border
                            border-emerald-300

                            bg-emerald-50

                            text-emerald-700

                            dark:border-emerald-400/20
                            dark:bg-emerald-400/[0.08]
                            dark:text-emerald-300
                        "
                    >
                        <div
                            aria-hidden="true"
                            className="
                                absolute
                                inset-3

                                rounded-xl

                                bg-emerald-400/[0.12]

                                blur-xl
                            "
                        />

                        {isProcessing ? (
                            <Loader2
                                size={26}
                                aria-hidden="true"
                                className="
                                    relative
                                    z-10

                                    animate-spin
                                    motion-reduce:animate-none
                                "
                            />
                        ) : (
                            <CheckCircle2
                                size={27}
                                strokeWidth={1.8}
                                aria-hidden="true"
                                className="
                                    relative
                                    z-10
                                "
                            />
                        )}
                    </div>

                    {/* ==============================
                        TITLE / DESCRIPTION
                    ============================== */}

                    <div
                        className="
                            mt-5
                            text-center
                        "
                    >
                        {/* SYSTEM BADGE */}

                        <div
                            className="
                                mb-3

                                inline-flex
                                items-center
                                gap-1.5

                                rounded-full
                                border
                                border-emerald-300/70

                                bg-emerald-50

                                px-3
                                py-1.5

                                font-mono
                                text-[9px]
                                font-black
                                uppercase
                                tracking-[0.12em]

                                text-emerald-800

                                dark:border-emerald-400/15
                                dark:bg-emerald-400/[0.055]
                                dark:text-emerald-300
                            "
                        >
                            <ShieldCheck
                                size={13}
                                aria-hidden="true"
                            />

                            Accept solution
                        </div>

                        {/* TITLE */}

                        <h3
                            id={titleId}
                            className="
                                break-words

                                font-display
                                text-xl
                                font-black
                                tracking-tight

                                text-slate-900

                                sm:text-2xl

                                dark:text-white
                            "
                        >
                            {isProcessing
                                ? "Yechim qabul qilinmoqda..."
                                : "Yechimni qabul qilasizmi?"}
                        </h3>

                        {/* DESCRIPTION */}

                        <p
                            id={descriptionId}
                            className="
                                mx-auto
                                mt-3
                                max-w-sm

                                text-[13px]
                                font-medium
                                leading-6

                                text-slate-600

                                sm:text-sm

                                dark:text-gray-400
                            "
                        >
                            Ushbu javob muammoning{" "}
                            <strong
                                className="
                                    font-black

                                    text-emerald-700

                                    dark:text-emerald-300
                                "
                            >
                                to‘g‘ri yechimi
                            </strong>
                            {" "}sifatida belgilanadi.
                        </p>
                    </div>

                    {/* ==============================
                        WARNING
                    ============================== */}

                    <div
                        className="
                            mt-5

                            flex
                            min-w-0

                            items-start
                            gap-3

                            rounded-2xl
                            border
                            border-amber-200

                            bg-amber-50

                            p-4

                            dark:border-amber-400/15
                            dark:bg-amber-400/[0.055]
                        "
                    >
                        <AlertTriangle
                            size={17}
                            strokeWidth={1.9}
                            aria-hidden="true"

                            className="
                                mt-0.5
                                shrink-0

                                text-amber-700

                                dark:text-amber-300
                            "
                        />

                        <p
                            className="
                                min-w-0

                                text-xs
                                font-medium
                                leading-5

                                text-amber-900

                                dark:text-amber-100/85
                            "
                        >
                            Muammo yechilgan deb
                            belgilangandan keyin yangi
                            yechim yuborish yopiladi.
                        </p>
                    </div>

                    {/* ==============================
                        ACTIONS
                    ============================== */}

                    <div
                        className="
                            mt-6

                            grid
                            grid-cols-1
                            gap-3

                            sm:grid-cols-2
                        "
                    >
                        {/* CANCEL */}

                        <button
                            type="button"

                            onClick={handleClose}

                            disabled={
                                isProcessing ||
                                typeof onClose !==
                                    "function"
                            }

                            className="
                                inline-flex
                                min-h-11

                                items-center
                                justify-center
                                gap-2

                                rounded-xl
                                border
                                border-slate-200

                                bg-slate-50

                                px-4
                                py-2.5

                                font-display
                                text-xs
                                font-black

                                text-slate-700

                                transition-colors

                                hover:bg-slate-100
                                hover:text-slate-900

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-slate-400

                                disabled:cursor-not-allowed
                                disabled:opacity-40

                                dark:border-white/[0.10]
                                dark:bg-white/[0.04]
                                dark:text-gray-300

                                dark:hover:bg-white/[0.08]
                                dark:hover:text-white
                            "
                        >
                            <X
                                size={16}
                                aria-hidden="true"
                            />

                            Bekor qilish
                        </button>

                        {/* CONFIRM */}

                        <button
                            type="button"

                            onClick={handleConfirm}

                            disabled={
                                isProcessing ||
                                typeof onConfirm !==
                                    "function"
                            }

                            aria-busy={isProcessing}

                            className="
                                inline-flex
                                min-h-11

                                items-center
                                justify-center
                                gap-2

                                rounded-xl
                                border
                                border-emerald-600

                                bg-emerald-600

                                px-4
                                py-2.5

                                font-display
                                text-xs
                                font-black

                                text-white

                                shadow-lg
                                shadow-emerald-600/15

                                transition-colors

                                hover:border-emerald-700
                                hover:bg-emerald-700

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-emerald-500

                                active:scale-[0.98]

                                disabled:cursor-not-allowed
                                disabled:opacity-50

                                dark:border-emerald-500/40
                                dark:bg-emerald-600

                                dark:hover:bg-emerald-500

                                motion-reduce:transform-none
                            "
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2
                                        size={16}
                                        aria-hidden="true"
                                        className="
                                            animate-spin
                                            motion-reduce:animate-none
                                        "
                                    />

                                    Qabul qilinmoqda...
                                </>
                            ) : (
                                <>
                                    <Check
                                        size={16}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />

                                    Ha, qabul qilish
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(
        modal,
        document.body
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(AcceptSolutionModal);
