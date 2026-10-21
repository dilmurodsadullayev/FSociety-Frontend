
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

import {
  useNavigate,
} from "react-router-dom";

import PostService from "../../../../services/post";

import {
  getPostDetailSuccess,
  togglePostLikeFailure,
  togglePostLikeStart,
  togglePostLikeSuccess,
  updatePostDetailLocal,
} from "../../../../features/posts";

import {
  siteToast,
} from "../../../ui/AuthToast";

import {
  getErrorMessage,
  safeNumber,
} from "../postDetailHelpers";

// =========================================================
// FSOCIETY — USE POST DETAIL ACTIONS
// =========================================================
//
// Features:
//
// - Like / Unlike
// - Optimistic Redux updates
// - Universal success / error alerts
// - Loading -> Success / Error toast
// - Edit Post
// - Delete Post
// - Copy Link
// - Bookmark placeholder
// - Edit / Delete modal management
// - Duplicate request prevention
// - Stale response protection
// - Route-aware UI state
//
// Existing API and Redux contracts preserved.
//
// =========================================================

// =========================================================
// HELPERS
// =========================================================

const normalizeValue = (value) => {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value).trim();
};

const getRouteKey = (username, slug) => {
  return JSON.stringify([
    normalizeValue(username),
    normalizeValue(slug),
  ]);
};

const getUserKey = (user) => {
  if (
    user?.id !== null &&
    user?.id !== undefined
  ) {
    return `id:${user.id}`;
  }

  return user?.username
    ? `username:${String(
        user.username
      ).toLowerCase()}`
    : "";
};

const isSameUser = (first, second) => {
  if (!first || !second) {
    return false;
  }

  const firstId = normalizeValue(
    first.id
  );

  const secondId = normalizeValue(
    second.id
  );

  if (firstId && secondId) {
    return firstId === secondId;
  }

  const firstUsername = normalizeValue(
    first.username
  ).toLowerCase();

  const secondUsername = normalizeValue(
    second.username
  ).toLowerCase();

  return Boolean(
    firstUsername &&
    secondUsername &&
    firstUsername === secondUsername
  );
};

const isSamePostId = (post, id) => {
  return Boolean(
    post &&
    normalizeValue(post.id) &&
    normalizeValue(post.id) ===
      normalizeValue(id)
  );
};

// =========================================================
// TOAST HELPERS
// =========================================================
//
// Reuse the existing siteToast API.
//
// The same ID converts:
// Loading -> Success
// Loading -> Error
//
// Avoid duplicate alerts.
// =========================================================

const showLoadingToast = (
  message,
  title
) => {
  return siteToast.loading(message, {
    title,
  });
};

const showSuccessToast = (
  id,
  message,
  title,
  duration = 3600
) => {
  return siteToast.success(message, {
    id,
    title,
    duration,
  });
};

const showErrorToast = (
  id,
  message,
  title
) => {
  return siteToast.error(message, {
    id,
    title,
    duration: 5000,
  });
};

const dismissToast = (id) => {
  if (
    id !== null &&
    id !== undefined
  ) {
    siteToast.dismiss(id);
  }
};

// =========================================================
// CLIPBOARD
// =========================================================

const copyTextFallback = (text) => {
  const textarea =
    document.createElement("textarea");

  textarea.value = text;

  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.opacity = "0";

  textarea.setAttribute(
    "readonly",
    ""
  );

  document.body.appendChild(textarea);

  try {
    textarea.select();

    const copied =
      document.execCommand("copy");

    if (!copied) {
      throw new Error(
        "Clipboard amali bajarilmadi."
      );
    }
  } finally {
    textarea.remove();
  }
};

const copyText = async (text) => {
  if (
    typeof navigator !== "undefined" &&
    navigator.clipboard?.writeText
  ) {
    try {
      await navigator.clipboard.writeText(
        text
      );

      return;
    } catch {
      // Browser may block Clipboard API.
      // Use the fallback below.
    }
  }

  copyTextFallback(text);
};

