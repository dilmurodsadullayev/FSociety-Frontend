
import React, { memo } from "react";

import {
    Sparkles,
} from "lucide-react";

// =========================================================
// EXISTING ROADMAP ITEM
//
// Previously:
// profile/RoadmapItem.jsx
//
// New location:
// profile/roadmap/RoadmapItem.jsx
// =========================================================

import RoadmapItem from "./RoadmapItem";

// =========================================================
// CONSTANTS
// =========================================================

const EMPTY_ROADMAPS = [];

// =========================================================
// ROADMAP TIMELINE
//
// Props:
//
// roadmaps:
//   Roadmap array from Redux.
//
// isOwner:
//   Whether the current user owns this profile.
//
// isLiking:
//   Redux like loading flag.
//
// likingRoadmapId:
//   ID of the roadmap currently being liked.
//
// onEdit:
//   Parent handleEditClick.
//
// onDelete:
//   Parent handleDeleteClick.
//
// onToggleLike:
//   Parent handleToggleLike.
//
// This component does not:
// - Fetch roadmaps
// - Create roadmaps
// - Delete roadmaps
// - Send like requests
// - Open modals
// =========================================================

const ProfileRoadmapTimeline = ({
    roadmaps = EMPTY_ROADMAPS,
    isOwner = false,
    isLiking = false,
    likingRoadmapId = null,
    onEdit,
    onDelete,
    onToggleLike,
}) => {
    // =====================================================
    // SAFE ROADMAPS
    // =====================================================

    const safeRoadmaps = Array.isArray(roadmaps)
        ? roadmaps
        : EMPTY_ROADMAPS;

    // =====================================================
    // EMPTY HANDLING
    //
    // ProfileRoadmapEmpty handles the empty state.
    // =====================================================

    if (safeRoadmaps.length === 0) {
        return null;
    }

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <section
            aria-label="Rivojlanish yo‘l xaritasi"
            className="
                relative
                min-w-0
                overflow-hidden

                rounded-[28px]
                border

                border-slate-200
                bg-white/95

                p-5

                shadow-[0_12px_35px_rgba(15,23,42,0.06)]

                dark:border-white/[0.08]
                dark:bg-[#0b1018]/80

                dark:shadow-2xl
                dark:shadow-black/20

                md:p-8
            "
        >
            {/* =====================================
                BACKGROUND GLOWS
            ====================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none

                    absolute
                    -right-24
                    -top-24

                    h-56
                    w-56

                    rounded-full

                    bg-indigo-500/[0.07]
                    blur-[90px]
                "
            />

            <div
                aria-hidden="true"
                className="
                    pointer-events-none

                    absolute
                    -bottom-24
                    -left-24

                    h-56
                    w-56

                    rounded-full

                    bg-violet-500/[0.06]
                    blur-[90px]
                "
            />

            {/* =====================================
                TIMELINE CONTENT
            ====================================== */}

            <div
                className="
                    relative
                    z-10
                    min-w-0
                "
            >
                {/* =================================
                    VERTICAL TIMELINE LINE

                    Original roadmap line position
                    is preserved.
                ================================== */}

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none

                        absolute
                        bottom-5
                        left-4
                        top-5

                        w-px

                        bg-gradient-to-b

                        from-indigo-400/40
                        via-slate-300
                        to-violet-400/30

                        dark:from-indigo-400/30
                        dark:via-white/[0.10]
                        dark:to-violet-400/20
                    "
                />

                {/* =================================
                    ROADMAP ITEMS

                    Preserves the original
                    Redux action callbacks.
                ================================== */}

                <div
                    className="
                        relative
                        min-w-0
                    "
                >
                    {safeRoadmaps.map(
                        (event, index) => {
                            const isLikeLoading = Boolean(
                                isLiking &&
                                likingRoadmapId ===
                                    event?.id
                            );

                            return (
                                <RoadmapItem
                                    key={
                                        event?.id ??
                                        `roadmap-${index}`
                                    }
                                    event={event}
                                    index={index}
                                    isLikeLoading={
                                        isLikeLoading
                                    }
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onToggleLike={
                                        onToggleLike
                                    }
                                />
                            );
                        }
                    )}
                </div>

                {/* =================================
                    OWNER TIP

                    Visible only to the owner.

                    Same informational text as the
                    original ProfileRoadmap.jsx.
                ================================== */}

                {isOwner && (
                    <div
                        className="
                            relative
                            z-10

                            mt-5

                            flex
                            min-w-0

                            items-start
                            gap-3

                            rounded-2xl
                            border

                            border-indigo-200
                            bg-indigo-50

                            px-4
                            py-3

                            dark:border-indigo-400/15
                            dark:bg-indigo-500/[0.05]
                        "
                    >
                        {/* TIP ICON */}

                        <Sparkles
                            size={15}
                            aria-hidden="true"
                            className="
                                mt-0.5
                                shrink-0

                                text-indigo-600
                                dark:text-indigo-400
                            "
                        />

                        {/* TIP TEXT */}

                        <p
                            className="
                                min-w-0

                                text-[11px]
                                font-medium
                                leading-6

                                text-slate-600
                                dark:text-slate-400
                            "
                        >
                            Roadmap profilingizdagi texnik
                            rivojlanish tarixini
                            ko‘rsatadi. Yangi texnologiya
                            yoki ish tajribasini
                            boshlaganingizda timeline’ga
                            qo‘shib boring.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfileRoadmapTimeline);
