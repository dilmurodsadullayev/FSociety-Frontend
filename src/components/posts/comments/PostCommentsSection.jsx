
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
  useStore,
} from "react-redux";

import {
  AlertTriangle,
  MessageCircle,
  MessageSquarePlus,
  RefreshCcw,
} from "lucide-react";

import PostService from "../../../services/post";

import {
  addCommentFailure,
  addCommentSuccess,
  getCommentsFailure,
  getCommentsStart,
  getCommentsSuccess,
} from "../../../features/posts";

import {
  siteToast,
} from "../../ui/AuthToast";

import PostCommentForm from "./PostCommentForm";
import PostCommentItem from "./PostCommentItem";
import PostCommentsSkeleton from "./PostCommentsSkeleton";

import {
  getCommentErrorMessage,
} from "./commentUtils";

// =========================================================
// FSOCIETY — POST COMMENTS SECTION
// =========================================================
//
// Responsibilities:
//
// - Fetch post comments
// - Show comments skeleton
// - Display comments
// - Create comments
// - Universal siteToast notifications
// - Prevent duplicate submissions
// - Handle refresh errors
// - Prevent stale API responses
// - Keep Redux contract unchanged
//
// Important:
//
// addCommentSuccess already increments
// postDetail.comments_count.
//
// deleteCommentSuccess already decrements
// postDetail.comments_count.
//
// Do not increment/decrement those values
// again in this component.
// =========================================================

// =========================================================
// SELECTOR
// =========================================================

const selectPostState = (state) => state.post;

// =========================================================
// HELPERS
// =========================================================

const getPostKey = (value) => {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value);
};

const safeCount = (value, fallback = 0) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return Math.max(0, fallback);
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? Math.max(0, Math.trunc(number))
    : Math.max(0, fallback);
};

const normalizeCommentList = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.results)) {
    return response.results;
  }

  return [];
};

// =========================================================
// COMMENTS HEADER
// =========================================================

const CommentsHeader = memo(
  function CommentsHeader({
    count,
    isLoading,
    onRefresh,
  }) {
    return (
      <header
        className="
          mb-6
          flex
          w-full
          min-w-0
          flex-col
          gap-4

          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div className="min-w-0">
          <h2
            id="post-comments-heading"
            className="
              flex
              min-w-0
              items-center
              gap-3

              text-xl
              font-black
              tracking-tight
              text-slate-900

              sm:text-2xl

              dark:text-white
            "
          >
            <span
              className="
                grid
                h-10
                w-10
                shrink-0
                place-items-center

                rounded-xl
                border
                border-emerald-200
                bg-emerald-50
                text-emerald-700

                dark:border-emerald-400/20
                dark:bg-emerald-500/10
                dark:text-emerald-300
              "
            >
              <MessageCircle
                size={21}
                aria-hidden="true"
              />
            </span>

            <span>Sharhlar</span>
          </h2>

          <p
            className="
              mt-2
              text-xs
              font-medium
              text-slate-500

              sm:text-sm

              dark:text-slate-400
            "
          >
            {count.toLocaleString("uz-UZ")} ta sharh
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          aria-busy={isLoading}
          className="
            inline-flex
            min-h-11
            w-full
            min-w-0
            items-center
            justify-center
            gap-2

            self-start
            rounded-xl
            border
            border-slate-200
            bg-white/80

            px-4
            py-2.5

            text-xs
            font-bold
            text-slate-600

            transition-colors

            hover:border-indigo-200
            hover:bg-indigo-50
            hover:text-indigo-700

            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-indigo-500
            focus-visible:ring-offset-2

            disabled:cursor-not-allowed
            disabled:opacity-55

            sm:w-auto

            dark:border-white/[0.10]
            dark:bg-white/[0.035]
            dark:text-slate-300

            dark:hover:border-indigo-400/20
            dark:hover:bg-indigo-400/[0.08]
            dark:hover:text-indigo-300

            motion-reduce:transition-none
          "
        >
          <RefreshCcw
            size={15}
            className={
              isLoading
                ? "motion-safe:animate-spin"
                : ""
            }
            aria-hidden="true"
          />

          {isLoading
            ? "Yangilanmoqda..."
            : "Yangilash"}
        </button>
      </header>
    );
  }
);

