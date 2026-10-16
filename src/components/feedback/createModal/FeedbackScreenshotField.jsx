
import React, {
    useEffect,
    useId,
    useRef,
    useState,
} from "react";

import {
    FileImage,
    ImageOff,
    ImagePlus,
    Trash2,
    UploadCloud,
} from "lucide-react";

import {
    FEEDBACK_ACCEPT,
    FEEDBACK_ALLOWED_FILE_TYPES,
    FEEDBACK_MAX_FILE_SIZE,
    formatFeedbackFileSize,
} from "../feedbackConfig";

// =========================================================
// FSOCIETY — FEEDBACK SCREENSHOT FIELD
//
// Features:
// - Dark / Light Mode
// - Responsive upload area
// - JPG / PNG / WEBP validation
// - Maximum 5 MB
// - Screenshot preview
// - Safe Object URL cleanup
// - Remove selected screenshot
// - Replace existing screenshot
// - Upload errors
//
// No direct API requests.
//
// Props:
// - screenshot
// - onChange(file | null)
// - disabled
// - existingScreenshot
// - onValidationError(message)
// =========================================================

const FeedbackScreenshotField = ({
    screenshot = null,
    onChange,
    disabled = false,
    existingScreenshot = null,
    onValidationError,
}) => {
    // =====================================================
    // REFS / IDS
    // =====================================================

    const inputRef = useRef(null);
    const labelId = useId();

    // =====================================================
    // STATE
    // =====================================================

    const [preview, setPreview] = useState({
        file: null,
        url: null,
    });

    const [localError, setLocalError] =
        useState("");

    const [brokenImage, setBrokenImage] =
        useState(false);

    // =====================================================
    // DERIVED VALUES
    // =====================================================

    const canChange =
        !disabled &&
        typeof onChange === "function";

    // Only use the preview belonging to the
    // currently selected File.
    const newPreviewUrl =
        screenshot &&
        preview.file === screenshot
            ? preview.url
            : null;

    const previewUrl = screenshot
        ? newPreviewUrl
        : existingScreenshot;

    const hasNewFile = Boolean(screenshot);

    const hasExistingImage =
        Boolean(existingScreenshot);

    // =====================================================
    // OBJECT URL LIFECYCLE
    // =====================================================

    useEffect(() => {
        if (!screenshot) {
            setPreview({
                file: null,
                url: null,
            });

            return undefined;
        }

        if (
            typeof URL === "undefined" ||
            typeof URL.createObjectURL !== "function"
        ) {
            return undefined;
        }

        const objectUrl =
            URL.createObjectURL(screenshot);

        setPreview({
            file: screenshot,
            url: objectUrl,
        });

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [screenshot]);

    // =====================================================
    // RESET IMAGE ERROR
    // =====================================================

    useEffect(() => {
        setBrokenImage(false);
    }, [previewUrl]);

    // =====================================================
    // OPEN FILE PICKER
    // =====================================================

    const openFilePicker = () => {
        if (!canChange) {
            return;
        }

        inputRef.current?.click();
    };

    // =====================================================
    // VALIDATE FILE
    // =====================================================

    const validateFile = (file) => {
        if (
            !FEEDBACK_ALLOWED_FILE_TYPES.includes(
                file?.type
            )
        ) {
            return (
                "Faqat JPG, PNG yoki WEBP " +
                "rasm yuklash mumkin."
            );
        }

        const size = Number(file?.size);

        if (
            !Number.isFinite(size) ||
            size <= 0
        ) {
            return (
                "Tanlangan rasm bo‘sh yoki " +
                "noto‘g‘ri."
            );
        }

        if (size > FEEDBACK_MAX_FILE_SIZE) {
            return (
                "Skrinshot hajmi " +
                formatFeedbackFileSize(
                    FEEDBACK_MAX_FILE_SIZE
                ) +
                " dan oshmasligi kerak."
            );
        }

        return "";
    };

    // =====================================================
    // FILE CHANGE
    // =====================================================

    const handleFileChange = (event) => {
        if (!canChange) {
            return;
        }

        const file =
            event.target.files?.[0];

        // Allow selecting the same file again.
        event.target.value = "";

        if (!file) {
            return;
        }

        const validationError =
            validateFile(file);

        if (validationError) {
            setLocalError(validationError);

            if (
                typeof onValidationError === "function"
            ) {
                onValidationError(
                    validationError
                );
            }

            return;
        }

        setLocalError("");
        setBrokenImage(false);

        onChange(file);
    };

    // =====================================================
    // REMOVE FILE
    // =====================================================

    const handleRemove = () => {
        if (
            !canChange ||
            !hasNewFile
        ) {
            return;
        }

        setLocalError("");
        setBrokenImage(false);

        if (inputRef.current) {
            inputRef.current.value = "";
        }

        onChange(null);
    };

    // =====================================================
    // IMAGE PREVIEW
    // =====================================================

    const showImage =
        Boolean(previewUrl) &&
        !brokenImage;

    // =====================================================
    // JSX
    // =====================================================

    return (
        <section
            role="group"
            aria-labelledby={labelId}
            className="w-full min-w-0"
        >
            {/* HEADER */}

            <div
                className="
                    mb-3
                    flex
                    items-center
                    gap-2
                "
            >
                <h3
                    id={labelId}
                    className="
                        font-display
                        text-[11px]
                        font-bold
                        uppercase
                        tracking-[0.10em]

                        text-slate-700
                        dark:text-gray-300
                    "
                >
                    Skrinshot
                </h3>

                <span
                    className="
                        text-[10px]
                        font-medium

                        text-slate-500
                        dark:text-gray-500
                    "
                >
                    ixtiyoriy
                </span>
            </div>

            {/* ======================================
                EMPTY UPLOAD STATE
            ====================================== */}

            {!hasNewFile &&
            !hasExistingImage ? (
                <button
                    type="button"
                    onClick={openFilePicker}
                    disabled={!canChange}
                    className="
                        group/upload

                        flex
                        min-h-[150px]
                        w-full
                        min-w-0

                        flex-col
                        items-center
                        justify-center
                        gap-2

                        rounded-2xl
                        border
                        border-dashed
                        border-slate-300

                        bg-slate-50/70

                        px-4
                        py-6

                        text-center
                        transition-colors

                        hover:border-indigo-400/50
                        hover:bg-indigo-500/[0.04]

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-indigo-500

                        disabled:cursor-not-allowed
                        disabled:opacity-50

                        dark:border-white/[0.12]
                        dark:bg-white/[0.025]

                        dark:hover:border-indigo-400/30
                        dark:hover:bg-indigo-400/[0.05]
                    "
                >
                    <div
                        className="
                            grid
                            h-12
                            w-12
                            place-items-center

                            rounded-2xl
                            border
                            border-indigo-400/20

                            bg-indigo-500/[0.08]

                            text-indigo-700

                            dark:border-indigo-400/15
                            dark:text-indigo-300
                        "
                    >
                        <UploadCloud
                            size={23}
                            strokeWidth={1.9}
                            aria-hidden="true"
                        />
                    </div>

                    <span
                        className="
                            mt-1
                            font-display
                            text-[13px]
                            font-bold

                            text-slate-800
                            dark:text-gray-200
                        "
                    >
                        Skrinshot tanlang
                    </span>

                    <span
                        className="
                            text-[11px]
                            font-medium
                            leading-5

                            text-slate-500
                            dark:text-gray-400
                        "
                    >
                        JPG, PNG yoki WEBP
                        {" · "}
                        maksimal 5 MB
                    </span>
                </button>
            ) : (
                /* ==================================
                    SELECTED OR EXISTING SCREENSHOT
                ================================== */

                <div
                    className="
                        w-full
                        min-w-0
                        overflow-hidden

                        rounded-2xl
                        border
                        border-slate-200

                        bg-white

                        dark:border-white/[0.09]
                        dark:bg-white/[0.025]
                    "
                >
                    {/* IMAGE */}

                    <div
                        className="
                            relative

                            flex
                            min-h-[110px]
                            max-h-[300px]

                            items-center
                            justify-center

                            overflow-hidden

                            bg-slate-100

                            dark:bg-black/25
                        "
                    >
                        {showImage ? (
                            <img
                                src={previewUrl}
                                alt={
                                    hasNewFile
                                        ? "Yangi skrinshot"
                                        : "Joriy skrinshot"
                                }
                                onError={() => {
                                    setBrokenImage(true);
                                }}
                                className="
                                    block
                                    max-h-[300px]
                                    max-w-full
                                    object-contain
                                "
                            />
                        ) : (
                            <div
                                className="
                                    flex
                                    min-h-[110px]
                                    flex-col
                                    items-center
                                    justify-center
                                    gap-2

                                    px-4
                                    py-6

                                    text-center

                                    text-slate-500
                                    dark:text-gray-400
                                "
                            >
                                <ImageOff
                                    size={24}
                                    aria-hidden="true"
                                />

                                <p className="text-xs">
                                    {brokenImage
                                        ? "Skrinshotni ko‘rsatib bo‘lmadi."
                                        : "Skrinshot tayyorlanmoqda..."}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* IMAGE FOOTER */}

                    <div
                        className="
                            flex
                            min-w-0
                            flex-wrap
                            items-center
                            justify-between
                            gap-3

                            border-t
                            border-slate-200

                            px-3
                            py-3

                            sm:px-4

                            dark:border-white/[0.08]
                        "
                    >
                        <div
                            className="
                                flex
                                min-w-0
                                flex-1
                                items-center
                                gap-2
                            "
                        >
                            <FileImage
                                size={17}
                                aria-hidden="true"
                                className="
                                    shrink-0
                                    text-indigo-600
                                    dark:text-indigo-300
                                "
                            />

                            <div className="min-w-0 flex-1">
                                <p
                                    className="
                                        truncate
                                        text-xs
                                        font-bold

                                        text-slate-800
                                        dark:text-gray-200
                                    "
                                >
                                    {hasNewFile
                                        ? screenshot.name
                                        : "Joriy skrinshot"}
                                </p>

                                <p
                                    className="
                                        mt-0.5
                                        text-[10px]

                                        text-slate-500
                                        dark:text-gray-500
                                    "
                                >
                                    {hasNewFile
                                        ? formatFeedbackFileSize(
                                            screenshot.size
                                        )
                                        : "Yangi rasm bilan almashtirish mumkin"}
                                </p>
                            </div>
                        </div>

                        {/* REMOVE / REPLACE */}

                        {hasNewFile ? (
                            <button
                                type="button"
                                onClick={handleRemove}
                                disabled={!canChange}
                                aria-label="Tanlangan skrinshotni olib tashlash"
                                className="
                                    inline-flex
                                    min-h-9
                                    items-center
                                    justify-center
                                    gap-1.5

                                    rounded-xl
                                    border
                                    border-red-400/30

                                    bg-red-500/[0.07]

                                    px-3
                                    py-2

                                    text-[11px]
                                    font-bold

                                    text-red-700

                                    hover:bg-red-500/[0.12]

                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-red-500

                                    disabled:cursor-not-allowed
                                    disabled:opacity-50

                                    dark:border-red-400/20
                                    dark:bg-red-400/[0.06]
                                    dark:text-red-300
                                "
                            >
                                <Trash2
                                    size={14}
                                    aria-hidden="true"
                                />
                                Olib tashlash
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={openFilePicker}
                                disabled={!canChange}
                                className="
                                    inline-flex
                                    min-h-9
                                    items-center
                                    justify-center
                                    gap-1.5

                                    rounded-xl
                                    border
                                    border-indigo-400/30

                                    bg-indigo-500/[0.07]

                                    px-3
                                    py-2

                                    text-[11px]
                                    font-bold

                                    text-indigo-700

                                    hover:bg-indigo-500/[0.12]

                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-indigo-500

                                    disabled:cursor-not-allowed
                                    disabled:opacity-50

                                    dark:border-indigo-400/20
                                    dark:bg-indigo-400/[0.07]
                                    dark:text-indigo-300
                                "
                            >
                                <ImagePlus
                                    size={14}
                                    aria-hidden="true"
                                />
                                Almashtirish
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* FILE INPUT */}

            <input
                ref={inputRef}
                type="file"
                accept={FEEDBACK_ACCEPT}
                onChange={handleFileChange}
                disabled={!canChange}
                tabIndex={-1}
                aria-label="Feedback skrinshotini tanlash"
                className="sr-only"
            />

            {/* VALIDATION ERROR */}

            {localError && (
                <p
                    role="alert"
                    className="
                        mt-3
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50

                        px-3
                        py-2.5

                        text-xs
                        font-medium
                        leading-5

                        text-red-700

                        dark:border-red-400/20
                        dark:bg-red-500/[0.07]
                        dark:text-red-300
                    "
                >
                    {localError}
                </p>
            )}
        </section>
    );
};

export default React.memo(
    FeedbackScreenshotField
);
