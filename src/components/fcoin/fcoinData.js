
import {
    BadgeCheck,
    BookOpen,
    Bot,
    Bug,
    CheckCircle2,
    Crown,
    Heart,
    Lightbulb,
    Lock,
    Megaphone,
    MessageCircleMore,
    MessageSquareText,
    Palette,
    PenLine,
    Rocket,
    ShieldCheck,
    Star,
    ThumbsUp,
    Trophy,
    UploadCloud,
    Zap,
} from "lucide-react";

// =========================================================
// FCOIN CONFIGURATION
// =========================================================

export const FCOIN_REWARDS = Object.freeze({
    POST_UPLOAD: 20,
    PROJECT_UPLOAD: 100,

    PROBLEM_UPLOAD: 5,
    PROBLEM_RESPONSE: 5,
    PROBLEM_RESPONSE_STAR: 2,
    BEST_SOLUTION: 50,

    POST_COMMENT: 2,
    ROADMAP_LIKE: 5,
    COMMENT_ADMIN_LIKE: 10,

    DAILY_LOGIN: 1,

    FEEDBACK: Object.freeze({
        BUG: 40,
        SUGGESTION: 25,
        PRAISE: 10,
        OTHER: 10,
    }),
});

// =========================================================
// EARN WAYS
// =========================================================

export const earnWays = [
    {
        icon: PenLine,
        title: "Yangi post yozish",
        desc: "Foydali maqola yoki tajriba ulashing.",
        bonus: FCOIN_REWARDS.POST_UPLOAD,
        tone: "emerald",
    },
    {
        icon: UploadCloud,
        title: "Muammo yuklash",
        desc: "Dasturlash muammosini community bilan ulashing.",
        bonus: FCOIN_REWARDS.PROBLEM_UPLOAD,
        tone: "blue",
    },
    {
        icon: BookOpen,
        title: "Muammoga javob yozish",
        desc: "Boshqa dasturchilarga foydali yechim bering.",
        bonus: FCOIN_REWARDS.PROBLEM_RESPONSE,
        tone: "emerald",
    },
    {
        icon: Star,
        title: "Yechimga star",
        desc: "Foydali yechimlar star orqali qo‘llab-quvvatlanadi.",
        bonus: FCOIN_REWARDS.PROBLEM_RESPONSE_STAR,
        tone: "yellow",
    },
    {
        icon: Crown,
        title: "Eng yaxshi yechim",
        desc: "Javobingiz accepted solution deb topilsa.",
        bonus: FCOIN_REWARDS.BEST_SOLUTION,
        tone: "yellow",
    },
    {
        icon: Rocket,
        title: "Loyiha yuklash",
        desc: "Portfolio uchun real loyiha qo‘shing.",
        bonus: FCOIN_REWARDS.PROJECT_UPLOAD,
        tone: "purple",
    },
    {
        icon: MessageCircleMore,
        title: "Postga comment yozish",
        desc: "Muhokamada foydali fikr qoldiring.",
        bonus: FCOIN_REWARDS.POST_COMMENT,
        tone: "cyan",
    },
    {
        icon: ThumbsUp,
        title: "Roadmap like olish",
        desc: "Roadmapingiz boshqa foydalanuvchi tomonidan yoqtirilsa.",
        bonus: FCOIN_REWARDS.ROADMAP_LIKE,
        tone: "pink",
    },
    {
        icon: BadgeCheck,
        title: "Admin commentni yoqtirsa",
        desc: "Admin foydali commentingizni maxsus belgilasa.",
        bonus: FCOIN_REWARDS.COMMENT_ADMIN_LIKE,
        tone: "indigo",
    },
    {
        icon: Zap,
        title: "Kunlik kirish",
        desc: "Platformaga muntazam kirib boring.",
        bonus: FCOIN_REWARDS.DAILY_LOGIN,
        tone: "blue",
    },
];

// =========================================================
// FEEDBACK REWARDS
// =========================================================

