
/**
 * FSociety — useCoinHistory
 *
 * FCoin History sahifasining controller hooki.
 *
 * Mavjud imkoniyatlar:
 * - Django API
 * - Redux
 * - Current user
 * - Transaction history
 * - Current balance
 * - Pagination
 * - Page size
 * - Refresh / Retry
 * - AbortController
 * - Loading / Error states
 *
 * Tuzatishlar:
 * - Stale API success himoyasi
 * - Stale API error himoyasi
 * - Abort qilingan so'rov error emas
 * - Initial error paytida balance fallback
 * - Refresh failure paytida eski balansni saqlash
 * - Pagination validatsiyasi
 * - Reduced Motion bilan scroll
 *
 * FCoin miqdori qisqartirilmaydi.
 */

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

// =========================================================
// COIN SERVICE
// =========================================================

import CoinService, {
    getCoinErrorMessage,
    isCoinRequestCanceled,
} from "../../services/coin";

// =========================================================
// REDUX
// =========================================================

import {
    getCoinFailure,
    getCoinStart,
    getCoinSuccess,
    selectCoinState,
    setCoinPage,
    setCoinPageSize,
} from "../../features/coins";

// =========================================================
// HELPERS
// =========================================================

import {
    getCoinHistoryRange,
    getCoinPaginationPages,
    safeNumber,
} from "./coinHistoryHelpers";

// =========================================================
// CONSTANTS
// =========================================================

export const COIN_PAGE_SIZE_OPTIONS = [
    10,
    15,
    25,
    50,
];

const EMPTY_COINS = [];

// =========================================================
// USE COIN HISTORY
// =========================================================

