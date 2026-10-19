
import React, { memo } from "react";

import {
    MessageSquarePlus,
    Plus,
    Search,
} from "lucide-react";

// =========================================================
// EMPTY POSTS
//
// Displayed when the user has no posts.
//
// Owner:
// - Sees a create-post button.
//
// Visitor:
// - Sees the empty state only.
//
// Modal opening logic remains in ProfilePosts.jsx.
// =========================================================

const NoPosts = memo(function NoPosts({
    isCurrentUser = false,
    onCreate,
    message,
}) {
    const defaultMessage = isCurrentUser
        ? "Siz hali post yozmagansiz. Birinchi maqolangizni qo‘shing."
        : "Foydalanuvchi hali biron bir maqola chop etmagan.";

    return (
        <div
            role="status"
            className="
                relative
                min-w-0
                overflow-hidden

                rounded-3xl
                border
                border-dashed

                border-slate-300
                bg-white/95

                p-6
                text-center
                shadow-sm

                dark:border-white/15
                dark:bg-[#0d1117]

                sm:p-8
            "
        >
            {/* =====================================
                BACKGROUND GLOWS
            ====================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    -right-24
                    -top-24

                    h-52
                    w-52
                    rounded-full

                    bg-indigo-500/10
                    blur-3xl
                "
            />

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    -bottom-24
                    -left-24

                    h-52
                    w-52
                    rounded-full

                    bg-pink-500/10
                    blur-3xl
                "
            />

            {/* =====================================
                CONTENT
            ====================================== */}

            <div className="relative z-10">
                {/* ICON */}

                <div
                    className="
                        mx-auto
                        mb-5

                        flex
                        h-20
                        w-20

                        items-center
                        justify-center

                        rounded-full
                        border

                        border-slate-200
                        bg-slate-50

                        text-slate-500

                        dark:border-white/15
                        dark:bg-white/[0.05]
                        dark:text-slate-400
                    "
                >
                    <MessageSquarePlus
                        size={42}
                        aria-hidden="true"
                    />
                </div>

                {/* TITLE */}

                <h4
                    className="
                        text-2xl
                        font-black

                        text-slate-900
                        dark:text-white
                    "
                >
                    Hech qanday post mavjud emas
                </h4>

                {/* DESCRIPTION */}

                <p
                    className="
                        mx-auto
                        mt-2

                        max-w-xl
                        break-words

                        text-sm
                        font-semibold
                        leading-7

                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    {message || defaultMessage}
                </p>

                {/* =====================================
                    CREATE BUTTON

                    Only profile owner can see it.
                ====================================== */}

                {isCurrentUser && (
                    <button
                        type="button"
                        onClick={onCreate}
                        disabled={
                            typeof onCreate !== "function"
                        }
                        className="
                            mt-6

                            inline-flex
                            min-h-11

                            items-center
                            justify-center
                            gap-2

                            rounded-2xl

                            border
                            border-indigo-400/40

                            bg-indigo-600

                            px-5
                            py-3

                            text-sm
                            font-black
                            text-white

                            shadow-lg
                            shadow-indigo-600/20

                            transition-colors
                            hover:bg-indigo-500

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-indigo-500/60

                            disabled:cursor-not-allowed
                            disabled:opacity-50

                            active:scale-[0.98]
                        "
                    >
                        <Plus
                            size={18}
                            aria-hidden="true"
                        />

                        Yangi Post
                    </button>
                )}
            </div>
        </div>
    );
});

// =========================================================
// NO SEARCH RESULTS
//
// Displayed when:
// - Posts exist.
// - Search returned no matches on the current page.
//
// The search is controlled by ProfilePosts.jsx.
// =========================================================

const NoSearchResults = memo(
    function NoSearchResults({
        onClearSearch,
    }) {
        return (
            <div
                role="status"
                className="
                    min-w-0
                    rounded-3xl

                    border
                    border-dashed
                    border-slate-300

                    bg-slate-50

                    p-6
                    text-center

                    dark:border-white/15
                    dark:bg-white/[0.025]

                    sm:p-8
                "
            >
                {/* =====================================
                    SEARCH ICON
                ====================================== */}

                <Search
                    size={42}
                    aria-hidden="true"
                    className="
                        mx-auto
                        mb-3

                        text-slate-400
                        dark:text-slate-500
                    "
                />

                {/* =====================================
                    TITLE
                ====================================== */}

                <h4
                    className="
                        text-xl
                        font-black

                        text-slate-900
                        dark:text-white
                    "
                >
                    Qidiruv bo‘yicha post topilmadi
                </h4>

                {/* =====================================
                    DESCRIPTION
                ====================================== */}

                <p
                    className="
                        mx-auto
                        mt-2

                        max-w-xl
                        text-sm

                        font-semibold
                        leading-7

                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    Joriy sahifada mos post yo‘q.
                    Boshqa kalit so‘z yoki boshqa
                    sahifani tekshirib ko‘ring.
                </p>

                {/* =====================================
                    CLEAR SEARCH BUTTON
                ====================================== */}

                {typeof onClearSearch ===
                    "function" && (
                    <button
                        type="button"
                        onClick={onClearSearch}
                        className="
                            mt-5

                            inline-flex
                            min-h-10

                            items-center
                            justify-center

                            rounded-xl
                            border

                            border-slate-300
                            bg-white

                            px-4
                            py-2

                            text-xs
                            font-black
                            text-slate-700

                            transition-colors

                            hover:border-indigo-400
                            hover:bg-indigo-50

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-indigo-500/50

                            dark:border-white/15
                            dark:bg-white/[0.05]
                            dark:text-slate-200

                            dark:hover:border-indigo-400/40
                            dark:hover:bg-indigo-500/10
                        "
                    >
                        Qidiruvni tozalash
                    </button>
                )}
            </div>
        );
    }
);

// =========================================================
// PROFILE POSTS EMPTY
//
// Variants:
//
// "posts":
//   No posts are available.
//
// "search":
//   Current-page search returned no results.
//
// Props:
//
// variant:
//   Type of empty state.
//
// isCurrentUser:
//   Owner permission flag.
//
// onCreate:
//   Opens CreatePostModal.
//
// message:
//   Optional empty-posts description.
//
// onClearSearch:
//   Resets the current search text.
//
// No API or Redux dependency.
// =========================================================

const ProfilePostsEmpty = ({
    variant = "posts",
    isCurrentUser = false,
    onCreate,
    message,
    onClearSearch,
}) => {
    // =====================================================
    // EMPTY SEARCH RESULTS
    // =====================================================

    if (variant === "search") {
        return (
            <NoSearchResults
                onClearSearch={onClearSearch}
            />
        );
    }

    // =====================================================
    // NO POSTS
    // =====================================================

    return (
        <NoPosts
            isCurrentUser={isCurrentUser}
            onCreate={onCreate}
            message={message}
        />
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfilePostsEmpty);
