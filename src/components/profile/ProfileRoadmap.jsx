
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { Loader2 } from "lucide-react";

// =========================================================
// REDUX
// =========================================================

import {
  getRoadMapStart,
  getRoadMapSuccess,
  getRoadMapFailure,

  deleteRoadMapStart,
  deleteRoadMapSuccess,
  deleteRoadMapFailure,

  toggleLikeRoadmapStart,
  toggleLikeRoadmapSuccess,
  toggleLikeRoadmapFailure,

  updateRoadmapLocal,
} from "../../features/roadmap";

// =========================================================
// SERVICES
// =========================================================

import RoadmapService from "../../services/roadmap";

// =========================================================
// SHARED COMPONENTS
// =========================================================

import DeleteConfirmationModal from "../DeleteConfirmationModal";

import { siteToast } from "../ui/AuthToast";

// =========================================================
// ROADMAP COMPONENTS
// =========================================================

import ProfileRoadmapHeader from "./roadmap/ProfileRoadmapHeader";

import ProfileRoadmapSkeleton from "./roadmap/ProfileRoadmapSkeleton";

import ProfileRoadmapEmpty from "./roadmap/ProfileRoadmapEmpty";

import ProfileRoadmapError from "./roadmap/ProfileRoadmapError";

import ProfileRoadmapTimeline from "./roadmap/ProfileRoadmapTimeline";

import RoadmapCreateModal from "./roadmap/RoadmapCreateModal";

// =========================================================
// CONSTANTS
// =========================================================

const EMPTY_ROADMAPS = [];

// =========================================================
// SELECTORS
// =========================================================

const selectRoadmapState = (state) => state.roadmap;

const selectAuthUsername = (state) =>
  state.auth?.user?.username;

// =========================================================
// ERROR FIELD LABELS
// =========================================================

const FIELD_LABELS = {
  title: "Sarlavha",
  type: "Roadmap turi",
  description: "Tavsif",
  started_at: "Boshlanish sanasi",
  finished_at: "Tugash sanasi",
  non_field_errors: "Xatolik",
};

// =========================================================
// PARSE API ERRORS
// =========================================================

const parseErrorValue = (value, depth = 0) => {
  if (value == null || depth > 6) {
    return "";
  }

  // -------------------------------------------------------
  // STRING
  // -------------------------------------------------------

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) {
      return "";
    }

    const looksLikeJSON =
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"));

    if (looksLikeJSON) {
      try {
        return parseErrorValue(
          JSON.parse(trimmed),
          depth + 1
        );
      } catch {
        return trimmed;
      }
    }

    return trimmed;
  }

  // -------------------------------------------------------
  // ARRAY
  // -------------------------------------------------------

  if (Array.isArray(value)) {
    return value
      .map((item) =>
        parseErrorValue(item, depth + 1)
      )
      .filter(Boolean)
      .join("; ");
  }

  // -------------------------------------------------------
  // OBJECT
  // -------------------------------------------------------

  if (typeof value === "object") {
    for (const key of [
      "detail",
      "message",
      "error",
      "non_field_errors",
    ]) {
      if (!value[key]) {
        continue;
      }

      const message = parseErrorValue(
        value[key],
        depth + 1
      );

      if (message) {
        return message;
      }
    }

    return Object.entries(value)
      .filter(
        ([key]) =>
          ![
            "stack",
            "config",
            "request",
            "response",
          ].includes(key)
      )
      .map(([key, messages]) => {
        const message = parseErrorValue(
          messages,
          depth + 1
        );

        if (!message) {
          return "";
        }

        return `${
          FIELD_LABELS[key] || key
        }: ${message}`;
      })
      .filter(Boolean)
      .join("; ");
  }

  return "";
};

// =========================================================
// GET ERROR MESSAGE
// =========================================================

const getErrorMessage = (
  error,
  fallback = "Kutilmagan xatolik yuz berdi."
) => {
  return (
    parseErrorValue(
      error?.serverData ??
      error?.response?.data
    ) ||
    parseErrorValue(
      error?.message ?? error
    ) ||
    fallback
  );
};

