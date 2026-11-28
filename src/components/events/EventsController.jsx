
 // src/components/events/EventsController.jsx

import {
    memo,
    useEffect,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    EVENT_REQUEST_STATUS,
    fetchPublicEvents,
} from "../../features/events/eventsSlice";

// =========================================================
// FSOCIETY — GLOBAL EVENTS CONTROLLER
// =========================================================
//
// Location:
// src/components/events/EventsController.jsx
//
// Purpose:
//
// - Initialize public event catalog
// - Share event data through Redux
// - Prevent duplicate initial requests
// - Avoid infinite retry loops
// - Remain independent of Winter Mode
//
// IMPORTANT:
//
// FSociety no longer uses Daily Gifts.
//
// A single event may have one Seasonal Gift
// per authenticated user.
//
// Gift eligibility is loaded on demand by
// useSeasonalGift(eventSlug).
//
// This controller never:
// - Fetches a Daily Gift
// - Claims a reward
// - Selects random rewards
// - Opens gift modals
// - Calculates event eligibility locally
//
// =========================================================


// =========================================================
// REQUEST STATUS
// =========================================================

const {
    IDLE,
} = EVENT_REQUEST_STATUS;


// =========================================================
// EVENTS CONTROLLER
// =========================================================

function EventsController({
    enabled = true,
}) {
    const dispatch = useDispatch();

    // =====================================================
    // PUBLIC EVENT LIST STATUS
    // =====================================================

    const listStatus = useSelector(
        (state) =>
            state.events?.listStatus ??
            IDLE
    );

    // =====================================================
    // INITIAL PUBLIC EVENTS LOAD
    // =====================================================
    //
    // Only load events when the list is idle.
    //
    // Loading:
    // Another request is already running.
    //
    // Succeeded:
    // Redux already has event data.
    //
    // Failed:
    // Do not retry endlessly.
    //
    // Manual refresh is provided separately
    // through useEvents().
    //
    // =====================================================

    useEffect(() => {
        if (
            !enabled ||
            listStatus !== IDLE
        ) {
            return;
        }

        dispatch(
            fetchPublicEvents()
        );
    }, [
        dispatch,
        enabled,
        listStatus,
    ]);

    // =====================================================
    // HEADLESS CONTROLLER
    // =====================================================
    //
    // No visible UI is rendered here.
    //
    // Event cards and detail pages read
    // the existing public Redux state.
    //
    // Seasonal Gift status is requested
    // only when a gift UI needs it.
    //
    // =====================================================

    return null;
}


// =========================================================
// EXPORT
// =========================================================

export default memo(EventsController);
