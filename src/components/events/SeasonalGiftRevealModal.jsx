
// src/components/events/SeasonalGiftRevealModal.jsx

import React, {
    memo,
    useEffect,
    useId,
    useMemo,
    useRef,
} from "react";

import {
    createPortal,
} from "react-dom";

import {
    Award,
    CheckCircle2,
    Coins,
    Frame,
    Gift,
    PartyPopper,
    ShieldCheck,
    Sparkles,
    X,
} from "lucide-react";

// =========================================================
// FSOCIETY — SEASONAL GIFT REVEAL MODAL
// =========================================================
//
// Location:
// src/components/events/SeasonalGiftRevealModal.jsx
//
// Purpose:
//
// Show the reward returned by the backend
// after a successful Seasonal Gift claim.
//
// Supports:
//
// - FCoin
// - Badge
// - Profile Frame
// - Other reward types
//
// Important:
//
// - Does not randomly select rewards
// - Does not submit POST requests
// - Does not modify Redux balances
// - Does not invent reward amounts
// - Supports keyboard dismissal
// - Restores focus after closing
// - Supports light and dark modes
//
// =========================================================


// =========================================================
// HELPERS
// =========================================================

const isRecord = (value) =>
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value);

const firstNonEmpty = (...values) =>
    values.find(
        (value) =>
            typeof value === "string" &&
            value.trim().length > 0
    ) ?? null;


// =========================================================
// CLAIM RESPONSE NORMALIZATION
// =========================================================
//
// A successful API response can contain:
//
// - A direct claim object
// - A nested data object
// - A nested claim object
// - A nested reward object
//
// We preserve actual backend fields.
//
// =========================================================

const getClaimData = (claim) => {
    if (!isRecord(claim)) {
        return {};
    }

    return isRecord(claim.data)
        ? claim.data
        : claim;
};

const getRewardData = (claim) => {
    const data = getClaimData(claim);

    const claimDetails =
        isRecord(data.claim)
            ? data.claim
            : data;

    const reward =
        isRecord(data.reward)
            ? data.reward
            : isRecord(claimDetails.reward)
              ? claimDetails.reward
              : null;

    const rewardType = firstNonEmpty(
        reward?.reward_type,
        reward?.type,
        claimDetails.reward_type,
        data.reward_type
    );

    const rewardName = firstNonEmpty(
        reward?.name,
        reward?.reward_name,
        claimDetails.reward_name,
        data.reward_name
    );

    const rewardDescription = firstNonEmpty(
        reward?.description,
        claimDetails.reward_description,
        data.reward_description
    );

    // Only use a field which explicitly
    // represents the awarded amount.
    //
    // Do not use user.coins or an event
    // configuration's min/max values.

    const awardedCoins =
        claimDetails.coins_awarded ??
        data.coins_awarded ??
        reward?.coins_awarded ??
        null;

    const compensation =
        reward?.is_compensation === true ||
        claimDetails.is_compensation === true ||
        data.is_compensation === true;

    return {
        type:
            rewardType?.toLowerCase() ??
            "",

        name: rewardName,

        description: rewardDescription,

        coins:
            typeof awardedCoins === "number" &&
            Number.isFinite(awardedCoins)
                ? awardedCoins
                : null,

        compensation,
    };
};


// =========================================================
// REWARD PRESENTATION
// =========================================================

const getRewardPresentation = (type) => {
    switch (type) {
        case "coin":
        case "coins":
        case "fcoin":
            return {
                label: "FCoin mukofoti",
                Icon: Coins,
                iconClass:
                    "text-amber-600 dark:text-amber-300",
                iconBackground:
                    "bg-amber-500/15",
            };

        case "badge":
        case "achievement":
            return {
                label: "Maxsus badge",
                Icon: Award,
                iconClass:
                    "text-violet-600 dark:text-violet-300",
                iconBackground:
                    "bg-violet-500/15",
            };

        case "frame":
        case "profile_frame":
            return {
                label: "Profil ramkasi",
                Icon: Frame,
                iconClass:
                    "text-cyan-600 dark:text-cyan-300",
                iconBackground:
                    "bg-cyan-500/15",
            };

        default:
            return {
                label: "Bayram mukofoti",
                Icon: Gift,
                iconClass:
                    "text-fuchsia-600 dark:text-fuchsia-300",
                iconBackground:
                    "bg-fuchsia-500/15",
            };
    }
};


