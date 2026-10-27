
 // src/components/profile/edit/profileEditUtils.js

// ============================================================
// INITIAL FORM DATA
// ============================================================

export const INITIAL_PROFILE_FORM = Object.freeze({
    first_name: "",
    last_name: "",
    email: "",
    birthday: "",
    address: "",
    about_me: "",
    skill_level: "beginner",
    skills: "",
    company: "",
    position: "",
    website_url: "",
    github_url: "",
});

const FIELD_NAMES = Object.keys(INITIAL_PROFILE_FORM);

const FIELD_LABELS = {
    first_name: "Ism",
    last_name: "Familiya",
    email: "Email",
    birthday: "Tug‘ilgan sana",
    address: "Manzil",
    about_me: "Men haqimda",
    skill_level: "Tajriba darajasi",
    skills: "Ko‘nikmalar",
    company: "Kompaniya",
    position: "Lavozim",
    website_url: "Veb-sayt",
    github_url: "GitHub",
    image: "Profil rasmi",
};

const MAX_LENGTHS = {
    first_name: 150,
    last_name: 150,
    email: 254,
    address: 100,
    about_me: 255,
    company: 100,
    position: 50,
    website_url: 200,
    github_url: 200,
};

const SKILL_LEVELS = new Set([
    "beginner",
    "junior",
    "intermediate",
    "advanced",
    "senior",
    "lead",
    "expert",
]);

const asText = (value) =>
    value === null || value === undefined
        ? ""
        : String(value);

// ============================================================
// DATE NORMALIZATION
// ============================================================