const useCoinHistory = () => {
    // =====================================================
    // DISPATCH
    // =====================================================

    const dispatch = useDispatch();

    // =====================================================
    // REDUX COIN STATE
    // =====================================================

    const coinState = useSelector(
        selectCoinState
    );

    // =====================================================
    // AUTH USER
    // =====================================================

    const authUser = useSelector(
        (state) =>
            state?.auth?.user ?? null
    );

    // =====================================================
    // REDUX DATA
    // =====================================================

    const {
        coins: storedCoins,

        balance,
        isLoading,
        error,
        hasLoaded,

        count,
        currentPage,
        pageSize,
        totalPages,
        next,
        previous,
    } = coinState || {};

    // =====================================================
    // SAFE COIN ARRAY
    //
    // API response yoki Redux holati vaqtincha
    // undefined bo'lsa, sahifa buzilmaydi.
    // =====================================================

    const coins = Array.isArray(storedCoins)
        ? storedCoins
        : EMPTY_COINS;

    // =====================================================
    // REQUEST CONTROLLER
    //
    // Faqat oxirgi faol API request
    // Redux holatini o'zgartirishi mumkin.
    // =====================================================

    const requestControllerRef = useRef(null);

    // =====================================================
    // LAST SUCCESSFUL BALANCE
    //
    // Refresh xatosida oldingi tasdiqlangan
    // backend balansini saqlash uchun.
    // =====================================================

    const lastSuccessfulBalanceRef = useRef(null);

    // =====================================================
    // LOAD HISTORY
    //
    // API SIGNATURE:
    //
    // CoinService.getCoins(
    //     page,
    //     size,
    //     { signal }
    // )
    //
    // Redux:
    // getCoinStart
    // getCoinSuccess
    // getCoinFailure
    // =====================================================

    const loadHistory = useCallback(
        async (page, size) => {
            // =============================================
            // CANCEL PREVIOUS REQUEST
            // =============================================

            const previousController =
                requestControllerRef.current;

            if (previousController) {
                previousController.abort();
            }

            // =============================================
            // CREATE NEW CONTROLLER
            // =============================================

            const controller =
                new AbortController();

            requestControllerRef.current =
                controller;

            // =============================================
            // REDUX LOADING START
            // =============================================

            dispatch(
                getCoinStart({
                    page,
                    pageSize: size,
                })
            );

            // =============================================
            // API REQUEST
            // =============================================

            try {
                const response =
                    await CoinService.getCoins(
                        page,
                        size,
                        {
                            signal: controller.signal,
                        }
                    );

                // =========================================
                // REQUEST VALIDATION
                //
                // Response eskirgan bo'lsa yoki request
                // abort qilingan bo'lsa, Redux'ga yozmaymiz.
                // =========================================

                const isCurrentRequest =
                    requestControllerRef.current ===
                    controller;

                if (
                    controller.signal.aborted ||
                    !isCurrentRequest
                ) {
                    return null;
                }

                // =========================================
                // STORE SUCCESSFUL BACKEND BALANCE
                //
                // Saqlanadigan qiymat display uchun.
                // API response o'zgartirilmaydi.
                // =========================================

                if (
                    response?.balance !== null &&
                    response?.balance !== undefined
                ) {
                    const numericBalance = safeNumber(
                        response.balance,
                        NaN
                    );

                    if (
                        Number.isFinite(numericBalance)
                    ) {
                        lastSuccessfulBalanceRef.current =
                            numericBalance;
                    }
                }

                // =========================================
                // REDUX SUCCESS
                // =========================================

                dispatch(
                    getCoinSuccess(response)
                );

                // =========================================
                // RETURN RESPONSE
                // =========================================

                return response;
            } catch (requestError) {
                // =========================================
                // CHECK WHETHER REQUEST WAS REPLACED
                // =========================================

                const isCurrentRequest =
                    requestControllerRef.current ===
                    controller;

                // =========================================
                // IGNORE CANCELED REQUEST
                //
                // AbortController / Axios cancellation
                // foydalanuvchiga xato ko'rinmasligi kerak.
                // =========================================

                if (
                    controller.signal.aborted ||
                    !isCurrentRequest ||
                    isCoinRequestCanceled(requestError)
                ) {
                    return null;
                }

                // =========================================
                // ERROR MESSAGE
                // =========================================

                const message =
                    getCoinErrorMessage(
                        requestError
                    );

                // =========================================
                // REDUX FAILURE
                //
                // Faqat hozirgi faol request uchun.
                // =========================================

                dispatch(
                    getCoinFailure(message)
                );

                return null;
            } finally {
                // =========================================
                // CLEANUP
                //
                // Eski request yangi controller
                // qiymatini o'chirib yubormaydi.
                // =========================================

                if (
                    requestControllerRef.current ===
                    controller
                ) {
                    requestControllerRef.current =
                        null;
                }
            }
        },
        [
            dispatch,
        ]
    );

    // =====================================================
    // INITIAL LOAD + PAGE / SIZE CHANGE
    //
    // Mount:
    // - currentPage
    // - pageSize
    //
    // Redux pagination o'zgarsa, yangi so'rov.
    //
    // Cleanup:
    // - oldingi request abort
    // =====================================================

    useEffect(
        () => {
            loadHistory(
                currentPage,
                pageSize
            );

            return () => {
                const controller =
                    requestControllerRef.current;

                if (controller) {
                    controller.abort();
                }
            };
        },
        [
            currentPage,
            pageSize,
            loadHistory,
        ]
    );

    // =====================================================
    // PAGE CHANGE
    //
    // Validation:
    // - Loading paytida o'zgarmaydi
    // - 1 dan kichik sahifa yo'q
    // - totalPages dan katta sahifa yo'q
    // - Joriy sahifaga qayta o'tmaymiz
    // =====================================================

    const handlePageChange = useCallback(
        (page) => {
            const requestedPage =
                safeNumber(
                    page,
                    currentPage
                );

            // =============================================
            // ONLY INTEGER PAGE NUMBERS
            // =============================================

            if (
                !Number.isInteger(
                    requestedPage
                )
            ) {
                return;
            }

            const nextPage =
                requestedPage;

            // =============================================
            // PAGINATION GUARDS
            // =============================================

            if (
                isLoading ||
                nextPage < 1 ||
                nextPage > Math.max(
                    1,
                    safeNumber(totalPages, 0)
                ) ||
                nextPage === currentPage
            ) {
                return;
            }

            // =============================================
            // REDUX PAGE CHANGE
            //
            // useEffect performs the API request.
            // =============================================

            dispatch(
                setCoinPage(
                    nextPage
                )
            );

            // =============================================
            // SCROLL TO HISTORY LIST
            //
            // Reduced Motion qo'llab-quvvatlanadi.
            // =============================================

            if (
                typeof window !== "undefined"
            ) {
                const performScroll = () => {
                    const element =
                        document.getElementById(
                            "fcoin-history-list"
                        );

                    const reduceMotion =
                        typeof window.matchMedia ===
                            "function" &&
                        window.matchMedia(
                            "(prefers-reduced-motion: reduce)"
                        ).matches;

                    const behavior = reduceMotion
                        ? "auto"
                        : "smooth";

                    if (
                        element &&
                        typeof element.scrollIntoView ===
                            "function"
                    ) {
                        element.scrollIntoView({
                            behavior,
                            block: "start",
                        });

                        return;
                    }

                    window.scrollTo({
                        top: 0,
                        behavior,
                    });
                };

                if (
                    typeof window.requestAnimationFrame ===
                    "function"
                ) {
                    window.requestAnimationFrame(
                        performScroll
                    );
                } else {
                    performScroll();
                }
            }
        },
        [
            currentPage,
            dispatch,
            isLoading,
            totalPages,
        ]
    );

    // =====================================================
    // PREVIOUS PAGE
    // =====================================================

    const handlePreviousPage = useCallback(
        () => {
            handlePageChange(
                currentPage - 1
            );
        },
        [
            currentPage,
            handlePageChange,
        ]
    );

    // =====================================================
    // NEXT PAGE
    // =====================================================

    const handleNextPage = useCallback(
        () => {
            handlePageChange(
                currentPage + 1
            );
        },
        [
            currentPage,
            handlePageChange,
        ]
    );

    // =====================================================
    // PAGE SIZE CHANGE
    //
    // Supported options:
    // 10 / 15 / 25 / 50
    //
    // Redux reducer birinchi sahifaga qaytaradi.
    // =====================================================

    const handlePageSizeChange = useCallback(
        (value) => {
            const requestedSize =
                safeNumber(
                    value,
                    pageSize
                );

            if (
                !Number.isInteger(
                    requestedSize
                )
            ) {
                return;
            }

            const nextSize =
                requestedSize;

            if (
                isLoading ||
                nextSize === pageSize ||
                !COIN_PAGE_SIZE_OPTIONS.includes(
                    nextSize
                )
            ) {
                return;
            }

            // =============================================
            // REDUX PAGE SIZE CHANGE
            //
            // setCoinPageSize currentPage = 1 qiladi.
            // useEffect yangi tarixni yuklaydi.
            // =============================================

            dispatch(
                setCoinPageSize(
                    nextSize
                )
            );
        },
        [
            dispatch,
            isLoading,
            pageSize,
        ]
    );

    // =====================================================
    // REFRESH / RETRY
    //
    // Current page and size stay unchanged.
    //
    // During active loading, repeated clicks
    // do not start additional requests.
    // =====================================================

    const refresh = useCallback(
        () => {
            if (
                isLoading
            ) {
                return Promise.resolve(
                    null
                );
            }

            return loadHistory(
                currentPage,
                pageSize
            );
        },
        [
            currentPage,
            isLoading,
            loadHistory,
            pageSize,
        ]
    );

    // =====================================================
    // DISPLAY BALANCE
    //
    // MANTIQ:
    //
    // 1. Muvaffaqiyatli backend response mavjud:
    //    uning balance qiymati asosiy manba.
    //
    // 2. Refresh xato bilan tugagan:
    //    oxirgi muvaffaqiyatli balans saqlanadi.
    //
    // 3. Dastlabki so'rov xato:
    //    authUser.coins fallback.
    //
    // 4. API hali tugamagan:
    //    auth user yoki Redux balans.
    //
    // Bu joyda K / M formatlash YO'Q.
    // =====================================================

    const displayBalance = useMemo(
        () => {
            // =============================================
            // ERROR STATE
            // =============================================

            if (error) {
                if (
                    lastSuccessfulBalanceRef.current !==
                    null
                ) {
                    return lastSuccessfulBalanceRef.current;
                }

                return safeNumber(
                    authUser?.coins ?? balance,
                    0
                );
            }

            // =============================================
            // SUCCESSFUL LOADED DATA
            // =============================================

            if (
                hasLoaded
            ) {
                return safeNumber(
                    balance,
                    0
                );
            }

            // =============================================
            // INITIAL FALLBACK
            // =============================================

            return safeNumber(
                authUser?.coins ?? balance,
                0
            );
        },
        [
            authUser?.coins,
            balance,
            error,
            hasLoaded,
        ]
    );

    // =====================================================
    // USERNAME
    //
    // Existing fallback preserved.
    // =====================================================

    const username = useMemo(
        () => {
            return (
                authUser?.username ||
                "FSociety"
            );
        },
        [
            authUser?.username,
        ]
    );

    // =====================================================
    // HISTORY RANGE
    //
    // Example:
    // 1–15 / 150
    // 16–30 / 150
    //
    // count / page / pageSize / actual items.
    // =====================================================

    const range = useMemo(
        () => {
            return getCoinHistoryRange({
                count,

                currentPage,

                pageSize,

                currentItemsCount:
                    coins.length,
            });
        },
        [
            count,
            currentPage,
            pageSize,
            coins.length,
        ]
    );

    // =====================================================
    // PAGINATION PAGE NUMBERS
    //
    // Existing ellipsis keys remain available.
    // =====================================================

    const paginationPages = useMemo(
        () => {
            return getCoinPaginationPages(
                currentPage,
                totalPages
            );
        },
        [
            currentPage,
            totalPages,
        ]
    );

    // =====================================================
    // FLAGS
    // =====================================================

    const hasTransactions =
        coins.length > 0;

    const isInitialLoading =
        Boolean(isLoading) &&
        !hasLoaded;

    const isRefreshing =
        Boolean(isLoading) &&
        Boolean(hasLoaded);

    // =====================================================
    // CAN GO PREVIOUS
    //
    // Original logic:
    // previous OR currentPage > 1
    //
    // Kept for compatibility.
    // =====================================================

    const canGoPrevious =
        !isLoading &&
        currentPage > 1 &&
        Boolean(
            previous ||
            currentPage > 1
        );

    // =====================================================
    // CAN GO NEXT
    //
    // Original logic:
    // next OR currentPage < totalPages
    //
    // Kept for compatibility.
    // =====================================================

    const canGoNext =
        !isLoading &&
        totalPages > 0 &&
        currentPage < totalPages &&
        Boolean(
            next ||
            currentPage < totalPages
        );

    // =====================================================
    // RETURN
    //
    // Barcha eski nomlar va action handlerlar saqlangan.
    //
    // FCoinHistory.jsx va ichki komponentlar
    // shu obyekt interfeysidan foydalanadi.
    // =====================================================

    return {
        // ================================================
        // USER
        // ================================================

        authUser,
        username,

        // ================================================
        // DATA
        // ================================================

        coins,
        balance: displayBalance,
        count,
        hasTransactions,

        // ================================================
        // REQUEST STATE
        // ================================================

        isLoading,
        isInitialLoading,
        isRefreshing,
        hasLoaded,
        error,

        // ================================================
        // PAGINATION
        // ================================================

        currentPage,
        pageSize,
        totalPages,

        next,
        previous,

        range,
        paginationPages,

        pageSizeOptions:
            COIN_PAGE_SIZE_OPTIONS,

        canGoPrevious,
        canGoNext,

        // ================================================
        // ACTIONS
        // ================================================

        loadHistory,

        refresh,

        handlePageChange,
        handlePreviousPage,
        handleNextPage,

        handlePageSizeChange,
    };
};

// =========================================================
// EXPORT
// =========================================================

export default useCoinHistory;
