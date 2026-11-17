
// src/components/frame-shop/MyFrames.jsx

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  Link,
  Navigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Coins,
  Crown,
  Gem,
  Layers3,
  PackageOpen,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  WandSparkles,
  X,
} from "lucide-react";

import {
  equipProfileFrame,
  fetchMyProfileFrames,
  fetchProfileFrameStats,
  selectFrameMutation,
  selectFrameStats,
  selectMyFrames,
  unequipProfileFrame,
} from "../../features/profileFrames";

import FrameInventoryCard, {
  getOwnedFrame,
  getOwnedFrameId,
} from "./FrameInventoryCard";

// =========================================================
// FSOCIETY — MY FRAMES / CYBER VAULT 2.0
// =========================================================
//
// Features:
//
// - Compact premium header
// - Inline statistics
// - Responsive centered inventory grid
// - Dark / Light mode
// - Winter background compatibility
// - Redux integration
// - Equip / Unequip
// - Double-click protection
// - Server pagination
// - Status / rarity filters
// - Loading skeletons
// - Error and empty states
// - Refresh after successful mutation
//
// IMPORTANT:
//
// FrameInventoryCard remains responsible for:
//
// - Real user avatar
// - Transparent PNG overlay
// - FS Winter Royal alignment
// - Frame metadata and action buttons
//
// =========================================================

// =========================================================
// CONSTANTS
// =========================================================

const PAGE_SIZE = 9;

const STATUS_FILTERS = [
  {
    value: "all",
    label: "Barchasi",
    Icon: Layers3,
  },
  {
    value: "equipped",
    label: "O‘rnatilgan",
    Icon: Check,
  },
  {
    value: "available",
    label: "O‘rnatilmagan",
    Icon: Gem,
  },
];

const RARITY_FILTERS = [
  {
    value: "all",
    label: "Barcha darajalar",
  },
  {
    value: "common",
    label: "Common",
  },
  {
    value: "rare",
    label: "Rare",
  },
  {
    value: "epic",
    label: "Epic",
  },
  {
    value: "legendary",
    label: "Legendary",
  },
];

// =========================================================
// HELPERS
// =========================================================

const formatNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? new Intl.NumberFormat("uz-UZ", {
        maximumFractionDigits: 0,
      }).format(number)
    : "—";
};

const getErrorMessage = (
  error,
  fallback
) => {
  if (
    typeof error === "string" &&
    error.trim()
  ) {
    return error;
  }

  return error?.message || fallback;
};

// =========================================================
// BALANCED INVENTORY GRID
// =========================================================
//
// 1 Frame:
//    One centered card.
//
// 2 Frames:
//    Two centered cards.
//    Slight 20px right offset on XL.
//
// 4 Frames:
//    Balanced 2 x 2 layout.
//
// Other counts:
//    Three columns on XL.
//    Center incomplete final rows.
//
// =========================================================

const getInventoryGridClass = (count) => {
  const base = [
    "mx-auto",
    "grid",
    "w-full",
    "items-stretch",
    "gap-3.5",
    "sm:gap-4",
  ].join(" ");

  if (count === 1) {
    return `
      ${base}
      max-w-[390px]
      grid-cols-1
    `;
  }

  if (count === 2) {
    return `
      ${base}
      relative
      max-w-[760px]
      grid-cols-1
      md:grid-cols-2
      xl:left-5
    `;
  }

  if (count === 4) {
    return `
      ${base}
      max-w-[760px]
      grid-cols-1
      md:grid-cols-2
    `;
  }

  return `
    ${base}
    max-w-[1150px]
    grid-cols-1
    md:grid-cols-2
    xl:grid-cols-6
  `;
};

const getInventoryCellClass = (
  count,
  index
) => {
  if (
    count === 1 ||
    count === 2 ||
    count === 4
  ) {
    return "min-w-0 h-full";
  }

  let result =
    "min-w-0 h-full xl:col-span-2";

  const remainder = count % 3;

  if (
    remainder === 1 &&
    index === count - 1
  ) {
    result += " xl:col-start-3";
  } else if (
    remainder === 2 &&
    index === count - 2
  ) {
    result += " xl:col-start-2";
  }

  return result;
};

// =========================================================
// COMPACT STAT CHIP
// =========================================================

