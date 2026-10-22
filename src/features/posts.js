
import { createSlice } from "@reduxjs/toolkit";

// =========================================================
// HELPERS
// =========================================================

const isObject = (value) =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value);

const sameId = (a, b) =>
  a !== null &&
  a !== undefined &&
  b !== null &&
  b !== undefined &&
  String(a) === String(b);

const positiveCount = (value) => {
  const count = Number(value);
  return Number.isFinite(count)
    ? Math.max(0, count)
    : 0;
};

const hasOwn = (object, key) =>
  Object.prototype.hasOwnProperty.call(object, key);

const getParentId = (comment) => {
  const value =
    comment?.parent !== undefined
      ? comment.parent
      : comment?.parent_id;

  return isObject(value) ? value.id ?? null : value ?? null;
};

// =========================================================
// ERROR NORMALIZATION
// =========================================================

const flattenErrors = (value, prefix = "") => {
  if (value == null) return [];

  if (Array.isArray(value)) {
    return value.flatMap((item) =>
      flattenErrors(item, prefix)
    );
  }

  if (isObject(value)) {
    return Object.entries(value).flatMap(([key, item]) => {
      const isGeneral = [
        "detail",
        "error",
        "non_field_errors",
        "message",
      ].includes(key);

      const label = isGeneral
        ? prefix
        : prefix
          ? `${prefix}.${key}`
          : key;

      return flattenErrors(item, label);
    });
  }

  const text = String(value).trim();
  if (!text) return [];

  return [prefix ? `${prefix}: ${text}` : text];
};

const parseError = (payload, fallback) => {
  if (typeof payload === "string" && payload.trim()) {
    return {
      message: payload.trim(),
      details: null,
    };
  }

  if (!isObject(payload) && !(payload instanceof Error)) {
    return { message: fallback, details: null };
  }

  const raw =
    payload.validationErrors ??
    payload.details ??
    payload.response?.data ??
    null;

  const messages = raw
    ? [...new Set(flattenErrors(raw))]
    : [];

  const primary =
    typeof payload.message === "string"
      ? payload.message.trim()
      : "";

  const message =
    primary ||
    messages.join("\n") ||
    fallback;

  const statusCode =
    payload.status ?? payload.response?.status ?? null;

  return {
    message,
    details: {
      status: statusCode,
      fields: isObject(raw) ? raw : null,
    },
  };
};

const setError = (state, key, payload, fallback) => {
  const result = parseError(payload, fallback);
  state[key] = result.message;
  state[`${key}_details`] = result.details;
};

const clearError = (state, key) => {
  state[key] = null;
  state[`${key}_details`] = null;
};

// =========================================================
// POST RESPONSE NORMALIZATION
// =========================================================

const normalizePosts = (payload) => {
  const results = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.results)
      ? payload.results
      : [];

  const count = Array.isArray(payload)
    ? payload.length
    : positiveCount(payload?.count ?? results.length);

  return {
    results,
    pagination: {
      count,
      next: payload?.next ?? null,
      previous: payload?.previous ?? null,
    },
  };
};

// =========================================================
// COMMENT NORMALIZATION
// =========================================================
//
// Redux stores one flat source of truth.
//
// If backend returns nested replies, each reply
// is flattened and keeps its parent ID.
//
// No comment should appear twice.
// =========================================================

const normalizeComments = (payload) => {
  const source = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.results)
      ? payload.results
      : [];

  const result = [];
  const seen = new Set();

  const visit = (comment, fallbackParent = null) => {
    if (!isObject(comment)) return;
    if (comment.id === null || comment.id === undefined) {
      return;
    }

    const id = String(comment.id);
    if (seen.has(id)) return;
    seen.add(id);

    const {
      replies: children,
      ...fields
    } = comment;

    const parent = getParentId(comment);

    result.push({
      ...fields,
      parent: parent ?? fallbackParent,
      replies: [],
    });

    if (Array.isArray(children)) {
      children.forEach((child) =>
        visit(child, comment.id)
      );
    }
  };

  source.forEach((comment) => visit(comment));

  return result;
};

// =========================================================
// POST COMMENT COUNT
// =========================================================

