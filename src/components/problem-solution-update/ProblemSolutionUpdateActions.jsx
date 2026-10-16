
import React, { memo } from "react";

import {
    ArrowLeft,
    Loader2,
    Save,
    Trash2,
} from "lucide-react";

const ProblemSolutionUpdateActions = ({
    isUpdating = false,
    isDeleting = false,
    onDelete,
    onCancel,
}) => {
    const disabled = isUpdating || isDeleting;

    return (
        <footer
            className="
                mt-7
                flex
                flex-col-reverse
                gap-4
                border-t
                border-slate-200
                pt-6

                sm:flex-row
                sm:items-center
                sm:justify-between

                dark:border-white/[0.09]
            "
        >
            {/* DELETE */}

            <button
                type="button"
                onClick={onDelete}
                disabled={
                    disabled ||
                    typeof onDelete !== "function"
                }
                className="
                    inline-flex
                    min-h-12
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-rose-200
                    bg-rose-50
                    px-5
                    text-xs
                    font-black
                    text-rose-700

                    hover:bg-rose-100
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-rose-500

                    disabled:cursor-not-allowed
                    disabled:opacity-50

                    dark:border-rose-400/20
                    dark:bg-rose-400/[0.08]
                    dark:text-rose-300
                "
            >
                {isDeleting ? (
                    <Loader2
                        size={16}
                        aria-hidden="true"
                        className="animate-spin motion-reduce:animate-none"
                    />
                ) : (
                    <Trash2 size={16} aria-hidden="true" />
                )}

                {isDeleting
                    ? "O‘chirilmoqda..."
                    : "Yechimni o‘chirish"}
            </button>

            {/* CANCEL + SAVE */}

            <div className="grid gap-3 sm:flex sm:items-center">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={disabled}
                    className="
                        inline-flex
                        min-h-12
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        px-5
                        text-xs
                        font-black
                        text-slate-700

                        hover:bg-slate-100

                        disabled:cursor-not-allowed
                        disabled:opacity-50

                        dark:border-white/[0.10]
                        dark:bg-white/[0.04]
                        dark:text-gray-300
                    "
                >
                    <ArrowLeft size={16} aria-hidden="true" />
                    Bekor qilish
                </button>

                <button
                    type="submit"
                    disabled={disabled}
                    aria-busy={isUpdating}
                    className="
                        inline-flex
                        min-h-12
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-gradient-to-r
                        from-cyan-600
                        to-indigo-600
                        px-6
                        text-xs
                        font-black
                        text-white

                        hover:from-cyan-500
                        hover:to-indigo-500

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-cyan-500

                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    {isUpdating ? (
                        <Loader2
                            size={16}
                            aria-hidden="true"
                            className="animate-spin motion-reduce:animate-none"
                        />
                    ) : (
                        <Save size={16} aria-hidden="true" />
                    )}

                    {isUpdating
                        ? "Saqlanmoqda..."
                        : "O‘zgarishlarni saqlash"}
                </button>
            </div>
        </footer>
    );
};

export default memo(ProblemSolutionUpdateActions);