export function normalizeDateForInput(value) {
    if (!value) return "";

    if (
        value instanceof Date &&
        !Number.isNaN(value.getTime())
    ) {
        const year = value.getFullYear();

        const month = String(
            value.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            value.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    // Keep the calendar date without UTC conversion.
    const match = asText(value).match(
        /^(\d{4}-\d{2}-\d{2})(?:T|$)/
    );

    return match ? match[1] : "";
}

// ============================================================
// SKILLS NORMALIZATION
// ============================================================

export function normalizeSkillsForInput(skills) {
    if (Array.isArray(skills)) {
        return skills
            .map((item) =>
                typeof item === "string"
                    ? item
                    : item?.name ?? item?.title ?? ""
            )
            .map((name) => asText(name).trim())
            .filter(Boolean)
            .join(", ");
    }

    return asText(skills);
}

export function parseProfileSkills(value) {
    const entries = normalizeSkillsForInput(
        value
    ).split(",");

    const unique = new Set();
    const skills = [];

    for (const entry of entries) {
        const name = entry.trim();
        const key = name.toLocaleLowerCase();

        if (!name || unique.has(key)) {
            continue;
        }

        unique.add(key);
        skills.push(name);
    }

    return skills;
}

// ============================================================
// PROFILE DATA NORMALIZATION
// ============================================================

export function normalizeProfileFormData(profile = {}) {
    const result = {
        ...INITIAL_PROFILE_FORM,
    };

    for (const key of FIELD_NAMES) {
        if (key === "birthday") {
            result.birthday = normalizeDateForInput(
                profile.birthday || profile.birth_date
            );
        } else if (key === "skills") {
            result.skills = normalizeSkillsForInput(
                profile.skills
            );
        } else if (key === "skill_level") {
            result.skill_level = asText(
                profile.skill_level || "beginner"
            );
        } else {
            result[key] = asText(profile[key]);
        }
    }

    return result;
}

// ============================================================
// WEBSITE URL
// ============================================================

const hasScheme = (value) =>
    /^[a-z][a-z\d+.-]*:/i.test(value);

export function normalizeWebsiteUrl(value) {
    const raw = asText(value).trim();

    if (!raw) return "";

    const candidate = hasScheme(raw)
        ? raw
        : `https://${raw}`;

    let parsed;

    try {
        parsed = new URL(candidate);
    } catch {
        throw new Error(
            "To‘g‘ri veb-sayt manzilini kiriting."
        );
    }

    if (
        !["http:", "https:"].includes(parsed.protocol) ||
        !parsed.hostname ||
        parsed.username ||
        parsed.password
    ) {
        throw new Error(
            "Veb-sayt faqat http:// yoki " +
            "https:// bo‘lishi mumkin."
        );
    }

    return parsed.href;
}

// ============================================================
// GITHUB URL
// ============================================================

export function normalizeGithubUrl(value) {
    let raw = asText(value).trim();

    if (!raw) return "";

    if (raw.startsWith("@")) {
        raw = raw.slice(1);
    }

    // GitHub username -> full URL.
    if (
        /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/.test(
            raw
        )
    ) {
        return `https://github.com/${raw}`;
    }

    // github.com/username -> full URL.
    if (/^(?:www\.)?github\.com\//i.test(raw)) {
        raw = `https://${raw}`;
    }

    let parsed;

    try {
        parsed = new URL(raw);
    } catch {
        throw new Error(
            "GitHub username yoki " +
            "github.com/username kiriting."
        );
    }

    if (
        !["http:", "https:"].includes(parsed.protocol) ||
        !["github.com", "www.github.com"].includes(
            parsed.hostname.toLowerCase()
        ) ||
        !parsed.pathname.split("/").filter(Boolean).length ||
        parsed.username ||
        parsed.password
    ) {
        throw new Error(
            "Faqat haqiqiy GitHub profil " +
            "havolasini kiriting."
        );
    }

    const path = parsed.pathname.replace(/\/+$/, "");

    return `https://github.com${path}`;
}

// ============================================================
// DATE VALIDATION
// ============================================================

function validDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const [year, month, day] = value
        .split("-")
        .map(Number);

    const date = new Date(
        year,
        month - 1,
        day
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
        year >= 1900 &&
        date.getFullYear() === year &&
        date.getMonth() + 1 === month &&
        date.getDate() === day &&
        date <= today
    );
}

// ============================================================
// FORM VALIDATION
// ============================================================

export function validateProfileForm(
    formData,
    {
        profileImageFile = null,
    } = {}
) {
    const values = normalizeProfileFormData(formData);

    const errors = {};

    // --------------------------------------------------------
    // MAX LENGTHS
    // --------------------------------------------------------

    for (const [key, max] of Object.entries(MAX_LENGTHS)) {
        if (asText(values[key]).trim().length > max) {
            errors[key] =
                `${FIELD_LABELS[key]} ${max} ta ` +
                "belgidan oshmasligi kerak.";
        }
    }

    // --------------------------------------------------------
    // EMAIL
    // --------------------------------------------------------

    if (
        values.email.trim() &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            values.email.trim()
        )
    ) {
        errors.email =
            "Email manzilini to‘g‘ri kiriting.";
    }

    // --------------------------------------------------------
    // BIRTHDAY
    // --------------------------------------------------------

    if (
        values.birthday &&
        !validDate(values.birthday)
    ) {
        errors.birthday =
            "Tug‘ilgan sanani to‘g‘ri kiriting. " +
            "Kelajakdagi sana mumkin emas.";
    }

    // --------------------------------------------------------
    // EXPERIENCE LEVEL
    // --------------------------------------------------------

    if (!SKILL_LEVELS.has(values.skill_level)) {
        errors.skill_level =
            "Ro‘yxatdan tajriba darajasini tanlang.";
    }

    // --------------------------------------------------------
    // SKILLS
    // --------------------------------------------------------

    if (
        parseProfileSkills(values.skills).some(
            (skill) => skill.length > 100
        )
    ) {
        errors.skills =
            "Har bir ko‘nikma 100 ta belgidan " +
            "oshmasligi kerak.";
    }

    // --------------------------------------------------------
    // LINKS
    // --------------------------------------------------------

    for (const [key, normalizer] of [
        ["website_url", normalizeWebsiteUrl],
        ["github_url", normalizeGithubUrl],
    ]) {
        if (!values[key] || errors[key]) {
            continue;
        }

        try {
            const normalized = normalizer(values[key]);

            if (normalized.length > MAX_LENGTHS[key]) {
                errors[key] =
                    `${FIELD_LABELS[key]} manzili juda uzun.`;
            }
        } catch (error) {
            errors[key] = error.message;
        }
    }

    // --------------------------------------------------------
    // AVATAR
    // --------------------------------------------------------

    if (profileImageFile) {
        const allowed = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowed.includes(profileImageFile.type)) {
            errors.image =
                "Faqat JPG, PNG yoki WEBP rasm tanlang.";
        } else if (
            profileImageFile.size <= 0 ||
            profileImageFile.size > 5 * 1024 * 1024
        ) {
            errors.image =
                "Rasm hajmi 5 MB dan oshmasligi " +
                "va bo‘sh bo‘lmasligi kerak.";
        }
    }

    return errors;
}

// ============================================================
// DIRTY CHECK
// ============================================================

const normalizedForCompare = (key, value) => {
    if (key === "skills") {
        return parseProfileSkills(value)
            .map((skill) => skill.toLocaleLowerCase())
            .sort()
            .join("\u0000");
    }

    if (key === "birthday") {
        return normalizeDateForInput(value);
    }

    if (
        key === "website_url" ||
        key === "github_url"
    ) {
        try {
            const normalize =
                key === "website_url"
                    ? normalizeWebsiteUrl
                    : normalizeGithubUrl;

            return normalize(value);
        } catch {
            return asText(value).trim();
        }
    }

    return asText(value).trim();
};

// ============================================================
// TEXT CHANGES
// ============================================================

export function hasProfileTextChanges(
    formData,
    initialData
) {
    const current = normalizeProfileFormData(formData);
    const initial = normalizeProfileFormData(initialData);

    return FIELD_NAMES.some(
        (key) =>
            normalizedForCompare(key, current[key]) !==
            normalizedForCompare(key, initial[key])
    );
}

// ============================================================
// ALL CHANGES INCLUDING AVATAR
// ============================================================

