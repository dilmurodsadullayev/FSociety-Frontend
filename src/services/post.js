
import axios from "./api";

// =========================================================
// FSOCIETY — POST SERVICE
// =========================================================
//
// - Posts / pagination
// - Post detail
// - Post likes
// - Root comments
// - Nested replies
// - Comment edit
// - Comment soft-delete
// - Comment likes
// - Complete Django REST error messages
//
// =========================================================

// =========================================================
// HELPERS
// =========================================================

const isObject = (value) =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value);

// =========================================================
// VALIDATE ID
// =========================================================

const requireId = (value, label = "ID") => {
  const raw = isObject(value)
    ? value.id
    : value;

  const id = String(raw ?? "").trim();

  if (!/^[1-9]\d*$/.test(id)) {
    throw new Error(`${label} noto'g'ri yoki topilmadi.`);
  }

  return id;
};

// =========================================================
// NORMALIZE FIELD ERRORS
// =========================================================

const flattenApiErrors = (value, prefix = "") => {
  if (value === null || value === undefined) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) =>
      flattenApiErrors(item, prefix)
    );
  }

  if (isObject(value)) {
    return Object.entries(value).flatMap(([key, item]) => {
      const generalFields = [
        "detail",
        "error",
        "non_field_errors",
      ];

      const label = generalFields.includes(key)
        ? prefix
        : prefix
          ? `${prefix}.${key}`
          : key;

      return flattenApiErrors(item, label);
    });
  }

  const message = String(value).trim();

  if (!message) return [];

  return [
    prefix
      ? `${prefix}: ${message}`
      : message,
  ];
};

// =========================================================
// HTTP ERROR MESSAGE
// =========================================================

const getHttpFallback = (statusCode, fallback) => {
  switch (statusCode) {
    case 400:
      return "Yuborilgan ma'lumotlar noto'g'ri.";
    case 401:
      return "Davom etish uchun tizimga kiring.";
    case 403:
      return "Sizda ushbu amal uchun ruxsat yo'q.";
    case 404:
      return "So'ralgan ma'lumot topilmadi.";
    case 405:
      return "Ushbu so'rov turiga ruxsat berilmagan.";
    case 408:
      return "So'rov vaqti tugadi. Qayta urinib ko'ring.";
    case 409:
      return "Ma'lumotlar o'rtasida ziddiyat mavjud.";
    case 413:
      return "Yuborilgan ma'lumot hajmi juda katta.";
    case 429:
      return "Juda ko'p so'rov yuborildi. Biroz kuting.";
    case 500:
      return "Serverda ichki xatolik yuz berdi.";
    case 502:
    case 503:
    case 504:
      return "Server hozircha javob bermayapti.";
    default:
      return fallback;
  }
};

// =========================================================
// FULL ERROR EXTRACTION
// =========================================================

