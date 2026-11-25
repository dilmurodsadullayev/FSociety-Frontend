
 // src/components/events/EventCard.jsx

import React, { memo, useMemo } from "react";
import { Link } from "react-router-dom";

import {
    ArrowUpRight,
    CalendarDays,
    Clock3,
    Gift,
    Sparkles,
} from "lucide-react";

import EventStatusBadge, {
    normalizeEventStatus,
} from "./EventStatusBadge";

import EventCountdown from "./EventCountdown";

import {
    parseEventTimestamp,
} from "../../utils/events/countdownUtils";

// =========================================================
// FSOCIETY — UNIVERSAL EVENT CARD
// =========================================================
//
// Features:
// - Backend-driven event information
// - Dark / Light mode
// - Responsive layout
// - Event status
// - Event countdown
// - Event detail navigation
// - Graceful missing-data handling
//
// IMPORTANT:
// - Does not create gift claims
// - Does not invent reward information
// - Does not calculate event lifecycle locally
// - Does not depend on Winter Mode
//
// =========================================================


// =========================================================
// HELPERS
// =========================================================

const SLUG_PATTERN = /^[a-zA-Z0-9_-]+$/;

const getText = (value, fallback = "") => {
    return typeof value === "string" &&
        value.trim()
        ? value.trim()
        : fallback;
};

export const getEventDisplayStatus = (event) => {
    if (
        !event ||
        typeof event !== "object" ||
        event.is_enabled === false ||
        event.enabled === false
    ) {
        return "disabled";
    }

    return normalizeEventStatus(
        event.status ??
        event.event_status ??
        event.lifecycle_status
    );
};

const getEventTimezone = (event) => {
    return getText(
        event?.timezone_name ??
        event?.timezone,
        "Asia/Tashkent"
    );
};

const formatEventDate = (value, timezone) => {
    const timestamp = parseEventTimestamp(value);

    if (timestamp === null) {
        return null;
    }

    const date = new Date(timestamp);

    const options = {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: timezone,
    };

    try {
        return new Intl.DateTimeFormat(
            "uz-UZ",
            options
        ).format(date);
    } catch {
        return new Intl.DateTimeFormat(
            "uz-UZ",
            {
                ...options,
                timeZone: "Asia/Tashkent",
            }
        ).format(date);
    }
};


// =========================================================
// EVENT CARD
// =========================================================