// =========================================================
// COMMENTS ERROR
// =========================================================

const CommentsError = memo(
  function CommentsError({ message }) {
    return (
      <div
        role="alert"
        className="
          mb-5
          flex
          min-w-0
          items-start
          gap-3
          rounded-2xl
          border
          border-red-200
          bg-red-50
          p-4

          sm:rounded-3xl
          sm:p-5

          dark:border-red-400/20
          dark:bg-red-500/[0.08]
        "
      >
        <AlertTriangle
          size={19}
          className="
            mt-0.5
            shrink-0
            text-red-700

            dark:text-red-300
          "
          aria-hidden="true"
        />

        <div className="min-w-0">
          <p
            className="
              text-sm
              font-black
              text-red-800

              dark:text-red-200
            "
          >
            Sharhlarni yuklashda xato
          </p>

          <p
            className="
              mt-1
              break-words
              text-xs
              font-medium
              leading-6
              text-red-700

              dark:text-red-300
            "
          >
            {message}
          </p>
        </div>
      </div>
    );
  }
);

// =========================================================
// EMPTY COMMENTS
// =========================================================

const EmptyComments = memo(
  function EmptyComments() {
    return (
      <div
        className="
          w-full
          min-w-0
          rounded-3xl
          border-2
          border-dashed
          border-slate-200
          bg-white/65

          px-4
          py-10

          text-center

          sm:px-6

          dark:border-white/[0.09]
          dark:bg-white/[0.02]
        "
      >
        <div
          className="
            mx-auto
            grid
            h-16
            w-16
            place-items-center

            rounded-2xl
            border
            border-indigo-200
            bg-indigo-50
            text-indigo-600

            dark:border-indigo-400/20
            dark:bg-indigo-500/10
            dark:text-indigo-300
          "
        >
          <MessageSquarePlus
            size={28}
            strokeWidth={1.7}
            aria-hidden="true"
          />
        </div>

        <h3
          className="
            mt-5
            text-base
            font-black
            text-slate-900

            dark:text-white
          "
        >
          Hali sharhlar mavjud emas
        </h3>

        <p
          className="
            mx-auto
            mt-2
            max-w-sm
            text-sm
            leading-6
            text-slate-500

            dark:text-slate-400
          "
        >
          Muhokamani birinchi bo‘lib
          boshlang. Fikringiz boshqalarga
          foydali bo‘lishi mumkin.
        </p>
      </div>
    );
  }
);

// =========================================================
// MAIN COMPONENT
// =========================================================

