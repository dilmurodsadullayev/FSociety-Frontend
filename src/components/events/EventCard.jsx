
 // src/components/events/EventCard.jsx

import React, {
    memo,
    useEffect,
    useId,
    useMemo,
    useState,
} from "react";

import {
    ArrowUpRight,
    CalendarClock,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    Gift,
    LockKeyhole,
    MoonStar,
    ShieldCheck,
    Snowflake,
    Sparkles,
    Sprout,
} from "lucide-react";

import {
    formatEventDate,
    DEFAULT_EVENT_TIMEZONE,
} from "../../utils/formatEventDate";

import EventCountdown from "./EventCountdown";
import { getEventGiftMode } from "../../utils/eventGift";
import DailyGiftCard from "./DailyGiftCard";
import SeasonalGiftCard from "./SeasonalGiftCard";

// =========================================================
// EXPORTS
// =========================================================

export { formatEventDate };

// =========================================================
// FSOCIETY — EVENT CARD
// =========================================================
//
// Features:
// - Featured and standard layouts
// - Admin banner images
// - Dynamic event themes
// - Django gift_mode: daily / seasonal / both
// - Uzbek date formatting
// - Event-local timezone
// - Countdown
// - Light / Dark mode
// - Responsive
//
// =========================================================


// =========================================================
// EVENT THEMES
// =========================================================

const EVENT_THEMES = {
    winter: {
        label: "WINTER DROP",
        Icon: Snowflake,
        background: "from-[#111b40] via-[#30205e] to-[#111a3e]",
        art: "from-[#172a55] via-[#35206e] to-[#101a35]",
        glow: "bg-cyan-400/30",
        accent: "text-cyan-300",
    },

    spring: {
        label: "SPRING DROP",
        Icon: Sprout,
        background: "from-[#103b3b] via-[#176453] to-[#153049]",
        art: "from-[#0e4b52] via-[#187763] to-[#17415d]",
        glow: "bg-emerald-300/30",
        accent: "text-emerald-300",
    },

    ramadan: {
        label: "SPECIAL NIGHT",
        Icon: MoonStar,
        background: "from-[#101b40] via-[#352d63] to-[#15294f]",
        art: "from-[#122856] via-[#39306b] to-[#18264a]",
        glow: "bg-amber-300/25",
        accent: "text-amber-300",
    },

    default: {
        label: "SPECIAL EVENT",
        Icon: Sparkles,
        background: "from-[#211644] via-[#422267] to-[#142950]",
        art: "from-[#22195a] via-[#50277a] to-[#142d58]",
        glow: "bg-fuchsia-400/25",
        accent: "text-fuchsia-300",
    },
};


// =========================================================
// EVENT STATUS CONFIG
// =========================================================

const STATUS_CONFIG = {
    scheduled: {
        label: "Kutilmoqda",
        styles:
            "border-sky-400/25 bg-sky-400/15 text-sky-200",
    },

    active: {
        label: "Faol",
        styles:
            "border-emerald-400/30 bg-emerald-400/15 text-emerald-200",
    },

    finished: {
        label: "Yakunlangan",
        styles:
            "border-white/15 bg-white/10 text-slate-300",
    },

    disabled: {
        label: "Faol emas",
        styles:
            "border-rose-400/25 bg-rose-400/10 text-rose-200",
    },

    unknown: {
        label: "Maxsus tadbir",
        styles:
            "border-violet-400/25 bg-violet-400/15 text-violet-200",
    },
};


// =========================================================
// GIFT MODE CONFIG
// =========================================================

const GIFT_MODE_TEXT = {
    daily: {
        button: "Kunlik sovg‘ani ko‘rish",
        detail: "Har kuni 1 ta sovg‘a",
    },

    seasonal: {
        button: "Bayram sovg‘asini ko‘rish",
        detail: "Ushbu tadbir uchun 1 ta sovg‘a",
    },

    both: {
        button: "Ikkala sovg‘ani ko‘rish",
        detail:
            "Kunlik sovg‘a + bir martalik bayram sovg‘asi",
    },
};


// =========================================================
// GET EVENT STATUS
// =========================================================

