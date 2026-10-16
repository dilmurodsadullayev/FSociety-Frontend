
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import FeedbackService from "../../../services/feedback";

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
    getFeedbackErrorMessage,
} from "../feedbackHelpers";

// =========================================================
// FSOCIETY — FEEDBACK CREATE CONTROLLER
//
// Keeps the original API contract:
//
// FeedbackService.createFeedback({
//     feedbackType,
//     title,
//     message,
//     screenshot,
// });
//
// Parent props:
// - isOpen
// - onClose
// - onCreated
// =========================================================

const EMPTY_ERRORS = {
    feedbackType: "",
    title: "",
    message: "",
    screenshot: "",
};

// =========================================================
// VALIDATION
// =========================================================

const validateForm = ({
    feedbackType,
    title,
    message,
    screenshot,
}) => {
    const errors = { ...EMPTY_ERRORS };

    const validType = FEEDBACK_TYPES.some(
        (item) => item.value === feedbackType
    );

    if (!validType) {
        errors.feedbackType =
            "Feedback turini to‘g‘ri tanlang.";
    }

    const cleanTitle = String(title ?? "").trim();
    const cleanMessage = String(message ?? "").trim();

    if (cleanTitle.length < FEEDBACK_TITLE_MIN_LENGTH) {
        errors.title =
            `Sarlavha kamida ${FEEDBACK_TITLE_MIN_LENGTH} ` +
            "ta belgidan iborat bo‘lishi kerak.";
    } else if (
        cleanTitle.length > FEEDBACK_TITLE_MAX_LENGTH
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

    const fileValidation =
        validateFeedbackFile(screenshot);

    if (!fileValidation.valid) {
        errors.screenshot = fileValidation.error;
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
// HOOK
// =========================================================

const useFeedbackCreate = ({
    isOpen = false,
    onClose,
    onCreated,
} = {}) => {
    // =====================================================
    // FORM STATE
    // =====================================================

    const [feedbackType, setFeedbackType] = useState(
        FEEDBACK_DEFAULT_TYPE
    );

    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [screenshot, setScreenshot] = useState(null);

    // =====================================================
    // REQUEST STATE
    // =====================================================

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [error, setError] = useState("");

    const [fieldErrors, setFieldErrors] = useState({
        ...EMPTY_ERRORS,
    });

    // =====================================================
    // REFS
    // =====================================================

    const mountedRef = useRef(false);
    const submitLockRef = useRef(false);

    const isOpenRef = useRef(isOpen);
    const onCloseRef = useRef(onClose);
    const onCreatedRef = useRef(onCreated);

    isOpenRef.current = Boolean(isOpen);
    onCloseRef.current = onClose;
    onCreatedRef.current = onCreated;

    // =====================================================
    // TYPE CONFIG
    // =====================================================

    const selectedType = useMemo(
        () => getFeedbackTypeConfig(feedbackType),
        [feedbackType]
    );

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
    // RESET FORM
    // =====================================================

    const resetForm = useCallback(() => {
        setFeedbackType(FEEDBACK_DEFAULT_TYPE);

        setTitle("");
        setMessage("");
        setScreenshot(null);

        setError("");
        setFieldErrors({ ...EMPTY_ERRORS });
    }, []);

    // Handle external modal closing.
    useEffect(() => {
        if (!isOpen && !submitLockRef.current) {
            resetForm();
        }
    }, [isOpen, resetForm]);

    // =====================================================
    // CLEAR FIELD ERROR
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
    // TYPE CHANGE
    // =====================================================

    const handleTypeChange = useCallback(
        (nextType) => {
            if (submitLockRef.current) {
                return;
            }

            const validType = FEEDBACK_TYPES.some(
                (item) => item.value === nextType
            );

            if (!validType) {
                const message =
                    "Feedback turi noto‘g‘ri.";

                setError(message);

                setFieldErrors((previous) => ({
                    ...previous,
                    feedbackType: message,
                }));

                return;
            }

            setFeedbackType(nextType);
            clearFieldError("feedbackType");
        },
        [clearFieldError]
    );

    // =====================================================
    // TITLE CHANGE
    // =====================================================

    const handleTitleChange = useCallback(
        (value) => {
            if (submitLockRef.current) {
                return;
            }

            setTitle(String(value ?? ""));
            clearFieldError("title");
        },
        [clearFieldError]
    );

    // =====================================================
    // MESSAGE CHANGE
    // =====================================================

    const handleMessageChange = useCallback(
        (value) => {
            if (submitLockRef.current) {
                return;
            }

            setMessage(String(value ?? ""));
            clearFieldError("message");
        },
        [clearFieldError]
    );

    // =====================================================
    // SCREENSHOT CHANGE
    // =====================================================

    const handleScreenshotChange = useCallback(
        (file) => {
            if (submitLockRef.current) {
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
                setError(validation.error);

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

    // =====================================================
    // SCREENSHOT VALIDATION ERROR
    // =====================================================

    const handleScreenshotValidationError = useCallback(
        (validationMessage) => {
            if (submitLockRef.current) {
                return;
            }

            const text = String(
                validationMessage ?? ""
            ).trim();

            if (!text) {
                return;
            }

            setError(text);

            setFieldErrors((previous) => ({
                ...previous,
                screenshot: text,
            }));

            siteToast.warning(text);
        },
        []
    );

    // =====================================================
    // CLOSE
    // =====================================================

    const handleClose = useCallback(() => {
        if (submitLockRef.current) {
            return;
        }

        resetForm();

        if (
            typeof onCloseRef.current === "function"
        ) {
            onCloseRef.current();
        }
    }, [resetForm]);

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = useCallback(
        async (event) => {
            event?.preventDefault?.();

            // ============================================
            // PREVENT DUPLICATE SUBMISSIONS
            // ============================================

            if (
                !isOpenRef.current ||
                submitLockRef.current
            ) {
                return false;
            }

            // ============================================
            // CLIENT VALIDATION
            // ============================================

            const errors = validateForm({
                feedbackType,
                title,
                message,
                screenshot,
            });

            const validationMessage =
                getFirstError(errors);

            setFieldErrors(errors);

            if (validationMessage) {
                setError(validationMessage);

                siteToast.warning(validationMessage);

                return false;
            }

            // ============================================
            // LOCK REQUEST
            // ============================================

            submitLockRef.current = true;
            setIsSubmitting(true);
            setError("");

            const reward =
                getFeedbackTypeConfig(
                    feedbackType
                ).reward;

            const toastId = siteToast.loading(
                "Feedback yuborilmoqda..."
            );

            let createdFeedback;
            let requestSucceeded = false;

            // ============================================
            // API REQUEST
            // ============================================

            try {
                const response =
                    await FeedbackService.createFeedback({
                        feedbackType,
                        title: title.trim(),
                        message: message.trim(),
                        screenshot,
                    });

                createdFeedback =
                    response?.feedback ?? response;

                requestSucceeded = true;

            } catch (requestError) {
                const errorMessage =
                    getFeedbackErrorMessage(
                        requestError,
                        "Feedback yuborishda xatolik yuz berdi."
                    );

                if (
                    mountedRef.current &&
                    isOpenRef.current
                ) {
                    setError(errorMessage);
                }

                siteToast.update(
                    toastId,
                    "error",
                    errorMessage
                );

            } finally {
                submitLockRef.current = false;

                if (mountedRef.current) {
                    setIsSubmitting(false);
                }
            }

            if (!requestSucceeded) {
                return false;
            }

            // ============================================
            // API SUCCESS
            // ============================================

            siteToast.update(
                toastId,
                "success",
                (
                    "Feedback yuborildi. " +
                    "Admin tasdiqlasa " +
                    `${reward} FCoin beriladi.`
                )
            );

            if (mountedRef.current) {
                resetForm();
            }

            // ============================================
            // PARENT CALLBACK
            //
            // A callback error must not be treated
            // as a failed feedback creation.
            // ============================================

            if (
                mountedRef.current &&
                isOpenRef.current
            ) {
                if (
                    typeof onCreatedRef.current ===
                    "function"
                ) {
                    try {
                        const result =
                            onCreatedRef.current(
                                createdFeedback
                            );

                        if (
                            result &&
                            typeof result.catch === "function"
                        ) {
                            result.catch((callbackError) => {
                                console.error(
                                    "Feedback onCreated error:",
                                    callbackError
                                );
                            });
                        }
                    } catch (callbackError) {
                        console.error(
                            "Feedback onCreated error:",
                            callbackError
                        );
                    }
                }

                // ========================================
                // CLOSE MODAL
                // ========================================

                try {
                    onCloseRef.current?.();
                } catch (closeError) {
                    console.error(
                        "Feedback onClose error:",
                        closeError
                    );
                }
            }

            return true;
        },
        [
            feedbackType,
            title,
            message,
            screenshot,
            resetForm,
        ]
    );

    // =====================================================
    // PUBLIC API
    // =====================================================

    return {
        // Values
        feedbackType,
        title,
        message,
        screenshot,
        selectedType,

        // Request
        isSubmitting,
        error,
        fieldErrors,

        // Handlers
        handleTypeChange,
        handleTitleChange,
        handleMessageChange,
        handleScreenshotChange,
        handleScreenshotValidationError,
        handleSubmit,
        handleClose,
        resetForm,
    };
};

export default useFeedbackCreate;
