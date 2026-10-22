
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useDispatch,
  useStore,
} from "react-redux";

import PostService from "../../../../services/post";

import {
  deleteCommentFailure,
  deleteCommentSuccess,
  toggleCommentLikeSuccess,
  updateCommentFailure,
  updateCommentSuccess,
} from "../../../../features/posts";

import { siteToast } from "../../../ui/AuthToast";

import {
  getCommentErrorMessage,
  normalizeLikesCount,
} from "../commentUtils";

// =========================================================
// FSOCIETY — USE POST COMMENT ACTIONS
// =========================================================
//
// Location:
// src/components/posts/comments/item/usePostCommentActions.js
//
// Responsibilities:
// - Comment ownership
// - Root comment / Nested reply support
// - Optimistic Like / Unlike
// - Edit comment / reply
// - Soft-delete comment / reply
// - Edit / Delete modal states
// - Redux synchronization
// - Universal siteToast
// - Loading states
// - Duplicate request protection
// - Stale API response protection
// - Full API error messages
// - updated_at preservation
//
// No visual JSX.
// No styling.
//
// Used by:
// comments/PostCommentItem.jsx
// =========================================================

// =========================================================
// CONSTANTS
// =========================================================

const MAX_COMMENT_LENGTH = 255;

// =========================================================
// HELPERS
// =========================================================

const normalizeId = (value) => {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value).trim();
};

const isSameId = (first, second) => {
  const a = normalizeId(first);
  const b = normalizeId(second);

  return Boolean(
    a &&
    b &&
    a === b
  );
};

const normalizeUsername = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const isSameUser = (first, second) => {
  if (!first || !second) {
    return false;
  }

  const firstId = normalizeId(
    first.id
  );

  const secondId = normalizeId(
    second.id
  );

  if (firstId && secondId) {
    return firstId === secondId;
  }

  const firstUsername = normalizeUsername(
    first.username
  );

  const secondUsername = normalizeUsername(
    second.username
  );

  return Boolean(
    firstUsername &&
    firstUsername === secondUsername
  );
};

const safeLikesCount = (value) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? Math.max(0, Math.trunc(number))
    : 0;
};

const isPlainObject = (value) =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value);

// =========================================================
// ERROR HELPER
// =========================================================

const getRequestError = (
  error,
  fallback
) => {
  // Our updated PostService already collects
  // all Django REST validation messages.

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
    // Continue with fallback.
  }

  if (
    typeof error?.message === "string" &&
    error.message.trim()
  ) {
    return error.message.trim();
  }

  return fallback;
};

// =========================================================
// MAIN HOOK
// =========================================================

