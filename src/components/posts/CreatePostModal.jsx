
// src/components/posts/CreatePostModal.jsx

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
// - JSON serialized error messages
//
// Prevents [object Object] from appearing in UI.
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
// Do not render untrusted HTML with
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
// VALIDATE FORM
//
// Existing rules:
//
// post_type:
// - Must match an available category.
//
// title:
// - Required.
// - At least 3 characters.
// - Maximum 150 characters.
//
// content:
// - Required.
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
    // TITLE MINIMUM
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
    // TITLE MAXIMUM
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
// - initialData is null
// - Modal manages create toast
// - Parent performs POST and Redux updates
// - Parent closes modal after success
//
// EDIT MODE:
//
// - initialData is provided
// - PostDetail manages edit toast
// - Parent performs PATCH and Redux updates
// - Parent closes modal after success
//
// RESPONSIVE:
//
// Mobile:
// - Full-screen modal
// - Scrollable content
// - Header and footer always accessible
//
// Tablet / Desktop:
// - Centered modal
// - Maximum viewport height
// - Two columns on large screens
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
    // INTERNAL SUBMISSION STATE
    //
    // Parent isSubmitting may update after a render.
    //
    // Local state + ref prevent duplicate submits
    // during the same event cycle.
    // =====================================================

    const [
        isProcessing,
        setIsProcessing,
    ] = useState(false);

    // =====================================================
    // REFS
    //
    // modalRef:
    // - Focus management
    //
    // contentScrollRef:
    // - Scrollable modal body
    // - Error visibility
    //
    // submittingRef:
    // - Duplicate submission protection
    // =====================================================

    const modalRef = useRef(null);

    const contentScrollRef = useRef(null);

    const submittingRef = useRef(false);

    // =====================================================
    // BUSY STATE
    // =====================================================

    const busy =
        Boolean(isSubmitting) ||
        isProcessing;

    // =====================================================
    // INITIAL DATA
    //
    // Reset when:
    // - Modal opens
    // - Post changes
    // - Existing post fields change
    //
    // Primitive dependencies prevent unnecessary
    // resets caused by recreated initialData objects.
    // =====================================================

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setFormData(
            getInitialFormData(initialData)
        );

        setError("");

        // Reset scroll position for every new session.

        if (contentScrollRef.current) {
            contentScrollRef.current.scrollTop = 0;
        }
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
    // Page behind the modal must not scroll.
    //
    // Modal content has its own scroll container.
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
    // ESC KEY
    //
    // Preserve original keyboard behavior.
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
    // - Focus modal on opening
    // - Restore previous focus on closing
    // =====================================================

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const previousElement =
            document.activeElement;

        modalRef.current?.focus({
            preventScroll: true,
        });

        return () => {
            if (
                previousElement &&
                typeof previousElement.focus ===
                    "function" &&
                previousElement.isConnected
            ) {
                previousElement.focus({
                    preventScroll: true,
                });
            }
        };
    }, [
        isOpen,
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
    // Expected fields:
    //
    // name="title"
    // name="content"
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
    //
    // Useful when validation/API errors occur
    // on smaller mobile screens.
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
    //
    // 1. Prevent default
    // 2. Prevent duplicates
    // 3. Validate
    // 4. Build payload
    // 5. Call parent onSubmit
    // 6. Handle create toast
    // 7. Keep modal open on failure
    //
    // Existing parent contracts are preserved.
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
            scrollToFormTop();

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

            scrollToFormTop();

            return;
        }

        // =================================================
        // PAYLOAD
        // =================================================

        const payload =
            buildPostPayload(formData);

        // =================================================
        // PREVENT DUPLICATE SUBMISSIONS
        // =================================================

        submittingRef.current = true;

        setIsProcessing(true);

        // =================================================
        // CREATE TOAST
        //
        // Edit mode toast is handled in PostDetail.
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

            const result =
                await onSubmit(payload);

            // =============================================
            // PARENT RETURNED FALSE
            //
            // Do not display success.
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
            // Do NOT call onClose here.
            //
            // Existing parents manage closing:
            //
            // ProfilePosts after creating a post.
            // PostDetail after editing a post.
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
    // All hooks remain above this condition.
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
                items-stretch
                justify-center

                overflow-hidden

                bg-slate-950/75

                p-0

                backdrop-blur-md

                dark:bg-black/80

                sm:items-center
                sm:p-4

                lg:p-6
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

                MOBILE:
                - Full-screen
                - Dynamic viewport
                - No border radius

                TABLET / DESKTOP:
                - Centered
                - Limited height
                - Rounded corners
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

                    h-[100dvh]
                    max-h-[100dvh]

                    sm:h-[92dvh]
                    sm:max-h-[900px]

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

                    Header remains outside the form's
                    scrollable body.
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

                    Footer remains inside the form
                    so type="submit" continues working.
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

                        Only this area scrolls.

                        Header stays above.
                        Footer stays below.

                        Prevent horizontal overflow.
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
                            - Fields / Live preview
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
                                    2. POST CATEGORY
                                ========================== */}

                                <div
                                    className="
                                        min-w-0
                                        w-full
                                    "
                                >
                                    <PostCreateTypeSelector
                                        value={selectedType.value}
                                        onChange={
                                            handleCategoryChange
                                        }
                                        disabled={busy}
                                    />
                                </div>

                                {/* =========================
                                    3. POST FORM FIELDS
                                ========================== */}

                                <div
                                    className="
                                        min-w-0
                                        w-full
                                    "
                                >
                                    <PostCreateFields
                                        formData={formData}
                                        onChange={handleChange}
                                        wordCount={wordCount}
                                        disabled={busy}
                                    />
                                </div>

                                {/* =========================
                                    INLINE FORM ERROR
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
                                        {/* =================
                                            ERROR ICON
                                        ================== */}

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

                                        {/* =================
                                            ERROR CONTENT
                                        ================== */}

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

                            {/* =============================
                                RIGHT PANEL — LIVE PREVIEW

                                Below form on mobile.

                                Right column on desktop.

                                Preview component keeps
                                its original props.
                            ============================== */}

                            <div
                                className="
                                    min-w-0
                                    w-full

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

                        Must stay inside <form>.

                        Does not scroll with content.

                        Mobile safe area padding is handled
                        by PostCreateFooter.
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
        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default CreatePostModal;
