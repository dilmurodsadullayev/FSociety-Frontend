
import React, { memo } from "react";

import {
    ExternalLink,
    Type,
} from "lucide-react";

// =========================================================
// CONSTANTS
// =========================================================

const NAME_MAX_LENGTH = 30;

const FEATURES_MAX_LENGTH = 150;

const EMPTY_FORM = {
    name: "",
    main_features: "",
    description: "",
    website_url: "",
};

// =========================================================
// INPUT STYLES
//
// Light / Dark Mode.
// =========================================================

const INPUT_CLASS = `
    w-full
    min-w-0

    rounded-xl
    border

    border-slate-300
    bg-white

    px-4
    py-3.5

    text-sm
    font-semibold

    text-slate-900

    outline-none
    transition-all
    duration-200

    placeholder:text-slate-400

    focus:border-indigo-400
    focus:ring-4
    focus:ring-indigo-500/[0.08]

    disabled:cursor-not-allowed
    disabled:opacity-50

    dark:border-white/[0.07]
    dark:bg-black/20
    dark:text-white
    dark:placeholder:text-slate-600

    dark:focus:border-indigo-400/30
    dark:focus:bg-black/30
    dark:focus:ring-indigo-500/[0.05]
`;

// =========================================================
// FIELD WRAPPER
//
// Preserves original label, required marker,
// and field description.
// =========================================================

const ProjectField = ({
    id,
    label,
    description,
    required = false,
    children,
}) => {
    return (
        <div className="min-w-0">
            {/* LABEL */}

            <div
                className="
                    mb-2

                    flex
                    items-center
                    justify-between
                    gap-3
                "
            >
                <label
                    htmlFor={id}
                    className="
                        text-xs
                        font-black

                        text-slate-700
                        dark:text-slate-300
                    "
                >
                    {label}

                    {required && (
                        <span
                            aria-hidden="true"
                            className="
                                ml-1
                                text-red-500
                                dark:text-red-400
                            "
                        >
                            *
                        </span>
                    )}
                </label>
            </div>

            {/* FIELD */}

            {children}

            {/* DESCRIPTION */}

            {description && (
                <p
                    className="
                        mt-2

                        text-[10px]
                        font-medium
                        leading-5

                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    {description}
                </p>
            )}
        </div>
    );
};

// =========================================================
// PROJECT CREATE FIELDS
//
// Props:
//
// formData:
// {
//     name,
//     main_features,
//     description,
//     website_url
// }
//
// onChange:
//   Parent handleInputChange(event).
//
// disabled:
//   Parent isSubmitting.
//
// Responsibilities:
//
// - Project name
// - Main features
// - Description
// - Demo URL
// - Character counters
//
// No internal form state.
// No API calls.
// =========================================================

