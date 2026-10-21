
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
  deleteCommentSuccess,
  updateCommentSuccess,
} from "../../../../features/posts";

import {
  siteToast,
} from "../../../ui/AuthToast";

import {
  getCommentErrorMessage,
  normalizeLikesCount,
} from "../commentUtils";

// =========================================================
// FSOCIETY — USE POST COMMENT ACTIONS
// =========================================================
//
// Location:
// comments/item/usePostCommentActions.js
//
// Responsibilities:
// - Comment ownership
// - Like / Unlike
// - Edit comment
// - Delete comment
// - Edit/Delete modal states
// - Optimistic like UI
// - Redux synchronization
// - Universal siteToast
// - Loading states
// - Duplicate request protection
// - Stale response protection
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
// ID HELPERS
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

// =========================================================
// USER HELPERS
// =========================================================

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

  const firstUsername =
    normalizeUsername(
      first.username
    );

  const secondUsername =
    normalizeUsername(
      second.username
    );

  return Boolean(
    firstUsername &&
    firstUsername === secondUsername
  );
};

// =========================================================
// NUMBER HELPERS
// =========================================================

const safeLikesCount = (value) => {
  const count = Number(value);

  return Number.isFinite(count)
    ? Math.max(0, Math.trunc(count))
    : 0;
};

// =========================================================
// ERROR HELPER
// =========================================================

const getRequestError = (
  error,
  fallback
) => {
  return getCommentErrorMessage(
    error,
    fallback
  );
};

// =========================================================
// MAIN HOOK
// =========================================================

