
import {
    BACKEND_URL,
} from "../../services/config";

// =========================================================
// FSOCIETY — PROJECT HELPERS
//
// Shared helpers for:
//
// - Projects.jsx
// - ProjectsPageCard.jsx
// - ProjectsPagination.jsx
// - Other project components
//
// Existing exports and data contracts preserved.
// =========================================================

// =========================================================
// SAFE NUMBER
//
// Converts values to non-negative finite numbers.
// Invalid values return 0.
// =========================================================

export const safeNumber = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return 0;
    }

    return Math.max(0, number);
};

// =========================================================
// COMPACT NUMBER
//
// Examples:
//
// 0       -> 0
// 950     -> 950
// 1200    -> 1.2K
// 15200   -> 15K
// 2500000 -> 2.5M
// =========================================================

export const formatCompactNumber = (value) => {
    const number = safeNumber(value);

    const formatWithSuffix = (amount, suffix) => {
        const formatted = amount >= 10
            ? amount.toFixed(0)
            : amount.toFixed(1);

        return `${formatted.replace(/\.0$/, "")}${suffix}`;
    };

    if (number >= 999_500_000) {
        return formatWithSuffix(
            number / 1_000_000_000,
            "B"
        );
    }

    if (number >= 999_500) {
        return formatWithSuffix(
            number / 1_000_000,
            "M"
        );
    }

    if (number >= 1_000) {
        return formatWithSuffix(
            number / 1_000,
            "K"
        );
    }

    return String(number);
};

// =========================================================
// ERROR MESSAGE EXTRACTION
//
// Supports:
//
// - String messages
// - Axios response data
// - Django REST Framework errors
// - Validation error arrays
// - Nested error objects
//
// Recursion depth is limited to prevent problematic input.
// =========================================================

const extractErrorText = (value, depth = 0) => {
    if (value == null || depth > 4) {
        return "";
    }

    // =====================================================
    // STRING
    // =====================================================

    if (typeof value === "string") {
        return value.trim();
    }

    // =====================================================
    // ARRAY
    // =====================================================

    if (Array.isArray(value)) {
        return value
            .map((item) => {
                return extractErrorText(
                    item,
                    depth + 1
                );
            })
            .filter(Boolean)
            .join(", ");
    }

    // =====================================================
    // OBJECT
    // =====================================================

    if (typeof value === "object") {
        const preferredKeys = [
            "detail",
            "message",
            "error",
            "non_field_errors",
            "errors",
        ];

        // Try known API error keys first.
        for (const key of preferredKeys) {
            if (value[key] == null) {
                continue;
            }

            const text = extractErrorText(
                value[key],
                depth + 1
            );

            if (text) {
                return text;
            }
        }

        // Django validation errors may be keyed
        // by the field name.
        for (const [key, item] of Object.entries(value)) {
            if (
                preferredKeys.includes(key) ||
                key === "status" ||
                key === "code"
            ) {
                continue;
            }

            const text = extractErrorText(
                item,
                depth + 1
            );

            if (text) {
                return `${key}: ${text}`;
            }
        }
    }

    return "";
};

// =========================================================
// GET ERROR MESSAGE
// =========================================================

export const getErrorMessage = (error) => {
    const fallback =
        "Projectlarni yuklashda xatolik yuz berdi.";

    if (!error) {
        return fallback;
    }

    const candidates = [
        error?.response?.data,
        error?.serverData,
        error?.message,
        error,
    ];

    for (const candidate of candidates) {
        const message = extractErrorText(
            candidate
        );

        if (message) {
            return message;
        }
    }

    return fallback;
};

// =========================================================
// CANCELED REQUEST
//
// Supports AbortController and Axios cancellation.
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
// PROJECT IMAGE URL
//
// Supports:
//
// - Absolute HTTP / HTTPS URLs
// - Relative media paths
// - Blob URLs
// - Data image URLs
// - Protocol-relative URLs
// - Image objects
//
// BACKEND_URL remains the configured backend base.
// =========================================================