export const getEventStatus = (event) => {
    if (event?.is_enabled === false) {
        return "disabled";
    }

    const raw = String(
        event?.event_status ??
        event?.status ??
        ""
    ).trim().toLowerCase();

    if (
        raw === "active" ||
        raw === "ongoing"
    ) {
        return "active";
    }

    if (
        raw === "scheduled" ||
        raw === "upcoming"
    ) {
        return "scheduled";
    }

    if (
        raw === "finished" ||
        raw === "completed" ||
        raw === "ended"
    ) {
        return "finished";
    }

    if (
        raw === "disabled" ||
        raw === "cancelled" ||
        raw === "canceled"
    ) {
        return "disabled";
    }

    return "unknown";
};


// =========================================================
// GET EVENT NAME
// =========================================================

export const getEventName = (event) => {
    const name = event?.name ?? event?.title;

    return (
        typeof name === "string" &&
        name.trim()
    )
        ? name.trim()
        : "Maxsus bayram";
};


// =========================================================
// GET EVENT OPENING DATE
// =========================================================

export const getEventOpeningAt = (event) =>
    event?.opens_at ??
    event?.gift_opens_at ??
    event?.starts_at ??
    event?.start_at ??
    null;


// =========================================================
// GET EVENT TIMEZONE
// =========================================================

export const getEventTimezone = (event) =>
    event?.timezone ??
    event?.timezone_name ??
    DEFAULT_EVENT_TIMEZONE;


// =========================================================
// GET EVENT GIFT MODE
// =========================================================

export { getEventGiftMode };

// =========================================================
// GET EVENT THEME
// =========================================================

