
// src/components/profile/ProfilePosts.jsx

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

import { RefreshCcw } from "lucide-react";

// =========================================================
// REDUX
// =========================================================

import {
    getPostStart,
    getPostSuccess,
    getPostFailure,
    createPostStart,
    createPostSuccess,
    createPostFailure,
} from "../../features/posts";

// =========================================================
// SERVICES / MODAL
// =========================================================

import PostService from "../../services/post";
import CreatePostModal from "../posts/CreatePostModal";

// =========================================================
// PROFILE POSTS COMPONENTS
// =========================================================

import ProfilePostsHeader from "./posts/ProfilePostsHeader";
import ProfilePostsStats from "./posts/ProfilePostsStats";
import ProfilePostsPagination from "./posts/ProfilePostsPagination";
import ProfilePostsSkeleton from "./posts/ProfilePostsSkeleton";
import ProfilePostsEmpty from "./posts/ProfilePostsEmpty";
import ProfilePostsError from "./posts/ProfilePostsError";
import ProfilePostCard from "./posts/ProfilePostCard";

// =========================================================
// CONSTANTS / SELECTOR
// =========================================================

const PAGE_SIZE = 5;
const EMPTY_POSTS = [];
const selectPostState = (state) => state.post ?? {};

const REQUEST_STATUS = Object.freeze({
    IDLE: "idle",
    LOADING: "loading",
    SUCCESS: "success",
    ERROR: "error",
});

const POST_TYPES = {
    TEX: "Texnologiya",
    SPO: "Sport",
    BIZ: "Biznes",
    ENT: "O‘yin-kulgi",
    OTH: "Boshqa",
};

const getPostTypeDisplayName = (type) =>
    POST_TYPES[type] || "Noma’lum tur";

// =========================================================
// SEARCH TEXT
// =========================================================

