
// =========================================================
// FSOCIETY — PROBLEM SOLUTION FORM HELPERS
// =========================================================

export const DEFAULT_EDITOR_LANGUAGE = "javascript";
export const DEFAULT_CODE = "";

// =========================================================
// NORMALIZE API LANGUAGE RESPONSE
// =========================================================

export const normalizeSolutionLanguages = (response) => {
    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.results)) {
        return response.results;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    if (Array.isArray(response?.data?.results)) {
        return response.data.results;
    }

    return [];
};

// =========================================================
// LANGUAGE NAME -> PRISM LANGUAGE
// =========================================================

export const getSolutionPrismLanguage = (name) => {
    if (!name) return DEFAULT_EDITOR_LANGUAGE;

    const value = String(name).trim().toLowerCase();

    if (
        value === "tsx" ||
        value === "react typescript" ||
        value === "react + typescript"
    ) {
        return "tsx";
    }

    if (
        ["react", "react.js", "reactjs", "jsx"].includes(value)
    ) {
        return "jsx";
    }

    if (["typescript", "ts"].includes(value)) {
        return "typescript";
    }

    if (
        [
            "javascript", "js", "node", "node.js",
            "nodejs", "express", "express.js",
        ].includes(value)
    ) {
        return "javascript";
    }

    if (
        [
            "python", "py", "django", "drf",
            "django rest framework", "fastapi", "flask",
        ].includes(value)
    ) {
        return "python";
    }

    if (["html", "html5", "markup"].includes(value)) {
        return "markup";
    }

    if (
        [
            "css", "css3", "tailwind",
            "tailwindcss", "bootstrap",
        ].includes(value)
    ) {
        return "css";
    }

    if (value === "java") return "java";
    if (value === "c") return "c";

    if (
        ["c++", "cpp", "c plus plus"].includes(value)
    ) {
        return "cpp";
    }

    if (
        ["c#", "csharp", "c sharp", ".net", "dotnet"]
            .includes(value)
    ) {
        return "csharp";
    }

    if (
        [
            "sql", "mysql", "postgresql", "postgres",
            "sqlite", "sqlite3", "mariadb",
        ].includes(value)
    ) {
        return "sql";
    }

    if (["php", "laravel"].includes(value)) {
        return "php";
    }

    if (
        [
            "bash", "shell", "linux",
            "ubuntu", "terminal",
        ].includes(value)
    ) {
        return "bash";
    }

    if (value === "json") return "json";
    if (["go", "golang"].includes(value)) return "go";
    if (value === "rust") return "rust";

    return "clike";
};

// =========================================================
// EDITOR FILE NAME
// =========================================================

export const getSolutionEditorFileName = (language) => {
    const files = {
        javascript: "solution.js",
        jsx: "solution.jsx",
        typescript: "solution.ts",
        tsx: "solution.tsx",
        python: "solution.py",
        markup: "solution.html",
        css: "solution.css",
        java: "Solution.java",
        c: "solution.c",
        cpp: "solution.cpp",
        csharp: "Solution.cs",
        sql: "solution.sql",
        php: "solution.php",
        bash: "solution.sh",
        json: "solution.json",
        go: "solution.go",
        rust: "solution.rs",
        clike: "solution.code",
    };

    return files[language] || "solution.code";
};

// =========================================================
// API ERROR MESSAGE
// =========================================================

export const getSolutionFormErrorMessage = (
    error,
    fallback = "Yechimni yuborishda xatolik yuz berdi."
) => {
    const data =
        error?.serverData ??
        error?.response?.data;

    if (typeof data === "string" && data.trim()) {
        return data.trim();
    }

    if (data && typeof data === "object") {
        const labels = {
            answer: "Qisqa yechim",
            description: "Tavsif",
            code: "Kod",
            language: "Dasturlash tili",
            language_name: "Dasturlash tili",
        };

        for (const key of ["detail", "message", "error"]) {
            const value = data[key];

            if (typeof value === "string" && value.trim()) {
                return value.trim();
            }

            if (Array.isArray(value) && value.length) {
                return String(value[0]);
            }
        }

        for (const [key, value] of Object.entries(data)) {
            const label = labels[key] || key;

            if (Array.isArray(value) && value.length) {
                return `${label}: ${value[0]}`;
            }

            if (typeof value === "string" && value.trim()) {
                return `${label}: ${value}`;
            }
        }
    }

    return error?.message || fallback;
};

// =========================================================
// SAFE IDENTIFIER
// =========================================================

export const hasSolutionFormId = (value) =>
    value !== null &&
    value !== undefined &&
    String(value).trim() !== "";

// =========================================================
// FORM VALIDATION
// =========================================================

export const validateProblemSolutionForm = ({
    shortInfo,
    description,
    selectedLanguage,
}) => {
    const answer = String(shortInfo ?? "").trim();
    const details = String(description ?? "").trim();

    if (!answer) {
        return "Yechimning qisqa ma’lumotini kiriting.";
    }

    if (answer.length < 5) {
        return "Qisqa yechim kamida 5 ta belgidan iborat bo‘lishi kerak.";
    }

    if (answer.length > 255) {
        return "Qisqa yechim 255 ta belgidan oshmasligi kerak.";
    }

    if (!details) {
        return "Yechim tavsifini kiriting.";
    }

    if (details.length < 15) {
        return "Yechimni biroz batafsilroq tushuntiring.";
    }

    if (!hasSolutionFormId(selectedLanguage?.id)) {
        return "Yechim qaysi dasturlash tilida ekanini tanlang.";
    }

    return null;
};

// =========================================================
// PROGRESS STATUS
// =========================================================

export const getProblemSolutionFormStatus = ({
    shortInfo,
    description,
    code,
    selectedLanguage,
}) => {
    const answerLength = String(shortInfo ?? "").trim().length;

    const answerReady =
        answerLength >= 5 && answerLength <= 255;

    const descriptionReady =
        String(description ?? "").trim().length >= 15;

    const languageReady =
        hasSolutionFormId(selectedLanguage?.id);

    const codeReady =
        String(code ?? "").trim().length > 0;

    const completed = [
        answerReady,
        descriptionReady,
        languageReady,
    ].filter(Boolean).length;

    return {
        answerReady,
        descriptionReady,
        languageReady,
        codeReady,
        percent: Math.round((completed / 3) * 100),
        ready:
            answerReady &&
            descriptionReady &&
            languageReady,
    };
};
