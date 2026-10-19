
import { createSlice } from "@reduxjs/toolkit";

// =========================================================
// CONSTANTS
// =========================================================

// Profile projects pagination.
// Backend ProfileProjectPagination.page_size = 4.
//
// Global Projects pagination is handled separately
// and is not changed by this constant.

export const PROFILE_PROJECT_PAGE_SIZE = 4;

// =========================================================
// DEFAULT PROFILE PROJECT STATS
// =========================================================

const DEFAULT_PROJECT_STATS = {
    total: 0,
    stars: 0,
    views: 0,
    comments: 0,
};

// =========================================================
// INITIAL STATE
// =========================================================

const initialState = {
    // =====================================================
    // PROJECT LIST
    // =====================================================

    project_isLoading: false,

    projects: [],

    project_error: null,

    // =====================================================
    // PROJECT PAGINATION
    //
    // projectCount:
    //   Total number of matching projects.
    //
    // projectNext:
    //   URL of next page.
    //
    // projectPrevious:
    //   URL of previous page.
    //
    // projectPage:
    //   Current page.
    //
    // projectPageSize:
    //   Maximum number of visible projects.
    //
    // projectSearch:
    //   Current server search query.
    //
    // projectHasPagination:
    //   Whether the list uses paginated API results.
    // =====================================================

    projectCount: 0,

    projectNext: null,

    projectPrevious: null,

    projectPage: 1,

    projectPageSize: PROFILE_PROJECT_PAGE_SIZE,

    projectSearch: "",

    projectHasPagination: false,

    // =====================================================
    // COMPLETE PROFILE PROJECT STATISTICS
    //
    // Independent of:
    // - Current page
    // - Search query
    // - Number of visible project cards
    // =====================================================

    projectStats: {
        ...DEFAULT_PROJECT_STATS,
    },

    // =====================================================
    // PROJECT DETAIL
    // =====================================================

    projectDetail: null,

    projectDetailIsLoading: false,

    projectDetailError: null,

    // =====================================================
    // PROJECT COMMENTS
    // =====================================================

    project_comment_isLoading: false,

    projectComments: [],

    project_comment_error: null,

    // =====================================================
    // COLLABORATION REQUESTS
    // =====================================================

    collaborationRequestIsLoading: false,

    collaborationRequests: [],

    collaborationRequestError: null,

    isCollaborationActionLoading: false,

    // =====================================================
    // PROJECT COLLABORATORS
    // =====================================================

    collaboratorsIsLoading: false,

    collaborators: [],

    collaboratorsError: null,

    // =====================================================
    // PROJECT STAR
    // =====================================================

    isProjectStarLoading: false,

    projectStarError: null,
};

// =========================================================
// HELPERS
// =========================================================

// =========================================================
// SAFE NUMBER
//
// Converts numeric input to a finite number.
// Returns fallback for null, undefined, empty strings,
// NaN or Infinity.
// =========================================================

const safeNumber = (
    value,
    fallback = 0
) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return fallback;
    }

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
};

// =========================================================
// SAFE NON-NEGATIVE NUMBER
// =========================================================

const safeNonNegativeNumber = (
    value,
    fallback = 0
) => {
    return Math.max(
        0,
        safeNumber(value, fallback)
    );
};

// =========================================================
// SAFE PAGE NUMBER
//
// Only positive integers are accepted.
// =========================================================

const safePageNumber = (
    value,
    fallback = 1
) => {
    const page = Number(value);

    if (
        !Number.isSafeInteger(page) ||
        page < 1
    ) {
        return fallback;
    }

    return page;
};

// =========================================================
// COMPARE IDS
//
// Supports:
// - Numeric IDs
// - String IDs
//
// Prevents invalid null/undefined comparisons.
// =========================================================

const isSameId = (
    left,
    right
) => {
    if (
        left === null ||
        left === undefined ||
        right === null ||
        right === undefined
    ) {
        return false;
    }

    return String(left) === String(right);
};

