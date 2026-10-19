
// src/components/projects/create/ProjectCreateImages.jsx

import React, { memo } from "react";

import {
    FileImage,
    Images,
    Plus,
    UploadCloud,
} from "lucide-react";

import ProjectCreateImageCard from "./ProjectCreateImageCard";

// =========================================================
// CONSTANTS
// =========================================================

const MAX_PROJECT_IMAGES = 4;
const EMPTY_IMAGES = [];

const IMAGE_ACCEPT =
    "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp";

// =========================================================
// PROJECT CREATE IMAGES
//
// Parent contracts:
//
// - images: image list
// - isSubmitting: disable changes while saving
// - onMultipleImageSelect(event): upload handler
// - onImageTitleChange(id, value): edit caption
// - onReplaceImage(id, file): replace image
// - onRemoveImage(id): remove image
//
// Parent handles:
// - File validation
// - Maximum image count enforcement
// - Object URL creation / revocation
// - Image state
// - FormData creation
//
// This component handles presentation only.
// =========================================================

const ProjectCreateImages = ({
    images = EMPTY_IMAGES,
    isSubmitting = false,
    onMultipleImageSelect,
    onImageTitleChange,
    onReplaceImage,
    onRemoveImage,
}) => {
    // =====================================================
    // SAFE IMAGES
    // =====================================================

    const safeImages = Array.isArray(images)
        ? images
        : EMPTY_IMAGES;

    // =====================================================
    // IMAGE COUNT
    // =====================================================

    const imageCount = safeImages.length;

    const remainingSlots = Math.max(
        0,
        MAX_PROJECT_IMAGES - imageCount
    );

    const isLimitReached =
        remainingSlots === 0;

    // =====================================================
    // UPLOAD PERMISSION
    // =====================================================

    const canUpload =
        !isSubmitting &&
        !isLimitReached &&
        typeof onMultipleImageSelect === "function";

    // =====================================================
    // UPLOAD CHANGE
    //
    // The parent receives the original input event.
    //
    // The parent is responsible for resetting the input
    // after processing the selected files.
    // =====================================================

    const handleUploadChange = (event) => {
        if (!canUpload) {
            event.target.value = "";
            return;
        }

        onMultipleImageSelect(event);
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <aside
            aria-label="Loyiha rasmlari"
            className="
                w-full
                min-w-0
                max-w-full
            "
        >
            {/* =============================================
                IMAGES PANEL
            ============================================== */}

            <section
                className="
                    w-full
                    min-w-0
                    max-w-full

                    rounded-2xl
                    border
                    border-slate-200

                    bg-slate-50/70

                    p-3.5

                    dark:border-white/[0.08]
                    dark:bg-white/[0.025]

                    min-[380px]:p-4

                    sm:rounded-[24px]
                    sm:p-5
                "
            >
                {/* =========================================
                    PANEL HEADER
                ========================================== */}

                <div
                    className="
                        flex
                        min-w-0

                        items-start
                        justify-between

                        gap-3
                    "
                >
                    {/* =====================================
                        HEADER CONTENT
                    ====================================== */}

                    <div
                        className="
                            flex
                            min-w-0
                            flex-1

                            items-center
                            gap-3
                        "
                    >
                        {/* =============================
                            ICON
                        ============================== */}

                        <span
                            aria-hidden="true"
                            className="
                                grid
                                h-9
                                w-9

                                shrink-0

                                place-items-center

                                rounded-xl
                                border

                                border-cyan-200
                                bg-cyan-50

                                text-cyan-700

                                dark:border-cyan-400/15
                                dark:bg-cyan-500/[0.06]
                                dark:text-cyan-300
                            "
                        >
                            <Images size={17} />
                        </span>

                        {/* =============================
                            TITLE AND IMAGE COUNT
                        ============================== */}

                        <div
                            className="
                                min-w-0
                                flex-1
                            "
                        >
                            <h3
                                className="
                                    break-words

                                    text-sm
                                    font-black

                                    text-slate-900

                                    dark:text-white
                                "
                            >
                                Loyiha rasmlari
                            </h3>

                            <p
                                aria-live="polite"
                                className="
                                    mt-0.5

                                    text-[11px]
                                    font-medium
                                    tabular-nums

                                    text-slate-500

                                    dark:text-slate-400
                                "
                            >
                                {imageCount}
                                {" / "}
                                {MAX_PROJECT_IMAGES}
                                {" ta rasm"}
                            </p>
                        </div>
                    </div>

                    {/* =====================================
                        QUICK ADD IMAGE BUTTON
                    ====================================== */}

                    <label
                        title={
                            isLimitReached
                                ? "Rasm limiti tugagan"
                                : "Bir yoki bir nechta rasm qo‘shish"
                        }
                        className={`
                            relative

                            grid
                            h-11
                            w-11

                            shrink-0

                            place-items-center

                            rounded-xl
                            border

                            transition-colors
                            duration-200

                            focus-within:outline-none
                            focus-within:ring-2
                            focus-within:ring-indigo-500/50
                            focus-within:ring-offset-2

                            dark:focus-within:ring-offset-[#0b1018]

                            motion-reduce:transition-none

                            ${
                                canUpload
                                    ? `
                                        cursor-pointer

                                        border-indigo-200
                                        bg-indigo-50
                                        text-indigo-700

                                        hover:border-indigo-300
                                        hover:bg-indigo-100

                                        dark:border-indigo-400/15
                                        dark:bg-indigo-500/[0.06]
                                        dark:text-indigo-300

                                        dark:hover:border-indigo-400/30
                                        dark:hover:bg-indigo-500/[0.12]
                                    `
                                    : `
                                        cursor-not-allowed

                                        border-slate-200
                                        bg-slate-100
                                        text-slate-400

                                        opacity-50

                                        dark:border-white/[0.05]
                                        dark:bg-white/[0.02]
                                        dark:text-slate-600
                                    `
                            }
                        `}
                    >
                        <Plus
                            size={18}
                            aria-hidden="true"
                        />

                        <input
                            type="file"
                            multiple

                            accept={IMAGE_ACCEPT}

                            disabled={!canUpload}

                            onChange={handleUploadChange}

                            aria-label="Loyiha rasmlarini qo‘shish"

                            className="sr-only"
                        />
                    </label>
                </div>

                {/* =========================================
                    LARGE UPLOAD AREA

                    This is a native file picker.

                    File selection is passed to the parent.
                    No independent drag/drop logic is added.
                ========================================== */}

                {!isLimitReached && (
                    <label
                        className={`
                            relative

                            mt-4

                            flex
                            w-full
                            min-w-0

                            flex-col
                            items-center
                            justify-center

                            gap-2

                            rounded-2xl
                            border
                            border-dashed

                            px-3
                            py-5

                            text-center

                            transition-colors
                            duration-200

                            focus-within:outline-none
                            focus-within:ring-2
                            focus-within:ring-indigo-500/50
                            focus-within:ring-offset-2

                            dark:focus-within:ring-offset-[#0b1018]

                            sm:mt-5
                            sm:px-4
                            sm:py-6

                            motion-reduce:transition-none

                            ${
                                canUpload
                                    ? `
                                        cursor-pointer

                                        border-indigo-300
                                        bg-indigo-50/70

                                        hover:border-indigo-400
                                        hover:bg-indigo-100/60

                                        dark:border-indigo-400/20
                                        dark:bg-indigo-500/[0.025]

                                        dark:hover:border-indigo-400/40
                                        dark:hover:bg-indigo-500/[0.06]
                                    `
                                    : `
                                        cursor-not-allowed

                                        border-slate-200
                                        bg-slate-100/60

                                        opacity-50

                                        dark:border-white/[0.06]
                                        dark:bg-white/[0.02]
                                    `
                            }
                        `}
                    >
                        {/* =============================
                            UPLOAD ICON
                        ============================== */}

                        <UploadCloud
                            size={26}
                            aria-hidden="true"
                            className="
                                text-indigo-600

                                dark:text-indigo-300
                            "
                        />

                        {/* =============================
                            UPLOAD LABEL
                        ============================== */}

                        <span
                            className="
                                break-words

                                text-xs
                                font-black

                                text-slate-800

                                dark:text-slate-200
                            "
                        >
                            Rasm tanlash
                        </span>

                        {/* =============================
                            UPLOAD DESCRIPTION
                        ============================== */}

                        <span
                            className="
                                max-w-xs

                                break-words

                                text-[11px]
                                font-medium
                                leading-5

                                text-slate-500

                                dark:text-slate-400
                            "
                        >
                            Bir vaqtning o‘zida bir nechta
                            JPG, JPEG, PNG yoki WEBP rasmlarini
                            tanlashingiz mumkin.
                        </span>

                        {/* =============================
                            REMAINING SLOTS
                        ============================== */}

                        <span
                            className="
                                rounded-full
                                border

                                border-slate-200
                                bg-white/80

                                px-3
                                py-1

                                text-[10px]
                                font-black
                                tabular-nums

                                text-slate-600

                                dark:border-white/[0.08]
                                dark:bg-black/20
                                dark:text-slate-400
                            "
                        >
                            {remainingSlots}
                            {" ta joy qoldi"}
                        </span>

                        {/* =============================
                            MULTIPLE IMAGE INPUT
                        ============================== */}

                        <input
                            type="file"
                            multiple

                            accept={IMAGE_ACCEPT}

                            disabled={!canUpload}

                            onChange={handleUploadChange}

                            aria-label="Bir nechta loyiha rasmini yuklash"

                            className="sr-only"
                        />
                    </label>
                )}

                {/* =========================================
                    IMAGE CARDS
                ========================================== */}

                <div
                    className="
                        mt-4

                        w-full
                        min-w-0

                        space-y-3

                        sm:mt-5
                        sm:space-y-4
                    "
                >
                    {safeImages.map((image, index) => (
                        <div
                            key={
                                image?.id ??
                                `image-${index}`
                            }
                            className="
                                min-w-0
                                max-w-full

                                [&>*]:max-w-full
                            "
                        >
                            <ProjectCreateImageCard
                                image={image}
                                index={index}

                                isSubmitting={
                                    isSubmitting
                                }

                                onTitleChange={
                                    onImageTitleChange
                                }

                                onReplace={
                                    onReplaceImage
                                }

                                onRemove={
                                    onRemoveImage
                                }
                            />
                        </div>
                    ))}

                    {/* =====================================
                        EMPTY IMAGE STATE
                    ====================================== */}

                    {imageCount === 0 && (
                        <div
                            role="status"
                            className="
                                min-w-0

                                rounded-2xl
                                border
                                border-dashed

                                border-slate-200
                                bg-white/70

                                px-3
                                py-5

                                text-center

                                dark:border-white/[0.08]
                                dark:bg-black/10

                                sm:p-6
                            "
                        >
                            {/* EMPTY ICON */}

                            <FileImage
                                size={32}
                                aria-hidden="true"
                                className="
                                    mx-auto

                                    text-slate-300

                                    dark:text-slate-600
                                "
                            />

                            {/* EMPTY TITLE */}

                            <p
                                className="
                                    mt-3

                                    break-words

                                    text-xs
                                    font-bold

                                    text-slate-500

                                    dark:text-slate-400
                                "
                            >
                                Hali rasm tanlanmagan
                            </p>

                            {/* EMPTY DESCRIPTION */}

                            <p
                                className="
                                    mt-1

                                    break-words

                                    text-[11px]
                                    font-medium
                                    leading-5

                                    text-slate-400

                                    dark:text-slate-500
                                "
                            >
                                Loyihangizni tanishtirish uchun
                                kamida bitta rasm qo‘shing.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </aside>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProjectCreateImages);