export const getProjectImageUrl = (image) => {
    if (!image) {
        return null;
    }

    // =====================================================
    // NORMALIZE IMAGE VALUE
    // =====================================================

    const source =
        typeof image === "object" &&
        !Array.isArray(image)
            ? (
                image.image ||
                image.url ||
                image.src
            )
            : image;

    if (typeof source !== "string") {
        return null;
    }

    const value = source.trim();

    if (!value) {
        return null;
    }

    // =====================================================
    // ABSOLUTE HTTP / HTTPS URL
    // =====================================================

    if (/^https?:\/\//i.test(value)) {
        return value;
    }

    // =====================================================
    // PROTOCOL-RELATIVE URL
    // =====================================================

    if (value.startsWith("//")) {
        return value;
    }

    // =====================================================
    // BLOB URL
    // =====================================================

    if (/^blob:/i.test(value)) {
        return value;
    }

    // =====================================================
    // DATA IMAGE URL
    // =====================================================

    if (/^data:image\//i.test(value)) {
        return value;
    }

    // =====================================================
    // REJECT UNKNOWN URL SCHEMES
    // =====================================================

    if (/^[a-z][a-z0-9+.-]*:/i.test(value)) {
        return null;
    }

    // =====================================================
    // BACKEND BASE URL
    // =====================================================

    const base = String(
        BACKEND_URL || ""
    )
        .trim()
        .replace(/\/+$/, "");

    // =====================================================
    // PATH
    // =====================================================

    const cleanPath = value.replace(
        /^\/+/,
        ""
    );

    if (!cleanPath) {
        return null;
    }

    if (!base) {
        return `/${cleanPath}`;
    }

    return `${base}/${cleanPath}`;
};

// =========================================================
// PROMOTION STATUS
//
// A project is promoted when:
//
// - is_promoted is true
// - no expiration is specified, OR
// - the expiration date is in the future
//
// Existing invalid-date fallback is preserved.
// =========================================================

export const isProjectPromoted = (project) => {
    if (!project?.is_promoted) {
        return false;
    }

    const expiration =
        project?.promotion_expires_at;

    if (!expiration) {
        return true;
    }

    const expiresAt = new Date(
        expiration
    ).getTime();

    if (!Number.isFinite(expiresAt)) {
        return Boolean(
            project.is_promoted
        );
    }

    return expiresAt > Date.now();
};

// =========================================================
// TEXT TRUNCATION
//
// Preserves the previous default maximum of 125 chars.
// =========================================================

export const truncateText = (
    value,
    maxLength = 125
) => {
    const fallback =
        "Loyiha haqida batafsil ma’lumot hali kiritilmagan.";

    if (value == null) {
        return fallback;
    }

    const text = String(value).trim();

    if (!text) {
        return fallback;
    }

    const requestedLength = Number(
        maxLength
    );

    const limit = Number.isFinite(
        requestedLength
    )
        ? Math.max(
            1,
            Math.trunc(requestedLength)
        )
        : 125;

    if (text.length <= limit) {
        return text;
    }

    return `${text.slice(0, limit).trimEnd()}...`;
};

// =========================================================
// PROJECT DATE
//
// Formats dates using the Uzbek locale.
// Returns an empty string for missing / invalid dates.
// =========================================================

