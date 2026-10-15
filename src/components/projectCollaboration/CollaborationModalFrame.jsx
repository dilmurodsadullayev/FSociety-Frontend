
import React, {
    useEffect,
    useId,
    useRef,
} from "react";

import { createPortal } from "react-dom";

import { X } from "lucide-react";

// =========================================================
// FSOCIETY — COLLABORATION MODAL FRAME
//
// Shared modal used by:
// - JoinCollaborationModal
// - ManageCollaboratorsModal
//
// Features:
// - Dark / Light Mode
// - Responsive layout
// - React Portal
// - Escape to close
// - Backdrop click to close
// - Body scroll locking
// - Focus management
// - Focus trap
// - Restore previous focus on close
// - Prevent closing during mutation
// - Reduced motion support
//
// No Redux or API dependencies.
// =========================================================

// =========================================================
// FOCUSABLE ELEMENTS
// =========================================================

const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(", ");

// =========================================================
// GET FOCUSABLE ELEMENTS
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
        return (
            element.getClientRects().length > 0 &&
            element.getAttribute("aria-hidden") !== "true"
        );
    });
};

// =========================================================
// MAIN COMPONENT
// =========================================================

const CollaborationModalFrame = ({
    isOpen = false,

    title = "",
    subtitle = "",

    titleId,

    onClose,

    busy = false,
    wide = false,

    initialFocusRef,

    children,
}) => {
    // =====================================================
    // IDS
    // =====================================================

    const generatedId = useId();

    const headingId =
        titleId || `collaboration-modal-${generatedId}`;

    const descriptionId =
        `${headingId}-description`;

    // =====================================================
    // REFS
    // =====================================================

    const dialogRef = useRef(null);

    const onCloseRef = useRef(onClose);

    const busyRef = useRef(busy);

    // Keep event handlers updated without restarting
    // the scroll lock / focus effect.
    onCloseRef.current = onClose;
    busyRef.current = Boolean(busy);

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
    // MODAL EFFECTS
    // =====================================================

    useEffect(() => {
        if (
            !isOpen ||
            typeof document === "undefined"
        ) {
            return undefined;
        }

        // ================================================
        // SAVE PREVIOUS FOCUS / OVERFLOW
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

        const preferredFocus =
            initialFocusRef?.current;

        const focusableElements =
            getFocusableElements(dialog);

        const focusTarget =
            (
                preferredFocus &&
                !preferredFocus.disabled
            )
                ? preferredFocus
                : focusableElements[0] || dialog;

        focusTarget.focus();

        // ================================================
        // KEYBOARD HANDLER
        // ================================================

        const handleKeyDown = (event) => {
            // --------------------------------------------
            // ESCAPE
            // --------------------------------------------

            if (event.key === "Escape") {
                if (!busyRef.current) {
                    event.preventDefault();

                    if (
                        typeof onCloseRef.current ===
                        "function"
                    ) {
                        onCloseRef.current();
                    }
                }

                return;
            }

            // --------------------------------------------
            // TAB FOCUS TRAP
            // --------------------------------------------

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

            const focusIsOutside =
                !dialog.contains(active);

            if (focusIsOutside) {
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
        isOpen,
        initialFocusRef,
    ]);

    // =====================================================
    // HIDE WHEN CLOSED
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
                z-[1000]

                flex
                items-center
                justify-center

                overflow-y-auto

                bg-slate-950/70

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

                aria-labelledby={headingId}

                aria-describedby={
                    subtitle
                        ? descriptionId
                        : undefined
                }

                aria-busy={Boolean(busy)}

                tabIndex={-1}

                className={`
                    relative
                    isolate

                    flex
                    max-h-[calc(100dvh-24px)]
                    w-full
                    min-w-0

                    flex-col

                    overflow-hidden

                    rounded-[22px]
                    border
                    border-[#dce5f0]

                    bg-white

                    shadow-[0_30px_90px_rgba(15,23,42,0.25)]

                    outline-none

                    sm:max-h-[calc(100dvh-40px)]
                    sm:rounded-[26px]

                    dark:border-white/[0.10]
                    dark:bg-[#0d131d]

                    dark:shadow-[0_35px_100px_rgba(0,0,0,0.50)]

                    ${
                        wide
                            ? "max-w-2xl"
                            : "max-w-lg"
                    }
                `}
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
                        z-20

                        h-px

                        bg-gradient-to-r
                        from-indigo-500/70
                        via-cyan-500/45
                        to-transparent

                        dark:from-indigo-400/55
                        dark:via-cyan-400/25
                    "
                />

                {/* ==================================
                    HEADER
                ================================== */}

                <div
                    className="
                        relative
                        z-10

                        flex
                        min-w-0
                        shrink-0

                        items-start
                        justify-between
                        gap-4

                        border-b
                        border-[#e7ebf2]

                        bg-[#f8faff]/80

                        px-4
                        py-4

                        sm:px-6
                        sm:py-5

                        dark:border-white/[0.08]
                        dark:bg-black/[0.12]
                    "
                >
                    {/* TITLE */}

                    <div className="min-w-0 flex-1">
                        <h3
                            id={headingId}

                            className="
                                break-words

                                text-[17px]
                                font-black
                                leading-snug
                                tracking-tight

                                text-slate-900

                                sm:text-xl

                                dark:text-white
                            "
                        >
                            {title}
                        </h3>

                        {/* SUBTITLE */}

                        {subtitle && (
                            <p
                                id={descriptionId}

                                className="
                                    mt-1.5

                                    break-words

                                    text-[12px]
                                    font-medium
                                    leading-5

                                    text-slate-500

                                    dark:text-gray-400
                                "
                            >
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* CLOSE BUTTON */}

                    <button
                        type="button"

                        onClick={handleClose}

                        disabled={
                            busy ||
                            typeof onClose !== "function"
                        }

                        aria-label="Oynani yopish"

                        title="Yopish"

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
                            duration-150

                            hover:border-indigo-400/35
                            hover:bg-indigo-500/[0.06]
                            hover:text-indigo-700

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-indigo-500

                            disabled:cursor-not-allowed
                            disabled:opacity-40

                            dark:border-white/[0.08]
                            dark:bg-white/[0.04]
                            dark:text-gray-400

                            dark:hover:border-indigo-400/25
                            dark:hover:bg-indigo-400/[0.07]
                            dark:hover:text-indigo-300
                        "
                    >
                        <X
                            size={17}
                            strokeWidth={2}
                            aria-hidden="true"
                        />
                    </button>
                </div>

                {/* ==================================
                    MODAL CONTENT
                ================================== */}

                <div
                    className="
                        relative
                        z-10

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
                    {children}
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
    CollaborationModalFrame
);
