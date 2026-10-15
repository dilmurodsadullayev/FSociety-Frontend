
/**
 * FSociety — Project Discussion Helpers
 *
 * Shared utilities for discussion components.
 *
 * No React hooks.
 * No Redux.
 * No direct API calls.
 */

// =========================================================
// CONSTANTS
// =========================================================

export const COMMENT_PREVIEW_LIMIT = 320;

export const EMPTY_COMMENTS = Object.freeze([]);

// =========================================================
// NORMALIZE COMMENTS
//
// Existing API formats:
// [
//   { id: 1, body: "..." }
// ]
//
// {
//   count: 10,
//   results: [...]
// }
// =========================================================

export const normalizeProjectComments = (response) => {
    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.results)) {
        return response.results;
    }

    return EMPTY_COMMENTS;
};

// =========================================================
// ERROR MESSAGE
//
// Supports:
// - Axios errors
// - Django REST Framework errors
// - Field validation errors
// - JSON encoded error messages
// - Plain JavaScript errors
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
                // Not a JSON error; keep original text.
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
            "body",
            "non_field_errors",
            "errors",
        ];

        for (const key of preferredKeys) {
            if (value[key] == null) {
                continue;
            }

            const extracted = extractErrorText(
                value[key],
                depth + 1
            );

            if (extracted) {
                return extracted;
            }
        }

        const ignoredKeys = new Set([
            ...preferredKeys,
            "status",
            "code",
            "config",
            "request",
            "response",
            "stack",
        ]);

        for (const [key, item] of Object.entries(value)) {
            if (ignoredKeys.has(key)) {
                continue;
            }

            const extracted = extractErrorText(
                item,
                depth + 1
            );

            if (extracted) {
                return `${key}: ${extracted}`;
            }
        }
    }

    return "";
};

export const getDiscussionErrorMessage = (
    error,
    fallback = "Xatolik yuz berdi."
) => {
    if (!error) {
        return fallback;
    }

    const candidates = [
        error?.serverData,
        error?.response?.data,
        error?.payload,
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
// GET AUTHOR NAME
//
// Keeps the original priority:
// first_name + last_name -> username -> fallback
// =========================================================

export const getCommentAuthorName = (author) => {
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
        "Foydalanuvchi"
    );
};

// =========================================================
// CHECK COMMENT OWNERSHIP
//
// This is only for UI permissions.
// Backend must still validate edit/delete permissions.
// =========================================================

export const isCommentAuthor = (
    currentUser,
    commentAuthor,
    isLoggedIn
) => {
    if (!isLoggedIn) {
        return false;
    }

    if (
        currentUser?.id == null ||
        commentAuthor?.id == null
    ) {
        return false;
    }

    return (
        String(currentUser.id) ===
        String(commentAuthor.id)
    );
};

// =========================================================
// GET COMMENT PREVIEW
//
// Preserves the original 320-character limit.
// =========================================================

export const getCommentPreview = (
    body,
    expanded = false,
    limit = COMMENT_PREVIEW_LIMIT
) => {
    const text = String(body ?? "");

    if (expanded || text.length <= limit) {
        return text;
    }

    const safeLimit = Number.isFinite(limit)
        ? Math.max(0, Math.floor(limit))
        : COMMENT_PREVIEW_LIMIT;

    return `${text.slice(0, safeLimit).trimEnd()}...`;
};

// =========================================================
// DELETE CONFIRMATION TITLE
//
// Used later by DeleteConfirmationModal.
// =========================================================

export const getCommentDeleteTitle = (
    body,
    limit = 55
) => {
    const text = String(body ?? "").trim();

    if (!text) {
        return "Sharh";
    }

    if (text.length <= limit) {
        return text;
    }

    return `${text.slice(0, limit).trimEnd()}...`;
};
