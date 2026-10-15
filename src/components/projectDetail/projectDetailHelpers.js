
import { BACKEND_URL } from "../../services/config";

import UserImage from "../../assests/userImage.jpeg";

// =========================================================
// FSOCIETY — PROJECT DETAIL HELPERS
//
// Shared utilities for ProjectDetail components.
//
// No React dependencies.
// No Redux dependencies.
// No API requests.
// =========================================================

// =========================================================
// SAFE NUMBER
// =========================================================

export const safeNumber = (value) => {
    const number = Number(value);

    return Number.isFinite(number)
        ? Math.max(0, number)
        : 0;
};

// =========================================================
// ERROR HANDLING
// =========================================================

const extractErrorText = (value, depth = 0) => {
    if (value == null || depth > 5) {
        return "";
    }

    if (typeof value === "string") {
        const text = value.trim();

        if (!text) {
            return "";
        }

        if (
            text.startsWith("{") ||
            text.startsWith("[")
        ) {
            try {
                const parsed = JSON.parse(text);

                const extracted = extractErrorText(
                    parsed,
                    depth + 1
                );

                if (extracted) {
                    return extracted;
                }
            } catch {
                // Plain text error.
            }
        }

        return text;
    }

    if (Array.isArray(value)) {
        return value
            .map((item) =>
                extractErrorText(item, depth + 1)
            )
            .filter(Boolean)
            .join(", ");
    }

    if (typeof value === "object") {
        const preferredKeys = [
            "detail",
            "message",
            "error",
            "non_field_errors",
            "errors",
        ];

        for (const key of preferredKeys) {
            if (value[key] == null) {
                continue;
            }

            const result = extractErrorText(
                value[key],
                depth + 1
            );

            if (result) {
                return result;
            }
        }

        for (const [key, item] of Object.entries(value)) {
            if (
                preferredKeys.includes(key) ||
                ["status", "code", "config", "request"].includes(key)
            ) {
                continue;
            }

            const result = extractErrorText(
                item,
                depth + 1
            );

            if (result) {
                return `${key}: ${result}`;
            }
        }
    }

    return "";
};

export const getErrorMessage = (
    error,
    fallback = "Xatolik yuz berdi."
) => {
    if (!error) {
        return fallback;
    }

    const candidates = [
        error?.serverData,
        error?.response?.data,
        error?.message,
        error,
    ];

    for (const candidate of candidates) {
        const message = extractErrorText(candidate);

        if (message) {
            return message;
        }
    }

    return fallback;
};

// =========================================================
// REQUEST CANCELLATION
// =========================================================

export const isCanceledRequest = (error) => {
    if (!error) {
        return false;
    }

    return (
        error.code === "ERR_CANCELED" ||
        error.code === "ABORT_ERR" ||
        error.name === "CanceledError" ||
        error.name === "AbortError" ||
        error.__CANCEL__ === true
    );
};

// =========================================================
// FEATURE LIST
//
// Supports:
// - Comma-separated strings
// - Newline-separated strings
// - Arrays of strings
// =========================================================

export const formatFeatureList = (features) => {
    if (!features) {
        return [];
    }

    const source = Array.isArray(features)
        ? features
        : [features];

    return source
        .flatMap((item) =>
            String(item ?? "").split(/,\s*|\n/)
        )
        .map((item) => item.trim())
        .filter(Boolean);
};

// =========================================================
// IMAGE URL
//
// Supported:
// - HTTP / HTTPS
// - Relative backend paths
// - Blob URLs
// - Data image URLs
// - Protocol-relative URLs
//
// Falls back to UserImage.
// =========================================================

export const getImageUrl = (image) => {
    if (!image) {
        return UserImage;
    }

    const source =
        typeof image === "object" &&
        !Array.isArray(image)
            ? image.image || image.url || image.src
            : image;

    if (typeof source !== "string") {
        return UserImage;
    }

    const value = source.trim();

    if (!value) {
        return UserImage;
    }

    if (/^https?:\/\//i.test(value)) {
        return value;
    }

    if (value.startsWith("//")) {
        return value;
    }

    if (/^blob:/i.test(value)) {
        return value;
    }

    if (/^data:image\//i.test(value)) {
        return value;
    }

    // Reject unsupported URL schemes.
    if (/^[a-z][a-z0-9+.-]*:/i.test(value)) {
        return UserImage;
    }

    const baseUrl = String(
        BACKEND_URL || ""
    )
        .trim()
        .replace(/\/+$/, "");

    const path = value.replace(/^\/+/, "");

    if (!path) {
        return UserImage;
    }

    return baseUrl
        ? `${baseUrl}/${path}`
        : `/${path}`;
};

