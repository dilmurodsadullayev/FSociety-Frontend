
import React, { memo } from "react";

import {
    CircleDot,
    Sparkles,
} from "lucide-react";

import {
    ROADMAP_TYPES,
} from "./RoadmapCreateTypeSelector";

// =========================================================
// CONSTANTS
// =========================================================

const EMPTY_FORM = {
    title: "",
    type: "learning",
    description: "",
    started_at: "",
    finished_at: "",
};

// =========================================================
// DATE FORMAT
//
// The form uses YYYY-MM-DD.
//
// We parse date components directly to avoid
// UTC timezone conversion problems.
// =========================================================

const formatDisplayDate = (value) => {
    if (!value) {
        return "Belgilanmagan";
    }

    const text = String(value).slice(0, 10);

    const match = text.match(
        /^(\d{4})-(\d{2})-(\d{2})$/
    );

    if (!match) {
        return text;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    const date = new Date(
        year,
        month - 1,
        day
    );

    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return text;
    }

    return new Intl.DateTimeFormat(
        "uz-UZ",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    ).format(date);
};

// =========================================================
// ROADMAP STATUS
//
// Same logic as the original modal:
//
// finished_at -> Yakunlangan
// started_at  -> Jarayonda
// otherwise   -> Rejalashtirilmoqda
// =========================================================

const getRoadmapStatus = (formData) => {
    if (formData.finished_at) {
        return {
            label: "Yakunlangan",

            description:
                "Roadmap tugash sanasi belgilangan.",

            className: `
                border-emerald-300
                bg-emerald-50
                text-emerald-700

                dark:border-emerald-400/20
                dark:bg-emerald-500/[0.07]
                dark:text-emerald-300
            `,

            dotClass: "bg-emerald-400",
        };
    }

    if (formData.started_at) {
        return {
            label: "Jarayonda",

            description:
                "Roadmap davom etmoqda.",

            className: `
                border-indigo-300
                bg-indigo-50
                text-indigo-700

                dark:border-indigo-400/20
                dark:bg-indigo-500/[0.07]
                dark:text-indigo-300
            `,

            dotClass: "bg-indigo-400",
        };
    }

    return {
        label: "Rejalashtirilmoqda",

        description:
            "Boshlanish sanasi hali tanlanmagan.",

        className: `
            border-slate-200
            bg-slate-100
            text-slate-600

            dark:border-white/[0.08]
            dark:bg-white/[0.025]
            dark:text-slate-400
        `,

        dotClass: "bg-slate-400",
    };
};

// =========================================================
// TIMELINE STEP
// =========================================================

const TimelineStep = memo(function TimelineStep({
    label,
    value,
    tone = "neutral",
    isLast = false,
}) {
    const toneStyles = {
        start: {
            dot: `
                border-indigo-200
                bg-indigo-500
                shadow-[0_0_10px_rgba(129,140,248,0.4)]

                dark:border-[#0a0e16]
            `,

            label: `
                text-indigo-700
                dark:text-indigo-400
            `,
        },

        neutral: {
            dot: `
                border-indigo-300
                bg-white

                dark:border-indigo-400/30
                dark:bg-[#0a0e16]
            `,

            label: `
                text-slate-500
                dark:text-slate-400
            `,
        },

        finish: {
            dot: `
                border-emerald-200
                bg-emerald-400
                shadow-[0_0_10px_rgba(52,211,153,0.4)]

                dark:border-[#0a0e16]
            `,

            label: `
                text-emerald-700
                dark:text-emerald-400
            `,
        },
    };

    const style =
        toneStyles[tone] ||
        toneStyles.neutral;

    return (
        <div
            className={`
                relative

                ${isLast ? "" : "pb-7"}
            `}
        >
            {/* TIMELINE DOT */}

            <span
                aria-hidden="true"
                className={`
                    absolute
                    -left-[19px]
                    top-1

                    h-3
                    w-3

                    rounded-full
                    border-2

                    ${style.dot}
                `}
            />

            {/* LABEL */}

            <p
                className={`
                    text-[9px]
                    font-black

                    uppercase
                    tracking-[0.15em]

                    ${style.label}
                `}
            >
                {label}
            </p>

            {/* VALUE */}

            <p
                className="
                    mt-1

                    break-words

                    text-xs
                    font-black
                    leading-5

                    text-slate-800
                    dark:text-slate-200
                "
            >
                {value}
            </p>
        </div>
    );
});

// =========================================================
// ROADMAP CREATE PREVIEW
//
// Props:
//
// formData:
// {
//     title,
//     type,
//     description,
//     started_at,
//     finished_at
// }
//
// Responsibilities:
//
// - Live preview of roadmap type
// - Timeline start
// - Timeline title
// - Timeline finish
// - Roadmap status
// - Description preview
//
// No internal form state.
// No API / Redux dependency.
// =========================================================

