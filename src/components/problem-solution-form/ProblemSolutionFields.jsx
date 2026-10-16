
import React, { memo } from "react";

import {
    FileText,
    Lightbulb,
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
    dark:text-gray-200
    dark:placeholder:text-gray-600

    dark:focus:border-cyan-400/30
    dark:focus:bg-[#101827]
`;

// =========================================================
// SHORT SOLUTION
// =========================================================

const ShortSolutionField = memo(({
    value,
    disabled,
    onChange,
}) => (
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
                htmlFor="solution-form-short-info"
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

                Qisqa yechim

                <span className="text-rose-600 dark:text-rose-400">
                    *
                </span>
            </label>

            <span
                className={`
                    font-mono
                    text-[10px]
                    font-bold
                    tabular-nums

                    ${
                        value.length > 230
                            ? "text-amber-700 dark:text-amber-300"
                            : "text-slate-500 dark:text-gray-400"
                    }
                `}
            >
                {value.length}/255
            </span>
        </div>

        <input
            id="solution-form-short-info"
            type="text"
            value={value}
            maxLength={255}
            disabled={disabled}
            autoComplete="off"
            aria-required="true"
            placeholder="Masalan: JWT tokenni HttpOnly cookie orqali yuboring"
            onChange={(event) =>
                onChange("shortInfo", event.target.value)
            }
            className={`min-h-[52px] ${INPUT_CLASS}`}
        />

        <p
            className="
                mt-2
                text-[11px]
                font-medium
                leading-5
                text-slate-500

                dark:text-gray-400
            "
        >
            Asosiy yechimni qisqa va tushunarli jumlada yozing.
        </p>
    </section>
));

// =========================================================
// DESCRIPTION
// =========================================================

const SolutionDescriptionField = memo(({
    value,
    disabled,
    onChange,
}) => (
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
                htmlFor="solution-form-description"
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
                <Lightbulb
                    size={15}
                    aria-hidden="true"
                    className="text-amber-600 dark:text-amber-400"
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
                {value.length} belgi
            </span>
        </div>

        <textarea
            id="solution-form-description"
            rows={7}
            value={value}
            disabled={disabled}
            aria-required="true"
            placeholder="Muammo nimadan kelib chiqqanini va uni qanday tuzatganingizni bosqichma-bosqich tushuntiring..."
            onChange={(event) =>
                onChange("description", event.target.value)
            }
            className={`
                ${INPUT_CLASS}

                min-h-[175px]
                resize-y
                leading-7
            `}
        />
    </section>
));

// =========================================================
// FIELDS GROUP
// =========================================================

const ProblemSolutionFields = ({
    shortInfo = "",
    description = "",
    disabled = false,
    onChange,
}) => (
    <div className="space-y-6">
        <ShortSolutionField
            value={shortInfo}
            disabled={disabled}
            onChange={onChange}
        />

        <SolutionDescriptionField
            value={description}
            disabled={disabled}
            onChange={onChange}
        />
    </div>
);

export default memo(ProblemSolutionFields);
