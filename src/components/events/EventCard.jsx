
// src/components/events/EventCard.jsx

import React, {
    memo,
    useEffect,
    useId,
    useMemo,
    useState,
} from "react";

import {
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    Clock3,
    Gift,
    LockKeyhole,
    Sparkles,
} from "lucide-react";

import SeasonalGiftCard from "./SeasonalGiftCard";

// =========================================================
// FSOCIETY — EVENT CARD
// =========================================================
//
// Location:
// src/components/events/EventCard.jsx
//
// Features:
// - Event information
// - Responsive card
// - Light / Dark mode
// - Live countdown
// - Backend event status
// - Expandable Seasonal Gift
// - Lazy gift status loading
// - Accessible toggle button
//
// No Daily Gift functionality.
//
// IMPORTANT:
//
// Countdown is only visual.
//
// SeasonalGiftCard and the Django backend
// decide whether the user can claim a gift.
//
// =========================================================


// =========================================================
// CONSTANTS
// =========================================================

const STATUS_CONFIG = {
    scheduled: {
        label: "Kutilmoqda",
        className:
            "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
    },

    active: {
        label: "Faol",
        className:
            "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    },

    finished: {
        label: "Yakunlangan",
        className:
            "border-slate-400/20 bg-slate-400/10 text-slate-600 dark:text-slate-300",
    },

    disabled: {
        label: "O‘chirilgan",
        className:
            "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300",
    },

    unknown: {
        label: "Tadbir",
        className:
            "border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-300",
    },
};


// =========================================================
// HELPERS
// =========================================================

const getEventStatus = (event) => {
    if (event?.is_enabled === false) {
        return "disabled";
    }

    const status =
        typeof event?.status === "string"
            ? event.status.toLowerCase().trim()
            : "";

    return Object.prototype.hasOwnProperty.call(
        STATUS_CONFIG,
        status
    )
        ? status
        : "unknown";
};

const getEventTitle = (event) => {
    const value =
        event?.name ??
        event?.title;

    return typeof value === "string" &&
        value.trim()
        ? value.trim()
        : "Bayram tadbiri";
};

const getEventDescription = (event) => {
    const value =
        event?.description ??
        event?.short_description;

    return typeof value === "string"
        ? value.trim()
        : "";
};

const parseEventDate = (value) => {
    if (
        typeof value !== "string" ||
        !value.trim()
    ) {
        return null;
    }

    const timestamp = Date.parse(value);

    return Number.isFinite(timestamp)
        ? timestamp
        : null;
};

const formatEventDate = (
    value,
    timezone
) => {
    const timestamp = parseEventDate(value);

    if (timestamp === null) {
        return "Sana belgilanmagan";
    }

    const options = {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    };

    try {
        if (
            typeof timezone === "string" &&
            timezone.trim()
        ) {
            options.timeZone = timezone;
        }

        return new Intl.DateTimeFormat(
            "uz-UZ",
            options
        ).format(new Date(timestamp));
    } catch {
        return new Intl.DateTimeFormat(
            "uz-UZ",
            {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        ).format(new Date(timestamp));
    }
};

const padNumber = (value) =>
    String(value).padStart(2, "0");


// =========================================================
// COUNTDOWN HELPER
// =========================================================

const getCountdownParts = (
    target,
    now
) => {
    if (target === null) {
        return null;
    }

    const remaining = Math.max(
        0,
        target - now
    );

    const seconds = Math.floor(
        remaining / 1000
    );

    const days = Math.floor(
        seconds / 86400
    );

    const hours = Math.floor(
        (seconds % 86400) / 3600
    );

    const minutes = Math.floor(
        (seconds % 3600) / 60
    );

    const lastSeconds = seconds % 60;

    return {
        remaining,
        days,
        hours,
        minutes,
        seconds: lastSeconds,
    };
};


// =========================================================
// LIVE COUNTDOWN
// =========================================================
//
// Used for event presentation only.
//
// The actual gift eligibility is always
// verified by the backend.
//
// =========================================================

const LiveEventCountdown = memo(
    function LiveEventCountdown({
        startsAt,
        status,
    }) {
        const target = useMemo(
            () => parseEventDate(startsAt),
            [startsAt]
        );

        const [now, setNow] = useState(
            () => Date.now()
        );

        useEffect(() => {
            setNow(Date.now());

            if (
                target === null ||
                status === "disabled" ||
                status === "finished" ||
                target <= Date.now()
            ) {
                return undefined;
            }

            const intervalId =
                window.setInterval(() => {
                    setNow(Date.now());
                }, 1000);

            return () => {
                window.clearInterval(intervalId);
            };
        }, [
            target,
            status,
        ]);

        const countdown =
            getCountdownParts(
                target,
                now
            );

        if (
            !countdown ||
            countdown.remaining <= 0 ||
            status === "disabled" ||
            status === "finished"
        ) {
            return null;
        }

        const units = [
            {
                label: "kun",
                value: countdown.days,
            },
            {
                label: "soat",
                value: countdown.hours,
            },
            {
                label: "daqiqa",
                value: countdown.minutes,
            },
            {
                label: "soniya",
                value: countdown.seconds,
            },
        ];

        return (
            <div
                aria-label="Tadbir boshlanishigacha qolgan vaqt"
                className="
                    mt-4 rounded-2xl
                    border border-violet-200/70
                    bg-violet-50/70
                    p-3
                    dark:border-violet-400/15
                    dark:bg-violet-400/[0.055]
                "
            >
                <div
                    className="
                        mb-3 flex items-center
                        gap-2 text-xs font-bold
                        text-violet-700
                        dark:text-violet-300
                    "
                >
                    <Clock3
                        size={15}
                        aria-hidden="true"
                    />

                    Bayram boshlanishigacha
                </div>

                <div
                    aria-live="off"
                    className="grid grid-cols-4 gap-2"
                >
                    {units.map((unit) => (
                        <div
                            key={unit.label}
                            className="
                                flex min-w-0
                                flex-col items-center
                                rounded-xl
                                border border-violet-200/50
                                bg-white/80
                                px-1 py-2
                                dark:border-white/10
                                dark:bg-white/[0.04]
                            "
                        >
                            <span
                                className="
                                    text-xl font-black
                                    tabular-nums
                                    tracking-tight
                                    text-slate-900
                                    sm:text-2xl
                                    dark:text-white
                                "
                            >
                                {padNumber(unit.value)}
                            </span>

                            <span
                                className="
                                    mt-1 text-[10px]
                                    font-medium
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                {unit.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
);


// =========================================================
// EVENT CARD
// =========================================================

function EventCard({
    event,
    className = "",
    showGift = true,
    defaultGiftOpen = false,
}) {
    const giftPanelId = useId();

    const [giftOpen, setGiftOpen] =
        useState(
            Boolean(defaultGiftOpen)
        );

    const status = useMemo(
        () => getEventStatus(event),
        [event]
    );

    const statusConfig =
        STATUS_CONFIG[status];

    const eventName =
        getEventTitle(event);

    const description =
        getEventDescription(event);

    const slug =
        typeof event?.slug === "string"
            ? event.slug.trim()
            : "";

    const timezone =
        event?.timezone_name ??
        "";

    const startsAt =
        event?.starts_at ??
        null;

    const endsAt =
        event?.ends_at ??
        null;

    const canShowGift = Boolean(
        showGift &&
        slug &&
        status !== "disabled" &&
        status !== "finished"
    );

    const toggleGift = () => {
        if (!canShowGift) {
            return;
        }

        setGiftOpen((previous) => !previous);
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <article
            className={`
                group/event relative isolate
                flex h-full flex-col
                overflow-hidden
                rounded-3xl
                border border-slate-200/90
                bg-white/90
                p-4
                shadow-sm
                transition-[border-color,box-shadow]
                duration-200
                hover:border-violet-300
                hover:shadow-xl
                hover:shadow-violet-500/5
                sm:p-5
                dark:border-white/10
                dark:bg-[#0d1322]/90
                dark:hover:border-violet-400/30
                ${className}
            `}
        >
            {/* DECORATIVE BACKGROUND */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute -right-20 -top-24
                    h-52 w-52
                    rounded-full
                    bg-violet-400/10
                    blur-3xl
                    dark:bg-violet-500/10
                "
            />

            <div className="relative z-10 flex flex-1 flex-col">
                {/* HEADER */}

                <div className="flex items-start justify-between gap-3">
                    <div
                        className="
                            flex h-12 w-12
                            shrink-0 items-center
                            justify-center rounded-2xl
                            bg-gradient-to-br
                            from-violet-600
                            to-cyan-500 text-white
                            shadow-lg
                            shadow-violet-500/15
                        "
                    >
                        <Gift
                            size={23}
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />
                    </div>

                    <span
                        className={`
                            inline-flex items-center
                            gap-1.5 rounded-full
                            border px-2.5 py-1.5
                            text-[11px] font-bold
                            ${statusConfig.className}
                        `}
                    >
                        {status === "active" ? (
                            <Sparkles
                                size={13}
                                aria-hidden="true"
                            />
                        ) : status === "finished" ? (
                            <CheckCircle2
                                size={13}
                                aria-hidden="true"
                            />
                        ) : (
                            <Clock3
                                size={13}
                                aria-hidden="true"
                            />
                        )}

                        {statusConfig.label}
                    </span>
                </div>

                {/* EVENT CONTENT */}

                <div className="mt-4">
                    <h3
                        className="
                            break-words
                            text-lg font-black
                            leading-tight
                            text-slate-900
                            dark:text-white
                        "
                    >
                        {eventName}
                    </h3>

                    {description && (
                        <p
                            className="
                                mt-2 line-clamp-3
                                text-sm leading-6
                                text-slate-600
                                dark:text-slate-400
                            "
                        >
                            {description}
                        </p>
                    )}
                </div>

                {/* EVENT DATES */}

                <div
                    className="
                        mt-4 space-y-2
                        rounded-xl
                        border border-slate-200/80
                        bg-slate-50/80
                        p-3
                        dark:border-white/10
                        dark:bg-white/[0.035]
                    "
                >
                    <div
                        className="
                            flex items-start
                            gap-2 text-xs
                            text-slate-600
                            dark:text-slate-300
                        "
                    >
                        <CalendarDays
                            size={15}
                            className="
                                mt-0.5 shrink-0
                                text-violet-500
                            "
                            aria-hidden="true"
                        />

                        <span>
                            <strong>Boshlanish:</strong>{" "}
                            {formatEventDate(
                                startsAt,
                                timezone
                            )}
                        </span>
                    </div>

                    {endsAt && (
                        <div
                            className="
                                flex items-start
                                gap-2 text-xs
                                text-slate-600
                                dark:text-slate-300
                            "
                        >
                            <Clock3
                                size={15}
                                className="
                                    mt-0.5 shrink-0
                                    text-cyan-500
                                "
                                aria-hidden="true"
                            />

                            <span>
                                <strong>Yakun:</strong>{" "}
                                {formatEventDate(
                                    endsAt,
                                    timezone
                                )}
                            </span>
                        </div>
                    )}
                </div>

                {/* COUNTDOWN */}

                <LiveEventCountdown
                    startsAt={startsAt}
                    status={status}
                />

                {/* GIFT ACTION */}

                <div className="mt-auto pt-5">
                    {canShowGift ? (
                        <button
                            type="button"
                            onClick={toggleGift}
                            aria-expanded={giftOpen}
                            aria-controls={giftPanelId}
                            className="
                                inline-flex min-h-11
                                w-full items-center
                                justify-center gap-2
                                rounded-xl
                                bg-gradient-to-r
                                from-violet-600
                                to-fuchsia-600
                                px-4 py-3
                                text-sm font-bold
                                text-white
                                transition-[filter,transform]
                                duration-200
                                hover:brightness-110
                                active:scale-[0.99]
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-violet-400
                                focus-visible:ring-offset-2
                                motion-reduce:transform-none
                            "
                        >
                            <Gift
                                size={17}
                                aria-hidden="true"
                            />

                            {giftOpen
                                ? "Sovg‘ani yashirish"
                                : "Bayram sovg‘asini ko‘rish"}

                            <ChevronDown
                                size={17}
                                aria-hidden="true"
                                className={`
                                    transition-transform
                                    duration-200
                                    ${giftOpen ? "rotate-180" : ""}
                                `}
                            />
                        </button>
                    ) : (
                        <div
                            className="
                                flex min-h-11
                                items-center
                                justify-center gap-2
                                rounded-xl
                                border border-slate-200
                                bg-slate-100
                                px-4 py-3
                                text-sm font-semibold
                                text-slate-500
                                dark:border-white/10
                                dark:bg-white/5
                                dark:text-slate-400
                            "
                        >
                            <LockKeyhole
                                size={16}
                                aria-hidden="true"
                            />

                            Sovg‘a ochish mavjud emas
                        </div>
                    )}
                </div>

                {/* SEASONAL GIFT PANEL */}

                {canShowGift && giftOpen && (
                    <div
                        id={giftPanelId}
                        className="
                            mt-4 border-t
                            border-slate-200
                            pt-4
                            dark:border-white/10
                        "
                    >
                        <SeasonalGiftCard
                            event={event}
                            eventSlug={slug}
                            openingAt={
                                event?.gift_opens_at ??
                                startsAt
                            }
                            className="shadow-none"
                        />
                    </div>
                )}
            </div>
        </article>
    );
}


// =========================================================
// EXPORTS
// =========================================================

export { getEventStatus };

export default memo(EventCard);
