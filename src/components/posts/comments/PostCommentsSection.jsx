
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
  ArrowDownUp,
  CornerDownRight,
  MessageCircle,
  MessageSquarePlus,
  RefreshCcw,
  Terminal,
} from "lucide-react";

import PostService from "../../../services/post";

import {
  addCommentFailure,
  addCommentSuccess,
  buildPostCommentTree,
  getCommentsFailure,
  getCommentsStart,
  getCommentsSuccess,
} from "../../../features/posts";

import { siteToast } from "../../ui/AuthToast";

import PostCommentForm from "./PostCommentForm";
import PostCommentItem from "./PostCommentItem";
import PostCommentsSkeleton from "./PostCommentsSkeleton";

import {
  getCommentErrorMessage,
} from "./commentUtils";

// =========================================================
// FSOCIETY — POST COMMENTS SECTION
// REDDIT x MR. ROBOT DISCUSSION
// =========================================================
//
// Features:
// - Compact discussion layout
// - Nested comments / replies
// - Reply to reply
// - Root comment creation
// - Comment sorting
// - Manual refresh
// - Light / Dark mode
// - Responsive mobile layout
// - Redux synchronization
// - Loading skeleton
// - Full API errors
// - Universal siteToast
// - Duplicate request protection
// - Stale response protection
// - Soft-delete compatibility
//
// Like / Edit / Delete:
// Managed by PostCommentItem and
// usePostCommentActions.js
//
// Comment counter:
// Managed by Redux reducers.
//
// =========================================================

// =========================================================
// CONSTANTS
// =========================================================

const MAX_COMMENT_LENGTH = 255;

const SORT_NEWEST = "newest";
const SORT_OLDEST = "oldest";

// =========================================================
// REDUX SELECTOR
// =========================================================

const selectPostState = (state) =>
  state.post;

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

