
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

import {
    Loader2,
} from "lucide-react";

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

import {
    siteToast,
} from "../ui/AuthToast";

// =========================================================
// PROFILE ROADMAP COMPONENTS
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
// REDUX SELECTORS
// =========================================================

const selectRoadmapState = (state) =>
    state.roadmap;

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
//
// RoadmapService can return serialized DRF errors.
//
// Supports:
// - Error message
// - JSON string
// - DRF detail
// - Validation errors
// - Error arrays
// =========================================================

const parseErrorValue = (
    value,
    depth = 0
) => {
    if (
        value == null ||
        depth > 6
    ) {
        return "";
    }

    // =====================================================
    // STRING
    // =====================================================

    if (typeof value === "string") {
        const trimmed = value.trim();

        if (!trimmed) {
            return "";
        }

        if (
            (
                trimmed.startsWith("{") &&
                trimmed.endsWith("}")
            ) ||
            (
                trimmed.startsWith("[") &&
                trimmed.endsWith("]")
            )
        ) {
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

    // =====================================================
    // ARRAY
    // =====================================================

    if (Array.isArray(value)) {
        return value
            .map((item) =>
                parseErrorValue(
                    item,
                    depth + 1
                )
            )
            .filter(Boolean)
            .join("; ");
    }

    // =====================================================
    // OBJECT
    // =====================================================

    if (typeof value === "object") {
        for (const key of [
            "detail",
            "message",
            "error",
            "non_field_errors",
        ]) {
            if (value[key]) {
                const message =
                    parseErrorValue(
                        value[key],
                        depth + 1
                    );

                if (message) {
                    return message;
                }
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
                const message =
                    parseErrorValue(
                        messages,
                        depth + 1
                    );

                return message
                    ? `${
                        FIELD_LABELS[key] || key
                    }: ${message}`
                    : "";
            })
            .filter(Boolean)
            .join("; ");
    }

    return "";
};

// =========================================================
// GET READABLE ERROR MESSAGE
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
//
// Supports:
// - Direct array
// - Paginated DRF response
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
//
// Latest starting date first.
// =========================================================

const sortRoadmaps = (items = []) => {
    return [...items].sort(
        (first, second) =>
            String(
                second?.started_at || ""
            ).localeCompare(
                String(
                    first?.started_at || ""
                )
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

const sameId = (first, second) => {
    return String(first) === String(second);
};

// =========================================================
// PROFILE ROADMAP
//
// Responsibilities:
//
// - Redux integration
// - Roadmap GET
// - Roadmap CREATE
// - Roadmap UPDATE
// - Roadmap DELETE
// - Like / Unlike
// - Owner permissions
// - Modal state
// - Request synchronization
//
// UI components are located inside ./roadmap/.
// =========================================================

const ProfileRoadmap = ({
    username,
}) => {
    // =====================================================
    // REDUX
    // =====================================================

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
    } = useSelector(
        selectRoadmapState
    );

    // =====================================================
    // AUTH
    // =====================================================

    const currentAuthUsername =
        useSelector(
            selectAuthUsername
        );

    // =====================================================
    // OWNER PERMISSION
    // =====================================================

    const isOwner = Boolean(
        username &&
        currentAuthUsername &&

        String(username).toLowerCase() ===
        String(currentAuthUsername).toLowerCase()
    );

    // =====================================================
    // CREATE / EDIT MODAL STATE
    // =====================================================

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

    // =====================================================
    // DELETE MODAL STATE
    // =====================================================

    const [
        isDeleteModalOpen,
        setIsDeleteModalOpen,
    ] = useState(false);

    const [
        deletingRoadmap,
        setDeletingRoadmap,
    ] = useState(null);

    // =====================================================
    // REFS
    //
    // mountedRef:
    // Prevents updates after unmount.
    //
    // fetchSequenceRef:
    // Ignores stale GET responses.
    //
    // loadedUsernameRef:
    // Prevents another profile's data from flashing.
    //
    // submittingRef / deletingRef / likingRef:
    // Prevent duplicate operations.
    // =====================================================

    const mountedRef = useRef(false);

    const currentUsernameRef =
        useRef(username);

    const fetchSequenceRef =
        useRef(0);

    const loadedUsernameRef =
        useRef(null);

    const submittingRef =
        useRef(false);

    const deletingRef =
        useRef(false);

    const likingRef =
        useRef(false);

    currentUsernameRef.current = username;

    // =====================================================
    // MOUNT / UNMOUNT
    // =====================================================

    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;

            fetchSequenceRef.current += 1;
        };
    }, []);

    // =====================================================
    // SAFE ROADMAPS
    //
    // Redux roadmap data is shared between profiles.
    //
    // Do not display data fetched for a different
    // username while the requested profile loads.
    // =====================================================

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

    // =====================================================
    // GET ROADMAPS
    //
    // RoadmapService.getRoadmap(username)
    //
    // The existing service does not accept AbortSignal.
    // Use request sequence to ignore stale responses.
    // =====================================================

    const getRoadmap = useCallback(
        async ({
            silent = false,
        } = {}) => {
            if (!username) {
                return [];
            }

            // =============================================
            // REQUEST SEQUENCE
            // =============================================

            const sequence =
                ++fetchSequenceRef.current;

            // =============================================
            // START LOADING
            // =============================================

            if (!silent) {
                dispatch(
                    getRoadMapStart()
                );
            }

            try {
                // =========================================
                // API GET
                // =========================================

                const response =
                    await RoadmapService.getRoadmap(
                        username
                    );

                const nextRoadmaps =
                    normalizeRoadmaps(response);

                // =========================================
                // IGNORE OLD RESPONSES
                // =========================================

                if (
                    !mountedRef.current ||

                    sequence !==
                        fetchSequenceRef.current ||

                    currentUsernameRef.current !==
                        username
                ) {
                    return [];
                }

                // =========================================
                // PROFILE DATA IS READY
                // =========================================

                loadedUsernameRef.current =
                    username;

                // =========================================
                // REDUX SUCCESS
                // =========================================

                dispatch(
                    getRoadMapSuccess(
                        nextRoadmaps
                    )
                );

                return nextRoadmaps;
            } catch (requestError) {
                // =========================================
                // IGNORE OLD REQUEST ERRORS
                // =========================================

                if (
                    !mountedRef.current ||

                    sequence !==
                        fetchSequenceRef.current ||

                    currentUsernameRef.current !==
                        username
                ) {
                    return [];
                }

                console.error(
                    "Roadmap olishda xato:",
                    requestError
                );

                // =========================================
                // REDUX ERROR
                // =========================================

                if (!silent) {
                    // Stop showing the skeleton after
                    // a failed initial request.

                    loadedUsernameRef.current =
                        username;

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

    // =====================================================
    // INITIAL LOAD / USERNAME CHANGE
    //
    // Reset visible modals when switching profiles.
    //
    // Increment sequence during cleanup to prevent
    // outdated requests from updating Redux.
    // =====================================================

    useEffect(() => {
        setIsFormModalOpen(false);

        setEditingRoadmap(null);

        setIsDeleteModalOpen(false);

        setDeletingRoadmap(null);

        // ================================================
        // NO USERNAME
        // ================================================

        if (!username) {
            loadedUsernameRef.current =
                username;

            dispatch(
                getRoadMapSuccess([])
            );

            return undefined;
        }

        // ================================================
        // GET CURRENT PROFILE
        // ================================================

        getRoadmap().catch(() => {
            // Error is already stored in Redux.
        });

        // ================================================
        // CLEANUP
        // ================================================

        return () => {
            fetchSequenceRef.current += 1;
        };
    }, [
        dispatch,
        getRoadmap,
        username,
    ]);

    // =====================================================
    // OPEN CREATE MODAL
    // =====================================================

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

    // =====================================================
    // OPEN EDIT MODAL
    // =====================================================

    const handleEditClick = (roadmap) => {
        if (!isOwner) {
            siteToast.warning(
                "Bu roadmapni tahrirlash huquqingiz yo‘q.",
                {
                    title: "Ruxsat yo‘q",
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

    // =====================================================
    // CLOSE CREATE / EDIT MODAL
    //
    // RoadmapCreateModal prevents manual closing
    // while processing.
    //
    // Do not block its success callback because
    // React may not have rerendered after the
    // parent's isFormSubmitting becomes false.
    // =====================================================

    const handleCloseFormModal = () => {
        setIsFormModalOpen(false);

        setEditingRoadmap(null);
    };

    // =====================================================
    // CREATE / UPDATE ROADMAP
    //
    // API:
    //
    // RoadmapService.createRoadmap(username, payload)
    //
    // RoadmapService.updateRoadmap(
    //     username,
    //     roadmapId,
    //     payload
    // )
    //
    // RoadmapCreateModal handles toast notifications.
    //
    // Do not duplicate create/update toasts here.
    // =====================================================

    const handleRoadmapSubmit = async (
        payload
    ) => {
        // =================================================
        // USERNAME
        // =================================================

        if (!username) {
            throw new Error(
                "Profil username topilmadi."
            );
        }

        // =================================================
        // OWNER
        // =================================================

        if (!isOwner) {
            throw new Error(
                "Faqat o‘z profilingizdagi roadmapni boshqarishingiz mumkin."
            );
        }

        // =================================================
        // DUPLICATE SUBMIT
        // =================================================

        if (submittingRef.current) {
            return false;
        }

        submittingRef.current = true;

        setIsFormSubmitting(true);

        const submittedUsername =
            username;

        const editingId =
            editingRoadmap?.id;

        try {
            // =============================================
            // UPDATE ROADMAP
            // =============================================

            if (isValidId(editingId)) {
                const response =
                    await RoadmapService.updateRoadmap(
                        submittedUsername,
                        editingId,
                        payload
                    );

                const updatedRoadmap =
                    response?.roadmap ||
                    response;

                // =========================================
                // UPDATE CURRENT PROFILE ONLY
                // =========================================

                if (
                    mountedRef.current &&
                    currentUsernameRef.current ===
                        submittedUsername
                ) {
                    if (
                        isValidId(
                            updatedRoadmap?.id
                        )
                    ) {
                        const nextRoadmaps =
                            safeRoadmaps.map(
                                (item) => {
                                    if (
                                        !sameId(
                                            item?.id,
                                            editingId
                                        )
                                    ) {
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
                                sortRoadmaps(
                                    nextRoadmaps
                                )
                            )
                        );
                    } else {
                        // Unexpected response format.
                        // Refresh from the server.

                        await getRoadmap({
                            silent: true,
                        });
                    }
                }

                return updatedRoadmap;
            }

            // =============================================
            // CREATE ROADMAP
            // =============================================

            const response =
                await RoadmapService.createRoadmap(
                    submittedUsername,
                    payload
                );

            const createdRoadmap =
                response?.roadmap ||
                response;

            // =============================================
            // UPDATE CURRENT PROFILE ONLY
            // =============================================

            if (
                mountedRef.current &&
                currentUsernameRef.current ===
                    submittedUsername
            ) {
                if (
                    isValidId(
                        createdRoadmap?.id
                    )
                ) {
                    // Avoid duplicate roadmap IDs.

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
                    // Unexpected response format.
                    // Refresh from the server.

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

            // The modal catches this error and
            // displays its existing siteToast.

            throw requestError;
        } finally {
            submittingRef.current = false;

            if (mountedRef.current) {
                setIsFormSubmitting(false);
            }
        }
    };

    // =====================================================
    // OPEN DELETE MODAL
    // =====================================================

    const handleDeleteClick = (roadmap) => {
        if (!isOwner) {
            siteToast.warning(
                "Bu roadmapni o‘chirish huquqingiz yo‘q.",
                {
                    title: "Ruxsat yo‘q",
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

    // =====================================================
    // CLOSE DELETE MODAL
    // =====================================================

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

    // =====================================================
    // CONFIRM DELETE
    //
    // Original DeleteConfirmationModal contract.
    //
    // API DELETE may return HTTP 204 with no body.
    // Send the known roadmap ID to Redux.
    // =====================================================

    const handleConfirmDelete = async () => {
        if (
            !isOwner ||
            !isValidId(deletingRoadmap?.id) ||
            deletingRef.current ||
            isDeleting
        ) {
            return;
        }

        deletingRef.current = true;

        const deletedId =
            deletingRoadmap.id;

        const deletedTitle =
            deletingRoadmap.title ||
            "Roadmap";

        const submittedUsername =
            username;

        // ================================================
        // REDUX START
        // ================================================

        dispatch(
            deleteRoadMapStart()
        );

        // ================================================
        // LOADING TOAST
        // ================================================

        const toastId = siteToast.loading(
            `"${deletedTitle}" roadmap o‘chirilmoqda...`,
            {
                title:
                    "Roadmap o‘chirilmoqda",
            }
        );

        try {
            // ============================================
            // API DELETE
            // ============================================

            await RoadmapService.deleteRoadmap(
                submittedUsername,
                deletedId
            );

            // ============================================
            // REDUX SUCCESS
            // ============================================

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

            // ============================================
            // SUCCESS TOAST
            // ============================================

            siteToast.success(
                "Roadmap muvaffaqiyatli o‘chirildi.",
                {
                    id: toastId,
                    title:
                        "Roadmap o‘chirildi",
                    duration: 3200,
                }
            );
        } catch (requestError) {
            console.error(
                "Roadmap o‘chirishda xato:",
                requestError
            );

            const message = getErrorMessage(
                requestError,
                "Roadmapni o‘chirishda xato yuz berdi."
            );

            // ============================================
            // REDUX ERROR
            // ============================================

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

            // ============================================
            // ERROR TOAST
            // ============================================

            siteToast.error(
                message,
                {
                    id: toastId,
                    title:
                        "Roadmap o‘chirilmadi",
                    duration: 5000,
                }
            );
        } finally {
            deletingRef.current = false;
        }
    };

    // =====================================================
    // LIKE / UNLIKE ROADMAP
    //
    // Existing behavior:
    //
    // 1. Check authentication
    // 2. Prevent duplicate requests
    // 3. Optimistically update Redux
    // 4. POST to backend
    // 5. Sync response
    // 6. Rollback on error
    // =====================================================

    const handleToggleLike = async (
        roadmap
    ) => {
        // =================================================
        // VALID ROADMAP
        // =================================================

        if (
            !isValidId(
                roadmap?.id
            )
        ) {
            return;
        }

        // =================================================
        // AUTH
        // =================================================

        if (!currentAuthUsername) {
            siteToast.warning(
                "Roadmapni yoqtirish uchun avval tizimga kiring.",
                {
                    title:
                        "Kirish talab qilinadi",
                    duration: 3500,
                }
            );

            return;
        }

        // =================================================
        // BUSY STATE
        // =================================================

        if (
            likingRef.current ||
            isLiking ||
            deletingRef.current ||
            isDeleting ||
            roadmap_isLoading
        ) {
            return;
        }

        const roadmapId =
            roadmap.id;

        const submittedUsername =
            username;

        likingRef.current = true;

        // =================================================
        // OLD VALUES
        // =================================================

        const oldIsLiked = Boolean(
            roadmap.is_liked
        );

        const oldLikeCountRaw = Number(
            roadmap.like_count ?? 0
        );

        const oldLikeCount =
            Number.isFinite(
                oldLikeCountRaw
            )
                ? Math.max(
                    0,
                    oldLikeCountRaw
                )
                : 0;

        // =================================================
        // NEXT VALUES
        // =================================================

        const nextIsLiked =
            !oldIsLiked;

        const nextLikeCount = Math.max(
            0,
            oldLikeCount +
                (nextIsLiked ? 1 : -1)
        );

        // =================================================
        // REDUX START
        // =================================================

        dispatch(
            toggleLikeRoadmapStart(
                roadmapId
            )
        );

        // =================================================
        // OPTIMISTIC UPDATE
        // =================================================

        dispatch(
            updateRoadmapLocal({
                id: roadmapId,

                changes: {
                    is_liked:
                        nextIsLiked,

                    like_count:
                        nextLikeCount,
                },
            })
        );

        try {
            // =============================================
            // API REQUEST
            // =============================================

            const response =
                await RoadmapService.toggleLikeRoadmap(
                    roadmapId
                );

            // =============================================
            // IGNORE OLD PROFILE RESPONSE
            // =============================================

            if (
                !mountedRef.current ||
                currentUsernameRef.current !==
                    submittedUsername
            ) {
                return;
            }

            // =============================================
            // NORMALIZE COUNTER
            // =============================================

            const returnedCount = Number(
                response?.like_count ??
                nextLikeCount
            );

            // =============================================
            // REDUX SUCCESS
            // =============================================

            dispatch(
                toggleLikeRoadmapSuccess({
                    ...response,

                    id:
                        response?.id ??
                        roadmapId,

                    is_liked:
                        typeof response?.is_liked ===
                        "boolean"
                            ? response.is_liked
                            : nextIsLiked,

                    like_count:
                        Number.isFinite(
                            returnedCount
                        )
                            ? Math.max(
                                0,
                                returnedCount
                            )
                            : nextLikeCount,
                })
            );

            // Like success toast intentionally omitted.
        } catch (requestError) {
            console.error(
                "Roadmap like bosishda xato:",
                requestError
            );

            const message = getErrorMessage(
                requestError,
                "Roadmapni yoqtirishda xato yuz berdi."
            );

            // =============================================
            // ROLLBACK
            // =============================================

            if (
                mountedRef.current &&
                currentUsernameRef.current ===
                    submittedUsername
            ) {
                dispatch(
                    updateRoadmapLocal({
                        id: roadmapId,

                        changes: {
                            is_liked:
                                oldIsLiked,

                            like_count:
                                oldLikeCount,
                        },
                    })
                );

                dispatch(
                    toggleLikeRoadmapFailure(
                        message
                    )
                );

                // =========================================
                // ERROR TOAST
                // =========================================

                siteToast.error(
                    message,
                    {
                        title:
                            "Like amalga oshmadi",
                        duration: 4200,
                    }
                );
            }
        } finally {
            likingRef.current = false;
        }
    };

    // =====================================================
    // RETRY
    //
    // ProfileRoadmapHeader and ProfileRoadmapError
    // use the same callback.
    // =====================================================

    const handleRetry = () => {
        getRoadmap().catch(() => {
            // Redux error will be displayed.
        });
    };

    // =====================================================
    // DISPLAY STATE
    //
    // Always render modals outside conditional states.
    //
    // This prevents losing an active modal when a
    // background fetch changes the loading state.
    // =====================================================

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

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div
            id="roadmap"
            className="
                min-w-0
                space-y-5
            "
        >
            {/* =========================================
                CONTENT STATES
            ========================================== */}

            {showSkeleton ? (
                // =====================================
                // LOADING SKELETON
                // =====================================

                <ProfileRoadmapSkeleton
                    isOwner={isOwner}
                />
            ) : showFullError ? (
                // =====================================
                // FULL FETCH ERROR
                // =====================================

                <ProfileRoadmapError
                    variant="fetch"
                    error={roadmap_error}
                    onRetry={handleRetry}
                    isLoading={
                        roadmap_isLoading
                    }
                />
            ) : (
                <>
                    {/* =============================
                        1. HEADER
                    ============================== */}

                    <ProfileRoadmapHeader
                        roadmaps={safeRoadmaps}
                        isOwner={isOwner}
                        isLoading={
                            roadmap_isLoading
                        }
                        onRefresh={handleRetry}
                        onCreate={
                            handleCreateClick
                        }
                    />

                    {/* =============================
                        2. FETCH ERROR
                        WITH EXISTING DATA
                    ============================== */}

                    {roadmap_error &&
                        safeRoadmaps.length > 0 && (
                            <ProfileRoadmapError
                                variant="action"
                                error={roadmap_error}
                            />
                        )}

                    {/* =============================
                        3. DELETE ERROR
                    ============================== */}

                    {deleteError && (
                        <ProfileRoadmapError
                            variant="action"
                            error={deleteError}
                        />
                    )}

                    {/* =============================
                        4. LIKE ERROR
                    ============================== */}

                    {likeError && (
                        <ProfileRoadmapError
                            variant="action"
                            error={likeError}
                        />
                    )}

                    {/* =============================
                        5. EMPTY STATE
                    ============================== */}

                    {safeRoadmaps.length === 0 ? (
                        <ProfileRoadmapEmpty
                            isOwner={isOwner}
                            onCreate={
                                handleCreateClick
                            }
                        />
                    ) : (
                        // =========================
                        // 6. TIMELINE
                        // =========================

                        <ProfileRoadmapTimeline
                            roadmaps={safeRoadmaps}
                            isOwner={isOwner}
                            isLiking={isLiking}
                            likingRoadmapId={
                                likingRoadmapId
                            }
                            onEdit={
                                handleEditClick
                            }
                            onDelete={
                                handleDeleteClick
                            }
                            onToggleLike={
                                handleToggleLike
                            }
                        />
                    )}
                </>
            )}

            {/* =========================================
                CREATE / EDIT MODAL

                New location:
                ./roadmap/RoadmapCreateModal.jsx

                Kept mounted across:
                - Loading
                - Empty
                - Fetch error
                - Timeline
            ========================================== */}

            <RoadmapCreateModal
                isOpen={
                    isFormModalOpen
                }
                onClose={
                    handleCloseFormModal
                }
                onSubmit={
                    handleRoadmapSubmit
                }
                initialData={
                    editingRoadmap
                }
                isSubmitting={
                    isFormSubmitting
                }
            />

            {/* =========================================
                DELETE CONFIRMATION MODAL
            ========================================== */}

            <DeleteConfirmationModal
                isOpen={
                    isDeleteModalOpen
                }
                onClose={
                    handleCloseDeleteModal
                }
                onConfirm={
                    handleConfirmDelete
                }
                itemTitle={
                    deletingRoadmap?.title ||
                    ""
                }
                isProcessing={
                    isDeleting
                }
            />

            {/* =========================================
                DELETE PROCESS OVERLAY
            ========================================== */}

            {isDeleting && (
                <div
                    role="status"
                    aria-live="polite"
                    className="
                        fixed
                        inset-0
                        z-[90]

                        flex
                        items-center
                        justify-center

                        bg-black/65

                        p-4

                        backdrop-blur-sm
                    "
                >
                    <div
                        className="
                            relative
                            w-full
                            max-w-sm

                            overflow-hidden

                            rounded-2xl
                            border

                            border-slate-200
                            bg-white

                            px-6
                            py-5

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
                                absolute

                                -right-10
                                -top-10

                                h-24
                                w-24

                                rounded-full

                                bg-indigo-500/10
                                blur-[35px]
                            "
                        />

                        {/* CONTENT */}

                        <div
                            className="
                                relative
                                z-10

                                flex
                                items-center
                                gap-3
                            "
                        >
                            {/* LOADING ICON */}

                            <span
                                className="
                                    flex
                                    h-10
                                    w-10
                                    shrink-0

                                    items-center
                                    justify-center

                                    rounded-xl
                                    border

                                    border-indigo-200
                                    bg-indigo-50

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
                                        text-sm
                                        font-black

                                        text-slate-900
                                        dark:text-white
                                    "
                                >
                                    Roadmap o‘chirilmoqda
                                </p>

                                <p
                                    className="
                                        mt-0.5

                                        truncate

                                        text-[11px]
                                        font-medium

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

// =========================================================
// EXPORT
// =========================================================

export default ProfileRoadmap;
