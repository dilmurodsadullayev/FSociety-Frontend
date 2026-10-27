
import React, {
    memo,
    useEffect,
    useState,
} from "react";

import {
    AlertCircle,
    Camera,
    FileImage,
    ImageOff,
    Loader2,
    ShieldCheck,
    UploadCloud,
} from "lucide-react";

import {
    COVER_IMAGE_MAX_SIZE_MB,
    formatCoverFileSize,
} from "./coverImageUtils";

// ============================================================
// COVER IMAGE PREVIEW
// ============================================================

const CoverImagePreview = memo(function CoverImagePreview({
    previewUrl = null,
    file = null,
    loading = false,
    error = "",
    onChooseImage,
}) {
    const [previewFailed, setPreviewFailed] =
        useState(false);

    // ========================================================
    // RESET IMAGE ERROR WHEN SOURCE CHANGES
    // ========================================================

    useEffect(() => {
        setPreviewFailed(false);
    }, [previewUrl]);

    const hasPreview =
        Boolean(previewUrl) && !previewFailed;

    const hasSelectedFile = Boolean(file);

    const handleChoose = () => {
        if (loading) return;

        onChooseImage?.();
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <section
            aria-label="Fon rasmini tanlash"
            className="
                min-w-0 overflow-hidden
                rounded-2xl sm:rounded-[24px]

                border border-slate-200
                bg-white

                shadow-sm shadow-slate-900/5

                dark:border-white/[0.09]
                dark:bg-[#111722]
                dark:shadow-black/20
            "
        >
            {/* ==============================================
                IMAGE CONTAINER
            =============================================== */}

            <div
                className="
                    group relative
                    aspect-[16/10] w-full
                    min-h-[165px]
                    overflow-hidden

                    bg-slate-100

                    sm:aspect-[16/7]
                    sm:min-h-[220px]

                    dark:bg-[#0d121b]
                "
            >
                {/* ==========================================
                    IMAGE OR FALLBACK
                =========================================== */}

                {hasPreview ? (
                    <img
                        src={previewUrl}
                        alt="Fon rasmi oldindan ko‘rinishi"
                        onError={() => {
                            setPreviewFailed(true);
                        }}
                        className="
                            absolute inset-0
                            h-full w-full
                            object-cover
                            object-center
                        "
                    />
                ) : (
                    <div
                        className="
                            absolute inset-0
                            flex flex-col
                            items-center justify-center
                            gap-3 px-4

                            text-slate-400
                            dark:text-slate-500
                        "
                    >
                        <div
                            className="
                                grid h-16 w-16
                                place-items-center
                                rounded-2xl

                                border border-indigo-200
                                bg-indigo-50

                                text-indigo-500

                                dark:border-indigo-400/15
                                dark:bg-indigo-500/[0.08]
                                dark:text-indigo-300
                            "
                        >
                            {previewFailed ? (
                                <ImageOff
                                    size={29}
                                    strokeWidth={1.5}
                                />
                            ) : (
                                <Camera
                                    size={29}
                                    strokeWidth={1.5}
                                />
                            )}
                        </div>

                        <p
                            className="
                                text-center font-display
                                text-xs font-semibold

                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            {previewFailed
                                ? "Rasmni ko‘rsatib bo‘lmadi"
                                : "Fon rasmi tanlanmagan"}
                        </p>
                    </div>
                )}

                {/* ==========================================
                    IMAGE GRADIENT
                =========================================== */}

                {hasPreview && (
                    <div
                        aria-hidden="true"
                        className="
                            pointer-events-none
                            absolute inset-0

                            bg-gradient-to-t
                            from-black/45
                            via-transparent
                            to-black/10
                        "
                    />
                )}

                {/* ==========================================
                    CHANGE IMAGE BUTTON
                =========================================== */}

                <button
                    type="button"
                    onClick={handleChoose}
                    disabled={loading}
                    aria-label={
                        hasSelectedFile || hasPreview
                            ? "Boshqa fon rasmi tanlash"
                            : "Fon rasmi tanlash"
                    }
                    className="
                        absolute inset-0 z-10
                        flex flex-col
                        items-center justify-center
                        gap-2

                        bg-slate-950/10
                        px-4 text-white

                        transition-all duration-200

                        hover:bg-slate-950/55

                        focus-visible:bg-slate-950/60
                        focus-visible:outline
                        focus-visible:outline-2
                        focus-visible:outline-offset-[-3px]
                        focus-visible:outline-indigo-400

                        disabled:cursor-not-allowed
                        disabled:opacity-60

                        sm:bg-transparent
                    "
                >
                    <div
                        className="
                            grid h-12 w-12
                            place-items-center
                            rounded-2xl

                            border border-white/30
                            bg-slate-950/45
                            shadow-lg
                            backdrop-blur-sm

                            transition-transform duration-200

                            group-hover:scale-105
                        "
                    >
                        <UploadCloud
                            size={22}
                            strokeWidth={1.8}
                        />
                    </div>

                    <span
                        className="
                            rounded-lg
                            bg-slate-950/55
                            px-3 py-1.5

                            font-display
                            text-xs font-semibold

                            backdrop-blur-sm
                        "
                    >
                        {hasSelectedFile || hasPreview
                            ? "Rasmni almashtirish"
                            : "Rasm tanlash"}
                    </span>
                </button>

                {/* ==========================================
                    LOADING OVERLAY
                =========================================== */}

                {loading && (
                    <div
                        aria-live="polite"
                        className="
                            absolute inset-0 z-20
                            flex flex-col
                            items-center justify-center
                            gap-3

                            bg-slate-950/75
                            text-white

                            backdrop-blur-sm
                        "
                    >
                        <Loader2
                            size={27}
                            aria-hidden="true"
                            className="
                                animate-spin
                                text-indigo-300
                            "
                        />

                        <p
                            className="
                                font-display
                                text-xs font-semibold
                            "
                        >
                            Fon rasmi saqlanmoqda...
                        </p>
                    </div>
                )}
            </div>

            {/* ==============================================
                FILE INFORMATION
            =============================================== */}

            <div
                className="
                    flex min-w-0 flex-col
                    gap-3 border-t
                    border-slate-200/80

                    p-3.5 sm:p-4

                    sm:flex-row
                    sm:items-center
                    sm:justify-between

                    dark:border-white/[0.07]
                "
            >
                <div
                    className="
                        flex min-w-0
                        flex-1 items-center gap-3
                    "
                >
                    <div
                        aria-hidden="true"
                        className="
                            grid h-10 w-10
                            shrink-0 place-items-center
                            rounded-xl

                            border border-indigo-200
                            bg-indigo-50

                            text-indigo-600

                            dark:border-indigo-400/15
                            dark:bg-indigo-500/[0.08]
                            dark:text-indigo-300
                        "
                    >
                        <FileImage size={17} />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p
                            title={
                                file?.name ||
                                (
                                    hasPreview
                                        ? "Joriy fon rasmi"
                                        : "Fon rasmi yo‘q"
                                )
                            }
                            className="
                                truncate font-sans
                                text-xs font-semibold

                                text-slate-800
                                dark:text-slate-100
                            "
                        >
                            {file?.name ||
                                (
                                    hasPreview
                                        ? "Joriy fon rasmi"
                                        : "Fon rasmi tanlanmagan"
                                )}
                        </p>

                        <p
                            className="
                                mt-1 text-[11px]
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            {file
                                ? formatCoverFileSize(
                                    file.size
                                )
                                : (
                                    hasPreview
                                        ? "Mavjud rasm"
                                        : "Yangi rasm tanlang"
                                )}
                        </p>
                    </div>
                </div>

                {/* SELECT BUTTON */}

                <button
                    type="button"
                    onClick={handleChoose}
                    disabled={loading}
                    className="
                        inline-flex min-h-[42px]
                        w-full shrink-0
                        items-center justify-center
                        gap-2 rounded-xl

                        border border-indigo-200
                        bg-indigo-50
                        px-4 py-2.5

                        font-display
                        text-xs font-semibold
                        text-indigo-700

                        transition-colors

                        hover:bg-indigo-100

                        focus-visible:outline
                        focus-visible:outline-2
                        focus-visible:outline-offset-2
                        focus-visible:outline-indigo-500

                        disabled:cursor-not-allowed
                        disabled:opacity-50

                        sm:w-auto

                        dark:border-indigo-400/20
                        dark:bg-indigo-500/10
                        dark:text-indigo-300

                        dark:hover:bg-indigo-500/15
                    "
                >
                    <UploadCloud size={15} />

                    {hasSelectedFile
                        ? "Boshqa rasm"
                        : "Rasm tanlash"}
                </button>
            </div>

            {/* ==============================================
                FORMAT HINT
            =============================================== */}

            <div
                className="
                    flex flex-wrap
                    items-center gap-x-3 gap-y-1.5

                    border-t border-slate-200/80
                    px-4 py-3

                    text-[11px]
                    leading-5 text-slate-500

                    dark:border-white/[0.07]
                    dark:text-slate-400
                "
            >
                <ShieldCheck
                    size={15}
                    aria-hidden="true"
                    className="
                        shrink-0 text-emerald-600
                        dark:text-emerald-400
                    "
                />

                <span>JPG, PNG yoki WEBP</span>

                <span>
                    Maksimal {COVER_IMAGE_MAX_SIZE_MB} MB
                </span>

                <span>
                    Keng formatdagi rasm tavsiya etiladi.
                </span>
            </div>

            {/* ==============================================
                PREVIEW ERROR
            =============================================== */}

            {previewFailed && (
                <p
                    role="status"
                    className="
                        border-t border-amber-200
                        bg-amber-50 px-4 py-3

                        text-xs text-amber-700

                        dark:border-amber-400/15
                        dark:bg-amber-500/[0.06]
                        dark:text-amber-300
                    "
                >
                    Rasmni ko‘rsatishda muammo yuz berdi.
                    Boshqa rasm tanlab ko‘ring.
                </p>
            )}

            {/* ==============================================
                VALIDATION / SERVER ERROR
            =============================================== */}

            {error && (
                <div
                    role="alert"
                    className="
                        flex min-w-0
                        items-start gap-2.5

                        border-t border-rose-200
                        bg-rose-50 px-4 py-3

                        text-xs font-medium
                        leading-5 text-rose-700

                        dark:border-rose-400/20
                        dark:bg-rose-500/[0.07]
                        dark:text-rose-300
                    "
                >
                    <AlertCircle
                        size={16}
                        aria-hidden="true"
                        className="mt-0.5 shrink-0"
                    />

                    <span className="min-w-0 break-words">
                        {error}
                    </span>
                </div>
            )}
        </section>
    );
});

export default CoverImagePreview;
