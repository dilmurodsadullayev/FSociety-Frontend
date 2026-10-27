
import React, {
    memo,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    AlertCircle,
    Camera,
    CheckCircle2,
    ImageOff,
    Loader2,
    ShieldCheck,
    Trash2,
    UploadCloud,
    UserRound,
} from "lucide-react";

import EditProfileSection from "./EditProfileSection";

// ============================================================
// IMAGE CONFIGURATION
// ============================================================

const MAX_IMAGE_SIZE_MB = 5;

const MAX_IMAGE_SIZE_BYTES =
    MAX_IMAGE_SIZE_MB * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

const IMAGE_ACCEPT =
    ALLOWED_IMAGE_TYPES.join(",");

// ============================================================
// FILE VALIDATION
// ============================================================

export const validateProfileImage = (file) => {
    if (!file) {
        return "Rasm fayli tanlanmagan.";
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return (
            "Faqat JPG, PNG yoki WEBP " +
            "formatidagi rasmlar qabul qilinadi."
        );
    }

    if (file.size <= 0) {
        return "Tanlangan rasm fayli bo‘sh.";
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
        return (
            `Rasm hajmi ${MAX_IMAGE_SIZE_MB} MB ` +
            "dan oshmasligi kerak."
        );
    }

    return "";
};

// ============================================================
// AVATAR COMPONENT
// ============================================================

