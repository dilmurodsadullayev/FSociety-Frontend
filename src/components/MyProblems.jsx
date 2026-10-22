
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
  Puzzle,
  Search,
  Terminal,
} from "lucide-react";

// =========================================================
// REDUX
// =========================================================

import {
  getMyProblemStart,
  getMyProblemSuccess,
  getMyProblemtFailure,
} from "../features/problems/Problems";

// =========================================================
// SERVICES
// =========================================================

import ProblemService from "../services/problems";

// =========================================================
// UNIVERSAL UI
// =========================================================

import {
  siteToast,
} from "./ui/AuthToast";

import PageGridBackground from "./ui/PageGridBackground";

// =========================================================
// MY PROBLEMS COMPONENTS
// =========================================================

import MyProblemCard from "./my-problems/MyProblemCard";

import MyProblemCardSkeleton from "./my-problems/MyProblemCardSkeleton";

import MyProblemsHeader from "./my-problems/MyProblemsHeader";

import MyProblemsSearch from "./my-problems/MyProblemsSearch";

import MyProblemsEmptyState from "./my-problems/MyProblemsEmptyState";

import MyProblemsErrorState from "./my-problems/MyProblemsErrorState";

import MyProblemsPagination from "./my-problems/MyProblemsPagination";

// =========================================================
// HELPERS
// =========================================================

import {
  getMyProblemsErrorMessage,
  getMyProblemsPaginationItems,
  MY_PROBLEMS_PAGE_SIZE,
  MY_PROBLEMS_SEARCH_DELAY,
} from "./my-problems/myProblemHelpers";

// =========================================================
// CONSTANTS
// =========================================================

const EMPTY_PROBLEMS = [];

const FALLBACK_ERROR =
  "Muammolarni yuklashda xatolik yuz berdi. Qayta urinib ko‘ring.";

// =========================================================
// REDUX SELECTOR
// =========================================================

const selectProblemState = (state) =>
  state.problem;

// =========================================================
// HELPERS
// =========================================================

const getRequestKey = (
  page,
  search
) =>
  JSON.stringify([
    page,
    search,
  ]);

const isCanceledRequest = (error) =>
  error?.code === "ERR_CANCELED" ||
  error?.name === "CanceledError";

const getSafeCount = (value) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? Math.max(0, Math.trunc(number))
    : 0;
};

// =========================================================
// MY PROBLEMS
// =========================================================

