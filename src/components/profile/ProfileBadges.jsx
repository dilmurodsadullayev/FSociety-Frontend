
import React, {
    memo,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    AlertTriangle,
    Award,
    RefreshCw,
} from "lucide-react";

// =========================================================
// REDUX ACTIONS
// =========================================================

import {
    getBadgesStart,
    getBadgesSuccess,
    getBadgesFailure,
} from "../../features/badge";

// =========================================================
// SERVICES
// =========================================================

import BadgeService from "../../services/badge";

// =========================================================
// BADGE COMPONENTS
// =========================================================

import ProfileBadgeCard from "./badges/ProfileBadgeCard";

import ProfileBadgesSkeleton from "./badges/ProfileBadgesSkeleton";

import ProfileBadgesEmpty from "./badges/ProfileBadgesEmpty";

// =========================================================
// CONSTANTS
// =========================================================

const EMPTY_BADGES = [];

const DEFAULT_ERROR_MESSAGE =
    "Nishonlarni yuklashda xatolik yuz berdi. " +
    "Internet aloqasini tekshirib, qayta urinib ko‘ring.";

// =========================================================
// REDUX SELECTOR
// =========================================================

const selectBadgeState = (state) => {
    return state.badge || {};
};

// =========================================================
// SAFE BADGES
//
// Supports:
// - Array response
// - Paginated results response
// - Missing data
// =========================================================

const getSafeBadges = (value) => {
    if (Array.isArray(value)) {
        return value;
    }

    if (Array.isArray(value?.results)) {
        return value.results;
    }

    return EMPTY_BADGES;
};

// =========================================================
// NORMALIZE USERNAME
// =========================================================

const normalizeUsername = (value) => {
    return String(value ?? "").trim();
};

// =========================================================
// GET ERROR MESSAGE
//
// Supports:
// - Error string
// - Axios response
// - DRF detail
// - JavaScript Error
// =========================================================

