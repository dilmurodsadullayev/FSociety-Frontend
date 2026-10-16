
import React, { memo } from "react";

import {
    CalendarClock,
    Coins,
    Flame,
} from "lucide-react";

import {
    getMinDeadline,
} from "./problemCreateHelpers";

import {
    PROBLEM_INPUT_CLASS,
} from "./ProblemCreateFields";

const ProblemCreatePriority = ({
    isUrgent = false,
    deadline = "",
    offeredCoins = "",
    originalDeadline = "",
    isEdit = false,
    disabled = false,
    onUrgentChange,
    onChange,
}) => {
    const minDeadline = getMinDeadline();

    // Preserve unchanged expired deadlines when editing
    // an older urgent problem.
    const oldDeadlineUnchanged =
        isEdit &&
        deadline &&
        deadline === originalDeadline &&
        new Date(deadline).getTime() < Date.now();

    return (
        <section className={`
            rounded-2xl border p-4 transition-colors
            sm:p-5

            ${isUrgent
                ? `
                    border-amber-300 bg-amber-50/70
                    dark:border-amber-400/25
                    dark:bg-amber-400/[0.07]
                `
                : `
                    border-slate-200 bg-slate-50/80
                    dark:border-white/10
                    dark:bg-white/[0.025]
                `
            }
        `}>
            <div className="flex items-start gap-3">
                <input
                    id="isUrgent"
                    type="checkbox"
                    checked={isUrgent}
                    disabled={disabled}
                    onChange={(event) =>
                        onUrgentChange(event.target.checked)
                    }
                    className="
                        mt-1 h-5 w-5 shrink-0 cursor-pointer
                        rounded border-slate-300
                        text-amber-600 focus:ring-amber-500
                        dark:border-white/20 dark:bg-[#090f1b]
                    "
                />

                <label htmlFor="isUrgent"
                    className="min-w-0 cursor-pointer">
                    <span className="
                        flex items-center gap-2
                        text-sm font-black text-slate-900
                        dark:text-white
                    ">
                        <Flame size={17}
                            className="text-amber-600 dark:text-amber-400"
                            aria-hidden="true" />
                        Tezkor muammo sifatida joylash
                    </span>

                    <span className="
                        mt-1 block text-xs leading-6
                        text-slate-600 dark:text-gray-400
                    ">
                        Belgilansa deadline va taklif qilinadigan
                        FCoin miqdori majburiy bo‘ladi.
                    </span>
                </label>
            </div>

            {isUrgent && (
                <div className="
                    mt-5 grid gap-5
                    sm:grid-cols-2
                ">
                    <div className="min-w-0">
                        <label htmlFor="deadline" className="
                            mb-2 flex items-center gap-2
                            text-xs font-bold
                            text-slate-700 dark:text-gray-300
                        ">
                            <CalendarClock size={15} aria-hidden="true" />
                            Deadline
                            <span className="text-rose-600">*</span>
                        </label>

                        <input
                            id="deadline"
                            type="datetime-local"
                            required
                            disabled={disabled}
                            value={deadline}
                            min={
                                oldDeadlineUnchanged
                                    ? undefined
                                    : minDeadline
                            }
                            onChange={(event) =>
                                onChange("deadline", event.target.value)
                            }
                            className={`
                                ${PROBLEM_INPUT_CLASS}
                                min-h-12
                                [color-scheme:light]
                                dark:[color-scheme:dark]
                            `}
                        />

                        {oldDeadlineUnchanged && (
                            <p className="
                                mt-2 text-[11px] leading-5
                                text-amber-800 dark:text-amber-300
                            ">
                                Avvalgi deadline o'tgan. Uni
                                o‘zgartirsangiz, yangi sana
                                kelajakda bo‘lishi kerak.
                            </p>
                        )}
                    </div>

                    <div className="min-w-0">
                        <label htmlFor="offeredCoins" className="
                            mb-2 flex items-center gap-2
                            text-xs font-bold
                            text-slate-700 dark:text-gray-300
                        ">
                            <Coins size={15} aria-hidden="true" />
                            Taklif etilayotgan FCoin
                            <span className="text-rose-600">*</span>
                        </label>

                        <input
                            id="offeredCoins"
                            type="number"
                            required
                            min="1"
                            step="1"
                            inputMode="numeric"
                            value={offeredCoins}
                            disabled={disabled}
                            placeholder="Masalan: 50"
                            onChange={(event) =>
                                onChange("offeredCoins", event.target.value)
                            }
                            className={`
                                ${PROBLEM_INPUT_CLASS}
                                min-h-12
                            `}
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export default memo(ProblemCreatePriority);
