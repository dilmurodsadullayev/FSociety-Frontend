
﻿// src/services/project.js

import axios from "./api";

// =========================================================
// HELPERS
// =========================================================

// =========================================================
// IS CANCELED REQUEST
//
// AbortController orqali bekor qilingan so'rovlar
// oddiy API xatosi sifatida log qilinmaydi.
// =========================================================

const isCanceledRequest = (error) => {
    return (
        error?.code === "ERR_CANCELED" ||
        error?.name === "CanceledError" ||
        error?.name === "AbortError"
    );
};

// =========================================================
// ERROR LOGGER
//
// Barcha ProjectService metodlari uchun umumiy
// xatoliklarni qayd etish funksiyasi.
// =========================================================

const logServiceError = (
    label,
    error
) => {
    if (
        isCanceledRequest(
            error
        )
    ) {
        return;
    }

    console.error(
        label,
        error?.response?.data ||
        error?.response ||
        error?.message ||
        error
    );
};

// =========================================================
// NORMALIZE ARRAY
//
// API javobi oddiy array yoki paginated object
// bo'lishi mumkin.
//
// Bu helperdan foydalanadigan mavjud metodlarning
// qaytaradigan qiymati avvalgidek array bo'lib qoladi.
//
// Profil pagination uchun bundan foydalanmaymiz,
// chunki u count, next, previous ni yo'qotadi.
// =========================================================

const normalizeArray = (
    data
) => {
    if (
        Array.isArray(
            data
        )
    ) {
        return data;
    }

    if (
        Array.isArray(
            data?.results
        )
    ) {
        return data.results;
    }

    return [];
};

// =========================================================
// NORMALIZE PAGINATION
//
// Supports:
//
// 1. Old API:
// [
//     { id: 1 },
//     { id: 2 }
// ]
//
// 2. DRF API:
// {
//     count: 10,
//     next: "...",
//     previous: null,
//     results: [...]
// }
//
// Used by:
// - getProjects
// - getAllProjects
// =========================================================

const normalizePagination = (
    data
) => {
    // =====================================================
    // LEGACY ARRAY
    // =====================================================

    if (
        Array.isArray(
            data
        )
    ) {
        return {
            count:
                data.length,

            next:
                null,

            previous:
                null,

            results:
                data,
        };
    }

    // =====================================================
    // NORMALIZE RESULTS
    // =====================================================

    const results =
        Array.isArray(
            data?.results
        )
            ? data.results
            : [];

    // =====================================================
    // NORMALIZE COUNT
    //
    // NaN yoki noto'g'ri qiymatlar bo'lsa,
    // results.length ishlatiladi.
    // =====================================================

    const rawCount = Number(
        data?.count ??
        results.length
    );

    const count =
        Number.isFinite(rawCount) &&
        rawCount >= 0
            ? rawCount
            : results.length;

    // =====================================================
    // RESPONSE
    // =====================================================

    return {
        count,

        next:
            data?.next ??
            null,

        previous:
            data?.previous ??
            null,

        results,
    };
};

// =========================================================
// CLEAN TEXT
//
// Used by search and other query parameters.
// =========================================================

const cleanText = (
    value
) => {
    return String(
        value ??
        ""
    ).trim();
};

// =========================================================
// NORMALIZE PAGE NUMBER
//
// Only positive integers are valid.
// =========================================================

const normalizePageNumber = (
    value
) => {
    const page = Number(
        value
    );

    if (
        !Number.isSafeInteger(
            page
        ) ||
        page < 1
    ) {
        return 1;
    }

    return page;
};

// =========================================================
// PROFILE PROJECT PAGE SIZE
//
// Backend ProfileProjectPagination:
//
// page_size = 4
//
// Global projects are NOT affected.
// =========================================================

const PROFILE_PROJECT_PAGE_SIZE = 4;

// =========================================================
// NORMALIZE PROFILE PROJECT STATS
//
// API:
// {
//     stats: {
//         total: 12,
//         stars: 35,
//         views: 105,
//         comments: 20
//     }
// }
//
// Statistics include all profile projects,
// independently from pagination and search.
//
// Legacy responses without stats are also accepted.
// =========================================================

