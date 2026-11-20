
// src/components/daily-gift/DailyGiftController.jsx

import React, { memo } from "react";


// =========================================================
// DAILY GIFT HOOKS
// =========================================================

import useDailyGift from "../../hooks/dailyGift/useDailyGift";

import useDailyGiftModal from "../../hooks/dailyGift/useDailyGiftModal";


// =========================================================
// DAILY GIFT COMPONENTS
// =========================================================

import DailyGiftModal from "./DailyGiftModal";


// =========================================================
// FSOCIETY — GLOBAL DAILY GIFT CONTROLLER
// =========================================================
//
// Responsibilities:
//
// - Initialize event information
// - Load authenticated gift eligibility
// - Observe authentication changes
// - Manage global modal rendering
// - Connect modal actions to Redux hooks
// - Preserve pending claim requests
//
// Mounted once inside App.js.
//
// Independent of Winter Mode settings.
//
// =========================================================

function DailyGiftController() {

    // =====================================================
    // GLOBAL EVENT INITIALIZATION
    // =====================================================

    const gift = useDailyGift({

        autoLoad: true,

    });


    // =====================================================
    // GLOBAL MODAL STATE
    // =====================================================

    const modal = useDailyGiftModal();


    // =====================================================
    // SESSION PROTECTION
    //
    // Never display private reward information
    // to an unauthenticated user.
    // =====================================================

    if (!gift.hasValidSession) {

        return null;
    }


    // =====================================================
    // MODAL VISIBILITY
    //
    // Navbar DailyGiftButton opens the modal
    // through the shared Redux state.
    //
    // The controller observes that same state.
    // =====================================================

    if (!modal.isOpen) {

        return null;
    }


    // =====================================================
    // GLOBAL MODAL RENDER
    //
    // Key prevents component-local state from
    // surviving an authenticated account change.
    //
    // The modal remains outside individual routes.
    //
    // Claim requests belong to Redux thunks and
    // are not canceled when the modal closes.
    //
    // =====================================================

    return (

        <DailyGiftModal

            key={gift.ownerId}

            gift={gift}

            modal={modal}
        />
    );
}


// =========================================================
// EXPORT
// =========================================================

export default memo(DailyGiftController);