// =========================================================
// PROJECT TITLE
// =========================================================

export const getProjectTitle = (project) => {
    return (
        project?.name ||
        project?.title ||
        "Noma’lum loyiha"
    );
};

// =========================================================
// AUTHOR NAME
// =========================================================

export const getAuthorName = (author) => {
    const fullName = [
        author?.first_name,
        author?.last_name,
    ]
        .filter(Boolean)
        .join(" ")
        .trim();

    return (
        fullName ||
        author?.username ||
        "Noma’lum foydalanuvchi"
    );
};

// =========================================================
// OWNER PROFILE PATH
// =========================================================

export const getOwnerProfilePath = (author) => {
    if (!author?.username) {
        return "/projects";
    }

    return (
        `/${encodeURIComponent(author.username)}/profile/`
    );
};

// =========================================================
// STACK COLOR
// =========================================================

export const DEFAULT_STACK_COLOR = "#64748B";

export const getStackColor = (item) => {
    const color = item?.color;

    return (
        typeof color === "string" &&
        /^#[0-9a-fA-F]{6}$/.test(color)
    )
        ? color
        : DEFAULT_STACK_COLOR;
};

// =========================================================
// COLOR WITH ALPHA
// =========================================================

export const withAlpha = (color, alpha) => {
    const safeColor = getStackColor({
        color,
    });

    const safeAlpha =
        typeof alpha === "string" &&
        /^[0-9a-fA-F]{2}$/.test(alpha)
            ? alpha
            : "FF";

    return `${safeColor}${safeAlpha}`;
};

// =========================================================
// NORMALIZE STACK LIST
//
// Preserves:
// - Original object metadata
// - ID
// - Name
// - Color
// - Type
// - Category
//
// Uses full list if available, otherwise primary item.
// Removes duplicate names.
// =========================================================

export const normalizeStackList = (
    fullList,
    primaryItem,
    type
) => {
    const source =
        Array.isArray(fullList) &&
        fullList.length > 0
            ? fullList
            : primaryItem
                ? [primaryItem]
                : [];

    const seen = new Set();

    return source
        .filter(Boolean)
        .map((item, index) => {
            if (typeof item === "string") {
                const name = item.trim();

                if (!name) {
                    return null;
                }

                return {
                    id: `${type}-${name}-${index}`,
                    name,
                    color: DEFAULT_STACK_COLOR,
                    type,
                };
            }

            if (
                typeof item !== "object" ||
                Array.isArray(item)
            ) {
                return null;
            }

            const name = String(
                item.name || item.title || ""
            ).trim();

            if (!name) {
                return null;
            }

            return {
                ...item,
                id:
                    item.id ??
                    `${type}-${name}-${index}`,
                name,
                color: getStackColor(item),
                type,
            };
        })
        .filter(Boolean)
        .filter((item) => {
            const key = (
                `${item.type}-${item.name}`
            ).toLowerCase();

            if (seen.has(key)) {
                return false;
            }

            seen.add(key);

            return true;
        });
};

// =========================================================
// PROJECT OWNERSHIP
//
// Used only for UI visibility.
// Backend permissions remain authoritative.
// =========================================================

export const isProjectOwner = (user, author) => {
    if (!user || !author) {
        return false;
    }

    if (
        user.id != null &&
        author.id != null
    ) {
        return (
            String(user.id) ===
            String(author.id)
        );
    }

    if (
        user.username &&
        author.username
    ) {
        return (
            String(user.username) ===
            String(author.username)
        );
    }

    return false;
};

// =========================================================
// PROJECT COLLABORATOR
// =========================================================

export const isProjectCollaborator = (
    user,
    collaborations
) => {
    if (
        user?.id == null ||
        !Array.isArray(collaborations)
    ) {
        return false;
    }

    return collaborations.some((collaboration) => {
        return (
            collaboration?.is_active !== false &&
            collaboration?.user?.id != null &&
            String(collaboration.user.id) ===
                String(user.id)
        );
    });
};
