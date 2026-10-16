
import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import { useDispatch } from "react-redux";

import {
    similarProblemsStart,
    similarProblemsSuccess,
    similarProblemsFailure,
} from "../../features/problems/Problems";

import ProblemService from "../../services/problems";

import {
    getSimilarProblemsError,
    hasSimilarProblemId,
    prepareSimilarProblems,
} from "./similarProblemsHelpers";

// =========================================================
// FSOCIETY — SIMILAR PROBLEMS HOOK
//
// Preserved:
// - ProblemService.getSimilarProblems
// - Redux start/success/failure
// - Retry
// - Error handling
//
// Improved:
// - Current problem isolation
// - Stale request protection
// - Safe unmount cleanup
// - No stale Redux list flash
// - Background refresh support
// =========================================================

const createInitialState = (key) => ({
    key,
    problems: [],
    loading: true,
    loaded: false,
    error: "",
});

const useSimilarProblems = ({
    problemId,
}) => {
    const dispatch = useDispatch();

    // =====================================================
    // CURRENT PROBLEM KEY
    // =====================================================

    const problemKey = String(
        problemId ?? ""
    ).trim();

    const validProblemId = hasSimilarProblemId(
        problemId
    );

    // =====================================================
    // LOCAL VIEW
    //
    // Redux still receives the original actions.
    //
    // Local state prevents one problem's results
    // from appearing on another problem route.
    // =====================================================

    const [state, setState] = useState(
        () => createInitialState(problemKey)
    );

    // =====================================================
    // REQUEST VERSION
    // =====================================================

    const requestVersionRef = useRef(0);

    // =====================================================
    // FETCH SIMILAR PROBLEMS
    // =====================================================

    const fetchSimilarProblems = useCallback(
        async () => {
            const requestVersion =
                ++requestVersionRef.current;

            // =============================================
            // NO PROBLEM ID
            // =============================================

            if (!validProblemId) {
                setState({
                    key: problemKey,
                    problems: [],
                    loading: false,
                    loaded: true,
                    error: "",
                });

                return;
            }

            // =============================================
            // START
            // =============================================

            setState((previous) => ({
                key: problemKey,

                problems:
                    previous.key === problemKey
                        ? previous.problems
                        : [],

                loading: true,

                loaded:
                    previous.key === problemKey
                        ? previous.loaded
                        : false,

                error: "",
            }));

            dispatch(similarProblemsStart());

            // =============================================
            // API REQUEST
            // =============================================

            try {
                const response =
                    await ProblemService.getSimilarProblems(
                        problemId
                    );

                // Ignore outdated requests.
                if (
                    requestVersion !==
                    requestVersionRef.current
                ) {
                    return;
                }

                const normalized =
                    prepareSimilarProblems(
                        response,
                        problemId
                    );

                // Keep existing Redux contract.
                dispatch(
                    similarProblemsSuccess(normalized)
                );

                setState({
                    key: problemKey,

                    problems: normalized,

                    loading: false,
                    loaded: true,

                    error: "",
                });
            } catch (error) {
                if (
                    requestVersion !==
                    requestVersionRef.current
                ) {
                    return;
                }

                console.error(
                    "O‘xshash muammolarni yuklashda xatolik:",
                    error
                );

                const message =
                    getSimilarProblemsError(error);

                dispatch(
                    similarProblemsFailure(message)
                );

                // Keep previous cards when a manual
                // refresh fails.
                setState((previous) => ({
                    key: problemKey,

                    problems:
                        previous.key === problemKey
                            ? previous.problems
                            : [],

                    loading: false,
                    loaded: true,

                    error: message,
                }));
            }
        },
        [
            dispatch,
            problemId,
            problemKey,
            validProblemId,
        ]
    );

    // =====================================================
    // INITIAL LOAD / ROUTE CHANGE
    //
    // Cleanup invalidates the previous request.
    // Also works with React StrictMode remounts.
    // =====================================================

    useEffect(() => {
        fetchSimilarProblems();

        return () => {
            requestVersionRef.current += 1;
        };
    }, [fetchSimilarProblems]);

    // =====================================================
    // CURRENT ROUTE PROTECTION
    // =====================================================

    const currentState =
        state.key === problemKey
            ? state
            : createInitialState(problemKey);

    // =====================================================
    // PUBLIC API
    // =====================================================

    return {
        problems: currentState.problems,

        isLoading: currentState.loading,
        isLoaded: currentState.loaded,

        error: currentState.error,

        fetchSimilarProblems,
    };
};

export default useSimilarProblems;
