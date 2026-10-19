
// src/components/profile/roadmap/RoadmapCreateModal.jsx

import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import { createPortal } from "react-dom";

import { AlertTriangle } from "lucide-react";

import { siteToast } from "../../ui/AuthToast";

// =========================================================
// MODAL COMPONENTS
// =========================================================

import RoadmapCreateHeader from "./create/RoadmapCreateHeader";

import RoadmapCreateTypeSelector from "./create/RoadmapCreateTypeSelector";

import RoadmapCreateFields from "./create/RoadmapCreateFields";

import RoadmapCreatePreview from "./create/RoadmapCreatePreview";

import RoadmapCreateFooter from "./create/RoadmapCreateFooter";

// =========================================================
// CONSTANTS
// =========================================================

const EMPTY_FORM = {
    title: "",
    type: "learning",
    description: "",
    started_at: "",
    finished_at: "",
};

const VALID_ROADMAP_TYPES = [
    "learning",
    "experience",
];

const TITLE_MIN_LENGTH = 2;
const TITLE_MAX_LENGTH = 255;

const DESCRIPTION_MAX_LENGTH = 3000;

const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(", ");

// =========================================================
// DATE FORMAT
//
// Backend examples:
// 2026-10-18
// 2026-10-18T10:30:00Z
//
// HTML date input expects YYYY-MM-DD.
// =========================================================

const formatDateForInput = (value) => {
    if (!value) {
        return "";
    }

    return String(value).slice(0, 10);
};

// =========================================================
// INITIAL FORM NORMALIZER
//
// Create: empty form.
// Edit: existing roadmap fields.
//
// Backend field names remain unchanged.
// =========================================================

const getInitialFormData = (initialData) => {
    if (!initialData) {
        return {
            ...EMPTY_FORM,
        };
    }

    return {
        title:
            initialData.title || "",

        type:
            initialData.type || "learning",

        description:
            initialData.description || "",

        started_at: formatDateForInput(
            initialData.started_at
        ),

        finished_at: formatDateForInput(
            initialData.finished_at
        ),
    };
};

// =========================================================
// BACKEND ERROR LABELS
// =========================================================

const ERROR_FIELD_LABELS = {
    title: "Sarlavha",
    type: "Roadmap turi",
    description: "Tavsif",
    started_at: "Boshlanish sanasi",
    finished_at: "Tugash sanasi",
    non_field_errors: "Xatolik",
};

// =========================================================
// PARSE BACKEND ERROR DATA
//
// Supports:
// - Strings
// - DRF field errors
// - Arrays
// - detail / message / error
// - Nested validation errors
//
// Prevents [object Object] in UI.
// =========================================================

const parseErrorData = (
    data,
    depth = 0
) => {
    if (
        data == null ||
        depth > 5
    ) {
        return "";
    }

    // =====================================================
    // STRING
    // =====================================================

    if (typeof data === "string") {
        const text = data.trim();

        if (!text) {
            return "";
        }

        if (
            (
                text.startsWith("{") &&
                text.endsWith("}")
            ) ||
            (
                text.startsWith("[") &&
                text.endsWith("]")
            )
        ) {
            try {
                return parseErrorData(
                    JSON.parse(text),
                    depth + 1
                );
            } catch {
                return text;
            }
        }

        return text;
    }

    // =====================================================
    // NUMBER / BOOLEAN
    // =====================================================

    if (
        typeof data === "number" ||
        typeof data === "boolean"
    ) {
        return String(data);
    }

    // =====================================================
    // ARRAY
    // =====================================================

    if (Array.isArray(data)) {
        return data
            .map((item) =>
                parseErrorData(
                    item,
                    depth + 1
                )
            )
            .filter(Boolean)
            .join("; ");
    }

    // =====================================================
    // OBJECT
    // =====================================================

    if (typeof data === "object") {
        for (const key of [
            "detail",
            "non_field_errors",
            "message",
            "error",
        ]) {
            if (data[key]) {
                const message =
                    parseErrorData(
                        data[key],
                        depth + 1
                    );

                if (message) {
                    return message;
                }
            }
        }

        return Object.entries(data)
            .filter(
                ([key]) =>
                    ![
                        "request",
                        "response",
                        "config",
                        "stack",
                    ].includes(key)
            )
            .map(([field, value]) => {
                const message =
                    parseErrorData(
                        value,
                        depth + 1
                    );

                if (!message) {
                    return "";
                }

                const label =
                    ERROR_FIELD_LABELS[field] ||
                    field;

                return `${label}: ${message}`;
            })
            .filter(Boolean)
            .join("; ");
    }

    return "";
};

