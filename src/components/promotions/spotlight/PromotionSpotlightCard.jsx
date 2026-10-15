
import React from "react";

import { Link } from "react-router-dom";

import {
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
    Eye,
    Megaphone,
    Star,
} from "lucide-react";

import ProjectThumbnail from "./ProjectThumbnail";

import {
    formatCompactNumber,
    getProjectStack,
} from "./spotlightUtils";

// =========================================================
// PROMOTION SPOTLIGHT CARD
// =========================================================

const PromotionSpotlightCard = ({
    project,
    projects,
    currentIndex,
    onPrevious,
    onNext,
    onSelect,
    onMouseEnter,
    onMouseLeave,
    onFocusCapture,
    onBlurCapture,
}) => {
    if (!project) {
        return null;
    }

    const total = projects.length;

    const projectName =
        project.name || "Untitled project";

    const username =
        project.user?.username || "developer";

    const stack = getProjectStack(project);

    const stars = formatCompactNumber(
        project.stars_count
    );

    const views = formatCompactNumber(
        project.views_count
    );

    const projectUrl = project.id != null
        ? `/project/${project.id}/detail`
        : "/projects";

    return (
        <section
            aria-label="Targ‘ib qilinayotgan loyiha"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onFocusCapture={onFocusCapture}
            onBlurCapture={onBlurCapture}
            className="
                group/promo
                relative
                overflow-hidden
                rounded-2xl
                border
                border-[#dce5f0]
                bg-[#f9fbff]
                shadow-[0_8px_25px_rgba(30,41,59,0.05)]
                transition-colors
                duration-150
                hover:border-indigo-400/35
                dark:border-white/10
                dark:bg-[#0d1117]
                dark:shadow-xl
                dark:shadow-black/10
                dark:hover:border-indigo-400/25
            "
        >
            {/* BACKGROUND ACCENT */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    -right-14
                    -top-14
                    h-28
                    w-28
                    rounded-full
                    bg-indigo-500/[0.05]
                    blur-3xl
                "
            />

            {/* ======================================
                PROMOTION HEADER
            ====================================== */}

            <div
                className="
                    relative
                    flex
                    h-8
                    items-center
                    justify-between
                    gap-2
                    border-b
                    border-[#e2e8f2]
                    px-3.5
                    dark:border-white/[0.06]
                "
            >
                <div className="flex items-center gap-2">
                    <Megaphone
                        size={11}
                        strokeWidth={2.2}
                        aria-hidden="true"
                        className="
                            text-indigo-600
                            dark:text-indigo-300
                        "
                    />

                    <span
                        className="
                            font-mono
                            text-[9px]
                            font-black
                            uppercase
                            tracking-[0.17em]
                            text-indigo-700
                            dark:text-indigo-300/70
                        "
                    >
                        promoted
                    </span>

                    <span
                        aria-hidden="true"
                        className="
                            h-1
                            w-1
                            rounded-full
                            bg-emerald-500
                            dark:bg-emerald-400
                        "
                    />
                </div>

                {total > 1 && (
                    <span
                        className="
                            font-mono
                            text-[9px]
                            font-black
                            text-slate-500
                            dark:text-gray-700
                        "
                    >
                        {String(currentIndex + 1).padStart(2, "0")}
                        {" / "}
                        {String(total).padStart(2, "0")}
                    </span>
                )}
            </div>

            {/* ======================================
                PROJECT LINK
            ====================================== */}

            <Link
                to={projectUrl}
                className="
                    relative
                    block
                    rounded-lg
                    px-3.5
                    py-3
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-inset
                    focus-visible:ring-indigo-500
                "
            >
                <div
                    className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                    "
                >
                    <ProjectThumbnail
                        key={project.id ?? projectName}
                        project={project}
                    />

                    <div className="min-w-0 flex-1">

                        {/* PROJECT NAME */}

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-2
                            "
                        >
                            <h4
                                className="
                                    min-w-0
                                    flex-1
                                    truncate
                                    text-[13px]
                                    font-black
                                    text-slate-900
                                    transition-colors
                                    duration-150
                                    group-hover/promo:text-indigo-700
                                    dark:text-white
                                    dark:group-hover/promo:text-indigo-300
                                "
                            >
                                {projectName}
                            </h4>

                            <ArrowUpRight
                                size={13}
                                strokeWidth={2}
                                aria-hidden="true"
                                className="
                                    shrink-0
                                    text-slate-400
                                    transition-transform
                                    duration-150
                                    group-hover/promo:-translate-y-0.5
                                    group-hover/promo:translate-x-0.5
                                    dark:text-gray-700
                                    dark:group-hover/promo:text-indigo-300
                                "
                            />
                        </div>

                        {/* USERNAME */}

                        <p
                            className="
                                mt-0.5
                                truncate
                                text-[10px]
                                font-bold
                                text-slate-500
                                dark:text-gray-600
                            "
                        >
                            @{username}
                        </p>

                        {/* TECHNOLOGY STACK */}

                        {stack.length > 0 && (
                            <div
                                className="
                                    mt-1.5
                                    flex
                                    min-w-0
                                    items-center
                                    gap-1.5
                                "
                            >
                                {stack.map((value, index) => (
                                    <React.Fragment
                                        key={`${value}-${index}`}
                                    >
                                        {index > 0 && (
                                            <span
                                                aria-hidden="true"
                                                className="
                                                    text-[8px]
                                                    text-slate-300
                                                    dark:text-gray-800
                                                "
                                            >
                                                /
                                            </span>
                                        )}

                                        <span
                                            className="
                                                max-w-[95px]
                                                truncate
                                                text-[9px]
                                                font-black
                                                text-slate-500
                                                dark:text-gray-500
                                            "
                                        >
                                            {value}
                                        </span>
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ==================================
                    STARS + VIEWS
                ================================== */}

                <div
                    className="
                        mt-2.5
                        flex
                        items-center
                        justify-between
                        gap-3
                        border-t
                        border-[#e2e8f2]
                        pt-2.5
                        dark:border-white/[0.055]
                    "
                >
                    <div className="flex items-center gap-4">
                        <span
                            className="
                                inline-flex
                                items-center
                                gap-1.5
                                text-[10px]
                                font-black
                                text-slate-700
                                dark:text-gray-300
                            "
                        >
                            <Star
                                size={12}
                                strokeWidth={2}
                                fill="currentColor"
                                aria-hidden="true"
                                className="
                                    text-amber-600
                                    dark:text-yellow-300
                                "
                            />

                            {stars}

                            <span
                                className="
                                    font-mono
                                    text-[8px]
                                    font-bold
                                    uppercase
                                    text-slate-400
                                    dark:text-gray-700
                                "
                            >
                                stars
                            </span>
                        </span>

                        <span
                            className="
                                inline-flex
                                items-center
                                gap-1.5
                                text-[10px]
                                font-black
                                text-slate-700
                                dark:text-gray-300
                            "
                        >
                            <Eye
                                size={12}
                                strokeWidth={2}
                                aria-hidden="true"
                                className="
                                    text-cyan-700
                                    dark:text-cyan-300
                                "
                            />

                            {views}

                            <span
                                className="
                                    font-mono
                                    text-[8px]
                                    font-bold
                                    uppercase
                                    text-slate-400
                                    dark:text-gray-700
                                "
                            >
                                views
                            </span>
                        </span>
                    </div>

                    <span
                        className="
                            font-mono
                            text-[8px]
                            font-black
                            uppercase
                            tracking-[0.1em]
                            text-indigo-500/60
                            dark:text-indigo-400/40
                        "
                    >
                        ad
                    </span>
                </div>
            </Link>

            {/* ======================================
                MULTIPLE PROMOTIONS NAVIGATION
            ====================================== */}

            {total > 1 && (
                <div
                    className="
                        relative
                        flex
                        min-h-9
                        items-center
                        justify-between
                        gap-2
                        border-t
                        border-[#e2e8f2]
                        px-2.5
                        dark:border-white/[0.05]
                    "
                >
                    {/* DOT NAVIGATION */}

                    <div
                        className="
                            flex
                            items-center
                            gap-0.5
                        "
                        aria-label="Promotion slaydlari"
                    >
                        {projects.map((item, index) => {
                            const active =
                                currentIndex === index;

                            return (
                                <button
                                    key={item.id ?? index}
                                    type="button"
                                    onClick={() => onSelect(index)}
                                    aria-label={`${index + 1}-reklamani ko‘rsatish`}
                                    aria-pressed={active}
                                    className="
                                        grid
                                        h-7
                                        w-6
                                        place-items-center
                                        rounded-md
                                        focus-visible:outline-none
                                        focus-visible:ring-2
                                        focus-visible:ring-indigo-500
                                    "
                                >
                                    <span
                                        className={`
                                            h-1.5
                                            rounded-full
                                            transition-all
                                            duration-150

                                            ${
                                                active
                                                    ? `
                                                        w-4
                                                        bg-indigo-600
                                                        dark:bg-indigo-400
                                                    `
                                                    : `
                                                        w-1.5
                                                        bg-slate-300
                                                        hover:bg-indigo-400
                                                        dark:bg-white/10
                                                        dark:hover:bg-white/25
                                                    `
                                            }
                                        `}
                                    />
                                </button>
                            );
                        })}
                    </div>

                    {/* ARROW NAVIGATION */}

                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={onPrevious}
                            aria-label="Oldingi promotion"
                            className="
                                grid
                                h-7
                                w-7
                                place-items-center
                                rounded-lg
                                text-slate-500
                                transition-colors
                                hover:bg-indigo-500/[0.08]
                                hover:text-indigo-700
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-indigo-500
                                dark:text-gray-600
                                dark:hover:bg-white/[0.05]
                                dark:hover:text-gray-300
                            "
                        >
                            <ArrowLeft
                                size={13}
                                aria-hidden="true"
                            />
                        </button>

                        <button
                            type="button"
                            onClick={onNext}
                            aria-label="Keyingi promotion"
                            className="
                                grid
                                h-7
                                w-7
                                place-items-center
                                rounded-lg
                                text-slate-500
                                transition-colors
                                hover:bg-indigo-500/[0.08]
                                hover:text-indigo-700
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-indigo-500
                                dark:text-gray-600
                                dark:hover:bg-white/[0.05]
                                dark:hover:text-gray-300
                            "
                        >
                            <ArrowRight
                                size={13}
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default React.memo(PromotionSpotlightCard);
