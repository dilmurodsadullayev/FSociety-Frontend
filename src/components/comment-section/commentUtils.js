
import UserImage from "../../assests/userImage.jpeg";
import { BACKEND_URL } from "../../services/config";

// =========================================================
// FSOCIETY — COMMENT UTILITIES
// =========================================================

export const getCommentUsername = (comment) => {
    const username =
        comment?.user?.username ||
        comment?.username ||
        comment?.user_username;

    return typeof username === "string" &&
        username.trim()
        ? username.trim()
        : "anonymous";
};

// =========================================================
// AVATAR URL
// =========================================================

export const getCommentImageUrl = (comment) => {
    const image =
        comment?.user?.image ||
        comment?.user_image ||
        comment?.image;

    const value =
        typeof image === "object" && image !== null
            ? image.image || image.url || image.file
            : image;

    if (typeof value !== "string" || !value.trim()) {
        return UserImage;
    }

    const source = value.trim();

    if (/^https?:\/\//i.test(source)) {
        return source;
    }

    if (source.startsWith("//")) {
        return `https:${source}`;
    }

    if (
        source.startsWith("blob:") ||
        /^data:image\//i.test(source)
    ) {
        return source;
    }

    // Reject unsupported URL schemes.
    if (/^[a-z][a-z0-9+.-]*:/i.test(source)) {
        return UserImage;
    }

    const base = String(BACKEND_URL || "")
        .replace(/\/+$/, "");

    const path = source.startsWith("/")
        ? source
        : `/${source}`;

    return `${base}${path}`;
};

export const handleCommentImageError = (event) => {
    const image = event.currentTarget;

    if (image.src.endsWith("userImage.jpeg")) {
        return;
    }

    image.onerror = null;
    image.src = UserImage;
};

// =========================================================
// TIME AGO
// =========================================================

export const getCommentTimeAgo = (createdAt) => {
    if (!createdAt) return "hozirgina";

    const date = new Date(createdAt);
    const timestamp = date.getTime();

    if (!Number.isFinite(timestamp)) {
        return "hozirgina";
    }

    const diffSeconds = Math.max(
        0,
        Math.floor((Date.now() - timestamp) / 1000)
    );

    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffYears > 0) {
        return diffYears === 1
            ? "1 yil oldin"
            : `${diffYears} yil oldin`;
    }

    if (diffMonths > 0) {
        return diffMonths === 1
            ? "1 oy oldin"
            : `${diffMonths} oy oldin`;
    }

    if (diffDays > 0) {
        return diffDays === 1
            ? "1 kun oldin"
            : `${diffDays} kun oldin`;
    }

    if (diffHours > 0) {
        return diffHours === 1
            ? "1 soat oldin"
            : `${diffHours} soat oldin`;
    }

    if (diffMinutes > 0) {
        return diffMinutes === 1
            ? "1 daqiqa oldin"
            : `${diffMinutes} daqiqa oldin`;
    }

    return "hozirgina";
};

// =========================================================
// ADMIN LIKE
// =========================================================

export const isAdminLikedComment = (value) => {
    return (
        value === true ||
        value === "true" ||
        value === 1 ||
        value === "1"
    );
};

// =========================================================
// COMMENT VISIBILITY
// =========================================================

export const isRestrictedComment = (status) => {
    if (!status) return false;

    return (
        String(status).toLowerCase() !== "visible"
    );
};

// =========================================================
// ERROR MESSAGE
// =========================================================

export const getCommentErrorMessage = (error) => {
    const data = error?.response?.data;

    const candidates = [
        typeof data === "string" ? data : null,
        data?.detail,
        data?.message,
        data?.error,
        error?.message,
    ];

    const message = candidates.find(
        (value) =>
            typeof value === "string" &&
            value.trim().length > 0
    );

    return (
        message ||
        "Fikrlarni yuklashda xatolik yuz berdi."
    );
};
