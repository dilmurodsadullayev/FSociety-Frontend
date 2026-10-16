
import React, {
    memo,
    useCallback,
} from "react";

import Editor from "react-simple-code-editor";

import {
    CheckCircle2,
    Code2,
    Terminal,
} from "lucide-react";

import {
    highlightSolutionUpdateCode,
} from "./solutionUpdatePrism";

// =========================================================
// FSOCIETY — SOLUTION UPDATE EDITOR
// =========================================================

const ProblemSolutionUpdateEditor = ({
    code = "",
    languageName = "JavaScript",
    prismLanguageName = "javascript",
    disabled = false,
    onChange,
}) => {
    const highlightCode = useCallback(
        (value) =>
            highlightSolutionUpdateCode(
                value,
                prismLanguageName
            ),
        [prismLanguageName]
    );

    const handleChange = useCallback(
        (value) => {
            if (!disabled) {
                onChange?.("code", value);
            }
        },
        [disabled, onChange]
    );

    return (
        <section className="space-y-3">
            {/* HEADER */}

            <div
                className="
                    flex
                    flex-wrap
                    items-center
                    justify-between
                    gap-3
                "
            >
                <div
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
                    <Terminal
                        size={16}
                        aria-hidden="true"
                        className="text-emerald-600 dark:text-emerald-400"
                    />

                    Yechim kodi

                    <span
                        className="
                            text-[10px]
                            font-medium
                            text-slate-500

                            dark:text-gray-400
                        "
                    >
                        ixtiyoriy
                    </span>
                </div>

                <span
                    className="
                        inline-flex
                        min-w-0
                        items-center
                        gap-1.5
                        rounded-full
                        border
                        border-emerald-200
                        bg-emerald-50
                        px-3
                        py-1.5
                        text-[10px]
                        font-bold
                        text-emerald-800

                        dark:border-emerald-400/20
                        dark:bg-emerald-400/[0.09]
                        dark:text-emerald-300
                    "
                >
                    <Code2
                        size={12}
                        aria-hidden="true"
                        className="shrink-0"
                    />

                    <span className="truncate">
                        {languageName}
                    </span>
                </span>
            </div>

            {/* CODE EDITOR */}

            <div
                className="
                    overflow-hidden
                    rounded-[22px]
                    border
                    border-slate-300
                    bg-[#080e19]
                    shadow-[0_12px_35px_rgba(15,23,42,0.10)]

                    focus-within:border-cyan-500
                    focus-within:ring-4
                    focus-within:ring-cyan-500/[0.08]

                    dark:border-white/[0.12]
                    dark:bg-[#05080d]
                "
            >
                {/* TERMINAL BAR */}

                <div
                    className="
                        flex
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

                    <span
                        className="
                            font-mono
                            text-[10px]
                            font-bold
                            tracking-wider
                            text-gray-400
                        "
                    >
                        solution.editor
                    </span>
                </div>

                {/* EDITOR BODY */}

                <div
                    aria-label="Yechim kodi muharriri"
                    className="
                        max-h-[480px]
                        min-h-[250px]
                        overflow-auto
                        overscroll-contain

                        [color-scheme:dark]
                    "
                >
                    <Editor
                        value={code}
                        onValueChange={handleChange}
                        highlight={highlightCode}
                        padding={18}
                        disabled={disabled}
                        textareaId="solution-update-code"
                        textareaClassName="focus:outline-none"
                        style={{
                            fontFamily:
                                '"Fira Code", "Fira Mono", "JetBrains Mono", Consolas, monos',
                            fontSize: 13,
                            lineHeight: 1.8,
                            minHeight: "250px",
                            backgroundColor: "transparent",
                            color: "#e5e7eb",
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
                        px-4
                        py-2.5
                    "
                >
                    <span
                        className="
                            font-mono
                            text-[10px]
                            font-bold
                            text-indigo-300
                        "
                    >
                        {prismLanguageName}
                    </span>

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

            {/* INFORMATION */}

            <div
                className="
                    flex
                    items-start
                    gap-3
                    rounded-2xl
                    border
                    border-cyan-200
                    bg-cyan-50/80
                    p-4

                    dark:border-cyan-400/20
                    dark:bg-cyan-400/[0.06]
                "
            >
                <CheckCircle2
                    size={17}
                    aria-hidden="true"
                    className="
                        mt-0.5
                        shrink-0
                        text-cyan-700

                        dark:text-cyan-300
                    "
                />

                <p
                    className="
                        text-xs
                        leading-6
                        text-cyan-900

                        dark:text-cyan-100/85
                    "
                >
                    Yangilash mavjud yechimni almashtiradi.
                    Muammo sahifasiga qaytgandan so‘ng
                    yangi ma’lumotlar ko‘rinadi.
                </p>
            </div>
        </section>
    );
};

export default memo(ProblemSolutionUpdateEditor);
