import React, { memo, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Check, Gift, Sparkles } from "lucide-react";
import useDailyGift from "../../hooks/events/useDailyGift";
import useSeasonalGift from "../../hooks/events/useSeasonalGift";
import useEventCountdown from "../../hooks/events/useEventCountdown";
import { getEventGiftMode, supportsGift } from "../../utils/eventGift";
import { formatEventDate } from "../../utils/formatEventDate";

const EMPTY_EVENTS = [];
export const chooseNavbarGiftEvent = (events) => events
    .filter((event) => event?.slug && getEventGiftMode(event) && event.is_enabled !== false &&
        ["active", "scheduled"].includes(event.event_status))
    .slice().sort((a, b) => {
        const featured = Number(Boolean(b.is_featured || b.featured)) - Number(Boolean(a.is_featured || a.featured));
        if (featured) return featured;
        const active = Number(b.event_status === "active") - Number(a.event_status === "active");
        if (active) return active;
        return (Date.parse(a.opens_at) || Infinity) - (Date.parse(b.opens_at) || Infinity);
    })[0] ?? null;

function NavbarEventGiftButton({ isLoggedIn = false, onNavigate, className = "" }) {
    const events = useSelector((state) => state.events?.items ?? EMPTY_EVENTS);
    const selectedEvent = useMemo(() => chooseNavbarGiftEvent(events), [events]);
    const slug = selectedEvent?.slug ?? "";
    const name = selectedEvent?.name ?? "Bayramlar";
    const dailySupported = supportsGift(selectedEvent, "daily");
    const seasonalSupported = supportsGift(selectedEvent, "seasonal");
    const daily = useDailyGift(slug, { enabled: isLoggedIn && dailySupported });
    const seasonal = useSeasonalGift(slug, { enabled: isLoggedIn && seasonalSupported });
    const gifts = [dailySupported && daily, seasonalSupported && seasonal].filter(Boolean);
    const isReady = gifts.some((gift) => gift.canClaim);
    const hasClaimed = gifts.length > 0 && gifts.every((gift) => gift.sessionReady && gift.alreadyClaimed);
    const loading = gifts.some((gift) => gift.statusLoading);
    const uncertain = gifts.some((gift) => gift.needsReconciliation);
    const failed = gifts.some((gift) => gift.statusError);
    const timerGift = gifts.find((gift) => !gift.alreadyClaimed && gift.status?.next_claim_at) ??
        (dailySupported && daily.claimedToday && daily.status?.next_claim_at ? daily : null);
    const countdown = useEventCountdown(timerGift?.status?.next_claim_at ?? (!isLoggedIn ? selectedEvent?.opens_at : null),
        timerGift?.status?.server_time, timerGift?.statusFetchedAt);
    const statusText = !selectedEvent ? "Bayramlar markazi"
        : uncertain ? "Natija tekshirilmoqda"
            : isReady ? (daily.canClaim && seasonal.canClaim ? "Ikkala sovg‘a tayyor!" : daily.canClaim ? "Kunlik sovg‘a tayyor!" : "Bayram sovg‘asi tayyor!")
                : loading ? "Holat tekshirilmoqda"
                    : failed ? "Holatni yangilash kerak"
                        : hasClaimed ? (dailySupported && countdown ? `Keyingi: ${countdown.text}` : "Bayram sovg‘asi olindi")
                            : countdown && !countdown.expired ? countdown.text : "Sovg‘alar holati";
    const details = [
        dailySupported && `Kunlik: ${daily.claimedToday ? "bugun olingan" : daily.canClaim ? "tayyor" : "tekshiriladi"}`,
        seasonalSupported && `Bayram: ${seasonal.alreadyClaimed ? "olingan" : seasonal.canClaim ? "tayyor" : "tekshiriladi"}`,
    ].filter(Boolean).join(". ");
    const dateLabel = selectedEvent?.opens_at ? formatEventDate(selectedEvent.opens_at, selectedEvent.timezone) : null;
    const accessibleLabel = selectedEvent
        ? `${name}. ${statusText}. ${isLoggedIn ? details : "Tizimga kiring"}. ${dateLabel ? `Ochilish: ${dateLabel}. ` : ""}Bayramlar sahifasiga o‘tish`
        : "Bayramlar va sovg‘alar sahifasiga o‘tish";

    const colorClass = isReady
        ? `
            border-fuchsia-400/55
            bg-fuchsia-500/15
            text-fuchsia-700

            shadow-[0_0_20px_rgba(168,85,247,.18)]

            hover:bg-fuchsia-500/25

            dark:border-fuchsia-400/45
            dark:text-fuchsia-200
        `
        : hasClaimed
          ? `
            border-emerald-400/40
            bg-emerald-500/10
            text-emerald-700

            hover:bg-emerald-500/15

            dark:border-emerald-400/20
            dark:text-emerald-300
        `
          : `
            border-violet-300/50
            bg-white/65
            text-violet-700

            hover:border-violet-400/60
            hover:bg-violet-500/10

            dark:border-violet-400/25
            dark:bg-violet-400/[.07]
            dark:text-violet-300

            dark:hover:bg-violet-400/[.13]
        `;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Link
            to="/events"
            onClick={onNavigate}
            aria-label={accessibleLabel}
            title={accessibleLabel}
            className={`
                group/event-gift
                relative inline-flex

                h-9 w-9 shrink-0
                items-center justify-center

                rounded-xl border

                transition-[background-color,border-color,box-shadow,transform]
                duration-200

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-violet-400
                focus-visible:ring-offset-2

                active:scale-95

                dark:focus-visible:ring-offset-[#080c12]

                motion-reduce:transform-none
                motion-reduce:transition-none

                sm:h-10 sm:w-10

                min-[1480px]:h-11
                min-[1480px]:w-auto
                min-[1480px]:max-w-[215px]
                min-[1480px]:gap-2.5
                min-[1480px]:px-3

                ${colorClass}
                ${className}
            `}
        >
            {/* =====================================
                GLOW WHEN GIFT IS READY
            ===================================== */}

            {isReady && (
                <span
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute -inset-1 -z-10
                        rounded-2xl
                        bg-fuchsia-500/15
                        blur-md
                    "
                />
            )}

            {/* =====================================
                GIFT ICON
            ===================================== */}

            <span
                className="
                    relative inline-flex shrink-0
                    items-center justify-center
                "
            >
                <Gift
                    size={20}
                    strokeWidth={1.9}
                    aria-hidden="true"
                    className={
                        isReady
                            ? "motion-safe:animate-pulse"
                            : ""
                    }
                />

                {hasClaimed && (
                    <Check
                        size={12}
                        strokeWidth={3}
                        aria-hidden="true"
                        className="
                            absolute -bottom-1 -right-1
                            rounded-full
                            bg-emerald-500
                            p-0.5 text-white
                        "
                    />
                )}

                {isReady && (
                    <Sparkles
                        size={12}
                        aria-hidden="true"
                        className="
                            absolute -right-2 -top-2
                            text-fuchsia-500
                            dark:text-fuchsia-300
                        "
                    />
                )}
            </span>

            {/* =====================================
                DESKTOP EVENT INFO
            ===================================== */}

            <span
                className="
                    hidden min-w-0
                    flex-col items-start
                    justify-center leading-tight

                    min-[1480px]:flex
                "
            >
                <span
                    className="
                        max-w-[155px] truncate
                        text-[11px] font-extrabold
                    "
                >
                    {selectedEvent
                        ? name
                        : "Bayramlar"}
                </span>

                <span
                    className={`
                        mt-0.5 max-w-[155px]
                        truncate text-[10px]
                        font-semibold

                        ${
                            isReady
                                ? "text-fuchsia-700 dark:text-fuchsia-300"
                                : hasClaimed
                                  ? "text-emerald-700 dark:text-emerald-300"
                                  : "text-slate-500 dark:text-slate-400"
                        }
                    `}
                >
                    {statusText}
                </span>
            </span>

            {/* =====================================
                READY INDICATOR
            ===================================== */}

            {isReady && (
                <span
                    aria-hidden="true"
                    className="
                        absolute -right-0.5 -top-0.5
                        h-2.5 w-2.5
                        rounded-full
                        border-2 border-white
                        bg-fuchsia-500

                        dark:border-[#080c12]
                    "
                />
            )}
        </Link>
    );
}

export default memo(NavbarEventGiftButton);
