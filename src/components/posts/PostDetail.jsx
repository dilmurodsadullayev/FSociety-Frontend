
import React, { useMemo } from "react";

import { useSelector } from "react-redux";

import { useParams } from "react-router-dom";

// =========================================================
// SHARED UI
// =========================================================

import PageGridBackground from "../ui/PageGridBackground";

import DeleteConfirmationModal from "../DeleteConfirmationModal";

// =========================================================
// POST MODALS
// =========================================================

import CreatePostModal from "./CreatePostModal";

// =========================================================
// COMMENTS
// =========================================================

import {
  PostCommentsSection,
} from "./comments";

// =========================================================
// POST DETAIL COMPONENTS
// =========================================================

import PostDetailSkeleton from "./postDetail/PostDetailSkeleton";

import PostDetailErrorState from "./postDetail/PostDetailErrorState";

import PostDetailHero from "./postDetail/PostDetailHero";

import PostDetailArticle from "./postDetail/PostDetailArticle";

import PostDetailSidebar from "./postDetail/PostDetailSidebar";

import PostDetailOwnerActions from "./postDetail/PostDetailOwnerActions";

// =========================================================
// POST DETAIL HOOKS
// =========================================================

import usePostDetailData from "./postDetail/hooks/usePostDetailData";

import usePostDetailActions from "./postDetail/hooks/usePostDetailActions";

// =========================================================
// HELPERS
// =========================================================

import {
  getArticleMeta,
  getAuthorName,
  getPostTypeDisplay,
} from "./postDetail/postDetailHelpers";

import {
  getUserAvatarUrl,
} from "../../utils/imageUtils";

// =========================================================
// FSOCIETY — POST DETAIL
// =========================================================
//
// Features:
//
// - Post Detail API
// - Redux state synchronization
// - Light / Dark Mode
// - Responsive 320px+
// - Shared PageGridBackground
// - Space Grotesk / JetBrains Mono
// - Post Detail Skeleton
// - Human-friendly error states
// - Post Hero
// - Sanitized article HTML
// - Post Comments
// - Statistics and Like
// - Author information
// - Owner actions
// - Edit Post Modal
// - Delete Confirmation Modal
// - Copy Post Link
//
// Original API contracts are preserved.
//
// =========================================================

// =========================================================
// SHARED STYLES
// =========================================================

const PAGE_CLASS = `
  relative
  isolate
  min-h-screen
  min-h-[100dvh]
  w-full
  min-w-0
  overflow-x-hidden

  bg-[#f7faff]
  font-sans
  text-slate-900

  dark:bg-[#050a14]
  dark:text-white
`;

const CONTAINER_CLASS = `
  relative
  z-10

  mx-auto
  w-full
  min-w-0
  max-w-[1320px]

  px-3
  pb-16
  pt-24

  sm:px-5
  sm:pb-20
  sm:pt-28

  lg:px-6
`;

const PANEL_CLASS = `
  relative
  w-full
  min-w-0
  max-w-full
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

  dark:shadow-[0_35px_110px_rgba(0,0,0,0.38)]
`;

const MAIN_CONTENT_CLASS = `
  w-full
  min-w-0
  max-w-full

  p-4

  sm:p-7

  lg:border-r
  lg:border-slate-200
  lg:p-9

  dark:lg:border-white/[0.07]
`;

// =========================================================
// SELECTORS
// =========================================================

const selectAuthState = (state) =>
  state.auth;

// =========================================================
// MAIN COMPONENT
// =========================================================

