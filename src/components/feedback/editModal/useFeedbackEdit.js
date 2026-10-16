
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import { siteToast } from "../../ui/AuthToast";

import {
    FEEDBACK_DEFAULT_TYPE,
    FEEDBACK_MESSAGE_MIN_LENGTH,
    FEEDBACK_TITLE_MAX_LENGTH,
    FEEDBACK_TITLE_MIN_LENGTH,
    FEEDBACK_TYPES,
    getFeedbackTypeConfig,
    validateFeedbackFile,
} from "../feedbackConfig";

import {
    canModifyFeedback,
    getFeedbackErrorMessage,
    getFeedbackScreenshot,
} from "../feedbackHelpers";

// =========================================================
// FSOCIETY — FEEDBACK EDIT CONTROLLER
//
// Preserves the existing parent API:
//
// onSubmit(feedback.id, {
//     feedbackType,
//     title,
//     message,
//     screenshot: File | undefined,
// })
//
// Existing modal props:
// - isOpen
// - feedback
// - isSubmitting
// - onClose
// - onSubmit
// =========================================================

const EMPTY_ERRORS = {
    feedbackType: "",
    title: "",
    message: "",
    screenshot: "",
};

// =========================================================
// INITIAL VALUES
// =========================================================

const isValidType = (value) =>
    FEEDBACK_TYPES.some(
        (item) => item.value === value
    );

const getInitialType = (feedback) => {
    const type =
        feedback?.feedback_type ??
        feedback?.feedbackType;

    return isValidType(type)
        ? type
        : FEEDBACK_DEFAULT_TYPE;
};

const getInitialTitle = (feedback) =>
    String(feedback?.title ?? "");

const getInitialMessage = (feedback) =>
    String(feedback?.message ?? "");

// =========================================================
// VALIDATION
// =========================================================

const validateEditForm = ({
    feedbackType,
    title,
    message,
    screenshot,
}) => {
    const errors = { ...EMPTY_ERRORS };

    if (!isValidType(feedbackType)) {
        errors.feedbackType =
            "Feedback turini to‘g‘ri tanlang.";
    }

    const cleanTitle =
        String(title ?? "").trim();

    const cleanMessage =
        String(message ?? "").trim();

    if (
        cleanTitle.length <
        FEEDBACK_TITLE_MIN_LENGTH
    ) {
        errors.title =
            `Sarlavha kamida ${FEEDBACK_TITLE_MIN_LENGTH} ` +
            "ta belgidan iborat bo‘lishi kerak.";
    } else if (
        cleanTitle.length >
        FEEDBACK_TITLE_MAX_LENGTH
    ) {
        errors.title =
            `Sarlavha ${FEEDBACK_TITLE_MAX_LENGTH} ` +
            "ta belgidan oshmasligi kerak.";
    }

    if (
        cleanMessage.length <
        FEEDBACK_MESSAGE_MIN_LENGTH
    ) {
        errors.message =
            `Feedback matni kamida ${FEEDBACK_MESSAGE_MIN_LENGTH} ` +
            "ta belgidan iborat bo‘lishi kerak.";
    }

    const validation =
        validateFeedbackFile(screenshot);

    if (!validation.valid) {
        errors.screenshot = validation.error;
    }

    return errors;
};

const getFirstError = (errors) =>
    errors.feedbackType ||
    errors.title ||
    errors.message ||
    errors.screenshot ||
    "";

// =========================================================
// MAIN HOOK
// =========================================================

