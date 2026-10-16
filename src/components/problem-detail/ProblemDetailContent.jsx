
import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    ArrowDown,
    ArrowUp,
    Check,
    Clipboard,
    Code2,
    Loader2,
    Sparkles,
    Star,
    Tags,
} from "lucide-react";

import {
    siteToast,
} from "../ui/AuthToast";

import {
    ProblemDetailStackTag,
} from "./ProblemDetailHeader";

// =========================================================
// FSOCIETY — PROBLEM DETAIL CONTENT
//
// Responsibilities:
// - Problem description
// - Technologies
// - Problem code
// - Copy code
// - Star / unstar actions
// - Star statistics
// - Solution hint
//
// Existing props preserved.
//
// Improvements:
// - Light / Dark Mode
// - Mobile-first responsive layout
// - Clipboard fallback
// - Copy request protection
// - Timer cleanup
// - Accessible actions
// - Reduced motion support
//
// No direct API requests.
// Redux actions remain in useProblemDetailActions.
// =========================================================

// =========================================================
// CONSTANTS
// =========================================================

const COPY_SUCCESS_DURATION = 2000;

const COPY_TOAST_DURATION = 2200;

// =========================================================
// SAFE NUMBER
// =========================================================

const safeNumber = (
    value,
    fallback = 0
) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return fallback;
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return fallback;
    }

    return Math.max(0, number);
};

// =========================================================
// VALID IDENTIFIER
// =========================================================

const hasIdentifier = (value) => {
    return (
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ""
    );
};

// =========================================================
// CLIPBOARD HELPER
//
// Modern:
// navigator.clipboard.writeText
//
// Fallback:
// document.execCommand("copy")
//
// Does not modify the original code text.
// =========================================================

const copyTextToClipboard = async (text) => {
    // =====================================================
    // MODERN CLIPBOARD API
    // =====================================================

    if (
        typeof navigator !== "undefined" &&
        navigator.clipboard?.writeText
    ) {
        try {
            await navigator.clipboard.writeText(text);

            return true;
        } catch {
            // Modern clipboard may fail due to
            // browser permissions or context.
            // Continue with the legacy fallback.
        }
    }

    // =====================================================
    // LEGACY CLIPBOARD SUPPORT
    // =====================================================

    if (
        typeof document === "undefined" ||
        typeof document.execCommand !== "function"
    ) {
        throw new Error(
            "Clipboard API mavjud emas."
        );
    }

    const textarea = document.createElement(
        "textarea"
    );

    textarea.value = text;

    textarea.setAttribute(
        "readonly",
        ""
    );

    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";
    textarea.style.opacity = "0";

    try {
        document.body.appendChild(textarea);

        textarea.focus();
        textarea.select();

        textarea.setSelectionRange(
            0,
            textarea.value.length
        );

        const success = document.execCommand(
            "copy"
        );

        if (!success) {
            throw new Error(
                "Clipboard copy command failed."
            );
        }

        return true;
    } finally {
        textarea.remove();
    }
};

// =========================================================
// STAR BUTTON BASE CLASS
// =========================================================

const STAR_BUTTON_BASE = `
    inline-flex

    h-10
    w-10

    shrink-0

    items-center
    justify-center

    rounded-xl
    border

    transition-all
    duration-200

    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-cyan-500

    disabled:cursor-not-allowed
    disabled:opacity-50

    sm:h-11
    sm:w-11

    lg:h-12
    lg:w-12
    lg:rounded-2xl

    motion-reduce:transform-none
    motion-reduce:transition-none
`;

// =========================================================
// STAR PANEL
// =========================================================