const EditProfileAvatar = memo(function EditProfileAvatar({
    profileImagePreview = null,
    profileImageFile = null,
    removeProfileImage = false,

    loading = false,

    onSelectFile,
    onRemoveImage,
    onValidationError,
}) {
    const imageInputRef = useRef(null);

    const [localError, setLocalError] = useState("");
    const [previewFailed, setPreviewFailed] = useState(false);

    // ========================================================
    // RESET PREVIEW ERROR
    // ========================================================

    useEffect(() => {
        setPreviewFailed(false);
    }, [profileImagePreview]);

    // ========================================================
    // FILE PICKER
    // ========================================================

    const handleOpenFilePicker = () => {
        if (loading) return;

        imageInputRef.current?.click();
    };

    // ========================================================
    // FILE CHANGE
    // ========================================================

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];

        // Allow selecting the same file again.
        event.target.value = "";

        if (!file || loading) {
            return;
        }

        const validationError =
            validateProfileImage(file);

        if (validationError) {
            setLocalError(validationError);
            onValidationError?.(validationError);
            return;
        }

        setLocalError("");
        setPreviewFailed(false);

        // The parent owns object URL creation and cleanup.
        onSelectFile?.(file);
    };

    // ========================================================
    // REMOVE IMAGE
    // ========================================================

    const handleRemoveImage = () => {
        if (loading) return;

        setLocalError("");
        setPreviewFailed(false);

        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }

        onRemoveImage?.();
    };

    // ========================================================
    // PREVIEW STATE
    // ========================================================

    const hasValidPreview =
        Boolean(profileImagePreview) &&
        !previewFailed;

    const hasImage =
        Boolean(profileImagePreview) ||
        Boolean(profileImageFile);

    const selectedFileName =
        profileImageFile?.name || "";

    return (
        <EditProfileSection
            Icon={Camera}
            code="IDENTITY / AVATAR"
            title="Profil rasmi"
            description="FSociety profilingizda ko‘rinadigan asosiy avatar."
            columns={1}
        >
            <div
                className="
                    flex min-w-0 flex-col
                    items-center gap-5
                    sm:flex-row sm:items-center
                    sm:gap-6
                "
            >
                {/* ==========================================
                    AVATAR PREVIEW
                =========================================== */}

                <div
                    className="
                        relative shrink-0
                        rounded-full p-1
                        ring-1 ring-indigo-200
                        dark:ring-indigo-400/20
                    "
                >
                    <div
                        className="
                            relative h-28 w-28
                            overflow-hidden rounded-full
                            border-2 border-white
                            bg-slate-100
                            sm:h-32 sm:w-32

                            dark:border-[#171d2a]
                            dark:bg-[#171d2a]
                        "
                    >
                        {hasValidPreview ? (
                            <img
                                src={profileImagePreview}
                                alt="Profil rasmi ko‘rinishi"
                                className="
                                    h-full w-full
                                    object-cover
                                "
                                onError={() => {
                                    setPreviewFailed(true);
                                }}
                            />
                        ) : (
                            <div
                                className="
                                    flex h-full w-full
                                    flex-col items-center
                                    justify-center gap-2
                                    text-slate-400

                                    dark:text-slate-500
                                "
                            >
                                {previewFailed ? (
                                    <ImageOff
                                        size={34}
                                        strokeWidth={1.5}
                                    />
                                ) : (
                                    <UserRound
                                        size={38}
                                        strokeWidth={1.5}
                                    />
                                )}
                            </div>
                        )}

                        {/* LOADING OVERLAY */}

                        {loading && (
                            <div
                                className="
                                    absolute inset-0
                                    flex items-center
                                    justify-center
                                    bg-slate-950/65
                                    backdrop-blur-sm
                                "
                            >
                                <Loader2
                                    size={25}
                                    className="
                                        animate-spin
                                        text-indigo-200
                                    "
                                />
                            </div>
                        )}
                    </div>

                    {/* AVATAR STATUS */}

                    {!loading &&
                        hasValidPreview &&
                        !removeProfileImage && (
                            <span
                                aria-label="Profil rasmi mavjud"
                                className="
                                    absolute bottom-1 right-1
                                    flex h-7 w-7
                                    items-center justify-center
                                    rounded-full
                                    border-[3px] border-white
                                    bg-emerald-500
                                    text-white

                                    dark:border-[#10141d]
                                "
                            >
                                <CheckCircle2 size={13} />
                            </span>
                        )}
                </div>

                {/* ==========================================
                    CONTENT
                =========================================== */}

                <div
                    className="
                        flex w-full min-w-0
                        flex-1 flex-col
                        items-center
                        text-center

                        sm:items-start
                        sm:text-left
                    "
                >
                    <h4
                        className="
                            text-sm font-bold
                            text-slate-900

                            dark:text-slate-100
                        "
                    >
                        Profilingiz uchun yangi rasm
                    </h4>

                    <p
                        className="
                            mt-1 max-w-md
                            text-xs leading-5
                            text-slate-500

                            dark:text-slate-400
                        "
                    >
                        Rasmni yangilashingiz yoki
                        joriy avatarni olib
                        tashlashingiz mumkin.
                    </p>

                    {/* FILE INPUT */}

                    <input
                        ref={imageInputRef}
                        type="file"
                        accept={IMAGE_ACCEPT}
                        onChange={handleFileChange}
                        disabled={loading}
                        className="sr-only"
                        tabIndex={-1}
                        aria-label="Profil rasmi faylini tanlash"
                    />

                    {/* ACTION BUTTONS */}

                    <div
                        className="
                            mt-4 flex w-full
                            flex-col gap-2

                            min-[380px]:w-auto
                            min-[380px]:flex-row

                            sm:flex-wrap
                        "
                    >
                        <button
                            type="button"
                            onClick={handleOpenFilePicker}
                            disabled={loading}
                            className="
                                inline-flex min-h-[43px]
                                items-center justify-center
                                gap-2 rounded-xl
                                border border-indigo-200
                                bg-indigo-50
                                px-4 py-2.5
                                text-xs font-bold
                                text-indigo-700
                                transition-all

                                hover:border-indigo-300
                                hover:bg-indigo-100

                                focus-visible:outline
                                focus-visible:outline-2
                                focus-visible:outline-offset-2
                                focus-visible:outline-indigo-500

                                disabled:cursor-not-allowed
                                disabled:opacity-50

                                dark:border-indigo-400/20
                                dark:bg-indigo-500/10
                                dark:text-indigo-300

                                dark:hover:bg-indigo-500/15
                            "
                        >
                            <UploadCloud size={16} />

                            {hasImage
                                ? "Rasmni almashtirish"
                                : "Rasm tanlash"}
                        </button>

                        {hasImage && (
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                disabled={loading}
                                className="
                                    inline-flex min-h-[43px]
                                    items-center justify-center
                                    gap-2 rounded-xl
                                    border border-rose-200
                                    bg-rose-50
                                    px-4 py-2.5
                                    text-xs font-bold
                                    text-rose-700
                                    transition-all

                                    hover:bg-rose-100

                                    focus-visible:outline
                                    focus-visible:outline-2
                                    focus-visible:outline-offset-2
                                    focus-visible:outline-rose-500

                                    disabled:cursor-not-allowed
                                    disabled:opacity-50

                                    dark:border-rose-400/20
                                    dark:bg-rose-500/[0.08]
                                    dark:text-rose-300

                                    dark:hover:bg-rose-500/15
                                "
                            >
                                <Trash2 size={15} />

                                Olib tashlash
                            </button>
                        )}
                    </div>

                    {/* IMAGE REQUIREMENTS */}

                    <div
                        className="
                            mt-4 flex flex-wrap
                            items-center justify-center
                            gap-x-3 gap-y-2
                            text-[11px]
                            text-slate-500

                            dark:text-slate-400

                            sm:justify-start
                        "
                    >
                        <span
                            className="
                                inline-flex
                                items-center gap-1.5
                            "
                        >
                            <ShieldCheck
                                size={13}
                                className="
                                    text-emerald-600
                                    dark:text-emerald-400
                                "
                            />

                            JPG, PNG, WEBP
                        </span>

                        <span>
                            Maksimal {MAX_IMAGE_SIZE_MB} MB
                        </span>
                    </div>

                    {/* SELECTED FILE */}

                    {selectedFileName && (
                        <p
                            aria-live="polite"
                            className="
                                mt-3 max-w-full
                                truncate rounded-lg
                                border border-indigo-200
                                bg-indigo-50/70
                                px-3 py-2
                                text-[11px]
                                font-medium
                                text-indigo-700

                                dark:border-indigo-400/15
                                dark:bg-indigo-400/[0.06]
                                dark:text-indigo-300
                            "
                            title={selectedFileName}
                        >
                            Tanlangan: {selectedFileName}
                        </p>
                    )}

                    {/* REMOVED STATUS */}

                    {removeProfileImage && (
                        <p
                            aria-live="polite"
                            className="
                                mt-3 text-xs
                                text-amber-700

                                dark:text-amber-300
                            "
                        >
                            Rasm saqlash tugmasi bosilganda
                            olib tashlanadi.
                        </p>
                    )}

                    {/* FAILED PREVIEW */}

                    {previewFailed && (
                        <p
                            role="status"
                            className="
                                mt-3 text-xs
                                text-amber-700

                                dark:text-amber-300
                            "
                        >
                            Rasmni ko‘rsatib bo‘lmadi.
                            Boshqa rasm tanlab ko‘ring.
                        </p>
                    )}
                </div>
            </div>

            {/* ==============================================
                VALIDATION ERROR
            =============================================== */}

            {localError && (
                <div
                    role="alert"
                    className="
                        flex min-w-0
                        items-start gap-2
                        rounded-xl
                        border border-rose-200
                        bg-rose-50
                        p-3 text-xs
                        font-medium leading-5
                        text-rose-700

                        dark:border-rose-400/20
                        dark:bg-rose-500/[0.07]
                        dark:text-rose-300
                    "
                >
                    <AlertCircle
                        size={16}
                        className="mt-0.5 shrink-0"
                    />

                    <span className="min-w-0 break-words">
                        {localError}
                    </span>
                </div>
            )}
        </EditProfileSection>
    );
});

export default EditProfileAvatar;
