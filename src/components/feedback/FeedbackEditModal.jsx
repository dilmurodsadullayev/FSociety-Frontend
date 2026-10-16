
import React from "react";

// =========================================================
// EDIT MODAL COMPONENTS
// =========================================================

import FeedbackEditModalShell from "./editModal/FeedbackEditModalShell";
import useFeedbackEdit from "./editModal/useFeedbackEdit";

// =========================================================
// REUSABLE FEEDBACK FORM COMPONENTS
// =========================================================

import FeedbackTypeSelector from "./createModal/FeedbackTypeSelector";
import FeedbackTextFields from "./createModal/FeedbackTextFields";
import FeedbackScreenshotField from "./createModal/FeedbackScreenshotField";
import FeedbackRewardInfo from "./createModal/FeedbackRewardInfo";

// =========================================================
// FSOCIETY — FEEDBACK EDIT MODAL
//
// Existing props preserved:
// - isOpen
// - feedback
// - isSubmitting
// - onClose
// - onSubmit
//
// Parent callback contract preserved:
// onSubmit(feedback.id, payload)
//
// No direct API requests.
// =========================================================

const FeedbackEditModal = ({
    isOpen = false,
    feedback = null,
    isSubmitting = false,
    onClose,
    onSubmit,
}) => {
    // =====================================================
    // CONTROLLER
    // =====================================================

    const {
        feedbackType,
        title,
        message,
        screenshot,

        existingScreenshot,
        canEdit,
        hasChanges,

        isSaving,
        error,
        fieldErrors,

        handleTypeChange,
        handleTitleChange,
        handleMessageChange,
        handleScreenshotChange,
        handleScreenshotValidationError,

        handleSubmit,
        handleClose,
    } = useFeedbackEdit({
        isOpen,
        feedback,
        isSubmitting,
        onClose,
        onSubmit,
    });

    // =====================================================
    // DERIVED STATE
    // =====================================================

    const open = Boolean(
        isOpen && feedback
    );

    const fieldsDisabled =
        isSaving || !canEdit;

    const canSave =
        canEdit &&
        hasChanges &&
        typeof onSubmit === "function";

    // =====================================================
    // JSX
    // =====================================================

    return (
        <FeedbackEditModalShell
            isOpen={open}
            isSubmitting={isSaving}
            hasChanges={hasChanges}
            canSave={canSave}
            error={error}
            onClose={handleClose}
            onSubmit={handleSubmit}
        >
            {/* ======================================
                PERMISSION STATE
            ====================================== */}

            {!canEdit && (
                <div
                    role="alert"
                    className="
                        rounded-2xl
                        border
                        border-amber-300

                        bg-amber-50

                        px-4
                        py-3

                        text-xs
                        font-medium
                        leading-6

                        text-amber-900

                        dark:border-amber-400/20
                        dark:bg-amber-500/[0.06]
                        dark:text-amber-200
                    "
                >
                    Bu feedbackni tahrirlashga
                    ruxsat yo‘q. Admin
                    ko‘rib chiqishni boshlagan
                    yoki feedback yakuniy
                    holatga o‘tgan bo‘lishi mumkin.
                </div>
            )}

            {/* ======================================
                FEEDBACK TYPE
            ====================================== */}

            <div className="min-w-0">
                <FeedbackTypeSelector
                    value={feedbackType}
                    onChange={handleTypeChange}
                    disabled={fieldsDisabled}
                    compact
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
                            leading-5

                            text-red-700
                            dark:text-red-300
                        "
                    >
                        {fieldErrors.feedbackType}
                    </p>
                )}
            </div>

            {/* ======================================
                TITLE AND MESSAGE
            ====================================== */}

            <FeedbackTextFields
                title={title}
                message={message}
                feedbackType={feedbackType}

                onTitleChange={handleTitleChange}
                onMessageChange={handleMessageChange}

                disabled={fieldsDisabled}

                titleError={fieldErrors.title}
                messageError={fieldErrors.message}
            />

            {/* ======================================
                SCREENSHOT

                If a new image is removed, the
                existing image remains unchanged.
            ====================================== */}

            <FeedbackScreenshotField
                screenshot={screenshot}
                existingScreenshot={
                    existingScreenshot
                }
                onChange={
                    handleScreenshotChange
                }
                onValidationError={
                    handleScreenshotValidationError
                }
                disabled={fieldsDisabled}
            />

            {/* ======================================
                REWARD INFORMATION
            ====================================== */}

            <FeedbackRewardInfo
                feedbackType={feedbackType}
                showHeading
                compact
            />
        </FeedbackEditModalShell>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(
    FeedbackEditModal
);