// =========================================================
// GET API ERROR MESSAGE
// =========================================================

const getErrorMessage = (
    error,
    fallback = "Roadmapni saqlashda xatolik yuz berdi."
) => {
    if (!error) {
        return fallback;
    }

    const serverData =
        error?.serverData ??
        error?.response?.data;

    return (
        parseErrorData(serverData) ||
        parseErrorData(error?.message) ||
        fallback
    );
};

// =========================================================
// VALIDATE ROADMAP FORM
//
// Existing rules:
//
// title:
// - Required
// - Minimum 2 characters
// - Maximum 255 characters
//
// type:
// - learning
// - experience
//
// started_at:
// - Required
//
// finished_at:
// - Optional
// - Cannot be earlier than started_at
//
// description:
// - Optional
// - Maximum 3000 characters
// =========================================================

const validateRoadmapForm = (formData) => {
    const title = String(
        formData?.title ?? ""
    ).trim();

    const description = String(
        formData?.description ?? ""
    ).trim();

    const type =
        formData?.type;

    const startedAt =
        formData?.started_at;

    const finishedAt =
        formData?.finished_at;

    // =====================================================
    // TITLE REQUIRED
    // =====================================================

    if (!title) {
        return "Roadmap sarlavhasini kiriting.";
    }

    // =====================================================
    // TITLE MINIMUM
    // =====================================================

    if (title.length < TITLE_MIN_LENGTH) {
        return (
            "Roadmap sarlavhasi kamida 2 ta belgidan " +
            "iborat bo‘lishi kerak."
        );
    }

    // =====================================================
    // TITLE MAXIMUM
    // =====================================================

    if (title.length > TITLE_MAX_LENGTH) {
        return (
            "Roadmap sarlavhasi 255 ta belgidan " +
            "oshmasligi kerak."
        );
    }

    // =====================================================
    // ROADMAP TYPE
    // =====================================================

    if (!VALID_ROADMAP_TYPES.includes(type)) {
        return "Roadmap turini to‘g‘ri tanlang.";
    }

    // =====================================================
    // START DATE
    // =====================================================

    if (!startedAt) {
        return "Roadmap boshlanish sanasini kiriting.";
    }

    // =====================================================
    // FINISH DATE
    // =====================================================

    if (
        finishedAt &&
        finishedAt < startedAt
    ) {
        return (
            "Tugash sanasi boshlanish sanasidan " +
            "oldin bo‘lishi mumkin emas."
        );
    }

    // =====================================================
    // DESCRIPTION MAXIMUM
    // =====================================================

    if (
        description.length >
        DESCRIPTION_MAX_LENGTH
    ) {
        return (
            "Roadmap tavsifi juda uzun. " +
            "Uni biroz qisqartiring."
        );
    }

    return null;
};

// =========================================================
// CREATE BACKEND PAYLOAD
//
// No frontend-only fields.
// Django API contract is unchanged.
// =========================================================

const buildRoadmapPayload = (formData) => {
    return {
        title:
            formData.title.trim(),

        type:
            formData.type,

        description:
            formData.description.trim(),

        started_at:
            formData.started_at,

        finished_at:
            formData.finished_at || null,
    };
};