const getEventTheme = (event) => {
    const text = [
        event?.slug,
        event?.name,
        event?.title,
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    if (
        /new.year|newyear|yangi.yil|christmas|winter|qish/.test(
            text
        )
    ) {
        return EVENT_THEMES.winter;
    }

    if (
        /navroz|navruz|navro.z|nowruz|bahor/.test(
            text
        )
    ) {
        return EVENT_THEMES.spring;
    }

    if (
        /ramadan|ramazon|hayit|eid/.test(
            text
        )
    ) {
        return EVENT_THEMES.ramadan;
    }

    return EVENT_THEMES.default;
};


// =========================================================
// GET EVENT BANNER
// =========================================================

export const getEventBanner = (event) => {
    const candidates = [
        event?.banner_image_url,
        event?.banner_image,
        event?.cover_image,
        event?.image,
    ];

    return (
        candidates.find(
            (value) =>
                typeof value === "string" &&
                (
                    /^https?:\/\//i.test(value.trim()) ||
                    /^\/(?!\/)/.test(value.trim())
                )
        )?.trim() ?? null
    );
};


// =========================================================
// EVENT STATE BADGE
// =========================================================

const EventStateBadge = memo(
    function EventStateBadge({ status }) {
        const config =
            STATUS_CONFIG[status] ??
            STATUS_CONFIG.unknown;

        return (
            <span
                className={`
                    inline-flex shrink-0 items-center gap-2
                    rounded-full border px-3 py-1.5
                    text-[11px] font-bold backdrop-blur-md
                    ${config.styles}
                `}
            >
                <span
                    className={`
                        h-1.5 w-1.5 rounded-full
                        ${
                            status === "active"
                                ? "bg-emerald-400 motion-safe:animate-pulse"
                                : "bg-current opacity-60"
                        }
                    `}
                />

                {config.label}
            </span>
        );
    }
);


// =========================================================
// EVENT ARTWORK
// =========================================================

const EventArtwork = memo(
    function EventArtwork({
        event,
        theme,
        featured,
    }) {
        const { Icon } = theme;

        const image = getEventBanner(event);

        const [failedImage, setFailedImage] =
            useState(null);

        const imageFailed = Boolean(
            image &&
            failedImage === image
        );

        return (
            <div
                className={`
                    relative isolate overflow-hidden
                    bg-gradient-to-br ${theme.art}
                    ${
                        featured
                            ? "min-h-[245px] rounded-[26px] sm:min-h-[320px]"
                            : "h-44 rounded-[21px]"
                    }
                `}
            >
                {/* ADMIN BANNER */}

                {image && !imageFailed && (
                    <img
                        src={image}
                        alt=""
                        loading="lazy"
                        onError={() =>
                            setFailedImage(image)
                        }
                        className="
                            absolute inset-0 h-full w-full
                            object-cover opacity-80
                        "
                    />
                )}

                {/* ARTWORK OVERLAY */}

                <div
                    className="
                        absolute inset-0
                        bg-gradient-to-t
                        from-[#080f27]/80
                        via-transparent
                        to-[#0a1028]/10
                    "
                />

                {/* GLOW */}

                <div
                    className={`
                        pointer-events-none
                        absolute -right-12 -top-12
                        h-52 w-52 rounded-full
                        blur-[65px]
                        ${theme.glow}
                    `}
                />

                <div
                    className="
                        pointer-events-none
                        absolute -bottom-20 -left-14
                        h-44 w-44 rounded-full
                        bg-violet-400/20 blur-[60px]
                    "
                />

                {/* FALLBACK ARTWORK */}

                {(!image || imageFailed) && (
                    <>
                        <div
                            className="
                                absolute inset-0 opacity-25
                                [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)]
                                [background-size:34px_34px]
                                [mask-image:linear-gradient(to_bottom,black,transparent)]
                            "
                        />

                        <div
                            className="
                                absolute inset-0
                                flex items-center
                                justify-center
                            "
                        >
                            <div
                                className="
                                    absolute h-52 w-52
                                    rounded-full border
                                    border-white/15
                                "
                            />

                            <div
                                className="
                                    absolute h-40 w-40
                                    rounded-full border
                                    border-white/10
                                    bg-white/[0.035]
                                    shadow-[0_0_80px_rgba(139,92,246,0.2)]
                                    backdrop-blur-sm
                                "
                            />

                            <Gift
                                size={featured ? 108 : 80}
                                strokeWidth={1.1}
                                className="
                                    relative z-10 text-white
                                    drop-shadow-[0_0_22px_rgba(168,85,247,0.65)]
                                "
                                aria-hidden="true"
                            />

                            <Sparkles
                                size={22}
                                className="
                                    absolute right-[18%]
                                    top-[20%] text-white/75
                                "
                                aria-hidden="true"
                            />

                            <Icon
                                size={26}
                                className={`
                                    absolute bottom-[20%]
                                    left-[17%]
                                    ${theme.accent}
                                `}
                                aria-hidden="true"
                            />
                        </div>
                    </>
                )}

                {/* THEME LABEL */}

                <div
                    className="
                        absolute bottom-4 left-4
                        inline-flex items-center gap-2
                        rounded-full
                        border border-white/15
                        bg-slate-950/45 px-3 py-1.5
                        text-[10px] font-bold
                        tracking-[0.16em] text-white
                        backdrop-blur-xl
                    "
                >
                    <Icon
                        size={14}
                        className={theme.accent}
                    />

                    {theme.label}
                </div>
            </div>
        );
    }
);


// =========================================================
// GIFT TOGGLE BUTTON
// =========================================================

const GiftToggleButton = memo(
    function GiftToggleButton({
        open,
        onClick,
        disabled,
        panelId,
        featured,
        mode,
    }) {
        if (disabled) {
            return (
                <div
                    className="
                        flex min-h-12 items-center
                        justify-center gap-2
                        rounded-2xl border
                        border-slate-200 bg-slate-100
                        px-4 text-sm font-semibold
                        text-slate-500
                        dark:border-white/10
                        dark:bg-white/5
                        dark:text-slate-400
                    "
                >
                    <LockKeyhole size={17} />

                    Sovg‘a mavjud emas
                </div>
            );
        }

        return (
            <button
                type="button"
                onClick={onClick}
                aria-expanded={open}
                aria-controls={panelId}
                className={`
                    group/btn inline-flex min-h-12
                    items-center justify-center gap-2
                    rounded-2xl px-5 py-3
                    text-sm font-extrabold text-white
                    transition-[filter,transform,box-shadow]
                    duration-200
                    hover:brightness-110
                    active:scale-[0.98]
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-violet-400
                    focus-visible:ring-offset-2
                    motion-reduce:transition-none
                    motion-reduce:transform-none
                    ${
                        featured
                            ? "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 shadow-[0_10px_35px_rgba(139,92,246,0.35)]"
                            : "bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/10"
                    }
                `}
            >
                <Gift
                    size={18}
                    aria-hidden="true"
                />

                <span>
                    {open
                        ? "Sovg‘ani yashirish"
                        : (
                            GIFT_MODE_TEXT[mode]?.button ??
                            "Sovg‘alarni ko‘rish"
                        )}
                </span>

                {open ? (
                    <ChevronDown
                        size={17}
                        className="rotate-180"
                        aria-hidden="true"
                    />
                ) : (
                    <ArrowUpRight
                        size={17}
                        className="
                            transition-transform
                            group-hover/btn:translate-x-0.5
                            group-hover/btn:-translate-y-0.5
                            motion-reduce:transform-none
                        "
                        aria-hidden="true"
                    />
                )}
            </button>
        );
    }
);


// =========================================================
// EVENT GIFT PANELS
// =========================================================
//
// daily    -> DailyGiftCard
// seasonal -> SeasonalGiftCard
// both     -> Both cards
//
// =========================================================

const EventGiftPanels = memo(
    function EventGiftPanels({
        event,
        slug,
        mode,
        openingAt,
        featured,
    }) {
        const daily =
            mode === "daily" ||
            mode === "both";

        const seasonal =
            mode === "seasonal" ||
            mode === "both";

        return (
            <div
                className={
                    daily &&
                    seasonal &&
                    featured
                        ? "grid min-w-0 gap-4 xl:grid-cols-2 xl:items-start"
                        : "grid min-w-0 gap-4"
                }
            >
                {daily && (
                    <DailyGiftCard
                        key={`${slug}:daily`}
                        event={event}
                        eventSlug={slug}
                        embedded
                        showCountdown
                    />
                )}

                {seasonal && (
                    <SeasonalGiftCard
                        key={`${slug}:seasonal`}
                        event={event}
                        eventSlug={slug}
                        openingAt={openingAt}
                        embedded
                    />
                )}
            </div>
        );
    }
);


// =========================================================
// MAIN EVENT CARD
// =========================================================

function EventCard({
    event,
    featured = false,
    className = "",
    defaultGiftOpen = false,
    showGift = true,
}) {
    const panelId = useId();

    const [giftOpen, setGiftOpen] =
        useState(Boolean(defaultGiftOpen));

    // =====================================================
    // EVENT DATA
    // =====================================================

    const slug =
        typeof event?.slug === "string"
            ? event.slug.trim()
            : "";

    const theme = useMemo(
        () => getEventTheme(event),
        [event]
    );

    const { Icon } = theme;

    const status = getEventStatus(event);

    const eventName = getEventName(event);

    const description =
        event?.description ??
        event?.short_description ??
        "";

    const giftMode = getEventGiftMode(event);

    const openingAt = getEventOpeningAt(event);

    const timezone = getEventTimezone(event);

    // =====================================================
    // FORMATTED EVENT DATE
    // =====================================================

    const formattedOpeningAt = useMemo(
        () =>
            formatEventDate(
                openingAt,
                timezone
            ),
        [
            openingAt,
            timezone,
        ]
    );

    // =====================================================
    // EVENT CHANGE
    // =====================================================

    useEffect(() => {
        setGiftOpen(
            Boolean(defaultGiftOpen)
        );
    }, [
        slug,
        defaultGiftOpen,
    ]);

    // =====================================================
    // GIFT VISIBILITY
    // =====================================================

    const canShowGift = Boolean(
        showGift &&
        slug &&
        giftMode
    );

    const toggleGift = () => {
        setGiftOpen(
            (previous) => !previous
        );
    };

    const giftDetail =
        GIFT_MODE_TEXT[giftMode]?.detail ??
        "Sovg‘a rejimi sozlanmagan";

    // =====================================================
    // FEATURED EVENT CARD
    // =====================================================

    if (featured) {
        return (
            <article
                className={`
                    relative isolate overflow-hidden
                    rounded-[30px]
                    border border-violet-300/25
                    bg-gradient-to-br ${theme.background}
                    p-4 text-white
                    shadow-[0_24px_90px_-42px_rgba(124,58,237,0.7)]
                    sm:p-6 lg:p-8
                    ${className}
                `}
            >
                {/* BACKGROUND GLOW */}

                <div
                    aria-hidden="true"
                    className={`
                        pointer-events-none
                        absolute -left-20 -top-32
                        h-80 w-80 rounded-full
                        blur-[90px] ${theme.glow}
                    `}
                />

                <div
                    className="
                        relative z-10 grid gap-7
                        lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]
                        lg:items-center
                    "
                >
                    <div className="min-w-0">
                        {/* STATUS + FEATURED */}

                        <div className="flex flex-wrap items-center gap-2">
                            <EventStateBadge
                                status={status}
                            />

                            <span
                                className="
                                    inline-flex items-center gap-1.5
                                    rounded-full
                                    border border-white/15
                                    bg-white/10 px-3 py-1.5
                                    text-[11px] font-bold
                                    text-white/85
                                "
                            >
                                <Sparkles size={13} />

                                DIQQAT MARKAZIDA
                            </span>
                        </div>

                        {/* THEME */}

                        <div
                            className={`
                                mt-6 inline-flex
                                items-center gap-2
                                text-xs font-black
                                tracking-[0.22em]
                                ${theme.accent}
                            `}
                        >
                            <Icon size={18} />

                            {theme.label}
                        </div>

                        {/* EVENT NAME */}

                        <h2
                            className="
                                mt-3 break-words
                                text-3xl font-black
                                leading-[1.12]
                                tracking-tight
                                sm:text-4xl
                                lg:text-5xl
                            "
                        >
                            {eventName}
                        </h2>

                        {/* DESCRIPTION */}

                        {description && (
                            <p
                                className="
                                    mt-4 line-clamp-3
                                    max-w-xl
                                    text-sm leading-7
                                    text-slate-200/90
                                    sm:text-base
                                "
                            >
                                {description}
                            </p>
                        )}

                        {/* FORMATTED DATE */}

                        <div
                            className="
                                mt-5 inline-flex max-w-full
                                items-center gap-2
                                rounded-xl
                                border border-white/10
                                bg-white/[0.07]
                                px-3 py-2
                                text-xs font-medium
                                text-slate-200
                            "
                        >
                            <CalendarDays
                                size={16}
                                className="shrink-0 text-cyan-300"
                            />

                            <span className="break-words">
                                {formattedOpeningAt}
                            </span>
                        </div>

                        {/* COUNTDOWN */}

                        {openingAt && (
                            <div
                                className="
                                    dark mt-6 max-w-lg
                                    rounded-2xl
                                    border border-white/10
                                    bg-slate-950/25 p-4
                                    backdrop-blur-sm
                                "
                            >
                                <EventCountdown
                                    targetTime={openingAt}
                                />
                            </div>
                        )}

                        {/* GIFT TOGGLE BUTTON */}

                        <div className="mt-5 flex flex-wrap gap-3">
                            <GiftToggleButton
                                featured
                                open={giftOpen}
                                onClick={toggleGift}
                                disabled={!canShowGift}
                                panelId={panelId}
                                mode={giftMode}
                            />
                        </div>

                        {/* GIFT MODE */}

                        <p
                            className="
                                mt-4 flex items-center gap-2
                                text-xs text-slate-300/90
                            "
                        >
                            <ShieldCheck
                                size={15}
                                className="shrink-0 text-emerald-300"
                            />

                            {giftDetail}
                        </p>
                    </div>

                    {/* EVENT ARTWORK */}

                    <EventArtwork
                        event={event}
                        theme={theme}
                        featured
                    />
                </div>

                {/* FEATURED GIFT PANELS */}

                {canShowGift && giftOpen && (
                    <div
                        id={panelId}
                        className="
                            relative z-10 mt-7
                            border-t border-white/15
                            pt-6
                        "
                    >
                        <EventGiftPanels
                            event={event}
                            slug={slug}
                            mode={giftMode}
                            openingAt={openingAt}
                            featured
                        />
                    </div>
                )}
            </article>
        );
    }

    // =====================================================
    // STANDARD EVENT CARD
    // =====================================================

    return (
        <article
            className={`
                group/event relative flex h-full
                min-w-0 flex-col overflow-hidden
                rounded-[27px]
                border border-slate-200/80
                bg-white/90 p-3
                shadow-[0_15px_55px_-35px_rgba(76,29,149,0.25)]
                transition-[border-color,box-shadow,transform]
                duration-300
                hover:-translate-y-1
                hover:border-violet-300
                hover:shadow-[0_20px_65px_-35px_rgba(124,58,237,0.35)]
                dark:border-white/10
                dark:bg-[#11182c]/90
                dark:hover:border-violet-400/30
                motion-reduce:transform-none
                motion-reduce:transition-none
                ${className}
            `}
        >
            {/* ARTWORK */}

            <div className="relative">
                <EventArtwork
                    event={event}
                    theme={theme}
                    featured={false}
                />

                <div className="absolute right-3 top-3">
                    <EventStateBadge
                        status={status}
                    />
                </div>
            </div>

            <div
                className="
                    flex flex-1 flex-col
                    px-2 pb-2 pt-5
                    sm:px-3
                "
            >
                {/* EVENT THEME */}

                <div
                    className="
                        flex items-center gap-2
                        text-[11px] font-extrabold
                        tracking-[0.15em]
                        text-violet-600
                        dark:text-violet-300
                    "
                >
                    <Icon size={15} />

                    {theme.label}
                </div>

                {/* EVENT NAME */}

                <h3
                    className="
                        mt-2 break-words
                        text-xl font-black
                        tracking-tight text-slate-900
                        sm:text-2xl
                        dark:text-white
                    "
                >
                    {eventName}
                </h3>

                {/* DESCRIPTION */}

                {description && (
                    <p
                        className="
                            mt-2 line-clamp-2
                            text-sm leading-6
                            text-slate-600
                            dark:text-slate-400
                        "
                    >
                        {description}
                    </p>
                )}

                {/* FORMATTED EVENT DATE */}

                <div
                    className="
                        mt-4 flex items-start gap-2
                        rounded-xl
                        border border-slate-200/70
                        bg-slate-50/80
                        px-3 py-3
                        text-xs font-medium
                        text-slate-600
                        dark:border-white/10
                        dark:bg-white/[0.035]
                        dark:text-slate-300
                    "
                >
                    <CalendarDays
                        size={16}
                        className="shrink-0 text-violet-500"
                    />

                    <span>
                        {formattedOpeningAt}
                    </span>
                </div>

                {/* GIFT MODE */}

                <div className="mt-auto pt-5">
                    {giftMode && (
                        <p
                            className="
                                mb-3 flex items-center gap-2
                                text-xs font-semibold
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            <CalendarClock
                                size={15}
                                aria-hidden="true"
                            />

                            {giftDetail}
                        </p>
                    )}

                    {/* GIFT TOGGLE BUTTON */}

                    <GiftToggleButton
                        open={giftOpen}
                        onClick={toggleGift}
                        disabled={!canShowGift}
                        panelId={panelId}
                        featured={false}
                        mode={giftMode}
                    />
                </div>

                {/* GIFT PANELS */}

                {canShowGift && giftOpen && (
                    <div
                        id={panelId}
                        className="
                            mt-5 border-t
                            border-slate-200
                            pt-5
                            dark:border-white/10
                        "
                    >
                        <EventGiftPanels
                            event={event}
                            slug={slug}
                            mode={giftMode}
                            openingAt={openingAt}
                            featured={false}
                        />
                    </div>
                )}

                {/* UNAVAILABLE EVENT */}

                {!canShowGift && (
                    <div
                        className="
                            mt-3 flex items-center gap-2
                            text-xs text-slate-500
                            dark:text-slate-400
                        "
                    >
                        <CheckCircle2 size={14} />

                        {status === "disabled" ||
                        status === "finished"
                            ? "Tadbir hozir faol emas"
                            : !giftMode
                              ? "Sovg‘a rejimi backendda sozlanmagan"
                              : "Sovg‘a mavjud emas"}
                    </div>
                )}
            </div>
        </article>
    );
}

export default memo(EventCard);
