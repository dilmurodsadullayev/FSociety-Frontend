
import React from "react";

// =========================================================
// FSOCIETY — PROJECT DETAIL LOADING SKELETON
// =========================================================
//
// Features:
// - Light / Dark Mode
// - Responsive from 320px
// - Project header skeleton
// - Statistics placeholders
// - Project gallery skeleton
// - Description and features
// - Collaboration placeholders
// - Promotion / author / technology sidebar
// - Reduced motion support
// - Accessibility
//
// Existing prop:
// - styleTag
//
// No API, Redux or interactive behavior.
// =========================================================

// =========================================================
// SHARED STYLES
// =========================================================

const SKELETON_BASE = `
  bg-[#e2e8f1]
  dark:bg-[#263244]

  motion-safe:animate-pulse
  motion-reduce:animate-none
`;

const CARD_CLASS = `
  min-w-0
  overflow-hidden
  rounded-2xl
  border
  border-[#dce5f0]
  bg-white/80
  p-4

  sm:p-5

  dark:border-white/[0.08]
  dark:bg-white/[0.025]
`;

// =========================================================
// SKELETON BLOCK
// =========================================================

const SkeletonBlock = React.memo(
  function SkeletonBlock({
    className = "",
  }) {
    return (
      <div
        aria-hidden="true"
        className={`
          ${SKELETON_BASE}
          ${className}
        `}
      />
    );
  }
);

// =========================================================
// SKELETON SECTION HEADER
// =========================================================

const SkeletonSectionHeader = React.memo(
  function SkeletonSectionHeader({
    width = "w-36",
  }) {
    return (
      <div
        aria-hidden="true"
        className="
          mb-5
          flex
          min-w-0
          items-center
          gap-3
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

        <SkeletonBlock
          className={`
            h-5
            max-w-full
            rounded-lg
            ${width}
          `}
        />
      </div>
    );
  }
);

// =========================================================
// SKELETON TEXT
// =========================================================

const SkeletonText = React.memo(
  function SkeletonText({
    lines = 3,
    className = "",
  }) {
    const safeLines = Math.max(
      1,
      Math.min(8, Number(lines) || 3)
    );

    return (
      <div
        aria-hidden="true"
        className={`
          w-full
          min-w-0
          space-y-3
          ${className}
        `}
      >
        {Array.from(
          { length: safeLines },
          (_, index) => {
            const isLast =
              index === safeLines - 1;

            return (
              <SkeletonBlock
                key={index}
                className={`
                  h-3.5
                  rounded-md
                  ${
                    isLast
                      ? "w-3/5"
                      : "w-full"
                  }
                `}
              />
            );
          }
        )}
      </div>
    );
  }
);

// =========================================================
// HEADER SKELETON
// =========================================================

