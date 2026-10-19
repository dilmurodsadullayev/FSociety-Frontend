
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    AlertTriangle,
} from "lucide-react";

// =========================================================
// TOAST
// =========================================================

import {
    siteToast,
} from "../ui/AuthToast";

// =========================================================
// MODAL COMPONENTS
// =========================================================

import PostCreateHeader from "./create/PostCreateHeader";

import PostCreateTypeSelector, {
    POST_TYPES,
} from "./create/PostCreateTypeSelector";

import PostCreateFields from "./create/PostCreateFields";

import PostCreatePreview from "./create/PostCreatePreview";

import PostCreateFooter from "./create/PostCreateFooter";

// =========================================================
// CONSTANTS
// =========================================================

const EMPTY_FORM = {
    post_type: "TEX",
    title: "",
    content: "",
};

const TITLE_MIN_LENGTH = 3;
const TITLE_MAX_LENGTH = 150;

// =========================================================
// INITIAL FORM DATA
//
// Create:
//   Empty form.
//
// Edit:
//   Existing post information.
//
// Backend field names are preserved.
// =========================================================

const getInitialFormData = (initialData) => {
    if (!initialData) {
        return {
            ...EMPTY_FORM,
        };
    }

    return {
        post_type:
            initialData.post_type || "TEX",

        title:
            initialData.title || "",

        content:
            initialData.content || "",
    };
};

// =========================================================
// ERROR PARSER
//
// Supports:
//
// - Normal JavaScript Error
// - Axios error
// - DRF response.data
// - Field validation errors
// - JSON serialized error messages
//
// Prevents [object Object] appearing in UI.
// =========================================================

const ERROR_FIELD_LABELS = {
    post_type: "Post turi",
    title: "Sarlavha",
    content: "Kontent",
    non_field_errors: "Xatolik",
};

