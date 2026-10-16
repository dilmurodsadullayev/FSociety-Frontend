
import React, { memo } from "react";
import { FileText, Type } from "lucide-react";

export const PROBLEM_INPUT_CLASS = `
    w-full rounded-2xl border border-slate-200
    bg-slate-50 px-4 py-3.5
    text-sm font-medium text-slate-900
    outline-none transition-colors
    placeholder:text-slate-400
    focus:border-cyan-400 focus:bg-white
    focus:ring-4 focus:ring-cyan-500/10
    disabled:cursor-not-allowed disabled:opacity-50
    dark:border-white/10 dark:bg-[#090f1b]
    dark:text-gray-100 dark:placeholder:text-gray-500
    dark:focus:border-cyan-400/40
    dark:focus:bg-[#0c1422]
`;

const LABEL_CLASS = `
    mb-2 flex items-center gap-2
    text-xs font-black uppercase tracking-wide
    text-slate-700 dark:text-gray-300
`;

const ProblemCreateFields = ({
    problemTitle = "",
    description = "",
    disabled = false,
    onChange,
}) => (
    <div className="space-y-6">
        <section>
            <label htmlFor="problemTitle" className={LABEL_CLASS}>
                <Type size={16} aria-hidden="true"
                    className="text-cyan-600 dark:text-cyan-400" />
                Muammo sarlavhasi
                <span className="text-rose-600">*</span>
            </label>

            <input
                id="problemTitle"
                name="problemTitle"
                type="text"
                required
                value={problemTitle}
                disabled={disabled}
                onChange={(event) =>
                    onChange("problemTitle", event.target.value)
                }
                placeholder="Masalan: Django JWT refresh token cookie orqali ishlamayapti"
                className={`${PROBLEM_INPUT_CLASS} min-h-12`}
            />
        </section>

        <section>
            <label htmlFor="description" className={LABEL_CLASS}>
                <FileText size={16} aria-hidden="true"
                    className="text-indigo-600 dark:text-indigo-400" />
                Muammo tavsifi
                <span className="text-rose-600">*</span>
            </label>

            <textarea
                id="description"
                name="description"
                rows={7}
                required
                value={description}
                disabled={disabled}
                onChange={(event) =>
                    onChange("description", event.target.value)
                }
                placeholder="Muammo qachon chiqyapti, qanday error beryapti, nimalarni sinab ko‘rdingiz..."
                className={`
                    ${PROBLEM_INPUT_CLASS}
                    min-h-[180px] resize-y leading-7
                `}
            />

            <p className="
                mt-2 text-xs leading-5
                text-slate-500 dark:text-gray-400
            ">
                Xato xabarini va vaziyatni tushuntiring.
                Kod fragmentini pastdagi maxsus editorga yozing.
            </p>
        </section>
    </div>
);

export default memo(ProblemCreateFields);
