
// src/components/profile/useProfilePage.js

import {
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
    useParams,
} from "react-router-dom";

// =========================================================
// REDUX
// =========================================================

import {
    getProfileFailure,
    getProfileStart,
    getProfileSuccess,
} from "../../features/profile";

import {
    getTelegramProfileFailure,
    getTelegramProfileStart,
    getTelegramProfileSuccess,
} from "../../features/bot";

// =========================================================
// SERVICES
// =========================================================

import ProfileService from "../../services/profile";

import BotService from "../../services/bot";

// =========================================================
// UTILS / UI
// =========================================================

import {
    getBirthdayStatus,
} from "../../utils/formatDate";

import {
    siteToast,
} from "../ui/AuthToast";

import {
    buildProfileViewModel,
} from "./profileHelpers";

// =========================================================
// CONSTANTS
// =========================================================

const TELEGRAM_BOT_USERNAME = "FixSocietybot";

const PROFILE_STATUS = Object.freeze({
    IDLE: "idle",
    LOADING: "loading",
    SUCCESS: "success",
    NOT_FOUND: "not_found",
    ERROR: "error",
});

const PROFILE_NOT_FOUND_MESSAGE =
    "Foydalanuvchi topilmadi.";

const PROFILE_LOAD_ERROR_MESSAGE =
    "Profilni olishda xatolik yuz berdi.";

// =========================================================
// INITIAL REQUEST STATE
//
// This state belongs to the current profile request.
//
// Redux still manages the existing global profile data.
//
// Local request state is used to preserve HTTP status
// information that would otherwise be lost when
// getProfileFailure receives only a string.
// =========================================================

const INITIAL_PROFILE_REQUEST_STATE = {
    username: null,
    status: PROFILE_STATUS.IDLE,
    errorMessage: null,
    errorStatus: null,
};

// =========================================================
// ERROR MESSAGE
//
// Handles:
//
// - Plain string
// - DRF detail
// - DRF message
// - DRF error
// - DRF field validation
// - JavaScript Error
// - Network errors
//
// Always returns a string.
// =========================================================

const getErrorMessage = (
    error,
    fallback = "Xatolik yuz berdi."
) => {
    // =====================================================
    // PLAIN STRING
    // =====================================================

    if (
        typeof error === "string" &&
        error.trim()
    ) {
        return error.trim();
    }

    // =====================================================
    // SERVER DATA
    // =====================================================

    const data =
        error?.serverData ??
        error?.response?.data;

    if (
        typeof data === "string" &&
        data.trim()
    ) {
        return data.trim();
    }

    // =====================================================
    // COMMON DRF MESSAGES
    // =====================================================

    for (const key of [
        "detail",
        "message",
        "error",
    ]) {
        if (
            typeof data?.[key] === "string" &&
            data[key].trim()
        ) {
            return data[key].trim();
        }
    }

    // =====================================================
    // DRF FIELD VALIDATION
    // =====================================================

    if (
        data &&
        typeof data === "object" &&
        !Array.isArray(data)
    ) {
        const firstValue =
            Object.values(data)[0];

        if (
            Array.isArray(firstValue) &&
            firstValue.length > 0
        ) {
            const firstMessage =
                firstValue.find(
                    (value) =>
                        typeof value === "string" &&
                        value.trim()
                );

            if (firstMessage) {
                return firstMessage.trim();
            }
        }

        if (
            typeof firstValue === "string" &&
            firstValue.trim()
        ) {
            return firstValue.trim();
        }
    }

    // =====================================================
    // GENERIC ERROR
    // =====================================================

    if (
        typeof error?.message === "string" &&
        error.message.trim()
    ) {
        return error.message.trim();
    }

    return fallback;
};

// =========================================================
// HTTP STATUS
//
// Axios errors usually provide:
//
// error.response.status
//
// Other service implementations may expose:
//
// error.status
// error.statusCode
//
// Preserve the status as a number when available.
// =========================================================

const getErrorStatus = (error) => {
    const rawStatus =
        error?.response?.status ??
        error?.status ??
        error?.statusCode ??
        error?.serverData?.status ??
        error?.response?.data?.status;

    if (
        rawStatus === null ||
        rawStatus === undefined ||
        rawStatus === ""
    ) {
        return null;
    }

    const status = Number(rawStatus);

    if (
        !Number.isInteger(status) ||
        status < 100 ||
        status > 599
    ) {
        return null;
    }

    return status;
};