const ProjectCreateFields = ({
    formData = EMPTY_FORM,
    onChange,
    disabled = false,
}) => {
    // =====================================================
    // SAFE VALUES
    // =====================================================

    const name = String(
        formData?.name ?? ""
    );

    const mainFeatures = String(
        formData?.main_features ?? ""
    );

    const description = String(
        formData?.description ?? ""
    );

    const websiteUrl = String(
        formData?.website_url ?? ""
    );

    // =====================================================
    // COUNTERS
    // =====================================================

    const nameLength = name.length;

    const featuresLength =
        mainFeatures.length;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <section
            aria-label="Loyihaning asosiy ma’lumotlari"
            className="
                min-w-0

                rounded-[24px]
                border

                border-slate-200
                bg-slate-50/70

                p-5

                dark:border-white/[0.06]
                dark:bg-white/[0.018]
            "
        >
            {/* =====================================
                SECTION HEADER
            ====================================== */}

            <div
                className="
                    mb-5

                    flex
                    items-center
                    gap-3
                "
            >
                {/* ICON */}

                <div
                    aria-hidden="true"
                    className="
                        grid
                        h-9
                        w-9

                        place-items-center

                        rounded-xl
                        border

                        border-indigo-200
                        bg-indigo-50

                        text-indigo-700

                        dark:border-indigo-400/15
                        dark:bg-indigo-500/[0.06]
                        dark:text-indigo-300
                    "
                >
                    <Type size={17} />
                </div>

                {/* TEXT */}

                <div className="min-w-0">
                    <h3
                        className="
                            text-sm
                            font-black

                            text-slate-900
                            dark:text-white
                        "
                    >
                        Asosiy ma’lumotlar
                    </h3>

                    <p
                        className="
                            mt-0.5

                            text-[10px]
                            font-medium

                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        Loyihaning asosiy identifikatsiyasi
                    </p>
                </div>
            </div>

            {/* =====================================
                FORM FIELDS
            ====================================== */}

            <div className="space-y-5">
                {/* =================================
                    PROJECT NAME
                ================================== */}

                <ProjectField
                    id="project-create-name"
                    label="Loyiha nomi"
                    required
                >
                    <div className="relative">
                        <input
                            id="project-create-name"
                            type="text"
                            name="name"

                            value={name}
                            onChange={onChange}

                            maxLength={NAME_MAX_LENGTH}
                            required

                            disabled={disabled}

                            placeholder="Masalan: MathAI"

                            className={`
                                ${INPUT_CLASS}
                                pr-16
                            `}
                        />

                        {/* CHARACTER COUNT */}

                        <span
                            className="
                                pointer-events-none

                                absolute
                                right-3
                                top-1/2

                                -translate-y-1/2

                                text-[9px]
                                font-bold
                                tabular-nums

                                text-slate-500
                                dark:text-slate-500
                            "
                        >
                            {nameLength}/{NAME_MAX_LENGTH}
                        </span>
                    </div>
                </ProjectField>

                {/* =================================
                    MAIN FEATURES
                ================================== */}

                <ProjectField
                    id="project-create-features"
                    label="Asosiy imkoniyatlar"
                    required
                    description="Vergul yoki yangi qator bilan bir nechta imkoniyat yozishingiz mumkin."
                >
                    <div className="relative">
                        <textarea
                            id="project-create-features"
                            name="main_features"

                            value={mainFeatures}
                            onChange={onChange}

                            maxLength={
                                FEATURES_MAX_LENGTH
                            }

                            required
                            rows={3}

                            disabled={disabled}

                            placeholder="AI yordamchi, testlar, natijalar..."

                            className={`
                                ${INPUT_CLASS}

                                resize-y
                                pb-8

                                font-medium
                                leading-6
                            `}
                        />

                        {/* CHARACTER COUNT */}

                        <span
                            className="
                                pointer-events-none

                                absolute
                                bottom-3
                                right-3

                                text-[9px]
                                font-bold
                                tabular-nums

                                text-slate-500
                                dark:text-slate-500
                            "
                        >
                            {featuresLength}/{FEATURES_MAX_LENGTH}
                        </span>
                    </div>
                </ProjectField>

                {/* =================================
                    DESCRIPTION
                ================================== */}

                <ProjectField
                    id="project-create-description"
                    label="Tavsif"
                    required
                >
                    <textarea
                        id="project-create-description"
                        name="description"

                        value={description}
                        onChange={onChange}

                        required
                        rows={6}

                        disabled={disabled}

                        placeholder="Loyihangiz nima qiladi, kimlar uchun va qanday muammoni hal qiladi?"

                        className={`
                            ${INPUT_CLASS}

                            resize-y
                            font-medium
                            leading-7
                        `}
                    />
                </ProjectField>

                {/* =================================
                    WEBSITE URL
                ================================== */}

                <ProjectField
                    id="project-create-website"
                    label="Demo / Website URL"
                    description="Majburiy emas. Agar loyiha online bo‘lsa, demo manzilini kiriting."
                >
                    <div className="relative">
                        {/* URL ICON */}

                        <ExternalLink
                            size={16}
                            aria-hidden="true"
                            className="
                                pointer-events-none

                                absolute
                                left-4
                                top-1/2

                                -translate-y-1/2

                                text-slate-500
                                dark:text-slate-500
                            "
                        />

                        {/* WEBSITE INPUT */}

                        <input
                            id="project-create-website"
                            type="url"
                            name="website_url"

                            value={websiteUrl}
                            onChange={onChange}

                            disabled={disabled}

                            placeholder="https://example.com"

                            className={`
                                ${INPUT_CLASS}
                                pl-11
                            `}
                        />
                    </div>
                </ProjectField>
            </div>
        </section>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProjectCreateFields);