const StatChip = memo(
  function StatChip({
    label,
    value,
    Icon,
    tone = "cyan",
  }) {
    const iconClass = {
      cyan:
        "text-cyan-600 dark:text-cyan-300",
      emerald:
        "text-emerald-600 dark:text-emerald-300",
      amber:
        "text-amber-600 dark:text-amber-300",
      violet:
        "text-violet-600 dark:text-violet-300",
    }[tone];

    return (
      <div
        className="
          flex min-w-0 items-center gap-2.5
          rounded-xl border border-slate-200/80
          bg-white/70 px-3 py-2
          dark:border-white/10
          dark:bg-white/[0.045]
        "
      >
        <span
          className={`
            grid h-8 w-8 shrink-0
            place-items-center rounded-lg
            bg-slate-100
            dark:bg-white/[0.07]
            ${iconClass}
          `}
        >
          <Icon
            size={16}
            aria-hidden="true"
          />
        </span>

        <div className="min-w-0">
          <p
            className="
              truncate font-mono
              text-[9px] font-semibold
              uppercase tracking-[0.08em]
              text-slate-500
              dark:text-slate-400
            "
          >
            {label}
          </p>

          <p
            className="
              mt-0.5 truncate
              text-[16px] font-black
              leading-5 tabular-nums
              text-slate-900 dark:text-white
            "
          >
            {value}
          </p>
        </div>
      </div>
    );
  }
);

// =========================================================
// COMPACT SKELETON
// =========================================================

