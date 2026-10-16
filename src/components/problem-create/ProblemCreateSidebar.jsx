
import React, { memo } from "react";

import {
    Check,
    CheckCircle2,
    Circle,
    Code2,
    Coins,
    Lightbulb,
    Sparkles,
} from "lucide-react";

const CheckItem = ({ ready, children }) => (
    <div className="flex items-start gap-2.5">
        {ready ? (
            <CheckCircle2
                size={16}
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
            />
        ) : (
            <Circle
                size={16}
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-slate-400"
            />
        )}

        <span className="
            text-xs leading-6 text-slate-600
            dark:text-gray-300
        ">
            {children}
        </span>
    </div>
);

const INFO_CLASS = `
    rounded-[22px] border p-5
    shadow-sm shadow-slate-950/[0.02]
`;

const ProblemCreateSidebar = ({ form, isEdit = false }) => {
    const titleReady = Boolean(form.problemTitle.trim());
    const descriptionReady = Boolean(form.description.trim());
    const languagesReady = form.selectedLanguages.length > 0;

    const codeReady =
        !form.codeSnippet.trim() ||
        form.selectedLanguages.some(
            (item) =>
                String(item.id) === String(form.codeLanguageId)
        );

    const priorityReady =
        !form.isUrgent ||
        (
            Boolean(form.deadline) &&
            Number.isSafeInteger(Number(form.offeredCoins)) &&
            Number(form.offeredCoins) > 0
        );

    const items = [
        titleReady,
        descriptionReady,
        languagesReady,
        codeReady,
        priorityReady,
    ];

    const progress = Math.round(
        items.filter(Boolean).length / items.length * 100
    );

    return (
        <aside className="
            min-w-0 border-t border-slate-200
            bg-slate-50/70 p-4
            sm:p-6
            lg:border-l lg:border-t-0
            dark:border-white/10
            dark:bg-[#080d18]/80
        ">
            <div className="space-y-5 lg:sticky lg:top-24">
                {/* GOOD PROBLEM */}

                <section className={`
                    ${INFO_CLASS}
                    border-cyan-200 bg-cyan-50/70
                    dark:border-cyan-400/20
                    dark:bg-cyan-400/[0.055]
                `}>
                    <span className="
                        mb-4 grid h-11 w-11
                        place-items-center rounded-2xl
                        bg-cyan-100 text-cyan-700
                        dark:bg-cyan-400/10
                        dark:text-cyan-300
                    ">
                        <Lightbulb size={21} aria-hidden="true" />
                    </span>

                    <h3 className="
                        text-base font-black text-slate-900
                        dark:text-white
                    ">
                        Yaxshi muammo qanday yoziladi?
                    </h3>

                    <p className="
                        mt-2 text-xs leading-6
                        text-slate-600 dark:text-gray-400
                    ">
                        Sarlavha qisqa, tavsif aniq, kod
                        fragmenti esa muammoni qayta
                        tekshirishga yetarli bo‘lishi kerak.
                    </p>
                </section>

                {/* EDITOR LANGUAGE */}

                <section className={`
                    ${INFO_CLASS}
                    border-indigo-200 bg-indigo-50/70
                    dark:border-indigo-400/20
                    dark:bg-indigo-400/[0.055]
                `}>
                    <h3 className="
                        flex items-center gap-2 text-sm
                        font-black text-indigo-800
                        dark:text-indigo-300
                    ">
                        <Code2 size={17} aria-hidden="true" />
                        Kod tili va tag farqi
                    </h3>

                    <p className="
                        mt-3 text-xs leading-6
                        text-slate-600 dark:text-gray-400
                    ">
                        <strong className="text-slate-900 dark:text-white">
                            Kod tili
                        </strong>{" "}
                        — editor ichidagi kodning bitta asosiy tili.
                    </p>

                    <p className="
                        mt-2 text-xs leading-6
                        text-slate-600 dark:text-gray-400
                    ">
                        <strong className="text-slate-900 dark:text-white">
                            Taglar
                        </strong>{" "}
                        — muammoga aloqador barcha tillar va
                        texnologiyalar.
                    </p>
                </section>

                {/* CHECKLIST */}

                <section className={`
                    ${INFO_CLASS}
                    border-slate-200 bg-white
                    dark:border-white/10
                    dark:bg-white/[0.035]
                `}>
                    <div className="
                        flex items-center justify-between gap-3
                    ">
                        <h3 className="
                            font-mono text-[11px] font-black
                            uppercase tracking-wider
                            text-slate-600 dark:text-gray-300
                        ">
                            Checklist
                        </h3>

                        <span className="
                            font-mono text-xs font-black
                            text-cyan-700 dark:text-cyan-300
                        ">
                            {progress}%
                        </span>
                    </div>

                    <div
                        role="progressbar"
                        aria-label="Muammo formasining tayyorligi"
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        className="
                            mt-4 h-2 overflow-hidden
                            rounded-full bg-slate-200
                            dark:bg-white/10
                        "
                    >
                        <div
                            className="
                                h-full rounded-full
                                bg-gradient-to-r
                                from-cyan-500 to-indigo-500
                                transition-[width] duration-300
                                motion-reduce:transition-none
                            "
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="mt-5 space-y-3">
                        <CheckItem ready={titleReady}>
                            Muammo sarlavhasi yozilgan.
                        </CheckItem>

                        <CheckItem ready={descriptionReady}>
                            Error va vaziyat tavsiflangan.
                        </CheckItem>

                        <CheckItem ready={languagesReady}>
                            Kamida bitta dasturlash tili tanlangan.
                        </CheckItem>

                        <CheckItem ready={codeReady}>
                            Kod bo‘lsa, uning tili tanlangan.
                        </CheckItem>

                        <CheckItem ready={priorityReady}>
                            Tezkor bo‘lsa, deadline va FCoin kiritilgan.
                        </CheckItem>
                    </div>

                    {progress === 100 && (
                        <p className="
                            mt-5 inline-flex items-center gap-2
                            rounded-xl bg-emerald-50 px-3 py-2
                            text-[11px] font-bold
                            text-emerald-700
                            dark:bg-emerald-400/10
                            dark:text-emerald-300
                        ">
                            <Check size={14} aria-hidden="true" />
                            Forma tayyor
                        </p>
                    )}
                </section>

                {/* URGENT INFORMATION */}

                <section className={`
                    ${INFO_CLASS}
                    border-amber-200 bg-amber-50/70
                    dark:border-amber-400/20
                    dark:bg-amber-400/[0.06]
                `}>
                    <h3 className="
                        flex items-center gap-2 text-sm
                        font-black text-amber-800
                        dark:text-amber-300
                    ">
                        <Coins size={17} aria-hidden="true" />
                        Tezkor muammo
                    </h3>

                    <p className="
                        mt-2 text-xs leading-6
                        text-slate-600 dark:text-gray-400
                    ">
                        Tezkor muammo e’tiborni jalb qiladi.
                        Yechim uchun FCoin mukofoti
                        taklif qilishingiz mumkin.
                    </p>
                </section>

                <p className="
                    flex items-center gap-2 px-1
                    font-mono text-[10px]
                    text-slate-500 dark:text-gray-500
                ">
                    <Sparkles size={13} aria-hidden="true" />
                    {isEdit
                        ? "FSociety / Problem editing"
                        : "FSociety / Problem creation"}
                </p>
            </div>
        </aside>
    );
};

export default memo(ProblemCreateSidebar);
