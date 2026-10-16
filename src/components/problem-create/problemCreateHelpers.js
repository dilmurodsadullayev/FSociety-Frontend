
export const DEFAULT_TAG_COLOR = "#64748B";

export const createEmptyProblemForm = () => ({
    problemTitle: "",
    description: "",
    codeSnippet: "",
    selectedLanguages: [],
    selectedTechnologies: [],
    codeLanguageId: "",
    isUrgent: false,
    deadline: "",
    offeredCoins: "",
});

export const hasId = (value) =>
    value !== null &&
    value !== undefined &&
    String(value).trim() !== "";

export const sameId = (first, second) =>
    hasId(first) &&
    hasId(second) &&
    String(first).trim() === String(second).trim();

export const normalizeOptions = (response) => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.results)) return response.results;
    if (Array.isArray(response?.data?.results)) {
        return response.data.results;
    }
    if (Array.isArray(response?.data)) return response.data;
    return [];
};

export const safeTagColor = (color) =>
    typeof color === "string" &&
    /^#[\da-f]{6}$/i.test(color)
        ? color
        : DEFAULT_TAG_COLOR;

export const tagAccentStyle = (item, active = false) => {
    const color = safeTagColor(item?.color);

    return {
        borderColor: active ? `${color}88` : undefined,
        backgroundColor: active ? `${color}15` : undefined,
    };
};

const normalizeTag = (value) => {
    if (value == null) return null;

    if (typeof value === "object") {
        return value.id != null ? value : null;
    }

    return { id: value, name: String(value) };
};

export const getProblemTags = (data, type) => {
    const detailed = data?.[`${type}_data`];
    const raw = data?.[type];

    const source = Array.isArray(detailed)
        ? detailed
        : Array.isArray(raw)
            ? raw
            : [];

    return source.map(normalizeTag).filter(Boolean);
};

export const toLocalDateTime = (value) => {
    if (!value) return "";

    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return "";

    const local = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
    );

    return local.toISOString().slice(0, 16);
};

export const getMinDeadline = () =>
    toLocalDateTime(new Date());

export const mapProblemToForm = (problem) => {
    const languages = getProblemTags(problem, "language");
    const technologies = getProblemTags(problem, "technology");

    return {
        problemTitle: String(problem?.problem ?? problem?.title ?? ""),
        description: String(problem?.description ?? ""),
        codeSnippet: String(problem?.code ?? ""),
        selectedLanguages: languages,
        selectedTechnologies: technologies,
        // Backend does not have a separate code_language field.
        codeLanguageId:
            problem?.code && languages.length
                ? String(languages[0].id)
                : "",
        isUrgent:
            problem?.is_urgent === true ||
            problem?.is_urgent === 1 ||
            problem?.is_urgent === "true",
        deadline: toLocalDateTime(problem?.deadline),
        offeredCoins:
            problem?.offered_coins == null
                ? ""
                : String(problem.offered_coins),
    };
};

const extractError = (value, depth = 0) => {
    if (value == null || depth > 4) return "";

    if (typeof value === "string") return value.trim();

    if (Array.isArray(value)) {
        return value
            .map((item) => extractError(item, depth + 1))
            .filter(Boolean)
            .join(", ");
    }

    if (typeof value === "object") {
        const priority = [
            "detail",
            "message",
            "error",
            "non_field_errors",
        ];

        for (const key of priority) {
            const result = extractError(value[key], depth + 1);
            if (result) return result;
        }

        return Object.entries(value)
            .map(([key, item]) => {
                const result = extractError(item, depth + 1);
                return result ? `${key}: ${result}` : "";
            })
            .filter(Boolean)
            .join("\n");
    }

    return String(value);
};

