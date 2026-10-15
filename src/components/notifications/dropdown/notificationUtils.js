
import {
    AlertTriangle,
    Award,
    CheckCircle2,
    Coins,
    Info,
    ListChecks,
    MessageSquareText,
    Newspaper,
    Star,
} from "lucide-react";

import PlaceholderUserImage from "../../../assests/userImage.jpeg";
import { BACKEND_URL } from "../../../services/config";

// =========================================================
// VALID CONTENT TYPES
// =========================================================

const VALID_TYPES = new Set([
    "problem",
    "solution",
    "coin",
    "post",
    "task",
    "star",
    "info",
    "badge",
    "feedback",
]);

// =========================================================
// URL HELPERS
// =========================================================

const normalizeBaseUrl = (url) => {
    if (!url) {
        return typeof window !== "undefined"
            ? window.location.origin
            : "";
    }

    return String(url).replace(/\/+$/, "");
};

export const getAbsoluteImageUrl = (image) => {
    if (!image) return PlaceholderUserImage;

    const value = String(image).trim();

    if (!value) return PlaceholderUserImage;

    if (/^https?:\/\//i.test(value)) {
        return value;
    }

    if (
        value.startsWith("blob:") ||
        value.startsWith("data:")
    ) {
        return value;
    }

    const baseUrl = normalizeBaseUrl(BACKEND_URL);

    const path = value.startsWith("/")
        ? value
        : `/${value}`;

    return `${baseUrl}${path}`;
};

// =========================================================
// SENDER
// =========================================================

export const getSenderUsername = (sender) => {
    if (!sender) return "FSociety";

    if (typeof sender === "string") {
        return sender;
    }

    return (
        sender.username ||
        sender.full_name ||
        sender.first_name ||
        sender.email ||
        "FSociety"
    );
};

// =========================================================
// CONTENT TYPE
// =========================================================

export const getContentType = (notification) => {
    const contentType =
        notification?.content_type ||
        notification?.notification_type ||
        notification?.category;

    if (VALID_TYPES.has(contentType)) {
        return contentType;
    }

    if (VALID_TYPES.has(notification?.type)) {
        return notification.type;
    }

    return "info";
};

// =========================================================
// DATE
// =========================================================

export const formatDateTime = (value) => {
    if (!value) return "Hozirgina";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Hozirgina";
    }

    const time = date.toLocaleTimeString("uz-UZ", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const day = date.toLocaleDateString("uz-UZ");

    return `${time} • ${day}`;
};

// =========================================================
// NOTIFICATION URL
// =========================================================

export const getNotificationUrl = (notification) => {
    const type = getContentType(notification);
    const objectId = notification?.object_id;

    if (
        type === "problem" ||
        type === "solution" ||
        type === "star"
    ) {
        return objectId
            ? `/problem/${objectId}/detail`
            : "/problems";
    }

    if (type === "post") {
        const username = getSenderUsername(
            notification?.sender
        );

        const slug =
            notification?.post?.slug ||
            notification?.slug;

        return username && slug
            ? `/${username}/post/${slug}/`
            : "/notifications";
    }

    if (type === "coin") {
        return "/fcoin-history";
    }

    if (type === "badge") {
        const username =
            notification?.recipient?.username ||
            notification?.sender?.username;

        return username
            ? `/${username}/profile`
            : "/notifications";
    }

    if (type === "feedback") {
        return "/feedback";
    }

    return "/notifications";
};

// =========================================================
// TYPE COLORS
//
// All classes are literal Tailwind classes.
// Dark and Light styles are defined separately.
// =========================================================