const safeCount = (
  value,
  fallback = 0
) => {
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

const getCommentPostId = (comment) => {
  const post = comment?.post;

  if (
    post === null ||
    post === undefined
  ) {
    return null;
  }

  if (
    typeof post === "object"
  ) {
    return post.id ?? null;
  }

  return post;
};

const extractError = (
  error,
  fallback
) => {
  // Updated PostService already combines
  // all Django REST validation errors.

  if (
    error?.name === "PostServiceError" &&
    typeof error.message === "string" &&
    error.message.trim()
  ) {
    return error.message.trim();
  }

  try {
    const message = getCommentErrorMessage(
      error,
      fallback
    );

    if (
      typeof message === "string" &&
      message.trim()
    ) {
      return message.trim();
    }
  } catch {
    // Continue to the fallback.
  }

  return error?.message || fallback;
};

const dismissToast = (toastRef) => {
  const id = toastRef.current;

  if (
    id !== null &&
    id !== undefined
  ) {
    siteToast.dismiss(id);
  }

  toastRef.current = null;
};

// =========================================================
// COMMENTS HEADER
// =========================================================

const CommentsHeader = memo(
  function CommentsHeader({
    count,
    isLoading,
    isSubmitting,
    sort,
    onSortChange,
    onRefresh,
  }) {
    const sortLabel =
      sort === SORT_NEWEST
        ? "Yangi avval"
        : "Eski avval";

    return (
      <div
        className="
          relative
          min-w-0
          overflow-hidden

          rounded-t-2xl

          border-b
          border-white/[0.08]

          bg-[#13171e]
          px-3 py-3

          text-white

          dark:bg-[#080b10]

          sm:px-4
          sm:py-3.5
        "
      >
        {/* TOP SIGNAL LINE */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute inset-x-0 top-0
            h-px

            bg-gradient-to-r
            from-rose-500
            via-rose-500/35
            to-transparent
          "
        />

        <div
          className="
            flex min-w-0
            flex-wrap
            items-center
            justify-between
            gap-3
          "
        >
          {/* TITLE */}
          <div
            className="
              flex min-w-0
              items-center gap-2.5
            "
          >
            <div
              aria-hidden="true"
              className="
                relative
                grid h-9 w-9
                shrink-0
                place-items-center

                rounded-xl
                border border-rose-400/20
                bg-rose-500/[0.09]

                text-rose-400
              "
            >
              <Terminal
                size={17}
                strokeWidth={1.8}
              />

              <span
                className="
                  absolute -right-0.5 -top-0.5
                  h-1.5 w-1.5
                  rounded-full
                  bg-rose-400
                "
              />
            </div>

            <div className="min-w-0">
              <div
                className="
                  flex min-w-0
                  flex-wrap
                  items-center
                  gap-2
                "
              >
                <h2
                  id="post-comments-heading"
                  className="
                    text-sm
                    font-extrabold
                    tracking-tight

                    sm:text-[15px]
                  "
                >
                  Muhokama
                </h2>

                <span
                  className="
                    inline-flex
                    min-h-5
                    items-center
                    justify-center

                    rounded-md
                    border border-white/[0.10]
                    bg-white/[0.05]

                    px-1.5
                    font-mono
                    text-[10px]
                    font-bold
                    tabular-nums
                    text-slate-300
                  "
                >
                  {count.toLocaleString("uz-UZ")}
                </span>
              </div>

              <p
                className="
                  mt-0.5
                  truncate
                  font-mono
                  text-[9px]
                  tracking-[0.10em]
                  text-slate-400

                  sm:text-[10px]
                "
              >
                FSOCIETY / COMMUNITY_THREAD
              </p>
            </div>
          </div>

          {/* CONTROLS */}
          <div
            className="
              flex min-w-0
              flex-wrap
              items-center
              gap-1.5
            "
          >
            {/* SORT */}
            <button
              type="button"
              onClick={onSortChange}
              title="Sharhlarni saralash"
              aria-label={`Saralash: ${sortLabel}`}
              className="
                inline-flex
                min-h-9
                items-center
                justify-center
                gap-1.5

                rounded-lg
                border border-white/[0.10]
                bg-white/[0.04]

                px-2.5
                text-[10px]
                font-bold
                text-slate-200

                transition-colors

                hover:border-white/[0.20]
                hover:bg-white/[0.09]

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-rose-400

                sm:text-[11px]
              "
            >
              <ArrowDownUp
                size={13}
                aria-hidden="true"
              />

              <span>{sortLabel}</span>
            </button>

            {/* REFRESH */}
            <button
              type="button"
              onClick={onRefresh}
              disabled={
                isLoading ||
                isSubmitting
              }
              title="Sharhlarni yangilash"
              aria-label="Sharhlarni yangilash"
              aria-busy={isLoading}
              className="
                inline-flex
                min-h-9
                items-center
                justify-center
                gap-1.5

                rounded-lg
                border border-white/[0.10]
                bg-white/[0.04]

                px-2.5
                text-[10px]
                font-bold
                text-slate-200

                transition-colors

                hover:border-white/[0.20]
                hover:bg-white/[0.09]

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-rose-400

                disabled:cursor-not-allowed
                disabled:opacity-50

                sm:text-[11px]
              "
            >
              <RefreshCcw
                size={13}
                className={
                  isLoading
                    ? "motion-safe:animate-spin"
                    : ""
                }
                aria-hidden="true"
              />

              <span
                className="
                  hidden min-[390px]:inline
                "
              >
                {isLoading
                  ? "Yuklanmoqda"
                  : "Yangilash"}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }
);

// =========================================================
// ERROR PANEL
// =========================================================

const CommentsError = memo(
  function CommentsError({
    message,
    onRetry,
    isLoading,
  }) {
    if (!message) return null;

    return (
      <div
        role="alert"
        className="
          mx-3 my-3
          flex min-w-0
          items-start gap-2.5

          rounded-xl
          border border-red-200
          bg-red-50

          px-3 py-3

          dark:border-red-400/20
          dark:bg-red-500/[0.07]

          sm:mx-4
        "
      >
        <AlertTriangle
          size={17}
          className="
            mt-0.5 shrink-0
            text-red-600
            dark:text-red-400
          "
          aria-hidden="true"
        />

        <div className="min-w-0 flex-1">
          <p
            className="
              text-xs
              font-extrabold
              text-red-800

              dark:text-red-200
            "
          >
            Sharhlarni yuklashda xato
          </p>

          <p
            className="
              mt-1
              whitespace-pre-line
              break-words
              text-[11px]
              leading-5
              text-red-700

              dark:text-red-300
            "
          >
            {message}
          </p>

          <button
            type="button"
            onClick={onRetry}
            disabled={isLoading}
            className="
              mt-2
              inline-flex
              min-h-8
              items-center gap-1.5

              rounded-lg
              border border-red-200
              bg-white

              px-2.5
              text-[11px]
              font-bold
              text-red-700

              transition-colors

              hover:bg-red-100

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-red-400

              disabled:opacity-50

              dark:border-red-400/20
              dark:bg-red-500/10
              dark:text-red-200
              dark:hover:bg-red-500/20
            "
          >
            <RefreshCcw
              size={12}
              aria-hidden="true"
            />

            Qayta urinish
          </button>
        </div>
      </div>
    );
  }
);

// =========================================================
// EMPTY STATE
// =========================================================

const EmptyComments = memo(
  function EmptyComments() {
    return (
      <div
        className="
          flex min-w-0
          flex-col
          items-center
          justify-center

          px-4 py-10
          text-center

          sm:py-12
        "
      >
        <div
          aria-hidden="true"
          className="
            relative
            grid h-12 w-12
            place-items-center

            rounded-2xl
            border border-slate-200
            bg-slate-50

            text-slate-400

            dark:border-white/[0.09]
            dark:bg-white/[0.035]
            dark:text-slate-500
          "
        >
          <MessageSquarePlus
            size={23}
            strokeWidth={1.6}
          />

          <span
            className="
              absolute -right-1 -top-1
              h-2 w-2
              rounded-full
              border-2 border-white
              bg-rose-500

              dark:border-[#10141b]
            "
          />
        </div>

        <h3
          className="
            mt-3
            text-[13px]
            font-extrabold
            text-slate-800

            dark:text-slate-100
          "
        >
          Hali muhokama boshlanmagan
        </h3>

        <p
          className="
            mx-auto mt-1
            max-w-xs

            text-[11px]
            leading-5
            text-slate-500

            dark:text-slate-400
          "
        >
          Birinchi sharhni yozing,
          savol bering yoki o‘z
          tajribangizni ulashing.
        </p>

        <span
          className="
            mt-4
            font-mono
            text-[9px]
            tracking-[0.12em]
            text-slate-400

            dark:text-slate-600
          "
        >
          NO_THREADS_FOUND
        </span>
      </div>
    );
  }
);

// =========================================================
// DISCUSSION FOOTER
// =========================================================

const CommentsFooter = memo(
  function CommentsFooter({
    count,
    rootCount,
  }) {
    return (
      <div
        className="
          flex min-w-0
          flex-wrap
          items-center
          justify-between

          gap-x-3 gap-y-2

          border-t
          border-slate-100
          bg-slate-50/75

          px-3 py-2.5

          dark:border-white/[0.06]
          dark:bg-white/[0.015]

          sm:px-4
        "
      >
        <div
          className="
            inline-flex
            min-w-0
            flex-wrap
            items-center
            gap-2

            font-mono
            text-[9px]
            font-semibold
            text-slate-400

            dark:text-slate-500
          "
        >
          <span
            aria-hidden="true"
            className="
              h-1.5 w-1.5
              shrink-0
              rounded-full
              bg-rose-500
            "
          />

          FSOCIETY://THREADS

          <span
            className="
              text-slate-300
              dark:text-slate-700
            "
          >
            /
          </span>

          {rootCount} ROOT
        </div>

        <span
          className="
            inline-flex
            items-center gap-1.5

            font-mono
            text-[9px]
            text-slate-400

            dark:text-slate-500
          "
        >
          <CornerDownRight
            size={11}
            aria-hidden="true"
          />

          {count} COMMENTS
        </span>
      </div>
    );
  }
);

// =========================================================
// MAIN COMPONENT
// =========================================================

function PostCommentsSection({
  postId,
  postAuthorUsername,
  currentUser,
  isLoggedIn,
}) {
  // =====================================================
  // REDUX
  // =====================================================

  const dispatch = useDispatch();
  const store = useStore();

  const {
    comments,
    postDetail,
  } = useSelector(selectPostState);

  // =====================================================
  // POST IDENTITY
  // =====================================================

  const postKey = getPostKey(postId);

  const currentPostKey = getPostKey(
    postDetail?.id
  );

  const isCurrentPost =
    Boolean(postKey) &&
    postKey === currentPostKey;

  // =====================================================
  // LOCAL STATES
  // =====================================================

  const [
    sort,
    setSort,
  ] = useState(SORT_NEWEST);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    loadState,
    setLoadState,
  ] = useState({
    postKey: "",
    status: "idle",
    error: "",
    hasLoaded: false,
  });

  // =====================================================
  // REQUEST REFS
  // =====================================================

  const mountedRef = useRef(false);

  const latestPostKeyRef = useRef(
    postKey
  );

  latestPostKeyRef.current = postKey;

  const requestVersionRef = useRef(0);

  const listRequestPendingRef =
    useRef(false);

  const submitLockRef = useRef(false);

  const refreshToastRef = useRef(null);

  const submitToastRef = useRef(null);

  // =====================================================
  // LIFECYCLE
  // =====================================================

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      requestVersionRef.current += 1;

      listRequestPendingRef.current = false;

      dismissToast(refreshToastRef);
      dismissToast(submitToastRef);
    };
  }, []);

  // =====================================================
  // VERIFY REQUEST TARGET
  // =====================================================

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

  // =====================================================
  // SAFE COMMENTS
  // =====================================================

  const safeComments = useMemo(() => {
    if (!Array.isArray(comments)) {
      return [];
    }

    return comments.filter((comment) => {
      if (
        !comment ||
        typeof comment !== "object" ||
        comment.id === null ||
        comment.id === undefined
      ) {
        return false;
      }

      // Prevent displaying comments
      // from another post.

      const commentPostId =
        getCommentPostId(comment);

      if (
        commentPostId === null ||
        commentPostId === undefined
      ) {
        // Compatibility with older
        // serializer responses.
        return true;
      }

      return (
        getPostKey(commentPostId) ===
        postKey
      );
    });
  }, [
    comments,
    postKey,
  ]);

  // =====================================================
  // LOADING STATE
  // =====================================================

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

  // =====================================================
  // VISIBLE COMMENTS
  // =====================================================

  const visibleComments = useMemo(() => {
    if (
      !isCurrentPost ||
      !hasLoaded
    ) {
      return [];
    }

    return safeComments;
  }, [
    isCurrentPost,
    hasLoaded,
    safeComments,
  ]);

  // =====================================================
  // COUNTER
  // =====================================================

  const activeLocalCount = useMemo(
    () =>
      visibleComments.filter(
        (comment) => !comment.is_deleted
      ).length,
    [visibleComments]
  );

  const commentsCount = isCurrentPost
    ? safeCount(
        postDetail?.comments_count,
        activeLocalCount
      )
    : 0;

  // =====================================================
  // BUILD NESTED TREE
  // =====================================================
  //
  // Redux stores flat comments.
  //
  // buildPostCommentTree() groups them
  // by parent ID.
  //
  // This preserves every reply depth,
  // including replies under deleted parents.
  // =====================================================

  const commentTree = useMemo(() => {
    const roots = buildPostCommentTree(
      visibleComments
    );

    if (sort === SORT_OLDEST) {
      return [...roots].reverse();
    }

    return roots;
  }, [
    visibleComments,
    sort,
  ]);

  // =====================================================
  // LOAD COMMENTS
  // =====================================================

  const loadComments = useCallback(
    async (showToast = false) => {
      const requestedPostKey = postKey;

      if (
        !requestedPostKey ||
        !isRequestForCurrentPost(
          requestedPostKey
        )
      ) {
        return false;
      }

      // -----------------------------------------------
      // REQUEST VERSION
      // -----------------------------------------------

      const requestId =
        ++requestVersionRef.current;

      listRequestPendingRef.current = true;

      // -----------------------------------------------
      // UI LOADING
      // -----------------------------------------------

      setLoadState((previous) => ({
        postKey: requestedPostKey,
        status: "loading",
        error: "",
        hasLoaded:
          previous.postKey === requestedPostKey &&
          previous.hasLoaded,
      }));

      dispatch(getCommentsStart());

      // -----------------------------------------------
      // OPTIONAL REFRESH TOAST
      // -----------------------------------------------

      let toastId = null;

      if (showToast) {
        dismissToast(refreshToastRef);

        toastId = siteToast.loading(
          "Sharhlar yangilanmoqda...",
          {
            title: "Muhokama yangilanmoqda",
          }
        );

        refreshToastRef.current = toastId;
      }

      // -----------------------------------------------
      // STALE RESPONSE GUARD
      // -----------------------------------------------

      const isCurrentRequest = () =>
        requestVersionRef.current ===
          requestId &&
        isRequestForCurrentPost(
          requestedPostKey
        );

      try {
        // ---------------------------------------------
        // API
        // ---------------------------------------------
        //
        // Keep flat response.
        //
        // Redux builds the nested tree
        // using parent IDs.
        // ---------------------------------------------

        const response =
          await PostService.getPostComments(
            postId
          );

        if (!isCurrentRequest()) {
          if (toastId !== null) {
            siteToast.dismiss(toastId);
          }

          return false;
        }

        const commentList =
          normalizeCommentList(response);

        // ---------------------------------------------
        // REDUX
        // ---------------------------------------------

        dispatch(
          getCommentsSuccess(commentList)
        );

        // ---------------------------------------------
        // LOCAL STATE
        // ---------------------------------------------

        setLoadState({
          postKey: requestedPostKey,
          status: "success",
          error: "",
          hasLoaded: true,
        });

        // ---------------------------------------------
        // SUCCESS TOAST
        // ---------------------------------------------

        if (toastId !== null) {
          siteToast.success(
            "Sharhlar yangilandi.",
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
          if (toastId !== null) {
            siteToast.dismiss(toastId);
          }

          return false;
        }

        // ---------------------------------------------
        // ERROR
        // ---------------------------------------------

        const message = extractError(
          requestError,
          "Sharhlarni yuklashda xato yuz berdi."
        );

        dispatch(
          getCommentsFailure(message)
        );

        // Keep the previous list visible
        // when a manual refresh fails.

        setLoadState((previous) => ({
          postKey: requestedPostKey,
          status: "error",
          error: message,
          hasLoaded:
            previous.postKey ===
              requestedPostKey &&
            previous.hasLoaded,
        }));

        if (toastId !== null) {
          siteToast.error(
            message,
            {
              id: toastId,
              title: "Sharhlar yuklanmadi",
              duration: 5000,
            }
          );
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

  // =====================================================
  // INITIAL LOAD / POST CHANGE
  // =====================================================

  useEffect(() => {
    // Wait until the matching postDetail
    // is loaded into Redux.
    //
    // Prevents fetching comments for
    // the previously opened post.

    if (!isCurrentPost) {
      return undefined;
    }

    void loadComments(false);

    return () => {
      // Invalidate the previous list request.
      requestVersionRef.current += 1;

      listRequestPendingRef.current = false;

      dismissToast(refreshToastRef);
    };
  }, [
    isCurrentPost,
    loadComments,
  ]);

  // =====================================================
  // MANUAL REFRESH
  // =====================================================

  const handleRefresh = useCallback(() => {
    if (
      !isCurrentPost ||
      isLoading ||
      isSubmitting
    ) {
      return;
    }

    void loadComments(true);
  }, [
    isCurrentPost,
    isLoading,
    isSubmitting,
    loadComments,
  ]);

  // =====================================================
  // SORT COMMENTS
  // =====================================================

  const handleSortChange = useCallback(
    () => {
      setSort((previous) =>
        previous === SORT_NEWEST
          ? SORT_OLDEST
          : SORT_NEWEST
      );
    },
    []
  );

  // =====================================================
  // CREATE COMMENT / REPLY
  // =====================================================
  //
  // Root:
  //   handleCreateComment(message)
  //
  // Reply:
  //   handleCreateComment(message, parentId)
  //
  // =====================================================

  const handleCreateComment = useCallback(
    async (
      message,
      parentId = null
    ) => {
      // -----------------------------------------------
      // AUTHENTICATION
      // -----------------------------------------------

      if (!isLoggedIn) {
        siteToast.warning(
          "Sharh yoki javob yozish uchun tizimga kiring.",
          {
            title: "Kirish talab qilinadi",
            duration: 4000,
          }
        );

        return false;
      }

      // -----------------------------------------------
      // POST / DUPLICATE GUARD
      // -----------------------------------------------

      if (
        !postKey ||
        !isCurrentPost ||
        submitLockRef.current ||
        !isRequestForCurrentPost(postKey)
      ) {
        return false;
      }

      // -----------------------------------------------
      // MESSAGE VALIDATION
      // -----------------------------------------------

      const cleanMessage = String(
        message ?? ""
      ).trim();

      if (!cleanMessage) {
        siteToast.warning(
          "Sharh matnini kiriting.",
          {
            title: "Bo‘sh sharh",
          }
        );

        return false;
      }

      if (
        cleanMessage.length >
        MAX_COMMENT_LENGTH
      ) {
        siteToast.warning(
          `Sharh ${MAX_COMMENT_LENGTH} ta belgidan oshmasligi kerak.`,
          {
            title: "Matn juda uzun",
          }
        );

        return false;
      }

      // -----------------------------------------------
      // REPLY TYPE
      // -----------------------------------------------

      const isReply =
        parentId !== null &&
        parentId !== undefined;

      // -----------------------------------------------
      // SYNCHRONOUS LOCK
      // -----------------------------------------------

      submitLockRef.current = true;

      setIsSubmitting(true);

      const requestedPostKey = postKey;

      const toastId = siteToast.loading(
        isReply
          ? "Javob yuborilmoqda..."
          : "Sharh yuborilmoqda...",
        {
          title: isReply
            ? "Reply yaratilmoqda"
            : "Sharh yaratilmoqda",
        }
      );

      submitToastRef.current = toastId;

      try {
        // ---------------------------------------------
        // REQUEST BODY
        // ---------------------------------------------

        const payload = {
          message: cleanMessage,
        };

        if (isReply) {
          payload.parent = parentId;
        }

        // ---------------------------------------------
        // API
        // ---------------------------------------------

        const response =
          await PostService.createPostComment(
            postId,
            payload
          );

        if (
          !isRequestForCurrentPost(
            requestedPostKey
          )
        ) {
          siteToast.dismiss(toastId);
          return false;
        }

        // ---------------------------------------------
        // RESPONSE NORMALIZATION
        // ---------------------------------------------

        const newComment =
          response?.comment ?? response;

        const hasValidComment =
          newComment &&
          typeof newComment === "object" &&
          newComment.id !== null &&
          newComment.id !== undefined;

        // ---------------------------------------------
        // REDUX COMMENT UPDATE
        // ---------------------------------------------

        if (hasValidComment) {
          // Preserve server values.
          // Provide safe fallbacks if an
          // older serializer omits these.

          dispatch(
            addCommentSuccess({
              ...newComment,

              post:
                newComment.post ?? postId,

              parent:
                newComment.parent ??
                (isReply ? parentId : null),
            })
          );
        }

        // ---------------------------------------------
        // IN-FLIGHT LIST REQUEST
        // ---------------------------------------------
        //
        // An older GET response may have been
        // produced before the new comment.
        //
        // Invalidate that request, then fetch
        // the newest server list.
        //
        // This avoids:
        // - New reply disappearing
        // - Missing older comments
        // - Duplicate comments
        // ---------------------------------------------

        const hadPendingList =
          listRequestPendingRef.current;

        if (hadPendingList) {
          requestVersionRef.current += 1;

          listRequestPendingRef.current =
            false;

          dismissToast(refreshToastRef);
        }

        setLoadState({
          postKey: requestedPostKey,
          status: "success",
          error: "",
          hasLoaded: true,
        });

        if (
          hadPendingList ||
          !hasValidComment
        ) {
          void loadComments(false);
        }

        // ---------------------------------------------
        // SUCCESS TOAST
        // ---------------------------------------------

        siteToast.success(
          isReply
            ? "Javobingiz muvaffaqiyatli yuborildi!"
            : "Sharhingiz muvaffaqiyatli yuborildi!",
          {
            id: toastId,
            title: isReply
              ? "Javob yuborildi"
              : "Sharh yuborildi",
            duration: 3000,
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

        const messageText = extractError(
          requestError,
          isReply
            ? "Javob yuborishda xato yuz berdi."
            : "Sharh yuborishda xato yuz berdi."
        );

        dispatch(
          addCommentFailure(messageText)
        );

        siteToast.error(
          messageText,
          {
            id: toastId,
            title: isReply
              ? "Javob yuborilmadi"
              : "Sharh yuborilmadi",
            duration: 5000,
          }
        );

        // Return false so the composer
        // preserves the user's draft.

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
      isRequestForCurrentPost,
      loadComments,
    ]
  );

  // =====================================================
  // RENDER FLAGS
  // =====================================================

  const showSkeleton =
    Boolean(postKey) &&
    !hasLoaded &&
    !loadError;

  const showEmpty =
    isCurrentPost &&
    hasLoaded &&
    !isLoading &&
    !loadError &&
    commentTree.length === 0;

  const showThreads =
    isCurrentPost &&
    hasLoaded &&
    commentTree.length > 0;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section
      aria-labelledby="post-comments-heading"
      className="
        mt-8
        w-full min-w-0 max-w-full

        border-t border-slate-200
        pt-6

        font-sans

        dark:border-white/[0.08]

        sm:mt-10 sm:pt-7
      "
    >
      {/* ==========================================
          SMALL SECTION LABEL
         ========================================== */}

      <div
        className="
          mb-3
          flex min-w-0
          flex-wrap
          items-center
          justify-between
          gap-2
        "
      >
        <div
          className="
            inline-flex
            min-w-0
            items-center gap-2
          "
        >
          <span
            aria-hidden="true"
            className="
              h-1.5 w-1.5
              shrink-0
              rounded-full
              bg-rose-500
            "
          />

          <span
            className="
              font-mono
              text-[10px]
              font-bold
              uppercase
              tracking-[0.12em]
              text-slate-500

              dark:text-slate-400
            "
          >
            Community / Discussions
          </span>
        </div>

        <span
          className="
            inline-flex
            items-center gap-1.5
            font-mono
            text-[10px]
            text-slate-400

            dark:text-slate-500
          "
        >
          <MessageCircle
            size={12}
            aria-hidden="true"
          />

          {commentsCount} ta sharh
        </span>
      </div>

      {/* ==========================================
          ROOT COMMENT COMPOSER
         ========================================== */}

      <PostCommentForm
        currentUser={currentUser}
        isLoggedIn={isLoggedIn}
        isSubmitting={isSubmitting}
        onSubmit={handleCreateComment}
      />

      {/* ==========================================
          DISCUSSION PANEL
         ========================================== */}

      <div
        className="
          relative
          w-full min-w-0 max-w-full

          overflow-hidden

          rounded-2xl
          border border-slate-200

          bg-white

          shadow-[0_8px_32px_rgba(15,23,42,0.035)]

          dark:border-white/[0.09]
          dark:bg-[#0c1016]
          dark:shadow-[0_12px_35px_rgba(0,0,0,0.16)]
        "
      >
        {/* HEADER */}
        <CommentsHeader
          count={commentsCount}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
          sort={sort}
          onSortChange={handleSortChange}
          onRefresh={handleRefresh}
        />

        {/* ERROR */}
        {loadError && (
          <CommentsError
            message={loadError}
            onRetry={handleRefresh}
            isLoading={isLoading}
          />
        )}

        {/* INITIAL LOADING */}
        {showSkeleton && (
          <div
            className="
              min-w-0
              px-2 py-3

              sm:px-3 sm:py-4
            "
          >
            <PostCommentsSkeleton
              count={3}
            />
          </div>
        )}

        {/* ======================================
            NESTED COMMENT THREADS
           ====================================== */}

        {showThreads && (
          <div
            aria-busy={isLoading}
            className="
              w-full min-w-0
              max-w-full

              space-y-0.5

              px-0.5 py-1.5

              sm:px-1 sm:py-2
            "
          >
            {commentTree.map((comment) => (
              <PostCommentItem
                key={comment.id}
                comment={comment}
                postAuthorUsername={
                  postAuthorUsername
                }
                currentUser={currentUser}
                isLoggedIn={isLoggedIn}
                depth={0}
                onReply={handleCreateComment}
                isReplySubmitting={
                  isSubmitting
                }
              />
            ))}
          </div>
        )}

        {/* EMPTY */}
        {showEmpty && (
          <EmptyComments />
        )}

        {/* ======================================
            FOOTER
           ====================================== */}

        <CommentsFooter
          count={commentsCount}
          rootCount={commentTree.length}
        />
      </div>
    </section>
  );
}

export default memo(PostCommentsSection);
