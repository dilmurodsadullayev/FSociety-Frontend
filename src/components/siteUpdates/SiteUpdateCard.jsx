
import React from "react";

// =========================================================
// FSOCIETY — SITE UPDATE COMPONENTS
// =========================================================

import FeaturedUpdateCard from "./FeaturedUpdateCard";
import CompactUpdateCard from "./CompactUpdateCard";

// =========================================================
// FSOCIETY — SITE UPDATE CARD
//
// Supported variants:
// - featured: Main highlighted update
// - compact: Accordion update
//
// Features:
// - Dark / Light Mode
// - Responsive design
// - Like / Unlike
// - Loading state
// - Accordion interaction
// - Update metadata
//
// Existing SiteUpdates.jsx props are preserved.
// =========================================================

const SiteUpdateCard = ({
    variant = "featured",
    update,
    opened = false,
    onToggle,
    likeLoading = false,
    onLike,
}) => {

    // =====================================================
    // VALIDATE UPDATE
    // =====================================================

    if (!update) {
        return null;
    }

    // =====================================================
    // COMPACT CARD
    //
    // Used inside the updates accordion.
    // =====================================================

    if (variant === "compact") {
        return (
            <CompactUpdateCard
                update={update}
                opened={opened}
                onToggle={onToggle}
                likeLoading={likeLoading}
                onLike={onLike}
            />
        );
    }

    // =====================================================
    // FEATURED CARD
    //
    // Uses the latest redesigned FeaturedUpdateCard.
    // =====================================================

    return (
        <FeaturedUpdateCard
            update={update}
            likeLoading={likeLoading}
            onLike={onLike}
        />
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(SiteUpdateCard);