const ProjectHeaderSkeleton = React.memo(
  function ProjectHeaderSkeleton() {
    return (
      <header
        aria-hidden="true"
        className="
          min-w-0
          border-b
          border-[#dce5f0]
          px-4
          py-5

          sm:px-6
          sm:py-7

          lg:px-10
          lg:py-9

          dark:border-white/[0.07]
        "
      >
        {/* =====================================
            TITLE AND ACTIONS
        ===================================== */}

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
          {/* TITLE */}

          <div
            className="
              w-full
              min-w-0
              flex-1
            "
          >
            <SkeletonBlock
              className="
                h-3
                w-28
                rounded-md
              "
            />

            <SkeletonBlock
              className="
                mt-4
                h-8
                w-[85%]
                max-w-[460px]
                rounded-xl

                sm:h-10
              "
            />

            <SkeletonBlock
              className="
                mt-3
                h-3.5
                w-full
                max-w-[550px]
                rounded-md
              "
            />

            <SkeletonBlock
              className="
                mt-2
                h-3.5
                w-3/4
                max-w-[400px]
                rounded-md
              "
            />
          </div>

          {/* ACTIONS */}

          <div
            className="
              flex
              shrink-0
              items-center
              gap-2
            "
          >
            <SkeletonBlock
              className="
                h-11
                w-24
                rounded-xl
              "
            />

            <SkeletonBlock
              className="
                h-11
                w-11
                rounded-xl
              "
            />
          </div>
        </div>

        {/* =====================================
            STATISTICS
        ===================================== */}

        <div
          className="
            mt-6
            flex
            min-w-0
            flex-wrap
            gap-2
          "
        >
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="
                flex
                h-11
                items-center
                gap-2
                rounded-xl
                border
                border-[#dce5f0]
                bg-slate-50/80
                px-3

                dark:border-white/[0.08]
                dark:bg-white/[0.035]
              "
            >
              <SkeletonBlock
                className="
                  h-4
                  w-4
                  rounded-md
                "
              />

              <SkeletonBlock
                className="
                  h-3
                  w-12
                  rounded-md
                "
              />
            </div>
          ))}
        </div>

        {/* =====================================
            PROJECT IMAGE / GALLERY
        ===================================== */}

        <div
          className="
            relative
            mt-6
            w-full
            min-w-0
            overflow-hidden
            rounded-2xl
            border
            border-[#dce5f0]
            bg-slate-100/75

            dark:border-white/[0.08]
            dark:bg-[#111a28]
          "
        >
          <SkeletonBlock
            className="
              aspect-video
              w-full
              rounded-none

              sm:aspect-[21/9]
            "
          />

          {/* GALLERY INDICATORS */}

          <div
            className="
              pointer-events-none
              absolute
              bottom-3
              left-1/2
              flex
              -translate-x-1/2
              items-center
              gap-2

              sm:bottom-4
            "
          >
            {[0, 1, 2].map((item) => (
              <SkeletonBlock
                key={item}
                className={`
                  h-2
                  rounded-full
                  ${
                    item === 0
                      ? "w-6"
                      : "w-2"
                  }
                `}
              />
            ))}
          </div>
        </div>
      </header>
    );
  }
);

// =========================================================
// DESCRIPTION SKELETON
// =========================================================

const ProjectDescriptionSkeleton = React.memo(
  function ProjectDescriptionSkeleton() {
    return (
      <section
        aria-hidden="true"
        className="
          min-w-0
          p-4

          sm:p-6

          lg:p-8
        "
      >
        {/* INTRODUCTION */}

        <div className={CARD_CLASS}>
          <SkeletonSectionHeader
            width="w-44"
          />

          <SkeletonText lines={4} />
        </div>

        {/* MAIN DESCRIPTION */}

        <div className="mt-5 min-w-0">
          <SkeletonSectionHeader
            width="w-40"
          />

          <SkeletonText lines={5} />
        </div>

        {/* FEATURES */}

        <div className="mt-8 min-w-0">
          <SkeletonSectionHeader
            width="w-48"
          />

          <div
            className="
              grid
              min-w-0
              grid-cols-1
              gap-3

              sm:grid-cols-2
            "
          >
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className={`
                  flex
                  min-w-0
                  items-start
                  gap-3
                  ${CARD_CLASS}
                `}
              >
                <SkeletonBlock
                  className="
                    h-8
                    w-8
                    shrink-0
                    rounded-lg
                  "
                />

                <div
                  className="
                    min-w-0
                    flex-1
                    space-y-2
                  "
                >
                  <SkeletonBlock
                    className="
                      h-3.5
                      w-full
                      rounded-md
                    "
                  />

                  <SkeletonBlock
                    className="
                      h-3.5
                      w-3/4
                      rounded-md
                    "
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
);

// =========================================================
// COLLABORATION SKELETON
// =========================================================

const ProjectCollaborationSkeleton = React.memo(
  function ProjectCollaborationSkeleton() {
    return (
      <section
        aria-hidden="true"
        className="
          min-w-0
          border-t
          border-[#dce5f0]
          p-4

          sm:p-6
          lg:p-8

          dark:border-white/[0.07]
        "
      >
        <SkeletonSectionHeader
          width="w-44"
        />

        <div
          className="
            grid
            min-w-0
            grid-cols-1
            gap-3

            sm:grid-cols-2
          "
        >
          {[0, 1].map((item) => (
            <div
              key={item}
              className={`
                flex
                min-w-0
                items-center
                gap-3
                ${CARD_CLASS}
              `}
            >
              {/* AVATAR */}

              <SkeletonBlock
                className="
                  h-12
                  w-12
                  shrink-0
                  rounded-full
                "
              />

              {/* USER INFO */}

              <div
                className="
                  min-w-0
                  flex-1
                  space-y-2
                "
              >
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
          ))}
        </div>
      </section>
    );
  }
);

// =========================================================
// SIDEBAR SKELETON
// =========================================================

const ProjectSidebarSkeleton = React.memo(
  function ProjectSidebarSkeleton() {
    return (
      <aside
        aria-hidden="true"
        className="
          w-full
          min-w-0
          border-t
          border-[#dce5f0]
          p-4

          sm:p-6

          lg:p-8

          xl:border-l
          xl:border-t-0

          dark:border-white/[0.07]
        "
      >
        <div className="min-w-0 space-y-5">
          {/* =====================================
              PROMOTION
          ===================================== */}

          <section className={CARD_CLASS}>
            <SkeletonSectionHeader
              width="w-40"
            />

            <SkeletonText lines={2} />

            <div
              className="
                mt-4
                grid
                grid-cols-2
                gap-2
              "
            >
              {[0, 1].map((item) => (
                <SkeletonBlock
                  key={item}
                  className="
                    h-20
                    rounded-xl
                  "
                />
              ))}
            </div>

            <SkeletonBlock
              className="
                mt-4
                h-11
                w-full
                rounded-xl
              "
            />
          </section>

          {/* =====================================
              AUTHOR
          ===================================== */}

          <section className={CARD_CLASS}>
            <SkeletonSectionHeader
              width="w-28"
            />

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
                    h-4
                    w-2/3
                    rounded-md
                  "
                />

                <SkeletonBlock
                  className="
                    h-3
                    w-1/2
                    rounded-md
                  "
                />
              </div>
            </div>
          </section>

          {/* =====================================
              LANGUAGES
          ===================================== */}

          <section className={CARD_CLASS}>
            <SkeletonSectionHeader
              width="w-32"
            />

            <div
              className="
                flex
                min-w-0
                flex-wrap
                gap-2
              "
            >
              {[20, 24, 16].map((width) => (
                <SkeletonBlock
                  key={width}
                  className={`
                    h-8
                    rounded-lg
                    ${width === 20
                      ? "w-20"
                      : width === 24
                        ? "w-24"
                        : "w-16"}
                  `}
                />
              ))}
            </div>
          </section>

          {/* =====================================
              TECHNOLOGIES
          ===================================== */}

          <section className={CARD_CLASS}>
            <SkeletonSectionHeader
              width="w-36"
            />

            <div
              className="
                flex
                min-w-0
                flex-wrap
                gap-2
              "
            >
              <SkeletonBlock
                className="
                  h-8
                  w-20
                  rounded-lg
                "
              />

              <SkeletonBlock
                className="
                  h-8
                  w-28
                  rounded-lg
                "
              />

              <SkeletonBlock
                className="
                  h-8
                  w-16
                  rounded-lg
                "
              />
            </div>
          </section>

          {/* =====================================
              EXTERNAL LINKS
          ===================================== */}

          <section className={CARD_CLASS}>
            <SkeletonSectionHeader
              width="w-36"
            />

            <SkeletonBlock
              className="
                h-11
                w-full
                rounded-xl
              "
            />

            <SkeletonBlock
              className="
                mt-3
                h-11
                w-full
                rounded-xl
              "
            />
          </section>
        </div>
      </aside>
    );
  }
);

// =========================================================
// MAIN PROJECT LOADING SKELETON
// =========================================================

const ProjectLoadingSkeleton = ({
  styleTag = null,
}) => {
  return (
    <>
      {/* =====================================
          LEGACY STYLE PROP
          Kept for backward compatibility.
      ===================================== */}

      {styleTag}

      {/* =====================================
          PAGE CONTENT
      ===================================== */}

      <main
        role="status"
        aria-label="Loyiha ma'lumotlari yuklanmoqda"
        aria-busy="true"
        className="
          relative
          z-10
          mx-auto
          w-full
          min-w-0
          max-w-[1520px]

          px-4
          pb-16
          pt-24

          sm:px-6
          sm:pb-20

          md:pt-28

          xl:px-8
        "
      >
        {/* SCREEN READER MESSAGE */}

        <span className="sr-only">
          Loyiha ma'lumotlari yuklanmoqda.
          Iltimos, kuting.
        </span>

        {/* =====================================
            MAIN CONTAINER
        ===================================== */}

        <div
          aria-hidden="true"
          className="
            relative
            w-full
            min-w-0
            max-w-full
            overflow-hidden

            rounded-[22px]
            border
            border-[#dce5f0]

            bg-white/90

            shadow-[0_24px_70px_rgba(15,23,42,0.065)]

            backdrop-blur-sm

            sm:rounded-[28px]

            dark:border-white/[0.07]
            dark:bg-[#0b1018]/95

            dark:shadow-[0_40px_110px_rgba(0,0,0,0.35)]
          "
        >
          {/* HEADER */}

          <ProjectHeaderSkeleton />

          {/* CONTENT GRID */}

          <div
            className="
              grid
              w-full
              min-w-0
              grid-cols-1

              xl:grid-cols-[minmax(0,1fr)_520px]
            "
          >
            {/* MAIN COLUMN */}

            <div
              className="
                w-full
                min-w-0
              "
            >
              <ProjectDescriptionSkeleton />

              <ProjectCollaborationSkeleton />
            </div>

            {/* SIDEBAR */}

            <ProjectSidebarSkeleton />
          </div>
        </div>
      </main>
    </>
  );
};

export default React.memo(
  ProjectLoadingSkeleton
);
