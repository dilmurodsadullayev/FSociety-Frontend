
import { BACKEND_URL } from "../../../services/config";

export const PROMOTION_LIMIT = 5;
export const AUTO_ROTATE_DELAY = 7000;

// =========================================================
// NUMBERS
// =========================================================

export const safeNumber = (value) => {
    const number = Number(value);

    return Number.isFinite(number)
        ? Math.max(0, number)
        : 0;
};

export const formatCompactNumber = (value) => {
    const number = safeNumber(value);

    if (number >= 1_000_000) {
        const formatted = number / 1_000_000;

        return `${formatted.toFixed(
            formatted >= 10 ? 0 : 1
        )}M`;
    }

    if (number >= 1_000) {
        const formatted = number / 1_000;

        return `${formatted.toFixed(
            formatted >= 10 ? 0 : 1
        )}K`;
    }

    return String(number);
};

// =========================================================
// IMAGE URL
// =========================================================

export const getProjectImageUrl = (image) => {
    if (!image) return null;

    const rawValue =
        typeof image === "object"
            ? image.image || image.url || image.file
            : image;

    if (typeof rawValue !== "string") {
        return null;
    }

    const value = rawValue.trim();

    if (!value) return null;

    if (/^https?:\/\//i.test(value)) {
        return value;
    }

    if (value.startsWith("//")) {
        return `https:${value}`;
    }

    if (
        value.startsWith("blob:") ||
        /^data:image\//i.test(value)
    ) {
        return value;
    }

    // Reject unexpected URL schemes.
    if (/^[a-z][a-z\d+.-]*:/i.test(value)) {
        return null;
    }

    const base = String(
        BACKEND_URL || ""
    ).replace(/\/+$/, "");

    const path = value.startsWith("/")
        ? value
        : `/${value}`;

    return `${base}${path}`;
};

// =========================================================
// API ERROR
// =========================================================

export const getErrorMessage = (error) => {
    const data = error?.response?.data;

    if (typeof data === "string" && data.trim()) {
        return data;
    }

    for (const value of [
        data?.detail,
        data?.message,
        data?.error,
        error?.message,
    ]) {
        if (typeof value === "string" && value.trim()) {
            return value;
        }
    }

    return "Promotion projectlarini yuklab bo‘lmadi.";
};

// =========================================================
// CANCELED REQUEST
// =========================================================

export const isCanceledRequest = (error) => {
    return (
        error?.code === "ERR_CANCELED" ||
        error?.name === "CanceledError" ||
        error?.name === "AbortError"
    );
};

// =========================================================
// PROJECT TECHNOLOGY STACK
//
// Preserve original priority:
// 1. language_data
// 2. technology_data
// 3. languages_data
// 4. technologies_data
//
// Maximum two distinct entries.
// =========================================================

export const getProjectStack = (project) => {
    const values = [];

    const addStack = (value) => {
        const raw =
            value && typeof value === "object"
                ? value.name
                : value;

        const text = String(raw ?? "").trim();

        if (!text || values.length >= 2) {
            return;
        }

        const exists = values.some(
            (current) =>
                current.toLowerCase() ===
                text.toLowerCase()
        );

        if (!exists) {
            values.push(text);
        }
    };

    addStack(project?.language_data?.name);
    addStack(project?.technology_data?.name);

    const languages = Array.isArray(
        project?.languages_data
    )
        ? project.languages_data
        : [];

    languages.forEach(addStack);

    const technologies = Array.isArray(
        project?.technologies_data
    )
        ? project.technologies_data
        : [];

    technologies.forEach(addStack);

    return values;
};
