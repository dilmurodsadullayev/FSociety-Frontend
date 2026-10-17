
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

// =========================================================
// REDUX
// =========================================================

import {
    getProjectFailure,
    getProjectStart,
    getProjectSuccess,
} from "../features/projects";

// =========================================================
// SERVICES
// =========================================================

import ProjectService from "../services/project";

// =========================================================
// SHARED PAGE BACKGROUND
// =========================================================

import PageGridBackground from "./ui/PageGridBackground";

// =========================================================
// PROJECT COMPONENTS
// =========================================================

import ProjectsPageCard from "./projects/ProjectsPageCard";
import ProjectCardSkeleton from "./projects/ProjectCardSkeleton";
import ProjectsEmptyState from "./projects/ProjectsEmptyState";
import ProjectsErrorState from "./projects/ProjectsErrorState";
import ProjectsHeader from "./projects/ProjectsHeader";
import ProjectsToolbar from "./projects/ProjectsToolbar";
import ProjectsPagination from "./projects/ProjectsPagination";

// =========================================================
// HELPERS
// =========================================================

import {
    getErrorMessage,
    getPaginationItems,
    isCanceledRequest,
    safeNumber,
} from "./projects/projectHelpers";

// =========================================================
// CONFIGURATION
// =========================================================

const PAGE_SIZE = 6;
const SEARCH_DELAY = 400;
const EMPTY_PROJECTS = [];

// =========================================================
// FSOCIETY — PROJECTS PAGE
//
// Features:
// - Shared futuristic FSociety background
// - Global Dark / Light Mode
// - Responsive project grid
// - Search with debounce
// - Ctrl / Cmd + K shortcut
// - Server-side pagination
// - AbortController request cancellation
// - Stale response protection
// - Loading / Error / Empty states
// - Retry support
//
// Theme is controlled by ThemeContext.
//
// Background is shared with:
// - Users
// - Problems
// - Feedback
// =========================================================