// =========================================================
// NORMALIZE ROADMAP RESPONSE
// =========================================================

const normalizeRoadmaps = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.results)) {
    return response.results;
  }

  return [];
};

// =========================================================
// SORT ROADMAPS
// =========================================================

const sortRoadmaps = (items = []) => {
  return [...items].sort((first, second) =>
    String(second?.started_at || "").localeCompare(
      String(first?.started_at || "")
    )
  );
};

// =========================================================
// ID HELPERS
// =========================================================

const isValidId = (id) => {
  return (
    id !== null &&
    id !== undefined &&
    id !== ""
  );
};

const sameId = (first, second) =>
  String(first) === String(second);

// =========================================================
// PROFILE ROADMAP
// =========================================================
//
// Responsibilities:
// - Load roadmap list
// - Create roadmap
// - Edit roadmap
// - Delete roadmap
// - Like / Unlike roadmap
// - Universal toast notifications
// - Redux synchronization
// - Optimistic updates
// - API error handling
// - Stale response protection
// - Modal states
// - Loading / Empty / Error states
//
// =========================================================

const ProfileRoadmap = ({ username }) => {
  // =======================================================
  // REDUX
  // =======================================================

  const dispatch = useDispatch();

  const {
    roadmaps,
    roadmap_isLoading,
    roadmap_error,

    isDeleting,
    deleteError,

    isLiking,
    likingRoadmapId,
    likeError,
  } = useSelector(selectRoadmapState);

  // =======================================================
  // AUTH
  // =======================================================

  const currentAuthUsername = useSelector(
    selectAuthUsername
  );

  // =======================================================
  // OWNER PERMISSION
  // =======================================================

  const isOwner = Boolean(
    username &&
      currentAuthUsername &&
      String(username).toLowerCase() ===
        String(currentAuthUsername).toLowerCase()
  );

  // =======================================================
  // CREATE / EDIT MODAL STATE
  // =======================================================

  const [
    isFormModalOpen,
    setIsFormModalOpen,
  ] = useState(false);

  const [
    editingRoadmap,
    setEditingRoadmap,
  ] = useState(null);

  const [
    isFormSubmitting,
    setIsFormSubmitting,
  ] = useState(false);

  // =======================================================
  // DELETE MODAL STATE
  // =======================================================

  const [
    isDeleteModalOpen,
    setIsDeleteModalOpen,
  ] = useState(false);

  const [
    deletingRoadmap,
    setDeletingRoadmap,
  ] = useState(null);

  // =======================================================
  // REQUEST REFS
  // =======================================================

  const mountedRef = useRef(false);

  const currentUsernameRef = useRef(username);

  const fetchSequenceRef = useRef(0);

  const loadedUsernameRef = useRef(null);

  const submittingRef = useRef(false);

  const deletingRef = useRef(false);

  const likingRef = useRef(false);

  currentUsernameRef.current = username;

  // =======================================================
  // MOUNT / UNMOUNT
  // =======================================================

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      // Invalidate pending GET responses.
      fetchSequenceRef.current += 1;
    };
  }, []);

  // =======================================================
  // SAFE ROADMAPS
  // =======================================================

  const isCurrentProfileLoaded =
    loadedUsernameRef.current === username;

  const safeRoadmaps = useMemo(() => {
    if (
      !isCurrentProfileLoaded ||
      !Array.isArray(roadmaps)
    ) {
      return EMPTY_ROADMAPS;
    }

    return roadmaps;
  }, [
    isCurrentProfileLoaded,
    roadmaps,
  ]);

  // =======================================================
  // GET ROADMAPS
  // =======================================================

  const getRoadmap = useCallback(
    async ({ silent = false } = {}) => {
      if (!username) {
        return [];
      }

      const sequence = ++fetchSequenceRef.current;

      // ---------------------------------------------------
      // START LOADING
      // ---------------------------------------------------

      if (!silent) {
        dispatch(getRoadMapStart());
      }

      try {
        // -------------------------------------------------
        // API
        // -------------------------------------------------

        const response =
          await RoadmapService.getRoadmap(username);

        const nextRoadmaps =
          normalizeRoadmaps(response);

        // -------------------------------------------------
        // STALE RESPONSE PROTECTION
        // -------------------------------------------------

        if (
          !mountedRef.current ||
          sequence !== fetchSequenceRef.current ||
          currentUsernameRef.current !== username
        ) {
          return [];
        }

        loadedUsernameRef.current = username;

        // -------------------------------------------------
        // REDUX SUCCESS
        // -------------------------------------------------

        dispatch(
          getRoadMapSuccess(nextRoadmaps)
        );

        return nextRoadmaps;
      } catch (requestError) {
        if (
          !mountedRef.current ||
          sequence !== fetchSequenceRef.current ||
          currentUsernameRef.current !== username
        ) {
          return [];
        }

        console.error(
          "Roadmap olishda xato:",
          requestError
        );

        if (!silent) {
          loadedUsernameRef.current = username;

          dispatch(
            getRoadMapFailure(
              getErrorMessage(
                requestError,
                "Roadmaplarni olishda xato yuz berdi."
              )
            )
          );
        }

        throw requestError;
      }
    },
    [
      dispatch,
      username,
    ]
  );

  // =======================================================
  // INITIAL LOAD / USERNAME CHANGE
  // =======================================================

  useEffect(() => {
    setIsFormModalOpen(false);
    setEditingRoadmap(null);

    setIsDeleteModalOpen(false);
    setDeletingRoadmap(null);

    // ---------------------------------------------------
    // EMPTY USERNAME
    // ---------------------------------------------------

    if (!username) {
      loadedUsernameRef.current = username;

      dispatch(
        getRoadMapSuccess([])
      );

      return undefined;
    }

    // ---------------------------------------------------
    // FETCH CURRENT PROFILE
    // ---------------------------------------------------

    getRoadmap().catch(() => {
      // Error is already stored in Redux.
    });

    // ---------------------------------------------------
    // CLEANUP
    // ---------------------------------------------------

    return () => {
      fetchSequenceRef.current += 1;
    };
  }, [
    dispatch,
    getRoadmap,
    username,
  ]);

  // =======================================================
  // OPEN CREATE MODAL
  // =======================================================

  const handleCreateClick = () => {
    if (!isOwner) {
      siteToast.warning(
        "Faqat o‘z profilingizga roadmap qo‘sha olasiz.",
        {
          title: "Ruxsat yo‘q",
          duration: 3500,
        }
      );

      return;
    }

    if (
      submittingRef.current ||
      deletingRef.current
    ) {
      return;
    }

    setEditingRoadmap(null);
    setIsFormModalOpen(true);
  };

  // =======================================================
  // OPEN EDIT MODAL
  // =======================================================

  const handleEditClick = (roadmap) => {
    if (!isOwner) {
      siteToast.warning(
        "Bu roadmapni tahrirlash huquqingiz yo‘q.",
        {
          title: "Ruxsat yo‘q",
          duration: 3500,
        }
      );

      return;
    }

    if (
      !isValidId(roadmap?.id) ||
      submittingRef.current ||
      deletingRef.current
    ) {
      return;
    }

    setEditingRoadmap(roadmap);
    setIsFormModalOpen(true);
  };

  // =======================================================
  // CLOSE CREATE / EDIT MODAL
  // =======================================================

  const handleCloseFormModal = () => {
    // RoadmapCreateModal handles disabling
    // manual closing while submitting.

    setIsFormModalOpen(false);
    setEditingRoadmap(null);
  };

  // =======================================================
  // CREATE / UPDATE ROADMAP
  // =======================================================

  const handleRoadmapSubmit = async (payload) => {
    // ---------------------------------------------------
    // USERNAME
    // ---------------------------------------------------

    if (!username) {
      throw new Error(
        "Profil username topilmadi."
      );
    }

    // ---------------------------------------------------
    // OWNER PERMISSION
    // ---------------------------------------------------

    if (!isOwner) {
      throw new Error(
        "Faqat o‘z profilingizdagi roadmapni boshqarishingiz mumkin."
      );
    }

    // ---------------------------------------------------
    // DUPLICATE REQUEST
    // ---------------------------------------------------

    if (submittingRef.current) {
      return false;
    }

    submittingRef.current = true;
    setIsFormSubmitting(true);

    const submittedUsername = username;
    const editingId = editingRoadmap?.id;

    try {
      // =================================================
      // UPDATE ROADMAP
      // =================================================

      if (isValidId(editingId)) {
        const response =
          await RoadmapService.updateRoadmap(
            submittedUsername,
            editingId,
            payload
          );

        const updatedRoadmap =
          response?.roadmap || response;

        // -----------------------------------------------
        // UPDATE CURRENT PROFILE ONLY
        // -----------------------------------------------

        if (
          mountedRef.current &&
          currentUsernameRef.current ===
            submittedUsername
        ) {
          if (
            isValidId(updatedRoadmap?.id)
          ) {
            const nextRoadmaps = safeRoadmaps.map(
              (item) => {
                if (!sameId(item?.id, editingId)) {
                  return item;
                }

                return {
                  ...item,
                  ...updatedRoadmap,
                };
              }
            );

            dispatch(
              getRoadMapSuccess(
                sortRoadmaps(nextRoadmaps)
              )
            );
          } else {
            // Unexpected response structure.
            // Fetch fresh data from the server.

            await getRoadmap({
              silent: true,
            });
          }
        }

        return updatedRoadmap;
      }

      // =================================================
      // CREATE ROADMAP
      // =================================================

      const response =
        await RoadmapService.createRoadmap(
          submittedUsername,
          payload
        );

      const createdRoadmap =
        response?.roadmap || response;

      // -------------------------------------------------
      // UPDATE CURRENT PROFILE ONLY
      // -------------------------------------------------

      if (
        mountedRef.current &&
        currentUsernameRef.current ===
          submittedUsername
      ) {
        if (
          isValidId(createdRoadmap?.id)
        ) {
          const withoutDuplicate =
            safeRoadmaps.filter(
              (item) =>
                !sameId(
                  item?.id,
                  createdRoadmap.id
                )
            );

          dispatch(
            getRoadMapSuccess(
              sortRoadmaps([
                createdRoadmap,
                ...withoutDuplicate,
              ])
            )
          );
        } else {
          await getRoadmap({
            silent: true,
          });
        }
      }

      return createdRoadmap;
    } catch (requestError) {
      console.error(
        isValidId(editingId)
          ? "Roadmap update xato:"
          : "Roadmap create xato:",
        requestError
      );

      // RoadmapCreateModal displays
      // the universal siteToast.
      // Rethrow to preserve existing behavior.

      throw requestError;
    } finally {
      submittingRef.current = false;

      if (mountedRef.current) {
        setIsFormSubmitting(false);
      }
    }
  };

  // =======================================================
  // OPEN DELETE MODAL
  // =======================================================

  const handleDeleteClick = (roadmap) => {
    if (!isOwner) {
      siteToast.warning(
        "Bu roadmapni o‘chirish huquqingiz yo‘q.",
        {
          title: "Ruxsat yo‘q",
          duration: 3500,
        }
      );

      return;
    }

    if (
      !isValidId(roadmap?.id) ||
      deletingRef.current ||
      submittingRef.current
    ) {
      return;
    }

    setDeletingRoadmap(roadmap);
    setIsDeleteModalOpen(true);
  };

  // =======================================================
  // CLOSE DELETE MODAL
  // =======================================================

  const handleCloseDeleteModal = () => {
    if (
      deletingRef.current ||
      isDeleting
    ) {
      return;
    }

    setIsDeleteModalOpen(false);
    setDeletingRoadmap(null);
  };

  // =======================================================
  // CONFIRM DELETE
  // =======================================================

  const handleConfirmDelete = async () => {
    if (
      !isOwner ||
      !isValidId(deletingRoadmap?.id) ||
      deletingRef.current ||
      isDeleting
    ) {
      return false;
    }

    deletingRef.current = true;

    const deletedId = deletingRoadmap.id;

    const deletedTitle =
      deletingRoadmap.title || "Roadmap";

    const submittedUsername = username;

    // ---------------------------------------------------
    // REDUX START
    // ---------------------------------------------------

    dispatch(
      deleteRoadMapStart()
    );

    // ---------------------------------------------------
    // UNIVERSAL LOADING TOAST
    // ---------------------------------------------------

    const toastId = siteToast.loading(
      `"${deletedTitle}" roadmap o‘chirilmoqda...`,
      {
        title: "Roadmap o‘chirilmoqda",
      }
    );

    try {
      // -------------------------------------------------
      // API DELETE
      // -------------------------------------------------

      await RoadmapService.deleteRoadmap(
        submittedUsername,
        deletedId
      );

      // -------------------------------------------------
      // REDUX SUCCESS
      // -------------------------------------------------

      if (
        mountedRef.current &&
        currentUsernameRef.current ===
          submittedUsername
      ) {
        dispatch(
          deleteRoadMapSuccess(
            deletedId
          )
        );

        setIsDeleteModalOpen(false);
        setDeletingRoadmap(null);
      }

      // -------------------------------------------------
      // SUCCESS TOAST
      // -------------------------------------------------

      siteToast.success(
        "Roadmap muvaffaqiyatli o‘chirildi.",
        {
          id: toastId,
          title: "Roadmap o‘chirildi",
          duration: 3200,
        }
      );

      return true;
    } catch (requestError) {
      console.error(
        "Roadmap o‘chirishda xato:",
        requestError
      );

      const message = getErrorMessage(
        requestError,
        "Roadmapni o‘chirishda xato yuz berdi."
      );

      // -------------------------------------------------
      // REDUX ERROR
      // -------------------------------------------------

      if (
        mountedRef.current &&
        currentUsernameRef.current ===
          submittedUsername
      ) {
        dispatch(
          deleteRoadMapFailure(
            message
          )
        );
      }

      // -------------------------------------------------
      // ERROR TOAST
      // -------------------------------------------------

      siteToast.error(
        message,
        {
          id: toastId,
          title: "Roadmap o‘chirilmadi",
          duration: 5000,
        }
      );

      return false;
    } finally {
      deletingRef.current = false;
    }
  };

  // =======================================================
  // LIKE / UNLIKE ROADMAP
  // =======================================================
  //
  // Features:
  // - Authentication
  // - Duplicate request protection
  // - Optimistic Redux update
  // - API response synchronization
  // - Rollback on failure
  // - Stale profile protection
  // - Universal success / error toast
  //
  // =======================================================

  const handleToggleLike = async (roadmap) => {
    // ---------------------------------------------------
    // VALID ROADMAP
    // ---------------------------------------------------

    if (!isValidId(roadmap?.id)) {
      return false;
    }

    // ---------------------------------------------------
    // AUTHENTICATION
    // ---------------------------------------------------

    if (!currentAuthUsername) {
      siteToast.warning(
        "Roadmapni yoqtirish uchun avval tizimga kiring.",
        {
          title: "Kirish talab qilinadi",
          duration: 3500,
        }
      );

      return false;
    }

    // ---------------------------------------------------
    // BUSY STATE
    // ---------------------------------------------------

    if (
      likingRef.current ||
      isLiking ||
      deletingRef.current ||
      isDeleting ||
      roadmap_isLoading
    ) {
      return false;
    }

    const roadmapId = roadmap.id;

    const submittedUsername = username;

    // Synchronous lock prevents double clicks
    // before React updates the loading state.
    likingRef.current = true;

    // ---------------------------------------------------
    // PREVIOUS VALUES
    // ---------------------------------------------------

    const oldIsLiked = Boolean(
      roadmap.is_liked
    );

    const oldLikeCountRaw = Number(
      roadmap.like_count ?? 0
    );

    const oldLikeCount = Number.isFinite(
      oldLikeCountRaw
    )
      ? Math.max(0, oldLikeCountRaw)
      : 0;

    // ---------------------------------------------------
    // OPTIMISTIC VALUES
    // ---------------------------------------------------

    const nextIsLiked = !oldIsLiked;

    const nextLikeCount = Math.max(
      0,
      oldLikeCount + (
        nextIsLiked ? 1 : -1
      )
    );

    // ---------------------------------------------------
    // REDUX START
    // ---------------------------------------------------

    dispatch(
      toggleLikeRoadmapStart(
        roadmapId
      )
    );

    // ---------------------------------------------------
    // OPTIMISTIC UI
    // ---------------------------------------------------

    dispatch(
      updateRoadmapLocal({
        id: roadmapId,
        changes: {
          is_liked: nextIsLiked,
          like_count: nextLikeCount,
        },
      })
    );

    try {
      // =================================================
      // API REQUEST
      // =================================================

      const response =
        await RoadmapService.toggleLikeRoadmap(
          roadmapId
        );

      // =================================================
      // STALE PROFILE PROTECTION
      // =================================================

      if (
        !mountedRef.current ||
        currentUsernameRef.current !==
          submittedUsername
      ) {
        return false;
      }

      // =================================================
      // SERVER VALUES
      // =================================================

      const serverIsLiked =
        typeof response?.is_liked === "boolean"
          ? response.is_liked
          : nextIsLiked;

      const returnedCount = Number(
        response?.like_count ??
          nextLikeCount
      );

      const serverLikeCount =
        Number.isFinite(returnedCount)
          ? Math.max(0, returnedCount)
          : nextLikeCount;

      // =================================================
      // REDUX SUCCESS
      // =================================================

      dispatch(
        toggleLikeRoadmapSuccess({
          ...response,

          id:
            response?.id ??
            roadmapId,

          is_liked:
            serverIsLiked,

          like_count:
            serverLikeCount,
        })
      );

      // =================================================
      // UNIVERSAL SUCCESS TOAST
      // =================================================
      //
      // Like bosilganda:
      //   Like qo‘yildi
      //
      // Like olib tashlanganda:
      //   Like olib tashlandi
      //
      // Only show success after the API confirms.
      // =================================================

      siteToast.success(
        serverIsLiked
          ? "Roadmapga Like muvaffaqiyatli qo‘yildi."
          : "Roadmapdan Like olib tashlandi.",
        {
          title: serverIsLiked
            ? "Like qo‘yildi"
            : "Like olib tashlandi",

          duration: 2800,
        }
      );

      return true;
    } catch (requestError) {
      console.error(
        "Roadmap Like/Unlike xatosi:",
        requestError
      );

      const message = getErrorMessage(
        requestError,
        "Roadmap Like holatini o‘zgartirishda xato yuz berdi."
      );

      // =================================================
      // IGNORE STALE PROFILE ERRORS
      // =================================================

      if (
        !mountedRef.current ||
        currentUsernameRef.current !==
          submittedUsername
      ) {
        return false;
      }

      // =================================================
      // OPTIMISTIC ROLLBACK
      // =================================================

      dispatch(
        updateRoadmapLocal({
          id: roadmapId,
          changes: {
            is_liked: oldIsLiked,
            like_count: oldLikeCount,
          },
        })
      );

      // =================================================
      // REDUX FAILURE
      // =================================================

      dispatch(
        toggleLikeRoadmapFailure(
          message
        )
      );

      // =================================================
      // UNIVERSAL ERROR TOAST
      // =================================================

      siteToast.error(
        message,
        {
          title: "Like amalga oshmadi",
          duration: 4500,
        }
      );

      return false;
    } finally {
      // Always release the lock.
      likingRef.current = false;
    }
  };

  // =======================================================
  // RETRY ROADMAP FETCH
  // =======================================================

  const handleRetry = () => {
    getRoadmap().catch(() => {
      // Redux error state handles feedback.
    });
  };

  // =======================================================
  // DISPLAY STATE
  // =======================================================

  const showSkeleton =
    !isCurrentProfileLoaded ||
    (
      roadmap_isLoading &&
      safeRoadmaps.length === 0
    );

  const showFullError = Boolean(
    !showSkeleton &&
    roadmap_error &&
    safeRoadmaps.length === 0
  );

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div
      id="roadmap"
      className="min-w-0 space-y-5"
    >
      {/* ==============================================
          CONTENT STATES
      ============================================== */}

      {showSkeleton ? (
        // ----------------------------------------------
        // LOADING SKELETON
        // ----------------------------------------------

        <ProfileRoadmapSkeleton
          isOwner={isOwner}
        />
      ) : showFullError ? (
        // ----------------------------------------------
        // FULL FETCH ERROR
        // ----------------------------------------------

        <ProfileRoadmapError
          variant="fetch"
          error={roadmap_error}
          onRetry={handleRetry}
          isLoading={roadmap_isLoading}
        />
      ) : (
        <>
          {/* =========================================
              HEADER
          ========================================= */}

          <ProfileRoadmapHeader
            roadmaps={safeRoadmaps}
            isOwner={isOwner}
            isLoading={roadmap_isLoading}
            onRefresh={handleRetry}
            onCreate={handleCreateClick}
          />

          {/* =========================================
              FETCH ERROR WITH EXISTING DATA
          ========================================= */}

          {roadmap_error &&
            safeRoadmaps.length > 0 && (
              <ProfileRoadmapError
                variant="action"
                error={roadmap_error}
              />
            )}

          {/* =========================================
              DELETE ERROR
          ========================================= */}

          {deleteError && (
            <ProfileRoadmapError
              variant="action"
              error={deleteError}
            />
          )}

          {/* =========================================
              LIKE ERROR
          ========================================= */}

          {likeError && (
            <ProfileRoadmapError
              variant="action"
              error={likeError}
            />
          )}

          {/* =========================================
              EMPTY STATE / TIMELINE
          ========================================= */}

          {safeRoadmaps.length === 0 ? (
            <ProfileRoadmapEmpty
              isOwner={isOwner}
              onCreate={handleCreateClick}
            />
          ) : (
            <ProfileRoadmapTimeline
              roadmaps={safeRoadmaps}
              isOwner={isOwner}

              isLiking={isLiking}
              likingRoadmapId={
                likingRoadmapId
              }

              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onToggleLike={handleToggleLike}
            />
          )}
        </>
      )}

      {/* ==============================================
          CREATE / EDIT MODAL
      ============================================== */}

      <RoadmapCreateModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSubmit={handleRoadmapSubmit}
        initialData={editingRoadmap}
        isSubmitting={isFormSubmitting}
      />

      {/* ==============================================
          DELETE CONFIRMATION MODAL
      ============================================== */}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        itemTitle={
          deletingRoadmap?.title || ""
        }
        isProcessing={isDeleting}
      />

      {/* ==============================================
          DELETE PROCESS OVERLAY
      ============================================== */}

      {isDeleting && (
        <div
          role="status"
          aria-live="polite"
          className="
            fixed inset-0 z-[90]
            flex items-center justify-center
            bg-black/65 p-4 backdrop-blur-sm
          "
        >
          <div
            className="
              relative w-full max-w-sm
              overflow-hidden rounded-2xl
              border border-slate-200
              bg-white px-6 py-5
              shadow-2xl

              dark:border-white/[0.08]
              dark:bg-[#0c1119]/95
            "
          >
            {/* BACKGROUND GLOW */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute -right-10 -top-10
                h-24 w-24 rounded-full
                bg-indigo-500/10 blur-[35px]
              "
            />

            {/* CONTENT */}
            <div
              className="
                relative z-10
                flex items-center gap-3
              "
            >
              {/* LOADING ICON */}
              <span
                className="
                  flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-xl border
                  border-indigo-200 bg-indigo-50
                  text-indigo-700

                  dark:border-indigo-400/15
                  dark:bg-indigo-500/[0.07]
                  dark:text-indigo-300
                "
              >
                <Loader2
                  size={19}
                  aria-hidden="true"
                  className="
                    animate-spin
                    motion-reduce:animate-none
                  "
                />
              </span>

              {/* TEXT */}
              <div className="min-w-0">
                <p
                  className="
                    text-sm font-black
                    text-slate-900
                    dark:text-white
                  "
                >
                  Roadmap o‘chirilmoqda
                </p>

                <p
                  className="
                    mt-0.5 truncate
                    text-[11px] font-medium
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  {deletingRoadmap?.title ||
                    "Iltimos kuting..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileRoadmap;
