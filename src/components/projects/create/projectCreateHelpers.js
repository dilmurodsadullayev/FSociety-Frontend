
import { BACKEND_URL } from "../../../services/config";

// =========================================================
// CONSTANTS
// =========================================================

export const MAX_PROJECT_IMAGES = 4;

export const DEFAULT_STACK_COLOR = "#64748B";

export const EMPTY_PROJECT_FORM = {
    name: "",
    main_features: "",
    description: "",
    website_url: "",
};

const HEX_COLOR_REGEX = /^#[0-9a-fA-F]{6}$/;

const IMAGE_EXTENSION_REGEX = /\.(jpg|jpeg|png|webp)$/i;

// =========================================================
// MEDIA URL
//
// Supports:
// - Absolute HTTP(S) URLs
// - Blob URLs
// - Data URLs
// - Relative backend media paths
//
// Existing images use BACKEND_URL.
// =========================================================

export const getMediaUrl = (value) => {
    if (!value) {
        return "";
    }

    const image = String(value).trim();

    if (
        /^https?:\/\//i.test(image) ||
        image.startsWith("blob:") ||
        image.startsWith("data:")
    ) {
        return image;
    }

    const base = String(
        BACKEND_URL || ""
    ).replace(/\/+$/, "");

    return `${base}${
        image.startsWith("/")
            ? image
            : `/${image}`
    }`;
};

// =========================================================
// STACK COLOR
//
// Keep the original backend color behavior.
// =========================================================

export const getStackColor = (item) => {
    const color = item?.color;

    if (
        typeof color === "string" &&
        HEX_COLOR_REGEX.test(color)
    ) {
        return color;
    }

    return DEFAULT_STACK_COLOR;
};

export const withAlpha = (color, alpha = "20") => {
    const safeColor = HEX_COLOR_REGEX.test(
        String(color || "")
    )
        ? color
        : DEFAULT_STACK_COLOR;

    const safeAlpha = /^[0-9a-fA-F]{2}$/.test(
        String(alpha)
    )
        ? alpha
        : "20";

    return `${safeColor}${safeAlpha}`;
};

// =========================================================
// NORMALIZE STACK CATALOG
//
// API:
// ProjectService.getStackCatalog()
//
// Supports catalog entries as:
// - Strings
// - Objects
//
// Preserves:
// - id
// - name
// - color
// - category
// - languages
// - Other backend fields
// =========================================================

export const normalizeCatalog = (items) => {
    if (!Array.isArray(items)) {
        return [];
    }

    return items
        .filter(Boolean)
        .map((item, index) => {
            if (typeof item === "string") {
                return {
                    id: item,
                    name: item,
                    color: DEFAULT_STACK_COLOR,
                    _key: `${item}-${index}`,
                };
            }

            return {
                ...item,

                id:
                    item.id ??
                    `${item.name || "stack"}-${index}`,

                name:
                    item.name ||
                    item.title ||
                    "Noma’lum",

                color: getStackColor(item),
            };
        });
};

// =========================================================
// NORMALIZE IDS
//
// Accepts:
//
// [1, 2]
// ["1", "2"]
// [{ id: 1 }, { id: 2 }]
//
// Returns unique string IDs.
//
// This preserves the comparison logic used by
// the existing CreateProjectModal.
// =========================================================

export const normalizeIds = (items) => {
    if (!Array.isArray(items)) {
        return [];
    }

    const ids = items
        .map((item) => {
            if (
                item &&
                typeof item === "object"
            ) {
                return item.id;
            }

            return item;
        })
        .filter(
            (value) =>
                value !== null &&
                value !== undefined &&
                value !== ""
        )
        .map(String);

    return [...new Set(ids)];
};

// =========================================================
// GET INITIAL LANGUAGE IDS
//
// Edit mode compatibility:
//
// - languages_data
// - languages
// - language_data
// - language as object
// - language as ID
// =========================================================

export const getInitialLanguageIds = (data) => {
    if (!data) {
        return [];
    }

    if (
        Array.isArray(data.languages_data) &&
        data.languages_data.length > 0
    ) {
        return normalizeIds(
            data.languages_data
        );
    }

    if (
        Array.isArray(data.languages) &&
        data.languages.length > 0
    ) {
        return normalizeIds(data.languages);
    }

    if (
        data.language_data?.id !== null &&
        data.language_data?.id !== undefined
    ) {
        return [
            String(data.language_data.id),
        ];
    }

    if (
        data.language &&
        typeof data.language === "object" &&
        data.language.id !== null &&
        data.language.id !== undefined
    ) {
        return [
            String(data.language.id),
        ];
    }

    if (
        data.language !== null &&
        data.language !== undefined &&
        data.language !== ""
    ) {
        return [String(data.language)];
    }

    return [];
};

