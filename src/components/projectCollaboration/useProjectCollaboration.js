
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
// EXISTING REDUX THUNKS
// =========================================================

import {
    fetchCollaborationRequests,
    sendCollaborationRequest,
    manageCollaborationRequest,
    fetchProjectCollaborators,
} from "../../redux/thunks/projectThunks";

// =========================================================
// TOAST
// =========================================================

import {
    siteToast,
} from "../ui/AuthToast";

// =========================================================
// CONFIG
// =========================================================

import {
    COLLABORATION_ROLES,
    getSafeCollaborationList,
    getDisplayedCollaborators,
    assertCollaborationActionSucceeded,
} from "./collaborationConfig";

// =========================================================
// HELPERS
// =========================================================

import {
    getErrorMessage,
} from "../projectDetail/projectDetailHelpers";

// =========================================================
// SELECTORS
// =========================================================

const selectProjectState = (state) =>
    state.project || {};

const selectAuthState = (state) =>
    state.auth || {};

// =========================================================
// FSOCIETY — PROJECT COLLABORATION CONTROLLER
//
// Responsibilities:
// - Redux collaboration data
// - Fetch requests
// - Fetch collaborators
// - Join request
// - Accept / reject request
// - Modal state
// - Loading / error state
// - Toast notifications
// - Prevent duplicate actions
// - Protect local state on route changes
// - Owner / collaborator derived states
//
// UI components do not dispatch Redux actions.
// =========================================================