const usePostCommentActions = ({
  comment = null,
  currentUser = null,
  isLoggedIn = false,
} = {}) => {
  // =======================================================
  // REDUX
  // =======================================================

  const dispatch = useDispatch();
  const store = useStore();

  // =======================================================
  // COMMENT IDENTITY
  // =======================================================

  const commentId = comment?.id;
  const commentKey = normalizeId(
    commentId
  );

  // =======================================================
  // PERMISSIONS
  // =======================================================

  const commentUser =
    comment?.user ?? null;

  const calculatedOwner = isSameUser(
    currentUser,
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
    backendOwner
  );

  // =======================================================
  // EDIT STATE
  // =======================================================

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

  // =======================================================
  // DELETE MODAL STATE
  // =======================================================

  const [
    isDeleteModalOpen,
    setIsDeleteModalOpen,
  ] = useState(false);

  // =======================================================
  // PROCESSING STATE
  // =======================================================

  // null | "like" | "edit" | "delete"

  const [
    processingAction,
    setProcessingAction,
  ] = useState(null);

  // =======================================================
  // LIKE STATE
  // =======================================================

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

  const isLiked =
    likeState.isLiked;

  const likesCount =
    likeState.likesCount;

  const isLiking =
    processingAction === "like";

  const isProcessing =
    processingAction === "edit" ||
    processingAction === "delete";

  const isUpdating =
    processingAction === "edit";

  const isDeleting =
    processingAction === "delete";

  // =======================================================
  // REFS
  // =======================================================

  const mountedRef = useRef(false);

  const latestCommentKeyRef =
    useRef(commentKey);

  latestCommentKeyRef.current =
    commentKey;

  // A single comment must not run
  // Like/Edit/Delete at the same time.

  const requestLockRef = useRef(null);

  // Track pending loading toasts.
  // Completed success/error toasts
  // should remain visible after unmount.

  const pendingToastsRef = useRef(
    new Set()
  );

  // =======================================================
  // MOUNT / UNMOUNT
  // =======================================================

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      // Dismiss only unfinished loading
      // toasts when the card unmounts.

      pendingToastsRef.current.forEach(
        (id) => {
          siteToast.dismiss(id);
        }
      );

      pendingToastsRef.current.clear();
    };
  }, []);

  // =======================================================
  // SYNC EDIT DRAFT
  // =======================================================

  useEffect(() => {
    // Do not overwrite a draft while
    // the user is editing.

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

  // =======================================================
  // RESET MODALS WHEN COMMENT CHANGES
  // =======================================================

  useEffect(() => {
    setIsEditing(false);
    setIsDeleteModalOpen(false);
    setEditError("");
  }, [commentKey]);

  // =======================================================
  // SYNC LIKE DATA
  // =======================================================

  useEffect(() => {
    // During an optimistic like request,
    // do not let an unrelated Redux render
    // overwrite the temporary UI.

    const activeRequest =
      requestLockRef.current;

    if (
      activeRequest?.type === "like" &&
      activeRequest.commentKey ===
        commentKey
    ) {
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
    processingAction,
  ]);

  // =======================================================
  // GET CURRENT REDUX COMMENT
  // =======================================================

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

  // =======================================================
  // CREATE REQUEST SNAPSHOT
  // =======================================================

  const createRequest = useCallback(
    (type) => {
      if (!commentKey) {
        return null;
      }

      const postState =
        store.getState()?.post;

      const postId =
        postState?.postDetail?.id;

      const postKey =
        normalizeId(postId);

      if (!postKey) {
        return null;
      }

      const reduxComment =
        getReduxComment(commentId);

      if (!reduxComment) {
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

  // =======================================================
  // VERIFY REQUEST
  // =======================================================

  const isCurrentRequest = useCallback(
    (request) => {
      if (
        !request ||
        !mountedRef.current
      ) {
        return false;
      }

      // Comment component must still
      // represent the same comment.

      if (
        latestCommentKeyRef.current !==
        request.commentKey
      ) {
        return false;
      }

      const postState =
        store.getState()?.post;

      // Do not modify comments if user
      // navigated to another post.

      if (
        normalizeId(
          postState?.postDetail?.id
        ) !== request.postKey
      ) {
        return false;
      }

      // Comment must still exist in
      // the current Redux comments list.

      return Boolean(
        getReduxComment(
          request.commentId
        )
      );
    },
    [
      store,
      getReduxComment,
    ]
  );

  // =======================================================
  // TOAST HELPERS
  // =======================================================

  const beginToast = useCallback(
    (message, title) => {
      const id = siteToast.loading(
        message,
        { title }
      );

      pendingToastsRef.current.add(
        id
      );

      return id;
    },
    []
  );

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

  const dismissPendingToast = useCallback(
    (id) => {
      pendingToastsRef.current.delete(
        id
      );

      siteToast.dismiss(id);
    },
    []
  );

  // =======================================================
  // RELEASE REQUEST LOCK
  // =======================================================

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

  // =======================================================
  // CHANGE EDIT MESSAGE
  // =======================================================

  const handleEditMessageChange =
    useCallback(
      (value) => {
        if (requestLockRef.current) {
          return;
        }

        setEditMessage(
          String(value ?? "")
        );

        setEditError("");
      },
      []
    );

  // =======================================================
  // OPEN EDIT
  // =======================================================

  const handleStartEdit = useCallback(
    () => {
      if (
        !isCommentOwner ||
        !commentKey ||
        requestLockRef.current
      ) {
        return;
      }

      setIsDeleteModalOpen(false);

      setEditMessage(
        String(comment?.message ?? "")
      );

      setEditError("");
      setIsEditing(true);
    },
    [
      isCommentOwner,
      commentKey,
      comment?.message,
    ]
  );

  // =======================================================
  // CANCEL EDIT
  // =======================================================

  const handleCancelEdit = useCallback(
    () => {
      if (requestLockRef.current) {
        return;
      }

      setEditMessage(
        String(comment?.message ?? "")
      );

      setEditError("");
      setIsEditing(false);
    },
    [comment?.message]
  );

  // =======================================================
  // SAVE EDIT
  // =======================================================

  const handleSaveEdit = useCallback(
    async () => {
      if (
        !isCommentOwner ||
        !isEditing ||
        requestLockRef.current
      ) {
        return false;
      }

      const cleanMessage = String(
        editMessage ?? ""
      ).trim();

      const previousMessage = String(
        comment?.message ?? ""
      ).trim();

      // =====================================
      // VALIDATION
      // =====================================

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
          "Sharh 255 ta belgidan oshmasligi kerak."
        );

        return false;
      }

      if (
        cleanMessage ===
        previousMessage
      ) {
        setEditError("");
        setIsEditing(false);

        return true;
      }

      // =====================================
      // REQUEST LOCK
      // =====================================

      const request =
        createRequest("edit");

      if (!request) {
        setEditError(
          "Sharh ma’lumotlari yangilanmoqda. Qayta urinib ko‘ring."
        );

        return false;
      }

      requestLockRef.current =
        request;

      setProcessingAction("edit");
      setEditError("");

      // =====================================
      // LOADING TOAST
      // =====================================

      const toastId = beginToast(
        "Sharhdagi o‘zgarishlar saqlanmoqda...",
        "Sharh tahrirlanmoqda"
      );

      try {
        // ===================================
        // API
        // ===================================

        const response =
          await PostService.updatePostComment(
            request.commentId,
            {
              message: cleanMessage,
            }
          );

        // ===================================
        // STALE RESPONSE
        // ===================================

        if (!isCurrentRequest(request)) {
          dismissPendingToast(toastId);

          return false;
        }

        // ===================================
        // NORMALIZE RESPONSE
        // ===================================

        const rawUpdated =
          response?.comment ??
          response;

        const updatedFields =
          rawUpdated &&
          typeof rawUpdated === "object" &&
          !Array.isArray(rawUpdated)
            ? rawUpdated
            : {};

        // Reject unexpected comment IDs.
        // Never replace another user's
        // comment by mistake.

        if (
          updatedFields.id != null &&
          !isSameId(
            updatedFields.id,
            request.commentId
          )
        ) {
          throw new Error(
            "Server boshqa sharh ma’lumotlarini qaytardi."
          );
        }

        const currentComment =
          getReduxComment(
            request.commentId
          );

        if (!currentComment) {
          dismissPendingToast(toastId);

          return false;
        }

        // ===================================
        // MERGE COMMENT FIELDS
        // ===================================

        const updatedComment = {
          ...currentComment,
          ...updatedFields,

          // Preserve the original ID type.
          // Redux reducer uses strict
          // equality to find this comment.

          id: currentComment.id,

          message:
            typeof updatedFields.message ===
            "string"
              ? updatedFields.message
              : cleanMessage,
        };

        // ===================================
        // REDUX UPDATE
        // ===================================

        dispatch(
          updateCommentSuccess(
            updatedComment
          )
        );

        // ===================================
        // CLOSE EDIT MODE
        // ===================================

        setEditMessage(
          updatedComment.message
        );

        setEditError("");
        setIsEditing(false);

        // ===================================
        // SUCCESS TOAST
        // ===================================

        finishToast(
          toastId,
          "success",
          "Sharhingiz muvaffaqiyatli tahrirlandi.",
          "Sharh yangilandi"
        );

        return true;
      } catch (requestError) {
        if (!isCurrentRequest(request)) {
          dismissPendingToast(toastId);

          return false;
        }

        const message =
          getRequestError(
            requestError,
            "Sharhni saqlashda xato yuz berdi."
          );

        // Keep edited text in textarea.
        setEditError(message);

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

  // =======================================================
  // OPEN DELETE MODAL
  // =======================================================

  const handleOpenDelete = useCallback(
    () => {
      if (
        !isCommentOwner ||
        !commentKey ||
        isEditing ||
        requestLockRef.current
      ) {
        return;
      }

      setIsDeleteModalOpen(true);
    },
    [
      isCommentOwner,
      commentKey,
      isEditing,
    ]
  );

  // =======================================================
  // CLOSE DELETE MODAL
  // =======================================================

  const handleCloseDelete = useCallback(
    () => {
      if (requestLockRef.current) {
        return;
      }

      setIsDeleteModalOpen(false);
    },
    []
  );

  // =======================================================
  // CONFIRM DELETE
  // =======================================================

  const handleConfirmDelete = useCallback(
    async () => {
      if (
        !isCommentOwner ||
        !isDeleteModalOpen ||
        requestLockRef.current
      ) {
        return false;
      }

      const request =
        createRequest("delete");

      if (!request) {
        return false;
      }

      // =====================================
      // REQUEST LOCK
      // =====================================

      requestLockRef.current =
        request;

      setProcessingAction("delete");

      // =====================================
      // LOADING TOAST
      // =====================================

      const toastId = beginToast(
        "Sharh o‘chirilmoqda...",
        "Sharh o‘chirilmoqda"
      );

      try {
        // ===================================
        // API
        // ===================================

        await PostService.deletePostComment(
          request.commentId
        );

        // ===================================
        // STALE RESPONSE
        // ===================================

        if (!isCurrentRequest(request)) {
          dismissPendingToast(toastId);

          return false;
        }

        // ===================================
        // SUCCESS TOAST
        // ===================================

        // Show success before Redux removal.
        // Removing the comment unmounts
        // PostCommentItem and its hook.

        finishToast(
          toastId,
          "success",
          "Sharhingiz muvaffaqiyatli o‘chirildi.",
          "Sharh o‘chirildi"
        );

        setIsDeleteModalOpen(false);

        // ===================================
        // REDUX DELETE
        // ===================================

        // This reducer already removes
        // the comment AND decrements
        // postDetail.comments_count.
        //
        // Do not also dispatch
        // updatePostDetailLocal.

        dispatch(
          deleteCommentSuccess(
            request.commentId
          )
        );

        return true;
      } catch (requestError) {
        if (!isCurrentRequest(request)) {
          dismissPendingToast(toastId);

          return false;
        }

        const message =
          getRequestError(
            requestError,
            "Sharhni o‘chirishda xato yuz berdi."
          );

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
      createRequest,
      beginToast,
      isCurrentRequest,
      dismissPendingToast,
      finishToast,
      dispatch,
      releaseRequest,
    ]
  );

  // =======================================================
  // LIKE / UNLIKE
  // =======================================================

  const handleLikeToggle = useCallback(
    async () => {
      // =====================================
      // AUTH CHECK
      // =====================================

      if (!isLoggedIn) {
        siteToast.warning(
          "Sharhga like bosish uchun avval tizimga kiring.",
          {
            title: "Kirish talab qilinadi",
            duration: 4000,
          }
        );

        return false;
      }

      // =====================================
      // MUTATION GUARD
      // =====================================

      if (
        !commentKey ||
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

      // =====================================
      // SNAPSHOT
      // =====================================

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

      // =====================================
      // REQUEST LOCK
      // =====================================

      requestLockRef.current =
        request;

      setProcessingAction("like");

      // =====================================
      // OPTIMISTIC UI
      // =====================================

      setLikeState({
        isLiked: nextLiked,
        likesCount: nextCount,
      });

      // =====================================
      // LOADING TOAST
      // =====================================

      const toastId = beginToast(
        nextLiked
          ? "Sharhga like qo‘yilmoqda..."
          : "Sharhdan like olib tashlanmoqda...",
        nextLiked
          ? "Like qo‘yilmoqda"
          : "Like olib tashlanmoqda"
      );

      try {
        // ===================================
        // API
        // ===================================

        const response =
          await PostService.togglePostCommentLike(
            request.commentId
          );

        // ===================================
        // STALE RESPONSE
        // ===================================

        if (!isCurrentRequest(request)) {
          dismissPendingToast(toastId);

          return false;
        }

        // ===================================
        // VERIFY RESPONSE
        // ===================================

        if (
          response?.comment_id != null &&
          !isSameId(
            response.comment_id,
            request.commentId
          )
        ) {
          throw new Error(
            "Server boshqa sharhning like holatini qaytardi."
          );
        }

        // ===================================
        // SERVER VALUES
        // ===================================

        const serverLiked = Boolean(
          response?.is_liked_by_user ??
          response?.is_liked ??
          nextLiked
        );

        const serverCount =
          safeLikesCount(
            response?.likes_count ??
            response?.like_count ??
            nextCount
          );

        // ===================================
        // LOCAL STATE
        // ===================================

        setLikeState({
          isLiked: serverLiked,
          likesCount: serverCount,
        });

        // ===================================
        // REDUX SYNC
        // ===================================

        const currentComment =
          getReduxComment(
            request.commentId
          );

        if (!currentComment) {
          dismissPendingToast(toastId);

          return false;
        }

        dispatch(
          updateCommentSuccess({
            ...currentComment,

            // Preserve exact ID type.
            id: currentComment.id,

            is_liked_by_user:
              serverLiked,

            likes_count:
              serverCount,
          })
        );

        // ===================================
        // UNIVERSAL SUCCESS TOAST
        // ===================================

        finishToast(
          toastId,
          "success",
          serverLiked
            ? "Sharhga muvaffaqiyatli like bosildi."
            : "Sharhdan like olib tashlandi.",
          serverLiked
            ? "Like bosildi"
            : "Like olib tashlandi"
        );

        return true;
      } catch (requestError) {
        // ===================================
        // STALE REQUEST
        // ===================================

        if (!isCurrentRequest(request)) {
          dismissPendingToast(toastId);

          return false;
        }

        // ===================================
        // OPTIMISTIC ROLLBACK
        // ===================================

        setLikeState({
          isLiked: previousLiked,
          likesCount: previousCount,
        });

        const message =
          getRequestError(
            requestError,
            "Sharhning like holatini o‘zgartirib bo‘lmadi."
          );

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

  // =======================================================
  // RETURN
  // =======================================================

  return {
    // =====================================
    // PERMISSIONS
    // =====================================

    isCommentOwner,

    // =====================================
    // LIKE
    // =====================================

    isLiked,
    likesCount,
    isLiking,

    handleLikeToggle,

    // =====================================
    // EDIT
    // =====================================

    isEditing,
    editMessage,
    editError,

    handleStartEdit,
    handleCancelEdit,
    handleEditMessageChange,
    handleSaveEdit,

    // Optional compatibility:
    setEditMessage:
      handleEditMessageChange,

    // =====================================
    // DELETE
    // =====================================

    isDeleteModalOpen,

    handleOpenDelete,
    handleCloseDelete,
    handleConfirmDelete,

    // =====================================
    // LOADING
    // =====================================

    processingAction,

    isProcessing,
    isUpdating,
    isDeleting,
  };
};

export default usePostCommentActions;
