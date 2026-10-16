
import React, { memo } from "react";
import {
    FilePlus2,
    Pencil,
    Terminal,
} from "lucide-react";

const ProblemCreateHeader = ({
    isEdit = false,
    originalTitle = "",
}) => (
    <header className="mb-8">
        <div className="
            mb-4 inline-flex items-center gap-2
            rounded-full border border-cyan-200
            bg-cyan-50 px-4 py-2
            font-mono text-[10px] font-black
            uppercase tracking-[0.15em]
            text-cyan-800
            dark:border-cyan-400/20
            dark:bg-cyan-400/[0.08]
            dark:text-cyan-300
        ">
            <Terminal size={14} aria-hidden="true" />
            fsociety://problem/{isEdit ? "edit" : "create"}
        </div>

        <div className="
            flex flex-col justify-between gap-5
            lg:flex-row lg:items-end
        ">
            <div className="min-w-0">
                <h1 className="
                    flex flex-wrap items-center gap-3
                    text-3xl font-black tracking-tight
                    text-slate-900 sm:text-4xl
                    dark:text-white
                ">
                    {isEdit ? (
                        <Pencil
                            size={30}
                            className="text-indigo-600 dark:text-indigo-400"
                            aria-hidden="true"
                        />
                    ) : (
                        <FilePlus2
                            size={30}
                            className="text-cyan-600 dark:text-cyan-400"
                            aria-hidden="true"
                        />
                    )}

                    {isEdit
                        ? "Muammoni tahrirlash"
                        : "Yangi muammo yaratish"}
                </h1>

                <p className="
                    mt-4 max-w-2xl text-sm leading-7
                    text-slate-600 dark:text-gray-400
                ">
                    {isEdit ? (
                        <>
                            <strong className="
                                break-words text-indigo-700
                                dark:text-cyan-300
                            ">
                                {originalTitle || "Tanlangan muammo"}
                            </strong>{" "}
                            ma’lumotlarini yangilang va aniqroq
                            tushuntirish kiriting.
                        </>
                    ) : (
                        <>
                            Dasturlashdagi xatolikni aniq yozing,
                            kerakli kodni joylang va FSociety
                            hamjamiyatidan yechim oling.
                        </>
                    )}
                </p>
            </div>

            <div className="
                shrink-0 self-start rounded-2xl
                border border-slate-200 bg-white/80
                px-5 py-3
                dark:border-white/10 dark:bg-white/[0.04]
            ">
                <p className="
                    font-mono text-[10px] uppercase
                    tracking-wider text-slate-500
                    dark:text-gray-400
                ">
                    Status
                </p>
                <p className="
                    mt-1 text-sm font-black
                    text-emerald-700 dark:text-emerald-300
                ">
                    {isEdit ? "Edit mode" : "Create mode"}
                </p>
            </div>
        </div>
    </header>
);

export default memo(ProblemCreateHeader);