const stripHtml = (html = "") => {
    return String(html ?? "")
        .replace(/<style[^>]*>.*?<\/style>/gis, "")
        .replace(/<script[^>]*>.*?<\/script>/gis, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, '"')
        .replace(/&#039;/gi, "'")
        .replace(/\s+/g, " ")
        .trim();
};

// =========================================================
// PAGINATED RESPONSE
// =========================================================

const normalizePostsResponse = (response) => {
    if (Array.isArray(response)) {
        return {
            count: response.length,
            next: null,
            previous: null,
            results: response,
        };
    }

    const count = Number(response?.count ?? 0);

    return {
        count: Number.isFinite(count)
            ? Math.max(0, count)
            : 0,
        next: response?.next ?? null,
        previous: response?.previous ?? null,
        results: Array.isArray(response?.results)
            ? response.results
            : [],
    };
};

const makeRequestKey = (username, page) =>
    JSON.stringify([String(username ?? "").toLowerCase(), page]);

// =========================================================
// PROFILE POSTS
//
// FIX:
// Redux begins with post_isLoading=false and posts=[].
// This does NOT mean an API request has succeeded.
// An empty state is shown only after a successful GET
// for the current username AND the current page.
// =========================================================

const ProfilePosts = ({ username }) => {
    const dispatch = useDispatch();

    const { isLoggedIn, user } = useSelector(
        (state) => state.auth ?? {}
    );

    const {
        posts,
        post_isLoading,
        create_isLoading,
        create_error,
    } = useSelector(selectPostState);

    // =====================================================
    // LOCAL UI / PAGINATION STATE
    // =====================================================

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);

    // =====================================================
    // REQUEST STATE
    //
    // This is intentionally local because the post Redux
    // slice is shared by other screens and initializes its
    // loading flag to false.
    //
    // loadedRequestKey proves that the Redux posts belong
    // to THIS profile and THIS page.
    // =====================================================

    const [requestState, setRequestState] = useState({
        key: null,
        status: REQUEST_STATUS.IDLE,
        error: null,
    });

    const [loadedRequestKey, setLoadedRequestKey] = useState(null);

    // =====================================================
    // REFS
    // =====================================================

    const sectionRef = useRef(null);
    const previousUsernameRef = useRef(username);
    const requestSequenceRef = useRef(0);
    const submittingRef = useRef(false);

    const currentKey = makeRequestKey(username, currentPage);
    const activeKeyRef = useRef(currentKey);
    activeKeyRef.current = currentKey;

    // =====================================================
    // OWNER
    // =====================================================

    const isCurrentUser = Boolean(
        isLoggedIn &&
        user?.username &&
        username &&
        String(user.username).toLowerCase() ===
            String(username).toLowerCase()
    );

    // =====================================================
    // CURRENT PAGE REQUEST STATE
    //
    // On first render, requestState.key is null, so the
    // skeleton appears BEFORE useEffect begins the API GET.
    // =====================================================

    const requestIsCurrent = requestState.key === currentKey;
    const currentStatus = requestIsCurrent
        ? requestState.status
        : REQUEST_STATUS.IDLE;

    const currentError = requestIsCurrent
        ? requestState.error
        : null;

    const hasLoadedCurrentPage = loadedRequestKey === currentKey;
    const hasInitialError =
        !hasLoadedCurrentPage &&
        currentStatus === REQUEST_STATUS.ERROR;

    const isFetchingCurrentPage =
        currentStatus === REQUEST_STATUS.LOADING;

    const showSkeleton =
        !hasLoadedCurrentPage && !hasInitialError;

    // Prevent stale Redux posts from appearing when the
    // username or page changes.
    const safePosts = hasLoadedCurrentPage && Array.isArray(posts)
        ? posts
        : EMPTY_POSTS;

    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages = Math.max(
        1,
        Math.ceil(totalPosts / PAGE_SIZE)
    );

    const rangeStart = totalPosts === 0
        ? 0
        : (currentPage - 1) * PAGE_SIZE + 1;

    const rangeEnd = Math.min(
        currentPage * PAGE_SIZE,
        totalPosts
    );

    // =====================================================
    // SCROLL TO POSTS
    // =====================================================

    const scrollToPosts = useCallback(() => {
        if (
            typeof window === "undefined" ||
            typeof window.requestAnimationFrame !== "function"
        ) {
            return;
        }

        window.requestAnimationFrame(() => {
            sectionRef.current?.scrollIntoView?.({
                behavior: "smooth",
                block: "start",
            });
        });
    }, []);

    // =====================================================
    // FETCH POSTS
    //
    // Sequence and key checks prevent stale GET results
    // from overwriting the active profile/page.
    // =====================================================

    const getPost = useCallback(
        async (page = 1, shouldScroll = false) => {
            if (!username) {
                return false;
            }

            const requestKey = makeRequestKey(username, page);
            const sequence = ++requestSequenceRef.current;

            setRequestState({
                key: requestKey,
                status: REQUEST_STATUS.LOADING,
                error: null,
            });

            dispatch(getPostStart());

            try {
                const response = await PostService.getPosts(
                    username,
                    page,
                    PAGE_SIZE
                );

                if (
                    sequence !== requestSequenceRef.current ||
                    activeKeyRef.current !== requestKey
                ) {
                    return false;
                }

                const normalized = normalizePostsResponse(response);
                const availablePages = Math.max(
                    1,
                    Math.ceil(normalized.count / PAGE_SIZE)
                );

                // Deleted posts may leave us on a page that
                // no longer exists. Go to the last valid page.
                if (page > availablePages) {
                    setCurrentPage(availablePages);
                    return false;
                }

                dispatch(getPostSuccess(normalized.results));
                setTotalPosts(normalized.count);
                setHasNextPage(Boolean(normalized.next));
                setHasPreviousPage(Boolean(normalized.previous));

                setLoadedRequestKey(requestKey);
                setRequestState({
                    key: requestKey,
                    status: REQUEST_STATUS.SUCCESS,
                    error: null,
                });

                if (shouldScroll) {
                    scrollToPosts();
                }

                return true;
            } catch (requestError) {
                if (
                    sequence !== requestSequenceRef.current ||
                    activeKeyRef.current !== requestKey
                ) {
                    return false;
                }

                const message =
                    requestError?.message ||
                    "Postlarni yuklashda xato yuz berdi.";

                console.error(
                    "Postlarni yuklashda xato:",
                    requestError
                );

                dispatch(getPostFailure(message));
                setRequestState({
                    key: requestKey,
                    status: REQUEST_STATUS.ERROR,
                    error: message,
                });

                return false;
            }
        },
        [dispatch, scrollToPosts, username]
    );

    // =====================================================
    // INITIAL LOAD / USERNAME / PAGE CHANGE
    //
    // Only a successful GET can unlock the empty state.
    // On username change, reset page, search and modal.
    // Cleanup invalidates the previous request.
    // =====================================================

    useEffect(() => {
        if (previousUsernameRef.current !== username) {
            previousUsernameRef.current = username;
            setSearch("");
            setTotalPosts(0);
            setHasNextPage(false);
            setHasPreviousPage(false);
            setIsModalOpen(false);
            setLoadedRequestKey(null);

            if (currentPage !== 1) {
                setCurrentPage(1);
                return () => {
                    requestSequenceRef.current += 1;
                };
            }
        }

        void getPost(currentPage, false);

        return () => {
            requestSequenceRef.current += 1;
        };
    }, [username, currentPage, getPost]);

    // =====================================================
    // CREATE POST
    //
    // Existing CreatePostModal contract preserved.
    // =====================================================

    const handleCreatePost = useCallback(
        async (postDataFromModal) => {
            if (!isCurrentUser || submittingRef.current) {
                return false;
            }

            submittingRef.current = true;
            dispatch(createPostStart());

            try {
                const newPost = await PostService.createPost(
                    postDataFromModal
                );

                dispatch(createPostSuccess(newPost));
                setIsModalOpen(false);
                setSearch("");

                if (currentPage !== 1) {
                    setCurrentPage(1);
                } else {
                    await getPost(1, true);
                }

                return true;
            } catch (requestError) {
                const message =
                    requestError?.message ||
                    "Post yaratishda xato yuz berdi.";

                dispatch(createPostFailure(message));
                throw new Error(message);
            } finally {
                submittingRef.current = false;
            }
        },
        [currentPage, dispatch, getPost, isCurrentUser]
    );

    // =====================================================
    // FILTER POSTS (CURRENT PAGE ONLY)
    // =====================================================

    const filteredPosts = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return safePosts;
        }

        return safePosts.filter((post) => {
            const title = String(post?.title || "").toLowerCase();
            const type = getPostTypeDisplayName(
                post?.post_type
            ).toLowerCase();
            const content = stripHtml(post?.content).toLowerCase();

            return (
                title.includes(query) ||
                type.includes(query) ||
                content.includes(query)
            );
        });
    }, [safePosts, search]);

    // =====================================================
    // PAGINATION / RETRY / CREATE MODAL
    // =====================================================

    const handlePageChange = (page) => {
        if (
            showSkeleton ||
            isFetchingCurrentPage ||
            post_isLoading ||
            !Number.isInteger(page) ||
            page < 1 ||
            page > totalPages ||
            page === currentPage
        ) {
            return;
        }

        setSearch("");
        setCurrentPage(page);
        scrollToPosts();
    };

    const handleRetry = () => getPost(currentPage, false);

    const openCreatePost = () => {
        if (
            isCurrentUser &&
            !submittingRef.current &&
            !showSkeleton &&
            !hasInitialError
        ) {
            setIsModalOpen(true);
        }
    };

    // =====================================================
    // CONTENT STATES
    //
    // 1. Skeleton: first load / new username / new page
    // 2. Fetch error: only if no current-page result
    // 3. Normal content: successful current-page GET
    //
    // Modal remains mounted in every state.
    // =====================================================

    const listContent = showSkeleton ? (
        <ProfilePostsSkeleton
            isOwner={isCurrentUser}
        />
    ) : hasInitialError ? (
        <ProfilePostsError
            variant="fetch"
            error={currentError}
            onRetry={handleRetry}
            isLoading={isFetchingCurrentPage}
        />
    ) : (
        <>
            {/* 1. POSTS HEADER */}
            <ProfilePostsHeader
                search={search}
                onSearchChange={setSearch}
                isOwner={isCurrentUser}
                onCreatePost={openCreatePost}
            />

            {/* 2. CREATE ERROR */}
            {create_error && !isModalOpen && (
                <ProfilePostsError
                    variant="create"
                    error={create_error}
                />
            )}

            {/* 3. REFRESH ERROR (KEEP LOADED POSTS) */}
            {currentError && hasLoadedCurrentPage && (
                <ProfilePostsError
                    variant="fetch"
                    error={currentError}
                    hasPosts
                    onRetry={handleRetry}
                    isLoading={isFetchingCurrentPage}
                />
            )}

            {/* 4. POSTS STATISTICS */}
            <ProfilePostsStats
                posts={safePosts}
                totalPosts={totalPosts}
            />

            {/* 5. PAGE INFORMATION */}
            {totalPosts > 0 && (
                <div
                    className="
                        flex min-w-0 flex-col gap-2
                        rounded-2xl border border-slate-200
                        bg-slate-50 px-4 py-3
                        text-xs font-bold text-slate-500
                        dark:border-white/[0.08]
                        dark:bg-white/[0.025]
                        dark:text-slate-400
                        sm:flex-row sm:items-center
                        sm:justify-between
                    "
                >
                    <span>
                        {rangeStart}
                        {" – "}
                        {rangeEnd}
                        {" / "}
                        {totalPosts.toLocaleString()}
                        {" ta post"}
                    </span>

                    <span>
                        Sahifa{" "}
                        <strong className="text-indigo-700 dark:text-indigo-300">
                            {currentPage}
                        </strong>
                        {" / "}
                        {totalPages}
                    </span>
                </div>
            )}

            {/* 6. EMPTY STATE: SUCCESSFUL GET + ZERO POSTS */}
            {totalPosts === 0 && !isFetchingCurrentPage && (
                <ProfilePostsEmpty
                    variant="posts"
                    isCurrentUser={isCurrentUser}
                    onCreate={openCreatePost}
                    message={
                        isCurrentUser
                            ? "Siz hali post yozmagansiz. Birinchi maqolangizni qo‘shing."
                            : "Foydalanuvchi hali biron bir maqola chop etmagan."
                    }
                />
            )}

            {/* 7. NO SEARCH RESULTS */}
            {totalPosts > 0 &&
                safePosts.length > 0 &&
                filteredPosts.length === 0 && (
                    <ProfilePostsEmpty
                        variant="search"
                        onClearSearch={() => setSearch("")}
                    />
                )}

            {/* 8. POST CARDS */}
            {filteredPosts.length > 0 && (
                <div
                    id="posts"
                    aria-busy={isFetchingCurrentPage}
                    className="relative grid min-w-0 gap-5"
                >
                    {/* Refresh overlay for existing posts */}
                    {isFetchingCurrentPage && (
                        <div
                            role="status"
                            className="
                                absolute inset-0 z-20
                                flex items-start justify-center
                                rounded-3xl bg-white/60 pt-8
                                backdrop-blur-[2px]
                                dark:bg-[#05070a]/45
                            "
                        >
                            <span
                                className="
                                    inline-flex items-center gap-2
                                    rounded-full border border-indigo-300
                                    bg-white px-4 py-2 text-xs
                                    font-black text-indigo-700 shadow-xl
                                    dark:border-indigo-400/20
                                    dark:bg-gray-950/90
                                    dark:text-indigo-300
                                "
                            >
                                <RefreshCcw
                                    size={14}
                                    aria-hidden="true"
                                    className="animate-spin motion-reduce:animate-none"
                                />
                                Postlar yuklanmoqda...
                            </span>
                        </div>
                    )}

                    {filteredPosts.map((post, index) => (
                        <ProfilePostCard
                            key={post?.id ?? `${currentPage}-${index}`}
                            post={post}
                            username={username}
                            index={index}
                        />
                    ))}
                </div>
            )}

            {/* 9. PAGINATION */}
            {totalPosts > 0 && totalPages > 1 && (
                <ProfilePostsPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    hasPreviousPage={
                        hasPreviousPage || currentPage > 1
                    }
                    hasNextPage={
                        hasNextPage || currentPage < totalPages
                    }
                    isLoading={
                        isFetchingCurrentPage || post_isLoading
                    }
                    onPageChange={handlePageChange}
                />
            )}
        </>
    );

    // =====================================================
    // FINAL RENDER
    // CreatePostModal stays mounted during loading/errors.
    // =====================================================

    return (
        <div
            ref={sectionRef}
            className="min-w-0 scroll-mt-28 space-y-5"
            aria-busy={showSkeleton}
        >
            {listContent}

            <CreatePostModal
                isOpen={isModalOpen}
                onClose={() => {
                    if (
                        !create_isLoading &&
                        !submittingRef.current
                    ) {
                        setIsModalOpen(false);
                    }
                }}
                onSubmit={handleCreatePost}
                isSubmitting={create_isLoading}
            />
        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default ProfilePosts;
