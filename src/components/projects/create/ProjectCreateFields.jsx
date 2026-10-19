
// src/components/projects/create/ProjectCreateFields.jsx

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

const NAME_WARNING_LENGTH = 25;

const FEATURES_WARNING_LENGTH = 140;

const EMPTY_FORM = {
    name: "",
    main_features: "",
    description: "",
    website_url: "",
};

// =========================================================
// INPUT STYLES
//
// Shared by:
// - Project name
// - Main features
// - Description
// - Website URL
//
// Responsive:
// - Full width on every screen
// - Mobile-friendly 16px font size
// - Reduced padding on narrow screens
// - No fixed width
//
// Light / Dark Mode supported.
// =========================================================

const INPUT_CLASS = `
    relative

    block

    w-full
    min-w-0
    max-w-full

    rounded-xl
    border

    border-slate-300
    bg-white

    px-3.5
    py-3

    text-base
    font-medium
    leading-6

    text-slate-900

    outline-none

    transition-colors
    duration-200

    placeholder:text-slate-400

    focus:border-indigo-400
    focus:ring-4
    focus:ring-indigo-500/[0.08]

    disabled:cursor-not-allowed
    disabled:opacity-50

    dark:border-white/[0.10]
    dark:bg-black/20
    dark:text-white
    dark:placeholder:text-slate-500

    dark:focus:border-indigo-400/40
    dark:focus:bg-black/30
    dark:focus:ring-indigo-500/[0.06]

    sm:rounded-2xl
    sm:px-4
    sm:py-3.5

    motion-reduce:transition-none
`;

// =========================================================
// FIELD WRAPPER
//
// Features:
// - Accessible label
// - Required marker
// - Optional description
// - Responsive spacing
// - Light / Dark Mode
//
// Does not own form state.
// =========================================================

const ProjectField = memo(
    function ProjectField({
        id,
        label,
        description,
        required = false,
        children,
    }) {
        return (
            <div
                className="
                    w-full
                    min-w-0
                "
            >
                {/* =========================================
                    FIELD LABEL
                ========================================== */}

                <div
                    className="
                        mb-2

                        flex
                        min-w-0

                        items-center
                        justify-between

                        gap-2
                    "
                >
                    <label
                        htmlFor={id}
                        className="
                            min-w-0

                            break-words

                            text-xs
                            font-black
                            leading-5

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

                {/* =========================================
                    FIELD CONTROL
                ========================================== */}

                <div
                    className="
                        w-full
                        min-w-0
                    "
                >
                    {children}
                </div>

                {/* =========================================
                    FIELD DESCRIPTION
                ========================================== */}

                {description && (
                    <p
                        id={`${id}-hint`}
                        className="
                            mt-2

                            min-w-0

                            break-words

                            text-[11px]
                            font-medium
                            leading-5

                            text-slate-500

                            dark:text-slate-400

                            sm:text-xs
                        "
                    >
                        {description}
                    </p>
                )}
            </div>
        );
    }
);

// =========================================================
// CHARACTER COUNTER
//
// Reusable component for:
//
// - Project name: 30 characters
// - Main features: 150 characters
//
// Counters stay outside input/textarea to avoid
// overlapping the user's text.
//
// Warning colors appear near the character limit.
// =========================================================

