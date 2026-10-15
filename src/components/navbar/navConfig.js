
import {
    Coins,
    FolderKanban,
    MessageSquareText,
    Puzzle,
    Users,
} from "lucide-react";

// =========================================================
// NAVIGATION LINKS
// =========================================================

export const NAV_LINKS = [
    {
        path: "/projects",
        text: "Projects",
        Icon: FolderKanban,
    },
    {
        path: "/feedback",
        text: "Feedback",
        Icon: MessageSquareText,
    },
    {
        path: "/problems",
        text: "Problems",
        Icon: Puzzle,
    },
    {
        path: "/users",
        text: "Users",
        Icon: Users,
    },
    {
        path: "/fcoin",
        text: "F Coin",
        Icon: Coins,
    },
];

// =========================================================
// DROPDOWN ANIMATIONS
// =========================================================

export const dropdownVariants = {
    hidden: {
        opacity: 0,
        y: -8,
        scale: 0.96,
    },

    visible: {
        opacity: 1,
        y: 0,
        scale: 1,

        transition: {
            duration: 0.18,
            ease: "easeOut",
        },
    },

    exit: {
        opacity: 0,
        y: -8,
        scale: 0.96,

        transition: {
            duration: 0.14,
            ease: "easeIn",
        },
    },
};