export const formatProjectDate = (value) => {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (!Number.isFinite(date.getTime())) {
        return "";
    }

    return date.toLocaleDateString(
        "uz-UZ",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
};

// =========================================================
// PROJECT STACK
//
// Legacy helper returning technology names.
//
// Supports:
//
// - language_data
// - technology_data
// - languages_data
// - technologies_data
//
// Removes duplicate names.
// Preserves the previous maximum of 4 items.
//
// Note:
// Colored stack metadata is handled separately by
// ProjectsPageCard.jsx.
// =========================================================

export const getProjectStack = (project) => {
    const result = [];

    const addedNames = new Set();

    // =====================================================
    // ADD STACK ITEM
    // =====================================================

    const addItem = (item) => {
        if (!item) {
            return;
        }

        // ================================================
        // ARRAY
        // ================================================

        if (Array.isArray(item)) {
            item.forEach(addItem);

            return;
        }

        // ================================================
        // STRING / OBJECT
        // ================================================

        const name =
            typeof item === "string"
                ? item.trim()
                : String(
                    item?.name ||
                    item?.title ||
                    ""
                ).trim();

        if (!name) {
            return;
        }

        // ================================================
        // DEDUPLICATION
        // ================================================

        const key = name.toLowerCase();

        if (addedNames.has(key)) {
            return;
        }

        addedNames.add(key);

        result.push(name);
    };

    // =====================================================
    // PRIMARY LANGUAGE
    // =====================================================

    addItem(
        project?.language_data
    );

    // =====================================================
    // PRIMARY TECHNOLOGY
    // =====================================================

    addItem(
        project?.technology_data
    );

    // =====================================================
    // ADDITIONAL LANGUAGES
    // =====================================================

    addItem(
        project?.languages_data
    );

    // =====================================================
    // ADDITIONAL TECHNOLOGIES
    // =====================================================

    addItem(
        project?.technologies_data
    );

    // =====================================================
    // PRESERVE LEGACY RESULT LIMIT
    // =====================================================

    return result.slice(0, 4);
};

// =========================================================
// PAGINATION ITEMS
//
// Examples:
//
// total <= 7:
// [1, 2, 3, 4, 5]
//
// total = 20, current = 2:
// [1, 2, 3, 4, 5, "...", 20]
//
// total = 20, current = 10:
// [1, "...", 9, 10, 11, "...", 20]
//
// total = 20, current = 19:
// [1, "...", 16, 17, 18, 19, 20]
//
// The ellipsis keys remain:
// - left-ellipsis
// - right-ellipsis
// =========================================================

export const getPaginationItems = (
    currentPage,
    totalPages
) => {
    // =====================================================
    // SAFE PAGE VALUES
    // =====================================================

    const total = Math.max(
        0,
        Math.trunc(
            Number(totalPages) || 0
        )
    );

    if (total === 0) {
        return [];
    }

    const current = Math.min(
        total,
        Math.max(
            1,
            Math.trunc(
                Number(currentPage) || 1
            )
        )
    );

    // =====================================================
    // SMALL PAGE COUNT
    // =====================================================

    if (total <= 7) {
        return Array.from(
            { length: total },
            (_, index) => index + 1
        );
    }

    // =====================================================
    // DETERMINE VISIBLE RANGE
    // =====================================================

    let start;
    let end;

    if (current <= 4) {
        // Near the beginning.
        start = 2;
        end = 5;
    } else if (current >= total - 3) {
        // Near the end.
        start = total - 4;
        end = total - 1;
    } else {
        // Middle pages.
        start = current - 1;
        end = current + 1;
    }

    // =====================================================
    // FIRST PAGE
    // =====================================================

    const pages = [1];

    // =====================================================
    // LEFT GAP
    // =====================================================

    if (start > 2) {
        if (start === 3) {
            // Only page 2 is missing.
            pages.push(2);
        } else {
            pages.push("left-ellipsis");
        }
    }

    // =====================================================
    // MIDDLE PAGES
    // =====================================================

    for (
        let page = start;
        page <= end;
        page += 1
    ) {
        pages.push(page);
    }

    // =====================================================
    // RIGHT GAP
    // =====================================================

    if (end < total - 1) {
        if (end === total - 2) {
            // Only one page is missing.
            pages.push(total - 1);
        } else {
            pages.push("right-ellipsis");
        }
    }

    // =====================================================
    // LAST PAGE
    // =====================================================

    pages.push(total);

    return pages;
};
