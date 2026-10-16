
import React, {
    memo,
    useCallback,
} from "react";

import Editor from "react-simple-code-editor";

import {
    Code2,
    Eraser,
    Terminal,
} from "lucide-react";

// Reuse the Prism instance already configured
// for the solution update page.
import {
    highlightSolutionUpdateCode,
} from "../problem-solution-update/solutionUpdatePrism";

// =========================================================
// FSOCIETY — SOLUTION CODE EDITOR
//
// Existing react-simple-code-editor integration.
//
// - Syntax highlighting
// - Selected language
// - Editor file name
// - Code clear action
// - Character count
// - Scrollable editor
// =========================================================

const ProblemSolutionEditor = ({
    code = "",
    selectedLanguage = null,
    editorLanguage = "javascript",
    editorFileName = "solution.js",
    isSubmitting = false,
    onChange,
    onClear,
}) => {
    const highlightCode = useCallback(
        (value) =>
            highlightSolutionUpdateCode(
                value,
                editorLanguage
            ),
        [editorLanguage]
    );

    const handleChange = useCallback(
        (value) => {
            if (!isSubmitting) {
                onChange("code", value);
            }
        },
        [isSubmitting, onChange]
    );

    const hasCode = Boolean(code.trim());

    return (
        <section className="min-w-0">
            {/* EDITOR HEADER */}

            <div
                className="
                    mb-3
                    flex
                    flex-wrap
                    items-start
                    justify-between
                    gap-3
                "
            >
                <div className="min-w-0">
                    <label
                        htmlFor="problem-solution-code"
                        className="
                            inline-flex
                            flex-wrap
                            items-center
                            gap-2
                            text-xs
                            font-black
                            text-slate-700

                            dark:text-gray-300
                        "
                    >
                        <Code2
                            size={15}
                            aria-hidden="true"
                            className="
                                text-indigo-600
                                dark:text-indigo-400
                            "
                        />

                        Kod namunasi

                        <span
                            className="
                                rounded-full
                                border
                                border-indigo-200
                                bg-indigo-50
                                px-2
                                py-0.5
                                text-[9px]
                                font-bold
                                text-indigo-700

                                dark:border-indigo-400/20
                                dark:bg-indigo-400/[0.08]
                                dark:text-indigo-300
                            "
                        >
                            Ixtiyoriy
                        </span>

                        {selectedLanguage && (
                            <span
                                className="
                                    rounded-full
                                    border
                                    border-emerald-200
                                    bg-emerald-50
                                    px-2
                                    py-0.5
                                    text-[9px]
                                    font-bold
                                    text-emerald-700

                                    dark:border-emerald-400/20
                                    dark:bg-emerald-400/[0.08]
                                    dark:text-emerald-300
                                "
                            >
                                {selectedLanguage.name}
                            </span>
                        )}
                    </label>

                    <p
                        className="
                            mt-2
                            text-[11px]
                            leading-5
                            text-slate-500

                            dark:text-gray-400
                        "
                    >
                        Tanlangan tilga qarab syntax
                        highlighting o‘zgaradi.
                    </p>
                </div>

                {/* CLEAR CODE */}

                {hasCode && (
                    <button
                        type="button"
                        onClick={onClear}
                        disabled={isSubmitting}
                        className="
                            inline-flex
                            min-h-9
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-50
                            px-3
                            text-[11px]
                            font-bold
                            text-slate-600

                            hover:border-rose-300
                            hover:bg-rose-50
                            hover:text-rose-700

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-rose-500

                            disabled:cursor-not-allowed
                            disabled:opacity-50

                            dark:border-white/[0.10]
                            dark:bg-white/[0.04]
                            dark:text-gray-400
                            dark:hover:border-rose-400/25
                            dark:hover:text-rose-300
                        "
                    >
                        <Eraser
                            size={14}
                            aria-hidden="true"
                        />

                        Tozalash
                    </button>
                )}
            </div>

            {/* EDITOR SHELL */}

            <div
                className="
                    min-w-0
                    overflow-hidden
                    rounded-[22px]
                    border
                    border-slate-300
                    bg-[#070b12]

                    shadow-[0_12px_35px_rgba(15,23,42,0.10)]

                    focus-within:border-indigo-400
                    focus-within:ring-4
                    focus-within:ring-indigo-500/[0.08]

                    dark:border-white/[0.12]
                    dark:bg-[#070b12]
                "
            >
                {/* TERMINAL BAR */}

                <div
                    className="
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-3

                        border-b
                        border-white/[0.08]

                        bg-white/[0.035]

                        px-4
                        py-3
                    "
                >
                    <div
                        aria-hidden="true"
                        className="flex items-center gap-1.5"
                    >
                        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </div>

                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-2
                        "
                    >
                        <Terminal
                            size={14}
                            aria-hidden="true"
                            className="shrink-0 text-indigo-300"
                        />

                        <span
                            className="
                                truncate
                                font-mono
                                text-[10px]
                                font-bold
                                text-gray-300
                            "
                        >
                            {editorFileName}
                        </span>
                    </div>
                </div>

                {/* CODE EDITOR */}

                <div
                    className={`
                        relative
                        max-h-[430px]
                        min-h-[260px]
                        overflow-auto
                        overscroll-contain
                        [color-scheme:dark]

                        ${
                            isSubmitting
                                ? "pointer-events-none opacity-60"
                                : ""
                        }
                    `}
                >
                    <Editor
                        value={code}
                        onValueChange={handleChange}
                        highlight={highlightCode}
                        padding={18}
                        textareaId="problem-solution-code"
                        textareaClassName="focus:outline-none"
                        style={{
                            fontFamily:
                                '"Fira Code", "Fira Mono", Consolas, monospace',
                            fontSize: 14,
                            lineHeight: 1.7,
                            minHeight: "260px",
                            backgroundColor: "#070b12",
                            color: "#d4d4d4",
                            tabSize: 4,
                        }}
                    />
                </div>

                {/* EDITOR FOOTER */}

                <div
                    className="
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-3

                        border-t
                        border-white/[0.08]

                        bg-black/15

                        px-4
                        py-2.5
                    "
                >
                    <div
                        className="
                            flex
                            min-w-0
                            flex-wrap
                            items-center
                            gap-2
                        "
                    >
                        <Code2
                            size={13}
                            aria-hidden="true"
                            className="text-indigo-400"
                        />

                        <span
                            className="
                                font-mono
                                text-[10px]
                                font-bold
                                text-gray-400
                            "
                        >
                            {selectedLanguage?.name ||
                                "Til tanlanmagan"}
                        </span>

                        <span
                            aria-hidden="true"
                            className="text-gray-600"
                        >
                            /
                        </span>

                        <span
                            className="
                                font-mono
                                text-[10px]
                                font-bold
                                text-indigo-300
                            "
                        >
                            {editorLanguage}
                        </span>
                    </div>

                    <span
                        className="
                            font-mono
                            text-[10px]
                            text-gray-400
                        "
                    >
                        {code.length} chars
                    </span>
                </div>
            </div>
        </section>
    );
};

export default memo(ProblemSolutionEditor);