// =========================================================
// MAIN HOOK
// =========================================================

const usePostDetailActions = ({
  username,
  slug,

  postData = null,

  currentUser = null,
  isLoggedIn = false,
} = {}) => {
  const dispatch = useDispatch();
  const store = useStore();
  const navigate = useNavigate();

  // =======================================================
  // ROUTE / USER
  // =======================================================

  const routeKey = getRouteKey(
    username,
    slug
  );

  const userKey = getUserKey(
    currentUser
  );

  const scopeKey = JSON.stringify([
    routeKey,
    userKey,
  ]);

  const postId =
    postData?.id ?? null;

  const isOwner = isSameUser(
    currentUser,
    postData?.user
  );

  // =======================================================
  // REFS
  // =======================================================

  const mountedRef = useRef(false);
  const lifecycleRef = useRef(0);

  const latestContextRef = useRef(null);

  latestContextRef.current = {
    routeKey,
    userKey,
    postId,
  };

  // =======================================================
  // REQUEST LOCKS
  // =======================================================

  const likeLockRef = useRef(null);
  const updateLockRef = useRef(null);
  const deleteLockRef = useRef(null);

  const copyTimerRef = useRef(null);

  // =======================================================
  // BUSY STATE
  // =======================================================

  const [
    busyState,
    setBusyState,
  ] = useState({
    liking: false,
    updating: false,
    deleting: false,
  });

  // =======================================================
  // MODAL STATE
  // =======================================================

  const [
    modalState,
    setModalState,
  ] = useState({
    scopeKey,
    edit: false,
    delete: false,
  });

  // =======================================================
  // COPY STATE
  // =======================================================

  const [
    copiedState,
    setCopiedState,
  ] = useState({
    scopeKey,
    copied: false,
  });

  // =======================================================
  // MOUNT / UNMOUNT
  // =======================================================

  useEffect(() => {
    mountedRef.current = true;

    lifecycleRef.current += 1;

    return () => {
      mountedRef.current = false;

      lifecycleRef.current += 1;

      if (copyTimerRef.current !== null) {
        clearTimeout(
          copyTimerRef.current
        );

        copyTimerRef.current = null;
      }
    };
  }, []);

  // =======================================================
  // RESET ROUTE / USER UI
  // =======================================================

  useEffect(() => {
    setModalState({
      scopeKey,
      edit: false,
      delete: false,
    });

    setCopiedState({
      scopeKey,
      copied: false,
    });

    if (copyTimerRef.current !== null) {
      clearTimeout(
        copyTimerRef.current
      );

      copyTimerRef.current = null;
    }
  }, [scopeKey]);

  // =======================================================
  // DERIVED STATE
  // =======================================================

  const isLiking = busyState.liking;
  const isUpdating = busyState.updating;
  const isDeleting = busyState.deleting;

  const isEditModalOpen =
    modalState.scopeKey === scopeKey &&
    modalState.edit;

  const isDeleteModalOpen =
    modalState.scopeKey === scopeKey &&
    modalState.delete;

  const isLinkCopied =
    copiedState.scopeKey === scopeKey &&
    copiedState.copied;

  const hasActiveMutation =
    isLiking ||
    isUpdating ||
    isDeleting ||
    Boolean(likeLockRef.current) ||
    Boolean(updateLockRef.current) ||
    Boolean(deleteLockRef.current);

  // =======================================================
  // REQUEST SNAPSHOT
  // =======================================================

  const createRequestSnapshot = useCallback(
    () => ({
      routeKey,
      userKey,
      postId,

      username: normalizeValue(username),
      slug: normalizeValue(slug),

      lifecycle: lifecycleRef.current,
    }),
    [
      routeKey,
      userKey,
      postId,
      username,
      slug,
    ]
  );

  // =======================================================
  // VERIFY CURRENT REQUEST
  // =======================================================

  const isCurrentRequest = useCallback(
    (request) => {
      if (
        !mountedRef.current ||
        lifecycleRef.current !==
          request.lifecycle
      ) {
        return false;
      }

      const context =
        latestContextRef.current;

      if (
        !context ||
        context.routeKey !== request.routeKey ||
        context.userKey !== request.userKey ||
        normalizeValue(context.postId) !==
          normalizeValue(request.postId)
      ) {
        return false;
      }

      const reduxPost =
        store.getState()?.post?.postDetail;

      return isSamePostId(
        reduxPost,
        request.postId
      );
    },
    [store]
  );

  // =======================================================
  // OPEN EDIT MODAL
  // =======================================================

  const handleOpenEdit = useCallback(
    () => {
      if (
        !isOwner ||
        postId === null ||
        postId === undefined ||
        hasActiveMutation
      ) {
        return;
      }

      setModalState({
        scopeKey,
        edit: true,
        delete: false,
      });
    },
    [
      isOwner,
      postId,
      hasActiveMutation,
      scopeKey,
    ]
  );

  // =======================================================
  // CLOSE EDIT MODAL
  // =======================================================

  const handleCloseEdit = useCallback(
    () => {
      if (updateLockRef.current) {
        return;
      }

      setModalState({
        scopeKey,
        edit: false,
        delete: false,
      });
    },
    [scopeKey]
  );

  // =======================================================
  // OPEN DELETE MODAL
  // =======================================================

  const handleOpenDelete = useCallback(
    () => {
      if (
        !isOwner ||
        postId === null ||
        postId === undefined ||
        hasActiveMutation
      ) {
        return;
      }

      setModalState({
        scopeKey,
        edit: false,
        delete: true,
      });
    },
    [
      isOwner,
      postId,
      hasActiveMutation,
      scopeKey,
    ]
  );

  // =======================================================
  // CLOSE DELETE MODAL
  // =======================================================

  const handleCloseDelete = useCallback(
    () => {
      if (deleteLockRef.current) {
        return;
      }

      setModalState({
        scopeKey,
        edit: false,
        delete: false,
      });
    },
    [scopeKey]
  );

  // =======================================================
  // LIKE / UNLIKE
  // =======================================================

  const handleLikeToggle = useCallback(
    async () => {
      // =====================================
      // AUTHENTICATION
      // =====================================

      if (!isLoggedIn) {
        siteToast.warning(
          "Like bosish uchun avval tizimga kiring.",
          {
            title: "Kirish talab qilinadi",
            duration: 4000,
          }
        );

        return false;
      }

      // =====================================
      // REQUEST GUARDS
      // =====================================

      if (
        !postData?.id ||
        likeLockRef.current ||
        updateLockRef.current ||
        deleteLockRef.current
      ) {
        return false;
      }

      // =====================================
      // REQUEST SNAPSHOT
      // =====================================

      const request =
        createRequestSnapshot();

      const previousLiked = Boolean(
        postData.is_liked_by_user
      );

      const previousCount = safeNumber(
        postData.likes_count
      );

      const nextLiked =
        !previousLiked;

      const nextCount = Math.max(
        0,
        previousCount +
          (nextLiked ? 1 : -1)
      );

      // =====================================
      // SYNCHRONOUS LOCK
      // =====================================

      likeLockRef.current = request;

      setBusyState((previous) => ({
        ...previous,
        liking: true,
      }));

      let toastId = null;

      try {
        // ===================================
        // UNIVERSAL LOADING ALERT
        // ===================================

        toastId = showLoadingToast(
          nextLiked
            ? "Postga like qo‘yilmoqda..."
            : "Like olib tashlanmoqda...",
          nextLiked
            ? "Like qo‘yilmoqda"
            : "Like olib tashlanmoqda"
        );

        // ===================================
        // OPTIMISTIC UPDATE
        // ===================================

        dispatch(
          togglePostLikeStart()
        );

        dispatch(
          updatePostDetailLocal({
            is_liked_by_user:
              nextLiked,

            likes_count:
              nextCount,
          })
        );

        // ===================================
        // API REQUEST
        // ===================================

        const response =
          await PostService.togglePostLike(
            request.postId
          );

        // ===================================
        // OLD REQUEST PROTECTION
        // ===================================

        if (!isCurrentRequest(request)) {
          dismissToast(toastId);

          // Preserve the existing Redux
          // loading-state settlement.

          dispatch(
            togglePostLikeFailure(
              "Like holatini qayta tekshiring."
            )
          );

          return false;
        }

        // ===================================
        // SERVER VALUES
        // ===================================

        const serverLiked = Boolean(
          response?.is_liked_by_user ??
          response?.is_liked ??
          nextLiked
        );

        const serverCount = safeNumber(
          response?.likes_count ??
          response?.like_count ??
          nextCount
        );

        // ===================================
        // REDUX SUCCESS
        // ===================================

        dispatch(
          togglePostLikeSuccess({
            post_id:
              request.postId,

            is_liked_by_user:
              serverLiked,

            likes_count:
              serverCount,
          })
        );

        // ===================================
        // UNIVERSAL SUCCESS ALERT
        // ===================================

        showSuccessToast(
          toastId,
          serverLiked
            ? "Postga muvaffaqiyatli like bosildi!"
            : "Postdan like muvaffaqiyatli olib tashlandi.",
          serverLiked
            ? "Like bosildi"
            : "Like olib tashlandi",
          3000
        );

        return true;
      } catch (requestError) {
        // ===================================
        // OLD REQUEST
        // ===================================

        if (!isCurrentRequest(request)) {
          dismissToast(toastId);

          dispatch(
            togglePostLikeFailure(
              "Like holatini qayta tekshiring."
            )
          );

          return false;
        }

        // ===================================
        // OPTIMISTIC ROLLBACK
        // ===================================

        dispatch(
          updatePostDetailLocal({
            is_liked_by_user:
              previousLiked,

            likes_count:
              previousCount,
          })
        );

        const message = getErrorMessage(
          requestError,
          "Like holatini o‘zgartirib bo‘lmadi."
        );

        dispatch(
          togglePostLikeFailure(
            message
          )
        );

        // ===================================
        // UNIVERSAL ERROR ALERT
        // ===================================

        showErrorToast(
          toastId,
          message,
          "Like saqlanmadi"
        );

        return false;
      } finally {
        if (
          likeLockRef.current === request
        ) {
          likeLockRef.current = null;
        }

        if (mountedRef.current) {
          setBusyState((previous) => ({
            ...previous,
            liking: false,
          }));
        }
      }
    },
    [
      isLoggedIn,
      postData,
      dispatch,
      createRequestSnapshot,
      isCurrentRequest,
    ]
  );

  // =======================================================
  // UPDATE POST
  // =======================================================

  const handleUpdatePost = useCallback(
    async (formData) => {
      // =====================================
      // VALIDATION
      // =====================================

      if (
        !isOwner ||
        !postData?.id ||
        !isEditModalOpen ||
        updateLockRef.current ||
        deleteLockRef.current ||
        likeLockRef.current
      ) {
        return false;
      }

      // =====================================
      // REQUEST SNAPSHOT
      // =====================================

      const request =
        createRequestSnapshot();

      const requestPost = postData;

      updateLockRef.current = request;

      setBusyState((previous) => ({
        ...previous,
        updating: true,
      }));

      let toastId = null;

      try {
        // ===================================
        // UNIVERSAL LOADING ALERT
        // ===================================

        toastId = showLoadingToast(
          "Postdagi o‘zgarishlar saqlanmoqda...",
          "Post tahrirlanmoqda"
        );

        // ===================================
        // PATCH API
        // ===================================

        const updatedPost =
          await PostService.updatePost(
            request.username,
            request.slug,
            formData
          );

        // ===================================
        // STALE RESPONSE PROTECTION
        // ===================================

        if (!isCurrentRequest(request)) {
          dismissToast(toastId);
          return false;
        }

        // ===================================
        // PRESERVE POST DATA
        // ===================================

        const serverPost =
          updatedPost &&
          typeof updatedPost === "object" &&
          !Array.isArray(updatedPost)
            ? updatedPost
            : {};

        const nextPost = {
          ...requestPost,
          ...formData,
          ...serverPost,
        };

        // ===================================
        // UPDATE REDUX
        // ===================================

        dispatch(
          getPostDetailSuccess(
            nextPost
          )
        );

        // ===================================
        // CLOSE EDIT MODAL
        // ===================================

        setModalState({
          scopeKey,
          edit: false,
          delete: false,
        });

        // ===================================
        // UNIVERSAL SUCCESS ALERT
        // ===================================

        showSuccessToast(
          toastId,
          "Postingizdagi o‘zgarishlar muvaffaqiyatli saqlandi!",
          "Post yangilandi",
          3800
        );

        // ===================================
        // HANDLE SLUG CHANGE
        // ===================================

        const nextSlug = normalizeValue(
          nextPost.slug
        );

        if (
          nextSlug &&
          nextSlug !== request.slug
        ) {
          navigate(
            `/${encodeURIComponent(
              request.username
            )}/post/${encodeURIComponent(
              nextSlug
            )}/`,
            {
              replace: true,
            }
          );
        }

        return true;
      } catch (requestError) {
        // ===================================
        // STALE REQUEST
        // ===================================

        if (!isCurrentRequest(request)) {
          dismissToast(toastId);
          return false;
        }

        const message = getErrorMessage(
          requestError,
          "Postni tahrirlashda xato yuz berdi."
        );

        // ===================================
        // UNIVERSAL ERROR ALERT
        // ===================================

        showErrorToast(
          toastId,
          message,
          "Post yangilanmadi"
        );

        // IMPORTANT:
        // CreatePostModal also needs the
        // error for inline validation.
        //
        // Do not swallow the API error.

        throw requestError;
      } finally {
        if (
          updateLockRef.current === request
        ) {
          updateLockRef.current = null;
        }

        if (mountedRef.current) {
          setBusyState((previous) => ({
            ...previous,
            updating: false,
          }));
        }
      }
    },
    [
      isOwner,
      postData,
      isEditModalOpen,
      createRequestSnapshot,
      isCurrentRequest,
      dispatch,
      navigate,
      scopeKey,
    ]
  );

  // =======================================================
  // DELETE POST
  // =======================================================

  const handleConfirmDelete = useCallback(
    async () => {
      // =====================================
      // REQUEST GUARDS
      // =====================================

      if (
        !isOwner ||
        !postData?.id ||
        !isDeleteModalOpen ||
        deleteLockRef.current ||
        updateLockRef.current ||
        likeLockRef.current
      ) {
        return false;
      }

      const request =
        createRequestSnapshot();

      deleteLockRef.current = request;

      setBusyState((previous) => ({
        ...previous,
        deleting: true,
      }));

      let toastId = null;

      try {
        // ===================================
        // UNIVERSAL LOADING ALERT
        // ===================================

        toastId = showLoadingToast(
          "Post o‘chirilmoqda...",
          "Post o‘chirilmoqda"
        );

        // ===================================
        // DELETE API
        // ===================================

        await PostService.deletePost(
          request.username,
          request.slug
        );

        // ===================================
        // STALE RESPONSE
        // ===================================

        if (!isCurrentRequest(request)) {
          dismissToast(toastId);
          return true;
        }

        // ===================================
        // CLOSE MODAL
        // ===================================

        setModalState({
          scopeKey,
          edit: false,
          delete: false,
        });

        // ===================================
        // UNIVERSAL SUCCESS ALERT
        // ===================================

        showSuccessToast(
          toastId,
          "Postingiz muvaffaqiyatli o‘chirildi.",
          "Post o‘chirildi",
          3800
        );

        // ===================================
        // NAVIGATE TO PROFILE
        // ===================================

        const profileUsername =
          normalizeValue(
            currentUser?.username
          ) ||
          request.username;

        navigate(
          `/${encodeURIComponent(
            profileUsername
          )}/profile/`,
          {
            replace: true,
          }
        );

        return true;
      } catch (requestError) {
        if (!isCurrentRequest(request)) {
          dismissToast(toastId);
          return false;
        }

        const message = getErrorMessage(
          requestError,
          "Postni o‘chirishda xato yuz berdi."
        );

        // ===================================
        // UNIVERSAL ERROR ALERT
        // ===================================

        showErrorToast(
          toastId,
          message,
          "Post o‘chirilmadi"
        );

        return false;
      } finally {
        if (
          deleteLockRef.current === request
        ) {
          deleteLockRef.current = null;
        }

        if (mountedRef.current) {
          setBusyState((previous) => ({
            ...previous,
            deleting: false,
          }));
        }
      }
    },
    [
      isOwner,
      postData,
      isDeleteModalOpen,
      createRequestSnapshot,
      isCurrentRequest,
      currentUser,
      navigate,
      scopeKey,
    ]
  );

  // =======================================================
  // COPY POST LINK
  // =======================================================

  const handleCopyPostLink = useCallback(
    async () => {
      if (
        typeof window === "undefined"
      ) {
        return false;
      }

      const requestedScopeKey =
        scopeKey;

      const postUrl =
        window.location.href;

      try {
        await copyText(postUrl);

        if (
            !mountedRef.current ||
            latestContextRef.current?.routeKey !== routeKey ||
            latestContextRef.current?.userKey !== userKey
        ) {
            return false;
            }

        // ===================================
        // CLEAR OLD TIMER
        // ===================================

        if (copyTimerRef.current !== null) {
          clearTimeout(
            copyTimerRef.current
          );
        }

        // ===================================
        // UPDATE COPY STATE
        // ===================================

        setCopiedState({
          scopeKey: requestedScopeKey,
          copied: true,
        });

        siteToast.success(
          "Post havolasi nusxalandi.",
          {
            title: "Havola nusxalandi",
            duration: 2600,
          }
        );

        // ===================================
        // RESET FEEDBACK
        // ===================================

        copyTimerRef.current =
          setTimeout(() => {
            copyTimerRef.current = null;

            if (
              !mountedRef.current ||
              latestContextRef.current?.routeKey !==
                routeKey ||
              latestContextRef.current?.userKey !==
                userKey
            ) {
              return;
            }

            setCopiedState({
              scopeKey: requestedScopeKey,
              copied: false,
            });
          }, 1800);

        return true;
      } catch {
        if (
          mountedRef.current &&
          latestContextRef.current?.routeKey ===
            routeKey
        ) {
          siteToast.error(
            "Post havolasini nusxalab bo‘lmadi.",
            {
              title: "Nusxalashda xato",
              duration: 4000,
            }
          );
        }

        return false;
      }
    },
    [
      routeKey,
      scopeKey,
      userKey,
    ]
  );

  // =======================================================
  // BOOKMARK
  // =======================================================

  const handleBookmarkClick = useCallback(
    () => {
      siteToast.info(
        "Postni saqlab qolish funksiyasini keyingi bosqichda backend bilan ulaymiz.",
        {
          title: "Saqlab qolish",
          duration: 4000,
        }
      );
    },
    []
  );

  // =======================================================
  // RETURN
  // =======================================================

  return {
    // Owner
    isOwner,

    // Loading
    isLiking,
    isUpdating,
    isDeleting,

    // Modals
    isEditModalOpen,
    isDeleteModalOpen,

    // Link
    isLinkCopied,

    // Modal handlers
    handleOpenEdit,
    handleCloseEdit,
    handleOpenDelete,
    handleCloseDelete,

    // API actions
    handleLikeToggle,
    handleUpdatePost,
    handleConfirmDelete,

    // Other
    handleCopyPostLink,
    handleBookmarkClick,
  };
};

// =========================================================
// EXPORT
// =========================================================

export default usePostDetailActions;
