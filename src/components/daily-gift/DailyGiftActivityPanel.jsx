
 // src/components/daily-gift/DailyGiftActivityPanel.jsx

import React, {
    memo,
    useState,
} from "react";

import {
    AlertCircle,
    Award,
    CalendarClock,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Coins,
    Frame,
    Gift,
    History,
    Loader2,
    RefreshCw,
    Trophy,
} from "lucide-react";

import {
    DAILY_GIFT_EVENT_STATUS,
} from "../../config/dailyGiftConfig";

import useDailyGiftCountdown from "../../hooks/dailyGift/useDailyGiftCountdown";
import useDailyGiftHistory from "../../hooks/dailyGift/useDailyGiftHistory";

import formatBirthday from "../../utils/formatBirthday";

// =========================================================
// FSOCIETY — DAILY GIFT ACTIVITY PANEL
// =========================================================
//
// - Server-based countdown
// - Lazy-loaded claim history
// - Backend pagination
// - Manual retry and refresh
// - Responsive dark/light mode
// - No gift claiming inside this component
// =========================================================

const { ACTIVE, SCHEDULED } =
    DAILY_GIFT_EVENT_STATUS;

const formatNumber = (value) =>
    new Intl.NumberFormat("en-US").format(
        Number(value) || 0
    );

const formatClaimDate = (record) => {
    const date = record?.claim_date;

    // claim_date is an event-local YYYY-MM-DD,
    // not a UTC timestamp.
    if (
        typeof date === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(date)
    ) {
        return formatBirthday(`${date}T12:00:00`);
    }

    return record?.claimed_at
        ? formatBirthday(record.claimed_at)
        : "";
};

const getRewardInfo = (reward = {}) => {
    const type =
        reward.awarded_reward_type ??
        reward.type;

    const coins = Number(
        reward.awarded_coins ?? 0
    );

    const isCoinReward =
        type === "coin" ||
        reward.is_compensation === true;

    const name =
        reward.item?.name ||
        reward.name ||
        "Maxsus mukofot";

    if (
        isCoinReward &&
        Number.isFinite(coins) &&
        coins > 0
    ) {
        return {
            title: `+${formatNumber(coins)} FCoin`,
            description: reward.is_compensation
                ? "Takroriy mukofot kompensatsiyasi"
                : name,
            icon: Coins,
        };
    }

    const icons = {
        badge: Award,
        achievement: Trophy,
        frame: Frame,
        coin: Coins,
    };

    return {
        title: name,
        description:
            reward.rarity?.toUpperCase() ||
            "Maxsus mukofot",
        icon: icons[type] || Gift,
    };
};

// =========================================================
// COUNTDOWN TILES
// =========================================================

const CountdownTile = memo(
    function CountdownTile({ value, label }) {
        return (
            <div
                className="
                    min-w-0 rounded-xl border
                    border-cyan-200/70
                    bg-cyan-50/80
                    px-2 py-3 text-center

                    dark:border-cyan-400/15
                    dark:bg-cyan-400/[0.06]
                "
            >
                <span
                    className="
                        block font-mono text-2xl
                        font-bold tabular-nums
                        text-cyan-700
                        dark:text-cyan-300
                        sm:text-3xl
                    "
                >
                    {value}
                </span>

                <span
                    className="
                        mt-1 block text-[10px]
                        font-semibold tracking-widest
                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    {label}
                </span>
            </div>
        );
    }
);

// =========================================================
// MAIN COMPONENT
// =========================================================