const TYPE_META = {
    problem: {
        Icon: AlertTriangle,
        label: "Problem",
        iconBox: "border-red-400/25 bg-red-500/10 text-red-700 dark:text-red-300",
        pill: "border-red-400/25 bg-red-500/[0.07] text-red-700 dark:text-red-300",
        glow: "from-red-500/[0.10]",
    },

    solution: {
        Icon: CheckCircle2,
        label: "Yechim",
        iconBox: "border-emerald-400/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        pill: "border-emerald-400/25 bg-emerald-500/[0.07] text-emerald-700 dark:text-emerald-300",
        glow: "from-emerald-500/[0.10]",
    },

    coin: {
        Icon: Coins,
        label: "FCoin",
        iconBox: "border-amber-400/25 bg-amber-500/10 text-amber-800 dark:text-amber-300",
        pill: "border-amber-400/25 bg-amber-500/[0.07] text-amber-800 dark:text-amber-300",
        glow: "from-amber-500/[0.10]",
    },

    post: {
        Icon: Newspaper,
        label: "Post",
        iconBox: "border-violet-400/25 bg-violet-500/10 text-violet-700 dark:text-violet-300",
        pill: "border-violet-400/25 bg-violet-500/[0.07] text-violet-700 dark:text-violet-300",
        glow: "from-violet-500/[0.10]",
    },

    task: {
        Icon: ListChecks,
        label: "Task",
        iconBox: "border-blue-400/25 bg-blue-500/10 text-blue-700 dark:text-blue-300",
        pill: "border-blue-400/25 bg-blue-500/[0.07] text-blue-700 dark:text-blue-300",
        glow: "from-blue-500/[0.10]",
    },

    star: {
        Icon: Star,
        label: "Star",
        iconBox: "border-yellow-400/25 bg-yellow-500/10 text-yellow-800 dark:text-yellow-300",
        pill: "border-yellow-400/25 bg-yellow-500/[0.07] text-yellow-800 dark:text-yellow-300",
        glow: "from-yellow-500/[0.10]",
    },

    badge: {
        Icon: Award,
        label: "Badge",
        iconBox: "border-orange-400/25 bg-orange-500/10 text-orange-800 dark:text-orange-300",
        pill: "border-orange-400/25 bg-orange-500/[0.07] text-orange-800 dark:text-orange-300",
        glow: "from-orange-500/[0.10]",
    },

    feedback: {
        Icon: MessageSquareText,
        label: "Feedback",
        iconBox: "border-cyan-400/25 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
        pill: "border-cyan-400/25 bg-cyan-500/[0.07] text-cyan-700 dark:text-cyan-300",
        glow: "from-cyan-500/[0.10]",
    },

    info: {
        Icon: Info,
        label: "Info",
        iconBox: "border-indigo-400/25 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
        pill: "border-indigo-400/25 bg-indigo-500/[0.07] text-indigo-700 dark:text-indigo-300",
        glow: "from-indigo-500/[0.10]",
    },
};

// =========================================================
// NOTIFICATION META
// =========================================================

export const getNotificationMeta = (notification) => {
    const type = getContentType(notification);

    if (type === "feedback") {
        const status =
            notification?.metadata?.feedback_status;

        if (status === "approved") {
            return {
                ...TYPE_META.solution,
                label: "Feedback tasdiqlandi",
            };
        }

        if (status === "rejected") {
            return {
                ...TYPE_META.problem,
                label: "Feedback rad etildi",
            };
        }
    }

    return TYPE_META[type] || TYPE_META.info;
};

// =========================================================
// NOTIFICATION TEXT
// =========================================================

export const getNotificationText = (notification) => {
    if (notification?.message) {
        return notification.message;
    }

    const type = getContentType(notification);

    switch (type) {
        case "coin":
            return "Sizga FCoin mukofot berildi.";

        case "badge":
            return "Siz yangi nishon qo‘lga kiritdingiz.";

        case "star":
            return "Sizga yangi star berildi.";

        case "post":
            return "Yangi post bo‘yicha bildirishnoma.";

        case "problem":
            return "Yangi problem bo‘yicha bildirishnoma.";

        case "solution":
            return "Yangi yechim bo‘yicha bildirishnoma.";

        case "task":
            return "Task bo‘yicha yangi bildirishnoma.";

        case "feedback": {
            const status =
                notification?.metadata?.feedback_status;

            const rewardAmount = Number(
                notification?.metadata?.reward_amount || 0
            );

            if (status === "approved") {
                return rewardAmount > 0
                    ? `Feedbackingiz tasdiqlandi. +${rewardAmount} FCoin berildi.`
                    : "Feedbackingiz tasdiqlandi.";
            }

            if (status === "rejected") {
                return "Feedbackingiz rad etildi.";
            }

            return "Feedback holati yangilandi.";
        }

        default:
            return "Yangi bildirishnoma.";
    }
};
