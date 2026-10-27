
import React, { memo } from "react";

import {
    CheckCircle2,
    Info,
    Loader2,
    Save,
    ShieldCheck,
    X,
} from "lucide-react";

// ============================================================
// EDIT PROFILE FOOTER
// ============================================================

const EditProfileFooter = memo(function EditProfileFooter({
    onClose,
    loading = false,
    hasChanges = true,
    disabled = false,
    formId,
    className = "",
}) {
    // ========================================================
    // ACTION STATES
    // ========================================================

    const isSaveDisabled =
        loading || disabled || !hasChanges;

    const isCloseDisabled = loading;

    // ========================================================
    // CLOSE
    // ========================================================

    const handleClose = () => {
        if (isCloseDisabled) return;

        onClose?.();
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <footer
            className={`
                sticky bottom-0 z-30
                -mx-4 -mb-4

                border-t border-slate-200/90
                bg-white/95

                px-4 py-3.5
                pb-[max(0.875rem,env(safe-area-inset-bottom))]

                backdrop-blur-xl

                sm:-mx-6 sm:-mb-6
                sm:px-6 sm:py-4

                dark:border-white/[0.08]
                dark:bg-[#0b0f17]/95

                ${className}
            `}
        >
            {/* ==========================================
                ACTION ROW
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
                    STATUS MESSAGE
                ======================================= */}

                <div
                    className="
                        hidden min-w-0
                        items-center gap-2

                        sm:flex
                    "
                    aria-live="polite"
                >
                    {loading ? (
                        <>
                            <Loader2
                                size={15}
                                aria-hidden="true"
                                className="
                                    shrink-0 animate-spin
                                    text-indigo-600

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
                                Ma’lumotlar saqlanmoqda...
                            </span>
                        </>
                    ) : hasChanges ? (
                        <>
                            <Info
                                size={15}
                                aria-hidden="true"
                                className="
                                    shrink-0
                                    text-amber-600

                                    dark:text-amber-400
                                "
                            />

                            <span
                                className="
                                    text-xs font-medium
                                    text-slate-500

                                    dark:text-slate-400
                                "
                            >
                                O‘zgarishlar hali saqlanmagan
                            </span>
                        </>
                    ) : (
                        <>
                            <CheckCircle2
                                size={15}
                                aria-hidden="true"
                                className="
                                    shrink-0
                                    text-emerald-600

                                    dark:text-emerald-400
                                "
                            />

                            <span
                                className="
                                    text-xs font-medium
                                    text-slate-500

                                    dark:text-slate-400
                                "
                            >
                                Saqlanmagan o‘zgarish yo‘q
                            </span>
                        </>
                    )}
                </div>

                {/* ======================================
                    BUTTON GROUP
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
                        disabled={isCloseDisabled}
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

                            transition-all duration-200

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
                        disabled={isSaveDisabled}
                        aria-busy={loading}
                        className="
                            group relative
                            inline-flex min-h-[44px]
                            w-full items-center
                            justify-center gap-2
                            overflow-hidden rounded-xl

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
                            min-[380px]:min-w-[155px]

                            dark:bg-indigo-600
                            dark:hover:bg-indigo-500
                        "
                    >
                        {/* BUTTON GLOW */}

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
                                    className="animate-spin"
                                    aria-hidden="true"
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
                className="
                    mt-3 flex items-center
                    justify-center gap-1.5

                    text-center text-[11px]
                    text-slate-500

                    dark:text-slate-400

                    sm:hidden
                "
                aria-live="polite"
            >
                {loading ? (
                    <>
                        <Loader2
                            size={12}
                            className="animate-spin"
                            aria-hidden="true"
                        />

                        Saqlanmoqda...
                    </>
                ) : (
                    <>
                        <ShieldCheck
                            size={13}
                            aria-hidden="true"
                            className="
                                text-emerald-600
                                dark:text-emerald-400
                            "
                        />

                        {hasChanges
                            ? "O‘zgarishlarni saqlashni unutmang"
                            : "Saqlanmagan o‘zgarish yo‘q"}
                    </>
                )}
            </div>

            {/* ==============================================
                LOADING PROGRESS BAR
            =============================================== */}

            {loading && (
                <div
                    role="progressbar"
                    aria-label="Profil saqlanmoqda"
                    aria-valuetext="Saqlash davom etmoqda"
                    className="
                        absolute inset-x-0
                        top-0 h-[2px]
                        overflow-hidden
                        bg-indigo-500/10
                    "
                >
                    <div
                        className="
                            h-full w-1/3
                            animate-pulse
                            bg-gradient-to-r
                            from-transparent
                            via-indigo-500
                            to-transparent

                            dark:via-indigo-400
                        "
                    />
                </div>
            )}
        </footer>
    );
});

export default EditProfileFooter;
