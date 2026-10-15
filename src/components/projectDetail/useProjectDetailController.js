
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

import {
    useNavigate,
    useParams,
} from "react-router-dom";

// =========================================================
// REDUX
// =========================================================

import {
    getProjectDetailFailure,
    getProjectDetailStart,
    getProjectDetailSuccess,
} from "../../features/projects";

// =========================================================
// API
// =========================================================

import ProjectService from "../../services/project";

// =========================================================
// TOAST
// =========================================================

import {
    siteToast,
} from "../ui/AuthToast";

// =========================================================
// HELPERS
// =========================================================

import {
    formatFeatureList,
    getErrorMessage,
    getOwnerProfilePath,
    getProjectTitle,
    isProjectCollaborator,
    isProjectOwner,
    normalizeStackList,
    safeNumber,
} from "./projectDetailHelpers";

// =========================================================
// SELECTORS
// =========================================================

const selectAuthState = (state) =>
    state.auth || {};

const selectProjectState = (state) =>
    state.project || {};

// =========================================================
// INITIAL STATE
// =========================================================

const INITIAL_LOAD_STATE = {
    projectId: null,
    status: "idle",
    error: null,
};

// =========================================================
// FSOCIETY — PROJECT DETAIL CONTROLLER
//
// Responsibilities:
// - Route parameters
// - Redux project detail
// - Auth state
// - API fetching
// - Ignore outdated API responses
// - Star / Unstar
// - Optimistic updates
// - Edit project
// - Delete project
// - Toast notifications
// - Modal state
// - Promotion refresh
// - Derived project information
//
// UI components remain presentation-only.
// =========================================================