const PostDetail = () => {
  // =======================================================
  // ROUTER
  // =======================================================

  const {
    username,
    slug,
  } = useParams();

  // =======================================================
  // AUTH
  // =======================================================

  const {
    isLoggedIn,
    user: currentUser,
  } = useSelector(selectAuthState);

  // =======================================================
  // POST DETAIL DATA
  // =======================================================

  const {
    postData,
    isLoading,
    error,
    getDetail,
  } = usePostDetailData({
    username,
    slug,
  });

  // =======================================================
  // POST ACTIONS
  // =======================================================
  //
  // Hooks must always be called before
  // conditional returns.
  //
  // This includes loading and error states.
  // =======================================================

  const actions = usePostDetailActions({
    username,
    slug,
    postData,
    currentUser,
    isLoggedIn,
  });

  // =======================================================
  // AUTHOR
  // =======================================================

  const author = postData?.user ?? null;

  const authorName = useMemo(
    () => getAuthorName(author),
    [author]
  );

  const authorImage = useMemo(
    () => getUserAvatarUrl(author),
    [author]
  );

  // =======================================================
  // POST TYPE
  // =======================================================

  const typeDisplay = useMemo(
    () =>
      getPostTypeDisplay(
        postData?.post_type
      ),
    [postData?.post_type]
  );

  // =======================================================
  // ARTICLE METADATA
  // =======================================================

  const articleMeta = useMemo(
    () =>
      getArticleMeta(
        postData?.content
      ),
    [postData?.content]
  );

  // =======================================================
  // EDIT INITIAL DATA
  // =======================================================
  //
  // Preserve post identity so CreatePostModal
  // does not accidentally reset the form
  // during unrelated Redux updates.
  // =======================================================

  const editInitialData = useMemo(
    () => {
      if (!postData) {
        return null;
      }

      return {
        id: postData.id,
        slug: postData.slug,

        post_type:
          postData.post_type ?? "TEX",

        title:
          postData.title ?? "",

        content:
          postData.content ?? "",
      };
    },
    [
      postData?.id,
      postData?.slug,
      postData?.post_type,
      postData?.title,
      postData?.content,
    ]
  );

  // =======================================================
  // LOADING STATE
  // =======================================================

  if (isLoading) {
    return <PostDetailSkeleton />;
  }

  // =======================================================
  // ERROR STATE
  // =======================================================
  //
  // Backend 404 and other errors are
  // presented through a dedicated,
  // user-friendly component.
  // =======================================================

  if (error || !postData) {
    return (
      <PostDetailErrorState
        error={error}
        username={username}
        slug={slug}
        onRetry={getDetail}
        isRetrying={isLoading}
      />
    );
  }

  // =======================================================
  // POST VALUES
  // =======================================================

  const {
    id: postId,
    title,
    content,
  } = postData;

  // =======================================================
  // MOBILE OWNER ACTIONS
  // =======================================================

  const mobileOwnerActions =
    actions.isOwner ? (
      <PostDetailOwnerActions
        compact
        onEdit={
          actions.handleOpenEdit
        }
        onDelete={
          actions.handleOpenDelete
        }
        isUpdating={
          actions.isUpdating
        }
        isDeleting={
          actions.isDeleting
        }
      />
    ) : null;

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div className={PAGE_CLASS}>
      {/* =================================================
          FSOCIETY BACKGROUND
      ================================================= */}

      <PageGridBackground
        showMonogram
        showCubes
      />

      {/* =================================================
          PAGE CONTENT
      ================================================= */}

      <main className={CONTAINER_CLASS}>
        {/* ===============================================
            MAIN PANEL
        =============================================== */}

        <div className={PANEL_CLASS}>
          {/* ===========================================
              TOP ACCENT
          =========================================== */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-x-0
              top-0
              z-20
              h-[2px]

              bg-gradient-to-r
              from-transparent
              via-indigo-500/45
              to-transparent

              dark:via-indigo-400/30
            "
          />

          {/* ===========================================
              MAIN GRID
          =========================================== */}

          <div
            className="
              grid
              w-full
              min-w-0
              grid-cols-1

              lg:grid-cols-[minmax(0,1fr)_350px]
            "
          >
            {/* =========================================
                LEFT — POST CONTENT
            ========================================= */}

            <div className={MAIN_CONTENT_CLASS}>
              {/* =====================================
                  POST HERO
              ===================================== */}

              <PostDetailHero
                postData={postData}

                author={author}
                authorName={authorName}
                authorImage={authorImage}

                typeDisplay={typeDisplay}
                articleMeta={articleMeta}

                copied={
                  actions.isLinkCopied
                }
                onCopy={
                  actions.handleCopyPostLink
                }

                isOwner={
                  actions.isOwner
                }
                mobileOwnerActions={
                  mobileOwnerActions
                }
              />

              {/* =====================================
                  POST ARTICLE
              ===================================== */}

              <PostDetailArticle
                content={content}
                className="mt-8 sm:mt-9"
              />

              {/* =====================================
                  POST COMMENTS
              ===================================== */}

              <section
                aria-label="Post muhokamasi"
                className="
                  mt-8
                  w-full
                  min-w-0
                  max-w-full

                  sm:mt-10
                "
              >
                <PostCommentsSection
                  key={postId}
                  postId={postId}
                  postAuthorUsername={
                    author?.username
                  }
                  currentUser={
                    currentUser
                  }
                  isLoggedIn={
                    Boolean(isLoggedIn)
                  }
                />
              </section>
            </div>

            {/* =========================================
                RIGHT — POST SIDEBAR
            ========================================= */}

            <PostDetailSidebar
              postData={postData}

              author={author}
              authorName={authorName}
              authorImage={authorImage}

              isOwner={
                actions.isOwner
              }

              isLiking={
                actions.isLiking
              }

              isUpdating={
                actions.isUpdating
              }

              isDeleting={
                actions.isDeleting
              }

              onLike={
                actions.handleLikeToggle
              }

              onBookmark={
                actions.handleBookmarkClick
              }

              onEdit={
                actions.handleOpenEdit
              }

              onDelete={
                actions.handleOpenDelete
              }
            />
          </div>
        </div>
      </main>

      {/* =================================================
          EDIT POST MODAL
      ================================================= */}
      {/* Render only for the post owner. */}

      {actions.isOwner && editInitialData && (
        <CreatePostModal
          isOpen={
            actions.isEditModalOpen
          }
          onClose={
            actions.handleCloseEdit
          }
          onSubmit={
            actions.handleUpdatePost
          }
          initialData={
            editInitialData
          }
          isSubmitting={
            actions.isUpdating
          }
        />
      )}

      {/* =================================================
          DELETE CONFIRMATION MODAL
      ================================================= */}

      {actions.isOwner && (
        <DeleteConfirmationModal
          isOpen={
            actions.isDeleteModalOpen
          }
          onClose={
            actions.handleCloseDelete
          }
          onConfirm={
            actions.handleConfirmDelete
          }
          itemTitle={
            title || "Post"
          }
          isProcessing={
            actions.isDeleting
          }
        />
      )}
    </div>
  );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(PostDetail);