const RoadmapCreatePreview = ({
    formData = EMPTY_FORM,
}) => {
    // =====================================================
    // SAFE DATA
    // =====================================================

    const type =
        formData?.type || "learning";

    const title =
        String(formData?.title || "").trim();

    const description =
        String(
            formData?.description || ""
        ).trim();

    const startedAt =
        formData?.started_at || "";

    const finishedAt =
        formData?.finished_at || "";

    // =====================================================
    // SELECTED TYPE
    //
    // Reuse the configuration from
    // RoadmapCreateTypeSelector.
    // =====================================================

    const selectedType =
        ROADMAP_TYPES.find(
            (item) => item.value === type
        ) || ROADMAP_TYPES[0];

    const SelectedTypeIcon =
        selectedType.Icon;

    // =====================================================
    // STATUS
    // =====================================================

    const roadmapStatus =
        getRoadmapStatus({
            started_at: startedAt,
            finished_at: finishedAt,
        });

    // =====================================================
    // FINISH TEXT
    // =====================================================

    const finishText = finishedAt
        ? formatDisplayDate(finishedAt)
        : "Davom etmoqda";

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <aside
            aria-label="Roadmap oldindan ko‘rish"
            className="
                hidden

                min-w-0

                border-slate-200
                bg-slate-50/80

                p-6

                dark:border-white/[0.06]
                dark:bg-black/[0.08]

                lg:block
            "
        >
            <div
                className="
                    sticky
                    top-4
                    min-w-0
                "
            >
                {/* =====================================
                    PREVIEW TITLE
                ====================================== */}

                <div className="mb-5">
                    <p
                        className="
                            text-[9px]
                            font-black

                            uppercase
                            tracking-[0.18em]

                            text-slate-600
                            dark:text-slate-400
                        "
                    >
                        Roadmap preview
                    </p>

                    <p
                        className="
                            mt-1

                            text-[10px]
                            font-medium
                            leading-5

                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        Profil timeline’da taxminan
                        shunday ko‘rinadi.
                    </p>
                </div>

                {/* =====================================
                    ROADMAP TYPE
                ====================================== */}

                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >
                    {/* TYPE ICON */}

                    <div
                        className={`
                            flex
                            h-11
                            w-11
                            shrink-0

                            items-center
                            justify-center

                            rounded-xl
                            border

                            ${selectedType.iconClass}
                        `}
                    >
                        <SelectedTypeIcon
                            size={19}
                            aria-hidden="true"
                        />
                    </div>

                    {/* TYPE NAME */}

                    <div className="min-w-0">
                        <p
                            className="
                                text-[9px]
                                font-black

                                uppercase
                                tracking-[0.13em]

                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Turi
                        </p>

                        <p
                            className="
                                mt-0.5

                                text-sm
                                font-black

                                text-slate-900
                                dark:text-white
                            "
                        >
                            {selectedType.label}
                        </p>
                    </div>
                </div>

                {/* =====================================
                    TIMELINE
                ====================================== */}

                <div
                    className="
                        relative

                        mt-7
                        pl-5
                    "
                >
                    {/* TIMELINE LINE */}

                    <div
                        aria-hidden="true"
                        className="
                            absolute

                            bottom-3
                            left-[7px]
                            top-3

                            w-px

                            bg-gradient-to-b

                            from-indigo-400/50
                            via-indigo-400/20
                            to-emerald-400/40
                        "
                    />

                    {/* START */}

                    <TimelineStep
                        label="Boshlanish"
                        value={
                            formatDisplayDate(
                                startedAt
                            )
                        }
                        tone="start"
                    />

                    {/* ROADMAP GOAL */}

                    <TimelineStep
                        label="Maqsad"
                        value={
                            title ||
                            "Roadmap sarlavhasi"
                        }
                    />

                    {/* FINISH */}

                    <TimelineStep
                        label="Tugash"
                        value={finishText}
                        tone={
                            finishedAt
                                ? "finish"
                                : "neutral"
                        }
                        isLast
                    />
                </div>

                {/* =====================================
                    STATUS
                ====================================== */}

                <div
                    className="
                        mt-7

                        border-t
                        border-slate-200

                        pt-5

                        dark:border-white/[0.06]
                    "
                >
                    <div
                        className="
                            flex
                            items-start
                            gap-3
                        "
                    >
                        {/* STATUS ICON */}

                        <div
                            className={`
                                mt-0.5

                                flex
                                h-8
                                w-8
                                shrink-0

                                items-center
                                justify-center

                                rounded-xl
                                border

                                ${roadmapStatus.className}
                            `}
                        >
                            <CircleDot
                                size={14}
                                aria-hidden="true"
                            />
                        </div>

                        {/* STATUS TEXT */}

                        <div className="min-w-0">
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >
                                <span
                                    aria-hidden="true"
                                    className={`
                                        h-1.5
                                        w-1.5

                                        rounded-full

                                        ${roadmapStatus.dotClass}
                                    `}
                                />

                                <p
                                    className="
                                        text-xs
                                        font-black

                                        text-slate-800
                                        dark:text-slate-200
                                    "
                                >
                                    {roadmapStatus.label}
                                </p>
                            </div>

                            <p
                                className="
                                    mt-1

                                    text-[10px]
                                    font-medium
                                    leading-5

                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                {roadmapStatus.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* =====================================
                    DESCRIPTION PREVIEW
                ====================================== */}

                {description && (
                    <div
                        className="
                            mt-5

                            border-l-2
                            border-purple-400/30

                            pl-3
                        "
                    >
                        <p
                            className="
                                line-clamp-5

                                whitespace-pre-wrap
                                break-words

                                text-[11px]
                                font-medium
                                leading-5

                                text-slate-600
                                dark:text-slate-400
                            "
                        >
                            {description}
                        </p>
                    </div>
                )}

                {/* =====================================
                    HELPFUL TIP
                ====================================== */}

                <div
                    className="
                        mt-6

                        flex
                        items-start
                        gap-2

                        border-t
                        border-slate-200

                        pt-5

                        dark:border-white/[0.06]
                    "
                >
                    <Sparkles
                        size={14}
                        aria-hidden="true"
                        className="
                            mt-0.5
                            shrink-0

                            text-indigo-600
                            dark:text-indigo-400
                        "
                    />

                    <p
                        className="
                            text-[10px]
                            font-medium
                            leading-5

                            text-slate-600
                            dark:text-slate-400
                        "
                    >
                        Roadmap profilingizdagi
                        rivojlanish tarixini tartibli
                        ko‘rsatishga yordam beradi.
                    </p>
                </div>
            </div>
        </aside>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(RoadmapCreatePreview);