const useProjectDetailController = () => {
    // =====================================================
    // ROUTER / REDUX
    // =====================================================

    const { projectId } = useParams();

    const navigate = useNavigate();

    const dispatch = useDispatch();

    // =====================================================
    // AUTH
    // =====================================================

    const {
        isLoggedIn = false,
        user = null,
    } = useSelector(selectAuthState);

    // =====================================================
    // PROJECT REDUX
    // =====================================================

    const {
        projectDetail,
        projectDetailIsLoading = false,
    } = useSelector(selectProjectState);

    // =====================================================
    // LOCAL STATE
    // =====================================================

    const [loadState, setLoadState] =
        useState(INITIAL_LOAD_STATE);

    const [isStarred, setIsStarred] =
        useState(false);

    const [isStarLoading, setIsStarLoading] =
        useState(false);

    const [isEditModalOpen, setIsEditModalOpen] =
        useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] =
        useState(false);

    const [isUpdating, setIsUpdating] =
        useState(false);

    const [isDeleting, setIsDeleting] =
        useState(false);

    // =====================================================
    // REFS
    //
    // Prevent duplicate actions and outdated responses.
    // =====================================================

    const mountedRef = useRef(false);

    const requestSequenceRef = useRef(0);

    const starBusyRef = useRef(false);

    const updateBusyRef = useRef(false);

    const deleteBusyRef = useRef(false);

    const activeProjectIdRef = useRef(projectId);

    activeProjectIdRef.current = projectId;

    // =====================================================
    // MOUNT LIFECYCLE
    // =====================================================

    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;

            // Invalidate pending detail requests.
            requestSequenceRef.current += 1;
        };
    }, []);

    // =====================================================
    // CURRENT ROUTE PROJECT
    //
    // Never display a different project's Redux data
    // when navigating between project detail routes.
    // =====================================================

    const projectData = useMemo(() => {
        if (
            !projectId ||
            projectDetail?.id == null
        ) {
            return null;
        }

        return (
            String(projectDetail.id) ===
            String(projectId)
        )
            ? projectDetail
            : null;
    }, [
        projectDetail,
        projectId,
    ]);

    // =====================================================
    // LATEST PROJECT REF
    //
    // Async star handlers read fresh project data.
    // =====================================================

    const projectRef = useRef(projectData);

    projectRef.current = projectData;

    // =====================================================
    // AUTHOR
    // =====================================================

    const author = projectData?.user || {};

    // =====================================================
    // PROJECT TITLE
    // =====================================================

    const projectTitle = getProjectTitle(
        projectData
    );

    // =====================================================
    // PROJECT IMAGES
    // =====================================================

    const projectImages = useMemo(() => {
        return Array.isArray(projectData?.images)
            ? projectData.images.filter(Boolean)
            : [];
    }, [projectData?.images]);

    // =====================================================
    // MAIN FEATURES
    // =====================================================

    const featuresList = useMemo(() => {
        return formatFeatureList(
            projectData?.main_features
        );
    }, [projectData?.main_features]);

    // =====================================================
    // PROGRAMMING LANGUAGES
    // =====================================================

    const projectLanguages = useMemo(() => {
        return normalizeStackList(
            projectData?.languages_data,
            projectData?.language_data,
            "language"
        );
    }, [
        projectData?.languages_data,
        projectData?.language_data,
    ]);

    // =====================================================
    // TECHNOLOGIES
    // =====================================================

    const projectTechnologies = useMemo(() => {
        return normalizeStackList(
            projectData?.technologies_data,
            projectData?.technology_data,
            "technology"
        );
    }, [
        projectData?.technologies_data,
        projectData?.technology_data,
    ]);

    // =====================================================
    // OWNER / COLLABORATOR
    // =====================================================

    const isOwner = useMemo(() => {
        return isProjectOwner(
            user,
            author
        );
    }, [
        user,
        author,
    ]);

    const isCollaborator = useMemo(() => {
        return isProjectCollaborator(
            user,
            projectData?.collaborations
        );
    }, [
        user,
        projectData?.collaborations,
    ]);

    // =====================================================
    // PROMOTION
    // =====================================================

    const isPromoted = Boolean(
        projectData?.is_promoted
    );

    const promotionExpiresAt =
        projectData?.promotion_expires_at ?? null;

    // =====================================================
    // OWNER PROFILE
    // =====================================================

    const ownerProfilePath =
        getOwnerProfilePath(author);

    // =====================================================
    // LOAD PROJECT
    //
    // showLoader=true:
    //   Initial load or explicit retry.
    //
    // showLoader=false:
    //   Silent refresh after edit or promotion.
    //
    // throwOnError=true:
    //   Allows mutation handlers to catch a failed
    //   refresh instead of reporting false success.
    // =====================================================

    const loadProject = useCallback(
        async ({
            showLoader = true,
            throwOnError = false,
        } = {}) => {
            const targetId = projectId;

            if (!targetId) {
                return null;
            }

            const sequence =
                ++requestSequenceRef.current;

            const isCurrentRequest = () => {
                return (
                    mountedRef.current &&
                    sequence === requestSequenceRef.current &&
                    String(activeProjectIdRef.current) ===
                        String(targetId)
                );
            };

            // ============================================
            // START
            // ============================================

            if (showLoader) {
                setLoadState({
                    projectId: targetId,
                    status: "loading",
                    error: null,
                });

                dispatch(
                    getProjectDetailStart()
                );
            }

            try {
                // ========================================
                // API
                //
                // Preserve the existing service contract.
                // ========================================

                const response =
                    await ProjectService.projectDetail(
                        targetId
                    );

                // Ignore obsolete results.
                if (!isCurrentRequest()) {
                    return null;
                }

                // ========================================
                // VALIDATE RESPONSE
                // ========================================

                if (
                    !response ||
                    response.id == null ||
                    String(response.id) !==
                        String(targetId)
                ) {
                    throw new Error(
                        "Loyiha ma’lumotlari noto‘g‘ri qaytdi."
                    );
                }

                // ========================================
                // REDUX SUCCESS
                // ========================================

                dispatch(
                    getProjectDetailSuccess(
                        response
                    )
                );

                setLoadState({
                    projectId: targetId,
                    status: "success",
                    error: null,
                });

                // Don't overwrite an in-progress
                // optimistic star operation.
                if (!starBusyRef.current) {
                    setIsStarred(
                        Boolean(
                            response.is_starred_by_user
                        )
                    );
                }

                return response;

            } catch (requestError) {
                // ========================================
                // IGNORE OUTDATED REQUEST
                // ========================================

                if (!isCurrentRequest()) {
                    return null;
                }

                const message = getErrorMessage(
                    requestError,
                    "Loyihani yuklashda xato yuz berdi."
                );

                console.error(
                    "ProjectDetail yuklashda xato:",
                    requestError
                );

                // Only an explicit page load/retry
                // should replace the screen with
                // the error state.
                if (showLoader) {
                    dispatch(
                        getProjectDetailFailure(
                            message
                        )
                    );

                    setLoadState({
                        projectId: targetId,
                        status: "error",
                        error: message,
                    });
                }

                if (throwOnError) {
                    throw requestError;
                }

                return null;
            }
        },
        [
            projectId,
            dispatch,
        ]
    );

    // =====================================================
    // INITIAL LOAD
    //
    // Reload also when the authenticated user changes:
    // star state may differ for another user.
    // =====================================================

    useEffect(() => {
        loadProject();

        return () => {
            // Invalidate previous route/auth requests.
            requestSequenceRef.current += 1;
        };
    }, [
        loadProject,
        isLoggedIn,
        user?.id,
    ]);

    // =====================================================
    // SYNC STAR STATE WITH REDUX
    // =====================================================

    useEffect(() => {
        if (
            projectData?.id != null &&
            !starBusyRef.current
        ) {
            setIsStarred(
                Boolean(
                    projectData.is_starred_by_user
                )
            );
        }
    }, [
        projectData?.id,
        projectData?.is_starred_by_user,
    ]);

    // =====================================================
    // SILENT REFRESH
    //
    // Used by ProjectPromotion.
    // =====================================================

    const refreshProject = useCallback(() => {
        return loadProject({
            showLoader: false,
        });
    }, [loadProject]);

    // =====================================================
    // OPEN EDIT MODAL
    // =====================================================

    const handleOpenEditModal = useCallback(() => {
        if (
            !isOwner ||
            updateBusyRef.current ||
            deleteBusyRef.current
        ) {
            return;
        }

        setIsEditModalOpen(true);
    }, [isOwner]);

    // =====================================================
    // CLOSE EDIT MODAL
    // =====================================================

    const handleCloseEditModal = useCallback(() => {
        if (updateBusyRef.current) {
            return;
        }

        setIsEditModalOpen(false);
    }, []);

    // =====================================================
    // UPDATE PROJECT
    //
    // Preserves the form modal API:
    // onSubmit(formData, projectIdToUpdate)
    // =====================================================

    const handleUpdateProject = useCallback(
        async (
            formData,
            projectIdToUpdate
        ) => {
            if (
                !isOwner ||
                updateBusyRef.current ||
                deleteBusyRef.current
            ) {
                return false;
            }

            const targetProjectId =
                projectIdToUpdate ??
                projectData?.id;

            // ========================================
            // VALIDATE ID
            // ========================================

            if (
                targetProjectId == null ||
                String(targetProjectId) !==
                    String(projectData?.id)
            ) {
                siteToast.error(
                    "Loyiha ID topilmadi yoki mos kelmadi.",
                    {
                        title: "Loyiha yangilanmadi",
                    }
                );

                return false;
            }

            updateBusyRef.current = true;

            setIsUpdating(true);

            const toastId = siteToast.loading(
                "Loyihadagi o‘zgarishlar saqlanmoqda...",
                {
                    title: "Loyiha yangilanmoqda",
                }
            );

            try {
                // ====================================
                // UPDATE API
                // ====================================

                await ProjectService.updateProject(
                    targetProjectId,
                    formData
                );

                // ====================================
                // REFRESH UPDATED DATA
                // ====================================

                await loadProject({
                    showLoader: false,
                    throwOnError: true,
                });

                // ====================================
                // CLOSE MODAL
                // ====================================

                if (mountedRef.current) {
                    setIsEditModalOpen(false);
                }

                siteToast.success(
                    "Loyiha ma’lumotlari muvaffaqiyatli yangilandi.",
                    {
                        id: toastId,
                        title: "Loyiha yangilandi",
                        duration: 3800,
                    }
                );

                return true;

            } catch (requestError) {
                console.error(
                    "Loyihani tahrirlashda xato:",
                    requestError
                );

                siteToast.error(
                    getErrorMessage(
                        requestError,
                        "Loyihani tahrirlashda xato yuz berdi."
                    ),
                    {
                        id: toastId,
                        title: "Loyiha yangilanmadi",
                        duration: 5000,
                    }
                );

                // Preserve the original modal's
                // error propagation contract.
                throw requestError;

            } finally {
                updateBusyRef.current = false;

                if (mountedRef.current) {
                    setIsUpdating(false);
                }
            }
        },
        [
            isOwner,
            projectData?.id,
            loadProject,
        ]
    );

    // =====================================================
    // OPEN DELETE MODAL
    // =====================================================

    const handleOpenDeleteModal = useCallback(() => {
        if (
            !isOwner ||
            updateBusyRef.current ||
            deleteBusyRef.current
        ) {
            return;
        }

        setIsDeleteModalOpen(true);
    }, [isOwner]);

    // =====================================================
    // CLOSE DELETE MODAL
    // =====================================================

    const handleCloseDeleteModal = useCallback(() => {
        if (deleteBusyRef.current) {
            return;
        }

        setIsDeleteModalOpen(false);
    }, []);

    // =====================================================
    // DELETE PROJECT
    // =====================================================

    const handleConfirmDelete = useCallback(
        async () => {
            if (
                !isOwner ||
                projectData?.id == null ||
                deleteBusyRef.current ||
                updateBusyRef.current
            ) {
                return;
            }

            deleteBusyRef.current = true;

            setIsDeleting(true);

            const targetProjectId =
                projectData.id;

            const targetProjectTitle =
                getProjectTitle(projectData);

            const toastId = siteToast.loading(
                `"${targetProjectTitle}" loyihasi o‘chirilmoqda...`,
                {
                    title: "Loyiha o‘chirilmoqda",
                }
            );

            try {
                // ====================================
                // DELETE API
                // ====================================

                await ProjectService.deleteProject(
                    targetProjectId
                );

                if (mountedRef.current) {
                    setIsDeleteModalOpen(false);
                }

                // ====================================
                // SUCCESS
                // ====================================

                siteToast.success(
                    `"${targetProjectTitle}" loyihasi muvaffaqiyatli o‘chirildi.`,
                    {
                        id: toastId,
                        title: "Loyiha o‘chirildi",
                        duration: 3500,
                    }
                );

                // ====================================
                // NAVIGATE TO AUTHOR PROFILE
                // ====================================

                navigate(
                    ownerProfilePath,
                    {
                        replace: true,
                    }
                );

            } catch (requestError) {
                console.error(
                    "Loyihani o‘chirishda xato:",
                    requestError
                );

                siteToast.error(
                    getErrorMessage(
                        requestError,
                        "Loyihani o‘chirishda xato yuz berdi."
                    ),
                    {
                        id: toastId,
                        title: "Loyiha o‘chirilmadi",
                        duration: 5000,
                    }
                );

            } finally {
                deleteBusyRef.current = false;

                if (mountedRef.current) {
                    setIsDeleting(false);
                }
            }
        },
        [
            isOwner,
            projectData,
            navigate,
            ownerProfilePath,
        ]
    );

    // =====================================================
    // STAR / UNSTAR
    //
    // 1. Check auth
    // 2. Prevent duplicate requests
    // 3. Optimistically update Redux
    // 4. Call backend
    // 5. Apply authoritative backend values
    // 6. Roll back if the request fails
    // =====================================================

    const handleStarToggle = useCallback(
        async () => {
            // ========================================
            // AUTH GUARD
            // ========================================

            if (!isLoggedIn) {
                siteToast.warning(
                    "Loyihaga star berish uchun avval tizimga kiring.",
                    {
                        title: "Kirish talab qilinadi",
                        duration: 3500,
                    }
                );

                return;
            }

            const currentProject =
                projectRef.current;

            if (
                !currentProject?.id ||
                starBusyRef.current ||
                deleteBusyRef.current ||
                updateBusyRef.current
            ) {
                return;
            }

            const targetProjectId =
                currentProject.id;

            // ========================================
            // LOCK
            // ========================================

            starBusyRef.current = true;

            setIsStarLoading(true);

            // ========================================
            // ORIGINAL STATE
            // ========================================

            const oldIsStarred = Boolean(
                currentProject.is_starred_by_user
            );

            const oldStarsCount = safeNumber(
                currentProject.stars_count
            );

            // ========================================
            // OPTIMISTIC STATE
            // ========================================

            const nextIsStarred =
                !oldIsStarred;

            const optimisticStarsCount = Math.max(
                0,
                oldStarsCount +
                    (nextIsStarred ? 1 : -1)
            );

            const optimisticProject = {
                ...currentProject,

                stars_count:
                    optimisticStarsCount,

                is_starred_by_user:
                    nextIsStarred,
            };

            setIsStarred(nextIsStarred);

            dispatch(
                getProjectDetailSuccess(
                    optimisticProject
                )
            );

            try {
                // ====================================
                // API REQUEST
                // ====================================

                const response =
                    await ProjectService.toggleProjectStar(
                        targetProjectId
                    );

                // Ignore results after navigation.
                if (
                    !mountedRef.current ||
                    String(activeProjectIdRef.current) !==
                        String(targetProjectId)
                ) {
                    return;
                }

                // ====================================
                // BACKEND STAR STATE
                // ====================================

                const backendIsStarred =
                    typeof response?.is_starred_by_user ===
                    "boolean"
                        ? response.is_starred_by_user
                        : nextIsStarred;

                const responseCount =
                    response?.stars_count;

                const backendStarsCount =
                    responseCount != null &&
                    Number.isFinite(
                        Number(responseCount)
                    )
                        ? safeNumber(responseCount)
                        : optimisticStarsCount;

                // Keep any other fields updated
                // during the request.
                const latestProject =
                    projectRef.current ||
                    currentProject;

                const updatedProject = {
                    ...latestProject,

                    stars_count:
                        backendStarsCount,

                    is_starred_by_user:
                        backendIsStarred,
                };

                setIsStarred(
                    backendIsStarred
                );

                dispatch(
                    getProjectDetailSuccess(
                        updatedProject
                    )
                );

                // ====================================
                // SUCCESS TOAST
                // ====================================

                if (backendIsStarred) {
                    siteToast.success(
                        "Loyihaga star berildi.",
                        {
                            title: "Star berildi",
                            duration: 2500,
                        }
                    );
                } else {
                    siteToast.info(
                        "Loyihadan star olib tashlandi.",
                        {
                            title: "Star bekor qilindi",
                            duration: 2300,
                        }
                    );
                }

            } catch (requestError) {
                if (
                    !mountedRef.current ||
                    String(activeProjectIdRef.current) !==
                        String(targetProjectId)
                ) {
                    return;
                }

                console.error(
                    "Star/Unstar qilishda xato:",
                    requestError
                );

                // ====================================
                // ROLLBACK
                // ====================================

                setIsStarred(
                    oldIsStarred
                );

                const latestProject =
                    projectRef.current ||
                    currentProject;

                dispatch(
                    getProjectDetailSuccess({
                        ...latestProject,

                        stars_count:
                            oldStarsCount,

                        is_starred_by_user:
                            oldIsStarred,
                    })
                );

                siteToast.error(
                    getErrorMessage(
                        requestError,
                        "Star amalini bajarib bo‘lmadi."
                    ),
                    {
                        title: "Star saqlanmadi",
                        duration: 4500,
                    }
                );

            } finally {
                starBusyRef.current = false;

                if (mountedRef.current) {
                    setIsStarLoading(false);
                }
            }
        },
        [
            isLoggedIn,
            dispatch,
        ]
    );

    // =====================================================
    // ROUTE-SPECIFIC LOAD STATE
    // =====================================================

    const currentLoadState =
        String(loadState.projectId) ===
        String(projectId)
            ? loadState
            : INITIAL_LOAD_STATE;

    const error =
        currentLoadState.status === "error"
            ? currentLoadState.error
            : null;

    const isLoading =
        Boolean(projectDetailIsLoading) ||
        (
            Boolean(projectId) &&
            !projectData &&
            !error
        );

    // =====================================================
    // RETURN PUBLIC CONTROLLER API
    // =====================================================

    return {
        // Route
        projectId,

        // Auth
        isLoggedIn,
        user,

        // Project
        projectData,
        projectTitle,
        projectImages,
        author,
        ownerProfilePath,

        // Content
        featuresList,
        projectLanguages,
        projectTechnologies,

        // Permissions
        isOwner,
        isCollaborator,

        // Promotion
        isPromoted,
        promotionExpiresAt,

        // Fetching
        isLoading,
        error,
        loadProject,
        refreshProject,

        // Star
        isStarred,
        isStarLoading,
        handleStarToggle,

        // Edit
        isEditModalOpen,
        isUpdating,
        handleOpenEditModal,
        handleCloseEditModal,
        handleUpdateProject,

        // Delete
        isDeleteModalOpen,
        isDeleting,
        handleOpenDeleteModal,
        handleCloseDeleteModal,
        handleConfirmDelete,
    };
};

// =========================================================
// EXPORT
// =========================================================

export default useProjectDetailController;
