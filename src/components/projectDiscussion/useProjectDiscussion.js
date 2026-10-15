
import {
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

// =========================================================
// EXISTING REDUX ACTIONS
// =========================================================

import {
    getProjectCommentFailure,
    getProjectCommentStart,
    getProjectCommentSuccess,
} from "../../features/projects";

// =========================================================
// EXISTING PROJECT API
// =========================================================

import ProjectService from "../../services/project";

// =========================================================
// TOAST
// =========================================================

import {
    siteToast,
} from "../ui/AuthToast";

// =========================================================
// DISCUSSION HELPERS
// =========================================================

import {
    EMPTY_COMMENTS,
    getDiscussionErrorMessage,
    isCommentAuthor,
    normalizeProjectComments,
} from "./discussionHelpers";

// =========================================================
// SELECTORS
// =========================================================

const selectAuthState = (state) =>
    state.auth || {};

// =========================================================
// INITIAL FEED
// =========================================================

const INITIAL_FEED = {
    projectKey: null,
    comments: EMPTY_COMMENTS,
    status: "idle",
    error: null,
};

// =========================================================
// FSOCIETY — PROJECT DISCUSSION CONTROLLER
//
// Responsibilities:
//
// - Authentication
// - Load project comments
// - Redux state updates
// - Create comments
// - Edit comments
// - Delete comments
// - Edit / delete modal state
// - Validation errors
// - Toast notifications
// - Prevent duplicate mutations
// - Ignore outdated project responses
// - Keep comments scoped to the current project
//
// UI components use returned props and callbacks.
//
// API contracts are preserved.
// =========================================================

const useProjectDiscussion = ({
    projectId,
} = {}) => {
    // =====================================================
    // REDUX
    // =====================================================

    const dispatch = useDispatch();

    // =====================================================
    // AUTH
    // =====================================================

    const {
        isLoggedIn = false,
        user = null,
    } = useSelector(selectAuthState);

    // =====================================================
    // PROJECT KEY
    // =====================================================

    const projectKey =
        projectId == null
            ? ""
            : String(projectId).trim();

    // =====================================================
    // PROJECT COMMENTS STATE
    //
    // Redux receives the same successful results.
    //
    // Local state additionally associates the comments
    // with their originating project ID.
    //
    // This prevents comments from a previous route
    // appearing on a different project's detail page.
    // =====================================================

    const [feed, setFeed] = useState(
        INITIAL_FEED
    );

    // =====================================================
    // CREATE STATE
    // =====================================================

    const [
        newCommentText,
        setNewCommentText,
    ] = useState("");

    const [
        isSubmitting,
        setIsSubmitting,
    ] = useState(false);

    const [
        submitError,
        setSubmitError,
    ] = useState("");

    // =====================================================
    // EDIT STATE
    // =====================================================

    const [
        isEditModalOpen,
        setIsEditModalOpen,
    ] = useState(false);

    const [
        editingComment,
        setEditingComment,
    ] = useState(null);

    const [
        editCommentText,
        setEditCommentText,
    ] = useState("");

    const [
        isUpdating,
        setIsUpdating,
    ] = useState(false);

    const [
        updateError,
        setUpdateError,
    ] = useState("");

    // =====================================================
    // DELETE STATE
    // =====================================================

    const [
        isDeleteModalOpen,
        setIsDeleteModalOpen,
    ] = useState(false);

    const [
        commentToDelete,
        setCommentToDelete,
    ] = useState(null);

    const [
        isDeleting,
        setIsDeleting,
    ] = useState(false);

    // =====================================================
    // REQUEST / MUTATION REFS
    // =====================================================

    const mountedRef = useRef(false);

    const activeProjectKeyRef = useRef(
        projectKey
    );

    const requestVersionRef = useRef(0);

    const createBusyRef = useRef(false);

    const updateBusyRef = useRef(false);

    const deleteBusyRef = useRef(false);

    // Keep the current route accessible to
    // asynchronous callbacks.
    activeProjectKeyRef.current = projectKey;

    // =====================================================
    // MOUNT LIFECYCLE
    // =====================================================

    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;

            requestVersionRef.current += 1;
        };
    }, []);

    // =====================================================
    // CURRENT PROJECT CHECK
    // =====================================================

    const isCurrentProject = useCallback(
        (targetKey) => {
            return (
                mountedRef.current &&
                activeProjectKeyRef.current === targetKey
            );
        },
        []
    );

    // =====================================================
    // ACTIVE FEED
    //
    // Do not expose stale comments from another project.
    // =====================================================

    const activeFeed = useMemo(() => {
        if (!projectKey) {
            return {
                ...INITIAL_FEED,
                error: "Loyiha ID ko‘rsatilmagan.",
                status: "error",
            };
        }

        if (
            feed.projectKey !== projectKey
        ) {
            return {
                projectKey,
                comments: EMPTY_COMMENTS,
                status: "loading",
                error: null,
            };
        }

        return feed;
    }, [
        feed,
        projectKey,
    ]);

    // =====================================================
    // COMMENTS
    // =====================================================

    const comments = activeFeed.comments;

    // =====================================================
    // LOAD STATE
    // =====================================================

    const isLoading =
        activeFeed.status === "loading" ||
        activeFeed.status === "idle";

    const error = activeFeed.error;

    // =====================================================
    // LOAD COMMENTS
    //
    // showLoading:
    //   true  -> show loading state
    //   false -> refresh without hiding existing list
    //
    // notifyOnError:
    //   show a toast when background refresh fails
    //
    // Returns:
    //   true  -> refreshed successfully
    //   false -> failed / obsolete request
    // =====================================================

    const loadComments = useCallback(
        async ({
            showLoading = true,
            notifyOnError = false,
        } = {}) => {
            if (!projectKey) {
                return false;
            }

            const targetKey = projectKey;

            const requestVersion =
                ++requestVersionRef.current;

            // ========================================
            // VALIDATE CURRENT REQUEST
            // ========================================

            const isCurrentRequest = () => {
                return (
                    isCurrentProject(targetKey) &&
                    requestVersion ===
                        requestVersionRef.current
                );
            };

            // ========================================
            // LOADING STATE
            // ========================================

            if (showLoading) {
                setFeed((previous) => ({
                    projectKey: targetKey,

                    comments:
                        previous.projectKey === targetKey
                            ? previous.comments
                            : EMPTY_COMMENTS,

                    status: "loading",

                    error: null,
                }));
            }

            // Preserve existing Redux action contract.
            dispatch(
                getProjectCommentStart()
            );

            try {
                // ====================================
                // API
                // ====================================

                const response =
                    await ProjectService.getProjectComments(
                        projectId
                    );

                // ====================================
                // STALE REQUEST PROTECTION
                // ====================================

                if (!isCurrentRequest()) {
                    return false;
                }

                // ====================================
                // NORMALIZE
                // ====================================

                const normalizedComments =
                    normalizeProjectComments(
                        response
                    );

                // ====================================
                // REDUX SUCCESS
                // ====================================

                dispatch(
                    getProjectCommentSuccess(
                        normalizedComments
                    )
                );

                // ====================================
                // LOCAL SUCCESS
                // ====================================

                setFeed({
                    projectKey: targetKey,
                    comments: normalizedComments,
                    status: "success",
                    error: null,
                });

                return true;

            } catch (requestError) {
                // ====================================
                // IGNORE OUTDATED RESPONSE
                // ====================================

                if (!isCurrentRequest()) {
                    return false;
                }

                // ====================================
                // ERROR MESSAGE
                // ====================================

                const message =
                    getDiscussionErrorMessage(
                        requestError,
                        "Sharhlarni yuklashda xato yuz berdi."
                    );

                console.error(
                    "ProjectDiscussion sharhlarni yuklash xatosi:",
                    requestError
                );

                // ====================================
                // REDUX FAILURE
                // ====================================

                dispatch(
                    getProjectCommentFailure(
                        message
                    )
                );

                // ====================================
                // LOCAL ERROR
                //
                // If a background refresh fails,
                // retain an existing successfully
                // loaded comments list.
                // ====================================

                setFeed((previous) => {
                    const previousComments =
                        previous.projectKey === targetKey
                            ? previous.comments
                            : EMPTY_COMMENTS;

                    const canKeepPrevious =
                        !showLoading &&
                        previousComments.length > 0;

                    return {
                        projectKey: targetKey,

                        comments: previousComments,

                        status: canKeepPrevious
                            ? "success"
                            : "error",

                        error: canKeepPrevious
                            ? null
                            : message,
                    };
                });

                // ====================================
                // OPTIONAL TOAST
                // ====================================

                if (notifyOnError) {
                    siteToast.warning(
                        message,
                        {
                            title:
                                "Sharhlar ro‘yxati yangilanmadi",

                            duration: 4500,
                        }
                    );
                }

                return false;
            }
        },
        [
            dispatch,
            projectId,
            projectKey,
            isCurrentProject,
        ]
    );

    // =====================================================
    // REFRESH COMMENTS
    //
    // Safe callback for onClick / onRetry.
    // =====================================================

    const refreshComments = useCallback(
        () => {
            return loadComments({
                showLoading: true,
                notifyOnError: false,
            });
        },
        [
            loadComments,
        ]
    );

    // =====================================================
    // INITIAL LOAD / PROJECT CHANGE
    // =====================================================

    useEffect(() => {
        // ================================================
        // RESET LOCAL INPUTS / MODALS
        // ================================================

        setNewCommentText("");
        setSubmitError("");

        setIsEditModalOpen(false);
        setEditingComment(null);
        setEditCommentText("");
        setUpdateError("");

        setIsDeleteModalOpen(false);
        setCommentToDelete(null);

        // ================================================
        // LOAD PROJECT COMMENTS
        // ================================================

        if (projectKey) {
            refreshComments();
        }

        // ================================================
        // CLEANUP OLD REQUEST
        // ================================================

        return () => {
            requestVersionRef.current += 1;
        };
    }, [
        projectKey,
        refreshComments,
    ]);

    // =====================================================
    // CREATE TEXT CHANGE
    //
    // Clears an old validation error as the user types.
    // =====================================================

    const handleNewCommentChange = useCallback(
        (value) => {
            setNewCommentText(
                String(value ?? "")
            );

            setSubmitError("");
        },
        []
    );

    // =====================================================
    // ADD COMMENT
    //
    // API contract:
    //
    // ProjectService.projectCommentCreate(
    //     projectId,
    //     { body: cleanText }
    // )
    // =====================================================

    const addProjectComment = useCallback(
        async () => {
            // ========================================
            // AUTH GUARD
            // ========================================

            if (!isLoggedIn) {
                siteToast.warning(
                    "Sharh qoldirish uchun avval tizimga kiring.",
                    {
                        title: "Kirish talab qilinadi",
                        duration: 3500,
                    }
                );

                return false;
            }

            // ========================================
            // PROJECT GUARD
            // ========================================

            if (!projectKey) {
                siteToast.error(
                    "Loyiha ID topilmadi.",
                    {
                        title: "Sharh yozilmadi",
                    }
                );

                return false;
            }

            // ========================================
            // VALIDATE COMMENT
            // ========================================

            const cleanText =
                newCommentText.trim();

            if (!cleanText) {
                const message =
                    "Sharh matnini kiriting.";

                setSubmitError(message);

                siteToast.warning(
                    message,
                    {
                        title: "Sharh yozilmadi",
                    }
                );

                return false;
            }

            // ========================================
            // PREVENT DUPLICATES
            // ========================================

            if (
                createBusyRef.current ||
                updateBusyRef.current ||
                deleteBusyRef.current
            ) {
                return false;
            }

            createBusyRef.current = true;

            setIsSubmitting(true);
            setSubmitError("");

            const targetKey = projectKey;

            // ========================================
            // LOADING TOAST
            // ========================================

            const toastId = siteToast.loading(
                "Sharhingiz yuborilmoqda...",
                {
                    title: "Sharh yuborilmoqda",
                }
            );

            try {
                // ====================================
                // API CREATE
                // ====================================

                await ProjectService.projectCommentCreate(
                    projectId,
                    {
                        body: cleanText,
                    }
                );

                // ====================================
                // IGNORE OUTDATED PAGE STATE
                // ====================================

                if (!isCurrentProject(targetKey)) {
                    return false;
                }

                // ====================================
                // CLEAR INPUT
                // ====================================

                setNewCommentText("");

                // ====================================
                // API MUTATION SUCCEEDED
                // ====================================

                siteToast.success(
                    "Sharhingiz muvaffaqiyatli qo‘shildi.",
                    {
                        id: toastId,
                        title: "Sharh qo‘shildi",
                        duration: 3000,
                    }
                );

                // ====================================
                // REFRESH LIST
                //
                // A refresh error must not be reported
                // as a failed comment creation.
                // ====================================

                await loadComments({
                    showLoading: false,
                    notifyOnError: true,
                });

                return true;

            } catch (requestError) {
                if (!isCurrentProject(targetKey)) {
                    return false;
                }

                // ====================================
                // CREATE FAILURE
                // ====================================

                const message =
                    getDiscussionErrorMessage(
                        requestError,
                        "Sharhni yuborishda xato yuz berdi."
                    );

                setSubmitError(message);

                siteToast.error(
                    message,
                    {
                        id: toastId,
                        title: "Sharh yuborilmadi",
                        duration: 4500,
                    }
                );

                console.error(
                    "ProjectDiscussion sharh yaratish xatosi:",
                    requestError
                );

                return false;

            } finally {
                createBusyRef.current = false;

                if (isCurrentProject(targetKey)) {
                    setIsSubmitting(false);
                }
            }
        },
        [
            isLoggedIn,
            projectId,
            projectKey,
            newCommentText,
            isCurrentProject,
            loadComments,
        ]
    );

    // =====================================================
    // OPEN EDIT MODAL
    // =====================================================

    const handleEditClick = useCallback(
        (comment) => {
            if (
                comment?.id == null ||
                createBusyRef.current ||
                updateBusyRef.current ||
                deleteBusyRef.current
            ) {
                return;
            }

            // ========================================
            // UI OWNERSHIP CHECK
            // ========================================

            const canEdit = isCommentAuthor(
                user,
                comment.user,
                isLoggedIn
            );

            if (!canEdit) {
                siteToast.warning(
                    "Siz faqat o‘zingiz yozgan sharhni tahrirlay olasiz.",
                    {
                        title: "Ruxsat yo‘q",
                    }
                );

                return;
            }

            // ========================================
            // OPEN MODAL
            // ========================================

            setEditingComment(comment);

            setEditCommentText(
                String(comment.body ?? "")
            );

            setUpdateError("");

            setIsEditModalOpen(true);
        },
        [
            user,
            isLoggedIn,
        ]
    );

    // =====================================================
    // CLOSE EDIT MODAL
    // =====================================================

    const handleCloseEditModal = useCallback(
        () => {
            if (updateBusyRef.current) {
                return;
            }

            setIsEditModalOpen(false);
            setEditingComment(null);
            setEditCommentText("");
            setUpdateError("");
        },
        []
    );

    // =====================================================
    // EDIT TEXT CHANGE
    // =====================================================

    const handleEditCommentChange = useCallback(
        (value) => {
            setEditCommentText(
                String(value ?? "")
            );

            setUpdateError("");
        },
        []
    );

    // =====================================================
    // UPDATE COMMENT
    //
    // API contract:
    //
    // ProjectService.projectCommentUpdate(
    //     projectId,
    //     commentId,
    //     { body: cleanText }
    // )
    // =====================================================

    const handleUpdateComment = useCallback(
        async () => {
            // ========================================
            // VALIDATE COMMENT
            // ========================================

            if (
                !projectKey ||
                editingComment?.id == null ||
                updateBusyRef.current ||
                createBusyRef.current ||
                deleteBusyRef.current
            ) {
                return false;
            }

            // ========================================
            // OWNERSHIP CHECK
            // ========================================

            if (
                !isCommentAuthor(
                    user,
                    editingComment.user,
                    isLoggedIn
                )
            ) {
                siteToast.warning(
                    "Ushbu sharhni tahrirlashga ruxsatingiz yo‘q.",
                    {
                        title: "Ruxsat yo‘q",
                    }
                );

                return false;
            }

            // ========================================
            // VALIDATE TEXT
            // ========================================

            const cleanText =
                editCommentText.trim();

            if (!cleanText) {
                const message =
                    "Sharh matnini bo‘sh qoldirib bo‘lmaydi.";

                setUpdateError(message);

                siteToast.warning(
                    message,
                    {
                        title: "Sharh saqlanmadi",
                    }
                );

                return false;
            }

            // ========================================
            // LOCK
            // ========================================

            updateBusyRef.current = true;

            setIsUpdating(true);
            setUpdateError("");

            const targetKey = projectKey;

            const commentId =
                editingComment.id;

            // ========================================
            // LOADING TOAST
            // ========================================

            const toastId = siteToast.loading(
                "Sharhdagi o‘zgarishlar saqlanmoqda...",
                {
                    title: "Sharh yangilanmoqda",
                }
            );

            try {
                // ====================================
                // API UPDATE
                // ====================================

                await ProjectService.projectCommentUpdate(
                    projectId,
                    commentId,
                    {
                        body: cleanText,
                    }
                );

                if (!isCurrentProject(targetKey)) {
                    return false;
                }

                // ====================================
                // CLOSE MODAL
                // ====================================

                setIsEditModalOpen(false);

                setEditingComment(null);

                setEditCommentText("");

                setUpdateError("");

                // ====================================
                // SUCCESS
                // ====================================

                siteToast.success(
                    "Sharh muvaffaqiyatli yangilandi.",
                    {
                        id: toastId,
                        title: "Sharh yangilandi",
                        duration: 3000,
                    }
                );

                // ====================================
                // REFRESH COMMENTS
                // ====================================

                await loadComments({
                    showLoading: false,
                    notifyOnError: true,
                });

                return true;

            } catch (requestError) {
                if (!isCurrentProject(targetKey)) {
                    return false;
                }

                const message =
                    getDiscussionErrorMessage(
                        requestError,
                        "Sharhni tahrirlashda xato yuz berdi."
                    );

                setUpdateError(message);

                siteToast.error(
                    message,
                    {
                        id: toastId,
                        title: "Sharh yangilanmadi",
                        duration: 4500,
                    }
                );

                console.error(
                    "ProjectDiscussion sharh tahrirlash xatosi:",
                    requestError
                );

                return false;

            } finally {
                updateBusyRef.current = false;

                if (isCurrentProject(targetKey)) {
                    setIsUpdating(false);
                }
            }
        },
        [
            projectId,
            projectKey,
            editingComment,
            editCommentText,
            user,
            isLoggedIn,
            isCurrentProject,
            loadComments,
        ]
    );

    // =====================================================
    // OPEN DELETE MODAL
    // =====================================================

    const handleDeleteClick = useCallback(
        (comment) => {
            if (
                comment?.id == null ||
                createBusyRef.current ||
                updateBusyRef.current ||
                deleteBusyRef.current
            ) {
                return;
            }

            const canDelete = isCommentAuthor(
                user,
                comment.user,
                isLoggedIn
            );

            if (!canDelete) {
                siteToast.warning(
                    "Siz faqat o‘zingiz yozgan sharhni o‘chira olasiz.",
                    {
                        title: "Ruxsat yo‘q",
                    }
                );

                return;
            }

            setCommentToDelete(comment);
            setIsDeleteModalOpen(true);
        },
        [
            user,
            isLoggedIn,
        ]
    );

    // =====================================================
    // CLOSE DELETE MODAL
    // =====================================================

    const handleCloseDeleteModal = useCallback(
        () => {
            if (deleteBusyRef.current) {
                return;
            }

            setIsDeleteModalOpen(false);

            setCommentToDelete(null);
        },
        []
    );

    // =====================================================
    // DELETE COMMENT
    //
    // API contract:
    //
    // ProjectService.projectCommentDelete(
    //     projectId,
    //     commentId
    // )
    // =====================================================

    const handleConfirmDelete = useCallback(
        async () => {
            if (
                !projectKey ||
                commentToDelete?.id == null ||
                deleteBusyRef.current ||
                createBusyRef.current ||
                updateBusyRef.current
            ) {
                return false;
            }

            // ========================================
            // OWNERSHIP CHECK
            // ========================================

            if (
                !isCommentAuthor(
                    user,
                    commentToDelete.user,
                    isLoggedIn
                )
            ) {
                siteToast.warning(
                    "Ushbu sharhni o‘chirishga ruxsatingiz yo‘q.",
                    {
                        title: "Ruxsat yo‘q",
                    }
                );

                return false;
            }

            // ========================================
            // LOCK
            // ========================================

            deleteBusyRef.current = true;

            setIsDeleting(true);

            const targetKey = projectKey;

            const commentId =
                commentToDelete.id;

            // ========================================
            // LOADING TOAST
            // ========================================

            const toastId = siteToast.loading(
                "Sharh o‘chirilmoqda...",
                {
                    title: "Sharh o‘chirilmoqda",
                }
            );

            try {
                // ====================================
                // API DELETE
                // ====================================

                await ProjectService.projectCommentDelete(
                    projectId,
                    commentId
                );

                if (!isCurrentProject(targetKey)) {
                    return false;
                }

                // ====================================
                // CLOSE MODAL
                // ====================================

                setIsDeleteModalOpen(false);

                setCommentToDelete(null);

                // ====================================
                // SUCCESS
                // ====================================

                siteToast.success(
                    "Sharh muvaffaqiyatli o‘chirildi.",
                    {
                        id: toastId,
                        title: "Sharh o‘chirildi",
                        duration: 3000,
                    }
                );

                // ====================================
                // REFRESH COMMENTS
                // ====================================

                await loadComments({
                    showLoading: false,
                    notifyOnError: true,
                });

                return true;

            } catch (requestError) {
                if (!isCurrentProject(targetKey)) {
                    return false;
                }

                const message =
                    getDiscussionErrorMessage(
                        requestError,
                        "Sharhni o‘chirishda xato yuz berdi."
                    );

                siteToast.error(
                    message,
                    {
                        id: toastId,
                        title: "Sharh o‘chirilmadi",
                        duration: 4500,
                    }
                );

                console.error(
                    "ProjectDiscussion sharh o‘chirish xatosi:",
                    requestError
                );

                return false;

            } finally {
                deleteBusyRef.current = false;

                if (isCurrentProject(targetKey)) {
                    setIsDeleting(false);
                }
            }
        },
        [
            projectId,
            projectKey,
            commentToDelete,
            user,
            isLoggedIn,
            isCurrentProject,
            loadComments,
        ]
    );

    // =====================================================
    // PUBLIC CONTROLLER API
    // =====================================================

    return {
        // ================================================
        // PROJECT
        // ================================================

        projectId,

        // ================================================
        // AUTH
        // ================================================

        isLoggedIn,
        user,

        // ================================================
        // COMMENTS
        // ================================================

        comments,

        commentsCount: comments.length,

        isLoading,
        error,

        loadComments,
        refreshComments,

        // ================================================
        // CREATE COMMENT
        // ================================================

        newCommentText,
        setNewCommentText,

        handleNewCommentChange,

        isSubmitting,
        submitError,

        addProjectComment,

        // ================================================
        // EDIT MODAL
        // ================================================

        isEditModalOpen,
        editingComment,

        editCommentText,
        setEditCommentText,

        handleEditCommentChange,

        isUpdating,
        updateError,

        handleEditClick,
        handleCloseEditModal,
        handleUpdateComment,

        // ================================================
        // DELETE MODAL
        // ================================================

        isDeleteModalOpen,
        commentToDelete,

        isDeleting,

        handleDeleteClick,
        handleCloseDeleteModal,
        handleConfirmDelete,
    };
};

// =========================================================
// EXPORT
// =========================================================

export default useProjectDiscussion;