const usePostCommentActions = ({
  comment = null,
  currentUser = null,
  isLoggedIn = false,
} = {}) => {
  // =====================================================
  // REDUX
  // =====================================================

  const dispatch = useDispatch();
  const store = useStore();

  // =====================================================
  // COMMENT IDENTITY
  // =====================================================

  const commentId = comment?.id;

  const commentKey = normalizeId(
    commentId
  );

  const isDeleted = Boolean(
    comment?.is_deleted
  );

  // =====================================================
  // USER / PERMISSIONS
  // =====================================================

  const commentUser =
    comment?.user ?? null;

  const resolvedCurrentUser =
    currentUser?.user &&
    typeof currentUser.user === "object"
      ? currentUser.user
      : currentUser;

  const calculatedOwner = isSameUser(
    resolvedCurrentUser,
    commentUser
  );

  const backendOwner =
    typeof comment?.is_owner === "boolean"
      ? comment.is_owner
      : typeof comment?.can_modify === "boolean"
        ? comment.can_modify
        : calculatedOwner;

  const isCommentOwner = Boolean(
    isLoggedIn &&
    !isDeleted &&
    backendOwner
  );

  // =====================================================
  // EDIT STATE
  // =====================================================

  const [
    isEditing,
    setIsEditing,
  ] = useState(false);

  const [
    editMessage,
    setEditMessage,
  ] = useState(
    String(comment?.message ?? "")
  );

  const [
    editError,
    setEditError,
  ] = useState("");

  // =====================================================
  // LIKE STATE
  // =====================================================

  const [
    likeState,
    setLikeState,
  ] = useState(() => ({
    isLiked: Boolean(
      comment?.is_liked_by_user
    ),

    likesCount: safeLikesCount(
      normalizeLikesCount(comment)
    ),
  }));

  const [
    likeError,
    setLikeError,
  ] = useState("");

  // =====================================================
  // DELETE MODAL
  // =====================================================

  const [
    isDeleteModalOpen,
    setIsDeleteModalOpen,
  ] = useState(false);

  // =====================================================
  // PROCESSING
  // =====================================================
  //
  // null | "like" | "edit" | "delete"
  // =====================================================

  const [
    processingAction,
    setProcessingAction,
  ] = useState(null);

  // =====================================================
  // DERIVED STATE
  // =====================================================

  const isLiked = likeState.isLiked;

  const likesCount =
    likeState.likesCount;

  const isLiking =
    processingAction === "like";

  const isUpdating =
    processingAction === "edit";

  const isDeleting =
    processingAction === "delete";

  const isProcessing =
    processingAction !== null;

  // =====================================================
  // REFS
  // =====================================================

  const mountedRef = useRef(false);

  const latestCommentKeyRef = useRef(
    commentKey
  );

  latestCommentKeyRef.current = commentKey;

  // One action per comment at a time.
  const requestLockRef = useRef(null);

  // Track unfinished loading toasts.
  const pendingToastsRef = useRef(
    new Set()
  );

  // =====================================================
  // MOUNT / UNMOUNT
  // =====================================================

  useEffect(() => {
    mountedRef.current = true;

    const pendingToasts =
      pendingToastsRef.current;

    return () => {
      mountedRef.current = false;

      // Dismiss only unfinished loading toasts.
      // Completed notifications remain visible.

      pendingToasts.forEach((id) => {
        siteToast.dismiss(id);
      });

      pendingToasts.clear();
    };
  }, []);

  // =====================================================
  // RESET MODALS WHEN COMMENT CHANGES
  // =====================================================

  useEffect(() => {
    setIsEditing(false);
    setIsDeleteModalOpen(false);
    setEditError("");
    setLikeError("");
  }, [commentKey]);

  // =====================================================
  // SYNC EDIT DRAFT
  // =====================================================

  useEffect(() => {
    // Never overwrite an active edit draft.

    if (isEditing) {
      return;
    }

    setEditMessage(
      String(comment?.message ?? "")
    );

    setEditError("");
  }, [
    commentKey,
    comment?.message,
    isEditing,
  ]);

  // =====================================================
  // SOFT DELETE UI RESET
  // =====================================================

  useEffect(() => {
    if (!isDeleted) {
      return;
    }

    setIsEditing(false);
    setIsDeleteModalOpen(false);
    setEditError("");
    setLikeError("");
  }, [isDeleted]);

  // =====================================================
  // SYNC LIKE WITH REDUX
  // =====================================================

  useEffect(() => {
    const activeRequest =
      requestLockRef.current;

    // Do not overwrite optimistic Like while
    // its API request is still pending.

    if (
      activeRequest?.type === "like" &&
      activeRequest.commentKey === commentKey
    ) {
      return;
    }

    if (isDeleted) {
      setLikeState({
        isLiked: false,
        likesCount: safeLikesCount(
          normalizeLikesCount(comment)
        ),
      });

      return;
    }

    setLikeState({
      isLiked: Boolean(
        comment?.is_liked_by_user
      ),

      likesCount: safeLikesCount(
        normalizeLikesCount(comment)
      ),
    });
  }, [
    commentKey,
    comment?.is_liked_by_user,
    comment?.likes_count,
    comment?.likes,
    isDeleted,
    processingAction,
  ]);

  // =====================================================
  // CURRENT REDUX COMMENT
  // =====================================================

  const getReduxComment = useCallback(
    (requestedId) => {
      const comments =
        store.getState()?.post?.comments;

      if (!Array.isArray(comments)) {
        return null;
      }

      return (
        comments.find(
          (item) =>
            isSameId(
              item?.id,
              requestedId
            )
        ) ?? null
      );
    },
    [store]
  );

  // =====================================================
  // CREATE REQUEST SNAPSHOT
  // =====================================================

  const createRequest = useCallback(
    (type) => {
      if (
        !commentKey ||
        requestLockRef.current
      ) {
        return null;
      }

      const postState =
        store.getState()?.post;

      const postId =
        postState?.postDetail?.id;

      const postKey = normalizeId(
        postId
      );

      if (!postKey) {
        return null;
      }

      const reduxComment =
        getReduxComment(commentId);

      if (!reduxComment) {
        return null;
      }

      // Extra protection when the current
      // comments list belongs to another post.

      const commentPost =
        reduxComment.post;

      const commentPostId =
        isPlainObject(commentPost)
          ? commentPost.id
          : commentPost;

      if (
        commentPostId !== null &&
        commentPostId !== undefined &&
        !isSameId(
          commentPostId,
          postId
        )
      ) {
        return null;
      }

      return {
        type,
        commentId,
        commentKey,
        postKey,
      };
    },
    [
      commentId,
      commentKey,
      store,
      getReduxComment,
    ]
  );

  // =====================================================
  // VERIFY REQUEST IS STILL CURRENT
  // =====================================================

  const isCurrentRequest = useCallback(
    (request) => {
      if (
        !request ||
        !mountedRef.current
      ) {
        return false;
      }

      // Component must still represent
      // the same comment.

      if (
        latestCommentKeyRef.current !==
        request.commentKey
      ) {
        return false;
      }

      const postState =
        store.getState()?.post;

      // Prevent old requests from changing
      // another post after navigation.

      if (
        normalizeId(
          postState?.postDetail?.id
        ) !== request.postKey
      ) {
        return false;
      }

      const currentComment =
        getReduxComment(
          request.commentId
        );

      if (!currentComment) {
        return false;
      }

      const currentPost =
        isPlainObject(currentComment.post)
          ? currentComment.post.id
          : currentComment.post;

      if (
        currentPost !== null &&
        currentPost !== undefined &&
        !isSameId(
          currentPost,
          request.postKey
        )
      ) {
        return false;
      }

      return true;
    },
    [
      store,
      getReduxComment,
    ]
  );

  // =====================================================
  // BEGIN LOADING TOAST
  // =====================================================

  const beginToast = useCallback(
    (message, title) => {
      const id = siteToast.loading(
        message,
        { title }
      );

      pendingToastsRef.current.add(id);

      return id;
    },
    []
  );

  // =====================================================
  // COMPLETE LOADING TOAST
  // =====================================================

  const finishToast = useCallback(
    (
      id,
      type,
      message,
      title
    ) => {
      pendingToastsRef.current.delete(
        id
      );

      const options = {
        id,
        title,
        duration:
          type === "error"
            ? 5000
            : 3400,
      };

      if (type === "error") {
        siteToast.error(
          message,
          options
        );

        return;
      }

      siteToast.success(
        message,
        options
      );
    },
    []
  );

  // =====================================================
  // DISMISS UNFINISHED TOAST
  // =====================================================

  const dismissPendingToast = useCallback(
    (id) => {
      pendingToastsRef.current.delete(
        id
      );

      siteToast.dismiss(id);
    },
    []
  );

  // =====================================================
  // RELEASE REQUEST LOCK
  // =====================================================

  const releaseRequest = useCallback(
    (request) => {
      if (
        requestLockRef.current !==
        request
      ) {
        return;
      }

      requestLockRef.current = null;

      if (mountedRef.current) {
        setProcessingAction(null);
      }
    },
    []
  );

  // =====================================================
  // CHANGE EDIT MESSAGE
  // =====================================================

  const handleEditMessageChange = useCallback(
    (valueOrEvent) => {
      if (requestLockRef.current) {
        return;
      }

      const value =
        typeof valueOrEvent === "string"
          ? valueOrEvent
          : valueOrEvent?.target?.value ?? "";

      setEditMessage(
        String(value ?? "")
      );

      setEditError("");
    },
    []
  );

  // =====================================================
  // START EDIT
  // =====================================================

  const handleStartEdit = useCallback(
    () => {
      if (
        !isCommentOwner ||
        !commentKey ||
        isDeleted ||
        requestLockRef.current
      ) {
        return false;
      }

      setIsDeleteModalOpen(false);

      setEditMessage(
        String(comment?.message ?? "")
      );

      setEditError("");
      setIsEditing(true);

      return true;
    },
    [
      isCommentOwner,
      commentKey,
      isDeleted,
      comment?.message,
    ]
  );

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancelEdit = useCallback(
    () => {
      if (requestLockRef.current) {
        return false;
      }

      setEditMessage(
        String(comment?.message ?? "")
      );

      setEditError("");
      setIsEditing(false);

      return true;
    },
    [comment?.message]
  );

  // =====================================================
  // SAVE EDIT
  // =====================================================

  const handleSaveEdit = useCallback(
    async (event) => {
      event?.preventDefault?.();

      if (
        !isCommentOwner ||
        !isEditing ||
        isDeleted ||
        requestLockRef.current
      ) {
        return false;
      }

      // =================================================
      // MESSAGE
      // =================================================

      const cleanMessage = String(
        editMessage ?? ""
      ).trim();

      const previousMessage = String(
        comment?.message ?? ""
      ).trim();

      // =================================================
      // VALIDATION
      // =================================================

      if (!cleanMessage) {
        setEditError(
          "Sharh matni bo‘sh bo‘lishi mumkin emas."
        );

        return false;
      }

      if (
        cleanMessage.length >
        MAX_COMMENT_LENGTH
      ) {
        setEditError(
          `Sharh ${MAX_COMMENT_LENGTH} ta belgidan oshmasligi kerak.`
        );

        return false;
      }

      // =================================================
      // UNCHANGED MESSAGE
      // =================================================

      if (
        cleanMessage ===
        previousMessage
      ) {
        setEditError("");
        setIsEditing(false);

        return true;
      }

      // =================================================
      // REQUEST SNAPSHOT
      // =================================================

      const request =
        createRequest("edit");

      if (!request) {
        setEditError(
          "Sharh ma’lumotlari yangilanmoqda. Qayta urinib ko‘ring."
        );

        return false;
      }

      // =================================================
      // REQUEST LOCK
      // =================================================

      requestLockRef.current = request;

      setProcessingAction("edit");
      setEditError("");

      // =================================================
      // LOADING TOAST
      // =================================================

      const toastId = beginToast(
        "Sharhdagi o‘zgarishlar saqlanmoqda...",
        "Sharh tahrirlanmoqda"
      );

      try {
        // ===============================================
        // API
        // ===============================================

        const response =
          await PostService.updatePostComment(
            request.commentId,
            {
              message: cleanMessage,
            }
          );

        // ===============================================
        // STALE RESPONSE
        // ===============================================

        if (!isCurrentRequest(request)) {
          dismissPendingToast(toastId);
          return false;
        }

        // ===============================================
        // NORMALIZE API RESPONSE
        // ===============================================

        const rawUpdated =
          response?.comment ??
          response;

        if (!isPlainObject(rawUpdated)) {
          throw new Error(
            "Server yangilangan sharh ma’lumotlarini qaytarmadi."
          );
        }

        // Reject another comment ID.

        if (
          rawUpdated.id != null &&
          !isSameId(
            rawUpdated.id,
            request.commentId
          )
        ) {
          throw new Error(
            "Server boshqa sharh ma’lumotlarini qaytardi."
          );
        }

        // ===============================================
        // CURRENT REDUX COMMENT
        // ===============================================

        const currentComment =
          getReduxComment(
            request.commentId
          );

        if (
          !currentComment ||
          currentComment.is_deleted
        ) {
          dismissPendingToast(toastId);
          return false;
        }

        // ===============================================
        // MERGE COMMENT DATA
        // ===============================================
        //
        // Preserve:
        // - id
        // - parent
        // - post
        // - ownership
        // - replies_count
        // - likes_count
        //
        // Keep updated_at from the backend.
        // Never invent an updated timestamp.
        // ===============================================

        const updatedComment = {
          ...currentComment,
          ...rawUpdated,

          id: currentComment.id,

          message:
            typeof rawUpdated.message ===
            "string"
              ? rawUpdated.message
              : cleanMessage,

          parent: currentComment.parent,

          post: currentComment.post,
        };

        // ===============================================
        // REDUX UPDATE
        // ===============================================

        dispatch(
          updateCommentSuccess(
            updatedComment
          )
        );

        // ===============================================
        // LOCAL STATE
        // ===============================================

        setEditMessage(
          updatedComment.message
        );

        setEditError("");
        setIsEditing(false);

        // ===============================================
        // SUCCESS TOAST
        // ===============================================

        finishToast(
          toastId,
          "success",
          "Sharhingiz muvaffaqiyatli tahrirlandi.",
          "Sharh yangilandi"
        );

        return true;
      } catch (requestError) {
        // ===============================================
        // IGNORE STALE RESPONSE
        // ===============================================

        if (!isCurrentRequest(request)) {
          dismissPendingToast(toastId);
          return false;
        }

        // ===============================================
        // ERROR
        // ===============================================

        const message = getRequestError(
          requestError,
          "Sharhni saqlashda xato yuz berdi."
        );

        // Keep edited text available.

        setEditError(message);

        dispatch(
          updateCommentFailure(
            message
          )
        );

        finishToast(
          toastId,
          "error",
          message,
          "Sharh saqlanmadi"
        );

        return false;
      } finally {
        releaseRequest(request);
      }
    },
    [
      isCommentOwner,
      isEditing,
      isDeleted,
      editMessage,
      comment?.message,
      createRequest,
      beginToast,
      isCurrentRequest,
      dismissPendingToast,
      getReduxComment,
      dispatch,
      finishToast,
      releaseRequest,
    ]
  );

  // =====================================================
  // OPEN DELETE MODAL
  // =====================================================

  const handleOpenDelete = useCallback(
    () => {
      if (
        !isCommentOwner ||
        !commentKey ||
        isDeleted ||
        isEditing ||
        requestLockRef.current
      ) {
        return false;
      }

      setIsDeleteModalOpen(true);

      return true;
    },
    [
      isCommentOwner,
      commentKey,
      isDeleted,
      isEditing,
    ]
  );

  // =====================================================
  // CLOSE DELETE MODAL
  // =====================================================

  const handleCloseDelete = useCallback(
    () => {
      if (requestLockRef.current) {
        return false;
      }

      setIsDeleteModalOpen(false);

      return true;
    },
    []
  );

  // =====================================================
  // CONFIRM SOFT DELETE
  // =====================================================

  const handleConfirmDelete = useCallback(
    async () => {
      if (
        !isCommentOwner ||
        !isDeleteModalOpen ||
        isDeleted ||
        requestLockRef.current
      ) {
        return false;
      }

      const request =
        createRequest("delete");

      if (!request) {
        return false;
      }

      // =================================================
      // REQUEST LOCK
      // =================================================

      requestLockRef.current = request;
      setProcessingAction("delete");

      // =================================================
      // LOADING TOAST
      // =================================================

      const toastId = beginToast(
        "Sharh o‘chirilmoqda...",
        "Sharh o‘chirilmoqda"
      );

      try {
        // ===============================================
        // API
        // ===============================================

        const response =
          await PostService.deletePostComment(
            request.commentId
          );

        // ===============================================
        // STALE RESPONSE
        // ===============================================

        if (!isCurrentRequest(request)) {
          dismissPendingToast(toastId);
          return false;
        }

        // ===============================================
        // VERIFY RESPONSE ID
        // ===============================================

        if (
          response?.comment_id != null &&
          !isSameId(
            response.comment_id,
            request.commentId
          )
        ) {
          throw new Error(
            "Server boshqa sharhning o‘chirish natijasini qaytardi."
          );
        }

        // ===============================================
        // CLOSE MODALS
        // ===============================================

        setIsDeleteModalOpen(false);
        setIsEditing(false);
        setEditError("");

        // ===============================================
        // SUCCESS TOAST
        // ===============================================
        //
        // Complete toast before Redux mutation.
        // An item can rerender or unmount.
        // ===============================================

        finishToast(
          toastId,
          "success",
          "Sharh o‘chirildi. Mavjud javoblar saqlandi.",
          "Sharh o‘chirildi"
        );

        // ===============================================
        // REDUX SOFT DELETE
        // ===============================================
        //
        // IMPORTANT:
        //
        // Do not filter the comment out.
        //
        // deleteCommentSuccess now:
        // - Sets is_deleted=true
        // - Masks message and user
        // - Preserves parent and replies
        // - Updates comments_count once
        // ===============================================

        dispatch(
          deleteCommentSuccess({
            ...(
              isPlainObject(response)
                ? response
                : {}
            ),

            comment_id:
              request.commentId,

            is_deleted: true,
          })
        );

        return true;
      } catch (requestError) {
        // ===============================================
        // STALE RESPONSE
        // ===============================================

        if (!isCurrentRequest(request)) {
          dismissPendingToast(toastId);
          return false;
        }

        const message = getRequestError(
          requestError,
          "Sharhni o‘chirishda xato yuz berdi."
        );

        dispatch(
          deleteCommentFailure(
            message
          )
        );

        // Keep modal open if deletion failed.
        // User can retry or cancel.

        finishToast(
          toastId,
          "error",
          message,
          "Sharh o‘chirilmadi"
        );

        return false;
      } finally {
        releaseRequest(request);
      }
    },
    [
      isCommentOwner,
      isDeleteModalOpen,
      isDeleted,
      createRequest,
      beginToast,
      isCurrentRequest,
      dismissPendingToast,
      finishToast,
      dispatch,
      releaseRequest,
    ]
  );

  // =====================================================
  // LIKE / UNLIKE
  // =====================================================

  const handleLikeToggle = useCallback(
    async () => {
      // =================================================
      // AUTHENTICATION
      // =================================================

      if (!isLoggedIn) {
        siteToast.warning(
          "Sharhga Like bosish uchun avval tizimga kiring.",
          {
            title: "Kirish talab qilinadi",
            duration: 4000,
          }
        );

        return false;
      }

      // =================================================
      // MUTATION GUARD
      // =================================================

      if (
        !commentKey ||
        isDeleted ||
        isEditing ||
        requestLockRef.current
      ) {
        return false;
      }

      const request =
        createRequest("like");

      if (!request) {
        return false;
      }

      // =================================================
      // SNAPSHOT
      // =================================================

      const previousLiked =
        Boolean(isLiked);

      const previousCount =
        safeLikesCount(
          likesCount
        );

      const nextLiked =
        !previousLiked;

      const nextCount = Math.max(
        0,
        previousCount +
          (nextLiked ? 1 : -1)
      );

      // =================================================
      // REQUEST LOCK
      // =================================================

      requestLockRef.current = request;

      setProcessingAction("like");
      setLikeError("");

      // =================================================
      // OPTIMISTIC UI
      // =================================================

      setLikeState({
        isLiked: nextLiked,
        likesCount: nextCount,
      });

      // =================================================
      // LOADING TOAST
      // =================================================

      const toastId = beginToast(
        nextLiked
          ? "Sharhga Like qo‘yilmoqda..."
          : "Sharhdan Like olib tashlanmoqda...",

        nextLiked
          ? "Like qo‘yilmoqda"
          : "Like olib tashlanmoqda"
      );

      try {
        // ===============================================
        // API
        // ===============================================

        const response =
          await PostService.togglePostCommentLike(
            request.commentId
          );

        // ===============================================
        // STALE RESPONSE
        // ===============================================

        if (!isCurrentRequest(request)) {
          dismissPendingToast(toastId);
          return false;
        }

        // ===============================================
        // VERIFY RESPONSE
        // ===============================================

        if (!isPlainObject(response)) {
          throw new Error(
            "Server Like holatini qaytarmadi."
          );
        }

        if (
          response.comment_id != null &&
          !isSameId(
            response.comment_id,
            request.commentId
          )
        ) {
          throw new Error(
            "Server boshqa sharhning Like holatini qaytardi."
          );
        }

        // ===============================================
        // SERVER VALUES
        // ===============================================

        const serverLiked = Boolean(
          response.is_liked_by_user ??
          response.is_liked ??
          nextLiked
        );

        const serverCount = safeLikesCount(
          response.likes_count ??
          response.like_count ??
          nextCount
        );

        // ===============================================
        // VERIFY CURRENT COMMENT
        // ===============================================

        const currentComment =
          getReduxComment(
            request.commentId
          );

        if (
          !currentComment ||
          currentComment.is_deleted
        ) {
          dismissPendingToast(toastId);
          return false;
        }

        // ===============================================
        // LOCAL STATE
        // ===============================================

        setLikeState({
          isLiked: serverLiked,
          likesCount: serverCount,
        });

        setLikeError("");

        // ===============================================
        // REDUX SYNCHRONIZATION
        // ===============================================
        //
        // Update only Like-related fields.
        // Keep nested relationships untouched.
        // ===============================================

        dispatch(
          toggleCommentLikeSuccess({
            comment_id:
              currentComment.id,

            is_liked_by_user:
              serverLiked,

            likes_count:
              serverCount,
          })
        );

        // ===============================================
        // SUCCESS TOAST
        // ===============================================

        finishToast(
          toastId,
          "success",

          serverLiked
            ? "Sharhga muvaffaqiyatli Like bosildi."
            : "Sharhdan Like olib tashlandi.",

          serverLiked
            ? "Like bosildi"
            : "Like olib tashlandi"
        );

        return true;
      } catch (requestError) {
        // ===============================================
        // STALE RESPONSE
        // ===============================================

        if (!isCurrentRequest(request)) {
          dismissPendingToast(toastId);
          return false;
        }

        // ===============================================
        // OPTIMISTIC ROLLBACK
        // ===============================================

        setLikeState({
          isLiked: previousLiked,
          likesCount: previousCount,
        });

        // ===============================================
        // ERROR
        // ===============================================

        const message = getRequestError(
          requestError,
          "Sharhning Like holatini o‘zgartirib bo‘lmadi."
        );

        setLikeError(message);

        finishToast(
          toastId,
          "error",
          message,
          "Like saqlanmadi"
        );

        return false;
      } finally {
        releaseRequest(request);
      }
    },
    [
      isLoggedIn,
      commentKey,
      isDeleted,
      isEditing,
      createRequest,
      isLiked,
      likesCount,
      beginToast,
      isCurrentRequest,
      dismissPendingToast,
      getReduxComment,
      dispatch,
      finishToast,
      releaseRequest,
    ]
  );

  // =====================================================
  // RETURN — EXISTING CONTRACT PRESERVED
  // =====================================================

  return {
    // ===================================================
    // IDENTITY
    // ===================================================

    commentId,

    // ===================================================
    // PERMISSIONS
    // ===================================================

    isCommentOwner,

    // ===================================================
    // LIKE
    // ===================================================

    isLiked,
    likesCount,
    isLiking,
    likeError,

    handleLikeToggle,

    // ===================================================
    // EDIT
    // ===================================================

    isEditing,
    editMessage,
    editError,

    handleStartEdit,
    handleCancelEdit,
    handleEditMessageChange,
    handleSaveEdit,

    // Legacy compatibility
    setEditMessage:
      handleEditMessageChange,

    // ===================================================
    // DELETE
    // ===================================================

    isDeleteModalOpen,

    handleOpenDelete,
    handleCloseDelete,
    handleConfirmDelete,

    // ===================================================
    // PROCESSING
    // ===================================================

    processingAction,

    isProcessing,
    isUpdating,
    isDeleting,
  };
};

export default usePostCommentActions;