const EventCard = memo(function EventCard({
    event,
    featured = false,
    onCountdownExpire,
    className = "",
}) {
    const slug = getText(event?.slug);

    const hasValidSlug = SLUG_PATTERN.test(slug);

    const name = getText(
        event?.name ?? event?.title,
        "Nomsiz tadbir"
    );

    const description = getText(
        event?.description,
        "Tadbir haqida batafsil ma'lumot " +
            "tez orada e'lon qilinadi."
    );

    const status = getEventDisplayStatus(event);

    const timezone = getEventTimezone(event);

    const startDate = useMemo(
        () => formatEventDate(
            event?.starts_at,
            timezone
        ),
        [event?.starts_at, timezone]
    );

    const endDate = useMemo(
        () => formatEventDate(
            event?.ends_at,
            timezone
        ),
        [event?.ends_at, timezone]
    );

    // The gift can open after the event begins.
    // Prefer its explicit opening time when present.

    const giftOpensAt =
        event?.gift_opens_at ??
        event?.opens_at ??
        null;

    const countdownTarget =
        status === "disabled" ||
        status === "finished"
            ? null
            : giftOpensAt ??
              (
                  status === "scheduled"
                      ? event?.starts_at
                      : null
              );

    const countdownLabel = giftOpensAt
        ? "Sovg‘a ochilishigacha"
        : "Tadbir boshlanishigacha";

    const showCountdown =
        countdownTarget !== null &&
        parseEventTimestamp(countdownTarget) !== null;

    const isActive = status === "active";

    return (
        <article
            className={[
                "group relative flex h-full min-w-0",
                "flex-col overflow-hidden rounded-2xl",
                "border border-slate-200/80",
                "bg-white/85 shadow-lg",
                "shadow-slate-900/5 backdrop-blur-xl",

                "transition-all duration-300",
                "hover:-translate-y-1",
                "hover:border-sky-300",
                "hover:shadow-xl",

                "dark:border-white/10",
                "dark:bg-slate-950/75",
                "dark:shadow-black/20",
                "dark:hover:border-sky-500/40",

                "motion-reduce:transform-none",
                "motion-reduce:transition-none",

                featured
                    ? "lg:col-span-2"
                    : "",

                className,
            ].filter(Boolean).join(" ")}
        >
            {/* DECORATIVE HEADER */}

            <div
                aria-hidden="true"
                className={[
                    "relative h-32 overflow-hidden",
                    "bg-gradient-to-br",
                    "from-slate-900 via-sky-950 to-teal-950",
                    "dark:from-slate-900",
                    "dark:via-slate-950",
                    "dark:to-emerald-950",
                    featured ? "sm:h-40" : "",
                ].join(" ")}
            >
                <div
                    className="
                        absolute -right-12 -top-16
                        h-48 w-48 rounded-full
                        bg-cyan-400/15 blur-3xl
                    "
                />

                <div
                    className="
                        absolute -bottom-20 -left-10
                        h-40 w-40 rounded-full
                        bg-emerald-400/15 blur-3xl
                    "
                />

                <div
                    className="
                        absolute inset-0 opacity-20
                        [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)]
                        [background-size:28px_28px]
                    "
                />

                <div
                    className="
                        absolute inset-0 flex
                        items-center justify-center
                    "
                >
                    <div
                        className="
                            flex h-16 w-16 items-center
                            justify-center rounded-2xl
                            border border-white/20
                            bg-white/10 shadow-lg
                            backdrop-blur-md
                            transition-transform duration-300
                            group-hover:rotate-3
                            group-hover:scale-105
                            motion-reduce:transform-none
                        "
                    >
                        <Gift
                            size={32}
                            strokeWidth={1.5}
                            className="text-white"
                        />
                    </div>
                </div>

                <Sparkles
                    size={22}
                    className="
                        absolute right-6 top-5
                        text-cyan-200/80
                    "
                />

                <span
                    className="
                        absolute bottom-3 left-4
                        text-[10px] font-bold
                        uppercase tracking-[0.2em]
                        text-white/65
                    "
                >
                    FSOCIETY EVENTS
                </span>
            </div>

            {/* CARD BODY */}

            <div
                className="
                    flex min-w-0 flex-1
                    flex-col gap-4 p-4
                    sm:p-5
                "
            >
                <div
                    className="
                        flex flex-wrap items-center
                        justify-between gap-2
                    "
                >
                    <EventStatusBadge
                        status={status}
                        showDot={isActive}
                    />

                    {isActive && (
                        <span
                            className="
                                inline-flex items-center gap-1
                                text-xs font-medium
                                text-emerald-700
                                dark:text-emerald-300
                            "
                        >
                            <span
                                className="
                                    h-1.5 w-1.5 rounded-full
                                    bg-emerald-500
                                    motion-safe:animate-pulse
                                "
                            />

                            Hozir faol
                        </span>
                    )}
                </div>

                <div className="min-w-0 space-y-2">
                    <h3
                        className="
                            break-words text-xl
                            font-bold tracking-tight
                            text-slate-900
                            dark:text-white
                        "
                    >
                        {name}
                    </h3>

                    <p
                        className="
                            line-clamp-3 break-words
                            text-sm leading-relaxed
                            text-slate-600
                            dark:text-slate-400
                        "
                    >
                        {description}
                    </p>
                </div>

                {/* EVENT DATES */}

                {(startDate || endDate) && (
                    <div
                        className="
                            space-y-2 rounded-xl
                            border border-slate-200/70
                            bg-slate-50/80 p-3
                            dark:border-white/10
                            dark:bg-white/[0.03]
                        "
                    >
                        {startDate && (
                            <div
                                className="
                                    flex items-start gap-2
                                    text-xs text-slate-600
                                    dark:text-slate-300
                                "
                            >
                                <CalendarDays
                                    size={15}
                                    className="
                                        mt-0.5 shrink-0
                                        text-sky-600
                                        dark:text-sky-400
                                    "
                                />

                                <span>
                                    <strong>Boshlanish:</strong>{" "}
                                    {startDate}
                                </span>
                            </div>
                        )}

                        {endDate && (
                            <div
                                className="
                                    flex items-start gap-2
                                    text-xs text-slate-600
                                    dark:text-slate-300
                                "
                            >
                                <Clock3
                                    size={15}
                                    className="
                                        mt-0.5 shrink-0
                                        text-slate-500
                                    "
                                />

                                <span>
                                    <strong>Tugash:</strong>{" "}
                                    {endDate}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* COUNTDOWN */}

                {showCountdown && (
                    <EventCountdown
                        title={countdownLabel}
                        targetTime={countdownTarget}
                        serverTime={event?.server_time}
                        enabled
                        variant="compact"
                        expiredText={
                            "Belgilangan vaqt yetib keldi"
                        }
                        onExpire={onCountdownExpire}
                    />
                )}

                {/* NAVIGATION */}

                <div className="mt-auto pt-2">
                    {hasValidSlug ? (
                        <Link
                            to={`/events/${encodeURIComponent(slug)}`}
                            className="
                                inline-flex min-h-11 w-full
                                items-center justify-center
                                gap-2 rounded-xl
                                bg-slate-900 px-4 py-3
                                text-sm font-semibold text-white
                                shadow-sm transition-all
                                hover:bg-slate-800
                                focus-visible:outline
                                focus-visible:outline-2
                                focus-visible:outline-offset-2
                                focus-visible:outline-sky-500

                                dark:bg-white
                                dark:text-slate-950
                                dark:hover:bg-slate-200

                                motion-reduce:transition-none
                            "
                            aria-label={`${name} — batafsil`}
                        >
                            Tadbirni ko‘rish

                            <ArrowUpRight
                                size={17}
                                aria-hidden="true"
                            />
                        </Link>
                    ) : (
                        <button
                            type="button"
                            disabled
                            className="
                                min-h-11 w-full rounded-xl
                                bg-slate-200 px-4 py-3
                                text-sm font-semibold
                                text-slate-500
                                dark:bg-slate-800
                                dark:text-slate-400
                            "
                        >
                            Tadbir havolasi mavjud emas
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
});

// =========================================================
// EXPORT
// =========================================================

export default EventCard;
