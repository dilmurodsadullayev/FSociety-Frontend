
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    useSearchParams,
} from "react-router-dom";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    getProblemFailure,
    getProblemStart,
    getProblemSuccess,

    getLanguagesFailure,
    getLanguagesStart,
    getLanguagesSuccess,

    getTechnologiesFailure,
    getTechnologiesStart,
    getTechnologiesSuccess,
} from "../../features/problems/Problems";

import ProblemService, {
    isProblemRequestCanceled,
} from "../../services/problems";

import { siteToast } from "../ui/AuthToast";

import {
    PROBLEMS_PAGE_SIZE,
    PROBLEMS_SEARCH_DEBOUNCE_MS,

    buildResetProblemSearchParams,
    buildUpdatedProblemSearchParams,

    getProblemErrorMessage,
    getProblemQueryCorrections,
    getProblemQueryState,
    getProblemResultRange,
    getProblemTotalPages,

    hasActiveProblemFilters,
} from "./problemPageHelpers";

// =========================================================
// FSOCIETY — USE PROBLEMS PAGE
//
// Responsibilities:
// - Read Redux problem state
// - URL query synchronization
// - Search debounce
// - Search and filter handlers
// - Catalog API calls
// - Problems API calls
// - Request cancellation
// - Stale response protection
// - Retry
// - Pagination and result ranges
// - Query-aware loading and errors
//
// Keeps the original Redux actions and service API.
// =========================================================

// =========================================================
// GENERAL HELPERS
// =========================================================

const getSafeCount = (value) => {
    const number = Number(value);

    if (
        !Number.isFinite(number) ||
        number < 0
    ) {
        return 0;
    }

    return Math.min(
        Number.MAX_SAFE_INTEGER,
        Math.floor(number)
    );
};

const isInvalidPaginationError = (error) => {
    const status =
        error?.response?.status ??
        error?.status ??
        null;

    if (status !== 404) {
        return false;
    }

    const data =
        error?.serverData ??
        error?.response?.data;

    const detail =
        typeof data === "string"
            ? data
            : data?.detail;

    if (typeof detail !== "string") {
        return false;
    }

    const normalized = detail
        .trim()
        .toLowerCase();

    return (
        normalized.includes("invalid page") ||
        normalized.includes("page contains no results")
    );
};

// =========================================================
// MAIN HOOK
// =========================================================