const useProjectCollaboration = ({
    projectId,
    projectOwner,

    isOwner = false,
    isCollaborator = false,

    hasSentRequest: initialHasSentRequest = false,

    currentCollaborators: initialCollaborators,
    pendingRequests: initialPendingRequests,
} = {}) => {
    // =====================================================
    // REDUX
    // =====================================================

    const dispatch = useDispatch();

    const {
        isLoggedIn = false,
        user = null,
    } = useSelector(selectAuthState);

    const {
        collaborators: reduxCollaborators,

        collaboratorsIsLoading = false,

        collaborationRequests: reduxRequests,

        collaborationRequestIsLoading = false,

        collaborationRequestError = null,

        isCollaborationActionLoading = false,
    } = useSelector(selectProjectState);

    // =====================================================
    // PROJECT KEY
    // =====================================================

    const projectKey =
        projectId == null
            ? ""
            : String(projectId);

    // =====================================================
    // MODAL STATES
    // =====================================================

    const [showJoinModal, setShowJoinModal] =
        useState(false);

    const [showManageModal, setShowManageModal] =
        useState(false);

    const [activeTab, setActiveTab] =
        useState("requests");

    // =====================================================
    // JOIN FORM
    // =====================================================

    const [selectedRole, setSelectedRole] =
        useState("");

    const [comment, setComment] =
        useState("");

    const [joinRequestError, setJoinRequestError] =
        useState("");

    // =====================================================
    // ACTION STATES
    // =====================================================

    const [isJoining, setIsJoining] =
        useState(false);

    const [managingRequestId, setManagingRequestId] =
        useState(null);

    // =====================================================
    // SENT REQUEST
    //
    // Keep the project ID instead of a plain boolean.
    // =====================================================

    const [requestSentFor, setRequestSentFor] =
        useState(null);

    // =====================================================
    // LOADED DATA OWNERSHIP
    //
    // Redux collaboration arrays may still contain
    // data fetched for a previously opened project.
    //
    // Until the current project's fetch completes,
    // prefer the current ProjectDetail props.
    // =====================================================

    const [
        collaboratorsLoadedFor,
        setCollaboratorsLoadedFor,
    ] = useState(null);

    const [
        requestsLoadedFor,
        setRequestsLoadedFor,
    ] = useState(null);

    // =====================================================
    // REFS
    // =====================================================

    const mountedRef = useRef(false);

    const joinBusyRef = useRef(false);

    const manageBusyRef = useRef(false);

    const activeProjectKeyRef = useRef(projectKey);

    activeProjectKeyRef.current = projectKey;

    // =====================================================
    // MOUNT LIFECYCLE
    // =====================================================

    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;
        };
    }, []);

    // =====================================================
    // IS CURRENT PROJECT
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
    // SAFE COLLABORATORS
    // =====================================================

    const currentCollaborators = useMemo(() => {
        const useReduxData =
            collaboratorsLoadedFor === projectKey &&
            reduxCollaborators !== undefined;

        const source = useReduxData
            ? reduxCollaborators
            : initialCollaborators;

        return getSafeCollaborationList(source);
    }, [
        collaboratorsLoadedFor,
        projectKey,
        reduxCollaborators,
        initialCollaborators,
    ]);

    // =====================================================
    // SAFE PENDING REQUESTS
    // =====================================================

    const pendingRequests = useMemo(() => {
        const useReduxData =
            requestsLoadedFor === projectKey &&
            reduxRequests !== undefined;

        const source = useReduxData
            ? reduxRequests
            : initialPendingRequests;

        return getSafeCollaborationList(source);
    }, [
        requestsLoadedFor,
        projectKey,
        reduxRequests,
        initialPendingRequests,
    ]);

    // =====================================================
    // DISPLAYED COLLABORATORS
    //
    // Excludes the project owner and duplicate users.
    // =====================================================

    const displayedCollaborators = useMemo(() => {
        return getDisplayedCollaborators(
            currentCollaborators,
            projectOwner
        );
    }, [
        currentCollaborators,
        projectOwner,
    ]);

    // =====================================================
    // TEAM COUNT
    // =====================================================

    const totalMembers =
        displayedCollaborators.length + 1;

    // =====================================================
    // CURRENT USER COLLABORATION
    //
    // Also recognize the current user's membership
    // from a freshly fetched collaborators list.
    // =====================================================

    const currentUserIsCollaborator = useMemo(() => {
        if (isCollaborator) {
            return true;
        }

        if (!isLoggedIn || !user) {
            return false;
        }

        const currentUserId =
            user.id != null
                ? String(user.id)
                : null;

        const username =
            typeof user.username === "string"
                ? user.username.toLowerCase()
                : null;

        return currentCollaborators.some(
            (collaboration) => {
                if (
                    !collaboration ||
                    collaboration.is_active === false
                ) {
                    return false;
                }

                const member =
                    collaboration.user || {};

                if (
                    currentUserId &&
                    member.id != null &&
                    String(member.id) === currentUserId
                ) {
                    return true;
                }

                return Boolean(
                    username &&
                    member.username &&
                    String(member.username).toLowerCase() ===
                        username
                );
            }
        );
    }, [
        isCollaborator,
        isLoggedIn,
        user,
        currentCollaborators,
    ]);

    // =====================================================
    // HAS SENT REQUEST
    //
    // The parent may provide an existing pending status.
    //
    // A successful local submission is associated with
    // the project it was sent to.
    // =====================================================

    const hasSentRequest =
        Boolean(initialHasSentRequest) ||
        (
            requestSentFor != null &&
            requestSentFor === projectKey
        );

    // =====================================================
    // BUSY STATE
    // =====================================================

    const isManaging = Boolean(
        managingRequestId != null ||
        isCollaborationActionLoading
    );

    const canJoin =
        Boolean(projectKey) &&
        !isOwner &&
        !currentUserIsCollaborator &&
        !hasSentRequest;

    // =====================================================
    // FETCH COLLABORATION DATA
    //
    // Uses the existing Redux thunks.
    //
    // The hook does not assume an AbortSignal contract
    // that these thunks may not support.
    // =====================================================

    const refreshCollaboration = useCallback(
        async ({
            silent = false,
        } = {}) => {
            if (!projectKey) {
                return false;
            }

            const targetKey = projectKey;

            // ========================================
            // FETCH COLLABORATORS
            // ========================================

            const collaboratorsTask = async () => {
                const result = await dispatch(
                    fetchProjectCollaborators(projectId)
                );

                assertCollaborationActionSucceeded(
                    result
                );

                if (isCurrentProject(targetKey)) {
                    setCollaboratorsLoadedFor(targetKey);
                }
            };

            // ========================================
            // FETCH REQUESTS (OWNER ONLY)
            // ========================================

            const requestsTask = async () => {
                const result = await dispatch(
                    fetchCollaborationRequests(projectId)
                );

                assertCollaborationActionSucceeded(
                    result
                );

                if (isCurrentProject(targetKey)) {
                    setRequestsLoadedFor(targetKey);
                }
            };

            const tasks = [
                collaboratorsTask(),
            ];

            if (isOwner) {
                tasks.push(requestsTask());
            }

            // ========================================
            // SETTLE ALL FETCHES
            // ========================================

            const results =
                await Promise.allSettled(tasks);

            const failures = results
                .filter(
                    (result) =>
                        result.status === "rejected"
                )
                .map((result) => result.reason);

            if (failures.length === 0) {
                return true;
            }

            // ========================================
            // FETCH ERROR
            // ========================================

            if (isCurrentProject(targetKey)) {
                const message = getErrorMessage(
                    failures[0],
                    "Hamkorlik ma’lumotlarini yangilab bo‘lmadi."
                );

                console.error(
                    "Hamkorlik ma’lumotlarini yuklashda xato:",
                    failures
                );

                if (!silent) {
                    siteToast.error(
                        message,
                        {
                            title: "Ma’lumotlar yangilanmadi",
                            duration: 4000,
                        }
                    );
                }
            }

            return false;
        },
        [
            dispatch,
            projectId,
            projectKey,
            isOwner,
            isCurrentProject,
        ]
    );

    // =====================================================
    // RESET STATE WHEN PROJECT / USER CHANGES
    // =====================================================

    useEffect(() => {
        setShowJoinModal(false);
        setShowManageModal(false);

        setSelectedRole("");
        setComment("");
        setJoinRequestError("");

        setActiveTab("requests");

        setIsJoining(false);
        setManagingRequestId(null);

        setRequestSentFor(null);

        setCollaboratorsLoadedFor(null);
        setRequestsLoadedFor(null);
    }, [
        projectKey,
        user?.id,
    ]);

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        if (!projectKey) {
            return;
        }

        refreshCollaboration({
            silent: true,
        });
    }, [
        projectKey,
        refreshCollaboration,
        user?.id,
    ]);

    // =====================================================
    // OPEN JOIN MODAL
    // =====================================================

    const handleOpenJoinModal = useCallback(() => {
        if (!projectKey) {
            return;
        }

        if (!isLoggedIn) {
            siteToast.warning(
                "Loyihaga qo‘shilish uchun avval tizimga kiring.",
                {
                    title: "Kirish talab qilinadi",
                    duration: 3500,
                }
            );

            return;
        }

        if (
            !canJoin ||
            joinBusyRef.current
        ) {
            return;
        }

        setJoinRequestError("");
        setShowJoinModal(true);
    }, [
        projectKey,
        isLoggedIn,
        canJoin,
    ]);

    // =====================================================
    // CLOSE JOIN MODAL
    // =====================================================

    const handleCloseJoinModal = useCallback(() => {
        if (joinBusyRef.current) {
            return;
        }

        setShowJoinModal(false);
        setJoinRequestError("");
    }, []);

    // =====================================================
    // SEND JOIN REQUEST
    //
    // Existing thunk signature:
    //
    // sendCollaborationRequest(
    //     projectId,
    //     { role, message }
    // )
    // =====================================================

    const sendJoinRequest = useCallback(
        async () => {
            if (
                !projectKey ||
                !isLoggedIn ||
                !canJoin ||
                joinBusyRef.current
            ) {
                return false;
            }

            // ========================================
            // VALIDATE ROLE
            // ========================================

            const validRole =
                COLLABORATION_ROLES.some(
                    (role) =>
                        role.value === selectedRole
                );

            if (!validRole) {
                setJoinRequestError(
                    "Iltimos, rolingizni tanlang."
                );

                return false;
            }

            // ========================================
            // LOCK
            // ========================================

            joinBusyRef.current = true;

            setIsJoining(true);
            setJoinRequestError("");

            const targetKey = projectKey;

            const requestData = {
                role: selectedRole,
                message: comment.trim(),
            };

            try {
                // ====================================
                // API VIA REDUX THUNK
                // ====================================

                const result = await dispatch(
                    sendCollaborationRequest(
                        projectId,
                        requestData
                    )
                );

                assertCollaborationActionSucceeded(
                    result
                );

                // ====================================
                // IGNORE OUTDATED UI RESULT
                // ====================================

                if (!isCurrentProject(targetKey)) {
                    return false;
                }

                // ====================================
                // SUCCESS STATE
                // ====================================

                setRequestSentFor(targetKey);

                setShowJoinModal(false);

                setSelectedRole("");
                setComment("");

                siteToast.success(
                    "Hamkorlik so‘rovingiz yuborildi. Muallif tasdiqlashi kutilmoqda.",
                    {
                        title: "So‘rov yuborildi",
                        duration: 3500,
                    }
                );

                return true;

            } catch (requestError) {
                if (!isCurrentProject(targetKey)) {
                    return false;
                }

                const message = getErrorMessage(
                    requestError,
                    "Hamkorlik so‘rovini yuborishda xatolik yuz berdi."
                );

                setJoinRequestError(message);

                siteToast.error(
                    message,
                    {
                        title: "So‘rov yuborilmadi",
                        duration: 4500,
                    }
                );

                console.error(
                    "Hamkorlik so‘rovi xatosi:",
                    requestError
                );

                return false;

            } finally {
                joinBusyRef.current = false;

                if (isCurrentProject(targetKey)) {
                    setIsJoining(false);
                }
            }
        },
        [
            dispatch,
            projectId,
            projectKey,
            isLoggedIn,
            canJoin,
            selectedRole,
            comment,
            isCurrentProject,
        ]
    );

    // =====================================================
    // OPEN MANAGE MODAL
    // =====================================================

    const handleOpenManageModal = useCallback(() => {
        if (
            !isOwner ||
            !projectKey
        ) {
            return;
        }

        setActiveTab("requests");
        setShowManageModal(true);

        refreshCollaboration({
            silent: true,
        });
    }, [
        isOwner,
        projectKey,
        refreshCollaboration,
    ]);

    // =====================================================
    // CLOSE MANAGE MODAL
    // =====================================================

    const handleCloseManageModal = useCallback(() => {
        if (manageBusyRef.current) {
            return;
        }

        setShowManageModal(false);
    }, []);

    // =====================================================
    // MANAGE REQUEST
    //
    // Existing thunk signature:
    //
    // manageCollaborationRequest(
    //     requestId,
    //     status,
    //     projectId
    // )
    // =====================================================

    const manageRequest = useCallback(
        async (requestId, status) => {
            if (
                !projectKey ||
                !isOwner ||
                requestId == null ||
                manageBusyRef.current
            ) {
                return false;
            }

            if (
                status !== "accepted" &&
                status !== "rejected"
            ) {
                return false;
            }

            // ========================================
            // LOCK
            // ========================================

            manageBusyRef.current = true;

            setManagingRequestId(requestId);

            const targetKey = projectKey;

            try {
                // ====================================
                // API VIA REDUX THUNK
                // ====================================

                const result = await dispatch(
                    manageCollaborationRequest(
                        requestId,
                        status,
                        projectId
                    )
                );

                assertCollaborationActionSucceeded(
                    result
                );

                // ====================================
                // IGNORE OUTDATED UI RESULT
                // ====================================

                if (!isCurrentProject(targetKey)) {
                    return false;
                }

                // ====================================
                // SUCCESS NOTIFICATION
                // ====================================

                if (status === "accepted") {
                    siteToast.success(
                        "So‘rov qabul qilindi va hamkor qo‘shildi.",
                        {
                            title: "Hamkor qo‘shildi",
                            duration: 3000,
                        }
                    );
                } else {
                    siteToast.info(
                        "Hamkorlik so‘rovi rad etildi.",
                        {
                            title: "So‘rov rad etildi",
                            duration: 2800,
                        }
                    );
                }

                // ====================================
                // REFRESH LISTS
                //
                // Refresh failures are handled
                // separately and must not reverse
                // an already successful action.
                // ====================================

                await refreshCollaboration({
                    silent: false,
                });

                return true;

            } catch (requestError) {
                if (!isCurrentProject(targetKey)) {
                    return false;
                }

                const message = getErrorMessage(
                    requestError,
                    "Hamkorlik so‘rovini boshqarishda xatolik yuz berdi."
                );

                siteToast.error(
                    message,
                    {
                        title: "Amal bajarilmadi",
                        duration: 4500,
                    }
                );

                console.error(
                    "Hamkorlikni boshqarish xatosi:",
                    requestError
                );

                return false;

            } finally {
                manageBusyRef.current = false;

                if (isCurrentProject(targetKey)) {
                    setManagingRequestId(null);
                }
            }
        },
        [
            dispatch,
            projectId,
            projectKey,
            isOwner,
            refreshCollaboration,
            isCurrentProject,
        ]
    );

    // =====================================================
    // ACCEPT REQUEST
    // =====================================================

    const acceptRequest = useCallback(
        (requestId) => {
            return manageRequest(
                requestId,
                "accepted"
            );
        },
        [manageRequest]
    );

    // =====================================================
    // REJECT REQUEST
    // =====================================================

    const rejectRequest = useCallback(
        (requestId) => {
            return manageRequest(
                requestId,
                "rejected"
            );
        },
        [manageRequest]
    );

    // =====================================================
    // PUBLIC API
    // =====================================================

    return {
        // ================================================
        // PROJECT
        // ================================================

        projectId,
        projectOwner,

        // ================================================
        // AUTH / PERMISSIONS
        // ================================================

        isLoggedIn,
        user,
        isOwner,

        isCollaborator:
            currentUserIsCollaborator,

        hasSentRequest,
        canJoin,

        // ================================================
        // COLLABORATORS
        // ================================================

        currentCollaborators,
        displayedCollaborators,
        totalMembers,

        // ================================================
        // REQUESTS
        // ================================================

        pendingRequests,

        // ================================================
        // REDUX LOADING / ERROR
        // ================================================

        collaboratorsLoading:
            Boolean(collaboratorsIsLoading),

        requestsLoading:
            Boolean(collaborationRequestIsLoading),

        requestError:
            collaborationRequestError,

        isActionLoading:
            Boolean(isCollaborationActionLoading),

        // ================================================
        // JOIN MODAL
        // ================================================

        showJoinModal,
        handleOpenJoinModal,
        handleCloseJoinModal,

        selectedRole,
        setSelectedRole,

        comment,
        setComment,

        joinRequestError,
        isJoining,

        sendJoinRequest,

        // ================================================
        // MANAGE MODAL
        // ================================================

        showManageModal,
        handleOpenManageModal,
        handleCloseManageModal,

        activeTab,
        setActiveTab,

        isManaging,
        managingRequestId,

        acceptRequest,
        rejectRequest,

        // ================================================
        // REFRESH
        // ================================================

        refreshCollaboration,
    };
};

// =========================================================
// EXPORT
// =========================================================

export default useProjectCollaboration;
