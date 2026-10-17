import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import { useDispatch } from "react-redux";

import UserService from "../../services/user";

import {
    getUserFailure,
    getUserStart,
    getUserSuccess,
} from "../../features/users";

import {
    USERS_PER_PAGE,
    USER_FILTERS,
    getTotalUserPages,
    getUsersErrorMessage,
    makeUsersQueryKey,
    normalizeUsersResponse,
} from "./usersHelpers";

const DEBOUNCE_DELAY = 450;

const createInitialView = (key) => ({
    key,
    users: [],
    count: 0,
    next: null,
    previous: null,
    isLoading: true,
    loaded: false,
    error: "",
});

const useUsersDirectory = () => {
    const dispatch = useDispatch();

    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("Reyting");
    const [currentPage, setCurrentPage] = useState(1);
    const [retryVersion, setRetryVersion] = useState(0);

    const queryKey = useMemo(
        () =>
            makeUsersQueryKey(
                currentPage,
                searchTerm,
                filter
            ),
        [currentPage, searchTerm, filter]
    );

    const [view, setView] = useState(
        () => createInitialView(queryKey)
    );

    const requestVersionRef = useRef(0);

    // Fetch users with debounce and stale-request protection.
    useEffect(() => {
        let active = true;

        const requestVersion =
            ++requestVersionRef.current;

        const timer = setTimeout(async () => {
            if (!active) return;

            setView(createInitialView(queryKey));
            dispatch(getUserStart());

            try {
                // Existing backend service contract is unchanged.
                const response = await UserService.getUsers(
                    currentPage,
                    USERS_PER_PAGE,
                    searchTerm.trim(),
                    filter
                );

                if (
                    !active ||
                    requestVersion !== requestVersionRef.current
                ) {
                    return;
                }

                // Preserve the original Redux payload.
                dispatch(getUserSuccess(response));

                const normalized =
                    normalizeUsersResponse(response);

                setView({
                    key: queryKey,
                    ...normalized,
                    isLoading: false,
                    loaded: true,
                    error: "",
                });
            } catch (error) {
                if (
                    !active ||
                    requestVersion !== requestVersionRef.current
                ) {
                    return;
                }

                const message = getUsersErrorMessage(error);

                dispatch(getUserFailure(message));

                setView({
                    ...createInitialView(queryKey),
                    isLoading: false,
                    loaded: true,
                    error: message,
                });
            }
        }, DEBOUNCE_DELAY);

        return () => {
            active = false;
            clearTimeout(timer);
            requestVersionRef.current += 1;
        };
    }, [
        dispatch,
        currentPage,
        searchTerm,
        filter,
        queryKey,
        retryVersion,
    ]);

    // Only expose results belonging to the current query.
    const currentView =
        view.key === queryKey
            ? view
            : createInitialView(queryKey);

    const totalPages = getTotalUserPages(
        currentView.count
    );

    const handleSearchChange = useCallback((value) => {
        setSearchTerm(String(value ?? ""));
        setCurrentPage(1);
    }, []);

    const handleFilterChange = useCallback((value) => {
        if (!USER_FILTERS.includes(value)) return;

        setFilter(value);
        setCurrentPage(1);
    }, []);

    const goToPage = useCallback(
        (page) => {
            const nextPage = Number(page);

            if (
                !Number.isSafeInteger(nextPage) ||
                nextPage < 1 ||
                nextPage > totalPages ||
                nextPage === currentPage
            ) {
                return;
            }

            setCurrentPage(nextPage);

            if (typeof window !== "undefined") {
                const reduceMotion = window.matchMedia?.(
                    "(prefers-reduced-motion: reduce)"
                )?.matches;

                window.scrollTo({
                    top: 0,
                    behavior: reduceMotion ? "auto" : "smooth",
                });
            }
        },
        [currentPage, totalPages]
    );

    const previousPage = useCallback(() => {
        if (!currentView.previous || currentPage <= 1) {
            return;
        }

        goToPage(currentPage - 1);
    }, [
        currentView.previous,
        currentPage,
        goToPage,
    ]);

    const nextPage = useCallback(() => {
        if (!currentView.next || currentPage >= totalPages) {
            return;
        }

        goToPage(currentPage + 1);
    }, [
        currentView.next,
        currentPage,
        totalPages,
        goToPage,
    ]);

    const retry = useCallback(() => {
        setRetryVersion((version) => version + 1);
    }, []);

    return {
        searchTerm,
        filter,
        currentPage,
        totalPages,

        users: currentView.users,
        totalUsersCount: currentView.count,
        next: currentView.next,
        previous: currentView.previous,
        isLoading: currentView.isLoading,
        loaded: currentView.loaded,
        error: currentView.error,

        handleSearchChange,
        handleFilterChange,

        goToPage,
        previousPage,
        nextPage,
        retry,
    };
};

export default useUsersDirectory;