// =========================================================
// NORMALIZE PROFILE PROJECT STATS
//
// Backend:
// {
//     stats: {
//         total: 10,
//         stars: 25,
//         views: 100,
//         comments: 15
//     }
// }
//
// Statistics include ALL profile projects.
// =========================================================

const normalizeProjectStats = (
    stats,
    fallbackTotal = 0
) => {
    const source =
        stats &&
        typeof stats === "object" &&
        !Array.isArray(stats)
            ? stats
            : {};

    return {
        total: safeNonNegativeNumber(
            source.total,
            fallbackTotal
        ),

        stars: safeNonNegativeNumber(
            source.stars,
            0
        ),

        views: safeNonNegativeNumber(
            source.views,
            0
        ),

        comments: safeNonNegativeNumber(
            source.comments,
            0
        ),
    };
};

// =========================================================
// RESET PROJECT PAGINATION VALUES
//
// Used when the API returns an invalid response.
// =========================================================

const resetProjectPagination = (state) => {
    state.projectCount = 0;

    state.projectNext = null;

    state.projectPrevious = null;

    state.projectPage = 1;

    state.projectPageSize =
        PROFILE_PROJECT_PAGE_SIZE;

    state.projectSearch = "";

    state.projectHasPagination = false;

    state.projectStats = {
        ...DEFAULT_PROJECT_STATS,
    };
};

// =========================================================
// PROJECT SLICE
// =========================================================

