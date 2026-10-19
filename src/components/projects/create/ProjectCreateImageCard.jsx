
import React, { memo } from "react";

import {
    FileImage,
    Trash2,
    UploadCloud,
} from "lucide-react";

// =========================================================
// CONSTANTS
// =========================================================

const IMAGE_TITLE_MAX_LENGTH = 100;

const IMAGE_ACCEPT =
    "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp";

// =========================================================
// PROJECT CREATE IMAGE CARD
//
// Props:
//
// image:
// {
//     id,
//     title,
//     file,
//     isNew,
//     url
// }
//
// index:
//   Image position.
//
// isSubmitting:
//   Disable changes while submitting.
//
// onTitleChange:
//   Parent handleImageTitleChange(id, value).
//
// onReplace:
//   Parent handleReplaceImage(id, file).
//
// onRemove:
//   Parent handleRemoveImage(id).
//
// IMPORTANT:
//
// - Image state remains in CreateProjectModal.
// - Object URLs are managed by the parent.
// - Existing image IDs must be preserved.
// - This component does not revoke object URLs.
// =========================================================

const ProjectCreateImageCard = ({
    image,
    index = 0,
    isSubmitting = false,

    onTitleChange,
    onReplace,
    onRemove,
}) => {
    // =====================================================
    // SAFE VALUES
    // =====================================================

    const imageId = image?.id;

    const imageTitle =
        typeof image?.title === "string"
            ? image.title
            : "";

    const imageUrl =
        typeof image?.url === "string"
            ? image.url
            : "";

    const imageFile = image?.file || null;

    const imageLabel =
        index === 0
            ? "Asosiy"
            : `#${index + 1}`;

    // =====================================================
    // PERMISSIONS
    // =====================================================

    const canChangeTitle =
        !isSubmitting &&
        typeof onTitleChange === "function";

    const canReplace =
        !isSubmitting &&
        typeof onReplace === "function";

    const canRemove =
        !isSubmitting &&
        typeof onRemove === "function";

    // =====================================================
    // HANDLERS
    // =====================================================

    const handleTitleChange = (event) => {
        if (!canChangeTitle) {
            return;
        }

        onTitleChange(
            imageId,
            event.target.value
        );
    };

    const handleReplaceFile = (event) => {
        const file =
            event.target.files?.[0];

        // Allow selecting the same file again.

        event.target.value = "";

        if (!file || !canReplace) {
            return;
        }

        onReplace(imageId, file);
    };

    const handleRemove = () => {
        if (!canRemove) {
            return;
        }

        onRemove(imageId);
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <article
            className="
                group
                relative
                min-w-0
                overflow-hidden

                rounded-2xl
                border

                border-slate-200
                bg-white

                transition-all
                duration-200

                hover:border-indigo-300

                dark:border-white/[0.08]
                dark:bg-black/20

                dark:hover:border-indigo-400/20
            "
        >
            {/* =====================================
                IMAGE PREVIEW
            ====================================== */}

            <div
                className="
                    relative
                    aspect-video
                    overflow-hidden

                    bg-slate-100
                    dark:bg-black/30
                "
            >
                {/* =================================
                    PREVIEW IMAGE
                ================================== */}

                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={
                            imageTitle ||
                            `Loyiha rasmi ${index + 1}`
                        }
                        loading="lazy"
                        className="
                            h-full
                            w-full

                            object-cover

                            transition-transform
                            duration-300

                            group-hover:scale-[1.02]

                            motion-reduce:transform-none
                        "
                    />
                ) : (
                    <div
                        className="
                            flex
                            h-full
                            flex-col

                            items-center
                            justify-center
                            gap-2

                            text-slate-400
                            dark:text-slate-600
                        "
                    >
                        <FileImage
                            size={32}
                            aria-hidden="true"
                        />

                        <span
                            className="
                                text-[9px]
                                font-black

                                uppercase
                                tracking-wider
                            "
                        >
                            Preview
                        </span>
                    </div>
                )}

                {/* =================================
                    IMAGE LABEL
                ================================== */}

                <span
                    className="
                        absolute
                        left-3
                        top-3

                        inline-flex
                        items-center

                        rounded-lg
                        border

                        border-white/15
                        bg-black/75

                        px-2.5
                        py-1

                        text-[9px]
                        font-black
                        text-white

                        shadow-lg
                        backdrop-blur-md
                    "
                >
                    {imageLabel}
                </span>

                {/* =================================
                    DELETE BUTTON
                ================================== */}

                <button
                    type="button"
                    onClick={handleRemove}
                    disabled={!canRemove}
                    title="Rasmni o‘chirish"
                    aria-label={`${
                        imageTitle ||
                        `Rasm ${index + 1}`
                    }ni o‘chirish`}
                    className="
                        absolute
                        right-3
                        top-3

                        grid
                        h-9
                        w-9

                        place-items-center

                        rounded-xl
                        border

                        border-red-400/30
                        bg-black/75

                        text-red-300

                        shadow-lg
                        backdrop-blur-md

                        transition-all
                        duration-200

                        hover:border-red-400/50
                        hover:bg-red-500/25
                        hover:text-white

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-red-400

                        disabled:cursor-not-allowed
                        disabled:opacity-40
                    "
                >
                    <Trash2
                        size={15}
                        aria-hidden="true"
                    />
                </button>
            </div>

            {/* =====================================
                IMAGE FIELDS
            ====================================== */}

            <div className="space-y-3 p-3.5">
                {/* =================================
                    IMAGE TITLE
                ================================== */}

                <div className="min-w-0">
                    <label
                        htmlFor={`project-image-title-${index}`}
                        className="
                            mb-2
                            block

                            text-[10px]
                            font-black

                            text-slate-600
                            dark:text-slate-400
                        "
                    >
                        Rasm sarlavhasi
                    </label>

                    <input
                        id={`project-image-title-${index}`}
                        type="text"

                        value={imageTitle}
                        onChange={handleTitleChange}

                        maxLength={
                            IMAGE_TITLE_MAX_LENGTH
                        }

                        disabled={!canChangeTitle}

                        placeholder="Rasm sarlavhasi"

                        className="
                            w-full
                            min-w-0

                            rounded-xl
                            border

                            border-slate-300
                            bg-slate-50

                            px-3
                            py-2.5

                            text-xs
                            font-semibold

                            text-slate-900

                            outline-none
                            transition-colors

                            placeholder:text-slate-400

                            focus:border-indigo-400
                            focus:ring-2
                            focus:ring-indigo-500/10

                            disabled:cursor-not-allowed
                            disabled:opacity-50

                            dark:border-white/[0.08]
                            dark:bg-black/20
                            dark:text-white

                            dark:placeholder:text-slate-600
                            dark:focus:border-indigo-400/30
                        "
                    />

                    {/* CHARACTER COUNT */}

                    <div
                        className="
                            mt-1.5
                            text-right

                            text-[9px]
                            font-medium
                            tabular-nums

                            text-slate-500
                            dark:text-slate-500
                        "
                    >
                        {imageTitle.length}
                        /
                        {IMAGE_TITLE_MAX_LENGTH}
                    </div>
                </div>

                {/* =================================
                    REPLACE IMAGE
                ================================== */}

                <label
                    className={`
                        group/replace

                        flex
                        min-h-[43px]
                        min-w-0

                        items-center
                        justify-center
                        gap-2

                        rounded-xl
                        border
                        border-dashed

                        px-3
                        py-3

                        text-[10px]
                        font-black

                        transition-all

                        ${
                            canReplace
                                ? `
                                    cursor-pointer

                                    border-slate-300
                                    bg-slate-50

                                    text-slate-600

                                    hover:border-indigo-400
                                    hover:bg-indigo-50
                                    hover:text-indigo-700

                                    dark:border-white/[0.12]
                                    dark:bg-white/[0.02]
                                    dark:text-slate-400

                                    dark:hover:border-indigo-400/30
                                    dark:hover:bg-indigo-500/[0.05]
                                    dark:hover:text-indigo-300
                                `
                                : `
                                    cursor-not-allowed
                                    border-slate-200
                                    bg-slate-50
                                    text-slate-400
                                    opacity-50

                                    dark:border-white/[0.06]
                                    dark:bg-white/[0.02]
                                `
                        }
                    `}
                >
                    <UploadCloud
                        size={16}
                        aria-hidden="true"
                        className="shrink-0"
                    />

                    <span className="min-w-0 truncate">
                        {imageFile?.name ||
                            "Rasmni almashtirish"}
                    </span>

                    <input
                        type="file"
                        accept={IMAGE_ACCEPT}
                        disabled={!canReplace}
                        onChange={handleReplaceFile}
                        aria-label={`${
                            imageTitle ||
                            `Rasm ${index + 1}`
                        }ni almashtirish`}
                        className="sr-only"
                    />
                </label>
            </div>
        </article>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProjectCreateImageCard);
