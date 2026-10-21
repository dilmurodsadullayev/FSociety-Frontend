
import React from "react";

import PageGridBackground from "../../ui/PageGridBackground";

// =========================================================
// FSOCIETY — POST DETAIL SKELETON
// =========================================================
//
// - Light / Dark Mode
// - Responsive 320px+
// - Shared FSociety background
// - Article + sidebar layout
// - Reduced motion
// - Accessible loading state
//
// Used by PostDetail.jsx during initial loading.
// =========================================================

const SKELETON_CLASS = `
  bg-slate-200/90
  dark:bg-slate-700/50

  motion-safe:animate-pulse
  motion-reduce:animate-none
`;

const PANEL_CLASS = `
  min-w-0
  rounded-2xl
  border
  border-slate-200
  bg-white/75

  dark:border-white/[0.07]
  dark:bg-white/[0.025]
`;

const SkeletonBlock = ({
  className = "",
}) => (
  <div
    aria-hidden="true"
    className={`
      ${SKELETON_CLASS}
      ${className}
    `}
  />
);

// =========================================================
// TEXT SKELETON
// =========================================================

const SkeletonText = ({
  lines = 4,
}) => {
  const widths = [
    "w-full",
    "w-11/12",
    "w-full",
    "w-4/5",
    "w-10/12",
    "w-3/5",
  ];

  const count = Math.min(
    8,
    Math.max(1, Number(lines) || 4)
  );

  return (
    <div
      aria-hidden="true"
      className="min-w-0 space-y-3"
    >
      {Array.from(
        { length: count },
        (_, index) => (
          <SkeletonBlock
            key={index}
            className={`
              h-3.5
              max-w-full
              rounded-md
              ${widths[index % widths.length]}
            `}
          />
        )
      )}
    </div>
  );
};

// =========================================================
// HERO SKELETON
// =========================================================

const PostHeroSkeleton = () => (
  <section
    aria-hidden="true"
    className="min-w-0"
  >
    {/* AUTHOR + META */}

    <div
      className="
        flex
        min-w-0
        flex-col
        gap-5

        sm:flex-row
        sm:items-start
        sm:justify-between
      "
    >
      <div
        className="
          flex
          min-w-0
          items-center
          gap-3
        "
      >
        <SkeletonBlock
          className="
            h-14
            w-14
            shrink-0
            rounded-2xl

            sm:h-16
            sm:w-16
          "
        />

        <div
          className="
            min-w-0
            flex-1
            space-y-3
          "
        >
          <SkeletonBlock
            className="
              h-5
              w-36
              max-w-full
              rounded-lg
            "
          />

          <SkeletonBlock
            className="
              h-3
              w-28
              max-w-full
              rounded-md
            "
          />
        </div>
      </div>

      {/* READING METADATA */}

      <div
        className="
          flex
          min-w-0
          flex-wrap
          items-center
          gap-2
        "
      >
        {[20, 24, 16].map((width, index) => (
          <SkeletonBlock
            key={index}
            className={`
              h-8
              rounded-lg
              ${
                width === 20
                  ? "w-20"
                  : width === 24
                    ? "w-24"
                    : "w-16"
              }
            `}
          />
        ))}
      </div>
    </div>

    {/* CATEGORY */}

    <SkeletonBlock
      className="
        mt-8
        h-8
        w-32
        rounded-full
      "
    />

    {/* TITLE */}

    <div
      className="
        mt-5
        max-w-3xl
        space-y-3
      "
    >
      <SkeletonBlock
        className="
          h-8
          w-full
          rounded-xl

          sm:h-11
        "
      />

      <SkeletonBlock
        className="
          h-8
          w-3/4
          rounded-xl

          sm:h-11
        "
      />
    </div>

    {/* MOBILE ACTION CARD */}

    <div
      className="
        mt-7
        rounded-2xl
        border
        border-slate-200
        bg-slate-50/75
        p-4

        lg:hidden

        dark:border-white/[0.07]
        dark:bg-white/[0.025]
      "
    >
      <SkeletonBlock
        className="
          h-4
          w-40
          max-w-full
          rounded-md
        "
      />

      <div className="mt-4 grid grid-cols-2 gap-2">
        <SkeletonBlock
          className="h-11 rounded-xl"
        />

        <SkeletonBlock
          className="h-11 rounded-xl"
        />
      </div>
    </div>
  </section>
);