const useFeedbackEdit = ({
    isOpen = false,
    feedback = null,
    isSubmitting = false,
    onClose,
    onSubmit,
} = {}) => {
    // =====================================================
    // FORM STATE
    // =====================================================

    const [feedbackType, setFeedbackType] =
        useState(() => getInitialType(feedback));

    const [title, setTitle] =
        useState(() => getInitialTitle(feedback));

    const [message, setMessage] =
        useState(() => getInitialMessage(feedback));

    const [screenshot, setScreenshot] =
        useState(null);

    // =====================================================
    // REQUEST / ERROR STATE
    // =====================================================

    const [isSavingLocal, setIsSavingLocal] =
        useState(false);

    const [error, setError] =
        useState("");

    const [fieldErrors, setFieldErrors] =
        useState({ ...EMPTY_ERRORS });

    // =====================================================
    // REFS
    // =====================================================

    const mountedRef = useRef(false);
    const submitLockRef = useRef(false);

    const openedFeedbackIdRef = useRef(null);

    const isOpenRef = useRef(isOpen);
    const externalBusyRef = useRef(isSubmitting);

    const onCloseRef = useRef(onClose);
    const onSubmitRef = useRef(onSubmit);

    isOpenRef.current = Boolean(isOpen);
    externalBusyRef.current = Boolean(isSubmitting);

    onCloseRef.current = onClose;
    onSubmitRef.current = onSubmit;

    // =====================================================
    // DERIVED DATA
    // =====================================================

    const selectedType = useMemo(
        () => getFeedbackTypeConfig(feedbackType),
        [feedbackType]
    );

    const existingScreenshot = useMemo(
        () => getFeedbackScreenshot(feedback),
        [feedback]
    );

    const canEdit = canModifyFeedback(feedback);

    const isSaving = Boolean(
        isSubmitting || isSavingLocal
    );

    const hasChanges = useMemo(() => {
        if (!feedback) {
            return false;
        }

        return (
            feedbackType !== getInitialType(feedback) ||
            title.trim() !==
                getInitialTitle(feedback).trim() ||
            message.trim() !==
                getInitialMessage(feedback).trim() ||
            screenshot !== null
        );
    }, [
        feedback,
        feedbackType,
        title,
        message,
        screenshot,
    ]);

    // =====================================================
    // MOUNT LIFECYCLE
    // =====================================================

    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;
        };
    }, []);

    // =====================================================
    // INITIALIZE FORM
    //
    // Reset when opening a feedback or switching to
    // another feedback ID.
    //
    // Do not reset user edits on every parent render.
    // =====================================================

    useEffect(() => {
        if (!isOpen || !feedback) {
            openedFeedbackIdRef.current = null;
            return;
        }

        const nextId = String(
            feedback.id ?? ""
        );

        if (
            openedFeedbackIdRef.current === nextId
        ) {
            return;
        }

        openedFeedbackIdRef.current = nextId;

        setFeedbackType(
            getInitialType(feedback)
        );

        setTitle(
            getInitialTitle(feedback)
        );

        setMessage(
            getInitialMessage(feedback)
        );

        setScreenshot(null);
        setError("");
        setFieldErrors({ ...EMPTY_ERRORS });
    }, [isOpen, feedback]);

    // =====================================================
    // CLEAR ERROR
    // =====================================================

    const clearFieldError = useCallback((field) => {
        setFieldErrors((previous) => {
            if (!previous[field]) {
                return previous;
            }

            return {
                ...previous,
                [field]: "",
            };
        });

        setError("");
    }, []);

    // =====================================================
    // FIELD HANDLERS
    // =====================================================

    const handleTypeChange = useCallback(
        (nextType) => {
            if (
                submitLockRef.current ||
                externalBusyRef.current
            ) {
                return;
            }

            if (!isValidType(nextType)) {
                const text =
                    "Feedback turi noto‘g‘ri.";

                setFieldErrors((previous) => ({
                    ...previous,
                    feedbackType: text,
                }));

                return;
            }

            setFeedbackType(nextType);
            clearFieldError("feedbackType");
        },
        [clearFieldError]
    );

    const handleTitleChange = useCallback(
        (value) => {
            if (
                submitLockRef.current ||
                externalBusyRef.current
            ) {
                return;
            }

            setTitle(String(value ?? ""));
            clearFieldError("title");
        },
        [clearFieldError]
    );

    const handleMessageChange = useCallback(
        (value) => {
            if (
                submitLockRef.current ||
                externalBusyRef.current
            ) {
                return;
            }

            setMessage(String(value ?? ""));
            clearFieldError("message");
        },
        [clearFieldError]
    );

    // =====================================================
    // SCREENSHOT
    //
    // null means:
    // - no new image selected
    // - preserve existing backend screenshot
    // =====================================================

    const handleScreenshotChange = useCallback(
        (file) => {
            if (
                submitLockRef.current ||
                externalBusyRef.current
            ) {
                return;
            }

            if (!file) {
                setScreenshot(null);
                clearFieldError("screenshot");
                return;
            }

            const validation =
                validateFeedbackFile(file);

            if (!validation.valid) {
                setFieldErrors((previous) => ({
                    ...previous,
                    screenshot: validation.error,
                }));

                siteToast.warning(validation.error);
                return;
            }

            setScreenshot(file);
            clearFieldError("screenshot");
        },
        [clearFieldError]
    );

    const handleScreenshotValidationError =
        useCallback((validationMessage) => {
            if (
                submitLockRef.current ||
                externalBusyRef.current
            ) {
                return;
            }

            const text =
                String(validationMessage ?? "").trim();

            if (!text) {
                return;
            }

            setFieldErrors((previous) => ({
                ...previous,
                screenshot: text,
            }));

            siteToast.warning(text);
        }, []);

    // =====================================================
    // CLOSE
    // =====================================================

    const handleClose = useCallback(() => {
        if (
            submitLockRef.current ||
            externalBusyRef.current
        ) {
            return;
        }

        if (
            typeof onCloseRef.current === "function"
        ) {
            onCloseRef.current();
        }
    }, []);

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = useCallback(
        async (event) => {
            event?.preventDefault?.();

            // ============================================
            // DUPLICATE REQUEST GUARD
            // ============================================

            if (
                !isOpenRef.current ||
                submitLockRef.current ||
                externalBusyRef.current
            ) {
                return false;
            }

            // ============================================
            // FEEDBACK DATA
            // ============================================

            if (!feedback?.id) {
                const text =
                    "Feedback ma’lumotlari topilmadi.";

                setError(text);
                siteToast.error(text);

                return false;
            }

            // ============================================
            // PERMISSION CHECK
            // ============================================

            if (!canModifyFeedback(feedback)) {
                const text =
                    "Bu feedbackni tahrirlash mumkin emas.";

                setError(text);
                siteToast.warning(text);

                return false;
            }

            // ============================================
            // VALIDATION
            // ============================================

            const errors = validateEditForm({
                feedbackType,
                title,
                message,
                screenshot,
            });

            setFieldErrors(errors);

            const validationMessage =
                getFirstError(errors);

            if (validationMessage) {
                setError("");
                siteToast.warning(validationMessage);

                return false;
            }

            // ============================================
            // NO CHANGES
            // ============================================

            if (!hasChanges) {
                siteToast.info(
                    "Hech qanday o‘zgarish kiritilmadi."
                );

                return false;
            }

            // ============================================
            // PARENT CALLBACK
            // ============================================

            if (
                typeof onSubmitRef.current !== "function"
            ) {
                const text =
                    "Feedbackni saqlash funksiyasi mavjud emas.";

                setError(text);
                siteToast.error(text);

                return false;
            }

            // ============================================
            // LOCK IMMEDIATELY
            // ============================================

            submitLockRef.current = true;

            setIsSavingLocal(true);
            setError("");

            try {
                const success =
                    await onSubmitRef.current(
                        feedback.id,
                        {
                            feedbackType,

                            title: title.trim(),

                            message: message.trim(),

                            screenshot:
                                screenshot || undefined,
                        }
                    );

                // Parent controls its own API and toast.
                if (!success) {
                    if (
                        mountedRef.current &&
                        isOpenRef.current
                    ) {
                        setError(
                            "O‘zgarishlarni saqlab bo‘lmadi. Qayta urinib ko‘ring."
                        );
                    }

                    return false;
                }

                // ========================================
                // SUCCESS
                // ========================================

                if (
                    mountedRef.current &&
                    isOpenRef.current
                ) {
                    setScreenshot(null);
                    setError("");
                    setFieldErrors({ ...EMPTY_ERRORS });
                }

                return true;

            } catch (requestError) {
                const messageText =
                    getFeedbackErrorMessage(
                        requestError,
                        "Feedbackni saqlashda xatolik yuz berdi."
                    );

                if (
                    mountedRef.current &&
                    isOpenRef.current
                ) {
                    setError(messageText);
                }

                siteToast.error(messageText);

                return false;

            } finally {
                submitLockRef.current = false;

                if (mountedRef.current) {
                    setIsSavingLocal(false);
                }
            }
        },
        [
            feedback,
            feedbackType,
            title,
            message,
            screenshot,
            hasChanges,
        ]
    );

    // =====================================================
    // PUBLIC API
    // =====================================================

    return {
        // Form values
        feedbackType,
        title,
        message,
        screenshot,

        // Computed values
        selectedType,
        existingScreenshot,
        canEdit,
        hasChanges,

        // Request state
        isSaving,
        error,
        fieldErrors,

        // Field handlers
        handleTypeChange,
        handleTitleChange,
        handleMessageChange,

        handleScreenshotChange,
        handleScreenshotValidationError,

        // Actions
        handleSubmit,
        handleClose,
    };
};

export default useFeedbackEdit;