// =========================================================
// GET INITIAL TECHNOLOGY IDS
//
// Edit mode compatibility:
//
// - technologies_data
// - technologies
// - technology_data
// - technology as object
// - technology as ID
// =========================================================

export const getInitialTechnologyIds = (data) => {
    if (!data) {
        return [];
    }

    if (
        Array.isArray(data.technologies_data) &&
        data.technologies_data.length > 0
    ) {
        return normalizeIds(
            data.technologies_data
        );
    }

    if (
        Array.isArray(data.technologies) &&
        data.technologies.length > 0
    ) {
        return normalizeIds(
            data.technologies
        );
    }

    if (
        data.technology_data?.id !== null &&
        data.technology_data?.id !== undefined
    ) {
        return [
            String(data.technology_data.id),
        ];
    }

    if (
        data.technology &&
        typeof data.technology === "object" &&
        data.technology.id !== null &&
        data.technology.id !== undefined
    ) {
        return [
            String(data.technology.id),
        ];
    }

    if (
        data.technology !== null &&
        data.technology !== undefined &&
        data.technology !== ""
    ) {
        return [
            String(data.technology),
        ];
    }

    return [];
};

// =========================================================
// TECHNOLOGY LANGUAGE IDS
//
// Technologies may contain:
//
// technology.languages
// technology.language_data
//
// Empty means no language restriction.
// =========================================================

export const getTechnologyLanguageIds = (
    technology
) => {
    if (
        Array.isArray(
            technology?.languages
        )
    ) {
        return normalizeIds(
            technology.languages
        );
    }

    if (
        Array.isArray(
            technology?.language_data
        )
    ) {
        return normalizeIds(
            technology.language_data
        );
    }

    return [];
};

// =========================================================
// TECHNOLOGY / LANGUAGE COMPATIBILITY
//
// Original rules:
//
// 1. Technology without languages is universal.
// 2. When no language is selected, all technologies
//    are considered compatible.
// 3. Otherwise at least one selected language
//    must match.
//
// IMPORTANT:
//
// Filtering selected technologies after a
// language toggle remains in the parent.
// =========================================================

export const technologyMatchesLanguages = (
    technology,
    selectedLanguageIds = []
) => {
    const allowedLanguageIds =
        getTechnologyLanguageIds(
            technology
        );

    if (allowedLanguageIds.length === 0) {
        return true;
    }

    const selectedIds = normalizeIds(
        selectedLanguageIds
    );

    if (selectedIds.length === 0) {
        return true;
    }

    return allowedLanguageIds.some(
        (languageId) =>
            selectedIds.includes(
                String(languageId)
            )
    );
};

// =========================================================
// INITIAL PROJECT FORM
//
// Create mode:
// Empty form.
//
// Edit mode:
// Existing project fields.
//
// The original backend field names are preserved.
// =========================================================

export const getInitialProjectForm = (
    initialData
) => {
    if (!initialData) {
        return {
            ...EMPTY_PROJECT_FORM,
        };
    }

    return {
        name: initialData.name || "",

        main_features:
            initialData.main_features || "",

        description:
            initialData.description || "",

        website_url:
            initialData.website_url || "",
    };
};

// =========================================================
// FORMAT EXISTING IMAGES FOR EDIT
//
// Existing images:
// {
//     id,
//     title,
//     file: null,
//     isNew: false,
//     url
// }
//
// Original image IDs are preserved.
// =========================================================

export const formatImagesForEdit = (
    projectImages
) => {
    if (!Array.isArray(projectImages)) {
        return [];
    }

    return projectImages
        .filter(Boolean)
        .slice(0, MAX_PROJECT_IMAGES)
        .map((image) => ({
            id: image.id,

            title: image.title || "",

            file: null,

            isNew: false,

            url: getMediaUrl(
                image.image || image.url
            ),
        }));
};

// =========================================================
// CREATE LOCAL IMAGE
//
// New images receive:
// - Temporary ID
// - File
// - Default title
// - isNew = true
// - Browser blob preview URL
//
// Blob URL cleanup remains the parent's
// responsibility.
// =========================================================

export const createLocalImage = (
    file,
    index = 0
) => {
    return {
        id:
            `new-${Date.now()}-${index}-${Math.random()
                .toString(36)
                .slice(2, 8)}`,

        title:
            file?.name
                ?.replace(/\.[^.]+$/, "")
                ?.slice(0, 100) || "",

        file,

        isNew: true,

        url: file
            ? URL.createObjectURL(file)
            : "",
    };
};

