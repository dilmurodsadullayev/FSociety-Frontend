
 // src/components/profile/edit/cover/coverImageUtils.js

// ============================================================
// CONFIG — matches CoverImageUpdateSerializer
// ============================================================

export const COVER_IMAGE_MAX_SIZE_MB = 5;

export const COVER_IMAGE_MAX_SIZE =
    COVER_IMAGE_MAX_SIZE_MB * 1024 * 1024;

export const COVER_IMAGE_ALLOWED_TYPES = Object.freeze([
    "image/jpeg",
    "image/png",
]);

export const COVER_IMAGE_ACCEPT =
    COVER_IMAGE_ALLOWED_TYPES.join(",");

// ============================================================
// FILE SIZE FORMAT
// ============================================================

export const formatCoverFileSize = (bytes) => {
    const number = Number(bytes);

    const size =
        Number.isFinite(number) && number > 0
            ? number
            : 0;

    if (size < 1024) {
        return `${Math.round(size)} B`;
    }

    if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / 1024 / 1024).toFixed(1)} MB`;
};

// ============================================================
// FILE VALIDATION
// ============================================================

export const validateCoverImage = (file) => {
    if (!file) {
        return "Iltimos, yangi fon rasmini tanlang.";
    }

    if (!COVER_IMAGE_ALLOWED_TYPES.includes(file.type)) {
        return "Faqat JPG yoki PNG formatidagi rasmni tanlang.";
    }

    if (
        !Number.isFinite(file.size) ||
        file.size <= 0
    ) {
        return "Tanlangan rasm bo‘sh yoki fayl noto‘g‘ri.";
    }

    if (file.size > COVER_IMAGE_MAX_SIZE) {
        return (
            `Rasm hajmi ${COVER_IMAGE_MAX_SIZE_MB} MB ` +
            "dan oshmasligi kerak."
        );
    }

    return "";
};

// ============================================================
// BACKEND ERROR FLATTENING
// ============================================================

const flattenError = (value, depth = 0) => {
    if (value == null || depth > 4) {
        return "";
    }

    if (typeof value === "string") {
        return value.trim();
    }

    if (Array.isArray(value)) {
        return value
            .map((item) => flattenError(item, depth + 1))
            .filter(Boolean)
            .join(" ");
    }

    if (typeof value === "object") {
        return Object.values(value)
            .map((item) => flattenError(item, depth + 1))
            .filter(Boolean)
            .join(" ");
    }

    return "";
};

// ============================================================
// PUBLIC ERROR MESSAGE
// ============================================================

export const getCoverImageErrorMessage = (
    error,
    fallback = "Fon rasmini saqlashda xatolik yuz berdi."
) => {
    const status = error?.response?.status;

    const data =
        error?.serverData ??
        error?.response?.data;

    // Do not display internal server details.
    if (status >= 500) {
        return (
            "Serverda xatolik yuz berdi. " +
            "Birozdan keyin qayta urinib ko‘ring."
        );
    }

    if (status === 401) {
        return (
            "Sessiya muddati tugagan. " +
            "Qayta tizimga kiring."
        );
    }

    if (status === 403) {
        return (
            "Fon rasmini o‘zgartirish uchun " +
            "ruxsat berilmadi."
        );
    }

    if (status === 404) {
        return (
            "Profil yoki rasmni yangilash " +
            "manzili topilmadi."
        );
    }

    if (status === 413) {
        return (
            "Rasm server uchun juda katta. " +
            "Kichikroq rasm tanlang."
        );
    }

    if (status === 429) {
        return (
            "Juda ko‘p so‘rov yuborildi. " +
            "Birozdan keyin urinib ko‘ring."
        );
    }

    if (data && typeof data === "object") {
        const field = flattenError(
            data.cover_image
        );

        if (field) {
            return `Fon rasmi: ${field}`;
        }

        const general = flattenError(
            data.detail ??
            data.non_field_errors ??
            data.message ??
            data.error
        );

        if (general) {
            return general;
        }

        const other = flattenError(data);

        if (other) {
            return other;
        }
    }

    if (typeof data === "string") {
        const message = data.trim();

        if (
            message &&
            !/^\s*(?:<!doctype|<html)/i.test(
                message
            )
        ) {
            return message;
        }
    }

    // Network errors
    if (
        !error?.response &&
        (
            error?.code === "ERR_NETWORK" ||
            error?.message === "Network Error"
        )
    ) {
        return (
            "Serverga ulanib bo‘lmadi. " +
            "Internet aloqangizni tekshiring."
        );
    }

    // JSON encoded errors from services.
    if (typeof error?.message === "string") {
        try {
            const parsed = JSON.parse(
                error.message
            );

            if (
                parsed &&
                typeof parsed === "object"
            ) {
                return (
                    flattenError(parsed.cover_image) ||
                    flattenError(parsed.detail) ||
                    flattenError(parsed) ||
                    fallback
                );
            }
        } catch {
            // Non-JSON error.
        }
    }

    return fallback;
};

// ============================================================
// BUILD MULTIPART PAYLOAD
// ============================================================

export const buildCoverImagePayload = (file) => {
    const validationError =
        validateCoverImage(file);

    if (validationError) {
        throw new Error(validationError);
    }

    const formData = new FormData();

    formData.append("cover_image", file);

    return formData;
};
