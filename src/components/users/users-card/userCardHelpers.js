import DefaultUserImage from "../../../assests/userImage.jpeg";

const BACKEND_URL = (
    process.env.REACT_APP_BACKEND_URL ||
    "http://127.0.0.1:8000"
).replace(/\/+$/, "");

export const getUserAvatarUrl = (image) => {
    const raw =
        typeof image === "string"
            ? image
            : image?.url;

    if (typeof raw !== "string" || !raw.trim()) {
        return DefaultUserImage;
    }

    const value = raw.trim();

    if (/^https?:\/\//i.test(value)) {
        return value;
    }

    // Never pass unsupported URL schemes to the image element.
    if (/^[a-z][a-z0-9+.-]*:/i.test(value)) {
        return DefaultUserImage;
    }

    try {
        const base = new URL(BACKEND_URL);

        return new URL(
            value.replace(/^\/+/, ""),
            `${base.origin}/`
        ).href;
    } catch {
        return DefaultUserImage;
    }
};

export const getDefaultUserAvatar = () =>
    DefaultUserImage;

export const getUserDisplayName = (user) => {
    const username = user?.username;

    return typeof username === "string" && username.trim()
        ? username.trim()
        : "anonymous";
};

export const getUserProfileUrl = (user) => {
    const username = user?.username;

    if (typeof username !== "string" || !username.trim()) {
        return null;
    }

    return `/${encodeURIComponent(username.trim())}/profile/`;
};

export const getUserSkillLevel = (user) => {
    const level =
        user?.skill_level ??
        user?.level ??
        "developer";

    return typeof level === "string" && level.trim()
        ? level.trim()
        : "developer";
};

export const getUserRating = (user) => {
    const value = Number(user?.total_rating ?? 0);

    return Number.isFinite(value)
        ? value.toFixed(1)
        : "0.0";
};

export const getUserCoins = (user) => {
    const value = Number(user?.coins ?? 0);

    return Number.isFinite(value)
        ? Math.max(0, value).toLocaleString("uz-UZ")
        : "0";
};

export const isUserOnline = (user) =>
    user?.is_online === true ||
    user?.is_online === 1 ||
    user?.is_online === "true";

// =========================================================
// SKILLS
// =========================================================

export const getUserSkills = (user) => {
    const source = Array.isArray(user?.skills)
        ? user.skills
        : [];

    const seen = new Set();

    return source
        .map((skill) => {
            if (typeof skill === "string") {
                return skill.trim();
            }

            if (skill && typeof skill === "object") {
                const value =
                    skill.name ??
                    skill.title ??
                    skill.technology_name ??
                    "";

                return String(value).trim();
            }

            return "";
        })
        .filter((skill) => {
            if (!skill) return false;

            const key = skill.toLowerCase();

            if (seen.has(key)) return false;

            seen.add(key);
            return true;
        });
};

const SKILL_COLORS = {
    python: `
        border-sky-200 bg-sky-50 text-sky-800
        dark:border-sky-400/20 dark:bg-sky-400/10
        dark:text-sky-300
    `,
    django: `
        border-emerald-200 bg-emerald-50 text-emerald-800
        dark:border-emerald-400/20 dark:bg-emerald-400/10
        dark:text-emerald-300
    `,
    docker: `
        border-blue-200 bg-blue-50 text-blue-800
        dark:border-blue-400/20 dark:bg-blue-400/10
        dark:text-blue-300
    `,
    fastapi: `
        border-teal-200 bg-teal-50 text-teal-800
        dark:border-teal-400/20 dark:bg-teal-400/10
        dark:text-teal-300
    `,
    javascript: `
        border-yellow-200 bg-yellow-50 text-yellow-800
        dark:border-yellow-400/20 dark:bg-yellow-400/10
        dark:text-yellow-300
    `,
    react: `
        border-cyan-200 bg-cyan-50 text-cyan-800
        dark:border-cyan-400/20 dark:bg-cyan-400/10
        dark:text-cyan-300
    `,
    tailwind: `
        border-teal-200 bg-teal-50 text-teal-800
        dark:border-teal-400/20 dark:bg-teal-400/10
        dark:text-teal-300
    `,
    figma: `
        border-pink-200 bg-pink-50 text-pink-800
        dark:border-pink-400/20 dark:bg-pink-400/10
        dark:text-pink-300
    `,
    node: `
        border-lime-200 bg-lime-50 text-lime-800
        dark:border-lime-400/20 dark:bg-lime-400/10
        dark:text-lime-300
    `,
    mongodb: `
        border-green-200 bg-green-50 text-green-800
        dark:border-green-400/20 dark:bg-green-400/10
        dark:text-green-300
    `,
};

export const getUserSkillColor = (skill) => {
    const name = String(skill ?? "")
        .toLowerCase()
        .trim();

    const aliases = {
        js: "javascript",
        "node.js": "node",
        "react.js": "react",
        "reactjs": "react",
        "tailwindcss": "tailwind",
    };

    const normalized = aliases[name] || name;

    return (
        SKILL_COLORS[normalized] ||
        `
            border-slate-200 bg-slate-50 text-slate-700
            dark:border-white/10 dark:bg-white/[0.05]
            dark:text-slate-300
        `
    );
};