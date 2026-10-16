
import React, { memo } from "react";

import {
    ArrowLeft,
    Loader2,
    Save,
    Send,
    Trash2,
} from "lucide-react";

const ProblemCreateActions = ({
    isEdit = false,
    isSubmitting = false,
    isDeleting = false,
    onCancel,
    onDelete,
}) => {
    const disabled = isSubmitting || isDeleting;

    return (
        <footer className="
            flex flex-col-reverse gap-3
            border-t border-slate-200 pt-6
            sm:flex-row sm:flex-wrap sm:items-center
            sm:justify-end
            dark:border-white/10
        ">
            {isEdit && (
                <button
                    type="button"
                    disabled={disabled}
                    onClick={onDelete}
                    className="
                        inline-flex min-h-11 items-center
                        justify-center gap-2 rounded-xl
                        border border-rose-200
                        bg-rose-50 px-5 py-3
                        text-xs font-black text-rose-700
                        hover:bg-rose-100
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                        sm:mr-auto
                        dark:border-rose-400/20
                        dark:bg-rose-400/[0.08]
                        dark:text-rose-300
                    "
                >
                    <Trash2 size={16} aria-hidden="true" />
                    O‘chirish
                </button>
            )}

            <button
                type="button"
                onClick={onCancel}
                disabled={disabled}
                className="
                    inline-flex min-h-11 items-center
                    justify-center gap-2 rounded-xl
                    border border-slate-200
                    bg-slate-50 px-5 py-3
                    text-xs font-black text-slate-700
                    hover:bg-slate-100
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    dark:border-white/10
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
                aria-busy={isSubmitting}
                className="
                    inline-flex min-h-11 items-center
                    justify-center gap-2 rounded-xl
                    bg-gradient-to-r from-cyan-600
                    to-indigo-600 px-6 py-3
                    text-xs font-black text-white
                    shadow-lg shadow-cyan-500/15
                    transition-colors
                    hover:from-cyan-500 hover:to-indigo-500
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                "
            >
                {isSubmitting ? (
                    <Loader2
                        size={16}
                        aria-hidden="true"
                        className="
                            animate-spin
                            motion-reduce:animate-none
                        "
                    />
                ) : isEdit ? (
                    <Save size={16} aria-hidden="true" />
                ) : (
                    <Send size={16} aria-hidden="true" />
                )}

                {isSubmitting
                    ? "Saqlanmoqda..."
                    : isEdit
                        ? "Yangilash"
                        : "Muammo qo‘shish"}
            </button>
        </footer>
    );
};

export default memo(ProblemCreateActions);