const adjustCommentsCount = (state, postId, delta) => {
  if (!delta) return;

  const effectivePostId = postId ?? state.postDetail?.id;

  if (!effectivePostId) return;

  if (
    state.postDetail &&
    sameId(state.postDetail.id, effectivePostId)
  ) {
    state.postDetail.comments_count = positiveCount(
      positiveCount(state.postDetail.comments_count) + delta
    );
  }

  if (Array.isArray(state.posts)) {
    state.posts.forEach((post) => {
      if (sameId(post.id, effectivePostId)) {
        post.comments_count = positiveCount(
          positiveCount(post.comments_count) + delta
        );
      }
    });
  }
};

// =========================================================
// OPTIONAL FRONTEND TREE HELPER
// =========================================================
//
// Usage:
//   const tree = buildPostCommentTree(comments);
//
// Roots: newest first
// Replies: oldest first
// =========================================================

export const buildPostCommentTree = (comments = []) => {
  const flat = normalizeComments(comments);
  const nodes = new Map();
  const roots = [];

  flat.forEach((comment) => {
    nodes.set(String(comment.id), {
      ...comment,
      replies: [],
    });
  });

  const createsCycle = (childId, parentId) => {
    const visited = new Set([String(childId)]);
    let current = parentId;

    while (current !== null && current !== undefined) {
      const key = String(current);

      if (visited.has(key)) return true;
      visited.add(key);

      const parent = nodes.get(key);
      if (!parent) return false;

      current = getParentId(parent);
    }

    return false;
  };

  flat.forEach((comment) => {
    const node = nodes.get(String(comment.id));
    const parentId = getParentId(comment);

    const parent =
      parentId === null
        ? null
        : nodes.get(String(parentId));

    if (
      !parent ||
      createsCycle(comment.id, parentId)
    ) {
      roots.push(node);
      return;
    }

    parent.replies.push(node);
  });

  const timeOf = (item) => {
    const timestamp = Date.parse(item.created_at ?? "");
    return Number.isFinite(timestamp) ? timestamp : 0;
  };

  const sortTree = (items, newestFirst = false) => {
    items.sort((a, b) => {
      const difference = newestFirst
        ? timeOf(b) - timeOf(a)
        : timeOf(a) - timeOf(b);

      if (difference) return difference;

      const idA = Number(a.id);
      const idB = Number(b.id);

      if (Number.isFinite(idA) && Number.isFinite(idB)) {
        return newestFirst ? idB - idA : idA - idB;
      }

      return newestFirst
        ? String(b.id).localeCompare(String(a.id))
        : String(a.id).localeCompare(String(b.id));
    });

    items.forEach((item) => {
      if (item.replies.length) {
        sortTree(item.replies, false);
      }
    });
  };

  sortTree(roots, true);

  return roots;
};

// =========================================================
// INITIAL STATE
// =========================================================

const initialState = {
  // Posts list
  post_isLoading: false,
  posts: [],
  posts_pagination: {
    count: 0,
    next: null,
    previous: null,
  },
  post_error: null,
  post_error_details: null,

  // Create post
  create_isLoading: false,
  create_error: null,
  create_error_details: null,

  // Post detail
  postDetail: null,
  detail_isLoading: false,
  detail_error: null,
  detail_error_details: null,

  // Post like
  like_isLoading: false,
  like_error: null,
  like_error_details: null,

  // Comments
  comments: [],
  comments_isLoading: false,
  comments_error: null,
  comments_error_details: null,
};

// =========================================================
// REDUX SLICE
// =========================================================

