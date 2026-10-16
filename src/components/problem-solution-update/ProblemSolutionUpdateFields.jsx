
import React, { memo } from "react";

import {
    AlertCircle,
    FileText,
} from "lucide-react";

const INPUT_CLASS = `
    w-full
    rounded-2xl
    border
    border-slate-200
    bg-slate-50
    px-4
    py-3.5
    text-sm
    font-medium
    text-slate-900
    outline-none
    transition-colors

    placeholder:text-slate-400

    focus:border-cyan-400
    focus:bg-white
    focus:ring-4
    focus:ring-cyan-500/[0.07]

    disabled:cursor-not-allowed
    disabled:opacity-50

    dark:border-white/[0.10]
    dark:bg-[#090f1b]
    dark:text-white
    dark:placeholder:text-gray-600

    dark:focus:border-cyan-400/30
    dark:focus:bg-[#0c1422]
`;

const ProblemSolutionUpdateFields = ({
    answer = "",
    description = "",
    error = "",
    disabled = false,
    onChange,
}) => (
    <div className="space-y-6">
        {/* FORM ERROR */}

        {error && (
            <div
                role="alert"
                className="
                    flex
                    items-start
                    gap-3
                    rounded-2xl
                    border
                    border-rose-200
                    bg-rose-50
                    p-4

                    dark:border-rose-400/20
                    dark:bg-rose-400/[0.06]
                "
            >
                <AlertCircle
                    size={18}
                    aria-hidden="true"
                    className="
                        mt-0.5
                        shrink-0
                        text-rose-700
                        dark:text-rose-300
                    "
                />

                <div className="min-w-0">
                    <p
                        className="
                            text-xs
                            font-black
                            text-rose-800

                            dark:text-rose-200
                        "
                    >
                        Ma’lumotlarni tekshiring
                    </p>

                    <p
                        className="
                            mt-1
                            break-words
                            text-xs
                            leading-5
                            text-rose-700

                            dark:text-rose-200/80
                        "
                    >
                        {error}
                    </p>
                </div>
            </div>
        )}

        {/* SHORT ANSWER */}

        <section>
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
                    htmlFor="solution-update-answer"
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
                    <FileText
                        size={15}
                        aria-hidden="true"
                        className="text-cyan-600 dark:text-cyan-400"
                    />

                    Qisqa ma’lumot

                    <span className="text-rose-600 dark:text-rose-400">
                        *
                    </span>
                </label>

                <span
                    className={`
                        font-mono
                        text-[10px]
                        font-bold

                        ${
                            answer.length > 255
                                ? "text-rose-600 dark:text-rose-400"
                                : "text-slate-500 dark:text-gray-400"
                        }
                    `}
                >
                    {answer.length}/255
                </span>
            </div>

            <input
                id="solution-update-answer"
                type="text"
                value={answer}
                disabled={disabled}
                autoComplete="off"
                aria-required="true"
                aria-invalid={answer.trim().length > 255}
                placeholder="Masalan: API so‘rovini async/await orqali tuzatish"
                onChange={(event) =>
                    onChange?.("answer", event.target.value)
                }
                className={`min-h-[52px] ${INPUT_CLASS}`}
            />

            <p
                className="
                    mt-2
                    text-[11px]
                    text-slate-500

                    dark:text-gray-400
                "
            >
                5–255 belgi oralig‘ida qisqa va tushunarli
                yechim yozing.
            </p>
        </section>

        {/* DESCRIPTION */}

        <section>
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
                    htmlFor="solution-update-description"
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
                    <FileText
                        size={15}
                        aria-hidden="true"
                        className="text-indigo-600 dark:text-indigo-400"
                    />

                    Batafsil tushuntirish

                    <span className="text-rose-600 dark:text-rose-400">
                        *
                    </span>
                </label>

                <span
                    className="
                        font-mono
                        text-[10px]
                        font-bold
                        text-slate-500

                        dark:text-gray-400
                    "
                >
                    {description.length} belgi
                </span>
            </div>

            <textarea
                id="solution-update-description"
                rows={7}
                value={description}
                disabled={disabled}
                aria-required="true"
                placeholder="Muammo nimadan kelib chiqqani va yechim qanday ishlashini tushuntiring..."
                onChange={(event) =>
                    onChange?.("description", event.target.value)
                }
                className={`${INPUT_CLASS} resize-y leading-7`}
            />
        </section>
    </div>
);

export default memo(ProblemSolutionUpdateFields);
