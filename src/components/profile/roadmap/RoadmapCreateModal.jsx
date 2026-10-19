
import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    AlertTriangle,
} from "lucide-react";

// =========================================================
// TOAST SERVICE
//
// Previous location:
// profile/RoadmapCreateModal.jsx
//
// New location:
// profile/roadmap/RoadmapCreateModal.jsx
// =========================================================

import {
    siteToast,
} from "../../ui/AuthToast";

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

const TITLE_MAX_LENGTH = 255;

const DESCRIPTION_MAX_LENGTH = 3000;

// =========================================================
// DATE FORMAT
//
// Backend dates:
// 2026-10-18
// 2026-10-18T10:30:00Z
//
// HTML date input:
// YYYY-MM-DD
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
// Supports create and edit modes.
//
// Only fields supported by the roadmap backend
// are included.
// =========================================================

const getInitialFormData = (initialData) => {
    if (!initialData) {
        return {
            ...EMPTY_FORM,
        };
    }

    return {
        title: initialData?.title || "",

        type: initialData?.type || "learning",

        description:
            initialData?.description || "",

        started_at: formatDateForInput(
            initialData?.started_at
        ),

        finished_at: formatDateForInput(
            initialData?.finished_at
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
//
// - String
// - DRF field error object
// - Array of validation errors
// - detail / message
// =========================================================

const parseErrorData = (data) => {
    if (!data) {
        return "";
    }

    if (typeof data === "string") {
        return data.trim();
    }

    if (Array.isArray(data)) {
        return data
            .map(parseErrorData)
            .filter(Boolean)
            .join("; ");
    }

    if (typeof data === "object") {
        // General API errors

        if (data.detail) {
            return parseErrorData(data.detail);
        }

        if (data.non_field_errors) {
            return parseErrorData(
                data.non_field_errors
            );
        }

        if (data.message) {
            return parseErrorData(data.message);
        }

        // Field validation errors

        const messages = Object.entries(data)
            .map(([field, value]) => {
                const text = parseErrorData(value);

                if (!text) {
                    return "";
                }

                const label =
                    ERROR_FIELD_LABELS[field] ||
                    field;

                return `${label}: ${text}`;
            })
            .filter(Boolean);

        return messages.join("; ");
    }

    return String(data);
};

// =========================================================
// GET API ERROR MESSAGE
//
// Supports:
//
// error.serverData
// error.response.data
// error.message
//
// Preserves DRF validation messages.
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

    const serverMessage =
        parseErrorData(serverData);

    if (serverMessage) {
        return serverMessage;
    }

    if (
        typeof error?.message === "string" &&
        error.message.trim()
    ) {
        try {
            const parsed = JSON.parse(
                error.message
            );

            const parsedMessage =
                parseErrorData(parsed);

            if (parsedMessage) {
                return parsedMessage;
            }
        } catch {
            // The message is not JSON.
        }

        return error.message;
    }

    return fallback;
};

// =========================================================
// VALIDATE FORM
//
// Original backend rules preserved.
//
// title:
// - required
// - min 2
// - max 255
//
// type:
// - learning / experience
//
// started_at:
// - required
//
// finished_at:
// - optional
// - cannot be earlier than started_at
//
// description:
// - max 3000
// =========================================================

const validateRoadmapForm = (formData) => {
    const title = String(
        formData?.title || ""
    ).trim();

    const description = String(
        formData?.description || ""
    ).trim();

    const type = formData?.type;

    const startedAt = formData?.started_at;

    const finishedAt = formData?.finished_at;

    // =====================================================
    // TITLE
    // =====================================================

    if (!title) {
        return "Roadmap sarlavhasini kiriting.";
    }

    if (title.length < 2) {
        return (
            "Roadmap sarlavhasi kamida 2 ta belgidan " +
            "iborat bo‘lishi kerak."
        );
    }

    if (title.length > TITLE_MAX_LENGTH) {
        return (
            "Roadmap sarlavhasi 255 ta belgidan " +
            "oshmasligi kerak."
        );
    }

    // =====================================================
    // TYPE
    // =====================================================

    if (!VALID_ROADMAP_TYPES.includes(type)) {
        return "Roadmap turini to‘g‘ri tanlang.";
    }

    // =====================================================
    // START DATE
    // =====================================================

    if (!startedAt) {
        return (
            "Roadmap boshlanish sanasini kiriting."
        );
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
    // DESCRIPTION
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
// Do not send frontend-only fields.
//
// Only send supported Django model fields.
// =========================================================

const buildRoadmapPayload = (formData) => {
    return {
        title: formData.title.trim(),

        type: formData.type,

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
// Existing ProfileRoadmap contract:
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
//
// - Form state
// - Edit mode initialization
// - Validation
// - Submission
// - Error handling
// - Toast notifications
// - ESC / backdrop close
// - Body scroll lock
//
// API requests remain in ProfileRoadmap.jsx.
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

    const isEditMode = Boolean(initialData);

    // =====================================================
    // STATE
    // =====================================================

    const [
        formData,
        setFormData,
    ] = useState({
        ...EMPTY_FORM,
    });

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
    //
    // Prevent duplicate submit before React rerenders.
    // =====================================================

    const submittingRef = useRef(false);

    const modalRef = useRef(null);

    // =====================================================
    // BUSY STATE
    // =====================================================

    const busy =
        Boolean(isSubmitting) ||
        isProcessing;

    // =====================================================
    // RESET FORM WHEN MODAL OPENS
    //
    // Create:
    // Empty fields
    //
    // Edit:
    // Existing roadmap data
    // =====================================================

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setFormData(
            getInitialFormData(initialData)
        );

        setError("");
    }, [
        isOpen,
        initialData,
    ]);

    // =====================================================
    // BODY SCROLL LOCK
    //
    // Separate from ESC handler so changes to
    // busy state cannot accidentally leave the
    // document body permanently locked.
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
    // ESC KEY
    //
    // Disabled while submitting.
    // =====================================================

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key !== "Escape") {
                return;
            }

            event.preventDefault();

            handleClose();
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
        handleClose,
    ]);

    // =====================================================
    // AUTO FOCUS
    //
    // Focus modal on opening.
    // Restore previous focus after closing.
    // =====================================================

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const previousActiveElement =
            document.activeElement;

        modalRef.current?.focus();

        return () => {
            if (
                previousActiveElement &&
                typeof previousActiveElement.focus ===
                    "function"
            ) {
                previousActiveElement.focus();
            }
        };
    }, [
        isOpen,
    ]);

    // =====================================================
    // FORM INPUT CHANGE
    //
    // Uses name attributes from
    // RoadmapCreateFields.jsx
    // =====================================================

    const handleChange = (event) => {
        if (busy) {
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
    //
    // Uses RoadmapCreateTypeSelector.jsx
    // =====================================================

    const handleTypeChange = (value) => {
        if (
            busy ||
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
    // Only clicking outside the modal closes it.
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
    // SUBMIT
    //
    // Process:
    //
    // 1. Block duplicate submission
    // 2. Validate fields
    // 3. Build backend payload
    // 4. Show loading toast
    // 5. Call parent onSubmit
    // 6. Show success or failure
    // 7. Close modal on success
    // =====================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        // =================================================
        // GUARD
        // =================================================

        if (
            busy ||
            submittingRef.current
        ) {
            return;
        }

        if (
            typeof onSubmit !== "function"
        ) {
            setError(
                "Roadmapni saqlash funksiyasi mavjud emas."
            );

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

            return;
        }

        // =================================================
        // PAYLOAD
        // =================================================

        const payload =
            buildRoadmapPayload(formData);

        // =================================================
        // LOCK SUBMISSION
        // =================================================

        submittingRef.current = true;

        setIsProcessing(true);

        // =================================================
        // LOADING TOAST
        // =================================================

        const toastId = siteToast.loading(
            isEditMode
                ? "Roadmapdagi o‘zgarishlar saqlanmoqda..."
                : "Yangi roadmap yaratilmoqda...",
            {
                title: isEditMode
                    ? "Roadmap yangilanmoqda"
                    : "Roadmap yaratilmoqda",
            }
        );

        try {
            // =============================================
            // PARENT HANDLES CREATE / UPDATE API
            // =============================================

            const result = await onSubmit(
                payload
            );

            // =============================================
            // PARENT EXPLICITLY RETURNS FALSE
            //
            // Example: Duplicate operation blocked.
            // =============================================

            if (result === false) {
                siteToast.dismiss(toastId);

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

            // =============================================
            // CLOSE MODAL
            //
            // The parent handles modal visibility.
            // =============================================

            onClose?.();
        } catch (requestError) {
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
            // KEEP MODAL OPEN
            // =============================================

            setError(message);

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
            submittingRef.current = false;

            setIsProcessing(false);
        }
    };

    // =====================================================
    // CLOSED
    // =====================================================

    if (!isOpen) {
        return null;
    }

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div
            onMouseDown={handleBackdropClick}
            className="
                fixed
                inset-0
                z-[100]

                flex
                items-start
                justify-center

                overflow-y-auto

                bg-black/75

                px-3
                py-5

                backdrop-blur-md

                sm:px-5
                sm:py-8

                lg:items-center
            "
        >
            {/* =====================================
                BACKGROUND GLOW
            ====================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none

                    fixed
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

            {/* =====================================
                MODAL CONTAINER

                Light / Dark Mode supported.

                Accessibility:
                - Dialog role
                - Modal semantics
                - Heading association
                - Keyboard focus
            ====================================== */}

            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="roadmap-modal-title"
                aria-describedby="roadmap-modal-description"
                tabIndex={-1}
                className="
                    relative
                    my-auto

                    w-full
                    max-w-5xl
                    min-w-0

                    overflow-hidden

                    rounded-[30px]
                    border

                    border-slate-200
                    bg-white/95

                    shadow-[0_40px_120px_rgba(0,0,0,0.25)]

                    outline-none

                    backdrop-blur-2xl

                    dark:border-white/[0.08]
                    dark:bg-[#0a0e16]/95

                    dark:shadow-[0_40px_120px_rgba(0,0,0,0.70)]
                "
            >
                {/* =====================================
                    TOP GLOW
                ====================================== */}

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

                {/* =====================================
                    HEADER
                ====================================== */}

                <RoadmapCreateHeader
                    isEditMode={isEditMode}
                    isLoading={busy}
                    onClose={handleClose}
                />

                {/* =====================================
                    FORM

                    Native HTML validation remains active.

                    Controlled values are managed by
                    this modal.
                ====================================== */}

                <form
                    onSubmit={handleSubmit}
                >
                    {/* =================================
                        CONTENT GRID

                        Left: Form
                        Right: Live preview
                    ================================== */}

                    <div
                        className="
                            grid
                            min-w-0

                            lg:grid-cols-[minmax(0,1fr)_310px]
                        "
                    >
                        {/* =============================
                            LEFT PANEL
                        ============================== */}

                        <div
                            className="
                                min-w-0

                                space-y-7

                                p-5

                                sm:p-7

                                lg:border-r
                                lg:border-slate-200

                                dark:lg:border-white/[0.06]
                            "
                        >
                            {/* =========================
                                ROADMAP TYPE
                            ========================== */}

                            <RoadmapCreateTypeSelector
                                value={formData.type}
                                onChange={handleTypeChange}
                                disabled={busy}
                            />

                            {/* =========================
                                TITLE, DESCRIPTION,
                                START AND FINISH DATES
                            ========================== */}

                            <RoadmapCreateFields
                                formData={formData}
                                onChange={handleChange}
                                disabled={busy}
                            />

                            {/* =========================
                                API / VALIDATION ERROR
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

                                        border-red-300
                                        bg-red-50

                                        p-4

                                        text-sm
                                        font-semibold

                                        text-red-700

                                        dark:border-red-400/20
                                        dark:bg-red-500/[0.08]
                                        dark:text-red-300
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
                                            break-words
                                            [overflow-wrap:anywhere]
                                        "
                                    >
                                        {error}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* =============================
                            RIGHT PANEL

                            Live roadmap preview.
                        ============================== */}

                        <RoadmapCreatePreview
                            formData={formData}
                        />
                    </div>

                    {/* =================================
                        FOOTER

                        Submit button remains inside
                        the parent form.
                    ================================== */}

                    <RoadmapCreateFooter
                        isEditMode={isEditMode}
                        isLoading={busy}
                        onClose={handleClose}
                    />
                </form>
            </div>
        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default RoadmapCreateModal;