export const formatProblemBackendError = (
    error,
    fallback = "Server bilan bog‘lanishda xatolik yuz berdi."
) => {
    const data =
        error?.serverData ??
        error?.response?.data ??
        error;

    if (typeof data === "string" && /<html|<!doctype/i.test(data)) {
        // Do not expose raw Django debug HTML to end users.
        return "Backend serverda xatolik yuz berdi. Server loglarini tekshiring.";
    }

    return extractError(data) || error?.message || fallback;
};

const LANGUAGE_MAP = {
    py: "python",
    python: "python",
    javascript: "javascript",
    js: "javascript",
    nodejs: "javascript",
    typescript: "typescript",
    ts: "typescript",
    html: "markup",
    markup: "markup",
    css: "css",
    java: "java",
    c: "c",
    cpp: "cpp",
    cplusplus: "cpp",
    csharp: "csharp",
    php: "php",
    go: "go",
    golang: "go",
    rust: "rust",
    dart: "dart",
    kotlin: "kotlin",
    swift: "swift",
    ruby: "ruby",
    sql: "sql",
    bash: "bash",
    shell: "bash",
};

export const getProblemPrismLanguage = (language) => {
    const name = String(
        language?.icon_key || language?.name || ""
    )
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/\./g, "")
        .replace(/#/g, "sharp")
        .replace(/\+/g, "p");

    return LANGUAGE_MAP[name] || "clike";
};

export const validateProblemForm = ({
    form,
    isEdit = false,
    originalDeadline = "",
}) => {
    const title = form.problemTitle.trim();
    const description = form.description.trim();

    if (!title) {
        return {
            message: "Muammo sarlavhasini kiriting.",
            code: "TITLE_REQUIRED",
        };
    }

    if (!description) {
        return {
            message: "Muammo tavsifini kiriting.",
            code: "DESCRIPTION_REQUIRED",
        };
    }

    if (form.selectedLanguages.length === 0) {
        return {
            message: "Kamida bitta dasturlash tilini tanlang.",
            code: "LANGUAGE_REQUIRED",
        };
    }

    if (form.codeSnippet.trim()) {
        const codeLanguageExists = form.selectedLanguages.some(
            (item) => sameId(item.id, form.codeLanguageId)
        );

        if (!codeLanguageExists) {
            return {
                message: "Kod yozilgan bo‘lsa, uning tilini ham tanlang.",
                code: "CODE_LANGUAGE_REQUIRED",
            };
        }
    }

    if (form.isUrgent) {
        if (!form.deadline) {
            return {
                message: "Tezkor muammo uchun deadline kiriting.",
                code: "DEADLINE_REQUIRED",
            };
        }

        const deadlineTime = new Date(form.deadline).getTime();

        if (!Number.isFinite(deadlineTime)) {
            return {
                message: "Deadline sanasi noto‘g‘ri.",
                code: "DEADLINE_INVALID",
            };
        }

        const unchangedExistingDeadline =
            isEdit && form.deadline === originalDeadline;

        if (
            deadlineTime <= Date.now() &&
            !unchangedExistingDeadline
        ) {
            return {
                message: "Deadline kelajakdagi sana bo‘lishi kerak.",
                code: "DEADLINE_EXPIRED",
            };
        }

        const coins = Number(form.offeredCoins);

        if (
            !Number.isSafeInteger(coins) ||
            coins <= 0 ||
            String(form.offeredCoins).trim() === ""
        ) {
            return {
                message: "FCoin musbat butun son bo‘lishi kerak.",
                code: "FCOIN_INVALID",
            };
        }
    }

    return null;
};

export const buildProblemPayload = (form) => ({
    problem: form.problemTitle.trim(),
    description: form.description.trim(),
    code: form.codeSnippet,
    languages: form.selectedLanguages.map((item) => item.id),
    technologies: form.selectedTechnologies.map((item) => item.id),
    is_urgent: form.isUrgent,
    deadline: form.isUrgent
        ? new Date(form.deadline).toISOString()
        : null,
    offered_coins: form.isUrgent
        ? Number(form.offeredCoins)
        : 0,
});
