
 // src/components/profile/posts/ProfilePostsHeader.jsx

import React, { memo } from "react";

import {
    Plus,
    Search,
    Sparkles,
} from "lucide-react";

// =========================================================
// PROFILE POSTS HEADER
//
// - Title and description
// - Search within the loaded page
// - Owner-only create button
// - Responsive layout
// - Light / Dark Mode
//
// API and modal state remain in ProfilePosts.
// =========================================================

const ProfilePostsHeader = ({
    search = "",
    onSearchChange,
    isOwner = false,
    onCreatePost,
}) => {
    return (
        <section
            aria-label="Profil postlari"
            className="
                relative min-w-0 overflow-hidden
                rounded-3xl border

                border-slate-200
                bg-white/95 p-4

                shadow-[0_12px_35px_rgba(15,23,42,0.06)]

                dark:border-white/[0.09]
                dark:bg-[#0d1117]
                dark:shadow-[0_15px_35px_rgba(0,0,0,0.2)]

                sm:p-5
            "
        >
            {/* DECORATIVE GLOW */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute -right-24 -top-24

                    h-52 w-52 rounded-full
                    bg-indigo-500/10 blur-3xl
                "
            />

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute -bottom-24 -left-24

                    h-52 w-52 rounded-full
                    bg-pink-500/10 blur-3xl
                "
            />

            <div
                className="
                    relative z-10 flex min-w-0
                    flex-col gap-5

                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                "
            >
                {/* HEADER TEXT */}

                <div className="min-w-0">
                    <span
                        className="
                            mb-3 inline-flex
                            items-center gap-2
                            rounded-full border

                            border-indigo-400/30
                            bg-indigo-500/10

                            px-3 py-1

                            text-[11px] font-black
                            uppercase tracking-wider

                            text-indigo-700
                            dark:text-indigo-300
                        "
                    >
                        <Sparkles
                            size={14}
                            aria-hidden="true"
                        />

                        Profile Posts
                    </span>

                    <h3
                        className="
                            text-2xl font-black
                            text-slate-900
                            dark:text-white
                        "
                    >
                        Postlar / Javoblar
                    </h3>

                    <p
                        className="
                            mt-1 text-sm font-semibold
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        Foydalanuvchining maqolalari,
                        fikrlari va kontentlari
                    </p>
                </div>

                {/* SEARCH + CREATE */}

                <div
                    className="
                        flex min-w-0 flex-col gap-3
                        sm:flex-row sm:items-center
                    "
                >
                    {/* SEARCH */}

                    <div
                        className="
                            relative min-w-0 flex-1
                            sm:flex-none
                        "
                    >
                        <Search
                            size={17}
                            aria-hidden="true"
                            className="
                                pointer-events-none
                                absolute left-4 top-1/2
                                -translate-y-1/2

                                text-slate-500
                                dark:text-slate-400
                            "
                        />

                        <input
                            type="search"
                            aria-label="Joriy sahifadagi postlarni qidirish"
                            value={search}
                            onChange={(event) =>
                                onSearchChange?.(
                                    event.target.value
                                )
                            }
                            placeholder="Joriy sahifada qidirish..."
                            className="
                                w-full min-w-0
                                rounded-2xl border

                                border-slate-300
                                bg-slate-50

                                py-3 pl-11 pr-4

                                text-sm font-semibold
                                text-slate-900

                                outline-none transition
                                placeholder:text-slate-400

                                focus:border-indigo-500
                                focus:ring-2
                                focus:ring-indigo-500/20

                                dark:border-white/15
                                dark:bg-black/30
                                dark:text-white
                                dark:placeholder:text-slate-500

                                sm:w-64
                            "
                        />
                    </div>

                    {/* CREATE POST */}

                    {isOwner && (
                        <button
                            type="button"
                            onClick={onCreatePost}
                            disabled={
                                typeof onCreatePost !==
                                "function"
                            }
                            className="
                                inline-flex min-h-11
                                shrink-0 items-center
                                justify-center gap-2

                                rounded-2xl border
                                border-indigo-400/40

                                bg-indigo-600
                                px-5 py-3

                                text-sm font-black
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
        </section>
    );
};

export default memo(ProfilePostsHeader);