// =========================================================
// ARTICLE SKELETON
// =========================================================

const PostArticleSkeleton = () => (
  <article
    aria-hidden="true"
    className={`
      mt-8
      p-4

      sm:p-6

      ${PANEL_CLASS}
    `}
  >
    <div className="space-y-8">
      <SkeletonText lines={5} />

      <div>
        <SkeletonBlock
          className="
            mb-4
            h-6
            w-2/5
            max-w-full
            rounded-lg
          "
        />

        <SkeletonText lines={6} />
      </div>

      {/* CODE EXAMPLE */}

      <div
        className="
          rounded-xl
          border
          border-slate-200
          bg-slate-100/90
          p-4

          dark:border-white/[0.07]
          dark:bg-[#080d16]
        "
      >
        <div className="mb-5 flex gap-1.5">
          {[0, 1, 2].map((item) => (
            <SkeletonBlock
              key={item}
              className="
                h-2
                w-2
                rounded-full
              "
            />
          ))}
        </div>

        <SkeletonBlock
          className="
            h-3
            w-1/3
            rounded-md
          "
        />

        <SkeletonBlock
          className="
            mt-3
            h-3
            w-4/5
            rounded-md
          "
        />

        <SkeletonBlock
          className="
            mt-3
            h-3
            w-3/5
            rounded-md
          "
        />
      </div>

      <SkeletonText lines={4} />
    </div>
  </article>
);

// =========================================================
// COMMENTS SKELETON
// =========================================================

const PostCommentsSkeleton = () => (
  <section
    aria-hidden="true"
    className="mt-8 min-w-0"
  >
    <div
      className="
        mb-5
        flex
        items-center
        gap-3
      "
    >
      <SkeletonBlock
        className="h-10 w-10 rounded-xl"
      />

      <SkeletonBlock
        className="
          h-5
          w-40
          max-w-full
          rounded-lg
        "
      />
    </div>

    <div
      className={`
        p-4
        sm:p-5
        ${PANEL_CLASS}
      `}
    >
      <SkeletonBlock
        className="
          h-24
          w-full
          rounded-xl
        "
      />

      <SkeletonBlock
        className="
          mt-4
          h-10
          w-28
          rounded-xl
        "
      />
    </div>

    <div
      className={`
        mt-4
        p-4
        sm:p-5
        ${PANEL_CLASS}
      `}
    >
      <div className="flex items-center gap-3">
        <SkeletonBlock
          className="
            h-10
            w-10
            shrink-0
            rounded-full
          "
        />

        <div className="flex-1 space-y-2">
          <SkeletonBlock
            className="
              h-4
              w-28
              rounded-md
            "
          />

          <SkeletonBlock
            className="
              h-3
              w-20
              rounded-md
            "
          />
        </div>
      </div>

      <div className="mt-4">
        <SkeletonText lines={2} />
      </div>
    </div>
  </section>
);

// =========================================================
// SIDEBAR SKELETON
// =========================================================

const SidebarCardSkeleton = ({
  children,
}) => (
  <div
    aria-hidden="true"
    className={`
      p-4
      sm:p-5
      ${PANEL_CLASS}
    `}
  >
    {children}
  </div>
);

const PostSidebarSkeleton = () => (
  <aside
    aria-hidden="true"
    className="
      min-w-0
      border-t
      border-slate-200
      bg-slate-50/40
      p-4

      sm:p-6

      lg:border-l
      lg:border-t-0

      dark:border-white/[0.07]
      dark:bg-black/[0.06]
    "
  >
    <div className="space-y-5">
      {/* STATISTICS */}

      <SidebarCardSkeleton>
        <SkeletonBlock
          className="
            mb-5
            h-5
            w-36
            rounded-lg
          "
        />

        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="
              mb-3
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-slate-200
              p-3

              last:mb-0

              dark:border-white/[0.07]
            "
          >
            <SkeletonBlock
              className="
                h-10
                w-10
                shrink-0
                rounded-xl
              "
            />

            <div className="flex-1 space-y-2">
              <SkeletonBlock
                className="
                  h-4
                  w-16
                  rounded-md
                "
              />

              <SkeletonBlock
                className="
                  h-3
                  w-24
                  rounded-md
                "
              />
            </div>
          </div>
        ))}
      </SidebarCardSkeleton>

      {/* AUTHOR */}

      <SidebarCardSkeleton>
        <SkeletonBlock
          className="
            mb-4
            h-5
            w-28
            rounded-md
          "
        />

        <div className="flex items-center gap-3">
          <SkeletonBlock
            className="
              h-14
              w-14
              shrink-0
              rounded-xl
            "
          />

          <div className="flex-1 space-y-3">
            <SkeletonBlock
              className="
                h-4
                w-28
                max-w-full
                rounded-md
              "
            />

            <SkeletonBlock
              className="
                h-3
                w-20
                max-w-full
                rounded-md
              "
            />
          </div>
        </div>
      </SidebarCardSkeleton>

      {/* BOOKMARK */}

      <SkeletonBlock
        className="
          h-12
          w-full
          rounded-xl
        "
      />

      {/* INFO */}

      <SidebarCardSkeleton>
        <SkeletonBlock
          className="
            mb-4
            h-4
            w-32
            rounded-md
          "
        />

        <SkeletonText lines={3} />
      </SidebarCardSkeleton>
    </div>
  </aside>
);