const Projects = () => {
    const dispatch = useDispatch();

    // =====================================================
    // REFS
    // =====================================================

    const projectsSectionRef = useRef(null);
    const searchInputRef = useRef(null);

    // =====================================================
    // REDUX
    // =====================================================

    const {
        projects,
        project_isLoading = false,
        project_error = null,
    } = useSelector(
        (state) => state.project || {}
    );

    // =====================================================
    // SEARCH STATE
    // =====================================================

    const [searchTerm, setSearchTerm] = useState("");

    const [
        debouncedSearch,
        setDebouncedSearch,
    ] = useState("");

    // =====================================================
    // PAGINATION STATE
    // =====================================================

    const [
        currentPage,
        setCurrentPage,
    ] = useState(1);

    const [
        pagination,
        setPagination,
    ] = useState({
        count: 0,
        next: null,
        previous: null,
    });

    // =====================================================
    // RETRY STATE
    //
    // Incrementing this key restarts the managed request.
    // The previous request is aborted by effect cleanup.
    // =====================================================

    const [
        retryKey,
        setRetryKey,
    ] = useState(0);

    // =====================================================
    // SAFE PROJECTS
    // =====================================================

    const projectList = useMemo(() => {
        return Array.isArray(projects)
            ? projects
            : EMPTY_PROJECTS;
    }, [projects]);

    // =====================================================
    // TOTAL COUNT
    // =====================================================

    const totalCount = safeNumber(
        pagination.count
    );

    // =====================================================
    // TOTAL PAGES
    // =====================================================

    const totalPages = useMemo(() => {
        if (totalCount <= 0) {
            return 0;
        }

        return Math.ceil(
            totalCount / PAGE_SIZE
        );
    }, [totalCount]);

    // =====================================================
    // PAGINATION ITEMS
    // =====================================================

    const paginationItems = useMemo(() => {
        return getPaginationItems(
            currentPage,
            totalPages
        );
    }, [
        currentPage,
        totalPages,
    ]);

    // =====================================================
    // RESULT RANGE
    // =====================================================

    const rangeStart =
        totalCount > 0
            ? (currentPage - 1) * PAGE_SIZE + 1
            : 0;

    const rangeEnd = Math.min(
        currentPage * PAGE_SIZE,
        totalCount
    );

    // =====================================================
    // SEARCH DEBOUNCE
    //
    // Reset the page together with debounced search.
    // This avoids a request for page 1 with old search.
    // =====================================================

    useEffect(() => {
        const timer = window.setTimeout(() => {
            const nextSearch = searchTerm.trim();

            if (nextSearch !== debouncedSearch) {
                setCurrentPage(1);
                setDebouncedSearch(nextSearch);
            }
        }, SEARCH_DELAY);

        return () => {
            window.clearTimeout(timer);
        };
    }, [
        searchTerm,
        debouncedSearch,
    ]);

    // =====================================================
    // SEARCH SHORTCUT
    //
    // Ctrl + K — Windows / Linux
    // Cmd + K  — macOS
    // =====================================================

    useEffect(() => {
        const handleKeyDown = (event) => {
            const isSearchShortcut =
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "k";

            if (!isSearchShortcut) {
                return;
            }

            event.preventDefault();

            searchInputRef.current?.focus();
            searchInputRef.current?.select?.();
        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, []);

    // =====================================================
    // FETCH PROJECTS
    //
    // Original API contract preserved.
    // =====================================================

    const fetchProjects = useCallback(
        async (signal) => {
            if (signal?.aborted) {
                return;
            }

            // =============================================
            // REDUX START
            // =============================================

            dispatch(getProjectStart());

            try {
                const response =
                    await ProjectService.getAllProjects({
                        page: currentPage,
                        pageSize: PAGE_SIZE,
                        search: debouncedSearch,
                        signal,
                    });

                // =========================================
                // PREVENT STALE UPDATES
                // =========================================

                if (signal?.aborted) {
                    return;
                }

                // =========================================
                // REDUX SUCCESS
                // =========================================

                dispatch(
                    getProjectSuccess(response)
                );

                // =========================================
                // PAGINATION METADATA
                // =========================================

                const count = safeNumber(
                    response?.count
                );

                setPagination({
                    count,
                    next: response?.next ?? null,
                    previous: response?.previous ?? null,
                });

                // =========================================
                // CORRECT INVALID PAGE
                //
                // Example:
                // Search reduces total page count.
                // =========================================

                const responseTotalPages =
                    count > 0
                        ? Math.ceil(count / PAGE_SIZE)
                        : 0;

                if (
                    responseTotalPages > 0 &&
                    currentPage > responseTotalPages
                ) {
                    setCurrentPage(responseTotalPages);
                }
            } catch (error) {
                // =========================================
                // IGNORE CANCELED REQUESTS
                // =========================================

                if (
                    signal?.aborted ||
                    isCanceledRequest(error)
                ) {
                    return;
                }

                console.error(
                    "Loyihalarni yuklashda xatolik:",
                    error
                );

                dispatch(
                    getProjectFailure(
                        getErrorMessage(error)
                    )
                );
            }
        },
        [
            dispatch,
            currentPage,
            debouncedSearch,
        ]
    );

    // =====================================================
    // INITIAL LOAD / PAGE / SEARCH / RETRY
    //
    // Every request has its own AbortController.
    // Cleanup aborts an obsolete request.
    // =====================================================

    useEffect(() => {
        const controller = new AbortController();

        fetchProjects(controller.signal);

        return () => {
            controller.abort();
        };
    }, [
        fetchProjects,
        retryKey,
    ]);

    // =====================================================
    // SEARCH CHANGE
    // =====================================================

    const handleSearchChange = useCallback(
        (event) => {
            setSearchTerm(event.target.value);
        },
        []
    );

    // =====================================================
    // CLEAR SEARCH
    // =====================================================

    const handleClearSearch = useCallback(() => {
        setSearchTerm("");
        setDebouncedSearch("");
        setCurrentPage(1);

        searchInputRef.current?.focus();
    }, []);

    // =====================================================
    // SCROLL TO PROJECTS
    // =====================================================

    const scrollToProjects = useCallback(() => {
        const reduceMotion =
            typeof window.matchMedia === "function" &&
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

        projectsSectionRef.current?.scrollIntoView({
            behavior: reduceMotion ? "auto" : "smooth",
            block: "start",
        });
    }, []);

    // =====================================================
    // PAGE CHANGE
    // =====================================================

    const handlePageChange = useCallback(
        (page) => {
            const nextPage = Number(page);

            if (
                !Number.isInteger(nextPage) ||
                nextPage < 1 ||
                nextPage > totalPages ||
                nextPage === currentPage ||
                project_isLoading
            ) {
                return;
            }

            setCurrentPage(nextPage);

            // Existing toolbar section is already in DOM.
            // No artificial delay required.
            scrollToProjects();
        },
        [
            currentPage,
            totalPages,
            project_isLoading,
            scrollToProjects,
        ]
    );

    // =====================================================
    // RETRY
    //
    // Reuse existing request lifecycle.
    // =====================================================

    const handleRetry = useCallback(() => {
        setRetryKey((previous) => previous + 1);
    }, []);

    // =====================================================
    // VIEW STATES
    // =====================================================

    const isLoading = Boolean(
        project_isLoading
    );

    const hasError =
        Boolean(project_error) &&
        !isLoading;

    const hasProjects =
        projectList.length > 0;

    // =====================================================
    // RENDER PROJECT GRID CONTENT
    // =====================================================

    const renderProjects = () => {
        // ================================================
        // LOADING
        // ================================================

        if (isLoading) {
            return Array.from({
                length: PAGE_SIZE,
            }).map((_, index) => (
                <ProjectCardSkeleton
                    key={`project-skeleton-${index}`}
                />
            ));
        }

        // ================================================
        // ERROR
        //
        // Error is shown by ProjectsErrorState.
        // Do not show stale project cards.
        // ================================================

        if (hasError) {
            return null;
        }

        // ================================================
        // PROJECT CARDS
        // ================================================

        if (hasProjects) {
            return projectList.map(
                (project, index) => (
                    <ProjectsPageCard
                        key={
                            project?.id ??
                            `project-${index}`
                        }

                        project={project}

                        index={
                            (currentPage - 1) *
                                PAGE_SIZE +
                            index
                        }
                    />
                )
            );
        }

        // ================================================
        // EMPTY STATE
        // ================================================

        return (
            <div className="col-span-full min-w-0">
                <ProjectsEmptyState
                    hasSearch={
                        Boolean(debouncedSearch)
                    }

                    onClearSearch={
                        handleClearSearch
                    }
                />
            </div>
        );
    };

    // =====================================================
    // JSX
    // =====================================================

    return (
        <main
            id="projects-directory"
            className="
                relative
                isolate

                min-h-screen
                w-full
                min-w-0

                overflow-hidden

                bg-[#edf4ff]
                text-slate-900

                px-4
                pb-16
                pt-24

                sm:px-6
                sm:pb-20

                md:pt-28

                lg:px-8

                dark:bg-[#060b15]
                dark:text-white
            "
        >
            {/* ======================================
                SHARED FUTURISTIC BACKGROUND

                The same component is used on:
                - Users
                - Problems
                - Feedback

                Includes:
                - Continuous grid
                - Circuit / network lines
                - Glowing nodes
                - Glass-like 3D cubes
                - Cyan / Indigo / Violet glows
                - FS watermark

                Decorative only:
                Does not intercept clicks or scrolling.
            ====================================== */}

            <PageGridBackground showMonogram />

            {/* ======================================
                CONTENT CONTAINER

                Keep every interactive element
                above the background.
            ====================================== */}

            <div
                className="
                    relative
                    z-10

                    mx-auto
                    w-full
                    min-w-0
                    max-w-7xl
                "
            >
                {/* ==================================
                    HEADER

                    Contains:
                    - Project hub heading
                    - Search field
                    - Ctrl / Cmd + K hint
                ================================== */}

                <ProjectsHeader
                    searchInputRef={
                        searchInputRef
                    }

                    searchTerm={
                        searchTerm
                    }

                    onSearchChange={
                        handleSearchChange
                    }

                    onClearSearch={
                        handleClearSearch
                    }
                />

                {/* ==================================
                    TOOLBAR

                    Shows:
                    - Number of projects
                    - Current page range
                    - Current search
                ================================== */}

                <ProjectsToolbar
                    sectionRef={
                        projectsSectionRef
                    }

                    isLoading={
                        isLoading
                    }

                    count={
                        totalCount
                    }

                    rangeStart={
                        rangeStart
                    }

                    rangeEnd={
                        rangeEnd
                    }

                    search={
                        debouncedSearch
                    }
                />

                {/* ==================================
                    ERROR / RETRY
                ================================== */}

                <ProjectsErrorState
                    error={
                        hasError
                            ? project_error
                            : null
                    }

                    onRetry={
                        handleRetry
                    }
                />

                {/* ==================================
                    PROJECTS GRID
                ================================== */}

                {!hasError && (
                    <section
                        aria-label="Loyihalar ro‘yxati"
                        aria-busy={isLoading}

                        className="
                            mt-5

                            grid
                            min-w-0
                            grid-cols-1

                            items-stretch

                            gap-4

                            sm:gap-5

                            xl:grid-cols-2
                        "
                    >
                        {renderProjects()}
                    </section>
                )}

                {/* ==================================
                    PAGINATION
                ================================== */}

                {!hasError && (
                    <ProjectsPagination
                        currentPage={
                            currentPage
                        }

                        totalPages={
                            totalPages
                        }

                        items={
                            paginationItems
                        }

                        isLoading={
                            isLoading
                        }

                        onPageChange={
                            handlePageChange
                        }
                    />
                )}
            </div>
        </main>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(Projects);