const normalizeProfileProjectStats = (
    data,
    fallbackTotal = 0
) => {
    // =====================================================
    // SAFE SOURCE
    // =====================================================

    const stats =
        data?.stats &&
        typeof data.stats === "object" &&
        !Array.isArray(data.stats)
            ? data.stats
            : {};

    // =====================================================
    // SAFE STAT NUMBER
    // =====================================================

    const safeStat = (
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

        const parsed = Number(
            value
        );

        if (
            !Number.isFinite(parsed) ||
            parsed < 0
        ) {
            return fallback;
        }

        return parsed;
    };

    // =====================================================
    // RETURN STATS
    // =====================================================

    return {
        total: safeStat(
            stats.total,
            fallbackTotal
        ),

        stars: safeStat(
            stats.stars,
            0
        ),

        views: safeStat(
            stats.views,
            0
        ),

        comments: safeStat(
            stats.comments,
            0
        ),
    };
};

// =========================================================
// PROJECT SERVICE
// =========================================================

const ProjectService = {

    // =====================================================
    // PROFILE PROJECTS
    //
    // GET:
    //
    // /projects/<username>/projects/
    //
    // Query:
    //
    // ?page=1
    // &search=django
    //
    // Backend:
    //
    // ProfileProjectPagination
    // page_size = 4
    //
    // NEW:
    // - Server-side pagination
    // - Server-side search
    // - AbortController support
    // - Profile stats
    //
    // Response:
    //
    // {
    //     count,
    //     next,
    //     previous,
    //     results,
    //     stats,
    //     page,
    //     pageSize,
    //     search
    // }
    //
    // IMPORTANT:
    //
    // Existing ProfileProjects.jsx must be updated
    // to use response.results instead of an array.
    // =====================================================

    async getProjects(
        username,
        {
            page = 1,
            search = "",
            signal = undefined,
        } = {}
    ) {
        try {
            // ============================================
            // USERNAME
            // ============================================

            const safeUsername =
                cleanText(
                    username
                );

            if (
                !safeUsername
            ) {
                throw new Error(
                    "Projectlarni olish uchun username kerak."
                );
            }

            // ============================================
            // PAGE
            // ============================================

            const safePage =
                normalizePageNumber(
                    page
                );

            // ============================================
            // SEARCH
            // ============================================

            const searchValue =
                cleanText(
                    search
                );

            // ============================================
            // QUERY PARAMS
            // ============================================

            const params = {
                page:
                    safePage,
            };

            if (
                searchValue
            ) {
                params.search =
                    searchValue;
            }

            // ============================================
            // REQUEST
            // ============================================

            const {
                data,
            } = await axios.get(
                `/projects/${encodeURIComponent(
                    safeUsername
                )}/projects/`,
                {
                    params,

                    signal,

                    withCredentials:
                        true,
                }
            );

            // ============================================
            // PAGINATION DATA
            //
            // Do NOT call normalizeArray(data).
            // =================================================

            const pagination =
                normalizePagination(
                    data
                );

            // ============================================
            // COMPLETE PROFILE STATS
            //
            // The backend counts all user projects.
            //
            // These values do not depend on the
            // current search or current page.
            // ============================================

            const stats =
                normalizeProfileProjectStats(
                    data,
                    pagination.count
                );

            // ============================================
            // RESPONSE
            //
            // Redux slice can consume this object
            // directly through getProjectSuccess.
            // ============================================

            return {
                count:
                    pagination.count,

                next:
                    pagination.next,

                previous:
                    pagination.previous,

                results:
                    pagination.results,

                stats,

                page:
                    safePage,

                pageSize:
                    PROFILE_PROJECT_PAGE_SIZE,

                search:
                    searchValue,
            };

        } catch (
            error
        ) {
            logServiceError(
                "Profile projectlarni olishda xato:",
                error
            );

            throw error;
        }
    },

    // =====================================================
    // PROJECT DETAIL
    //
    // GET:
    //
    // /projects/project/<id>/detail/
    //
    // Original endpoint and response are preserved.
    // =====================================================

    async projectDetail(
        projectId,
        {
            signal = undefined,
        } = {}
    ) {
        try {
            const {
                data,
            } = await axios.get(
                `/projects/project/${projectId}/detail/`,
                {
                    signal,

                    withCredentials:
                        true,
                }
            );

            return data;

        } catch (
            error
        ) {
            logServiceError(
                "Project detail olishda xato:",
                error
            );

            throw error;
        }
    },

    // =====================================================
    // CREATE PROJECT
    //
    // POST:
    //
    // /projects/project/create/
    //
    // Supports FormData:
    //
    // - name
    // - main_features
    // - description
    // - website_url
    // - languages
    // - technologies
    // - images[index]image
    // - images[index]title
    //
    // Do not manually force JSON Content-Type.
    // =====================================================

    async createProject(
        projectData
    ) {
        try {
            const {
                data,
            } = await axios.post(
                "/projects/project/create/",
                projectData,
                {
                    withCredentials:
                        true,
                }
            );

            return data;

        } catch (
            error
        ) {
            logServiceError(
                "Project yaratishda xato:",
                error
            );

            throw error;
        }
    },

    // =====================================================
    // UPDATE PROJECT
    //
    // PATCH:
    //
    // /projects/project/<id>/edit/
    //
    // Original FormData support is preserved.
    // =====================================================

    async updateProject(
        projectId,
        projectData
    ) {
        try {
            const {
                data,
            } = await axios.patch(
                `/projects/project/${projectId}/edit/`,
                projectData,
                {
                    withCredentials:
                        true,
                }
            );

            return data;

        } catch (
            error
        ) {
            logServiceError(
                "Project tahrirlashda xato:",
                error
            );

            throw error;
        }
    },

    // =====================================================
    // DELETE PROJECT
    //
    // DELETE:
    //
    // /projects/project/<id>/edit/
    //
    // Returns true after successful deletion.
    // =====================================================

    async deleteProject(
        projectId
    ) {
        try {
            await axios.delete(
                `/projects/project/${projectId}/edit/`,
                {
                    withCredentials:
                        true,
                }
            );

            return true;

        } catch (
            error
        ) {
            logServiceError(
                "Project o‘chirishda xato:",
                error
            );

            throw error;
        }
    },

    // =====================================================
    // LANGUAGES
    //
    // GET:
    //
    // /problems/languages/
    //
    // Original array response contract preserved.
    // =====================================================

    async getLanguagesList(
        {
            signal = undefined,
        } = {}
    ) {
        try {
            const {
                data,
            } = await axios.get(
                "/problems/languages/",
                {
                    signal,

                    withCredentials:
                        true,
                }
            );

            return normalizeArray(
                data
            );

        } catch (
            error
        ) {
            logServiceError(
                "Project uchun dasturlash tillarini olishda xato:",
                error
            );

            throw error;
        }
    },

    // =====================================================
    // TECHNOLOGIES
    //
    // GET:
    //
    // /problems/technologies/
    //
    // Original array response contract preserved.
    // =====================================================

    async getTechnologiesList(
        {
            signal = undefined,
        } = {}
    ) {
        try {
            const {
                data,
            } = await axios.get(
                "/problems/technologies/",
                {
                    signal,

                    withCredentials:
                        true,
                }
            );

            return normalizeArray(
                data
            );

        } catch (
            error
        ) {
            logServiceError(
                "Project uchun texnologiyalarni olishda xato:",
                error
            );

            throw error;
        }
    },

    // =====================================================
    // STACK CATALOG
    //
    // Language + Technology
    //
    // This endpoint combination is used by
    // CreateProjectModal.
    //
    // Both requests run concurrently.
    //
    // Response:
    //
    // {
    //     languages: [...],
    //     technologies: [...]
    // }
    // =====================================================

    async getStackCatalog(
        {
            signal = undefined,
        } = {}
    ) {
        try {
            // ============================================
            // REQUEST BOTH CATALOGS
            // ============================================

            const [
                languagesResponse,
                technologiesResponse,
            ] = await Promise.all([
                axios.get(
                    "/problems/languages/",
                    {
                        signal,

                        withCredentials:
                            true,
                    }
                ),

                axios.get(
                    "/problems/technologies/",
                    {
                        signal,

                        withCredentials:
                            true,
                    }
                ),
            ]);

            // ============================================
            // NORMALIZE RESPONSE
            // ============================================

            return {
                languages:
                    normalizeArray(
                        languagesResponse.data
                    ),

                technologies:
                    normalizeArray(
                        technologiesResponse.data
                    ),
            };

        } catch (
            error
        ) {
            logServiceError(
                "Project stack katalogini olishda xato:",
                error
            );

            throw error;
        }
    },

    // =====================================================
    // PROJECT COMMENTS
    //
    // GET:
    //
    // /projects/project/<id>/comments/
    //
    // Original response: array.
    // =====================================================

    async getProjectComments(
        projectId,
        {
            signal = undefined,
        } = {}
    ) {
        try {
            const {
                data,
            } = await axios.get(
                `/projects/project/${projectId}/comments/`,
                {
                    signal,

                    withCredentials:
                        true,
                }
            );

            return normalizeArray(
                data
            );

        } catch (
            error
        ) {
            logServiceError(
                "Project commentlarni olishda xato:",
                error
            );

            throw error;
        }
    },

    // =====================================================
    // CREATE COMMENT
    //
    // POST:
    //
    // /projects/project/<id>/comments/
    // =====================================================

    async projectCommentCreate(
        projectId,
        commentData
    ) {
        try {
            const {
                data,
            } = await axios.post(
                `/projects/project/${projectId}/comments/`,
                commentData,
                {
                    withCredentials:
                        true,
                }
            );

            return data;

        } catch (
            error
        ) {
            logServiceError(
                "Project comment yaratishda xato:",
                error
            );

            throw error;
        }
    },

    // =====================================================
    // UPDATE COMMENT
    //
    // PATCH:
    //
    // /projects/project/<id>/comment/<id>/edit/
    // =====================================================

    async projectCommentUpdate(
        projectId,
        commentId,
        commentData
    ) {
        try {
            const {
                data,
            } = await axios.patch(
                `/projects/project/${projectId}/comment/${commentId}/edit/`,
                commentData,
                {
                    withCredentials:
                        true,
                }
            );

            return data;

        } catch (
            error
        ) {
            logServiceError(
                "Project comment tahrirlashda xato:",
                error
            );

            throw error;
        }
    },

    // =====================================================
    // DELETE COMMENT
    //
    // DELETE:
    //
    // /projects/project/<id>/comment/<id>/edit/
    // =====================================================

    async projectCommentDelete(
        projectId,
        commentId
    ) {
        try {
            await axios.delete(
                `/projects/project/${projectId}/comment/${commentId}/edit/`,
                {
                    withCredentials:
                        true,
                }
            );

            return true;

        } catch (
            error
        ) {
            logServiceError(
                "Project comment o‘chirishda xato:",
                error
            );

            throw error;
        }
    },

    // =====================================================
    // CREATE COLLABORATION REQUEST
    //
    // POST:
    //
    // /projects/project/<id>/collaboration-requests/
    //
    // Original collaboration functionality preserved.
    // =====================================================

    async createCollaborationRequest(
        projectId,
        requestData
    ) {
        try {
            const {
                data,
            } = await axios.post(
                `/projects/project/${projectId}/collaboration-requests/`,
                requestData,
                {
                    withCredentials:
                        true,
                }
            );

            return data;

        } catch (
            error
        ) {
            logServiceError(
                "Hamkorlik so‘rovini yuborishda xato:",
                error
            );

            throw error;
        }
    },

    // =====================================================
    // COLLABORATION REQUEST LIST
    //
    // GET:
    //
    // /projects/project/<id>/collaboration-requests/
    //
    // Original response: array.
    // =====================================================

    async getCollaborationRequests(
        projectId,
        {
            signal = undefined,
        } = {}
    ) {
        try {
            const {
                data,
            } = await axios.get(
                `/projects/project/${projectId}/collaboration-requests/`,
                {
                    signal,

                    withCredentials:
                        true,
                }
            );

            return normalizeArray(
                data
            );

        } catch (
            error
        ) {
            logServiceError(
                "Hamkorlik so‘rovlarini olishda xato:",
                error
            );

            throw error;
        }
    },

    // =====================================================
    // PROJECT COLLABORATORS
    //
    // GET:
    //
    // /projects/project/<id>/collaborators/
    //
    // Original response: array.
    // =====================================================

    async getProjectCollaborators(
        projectId,
        {
            signal = undefined,
        } = {}
    ) {
        try {
            const {
                data,
            } = await axios.get(
                `/projects/project/${projectId}/collaborators/`,
                {
                    signal,

                    withCredentials:
                        true,
                }
            );

            return normalizeArray(
                data
            );

        } catch (
            error
        ) {
            logServiceError(
                "Project hamkorlarini olishda xato:",
                error
            );

            throw error;
        }
    },

    // =====================================================
    // UPDATE COLLABORATION REQUEST
    //
    // PUT:
    //
    // /projects/project/collaboration-requests/<id>/
    //
    // Request body:
    //
    // {
    //     status: newStatus
    // }
    // =====================================================

    async updateCollaborationRequest(
        requestId,
        newStatus
    ) {
        try {
            const {
                data,
            } = await axios.put(
                `/projects/project/collaboration-requests/${requestId}/`,
                {
                    status:
                        newStatus,
                },
                {
                    withCredentials:
                        true,
                }
            );

            return data;

        } catch (
            error
        ) {
            logServiceError(
                "Hamkorlik so‘rovini yangilashda xato:",
                error
            );

            throw error;
        }
    },

    // =====================================================
    // DELETE COLLABORATION REQUEST
    //
    // DELETE:
    //
    // /projects/project/collaboration-requests/<id>/
    // =====================================================

    async deleteCollaborationRequest(
        requestId
    ) {
        try {
            await axios.delete(
                `/projects/project/collaboration-requests/${requestId}/`,
                {
                    withCredentials:
                        true,
                }
            );

            return true;

        } catch (
            error
        ) {
            logServiceError(
                "Hamkorlik so‘rovini o‘chirishda xato:",
                error
            );

            throw error;
        }
    },

    // =====================================================
    // PROJECT STAR
    //
    // POST:
    //
    // /projects/project/<id>/star_toggle/
    //
    // Response:
    //
    // {
    //     detail,
    //     is_starred_by_user,
    //     stars_count
    // }
    // =====================================================

    async toggleProjectStar(
        projectId
    ) {
        try {
            const {
                data,
            } = await axios.post(
                `/projects/project/${projectId}/star_toggle/`,
                {},
                {
                    withCredentials:
                        true,
                }
            );

            return data;

        } catch (
            error
        ) {
            logServiceError(
                "Project star toggle xato:",
                error
            );

            throw error;
        }
    },

    // =====================================================
    // GLOBAL PROJECTS
    //
    // GET:
    //
    // /projects/all/
    //
    // Query:
    //
    // ?page=1
    // &page_size=6
    // &search=django
    //
    // Existing global pagination is unchanged.
    //
    // Extra filters are preserved through ...filters.
    //
    // Return:
    //
    // {
    //     count,
    //     next,
    //     previous,
    //     results
    // }
    // =====================================================

    async getAllProjects(
        {
            page = 1,

            pageSize = 6,

            search = "",

            signal = undefined,

            ...filters
        } = {}
    ) {
        try {
            // ============================================
            // QUERY PARAMETERS
            // ============================================

            const params = {
                ...filters,

                page,

                page_size:
                    pageSize,
            };

            // ============================================
            // SEARCH
            // ============================================

            const searchValue =
                cleanText(
                    search
                );

            if (
                searchValue
            ) {
                params.search =
                    searchValue;
            }

            // ============================================
            // REQUEST
            // ============================================

            const {
                data,
            } = await axios.get(
                "/projects/all/",
                {
                    params,

                    signal,

                    withCredentials:
                        true,
                }
            );

            // ============================================
            // PAGINATION
            // ============================================

            return normalizePagination(
                data
            );

        } catch (
            error
        ) {
            logServiceError(
                "Global projectlarni olishda xato:",
                error
            );

            throw error;
        }
    },
};

// =========================================================
// EXPORT
// =========================================================

export default ProjectService;