const CharacterCounter = memo(
    function CharacterCounter({
        current = 0,
        max = 0,
        warningAt = 0,
        id,
    }) {
        // =================================================
        // SAFE COUNTER VALUES
        // =================================================

        const currentLength =
            Math.max(0, Number(current) || 0);

        const maximum =
            Math.max(0, Number(max) || 0);

        const isNearLimit =
            currentLength >= warningAt;

        const remaining =
            Math.max(
                0,
                maximum - currentLength
            );

        // =================================================
        // RENDER
        // =================================================

        return (
            <div
                className="
                    mt-1.5

                    flex
                    min-w-0

                    flex-wrap
                    items-center
                    justify-between

                    gap-x-3
                    gap-y-1
                "
            >
                {/* =========================================
                    CHARACTER WARNING
                ========================================== */}

                <span
                    className={`
                        text-[10px]
                        font-medium
                        leading-4

                        ${
                            isNearLimit
                                ? `
                                    text-amber-700
                                    dark:text-amber-300
                                `
                                : `
                                    text-slate-500
                                    dark:text-slate-400
                                `
                        }
                    `}
                >
                    {isNearLimit
                        ? `${remaining} ta belgi qoldi`
                        : "Belgilar soni"}
                </span>

                {/* =========================================
                    COUNTER
                ========================================== */}

                <span
                    id={id}
                    className={`
                        shrink-0

                        text-[11px]
                        font-bold
                        tabular-nums

                        ${
                            isNearLimit
                                ? `
                                    text-amber-700
                                    dark:text-amber-300
                                `
                                : `
                                    text-slate-500
                                    dark:text-slate-400
                                `
                        }
                    `}
                >
                    {currentLength}
                    {" / "}
                    {maximum}
                </span>
            </div>
        );
    }
);

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
//   Parent handleInputChange(event)
//
// disabled:
//   Parent isSubmitting
//
// Responsibilities:
// - Project name
// - Main features
// - Description
// - Demo / Website URL
// - Character counters
// - Responsive inputs
// - Accessible field descriptions
//
// No internal form state.
// No Redux.
// No API requests.
// No submission logic.
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
    // CHARACTER COUNTS
    // =====================================================

    const nameLength =
        name.length;

    const featuresLength =
        mainFeatures.length;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <section
            aria-label="Loyihaning asosiy ma’lumotlari"
            className="
                w-full
                min-w-0

                overflow-hidden

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
            {/* =============================================
                SECTION HEADER
            ============================================== */}

            <div
                className="
                    mb-5

                    flex
                    min-w-0

                    items-center
                    gap-3

                    sm:mb-6
                "
            >
                {/* =========================================
                    SECTION ICON
                ========================================== */}

                <div
                    aria-hidden="true"
                    className="
                        grid

                        h-9
                        w-9

                        shrink-0

                        place-items-center

                        rounded-xl
                        border

                        border-indigo-200
                        bg-indigo-50

                        text-indigo-700

                        dark:border-indigo-400/15
                        dark:bg-indigo-500/[0.06]
                        dark:text-indigo-300

                        sm:h-10
                        sm:w-10
                    "
                >
                    <Type
                        size={17}
                        aria-hidden="true"
                    />
                </div>

                {/* =========================================
                    SECTION TEXT
                ========================================== */}

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
                            leading-5

                            text-slate-900

                            dark:text-white
                        "
                    >
                        Asosiy ma’lumotlar
                    </h3>

                    <p
                        className="
                            mt-0.5

                            break-words

                            text-[11px]
                            font-medium
                            leading-5

                            text-slate-500

                            dark:text-slate-400
                        "
                    >
                        Loyihaning asosiy identifikatsiyasi
                    </p>
                </div>
            </div>

            {/* =============================================
                FORM FIELDS
            ============================================== */}

            <div
                className="
                    w-full
                    min-w-0

                    space-y-5

                    sm:space-y-6
                "
            >
                {/* =========================================
                    1. PROJECT NAME
                ========================================== */}

                <ProjectField
                    id="project-create-name"
                    label="Loyiha nomi"
                    required
                >
                    <input
                        id="project-create-name"

                        type="text"
                        name="name"

                        value={name}
                        onChange={onChange}

                        maxLength={NAME_MAX_LENGTH}

                        required
                        disabled={disabled}

                        autoComplete="off"

                        aria-describedby="project-create-name-counter"

                        placeholder="Masalan: MathAI"

                        className={INPUT_CLASS}
                    />

                    {/* =====================================
                        NAME COUNTER
                    ====================================== */}

                    <CharacterCounter
                        id="project-create-name-counter"

                        current={nameLength}
                        max={NAME_MAX_LENGTH}

                        warningAt={
                            NAME_WARNING_LENGTH
                        }
                    />
                </ProjectField>

                {/* =========================================
                    2. MAIN FEATURES
                ========================================== */}

                <ProjectField
                    id="project-create-features"

                    label="Asosiy imkoniyatlar"

                    required

                    description="Vergul yoki yangi qator bilan bir nechta imkoniyat yozishingiz mumkin."
                >
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

                        aria-describedby="project-create-features-counter project-create-features-hint"

                        placeholder="AI yordamchi, testlar, natijalar..."

                        className={`
                            ${INPUT_CLASS}

                            min-h-[100px]

                            resize-y

                            font-medium
                            leading-6

                            sm:min-h-[115px]
                        `}
                    />

                    {/* =====================================
                        FEATURES COUNTER
                    ====================================== */}

                    <CharacterCounter
                        id="project-create-features-counter"

                        current={featuresLength}
                        max={
                            FEATURES_MAX_LENGTH
                        }

                        warningAt={
                            FEATURES_WARNING_LENGTH
                        }
                    />
                </ProjectField>

                {/* =========================================
                    3. PROJECT DESCRIPTION
                ========================================== */}

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

                            min-h-[155px]

                            resize-y

                            font-medium
                            leading-7

                            sm:min-h-[185px]
                        `}
                    />
                </ProjectField>

                {/* =========================================
                    4. WEBSITE URL
                ========================================== */}

                <ProjectField
                    id="project-create-website"

                    label="Demo / Website URL"

                    description="Majburiy emas. Agar loyiha online bo‘lsa, demo manzilini kiriting."
                >
                    <div
                        className="
                            relative

                            w-full
                            min-w-0
                        "
                    >
                        {/* =================================
                            URL ICON
                        ================================== */}

                        <ExternalLink
                            size={16}
                            aria-hidden="true"
                            className="
                                pointer-events-none

                                absolute
                                left-3.5
                                top-1/2

                                z-10

                                -translate-y-1/2

                                text-slate-500

                                dark:text-slate-400

                                sm:left-4
                            "
                        />

                        {/* =================================
                            WEBSITE INPUT
                        ================================== */}

                        <input
                            id="project-create-website"

                            type="url"
                            name="website_url"

                            value={websiteUrl}
                            onChange={onChange}

                            disabled={disabled}

                            inputMode="url"
                            autoCapitalize="none"
                            autoComplete="url"
                            spellCheck={false}

                            aria-describedby="project-create-website-hint"

                            placeholder="https://example.com"

                            className={`
                                ${INPUT_CLASS}

                                pl-10

                                sm:pl-11
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
