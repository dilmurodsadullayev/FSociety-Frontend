
// src/components/posts/create/PostCreatePreview.jsx

import React, { memo } from "react";

import {
    Eye,
    Heart,
    MessageCircle,
    Sparkles,
} from "lucide-react";

import {
    getPostType,
} from "./PostCreateTypeSelector";

// =========================================================
// CONSTANTS
// =========================================================

const EMPTY_FORM = {
    post_type: "TEX",
    title: "",
    content: "",
};

// =========================================================
// PREVIEW STAT ITEM
//
// Pure presentation component.
// =========================================================

const PreviewStat = memo(
    function PreviewStat({
        Icon,
        count = 0,
        label,
    }) {
        return (
            <span
                title={label}
                className="
                    inline-flex

                    min-w-0

                    items-center
                    gap-1.5

                    text-[11px]
                    font-bold

                    text-slate-500

                    dark:text-slate-400

                    sm:text-xs
                "
            >
                <Icon
                    size={14}
                    aria-hidden="true"
                    className="shrink-0"
                />

                <span className="tabular-nums">
                    {count}
                </span>

                <span className="sr-only">
                    {label}
                </span>
            </span>
        );
    }
);

// =========================================================
// POST CREATE PREVIEW
//
// Props:
//
// formData:
// {
//     post_type: "TEX",
//     title: "",
//     content: ""
// }
//
// cleanPreviewContent:
//   Plain text from CreatePostModal.stripHtml().
//
// Features:
// - Selected post type
// - Category color
// - Category icon
// - Live title
// - Live content
// - Preview statistics
// - Writing tips
// - Light / Dark Mode
//
// Responsive:
// - Mobile: visible below form
// - Tablet: full-width preview
// - Desktop: right column
//
// No API calls, submission, or unsafe HTML rendering.
// =========================================================