export const feedbackRewards = [
    {
        icon: Bug,
        title: "Bug report",
        desc: "Haqiqiy xatoni toping va aniq tushuntiring. Admin tasdiqlasa reward beriladi.",
        bonus: FCOIN_REWARDS.FEEDBACK.BUG,
        tone: "red",
        badge: "Eng katta feedback reward",
    },
    {
        icon: Lightbulb,
        title: "Foydali taklif",
        desc: "Platformani yaxshilash uchun real va foydali g‘oya yuboring.",
        bonus: FCOIN_REWARDS.FEEDBACK.SUGGESTION,
        tone: "yellow",
        badge: "Admin tasdiqlaydi",
    },
    {
        icon: Heart,
        title: "Maqtov / ijobiy fikr",
        desc: "Platformadagi yaxshi jihatlar haqida sifatli feedback yuboring.",
        bonus: FCOIN_REWARDS.FEEDBACK.PRAISE,
        tone: "emerald",
        badge: "Admin tasdiqlaydi",
    },
    {
        icon: MessageSquareText,
        title: "Boshqa feedback",
        desc: "Bug yoki taklifga kirmaydigan, lekin platforma uchun foydali feedback.",
        bonus: FCOIN_REWARDS.FEEDBACK.OTHER,
        tone: "indigo",
        badge: "Admin tasdiqlaydi",
    },
];

// =========================================================
// SPEND WAYS
//
// These are planned FCoin shop features.
// They are not purchase buttons.
// =========================================================

export const spendWays = [
    {
        icon: BadgeCheck,
        title: "Avatar ramkalari",
        desc: "Profil rasmingizga premium frame qo‘shing.",
        price: "250",
    },
    {
        icon: Palette,
        title: "Eksklyuziv profil temalari",
        desc: "Profil sahifangizni boshqalardan ajrating.",
        price: "500",
    },
    {
        icon: Megaphone,
        title: "Loyihani TOP-ga chiqarish",
        desc: "Loyihangizni ko‘proq foydalanuvchiga ko‘rsating.",
        price: "800",
    },
    {
        icon: Trophy,
        title: "Premium badge",
        desc: "Faolligingiz uchun maxsus nishonlar.",
        price: "1200",
    },
];

// =========================================================
// PLATFORM RULES
// =========================================================

export const rules = [
    {
        icon: ShieldCheck,
        title: "Shaffoflik",
        desc: "Har bir FCoin harakati tarixda saqlanadi va profil hamyonida ko‘rinadi.",
    },
    {
        icon: Lock,
        title: "Ichki iqtisodiyot",
        desc: "FCoin haqiqiy valyuta emas. U FSociety ichidagi motivatsion aktiv hisoblanadi.",
    },
    {
        icon: Bot,
        title: "Anti-spam",
        desc: "Spam, bot yoki soxta faoliyat orqali yig‘ilgan FCoin bekor qilinishi mumkin.",
    },
    {
        icon: CheckCircle2,
        title: "Moderatsiya",
        desc: "Feedback reward faqat admin tasdiqlaganidan keyin beriladi.",
    },
];

// =========================================================
// ROADMAP
// =========================================================

export const roadmap = [
    "FCoin history / transaction sahifasi",
    "Premium profil dizaynlari",
    "Loyihani boost qilish",
    "Badge shop va avatar frame",
];

// =========================================================
// LIGHT / DARK TONES
// =========================================================

export const toneClasses = {
    emerald:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300",

    pink:
        "border-pink-200 bg-pink-50 text-pink-700 dark:border-pink-400/20 dark:bg-pink-500/10 dark:text-pink-300",

    yellow:
        "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-300",

    purple:
        "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-400/20 dark:bg-purple-500/10 dark:text-purple-300",

    blue:
        "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-300",

    cyan:
        "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-300",

    indigo:
        "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-400/20 dark:bg-indigo-500/10 dark:text-indigo-300",

    red:
        "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-300",
};

export const biggestFixedReward = Math.max(
    0,
    ...earnWays.map((item) => item.bonus),
    ...feedbackRewards.map((item) => item.bonus)
);
