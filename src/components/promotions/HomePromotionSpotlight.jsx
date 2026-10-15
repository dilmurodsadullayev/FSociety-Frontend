
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

// =========================================================
// REDUX
// =========================================================

import {
    getSidebarPromotionsFailure,
    getSidebarPromotionsStart,
    getSidebarPromotionsSuccess,
    selectPromotionState,
} from "../../features/promotions";

// =========================================================
// SERVICE
// =========================================================

import PromotionService from "../../services/promotion";

// =========================================================
// COMPONENTS
// =========================================================

import PromotionSpotlightCard from "./spotlight/PromotionSpotlightCard";

import {
    PromotionSpotlightSkeleton,
    PromotionSpotlightError,
} from "./spotlight/PromotionSpotlightStates";

// =========================================================
// UTILS
// =========================================================

import {
    PROMOTION_LIMIT,
    AUTO_ROTATE_DELAY,
    getErrorMessage,
    isCanceledRequest,
} from "./spotlight/spotlightUtils";

// =========================================================
// FSOCIETY — HOME PROMOTION SPOTLIGHT
//
// Redux + API:
// Existing contracts preserved.
//
// Carousel:
// - 7 second auto-rotation
// - Previous / Next
// - Dot navigation
// - Pause on hover
// - Pause on keyboard focus
// - Respect reduced motion
//
// Request management:
// - Abort previous request
// - Abort request on unmount
// - Ignore canceled responses
// =========================================================

const HomePromotionSpotlight = () => {
    const dispatch = useDispatch();

    // =====================================================
    // REDUX
    // =====================================================

    const promotionState =
        useSelector(selectPromotionState);

    const {
        sidebarProjects = [],
        sidebarLoading = false,
        sidebarError = null,
    } = promotionState || {};

    // =====================================================
    // STATE
    // =====================================================

    const [currentIndex, setCurrentIndex] =
        useState(0);

    const [isHovered, setIsHovered] =
        useState(false);

    const [isFocused, setIsFocused] =
        useState(false);

    // =====================================================
    // REQUEST REF
    // =====================================================

    const requestControllerRef = useRef(null);

    // =====================================================
    // SAFE PROJECTS
    // =====================================================

    const projects = useMemo(() => {
        return Array.isArray(sidebarProjects)
            ? sidebarProjects
            : [];
    }, [sidebarProjects]);

    // =====================================================
    // VALID INDEX
    // =====================================================

    const safeIndex =
        projects.length > 0
            ? currentIndex % projects.length
            : 0;

    const currentProject =
        projects[safeIndex] ?? null;

    // =====================================================
    // FETCH PROMOTIONS
    // =====================================================

    const loadPromotions = useCallback(
        async () => {
            // Cancel any earlier request.
            requestControllerRef.current?.abort();

            const controller = new AbortController();

            requestControllerRef.current =
                controller;

            dispatch(
                getSidebarPromotionsStart()
            );

            try {
                const response =
                    await PromotionService.getHomeSidebarProjects({
                        limit: PROMOTION_LIMIT,
                        signal: controller.signal,
                    });

                // Do not update Redux after cancellation.
                if (controller.signal.aborted) {
                    return;
                }

                dispatch(
                    getSidebarPromotionsSuccess(response)
                );

            } catch (error) {
                if (
                    controller.signal.aborted ||
                    isCanceledRequest(error)
                ) {
                    return;
                }

                dispatch(
                    getSidebarPromotionsFailure(
                        getErrorMessage(error)
                    )
                );

            } finally {
                if (
                    requestControllerRef.current ===
                    controller
                ) {
                    requestControllerRef.current = null;
                }
            }
        },
        [dispatch]
    );

    // =====================================================
    // INITIAL LOAD + CLEANUP
    // =====================================================

    useEffect(() => {
        loadPromotions();

        return () => {
            requestControllerRef.current?.abort();
        };
    }, [loadPromotions]);

    // =====================================================
    // KEEP INDEX IN RANGE
    // =====================================================

    useEffect(() => {
        setCurrentIndex((previous) => {
            if (
                projects.length === 0 ||
                previous >= projects.length
            ) {
                return 0;
            }

            return previous;
        });
    }, [projects.length]);

    // =====================================================
    // PAUSE CONDITIONS
    // =====================================================

    const isPaused = isHovered || isFocused;

    // =====================================================
    // AUTO ROTATE
    // =====================================================

    useEffect(() => {
        if (projects.length <= 1 || isPaused) {
            return undefined;
        }

        // Avoid automatic carousel motion when the
        // user requests reduced motion.
        const reduceMotion =
            typeof window.matchMedia === "function" &&
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

        if (reduceMotion) {
            return undefined;
        }

        const timer = window.setInterval(() => {
            // Don't advance while browser tab is hidden.
            if (document.visibilityState === "hidden") {
                return;
            }

            setCurrentIndex((previous) => {
                return (
                    previous + 1
                ) % projects.length;
            });
        }, AUTO_ROTATE_DELAY);

        return () => {
            window.clearInterval(timer);
        };

    }, [
        projects.length,
        isPaused,
    ]);

    // =====================================================
    // PREVIOUS SLIDE
    // =====================================================

    const handlePrevious = useCallback(() => {
        if (projects.length <= 1) {
            return;
        }

        setCurrentIndex((previous) => {
            return (
                previous - 1 + projects.length
            ) % projects.length;
        });
    }, [projects.length]);

    // =====================================================
    // NEXT SLIDE
    // =====================================================

    const handleNext = useCallback(() => {
        if (projects.length <= 1) {
            return;
        }

        setCurrentIndex((previous) => {
            return (
                previous + 1
            ) % projects.length;
        });
    }, [projects.length]);

    // =====================================================
    // SELECT SLIDE
    // =====================================================

    const handleSelect = useCallback(
        (index) => {
            if (
                index < 0 ||
                index >= projects.length
            ) {
                return;
            }

            setCurrentIndex(index);
        },
        [projects.length]
    );

    // =====================================================
    // FOCUS HANDLING
    // =====================================================

    const handleFocusCapture = useCallback(() => {
        setIsFocused(true);
    }, []);

    const handleBlurCapture = useCallback((event) => {
        // Continue only after focus leaves the card.
        if (
            !event.currentTarget.contains(
                event.relatedTarget
            )
        ) {
            setIsFocused(false);
        }
    }, []);

    // =====================================================
    // LOADING
    // =====================================================

    if (
        sidebarLoading &&
        projects.length === 0
    ) {
        return <PromotionSpotlightSkeleton />;
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (
        sidebarError &&
        projects.length === 0
    ) {
        return (
            <PromotionSpotlightError
                error={sidebarError}
                onRetry={loadPromotions}
            />
        );
    }

    // =====================================================
    // EMPTY
    //
    // If there are no active promotions,
    // don't render an empty advertising card.
    // =====================================================

    if (!currentProject) {
        return null;
    }

    // =====================================================
    // JSX
    // =====================================================

    return (
        <PromotionSpotlightCard
            project={currentProject}
            projects={projects}
            currentIndex={safeIndex}

            onPrevious={handlePrevious}
            onNext={handleNext}
            onSelect={handleSelect}

            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}

            onFocusCapture={handleFocusCapture}
            onBlurCapture={handleBlurCapture}
        />
    );
};

export default HomePromotionSpotlight;