export function hasProfileChanges({
    formData,
    initialData,
    profileImageFile = null,
    removeProfileImage = false,
}) {
    return (
        Boolean(
            profileImageFile || removeProfileImage
        ) ||
        hasProfileTextChanges(formData, initialData)
    );
}

// ============================================================
// BUILD BACKEND PAYLOADS
// ============================================================
//
// JSON:
//   first_name, last_name, skills[], birthday, etc.
//
// FormData:
//   image only
//
// Separating them allows skills: [] to reach DRF correctly.
// ============================================================

export function buildProfilePayload({
    formData,
    profileImageFile = null,
    removeProfileImage = false,
}) {
    const values = normalizeProfileFormData(formData);

    const profilePayload = {};

    for (const key of FIELD_NAMES) {
        if (key === "skills") {
            profilePayload.skills = parseProfileSkills(
                values.skills
            );
        } else if (key === "birthday") {
            profilePayload.birthday =
                values.birthday || null;
        } else if (key === "website_url") {
            profilePayload.website_url =
                normalizeWebsiteUrl(values.website_url);
        } else if (key === "github_url") {
            profilePayload.github_url =
                normalizeGithubUrl(values.github_url);
        } else {
            profilePayload[key] =
                asText(values[key]).trim();
        }
    }

    let imagePayload = null;

    if (profileImageFile || removeProfileImage) {
        imagePayload = new FormData();

        if (profileImageFile) {
            imagePayload.append(
                "image",
                profileImageFile
            );
        } else {
            imagePayload.append("image", "");
        }
    }

    return {
        profilePayload,
        imagePayload,
    };
}

// ============================================================
// SERVER ERROR TEXT
// ============================================================

const serverErrorText = (value) => {
    if (typeof value === "string") {
        return value.trim();
    }

    if (Array.isArray(value)) {
        return value
            .map(serverErrorText)
            .filter(Boolean)
            .join(" ");
    }

    if (value && typeof value === "object") {
        return Object.values(value)
            .map(serverErrorText)
            .filter(Boolean)
            .join(" ");
    }

    return value === null || value === undefined
        ? ""
        : String(value);
};

// ============================================================
// DRF / AXIOS ERROR NORMALIZATION
// ============================================================

export function getProfileErrorDetails(
    error,
    fallback = "Profilni saqlashda xatolik yuz berdi."
) {
    let data =
        error?.serverData ??
        error?.response?.data;

    if (
        !data &&
        typeof error?.message === "string"
    ) {
        try {
            data = JSON.parse(error.message);
        } catch {
            // Non-JSON Axios error.
        }
    }

    const status = error?.response?.status;

    // Do not show HTML error pages or internal 5xx details.
    if (
        typeof data === "string" &&
        /^\s*(?:<!doctype|<html)/i.test(data)
    ) {
        data = null;
    }

    if (status >= 500) {
        data = null;
    }

    const fieldErrors = {};
    let general = "";

    if (
        data &&
        typeof data === "object" &&
        !Array.isArray(data)
    ) {
        const entries =
            data.errors &&
            typeof data.errors === "object"
                ? {
                      ...data,
                      ...data.errors,
                  }
                : data;

        for (const [name, value] of Object.entries(entries)) {
            const message = serverErrorText(value);

            if (!message) continue;

            const field = name.replace(
                /\[\d+\].*$/,
                ""
            );

            if (FIELD_LABELS[field]) {
                fieldErrors[field] = message;
            } else if (
                [
                    "detail",
                    "message",
                    "non_field_errors",
                    "error",
                ].includes(name)
            ) {
                general ||= message;
            }
        }
    } else {
        general = serverErrorText(data);
    }

    const firstField =
        Object.keys(fieldErrors)[0];

    let message =
        general ||
        (
            firstField
                ? `${FIELD_LABELS[firstField]}: ${fieldErrors[firstField]}`
                : ""
        );

    if (!message) {
        if (status === 401) {
            message =
                "Sessiya tugagan. Qayta tizimga kiring.";
        } else if (status === 403) {
            message =
                "Profilni tahrirlashga ruxsat berilmadi.";
        } else if (status === 404) {
            message =
                "Profil topilmadi. Sahifani yangilang.";
        } else if (status === 413) {
            message =
                "Yuklangan rasm server uchun juda katta.";
        } else if (status === 429) {
            message =
                "So‘rovlar juda ko‘p. Birozdan keyin urinib ko‘ring.";
        } else if (status >= 500) {
            message =
                "Serverda xatolik yuz berdi. " +
                "Keyinroq qayta urinib ko‘ring.";
        } else if (
            !error?.response &&
            (
                error?.code === "ERR_NETWORK" ||
                error?.message === "Network Error"
            )
        ) {
            message =
                "Server bilan bog‘lanib bo‘lmadi. " +
                "Internetni tekshiring.";
        } else {
            message = fallback;
        }
    }

    return {
        message,
        fieldErrors,
    };
}

// ============================================================
// SIMPLE ERROR MESSAGE
// ============================================================

export const getProfileErrorMessage = (
    error,
    fallback
) =>
    getProfileErrorDetails(
        error,
        fallback
    ).message;