const ProblemStarPanel = React.memo(({
    starCount = 0,
    hasStarredProblem = false,
    isStarLoading = false,
    canAddStar = true,
    canRemoveStar = true,
    onAddStar,
    onRemoveStar,
}) => {
    // =====================================================
    // VALUES
    // =====================================================

    const starred = Boolean(hasStarredProblem);
    const loading = Boolean(isStarLoading);

    const count = Math.floor(
        safeNumber(starCount)
    );

    const formattedCount = count.toLocaleString(
        "uz-UZ"
    );

    // =====================================================
    // BUTTON STATES
    // =====================================================

    const addDisabled =
        starred ||
        loading ||
        !canAddStar;

    const removeDisabled =
        !starred ||
        loading ||
        !canRemoveStar;

    // =====================================================
    // JSX
    // =====================================================

    return (
        <aside
            aria-label="Muammoga star berish boshqaruvi"
            className="
                w-full
                min-w-0

                lg:w-auto
                lg:shrink-0
            "
        >
            {/* ======================================
                STAR CONTROLS
            ====================================== */}

            <div
                aria-busy={loading}
                className="
                    flex
                    w-full
                    min-w-0

                    flex-row
                    items-center
                    justify-between
                    gap-3

                    rounded-2xl
                    border
                    border-slate-200

                    bg-white/95

                    p-2

                    shadow-sm

                    sm:justify-start

                    lg:sticky
                    lg:top-24

                    lg:w-[72px]
                    lg:flex-col
                    lg:justify-center
                    lg:gap-1.5
                    lg:rounded-3xl
                    lg:p-2.5

                    dark:border-white/[0.10]
                    dark:bg-[#111827]/90

                    dark:shadow-[0_12px_30px_rgba(0,0,0,0.13)]

                    backdrop-blur-xl
                "
            >
                {/* ==================================
                    ADD STAR
                ================================== */}

                <button
                    type="button"
                    onClick={onAddStar}
                    disabled={addDisabled}
                    aria-label={
                        starred
                            ? "Siz allaqachon star bergansiz"
                            : "Muammoga star berish"
                    }
                    aria-pressed={starred}
                    title={
                        starred
                            ? "Star berilgan"
                            : "Star berish"
                    }
                    className={`
                        ${STAR_BUTTON_BASE}

                        ${
                            starred
                                ? `
                                    border-emerald-300
                                    bg-emerald-50
                                    text-emerald-700

                                    dark:border-emerald-400/30
                                    dark:bg-emerald-400/[0.10]
                                    dark:text-emerald-300
                                `
                                : `
                                    border-slate-200
                                    bg-slate-50
                                    text-emerald-700

                                    hover:border-emerald-400/40
                                    hover:bg-emerald-50

                                    active:scale-[0.96]

                                    dark:border-emerald-400/20
                                    dark:bg-emerald-400/[0.07]
                                    dark:text-emerald-300

                                    dark:hover:bg-emerald-400/[0.14]
                                `
                        }
                    `}
                >
                    {loading ? (
                        <Loader2
                            size={19}
                            aria-hidden="true"
                            className="
                                animate-spin
                                motion-reduce:animate-none
                            "
                        />
                    ) : (
                        <ArrowUp
                            size={20}
                            strokeWidth={2}
                            aria-hidden="true"
                        />
                    )}
                </button>

                {/* ==================================
                    STAR COUNT
                ================================== */}

                <div
                    className="
                        flex
                        min-w-0

                        flex-1
                        flex-col
                        items-center
                        justify-center

                        lg:flex-none
                    "
                >
                    <span
                        aria-label={
                            `${formattedCount} ta star`
                        }
                        className="
                            font-display
                            text-xl
                            font-black
                            leading-none
                            tabular-nums

                            text-slate-900

                            sm:text-2xl

                            lg:my-2
                            lg:text-2xl

                            dark:text-white
                        "
                    >
                        {formattedCount}
                    </span>

                    <span
                        className="
                            mt-1

                            font-mono
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.10em]

                            text-slate-500

                            lg:hidden

                            dark:text-gray-400
                        "
                    >
                        Star
                    </span>
                </div>

                {/* ==================================
                    REMOVE STAR
                ================================== */}

                <button
                    type="button"
                    onClick={onRemoveStar}
                    disabled={removeDisabled}
                    aria-label={
                        starred
                            ? "Starni olib tashlash"
                            : "Star berilmagan"
                    }
                    title={
                        starred
                            ? "Starni olib tashlash"
                            : "Avval star bering"
                    }
                    className={`
                        ${STAR_BUTTON_BASE}

                        ${
                            starred
                                ? `
                                    border-rose-300
                                    bg-rose-50
                                    text-rose-700

                                    hover:border-rose-400
                                    hover:bg-rose-100

                                    active:scale-[0.96]

                                    dark:border-rose-400/30
                                    dark:bg-rose-400/[0.09]
                                    dark:text-rose-300

                                    dark:hover:bg-rose-400/[0.15]
                                `
                                : `
                                    border-slate-200
                                    bg-slate-100
                                    text-slate-400

                                    dark:border-white/[0.09]
                                    dark:bg-white/[0.035]
                                    dark:text-gray-500
                                `
                        }
                    `}
                >
                    {loading ? (
                        <Loader2
                            size={19}
                            aria-hidden="true"
                            className="
                                animate-spin
                                motion-reduce:animate-none
                            "
                        />
                    ) : (
                        <ArrowDown
                            size={20}
                            strokeWidth={2}
                            aria-hidden="true"
                        />
                    )}
                </button>

                {/* ==================================
                    STAR STATE

                    Visual-only indicator.
                ================================== */}

                <div
                    aria-hidden="true"
                    className={`
                        hidden

                        h-9
                        w-9

                        items-center
                        justify-center

                        rounded-xl
                        border

                        lg:mt-2
                        lg:inline-flex

                        ${
                            starred
                                ? `
                                    border-amber-300
                                    bg-amber-50
                                    text-amber-700

                                    dark:border-amber-400/25
                                    dark:bg-amber-400/[0.10]
                                    dark:text-amber-300
                                `
                                : `
                                    border-slate-200
                                    bg-slate-100
                                    text-slate-400

                                    dark:border-white/[0.09]
                                    dark:bg-white/[0.04]
                                    dark:text-gray-500
                                `
                        }
                    `}
                >
                    {starred ? (
                        <Check
                            size={15}
                            strokeWidth={2}
                        />
                    ) : (
                        <Star
                            size={15}
                            strokeWidth={1.9}
                        />
                    )}
                </div>
            </div>
        </aside>
    );
});

