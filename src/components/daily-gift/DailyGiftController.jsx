
// src/components/daily-gift/DailyGiftController.jsx

import { memo } from "react";

// =========================================================
// DAILY GIFT HOOK
// =========================================================

import useDailyGift from "../../hooks/dailyGift/useDailyGift";


// =========================================================
// FSOCIETY — GLOBAL DAILY GIFT CONTROLLER
// =========================================================
//
// Responsibilities:
//
// - Initialize Daily Gift data
// - Load event information
// - Load authenticated gift eligibility
// - React to authentication changes
// - Prevent duplicate initialization requests
//
// This controller must be mounted only once,
// inside the application's Redux Provider.
//
// Gift availability is independent of Winter Mode.
//
// Modal rendering and countdown synchronization
// will be integrated in subsequent stages.
//
// =========================================================

function DailyGiftController() {

    // =====================================================
    // INITIALIZE DAILY GIFT
    // =====================================================

    useDailyGift({
        autoLoad: true,
    });


    // =====================================================
    // HEADLESS CONTROLLER
    //
    // No visible UI at this stage.
    // =====================================================

    return null;
}


// =========================================================
// EXPORT
// =========================================================

export default memo(DailyGiftController);
