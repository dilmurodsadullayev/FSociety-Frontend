
import React from "react";

// =========================================================
// FSOCIETY — FEEDBACK CREATE MODAL
//
// Responsibilities:
// - Connect UI components to the controller
// - Preserve the existing public props
//
// Props:
// - isOpen
// - onClose
// - onCreated
//
// No direct API requests.
// No duplicated form state.
// =========================================================

// =========================================================
// MODAL COMPONENTS
// =========================================================

import FeedbackCreateModalShell from "./createModal/FeedbackCreateModalShell";

import FeedbackTypeSelector from "./createModal/FeedbackTypeSelector";

import FeedbackTextFields from "./createModal/FeedbackTextFields";

import FeedbackScreenshotField from "./createModal/FeedbackScreenshotField";

import FeedbackRewardInfo from "./createModal/FeedbackRewardInfo";

// =========================================================
// CONTROLLER
// =========================================================

import useFeedbackCreate from "./createModal/useFeedbackCreate";

// =========================================================
// MAIN COMPONENT
// =========================================================

const FeedbackCreateModal = ({
    isOpen = false,
    onClose,
    onCreated,
}) => {
    // =====================================================
    // FORM CONTROLLER
    // =====================================================

    const {
        // Form values
        feedbackType,
        title,
        message,
        screenshot,

        // Request state
        isSubmitting,
        error,
        fieldErrors,

        // Field handlers
        handleTypeChange,
        handleTitleChange,
        handleMessageChange,
        handleScreenshotChange,
        handleScreenshotValidationError,

        // Form actions
        handleSubmit,
        handleClose,
    } = useFeedbackCreate({
        isOpen,
        onClose,
        onCreated,
    });

    // =====================================================
    // JSX
    // =====================================================

    return (
        <FeedbackCreateModalShell
            isOpen={isOpen}
            onClose={handleClose}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={error}
        >
            {/* ==========================================
                FEEDBACK TYPE
            ========================================== */}

            <div className="min-w-0">
                <FeedbackTypeSelector
                    value={feedbackType}
                    onChange={handleTypeChange}
                    disabled={isSubmitting}
                    showReward
                />

                {fieldErrors.feedbackType && (
                    <p
                        role="alert"
                        className="
                            mt-2
                            break-words
                            text-xs
                            font-medium
                            text-red-700
                            dark:text-red-300
                        "
                    >
                        {fieldErrors.feedbackType}
                    </p>
                )}
            </div>

            {/* ==========================================
                TITLE AND MESSAGE
            ========================================== */}

            <FeedbackTextFields
                title={title}
                message={message}
                feedbackType={feedbackType}
                onTitleChange={handleTitleChange}
                onMessageChange={handleMessageChange}
                disabled={isSubmitting}
                titleError={fieldErrors.title}
                messageError={fieldErrors.message}
            />

            {/* ==========================================
                SCREENSHOT UPLOAD
            ========================================== */}

            <div className="min-w-0">
                <FeedbackScreenshotField
                    screenshot={screenshot}
                    onChange={handleScreenshotChange}
                    onValidationError={
                        handleScreenshotValidationError
                    }
                    disabled={isSubmitting}
                />

                {fieldErrors.screenshot && (
                    <p
                        role="alert"
                        className="
                            mt-2
                            break-words
                            text-xs
                            font-medium
                            text-red-700
                            dark:text-red-300
                        "
                    >
                        {fieldErrors.screenshot}
                    </p>
                )}
            </div>

            {/* ==========================================
                FCOIN INFORMATION
            ========================================== */}

            <FeedbackRewardInfo
                feedbackType={feedbackType}
                showHeading
            />
        </FeedbackCreateModalShell>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(FeedbackCreateModal);
