
import React, { memo } from "react";

import {
    ImagePlus,
    Loader2,
    ShieldCheck,
    Sparkles,
    X,
} from "lucide-react";

// ============================================================
// COVER IMAGE HEADER
// ============================================================

const CoverImageHeader = memo(function CoverImageHeader({
    onClose,
    loading = false,
    className = "",
}) {
    // ========================================================
    // SAFE CLOSE
    // ========================================================

    const handleClose = () => {
        if (loading) return;

        onClose?.();
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <header
            className={`
                relative z-30
                flex min-w-0 shrink-0
                items-center justify-between gap-3

                border-b border-slate-200/90
                bg-white/95
                px-4 py-3.5

                backdrop-blur-xl

                sm:px-6 sm:py-5

                dark:border-white/[0.08]
                dark:bg-[#0b0f17]/95

                ${className}
            `}
        >
            {/* ==========================================
                LEFT CONTENT
            =========================================== */}

            <div
                className="
                    flex min-w-0 flex-1
                    items-center gap-3
                    sm:gap-4
                "
            >
                {/* ICON */}

                <div
                    aria-hidden="true"
                    className="
                        relative grid
                        h-11 w-11 shrink-0
                        place-items-center
                        overflow-hidden
                        rounded-2xl

                        border border-indigo-200
                        bg-indigo-50
                        text-indigo-600

                        sm:h-12 sm:w-12

                        dark:border-indigo-400/20
                        dark:bg-indigo-500/10
                        dark:text-indigo-300
                    "
                >
                    <div
                        className="
                            pointer-events-none
                            absolute -right-3 -top-3
                            h-9 w-9 rounded-full
                            bg-indigo-400/20 blur-xl

                            dark:bg-indigo-400/15
                        "
                    />

                    <ImagePlus
                        size={22}
                        strokeWidth={1.8}
                        className="relative z-10"
                    />

                    {/* MR ROBOT STYLE ACCENT */}

                    <span
                        className="
                            absolute bottom-0 left-0
                            h-[2px] w-full

                            bg-gradient-to-r
                            from-transparent
                            via-indigo-500
                            to-transparent

                            dark:via-indigo-400
                        "
                    />
                </div>

                {/* TEXT */}

                <div className="min-w-0 flex-1">
                    <div
                        className="
                            flex min-w-0
                            items-center gap-2
                        "
                    >
                        <h2
                            id="cover-image-modal-title"
                            className="
                                min-w-0 truncate

                                font-display
                                text-base font-bold
                                tracking-tight
                                text-slate-900

                                sm:text-xl

                                dark:text-white
                            "
                        >
                            Fon rasmini tahrirlash
                        </h2>

                        <Sparkles
                            size={15}
                            aria-hidden="true"
                            className="
                                hidden shrink-0
                                text-indigo-500

                                sm:block

                                dark:text-indigo-400
                            "
                        />
                    </div>

                    <p
                        id="cover-image-modal-description"
                        className="
                            mt-0.5
                            truncate
                            text-[11px]
                            leading-5
                            text-slate-500

                            sm:text-xs

                            dark:text-slate-400
                        "
                    >
                        Profilingiz uchun yangi fon rasmi
                    </p>

                    {/* MOBILE STATUS */}

                    {loading && (
                        <div
                            role="status"
                            className="
                                mt-1.5
                                inline-flex items-center gap-1.5

                                text-[10px] font-semibold
                                text-indigo-600

                                dark:text-indigo-300

                                md:hidden
                            "
                        >
                            <Loader2
                                size={11}
                                aria-hidden="true"
                                className="
                                    motion-safe:animate-spin
                                "
                            />

                            Saqlanmoqda...
                        </div>
                    )}
                </div>
            </div>

            {/* ==========================================
                RIGHT CONTENT
            =========================================== */}

            <div
                className="
                    flex shrink-0
                    items-center gap-2
                "
            >
                {/* DESKTOP STATUS */}

                <div
                    className={`
                        hidden items-center gap-2
                        rounded-xl border
                        px-3 py-2

                        text-[10px] font-semibold

                        md:inline-flex

                        ${
                            loading
                                ? `
                                    border-indigo-200
                                    bg-indigo-50
                                    text-indigo-700

                                    dark:border-indigo-400/20
                                    dark:bg-indigo-500/10
                                    dark:text-indigo-300
                                `
                                : `
                                    border-emerald-200
                                    bg-emerald-50
                                    text-emerald-700

                                    dark:border-emerald-400/15
                                    dark:bg-emerald-500/[0.06]
                                    dark:text-emerald-300
                                `
                        }
                    `}
                >
                    {loading ? (
                        <>
                            <Loader2
                                size={14}
                                aria-hidden="true"
                                className="
                                    motion-safe:animate-spin
                                "
                            />

                            Saqlanmoqda
                        </>
                    ) : (
                        <>
                            <ShieldCheck
                                size={14}
                                aria-hidden="true"
                            />

                            Profile Cover
                        </>
                    )}
                </div>

                {/* CLOSE */}

                <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    aria-label="Fon rasmi oynasini yopish"
                    title={
                        loading
                            ? "Saqlash davom etmoqda"
                            : "Yopish"
                    }
                    className="
                        grid h-10 w-10 shrink-0
                        place-items-center
                        rounded-xl

                        border border-slate-200
                        bg-slate-50
                        text-slate-500

                        transition-colors duration-200

                        hover:border-rose-200
                        hover:bg-rose-50
                        hover:text-rose-600

                        focus-visible:outline
                        focus-visible:outline-2
                        focus-visible:outline-offset-2
                        focus-visible:outline-indigo-500

                        disabled:cursor-not-allowed
                        disabled:opacity-40

                        dark:border-white/[0.09]
                        dark:bg-white/[0.035]
                        dark:text-slate-400

                        dark:hover:border-rose-400/20
                        dark:hover:bg-rose-500/10
                        dark:hover:text-rose-300
                    "
                >
                    {loading ? (
                        <Loader2
                            size={18}
                            aria-hidden="true"
                            className="
                                motion-safe:animate-spin
                            "
                        />
                    ) : (
                        <X
                            size={18}
                            aria-hidden="true"
                        />
                    )}
                </button>
            </div>
        </header>
    );
});

export default CoverImageHeader;