export const projectSlice = createSlice({
    name: "project",

    initialState,

    reducers: {
        // =================================================
        // PROJECT LIST START
        //
        // Triggered before fetching projects.
        //
        // Handles:
        // - Initial profile load
        // - Browser refresh
        // - Page navigation
        // - Search
        // - Refresh after project creation
        //
        // project_isLoading is used by skeleton UI.
        // =================================================

        getProjectStart: (state) => {
            state.project_isLoading = true;

            state.project_error = null;
        },

        // =================================================
        // PROJECT LIST SUCCESS
        //
        // Supports:
        //
        // 1. Legacy array:
        //
        // [
        //     { id: 1 },
        //     { id: 2 }
        // ]
        //
        // 2. Paginated response:
        //
        // {
        //     count: 10,
        //     next: "...",
        //     previous: null,
        //     results: [...],
        //     stats: {
        //         total: 10,
        //         stars: 50,
        //         views: 100,
        //         comments: 20
        //     },
        //     page: 1,
        //     pageSize: 4,
        //     search: ""
        // }
        //
        // IMPORTANT:
        // Do not lose pagination metadata.
        // =================================================

        getProjectSuccess: (
            state,
            action
        ) => {
            state.project_isLoading = false;

            state.project_error = null;

            const payload = action.payload;

            // =============================================
            // LEGACY SIMPLE ARRAY
            //
            // Existing consumers remain supported.
            // =============================================

            if (Array.isArray(payload)) {
                state.projects = payload;

                state.projectCount =
                    payload.length;

                state.projectNext = null;

                state.projectPrevious = null;

                state.projectPage = 1;

                state.projectPageSize =
                    PROFILE_PROJECT_PAGE_SIZE;

                state.projectSearch = "";

                state.projectHasPagination =
                    false;

                state.projectStats =
                    normalizeProjectStats(
                        null,
                        payload.length
                    );

                return;
            }

            // =============================================
            // PAGINATED API RESPONSE
            // =============================================

            if (
                payload &&
                typeof payload === "object" &&
                Array.isArray(payload.results)
            ) {
                const results =
                    payload.results;

                // =========================================
                // TOTAL MATCHING RESULTS
                // =========================================

                const count =
                    safeNonNegativeNumber(
                        payload.count,
                        results.length
                    );

                // =========================================
                // CURRENT PAGE RESULTS
                // =========================================

                state.projects = results;

                // =========================================
                // PAGINATION METADATA
                // =========================================

                state.projectCount = count;

                state.projectNext =
                    payload.next ?? null;

                state.projectPrevious =
                    payload.previous ?? null;

                state.projectPage =
                    safePageNumber(
                        payload.page,
                        1
                    );

                state.projectPageSize =
                    PROFILE_PROJECT_PAGE_SIZE;

                state.projectSearch =
                    String(
                        payload.search ?? ""
                    );

                state.projectHasPagination =
                    true;

                // =========================================
                // COMPLETE PROFILE STATS
                //
                // Profile stats must not be calculated
                // from only the current 4 projects.
                // =========================================

                state.projectStats =
                    normalizeProjectStats(
                        payload.stats,
                        count
                    );

                return;
            }

            // =============================================
            // INVALID / EMPTY RESPONSE
            // =============================================

            state.projects = [];

            resetProjectPagination(state);
        },

        // =================================================
        // PROJECT LIST FAILURE
        //
        // Stop skeleton and display error.
        // =================================================

        getProjectFailure: (
            state,
            action
        ) => {
            state.project_isLoading = false;

            state.project_error =
                action.payload ||
                "Projectlarni olishda xatolik yuz berdi.";
        },

        // =================================================
        // ADD PROJECT
        //
        // Original behavior:
        // - Add new project to list
        // - Prevent duplicates
        // - Update count
        //
        // Pagination behavior:
        // - Only insert into unfiltered page 1
        // - Maximum 4 project cards
        // - Do not insert into page 2+
        // - Filtered results are refreshed by API
        //
        // ProfileProjects should refetch page 1 after
        // successful creation for authoritative data.
        // =================================================

        addProjectSuccess: (
            state,
            action
        ) => {
            const project = action.payload;

            if (
                !project ||
                project.id === null ||
                project.id === undefined
            ) {
                return;
            }

            // =============================================
            // DUPLICATE PROTECTION
            // =============================================

            const exists =
                state.projects.some(
                    (item) =>
                        isSameId(
                            item.id,
                            project.id
                        )
                );

            if (exists) {
                return;
            }

            // =============================================
            // PAGINATED LIST
            // =============================================

            if (state.projectHasPagination) {
                const isFirstPage =
                    state.projectPage === 1;

                const hasSearch =
                    Boolean(
                        state.projectSearch.trim()
                    );

                // =========================================
                // UNFILTERED FIRST PAGE
                // =========================================

                if (
                    isFirstPage &&
                    !hasSearch
                ) {
                    state.projects.unshift(
                        project
                    );

                    state.projects =
                        state.projects.slice(
                            0,
                            PROFILE_PROJECT_PAGE_SIZE
                        );
                }

                // The total project count for an active
                // search cannot be determined here.
                // Search must be refetched from backend.

                if (!hasSearch) {
                    state.projectCount += 1;
                }

                state.projectStats.total += 1;

                return;
            }

            // =============================================
            // LEGACY NON-PAGINATED LIST
            // =============================================

            state.projects.unshift(project);

            state.projectCount += 1;

            state.projectStats.total += 1;
        },

        // =================================================
        // UPDATE PROJECT
        //
        // Original:
        // - Update project inside current list
        // - Update projectDetail when matching
        //
        // Pagination metadata remains unchanged.
        // =================================================

        updateProjectSuccess: (
            state,
            action
        ) => {
            const project = action.payload;

            if (
                !project ||
                project.id === null ||
                project.id === undefined
            ) {
                return;
            }

            // =============================================
            // UPDATE PROJECT LIST
            // =============================================

            const index =
                state.projects.findIndex(
                    (item) =>
                        isSameId(
                            item.id,
                            project.id
                        )
                );

            if (index !== -1) {
                state.projects[index] = {
                    ...state.projects[index],
                    ...project,
                };
            }

            // =============================================
            // UPDATE PROJECT DETAIL
            // =============================================

            if (
                state.projectDetail &&
                isSameId(
                    state.projectDetail.id,
                    project.id
                )
            ) {
                state.projectDetail = {
                    ...state.projectDetail,
                    ...project,
                };
            }
        },

        // =================================================
        // DELETE PROJECT
        //
        // Original:
        // - Remove project from current list
        // - Update count
        // - Clear matching detail
        //
        // Pagination:
        // - Do not produce negative counts
        // - Refetch after delete to fill current page
        // =================================================

        deleteProjectSuccess: (
            state,
            action
        ) => {
            const projectId =
                action.payload;

            // =============================================
            // BEFORE DELETE
            // =============================================

            const beforeLength =
                state.projects.length;

            // =============================================
            // REMOVE PROJECT FROM LIST
            // =============================================

            state.projects =
                state.projects.filter(
                    (project) =>
                        !isSameId(
                            project.id,
                            projectId
                        )
                );

            // =============================================
            // WAS PROJECT REMOVED?
            // =============================================

            const removed =
                state.projects.length <
                beforeLength;

            // =============================================
            // MATCHING PROJECT DETAIL
            // =============================================

            const wasDetailProject =
                state.projectDetail &&
                isSameId(
                    state.projectDetail.id,
                    projectId
                );

            // =============================================
            // UPDATE COUNTS
            //
            // Only decrement visible matching results
            // when a record was removed from the list.
            //
            // Profile stats are refreshed from backend
            // after deletion.
            // =============================================

            if (removed) {
                state.projectCount =
                    Math.max(
                        0,
                        state.projectCount - 1
                    );

                state.projectStats.total =
                    Math.max(
                        0,
                        state.projectStats.total - 1
                    );
            }

            // =============================================
            // CLEAR DETAIL
            // =============================================

            if (wasDetailProject) {
                state.projectDetail = null;
            }
        },

        // =================================================
        // PROJECT DETAIL START
        // =================================================

        getProjectDetailStart: (
            state
        ) => {
            state.projectDetailIsLoading =
                true;

            state.projectDetailError =
                null;
        },

        // =================================================
        // PROJECT DETAIL SUCCESS
        // =================================================

        getProjectDetailSuccess: (
            state,
            action
        ) => {
            state.projectDetailIsLoading =
                false;

            state.projectDetail =
                action.payload;

            state.projectDetailError =
                null;
        },

        // =================================================
        // PROJECT DETAIL FAILURE
        // =================================================

        getProjectDetailFailure: (
            state,
            action
        ) => {
            state.projectDetailIsLoading =
                false;

            state.projectDetailError =
                action.payload ||
                "Project ma’lumotlarini olishda xatolik yuz berdi.";
        },

        // =================================================
        // CLEAR PROJECT DETAIL
        // =================================================

        clearProjectDetail: (
            state
        ) => {
            state.projectDetail = null;

            state.projectDetailError = null;

            state.projectDetailIsLoading = false;
        },

        // =================================================
        // PROJECT COMMENTS START
        // =================================================

        getProjectCommentStart: (
            state
        ) => {
            state.project_comment_isLoading =
                true;

            state.project_comment_error =
                null;
        },

        // =================================================
        // PROJECT COMMENTS SUCCESS
        // =================================================

        getProjectCommentSuccess: (
            state,
            action
        ) => {
            state.project_comment_isLoading =
                false;

            state.projectComments =
                Array.isArray(
                    action.payload
                )
                    ? action.payload
                    : [];

            state.project_comment_error =
                null;
        },

        // =================================================
        // PROJECT COMMENTS FAILURE
        // =================================================

        getProjectCommentFailure: (
            state,
            action
        ) => {
            state.project_comment_isLoading =
                false;

            state.project_comment_error =
                action.payload ||
                "Commentlarni olishda xatolik yuz berdi.";
        },

        // =================================================
        // ADD COMMENT
        //
        // Keep existing projectDetail.comments_count
        // update behavior.
        // =================================================

        addProjectCommentSuccess: (
            state,
            action
        ) => {
            const comment =
                action.payload;

            if (
                !comment ||
                comment.id === null ||
                comment.id === undefined
            ) {
                return;
            }

            // =============================================
            // ADD COMMENT
            // =============================================

            state.projectComments.unshift(
                comment
            );

            // =============================================
            // UPDATE PROJECT DETAIL COUNT
            // =============================================

            if (state.projectDetail) {
                state.projectDetail
                    .comments_count =
                    safeNumber(
                        state.projectDetail
                            .comments_count
                    ) + 1;
            }
        },

        // =================================================
        // UPDATE COMMENT
        // =================================================

        updateProjectCommentSuccess: (
            state,
            action
        ) => {
            const comment =
                action.payload;

            if (
                !comment ||
                comment.id === null ||
                comment.id === undefined
            ) {
                return;
            }

            // =============================================
            // FIND COMMENT
            // =============================================

            const index =
                state.projectComments.findIndex(
                    (item) =>
                        isSameId(
                            item.id,
                            comment.id
                        )
                );

            // =============================================
            // UPDATE COMMENT
            // =============================================

            if (index !== -1) {
                state.projectComments[index] = {
                    ...state.projectComments[index],
                    ...comment,
                };
            }
        },

        // =================================================
        // DELETE COMMENT
        //
        // Keep original projectDetail count update.
        // =================================================

        deleteProjectCommentSuccess: (
            state,
            action
        ) => {
            const commentId =
                action.payload;

            // =============================================
            // PREVIOUS COUNT
            // =============================================

            const oldLength =
                state.projectComments.length;

            // =============================================
            // FILTER
            // =============================================

            state.projectComments =
                state.projectComments.filter(
                    (comment) =>
                        !isSameId(
                            comment.id,
                            commentId
                        )
                );

            // =============================================
            // REMOVED?
            // =============================================

            const removed =
                state.projectComments.length <
                oldLength;

            // =============================================
            // UPDATE DETAIL COUNT
            // =============================================

            if (
                removed &&
                state.projectDetail
            ) {
                state.projectDetail
                    .comments_count =
                    Math.max(
                        0,
                        safeNumber(
                            state.projectDetail
                                .comments_count
                        ) - 1
                    );
            }
        },

        // =================================================
        // COLLABORATION REQUEST LIST START
        // =================================================

        getCollaborationRequestsStart: (
            state
        ) => {
            state.collaborationRequestIsLoading =
                true;

            state.collaborationRequestError =
                null;
        },

        // =================================================
        // COLLABORATION REQUEST LIST SUCCESS
        // =================================================

        getCollaborationRequestsSuccess: (
            state,
            action
        ) => {
            state.collaborationRequestIsLoading =
                false;

            state.collaborationRequests =
                Array.isArray(
                    action.payload
                )
                    ? action.payload
                    : [];

            state.collaborationRequestError =
                null;
        },

        // =================================================
        // COLLABORATION REQUEST LIST FAILURE
        // =================================================

        getCollaborationRequestsFailure: (
            state,
            action
        ) => {
            state.collaborationRequestIsLoading =
                false;

            state.collaborationRequestError =
                action.payload ||
                "Hamkorlik so‘rovlarini olishda xatolik yuz berdi.";
        },

        // =================================================
        // COLLABORATION ACTION START
        // =================================================

        collaborationActionStart: (
            state
        ) => {
            state.isCollaborationActionLoading =
                true;

            state.collaborationRequestError =
                null;
        },

        // =================================================
        // COLLABORATION ACTION SUCCESS
        // =================================================

        collaborationActionSuccess: (
            state
        ) => {
            state.isCollaborationActionLoading =
                false;

            state.collaborationRequestError =
                null;
        },

        // =================================================
        // COLLABORATION ACTION FAILURE
        // =================================================

        collaborationActionFailure: (
            state,
            action
        ) => {
            state.isCollaborationActionLoading =
                false;

            state.collaborationRequestError =
                action.payload ||
                "Hamkorlik amalida xatolik yuz berdi.";
        },

        // =================================================
        // ADD COLLABORATION REQUEST
        //
        // Original duplicate protection preserved.
        // =================================================

        addCollaborationRequestSuccess: (
            state,
            action
        ) => {
            state.isCollaborationActionLoading =
                false;

            state.collaborationRequestError =
                null;

            const request =
                action.payload;

            if (
                !request ||
                request.id === null ||
                request.id === undefined
            ) {
                return;
            }

            // =============================================
            // CHECK DUPLICATES
            // =============================================

            const exists =
                state.collaborationRequests.some(
                    (item) =>
                        isSameId(
                            item.id,
                            request.id
                        )
                );

            // =============================================
            // INSERT REQUEST
            // =============================================

            if (!exists) {
                state.collaborationRequests.unshift(
                    request
                );
            }
        },

        // =================================================
        // UPDATE COLLABORATION REQUEST
        // =================================================

        updateCollaborationRequestSuccess: (
            state,
            action
        ) => {
            state.isCollaborationActionLoading =
                false;

            state.collaborationRequestError =
                null;

            const updatedRequest =
                action.payload;

            if (
                !updatedRequest ||
                updatedRequest.id === null ||
                updatedRequest.id === undefined
            ) {
                return;
            }

            // =============================================
            // FIND REQUEST
            // =============================================

            const index =
                state.collaborationRequests
                    .findIndex(
                        (item) =>
                            isSameId(
                                item.id,
                                updatedRequest.id
                            )
                    );

            // =============================================
            // UPDATE REQUEST
            // =============================================

            if (index !== -1) {
                state.collaborationRequests[
                    index
                ] = {
                    ...state.collaborationRequests[
                        index
                    ],
                    ...updatedRequest,
                };
            }
        },

        // =================================================
        // DELETE COLLABORATION REQUEST
        // =================================================

        deleteCollaborationRequestSuccess: (
            state,
            action
        ) => {
            state.isCollaborationActionLoading =
                false;

            state.collaborationRequestError =
                null;

            const requestId =
                action.payload;

            state.collaborationRequests =
                state.collaborationRequests.filter(
                    (item) =>
                        !isSameId(
                            item.id,
                            requestId
                        )
                );
        },

        // =================================================
        // COLLABORATORS START
        // =================================================

        getCollaboratorsStart: (
            state
        ) => {
            state.collaboratorsIsLoading =
                true;

            state.collaboratorsError =
                null;
        },

        // =================================================
        // COLLABORATORS SUCCESS
        // =================================================

        getCollaboratorsSuccess: (
            state,
            action
        ) => {
            state.collaboratorsIsLoading =
                false;

            state.collaborators =
                Array.isArray(
                    action.payload
                )
                    ? action.payload
                    : [];

            state.collaboratorsError =
                null;
        },

        // =================================================
        // COLLABORATORS FAILURE
        // =================================================

        getCollaboratorsFailure: (
            state,
            action
        ) => {
            state.collaboratorsIsLoading =
                false;

            state.collaboratorsError =
                action.payload ||
                "Hamkorlarni olishda xatolik yuz berdi.";
        },

        // =================================================
        // PROJECT STAR START
        // =================================================

        projectStarStart: (
            state
        ) => {
            state.isProjectStarLoading =
                true;

            state.projectStarError =
                null;
        },

        // =================================================
        // PROJECT STAR SUCCESS
        //
        // Original behavior:
        //
        // - Update project detail star count
        // - Update project detail starred status
        // - Update current project list
        //
        // New:
        //
        // Profile aggregate stats are not guessed
        // from a single toggle response.
        //
        // Authoritative stats come from next profile GET.
        // =================================================

        projectStarSuccess: (
            state,
            action
        ) => {
            state.isProjectStarLoading =
                false;

            state.projectStarError =
                null;

            const payload =
                action.payload || {};

            // =============================================
            // PROJECT ID
            // =============================================

            const rawProjectId =
                payload.projectId ??
                payload.project_id;

            if (
                rawProjectId === null ||
                rawProjectId === undefined ||
                rawProjectId === ""
            ) {
                return;
            }

            const projectId =
                Number(rawProjectId);

            if (
                !Number.isFinite(
                    projectId
                )
            ) {
                return;
            }

            // =============================================
            // STAR DATA
            // =============================================

            const starsCount =
                safeNonNegativeNumber(
                    payload.stars_count
                );

            const isStarred =
                Boolean(
                    payload
                        .is_starred_by_user
                );

            // =============================================
            // DETAIL
            // =============================================

            if (
                state.projectDetail &&
                isSameId(
                    state.projectDetail.id,
                    projectId
                )
            ) {
                state.projectDetail
                    .stars_count =
                    starsCount;

                state.projectDetail
                    .is_starred_by_user =
                    isStarred;
            }

            // =============================================
            // CURRENT PROJECT LIST
            // =============================================

            const project =
                state.projects.find(
                    (item) =>
                        isSameId(
                            item.id,
                            projectId
                        )
                );

            if (project) {
                project.stars_count =
                    starsCount;

                project.is_starred_by_user =
                    isStarred;
            }
        },

        // =================================================
        // PROJECT STAR FAILURE
        // =================================================

        projectStarFailure: (
            state,
            action
        ) => {
            state.isProjectStarLoading =
                false;

            state.projectStarError =
                action.payload ||
                "Projectga star berishda xatolik yuz berdi.";
        },

        // =================================================
        // CLEAR ERRORS
        //
        // Original error cleanup preserved.
        // =================================================

        clearProjectError: (
            state
        ) => {
            state.project_error =
                null;

            state.projectDetailError =
                null;

            state.project_comment_error =
                null;

            state.collaborationRequestError =
                null;

            state.collaboratorsError =
                null;

            state.projectStarError =
                null;
        },

        // =================================================
        // RESET PROJECT STORE
        //
        // Return a fresh copy of the initial state.
        //
        // Includes all pagination and stats fields.
        // =================================================

        resetProjectState: () => ({
            ...initialState,

            projects: [],

            projectStats: {
                ...DEFAULT_PROJECT_STATS,
            },

            projectComments: [],

            collaborationRequests: [],

            collaborators: [],
        }),
    },
});

