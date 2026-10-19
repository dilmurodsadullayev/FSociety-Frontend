
import React, { memo } from "react";

import {
    BookOpen,
    CalendarDays,
    Flag,
    Target,
} from "lucide-react";

// =========================================================
// CONFIG
//
// Matches the existing backend validation limits.
// =========================================================

const TITLE_MAX_LENGTH = 255;

const DESCRIPTION_MAX_LENGTH = 3000;

// =========================================================
// SHARED STYLES
// =========================================================

const LABEL_CLASS = `
    flex
    items-center
    gap-2

    text-xs
    font-black

    uppercase
    tracking-[0.14em]

    text-slate-700
    dark:text-slate-400
`;

const INPUT_CLASS = `
    w-full
    min-w-0

    rounded-2xl
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

    dark:focus:border-indigo-400/35
    dark:focus:bg-indigo-500/[0.02]
    dark:focus:ring-indigo-500/[0.05]
`;

const DATE_INPUT_CLASS = `
    w-full
    min-w-0

    rounded-2xl
    border

    border-slate-300
    bg-white

    py-3.5
    pl-11
    pr-4

    text-sm
    font-semibold

    text-slate-900

    outline-none

    transition-all

    [color-scheme:light]

    focus:border-indigo-400
    focus:ring-4
    focus:ring-indigo-500/[0.08]

    disabled:cursor-not-allowed
    disabled:opacity-50

    dark:border-white/[0.07]
    dark:bg-[#0c1119]
    dark:text-slate-200

    dark:[color-scheme:dark]

    dark:focus:border-indigo-400/30
    dark:focus:ring-indigo-500/[0.05]
`;

// =========================================================
// ROADMAP TITLE FIELD
//
// Existing rules:
//
// - Required
// - Minimum 2 non-whitespace characters (parent validation)
// - Maximum 255 characters
//
// Placeholder changes based on roadmap type.
// =========================================================

const RoadmapTitleField = memo(
    function RoadmapTitleField({
        title,
        type,
        onChange,
        disabled,
    }) {
        const titleLength = title.length;

        const isNearLimit =
            titleLength > 230;

        const placeholder =
            type === "experience"
                ? "Masalan: Backend Developer @ Company"
                : "Masalan: Django REST Framework";

        return (
            <section className="min-w-0">
                {/* =====================================
                    LABEL AND COUNTER
                ====================================== */}

                <div
                    className="
                        mb-2.5

                        flex
                        items-center
                        justify-between
                        gap-3
                    "
                >
                    <label
                        htmlFor="roadmap-title"
                        className={LABEL_CLASS}
                    >
                        <Target
                            size={14}
                            aria-hidden="true"
                            className="
                                text-indigo-600
                                dark:text-indigo-300
                            "
                        />

                        Sarlavha
                    </label>

                    <span
                        aria-live="off"
                        className={`
                            text-[10px]
                            font-black
                            tabular-nums

                            ${
                                isNearLimit
                                    ? `
                                        text-amber-700
                                        dark:text-amber-300
                                    `
                                    : `
                                        text-slate-500
                                        dark:text-slate-500
                                    `
                            }
                        `}
                    >
                        {titleLength}/{TITLE_MAX_LENGTH}
                    </span>
                </div>

                {/* =====================================
                    TITLE INPUT
                ====================================== */}

                <input
                    id="roadmap-title"
                    name="title"
                    type="text"

                    value={title}
                    onChange={onChange}

                    maxLength={TITLE_MAX_LENGTH}

                    required
                    minLength={2}

                    disabled={disabled}
                    autoComplete="off"

                    placeholder={placeholder}

                    className={`
                        ${INPUT_CLASS}
                        sm:text-base
                    `}
                />
            </section>
        );
    }
);

// =========================================================
// ROADMAP DESCRIPTION FIELD
//
// Existing rules:
//
// - Optional
// - Maximum 3000 characters
// - Textarea with 5 rows
//
// Placeholder changes based on roadmap type.
// =========================================================

const RoadmapDescriptionField = memo(
    function RoadmapDescriptionField({
        description,
        type,
        onChange,
        disabled,
    }) {
        const descriptionLength =
            description.length;

        const isNearLimit =
            descriptionLength > 2800;

        const placeholder =
            type === "experience"
                ? "Bu tajribada nimalar qildingiz, qanday texnologiyalar bilan ishladingiz..."
                : "Nimani o‘rgandingiz, maqsadingiz nima edi, qanday natijaga erishdingiz...";

        return (
            <section className="min-w-0">
                {/* =====================================
                    LABEL
                ====================================== */}

                <div
                    className="
                        mb-2.5

                        flex
                        items-center
                        justify-between
                        gap-3
                    "
                >
                    <label
                        htmlFor="roadmap-description"
                        className={LABEL_CLASS}
                    >
                        <BookOpen
                            size={14}
                            aria-hidden="true"
                            className="
                                text-purple-600
                                dark:text-purple-300
                            "
                        />

                        Tavsif
                    </label>

                    <span
                        className="
                            text-[10px]
                            font-black

                            text-slate-500
                            dark:text-slate-500
                        "
                    >
                        Ixtiyoriy
                    </span>
                </div>

                {/* =====================================
                    DESCRIPTION TEXTAREA
                ====================================== */}

                <textarea
                    id="roadmap-description"
                    name="description"

                    value={description}
                    onChange={onChange}

                    maxLength={DESCRIPTION_MAX_LENGTH}

                    rows={5}

                    disabled={disabled}

                    placeholder={placeholder}

                    className={`
                        ${INPUT_CLASS}

                        min-h-[135px]
                        resize-y

                        font-medium
                        leading-7

                        dark:text-slate-300
                    `}
                />

                {/* =====================================
                    DESCRIPTION CHARACTER COUNT
                ====================================== */}

                <div
                    className="
                        mt-2
                        flex
                        justify-end
                    "
                >
                    <span
                        className={`
                            text-[10px]
                            font-black
                            tabular-nums

                            ${
                                isNearLimit
                                    ? `
                                        text-amber-700
                                        dark:text-amber-300
                                    `
                                    : `
                                        text-slate-500
                                        dark:text-slate-500
                                    `
                            }
                        `}
                    >
                        {descriptionLength}/{DESCRIPTION_MAX_LENGTH}
                    </span>
                </div>
            </section>
        );
    }
);