const InventorySkeleton = memo(
  function InventorySkeleton() {
    return (
      <div
        className="
          h-full min-h-[360px]
          rounded-[22px] border
          border-slate-200 bg-white/85
          p-4
          dark:border-white/10
          dark:bg-[#0d1526]/90
        "
      >
        <div
          className="
            h-5 w-24 animate-pulse
            rounded-full bg-slate-200
            motion-reduce:animate-none
            dark:bg-white/10
          "
        />

        <div
          className="
            mx-auto my-5
            h-36 w-36 animate-pulse
            rounded-full border-[10px]
            border-slate-200
            motion-reduce:animate-none
            dark:border-white/10
          "
        />

        <div
          className="
            mx-auto h-4 w-2/3
            animate-pulse rounded-lg
            bg-slate-200
            motion-reduce:animate-none
            dark:bg-white/10
          "
        />

        <div
          className="
            mt-5 h-14 animate-pulse
            rounded-xl bg-slate-100
            motion-reduce:animate-none
            dark:bg-white/5
          "
        />

        <div
          className="
            mt-3 h-10 animate-pulse
            rounded-xl bg-slate-200
            motion-reduce:animate-none
            dark:bg-white/10
          "
        />
      </div>
    );
  }
);

// =========================================================
// MAIN PAGE
// =========================================================

export default function MyFrames() {
  const dispatch = useDispatch();

  const reducedMotion =
    useReducedMotion();

  // =====================================================
  // AUTH
  // =====================================================

  const isAuthenticated = useSelector(
    (state) =>
      Boolean(state.auth?.isLoggedIn)
  );

  const authLoading = useSelector(
    (state) =>
      Boolean(state.auth?.isLoading)
  );

  // =====================================================
  // REDUX
  // =====================================================

  const inventory = useSelector(
    selectMyFrames
  );

  const stats = useSelector(
    selectFrameStats
  );

  const mutation = useSelector(
    selectFrameMutation
  );

  // =====================================================
  // LOCAL STATE
  // =====================================================

  const [page, setPage] =
    useState(1);

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("all");

  const [
    rarityFilter,
    setRarityFilter,
  ] = useState("all");

  const [
    busyFrameId,
    setBusyFrameId,
  ] = useState(null);

  // =====================================================
  // REFS
  // =====================================================

  const mountedRef = useRef(false);

  const requestLockRef = useRef(false);

  // =====================================================
  // LIFECYCLE
  // =====================================================

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  // =====================================================
  // FETCH INVENTORY
  // =====================================================

  useEffect(() => {
    if (!isAuthenticated) {
      return undefined;
    }

    const request = dispatch(
      fetchMyProfileFrames({
        page,
        pageSize: PAGE_SIZE,
      })
    );

    return () => request.abort();
  }, [
    dispatch,
    isAuthenticated,
    page,
  ]);

  // =====================================================
  // FETCH STATISTICS
  // =====================================================

  useEffect(() => {
    if (!isAuthenticated) {
      return undefined;
    }

    const request = dispatch(
      fetchProfileFrameStats()
    );

    return () => request.abort();
  }, [
    dispatch,
    isAuthenticated,
  ]);

  // =====================================================
  // INVENTORY DATA
  // =====================================================

  const allItems = useMemo(
    () =>
      Array.isArray(inventory?.items)
        ? inventory.items
        : [],
    [inventory?.items]
  );

  // =====================================================
  // FILTER CURRENT SERVER PAGE
  // =====================================================

  const visibleItems = useMemo(() => {
    return allItems.filter((ownership) => {
      const frame =
        getOwnedFrame(ownership);

      const equipped = Boolean(
        ownership?.is_equipped ??
        frame?.is_equipped
      );

      const rarity = String(
        frame?.rarity || "common"
      ).toLowerCase();

      if (
        statusFilter === "equipped" &&
        !equipped
      ) {
        return false;
      }

      if (
        statusFilter === "available" &&
        equipped
      ) {
        return false;
      }

      if (
        rarityFilter !== "all" &&
        rarity !== rarityFilter
      ) {
        return false;
      }

      return true;
    });
  }, [
    allItems,
    statusFilter,
    rarityFilter,
  ]);

  // =====================================================
  // TOTAL OWNED
  // =====================================================

  const parsedCount = Number(
    inventory?.count
  );

  const totalOwned =
    inventory?.count != null &&
    Number.isFinite(parsedCount)
      ? Math.max(0, parsedCount)
      : allItems.length;

  // =====================================================
  // EQUIPPED FRAME
  // =====================================================

  const equippedOnPage = allItems.find(
    (ownership) =>
      Boolean(
        ownership?.is_equipped ??
        getOwnedFrame(ownership)?.is_equipped
      )
  );

  const equippedFrameId =
    stats?.data?.equipped_frame_id ??
    stats?.data?.equipped_frame?.id ??
    getOwnedFrameId(equippedOnPage);

  const hasEquippedFrame =
    Boolean(equippedFrameId);

  // =====================================================
  // FCoin STATISTICS
  // =====================================================

  const spentValue =
    stats?.data?.total_fcoin_spent ??
    stats?.data?.total_coins_spent;

  const spent =
    spentValue == null
      ? "—"
      : formatNumber(spentValue);

  // =====================================================
  // CURRENT PAGE REWARDS
  // =====================================================

  const pageRewards = allItems.filter(
    (ownership) =>
      [
        "gift",
        "event",
        "achievement",
        "event_reward",
      ].includes(
        String(
          ownership?.source || ""
        ).toLowerCase()
      )
  ).length;

  // =====================================================
  // PAGINATION
  // =====================================================

  const canPrevious = page > 1;

  const canNext = Boolean(
    inventory?.next
  );

  const showPagination = Boolean(
    inventory?.loaded &&
    !inventory?.loading &&
    !inventory?.error &&
    totalOwned > 0 &&
    (
      canPrevious ||
      canNext
    )
  );

  // =====================================================
  // GRID / FILTER STATE
  // =====================================================

  const gridClass =
    getInventoryGridClass(
      visibleItems.length
    );

  const activeFilters =
    statusFilter !== "all" ||
    rarityFilter !== "all";

  // =====================================================
  // REFRESH
  // =====================================================

  const refreshInventory = useCallback(
    () => {
      if (!isAuthenticated) {
        return;
      }

      dispatch(
        fetchMyProfileFrames({
          page,
          pageSize: PAGE_SIZE,
        })
      );

      dispatch(
        fetchProfileFrameStats()
      );
    },
    [
      dispatch,
      isAuthenticated,
      page,
    ]
  );

  // =====================================================
  // REFRESH AFTER MUTATION
  // =====================================================

  const refreshAfterMutation = useCallback(
    () => {
      dispatch(
        fetchProfileFrameStats()
      );

      if (page === 1) {
        dispatch(
          fetchMyProfileFrames({
            page: 1,
            pageSize: PAGE_SIZE,
          })
        );
      } else {
        setPage(1);
      }

      window.dispatchEvent(
        new Event("fsociety:frame-updated")
      );
    },
    [
      dispatch,
      page,
    ]
  );

  // =====================================================
  // EQUIP FRAME
  // =====================================================

  const handleEquip = useCallback(
    async (ownership) => {
      if (
        !isAuthenticated ||
        requestLockRef.current ||
        mutation?.loading
      ) {
        return;
      }

      const frame =
        getOwnedFrame(ownership);

      const frameId =
        getOwnedFrameId(ownership);

      if (!frameId) {
        toast.error(
          "Ramka identifikatori topilmadi."
        );
        return;
      }

      if (frame?.is_active === false) {
        toast.error(
          "Bu ramka hozir faol emas."
        );
        return;
      }

      requestLockRef.current = true;
      setBusyFrameId(frameId);

      try {
        await dispatch(
          equipProfileFrame(frameId)
        ).unwrap();

        if (!mountedRef.current) {
          return;
        }

        toast.success(
          `“${frame?.name || "Ramka"}” avatar uchun o‘rnatildi!`
        );

        refreshAfterMutation();
      } catch (error) {
        if (mountedRef.current) {
          toast.error(
            getErrorMessage(
              error,
              "Ramkani o‘rnatib bo‘lmadi."
            )
          );
        }
      } finally {
        requestLockRef.current = false;

        if (mountedRef.current) {
          setBusyFrameId(null);
        }
      }
    },
    [
      dispatch,
      isAuthenticated,
      mutation?.loading,
      refreshAfterMutation,
    ]
  );

  // =====================================================
  // UNEQUIP FRAME
  // =====================================================

  const handleUnequip = useCallback(
    async (ownership) => {
      if (
        !isAuthenticated ||
        requestLockRef.current ||
        mutation?.loading
      ) {
        return;
      }

      const frame =
        getOwnedFrame(ownership);

      const frameId =
        getOwnedFrameId(ownership);

      requestLockRef.current = true;
      setBusyFrameId(frameId);

      try {
        await dispatch(
          unequipProfileFrame()
        ).unwrap();

        if (!mountedRef.current) {
          return;
        }

        toast.success(
          `“${frame?.name || "Ramka"}” avatardan yechildi.`
        );

        refreshAfterMutation();
      } catch (error) {
        if (mountedRef.current) {
          toast.error(
            getErrorMessage(
              error,
              "Ramkani yechib bo‘lmadi."
            )
          );
        }
      } finally {
        requestLockRef.current = false;

        if (mountedRef.current) {
          setBusyFrameId(null);
        }
      }
    },
    [
      dispatch,
      isAuthenticated,
      mutation?.loading,
      refreshAfterMutation,
    ]
  );

  // =====================================================
  // AUTH GUARD
  // =====================================================

  if (
    !authLoading &&
    !isAuthenticated
  ) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main
      className="
        relative isolate
        min-h-screen w-full min-w-0
        overflow-hidden
        px-3 pb-14 pt-3
        text-slate-900 dark:text-white
        sm:px-5 lg:px-8
      "
    >
      {/* ======================================
          BACKGROUND ACCENTS
      ====================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute inset-0 -z-10
        "
      >
        <div
          className="
            absolute -left-28 top-0
            h-72 w-72 rounded-full
            bg-cyan-400/[0.055]
            blur-[85px]
          "
        />

        <div
          className="
            absolute -right-24 top-52
            h-72 w-72 rounded-full
            bg-violet-500/[0.06]
            blur-[90px]
          "
        />
      </div>

      <div
        className="
          relative mx-auto flex
          w-full max-w-7xl
          flex-col gap-4 sm:gap-5
        "
      >
        {/* ======================================
            COMPACT HERO
        ====================================== */}

        <section
          className="
            relative overflow-hidden
            rounded-[22px]
            border border-slate-200/80
            bg-white/90
            shadow-[0_14px_38px_rgba(15,23,42,0.07)]
            backdrop-blur-2xl
            dark:border-cyan-400/15
            dark:bg-[#0b1426]/90
            dark:shadow-[0_18px_45px_rgba(0,0,0,0.22)]
          "
        >
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute inset-0
            "
            style={{
              background:
                "radial-gradient(circle at 0% 0%,rgba(34,211,238,0.12),transparent 40%),radial-gradient(circle at 100% 100%,rgba(139,92,246,0.12),transparent 40%)",
            }}
          />

          {/* HERO CONTENT */}

          <div
            className="
              relative flex flex-wrap
              items-center justify-between
              gap-3 px-4 py-4 sm:px-6
            "
          >
            <div
              className="
                flex min-w-0
                items-center gap-3
              "
            >
              <div
                className="
                  relative grid h-12 w-12
                  shrink-0 place-items-center
                  rounded-2xl border
                  border-violet-400/30
                  bg-violet-500/10
                  text-violet-700
                  dark:text-violet-300
                "
              >
                <Gem
                  size={25}
                  strokeWidth={1.6}
                  aria-hidden="true"
                />

                <span
                  className="
                    absolute -right-1 -top-1
                    h-2.5 w-2.5
                    rounded-full border-2
                    border-white bg-amber-400
                    dark:border-[#101827]
                  "
                />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    flex items-center gap-1.5
                    font-mono text-[9px]
                    font-bold tracking-[0.14em]
                    text-violet-700
                    dark:text-violet-300
                  "
                >
                  <Sparkles
                    size={12}
                    aria-hidden="true"
                  />

                  FSOCIETY / PRIVATE VAULT
                </p>

                <h1
                  className="
                    mt-1 font-['Space_Grotesk']
                    text-2xl font-black
                    tracking-[-0.045em]
                    text-slate-900
                    dark:text-white
                    sm:text-[30px]
                  "
                >
                  My{" "}

                  <span
                    className="
                      bg-gradient-to-r
                      from-cyan-600
                      via-blue-600
                      to-violet-600
                      bg-clip-text text-transparent
                      dark:from-cyan-300
                      dark:via-blue-400
                      dark:to-violet-300
                    "
                  >
                    Frames
                  </span>
                </h1>

                <p
                  className="
                    mt-1 text-[11px]
                    text-slate-600
                    dark:text-slate-300
                    sm:text-xs
                  "
                >
                  Kolleksiyangni boshqar.
                  Bir vaqtda faqat bitta ramka
                  faol bo‘ladi.
                </p>
              </div>
            </div>

            {/* HERO ACTIONS */}

            <div
              className="
                flex shrink-0 flex-wrap
                items-center gap-2
              "
            >
              <Link
                to="/frames/shop"
                className="
                  inline-flex min-h-9
                  items-center justify-center
                  gap-1.5 rounded-xl
                  border border-cyan-400/30
                  bg-cyan-500/10
                  px-3 text-[11px] font-bold
                  text-cyan-700 transition
                  hover:bg-cyan-500/20
                  dark:text-cyan-200
                "
              >
                <ShoppingBag
                  size={15}
                  aria-hidden="true"
                />

                Frame Shop

                <ArrowRight
                  size={13}
                  aria-hidden="true"
                />
              </Link>

              <button
                type="button"
                onClick={refreshInventory}
                disabled={
                  inventory?.loading ||
                  mutation?.loading
                }
                aria-label="Kolleksiyani yangilash"
                title="Yangilash"
                className="
                  inline-flex h-9 w-9
                  items-center justify-center
                  rounded-xl border
                  border-slate-200
                  bg-white/80 text-slate-600
                  transition hover:border-cyan-400
                  disabled:opacity-50
                  dark:border-white/10
                  dark:bg-white/5
                  dark:text-slate-300
                "
              >
                <RefreshCw
                  size={15}
                  className={
                    inventory?.loading
                      ? "animate-spin motion-reduce:animate-none"
                      : ""
                  }
                />
              </button>
            </div>
          </div>

          {/* INLINE STATS */}

          <div
            className="
              relative grid grid-cols-2
              gap-2 border-t
              border-slate-200/70
              px-4 py-3
              dark:border-white/[0.08]
              sm:px-6 lg:grid-cols-4
            "
          >
            <StatChip
              label="Mening ramkalarim"
              value={
                inventory?.loaded
                  ? formatNumber(totalOwned)
                  : "—"
              }
              Icon={Layers3}
              tone="cyan"
            />

            <StatChip
              label="Faol ramka"
              value={
                !stats?.loaded &&
                !inventory?.loaded
                  ? "—"
                  : hasEquippedFrame
                    ? "01"
                    : "00"
              }
              Icon={WandSparkles}
              tone="emerald"
            />

            <StatChip
              label="Sarflangan FCoin"
              value={spent}
              Icon={Coins}
              tone="amber"
            />

            <StatChip
              label="Sahifadagi mukofotlar"
              value={
                inventory?.loaded
                  ? formatNumber(pageRewards)
                  : "—"
              }
              Icon={Crown}
              tone="violet"
            />
          </div>

          <div
            aria-hidden="true"
            className="
              absolute inset-x-0 bottom-0
              h-[2px]
              bg-gradient-to-r
              from-cyan-400/65
              via-violet-500/55
              to-transparent
            "
          />
        </section>

        {/* ======================================
            INVENTORY COLLECTION
        ====================================== */}

        <section
          aria-labelledby="inventory-title"
          className="
            min-w-0 scroll-mt-24
          "
        >
          {/* COLLECTION HEADING */}

          <div
            className="
              mb-3 flex flex-wrap
              items-center justify-between
              gap-3
            "
          >
            <div className="min-w-0">
              <h2
                id="inventory-title"
                className="
                  font-['Space_Grotesk']
                  text-lg font-extrabold
                  tracking-tight
                  sm:text-xl
                "
              >
                Mening{" "}

                <span
                  className="
                    text-cyan-700
                    dark:text-cyan-300
                  "
                >
                  kolleksiyam
                </span>
              </h2>

              <p
                className="
                  mt-0.5 text-[11px]
                  text-slate-500
                  dark:text-slate-400
                "
              >
                O‘zingga mos ramkani tanla
                va avatar uchun o‘rnat.
              </p>
            </div>

            <span
              className="
                rounded-full border
                border-cyan-400/20
                bg-cyan-400/10
                px-2.5 py-1
                font-mono text-[10px]
                font-bold
                text-cyan-700
                dark:text-cyan-300
              "
            >
              {inventory?.loaded
                ? `${formatNumber(totalOwned)} OWNED`
                : "INVENTORY"}
            </span>
          </div>

          {/* ====================================
              COMPACT FILTERS
          ==================================== */}

          <div
            className="
              mb-3 rounded-[18px]
              border border-slate-200/80
              bg-white/90 p-3
              shadow-[0_8px_25px_rgba(15,23,42,0.05)]
              backdrop-blur-xl
              dark:border-white/10
              dark:bg-[#0c1527]/90
            "
          >
            <div
              className="
                flex flex-col
                justify-between gap-3
                md:flex-row md:items-center
              "
            >
              {/* STATUS FILTERS */}

              <div
                className="
                  flex flex-wrap items-center
                  gap-1.5
                "
              >
                {STATUS_FILTERS.map(
                  ({
                    value,
                    label,
                    Icon,
                  }) => {
                    const active =
                      statusFilter === value;

                    return (
                      <button
                        type="button"
                        key={value}
                        aria-pressed={active}
                        onClick={() =>
                          setStatusFilter(value)
                        }
                        className={`
                          inline-flex min-h-9
                          items-center gap-1.5
                          rounded-lg border
                          px-2.5 py-1.5
                          text-[11px] font-bold
                          transition
                          focus-visible:outline-2
                          focus-visible:outline-cyan-500

                          ${
                            active
                              ? `
                                border-cyan-500
                                bg-cyan-500 text-white
                                shadow-[0_4px_14px_rgba(6,182,212,0.16)]
                              `
                              : `
                                border-slate-200
                                bg-slate-50
                                text-slate-600
                                hover:border-cyan-300
                                dark:border-white/10
                                dark:bg-white/5
                                dark:text-slate-300
                              `
                          }
                        `}
                      >
                        <Icon
                          size={13}
                          aria-hidden="true"
                        />

                        {label}
                      </button>
                    );
                  }
                )}
              </div>

              {/* RARITY SELECT */}

              <div
                className="
                  flex min-w-0
                  items-center gap-2
                "
              >
                <label
                  htmlFor="my-frame-rarity"
                  className="
                    shrink-0 text-[11px]
                    font-medium text-slate-500
                    dark:text-slate-400
                  "
                >
                  Daraja:
                </label>

                <select
                  id="my-frame-rarity"
                  value={rarityFilter}
                  onChange={(event) =>
                    setRarityFilter(
                      event.target.value
                    )
                  }
                  className="
                    h-9 min-w-0 flex-1
                    rounded-xl border
                    border-slate-200
                    bg-slate-50 px-3
                    text-[11px] font-semibold
                    text-slate-700 outline-none
                    focus:border-cyan-400
                    dark:border-white/10
                    dark:bg-[#192238]
                    dark:text-slate-200
                    md:w-[175px] md:flex-none
                  "
                >
                  {RARITY_FILTERS.map(
                    (item) => (
                      <option
                        key={item.value}
                        value={item.value}
                      >
                        {item.label}
                      </option>
                    )
                  )}
                </select>

                {activeFilters && (
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter("all");
                      setRarityFilter("all");
                    }}
                    aria-label="Filtrlarni tozalash"
                    title="Tozalash"
                    className="
                      inline-flex h-9 w-9
                      shrink-0 items-center
                      justify-center rounded-lg
                      border border-slate-200
                      text-slate-500
                      hover:border-rose-300
                      hover:text-rose-600
                      dark:border-white/10
                    "
                  >
                    <X
                      size={15}
                      aria-hidden="true"
                    />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ====================================
              RESULT SUMMARY
          ==================================== */}

          <div
            className="
              mb-3 flex flex-wrap
              items-center justify-between
              gap-2 text-[11px]
              text-slate-500
              dark:text-slate-400
            "
          >
            <span>
              {inventory?.loading
                ? "Ramkalar yuklanmoqda..."
                : `${visibleItems.length} ta ramka ko‘rsatilmoqda`}
            </span>

            <span
              className="
                font-mono text-[10px]
              "
            >
              Filtrlar joriy sahifaga qo‘llanadi
              {showPagination
                ? ` · Sahifa ${page}`
                : ""}
            </span>
          </div>

          {/* ====================================
              ERROR STATE
          ==================================== */}

          {inventory?.error &&
            !inventory?.loading && (
              <div
                role="alert"
                className="
                  mb-4 flex flex-wrap
                  items-center justify-between
                  gap-3 rounded-2xl
                  border border-rose-300/60
                  bg-rose-50 p-4
                  text-sm text-rose-700
                  dark:border-rose-400/20
                  dark:bg-rose-500/10
                  dark:text-rose-300
                "
              >
                <span>
                  {String(inventory.error)}
                </span>

                <button
                  type="button"
                  onClick={refreshInventory}
                  className="
                    inline-flex items-center
                    gap-2 rounded-lg
                    border border-current/30
                    px-3 py-2 font-bold
                  "
                >
                  <RefreshCw size={14} />
                  Qayta urinish
                </button>
              </div>
            )}

          {/* ====================================
              LOADING SKELETONS
          ==================================== */}

          {(authLoading ||
            inventory?.loading) && (
            <div
              aria-busy="true"
              aria-label="Kolleksiya yuklanmoqda"
              className={
                getInventoryGridClass(6)
              }
            >
              {Array.from(
                { length: 6 },
                (_, index) => (
                  <div
                    key={index}
                    className="
                      min-w-0 h-full
                      xl:col-span-2
                    "
                  >
                    <InventorySkeleton />
                  </div>
                )
              )}
            </div>
          )}

          {/* ====================================
              FRAME INVENTORY CARDS
          ==================================== */}

          {!authLoading &&
            !inventory?.loading &&
            !inventory?.error &&
            visibleItems.length > 0 && (
              <motion.div
                layout={!reducedMotion}
                className={gridClass}
              >
                {visibleItems.map(
                  (ownership, index) => (
                    <div
                      key={
                        ownership?.id ??
                        getOwnedFrameId(
                          ownership
                        ) ??
                        index
                      }
                      className={
                        getInventoryCellClass(
                          visibleItems.length,
                          index
                        )
                      }
                    >
                      <FrameInventoryCard
                        ownership={ownership}
                        index={index}
                        isBusy={Boolean(
                          mutation?.loading ||
                          busyFrameId !== null
                        )}
                        busyFrameId={busyFrameId}
                        onEquip={handleEquip}
                        onUnequip={handleUnequip}
                      />
                    </div>
                  )
                )}
              </motion.div>
            )}

          {/* ====================================
              EMPTY INVENTORY
          ==================================== */}

          {!authLoading &&
            !inventory?.loading &&
            !inventory?.error &&
            inventory?.loaded &&
            totalOwned === 0 && (
              <div
                className="
                  rounded-[22px]
                  border border-dashed
                  border-slate-300
                  bg-white/80
                  px-5 py-11 text-center
                  dark:border-white/15
                  dark:bg-[#0d1526]/85
                "
              >
                <PackageOpen
                  size={30}
                  className="
                    mx-auto text-cyan-600
                    dark:text-cyan-300
                  "
                  aria-hidden="true"
                />

                <h3
                  className="
                    mt-3 text-base font-bold
                  "
                >
                  Kolleksiyang hozircha bo‘sh
                </h3>

                <p
                  className="
                    mx-auto mt-1.5
                    max-w-sm text-xs leading-6
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Frame Shop orqali birinchi
                  ramkangni xarid qil yoki
                  tadbir mukofotini qo‘lga kirit.
                </p>

                <Link
                  to="/frames/shop"
                  className="
                    mt-4 inline-flex
                    items-center gap-2
                    rounded-xl
                    bg-gradient-to-r
                    from-cyan-500 to-blue-600
                    px-4 py-2.5
                    text-xs font-bold text-white
                    hover:brightness-110
                  "
                >
                  <ShoppingBag size={15} />
                  Frame Shop
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}

          {/* ====================================
              FILTERED EMPTY STATE
          ==================================== */}

          {!authLoading &&
            !inventory?.loading &&
            !inventory?.error &&
            inventory?.loaded &&
            totalOwned > 0 &&
            visibleItems.length === 0 && (
              <div
                className="
                  rounded-[22px]
                  border border-dashed
                  border-slate-300
                  bg-white/80 px-5 py-10
                  text-center
                  dark:border-white/15
                  dark:bg-[#0d1526]/85
                "
              >
                <Gem
                  size={28}
                  className="
                    mx-auto text-violet-500
                    dark:text-violet-300
                  "
                  aria-hidden="true"
                />

                <h3
                  className="
                    mt-3 text-base font-bold
                  "
                >
                  Mos ramka topilmadi
                </h3>

                <p
                  className="
                    mt-1.5 text-xs
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Joriy sahifada tanlangan
                  filtrlarga mos ramka yo‘q.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter("all");
                    setRarityFilter("all");
                  }}
                  className="
                    mt-4 rounded-xl
                    bg-cyan-600 px-4 py-2.5
                    text-xs font-bold text-white
                    hover:bg-cyan-500
                  "
                >
                  Filtrlarni tozalash
                </button>
              </div>
            )}

          {/* ====================================
              SERVER PAGINATION
          ==================================== */}

          {showPagination && (
            <nav
              aria-label="Kolleksiya sahifalari"
              className="
                mt-6 flex items-center
                justify-center gap-3
              "
            >
              <button
                type="button"
                disabled={
                  !canPrevious ||
                  mutation?.loading
                }
                onClick={() =>
                  setPage((value) =>
                    Math.max(1, value - 1)
                  )
                }
                className="
                  inline-flex min-h-9
                  items-center gap-1
                  rounded-xl border
                  border-slate-200 bg-white
                  px-3 text-xs font-bold
                  text-slate-700
                  hover:border-cyan-400
                  disabled:opacity-40
                  dark:border-white/10
                  dark:bg-[#111827]
                  dark:text-slate-200
                "
              >
                <ChevronLeft size={15} />
                Oldingi
              </button>

              <span
                className="
                  inline-flex h-9 min-w-9
                  items-center justify-center
                  rounded-xl border
                  border-cyan-400/30
                  bg-cyan-400/10 px-3
                  text-xs font-bold
                  tabular-nums
                  text-cyan-700
                  dark:text-cyan-300
                "
              >
                {page}
              </span>

              <button
                type="button"
                disabled={
                  !canNext ||
                  mutation?.loading
                }
                onClick={() =>
                  setPage(
                    (value) => value + 1
                  )
                }
                className="
                  inline-flex min-h-9
                  items-center gap-1
                  rounded-xl border
                  border-slate-200 bg-white
                  px-3 text-xs font-bold
                  text-slate-700
                  hover:border-cyan-400
                  disabled:opacity-40
                  dark:border-white/10
                  dark:bg-[#111827]
                  dark:text-slate-200
                "
              >
                Keyingi
                <ChevronRight size={15} />
              </button>
            </nav>
          )}
        </section>

        {/* ======================================
            COMPACT FOOTER
        ====================================== */}

        <div
          className="
            flex flex-wrap items-center
            justify-between gap-2
            rounded-2xl border
            border-violet-300/20
            bg-white/65 px-4 py-3
            text-xs text-slate-600
            backdrop-blur-lg
            dark:border-violet-400/15
            dark:bg-[#11172b]/75
            dark:text-slate-300
          "
        >
          <span
            className="
              inline-flex items-center gap-2
            "
          >
            <Sparkles
              size={15}
              className="
                text-violet-600
                dark:text-violet-300
              "
            />

            Your code. Your identity.
          </span>

          <Link
            to="/frames/shop"
            className="
              inline-flex items-center
              gap-1 font-bold
              text-violet-700
              hover:underline
              dark:text-violet-300
            "
          >
            Yangi ramkalar
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </main>
  );
}
