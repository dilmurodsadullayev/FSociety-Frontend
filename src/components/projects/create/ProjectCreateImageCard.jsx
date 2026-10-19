
// src/components/projects/create/ProjectCreateImageCard.jsx

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
// image: { id, title, file, isNew, url }
// index: image position (0 = main image)
// isSubmitting: disable actions while saving
// onTitleChange(id, value)
// onReplace(id, file)
// onRemove(id)
//
// Parent responsibilities:
// - Image state and IDs
// - File validation
// - Object URL creation/revocation
// - FormData and API requests
//
// This component only renders image controls.
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
    // SAFE DATA
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

    const accessibleImageName =
        imageTitle.trim() || `Rasm ${index + 1}`;

    const titleFieldId =
        `project-image-title-${index}`;

    const titleCounterId =
        `project-image-title-counter-${index}`;

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
        const file = event.target.files?.[0];

        // Allow the same file to be selected again.
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

                w-full
                min-w-0
                max-w-full

                overflow-hidden

                rounded-2xl
                border
                border-slate-200

                bg-white

                transition-colors
                duration-200

                hover:border-indigo-300

                dark:border-white/[0.08]
                dark:bg-black/20
                dark:hover:border-indigo-400/20

                motion-reduce:transition-none
            "
        >
            {/* =============================================
                IMAGE PREVIEW
            ============================================== */}

            <div
                className="
                    relative

                    aspect-video

                    w-full
                    min-w-0

                    overflow-hidden

                    bg-slate-100
                    dark:bg-black/30
                "
            >
                {/* =========================================
                    PREVIEW IMAGE
                ========================================== */}

                {imageUrl ? (
                    <img
                        src={imageUrl}

                        alt={
                            imageTitle.trim() ||
                            `Loyiha rasmi ${index + 1}`
                        }

                        loading="lazy"
                        decoding="async"

                        className="
                            h-full
                            w-full

                            object-cover

                            transition-transform
                            duration-300

                            group-hover:scale-[1.02]

                            motion-reduce:transform-none
                            motion-reduce:transition-none
                        "
                    />
                ) : (
                    <div
                        className="
                            flex
                            h-full
                            min-w-0

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
                                text-[10px]
                                font-black

                                uppercase
                                tracking-wider
                            "
                        >
                            Preview
                        </span>
                    </div>
                )}

                {/* =========================================
                    IMAGE LABEL
                ========================================== */}

                <span
                    className="
                        absolute
                        left-2.5
                        top-2.5
                        z-10

                        inline-flex

                        max-w-[70%]

                        items-center

                        rounded-lg
                        border
                        border-white/15

                        bg-black/75

                        px-2.5
                        py-1.5

                        text-[10px]
                        font-black
                        text-white

                        shadow-lg
                        backdrop-blur-md

                        sm:left-3
                        sm:top-3
                    "
                >
                    {imageLabel}
                </span>

                {/* =========================================
                    REMOVE IMAGE BUTTON

                    Minimum 44x44px touch target.
                ========================================== */}

                <button
                    type="button"

                    onClick={handleRemove}

                    disabled={!canRemove}

                    title="Rasmni o‘chirish"

                    aria-label={
                        `${accessibleImageName}ni o‘chirish`
                    }

                    className="
                        absolute
                        right-2.5
                        top-2.5
                        z-10

                        grid

                        h-11
                        w-11

                        shrink-0

                        place-items-center

                        rounded-xl
                        border
                        border-red-400/30

                        bg-black/75
                        text-red-300

                        shadow-lg
                        backdrop-blur-md

                        transition-colors
                        duration-200

                        enabled:hover:border-red-400/50
                        enabled:hover:bg-red-500/25
                        enabled:hover:text-white

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-red-400
                        focus-visible:ring-offset-2
                        focus-visible:ring-offset-slate-900

                        disabled:cursor-not-allowed
                        disabled:opacity-40

                        motion-reduce:transition-none

                        sm:right-3
                        sm:top-3
                    "
                >
                    <Trash2
                        size={17}
                        aria-hidden="true"
                    />
                </button>
            </div>

            {/* =============================================
                IMAGE DETAILS
            ============================================== */}

            <div
                className="
                    min-w-0

                    space-y-3

                    p-3

                    sm:p-3.5
                "
            >
                {/* =========================================
                    IMAGE TITLE
                ========================================== */}

                <div className="min-w-0">
                    {/* =====================================
                        LABEL AND CHARACTER COUNTER
                    ====================================== */}

                    <div
                        className="
                            mb-2

                            flex
                            min-w-0
                            flex-wrap

                            items-center
                            justify-between

                            gap-2
                        "
                    >
                        <label
                            htmlFor={titleFieldId}

                            className="
                                min-w-0

                                break-words

                                text-[11px]
                                font-black

                                text-slate-600
                                dark:text-slate-300
                            "
                        >
                            Rasm sarlavhasi
                        </label>

                        <span
                            id={titleCounterId}

                            className="
                                shrink-0

                                text-[11px]
                                font-bold
                                tabular-nums

                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            {imageTitle.length}
                            {" / "}
                            {IMAGE_TITLE_MAX_LENGTH}
                        </span>
                    </div>

                    {/* =====================================
                        TITLE INPUT
                    ====================================== */}

                    <input
                        id={titleFieldId}

                        type="text"

                        value={imageTitle}
                        onChange={handleTitleChange}

                        maxLength={
                            IMAGE_TITLE_MAX_LENGTH
                        }

                        disabled={!canChangeTitle}

                        aria-describedby={
                            titleCounterId
                        }

                        placeholder="Rasm sarlavhasi"

                        className="
                            block

                            w-full
                            min-w-0
                            max-w-full

                            rounded-xl
                            border
                            border-slate-300

                            bg-slate-50

                            px-3
                            py-3

                            text-base
                            font-semibold

                            text-slate-900

                            outline-none

                            transition-colors
                            duration-200

                            placeholder:text-slate-400

                            focus:border-indigo-400
                            focus:ring-2
                            focus:ring-indigo-500/10

                            disabled:cursor-not-allowed
                            disabled:opacity-50

                            dark:border-white/[0.08]
                            dark:bg-black/20
                            dark:text-white

                            dark:placeholder:text-slate-500
                            dark:focus:border-indigo-400/30

                            motion-reduce:transition-none
                        "
                    />
                </div>

                {/* =========================================
                    REPLACE IMAGE

                    Native file input is preserved.
                    Keyboard focus is visible.
                ========================================== */}

                <label
                    className={`
                        group/replace
                        relative

                        flex

                        min-h-11
                        w-full
                        min-w-0
                        max-w-full

                        items-center
                        justify-center

                        gap-2

                        rounded-xl
                        border
                        border-dashed

                        px-3
                        py-3

                        text-center
                        text-[11px]
                        font-black

                        transition-colors
                        duration-200

                        focus-within:outline-none
                        focus-within:ring-2
                        focus-within:ring-indigo-500/50
                        focus-within:ring-offset-2

                        dark:focus-within:ring-offset-[#0b1018]

                        motion-reduce:transition-none

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
                    {/* =====================================
                        UPLOAD ICON
                    ====================================== */}

                    <UploadCloud
                        size={17}
                        aria-hidden="true"
                        className="shrink-0"
                    />

                    {/* =====================================
                        FILE NAME / REPLACE LABEL
                    ====================================== */}

                    <span
                        className="
                            min-w-0
                            flex-1

                            break-words
                            [overflow-wrap:anywhere]
                        "
                    >
                        {imageFile?.name ||
                            "Rasmni almashtirish"}
                    </span>

                    {/* =====================================
                        FILE INPUT
                    ====================================== */}

                    <input
                        type="file"

                        accept={IMAGE_ACCEPT}

                        disabled={!canReplace}

                        onChange={
                            handleReplaceFile
                        }

                        aria-label={
                            `${accessibleImageName}ni almashtirish`
                        }

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