export const postSlice = createSlice({
  name: "post",
  initialState,

  reducers: {
    // =====================================================
    // POSTS LIST
    // =====================================================

    getPostStart: (state) => {
      state.post_isLoading = true;
      clearError(state, "post_error");
    },

    getPostSuccess: (state, action) => {
      const normalized = normalizePosts(action.payload);

      state.post_isLoading = false;
      state.posts = normalized.results;
      state.posts_pagination = normalized.pagination;

      clearError(state, "post_error");
    },

    getPostFailure: (state, action) => {
      state.post_isLoading = false;

      setError(
        state,
        "post_error",
        action.payload,
        "Postlarni olishda xato yuz berdi."
      );
    },

    // =====================================================
    // CREATE POST
    // =====================================================

    createPostStart: (state) => {
      state.create_isLoading = true;
      clearError(state, "create_error");
    },

    createPostSuccess: (state, action) => {
      state.create_isLoading = false;
      clearError(state, "create_error");

      const post = action.payload;

      if (!isObject(post)) return;

      const exists = state.posts.some((item) =>
        sameId(item.id, post.id)
      );

      if (exists) {
        state.posts = state.posts.map((item) =>
          sameId(item.id, post.id)
            ? { ...item, ...post }
            : item
        );
      } else {
        state.posts.unshift(post);
        state.posts_pagination.count += 1;
      }
    },

    createPostFailure: (state, action) => {
      state.create_isLoading = false;

      setError(
        state,
        "create_error",
        action.payload,
        "Post yaratishda xato yuz berdi."
      );
    },

    // =====================================================
    // POST DETAIL
    // =====================================================

    getPostDetailStart: (state) => {
      state.detail_isLoading = true;
      state.postDetail = null;

      clearError(state, "detail_error");

      // New detail means a different comment scope.
      state.comments = [];
      state.comments_isLoading = false;
      clearError(state, "comments_error");
    },

    getPostDetailSuccess: (state, action) => {
      state.detail_isLoading = false;
      state.postDetail = action.payload ?? null;

      clearError(state, "detail_error");

      // Do not clear comments here.
      // Like and detail updates should not flicker.
    },

    getPostDetailFailure: (state, action) => {
      state.detail_isLoading = false;

      setError(
        state,
        "detail_error",
        action.payload,
        "Post detail olishda xato yuz berdi."
      );
    },

    updatePostDetailLocal: (state, action) => {
      if (!state.postDetail || !isObject(action.payload)) {
        return;
      }

      state.postDetail = {
        ...state.postDetail,
        ...action.payload,
      };
    },

    // =====================================================
    // POST LIKE / UNLIKE
    // =====================================================

    togglePostLikeStart: (state) => {
      state.like_isLoading = true;
      clearError(state, "like_error");
    },

    togglePostLikeSuccess: (state, action) => {
      state.like_isLoading = false;
      clearError(state, "like_error");

      const payload = action.payload;

      if (!isObject(payload)) return;

      const postId =
        payload.post_id ?? state.postDetail?.id;

      if (!postId) return;

      const updateLike = (post) => {
        if (
          !post ||
          !sameId(post.id, postId)
        ) {
          return;
        }

        if (payload.is_liked_by_user !== undefined) {
          post.is_liked_by_user = Boolean(
            payload.is_liked_by_user
          );
        }

        if (payload.likes_count !== undefined) {
          post.likes_count = positiveCount(
            payload.likes_count
          );
        }
      };

      updateLike(state.postDetail);

      state.posts.forEach(updateLike);
    },

    togglePostLikeFailure: (state, action) => {
      state.like_isLoading = false;

      setError(
        state,
        "like_error",
        action.payload,
        "Like bosishda xato yuz berdi."
      );
    },

    // =====================================================
    // COMMENTS LOAD
    // =====================================================

    getCommentsStart: (state) => {
      state.comments_isLoading = true;
      clearError(state, "comments_error");
    },

    getCommentsSuccess: (state, action) => {
      state.comments_isLoading = false;

      // Accept flat arrays, nested arrays or paginated data.
      // Store only flat normalized comments.
      state.comments = normalizeComments(action.payload);

      clearError(state, "comments_error");
    },

    getCommentsFailure: (state, action) => {
      state.comments_isLoading = false;

      setError(
        state,
        "comments_error",
        action.payload,
        "Sharhlarni yuklashda xato yuz berdi."
      );
    },

    // =====================================================
    // ADD COMMENT / REPLY
    // =====================================================

    addCommentSuccess: (state, action) => {
      const normalized = normalizeComments([
        action.payload,
      ]);

      if (!normalized.length) return;

      const comment = normalized[0];

      const exists = state.comments.some((item) =>
        sameId(item.id, comment.id)
      );

      if (exists) {
        state.comments = state.comments.map((item) =>
          sameId(item.id, comment.id)
            ? { ...item, ...comment }
            : item
        );
      } else {
        state.comments.unshift(comment);

        if (!comment.is_deleted) {
          adjustCommentsCount(
            state,
            comment.post,
            1
          );
        }

        const parentId = getParentId(comment);

        if (parentId !== null) {
          const parent = state.comments.find((item) =>
            sameId(item.id, parentId)
          );

          if (parent) {
            parent.replies_count = positiveCount(
              parent.replies_count
            ) + 1;
          }
        }
      }

      clearError(state, "comments_error");
    },

    addCommentFailure: (state, action) => {
      setError(
        state,
        "comments_error",
        action.payload,
        "Sharh yuborishda xato yuz berdi."
      );
    },

    // =====================================================
    // UPDATE COMMENT / REPLY
    // =====================================================

    updateCommentSuccess: (state, action) => {
      const updated = action.payload;

      if (
        !isObject(updated) ||
        updated.id === null ||
        updated.id === undefined
      ) {
        return;
      }

      state.comments = state.comments.map((comment) => {
        if (!sameId(comment.id, updated.id)) {
          return comment;
        }

        return {
          ...comment,
          ...updated,
          // Preserve the flat Redux representation.
          replies: [],
        };
      });

      clearError(state, "comments_error");
    },

    updateCommentFailure: (state, action) => {
      setError(
        state,
        "comments_error",
        action.payload,
        "Sharhni tahrirlashda xato yuz berdi."
      );
    },

    // =====================================================
    // SOFT DELETE COMMENT / REPLY
    // =====================================================

    deleteCommentSuccess: (state, action) => {
      // Supports old dispatch:
      //   dispatch(deleteCommentSuccess(commentId))
      //
      // Supports backend response:
      //   dispatch(deleteCommentSuccess(response.data))

      const payload = action.payload;

      const commentId = isObject(payload)
        ? payload.comment_id ?? payload.id
        : payload;

      if (commentId === null || commentId === undefined) {
        return;
      }

      const comment = state.comments.find((item) =>
        sameId(item.id, commentId)
      );

      if (!comment) return;

      // Do not decrement twice after repeated DELETE.
      if (comment.is_deleted) return;

      const postId = comment.post;

      // Never remove an ancestor from the comment tree.
      // Deleted comment content is masked instead.
      comment.is_deleted = true;
      comment.message = "Sharh o'chirilgan.";
      comment.user = null;
      comment.is_owner = false;
      comment.can_modify = false;
      comment.is_liked_by_user = false;

      adjustCommentsCount(
        state,
        postId,
        -1
      );

      clearError(state, "comments_error");
    },

    deleteCommentFailure: (state, action) => {
      setError(
        state,
        "comments_error",
        action.payload,
        "Sharhni o'chirishda xato yuz berdi."
      );
    },

    // =====================================================
    // COMMENT LIKE / UNLIKE
    // =====================================================
    //
    // New optional action for synchronizing like
    // state from the server response.
    // Existing updateCommentSuccess also still works.
    // =====================================================

    toggleCommentLikeSuccess: (state, action) => {
      const payload = action.payload;

      if (!isObject(payload)) return;

      const id = payload.comment_id ?? payload.id;

      if (id === undefined || id === null) return;

      const comment = state.comments.find((item) =>
        sameId(item.id, id)
      );

      if (!comment || comment.is_deleted) return;

      if (payload.is_liked_by_user !== undefined) {
        comment.is_liked_by_user = Boolean(
          payload.is_liked_by_user
        );
      }

      if (payload.likes_count !== undefined) {
        comment.likes_count = positiveCount(
          payload.likes_count
        );
      }
    },

    // =====================================================
    // CLEAR ERRORS / COMMENTS
    // =====================================================

    clearPostErrors: (state) => {
      clearError(state, "post_error");
      clearError(state, "create_error");
      clearError(state, "detail_error");
      clearError(state, "like_error");
      clearError(state, "comments_error");
    },

    clearPostComments: (state) => {
      state.comments = [];
      state.comments_isLoading = false;
      clearError(state, "comments_error");
    },
  },
});

// =========================================================
// ACTION EXPORTS — OLD NAMES PRESERVED
// =========================================================

export const {
  getPostStart,
  getPostSuccess,
  getPostFailure,

  createPostStart,
  createPostSuccess,
  createPostFailure,

  getPostDetailStart,
  getPostDetailSuccess,
  getPostDetailFailure,

  togglePostLikeStart,
  togglePostLikeSuccess,
  togglePostLikeFailure,

  updatePostDetailLocal,

  getCommentsStart,
  getCommentsSuccess,
  getCommentsFailure,

  addCommentSuccess,
  addCommentFailure,

  updateCommentSuccess,
  updateCommentFailure,

  deleteCommentSuccess,
  deleteCommentFailure,

  toggleCommentLikeSuccess,

  clearPostErrors,
  clearPostComments,
} = postSlice.actions;

export default postSlice.reducer;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            