const PostCommentsSection = ({
  postId,
  postAuthorUsername,
  currentUser,
  isLoggedIn,
}) => {
  const dispatch = useDispatch();
  const store = useStore();

  // =======================================================
  // REDUX
  // =======================================================

  const {
    comments,
    postDetail,
  } = useSelector(selectPostState);

  // =======================================================
  // POST IDENTITY
  // =======================================================

  const postKey = getPostKey(postId);

  const currentPostKey = getPostKey(
    postDetail?.id
  );

  const isCurrentPost =
    Boolean(postKey) &&
    postKey === currentPostKey;

  // =======================================================
  // LOCAL STATE
  // =======================================================

  const [
    loadState,
    setLoadState,
  ] = useState({
    postKey,
    status: "idle",
    error: "",
    hasLoaded: false,
  });

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  // =======================================================
  // REQUEST REFS
  // =======================================================

  const mountedRef = useRef(false);

  const latestPostKeyRef = useRef(postKey);
  latestPostKeyRef.current = postKey;

  const requestVersionRef = useRef(0);

  const listRequestPendingRef = useRef(false);

  const submitLockRef = useRef(false);

  const refreshToastRef = useRef(null);

  const submitToastRef = useRef(null);

  // =======================================================
  // LIFECYCLE
  // =======================================================

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      requestVersionRef.current += 1;

      if (refreshToastRef.current) {
        siteToast.dismiss(
          refreshToastRef.current
        );

        refreshToastRef.current = null;
      }

      if (submitToastRef.current) {
        siteToast.dismiss(
          submitToastRef.current
        );

        submitToastRef.current = null;
      }
    };
  }, []);

  // =======================================================
  // VERIFY REQUEST TARGET
  // =======================================================

  const isRequestForCurrentPost = useCallback(
    (requestedPostKey) => {
      if (
        !mountedRef.current ||
        latestPostKeyRef.current !==
          requestedPostKey
      ) {
        return false;
      }

      const reduxPost =
        store.getState()?.post?.postDetail;

      return (
        getPostKey(reduxPost?.id) ===
        requestedPostKey
      );
    },
    [store]
  );

  // =======================================================
  // COMMENTS
  // =======================================================

  const safeComments = useMemo(
    () => (
      Array.isArray(comments)
        ? comments.filter(
            (comment) =>
              comment &&
              typeof comment === "object" &&
              comment.id !== null &&
              comment.id !== undefined
          )
        : []
    ),
    [comments]
  );

  // =======================================================
  // LOADING STATE FOR CURRENT POST
  // =======================================================

  const stateMatchesPost =
    loadState.postKey === postKey;

  const hasLoaded =
    stateMatchesPost &&
    loadState.hasLoaded;

  const isLoading =
    Boolean(postKey) &&
    (
      !stateMatchesPost ||
      loadState.status === "idle" ||
      loadState.status === "loading"
    );

  const loadError =
    stateMatchesPost
      ? loadState.error
      : "";

  // Do not display comments belonging to
  // the previously opened post.

  const visibleComments =
    isCurrentPost && hasLoaded
      ? safeComments
      : [];

  const commentsCount =
    isCurrentPost
      ? safeCount(
          postDetail?.comments_count,
          visibleComments.length
        )
      : 0;

  // =======================================================
  // LOAD COMMENTS
  // =======================================================

  const loadComments = useCallback(
    async (showToast = false) => {
      const requestedPostKey = postKey;

      if (!requestedPostKey) {
        return false;
      }

      const requestId =
        ++requestVersionRef.current;

      listRequestPendingRef.current = true;

      setLoadState((previous) => ({
        postKey: requestedPostKey,
        status: "loading",
        error: "",
        hasLoaded:
          previous.postKey ===
            requestedPostKey &&
          previous.hasLoaded,
      }));

      // Redux contract remains unchanged.

      dispatch(getCommentsStart());

      let toastId = null;

      if (showToast) {
        toastId = siteToast.loading(
          "Sharhlar yangilanmoqda...",
          {
            title: "Sharhlar yuklanmoqda",
          }
        );

        refreshToastRef.current =
          toastId;
      }

      // Check both route and request version.

      const isCurrentRequest = () => (
        requestVersionRef.current ===
          requestId &&
        isRequestForCurrentPost(
          requestedPostKey
        )
      );

      try {
        const response =
          await PostService
            .getPostComments(postId);

        if (!isCurrentRequest()) {
          if (toastId) {
            siteToast.dismiss(toastId);
          }

          return false;
        }

        const commentList =
          normalizeCommentList(response);

        dispatch(
          getCommentsSuccess(commentList)
        );

        setLoadState({
          postKey: requestedPostKey,
          status: "success",
          error: "",
          hasLoaded: true,
        });

        if (toastId) {
          siteToast.success(
            "Sharhlar ro‘yxati yangilandi.",
            {
              id: toastId,
              title: "Yangilandi",
              duration: 2600,
            }
          );
        }

        return true;
      } catch (requestError) {
        if (!isCurrentRequest()) {
          if (toastId) {
            siteToast.dismiss(toastId);
          }

          return false;
        }

        const message =
          getCommentErrorMessage(
            requestError,
            "Sharhlarni yuklashda xato yuz berdi."
          );

        dispatch(
          getCommentsFailure(message)
        );

        setLoadState((previous) => ({
          postKey: requestedPostKey,
          status: "error",
          error: message,
          hasLoaded:
            previous.postKey ===
              requestedPostKey &&
            previous.hasLoaded,
        }));

        if (toastId) {
          siteToast.error(message, {
            id: toastId,
            title: "Sharhlar yuklanmadi",
            duration: 4400,
          });
        }

        return false;
      } finally {
        if (
          requestVersionRef.current ===
          requestId
        ) {
          listRequestPendingRef.current =
            false;
        }

        if (
          refreshToastRef.current ===
            toastId
        ) {
          refreshToastRef.current = null;
        }
      }
    },
    [
      postId,
      postKey,
      dispatch,
      isRequestForCurrentPost,
    ]
  );

  // =======================================================
  // INITIAL LOAD / POST CHANGE
  // =======================================================

  useEffect(() => {
    loadComments();

    return () => {
      requestVersionRef.current += 1;
    };
  }, [loadComments]);

  // =======================================================
  // MANUAL REFRESH
  // =======================================================

  const handleRefresh = useCallback(
    () => {
      if (isLoading) {
        return;
      }

      loadComments(true);
    },
    [isLoading, loadComments]
  );

  // =======================================================
  // CREATE COMMENT
  // =======================================================

  const handleCreateComment = useCallback(
    async (message) => {
      // =====================================
      // AUTH
      // =====================================

      if (!isLoggedIn) {
        siteToast.warning(
          "Sharh qoldirish uchun avval tizimga kiring.",
          {
            title: "Kirish talab qilinadi",
            duration: 4000,
          }
        );

        return false;
      }

      // =====================================
      // POST / DUPLICATE GUARD
      // =====================================

      if (
        !postKey ||
        !isCurrentPost ||
        submitLockRef.current
      ) {
        return false;
      }

      const cleanMessage = String(
        message ?? ""
      ).trim();

      // =====================================
      // VALIDATION
      // =====================================

      if (!cleanMessage) {
        siteToast.warning(
          "Sharh matnini kiriting.",
          {
            title: "Bo‘sh sharh",
          }
        );

        return false;
      }

      if (cleanMessage.length > 255) {
        siteToast.warning(
          "Sharh 255 ta belgidan oshmasligi kerak.",
          {
            title: "Matn juda uzun",
          }
        );

        return false;
      }

      // =====================================
      // SYNCHRONOUS LOCK
      // =====================================

      submitLockRef.current = true;
      setIsSubmitting(true);

      const requestedPostKey = postKey;

      const toastId = siteToast.loading(
        "Sharh yuborilmoqda...",
        {
          title: "Sharh yaratilmoqda",
        }
      );

      submitToastRef.current = toastId;

      try {
        // ===================================
        // API
        // ===================================

        const response =
          await PostService
            .createPostComment(
              postId,
              {
                message: cleanMessage,
              }
            );

        if (
          !isRequestForCurrentPost(
            requestedPostKey
          )
        ) {
          siteToast.dismiss(toastId);
          return false;
        }

        const newComment =
          response?.comment ??
          response;

        const hasValidComment =
          newComment &&
          typeof newComment === "object" &&
          newComment.id !== null &&
          newComment.id !== undefined;

        // ===================================
        // REDUX UPDATE
        // ===================================

        if (hasValidComment) {
          // This reducer ALREADY updates
          // postDetail.comments_count.
          //
          // Do NOT dispatch an additional
          // updatePostDetailLocal here.

          dispatch(
            addCommentSuccess(newComment)
          );
        }

        // ===================================
        // PENDING LIST REQUEST
        // ===================================

        if (listRequestPendingRef.current) {
          // An older list response must not
          // overwrite the new comment.

          requestVersionRef.current += 1;
          listRequestPendingRef.current =
            false;

          if (refreshToastRef.current) {
            siteToast.dismiss(
              refreshToastRef.current
            );

            refreshToastRef.current = null;
          }

          const currentComments =
            store.getState()?.post?.comments;

          dispatch(
            getCommentsSuccess(
              Array.isArray(currentComments)
                ? currentComments
                : []
            )
          );
        }

        setLoadState({
          postKey: requestedPostKey,
          status: "success",
          error: "",
          hasLoaded: true,
        });

        // If the server acknowledges creation
        // without returning the new comment,
        // fetch the list again rather than
        // inventing an ID or incrementing
        // the count locally.

        if (!hasValidComment) {
          loadComments();
        }

        // ===================================
        // UNIVERSAL SUCCESS TOAST
        // ===================================

        siteToast.success(
          "Sharhingiz muvaffaqiyatli yuborildi!",
          {
            id: toastId,
            title: "Sharh yuborildi",
            duration: 3200,
          }
        );

        return true;
      } catch (requestError) {
        if (
          !isRequestForCurrentPost(
            requestedPostKey
          )
        ) {
          siteToast.dismiss(toastId);
          return false;
        }

        const messageText =
          getCommentErrorMessage(
            requestError,
            "Sharh yuborishda xato yuz berdi."
          );

        dispatch(
          addCommentFailure(messageText)
        );

        siteToast.error(
          messageText,
          {
            id: toastId,
            title: "Sharh yuborilmadi",
            duration: 5000,
          }
        );

        // Return false so PostCommentForm
        // keeps the draft text.

        return false;
      } finally {
        submitLockRef.current = false;

        if (mountedRef.current) {
          setIsSubmitting(false);
        }

        if (
          submitToastRef.current ===
          toastId
        ) {
          submitToastRef.current = null;
        }
      }
    },
    [
      isLoggedIn,
      isCurrentPost,
      postId,
      postKey,
      dispatch,
      store,
      isRequestForCurrentPost,
      loadComments,
    ]
  );

  // =======================================================
  // RENDER
  // =======================================================

  const showSkeleton =
    Boolean(postKey) &&
    isLoading &&
    !hasLoaded;

  const showEmpty =
    hasLoaded &&
    !isLoading &&
    !loadError &&
    visibleComments.length === 0;

  return (
    <section
      aria-labelledby="post-comments-heading"
      className="
        mt-10
        w-full
        min-w-0
        max-w-full

        border-t
        border-slate-200
        pt-8

        font-sans

        dark:border-white/[0.08]
      "
    >
      {/* =====================================
          HEADER
      ===================================== */}

      <CommentsHeader
        count={commentsCount}
        isLoading={isLoading}
        onRefresh={handleRefresh}
      />

      {/* =====================================
          CREATE COMMENT FORM
      ===================================== */}

      <PostCommentForm
        currentUser={currentUser}
        isLoggedIn={isLoggedIn}
        isSubmitting={isSubmitting}
        onSubmit={handleCreateComment}
      />

      {/* =====================================
          INITIAL LIST SKELETON
      ===================================== */}

      {showSkeleton && (
        <PostCommentsSkeleton
          count={3}
        />
      )}

      {/* =====================================
          LIST LOAD ERROR
      ===================================== */}

      {loadError && (
        <CommentsError
          message={loadError}
        />
      )}

      {/* =====================================
          COMMENT LIST
      ===================================== */}

      {hasLoaded && (
        <div
          className="
            w-full
            min-w-0
            space-y-4
          "
          aria-busy={isLoading}
        >
          {visibleComments.map((comment) => (
            <PostCommentItem
              key={comment.id}
              comment={comment}
              postAuthorUsername={
                postAuthorUsername
              }
              currentUser={currentUser}
              isLoggedIn={isLoggedIn}
            />
          ))}
        </div>
      )}

      {/* =====================================
          EMPTY STATE
      ===================================== */}

      {showEmpty && (
        <EmptyComments />
      )}
    </section>
  );
};

export default memo(PostCommentsSection);