// =========================================================
// USER NOT FOUND DETECTION
//
// Backend:
//
// GET /api/users/:username/profile/
//
// HTTP 404 should produce:
//
// profileStatus = "not_found"
// isNotFound = true
//
// Detection primarily uses HTTP status.
//
// A narrowly scoped message fallback is included for
// services that throw only the DRF error message.
// =========================================================

const isProfileNotFoundError = (
    error,
    status = getErrorStatus(error)
) => {
    if (status === 404) {
        return true;
    }

    const message = getErrorMessage(
        error,
        ""
    ).trim().toLowerCase();

    if (!message) {
        return false;
    }

    return (
        message.includes(
            "no customuser matches the given query"
        ) ||
        message === "not found." ||
        message === "not found" ||
        message.includes(
            "foydalanuvchi topilmadi"
        ) ||
        message.includes(
            "user not found"
        ) ||
        message.includes(
            "user does not exist"
        )
    );
};

// =========================================================
// USERNAME COMPARISON
//
// Preserve original case-insensitive comparison.
// =========================================================

const sameUsername = (
    left,
    right
) => {
    return (
        Boolean(left && right) &&
        String(left).toLowerCase() ===
            String(right).toLowerCase()
    );
};

// =========================================================
// REQUEST CANCELLATION
// =========================================================

const isCanceled = (
    error,
    signal
) => {
    return (
        Boolean(signal?.aborted) ||
        error?.name === "AbortError" ||
        error?.name === "CanceledError" ||
        error?.code === "ERR_CANCELED"
    );
};

// =========================================================
// PROFILE PAGE CONTROLLER
//
// Responsibilities:
//
// - Get profile by username
// - HTTP 404 detection
// - Route-safe loading
// - Prevent stale profile responses
// - Profile error state
// - Profile view model
// - Profile owner detection
// - Birthday status
// - Telegram bot status
// - Telegram connection
// - Profile edit modal
// - Cover image modal
// - Active tab
// - Retry profile
//
// All existing public controller properties are kept.
//
// New properties:
//
// profileStatus
// profileErrorStatus
// isNotFound
// notFoundUsername
// =========================================================

