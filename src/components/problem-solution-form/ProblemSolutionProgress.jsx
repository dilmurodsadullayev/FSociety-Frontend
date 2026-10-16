
import React, { memo } from "react";

import {
    Check,
    CheckCircle2,
    Languages,
    Sparkles,
} from "lucide-react";

// =========================================================
// CHECKLIST ITEM
// =========================================================

const ChecklistItem = memo(({
    completed = false,
    optional = false,
    children,
}) => (
    <div className="flex items-start gap-2.5">
        <span
            aria-hidden="true"
            className={`
                mt-0.5
                grid
                h-5
                w-5
                shrink-0
                place-items-center
                rounded-full
                border

                ${
                    completed
                        ? `
                            border-emerald-300
                            bg-emerald-50
                            text-emerald-700

                            dark:border-emerald-400/25
                            dark:bg-emerald-400/[0.10]
                            dark:text-emerald-300
                        `
                        : optional
                            ? `
                                border-indigo-200
                                bg-indigo-50
                                text-indigo-500

                                dark:border-indigo-400/20
                                dark:bg-indigo-400/[0.08]
                                dark:text-indigo-400
                            `
                            : `
                                border-slate-200
                                bg-slate-100
                                text-slate-400

                                dark:border-white/[0.10]
                                dark:bg-white/[0.04]
                                dark:text-gray-500
                            `
                }
            `}
        >
            {completed ? (
                <Check size={12} strokeWidth={2.5} />
            ) : (
                <span
                    className="
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-current
                    "
                />
            )}
        </span>

        <div className="min-w-0">
            <span
                className={`
                    text-[11px]
                    font-medium
                    leading-5

                    ${
                        completed
                            ? "text-slate-700 dark:text-gray-300"
                            : "text-slate-500 dark:text-gray-400"
                    }
                `}
            >
                {children}
            </span>

            {optional && (
                <span
                    className="
                        ml-1.5
                        text-[9px]
                        font-black
                        uppercase
                        text-indigo-600

                        dark:text-indigo-400
                    "
                >
                    ixtiyoriy
                </span>
            )}
        </div>
    </div>
));

// =========================================================
// PROGRESS BAR
// =========================================================

const ProgressBar = memo(({
    percent = 0,
}) => (
    <div
        role="progressbar"
        aria-label="Yechim tayyorligi"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="
            h-2
            w-full
            overflow-hidden
            rounded-full
            bg-slate-200

            dark:bg-white/[0.09]
        "
    >
        <div
            className="
                h-full
                rounded-full
                bg-gradient-to-r
                from-cyan-500
                to-indigo-500
                transition-all
                duration-300
                motion-reduce:transition-none
            "
            style={{ width: `${percent}%` }}
        />
    </div>
));

// =========================================================
// MAIN PROGRESS COMPONENT
// =========================================================