// =========================================================
// ALLOWED IMAGE
//
// Original formats:
//
// JPG
// JPEG
// PNG
// WEBP
//
// File format validation uses the filename,
// matching the existing modal.
//
// Server-side file validation is still required.
// =========================================================

export const isAllowedImage = (file) => {
    if (!file) {
        return false;
    }

    const fileName = String(
        file.name || ""
    );

    return IMAGE_EXTENSION_REGEX.test(
        fileName
    );
};

// =========================================================
// REVOKE LOCAL IMAGE URL
//
// Call when a local image is no longer needed.
//
// Never revoke:
// - HTTP URL
// - Backend media URL
// - Data URL
// =========================================================

export const revokeLocalImageUrl = (image) => {
    const url = image?.url;

    if (
        typeof url === "string" &&
        url.startsWith("blob:")
    ) {
        URL.revokeObjectURL(url);
    }
};

// =========================================================
// ERROR PARSER
//
// Supports:
//
// - Plain strings
// - DRF detail
// - Field errors
// - Validation arrays
// - JSON-serialized errors
//
// The original specific fields remain supported:
// - languages
// - technologies
// - name
// - images
// =========================================================

const ERROR_FIELD_LABELS = {
    name: "Loyiha nomi",
    main_features: "Asosiy imkoniyatlar",
    description: "Tavsif",
    website_url: "Website URL",
    language: "Dasturlash tili",
    languages: "Dasturlash tillari",
    technology: "Texnologiya",
    technologies: "Texnologiyalar",
    images: "Rasmlar",
    non_field_errors: "Xatolik",
};

const parseErrorValue = (
    value,
    depth = 0
) => {
    if (
        value == null ||
        depth > 6
    ) {
        return "";
    }

    if (typeof value === "string") {
        const text = value.trim();

        if (!text) {
            return "";
        }

        if (
            (text.startsWith("{") &&
                text.endsWith("}")) ||
            (text.startsWith("[") &&
                text.endsWith("]"))
        ) {
            try {
                return parseErrorValue(
                    JSON.parse(text),
                    depth + 1
                );
            } catch {
                return text;
            }
        }

        return text;
    }

    if (
        typeof value === "number" ||
        typeof value === "boolean"
    ) {
        return String(value);
    }

    if (Array.isArray(value)) {
        return value
            .map((item) =>
                parseErrorValue(
                    item,
                    depth + 1
                )
            )
            .filter(Boolean)
            .join("; ");
    }

    if (typeof value === "object") {
        for (const key of [
            "detail",
            "message",
            "non_field_errors",
        ]) {
            if (value[key]) {
                const message =
                    parseErrorValue(
                        value[key],
                        depth + 1
                    );

                if (message) {
                    return message;
                }
            }
        }

        return Object.entries(value)
            .map(([field, fieldErrors]) => {
                const message =
                    parseErrorValue(
                        fieldErrors,
                        depth + 1
                    );

                if (!message) {
                    return "";
                }

                const label =
                    ERROR_FIELD_LABELS[field] ||
                    field;

                return `${label}: ${message}`;
            })
            .filter(Boolean)
            .join("; ");
    }

    return "";
};

export const getErrorMessage = (
    error,
    fallback = "Loyihani saqlashda xatolik yuz berdi."
) => {
    if (!error) {
        return fallback;
    }

    const serverData =
        error?.serverData ??
        error?.response?.data;

    return (
        parseErrorValue(serverData) ||
        parseErrorValue(error?.message) ||
        fallback
    );
};

// =========================================================
// VALIDATE PROJECT FORM
//
// Rules from the original CreateProjectModal:
//
// name:
// - Required
// - Maximum 30
//
// main_features:
// - Required
// - Maximum 150
//
// description:
// - Required
//
// languages:
// - At least one
//
// technologies:
// - At least one
//
// images:
// - Minimum 1
// - Maximum 4
// - Existing or new image must have data
// =========================================================