const parseErrorValue = (
    value,
    depth = 0
) => {
    if (
        value == null ||
        depth > 5
    ) {
        return "";
    }

    // =====================================================
    // STRING
    // =====================================================

    if (typeof value === "string") {
        const text = value.trim();

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
                return parseErrorValue(
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
        typeof value === "number" ||
        typeof value === "boolean"
    ) {
        return String(value);
    }

    // =====================================================
    // ARRAY
    // =====================================================

    if (Array.isArray(value)) {
        return value
            .map((item) =>
                parseErrorValue(
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

    if (typeof value === "object") {
        for (const key of [
            "detail",
            "message",
            "error",
            "non_field_errors",
        ]) {
            if (value[key]) {
                const message = parseErrorValue(
                    value[key],
                    depth + 1
                );

                if (message) {
                    return message;
                }
            }
        }

        return Object.entries(value)
            .filter(
                ([key]) =>
                    ![
                        "request",
                        "response",
                        "config",
                        "stack",
                    ].includes(key)
            )
            .map(([field, fieldError]) => {
                const message = parseErrorValue(
                    fieldError,
                    depth + 1
                );

                if (!message) {
                    return "";
                }

                return `${
                    ERROR_FIELD_LABELS[field] ||
                    field
                }: ${message}`;
            })
            .filter(Boolean)
            .join("; ");
    }

    return "";
};

// =========================================================
// GET ERROR MESSAGE
// =========================================================

const getErrorMessage = (
    error,
    fallback = "Postni saqlashda kutilmagan xatolik yuz berdi."
) => {
    if (!error) {
        return fallback;
    }

    const serverData =
        error?.serverData ??
        error?.response?.data;

    return (
        parseErrorValue(serverData) ||
        parseErrorValue(error?.message) ||
        fallback
    );
};

// =========================================================
// HTML -> TEXT
//
// Original behavior preserved.
//
// Used for:
//
// - Live preview
// - Word count
//
// Never render untrusted HTML using
// dangerouslySetInnerHTML.
// =========================================================

const stripHtml = (html = "") => {
    return String(html ?? "")
        .replace(
            /<style[^>]*>.*?<\/style>/gis,
            ""
        )
        .replace(
            /<script[^>]*>.*?<\/script>/gis,
            ""
        )
        .replace(
            /<[^>]+>/g,
            " "
        )
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, '"')
        .replace(/&#039;/gi, "'")
        .replace(/\s+/g, " ")
        .trim();
};

// =========================================================
// VALIDATE FORM
//
// Original rules:
//
// post_type:
//   Valid backend category.
//
// title:
//   Required.
//   At least 3 characters.
//   Maximum 150 characters.
//
// content:
//   Required.
//
// Validation remains centralized here.
// =========================================================

const validatePostForm = (formData) => {
    const postType =
        formData.post_type;

    const title =
        String(formData.title ?? "").trim();

    const content =
        String(formData.content ?? "").trim();

    // =====================================================
    // CATEGORY
    // =====================================================

    const isValidCategory =
        POST_TYPES.some(
            (item) =>
                item.value === postType
        );

    if (!isValidCategory) {
        return "Post turini to‘g‘ri tanlang.";
    }

    // =====================================================
    // TITLE REQUIRED
    // =====================================================

    if (!title) {
        return "Post sarlavhasini kiriting.";
    }

    // =====================================================
    // TITLE MIN LENGTH
    // =====================================================

    if (
        title.length <
        TITLE_MIN_LENGTH
    ) {
        return (
            "Sarlavha kamida 3 ta belgidan " +
            "iborat bo‘lishi kerak."
        );
    }

    // =====================================================
    // TITLE MAX LENGTH
    // =====================================================

    if (
        title.length >
        TITLE_MAX_LENGTH
    ) {
        return (
            "Sarlavha 150 ta belgidan " +
            "oshmasligi kerak."
        );
    }

    // =====================================================
    // CONTENT REQUIRED
    // =====================================================

    if (!content) {
        return "Post kontentini kiriting.";
    }

    return null;
};

// =========================================================
// BUILD BACKEND PAYLOAD
//
// Preserve existing backend contract.
//
// No extra frontend-only fields.
// =========================================================

const buildPostPayload = (formData) => {
    return {
        post_type:
            formData.post_type,

        title:
            formData.title.trim(),

        content:
            formData.content.trim(),
    };
};

// =========================================================
// CREATE POST MODAL
//
// Existing props:
//
// isOpen
// onClose
// onSubmit
// isSubmitting
// initialData
//
// CREATE MODE:
//
// - No initialData.
// - Modal handles toast.
// - Parent handles POST and Redux.
// - Parent closes modal after success.
//
// EDIT MODE:
//
// - initialData is provided.
// - PostDetail handles toast.
// - Parent handles PATCH and Redux.
// - Parent closes modal after success.
//
// This preserves the original behavior.
// =========================================================

const CreatePostModal = ({
    isOpen = false,
    onClose,
    onSubmit,
    isSubmitting = false,
    initialData = null,
}) => {
    // =====================================================
    // MODE
    // =====================================================

    const isEditMode =
        Boolean(initialData);

    // =====================================================
    // FORM STATE
    // =====================================================

    const [
        formData,
        setFormData,
    ] = useState(() => ({
        ...EMPTY_FORM,
    }));

    // =====================================================
    // ERROR STATE
    // =====================================================

    const [
        error,
        setError,
    ] = useState("");

    // =====================================================
    // INTERNAL PROCESSING STATE
    //
    // Parent isSubmitting may update only after
    // React rerenders.
    //
    // Internal state and ref prevent duplicate
    // submission before that happens.
    // =====================================================

    const [
        isProcessing,
        setIsProcessing,
    ] = useState(false);

    // =====================================================
    // REFS
    // =====================================================

    const modalRef =
        useRef(null);

    const submittingRef =
        useRef(false);

    // =====================================================
    // BUSY STATE
    // =====================================================

    const busy =
        Boolean(isSubmitting) ||
        isProcessing;

    // =====================================================
    // INITIAL DATA
    //
    // Reset form whenever the modal opens or
    // the selected post changes.
    //
    // Primitive dependencies prevent unnecessary
    // resets when initialData is recreated.
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
        initialData?.post_type,
        initialData?.title,
        initialData?.content,
    ]);

    // =====================================================
    // BODY SCROLL LOCK
    // =====================================================

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const oldOverflow =
            document.body.style.overflow;

        document.body.style.overflow =
            "hidden";

        return () => {
            document.body.style.overflow =
                oldOverflow;
        };
    }, [
        isOpen,
    ]);

    // =====================================================
    // CLOSE MODAL
    //
    // Prevent close during POST/PATCH.
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
    // Keep same behavior as original modal.
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
    // FOCUS MANAGEMENT
    //
    // Focus the modal when opened.
    //
    // Restore previous focus when closed.
    // =====================================================

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const previousElement =
            document.activeElement;

        modalRef.current?.focus();

        return () => {
            if (
                previousElement &&
                typeof previousElement.focus ===
                    "function" &&
                previousElement.isConnected
            ) {
                previousElement.focus();
            }
        };
    }, [
        isOpen,
    ]);

    // =====================================================
    // SELECTED CATEGORY
    //
    // Category configuration is defined in
    // PostCreateTypeSelector.
    // =====================================================

    const selectedType = useMemo(() => {
        return (
            POST_TYPES.find(
                (item) =>
                    item.value ===
                    formData.post_type
            ) || POST_TYPES[0]
        );
    }, [
        formData.post_type,
    ]);

    // =====================================================
    // PREVIEW CONTENT
    // =====================================================

    const cleanPreviewContent = useMemo(() => {
        return stripHtml(
            formData.content
        );
    }, [
        formData.content,
    ]);

    // =====================================================
    // WORD COUNT
    //
    // Preserve original stripHtml-based counting.
    // =====================================================

    const wordCount = useMemo(() => {
        const content =
            cleanPreviewContent.trim();

        if (!content) {
            return 0;
        }

        return content
            .split(/\s+/)
            .filter(Boolean)
            .length;
    }, [
        cleanPreviewContent,
    ]);

    // =====================================================
    // INPUT CHANGE
    //
    // Works with:
    //
    // name="title"
    // name="content"
    //
    // These names are preserved in PostCreateFields.
    // =====================================================

    const handleChange = (event) => {
        if (busy) {
            return;
        }

        const {
            name,
            value,
        } = event.target;

        // =================================================
        // ONLY ACCEPT EXPECTED FIELDS
        // =================================================

        if (
            name !== "title" &&
            name !== "content"
        ) {
            return;
        }

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        if (error) {
            setError("");
        }
    };

    // =====================================================
    // CATEGORY CHANGE
    //
    // Receives category value directly from
    // PostCreateTypeSelector.
    // =====================================================

    const handleCategoryChange = (value) => {
        if (busy) {
            return;
        }

        const isValid =
            POST_TYPES.some(
                (item) =>
                    item.value === value
            );

        if (!isValid) {
            return;
        }

        setFormData((previous) => ({
            ...previous,

            post_type: value,
        }));

        if (error) {
            setError("");
        }
    };

    // =====================================================
    // BACKDROP CLICK
    //
    // Close only when clicking outside the dialog.
    // =====================================================

    const handleBackdropClick = (event) => {
        if (
            event.target ===
            event.currentTarget
        ) {
            handleClose();
        }
    };

    // =====================================================
    // SUBMIT
    //
    // Steps:
    //
    // 1. Prevent default.
    // 2. Prevent duplicate submission.
    // 3. Validate fields.
    // 4. Build backend payload.
    // 5. Call parent's onSubmit.
    // 6. Create mode: display toast.
    // 7. Edit mode: let PostDetail display toast.
    // 8. Keep modal open when API fails.
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

        setError("");

        // =================================================
        // PARENT CALLBACK
        // =================================================

        if (
            typeof onSubmit !== "function"
        ) {
            const message =
                "Postni saqlash funksiyasi mavjud emas.";

            setError(message);

            return;
        }

        // =================================================
        // VALIDATE FORM
        // =================================================

        const validationError =
            validatePostForm(formData);

        if (validationError) {
            setError(validationError);

            siteToast.warning(
                validationError,
                {
                    title:
                        "Post ma’lumotlarini tekshiring",

                    duration: 4000,
                }
            );

            return;
        }

        // =================================================
        // BUILD PAYLOAD
        // =================================================

        const payload =
            buildPostPayload(formData);

        // =================================================
        // PREVENT DUPLICATE POST/PATCH
        // =================================================

        submittingRef.current = true;

        setIsProcessing(true);

        // =================================================
        // CREATE TOAST
        //
        // In edit mode, PostDetail handles toasts.
        // =================================================

        let loadingToastId = null;

        if (!isEditMode) {
            loadingToastId =
                siteToast.loading(
                    "Yangi post serverga yuborilmoqda...",
                    {
                        title:
                            "Post yaratilmoqda",
                    }
                );
        }

        try {
            // =============================================
            // PARENT CALLBACK
            // =============================================

            const result = await onSubmit(
                payload
            );

            // =============================================
            // PARENT RETURNED FALSE
            //
            // Do not show success.
            // =============================================

            if (result === false) {
                if (
                    loadingToastId !== null &&
                    loadingToastId !== undefined
                ) {
                    siteToast.dismiss(
                        loadingToastId
                    );
                }

                return;
            }

            // =============================================
            // CREATE SUCCESS
            //
            // Edit mode has its own success toast in
            // PostDetail.
            // =============================================

            if (!isEditMode) {
                siteToast.success(
                    "Yangi postingiz community uchun muvaffaqiyatli chop etildi.",
                    {
                        id: loadingToastId,

                        title:
                            "Post chop etildi",

                        duration: 3800,
                    }
                );

                // =========================================
                // RESET CREATE FORM
                // =========================================

                setFormData({
                    ...EMPTY_FORM,
                });

                setError("");
            }

            // =============================================
            // MODAL CLOSING
            //
            // Do not call onClose here.
            //
            // Existing parents manage this:
            //
            // ProfilePosts:
            //   closes after create success.
            //
            // PostDetail:
            //   closes after update success.
            //
            // This preserves their existing contracts.
            // =============================================
        } catch (submitError) {
            // =============================================
            // API ERROR
            // =============================================

            const message = getErrorMessage(
                submitError,

                isEditMode
                    ? "Postni tahrirlashda xato yuz berdi."
                    : "Post yaratishda xato yuz berdi."
            );

            console.error(
                isEditMode
                    ? "Post update xato:"
                    : "Post create xato:",
                submitError
            );

            // =============================================
            // KEEP FORM VALUES
            // =============================================

            setError(message);

            // =============================================
            // CREATE ERROR TOAST
            //
            // Edit error toast remains in PostDetail.
            // =============================================

            if (!isEditMode) {
                siteToast.error(
                    message,
                    {
                        id: loadingToastId,

                        title:
                            "Post yaratilmadi",

                        duration: 5000,
                    }
                );
            }
        } finally {
            // =============================================
            // RELEASE SUBMISSION LOCK
            // =============================================

            submittingRef.current = false;

            setIsProcessing(false);
        }
    };

    // =====================================================
    // CLOSED MODAL
    // =====================================================

    if (!isOpen) {
        return null;
    }

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div
            onMouseDown={
                handleBackdropClick
            }
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

                sm:px-6
                sm:py-8

                lg:items-center
            "
        >
            {/* =====================================
                BACKGROUND GLOWS
            ====================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none

                    fixed
                    left-1/2
                    top-1/4

                    h-[450px]
                    w-[450px]

                    -translate-x-1/2

                    rounded-full

                    bg-indigo-600/10

                    blur-[130px]
                "
            />

            <div
                aria-hidden="true"
                className="
                    pointer-events-none

                    fixed
                    bottom-0
                    right-0

                    h-[350px]
                    w-[350px]

                    rounded-full

                    bg-purple-600/10

                    blur-[120px]
                "
            />

            {/* =====================================
                MAIN MODAL
            ====================================== */}

            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="post-create-modal-title"
                aria-describedby="post-create-modal-description"
                tabIndex={-1}
                className="
                    relative
                    my-auto

                    w-full
                    max-w-6xl
                    min-w-0

                    overflow-hidden

                    rounded-[32px]
                    border

                    border-slate-200
                    bg-white/95

                    shadow-[0_35px_100px_rgba(15,23,42,0.25)]

                    outline-none

                    backdrop-blur-2xl

                    dark:border-white/[0.08]
                    dark:bg-[#0a0d14]/95

                    dark:shadow-[0_35px_100px_rgba(0,0,0,0.75)]
                "
            >
                {/* =================================
                    TOP GLOW
                ================================== */}

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none

                        absolute
                        left-1/2
                        top-0

                        h-40
                        w-[70%]

                        -translate-x-1/2
                        -translate-y-1/2

                        rounded-full

                        bg-indigo-500/15

                        blur-[80px]
                    "
                />

                {/* =================================
                    1. MODAL HEADER
                ================================== */}

                <PostCreateHeader
                    isEditMode={isEditMode}
                    isSubmitting={busy}
                    onClose={handleClose}
                />

                {/* =================================
                    POST FORM
                ================================== */}

                <form
                    onSubmit={handleSubmit}
                >
                    {/* =============================
                        TWO-COLUMN LAYOUT

                        Left:
                        - Post type
                        - Title
                        - Content
                        - Error

                        Right:
                        - Live preview
                    ============================== */}

                    <div
                        className="
                            grid
                            min-w-0

                            lg:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.7fr)]
                        "
                    >
                        {/* =========================
                            LEFT PANEL
                        ========================== */}

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
                            {/* =====================
                                2. CATEGORY SELECTOR
                            ====================== */}

                            <PostCreateTypeSelector
                                value={
                                    selectedType.value
                                }
                                onChange={
                                    handleCategoryChange
                                }
                                disabled={busy}
                            />

                            {/* =====================
                                3. FORM FIELDS
                            ====================== */}

                            <PostCreateFields
                                formData={formData}
                                onChange={handleChange}
                                wordCount={wordCount}
                                disabled={busy}
                            />

                            {/* =====================
                                INLINE ERROR
                            ====================== */}

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

                                        p-4

                                        dark:border-red-400/20
                                        dark:bg-red-500/[0.08]
                                    "
                                >
                                    {/* ERROR ICON */}

                                    <span
                                        aria-hidden="true"
                                        className="
                                            mt-0.5

                                            flex
                                            h-8
                                            w-8
                                            shrink-0

                                            items-center
                                            justify-center

                                            rounded-xl

                                            bg-red-100
                                            text-red-600

                                            dark:bg-red-500/10
                                            dark:text-red-300
                                        "
                                    >
                                        <AlertTriangle
                                            size={17}
                                        />
                                    </span>

                                    {/* ERROR MESSAGE */}

                                    <div className="min-w-0">
                                        <p
                                            className="
                                                text-xs
                                                font-black

                                                uppercase
                                                tracking-wider

                                                text-red-700

                                                dark:text-red-300
                                            "
                                        >
                                            Xatolik
                                        </p>

                                        <p
                                            className="
                                                mt-1

                                                break-words

                                                text-sm
                                                font-medium
                                                leading-6

                                                text-red-700

                                                dark:text-red-200
                                            "
                                        >
                                            {error}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* =========================
                            RIGHT PANEL
                        ========================== */}

                        <PostCreatePreview
                            formData={formData}
                            cleanPreviewContent={
                                cleanPreviewContent
                            }
                        />
                    </div>

                    {/* =================================
                        4. MODAL FOOTER

                        The submit button remains
                        inside the form.
                    ================================== */}

                    <PostCreateFooter
                        isEditMode={isEditMode}
                        isSubmitting={busy}
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

export default CreatePostModal;
