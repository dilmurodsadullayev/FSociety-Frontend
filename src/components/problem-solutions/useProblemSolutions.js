
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import { useDispatch, useSelector } from "react-redux";

import {
    getProblemResponseStart,
    getProblemResponseSuccess,
} from "../../features/problemResponse/problemResponse";

import ProblemResponseService from "../../services/problemResponse";

import { siteToast } from "../ui/AuthToast";

import {
    copySolutionCode,
    getSolutionErrorMessage,
    getSolutionStarCount,
    normalizeSolutions,
    sameSolutionId,
    sortProblemSolutions,
} from "./problemSolutionsHelpers";

// =========================================================
// FSOCIETY — PROBLEM SOLUTIONS CONTROLLER
// =========================================================

const EMPTY_VIEW = {
    key: "",
    items: [],
    loading: true,
    loaded: false,
    error: "",
};

const useProblemSolutions = ({
    id,
    isSolved = false,
    refreshKey = 0,
    newResponse = null,
}) => {
    const dispatch = useDispatch();

    const { user: authUser, isLoggedIn } = useSelector(
        (state) => state.auth || {}
    );

    const problemKey = String(id ?? "").trim();
    const hasProblemId = problemKey !== "";

    const [view, setView] = useState({
        ...EMPTY_VIEW,
        key: problemKey,
    });

    const [starLoadingIds, setStarLoadingIds] = useState({});
    const [freshResponseId, setFreshResponseId] = useState(null);

    const responsesRef = useRef({
        key: problemKey,
        items: [],
    });

    const requestIdRef = useRef(0);
    const mountedRef = useRef(false);
    const starLocksRef = useRef(new Set());
    const freshTimerRef = useRef(null);
    const freshResponseRef = useRef(null);

    // =====================================================
    // LIFECYCLE
    // =====================================================

    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;
            requestIdRef.current += 1;

            if (freshTimerRef.current !== null) {
                window.clearTimeout(freshTimerRef.current);
                freshTimerRef.current = null;
            }
        };
    }, []);

    // =====================================================
    // CURRENT QUERY DATA
    // =====================================================

    const currentView =
        view.key === problemKey
            ? view
            : {
                ...EMPTY_VIEW,
                key: problemKey,
            };

    const responses = currentView.items;
    const isLoading = currentView.loading;
    const fetchError = currentView.error;

    // =====================================================
    // PUBLISH RESPONSES
    //
    // Keep local list for query isolation.
    // Preserve Redux updates for existing consumers.
    // =====================================================

    const publishResponses = useCallback(
        (nextValue) => {
            const previous =
                responsesRef.current.key === problemKey
                    ? responsesRef.current.items
                    : [];

            const next =
                typeof nextValue === "function"
                    ? nextValue(previous)
                    : nextValue;

            const normalized = normalizeSolutions(next);

            responsesRef.current = {
                key: problemKey,
                items: normalized,
            };

            setView((previousView) => ({
                key: problemKey,
                items: normalized,
                loading:
                    previousView.key === problemKey
                        ? previousView.loading
                        : false,
                loaded: true,
                error:
                    previousView.key === problemKey
                        ? previousView.error
                        : "",
            }));

            dispatch(getProblemResponseSuccess(normalized));
        },
        [dispatch, problemKey]
    );

    // =====================================================
    // FETCH SOLUTIONS
    // =====================================================

    const fetchSolutions = useCallback(
        async ({ silent = false } = {}) => {
            const requestId = ++requestIdRef.current;

            if (!hasProblemId) {
                responsesRef.current = {
                    key: problemKey,
                    items: [],
                };

                setView({
                    key: problemKey,
                    items: [],
                    loading: false,
                    loaded: true,
                    error: "",
                });

                return;
            }

            const previous =
                responsesRef.current.key === problemKey
                    ? responsesRef.current.items
                    : [];

            setView((current) => ({
                key: problemKey,
                items: previous,
                loading: true,
                loaded:
                    current.key === problemKey
                        ? current.loaded
                        : false,
                error: "",
            }));

            if (!silent && previous.length === 0) {
                dispatch(getProblemResponseStart());
            }

            try {
                const result =
                    await ProblemResponseService
                        .getProblemResponse(id);

                if (
                    !mountedRef.current ||
                    requestId !== requestIdRef.current
                ) {
                    return;
                }

                let fetched = normalizeSolutions(result);

                // Keep a newly submitted solution visible
                // while a potentially older GET is in flight.
                const fresh = freshResponseRef.current;

                if (
                    fresh?.id != null &&
                    !fetched.some((item) =>
                        sameSolutionId(item?.id, fresh.id)
                    )
                ) {
                    fetched = [fresh, ...fetched];
                }

                // Do not overwrite optimistic star values
                // while their mutation requests are pending.
                const currentItems =
                    responsesRef.current.key === problemKey
                        ? responsesRef.current.items
                        : [];

                fetched = fetched.map((item) => {
                    const itemId = String(item?.id ?? "");

                    if (!starLocksRef.current.has(itemId)) {
                        return item;
                    }

                    const pending = currentItems.find(
                        (currentItem) =>
                            sameSolutionId(
                                currentItem?.id,
                                item?.id
                            )
                    );

                    if (!pending) return item;

                    return {
                        ...item,
                        star_by_user: pending.star_by_user,
                        total_stars: getSolutionStarCount(pending),
                    };
                });

                publishResponses(fetched);

                setView((current) => ({
                    ...current,
                    key: problemKey,
                    loading: false,
                    loaded: true,
                    error: "",
                }));

                if (
                    fresh?.id != null &&
                    fetched.some(
                        (item) =>
                            sameSolutionId(item?.id, fresh.id)
                    )
                ) {
                    // The local insertion remains visible.
                    // A future canonical GET may replace it.
                }
            } catch (error) {
                if (
                    !mountedRef.current ||
                    requestId !== requestIdRef.current
                ) {
                    return;
                }

                const message = getSolutionErrorMessage(
                    error,
                    "Yechimlarni serverdan yuklab bo‘lmadi."
                );

                setView((current) => ({
                    ...current,
                    key: problemKey,
                    loading: false,
                    loaded: true,
                    error: message,
                }));

                // Prevent Redux loading from remaining active.
                if (!silent) {
                    dispatch(
                        getProblemResponseSuccess(
                            responsesRef.current.key === problemKey
                                ? responsesRef.current.items
                                : []
                        )
                    );
                }

                siteToast.error(message, {
                    title: "Yechimlar yuklanmadi",
                    duration: 4500,
                });
            }
        },
        [
            dispatch,
            hasProblemId,
            id,
            problemKey,
            publishResponses,
        ]
    );

    // =====================================================
    // INITIAL LOAD / REFRESH
    // =====================================================

    useEffect(() => {
        const sameProblem =
            responsesRef.current.key === problemKey;

        if (!sameProblem) {
            responsesRef.current = {
                key: problemKey,
                items: [],
            };

            freshResponseRef.current = null;
            starLocksRef.current.clear();
            setStarLoadingIds({});
            setFreshResponseId(null);
        }

        const hasExistingData =
            responsesRef.current.items.length > 0;

        fetchSolutions({
            silent: hasExistingData,
        });

        return () => {
            requestIdRef.current += 1;
        };
    }, [
        problemKey,
        refreshKey,
        isSolved,
        fetchSolutions,
    ]);

    // =====================================================
    // INSTANT NEW SOLUTION
    // =====================================================

    useEffect(() => {
        const created = normalizeSolutions(newResponse)[0];

        if (!hasProblemId || created?.id == null) {
            return undefined;
        }

        freshResponseRef.current = created;

        publishResponses((current) => {
            const exists = current.some((item) =>
                sameSolutionId(item?.id, created.id)
            );

            return exists
                ? current.map((item) =>
                    sameSolutionId(item?.id, created.id)
                        ? { ...item, ...created }
                        : item
                )
                : [created, ...current];
        });

        setFreshResponseId(created.id);

        if (freshTimerRef.current !== null) {
            window.clearTimeout(freshTimerRef.current);
        }

        freshTimerRef.current = window.setTimeout(() => {
            if (mountedRef.current) {
                setFreshResponseId(null);
            }
            freshTimerRef.current = null;
        }, 6000);

        return undefined;
    }, [
        hasProblemId,
        newResponse,
        publishResponses,
    ]);

    // =====================================================
    // STAR / UNSTAR
    // =====================================================

    const handleStarClick = useCallback(
        async (responseId) => {
            if (!authUser && !isLoggedIn) {
                siteToast.warning(
                    "Yechimga star berish uchun tizimga kiring.",
                    { title: "Kirish talab qilinadi" }
                );
                return;
            }

            const key = String(responseId ?? "");

            if (!key || starLocksRef.current.has(key)) {
                return;
            }

            const current =
                responsesRef.current.key === problemKey
                    ? responsesRef.current.items
                    : [];

            const target = current.find((item) =>
                sameSolutionId(item?.id, responseId)
            );

            if (!target) {
                siteToast.error(
                    "Ushbu yechim topilmadi.",
                    { title: "Yechim mavjud emas" }
                );
                return;
            }

            starLocksRef.current.add(key);

            const starred = Boolean(target.star_by_user);
            const previousCount =
                getSolutionStarCount(target);

            setStarLoadingIds((previous) => ({
                ...previous,
                [key]: true,
            }));

            publishResponses((items) =>
                items.map((item) =>
                    sameSolutionId(item?.id, responseId)
                        ? {
                            ...item,
                            star_by_user: !starred,
                            total_stars: starred
                                ? Math.max(0, previousCount - 1)
                                : previousCount + 1,
                        }
                        : item
                )
            );

            try {
                if (starred) {
                    await ProblemResponseService.removeStar(
                        responseId
                    );
                } else {
                    await ProblemResponseService.addStar(
                        responseId
                    );
                }

                if (!mountedRef.current) return;

                if (starred) {
                    siteToast.info("Star olib tashlandi.", {
                        title: "Star bekor qilindi",
                        duration: 2200,
                    });
                } else {
                    siteToast.success(
                        "Yechimga star berildi.",
                        {
                            title: "Star qo‘shildi",
                            duration: 2200,
                        }
                    );
                }
            } catch (error) {
                if (!mountedRef.current) return;

                // Roll back only this solution.
                // Other changes stay intact.
                publishResponses((items) =>
                    items.map((item) =>
                        sameSolutionId(item?.id, responseId)
                            ? {
                                ...item,
                                star_by_user: starred,
                                total_stars: previousCount,
                            }
                            : item
                    )
                );

                siteToast.error(
                    getSolutionErrorMessage(
                        error,
                        "Star holatini o‘zgartirib bo‘lmadi."
                    ),
                    {
                        title: "Star xatosi",
                        duration: 4500,
                    }
                );
            } finally {
                starLocksRef.current.delete(key);

                if (mountedRef.current) {
                    setStarLoadingIds((previous) => {
                        const next = { ...previous };
                        delete next[key];
                        return next;
                    });
                }
            }
        },
        [
            authUser,
            isLoggedIn,
            problemKey,
            publishResponses,
        ]
    );

    // =====================================================
    // COPY CODE
    // =====================================================

    const handleCopyCode = useCallback(async (code) => {
        if (!code) {
            siteToast.warning(
                "Nusxalash uchun kod mavjud emas.",
                { title: "Kod topilmadi" }
            );
            return false;
        }

        try {
            await copySolutionCode(code);

            if (!mountedRef.current) return false;

            siteToast.success(
                "Yechim kodi clipboardga nusxalandi.",
                {
                    title: "Kod nusxalandi",
                    duration: 2200,
                }
            );

            return true;
        } catch (error) {
            if (!mountedRef.current) return false;

            siteToast.error(
                "Kodni nusxalab bo‘lmadi.",
                {
                    title: "Nusxalash xatosi",
                    duration: 4000,
                }
            );

            return false;
        }
    }, []);

    // =====================================================
    // SORTED DATA
    // =====================================================

    const sortedSolutions = useMemo(
        () => sortProblemSolutions(responses),
        [responses]
    );

    // =====================================================
    // RETURN
    // =====================================================

    return {
        authUser,

        responses,
        sortedSolutions,

        isLoading,
        isLoaded: currentView.loaded,
        fetchError,

        freshResponseId,
        starLoadingIds,

        fetchSolutions,
        handleStarClick,
        handleCopyCode,
    };
};

export default useProblemSolutions;
