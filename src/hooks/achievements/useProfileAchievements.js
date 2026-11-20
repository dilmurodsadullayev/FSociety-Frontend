import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { achievementRequestKey, cancelAchievementRequest, fetchProfileAchievements } from "../../features/badge";

export default function useProfileAchievements(username, enabled) {
    const dispatch = useDispatch();
    const collection = useSelector(state => state.badge.collection);
    const revision = useSelector(state => state.badge.revision);
    const [query, setQuery] = useState({ username, search: "", filter: "", page: 1 });
    const [debounced, setDebounced] = useState({ username, search: "" });
    const [retry, setRetry] = useState(0);
    const current = query.username === username ? query : { username, search: "", filter: "", page: 1 };
    const search = debounced.username === username ? debounced.search : "";
    useEffect(() => {
        const timer = setTimeout(() => setDebounced({ username, search: current.search.trim() }), 350);
        return () => clearTimeout(timer);
    }, [username, current.search]);
    const key = achievementRequestKey({ username, page: current.page, filter: current.filter, search });
    useEffect(() => {
        if (!enabled || !username) return undefined;
        // Wait for the search debounce before issuing the page-one request.
        if (search !== current.search.trim()) return undefined;
        const request = dispatch(fetchProfileAchievements({ username, page: current.page, filter: current.filter, search }));
        return () => {
            request.abort();
            dispatch(cancelAchievementRequest(request.requestId));
        };
    }, [dispatch, username, enabled, current.page, current.filter, current.search, search, revision, retry]);
    const update = patch => setQuery({ ...current, ...patch, username });
    const retryRequest = useCallback(() => setRetry(value => value + 1), []);
    const ownerMatches = collection.username === username;
    const matches = ownerMatches && collection.key === key && search === current.search.trim();
    return {
        results: matches && Array.isArray(collection.results) ? collection.results : [],
        recent: ownerMatches && Array.isArray(collection.recent) ? collection.recent : [],
        supportsFilters: ownerMatches ? collection.supportsFilters : true,
        total: ownerMatches ? collection.total : null,
        count: matches ? collection.count : 0,
        loading: !matches || ["loading", "idle"].includes(collection.status),
        recentLoading: !ownerMatches || (collection.recentRevision < 0 && ["loading", "idle"].includes(collection.status)),
        recentError: ownerMatches && collection.recentRevision !== revision && collection.status === "failed" ? collection.error : null,
        error: matches && collection.status === "failed" ? collection.error : null,
        page: current.page, search: current.search, filter: current.filter,
        onSearchChange: value => update({ search: value, page: 1 }),
        onFilterChange: value => update({ filter: value, page: 1 }),
        onPageChange: value => update({ page: value }),
        retry: retryRequest,
    };
}
