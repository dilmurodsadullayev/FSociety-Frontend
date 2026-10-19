
import React, { memo } from "react";

import {
    Plus,
    RefreshCw,
    Route,
} from "lucide-react";

import ProfileRoadmapStats from "./ProfileRoadmapStats";

// =========================================================
// CONSTANTS
// =========================================================

const EMPTY_ROADMAPS = [];

// =========================================================
// PROFILE ROADMAP HEADER
//
// Props:
//
// roadmaps:
//   Current roadmap list.
//
// isOwner:
//   Whether the current user owns this profile.
//
// isLoading:
//   Redux loading state.
//
// onRefresh:
//   Existing handleRetry callback.
//
// onCreate:
//   Existing handleCreateClick callback.
//
// Features:
//
// - Title and description
// - Roadmap counter
// - Refresh button
// - Owner-only create button
// - Four statistics
// - Light / Dark Mode
// - Responsive layout
//
// API, Redux and modal state remain in ProfileRoadmap.
// =========================================================

const ProfileRoadmapHeader = ({
    roadmaps = EMPTY_ROADMAPS,
    isOwner = false,
    isLoading = false,
    onRefresh,
    onCreate,
}) => {
    // =====================================================
    // SAFE ROADMAPS
    // =====================================================

    const safeRoadmaps = Array.isArray(roadmaps)
        ? roadmaps
        : EMPTY_ROADMAPS;

    // =====================================================
    // BUTTON PERMISSIONS
    // =====================================================

    const canRefresh =
        typeof onRefresh === "function";

    const canCreate =
        typeof onCreate === "function";

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <section
            aria-label="Yo‘l xaritasi boshqaruvi"
            className="
                relative
                min-w-0
                overflow-hidden

                rounded-[26px]
                border

                border-slate-200
                bg-white/95

                p-5

                shadow-[0_12px_35px_rgba(15,23,42,0.06)]

                dark:border-white/[0.08]
                dark:bg-[#0b1018]/90

                dark:shadow-[0_15px_35px_rgba(0,0,0,0.2)]

                sm:p-6
            "
        >
            {/* =====================================
                BACKGROUND GLOW
            ====================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none

                    absolute
                    -right-16
                    -top-20

                    h-48
                    w-48

                    rounded-full

                    bg-indigo-500/[0.08]
                    blur-[75px]
                "
            />

            {/* =====================================
                MAIN HEADER
            ====================================== */}

            <div
                className="
                    relative
                    z-10

                    flex
                    min-w-0
                    flex-col
                    gap-5

                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
                {/* =================================
                    TITLE AREA
                ================================== */}

                <div
                    className="
                        flex
                        min-w-0
                        items-center
                        gap-4
                    "
                >
                    {/* ICON */}

                    <div
                        aria-hidden="true"
                        className="
                            flex
                            h-12
                            w-12
                            shrink-0

                            items-center
                            justify-center

                            rounded-2xl
                            border

                            border-indigo-200
                            bg-indigo-50

                            text-indigo-700

                            dark:border-indigo-400/15
                            dark:bg-indigo-500/[0.07]
                            dark:text-indigo-300
                        "
                    >
                        <Route size={22} />
                    </div>

                    {/* HEADING */}

                    <div className="min-w-0">
                        <div
                            className="
                                flex
                                min-w-0
                                flex-wrap
                                items-center
                                gap-2
                            "
                        >
                            <h3
                                className="
                                    text-xl
                                    font-black
                                    tracking-tight

                                    text-slate-900
                                    dark:text-white

                                    sm:text-2xl
                                "
                            >
                                Yo‘l xaritasi
                            </h3>

                            {/* ROADMAP COUNT */}

                            <span
                                aria-label={`${safeRoadmaps.length} ta roadmap`}
                                className="
                                    inline-flex
                                    shrink-0
                                    items-center

                                    rounded-full
                                    border

                                    border-indigo-200
                                    bg-indigo-50

                                    px-2.5
                                    py-1

                                    text-[9px]
                                    font-black
                                    tabular-nums

                                    text-indigo-700

                                    dark:border-indigo-400/15
                                    dark:bg-indigo-500/[0.06]
                                    dark:text-indigo-300
                                "
                            >
                                {safeRoadmaps.length} ta
                            </span>
                        </div>

                        {/* DESCRIPTION */}

                        <p
                            className="
                                mt-1
                                text-xs
                                font-medium
                                leading-5

                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            O‘rganish, tajriba va rivojlanish timeline’i
                        </p>
                    </div>
                </div>

                {/* =================================
                    ACTIONS
                ================================== */}

                <div
                    className="
                        flex
                        shrink-0
                        flex-wrap
                        items-center
                        gap-2
                    "
                >
                    {/* =============================
                        REFRESH BUTTON
                    ============================== */}

                    <button
                        type="button"
                        title="Roadmaplarni yangilash"
                        aria-label="Roadmaplarni yangilash"
                        onClick={onRefresh}
                        disabled={
                            isLoading ||
                            !canRefresh
                        }
                        className="
                            inline-flex
                            h-10
                            w-10
                            shrink-0

                            items-center
                            justify-center

                            rounded-xl
                            border

                            border-slate-200
                            bg-slate-50

                            text-slate-600

                            transition-colors

                            hover:border-indigo-300
                            hover:bg-indigo-50
                            hover:text-indigo-700

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-indigo-500/50

                            disabled:cursor-not-allowed
                            disabled:opacity-40

                            dark:border-white/[0.08]
                            dark:bg-white/[0.025]
                            dark:text-slate-400

                            dark:hover:border-indigo-400/20
                            dark:hover:bg-indigo-500/[0.06]
                            dark:hover:text-indigo-300
                        "
                    >
                        <RefreshCw
                            size={15}
                            aria-hidden="true"
                            className={
                                isLoading
                                    ? "animate-spin motion-reduce:animate-none"
                                    : ""
                            }
                        />
                    </button>

                    {/* =============================
                        CREATE ROADMAP

                        Visible only to profile owner.
                    ============================== */}

                    {isOwner && (
                        <button
                            type="button"
                            onClick={onCreate}
                            disabled={!canCreate}
                            className="
                                group

                                inline-flex
                                min-h-[40px]
                                max-w-full

                                items-center
                                justify-center
                                gap-2

                                rounded-xl
                                border

                                border-indigo-400/25
                                bg-indigo-600

                                px-4
                                py-2.5

                                text-xs
                                font-black
                                text-white

                                shadow-lg
                                shadow-indigo-600/20

                                transition-all

                                hover:-translate-y-0.5
                                hover:bg-indigo-500

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-indigo-500/50

                                disabled:cursor-not-allowed
                                disabled:opacity-50

                                active:translate-y-0
                                active:scale-[0.97]

                                motion-reduce:transform-none
                            "
                        >
                            <Plus
                                size={15}
                                aria-hidden="true"
                                className="
                                    transition-transform
                                    group-hover:rotate-90

                                    motion-reduce:transform-none
                                "
                            />

                            <span>
                                Roadmap qo‘shish
                            </span>
                        </button>
                    )}
                </div>
            </div>

            {/* =====================================
                ROADMAP STATISTICS

                Component:
                ProfileRoadmapStats.jsx

                - Jami
                - Learning
                - Experience
                - Yakunlangan
            ====================================== */}

            <ProfileRoadmapStats
                roadmaps={safeRoadmaps}
            />
        </section>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfileRoadmapHeader);