const getErrorMessage = (
    error,
    fallback = DEFAULT_ERROR_MESSAGE
) => {
    if (
        typeof error === "string" &&
        error.trim()
    ) {
        return error.trim();
    }

    const data =
        error?.serverData ??
        error?.response?.data;

    if (
        typeof data === "string" &&
        data.trim()
    ) {
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

    if (
        typeof error?.message === "string" &&
        error.message.trim()
    ) {
        return error.message.trim();
    }

    return fallback;
};

// =========================================================
// REQUEST KEY
//
// Each username and retry attempt has its own key.
//
// This prevents previous profile data from appearing
// while the next profile is being loaded.
// =========================================================

const buildRequestKey = (
    username,
    retryKey
) => {
    return JSON.stringify([
        username,
        retryKey,
    ]);
};

// =========================================================
// PROFILE BADGES CONTENT
//
// Responsibilities:
//
// - Load badges
// - Dispatch Redux actions
// - Manage retry
// - Prevent stale API responses
// - Render header
// - Render skeleton
// - Render error
// - Render badge list
// - Render empty state
//
// The badge visuals live in separate components.
// =========================================================

const ProfileBadgesContent = ({
    username,
}) => {
    // =====================================================
    // REDUX DISPATCH
    // =====================================================

    const dispatch = useDispatch();

    // =====================================================
    // REDUX STATE
    // =====================================================

    const {
        userBadges = EMPTY_BADGES,
        isLoading = false,
        error = null,
    } = useSelector(selectBadgeState);

    // =====================================================
    // NORMALIZED USERNAME
    // =====================================================

    const profileUsername =
        normalizeUsername(username);

    // =====================================================
    // RETRY STATE
    //
    // Incrementing this value triggers another GET.
    // =====================================================

    const [
        retryKey,
        setRetryKey,
    ] = useState(0);

    // =====================================================
    // COMPLETED REQUEST
    //
    // Remains null until this particular component
    // has completed its own request.
    //
    // Used to protect against stale Redux data when
    // navigating between profile usernames.
    // =====================================================

    const [
        completedRequestKey,
        setCompletedRequestKey,
    ] = useState(null);

    // =====================================================
    // REQUEST KEY
    // =====================================================

    const requestedKey = useMemo(
        () =>
            buildRequestKey(
                profileUsername,
                retryKey
            ),
        [
            profileUsername,
            retryKey,
        ]
    );

    // =====================================================
    // SAFE BADGE LIST
    // =====================================================

    const safeBadges = useMemo(
        () => getSafeBadges(userBadges),
        [userBadges]
    );

    // =====================================================
    // FETCH USER BADGES
    //
    // Triggers:
    // - Initial mount
    // - Profile username change
    // - Retry button
    //
    // Existing service contract is preserved:
    //
    // BadgeService.getUserBadges(username)
    //
    // Existing Redux actions are preserved:
    //
    // getBadgesStart()
    // getBadgesSuccess(response)
    // getBadgesFailure(message)
    //
    // The active flag prevents an outdated request
    // from updating the store after unmount or retry.
    // =====================================================

    useEffect(() => {
        // ================================================
        // NO USERNAME
        // ================================================

        if (!profileUsername) {
            dispatch(
                getBadgesSuccess([])
            );

            setCompletedRequestKey(
                requestedKey
            );

            return undefined;
        }

        // ================================================
        // REQUEST LIFECYCLE
        // ================================================

        let active = true;

        const fetchBadges = async () => {
            dispatch(getBadgesStart());

            try {
                // =========================================
                // API REQUEST
                // =========================================

                const response =
                    await BadgeService.getUserBadges(
                        profileUsername
                    );

                // =========================================
                // IGNORE OUTDATED RESPONSES
                // =========================================

                if (!active) {
                    return;
                }

                // =========================================
                // STORE RESULT
                //
                // Preserve original Redux contract.
                // =========================================

                dispatch(
                    getBadgesSuccess(response)
                );

                // =========================================
                // COMPLETE CURRENT REQUEST
                // =========================================

                setCompletedRequestKey(
                    requestedKey
                );
            } catch (err) {
                if (!active) {
                    return;
                }

                // =========================================
                // NORMALIZE ERROR
                // =========================================

                const message =
                    getErrorMessage(err);

                console.error(
                    "Nishonlarni yuklashda xato:",
                    err
                );

                // =========================================
                // REDUX FAILURE
                // =========================================

                dispatch(
                    getBadgesFailure(message)
                );

                // =========================================
                // COMPLETE FAILED REQUEST
                //
                // This stops the skeleton so that
                // the error and retry button appear.
                // =========================================

                setCompletedRequestKey(
                    requestedKey
                );
            }
        };

        void fetchBadges();

        // ================================================
        // CLEANUP
        //
        // On username change or retry, this component
        // stops old requests from dispatching results.
        // ================================================

        return () => {
            active = false;
        };
    }, [
        dispatch,
        profileUsername,
        requestedKey,
    ]);

    // =====================================================
    // RETRY
    //
    // A new request starts when retryKey changes.
    //
    // No page refresh is necessary.
    // =====================================================

    const handleRetry = useCallback(() => {
        setRetryKey(
            (previous) => previous + 1
        );
    }, []);

    // =====================================================
    // VIEW STATES
    // =====================================================

    const isCurrentRequestComplete =
        completedRequestKey === requestedKey;

    const showSkeleton =
        !isCurrentRequestComplete ||
        Boolean(isLoading);

    const hasError =
        !showSkeleton &&
        Boolean(error);

    const hasBadges =
        !showSkeleton &&
        !hasError &&
        safeBadges.length > 0;

    const showEmpty =
        !showSkeleton &&
        !hasError &&
        safeBadges.length === 0;

    // =====================================================
    // INITIAL / RETRY LOADING
    //
    // The skeleton includes its own header and cards.
    // Prevent rendering a duplicate header.
    // =====================================================

    if (showSkeleton) {
        return (
            <ProfileBadgesSkeleton
                count={3}
            />
        );
    }

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <section
            aria-label="Foydalanuvchi nishonlari"
            className="
                relative
                isolate
                min-w-0
                overflow-hidden

                rounded-3xl
                border

                border-slate-200
                bg-white/90

                p-4

                shadow-lg
                shadow-slate-900/5

                dark:border-gray-700/70
                dark:bg-gray-900/70
                dark:shadow-2xl
                dark:shadow-black/30

                sm:p-5
            "
        >
            {/* =============================================
                DECORATIVE BACKGROUND GLOW

                Preserves original yellow and indigo
                background decorations.
            ============================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none

                    absolute
                    -right-24
                    -top-24

                    h-52
                    w-52

                    rounded-full

                    bg-yellow-500/[0.06]
                    blur-3xl

                    dark:bg-yellow-500/10
                "
            />

            <div
                aria-hidden="true"
                className="
                    pointer-events-none

                    absolute
                    -bottom-24
                    -left-24

                    h-52
                    w-52

                    rounded-full

                    bg-indigo-500/[0.06]
                    blur-3xl

                    dark:bg-indigo-500/10
                "
            />

            {/* =============================================
                HEADER
            ============================================== */}

            <div
                className="
                    relative
                    z-10

                    mb-6

                    flex
                    min-w-0

                    items-center
                    justify-between

                    gap-3
                "
            >
                {/* =========================================
                    HEADER LEFT
                ========================================== */}

                <div
                    className="
                        flex
                        min-w-0

                        items-center
                        gap-3
                    "
                >
                    {/* =====================================
                        HEADER ICON
                    ====================================== */}

                    <div
                        className="
                            flex
                            h-12
                            w-12
                            shrink-0

                            items-center
                            justify-center

                            rounded-2xl
                            border

                            border-yellow-300/40
                            bg-yellow-50

                            text-yellow-600

                            shadow-lg
                            shadow-yellow-500/10

                            dark:border-yellow-400/25
                            dark:bg-yellow-500/10
                            dark:text-yellow-300
                        "
                    >
                        <Award
                            size={24}
                            strokeWidth={2}
                            aria-hidden="true"
                        />
                    </div>

                    {/* =====================================
                        HEADER TITLE
                    ====================================== */}

                    <div className="min-w-0">
                        <h3
                            className="
                                text-xl
                                font-black

                                text-slate-900
                                dark:text-white
                            "
                        >
                            Nishonlar
                        </h3>

                        <p
                            className="
                                mt-0.5

                                text-xs
                                font-semibold
                                leading-5

                                text-slate-500
                                dark:text-gray-500
                            "
                        >
                            Yutuqlar, faoliyat va
                            community belgisi
                        </p>
                    </div>
                </div>

                {/* =========================================
                    BADGE COUNT
                ========================================== */}

                <span
                    className="
                        shrink-0

                        rounded-full
                        border

                        border-indigo-200
                        bg-indigo-50

                        px-3
                        py-1

                        text-xs
                        font-black

                        uppercase
                        tracking-wider

                        text-indigo-700

                        dark:border-indigo-400/30
                        dark:bg-indigo-500/10
                        dark:text-indigo-300
                    "
                >
                    {hasError
                        ? "—"
                        : `${safeBadges.length} ta`}
                </span>
            </div>

            {/* =============================================
                ERROR STATE

                If loading fails:
                - Show error
                - Show retry action
                - Do not display stale badge records
                - Do not display misleading empty state
            ============================================== */}

            {hasError && (
                <div
                    role="alert"
                    aria-live="assertive"
                    className="
                        relative
                        z-10

                        rounded-2xl
                        border

                        border-red-200
                        bg-red-50

                        p-4

                        dark:border-red-500/30
                        dark:bg-red-500/10
                    "
                >
                    <div
                        className="
                            flex
                            min-w-0
                            items-start
                            gap-3
                        "
                    >
                        {/* ERROR ICON */}

                        <div
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0

                                items-center
                                justify-center

                                rounded-xl

                                bg-red-100
                                text-red-600

                                dark:bg-red-500/15
                                dark:text-red-300
                            "
                        >
                            <AlertTriangle
                                size={18}
                                aria-hidden="true"
                            />
                        </div>

                        {/* ERROR CONTENT */}

                        <div
                            className="
                                min-w-0
                                flex-1
                            "
                        >
                            <h4
                                className="
                                    text-sm
                                    font-black

                                    text-red-800
                                    dark:text-red-200
                                "
                            >
                                Nishonlarni yuklab bo‘lmadi
                            </h4>

                            <p
                                className="
                                    mt-1

                                    break-words

                                    text-xs
                                    font-medium
                                    leading-6

                                    text-red-700
                                    dark:text-red-300
                                "
                            >
                                {getErrorMessage(error)}
                            </p>

                            {/* =================================
                                RETRY BUTTON
                            ================================== */}

                            <button
                                type="button"
                                onClick={handleRetry}
                                className="
                                    mt-4

                                    inline-flex
                                    min-h-10

                                    items-center
                                    justify-center
                                    gap-2

                                    rounded-xl
                                    border

                                    border-red-200
                                    bg-white

                                    px-4
                                    py-2

                                    text-xs
                                    font-black

                                    text-red-700

                                    transition-all
                                    duration-200

                                    hover:border-red-300
                                    hover:bg-red-100

                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-red-500/50

                                    active:scale-[0.98]

                                    dark:border-red-400/20
                                    dark:bg-red-500/10
                                    dark:text-red-200

                                    dark:hover:bg-red-500/20

                                    motion-reduce:transform-none
                                "
                            >
                                <RefreshCw
                                    size={15}
                                    aria-hidden="true"
                                />

                                Qayta urinish
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* =============================================
                BADGE LIST

                Original order and animation index
                are preserved.
            ============================================== */}

            {hasBadges && (
                <div
                    className="
                        relative
                        z-10

                        space-y-4
                    "
                >
                    {safeBadges.map(
                        (item, index) => (
                            <ProfileBadgeCard
                                key={
                                    item?.id ??
                                    `badge-${index}`
                                }
                                item={item}
                                index={index}
                            />
                        )
                    )}
                </div>
            )}

            {/* =============================================
                EMPTY STATE

                Show only when:
                - Request completed
                - No error
                - No badges
            ============================================== */}

            {showEmpty && (
                <ProfileBadgesEmpty />
            )}
        </section>
    );
};

// =========================================================
// PROFILE BADGES WRAPPER
//
// The key forces a clean component instance when
// switching between profile usernames.
//
// Benefits:
//
// - Retry state resets
// - Completed request identity resets
// - Skeleton appears immediately
// - Previous request cleanup becomes effective
// =========================================================

const ProfileBadges = ({
    username,
}) => {
    const profileUsername =
        normalizeUsername(username);

    return (
        <ProfileBadgesContent
            key={
                profileUsername ||
                "__no_username__"
            }
            username={profileUsername}
        />
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfileBadges);