function MyProblems() {
  // =====================================================
  // REDUX
  // =====================================================

  const dispatch = useDispatch();

  const problemState = useSelector(
    selectProblemState
  );

  const {
    myProblems,
    myProblemsCount,
    myProblemsIsLoading,
    isLoading: legacyIsLoading,
  } = problemState || {};

  // =====================================================
  // LOADING STATE
  // =====================================================

  const isLoading = Boolean(
    myProblemsIsLoading ??
    legacyIsLoading ??
    false
  );

  // =====================================================
  // REFS
  // =====================================================

  const problemsGridRef = useRef(null);

  const latestRequestRef = useRef(0);

  const mountedRef = useRef(false);

  // =====================================================
  // PAGINATION STATE
  // =====================================================

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  // =====================================================
  // SEARCH STATE
  // =====================================================

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    debouncedSearch,
    setDebouncedSearch,
  ] = useState("");

  // =====================================================
  // REQUEST STATE
  // =====================================================

  const [
    loadedRequestKey,
    setLoadedRequestKey,
  ] = useState(null);

  const [
    failedRequest,
    setFailedRequest,
  ] = useState({
    key: null,
    message: null,
  });

  // =====================================================
  // MOUNT / UNMOUNT
  // =====================================================

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      latestRequestRef.current += 1;
    };
  }, []);

  // =====================================================
  // SAFE PROBLEM LIST
  // =====================================================

  const problemList = useMemo(
    () =>
      Array.isArray(myProblems)
        ? myProblems
        : EMPTY_PROBLEMS,
    [myProblems]
  );

  // =====================================================
  // TOTAL COUNT
  // =====================================================

  const totalCount = getSafeCount(
    myProblemsCount
  );

  // =====================================================
  // TOTAL PAGES
  // =====================================================

  const totalPages = useMemo(() => {
    if (totalCount <= 0) {
      return 0;
    }

    return Math.ceil(
      totalCount /
        MY_PROBLEMS_PAGE_SIZE
    );
  }, [totalCount]);

  // =====================================================
  // PAGINATION ITEMS
  // =====================================================

  const pageItems = useMemo(
    () =>
      getMyProblemsPaginationItems(
        currentPage,
        totalPages
      ),
    [
      currentPage,
      totalPages,
    ]
  );

  // =====================================================
  // CURRENT REQUEST KEY
  // =====================================================

  const currentRequestKey = useMemo(
    () =>
      getRequestKey(
        currentPage,
        debouncedSearch
      ),
    [
      currentPage,
      debouncedSearch,
    ]
  );

  // =====================================================
  // SEARCH INFORMATION
  // =====================================================

  const normalizedInput =
    searchTerm.trim();

  const isTypingSearch =
    normalizedInput !==
    debouncedSearch;

  const hasSearch = Boolean(
    debouncedSearch
  );

  // =====================================================
  // CURRENT QUERY VALIDITY
  // =====================================================

  const hasLoadedCurrentQuery =
    !isTypingSearch &&
    loadedRequestKey ===
      currentRequestKey;

  // =====================================================
  // CURRENT ERROR
  // =====================================================

  const currentError =
    !isTypingSearch &&
    failedRequest.key ===
      currentRequestKey
      ? failedRequest.message
      : null;

  // =====================================================
  // SEARCH DEBOUNCE
  // =====================================================

  useEffect(() => {
    const timeoutId =
      window.setTimeout(
        () => {
          if (!mountedRef.current) {
            return;
          }

          setDebouncedSearch(
            searchTerm.trim()
          );
        },
        MY_PROBLEMS_SEARCH_DELAY
      );

    return () => {
      window.clearTimeout(
        timeoutId
      );
    };
  }, [searchTerm]);

  // =====================================================
  // FETCH MY PROBLEMS
  // =====================================================

  const getMyProblems = useCallback(
    async (
      page = 1,
      term = ""
    ) => {
      if (!mountedRef.current) {
        return false;
      }

      const safePage = Math.max(
        1,
        Math.trunc(
          Number(page) || 1
        )
      );

      const safeTerm = String(
        term ?? ""
      ).trim();

      const requestKey =
        getRequestKey(
          safePage,
          safeTerm
        );

      // =================================================
      // REQUEST IDENTIFIER
      // =================================================

      const requestId =
        ++latestRequestRef.current;

      // =================================================
      // RESET ERROR
      // =================================================

      setFailedRequest({
        key: null,
        message: null,
      });

      dispatch(
        getMyProblemStart()
      );

      try {
        let response;

        // ===============================================
        // SEARCH OR NORMAL REQUEST
        // ===============================================

        if (safeTerm) {
          response =
            await ProblemService
              .getMyProblemSearch(
                safeTerm,
                safePage
              );
        } else {
          response =
            await ProblemService
              .getMyProblemsList(
                safePage
              );
        }

        // ===============================================
        // IGNORE STALE RESPONSES
        // ===============================================

        if (
          !mountedRef.current ||
          latestRequestRef.current !==
            requestId
        ) {
          return false;
        }

        // ===============================================
        // REDUX SUCCESS
        // ===============================================

        dispatch(
          getMyProblemSuccess(
            response
          )
        );

        setLoadedRequestKey(
          requestKey
        );

        setFailedRequest({
          key: null,
          message: null,
        });

        return true;
      } catch (requestError) {
        if (
          !mountedRef.current ||
          latestRequestRef.current !==
            requestId ||
          isCanceledRequest(
            requestError
          )
        ) {
          return false;
        }

        console.error(
          "My Problems API xatosi:",
          requestError
        );

        // ===============================================
        // HTTP ERROR
        // ===============================================

        const status =
          requestError?.response?.status;

        const unauthorized =
          status === 401;

        const message = unauthorized
          ? (
              "Bu shaxsiy sahifa. " +
              "Davom etish uchun avval " +
              "tizimga kiring."
            )
          : (
              getMyProblemsErrorMessage(
                requestError
              ) ||
              FALLBACK_ERROR
            );

        // ===============================================
        // REDUX FAILURE
        // ===============================================

        dispatch(
          getMyProblemtFailure(
            message
          )
        );

        setFailedRequest({
          key: requestKey,
          message,
        });

        // ===============================================
        // UNIVERSAL TOAST
        // ===============================================

        if (unauthorized) {
          siteToast.warning(
            message,
            {
              id: "my-problems-auth-error",
              title: "Kirish talab qilinadi",
              duration: 4000,
            }
          );
        } else {
          siteToast.error(
            message,
            {
              id: "my-problems-load-error",
              title: "Muammolar yuklanmadi",
              duration: 4500,
            }
          );
        }

        return false;
      }
    },
    [dispatch]
  );

  // =====================================================
  // FETCH EFFECT
  // =====================================================

  useEffect(() => {
    if (isTypingSearch) {
      return;
    }

    getMyProblems(
      currentPage,
      debouncedSearch
    );
  }, [
    currentPage,
    debouncedSearch,
    isTypingSearch,
    getMyProblems,
  ]);

  // =====================================================
  // SEARCH CHANGE
  // =====================================================

  const handleSearchChange = useCallback(
    (event) => {
      const value =
        event?.target?.value ?? "";

      setSearchTerm(value);

      setCurrentPage(1);
    },
    []
  );

  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  const handleClearSearch = useCallback(
    () => {
      setSearchTerm("");

      setDebouncedSearch("");

      setCurrentPage(1);
    },
    []
  );

  // =====================================================
  // PAGE CHANGE
  // =====================================================

  const handlePageChange = useCallback(
    (page) => {
      const nextPage = Number(
        page
      );

      if (
        !Number.isInteger(nextPage) ||
        nextPage < 1 ||
        nextPage > totalPages ||
        nextPage === currentPage ||
        isLoading ||
        isTypingSearch
      ) {
        return;
      }

      setCurrentPage(
        nextPage
      );

      // Scroll to problem results.

      const prefersReducedMotion =
        window.matchMedia?.(
          "(prefers-reduced-motion: reduce)"
        )?.matches ?? false;

      problemsGridRef.current?.scrollIntoView({
        behavior: prefersReducedMotion
          ? "auto"
          : "smooth",
        block: "start",
      });
    },
    [
      currentPage,
      totalPages,
      isLoading,
      isTypingSearch,
    ]
  );

  // =====================================================
  // CORRECT INVALID PAGE
  // =====================================================

  useEffect(() => {
    if (
      !hasLoadedCurrentQuery ||
      isLoading ||
      currentError
    ) {
      return;
    }

    if (
      totalPages === 0 &&
      currentPage > 1
    ) {
      setCurrentPage(1);
      return;
    }

    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      setCurrentPage(
        totalPages
      );
    }
  }, [
    hasLoadedCurrentQuery,
    isLoading,
    currentError,
    currentPage,
    totalPages,
  ]);

  // =====================================================
  // RETRY
  // =====================================================

  const handleRetry = useCallback(
    () => {
      if (
        isLoading ||
        isTypingSearch
      ) {
        return;
      }

      getMyProblems(
        currentPage,
        debouncedSearch
      );
    },
    [
      isLoading,
      isTypingSearch,
      currentPage,
      debouncedSearch,
      getMyProblems,
    ]
  );

  // =====================================================
  // VIEW STATES
  // =====================================================

  const showSkeleton =
    isTypingSearch ||
    (
      !hasLoadedCurrentQuery &&
      !currentError
    );

  const showError =
    Boolean(currentError) &&
    !showSkeleton;

  const showCards =
    !showSkeleton &&
    hasLoadedCurrentQuery &&
    problemList.length > 0;

  const showEmpty =
    !showSkeleton &&
    !showError &&
    !isLoading &&
    hasLoadedCurrentQuery &&
    problemList.length === 0;

  const showPagination =
    !showSkeleton &&
    hasLoadedCurrentQuery &&
    problemList.length > 0 &&
    totalPages > 1;

  // =====================================================
  // DISPLAY COUNTS
  // =====================================================

  const visibleTotalCount =
    hasLoadedCurrentQuery
      ? totalCount
      : 0;

  const visibleCount =
    showCards
      ? problemList.length
      : 0;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main
      id="my-problems-hero"
      className="
        relative isolate
        min-h-screen
        w-full min-w-0
        overflow-hidden

        bg-[#f7faff]
        font-sans
        text-slate-900

        dark:bg-[#050a14]
        dark:text-slate-100
      "
    >
      {/* ==========================================
          SHARED BACKGROUND
      ========================================== */}

      <PageGridBackground
        showMonogram
        showCubes
      />

      {/* ==========================================
          MAIN CONTAINER
      ========================================== */}

      <div
        className="
          relative z-10

          mx-auto
          w-full min-w-0
          max-w-7xl

          px-3
          pb-16 pt-24

          sm:px-4
          sm:pb-20
          sm:pt-28

          md:px-6
          lg:px-8
        "
      >
        {/* ======================================
            COMPACT HEADER
        ====================================== */}

        <MyProblemsHeader
          totalCount={
            visibleTotalCount
          }
        />

        {/* ======================================
            SEARCH
        ====================================== */}

        <MyProblemsSearch
          value={searchTerm}
          onChange={handleSearchChange}
          onClear={handleClearSearch}
          isLoading={
            isLoading ||
            isTypingSearch
          }
        />

        {/* ======================================
            ERROR
        ====================================== */}

        {showError && (
          <MyProblemsErrorState
            error={currentError}
            onRetry={handleRetry}
            isLoading={isLoading}
          />
        )}

        {/* ======================================
            RESULTS SECTION
        ====================================== */}

        <section
          aria-label="Mening muammolarim ro‘yxati"
          className="
            relative w-full min-w-0
          "
        >
          {/* ==================================
              RESULTS HEADER
          ================================== */}

          <div
            ref={problemsGridRef}
            className="
              mb-5
              flex min-w-0

              scroll-mt-28
              flex-col gap-3

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            {/* LEFT */}
            <div className="min-w-0">
              <div
                className="
                  flex min-w-0
                  items-center gap-2
                "
              >
                {/* ===================================
                    SAME PUZZLE ICON AS NAVBAR
                =================================== */}

                <span
                  aria-hidden="true"
                  className="
                    inline-flex
                    h-8 w-8
                    shrink-0

                    items-center
                    justify-center

                    rounded-lg

                    border border-indigo-200
                    bg-indigo-50

                    text-indigo-600

                    dark:border-indigo-400/20
                    dark:bg-indigo-400/[0.08]
                    dark:text-indigo-300
                  "
                >
                  <Puzzle
                    size={16}
                    strokeWidth={1.9}
                  />
                </span>

                <div className="min-w-0">
                  <p
                    className="
                      truncate
                      font-mono
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.13em]

                      text-indigo-600

                      dark:text-indigo-400
                    "
                  >
                    FSOCIETY://MY_PROBLEMS
                  </p>

                  <h2
                    className="
                      mt-0.5

                      text-[14px]
                      font-extrabold

                      text-slate-900

                      dark:text-slate-100

                      sm:text-[15px]
                    "
                  >
                    Muammolar ro‘yxati
                  </h2>
                </div>
              </div>

              {/* RESULTS DESCRIPTION */}
              <p
                aria-live="polite"
                className="
                  mt-2 min-w-0
                  break-words

                  text-[11px]
                  font-medium
                  leading-5

                  text-slate-500

                  dark:text-slate-400
                "
              >
                {showSkeleton ? (
                  "Natijalar yuklanmoqda..."
                ) : hasSearch ? (
                  <>
                    <Search
                      size={12}
                      className="
                        mr-1
                        inline-block
                        align-[-2px]
                      "
                      aria-hidden="true"
                    />

                    “{debouncedSearch}”
                    {" — "}
                    {visibleTotalCount.toLocaleString(
                      "uz-UZ"
                    )}
                    {" ta natija"}
                  </>
                ) : (
                  <>
                    {visibleTotalCount.toLocaleString(
                      "uz-UZ"
                    )}
                    {" ta muammo"}
                  </>
                )}
              </p>
            </div>

            {/* RIGHT */}
            <div
              className="
                flex min-w-0
                flex-wrap
                items-center gap-2

                sm:justify-end
              "
            >
              {/* LOADING */}
              {isLoading &&
                !showSkeleton && (
                  <span
                    role="status"
                    className="
                      inline-flex
                      items-center gap-1.5

                      rounded-lg
                      border border-indigo-200
                      bg-indigo-50

                      px-2.5 py-1.5

                      text-[10px]
                      font-semibold

                      text-indigo-700

                      dark:border-indigo-400/20
                      dark:bg-indigo-400/10
                      dark:text-indigo-300
                    "
                  >
                    <Loader2
                      size={13}
                      className="
                        motion-safe:animate-spin
                      "
                      aria-hidden="true"
                    />

                    Yangilanmoqda...
                  </span>
                )}

              {/* RECORD COUNT */}
              {showCards && (
                <span
                  className="
                    inline-flex
                    min-h-8
                    items-center

                    rounded-lg
                    border border-slate-200

                    bg-white/80
                    px-3 py-1.5

                    font-mono
                    text-[10px]
                    font-bold
                    tabular-nums

                    text-slate-600

                    dark:border-white/[0.09]
                    dark:bg-[#0e1521]/80
                    dark:text-slate-300
                  "
                >
                  {visibleCount} RECORDS
                </span>
              )}

              {/* PAGE NUMBER */}
              {totalPages > 0 &&
                hasLoadedCurrentQuery && (
                  <span
                    className="
                      inline-flex
                      min-h-8
                      items-center

                      rounded-lg
                      border border-slate-200

                      bg-white/80
                      px-3 py-1.5

                      font-mono
                      text-[10px]
                      font-bold
                      tabular-nums

                      text-slate-600

                      dark:border-white/[0.09]
                      dark:bg-[#0e1521]/80
                      dark:text-slate-300
                    "
                  >
                    PAGE {currentPage}/{totalPages}
                  </span>
                )}
            </div>
          </div>

          {/* ==================================
              GRID
          ================================== */}

          <div
            aria-busy={
              showSkeleton ||
              isLoading
            }
            className="
              grid min-w-0
              grid-cols-1
              items-stretch

              gap-4

              md:grid-cols-2
              md:gap-5

              xl:grid-cols-3
              xl:gap-6
            "
          >
            {/* =================================
                SKELETON
            ================================= */}

            {showSkeleton &&
              Array.from({
                length:
                  MY_PROBLEMS_PAGE_SIZE,
              }).map((_, index) => (
                <MyProblemCardSkeleton
                  key={`my-problem-skeleton-${index}`}
                />
              ))}

            {/* =================================
                PROBLEM CARDS
            ================================= */}

            {showCards &&
              problemList.map(
                (problem, index) => (
                  <MyProblemCard
                    key={
                      problem?.id ??
                      `problem-${index}`
                    }

                    problem={problem}

                    id={problem?.id}

                    username={
                      problem?.user?.username
                    }

                    firstName={
                      problem?.user?.first_name
                    }

                    lastName={
                      problem?.user?.last_name
                    }

                    image={
                      problem?.user?.image
                    }

                    name={
                      problem?.problem
                    }

                    description={
                      problem?.description
                    }

                    status={
                      problem?.status ??
                      Boolean(
                        problem?.is_solved
                      )
                    }

                    isSolved={
                      Boolean(
                        problem?.is_solved
                      )
                    }

                    isUrgent={
                      Boolean(
                        problem?.is_urgent
                      )
                    }

                    deadline={
                      problem?.deadline
                    }

                    views={
                      problem?.total_views ??
                      problem?.views_count ??
                      0
                    }

                    star={
                      problem?.star ??
                      problem?.total_stars ??
                      0
                    }

                    responseCount={
                      problem?.response_count ??
                      problem?.total_responses ??
                      0
                    }

                    languages={
                      problem?.languages_data ??
                      problem?.language_data ??
                      []
                    }

                    technologies={
                      problem?.technologies_data ??
                      problem?.technology_data ??
                      []
                    }

                    createdAt={
                      problem?.created_at
                    }

                    offeredCoins={
                      problem?.offered_coins ??
                      0
                    }
                  />
                )
              )}

            {/* =================================
                EMPTY STATE
            ================================= */}

            {showEmpty && (
              <MyProblemsEmptyState
                searchTerm={
                  debouncedSearch
                }
                onClearSearch={
                  handleClearSearch
                }
              />
            )}
          </div>

          {/* ==================================
              PAGINATION
          ================================== */}

          {showPagination && (
            <MyProblemsPagination
              currentPage={
                currentPage
              }

              totalPages={
                totalPages
              }

              items={
                pageItems
              }

              onPageChange={
                handlePageChange
              }

              isLoading={
                isLoading
              }
            />
          )}

          {/* ==================================
              ACCESSIBILITY
          ================================== */}

          {showSkeleton && (
            <p
              role="status"
              className="sr-only"
            >
              Muammolar yuklanmoqda.
            </p>
          )}
        </section>

        {/* ======================================
            FOOTER
        ====================================== */}

        <div
          className="
            mt-10
            flex min-w-0
            flex-wrap items-center
            justify-between

            gap-x-4 gap-y-2

            border-t
            border-slate-200/80

            pt-4

            font-mono
            text-[9px]
            font-medium
            uppercase
            tracking-[0.08em]

            text-slate-400

            dark:border-white/[0.07]
            dark:text-slate-500
          "
        >
          <span
            className="
              inline-flex
              items-center gap-2
            "
          >
            <Terminal
              size={13}
              aria-hidden="true"
            />

            FSOCIETY / FIX_SOCIETY
          </span>

          <span>
            PROBLEM MANAGEMENT SYSTEM
          </span>
        </div>
      </div>
    </main>
  );
}

export default MyProblems;
