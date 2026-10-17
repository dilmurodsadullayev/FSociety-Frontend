
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import ProblemService from "../../../services/problems";

import {
    getPopularProblemStart,
    getPopularProblemSuccess,
    getPopularProblemFailure,
} from "../../../features/problems/Problems";

// =========================================================
// CONSTANTS
// =========================================================

const EMPTY_PROBLEMS = [];

const RADAR_LIMIT = 3;

// =========================================================
// ERROR HELPERS
// =========================================================

const getPopularProblemsError = (error) => {
    const fallback =
        "Mashhur muammolarni yuklashda xatolik yuz berdi.";

    const data =
        error?.serverData ??
        error?.response?.data;

    const candidates = [
        typeof data === "string" ? data : "",
        data?.detail,
        data?.message,
        data?.error,
        error?.message,
    ];

    for (const candidate of candidates) {
        if (
            typeof candidate === "string" &&
            candidate.trim()
        ) {
            if (/<html|<!doctype/i.test(candidate)) {
                return fallback;
            }

            return candidate.trim();
        }

        if (Array.isArray(candidate)) {
            const message = candidate
                .filter(
                    (item) =>
                        typeof item === "string" &&
                        item.trim()
                )
                .join(", ");

            if (message) {
                return message;
            }
        }
    }

    return fallback;
};

const isCanceledRequest = (error) =>
    error?.name === "AbortError" ||
    error?.name === "CanceledError" ||
    error?.code === "ERR_CANCELED";

// =========================================================
// FSOCIETY HOME — POPULAR PROBLEMS HOOK
//
// Responsibilities:
//
// - Fetch popular problems
// - Preserve Redux integration
// - Use category-specific loading
// - Handle API errors
// - Retry failed requests
// - Abort outdated requests
// - Prepare top 3 radar problems
//
// API:
// ProblemService.getPopularProblemsList({ signal })
//
// Redux:
// state.problem
// =========================================================

const useHomePopularProblems = () => {
    const dispatch = useDispatch();

    // =====================================================
    // REDUX STATE
    // =====================================================

    const popularProblems = useSelector(
        (state) =>
            state.problem?.popularProblems ??
            EMPTY_PROBLEMS
    );

    const popularIsLoading = useSelector(
        (state) =>
            Boolean(
                state.problem?.popularIsLoading
            )
    );

    const popularError = useSelector(
        (state) =>
            state.problem?.popularError ?? null
    );

    // =====================================================
    // LOCAL STATE
    // =====================================================

    const [
        retryVersion,
        setRetryVersion,
    ] = useState(0);

    // =====================================================
    // SAFE POPULAR PROBLEMS
    // =====================================================

    const safePopularProblems = useMemo(
        () =>
            Array.isArray(popularProblems)
                ? popularProblems
                : EMPTY_PROBLEMS,
        [popularProblems]
    );

    // =====================================================
    // RADAR PROBLEMS
    // =====================================================

    const radarProblems = useMemo(
        () =>
            safePopularProblems.slice(
                0,
                RADAR_LIMIT
            ),
        [safePopularProblems]
    );

    // =====================================================
    // FETCH
    //
    // AbortController is supported by
    // ProblemService.getPopularProblemsList().
    //
    // Cleanup prevents obsolete responses
    // from changing the current page.
    // =====================================================

    useEffect(() => {
        let active = true;

        const controller =
            new AbortController();

        const fetchPopularProblems = async () => {
            dispatch(
                getPopularProblemStart()
            );

            try {
                const response =
                    await ProblemService
                        .getPopularProblemsList({
                            signal:
                                controller.signal,
                        });

                if (
                    !active ||
                    controller.signal.aborted
                ) {
                    return;
                }

                dispatch(
                    getPopularProblemSuccess(
                        response
                    )
                );
            } catch (error) {
                if (
                    !active ||
                    controller.signal.aborted ||
                    isCanceledRequest(error)
                ) {
                    return;
                }

                const message =
                    getPopularProblemsError(error);

                dispatch(
                    getPopularProblemFailure(
                        message
                    )
                );
            }
        };

        fetchPopularProblems();

        return () => {
            active = false;
            controller.abort();
        };
    }, [
        dispatch,
        retryVersion,
    ]);

    // =====================================================
    // RETRY
    // =====================================================

    const retry = useCallback(() => {
        setRetryVersion(
            (previous) => previous + 1
        );
    }, []);

    // =====================================================
    // RETURN
    // =====================================================

    return {
        popularProblems: safePopularProblems,
        radarProblems,

        popularCount:
            safePopularProblems.length,

        isLoading:
            popularIsLoading,

        error:
            popularError,

        retry,
    };
};

export default useHomePopularProblems;
