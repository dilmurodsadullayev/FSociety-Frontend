
// src/components/profile/ProfileSkeleton.jsx

import React from "react";

// =========================================================
// SKELETON BLOCK
//
// - Light Mode: light gray
// - Dark Mode: subtle white
// - Reduced motion support
// =========================================================

const SkeletonBlock = ({
    className = "",
}) => {
    return (
        <div
            aria-hidden="true"
            className={`
                animate-pulse
                motion-reduce:animate-none
                rounded-xl
                bg-slate-200/90
                dark:bg-white/[0.075]
                ${className}
            `}
        />
    );
};

// =========================================================
// PROFILE SKELETON
//
// Sections:
//
// 1. Profile Hero
// 2. Cover
// 3. Avatar and user metadata
// 4. Five info pills
// 5. Five profile statistics
// 6. Sidebar profile information
// 7. Skills
// 8. Badges
// 9. Content tabs
// 10. Three content cards
//
// All original skeleton sections are preserved.
// =========================================================

const ProfileSkeleton = () => {
    return (
        <main
            aria-busy="true"
            aria-label="Profil yuklanmoqda"
            className="
                min-h-screen
                w-full
                min-w-0

                bg-[#f4f7fc]
                text-slate-900

                dark:bg-[#0d1117]
                dark:text-[#e6edf3]

                px-3
                py-4

                font-sans

                sm:px-4
                md:px-6
                md:py-6
            "
        >
            {/* =============================================
                ACCESSIBLE LOADING STATUS
            ============================================== */}

            <span className="sr-only">
                Profil ma’lumotlari yuklanmoqda...
            </span>

            <div
                className="
                    mx-auto
                    w-full
                    max-w-7xl
                "
            >
                {/* =========================================
                    PROFILE HERO
                ========================================== */}

                <section
                    className="
                        overflow-hidden
                        rounded-3xl
                        border

                        border-slate-200
                        bg-white/90
                        shadow-sm

                        dark:border-white/[0.06]
                        dark:bg-white/[0.02]
                        dark:shadow-none
                    "
                >
                    {/* =====================================
                        COVER
                    ====================================== */}

                    <SkeletonBlock
                        className="
                            h-44
                            rounded-none

                            sm:h-52
                            md:h-72
                        "
                    />

                    {/* =====================================
                        HEADER
                    ====================================== */}

                    <div
                        className="
                            relative
                            px-4
                            pb-5
                            sm:px-6
                        "
                    >
                        <div
                            className="
                                -mt-12

                                flex
                                items-end
                                gap-4

                                sm:-mt-16
                                sm:gap-5
                            "
                        >
                            {/* =============================
                                AVATAR
                            ============================== */}

                            <SkeletonBlock
                                className="
                                    h-24
                                    w-24
                                    shrink-0

                                    rounded-full

                                    border-4
                                    border-white

                                    dark:border-[#0b0e14]

                                    sm:h-32
                                    sm:w-32
                                "
                            />

                            {/* =============================
                                USER META
                            ============================== */}

                            <div
                                className="
                                    min-w-0
                                    flex-1
                                    space-y-3
                                    pb-2
                                "
                            >
                                <SkeletonBlock
                                    className="
                                        h-7
                                        w-44

                                        sm:h-9
                                        sm:w-64
                                    "
                                />

                                <SkeletonBlock
                                    className="
                                        h-4
                                        w-36

                                        sm:w-52
                                    "
                                />

                                <div
                                    className="
                                        flex
                                        flex-wrap
                                        gap-2
                                    "
                                >
                                    <SkeletonBlock
                                        className="
                                            h-8
                                            w-20
                                            rounded-full
                                        "
                                    />

                                    <SkeletonBlock
                                        className="
                                            h-8
                                            w-24
                                            rounded-full
                                        "
                                    />
                                </div>
                            </div>
                        </div>

                        {/* =================================
                            INFO PILLS

                            Original count: 5
                        ================================== */}

                        <div
                            className="
                                mt-6

                                grid
                                gap-3

                                sm:grid-cols-2
                                xl:grid-cols-5
                            "
                        >
                            {Array.from({
                                length: 5,
                            }).map(
                                (_, index) => (
                                    <div
                                        key={index}
                                        className="
                                            flex
                                            min-h-[78px]

                                            items-center
                                            gap-4

                                            rounded-2xl
                                            border

                                            border-slate-200
                                            bg-slate-50/80

                                            dark:border-white/[0.05]
                                            dark:bg-white/[0.015]

                                            p-4
                                        "
                                    >
                                        <SkeletonBlock
                                            className="
                                                h-11
                                                w-11
                                                shrink-0
                                            "
                                        />

                                        <div
                                            className="
                                                flex-1
                                                space-y-2
                                            "
                                        >
                                            <SkeletonBlock
                                                className="
                                                    h-2.5
                                                    w-16
                                                "
                                            />

                                            <SkeletonBlock
                                                className="
                                                    h-4
                                                    w-24
                                                "
                                            />
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {/* =====================================
                        PROFILE STATS

                        Original count: 5
                    ====================================== */}

                    <div
                        className="
                            grid
                            grid-cols-2

                            border-t
                            border-slate-200

                            dark:border-white/[0.05]

                            md:grid-cols-5
                        "
                    >
                        {Array.from({
                            length: 5,
                        }).map(
                            (_, index) => (
                                <div
                                    key={index}
                                    className="
                                        flex
                                        min-h-[115px]

                                        flex-col
                                        items-center
                                        justify-center
                                        gap-2

                                        border-b
                                        border-r

                                        border-slate-200

                                        dark:border-white/[0.05]

                                        p-4

                                        md:border-b-0
                                    "
                                >
                                    <SkeletonBlock
                                        className="
                                            h-9
                                            w-9
                                        "
                                    />

                                    <SkeletonBlock
                                        className="
                                            h-3
                                            w-16
                                        "
                                    />

                                    <SkeletonBlock
                                        className="
                                            h-6
                                            w-10
                                        "
                                    />
                                </div>
                            )
                        )}
                    </div>
                </section>

                {/* =========================================
                    PROFILE BODY

                    Mobile:
                    - One column

                    Desktop:
                    - Sidebar + Content

                    Same structure as Profile.jsx.
                ========================================== */}

                <div
                    className="
                        mt-6

                        grid
                        min-w-0
                        grid-cols-1
                        gap-6

                        lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]
                    "
                >
                    {/* =====================================
                        SIDEBAR
                    ====================================== */}

                    <aside
                        className="
                            min-w-0
                            space-y-6
                        "
                    >
                        {/* =============================
                            PROFILE INFO
                        ============================== */}

                        <section
                            className="
                                space-y-4

                                rounded-3xl
                                border

                                border-slate-200
                                bg-white/90
                                shadow-sm

                                dark:border-white/[0.06]
                                dark:bg-white/[0.02]
                                dark:shadow-none

                                p-5
                            "
                        >
                            {/* =========================
                                PROFILE INFO HEADER
                            ========================== */}

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >
                                <SkeletonBlock
                                    className="
                                        h-11
                                        w-11
                                    "
                                />

                                <div
                                    className="
                                        flex-1
                                        space-y-2
                                    "
                                >
                                    <SkeletonBlock
                                        className="
                                            h-5
                                            w-32
                                        "
                                    />

                                    <SkeletonBlock
                                        className="
                                            h-3
                                            w-44
                                        "
                                    />
                                </div>
                            </div>

                            {/* =========================
                                PROFILE INFORMATION ROWS

                                Original count: 6
                            ========================== */}

                            {Array.from({
                                length: 6,
                            }).map(
                                (_, index) => (
                                    <div
                                        key={index}
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                            py-2
                                        "
                                    >
                                        <SkeletonBlock
                                            className="
                                                h-8
                                                w-8
                                                shrink-0
                                            "
                                        />

                                        <div
                                            className="
                                                flex-1
                                                space-y-2
                                            "
                                        >
                                            <SkeletonBlock
                                                className="
                                                    h-2.5
                                                    w-20
                                                "
                                            />

                                            <SkeletonBlock
                                                className="
                                                    h-4
                                                    w-32
                                                "
                                            />
                                        </div>
                                    </div>
                                )
                            )}

                            {/* =========================
                                PROFILE INFO PLACEHOLDER
                            ========================== */}

                            <SkeletonBlock
                                className="
                                    mt-4
                                    h-32
                                    w-full
                                    rounded-2xl
                                "
                            />
                        </section>

                        {/* =================================
                            SKILLS
                        ================================== */}

                        <section
                            className="
                                rounded-3xl
                                border

                                border-slate-200
                                bg-white/90
                                shadow-sm

                                dark:border-white/[0.06]
                                dark:bg-white/[0.02]
                                dark:shadow-none

                                p-5
                            "
                        >
                            {/* =========================
                                SKILLS HEADER
                            ========================== */}

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-4
                                "
                            >
                                <SkeletonBlock
                                    className="
                                        h-6
                                        w-32
                                    "
                                />

                                <SkeletonBlock
                                    className="
                                        h-7
                                        w-12
                                        rounded-full
                                    "
                                />
                            </div>

                            {/* =========================
                                SKILL TAGS

                                Original count: 5
                            ========================== */}

                            <div
                                className="
                                    mt-5

                                    flex
                                    flex-wrap
                                    gap-2
                                "
                            >
                                <SkeletonBlock
                                    className="
                                        h-8
                                        w-20
                                        rounded-full
                                    "
                                />

                                <SkeletonBlock
                                    className="
                                        h-8
                                        w-24
                                        rounded-full
                                    "
                                />

                                <SkeletonBlock
                                    className="
                                        h-8
                                        w-16
                                        rounded-full
                                    "
                                />

                                <SkeletonBlock
                                    className="
                                        h-8
                                        w-28
                                        rounded-full
                                    "
                                />

                                <SkeletonBlock
                                    className="
                                        h-8
                                        w-20
                                        rounded-full
                                    "
                                />
                            </div>
                        </section>

                        {/* =================================
                            BADGES
                        ================================== */}

                        <section
                            className="
                                rounded-3xl
                                border

                                border-slate-200
                                bg-white/90
                                shadow-sm

                                dark:border-white/[0.06]
                                dark:bg-white/[0.02]
                                dark:shadow-none

                                p-5
                            "
                        >
                            {/* =========================
                                BADGES HEADER
                            ========================== */}

                            <SkeletonBlock
                                className="
                                    h-6
                                    w-28
                                "
                            />

                            {/* =========================
                                BADGE IMAGES

                                Original count: 3
                            ========================== */}

                            <div
                                className="
                                    mt-5

                                    grid
                                    grid-cols-3
                                    gap-3
                                "
                            >
                                {Array.from({
                                    length: 3,
                                }).map(
                                    (_, index) => (
                                        <SkeletonBlock
                                            key={index}
                                            className="
                                                h-20
                                                rounded-2xl
                                            "
                                        />
                                    )
                                )}
                            </div>
                        </section>
                    </aside>

                    {/* =====================================
                        MAIN CONTENT
                    ====================================== */}

                    <section
                        className="
                            min-w-0
                        "
                    >
                        {/* =================================
                            TABS
                        ================================== */}

                        <div
                            className="
                                flex
                                gap-4

                                overflow-hidden

                                border-b
                                border-slate-200

                                dark:border-white/[0.05]

                                pb-4
                            "
                        >
                            <SkeletonBlock
                                className="
                                    h-8
                                    w-24
                                "
                            />

                            <SkeletonBlock
                                className="
                                    h-8
                                    w-28
                                "
                            />

                            <SkeletonBlock
                                className="
                                    h-8
                                    w-24
                                "
                            />
                        </div>

                        {/* =================================
                            CONTENT CARDS

                            Original count: 3
                        ================================== */}

                        <div
                            className="
                                mt-5
                                space-y-4
                            "
                        >
                            {Array.from({
                                length: 3,
                            }).map(
                                (_, index) => (
                                    <div
                                        key={index}
                                        className="
                                            rounded-3xl
                                            border

                                            border-slate-200
                                            bg-white/90
                                            shadow-sm

                                            dark:border-white/[0.06]
                                            dark:bg-white/[0.02]
                                            dark:shadow-none

                                            p-5
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                items-start
                                                gap-4
                                            "
                                        >
                                            {/* =================
                                                CARD AVATAR
                                            ================== */}

                                            <SkeletonBlock
                                                className="
                                                    h-11
                                                    w-11
                                                    shrink-0
                                                "
                                            />

                                            {/* =================
                                                CARD CONTENT
                                            ================== */}

                                            <div
                                                className="
                                                    min-w-0
                                                    flex-1
                                                "
                                            >
                                                {/* TITLE */}

                                                <SkeletonBlock
                                                    className="
                                                        h-5
                                                        w-1/3
                                                    "
                                                />

                                                {/* DESCRIPTION */}

                                                <SkeletonBlock
                                                    className="
                                                        mt-4
                                                        h-4
                                                        w-full
                                                    "
                                                />

                                                <SkeletonBlock
                                                    className="
                                                        mt-2
                                                        h-4
                                                        w-3/4
                                                    "
                                                />

                                                {/* TAGS */}

                                                <div
                                                    className="
                                                        mt-5

                                                        flex
                                                        flex-wrap
                                                        gap-2
                                                    "
                                                >
                                                    <SkeletonBlock
                                                        className="
                                                            h-7
                                                            w-16
                                                            rounded-full
                                                        "
                                                    />

                                                    <SkeletonBlock
                                                        className="
                                                            h-7
                                                            w-20
                                                            rounded-full
                                                        "
                                                    />

                                                    <SkeletonBlock
                                                        className="
                                                            h-7
                                                            w-14
                                                            rounded-full
                                                        "
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default ProfileSkeleton;