const useProfilePage = () => {
    // =====================================================
    // DISPATCH
    // =====================================================

    const dispatch = useDispatch();

    // =====================================================
    // ROUTE
    // =====================================================

    const {
        username: routeUsername,
    } = useParams();

    const username = String(
        routeUsername ?? ""
    ).trim();

    // =====================================================
    // REDUX — PROFILE
    // =====================================================

    const {
        profile = null,
        isLoading: reduxProfileIsLoading = false,
    } = useSelector(
        (state) => state.profile ?? {}
    );

    // =====================================================
    // REDUX — AUTH
    // =====================================================

    const authUser = useSelector(
        (state) => state.auth?.user ?? null
    );

    // =====================================================
    // REDUX — TELEGRAM
    // =====================================================

    const {
        isLoading: botLoading = false,
        telegramProfile = null,
    } = useSelector(
        (state) => state.bot ?? {}
    );

    // =====================================================
    // LOCAL STATE — MODALS
    // =====================================================

    const [
        isEditModalOpen,
        setIsEditModalOpen,
    ] = useState(false);

    const [
        isCoverModalOpen,
        setIsCoverModalOpen,
    ] = useState(false);

    // =====================================================
    // LOCAL STATE — ACTIVE TAB
    // =====================================================

    const [
        activeTab,
        setActiveTab,
    ] = useState("projects");

    // =====================================================
    // LOCAL STATE — PROFILE REQUEST
    //
    // This state distinguishes:
    //
    // idle
    // loading
    // success
    // not_found
    // error
    //
    // The associated username prevents old route
    // errors from appearing on another user's profile.
    // =====================================================

    const [
        profileRequestState,
        setProfileRequestState,
    ] = useState(
        INITIAL_PROFILE_REQUEST_STATE
    );

    // =====================================================
    // PROFILE OWNER
    // =====================================================

    const isOwner = sameUsername(
        authUser?.username,
        username
    );

    // =====================================================
    // ROUTE SAFETY
    //
    // Previously loaded profile data must never
    // represent another username.
    // =====================================================

    const profileMatchesRoute = sameUsername(
        profile?.username,
        username
    );

    // =====================================================
    // TELEGRAM STATUS — OWNER ONLY
    // =====================================================

    const effectiveTelegramProfile =
        isOwner
            ? telegramProfile
            : null;

    const isTelegramLinked = Boolean(
        isOwner &&
        effectiveTelegramProfile?.is_linked
    );

    // =====================================================
    // REQUEST REFERENCES
    //
    // Prevent old requests from updating Redux
    // after a route change or newer request.
    // =====================================================

    const profileRequestId = useRef(0);

    const routeUsernameRef = useRef(
        username
    );

    routeUsernameRef.current = username;

    const telegramRequestId = useRef(0);

    // =====================================================
    // PROFILE REQUEST STATE FOR CURRENT USERNAME
    //
    // Example:
    //
    // Previous route: /sevvuw/profile
    // Current route:  /missing/profile
    //
    // We must not reuse the previous route's
    // success, loading or error state.
    // =====================================================

    const requestBelongsToRoute =
        sameUsername(
            profileRequestState.username,
            username
        );

    const profileStatus =
        requestBelongsToRoute
            ? profileRequestState.status
            : PROFILE_STATUS.IDLE;

    // =====================================================
    // CURRENT ROUTE ERROR
    //
    // Do not expose an error from another username.
    // =====================================================

    const hasProfileError =
        profileStatus === PROFILE_STATUS.ERROR ||
        profileStatus === PROFILE_STATUS.NOT_FOUND;

    const error =
        hasProfileError
            ? profileRequestState.errorMessage
            : null;

    // =====================================================
    // HTTP STATUS FOR CURRENT ROUTE
    // =====================================================

    const profileErrorStatus =
        hasProfileError
            ? profileRequestState.errorStatus
            : null;

    // =====================================================
    // NOT FOUND
    //
    // This is independent of the Redux error string.
    //
    // The Profile.jsx page can now render a dedicated
    // ProfileNotFound component reliably.
    // =====================================================

    const isNotFound =
        profileStatus ===
        PROFILE_STATUS.NOT_FOUND;

    const notFoundUsername =
        isNotFound
            ? username
            : null;

    // =====================================================
    // GET PROFILE
    //
    // Existing service:
    //
    // ProfileService.getProfile(username, { signal })
    //
    // Existing Redux actions:
    //
    // getProfileStart
    // getProfileSuccess
    // getProfileFailure
    //
    // Additional behavior:
    //
    // - Explicit 404 state
    // - No error toast for missing users
    // - Ignore canceled requests
    // - Ignore outdated route responses
    // - Protect newer requests
    // =====================================================

    const getProfile = useCallback(
        async ({
            notifyOnError = false,
            signal,
        } = {}) => {
            // =================================================
            // MISSING USERNAME
            //
            // Treat missing username as an invalid profile
            // without sending a request to the backend.
            // =================================================

            if (!username) {
                setProfileRequestState({
                    username: "",
                    status: PROFILE_STATUS.NOT_FOUND,
                    errorMessage:
                        PROFILE_NOT_FOUND_MESSAGE,
                    errorStatus: 404,
                });

                return false;
            }

            // =================================================
            // REQUEST ID
            // =================================================

            const requestId =
                ++profileRequestId.current;

            // =================================================
            // START REQUEST
            //
            // Clear previous error/not-found state.
            // =================================================

            setProfileRequestState({
                username,
                status: PROFILE_STATUS.LOADING,
                errorMessage: null,
                errorStatus: null,
            });

            dispatch(
                getProfileStart()
            );

            try {
                // =============================================
                // API REQUEST
                // =============================================

                const response =
                    await ProfileService.getProfile(
                        username,
                        { signal }
                    );

                // =============================================
                // OUTDATED REQUEST?
                // =============================================

                if (
                    signal?.aborted ||
                    requestId !==
                        profileRequestId.current ||
                    routeUsernameRef.current !==
                        username
                ) {
                    return false;
                }

                // =============================================
                // INVALID EMPTY RESPONSE
                //
                // A successful profile request is expected
                // to return a profile payload.
                // =============================================

                if (
                    response === null ||
                    response === undefined
                ) {
                    const message =
                        "Server profil ma’lumotlarini qaytarmadi.";

                    dispatch(
                        getProfileFailure(message)
                    );

                    setProfileRequestState({
                        username,
                        status: PROFILE_STATUS.ERROR,
                        errorMessage: message,
                        errorStatus: null,
                    });

                    if (notifyOnError) {
                        siteToast.error(message);
                    }

                    return false;
                }

                // =============================================
                // REDUX SUCCESS
                //
                // Preserve the original response contract.
                // =============================================

                dispatch(
                    getProfileSuccess(response)
                );

                // =============================================
                // LOCAL SUCCESS
                // =============================================

                setProfileRequestState({
                    username,
                    status: PROFILE_STATUS.SUCCESS,
                    errorMessage: null,
                    errorStatus: null,
                });

                return true;
            } catch (requestError) {
                // =============================================
                // IGNORE CANCELED / OUTDATED RESPONSES
                // =============================================

                if (
                    isCanceled(
                        requestError,
                        signal
                    ) ||
                    requestId !==
                        profileRequestId.current ||
                    routeUsernameRef.current !==
                        username
                ) {
                    return false;
                }

                // =============================================
                // EXTRACT HTTP STATUS
                // =============================================

                const status =
                    getErrorStatus(
                        requestError
                    );

                // =============================================
                // USER NOT FOUND?
                // =============================================

                const notFound =
                    isProfileNotFoundError(
                        requestError,
                        status
                    );

                // =============================================
                // ERROR MESSAGE
                // =============================================

                const message = notFound
                    ? PROFILE_NOT_FOUND_MESSAGE
                    : getErrorMessage(
                          requestError,
                          PROFILE_LOAD_ERROR_MESSAGE
                      );

                // =============================================
                // REDUX FAILURE
                //
                // Existing reducer contract uses a string.
                // =================================================

                dispatch(
                    getProfileFailure(message)
                );

                // =============================================
                // LOCAL REQUEST STATUS
                //
                // Preserve HTTP 404 independently.
                // =============================================

                setProfileRequestState({
                    username,

                    status: notFound
                        ? PROFILE_STATUS.NOT_FOUND
                        : PROFILE_STATUS.ERROR,

                    errorMessage: message,

                    errorStatus: notFound
                        ? 404
                        : status,
                });

                // =============================================
                // LOGGING
                //
                // Missing users are an expected response,
                // not a client-side application crash.
                // =============================================

                if (!notFound) {
                    console.error(
                        "Profile olishda xato:",
                        requestError
                    );
                }

                // =============================================
                // TOAST
                //
                // Do not show a redundant error toast
                // when the NotFound page will appear.
                // =============================================

                if (
                    notifyOnError &&
                    !notFound
                ) {
                    siteToast.error(
                        message
                    );
                }

                return false;
            }
        },
        [
            dispatch,
            username,
        ]
    );

    // =====================================================
    // GET TELEGRAM BOT STATUS
    //
    // Owner-only behavior preserved.
    // =====================================================

    const getTelegramBotStatus = useCallback(
        async () => {
            if (!isOwner) {
                return false;
            }

            const requestId =
                ++telegramRequestId.current;

            dispatch(
                getTelegramProfileStart()
            );

            try {
                const response =
                    await BotService.getTelegramProfile();

                if (
                    requestId !==
                    telegramRequestId.current
                ) {
                    return false;
                }

                dispatch(
                    getTelegramProfileSuccess(
                        response
                    )
                );

                return true;
            } catch (requestError) {
                if (
                    requestId !==
                    telegramRequestId.current
                ) {
                    return false;
                }

                const message =
                    getErrorMessage(
                        requestError,
                        "Telegram bot holatini olishda xatolik yuz berdi."
                    );

                console.error(
                    "Telegram bot status olishda xato:",
                    requestError
                );

                dispatch(
                    getTelegramProfileFailure(
                        message
                    )
                );

                return false;
            }
        },
        [
            dispatch,
            isOwner,
        ]
    );

    // =====================================================
    // CONNECT TELEGRAM BOT
    //
    // Existing Telegram link workflow preserved:
    //
    // - Fetch Telegram profile
    // - Check is_linked
    // - Read link_code
    // - Open Telegram deep link
    // - Show toast feedback
    // =====================================================

    const handleConnectTelegramBot = useCallback(
        async () => {
            if (
                !isOwner ||
                botLoading
            ) {
                return;
            }

            dispatch(
                getTelegramProfileStart()
            );

            try {
                // =========================================
                // GET BOT PROFILE
                // =========================================

                const response =
                    await BotService.getTelegramProfile();

                dispatch(
                    getTelegramProfileSuccess(
                        response
                    )
                );

                const botProfile =
                    response?.data ?? response;

                // =========================================
                // ALREADY LINKED
                // =========================================

                if (
                    botProfile?.is_linked
                ) {
                    siteToast.info(
                        "Telegram bot allaqachon ulangan."
                    );

                    return;
                }

                // =========================================
                // LINK CODE
                // =========================================

                const linkCode =
                    botProfile?.link_code;

                if (!linkCode) {
                    siteToast.warning(
                        "Telegram ulash kodi topilmadi."
                    );

                    return;
                }

                // =========================================
                // TELEGRAM DEEP LINK
                // =========================================

                const telegramUrl =
                    `https://t.me/${TELEGRAM_BOT_USERNAME}?start=${encodeURIComponent(
                        linkCode
                    )}`;

                const telegramWindow =
                    window.open(
                        telegramUrl,
                        "_blank",
                        "noopener,noreferrer"
                    );

                if (!telegramWindow) {
                    siteToast.warning(
                        "Telegram oynasi ochilmadi. Brauzer popup oynalarni bloklagan bo‘lishi mumkin."
                    );

                    return;
                }

                siteToast.success(
                    "Telegram bot oynasi ochildi."
                );
            } catch (requestError) {
                const message =
                    getErrorMessage(
                        requestError,
                        "Telegram botni ulashda xatolik yuz berdi."
                    );

                console.error(
                    "Telegram bot ulashda xato:",
                    requestError
                );

                dispatch(
                    getTelegramProfileFailure(
                        message
                    )
                );

                siteToast.error(
                    message
                );
            }
        },
        [
            botLoading,
            dispatch,
            isOwner,
        ]
    );

    // =====================================================
    // INITIAL PROFILE LOAD
    //
    // Triggers:
    //
    // - Profile page opening
    // - Username route change
    //
    // Cleanup:
    //
    // - Invalidate the old request
    // - Abort its network request
    //
    // React StrictMode may mount effects twice in
    // development. Canceled requests are ignored.
    // =====================================================

    useEffect(() => {
        const controller =
            new AbortController();

        void getProfile({
            signal: controller.signal,
        });

        return () => {
            profileRequestId.current += 1;

            controller.abort();
        };
    }, [
        getProfile,
    ]);

    // =====================================================
    // TELEGRAM STATUS LOAD
    //
    // Original owner-only behavior preserved.
    // =====================================================

    useEffect(() => {
        void getTelegramBotStatus();

        return () => {
            telegramRequestId.current += 1;
        };
    }, [
        getTelegramBotStatus,
    ]);

    // =====================================================
    // RESET UI ON PROFILE ROUTE CHANGE
    //
    // This does not reset Redux profile data directly.
    // profileMatchesRoute prevents stale profile display.
    // =====================================================

    useEffect(() => {
        setActiveTab(
            "projects"
        );

        setIsEditModalOpen(
            false
        );

        setIsCoverModalOpen(
            false
        );
    }, [
        username,
    ]);

    // =====================================================
    // BUILD PROFILE VIEW MODEL
    //
    // Existing profileHelpers.js is reused.
    //
    // Only data matching the current route is passed.
    // =====================================================

    const currentUser = useMemo(
        () =>
            buildProfileViewModel({
                profile: profileMatchesRoute
                    ? profile
                    : null,

                routeUsername:
                    username,

                telegramProfile:
                    effectiveTelegramProfile,
            }),
        [
            profile,
            profileMatchesRoute,
            username,
            effectiveTelegramProfile,
        ]
    );

    // =====================================================
    // BIRTHDAY
    // =====================================================

    const birthdayStatus = useMemo(
        () =>
            getBirthdayStatus(
                currentUser.birthday
            ),
        [
            currentUser.birthday,
        ]
    );

    // =====================================================
    // LOADING STATES
    //
    // IMPORTANT:
    //
    // A missing profile should NOT force an infinite
    // skeleton after the API request finishes.
    //
    // When:
    //
    // status = "not_found"
    //
    // Then:
    //
    // isInitialLoading = false
    // isNotFound = true
    //
    // Profile.jsx can render ProfileNotFound.
    // =====================================================

    const isRequestPending =
        profileStatus ===
            PROFILE_STATUS.IDLE ||
        profileStatus ===
            PROFILE_STATUS.LOADING;

    // Preserve existing Redux loading behavior for
    // other profile updates after initial loading.

    const isLoading =
        isRequestPending ||
        (
            reduxProfileIsLoading &&
            !hasProfileError
        );

    // =====================================================
    // INITIAL / ROUTE LOADING
    //
    // Route mismatch:
    // - Skeleton while fetching
    // - No skeleton after a terminal error
    // =====================================================

    const isInitialLoading =
        !profileMatchesRoute &&
        !hasProfileError;

    // =====================================================
    // BACKGROUND REFRESH
    //
    // Existing profile remains visible while updating.
    // =====================================================

    const isRefreshing =
        profileMatchesRoute &&
        isLoading &&
        !isNotFound;

    // =====================================================
    // EDIT PROFILE MODAL
    //
    // EditProfileModal already dispatches
    // getProfileSuccess after successful PATCH.
    //
    // No duplicate GET request on close.
    // =====================================================

    const handleOpenEditModal =
        useCallback(
            () => {
                if (isOwner) {
                    setIsEditModalOpen(
                        true
                    );
                }
            },
            [
                isOwner,
            ]
        );

    const handleCloseEditModal =
        useCallback(
            () => {
                setIsEditModalOpen(
                    false
                );
            },
            []
        );

    // =====================================================
    // COVER IMAGE MODAL
    //
    // CoverImageEditModal already updates Redux after
    // successful PATCH.
    // =====================================================

    const handleOpenCoverModal =
        useCallback(
            () => {
                if (isOwner) {
                    setIsCoverModalOpen(
                        true
                    );
                }
            },
            [
                isOwner,
            ]
        );

    const handleCloseCoverModal =
        useCallback(
            () => {
                setIsCoverModalOpen(
                    false
                );
            },
            []
        );

    // =====================================================
    // RETRY PROFILE
    //
    // - Restarts the request
    // - Clears local not-found/error state
    // - Preserves existing notification behavior
    //
    // HTTP 404 does not produce an unnecessary toast.
    // =====================================================

    const retryProfile = useCallback(
        () => {
            return getProfile({
                notifyOnError: true,
            });
        },
        [
            getProfile,
        ]
    );

    // =====================================================
    // PUBLIC CONTROLLER API
    //
    // All original properties remain.
    //
    // New:
    //
    // profileStatus
    // profileErrorStatus
    // isNotFound
    // notFoundUsername
    // =====================================================

    return {
        // =================================================
        // ROUTE
        // =================================================

        username,

        // =================================================
        // PROFILE
        // =================================================

        profile,
        error,
        isLoading,

        // =================================================
        // PROFILE REQUEST STATUS
        // =================================================

        profileStatus,
        profileErrorStatus,

        isNotFound,
        notFoundUsername,

        // =================================================
        // ROUTE SAFETY / PERMISSIONS
        // =================================================

        profileMatchesRoute,
        isOwner,

        // =================================================
        // VIEW MODEL / BIRTHDAY
        // =================================================

        currentUser,
        birthdayStatus,

        // =================================================
        // TELEGRAM
        // =================================================

        botLoading,
        isTelegramLinked,

        // =================================================
        // TABS
        // =================================================

        activeTab,
        setActiveTab,

        // =================================================
        // MODALS
        // =================================================

        isEditModalOpen,
        isCoverModalOpen,

        // =================================================
        // LOADING STATES
        // =================================================

        isInitialLoading,
        isRefreshing,

        // =================================================
        // REQUEST RETRY
        // =================================================

        retryProfile,

        // =================================================
        // TELEGRAM CONNECTION
        // =================================================

        handleConnectTelegramBot,

        // =================================================
        // EDIT PROFILE
        // =================================================

        handleOpenEditModal,
        handleCloseEditModal,

        // =================================================
        // EDIT COVER
        // =================================================

        handleOpenCoverModal,
        handleCloseCoverModal,
    };
};

// =========================================================
// EXPORT
// =========================================================

export default useProfilePage;
