
import React, { memo } from "react";

import {
    CheckCircle2,
    ImagePlus,
    Loader2,
    Save,
    X,
} from "lucide-react";

// ============================================================
// COVER IMAGE FOOTER
// ============================================================

const CoverImageFooter = memo(function CoverImageFooter({
    onClose,
    loading = false,
    hasChanges = false,
    disabled = false,
    formId,
    className = "",
}) {
    // ========================================================
    // BUTTON STATES
    // ========================================================

    const saveDisabled =
        loading || disabled || !hasChanges;

    const closeDisabled = loading;

    // ========================================================
    // CLOSE
    // ========================================================

    const handleClose = () => {
        if (closeDisabled) return;

        onClose?.();
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <footer
            className={`
                relative z-20
                min-w-0 shrink-0

                border-t border-slate-200/90
                bg-white/95

                px-4 py-3.5

                pb-[max(0.875rem,env(safe-area-inset-bottom))]

                backdrop-blur-xl

                sm:px-6 sm:py-4

                dark:border-white/[0.08]
                dark:bg-[#0b0f17]/95

                ${className}
            `}
        >
            {/* ==========================================
                MAIN ROW
            =========================================== */}

            <div
                className="
                    flex min-w-0
                    flex-col-reverse gap-3

                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
                {/* ======================================
                    DESKTOP STATUS
                ======================================= */}

                <div
                    role="status"
                    className="
                        hidden min-w-0
                        items-center gap-2

                        sm:flex
                    "
                >
                    {loading ? (
                        <>
                            <Loader2
                                size={15}
                                aria-hidden="true"
                                className="
                                    shrink-0
                                    text-indigo-600
                                    motion-safe:animate-spin

                                    dark:text-indigo-400
                                "
                            />

                            <span
                                className="
                                    text-xs font-medium
                                    text-slate-500

                                    dark:text-slate-400
                                "
                            >
                                Rasm yuklanmoqda...
                            </span>
                        </>
                    ) : hasChanges ? (
                        <>
                            <CheckCircle2
                                size={15}
                                aria-hidden="true"
                                className="
                                    shrink-0 text-emerald-600
                                    dark:text-emerald-400
                                "
                            />

                            <span
                                className="
                                    text-xs font-medium
                                    text-slate-600
                                    dark:text-slate-400
                                "
                            >
                                Yangi rasm tanlangan
                            </span>
                        </>
                    ) : (
                        <>
                            <ImagePlus
                                size={15}
                                aria-hidden="true"
                                className="
                                    shrink-0 text-slate-400
                                    dark:text-slate-500
                                "
                            />

                            <span
                                className="
                                    text-xs font-medium
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                Hozircha o‘zgarish yo‘q
                            </span>
                        </>
                    )}
                </div>

                {/* ======================================
                    ACTION BUTTONS
                ======================================= */}

                <div
                    className="
                        flex w-full min-w-0
                        flex-col-reverse gap-2.5

                        min-[380px]:flex-row
                        min-[380px]:items-center

                        sm:ml-auto
                        sm:w-auto
                    "
                >
                    {/* CANCEL */}

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={closeDisabled}
                        className="
                            inline-flex min-h-[44px]
                            w-full items-center
                            justify-center gap-2

                            rounded-xl
                            border border-slate-200
                            bg-slate-100/80

                            px-5 py-3

                            font-display
                            text-sm font-semibold
                            text-slate-700

                            transition-colors duration-200

                            hover:border-slate-300
                            hover:bg-slate-200/70

                            focus-visible:outline
                            focus-visible:outline-2
                            focus-visible:outline-offset-2
                            focus-visible:outline-indigo-500

                            disabled:cursor-not-allowed
                            disabled:opacity-50

                            min-[380px]:w-auto

                            dark:border-white/[0.09]
                            dark:bg-white/[0.045]
                            dark:text-slate-300

                            dark:hover:bg-white/[0.085]
                            dark:hover:text-white
                        "
                    >
                        <X
                            size={15}
                            aria-hidden="true"
                        />

                        Bekor qilish
                    </button>

                    {/* SAVE */}

                    <button
                        type="submit"
                        form={formId || undefined}
                        disabled={saveDisabled}
                        aria-busy={loading}
                        className="
                            group relative
                            inline-flex min-h-[44px]
                            w-full items-center
                            justify-center gap-2

                            overflow-hidden
                            rounded-xl

                            border border-indigo-500/20
                            bg-indigo-600
                            px-6 py-3

                            font-display
                            text-sm font-semibold
                            text-white

                            shadow-lg
                            shadow-indigo-500/15

                            transition-all duration-200

                            hover:bg-indigo-500
                            hover:shadow-indigo-500/25

                            active:scale-[0.98]

                            focus-visible:outline
                            focus-visible:outline-2
                            focus-visible:outline-offset-2
                            focus-visible:outline-indigo-500

                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            disabled:hover:bg-indigo-600

                            min-[380px]:w-auto
                            min-[380px]:min-w-[145px]

                            dark:bg-indigo-600
                            dark:hover:bg-indigo-500
                        "
                    >
                        {/* SUBTLE GLOW */}

                        <span
                            aria-hidden="true"
                            className="
                                pointer-events-none
                                absolute inset-0

                                bg-gradient-to-r
                                from-transparent
                                via-white/[0.08]
                                to-transparent

                                opacity-0
                                transition-opacity

                                group-hover:opacity-100
                                group-disabled:opacity-0
                            "
                        />

                        {loading ? (
                            <>
                                <Loader2
                                    size={16}
                                    aria-hidden="true"
                                    className="
                                        motion-safe:animate-spin
                                    "
                                />

                                <span className="relative">
                                    Saqlanmoqda...
                                </span>
                            </>
                        ) : (
                            <>
                                <Save
                                    size={16}
                                    aria-hidden="true"
                                />

                                <span className="relative">
                                    Saqlash
                                </span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* ==============================================
                MOBILE STATUS
            =============================================== */}

            <div
                role="status"
                className="
                    mt-3 flex
                    items-center justify-center gap-2

                    text-center text-[11px]
                    font-medium
                    text-slate-500

                    sm:hidden

                    dark:text-slate-400
                "
            >
                {loading ? (
                    <>
                        <Loader2
                            size={13}
                            aria-hidden="true"
                            className="
                                shrink-0
                                text-indigo-600
                                motion-safe:animate-spin

                                dark:text-indigo-400
                            "
                        />

                        Fon rasmi saqlanmoqda...
                    </>
                ) : hasChanges ? (
                    <>
                        <CheckCircle2
                            size={13}
                            aria-hidden="true"
                            className="
                                shrink-0
                                text-emerald-600
                                dark:text-emerald-400
                            "
                        />

                        Yangi rasm saqlashga tayyor
                    </>
                ) : (
                    <>
                        <ImagePlus
                            size={13}
                            aria-hidden="true"
                            className="shrink-0"
                        />

                        Saqlash uchun yangi rasm tanlang
                    </>
                )}
            </div>

            {/* ==============================================
                LOADING PROGRESS INDICATOR
            =============================================== */}

            {loading && (
                <div
                    role="progressbar"
                    aria-label="Fon rasmi yuklanmoqda"
                    aria-valuetext="Saqlash davom etmoqda"
                    className="
                        pointer-events-none
                        absolute inset-x-0 top-0
                        h-[2px] overflow-hidden

                        bg-indigo-500/10
                    "
                >
                    <div
                        className="
                            h-full w-1/3

                            bg-gradient-to-r
                            from-transparent
                            via-indigo-500
                            to-transparent

                            motion-safe:animate-pulse

                            dark:via-indigo-400
                        "
                    />
                </div>
            )}
        </footer>
    );
});

export default CoverImageFooter;
