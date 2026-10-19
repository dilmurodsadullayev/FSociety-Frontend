
// src/components/posts/CreatePostModal.jsx

import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import { createPortal } from "react-dom";

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

const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(", ");

// =========================================================
// INITIAL FORM DATA
//
// Create:
// - Empty form.
//
// Edit:
// - Existing post data.
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
// - JavaScript Error
// - Axios error
// - DRF response.data
// - Field validation errors
// - JSON serialized messages
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
// Used for:
// - Live preview
// - Word count
//
// Never render untrusted HTML directly.
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
        .replace(/<[^>]+>/g, " ")
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
// VALIDATE POST FORM
//
// Existing rules:
//
// post_type:
// - Must match an available category.
//
// title:
// - Required.
// - Minimum 3 characters.
// - Maximum 150 characters.
//
// content:
// - Required.
// =========================================================

const validatePostForm = (formData) => {
    const postType = formData.post_type;

    const title = String(
        formData.title ?? ""
    ).trim();

    const content = String(
        formData.content ?? ""
    ).trim();

    // =====================================================
    // CATEGORY
    // =====================================================

    const isValidCategory = POST_TYPES.some(
        (item) => item.value === postType
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
    // TITLE MINIMUM
    // =====================================================

    if (title.length < TITLE_MIN_LENGTH) {
        return (
            "Sarlavha kamida 3 ta belgidan " +
            "iborat bo‘lishi kerak."
        );
    }

    // =====================================================
    // TITLE MAXIMUM
    // =====================================================

    if (title.length > TITLE_MAX_LENGTH) {
        return (
            "Sarlavha 150 ta belgidan " +
            "oshmasligi kerak."
        );
    }

    // =====================================================
    // CONTENT
    // =====================================================

    if (!content) {
        return "Post kontentini kiriting.";
    }

    return null;
};

// =========================================================
// BACKEND PAYLOAD
//
// Preserve existing backend contract.
//
// No extra frontend-only fields.
// =========================================================

const buildPostPayload = (formData) => {
    return {
        post_type: formData.post_type,

        title: formData.title.trim(),

        content: formData.content.trim(),
    };
};

// =========================================================
// CREATE POST MODAL
//
// Props:
// - isOpen
// - onClose
// - onSubmit
// - isSubmitting
// - initialData
//
// CREATE MODE:
// - Empty post form
// - Parent performs POST and Redux updates
// - Modal shows create toast
// - Parent manages closing after success
//
// EDIT MODE:
// - Existing post values
// - Parent performs PATCH and Redux updates
// - Parent handles edit toast and closing
//
// RESPONSIVE:
//
// Mobile:
// - Full-screen dialog
// - Internal scrolling
// - Header/footer always visible
//
// Tablet / Desktop:
// - Centered modal
// - Maximum height: 780px
// - Two columns on large screens
//
// IMPORTANT:
// - Portal renders outside Navbar stacking context.
// - Existing callback contracts remain unchanged.
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

    const isEditMode = Boolean(initialData);

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
    // INTERNAL SUBMISSION STATE
    // =====================================================

    const [
        isProcessing,
        setIsProcessing,
    ] = useState(false);

    // =====================================================
    // REFS
    // =====================================================

    const modalRef = useRef(null);

    const contentScrollRef = useRef(null);

    const previousFocusedElementRef = useRef(null);

    const submittingRef = useRef(false);

    const sessionRef = useRef(0);

    // =====================================================
    // BUSY STATE
    // =====================================================

    const busy =
        Boolean(isSubmitting) ||
        isProcessing;

    // =====================================================
    // INITIAL FORM DATA
    //
    // Reset when:
    // - Modal opens
    // - Edited post changes
    // - Initial post fields change
    //
    // Primitive dependencies prevent unnecessary resets
    // caused by recreated initialData objects.
    // =====================================================

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        sessionRef.current += 1;

        setFormData(
            getInitialFormData(initialData)
        );

        setError("");

        if (contentScrollRef.current) {
            contentScrollRef.current.scrollTop = 0;
        }

        return () => {
            sessionRef.current += 1;
        };
    }, [
        isOpen,
        initialData?.id,
        initialData?.post_type,
        initialData?.title,
        initialData?.content,
    ]);

    // =====================================================
    // BODY SCROLL LOCK
    //
    // Prevent background page scrolling.
    // The modal has its own scrollable content.
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
    }, [isOpen]);

    // =====================================================
    // CLOSE MODAL
    //
    // Prevent closing while POST / PATCH is running.
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
    // Focus the dialog itself instead of an input.
    // Avoid triggering the mobile keyboard on open.
    // Restore previous focus when closing.
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
    }, [isOpen]);

    // =====================================================
    // ESCAPE + FOCUS TRAP
    //
    // - ESC closes only when not submitting.
    // - TAB stays inside the active modal.
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
                    element.getAttribute("aria-hidden") !==
                        "true"
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
    // SELECTED CATEGORY
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
    // CLEAN PREVIEW CONTENT
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
    // Expected field names:
    // - title
    // - content
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
    // =====================================================

    const handleCategoryChange = (value) => {
        if (busy) {
            return;
        }

        const isValid = POST_TYPES.some(
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
    // Only clicking the backdrop closes the modal.
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
    // SCROLL TO FORM TOP
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
    // Steps:
    // 1. Prevent default
    // 2. Prevent duplicate submissions
    // 3. Validate form
    // 4. Build backend payload
    // 5. Call parent onSubmit
    // 6. Handle create toast
    // 7. Preserve form on failure
    //
    // Existing parent callback contracts preserved.
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
        // CALLBACK CHECK
        // =================================================

        if (
            typeof onSubmit !== "function"
        ) {
            const message =
                "Postni saqlash funksiyasi mavjud emas.";

            setError(message);
            scrollToFormTop();

            return;
        }

        // =================================================
        // VALIDATION
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

            scrollToFormTop();

            return;
        }

        // =================================================
        // BACKEND PAYLOAD
        // =================================================

        const payload =
            buildPostPayload(formData);

        // =================================================
        // LOCK SUBMISSION
        // =================================================

        const currentSession =
            sessionRef.current;

        submittingRef.current = true;

        setIsProcessing(true);

        // =================================================
        // CREATE LOADING TOAST
        //
        // Edit mode toast is handled by PostDetail.
        // =================================================

        let loadingToastId = null;

        if (!isEditMode) {
            loadingToastId = siteToast.loading(
                "Yangi post serverga yuborilmoqda...",
                {
                    title: "Post yaratilmoqda",
                }
            );
        }

        try {
            // =============================================
            // PARENT SUBMIT CALLBACK
            // =============================================

            const result =
                await onSubmit(payload);

            // =============================================
            // IGNORE STALE SUBMISSION
            //
            // A previous request must not reset a newly
            // opened modal session.
            // =============================================

            if (
                sessionRef.current !==
                currentSession
            ) {
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
            // PARENT RETURNED FALSE
            //
            // Preserve original behavior:
            // Do not display a success toast.
            // Do not reset the form.
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
            // Do not close here.
            //
            // Existing parents manage closing:
            // - ProfilePosts on create
            // - PostDetail on edit
            // =============================================
        } catch (submitError) {
            // =============================================
            // IGNORE ERRORS FROM AN OLD SESSION
            // =============================================

            if (
                sessionRef.current !==
                currentSession
            ) {
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
            // API ERROR MESSAGE
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
            // PRESERVE FORM VALUES
            // =============================================

            setError(message);

            scrollToFormTop();

            // =============================================
            // CREATE ERROR TOAST
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
    //
    // Keep all hooks above this condition.
    // =====================================================

    if (!isOpen) {
        return null;
    }

    // =====================================================
    // PORTAL RENDER
    //
    // Solves:
    // - Navbar overlap
    // - Parent stacking context
    // - Modal being clipped by Profile containers
    //
    // document.body is used only while the modal is open.
    // =====================================================

    return createPortal(
        <div
            onMouseDown={
                handleBackdropClick
            }
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
                BACKGROUND GLOWS
            ============================================== */}

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

            {/* =============================================
                MAIN MODAL PANEL

                Mobile:
                - Full screen
                - Dynamic viewport height
                - No rounded corners

                Tablet/Desktop:
                - Centered
                - Max height: 780px
                - Responsive available viewport
            ============================================== */}

            <div
                ref={modalRef}

                role="dialog"
                aria-modal="true"

                aria-labelledby="post-create-modal-title"

                aria-describedby="post-create-modal-description"

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
                    max-w-6xl

                    flex-col

                    overflow-hidden

                    rounded-none
                    border-0

                    bg-white

                    shadow-[0_35px_100px_rgba(15,23,42,0.25)]

                    outline-none

                    dark:bg-[#0a0d14]

                    dark:shadow-[0_35px_100px_rgba(0,0,0,0.75)]

                    sm:h-[min(780px,calc(100dvh-80px))]
                    sm:max-h-[calc(100dvh-80px)]

                    sm:rounded-[26px]

                    sm:border
                    sm:border-slate-200

                    dark:sm:border-white/[0.08]

                    lg:rounded-[32px]
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

                        h-40
                        w-[70%]

                        -translate-x-1/2
                        -translate-y-1/2

                        rounded-full

                        bg-indigo-500/15

                        blur-[80px]
                    "
                />

                {/* =========================================
                    1. HEADER

                    Outside the scrollable body.
                    Always visible on mobile.
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
                    <PostCreateHeader
                        isEditMode={isEditMode}

                        isSubmitting={busy}

                        onClose={handleClose}
                    />
                </div>

                {/* =========================================
                    FORM

                    Footer stays inside the form so
                    type="submit" continues working.
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
                        SCROLLABLE CONTENT

                        Header and footer stay fixed
                        within the modal panel.
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
                            TWO-COLUMN LAYOUT

                            Mobile:
                            - One column

                            Large desktop:
                            - Fields and live preview
                        ================================== */}

                        <div
                            className="
                                grid

                                min-w-0

                                grid-cols-1

                                items-start

                                lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]
                            "
                        >
                            {/* =============================
                                LEFT PANEL
                            ============================== */}

                            <div
                                className="
                                    min-w-0
                                    w-full

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
                                    INLINE FORM ERROR

                                    Moved to the top so the
                                    scroll-to-top action
                                    reveals the error.
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

                                            dark:border-red-400/20
                                            dark:bg-red-500/[0.08]

                                            sm:p-4
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

                                        {/* ERROR CONTENT */}

                                        <div
                                            className="
                                                min-w-0
                                                flex-1
                                            "
                                        >
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
                                                    [overflow-wrap:anywhere]

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

                                {/* =========================
                                    2. POST CATEGORY
                                ========================== */}

                                <div
                                    className="
                                        min-w-0
                                        w-full
                                    "
                                >
                                    <PostCreateTypeSelector
                                        value={
                                            selectedType.value
                                        }

                                        onChange={
                                            handleCategoryChange
                                        }

                                        disabled={busy}
                                    />
                                </div>

                                {/* =========================
                                    3. POST FIELDS
                                ========================== */}

                                <div
                                    className="
                                        min-w-0
                                        w-full
                                    "
                                >
                                    <PostCreateFields
                                        formData={formData}

                                        onChange={
                                            handleChange
                                        }

                                        wordCount={
                                            wordCount
                                        }

                                        disabled={busy}
                                    />
                                </div>
                            </div>

                            {/* =============================
                                RIGHT PANEL
                                LIVE PREVIEW

                                On mobile the preview
                                appears below the form.
                            ============================== */}

                            <div
                                className="
                                    w-full
                                    min-w-0

                                    overflow-hidden
                                "
                            >
                                <PostCreatePreview
                                    formData={formData}

                                    cleanPreviewContent={
                                        cleanPreviewContent
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* =====================================
                        4. FOOTER

                        Inside the form but outside
                        the scrollable area.

                        The Footer component handles
                        mobile safe-area padding.
                    ====================================== */}

                    <div
                        className="
                            relative
                            z-20

                            min-w-0
                            w-full

                            shrink-0
                        "
                    >
                        <PostCreateFooter
                            isEditMode={isEditMode}

                            isSubmitting={busy}

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

export default CreatePostModal;
