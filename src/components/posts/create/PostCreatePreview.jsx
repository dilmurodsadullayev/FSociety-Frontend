
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
                    items-center
                    gap-1.5

                    text-xs
                    font-bold

                    text-slate-500
                    dark:text-slate-500
                "
            >
                <Icon
                    size={14}
                    aria-hidden="true"
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
//   Plain text obtained from existing stripHtml().
//
// Responsibilities:
//
// - Selected post type
// - Category color
// - Category icon
// - Live title
// - Live content
// - Preview statistics
// - Writing tips
//
// This component does NOT:
// - Submit posts
// - Fetch posts
// - Modify form state
// - Parse unsafe HTML into elements
// =========================================================

const PostCreatePreview = ({
    formData = EMPTY_FORM,
    cleanPreviewContent = "",
}) => {
    // =====================================================
    // SAFE FORM DATA
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
    //
    // Shared configuration.
    // No duplicate POST_TYPES array.
    // =====================================================

    const selectedType =
        getPostType(postType);

    const SelectedIcon =
        selectedType.Icon;

    // =====================================================
    // PREVIEW STATE
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
                hidden
                min-w-0

                border-slate-200
                bg-slate-50/80

                p-6

                dark:border-white/[0.06]
                dark:bg-black/10

                lg:block
            "
        >
            {/* =====================================
                STICKY PREVIEW CONTENT
            ====================================== */}

            <div
                className="
                    sticky
                    top-4
                    min-w-0
                "
            >
                {/* =====================================
                    PREVIEW HEADER
                ====================================== */}

                <div
                    className="
                        mb-4

                        flex
                        min-w-0

                        items-center
                        justify-between
                        gap-3
                    "
                >
                    {/* TITLE */}

                    <div className="min-w-0">
                        <p
                            className="
                                text-xs
                                font-black

                                uppercase
                                tracking-[0.16em]

                                text-slate-700
                                dark:text-slate-400
                            "
                        >
                            Live preview
                        </p>

                        <p
                            className="
                                mt-1

                                text-[10px]
                                font-medium
                                leading-5

                                text-slate-500
                                dark:text-slate-500
                            "
                        >
                            Post kartada taxminan shunday ko‘rinadi
                        </p>
                    </div>

                    {/* PREVIEW BADGE */}

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

                            text-[9px]
                            font-bold

                            uppercase
                            tracking-wider

                            text-slate-500

                            dark:border-white/[0.07]
                            dark:bg-white/[0.03]
                            dark:text-slate-400
                        "
                    >
                        <Eye
                            size={11}
                            aria-hidden="true"
                        />

                        Preview
                    </span>
                </div>

                {/* =====================================
                    POST PREVIEW CARD
                ====================================== */}

                <div
                    className="
                        relative
                        min-w-0
                        overflow-hidden

                        rounded-[26px]
                        border

                        border-slate-200
                        bg-white

                        p-5

                        shadow-[0_15px_35px_rgba(15,23,42,0.07)]

                        dark:border-white/[0.08]
                        dark:bg-[#101521]

                        dark:shadow-2xl
                        dark:shadow-black/30
                    "
                >
                    {/* =================================
                        CATEGORY GLOW
                    ================================== */}

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

                    {/* =================================
                        CARD CONTENT
                    ================================== */}

                    <div
                        className="
                            relative
                            z-10
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
                                gap-3
                            "
                        >
                            {/* SELECTED CATEGORY */}

                            <div
                                className={`
                                    inline-flex
                                    max-w-full

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

                                <span className="truncate">
                                    {selectedType.label}
                                </span>
                            </div>

                            {/* PREVIEW TIME */}

                            <span
                                className="
                                    shrink-0

                                    text-[10px]
                                    font-bold

                                    text-slate-500
                                    dark:text-slate-500
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
                                mt-5

                                min-w-0
                                break-words

                                font-black
                                leading-tight

                                ${
                                    hasTitle
                                        ? `
                                            text-xl
                                            text-slate-900
                                            dark:text-white
                                        `
                                        : `
                                            text-lg
                                            text-slate-400
                                            dark:text-slate-600
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

                                pl-4
                            "
                        >
                            <p
                                className={`
                                    line-clamp-6

                                    whitespace-pre-wrap
                                    break-words

                                    text-sm
                                    font-medium
                                    leading-7

                                    ${
                                        hasContent
                                            ? `
                                                text-slate-600
                                                dark:text-slate-400
                                            `
                                            : `
                                                text-slate-400
                                                dark:text-slate-600
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
                        ============================== */}

                        <div
                            className="
                                mt-6

                                flex
                                flex-wrap
                                items-center
                                gap-4

                                border-t
                                border-slate-200

                                pt-4

                                dark:border-white/[0.06]
                            "
                        >
                            {/* LIKES */}

                            <PreviewStat
                                Icon={Heart}
                                count={0}
                                label="Layklar"
                            />

                            {/* VIEWS */}

                            <PreviewStat
                                Icon={Eye}
                                count={0}
                                label="Ko‘rishlar"
                            />

                            {/* COMMENTS */}

                            <PreviewStat
                                Icon={MessageCircle}
                                count={0}
                                label="Izohlar"
                            />
                        </div>
                    </div>
                </div>

                {/* =====================================
                    WRITING TIPS
                ====================================== */}

                <div
                    className="
                        mt-4
                        min-w-0

                        rounded-2xl
                        border

                        border-indigo-200
                        bg-indigo-50

                        p-4

                        dark:border-indigo-400/15
                        dark:bg-indigo-500/[0.05]
                    "
                >
                    {/* TIPS HEADER */}

                    <div
                        className="
                            flex
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
                        />

                        Yaxshi post uchun
                    </div>

                    {/* TIPS DESCRIPTION */}

                    <p
                        className="
                            mt-2

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
