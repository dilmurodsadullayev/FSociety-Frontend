
import React, {
  useMemo,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  BookOpen,
  Check,
  Clock3,
  FileText,
  Globe2,
  Link2,
  LockKeyhole,
  UserRound,
} from "lucide-react";

import timeAgo from "../../../utils/timeAgo";

import {
  getUserAvatarUrl,
  handleUserImageError,
} from "../../../utils/imageUtils";

import {
  getArticleMeta,
  getAuthorName,
  getPostTypeDisplay,
  safeNumber,
} from "./postDetailHelpers";

// =========================================================
// FSOCIETY — POST DETAIL HERO
// =========================================================
//
// Responsibilities:
// - Author avatar and profile link
// - Author display name
// - Post creation date
// - Reading time
// - Word count
// - Visibility
// - Copy link
// - Post category
// - Post title
// - Optional mobile owner actions
//
// Features:
// - Light / Dark Mode
// - Responsive from 320px
// - Space Grotesk / site typography
// - Lucide icons
// - Accessible navigation and actions
//
// No Redux, API or modal state.
// =========================================================

// =========================================================
// AUTHOR DETAILS
// =========================================================

const AuthorDetails = React.memo(
  function AuthorDetails({
    author,
    authorName,
    authorImage,
    createdAt,
  }) {
    const username =
      typeof author?.username === "string"
        ? author.username.trim()
        : "";

    const displayUsername =
      username || "unknown";

    const profileUrl = username
      ? `/${encodeURIComponent(username)}/profile/`
      : null;

    const avatar = (
      <img
        src={authorImage}
        alt={
          username
            ? `${authorName} profil rasmi`
            : "Muallif rasmi"
        }
        onError={handleUserImageError}
        className="
          h-14
          w-14
          shrink-0
          rounded-2xl
          border
          border-slate-200
          bg-slate-100
          object-cover
          shadow-sm

          sm:h-16
          sm:w-16

          dark:border-white/[0.10]
          dark:bg-[#111827]
          dark:shadow-[0_12px_25px_rgba(0,0,0,0.20)]
        "
      />
    );

    const name = (
      <span
        className="
          block
          min-w-0
          break-words
          text-base
          font-black
          leading-snug
          tracking-tight
          text-slate-900
          transition-colors

          sm:text-lg

          dark:text-white
        "
      >
        {authorName}
      </span>
    );

    const formattedDate = createdAt
      ? timeAgo(createdAt)
      : "Sana noma'lum";

    return (
      <div
        className="
          flex
          w-full
          min-w-0
          items-center
          gap-3

          sm:gap-4
        "
      >
        {/* =====================================
            AUTHOR AVATAR
        ===================================== */}

        {profileUrl ? (
          <Link
            to={profileUrl}
            aria-label={`${authorName} profilini ochish`}
            className="
              shrink-0
              rounded-2xl

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-indigo-500
              focus-visible:ring-offset-2

              dark:focus-visible:ring-offset-[#0b1018]
            "
          >
            {avatar}
          </Link>
        ) : (
          <div className="shrink-0">
            {avatar}
          </div>
        )}

        {/* =====================================
            AUTHOR INFO
        ===================================== */}

        <div className="min-w-0 flex-1">
          {profileUrl ? (
            <Link
              to={profileUrl}
              className="
                block
                min-w-0
                rounded-md

                hover:[&>span]:text-indigo-700
                dark:hover:[&>span]:text-indigo-300

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500
              "
            >
              {name}
            </Link>
          ) : (
            name
          )}

          {/* =================================
              USERNAME + DATE
          ================================= */}

          <div
            className="
              mt-1.5
              flex
              min-w-0
              flex-wrap
              items-center
              gap-x-3
              gap-y-1.5

              text-xs
              font-medium
              leading-5
              text-slate-500

              dark:text-slate-400
            "
          >
            <span
              className="
                inline-flex
                min-w-0
                items-center
                gap-1
              "
            >
              <UserRound
                size={13}
                className="
                  shrink-0
                  text-indigo-600

                  dark:text-indigo-300
                "
                aria-hidden="true"
              />

              <span
                className="
                  min-w-0
                  break-all
                "
              >
                @{displayUsername}
              </span>
            </span>

            <span
              aria-hidden="true"
              className="
                hidden
                h-1
                w-1
                shrink-0
                rounded-full
                bg-slate-300

                sm:block

                dark:bg-slate-600
              "
            />

            <span
              className="
                inline-flex
                items-center
                gap-1.5
              "
            >
              <Clock3
                size={13}
                className="
                  shrink-0
                  text-slate-400

                  dark:text-slate-500
                "
                aria-hidden="true"
              />

              {formattedDate}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

// =========================================================
// ARTICLE META
// =========================================================

const ArticleMeta = React.memo(
  function ArticleMeta({
    wordCount = 0,
    readingTime = 1,

    copied = false,
    onCopy,

    isPublic = true,
  }) {
    const displayWords =
      safeNumber(wordCount)
        .toLocaleString("uz-UZ");

    const displayReadingTime =
      Math.max(
        1,
        Math.ceil(safeNumber(readingTime))
      );

    const canCopy =
      typeof onCopy === "function";

    return (
      <div
        className="
          flex
          w-full
          min-w-0
          flex-wrap
          items-center
          gap-x-3
          gap-y-2

          text-[11px]
          font-semibold
          leading-5
          text-slate-500

          sm:gap-x-4

          lg:justify-end

          dark:text-slate-400
        "
      >
        {/* =====================================
            READING TIME
        ===================================== */}

        <div
          title="Taxminiy o‘qish vaqti"
          className="
            inline-flex
            items-center
            gap-1.5
          "
        >
          <BookOpen
            size={15}
            className="
              shrink-0
              text-indigo-600

              dark:text-indigo-300
            "
            aria-hidden="true"
          />

          <strong
            className="
              font-black
              text-slate-800

              dark:text-slate-200
            "
          >
            {displayReadingTime}
          </strong>

          <span>daqiqalik</span>
        </div>

        {/* DIVIDER */}

        <span
          aria-hidden="true"
          className="
            hidden
            h-4
            w-px
            bg-slate-200

            sm:block

            dark:bg-white/[0.10]
          "
        />

        {/* =====================================
            WORD COUNT
        ===================================== */}

        <div
          title="Postdagi so‘zlar soni"
          className="
            inline-flex
            items-center
            gap-1.5
          "
        >
          <FileText
            size={15}
            className="
              shrink-0
              text-purple-600

              dark:text-purple-300
            "
            aria-hidden="true"
          />

          <strong
            className="
              font-black
              text-slate-800

              dark:text-slate-200
            "
          >
            {displayWords}
          </strong>

          <span>so‘z</span>
        </div>

        {/* DIVIDER */}

        <span
          aria-hidden="true"
          className="
            hidden
            h-4
            w-px
            bg-slate-200

            sm:block

            dark:bg-white/[0.10]
          "
        />

        {/* =====================================
            POST VISIBILITY
        ===================================== */}

        <div
          className="
            inline-flex
            items-center
            gap-1.5
          "
        >
          {isPublic ? (
            <Globe2
              size={15}
              className="
                shrink-0
                text-emerald-600

                dark:text-emerald-300
              "
              aria-hidden="true"
            />
          ) : (
            <LockKeyhole
              size={15}
              className="
                shrink-0
                text-amber-600

                dark:text-amber-300
              "
              aria-hidden="true"
            />
          )}

          <span
            className="
              font-bold
              text-slate-700

              dark:text-slate-300
            "
          >
            {isPublic ? "Ochiq" : "Cheklangan"}
          </span>
        </div>

        {/* =====================================
            COPY LINK
        ===================================== */}

        {canCopy && (
          <button
            type="button"
            onClick={onCopy}
            title={
              copied
                ? "Havola nusxalandi"
                : "Post havolasini nusxalash"
            }
            aria-label={
              copied
                ? "Post havolasi nusxalandi"
                : "Post havolasini nusxalash"
            }
            className={`
              inline-flex
              min-h-11
              items-center
              justify-center
              gap-2

              rounded-xl
              border
              px-3
              py-2

              text-[11px]
              font-bold

              transition-colors
              duration-200

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-indigo-500
              focus-visible:ring-offset-2

              dark:focus-visible:ring-offset-[#0b1018]

              ${
                copied
                  ? `
                    border-emerald-200
                    bg-emerald-50
                    text-emerald-700

                    dark:border-emerald-400/20
                    dark:bg-emerald-400/[0.07]
                    dark:text-emerald-300
                  `
                  : `
                    border-slate-200
                    bg-white/70
                    text-slate-600

                    hover:border-indigo-200
                    hover:bg-indigo-50
                    hover:text-indigo-700

                    dark:border-white/[0.10]
                    dark:bg-white/[0.035]
                    dark:text-slate-400

                    dark:hover:border-indigo-400/20
                    dark:hover:bg-indigo-400/[0.08]
                    dark:hover:text-indigo-300
                  `
              }
            `}
          >
            {copied ? (
              <Check
                size={15}
                className="shrink-0"
                aria-hidden="true"
              />
            ) : (
              <Link2
                size={15}
                className="shrink-0"
                aria-hidden="true"
              />
            )}

            <span>
              {copied
                ? "Nusxalandi"
                : "Havolani olish"}
            </span>
          </button>
        )}

        {/* ACCESSIBLE FEEDBACK */}

        <span
          role="status"
          aria-live="polite"
          className="sr-only"
        >
          {copied
            ? "Post havolasi nusxalandi."
            : ""}
        </span>
      </div>
    );
  }
);

// =========================================================
// MAIN POST DETAIL HERO
// =========================================================

const PostDetailHero = ({
  postData,

  author: suppliedAuthor,
  authorName: suppliedAuthorName,
  authorImage: suppliedAuthorImage,

  typeDisplay: suppliedTypeDisplay,
  articleMeta: suppliedArticleMeta,

  copied = false,
  onCopy,

  isOwner = false,
  mobileOwnerActions = null,

  className = "",
}) => {
  // =======================================================
  // RESOLVE AUTHOR
  // =======================================================

  const author =
    suppliedAuthor ??
    postData?.user ??
    {};

  const authorName =
    suppliedAuthorName ??
    getAuthorName(author);

  const authorImage =
    suppliedAuthorImage ??
    getUserAvatarUrl(author);

  // =======================================================
  // RESOLVE CATEGORY
  // =======================================================

  const typeDisplay =
    suppliedTypeDisplay ??
    getPostTypeDisplay(
      postData?.post_type
    );

  const CategoryIcon =
    typeDisplay.Icon ?? FileText;

  // =======================================================
  // ARTICLE STATISTICS
  // =======================================================

  const calculatedMeta = useMemo(
    () => getArticleMeta(
      postData?.content
    ),
    [postData?.content]
  );

  const articleMeta =
    suppliedArticleMeta ??
    calculatedMeta;

  // =======================================================
  // POST VISIBILITY
  // =======================================================

  const isPublic =
    postData?.is_public !== false;

  // =======================================================
  // TITLE
  // =======================================================

  const title =
    typeof postData?.title === "string" &&
    postData.title.trim()
      ? postData.title
      : "Sarlavhasiz post";

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <header
      className={`
        relative
        w-full
        min-w-0
        max-w-full

        font-sans

        ${className}
      `}
      style={{
        fontFamily:
          "var(--font-sans, 'Space Grotesk', sans-serif)",
      }}
    >
      {/* =====================================
          AUTHOR AND ARTICLE META
      ===================================== */}

      <div
        className="
          flex
          w-full
          min-w-0
          flex-col
          gap-5

          lg:flex-row
          lg:items-start
          lg:justify-between
          lg:gap-6
        "
      >
        {/* AUTHOR */}

        <div
          className="
            w-full
            min-w-0

            lg:flex-1
          "
        >
          <AuthorDetails
            author={author}
            authorName={authorName}
            authorImage={authorImage}
            createdAt={postData?.created_at}
          />
        </div>

        {/* META */}

        <div
          className="
            w-full
            min-w-0

            lg:w-auto
            lg:max-w-[49%]
          "
        >
          <ArticleMeta
            wordCount={
              articleMeta.words
            }
            readingTime={
              articleMeta.readingTime
            }
            copied={copied}
            onCopy={onCopy}
            isPublic={isPublic}
          />
        </div>
      </div>

      {/* =====================================
          POST CATEGORY
      ===================================== */}

      <div
        className="
          mt-6
          flex
          min-w-0
          flex-wrap

          sm:mt-7
        "
      >
        <span
          className={`
            inline-flex
            max-w-full
            min-w-0
            items-center
            gap-2
            rounded-full
            border

            px-3
            py-2

            text-[10px]
            font-black
            uppercase
            tracking-[0.10em]

            ${typeDisplay.className}
          `}
        >
          <CategoryIcon
            size={15}
            strokeWidth={2}
            className="shrink-0"
            aria-hidden="true"
          />

          <span
            className="
              min-w-0
              break-words
            "
          >
            {typeDisplay.name}
          </span>
        </span>
      </div>

      {/* =====================================
          POST TITLE
      ===================================== */}

      <h1
        className="
          mt-5
          w-full
          min-w-0
          max-w-4xl

          break-words
          [overflow-wrap:anywhere]

          bg-gradient-to-r
          from-slate-950
          via-indigo-800
          to-purple-700

          bg-clip-text
          text-transparent

          text-[clamp(1.75rem,4.6vw,3rem)]
          font-black
          leading-[1.15]
          tracking-[-0.035em]

          sm:mt-6

          dark:from-white
          dark:via-indigo-100
          dark:to-purple-300
        "
      >
        {title}
      </h1>

      {/* =====================================
          MOBILE OWNER ACTIONS
      ===================================== */}

      {isOwner && mobileOwnerActions && (
        <div
          className="
            mt-6
            w-full
            min-w-0

            lg:hidden
          "
        >
          {mobileOwnerActions}
        </div>
      )}
    </header>
  );
};

export default React.memo(PostDetailHero);
