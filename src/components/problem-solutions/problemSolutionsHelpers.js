
import UserImage from "../../assests/userImage.jpeg";
import timeAgo from "../../utils/timeAgo";

const BACKEND_URL = (
    process.env.REACT_APP_BACKEND_URL ||
    "http://127.0.0.1:8000"
).replace(/\/+$/, "");

// =========================================================
// NORMALIZE RESPONSES
// =========================================================

export const normalizeSolutions = (data) => {
    if (Array.isArray(data)) return data;

    if (Array.isArray(data?.results)) {
        return data.results;
    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    if (data?.data && typeof data.data === "object") {
        return [data.data];
    }

    if (
        data &&
        typeof data === "object" &&
        (data.id != null || data.answer != null)
    ) {
        return [data];
    }

    return [];
};

// =========================================================
// ERROR MESSAGE
// =========================================================

const findErrorText = (value, depth = 0) => {
    if (depth > 3 || value == null) return "";

    if (typeof value === "string") {
        return value.trim();
    }

    if (Array.isArray(value)) {
        for (const item of value) {
            const text = findErrorText(item, depth + 1);
            if (text) return text;
        }
        return "";
    }

    if (typeof value === "object") {
        for (const key of [
            "detail",
            "message",
            "error",
            "non_field_errors",
        ]) {
            const text = findErrorText(value[key], depth + 1);
            if (text) return text;
        }

        for (const item of Object.values(value)) {
            const text = findErrorText(item, depth + 1);
            if (text) return text;
        }
    }

    return "";
};

export const getSolutionErrorMessage = (
    error,
    fallback = "Xatolik yuz berdi."
) => {
    return (
        findErrorText(
            error?.serverData ?? error?.response?.data
        ) ||
        findErrorText(error?.message) ||
        fallback
    );
};

// =========================================================
// IMAGE URL
// =========================================================

export const getSolutionImageUrl = (image) => {
    if (typeof image !== "string" || !image.trim()) {
        return UserImage;
    }

    const value = image.trim();

    if (
        /^https?:\/\//i.test(value) ||
        /^blob:/i.test(value) ||
        /^data:image\/(?:png|jpe?g|gif|webp|avif);base64,/i
            .test(value)
    ) {
        return value;
    }

    if (
        /^[a-z][a-z0-9+.-]*:/i.test(value) ||
        value.startsWith("//")
    ) {
        return UserImage;
    }

    return `${BACKEND_URL}${
        value.startsWith("/") ? value : `/${value}`
    }`;
};

export const SOLUTION_DEFAULT_AVATAR = UserImage;

// =========================================================
// LANGUAGE
// =========================================================

export const getSolutionLanguageName = (response) => {
    if (response?.language_name) {
        return String(response.language_name);
    }

    if (response?.language_data?.name) {
        return String(response.language_data.name);
    }

    if (typeof response?.language === "string") {
        return response.language;
    }

    if (response?.language?.name) {
        return String(response.language.name);
    }

    if (Array.isArray(response?.language_data)) {
        const names = response.language_data
            .map((language) => language?.name)
            .filter(Boolean);

        if (names.length) return names.join(", ");
    }

    return "Kod";
};

// =========================================================
// STAR COUNT
// =========================================================

export const getSolutionStarCount = (response) => {
    const value =
        response?.total_stars ??
        response?.stars_count ??
        response?.star ??
        0;

    const count = Number(value);

    return Number.isFinite(count)
        ? Math.max(0, count)
        : 0;
};

// =========================================================
// DATE AND SKILL LEVEL
// =========================================================

export const getSolutionTimeLabel = (value) => {
    if (!value) return "Hozirgina";

    try {
        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "Hozirgina";
        }

        return timeAgo(value) || "Hozirgina";
    } catch {
        return "Hozirgina";
    }
};

export const getSolutionSkillLevel = (level) => {
    if (!level) return "Developer";

    const labels = {
        beginner: "Beginner developer",
        intermediate: "Intermediate developer",
        advanced: "Advanced developer",
        pro: "Pro developer",
        legend: "Legend developer",
    };

    const value = String(level).trim().toLowerCase();

    return (
        labels[value] ||
        `${
            value.charAt(0).toUpperCase() + value.slice(1)
        } developer`
    );
};

// =========================================================
// SORT
//
// Accepted first, newest next, ID as tie-breaker.
// =========================================================

const getTimestamp = (value) => {
    const timestamp = value
        ? new Date(value).getTime()
        : 0;

    return Number.isFinite(timestamp) ? timestamp : 0;
};

export const sortProblemSolutions = (items) => {
    return [...normalizeSolutions(items)].sort((a, b) => {
        const acceptedA = Boolean(a?.is_selected);
        const acceptedB = Boolean(b?.is_selected);

        if (acceptedA !== acceptedB) {
            return Number(acceptedB) - Number(acceptedA);
        }

        const dateDiff =
            getTimestamp(b?.created_at) -
            getTimestamp(a?.created_at);

        if (dateDiff !== 0) return dateDiff;

        return (
            (Number(b?.id) || 0) -
            (Number(a?.id) || 0)
        );
    });
};

// =========================================================
// ID / OWNERSHIP
// =========================================================

export const sameSolutionId = (a, b) =>
    a != null &&
    b != null &&
    String(a) === String(b);

export const isSolutionAuthor = (
    response,
    authUser
) => {
    if (!authUser) return false;

    const responseUser = response?.user ?? {};

    if (
        responseUser.id != null &&
        authUser.id != null
    ) {
        return sameSolutionId(
            responseUser.id,
            authUser.id
        );
    }

    return Boolean(
        authUser.username &&
        responseUser.username &&
        authUser.username === responseUser.username
    );
};

// =========================================================
// COPY CODE
// =========================================================

export const copySolutionCode = async (value) => {
    const text = String(value ?? "");

    if (!text) {
        throw new Error("Nusxalash uchun kod yo‘q.");
    }

    if (
        typeof navigator !== "undefined" &&
        navigator.clipboard?.writeText
    ) {
        try {
            await navigator.clipboard.writeText(text);
            return;
        } catch {
            // Try legacy fallback.
        }
    }

    if (
        typeof document === "undefined" ||
        typeof document.execCommand !== "function"
    ) {
        throw new Error("Clipboard mavjud emas.");
    }

    const textarea = document.createElement("textarea");

    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";

    const previousFocus = document.activeElement;

    try {
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        if (!document.execCommand("copy")) {
            throw new Error("Nusxalash bajarilmadi.");
        }
    } finally {
        textarea.remove();

        if (
            previousFocus &&
            typeof previousFocus.focus === "function" &&
            previousFocus.isConnected
        ) {
            previousFocus.focus();
        }
    }
};