function DailyGiftActivityPanel({
    eventStatus,
    canClaim = false,
    claimedToday = false,
}) {
    const [historyOpen, setHistoryOpen] =
        useState(false);

    // Hook calls stay unconditional.
    const countdown = useDailyGiftCountdown({
        enabled: true,
        refreshOnExpire: true,
    });

    const history = useDailyGiftHistory({
        enabled: historyOpen,
    });

    // No misleading 00:00:00 countdown while
    // a gift is already available to claim.
    const showCountdown =
        countdown.isReady &&
        !countdown.isExpired &&
        (
            eventStatus === SCHEDULED ||
            (
                eventStatus === ACTIVE &&
                claimedToday &&
                !canClaim
            )
        );

    const historyItems = Array.isArray(
        history.results
    )
        ? history.results
        : [];

    const isHistoryLoading =
        Boolean(history.isLoading);

    const isHistoryError =
        Boolean(history.isError);

    const hasHistoryLoaded =
        Boolean(history.isLoaded);

    const currentPage =
        Number(history.currentPage) || 1;

    const totalPages = Math.max(
        1,
        Number(history.totalPages) || 1
    );

    return (
        <div className="mt-5 space-y-3">

            {/* ==========================================
                SERVER-BASED COUNTDOWN
            ========================================== */}

            {showCountdown && (
                <section
                    aria-label={countdown.label}
                    className="
                        rounded-2xl border
                        border-slate-200
                        bg-slate-50/80
                        p-4

                        dark:border-white/[0.08]
                        dark:bg-white/[0.03]
                    "
                >
                    <div
                        className="
                            mb-3 flex flex-wrap
                            items-center justify-between
                            gap-2
                        "
                    >
                        <div
                            className="
                                flex items-center gap-2
                                text-sm font-semibold
                                text-slate-800
                                dark:text-slate-100
                            "
                        >
                            {eventStatus === SCHEDULED ? (
                                <CalendarClock
                                    size={17}
                                    className="
                                        text-violet-600
                                        dark:text-violet-300
                                    "
                                />
                            ) : (
                                <Clock3
                                    size={17}
                                    className="
                                        text-cyan-600
                                        dark:text-cyan-300
                                    "
                                />
                            )}

                            {countdown.label}
                        </div>

                        <span
                            className="
                                text-[11px]
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            {countdown.timezone ||
                                "Asia/Tashkent"}
                        </span>
                    </div>

                    <div
                        role="timer"
                        className="grid grid-cols-3 gap-2"
                    >
                        {countdown.days > 0 && (
                            <div className="col-span-3">
                                <span
                                    className="
                                        font-mono text-sm
                                        font-semibold
                                        text-cyan-700
                                        dark:text-cyan-300
                                    "
                                >
                                    {countdown.days} kun
                                </span>
                            </div>
                        )}

                        <CountdownTile
                            value={countdown.display.hours}
                            label="SOAT"
                        />

                        <CountdownTile
                            value={countdown.display.minutes}
                            label="DAQIQA"
                        />

                        <CountdownTile
                            value={countdown.display.seconds}
                            label="SONIYA"
                        />
                    </div>

                    <p
                        className="
                            mt-3 text-center text-xs
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        Vaqt server ma’lumotlari
                        asosida hisoblanadi.
                    </p>
                </section>
            )}

            {/* ==========================================
                HISTORY DISCLOSURE
            ========================================== */}

            <section
                className="
                    overflow-hidden rounded-2xl border
                    border-slate-200 bg-white/60

                    dark:border-white/[0.08]
                    dark:bg-white/[0.03]
                "
            >
                <button
                    type="button"
                    aria-expanded={historyOpen}
                    aria-controls="daily-gift-history-content"
                    onClick={() =>
                        setHistoryOpen((previous) => !previous)
                    }
                    className="
                        flex w-full items-center gap-3
                        px-4 py-3.5 text-left

                        transition-colors
                        hover:bg-slate-100
                        dark:hover:bg-white/[0.05]

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-inset
                        focus-visible:ring-cyan-400
                    "
                >
                    <span
                        className="
                            flex h-9 w-9 shrink-0
                            items-center justify-center
                            rounded-xl bg-violet-500/10
                            text-violet-600
                            dark:text-violet-300
                        "
                    >
                        <History size={19} />
                    </span>

                    <span className="min-w-0 flex-1">
                        <span
                            className="
                                block text-sm font-semibold
                                text-slate-900
                                dark:text-slate-100
                            "
                        >
                            Sovg‘alar tarixi
                        </span>

                        <span
                            className="
                                block text-xs
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Oldin olgan mukofotlaringiz
                        </span>
                    </span>

                    {hasHistoryLoaded && (
                        <span
                            className="
                                rounded-full
                                bg-slate-100
                                px-2 py-1
                                font-mono text-[11px]
                                text-slate-600
                                dark:bg-white/10
                                dark:text-slate-300
                            "
                        >
                            {formatNumber(history.count)}
                        </span>
                    )}

                    <ChevronDown
                        size={18}
                        className={`
                            shrink-0 text-slate-500
                            transition-transform
                            ${
                                historyOpen
                                    ? "rotate-180"
                                    : ""
                            }
                        `}
                    />
                </button>

                {historyOpen && (
                    <div
                        id="daily-gift-history-content"
                        className="
                            space-y-3 border-t
                            border-slate-200 px-3 py-3

                            dark:border-white/[0.08]
                            sm:px-4
                        "
                    >
                        {/* Refresh */}

                        <div
                            className="
                                flex items-center
                                justify-between gap-2
                            "
                        >
                            <span
                                className="
                                    text-xs text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                Jami: {formatNumber(
                                    history.count
                                )} ta
                            </span>

                            <button
                                type="button"
                                disabled={isHistoryLoading}
                                onClick={() =>
                                    history.refreshHistory()
                                }
                                className="
                                    inline-flex items-center
                                    gap-1.5 rounded-lg
                                    px-2 py-1.5
                                    text-xs font-medium
                                    text-cyan-700
                                    hover:bg-cyan-500/10

                                    disabled:opacity-50

                                    dark:text-cyan-300
                                "
                            >
                                <RefreshCw
                                    size={14}
                                    className={
                                        isHistoryLoading
                                            ? "motion-safe:animate-spin"
                                            : ""
                                    }
                                />
                                Yangilash
                            </button>
                        </div>

                        {/* Loading */}

                        {isHistoryLoading && (
                            <div
                                role="status"
                                className="
                                    flex items-center
                                    justify-center gap-2
                                    py-6 text-sm
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                <Loader2
                                    size={18}
                                    className="
                                        motion-safe:animate-spin
                                    "
                                />

                                Tarix yuklanmoqda...
                            </div>
                        )}

                        {/* Error */}

                        {!isHistoryLoading &&
                            isHistoryError && (
                            <div
                                role="alert"
                                className="
                                    space-y-3 rounded-xl
                                    border border-red-300/40
                                    bg-red-500/[0.06]
                                    p-3
                                "
                            >
                                <div
                                    className="
                                        flex items-start gap-2
                                        text-xs text-red-600
                                        dark:text-red-300
                                    "
                                >
                                    <AlertCircle
                                        size={17}
                                        className="shrink-0"
                                    />

                                    <span>
                                        {history.error?.message ||
                                            "Tarixni yuklab bo‘lmadi."}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        history.retryHistory()
                                    }
                                    className="
                                        rounded-lg
                                        bg-red-500/10
                                        px-3 py-2
                                        text-xs font-semibold
                                        text-red-700
                                        dark:text-red-300
                                    "
                                >
                                    Qayta urinish
                                </button>
                            </div>
                        )}

                        {/* Empty state */}

                        {!isHistoryLoading &&
                            !isHistoryError &&
                            hasHistoryLoaded &&
                            historyItems.length === 0 && (
                            <div
                                className="
                                    py-6 text-center
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                <Gift
                                    size={28}
                                    className="
                                        mx-auto mb-2
                                        opacity-60
                                    "
                                />

                                <p className="text-sm">
                                    Hozircha sovg‘alar tarixi yo‘q.
                                </p>
                            </div>
                        )}

                        {/* Claim records */}

                        {!isHistoryLoading &&
                            !isHistoryError &&
                            historyItems.length > 0 && (
                            <ul className="space-y-2">
                                {historyItems.map(
                                    (record, index) => {
                                        const info =
                                            getRewardInfo(
                                                record.reward
                                            );

                                        const ItemIcon =
                                            info.icon;

                                        return (
                                            <li
                                                key={
                                                    record.claim_id ??
                                                    `${record.claim_date}-${index}`
                                                }
                                                className="
                                                    flex items-center
                                                    gap-3 rounded-xl
                                                    border border-slate-200
                                                    bg-slate-50
                                                    p-2.5

                                                    dark:border-white/[0.07]
                                                    dark:bg-slate-900/50
                                                "
                                            >
                                                <div
                                                    className="
                                                        flex h-11 w-11
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-xl

                                                        bg-cyan-500/10
                                                        text-cyan-600
                                                        dark:text-cyan-300
                                                    "
                                                >
                                                    <ItemIcon
                                                        size={21}
                                                    />
                                                </div>

                                                <div
                                                    className="
                                                        min-w-0 flex-1
                                                    "
                                                >
                                                    <p
                                                        className="
                                                            break-words
                                                            text-sm
                                                            font-semibold
                                                            text-slate-900
                                                            dark:text-slate-100
                                                        "
                                                    >
                                                        {info.title}
                                                    </p>

                                                    <p
                                                        className="
                                                            mt-0.5 text-xs
                                                            text-slate-500
                                                            dark:text-slate-400
                                                        "
                                                    >
                                                        {info.description}
                                                    </p>

                                                    <p
                                                        className="
                                                            mt-1 text-[11px]
                                                            text-slate-500
                                                            dark:text-slate-400
                                                        "
                                                    >
                                                        {formatClaimDate(
                                                            record
                                                        )}
                                                    </p>
                                                </div>
                                            </li>
                                        );
                                    }
                                )}
                            </ul>
                        )}

                        {/* Pagination */}

                        {!isHistoryLoading &&
                            !isHistoryError &&
                            hasHistoryLoaded &&
                            history.count > 0 && (
                            <div
                                className="
                                    flex items-center
                                    justify-between gap-3
                                    border-t border-slate-200
                                    pt-3

                                    dark:border-white/[0.08]
                                "
                            >
                                <button
                                    type="button"
                                    disabled={
                                        !history.hasPrevious
                                    }
                                    onClick={() =>
                                        history.previousPage()
                                    }
                                    className="
                                        inline-flex items-center
                                        gap-1 rounded-lg
                                        px-2.5 py-2
                                        text-xs font-medium
                                        text-slate-700

                                        disabled:opacity-40

                                        dark:text-slate-300
                                    "
                                >
                                    <ChevronLeft size={16}/>
                                    Oldingi
                                </button>

                                <span
                                    className="
                                        font-mono text-xs
                                        text-slate-600
                                        dark:text-slate-300
                                    "
                                >
                                    {currentPage} / {totalPages}
                                </span>

                                <button
                                    type="button"
                                    disabled={
                                        !history.hasNext
                                    }
                                    onClick={() =>
                                        history.nextPage()
                                    }
                                    className="
                                        inline-flex items-center
                                        gap-1 rounded-lg
                                        px-2.5 py-2
                                        text-xs font-medium
                                        text-slate-700

                                        disabled:opacity-40

                                        dark:text-slate-300
                                    "
                                >
                                    Keyingi
                                    <ChevronRight size={16}/>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}

export default memo(DailyGiftActivityPanel);