// =========================================================
// NUMBER FORMAT
// =========================================================

const formatCoins = (value) =>
    new Intl.NumberFormat("uz-UZ", {
        maximumFractionDigits: 0,
    }).format(value);


// =========================================================
// MAIN COMPONENT
// =========================================================

function SeasonalGiftRevealModal({
    open = false,
    claim = null,
    eventName = "Bayram",
    onClose,
}) {
    const titleId = useId();
    const descriptionId = useId();

    const closeButtonRef = useRef(null);

    const previousFocusRef = useRef(null);

    // =====================================================
    // REWARD DATA
    // =====================================================

    const reward = useMemo(
        () => getRewardData(claim),
        [claim]
    );

    const presentation = useMemo(
        () => getRewardPresentation(
            reward.type
        ),
        [reward.type]
    );

    const {
        Icon: RewardIcon,
    } = presentation;

    // =====================================================
    // CLOSE CALLBACK
    // =====================================================

    const closeModal = () => {
        if (
            typeof onClose === "function"
        ) {
            onClose();
        }
    };

    // =====================================================
    // KEYBOARD + FOCUS MANAGEMENT
    // =====================================================
    //
    // Escape closes the modal.
    //
    // On open:
    // - Remember focused element
    // - Lock background scrolling
    // - Focus the close button
    //
    // On close:
    // - Restore scroll behavior
    // - Restore previous focus
    //
    // =====================================================

    useEffect(() => {
        if (!open) {
            return;
        }

        previousFocusRef.current =
            document.activeElement;

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow =
            "hidden";

        closeButtonRef.current?.focus();

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                closeModal();
            }

            // Keep keyboard focus inside
            // the modal while it is open.
            if (event.key === "Tab") {
                const button =
                    closeButtonRef.current;

                if (!button) {
                    return;
                }

                // The modal currently has
                // two keyboard controls:
                // the X button and the
                // confirmation button.
                const controls = Array.from(
                    document.querySelectorAll(
                        '[data-seasonal-gift-dialog] button:not([disabled])'
                    )
                );

                if (!controls.length) {
                    return;
                }

                const first = controls[0];
                const last =
                    controls[controls.length - 1];

                if (
                    event.shiftKey &&
                    document.activeElement ===
                        first
                ) {
                    event.preventDefault();
                    last.focus();
                } else if (
                    !event.shiftKey &&
                    document.activeElement ===
                        last
                ) {
                    event.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );

            document.body.style.overflow =
                previousOverflow;

            previousFocusRef.current?.focus?.();
        };

        // closeModal is intentionally handled
        // through the latest onClose prop.
    }, [open, onClose]);

    // =====================================================
    // ONLY RENDER WHEN OPEN
    // =====================================================

    if (
        !open ||
        typeof document === "undefined"
    ) {
        return null;
    }

    // =====================================================
    // MODAL CONTENT
    // =====================================================

    const content = (
        <div
            className="
                fixed inset-0 z-[100]
                flex items-center justify-center
                overflow-y-auto
                bg-slate-950/75
                px-4 py-6
                backdrop-blur-md
                sm:px-6
            "
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    closeModal();
                }
            }}
        >
            <div
                data-seasonal-gift-dialog
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                className="
                    relative isolate
                    my-auto
                    w-full max-w-md
                    overflow-hidden
                    rounded-[28px]
                    border border-violet-200
                    bg-white
                    p-5
                    text-slate-900
                    shadow-[0_30px_100px_rgba(0,0,0,0.35)]
                    sm:p-7

                    dark:border-violet-400/20
                    dark:bg-[#0e1424]
                    dark:text-white
                "
            >
                {/* =================================
                    DECORATIVE GLOWS
                ================================= */}

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute -right-16 -top-16
                        h-52 w-52 rounded-full
                        bg-violet-400/20
                        blur-3xl
                        dark:bg-violet-500/20
                    "
                />

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute -bottom-24 -left-20
                        h-56 w-56 rounded-full
                        bg-cyan-400/15
                        blur-3xl
                        dark:bg-cyan-500/15
                    "
                />

                {/* =================================
                    CLOSE
                ================================= */}

                <button
                    ref={closeButtonRef}
                    type="button"
                    aria-label="Sovg‘a oynasini yopish"
                    onClick={closeModal}
                    className="
                        absolute right-4 top-4 z-20
                        inline-flex
                        h-9 w-9
                        items-center justify-center
                        rounded-xl
                        border border-slate-200
                        bg-white/80
                        text-slate-500
                        transition-colors
                        hover:bg-slate-100
                        hover:text-slate-900
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-violet-500

                        dark:border-white/10
                        dark:bg-white/5
                        dark:text-slate-400
                        dark:hover:bg-white/10
                        dark:hover:text-white
                    "
                >
                    <X
                        size={18}
                        aria-hidden="true"
                    />
                </button>

                <div
                    className="
                        relative z-10
                        flex flex-col
                        items-center
                        text-center
                    "
                >
                    {/* =================================
                        TOP CAPTION
                    ================================= */}

                    <div
                        className="
                            mb-5
                            inline-flex
                            items-center gap-2
                            rounded-full
                            border border-violet-500/20
                            bg-violet-500/10
                            px-3 py-1.5
                            text-[11px]
                            font-bold
                            uppercase
                            tracking-[0.15em]
                            text-violet-700
                            dark:text-violet-300
                        "
                    >
                        <Sparkles size={13} />
                        FSOCIETY SPECIAL EVENT
                    </div>

                    {/* =================================
                        GIFT ICON
                    ================================= */}

                    <div
                        className="
                            relative mb-5
                            flex h-28 w-28
                            items-center justify-center
                            rounded-[32px]
                            border border-violet-500/20
                            bg-gradient-to-br
                            from-violet-500/15
                            via-fuchsia-500/10
                            to-cyan-500/15
                            shadow-[0_14px_45px_rgba(139,92,246,0.15)]
                        "
                    >
                        <span
                            aria-hidden="true"
                            className="
                                absolute -right-2 -top-2
                                rounded-full
                                bg-amber-400/15 p-2
                                text-amber-500
                            "
                        >
                            <Sparkles size={18} />
                        </span>

                        <div
                            className={`
                                flex h-20 w-20
                                items-center justify-center
                                rounded-[26px]
                                ${presentation.iconBackground}
                            `}
                        >
                            <RewardIcon
                                size={43}
                                strokeWidth={1.5}
                                className={
                                    presentation.iconClass
                                }
                                aria-hidden="true"
                            />
                        </div>

                        <span
                            aria-hidden="true"
                            className="
                                absolute -bottom-2 -left-2
                                rounded-full
                                bg-emerald-500/15
                                p-2
                                text-emerald-500
                            "
                        >
                            <CheckCircle2 size={20} />
                        </span>
                    </div>

                    {/* =================================
                        HEADLINE
                    ================================= */}

                    <div
                        className="
                            mb-2
                            flex items-center gap-2
                            text-emerald-600
                            dark:text-emerald-400
                        "
                    >
                        <PartyPopper
                            size={18}
                            aria-hidden="true"
                        />

                        <span
                            className="
                                text-xs font-bold
                                uppercase tracking-wider
                            "
                        >
                            Sovg‘a muvaffaqiyatli olindi
                        </span>
                    </div>

                    <h2
                        id={titleId}
                        className="
                            max-w-sm
                            text-2xl
                            font-black
                            leading-tight
                            tracking-tight
                            text-slate-900
                            sm:text-3xl
                            dark:text-white
                        "
                    >
                        Tabriklaymiz!
                    </h2>

                    <p
                        id={descriptionId}
                        className="
                            mt-3
                            max-w-sm
                            text-sm leading-6
                            text-slate-600
                            dark:text-slate-300
                        "
                    >
                        {eventName} tadbiri uchun
                        bayram sovg‘angiz olindi.
                        Mukofotingiz server tomonidan
                        tasdiqlandi.
                    </p>

                    {/* =================================
                        REWARD DETAIL CARD
                    ================================= */}

                    <div
                        className="
                            mt-6 w-full
                            rounded-2xl
                            border border-violet-200/80
                            bg-violet-50/70
                            p-5
                            dark:border-violet-400/15
                            dark:bg-white/[0.045]
                        "
                    >
                        <p
                            className="
                                text-[11px]
                                font-bold
                                uppercase
                                tracking-[0.15em]
                                text-violet-600
                                dark:text-violet-300
                            "
                        >
                            Sizning mukofotingiz
                        </p>

                        <p
                            className="
                                mt-2 break-words
                                text-xl font-black
                                text-slate-900
                                dark:text-white
                            "
                        >
                            {reward.name ??
                                presentation.label}
                        </p>

                        {reward.coins !== null && (
                            <div
                                className="
                                    mt-3
                                    inline-flex
                                    items-center gap-2
                                    rounded-xl
                                    border border-amber-500/20
                                    bg-amber-500/10
                                    px-4 py-2
                                    text-amber-700
                                    dark:text-amber-300
                                "
                            >
                                <Coins size={20} />

                                <strong className="text-lg">
                                    {formatCoins(
                                        reward.coins
                                    )}
                                </strong>

                                <span className="text-sm font-bold">
                                    FCoin
                                </span>
                            </div>
                        )}

                        {reward.description && (
                            <p
                                className="
                                    mt-3
                                    text-sm leading-6
                                    text-slate-600
                                    dark:text-slate-400
                                "
                            >
                                {reward.description}
                            </p>
                        )}

                        {reward.compensation && (
                            <p
                                className="
                                    mt-3 text-xs
                                    font-semibold
                                    text-amber-700
                                    dark:text-amber-300
                                "
                            >
                                Bu mukofot avvalgi
                                yutuq uchun kompensatsiya
                                sifatida berilgan.
                            </p>
                        )}
                    </div>

                    {/* =================================
                        CONFIRMATION
                    ================================= */}

                    <div
                        className="
                            mt-5
                            flex items-start gap-2
                            text-left
                            text-xs leading-5
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        <ShieldCheck
                            size={17}
                            className="
                                mt-0.5 shrink-0
                                text-emerald-500
                            "
                            aria-hidden="true"
                        />

                        <span>
                            Bu bayram sovg‘asi faqat
                            bir marta olinadi.
                            Keyingi tadbirda yangi
                            sovg‘a ochishingiz mumkin.
                        </span>
                    </div>

                    {/* =================================
                        CLOSE ACTION
                    ================================= */}

                    <button
                        type="button"
                        onClick={closeModal}
                        className="
                            mt-6
                            inline-flex
                            min-h-12 w-full
                            items-center justify-center
                            gap-2 rounded-xl
                            bg-gradient-to-r
                            from-violet-600
                            to-fuchsia-600
                            px-5 py-3
                            text-sm font-black
                            text-white
                            shadow-lg
                            shadow-violet-500/20
                            transition-[filter,transform]
                            duration-200
                            hover:brightness-110
                            active:scale-[0.99]
                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-violet-400
                            focus-visible:ring-offset-2
                            dark:focus-visible:ring-offset-[#0e1424]
                            motion-reduce:transform-none
                            motion-reduce:transition-none
                        "
                    >
                        <CheckCircle2 size={19} />
                        Ajoyib, rahmat!
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(
        content,
        document.body
    );
}


// =========================================================
// EXPORT
// =========================================================

export default memo(SeasonalGiftRevealModal);