// =========================================================
// ROADMAP DATE FIELDS
//
// Existing rules:
//
// started_at:
// - Required
//
// finished_at:
// - Optional
// - Cannot be earlier than started_at
//
// Form values use YYYY-MM-DD.
// =========================================================

const RoadmapDateFields = memo(
    function RoadmapDateFields({
        startedAt,
        finishedAt,
        onChange,
        disabled,
    }) {
        return (
            <section className="min-w-0">
                {/* =====================================
                    SECTION HEADER
                ====================================== */}

                <div className="mb-3">
                    <p className={LABEL_CLASS}>
                        <CalendarDays
                            size={14}
                            aria-hidden="true"
                            className="
                                text-cyan-600
                                dark:text-cyan-300
                            "
                        />

                        Vaqt oralig‘i
                    </p>

                    <p
                        className="
                            mt-1

                            text-[10px]
                            font-medium

                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        Tugash sanasi majburiy emas.
                    </p>
                </div>

                {/* =====================================
                    DATE GRID
                ====================================== */}

                <div
                    className="
                        grid
                        min-w-0
                        gap-4

                        sm:grid-cols-2
                    "
                >
                    {/* =================================
                        START DATE
                    ================================== */}

                    <div className="min-w-0">
                        <label
                            htmlFor="roadmap-started-at"
                            className="
                                mb-2
                                block

                                text-[10px]
                                font-black

                                text-slate-600
                                dark:text-slate-400
                            "
                        >
                            Boshlanish sanasi

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
                        </label>

                        <div className="relative">
                            <CalendarDays
                                size={15}
                                aria-hidden="true"
                                className="
                                    pointer-events-none

                                    absolute
                                    left-4
                                    top-1/2

                                    -translate-y-1/2

                                    text-indigo-600
                                    dark:text-indigo-400
                                "
                            />

                            <input
                                id="roadmap-started-at"
                                type="date"
                                name="started_at"

                                value={startedAt}
                                onChange={onChange}

                                required

                                disabled={disabled}

                                className={DATE_INPUT_CLASS}
                            />
                        </div>
                    </div>

                    {/* =================================
                        FINISH DATE
                    ================================== */}

                    <div className="min-w-0">
                        <label
                            htmlFor="roadmap-finished-at"
                            className="
                                mb-2
                                block

                                text-[10px]
                                font-black

                                text-slate-600
                                dark:text-slate-400
                            "
                        >
                            Tugash sanasi
                        </label>

                        <div className="relative">
                            <Flag
                                size={15}
                                aria-hidden="true"
                                className="
                                    pointer-events-none

                                    absolute
                                    left-4
                                    top-1/2

                                    -translate-y-1/2

                                    text-emerald-600
                                    dark:text-emerald-400
                                "
                            />

                            <input
                                id="roadmap-finished-at"
                                type="date"
                                name="finished_at"

                                value={finishedAt}
                                onChange={onChange}

                                min={
                                    startedAt || undefined
                                }

                                disabled={disabled}

                                className={DATE_INPUT_CLASS}
                            />
                        </div>
                    </div>
                </div>
            </section>
        );
    }
);

// =========================================================
// PROFILE ROADMAP CREATE FIELDS
//
// Props:
//
// formData:
//   {
//       title,
//       type,
//       description,
//       started_at,
//       finished_at
//   }
//
// onChange:
//   Parent modal's original handleChange.
//
// disabled:
//   Parent modal's busy state.
//
// IMPORTANT:
//
// Form state and validation stay in
// RoadmapCreateModal.jsx.
//
// This component only renders controlled fields.
// =========================================================

const RoadmapCreateFields = ({
    formData,
    onChange,
    disabled = false,
}) => {
    // =====================================================
    // SAFE VALUES
    // =====================================================

    const title =
        typeof formData?.title === "string"
            ? formData.title
            : "";

    const type =
        formData?.type || "learning";

    const description =
        typeof formData?.description === "string"
            ? formData.description
            : "";

    const startedAt =
        formData?.started_at || "";

    const finishedAt =
        formData?.finished_at || "";

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div
            className="
                min-w-0
                space-y-5
            "
        >
            {/* =====================================
                TITLE
            ====================================== */}

            <RoadmapTitleField
                title={title}
                type={type}
                onChange={onChange}
                disabled={disabled}
            />

            {/* =====================================
                DESCRIPTION
            ====================================== */}

            <RoadmapDescriptionField
                description={description}
                type={type}
                onChange={onChange}
                disabled={disabled}
            />

            {/* =====================================
                DATES
            ====================================== */}

            <RoadmapDateFields
                startedAt={startedAt}
                finishedAt={finishedAt}
                onChange={onChange}
                disabled={disabled}
            />
        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(RoadmapCreateFields);