export const getPostServiceErrorMessage = (
  error,
  fallback = "Kutilmagan xato yuz berdi."
) => {
  const response = error?.response;
  const data = response?.data;

  // Django / DRF validation errors.
  // Keep every message, not just the first one.

  if (data !== undefined && data !== null) {
    if (typeof data === "string" && data.trim()) {
      const text = data.trim();

      // HTML error pages should not be rendered
      // directly in the UI as validation messages.
      if (
        text.length <= 2000 &&
        !/<\s*(html|head|body|!doctype)\b/i.test(text)
      ) {
        return text;
      }
    }

    if (isObject(data) || Array.isArray(data)) {
      const messages = [
        ...new Set(flattenApiErrors(data)),
      ];

      if (messages.length) {
        return messages.join("\n");
      }
    }
  }

  // Axios network or timeout errors.
  if (
    error?.code === "ERR_NETWORK" ||
    error?.message === "Network Error"
  ) {
    return (
      "Server bilan aloqa o'rnatilmadi. " +
      "Internet va backend holatini tekshiring."
    );
  }

  if (
    error?.code === "ECONNABORTED" ||
    error?.code === "ETIMEDOUT"
  ) {
    return "Server javobi kechikdi. Qayta urinib ko'ring.";
  }

  if (response?.status) {
    return getHttpFallback(
      response.status,
      fallback
    );
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
// NORMALIZED SERVICE ERROR
// =========================================================

const createServiceError = (error, fallback) => {
  const message = getPostServiceErrorMessage(
    error,
    fallback
  );

  const serviceError = new Error(message);

  serviceError.name = "PostServiceError";

  serviceError.status =
    error?.response?.status ?? null;

  serviceError.code =
    error?.code ?? null;

  // Keep original DRF validation fields accessible
  // to the calling component if needed.
  serviceError.validationErrors =
    error?.response?.data ?? null;

  return serviceError;
};

const throwServiceError = (operation, error, fallback) => {
  console.error(
    `[PostService] ${operation}:`,
    error?.response?.data ?? error
  );

  throw createServiceError(error, fallback);
};

// =========================================================
// NORMALIZE POSTS RESPONSE
// =========================================================

const normalizePostsResponse = (data) => {
  if (Array.isArray(data)) {
    return {
      count: data.length,
      next: null,
      previous: null,
      results: data,
    };
  }

  const results = Array.isArray(data?.results)
    ? data.results
    : [];

  const count = Number(
    data?.count ?? results.length
  );

  return {
    count: Number.isFinite(count)
      ? Math.max(0, count)
      : results.length,
    next: data?.next ?? null,
    previous: data?.previous ?? null,
    results,
  };
};

// =========================================================
// NORMALIZE COMMENTS RESPONSE
// =========================================================

const normalizeCommentsResponse = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  throw new Error(
    "Server sharhlarni noto'g'ri formatda qaytardi."
  );
};

// =========================================================
// COMMENT MESSAGE VALIDATION
// =========================================================

const validateCommentMessage = (
  value,
  emptyMessage = "Sharh matnini kiriting."
) => {
  if (typeof value !== "string") {
    throw new Error(emptyMessage);
  }

  const message = value.trim();

  if (!message) {
    throw new Error(emptyMessage);
  }

  if (message.length > 255) {
    throw new Error(
      "Sharh 255 ta belgidan oshmasligi kerak."
    );
  }

  return message;
};

// =========================================================
// POST SERVICE
// =========================================================

const PostService = {
  // =====================================================
  // 1. GET USER POSTS
  // =====================================================

  async getPosts(username, page = 1, pageSize = 5) {
    if (!String(username ?? "").trim()) {
      throw new Error("Username topilmadi.");
    }

    try {
      const { data } = await axios.get(
        `/users/${encodeURIComponent(username)}/posts/`,
        {
          params: {
            page,
            page_size: pageSize,
          },
          withCredentials: true,
        }
      );

      return normalizePostsResponse(data);
    } catch (error) {
      throwServiceError(
        "getPosts",
        error,
        "Postlarni olishda xato yuz berdi."
      );
    }
  },

  // =====================================================
  // 2. CREATE POST
  // =====================================================
  //
  // Both existing call signatures remain supported:
  //
  // createPost(postData)
  // createPost(username, postData)
  // =====================================================

  async createPost(
    usernameOrPostData,
    maybePostData = null
  ) {
    const postData =
      maybePostData ?? usernameOrPostData;

    if (!postData) {
      throw new Error(
        "Post yaratish uchun ma'lumot kiriting."
      );
    }

    try {
      const { data } = await axios.post(
        "/users/post/create/",
        postData,
        {
          withCredentials: true,
        }
      );

      return data;
    } catch (error) {
      throwServiceError(
        "createPost",
        error,
        "Post yaratishda xato yuz berdi."
      );
    }
  },

  // =====================================================
  // 3. GET POST DETAIL
  // =====================================================

  async getPostDetail(username, slug) {
    if (!username || !slug) {
      throw new Error(
        "Post ma'lumotlari yetarli emas."
      );
    }

    try {
      const { data } = await axios.get(
        `/users/${encodeURIComponent(username)}/post/${encodeURIComponent(slug)}/`,
        {
          withCredentials: true,
        }
      );

      return data;
    } catch (error) {
      throwServiceError(
        "getPostDetail",
        error,
        "Post ma'lumotlarini olishda xato yuz berdi."
      );
    }
  },

  // =====================================================
  // 4. POST LIKE / UNLIKE
  // =====================================================

  async togglePostLike(postId) {
    const id = requireId(postId, "Post ID");

    try {
      const { data } = await axios.post(
        `/users/post/${id}/like_toggle/`,
        {},
        {
          withCredentials: true,
        }
      );

      const count = Number(
        data?.likes_count ??
        data?.like_count ??
        0
      );

      return {
        ...data,
        post_id: data?.post_id ?? Number(id),
        is_liked_by_user: Boolean(
          data?.is_liked_by_user ??
          data?.is_liked
        ),
        likes_count: Number.isFinite(count)
          ? Math.max(0, count)
          : 0,
      };
    } catch (error) {
      throwServiceError(
        "togglePostLike",
        error,
        "Postga Like bosishda xato yuz berdi."
      );
    }
  },

  // =====================================================
  // 5. GET POST COMMENTS
  // =====================================================
  //
  // Existing call:
  //   getPostComments(postId)
  //
  // New threaded call:
  //   getPostComments(postId, { threaded: true })
  //
  // Also supports:
  //   getPostComments(postId, true)
  //
  // Default remains flat for compatibility.
  // =====================================================

  async getPostComments(postId, options = {}) {
    const id = requireId(postId, "Post ID");

    const threaded =
      options === true ||
      (isObject(options) && options.threaded === true);

    const signal =
      isObject(options) ? options.signal : undefined;

    try {
      const { data } = await axios.get(
        `/users/post/${id}/comments/`,
        {
          ...(threaded
            ? { params: { threaded: 1 } }
            : {}),
          ...(signal ? { signal } : {}),
          withCredentials: true,
        }
      );

      return normalizeCommentsResponse(data);
    } catch (error) {
      throwServiceError(
        "getPostComments",
        error,
        "Sharhlarni yuklashda xato yuz berdi."
      );
    }
  },

  // =====================================================
  // 6. CREATE POST COMMENT / REPLY
  // =====================================================
  //
  // Root comment:
  //
  // createPostComment(postId, {
  //   message: "Salom",
  // })
  //
  // Reply:
  //
  // createPostComment(postId, {
  //   message: "Javob",
  //   parent: 101,
  // })
  //
  // Legacy string input is also supported:
  //
  // createPostComment(postId, "Salom")
  // =====================================================

  async createPostComment(postId, commentData) {
    const id = requireId(postId, "Post ID");

    const input =
      typeof commentData === "string"
        ? { message: commentData }
        : commentData;

    if (!isObject(input)) {
      throw new Error(
        "Sharh ma'lumotlari noto'g'ri."
      );
    }

    const message = validateCommentMessage(
      input.message
    );

    const body = {
      message,
    };

    // Backend expects "parent", not "parent_id".
    // Accept both on frontend for compatibility.

    const parent =
      input.parent !== undefined
        ? input.parent
        : input.parent_id;

    if (parent !== null && parent !== undefined) {
      body.parent = Number(
        requireId(parent, "Parent comment ID")
      );
    }

    try {
      const { data } = await axios.post(
        `/users/post/${id}/comments/`,
        body,
        {
          withCredentials: true,
        }
      );

      return data;
    } catch (error) {
      throwServiceError(
        "createPostComment",
        error,
        "Sharh yoki javobni yuborishda xato yuz berdi."
      );
    }
  },

  // =====================================================
  // 7. UPDATE POST COMMENT / REPLY
  // =====================================================
  //
  // Only message is sent.
  //
  // Do not send:
  // - parent
  // - user
  // - post
  // - is_deleted
  //
  // The backend rejects relationship changes.
  // =====================================================

  async updatePostComment(commentId, commentData) {
    const id = requireId(commentId, "Comment ID");

    const input =
      typeof commentData === "string"
        ? { message: commentData }
        : commentData;

    const message = validateCommentMessage(
      input?.message,
      "Sharh matni bo'sh bo'lishi mumkin emas."
    );

    try {
      const { data } = await axios.patch(
        `/users/post/comment/${id}/edit/`,
        {
          message,
        },
        {
          withCredentials: true,
        }
      );

      return data;
    } catch (error) {
      throwServiceError(
        "updatePostComment",
        error,
        "Sharhni tahrirlashda xato yuz berdi."
      );
    }
  },

  // =====================================================
  // 8. DELETE POST COMMENT / REPLY
  // =====================================================
  //
  // Backend performs a soft-delete.
  // Comment row and replies are preserved.
  // =====================================================

  async deletePostComment(commentId) {
    const id = requireId(commentId, "Comment ID");

    try {
      const response = await axios.delete(
        `/users/post/comment/${id}/edit/`,
        {
          withCredentials: true,
        }
      );

      return response?.data ?? {
        detail: "Sharh o'chirildi.",
        comment_id: Number(id),
        is_deleted: true,
      };
    } catch (error) {
      throwServiceError(
        "deletePostComment",
        error,
        "Sharhni o'chirishda xato yuz berdi."
      );
    }
  },

  // =====================================================
  // 9. COMMENT LIKE / UNLIKE
  // =====================================================
  //
  // Works for root comments and nested replies.
  // =====================================================

  async togglePostCommentLike(commentId) {
    const id = requireId(commentId, "Comment ID");

    try {
      const { data } = await axios.post(
        `/users/post/comment/${id}/like_toggle/`,
        {},
        {
          withCredentials: true,
        }
      );

      const count = Number(
        data?.likes_count ??
        data?.like_count ??
        0
      );

      return {
        ...data,
        comment_id:
          data?.comment_id ?? Number(id),
        is_liked_by_user: Boolean(
          data?.is_liked_by_user ??
          data?.is_liked
        ),
        likes_count: Number.isFinite(count)
          ? Math.max(0, count)
          : 0,
      };
    } catch (error) {
      throwServiceError(
        "togglePostCommentLike",
        error,
        "Sharhga Like bosishda xato yuz berdi."
      );
    }
  },

  // =====================================================
  // 10. UPDATE POST
  // =====================================================

  async updatePost(username, slug, postData) {
    if (!username || !slug) {
      throw new Error(
        "Post ma'lumotlari yetarli emas."
      );
    }

    try {
      const { data } = await axios.patch(
        `/users/${encodeURIComponent(username)}/post/${encodeURIComponent(slug)}/`,
        postData,
        {
          withCredentials: true,
        }
      );

      return data;
    } catch (error) {
      throwServiceError(
        "updatePost",
        error,
        "Postni tahrirlashda xato yuz berdi."
      );
    }
  },

  // =====================================================
  // 11. DELETE POST
  // =====================================================

  async deletePost(username, slug) {
    if (!username || !slug) {
      throw new Error(
        "Post ma'lumotlari yetarli emas."
      );
    }

    try {
      const response = await axios.delete(
        `/users/${encodeURIComponent(username)}/post/${encodeURIComponent(slug)}/`,
        {
          withCredentials: true,
        }
      );

      return response?.data ?? true;
    } catch (error) {
      throwServiceError(
        "deletePost",
        error,
        "Postni o'chirishda xato yuz berdi."
      );
    }
  },
};

export default PostService;