const PostCreatePreview = ({
    formData = EMPTY_FORM,
    cleanPreviewContent = "",
}) => {
    // =====================================================
    // SAFE VALUES
    // =====================================================

    const postType =
        formData?.post_type || "TEX";

    const title =
        String(formData?.title ?? "").trim();

    const previewContent =
        String(
            cleanPreviewContent ?? ""
        ).trim();

    // =====================================================
    // SELECTED CATEGORY
    // =====================================================

    const selectedType =
        getPostType(postType);

    const SelectedIcon =
        selectedType.Icon;

    // =====================================================
    // CONTENT STATE
    // =====================================================

    const hasTitle =
        title.length > 0;

    const hasContent =
        previewContent.length > 0;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <aside
            aria-label="Postning oldindan ko‘rinishi"
            className="
                relative

                block

                w-full
                min-w-0

                overflow-hidden

                border-t
                border-slate-200

                bg-slate-50/80

                p-3

                dark:border-white/[0.08]
                dark:bg-black/10

                min-[380px]:p-4

                sm:p-6

                lg:border-l
                lg:border-t-0
            "
        >
            {/* =============================================
                PREVIEW CONTENT
            ============================================== */}

            <div
                className="
                    min-w-0

                    lg:sticky
                    lg:top-4
                "
            >
                {/* =========================================
                    PREVIEW HEADER
                ========================================== */}

                <div
                    className="
                        mb-4

                        flex
                        min-w-0

                        flex-wrap

                        items-center
                        justify-between

                        gap-2.5

                        sm:gap-3
                    "
                >
                    {/* =====================================
                        TITLE AND DESCRIPTION
                    ====================================== */}

                    <div className="min-w-0">
                        <p
                            className="
                                text-[11px]
                                font-black

                                uppercase
                                tracking-[0.12em]

                                text-slate-700
                                dark:text-slate-300

                                sm:text-xs
                                sm:tracking-[0.16em]
                            "
                        >
                            Live preview
                        </p>

                        <p
                            className="
                                mt-1

                                break-words

                                text-[11px]
                                font-medium
                                leading-5

                                text-slate-500

                                dark:text-slate-400
                            "
                        >
                            Post kartada taxminan shunday ko‘rinadi
                        </p>
                    </div>

                    {/* =====================================
                        PREVIEW BADGE
                    ====================================== */}

                    <span
                        className="
                            inline-flex

                            shrink-0

                            items-center
                            gap-1.5

                            rounded-full
                            border

                            border-slate-200
                            bg-white

                            px-2.5
                            py-1

                            text-[10px]
                            font-bold

                            uppercase
                            tracking-wider

                            text-slate-500

                            dark:border-white/[0.08]
                            dark:bg-white/[0.04]
                            dark:text-slate-400
                        "
                    >
                        <Eye
                            size={12}
                            aria-hidden="true"
                        />

                        Preview
                    </span>
                </div>

                {/* =========================================
                    POST PREVIEW CARD
                ========================================== */}

                <div
                    className="
                        relative

                        w-full
                        min-w-0

                        overflow-hidden

                        rounded-2xl
                        border

                        border-slate-200
                        bg-white

                        p-3.5

                        shadow-[0_15px_35px_rgba(15,23,42,0.07)]

                        dark:border-white/[0.08]
                        dark:bg-[#101521]

                        dark:shadow-xl
                        dark:shadow-black/20

                        sm:rounded-[26px]
                        sm:p-5
                    "
                >
                    {/* =====================================
                        CATEGORY GLOW
                    ====================================== */}

                    <div
                        aria-hidden="true"
                        className={`
                            pointer-events-none

                            absolute
                            -right-16
                            -top-16

                            h-40
                            w-40

                            rounded-full
                            blur-[55px]

                            opacity-60

                            dark:opacity-100

                            ${selectedType.glowClass}
                        `}
                    />

                    {/* =====================================
                        CARD CONTENT
                    ====================================== */}

                    <div
                        className="
                            relative
                            z-10

                            w-full
                            min-w-0
                        "
                    >
                        {/* =============================
                            CATEGORY AND DATE
                        ============================== */}

                        <div
                            className="
                                flex
                                min-w-0

                                flex-wrap

                                items-center
                                justify-between

                                gap-2.5
                            "
                        >
                            {/* =========================
                                SELECTED CATEGORY
                            ========================== */}

                            <div
                                className={`
                                    inline-flex
                                    max-w-full

                                    min-w-0

                                    items-center
                                    gap-2

                                    rounded-full
                                    border

                                    px-3
                                    py-1.5

                                    text-[10px]
                                    font-black

                                    uppercase
                                    tracking-wider

                                    ${selectedType.activeClass}
                                `}
                            >
                                <SelectedIcon
                                    size={12}
                                    aria-hidden="true"
                                    className="shrink-0"
                                />

                                <span
                                    className="
                                        min-w-0
                                        truncate
                                    "
                                >
                                    {selectedType.label}
                                </span>
                            </div>

                            {/* =========================
                                PREVIEW TIME
                            ========================== */}

                            <span
                                className="
                                    shrink-0

                                    text-[10px]
                                    font-bold

                                    text-slate-500

                                    dark:text-slate-400
                                "
                            >
                                Hozir
                            </span>
                        </div>

                        {/* =============================
                            POST TITLE
                        ============================== */}

                        <h3
                            className={`
                                mt-4

                                min-w-0

                                break-words
                                [overflow-wrap:anywhere]

                                font-black
                                leading-tight

                                sm:mt-5

                                ${
                                    hasTitle
                                        ? `
                                            text-lg
                                            text-slate-900
                                            dark:text-white

                                            sm:text-xl
                                        `
                                        : `
                                            text-base
                                            text-slate-400
                                            dark:text-slate-500

                                            sm:text-lg
                                        `
                                }
                            `}
                        >
                            {hasTitle
                                ? title
                                : "Post sarlavhasi shu yerda ko‘rinadi..."}
                        </h3>

                        {/* =============================
                            CONTENT PREVIEW
                        ============================== */}

                        <div
                            className="
                                mt-4

                                min-w-0

                                border-l-2
                                border-indigo-400/40

                                pl-3

                                sm:pl-4
                            "
                        >
                            <p
                                className={`
                                    line-clamp-6

                                    whitespace-pre-wrap

                                    break-words
                                    [overflow-wrap:anywhere]

                                    text-[13px]
                                    font-medium
                                    leading-6

                                    sm:text-sm
                                    sm:leading-7

                                    ${
                                        hasContent
                                            ? `
                                                text-slate-600
                                                dark:text-slate-400
                                            `
                                            : `
                                                text-slate-400
                                                dark:text-slate-500
                                            `
                                    }
                                `}
                            >
                                {hasContent
                                    ? previewContent
                                    : "Post mazmunini yozishni boshlaganingizda preview shu yerda paydo bo‘ladi."}
                            </p>
                        </div>

                        {/* =============================
                            STATS PREVIEW

                            These are decorative preview
                            values, not live API stats.
                        ============================== */}

                        <div
                            className="
                                mt-5

                                flex
                                min-w-0

                                flex-wrap
                                items-center

                                gap-x-4
                                gap-y-2.5

                                border-t
                                border-slate-200

                                pt-4

                                dark:border-white/[0.08]

                                sm:mt-6
                            "
                        >
                            <PreviewStat
                                Icon={Heart}
                                count={0}
                                label="Layklar"
                            />

                            <PreviewStat
                                Icon={Eye}
                                count={0}
                                label="Ko‘rishlar"
                            />

                            <PreviewStat
                                Icon={MessageCircle}
                                count={0}
                                label="Izohlar"
                            />
                        </div>
                    </div>
                </div>

                {/* =========================================
                    WRITING TIPS
                ========================================== */}

                <div
                    className="
                        mt-4

                        w-full
                        min-w-0

                        rounded-2xl
                        border

                        border-indigo-200
                        bg-indigo-50

                        p-3.5

                        dark:border-indigo-400/15
                        dark:bg-indigo-500/[0.05]

                        sm:p-4
                    "
                >
                    {/* =====================================
                        TIPS HEADER
                    ====================================== */}

                    <div
                        className="
                            flex
                            min-w-0

                            items-center
                            gap-2

                            text-xs
                            font-black

                            text-indigo-700
                            dark:text-indigo-300
                        "
                    >
                        <Sparkles
                            size={14}
                            aria-hidden="true"
                            className="shrink-0"
                        />

                        <span>
                            Yaxshi post uchun
                        </span>
                    </div>

                    {/* =====================================
                        TIPS DESCRIPTION
                    ====================================== */}

                    <p
                        className="
                            mt-2

                            break-words

                            text-xs
                            font-medium
                            leading-5

                            text-slate-600
                            dark:text-slate-400
                        "
                    >
                        Aniq sarlavha yozing,
                        muammoni tushuntiring va
                        boshqalarga foyda beradigan
                        yechim yoki tajribani ulashing.
                    </p>
                </div>
            </div>
        </aside>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(PostCreatePreview);
