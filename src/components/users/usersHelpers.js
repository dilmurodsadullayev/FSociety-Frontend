export const USERS_PER_PAGE = 10;

export const USER_FILTERS = Object.freeze([
    "Reyting",
    "Yangi",
    "Faol",
]);

export const normalizeUsersResponse = (response) => {
    const root = response?.data ?? response;

    if (Array.isArray(root)) {
        return {
            users: root,
            count: root.length,
            next: null,
            previous: null,
        };
    }

    const possibleUsers =
        root?.results ??
        root?.users ??
        root?.data?.results ??
        root?.data?.users ??
        root?.data ??
        [];

    const users = Array.isArray(possibleUsers)
        ? possibleUsers
        : [];

    const countValue = Number(
        root?.count ??
        root?.total_count ??
        root?.total ??
        users.length
    );

    return {
        users,
        count:
            Number.isFinite(countValue) && countValue >= 0
                ? Math.floor(countValue)
                : users.length,
        next: root?.next ?? null,
        previous: root?.previous ?? null,
    };
};

export const getUsersErrorMessage = (
    error,
    fallback = "Foydalanuvchilarni yuklab bo‘lmadi."
) => {
    const data =
        error?.serverData ??
        error?.response?.data;

    const candidates = [
        typeof data === "string" ? data : "",
        data?.detail,
        data?.message,
        data?.error,
        data?.non_field_errors,
        error?.message,
    ];

    for (const candidate of candidates) {
        if (typeof candidate === "string" && candidate.trim()) {
            return /<html|<!doctype/i.test(candidate)
                ? fallback
                : candidate.trim();
        }

        if (Array.isArray(candidate)) {
            const message = candidate
                .filter((item) => typeof item === "string")
                .join(", ");

            if (message) return message;
        }
    }

    return fallback;
};

export const getTotalUserPages = (count) => {
    const total = Number(count);

    return Number.isFinite(total) && total > 0
        ? Math.max(1, Math.ceil(total / USERS_PER_PAGE))
        : 1;
};

export const getUserPageNumbers = (
    currentPage,
    totalPages
) => {
    if (totalPages <= 1) return [];

    if (totalPages <= 7) {
        return Array.from(
            { length: totalPages },
            (_, index) => index + 1
        );
    }

    if (currentPage <= 4) {
        return [1, 2, 3, 4, 5, "…", totalPages];
    }

    if (currentPage >= totalPages - 3) {
        return [
            1,
            "…",
            totalPages - 4,
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages,
        ];
    }

    return [
        1,
        "…",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "…",
        totalPages,
    ];
};

export const makeUsersQueryKey = (
    page,
    search,
    filter
) =>
    JSON.stringify([
        page,
        String(search ?? "").trim(),
        filter,
    ]);