
export const DEFAULT_SOLUTION_LANGUAGE = "javascript";

export const getSolutionUpdateErrorMessage = (
    error,
    fallback = "Noma’lum xatolik yuz berdi."
) => {
    const data =
        error?.serverData ??
        error?.response?.data;

    if (typeof data === "string" && data.trim()) {
        return data.trim();
    }

    if (data && typeof data === "object") {
        for (const key of [
            "detail",
            "message",
            "error",
            "non_field_errors",
        ]) {
            const value = data[key];

            if (typeof value === "string" && value.trim()) {
                return value.trim();
            }

            if (Array.isArray(value) && value.length) {
                return String(value[0]);
            }
        }

        for (const value of Object.values(data)) {
            if (typeof value === "string" && value.trim()) {
                return value.trim();
            }

            if (Array.isArray(value) && value.length) {
                return String(value[0]);
            }
        }
    }

    return error?.message || fallback;
};

export const getSolutionUpdateLanguageName = (solution) => {
    const language = solution?.language_data;

    if (language?.name) {
        return String(language.name);
    }

    if (
        Array.isArray(language) &&
        language.length > 0
    ) {
        return language
            .map((item) => item?.name)
            .filter(Boolean)
            .join(", ") || "JavaScript";
    }

    if (solution?.language_name) {
        return String(solution.language_name);
    }

    if (typeof solution?.language === "string") {
        return solution.language;
    }

    if (solution?.language?.name) {
        return String(solution.language.name);
    }

    return "JavaScript";
};

export const getSolutionUpdatePrismLanguage = (name) => {
    if (!name) return DEFAULT_SOLUTION_LANGUAGE;

    const value = String(name).trim().toLowerCase();

    if (
        value === "tsx" ||
        (value.includes("typescript") &&
            value.includes("react"))
    ) {
        return "tsx";
    }

    if (value.includes("react") || value === "jsx") {
        return "jsx";
    }

    if (
        value.includes("typescript") ||
        value === "ts"
    ) {
        return "typescript";
    }

    if (
        value.includes("javascript") ||
        ["js", "node", "nodejs", "node.js"].includes(value)
    ) {
        return "javascript";
    }

    if (
        ["python", "django", "fastapi", "flask", "py", "drf"]
            .some((part) => value.includes(part))
    ) {
        return "python";
    }

    if (value.includes("html") || value === "markup") {
        return "markup";
    }

    if (
        value.includes("css") ||
        value.includes("tailwind") ||
        value.includes("bootstrap")
    ) {
        return "css";
    }

    if (value === "java") return "java";
    if (value === "c") return "c";

    if (
        value === "cpp" ||
        value.includes("c++") ||
        value === "c plus plus"
    ) {
        return "cpp";
    }

    if (
        value === "csharp" ||
        value.includes("c#") ||
        value === ".net"
    ) {
        return "csharp";
    }

    if (
        ["postgres", "mysql", "sqlite", "sql", "mariadb"]
            .some((part) => value.includes(part))
    ) {
        return "sql";
    }

    if (
        value.includes("php") ||
        value.includes("laravel")
    ) {
        return "php";
    }

    if (
        ["bash", "shell", "linux", "ubuntu"]
            .some((part) => value.includes(part))
    ) {
        return "bash";
    }

    if (value === "json") return "json";

    if (value === "go" || value === "golang") {
        return "go";
    }

    if (value === "rust") return "rust";

    return DEFAULT_SOLUTION_LANGUAGE;
};

export const validateSolutionUpdate = ({
    answer,
    description,
}) => {
    const shortText = String(answer ?? "").trim();
    const detailText = String(description ?? "").trim();

    if (!shortText) {
        return "Qisqa ma’lumotni kiriting.";
    }

    if (shortText.length < 5) {
        return "Qisqa ma’lumot kamida 5 ta belgidan iborat bo‘lishi kerak.";
    }

    if (shortText.length > 255) {
        return "Qisqa ma’lumot 255 ta belgidan oshmasligi kerak.";
    }

    if (!detailText) {
        return "Yechim tavsifini kiriting.";
    }

    if (detailText.length < 15) {
        return "Yechimni biroz batafsilroq tushuntiring.";
    }

    return null;
};
