
 // src/components/profile/ProfileProjects.jsx

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
    getProjectFailure,
    getProjectStart,
    getProjectSuccess,
    PROFILE_PROJECT_PAGE_SIZE,
} from "../../features/projects";

import ProjectService from "../../services/project";

import CreateProjectModal from "../projects/CreateProjectModal";

// =========================================================
// PROFILE PROJECTS COMPONENTS
//
// The existing modular UI is preserved.
// =========================================================

import ProfileProjectsHeader from "./projects/ProfileProjectsHeader";
import ProfileProjectsStats from "./projects/ProfileProjectsStats";
import ProfileProjectsSkeleton from "./projects/ProfileProjectsSkeleton";
import ProfileProjectsEmpty from "./projects/ProfileProjectsEmpty";
import ProfileProjectsError from "./projects/ProfileProjectsError";
import ProfileProjectCard from "./projects/ProfileProjectCard";
import ProfileProjectsPagination from "./projects/ProfileProjectsPagination";

// =========================================================
// CONSTANTS
// =========================================================

const EMPTY_PROJECTS = [];
const SEARCH_DEBOUNCE_MS = 350;

const DEFAULT_STATS = {
    total: 0,
    stars: 0,
    views: 0,
    comments: 0,
};

// =========================================================
// REDUX SELECTORS
// =========================================================

const selectProjectState = (state) => state.project || {};
const selectAuthState = (state) => state.auth || {};

// =========================================================
// API ERROR MESSAGE
//
// Keep DRF field errors and common Axios error formats.
// =========================================================

const getErrorMessage = (
    error,
    fallback = "Kutilmagan xatolik yuz berdi."
) => {
    if (typeof error === "string" && error.trim()) {
        return error.trim();
    }

    const data = error?.serverData ?? error?.response?.data;

    if (typeof data === "string" && data.trim()) {
        return data.trim();
    }

    if (
        typeof data?.detail === "string" &&
        data.detail.trim()
    ) {
        return data.detail.trim();
    }

    if (
        typeof data?.message === "string" &&
        data.message.trim()
    ) {
        return data.message.trim();
    }

    if (data && typeof data === "object") {
        const fields = [
            "name",
            "title",
            "description",
            "main_features",
            "languages",
            "technologies",
            "images",
            "non_field_errors",
        ];

        for (const field of fields) {
            const value = data[field];

            if (Array.isArray(value) && value.length > 0) {
                const first = value[0];

                if (typeof first === "string") {
                    return first;
                }

                if (first && typeof first === "object") {
                    const nested = Object.values(first)
                        .flat()
                        .find((item) => typeof item === "string");

                    if (nested) {
                        return String(nested);
                    }
                }
            }

            if (typeof value === "string" && value.trim()) {
                return value.trim();
            }
        }
    }

    return error?.message || fallback;
};

// =========================================================
// CANCELED REQUEST CHECK
// =========================================================

const isCanceledRequest = (error) => {
    return (
        error?.code === "ERR_CANCELED" ||
        error?.name === "CanceledError" ||
        error?.name === "AbortError"
    );
};

// =========================================================
// SAFE PROJECTS
//
// Redux slice stores the current page's result array.
// Legacy paginated-object input is supported too.
// =========================================================

const getSafeProjects = (projects) => {
    if (Array.isArray(projects)) {
        return projects;
    }

    if (Array.isArray(projects?.results)) {
        return projects.results;
    }

    return EMPTY_PROJECTS;
};

// =========================================================
// SAFE COUNTS
// =========================================================

const safeNonNegativeNumber = (value, fallback = 0) => {
    if (value === null || value === undefined || value === "") {
        return fallback;
    }

    const number = Number(value);

    return Number.isFinite(number) && number >= 0
        ? number
        : fallback;
};

// =========================================================
// SAFE PROFILE STATS
//
// These values belong to ALL projects, not just the
// current page. Do not sum the four visible cards.
// =========================================================

const getSafeStats = (stats, fallbackTotal = 0) => {
    const source =
        stats && typeof stats === "object" && !Array.isArray(stats)
            ? stats
            : DEFAULT_STATS;

    return {
        total: safeNonNegativeNumber(
            source.total,
            fallbackTotal
        ),
        stars: safeNonNegativeNumber(source.stars),
        views: safeNonNegativeNumber(source.views),
        comments: safeNonNegativeNumber(source.comments),
    };
};