const useProblemsPage = () => {
    // =====================================================
    // REDUX
    // =====================================================

    const dispatch = useDispatch();

    const problemState = useSelector(
        (state) => state.problem || {}
    );

    const {
        problems = [],
        count = 0,

        languages = [],
        technologies = [],

        languagesIsLoading = false,
        technologiesIsLoading = false,
    } = problemState;

    const problemList = Array.isArray(problems)
        ? problems
        : [];

    const problemCount = getSafeCount(count);

    const safeLanguages = Array.isArray(languages)
        ? languages
        : [];

    const safeTechnologies = Array.isArray(technologies)
        ? technologies
        : [];

    // =====================================================
    // URL SEARCH PARAMS
    // =====================================================

    const [
        searchParams,
        setSearchParams,
    ] = useSearchParams();

    const queryState = useMemo(
        () => getProblemQueryState(searchParams),
        [searchParams]
    );

    const {
        page: currentPage,
        search: debouncedSearchTerm,
        status: statusFilter,
        urgent: urgentFilter,
        language: languageFilter,
        technology: technologyFilter,
        ordering,
    } = queryState;

    // =====================================================
    // URL CORRECTIONS
    // =====================================================

    const queryCorrections = useMemo(
        () => getProblemQueryCorrections(
            searchParams
        ),
        [searchParams]
    );

    const hasQueryCorrections =
        Object.keys(queryCorrections).length > 0;

    // =====================================================
    // CURRENT QUERY IDENTITY
    //
    // A successful request for a different URL
    // must not resolve the current URL.
    // =====================================================

    const currentQueryKey = useMemo(
        () => JSON.stringify([
            currentPage,
            debouncedSearchTerm,
            statusFilter,
            urgentFilter,
            languageFilter,
            technologyFilter,
            ordering,
        ]),
        [
            currentPage,
            debouncedSearchTerm,
            statusFilter,
            urgentFilter,
            languageFilter,
            technologyFilter,
            ordering,
        ]
    );

    // =====================================================
    // LOCAL STATE
    // =====================================================

    const [
        searchTerm,
        setSearchTerm,
    ] = useState(debouncedSearchTerm);

    const [
        retryKey,
        setRetryKey,
    ] = useState(0);

    const [
        lastSuccessfulQueryKey,
        setLastSuccessfulQueryKey,
    ] = useState(null);

    const [
        pendingQueryKey,
        setPendingQueryKey,
    ] = useState(null);

    const [
        failedQueryKey,
        setFailedQueryKey,
    ] = useState(null);

    const [
        requestError,
        setRequestError,
    ] = useState("");

    // =====================================================
    // REQUEST SEQUENCE
    //
    // AbortController is not enough when an
    // underlying API adapter ignores the signal.
    // =====================================================

    const requestSequenceRef = useRef(0);

    // =====================================================
    // URL UPDATE HELPER
    // =====================================================

    const updateQueryParams = useCallback(
        (updates, { replace = false } = {}) => {
            setSearchParams(
                (previousParams) =>
                    buildUpdatedProblemSearchParams(
                        previousParams,
                        updates
                    ),
                { replace }
            );
        },
        [setSearchParams]
    );

    // =====================================================
    // URL -> SEARCH INPUT
    //
    // Supports reload, Back and Forward navigation.
    // =====================================================

    useEffect(() => {
        setSearchTerm(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    // =====================================================
    // SEARCH INPUT -> URL
    //
    // Debounce prevents a request on every keystroke.
    // =====================================================

    useEffect(() => {
        const cleanSearch = searchTerm.trim();

        if (cleanSearch === debouncedSearchTerm) {
            return undefined;
        }

        const timeoutId = window.setTimeout(() => {
            updateQueryParams(
                {
                    search: cleanSearch,
                    page: 1,
                },
                { replace: true }
            );
        }, PROBLEMS_SEARCH_DEBOUNCE_MS);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [
        searchTerm,
        debouncedSearchTerm,
        updateQueryParams,
    ]);

    // =====================================================
    // CORRECT INVALID URL PARAMS
    //
    // Query normalization uses replace instead of
    // adding broken URLs to browser history.
    // =====================================================

    useEffect(() => {
        if (!hasQueryCorrections) {
            return;
        }

        updateQueryParams(
            queryCorrections,
            { replace: true }
        );
    }, [
        hasQueryCorrections,
        queryCorrections,
        updateQueryParams,
    ]);

    // =====================================================
    // LOAD LANGUAGES AND TECHNOLOGIES
    //
    // Catalog requests run in parallel.
    // =====================================================

    useEffect(() => {
        const controller = new AbortController();

        let active = true;

        const loadCatalog = async () => {
            dispatch(getLanguagesStart());
            dispatch(getTechnologiesStart());

            // Promise.resolve().then() also catches
            // synchronous service exceptions.
            const results = await Promise.allSettled([
                Promise.resolve().then(() =>
                    ProblemService.getLanguagesList({
                        signal: controller.signal,
                    })
                ),
                Promise.resolve().then(() =>
                    ProblemService.getTechnologiesList({
                        signal: controller.signal,
                    })
                ),
            ]);

            if (
                !active ||
                controller.signal.aborted
            ) {
                return;
            }

            const [
                languagesResult,
                technologiesResult,
            ] = results;

            // ============================================
            // LANGUAGES
            // ============================================

            if (
                languagesResult.status ===
                "fulfilled"
            ) {
                dispatch(
                    getLanguagesSuccess(
                        languagesResult.value
                    )
                );
            } else if (
                !isProblemRequestCanceled(
                    languagesResult.reason
                )
            ) {
                const message =
                    getProblemErrorMessage(
                        languagesResult.reason,
                        "Dasturlash tillarini yuklab bo‘lmadi."
                    );

                dispatch(
                    getLanguagesFailure(message)
                );

                siteToast.error(message, {
                    title: "Tillar yuklanmadi",
                });
            }

            // ============================================
            // TECHNOLOGIES
            // ============================================

            if (
                technologiesResult.status ===
                "fulfilled"
            ) {
                dispatch(
                    getTechnologiesSuccess(
                        technologiesResult.value
                    )
                );
            } else if (
                !isProblemRequestCanceled(
                    technologiesResult.reason
                )
            ) {
                const message =
                    getProblemErrorMessage(
                        technologiesResult.reason,
                        "Texnologiyalarni yuklab bo‘lmadi."
                    );

                dispatch(
                    getTechnologiesFailure(message)
                );

                siteToast.error(message, {
                    title: "Texnologiyalar yuklanmadi",
                });
            }
        };

        loadCatalog();

        return () => {
            active = false;
            controller.abort();
        };
    }, [dispatch]);

    // =====================================================
    // LOAD PROBLEMS
    //
    // Each request is tied to the exact query key.
    // =====================================================

    useEffect(() => {
        // Wait for invalid URL params to be corrected.
        if (hasQueryCorrections) {
            return undefined;
        }

        const controller = new AbortController();

        const requestId =
            ++requestSequenceRef.current;

        let active = true;

        const isCurrentRequest = () =>
            active &&
            !controller.signal.aborted &&
            requestId === requestSequenceRef.current;

        // ================================================
        // REQUEST START
        // ================================================

        setPendingQueryKey(currentQueryKey);
        setFailedQueryKey(null);
        setRequestError("");

        dispatch(getProblemStart());

        const loadProblems = async () => {
            try {
                // ========================================
                // API REQUEST — ORIGINAL CONTRACT
                // ========================================

                const response =
                    await ProblemService.getProblemsList({
                        page: currentPage,
                        pageSize: PROBLEMS_PAGE_SIZE,

                        search: debouncedSearchTerm,
                        status: statusFilter,

                        urgent:
                            urgentFilter === "all"
                                ? undefined
                                : urgentFilter,

                        language: languageFilter,
                        technology: technologyFilter,
                        ordering,

                        signal: controller.signal,
                    });

                // ========================================
                // IGNORE STALE RESULTS
                // ========================================

                if (!isCurrentRequest()) {
                    return;
                }

                // ========================================
                // REDUX SUCCESS
                // ========================================

                dispatch(getProblemSuccess(response));

                setLastSuccessfulQueryKey(
                    currentQueryKey
                );

                setFailedQueryKey(null);
                setRequestError("");
            } catch (error) {
                // ========================================
                // ABORT / CANCELLATION
                // ========================================

                if (
                    !isCurrentRequest() ||
                    isProblemRequestCanceled(error)
                ) {
                    return;
                }

                // ========================================
                // INVALID DRF PAGE
                // ========================================

                if (
                    currentPage > 1 &&
                    isInvalidPaginationError(error)
                ) {
                    updateQueryParams(
                        { page: 1 },
                        { replace: true }
                    );

                    return;
                }

                // ========================================
                // REAL API ERROR
                // ========================================

                const message =
                    getProblemErrorMessage(
                        error,
                        "Muammolarni yuklashda xatolik yuz berdi."
                    );

                dispatch(getProblemFailure(message));

                setFailedQueryKey(currentQueryKey);
                setRequestError(message);
            } finally {
                if (isCurrentRequest()) {
                    setPendingQueryKey(null);
                }
            }
        };

        loadProblems();

        return () => {
            active = false;
            controller.abort();
        };
    }, [
        currentQueryKey,
        currentPage,
        debouncedSearchTerm,
        statusFilter,
        urgentFilter,
        languageFilter,
        technologyFilter,
        ordering,

        dispatch,
        retryKey,
        hasQueryCorrections,
        updateQueryParams,
    ]);

    // =====================================================
    // QUERY-AWARE REQUEST STATUS
    // =====================================================

    const loading =
        pendingQueryKey === currentQueryKey &&
        !hasQueryCorrections;

    const isCurrentQueryResolved =
        lastSuccessfulQueryKey === currentQueryKey &&
        !hasQueryCorrections;

    const currentError =
        failedQueryKey === currentQueryKey
            ? requestError
            : null;

    const hasProblemData =
        problemList.length > 0;

    // =====================================================
    // PAGINATION VALUES
    // =====================================================

    const totalPages = useMemo(
        () => getProblemTotalPages({
            count: problemCount,
            pageSize: PROBLEMS_PAGE_SIZE,
        }),
        [problemCount]
    );

    // =====================================================
    // INVALID PAGE AFTER SUCCESS
    //
    // Handles a hypothetical 200 response with
    // an empty list for an out-of-range page.
    // =====================================================

    useEffect(() => {
        if (
            !isCurrentQueryResolved ||
            loading ||
            currentError ||
            currentPage <= totalPages
        ) {
            return;
        }

        updateQueryParams(
            { page: totalPages },
            { replace: true }
        );
    }, [
        isCurrentQueryResolved,
        loading,
        currentError,
        currentPage,
        totalPages,
        updateQueryParams,
    ]);

    // =====================================================
    // RESULT RANGE
    // =====================================================

    const resultRange = useMemo(
        () => getProblemResultRange({
            count: problemCount,
            page: currentPage,
            pageSize: PROBLEMS_PAGE_SIZE,
        }),
        [problemCount, currentPage]
    );

    const resultStart = isCurrentQueryResolved
        ? resultRange.start
        : 0;

    const resultEnd = isCurrentQueryResolved
        ? resultRange.end
        : 0;

    // =====================================================
    // ACTIVE FILTERS
    // =====================================================

    const hasActiveFilters =
        hasActiveProblemFilters({
            search: searchTerm,
            status: statusFilter,
            urgent: urgentFilter,
            language: languageFilter,
            technology: technologyFilter,
            ordering,
        });

    // =====================================================
    // CLEAR SEARCH
    // =====================================================

    const handleClearSearch = useCallback(() => {
        setSearchTerm("");

        updateQueryParams({
            search: "",
            page: 1,
        });
    }, [updateQueryParams]);

    // =====================================================
    // RESET ALL FILTERS
    // =====================================================

    const handleResetFilters = useCallback(() => {
        setSearchTerm("");

        setSearchParams((previousParams) =>
            buildResetProblemSearchParams(
                previousParams
            )
        );
    }, [setSearchParams]);

    // =====================================================
    // RETRY
    // =====================================================

    const handleRetry = useCallback(() => {
        if (loading) {
            return;
        }

        setRetryKey((previous) => previous + 1);
    }, [loading]);

    // =====================================================
    // GENERIC FILTER UPDATE
    // =====================================================

    const updateFilter = useCallback(
        (key, value) => {
            updateQueryParams({
                [key]: value,
                page: 1,
            });
        },
        [updateQueryParams]
    );

    // =====================================================
    // FILTER CALLBACKS
    // =====================================================

    const handleStatusChange = useCallback(
        (value) => updateFilter("status", value),
        [updateFilter]
    );

    const handleUrgentChange = useCallback(
        (value) => updateFilter("urgent", value),
        [updateFilter]
    );

    const handleLanguageChange = useCallback(
        (value) => updateFilter("language", value),
        [updateFilter]
    );

    const handleTechnologyChange = useCallback(
        (value) => updateFilter("technology", value),
        [updateFilter]
    );

    const handleOrderingChange = useCallback(
        (value) => updateFilter("ordering", value),
        [updateFilter]
    );

    // =====================================================
    // PAGE CHANGE
    // =====================================================

    const handlePageChange = useCallback(
        (page) => {
            const nextPage = Number(page);

            if (
                loading ||
                !isCurrentQueryResolved ||
                !Number.isSafeInteger(nextPage) ||
                nextPage < 1 ||
                nextPage > totalPages ||
                nextPage === currentPage
            ) {
                return;
            }

            updateQueryParams({ page: nextPage });

            if (typeof window !== "undefined") {
                const reducedMotion =
                    window.matchMedia?.(
                        "(prefers-reduced-motion: reduce)"
                    ).matches;

                window.scrollTo({
                    top: 0,
                    behavior: reducedMotion
                        ? "auto"
                        : "smooth",
                });
            }
        },
        [
            loading,
            isCurrentQueryResolved,
            totalPages,
            currentPage,
            updateQueryParams,
        ]
    );

    // =====================================================
    // DISPLAY STATES
    //
    // Old Redux results are not shown under a
    // different query's search filters.
    // =====================================================

    const showInitialSkeleton =
        !isCurrentQueryResolved &&
        !currentError;

    const showCards =
        isCurrentQueryResolved &&
        hasProblemData;

    const showEmptyState =
        isCurrentQueryResolved &&
        !loading &&
        !currentError &&
        !hasProblemData;

    const showPaginationArea =
        isCurrentQueryResolved &&
        !loading &&
        !currentError &&
        problemCount > 0;

    // =====================================================
    // PUBLIC API
    // =====================================================

    return {
        // Data
        problemList,
        problemCount,

        languages: safeLanguages,
        technologies: safeTechnologies,

        languagesIsLoading: Boolean(
            languagesIsLoading
        ),

        technologiesIsLoading: Boolean(
            technologiesIsLoading
        ),

        // Request
        loading,
        currentError,

        // Search
        searchTerm,
        setSearchTerm,
        debouncedSearchTerm,

        // Filters
        statusFilter,
        urgentFilter,
        languageFilter,
        technologyFilter,
        ordering,
        hasActiveFilters,

        // Pagination
        currentPage,
        totalPages,
        resultStart,
        resultEnd,

        // UI
        isCurrentQueryResolved,
        showInitialSkeleton,
        showCards,
        showEmptyState,
        showPaginationArea,

        // Actions
        handleClearSearch,
        handleResetFilters,
        handleRetry,

        handleStatusChange,
        handleUrgentChange,
        handleLanguageChange,
        handleTechnologyChange,
        handleOrderingChange,

        handlePageChange,
    };
};

export default useProblemsPage;