export const validateProjectForm = ({
    formData,
    selectedLanguageIds = [],
    selectedTechnologyIds = [],
    images = [],
}) => {
    const name = String(
        formData?.name || ""
    ).trim();

    const mainFeatures = String(
        formData?.main_features || ""
    ).trim();

    const description = String(
        formData?.description || ""
    ).trim();

    if (!name) {
        return "Loyiha nomini kiriting.";
    }

    if (name.length > 30) {
        return (
            "Loyiha nomi 30 belgidan " +
            "oshmasligi kerak."
        );
    }

    if (!mainFeatures) {
        return (
            "Loyihaning asosiy " +
            "imkoniyatlarini kiriting."
        );
    }

    if (mainFeatures.length > 150) {
        return (
            "Asosiy imkoniyatlar 150 belgidan " +
            "oshmasligi kerak."
        );
    }

    if (!description) {
        return "Loyiha tavsifini kiriting.";
    }

    if (selectedLanguageIds.length === 0) {
        return (
            "Kamida bitta dasturlash " +
            "tilini tanlang."
        );
    }

    if (selectedTechnologyIds.length === 0) {
        return (
            "Kamida bitta texnologiyani tanlang."
        );
    }

    if (images.length === 0) {
        return (
            "Loyihaning kamida bitta " +
            "rasmi bo‘lishi kerak."
        );
    }

    if (images.length > MAX_PROJECT_IMAGES) {
        return (
            `Bitta loyihaga maksimum ` +
            `${MAX_PROJECT_IMAGES} ta rasm ` +
            `qo‘shish mumkin.`
        );
    }

    const hasInvalidImage = images.some(
        (image) =>
            !image?.file &&
            !image?.url
    );

    if (hasInvalidImage) {
        return (
            "Rasm bloklaridan birida " +
            "fayl mavjud emas."
        );
    }

    return null;
};

// =========================================================
// BUILD PROJECT FORMDATA
//
// IMPORTANT:
// Preserve the backend multipart contract.
//
// Primary fields:
// - name
// - main_features
// - description
// - website_url
//
// Legacy compatibility:
// - language
// - technology
//
// Multiple relations:
// - languages
// - technologies
//
// Images:
// - images[0]image
// - images[0]title
// - images[0]id
//
// Edit mode:
// Existing image IDs are preserved.
// =========================================================

export const buildProjectFormData = ({
    formData,
    selectedLanguageIds = [],
    selectedTechnologyIds = [],
    images = [],
    isEditMode = false,
}) => {
    const projectData = new FormData();

    // =====================================================
    // BASIC FIELDS
    // =====================================================

    projectData.append(
        "name",
        String(formData?.name || "").trim()
    );

    projectData.append(
        "main_features",
        String(
            formData?.main_features || ""
        ).trim()
    );

    projectData.append(
        "description",
        String(
            formData?.description || ""
        ).trim()
    );

    // Send even when empty so an existing URL
    // can be cleared during edit.

    projectData.append(
        "website_url",
        String(
            formData?.website_url || ""
        ).trim()
    );

    // =====================================================
    // PRIMARY STACK
    //
    // Keep original backend compatibility.
    // =====================================================

    if (selectedLanguageIds.length > 0) {
        projectData.append(
            "language",
            selectedLanguageIds[0]
        );
    }

    if (selectedTechnologyIds.length > 0) {
        projectData.append(
            "technology",
            selectedTechnologyIds[0]
        );
    }

    // =====================================================
    // ALL LANGUAGES
    // =====================================================

    selectedLanguageIds.forEach(
        (languageId) => {
            projectData.append(
                "languages",
                languageId
            );
        }
    );

    // =====================================================
    // ALL TECHNOLOGIES
    // =====================================================

    selectedTechnologyIds.forEach(
        (technologyId) => {
            projectData.append(
                "technologies",
                technologyId
            );
        }
    );

    // =====================================================
    // IMAGES
    // =====================================================

    images.forEach((image, index) => {
        // ================================================
        // NEW OR REPLACED IMAGE
        // ================================================

        if (image.file) {
            projectData.append(
                `images[${index}]image`,
                image.file,
                image.file.name
            );

            projectData.append(
                `images[${index}]title`,
                image.title?.trim() ||
                    `Image ${index + 1}`
            );

            // Existing image being replaced.
            // Keep its database ID.

            if (
                isEditMode &&
                !image.isNew &&
                image.id !== null &&
                image.id !== undefined
            ) {
                projectData.append(
                    `images[${index}]id`,
                    image.id
                );
            }

            return;
        }

        // ================================================
        // UNCHANGED EXISTING IMAGE
        //
        // Preserve ID and title during edit.
        // ================================================

        if (
            isEditMode &&
            !image.isNew &&
            image.id !== null &&
            image.id !== undefined
        ) {
            projectData.append(
                `images[${index}]id`,
                image.id
            );

            projectData.append(
                `images[${index}]title`,
                image.title?.trim() ||
                    `Image ${index + 1}`
            );
        }
    });

    return projectData;
};
