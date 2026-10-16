
import React, { memo, useCallback, useMemo } from "react";
import Editor from "react-simple-code-editor";

import {
    Code2,
    Terminal,
} from "lucide-react";

import {
    highlightProblemCode,
} from "./problemCreatePrism";

import {
    sameId,
    safeTagColor,
} from "./problemCreateHelpers";

const ProblemCreateCodeEditor = ({
    codeSnippet = "",
    codeLanguageId = "",
    languageOptions = [],
    selectedLanguages = [],
    selectedCodeLanguage = null,
    editorLanguage = "clike",
    disabled = false,
    onChange,
    onLanguageChange,
}) => {
    const highlightCode = useCallback(
        (value) => highlightProblemCode(value, editorLanguage),
        [editorLanguage]
    );

    const options = useMemo(() => {
        const items = [...languageOptions];

        for (const language of selectedLanguages) {
            if (!items.some((item) =>
                sameId(item.id, language.id)
            )) {
                items.push(language);
            }
        }

        return items;
    }, [languageOptions, selectedLanguages]);

    return (
        <section className="min-w-0">
            <div className="
                mb-3 flex flex-wrap items-center
                justify-between gap-3
            ">
                <label htmlFor="codeSnippet" className="
                    flex items-center gap-2
                    text-xs font-black uppercase tracking-wide
                    text-slate-700 dark:text-gray-300
                ">
                    <Code2 size={16} aria-hidden="true"
                        className="text-indigo-600 dark:text-indigo-400" />
                    Kod fragmenti
                    <span className="
                        rounded-full bg-slate-100 px-2 py-1
                        text-[9px] text-slate-500
                        dark:bg-white/[0.06] dark:text-gray-400
                    ">
                        Ixtiyoriy
                    </span>
                </label>

                {codeSnippet.trim() && !codeLanguageId && (
                    <span className="
                        text-xs font-bold
                        text-amber-700 dark:text-amber-300
                    ">
                        Kod tili tanlanishi kerak
                    </span>
                )}
            </div>

            <div className="
                min-w-0 overflow-hidden rounded-2xl
                border border-slate-300 bg-[#0b1020]
                shadow-[0_12px_35px_rgba(15,23,42,0.12)]
                focus-within:border-cyan-400
                focus-within:ring-4 focus-within:ring-cyan-500/10
                dark:border-white/10
            ">
                <div className="
                    flex flex-col gap-3
                    border-b border-white/10
                    bg-white/[0.035] px-4 py-3
                    sm:flex-row sm:items-center sm:justify-between
                ">
                    <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                        <Terminal size={14}
                            className="ml-2 text-gray-400"
                            aria-hidden="true" />
                        <span className="
                            font-mono text-[10px] font-bold
                            text-gray-400
                        ">
                            code.editor
                        </span>
                    </div>

                    <div className="
                        flex min-w-0 flex-wrap items-center gap-2
                    ">
                        <label htmlFor="codeLanguage" className="
                            font-mono text-[10px] font-bold
                            uppercase text-gray-400
                        ">
                            Kod tili
                        </label>

                        <select
                            id="codeLanguage"
                            value={codeLanguageId}
                            disabled={disabled}
                            onChange={(event) =>
                                onLanguageChange(event.target.value)
                            }
                            className="
                                min-h-9 min-w-[140px] max-w-full
                                rounded-xl border border-white/15
                                bg-[#080d18] px-3 py-2
                                text-xs font-bold text-gray-200
                                outline-none
                                focus:border-cyan-400/50
                                disabled:opacity-50
                            "
                        >
                            <option value="">Tilni tanlang</option>

                            {options.map((language) => (
                                <option
                                    key={language.id}
                                    value={language.id}
                                >
                                    {language.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {selectedCodeLanguage && (
                    <div className="
                        flex flex-wrap items-center justify-between
                        gap-2 border-b border-white/[0.07]
                        bg-black/10 px-4 py-2
                    ">
                        <span className="
                            flex items-center gap-2
                            text-[11px] text-gray-400
                        ">
                            <span
                                aria-hidden="true"
                                className="h-2 w-2 rounded-full"
                                style={{
                                    backgroundColor: safeTagColor(
                                        selectedCodeLanguage.color
                                    ),
                                }}
                            />
                            Syntax:
                            <strong className="text-gray-200">
                                {selectedCodeLanguage.name}
                            </strong>
                        </span>

                        <span className="
                            font-mono text-[10px]
                            uppercase text-gray-500
                        ">
                            {editorLanguage}
                        </span>
                    </div>
                )}

                <div className="
                    max-h-[480px] min-h-[260px]
                    overflow-auto [color-scheme:dark]
                ">
                    <Editor
                        value={codeSnippet}
                        onValueChange={(value) =>
                            onChange("codeSnippet", value)
                        }
                        highlight={highlightCode}
                        padding={18}
                        disabled={disabled}
                        textareaId="codeSnippet"
                        textareaClassName="focus:outline-none"
                        className="code-editor"
                        style={{
                            fontFamily:
                                '"Fira Code", "Fira Mono", "JetBrains Mono", monospace',
                            fontSize: 14,
                            lineHeight: 1.7,
                            minHeight: "260px",
                            backgroundColor: "#0b1020",
                            color: "#e2e8f0",
                            tabSize: 4,
                        }}
                    />
                </div>

                <div className="
                    flex flex-wrap items-center justify-between
                    gap-2 border-t border-white/10
                    px-4 py-2.5 font-mono text-[10px]
                    text-gray-400
                ">
                    <span>{editorLanguage}</span>
                    <span>{codeSnippet.length} chars</span>
                </div>
            </div>

            <p className="
                mt-2 text-xs leading-6
                text-slate-500 dark:text-gray-400
            ">
                Kod yozsangiz bitta dasturlash tilini tanlang.
                Tanlangan kod tili avtomatik ravishda
                muammo taglariga ham qo‘shiladi.
            </p>
        </section>
    );
};

export default memo(ProblemCreateCodeEditor);