const ProblemSolutionProgress = ({
    formStatus,
    selectedLanguage = null,
    editorLanguage = "javascript",
    editorFileName = "solution.js",
    compact = false,
}) => {
    const status = formStatus || {
        answerReady: false,
        descriptionReady: false,
        languageReady: false,
        codeReady: false,
        percent: 0,
        ready: false,
    };

    // =====================================================
    // MOBILE / TABLET
    // =====================================================

    if (compact) {
        return (
            <section
                aria-label="Yechim tayyorligi"
                className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    p-4

                    dark:border-white/[0.09]
                    dark:bg-white/[0.03]
                "
            >
                <div
                    className="
                        mb-3
                        flex
                        items-center
                        justify-between
                        gap-3
                    "
                >
                    <span
                        className="
                            inline-flex
                            items-center
                            gap-2
                            text-xs
                            font-black
                            text-slate-700

                            dark:text-gray-300
                        "
                    >
                        <CheckCircle2
                            size={16}
                            aria-hidden="true"
                            className="
                                text-cyan-600
                                dark:text-cyan-400
                            "
                        />

                        Yechim tayyorligi
                    </span>

                    <span
                        className="
                            font-mono
                            text-xs
                            font-black
                            tabular-nums
                            text-cyan-700

                            dark:text-cyan-300
                        "
                    >
                        {status.percent}%
                    </span>
                </div>

                <ProgressBar percent={status.percent} />
            </section>
        );
    }

    // =====================================================
    // DESKTOP SIDEBAR
    // =====================================================

    return (
        <div className="space-y-4">
            {/* COMPLETENESS */}

            <section
                aria-label="Yechimni tekshirish"
                className="
                    rounded-[22px]
                    border
                    border-slate-200
                    bg-slate-50/80
                    p-5

                    dark:border-white/[0.09]
                    dark:bg-white/[0.025]
                "
            >
                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-3
                    "
                >
                    <div className="flex min-w-0 items-center gap-3">
                        <div
                            className="
                                grid
                                h-10
                                w-10
                                shrink-0
                                place-items-center
                                rounded-xl
                                border
                                border-cyan-200
                                bg-cyan-50
                                text-cyan-700

                                dark:border-cyan-400/20
                                dark:bg-cyan-400/[0.08]
                                dark:text-cyan-300
                            "
                        >
                            <CheckCircle2
                                size={18}
                                aria-hidden="true"
                            />
                        </div>

                        <div className="min-w-0">
                            <h3
                                className="
                                    text-xs
                                    font-black
                                    text-slate-900

                                    dark:text-white
                                "
                            >
                                Yechim tayyorligi
                            </h3>

                            <p
                                className="
                                    mt-0.5
                                    font-mono
                                    text-[9px]
                                    text-slate-500

                                    dark:text-gray-400
                                "
                            >
                                Required fields
                            </p>
                        </div>
                    </div>

                    <span
                        className="
                            font-mono
                            text-sm
                            font-black
                            tabular-nums
                            text-cyan-700

                            dark:text-cyan-300
                        "
                    >
                        {status.percent}%
                    </span>
                </div>

                <div className="mt-5">
                    <ProgressBar percent={status.percent} />
                </div>

                <div className="mt-5 space-y-3">
                    <ChecklistItem
                        completed={status.answerReady}
                    >
                        Qisqa va tushunarli yechim
                    </ChecklistItem>

                    <ChecklistItem
                        completed={status.descriptionReady}
                    >
                        Batafsil tushuntirish
                    </ChecklistItem>

                    <ChecklistItem
                        completed={status.languageReady}
                    >
                        Dasturlash tili tanlangan
                    </ChecklistItem>

                    <ChecklistItem
                        completed={status.codeReady}
                        optional
                    >
                        Kod namunasi
                    </ChecklistItem>
                </div>

                {status.ready && (
                    <div
                        className="
                            mt-5
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-emerald-200
                            bg-emerald-50
                            px-3
                            py-2.5
                            text-[11px]
                            font-bold
                            text-emerald-800

                            dark:border-emerald-400/20
                            dark:bg-emerald-400/[0.08]
                            dark:text-emerald-300
                        "
                    >
                        <Check
                            size={14}
                            aria-hidden="true"
                        />

                        Yechim yuborishga tayyor
                    </div>
                )}
            </section>

            {/* EDITOR LANGUAGE */}

            <section
                className="
                    rounded-[22px]
                    border
                    border-indigo-200
                    bg-indigo-50/70
                    p-5

                    dark:border-indigo-400/20
                    dark:bg-indigo-400/[0.04]
                "
            >
                <div
                    className="
                        flex
                        items-center
                        gap-2
                        text-indigo-700

                        dark:text-indigo-300
                    "
                >
                    <Languages
                        size={15}
                        aria-hidden="true"
                    />

                    <span
                        className="
                            font-mono
                            text-[10px]
                            font-black
                            uppercase
                            tracking-wider
                        "
                    >
                        Editor language
                    </span>
                </div>

                {selectedLanguage ? (
                    <div className="mt-4">
                        <p
                            className="
                                break-words
                                text-base
                                font-black
                                text-slate-900

                                dark:text-white
                            "
                        >
                            {selectedLanguage.name}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">
                            <span
                                className="
                                    rounded-lg
                                    border
                                    border-indigo-200
                                    bg-white
                                    px-2
                                    py-1
                                    font-mono
                                    text-[10px]
                                    text-indigo-700

                                    dark:border-indigo-400/20
                                    dark:bg-indigo-400/[0.07]
                                    dark:text-indigo-300
                                "
                            >
                                {editorLanguage}
                            </span>

                            <span
                                className="
                                    rounded-lg
                                    border
                                    border-slate-200
                                    bg-white
                                    px-2
                                    py-1
                                    font-mono
                                    text-[10px]
                                    text-slate-600

                                    dark:border-white/[0.10]
                                    dark:bg-white/[0.04]
                                    dark:text-gray-400
                                "
                            >
                                {editorFileName}
                            </span>
                        </div>
                    </div>
                ) : (
                    <p
                        className="
                            mt-3
                            text-[11px]
                            leading-5
                            text-slate-600

                            dark:text-gray-400
                        "
                    >
                        Tilni tanlasangiz, kod muharriri
                        shu tilga avtomatik moslashadi.
                    </p>
                )}
            </section>

            {/* TIP */}

            <section
                className="
                    rounded-[22px]
                    border
                    border-cyan-200
                    bg-cyan-50/70
                    p-5

                    dark:border-cyan-400/20
                    dark:bg-cyan-400/[0.04]
                "
            >
                <div
                    className="
                        flex
                        items-center
                        gap-2
                        text-cyan-700

                        dark:text-cyan-300
                    "
                >
                    <Sparkles
                        size={15}
                        aria-hidden="true"
                    />

                    <span
                        className="
                            font-mono
                            text-[10px]
                            font-black
                            uppercase
                            tracking-wider
                        "
                    >
                        F.Society tip
                    </span>
                </div>

                <p
                    className="
                        mt-3
                        text-[11px]
                        font-medium
                        leading-6
                        text-slate-600

                        dark:text-gray-400
                    "
                >
                    Faqat kod emas, xatolik nimadan kelib
                    chiqqanini va yechim nima uchun ishlashini
                    ham tushuntiring.
                </p>
            </section>
        </div>
    );
};

export default memo(ProblemSolutionProgress);