// =========================================================
// ROADMAP CREATE / EDIT MODAL
//
// Parent usage:
//
// <RoadmapCreateModal
//     isOpen={isFormModalOpen}
//     onClose={handleCloseFormModal}
//     onSubmit={handleRoadmapSubmit}
//     initialData={editingRoadmap}
//     isSubmitting={isFormSubmitting}
// />
//
// Responsibilities:
// - Create/Edit initialization
// - Form state
// - Validation
// - Submission
// - Backend error handling
// - Toast notifications
// - Focus management
// - Escape and backdrop closing
// - Body scroll lock
// - Responsive layout
//
// API requests stay in ProfileRoadmap.jsx.
//
// RESPONSIVE:
//
// Mobile:
// - Full-screen modal
// - One column
// - Scrollable form content
// - Visible header/footer
//
// Tablet/Desktop:
// - Centered modal
// - Height capped at 780px
// - Preview on the right on large screens
//
// createPortal prevents navbar overlap.
// =========================================================

const RoadmapCreateModal = ({
    isOpen = false,
    onClose,
    onSubmit,
    initialData = null,
    isSubmitting = false,
}) => {
    // =====================================================
    // MODE
    // =====================================================

    const isEditMode =
        Boolean(initialData);

    const roadmapId =
        initialData?.id ?? null;

    // =====================================================
    // STATE
    // =====================================================

    const [
        formData,
        setFormData,
    ] = useState(() => ({
        ...EMPTY_FORM,
    }));

    const [
        error,
        setError,
    ] = useState("");

    const [
        isProcessing,
        setIsProcessing,
    ] = useState(false);

    // =====================================================
    // REFS
    // =====================================================

    const modalRef = useRef(null);

    const contentScrollRef = useRef(null);

    const initialDataRef = useRef(initialData);

    const previousFocusedElementRef = useRef(null);

    const submittingRef = useRef(false);

    const sessionRef = useRef(0);

    initialDataRef.current = initialData;

    // =====================================================
    // BUSY STATE
    // =====================================================

    const busy =
        Boolean(isSubmitting) ||
        isProcessing;

    // =====================================================
    // INITIALIZE FORM
    //
    // Reset when:
    // - Modal opens
    // - Edited roadmap ID changes
    //
    // Do not reset merely because the parent creates a
    // new initialData object on every render.
    // =====================================================

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        sessionRef.current += 1;

        setFormData(
            getInitialFormData(
                initialDataRef.current
            )
        );

        setError("");

        setIsProcessing(false);

        submittingRef.current = false;

        if (contentScrollRef.current) {
            contentScrollRef.current.scrollTop = 0;
        }

        return () => {
            sessionRef.current += 1;
        };
    }, [
        isOpen,
        roadmapId,
    ]);

    // =====================================================
    // BODY SCROLL LOCK
    //
    // The background page must not scroll.
    // Only the modal's content area scrolls.
    // =====================================================

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow =
            "hidden";

        return () => {
            document.body.style.overflow =
                previousOverflow;
        };
    }, [
        isOpen,
    ]);

    // =====================================================
    // CLOSE HANDLER
    //
    // Prevent closing during Create/Edit requests.
    // =====================================================

    const handleClose = useCallback(() => {
        if (
            busy ||
            submittingRef.current
        ) {
            return;
        }

        setError("");

        onClose?.();
    }, [
        busy,
        onClose,
    ]);

    // =====================================================
    // FOCUS MANAGEMENT
    //
    // Focus modal instead of an input to prevent mobile
    // keyboard from opening immediately.
    //
    // Restore focus to the previous element on closing.
    // =====================================================

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        previousFocusedElementRef.current =
            document.activeElement;

        const frameId =
            window.requestAnimationFrame(() => {
                modalRef.current?.focus({
                    preventScroll: true,
                });
            });

        return () => {
            window.cancelAnimationFrame(frameId);

            const previous =
                previousFocusedElementRef.current;

            if (
                previous?.isConnected &&
                typeof previous.focus === "function"
            ) {
                previous.focus({
                    preventScroll: true,
                });
            }
        };
    }, [
        isOpen,
    ]);

    // =====================================================
    // ESCAPE AND FOCUS TRAP
    //
    // Escape:
    // - Close when not submitting.
    //
    // Tab:
    // - Keep keyboard focus inside the modal.
    // =====================================================

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            // =============================================
            // ESCAPE
            // =============================================

            if (event.key === "Escape") {
                if (
                    !busy &&
                    !submittingRef.current
                ) {
                    event.preventDefault();
                    handleClose();
                }

                return;
            }

            // =============================================
            // TAB
            // =============================================

            if (
                event.key !== "Tab" ||
                !modalRef.current
            ) {
                return;
            }

            const focusable = Array.from(
                modalRef.current.querySelectorAll(
                    FOCUSABLE_SELECTOR
                )
            ).filter(
                (element) =>
                    element.getClientRects().length > 0 &&
                    element.getAttribute("aria-hidden") !== "true"
            );

            if (focusable.length === 0) {
                event.preventDefault();

                modalRef.current.focus();

                return;
            }

            const first = focusable[0];

            const last =
                focusable[focusable.length - 1];

            const active =
                document.activeElement;

            if (
                active === modalRef.current ||
                !modalRef.current.contains(active)
            ) {
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

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [
        isOpen,
        busy,
        handleClose,
    ]);

    // =====================================================
    // INPUT CHANGE
    //
    // Fields:
    // - title
    // - type
    // - description
    // - started_at
    // - finished_at
    // =====================================================

    const handleChange = (event) => {
        if (
            busy ||
            submittingRef.current
        ) {
            return;
        }

        const {
            name,
            value,
        } = event.target;

        if (
            !Object.prototype.hasOwnProperty.call(
                EMPTY_FORM,
                name
            )
        ) {
            return;
        }

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));

        if (error) {
            setError("");
        }
    };

    // =====================================================
    // ROADMAP TYPE CHANGE
    // =====================================================

    const handleTypeChange = (value) => {
        if (
            busy ||
            submittingRef.current ||
            !VALID_ROADMAP_TYPES.includes(value)
        ) {
            return;
        }

        setFormData((current) => ({
            ...current,
            type: value,
        }));

        if (error) {
            setError("");
        }
    };

    // =====================================================
    // BACKDROP CLOSE
    //
    // Only clicking the actual overlay closes the modal.
    // Clicking inside the form does not close it.
    // =====================================================

    const handleBackdropClick = (event) => {
        if (
            event.target !==
            event.currentTarget
        ) {
            return;
        }

        handleClose();
    };

    // =====================================================
    // SCROLL TO FORM TOP
    //
    // Show errors immediately after failed validation
    // or backend requests.
    // =====================================================

    const scrollToFormTop = useCallback(() => {
        if (!contentScrollRef.current) {
            return;
        }

        contentScrollRef.current.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, []);

    // =====================================================
    // SUBMIT
    //
    // 1. Prevent duplicate requests
    // 2. Validate fields
    // 3. Build Django payload
    // 4. Show loading toast
    // 5. Call parent onSubmit(payload)
    // 6. Handle success or error
    // 7. Close modal on success
    //
    // Parent API contract remains unchanged.
    // =====================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        // =================================================
        // SUBMISSION GUARD
        // =================================================

        if (
            busy ||
            submittingRef.current
        ) {
            return;
        }

        // =================================================
        // CALLBACK CHECK
        // =================================================

        if (
            typeof onSubmit !== "function"
        ) {
            const message =
                "Roadmapni saqlash funksiyasi mavjud emas.";

            setError(message);

            scrollToFormTop();

            return;
        }

        setError("");

        // =================================================
        // VALIDATION
        // =================================================

        const validationError =
            validateRoadmapForm(formData);

        if (validationError) {
            setError(validationError);

            siteToast.warning(
                validationError,
                {
                    title:
                        "Roadmap ma’lumotlarini tekshiring",
                    duration: 4000,
                }
            );

            scrollToFormTop();

            return;
        }

        // =================================================
        // BACKEND PAYLOAD
        // =================================================

        const payload =
            buildRoadmapPayload(formData);

        // =================================================
        // LOCK SUBMISSION
        // =================================================

        const currentSession =
            sessionRef.current;

        submittingRef.current = true;

        setIsProcessing(true);

        // =================================================
        // LOADING TOAST
        // =================================================

        let toastId = null;

        try {
            toastId = siteToast.loading(
                isEditMode
                    ? "Roadmapdagi o‘zgarishlar saqlanmoqda..."
                    : "Yangi roadmap yaratilmoqda...",
                {
                    title: isEditMode
                        ? "Roadmap yangilanmoqda"
                        : "Roadmap yaratilmoqda",
                }
            );

            // =============================================
            // PARENT HANDLES CREATE / UPDATE API
            // =============================================

            const result =
                await onSubmit(payload);

            // =============================================
            // IGNORE AN OUTDATED MODAL SESSION
            // =============================================

            if (
                sessionRef.current !==
                currentSession
            ) {
                if (
                    toastId !== null &&
                    toastId !== undefined
                ) {
                    siteToast.dismiss(toastId);
                }

                return;
            }

            // =============================================
            // PARENT EXPLICITLY RETURNED FALSE
            // =============================================

            if (result === false) {
                if (
                    toastId !== null &&
                    toastId !== undefined
                ) {
                    siteToast.dismiss(toastId);
                }

                return;
            }

            // =============================================
            // SUCCESS TOAST
            // =============================================

            siteToast.success(
                isEditMode
                    ? "Roadmap ma’lumotlari muvaffaqiyatli yangilandi."
                    : "Yangi roadmap profilingizga muvaffaqiyatli qo‘shildi.",
                {
                    id: toastId,

                    title: isEditMode
                        ? "Roadmap yangilandi"
                        : "Roadmap yaratildi",

                    duration: 3800,
                }
            );

            // =============================================
            // RESET CREATE FORM
            // =============================================

            if (!isEditMode) {
                setFormData({
                    ...EMPTY_FORM,
                });
            }

            setError("");

            // =============================================
            // CLOSE MODAL
            //
            // Call the parent directly after successful
            // submission. Do not use handleClose here
            // because the request is still marked busy.
            // =============================================

            onClose?.();
        } catch (requestError) {
            // =============================================
            // IGNORE OLD SESSION ERRORS
            // =============================================

            if (
                sessionRef.current !==
                currentSession
            ) {
                if (
                    toastId !== null &&
                    toastId !== undefined
                ) {
                    siteToast.dismiss(toastId);
                }

                return;
            }

            // =============================================
            // PARSE API ERROR
            // =============================================

            const message = getErrorMessage(
                requestError,

                isEditMode
                    ? "Roadmapni yangilashda xato yuz berdi."
                    : "Roadmap yaratishda xato yuz berdi."
            );

            console.error(
                "Roadmap submit xato:",
                requestError
            );

            // =============================================
            // PRESERVE FORM VALUES
            // =============================================

            setError(message);

            scrollToFormTop();

            // =============================================
            // ERROR TOAST
            // =============================================

            siteToast.error(
                message,
                {
                    id: toastId,

                    title: isEditMode
                        ? "Roadmap yangilanmadi"
                        : "Roadmap yaratilmadi",

                    duration: 5000,
                }
            );
        } finally {
            // =============================================
            // RELEASE SUBMISSION LOCK
            //
            // Do not update a newer modal session.
            // =============================================

            if (
                sessionRef.current ===
                currentSession
            ) {
                submittingRef.current = false;

                setIsProcessing(false);
            }
        }
    };

    // =====================================================
    // CLOSED MODAL
    //
    // All hooks must remain above this condition.
    // =====================================================

    if (!isOpen) {
        return null;
    }

    // =====================================================
    // PORTAL RENDER
    //
    // Portal prevents Navbar/Profile stacking contexts
    // from overlapping or clipping the modal.
    //
    // Desktop:
    // - Centered
    // - Maximum height 780px
    //
    // Mobile:
    // - Full viewport
    //
    // Header and Footer stay outside the scrollable body.
    // =====================================================

    return createPortal(
        <div
            onMouseDown={handleBackdropClick}
            className="
                fixed
                inset-0

                z-[99999]

                flex

                items-stretch
                justify-center

                overflow-hidden

                bg-slate-950/75

                p-0

                backdrop-blur-md

                dark:bg-black/80

                sm:items-center
                sm:px-5
                sm:py-10

                lg:px-8
                lg:py-12
            "
        >
            {/* =============================================
                BACKGROUND GLOW
            ============================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none

                    absolute
                    left-1/2
                    top-[20%]

                    h-[430px]
                    w-[430px]

                    -translate-x-1/2

                    rounded-full

                    bg-indigo-600/[0.10]

                    blur-[130px]
                "
            />

            {/* =============================================
                MAIN MODAL CONTAINER

                Mobile:
                - Full-screen
                - No border radius
                - Dynamic viewport height

                Desktop:
                - Centered
                - Maximum height 780px
                - Rounded corners
            ============================================== */}

            <div
                ref={modalRef}

                role="dialog"
                aria-modal="true"

                aria-labelledby="roadmap-modal-title"

                aria-describedby="roadmap-modal-description"

                tabIndex={-1}

                className="
                    relative
                    isolate

                    flex

                    h-screen
                    max-h-screen

                    h-[100dvh]
                    max-h-[100dvh]

                    w-full
                    min-w-0
                    max-w-5xl

                    flex-col

                    overflow-hidden

                    rounded-none
                    border-0

                    bg-white

                    shadow-[0_40px_120px_rgba(0,0,0,0.25)]

                    outline-none

                    dark:bg-[#0a0e16]

                    dark:shadow-[0_40px_120px_rgba(0,0,0,0.70)]

                    sm:h-[min(780px,calc(100dvh-80px))]
                    sm:max-h-[calc(100dvh-80px)]

                    sm:rounded-[26px]

                    sm:border
                    sm:border-slate-200

                    dark:sm:border-white/[0.08]

                    lg:rounded-[30px]
                "
            >
                {/* =========================================
                    TOP GLOW
                ========================================== */}

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none

                        absolute
                        left-1/2
                        top-0

                        h-32
                        w-[65%]

                        -translate-x-1/2
                        -translate-y-1/2

                        rounded-full

                        bg-indigo-500/[0.12]

                        blur-[70px]
                    "
                />

                {/* =========================================
                    HEADER

                    Remains visible at the top.
                    Outside scrollable form body.
                ========================================== */}

                <div
                    className="
                        relative
                        z-20

                        w-full
                        min-w-0

                        shrink-0
                    "
                >
                    <RoadmapCreateHeader
                        isEditMode={isEditMode}

                        isLoading={busy}

                        onClose={handleClose}
                    />
                </div>

                {/* =========================================
                    FORM

                    Footer must remain inside form so
                    type="submit" works correctly.
                ========================================== */}

                <form
                    onSubmit={handleSubmit}

                    className="
                        relative
                        z-10

                        flex

                        min-h-0
                        min-w-0
                        flex-1

                        flex-col

                        overflow-hidden
                    "
                >
                    {/* =====================================
                        SCROLLABLE FORM BODY

                        Header and Footer do not scroll.

                        Supports touch scrolling,
                        prevents horizontal overflow.
                    ====================================== */}

                    <div
                        ref={contentScrollRef}

                        className="
                            min-h-0
                            min-w-0
                            flex-1

                            overflow-x-hidden
                            overflow-y-auto

                            overscroll-contain

                            touch-pan-y

                            [scrollbar-gutter:stable]
                        "
                    >
                        {/* =================================
                            RESPONSIVE CONTENT GRID

                            Mobile/Tablet:
                            - One column

                            Desktop:
                            - Form on the left
                            - Preview on the right
                        ================================== */}

                        <div
                            className="
                                grid

                                w-full
                                min-w-0

                                grid-cols-1

                                items-start

                                lg:grid-cols-[minmax(0,1fr)_310px]
                            "
                        >
                            {/* =============================
                                LEFT PANEL
                            ============================== */}

                            <div
                                className="
                                    w-full
                                    min-w-0

                                    space-y-5

                                    p-3

                                    min-[380px]:p-4

                                    sm:space-y-6
                                    sm:p-6

                                    lg:space-y-7

                                    lg:border-r
                                    lg:border-slate-200

                                    lg:p-7

                                    dark:lg:border-white/[0.06]
                                "
                            >
                                {/* =========================
                                    API / VALIDATION ERROR

                                    At the top so the
                                    scrollToFormTop handler
                                    makes it visible.
                                ========================== */}

                                {error && (
                                    <div
                                        role="alert"

                                        className="
                                            flex
                                            min-w-0

                                            items-start
                                            gap-3

                                            rounded-2xl
                                            border

                                            border-red-200
                                            bg-red-50

                                            p-3

                                            text-sm
                                            font-semibold

                                            text-red-700

                                            dark:border-red-400/20
                                            dark:bg-red-500/[0.08]
                                            dark:text-red-300

                                            sm:p-4
                                        "
                                    >
                                        <AlertTriangle
                                            size={18}

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

                                                break-words
                                                [overflow-wrap:anywhere]

                                                leading-6
                                            "
                                        >
                                            {error}
                                        </span>
                                    </div>
                                )}

                                {/* =========================
                                    ROADMAP TYPE
                                ========================== */}

                                <div
                                    className="
                                        w-full
                                        min-w-0
                                    "
                                >
                                    <RoadmapCreateTypeSelector
                                        value={
                                            formData.type
                                        }

                                        onChange={
                                            handleTypeChange
                                        }

                                        disabled={busy}
                                    />
                                </div>

                                {/* =========================
                                    ROADMAP FIELDS

                                    Title
                                    Description
                                    Start date
                                    Finish date
                                ========================== */}

                                <div
                                    className="
                                        w-full
                                        min-w-0
                                    "
                                >
                                    <RoadmapCreateFields
                                        formData={formData}

                                        onChange={
                                            handleChange
                                        }

                                        disabled={busy}
                                    />
                                </div>
                            </div>

                            {/* =============================
                                RIGHT PANEL
                                LIVE ROADMAP PREVIEW

                                On mobile:
                                - Below form fields

                                On desktop:
                                - Right column
                            ============================== */}

                            <div
                                className="
                                    w-full
                                    min-w-0

                                    overflow-hidden
                                "
                            >
                                <RoadmapCreatePreview
                                    formData={formData}
                                />
                            </div>
                        </div>
                    </div>

                    {/* =====================================
                        FOOTER

                        - Inside form
                        - Outside scrollable area
                        - Always accessible
                        - Preserves original props
                    ====================================== */}

                    <div
                        className="
                            relative
                            z-20

                            w-full
                            min-w-0

                            shrink-0
                        "
                    >
                        <RoadmapCreateFooter
                            isEditMode={isEditMode}

                            isLoading={busy}

                            onClose={handleClose}
                        />
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

export default RoadmapCreateModal;