// =========================================================
// ACTIONS
//
// All existing action exports are preserved.
// =========================================================

export const {
    // =====================================================
    // PROJECT LIST
    // =====================================================

    getProjectStart,

    getProjectSuccess,

    getProjectFailure,

    addProjectSuccess,

    updateProjectSuccess,

    deleteProjectSuccess,

    // =====================================================
    // PROJECT DETAIL
    // =====================================================

    getProjectDetailStart,

    getProjectDetailSuccess,

    getProjectDetailFailure,

    clearProjectDetail,

    // =====================================================
    // COMMENTS
    // =====================================================

    getProjectCommentStart,

    getProjectCommentSuccess,

    getProjectCommentFailure,

    addProjectCommentSuccess,

    updateProjectCommentSuccess,

    deleteProjectCommentSuccess,

    // =====================================================
    // COLLABORATION
    // =====================================================

    getCollaborationRequestsStart,

    getCollaborationRequestsSuccess,

    getCollaborationRequestsFailure,

    collaborationActionStart,

    collaborationActionSuccess,

    collaborationActionFailure,

    addCollaborationRequestSuccess,

    updateCollaborationRequestSuccess,

    deleteCollaborationRequestSuccess,

    // =====================================================
    // COLLABORATORS
    // =====================================================

    getCollaboratorsStart,

    getCollaboratorsSuccess,

    getCollaboratorsFailure,

    // =====================================================
    // STAR
    // =====================================================

    projectStarStart,

    projectStarSuccess,

    projectStarFailure,

    // =====================================================
    // UTILS
    // =====================================================

    clearProjectError,

    resetProjectState,
} = projectSlice.actions;

// =========================================================
// REDUCER
// =========================================================

export default projectSlice.reducer;