// =========================================================
// MAIN COMPONENT
// =========================================================

const PostDetailSkeleton = ({
  withBackground = true,
}) => {
  return (
    <div
      role="status"
      aria-label="Post yuklanmoqda"
      aria-busy="true"
      className="
        relative
        isolate
        min-h-screen
        min-h-[100dvh]
        w-full
        min-w-0
        overflow-hidden
        bg-[#f7faff]
        font-sans

        dark:bg-[#050a14]
      "
    >
      {withBackground && (
        <PageGridBackground
          showMonogram
          showCubes
        />
      )}

      <span className="sr-only">
        Post ma'lumotlari yuklanmoqda.
        Iltimos, kuting.
      </span>

      <main
        aria-hidden="true"
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1320px]
          min-w-0
          px-3
          pb-16
          pt-24

          sm:px-5
          sm:pt-28

          lg:px-6
        "
      >
        <div
          className="
            w-full
            min-w-0
            overflow-hidden
            rounded-[22px]
            border
            border-slate-200
            bg-white/90
            shadow-[0_24px_80px_rgba(15,23,42,0.08)]
            backdrop-blur-xl

            sm:rounded-[28px]

            dark:border-white/[0.08]
            dark:bg-[#0b1018]/95
            dark:shadow-[0_35px_100px_rgba(0,0,0,0.35)]
          "
        >
          <div
            className="
              grid
              min-w-0
              grid-cols-1

              lg:grid-cols-[minmax(0,1fr)_350px]
            "
          >
            {/* MAIN CONTENT */}

            <div
              className="
                min-w-0
                p-4

                sm:p-7

                lg:p-9
              "
            >
              <PostHeroSkeleton />

              <PostArticleSkeleton />

              <PostCommentsSkeleton />
            </div>

            {/* SIDEBAR */}

            <PostSidebarSkeleton />
          </div>
        </div>
      </main>
    </div>
  );
};

export default React.memo(PostDetailSkeleton);
