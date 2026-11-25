
 // src/components/events/EventsController.jsx

import {
    useEffect,
    useMemo,
} from "react";

import {
    useDispatch,
    useSelector,
    useStore,
} from "react-redux";

// =========================================================
// EVENTS REDUX
// =========================================================

import {
    fetchPublicEvents,
    EVENT_REQUEST_STATUS,
} from "../../features/events/eventsSlice";

// =========================================================
// DAILY GIFT REDUX
// =========================================================

import {
    fetchDailyGiftStatusForEvent,
} from "../../features/events/dailyGiftSlice";

// =========================================================
// SEASONAL GIFT REDUX
// =========================================================

import {
    fetchSeasonalGiftStatusForEvent,
} from "../../features/events/seasonalGiftSlice";

// =========================================================
// FSOCIETY — UNIVERSAL EVENTS CONTROLLER
// =========================================================
//
// Responsibilities:
// - Initialize public Events
// - Load authenticated gift statuses
// - Support multiple events
// - Respect account switching
// - Avoid duplicate status requests
//
// This is a headless controller.
//
// It does NOT render visible UI.
// It does NOT automatically claim gifts.
// It does NOT depend on Winter Mode.
//
// =========================================================


// =========================================================
// HELPERS
// =========================================================

const getUserId = (user) => {
    const id =
        user?.id ??
        user?.pk ??
        null;

    return id === null ||
        id === undefined ||
        id === ""
        ? null
        : String(id);
};

const isValidSlug = (slug) =>
    typeof slug === "string" &&
    /^[a-zA-Z0-9_-]+$/.test(slug);

const shouldPreloadGift = (event) => {
    if (
        !event ||
        typeof event !== "object"
    ) {
        return false;
    }

    if (
        event.is_enabled === false ||
        event.enabled === false
    ) {
        return false;
    }

    const status = String(
        event.status ??
        event.event_status ??
        ""
    ).toLowerCase();

    // Finished and disabled events can still
    // be viewed through the Events pages.
    // We simply do not eagerly preload their
    // gift eligibility on every app startup.
    return ![
        "finished",
        "disabled",
        "ended",
        "inactive",
    ].includes(status);
};

// =========================================================
// CONTROLLER
// =========================================================

export default function EventsController() {
    const dispatch = useDispatch();

    const store = useStore();

    // =====================================================
    // AUTH STATE
    // =====================================================

    const isLoggedIn = useSelector(
        (state) =>
            Boolean(state.auth?.isLoggedIn)
    );

    const isAuthLoading = useSelector(
        (state) =>
            Boolean(state.auth?.isLoading)
    );

    const userId = useSelector(
        (state) =>
            getUserId(state.auth?.user)
    );

    // =====================================================
    // PUBLIC EVENTS STATE
    // =====================================================

    const events = useSelector(
        (state) =>
            state.events?.items ?? []
    );

    const listStatus = useSelector(
        (state) =>
            state.events?.listStatus ??
            EVENT_REQUEST_STATUS.IDLE
    );

    // =====================================================
    // PRIVATE GIFT OWNERS
    // =====================================================

    const dailyGiftOwnerId = useSelector(
        (state) =>
            state.eventsDailyGift?.ownerId ??
            null
    );

    const seasonalGiftOwnerId = useSelector(
        (state) =>
            state.eventsSeasonalGift?.ownerId ??
            null
    );

    // =====================================================
    // PUBLIC EVENTS INITIALIZATION
    // =====================================================

    useEffect(() => {
        if (
            listStatus !==
                EVENT_REQUEST_STATUS.IDLE &&
            listStatus !==
                EVENT_REQUEST_STATUS.FAILED
        ) {
            return;
        }

        // Public GET only.
        dispatch(
            fetchPublicEvents()
        );

    }, [
        dispatch,
        listStatus,
    ]);

    // =====================================================
    // EVENT SLUGS
    // =====================================================

    const eventSlugs = useMemo(() => {
        if (!Array.isArray(events)) {
            return [];
        }

        const uniqueSlugs = new Set();

        for (const event of events) {
            if (
                !shouldPreloadGift(event)
            ) {
                continue;
            }

            const slug = event.slug;

            if (isValidSlug(slug)) {
                uniqueSlugs.add(slug);
            }
        }

        return Array.from(uniqueSlugs);

    }, [events]);

    // =====================================================
    // FETCH AUTHENTICATED GIFT STATUSES
    // =====================================================
    //
    // Both Daily Gift and Seasonal Gift are
    // independent of Winter Mode.
    //
    // These GET requests are started only when
    // Redux has confirmed the current owner.
    //
    // =====================================================

    useEffect(() => {
        if (
            isAuthLoading ||
            !isLoggedIn ||
            !userId ||
            eventSlugs.length === 0
        ) {
            return;
        }

        const currentState =
            store.getState();

        const dailyOwnerMatches =
            dailyGiftOwnerId === userId;

        const seasonalOwnerMatches =
            seasonalGiftOwnerId === userId;

        for (const slug of eventSlugs) {
            // ============================================
            // DAILY GIFT STATUS
            // ============================================

            if (dailyOwnerMatches) {
                const dailyState =
                    currentState.eventsDailyGift;

                const hasDailyStatus =
                    dailyState?.statusByEvent?.[slug] !==
                    undefined;

                const dailyLoading =
                    dailyState
                        ?.statusRequestByEvent
                        ?.[slug] === "loading";

                if (
                    !hasDailyStatus &&
                    !dailyLoading
                ) {
                    dispatch(
                        fetchDailyGiftStatusForEvent(
                            slug
                        )
                    );
                }
            }

            // ============================================
            // SEASONAL GIFT STATUS
            // ============================================

            if (seasonalOwnerMatches) {
                const seasonalState =
                    currentState.eventsSeasonalGift;

                const hasSeasonalStatus =
                    seasonalState
                        ?.statusByEvent
                        ?.[slug] !== undefined;

                const seasonalLoading =
                    seasonalState
                        ?.statusRequestByEvent
                        ?.[slug] === "loading";

                if (
                    !hasSeasonalStatus &&
                    !seasonalLoading
                ) {
                    dispatch(
                        fetchSeasonalGiftStatusForEvent(
                            slug
                        )
                    );
                }
            }
        }

    }, [
        dispatch,
        store,

        isLoggedIn,
        isAuthLoading,
        userId,

        dailyGiftOwnerId,
        seasonalGiftOwnerId,

        eventSlugs,
    ]);

    // =====================================================
    // HEADLESS RENDER
    // =====================================================

    return null;
}
