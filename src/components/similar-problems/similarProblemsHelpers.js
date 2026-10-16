
/**
 * FSociety — Similar Problems Helpers
 *
 * API response normalization
 * Error messages
 * Django field normalization
 * Status and metadata
 * Problem detail links
 */

export const MAX_SIMILAR_PROBLEMS = 5;

// =========================================================
// SAFE ID
// =========================================================

export const hasSimilarProblemId = (id) =>
    id !== null &&
    id !== undefined &&
    String(id).trim() !== "";

export const isSameProblemId = (first, second) =>
    hasSimilarProblemId(first) &&
    hasSimilarProblemId(second) &&
    String(first).trim() === String(second).trim();

// =========================================================
// SAFE NUMBER
// =========================================================

export const similarSafeNumber = (value) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return 0;
    }

    const number = Number(value);

    return Number.isFinite(number)
        ? Math.max(0, number)
        : 0;
};

// =========================================================
// NORMALIZE API RESPONSE
// =========================================================

export const normalizeSimilarProblems = (response) => {
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

    if (Array.isArray(response?.data?.data)) {
        return response.data.data;
    }

    if (Array.isArray(response?.data?.data?.results)) {
        return response.data.data.results;
    }

    return [];
};

// =========================================================
// FILTER AND DEDUPLICATE
//
// - Exclude current problem
// - Exclude missing IDs
// - Remove duplicates
// - Keep API ranking/order
// - Limit to five results
// =========================================================

export const prepareSimilarProblems = (
    response,
    currentProblemId
) => {
    const normalized = normalizeSimilarProblems(response);
    const seenIds = new Set();

    return normalized
        .filter((problem) => {
            if (
                !problem ||
                !hasSimilarProblemId(problem.id)
            ) {
                return false;
            }

            if (
                isSameProblemId(
                    problem.id,
                    currentProblemId
                )
            ) {
                return false;
            }

            const key = String(problem.id).trim();

            if (seenIds.has(key)) {
                return false;
            }

            seenIds.add(key);
            return true;
        })
        .slice(0, MAX_SIMILAR_PROBLEMS);
};

// =========================================================
// API ERROR MESSAGE
// =========================================================

const extractErrorText = (value, depth = 0) => {
    if (depth > 3 || value == null) {
        return "";
    }

    if (typeof value === "string") {
        return value.trim();
    }

    if (Array.isArray(value)) {
        for (const item of value) {
            const result = extractErrorText(item, depth + 1);

            if (result) {
                return result;
            }
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
            const result = extractErrorText(
                value[key],
                depth + 1
            );

            if (result) {
                return result;
            }
        }

        for (const item of Object.values(value)) {
            const result = extractErrorText(
                item,
                depth + 1
            );

            if (result) {
                return result;
            }
        }
    }

    return "";
};

export const getSimilarProblemsError = (
    error,
    fallback = "O‘xshash muammolarni yuklashda xatolik yuz berdi."
) => {
    return (
        extractErrorText(
            error?.serverData ??
            error?.response?.data
        ) ||
        extractErrorText(error?.message) ||
        fallback
    );
};

// =========================================================
// PROBLEM TITLE
// =========================================================

export const getSimilarProblemTitle = (problem) => {
    const title =
        problem?.problem ??
        problem?.title;

    if (typeof title !== "string") {
        return "Nomsiz muammo";
    }

    return title.trim() || "Nomsiz muammo";
};

// =========================================================
// PROBLEM LANGUAGES
// =========================================================

export const getSimilarProblemLanguages = (problem) => {
    const primary = problem?.language_data;

    if (Array.isArray(primary)) {
        return primary.filter(
            (language) =>
                typeof language === "string" ||
                (
                    language !== null &&
                    typeof language === "object"
                )
        );
    }

    const fallback = problem?.language;

    if (Array.isArray(fallback)) {
        return fallback.filter(
            (language) =>
                typeof language === "string" ||
                (
                    language !== null &&
                    typeof language === "object"
                )
        );
    }

    return [];
};

export const getSimilarLanguageName = (language) => {
    if (typeof language === "string") {
        return language.trim();
    }

    if (
        language &&
        typeof language === "object"
    ) {
        const name =
            language.name ??
            language.title ??
            "";

        return typeof name === "string"
            ? name.trim()
            : "";
    }

    return "";
};

// =========================================================
// RESPONSE COUNT
// =========================================================

export const getSimilarResponseCount = (problem) => {
    return similarSafeNumber(
        problem?.total_responses ??
        problem?.response_count ??
        problem?.responses_count ??
        (
            Array.isArray(problem?.responses)
                ? problem.responses.length
                : 0
        )
    );
};

// =========================================================
// VIEW COUNT
// =========================================================

export const getSimilarViewCount = (problem) => {
    return similarSafeNumber(
        problem?.total_views ??
        problem?.views_count ??
        problem?.view_count ??
        0
    );
};

// =========================================================
// OFFERED COINS
// =========================================================

export const getSimilarOfferedCoins = (problem) => {
    return similarSafeNumber(
        problem?.offered_coins
    );
};

// =========================================================
// BOOLEAN NORMALIZATION
// =========================================================

const normalizeBoolean = (value) => {
    if (typeof value === "boolean") {
        return value;
    }

    if (typeof value === "number") {
        return value === 1;
    }

    if (typeof value === "string") {
        return [
            "true",
            "1",
            "yes",
        ].includes(value.trim().toLowerCase());
    }

    return false;
};

// =========================================================
// STATUS
// =========================================================

export const getSimilarProblemStatus = (problem) => {
    const status = String(
        problem?.status ?? ""
    ).toLowerCase();

    if (status === "rejected") {
        return "rejected";
    }

    if (
        status === "solved" ||
        normalizeBoolean(problem?.is_solved)
    ) {
        return "solved";
    }

    return "pending";
};

export const isSimilarProblemUrgent = (problem) => {
    return normalizeBoolean(problem?.is_urgent);
};

// =========================================================
// DATE
// =========================================================

export const getSimilarProblemDate = (problem) => {
    const value = problem?.created_at;

    if (!value) return null;

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? null
        : value;
};

// =========================================================
// DETAIL URL
//
// Match the route currently used by FSociety:
// /problem/36/detail
// =========================================================

export const getSimilarProblemUrl = (problemId) => {
    if (!hasSimilarProblemId(problemId)) {
        return "/problems";
    }

    return (
        `/problem/${encodeURIComponent(problemId)}/detail`
    );
};