// =========================================================
// NORMALIZE SEARCH INPUT
//
// Header sends a string, but the previous event-style
// callback is also accepted for compatibility.
// =========================================================

const normalizeSearchInput = (value) => {
    const raw =
        typeof value === "string"
            ? value
            : value?.target?.value ?? "";

    return String(raw);
};

// =========================================================
// BUILD REQUEST KEY
//
// A request is considered visually complete ONLY when
// the currently displayed results match all these values.
// This avoids stale flashes on page changes and refresh.
// =========================================================

const buildRequestKey = (
    username,
    page,
    search,
    refreshKey
) => JSON.stringify([username, page, search, refreshKey]);

// =========================================================
// PROFILE PROJECTS CONTENT
//
// The wrapper at the bottom assigns a key to the profile.
// Every username receives fresh local page/search/modal
// state; the old component's requests are aborted.
// =========================================================

const ProfileProjectsContent = ({ username }) => {
    const dispatch = useDispatch();

    // =====================================================
    // REDUX: PROJECTS
    // =====================================================

    const {
        projects = EMPTY_PROJECTS,
        project_isLoading = false,
        project_error = null,
        projectCount = 0,
        projectPage = 1,
        projectPageSize = PROFILE_PROJECT_PAGE_SIZE,
        projectStats = DEFAULT_STATS,
    } = useSelector(selectProjectState);

    // =====================================================
    // REDUX: AUTH
    // =====================================================

    const {
        isLoggedIn,
        user,
    } = useSelector(selectAuthState);

    // =====================================================
    // LOCAL STATE: CREATE PROJECT MODAL
    // =====================================================

    const [
        isCreateModalOpen,
        setIsCreateModalOpen,
    ] = useState(false);

    const [
        isSubmitting,
        setIsSubmitting,
    ] = useState(false);

    const [
        createError,
        setCreateError,
    ] = useState(null);

    // Immediate lock prevents repeated POST requests
    // within the same React render batch.
    const submitLockRef = useRef(false);

    // =====================================================
    // LOCAL STATE: PAGINATION
    //
    // Redux's projectPage describes the loaded response.
    // This page state describes the requested response.
    // =====================================================

    const [page, setPage] = useState(1);

    // =====================================================
    // LOCAL STATE: CONTROLLED SEARCH
    // =====================================================

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Changes the controlled search input's identity when
    // we explicitly clear it; prevents browser restoration.
    const [searchResetKey, setSearchResetKey] = useState(0);

    // =====================================================
    // LOCAL STATE: REFRESH
    //
    // Allows a new GET even when page and search are
    // already unchanged (for example, after CREATE).
    // =====================================================

    const [refreshKey, setRefreshKey] = useState(0);

    // =====================================================
    // LOCAL STATE: LAST COMPLETED REQUEST
    //
    // null means that this profile has never finished a GET.
    // The UI shows skeleton until the correct request ends.
    // =====================================================

    const [completedRequestKey, setCompletedRequestKey] =
        useState(null);

    // =====================================================
    // NORMALIZED USERNAME
    // =====================================================

    const profileUsername = String(username ?? "").trim();

    // =====================================================
    // SAFE PROJECT DATA
    // =====================================================

    const safeProjects = useMemo(
        () => getSafeProjects(projects),
        [projects]
    );

    // =====================================================
    // SAFE PAGINATION METADATA
    // =====================================================

    const safeProjectCount = safeNonNegativeNumber(projectCount);

    const safePageSize =
        Number.isSafeInteger(Number(projectPageSize)) &&
        Number(projectPageSize) > 0
            ? Number(projectPageSize)
            : PROFILE_PROJECT_PAGE_SIZE;

    const totalPages = Math.ceil(
        safeProjectCount / safePageSize
    );

    // =====================================================
    // SAFE AGGREGATE STATS
    // =====================================================

    const safeStats = useMemo(
        () => getSafeStats(projectStats, safeProjectCount),
        [projectStats, safeProjectCount]
    );

    // =====================================================
    // PROFILE OWNER
    // =====================================================

    const isOwner = useMemo(() => {
        if (
            !isLoggedIn ||
            !user?.username ||
            !profileUsername
        ) {
            return false;
        }

        return (
            String(user.username).toLowerCase() ===
            profileUsername.toLowerCase()
        );
    }, [isLoggedIn, user?.username, profileUsername]);

    // =====================================================
    // RESET SEARCH
    // =====================================================

    const resetSearch = useCallback(() => {
        setSearch("");
        setDebouncedSearch("");
        setSearchResetKey((current) => current + 1);
    }, []);

    // =====================================================
    // TRIGGER REFRESH
    // =====================================================

    const refreshProjects = useCallback(() => {
        setRefreshKey((current) => current + 1);
    }, []);

    // =====================================================
    // SEARCH DEBOUNCE
    //
    // The input stays responsive immediately; a request
    // is sent only after the user stops typing for 350 ms.
    // =====================================================

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search.trim());
        }, SEARCH_DEBOUNCE_MS);

        return () => clearTimeout(timer);
    }, [search]);

    // =====================================================
    // REQUEST IDENTITY / DEBOUNCE STATUS
    // =====================================================

    const normalizedSearch = search.trim();
    const isSearchPending = normalizedSearch !== debouncedSearch;

    const requestedKey = buildRequestKey(
        profileUsername,
        page,
        debouncedSearch,
        refreshKey
    );

    // =====================================================
    // FETCH PROFILE PROJECTS
    //
    // Triggers:
    // - Initial mount and browser refresh
    // - Page change
    // - Debounced search
    // - Manual refresh
    // - Successful project creation
    //
    // When search is still being typed:
    // - Cancel any older request immediately
    // - Keep the skeleton visible
    // - Wait for the 350 ms debounce to finish
    //
    // An AbortController prevents an outdated response
    // from overwriting the next page/search results.
    // =====================================================

    useEffect(() => {
        // ================================================
        // USERNAME NOT AVAILABLE
        // ================================================

        if (!profileUsername) {
            dispatch(
                getProjectSuccess({
                    count: 0,
                    next: null,
                    previous: null,
                    results: [],
                    stats: { ...DEFAULT_STATS },
                    page: 1,
                    pageSize: PROFILE_PROJECT_PAGE_SIZE,
                    search: "",
                })
            );

            setCompletedRequestKey(requestedKey);
            return undefined;
        }

        // ================================================
        // WAIT FOR SEARCH INPUT TO SETTLE
        //
        // Calling start here keeps Redux and the visual
        // skeleton synchronized while typing. No GET yet.
        // ================================================

        if (isSearchPending) {
            dispatch(getProjectStart());
            return undefined;
        }

        // ================================================
        // ACTUAL API REQUEST
        // ================================================

        const controller = new AbortController();
        let active = true;

        dispatch(getProjectStart());

        const loadProjects = async () => {
            try {
                const response = await ProjectService.getProjects(
                    profileUsername,
                    {
                        page,
                        search: debouncedSearch,
                        signal: controller.signal,
                    }
                );

                if (!active || controller.signal.aborted) {
                    return;
                }

                dispatch(getProjectSuccess(response));
                setCompletedRequestKey(requestedKey);
            } catch (error) {
                if (
                    !active ||
                    controller.signal.aborted ||
                    isCanceledRequest(error)
                ) {
                    return;
                }

                // =========================================
                // OUT-OF-RANGE PAGE
                //
                // For example, deleting the only project
                // on the last page can make it invalid.
                // =========================================

                if (
                    error?.response?.status === 404 &&
                    page > 1
                ) {
                    setPage(1);
                    return;
                }

                dispatch(
                    getProjectFailure(
                        getErrorMessage(
                            error,
                            "Loyihalarni yuklashda xatolik yuz berdi."
                        )
                    )
                );

                setCompletedRequestKey(requestedKey);
            }
        };

        void loadProjects();

        // ================================================
        // CANCEL OUTDATED REQUEST
        // ================================================

        return () => {
            active = false;
            controller.abort();
        };
    }, [
        dispatch,
        profileUsername,
        page,
        debouncedSearch,
        requestedKey,
        isSearchPending,
    ]);

    // =====================================================
    // SEARCH CHANGE
    //
    // Search runs on the server across all profile
    // projects, not only the current four cards.
    // =====================================================

    const handleSearchChange = useCallback((value) => {
        setSearch(normalizeSearchInput(value));
        setPage(1);
    }, []);

    // =====================================================
    // CLEAR SEARCH
    // =====================================================

    const handleClearSearch = useCallback(() => {
        resetSearch();
        setPage(1);
    }, [resetSearch]);

    // =====================================================
    // PAGE CHANGE
    //
    // Do not slice client-side arrays. Each page is
    // fetched from the backend with ?page=N.
    // =====================================================

    const handlePageChange = useCallback(
        (nextPage) => {
            if (project_isLoading || isSearchPending) {
                return;
            }

            const parsedPage = Number(nextPage);

            if (
                !Number.isSafeInteger(parsedPage) ||
                parsedPage < 1 ||
                parsedPage > totalPages ||
                parsedPage === page
            ) {
                return;
            }

            setPage(parsedPage);
        },
        [page, totalPages, project_isLoading, isSearchPending]
    );

    // =====================================================
    // OPEN CREATE MODAL
    //
    // Reset search and select the first page so that
    // the created project cannot be hidden by a filter.
    // =====================================================

    const handleCreateProject = useCallback(() => {
        if (!isOwner || submitLockRef.current) {
            return;
        }

        resetSearch();
        setPage(1);
        setCreateError(null);
        setIsCreateModalOpen(true);
    }, [isOwner, resetSearch]);

    // =====================================================
    // CLOSE CREATE MODAL
    // =====================================================

    const handleCloseCreateModal = useCallback(() => {
        if (submitLockRef.current) {
            return;
        }

        setIsCreateModalOpen(false);
    }, []);

    // =====================================================
    // CREATE PROJECT
    //
    // On success:
    // - Reset search
    // - Return to page 1
    // - Start a new GET (even if already on page 1)
    // - Show four-card skeleton
    // - Update count and aggregate stats from backend
    //
    // A successful POST is not treated as failed if the
    // subsequent GET fails. The GET has its own error UI.
    // =====================================================

    const handleProjectSubmit = async (formDataWithImages) => {
        if (!isOwner) {
            throw new Error(
                "Loyiha yaratish uchun ruxsat yo‘q."
            );
        }

        if (submitLockRef.current) {
            throw new Error(
                "Loyiha allaqachon saqlanmoqda."
            );
        }

        submitLockRef.current = true;
        setIsSubmitting(true);
        setCreateError(null);

        try {
            const response = await ProjectService.createProject(
                formDataWithImages
            );

            // =============================================
            // CREATE SUCCEEDED
            // =============================================

            resetSearch();
            setPage(1);
            refreshProjects();

            setCreateError(null);
            setIsCreateModalOpen(false);

            return response?.data ?? response;
        } catch (error) {
            const message = getErrorMessage(
                error,
                "Loyihani yaratishda xatolik yuz berdi."
            );

            setCreateError(message);

            // Preserve Axios/DRF validation details for
            // CreateProjectModal's own error handling.
            throw error;
        } finally {
            submitLockRef.current = false;
            setIsSubmitting(false);
        }
    };

    // =====================================================
    // LOADING
    //
    // Four-card skeleton is shown while:
    // - The first request is not complete
    // - Search debounce is pending
    // - The requested page/search/refresh is not complete
    // - Redux is fetching the current response
    //
    // The request-key comparison prevents a one-frame
    // flash of old projects when page/refresh changes.
    // =====================================================

    const isRequestedPagePending =
        Number(projectPage) !== Number(page);

    const showSkeleton =
        completedRequestKey !== requestedKey ||
        isSearchPending ||
        isRequestedPagePending ||
        project_isLoading;

    // =====================================================
    // EMPTY STATE FLAGS
    // =====================================================

    const hasAnyProjects = safeStats.total > 0;
    const hasVisibleProjects = safeProjects.length > 0;
    const hasSearchQuery = debouncedSearch.length > 0;
    const hasSearchResults = safeProjectCount > 0;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="min-w-0 space-y-5">
            {/* =============================================
                HEADER
            ============================================== */}

            <ProfileProjectsHeader
                key={`${profileUsername || "profile"}-${searchResetKey}`}
                search={search}
                onSearchChange={handleSearchChange}
                isOwner={isOwner}
                onCreateProject={handleCreateProject}
                isLoading={showSkeleton}
                isSubmitting={isSubmitting}
            />

            {/* =============================================
                CREATE ERROR
            ============================================== */}

            {createError && (
                <ProfileProjectsError
                    variant="create"
                    error={createError}
                />
            )}

            {/* =============================================
                PROJECT CONTENT
            ============================================== */}

            {showSkeleton ? (
                // =========================================
                // FOUR-CARD LOADING SKELETON
                // =========================================

                <ProfileProjectsSkeleton
                    isOwner={isOwner}
                    count={PROFILE_PROJECT_PAGE_SIZE}
                    showStats
                />
            ) : project_error ? (
                // =========================================
                // FETCH ERROR
                // =========================================

                <ProfileProjectsError
                    variant="fetch"
                    error={project_error}
                    onRetry={refreshProjects}
                    isLoading={project_isLoading}
                />
            ) : (
                <>
                    {/* =====================================
                        COMPLETE PROFILE STATISTICS
                    ====================================== */}

                    {hasAnyProjects && (
                        <ProfileProjectsStats
                            stats={safeStats}
                            projects={safeProjects}
                            totalCount={safeStats.total}
                        />
                    )}

                    {/* =====================================
                        NO PROJECTS IN PROFILE
                    ====================================== */}

                    {!hasAnyProjects && (
                        <ProfileProjectsEmpty
                            variant="projects"
                            isOwner={isOwner}
                            onCreate={handleCreateProject}
                            onCreateProject={handleCreateProject}
                            message={
                                isOwner
                                    ? "Sizda hali loyiha mavjud emas. Birinchi loyihangizni yarating!"
                                    : "Foydalanuvchida hali loyiha mavjud emas."
                            }
                        />
                    )}

                    {/* =====================================
                        SEARCH RESULT EMPTY STATE
                    ====================================== */}

                    {hasAnyProjects &&
                        hasSearchQuery &&
                        !hasSearchResults && (
                            <ProfileProjectsEmpty
                                variant="search"
                                isOwner={isOwner}
                                search={debouncedSearch}
                                searchQuery={debouncedSearch}
                                onClearSearch={handleClearSearch}
                            />
                        )}

                    {/* =====================================
                        PROJECT GRID
                    ====================================== */}

                    {hasVisibleProjects && (
                        <div
                            id="profile-projects-list"
                            className="
                                grid
                                min-w-0
                                gap-5
                                sm:gap-6
                                md:grid-cols-2
                            "
                        >
                            {safeProjects.map((project, index) => (
                                <ProfileProjectCard
                                    key={project?.id ?? `project-${index}`}
                                    project={project}
                                    index={index}
                                />
                            ))}
                        </div>
                    )}

                    {/* =====================================
                        PAGINATION
                        - Four projects per page
                        - Server-provided result count
                        - Responsive navigation
                    ====================================== */}

                    {hasVisibleProjects &&
                        totalPages > 1 && (
                            <ProfileProjectsPagination
                                page={page}
                                totalCount={safeProjectCount}
                                pageSize={safePageSize}
                                isLoading={project_isLoading}
                                onPageChange={handlePageChange}
                            />
                        )}
                </>
            )}

            {/* =============================================
                CREATE PROJECT MODAL
                Keep the existing create/edit form contract.
            ============================================== */}

            <CreateProjectModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
                onSubmit={handleProjectSubmit}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

// =========================================================
// EXPORTED PROFILE PROJECTS
//
// The key resets local state when navigating between
// usernames without unmounting the surrounding profile.
// The old ProfileProjectsContent cleanup aborts its GET.
// =========================================================

const ProfileProjects = ({ username }) => {
    const profileUsername = String(username ?? "").trim();

    return (
        <ProfileProjectsContent
            key={profileUsername || "__no_username__"}
            username={profileUsername}
        />
    );
};

export default ProfileProjects;
