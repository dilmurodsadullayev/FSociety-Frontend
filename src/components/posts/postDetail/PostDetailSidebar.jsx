
import React from "react";

import {
  Link,
} from "react-router-dom";

import {
  Bookmark,
  Eye,
  Heart,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import {
  getUserAvatarUrl,
  handleUserImageError,
} from "../../../utils/imageUtils";

import {
  getAuthorName,
  safeNumber,
} from "./postDetailHelpers";

import PostDetailStatCard from "./PostDetailStatCard";

import PostDetailOwnerActions from "./PostDetailOwnerActions";

// =========================================================
// FSOCIETY — POST DETAIL SIDEBAR
// =========================================================
//
// Sections:
// - Owner management
// - Statistics
// - Like action
// - Views count
// - Comments count
// - Author information
// - Bookmark
// - FSociety Knowledge
//
// Features:
// - Light / Dark Mode
// - Responsive from 320px
// - Shared site typography
// - Accessible buttons
// - Desktop sticky layout
// - Existing callbacks preserved
//
// No API / Redux logic.
// =========================================================

// =========================================================
// SHARED STYLES
// =========================================================

const CARD_CLASS = `
  relative
  w-full
  min-w-0
  max-w-full
  overflow-hidden

  rounded-3xl
  border
  border-slate-200
  bg-white/85

  p-4

  shadow-[0_12px_35px_rgba(15,23,42,0.035)]

  sm:p-5

  dark:border-white/[0.08]
  dark:bg-white/[0.025]
  dark:shadow-none
`;

const SECTION_HEADING_CLASS = `
  text-sm
  font-black
  tracking-tight
  text-slate-900

  dark:text-white
`;

// =========================================================
// STATISTICS HEADER
// =========================================================

const StatisticsHeader = React.memo(
  function StatisticsHeader() {
    return (
      <div
        className="
          mb-5
          flex
          min-w-0
          items-center
          gap-3
        "
      >
        {/* ICON */}

        <div
          className="
            grid
            h-10
            w-10
            shrink-0
            place-items-center

            rounded-xl
            border
            border-indigo-200
            bg-indigo-50
            text-indigo-700

            dark:border-indigo-400/20
            dark:bg-indigo-500/10
            dark:text-indigo-300
          "
        >
          <ShieldCheck
            size={19}
            strokeWidth={1.9}
            aria-hidden="true"
          />
        </div>

        {/* TEXT */}

        <div className="min-w-0">
          <h3
            className={SECTION_HEADING_CLASS}
          >
            Statistika
          </h3>

          <p
            className="
              mt-1
              text-[11px]
              font-medium
              text-slate-500

              dark:text-slate-400
            "
          >
            Post faolligi
          </p>
        </div>
      </div>
    );
  }
);

// =========================================================
// POST STATISTICS
// =========================================================

const PostStatistics = React.memo(
  function PostStatistics({
    likesCount = 0,
    viewsCount = 0,
    commentsCount = 0,

    isLiked = false,
    isLiking = false,

    onLike,
  }) {
    return (
      <section
        aria-label="Post statistikasi"
        className={CARD_CLASS}
      >
        <StatisticsHeader />

        <div
          className="
            space-y-3
          "
        >
          {/* =================================
              LIKE
          ================================= */}

          <PostDetailStatCard
            icon={Heart}
            label={
              isLiked
                ? "Sizga yoqdi"
                : "Like bosish"
            }
            value={likesCount}
            tone="pink"

            isActive={isLiked}
            isLoading={isLiking}

            onClick={onLike}
            pressed={Boolean(isLiked)}
            ariaLabel={
              isLiked
                ? "Postdan likeni olib tashlash"
                : "Postga like bosish"
            }
          />

          {/* =================================
              VIEWS
          ================================= */}

          <PostDetailStatCard
            icon={Eye}
            label="marta ko‘rilgan"
            value={viewsCount}
            tone="cyan"
          />

          {/* =================================
              COMMENTS
          ================================= */}

          <PostDetailStatCard
            icon={MessageCircle}
            label="ta sharh"
            value={commentsCount}
            tone="emerald"
          />
        </div>
      </section>
    );
  }
);

// =========================================================
// AUTHOR CARD
// =========================================================

const PostAuthorCard = React.memo(
  function PostAuthorCard({
    author,
    authorName,
    authorImage,
  }) {
    // =====================================================
    // USERNAME
    // =====================================================

    const username =
      typeof author?.username === "string"
        ? author.username.trim()
        : "";

    const profileUrl = username
      ? `/${encodeURIComponent(username)}/profile/`
      : null;

    const displayUsername =
      username || "unknown";

    // =====================================================
    // AUTHOR CARD CONTENT
    // =====================================================

    const authorContent = (
      <>
        {/* AVATAR */}

        {authorImage ? (
          <img
            src={authorImage}
            alt={`${authorName} profil rasmi`}
            onError={handleUserImageError}
            className="
              h-14
              w-14
              shrink-0
              rounded-xl
              border
              border-slate-200
              bg-slate-100
              object-cover

              dark:border-white/[0.08]
              dark:bg-[#101827]
            "
          />
        ) : (
          <div
            aria-hidden="true"
            className="
              grid
              h-14
              w-14
              shrink-0
              place-items-center

              rounded-xl
              border
              border-slate-200
              bg-slate-100
              text-slate-500

              dark:border-white/[0.08]
              dark:bg-white/[0.04]
              dark:text-slate-400
            "
          >
            <UserRound size={24} />
          </div>
        )}

        {/* USER INFO */}

        <div
          className="
            min-w-0
            flex-1
          "
        >
          <p
            className="
              break-words
              text-sm
              font-black
              leading-5
              tracking-tight
              text-slate-900
              transition-colors

              group-hover:text-indigo-700

              dark:text-white
              dark:group-hover:text-indigo-300
            "
          >
            {authorName}
          </p>

          <p
            className="
              mt-1
              min-w-0
              break-all
              text-[11px]
              font-medium
              leading-5
              text-slate-500

              dark:text-slate-400
            "
          >
            @{displayUsername}
          </p>
        </div>
      </>
    );

    // =====================================================
    // RENDER
    // =====================================================

    return (
      <section
        aria-label="Post muallifi"
        className={CARD_CLASS}
      >
        {/* HEADER */}

        <div
          className="
            mb-4
            flex
            items-center
            gap-2.5
          "
        >
          <UserRound
            size={18}
            className="
              shrink-0
              text-indigo-600

              dark:text-indigo-300
            "
            aria-hidden="true"
          />

          <h3
            className={SECTION_HEADING_CLASS}
          >
            Muallif
          </h3>
        </div>

        {/* PROFILE */}

        {profileUrl ? (
          <Link
            to={profileUrl}
            aria-label={`${authorName} profilini ochish`}
            className="
              group
              flex
              w-full
              min-w-0
              items-center
              gap-3
              rounded-2xl
              border

              border-slate-200
              bg-slate-50/75

              p-3.5

              transition-colors
              duration-200

              hover:border-indigo-200
              hover:bg-indigo-50/75

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-indigo-500
              focus-visible:ring-offset-2

              dark:border-white/[0.08]
              dark:bg-black/20

              dark:hover:border-indigo-400/25
              dark:hover:bg-indigo-500/[0.06]

              dark:focus-visible:ring-offset-[#0b1018]

              motion-reduce:transition-none
            "
          >
            {authorContent}
          </Link>
        ) : (
          <div
            className="
              flex
              min-w-0
              items-center
              gap-3
              rounded-2xl
              border
              border-slate-200
              bg-slate-50/75
              p-3.5

              dark:border-white/[0.08]
              dark:bg-black/20
            "
          >
            {authorContent}
          </div>
        )}
      </section>
    );
  }
);

// =========================================================
// BOOKMARK BUTTON
// =========================================================

const PostBookmarkButton = React.memo(
  function PostBookmarkButton({
    onBookmark,
  }) {
    const canBookmark =
      typeof onBookmark === "function";

    return (
      <button
        type="button"
        onClick={
          canBookmark
            ? onBookmark
            : undefined
        }
        disabled={!canBookmark}
        title="Postni saqlab qolish"
        className="
          group
          inline-flex
          min-h-12
          w-full
          min-w-0
          items-center
          justify-center
          gap-2.5

          rounded-2xl
          border
          border-slate-200
          bg-white/85

          px-4
          py-3

          text-xs
          font-black
          text-slate-600

          shadow-[0_8px_30px_rgba(15,23,42,0.035)]

          transition-colors
          duration-200

          hover:border-indigo-200
          hover:bg-indigo-50
          hover:text-indigo-700

          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-indigo-500
          focus-visible:ring-offset-2

          active:scale-[0.99]

          disabled:cursor-not-allowed
          disabled:opacity-50

          dark:border-white/[0.08]
          dark:bg-white/[0.025]
          dark:text-slate-400
          dark:shadow-none

          dark:hover:border-indigo-400/25
          dark:hover:bg-indigo-500/[0.07]
          dark:hover:text-indigo-300

          dark:focus-visible:ring-offset-[#0b1018]

          motion-reduce:transition-none
        "
      >
        <Bookmark
          size={18}
          className="shrink-0"
          aria-hidden="true"
        />

        <span>Saqlab qolish</span>
      </button>
    );
  }
);

// =========================================================
// FSOCIETY KNOWLEDGE CARD
// =========================================================

const PostKnowledgeCard = React.memo(
  function PostKnowledgeCard() {
    return (
      <section
        aria-label="FSociety Knowledge"
        className="
          relative
          w-full
          min-w-0
          max-w-full
          overflow-hidden

          rounded-3xl
          border
          border-indigo-200
          bg-gradient-to-br
          from-indigo-50/90
          via-white/90
          to-purple-50/80

          p-4

          sm:p-5

          dark:border-indigo-400/[0.16]
          dark:from-indigo-500/[0.07]
          dark:via-[#101522]/95
          dark:to-purple-500/[0.05]
        "
      >
        {/* DECORATIVE GLOW */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-14
            -top-14
            h-36
            w-36
            rounded-full
            bg-indigo-400/10
            blur-[50px]

            dark:bg-indigo-500/15
          "
        />

        <div
          className="
            relative
            z-10
            min-w-0
          "
        >
          {/* HEADER */}

          <div
            className="
              mb-3
              flex
              min-w-0
              items-center
              gap-2
            "
          >
            <Sparkles
              size={18}
              className="
                shrink-0
                text-indigo-600

                dark:text-indigo-300
              "
              aria-hidden="true"
            />

            <h3
              className="
                min-w-0
                break-words

                font-mono
                text-[11px]
                font-black
                uppercase
                tracking-[0.10em]
                text-indigo-700

                dark:text-indigo-300
              "
            >
              F.Society Knowledge
            </h3>
          </div>

          {/* DESCRIPTION */}

          <p
            className="
              break-words
              text-xs
              font-medium
              leading-6
              text-slate-600

              dark:text-slate-400
            "
          >
            Bilim ulashish community kuchini
            oshiradi. Foydali postlarga like
            bosing va muhokamada qatnashing.
          </p>
        </div>
      </section>
    );
  }
);

// =========================================================
// MAIN POST DETAIL SIDEBAR
// =========================================================

const PostDetailSidebar = ({
  postData = null,

  author: suppliedAuthor,
  authorName: suppliedAuthorName,
  authorImage: suppliedAuthorImage,

  isOwner = false,

  isLiking = false,

  isUpdating = false,
  isDeleting = false,

  onLike,
  onBookmark,

  onEdit,
  onDelete,

  className = "",
}) => {
  // =======================================================
  // POST VALUES
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

  const likesCount = safeNumber(
    postData?.likes_count
  );

  const viewsCount = safeNumber(
    postData?.views_count
  );

  const commentsCount = safeNumber(
    postData?.comments_count
  );

  const isLiked = Boolean(
    postData?.is_liked_by_user
  );

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <aside
      aria-label="Post haqida qo‘shimcha ma'lumotlar"
      className={`
        w-full
        min-w-0
        max-w-full

        border-t
        border-slate-200

        bg-slate-50/45
        p-4

        sm:p-6

        lg:border-l
        lg:border-t-0
        lg:p-7

        dark:border-white/[0.07]
        dark:bg-black/[0.08]

        ${className}
      `}
    >
      {/* =====================================
          SIDEBAR CONTENT
      ===================================== */}

      <div
        className="
          w-full
          min-w-0
          space-y-5

          lg:sticky
          lg:top-24
        "
      >
        {/* =================================
            OWNER ACTIONS — DESKTOP
        ================================= */}

        {isOwner && (
          <div
            className="
              hidden
              lg:block
            "
          >
            <PostDetailOwnerActions
              onEdit={onEdit}
              onDelete={onDelete}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
            />
          </div>
        )}

        {/* =================================
            STATISTICS
        ================================= */}

        <PostStatistics
          likesCount={likesCount}
          viewsCount={viewsCount}
          commentsCount={commentsCount}

          isLiked={isLiked}
          isLiking={isLiking}

          onLike={onLike}
        />

        {/* =================================
            AUTHOR
        ================================= */}

        <PostAuthorCard
          author={author}
          authorName={authorName}
          authorImage={authorImage}
        />

        {/* =================================
            BOOKMARK
        ================================= */}

        <PostBookmarkButton
          onBookmark={onBookmark}
        />

        {/* =================================
            FSOCIETY KNOWLEDGE
        ================================= */}

        <PostKnowledgeCard />
      </div>
    </aside>
  );
};

export default React.memo(
  PostDetailSidebar
);