// =========================================================
// PROBLEM DESCRIPTION
// =========================================================

const ProblemDescription = React.memo(({
    description,
    technologies = [],
}) => {
    const safeTechnologies =
        Array.isArray(technologies)
            ? technologies
            : [];

    return (
        <section
            aria-labelledby="problem-description-title"
            className="
                relative

                w-full
                min-w-0

                overflow-hidden

                rounded-[22px]
                border
                border-slate-200

                bg-slate-50/80

                p-4

                sm:rounded-3xl
                sm:p-5

                dark:border-white/[0.09]
                dark:bg-white/[0.035]
            "
        >
            {/* ======================================
                SECTION HEADER
            ====================================== */}

            <div
                className="
                    mb-4

                    flex
                    items-center
                    gap-2.5
                "
            >
                <span
                    aria-hidden="true"
                    className="
                        inline-flex
                        h-9
                        w-9

                        shrink-0

                        items-center
                        justify-center

                        rounded-xl
                        border
                        border-indigo-200

                        bg-indigo-50

                        text-indigo-700

                        dark:border-indigo-400/20
                        dark:bg-indigo-400/[0.09]
                        dark:text-indigo-300
                    "
                >
                    <Code2
                        size={17}
                        strokeWidth={1.9}
                    />
                </span>

                <div className="min-w-0">
                    <p
                        className="
                            font-mono
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.15em]

                            text-indigo-600

                            dark:text-indigo-400
                        "
                    >
                        Problem context
                    </p>

                    <h2
                        id="problem-description-title"
                        className="
                            mt-0.5

                            font-display
                            text-lg
                            font-black

                            text-slate-900

                            sm:text-xl

                            dark:text-white
                        "
                    >
                        Muammo tavsifi
                    </h2>
                </div>
            </div>

            {/* ======================================
                DESCRIPTION
            ====================================== */}

            <div
                className="
                    min-w-0

                    whitespace-pre-wrap
                    break-words
                    [overflow-wrap:anywhere]

                    text-[13px]
                    font-medium
                    leading-7

                    text-slate-700

                    sm:text-sm
                    sm:leading-7

                    md:text-[15px]
                    md:leading-8

                    dark:text-gray-300
                "
            >
                {description}
            </div>

            {/* ======================================
                TECHNOLOGIES
            ====================================== */}

            {safeTechnologies.length > 0 && (
                <div
                    className="
                        mt-6

                        border-t
                        border-slate-200

                        pt-5

                        dark:border-white/[0.08]
                    "
                >
                    {/* ==================================
                        TECHNOLOGIES HEADER
                    ================================== */}

                    <div
                        className="
                            mb-3

                            flex
                            min-w-0

                            flex-wrap
                            items-center
                            justify-between
                            gap-2
                        "
                    >
                        <div
                            className="
                                inline-flex
                                min-w-0

                                items-center
                                gap-2
                            "
                        >
                            <Tags
                                size={15}
                                strokeWidth={1.9}
                                aria-hidden="true"

                                className="
                                    shrink-0

                                    text-indigo-600

                                    dark:text-indigo-400
                                "
                            />

                            <span
                                className="
                                    font-mono
                                    text-[10px]
                                    font-black
                                    uppercase
                                    tracking-[0.10em]

                                    text-slate-600

                                    dark:text-gray-400
                                "
                            >
                                Teglar / Texnologiyalar
                            </span>
                        </div>

                        {/* COUNT */}

                        <span
                            title={
                                `${safeTechnologies.length} ta texnologiya`
                            }
                            className="
                                inline-flex
                                min-h-6

                                items-center
                                justify-center

                                rounded-full
                                border
                                border-slate-200

                                bg-white

                                px-2

                                font-mono
                                text-[10px]
                                font-bold
                                tabular-nums

                                text-slate-600

                                dark:border-white/[0.09]
                                dark:bg-white/[0.04]
                                dark:text-gray-400
                            "
                        >
                            {safeTechnologies.length}
                        </span>
                    </div>

                    {/* ==================================
                        TECHNOLOGY BADGES
                    ================================== */}

                    <div
                        className="
                            flex
                            min-w-0

                            flex-wrap
                            items-center
                            gap-2
                        "
                    >
                        {safeTechnologies.map((
                            technology,
                            index
                        ) => (
                            <ProblemDetailStackTag
                                key={
                                    `technology-${
                                        technology?.id ??
                                        technology?.name ??
                                        (
                                            typeof technology === "string"
                                                ? technology
                                                : index
                                        )
                                    }-${index}`
                                }

                                item={technology}

                                type="technology"
                            />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
});

// =========================================================
// PROBLEM CODE BLOCK
// =========================================================

const ProblemCodeBlock = React.memo(({
    code = "",
    copied = false,
    isCopying = false,
    onCopy,
}) => {
    const hasCode =
        typeof code === "string" &&
        code.length > 0;

    return (
        <section
            aria-labelledby="problem-code-title"
            className="
                mt-5

                w-full
                min-w-0

                overflow-hidden

                rounded-[22px]
                border
                border-slate-200

                bg-white

                shadow-sm

                sm:mt-6
                sm:rounded-3xl

                dark:border-white/[0.10]
                dark:bg-[#090f1b]

                dark:shadow-black/10
            "
        >
            {/* ======================================
                CODE HEADER
            ====================================== */}

            <div
                className="
                    flex
                    min-w-0

                    flex-col
                    gap-3

                    border-b
                    border-slate-200

                    bg-slate-50/90

                    px-4
                    py-3

                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    sm:gap-4
                    sm:px-5

                    dark:border-white/[0.09]
                    dark:bg-white/[0.035]
                "
            >
                {/* ==================================
                    CODE TITLE
                ================================== */}

                <div
                    className="
                        flex
                        min-w-0

                        items-center
                        gap-3
                    "
                >
                    {/* EDITOR INDICATORS */}

                    <div
                        aria-hidden="true"
                        className="
                            flex
                            shrink-0

                            items-center
                            gap-1.5
                        "
                    >
                        <span
                            className="
                                h-2
                                w-2
                                rounded-full
                                bg-rose-400
                            "
                        />

                        <span
                            className="
                                h-2
                                w-2
                                rounded-full
                                bg-amber-400
                            "
                        />

                        <span
                            className="
                                h-2
                                w-2
                                rounded-full
                                bg-emerald-400
                            "
                        />
                    </div>

                    <div className="min-w-0">
                        <p
                            className="
                                font-mono
                                text-[9px]
                                font-black
                                uppercase
                                tracking-[0.14em]

                                text-slate-500

                                dark:text-gray-500
                            "
                        >
                            Error Code
                        </p>

                        <h3
                            id="problem-code-title"
                            className="
                                mt-0.5

                                break-words

                                font-display
                                text-[13px]
                                font-black

                                text-slate-900

                                sm:text-sm

                                dark:text-white
                            "
                        >
                            Xatolik bo‘lgan kod
                        </h3>
                    </div>
                </div>

                {/* ==================================
                    COPY BUTTON
                ================================== */}

                {hasCode && (
                    <button
                        type="button"
                        onClick={onCopy}
                        disabled={isCopying}
                        aria-label={
                            copied
                                ? "Kod nusxalandi"
                                : "Kodni nusxalash"
                        }
                        aria-busy={isCopying}
                        className={`
                            inline-flex
                            min-h-10

                            items-center
                            justify-center
                            gap-2

                            self-start

                            rounded-xl
                            border

                            px-4
                            py-2

                            font-display
                            text-xs
                            font-bold

                            transition-colors
                            duration-150

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-indigo-500

                            disabled:cursor-wait
                            disabled:opacity-60

                            sm:self-auto

                            ${
                                copied
                                    ? `
                                        border-emerald-300
                                        bg-emerald-50
                                        text-emerald-700

                                        dark:border-emerald-400/25
                                        dark:bg-emerald-400/[0.09]
                                        dark:text-emerald-300
                                    `
                                    : `
                                        border-indigo-200
                                        bg-indigo-50
                                        text-indigo-700

                                        hover:border-indigo-300
                                        hover:bg-indigo-100

                                        dark:border-indigo-400/25
                                        dark:bg-indigo-400/[0.09]
                                        dark:text-indigo-300

                                        dark:hover:bg-indigo-400/[0.14]
                                    `
                            }
                        `}
                    >
                        {isCopying ? (
                            <Loader2
                                size={15}
                                aria-hidden="true"
                                className="
                                    animate-spin
                                    motion-reduce:animate-none
                                "
                            />
                        ) : copied ? (
                            <Check
                                size={15}
                                strokeWidth={2}
                                aria-hidden="true"
                            />
                        ) : (
                            <Clipboard
                                size={15}
                                strokeWidth={1.9}
                                aria-hidden="true"
                            />
                        )}

                        {isCopying
                            ? "Nusxalanmoqda..."
                            : copied
                                ? "Nusxalandi"
                                : "Nusxalash"}
                    </button>
                )}
            </div>

            {/* ======================================
                CODE CONTENT
            ====================================== */}

            {hasCode ? (
                <pre
                    tabIndex={0}
                    aria-label="Muammoga tegishli kod"
                    className="
                        max-h-[520px]
                        w-full
                        min-w-0

                        overflow-auto

                        overscroll-contain

                        bg-slate-50

                        p-4

                        font-mono
                        text-xs
                        leading-6

                        text-slate-800

                        outline-none

                        focus-visible:ring-2
                        focus-visible:ring-inset
                        focus-visible:ring-indigo-500

                        sm:p-5
                        sm:text-[13px]
                        sm:leading-7

                        dark:bg-[#090f1b]
                        dark:text-slate-200
                    "
                >
                    <code>{code}</code>
                </pre>
            ) : (
                <div
                    className="
                        flex
                        min-h-[120px]

                        items-center
                        justify-center

                        px-4
                        py-8

                        text-center

                        sm:px-6
                    "
                >
                    <p
                        className="
                            text-sm
                            font-medium
                            italic

                            text-slate-500

                            dark:text-gray-400
                        "
                    >
                        Kod mavjud emas.
                    </p>
                </div>
            )}
        </section>
    );
});

// =========================================================
// SOLUTION HINT
// =========================================================

const ProblemSolutionHint = React.memo(() => {
    return (
        <aside
            aria-label="Yechim yozish bo‘yicha tavsiya"
            className="
                mt-5

                flex
                min-w-0

                items-start
                gap-3

                rounded-[22px]
                border
                border-cyan-200

                bg-cyan-50/80

                p-4

                sm:rounded-3xl
                sm:p-5

                dark:border-cyan-400/20
                dark:bg-cyan-400/[0.07]
            "
        >
            {/* ICON */}

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
                    border-cyan-200

                    bg-white/80

                    text-cyan-700

                    dark:border-cyan-400/20
                    dark:bg-cyan-400/[0.08]
                    dark:text-cyan-300
                "
            >
                <Sparkles
                    size={17}
                    strokeWidth={1.9}
                />
            </div>

            {/* CONTENT */}

            <div className="min-w-0">
                <p
                    className="
                        mb-1

                        font-display
                        text-[12px]
                        font-black

                        text-cyan-900

                        dark:text-cyan-200
                    "
                >
                    Yechim topa olasizmi?
                </p>

                <p
                    className="
                        break-words

                        text-[13px]
                        font-medium
                        leading-6

                        text-cyan-900/85

                        sm:text-sm

                        dark:text-cyan-100/85
                    "
                >
                    Ushbu muammoni hal qilish uchun eng
                    to‘g‘ri yondashuv qanday? O‘z
                    yechimingizni pastda qoldiring.
                </p>
            </div>
        </aside>
    );
});

// =========================================================
// MAIN COMPONENT
// =========================================================

const ProblemDetailContent = ({
    // =====================================================
    // PROBLEM DATA
    // =====================================================

    problemDetail,

    problemTechnologies = [],

    // =====================================================
    // STAR STATE
    // =====================================================

    hasStarredProblem = false,

    isStarLoading = false,

    // =====================================================
    // STAR CALLBACKS
    // =====================================================

    onAddStar,

    onRemoveStar,
}) => {
    // =====================================================
    // LOCAL STATE
    // =====================================================

    const [
        copied,
        setCopied,
    ] = useState(false);

    const [
        isCopying,
        setIsCopying,
    ] = useState(false);

    // =====================================================
    // REFS
    // =====================================================

    const copyTimerRef = useRef(null);

    const copyInFlightRef = useRef(false);

    const mountedRef = useRef(false);

    // =====================================================
    // LIFECYCLE
    //
    // Prevent timeout callbacks from updating
    // state after unmount.
    // =====================================================

    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;

            if (copyTimerRef.current !== null) {
                window.clearTimeout(
                    copyTimerRef.current
                );

                copyTimerRef.current = null;
            }
        };
    }, []);

    // =====================================================
    // SAFE DATA
    // =====================================================

    const problemId =
        problemDetail?.id ?? null;

    const validProblemId =
        hasIdentifier(problemId);

    const starCount = safeNumber(
        problemDetail?.star
    );

    const description =
        typeof problemDetail?.description === "string" &&
        problemDetail.description.trim()
            ? problemDetail.description
            : "Muammo uchun tavsif mavjud emas.";

    const code =
        typeof problemDetail?.code === "string"
            ? problemDetail.code
            : "";

    const technologies = Array.isArray(
        problemTechnologies
    )
        ? problemTechnologies.filter(Boolean)
        : [];

    // =====================================================
    // COPY CODE
    // =====================================================

    const handleCopy = useCallback(async () => {
        // =================================================
        // EMPTY CODE
        // =================================================

        if (!code) {
            siteToast.warning(
                "Nusxalash uchun kod mavjud emas.",
                {
                    title: "Kod topilmadi",
                }
            );

            return;
        }

        // =================================================
        // IMMEDIATE REQUEST LOCK
        // =================================================

        if (copyInFlightRef.current) {
            return;
        }

        copyInFlightRef.current = true;

        if (mountedRef.current) {
            setIsCopying(true);
        }

        // =================================================
        // CLEAR PREVIOUS TIMER
        // =================================================

        if (copyTimerRef.current !== null) {
            window.clearTimeout(
                copyTimerRef.current
            );

            copyTimerRef.current = null;
        }

        // =================================================
        // COPY
        // =================================================

        try {
            await copyTextToClipboard(code);

            if (!mountedRef.current) {
                return;
            }

            // =============================================
            // SUCCESS STATE
            // =============================================

            setCopied(true);

            siteToast.success(
                "Kod clipboardga nusxalandi.",
                {
                    title: "Nusxalandi",
                    duration: COPY_TOAST_DURATION,
                }
            );

            // =============================================
            // RESET SUCCESS INDICATOR
            // =============================================

            copyTimerRef.current =
                window.setTimeout(() => {
                    copyTimerRef.current = null;

                    if (mountedRef.current) {
                        setCopied(false);
                    }
                }, COPY_SUCCESS_DURATION);
        } catch (error) {
            console.error(
                "Copy xato:",
                error
            );

            if (!mountedRef.current) {
                return;
            }

            setCopied(false);

            siteToast.error(
                "Kodni nusxalab bo‘lmadi.",
                {
                    title: "Nusxalash xatosi",
                }
            );
        } finally {
            copyInFlightRef.current = false;

            if (mountedRef.current) {
                setIsCopying(false);
            }
        }
    }, [code]);

    // =====================================================
    // ADD STAR
    //
    // The actual API request is implemented in
    // useProblemDetailActions.
    // =====================================================

    const handleAddStar = useCallback(() => {
        if (
            !validProblemId ||
            hasStarredProblem ||
            isStarLoading ||
            typeof onAddStar !== "function"
        ) {
            return;
        }

        onAddStar(problemId);
    }, [
        validProblemId,
        hasStarredProblem,
        isStarLoading,
        onAddStar,
        problemId,
    ]);

    // =====================================================
    // REMOVE STAR
    //
    // Preserves the original separate unstar flow.
    // =====================================================

    const handleRemoveStar = useCallback(() => {
        if (
            !validProblemId ||
            !hasStarredProblem ||
            isStarLoading ||
            typeof onRemoveStar !== "function"
        ) {
            return;
        }

        onRemoveStar(problemId);
    }, [
        validProblemId,
        hasStarredProblem,
        isStarLoading,
        onRemoveStar,
        problemId,
    ]);

    // =====================================================
    // JSX
    // =====================================================

    return (
        <div
            className="
                flex
                w-full
                min-w-0

                flex-col
                gap-4

                lg:flex-row
                lg:items-start
                lg:gap-5
            "
        >
            {/* ======================================
                STAR PANEL
            ====================================== */}

            <ProblemStarPanel
                starCount={starCount}

                hasStarredProblem={
                    hasStarredProblem
                }

                isStarLoading={
                    isStarLoading
                }

                canAddStar={
                    validProblemId &&
                    typeof onAddStar === "function"
                }

                canRemoveStar={
                    validProblemId &&
                    typeof onRemoveStar === "function"
                }

                onAddStar={
                    handleAddStar
                }

                onRemoveStar={
                    handleRemoveStar
                }
            />

            {/* ======================================
                MAIN ARTICLE
            ====================================== */}

            <article
                className="
                    w-full
                    min-w-0
                    flex-1
                "
            >
                {/* ==================================
                    DESCRIPTION / TECHNOLOGIES
                ================================== */}

                <ProblemDescription
                    description={description}

                    technologies={
                        technologies
                    }
                />

                {/* ==================================
                    ERROR CODE
                ================================== */}

                <ProblemCodeBlock
                    code={code}

                    copied={copied}

                    isCopying={isCopying}

                    onCopy={handleCopy}
                />

                {/* ==================================
                    SOLUTION HINT
                ================================== */}

                <ProblemSolutionHint />
            </article>
        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(
    ProblemDetailContent
);
